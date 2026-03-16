import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon not showing up in React-Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapView = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'reports'));
      setReports(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Reported': return 'var(--clr-warning)';
      case 'In Progress': return 'var(--clr-info)';
      case 'Resolved': return 'var(--clr-success)';
      default: return 'var(--clr-text-muted)';
    }
  };

  const mapCenter = [33.8869, 9.5375];

  return (
    <div className="view container">
      <header style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Interactive Map</h2>
        <p style={{ color: 'var(--clr-text-muted)' }}>Visualize reported problems across the country.</p>
      </header>
      
      <div className="card-premium" style={{ 
        padding: '0.5rem', 
        height: '650px', 
        position: 'relative', 
        overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)'
      }}>
        {loading && (
          <div style={{ 
            position: 'absolute', 
            inset: 0, 
            zIndex: 10, 
            backgroundColor: 'rgba(255,255,255,0.8)', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            backdropFilter: 'blur(4px)'
          }}>
            <div style={{ width: '40px', height: '40px', border: '4px solid #eee', borderTopColor: 'var(--clr-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          </div>
        )}
        
        <MapContainer 
          center={mapCenter} 
          zoom={6} 
          scrollWheelZoom={true} 
          style={{ height: '100%', width: '100%', borderRadius: 'calc(var(--radius-lg) - 0.5rem)' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {reports.map((report) => (
            report.location && report.location.lat && report.location.lng ? (
              <Marker key={report.id} position={[report.location.lat, report.location.lng]}>
                <Popup className="premium-popup">
                  <div style={{ padding: '0.2rem' }}>
                    <div style={{ 
                      fontSize: '0.7rem', 
                      fontWeight: 800, 
                      color: getStatusColor(report.status), 
                      textTransform: 'uppercase', 
                      marginBottom: '0.4rem' 
                    }}>
                      {report.status}
                    </div>
                    <strong style={{ fontSize: '1rem', display: 'block', marginBottom: '0.4rem' }}>{report.title}</strong>
                    <div style={{ fontSize: '0.85rem', color: 'var(--clr-text-muted)', marginBottom: '0.6rem' }}>
                      📍 {report.city}, {report.neighborhood}
                    </div>
                    <div style={{ fontSize: '0.8rem', fontStyle: 'italic', marginBottom: '0.8rem' }}>
                      "{report.description?.substring(0, 60)}..."
                    </div>
                    <button className="btn btn-primary" style={{ width: '100%', padding: '0.4rem', fontSize: '0.75rem' }}>
                      View Full Details
                    </button>
                  </div>
                </Popup>
              </Marker>
            ) : null
          ))}
        </MapContainer>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .premium-popup .leaflet-popup-content-wrapper {
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--clr-border);
        }
        .premium-popup .leaflet-popup-tip {
          box-shadow: none;
        }
      `}</style>
    </div>
  );
};

export default MapView;

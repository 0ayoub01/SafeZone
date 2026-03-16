import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

const Browse = () => {
  const [reports, setReports] = useState([]);
  const [cityFilter, setCityFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const tunisCities = [
    "Ariana", "Béja", "Ben Arous", "Bizerte", "Gabès", "Gafsa", "Jendouba", 
    "Kairouan", "Kasserine", "Kébili", "Kef", "Mahdia", "Manouba", "Médenine", 
    "Monastir", "Nabeul", "Sfax", "Sidi Bouzid", "Siliana", "Sousse", 
    "Tataouine", "Tozeur", "Tunis", "Zaghouan"
  ];

  const clearFilter = () => setCityFilter('');

  useEffect(() => {
    fetchReports();
  }, [cityFilter]);

  const fetchReports = async () => {
    setLoading(true);
    setError('');
    setReports([]); // Clear results while loading
    try {
      let q;
      if (cityFilter) {
        // NOTE: This query requires a composite index in Firestore (city ASC, createdAt DESC)
        q = query(collection(db, 'reports'), where('city', '==', cityFilter), orderBy('createdAt', 'desc'));
      } else {
        q = query(collection(db, 'reports'), orderBy('createdAt', 'desc'));
      }
      
      const snapshot = await getDocs(q);
      setReports(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error(err);
      if (err.code === 'failed-precondition') {
        setError('This filter requires a database index. Please check the console for the link to create it.');
      } else {
        setError('Failed to fetch reports. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Reported': return { bg: 'rgba(245, 158, 11, 0.1)', color: 'var(--clr-warning)', label: 'New' };
      case 'In Progress': return { bg: 'rgba(59, 130, 246, 0.1)', color: 'var(--clr-info)', label: 'Fixing' };
      case 'Resolved': return { bg: 'rgba(16, 185, 129, 0.1)', color: 'var(--clr-success)', label: 'Done' };
      default: return { bg: '#eee', color: '#666', label: status };
    }
  };

  return (
    <div className="view container">
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Community Reports</h2>
        <p style={{ color: 'var(--clr-text-muted)', maxWidth: '600px', margin: '0 auto 2rem' }}>
          Explore issues reported by citizens across Tunisia. Filter by city to see what's happening in your area.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <select 
            className="form-control" 
            style={{ maxWidth: '250px', height: '52px' }}
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
          >
            <option value="">All Cities</option>
            {tunisCities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button className="btn btn-primary" onClick={fetchReports} style={{ height: '52px' }}>
            🔄 Refresh data
          </button>
        </div>
      </header>

      {error && (
        <div className="card-premium" style={{ 
          backgroundColor: 'rgba(239, 68, 68, 0.1)', 
          color: 'var(--clr-error)', 
          padding: '1.5rem', 
          borderRadius: 'var(--radius-md)', 
          marginBottom: '2rem',
          textAlign: 'center',
          border: '1px solid rgba(239, 68, 68, 0.2)'
        }}>
          <p style={{ fontWeight: '700', marginBottom: '0.5rem' }}>⚠️ Filter Error</p>
          <p style={{ fontSize: '0.9rem' }}>{error}</p>
          {error.includes('index') && (
            <p style={{ fontSize: '0.8rem', marginTop: '1rem', opacity: 0.8 }}>
              Open your browser's console (F12) to find the direct link to create the required Firebase index.
            </p>
          )}
          <button className="btn btn-outline" style={{ marginTop: '1.5rem', fontSize: '0.8rem' }} onClick={clearFilter}>
            Clear Filter
          </button>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem' }}>
          <div style={{ width: '40px', height: '40px', border: '4px solid #eee', borderTopColor: 'var(--clr-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
          <p style={{ marginTop: '1.5rem', color: 'var(--clr-text-muted)' }}>Fetching latest reports...</p>
        </div>
      ) : reports.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem', backgroundColor: 'var(--clr-white)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--clr-border)' }}>
          <h3>No reports found</h3>
          <p style={{ color: 'var(--clr-text-muted)' }}>Try changing the city filter or check back later.</p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
          gap: '2rem' 
        }}>
          {reports.map((report) => {
            const status = getStatusStyle(report.status);
            return (
              <div key={report.id} className="card-premium" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    fontWeight: 800, 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.05em',
                    backgroundColor: status.bg,
                    color: status.color,
                    padding: '0.4rem 0.8rem',
                    borderRadius: 'var(--radius-sm)'
                  }}>
                    {status.label}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--clr-text-muted)' }}>
                    {report.createdAt?.toDate ? report.createdAt.toDate().toLocaleDateString() : 'Just now'}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.8rem', minHeight: '3rem' }}>{report.title}</h3>
                
                <div style={{ marginTop: 'auto' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--clr-text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '1.1rem' }}>📍</span>
                    <span>{report.city}, {report.neighborhood}</span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--clr-text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                    <span style={{ fontSize: '1.1rem' }}>📂</span>
                    <span>{report.category}</span>
                  </div>

                  <p style={{ 
                    fontSize: '0.95rem', 
                    color: 'var(--clr-text-main)', 
                    display: '-webkit-box', 
                    WebkitLineClamp: 3, 
                    WebkitBoxOrient: 'vertical', 
                    overflow: 'hidden',
                    marginBottom: '1.5rem',
                    lineHeight: '1.5'
                  }}>
                    {report.description}
                  </p>

                  <button className="btn btn-outline" style={{ width: '100%', fontSize: '0.85rem', padding: '0.6rem' }}>
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Browse;

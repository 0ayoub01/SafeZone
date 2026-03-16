import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Profile = () => {
  const { currentUser, logout, isAdmin, isModerator } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) setProfile(userDoc.data());

        const q = query(
          collection(db, 'reports'),
          where('userId', '==', currentUser.uid),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        setReports(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error('Error fetching profile:', err);
        if (err.code === 'failed-precondition') {
          setError('Profile reports require a database index. Please check the console (F12) for the creation link.');
        } else {
          setError('Failed to load your reports.');
        }
      } finally {
        setLoading(false);
      }
    };
    if (currentUser) fetchData();
  }, [currentUser]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Reported': return 'var(--clr-warning)';
      case 'In Progress': return 'var(--clr-info)';
      case 'Resolved': return 'var(--clr-success)';
      default: return 'var(--clr-text-muted)';
    }
  };

  const initials = (profile?.fullName || currentUser.email).charAt(0).toUpperCase();

  return (
    <div className="view container">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '3rem', alignItems: 'start' }}>
        
        {/* Profile Sidebar */}
        <div className="card-premium" style={{ position: 'sticky', top: '7rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ 
              width: '100px', 
              height: '100px', 
              backgroundColor: 'var(--clr-primary)', 
              color: 'white', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '2.5rem', 
              fontWeight: '800',
              marginBottom: '1.5rem',
              boxShadow: '0 8px 24px var(--clr-primary-glow)'
            }}>
              {initials}
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>{profile?.fullName || 'Citizen'}</h3>
            <span style={{ 
              backgroundColor: isAdmin ? 'rgba(231,0,19,0.1)' : isModerator ? 'rgba(59,130,246,0.1)' : 'rgba(100,116,139,0.1)', 
              color: isAdmin ? 'var(--clr-primary)' : isModerator ? 'var(--clr-info)' : 'var(--clr-text-muted)',
              padding: '0.3rem 0.8rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
              fontWeight: '800',
              textTransform: 'uppercase'
            }}>
              {profile?.role === 'admin' ? 'Administrator' : profile?.role === 'moderator' ? 'Moderator' : 'Verified Citizen'}
            </span>
          </div>

          <div style={{ borderTop: '1px solid var(--clr-border)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {[
              { label: 'Email', value: currentUser.email, icon: '📧' },
              { label: 'Phone', value: profile?.phone || 'Not provided', icon: '📱' },
              { label: 'City', value: profile?.city || 'Tunisia', icon: '📍' },
              { label: 'Stats', value: `${reports.length} Reports`, icon: '📊' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--clr-text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>{item.icon}</span> {item.label}
                </span>
                <span style={{ fontWeight: '600', textAlign: 'right' }}>{item.value}</span>
              </div>
            ))}
          </div>

          <button onClick={handleLogout} className="btn btn-outline" style={{ width: '100%', marginTop: '2.5rem', color: 'var(--clr-error)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
            Sign Out
          </button>
        </div>

        {/* Main Content */}
        <div style={{ animation: 'slideUp 0.8s ease' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2rem' }}>Your Activity</h2>
            <Link to="/report" className="btn btn-primary" style={{ padding: '0.6rem 1.2rem' }}>
              + New Report
            </Link>
          </div>

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
              <p style={{ fontWeight: '700', marginBottom: '0.5rem' }}>⚠️ Data Sync Issue</p>
              <p style={{ fontSize: '0.9rem' }}>{error}</p>
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: 'center', padding: '5rem' }}>
              <div style={{ width: '30px', height: '30px', border: '3px solid #eee', borderTopColor: 'var(--clr-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
            </div>
          ) : reports.length === 0 ? (
            <div className="card-premium" style={{ textAlign: 'center', padding: '4rem', borderStyle: 'dashed' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🍃</div>
              <h3>No reports yet</h3>
              <p style={{ color: 'var(--clr-text-muted)', marginBottom: '1.5rem' }}>Start helping by reporting issues you see in your neighborhood.</p>
              <Link to="/report" className="btn btn-primary">Report My First Issue</Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {reports.map(report => (
                <div key={report.id} className="card-premium" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem' }}>
                  <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <div style={{ 
                      width: '12px', 
                      height: '12px', 
                      borderRadius: '50%', 
                      backgroundColor: getStatusColor(report.status),
                      boxShadow: `0 0 10px ${getStatusColor(report.status)}44`
                    }} />
                    <div>
                      <h4 style={{ marginBottom: '0.2rem', fontSize: '1.1rem' }}>{report.title}</h4>
                      <p style={{ color: 'var(--clr-text-muted)', fontSize: '0.85rem' }}>
                        {report.city} &bull; {report.category}
                      </p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      fontWeight: '800', 
                      color: getStatusColor(report.status),
                      textTransform: 'uppercase'
                    }}>
                      {report.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Profile;

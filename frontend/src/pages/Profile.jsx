import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  MapPin, 
  Phone, 
  BarChart3, 
  LogOut, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

const Profile = () => {
  const { currentUser, logout, isAdmin, canModerate } = useAuth();
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

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Reported': return 'badge-reported';
      case 'In Progress': return 'badge-progress';
      case 'Resolved': return 'badge-resolved';
      case 'Rejected': return 'badge-rejected';
      case 'Under Review': return 'badge-review';
      default: return 'badge-other';
    }
  };

  const initials = (profile?.fullName || currentUser.email).charAt(0).toUpperCase();

  return (
    <div className="view">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '3rem', alignItems: 'start' }}>
          
          {/* Profile Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card-premium" 
            style={{ position: 'sticky', top: '7rem', padding: '2.5rem' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '2.5rem' }}>
              <div className="avatar avatar-xl" style={{ boxShadow: 'var(--shadow-glow)', marginBottom: '1.5rem' }}>
                {initials}
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{profile?.fullName || 'Verified Citizen'}</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                {isAdmin && <span className="badge badge-reported" style={{ fontSize: '0.65rem' }}>Admin</span>}
                {canModerate && <span className="badge badge-progress" style={{ fontSize: '0.65rem' }}>Moderator</span>}
                <span className="badge badge-other" style={{ fontSize: '0.65rem' }}>Verified</span>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--clr-border)', paddingTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ color: 'var(--clr-primary)' }}><Mail size={18} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--clr-text-muted)', fontWeight: 600 }}>Email</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, wordBreak: 'break-all' }}>{currentUser.email}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ color: 'var(--clr-primary)' }}><Phone size={18} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--clr-text-muted)', fontWeight: 600 }}>Phone</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{profile?.phone || 'Not provided'}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ color: 'var(--clr-primary)' }}><MapPin size={18} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--clr-text-muted)', fontWeight: 600 }}>Location</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{profile?.city || 'Tunisia'}</div>
                </div>
              </div>
            </div>

            <button onClick={handleLogout} className="btn btn-outline" style={{ width: '100%', marginTop: '3rem', gap: '0.6rem', color: 'var(--clr-error)', borderColor: 'var(--clr-error-bg)' }}>
              <LogOut size={16} />
              Sign Out
            </button>
          </motion.div>

          {/* Main Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
              <div>
                <h2 style={{ fontSize: '2.2rem', marginBottom: '0.25rem' }}>Activity Dashboard</h2>
                <p style={{ color: 'var(--clr-text-light)' }}>Manage your reports and track their progress.</p>
              </div>
              <Link to="/report" className="btn btn-primary" style={{ gap: '0.5rem' }}>
                <Plus size={18} />
                New Report
              </Link>
            </div>

            {/* Stats Summary Bar */}
            <div className="grid-3" style={{ marginBottom: '3rem' }}>
              <div className="stat-card" style={{ padding: '1.5rem', textAlign: 'left' }}>
                <div className="stat-value" style={{ fontSize: '2rem' }}>{reports.length}</div>
                <div className="stat-label">Total Reports</div>
              </div>
              <div className="stat-card" style={{ padding: '1.5rem', textAlign: 'left' }}>
                <div className="stat-value" style={{ fontSize: '2rem', color: 'var(--clr-success)' }}>
                  {reports.filter(r => r.status === 'Resolved').length}
                </div>
                <div className="stat-label">Solved Issues</div>
              </div>
              <div className="stat-card" style={{ padding: '1.5rem', textAlign: 'left' }}>
                <div className="stat-value" style={{ fontSize: '2rem', color: 'var(--clr-warning)' }}>
                   {reports.filter(r => r.status === 'In Progress' || r.status === 'Under Review').length}
                </div>
                <div className="stat-label">Pending Action</div>
              </div>
            </div>

            <div className="divider" style={{ margin: '0 0 2.5rem 0' }}></div>

            {error && (
              <div className="alert alert-error" style={{ marginBottom: '2rem' }}>
                <ShieldAlert size={20} />
                <span>{error}</span>
              </div>
            )}

            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[1, 2, 3].map(i => (
                  <div key={i} className="skeleton" style={{ height: '100px', width: '100%' }}></div>
                ))}
              </div>
            ) : reports.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '5rem 2rem', borderStyle: 'dashed' }}>
                <div style={{ 
                  width: '64px', 
                  height: '64px', 
                  borderRadius: '50%', 
                  backgroundColor: 'var(--clr-bg-raised)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem'
                }}>
                  <FileText size={32} color="var(--clr-text-muted)" />
                </div>
                <h3 style={{ marginBottom: '0.75rem' }}>No reports submitted yet</h3>
                <p style={{ color: 'var(--clr-text-muted)', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem' }}>
                  Help us make Tunisia better! Report issues like potholes, 
                  broken lights, or sanitation problems in your area.
                </p>
                <Link to="/report" className="btn btn-primary btn-lg">
                  Submit My First Report
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {reports.map((report, i) => (
                  <motion.div 
                    key={report.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.2 }}
                    className="card-premium" 
                    style={{ padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                      <div style={{ 
                        width: '48px', 
                        height: '48px', 
                        borderRadius: '12px', 
                        backgroundColor: 'var(--clr-bg-raised)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <FileText size={20} color="var(--clr-text-muted)" />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{report.title}</h4>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--clr-text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <MapPin size={12} /> {report.city} &bull; {report.neighborhood}
                          </span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--clr-text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                             {report.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                      <span className={`badge ${getStatusBadgeClass(report.status)}`}>
                        {report.status}
                      </span>
                      <div style={{ color: 'var(--clr-text-muted)' }}><ChevronRight size={20} /></div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

import { useState, useEffect } from 'react';
import { collection, query, getDocs, doc, updateDoc, orderBy, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  RefreshCw,
  Search,
  Filter,
  BarChart3,
  FileText,
  User,
  Zap,
  MapPin
} from 'lucide-react';

const Authorities = () => {
  const { currentUser } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'reports'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      setReports(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (reportId, newStatus) => {
    setUpdatingId(reportId);
    try {
      const reportRef = doc(db, 'reports', reportId);
      await updateDoc(reportRef, { status: newStatus });
      setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: newStatus } : r));
    } catch (err) {
      console.error("Update status error:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredReports = reports.filter(r => statusFilter === 'All' || r.status === statusFilter);

  const stats = {
    total: reports.length,
    new: reports.filter(r => r.status === 'Reported').length,
    active: reports.filter(r => r.status === 'In Progress').length,
    solved: reports.filter(r => r.status === 'Resolved').length
  };

  if (!currentUser) return <div className="view container">Please log in as an authority.</div>;

  return (
    <div className="view">
      <div className="container">
        <header style={{ marginBottom: '3rem' }}>
          <div className="section-label">Municipal Backoffice</div>
          <h2 className="section-title">Authorities Dashboard</h2>
          <p className="section-subtitle">Manage reported issues, evaluate evidence, and update resolution status.</p>
        </header>

        {/* Stats Grid */}
        <div className="grid-4" style={{ marginBottom: '3rem' }}>
          <div className="card-premium" style={{ borderLeft: '4px solid var(--clr-primary)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--clr-text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Total Reports</div>
            <div style={{ fontSize: '2rem', fontWeight: 900 }}>{stats.total}</div>
          </div>
          <div className="card-premium" style={{ borderLeft: '4px solid var(--clr-warning)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--clr-text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Pending New</div>
            <div style={{ fontSize: '2rem', fontWeight: 900 }}>{stats.new}</div>
          </div>
          <div className="card-premium" style={{ borderLeft: '4px solid var(--clr-info)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--clr-text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>In Progress</div>
            <div style={{ fontSize: '2rem', fontWeight: 900 }}>{stats.active}</div>
          </div>
          <div className="card-premium" style={{ borderLeft: '4px solid var(--clr-success)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--clr-text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Resolved</div>
            <div style={{ fontSize: '2rem', fontWeight: 900 }}>{stats.solved}</div>
          </div>
        </div>

        <div className="card-premium" style={{ padding: '0' }}>
          <div style={{ padding: '2rem', borderBottom: '1px solid var(--clr-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <FileText size={20} color="var(--clr-primary)" /> Issue Backlog
            </h3>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <select 
                className="form-control" 
                style={{ width: '200px' }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Reported">Reported</option>
                <option value="Under Review">Under Review</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Rejected">Rejected</option>
              </select>
              <button className="btn btn-outline" onClick={fetchReports}><RefreshCw size={18} /></button>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: 'var(--clr-bg-raised)', borderBottom: '1px solid var(--clr-border)' }}>
                <tr>
                  <th style={{ textAlign: 'left', padding: '1.25rem 2rem', fontSize: '0.75rem', color: 'var(--clr-text-muted)', textTransform: 'uppercase' }}>Report</th>
                  <th style={{ textAlign: 'left', padding: '1.25rem 2rem', fontSize: '0.75rem', color: 'var(--clr-text-muted)', textTransform: 'uppercase' }}>Category</th>
                  <th style={{ textAlign: 'left', padding: '1.25rem 2rem', fontSize: '0.75rem', color: 'var(--clr-text-muted)', textTransform: 'uppercase' }}>Location</th>
                  <th style={{ textAlign: 'left', padding: '1.25rem 2rem', fontSize: '0.75rem', color: 'var(--clr-text-muted)', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ textAlign: 'right', padding: '1.25rem 2rem', fontSize: '0.75rem', color: 'var(--clr-text-muted)', textTransform: 'uppercase' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" style={{ padding: '4rem', textAlign: 'center' }}>
                      <RefreshCw size={32} className="spinner" color="var(--clr-primary)" />
                    </td>
                  </tr>
                ) : filteredReports.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ padding: '4rem', textAlign: 'center', color: 'var(--clr-text-muted)' }}>No reports match your search criteria.</td>
                  </tr>
                ) : (
                  filteredReports.map(report => (
                    <tr key={report.id} style={{ borderBottom: '1px solid var(--clr-border)', transition: 'var(--trans-sm)' }}>
                      <td style={{ padding: '1.25rem 2rem' }}>
                        <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>{report.title}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--clr-text-muted)' }}>#{report.id.substring(0, 8)}</div>
                      </td>
                      <td style={{ padding: '1.25rem 2rem' }}>
                        <span className="badge" style={{ backgroundColor: 'var(--clr-bg-raised)', color: 'var(--clr-primary)', border: '1px solid var(--clr-border)' }}>{report.category}</span>
                      </td>
                      <td style={{ padding: '1.25rem 2rem' }}>
                        <div style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <MapPin size={14} color="var(--clr-primary)" /> {report.city}
                        </div>
                      </td>
                      <td style={{ padding: '1.25rem 2rem' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: report.status === 'Resolved' ? 'var(--clr-success)' : report.status === 'In Progress' ? 'var(--clr-info)' : 'var(--clr-warning)' }} />
                            {report.status}
                         </div>
                      </td>
                      <td style={{ padding: '1.25rem 2rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <button 
                            className="btn btn-outline btn-sm"
                            disabled={updatingId === report.id}
                            onClick={() => updateStatus(report.id, 'Under Review')}
                          >Review</button>
                          <button 
                            className="btn btn-outline btn-sm"
                            style={{ color: 'var(--clr-info)', borderColor: 'var(--clr-info)' }}
                            disabled={updatingId === report.id}
                            onClick={() => updateStatus(report.id, 'In Progress')}
                          >Work</button>
                          <button 
                            className="btn btn-primary btn-sm"
                            style={{ backgroundColor: 'var(--clr-success)', borderColor: 'var(--clr-success)' }}
                            disabled={updatingId === report.id}
                            onClick={() => updateStatus(report.id, 'Resolved')}
                          >Solve</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Authorities;

import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';

const Moderator = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'reports'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      setReports(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    } catch (err) {
      console.error("Error fetching reports:", err);
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, 'reports', id), { status: newStatus });
      setReports(reports.map(r => r.id === id ? { ...r, status: newStatus } : r));
    } catch (err) {
      console.error('Error updating status', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this report permanently?')) {
      try {
        await deleteDoc(doc(db, 'reports', id));
        setReports(reports.filter(r => r.id !== id));
      } catch (err) {
        console.error('Error deleting report', err);
      }
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

  return (
    <div className="view container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
        <div>
          <h2 style={{ fontSize: '2.4rem', marginBottom: '0.5rem' }}>Community Moderation</h2>
          <p style={{ color: 'var(--clr-text-muted)' }}>Monitor and resolve community issues efficiently.</p>
        </div>
        <div className="card-premium" style={{ padding: '0.8rem 1.5rem', display: 'flex', gap: '2rem' }}>
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--clr-text-muted)', textTransform: 'uppercase' }}>Total Issues</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{reports.length}</div>
          </div>
          <div style={{ width: '1px', backgroundColor: 'var(--clr-border)' }}></div>
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--clr-text-muted)', textTransform: 'uppercase' }}>Pending</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--clr-warning)' }}>
              {reports.filter(r => r.status === 'Reported').length}
            </div>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem' }}>
          <div style={{ width: '40px', height: '40px', border: '4px solid #eee', borderTopColor: 'var(--clr-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
        </div>
      ) : (
        <div className="card-premium" style={{ padding: '0', overflow: 'hidden' }}>
          {reports.length === 0 ? (
            <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--clr-text-muted)' }}>
              <p>No reports in the system.</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ backgroundColor: 'rgba(0,0,0,0.02)', borderBottom: '1px solid var(--clr-border)' }}>
                <tr>
                  <th style={{ padding: '1.2rem 2rem', fontSize: '0.8rem', fontWeight: 800, color: 'var(--clr-text-muted)', textTransform: 'uppercase' }}>Issue Details</th>
                  <th style={{ padding: '1.2rem 2rem', fontSize: '0.8rem', fontWeight: 800, color: 'var(--clr-text-muted)', textTransform: 'uppercase' }}>Location</th>
                  <th style={{ padding: '1.2rem 2rem', fontSize: '0.8rem', fontWeight: 800, color: 'var(--clr-text-muted)', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '1.2rem 2rem', fontSize: '0.8rem', fontWeight: 800, color: 'var(--clr-text-muted)', textTransform: 'uppercase' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report, idx) => (
                  <tr key={report.id} style={{ borderBottom: idx === reports.length - 1 ? 'none' : '1px solid var(--clr-border)', transition: 'background 0.2s' }}>
                    <td style={{ padding: '1.5rem 2rem' }}>
                      <div style={{ fontWeight: 700, marginBottom: '0.2rem' }}>{report.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--clr-text-muted)' }}>
                        {report.createdAt?.toDate ? report.createdAt.toDate().toLocaleDateString() : 'Just now'} &bull; {report.category}
                      </div>
                    </td>
                    <td style={{ padding: '1.5rem 2rem', fontSize: '0.9rem' }}>
                      {report.city}<br/>
                      <span style={{ color: 'var(--clr-text-muted)', fontSize: '0.8rem' }}>{report.neighborhood}</span>
                    </td>
                    <td style={{ padding: '1.5rem 2rem' }}>
                      <select 
                        className="form-control" 
                        style={{ 
                          width: 'auto', 
                          padding: '0.5rem 1rem', 
                          fontSize: '0.85rem', 
                          fontWeight: 700,
                          backgroundColor: 'rgba(0,0,0,0.03)',
                          border: 'none',
                          color: getStatusColor(report.status)
                        }}
                        value={report.status}
                        onChange={(e) => handleStatusChange(report.id, e.target.value)}
                      >
                        <option value="Reported">🔴 Reported</option>
                        <option value="In Progress">🟡 In Progress</option>
                        <option value="Resolved">🟢 Resolved</option>
                      </select>
                    </td>
                    <td style={{ padding: '1.5rem 2rem' }}>
                      <button 
                        className="btn" 
                        style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--clr-error)' }}
                        onClick={() => handleDelete(report.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        tr:hover { background-color: rgba(231, 0, 19, 0.01); }
      `}</style>
    </div>
  );
};

export default Moderator;

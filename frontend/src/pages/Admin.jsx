import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      setUsers(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    } catch (err) {
      console.error("Error fetching users:", err);
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole });
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      console.error('Error updating user role', err);
    }
  };

  return (
    <div className="view container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
        <div>
          <h2 style={{ fontSize: '2.4rem', marginBottom: '0.5rem' }}>User Administration</h2>
          <p style={{ color: 'var(--clr-text-muted)' }}>Manage community roles and citizen permissions.</p>
        </div>
        <div className="card-premium" style={{ padding: '0.8rem 1.5rem', display: 'flex', gap: '2rem' }}>
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--clr-text-muted)', textTransform: 'uppercase' }}>Total Citizens</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{users.length}</div>
          </div>
          <div style={{ width: '1px', backgroundColor: 'var(--clr-border)' }}></div>
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--clr-text-muted)', textTransform: 'uppercase' }}>Moderators</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--clr-info)' }}>
              {users.filter(u => u.role === 'moderator').length}
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
          {users.length === 0 ? (
            <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--clr-text-muted)' }}>
              <p>No users found in the system.</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ backgroundColor: 'rgba(0,0,0,0.02)', borderBottom: '1px solid var(--clr-border)' }}>
                <tr>
                  <th style={{ padding: '1.2rem 2rem', fontSize: '0.8rem', fontWeight: 800, color: 'var(--clr-text-muted)', textTransform: 'uppercase' }}>Citizen Info</th>
                  <th style={{ padding: '1.2rem 2rem', fontSize: '0.8rem', fontWeight: 800, color: 'var(--clr-text-muted)', textTransform: 'uppercase' }}>Contact</th>
                  <th style={{ padding: '1.2rem 2rem', fontSize: '0.8rem', fontWeight: 800, color: 'var(--clr-text-muted)', textTransform: 'uppercase' }}>Role</th>
                  <th style={{ padding: '1.2rem 2rem', fontSize: '0.8rem', fontWeight: 800, color: 'var(--clr-text-muted)', textTransform: 'uppercase' }}>Management</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <tr key={user.id} style={{ borderBottom: idx === users.length - 1 ? 'none' : '1px solid var(--clr-border)', transition: 'background 0.2s' }}>
                    <td style={{ padding: '1.5rem 2rem' }}>
                      <div style={{ fontWeight: 700, marginBottom: '0.2rem' }}>{user.fullName || 'Citizen'}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--clr-text-muted)' }}>{user.city}</div>
                    </td>
                    <td style={{ padding: '1.5rem 2rem', fontSize: '0.9rem' }}>
                      {user.email}<br/>
                      <span style={{ color: 'var(--clr-text-muted)', fontSize: '0.8rem' }}>{user.phone}</span>
                    </td>
                    <td style={{ padding: '1.5rem 2rem' }}>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        fontWeight: '800', 
                        color: user.role === 'admin' ? 'var(--clr-primary)' : user.role === 'moderator' ? 'var(--clr-info)' : 'var(--clr-text-muted)',
                        textTransform: 'uppercase',
                        backgroundColor: user.role === 'admin' ? 'rgba(231,0,19,0.08)' : user.role === 'moderator' ? 'rgba(59,130,246,0.08)' : 'rgba(0,0,0,0.05)',
                        padding: '0.3rem 0.6rem',
                        borderRadius: 'var(--radius-full)'
                      }}>
                        {user.role}
                      </span>
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
                          border: 'none'
                        }}
                        value={user.role || 'user'}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      >
                        <option value="user">👤 Citizen</option>
                        <option value="moderator">🛡️ Moderator</option>
                      </select>
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

export default Admin;

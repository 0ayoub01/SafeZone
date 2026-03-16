import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [dob, setDob] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const tunisCities = [
    "Ariana", "Béja", "Ben Arous", "Bizerte", "Gabès", "Gafsa", "Jendouba", 
    "Kairouan", "Kasserine", "Kébili", "Kef", "Mahdia", "Manouba", "Médenine", 
    "Monastir", "Nabeul", "Sfax", "Sidi Bouzid", "Siliana", "Sousse", 
    "Tataouine", "Tozeur", "Tunis", "Zaghouan"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        navigate('/profile');
      } else {
        const userCredential = await signup(email, password);
        // Save extra profile info to Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          fullName,
          phone,
          city,
          dob,
          email,
          role: 'user',
          createdAt: new Date().toISOString()
        });
        navigate('/profile');
      }
    } catch (err) {
      console.error(err);
      setError(err.message.includes('auth/user-not-found') ? 'User not found.' : 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="view page-bg-community">
      <div className="bg-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
      <div className="card-premium" style={{ 
        width: '100%', 
        maxWidth: isLogin ? '450px' : '650px',
        padding: '3rem',
        animation: 'slideUp 0.6s ease'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
            {isLogin ? 'Welcome Back' : 'Join SafeZone'}
          </h2>
          <p style={{ color: 'var(--clr-text-muted)' }}>
            {isLogin ? 'Login to manage your reports' : 'Create an account to help your community'}
          </p>
        </div>

        {error && (
          <div style={{ 
            backgroundColor: 'rgba(239, 68, 68, 0.1)', 
            color: 'var(--clr-error)', 
            padding: '1rem', 
            borderRadius: 'var(--radius-md)', 
            marginBottom: '2rem',
            fontSize: '0.9rem',
            textAlign: 'center',
            border: '1px solid rgba(239, 68, 68, 0.2)'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" className="form-control" placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input type="tel" className="form-control" placeholder="XX XXX XXX" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Birth Date</label>
                  <input type="date" className="form-control" value={dob} onChange={(e) => setDob(e.target.value)} required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Home City</label>
                <select className="form-control" value={city} onChange={(e) => setCity(e.target.value)} required>
                  <option value="">Select city</option>
                  {tunisCities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-control" 
              placeholder="name@example.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-control" 
              placeholder="Min. 6 characters" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '1.1rem', marginTop: '1rem' }}
            disabled={loading}
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p style={{ color: 'var(--clr-text-muted)', fontSize: '0.95rem' }}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: 'var(--clr-primary)', 
                fontWeight: '700', 
                cursor: 'pointer',
                marginLeft: '0.5rem'
              }}
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Login;

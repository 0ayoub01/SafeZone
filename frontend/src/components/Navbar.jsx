import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, isAdmin, canModerate, logout } = useAuth();
  const isActive = (path) => location.pathname === path ? 'active' : '';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header style={{ position: 'sticky', top: '1.5rem', zIndex: 1000, margin: '0 1rem' }}>
      <nav className="glass-panel" style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '0.75rem 1.5rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        boxShadow: 'var(--shadow-md)',
        background: 'rgba(255, 255, 255, 0.8)',
        border: '1px solid rgba(255, 255, 255, 0.3)'
      }}>
        <Link to="/" style={{ 
          fontSize: '1.6rem', 
          fontWeight: 800, 
          color: 'var(--clr-primary)', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.6rem',
          fontFamily: 'var(--font-heading)',
          letterSpacing: '-0.03em'
        }}>
          <span style={{ filter: 'drop-shadow(0 2px 4px rgba(231,0,19,0.2))' }}>🌍</span> SafeZone
        </Link>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {[
            { label: 'Home', path: '/' },
            { label: 'Browse', path: '/browse' },
            { label: 'Map', path: '/map' },
            { label: 'Profile', path: '/profile', auth: true },
            { label: 'Moderate', path: '/moderator', moderate: true },
            { label: 'Users', path: '/admin', admin: true },
          ].map(link => {
            if (link.auth && !currentUser) return null;
            if (link.moderate && !canModerate) return null;
            if (link.admin && !isAdmin) return null;
            
            const active = isActive(link.path);
            return (
              <Link 
                key={link.path}
                to={link.path} 
                style={{ 
                  fontWeight: active ? 700 : 500, 
                  color: active ? 'var(--clr-primary)' : 'var(--clr-text-main)',
                  fontSize: '0.95rem',
                  position: 'relative',
                  padding: '0.5rem 0'
                }}
              >
                {link.label}
                {active && (
                  <span style={{ 
                    position: 'absolute', 
                    bottom: 0, 
                    left: 0, 
                    width: '100%', 
                    height: '2px', 
                    backgroundColor: 'var(--clr-primary)',
                    borderRadius: 'var(--radius-full)',
                    animation: 'fadeIn 0.3s ease'
                  }} />
                )}
              </Link>
            );
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {currentUser ? (
            <>
              <Link to="/report" className="btn btn-primary" style={{ padding: '0.6rem 1.2rem' }}>
                Report Issue
              </Link>
              <button 
                onClick={handleLogout} 
                className="btn btn-outline" 
                style={{ padding: '0.6rem 1.2rem', borderColor: 'transparent' }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary" style={{ padding: '0.6rem 1.2rem' }}>
              Citizen Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

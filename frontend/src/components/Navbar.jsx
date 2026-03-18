import { useTranslation } from 'react-i18next';
import {
  Home, Map, Search, User, Shield, Users, LogOut,
  Plus, Menu, X, AlertTriangle, ChevronDown, Globe
} from 'lucide-react';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, isAdmin, canModerate, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const toggleLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setLangOpen(false);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { label: t('nav.home'),     path: '/',         icon: Home },
    { label: t('nav.browse'),   path: '/browse',   icon: Search },
    { label: t('nav.map'),      path: '/map',       icon: Map },
    { label: t('nav.municipal'),path: '/authorities', icon: ShieldCheck },
    { label: t('nav.emergency'),path: '/emergency', icon: AlertTriangle },
    { label: t('nav.profile'),  path: '/profile',   icon: User,   auth: true },
  ].filter(link => {
    if (link.auth && !currentUser) return false;
    if (link.moderate && !canModerate) return false;
    if (link.admin && !isAdmin) return false;
    return true;
  });

  useEffect(() => {
    document.documentElement.dir = i18n.dir();
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const navStyle = {
    position: 'sticky',
    top: '0',
    zIndex: 1000,
    transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
  };

  const innerStyle = {
    margin: '0 auto',
    maxWidth: '1200px',
    padding: '0 1.75rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '68px',
  };

  return (
    <header style={navStyle}>
      <div style={{
        background: scrolled
          ? 'hsla(220, 20%, 100%, 0.88)'
          : 'hsla(220, 20%, 100%, 0.95)',
        backdropFilter: 'blur(18px) saturate(180%)',
        WebkitBackdropFilter: 'blur(18px) saturate(180%)',
        borderBottom: scrolled
          ? '1px solid hsl(220, 20%, 90%)'
          : '1px solid hsl(220, 20%, 93%)',
        boxShadow: scrolled ? '0 4px 24px hsla(222,30%,12%,0.08)' : 'none',
        transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
      }}>
        <nav style={innerStyle}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexShrink: 0 }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, hsl(354,92%,45%), hsl(354,92%,35%))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.1rem',
              boxShadow: '0 4px 14px hsla(354,92%,45%,0.35)',
            }}>🛡️</div>
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: '1.45rem',
              letterSpacing: '-0.04em',
              color: 'var(--clr-text)',
            }}>
              Safe<span style={{ color: 'var(--clr-primary)' }}>Zone</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            {navLinks.map(({ label, path, icon: Icon }) => {
              const active = isActive(path);
              return (
                <Link
                  key={path}
                  to={path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.5rem 0.85rem',
                    borderRadius: 'var(--r-md)',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: active ? 700 : 500,
                    fontSize: '0.9rem',
                    color: active ? 'var(--clr-primary)' : 'var(--clr-text-light)',
                    background: active ? 'var(--clr-primary-ultra)' : 'transparent',
                    transition: 'var(--trans-sm)',
                  }}
                >
                  <Icon size={15} strokeWidth={active ? 2.5 : 2} />
                  {label}
                </Link>
              );
            })}
          </div>

          {/* CTA Buttons */}
          <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Language Switcher */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setLangOpen(!langOpen)}
                className="btn btn-ghost btn-sm"
                style={{ gap: '0.4rem', color: 'var(--clr-text-light)' }}
              >
                <Globe size={16} />
                <span style={{ textTransform: 'uppercase', fontWeight: 700, fontSize: '0.75rem' }}>{i18n.language}</span>
                <ChevronDown size={14} style={{ transform: langOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
              </button>
              
              <AnimatePresence>
                {langOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    style={{ 
                      position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem',
                      background: 'white', border: '1px solid var(--clr-border)', 
                      borderRadius: 'var(--r-md)', boxShadow: 'var(--shadow-xl)',
                      padding: '0.5rem', minWidth: '120px', zIndex: 1100
                    }}
                  >
                    {[
                      { code: 'en', label: 'English' },
                      { code: 'fr', label: 'Français' },
                      { code: 'ar', label: 'العربية' }
                    ].map(l => (
                      <button 
                        key={l.code}
                        onClick={() => toggleLanguage(l.code)}
                        style={{ 
                          width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--r-sm)',
                          textAlign: i18n.dir() === 'rtl' ? 'right' : 'left', border: 'none', background: i18n.language === l.code ? 'var(--clr-primary-ultra)' : 'transparent',
                          color: i18n.language === l.code ? 'var(--clr-primary)' : 'var(--clr-text)',
                          fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer'
                        }}
                      >
                        {l.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div style={{ width: '1px', height: '20px', background: 'var(--clr-border)' }} />

            {currentUser ? (
              <>
                <Link to="/report" className="btn btn-primary btn-sm" style={{ gap: '0.4rem' }}>
                  <Plus size={15} strokeWidth={2.5} />
                  {t('nav.report')}
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn btn-ghost btn-sm"
                  style={{ color: 'var(--clr-text-light)', gap: '0.4rem' }}
                >
                  <LogOut size={14} />
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="btn btn-ghost btn-sm"
            style={{ display: 'none', padding: '0.4rem' }}
            onClick={() => setMobileOpen(prev => !prev)}
            id="mobile-menu-btn"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div style={{
            padding: '1rem 1.25rem 1.5rem',
            borderTop: '1px solid var(--clr-border)',
            background: 'hsla(220, 20%, 100%, 0.98)',
            animation: 'slideDown 0.25s var(--ease)',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {navLinks.map(({ label, path, icon: Icon }) => {
                const active = isActive(path);
                return (
                  <Link
                    key={path}
                    to={path}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--r-md)',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: active ? 700 : 500,
                      fontSize: '0.95rem',
                      color: active ? 'var(--clr-primary)' : 'var(--clr-text)',
                      background: active ? 'var(--clr-primary-ultra)' : 'transparent',
                    }}
                  >
                    <Icon size={17} />
                    {label}
                  </Link>
                );
              })}
              <hr style={{ margin: '0.5rem 0', borderColor: 'var(--clr-border)' }} />
              {currentUser ? (
                <>
                  <Link to="/report" className="btn btn-primary" style={{ marginBottom: '0.5rem' }}>
                    <Plus size={16} /> Report an Issue
                  </Link>
                  <button onClick={handleLogout} className="btn btn-outline" style={{ gap: '0.5rem' }}>
                    <LogOut size={15} /> Logout
                  </button>
                </>
              ) : (
                <Link to="/login" className="btn btn-primary">Get Started</Link>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile button visibility fix */}
      <style>{`
        @media (max-width: 768px) {
          #mobile-menu-btn { display: flex !important; }
          .hide-mobile { display: none !important; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;

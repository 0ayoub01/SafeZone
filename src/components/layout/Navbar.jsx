import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Map, Search, User, Shield, Users, LogOut,
  Plus, Menu, X, AlertTriangle, Moon, Sun, ShieldCheck, Bell
} from 'lucide-react';
import { 
  collection, query, where, orderBy, onSnapshot, 
  limit, doc, updateDoc, writeBatch, serverTimestamp 
} from 'firebase/firestore';
import { db } from '../../firebase';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, userProfile, isAdmin, canModerate, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (!currentUser) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    const q = query(
      collection(db, 'notifications'),
      where('recipientId', '==', currentUser.uid),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort locally by createdAt (descending) to avoid mandatory composite index
      const sortedNotifs = notifs.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });
      setNotifications(sortedNotifs.slice(0, 15));
      setUnreadCount(sortedNotifs.filter(n => !n.read).length);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const markAllRead = async () => {
    if (unreadCount === 0) return;
    const batch = writeBatch(db);
    notifications.forEach(n => {
      if (!n.read) {
        batch.update(doc(db, 'notifications', n.id), { read: true });
      }
    });
    await batch.commit();
  };

  const handleNotifClick = (notif) => {
    if (!notif.read) {
      updateDoc(doc(db, 'notifications', notif.id), { read: true });
    }
    setNotifOpen(false);
    if (notif.reportId) {
      navigate(`/browse/${notif.reportId}`);
    }
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
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
    { label: t('nav.admin'),           path: '/admin',    icon: Shield, admin: true },
    { label: t('nav.moderator'),       path: '/moderator', icon: Shield, moderate: true },
    { label: t('nav.emergency'),path: '/emergency', icon: AlertTriangle },
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
          ? 'var(--glass-bg)'
          : 'var(--glass-bg)',
        backdropFilter: 'blur(18px) saturate(180%)',
        WebkitBackdropFilter: 'blur(18px) saturate(180%)',
        borderBottom: '1px solid var(--clr-border)',
        boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
        transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
      }}>
        <nav style={innerStyle}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexShrink: 0 }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'var(--grad-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.1rem',
              boxShadow: 'var(--shadow-glow)',
            }}>
              <ShieldCheck size={20} color="white" strokeWidth={2.5} />
            </div>
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
                  {label === t('nav.profile') && userProfile?.photoURL ? (
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', overflow: 'hidden' }}>
                      <img src={userProfile.photoURL} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ) : (
                    <Icon size={15} strokeWidth={active ? 2.5 : 2} />
                  )}
                  {label}
                </Link>
              );
            })}
          </div>

          {/* CTA Buttons */}
          <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>

            {/* Dark Mode Toggle */}
            <button 
              onClick={toggleTheme}
              className="btn btn-ghost btn-sm"
              style={{ padding: '0.4rem', color: 'var(--clr-text-light)' }}
              title="Toggle Theme"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <div style={{ width: '1px', height: '20px', background: 'var(--clr-border)', margin: '0 0.25rem' }} />

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
                {t('nav.login')}
              </Link>
            )}

            {/* Profile Link (moved here) */}
            {currentUser && (
              <Link
                to="/profile"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.5rem 0.85rem',
                  borderRadius: 'var(--r-md)',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: isActive('/profile') ? 700 : 500,
                  fontSize: '0.9rem',
                  color: isActive('/profile') ? 'var(--clr-primary)' : 'var(--clr-text-light)',
                  background: isActive('/profile') ? 'var(--clr-primary-ultra)' : 'transparent',
                  transition: 'var(--trans-sm)',
                }}
              >
                {userProfile?.photoURL ? (
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', overflow: 'hidden' }}>
                    <img src={userProfile.photoURL} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ) : (
                  <User size={15} strokeWidth={isActive('/profile') ? 2.5 : 2} />
                )}
                {t('nav.profile')}
              </Link>
            )}

            {/* Notification Bell (moved to far right) */}
            {currentUser && (
              <div style={{ position: 'relative' }}>
                <button 
                  onClick={() => {
                    setNotifOpen(!notifOpen);
                  }}
                  className="btn btn-ghost btn-sm"
                  style={{ padding: '0.4rem', color: 'var(--clr-text-light)', position: 'relative' }}
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '2px',
                      right: '2px',
                      width: '10px',
                      height: '10px',
                      background: 'var(--clr-error)',
                      borderRadius: '50%',
                      border: '2px solid var(--clr-surface)',
                      boxShadow: '0 0 10px var(--clr-error)'
                    }} />
                  )}
                </button>

                <AnimatePresence>
                  {notifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      style={{
                        position: 'absolute',
                        top: '100%',
                        right: '0',
                        marginTop: '0.75rem',
                        width: '340px',
                        maxHeight: '450px',
                        overflowY: 'auto',
                        background: 'var(--clr-surface)',
                        borderRadius: 'var(--r-lg)',
                        border: '1px solid var(--clr-border)',
                        boxShadow: 'var(--shadow-xl)',
                        zIndex: 2100,
                        padding: '0'
                      }}
                    >
                      <div style={{ padding: '1rem', borderBottom: '1px solid var(--clr-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--clr-bg-raised)' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>Notifications</span>
                        {unreadCount > 0 && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); markAllRead(); }}
                            style={{ background: 'none', border: 'none', color: 'var(--clr-primary)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>
                      {notifications.length === 0 ? (
                        <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--clr-text-muted)', fontSize: '0.85rem' }}>
                          No notifications yet
                        </div>
                      ) : (
                        notifications.map(notif => (
                          <div 
                            key={notif.id}
                            onClick={() => handleNotifClick(notif)}
                            style={{
                              padding: '0.85rem 1rem',
                              borderBottom: '1px solid var(--clr-border)',
                              cursor: 'pointer',
                              background: notif.read ? 'transparent' : 'var(--clr-primary-ultra)',
                              transition: 'var(--trans-sm)',
                              position: 'relative'
                            }}
                          >
                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                              <div style={{ 
                                width: '32px', height: '32px', borderRadius: '50%', 
                                background: notif.type === 'like' ? 'var(--clr-error-bg)' : 'var(--clr-primary-ultra)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                              }}>
                                {notif.type === 'like' ? <ShieldCheck size={16} color="var(--clr-error)" /> : <Users size={16} color="var(--clr-primary)" />}
                              </div>
                              <div style={{ flex: 1 }}>
                                <p style={{ fontSize: '0.85rem', lineHeight: '1.4', margin: 0 }}>
                                  <span style={{ fontWeight: 700 }}>{notif.senderName}</span>
                                  {notif.type === 'like' ? ' liked ' : ' commented on '}
                                  your report: <span style={{ color: 'var(--clr-primary)' }}>{notif.reportTitle}</span>
                                </p>
                                <span style={{ fontSize: '0.7rem', color: 'var(--clr-text-muted)', marginTop: '0.25rem', display: 'block' }}>
                                  {notif.createdAt?.toDate ? notif.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
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
            background: 'var(--clr-surface)',
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
              {currentUser && (
                <Link
                  to="/profile"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--r-md)',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: isActive('/profile') ? 700 : 500,
                    fontSize: '0.95rem',
                    color: isActive('/profile') ? 'var(--clr-primary)' : 'var(--clr-text)',
                    background: isActive('/profile') ? 'var(--clr-primary-ultra)' : 'transparent',
                  }}
                >
                  <User size={17} />
                  {t('nav.profile')}
                </Link>
              )}
              {currentUser ? (
                <>
                  <Link to="/report" className="btn btn-primary" style={{ marginBottom: '0.5rem' }}>
                    <Plus size={16} /> {t('nav.report')}
                  </Link>
                  <button onClick={handleLogout} className="btn btn-outline" style={{ gap: '0.5rem' }}>
                    <LogOut size={15} /> {t('nav.logout')}
                  </button>
                </>
              ) : (
                <Link to="/login" className="btn btn-primary">{t('nav.login')}</Link>
              )}
              <hr style={{ margin: '0.5rem 0', borderColor: 'var(--clr-border)' }} />
              <button 
                onClick={toggleTheme} 
                className="btn btn-outline" 
                style={{ width: '100%', gap: '0.5rem' }}
              >
                {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </button>
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

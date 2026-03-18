import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  doc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Calendar, 
  Tag, 
  ChevronRight, 
  ThumbsUp, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw,
  Search,
  X,
  Info,
  Zap,
  Share2,
  Copy,
  Send
} from 'lucide-react';

const Browse = () => {
  const { currentUser } = useAuth();
  const [reports, setReports] = useState([]);
  const [cityFilter, setCityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [updatingUpvote, setUpdatingUpvote] = useState(null);
  
  // Comment state
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [postingComment, setPostingComment] = useState(false);

  const categories = ['Roads', 'Lighting', 'Sanitation', 'Water', 'Other'];
  const tunisCities = [
    "Ariana", "Béja", "Ben Arous", "Bizerte", "Gabès", "Gafsa", "Jendouba", 
    "Kairouan", "Kasserine", "Kébili", "Kef", "Mahdia", "Manouba", "Médenine", 
    "Monastir", "Nabeul", "Sfax", "Sidi Bouzid", "Siliana", "Sousse", 
    "Tataouine", "Tozeur", "Tunis", "Zaghouan"
  ];

  useEffect(() => {
    fetchReports();
  }, [cityFilter, categoryFilter]);

  useEffect(() => {
    if (selectedReport) {
      fetchComments(selectedReport.id);
    }
  }, [selectedReport]);

  const fetchReports = async () => {
    setLoading(true);
    setError('');
    try {
      let q = collection(db, 'reports');
      let constraints = [];
      
      if (cityFilter) constraints.push(where('city', '==', cityFilter));
      if (categoryFilter) constraints.push(where('category', '==', categoryFilter));
      
      constraints.push(orderBy('createdAt', 'desc'));
      
      const finalQuery = query(q, ...constraints);
      const snapshot = await getDocs(finalQuery);
      setReports(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error(err);
      if (err.code === 'failed-precondition') {
        setError('Database index required for this filter combination.');
      } else {
        setError('Failed to fetch reports.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (reportId) => {
    try {
      const q = query(
        collection(db, 'reports', reportId, 'comments'),
        orderBy('createdAt', 'asc')
      );
      const snapshot = await getDocs(q);
      setComments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  const handleUpvote = async (e, report) => {
    e.stopPropagation();
    if (!currentUser) return;
    if (updatingUpvote === report.id) return;

    setUpdatingUpvote(report.id);
    const reportRef = doc(db, 'reports', report.id);
    const isUpvoted = report.upvotes?.includes(currentUser.uid);

    try {
      if (isUpvoted) {
        await updateDoc(reportRef, { upvotes: arrayRemove(currentUser.uid) });
        setReports(prev => prev.map(r => r.id === report.id ? { ...r, upvotes: r.upvotes.filter(id => id !== currentUser.uid) } : r));
      } else {
        await updateDoc(reportRef, { upvotes: arrayUnion(currentUser.uid) });
        setReports(prev => prev.map(r => r.id === report.id ? { ...r, upvotes: [...(r.upvotes || []), currentUser.uid] } : r));
      }
    } catch (err) {
      console.error("Upvote error:", err);
    } finally {
      setUpdatingUpvote(null);
    }
  };

  const postComment = async (e) => {
    e.preventDefault();
    if (!currentUser || !commentText.trim() || postingComment) return;

    setPostingComment(true);
    try {
      const commentData = {
        text: commentText,
        userId: currentUser.uid,
        userName: currentUser.displayName || 'Verified Citizen',
        createdAt: serverTimestamp()
      };
      
      const commentRef = await addDoc(collection(db, 'reports', selectedReport.id, 'comments'), commentData);
      
      setComments(prev => [...prev, { id: commentRef.id, ...commentData, createdAt: { toDate: () => new Date() } }]);
      setCommentText('');
      
      const reportRef = doc(db, 'reports', selectedReport.id);
      await updateDoc(reportRef, { commentCount: (selectedReport.commentCount || 0) + 1 });
      
    } catch (err) {
      console.error("Error posting comment:", err);
    } finally {
      setPostingComment(false);
    }
  };

  const shareReport = (platform) => {
    const url = window.location.origin + '/#/browse/' + selectedReport.id;
    const text = `Check out this report on SafeZone: ${selectedReport.title}`;
    
    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'Reported': return { label: 'New', color: 'var(--clr-warning)', icon: AlertCircle, bg: 'rgba(245,158,11,0.1)' };
      case 'Under Review': return { label: 'Review', color: 'var(--clr-info)', icon: Clock, bg: 'rgba(59,130,246,0.1)' };
      case 'In Progress': return { label: 'Active', color: 'hsl(var(--h-amber), 92%, 48%)', icon: Zap, bg: 'rgba(245,158,11,0.1)' };
      case 'Resolved': return { label: 'Solved', color: 'var(--clr-success)', icon: CheckCircle2, bg: 'rgba(16,185,129,0.1)' };
      case 'Rejected': return { label: 'Closed', color: 'var(--clr-error)', icon: X, bg: 'rgba(239, 68, 68, 0.1)' };
      default: return { label: status, color: 'var(--clr-text-muted)', icon: Info, bg: 'var(--clr-bg-raised)' };
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Just now';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="view">
      <div className="container">
        <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div className="section-label">Citizen Reports</div>
          <h2 className="section-title">Community Dashboard</h2>
          <p className="section-subtitle">
            Stay informed about issues in your district. Upvote reports to increase their visibility 
            to local authorities and track their resolution progress.
          </p>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '1rem', 
            flexWrap: 'wrap',
            marginTop: '3rem',
            padding: '1.5rem',
            backgroundColor: 'var(--clr-white)',
            borderRadius: 'var(--r-xl)',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid var(--clr-border)',
            maxWidth: '900px',
            margin: '3rem auto 0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '200px' }}>
              <MapPin size={18} color="var(--clr-primary)" />
              <select 
                className="form-control" 
                style={{ border: 'none', padding: '0', height: 'auto', fontWeight: 600 }}
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
              >
                <option value="">All Tunisia</option>
                {tunisCities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ width: '1px', backgroundColor: 'var(--clr-border)', height: '24px', alignSelf: 'center' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '200px' }}>
              <Tag size={18} color="var(--clr-primary)" />
              <select 
                className="form-control" 
                style={{ border: 'none', padding: '0', height: 'auto', fontWeight: 600 }}
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <button className="btn btn-primary" onClick={fetchReports} style={{ padding: '0.6rem 1rem' }}>
              <RefreshCw size={18} />
            </button>
          </div>
        </header>

        {loading ? (
          <div className="grid-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="skeleton" style={{ height: '350px', borderRadius: 'var(--r-lg)' }} />
            ))}
          </div>
        ) : reports.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '5rem 2rem', borderStyle: 'dashed', maxWidth: '600px', margin: '0 auto' }}>
            <Search size={48} color="var(--clr-text-muted)" style={{ marginBottom: '1.5rem' }} />
            <h3>No reports found</h3>
            <p style={{ color: 'var(--clr-text-muted)', marginBottom: '1.5rem' }}>We couldn't find any reports matching your current filters.</p>
            <button className="btn btn-outline" onClick={() => { setCityFilter(''); setCategoryFilter(''); }}>Reset All Filters</button>
          </div>
        ) : (
          <motion.div layout className="grid-3" style={{ marginBottom: '4rem' }}>
            <AnimatePresence>
              {reports.map((report) => {
                const status = getStatusInfo(report.status);
                const isUpvoted = report.upvotes?.includes(currentUser?.uid);
                
                return (
                  <motion.div 
                    key={report.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="card-premium"
                    style={{ position: 'relative', overflow: 'hidden', padding: '0', display: 'flex', flexDirection: 'column' }}
                    whileHover={{ y: -5 }}
                  >
                    <div style={{ height: '180px', position: 'relative', overflow: 'hidden', backgroundColor: 'var(--clr-bg-raised)' }}>
                      {report.imageUrl ? (
                        <img src={report.imageUrl} alt={report.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.2 }}>
                          <Tag size={48} />
                        </div>
                      )}
                      <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                        <span className="badge" style={{ backgroundColor: status.bg, backdropFilter: 'blur(8px)', color: status.color, border: '1px solid rgba(255,255,255,0.1)' }}>
                          <status.icon size={12} style={{ marginRight: '0.4rem' }} />
                          {status.label}
                        </span>
                      </div>
                    </div>

                    <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                         <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--clr-primary)', textTransform: 'uppercase' }}>{report.category}</div>
                         <div style={{ fontSize: '0.75rem', color: 'var(--clr-text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Clock size={12} /> {formatDate(report.createdAt)}
                         </div>
                      </div>

                      <h4 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', lineHeight: '1.3' }}>{report.title}</h4>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--clr-text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                        <MapPin size={14} /> {report.city}, {report.neighborhood}
                      </div>

                      <div style={{ marginTop: 'auto', paddingTop: '1.25rem', borderTop: '1px solid var(--clr-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                          <button 
                            disabled={!currentUser || updatingUpvote === report.id}
                            onClick={(e) => handleUpvote(e, report)}
                            style={{ 
                              background: 'none', 
                              border: 'none', 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '0.4rem', 
                              fontSize: '0.85rem',
                              fontWeight: 700,
                              color: isUpvoted ? 'var(--clr-primary)' : 'var(--clr-text-muted)',
                              cursor: currentUser ? 'pointer' : 'default'
                            }}
                          >
                            <ThumbsUp size={16} fill={isUpvoted ? 'var(--clr-primary)' : 'none'} />
                            {report.upvotes?.length || 0}
                          </button>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--clr-text-muted)' }}>
                            <MessageSquare size={16} />
                            {report.commentCount || 0}
                          </div>
                        </div>
                        <button 
                          className="btn btn-ghost btn-sm" 
                          onClick={() => setSelectedReport(report)}
                          style={{ color: 'var(--clr-primary)', fontWeight: 800 }}
                        >
                          Details <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {selectedReport && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="modal-overlay" onClick={() => setSelectedReport(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="modal-content card-premium" style={{ padding: '0', maxWidth: '1000px', width: '95%', overflow: 'hidden' }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', maxHeight: '90vh' }}>
                {/* Modal Left */}
                <div style={{ backgroundColor: 'var(--clr-bg-raised)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                  <div style={{ height: '350px', position: 'relative', flexShrink: 0 }}>
                    {selectedReport.imageUrl ? (
                      <img src={selectedReport.imageUrl} alt="Evidence" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--clr-text-muted)', gap: '1rem' }}>
                        <Tag size={64} style={{ opacity: 0.1 }} />
                        <p style={{ fontSize: '0.9rem', opacity: 0.5 }}>No photo evidence</p>
                      </div>
                    )}
                    <button onClick={() => setSelectedReport(null)} className="modal-close" style={{ top: '1rem', left: '1rem' }}>
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div style={{ padding: '2.5rem', flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                      <span className="badge" style={{ backgroundColor: getStatusInfo(selectedReport.status).bg, color: getStatusInfo(selectedReport.status).color }}>
                        {selectedReport.status}
                      </span>
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button onClick={() => shareReport('whatsapp')} className="btn btn-ghost btn-sm" title="Share WhatsApp"><Share2 size={18} /></button>
                        <button onClick={() => shareReport('copy')} className="btn btn-ghost btn-sm" title="Copy Link"><Copy size={18} /></button>
                      </div>
                    </div>
                    
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>{selectedReport.title}</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--clr-text-muted)' }}>
                        <MapPin size={16} color="var(--clr-primary)" /> {selectedReport.city}, {selectedReport.neighborhood}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--clr-text-muted)' }}>
                        <Calendar size={16} color="var(--clr-primary)" /> {formatDate(selectedReport.createdAt)}
                      </div>
                    </div>
                    <p style={{ lineHeight: '1.7', color: 'var(--clr-text-light)', fontSize: '0.95rem', whiteSpace: 'pre-wrap', marginBottom: '2rem' }}>
                      {selectedReport.description}
                    </p>

                    <div style={{ borderTop: '1px solid var(--clr-border)', paddingTop: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                        {['Reported', 'Review', 'Active', 'Solved'].map((lbl, idx) => {
                           const steps = ['Reported', 'Under Review', 'In Progress', 'Resolved'];
                           const isDone = steps.indexOf(selectedReport.status) >= idx;
                           return (
                            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, flex: 1 }}>
                              <div style={{ 
                                width: '20px', height: '20px', borderRadius: '50%', 
                                backgroundColor: isDone ? 'var(--clr-primary)' : 'var(--clr-border)',
                                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', marginBottom: '0.4rem'
                              }}>
                                {isDone ? <CheckCircle2 size={10} /> : idx + 1}
                              </div>
                              <span style={{ fontSize: '0.6rem', fontWeight: 800, color: isDone ? 'var(--clr-text)' : 'var(--clr-text-muted)' }}>{lbl}</span>
                            </div>
                           )
                        })}
                        <div style={{ position: 'absolute', top: '10px', left: '12%', right: '12%', height: '1.5px', backgroundColor: 'var(--clr-border)', zIndex: 0 }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Right */}
                <div style={{ borderLeft: '1px solid var(--clr-border)', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
                  <div style={{ padding: '2rem', borderBottom: '1px solid var(--clr-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                    <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <MessageSquare size={18} color="var(--clr-primary)" /> Discussions
                    </h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--clr-text-muted)' }}>{comments.length}</span>
                  </div>

                  <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {comments.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--clr-text-muted)' }}>
                        <MessageSquare size={32} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                        <p style={{ fontSize: '0.9rem' }}>No discussions yet.</p>
                      </div>
                    ) : (
                      comments.map((c) => (
                        <div key={c.id} style={{ display: 'flex', gap: '1rem' }}>
                          <div className="avatar avatar-sm">{c.userName?.charAt(0) || 'U'}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                              <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{c.userName}</span>
                              <span style={{ fontSize: '0.7rem', color: 'var(--clr-text-muted)' }}>{formatDate(c.createdAt)}</span>
                            </div>
                            <p style={{ fontSize: '0.9rem', color: 'var(--clr-text-light)', lineHeight: '1.5' }}>{c.text}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div style={{ padding: '2rem', borderTop: '1px solid var(--clr-border)', backgroundColor: 'var(--clr-bg-raised)', flexShrink: 0 }}>
                    {currentUser ? (
                      <form onSubmit={postComment} style={{ display: 'flex', gap: '0.75rem' }}>
                        <input 
                          type="text" className="form-control" placeholder="Write a comment..." 
                          value={commentText} onChange={(e) => setCommentText(e.target.value)}
                          required style={{ borderRadius: 'var(--r-md)', padding: '0.75rem 1rem' }}
                        />
                        <button type="submit" disabled={postingComment} className="btn btn-primary" style={{ padding: '0.75rem' }}>
                          {postingComment ? <RefreshCw size={18} className="spinner" /> : <Send size={18} />}
                        </button>
                      </form>
                    ) : (
                      <div style={{ textAlign: 'center', fontSize: '0.85rem' }}>
                        Please <Link to="/login" style={{ color: 'var(--clr-primary)', fontWeight: 700 }}>Login</Link> to join.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Browse;

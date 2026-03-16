import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Browse from './pages/Browse';
import Report from './pages/Report';
import MapView from './pages/Map';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Moderator from './pages/Moderator';
import About from './pages/About';
import Login from './pages/Login';
import { AuthProvider, useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { currentUser, isAdmin } = useAuth();
  if (!currentUser) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/" />;
  return children;
};

const ModeratorRoute = ({ children }) => {
  const { currentUser, canModerate } = useAuth();
  if (!currentUser) return <Navigate to="/login" />;
  if (!canModerate) return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router basename={import.meta.env.BASE_URL}>
        <Navbar />
        <main id="app-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/map" element={<MapView />} />
            <Route path="/about" element={<About />} />
            <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
            <Route path="/moderator" element={<ModeratorRoute><Moderator /></ModeratorRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/report" element={<ProtectedRoute><Report /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          </Routes>
        </main>
        <footer className="footer" style={{ textAlign: 'center', padding: '2rem 0', backgroundColor: 'var(--clr-white)', borderTop: '1px solid var(--clr-border)', marginTop: 'auto' }}>
          <p>&copy; 2026 SafeZone. Empowering Citizens of Tunisia.</p>
        </footer>
      </Router>
    </AuthProvider>
  );
}

export default App;

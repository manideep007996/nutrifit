import { useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

const LINKS = [
  { to: '/dashboard', label: 'Home', icon: '🏠' },
  { to: '/diet', label: 'Diet Plan', icon: '🥗' },
  { to: '/workouts', label: 'Workouts', icon: '🏋️' },
  { to: '/tracker', label: 'Tracker', icon: '📊' },
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const close = (e) => menuRef.current && !menuRef.current.contains(e.target) && setMenuOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const initials = user.name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="container topbar-inner">
          <Logo to="/dashboard" />
          <nav className="nav-links">
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} className="nav-link">
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="user-menu" ref={menuRef}>
            <button className="avatar" onClick={() => setMenuOpen((o) => !o)} aria-label="Account menu">
              {initials}
            </button>
            {menuOpen && (
              <div className="dropdown">
                <div className="dropdown-head">
                  <strong>{user.name}</strong>
                  <small>{user.email}</small>
                </div>
                <NavLink to="/profile" className="dropdown-item">👤 My profile</NavLink>
                <button className="dropdown-item danger" onClick={handleLogout}>↩ Log out</button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container page" key={location.pathname}>
        <Outlet />
      </main>

      <nav className="bottom-nav">
        {LINKS.map((l) => (
          <NavLink key={l.to} to={l.to} className="bottom-link">
            <span>{l.icon}</span>
            {l.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

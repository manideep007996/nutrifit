import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Splash() {
  return (
    <div className="splash">
      <div className="spinner" />
    </div>
  );
}

export function Protected({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <Splash />;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return children;
}

export function RequireProfile({ children }) {
  const { profile } = useAuth();
  if (!profile) return <Navigate to="/onboarding" replace />;
  return children;
}

export function PublicOnly({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Splash />;
  if (user) return <Navigate to="/welcome" replace />;
  return children;
}

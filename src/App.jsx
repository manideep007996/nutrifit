import { Navigate, Route, Routes } from 'react-router-dom';
import { Protected, PublicOnly, RequireProfile } from './components/Guards';
import AppLayout from './components/AppLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Welcome from './pages/Welcome';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import DietPlan from './pages/DietPlan';
import Workouts from './pages/Workouts';
import Tracker from './pages/Tracker';
import Profile from './pages/Profile';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicOnly><Landing /></PublicOnly>} />
      <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
      <Route path="/welcome" element={<Protected><Welcome /></Protected>} />
      <Route path="/onboarding" element={<Protected><Onboarding /></Protected>} />
      <Route
        element={
          <Protected>
            <RequireProfile>
              <AppLayout />
            </RequireProfile>
          </Protected>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/diet" element={<DietPlan />} />
        <Route path="/workouts" element={<Workouts />} />
        <Route path="/tracker" element={<Tracker />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

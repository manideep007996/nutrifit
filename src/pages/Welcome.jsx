import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ExerciseFigure from '../components/ExerciseFigure';
import Logo from '../components/Logo';
import { greeting, prettyDate } from '../utils/date';

export default function Welcome() {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const firstName = user.name.split(' ')[0];

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="welcome">
      <div className="blobs" aria-hidden="true"><span /><span /><span /></div>
      <header className="container landing-nav">
        <Logo to="/welcome" />
        <button className="btn btn-ghost" onClick={handleLogout}>Log out</button>
      </header>

      <section className="container welcome-body">
        <div className="welcome-figure scale-in">
          <div className="halo" />
          <ExerciseFigure anim="wave" size={240} />
        </div>
        <div className="welcome-copy stagger">
          <span className="eyebrow">{prettyDate()}</span>
          <h1>
            {greeting()}, <span className="gradient-text">{firstName}</span> 👋
          </h1>
          <p className="lead">
            {profile
              ? 'Your personalised diet chart and today’s workout are ready. Let’s keep the momentum going!'
              : 'Let’s build a plan that fits your body. Answer a few quick questions and we’ll create your diet chart and workout routine.'}
          </p>
          <div className="welcome-actions">
            <button className="btn btn-primary btn-lg pulse" onClick={() => navigate(profile ? '/dashboard' : '/onboarding')}>
              {profile ? 'Go to my dashboard →' : 'Get started →'}
            </button>
          </div>
          <ul className="welcome-points">
            <li>⚖️ BMI & calorie target</li>
            <li>🥗 Non-repeating weekly meals</li>
            <li>🏋️ Animated daily workouts</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

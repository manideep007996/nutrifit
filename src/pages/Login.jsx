import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import ExerciseFigure from '../components/ExerciseFigure';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [email, setEmail] = useState(state?.email || '');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) return setError('Please enter your email and password.');
    try {
      setBusy(true);
      await login(email, password);
      navigate('/welcome', { replace: true });
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="blobs" aria-hidden="true"><span /><span /><span /></div>
      <div className="auth-split card scale-in">
        <aside className="auth-aside">
          <Logo />
          <div className="aside-figure">
            <ExerciseFigure anim="squats" size={220} />
          </div>
          <h3>Welcome back!</h3>
          <p>Your meals, workouts and progress are right where you left them.</p>
        </aside>

        <form className="auth-form" onSubmit={onSubmit} noValidate>
          <h2>Log in</h2>
          <p className="muted">Continue your healthy streak.</p>

          {state?.registered && (
            <div className="alert alert-success fade-up">🎉 Account created! Log in to continue.</div>
          )}

          <label className="field">
            <span>Email</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" autoFocus={!state?.email} />
          </label>
          <label className="field">
            <span>Password</span>
            <div className="input-wrap">
              <input type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" autoComplete="current-password" autoFocus={!!state?.email} />
              <button type="button" className="input-btn" onClick={() => setShowPw((s) => !s)}>{showPw ? 'Hide' : 'Show'}</button>
            </div>
          </label>

          {error && <div className="alert alert-error shake">{error}</div>}

          <button className="btn btn-primary btn-block btn-lg" disabled={busy}>
            {busy ? <span className="btn-spinner" /> : 'Log in'}
          </button>
          <p className="muted center small">
            New here? <Link to="/">Create an account</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

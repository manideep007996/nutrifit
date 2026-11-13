import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import ExerciseFigure from '../components/ExerciseFigure';

const FEATURES = [
  { icon: '⚖️', title: 'Smart BMI insights', text: 'Enter height, weight and gender — get BMI, ideal weight range and a safe calorie target.' },
  { icon: '🥗', title: 'Veg or Non-Veg plans', text: 'Breakfast, lunch, snack and dinner charts. No dish repeats within the week.' },
  { icon: '🏋️', title: 'Animated workouts', text: 'Follow animated demos with a guided timer — tuned to your fitness level.' },
  { icon: '📊', title: 'Daily tracker', text: 'Tick off meals, log water and weight, and watch your weekly streak grow.' },
];

const STEPS = [
  { n: '01', title: 'Create your account', text: 'Takes less than a minute.' },
  { n: '02', title: 'Tell us about you', text: 'Gender, age, height, weight and lifestyle.' },
  { n: '03', title: 'Follow your plan', text: 'Eat, move and track — every single day.' },
];

const emailOk = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

export default function Landing() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.name.trim().length < 2) return setError('Please enter your name.');
    if (!emailOk(form.email)) return setError('Please enter a valid email address.');
    if (form.password.length < 6) return setError('Password must be at least 6 characters.');
    if (form.password !== form.confirm) return setError('Passwords do not match.');
    try {
      setBusy(true);
      await register(form);
      navigate('/login', { state: { registered: true, email: form.email.trim().toLowerCase() } });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="landing">
      <div className="blobs" aria-hidden="true"><span /><span /><span /></div>

      <header className="container landing-nav">
        <Logo />
        <Link to="/login" className="btn btn-ghost">Log in</Link>
      </header>

      <section className="container hero">
        <div className="hero-copy stagger">
          <span className="pill">✨ Personalised plan in under 60 seconds</span>
          <h1>
            Eat smart. Move daily.
            <br />
            <span className="gradient-text">Feel lighter.</span>
          </h1>
          <p className="lead">
            NutriFit builds a weight-loss diet chart and workout routine around <em>your</em> body —
            vegetarian or non-vegetarian, never boring, always tracked.
          </p>

          <div className="hero-showcase">
            <div className="showcase-figure">
              <ExerciseFigure anim="jumping-jacks" size={170} />
            </div>
            <div className="float-card fc-1"><span>🔥</span><div><strong>1,650</strong><small>kcal / day</small></div></div>
            <div className="float-card fc-2"><span>⚖️</span><div><strong>BMI 23.4</strong><small>Healthy</small></div></div>
            <div className="float-card fc-3"><span>🥗</span><div><strong>28 meals</strong><small>zero repeats</small></div></div>
          </div>
        </div>

        <form className="card auth-card scale-in" onSubmit={onSubmit} id="register" noValidate>
          <h2>Create your account</h2>
          <p className="muted">Start your personalised journey — it’s free.</p>

          <label className="field">
            <span>Full name</span>
            <input value={form.name} onChange={set('name')} placeholder="e.g. Alex Kumar" autoComplete="name" />
          </label>
          <label className="field">
            <span>Email</span>
            <input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" autoComplete="email" />
          </label>
          <div className="field-row">
            <label className="field">
              <span>Password</span>
              <div className="input-wrap">
                <input type={showPw ? 'text' : 'password'} value={form.password} onChange={set('password')} placeholder="Min. 6 characters" autoComplete="new-password" />
                <button type="button" className="input-btn" onClick={() => setShowPw((s) => !s)}>{showPw ? 'Hide' : 'Show'}</button>
              </div>
            </label>
            <label className="field">
              <span>Confirm</span>
              <input type={showPw ? 'text' : 'password'} value={form.confirm} onChange={set('confirm')} placeholder="Repeat password" autoComplete="new-password" />
            </label>
          </div>

          {error && <div className="alert alert-error shake">{error}</div>}

          <button className="btn btn-primary btn-block btn-lg" disabled={busy}>
            {busy ? <span className="btn-spinner" /> : 'Get started — it’s free'}
          </button>
          <p className="muted center small">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </form>
      </section>

      <section className="container section">
        <div className="section-head">
          <span className="eyebrow">Everything in one place</span>
          <h2>Built for real, sustainable weight loss</h2>
        </div>
        <div className="grid-4 stagger">
          {FEATURES.map((f) => (
            <div key={f.title} className="card feature-card hover-lift">
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p className="muted">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="steps-row stagger">
          {STEPS.map((s) => (
            <div key={s.n} className="step-item">
              <span className="step-n">{s.n}</span>
              <div>
                <h3>{s.title}</h3>
                <p className="muted">{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="container footer">
        <Logo />
        <small className="muted">© {new Date().getFullYear()} NutriFit · Guidance only — consult a professional for medical advice.</small>
      </footer>
    </div>
  );
}

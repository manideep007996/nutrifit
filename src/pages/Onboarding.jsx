import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import BmiGauge from '../components/BmiGauge';
import { OptionCards, RangeField, validateProfile } from '../components/FormFields';
import { ACTIVITY_LEVELS, DIETS, GENDERS, calcBMI, bmiCategory, healthSummary } from '../utils/health';

const STEPS = ['About you', 'Your body', 'Lifestyle', 'Your plan'];

export default function Onboarding() {
  const { user, profile, saveProfile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    gender: profile?.gender || '',
    age: profile?.age || 25,
    height: profile?.height || 165,
    weight: profile?.weight || 70,
    activity: profile?.activity || 'light',
    diet: profile?.diet || 'veg',
    targetWeight: profile?.targetWeight || '',
  });

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
  const numeric = { ...form, age: +form.age, height: +form.height, weight: +form.weight, targetWeight: +form.targetWeight || '' };
  const liveBmi = calcBMI(numeric.weight, numeric.height);
  const summary = useMemo(() => (step === 3 ? healthSummary(numeric) : null), [step]); // eslint-disable-line react-hooks/exhaustive-deps

  const next = async () => {
    setError('');
    if (step === 0 && !form.gender) return setError('Please select your gender.');
    if (step === 0 && !(numeric.age >= 13 && numeric.age <= 90)) return setError('Age must be between 13 and 90.');
    if (step === 1) {
      const msg = validateProfile({ ...numeric, gender: form.gender });
      if (msg) return setError(msg);
    }
    if (step === 2) {
      try {
        setBusy(true);
        await saveProfile(numeric);
      } finally {
        setBusy(false);
      }
    }
    setStep((s) => s + 1);
  };

  return (
    <div className="onboarding">
      <div className="blobs" aria-hidden="true"><span /><span /><span /></div>
      <header className="container landing-nav">
        <Logo to="/welcome" />
        <span className="muted small">Hi {user.name.split(' ')[0]} 👋</span>
      </header>

      <div className="onboard-card card scale-in">
        <div className="stepper">
          {STEPS.map((s, i) => (
            <div key={s} className={`stepper-item ${i <= step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
              <span className="stepper-dot">{i < step ? '✓' : i + 1}</span>
              <small>{s}</small>
            </div>
          ))}
          <div className="stepper-bar"><span style={{ width: `${(step / (STEPS.length - 1)) * 100}%` }} /></div>
        </div>

        <div className="onboard-body" key={step}>
          {step === 0 && (
            <div className="fade-up">
              <h2>Tell us about yourself</h2>
              <p className="muted">This helps us calculate your daily energy needs accurately.</p>
              <h4 className="label">Gender</h4>
              <OptionCards options={GENDERS} value={form.gender} onChange={set('gender')} />
              <RangeField label="Age" value={form.age} onChange={set('age')} min={13} max={90} unit="years" />
            </div>
          )}

          {step === 1 && (
            <div className="fade-up">
              <h2>Your body measurements</h2>
              <p className="muted">Slide or type — your BMI updates live.</p>
              <RangeField label="Height" value={form.height} onChange={set('height')} min={120} max={230} unit="cm" />
              <RangeField label="Weight" value={form.weight} onChange={set('weight')} min={30} max={200} step={0.5} unit="kg" />
              <label className="field">
                <span>Target weight (optional)</span>
                <input type="number" value={form.targetWeight} onChange={(e) => set('targetWeight')(e.target.value)} placeholder="e.g. 65" />
              </label>
              {liveBmi > 0 && (
                <div className="live-bmi">
                  Live BMI <strong>{liveBmi}</strong>
                  <span className="badge" style={{ background: `${bmiCategory(liveBmi).color}1f`, color: bmiCategory(liveBmi).color }}>
                    {bmiCategory(liveBmi).label}
                  </span>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="fade-up">
              <h2>Your lifestyle</h2>
              <p className="muted">How active are you on a typical week?</p>
              <OptionCards options={ACTIVITY_LEVELS} value={form.activity} onChange={set('activity')} columns={2} />
              <h4 className="label">Food preference</h4>
              <OptionCards options={DIETS} value={form.diet} onChange={set('diet')} columns={2} />
            </div>
          )}

          {step === 3 && summary && (
            <div className="fade-up results">
              <h2>Your personalised plan is ready 🎉</h2>
              <div className="results-grid">
                <div className="results-gauge">
                  <BmiGauge bmi={summary.bmi} size={240} />
                  <p className="muted small center">Healthy range for you: {summary.idealMin}–{summary.idealMax} kg</p>
                </div>
                <div className="results-stats stagger">
                  <div className="stat-tile"><small>Daily calorie target</small><strong>{summary.target} kcal</strong></div>
                  <div className="stat-tile"><small>Maintenance (TDEE)</small><strong>{summary.tdee} kcal</strong></div>
                  <div className="stat-tile"><small>Water goal</small><strong>{summary.waterGlasses} glasses</strong></div>
                  <div className="stat-tile">
                    <small>{summary.goal === 'lose' ? 'Expected loss' : 'Goal'}</small>
                    <strong>{summary.goal === 'lose' ? `~${summary.weeklyLossKg} kg / week` : 'Maintain & tone'}</strong>
                  </div>
                </div>
              </div>
              {summary.goal === 'maintain' && (
                <div className="alert alert-info">Your BMI is below the healthy range, so we’ve set a maintenance plan instead of a calorie deficit.</div>
              )}
            </div>
          )}
        </div>

        {error && <div className="alert alert-error shake">{error}</div>}

        <div className="onboard-actions">
          {step > 0 && step < 3 && (
            <button className="btn btn-ghost" onClick={() => setStep((s) => s - 1)}>← Back</button>
          )}
          <span className="spacer" />
          {step < 3 ? (
            <button className="btn btn-primary" onClick={next} disabled={busy}>
              {busy ? <span className="btn-spinner" /> : step === 2 ? 'See my plan ✨' : 'Continue →'}
            </button>
          ) : (
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/dashboard')}>Go to my dashboard →</button>
          )}
        </div>
      </div>
    </div>
  );
}

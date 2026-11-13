import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as profileService from '../services/profileService';
import { OptionCards, RangeField, validateProfile } from '../components/FormFields';
import BmiGauge from '../components/BmiGauge';
import { ACTIVITY_LEVELS, DIETS, GENDERS, healthSummary } from '../utils/health';

export default function Profile() {
  const { user, profile, saveProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ ...profile, targetWeight: profile.targetWeight || '' });
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
  const numeric = { ...form, age: +form.age, height: +form.height, weight: +form.weight, targetWeight: +form.targetWeight || '' };
  const preview = useMemo(() => healthSummary(numeric), [form]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSave = async (e) => {
    e.preventDefault();
    const err = validateProfile(numeric);
    if (err) return setMsg({ type: 'error', text: err });
    setBusy(true);
    await saveProfile(numeric);
    setBusy(false);
    setMsg({ type: 'success', text: 'Profile updated — your plan has been recalculated.' });
  };

  const [confirmReset, setConfirmReset] = useState(false);
  const onReset = async () => {
    if (!confirmReset) return setConfirmReset(true);
    await profileService.resetUserData(user.id);
    setConfirmReset(false);
    setMsg({ type: 'success', text: 'Your tracking data has been reset.' });
  };

  const onLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="profile-page">
      <div className="page-head fade-up">
        <div>
          <span className="eyebrow">Account</span>
          <h1>My profile</h1>
          <p className="muted">{user.name} · {user.email}</p>
        </div>
        <button className="btn btn-ghost" onClick={onLogout}>↩ Log out</button>
      </div>

      <div className="profile-grid">
        <form className="card profile-form fade-up" onSubmit={onSave}>
          <h3>Body & lifestyle</h3>
          <h4 className="label">Gender</h4>
          <OptionCards options={GENDERS} value={form.gender} onChange={set('gender')} />
          <RangeField label="Age" value={form.age} onChange={set('age')} min={13} max={90} unit="years" />
          <RangeField label="Height" value={form.height} onChange={set('height')} min={120} max={230} unit="cm" />
          <RangeField label="Weight" value={form.weight} onChange={set('weight')} min={30} max={200} step={0.5} unit="kg" />
          <label className="field">
            <span>Target weight (optional)</span>
            <input type="number" value={form.targetWeight} onChange={(e) => set('targetWeight')(e.target.value)} />
          </label>
          <h4 className="label">Activity level</h4>
          <OptionCards options={ACTIVITY_LEVELS} value={form.activity} onChange={set('activity')} columns={2} />
          <h4 className="label">Food preference</h4>
          <OptionCards options={DIETS} value={form.diet} onChange={set('diet')} columns={2} />

          {msg && <div className={`alert alert-${msg.type} fade-up`}>{msg.text}</div>}
          <button className="btn btn-primary btn-lg btn-block" disabled={busy}>
            {busy ? <span className="btn-spinner" /> : 'Save changes'}
          </button>
        </form>

        <aside className="profile-side">
          <div className="card center fade-up">
            <h3>Live preview</h3>
            <BmiGauge bmi={preview.bmi} size={220} />
            <div className="preview-stats">
              <div><small>Calories</small><strong>{preview.target}</strong></div>
              <div><small>TDEE</small><strong>{preview.tdee}</strong></div>
              <div><small>Water</small><strong>{preview.waterGlasses} 🥛</strong></div>
            </div>
          </div>
          <div className="card danger-zone fade-up">
            <h3>Danger zone</h3>
            <p className="muted small">Clears meal logs, workout history and generated plans.</p>
            <div className="reset-actions">
              <button className="btn btn-danger" onClick={onReset}>
                {confirmReset ? 'Yes, reset everything' : 'Reset tracking data'}
              </button>
              {confirmReset && (
                <button className="btn btn-ghost" onClick={() => setConfirmReset(false)}>Cancel</button>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

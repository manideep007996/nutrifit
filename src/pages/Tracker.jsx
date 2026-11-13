import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import * as trackerService from '../services/trackerService';
import * as profileService from '../services/profileService';
import { getDailyWorkout } from '../data/exercises';
import { healthSummary } from '../utils/health';
import { DAYS, dateKey, dayIndex, lastNDays, shortDate } from '../utils/date';
import WeightChart from '../components/WeightChart';

export default function Tracker() {
  const { user, profile, setProfile } = useAuth();
  const [range, setRange] = useState([]);
  const [weights, setWeights] = useState([]);
  const [newWeight, setNewWeight] = useState(profile.weight);
  const [saved, setSaved] = useState(false);
  const summary = useMemo(() => healthSummary(profile), [profile]);
  const workoutSize = useMemo(() => getDailyWorkout(profile).items.length, [profile]);

  useEffect(() => {
    trackerService.getRange(user.id, lastNDays(7).map((d) => dateKey(d))).then(setRange);
    profileService.getWeights(user.id).then(setWeights);
  }, [user.id]);

  const logWeight = async (e) => {
    e.preventDefault();
    const w = Number(newWeight);
    if (!(w >= 30 && w <= 250)) return;
    const list = await profileService.logWeight(user.id, w);
    setWeights(list);
    // keep the profile in sync so BMI / calorie targets update everywhere
    const p = await profileService.saveProfile(user.id, { weight: w });
    setProfile(p);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const totals = range.reduce(
    (t, d) => ({
      kcal: t.kcal + Object.values(d.meals).reduce((s, k) => s + k, 0),
      burned: t.burned + Object.values(d.exercises).reduce((s, k) => s + k, 0),
      meals: t.meals + Object.keys(d.meals).length,
      water: t.water + d.water,
      activeDays: t.activeDays + (Object.keys(d.exercises).length > 0 ? 1 : 0),
    }),
    { kcal: 0, burned: 0, meals: 0, water: 0, activeDays: 0 },
  );

  const start = weights[0]?.weight;
  const change = start != null ? Math.round((profile.weight - start) * 10) / 10 : 0;

  return (
    <div className="tracker-page">
      <div className="page-head fade-up">
        <div>
          <span className="eyebrow">Progress</span>
          <h1>Your tracker</h1>
          <p className="muted">Last 7 days at a glance. Small daily wins add up.</p>
        </div>
      </div>

      <section className="stats-grid stagger">
        <div className="card mini-stat"><small>Meals logged</small><strong>{totals.meals}<span>/28</span></strong></div>
        <div className="card mini-stat"><small>Active days</small><strong>{totals.activeDays}<span>/7</span></strong></div>
        <div className="card mini-stat"><small>Calories burned</small><strong>{totals.burned}<span> kcal</span></strong></div>
        <div className="card mini-stat">
          <small>Weight change</small>
          <strong className={change < 0 ? 'good' : change > 0 ? 'warn' : ''}>{change > 0 ? '+' : ''}{change}<span> kg</span></strong>
        </div>
      </section>

      <section className="tracker-grid">
        <div className="card">
          <div className="card-head">
            <h3>Weight trend</h3>
            <span className="muted small">Healthy range {summary.idealMin}–{summary.idealMax} kg</span>
          </div>
          <WeightChart data={weights.slice(-14)} target={profile.targetWeight} />
          <form className="weight-form" onSubmit={logWeight}>
            <label className="field inline">
              <span>Today’s weight</span>
              <div className="input-wrap">
                <input type="number" step="0.1" min="30" max="250" value={newWeight} onChange={(e) => setNewWeight(e.target.value)} />
                <span className="input-suffix">kg</span>
              </div>
            </label>
            <button className="btn btn-primary">{saved ? '✓ Saved' : 'Log weight'}</button>
          </form>
        </div>

        <div className="card">
          <div className="card-head"><h3>Daily log</h3></div>
          <div className="log-list stagger">
            {[...range].reverse().map((d) => {
              const kcal = Object.values(d.meals).reduce((s, k) => s + k, 0);
              const ex = Object.keys(d.exercises).length;
              const isToday = d.date === dateKey();
              return (
                <div key={d.date} className={`log-row ${isToday ? 'today' : ''}`}>
                  <div className="log-date">
                    <strong>{isToday ? 'Today' : DAYS[dayIndex(new Date(d.date + 'T00:00'))]}</strong>
                    <small className="muted">{shortDate(d.date)}</small>
                  </div>
                  <div className="log-metrics">
                    <div className="log-metric" title="Meals">
                      <span>🍽</span>
                      <div className="mini-track"><i style={{ width: `${(Object.keys(d.meals).length / 4) * 100}%` }} /></div>
                      <small>{Object.keys(d.meals).length}/4</small>
                    </div>
                    <div className="log-metric" title="Workout">
                      <span>🏋️</span>
                      <div className="mini-track"><i className="blue" style={{ width: `${Math.min(100, (ex / workoutSize) * 100)}%` }} /></div>
                      <small>{ex}/{workoutSize}</small>
                    </div>
                    <div className="log-metric" title="Water">
                      <span>💧</span>
                      <div className="mini-track"><i className="cyan" style={{ width: `${Math.min(100, (d.water / summary.waterGlasses) * 100)}%` }} /></div>
                      <small>{d.water}/{summary.waterGlasses}</small>
                    </div>
                  </div>
                  <span className="log-kcal">{kcal} kcal</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

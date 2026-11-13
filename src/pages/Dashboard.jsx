import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToday } from '../hooks/useToday';
import * as planService from '../services/planService';
import * as trackerService from '../services/trackerService';
import { getFood } from '../data/foods';
import { getDailyWorkout } from '../data/exercises';
import { MEAL_TYPES, healthSummary, scaleMeal } from '../utils/health';
import { DAYS, dateKey, dayIndex, greeting, lastNDays, prettyDate } from '../utils/date';
import BmiGauge from '../components/BmiGauge';
import ProgressRing from '../components/ProgressRing';
import ExerciseFigure from '../components/ExerciseFigure';

const TIPS = [
  'Drink a glass of water before every meal — it helps control portions.',
  'Aim for 7–8 hours of sleep. Poor sleep increases hunger hormones.',
  'Fill half your plate with vegetables for volume without the calories.',
  'A 10-minute walk after meals helps regulate blood sugar.',
  'Protein at every meal keeps you full for longer.',
  'Eat slowly — it takes 20 minutes for your brain to register fullness.',
  'Swap sugary drinks for buttermilk, lemon water or green tea.',
];

export default function Dashboard() {
  const { user, profile } = useAuth();
  const { day, update } = useToday();
  const [plan, setPlan] = useState(null);
  const [week, setWeek] = useState([]);

  const summary = useMemo(() => healthSummary(profile), [profile]);
  const workout = useMemo(() => getDailyWorkout(profile), [profile]);
  const todayIdx = dayIndex();

  useEffect(() => {
    planService.getWeeklyPlan(user.id, profile.diet).then(setPlan);
  }, [user.id, profile.diet]);

  useEffect(() => {
    trackerService.getRange(user.id, lastNDays(7).map((d) => dateKey(d))).then(setWeek);
  }, [user.id, day]);

  if (!day || !plan) return <div className="page-loading"><div className="spinner" /></div>;

  const meals = MEAL_TYPES.map((m) => {
    const food = getFood(plan.days[todayIdx][m.id]);
    return { ...m, food, ...scaleMeal(food, summary.target * m.share) };
  });
  const consumed = Object.values(day.meals).reduce((s, k) => s + k, 0);
  const burned = Object.values(day.exercises).reduce((s, k) => s + k, 0);
  const exDone = workout.items.filter((e) => day.exercises[e.id] != null).length;

  const toggleMeal = (m) =>
    update((d) => {
      const nextMeals = { ...d.meals };
      if (nextMeals[m.id] != null) delete nextMeals[m.id];
      else nextMeals[m.id] = m.kcal;
      return { ...d, meals: nextMeals };
    });

  const setWater = (delta) => update((d) => ({ ...d, water: Math.max(0, Math.min(20, d.water + delta)) }));

  const score = (d) =>
    Math.round(
      (Object.keys(d.meals).length / 4) * 50 +
        Math.min(1, Object.keys(d.exercises).length / workout.items.length) * 30 +
        Math.min(1, d.water / summary.waterGlasses) * 20,
    );

  return (
    <div className="dashboard">
      <section className="dash-hero card fade-up">
        <div>
          <span className="eyebrow">{prettyDate()}</span>
          <h1>{greeting()}, {user.name.split(' ')[0]} 👋</h1>
          <p className="muted">
            {consumed === 0
              ? 'A fresh day! Start with a healthy breakfast.'
              : consumed < summary.target
                ? `${summary.target - consumed} kcal left for today — you’re doing great.`
                : 'You’ve hit your calorie target for today. 🎯'}
          </p>
          <div className="dash-hero-actions">
            <Link to="/diet" className="btn btn-primary">View diet chart</Link>
            <Link to="/workouts" className="btn btn-ghost">Start workout</Link>
          </div>
        </div>
        <div className="dash-hero-figure">
          <ExerciseFigure anim={workout.items[2].id} size={170} />
        </div>
      </section>

      <section className="stats-grid stagger">
        <div className="card stat-card">
          <div className="stat-head"><span>⚖️ BMI</span><Link to="/profile" className="link-sm">Update</Link></div>
          <BmiGauge bmi={summary.bmi} size={190} />
        </div>

        <div className="card stat-card">
          <div className="stat-head"><span>🔥 Calories</span><small className="muted">Goal {summary.target}</small></div>
          <ProgressRing value={consumed / summary.target} size={140} stroke={12} color="var(--orange)">
            <strong className="ring-big">{consumed}</strong>
            <small className="muted">kcal eaten</small>
          </ProgressRing>
          <div className="macro-row">
            <span>P {summary.macros.protein}g</span><span>C {summary.macros.carbs}g</span><span>F {summary.macros.fat}g</span>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-head"><span>💧 Water</span><small className="muted">{day.water}/{summary.waterGlasses} glasses</small></div>
          <div className="water-glasses">
            {Array.from({ length: summary.waterGlasses }, (_, i) => (
              <button key={i} className={`glass ${i < day.water ? 'full' : ''}`} onClick={() => setWater(i < day.water ? i - day.water : i + 1 - day.water)} aria-label={`${i + 1} glasses`}>
                <span />
              </button>
            ))}
          </div>
          <div className="water-actions">
            <button className="btn btn-ghost btn-sm" onClick={() => setWater(-1)}>−</button>
            <button className="btn btn-primary btn-sm" onClick={() => setWater(1)}>+ Add glass</button>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-head"><span>🏋️ Workout</span><small className="muted">{exDone}/{workout.items.length} done</small></div>
          <ProgressRing value={exDone / workout.items.length} size={140} stroke={12}>
            <strong className="ring-big">{burned}</strong>
            <small className="muted">kcal burned</small>
          </ProgressRing>
          <Link to="/workouts" className="btn btn-ghost btn-sm">{exDone ? 'Continue' : 'Start'} workout →</Link>
        </div>
      </section>

      <section className="dash-grid">
        <div className="card">
          <div className="card-head">
            <h3>Today’s meals · {DAYS[todayIdx]}</h3>
            <Link to="/diet" className="link-sm">Full week →</Link>
          </div>
          <ul className="meal-list stagger">
            {meals.map((m) => {
              const eaten = day.meals[m.id] != null;
              return (
                <li key={m.id} className={`meal-row ${eaten ? 'eaten' : ''}`}>
                  <span className="meal-emoji">{m.food.emoji}</span>
                  <div className="meal-info">
                    <small>{m.emoji} {m.label} · {m.time}</small>
                    <strong>{m.food.name}</strong>
                    <small className="muted">{m.factor !== 1 ? `${m.factor}× · ` : ''}{m.food.portion}</small>
                  </div>
                  <span className="meal-kcal">{m.kcal} kcal</span>
                  <button className={`check ${eaten ? 'checked' : ''}`} onClick={() => toggleMeal(m)} aria-label={`Mark ${m.label} eaten`}>
                    <svg viewBox="0 0 24 24" width="16" height="16"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="dash-side">
          <div className="card">
            <div className="card-head"><h3>This week</h3><Link to="/tracker" className="link-sm">Details →</Link></div>
            <div className="week-bars">
              {week.map((d) => {
                const s = score(d);
                const isToday = d.date === dateKey();
                return (
                  <div key={d.date} className={`week-bar ${isToday ? 'today' : ''}`}>
                    <div className="bar-track"><span style={{ height: `${Math.max(4, s)}%` }} /></div>
                    <small>{DAYS[dayIndex(new Date(d.date + 'T00:00'))][0]}</small>
                  </div>
                );
              })}
            </div>
            <p className="muted small">Daily score from meals, workout and water.</p>
          </div>

          <div className="card tip-card">
            <span className="tip-icon">💡</span>
            <div>
              <h4>Tip of the day</h4>
              <p className="muted">{TIPS[todayIdx]}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

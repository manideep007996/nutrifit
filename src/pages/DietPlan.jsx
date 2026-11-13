import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToday } from '../hooks/useToday';
import * as planService from '../services/planService';
import { getFood } from '../data/foods';
import { DIETS, MEAL_TYPES, healthSummary, scaleMeal } from '../utils/health';
import { DAYS, DAY_NAMES, dayIndex } from '../utils/date';

export default function DietPlan() {
  const { user, profile, saveProfile } = useAuth();
  const { day: todayLog, update } = useToday();
  const [plan, setPlan] = useState(null);
  const [selected, setSelected] = useState(dayIndex());
  const [busy, setBusy] = useState(false);
  const [swapping, setSwapping] = useState('');
  const todayIdx = dayIndex();
  const diet = profile.diet;
  const summary = useMemo(() => healthSummary(profile), [profile]);

  useEffect(() => {
    document.querySelector('.day-tab.active')?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  }, [selected]);

  useEffect(() => {
    setPlan(null);
    planService.getWeeklyPlan(user.id, diet).then(setPlan);
  }, [user.id, diet]);

  const changeDiet = async (id) => {
    if (id !== diet) await saveProfile({ diet: id });
  };

  const regenerate = async () => {
    setBusy(true);
    setPlan(await planService.regeneratePlan(user.id, diet));
    setBusy(false);
  };

  const swap = async (mealId) => {
    setSwapping(mealId);
    setPlan(await planService.swapMeal(user.id, diet, selected, mealId));
    setSwapping('');
  };

  const mealsFor = (idx) =>
    MEAL_TYPES.map((m) => {
      const food = getFood(plan.days[idx][m.id]);
      return { ...m, food, ...scaleMeal(food, summary.target * m.share) };
    });

  const toggleEaten = (m) =>
    update((d) => {
      const meals = { ...d.meals };
      if (meals[m.id] != null) delete meals[m.id];
      else meals[m.id] = m.kcal;
      return { ...d, meals };
    });

  const dayMeals = plan ? mealsFor(selected) : [];
  const totals = dayMeals.reduce(
    (t, m) => ({ kcal: t.kcal + m.kcal, protein: t.protein + m.protein, carbs: t.carbs + m.carbs, fat: t.fat + m.fat }),
    { kcal: 0, protein: 0, carbs: 0, fat: 0 },
  );

  return (
    <div className="diet-page">
      <div className="page-head fade-up">
        <div>
          <span className="eyebrow">Weekly diet chart</span>
          <h1>Your meal plan</h1>
          <p className="muted">
            {summary.target} kcal/day · tuned for {summary.goal === 'lose' ? 'healthy weight loss' : 'maintenance'} · no dish repeats this week
          </p>
        </div>
        <div className="page-head-actions">
          <div className="segmented" style={{ '--idx': DIETS.findIndex((d) => d.id === diet) }}>
            <span className="segmented-pill" />
            {DIETS.map((d) => (
              <button key={d.id} className={diet === d.id ? 'active' : ''} onClick={() => changeDiet(d.id)}>
                {d.emoji} {d.short}
              </button>
            ))}
          </div>
          <button className="btn btn-ghost" onClick={regenerate} disabled={busy}>
            <span className={busy ? 'spin' : ''}>↻</span> New week plan
          </button>
        </div>
      </div>

      <div className="day-tabs fade-up">
        {DAYS.map((d, i) => (
          <button key={d} className={`day-tab ${selected === i ? 'active' : ''} ${i === todayIdx ? 'is-today' : ''}`} onClick={() => setSelected(i)}>
            {d}
            {i === todayIdx && <small>Today</small>}
          </button>
        ))}
      </div>

      {!plan ? (
        <div className="page-loading"><div className="spinner" /></div>
      ) : (
        <>
          <div className="day-summary card fade-up" key={`sum-${selected}-${diet}`}>
            <h3>{DAY_NAMES[selected]}</h3>
            <div className="day-totals">
              <span><strong>{totals.kcal}</strong> kcal</span>
              <span><strong>{totals.protein}g</strong> protein</span>
              <span><strong>{totals.carbs}g</strong> carbs</span>
              <span><strong>{totals.fat}g</strong> fat</span>
            </div>
          </div>

          <div className="meal-cards stagger" key={`${selected}-${diet}-${plan.version}`}>
            {dayMeals.map((m) => {
              const eaten = selected === todayIdx && todayLog?.meals[m.id] != null;
              const sum = m.protein * 4 + m.carbs * 4 + m.fat * 9 || 1;
              return (
                <article key={m.id} className={`card meal-card hover-lift ${swapping === m.id ? 'swapping' : ''}`}>
                  <header>
                    <span className="meal-type">{m.emoji} {m.label}</span>
                    <small className="muted">{m.time}</small>
                  </header>
                  <div className="meal-card-emoji">{m.food.emoji}</div>
                  <h3>{m.food.name}</h3>
                  <p className="muted small">
                    {m.food.portion}{m.factor !== 1 && <> · <strong className="serving">{m.factor}× serving</strong></>}
                  </p>
                  <div className="macro-bar" title="Protein / Carbs / Fat">
                    <span className="p" style={{ width: `${(m.protein * 4 * 100) / sum}%` }} />
                    <span className="c" style={{ width: `${(m.carbs * 4 * 100) / sum}%` }} />
                    <span className="f" style={{ width: `${(m.fat * 9 * 100) / sum}%` }} />
                  </div>
                  <div className="macro-legend">
                    <span><i className="p" />P {m.protein}g</span>
                    <span><i className="c" />C {m.carbs}g</span>
                    <span><i className="f" />F {m.fat}g</span>
                  </div>
                  <footer>
                    <strong className="kcal">{m.kcal} kcal</strong>
                    <div className="meal-card-actions">
                      <button className="btn btn-ghost btn-sm" onClick={() => swap(m.id)} title="Swap for another dish">⇄ Swap</button>
                      {selected === todayIdx && (
                        <button className={`btn btn-sm ${eaten ? 'btn-success' : 'btn-primary'}`} onClick={() => toggleEaten(m)}>
                          {eaten ? '✓ Eaten' : 'Mark eaten'}
                        </button>
                      )}
                    </div>
                  </footer>
                </article>
              );
            })}
          </div>

          <section className="card week-table-card fade-up">
            <div className="card-head">
              <h3>Week at a glance</h3>
              <span className="badge badge-green">{DIETS.find((d) => d.id === diet).emoji} {DIETS.find((d) => d.id === diet).label}</span>
            </div>
            <div className="table-scroll">
              <table className="week-table">
                <thead>
                  <tr>
                    <th>Day</th>
                    {MEAL_TYPES.map((m) => <th key={m.id}>{m.emoji} {m.label}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {plan.days.map((d, i) => (
                    <tr key={d.day} className={`${i === todayIdx ? 'today' : ''} ${i === selected ? 'selected' : ''}`} onClick={() => setSelected(i)}>
                      <td><strong>{d.day}</strong></td>
                      {MEAL_TYPES.map((m) => {
                        const f = getFood(d[m.id]);
                        return <td key={m.id}><span className="cell-emoji">{f.emoji}</span>{f.name}</td>;
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

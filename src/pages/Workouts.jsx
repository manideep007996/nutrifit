import { useCallback, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToday } from '../hooks/useToday';
import { EXERCISES, getDailyWorkout } from '../data/exercises';
import { caloriesBurned } from '../utils/health';
import ExerciseFigure from '../components/ExerciseFigure';
import Modal from '../components/Modal';
import WorkoutPlayer from '../components/WorkoutPlayer';
import ProgressRing from '../components/ProgressRing';

const FILTERS = [
  { id: 'today', label: 'Today’s routine' },
  { id: 'all', label: 'All exercises' },
  { id: 'low', label: 'Low impact' },
];

export default function Workouts() {
  const { profile } = useAuth();
  const { day, update } = useToday();
  const [filter, setFilter] = useState('today');
  const [player, setPlayer] = useState(null); // { items, index }

  const workout = useMemo(() => getDailyWorkout(profile), [profile]);
  const library = useMemo(
    () =>
      EXERCISES.map((e) => ({ ...e, kcal: Math.max(1, caloriesBurned(e.met, profile.weight, e.seconds)) })),
    [profile.weight],
  );

  const list = filter === 'today' ? workout.items : filter === 'low' ? library.filter((e) => e.impact === 'low') : library;
  const doneMap = day?.exercises || {};
  const doneCount = workout.items.filter((e) => doneMap[e.id] != null).length;

  const onComplete = useCallback(
    (item) => update((d) => ({ ...d, exercises: { ...d.exercises, [item.id]: item.kcal } })),
    [update],
  );

  const minutes = Math.round(workout.totalSeconds / 60);

  return (
    <div className="workouts-page">
      <section className="card workout-hero fade-up">
        <div className="workout-hero-copy">
          <span className="eyebrow">Today’s workout</span>
          <h1>{minutes}-minute fat-burn routine</h1>
          <p className="muted">
            {workout.lowImpact
              ? 'A joint-friendly, low-impact session chosen for your BMI and activity level.'
              : 'A balanced cardio + strength session. Exercises rotate daily to keep it fresh.'}
          </p>
          <div className="chips">
            <span className="chip">🎯 {workout.level}</span>
            <span className="chip">⏱ {minutes} min</span>
            <span className="chip">🔥 ~{workout.totalKcal} kcal</span>
            <span className="chip">🏋️ {workout.items.length} exercises</span>
          </div>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => {
              const firstTodo = workout.items.findIndex((e) => doneMap[e.id] == null);
              setPlayer({ items: workout.items, index: firstTodo === -1 ? 0 : firstTodo });
            }}
          >
            {doneCount === 0 ? '▶ Start workout' : doneCount === workout.items.length ? '↻ Do it again' : '▶ Continue workout'}
          </button>
        </div>
        <ProgressRing value={doneCount / workout.items.length} size={150} stroke={12}>
          <strong className="ring-big">{doneCount}/{workout.items.length}</strong>
          <small className="muted">completed</small>
        </ProgressRing>
      </section>

      <div className="filter-tabs fade-up">
        {FILTERS.map((f) => (
          <button key={f.id} className={`filter-tab ${filter === f.id ? 'active' : ''}`} onClick={() => setFilter(f.id)}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="exercise-grid stagger" key={filter}>
        {list.map((e, i) => {
          const done = doneMap[e.id] != null;
          return (
            <article
              key={e.id}
              className={`card exercise-card hover-lift ${done ? 'done' : ''}`}
              onClick={() => setPlayer({ items: list, index: i })}
              tabIndex={0}
              onKeyDown={(ev) => ev.key === 'Enter' && setPlayer({ items: list, index: i })}
            >
              <div className="exercise-figure">
                <ExerciseFigure anim={e.id} size={150} />
                {filter === 'today' && <span className="ex-order">{i + 1}</span>}
                {done && <span className="ex-done pop">✓</span>}
              </div>
              <div className="exercise-body">
                <div className="exercise-title">
                  <h3>{e.name}</h3>
                  <span className={`chip ${e.impact === 'low' ? 'chip-green' : 'chip-orange'}`}>{e.impact}</span>
                </div>
                <p className="muted small">{e.muscles.join(' · ')}</p>
                <div className="exercise-meta">
                  <span>⏱ {e.seconds}s</span>
                  <span>🔥 {e.kcal} kcal</span>
                  <span className="role">{e.role}</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <Modal open={!!player} onClose={() => setPlayer(null)} width={900}>
        {player && (
          <WorkoutPlayer
            items={player.items}
            startIndex={player.index}
            doneMap={doneMap}
            onComplete={onComplete}
            onClose={() => setPlayer(null)}
          />
        )}
      </Modal>
    </div>
  );
}

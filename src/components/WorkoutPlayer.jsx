import { useEffect, useState } from 'react';
import ExerciseFigure from './ExerciseFigure';
import ProgressRing from './ProgressRing';

const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

/** Guided timer that walks through a list of exercises */
export default function WorkoutPlayer({ items, startIndex = 0, doneMap = {}, onComplete, onClose }) {
  const [index, setIndex] = useState(startIndex);
  const item = items[index];
  const [remaining, setRemaining] = useState(item.seconds);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    setRemaining(items[index].seconds);
    setRunning(false);
    setFinished(false);
  }, [index, items]);

  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (running && remaining === 0) {
      setRunning(false);
      setFinished(true);
      onComplete(item);
    }
  }, [remaining, running, item, onComplete]);

  const markDone = () => {
    setRunning(false);
    setFinished(true);
    onComplete(item);
  };

  const isLast = index === items.length - 1;
  const done = finished || doneMap[item.id] != null;

  return (
    <div className="player">
      <div className="player-visual">
        <div className="player-figure">
          <ExerciseFigure anim={item.id} playing={running || !done} size={260} />
        </div>
        <div className="player-dots">
          {items.map((it, i) => (
            <button
              key={it.id}
              className={`dot ${i === index ? 'active' : ''} ${doneMap[it.id] != null ? 'done' : ''}`}
              onClick={() => setIndex(i)}
              aria-label={it.name}
            />
          ))}
        </div>
      </div>

      <div className="player-info">
        <span className="eyebrow">Exercise {index + 1} of {items.length}</span>
        <h2>{item.emoji} {item.name}</h2>
        <div className="chips">
          {item.muscles.map((m) => <span key={m} className="chip">{m}</span>)}
          <span className={`chip ${item.impact === 'low' ? 'chip-green' : 'chip-orange'}`}>{item.impact} impact</span>
        </div>

        <div className="player-timer">
          <ProgressRing value={1 - remaining / item.seconds} size={132} stroke={10} color={done ? 'var(--primary)' : 'var(--orange)'}>
            {done ? <span className="timer-done pop">✓</span> : <span className="timer-text">{fmt(remaining)}</span>}
          </ProgressRing>
          <div className="player-meta">
            <div><small>Duration</small><strong>{item.seconds}s</strong></div>
            <div><small>Burns ≈</small><strong>{item.kcal} kcal</strong></div>
          </div>
        </div>

        <ol className="steps-list">
          {item.steps.map((s) => <li key={s}>{s}</li>)}
        </ol>
        <p className="tip">💡 {item.tip}</p>

        <div className="player-actions">
          {!done ? (
            <>
              <button className="btn btn-primary" onClick={() => setRunning((r) => !r)}>
                {running ? '❚❚ Pause' : remaining < item.seconds ? '▶ Resume' : '▶ Start'}
              </button>
              <button className="btn btn-ghost" onClick={() => setRemaining(item.seconds)}>↺ Reset</button>
              <button className="btn btn-ghost" onClick={markDone}>Mark done</button>
            </>
          ) : isLast ? (
            <button className="btn btn-primary" onClick={onClose}>🎉 Finish workout</button>
          ) : (
            <button className="btn btn-primary" onClick={() => setIndex(index + 1)}>Next: {items[index + 1].name} →</button>
          )}
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { bmiCategory } from '../utils/health';

const MIN = 15;
const MAX = 40;
const SEGMENTS = [
  [15, 18.5, '#60a5fa'],
  [18.5, 25, '#34d399'],
  [25, 30, '#fbbf24'],
  [30, 40, '#f87171'],
];

const point = (v, r, cx = 100, cy = 100) => {
  const theta = Math.PI * (1 - (v - MIN) / (MAX - MIN));
  return [cx + r * Math.cos(theta), cy - r * Math.sin(theta)];
};

export default function BmiGauge({ bmi, size = 220, showLabel = true }) {
  const [shown, setShown] = useState(MIN);
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(Math.min(MAX, Math.max(MIN, bmi))));
    return () => cancelAnimationFrame(id);
  }, [bmi]);

  const cat = bmiCategory(bmi);
  const angle = ((shown - MIN) / (MAX - MIN)) * 180 - 90;

  return (
    <div className="gauge" style={{ width: size }}>
      <svg viewBox="0 0 200 116" width="100%">
        {SEGMENTS.map(([a, b, color]) => {
          const [x1, y1] = point(a + 0.25, 80);
          const [x2, y2] = point(b - 0.25, 80);
          return (
            <path key={a} d={`M${x1} ${y1} A80 80 0 0 1 ${x2} ${y2}`} stroke={color} strokeWidth="16" fill="none" strokeLinecap="round" />
          );
        })}
        <g className="gauge-needle" style={{ transform: `rotate(${angle}deg)` }}>
          <line x1="100" y1="100" x2="100" y2="34" stroke="var(--text)" strokeWidth="4" strokeLinecap="round" />
        </g>
        <circle cx="100" cy="100" r="8" fill="var(--text)" />
        <circle cx="100" cy="100" r="3" fill="var(--surface)" />
      </svg>
      {showLabel && (
        <div className="gauge-label">
          <strong>{bmi.toFixed(1)}</strong>
          <span className="badge" style={{ background: `${cat.color}1f`, color: cat.color }}>{cat.label}</span>
        </div>
      )}
    </div>
  );
}

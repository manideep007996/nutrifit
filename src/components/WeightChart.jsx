import { shortDate } from '../utils/date';

export default function WeightChart({ data, target }) {
  if (data.length < 2) {
    return <div className="empty">Log your weight on different days to see your trend 📈</div>;
  }
  const W = 600;
  const H = 220;
  const P = { l: 40, r: 16, t: 16, b: 30 };
  const values = data.map((d) => d.weight).concat(target ? [target] : []);
  const min = Math.floor(Math.min(...values) - 1);
  const max = Math.ceil(Math.max(...values) + 1);
  const x = (i) => P.l + (i / (data.length - 1)) * (W - P.l - P.r);
  const y = (v) => P.t + (1 - (v - min) / (max - min)) * (H - P.t - P.b);
  const line = data.map((d, i) => `${i ? 'L' : 'M'}${x(i)} ${y(d.weight)}`).join(' ');
  const area = `${line} L${x(data.length - 1)} ${H - P.b} L${x(0)} ${H - P.b} Z`;
  const ticks = [min, (min + max) / 2, max];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="chart" width="100%">
      <defs>
        <linearGradient id="wgrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={P.l} x2={W - P.r} y1={y(t)} y2={y(t)} className="chart-grid" />
          <text x={P.l - 8} y={y(t) + 4} textAnchor="end" className="chart-label">{t.toFixed(0)}</text>
        </g>
      ))}
      {target && (
        <g>
          <line x1={P.l} x2={W - P.r} y1={y(target)} y2={y(target)} className="chart-target" />
          <text x={W - P.r} y={y(target) - 6} textAnchor="end" className="chart-label">Target {target} kg</text>
        </g>
      )}
      <path d={area} fill="url(#wgrad)" />
      <path d={line} className="chart-line" />
      {data.map((d, i) => (
        <g key={d.date}>
          <circle cx={x(i)} cy={y(d.weight)} r="4.5" className="chart-dot" />
          {(i === 0 || i === data.length - 1 || data.length <= 8) && (
            <text x={x(i)} y={H - 10} textAnchor="middle" className="chart-label">{shortDate(d.date)}</text>
          )}
        </g>
      ))}
    </svg>
  );
}

export function OptionCards({ options, value, onChange, columns = 3 }) {
  return (
    <div className="option-grid" style={{ '--cols': columns }}>
      {options.map((o) => (
        <button
          type="button"
          key={o.id}
          className={`option-card ${value === o.id ? 'selected' : ''}`}
          onClick={() => onChange(o.id)}
        >
          <span className="option-emoji">{o.emoji}</span>
          <strong>{o.label}</strong>
          {o.desc && <small>{o.desc}</small>}
        </button>
      ))}
    </div>
  );
}

export function RangeField({ label, value, onChange, min, max, step = 1, unit }) {
  const pct = ((Number(value) - min) / (max - min)) * 100;
  return (
    <div className="range-field">
      <div className="range-head">
        <span>{label}</span>
        <div className="range-value">
          <input
            type="number"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(e) => onChange(e.target.value)}
          />
          <small>{unit}</small>
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={Math.min(max, Math.max(min, Number(value) || min))}
        onChange={(e) => onChange(e.target.value)}
        style={{ '--pct': `${Math.min(100, Math.max(0, pct))}%` }}
      />
    </div>
  );
}

export function validateProfile(f) {
  if (!f.gender) return 'Please select your gender.';
  if (!(f.age >= 13 && f.age <= 90)) return 'Age must be between 13 and 90.';
  if (!(f.height >= 120 && f.height <= 230)) return 'Height must be between 120 and 230 cm.';
  if (!(f.weight >= 30 && f.weight <= 250)) return 'Weight must be between 30 and 250 kg.';
  if (f.targetWeight && !(f.targetWeight >= 30 && f.targetWeight <= 250)) return 'Target weight must be between 30 and 250 kg.';
  return '';
}

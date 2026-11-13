export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const pad = (n) => String(n).padStart(2, '0');

/** Local-date key, e.g. 2026-11-13 */
export const dateKey = (d = new Date()) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** Monday = 0 … Sunday = 6 */
export const dayIndex = (d = new Date()) => (d.getDay() + 6) % 7;

export const weekStart = (d = new Date()) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() - dayIndex(x));
  return x;
};

export const weekKey = (d = new Date()) => dateKey(weekStart(d));

/** Array of the last n dates, oldest first, ending today */
export const lastNDays = (n) =>
  Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - (n - 1 - i));
    return d;
  });

export const greeting = (d = new Date()) => {
  const h = d.getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

export const prettyDate = (d = new Date()) =>
  d.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' });

export const shortDate = (key) => {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
};

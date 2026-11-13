import { storage } from './storage';
import { dateKey } from '../utils/date';

// Per-day log: { meals: { breakfast: kcal, … }, water: n, exercises: { id: kcal } }
// Backend swap: GET /users/:id/logs?from=&to=, PUT /users/:id/logs/:date

const key = (userId) => `tracker_${userId}`;
const emptyDay = () => ({ meals: {}, water: 0, exercises: {} });

export async function getDay(userId, date = dateKey()) {
  const all = storage.get(key(userId), {});
  return { ...emptyDay(), ...all[date] };
}

export async function updateDay(userId, date, updater) {
  const all = storage.get(key(userId), {});
  const current = { ...emptyDay(), ...all[date] };
  const next = typeof updater === 'function' ? updater(current) : { ...current, ...updater };
  all[date] = next;
  storage.set(key(userId), all);
  return next;
}

export async function getRange(userId, dates) {
  const all = storage.get(key(userId), {});
  return dates.map((date) => ({ date, ...emptyDay(), ...all[date] }));
}

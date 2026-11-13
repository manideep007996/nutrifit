import { storage, delay } from './storage';
import { dateKey } from '../utils/date';

// Backend swap: GET/PUT /users/:id/profile, GET/POST /users/:id/weights

const profileKey = (userId) => `profile_${userId}`;
const weightsKey = (userId) => `weights_${userId}`;

export async function getProfile(userId) {
  return storage.get(profileKey(userId));
}

export async function saveProfile(userId, data) {
  await delay();
  const existing = storage.get(profileKey(userId));
  const profile = {
    ...existing,
    ...data,
    userId,
    age: Number(data.age ?? existing?.age),
    height: Number(data.height ?? existing?.height),
    weight: Number(data.weight ?? existing?.weight),
    targetWeight: data.targetWeight ? Number(data.targetWeight) : existing?.targetWeight ?? null,
    createdAt: existing?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  storage.set(profileKey(userId), profile);
  if (!existing || existing.weight !== profile.weight) {
    await logWeight(userId, profile.weight, { silent: true });
  }
  return profile;
}

export async function getWeights(userId) {
  return storage.get(weightsKey(userId), []);
}

/** One entry per day — logging again on the same day overwrites it */
export async function logWeight(userId, weight, { silent = false } = {}) {
  if (!silent) await delay(150);
  const today = dateKey();
  const list = storage.get(weightsKey(userId), []).filter((w) => w.date !== today);
  const next = [...list, { date: today, weight: Number(weight) }].sort((a, b) => a.date.localeCompare(b.date));
  storage.set(weightsKey(userId), next);
  return next;
}

export async function resetUserData(userId) {
  await delay();
  ['plan_', 'tracker_'].forEach((p) => {
    storage.remove(`${p}${userId}_veg`);
    storage.remove(`${p}${userId}_nonveg`);
    storage.remove(`${p}${userId}`);
  });
}

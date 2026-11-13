import { storage, delay } from './storage';
import { FOODS } from '../data/foods';
import { DAYS, weekKey } from '../utils/date';
import { hashString, mulberry32, shuffle } from '../utils/random';
import { MEAL_TYPES } from '../utils/health';

// Weekly plan: 7 days × 4 meals, every dish unique within its meal slot for
// the week. Seeded by user + week, so it's stable until regenerated.
// Backend swap: GET /users/:id/plans?week=…&diet=…, POST …/regenerate, PATCH …/swap

const key = (userId, diet) => `plan_${userId}_${diet}`;

function buildPlan(userId, diet, wk, version) {
  const rand = mulberry32(hashString(`${userId}|${wk}|${diet}|${version}`));
  const picks = Object.fromEntries(
    MEAL_TYPES.map(({ id }) => [id, shuffle(FOODS[diet][id], rand).slice(0, 7).map((f) => f.id)]),
  );
  return {
    weekKey: wk,
    diet,
    version,
    days: DAYS.map((day, i) => ({
      day,
      ...Object.fromEntries(MEAL_TYPES.map(({ id }) => [id, picks[id][i]])),
    })),
  };
}

export async function getWeeklyPlan(userId, diet) {
  const wk = weekKey();
  let plan = storage.get(key(userId, diet));
  if (!plan || plan.weekKey !== wk) {
    plan = buildPlan(userId, diet, wk, 0);
    storage.set(key(userId, diet), plan);
  }
  return plan;
}

export async function regeneratePlan(userId, diet) {
  await delay(400);
  const current = await getWeeklyPlan(userId, diet);
  const plan = buildPlan(userId, diet, weekKey(), current.version + 1);
  storage.set(key(userId, diet), plan);
  return plan;
}

/** Replace one dish with one not used anywhere else in the week */
export async function swapMeal(userId, diet, dayIdx, mealType) {
  await delay(150);
  const plan = await getWeeklyPlan(userId, diet);
  const used = new Set(plan.days.map((d) => d[mealType]));
  const pool = FOODS[diet][mealType].filter((f) => !used.has(f.id));
  if (!pool.length) return plan;
  const choice = pool[Math.floor(Math.random() * pool.length)];
  const next = {
    ...plan,
    days: plan.days.map((d, i) => (i === dayIdx ? { ...d, [mealType]: choice.id } : d)),
  };
  storage.set(key(userId, diet), next);
  return next;
}

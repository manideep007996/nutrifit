export const ACTIVITY_LEVELS = [
  { id: 'sedentary', label: 'Sedentary', desc: 'Desk job, little exercise', factor: 1.2, emoji: '🪑' },
  { id: 'light', label: 'Lightly active', desc: 'Exercise 1–3 days/week', factor: 1.375, emoji: '🚶' },
  { id: 'moderate', label: 'Moderately active', desc: 'Exercise 3–5 days/week', factor: 1.55, emoji: '🏃' },
  { id: 'active', label: 'Very active', desc: 'Hard exercise 6–7 days/week', factor: 1.725, emoji: '🔥' },
];

export const GENDERS = [
  { id: 'male', label: 'Male', emoji: '👨' },
  { id: 'female', label: 'Female', emoji: '👩' },
  { id: 'other', label: 'Other', emoji: '🧑' },
];

export const DIETS = [
  { id: 'veg', label: 'Vegetarian', short: 'Veg', emoji: '🥦', desc: 'Plant based + dairy' },
  { id: 'nonveg', label: 'Non-Vegetarian', short: 'Non-Veg', emoji: '🍗', desc: 'Eggs, chicken & fish' },
];

export const MEAL_TYPES = [
  { id: 'breakfast', label: 'Breakfast', time: '8:00 AM', emoji: '🌅', share: 0.25 },
  { id: 'lunch', label: 'Lunch', time: '1:00 PM', emoji: '☀️', share: 0.35 },
  { id: 'snack', label: 'Snack', time: '4:30 PM', emoji: '🍎', share: 0.1 },
  { id: 'dinner', label: 'Dinner', time: '7:30 PM', emoji: '🌙', share: 0.3 },
];

export function calcBMI(weightKg, heightCm) {
  if (!weightKg || !heightCm) return 0;
  const m = heightCm / 100;
  return Math.round((weightKg / (m * m)) * 10) / 10;
}

export function bmiCategory(bmi) {
  if (bmi < 18.5) return { key: 'under', label: 'Underweight', color: '#3b82f6' };
  if (bmi < 25) return { key: 'normal', label: 'Healthy', color: '#10b981' };
  if (bmi < 30) return { key: 'over', label: 'Overweight', color: '#f59e0b' };
  return { key: 'obese', label: 'Obese', color: '#ef4444' };
}

/** Mifflin–St Jeor */
export function calcBMR({ weight, height, age, gender }) {
  const base = 10 * weight + 6.25 * height - 5 * age;
  if (gender === 'male') return Math.round(base + 5);
  if (gender === 'female') return Math.round(base - 161);
  return Math.round(base - 78);
}

export function healthSummary(profile) {
  const bmi = calcBMI(profile.weight, profile.height);
  const category = bmiCategory(bmi);
  const bmr = calcBMR(profile);
  const activity = ACTIVITY_LEVELS.find((a) => a.id === profile.activity) || ACTIVITY_LEVELS[0];
  const tdee = Math.round(bmr * activity.factor);

  // Never push an underweight person into a deficit
  const goal = category.key === 'under' ? 'maintain' : 'lose';
  const floor = profile.gender === 'female' ? 1200 : 1500;
  const target = goal === 'maintain' ? tdee : Math.min(tdee, Math.max(tdee - 500, floor));
  const deficit = tdee - target;

  const m = profile.height / 100;
  const idealMin = Math.round(18.5 * m * m);
  const idealMax = Math.round(24.9 * m * m);
  const waterGlasses = Math.max(6, Math.round((profile.weight * 0.033 * 1000) / 250));

  return {
    bmi,
    category,
    bmr,
    tdee,
    target,
    deficit,
    goal,
    idealMin,
    idealMax,
    waterGlasses,
    weeklyLossKg: Math.round(((deficit * 7) / 7700) * 100) / 100,
    macros: {
      protein: Math.round((target * 0.3) / 4),
      carbs: Math.round((target * 0.4) / 4),
      fat: Math.round((target * 0.3) / 9),
    },
  };
}

/** Scale a dish to fit the meal's calorie budget (servings in 0.25 steps) */
export function scaleMeal(food, targetKcal) {
  let factor = Math.round((targetKcal / food.kcal) * 4) / 4;
  factor = Math.min(2, Math.max(0.75, factor));
  return {
    factor,
    kcal: Math.round(food.kcal * factor),
    protein: Math.round(food.protein * factor),
    carbs: Math.round(food.carbs * factor),
    fat: Math.round(food.fat * factor),
  };
}

/** kcal = MET × 3.5 × kg / 200 per minute */
export function caloriesBurned(met, weightKg, seconds) {
  return Math.round(((met * 3.5 * weightKg) / 200) * (seconds / 60));
}

# NutriFit — Personalised Meal & Day Tracker

React + JavaScript (Vite) app for healthy weight loss: BMI and calorie targets, non-repeating
veg / non-veg weekly diet charts, animated workouts and a daily tracker.
All data is in **localStorage** for now, behind a service layer that's ready for a backend.

## Run

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
```

## User flow

Landing (register) → Login → Personalised welcome → **Get started** → Onboarding
(gender, age, height, weight, activity, veg/non-veg) → BMI results → Dashboard. Log out is in the avatar menu.

## Features

| Area | What it does |
|---|---|
| **Health maths** (`src/utils/health.js`) | BMI + category, BMR (Mifflin–St Jeor), TDEE, calorie target (−500 kcal, with safe floors; maintenance if underweight), ideal weight range, water goal, macros |
| **Diet plan** | 7 days × breakfast / lunch / snack / dinner. 10 dishes per slot per diet, shuffled with a seed per user and week, so **no dish repeats within the week**. Portions are scaled to your calorie target. You can swap a dish, generate a new week, or switch Veg / Non-Veg |
| **Workouts** | 12 exercises with **animated trainer demos** (SVG with forward kinematics, `src/components/ExerciseFigure.jsx`). The daily routine rotates and switches to low impact for BMI ≥ 30 or sedentary users. Guided timer player, calories from METs |
| **Tracker** | Tick off meals, water glasses, completed exercises, weight log + trend chart, 7-day history and score |

## Project structure

```
src/
  services/      ← the ONLY place that touches storage (swap these for API calls)
    storage.js, authService.js, profileService.js, planService.js, trackerService.js
  context/       AuthContext (user, profile, login/register/logout)
  data/          foods.js, exercises.js, animations.js (pose keyframes)
  utils/         health.js, date.js, random.js
  components/    ExerciseFigure, BmiGauge, ProgressRing, WorkoutPlayer, Modal, AppLayout, Guards…
  hooks/         useToday.js
  pages/         Landing, Login, Welcome, Onboarding, Dashboard, DietPlan, Workouts, Tracker, Profile
```

## Moving to a backend later

Every service function is already `async` and returns plain objects, so pages won't change.
Replace each function body with a `fetch` to your API. The endpoints are suggested in each file's header comment:

```js
// authService.js
export async function login(email, password) {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Login failed');
  const { user, token } = await res.json();
  storage.set('session', { token, userId: user.id }); // or use an httpOnly cookie
  return user;
}
```

Copy `.env.example` to `.env` and set `VITE_API_BASE_URL`.

> ⚠️ The local auth is for prototyping only. Passwords are SHA-256 hashed in the browser, which is
> **not** secure. Real authentication and hashing (e.g. bcrypt/argon2) must live on the server.

Nutrition and calorie numbers are estimates for general guidance, not medical advice.

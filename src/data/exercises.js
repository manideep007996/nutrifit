import { calcBMI, caloriesBurned } from '../utils/health';
import { dateKey } from '../utils/date';
import { hashString, mulberry32, shuffle } from '../utils/random';

// impact: 'low' = no jumping, joint friendly
export const EXERCISES = [
  {
    id: 'arm-circles', name: 'Arm Circles', emoji: '🌀', role: 'warmup', impact: 'low', met: 2.8,
    seconds: 40, muscles: ['Shoulders', 'Upper back'],
    steps: ['Stand tall, feet hip-width apart.', 'Raise arms out to shoulder height.', 'Make small controlled circles, then reverse.'],
    tip: 'Keep your shoulders down, away from your ears.',
  },
  {
    id: 'march', name: 'Brisk March in Place', emoji: '🚶', role: 'warmup', impact: 'low', met: 4.3,
    seconds: 60, muscles: ['Legs', 'Cardio'],
    steps: ['Stand tall with a tight core.', 'Lift knees to hip height one at a time.', 'Swing opposite arm with each step.'],
    tip: 'Great low-impact cardio — pick up the pace as you warm up.',
  },
  {
    id: 'jumping-jacks', name: 'Jumping Jacks', emoji: '⭐', role: 'warmup', impact: 'high', met: 8,
    seconds: 45, muscles: ['Full body', 'Cardio'],
    steps: ['Start with feet together, arms at sides.', 'Jump feet out while raising arms overhead.', 'Jump back to start and repeat.'],
    tip: 'Land softly on the balls of your feet.',
  },
  {
    id: 'squats', name: 'Bodyweight Squats', emoji: '🦵', role: 'main', impact: 'low', met: 5,
    seconds: 45, muscles: ['Quads', 'Glutes', 'Core'],
    steps: ['Feet shoulder-width, toes slightly out.', 'Push hips back and bend knees, arms forward.', 'Lower until thighs are parallel, then drive up.'],
    tip: 'Keep your chest up and knees tracking over toes.',
  },
  {
    id: 'lunges', name: 'Alternating Lunges', emoji: '🏃', role: 'main', impact: 'low', met: 4,
    seconds: 45, muscles: ['Quads', 'Glutes', 'Hamstrings'],
    steps: ['Stand tall, hands relaxed.', 'Step forward and lower the back knee toward the floor.', 'Push back to standing and switch legs.'],
    tip: 'Front knee stays above the ankle, never past the toes.',
  },
  {
    id: 'push-ups', name: 'Push-ups', emoji: '💪', role: 'main', impact: 'low', met: 4.5,
    seconds: 40, muscles: ['Chest', 'Triceps', 'Core'],
    steps: ['High plank, hands under shoulders.', 'Lower your chest with elbows at 45°.', 'Press back up keeping a straight line.'],
    tip: 'Too hard? Drop to your knees — same benefits.',
  },
  {
    id: 'side-crunch', name: 'Standing Side Crunch', emoji: '🔄', role: 'main', impact: 'low', met: 4,
    seconds: 45, muscles: ['Obliques', 'Core', 'Hips'],
    steps: ['Hands behind your head, elbows wide.', 'Lift one knee to the side toward the same elbow.', 'Return and alternate sides.'],
    tip: 'Squeeze your side abs — move slowly and with control.',
  },
  {
    id: 'high-knees', name: 'High Knees', emoji: '🔥', role: 'main', impact: 'high', met: 8,
    seconds: 35, muscles: ['Hip flexors', 'Cardio'],
    steps: ['Stand tall, arms bent.', 'Drive one knee up to hip height.', 'Switch quickly, pumping your arms.'],
    tip: 'Stay on the balls of your feet and keep a fast rhythm.',
  },
  {
    id: 'butt-kicks', name: 'Butt Kicks', emoji: '🦶', role: 'main', impact: 'high', met: 7,
    seconds: 35, muscles: ['Hamstrings', 'Cardio'],
    steps: ['Jog lightly in place.', 'Kick your heels up toward your glutes.', 'Keep thighs pointing down and arms pumping.'],
    tip: 'Quick, light steps — think of a springy jog.',
  },
  {
    id: 'mountain-climbers', name: 'Mountain Climbers', emoji: '⛰️', role: 'main', impact: 'high', met: 8,
    seconds: 35, muscles: ['Core', 'Shoulders', 'Cardio'],
    steps: ['Start in a high plank.', 'Drive one knee toward your chest.', 'Switch legs quickly, like running.'],
    tip: 'Keep hips level — don’t let them pike up.',
  },
  {
    id: 'burpees', name: 'Burpees', emoji: '⚡', role: 'main', impact: 'high', met: 8,
    seconds: 35, muscles: ['Full body', 'Cardio'],
    steps: ['Squat down and place hands on the floor.', 'Jump feet back into a plank.', 'Jump feet in and explode up with arms overhead.'],
    tip: 'Go at your own pace — form beats speed.',
  },
  {
    id: 'plank', name: 'Forearm Plank', emoji: '🧱', role: 'finisher', impact: 'low', met: 3.8,
    seconds: 40, muscles: ['Core', 'Shoulders', 'Glutes'],
    steps: ['Forearms on the floor, elbows under shoulders.', 'Lift hips to form a straight line.', 'Brace your core and breathe steadily.'],
    tip: 'Squeeze glutes and don’t let your lower back sag.',
  },
];

export const getExercise = (id) => EXERCISES.find((e) => e.id === id);

/**
 * Daily routine: warm-up → 4 main moves (rotated daily) → plank finisher.
 * Higher BMI or sedentary users get a joint-friendly low-impact routine.
 */
export function getDailyWorkout(profile, date = new Date()) {
  const bmi = calcBMI(profile.weight, profile.height);
  const lowImpact = bmi >= 30 || profile.activity === 'sedentary';
  const level = lowImpact ? 'Beginner · Low impact' : bmi >= 25 ? 'Intermediate' : 'Intermediate+';
  const scale = lowImpact ? 0.8 : profile.activity === 'active' ? 1.3 : 1;

  const rand = mulberry32(hashString(`${profile.userId}|${dateKey(date)}`));
  const mains = EXERCISES.filter((e) => e.role === 'main' && (!lowImpact || e.impact === 'low'));
  const picked = shuffle(mains, rand).slice(0, 4);

  const warmups = lowImpact ? ['arm-circles', 'march'] : ['arm-circles', 'jumping-jacks'];
  const items = [...warmups.map(getExercise), ...picked, getExercise('plank')].map((e) => {
    const seconds = Math.round((e.seconds * scale) / 5) * 5;
    return { ...e, seconds, kcal: Math.max(1, caloriesBurned(e.met, profile.weight, seconds)) };
  });

  return {
    level,
    lowImpact,
    items,
    totalSeconds: items.reduce((s, e) => s + e.seconds, 0),
    totalKcal: items.reduce((s, e) => s + e.kcal, 0),
  };
}

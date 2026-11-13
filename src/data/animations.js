// Keyframe poses for the animated stick-figure trainer.
// Angles are world angles in degrees: 0 = pointing down, 90 = right,
// -90 = left, 180 = up. `t` is the torso direction (180 = upright).
// `bx` shifts horizontally, `lift` raises the body off the ground (jumps).
// The renderer auto-grounds the lowest point, so poses only describe shape.

const FRONT = { t: 180, lua: -14, lla: -8, rua: 14, rla: 8, lth: -6, lsh: -4, rth: 6, rsh: 4 };
const SIDE = { t: 180, lua: 4, lla: 10, rua: -4, rla: 4, lth: 3, lsh: 0, rth: -3, rsh: 0 };

const PLANK_HIGH = {
  t: 114.7, bx: 6,
  lua: 0, lla: 0, rua: 0, rla: 0,
  lth: -65.3, lsh: -65.3, rth: -65.3, rsh: -65.3,
};
const PUSH_DOWN = {
  t: 95.4, bx: 13,
  lua: -115, lla: 24.6, rua: -115, rla: 24.6,
  lth: -84.6, lsh: -84.6, rth: -84.6, rsh: -84.6,
};
const FOREARM_PLANK = {
  t: 103, bx: 4,
  lua: 0, lla: 90, rua: 0, rla: 90,
  lth: -77, lsh: -77, rth: -77, rsh: -77,
};
const SQUAT_LOW = {
  t: 155, bx: -19,
  lua: 90, lla: 90, rua: 86, rla: 86,
  lth: 80, lsh: -20, rth: 78, rsh: -18,
};
const CROUCH = {
  t: 140, bx: -10,
  lua: 15, lla: 10, rua: 15, rla: 10,
  lth: 70, lsh: -20, rth: 70, rsh: -20,
};
const HANDS_BEHIND_HEAD = { lua: -125, lla: 115, rua: 125, rla: -115 };

const f = (pose, d) => ({ pose, d });

export const ANIMATIONS = {
  idle: {
    view: 'front',
    frames: [f(FRONT, 1400), f({ ...FRONT, lua: -18, rua: 18, lift: 1.5 }, 1400)],
  },
  wave: {
    view: 'front',
    frames: [
      f({ ...FRONT, rua: 140, rla: 165 }, 380),
      f({ ...FRONT, rua: 140, rla: 120 }, 380),
    ],
  },
  'jumping-jacks': {
    view: 'front',
    frames: [
      f(FRONT, 220),
      f({ ...FRONT, lua: -90, lla: -95, rua: 90, rla: 95, lth: -14, lsh: -14, rth: 14, rsh: 14, lift: 12 }, 220),
      f({ ...FRONT, lua: -165, lla: -175, rua: 165, rla: 175, lth: -22, lsh: -22, rth: 22, rsh: 22 }, 220),
      f({ ...FRONT, lua: -90, lla: -95, rua: 90, rla: 95, lth: -14, lsh: -14, rth: 14, rsh: 14, lift: 12 }, 220),
    ],
  },
  'arm-circles': {
    view: 'front',
    frames: [
      f({ ...FRONT, lua: -72, lla: -72, rua: 72, rla: 72 }, 260),
      f({ ...FRONT, lua: -90, lla: -95, rua: 90, rla: 95 }, 260),
      f({ ...FRONT, lua: -108, lla: -108, rua: 108, rla: 108 }, 260),
      f({ ...FRONT, lua: -90, lla: -85, rua: 90, rla: 85 }, 260),
    ],
  },
  march: {
    view: 'side',
    frames: [
      f({ ...SIDE, lth: 28, lsh: 4, rth: -18, rsh: -28, lua: -28, lla: -18, rua: 26, rla: 48 }, 480),
      f({ ...SIDE, rth: 28, rsh: 4, lth: -18, lsh: -28, rua: -28, rla: -18, lua: 26, lla: 48 }, 480),
    ],
  },
  squats: {
    view: 'side',
    frames: [
      f({ ...SIDE, lua: 20, lla: 30, rua: 16, rla: 26 }, 800),
      f(SQUAT_LOW, 450),
      f(SQUAT_LOW, 650),
    ],
  },
  lunges: {
    view: 'side',
    frames: [
      f(SIDE, 650),
      f({ ...SIDE, rth: 85, rsh: 0, lth: -30, lsh: -80, lua: 8, lla: 14, rua: -6, rla: 0 }, 650),
      f(SIDE, 650),
      f({ ...SIDE, lth: 85, lsh: 0, rth: -30, rsh: -80, lua: -6, lla: 0, rua: 8, rla: 14 }, 650),
    ],
  },
  'push-ups': {
    view: 'side',
    frames: [f(PLANK_HIGH, 700), f(PUSH_DOWN, 500), f(PUSH_DOWN, 200)],
  },
  'side-crunch': {
    view: 'front',
    frames: [
      f({ ...FRONT, ...HANDS_BEHIND_HEAD }, 450),
      f({ ...FRONT, ...HANDS_BEHIND_HEAD, t: 192, lua: -100, lla: 160, lth: -70, lsh: -5 }, 450),
      f({ ...FRONT, ...HANDS_BEHIND_HEAD }, 450),
      f({ ...FRONT, ...HANDS_BEHIND_HEAD, t: 168, rua: 100, rla: -160, rth: 70, rsh: 5 }, 450),
    ],
  },
  'high-knees': {
    view: 'side',
    frames: [
      f({ ...SIDE, lth: 92, lsh: 0, rth: -2, rsh: 0, rua: 60, rla: 150, lua: -40, lla: -15, lift: 3 }, 260),
      f({ ...SIDE, rth: 92, rsh: 0, lth: -2, lsh: 0, lua: 60, lla: 150, rua: -40, rla: -15, lift: 3 }, 260),
    ],
  },
  'butt-kicks': {
    view: 'side',
    frames: [
      f({ ...SIDE, lth: -8, lsh: -160, rth: 2, rsh: 0, lua: 30, lla: 110, rua: -30, rla: -10, lift: 2 }, 280),
      f({ ...SIDE, rth: -8, rsh: -160, lth: 2, lsh: 0, rua: 30, rla: 110, lua: -30, lla: -10, lift: 2 }, 280),
    ],
  },
  'mountain-climbers': {
    view: 'side',
    frames: [
      f({ ...PLANK_HIGH, lth: 40, lsh: -95 }, 280),
      f({ ...PLANK_HIGH, rth: 40, rsh: -95 }, 280),
    ],
  },
  burpees: {
    view: 'side',
    frames: [
      f(SIDE, 450),
      f(CROUCH, 380),
      f(PLANK_HIGH, 450),
      f(CROUCH, 380),
      f({ ...SIDE, lua: 150, lla: 160, rua: 145, rla: 155, lth: 0, rth: 0, lsh: 0, rsh: 0, lift: 24 }, 380),
    ],
  },
  plank: {
    view: 'side',
    frames: [f(FOREARM_PLANK, 1500), f({ ...FOREARM_PLANK, t: 104.5 }, 1500)],
  },
};

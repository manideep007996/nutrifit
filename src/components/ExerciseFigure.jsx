import { useEffect, useMemo, useRef, useState } from 'react';
import { ANIMATIONS } from '../data/animations';

// Animated trainer: interpolates keyframe poses and solves the skeleton with
// simple forward kinematics, rendered as SVG. Pauses when off-screen.

const GROUND = 178;
const LEN = { torso: 46, neck: 5, head: 12, ua: 24, la: 22, th: 31, sh: 31 };
const KEYS = ['t', 'bx', 'lift', 'lua', 'lla', 'rua', 'rla', 'lth', 'lsh', 'rth', 'rsh'];
const BASE = { t: 180, bx: 0, lift: 0, lua: 0, lla: 0, rua: 0, rla: 0, lth: 0, lsh: 0, rth: 0, rsh: 0 };

const rad = (d) => (d * Math.PI) / 180;
const step = (p, angle, len) => [p[0] + Math.sin(rad(angle)) * len, p[1] + Math.cos(rad(angle)) * len];
const ease = (x) => -(Math.cos(Math.PI * x) - 1) / 2;

function samplePose(frames, time) {
  const total = frames.reduce((s, f) => s + f.d, 0);
  let t = time % total;
  for (let i = 0; i < frames.length; i++) {
    if (t < frames[i].d || i === frames.length - 1) {
      const a = { ...BASE, ...frames[i].pose };
      const b = { ...BASE, ...frames[(i + 1) % frames.length].pose };
      const k = ease(Math.min(1, t / frames[i].d));
      return Object.fromEntries(KEYS.map((key) => [key, a[key] + (b[key] - a[key]) * k]));
    }
    t -= frames[i].d;
  }
  return BASE;
}

function solve(p) {
  const H = [0, 0];
  const S = step(H, p.t, LEN.torso);
  const head = step(H, p.t, LEN.torso + LEN.neck + LEN.head);
  const lE = step(S, p.lua, LEN.ua);
  const lW = step(lE, p.lla, LEN.la);
  const rE = step(S, p.rua, LEN.ua);
  const rW = step(rE, p.rla, LEN.la);
  const lK = step(H, p.lth, LEN.th);
  const lF = step(lK, p.lsh, LEN.sh);
  const rK = step(H, p.rth, LEN.th);
  const rF = step(rK, p.rsh, LEN.sh);

  const ys = [H, S, lE, lW, rE, rW, lK, lF, rK, rF].map((q) => q[1]);
  ys.push(head[1] + LEN.head);
  const dx = 100 + p.bx;
  const dy = GROUND - Math.max(...ys) - p.lift;
  const T = (q) => [q[0] + dx, q[1] + dy];
  return {
    H: T(H), S: T(S), head: T(head),
    lE: T(lE), lW: T(lW), rE: T(rE), rW: T(rW),
    lK: T(lK), lF: T(lF), rK: T(rK), rF: T(rF),
  };
}

const pts = (...ps) => ps.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');

export default function ExerciseFigure({ anim = 'idle', playing = true, size = 180, className = '', time }) {
  const config = ANIMATIONS[anim] || ANIMATIONS.idle;
  const ref = useRef(null);
  const timeRef = useRef(0);
  const [, setTick] = useState(0);
  const [visible, setVisible] = useState(true);
  const reduceMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  useEffect(() => {
    timeRef.current = 0;
  }, [anim]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return undefined;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!playing || !visible || reduceMotion) return undefined;
    let raf;
    let last = performance.now();
    const loop = (now) => {
      timeRef.current += Math.min(64, now - last);
      last = now;
      setTick((x) => (x + 1) % 1e6);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [playing, visible, reduceMotion, anim]);

  const pose = samplePose(config.frames, time ?? timeRef.current);
  const s = solve(pose);
  const side = config.view === 'side';

  // eye(s): side view looks "forward" (perpendicular to torso), front view shows two
  const up = [Math.sin(rad(pose.t)), Math.cos(rad(pose.t))];
  const fwd = [-up[1], up[0]];
  const eyes = side
    ? [[s.head[0] + fwd[0] * 5 + up[0] * 2, s.head[1] + fwd[1] * 5 + up[1] * 2]]
    : [[s.head[0] - 4, s.head[1] - 1], [s.head[0] + 4, s.head[1] - 1]];

  return (
    <svg
      ref={ref}
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={`figure ${className}`}
      role="img"
      aria-label={`${anim.replace('-', ' ')} demonstration`}
    >
      <line x1="16" x2="184" y1={GROUND + 5} y2={GROUND + 5} className="fig-ground" />
      <ellipse cx={s.H[0]} cy={GROUND + 5} rx={Math.max(14, 36 - pose.lift)} ry="4" className="fig-shadow" />

      <g className={side ? 'fig-back' : 'fig-front'}>
        <polyline points={pts(s.H, s.lK, s.lF)} className="fig-limb" />
        <polyline points={pts(s.S, s.lE, s.lW)} className="fig-limb" />
      </g>

      <line x1={s.H[0]} y1={s.H[1]} x2={s.S[0]} y2={s.S[1]} className="fig-limb fig-torso" />
      <circle cx={s.head[0]} cy={s.head[1]} r={LEN.head} className="fig-head" />
      {eyes.map((e, i) => (
        <circle key={i} cx={e[0]} cy={e[1]} r="1.8" className="fig-eye" />
      ))}

      <g className="fig-front">
        <polyline points={pts(s.H, s.rK, s.rF)} className="fig-limb" />
        <polyline points={pts(s.S, s.rE, s.rW)} className="fig-limb" />
      </g>
    </svg>
  );
}

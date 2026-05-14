import {Easing, interpolate, spring} from 'remotion';

export const clamp = {
  extrapolateLeft:  'clamp' as const,
  extrapolateRight: 'clamp' as const,
};

export const smoothReveal  = (f: number, fps: number) => spring({frame: f, fps, config: {damping: 200}});
export const snappyPop     = (f: number, fps: number) => spring({frame: f, fps, config: {damping: 20,  stiffness: 200}});
export const bouncyEnter   = (f: number, fps: number) => spring({frame: f, fps, config: {damping: 8}});
export const dramaticSlam  = (f: number, fps: number) => spring({frame: f, fps, config: {damping: 12, stiffness: 300}});
export const heavySettle   = (f: number, fps: number) => spring({frame: f, fps, config: {mass: 2, damping: 15, stiffness: 80}});

/** Stagger: delays each item by gap frames. Clamps to avoid negative-frame artifacts. */
export const staggerSpring = (f: number, fps: number, index: number, gap = 6) =>
  spring({frame: Math.max(0, f - index * gap), fps, config: {damping: 200}});

/** Entry+exit opacity for caption-style elements. Returns 0→1→0. */
export const entryExit = (f: number, fps: number, duration: number): number => {
  const enter = spring({frame: f, fps, config: {damping: 200}});
  const exit  = spring({
    frame: f,
    fps,
    config: {damping: 200},
    delay: duration - Math.round(fps * 0.6),
  });
  return Math.min(Math.max(0, enter - exit), 1);
};

/** Counter tick: animates a numeric value from 0 to `target` over 45 frames. */
export const counterTick = (f: number, target: number): number => {
  const progress = interpolate(f, [0, 45], [0, 1], {
    easing: Easing.out(Easing.exp),
    ...clamp,
  });
  return Math.round(target * progress);
};

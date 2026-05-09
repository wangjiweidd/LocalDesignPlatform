import type {CSSProperties} from 'react';
import {Easing, interpolate} from 'remotion';
import type {LegacyBeatAction, MotionIntensity, MotionPresetId, VisualBeat} from '../data/types';

const intensityScale: Record<MotionIntensity, number> = {
  low: 0.7,
  medium: 1,
  high: 1.28,
};

const clamp = {
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};

export const motionPresetDefaults: Record<
  MotionPresetId,
  {action: LegacyBeatAction; durationFrames: number; intensity: MotionIntensity}
> = {
  'robot-breathe': {action: 'pulse', durationFrames: 36, intensity: 'low'},
  'soft-pop': {action: 'pop', durationFrames: 14, intensity: 'medium'},
  'gentle-slide': {action: 'slide', durationFrames: 18, intensity: 'medium'},
  'attention-flash': {action: 'flash', durationFrames: 12, intensity: 'medium'},
  'hand-drawn-check': {action: 'draw', durationFrames: 18, intensity: 'medium'},
  'scan-sweep': {action: 'slide', durationFrames: 24, intensity: 'medium'},
  'boundary-pulse': {action: 'pulse', durationFrames: 20, intensity: 'medium'},
  'question-bob': {action: 'pop', durationFrames: 16, intensity: 'low'},
  'lightbulb-glow': {action: 'flash', durationFrames: 20, intensity: 'medium'},
  'timer-tick': {action: 'shake', durationFrames: 16, intensity: 'low'},
  'warning-nudge': {action: 'shake', durationFrames: 12, intensity: 'medium'},
  'keyword-underline': {action: 'draw', durationFrames: 16, intensity: 'medium'},
};

export const motionStyleForBeat = (beat: VisualBeat, frame: number): CSSProperties => {
  const defaults = motionPresetDefaults[beat.preset];
  const start = Math.max(0, Math.round(beat.frame + beat.offsetFrames));
  const duration = beat.durationFrames || defaults.durationFrames;
  const local = frame - start;
  const amount = intensityScale[beat.intensity || defaults.intensity];

  if (local < 0 || local > duration + 8) return {};

  const enter = interpolate(local, [0, duration], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    ...clamp,
  });
  const exit = interpolate(local, [duration, duration + 8], [1, 0], {
    easing: Easing.in(Easing.cubic),
    ...clamp,
  });
  const active = Math.min(enter, exit);
  const wave = Math.sin(active * Math.PI);

  switch (beat.preset) {
    case 'robot-breathe':
      return {
        transform: `scale(${1 + wave * 0.018 * amount})`,
        filter: `drop-shadow(0 0 ${6 + wave * 8}px rgba(58, 190, 210, ${0.18 + wave * 0.16}))`,
      };
    case 'soft-pop':
      return {
        transform: `scale(${0.94 + enter * 0.06 + wave * 0.018 * amount})`,
        opacity: 0.72 + enter * 0.28,
      };
    case 'gentle-slide':
      return {
        transform: `translateY(${(1 - enter) * 34 * amount}px)`,
        opacity: enter,
      };
    case 'attention-flash':
      return {
        filter: `brightness(${1 + wave * 0.22 * amount}) saturate(${1 + wave * 0.12})`,
        boxShadow: `0 0 ${wave * 22 * amount}px rgba(224, 122, 20, ${wave * 0.3})`,
      };
    case 'hand-drawn-check':
      return {
        clipPath: `inset(0 ${Math.max(0, 100 - enter * 100)}% 0 0)`,
        opacity: enter,
      };
    case 'scan-sweep':
      return {
        transform: `translateX(${interpolate(enter, [0, 1], [-42, 42]) * amount}px)`,
        filter: `drop-shadow(0 0 ${wave * 12}px rgba(255, 181, 46, ${wave * 0.35}))`,
      };
    case 'boundary-pulse':
      return {
        transform: `scale(${1 + wave * 0.035 * amount})`,
        boxShadow: `0 0 0 ${wave * 7 * amount}px rgba(224, 122, 20, ${wave * 0.16})`,
      };
    case 'question-bob':
      return {
        transform: `translateY(${-wave * 12 * amount}px) scale(${0.96 + enter * 0.04})`,
        opacity: enter,
      };
    case 'lightbulb-glow':
      return {
        filter: `drop-shadow(0 0 ${8 + wave * 20 * amount}px rgba(255, 181, 46, ${0.22 + wave * 0.36}))`,
      };
    case 'timer-tick':
      return {
        transform: `rotate(${Math.sin(active * Math.PI * 4) * 2.5 * amount}deg)`,
      };
    case 'warning-nudge':
      return {
        transform: `translateX(${Math.sin(active * Math.PI * 5) * 8 * amount}px)`,
        filter: `brightness(${1 + wave * 0.12})`,
      };
    case 'keyword-underline':
      return {
        clipPath: `inset(0 ${Math.max(0, 100 - enter * 100)}% 0 0)`,
        opacity: enter,
      };
  }
};

export const firstBeatStyle = (beats: VisualBeat[], target: string, frame: number): CSSProperties => {
  const active = beats
    .filter((beat) => beat.target === target)
    .map((beat) => motionStyleForBeat(beat, frame))
    .find((style) => Object.keys(style).length > 0);

  return active || {};
};

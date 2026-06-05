import {Easing, interpolate} from 'remotion';
import {clamp} from './springs';

export type TimelineEase =
  | 'linear'
  | 'power2.in'
  | 'power2.out'
  | 'power2.inOut'
  | 'expo.out'
  | 'back.out';

const easingMap: Record<TimelineEase, (value: number) => number> = {
  linear:       Easing.linear,
  'power2.in':  Easing.in(Easing.cubic),
  'power2.out': Easing.out(Easing.cubic),
  'power2.inOut': Easing.inOut(Easing.cubic),
  'expo.out':   Easing.out(Easing.exp),
  'back.out':   Easing.out(Easing.back(1.7)),
};

export type TimelineSegment = {
  start: number;
  duration: number;
  ease?: TimelineEase;
};

export const segmentProgress = (
  frame: number,
  {start, duration, ease = 'power2.out'}: TimelineSegment,
): number => {
  const end = start + Math.max(1, duration);
  return interpolate(frame, [start, end], [0, 1], {
    easing: easingMap[ease],
    ...clamp,
  });
};

export const staggeredSegmentProgress = (
  frame: number,
  segment: TimelineSegment,
  index: number,
  gap = 6,
): number =>
  segmentProgress(frame, {
    ...segment,
    start: segment.start + index * gap,
  });

export const mapProgress = (
  progress: number,
  input: readonly number[],
  output: readonly number[],
): number => interpolate(progress, input, output, clamp);

import type {ReactNode} from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {clamp} from '../utils/springs';

export const ShotMotionShell: React.FC<{
  children: ReactNode;
  durationFrames: number;
  track?: 'education' | 'knowledge';
}> = ({children, durationFrames, track = 'education'}) => {
  const frame = useCurrentFrame();

  if (track === 'knowledge') {
    return (
      <div style={{width: '100%', height: '100%'}}>
        {children}
      </div>
    );
  }

  const enterDuration = track === 'education' ? 10 : 12;
  const exitStart = Math.max(0, durationFrames - 14);
  const enter = interpolate(frame, [0, enterDuration], [0, 1], {
    easing: Easing.out(Easing.cubic),
    ...clamp,
  });
  const exit = interpolate(frame, [exitStart, durationFrames], [0, 1], {
    easing: Easing.inOut(Easing.cubic),
    ...clamp,
  });

  const opacity = Math.min(interpolate(enter, [0, 1], [0.4, 1], clamp), interpolate(exit, [0, 1], [1, 0.6], clamp));
  const translateY =
    interpolate(enter, [0, 1], [10, 0], clamp) + interpolate(exit, [0, 1], [0, -6], clamp);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        opacity,
        transform: `translateY(${translateY}px)`,
        willChange: 'transform, opacity',
      }}
    >
      {children}
    </div>
  );
};

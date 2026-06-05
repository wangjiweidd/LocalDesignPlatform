import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import type {YaoningTheme} from '../themes';
import {clamp} from '../utils/springs';

export const YaoningAtmosphere: React.FC<{theme: YaoningTheme}> = ({theme}) => {
  const frame = useCurrentFrame();
  const driftX = Math.sin(frame / 48) * 16;
  const driftY = Math.cos(frame / 64) * 12;
  const glowScale = interpolate(Math.sin(frame / 38), [-1, 1], [0.96, 1.04], clamp);

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 16% 20%, rgba(255,255,255,0.58) 0%, rgba(255,255,255,0) 24%), ' +
            'radial-gradient(circle at 82% 18%, rgba(255,229,182,0.34) 0%, rgba(255,229,182,0) 22%), ' +
            'radial-gradient(circle at 18% 78%, rgba(182,225,203,0.18) 0%, rgba(182,225,203,0) 16%), ' +
            'radial-gradient(circle at 86% 74%, rgba(255,244,212,0.26) 0%, rgba(255,244,212,0) 18%)',
          opacity: 0.88,
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: 140 + driftX,
          top: 620 + driftY,
          width: 540,
          height: 540,
          borderRadius: 999,
          background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.03) 54%, rgba(255,255,255,0) 76%)',
          transform: `scale(${glowScale})`,
          opacity: 0.72,
          filter: 'blur(8px)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.08,
          backgroundImage:
            'radial-gradient(rgba(115, 77, 29, 0.9) 0.6px, transparent 0.9px), radial-gradient(rgba(255,255,255,0.78) 0.4px, transparent 0.8px)',
          backgroundSize: '18px 18px, 26px 26px',
          backgroundPosition: '0 0, 9px 7px',
          mixBlendMode: 'multiply',
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.02) 24%, rgba(255,255,255,0) 56%, rgba(255,216,188,0.1) 100%)',
        }}
      />

      <svg
        width={1080}
        height={1920}
        viewBox="0 0 1080 1920"
        aria-hidden
        style={{position: 'absolute', inset: 0, opacity: 0.18}}
      >
        <path
          d="M110 1210 C280 1110 498 1098 674 1176"
          fill="none"
          stroke={theme.colors.surface}
          strokeWidth={18}
          strokeLinecap="round"
          opacity={0.42}
        />
        <path
          d="M236 1328 C432 1240 656 1246 852 1332"
          fill="none"
          stroke={theme.colors.border}
          strokeWidth={10}
          strokeLinecap="round"
          opacity={0.36}
        />
      </svg>
    </AbsoluteFill>
  );
};

export const YaoningTransitionGlow: React.FC<{
  shotStarts: number[];
  accentColor: string;
}> = ({shotStarts, accentColor}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {shotStarts.slice(1).map((start) => {
        const local = frame - start;
        const opacity = interpolate(local, [-8, 0, 10], [0, 0.14, 0], clamp);
        const sweepX = interpolate(local, [-8, 10], [920, -120], clamp);

        if (opacity <= 0.001) return null;

        return (
          <div key={start}>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(255,255,255,0.06)',
                opacity,
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: -180,
                bottom: -180,
                left: sweepX,
                width: 180,
                opacity,
                transform: 'rotate(10deg)',
                filter: 'blur(36px)',
                background: `linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,248,231,0.54) 38%, ${accentColor}22 70%, rgba(255,255,255,0) 100%)`,
              }}
            />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

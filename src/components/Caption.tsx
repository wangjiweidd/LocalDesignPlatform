import {Easing, interpolate, useCurrentFrame} from 'remotion';
import type {ShotData} from '../data/types';
import {colors} from '../styles';

const clamp = {
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};

export const Caption: React.FC<{shot: ShotData; shotDuration: number}> = ({shot, shotDuration}) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [6, 20], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    ...clamp,
  });
  const exit = interpolate(frame, [shotDuration - 14, shotDuration], [1, 0], {
    easing: Easing.in(Easing.cubic),
    ...clamp,
  });
  const shake =
    shot.captionMotion === 'soft-shake' ? Math.sin(frame * 0.7) * interpolate(frame, [14, 24], [0, 1], clamp) * 3 : 0;
  const pop =
    shot.captionMotion === 'emphasis-pop'
      ? 1 + Math.sin(interpolate(frame, [18, 32], [0, Math.PI], clamp)) * 0.03
      : 1;
  const titleParts = splitKeyword(shot.text, shot.keyword);
  const captionParts = splitKeyword(shot.caption, shot.captionKeyword);

  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: 72,
          right: 72,
          top: 166,
          textAlign: 'center',
          fontSize: 60,
          lineHeight: 1.12,
          fontWeight: 900,
          letterSpacing: 0,
          color: colors.ink,
        }}
      >
        {titleParts.before}
        <span style={{position: 'relative', color: colors.orange, display: 'inline-block'}}>
          {titleParts.keyword}
          <span
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: -8,
              height: 8,
              borderRadius: 999,
              background: colors.gold,
              opacity: 0.95,
            }}
          />
        </span>
        {titleParts.after}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 108,
          right: 108,
          bottom: 168,
          minHeight: 156,
          padding: '30px 44px 30px 124px',
          borderRadius: 34,
          background: 'rgba(255, 253, 247, 0.92)',
          border: `2px solid rgba(241, 196, 126, 0.7)`,
          boxShadow: '0 18px 44px rgba(176, 110, 38, 0.14)',
          opacity: Math.min(enter, exit),
          transform: `translateY(${(1 - enter) * 26}px) translateX(${shake}px) scale(${pop})`,
          color: colors.ink,
          fontSize: 46,
          lineHeight: 1.28,
          fontWeight: 800,
          letterSpacing: 0,
        }}
      >
        <BulbBadge />
        {captionParts.before}
        <span style={{position: 'relative', color: colors.orange, fontWeight: 900, display: 'inline-block'}}>
          {captionParts.keyword}
          <span
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: -8,
              height: 5,
              borderRadius: 999,
              background: colors.gold,
              opacity: 0.95,
            }}
          />
        </span>
        {captionParts.after}
      </div>
    </>
  );
};

const BulbBadge: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      left: 34,
      top: 34,
      width: 66,
      height: 66,
      borderRadius: 999,
      background: colors.gold,
      boxShadow: '0 8px 18px rgba(224, 122, 20, 0.2)',
    }}
  >
    <div
      style={{
        position: 'absolute',
        left: 22,
        top: 14,
        width: 22,
        height: 26,
        borderRadius: '14px 14px 10px 10px',
        border: '4px solid #fff',
        borderBottom: 'none',
      }}
    />
    <div style={{position: 'absolute', left: 27, top: 39, width: 13, height: 10, borderRadius: 4, background: '#fff'}} />
  </div>
);

const splitKeyword = (text: string, keyword: string) => {
  const index = text.indexOf(keyword);
  if (index < 0) return {before: text, keyword: '', after: ''};
  return {
    before: text.slice(0, index),
    keyword,
    after: text.slice(index + keyword.length),
  };
};

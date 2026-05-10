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
  const pop =
    shot.captionMotion === 'emphasis-pop'
      ? 1 + Math.sin(interpolate(frame, [18, 32], [0, Math.PI], clamp)) * 0.03
      : 1;
  const captionParts = splitKeyword(shot.caption, shot.captionKeyword);
  const revealChars = Math.floor(interpolate(frame, [8, 34], [0, shot.caption.length], clamp));

  return (
    <div
      style={{
        position: 'absolute',
        left: 108,
        right: 108,
        bottom: 395,
        minHeight: 146,
        padding: '28px 42px 28px 116px',
        borderRadius: 34,
        background: 'rgba(255, 253, 247, 0.92)',
        border: `2px solid rgba(241, 196, 126, 0.7)`,
        boxShadow: '0 18px 44px rgba(176, 110, 38, 0.14)',
        opacity: Math.min(enter, exit),
        transform: `translateY(${(1 - enter) * 26}px) scale(${pop})`,
        color: colors.ink,
        fontSize: 44,
        lineHeight: 1.28,
        fontWeight: 800,
        letterSpacing: 0,
      }}
    >
      <BulbBadge />
      <RevealText parts={captionParts} revealChars={revealChars} />
    </div>
  );
};

const RevealText: React.FC<{
  parts: ReturnType<typeof splitKeyword>;
  revealChars: number;
}> = ({parts, revealChars}) => {
  const beforeCount = parts.before.length;
  const keywordCount = parts.keyword.length;
  const visibleBefore = Math.min(revealChars, beforeCount);
  const visibleKeyword = Math.min(Math.max(revealChars - beforeCount, 0), keywordCount);
  const visibleAfter = Math.max(revealChars - beforeCount - keywordCount, 0);

  return (
    <>
      <span>{parts.before.slice(0, visibleBefore)}</span>
      {visibleKeyword > 0 ? (
        <span style={{position: 'relative', color: colors.orange, fontWeight: 900, display: 'inline-block'}}>
          {parts.keyword.slice(0, visibleKeyword)}
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
      ) : null}
      <span>{parts.after.slice(0, visibleAfter)}</span>
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

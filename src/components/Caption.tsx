import {Easing, interpolate, useCurrentFrame} from 'remotion';
import type {ShotData} from '../data/types';
import {firstBeatStyle} from '../motion/motionPresets';
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
  const keywordStyle = firstBeatStyle(shot.visualBeats, 'keyword', frame);
  const parts = splitKeyword(shot.text, shot.keyword);

  return (
    <div
      style={{
        position: 'absolute',
        left: 72,
        right: 72,
        bottom: 230,
        opacity: Math.min(enter, exit),
        transform: `translateY(${(1 - enter) * 34}px) translateX(${shake}px) scale(${pop})`,
        textAlign: 'left',
        fontSize: 78,
        lineHeight: 1.12,
        fontWeight: 900,
        letterSpacing: 0,
        color: colors.ink,
      }}
    >
      {parts.before}
      <span style={{position: 'relative', color: colors.orange, display: 'inline-block'}}>
        {parts.keyword}
        <span
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: -8,
            height: 9,
            borderRadius: 999,
            background: colors.gold,
            ...keywordStyle,
          }}
        />
      </span>
      {parts.after}
    </div>
  );
};

const splitKeyword = (text: string, keyword: string) => {
  const index = text.indexOf(keyword);
  if (index < 0) return {before: text, keyword: '', after: ''};
  return {
    before: text.slice(0, index),
    keyword,
    after: text.slice(index + keyword.length),
  };
};

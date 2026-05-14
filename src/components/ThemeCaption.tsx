import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {KnowledgeShotData, EducationShotData} from '../data/types-v2';
import type {OdinTheme, YaoningTheme} from '../themes';
import {splitKeyword} from '../utils/text';

type AnyShot = KnowledgeShotData | EducationShotData;
type Theme   = OdinTheme | YaoningTheme;

// Shared fields present on both OdinTheme and YaoningTheme
type SharedColors = {textPrimary: string; accent: string; surface: string; border: string};

function getSharedColors(theme: Theme): SharedColors {
  if (theme.track === 'knowledge-sharing') {
    const t = theme as OdinTheme;
    return {textPrimary: t.colors.textPrimary, accent: t.colors.accent,
            surface: t.colors.surface, border: t.colors.border};
  }
  const t = theme as YaoningTheme;
  return {textPrimary: t.colors.textPrimary, accent: t.colors.accent,
          surface: t.colors.surface, border: t.colors.border};
}

export const ThemeCaption: React.FC<{shot: AnyShot; shotDuration: number; theme: Theme}> = ({
  shot, shotDuration, theme,
}) => {
  const frame = useCurrentFrame();
  const {fps}  = useVideoConfig();

  const isOdin    = theme.track === 'knowledge-sharing';
  const springCfg = isOdin
    ? {damping: 20, stiffness: 200}   // snappy-pop
    : {damping: 8};                    // bouncy-enter

  const enter = spring({frame, fps, config: springCfg});
  const exit  = spring({frame, fps, config: {damping: 200},
    delay: shotDuration - Math.round(fps * 0.6)});
  const opacity    = Math.min(Math.max(0, enter - exit), 1);
  const translateY = (1 - enter) * 28;

  const {textColor, accentColor, bgColor, borderColor} = (() => {
    const c = getSharedColors(theme);
    return {textColor: c.textPrimary, accentColor: c.accent,
            bgColor: c.surface, borderColor: c.border};
  })();

  const textParts    = splitKeyword(shot.text,    shot.keyword);
  const captionParts = splitKeyword(shot.caption, shot.captionKeyword);

  return (
    <>
      {/* Hero text */}
      <div
        style={{
          position:   'absolute',
          left:       72,
          right:      72,
          top:        160,
          textAlign:  'center',
          fontSize:   60,
          lineHeight: 1.12,
          fontWeight: 900,
          color:      textColor,
          fontFamily: theme.fonts.body,
        }}
      >
        {textParts.before}
        <span style={{position: 'relative', color: accentColor, display: 'inline-block'}}>
          {textParts.keyword}
          <span
            style={{
              position:     'absolute',
              left:         0,
              right:        0,
              bottom:       -7,
              height:       7,
              borderRadius: 999,
              background:   accentColor,
              opacity:      0.35,
            }}
          />
        </span>
        {textParts.after}
      </div>

      {/* Caption card */}
      <div
        style={{
          position:     'absolute',
          left:         72,
          right:        72,
          bottom:       156,
          padding:      '28px 40px',
          borderRadius: 28,
          background:   bgColor,
          border:       `2px solid ${borderColor}`,
          opacity,
          transform:    `translateY(${translateY}px)`,
          color:        textColor,
          fontSize:     42,
          lineHeight:   1.32,
          fontWeight:   800,
          fontFamily:   theme.fonts.body,
        }}
      >
        {captionParts.before}
        <span style={{color: accentColor, fontWeight: 900}}>{captionParts.keyword}</span>
        {captionParts.after}
      </div>
    </>
  );
};

import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import type {KnowledgeShotData} from '../../data/types-v2';
import type {OdinTheme} from '../../themes';
import {ThemeCaption} from '../../components/ThemeCaption';
import {clamp, dramaticSlam} from '../../utils/springs';
import {splitKeyword} from '../../utils/text';

export const QuoteHero: React.FC<{shot: KnowledgeShotData; theme: OdinTheme; shotDuration: number; accentColor?: string}> = ({
  shot, theme, shotDuration, accentColor,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const slam  = dramaticSlam(frame, fps);
  const scale = interpolate(slam, [0, 1], [0.6, 1], clamp);

  const bg    = accentColor ?? theme.colors.bgDark;
  const parts = splitKeyword(shot.text, shot.keyword);

  return (
    <AbsoluteFill style={{background: bg}}>
      {/* Decorative quote mark — bottom-right, large background element */}
      <div
        style={{
          position:   'absolute',
          right:      40,
          bottom:     320,
          fontSize:   320,
          fontWeight: 900,
          color:      theme.colors.accent,
          opacity:    0.08,
          lineHeight: 1,
          fontFamily: theme.fonts.display,
          userSelect: 'none',
        }}
      >
        "
      </div>

      {/* Quote text — vertically centered */}
      <div
        style={{
          position:       'absolute',
          inset:          0,
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          padding:        '0 88px',
        }}
      >
        <div
          style={{
            transform:  `scale(${scale})`,
            fontSize:   88,
            fontWeight: 900,
            lineHeight: 1.25,
            color:      '#F1F5F9',
            fontFamily: theme.fonts.body,
            textAlign:  'center',
          }}
        >
          {parts.before}
          <span style={{color: theme.colors.accent}}>{parts.keyword}</span>
          {parts.after}
        </div>
      </div>

      <ThemeCaption shot={shot} shotDuration={shotDuration} theme={theme} />
    </AbsoluteFill>
  );
};

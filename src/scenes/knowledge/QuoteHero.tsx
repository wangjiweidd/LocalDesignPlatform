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
      {/* Decorative quote mark */}
      <div
        style={{
          position:   'absolute',
          left:       72,
          top:        200,
          fontSize:   200,
          fontWeight: 900,
          color:      theme.colors.accent,
          opacity:    0.2,
          lineHeight: 1,
          fontFamily: theme.fonts.display,
        }}
      >
        "
      </div>

      {/* Quote text */}
      <div
        style={{
          position:   'absolute',
          left:       88,
          right:      88,
          top:        '50%',
          transform:  `translateY(-50%) scale(${scale})`,
          fontSize:   80,
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

      <ThemeCaption shot={shot} shotDuration={shotDuration} theme={theme} />
    </AbsoluteFill>
  );
};

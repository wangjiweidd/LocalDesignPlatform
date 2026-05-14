import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import type {EducationShotData} from '../../data/types-v2';
import type {YaoningTheme} from '../../themes';
import {ThemeCaption} from '../../components/ThemeCaption';
import {AiRobot} from '../../components/illustrations/AiRobot';
import {bouncyEnter, clamp, staggerSpring} from '../../utils/springs';
import {splitKeyword} from '../../utils/text';

export const AiIntro: React.FC<{shot: EducationShotData; theme: YaoningTheme; shotDuration: number}> = ({
  shot, theme, shotDuration,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enter  = bouncyEnter(frame, fps);
  const scale  = interpolate(enter, [0, 1], [0.7, 1], clamp);

  const iconEnter = staggerSpring(frame, fps, 1);

  const parts = splitKeyword(shot.text, shot.keyword);

  return (
    <AbsoluteFill style={{background: theme.colors.bg}}>
      {/* Decorative burst circles */}
      <div
        style={{
          position:     'absolute',
          top:          -200,
          right:        -200,
          width:        600,
          height:       600,
          borderRadius: 999,
          background:   theme.colors.accentViolet,
          opacity:      0.12,
        }}
      />
      <div
        style={{
          position:     'absolute',
          bottom:       -120,
          left:         -120,
          width:        400,
          height:       400,
          borderRadius: 999,
          background:   theme.colors.accent,
          opacity:      0.1,
        }}
      />

      {/* AiRobot illustration */}
      <div
        style={{
          position:       'absolute',
          top:            160,
          left:           0,
          right:          0,
          display:        'flex',
          justifyContent: 'center',
          opacity:        iconEnter,
        }}
      >
        <AiRobot size={300} accentColor={theme.colors.accent} eyeColor={theme.colors.accentViolet} />
      </div>

      {/* Concept text */}
      <div
        style={{
          position:       'absolute',
          left:           72,
          right:          72,
          top:            620,
          textAlign:      'center',
          opacity:        enter,
          transform:      `scale(${scale})`,
        }}
      >
        <div
          style={{
            fontSize:   72,
            fontWeight: 900,
            color:      theme.colors.textPrimary,
            fontFamily: theme.fonts.display,
            lineHeight: 1.2,
          }}
        >
          {parts.before}
          <span style={{color: theme.colors.accentViolet}}>{parts.keyword}</span>
          {parts.after}
        </div>
      </div>

      <ThemeCaption shot={shot} shotDuration={shotDuration} theme={theme} />
    </AbsoluteFill>
  );
};

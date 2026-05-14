import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Lottie} from '@remotion/lottie';
import type {EducationShotData} from '../../data/types-v2';
import type {YaoningTheme} from '../../themes';
import {ThemeCaption} from '../../components/ThemeCaption';
import {AiRobot} from '../../components/illustrations/AiRobot';
import {clamp, snappyPop, staggerSpring} from '../../utils/springs';
import {getLottie} from '../../utils/assetCatalog';
import {splitKeyword} from '../../utils/text';

export const CelebrateWin: React.FC<{shot: EducationShotData; theme: YaoningTheme; shotDuration: number}> = ({
  shot, theme, shotDuration,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enter     = snappyPop(frame, fps);
  const textEnter = staggerSpring(frame, fps, 1);

  const lottieData = getLottie(shot.lottieId ?? 'fx-confetti-warm');

  const parts = splitKeyword(shot.text, shot.keyword);

  return (
    <AbsoluteFill style={{background: `linear-gradient(160deg, ${theme.colors.bg}, ${theme.colors.bgDeep})`}}>
      {/* Confetti lottie overlay */}
      {lottieData && (
        <div style={{position: 'absolute', inset: 0, opacity: 0.85}}>
          <Lottie
            animationData={lottieData}
            playbackRate={1}
            style={{width: '100%', height: '100%'}}
          />
        </div>
      )}

      {/* Robot character celebrating */}
      <div
        style={{
          position:       'absolute',
          top:            160,
          left:           0,
          right:          0,
          display:        'flex',
          justifyContent: 'center',
          opacity:        enter,
          transform:      `scale(${interpolate(enter, [0, 1], [0.3, 1], clamp)}) rotate(${interpolate(enter, [0, 1], [-20, 0], clamp)}deg)`,
        }}
      >
        <AiRobot size={280} accentColor={theme.colors.celebrate} eyeColor={theme.colors.accent} />
      </div>

      {/* Celebration message */}
      <div
        style={{
          position:       'absolute',
          left:           72,
          right:          72,
          top:            520,
          textAlign:      'center',
          opacity:        textEnter,
          transform:      `scale(${interpolate(textEnter, [0, 1], [0.8, 1], clamp)})`,
        }}
      >
        <div
          style={{
            fontSize:     56,
            fontWeight:   900,
            color:        theme.colors.celebrate,
            fontFamily:   theme.fonts.display,
            marginBottom: 16,
          }}
        >
          太棒了！
        </div>
        <div
          style={{
            fontSize:   62,
            fontWeight: 900,
            color:      theme.colors.textPrimary,
            fontFamily: theme.fonts.body,
            lineHeight: 1.3,
          }}
        >
          {parts.before}
          <span style={{color: theme.colors.accent}}>{parts.keyword}</span>
          {parts.after}
        </div>
      </div>

      {/* Star row */}
      <div
        style={{
          position:       'absolute',
          bottom:         360,
          left:           0,
          right:          0,
          display:        'flex',
          justifyContent: 'center',
          gap:            20,
          fontSize:       48,
          opacity:        textEnter,
        }}
      >
        {'⭐⭐⭐'.split('').map((s, i) => (
          <span
            key={i}
            style={{
              transform: `scale(${interpolate(staggerSpring(frame, fps, i + 2), [0, 1], [0, 1], clamp)})`,
              display:   'inline-block',
            }}
          >
            {s}
          </span>
        ))}
      </div>

      <ThemeCaption shot={shot} shotDuration={shotDuration} theme={theme} />
    </AbsoluteFill>
  );
};

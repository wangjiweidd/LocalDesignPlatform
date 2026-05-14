import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import type {EducationShotData} from '../../data/types-v2';
import type {YaoningTheme} from '../../themes';
import {ThemeCaption} from '../../components/ThemeCaption';
import {clamp, snappyPop, staggerSpring} from '../../utils/springs';
import {splitKeyword} from '../../utils/text';

export const ChallengeGame: React.FC<{shot: EducationShotData; theme: YaoningTheme; shotDuration: number}> = ({
  shot, theme, shotDuration,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const headerEnter  = snappyPop(frame, fps);
  const badgeEnter   = staggerSpring(frame, fps, 1);
  const contentEnter = staggerSpring(frame, fps, 2);

  const parts = splitKeyword(shot.text, shot.keyword);

  return (
    <AbsoluteFill style={{background: theme.colors.bgDeep}}>
      {/* Challenge banner */}
      <div
        style={{
          position:       'absolute',
          left:           0,
          right:          0,
          top:            0,
          height:         180,
          background:     `linear-gradient(135deg, ${theme.colors.accent}, ${theme.colors.accentViolet})`,
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          opacity:        headerEnter,
          transform:      `translateY(${(1 - headerEnter) * -30}px)`,
        }}
      >
        <div
          style={{
            fontSize:   44,
            fontWeight: 900,
            color:      '#fff',
            fontFamily: theme.fonts.display,
            letterSpacing: 3,
          }}
        >
          🎯 家庭挑战
        </div>
      </div>

      {/* Step badge */}
      <div
        style={{
          position:   'absolute',
          left:       88,
          top:        220,
          opacity:    badgeEnter,
          transform:  `scale(${interpolate(badgeEnter, [0, 1], [0.5, 1], clamp)})`,
        }}
      >
        <div
          style={{
            display:      'inline-flex',
            alignItems:   'center',
            gap:          12,
            background:   theme.colors.surface,
            borderRadius: 999,
            padding:      '12px 28px',
            border:       `2px solid ${theme.colors.border}`,
          }}
        >
          <div
            style={{
              width:        44,
              height:       44,
              borderRadius: 999,
              background:   theme.colors.accent,
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              fontSize:       22,
              fontWeight:     900,
              color:          '#fff',
              fontFamily:     theme.fonts.numbers,
            }}
          >
            {shot.stepNumber ?? 1}
          </div>
          <span style={{fontSize: 28, fontWeight: 700, color: theme.colors.textSecondary, fontFamily: theme.fonts.body}}>
            第{shot.stepNumber ?? 1}步
          </span>
        </div>
      </div>

      {/* Challenge text */}
      <div
        style={{
          position:   'absolute',
          left:       88,
          right:      88,
          top:        360,
          opacity:    contentEnter,
          transform:  `translateY(${(1 - contentEnter) * 32}px)`,
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

      <ThemeCaption shot={shot} shotDuration={shotDuration} theme={theme} />
    </AbsoluteFill>
  );
};

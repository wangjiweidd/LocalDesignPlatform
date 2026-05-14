import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import type {EducationShotData} from '../../data/types-v2';
import type {YaoningTheme} from '../../themes';
import {ThemeCaption} from '../../components/ThemeCaption';
import {bouncyEnter, clamp, staggerSpring} from '../../utils/springs';
import {splitKeyword} from '../../utils/text';

export const StoryMoment: React.FC<{shot: EducationShotData; theme: YaoningTheme; shotDuration: number}> = ({
  shot, theme, shotDuration,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const sceneEnter   = bouncyEnter(frame, fps);
  const dialogEnter  = staggerSpring(frame, fps, 1);

  const parts = splitKeyword(shot.text, shot.keyword);

  return (
    <AbsoluteFill style={{background: '#FFF7ED'}}>
      {/* Story illustration area */}
      <div
        style={{
          position:       'absolute',
          left:           0,
          right:          0,
          top:            120,
          height:         420,
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          opacity:        sceneEnter,
          transform:      `scale(${interpolate(sceneEnter, [0, 1], [0.85, 1], clamp)})`,
        }}
      >
        <div style={{fontSize: 180}}>
          {shot.characterName === 'child' ? '🧒' : shot.characterName === 'parent' ? '👨‍👩‍👧' : '✨'}
        </div>
      </div>

      {/* Dialog bubble */}
      <div
        style={{
          position:     'absolute',
          left:         72,
          right:        72,
          top:          580,
          background:   theme.colors.surface,
          borderRadius: 32,
          padding:      '36px 44px',
          border:       `3px solid ${theme.colors.border}`,
          opacity:      dialogEnter,
          transform:    `translateY(${(1 - dialogEnter) * 40}px)`,
        }}
      >
        {/* Speech tail */}
        <div
          style={{
            position:    'absolute',
            top:         -28,
            left:        120,
            width:       0,
            height:      0,
            borderLeft:  '20px solid transparent',
            borderRight: '20px solid transparent',
            borderBottom: `28px solid ${theme.colors.border}`,
          }}
        />
        <div
          style={{
            position:    'absolute',
            top:         -22,
            left:        123,
            width:       0,
            height:      0,
            borderLeft:  '17px solid transparent',
            borderRight: '17px solid transparent',
            borderBottom: `25px solid ${theme.colors.surface}`,
          }}
        />

        <div
          style={{
            fontSize:   54,
            fontWeight: 900,
            color:      theme.colors.textPrimary,
            fontFamily: theme.fonts.body,
            lineHeight: 1.35,
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

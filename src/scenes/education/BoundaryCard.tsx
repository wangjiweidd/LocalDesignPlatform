import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import type {EducationShotData} from '../../data/types-v2';
import type {YaoningTheme} from '../../themes';
import {ThemeCaption} from '../../components/ThemeCaption';
import {PngAsset} from '../../components/illustrations/PngAsset';
import {clamp, dramaticSlam, staggerSpring} from '../../utils/springs';
import {splitKeyword} from '../../utils/text';

export const BoundaryCard: React.FC<{shot: EducationShotData; theme: YaoningTheme; shotDuration: number}> = ({
  shot, theme, shotDuration,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const slamEnter    = dramaticSlam(frame, fps);
  const textEnter    = staggerSpring(frame, fps, 1);

  // Warning pulse: opacity oscillates after slam
  const pulseOffset = Math.max(0, frame - 12);
  const pulse       = interpolate(
    Math.sin((pulseOffset / fps) * Math.PI * 3),
    [-1, 1],
    [0.7, 1],
    clamp,
  );

  const parts = splitKeyword(shot.text, shot.keyword);

  return (
    <AbsoluteFill style={{background: theme.colors.safetyBg}}>
      {/* Warning stripe top */}
      <div
        style={{
          position:   'absolute',
          left:       0,
          right:      0,
          top:        0,
          height:     16,
          background: `repeating-linear-gradient(
            -45deg,
            ${theme.colors.safetyAccent},
            ${theme.colors.safetyAccent} 20px,
            ${theme.colors.safetyBg} 20px,
            ${theme.colors.safetyBg} 40px
          )`,
        }}
      />

      {/* Warning icon — rules-board prop */}
      <div
        style={{
          position:       'absolute',
          left:           0,
          right:          0,
          top:            180,
          display:        'flex',
          justifyContent: 'center',
          opacity:        slamEnter * pulse,
          transform:      `scale(${interpolate(slamEnter, [0, 1], [0.4, 1], clamp)})`,
        }}
      >
        <PngAsset name="rules-board.png" width={280} height={280} shadow={false} />
      </div>

      {/* Safety rule card */}
      <div
        style={{
          position:     'absolute',
          left:         72,
          right:        72,
          top:          460,
          background:   '#2d2d2d',
          borderRadius: 28,
          padding:      '40px 44px',
          border:       `3px solid ${theme.colors.safetyAccent}`,
          opacity:      textEnter,
          transform:    `translateY(${(1 - textEnter) * 40}px)`,
        }}
      >
        <div
          style={{
            fontSize:     28,
            fontWeight:   700,
            color:        theme.colors.safetyAccent,
            fontFamily:   theme.fonts.display,
            marginBottom: 20,
            letterSpacing: 3,
            textTransform: 'uppercase',
          }}
        >
          安全规则
        </div>

        <div
          style={{
            fontSize:   54,
            fontWeight: 900,
            color:      '#f1f5f9',
            fontFamily: theme.fonts.body,
            lineHeight: 1.35,
          }}
        >
          {parts.before}
          <span style={{color: theme.colors.safetyAccent}}>{parts.keyword}</span>
          {parts.after}
        </div>
      </div>

      {/* Warning stripe bottom */}
      <div
        style={{
          position:   'absolute',
          left:       0,
          right:      0,
          bottom:     0,
          height:     16,
          background: `repeating-linear-gradient(
            -45deg,
            ${theme.colors.safetyAccent},
            ${theme.colors.safetyAccent} 20px,
            ${theme.colors.safetyBg} 20px,
            ${theme.colors.safetyBg} 40px
          )`,
        }}
      />

      <ThemeCaption shot={shot} shotDuration={shotDuration} theme={theme} />
    </AbsoluteFill>
  );
};

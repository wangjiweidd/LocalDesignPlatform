import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import type {EducationShotData} from '../../data/types-v2';
import type {YaoningTheme} from '../../themes';
import {ThemeCaption} from '../../components/ThemeCaption';
import {PngAsset} from '../../components/illustrations/PngAsset';
import {clamp, smoothReveal, staggerSpring} from '../../utils/springs';
import {splitKeyword} from '../../utils/text';

export const DemoWalk: React.FC<{shot: EducationShotData; theme: YaoningTheme; shotDuration: number}> = ({
  shot, theme, shotDuration,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const screenEnter  = smoothReveal(frame, fps);
  const labelEnter   = staggerSpring(frame, fps, 1);
  const contentEnter = staggerSpring(frame, fps, 2);

  // Typing cursor blink: visible on even seconds
  const cursorVisible = Math.floor(frame / Math.round(fps * 0.5)) % 2 === 0;

  const parts = splitKeyword(shot.text, shot.keyword);

  return (
    <AbsoluteFill style={{background: theme.colors.bg}}>
      {/* Doudou robot guide — bottom-left, peeking */}
      <div
        style={{
          position:  'absolute',
          left:      60,
          top:       380,
          opacity:   screenEnter,
          transform: `scale(${interpolate(screenEnter, [0, 1], [0.7, 1], clamp)})`,
        }}
      >
        <PngAsset name="doudou-robot.png" width={200} height={300} />
      </div>

      {/* Simulated phone/screen */}
      <div
        style={{
          position:     'absolute',
          left:         '50%',
          top:          160,
          transform:    `translateX(-50%) scale(${interpolate(screenEnter, [0, 1], [0.9, 1], clamp)})`,
          width:        520,
          height:       380,
          borderRadius: 28,
          background:   '#1a1a2e',
          border:       `3px solid ${theme.colors.border}`,
          overflow:     'hidden',
          opacity:      screenEnter,
        }}
      >
        {/* Screen top bar */}
        <div
          style={{
            height:         44,
            background:     '#0f0f23',
            display:        'flex',
            alignItems:     'center',
            padding:        '0 20px',
            gap:            8,
          }}
        >
          {['#FF5F57', '#FEBC2E', '#28C840'].map((c, i) => (
            <div key={i} style={{width: 12, height: 12, borderRadius: 999, background: c}} />
          ))}
        </div>

        {/* Screen content area */}
        <div
          style={{
            padding:    '20px 24px',
            fontSize:   22,
            color:      '#e2e8f0',
            fontFamily: 'monospace',
            lineHeight: 1.6,
          }}
        >
          <span style={{color: '#86efac'}}>{'>'}</span>
          <span style={{color: '#f1f5f9'}}> {shot.keyword}</span>
          {cursorVisible && (
            <span style={{background: '#f1f5f9', width: 12, height: 22, display: 'inline-block', marginLeft: 2, verticalAlign: 'middle'}} />
          )}
        </div>
      </div>

      {/* Step label */}
      <div
        style={{
          position:   'absolute',
          left:       88,
          top:        590,
          fontSize:   28,
          fontWeight: 700,
          color:      theme.colors.accent,
          fontFamily: theme.fonts.display,
          letterSpacing: 3,
          textTransform: 'uppercase',
          opacity:    labelEnter,
          transform:  `translateY(${(1 - labelEnter) * 20}px)`,
        }}
      >
        操作步骤 {shot.stepNumber ? `#${shot.stepNumber}` : ''}
      </div>

      {/* Instruction text */}
      <div
        style={{
          position:   'absolute',
          left:       88,
          right:      88,
          top:        660,
          fontSize:   56,
          fontWeight: 900,
          color:      theme.colors.textPrimary,
          fontFamily: theme.fonts.body,
          lineHeight: 1.3,
          opacity:    contentEnter,
          transform:  `translateY(${(1 - contentEnter) * 24}px)`,
        }}
      >
        {parts.before}
        <span style={{color: theme.colors.accentViolet}}>{parts.keyword}</span>
        {parts.after}
      </div>

      <ThemeCaption shot={shot} shotDuration={shotDuration} theme={theme} />
    </AbsoluteFill>
  );
};

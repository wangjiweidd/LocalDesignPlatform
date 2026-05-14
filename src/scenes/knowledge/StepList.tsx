import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import type {KnowledgeShotData} from '../../data/types-v2';
import type {OdinTheme} from '../../themes';
import {ThemeCaption} from '../../components/ThemeCaption';
import {clamp, staggerSpring} from '../../utils/springs';
import {splitKeyword} from '../../utils/text';

export const StepList: React.FC<{shot: KnowledgeShotData; theme: OdinTheme; shotDuration: number}> = ({
  shot, theme, shotDuration,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const stepNum    = shot.stepNumber ?? 1;
  const stepEnter  = staggerSpring(frame, fps, 0);
  const titleEnter = staggerSpring(frame, fps, 1);

  const parts = splitKeyword(shot.text, shot.keyword);

  return (
    <AbsoluteFill style={{background: '#F8FAFC'}}>
      {/* Progress dots — fixed at top */}
      <div style={{position: 'absolute', top: 120, left: 88, display: 'flex', gap: 12}}>
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            style={{
              width:        n === stepNum ? 48 : 16,
              height:       16,
              borderRadius: 999,
              background:   n === stepNum ? theme.colors.accent : theme.colors.border,
              transition:   'width 0.3s',
            }}
          />
        ))}
      </div>

      {/* Centered content block */}
      <div
        style={{
          position:      'absolute',
          left:          88,
          right:         88,
          top:           '50%',
          transform:     'translateY(-54%)',
          display:       'flex',
          flexDirection: 'column',
        }}
      >
        {/* Step number */}
        <div
          style={{
            fontSize:     160,
            fontWeight:   900,
            color:        theme.colors.accent,
            fontFamily:   theme.fonts.mono,
            lineHeight:   1,
            opacity:      stepEnter,
            transform:    `translateY(${(1 - stepEnter) * 24}px)`,
          }}
        >
          {String(stepNum).padStart(2, '0')}
        </div>

        {/* Divider */}
        <div
          style={{
            width:        interpolate(stepEnter, [0, 1], [0, 320], clamp),
            height:       4,
            background:   theme.colors.accent,
            borderRadius: 999,
            margin:       '20px 0 32px',
          }}
        />

        {/* Step title */}
        <div
          style={{
            fontSize:   72,
            fontWeight: 900,
            color:      '#0F172A',
            fontFamily: theme.fonts.body,
            lineHeight: 1.2,
            opacity:    titleEnter,
            transform:  `translateY(${(1 - titleEnter) * 20}px)`,
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

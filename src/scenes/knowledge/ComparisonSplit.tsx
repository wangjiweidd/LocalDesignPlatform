import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import type {KnowledgeShotData} from '../../data/types-v2';
import type {OdinTheme} from '../../themes';
import {ThemeCaption} from '../../components/ThemeCaption';
import {clamp, staggerSpring} from '../../utils/springs';

export const ComparisonSplit: React.FC<{shot: KnowledgeShotData; theme: OdinTheme; shotDuration: number}> = ({
  shot, theme, shotDuration,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const leftEnter  = staggerSpring(frame, fps, 0);
  const rightEnter = staggerSpring(frame, fps, 1);

  // Divider line grows from centre
  const dividerHeight = interpolate(frame, [4, 20], [0, 100], {
    easing: (t) => t * (2 - t),
    ...clamp,
  });

  const leftLabel  = shot.comparisonLeft  ?? 'Before';
  const rightLabel = shot.comparisonRight ?? 'After';

  return (
    <AbsoluteFill style={{background: theme.colors.bgDark, display: 'flex', flexDirection: 'row'}}>
      {/* Left panel */}
      <div
        style={{
          flex:           1,
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
          justifyContent: 'center',
          padding:        '0 48px',
          opacity:        leftEnter,
          transform:      `translateX(${(1 - leftEnter) * -40}px)`,
        }}
      >
        <div
          style={{
            fontSize:     28,
            fontWeight:   700,
            color:        theme.colors.textSecondary,
            fontFamily:   theme.fonts.display,
            marginBottom: 24,
            letterSpacing: 4,
            textTransform: 'uppercase',
          }}
        >
          {leftLabel}
        </div>
        <div
          style={{
            fontSize:   52,
            fontWeight: 900,
            color:      '#F1F5F9',
            fontFamily: theme.fonts.body,
            lineHeight: 1.3,
            textAlign:  'center',
          }}
        >
          {shot.leftText ?? ''}
        </div>
      </div>

      {/* Vertical divider */}
      <div
        style={{
          width:          2,
          background:     theme.colors.border,
          alignSelf:      'center',
          height:         `${dividerHeight}%`,
          position:       'relative',
        }}
      >
        <div
          style={{
            position:     'absolute',
            top:          '50%',
            left:         '50%',
            transform:    'translate(-50%, -50%)',
            width:        40,
            height:       40,
            borderRadius: 999,
            background:   theme.colors.accent,
            display:      'flex',
            alignItems:   'center',
            justifyContent: 'center',
            fontSize:     20,
            fontWeight:   900,
            color:        '#fff',
            fontFamily:   theme.fonts.display,
          }}
        >
          VS
        </div>
      </div>

      {/* Right panel */}
      <div
        style={{
          flex:           1,
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
          justifyContent: 'center',
          padding:        '0 48px',
          opacity:        rightEnter,
          transform:      `translateX(${(1 - rightEnter) * 40}px)`,
        }}
      >
        <div
          style={{
            fontSize:     28,
            fontWeight:   700,
            color:        theme.colors.accent,
            fontFamily:   theme.fonts.display,
            marginBottom: 24,
            letterSpacing: 4,
            textTransform: 'uppercase',
          }}
        >
          {rightLabel}
        </div>
        <div
          style={{
            fontSize:   52,
            fontWeight: 900,
            color:      theme.colors.accent,
            fontFamily: theme.fonts.body,
            lineHeight: 1.3,
            textAlign:  'center',
          }}
        >
          {shot.rightText ?? ''}
        </div>
      </div>

      <ThemeCaption shot={shot} shotDuration={shotDuration} theme={theme} />
    </AbsoluteFill>
  );
};

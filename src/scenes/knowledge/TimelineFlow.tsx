import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import type {KnowledgeShotData} from '../../data/types-v2';
import type {OdinTheme} from '../../themes';
import {ThemeCaption} from '../../components/ThemeCaption';
import {clamp, staggerSpring} from '../../utils/springs';

export const TimelineFlow: React.FC<{shot: KnowledgeShotData; theme: OdinTheme; shotDuration: number}> = ({
  shot, theme, shotDuration,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const events = shot.timelineEvents ?? [];

  // Connector line grows as last item enters
  const lineProgress = interpolate(
    frame,
    [0, Math.max(1, events.length * (theme.motion.stagger ?? 6) + 10)],
    [0, 100],
    clamp,
  );

  return (
    <AbsoluteFill style={{background: theme.colors.bgDark}}>
      {/* Section label */}
      <div
        style={{
          position:     'absolute',
          left:         88,
          top:          80,
          fontSize:     28,
          fontWeight:   700,
          color:        theme.colors.accentAlt,
          fontFamily:   theme.fonts.display,
          letterSpacing: 3,
          textTransform: 'uppercase',
        }}
      >
        {shot.sectionLabel ?? 'Timeline'}
      </div>

      {/* Vertical connector */}
      <div
        style={{
          position:     'absolute',
          left:         119,
          top:          180,
          width:        4,
          height:       `${lineProgress}%`,
          background:   `linear-gradient(to bottom, ${theme.colors.accent}, ${theme.colors.accentAlt})`,
          borderRadius: 999,
          maxHeight:    580,
        }}
      />

      {/* Timeline events */}
      <div
        style={{
          position:      'absolute',
          left:          88,
          right:         88,
          top:           160,
          display:       'flex',
          flexDirection: 'column',
          gap:           48,
        }}
      >
        {events.map((evt, i) => {
          const enter = staggerSpring(frame, fps, i);
          return (
            <div
              key={i}
              style={{
                display:    'flex',
                alignItems: 'flex-start',
                gap:        40,
                opacity:    enter,
                transform:  `translateY(${(1 - enter) * 24}px)`,
              }}
            >
              {/* Dot */}
              <div
                style={{
                  width:        36,
                  height:       36,
                  borderRadius: 999,
                  background:   i === 0 ? theme.colors.accent : theme.colors.accentAlt,
                  flexShrink:   0,
                  marginTop:    8,
                  border:       `3px solid ${theme.colors.bgDark}`,
                  zIndex:       1,
                }}
              />

              {/* Content */}
              <div style={{flex: 1}}>
                <div
                  style={{
                    fontSize:     24,
                    fontWeight:   700,
                    color:        theme.colors.accent,
                    fontFamily:   theme.fonts.mono,
                    marginBottom: 6,
                  }}
                >
                  {evt.label ?? `Step ${i + 1}`}
                </div>
                <div
                  style={{
                    fontSize:   46,
                    fontWeight: 900,
                    color:      theme.colors.textPrimary,
                    fontFamily: theme.fonts.body,
                    lineHeight: 1.25,
                  }}
                >
                  {evt.text}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <ThemeCaption shot={shot} shotDuration={shotDuration} theme={theme} />
    </AbsoluteFill>
  );
};

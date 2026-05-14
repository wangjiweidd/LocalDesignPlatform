import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import type {KnowledgeShotData} from '../../data/types-v2';
import type {OdinTheme} from '../../themes';
import {ThemeCaption} from '../../components/ThemeCaption';
import {clamp, staggerSpring} from '../../utils/springs';

export const ChecklistReveal: React.FC<{shot: KnowledgeShotData; theme: OdinTheme; shotDuration: number}> = ({
  shot, theme, shotDuration,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const items = shot.checklistItems ?? [];

  return (
    <AbsoluteFill style={{background: '#F8FAFC'}}>
      {/* Section label */}
      <div
        style={{
          position:     'absolute',
          left:         88,
          top:          80,
          fontSize:     28,
          fontWeight:   700,
          color:        theme.colors.accent,
          fontFamily:   theme.fonts.display,
          letterSpacing: 3,
          textTransform: 'uppercase',
        }}
      >
        {shot.sectionLabel ?? 'Key Points'}
      </div>

      {/* Checklist items */}
      <div
        style={{
          position:      'absolute',
          left:          88,
          right:         88,
          top:           160,
          display:       'flex',
          flexDirection: 'column',
          gap:           28,
        }}
      >
        {items.map((item, i) => {
          const enter    = staggerSpring(frame, fps, i);
          const checkW   = interpolate(enter, [0, 1], [0, 36], clamp);

          return (
            <div
              key={i}
              style={{
                display:    'flex',
                alignItems: 'flex-start',
                gap:        24,
                opacity:    enter,
                transform:  `translateX(${(1 - enter) * 32}px)`,
              }}
            >
              {/* Animated check circle */}
              <div
                style={{
                  width:        52,
                  height:       52,
                  borderRadius: 999,
                  border:       `3px solid ${theme.colors.accent}`,
                  flexShrink:   0,
                  marginTop:    4,
                  display:      'flex',
                  alignItems:   'center',
                  justifyContent: 'center',
                  overflow:     'hidden',
                }}
              >
                <div
                  style={{
                    width:        checkW,
                    height:       checkW,
                    borderRadius: 999,
                    background:   theme.colors.accent,
                  }}
                />
              </div>

              {/* Item text */}
              <div
                style={{
                  fontSize:   52,
                  fontWeight: 800,
                  color:      '#0F172A',
                  fontFamily: theme.fonts.body,
                  lineHeight: 1.25,
                  flex:       1,
                }}
              >
                {item}
              </div>
            </div>
          );
        })}
      </div>

      <ThemeCaption shot={shot} shotDuration={shotDuration} theme={theme} />
    </AbsoluteFill>
  );
};

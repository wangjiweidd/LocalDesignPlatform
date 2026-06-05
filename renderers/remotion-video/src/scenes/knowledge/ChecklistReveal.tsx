import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import type {KnowledgeShotData} from '../../data/types-v2';
import type {OdinTheme} from '../../themes';
import {ThemeCaption} from '../../components/ThemeCaption';
import {clamp, staggerSpring} from '../../utils/springs';
import {splitKeyword} from '../../utils/text';

export const ChecklistReveal: React.FC<{shot: KnowledgeShotData; theme: OdinTheme; shotDuration: number}> = ({
  shot, theme, shotDuration,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const items      = shot.checklistItems ?? [];
  const titleEnter = staggerSpring(frame, fps, 0);
  const parts      = splitKeyword(shot.text, shot.keyword);

  return (
    <AbsoluteFill style={{background: '#F8FAFC'}}>
      {/* Centered content */}
      <div
        style={{
          position:      'absolute',
          left:          88,
          right:         88,
          top:           '50%',
          transform:     'translateY(-50%)',
          display:       'flex',
          flexDirection: 'column',
          gap:           0,
        }}
      >
        {/* Section label */}
        <div
          style={{
            fontSize:     28,
            fontWeight:   700,
            color:        theme.colors.accent,
            fontFamily:   theme.fonts.display,
            letterSpacing: 3,
            textTransform: 'uppercase',
            marginBottom: 16,
          }}
        >
          {shot.sectionLabel ?? 'Key Points'}
        </div>

        {/* Title — shot.text */}
        <div
          style={{
            fontSize:     72,
            fontWeight:   900,
            color:        '#0F172A',
            fontFamily:   theme.fonts.body,
            lineHeight:   1.18,
            marginBottom: 48,
            opacity:      titleEnter,
            transform:    `translateY(${(1 - titleEnter) * 20}px)`,
          }}
        >
          {parts.before}
          <span style={{color: theme.colors.accent}}>{parts.keyword}</span>
          {parts.after}
        </div>

        {/* Checklist items */}
        <div style={{display: 'flex', flexDirection: 'column', gap: 28}}>
          {items.map((item, i) => {
            const enter  = staggerSpring(frame, fps, i + 1);
            const checkW = interpolate(enter, [0, 1], [0, 36], clamp);

            return (
              <div
                key={i}
                style={{
                  display:    'flex',
                  alignItems: 'center',
                  gap:        28,
                  opacity:    enter,
                  transform:  `translateX(${(1 - enter) * 32}px)`,
                }}
              >
                {/* Check circle */}
                <div
                  style={{
                    width:        56,
                    height:       56,
                    borderRadius: 999,
                    border:       `3px solid ${theme.colors.accent}`,
                    flexShrink:   0,
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

                <div
                  style={{
                    fontSize:   54,
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
      </div>

      <ThemeCaption shot={shot} shotDuration={shotDuration} theme={theme} />
    </AbsoluteFill>
  );
};

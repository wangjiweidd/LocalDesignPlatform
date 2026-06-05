import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import type {KnowledgeShotData} from '../../data/types-v2';
import type {OdinTheme} from '../../themes';
import {ThemeCaption} from '../../components/ThemeCaption';
import {TechDots} from '../../components/illustrations/TechDots';
import {clamp, staggerSpring, dramaticSlam, smoothReveal} from '../../utils/springs';
import {splitKeyword} from '../../utils/text';

// Maps timelineYear strings to 1-based stage index
const STAGE_INDEX: Record<string, number> = {
  '1~2年级': 1,
  '3~4年级': 2,
  '5~6年级': 3,
};
const STAGE_ORDINALS = ['一', '二', '三', '四', '五'];

// ── Hero mode: single milestone (timelineYear, no timelineEvents) ──
const TimelineHero: React.FC<{
  shot: KnowledgeShotData; theme: OdinTheme; shotDuration: number;
  frame: number; fps: number;
}> = ({shot, theme, shotDuration, frame, fps}) => {
  const stageNum   = STAGE_INDEX[shot.timelineYear ?? ''] ?? 1;
  const ordinal    = STAGE_ORDINALS[stageNum - 1] ?? String(stageNum);

  const badgeEnter   = smoothReveal(frame, fps);
  const slamVal      = dramaticSlam(frame, fps);
  const gradeScale   = interpolate(slamVal, [0, 1], [0.5, 1], clamp);
  const gradeOpacity = interpolate(slamVal, [0, 0.4], [0, 1], clamp);
  const textEnter    = smoothReveal(Math.max(0, frame - 20), fps);

  // Strip leading "X~Y年级：" prefix — grade is shown as hero above
  const insightText  = shot.text.replace(/^\d+~\d+年级[：:]/, '').trim();
  const insightParts = splitKeyword(insightText, shot.keyword);

  return (
    <AbsoluteFill style={{background: theme.colors.bgDark}}>
      <TechDots width={1080} height={1920} color="#ffffff" frame={frame} cols={8} rows={14} opacity={0.07} />

      {/* Horizontal accent strip — top */}
      <div style={{
        position:   'absolute',
        top:        0,
        left:       0,
        right:      0,
        height:     6,
        background: `linear-gradient(to right, transparent, ${theme.colors.accent}, transparent)`,
        opacity:    badgeEnter,
      }} />

      {/* Stage badge */}
      <div style={{
        position:       'absolute',
        top:            180,
        left:           0,
        right:          0,
        display:        'flex',
        justifyContent: 'center',
        opacity:        badgeEnter,
        transform:      `translateY(${(1 - badgeEnter) * 16}px)`,
      }}>
        <div style={{
          background:    `${theme.colors.accent}20`,
          border:        `2px solid ${theme.colors.accent}55`,
          borderRadius:  999,
          padding:       '14px 48px',
          fontSize:      34,
          fontWeight:    700,
          color:         theme.colors.accent,
          fontFamily:    theme.fonts.display,
          letterSpacing: 2,
        }}>
          第{ordinal}个分水岭
        </div>
      </div>

      {/* Grade label — hero element */}
      <div style={{
        position:       'absolute',
        top:            310,
        left:           0,
        right:          0,
        display:        'flex',
        justifyContent: 'center',
        transform:      `scale(${gradeScale})`,
        opacity:        gradeOpacity,
      }}>
        <div style={{
          fontSize:      148,
          fontWeight:    900,
          color:         theme.colors.textPrimary,
          fontFamily:    theme.fonts.body,
          lineHeight:    1,
          letterSpacing: -2,
        }}>
          {shot.timelineYear}
        </div>
      </div>

      {/* Divider */}
      <div style={{
        position:   'absolute',
        top:        530,
        left:       88,
        right:      88,
        height:     3,
        borderRadius: 999,
        background: `linear-gradient(to right, transparent, ${theme.colors.accent}88, transparent)`,
        opacity:    textEnter,
      }} />

      {/* Insight text */}
      <div style={{
        position:   'absolute',
        top:        580,
        left:       88,
        right:      88,
        opacity:    textEnter,
        transform:  `translateY(${(1 - textEnter) * 28}px)`,
        fontSize:   72,
        fontWeight: 900,
        color:      theme.colors.textPrimary,
        fontFamily: theme.fonts.body,
        lineHeight: 1.3,
        textAlign:  'center',
      }}>
        {insightParts.before}
        <span style={{color: theme.colors.accent}}>{insightParts.keyword}</span>
        {insightParts.after}
      </div>

      {/* Progress dots — 3 stages indicator */}
      <div style={{
        position:       'absolute',
        bottom:         280,
        left:           0,
        right:          0,
        display:        'flex',
        justifyContent: 'center',
        gap:            20,
      }}>
        {[1, 2, 3].map((n) => {
          const dotEnter = staggerSpring(frame, fps, n + 1, 5);
          const isActive = n === stageNum;
          return (
            <div key={n} style={{
              width:        isActive ? 52 : 16,
              height:       16,
              borderRadius: 999,
              background:   isActive ? theme.colors.accent : theme.colors.border,
              opacity:      dotEnter,
            }} />
          );
        })}
      </div>

      <ThemeCaption shot={shot} shotDuration={shotDuration} theme={theme} />
    </AbsoluteFill>
  );
};

// ── Multi-event mode (vertical timeline list) ────────────────────
export const TimelineFlow: React.FC<{shot: KnowledgeShotData; theme: OdinTheme; shotDuration: number}> = ({
  shot, theme, shotDuration,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Switch to hero mode when only timelineYear is set
  const events = shot.timelineEvents ?? [];
  if (shot.timelineYear && events.length === 0) {
    return <TimelineHero shot={shot} theme={theme} shotDuration={shotDuration} frame={frame} fps={fps} />;
  }

  // Connector line grows as last item enters
  const lineProgress = interpolate(
    frame,
    [0, Math.max(1, events.length * (theme.motion.stagger ?? 6) + 10)],
    [0, 100],
    clamp,
  );

  return (
    <AbsoluteFill style={{background: theme.colors.bgDark}}>
      <TechDots width={1080} height={1920} color="#ffffff" frame={frame} cols={8} rows={14} opacity={0.07} />
      {/* Section label */}
      <div
        style={{
          position:      'absolute',
          left:          88,
          top:           80,
          fontSize:      28,
          fontWeight:    700,
          color:         theme.colors.accentAlt,
          fontFamily:    theme.fonts.display,
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

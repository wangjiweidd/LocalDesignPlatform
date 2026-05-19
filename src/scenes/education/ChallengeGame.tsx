import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import type {EducationShotData} from '../../data/types-v2';
import type {YaoningTheme} from '../../themes';
import {PersistentHeader} from '../../components/PersistentHeader';
import {TYPE, ZONES, MILESTONES} from '../../design-tokens';
import {clamp, dramaticSlam, staggerSpring} from '../../utils/springs';
import {splitKeyword} from '../../utils/text';

const STAGE_ZH = ['一', '二', '三'];

export const ChallengeGame: React.FC<{shot: EducationShotData; theme: YaoningTheme; shotDuration: number}> = ({
  shot, theme,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const stageEnter   = staggerSpring(frame, fps, 0);
  const gradeEnter   = dramaticSlam(frame, fps);
  const insightEnter = staggerSpring(frame, fps, 1);
  const timelineEnter = staggerSpring(frame, fps, 2);
  const captionEnter  = staggerSpring(frame, fps, 3);

  const colonIdx    = shot.text.indexOf('：') !== -1 ? shot.text.indexOf('：') : shot.text.indexOf(':');
  const gradeLabel  = colonIdx > -1 ? shot.text.slice(0, colonIdx) : shot.text;
  const insightText = colonIdx > -1 ? shot.text.slice(colonIdx + 1) : '';
  const insightParts = splitKeyword(insightText, shot.keyword);
  const captionParts = splitKeyword(shot.caption, shot.captionKeyword);

  const stepNum = shot.stepNumber ?? 1;

  return (
    <AbsoluteFill style={{background: theme.colors.bg}}>
      <PersistentHeader theme={theme} />

      {/* ── Stage label — small, centered ── */}
      <div style={{
        position: 'absolute', left: 0, right: 0, top: 130,
        textAlign: 'center',
        opacity: stageEnter,
        transform: `translateY(${(1 - stageEnter) * 12}px)`,
      }}>
        <div style={{
          display: 'inline-block',
          background: theme.colors.accent,
          padding: '10px 28px',
          borderRadius: 999,
        }}>
          <span style={{
            fontSize: 28,
            fontWeight: 800,
            color: '#fff',
            fontFamily: theme.fonts.body,
            letterSpacing: 2,
          }}>
            第{STAGE_ZH[stepNum - 1]}个分水岭
          </span>
        </div>
      </div>

      {/* ── HERO grade label — centered ── */}
      <div style={{
        position: 'absolute',
        left: 0, right: 0, top: 220,
        textAlign: 'center',
        opacity: gradeEnter,
        transform: `scale(${interpolate(gradeEnter, [0, 1], [0.5, 1.02], clamp)})`,
      }}>
        <div style={{
          fontSize: TYPE.hero,
          fontWeight: 900,
          color: theme.colors.accent,
          fontFamily: theme.fonts.display,
          lineHeight: 1.0,
          letterSpacing: -4,
        }}>
          {gradeLabel}
        </div>
      </div>

      {/* ── Insight statement — centered ── */}
      <div style={{
        position: 'absolute',
        left: ZONES.padX, right: ZONES.padX, top: 440,
        textAlign: 'center',
        opacity: insightEnter,
        transform: `translateY(${(1 - insightEnter) * 20}px)`,
      }}>
        <div style={{
          fontSize: TYPE.subtitle,
          fontWeight: 900,
          color: theme.colors.textPrimary,
          fontFamily: theme.fonts.body,
          lineHeight: 1.3,
          letterSpacing: -0.5,
        }}>
          {insightParts.before}
          <span style={{
            color: theme.colors.accent,
            background: `linear-gradient(180deg, transparent 65%, ${theme.colors.accent}30 65%)`,
            padding: '0 4px',
          }}>
            {insightParts.keyword}
          </span>
          {insightParts.after}
        </div>
      </div>

      {/* ── Centered milestone progress (horizontal but readable) ── */}
      <div style={{
        position: 'absolute',
        left: ZONES.padX, right: ZONES.padX, top: 700,
        opacity: timelineEnter,
        transform: `translateY(${(1 - timelineEnter) * 24}px)`,
      }}>
        <div style={{
          background: theme.colors.surface,
          borderRadius: 28,
          padding: '40px 36px',
          border: `2px solid ${theme.colors.border}`,
          boxShadow: '0 8px 32px rgba(249,115,22,0.08)',
          position: 'relative',
        }}>
          {/* Track */}
          <div style={{
            position: 'absolute',
            left: 'calc(36px + 44px)',
            right: 'calc(36px + 44px)',
            top: 'calc(40px + 44px)',
            height: 4,
            background: theme.colors.border,
            borderRadius: 2,
          }} />
          {/* Active track */}
          <div style={{
            position: 'absolute',
            left: 'calc(36px + 44px)',
            top: 'calc(40px + 44px)',
            width: stepNum === 1 ? 0 : `calc((100% - 72px - 88px) * ${(stepNum === 2 ? 0.5 : 1) * timelineEnter})`,
            height: 4,
            background: `linear-gradient(90deg, ${theme.colors.accent}, ${theme.colors.accentViolet})`,
            borderRadius: 2,
          }} />

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            position: 'relative',
            zIndex: 1,
          }}>
            {MILESTONES.map((m, i) => {
              const n = i + 1;
              const isActive = n === stepNum;
              const isDone   = n < stepNum;
              const isFuture = n > stepNum;
              return (
                <div key={n} style={{
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: 14,
                  opacity: isFuture ? 0.4 : 1,
                  flex: 1,
                }}>
                  <div style={{
                    width: 88, height: 88, borderRadius: 999,
                    background: (isActive || isDone)
                      ? `linear-gradient(135deg, ${theme.colors.accent}, ${theme.colors.accentViolet})`
                      : theme.colors.surface,
                    border: `3px solid ${(isActive || isDone) ? 'transparent' : theme.colors.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: isActive ? `0 8px 24px ${theme.colors.accent}50` : 'none',
                  }}>
                    <span style={{
                      fontSize: 40, fontWeight: 900,
                      color: (isActive || isDone) ? '#fff' : theme.colors.textSecondary,
                      fontFamily: theme.fonts.numbers,
                      lineHeight: 1,
                    }}>
                      {n}
                    </span>
                  </div>
                  <div style={{
                    fontSize: 30,
                    fontWeight: isActive ? 900 : 700,
                    color: isActive ? theme.colors.textPrimary : theme.colors.textSecondary,
                    fontFamily: theme.fonts.body,
                    lineHeight: 1.2,
                    textAlign: 'center',
                  }}>
                    {m.grade}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Caption — centered ── */}
      <div style={{
        position: 'absolute',
        left: ZONES.padX, right: ZONES.padX,
        top: ZONES.contentBottom - 140,
        opacity: captionEnter,
        transform: `translateY(${(1 - captionEnter) * 24}px)`,
      }}>
        <div style={{
          background: theme.colors.bgDeep,
          borderRadius: 20,
          padding: '28px 40px',
          border: `2px solid ${theme.colors.border}`,
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: TYPE.caption,
            fontWeight: 700,
            color: theme.colors.textPrimary,
            fontFamily: theme.fonts.body,
            lineHeight: 1.42,
          }}>
            {captionParts.before}
            <span style={{color: theme.colors.accent, fontWeight: 900}}>{captionParts.keyword}</span>
            {captionParts.after}
          </div>
        </div>
      </div>

    </AbsoluteFill>
  );
};

import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Lottie} from '@remotion/lottie';
import type {EducationShotData} from '../../data/types-v2';
import type {YaoningTheme} from '../../themes';
import {PersistentHeader} from '../../components/PersistentHeader';
import {TYPE, ZONES} from '../../design-tokens';
import {clamp, dramaticSlam, staggerSpring} from '../../utils/springs';
import {getLottie} from '../../utils/assetCatalog';
import {splitKeyword} from '../../utils/text';

export const CelebrateWin: React.FC<{shot: EducationShotData; theme: YaoningTheme; shotDuration: number}> = ({
  shot, theme,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const titleEnter   = dramaticSlam(frame, fps);
  const sealEnter    = staggerSpring(frame, fps, 2);
  const captionEnter = staggerSpring(frame, fps, 3);

  const lottieData = getLottie(shot.lottieId ?? 'fx-confetti-warm');

  const parts        = splitKeyword(shot.text, shot.keyword);
  const captionParts = splitKeyword(shot.caption, shot.captionKeyword);

  return (
    <AbsoluteFill style={{background: `linear-gradient(160deg, ${theme.colors.bg}, ${theme.colors.bgDeep})`}}>
      {/* Confetti overlay */}
      {lottieData && (
        <div style={{position: 'absolute', inset: 0, opacity: 0.6, zIndex: 0}}>
          <Lottie animationData={lottieData} playbackRate={1} style={{width: '100%', height: '100%'}} />
        </div>
      )}

      <PersistentHeader theme={theme} />

      {/* ── Hero title — centered ── */}
      <div style={{
        position: 'absolute',
        left: ZONES.padX, right: ZONES.padX, top: 220,
        textAlign: 'center', zIndex: 2,
        opacity: titleEnter,
        transform: `scale(${interpolate(titleEnter, [0, 1], [0.7, 1.02], clamp)})`,
      }}>
        <div style={{
          fontSize: 100,
          fontWeight: 900,
          color: theme.colors.textPrimary,
          fontFamily: theme.fonts.display,
          lineHeight: 1.18,
          letterSpacing: -2,
        }}>
          {parts.before}
          <span style={{
            color: theme.colors.accent,
            background: `linear-gradient(180deg, transparent 62%, ${theme.colors.accent}30 62%)`,
            padding: '0 6px',
          }}>
            {parts.keyword}
          </span>
          {parts.after}
        </div>
      </div>

      {/* ── 3-checkmark seal centered ── */}
      <div style={{
        position: 'absolute',
        left: 0, right: 0, top: 700,
        display: 'flex', justifyContent: 'center', zIndex: 2,
        opacity: sealEnter,
        transform: `scale(${interpolate(sealEnter, [0, 1], [0.5, 1], clamp)})`,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 28,
          padding: '36px 60px',
          background: theme.colors.surface,
          borderRadius: 999,
          border: `3px solid ${theme.colors.celebrate}`,
          boxShadow: `0 12px 40px ${theme.colors.celebrate}30`,
        }}>
          {[1, 2, 3].map((n) => (
            <div key={n} style={{
              width: 72, height: 72, borderRadius: 999,
              background: `linear-gradient(135deg, ${theme.colors.accent}, ${theme.colors.accentViolet})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 4px 16px ${theme.colors.accent}40`,
            }}>
              <span style={{
                fontSize: 36, fontWeight: 900, color: '#fff',
                fontFamily: theme.fonts.body, lineHeight: 1,
              }}>
                ✓
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Subtitle ── */}
      <div style={{
        position: 'absolute', left: 0, right: 0, top: 900,
        textAlign: 'center', zIndex: 2,
        opacity: sealEnter,
      }}>
        <span style={{
          fontSize: TYPE.body, fontWeight: 800,
          color: theme.colors.celebrate,
          fontFamily: theme.fonts.body,
          letterSpacing: 1,
        }}>
          3 个分水岭，每一步都不掉队
        </span>
      </div>

      {/* ── Caption ── */}
      <div style={{
        position: 'absolute',
        left: ZONES.padX, right: ZONES.padX,
        top: ZONES.contentBottom - 140,
        zIndex: 2,
        opacity: captionEnter,
        transform: `translateY(${(1 - captionEnter) * 24}px)`,
      }}>
        <div style={{
          background: theme.colors.surface,
          borderRadius: 20,
          padding: '28px 40px',
          border: `2px solid ${theme.colors.border}`,
          boxShadow: '0 6px 24px rgba(0,0,0,0.08)',
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: TYPE.caption, fontWeight: 700,
            color: theme.colors.textPrimary,
            fontFamily: theme.fonts.body,
            lineHeight: 1.42,
          }}>
            {captionParts.before}
            <span style={{color: theme.colors.celebrate, fontWeight: 900}}>{captionParts.keyword}</span>
            {captionParts.after}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

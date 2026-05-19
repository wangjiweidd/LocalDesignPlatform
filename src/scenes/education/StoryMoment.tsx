import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import type {EducationShotData} from '../../data/types-v2';
import type {YaoningTheme} from '../../themes';
import {PersistentHeader} from '../../components/PersistentHeader';
import {TYPE, ZONES} from '../../design-tokens';
import {clamp, dramaticSlam, staggerSpring} from '../../utils/springs';
import {splitKeyword} from '../../utils/text';

export const StoryMoment: React.FC<{shot: EducationShotData; theme: YaoningTheme; shotDuration: number}> = ({
  shot, theme,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const quoteEnter   = dramaticSlam(frame, fps);
  const titleEnter   = staggerSpring(frame, fps, 1);
  const captionEnter = staggerSpring(frame, fps, 3);

  const titleParts   = splitKeyword(shot.text,    shot.keyword);
  const captionParts = splitKeyword(shot.caption, shot.captionKeyword);

  return (
    <AbsoluteFill style={{background: theme.colors.bg}}>
      <PersistentHeader theme={theme} />

      {/* ── Giant quote mark — centered ── */}
      <div style={{
        position: 'absolute',
        left: 0, right: 0, top: 160,
        textAlign: 'center',
        opacity: quoteEnter,
        transform: `scale(${interpolate(quoteEnter, [0, 1], [0.4, 1], clamp)})`,
      }}>
        <div style={{
          fontSize: 360,
          fontWeight: 900,
          color: theme.colors.accent,
          fontFamily: theme.fonts.display,
          lineHeight: 0.65,
          letterSpacing: -10,
        }}>
          “
        </div>
      </div>

      {/* ── Pull-quote title — centered ── */}
      <div style={{
        position: 'absolute',
        left: ZONES.padX, right: ZONES.padX, top: 480,
        textAlign: 'center',
        opacity: titleEnter,
        transform: `translateY(${(1 - titleEnter) * 24}px)`,
      }}>
        <div style={{
          fontSize: 92,
          fontWeight: 900,
          color: theme.colors.textPrimary,
          fontFamily: theme.fonts.display,
          lineHeight: 1.22,
          letterSpacing: -1,
        }}>
          {titleParts.before}
          <span style={{
            color: theme.colors.accent,
            background: `linear-gradient(180deg, transparent 62%, ${theme.colors.accent}30 62%)`,
            padding: '0 6px',
          }}>
            {titleParts.keyword}
          </span>
          {titleParts.after}
        </div>
      </div>

      {/* ── Closing accent line ── */}
      <div style={{
        position: 'absolute', left: 0, right: 0, top: 980,
        textAlign: 'center',
        opacity: titleEnter,
      }}>
        <div style={{
          display: 'inline-block',
          width: 80, height: 4,
          borderRadius: 2,
          background: theme.colors.accent,
        }} />
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
          background: theme.colors.surface,
          borderRadius: 20,
          padding: '28px 40px',
          border: `2px solid ${theme.colors.border}`,
          boxShadow: '0 6px 24px rgba(0,0,0,0.06)',
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

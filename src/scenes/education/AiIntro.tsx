import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import type {EducationShotData} from '../../data/types-v2';
import type {YaoningTheme} from '../../themes';
import {PersistentHeader} from '../../components/PersistentHeader';
import {TYPE, ZONES} from '../../design-tokens';
import {bouncyEnter, clamp, dramaticSlam, staggerSpring} from '../../utils/springs';
import {splitKeyword} from '../../utils/text';

export const AiIntro: React.FC<{shot: EducationShotData; theme: YaoningTheme; shotDuration: number}> = ({
  shot, theme,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const titleEnter   = bouncyEnter(frame, fps);
  const numberEnter  = dramaticSlam(frame, fps);
  const labelEnter   = staggerSpring(frame, fps, 2);
  const captionEnter = staggerSpring(frame, fps, 3);

  // Original: "小学6年有3个关键分水岭"
  // Split around "3" so it can be the visual anchor
  const fullText = shot.text;
  const numIdx = fullText.indexOf('3');
  const before = numIdx > -1 ? fullText.slice(0, numIdx) : fullText;
  const after  = numIdx > -1 ? fullText.slice(numIdx + 1) : '';

  const captionParts = splitKeyword(shot.caption, shot.captionKeyword);

  return (
    <AbsoluteFill style={{background: theme.colors.bg}}>
      <PersistentHeader theme={theme} />

      {/* ── Headline — top phrase ── */}
      <div style={{
        position: 'absolute',
        left: 0, right: 0, top: 160,
        textAlign: 'center',
        opacity: titleEnter,
        transform: `translateY(${(1 - titleEnter) * 24}px)`,
      }}>
        <div style={{
          fontSize: TYPE.title,
          fontWeight: 900,
          color: theme.colors.textPrimary,
          fontFamily: theme.fonts.display,
          lineHeight: 1.2,
          letterSpacing: -1,
        }}>
          {before}
        </div>
      </div>

      {/* ── Hero numeral "3" — visual anchor ── */}
      <div style={{
        position: 'absolute',
        left: 0, right: 0, top: 320,
        textAlign: 'center',
        opacity: numberEnter,
        transform: `scale(${interpolate(numberEnter, [0, 1], [0.3, 1], clamp)})`,
      }}>
        <div style={{
          fontSize: 520,
          fontWeight: 900,
          fontFamily: theme.fonts.display,
          lineHeight: 0.9,
          letterSpacing: -20,
          background: `linear-gradient(180deg, ${theme.colors.accent} 0%, ${theme.colors.accentViolet} 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          3
        </div>
      </div>

      {/* ── Closing phrase below numeral ── */}
      <div style={{
        position: 'absolute',
        left: 0, right: 0, top: 900,
        textAlign: 'center',
        opacity: labelEnter,
        transform: `translateY(${(1 - labelEnter) * 16}px)`,
      }}>
        <div style={{
          fontSize: TYPE.title,
          fontWeight: 900,
          color: theme.colors.textPrimary,
          fontFamily: theme.fonts.display,
          lineHeight: 1.1,
          letterSpacing: -1,
        }}>
          {after.replace(/^个/, '')}
        </div>
      </div>

      {/* ── Caption ── */}
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
            <span style={{color: theme.colors.accentViolet, fontWeight: 900}}>{captionParts.keyword}</span>
            {captionParts.after}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import type {EducationShotData} from '../../data/types-v2';
import type {YaoningTheme} from '../../themes';
import {PersistentHeader} from '../../components/PersistentHeader';
import {ThemeCaption} from '../../components/ThemeCaption';
import {EducationStage} from '../../components/EducationStage';
import {ParentCompanionAnimation} from '../../components/SemanticEducationAnimations';
import {clamp, dramaticSlam, staggerSpring} from '../../utils/springs';

export const ChallengeGame: React.FC<{
  shot: EducationShotData;
  theme: YaoningTheme;
  shotDuration: number;
  videoTitle?: string;
  videoKeyword?: string;
}> = ({shot, theme, shotDuration, videoTitle, videoKeyword}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const heroEnter = dramaticSlam(frame, fps);
  const railEnter = staggerSpring(frame, fps, 1);
  const stepNum = Math.max(1, Math.min(3, shot.stepNumber ?? 1));
  const isParentCompanion = shot.captionKeyword === '家长陪';

  return (
    <AbsoluteFill style={{background: theme.colors.bg}}>
      <PersistentHeader theme={theme} title={videoTitle} keyword={videoKeyword} />

      <EducationStage width={900} height={820}>
        {isParentCompanion ? (
          <ParentCompanionAnimation theme={theme} frame={frame} fps={fps} />
        ) : (
        <div
          style={{
            opacity: railEnter,
            transform: `translateY(${(1 - railEnter) * 28}px)`,
          }}
        >
          <svg width={900} height={560} viewBox="0 0 900 560" aria-hidden>
            <circle cx={450} cy={280} r={252} fill={theme.colors.surface} opacity={0.38} />
            <path
              d="M124 300 C282 146 618 146 776 300"
              fill="none"
              stroke={theme.colors.surface}
              strokeWidth={44}
              strokeLinecap="round"
              opacity={0.58}
            />
            <path
              d="M124 300 C282 146 618 146 776 300"
              fill="none"
              stroke={theme.colors.border}
              strokeWidth={20}
              strokeLinecap="round"
            />
            <path
              d="M124 300 C282 146 618 146 776 300"
              fill="none"
              stroke={theme.colors.accent}
              strokeWidth={20}
              strokeLinecap="round"
              strokeDasharray="680"
              strokeDashoffset={stepNum === 1 ? 680 : stepNum === 2 ? 340 * (1 - railEnter) : 0}
              opacity={stepNum === 1 ? 0 : 0.9}
            />
            {[124, 450, 776].map((cx, i) => {
              const n = i + 1;
              const active = n === stepNum;
              const done = n < stepNum;
              const scale = active ? interpolate(heroEnter, [0, 1], [0.7, 1], clamp) : 1;
              return (
                <g key={cx} transform={`translate(${cx} 300) scale(${scale}) translate(${-cx} -300)`}>
                  {active ? (
                    <circle cx={cx} cy={300} r={116} fill={theme.colors.accent} opacity={0.15} />
                  ) : null}
                  <circle
                    cx={cx}
                    cy={300}
                    r={done || active ? 78 : 58}
                    fill={done || active ? `url(#active-${n})` : theme.colors.surface}
                    stroke={theme.colors.textPrimary}
                    strokeWidth={done || active ? 8 : 5}
                    opacity={done || active ? 1 : 0.42}
                  />
                  <circle
                    cx={cx}
                    cy={300}
                    r={done || active ? 23 : 14}
                    fill={done || active ? '#FFFFFF' : theme.colors.border}
                  />
                  <defs>
                    <linearGradient id={`active-${n}`} x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor={theme.colors.accent} />
                      <stop offset="100%" stopColor={theme.colors.accentViolet} />
                    </linearGradient>
                  </defs>
                </g>
              );
            })}
          </svg>
        </div>
        )}
      </EducationStage>

      <ThemeCaption shot={shot} shotDuration={shotDuration} theme={theme} />
    </AbsoluteFill>
  );
};

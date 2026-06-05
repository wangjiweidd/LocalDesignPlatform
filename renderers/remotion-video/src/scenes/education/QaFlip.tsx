import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import type {EducationShotData} from '../../data/types-v2';
import type {YaoningTheme} from '../../themes';
import {PersistentHeader} from '../../components/PersistentHeader';
import {ThemeCaption} from '../../components/ThemeCaption';
import {EducationStage} from '../../components/EducationStage';
import {bouncyEnter, clamp, staggerSpring} from '../../utils/springs';

export const QaFlip: React.FC<{
  shot: EducationShotData;
  theme: YaoningTheme;
  shotDuration: number;
  videoTitle?: string;
  videoKeyword?: string;
}> = ({shot, theme, shotDuration, videoTitle, videoKeyword}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const iconEnter = bouncyEnter(frame, fps);
  const cardEnter = staggerSpring(frame, fps, 1);
  const isQuestion = shot.isQuestionShot ?? true;
  const accent = isQuestion ? theme.colors.question : theme.colors.celebrate;
  const flip = interpolate(cardEnter, [0, 1], [0.12, 1], clamp);

  return (
    <AbsoluteFill style={{background: theme.colors.bg}}>
      <PersistentHeader theme={theme} title={videoTitle} keyword={videoKeyword} />

      <EducationStage width={840} height={820}>
        <div
          style={{
            opacity: iconEnter,
            transform: `scale(${interpolate(iconEnter, [0, 1], [0.64, 1], clamp)})`,
          }}
        >
          <svg width={720} height={700} viewBox="0 0 720 700" aria-hidden>
            <circle cx={360} cy={330} r={268} fill={theme.colors.surface} opacity={0.36} />
            <circle cx={360} cy={170} r={112} fill={theme.colors.surface} stroke={theme.colors.textPrimary} strokeWidth={10} />
            {isQuestion ? (
              <>
                <path d="M314 136c4-40 38-64 78-52 34 10 52 40 44 72-7 26-28 40-54 50-18 8-26 18-26 36" fill="none" stroke={accent} strokeWidth={24} strokeLinecap="round" />
                <circle cx={356} cy={274} r={16} fill={accent} />
              </>
            ) : (
              <>
                <path d="M360 82c-52 0-92 38-92 86 0 34 20 62 52 79v34h80v-34c32-17 52-45 52-79 0-48-40-86-92-86Z" fill={theme.colors.accentYellow} stroke={theme.colors.textPrimary} strokeWidth={10} strokeLinejoin="round" />
                <path d="M328 314h64" stroke={theme.colors.textPrimary} strokeWidth={12} strokeLinecap="round" />
              </>
            )}

            <g transform={`translate(80 390) scale(${flip} 1)`}>
              <rect x={0} y={0} width={560} height={210} rx={34} fill={`url(#qa-grad)`} stroke={theme.colors.textPrimary} strokeWidth={8} />
              {[0, 1, 2].map((i) => (
                <g key={i} transform={`translate(${120 + i * 160} 105)`}>
                  <circle r={40} fill="#FFFFFF" opacity={0.92} />
                  {isQuestion ? (
                    <circle r={13} fill={theme.colors.textPrimary} opacity={0.76} />
                  ) : (
                    <path d="M-20 0 -4 18 24 -22" fill="none" stroke={accent} strokeWidth={13} strokeLinecap="round" strokeLinejoin="round" />
                  )}
                </g>
              ))}
            </g>

            <defs>
              <linearGradient id="qa-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={accent} />
                <stop offset="100%" stopColor={theme.colors.accent} />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </EducationStage>

      <ThemeCaption shot={shot} shotDuration={shotDuration} theme={theme} />
    </AbsoluteFill>
  );
};

import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Lottie} from '@remotion/lottie';
import type {EducationShotData} from '../../data/types-v2';
import type {YaoningTheme} from '../../themes';
import {PersistentHeader} from '../../components/PersistentHeader';
import {ThemeCaption} from '../../components/ThemeCaption';
import {EducationStage} from '../../components/EducationStage';
import {clamp, dramaticSlam, staggerSpring} from '../../utils/springs';
import {getLottie} from '../../utils/assetCatalog';

export const CelebrateWin: React.FC<{
  shot: EducationShotData;
  theme: YaoningTheme;
  shotDuration: number;
  videoTitle?: string;
  videoKeyword?: string;
}> = ({shot, theme, shotDuration, videoTitle, videoKeyword}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const heroEnter = dramaticSlam(frame, fps);
  const sealEnter = staggerSpring(frame, fps, 1);
  const lottieData = getLottie(shot.lottieId ?? 'fx-confetti-warm');

  return (
    <AbsoluteFill style={{background: theme.colors.bg}}>
      {lottieData && (
        <div style={{position: 'absolute', inset: 0, opacity: 0.42, zIndex: 0}}>
          <Lottie animationData={lottieData} playbackRate={1} style={{width: '100%', height: '100%'}} />
        </div>
      )}

      <PersistentHeader theme={theme} title={videoTitle} keyword={videoKeyword} />

      <EducationStage width={860} height={820}>
        <div
          style={{
            zIndex: 2,
            opacity: heroEnter,
            transform: `scale(${interpolate(heroEnter, [0, 1], [0.64, 1], clamp)})`,
          }}
        >
          <svg width={760} height={700} viewBox="0 0 760 700" aria-hidden>
            <circle cx={380} cy={330} r={262} fill={theme.colors.surface} opacity={0.76} />
            <circle cx={380} cy={330} r={202} fill={theme.colors.celebrate} opacity={0.13} />
            {[0, 1, 2].map((i) => {
              const cx = 220 + i * 160;
              return (
                <g key={i} transform={`translate(${cx} 330) scale(${sealEnter})`}>
                  <circle r={76} fill={`url(#win-grad-${i})`} stroke={theme.colors.textPrimary} strokeWidth={8} />
                  <path d="M-30 4 -9 30 36 -36" fill="none" stroke="#FFFFFF" strokeWidth={18} strokeLinecap="round" strokeLinejoin="round" />
                  <defs>
                    <linearGradient id={`win-grad-${i}`} x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor={theme.colors.accent} />
                      <stop offset="100%" stopColor={theme.colors.accentViolet} />
                    </linearGradient>
                  </defs>
                </g>
              );
            })}
            <circle cx={250} cy={536} r={24} fill={theme.colors.accentYellow} opacity={0.72 * sealEnter} />
            <circle cx={528} cy={536} r={30} fill={theme.colors.accent} opacity={0.42 * sealEnter} />
            <circle cx={332} cy={544} r={18} fill={theme.colors.celebrate} opacity={0.18 * sealEnter} />
          </svg>
        </div>
      </EducationStage>

      <ThemeCaption shot={shot} shotDuration={shotDuration} theme={theme} />
    </AbsoluteFill>
  );
};

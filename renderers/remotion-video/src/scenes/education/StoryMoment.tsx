import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import type {EducationShotData} from '../../data/types-v2';
import type {YaoningTheme} from '../../themes';
import {PersistentHeader} from '../../components/PersistentHeader';
import {ThemeCaption} from '../../components/ThemeCaption';
import {EducationStage} from '../../components/EducationStage';
import {ExtraEffortAnimation} from '../../components/SemanticEducationAnimations';
import {clamp, dramaticSlam, staggerSpring} from '../../utils/springs';

export const StoryMoment: React.FC<{
  shot: EducationShotData;
  theme: YaoningTheme;
  shotDuration: number;
  videoTitle?: string;
  videoKeyword?: string;
}> = ({shot, theme, shotDuration, videoTitle, videoKeyword}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const bubbleEnter = dramaticSlam(frame, fps);
  const orbitEnter = staggerSpring(frame, fps, 1);
  const isExtraEffort = shot.captionKeyword === '几倍力气';

  return (
    <AbsoluteFill style={{background: theme.colors.bg}}>
      <PersistentHeader theme={theme} title={videoTitle} keyword={videoKeyword} />

      <EducationStage width={840} height={820}>
        {isExtraEffort ? (
          <ExtraEffortAnimation theme={theme} frame={frame} fps={fps} />
        ) : (
        <div
          style={{
            opacity: bubbleEnter,
            transform: `scale(${interpolate(bubbleEnter, [0, 1], [0.7, 1], clamp)})`,
          }}
        >
          <svg width={760} height={700} viewBox="0 0 760 700" aria-hidden>
            <circle cx={380} cy={340} r={266} fill={theme.colors.surface} opacity={0.42} />
            <circle cx={380} cy={322} r={228} fill={theme.colors.surface} stroke={theme.colors.textPrimary} strokeWidth={9} />
            <path d="M292 496 C270 558 210 590 166 604 C212 556 218 516 210 478" fill={theme.colors.surface} stroke={theme.colors.textPrimary} strokeWidth={9} strokeLinejoin="round" />
            <circle cx={302} cy={314} r={42} fill={theme.colors.accent} />
            <circle cx={380} cy={314} r={42} fill={theme.colors.accentYellow} />
            <circle cx={458} cy={314} r={42} fill={theme.colors.accentViolet} />
            <circle cx={220} cy={174} r={30} fill={theme.colors.accent} opacity={0.34 * orbitEnter} />
            <circle cx={560} cy={486} r={36} fill={theme.colors.accentYellow} opacity={0.42 * orbitEnter} />
            <circle cx={588} cy={178} r={20} fill={theme.colors.accentViolet} opacity={0.34 * orbitEnter} />
          </svg>
        </div>
        )}
      </EducationStage>

      <ThemeCaption shot={shot} shotDuration={shotDuration} theme={theme} />
    </AbsoluteFill>
  );
};

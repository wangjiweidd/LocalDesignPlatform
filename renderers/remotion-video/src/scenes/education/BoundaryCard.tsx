import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import type {EducationShotData} from '../../data/types-v2';
import type {YaoningTheme} from '../../themes';
import {PersistentHeader} from '../../components/PersistentHeader';
import {ThemeCaption} from '../../components/ThemeCaption';
import {EducationStage} from '../../components/EducationStage';
import {clamp, dramaticSlam, staggerSpring} from '../../utils/springs';

export const BoundaryCard: React.FC<{
  shot: EducationShotData;
  theme: YaoningTheme;
  shotDuration: number;
  videoTitle?: string;
  videoKeyword?: string;
}> = ({shot, theme, shotDuration, videoTitle, videoKeyword}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const shieldEnter = dramaticSlam(frame, fps);
  const lockEnter = staggerSpring(frame, fps, 1);
  const pulse = interpolate(Math.sin((frame / fps) * Math.PI * 3), [-1, 1], [0.74, 1], clamp);

  return (
    <AbsoluteFill style={{background: theme.colors.bg}}>
      <PersistentHeader theme={theme} title={videoTitle} keyword={videoKeyword} />

      <EducationStage width={820} height={820}>
        <div
          style={{
            opacity: shieldEnter,
            transform: `scale(${interpolate(shieldEnter, [0, 1], [0.64, 1], clamp)})`,
          }}
        >
          <svg width={700} height={700} viewBox="0 0 700 700" aria-hidden>
            <circle cx={350} cy={338} r={268} fill={theme.colors.surface} opacity={0.58} />
            <path
              d="M350 82 552 158v154c0 126-82 220-202 276-120-56-202-150-202-276V158Z"
              fill={theme.colors.surface}
              stroke={theme.colors.textPrimary}
              strokeWidth={12}
              strokeLinejoin="round"
            />
            <path
              d="M350 136 486 188v112c0 84-50 151-136 194-86-43-136-110-136-194V188Z"
              fill={theme.colors.safetyAccent}
              opacity={0.96}
            />
            <path
              d="m276 324 58 58 112-146"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth={36}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {[202, 350, 498].map((cx, i) => (
              <g key={cx} opacity={lockEnter * (i === 1 ? pulse : 0.88)} transform={`translate(${cx} 604)`}>
                <rect x={-44} y={-18} width={88} height={66} rx={16} fill={theme.colors.textPrimary} />
                <path d="M-23 -14v-18c0-30 46-30 46 0v18" fill="none" stroke={theme.colors.textPrimary} strokeWidth={14} strokeLinecap="round" />
                <circle cx={0} cy={18} r={8} fill={theme.colors.accentYellow} />
              </g>
            ))}
          </svg>
        </div>
      </EducationStage>

      <ThemeCaption shot={shot} shotDuration={shotDuration} theme={theme} />
    </AbsoluteFill>
  );
};

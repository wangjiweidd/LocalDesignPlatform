import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import type {EducationShotData} from '../../data/types-v2';
import type {YaoningTheme} from '../../themes';
import {PersistentHeader} from '../../components/PersistentHeader';
import {ThemeCaption} from '../../components/ThemeCaption';
import {EducationStage} from '../../components/EducationStage';
import {clamp, smoothReveal, staggerSpring} from '../../utils/springs';

export const DemoWalk: React.FC<{
  shot: EducationShotData;
  theme: YaoningTheme;
  shotDuration: number;
  videoTitle?: string;
  videoKeyword?: string;
}> = ({shot, theme, shotDuration, videoTitle, videoKeyword}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const screenEnter = smoothReveal(frame, fps);
  const robotEnter = staggerSpring(frame, fps, 1);
  const pulse = interpolate(Math.sin((frame / fps) * Math.PI * 2), [-1, 1], [0.78, 1], clamp);

  return (
    <AbsoluteFill style={{background: theme.colors.bg}}>
      <PersistentHeader theme={theme} title={videoTitle} keyword={videoKeyword} />

      <EducationStage width={920} height={820}>
        <div style={{position: 'relative', width: 920, height: 700}}>
          <div
            style={{
              position: 'absolute',
              left: 268,
              top: 76,
              opacity: screenEnter,
              transform: `scale(${interpolate(screenEnter, [0, 1], [0.9, 1], clamp)})`,
              transformOrigin: 'center',
            }}
          >
            <div
              style={{
                width: 590,
                height: 470,
                borderRadius: 34,
                background: '#171729',
                border: `4px solid ${theme.colors.textPrimary}`,
                overflow: 'hidden',
                boxShadow: '0 22px 48px rgba(28, 25, 23, 0.16)',
              }}
            >
              <div style={{height: 56, background: '#10101f', display: 'flex', alignItems: 'center', gap: 10, padding: '0 26px'}}>
                {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
                  <div key={c} style={{width: 16, height: 16, borderRadius: 999, background: c}} />
                ))}
              </div>
              <div style={{padding: 36, display: 'flex', flexDirection: 'column', gap: 24}}>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{display: 'flex', alignItems: 'center', gap: 18}}>
                    <div style={{width: 24, height: 24, borderRadius: 999, background: i === 1 ? theme.colors.accent : theme.colors.accentGreen, opacity: i === 1 ? pulse : 0.7}} />
                    <div style={{height: 24, width: [330, 410, 270][i], borderRadius: 999, background: '#F8FAFC', opacity: i === 1 ? 0.95 : 0.58}} />
                  </div>
                ))}
                <div style={{marginTop: 26, height: 122, borderRadius: 24, border: `3px solid ${theme.colors.accent}`, background: 'rgba(249,115,22,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <div style={{width: 92, height: 92, borderRadius: 999, background: theme.colors.accent, opacity: pulse}} />
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              position: 'absolute',
              left: 52,
              top: 356,
              opacity: robotEnter,
              transform: `scale(${interpolate(robotEnter, [0, 1], [0.78, 1], clamp)})`,
              transformOrigin: 'center bottom',
            }}
          >
            <svg width={210} height={300} viewBox="0 0 210 300" aria-hidden>
              <circle cx={105} cy={148} r={78} fill={theme.colors.surface} stroke={theme.colors.textPrimary} strokeWidth={6} />
              <rect x={46} y={76} width={118} height={62} rx={31} fill="#111827" stroke={theme.colors.textPrimary} strokeWidth={5} />
              <rect x={78} y={94} width={18} height={34} rx={9} fill="#22D3EE" />
              <rect x={116} y={94} width={18} height={34} rx={9} fill="#22D3EE" />
              <path d="M78 150c16 17 38 17 54 0" fill="none" stroke="#22D3EE" strokeWidth={6} strokeLinecap="round" />
              <path d="M64 222h82c-7 38-22 58-41 58s-34-20-41-58Z" fill={theme.colors.surface} stroke={theme.colors.textPrimary} strokeWidth={6} />
              <circle cx={105} cy={60} r={18} fill={theme.colors.accentYellow} stroke={theme.colors.textPrimary} strokeWidth={5} />
              <line x1={105} y1={78} x2={105} y2={54} stroke={theme.colors.textPrimary} strokeWidth={5} strokeLinecap="round" />
              <circle cx={44} cy={156} r={18} fill={theme.colors.accentYellow} stroke={theme.colors.textPrimary} strokeWidth={5} />
              <circle cx={166} cy={156} r={18} fill={theme.colors.accentYellow} stroke={theme.colors.textPrimary} strokeWidth={5} />
              <path d="M54 240c-28 18-28 46 0 46" fill="none" stroke={theme.colors.textPrimary} strokeWidth={6} strokeLinecap="round" />
              <path d="M156 240c28 18 28 46 0 46" fill="none" stroke={theme.colors.textPrimary} strokeWidth={6} strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </EducationStage>

      <ThemeCaption shot={shot} shotDuration={shotDuration} theme={theme} />
    </AbsoluteFill>
  );
};

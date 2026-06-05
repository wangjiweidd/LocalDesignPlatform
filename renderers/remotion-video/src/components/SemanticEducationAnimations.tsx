import {interpolate} from 'remotion';
import type {YaoningTheme} from '../themes';
import {clamp} from '../utils/springs';
import {mapProgress, segmentProgress, staggeredSegmentProgress} from '../utils/timeline';

type Props = {
  theme: YaoningTheme;
  frame: number;
  fps: number;
};

export const TimeWindowAnimation: React.FC<Props> = ({theme, frame, fps}) => {
  void fps;
  const enter = segmentProgress(frame, {start: 2, duration: 22});
  const windowOpen = segmentProgress(frame, {start: 12, duration: 24});
  const runnerTravel = segmentProgress(frame, {start: 18, duration: 58, ease: 'linear'});
  const runner = mapProgress(runnerTravel, [0, 1], [118, 610]);
  const dash = mapProgress(segmentProgress(frame, {start: 18, duration: 60, ease: 'linear'}), [0, 1], [620, 0]);

  return (
    <svg
      width={860}
      height={700}
      viewBox="0 0 860 700"
      aria-hidden
      style={{opacity: enter, transform: `scale(${interpolate(enter, [0, 1], [0.86, 1], clamp)})`}}
    >
      <circle cx={430} cy={350} r={282} fill={theme.colors.surface} opacity={0.42} />
      <circle cx={430} cy={350} r={218} fill="#FFFFFF" opacity={0.28} />

      <path
        d="M132 394 C264 270 596 270 728 394"
        fill="none"
        stroke={theme.colors.surface}
        strokeWidth={54}
        strokeLinecap="round"
        opacity={0.72}
      />
      <path
        d="M132 394 C264 270 596 270 728 394"
        fill="none"
        stroke={theme.colors.border}
        strokeWidth={22}
        strokeLinecap="round"
      />
      <path
        d="M132 394 C264 270 596 270 728 394"
        fill="none"
        stroke={theme.colors.accent}
        strokeWidth={22}
        strokeLinecap="round"
        strokeDasharray="620"
        strokeDashoffset={dash}
        opacity={0.68}
      />

      <g transform={`translate(0 ${interpolate(windowOpen, [0, 1], [22, 0], clamp)})`}>
        <rect
          x={298}
          y={178}
          width={264}
          height={222}
          rx={28}
          fill="#FFFFFF"
          stroke={theme.colors.textPrimary}
          strokeWidth={9}
        />
        <path d="M430 178 V400" stroke={theme.colors.textPrimary} strokeWidth={7} opacity={0.6} />
        <path
          d={`M430 190 L${interpolate(windowOpen, [0, 1], [430, 318], clamp)} 214 V364 L430 388 Z`}
          fill={theme.colors.accent}
          opacity={0.18}
        />
        <path
          d={`M430 190 L${interpolate(windowOpen, [0, 1], [430, 542], clamp)} 214 V364 L430 388 Z`}
          fill={theme.colors.accent}
          opacity={0.18}
        />
        <rect x={334} y={218} width={192} height={124} rx={18} fill={theme.colors.accent} opacity={0.18} />
      </g>

      {[132, 430, 728].map((cx, index) => {
        const pulse = staggeredSegmentProgress(frame, {start: 24, duration: 16}, index, 7);
        return (
          <g key={cx}>
            <circle cx={cx} cy={394} r={interpolate(pulse, [0, 1], [34, 48], clamp)} fill={theme.colors.surface} />
            <circle cx={cx} cy={394} r={24} fill={index === 1 ? theme.colors.accent : theme.colors.textPrimary} />
          </g>
        );
      })}

      <g transform={`translate(${runner} 394)`}>
        <circle r={46} fill="#FFFFFF" stroke={theme.colors.textPrimary} strokeWidth={8} />
        <circle r={18} fill={theme.colors.accent} />
      </g>
      <circle cx={248} cy={196} r={28} fill={theme.colors.accentYellow} opacity={0.55} />
      <circle cx={634} cy={252} r={22} fill={theme.colors.accentViolet} opacity={0.38} />
    </svg>
  );
};

export const ParentCompanionAnimation: React.FC<Props> = ({theme, frame, fps}) => {
  void fps;
  const enter = segmentProgress(frame, {start: 2, duration: 22});
  const travel = segmentProgress(frame, {start: 16, duration: 58, ease: 'power2.inOut'});
  const x = interpolate(travel, [0, 1], [152, 690], clamp);
  const y = interpolate(travel, [0, 0.5, 1], [360, 276, 360], clamp);

  return (
    <svg
      width={900}
      height={660}
      viewBox="0 0 900 660"
      aria-hidden
      style={{opacity: enter, transform: `translateY(${(1 - enter) * 24}px)`}}
    >
      <circle cx={450} cy={330} r={270} fill={theme.colors.surface} opacity={0.4} />
      <path
        d="M128 408 C260 246 640 246 772 408"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth={68}
        strokeLinecap="round"
        opacity={0.42}
      />
      <path
        d="M128 408 C260 246 640 246 772 408"
        fill="none"
        stroke={theme.colors.border}
        strokeWidth={24}
        strokeLinecap="round"
      />
      <path
        d="M128 408 C260 246 640 246 772 408"
        fill="none"
        stroke={theme.colors.accent}
        strokeWidth={24}
        strokeLinecap="round"
        strokeDasharray="690"
        strokeDashoffset={interpolate(travel, [0, 1], [690, 0], clamp)}
      />

      {[128, 322, 578, 772].map((cx, index) => {
        const active = travel >= index / 3;
        return (
          <g key={cx}>
            <circle
              cx={cx}
              cy={index === 0 || index === 3 ? 408 : 300}
              r={active ? 36 : 25}
              fill={active ? '#FFFFFF' : theme.colors.surface}
              stroke={theme.colors.textPrimary}
              strokeWidth={active ? 7 : 4}
              opacity={active ? 1 : 0.48}
            />
            <circle cx={cx} cy={index === 0 || index === 3 ? 408 : 300} r={active ? 12 : 8} fill={active ? theme.colors.accent : theme.colors.border} />
          </g>
        );
      })}

      <g transform={`translate(${x} ${y})`}>
        <circle r={88} fill={theme.colors.accent} opacity={0.13} />
        <circle r={58} fill="#FFFFFF" stroke={theme.colors.textPrimary} strokeWidth={8} />
        <circle cx={-12} cy={-10} r={12} fill={theme.colors.textPrimary} />
        <circle cx={18} cy={-10} r={12} fill={theme.colors.textPrimary} />
        <path d="M-22 20 C-8 36 18 36 32 20" fill="none" stroke={theme.colors.accent} strokeWidth={8} strokeLinecap="round" />
        <circle cx={-76} cy={58} r={34} fill="#FFFFFF" stroke={theme.colors.textPrimary} strokeWidth={7} />
        <circle cx={-84} cy={52} r={7} fill={theme.colors.textPrimary} />
        <circle cx={-68} cy={52} r={7} fill={theme.colors.textPrimary} />
      </g>

      <circle cx={212} cy={176} r={24} fill={theme.colors.accentYellow} opacity={0.52} />
      <circle cx={708} cy={214} r={26} fill={theme.colors.accentViolet} opacity={0.34} />
    </svg>
  );
};

export const ExtraEffortAnimation: React.FC<Props> = ({theme, frame, fps}) => {
  void fps;
  const enter = segmentProgress(frame, {start: 2, duration: 24});
  const climb = segmentProgress(frame, {start: 18, duration: 62, ease: 'power2.inOut'});
  const x = interpolate(climb, [0, 1], [212, 586], clamp);
  const y = interpolate(climb, [0, 1], [448, 250], clamp);
  const strain = Math.sin(frame * 0.34) * interpolate(climb, [0, 1], [0, 8], clamp);

  return (
    <svg
      width={860}
      height={700}
      viewBox="0 0 860 700"
      aria-hidden
      style={{opacity: enter, transform: `scale(${interpolate(enter, [0, 1], [0.86, 1], clamp)})`}}
    >
      <circle cx={430} cy={350} r={280} fill={theme.colors.surface} opacity={0.42} />
      <path d="M142 500 L684 214" fill="none" stroke="#FFFFFF" strokeWidth={88} strokeLinecap="round" opacity={0.38} />
      <path d="M142 500 L684 214" fill="none" stroke={theme.colors.textPrimary} strokeWidth={12} strokeLinecap="round" />
      <path
        d="M142 500 L684 214"
        fill="none"
        stroke={theme.colors.accent}
        strokeWidth={18}
        strokeLinecap="round"
        strokeDasharray="610"
        strokeDashoffset={interpolate(climb, [0, 1], [610, 128], clamp)}
        opacity={0.78}
      />

      {[0, 1, 2].map((index) => {
        const block = staggeredSegmentProgress(frame, {start: 20, duration: 18}, index, 8);
        return (
          <rect
            key={index}
            x={520 + index * 38}
            y={402 - index * 58 + interpolate(block, [0, 1], [34, 0], clamp)}
            width={96}
            height={46}
            rx={12}
            fill={index === 2 ? theme.colors.accent : '#FFFFFF'}
            stroke={theme.colors.textPrimary}
            strokeWidth={7}
            opacity={block}
            transform={`rotate(-28 ${568 + index * 38} ${425 - index * 58})`}
          />
        );
      })}

      <g transform={`translate(${x} ${y + strain}) rotate(-28)`}>
        <rect x={-60} y={-42} width={128} height={84} rx={22} fill="#FFFFFF" stroke={theme.colors.textPrimary} strokeWidth={8} />
        <circle cx={-22} cy={-8} r={10} fill={theme.colors.textPrimary} />
        <circle cx={26} cy={-8} r={10} fill={theme.colors.textPrimary} />
        <path d="M-30 22 C-10 10 12 10 32 22" fill="none" stroke={theme.colors.accent} strokeWidth={7} strokeLinecap="round" />
        <rect x={-24} y={-90} width={64} height={44} rx={10} fill={theme.colors.accent} stroke={theme.colors.textPrimary} strokeWidth={7} />
      </g>

      {[0, 1, 2, 3].map((index) => {
        const bar = staggeredSegmentProgress(frame, {start: 20, duration: 18}, index, 5);
        return (
          <rect
            key={index}
            x={178 + index * 34}
            y={210 - index * 18}
            width={18}
            height={interpolate(bar, [0, 1], [24, 86 + index * 18], clamp)}
            rx={9}
            fill={index < 2 ? theme.colors.accentYellow : theme.colors.accent}
            opacity={0.62}
          />
        );
      })}
    </svg>
  );
};

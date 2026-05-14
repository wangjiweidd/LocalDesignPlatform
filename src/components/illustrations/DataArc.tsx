import {interpolate} from 'remotion';

interface DataArcProps {
  progress:    number;  // 0-1
  size:        number;
  color:       string;
  trackColor?: string;
  strokeWidth?: number;
}

// Draws a 270° arc (starts bottom-left, ends bottom-right) filled up to `progress`
export const DataArc: React.FC<DataArcProps> = ({
  progress,
  size,
  color,
  trackColor  = 'rgba(255,255,255,0.08)',
  strokeWidth = 16,
}) => {
  const cx = size / 2;
  const cy = size / 2;
  const r  = size / 2 - strokeWidth;
  const c  = 2 * Math.PI * r;
  const arcFraction = 0.75; // 270°

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{transform: 'rotate(135deg)'}}
    >
      {/* Track */}
      <circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke={trackColor}
        strokeWidth={strokeWidth}
        strokeDasharray={`${c * arcFraction} ${c}`}
        strokeLinecap="round"
      />
      {/* Progress */}
      <circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth + 2}
        strokeDasharray={`${c * arcFraction * Math.max(0, Math.min(1, progress))} ${c}`}
        strokeLinecap="round"
      />
    </svg>
  );
};

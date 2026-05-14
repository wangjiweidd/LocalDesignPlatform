import {interpolate} from 'remotion';

interface TechDotsProps {
  width:      number;
  height:     number;
  color:      string;
  frame:      number;
  cols?:      number;
  rows?:      number;
  dotRadius?: number;
  opacity?:   number;
}

// Animated dot-grid background — dots fade in with a wave effect
export const TechDots: React.FC<TechDotsProps> = ({
  width,
  height,
  color,
  frame,
  cols      = 9,
  rows      = 14,
  dotRadius = 4,
  opacity   = 0.25,
}) => {
  const colGap = width  / (cols + 1);
  const rowGap = height / (rows + 1);

  const dots: React.ReactElement[] = [];
  for (let r = 1; r <= rows; r++) {
    for (let c = 1; c <= cols; c++) {
      const x       = c * colGap;
      const y       = r * rowGap;
      const delay   = (r + c) * 2;
      const dotOpacity = interpolate(frame - delay, [0, 12], [0, opacity], {
        extrapolateLeft:  'clamp',
        extrapolateRight: 'clamp',
      });
      // Subtle pulse
      const pulse = 0.7 + 0.3 * Math.sin((frame / 30) * Math.PI + (r + c) * 0.4);
      dots.push(
        <circle key={`${r}-${c}`} cx={x} cy={y} r={dotRadius} fill={color}
          opacity={dotOpacity * pulse} />,
      );
    }
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}
    >
      {dots}
    </svg>
  );
};

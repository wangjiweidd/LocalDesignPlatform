import type {CSSProperties} from 'react';
import {colors} from '../styles';

export const BrandBadge: React.FC<{style?: CSSProperties; compact?: boolean}> = ({style, compact = false}) => {
  const fontSize = compact ? 24 : 26;
  const crownWidth = compact ? 34 : 38;
  const crownHeight = compact ? 26 : 30;

  return (
    <div
      style={{
        position: 'absolute',
        left: 70,
        top: 64,
        display: 'flex',
        alignItems: 'center',
        gap: compact ? 10 : 12,
        padding: compact ? '10px 18px' : '11px 20px',
        background: '#fffaf2',
        border: `1.8px solid ${colors.border}`,
        borderRadius: 999,
        boxShadow: '0 8px 24px rgba(176, 110, 38, 0.16)',
        fontSize,
        fontWeight: 800,
        color: colors.textSoft,
        ...style,
      }}
    >
      <svg width={crownWidth} height={crownHeight} viewBox="0 0 42 32" aria-hidden="true">
        <path
          d="M4 10 L13 20 L21 5 L29 20 L38 10 L34 28 H8 Z"
          fill={colors.gold}
          stroke={colors.coffee}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      </svg>
      <span>带曜宁玩 AI</span>
    </div>
  );
};

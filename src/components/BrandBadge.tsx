import type {CSSProperties} from 'react';
import {colors} from '../styles';

export const BrandBadge: React.FC<{style?: CSSProperties}> = ({style}) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: 70,
        top: 64,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 22px',
        background: '#fffaf2',
        border: `2px solid ${colors.border}`,
        borderRadius: 999,
        boxShadow: '0 8px 24px rgba(176, 110, 38, 0.16)',
        fontSize: 28,
        fontWeight: 800,
        color: colors.textSoft,
        ...style,
      }}
    >
      <svg width="42" height="32" viewBox="0 0 42 32" aria-hidden="true">
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

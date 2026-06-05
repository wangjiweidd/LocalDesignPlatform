import type {CSSProperties} from 'react';

export const colors = {
  bgTop: '#FFF6E2',
  bgBottom: '#FFE9C4',
  ink: '#1F1408',
  textSoft: '#5F3B13',
  orange: '#E07A14',
  gold: '#FFB52E',
  purple: '#6F62A8',
  cream: '#FFF9EC',
  border: '#F1C47E',
  coffee: '#B25C0C',
  cyan: '#54D7E5',
  green: '#96C76A',
};

export const stage: CSSProperties = {
  width: 1080,
  height: 1920,
  background: `linear-gradient(180deg, ${colors.bgTop} 0%, ${colors.bgBottom} 100%)`,
  color: colors.ink,
  fontFamily: '"PingFang SC", "Microsoft YaHei", Arial, sans-serif',
  overflow: 'hidden',
};

export const coverStage: CSSProperties = {
  ...stage,
  height: 1440,
};

export const shadow = '0 16px 42px rgba(176, 110, 38, 0.2)';

export const cardBase: CSSProperties = {
  background: colors.cream,
  border: `3px solid ${colors.ink}`,
  borderRadius: 28,
  boxShadow: shadow,
};

export const absoluteCenter: CSSProperties = {
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
};

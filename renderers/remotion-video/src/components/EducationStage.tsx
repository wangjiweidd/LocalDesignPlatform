import type {FC, ReactNode} from 'react';
import {ZONES} from '../design-tokens';

export const EducationStage: FC<{
  children: ReactNode;
  width?: number;
  height?: number;
  top?: number;
}> = ({children, width = 880, height = 820, top = ZONES.contentTop}) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top,
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          width,
          height,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {children}
      </div>
    </div>
  );
};

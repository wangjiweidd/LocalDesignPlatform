import type {CSSProperties} from 'react';
import {Img, staticFile} from 'remotion';

interface PngAssetProps {
  name: string;
  width: number;
  height: number;
  style?: CSSProperties;
  shadow?: boolean;
}

export const PngAsset: React.FC<PngAssetProps> = ({name, width, height, style, shadow = true}) => (
  <Img
    src={staticFile(`assets/generated/${name}`)}
    style={{
      width,
      height,
      objectFit: 'contain',
      filter: shadow ? 'drop-shadow(0 16px 24px rgba(176, 110, 38, 0.18))' : undefined,
      ...style,
    }}
  />
);

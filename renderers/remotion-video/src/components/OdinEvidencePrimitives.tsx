import type {CSSProperties, ReactNode} from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp} from '../utils/springs';
import type {KnowledgeShotData} from '../data/types-v2';
import type {OdinTheme} from '../themes';

export const odinEvidenceColors = {
  paper: '#F1FFD9',
  paperDeep: '#E3F8BF',
  ink: '#101316',
  muted: '#4B5563',
  tagBg: '#06110C',
  tagText: '#96F2BF',
  red: '#D71920',
  yellow: '#F6E27A',
  greenMark: '#9AF2B6',
  blueMark: '#B7F0F5',
  border: '#8B7D6B',
};

const useOdinScale = () => {
  const {width, height} = useVideoConfig();
  const sx = width / 1440;
  const sy = height / 1920;
  const s = Math.min(sx, sy);
  return {sx, sy, s};
};

export const OdinTeachingBackground: React.FC<{children: ReactNode}> = ({children}) => (
  <div
    style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      background:
        'radial-gradient(circle at 20% 10%, rgba(255,255,255,0.92), rgba(255,255,255,0) 32%), linear-gradient(180deg, #F1FFD9 0%, #FAFFF0 72%, #FFFFFF 100%)',
    }}
  >
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.18,
        backgroundImage:
          'linear-gradient(rgba(16,19,22,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(16,19,22,0.035) 1px, transparent 1px)',
        backgroundSize: '42px 42px',
      }}
    />
    {children}
  </div>
);

export const OdinBottomCaption: React.FC<{shot: KnowledgeShotData}> = ({shot}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {sx, sy} = useOdinScale();
  const enter = spring({frame: frame - 8, fps, config: {damping: 24, stiffness: 180}});
  const y = interpolate(enter, [0, 1], [18 * sy, 0], clamp);
  const opacity = interpolate(enter, [0, 1], [0, 1], clamp);
  const keyword = shot.captionKeyword;
  const idx = keyword ? shot.caption.indexOf(keyword) : -1;
  const before = idx >= 0 ? shot.caption.slice(0, idx) : shot.caption;
  const after = idx >= 0 ? shot.caption.slice(idx + keyword.length) : '';

  return (
    <div
      style={{
        position: 'absolute',
        left: 100 * sx,
        right: 100 * sx,
        bottom: 84 * sy,
        opacity,
        transform: `translateY(${y}px)`,
        textAlign: 'center',
        color: odinEvidenceColors.ink,
        fontSize: 76 * sx,
        fontWeight: 900,
        lineHeight: 1.18,
        fontFamily: '"Noto Serif SC", "Noto Sans SC", serif',
        textShadow: '0 3px 0 rgba(255,255,255,0.72)',
      }}
    >
      {idx >= 0 ? (
        <>
          {before}
          <span style={{color: '#E85D04'}}>{keyword}</span>
          {after}
        </>
      ) : (
        shot.caption
      )}
    </div>
  );
};

export const EvidenceTitle: React.FC<{
  title: string;
  keyword?: string;
  top?: number;
  centered?: boolean;
}> = ({title, keyword, top = 130, centered = true}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {sx, sy} = useOdinScale();
  const enter = spring({frame, fps, config: {damping: 18, stiffness: 140}});
  const opacity = interpolate(enter, [0, 1], [0.9, 1], clamp);
  const y = interpolate(enter, [0, 1], [10 * sy, 0], clamp);
  const idx = keyword ? title.indexOf(keyword) : -1;
  const before = idx >= 0 ? title.slice(0, idx) : title;
  const after = idx >= 0 && keyword ? title.slice(idx + keyword.length) : '';

  return (
    <div
      style={{
        position: 'absolute',
        left: 96 * sx,
        right: 96 * sx,
        top: top * sy,
        opacity,
        transform: `translateY(${y}px)`,
        textAlign: centered ? 'center' : 'left',
        fontFamily: '"Noto Serif SC", "Noto Sans SC", serif',
        fontWeight: 900,
        color: odinEvidenceColors.ink,
      }}
    >
      <div
        style={{
          display: 'inline-block',
          fontSize: 116 * sx,
          lineHeight: 1.02,
          padding: `${4 * sy}px ${24 * sx}px ${12 * sy}px`,
          color: '#FFE28A',
          WebkitTextStroke: `${5 * sx}px #111827`,
          paintOrder: 'stroke fill',
          textShadow: `${6 * sx}px ${8 * sy}px 0 rgba(103, 69, 24, 0.18), ${-5 * sx}px ${5 * sy}px 0 #FFFFFF`,
          background:
            idx >= 0 ? 'linear-gradient(transparent 62%, rgba(246,226,122,0.84) 62%)' : 'transparent',
        }}
      >
        {idx >= 0 ? (
          <>
            {before}
            <span>{keyword}</span>
            {after}
          </>
        ) : (
          title
        )}
      </div>
    </div>
  );
};

export const TagStack: React.FC<{
  items: string[];
  style?: CSSProperties;
  accent?: string;
}> = ({items, style, accent = odinEvidenceColors.tagText}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {sx, sy} = useOdinScale();

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 22 * sy, ...style}}>
      {items.map((item, index) => {
        const enter = spring({frame: frame - 8 - index * 5, fps, config: {damping: 18, stiffness: 190}});
        const x = interpolate(enter, [0, 1], [-34, 0], clamp);
        const opacity = interpolate(enter, [0, 1], [0, 1], clamp);
        return (
          <div
            key={item}
            style={{
              alignSelf: 'flex-start',
              background: odinEvidenceColors.tagBg,
              color: accent,
              borderRadius: 12 * sx,
              padding: `${18 * sy}px ${34 * sx}px ${22 * sy}px`,
              fontSize: 54 * sx,
              fontWeight: 900,
              lineHeight: 1,
              fontFamily: '"Noto Serif SC", "Noto Sans SC", serif',
              boxShadow: '0 8px 18px rgba(0,0,0,0.16)',
              opacity,
              transform: `translateX(${x}px)`,
            }}
          >
            {item}
          </div>
        );
      })}
    </div>
  );
};

export const DocumentCard: React.FC<{
  title: string;
  subtitle?: string;
  lines: string[];
  highlights?: string[];
  style?: CSSProperties;
  scale?: number;
}> = ({title, subtitle, lines, highlights = [], style, scale = 1}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {sx, sy} = useOdinScale();
  const enter = spring({frame: frame - 5, fps, config: {damping: 22, stiffness: 150}});
  const opacity = interpolate(enter, [0, 1], [0.92, 1], clamp);
  const y = interpolate(enter, [0, 1], [14 * sy, 0], clamp);

  return (
    <div
      style={{
        background: '#FFFDF7',
        border: `${5 * sx}px solid ${odinEvidenceColors.border}`,
        borderRadius: 18 * sx,
        boxShadow: '0 24px 44px rgba(69, 52, 32, 0.18)',
        padding: 52 * sx,
        color: odinEvidenceColors.ink,
        fontFamily: '"Noto Sans SC", sans-serif',
        opacity,
        transform: `translateY(${y}px) scale(${scale})`,
        ...style,
      }}
    >
      <div style={{fontSize: 68 * sx, fontWeight: 900, lineHeight: 1.16, marginBottom: 24 * sy}}>
        {title}
      </div>
      {subtitle && (
        <div style={{fontSize: 34 * sx, color: odinEvidenceColors.muted, marginBottom: 28 * sy, fontWeight: 700}}>
          {subtitle}
        </div>
      )}
      <div style={{display: 'flex', flexDirection: 'column', gap: 26 * sy}}>
        {lines.map((line, index) => {
          const highlighted = highlights.some((item) => line.includes(item));
          return (
            <div
              key={`${line}-${index}`}
              style={{
                fontSize: 44 * sx,
                lineHeight: 1.52,
                fontWeight: 600,
                color: '#1F2937',
              }}
            >
              <span
                style={{
                  background: highlighted
                    ? index % 2 === 0
                      ? odinEvidenceColors.blueMark
                      : odinEvidenceColors.greenMark
                    : 'transparent',
                  borderRadius: 8 * sx,
                  padding: highlighted ? `${2 * sy}px ${8 * sx}px ${4 * sy}px` : 0,
                }}
              >
                {line}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const OdinVideoPanel: React.FC<{
  title: string;
  lines: string[];
  highlights?: string[];
  style?: CSSProperties;
}> = ({title, lines, highlights = [], style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {sx, sy} = useOdinScale();
  const enter = spring({frame: frame - 5, fps, config: {damping: 20, stiffness: 150}});
  const y = interpolate(enter, [0, 1], [20 * sy, 0], clamp);

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 430 * sy,
        height: 900 * sy,
        overflow: 'hidden',
        background: 'linear-gradient(110deg, #CFD8D1 0%, #80909A 56%, #46535C 100%)',
        transform: `translateY(${y}px)`,
        boxShadow: `0 ${18 * sy}px ${34 * sx}px rgba(49, 63, 55, 0.18)`,
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 52 * sx,
          top: 94 * sy,
          display: 'flex',
          flexDirection: 'column',
          gap: 54 * sy,
        }}
      >
        {lines.slice(0, 2).map((line, index) => {
          const highlighted = highlights.some((item) => line.includes(item));
          return (
            <div
              key={`${line}-${index}`}
              style={{
                width: index === 0 ? 650 * sx : 760 * sx,
                borderRadius: 64 * sx,
                background: '#F3EF69',
                color: odinEvidenceColors.ink,
                padding: `${30 * sy}px ${52 * sx}px ${36 * sy}px`,
                fontFamily: '"Noto Serif SC", "Noto Sans SC", serif',
                fontSize: 62 * sx,
                fontWeight: 900,
                lineHeight: 1.04,
                boxShadow: `0 ${10 * sy}px ${18 * sx}px rgba(0,0,0,0.12)`,
                textDecoration: highlighted ? 'underline' : 'none',
                textDecorationThickness: 4 * sx,
                textUnderlineOffset: 10 * sy,
              }}
            >
              {line}
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: 'absolute',
          right: 120 * sx,
          bottom: 0,
          width: 420 * sx,
          height: 720 * sy,
          borderRadius: `${210 * sx}px ${210 * sx}px 0 0`,
          background: 'linear-gradient(180deg, #D8E2DF 0%, #B8C8C5 44%, #E8EFEA 45%, #D2DDD7 100%)',
          boxShadow: `inset ${-22 * sx}px 0 ${38 * sx}px rgba(22, 32, 39, 0.18)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: 220 * sx,
          top: 168 * sy,
          width: 190 * sx,
          height: 210 * sx,
          borderRadius: '50%',
          background: '#20252B',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 60 * sx,
          bottom: 60 * sy,
          color: 'rgba(255,255,255,0.78)',
          fontSize: 30 * sx,
          fontWeight: 800,
          fontFamily: '"Noto Sans SC", sans-serif',
        }}
      >
        {title}
      </div>
    </div>
  );
};

export const OdinDarkTextStack: React.FC<{
  blocks: string[];
  style?: CSSProperties;
}> = ({blocks, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {sx, sy} = useOdinScale();

  return (
    <div
      style={{
        position: 'absolute',
        left: 100 * sx,
        right: 100 * sx,
        top: 74 * sy,
        display: 'flex',
        flexDirection: 'column',
        gap: 46 * sy,
        ...style,
      }}
    >
      {blocks.map((block, index) => {
        const enter = spring({frame: frame - index * 7, fps, config: {damping: 20, stiffness: 160}});
        const y = interpolate(enter, [0, 1], [18 * sy, 0], clamp);
        return (
          <div
            key={`${block}-${index}`}
            style={{
              borderRadius: 24 * sx,
              background: 'rgba(22, 26, 23, 0.78)',
              color: '#E5E7DF',
              padding: `${30 * sy}px ${38 * sx}px ${36 * sy}px`,
              fontFamily: '"Noto Serif SC", "Noto Sans SC", serif',
              fontSize: 54 * sx,
              fontWeight: 800,
              lineHeight: 1.34,
              letterSpacing: 0,
              transform: `translateY(${y}px)`,
              boxShadow: `0 ${10 * sy}px ${18 * sx}px rgba(0,0,0,0.08)`,
            }}
          >
            {block}
          </div>
        );
      })}
    </div>
  );
};

export const OdinBlackBarStack: React.FC<{
  items: string[];
  style?: CSSProperties;
}> = ({items, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {sx, sy} = useOdinScale();

  return (
    <div
      style={{
        position: 'absolute',
        left: 96 * sx,
        right: 96 * sx,
        top: 640 * sy,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 48 * sy,
        ...style,
      }}
    >
      {items.map((item, index) => {
        const enter = spring({frame: frame - 8 - index * 8, fps, config: {damping: 16, stiffness: 180}});
        return (
          <div
            key={`${item}-${index}`}
            style={{
              width: index === 1 ? '100%' : '86%',
              borderRadius: 26 * sx,
              background: '#050505',
              color: '#F97316',
              padding: `${28 * sy}px ${58 * sx}px ${38 * sy}px`,
              textAlign: 'center',
              fontFamily: '"Noto Serif SC", "Noto Sans SC", serif',
              fontSize: 80 * sx,
              fontWeight: 900,
              lineHeight: 1.08,
              transform: `scale(${interpolate(enter, [0, 1], [0.96, 1], clamp)})`,
              boxShadow: `0 ${12 * sy}px ${22 * sx}px rgba(0,0,0,0.12)`,
            }}
          >
            {item}
          </div>
        );
      })}
    </div>
  );
};

export const OdinStampRow: React.FC<{
  items: string[];
  style?: CSSProperties;
}> = ({items, style}) => {
  const {sx, sy} = useOdinScale();
  const colors = ['#76A7EA', '#F6D34F', '#F15A3B'];
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 1398 * sy,
        display: 'flex',
        justifyContent: 'center',
        gap: 24 * sx,
        ...style,
      }}
    >
      {items.map((item, index) => (
        <div
          key={`${item}-${index}`}
          style={{
            background: colors[index % colors.length],
            color: '#101316',
            padding: `${18 * sy}px ${28 * sx}px ${22 * sy}px`,
            fontFamily: '"Noto Serif SC", "Noto Sans SC", serif',
            fontSize: 58 * sx,
            fontWeight: 900,
            lineHeight: 1,
            transform: `rotate(${[-2, 1.5, -1][index % 3]}deg)`,
            boxShadow: `0 ${5 * sy}px 0 rgba(0,0,0,0.16)`,
          }}
        >
          {item}
        </div>
      ))}
    </div>
  );
};

export const RedCircle: React.FC<{style?: CSSProperties; delay?: number}> = ({style, delay = 22}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [delay, delay + 18], [0, 1], {
    easing: Easing.out(Easing.cubic),
    ...clamp,
  });
  const dash = 520;
  return (
    <svg
      viewBox="0 0 300 160"
      style={{
        position: 'absolute',
        width: 300,
        height: 160,
        overflow: 'visible',
        ...style,
      }}
    >
      <ellipse
        cx="150"
        cy="80"
        rx="130"
        ry="56"
        fill="none"
        stroke={odinEvidenceColors.red}
        strokeWidth="11"
        strokeLinecap="round"
        strokeDasharray={dash}
        strokeDashoffset={dash * (1 - progress)}
        transform="rotate(-7 150 80)"
        opacity={0.9}
      />
    </svg>
  );
};

export const RedArrow: React.FC<{style?: CSSProperties; delay?: number}> = ({style, delay = 26}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [delay, delay + 18], [0, 1], {
    easing: Easing.out(Easing.cubic),
    ...clamp,
  });
  return (
    <div
      style={{
        position: 'absolute',
        width: 140 * progress,
        height: 12,
        background: odinEvidenceColors.red,
        borderRadius: 999,
        transformOrigin: 'left center',
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          right: -2,
          top: -17,
          width: 0,
          height: 0,
          borderTop: '23px solid transparent',
          borderBottom: '23px solid transparent',
          borderLeft: `38px solid ${odinEvidenceColors.red}`,
        }}
      />
    </div>
  );
};

export const ProofButtons: React.FC<{items: string[]; theme: OdinTheme; style?: CSSProperties}> = ({
  items, style,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  return (
    <div style={{display: 'flex', gap: 28, ...style}}>
      {items.map((item, index) => {
        const enter = spring({frame: frame - 12 - index * 6, fps, config: {damping: 16, stiffness: 190}});
        return (
          <div
            key={item}
            style={{
              padding: '22px 42px 26px',
              background: '#020403',
              color: '#FFFFFF',
              borderRadius: 12,
              fontSize: 48,
              fontWeight: 900,
              fontFamily: '"Noto Serif SC", "Noto Sans SC", serif',
              transform: `scale(${interpolate(enter, [0, 1], [0.86, 1], clamp)})`,
              opacity: interpolate(enter, [0, 1], [0, 1], clamp),
              boxShadow: '0 10px 22px rgba(0,0,0,0.18)',
            }}
          >
            {item}
          </div>
        );
      })}
    </div>
  );
};

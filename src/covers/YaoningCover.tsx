import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import type {EducationScriptData} from '../data/types-v2';
import {themeYaoning} from '../themes';
import {bouncyEnter, clamp} from '../utils/springs';
import {splitKeyword} from '../utils/text';

type YaoningCoverProps = {cover: EducationScriptData['cover']; accentColor?: string};

export const YaoningCover: React.FC<YaoningCoverProps> = ({cover, accentColor}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enter  = bouncyEnter(frame, fps);
  const titleY = interpolate(enter, [0, 1], [40, 0], clamp);
  const accent = accentColor ?? themeYaoning.colors.accent;
  const parts  = splitKeyword(cover.title, cover.titleHighlight);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${themeYaoning.colors.bg} 0%, ${themeYaoning.colors.bgDeep} 100%)`,
        overflow: 'hidden',
      }}
    >
      {/* Decorative blob top-left */}
      <div
        style={{
          position:     'absolute',
          left:         -60,
          top:          -60,
          width:        360,
          height:       360,
          borderRadius: 999,
          background:   accent,
          opacity:      0.12,
        }}
      />

      {/* Title card */}
      <div
        style={{
          position:     'absolute',
          left:         72,
          right:        72,
          top:          320,
          padding:      '44px 48px',
          borderRadius: 36,
          background:   themeYaoning.colors.surface,
          border:       `3px solid ${themeYaoning.colors.border}`,
          boxShadow:    '0 20px 48px rgba(249,115,22,0.12)',
          opacity:      enter,
          transform:    `translateY(${titleY}px)`,
        }}
      >
        <div
          style={{
            fontSize:   76,
            fontWeight: 900,
            lineHeight: 1.2,
            color:      themeYaoning.colors.textPrimary,
            fontFamily: themeYaoning.fonts.body,
          }}
        >
          {parts.before}
          <span style={{color: accent}}>{parts.keyword}</span>
          {parts.after}
        </div>

        {/* Subtitle pill */}
        <div
          style={{
            marginTop:    28,
            display:      'inline-block',
            padding:      '10px 28px',
            borderRadius: 999,
            background:   themeYaoning.colors.bgDeep,
            border:       `2px solid ${themeYaoning.colors.border}`,
            fontSize:     36,
            fontWeight:   700,
            color:        themeYaoning.colors.textSecondary,
            fontFamily:   themeYaoning.fonts.body,
          }}
        >
          {cover.subtitle}
        </div>
      </div>
    </AbsoluteFill>
  );
};

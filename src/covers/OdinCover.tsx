import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {KnowledgeScriptData} from '../data/types-v2';
import {themeOdin} from '../themes';
import {clamp} from '../utils/springs';
import {splitKeyword} from '../utils/text';

type OdinCoverProps = {cover: KnowledgeScriptData['cover']; accentColor?: string};

export const OdinCover: React.FC<OdinCoverProps> = ({cover, accentColor}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enter  = spring({frame, fps, config: {damping: 200}});
  const titleY = interpolate(enter, [0, 1], [32, 0], clamp);
  const accent = accentColor ?? themeOdin.colors.accent;
  const parts  = splitKeyword(cover.title, cover.titleHighlight);

  return (
    <AbsoluteFill style={{background: themeOdin.colors.bgDark, overflow: 'hidden'}}>
      {/* Decorative circle */}
      <div
        style={{
          position:     'absolute',
          right:        -80,
          top:          200,
          width:        400,
          height:       400,
          borderRadius: 999,
          border:       `40px solid ${accent}`,
          opacity:      0.12,
        }}
      />

      {/* Accent bar */}
      <div
        style={{
          position:     'absolute',
          left:         88,
          top:          240,
          width:        interpolate(enter, [0, 1], [0, 80], clamp),
          height:       6,
          borderRadius: 999,
          background:   accent,
        }}
      />

      {/* Title */}
      <div
        style={{
          position:   'absolute',
          left:       88,
          right:      88,
          top:        280,
          opacity:    enter,
          transform:  `translateY(${titleY}px)`,
          fontSize:   84,
          fontWeight: 900,
          lineHeight: 1.18,
          color:      themeOdin.colors.textPrimary,
          fontFamily: themeOdin.fonts.body,
        }}
      >
        {parts.before}
        <span style={{color: accent}}>{parts.keyword}</span>
        {parts.after}
      </div>

      {/* Subtitle */}
      <div
        style={{
          position:   'absolute',
          left:       88,
          top:        700,
          opacity:    interpolate(enter, [0.6, 1], [0, 1], clamp),
          fontSize:   44,
          color:      themeOdin.colors.textSecondary,
          fontFamily: themeOdin.fonts.body,
          fontWeight: 600,
        }}
      >
        {cover.subtitle}
      </div>
    </AbsoluteFill>
  );
};

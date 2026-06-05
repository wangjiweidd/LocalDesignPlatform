import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import type {KnowledgeShotData} from '../../data/types-v2';
import type {OdinTheme} from '../../themes';
import {ThemeCaption} from '../../components/ThemeCaption';
import {TechDots} from '../../components/illustrations/TechDots';
import {clamp, smoothReveal} from '../../utils/springs';
import {splitKeyword} from '../../utils/text';

export const ConceptCard: React.FC<{shot: KnowledgeShotData; theme: OdinTheme; shotDuration: number}> = ({
  shot, theme, shotDuration,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const reveal  = smoothReveal(frame, fps);
  const scale   = interpolate(reveal, [0, 1], [0.92, 1], clamp);

  // highlight-sweep: underline draws left to right over 20 frames starting at frame 8
  const sweepWidth = interpolate(frame, [8, 28], [0, 100], {
    easing: (t) => t * (2 - t),
    ...clamp,
  });

  const parts = splitKeyword(shot.text, shot.keyword);

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(160deg, #1E1B4B 0%, #312E81 100%)',
        opacity:    reveal,
        transform:  `scale(${scale})`,
        display:       'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding:       '0 88px',
      }}
    >
      <TechDots width={1080} height={1920} color="#ffffff" frame={frame} cols={8} rows={14} opacity={0.08} />
      {/* Accent bar */}
      <div
        style={{
          width:        interpolate(reveal, [0, 1], [0, 60], clamp),
          height:       6,
          borderRadius: 999,
          background:   theme.colors.accent,
          marginBottom: 36,
        }}
      />

      {/* Concept term with highlight-sweep */}
      <div
        style={{
          fontSize:   84,
          fontWeight: 900,
          color:      '#F1F5F9',
          fontFamily: theme.fonts.body,
          lineHeight: 1.2,
        }}
      >
        {parts.before}
        <span style={{position: 'relative', color: theme.colors.accentAlt, display: 'inline'}}>
          {parts.keyword}
          <span
            style={{
              position:     'absolute',
              left:         0,
              bottom:       -10,
              width:        `${sweepWidth}%`,
              height:       8,
              borderRadius: 999,
              background:   theme.colors.accentAlt,
              opacity:      0.7,
            }}
          />
        </span>
        {parts.after}
      </div>

      <ThemeCaption shot={shot} shotDuration={shotDuration} theme={theme} />
    </AbsoluteFill>
  );
};

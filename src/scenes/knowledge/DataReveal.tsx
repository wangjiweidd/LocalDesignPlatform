import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import type {KnowledgeShotData} from '../../data/types-v2';
import type {OdinTheme} from '../../themes';
import {ThemeCaption} from '../../components/ThemeCaption';
import {clamp, counterTick, dramaticSlam} from '../../utils/springs';
import {parseDataValue, splitKeyword} from '../../utils/text';

export const DataReveal: React.FC<{shot: KnowledgeShotData; theme: OdinTheme; shotDuration: number}> = ({
  shot, theme, shotDuration,
}) => {
  const frame = useCurrentFrame();
  const {fps}  = useVideoConfig();

  const slam      = dramaticSlam(frame, fps);
  const heroScale = interpolate(slam, [0, 1], [0.6, 1], clamp);

  const {number, suffix} = shot.dataValue ? parseDataValue(shot.dataValue) : {number: 0, suffix: ''};
  const displayNum       = counterTick(frame, number);

  const contextEnter = dramaticSlam(Math.max(0, frame - 12), fps);
  const parts        = splitKeyword(shot.text, shot.keyword);

  return (
    <AbsoluteFill style={{background: theme.colors.bgDark}}>
      <div
        style={{
          position:       'absolute',
          inset:          0,
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          flexDirection:  'column',
          transform:      `scale(${heroScale})`,
        }}
      >
        <div
          style={{
            fontSize:   180,
            fontWeight: 900,
            color:      theme.colors.accent,
            fontFamily: theme.fonts.mono,
            lineHeight: 1,
          }}
        >
          {shot.dataValue ? `${displayNum}${suffix}` : shot.keyword}
        </div>

        <div
          style={{
            opacity:    contextEnter,
            transform:  `translateY(${(1 - contextEnter) * 16}px)`,
            fontSize:   52,
            color:      theme.colors.textPrimary,
            fontFamily: theme.fonts.body,
            marginTop:  40,
            textAlign:  'center',
            padding:    '0 88px',
          }}
        >
          {parts.before}
          <span style={{color: theme.colors.accent}}>{parts.keyword}</span>
          {parts.after}
        </div>
      </div>

      <ThemeCaption shot={shot} shotDuration={shotDuration} theme={theme} />
    </AbsoluteFill>
  );
};

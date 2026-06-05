import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import type {KnowledgeShotData} from '../../data/types-v2';
import type {OdinTheme} from '../../themes';
import {ThemeCaption} from '../../components/ThemeCaption';
import {DataArc} from '../../components/illustrations/DataArc';
import {TechDots} from '../../components/illustrations/TechDots';
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

  const arcProgress = interpolate(slam, [0, 1], [0, 1], clamp);

  return (
    <AbsoluteFill style={{background: theme.colors.bgDark}}>
      <TechDots width={1080} height={1920} color="#ffffff" frame={frame} cols={10} rows={16} opacity={0.1} />

      {/* Data arc — centered behind the number */}
      <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) translateY(-60px)'}}>
        <DataArc progress={arcProgress} size={520} color={theme.colors.accent} strokeWidth={18} />
      </div>

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

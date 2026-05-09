import {AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {BrandBadge} from './components/BrandBadge';
import {Caption} from './components/Caption';
import {SceneIllustration} from './components/Illustrations';
import {demoScript} from './data/demo';
import type {ShotData} from './data/types';
import {colors, stage} from './styles';

const clamp = {
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};

export const BranchVideo: React.FC = () => {
  const {shotDurationFrames, shots} = demoScript;

  return (
    <AbsoluteFill style={stage}>
      <BackgroundMarks />
      <BrandBadge />
      {shots.map((shot, index) => (
        <Sequence
          key={`${shot.scene}-${index}`}
          from={index * shotDurationFrames}
          durationInFrames={shotDurationFrames}
          premountFor={30}
        >
          <ShotScene shot={shot} index={index} total={shots.length} shotDuration={shotDurationFrames} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export const BranchCover: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 22], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    ...clamp,
  });
  const [firstLine, secondLine = ''] = demoScript.cover.title.split('\n');
  const secondParts = splitKeyword(secondLine, demoScript.cover.titleHighlight);
  const noteParts = splitKeyword(demoScript.cover.note, demoScript.cover.noteHighlight);

  return (
    <AbsoluteFill style={stage}>
      <BackgroundMarks />
      <BrandBadge />
      <div
        style={{
          position: 'absolute',
          left: 70,
          top: 210,
          right: 70,
          opacity: enter,
          transform: `translateY(${(1 - enter) * 32}px)`,
          fontSize: 96,
          lineHeight: 1.12,
          fontWeight: 900,
          letterSpacing: 0,
        }}
      >
        <div>{firstLine}</div>
        <div>
          {secondParts.before}
          <span style={{color: colors.orange}}>{secondParts.keyword}</span>
          {secondParts.after}
        </div>
      </div>
      <div style={{position: 'absolute', left: 90, right: 90, top: 560, height: 760}}>
        <DoudouHero />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 70,
          right: 70,
          bottom: 120,
          padding: '30px 34px',
          borderRadius: 30,
          background: '#FFF7D8',
          border: `3px solid ${colors.border}`,
          boxShadow: '0 14px 34px rgba(176, 110, 38, 0.18)',
          fontSize: 38,
          lineHeight: 1.35,
          fontWeight: 800,
          color: colors.textSoft,
        }}
      >
        <span style={{marginRight: 16}}>灯泡</span>
        {noteParts.before}
        <span style={{color: colors.orange}}>{noteParts.keyword}</span>
        {noteParts.after}
      </div>
    </AbsoluteFill>
  );
};

const ShotScene: React.FC<{shot: ShotData; index: number; total: number; shotDuration: number}> = ({
  shot,
  index,
  total,
  shotDuration,
}) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 18], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    ...clamp,
  });
  const exit = interpolate(frame, [shotDuration - 12, shotDuration], [1, 0], {
    easing: Easing.in(Easing.cubic),
    ...clamp,
  });

  return (
    <AbsoluteFill
      style={{
        opacity: Math.min(enter, exit),
      }}
    >
      <div
        style={{
          position: 'absolute',
          right: 72,
          top: 76,
          fontSize: 28,
          fontWeight: 800,
          color: colors.textSoft,
        }}
      >
        {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </div>
      <SceneIllustration shot={shot} />
      <Caption shot={shot} shotDuration={shotDuration} />
      <Progress index={index} total={total} frame={frame} shotDuration={shotDuration} />
    </AbsoluteFill>
  );
};

const Progress: React.FC<{index: number; total: number; frame: number; shotDuration: number}> = ({
  index,
  total,
  frame,
  shotDuration,
}) => {
  const progress = (index + frame / shotDuration) / total;

  return (
    <div
      style={{
        position: 'absolute',
        left: 336,
        right: 336,
        bottom: 126,
        height: 8,
        borderRadius: 999,
        background: '#FFE6C8',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: `${Math.max(0, Math.min(1, progress)) * 100}%`,
          height: '100%',
          background: colors.orange,
          borderRadius: 999,
        }}
      />
    </div>
  );
};

const BackgroundMarks: React.FC = () => (
  <>
    <div
      style={{
        position: 'absolute',
        right: -110,
        top: 220,
        width: 360,
        height: 360,
        borderRadius: 999,
        border: `36px solid rgba(255, 181, 46, 0.2)`,
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: -90,
        bottom: 210,
        width: 280,
        height: 280,
        borderRadius: 999,
        border: `30px solid rgba(111, 98, 168, 0.12)`,
      }}
    />
  </>
);

const DoudouHero: React.FC = () => (
  <div style={{position: 'absolute', inset: 0}}>
    <div
      style={{
        position: 'absolute',
        left: 290,
        top: 86,
        width: 320,
        height: 400,
        borderRadius: 155,
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F6FBFF 100%)',
        border: `6px solid ${colors.ink}`,
        boxShadow: '0 26px 0 rgba(31,20,8,0.08)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 52,
          top: 78,
          width: 216,
          height: 128,
          borderRadius: 58,
          background: '#17120E',
        }}
      >
        <div style={{position: 'absolute', left: 52, top: 42, width: 32, height: 24, borderRadius: 20, background: colors.cyan}} />
        <div style={{position: 'absolute', right: 52, top: 42, width: 32, height: 24, borderRadius: 20, background: colors.cyan}} />
        <div
          style={{
            position: 'absolute',
            left: 78,
            top: 80,
            width: 62,
            height: 24,
            borderBottom: `6px solid ${colors.cyan}`,
            borderRadius: 999,
          }}
        />
      </div>
      <div style={{position: 'absolute', left: 150, top: -48, width: 18, height: 64, background: colors.ink, borderRadius: 999}} />
      <div
        style={{
          position: 'absolute',
          left: 128,
          top: -78,
          width: 60,
          height: 60,
          background: colors.gold,
          border: `5px solid ${colors.ink}`,
          transform: 'rotate(18deg)',
          clipPath: 'polygon(50% 0%, 62% 35%, 100% 50%, 62% 65%, 50% 100%, 38% 65%, 0 50%, 38% 35%)',
        }}
      />
    </div>
    <div
      style={{
        position: 'absolute',
        right: 96,
        top: 180,
        width: 250,
        height: 180,
        borderRadius: 34,
        border: `5px solid ${colors.ink}`,
        background: '#fff',
        boxShadow: '10px 12px 0 rgba(31,20,8,0.08)',
      }}
    >
      <div style={{fontSize: 34, fontWeight: 900, color: colors.orange, padding: '42px 28px 0'}}>先别买</div>
      <div style={{margin: '20px 28px', height: 16, borderRadius: 999, background: '#FFE3BF'}} />
    </div>
  </div>
);

const splitKeyword = (text: string, keyword: string) => {
  const index = text.indexOf(keyword);
  if (index < 0) return {before: text, keyword: '', after: ''};
  return {
    before: text.slice(0, index),
    keyword,
    after: text.slice(index + keyword.length),
  };
};

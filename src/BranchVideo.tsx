import {AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {BrandBadge} from './components/BrandBadge';
import {Caption} from './components/Caption';
import {DoudouRobot, SceneIllustration} from './components/Illustrations';
import {demoScript} from './data/demo';
import type {ShotData} from './data/types';
import {colors, coverStage, stage} from './styles';

const clamp = {
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};

export const BranchVideo: React.FC = () => {
  const {shotDurationFrames, shots} = demoScript;

  return (
    <AbsoluteFill style={stage}>
      <BackgroundMarks />
      <BrandBadge compact />
      {shots.map((shot, index) => (
        <Sequence
          key={`${shot.scene}-${index}`}
          from={index * shotDurationFrames}
          durationInFrames={shotDurationFrames}
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
  const titleLines = demoScript.cover.title.split('\n');
  const noteParts = splitKeyword(demoScript.cover.note, demoScript.cover.noteHighlight);

  return (
    <AbsoluteFill style={coverStage}>
      <BackgroundMarks cover />
      <BrandBadge compact style={{left: '50%', top: 78, transform: 'translateX(-50%)'}} />
      <div
        style={{
          position: 'absolute',
          left: 88,
          top: 178,
          right: 88,
          opacity: enter,
          transform: `translateY(${(1 - enter) * 32}px)`,
          fontSize: 82,
          lineHeight: 1.16,
          fontWeight: 900,
          letterSpacing: 0,
          textAlign: 'center',
        }}
      >
        {titleLines.map((line) => {
          const parts = splitKeyword(line, demoScript.cover.titleHighlight);
          return (
            <div key={line}>
              {parts.before}
              <span style={{color: colors.orange}}>{parts.keyword}</span>
              {parts.after}
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 398,
          transform: 'translateX(-50%)',
          padding: '10px 24px',
          borderRadius: 999,
          border: `2px solid ${colors.border}`,
          background: '#FFF9EA',
          color: colors.textSoft,
          fontSize: 28,
          fontWeight: 900,
        }}
      >
        {demoScript.cover.subtitle}
      </div>
      <div style={{position: 'absolute', left: 190, right: 190, top: 500, height: 540}}>
        <DoudouHero />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 180,
          right: 180,
          bottom: 130,
          padding: '24px 34px',
          borderRadius: 24,
          background: '#FFF9EA',
          border: `2.5px solid ${colors.border}`,
          boxShadow: '0 12px 30px rgba(176, 110, 38, 0.14)',
          fontSize: 34,
          lineHeight: 1.35,
          fontWeight: 900,
          color: colors.textSoft,
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
        }}
      >
        <BulbIcon />
        <span>
          {noteParts.before}
          <span style={{color: colors.orange}}>{noteParts.keyword}</span>
          {noteParts.after}
        </span>
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

  return (
    <AbsoluteFill>
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

const BackgroundMarks: React.FC<{cover?: boolean}> = ({cover = false}) => (
  <>
    <div
      style={{
        position: 'absolute',
        right: cover ? 188 : -110,
        top: cover ? 530 : 220,
        width: cover ? 30 : 360,
        height: cover ? 30 : 360,
        borderRadius: 999,
        border: cover ? `4px solid rgba(224, 122, 20, 0.48)` : `36px solid rgba(255, 181, 46, 0.2)`,
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: cover ? 242 : -90,
        bottom: cover ? 420 : 210,
        width: cover ? 28 : 280,
        height: cover ? 28 : 280,
        borderRadius: 999,
        border: cover ? `4px solid rgba(224, 122, 20, 0.42)` : `30px solid rgba(111, 98, 168, 0.12)`,
      }}
    />
  </>
);

const DoudouHero: React.FC = () => (
  <div style={{position: 'absolute', inset: 0}}>
    <div style={{position: 'absolute', left: 160, bottom: 8, width: 520, height: 58, borderRadius: '50%', background: 'rgba(224, 122, 20, 0.12)'}} />
    <DoudouRobot scale={0.86} style={{left: 285, top: 84}} />
    <div
      style={{
        position: 'absolute',
        left: 58,
        top: 244,
        width: 190,
        height: 78,
        borderRadius: 16,
        border: `4px solid ${colors.ink}`,
        background: '#fff',
        boxShadow: '0 10px 22px rgba(176, 110, 38, 0.16)',
      }}
    >
      <div style={{fontSize: 28, fontWeight: 900, color: colors.ink, padding: '21px 24px 0'}}>想用 AI?</div>
    </div>
    <div
      style={{
        position: 'absolute',
        left: 238,
        top: 150,
        width: 120,
        height: 86,
        borderRadius: 20,
        border: `4px solid ${colors.ink}`,
        background: '#fff',
        boxShadow: '0 10px 22px rgba(176, 110, 38, 0.14)',
      }}
    >
      <div style={{fontSize: 48, fontWeight: 900, color: colors.purple, textAlign: 'center', paddingTop: 11}}>?</div>
    </div>
  </div>
);

const BulbIcon: React.FC = () => (
  <span style={{position: 'relative', display: 'inline-block', width: 32, height: 38, flex: '0 0 auto'}}>
    <span
      style={{
        position: 'absolute',
        left: 4,
        top: 0,
        width: 24,
        height: 24,
        borderRadius: 999,
        background: colors.gold,
        border: `2.5px solid ${colors.coffee}`,
        boxShadow: '0 0 12px rgba(255,181,46,0.34)',
      }}
    />
    <span
      style={{
        position: 'absolute',
        left: 10,
        top: 22,
        width: 12,
        height: 12,
        borderRadius: 4,
        background: '#fff',
        border: `2.5px solid ${colors.coffee}`,
      }}
    />
  </span>
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

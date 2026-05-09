import type {CSSProperties, ReactNode} from 'react';
import {useCurrentFrame} from 'remotion';
import type {ShotData} from '../data/types';
import {firstBeatStyle} from '../motion/motionPresets';
import {cardBase, colors} from '../styles';

type Props = {
  shot: ShotData;
};

export const SceneIllustration: React.FC<Props> = ({shot}) => {
  const frame = useCurrentFrame();
  const styleFor = (target: string) => firstBeatStyle(shot.visualBeats, target, frame);

  switch (shot.scene) {
    case 'kid-meets-ai':
      return <RobotScene styleFor={styleFor} />;
    case 'family-rules-board':
      return <RulesScene styleFor={styleFor} />;
    case 'ask-the-purpose':
      return <PurposeScene styleFor={styleFor} />;
    case 'verify-answer':
      return <VerifyScene styleFor={styleFor} />;
    case 'time-limit':
      return <TimeLimitScene styleFor={styleFor} />;
    case 'kid-vs-trap':
      return <TrapScene styleFor={styleFor} />;
    case 'kid-explains':
      return <ExplainScene styleFor={styleFor} />;
  }
};

const SceneShell: React.FC<{children: ReactNode}> = ({children}) => (
  <div
    style={{
      position: 'absolute',
      left: 90,
      right: 90,
      top: 330,
      height: 860,
      ...cardBase,
      borderRadius: 42,
    }}
  >
    {children}
  </div>
);

const Label: React.FC<{children: ReactNode; style?: CSSProperties}> = ({children, style}) => (
  <div
    style={{
      position: 'absolute',
      padding: '12px 22px',
      borderRadius: 999,
      background: '#fff',
      border: `2px solid ${colors.ink}`,
      color: colors.textSoft,
      fontSize: 28,
      fontWeight: 800,
      boxShadow: '0 8px 20px rgba(176, 110, 38, 0.14)',
      ...style,
    }}
  >
    {children}
  </div>
);

const DoudouRobot: React.FC<{style?: CSSProperties}> = ({style}) => (
  <div
    style={{
      position: 'absolute',
      width: 260,
      height: 330,
      borderRadius: 126,
      background: 'linear-gradient(180deg, #FFFFFF 0%, #F6FBFF 100%)',
      border: `5px solid ${colors.ink}`,
      boxShadow: '0 18px 0 rgba(31,20,8,0.08)',
      ...style,
    }}
  >
    <div
      style={{
        position: 'absolute',
        left: 43,
        top: 66,
        width: 174,
        height: 102,
        borderRadius: 46,
        background: '#17120E',
      }}
    >
      <div style={{position: 'absolute', left: 42, top: 34, width: 26, height: 20, borderRadius: 20, background: colors.cyan}} />
      <div style={{position: 'absolute', right: 42, top: 34, width: 26, height: 20, borderRadius: 20, background: colors.cyan}} />
      <div
        style={{
          position: 'absolute',
          left: 62,
          top: 63,
          width: 50,
          height: 20,
          borderBottom: `5px solid ${colors.cyan}`,
          borderRadius: 999,
        }}
      />
    </div>
    <div style={{position: 'absolute', left: 122, top: -38, width: 16, height: 52, background: colors.ink, borderRadius: 999}} />
    <div
      style={{
        position: 'absolute',
        left: 107,
        top: -64,
        width: 48,
        height: 48,
        background: colors.gold,
        border: `4px solid ${colors.ink}`,
        transform: 'rotate(18deg)',
        clipPath: 'polygon(50% 0%, 62% 35%, 100% 50%, 62% 65%, 50% 100%, 38% 65%, 0 50%, 38% 35%)',
      }}
    />
    <div style={{position: 'absolute', left: 58, bottom: 50, width: 144, height: 34, borderRadius: 999, background: '#FFE2ED'}} />
  </div>
);

const Tablet: React.FC<{style?: CSSProperties; children?: ReactNode}> = ({style, children}) => (
  <div
    style={{
      position: 'absolute',
      width: 300,
      height: 210,
      borderRadius: 34,
      border: `5px solid ${colors.ink}`,
      background: '#fff',
      boxShadow: '10px 12px 0 rgba(31,20,8,0.08)',
      ...style,
    }}
  >
    {children}
  </div>
);

const RobotScene: React.FC<{styleFor: (target: string) => CSSProperties}> = ({styleFor}) => (
  <SceneShell>
    <DoudouRobot style={{left: 156, top: 260, ...styleFor('robot')}} />
    <Tablet style={{right: 130, top: 305, ...styleFor('tablet')}}>
      <div style={{fontSize: 34, fontWeight: 900, color: colors.orange, padding: '44px 30px 10px'}}>会员入口</div>
      <div style={{margin: '18px 30px', height: 18, borderRadius: 999, background: '#FFE3BF'}} />
      <div style={{margin: '18px 30px', height: 18, borderRadius: 999, background: '#E8DDFB'}} />
    </Tablet>
    <Label style={{right: 155, top: 190, ...styleFor('bubble')}}>先等等</Label>
    <Cloud left={72} top={92} />
    <Cloud left={650} top={92} scale={0.82} />
  </SceneShell>
);

const RulesScene: React.FC<{styleFor: (target: string) => CSSProperties}> = ({styleFor}) => (
  <SceneShell>
    <div
      style={{
        position: 'absolute',
        left: 180,
        top: 150,
        width: 540,
        height: 500,
        ...cardBase,
        padding: 42,
        ...styleFor('rules'),
      }}
    >
      <div style={{fontSize: 42, fontWeight: 900, color: colors.orange, marginBottom: 32}}>家庭 AI 规则</div>
      {['问前先想', '答案要核对', '够用就停'].map((item, index) => (
        <div key={item} style={{display: 'flex', alignItems: 'center', gap: 18, marginBottom: 28, ...styleFor(index === 1 ? 'rules-list' : 'checklist')}}>
          <span style={{width: 34, height: 34, borderRadius: 999, background: colors.gold, border: `3px solid ${colors.ink}`}} />
          <span style={{fontSize: 38, fontWeight: 800}}>{item}</span>
        </div>
      ))}
    </div>
    <Label style={{left: 270, bottom: 116, background: '#FFF1D7', ...styleFor('boundary')}}>边界先定</Label>
  </SceneShell>
);

const PurposeScene: React.FC<{styleFor: (target: string) => CSSProperties}> = ({styleFor}) => (
  <SceneShell>
    <div
      style={{
        position: 'absolute',
        left: 338,
        top: 155,
        width: 224,
        height: 276,
        borderRadius: '110px 110px 48px 48px',
        background: colors.gold,
        border: `5px solid ${colors.ink}`,
        ...styleFor('lightbulb'),
      }}
    >
      <div style={{position: 'absolute', left: 72, bottom: -64, width: 80, height: 82, borderRadius: 18, background: colors.purple, border: `5px solid ${colors.ink}`}} />
    </div>
    <Label style={{left: 118, top: 215, fontSize: 72, color: colors.purple, ...styleFor('question')}}>?</Label>
    <Label style={{right: 124, top: 218, fontSize: 72, color: colors.purple, ...styleFor('question')}}>?</Label>
    <div style={{position: 'absolute', left: 240, bottom: 126, width: 420, ...cardBase, padding: 32, ...styleFor('prompt')}}>
      <div style={{fontSize: 40, fontWeight: 900, color: colors.orange}}>先说自己的想法</div>
      <div style={{height: 18, borderRadius: 999, background: '#FFE4BF', marginTop: 22}} />
      <div style={{height: 18, width: 260, borderRadius: 999, background: '#E8DDFB', marginTop: 16}} />
    </div>
  </SceneShell>
);

const VerifyScene: React.FC<{styleFor: (target: string) => CSSProperties}> = ({styleFor}) => (
  <SceneShell>
    <Tablet style={{left: 245, top: 190, width: 410, height: 310, ...styleFor('source')}}>
      <div style={{fontSize: 34, fontWeight: 900, color: colors.textSoft, padding: 34}}>AI 回答</div>
      <div style={{margin: '0 34px 18px', height: 20, background: '#FFE4BF', borderRadius: 999}} />
      <div style={{margin: '0 34px 18px', height: 20, background: '#E8DDFB', borderRadius: 999}} />
      <div style={{margin: '0 34px', height: 20, background: '#DDF3E2', borderRadius: 999}} />
    </Tablet>
    <div
      style={{
        position: 'absolute',
        left: 536,
        top: 420,
        width: 160,
        height: 160,
        borderRadius: 999,
        border: `14px solid ${colors.gold}`,
        boxShadow: `0 0 0 5px ${colors.ink}`,
        ...styleFor('magnifier'),
      }}
    >
      <div style={{position: 'absolute', right: -66, bottom: -44, width: 102, height: 18, borderRadius: 999, background: colors.ink, transform: 'rotate(38deg)'}} />
    </div>
    <Label style={{left: 190, bottom: 122, color: colors.green, ...styleFor('check')}}>✓ 看来源</Label>
    <Label style={{right: 168, bottom: 122, color: colors.orange, ...styleFor('cross')}}>× 不照抄</Label>
  </SceneShell>
);

const TimeLimitScene: React.FC<{styleFor: (target: string) => CSSProperties}> = ({styleFor}) => (
  <SceneShell>
    <Tablet style={{left: 142, top: 248, ...styleFor('tablet')}}>
      <div style={{fontSize: 42, fontWeight: 900, color: colors.purple, padding: 42}}>做图</div>
      <div style={{fontSize: 34, fontWeight: 800, color: colors.orange, padding: '0 42px'}}>英语练习</div>
    </Tablet>
    <div
      style={{
        position: 'absolute',
        right: 190,
        top: 180,
        width: 230,
        height: 400,
        ...styleFor('hourglass'),
      }}
    >
      <div style={{position: 'absolute', inset: 0, border: `6px solid ${colors.ink}`, borderRadius: 40, background: '#fff'}} />
      <div style={{position: 'absolute', left: 45, right: 45, top: 56, height: 120, background: colors.gold, clipPath: 'polygon(0 0, 100% 0, 50% 100%)'}} />
      <div style={{position: 'absolute', left: 45, right: 45, bottom: 56, height: 120, background: colors.gold, clipPath: 'polygon(50% 0, 100% 100%, 0 100%)'}} />
    </div>
    <Label style={{left: 342, bottom: 130, ...styleFor('timer')}}>15 分钟</Label>
  </SceneShell>
);

const TrapScene: React.FC<{styleFor: (target: string) => CSSProperties}> = ({styleFor}) => (
  <SceneShell>
    <Tablet style={{left: 144, top: 270, width: 350, height: 240, ...styleFor('tablet')}}>
      <div style={{fontSize: 38, fontWeight: 900, color: colors.textSoft, padding: 38}}>AI 也会错</div>
      <div style={{margin: '0 38px 18px', height: 18, background: '#FFE4BF', borderRadius: 999}} />
      <div style={{margin: '0 38px', height: 18, background: '#E8DDFB', borderRadius: 999}} />
    </Tablet>
    <div
      style={{
        position: 'absolute',
        right: 170,
        top: 192,
        width: 260,
        height: 300,
        borderRadius: 36,
        background: '#FFF0E2',
        border: `6px solid ${colors.orange}`,
        boxShadow: '12px 14px 0 rgba(224, 122, 20, 0.16)',
        ...styleFor('warning'),
      }}
    >
      <div style={{fontSize: 120, fontWeight: 900, color: colors.orange, textAlign: 'center', marginTop: 42}}>!</div>
      <div style={{fontSize: 34, fontWeight: 900, textAlign: 'center', color: colors.textSoft}}>风险提示</div>
    </div>
    <Label style={{left: 280, bottom: 130, background: '#FFF1D7', ...styleFor('boundary')}}>先定边界</Label>
  </SceneShell>
);

const ExplainScene: React.FC<{styleFor: (target: string) => CSSProperties}> = ({styleFor}) => (
  <SceneShell>
    <div style={{position: 'absolute', left: 180, top: 172, width: 540, height: 420, ...cardBase, background: '#FFFDF7', ...styleFor('board')}}>
      <div style={{fontSize: 42, fontWeight: 900, color: colors.purple, padding: 44}}>我的复盘</div>
      <div style={{margin: '0 44px 20px', height: 20, borderRadius: 999, background: '#FFE4BF'}} />
      <div style={{margin: '0 44px 20px', height: 20, width: 310, borderRadius: 999, background: '#E8DDFB'}} />
    </div>
    <Label style={{right: 160, bottom: 128, ...styleFor('speech')}}>讲清楚</Label>
  </SceneShell>
);

const Cloud: React.FC<{left: number; top: number; scale?: number}> = ({left, top, scale = 1}) => (
  <div style={{position: 'absolute', left, top, transform: `scale(${scale})`, opacity: 0.58}}>
    <div style={{position: 'absolute', width: 96, height: 44, borderRadius: 999, background: '#fff'}} />
    <div style={{position: 'absolute', left: 30, top: -22, width: 52, height: 52, borderRadius: 999, background: '#fff'}} />
    <div style={{position: 'absolute', left: 74, top: -8, width: 48, height: 48, borderRadius: 999, background: '#fff'}} />
  </div>
);

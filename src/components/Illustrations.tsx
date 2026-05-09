import type {CSSProperties, ReactNode} from 'react';
import {Img, staticFile, useCurrentFrame} from 'remotion';
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
      left: 86,
      right: 86,
      top: 430,
      height: 850,
      borderRadius: 38,
      background: 'linear-gradient(180deg, rgba(255, 253, 247, 0.92) 0%, rgba(255, 248, 234, 0.82) 100%)',
      border: `2.5px solid ${colors.border}`,
      boxShadow: '0 22px 46px rgba(176, 110, 38, 0.13)',
      overflow: 'hidden',
    }}
  >
    <div style={{position: 'absolute', left: -110, top: -72, width: 280, height: 280, borderRadius: 999, background: 'rgba(255,181,46,0.12)'}} />
    <div style={{position: 'absolute', right: -120, bottom: -92, width: 300, height: 300, borderRadius: 999, background: 'rgba(111,98,168,0.08)'}} />
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
      border: `2.5px solid ${colors.ink}`,
      color: colors.textSoft,
      fontSize: 28,
      fontWeight: 800,
      boxShadow: '0 8px 20px rgba(176, 110, 38, 0.12)',
      ...style,
    }}
  >
    {children}
  </div>
);

const GeneratedAsset: React.FC<{name: string; style?: CSSProperties; imgStyle?: CSSProperties}> = ({
  name,
  style,
  imgStyle,
}) => (
  <div style={{position: 'absolute', ...style}}>
    <Img
      src={staticFile(`assets/generated/${name}`)}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        filter: 'drop-shadow(0 18px 26px rgba(176, 110, 38, 0.14))',
        ...imgStyle,
      }}
    />
  </div>
);

export const DoudouRobot: React.FC<{style?: CSSProperties; scale?: number}> = ({style, scale = 1}) => {
  const {transform, ...restStyle} = style || {};

  return (
    <div
      style={{
        position: 'absolute',
        width: 360,
        height: 540,
        transform: `scale(${scale}) ${transform || ''}`.trim(),
        transformOrigin: 'center bottom',
        ...restStyle,
      }}
    >
      <Img
        src={staticFile('assets/generated/doudou-robot.png')}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          filter: 'drop-shadow(0 18px 26px rgba(176, 110, 38, 0.18))',
        }}
      />
    </div>
  );
};

const Tablet: React.FC<{style?: CSSProperties; children?: ReactNode}> = ({style, children}) => (
  <div
    style={{
      position: 'absolute',
      width: 300,
      height: 210,
      borderRadius: 34,
      border: `4px solid ${colors.ink}`,
      background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF8EE 100%)',
      boxShadow: '0 16px 28px rgba(176, 110, 38, 0.14)',
      ...style,
    }}
  >
    {children}
  </div>
);

const RobotScene: React.FC<{styleFor: (target: string) => CSSProperties}> = ({styleFor}) => (
  <SceneShell>
    <div style={{position: 'absolute', left: 92, bottom: 116, width: 388, height: 48, borderRadius: '50%', background: 'rgba(224,122,20,0.12)'}} />
    <DoudouRobot scale={0.78} style={{left: 105, top: 190, ...styleFor('robot')}} />
    <div style={{position: 'absolute', right: 66, top: 286, width: 408, height: 310, ...styleFor('tablet')}}>
      <GeneratedAsset name="membership-card.png" style={{inset: 0}} />
      <div style={{position: 'absolute', left: 74, top: 70, fontSize: 32, fontWeight: 900, color: colors.textSoft}}>会员入口</div>
      <div style={{position: 'absolute', left: 172, bottom: 48, fontSize: 30, fontWeight: 900, color: '#fff'}}>¥ 99</div>
    </div>
    <Label style={{right: 132, top: 186, background: '#FFF8EA', ...styleFor('bubble')}}>先等等</Label>
    <Cloud left={78} top={90} />
    <Cloud left={676} top={92} scale={0.82} />
  </SceneShell>
);

const RulesScene: React.FC<{styleFor: (target: string) => CSSProperties}> = ({styleFor}) => (
  <SceneShell>
    <div
      style={{
        position: 'absolute',
        left: 246,
        top: 68,
        width: 414,
        height: 610,
        ...styleFor('rules'),
      }}
    >
      <GeneratedAsset name="rules-board.png" style={{inset: 0}} />
      <div style={{position: 'absolute', left: 88, top: 150, fontSize: 28, fontWeight: 900, color: '#fff'}}>家庭 AI 规则</div>
      {['问前先想', '答案要核对', '够用就停'].map((item, index) => (
        <div
          key={item}
          style={{
            position: 'absolute',
            left: 154,
            top: 252 + index * 84,
            fontSize: 27,
            fontWeight: 900,
            color: colors.ink,
            ...styleFor(index === 1 ? 'rules-list' : 'checklist'),
          }}
        >
          {item}
        </div>
      ))}
    </div>
    <Label style={{left: 286, bottom: 104, background: '#FFF1D7', ...styleFor('boundary')}}>边界先定</Label>
  </SceneShell>
);

const PurposeScene: React.FC<{styleFor: (target: string) => CSSProperties}> = ({styleFor}) => (
  <SceneShell>
    <GeneratedAsset
      name="purpose-target.png"
      style={{
        left: 326,
        top: 102,
        width: 248,
        height: 248,
        ...styleFor('lightbulb'),
      }}
    />
    <Label style={{left: 134, top: 224, fontSize: 64, color: colors.purple, ...styleFor('question')}}>?</Label>
    <Label style={{right: 140, top: 226, fontSize: 64, color: colors.purple, ...styleFor('question')}}>?</Label>
    <div style={{position: 'absolute', left: 196, bottom: 112, width: 510, ...cardBase, border: `4px solid ${colors.ink}`, padding: 34, ...styleFor('prompt')}}>
      <div style={{fontSize: 40, fontWeight: 900, color: colors.orange}}>先说自己的想法</div>
      <div style={{height: 18, borderRadius: 999, background: '#FFE4BF', marginTop: 24}} />
      <div style={{height: 18, width: 314, borderRadius: 999, background: '#E8DDFB', marginTop: 16}} />
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
    <GeneratedAsset
      name="magnifier.png"
      style={{
        left: 524,
        top: 398,
        width: 196,
        height: 196,
        ...styleFor('magnifier'),
      }}
    />
    <Label style={{left: 190, bottom: 122, color: colors.green, ...styleFor('check')}}>✓ 看来源</Label>
    <Label style={{right: 168, bottom: 122, color: colors.orange, ...styleFor('cross')}}>× 不照抄</Label>
  </SceneShell>
);

const TimeLimitScene: React.FC<{styleFor: (target: string) => CSSProperties}> = ({styleFor}) => (
  <SceneShell>
    <Tablet style={{left: 126, top: 246, width: 330, height: 238, ...styleFor('tablet')}}>
      <div style={{fontSize: 42, fontWeight: 900, color: colors.purple, padding: 42}}>做图</div>
      <div style={{fontSize: 34, fontWeight: 800, color: colors.orange, padding: '0 42px'}}>英语练习</div>
    </Tablet>
    <div
      style={{
        position: 'absolute',
        right: 174,
        top: 168,
        width: 230,
        height: 400,
        ...styleFor('hourglass'),
      }}
    >
      <div style={{position: 'absolute', inset: 0, border: `6px solid ${colors.ink}`, borderRadius: 40, background: '#fff'}} />
      <div style={{position: 'absolute', left: 45, right: 45, top: 56, height: 120, background: colors.gold, clipPath: 'polygon(0 0, 100% 0, 50% 100%)'}} />
      <div style={{position: 'absolute', left: 45, right: 45, bottom: 56, height: 120, background: colors.gold, clipPath: 'polygon(50% 0, 100% 100%, 0 100%)'}} />
    </div>
    <Label style={{left: 342, bottom: 112, background: '#FFF8EA', ...styleFor('timer')}}>15 分钟</Label>
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

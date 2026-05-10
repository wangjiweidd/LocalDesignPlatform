import type {CSSProperties, ReactNode} from 'react';
import {Img, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
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

const SceneShell: React.FC<{children: ReactNode}> = ({children}) => {
  const frame = useCurrentFrame();
  const enter = spring({
    frame,
    fps: 30,
    config: {
      damping: 18,
      stiffness: 88,
      mass: 0.9,
    },
  });
  const y = interpolate(enter, [0, 1], [28, 0]);
  const floatY = Math.sin(frame / 24) * 3;

  return (
    <div
      style={{
        position: 'absolute',
        left: 86,
        right: 86,
        top: 378,
        height: 760,
        opacity: enter,
        transform: `translateY(${y + floatY}px)`,
        overflow: 'visible',
      }}
    >
      {children}
    </div>
  );
};

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
    <div style={{position: 'absolute', left: 92, bottom: 118, width: 392, height: 50, borderRadius: '50%', background: 'rgba(224,122,20,0.12)'}} />
    <PlantPot style={{left: 132, top: 150, width: 350, height: 420}} />
    <DoudouRobot scale={0.45} style={{left: 418, top: 338, ...styleFor('robot')}} />
    <div
      style={{
        position: 'absolute',
        right: 82,
        top: 150,
        width: 360,
        height: 430,
        borderRadius: 34,
        background: '#FFFDF7',
        border: `5px solid ${colors.ink}`,
        boxShadow: '12px 14px 0 rgba(224, 122, 20, 0.14)',
        ...styleFor('tablet'),
      }}
    >
      <PhotoIcon style={{left: 44, top: 42}} />
      <div style={{position: 'absolute', left: 44, top: 192, fontSize: 34, lineHeight: 1.18, fontWeight: 900, color: colors.textSoft}}>
        叶子颜色
        <br />
        新芽变化
      </div>
      <div style={{position: 'absolute', left: 44, right: 44, bottom: 52, height: 18, borderRadius: 999, background: '#DDF3E2'}} />
      <div style={{position: 'absolute', left: 44, width: 172, bottom: 24, height: 18, borderRadius: 999, background: '#FFE4BF'}} />
    </div>
    <Label style={{left: 118, top: 92, background: '#FFF8EA'}}>先观察</Label>
    <Label style={{right: 126, bottom: 126, background: '#FFF1D7', ...styleFor('bubble')}}>拍下来</Label>
  </SceneShell>
);

const RulesScene: React.FC<{styleFor: (target: string) => CSSProperties}> = ({styleFor}) => (
  <SceneShell>
    <div
      style={{
        position: 'absolute',
        left: 184,
        top: 88,
        width: 540,
        height: 520,
        ...cardBase,
        background: '#FFFDF7',
        border: `5px solid ${colors.ink}`,
        ...styleFor('rules'),
      }}
    >
      <div style={{position: 'absolute', left: 44, top: 38, fontSize: 44, fontWeight: 900, color: colors.orange}}>观察卡</div>
      <div style={{position: 'absolute', right: 42, top: 34, width: 110, height: 94, borderRadius: 22, background: '#DDF3E2', border: `4px solid ${colors.ink}`}}>
        <Leaf style={{left: 34, top: 18, width: 42, height: 58}} />
      </div>
      {['照片', '日期', '发现', '追问'].map((item, index) => (
        <div
          key={item}
          style={{
            position: 'absolute',
            left: 58,
            top: 158 + index * 72,
            fontSize: 34,
            fontWeight: 900,
            color: colors.ink,
          }}
        >
          <span style={{color: colors.green, marginRight: 18}}>✓</span>
          {item}
        </div>
      ))}
    </div>
    <Label style={{left: 286, bottom: 108, background: '#FFF1D7', ...styleFor('boundary')}}>整理完成</Label>
  </SceneShell>
);

const PurposeScene: React.FC<{styleFor: (target: string) => CSSProperties}> = ({styleFor}) => (
  <SceneShell>
    <PlantPot style={{left: 92, top: 184, width: 300, height: 360, transform: 'scale(0.92)'}} />
    <div style={{position: 'absolute', left: 364, top: 112, width: 420, height: 508, ...cardBase, border: `5px solid ${colors.ink}`, padding: 36, ...styleFor('question')}}>
      <div style={{fontSize: 42, fontWeight: 900, color: colors.orange}}>先写问题</div>
      {['叶尖为什么发黄？', '新叶为什么更浅？', '今天要浇水吗？'].map((item, index) => (
        <div
          key={item}
          style={{
            marginTop: 28,
            padding: '18px 22px',
            borderRadius: 20,
            background: index === 1 ? '#E8DDFB' : '#FFF1D7',
            fontSize: 27,
            lineHeight: 1.16,
            fontWeight: 900,
            color: colors.textSoft,
          }}
        >
          {item}
        </div>
      ))}
    </div>
    <Label style={{right: 104, top: 86, fontSize: 58, color: colors.purple, ...styleFor('lightbulb')}}>?</Label>
    <Label style={{left: 330, bottom: 106, background: '#FFF8EA'}}>再问 AI</Label>
  </SceneShell>
);

const VerifyScene: React.FC<{styleFor: (target: string) => CSSProperties}> = ({styleFor}) => (
  <SceneShell>
    <Tablet style={{left: 128, top: 148, width: 392, height: 320, ...styleFor('source')}}>
      <div style={{fontSize: 34, fontWeight: 900, color: colors.textSoft, padding: 34}}>AI 解释</div>
      <div style={{margin: '0 34px 18px', height: 20, background: '#FFE4BF', borderRadius: 999}} />
      <div style={{margin: '0 34px 18px', height: 20, background: '#DDF3E2', borderRadius: 999}} />
      <div style={{fontSize: 25, fontWeight: 900, color: colors.orange, padding: '8px 34px'}}>需要核对来源</div>
    </Tablet>
    <div style={{position: 'absolute', right: 134, top: 146, width: 270, height: 312, borderRadius: 34, background: '#FFFDF7', border: `5px solid ${colors.ink}`}}>
      <Leaf style={{left: 84, top: 42, width: 92, height: 140}} />
      <div style={{position: 'absolute', left: 42, right: 42, bottom: 48, height: 18, borderRadius: 999, background: '#DDF3E2'}} />
      <div style={{position: 'absolute', left: 42, width: 124, bottom: 20, height: 18, borderRadius: 999, background: '#FFE4BF'}} />
    </div>
    <GeneratedAsset
      name="magnifier.png"
      style={{
        left: 486,
        top: 344,
        width: 214,
        height: 214,
        ...styleFor('magnifier'),
      }}
    />
    <Label style={{left: 190, bottom: 122, color: colors.green, ...styleFor('check')}}>✓ 看来源</Label>
    <Label style={{right: 168, bottom: 122, color: colors.orange, ...styleFor('cross')}}>× 不硬抄</Label>
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

const PlantPot: React.FC<{style?: CSSProperties}> = ({style}) => (
  <div style={{position: 'absolute', ...style}}>
    <div
      style={{
        position: 'absolute',
        left: '50%',
        bottom: 28,
        width: 190,
        height: 150,
        transform: 'translateX(-50%)',
        borderRadius: '24px 24px 42px 42px',
        background: 'linear-gradient(180deg, #F6A23A 0%, #D96F18 100%)',
        border: `5px solid ${colors.ink}`,
        boxShadow: '10px 12px 0 rgba(224, 122, 20, 0.15)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: '50%',
        bottom: 158,
        width: 16,
        height: 188,
        transform: 'translateX(-50%)',
        borderRadius: 999,
        background: colors.green,
        border: `3px solid ${colors.ink}`,
      }}
    />
    <Leaf style={{left: 48, top: 82, width: 118, height: 156, transform: 'rotate(-24deg)'}} />
    <Leaf style={{right: 48, top: 90, width: 116, height: 150, transform: 'rotate(24deg) scaleX(-1)'}} />
    <Leaf style={{left: 116, top: 22, width: 126, height: 176}} />
  </div>
);

const Leaf: React.FC<{style?: CSSProperties}> = ({style}) => (
  <div
    style={{
      position: 'absolute',
      width: 86,
      height: 126,
      borderRadius: '70% 10% 70% 10%',
      background: 'linear-gradient(135deg, #B7D878 0%, #6FB757 100%)',
      border: `4px solid ${colors.ink}`,
      boxShadow: '8px 10px 0 rgba(150, 199, 106, 0.18)',
      ...style,
    }}
  >
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: 18,
        bottom: 18,
        width: 4,
        transform: 'translateX(-50%) rotate(-14deg)',
        borderRadius: 999,
        background: 'rgba(31,20,8,0.34)',
      }}
    />
  </div>
);

const PhotoIcon: React.FC<{style?: CSSProperties}> = ({style}) => (
  <div
    style={{
      position: 'absolute',
      width: 170,
      height: 124,
      borderRadius: 24,
      background: '#EAF7E8',
      border: `5px solid ${colors.ink}`,
      overflow: 'hidden',
      ...style,
    }}
  >
    <div style={{position: 'absolute', left: 18, bottom: 16, width: 132, height: 54, borderRadius: '50% 50% 0 0', background: '#9FD27A'}} />
    <Leaf style={{left: 64, top: 18, width: 42, height: 60, borderWidth: 3}} />
    <div style={{position: 'absolute', right: 18, top: 18, width: 24, height: 24, borderRadius: 999, background: colors.gold}} />
  </div>
);

const Cloud: React.FC<{left: number; top: number; scale?: number}> = ({left, top, scale = 1}) => (
  <div style={{position: 'absolute', left, top, transform: `scale(${scale})`, opacity: 0.58}}>
    <div style={{position: 'absolute', width: 96, height: 44, borderRadius: 999, background: '#fff'}} />
    <div style={{position: 'absolute', left: 30, top: -22, width: 52, height: 52, borderRadius: 999, background: '#fff'}} />
    <div style={{position: 'absolute', left: 74, top: -8, width: 48, height: 48, borderRadius: 999, background: '#fff'}} />
  </div>
);

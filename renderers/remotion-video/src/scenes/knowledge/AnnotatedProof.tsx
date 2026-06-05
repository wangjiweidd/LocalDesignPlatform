import type {KnowledgeShotData} from '../../data/types-v2';
import type {OdinTheme} from '../../themes';
import {
  OdinDarkTextStack,
  OdinBottomCaption,
  OdinTeachingBackground,
  RedArrow,
  RedCircle,
} from '../../components/OdinEvidencePrimitives';

export const AnnotatedProof: React.FC<{shot: KnowledgeShotData; theme: OdinTheme; shotDuration: number}> = ({
  shot,
}) => {
  const lines = shot.evidenceLines ?? [
    '普通写法：我使用 Midjourney 生成了多版视觉方案。',
    '问题：没有交代为什么要这样生成，也没有说明筛选标准。',
    '改法：先写清楚目标、限制，再讲哪些结果被放弃。',
  ];

  return (
    <OdinTeachingBackground>
      <OdinDarkTextStack blocks={lines} />
      <RedCircle style={{right: 128, top: 760, transform: 'rotate(-3deg) scale(1.28)'}} />
      <RedArrow style={{right: 230, top: 690, transform: 'rotate(168deg) scale(1.35)'}} />
      {shot.callout && (
        <div
          style={{
            position: 'absolute',
            right: 110,
            top: 900,
            color: '#D71920',
            fontSize: 54,
            fontWeight: 900,
            fontFamily: '"Noto Serif SC", "Noto Sans SC", serif',
            transform: 'rotate(-6deg)',
          }}
        >
          {shot.callout}
        </div>
      )}
      <OdinBottomCaption shot={shot} />
    </OdinTeachingBackground>
  );
};

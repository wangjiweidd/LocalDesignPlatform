import type {KnowledgeShotData} from '../../data/types-v2';
import type {OdinTheme} from '../../themes';
import {
  EvidenceTitle,
  OdinBottomCaption,
  OdinTeachingBackground,
  OdinVideoPanel,
} from '../../components/OdinEvidencePrimitives';

export const MaterialBoard: React.FC<{shot: KnowledgeShotData; theme: OdinTheme; shotDuration: number}> = ({
  shot,
}) => {
  const lines = shot.evidenceLines ?? [
    '作品集里先放工具截图，再放生成结果。',
    '但面试官看不出目标、限制和取舍。',
    '这会让项目像一次操作记录。',
  ];

  return (
    <OdinTeachingBackground>
      <EvidenceTitle title={shot.evidenceTitle ?? shot.text} keyword={shot.keyword} top={126} />
      <OdinVideoPanel
        title={shot.evidenceSubtitle ?? 'Portfolio evidence'}
        lines={lines}
        highlights={shot.evidenceHighlights ?? []}
      />
      <OdinBottomCaption shot={shot} />
    </OdinTeachingBackground>
  );
};

import type {KnowledgeShotData} from '../../data/types-v2';
import type {OdinTheme} from '../../themes';
import {
  EvidenceTitle,
  OdinBlackBarStack,
  OdinBottomCaption,
  OdinStampRow,
  OdinTeachingBackground,
} from '../../components/OdinEvidencePrimitives';

export const CaseBreakdown: React.FC<{shot: KnowledgeShotData; theme: OdinTheme; shotDuration: number}> = ({
  shot,
}) => {
  const lines = [
    shot.caseBefore ?? '旧问题：作品集只说用了 AI 工具，缺少项目目标。',
    shot.caseDecision ?? '判断：招聘方要看你如何限制范围、筛掉方案。',
    shot.caseResult ?? '结果：把工具过程改成目标、限制、取舍三段。',
  ];

  return (
    <OdinTeachingBackground>
      <EvidenceTitle title={shot.evidenceTitle ?? shot.text} keyword={shot.keyword} top={250} />
      <OdinBlackBarStack items={lines} />
      <OdinStampRow items={shot.proofLabels ?? ['点赞', '关注', '收藏']} />
      <OdinBottomCaption shot={shot} />
    </OdinTeachingBackground>
  );
};

import {AbsoluteFill, Sequence} from 'remotion';
import type {CalculateMetadataFunction} from 'remotion';
import type {KnowledgeScriptData, EducationScriptData, ScriptDataV2} from './data/types-v2';
import {themeOdin, themeYaoning} from './themes';

import {DataReveal}        from './scenes/knowledge/DataReveal';
import {StepList}          from './scenes/knowledge/StepList';
import {ConceptCard}       from './scenes/knowledge/ConceptCard';
import {QuoteHero}         from './scenes/knowledge/QuoteHero';
import {ComparisonSplit}   from './scenes/knowledge/ComparisonSplit';
import {ChecklistReveal}   from './scenes/knowledge/ChecklistReveal';
import {TimelineFlow}      from './scenes/knowledge/TimelineFlow';

import {AiIntro}           from './scenes/education/AiIntro';
import {ChallengeGame}     from './scenes/education/ChallengeGame';
import {StoryMoment}       from './scenes/education/StoryMoment';
import {DemoWalk}          from './scenes/education/DemoWalk';
import {BoundaryCard}      from './scenes/education/BoundaryCard';
import {CelebrateWin}      from './scenes/education/CelebrateWin';
import {QaFlip}            from './scenes/education/QaFlip';

type KnowledgeSceneProps = {shot: KnowledgeScriptData['shots'][0]; theme: typeof themeOdin; shotDuration: number};
type EducationSceneProps = {shot: EducationScriptData['shots'][0]; theme: typeof themeYaoning; shotDuration: number};

const knowledgeMap: Record<string, React.FC<KnowledgeSceneProps>> = {
  'data-reveal':       DataReveal,
  'step-list':         StepList,
  'concept-card':      ConceptCard,
  'quote-hero':        QuoteHero,
  'comparison-split':  ComparisonSplit,
  'checklist-reveal':  ChecklistReveal,
  'timeline-flow':     TimelineFlow,
};

const educationMap: Record<string, React.FC<EducationSceneProps>> = {
  'ai-intro':       AiIntro,
  'challenge-game': ChallengeGame,
  'story-moment':   StoryMoment,
  'demo-walk':      DemoWalk,
  'boundary-card':  BoundaryCard,
  'celebrate-win':  CelebrateWin,
  'qa-flip':        QaFlip,
};

export type VideoProps = {script: ScriptDataV2};

export const calculateVideoMetadata: CalculateMetadataFunction<VideoProps> = ({props}) => ({
  durationInFrames: props.script.shots.length * props.script.shotDurationFrames,
  fps:              props.script.fps,
  width:            props.script.width,
  height:           props.script.height,
});

export const VideoComposition: React.FC<VideoProps> = ({script}) => {
  const isKnowledge = script.track === 'knowledge-sharing';
  const bg          = isKnowledge ? themeOdin.colors.bgDark : themeYaoning.colors.bg;

  return (
    <AbsoluteFill style={{background: bg, overflow: 'hidden'}}>
      {isKnowledge
        ? (script as KnowledgeScriptData).shots.map((shot, i) => {
            const Scene = knowledgeMap[shot.scene];
            if (!Scene) return null;
            return (
              <Sequence key={i} from={i * script.shotDurationFrames} durationInFrames={script.shotDurationFrames}>
                <Scene shot={shot} theme={themeOdin} shotDuration={script.shotDurationFrames} />
              </Sequence>
            );
          })
        : (script as EducationScriptData).shots.map((shot, i) => {
            const Scene = educationMap[shot.scene];
            if (!Scene) return null;
            return (
              <Sequence key={i} from={i * script.shotDurationFrames} durationInFrames={script.shotDurationFrames}>
                <Scene shot={shot} theme={themeYaoning} shotDuration={script.shotDurationFrames} />
              </Sequence>
            );
          })
      }
    </AbsoluteFill>
  );
};

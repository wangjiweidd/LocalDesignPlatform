import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import type {CalculateMetadataFunction} from 'remotion';
import type {KnowledgeScriptData, EducationScriptData, ScriptDataWithAudio} from './data/types-v2';
import {themeOdin, themeYaoning} from './themes';
import {ShotMotionShell} from './components/ShotMotionShell';
import {YaoningAtmosphere, YaoningTransitionGlow} from './components/YaoningAtmosphere';

import {DataReveal}        from './scenes/knowledge/DataReveal';
import {StepList}          from './scenes/knowledge/StepList';
import {ConceptCard}       from './scenes/knowledge/ConceptCard';
import {QuoteHero}         from './scenes/knowledge/QuoteHero';
import {ComparisonSplit}   from './scenes/knowledge/ComparisonSplit';
import {ChecklistReveal}   from './scenes/knowledge/ChecklistReveal';
import {TimelineFlow}      from './scenes/knowledge/TimelineFlow';
import {MaterialBoard}     from './scenes/knowledge/MaterialBoard';
import {AnnotatedProof}    from './scenes/knowledge/AnnotatedProof';
import {CaseBreakdown}     from './scenes/knowledge/CaseBreakdown';

import {AiIntro}           from './scenes/education/AiIntro';
import {ChallengeGame}     from './scenes/education/ChallengeGame';
import {StoryMoment}       from './scenes/education/StoryMoment';
import {DemoWalk}          from './scenes/education/DemoWalk';
import {BoundaryCard}      from './scenes/education/BoundaryCard';
import {CelebrateWin}      from './scenes/education/CelebrateWin';
import {QaFlip}            from './scenes/education/QaFlip';

type KnowledgeSceneProps = {
  shot: KnowledgeScriptData['shots'][0];
  theme: typeof themeOdin;
  shotDuration: number;
  videoTitle?: string;
  videoKeyword?: string;
};
type EducationSceneProps = {
  shot: EducationScriptData['shots'][0];
  theme: typeof themeYaoning;
  shotDuration: number;
  videoTitle?: string;
  videoKeyword?: string;
};

const knowledgeMap: Record<string, React.FC<KnowledgeSceneProps>> = {
  'data-reveal':       DataReveal,
  'step-list':         StepList,
  'concept-card':      ConceptCard,
  'quote-hero':        QuoteHero,
  'comparison-split':  ComparisonSplit,
  'checklist-reveal':  ChecklistReveal,
  'timeline-flow':     TimelineFlow,
  'material-board':    MaterialBoard,
  'annotated-proof':   AnnotatedProof,
  'case-breakdown':    CaseBreakdown,
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

export type VideoProps = {script: ScriptDataWithAudio};

const getShotDuration = (script: ScriptDataWithAudio, index: number): number =>
  script.shots[index]?.durationFrames ?? script.shotDurationFrames;

export const getTotalDurationFrames = (script: ScriptDataWithAudio): number =>
  script.shots.reduce((total, _shot, index) => total + getShotDuration(script, index), 0);

export const calculateVideoMetadata: CalculateMetadataFunction<VideoProps> = async ({props}) => ({
  durationInFrames: getTotalDurationFrames(props.script),
  fps:              props.script.fps,
  width:            props.script.width,
  height:           props.script.height,
});

export const VideoComposition: React.FC<VideoProps> = ({script}) => {
  const isKnowledge = script.track === 'knowledge-sharing';
  const bg          = isKnowledge ? themeOdin.colors.bgDark : themeYaoning.colors.bg;
  const shotStarts  = script.shots.reduce<number[]>((starts, _shot, index) => {
    starts.push(index === 0 ? 0 : starts[index - 1] + getShotDuration(script, index - 1));
    return starts;
  }, []);
  const audioSrc   = script.audioPath
    ? script.audioPath.startsWith('http') || script.audioPath.startsWith('file:')
      ? script.audioPath
      : staticFile(script.audioPath)
    : null;

  return (
    <AbsoluteFill style={{background: bg, overflow: 'hidden'}}>
      {audioSrc && <Audio src={audioSrc} />}
      {!isKnowledge && <YaoningAtmosphere theme={themeYaoning} />}
      {isKnowledge
        ? (script as KnowledgeScriptData).shots.map((shot, i) => {
            const Scene = knowledgeMap[shot.scene];
            if (!Scene) return null;
            const shotDuration = getShotDuration(script, i);
            return (
              <Sequence key={i} from={shotStarts[i]} durationInFrames={shotDuration}>
                <ShotMotionShell durationFrames={shotDuration} track="knowledge">
                  <Scene
                    shot={shot}
                    theme={themeOdin}
                    shotDuration={shotDuration}
                    videoTitle={script.title}
                    videoKeyword={script.cover.titleHighlight}
                  />
                </ShotMotionShell>
              </Sequence>
            );
          })
        : (script as EducationScriptData).shots.map((shot, i) => {
            const Scene = educationMap[shot.scene];
            if (!Scene) return null;
            const shotDuration = getShotDuration(script, i);
            return (
              <Sequence key={i} from={shotStarts[i]} durationInFrames={shotDuration}>
                <ShotMotionShell durationFrames={shotDuration} track="education">
                  <Scene
                    shot={shot}
                    theme={themeYaoning}
                    shotDuration={shotDuration}
                    videoTitle={script.cover.title}
                    videoKeyword={script.cover.titleHighlight}
                  />
                </ShotMotionShell>
              </Sequence>
            );
          })
      }
      {!isKnowledge && (
        <YaoningTransitionGlow
          shotStarts={shotStarts}
          accentColor={script.accentColor ?? themeYaoning.colors.accent}
        />
      )}
    </AbsoluteFill>
  );
};

import {Composition} from 'remotion';
import './fonts';

import {BranchCover, BranchVideo} from './BranchVideo';
import {demoScript, totalDuration} from './data/demo';

import {VideoComposition, calculateVideoMetadata} from './VideoComposition';
import {OdinCover}    from './covers/OdinCover';
import {YaoningCover} from './covers/YaoningCover';
import {script as currentScript} from './data/current-video';
import type {KnowledgeScriptData, EducationScriptData, ScriptDataV2} from './data/types-v2';

const script = currentScript as ScriptDataV2;

export const RemotionRoot: React.FC = () => {
  const isKnowledge = script.track === 'knowledge-sharing';

  return (
    <>
      {/* ── Legacy compositions (keep working) ── */}
      <Composition
        id="BranchVideo"
        component={BranchVideo}
        durationInFrames={totalDuration}
        fps={demoScript.fps}
        width={demoScript.width}
        height={demoScript.height}
      />
      <Composition
        id="BranchCover"
        component={BranchCover}
        durationInFrames={90}
        fps={demoScript.fps}
        width={demoScript.width}
        height={1440}
      />

      {/* ── New design system compositions ── */}
      <Composition
        id="VideoComposition"
        component={VideoComposition}
        calculateMetadata={calculateVideoMetadata}
        defaultProps={{script}}
        fps={30}
        width={1080}
        height={1920}
        durationInFrames={script.shots.length * script.shotDurationFrames}
      />
      {isKnowledge && (
        <Composition
          id="Cover"
          component={OdinCover}
          durationInFrames={90}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{
            cover: (script as KnowledgeScriptData).cover,
            accentColor: script.accentColor,
          }}
        />
      )}
      {!isKnowledge && (
        <Composition
          id="Cover"
          component={YaoningCover}
          durationInFrames={90}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{
            cover: (script as EducationScriptData).cover,
            accentColor: script.accentColor,
          }}
        />
      )}
    </>
  );
};

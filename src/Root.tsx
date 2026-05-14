import {Composition} from 'remotion';
import './fonts';

import {BranchCover, BranchVideo} from './BranchVideo';
import {demoScript, totalDuration} from './data/demo';

import {VideoComposition, calculateVideoMetadata} from './VideoComposition';
import {OdinCover}    from './covers/OdinCover';
import {YaoningCover} from './covers/YaoningCover';
import {script as currentScript} from './data/current-video';
import type {KnowledgeScriptData, EducationScriptData} from './data/types-v2';

export const RemotionRoot: React.FC = () => {
  const isKnowledge = currentScript.track === 'knowledge-sharing';

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
        defaultProps={{script: currentScript}}
        fps={30}
        width={1080}
        height={1920}
        durationInFrames={currentScript.shots.length * currentScript.shotDurationFrames}
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
            cover: (currentScript as KnowledgeScriptData).cover,
            accentColor: currentScript.accentColor,
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
            cover: (currentScript as unknown as EducationScriptData).cover,
            accentColor: currentScript.accentColor,
          }}
        />
      )}
    </>
  );
};

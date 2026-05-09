import {Composition} from 'remotion';
import {BranchCover, BranchVideo} from './BranchVideo';
import {demoScript, totalDuration} from './data/demo';

export const RemotionRoot: React.FC = () => {
  return (
    <>
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
        height={demoScript.height}
      />
    </>
  );
};

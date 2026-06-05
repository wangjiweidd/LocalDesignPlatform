import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import type {EducationShotData} from '../../data/types-v2';
import type {YaoningTheme} from '../../themes';
import {PersistentHeader} from '../../components/PersistentHeader';
import {ThemeCaption} from '../../components/ThemeCaption';
import {EducationStage} from '../../components/EducationStage';
import {TimeWindowAnimation} from '../../components/SemanticEducationAnimations';

export const AiIntro: React.FC<{
  shot: EducationShotData;
  theme: YaoningTheme;
  shotDuration: number;
  videoTitle?: string;
  videoKeyword?: string;
}> = ({shot, theme, shotDuration, videoTitle, videoKeyword}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  return (
    <AbsoluteFill style={{background: theme.colors.bg}}>
      <PersistentHeader theme={theme} title={videoTitle} keyword={videoKeyword} />

      <EducationStage width={820} height={820}>
        <TimeWindowAnimation theme={theme} frame={frame} fps={fps} />
      </EducationStage>

      <ThemeCaption shot={shot} shotDuration={shotDuration} theme={theme} />
    </AbsoluteFill>
  );
};

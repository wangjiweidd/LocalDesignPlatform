import type {EducationScriptData} from './types-v2';

export const quickPreviewScript: EducationScriptData = {
  track: 'ai-education',
  contentType: 'family-challenge',
  title: '孩子写作文总跑题',
  subtitle: '先搭提纲再动笔',
  fps: 30,
  width: 1080,
  height: 1920,
  colorScheme: 'light',
  accentColor: '#F97316',
  ageTarget: '7-10',
  shotDurationFrames: 150,
  cover: {
    title: '孩子写作文总跑题\n先搭提纲再动笔',
    subtitle: '5 秒预览',
    titleHighlight: '提纲',
    characterName: '豆豆',
  },
  shots: [
    {
      text: '写作文：先搭提纲再动笔',
      keyword: '提纲',
      caption: '别急着让 AI 代写，先让孩子说清楚结构',
      captionKeyword: '结构',
      scene: 'challenge-game',
      motionPreset: 'star-burst',
      animationStyle: 'bouncy-enter',
      stepNumber: 1,
    },
  ],
};

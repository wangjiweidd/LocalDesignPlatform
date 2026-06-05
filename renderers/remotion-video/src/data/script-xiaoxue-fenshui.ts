import type {EducationScriptData} from './types-v2';

export const script: EducationScriptData = {
  track:              'ai-education',
  contentType:        'story-scene',
  title:              '孩子是不是读书的料，就看小学这3个关键期',
  subtitle:           '',
  fps:                30,
  width:              1080,
  height:             1920,
  colorScheme:        'light',
  accentColor:        '#F97316',
  ageTarget:          '7-10',
  shotDurationFrames: 90,
  cover: {
    title:          '孩子是不是读书的料\n就看小学这3个关键期',
    subtitle:       '',
    titleHighlight: '3个关键期',
    characterName:  '豆豆',
    heroIconKey:    'three-bars',
  },
  shots: [
    // ── Shot 1: Hook ──────────────────────────────────────────────
    {
      text:           '小学6年有\n3个关键分水岭',
      keyword:        '3个',
      enText:         '3 Watersheds in 6 Years',
      caption:        '错过时间窗，追起来要花几倍力气',
      captionKeyword: '时间窗',
      scene:          'ai-intro',
      motionPreset:   'character-bounce',
      animationStyle: 'bouncy-enter',
    },
    // ── Shot 2: 第1个分水岭 1~2年级 ──────────────────────────────
    {
      text:           '1~2年级：拼的是家长勤快度',
      keyword:        '家长',
      caption:        '拼音写字计算，都要家长陪着盯',
      captionKeyword: '家长陪',
      scene:          'challenge-game',
      motionPreset:   'star-burst',
      animationStyle: 'bouncy-enter',
      stepNumber:     1,
    },
    // ── Shot 3: Insight ───────────────────────────────────────────
    {
      text:           '差距不是智商，是习惯和态度',
      keyword:        '习惯',
      caption:        '基础没打好，后面追要花几倍力气',
      captionKeyword: '几倍力气',
      scene:          'story-moment',
      motionPreset:   'bubble-pop',
      animationStyle: 'bouncy-enter',
    },
    // ── Shot 4: 第2个分水岭 3~4年级 ──────────────────────────────
    {
      text:           '3~4年级：后劲儿比分数更重要',
      keyword:        '后劲儿',
      caption:        '4习惯+2硬能力，初高中才能轻松',
      captionKeyword: '4习惯',
      scene:          'challenge-game',
      motionPreset:   'star-burst',
      animationStyle: 'bouncy-enter',
      stepNumber:     2,
    },
    // ── Shot 5: 4 Habits ──────────────────────────────────────────
    {
      text:           '必养的4个学习习惯',
      keyword:        '4个',
      caption:        '这4个习惯，现在不养初中就来不及',
      captionKeyword: '初中就来不及',
      scene:          'story-moment',
      motionPreset:   'bubble-pop',
      animationStyle: 'bouncy-enter',
    },
    // ── Shot 6: 第3个分水岭 5~6年级 ──────────────────────────────
    {
      text:           '5~6年级：直接决定中考高考',
      keyword:        '中考高考',
      caption:        '数学自学能力+英语提前储备是关键',
      captionKeyword: '自学能力',
      scene:          'challenge-game',
      motionPreset:   'star-burst',
      animationStyle: 'bouncy-enter',
      stepNumber:     3,
    },
    // ── Shot 7: Closing ───────────────────────────────────────────
    {
      text:           '普通孩子也能逆袭成学霸',
      keyword:        '逆袭',
      caption:        '精准规划，是父母给孩子最好的礼物',
      captionKeyword: '精准规划',
      scene:          'celebrate-win',
      motionPreset:   'confetti-burst',
      animationStyle: 'bouncy-enter',
      lottieId:       'fx-confetti-warm',
    },
  ],
};

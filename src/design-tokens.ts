// Vertical-video typography scale for 1080×1920
// Designed for Douyin/TikTok readability: minimum 36px,
// dramatic 4:1 contrast between hero and supporting text.
export const TYPE = {
  hero:     156,  // grade label, big numbers — visual anchor
  title:    88,   // shot headline
  subtitle: 64,   // insight statement
  body:     48,   // pull-quote, key insight emphasis
  caption:  44,   // subtitle/字幕 — must be readable
  meta:     32,   // section labels, milestone names
  micro:    26,   // status badges, dots
};

export const SPACE = {
  xs: 8, sm: 16, md: 24, lg: 40, xl: 64, '2xl': 96,
};

// Safe zones in the 1920 canvas
export const ZONES = {
  headerHeight: 96,        // PersistentHeader takes 0–96
  contentTop:   140,       // first content element starts here
  contentBottom: 1240,     // hard limit — caption must end above this
  padX:         60,        // horizontal page padding
};

// Series-level constants
export const SERIES_TITLE = '小学 · 3个关键分水岭';

export const MILESTONES = [
  {grade: '1~2年级', theme: '家长勤快度'},
  {grade: '3~4年级', theme: '后劲儿养成'},
  {grade: '5~6年级', theme: '直接决定中考'},
];

export const themeYaoning = {
  track: 'ai-education' as const,

  colors: {
    bg:            '#FDF6EC',
    bgDeep:        '#FFEDD5',
    surface:       '#FFFFFF',
    textPrimary:   '#1C1917',
    textSecondary: '#78716C',
    accent:        '#F97316',
    accentGreen:   '#86EFAC',
    accentViolet:  '#8B5CF6',
    celebrate:     '#10B981',
    question:      '#6366F1',
    safetyBg:      '#1C1917',
    safetyAccent:  '#F59E0B',
    border:        '#FED7AA',
  },

  fonts: {
    body:    'Noto Sans SC',
    display: 'Noto Serif SC',
    numbers: 'Nunito',
  },

  motion: {
    default: 'bouncy-enter' as const,
    subtle:  'smooth-reveal' as const,
    snappy:  'snappy-pop'   as const,
    stagger: 6,
  },

  shotDurationFrames: 90,
};

export type YaoningTheme = typeof themeYaoning;

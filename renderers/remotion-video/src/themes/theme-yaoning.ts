export const themeYaoning = {
  track: 'ai-education' as const,

  colors: {
    bg:
      'linear-gradient(180deg, #FFF8EF 0%, #FFE9DA 48%, #FFE0CF 100%), ' +
      'linear-gradient(135deg, rgba(255,255,255,0.42) 0 14%, rgba(255,255,255,0) 14% 28%, rgba(255,255,255,0.18) 28% 40%, rgba(255,255,255,0) 40% 100%), ' +
      'radial-gradient(140% 86% at 50% 8%, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.4) 42%, rgba(255,255,255,0) 74%), ' +
      'linear-gradient(122deg, rgba(255, 213, 173, 0.34) 0%, rgba(255, 213, 173, 0) 34%), ' +
      'linear-gradient(244deg, rgba(182, 225, 203, 0.18) 0%, rgba(182, 225, 203, 0) 32%)',
    bgDeep:        '#FFEDD5',
    surface:       '#FFFFFF',
    textPrimary:   '#1C1917',
    textSecondary: '#78716C',
    accent:        '#F97316',
    accentGreen:   '#86EFAC',
    accentViolet:  '#8B5CF6',
    accentYellow:  '#FACC15',
    celebrate:     '#10B981',
    question:      '#6366F1',
    safetyBg:      '#1C1917',
    safetyAccent:  '#F59E0B',
    border:        '#FED7AA',
    headerBg:      '#1C1917',
    headerText:    '#FFFFFF',
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

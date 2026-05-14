export const themeOdin = {
  track: 'knowledge-sharing' as const,

  colors: {
    bgDark:        '#0F172A',
    bgLight:       '#F8F7F2',
    surface:       '#1E293B',
    textPrimary:   '#F1F5F9',
    textSecondary: '#94A3B8',
    accent:        '#E85D04',
    accentAlt:     '#6366F1',
    success:       '#10B981',
    border:        '#334155',
  },

  fonts: {
    body:    'Noto Sans SC',
    display: 'Inter',
    mono:    'Space Mono',
  },

  motion: {
    default: 'snappy-pop'    as const,
    hero:    'dramatic-slam' as const,
    list:    'smooth-reveal' as const,
    stagger: 6,
  },

  shotDurationFrames: 80,
};

export type OdinTheme = typeof themeOdin;

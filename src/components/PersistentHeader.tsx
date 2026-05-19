import type {YaoningTheme} from '../themes';
import {SERIES_TITLE} from '../design-tokens';

/**
 * Persistent header — short-video style, NOT app navigation.
 * Centered series title with subtle accent line, no back button / brand mark.
 * Stays at the top of every shot to give viewers context.
 */
export const PersistentHeader: React.FC<{
  theme: YaoningTheme;
  label?: string;
}> = ({theme, label = SERIES_TITLE}) => {
  return (
    <>
      {/* Top accent line */}
      <div style={{
        position: 'absolute', left: 0, right: 0, top: 0, height: 6,
        background: `linear-gradient(90deg, ${theme.colors.accent}, ${theme.colors.accentViolet})`,
        zIndex: 100,
      }} />

      {/* Centered series title */}
      <div style={{
        position: 'absolute', left: 0, right: 0, top: 28,
        textAlign: 'center',
        zIndex: 100,
      }}>
        <span style={{
          display:        'inline-block',
          fontSize:       30,
          fontWeight:     700,
          color:          theme.colors.textSecondary,
          fontFamily:     theme.fonts.body,
          letterSpacing:  3,
          padding:        '8px 28px',
        }}>
          {label}
        </span>
      </div>
    </>
  );
};

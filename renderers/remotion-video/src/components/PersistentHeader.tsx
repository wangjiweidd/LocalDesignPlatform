import type {YaoningTheme} from '../themes';
import {fonts} from '../fonts';

/**
 * Persistent header — surface-card style. Sits at the top of every shot as
 * video-level context. White card on the warm wash gives it the "title block"
 * feel without the heaviness of a dark bar. Accent-colored keyword inline.
 *
 * Reads video-level copy from `title` / `keyword`. Stays at z-index 100.
 */
export const PersistentHeader: React.FC<{
  theme: YaoningTheme;
  title?: string;
  keyword?: string;
  label?: string;
}> = ({theme, title, keyword, label}) => {
  const headline = title ?? label ?? '';
  const kw = keyword ?? '';
  const kwIdx = kw && headline.indexOf(kw) >= 0 ? headline.indexOf(kw) : -1;
  const before = kwIdx >= 0 ? headline.slice(0, kwIdx) : headline;
  const after = kwIdx >= 0 ? headline.slice(kwIdx + kw.length) : '';

  if (!headline) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: 32,
        right: 32,
        top: 144,
        zIndex: 100,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          display: 'inline-block',
          padding: '26px 42px',
          background: 'rgba(255, 253, 249, 0.9)',
          border: `1.5px solid rgba(241, 196, 126, 0.72)`,
          borderRadius: 20,
          boxSizing: 'border-box',
          boxShadow: '0 10px 28px rgba(176, 110, 38, 0.08)',
          maxWidth: '100%',
        }}
      >
        <div
          style={{
            fontSize: 86,
            fontWeight: 300,
            color: theme.colors.textPrimary,
            fontFamily: `"${fonts.alibabaPuhuiTitle}", ${theme.fonts.body}`,
            fontSynthesis: 'none',
            lineHeight: 1.4,
            letterSpacing: 0,
            wordBreak: 'keep-all',
            whiteSpace: 'pre-line',
          }}
        >
          {kwIdx >= 0 ? (
            <>
              {before}
              <span style={{color: theme.colors.accent, fontWeight: 300}}>{kw}</span>
              {after}
            </>
          ) : (
            headline
          )}
        </div>
      </div>
    </div>
  );
};

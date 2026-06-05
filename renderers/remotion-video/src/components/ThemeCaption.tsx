import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {KnowledgeShotData, EducationShotData} from '../data/types-v2';
import type {OdinTheme, YaoningTheme} from '../themes';
import {splitKeyword} from '../utils/text';
import {TYPE, ZONES} from '../design-tokens';
import {fonts} from '../fonts';

type AnyShot = KnowledgeShotData | EducationShotData;
type Theme   = OdinTheme | YaoningTheme;
type TimedCaptionChar = {char: string; startMs: number; endMs: number; index: number};
type ActiveCaption = {text: string; keyword: string; startMs: number; endMs: number};

// Shared fields present on both OdinTheme and YaoningTheme
type SharedColors = {textPrimary: string; accent: string; surface: string; border: string};

function getSharedColors(theme: Theme): SharedColors {
  if (theme.track === 'knowledge-sharing') {
    const t = theme as OdinTheme;
    return {textPrimary: t.colors.textPrimary, accent: t.colors.accent,
            surface: t.colors.surface, border: t.colors.border};
  }
  const t = theme as YaoningTheme;
  return {textPrimary: t.colors.textPrimary, accent: t.colors.accent,
          surface: t.colors.surface, border: t.colors.border};
}

function getKeywordRange(text: string, keyword: string): {start: number; end: number} | null {
  const textChars = Array.from(text);
  const keywordChars = Array.from(keyword);
  if (keywordChars.length === 0) return null;

  for (let i = 0; i <= textChars.length - keywordChars.length; i++) {
    if (keywordChars.every((char, j) => textChars[i + j] === char)) {
      return {start: i, end: i + keywordChars.length};
    }
  }

  return null;
}

function distributeChars(text: string, startMs: number, endMs: number): TimedCaptionChar[] {
  const chars = Array.from(text);
  const duration = Math.max(1, endMs - startMs);
  return chars.map((char, index) => {
    const charStart = startMs + (duration * index) / Math.max(1, chars.length);
    const charEnd = startMs + (duration * (index + 1)) / Math.max(1, chars.length);
    return {char, startMs: charStart, endMs: charEnd, index};
  });
}

function getRevealEndMs(startMs: number, endMs: number): number {
  const duration = Math.max(1, endMs - startMs);
  const desiredRevealMs = Math.min(820, Math.max(320, duration * 0.52));
  const holdMs = Math.min(240, duration * 0.25);
  return Math.max(startMs + 1, Math.min(startMs + desiredRevealMs, endMs - holdMs));
}

function buildTimedCaptionChars(shot: AnyShot): TimedCaptionChar[] | null {
  const timing = shot.captionTiming;
  if (!timing) return null;

  const tokenText = timing.tokens?.map((token) => token.text).join('');
  if (!timing.tokens || tokenText !== shot.caption) {
    return distributeChars(shot.caption, timing.startMs, getRevealEndMs(timing.startMs, timing.endMs));
  }

  let index = 0;
  return timing.tokens.flatMap((token) => {
    const chars = distributeChars(token.text, token.startMs, getRevealEndMs(token.startMs, token.endMs));
    return chars.map((charTiming) => ({...charTiming, index: index++}));
  });
}

function getActiveCaption(shot: AnyShot, localMs: number): ActiveCaption {
  const segments = shot.captionSegments;
  if (segments && segments.length > 0) {
    const active =
      segments.find((segment) => localMs >= segment.startMs - 60 && localMs <= segment.endMs + 180) ??
      segments.find((segment) => localMs < segment.startMs) ??
      segments[segments.length - 1];

    return {
      text: active.text,
      keyword: active.keyword ?? shot.captionKeyword,
      startMs: active.startMs,
      endMs: active.endMs,
    };
  }

  return {
    text: shot.caption,
    keyword: shot.captionKeyword,
    startMs: shot.captionTiming?.startMs ?? 0,
    endMs: shot.captionTiming?.endMs ?? 1000,
  };
}

export const ThemeCaption: React.FC<{shot: AnyShot; shotDuration: number; theme: Theme}> = ({
  shot, shotDuration, theme,
}) => {
  const frame = useCurrentFrame();
  const {fps}  = useVideoConfig();

  const isOdin    = theme.track === 'knowledge-sharing';
  const springCfg = isOdin
    ? {damping: 20, stiffness: 200}   // snappy-pop
    : {damping: 8};                    // bouncy-enter

  const yaoningCaptionDelay = 12;
  const yaoningEnter = interpolate(frame, [yaoningCaptionDelay, yaoningCaptionDelay + 18], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const enter = isOdin ? spring({frame, fps, config: springCfg}) : yaoningEnter;
  const timingExitDelay = shot.captionTiming
    ? Math.min(
        shotDuration - 4,
        Math.round(((shot.captionTiming.endMs + 220) / 1000) * fps),
      )
    : null;
  const exit  = spring({frame, fps, config: {damping: 200},
    delay: timingExitDelay ?? shotDuration - Math.round(fps * 0.6)});
  const opacity    = Math.min(Math.max(0, enter - exit), 1);
  const translateY = (1 - enter) * (isOdin ? 28 : 18);

  const {textColor, accentColor, bgColor, borderColor} = (() => {
    const c = getSharedColors(theme);
    return {textColor: c.textPrimary, accentColor: c.accent,
            bgColor: c.surface, borderColor: c.border};
  })();

  const localMs = (frame / fps) * 1000;
  const activeCaption = getActiveCaption(shot, localMs);
  const captionParts = splitKeyword(activeCaption.text, activeCaption.keyword);
  const timedCaptionChars = shot.captionSegments
    ? distributeChars(
        activeCaption.text,
        activeCaption.startMs,
        getRevealEndMs(activeCaption.startMs, activeCaption.endMs),
      )
    : buildTimedCaptionChars(shot);
  const keywordRange = getKeywordRange(activeCaption.text, activeCaption.keyword);

  if (!isOdin) {
    const yaoning = theme as YaoningTheme;
    return (
        <div
          style={{
            position: 'absolute',
            left: 24,
            right: 24,
            top: ZONES.captionTop,
            opacity,
            transform: `translateY(${translateY}px)`,
          }}
        >
          <div
            style={{
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: TYPE.caption,
                fontWeight: 400,
                color: yaoning.colors.textPrimary,
                fontFamily: `"${fonts.alibabaPuhui}", ${yaoning.fonts.body}`,
                fontSynthesis: 'none',
                textAlign: 'center',
                lineHeight: 1.56,
                letterSpacing: 0,
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
                overflow: 'hidden',
                maxWidth: 940,
                margin: '0 auto',
              }}
            >
              {timedCaptionChars
                ? timedCaptionChars.map((item) => {
                    const charOpacity = interpolate(localMs, [item.startMs - 35, item.startMs + 90], [0, 1], {
                      easing: Easing.out(Easing.cubic),
                      extrapolateLeft: 'clamp',
                      extrapolateRight: 'clamp',
                    });
                    const isKeyword =
                      keywordRange !== null && item.index >= keywordRange.start && item.index < keywordRange.end;
                    return (
                      <span
                        key={`${item.index}-${item.char}`}
                        style={{
                          color: isKeyword ? '#B45309' : yaoning.colors.textPrimary,
                          opacity: charOpacity,
                        }}
                      >
                        {item.char}
                      </span>
                    );
                  })
                : (
                  <>
                    {captionParts.before}
                    <span style={{color: '#B45309', fontWeight: 400}}>{captionParts.keyword}</span>
                    {captionParts.after}
                  </>
                )}
            </div>
          </div>
        </div>
    );
  }

  return (
    <>
      {/* Caption card */}
      <div
        style={{
          position:     'absolute',
          left:         72,
          right:        72,
          bottom:       156,
          padding:      '28px 40px',
          borderRadius: 28,
          background:   bgColor,
          border:       `2px solid ${borderColor}`,
          opacity,
          transform:    `translateY(${translateY}px)`,
          color:        textColor,
          fontSize:     42,
          lineHeight:   1.32,
          fontWeight:   800,
          fontFamily:   theme.fonts.body,
        }}
      >
        {captionParts.before}
        <span style={{color: accentColor, fontWeight: 900}}>{captionParts.keyword}</span>
        {captionParts.after}
      </div>
    </>
  );
};

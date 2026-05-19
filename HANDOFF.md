# Remotion Video Pipeline — Handoff

**Branch:** `codex/remotion-video-pipeline`  
**Stack:** Remotion 4.0.459 · React · TypeScript · `@remotion/google-fonts`  
**Last updated:** 2026-05-15

---

## What this project does

Generates 9:16 short-form videos (1080×1920, 30 fps) for two content tracks:

| Track | ID | Audience | Theme |
|---|---|---|---|
| **Odin** 知识干货 | `knowledge-sharing` | Professionals | Dark navy, orange accent |
| **曜宁** 亲子AI教育 | `ai-education` | Parents (Chinese) | Warm peach, orange+violet |

Each video is defined by a single **script data object** in `src/data/current-video.ts`. The script lists shots; each shot maps to a scene component. Remotion renders them sequentially via `<Sequence>`.

---

## Active test video

`src/data/current-video.ts` → imports `script` from `src/data/script-xiaoxue-fenshui.ts`

**Topic:** 小学3个关键分水岭（孩子是不是读书的料，就看小学这3个关键期）  
**Track:** `ai-education` · **Theme:** `themeYaoning`  
**Duration:** 7 shots × 90 frames @ 30fps = 21 seconds

### Shot map

| # | Scene | `shot.text` | Notes |
|---|---|---|---|
| 1 | `ai-intro` | 小学6年有3个关键分水岭 | Hook — giant "3" visual anchor |
| 2 | `challenge-game` | 1~2年级：拼的是家长勤快度 | stepNumber=1 |
| 3 | `story-moment` | 差距不是智商，是习惯和态度 | Pull-quote with giant `"` |
| 4 | `challenge-game` | 3~4年级：后劲儿比分数更重要 | stepNumber=2 |
| 5 | `story-moment` | 必养的4个学习习惯 | Pull-quote |
| 6 | `challenge-game` | 5~6年级：直接决定中考高考 | stepNumber=3 |
| 7 | `celebrate-win` | 普通孩子也能逆袭成学霸 | Confetti + 3-checkmark seal |

---

## Design System (2026-05-15 major redesign)

### Design constraints — SHORT VIDEO, not an app

This is a **Douyin/TikTok vertical short video** for Chinese parents. Apply these constraints:

- **All content centered** — no left-aligned text, no left-border rule bars
- **No App patterns** — no navigation, no brand mark in header, no back buttons, no step-dot indicators
- **No English eyebrow labels** — Chinese only
- **No decorative robots** — removed from all 4 education scenes
- **Content zone:** y=100 to y=1240 (65% of canvas). Bottom 35% is intentionally empty for platform UI (like/comment buttons)
- **Minimum font size:** 26px (`TYPE.micro`). Caption must be ≥ 44px (`TYPE.caption`)

### Design tokens — `src/design-tokens.ts`

```ts
export const TYPE = {
  hero:     156,  // grade label, big numbers — visual anchor
  title:    88,   // shot headline
  subtitle: 64,   // insight statement
  body:     48,   // pull-quote, key insight emphasis
  caption:  44,   // 字幕 — must be readable on mobile
  meta:     32,   // section labels, milestone grade names
  micro:    26,   // status badges
};

export const ZONES = {
  headerHeight: 96,    // PersistentHeader takes 0–96
  contentTop:   140,   // first content element starts here
  contentBottom: 1240, // hard limit — caption card must end above this
  padX:         60,    // horizontal page padding
};

export const SERIES_TITLE = '小学 · 3个关键分水岭';

export const MILESTONES = [
  {grade: '1~2年级', theme: '家长勤快度'},
  {grade: '3~4年级', theme: '后劲儿养成'},
  {grade: '5~6年级', theme: '直接决定中考'},
];
```

### YaoningTheme palette — `src/themes/theme-yaoning.ts`

```ts
colors: {
  bg:            '#FDF6EC',   // warm cream
  bgDeep:        '#FFEDD5',   // slightly deeper cream
  surface:       '#FFFFFF',
  textPrimary:   '#1C1917',
  textSecondary: '#78716C',
  accent:        '#F97316',   // orange — primary CTA color
  accentViolet:  '#8B5CF6',
  celebrate:     '#10B981',   // green — used in CelebrateWin
  border:        '#FED7AA',
}
fonts: {
  body:    'Noto Sans SC',    // all body/caption text
  display: 'Noto Serif SC',  // headlines (NOT ZCOOL KuaiLe — that was childish)
  numbers: 'Nunito',         // numeric displays
}
```

### Font loading — `src/fonts.ts` (CRITICAL)

`loadFont` must be called at module level for each font or it silently falls back to system font:

```ts
import {loadFont as loadNotoSansSC}  from '@remotion/google-fonts/NotoSansSC';
import {loadFont as loadNotoSerifSC} from '@remotion/google-fonts/NotoSerifSC';
import {loadFont as loadInter}       from '@remotion/google-fonts/Inter';
import {loadFont as loadSpaceMono}   from '@remotion/google-fonts/SpaceMono';
import {loadFont as loadNunito}      from '@remotion/google-fonts/Nunito';
// All 5 fonts must be called here — if you add a new font to any theme, register it here too
export const fonts = {notoSansSC, notoSerifSC, inter, spaceMono, nunito};
```

---

## Shared components

### `src/components/PersistentHeader.tsx`

Appears at top of every education shot. Short-video style only:

- 6px gradient accent line across very top (`accent → accentViolet`)
- Centered series title text, 30px, `textSecondary` color
- No brand marks, no navigation, no step indicators

```tsx
<PersistentHeader theme={theme} />  // uses SERIES_TITLE by default
<PersistentHeader theme={theme} label="自定义标题" />  // override label if needed
```

---

## Education scenes — current state

All 4 redesigned scenes share the same layout pattern:
1. `<PersistentHeader>` — series context
2. Visual anchor element (large number, quote mark, badge)
3. Hero text — `TYPE.hero` or `TYPE.title`, Noto Serif SC, centered
4. Supporting content (insight text / milestone progress / seal)
5. Caption card — anchored at `top: ZONES.contentBottom - 140` (= top 1100)

### `AiIntro.tsx` — Shot 1: Hook

Layout (all centered):
- `top=160` — title phrase before "3" (`TYPE.title`, `textPrimary`)
- `top=320` — giant "3" (`fontSize=520`, gradient `accent→accentViolet`, transparent text fill)
- `top=900` — label after "3" (`TYPE.title`, `textPrimary`)
- `top=1100` — caption card

Splits `shot.text` at the character `'3'` to extract before/after phrases.

### `ChallengeGame.tsx` — Shots 2, 4, 6: Milestones

Layout (all centered):
- `top=130` — orange pill badge: `第N个分水岭` (uses `shot.stepNumber`, 1–3)
- `top=220` — grade label (`TYPE.hero`, accent orange, Noto Serif SC) — extracted from `shot.text` before `'：'`
- `top=440` — insight text (`TYPE.subtitle`) with keyword highlight underline — extracted after `'：'`
- `top=700` — milestone progress card: 3 circles (88px) with connecting track, grade labels (30px)
- `top=1100` — caption card

Track line animates width with `timelineEnter`. Circle state: active = gradient fill, done = gradient fill, future = 40% opacity.

### `StoryMoment.tsx` — Shots 3, 5: Insight/Pull-quote

Layout (all centered):
- `top=160` — giant `"` quote mark (360px, orange, `lineHeight=0.65`)
- `top=480` — pull-quote title (92px, `textPrimary`, Noto Serif SC) with keyword underline highlight
- `top=980` — 80×4px orange accent bar
- `top=1100` — caption card

### `CelebrateWin.tsx` — Shot 7: Closing

Layout (all centered):
- Background: `linear-gradient(160deg, bg, bgDeep)` + optional Lottie confetti overlay (z=0)
- `top=220` — hero title (100px, `textPrimary`) with keyword highlight
- `top=700` — 3-checkmark seal: white card, 3 gradient circles (72px) each containing `✓`
- `top=900` — subtitle: `3 个分水岭，每一步都不掉队` (celebrate green)
- `top=1100` — caption card

---

## Animation utilities — `src/utils/springs.ts`

```ts
dramaticSlam(frame, fps)           // fast slam-in (enters at frame 0)
bouncyEnter(frame, fps)            // bouncy overshoot (enters at frame 0)
staggerSpring(frame, fps, index, gap=6)  // staggered, each index delays by `gap` frames
clamp                              // extrapolate clamp config for interpolate()
```

`staggerSpring(frame, fps, 0)` = immediate  
`staggerSpring(frame, fps, 1)` = ~6 frames delay  
`staggerSpring(frame, fps, 2)` = ~12 frames delay  
etc.

---

## Key file structure

```
src/
  design-tokens.ts              ← NEW: TYPE scale, ZONES, MILESTONES, SERIES_TITLE
  fonts.ts                      ← MODIFIED: added NotoSerifSC loading
  themes/
    theme-yaoning.ts            ← MODIFIED: display font = 'Noto Serif SC' (was ZCOOL KuaiLe)
  components/
    PersistentHeader.tsx        ← NEW: shared header for all education shots
  scenes/education/
    AiIntro.tsx                 ← REWRITTEN: no robot, giant "3" anchor, centered
    ChallengeGame.tsx           ← REWRITTEN: no robot, milestone circles 88px, centered
    StoryMoment.tsx             ← REWRITTEN: no robot, giant quote mark, centered
    CelebrateWin.tsx            ← REWRITTEN: no robot, 3-checkmark seal, centered
  data/
    script-xiaoxue-fenshui.ts  ← active 7-shot script for current video
    current-video.ts            ← imports and re-exports the active script
```

---

## Architecture rules

### ThemeCaption vs caption card
`ThemeCaption` (legacy) was the animated caption bar. The redesigned education scenes now render their own **inline caption card** using `theme.colors.surface` with a border, positioned at `top: ZONES.contentBottom - 140`. Do not add `ThemeCaption` back to these scenes — it would duplicate the caption.

### Type system
`OdinTheme` and `YaoningTheme` are separate types — never cast between them. Education scenes accept `YaoningTheme` only.

### `CalculateMetadataFunction`
Remotion v4.0.459 does NOT export a factory. Use as a type:
```ts
import type {CalculateMetadataFunction} from 'remotion';
export const calculateVideoMetadata: CalculateMetadataFunction<VideoProps> = async ({props}) => ({...});
```

### PNG assets
```tsx
import {Img, staticFile} from 'remotion';
<Img src={staticFile('assets/generated/doudou-robot.png')} />
```

---

## Scripts

```bash
npm run dev        # Start Remotion Studio on http://localhost:3001
npm run build      # Type-check + bundle
npx tsc --noEmit   # Type-check only
```

> ⚠️ `npm start` does NOT exist. Use `npm run dev`.

---

## Known gaps / next steps

- **Visual QA pending:** User has not confirmed the latest centered redesign looks correct in Remotion Studio. Priority next step: run `npm run dev`, view all 7 shots, confirm layout fills y=100–1240.
- **Other education scenes not redesigned:** `DemoWalk.tsx`, `BoundaryCard.tsx`, `QaFlip.tsx` still have the old layout (robot, left-aligned, no PersistentHeader). Redesign if these shots are ever used.
- **Odin track untouched:** All 7 knowledge scenes are unchanged and assumed working.
- **Lottie files:** `public/assets/lottie/` are placeholders. `fx-confetti-warm` is used in shot 7 (`CelebrateWin`) — if missing, the scene still renders (guarded by `lottieData &&`).
- **Cover scenes:** `YaoningCover.tsx` has not been visually reviewed.

---

## Fixed (2026-05-15)

- Font `ZCOOL KuaiLe` removed — childish/playful, wrong for parent-audience video
- `NotoSerifSC` added to `fonts.ts` `loadFont` calls (was missing — silently fell back to system font)
- Theme `display` font changed to `'Noto Serif SC'`
- All 4 education scenes: robots removed, content centered, App-style navigation removed
- `PersistentHeader` created — replaces ad-hoc header implementations across all scenes
- `design-tokens.ts` created — `TYPE`, `ZONES`, `MILESTONES`, `SERIES_TITLE` centralized
- `MILESTONES` added to `design-tokens.ts` exports (was only in PersistentHeader — caused build warning)
- Caption anchored to `ZONES.contentBottom - 140` so content spans into lower half of canvas
- Milestone circles enlarged: 72px → 88px; grade labels: 22px → 30px (legible on mobile)

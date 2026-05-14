# Design System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a 4-layer visual rendering system for two Remotion video tracks — Odin (knowledge-sharing) and 曜宁 (ai-education) — so any content JSON renders to a styled .mp4 with zero per-video visual decisions.

**Architecture:** Design tokens in theme files → asset catalog → 14 Remotion scene components (one per scene ID) → VideoComposition router that selects theme and maps scene IDs to components. Cover templates and ThemeCaption complete the visual layer; a script.txt generator outputs voiceover cues alongside the rendered MP4.

**Tech Stack:** Remotion 4.x, React 19, TypeScript, @remotion/lottie, @remotion/google-fonts, @remotion/transitions, tsx (script runner)

---

## File Structure

```
New files:
src/
  themes/
    theme-odin.ts          ← Odin design tokens
    theme-yaoning.ts       ← 曜宁 design tokens
    index.ts               ← selectTheme() + type exports
  data/
    types-v2.ts            ← KnowledgeScriptData / EducationScriptData
    current-video.ts       ← AI writes scripts here; VideoComposition imports this
  fonts.ts                 ← @remotion/google-fonts loaders
  utils/
    springs.ts             ← Named spring helpers
    assetCatalog.ts        ← Maps catalog IDs to imported Lottie JSON
  components/
    ThemeCaption.tsx       ← Theme-aware caption for new system
  scenes/
    knowledge/
      DataReveal.tsx
      StepList.tsx
      ConceptCard.tsx
      QuoteHero.tsx
      ComparisonSplit.tsx
      ChecklistReveal.tsx
      TimelineFlow.tsx
    education/
      AiIntro.tsx
      ChallengeGame.tsx
      StoryMoment.tsx
      DemoWalk.tsx
      BoundaryCard.tsx
      CelebrateWin.tsx
      QaFlip.tsx
  VideoComposition.tsx     ← Router: track → theme → scene → rendered shots
  covers/
    OdinCover.tsx
    YaoningCover.tsx
scripts/
  export-script.ts         ← Reads current-video.ts → writes script.txt
content-system/
  asset-library/
    catalog.md             ← Asset registry
public/
  assets/
    lottie/
      effects/             ← confetti-warm.json, star-burst.json
      icons/               ← check-draw.json, question-wobble.json
    characters/
      yaoning/             ← PNG fallbacks (manually generated)

Modified files:
src/Root.tsx               ← register VideoComposition, OdinCover, YaoningCover
package.json               ← add deps + render/export scripts
```

---

### Task 1: Install dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install Remotion packages**

```bash
cd "/Users/jiweiwang/Downloads/Code case/Remotion-Video"
npm install @remotion/lottie @remotion/google-fonts @remotion/transitions @remotion/light-leaks
npm install --save-dev tsx
```

- [ ] **Step 2: Verify installation**

```bash
node -e "require('@remotion/lottie'); require('@remotion/google-fonts'); console.log('OK')"
```

Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: add @remotion/lottie, google-fonts, transitions, light-leaks, tsx"
```

---

### Task 2: Theme files

**Files:**
- Create: `src/themes/theme-odin.ts`
- Create: `src/themes/theme-yaoning.ts`
- Create: `src/themes/index.ts`

- [ ] **Step 1: Write theme-odin.ts**

```ts
// src/themes/theme-odin.ts
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
    default: 'snappy-pop'  as const,
    hero:    'dramatic-slam' as const,
    list:    'smooth-reveal' as const,
    stagger: 6,
  },

  shotDurationFrames: 80,
};

export type OdinTheme = typeof themeOdin;
```

- [ ] **Step 2: Write theme-yaoning.ts**

```ts
// src/themes/theme-yaoning.ts
export const themeYaoning = {
  track: 'ai-education' as const,

  colors: {
    bg:           '#FDF6EC',
    bgDeep:       '#FFEDD5',
    surface:      '#FFFFFF',
    textPrimary:  '#1C1917',
    textSecondary:'#78716C',
    accent:       '#F97316',
    accentGreen:  '#86EFAC',
    accentViolet: '#8B5CF6',
    celebrate:    '#10B981',
    question:     '#6366F1',
    safetyBg:     '#1C1917',
    safetyAccent: '#F59E0B',
    border:       '#FED7AA',
  },

  fonts: {
    body:    'Noto Sans SC',
    display: 'ZCOOL KuaiLe',
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
```

- [ ] **Step 3: Write themes/index.ts**

```ts
// src/themes/index.ts
export {themeOdin}    from './theme-odin';
export {themeYaoning} from './theme-yaoning';
export type {OdinTheme}    from './theme-odin';
export type {YaoningTheme} from './theme-yaoning';

import {themeOdin}    from './theme-odin';
import {themeYaoning} from './theme-yaoning';

export type Theme = typeof themeOdin | typeof themeYaoning;

export function selectTheme(track: string): Theme {
  return track === 'knowledge-sharing' ? themeOdin : themeYaoning;
}
```

- [ ] **Step 4: Typecheck**

```bash
npx tsc --noEmit --project tsconfig.json 2>&1 | head -20
```

Expected: no errors in the three new theme files.

- [ ] **Step 5: Commit**

```bash
git add src/themes/
git commit -m "feat: add theme-odin, theme-yaoning, selectTheme"
```

---

### Task 3: TypeScript types (types-v2.ts + current-video.ts)

**Files:**
- Create: `src/data/types-v2.ts`
- Create: `src/data/current-video.ts`

- [ ] **Step 1: Write types-v2.ts**

```ts
// src/data/types-v2.ts
export type ColorScheme = 'dark' | 'light';

export type AnimationStyleId =
  | 'smooth-reveal'
  | 'snappy-pop'
  | 'bouncy-enter'
  | 'dramatic-slam'
  | 'heavy-settle';

export type CoverData = {
  title: string;
  subtitle: string;
  titleHighlight: string;
};

// ── Knowledge Sharing ─────────────────────────────────────────

export type KnowledgeContentType =
  | 'data-insight' | 'step-breakdown' | 'concept-explain'
  | 'quote-insight' | 'comparison' | 'checklist' | 'timeline';

export type KnowledgeSceneId =
  | 'data-reveal' | 'step-list' | 'concept-card'
  | 'quote-hero' | 'comparison-split' | 'checklist-reveal' | 'timeline-flow';

export type KnowledgeMotionPresetId =
  | 'stat-slam' | 'counter-tick' | 'list-stagger'
  | 'highlight-sweep' | 'split-slide' | 'check-draw' | 'dot-appear';

export type KnowledgeShotData = {
  text: string;
  keyword: string;
  caption: string;
  captionKeyword: string;
  scene: KnowledgeSceneId;
  motionPreset: KnowledgeMotionPresetId;
  animationStyle: AnimationStyleId;
  dataValue?: string;
  stepNumber?: number;
  listIndex?: number;
  timelineYear?: string;
  comparisonSide?: 'left' | 'right' | 'neutral';
  lottieId?: string;
  characterId?: string;
};

export type KnowledgeScriptData = {
  track: 'knowledge-sharing';
  contentType: KnowledgeContentType;
  title: string;
  subtitle: string;
  fps: 30;
  width: 1080;
  height: 1920;
  colorScheme: ColorScheme;
  accentColor: string;
  shotDurationFrames: number;
  cover: CoverData;
  shots: KnowledgeShotData[];
};

// ── AI Education ──────────────────────────────────────────────

export type EducationContentType =
  | 'ai-concept' | 'family-challenge' | 'story-scene'
  | 'usage-demo' | 'safety-rule' | 'achievement' | 'qa-reveal';

export type EducationSceneId =
  | 'ai-intro' | 'challenge-game' | 'story-moment'
  | 'demo-walk' | 'boundary-card' | 'celebrate-win' | 'qa-flip';

export type EducationMotionPresetId =
  | 'character-bounce' | 'bubble-pop' | 'star-burst'
  | 'question-wobble' | 'reveal-spring' | 'warning-pulse' | 'confetti-burst';

export type AgeTarget = '4-6' | '7-10' | '11-14';

export type EducationShotData = {
  text: string;
  keyword: string;
  caption: string;
  captionKeyword: string;
  scene: EducationSceneId;
  motionPreset: EducationMotionPresetId;
  animationStyle: AnimationStyleId;
  characterName?: string;
  stepNumber?: number;
  lottieId?: string;
  lottieUrl?: string;
  isQuestionShot?: boolean;
  isAnswerShot?: boolean;
};

export type EducationCoverData = CoverData & {
  characterName?: string;
};

export type EducationScriptData = {
  track: 'ai-education';
  contentType: EducationContentType;
  title: string;
  subtitle: string;
  fps: 30;
  width: 1080;
  height: 1920;
  colorScheme: ColorScheme;
  accentColor: string;
  ageTarget: AgeTarget;
  shotDurationFrames: number;
  cover: EducationCoverData;
  shots: EducationShotData[];
};

export type ScriptDataV2 = KnowledgeScriptData | EducationScriptData;
```

- [ ] **Step 2: Write current-video.ts placeholder**

```ts
// src/data/current-video.ts
// AI agents: write your generated script to this file.
// Replace this placeholder with a real KnowledgeScriptData or EducationScriptData.
import type {KnowledgeScriptData} from './types-v2';

export const script: KnowledgeScriptData = {
  track: 'knowledge-sharing',
  contentType: 'data-insight',
  title: '占位视频',
  subtitle: '请替换为真实脚本',
  fps: 30,
  width: 1080,
  height: 1920,
  colorScheme: 'dark',
  accentColor: '#E85D04',
  shotDurationFrames: 80,
  cover: {title: '占位', subtitle: '请替换', titleHighlight: '占位'},
  shots: [
    {
      text: '请替换为真实内容',
      keyword: '真实',
      caption: '这是占位脚本，请用 AI 生成真实内容',
      captionKeyword: '占位脚本',
      scene: 'data-reveal',
      motionPreset: 'stat-slam',
      animationStyle: 'dramatic-slam',
      dataValue: '100%',
    },
  ],
};
```

- [ ] **Step 3: Typecheck**

```bash
npx tsc --noEmit 2>&1 | grep "types-v2\|current-video" | head -10
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/data/types-v2.ts src/data/current-video.ts
git commit -m "feat: add types-v2 (KnowledgeScriptData / EducationScriptData) and current-video placeholder"
```

---

### Task 4: Font loader

**Files:**
- Create: `src/fonts.ts`

- [ ] **Step 1: Write fonts.ts**

```ts
// src/fonts.ts
// Call loadFont at module level — Remotion registers fonts on import.
import {loadFont as loadNotoSansSC} from '@remotion/google-fonts/NotoSansSC';
import {loadFont as loadInter}      from '@remotion/google-fonts/Inter';
import {loadFont as loadSpaceMono}  from '@remotion/google-fonts/SpaceMono';
import {loadFont as loadNunito}     from '@remotion/google-fonts/Nunito';

// Note: ZCOOL KuaiLe import path — verify the exact folder name with:
// ls node_modules/@remotion/google-fonts/ | grep -i zcool
import {loadFont as loadZCOOL} from '@remotion/google-fonts/ZcoolKuaile';

const {fontFamily: notoSansSC} = loadNotoSansSC('normal', {
  weights: ['400', '700', '900'],
  subsets: ['chinese-simplified'],
});

const {fontFamily: inter}      = loadInter('normal',     {weights: ['400', '700', '900']});
const {fontFamily: spaceMono}  = loadSpaceMono('normal', {weights: ['400', '700']});
const {fontFamily: nunito}     = loadNunito('normal',    {weights: ['400', '700', '900']});
const {fontFamily: zcoolKuaiLe} = loadZCOOL('normal',   {weights: ['400']});

export const fonts = {notoSansSC, inter, spaceMono, nunito, zcoolKuaiLe};
```

- [ ] **Step 2: Find the correct ZCOOL KuaiLe import name**

```bash
ls "node_modules/@remotion/google-fonts/" | grep -i zcool
```

If the result is `ZcoolKuaile`, the import is correct. If different (e.g., `ZCOOLKuaiLe`), update the import in `src/fonts.ts` accordingly.

- [ ] **Step 3: Import fonts in Root.tsx so they load at startup**

Open `src/Root.tsx` and add this line after the existing imports:

```ts
import './fonts';
```

- [ ] **Step 4: Typecheck**

```bash
npx tsc --noEmit 2>&1 | grep "fonts" | head -10
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/fonts.ts src/Root.tsx
git commit -m "feat: load Noto Sans SC, Inter, Space Mono, ZCOOL KuaiLe, Nunito via @remotion/google-fonts"
```

---

### Task 5: Shared utilities

**Files:**
- Create: `src/utils/springs.ts`
- Create: `src/utils/assetCatalog.ts`
- Create: `src/utils/text.ts`

- [ ] **Step 1: Write springs.ts**

```ts
// src/utils/springs.ts
import {Easing, interpolate, spring} from 'remotion';

export const clamp = {
  extrapolateLeft:  'clamp' as const,
  extrapolateRight: 'clamp' as const,
};

export const smoothReveal  = (f: number, fps: number) => spring({frame: f, fps, config: {damping: 200}});
export const snappyPop     = (f: number, fps: number) => spring({frame: f, fps, config: {damping: 20,  stiffness: 200}});
export const bouncyEnter   = (f: number, fps: number) => spring({frame: f, fps, config: {damping: 8}});
export const dramaticSlam  = (f: number, fps: number) => spring({frame: f, fps, config: {damping: 12, stiffness: 300}});
export const heavySettle   = (f: number, fps: number) => spring({frame: f, fps, config: {mass: 2, damping: 15, stiffness: 80}});

/** Stagger: delays each item by gap frames. Use with clamp to avoid negative-frame artifacts. */
export const staggerSpring = (f: number, fps: number, index: number, gap = 6) =>
  spring({frame: Math.max(0, f - index * gap), fps, config: {damping: 200}});

/** Entry+exit opacity for caption-style elements. Returns 0→1→0. */
export const entryExit = (f: number, fps: number, duration: number): number => {
  const enter = spring({frame: f,   fps, config: {damping: 200}});
  const exit  = spring({frame: f,   fps, config: {damping: 200},
    delay: duration - Math.round(fps * 0.6)});
  return Math.min(Math.max(0, enter - exit), 1);
};

/** Counter tick: animates a numeric value from 0 to `target` over 45 frames. */
export const counterTick = (f: number, target: number): number => {
  const progress = interpolate(f, [0, 45], [0, 1], {
    easing: Easing.out(Easing.exp),
    ...clamp,
  });
  return Math.round(target * progress);
};
```

- [ ] **Step 2: Write text.ts**

```ts
// src/utils/text.ts
export const splitKeyword = (text: string, keyword: string) => {
  const i = text.indexOf(keyword);
  if (i < 0) return {before: text, keyword: '', after: ''};
  return {before: text.slice(0, i), keyword, after: text.slice(i + keyword.length)};
};

/** Parse strings like "78%", "3x", "2.5M" into a number and suffix. */
export const parseDataValue = (raw: string): {number: number; suffix: string} => {
  const m = raw.match(/^(\d+(?:\.\d+)?)(.*)$/);
  if (!m) return {number: 0, suffix: raw};
  return {number: parseFloat(m[1]), suffix: m[2]};
};
```

- [ ] **Step 3: Write assetCatalog.ts**

This file maps catalog IDs to imported Lottie JSON. Start with empty maps — they will be populated in Task 6 once the JSON files are downloaded.

```ts
// src/utils/assetCatalog.ts
// Maps catalog IDs (from content-system/asset-library/catalog.md) to local Lottie JSON.
// Add entries here after downloading assets to public/assets/lottie/.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LottieData = Record<string, any>;

// Populated in Task 6 — import each downloaded JSON here.
export const LOTTIE_CATALOG: Record<string, LottieData> = {
  // 'fx-confetti-warm': confettiWarm,  ← uncomment after Task 6
};

export const CHARACTER_CATALOG: Record<string, string> = {
  // 'char-png-child-curious': '/assets/characters/yaoning/child-curious.png',
};

export function getLottie(id: string): LottieData | null {
  return LOTTIE_CATALOG[id] ?? null;
}
```

- [ ] **Step 4: Typecheck**

```bash
npx tsc --noEmit 2>&1 | grep "utils/" | head -10
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/utils/
git commit -m "feat: add springs, text, assetCatalog utilities"
```

---

### Task 6: Asset library — seed Lottie files

**Files:**
- Create: `content-system/asset-library/catalog.md`
- Create: `public/assets/lottie/effects/confetti-warm.json`
- Create: `public/assets/lottie/effects/star-burst.json`
- Create: `public/assets/lottie/icons/check-draw.json`
- Create: `public/assets/lottie/icons/question-wobble.json`
- Update: `src/utils/assetCatalog.ts`

- [ ] **Step 1: Create directory structure**

```bash
mkdir -p "/Users/jiweiwang/Downloads/Code case/Remotion-Video/public/assets/lottie/effects"
mkdir -p "/Users/jiweiwang/Downloads/Code case/Remotion-Video/public/assets/lottie/icons"
mkdir -p "/Users/jiweiwang/Downloads/Code case/Remotion-Video/public/assets/lottie/characters"
mkdir -p "/Users/jiweiwang/Downloads/Code case/Remotion-Video/public/assets/characters/yaoning"
```

- [ ] **Step 2: Download seed Lottie files**

Search LottieFiles (lottiefiles.com) for free animations. Download each to the correct path:

| Search term | Target path |
|---|---|
| `"confetti celebration transparent"` | `public/assets/lottie/effects/confetti-warm.json` |
| `"star burst particles"` | `public/assets/lottie/effects/star-burst.json` |
| `"checkmark draw success"` | `public/assets/lottie/icons/check-draw.json` |
| `"question mark wobble"` | `public/assets/lottie/icons/question-wobble.json` |

For each: click the animation → "Download" → "Lottie JSON" → save to the path above.

Alternatively, use the LottieFiles public CDN. Example:
```bash
# Confetti — replace URL with actual free animation from LottieFiles
curl -L "https://lottie.host/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/XXXXXX.json" \
  -o "public/assets/lottie/effects/confetti-warm.json"
```

- [ ] **Step 3: Verify JSON files are valid**

```bash
for f in public/assets/lottie/**/*.json; do
  node -e "JSON.parse(require('fs').readFileSync('$f','utf8')); console.log('OK: $f')"
done
```

Expected: `OK: ...` for each file.

- [ ] **Step 4: Wire downloaded files into assetCatalog.ts**

For each downloaded JSON, add an import and catalog entry. Example for the four seed files:

```ts
// src/utils/assetCatalog.ts
import confettiWarm    from '../../public/assets/lottie/effects/confetti-warm.json';
import starBurst       from '../../public/assets/lottie/effects/star-burst.json';
import checkDraw       from '../../public/assets/lottie/icons/check-draw.json';
import questionWobble  from '../../public/assets/lottie/icons/question-wobble.json';

type LottieData = Record<string, any>;

export const LOTTIE_CATALOG: Record<string, LottieData> = {
  'fx-confetti-warm':     confettiWarm,
  'fx-star-burst':        starBurst,
  'icon-check-draw':      checkDraw,
  'icon-question-wobble': questionWobble,
};

export const CHARACTER_CATALOG: Record<string, string> = {};

export function getLottie(id: string): LottieData | null {
  return LOTTIE_CATALOG[id] ?? null;
}
```

Also add `"resolveJsonModule": true` to `tsconfig.json` if it is not already present, so TypeScript allows JSON imports.

- [ ] **Step 5: Write catalog.md**

```markdown
<!-- content-system/asset-library/catalog.md -->
# Asset Catalog

Single source of truth for reusable assets. AI agents: check here before searching the web.
Add rows here after downloading new assets.

## Lottie — Effects

| ID | File | Tags | Source |
|----|------|------|--------|
| `fx-confetti-warm` | lottie/effects/confetti-warm.json | 庆祝, 撒花, 暖色 | lottiefiles.com |
| `fx-star-burst` | lottie/effects/star-burst.json | 星星, 爆炸, 奖励 | lottiefiles.com |

## Lottie — Icons

| ID | File | Tags | Source |
|----|------|------|--------|
| `icon-check-draw` | lottie/icons/check-draw.json | 打勾, 清单, 完成 | lottiefiles.com |
| `icon-question-wobble` | lottie/icons/question-wobble.json | 问号, 疑问 | lottiefiles.com |

## Lottie — Characters

| ID | File | Tags | Source |
|----|------|------|--------|
| _(empty — add when downloaded)_ | | | |

## Character PNG — 曜宁

| ID | File | Tags |
|----|------|------|
| _(empty — add when AI-generated)_ | | |

## How to add a new asset

1. Search LottieFiles or generate PNG
2. Save to `public/assets/lottie/<category>/` or `public/assets/characters/yaoning/`
3. Import in `src/utils/assetCatalog.ts` and add to the map
4. Add a row to this table
```

- [ ] **Step 6: Typecheck**

```bash
npx tsc --noEmit 2>&1 | grep "assetCatalog" | head -10
```

Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add public/assets/ content-system/asset-library/ src/utils/assetCatalog.ts
git commit -m "feat: seed asset library with 4 Lottie files + catalog.md"
```

---

### Task 7: ThemeCaption component

**Files:**
- Create: `src/components/ThemeCaption.tsx`

- [ ] **Step 1: Write ThemeCaption.tsx**

```tsx
// src/components/ThemeCaption.tsx
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {KnowledgeShotData, EducationShotData} from '../data/types-v2';
import type {OdinTheme, YaoningTheme} from '../themes';
import {splitKeyword} from '../utils/text';

type AnyShot = KnowledgeShotData | EducationShotData;
type Theme   = OdinTheme | YaoningTheme;

export const ThemeCaption: React.FC<{shot: AnyShot; shotDuration: number; theme: Theme}> = ({
  shot, shotDuration, theme,
}) => {
  const frame = useCurrentFrame();
  const {fps}  = useVideoConfig();

  const isOdin = theme.track === 'knowledge-sharing';
  const springCfg = isOdin
    ? {damping: 20, stiffness: 200}   // snappy-pop
    : {damping: 8};                    // bouncy-enter

  const enter = spring({frame, fps, config: springCfg});
  const exit  = spring({frame, fps, config: {damping: 200},
    delay: shotDuration - Math.round(fps * 0.6)});
  const opacity    = Math.min(Math.max(0, enter - exit), 1);
  const translateY = (1 - enter) * 28;

  const t   = theme as OdinTheme & YaoningTheme;       // union — pick from whichever key exists
  const textColor   = t.colors.textPrimary;
  const accentColor = t.colors.accent;
  const bgColor     = t.colors.surface;
  const borderColor = t.colors.border;

  const textParts    = splitKeyword(shot.text,    shot.keyword);
  const captionParts = splitKeyword(shot.caption, shot.captionKeyword);

  return (
    <>
      {/* Hero text — top third */}
      <div
        style={{
          position:   'absolute',
          left:       72,
          right:      72,
          top:        160,
          textAlign:  'center',
          fontSize:   60,
          lineHeight: 1.12,
          fontWeight: 900,
          color:      textColor,
          fontFamily: theme.fonts.body,
        }}
      >
        {textParts.before}
        <span style={{position: 'relative', color: accentColor, display: 'inline-block'}}>
          {textParts.keyword}
          <span
            style={{
              position:     'absolute',
              left:         0,
              right:        0,
              bottom:       -7,
              height:       7,
              borderRadius: 999,
              background:   accentColor,
              opacity:      0.35,
            }}
          />
        </span>
        {textParts.after}
      </div>

      {/* Caption card — bottom */}
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
```

- [ ] **Step 2: Typecheck**

```bash
npx tsc --noEmit 2>&1 | grep "ThemeCaption" | head -10
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/ThemeCaption.tsx
git commit -m "feat: add ThemeCaption — theme-aware caption for both tracks"
```

---

### Task 8: DataReveal scene

**Files:**
- Create: `src/scenes/knowledge/DataReveal.tsx`

- [ ] **Step 1: Write DataReveal.tsx**

```tsx
// src/scenes/knowledge/DataReveal.tsx
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import type {KnowledgeShotData} from '../../data/types-v2';
import type {OdinTheme} from '../../themes';
import {ThemeCaption} from '../../components/ThemeCaption';
import {clamp, counterTick, dramaticSlam} from '../../utils/springs';
import {parseDataValue, splitKeyword} from '../../utils/text';
import {interpolate} from 'remotion';

export const DataReveal: React.FC<{shot: KnowledgeShotData; theme: OdinTheme; shotDuration: number}> = ({
  shot, theme, shotDuration,
}) => {
  const frame = useCurrentFrame();
  const {fps}  = useVideoConfig();

  // stat-slam: scale from 0.6 → 1 (overshoots ~1.06, then settles)
  const slam      = dramaticSlam(frame, fps);
  const heroScale = interpolate(slam, [0, 1], [0.6, 1], clamp);

  // counter-tick: count up to dataValue target over 45 frames
  const {number, suffix} = shot.dataValue ? parseDataValue(shot.dataValue) : {number: 0, suffix: ''};
  const displayNum = counterTick(frame, number);

  // context text fades in 12 frames after hero
  const contextEnter = dramaticSlam(Math.max(0, frame - 12), fps);
  const parts        = splitKeyword(shot.text, shot.keyword);

  return (
    <AbsoluteFill style={{background: theme.colors.bgDark}}>
      <div
        style={{
          position:        'absolute',
          inset:           0,
          display:         'flex',
          alignItems:      'center',
          justifyContent:  'center',
          flexDirection:   'column',
          transform:       `scale(${heroScale})`,
        }}
      >
        {/* Hero number */}
        <div
          style={{
            fontSize:   180,
            fontWeight: 900,
            color:      theme.colors.accent,
            fontFamily: theme.fonts.mono,
            lineHeight: 1,
          }}
        >
          {shot.dataValue ? `${displayNum}${suffix}` : shot.keyword}
        </div>

        {/* Context line */}
        <div
          style={{
            opacity:    contextEnter,
            transform:  `translateY(${(1 - contextEnter) * 16}px)`,
            fontSize:   52,
            color:      theme.colors.textPrimary,
            fontFamily: theme.fonts.body,
            marginTop:  40,
            textAlign:  'center',
            padding:    '0 88px',
          }}
        >
          {parts.before}
          <span style={{color: theme.colors.accent}}>{parts.keyword}</span>
          {parts.after}
        </div>
      </div>

      <ThemeCaption shot={shot} shotDuration={shotDuration} theme={theme} />
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Typecheck**

```bash
npx tsc --noEmit 2>&1 | grep "DataReveal" | head -5
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/scenes/knowledge/DataReveal.tsx
git commit -m "feat: add DataReveal scene (stat-slam + counter-tick)"
```

---

### Task 9: StepList scene

**Files:**
- Create: `src/scenes/knowledge/StepList.tsx`

- [ ] **Step 1: Write StepList.tsx**

```tsx
// src/scenes/knowledge/StepList.tsx
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import type {KnowledgeShotData} from '../../data/types-v2';
import type {OdinTheme} from '../../themes';
import {ThemeCaption} from '../../components/ThemeCaption';
import {clamp, staggerSpring} from '../../utils/springs';

export const StepList: React.FC<{shot: KnowledgeShotData; theme: OdinTheme; shotDuration: number}> = ({
  shot, theme, shotDuration,
}) => {
  const frame  = useCurrentFrame();
  const {fps}  = useVideoConfig();

  const stepNum = shot.stepNumber ?? 1;

  // Each item staggered by 6 frames (list-stagger preset)
  const stepEnter  = staggerSpring(frame, fps, 0);
  const titleEnter = staggerSpring(frame, fps, 1);

  return (
    <AbsoluteFill style={{background: '#F8FAFC'}}>
      {/* Step number — large, top-left */}
      <div
        style={{
          position:   'absolute',
          left:       88,
          top:        200,
          fontSize:   140,
          fontWeight: 900,
          color:      theme.colors.accent,
          fontFamily: theme.fonts.mono,
          lineHeight: 1,
          opacity:    stepEnter,
          transform:  `translateY(${(1 - stepEnter) * 20}px)`,
        }}
      >
        {String(stepNum).padStart(2, '0')}
      </div>

      {/* Divider line */}
      <div
        style={{
          position:   'absolute',
          left:       88,
          top:        360,
          width:      interpolate(stepEnter, [0, 1], [0, 300], clamp),
          height:     4,
          background: theme.colors.accent,
          borderRadius: 999,
        }}
      />

      {/* Step title */}
      <div
        style={{
          position:   'absolute',
          left:       88,
          right:      88,
          top:        400,
          fontSize:   68,
          fontWeight: 900,
          color:      '#0F172A',
          fontFamily: theme.fonts.body,
          lineHeight: 1.2,
          opacity:    titleEnter,
          transform:  `translateY(${(1 - titleEnter) * 20}px)`,
        }}
      >
        {shot.text}
      </div>

      {/* Progress dots at top */}
      <div
        style={{
          position:  'absolute',
          top:       80,
          left:      88,
          display:   'flex',
          gap:       12,
        }}
      >
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            style={{
              width:        n === stepNum ? 36 : 12,
              height:       12,
              borderRadius: 999,
              background:   n === stepNum ? theme.colors.accent : theme.colors.border,
              transition:   'none',
            }}
          />
        ))}
      </div>

      <ThemeCaption shot={shot} shotDuration={shotDuration} theme={theme} />
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Typecheck + commit**

```bash
npx tsc --noEmit 2>&1 | grep "StepList" | head -5
git add src/scenes/knowledge/StepList.tsx
git commit -m "feat: add StepList scene (list-stagger)"
```

---

### Task 10: ConceptCard scene

**Files:**
- Create: `src/scenes/knowledge/ConceptCard.tsx`

- [ ] **Step 1: Write ConceptCard.tsx**

```tsx
// src/scenes/knowledge/ConceptCard.tsx
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import type {KnowledgeShotData} from '../../data/types-v2';
import type {OdinTheme} from '../../themes';
import {ThemeCaption} from '../../components/ThemeCaption';
import {clamp, smoothReveal} from '../../utils/springs';
import {splitKeyword} from '../../utils/text';

export const ConceptCard: React.FC<{shot: KnowledgeShotData; theme: OdinTheme; shotDuration: number}> = ({
  shot, theme, shotDuration,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Card scales up from 0.92 (smooth-reveal)
  const reveal = smoothReveal(frame, fps);
  const scale  = interpolate(reveal, [0, 1], [0.92, 1], clamp);
  const opacity = reveal;

  // Underline sweeps left-to-right (highlight-sweep: 20 frames)
  const sweepWidth = interpolate(frame, [8, 28], [0, 100], {
    easing: (t) => t * (2 - t), // ease-out-quad
    ...clamp,
  });

  const parts = splitKeyword(shot.text, shot.keyword);

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(160deg, #1E1B4B 0%, #312E81 100%)',
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      {/* Concept term */}
      <div
        style={{
          position:   'absolute',
          left:       88,
          right:      88,
          top:        260,
          fontSize:   72,
          fontWeight: 900,
          color:      '#F1F5F9',
          fontFamily: theme.fonts.body,
          lineHeight: 1.2,
        }}
      >
        {parts.before}
        <span style={{position: 'relative', color: theme.colors.accentAlt, display: 'inline'}}>
          {parts.keyword}
          {/* highlight-sweep underline */}
          <span
            style={{
              position:         'absolute',
              left:             0,
              bottom:           -10,
              width:            `${sweepWidth}%`,
              height:           8,
              borderRadius:     999,
              background:       theme.colors.accentAlt,
              opacity:          0.7,
            }}
          />
        </span>
        {parts.after}
      </div>

      {/* Accent bar */}
      <div
        style={{
          position:     'absolute',
          left:         88,
          top:          220,
          width:        60,
          height:       6,
          borderRadius: 999,
          background:   theme.colors.accent,
        }}
      />

      <ThemeCaption shot={shot} shotDuration={shotDuration} theme={theme} />
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Typecheck + commit**

```bash
npx tsc --noEmit 2>&1 | grep "ConceptCard" | head -5
git add src/scenes/knowledge/ConceptCard.tsx
git commit -m "feat: add ConceptCard scene (highlight-sweep)"
```

---

### Task 11: QuoteHero scene

**Files:**
- Create: `src/scenes/knowledge/QuoteHero.tsx`

- [ ] **Step 1: Write QuoteHero.tsx**

```tsx
// src/scenes/knowledge/QuoteHero.tsx
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import type {KnowledgeShotData} from '../../data/types-v2';
import type {OdinTheme} from '../../themes';
import {ThemeCaption} from '../../components/ThemeCaption';
import {clamp, dramaticSlam} from '../../utils/springs';
import {splitKeyword} from '../../utils/text';

export const QuoteHero: React.FC<{shot: KnowledgeShotData; theme: OdinTheme; shotDuration: number; accentColor?: string}> = ({
  shot, theme, shotDuration, accentColor,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // dramatic-slam: scale from 0.6, overshoots ~1.06, settles at 1.0
  const slam  = dramaticSlam(frame, fps);
  const scale = interpolate(slam, [0, 1], [0.6, 1], clamp);

  const bg      = accentColor ?? theme.colors.bgDark;
  const quoteColor = '#F1F5F9';
  const parts   = splitKeyword(shot.text, shot.keyword);

  return (
    <AbsoluteFill style={{background: bg}}>
      {/* Decorative opening quote mark */}
      <div
        style={{
          position:   'absolute',
          left:       72,
          top:        200,
          fontSize:   200,
          fontWeight: 900,
          color:      theme.colors.accent,
          opacity:    0.25,
          lineHeight: 1,
          fontFamily: theme.fonts.display,
        }}
      >
        "
      </div>

      {/* Quote text */}
      <div
        style={{
          position:   'absolute',
          left:       88,
          right:      88,
          top:        '50%',
          transform:  `translateY(-50%) scale(${scale})`,
          fontSize:   80,
          fontWeight: 900,
          lineHeight: 1.25,
          color:      quoteColor,
          fontFamily: theme.fonts.body,
          textAlign:  'center',
        }}
      >
        {parts.before}
        <span style={{color: theme.colors.accent}}>{parts.keyword}</span>
        {parts.after}
      </div>

      <ThemeCaption shot={shot} shotDuration={shotDuration} theme={theme} />
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Typecheck + commit**

```bash
npx tsc --noEmit 2>&1 | grep "QuoteHero" | head -5
git add src/scenes/knowledge/QuoteHero.tsx
git commit -m "feat: add QuoteHero scene (dramatic-slam)"
```

---

### Task 12: ComparisonSplit scene

**Files:**
- Create: `src/scenes/knowledge/ComparisonSplit.tsx`

- [ ] **Step 1: Write ComparisonSplit.tsx**

```tsx
// src/scenes/knowledge/ComparisonSplit.tsx
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import type {KnowledgeShotData} from '../../data/types-v2';
import type {OdinTheme} from '../../themes';
import {ThemeCaption} from '../../components/ThemeCaption';
import {clamp, snappyPop} from '../../utils/springs';
import {splitKeyword} from '../../utils/text';

export const ComparisonSplit: React.FC<{shot: KnowledgeShotData; theme: OdinTheme; shotDuration: number}> = ({
  shot, theme, shotDuration,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // split-slide: both panels slide from their edges simultaneously
  const slide = snappyPop(frame, fps);
  const leftX  = interpolate(slide, [0, 1], [-540, 0], clamp);
  const rightX = interpolate(slide, [0, 1], [540, 0],  clamp);

  const side  = shot.comparisonSide ?? 'neutral';
  const parts = splitKeyword(shot.text, shot.keyword);

  // Neutral shows both panels; left/right highlights one side
  const leftActive  = side === 'left'  || side === 'neutral';
  const rightActive = side === 'right' || side === 'neutral';

  return (
    <AbsoluteFill style={{background: theme.colors.bgDark}}>
      {/* Left panel */}
      <div
        style={{
          position:   'absolute',
          left:       0,
          top:        0,
          width:      530,
          height:     1920,
          background: '#1E293B',
          transform:  `translateX(${leftX}px)`,
          display:    'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          padding:    '0 44px',
          opacity:    leftActive ? 1 : 0.4,
        }}
      >
        <div style={{fontSize: 36, color: theme.colors.textSecondary, fontFamily: theme.fonts.body, marginBottom: 20}}>方案 A</div>
        {side === 'left' ? (
          <div style={{fontSize: 56, fontWeight: 900, color: '#F1F5F9', fontFamily: theme.fonts.body, textAlign: 'center', lineHeight: 1.25}}>
            {parts.before}
            <span style={{color: theme.colors.accent}}>{parts.keyword}</span>
            {parts.after}
          </div>
        ) : (
          <div style={{fontSize: 52, fontWeight: 700, color: theme.colors.textSecondary, fontFamily: theme.fonts.body, textAlign: 'center'}}>{shot.keyword}</div>
        )}
      </div>

      {/* Divider */}
      <div style={{position: 'absolute', left: 533, top: 0, width: 4, height: 1920, background: theme.colors.accent, opacity: 0.6}} />

      {/* Right panel */}
      <div
        style={{
          position:   'absolute',
          right:      0,
          top:        0,
          width:      543,
          height:     1920,
          background: '#0F172A',
          transform:  `translateX(${rightX}px)`,
          display:    'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          padding:    '0 44px',
          opacity:    rightActive ? 1 : 0.4,
        }}
      >
        <div style={{fontSize: 36, color: theme.colors.textSecondary, fontFamily: theme.fonts.body, marginBottom: 20}}>方案 B</div>
        {side === 'right' ? (
          <div style={{fontSize: 56, fontWeight: 900, color: '#F1F5F9', fontFamily: theme.fonts.body, textAlign: 'center', lineHeight: 1.25}}>
            {parts.before}
            <span style={{color: theme.colors.success}}>{parts.keyword}</span>
            {parts.after}
          </div>
        ) : (
          <div style={{fontSize: 52, fontWeight: 700, color: theme.colors.textSecondary, fontFamily: theme.fonts.body, textAlign: 'center'}}>{shot.text}</div>
        )}
      </div>

      <ThemeCaption shot={shot} shotDuration={shotDuration} theme={theme} />
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Typecheck + commit**

```bash
npx tsc --noEmit 2>&1 | grep "ComparisonSplit" | head -5
git add src/scenes/knowledge/ComparisonSplit.tsx
git commit -m "feat: add ComparisonSplit scene (split-slide)"
```

---

### Task 13: ChecklistReveal scene

**Files:**
- Create: `src/scenes/knowledge/ChecklistReveal.tsx`

- [ ] **Step 1: Write ChecklistReveal.tsx**

```tsx
// src/scenes/knowledge/ChecklistReveal.tsx
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import type {KnowledgeShotData} from '../../data/types-v2';
import type {OdinTheme} from '../../themes';
import {ThemeCaption} from '../../components/ThemeCaption';
import {clamp, staggerSpring} from '../../utils/springs';
import {splitKeyword} from '../../utils/text';

export const ChecklistReveal: React.FC<{shot: KnowledgeShotData; theme: OdinTheme; shotDuration: number}> = ({
  shot, theme, shotDuration,
}) => {
  const frame  = useCurrentFrame();
  const {fps}  = useVideoConfig();

  const idx   = (shot.listIndex ?? 1) - 1;

  // list-stagger: item slides up from 20px below
  const enter    = staggerSpring(frame, fps, 0);
  const opacity  = enter;
  const translateY = (1 - enter) * 20;

  // check-draw: SVG stroke animates over 18 frames starting at frame 8
  const checkProgress = interpolate(frame, [8, 26], [0, 100], {
    easing: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t, // ease-in-out-quad
    ...clamp,
  });

  const parts = splitKeyword(shot.text, shot.keyword);

  return (
    <AbsoluteFill style={{background: '#F8FAFC'}}>
      {/* Dot grid background */}
      <div
        style={{
          position:   'absolute',
          inset:      0,
          backgroundImage: 'radial-gradient(circle, #CBD5E1 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          opacity:    0.4,
        }}
      />

      {/* Item number badge */}
      <div
        style={{
          position:     'absolute',
          left:         88,
          top:          340,
          width:        72,
          height:       72,
          borderRadius: 999,
          background:   theme.colors.accent,
          display:      'flex',
          alignItems:   'center',
          justifyContent: 'center',
          fontSize:     36,
          fontWeight:   900,
          color:        '#fff',
          fontFamily:   theme.fonts.mono,
          opacity,
          transform:    `translateY(${translateY}px)`,
        }}
      >
        {idx + 1}
      </div>

      {/* Item text */}
      <div
        style={{
          position:   'absolute',
          left:       188,
          right:      88,
          top:        348,
          fontSize:   60,
          fontWeight: 900,
          color:      '#0F172A',
          fontFamily: theme.fonts.body,
          lineHeight: 1.2,
          opacity,
          transform:  `translateY(${translateY}px)`,
        }}
      >
        {parts.before}
        <span style={{color: theme.colors.accent}}>{parts.keyword}</span>
        {parts.after}
      </div>

      {/* Animated checkmark SVG */}
      <svg
        style={{position: 'absolute', left: 88, top: 460, width: 72, height: 72, opacity}}
        viewBox="0 0 72 72"
      >
        <circle cx="36" cy="36" r="32" fill="none" stroke="#E2E8F0" strokeWidth="4" />
        <circle
          cx="36" cy="36" r="32"
          fill="none"
          stroke={theme.colors.success}
          strokeWidth="4"
          strokeDasharray="201"
          strokeDashoffset={201 - (201 * checkProgress) / 100}
          strokeLinecap="round"
          transform="rotate(-90 36 36)"
        />
        <polyline
          points="22,36 31,45 50,27"
          fill="none"
          stroke={theme.colors.success}
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={checkProgress > 60 ? (checkProgress - 60) / 40 : 0}
        />
      </svg>

      <ThemeCaption shot={shot} shotDuration={shotDuration} theme={theme} />
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Typecheck + commit**

```bash
npx tsc --noEmit 2>&1 | grep "ChecklistReveal" | head -5
git add src/scenes/knowledge/ChecklistReveal.tsx
git commit -m "feat: add ChecklistReveal scene (list-stagger + check-draw SVG)"
```

---

### Task 14: TimelineFlow scene

**Files:**
- Create: `src/scenes/knowledge/TimelineFlow.tsx`

- [ ] **Step 1: Write TimelineFlow.tsx**

```tsx
// src/scenes/knowledge/TimelineFlow.tsx
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {KnowledgeShotData} from '../../data/types-v2';
import type {OdinTheme} from '../../themes';
import {ThemeCaption} from '../../components/ThemeCaption';
import {clamp, smoothReveal} from '../../utils/springs';

export const TimelineFlow: React.FC<{shot: KnowledgeShotData; theme: OdinTheme; shotDuration: number}> = ({
  shot, theme, shotDuration,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // dot-appear: dot scales 0 → 1.12 → 1.0
  const dotSpring = spring({frame, fps, config: {damping: 200}});
  const dotScale  = interpolate(dotSpring, [0, 1], [0, 1.12], clamp);

  // label fades up
  const labelEnter = smoothReveal(Math.max(0, frame - 8), fps);

  // pulse: dot opacity pulses gently
  const pulse = 0.7 + 0.3 * Math.sin(frame * 0.18);

  const year = shot.timelineYear ?? '';

  return (
    <AbsoluteFill style={{background: theme.colors.bgDark}}>
      {/* Horizontal axis line */}
      <div
        style={{
          position:     'absolute',
          left:         88,
          right:        88,
          top:          880,
          height:       3,
          background:   theme.colors.border,
          borderRadius: 999,
        }}
      />

      {/* Active dot */}
      <div
        style={{
          position:     'absolute',
          left:         '50%',
          top:          880,
          width:        48,
          height:       48,
          borderRadius: 999,
          background:   theme.colors.accent,
          transform:    `translate(-50%, -50%) scale(${dotScale})`,
          boxShadow:    `0 0 ${24 * pulse}px ${theme.colors.accent}`,
          opacity:      pulse,
        }}
      />

      {/* Year label */}
      <div
        style={{
          position:   'absolute',
          left:       '50%',
          top:        930,
          transform:  `translateX(-50%) translateY(${(1 - labelEnter) * 8}px)`,
          opacity:    labelEnter,
          fontSize:   56,
          fontWeight: 900,
          color:      theme.colors.textSecondary,
          fontFamily: theme.fonts.mono,
          textAlign:  'center',
        }}
      >
        {year}
      </div>

      {/* Event text */}
      <div
        style={{
          position:   'absolute',
          left:       88,
          right:      88,
          top:        580,
          opacity:    labelEnter,
          transform:  `translateY(${(1 - labelEnter) * 20}px)`,
          fontSize:   64,
          fontWeight: 900,
          color:      theme.colors.textPrimary,
          fontFamily: theme.fonts.body,
          textAlign:  'center',
          lineHeight: 1.25,
        }}
      >
        {shot.text}
      </div>

      <ThemeCaption shot={shot} shotDuration={shotDuration} theme={theme} />
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Typecheck + commit**

```bash
npx tsc --noEmit 2>&1 | grep "TimelineFlow" | head -5
git add src/scenes/knowledge/TimelineFlow.tsx
git commit -m "feat: add TimelineFlow scene (dot-appear + pulse)"
```

---

### Task 15: AiIntro scene

**Files:**
- Create: `src/scenes/education/AiIntro.tsx`

- [ ] **Step 1: Write AiIntro.tsx**

```tsx
// src/scenes/education/AiIntro.tsx
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {EducationShotData} from '../../data/types-v2';
import type {YaoningTheme} from '../../themes';
import {ThemeCaption} from '../../components/ThemeCaption';
import {bouncyEnter, clamp} from '../../utils/springs';
import {splitKeyword} from '../../utils/text';

export const AiIntro: React.FC<{shot: EducationShotData; theme: YaoningTheme; shotDuration: number}> = ({
  shot, theme, shotDuration,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // character-bounce: entrance scale 0.85 → 1.0, then continuous float
  const charEnter = bouncyEnter(frame, fps);
  const charScale = interpolate(charEnter, [0, 1], [0.85, 1], clamp);
  const charFloat = Math.sin(frame * 0.08) * 8; // continuous ±8px float

  // bubble-pop: speech bubble pops at frame 10
  const bubbleSpring = spring({frame: Math.max(0, frame - 10), fps, config: {damping: 15, stiffness: 250}});
  const bubbleScale  = interpolate(bubbleSpring, [0, 1], [0, 1.08], clamp);

  const name  = shot.characterName ?? 'AI';
  const parts = splitKeyword(shot.text, shot.keyword);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${theme.colors.bg} 0%, ${theme.colors.bgDeep} 100%)`,
      }}
    >
      {/* Character placeholder (replace with Lottie or PNG when available) */}
      <div
        style={{
          position:     'absolute',
          left:         '50%',
          top:          340,
          width:        320,
          height:       320,
          borderRadius: 999,
          background:   theme.colors.accent,
          transform:    `translate(-50%, 0) scale(${charScale}) translateY(${charFloat}px)`,
          display:      'flex',
          alignItems:   'center',
          justifyContent: 'center',
          fontSize:     120,
        }}
      >
        🤖
      </div>

      {/* Character name */}
      <div
        style={{
          position:   'absolute',
          left:       '50%',
          top:        680,
          transform:  'translateX(-50%)',
          fontSize:   36,
          fontWeight: 700,
          color:      theme.colors.textSecondary,
          fontFamily: theme.fonts.display,
        }}
      >
        {name}
      </div>

      {/* Speech bubble */}
      <div
        style={{
          position:     'absolute',
          left:         88,
          right:        88,
          top:          750,
          padding:      '28px 36px',
          borderRadius: 24,
          background:   theme.colors.surface,
          border:       `2px solid ${theme.colors.border}`,
          boxShadow:    '0 12px 32px rgba(0,0,0,0.08)',
          transform:    `scale(${bubbleScale})`,
          transformOrigin: 'top center',
          fontSize:     56,
          fontWeight:   900,
          color:        theme.colors.textPrimary,
          fontFamily:   theme.fonts.body,
          lineHeight:   1.25,
        }}
      >
        {parts.before}
        <span style={{color: theme.colors.accent}}>{parts.keyword}</span>
        {parts.after}
      </div>

      <ThemeCaption shot={shot} shotDuration={shotDuration} theme={theme} />
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Typecheck + commit**

```bash
npx tsc --noEmit 2>&1 | grep "AiIntro" | head -5
git add src/scenes/education/AiIntro.tsx
git commit -m "feat: add AiIntro scene (character-bounce + bubble-pop)"
```

---

### Task 16: ChallengeGame scene

**Files:**
- Create: `src/scenes/education/ChallengeGame.tsx`

- [ ] **Step 1: Write ChallengeGame.tsx**

```tsx
// src/scenes/education/ChallengeGame.tsx
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {EducationShotData} from '../../data/types-v2';
import type {YaoningTheme} from '../../themes';
import {ThemeCaption} from '../../components/ThemeCaption';
import {bouncyEnter, clamp} from '../../utils/springs';
import {splitKeyword} from '../../utils/text';

// 6 star burst particles
const STARS = [
  {angle: 0,   dist: 200, delay: 0},
  {angle: 60,  dist: 220, delay: 2},
  {angle: 120, dist: 190, delay: 4},
  {angle: 180, dist: 210, delay: 1},
  {angle: 240, dist: 200, delay: 3},
  {angle: 300, dist: 215, delay: 2},
];

export const ChallengeGame: React.FC<{shot: EducationShotData; theme: YaoningTheme; shotDuration: number}> = ({
  shot, theme, shotDuration,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Card bouncy entrance
  const cardEnter = bouncyEnter(frame, fps);
  const cardScale = interpolate(cardEnter, [0, 1], [0.8, 1], clamp);

  const parts = splitKeyword(shot.text, shot.keyword);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, #EDE9FE 0%, #DDD6FE 100%)`,
      }}
    >
      {/* Star burst particles */}
      {STARS.map((star, i) => {
        const starSpring = spring({frame: Math.max(0, frame - star.delay), fps, config: {damping: 8}});
        const dist = star.dist * starSpring;
        const rad  = (star.angle * Math.PI) / 180;
        const x    = 540 + Math.cos(rad) * dist;
        const y    = 700 + Math.sin(rad) * dist;
        return (
          <div
            key={i}
            style={{
              position:  'absolute',
              left:      x - 16,
              top:       y - 16,
              width:     32,
              height:    32,
              fontSize:  28,
              opacity:   Math.max(0, 1 - starSpring * 0.6),
              transform: `scale(${starSpring})`,
            }}
          >
            ⭐
          </div>
        );
      })}

      {/* Challenge card */}
      <div
        style={{
          position:     'absolute',
          left:         72,
          right:        72,
          top:          380,
          padding:      '48px 44px',
          borderRadius: 36,
          background:   theme.colors.surface,
          boxShadow:    '0 20px 48px rgba(139,92,246,0.18)',
          transform:    `scale(${cardScale})`,
          transformOrigin: 'center',
        }}
      >
        {/* Title */}
        <div
          style={{
            fontSize:   36,
            fontWeight: 700,
            color:      theme.colors.accentViolet,
            fontFamily: theme.fonts.display,
            marginBottom: 24,
          }}
        >
          挑战来了！
        </div>

        {/* Challenge text */}
        <div
          style={{
            fontSize:   60,
            fontWeight: 900,
            color:      theme.colors.textPrimary,
            fontFamily: theme.fonts.body,
            lineHeight: 1.3,
          }}
        >
          {parts.before}
          <span style={{color: theme.colors.accentViolet}}>{parts.keyword}</span>
          {parts.after}
        </div>

        {/* CTA badge */}
        <div
          style={{
            marginTop:    32,
            display:      'inline-block',
            padding:      '14px 32px',
            borderRadius: 999,
            background:   theme.colors.accentViolet,
            color:        '#fff',
            fontSize:     32,
            fontWeight:   900,
            fontFamily:   theme.fonts.display,
          }}
        >
          一起来！
        </div>
      </div>

      <ThemeCaption shot={shot} shotDuration={shotDuration} theme={theme} />
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Typecheck + commit**

```bash
npx tsc --noEmit 2>&1 | grep "ChallengeGame" | head -5
git add src/scenes/education/ChallengeGame.tsx
git commit -m "feat: add ChallengeGame scene (star-burst + bouncy-enter)"
```

---

### Task 17: StoryMoment scene

**Files:**
- Create: `src/scenes/education/StoryMoment.tsx`

- [ ] **Step 1: Write StoryMoment.tsx**

```tsx
// src/scenes/education/StoryMoment.tsx
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import type {EducationShotData} from '../../data/types-v2';
import type {YaoningTheme} from '../../themes';
import {ThemeCaption} from '../../components/ThemeCaption';
import {bouncyEnter, clamp, smoothReveal} from '../../utils/springs';
import {interpolate} from 'remotion';
import {splitKeyword} from '../../utils/text';

export const StoryMoment: React.FC<{shot: EducationShotData; theme: YaoningTheme; shotDuration: number}> = ({
  shot, theme, shotDuration,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Scene fades in
  const sceneEnter = smoothReveal(frame, fps);

  // Character bounces in with slight delay
  const charEnter = bouncyEnter(Math.max(0, frame - 6), fps);
  const charScale = interpolate(charEnter, [0, 1], [0.85, 1], clamp);
  const charFloat = Math.sin(frame * 0.09) * 6;

  // Story card slides up
  const cardEnter    = smoothReveal(Math.max(0, frame - 8), fps);
  const cardTranslateY = (1 - cardEnter) * 40;

  const name  = shot.characterName ?? '';
  const parts = splitKeyword(shot.text, shot.keyword);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${theme.colors.bg} 0%, ${theme.colors.bgDeep} 60%, ${theme.colors.bgDeep} 100%)`,
        opacity:    sceneEnter,
      }}
    >
      {/* Character area (placeholder — swap with Lottie/PNG) */}
      <div
        style={{
          position:     'absolute',
          left:         88,
          top:          220,
          width:        280,
          height:       280,
          borderRadius: 999,
          background:   theme.colors.accent,
          display:      'flex',
          alignItems:   'center',
          justifyContent: 'center',
          fontSize:     100,
          transform:    `scale(${charScale}) translateY(${charFloat}px)`,
        }}
      >
        👨‍👧
      </div>

      {/* Character name */}
      {name && (
        <div
          style={{
            position:   'absolute',
            left:       88,
            top:        520,
            fontSize:   32,
            color:      theme.colors.textSecondary,
            fontFamily: theme.fonts.display,
          }}
        >
          {name}
        </div>
      )}

      {/* Story text overlay card — bottom 40% */}
      <div
        style={{
          position:     'absolute',
          left:         0,
          right:        0,
          bottom:       0,
          height:       820,
          background:   'rgba(253,246,236,0.93)',
          borderRadius: '40px 40px 0 0',
          padding:      '48px 88px',
          transform:    `translateY(${cardTranslateY}px)`,
          opacity:      cardEnter,
        }}
      >
        <div
          style={{
            fontSize:   62,
            fontWeight: 900,
            color:      theme.colors.textPrimary,
            fontFamily: theme.fonts.body,
            lineHeight: 1.3,
          }}
        >
          {parts.before}
          <span style={{color: theme.colors.accent}}>{parts.keyword}</span>
          {parts.after}
        </div>
      </div>

      <ThemeCaption shot={shot} shotDuration={shotDuration} theme={theme} />
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Typecheck + commit**

```bash
npx tsc --noEmit 2>&1 | grep "StoryMoment" | head -5
git add src/scenes/education/StoryMoment.tsx
git commit -m "feat: add StoryMoment scene (character-bounce + card slide)"
```

---

### Task 18: DemoWalk scene

**Files:**
- Create: `src/scenes/education/DemoWalk.tsx`

- [ ] **Step 1: Write DemoWalk.tsx**

```tsx
// src/scenes/education/DemoWalk.tsx
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import type {EducationShotData} from '../../data/types-v2';
import type {YaoningTheme} from '../../themes';
import {ThemeCaption} from '../../components/ThemeCaption';
import {clamp, snappyPop} from '../../utils/springs';
import {splitKeyword} from '../../utils/text';

export const DemoWalk: React.FC<{shot: EducationShotData; theme: YaoningTheme; shotDuration: number}> = ({
  shot, theme, shotDuration,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Device slides in from bottom
  const deviceEnter = snappyPop(frame, fps);
  const deviceY     = interpolate(deviceEnter, [0, 1], [120, 0], clamp);

  // Annotation arrow draws left-to-right (highlight-sweep, 20 frames)
  const sweepWidth = interpolate(frame, [12, 32], [0, 100], {
    easing: (t) => t * (2 - t),
    ...clamp,
  });

  const stepNum = shot.stepNumber ?? 1;
  const parts   = splitKeyword(shot.text, shot.keyword);

  return (
    <AbsoluteFill style={{background: '#EFF6FF'}}>
      {/* Step number badge — top right */}
      <div
        style={{
          position:     'absolute',
          right:        72,
          top:          80,
          width:        88,
          height:       88,
          borderRadius: 999,
          background:   theme.colors.accent,
          display:      'flex',
          alignItems:   'center',
          justifyContent: 'center',
          fontSize:     44,
          fontWeight:   900,
          color:        '#fff',
          fontFamily:   theme.fonts.body,
        }}
      >
        {stepNum}
      </div>

      {/* Phone mockup */}
      <div
        style={{
          position:     'absolute',
          left:         '50%',
          top:          280,
          width:        360,
          height:       620,
          borderRadius: 44,
          background:   '#1E293B',
          border:       '6px solid #334155',
          transform:    `translate(-50%, ${deviceY}px)`,
          boxShadow:    '0 24px 64px rgba(0,0,0,0.22)',
          overflow:     'hidden',
        }}
      >
        {/* Phone screen */}
        <div
          style={{
            position:   'absolute',
            inset:      '16px 10px',
            borderRadius: 34,
            background: '#F8FAFC',
            display:    'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap:        16,
          }}
        >
          <div style={{fontSize: 28, color: '#64748B', fontFamily: theme.fonts.body, textAlign: 'center', padding: '0 16px'}}>
            {shot.text}
          </div>
          {/* Highlight sweep */}
          <div style={{width: '80%', height: 6, borderRadius: 999, background: '#E2E8F0', overflow: 'hidden'}}>
            <div style={{width: `${sweepWidth}%`, height: '100%', background: theme.colors.accent, borderRadius: 999}} />
          </div>
        </div>
      </div>

      {/* Step description */}
      <div
        style={{
          position:   'absolute',
          left:       88,
          right:      88,
          top:        960,
          fontSize:   56,
          fontWeight: 900,
          color:      '#0F172A',
          fontFamily: theme.fonts.body,
          lineHeight: 1.3,
          textAlign:  'center',
        }}
      >
        {parts.before}
        <span style={{color: theme.colors.accent}}>{parts.keyword}</span>
        {parts.after}
      </div>

      <ThemeCaption shot={shot} shotDuration={shotDuration} theme={theme} />
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Typecheck + commit**

```bash
npx tsc --noEmit 2>&1 | grep "DemoWalk" | head -5
git add src/scenes/education/DemoWalk.tsx
git commit -m "feat: add DemoWalk scene (device mockup + highlight-sweep)"
```

---

### Task 19: BoundaryCard scene

**Files:**
- Create: `src/scenes/education/BoundaryCard.tsx`

- [ ] **Step 1: Write BoundaryCard.tsx**

```tsx
// src/scenes/education/BoundaryCard.tsx
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import type {EducationShotData} from '../../data/types-v2';
import type {YaoningTheme} from '../../themes';
import {ThemeCaption} from '../../components/ThemeCaption';
import {clamp, smoothReveal} from '../../utils/springs';
import {splitKeyword} from '../../utils/text';

export const BoundaryCard: React.FC<{shot: EducationShotData; theme: YaoningTheme; shotDuration: number}> = ({
  shot, theme, shotDuration,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // warning-pulse: border opacity 0.4 → 1.0 × 3 cycles over 36 frames
  const cycleFrame = frame % 12;
  const borderOpacity = interpolate(cycleFrame, [0, 6, 12], [0.4, 1.0, 0.4], clamp);
  // scale pulses 1.0 → 1.03 → 1.0
  const borderScale = interpolate(cycleFrame, [0, 6, 12], [1.0, 1.03, 1.0], clamp);

  // Text fades in via smooth-reveal
  const textEnter = smoothReveal(frame, fps);

  const parts = splitKeyword(shot.text, shot.keyword);

  // Safety accent is ALWAYS amber — never red
  const safetyColor = theme.colors.safetyAccent; // #F59E0B

  return (
    <AbsoluteFill style={{background: theme.colors.safetyBg}}>
      {/* Pulsing border frame */}
      <div
        style={{
          position:     'absolute',
          inset:        24,
          border:       `6px solid ${safetyColor}`,
          borderRadius: 40,
          opacity:      borderOpacity,
          transform:    `scale(${borderScale})`,
        }}
      />

      {/* Shield icon */}
      <div
        style={{
          position:   'absolute',
          left:       '50%',
          top:        260,
          transform:  'translateX(-50%)',
          fontSize:   96,
          opacity:    textEnter,
        }}
      >
        🛡️
      </div>

      {/* Rule text */}
      <div
        style={{
          position:   'absolute',
          left:       88,
          right:      88,
          top:        420,
          opacity:    textEnter,
          transform:  `translateY(${(1 - textEnter) * 20}px)`,
          fontSize:   68,
          fontWeight: 900,
          color:      '#F5F5F4',
          fontFamily: theme.fonts.body,
          lineHeight: 1.3,
          textAlign:  'center',
        }}
      >
        {parts.before}
        <span style={{color: safetyColor}}>{parts.keyword}</span>
        {parts.after}
      </div>

      <ThemeCaption shot={shot} shotDuration={shotDuration} theme={theme} />
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Typecheck + commit**

```bash
npx tsc --noEmit 2>&1 | grep "BoundaryCard" | head -5
git add src/scenes/education/BoundaryCard.tsx
git commit -m "feat: add BoundaryCard scene (warning-pulse, amber only)"
```

---

### Task 20: CelebrateWin scene

**Files:**
- Create: `src/scenes/education/CelebrateWin.tsx`

- [ ] **Step 1: Write CelebrateWin.tsx**

```tsx
// src/scenes/education/CelebrateWin.tsx
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import type {EducationShotData} from '../../data/types-v2';
import type {YaoningTheme} from '../../themes';
import {ThemeCaption} from '../../components/ThemeCaption';
import {bouncyEnter, clamp} from '../../utils/springs';
import {getLottie} from '../../utils/assetCatalog';
import {interpolate} from 'remotion';
import {splitKeyword} from '../../utils/text';

import {Lottie} from '@remotion/lottie';

export const CelebrateWin: React.FC<{shot: EducationShotData; theme: YaoningTheme; shotDuration: number}> = ({
  shot, theme, shotDuration,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Achievement text bouncy entrance
  const textEnter = bouncyEnter(frame, fps);
  const textScale = interpolate(textEnter, [0, 1], [0.7, 1], clamp);

  // Try to get confetti from catalog (lottieId field, or 'fx-confetti-warm' default)
  const lottieId   = shot.lottieId ?? 'fx-confetti-warm';
  const lottieData = getLottie(lottieId);

  const parts = splitKeyword(shot.text, shot.keyword);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, #ECFDF5 0%, #D1FAE5 100%)`,
      }}
    >
      {/* Confetti Lottie overlay */}
      {lottieData && (
        <Lottie
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          animationData={lottieData as any}
          loop
          style={{
            position: 'absolute',
            inset:    0,
            width:    '100%',
            height:   '100%',
          }}
        />
      )}

      {/* Code-based star fallback when no Lottie */}
      {!lottieData && [0, 1, 2, 3, 4, 5].map((i) => {
        const x = 100 + (i * 180) % 900;
        const y = 200 + (i * 130) % 600;
        const phase = (frame + i * 12) % 60;
        const opacity = interpolate(phase, [0, 30, 60], [0.3, 1, 0.3], clamp);
        return (
          <div key={i} style={{position: 'absolute', left: x, top: y, fontSize: 40, opacity}}>⭐</div>
        );
      })}

      {/* Achievement text */}
      <div
        style={{
          position:   'absolute',
          left:       88,
          right:      88,
          top:        '50%',
          transform:  `translateY(-50%) scale(${textScale})`,
          fontSize:   72,
          fontWeight: 900,
          color:      theme.colors.celebrate,
          fontFamily: theme.fonts.body,
          lineHeight: 1.25,
          textAlign:  'center',
        }}
      >
        {parts.before}
        <span style={{color: theme.colors.accent}}>{parts.keyword}</span>
        {parts.after}
      </div>

      <ThemeCaption shot={shot} shotDuration={shotDuration} theme={theme} />
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Typecheck + commit**

```bash
npx tsc --noEmit 2>&1 | grep "CelebrateWin" | head -5
git add src/scenes/education/CelebrateWin.tsx
git commit -m "feat: add CelebrateWin scene (Lottie confetti + bouncy-enter fallback)"
```

---

### Task 21: QaFlip scene

**Files:**
- Create: `src/scenes/education/QaFlip.tsx`

- [ ] **Step 1: Write QaFlip.tsx**

```tsx
// src/scenes/education/QaFlip.tsx
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {EducationShotData} from '../../data/types-v2';
import type {YaoningTheme} from '../../themes';
import {ThemeCaption} from '../../components/ThemeCaption';
import {bouncyEnter, clamp} from '../../utils/springs';
import {splitKeyword} from '../../utils/text';

export const QaFlip: React.FC<{shot: EducationShotData; theme: YaoningTheme; shotDuration: number}> = ({
  shot, theme, shotDuration,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const isQuestion = shot.isQuestionShot ?? false;
  const isAnswer   = shot.isAnswerShot   ?? false;

  // Question state: wobble (rotate ±8deg × 2 cycles over 28 frames)
  const wobbleAngle = isQuestion
    ? interpolate(
        frame % 28,
        [0, 7, 14, 21, 28],
        [0, -8, 8, -8, 0],
        clamp,
      )
    : 0;

  // Answer state: springs up from 40px (reveal-spring)
  const answerSpring = isAnswer
    ? spring({frame, fps, config: {damping: 18, stiffness: 180}})
    : 0;
  const answerY      = isAnswer ? interpolate(answerSpring, [0, 1], [40, 0], clamp) : 0;
  const answerScale  = isAnswer ? interpolate(answerSpring, [0, 1], [0.9, 1], clamp) : 1;

  // Default: bouncy enter
  const defaultEnter = bouncyEnter(frame, fps);

  const bg     = isQuestion ? '#EEF2FF' : '#FFF7ED';
  const parts  = splitKeyword(shot.text, shot.keyword);
  const accent = isQuestion ? theme.colors.question : theme.colors.accent;

  return (
    <AbsoluteFill style={{background: bg}}>
      {isQuestion && (
        <>
          {/* Question mark graphic */}
          <div
            style={{
              position:   'absolute',
              left:       '50%',
              top:        280,
              transform:  `translateX(-50%) rotate(${wobbleAngle}deg)`,
              fontSize:   200,
              color:      theme.colors.question,
              fontFamily: theme.fonts.display,
              lineHeight: 1,
            }}
          >
            ？
          </div>

          {/* Question text */}
          <div
            style={{
              position:   'absolute',
              left:       88,
              right:      88,
              top:        600,
              fontSize:   64,
              fontWeight: 900,
              color:      '#1E1B4B',
              fontFamily: theme.fonts.body,
              lineHeight: 1.3,
              textAlign:  'center',
            }}
          >
            {parts.before}
            <span style={{color: accent}}>{parts.keyword}</span>
            {parts.after}
          </div>
        </>
      )}

      {isAnswer && (
        <div
          style={{
            position:   'absolute',
            left:       88,
            right:      88,
            top:        '50%',
            transform:  `translateY(calc(-50% + ${answerY}px)) scale(${answerScale})`,
            fontSize:   68,
            fontWeight: 900,
            color:      theme.colors.textPrimary,
            fontFamily: theme.fonts.body,
            lineHeight: 1.3,
            textAlign:  'center',
          }}
        >
          {parts.before}
          <span style={{color: accent}}>{parts.keyword}</span>
          {parts.after}
        </div>
      )}

      {/* Default state (neither question nor answer flag) */}
      {!isQuestion && !isAnswer && (
        <div
          style={{
            position:   'absolute',
            left:       88,
            right:      88,
            top:        '50%',
            opacity:    defaultEnter,
            transform:  `translateY(-50%)`,
            fontSize:   64,
            fontWeight: 900,
            color:      theme.colors.textPrimary,
            fontFamily: theme.fonts.body,
            lineHeight: 1.3,
            textAlign:  'center',
          }}
        >
          {parts.before}
          <span style={{color: accent}}>{parts.keyword}</span>
          {parts.after}
        </div>
      )}

      <ThemeCaption shot={shot} shotDuration={shotDuration} theme={theme} />
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Typecheck + commit**

```bash
npx tsc --noEmit 2>&1 | grep "QaFlip" | head -5
git add src/scenes/education/QaFlip.tsx
git commit -m "feat: add QaFlip scene (question-wobble + reveal-spring)"
```

---

### Task 22: VideoComposition router

**Files:**
- Create: `src/VideoComposition.tsx`

- [ ] **Step 1: Write VideoComposition.tsx**

```tsx
// src/VideoComposition.tsx
import {AbsoluteFill, calculateMetadata, Sequence} from 'remotion';
import type {KnowledgeScriptData, EducationScriptData, ScriptDataV2} from './data/types-v2';
import {themeOdin, themeYaoning} from './themes';

// Knowledge scenes
import {DataReveal}        from './scenes/knowledge/DataReveal';
import {StepList}          from './scenes/knowledge/StepList';
import {ConceptCard}       from './scenes/knowledge/ConceptCard';
import {QuoteHero}         from './scenes/knowledge/QuoteHero';
import {ComparisonSplit}   from './scenes/knowledge/ComparisonSplit';
import {ChecklistReveal}   from './scenes/knowledge/ChecklistReveal';
import {TimelineFlow}      from './scenes/knowledge/TimelineFlow';

// Education scenes
import {AiIntro}           from './scenes/education/AiIntro';
import {ChallengeGame}     from './scenes/education/ChallengeGame';
import {StoryMoment}       from './scenes/education/StoryMoment';
import {DemoWalk}          from './scenes/education/DemoWalk';
import {BoundaryCard}      from './scenes/education/BoundaryCard';
import {CelebrateWin}      from './scenes/education/CelebrateWin';
import {QaFlip}            from './scenes/education/QaFlip';

type KnowledgeSceneProps = {shot: KnowledgeScriptData['shots'][0]; theme: typeof themeOdin; shotDuration: number};
type EducationSceneProps = {shot: EducationScriptData['shots'][0]; theme: typeof themeYaoning; shotDuration: number};

const knowledgeMap: Record<string, React.FC<KnowledgeSceneProps>> = {
  'data-reveal':     DataReveal,
  'step-list':       StepList,
  'concept-card':    ConceptCard,
  'quote-hero':      QuoteHero,
  'comparison-split': ComparisonSplit,
  'checklist-reveal': ChecklistReveal,
  'timeline-flow':   TimelineFlow,
};

const educationMap: Record<string, React.FC<EducationSceneProps>> = {
  'ai-intro':       AiIntro,
  'challenge-game': ChallengeGame,
  'story-moment':   StoryMoment,
  'demo-walk':      DemoWalk,
  'boundary-card':  BoundaryCard,
  'celebrate-win':  CelebrateWin,
  'qa-flip':        QaFlip,
};

type VideoProps = {script: ScriptDataV2};

export const calculateVideoMetadata = calculateMetadata<VideoProps>({
  calculate: ({props}) => ({
    durationInFrames: props.script.shots.length * props.script.shotDurationFrames,
    fps:              props.script.fps,
    width:            props.script.width,
    height:           props.script.height,
  }),
});

export const VideoComposition: React.FC<VideoProps> = ({script}) => {
  const isKnowledge = script.track === 'knowledge-sharing';
  const bg          = isKnowledge ? themeOdin.colors.bgDark : themeYaoning.colors.bg;

  return (
    <AbsoluteFill style={{background: bg, overflow: 'hidden'}}>
      {isKnowledge
        ? (script as KnowledgeScriptData).shots.map((shot, i) => {
            const Scene = knowledgeMap[shot.scene];
            if (!Scene) return null;
            return (
              <Sequence key={i} from={i * script.shotDurationFrames} durationInFrames={script.shotDurationFrames}>
                <Scene shot={shot} theme={themeOdin} shotDuration={script.shotDurationFrames} />
              </Sequence>
            );
          })
        : (script as EducationScriptData).shots.map((shot, i) => {
            const Scene = educationMap[shot.scene];
            if (!Scene) return null;
            return (
              <Sequence key={i} from={i * script.shotDurationFrames} durationInFrames={script.shotDurationFrames}>
                <Scene shot={shot} theme={themeYaoning} shotDuration={script.shotDurationFrames} />
              </Sequence>
            );
          })
      }
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Typecheck**

```bash
npx tsc --noEmit 2>&1 | grep "VideoComposition" | head -10
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/VideoComposition.tsx
git commit -m "feat: add VideoComposition router — maps track + scene IDs to components"
```

---

### Task 23: Cover templates

**Files:**
- Create: `src/covers/OdinCover.tsx`
- Create: `src/covers/YaoningCover.tsx`

- [ ] **Step 1: Write OdinCover.tsx**

```tsx
// src/covers/OdinCover.tsx
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {KnowledgeScriptData} from '../data/types-v2';
import {themeOdin} from '../themes';
import {clamp} from '../utils/springs';
import {splitKeyword} from '../utils/text';

type OdinCoverProps = {cover: KnowledgeScriptData['cover']; accentColor?: string};

export const OdinCover: React.FC<OdinCoverProps> = ({cover, accentColor}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enter    = spring({frame, fps, config: {damping: 200}});
  const titleY   = interpolate(enter, [0, 1], [32, 0], clamp);
  const accent   = accentColor ?? themeOdin.colors.accent;
  const parts    = splitKeyword(cover.title, cover.titleHighlight);

  return (
    <AbsoluteFill style={{background: themeOdin.colors.bgDark, overflow: 'hidden'}}>
      {/* Decorative circle */}
      <div
        style={{
          position:     'absolute',
          right:        -80,
          top:          200,
          width:        400,
          height:       400,
          borderRadius: 999,
          border:       `40px solid ${accent}`,
          opacity:      0.12,
        }}
      />

      {/* Title */}
      <div
        style={{
          position:   'absolute',
          left:       88,
          right:      88,
          top:        280,
          opacity:    enter,
          transform:  `translateY(${titleY}px)`,
          fontSize:   84,
          fontWeight: 900,
          lineHeight: 1.18,
          color:      themeOdin.colors.textPrimary,
          fontFamily: themeOdin.fonts.body,
        }}
      >
        {parts.before}
        <span style={{color: accent}}>{parts.keyword}</span>
        {parts.after}
      </div>

      {/* Accent bar */}
      <div
        style={{
          position:     'absolute',
          left:         88,
          top:          240,
          width:        interpolate(enter, [0, 1], [0, 80], clamp),
          height:       6,
          borderRadius: 999,
          background:   accent,
        }}
      />

      {/* Subtitle */}
      <div
        style={{
          position:     'absolute',
          left:         88,
          top:          700,
          opacity:      interpolate(enter, [0.6, 1], [0, 1], clamp),
          fontSize:     44,
          color:        themeOdin.colors.textSecondary,
          fontFamily:   themeOdin.fonts.body,
          fontWeight:   600,
        }}
      >
        {cover.subtitle}
      </div>
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Write YaoningCover.tsx**

```tsx
// src/covers/YaoningCover.tsx
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {EducationScriptData} from '../data/types-v2';
import {themeYaoning} from '../themes';
import {bouncyEnter, clamp} from '../utils/springs';
import {splitKeyword} from '../utils/text';

type YaoningCoverProps = {cover: EducationScriptData['cover']; accentColor?: string};

export const YaoningCover: React.FC<YaoningCoverProps> = ({cover, accentColor}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enter  = bouncyEnter(frame, fps);
  const titleY = interpolate(enter, [0, 1], [40, 0], clamp);
  const accent = accentColor ?? themeYaoning.colors.accent;
  const parts  = splitKeyword(cover.title, cover.titleHighlight);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${themeYaoning.colors.bg} 0%, ${themeYaoning.colors.bgDeep} 100%)`,
        overflow: 'hidden',
      }}
    >
      {/* Decorative blob top */}
      <div
        style={{
          position:     'absolute',
          left:         -60,
          top:          -60,
          width:        360,
          height:       360,
          borderRadius: 999,
          background:   accent,
          opacity:      0.12,
        }}
      />

      {/* Title card */}
      <div
        style={{
          position:     'absolute',
          left:         72,
          right:        72,
          top:          320,
          padding:      '44px 48px',
          borderRadius: 36,
          background:   themeYaoning.colors.surface,
          border:       `3px solid ${themeYaoning.colors.border}`,
          boxShadow:    '0 20px 48px rgba(249,115,22,0.12)',
          opacity:      enter,
          transform:    `translateY(${titleY}px)`,
        }}
      >
        <div
          style={{
            fontSize:   76,
            fontWeight: 900,
            lineHeight: 1.2,
            color:      themeYaoning.colors.textPrimary,
            fontFamily: themeYaoning.fonts.body,
          }}
        >
          {parts.before}
          <span style={{color: accent}}>{parts.keyword}</span>
          {parts.after}
        </div>

        {/* Subtitle pill */}
        <div
          style={{
            marginTop:    28,
            display:      'inline-block',
            padding:      '10px 28px',
            borderRadius: 999,
            background:   themeYaoning.colors.bgDeep,
            border:       `2px solid ${themeYaoning.colors.border}`,
            fontSize:     36,
            fontWeight:   700,
            color:        themeYaoning.colors.textSecondary,
            fontFamily:   themeYaoning.fonts.body,
          }}
        >
          {cover.subtitle}
        </div>
      </div>
    </AbsoluteFill>
  );
};
```

- [ ] **Step 3: Typecheck + commit**

```bash
npx tsc --noEmit 2>&1 | grep "Cover" | head -5
git add src/covers/
git commit -m "feat: add OdinCover + YaoningCover templates"
```

---

### Task 24: script.txt generator

**Files:**
- Create: `scripts/export-script.ts`

- [ ] **Step 1: Write export-script.ts**

```ts
// scripts/export-script.ts
import {readFileSync, writeFileSync, mkdirSync} from 'node:fs';
import {resolve, dirname} from 'node:path';

// Dynamic import of the current video script (compiled via tsx)
const scriptPath = resolve('./src/data/current-video.ts');

async function main() {
  // tsx handles the TypeScript import at runtime
  const {script} = await import(scriptPath);

  const fps      = script.fps as number;
  const duration = (script.shotDurationFrames / fps).toFixed(1);

  const lines: string[] = [];
  lines.push(`视频：${script.title}`);
  lines.push(`赛道：${script.track}`);
  lines.push('');

  (script.shots as {caption: string}[]).forEach((shot, i) => {
    lines.push(`[镜头 ${i + 1} — ${duration}s]`);
    lines.push(shot.caption);
    lines.push('');
  });

  mkdirSync('public/output', {recursive: true});
  writeFileSync('public/output/script.txt', lines.join('\n'), 'utf8');
  console.log(`✓ script.txt written (${script.shots.length} lines) → public/output/script.txt`);
}

main().catch((e) => {console.error(e); process.exit(1);});
```

- [ ] **Step 2: Add scripts to package.json**

Open `package.json` and add to the `"scripts"` block:

```json
"render:knowledge": "remotion render src/index.ts VideoComposition public/output/video.mp4 --codec=h264 --concurrency=1 --browser-executable=\"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome\"",
"render:full": "npm run render:knowledge && npx tsx scripts/export-script.ts",
"export-script": "npx tsx scripts/export-script.ts"
```

- [ ] **Step 3: Test script runner**

```bash
cd "/Users/jiweiwang/Downloads/Code case/Remotion-Video"
npx tsx scripts/export-script.ts
```

Expected: `✓ script.txt written (1 lines) → public/output/script.txt`

```bash
cat public/output/script.txt
```

- [ ] **Step 4: Commit**

```bash
git add scripts/export-script.ts package.json
git commit -m "feat: add export-script.ts — outputs script.txt with shot captions + timings"
```

---

### Task 25: Update Root.tsx — register new compositions

**Files:**
- Modify: `src/Root.tsx`

- [ ] **Step 1: Read current Root.tsx**

Read `src/Root.tsx` to see the current imports and composition list before editing.

- [ ] **Step 2: Add new compositions to Root.tsx**

Replace the content of `src/Root.tsx` with:

```tsx
// src/Root.tsx
import {Composition} from 'remotion';
import './fonts';

// Existing compositions (untouched)
import {BranchCover, BranchVideo} from './BranchVideo';
import {demoScript, totalDuration} from './data/demo';

// New design system compositions
import {VideoComposition, calculateVideoMetadata} from './VideoComposition';
import {OdinCover}    from './covers/OdinCover';
import {YaoningCover} from './covers/YaoningCover';
import {script as currentScript} from './data/current-video';

export const RemotionRoot: React.FC = () => {
  const isKnowledge = currentScript.track === 'knowledge-sharing';

  return (
    <>
      {/* ── Legacy compositions (keep working) ── */}
      <Composition
        id="BranchVideo"
        component={BranchVideo}
        durationInFrames={totalDuration}
        fps={demoScript.fps}
        width={demoScript.width}
        height={demoScript.height}
      />
      <Composition
        id="BranchCover"
        component={BranchCover}
        durationInFrames={90}
        fps={demoScript.fps}
        width={demoScript.width}
        height={1440}
      />

      {/* ── New design system compositions ── */}
      <Composition
        id="VideoComposition"
        component={VideoComposition}
        calculateMetadata={calculateVideoMetadata}
        defaultProps={{script: currentScript}}
        fps={30}
        width={1080}
        height={1920}
        durationInFrames={currentScript.shots.length * currentScript.shotDurationFrames}
      />
      {/* Cover: separate registrations avoid JSX conditional component type errors */}
      {isKnowledge && (
        <Composition
          id="Cover"
          component={OdinCover}
          durationInFrames={90}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{cover: (currentScript as import('./data/types-v2').KnowledgeScriptData).cover, accentColor: currentScript.accentColor}}
        />
      )}
      {!isKnowledge && (
        <Composition
          id="Cover"
          component={YaoningCover}
          durationInFrames={90}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{cover: (currentScript as import('./data/types-v2').EducationScriptData).cover, accentColor: currentScript.accentColor}}
        />
      )}
    </>
  );
};
```

- [ ] **Step 3: Full typecheck**

```bash
npx tsc --noEmit 2>&1
```

Expected: 0 errors. If there are errors, fix them before proceeding.

- [ ] **Step 4: Start dev server and verify**

```bash
npm run dev
```

Open Remotion Studio in the browser. Confirm:
- `BranchVideo` and `BranchCover` still appear
- `VideoComposition` and `Cover` appear in the composition list
- Clicking `VideoComposition` renders the placeholder script without crashing

- [ ] **Step 5: Commit**

```bash
git add src/Root.tsx
git commit -m "feat: register VideoComposition + Cover in Root.tsx; import fonts at startup"
```

---

### Task 26: End-to-end smoke test

**Goal:** Confirm the full pipeline works with a real script.

- [ ] **Step 1: Write a minimal knowledge-sharing test script**

Create `src/data/test-knowledge.ts`:

```ts
import type {KnowledgeScriptData} from './types-v2';

export const script: KnowledgeScriptData = {
  track:             'knowledge-sharing',
  contentType:       'data-insight',
  title:             'AI 已经改变了什么',
  subtitle:          '数据不会说谎',
  fps:               30,
  width:             1080,
  height:            1920,
  colorScheme:       'dark',
  accentColor:       '#E85D04',
  shotDurationFrames: 80,
  cover: {
    title:          'AI 已经改变了什么',
    subtitle:       '数据说话',
    titleHighlight: 'AI',
  },
  shots: [
    {
      text:          'AI 已替代 78% 的重复性工作',
      keyword:       '78%',
      caption:       '这不是未来，而是正在发生的现在',
      captionKeyword: '正在发生',
      scene:         'data-reveal',
      motionPreset:  'stat-slam',
      animationStyle: 'dramatic-slam',
      dataValue:     '78%',
    },
    {
      text:          '第一步：找出你最耗时的任务',
      keyword:       '最耗时',
      caption:       '把时间记录一周，你会发现规律',
      captionKeyword: '发现规律',
      scene:         'step-list',
      motionPreset:  'list-stagger',
      animationStyle: 'snappy-pop',
      stepNumber:    1,
    },
    {
      text:          '工作流自动化是核心概念',
      keyword:       '工作流自动化',
      caption:       '不是替代你，是替代你最无聊的部分',
      captionKeyword: '最无聊',
      scene:         'concept-card',
      motionPreset:  'highlight-sweep',
      animationStyle: 'smooth-reveal',
    },
  ],
};
```

- [ ] **Step 2: Point current-video.ts at the test script**

Replace the content of `src/data/current-video.ts`:

```ts
export {script} from './test-knowledge';
```

- [ ] **Step 3: Open Remotion Studio and preview**

```bash
npm run dev
```

In the studio, select `VideoComposition`. Step through frames manually. Confirm:
- Shot 1 (`data-reveal`): dark background, large "78%" counting up, accent color correct
- Shot 2 (`step-list`): light background, "01" step number, step text revealed
- Shot 3 (`concept-card`): indigo gradient, concept term with sweeping underline
- ThemeCaption appears at the bottom of each shot with correct accent highlights

- [ ] **Step 4: Export script.txt**

```bash
npx tsx scripts/export-script.ts
cat public/output/script.txt
```

Expected output:
```
视频：AI 已经改变了什么
赛道：knowledge-sharing

[镜头 1 — 2.7s]
这不是未来，而是正在发生的现在

[镜头 2 — 2.7s]
把时间记录一周，你会发现规律

[镜头 3 — 2.7s]
不是替代你，是替代你最无聊的部分
```

- [ ] **Step 5: Typecheck final pass**

```bash
npx tsc --noEmit 2>&1
```

Expected: 0 errors.

- [ ] **Step 6: Commit**

```bash
git add src/data/test-knowledge.ts src/data/current-video.ts
git commit -m "test: add smoke-test script; verify full pipeline DataReveal→StepList→ConceptCard"
```

---

## Usage after implementation

**AI generates a new video:**

1. AI reads `content-system/HOW-TO-USE-claude-code.md` and generates a script
2. AI writes it to `src/data/<topic-slug>.ts`
3. User updates `src/data/current-video.ts`:
   ```ts
   export {script} from './<topic-slug>';
   ```
4. Preview: `npm run dev` → select `VideoComposition`
5. Export: `npm run render:full` → `public/output/video.mp4` + `public/output/script.txt`
6. Take `script.txt` to MiniMax for voiceover recording

**Add a new Lottie asset:**

1. Download JSON to `public/assets/lottie/<category>/<id>.json`
2. Import in `src/utils/assetCatalog.ts`, add to `LOTTIE_CATALOG`
3. Add a row to `content-system/asset-library/catalog.md`
4. Use the catalog ID in any shot's `lottieId` field

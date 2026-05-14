# Remotion Video Pipeline — Handoff

**Branch:** `codex/remotion-video-pipeline`  
**Stack:** Remotion 4.0.459 · React · TypeScript · `@remotion/google-fonts`

---

## What this project does

Generates 9:16 short-form videos (1080×1920, 30 fps) for two content tracks:

| Track | ID | Audience | Theme |
|---|---|---|---|
| **Odin** 知识干货 | `knowledge-sharing` | Professionals | Dark navy, orange accent |
| **曜宁** 亲子AI教育 | `ai-education` | Parents + kids | Warm peach, orange+violet |

Each video is defined by a single **script data object** in `src/data/current-video.ts`. The script lists shots; each shot maps to a scene component. Remotion renders them sequentially via `<Sequence>`.

---

## Key files

```
src/
  Root.tsx                    # Composition registry — registers VideoComposition, Cover
  VideoComposition.tsx        # Router: reads script, dispatches shots to scene components
  data/
    types-v2.ts               # KnowledgeScriptData | EducationScriptData (source of truth)
    current-video.ts          # Active test script — swap to change what the studio shows
  themes/
    index.ts                  # OdinTheme | YaoningTheme types
    theme-odin.ts             # Dark navy palette, fonts
    theme-yaoning.ts          # Warm peach palette, fonts
  scenes/
    knowledge/                # 7 scenes for Odin track
      DataReveal.tsx          # Animated stat counter + DataArc + TechDots bg
      ConceptCard.tsx         # Dark gradient card, highlight-sweep underline + TechDots bg
      StepList.tsx            # Numbered step with progress dots
      QuoteHero.tsx           # Full-screen quote with decorative quote mark
      ChecklistReveal.tsx     # Staggered checklist items
      ComparisonSplit.tsx     # Left/right split comparison
      TimelineFlow.tsx        # Vertical timeline with events
    education/                # 7 scenes for 曜宁 track
      AiIntro.tsx             # doudou-robot.png + concept text
      CelebrateWin.tsx        # doudou-robot.png + confetti Lottie + star row
      StoryMoment.tsx         # doudou-robot.png + speech bubble dialog
      ChallengeGame.tsx       # Challenge banner with purpose-target.png
      DemoWalk.tsx            # Terminal screen + doudou-robot.png guide
      BoundaryCard.tsx        # Safety rule card with warning stripe
      QaFlip.tsx              # Card flip Q→A reveal, magnifier.png on answer side
  components/
    ThemeCaption.tsx          # Animated caption bar at bottom — shared by ALL scenes
    illustrations/
      TechDots.tsx            # Animated dot-grid background (code-based SVG)
      DataArc.tsx             # 270° progress arc (code-based SVG)
      AiRobot.tsx             # Animated SVG robot character (standalone, reusable)
      PngAsset.tsx            # Wrapper for Img + staticFile PNG assets with drop-shadow
  covers/
    OdinCover.tsx             # Knowledge track cover (dark)
    YaoningCover.tsx          # Education track cover (warm)
  utils/
    springs.ts                # Animation helpers: bouncyEnter, dramaticSlam, staggerSpring, etc.
    text.ts                   # splitKeyword(), parseDataValue(), counterTick()
    assetCatalog.ts           # getLottie() — returns Lottie JSON by ID
  fonts/
    index.ts                  # Loads all Google Fonts via @remotion/google-fonts

public/assets/
  generated/
    doudou-robot.png          # 曜宁 mascot robot (transparent PNG)
    magnifier.png             # Prop for verify/source-check scenes
    membership-card.png       # Prop for payment/member scenes
    rules-board.png           # Prop for family-rules scenes
    purpose-target.png        # Prop for challenge/goal scenes
  lottie/
    *.json                    # Placeholder Lottie animations (confetti, icons)
```

---

## How to add a new video

1. Edit `src/data/current-video.ts` — set `track`, fill `shots[]`
2. Each shot needs: `text`, `keyword`, `caption`, `captionKeyword`, `scene`, `motionPreset`, `animationStyle`
3. Run `npm run dev` — studio opens at `http://localhost:3001`

**Knowledge scene IDs:** `data-reveal` · `concept-card` · `step-list` · `quote-hero` · `comparison-split` · `checklist-reveal` · `timeline-flow`

**Education scene IDs:** `ai-intro` · `celebrate-win` · `story-moment` · `demo-walk` · `boundary-card` · `qa-flip` · `challenge-game`

---

## Architecture rules

### ThemeCaption is caption-only
`ThemeCaption` renders **only** the animated caption bar at the bottom. It does NOT render `shot.text`. Every scene is responsible for rendering its own main text. This was an intentional fix — previously caused text duplication.

### Theme narrowing
`OdinTheme` and `YaoningTheme` are separate types — they do NOT overlap. Never cast between them. Check `theme.track` before accessing track-specific color fields.

### calculateMetadata
`remotion` v4.0.459 does NOT export a `calculateMetadata` factory function. Use `CalculateMetadataFunction` as a type and write a plain async function:
```ts
import type {CalculateMetadataFunction} from 'remotion';
export const calculateVideoMetadata: CalculateMetadataFunction<VideoProps> = async ({props}) => ({...});
```

### PNG assets
All PNG illustrations live in `public/assets/generated/`. Load them with:
```tsx
import {Img, staticFile} from 'remotion';
<Img src={staticFile('assets/generated/doudou-robot.png')} />
```
Use the `PngAsset` wrapper in `src/components/illustrations/PngAsset.tsx` for consistent sizing and drop-shadow.

---

## Current test data

`src/data/current-video.ts` is set to a **knowledge-sharing** script (5 shots, 30 frames each = 5 seconds). To test education scenes, change the `track` field and `shots[]` to use education scene IDs. The `Root.tsx` handles both tracks without modification.

---

## Scripts

```bash
npm run dev        # Start Remotion Studio on :3001
npm run build      # Type-check + bundle
npx tsc --noEmit   # Type-check only
```

---

## Known gaps / next steps

- `TimelineFlow.tsx` and `ComparisonSplit.tsx` scenes have no illustration assets yet (pure text layout)
- `BoundaryCard.tsx` uses an emoji ⚠️ — could replace with a generated PNG prop
- Lottie files in `public/assets/lottie/` are placeholders with minimal data; real animations not yet sourced
- No render pipeline wired (`scripts/export-script.ts` outputs `script.txt` captions only)
- Education cover (`YaoningCover`) has not been visually reviewed

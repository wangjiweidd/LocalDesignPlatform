# Handoff — Visual Redesign (Yaoning AI Education track)

**Date**: 2026-05-21 / 2026-05-22
**Scope**: `renderers/remotion-video/` — `AiIntro` scene + `YaoningCover` + shared design infrastructure
**Status**: V12 baseline established on 1 scene + cover. Recommended pattern. Other scenes pending.

---

## What changed and why

The Yaoning track (`ai-education`) previously rendered scenes with two roughly equal-weight text blocks fighting for the viewer's eye, a generic "watershed grade" hardcoded into `AiIntro`, and a flat cream background. The hook shot did not separate visually from the body shots, the persistent header had no shape, and the caption was indistinguishable from the title.

This pass aligned the visual language to the reference video `reference/内容/IMG_4452.PNG` (the "整个小学6年" frame the user flagged as the target style) while keeping the script-data contract intact.

The end state is one fully reworked scene (`AiIntro`) + one fully reworked cover (`YaoningCover`) that together establish the V12 baseline. The other six education scenes (`ChallengeGame` / `StoryMoment` / `DemoWalk` / `BoundaryCard` / `CelebrateWin` / `QaFlip`) plus all seven knowledge scenes are unchanged.

---

## V12 baseline — design language

Apply these when extending to the remaining scenes.

### Background

```ts
// themes/theme-yaoning.ts
bg: 'radial-gradient(120% 80% at 50% 35%, #FFE6D9 0%, #FFD9C7 45%, #FFCBB5 100%)'
```

Warm peach radial wash. Replaces the old flat `#FDF6EC`. Reads as "soft sticker on paper" rather than an empty page.

### Persistent header (top of every shot)

**File**: `src/components/PersistentHeader.tsx`

- Surface-card with `border: 2px solid border` + `borderRadius: 24` + light shadow
- `display: inline-block` so the card hugs the headline
- `fontSize: 50`, `fontWeight: 900`, `lineHeight: 1.2`
- Font: `theme.fonts.display` (Noto Serif SC)
- Color: `theme.colors.textPrimary` (dark cocoa), keyword in `theme.colors.accent` (orange)
- Anchored at `top: 80`, padded `32px 56px`
- Reads `videoTitle` + `videoKeyword` props (from `script.cover.title` + `script.cover.titleHighlight` passed via `VideoComposition`)

**Why white card, not black bar**: black headers (per the first attempt at IMG_4440) felt heavy on the warm wash. White card preserves the "title block" feeling at lower visual weight.

### Hero icon (between title and caption)

Each scene picks its own hero. For `AiIntro`:

- 3 ascending bars SVG, viewBox `360x280`, rendered at `480x374`
- Bar 3 (tallest) filled with `accent` orange + white "3" inside — anchors "3 is the answer"
- Bars 1 & 2 transparent fills with cocoa stroke, "1"/"2" labels above
- Anchored at `top: 420`, opacity + scale entrance via `bouncyEnter`

**Principle**: hero icon owns the visual centre. Title and caption support it, do not compete with it.

### Chinese hero phrase

- Short — `keyword + after`, NOT full `shot.text`. Trim repetition with the header.
  - Example: header says "就看小学这3个关键期", phrase says "3个关键分水岭" (deleted "小学6年有" prefix)
- `fontSize: 88`, `fontWeight: 900`, `lineHeight: 1.14`
- Same font as header: `theme.fonts.display`
- `top: 850`

### English subtitle

- `shot.enText` (new optional field on `EducationShotData`)
- `fontSize: 36`, `fontWeight: 500`, `letterSpacing: 2`
- Muted: `theme.colors.textSecondary` at `opacity 0.82`
- `top: 980`
- Skipped if `shot.enText` is absent (`{shot.enText ? <...> : null}`)

### Caption (bottom, "字幕条")

**File inline in each scene** (currently `AiIntro` only).

- **Inverted from the title card**, intentional contrast so the two never read as the same element:
  - Background `rgba(28, 25, 23, 0.88)` — dark cocoa, translucent
  - Border: none
  - `borderRadius: 12` (smaller than title's 24)
  - `fontSize: 42` (smaller than title's 50)
  - `fontWeight: 500` (lighter than title's 900)
  - Color `#FFFFFF`, keyword in `theme.colors.accentYellow` (`#FACC15`)
- Same font as the rest: `theme.fonts.display`
- Anchored at `top: ZONES.contentBottom - 140` (= 1100)

**Why dark, since the user rejected the dark header**: caption is small + at the bottom, so weight does not oppress. Inverting from the title card is the cleanest way to keep them distinguishable while sharing one typeface.

### Cover (`YaoningCover`)

Structure: text-on-top, hero-on-bottom (opposite of normal scene).

- Title card same surface-card language as PersistentHeader, `top: 200`, `fontSize: 80`, `lineHeight: 1.3`
- Subtitle pulled out into a **separate** pill (NOT inside the title card), `top: 640`, `fontSize: 44`
- Hero icon `top: 820`, `520x406`
- Hero icon is **data-driven** via `cover.heroIconKey` — see below

---

## New data contract additions

### `EducationShotData.enText?: string`

Optional English subtitle for any shot. Currently consumed only by `AiIntro`. When extending other scenes you can opt-in per shot.

```ts
// data/types-v2.ts
export type EducationShotData = {
  ...
  enText?: string;
};
```

### `EducationCoverData.heroIconKey?: EducationCoverIconKey`

Picks which hero icon the cover renders. Five keys ship now, more can be added:

```ts
export type EducationCoverIconKey =
  | 'three-bars'      // ascending bars, for stage / count topics
  | 'check-seal'      // green circle + check, for completion / wrap-up
  | 'lightbulb'       // bulb + filament, for idea / discovery
  | 'question-mark'   // circle with ?, for question-led topics
  | 'shield';         // shield + check, for safety / boundary
```

Icon library lives inline in `YaoningCover.tsx` (`HeroIcon` component) as SVG. Add new keys by extending the `switch` and the union type.

### `EducationScriptData.shotDurationFrames` and `shots` (unchanged)

Server-side schema validation in `server.mjs` (`validateRemotionScriptData`) is untouched and still passes — these additions are purely optional fields.

---

## Files touched

```
renderers/remotion-video/src/
├── components/
│   └── PersistentHeader.tsx          REWRITTEN — surface card + inline-block + display font
├── covers/
│   └── YaoningCover.tsx              REWRITTEN — text-up, hero-down, icon library
├── data/
│   ├── types-v2.ts                   ADDED — EducationShotData.enText, EducationCoverIconKey, EducationCoverData.heroIconKey
│   └── script-xiaoxue-fenshui.ts     EDITED — shot[0] adds enText + \n; cover adds heroIconKey: 'three-bars'
├── scenes/education/
│   └── AiIntro.tsx                   REWRITTEN — splitKeyword keyword-only, 3 bars hero, dark caption
├── themes/
│   └── theme-yaoning.ts              EDITED — bg → radial wash; added accentYellow / headerBg / headerText
└── VideoComposition.tsx              EDITED — passes videoTitle + videoKeyword to scene components
```

No code outside `renderers/remotion-video/src/` changed in this pass.

---

## Validation artifacts

All in `renderers/remotion-video/public/output/`:

| File | Composition | Purpose |
|---|---|---|
| `test-aiintro-v12.png` | `VideoComposition` shot 1 | AiIntro baseline |
| `test-cover-v3.png` | `Cover` | YaoningCover baseline (text-up + hero-down) |
| `test-video.mp4` | `VideoComposition` full 21s | Last full render, BEFORE this redesign — needs re-render |

The full-video render (`test-video.mp4`) still shows the pre-V12 design for shots 2-7 because only shot 1 (`AiIntro`) has been migrated.

---

## Why the user rejected several intermediate versions

Recorded so future iterations don't repeat them:

1. **v2 — hardcoded "3" split on `shot.text`**: broke for any topic where the headline doesn't contain a literal "3".
2. **v4 — fontSize 100 chinese headline**: 13 characters at 100px overflows the 1080px canvas with `padX: 60`, forcing an ugly dangling-character break.
3. **v6/v7 — dark header bar (matching IMG_4440 literally)**: felt oppressive against the warm wash. White surface-card is the equivalent "title block" weight at lower visual heaviness.
4. **v9 — header 72px vs body 88px**: only 1.22× scale ratio, eye couldn't decide which to read first. The fix wasn't more contrast — it was **deleting the repetition** between header and body and letting the icon become the anchor.
5. **v11 — caption matching title card style**: white-on-white twins; user couldn't tell which was title vs subtitle. Inverted caption to dark cocoa solved it.
6. **Cover v2 — subtitle inside title card**: visually one merged block, no breathing. Pulled subtitle into its own pill.

---

## Pending: extending to other scenes

The remaining six `ai-education` scenes have NOT been touched. They still render with the old design. They need the same V12 treatment, but each needs its own hero — copy-pasting the 3 bars into `ChallengeGame` would be wrong (`ChallengeGame` is per-stage, not the overall "3 watersheds" hook).

Suggested hero per scene, based on `script-xiaoxue-fenshui` semantics:

| Scene | Used by current script | Suggested hero |
|---|---|---|
| `ChallengeGame` | shots 2 / 4 / 6 (1-2 / 3-4 / 5-6 年级 milestones) | 3 large stage circles in a row, current stage filled accent. Read `shot.stepNumber` |
| `StoryMoment` | shots 3 / 5 (pull-quote insight) | Big quotation marks SVG, accent color, behind the keyword |
| `CelebrateWin` | shot 7 (encouragement close) | Three checkmark circles + optional `lottieId: 'fx-confetti-warm'` overlay |
| `DemoWalk` | not used by current script | Skip until needed |
| `BoundaryCard` | not used by current script | Skip until needed |
| `QaFlip` | not used by current script | Skip until needed |

Each migration is roughly:
1. Replace inline header rendering with `<PersistentHeader theme={theme} title={videoTitle} keyword={videoKeyword} />`
2. Replace inline caption with the dark cocoa pattern from `AiIntro`
3. Compress the headline to `splitKeyword(...)` keyword-portion only, drop the repetition with the header
4. Build the hero SVG for this scene's semantic
5. Optionally add `shot.enText` to give the scene the same en-subtitle rhythm
6. Render `npx remotion still src/index.ts VideoComposition public/output/<scene>-test.png --frame=<inside that shot>`

Knowledge track (`OdinTheme` + 7 knowledge scenes) is **not in scope** — those use a different theme (`themeOdin`, dark background) and need their own design pass.

---

## Known issues

- **Cover icon library is inline in `YaoningCover.tsx`**. Fine for 5 icons, but if it grows past ~10, extract to `src/covers/heroIcons/` directory with one file per key.
- **`SERIES_TITLE` constant in `design-tokens.ts` is still hardcoded** to "小学 · 3个关键分水岭". It only acts as PersistentHeader's fallback when `title` prop isn't passed, but it should be removed (or moved into `script.cover` as `seriesLabel`) before adding a second yaoning script.
- **Old `data/demo.ts` + `data/types.ts` (v1 schema)** are still in the tree and imported by `BranchVideo` / `BranchCover` legacy compositions. Those are dead from the new pipeline's perspective and could be removed, but `Root.tsx` still registers `BranchVideo` and `BranchCover` to keep them buildable. Decide whether to clean up.
- **Full-video re-render not yet done**. After at least `ChallengeGame` / `StoryMoment` / `CelebrateWin` are migrated, regenerate `test-video.mp4` end-to-end to confirm the visual rhythm holds across shots.

---

## How to run the validation

From `renderers/remotion-video/`:

```bash
# Type-check after any change
npm run lint

# Re-render AiIntro shot baseline
npx remotion still src/index.ts VideoComposition public/output/aiintro.png \
  --frame=30 --browser-executable="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# Re-render Cover
npx remotion still src/index.ts Cover public/output/cover.png \
  --frame=30 --browser-executable="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# Re-render full video (21s, ~3 min)
npx remotion render src/index.ts VideoComposition public/output/video.mp4 \
  --codec=h264 --concurrency=1 \
  --browser-executable="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
```

End-to-end via the platform (server + UI):

```bash
# From repo root
node server.mjs &
curl --noproxy '*' -X POST http://127.0.0.1:8787/api/render-video \
  -H 'Content-Type: application/json' \
  -d '{"projectId":"<an existing v2-schema project id>"}'
```

The test project from the earlier pipeline validation is `projects/2605200900-server-pipeline-test/` — its `source/render-data.json` already conforms to v2 schema and now picks up V12 visual treatment because the renderer changed under it.

---

## One-line summary for the next agent

> V12 design baseline lives in `AiIntro.tsx` + `YaoningCover.tsx`. Copy that pattern (surface-card header, splitKeyword-trimmed phrase, inverted dark caption, scene-specific hero SVG) into `ChallengeGame` / `StoryMoment` / `CelebrateWin`, then re-render the full video. Do NOT bring back dark headers — user rejected them.

# JSON Schemas

Exact structure for generated JSON. Both tracks share common fields; track-specific fields are noted.

---

## Common Types

```ts
type ColorScheme = "dark" | "light";

type AnimationStyleId =
  | "smooth-reveal"
  | "snappy-pop"
  | "bouncy-enter"
  | "dramatic-slam"
  | "heavy-settle";

type CoverData = {
  title: string;          // max 24 Chinese characters, supports \n for line break
  subtitle: string;       // max 20 Chinese characters
  titleHighlight: string; // one word that appears verbatim in title
};
```

---

## Knowledge Sharing Schema

```ts
type KnowledgeContentType =
  | "data-insight"
  | "step-breakdown"
  | "concept-explain"
  | "quote-insight"
  | "comparison"
  | "checklist"
  | "timeline";

type KnowledgeSceneId =
  | "data-reveal"
  | "step-list"
  | "concept-card"
  | "quote-hero"
  | "comparison-split"
  | "checklist-reveal"
  | "timeline-flow"
  | "material-board"
  | "annotated-proof"
  | "case-breakdown";

type KnowledgeMotionPresetId =
  | "stat-slam"
  | "counter-tick"
  | "list-stagger"
  | "highlight-sweep"
  | "split-slide"
  | "check-draw"
  | "dot-appear";

type KnowledgeShotData = {
  text: string;                        // max 20 Chinese chars
  keyword: string;                     // must appear verbatim in text
  caption: string;                     // max 30 Chinese chars
  captionKeyword: string;              // must appear verbatim in caption
  scene: KnowledgeSceneId;
  motionPreset: KnowledgeMotionPresetId;
  animationStyle: AnimationStyleId;

  // Optional enrichment fields (use when content type requires them)
  dataValue?: string;                  // e.g. "78%" — for data-insight stat-slam counter
  stepNumber?: number;                 // 1-based — for step-breakdown shots
  listIndex?: number;                  // 1-based — for checklist item shots
  timelineYear?: string;               // e.g. "2023" — for timeline milestone shots
  comparisonSide?: "left" | "right" | "neutral"; // for comparison shots
  evidenceTitle?: string;               // Odin evidence-board title
  evidenceSubtitle?: string;            // Odin evidence-board subtitle
  evidenceLines?: string[];             // document lines shown as material
  evidenceHighlights?: string[];        // lines or phrases to highlight
  tagItems?: string[];                  // black label tags
  proofLabels?: string[];               // short proof buttons / labels
  caseBefore?: string;                  // case-breakdown old problem
  caseDecision?: string;                // case-breakdown judgement
  caseResult?: string;                  // case-breakdown outcome
  callout?: string;                     // red annotation label
};

type KnowledgeScriptData = {
  track: "knowledge-sharing";
  contentType: KnowledgeContentType;
  title: string;
  subtitle: string;
  fps: 30;
  width: 1080 | 1440;                  // Odin evidence videos use 1440x1920; generic knowledge can use 1080x1920
  height: 1920;
  colorScheme: ColorScheme;
  accentColor: string;                 // hex, from color-palettes.md
  shotDurationFrames: number;          // 75–105 depending on content type
  cover: CoverData;
  shots: KnowledgeShotData[];          // 5–8 shots
};
```

---

## AI Education Schema

```ts
type EducationContentType =
  | "ai-concept"
  | "family-challenge"
  | "story-scene"
  | "usage-demo"
  | "safety-rule"
  | "achievement"
  | "qa-reveal";

type EducationSceneId =
  | "ai-intro"
  | "challenge-game"
  | "story-moment"
  | "demo-walk"
  | "boundary-card"
  | "celebrate-win"
  | "qa-flip";

type EducationMotionPresetId =
  | "character-bounce"
  | "bubble-pop"
  | "star-burst"
  | "question-wobble"
  | "reveal-spring"
  | "warning-pulse"
  | "confetti-burst";

type AgeTarget = "4-6" | "7-10" | "11-14";

type EducationShotData = {
  text: string;                        // max 20 Chinese chars
  keyword: string;                     // must appear verbatim in text
  caption: string;                     // max 30 Chinese chars
  captionKeyword: string;              // must appear verbatim in caption
  scene: EducationSceneId;
  motionPreset: EducationMotionPresetId;
  animationStyle: AnimationStyleId;

  // Optional enrichment fields
  characterName?: string;              // e.g. "豆豆" — for ai-intro, story-moment shots
  stepNumber?: number;                 // 1-based — for usage-demo action shots
  lottieUrl?: string;                  // LottieFiles URL — for confetti-burst, star-burst
  isQuestionShot?: boolean;            // true on the question shot of qa-reveal
  isAnswerShot?: boolean;              // true on the answer shot of qa-reveal
};

type EducationCoverData = CoverData & {
  characterName?: string;              // character present on cover
};

type EducationScriptData = {
  track: "ai-education";
  contentType: EducationContentType;
  title: string;
  subtitle: string;
  fps: 30;
  width: 1080;
  height: 1920;
  colorScheme: ColorScheme;
  accentColor: string;                 // hex, from color-palettes.md
  ageTarget: AgeTarget;
  shotDurationFrames: number;          // 85–105 depending on content type
  cover: EducationCoverData;
  shots: EducationShotData[];          // 5–8 shots
};
```

---

## Validation Rules (machine-checkable)

1. `keyword` ∈ `text` (substring match)
2. `captionKeyword` ∈ `caption` (substring match)
3. `scene` ∈ valid scene IDs for the track
4. `motionPreset` ∈ valid preset IDs for the track
5. `animationStyle` ∈ `["smooth-reveal", "snappy-pop", "bouncy-enter", "dramatic-slam", "heavy-settle"]`
6. `shots.length` ∈ [5, 8]
7. `fps === 30`, `height === 1920`; Odin evidence-board videos should use `width === 1440`, generic vertical knowledge videos may use `width === 1080`
8. `colorScheme` ∈ `["dark", "light"]`
9. For `qa-reveal`: exactly one shot has `isQuestionShot: true`, exactly one has `isAnswerShot: true`
10. For `achievement`: at least one shot has `lottieUrl` set

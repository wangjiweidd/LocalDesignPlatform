# Motion Preset Catalog

All valid `motionPreset` field values. Do not invent new IDs.  
All presets are driven by `useCurrentFrame()` — no CSS animations.

---

## Knowledge Sharing Presets

### `stat-slam`

**Action:** Element scales up from 0.6 to 1.06, then springs back to 1.0. Creates a weighted, impactful entrance.  
**Duration:** 20 frames  
**Spring config:** `{ damping: 12, stiffness: 300 }` — fast rise, slight overshot  
**When to use:** Numbers, statistics, quote hero text — anything that needs to land with impact  
**Typical scene:** `data-reveal`, `quote-hero`

---

### `counter-tick`

**Action:** Numeric value counts up from 0 (or a lower value) to the target number. Each tick is a frame-driven increment.  
**Duration:** 45 frames  
**Easing:** `Easing.out(Easing.exp)` — fast start, slow finish (lands satisfyingly)  
**When to use:** The `dataValue` field on `data-reveal` scenes. Numbers only.  
**Typical scene:** `data-reveal`  
**Note:** Combine with `stat-slam` — counter-tick drives the number value, stat-slam drives the scale.

---

### `list-stagger`

**Action:** Each list item slides up from 20px below and fades in. Each subsequent item is delayed by 6 frames.  
**Duration per item:** 18 frames  
**Spring config:** `{ damping: 200 }` — smooth, no bounce  
**When to use:** Any multi-item reveal — steps, checklist items, comparison bullets  
**Typical scene:** `step-list`, `checklist-reveal`

---

### `highlight-sweep`

**Action:** An underline or highlight bar draws from left to right across the keyword. Width interpolates from 0% to 100%.  
**Duration:** 20 frames  
**Easing:** `Easing.out(Easing.quad)`  
**When to use:** `keyword` emphasis on concept or demo shots  
**Typical scene:** `concept-card`, `demo-walk`

---

### `split-slide`

**Action:** Left panel slides in from the left edge; right panel slides in from the right edge simultaneously. Both settle at center.  
**Duration:** 22 frames  
**Spring config:** `{ damping: 20, stiffness: 200 }` — snappy  
**When to use:** Comparison scenes only  
**Typical scene:** `comparison-split`

---

### `check-draw`

**Action:** A checkmark SVG path draws itself (stroke-dashoffset from 100% to 0%). Followed by a brief green flash on the list item.  
**Duration:** 18 frames  
**Easing:** `Easing.inOut(Easing.quad)`  
**When to use:** Checklist items being marked complete  
**Typical scene:** `checklist-reveal`

---

### `dot-appear`

**Action:** A timeline dot scales from 0 to 1.12 then settles at 1.0. Label fades up from 8px below.  
**Duration:** 16 frames  
**Spring config:** `{ damping: 200 }` for dot; `smooth-reveal` easing for label  
**When to use:** Timeline milestones  
**Typical scene:** `timeline-flow`

---

## AI Education Presets

### `character-bounce`

**Action:** Character illustration does a gentle float — translateY oscillates ±8px with a sine wave, looped. On entrance, scales from 0.85 to 1.0.  
**Duration (entrance):** 20 frames; **Loop:** continuous  
**Spring config (entrance):** `{ damping: 8 }` — bouncy  
**When to use:** Any shot with a character present  
**Typical scene:** `ai-intro`, `story-moment`

---

### `bubble-pop`

**Action:** Speech bubble scales from 0 with slight overshoot (1.0 → 1.08 → 1.0). Accompanied by a soft drop shadow expansion.  
**Duration:** 14 frames  
**Spring config:** `{ damping: 15, stiffness: 250 }`  
**When to use:** Speech bubbles, thought bubbles  
**Typical scene:** `ai-intro`

---

### `star-burst`

**Action:** 6–8 star shapes radiate outward from a center point. Each star scales from 0 and fades out as it moves outward. Staggered by 2 frames each.  
**Duration:** 30 frames total  
**Spring config per star:** `{ damping: 8 }` — playful  
**When to use:** Achievement reveals, challenge intros, celebration moments  
**Typical scene:** `challenge-game`, `celebrate-win`  
**Lottie alternative:** Use `lottieUrl` field with a star-burst Lottie from LottieFiles if available

---

### `question-wobble`

**Action:** Question mark graphic wobbles — rotates between -8deg and +8deg twice, then settles. Element also bobs up 6px and returns.  
**Duration:** 28 frames  
**Easing:** `Easing.inOut(Easing.sin)` for each wobble cycle  
**When to use:** Question shots in `qa-reveal` content type  
**Typical scene:** `qa-flip`

---

### `reveal-spring`

**Action:** Answer element enters from 40px below with spring. Scale goes from 0.9 to 1.0. Background color transitions from question-tone to answer-tone over 20 frames.  
**Duration:** 22 frames  
**Spring config:** `{ damping: 18, stiffness: 180 }` — visible spring, not over-bouncy  
**When to use:** Answer reveal in `qa-reveal` content type  
**Typical scene:** `qa-flip`  
**Override:** On the answer shot, always set `motionPreset: "reveal-spring"` regardless of track default.

---

### `warning-pulse`

**Action:** A border frame around the scene pulses — opacity oscillates between 0.4 and 1.0, three times. Element scale pulses from 1.0 to 1.03 and back.  
**Duration:** 36 frames (3 pulse cycles)  
**Easing:** `Easing.inOut(Easing.sin)` per cycle  
**When to use:** Safety rule shots. Creates urgency without aggression.  
**Typical scene:** `boundary-card`  
**Color:** Always amber (`#F59E0B`), never red.

---

### `confetti-burst`

**Action:** Confetti particles radiate from center-top and fall with gravity simulation. Colors match the celebration palette. Looping for the duration of the shot.  
**Implementation:** Use Lottie (`@remotion/lottie`) with a confetti animation from LottieFiles.  
**Lottie search query:** `"confetti celebration"` on lottiefiles.com — pick one with transparent background  
**Duration:** Full shot duration  
**When to use:** `celebrate-win` scene only  
**Typical scene:** `celebrate-win`  
**Note:** Set `lottieUrl` field in the shot data. This preset activates the Lottie layer.

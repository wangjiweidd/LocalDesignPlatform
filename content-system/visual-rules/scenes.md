# Scene Catalog

All valid `scene` field values. Do not invent new IDs.  
Scenes marked `[TO BUILD]` need a Remotion component created before rendering.

---

## Knowledge Sharing Scenes

### `data-reveal` [TO BUILD]

**Track:** knowledge-sharing  
**Layout:** Dark full-bleed background. Massive centered number (160–200px). One-line context below. Minimal decoration — nothing competes with the number.  
**Background:** Solid `#0F172A` (slate-900) or deep gradient  
**Key visual:** The `dataValue` field renders as the hero element with counter animation  
**Transition in:** Number scales from 0 via `dramatic-slam`; context fades in 12 frames later

---

### `step-list` [TO BUILD]

**Track:** knowledge-sharing  
**Layout:** Light background. Step number (large, accent color) top-left. Step title center. Progress dots or bar at top.  
**Background:** `#F8FAFC` (slate-50)  
**Key visual:** Step number + title; previous steps visible as faded items above  
**Transition in:** New step slides up from bottom via `list-stagger`

---

### `concept-card` [TO BUILD]

**Track:** knowledge-sharing  
**Layout:** Gradient background (dark-to-accent). Large icon or illustration top-center. Term highlighted in accent color. Definition below.  
**Background:** Gradient `#1E1B4B` → `#312E81` (indigo range)  
**Key visual:** The concept term rendered large with `highlight-sweep` underline  
**Transition in:** Card scales up from 0.92 via `smooth-reveal`

---

### `quote-hero` [TO BUILD]

**Track:** knowledge-sharing  
**Layout:** Near full-bleed background color. Quote text fills 80% of width at 80–96px. No images. Author/source in small text bottom.  
**Background:** Solid brand color or dark gradient  
**Key visual:** The quote text itself — no competing elements  
**Transition in:** Text slams in at 1.06 scale then springs to 1.0 via `dramatic-slam`

---

### `comparison-split` [TO BUILD]

**Track:** knowledge-sharing  
**Layout:** Screen divided vertically. Left panel = option A (cooler tone). Right panel = option B (warmer tone). Labels at top of each panel.  
**Background:** Left `#1E293B`, right `#0F172A` — separated by a thin accent line  
**Key visual:** Two columns with their own text and icon  
**Transition in:** Left panel slides from left, right from right, simultaneously via `split-slide`

---

### `checklist-reveal` [TO BUILD]

**Track:** knowledge-sharing  
**Layout:** Light background. Numbered or bulleted list. Items appear one at a time. Completed items show a drawn checkmark.  
**Background:** `#F8FAFC` with subtle grid or dot pattern  
**Key visual:** Animated checkmark drawing on each item  
**Transition in:** Each item slides up with `list-stagger`; checkmark draws via `check-draw`

---

### `timeline-flow` [TO BUILD]

**Track:** knowledge-sharing  
**Layout:** Dark background. Horizontal dotted line across center. Year/label pairs appear sequentially. Current dot pulses.  
**Background:** `#0F172A`  
**Key visual:** Dots on a horizontal axis; active dot is larger and accent-colored  
**Transition in:** Dot pulses in via `dot-appear`; label fades up below

---

## AI Education Scenes

### `ai-intro` [TO BUILD]

**Track:** ai-education  
**Layout:** Warm light background. Character illustration center or left. Speech bubble right or above. Character name label below illustration.  
**Background:** Gradient `#FFF7ED` → `#FFEDD5` (orange-50 range)  
**Key visual:** The AI character (e.g., 豆豆 robot) with animated speech bubble  
**Transition in:** Character bounces in via `character-bounce`; bubble pops via `bubble-pop`

---

### `challenge-game` [TO BUILD]

**Track:** ai-education  
**Layout:** Playful, game-card style. Bold title top. Challenge description center. Star or badge graphic. "Let's go!" CTA style bottom element.  
**Background:** Gradient `#EDE9FE` → `#DDD6FE` (violet range) or `#FEF3C7` → `#FDE68A` (yellow range)  
**Key visual:** Large star or trophy graphic; challenge text in rounded font  
**Transition in:** Stars burst via `star-burst`; card scales up via `bouncy-enter`

---

### `story-moment` [TO BUILD]

**Track:** ai-education  
**Layout:** Full-bleed scene illustration as background (or colored gradient scene). Character positioned left. Text overlay in semi-transparent card at bottom 35%.  
**Background:** Scene-specific illustration or warm gradient  
**Key visual:** Character expression + scene context  
**Transition in:** Scene fades/slides in; light-leak overlay at scene transitions; text slides up via `smooth-reveal`

---

### `demo-walk` [TO BUILD]

**Track:** ai-education  
**Layout:** Device mockup (phone or tablet) center. Screen content simplified. Step annotation arrow or highlight overlaid. Step number top-right corner.  
**Background:** `#EFF6FF` (blue-50) or `#F0FDF4` (green-50)  
**Key visual:** The device screen with highlighted action area  
**Transition in:** Device slides in from bottom; annotation arrow draws via `highlight-sweep`

---

### `boundary-card` [TO BUILD]

**Track:** ai-education  
**Layout:** Dark or deep-amber background. Rule statement large center. Icon (shield, check, or caution) top. Pulsing border frame.  
**Background:** `#1C1917` (stone-900) or `#78350F` (amber-900)  
**Key visual:** The rule text; pulsing amber border frame  
**Transition in:** Border pulses via `warning-pulse`; text fades in via `smooth-reveal`  
**Note:** Never use red. Amber conveys firmness without fear.

---

### `celebrate-win` [TO BUILD]

**Track:** ai-education  
**Layout:** Light, joyful background. Achievement text large center. Confetti or stars overlay (Lottie). Character celebrating bottom or side.  
**Background:** Gradient `#ECFDF5` → `#D1FAE5` (emerald range)  
**Key visual:** Confetti Lottie animation + achievement text  
**Transition in:** Confetti bursts via `confetti-burst`; text scales up via `bouncy-enter`

---

### `qa-flip` [TO BUILD]

**Track:** ai-education  
**Layout:** Two states. Question state: question text center, question mark graphic, indigo/violet tone. Answer state: answer springs in from below, warmer tone.  
**Background (question):** `#EEF2FF` (indigo-50)  
**Background (answer):** `#FFF7ED` (orange-50)  
**Key visual:** The question → answer transition; answer springs up and lands  
**Transition in (question):** Question wobbles via `question-wobble`  
**Transition in (answer):** Answer springs up via `reveal-spring`

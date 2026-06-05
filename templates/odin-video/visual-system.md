# Odin Visual System

Use this file to choose layouts and motion inside the Odin HyperFrames style.

## Core Principle

The video should feel like a hand-built coaching board. The viewer should always know:

1. what material is being discussed,
2. which part is being pointed at,
3. what judgment the voiceover is making.

HyperFrames should do more than place static cards on a timeline. Each Odin preview should have:

- a visible evidence target, not just a statement,
- one timed annotation action per key judgment,
- a single bottom caption sourced from the voiceover,
- a clear material layer, judgment layer, and annotation layer,
- motion that reveals reasoning order rather than decorative movement.

Use this layer order unless a real screenshot forces a different arrangement:

1. paper background and grain,
2. material or evidence board,
3. text rows and keyword bars,
4. red annotations, stamps, and focus notes,
5. bottom caption.

## Scene Types

### Material Duo

Use when the script introduces evidence, screenshots, recordings, or source material.

Typical layout:

- left: video/recording/sticker/reaction placeholder
- right: screenshot/document/material board
- bottom: voiceover caption

Motion:

- material slides in or drops in
- no more than one red annotation unless the point requires it
- if the material is fake or missing, label it as a placeholder in the storyboard, not inside the final frame
- add one focus ring or marker sweep only after the material has settled

### Evidence Board

Use when the script explains reasoning in 2-3 rows.

Typical layout:

- title at top
- cream paper board in center
- black labels on the left
- evidence text on the right
- red arrows/circles only on the target evidence

Motion:

- rows appear in order
- red annotation appears after the row is visible
- row motion should be staggered; all rows arriving at once weakens the coaching feel
- if there is a final judgment, use a stamp, focus note, or red circle instead of another paragraph

### Keyword Bars

Use when the script classifies project types, decision dimensions, or reusable patterns.

Typical layout:

- section title at top
- black keyword bars in the middle
- optional stamps below

Motion:

- bars pop in one by one
- sound effect only if the bar is a key turn, not every bar
- keyword bars should contain short labels, not sentences
- use the final bar for the turn or consequence, usually with orange text

### Screenshot Focus

Use when the user provides a real screenshot and asks to point at a specific area.

Typical layout:

- screenshot is large enough to inspect
- mask or dim unimportant areas if needed
- red circle or underline must align to a real target

Motion:

- zoom or pan to target area
- marker sound only when annotation appears
- dimming is allowed, but the focused target must remain inspectable
- never add red circles that point to empty or generic areas

### Sticker Reaction

Use sparingly when the script needs an emotional beat, contradiction, or "this is wrong" moment.

Typical layout:

- sticker or generated image supports the point
- do not let it compete with evidence text

Motion:

- pop or bounce once
- avoid repeated decorative loops
- sticker moments must resolve a contradiction or emotional beat; otherwise use a stamp

### Answer Signal Machine

Use when the video teaches a designer how to answer an interview, portfolio, resume, or case-study question with a clear reasoning chain.

Canonical template:

```text
templates/odin-video/hyperframes/answer-signal-machine/
```

Typical layout:

- dark cinematic canvas with one Chinese sans-serif stack;
- opening question broken into low-signal tokens;
- 3-step logic chain with a visible path;
- one or two long examples shown through a moving filmstrip focus window;
- assembly scene that turns variables into a usable sentence;
- final checklist that frames the viewer as a decision maker.

Motion:

- scenes move like video segments, not static pages;
- long example text pans through a focus window;
- off-window filmstrip cards are dimmed so the focus box actually guides attention;
- subtitles appear by voiceover timing, not as a full transcript;
- use sparse bursts, stickers, and light sweeps only when they clarify a turn.

Avoid:

- filling every scene with full paragraphs;
- keeping all filmstrip cards at equal visual weight;
- shrinking text below mobile readability;
- adding a repeated header to compensate for weak scene structure;
- replacing the reasoning chain with generic decorative motion.

## Stronger HyperFrames Moves

Use these when they clarify the argument:

- Marker sweep: draw an SVG path around a real phrase or UI area with `strokeDashoffset`.
- Evidence reveal: stagger proof rows, then add a red arrow or circle after the target row appears.
- Material drop: move a screenshot or document board in with a short settle, then freeze it for reading.
- Keyword stack: pop bars one by one, with the final bar in orange for the consequence.
- Focus note: a rotated paper label that appears after the evidence, never before.
- Progress rail: a narrow side rail showing scene count or argument progression.

Avoid these because they make the video feel generic:

- floating gradient backgrounds,
- auto-playing decorative loops,
- random particle fields,
- multi-card dashboards,
- subtitle plus caption plus headline all saying the same thing.

## Lottie Support

`lottie-web` can help when a tiny accent animation is clearer than hand-authoring SVG timing.

Good uses:

- stamp hit
- marker spark
- brief sticker reaction
- one-shot emphasis burst behind a keyword

Bad uses:

- looping background decoration
- replacing the main board or material animation
- running several Lottie layers at once
- using a Lottie asset where a simple SVG path draw would be clearer

If Lottie is used, it should be a secondary layer that starts after the main material is already readable.

## Font Rules

- Section titles: heavy Chinese serif.
- Evidence paragraphs: heavy sans-serif.
- Bottom captions: heavy sans-serif.
- Pinyin line: small sans-serif with letter spacing.
- Do not use a different font family per scene.

## Sound Effect Rules

Use a sound effect only when there is a visible action:

- marker line/circle
- material drop
- one important pop/stamp
- rare transition whoosh

No scene gets sound effects just because it starts.

## Final Export Rule

HTML preview is the default deliverable. Render `final.mp4` only after explicit user confirmation.

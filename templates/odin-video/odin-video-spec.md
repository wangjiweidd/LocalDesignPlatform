# Odin Video Spec

Use this before writing `work/script.md` or building the HyperFrames HTML preview.

The goal is not to fill a form. The goal is to turn a rough topic into a video direction that feels like Odin: evidence-led, visually intentional, and credible to designers.

Start from `defaults.md`. Only write `[needs user confirmation]` when the missing item affects factual accuracy, the core judgment, or a material-dependent visual decision.

## Output

Create one editable file:

```text
work/odin-video-spec.md
```

Keep it short enough to review in one pass. If a detail is not known yet, write `[needs user confirmation]` instead of inventing it.

## 1. Creative Brief

- Working title:
- Target viewer:
- Viewer pain:
- One-sentence takeaway:
- Desired action after watching:
- Platform and canvas: default `3:4, 1440x1920`
- Target length:
- Evidence available:
- Evidence missing:

Do not reopen stable Odin defaults here. This section is only for project-specific differences.

## 2. Odin Point Of View

Every Odin video needs a judgment, not just an explanation.

- Surface topic:
- Deeper design-career problem:
- Contrarian or useful judgment:
- What this video refuses to become:
- What a generic creator would say:
- What Odin should say instead:

## 3. Designer Aesthetic Direction

Choose one dominant visual mode. Do not mix all of them in one short video.

- `evidence-board`: best for portfolio, resume, interview, and case-study critique.
- `material-desk`: best when real screenshots, documents, recordings, or pasted copy drive the argument.
- `keyword-stack`: best for classification, frameworks, lists, and decision dimensions.
- `screen-focus`: best when one real UI or portfolio screenshot needs close inspection.
- `coaching-room`: best for slower voiceover where the viewer should feel personally addressed.
- `answer-signal-machine`: best for interview, portfolio, resume, and case-study answer videos that need a 3-step logic chain plus long example text moving through a focus window.

Required aesthetic notes:

- Visual taste:
- Typography attitude:
- Material texture:
- Annotation style:
- Motion feel:
- What must not appear:

Default Odin taste:

- Pale green paper background.
- Heavy Chinese display serif for section titles.
- Heavy sans-serif for evidence, labels, and bottom captions.
- Cream evidence boards, black keyword bars, red marker arrows/circles, stamps, sparse sticker moments.
- Motion reveals reasoning order. It should never feel like random decoration.

## 4. Material Plan

List every material that should appear on screen.

```text
M01
type: screenshot | recording | pasted-copy | document | sticker | generated-image | placeholder
file:
used in paragraph:
focus target:
visual action:
status: available | missing | generate | search
```

Rules:

- Real material is better than symbolic decoration.
- A red circle or arrow must point to a real target.
- A placeholder is allowed only when the material is missing and the preview still needs structure.
- Stickers are for emotional turns or contradiction moments, not decoration.

## 5. Script Shape

Before writing the full script, define the paragraph beats.

```text
# 01
job: hook | setup | evidence | judgment | contrast | consequence | takeaway
voiceover point:
screen role:
scene type:
material:
annotation action:
estimated duration:
```

Rules:

- One paragraph gets one clear point.
- Voiceover and bottom caption use the same wording later in `work/script.md`.
- Each key judgment needs a visible material, evidence row, keyword bar, or annotation action.
- If a paragraph has no visual job, merge it, cut it, or turn it into evidence.
- If the paragraph can be expressed with Odin defaults and existing material logic, do not add extra confirmation placeholders.

## 6. HyperFrames Storyboard

Map script beats to `visual-system.md`.

```text
Scene 01
paragraph: # 01
scene type: Material Duo | Evidence Board | Keyword Bars | Screenshot Focus | Sticker Reaction
layout:
entry motion:
main annotation:
caption:
sound effect:
transition:
```

Rules:

- Use HTML preview as the default deliverable.
- Do not render MP4 until the user confirms.
- Sound effects are sparse and action-bound.
- The bottom caption is the exact voiceover text, not a rewritten subtitle.

## 7. Quality Gate

Before creating `work/html/`, check:

- Does this feel like a design-career judgment rather than generic knowledge content?
- Can a designer immediately tell what evidence is being discussed?
- Does every red annotation point to a real phrase, UI area, or material target?
- Is there one dominant visual mode instead of a mixed style pile?
- Are the title, evidence, and caption readable on a phone?
- Is the video avoiding SaaS dashboards, random particles, and decorative motion?
- Is any `lottie-web` usage sparse, local, and subordinate to the evidence board logic?
- Is any `[needs user confirmation]` item blocking accuracy?

If the answer is weak, revise the spec before writing HTML.

# Motion Library Operating Model

Scope: Yaoning Remotion video pipeline.

## Short Term

Maintain a small reusable library:

- scene templates: reusable narrative layouts
- visual components: reusable rendered elements
- motion presets: reusable timing and movement
- design tokens: reusable spacing, color, type, and animation constants
- assets: reusable transparent PNG or Lottie files

Do not add a new abstraction after only one use unless it is obviously generic.

## Mid Term

Run `npm run motion:review` after every 3-5 videos or during the weekly automation.

Promote when the same expression repeats:

- same `scene` repeated across topics -> scene template candidate
- same `motionPreset` repeated with stable timing -> preset candidate
- same visual block copied across components -> visual component candidate
- same color/spacing/type value repeated -> design token candidate
- same asset reused across videos -> asset catalog candidate

Keep project-specific items local until they repeat.

Use external sources only through the Yaoning style gate:

```text
external reference -> fit score -> candidate pattern -> local use -> repeated use -> formal catalog
```

External sources live in `content-system/reference-sources/external-motion-sources.md`.
Promotion rules live in `content-system/visual-rules/yaoning-style-gate.md`.

## Long Term

Let script data drive visual selection.

Target flow:

```text
script intent -> content type -> scene template -> visual beats -> motion preset -> assets -> render
```

The automation should recommend candidates first. Code changes require explicit user approval.

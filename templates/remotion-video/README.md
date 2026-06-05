# Remotion Video Template

This directory is the Local Design Platform source of truth for Remotion video production rules.

## Content System

The migrated video generation documents live in:

```text
templates/remotion-video/content-system/
```

Agents should read these files before generating video script data:

- `content-system/system-prompt.md`
- `content-system/tracks/ai-education.md`
- `content-system/tracks/knowledge-sharing.md`
- `content-system/visual-rules/schemas.md`
- `content-system/visual-rules/scenes.md`
- `content-system/visual-rules/motion-presets.md`
- `content-system/visual-rules/animation-styles.md`
- `content-system/visual-rules/color-palettes.md`
- `content-system/visual-rules/typography.md`
- `content-system/visual-rules/odin-style-gate.md` when `videoAccount=odin`

Optional reference material is recorded in:

- `reference-library.md`

This reference library is for inspiration and technical selection only. It does not override the
content-system schema, scene IDs, motion presets, or allowed values.

Example payloads are available in:

- `content-system/examples/education-example.json`
- `content-system/examples/knowledge-example.json`

## Repository Policy

Do not use `/Users/jiweiwang/Downloads/Code case/Remotion-Video` as the long-term source of truth. It was only the migration source for these documents.

## Renderer

The Remotion renderer now lives in:

```text
renderers/remotion-video/
```

`/api/render-video` should render through that local renderer and copy `cover.png`, `frame.png`, and `video.mp4` back into the active project output folder.

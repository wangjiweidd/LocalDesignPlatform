# Remotion Branch Video

This is an independent Remotion branch-video project created for testing the reusable motion workflow.

It does not reference or modify the original production renderer path recorded in the local design platform.

## Structure

- `src/data/demo.ts` — script, scenes, captions, and `visualBeats`
- `src/motion/motionPresets.ts` — reusable Remotion motion presets
- `src/components/` — reusable visual components
- `src/BranchVideo.tsx` — video and cover compositions
- `public/assets/generated/` — reusable transparent PNG visual assets
- `public/output/` — generated covers, still frames, and videos; ignored by Git

## Commands

```bash
npm install
npm run dev
npm run lint
npm run still:cover
npm run still:frame
npm run render
```

The important production rule is:

```text
topic data -> visualBeats -> reusable motion presets -> Remotion render
```

Do not create one-off animation code for every topic. Add new motion only when it can become a reusable preset.

## Visual Asset Workflow

Use image generation for reusable high-polish visual elements, then let Remotion handle timing, text, and composition.

The current pattern is:

```text
Image-generated transparent assets -> Remotion scene components -> visualBeats -> final render
```

Keep generated text out of image assets whenever possible. Chinese titles, labels, prices, subtitles, and highlights should be rendered in React so they remain editable per topic.

Reusable assets that should be committed live in `public/assets/generated/`. Intermediate chroma-key sources and final renders should not be committed.

The cover is a separate `BranchCover` composition. Do not assume the main video frame is also a good cover; design and render the cover independently.

## Inner Page Layout

Each video shot uses a fixed three-part structure:

```text
top title -> center animated visual -> bottom caption card
```

Use `shot.text` and `shot.keyword` for the top title. Use `shot.caption` and `shot.captionKeyword` for the bottom subtitle/caption card. Do not move subtitles into the top title area.

The top title is centered and persistent for the whole shot. It should not use enter/exit motion. The bottom caption card is the only text layer that follows the script timing with enter/exit motion.

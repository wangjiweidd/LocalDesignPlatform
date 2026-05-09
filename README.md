# Remotion Branch Video

This is an independent Remotion branch-video project created for testing the reusable motion workflow.

It does not reference or modify the original production renderer path recorded in the local design platform.

## Structure

- `src/data/demo.ts` — script, scenes, captions, and `visualBeats`
- `src/motion/motionPresets.ts` — reusable Remotion motion presets
- `src/components/` — reusable visual components
- `src/BranchVideo.tsx` — video and cover compositions

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

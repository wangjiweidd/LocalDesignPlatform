# Remotion Video Pipeline

Independent Remotion pipeline for vertical short videos on the
`codex/remotion-video-pipeline` branch of `wangjiweidd/LocalDesignPlatform`.

## Active Flow

```text
src/data/current-video.ts
-> src/VideoComposition.tsx
-> src/scenes/*
-> public/output/
```

The current script is selected by `src/data/current-video.ts`. Scene IDs and
motion preset IDs are typed in `src/data/types-v2.ts` and documented under
`content-system/visual-rules/`.

## Commands

```bash
npm install
npm run dev
npm run lint
npm run still:cover
npm run still:frame
npm run render
npm run render:full
npm run motion:review
```

Outputs are written to `public/output/` and are intentionally ignored by Git.

## Git Scope

Commit source, reusable assets, docs, and content-system rules.

Do not commit generated output, local bundles, temp files, `.DS_Store`, or
`node_modules`.

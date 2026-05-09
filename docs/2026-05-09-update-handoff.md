# Codex Handoff - 2026-05-09

Repo: `https://github.com/wangjiweidd/LocalDesignPlatform`
Branch: `codex/remotion-video-pipeline`
Do not merge to `main` unless explicitly asked.

## Purpose

Standalone Remotion branch-video pipeline for Yaoning.

Core rule:

```text
topic data -> shots -> visualBeats -> reusable motion presets -> render
```

Prefer data edits over one-off component edits.

## Files

- `src/data/demo.ts`: topic, cover, shots, captions, `visualBeats`.
- `src/data/types.ts`: data contracts.
- `src/motion/motionPresets.ts`: reusable animation presets.
- `src/BranchVideo.tsx`: video + cover compositions.
- `src/components/Caption.tsx`: top title + bottom caption.
- `src/components/Illustrations.tsx`: center visuals.
- `public/assets/generated/`: committed reusable transparent PNGs.
- `public/output/`: ignored render outputs.

## Layout Contract

```text
top title -> center animated visual -> bottom caption card
```

- Top title: `shot.text` + `shot.keyword`; centered, persistent, no enter/exit animation.
- Bottom caption: `shot.caption` + `shot.captionKeyword`; follows script timing, with enter/exit animation.
- Cover uses separate `BranchCover` composition.

## Assets

Committed reusable assets:

- `doudou-robot.png`
- `membership-card.png`
- `rules-board.png`
- `purpose-target.png`
- `magnifier.png`

Keep editable Chinese text in React, not baked into images.

## Reproduce

```bash
git clone https://github.com/wangjiweidd/LocalDesignPlatform.git
cd LocalDesignPlatform
git checkout codex/remotion-video-pipeline
npm install
npm run lint
npm run still:cover
npm run still:frame
npm run render
```

Expected render output:

```text
public/output/cover.png
public/output/frame-004.png
public/output/branch-video.mp4
1080x1920, 30fps, 450 frames, 15.061333s
```

## Git Scope

Commit: `src/`, `docs/`, `README.md`, `package*.json`, `public/assets/generated/`.

Do not commit: `public/output/`, `node_modules/`, `build/`, `tmp/`, `.DS_Store`.

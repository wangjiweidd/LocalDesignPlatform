# Local Design Platform Agent Instructions

## Collaboration Rules

- The user is a development beginner and cannot reliably judge technical feasibility.
- Act as a senior technical expert for all technical decisions.
- Do not blindly agree with the user. Use first-principles reasoning to evaluate feasibility, tradeoffs, and the best path.
- Prefer doing the best complete version in one pass. Do not finish a weaker version and then ask whether to do the better version.
- When a request has hidden technical risk, state the risk clearly and choose the more robust implementation path.

## Single Workspace Policy

- The long-term source of truth is this repository:
  `/Users/jiweiwang/Downloads/Code case/Local_Design_Platform`
- Do not treat `/Users/jiweiwang/Downloads/Code case/Remotion-Video` as a long-term production dependency.
- The external `Remotion-Video` directory may be used only as a migration source until its renderer code, assets, scripts, and dependencies are moved into this repository.

## Remotion Video Production Rules

- The Remotion video generation rules live in:
  `templates/remotion-video/content-system/`
- Agents must read this local content-system before generating video script data.
- The required schema and allowed values are defined by:
  - `templates/remotion-video/content-system/visual-rules/schemas.md`
  - `templates/remotion-video/content-system/visual-rules/scenes.md`
  - `templates/remotion-video/content-system/visual-rules/motion-presets.md`
  - `templates/remotion-video/content-system/tracks/ai-education.md`
  - `templates/remotion-video/content-system/tracks/knowledge-sharing.md`
- Do not invent Remotion scene IDs, motion preset IDs, content types, or schema fields outside those documents.
- Optional Remotion inspiration and technical references live in:
  `templates/remotion-video/reference-library.md`
- Treat the reference library as selection guidance only. It must not override the content-system schema or introduce new dependencies without a concrete rendering need.

## Remotion Renderer

- The Remotion renderer implementation lives in:
  `renderers/remotion-video/`
- `/api/render-video` must reference this local renderer by default.
- The renderer is a nested package with its own `package.json`, `package-lock.json`, `tsconfig.json`, source files, reusable assets, and render scripts.
- Renderer output belongs in `renderers/remotion-video/public/output/` during rendering and is copied into each project under `projects/<id>/public/output/`.
- Do not write production data into renderer source files. Project-specific render data belongs in `projects/<id>/source/render-data.json`.

## Odin HyperFrames Video Production Rules

- Odin video production rules live in:
  `templates/odin-video/`
- Stable Odin assumptions live in:
  `templates/odin-video/defaults.md`
- Reusable Odin HyperFrames templates live under:
  `templates/odin-video/hyperframes/`
- The approved dark interview-answer template is:
  `templates/odin-video/hyperframes/answer-signal-machine/`
- When the user says "用 Odin answer-signal-machine 模板" or asks to reuse the "主要负责了什么" dark signal-machine style, use that template's `DESIGN.md`, `content-model.json`, and `template.html` as the starting point.
- For Odin videos, prefer HyperFrames HTML as the default animation preview path.
- Before writing the full script or HTML preview, create `work/odin-video-spec.md` using:
  `templates/odin-video/odin-video-spec.md`
- Treat `work/odin-video-spec.md` as the upstream creative contract for Odin point of view, designer aesthetic direction, material plan, script beats, and HyperFrames storyboard.
- Apply `defaults.md` first so only blocking unknowns become explicit confirmation items.
- Do not render MP4 by default. Stop at HTML preview unless the user explicitly confirms final export.
- Each Odin project should keep this simple user-facing structure:
  - `assets/` for user-provided screenshots, recordings, pasted copy, references, and stickers.
  - `work/` for script, Minimax voiceover text, HTML preview, and intermediate confirmation files.
  - `final.mp4` at the project root only after confirmed export.
- Agent-only timing plans, storyboard JSON, sound-effect plans, and check frames belong in `work/_codex/`.
- Voiceover and bottom captions must use the same wording. The script is the single content source; Minimax formatting may add pauses and line breaks but must not change meaning.
- Use paragraph IDs (`# 01`, `# 02`, `# 03`) and the lightweight insertion syntax in `templates/odin-video/script-markup.md` to map user notes like "here insert screenshot" to exact script positions.
- Sound effects must be sparse and action-bound. Do not add effects to every scene.
- Jianying stickers can be used only when the user provides exportable assets and rights are acceptable. Otherwise build and reuse an Odin-owned sticker library.

## Migration Direction

- Current stage: Remotion content-system documents and renderer code have been migrated into this repository.
- Remaining cleanup: only remove or archive the external `Remotion-Video` directory after local rendering has been verified end to end.

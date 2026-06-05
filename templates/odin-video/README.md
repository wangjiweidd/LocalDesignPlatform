# Odin Video Template

This directory is the source of truth for Odin short-video production.

Odin videos are evidence-led coaching videos for design job, portfolio, interview, and AI design workflow topics. The default renderer is HyperFrames HTML. Do not use Remotion as the default Odin renderer unless the user explicitly asks for a Remotion experiment.

Before asking for more user input, apply the stable defaults in `defaults.md`. The Odin line should not re-ask account positioning, default aesthetic direction, or preview-before-export unless the user explicitly overrides them.

## Default Workflow

1. Topic intake
   - User may provide a title, outline, raw arguments, screenshots, recordings, pasted copy, or material notes.
   - If the topic is vague, first create a concise angle and ask for missing evidence only when it blocks accuracy.

2. Odin video spec
   - Create `work/odin-video-spec.md` before writing the full script.
   - Use `odin-video-spec.md` to define the point of view, designer aesthetic direction, material plan, script beats, and HyperFrames storyboard.
   - Treat this as the upstream creative contract. Do not move into HTML preview while the spec still has blocking `[needs user confirmation]` items.
   - Use `defaults.md` first so only genuinely blocking questions remain.

3. Editable script
   - Create one editable script in `work/script.md`.
   - Voiceover and bottom captions must use the same wording. The script is the single content source.
   - Minimax voiceover formatting may add pauses or line breaks, but must not change meaning.

4. User revision and insertion marks
   - User edits `work/script.md` or sends text revisions in chat.
   - User marks insertion points with paragraph IDs such as `# 01`, `# 02`, `# 03`.
   - See `script-markup.md` for the exact lightweight syntax.

5. HTML animation preview
   - Generate or update HyperFrames HTML in `work/html/`.
   - Do not render MP4 by default.
   - Generate key frame screenshots only when useful for review.
   - Keep temporary JSON, frame checks, and internal notes under `work/_codex/`.

6. User confirmation
   - Stop after the HTML animation preview and ask for confirmation.
   - Only render video after the user explicitly says to export/render the video.

7. Final export
   - Export the final video to the project root as `final.mp4`.
   - Do not scatter render artifacts in the project root.

## Project Folder Contract

Each Odin video project uses this simple structure:

```text
project-folder/
  assets/
  work/
  final.mp4
```

- `assets/`: user-provided screenshots, recordings, pasted copy exports, sticker files, and reference media.
- `work/`: Odin video spec, script, Minimax voiceover text, HyperFrames HTML, preview files, and Codex internal process files.
- `final.mp4`: final confirmed export only.

Agent-only temporary files must go under `work/_codex/`.

## Visual Direction

Use the current Odin HyperFrames visual language:

- 1440x1920 3:4 canvas.
- Pale green paper background.
- Section title with optional pinyin line and yellow highlighter underline.
- Strong Chinese display serif for titles.
- Heavy sans-serif for evidence paragraphs, labels, and bottom captions.
- Evidence paper boards, material/screenshot placeholders, black keyword bars, red hand arrows/circles, stamps, and sparse sticker moments.
- Bottom caption is the voiceover text, not a separate rewritten subtitle.

Avoid:

- SaaS cards or dashboard-like layouts.
- Multiple subtitle layers.
- Random decorative motion.
- Re-rendering video for every small change.
- Adding sound effects on every scene.

## Motion Tooling

- Default motion stack: HTML/CSS transforms, SVG paths, and GSAP paused timelines.
- `lottie-web` is allowed as a supporting tool for sparse accent motion such as stamps, marker bursts, or small reaction stickers.
- Do not use Lottie as the primary scene engine. The main argument structure should still come from boards, materials, captions, and annotations.
- Prefer local JSON assets or accepted reusable sticker animations. Do not depend on remote animation hosting in final preview files.

For layout selection rules, use `visual-system.md`.
For stable assumptions, use `defaults.md`.
For upstream creative direction, use `odin-video-spec.md`.
For per-project execution, use `workflow-checklist.md`.

## Reusable HyperFrames Templates

Named reusable templates live under `hyperframes/`.

### `answer-signal-machine`

Location:

```text
templates/odin-video/hyperframes/answer-signal-machine/
```

Use this when the user asks to reuse the dark, fluid interview-answer video framework from the "你在这个项目里主要负责了什么？" demo.

User-facing call:

```text
用 Odin answer-signal-machine 模板，做《选题名》。
```

Agent shorthand:

- Read `hyperframes/answer-signal-machine/DESIGN.md`.
- Use `hyperframes/answer-signal-machine/content-model.json` as the content slot contract.
- Copy `hyperframes/answer-signal-machine/template.html` into the new project's `work/html/index.html`.
- Keep `preview/index.html` identical to `work/html/index.html`.
- Replace content slots before changing layout or motion.
- Preserve the filmstrip focus mask, timed bottom subtitles, 3-step logic chain, and seven-scene rhythm unless the source material clearly needs a different structure.

## Audio Policy

Only generate a sound-effect version. Effects must be sparse and action-bound:

- red marker circle or arrow
- screenshot/material drop
- important keyword pop
- rare transition whoosh

Do not add sound effects just because a scene changes. Voiceover remains primary.

## Sticker Policy

Jianying stickers may be used only if the user provides exportable media files and rights are acceptable. Otherwise, build an Odin-owned sticker library under project or template assets. Generated stickers are allowed, but once accepted they should be saved and reused instead of regenerated randomly.

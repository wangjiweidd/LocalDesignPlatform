# Odin Workflow Checklist

Use this checklist for each Odin video.

## 1. Intake

- [ ] Topic/title captured.
- [ ] User-provided outline or key argument captured.
- [ ] User materials placed in `assets/` or clearly referenced.
- [ ] Missing factual claims identified.

## 2. Odin Video Spec

- [ ] `work/odin-video-spec.md` exists.
- [ ] `defaults.md` was applied before asking for extra confirmation.
- [ ] Point of view is a design-career judgment, not generic advice.
- [ ] Dominant visual mode is selected from `odin-video-spec.md`.
- [ ] Material plan lists available and missing evidence.
- [ ] Script beats map each paragraph to a screen role.
- [ ] HyperFrames storyboard maps scenes to `visual-system.md`.
- [ ] Blocking `[needs user confirmation]` items are resolved before HTML preview.

## 3. Script

- [ ] `work/script.md` uses paragraph IDs (`# 01`, `# 02`, ...).
- [ ] Voiceover and bottom caption wording share the same source.
- [ ] Script avoids generic AI phrasing.
- [ ] Each paragraph has one clear point.

## 4. User Revision

- [ ] User edits or approves script.
- [ ] Insertion notes are mapped to paragraph IDs.
- [ ] Each material insertion has file, focus, and intended action when available.

## 5. HTML Preview

- [ ] `work/html/` contains the HyperFrames composition.
- [ ] `preview/index.html` contains the same usable preview for the Local Design Studio iframe.
- [ ] Scene type is selected from `visual-system.md`.
- [ ] Real materials are used when available; placeholders are allowed only when material is missing.
- [ ] Red annotations point to exact targets.
- [ ] Each key judgment has a visible material, evidence row, keyword bar, or annotation action.
- [ ] Bottom caption uses the exact voiceover wording for that paragraph.
- [ ] Sound effects are sparse and action-bound.
- [ ] Any `lottie-web` usage is sparse and secondary, not the main scene engine.
- [ ] HyperFrames check has no layout errors.

## 6. Confirmation

- [ ] Stop at HTML preview.
- [ ] Do not render MP4 until the user explicitly confirms.

## 7. Export

- [ ] Render final video only after confirmation.
- [ ] Save final export as project-root `final.mp4`.
- [ ] Keep check frames and temporary files under `work/_codex/`.

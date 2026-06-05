# Odin Style Gate

Use this gate before writing Odin Remotion video scripts or `knowledge-sharing` render data.

## Positioning

Odin videos are for design career, portfolio, interview, AI project packaging, and professional design judgement topics.

The tone should feel:

- specific, practical, and mildly sharp
- editorial rather than cute
- calm, dense, and easy to follow
- grounded in real portfolio or interview situations

## Copy Gate

Pass only if the copy has:

- a concrete design-work scenario in the first shot
- a visible loss, such as being forgotten, sounding shallow, or failing to explain a decision
- a usable correction, not just a slogan
- natural Chinese paragraph rhythm
- one primary reading target per shot
- screen text used as a short anchor, fuller meaning in the bottom caption

Reject if it contains:

- generic AI praise
- "今天分享", "这期内容", "建议收藏", "先说结论"
- "不是 X，而是 Y" as the main structure
- "赋能", "闭环", "提效", "价值感", "颗粒度" without a concrete object
- repeated slogan-like one-line summaries
- fake statistics or unsupported numeric promises

## Visual Gate

Odin coaching videos that follow the current reference template must use a 1440×1920 canvas. The layout should preserve three stable zones:

- top sticker zone: a large, outlined phrase or state label
- middle evidence zone: screenshot/video stand-in, dark text blocks, or black cause-effect bars
- bottom caption zone: one narration subtitle only, fixed near the bottom

Prefer:

- material-board for showing the source document, question list, screenshot, or project material
- annotated-proof for drawing attention to one exact line, region, or decision
- case-breakdown for translating one project into old problem / judgement / result
- quote hero for judgement shots
- comparison split for weak vs strong project expression
- checklist reveal for reusable evaluation criteria
- concept card for one important idea
- dark editorial background with restrained accent

Reject:

- childlike Yaoning visuals
- playful bounce, confetti, cute robot, rewards, or classroom metaphors
- busy dashboards with decorative data
- cyber/neon/game styles
- text baked into image assets
- 1080×1920 Odin evidence-board renders when the goal is to match the reference template
- extra button rows or secondary captions that compete with the bottom narration subtitle

## Remotion Data Rules

- Use `track: "knowledge-sharing"`.
- Use only scene and motion IDs from `schemas.md`, `scenes.md`, and `motion-presets.md`.
- Keep `shots.length` between 5 and 8.
- Keep each shot's screen `text` to 2-8 Chinese characters when subtitles are present.
- Use screen `text` for labels, states, or structure, not a second full sentence.
- Use `caption` for the spoken or subtitle layer. It is the primary reading stream.
- For Odin coaching videos, every 2-3 shots should show a material object: screenshot, document excerpt, question list, answer draft, project page, or generated stand-in document.
- Make `keyword` appear inside `text`, and `captionKeyword` appear inside `caption`.

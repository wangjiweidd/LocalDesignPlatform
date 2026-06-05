# Remotion Content System

AI-driven video script generation for two content tracks:

- **知识干货分享** (Knowledge Sharing) — informational, analytical, adult audience
- **亲子AI教育** (Parent-Child AI Education) — AI literacy, family/child audience

## How Any AI Agent Uses This System

### Step 1 — Identify the track

Read the raw content. Ask:

- Is the audience adults consuming information? → **knowledge-sharing**
- Does the content involve children learning or using AI? → **ai-education**

### Step 2 — Read track rules

- `tracks/knowledge-sharing.md` — 7 content types, visual routing per type
- `tracks/ai-education.md` — 7 content types, visual routing per type

### Step 3 — Generate JSON

Follow `system-prompt.md` exactly. Output a JSON object that conforms to `visual-rules/schemas.md`.

The JSON output feeds directly into a Remotion render pipeline:
```
content-system JSON → src/data/ → Remotion composition → npm run render
```

---

## File Map

| File | Purpose |
|------|---------|
| `system-prompt.md` | Master generation instructions — AI reads this to produce JSON |
| `tracks/knowledge-sharing.md` | Content types + visual routing for knowledge track |
| `tracks/ai-education.md` | Content types + visual routing for education track |
| `visual-rules/scenes.md` | All valid scene IDs with layout descriptions |
| `visual-rules/motion-presets.md` | All valid motion preset IDs with behavior |
| `visual-rules/animation-styles.md` | Named spring/easing configs (referenced by preset) |
| `visual-rules/color-palettes.md` | Track-specific hex color systems |
| `visual-rules/typography.md` | Font families, sizes, weights per track |
| `visual-rules/schemas.md` | Exact JSON schema for both tracks |
| `examples/knowledge-example.json` | Complete working example — knowledge track |
| `examples/education-example.json` | Complete working example — education track |

---

## Notes for AI Agents

- All scene IDs and motion preset IDs are defined in `visual-rules/`. Do not invent new IDs.
- The `keyword` field must appear verbatim inside the `text` field.
- The `captionKeyword` field must appear verbatim inside the `caption` field.
- Shot count: 5–8 shots per video (not counting cover).
- Scenes in `visual-rules/scenes.md` marked `[TO BUILD]` need Remotion components created before rendering.

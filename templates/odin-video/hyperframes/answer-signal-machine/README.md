# Answer Signal Machine Template

`answer-signal-machine` is a reusable Odin HyperFrames template for interview, portfolio, resume, and case-study coaching videos where the viewer needs to understand an answer structure, not just read a static page.

Use it when the content has:

- a question, misconception, or low-signal answer to break apart;
- a 3-step reasoning chain;
- one or two concrete answer examples with longer on-screen text;
- a final takeaway that helps the designer answer like a decision maker.

Do not use it for videos that depend mainly on real screenshot critique, full portfolio page inspection, or a simple listicle. Those should use `screen-focus`, `material-desk`, or `keyword-stack` from `templates/odin-video/visual-system.md`.

## Files

- `template.html`: HyperFrames HTML source of truth. Copy this into a project as `work/html/index.html`, then sync the same file to `preview/index.html`.
- `DESIGN.md`: visual identity for this template. Read this before editing the HTML.
- `content-model.json`: replaceable content slots and scene contract.
- `voiceover-example.txt`: sample Minimax voiceover text from the original demo.

## Call It Later

User-facing phrasing:

```text
用 Odin answer-signal-machine 模板，做《选题名》。
```

Equivalent phrasing:

```text
沿用“你在这个项目里主要负责了什么？”那套深色信号机视频风格和节奏。
```

Agent behavior:

1. Read `templates/odin-video/defaults.md`.
2. Read this folder's `DESIGN.md`, `content-model.json`, and `template.html`.
3. Create the project folder using the normal Odin structure.
4. Create `work/odin-video-spec.md` and set the visual mode to `answer-signal-machine`.
5. Create `work/script.md`; voiceover and bottom captions must share the same wording.
6. Copy `template.html` to `work/html/index.html` and `preview/index.html`.
7. Replace only content slots first. Adjust layout only when the new text breaks readability.
8. Verify with `?t=<seconds>` checkpoints before presenting the preview.

## Scene Rhythm

The template is built as seven 10-second scenes on a 1440x1920 canvas:

1. `opening-breakdown`: break the bad answer into low-signal tokens.
2. `logic-chain`: show the 3-step answer chain.
3. `example-filmstrip-a`: pan a long example through a focus window.
4. `template-assembly`: assemble answer variables into one usable sentence.
5. `contrast-map`: show why a weak answer fails and a structured answer works.
6. `example-filmstrip-b`: pan a second long example through the same focus window.
7. `takeaway-radar`: close with decision-maker questions.

The filmstrip scenes use a focus mask: the centered card stays clear while off-window cards are dimmed. Keep this behavior; it is the reason the sequence feels like video rather than a static page.

## Content Rules

- Keep phone readability first. Important body text should normally stay at `38px` or above; filmstrip cards use larger text.
- Do not fill every scene with full-page paragraphs. Use reveal, pan, zoom, and focus instead.
- The bottom caption is timed subtitle text, not a full visible transcript.
- On-screen long text belongs in filmstrip frames or structured cards, not in the subtitle area.
- The first scene should expose the common wrong answer, then transform it into a stronger structure.
- Use one visual job per scene. If a scene needs two unrelated jobs, split or simplify the script.

## Replacement Map

Use `content-model.json` as the slot list. The most common edits are:

- replace opening question and low-signal tokens;
- replace the 3 logic nodes;
- replace two 5-frame filmstrip examples;
- replace the 4 assembly slots and built sentence;
- replace the contrast-map nodes;
- replace the final decision cards;
- retime subtitle `data-start` / `data-end` after Minimax voiceover timing is known.

## Verification

Before showing a future preview:

- check scene 2 around `?t=15.3`;
- check scene 3 filmstrip focus around `?t=26.85`;
- check scene 6 filmstrip focus around `?t=56.85`;
- check final subtitles around `?t=64`;
- confirm `work/html/index.html` and `preview/index.html` are identical.

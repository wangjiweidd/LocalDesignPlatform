# Odin Script Markup

Use this lightweight format when revising scripts and marking where material should appear.

## Rule

Every paragraph block gets an ID:

```md
# 01
Voiceover text. Bottom captions will use this same wording.

# 02
Next voiceover paragraph.
```

When the user says "here", it means the nearest paragraph ID above the note.

## Insert Screenshot

```md
# 03
Do not just say "I used AI tools"; show how you judged the result.

[insert screenshot]
file: assets/portfolio-page-01.png
focus: circle "Midjourney + ChatGPT assisted"
layout: large evidence board
motion: zoom in, then red circle
```

## Insert Recording

```md
# 04
The useful part is not the final image, but the decision path.

[insert recording]
file: assets/project-scroll.mov
focus: show the transition from problem to solution
duration: about 4s
layout: material screen with bottom caption
```

## Insert Copy Or Evidence Text

```md
# 05
The interviewer wants to see the tradeoff.

[insert copy]
content:
  Goal: improve purchase decision confidence
  Constraint: do not hurt browsing experience
  Result: revenue and retention both stayed positive
focus: circle "Constraint" and "Result"
```

## Insert Sticker Or Generated Image

```md
# 06
This is where many designers lose the interviewer.

[insert sticker]
intent: surprised reaction, not too cute
source: generate or use Odin sticker library
```

## Insert Sound Effect

Sound effects are optional and sparse. Prefer action-bound notes:

```md
[sfx]
type: marker-circle
when: red circle appears
volume: low
```

Do not add a sound effect to every paragraph.

## Minimal Chat Syntax

The user can also write in plain chat:

```text
第 03 段插入作品集截图，圈出“工具过程”。
第 05 段需要录屏，展示页面从上往下滑，大概 4 秒。
第 06 段加一个反应贴纸，表达“这不算设计判断”。
```

The agent must map these notes back to the paragraph IDs in `work/script.md`.


# Odin Video Spec

## 1. Creative Brief

- Working title: 设计面试 AI 自我介绍模板：这 3 段话术直接加分
- Target viewer: 准备设计面试的 UI/UX、产品设计、体验设计求职者
- Viewer pain: 自我介绍容易变成复述简历，或者套用 AI 生成的漂亮废话
- One-sentence takeaway: 自我介绍不是背模板，而是用 3 段话把设计价值、判断过程和协作结果讲清楚
- Desired action after watching: 改写自己的面试开场，不再只说工具和经历
- Platform and canvas: 3:4, 1440x1920
- Target length: 约 45 秒
- Evidence available: 反例话术、三段加分话术、面试官判断维度
- Evidence missing: 真实简历或作品集截图，当前用证据板占位

## 2. Odin Point Of View

- Surface topic: AI 自我介绍模板
- Deeper design-career problem: 设计师把自我介绍当简历摘要，错过建立判断力信任的机会
- Contrarian or useful judgment: 加分的不是话术本身，而是话术背后能不能指向真实项目证据
- What this video refuses to become: 万能模板、背诵稿、AI 工具安利
- What a generic creator would say: 面试时这样说显得更专业
- What Odin should say instead: 你要让面试官在 30 秒内知道，你不是会用工具的人，而是能拿材料做判断的人

## 3. Designer Aesthetic Direction

- Dominant visual mode: keyword-stack + evidence-board
- Visual taste: 手工证据板，像把面试开场拆在桌面上给你看
- Typography attitude: 标题强，正文重，关键词像黑色标签贴在纸上
- Material texture: 淡绿色纸面、米色证据板、红色手绘批注
- Annotation style: 红圈、红箭头、印章，全部指向具体话术
- Motion feel: 先出现错误话术，再逐条替换成加分话术
- What must not appear: SaaS 仪表盘、抽象粒子、万能模板感、过度可爱贴纸

## 4. Material Plan

```text
M01
type: pasted-copy
file: inline
used in paragraph: # 01
focus target: "熟练使用 Figma 和 AI 工具"
visual action: red cross and rewrite arrow
status: available

M02
type: pasted-copy
file: inline
used in paragraph: # 02-# 04
focus target: 3 段加分话术
visual action: keyword bars pop in, then evidence rows reveal
status: available

M03
type: placeholder
file: assets/portfolio-screenshot-placeholder.png
used in paragraph: # 05
focus target: 项目证据、判断过程、结果
visual action: evidence board with red circle
status: missing
```

## 5. Script Shape

```text
# 01
job: hook
voiceover point: 自我介绍不是复述简历
screen role: show bad AI-style opening
scene type: Evidence Board
material: M01
annotation action: cross out generic phrase
estimated duration: 7s

# 02
job: judgment
voiceover point: 第一段先讲设计价值
screen role: keyword bar + replacement line
scene type: Keyword Bars
material: M02
annotation action: underline "我解决什么问题"
estimated duration: 8s

# 03
job: evidence
voiceover point: 第二段讲判断过程
screen role: evidence row comparison
scene type: Evidence Board
material: M02
annotation action: circle "判断过程"
estimated duration: 9s

# 04
job: consequence
voiceover point: 第三段讲协作结果
screen role: final keyword bar in orange
scene type: Keyword Bars
material: M02
annotation action: stamp "可追问"
estimated duration: 8s

# 05
job: takeaway
voiceover point: AI 只负责帮你组织，不能替你制造经历
screen role: coaching board summary
scene type: Evidence Board
material: M03
annotation action: final red arrow to evidence
estimated duration: 9s
```

## 6. HyperFrames Storyboard

```text
Scene 01
paragraph: # 01
scene type: Evidence Board
layout: bad intro card on cream board, title above, bottom caption
entry motion: board drops in
main annotation: red cross over generic AI phrase
caption: exact paragraph text
sound effect: marker-cross
transition: hard cut

Scene 02
paragraph: # 02
scene type: Keyword Bars
layout: three black bars stack, first bar active
entry motion: bars pop in one by one
main annotation: yellow underline under design value
caption: exact paragraph text
sound effect: keyword-pop
transition: wipe

Scene 03
paragraph: # 03
scene type: Evidence Board
layout: old line versus improved line
entry motion: evidence rows reveal
main annotation: red circle around "判断过程"
caption: exact paragraph text
sound effect: marker-circle
transition: hard cut

Scene 04
paragraph: # 04
scene type: Keyword Bars
layout: final bar orange, stamp near result
entry motion: final bar slides in
main annotation: stamp
caption: exact paragraph text
sound effect: stamp
transition: hard cut

Scene 05
paragraph: # 05
scene type: Evidence Board
layout: summary board with three checks
entry motion: checks appear in order
main annotation: red arrow from AI template to real evidence
caption: exact paragraph text
sound effect: none
transition: end hold
```

## 7. Quality Gate

- This is a design-career judgment, not generic AI tool content.
- Every key phrase has a visible target on the evidence board.
- Dominant visual mode is keyword-stack plus evidence-board.
- No MP4 export in this phase.
- No blocking `[needs user confirmation]` item for HTML preview. Real portfolio screenshot can be added later.

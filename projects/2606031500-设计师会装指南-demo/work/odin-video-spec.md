# Odin Video Spec

## 1. Creative Brief

- Working title: 设计师"会装"指南：看起来专业有深度的 5 个技巧
- Target viewer: 准备求职、跳槽、作品集答辩或面试汇报的中文设计师
- Viewer pain: 做过项目，但一开口就像初级执行；讲不出判断力，也讲不出为什么自己值钱
- One-sentence takeaway: 会装不是撒谎，而是把真实项目价值包装成面试官一眼能听懂的专业表达
- Desired action after watching: 立刻改自己的项目介绍和面试开场
- Platform and canvas: 3:4, 1440x1920
- Target length: 约 49 秒
- Evidence available: 5 个技巧、两条红线、竞品验证、常见低级说法
- Evidence missing: 真实面试截图与作品集页面，当前用证据板与文字材料完成 demo

## 2. Odin Point Of View

- Surface topic: 设计师"会装"
- Deeper design-career problem: 很多设计师把自己的能力讲成了工具清单和流程复读，错过了建立高级感与可信度的窗口
- Contrarian or useful judgment: 面试看起来专业，不是靠装懂，而是靠你会不会把真实价值说成可判断、可追问、可验证的证据
- What this video refuses to become: 教人撒谎、教人硬凹术语、鸡汤式自信训练
- What a generic creator would say: 设计师要学会包装自己，这样更容易拿 offer
- What Odin should say instead: 包装可以放大能力，但前提是你真的有东西；如果一句话不能回到真实项目，它就不该出现在面试里

## 3. Designer Aesthetic Direction

- Dominant visual mode: evidence-board + keyword-stack
- Visual taste: 像面试教练把你那段"会装"话术拆在桌面上，一条条指出哪些能加分，哪些会翻车
- Typography attitude: 标题像判断，关键词像黑色标签，证据行像可以被圈出来的面试答案
- Material texture: 淡绿色纸底、米色纸板、红色手绘批注、少量章戳
- Annotation style: 红圈、红线、红叉、箭头，只指向具体句子
- Motion feel: 先给出低级说法，再替换成高级说法；每一步都像在改稿
- What must not appear: SaaS 卡片、抽象粒子、廉价职业成功学、空洞的高大上词汇

## 4. Material Plan

```text
M01
type: pasted-copy
file: inline
used in paragraph: # 01
focus target: "会装不是撒谎"
visual action: red underline + bad phrase cross-out
status: available

M02
type: pasted-copy
file: inline
used in paragraph: # 02
focus target: "提升了 30% 转化率"
visual action: compare weak line vs metric line
status: available

M03
type: pasted-copy
file: inline
used in paragraph: # 03
focus target: "为什么这么设计"
visual action: evidence rows reveal in order
status: available

M04
type: pasted-copy
file: inline
used in paragraph: # 04
focus target: "专业术语"
visual action: keyword bars + red warning note
status: available

M05
type: pasted-copy
file: inline
used in paragraph: # 05
focus target: "白板 / 草图 / 迭代记录"
visual action: material board with process chips
status: available

M06
type: pasted-copy
file: inline
used in paragraph: # 06
focus target: "您想先看 A 还是 B"
visual action: two project cards + direction arrow
status: available

M07
type: pasted-copy
file: inline
used in paragraph: # 07
focus target: "能力是基础，包装是放大器"
visual action: red line to redline note
status: available
```

## 5. Script Shape

```text
# 01
job: hook
voiceover point: 会装不是撒谎，是让价值更快被看见
screen role: bad phrase vs corrected judgment
scene type: Evidence Board
material: M01
annotation action: red cross and underline
estimated duration: 7s

# 02
job: evidence
voiceover point: 第一招，用数据说话
screen role: compare vague result and metric result
scene type: Evidence Board
material: M02
annotation action: circle metric phrase
estimated duration: 7s

# 03
job: evidence
voiceover point: 第二招，讲过程不讲结果
screen role: rows reveal reasoning chain
scene type: Evidence Board
material: M03
annotation action: arrow through reasoning steps
estimated duration: 7s

# 04
job: contrast
voiceover point: 第三招，术语可以用，但要解释得出来
screen role: keyword stack with warning bar
scene type: Keyword Bars
material: M04
annotation action: red note on fake depth
estimated duration: 7s

# 05
job: evidence
voiceover point: 第四招，把思考过程拿出来
screen role: process board
scene type: Material Duo
material: M05
annotation action: marker circles around process artifacts
estimated duration: 7s

# 06
job: judgment
voiceover point: 第五招，主动引导面试官
screen role: project choice board
scene type: Keyword Bars
material: M06
annotation action: arrow to A/B choice prompt
estimated duration: 7s

# 07
job: takeaway
voiceover point: 能力是基础，包装是放大器，过度包装会翻车
screen role: summary board and redline note
scene type: Evidence Board
material: M07
annotation action: final red line to real evidence
estimated duration: 7s
```

## 6. HyperFrames Storyboard

```text
Scene 01
paragraph: # 01
scene type: Evidence Board
layout: big cream board, bad phrase card, hook title
entry motion: board drops in
main annotation: red cross on "撒谎" misconception and underline on "让价值更快被看见"
caption: exact paragraph text
sound effect: marker-swipe
transition: hard cut

Scene 02
paragraph: # 02
scene type: Evidence Board
layout: weak line card vs metric line card
entry motion: cards stagger in
main annotation: red circle around "30%"
caption: exact paragraph text
sound effect: marker-circle
transition: hard cut

Scene 03
paragraph: # 03
scene type: Evidence Board
layout: three reasoning rows
entry motion: rows reveal from top to bottom
main annotation: arrow through "目标 -> 约束 -> 判断"
caption: exact paragraph text
sound effect: none
transition: hard cut

Scene 04
paragraph: # 04
scene type: Keyword Bars
layout: black bars with one red warning note
entry motion: bars pop in one by one
main annotation: warning note "不会解释 = 当场露怯"
caption: exact paragraph text
sound effect: stamp
transition: wipe

Scene 05
paragraph: # 05
scene type: Material Duo
layout: left process chips, right evidence board
entry motion: chips drop in, board settles
main annotation: circles around whiteboard, draft, iteration
caption: exact paragraph text
sound effect: paper-drop
transition: hard cut

Scene 06
paragraph: # 06
scene type: Keyword Bars
layout: two project choice cards and one final guidance bar
entry motion: cards slide in, final bar lands last
main annotation: arrow to "您想先看 A 还是 B？"
caption: exact paragraph text
sound effect: keyword-pop
transition: hard cut

Scene 07
paragraph: # 07
scene type: Evidence Board
layout: summary board with green checks and red redline note
entry motion: checks appear in order
main annotation: red line from "包装" to "真实项目证据"
caption: exact paragraph text
sound effect: none
transition: end hold
```

## 7. Quality Gate

- This is a design-career judgment video, not generic interview motivation content.
- Each technique points to a concrete phrase or evidence target.
- The redlines make it clear this is not teaching users to lie.
- Visual mode stays inside evidence-board and keyword-stack logic.
- HTML preview is the default output. No MP4 export in this demo phase.
- No blocking `[needs user confirmation]` item for a first HTML preview.

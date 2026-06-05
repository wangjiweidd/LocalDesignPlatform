# XHS Skill Workflow

这份文档只整理一件事：`小红书内容生产` 这条工作流到底依赖哪些 skill，谁是工作流入口，谁是必需依赖，谁只是兼容旧名字，谁是可选参考。

目标：

1. 你平时不再靠记忆判断“这次该用哪个 skill”
2. 你把这条工作流迁移到另一台电脑时，知道要复制哪几个目录

## 一句话结论

当前 Odin 小红书多图工作流，应该按下面的层级理解：

1. `xhs-carousel-infographic`
   - 当前多图内容产线的工作流入口
   - 负责多图发布包总流程、HTML/PNG 规格、路由和质量纪律
2. `odin-design-job-xhs-cards`
   - Odin 设计求职线 profile
   - 负责把设计求职、作品集、简历、面试、谈薪这类主题引到 Odin 这条线
3. `odin-xiaohongshu-note-title`
   - 负责标题、封面短文案、发布正文、配文
4. `zh-writing-guardrails`
   - 中文写作底层护栏

如果只复制一套能跑的最小技能组合，这 4 个是核心。

## 先讲原则

这些 skill 不应该绑定某个工作台、某个仓库页面，或某个产品界面。

它们应该满足 3 个条件：

1. 能在 CLI 里单独调用
2. 能在 Codex app 里单独调用
3. 能被某个更大的工作流串起来一起用

也就是说：

- `工作流 skill` 负责描述真实生产流程、调度顺序、依赖 skill
- `能力 skill` 负责可独立调用的单点能力，例如改标题、改配文、做选题、做中文护栏

不要把“工作台上现在长什么样”反向写进 skill 定义里。

## 工作流分层

### A. 工作流入口层

#### `xhs-carousel-infographic`

路径：
`/Users/jiweiwang/.codex/skills/xhs-carousel-infographic`

职责：

- 当前这条工作流里，多图内容产线的总入口
- 统一规格：`1080x1440`、`3:4`、多页 HTML、确认后导 PNG
- 统一文件契约：`research.md`、`calibration.md`、`outline.md`、`配文文稿.md`
- 路由到 Odin 线或 Yaoning 线

它内部还带了这些关键资源：

- `lines/xhs-carousel.md`
- `profiles/design-job.md`
- `quality-gates/xhs-carousel-check.md`
- `references/workflow-guide.md`
- `references/source-workflow.md`
- `references/spine-library.md`
- `references/module-library.md`
- `references/theme-library.md`
- `references/copy-voice.md`

结论：
这是当前“小红书多图卡片”这条子产线的真正主引擎，但它不应该被误认为整个“小红书内容生产”的总入口。

### B. 账号 / 主题 profile 层

#### `odin-design-job-xhs-cards`

路径：
`/Users/jiweiwang/.codex/skills/odin-design-job-xhs-cards`

职责：

- Odin 设计求职线兼容入口
- 把这些主题归到 Odin 设计求职多图：
  - 作品集
  - 简历
  - 面试
  - 谈薪
  - AI 项目包装
  - 设计职业发展

重要说明：

- 它不是独立主引擎
- 它本质上是 `xhs-carousel-infographic` 的 Odin profile/兼容入口
- 新项目不应该再把它理解成单独生产线

### C. 可独立调用的文案能力层

#### `odin-xiaohongshu-note-title`

路径：
`/Users/jiweiwang/.codex/skills/odin-xiaohongshu-note-title`

职责：

- 发布标题
- 封面短文案
- 图文正文
- 发布配文

什么时候用：

- 只改标题 / 配文
- 给小红书多图生成后的文案做精修
- 给小红书多图生产前做 Brief 预整理

这类 skill 应该能被单独调用，不依赖你先进入某个工作台或先创建某个项目。

### D. 共享底层护栏层

#### `zh-writing-guardrails`

路径：
`/Users/jiweiwang/.codex/skills/zh-writing-guardrails`

职责：

- 中文自然度
- 去 AI 腔
- 去翻译腔
- 的 / 地 / 得
- 禁止自我介绍式开头

它不是业务 skill，但属于底层必需依赖。

## 可选参考层

这些不是当前小红书多图主链路的必需项，但经常会被引用或拿来补强：

### `odin-xhs-writer`

路径：
`/Users/jiweiwang/.codex/skills/odin-xhs-writer`

作用：

- 更完整的小红书文案方法库
- 含受众、标题、开头钩子、写后审校、载体判断

适合：

- 你想把 Odin 的“发帖感”和“平台感”一起迁过去

不是必需原因：

- 当前工作台里，核心规则已经逐步内置到 prompt，不直接依赖这个 skill 才能工作

### `odin-topic-pipeline`

路径：
`/Users/jiweiwang/.codex/skills/odin-topic-pipeline`

作用：

- 选题研究和选题池入库

适合：

- 你想把“选题 -> 多图生产”整条前链路一起迁过去

不是必需原因：

- 它不负责最终多图生产

### `article-to-carousel-html`

路径：
`/Users/jiweiwang/.codex/skills/article-to-carousel-html`

作用：

- 从文章直接映射成多页 HTML 的旧方法

状态：

- 参考价值仍在
- 但不是当前 Odin 小红书多图主工作流的主入口

## 历史遗留 / 命名风险

这部分最容易让你迁移时搞混。

### 风险 1：代码里出现过 `odin-carousel-infographic`

当前仓库里的文案和日志里，有些地方还写 `odin-carousel-infographic`。

但你本地技能目录里，实际存在的是：

- `xhs-carousel-infographic`
- `odin-design-job-xhs-cards`

结论：

- `odin-carousel-infographic` 应视为历史命名或口头别名
- 真正应该复制的是 `xhs-carousel-infographic`

### 风险 2：`odin-design-job-xhs-cards` 仍然存在

它不是废物，但也不是主入口。

正确理解：

- 它是 Odin 设计求职线的兼容入口 / profile skill
- 主引擎还是 `xhs-carousel-infographic`

## 最小可迁移包

如果你只想把 `Odin 小红书多图工作流` 迁到另一台电脑，并尽量保证核心技能可独立调用，最少复制这 4 个目录：

1. `/Users/jiweiwang/.codex/skills/xhs-carousel-infographic`
2. `/Users/jiweiwang/.codex/skills/odin-design-job-xhs-cards`
3. `/Users/jiweiwang/.codex/skills/odin-xiaohongshu-note-title`
4. `/Users/jiweiwang/.codex/skills/zh-writing-guardrails`

## 推荐可迁移包

如果你想保留更完整的 Odin 小红书能力，建议复制这 7 个目录：

1. `/Users/jiweiwang/.codex/skills/xhs-carousel-infographic`
2. `/Users/jiweiwang/.codex/skills/odin-design-job-xhs-cards`
3. `/Users/jiweiwang/.codex/skills/odin-xiaohongshu-note-title`
4. `/Users/jiweiwang/.codex/skills/zh-writing-guardrails`
5. `/Users/jiweiwang/.codex/skills/odin-xhs-writer`
6. `/Users/jiweiwang/.codex/skills/odin-topic-pipeline`
7. `/Users/jiweiwang/.codex/skills/article-to-carousel-html`

## 怎么判断一次任务该走哪层

### 只做标题 / 配文 / 封面短文案

用：
`odin-xiaohongshu-note-title`

### 做完整小红书多图交付包

主入口：
`xhs-carousel-infographic`

如果主题是设计求职、作品集、简历、面试、谈薪：
同时按 Odin 线处理，实际会落到：
`odin-design-job-xhs-cards`

### 做选题研究，不做生产

用：
`odin-topic-pipeline`

### 从长文粗转多页 HTML

参考：
`article-to-carousel-html`

## 这条工作流的真实结构

不要从“工作台上有几个按钮”来理解 skill 结构，而要从“真实生产流程”来理解：

1. 选题 / 主题判断
   - `odin-topic-pipeline`（可选）
2. 多图内容产线
   - `xhs-carousel-infographic`
3. Odin 设计求职 profile
   - `odin-design-job-xhs-cards`
   - `profiles/design-job.md`
4. 文案能力
   - `odin-xiaohongshu-note-title`
   - `odin-xhs-writer`（可选增强）
5. 共享底层护栏
   - `zh-writing-guardrails`

如果以后继续收敛，建议把代码里的显示名、日志名、目录名统一成一套“工作流入口 / 子产线 / 可独立能力 / 共享护栏”的体系，不再混用。

- `xhs-carousel-infographic`：主引擎
- `odin-design-job-xhs-cards`：Odin 线 profile
- `odin-xiaohongshu-note-title`：文案审校
- `zh-writing-guardrails`：中文护栏

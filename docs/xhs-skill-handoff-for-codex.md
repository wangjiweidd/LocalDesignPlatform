# XHS Skills Handoff For Codex

这份文档是给另一台电脑上的 Codex 的。目标很简单：

1. 快速理解这套新的小红书 skill 应该怎么用
2. 知道哪些是当前主链路，哪些只是兼容层，哪些旧 skill 不该再当主入口

## 先记住一条

不要把 skill 和某个工作台页面绑定。

这些 skill 应该同时满足：

- 能在 CLI 单独调用
- 能在 Codex app 单独调用
- 能被更大的 workflow 串起来调用

## 当前推荐理解

### 顶层概念

当前这套体系的顶层不是“多图信息图”，而是：

- `小红书内容生产`
- 对应概念名：`xhs-content-production`

### 当前最小主链路

必须保留并理解这 4 个 skill：

1. `xhs-carousel-infographic`
   - 当前“小红书多图卡片”子产线的 workflow 入口
   - 负责多页 HTML / PNG / 配文包流程

2. `odin-design-job-xhs-cards`
   - Odin 设计求职线 profile / 兼容层
   - 不是独立主引擎

3. `odin-xiaohongshu-note-title`
   - 可单独调用的文案能力
   - 用于标题、封面短文案、正文、配文

4. `zh-writing-guardrails`
   - 中文共享底层护栏

## 现在应该怎么调用

### 情况 1：做完整小红书多图卡片

主入口：

- `xhs-carousel-infographic`

如果主题属于 Odin 设计求职线：

- 作品集
- 简历
- 面试
- 谈薪
- AI 项目包装
- 设计职业发展

则同时按：

- `odin-design-job-xhs-cards`

来加载 profile。

### 情况 2：只改标题 / 只改配文 / 只改正文

直接调用：

- `odin-xiaohongshu-note-title`

不要为了只改标题，反而走完整多图 workflow。

### 情况 3：只做中文护栏 / 去 AI 腔

直接调用：

- `zh-writing-guardrails`

### 情况 4：做 Odin 小红书选题研究

可选调用：

- `odin-topic-pipeline`

它是选题能力，不是多图生产主入口。

## 建议保留的可选增强 skill

如果另一台电脑也需要更完整的小红书能力，建议保留：

- `odin-xhs-writer`
- `odin-topic-pipeline`
- `article-to-carousel-html`

其中：

- `odin-xhs-writer`：偏 Odin 图文写法知识库
- `odin-topic-pipeline`：偏选题能力
- `article-to-carousel-html`：偏旧的长文转多页 HTML 参考流程

## 旧 skill 的处理原则

### 不要再当主入口的

如果看到下面这些旧叫法，不要再把它们理解成当前主入口：

- `odin-carousel-infographic`

说明：

- 这是历史叫法 / 兼容叫法
- 当前真正该用的主引擎是：
  - `xhs-carousel-infographic`

如果另一台电脑上真的存在一个单独目录叫 `odin-carousel-infographic`，优先检查它是不是旧副本或历史别名。默认不要继续扩展它。

### 保留但不要误用的

- `odin-design-job-xhs-cards`

它需要保留，因为当前 Odin 设计求职主题还要用它做 profile / 兼容层。  
但不要把它当成和 `xhs-carousel-infographic` 并列的独立主引擎。

### 可归档 / 非主链路参考项

这些不是当前小红书主链路的必需项；如果另一台电脑只想保留最小生产能力，可以不装，或后续再补：

- `article-to-carousel-html`
- `odin-xhs-writer`
- `odin-topic-pipeline`

注意：

- 这里说的是“不是主链路必需”
- 不是说它们没有价值

## 最后给 Codex 的操作建议

看到“小红书相关任务”时，先按下面判断：

1. 是完整多图卡片交付？
   - 用 `xhs-carousel-infographic`
2. 是 Odin 设计求职主题？
   - 追加 `odin-design-job-xhs-cards`
3. 只是改标题/正文/配文？
   - 直接用 `odin-xiaohongshu-note-title`
4. 只是压中文机器味？
   - 直接用 `zh-writing-guardrails`

不要从 UI 入口名反推 skill。  
要从“真实任务类型”反推 skill。

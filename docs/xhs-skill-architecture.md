# XHS Skill Architecture

这份文档只回答一个问题：

`小红书内容生产` 这套 skill，到底应该怎么分层、怎么命名，才能既能被工作流串起来，又能被单独调用。

## 设计原则

### 1. 不和工作台绑定

skill 不是某个工作台按钮。

它应该：

- 能在 CLI 中单独调用
- 能在 Codex app 中单独调用
- 能被更大的 workflow skill 调度

所以命名和职责都不应该写成：

- “工作台里的第 4 步”
- “某个页面上的文案区”
- “某个仓库当前的 UI 状态”

### 2. 先区分“工作流”与“能力”

一套健康的技能体系，至少有两类 skill：

#### 工作流 skill

负责：

- 真实业务流程
- 调度顺序
- 依赖哪些子 skill
- 每一步产出什么

例如：

- 选题到发布的完整多图生产
- 视频脚本到预览的完整生产

#### 能力 skill

负责：

- 单点可复用能力
- 可以被单独调用
- 也可以被 workflow skill 复用

例如：

- 改标题
- 改正文
- 选题研究
- 中文护栏
- 受众与载体判断

### 3. 用统一维度命名

不要混用这三种维度：

- 账号名
- 载体名
- 实现形式

应该固定成：

1. 业务域
2. 账号 / profile
3. 能力 / 产线

## 推荐层级

### 顶层：业务域

建议顶层用：

- `xhs-content-production`

这是“真实总入口”的概念，不局限于多图。

它可以覆盖：

- 小红书多图卡片
- 小红书文章 / 正文
- 标题 / 封面短文案 / 配文
- 未来的小红书视频脚本 / 发布文案

### 第二层：账号 / profile

当前应该有：

- `odin`
- `yaoning`

### 第三层：子产线 / 能力

#### Workflow 类

- `carousel`
- `video`（待做）

#### Capability 类

- `title`
- `copy`
- `topic`
- `zh-guardrails`

## 推荐命名方式

下面不是要求你今天立刻改目录名，而是推荐未来逐步收敛到这个体系。

### A. Workflow skill

#### 1. 总入口

建议概念名：

- `xhs-content-production`

职责：

- 小红书内容生产的总工作流
- 负责把任务分发到 Odin / Yaoning
- 再决定走多图、文章、视频哪条线

#### 2. Odin 多图产线

建议概念名：

- `xhs-content-production/odin/carousel`

当前可映射到：

- `xhs-carousel-infographic`
- `odin-design-job-xhs-cards`

注意：

- 这两个现在一个偏通用引擎，一个偏 Odin profile
- 未来应该收敛成“一个 workflow skill + 一个 profile”

#### 3. Yaoning 多图产线

建议概念名：

- `xhs-content-production/yaoning/carousel`

当前可映射到：

- `yaoning-parent-ai-xhs-cards`

#### 4. Odin 视频产线（待做）

建议概念名：

- `xhs-content-production/odin/video`

#### 5. Yaoning 视频产线（待做）

建议概念名：

- `xhs-content-production/yaoning/video`

### B. Capability skill

#### 1. Odin 标题与配文

建议概念名：

- `xhs-content-production/odin/title-and-copy`

当前可映射到：

- `odin-xiaohongshu-note-title`

这个 skill 必须保持可单独调用，因为“只改标题”“只改配文”是高频真实需求。

#### 2. Odin 长文 / 图文正文

建议概念名：

- `xhs-content-production/odin/article`

当前可映射到：

- `odin-xhs-writer`

#### 3. Odin 选题能力

建议概念名：

- `xhs-content-production/odin/topic`

当前可映射到：

- `odin-topic-pipeline`

#### 4. 中文共享护栏

建议概念名：

- `xhs-content-production/shared/zh-guardrails`

当前可映射到：

- `zh-writing-guardrails`

## 对当前技能的重新定位

### `xhs-carousel-infographic`

不是：

- 整个小红书内容生产总入口

而是：

- 当前“小红书多图卡片”子产线的主引擎

### `odin-design-job-xhs-cards`

不是：

- 一个完全独立的引擎

而是：

- Odin 设计求职 profile / 兼容入口

### `odin-xiaohongshu-note-title`

不是：

- 只能被大工作流调用的内部 skill

而是：

- 必须保留为可单独调用的文案能力 skill

### `zh-writing-guardrails`

不是：

- 某个具体业务 skill

而是：

- 共享底层护栏

## 最关键的判断标准

如果一个 skill 改完名字后，你还是能自然回答下面三个问题，那它的边界就是健康的：

1. 它能不能单独调用？
2. 它能不能被更大的 workflow 调用？
3. 它的名字是在描述真实业务职责，而不是某个 UI 上的按钮？

## 建议的迁移顺序

不要一次性物理重命名所有目录。先做语义收敛，再做物理迁移。

### 第一步：统一文档语义

先在文档和 manifest 中统一成：

- 工作流入口
- 子产线
- 可独立能力
- 共享护栏

### 第二步：统一代码里的显示名与日志名

让工作台和日志别再混用：

- `odin-carousel-infographic`
- `xhs-carousel-infographic`
- `odin-design-job-xhs-cards`

### 第三步：最后才考虑物理目录改名

因为物理改名会牵涉：

- 旧引用
- 本地调用习惯
- 其他仓库兼容

所以最晚做。

## 直接结论

你现在最应该采用的理解方式是：

- 顶层不是“多图信息图”
- 顶层是“`小红书内容生产`”
- 多图只是其中一条 workflow
- 标题、正文、配文、选题、中文护栏都必须保持可单独调用
- 工作台只是这些 skill 的一个使用界面，不是 skill 的定义来源

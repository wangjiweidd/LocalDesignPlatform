# Recent Two Weeks Handoff

这份文档给接手这个仓库的 Codex。目标只有一个：快速知道这两周已经做了什么、现在系统按什么逻辑工作、接手时先看哪里。

## 这两周的核心变化

### 1. 小红书产线的顶层概念改了

以前容易把这条线理解成“多图信息图”。

现在统一理解为：

- 顶层：`小红书内容生产`
- 当前已落地的主子线：`小红书多图卡片`

意思是：

- 多图只是当前一个子产线
- 后面标题、正文、配文、视频都属于同一个顶层体系

落地点：

- `/Users/jiweiwang/Downloads/Code case/Local_Design_Platform/pipelines.config.json`
- `/Users/jiweiwang/Downloads/Code case/Local_Design_Platform/src/App.tsx`
- `/Users/jiweiwang/Downloads/Code case/Local_Design_Platform/server.mjs`

## 2. skill 的定位被重新梳理了

现在明确区分两类：

- workflow skill：负责完整流程
- capability skill：负责单点能力，可单独调用

当前小红书主链路理解：

- `xhs-carousel-infographic`：当前多图卡片主 workflow
- `odin-design-job-xhs-cards`：Odin 设计求职 profile / 兼容层，不再视为独立总入口
- `odin-xiaohongshu-note-title`：标题、配文、正文改写能力
- `zh-writing-guardrails`：中文共享护栏

相关文档：

- `/Users/jiweiwang/Downloads/Code case/Local_Design_Platform/docs/xhs-skill-workflow.md`
- `/Users/jiweiwang/Downloads/Code case/Local_Design_Platform/docs/xhs-skill-architecture.md`
- `/Users/jiweiwang/Downloads/Code case/Local_Design_Platform/docs/xhs-skill-handoff-for-codex.md`
- `/Users/jiweiwang/Downloads/Code case/Local_Design_Platform/docs/xhs-skill-bundle.manifest.json`

## 3. 文案生成逻辑被前置加强了

不是只做“生成后再优化”，而是把质量要求前置到了首稿阶段。

已经加入的约束包括：

- 先判断受众和载体
- 避免空泛、套路化、AI 味重的表达
- 引入更严格的中文写作与审稿标准
- 让“优化文案”从补救动作，变成首稿质量体系的一部分

落地点：

- `/Users/jiweiwang/Downloads/Code case/Local_Design_Platform/server.mjs`

重点不是多加一个 prompt，而是把这些规则写进了主生成链路和后续优化链路。

## 4. 增加了“预优化文案”能力

现在小红书在正式创建项目前，会先对输入文案做一次预处理。

已经落地两层：

1. 显式接口：
   - `/api/preflight-copy`
2. 真实流程接入：
   - 小红书产线在启动生成前，会自动跑一次 preflight

结果：

- 首次生成的项目文案质量比之前更稳
- “优化文案”按钮仍然保留，但定位从“必须修”变成“进一步调整”

落地点：

- `/Users/jiweiwang/Downloads/Code case/Local_Design_Platform/server.mjs`
- `/Users/jiweiwang/Downloads/Code case/Local_Design_Platform/src/App.tsx`

## 5. 前端文案区交互改过一轮

针对用户反馈，已经做过这些调整：

- 小红书多图产线补上了文案优化入口
- 优化弹窗不再强制用户先写一段“优化方向”
- 文案优化更接近“直接优化 + 可选补充要求”
- 页面上会更清楚地显示当前 workflow、子产线、文案能力、共享护栏的映射关系

落地点：

- `/Users/jiweiwang/Downloads/Code case/Local_Design_Platform/src/App.tsx`

## 6. 现在对“为什么还需要优化按钮”的结论

系统当前不是“首稿差，所以靠优化补救”。

当前设计结论是：

- 首稿已经比之前更强
- 但写作任务天然存在主观偏好、语气偏移、载体差异
- 所以仍然保留二次优化入口
- 这个入口用于调风格、调力度、调表达，不是替代主生成

这点在后续迭代里不要反着做回去。

## 7. 做过一轮仓库瘦身

仓库原来超过 2G，已经清掉一批明显的缓存和过程性产物。

已清理：

- 根目录依赖和构建缓存
- Remotion 渲染器依赖
- Remotion 输出目录
- 项目下的 preview / exports / public/output / renders 等生成物
- 临时截图和杂项缓存

清理后仓库约为：

- `445M`

保留原则：

- 保留源码
- 保留模板
- 保留项目 `source/`、`assets/`、`project.json`
- 保留 `reference/`
- 保留 `.git`

## 接手时先看什么

按这个顺序：

1. `/Users/jiweiwang/Downloads/Code case/Local_Design_Platform/docs/recent-two-weeks-handoff.md`
2. `/Users/jiweiwang/Downloads/Code case/Local_Design_Platform/docs/xhs-skill-handoff-for-codex.md`
3. `/Users/jiweiwang/Downloads/Code case/Local_Design_Platform/pipelines.config.json`
4. `/Users/jiweiwang/Downloads/Code case/Local_Design_Platform/server.mjs`
5. `/Users/jiweiwang/Downloads/Code case/Local_Design_Platform/src/App.tsx`

## 接手时不要误判的几件事

- 不要再把“小红书多图信息图”当总入口概念
- 不要把 `odin-design-job-xhs-cards` 当成独立主引擎
- 不要把 skill 理解成某个工作台按钮
- 不要删掉优化链路，以为首稿可以覆盖所有主观写作偏好
- 不要把这次仓库清理理解成“可以删除项目源数据”

## 当前状态一句话总结

这两周的本质不是“多加了几个按钮”，而是把小红书这条线从“一个多图工具”推进成了“一个有顶层概念、子产线分层、首稿质量前置、可继续扩展到视频和其他文案形态的内容生产系统”。

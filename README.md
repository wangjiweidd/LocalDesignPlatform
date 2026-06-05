# Local Design System

本地设计生产工作台。第一版目标是把四条生产线做成可视化入口：

- 小红书多图信息图
- Portfolio 页面
- 课程 PPT
- Remotion 视频动效
- Odin HyperFrames 视频模板

## Run

```bash
npm install
npm run dev
```

`npm run dev` 会同时启动：

- Web: `http://127.0.0.1:5173`
- API: `http://127.0.0.1:8787`

## Project Shape

```text
projects/
  project-id/
    project.json
    source/
    assets/
    preview/
    exports/

templates/
  xhs-carousel/
  portfolio-case/
  course-ppt/
  remotion-video/
  odin-video/

skills/
  xhs-carousel/
  portfolio-case/
  course-ppt/
  remotion-video/
  odin-video/
```

## Pipeline Binding

生产线绑定关系统一放在 `pipelines.config.json`。

每条生产线声明：

- `skill`：主 skill，是这条线的工作流入口。
- `relatedSkills`：这条线会联动的关联 skill。
- `workflow`：这条线的阶段标签，用于 UI 展示和生成提示。
- `steps`：用户在工作台里看到的生产步骤。

调整某条生产线时，优先改对应 skill 和这条配置，不需要改其他生产线。一个 skill 不等于单个 Markdown 文档；它可以包含脚本、模板、参考资料、关联 skill 和完整工作流。

## Odin Video Workflow

Odin video production is being solidified under:

```text
templates/odin-video/
```

Default rule: generate editable script and HyperFrames HTML preview first; render `final.mp4` only after explicit user confirmation. Each Odin project keeps a simple user-facing shape:

```text
project-folder/
  assets/
  work/
  final.mp4
```

Use `assets/` for screenshots, recordings, copy, reference media, and stickers. Use `work/` for scripts, Minimax voiceover text, HTML preview, and agent-only temporary files under `work/_codex/`.

## CLI Agent Mode

本地网站通过 `server.mjs` 调用本机 CLI Agent：

- 默认：`codex exec`
- 可选：`claude --print`

流程：

```text
浏览器按钮
  -> POST /api/projects
  -> POST /api/generate
  -> server.mjs 调用 CLI Agent
  -> Agent 写入 projects/<id>/
```

这个模式会复用本机已经登录的 CLI，不需要在网站里重新配置 OpenAI API Key。

# 2026-05-09 更新交接

这份文档记录今天在 Remotion 分支视频工程里的更新，方便在另一台电脑拉取后继续生成同样风格的视频。

## 当前工程定位

本机工作目录：`/Users/jiweiwang/Downloads/Code case/Remotion-Video`

GitHub 仓库：`https://github.com/wangjiweidd/LocalDesignPlatform`

远端分支：`codex/remotion-video-pipeline`

这是一个独立的 Remotion 分支视频工程，用来验证新的动画生产流程。它不依赖、也不修改原始真实 Remotion 工程在本地设计平台里的地址记录。

注意：这个工程目前是推到 `LocalDesignPlatform` 仓库里的独立分支，不是远端 `main`。这样可以复用同一个 GitHub 仓库同步工作，又不会影响主工程。

今天的核心目标不是只做一个视频，而是把动画生产方式改成可复用流程：

```text
选题脚本 -> shot 数据 -> visualBeats -> 可复用 motion preset -> Remotion 渲染
```

以后换选题时，优先改 `src/data/demo.ts` 里的脚本、场景和节奏数据，不要为每个选题重新写一套一次性动画。

## 今天完成的更新

1. 建立了独立 Remotion 分支工程。

   - 工程只保留生成分支视频需要的代码和资产。
   - `public/output/` 用于放封面、静帧和最终视频，已经被 Git 忽略。
   - 原始真实 Remotion 工程的地址记录没有被修改。

2. 加入可复用动画数据结构。

   - `src/data/demo.ts`：当前示例选题、封面、分镜、字幕和 `visualBeats`。
   - `src/data/types.ts`：脚本、镜头、视觉节奏的数据类型。
   - `src/motion/motionPresets.ts`：复用型动画预设。

3. 加入可复用视觉组件。

   - `src/BranchVideo.tsx`：主视频 composition 和封面 composition。
   - `src/components/Caption.tsx`：顶部标题和底部字幕。
   - `src/components/Illustrations.tsx`：中间视觉元素和场景插画。
   - `src/components/BrandBadge.tsx`：曜宁账号标签。

4. 加入可复用透明背景视觉资产。

   资产目录：`public/assets/generated/`

   当前已提交的资产：

   - `doudou-robot.png`
   - `membership-card.png`
   - `rules-board.png`
   - `purpose-target.png`
   - `magnifier.png`

   这些是可复用资产，应该提交。最终视频、封面输出、临时素材不提交。

5. 优化封面和内页结构。

   - 封面使用独立 composition：`BranchCover`。
   - 内页统一为三层结构：

   ```text
   顶部标题 -> 中间动画视觉 -> 底部字幕卡
   ```

   - 顶部标题来自 `shot.text` 和 `shot.keyword`。
   - 底部字幕来自 `shot.caption` 和 `shot.captionKeyword`。

6. 修正顶部标题和底部字幕的职责。

   最新版本已经按下面规则处理：

   - 顶部是标题，居中、常驻，不做进场和出场动画。
   - 底部是字幕，跟随脚本节奏，有进场和出场动效。
   - 字幕位置已上移，避免贴近画面底部。
   - 不再出现“顶部像字幕、底部也像字幕”的重复表达。

## 重要文件说明

### `src/data/demo.ts`

这是当前视频的内容入口。换选题时优先改这里：

- `title` / `subtitle`：项目标题。
- `cover`：封面文案。
- `shots`：每个镜头的标题、字幕、关键词、场景和动画节奏。
- `visualBeats`：每个镜头内视觉元素的节奏点。

原则：先把脚本节奏写进数据，再让组件按数据播放，不要把选题内容硬编码进动画组件。

### `src/components/Caption.tsx`

这里控制内页文字层：

- 顶部标题：固定居中，不跟随字幕节奏动。
- 底部字幕卡：跟随当前镜头进入、停留、退出。

如果后续再调整字号、上下位置、字幕卡样式，主要改这个文件。

### `src/components/Illustrations.tsx`

这里控制中间视觉元素。它读取镜头的 `scene` 和 `visualBeats`，再组合透明 PNG、文字标签和 motion preset。

如果要增加新场景，应优先增加一个可复用 scene，而不是只为某个选题写死一套画面。

### `src/motion/motionPresets.ts`

这里放动画预设。新增动画时要先判断它是否可复用：

- 可以复用：加入 preset。
- 只服务一个画面：尽量不要加，避免工程越来越难维护。

### `public/assets/generated/`

这里放可复用透明背景资产。适合提交。

注意：图片里的中文、标题、价格、字幕尽量不要直接烘焙进图里。文本最好交给 React 渲染，这样换选题时还能编辑。

### `public/output/`

这里是渲染输出目录，已经被 `.gitignore` 忽略，不要提交。

当前生成过：

- `branch-video.mp4`
- `cover.png`
- 若干测试静帧

这些文件只作为本机预览结果，不作为源码同步。

## 复现命令

在另一台电脑上，从 GitHub 拉取这个独立分支：

```bash
git clone https://github.com/wangjiweidd/LocalDesignPlatform.git
cd LocalDesignPlatform
git checkout codex/remotion-video-pipeline
```

进入该分支后，安装依赖并重新生成视频：

```bash
npm install
npm run lint
npm run still:cover
npm run still:frame
npm run render
```

预期输出：

- 封面：`public/output/cover.png`
- 示例静帧：`public/output/frame-004.png`
- 最终视频：`public/output/branch-video.mp4`

今天最后一次渲染验证结果：

```text
width=1080
height=1920
r_frame_rate=30/1
nb_frames=450
duration=15.061333
```

## 今天的提交记录

```text
c3a2206 Create reusable Remotion branch video
49cc46c Improve reusable Remotion visual pipeline
f44c8d6 Restore inner page caption layout
5d34040 Separate persistent titles from animated captions
a3aaa34 Add Remotion update handoff
```

本文件对应今天的交接文档提交。

## 后续修改原则

1. 先改数据，再改组件。

   换选题时不要先复制组件。优先改 `src/data/demo.ts`，让现有 scene、caption 和 motion preset 承接新内容。

2. 动画跟着脚本节奏走。

   字幕节奏、关键词强调、视觉元素出现时间，都应该从 `visualBeats` 或镜头数据里体现，不要只凭感觉给组件加随机动效。

3. 画面要克制。

   现在的方向是：暖色背景、干净插画、少量强调色、轻量动效。不要把每个元素都做成强动效，否则会抢字幕和脚本重点。

4. 顶部标题和底部字幕不能混用。

   顶部标题负责告诉观众这一页讲什么。它应该稳定、常驻。

   底部字幕负责承接口播脚本。它可以进出、强调关键词，但不能跑到顶部去。

5. 可复用资产提交，渲染结果不提交。

   可以提交：

   - `src/`
   - `README.md`
   - `docs/`
   - `public/assets/generated/`
   - `package.json`
   - `package-lock.json`

   不要提交：

   - `public/output/`
   - `node_modules/`
   - `build/`
   - `tmp/`
   - `.DS_Store`

## Git 同步状态

当前 remote 已配置为：

```text
origin https://github.com/wangjiweidd/LocalDesignPlatform.git
```

当前工作分支：

```text
codex/remotion-video-pipeline
```

后续如果继续改这个分支，正常提交并推送即可：

```bash
git status
git add <需要提交的文件>
git commit -m "<提交说明>"
git push
```

不要把这个分支直接合并到 `main`，除非后面明确决定把视频生产线并入主工程。当前更稳妥的方式，是把它当作独立分支工程使用。

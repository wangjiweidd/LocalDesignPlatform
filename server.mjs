import express from 'express'
import { access, cp, mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises'
import { constants, readFileSync } from 'node:fs'
import { basename, dirname, extname, join, relative, resolve } from 'node:path'
import { homedir } from 'node:os'
import { fileURLToPath } from 'node:url'
import { spawn } from 'node:child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = __dirname
const projectsDir = join(rootDir, 'projects')
const odinXhsProductionRoot = '/Volumes/Energey/第二大脑/01_Odin/03_内容生产中/02_多图图文'
const port = Number(process.env.LDS_API_PORT || 8787)
const importableExtensions = new Set(['.md', '.markdown', '.txt', '.json', '.csv', '.tsv', '.yaml', '.yml'])
const ignoredDirs = new Set(['.git', '.obsidian', 'node_modules', 'dist', '.trash'])
const pipelines = JSON.parse(readFileSync(join(rootDir, 'pipelines.config.json'), 'utf8'))
const pipelinesById = new Map(pipelines.map((pipeline) => [pipeline.id, pipeline]))

const app = express()
app.use(express.json({ limit: '2mb' }))

async function exists(filePath) {
  try {
    await access(filePath, constants.F_OK)
    return true
  } catch {
    return false
  }
}

function slugify(input) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48)
}

function projectIdFromName(name) {
  const date = new Date()
  const stamp = [
    String(date.getFullYear()).slice(2),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
    String(date.getHours()).padStart(2, '0'),
    String(date.getMinutes()).padStart(2, '0'),
  ].join('')

  return `${stamp}-${slugify(name) || 'untitled'}`
}

function odinDatePrefix(project) {
  const idDate = String(project.id || '').match(/^(\d{6})/)?.[1]
  if (idDate) return idDate

  const date = new Date(project.createdAt || Date.now())
  return [
    String(date.getFullYear()).slice(2),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('')
}

function odinThemeName(name) {
  return sanitizeText(name || '未命名选题')
    .replace(/[\\/:*?"<>|#\[\]\n\r\t]+/g, '-')
    .replace(/\s+/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 36) || '未命名选题'
}

function odinXhsProjectDir(project) {
  return join(odinXhsProductionRoot, `${odinDatePrefix(project)}_${odinThemeName(project.name)}`)
}

function resolveUserPath(input) {
  const trimmed = input.trim()
  if (trimmed === '~') return homedir()
  if (trimmed.startsWith('~/')) return join(homedir(), trimmed.slice(2))
  return resolve(trimmed)
}

function sanitizeText(value) {
  return String(value ?? '').replace(/\u0000/g, '')
}

async function collectSourceFiles(sourcePath) {
  if (!sourcePath) return []

  const root = resolveUserPath(sourcePath)
  const rootStat = await stat(root)

  if (rootStat.isFile()) {
    return importableExtensions.has(extname(root).toLowerCase()) ? [root] : []
  }

  if (!rootStat.isDirectory()) return []

  const files = []

  async function walk(directory) {
    if (files.length >= 40) return

    const entries = await readdir(directory, { withFileTypes: true })
    for (const entry of entries) {
      if (files.length >= 40) return

      const fullPath = join(directory, entry.name)
      if (entry.isDirectory()) {
        if (!ignoredDirs.has(entry.name)) await walk(fullPath)
        continue
      }

      if (entry.isFile() && importableExtensions.has(extname(entry.name).toLowerCase())) {
        files.push(fullPath)
      }
    }
  }

  await walk(root)
  return files
}

async function buildImportedMaterials(sourcePath) {
  if (!sourcePath) return ''

  const root = resolveUserPath(sourcePath)
  const files = await collectSourceFiles(root)
  const chunks = []

  for (const file of files) {
    const fileStat = await stat(file)
    if (fileStat.size > 120_000) continue

    const content = sanitizeText(await readFile(file, 'utf8'))
    const label = relative(root, file) || basename(file)
    chunks.push(`## ${label}\n\n${content.trim()}`)
  }

  if (!chunks.length) return ''

  return [`# Imported Source Materials`, `来源：${root}`, ...chunks].join('\n\n')
}

function fallbackProjectName(name, sourcePath) {
  if (name?.trim()) return name.trim()
  if (sourcePath?.trim()) return basename(resolveUserPath(sourcePath.trim()))
  return '未命名项目'
}

function extractHeading(content) {
  const heading = content.match(/^#\s+(.+)$/m)?.[1]?.trim()
  if (heading) return heading

  const title = content.match(/(?:^|\n)(?:title|标题|选题)\s*[:：]\s*(.+)/i)?.[1]?.trim()
  return title || ''
}

function extractProjectSummary(copy = '', acceptance = '') {
  const pageTitles = [...copy.matchAll(/主标题[：:]\s*(.+)/g)].map((match) => match[1].trim())
  const subtitle = copy.match(/副标题[：:]\s*(.+)/)?.[1]?.trim() || ''
  const bottomLine = copy.match(/(?:底部结论|结尾)[：:]\s*(.+)/)?.[1]?.trim() || ''
  const pageCount = acceptance.match(/页数[：:]\s*(.+)/)?.[1]?.trim() || ''
  const coverTitle = pageTitles[0] || ''
  const titleOptions = [
    coverTitle,
    subtitle ? `${coverTitle}：${subtitle}` : '',
    bottomLine,
    pageTitles[1],
    pageTitles[pageTitles.length - 1],
  ].filter(Boolean)
  const uniqueTitleOptions = [...new Set(titleOptions)].slice(0, 4)
  const postBody = [
    bottomLine || coverTitle,
    '',
    pageTitles.length
      ? `很多设计师卡住，不是因为不知道要准备，而是不知道招聘方到底先看哪一个判断。${pageTitles.slice(1, 4).join('、')}，这些点会直接影响别人怎么给你定价。`
      : '',
    '',
    '如果你正在看机会、改作品集、准备面试，先把自己的城市、方向、证据链重新对一遍。',
  ].filter((line, index, array) => line || array[index - 1]).join('\n')
  return {
    pageTitles: pageTitles.slice(0, 12),
    titleOptions: uniqueTitleOptions,
    postBody,
    subtitle,
    caption: bottomLine,
    pageCount,
  }
}

function extractVideoCopySummary(copy = '') {
  // 解析 yaoning-remotion-video skill 产出的 source/copy.md：
  // ## 标题候选（4 选 1） + 编号清单
  // ## 选定标题 + 一行
  // ## 正文（140 字内） + 段落
  // ## 标签 + 一行
  const titlesSection = extractMarkdownSection(copy, '标题候选[（(]?[^）)\\n]*[）)]?')
  const titleOptions = titlesSection
    ? titlesSection
        .split('\n')
        .map((line) => line.replace(/^\s*[\d]+[\.\、]\s*/, '').trim())
        .filter(Boolean)
        .slice(0, 4)
    : []
  const selectedTitle =
    extractMarkdownSection(copy, '选定标题')?.split('\n')[0]?.trim() || titleOptions[0] || ''
  const bodySection = extractMarkdownSection(copy, '正文[（(]?[^）)\\n]*[）)]?')
  const postBody = bodySection ? bodySection.split('\n').filter(Boolean).join('\n').trim() : ''
  const tagsSection = extractMarkdownSection(copy, '标签')
  const caption = tagsSection ? tagsSection.split('\n')[0].trim() : ''
  return {
    pageTitles: [],
    titleOptions: titleOptions.length ? titleOptions : selectedTitle ? [selectedTitle] : [],
    postBody,
    scriptText: '',
    outlineText: '',
    subtitle: '',
    caption,
    pageCount: '',
  }
}

function extractMarkdownSection(content, heading) {
  const pattern = new RegExp(`(?:^|\\n)##\\s+${heading}\\s*\\n([\\s\\S]*?)(?=\\n##\\s+|$)`)
  return content.match(pattern)?.[1]?.trim() || ''
}

function extractCaptionSummary(caption = '') {
  const titleOptions = [...caption.matchAll(/^##\s+标题\s*\d*\s*\n([\s\S]*?)(?=\n##\s+|$)/gm)]
    .map((match) => match[1].trim().split('\n').find(Boolean)?.trim() || '')
    .filter(Boolean)
    .slice(0, 4)
  const postBody = extractMarkdownSection(caption, '小红书配文')

  return {
    pageTitles: [],
    titleOptions,
    postBody,
    subtitle: '',
    caption: postBody,
    pageCount: '',
  }
}

async function inspectSource({ type, sourcePath }) {
  const root = resolveUserPath(sourcePath)
  const files = await collectSourceFiles(root)
  const pipeline = pipelinesById.get(type)
  const readableFiles = []
  let suggestedName = basename(root)
  const briefParts = [
    `材料来源：${root}`,
    `生产线：${pipeline?.name || type}`,
    `绑定 skill：${pipeline?.skill || '未指定'}`,
  ]

  for (const file of files.slice(0, 12)) {
    const fileStat = await stat(file)
    if (fileStat.size > 120_000) continue

    const content = sanitizeText(await readFile(file, 'utf8')).trim()
    if (!content) continue

    const label = relative(root, file) || basename(file)
    const heading = extractHeading(content)
    if (heading && suggestedName === basename(root)) suggestedName = heading
    readableFiles.push(label)
    briefParts.push(`\n## ${label}\n${content.slice(0, 1200)}`)
  }

  return {
    sourcePath: root,
    fileCount: files.length,
    suggestedName,
    suggestedBrief: briefParts.join('\n'),
    readableFiles,
  }
}

async function createProject({ name, type, brief = '', sourcePath = '', videoAccount = '' }) {
  const pipeline = pipelinesById.get(type)
  const normalizedSourcePath = sourcePath.trim() ? resolveUserPath(sourcePath.trim()) : ''
  const projectName = fallbackProjectName(name, sourcePath)
  const normalizedVideoAccount = type === 'video' ? (videoAccount === 'odin' ? 'odin' : 'yaoning') : undefined
  const id = projectIdFromName(projectName)
  const projectDir = join(projectsDir, id)
  await mkdir(join(projectDir, 'source'), { recursive: true })
  await mkdir(join(projectDir, 'assets'), { recursive: true })
  await mkdir(join(projectDir, 'preview'), { recursive: true })
  await mkdir(join(projectDir, 'exports'), { recursive: true })

  const importedMaterials = await buildImportedMaterials(normalizedSourcePath)
  const mergedBrief = [
    sanitizeText(brief).trim(),
    importedMaterials ? `已导入本地资料目录：${normalizedSourcePath}` : '',
  ].filter(Boolean).join('\n\n')

  const project = {
    id,
    name: projectName,
    type,
    skill: pipeline?.skill,
    relatedSkills: pipeline?.relatedSkills || [],
    workflow: pipeline?.workflow || [],
    videoAccount: normalizedVideoAccount,
    brief: mergedBrief,
    sourcePath: normalizedSourcePath || undefined,
    status: 'created',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    outputs: [],
  }

  await writeFile(join(projectDir, 'project.json'), `${JSON.stringify(project, null, 2)}\n`)
  await writeFile(join(projectDir, 'source', 'brief.md'), `${mergedBrief || '无补充 Brief。'}\n`)

  if (normalizedSourcePath) {
    await writeFile(join(projectDir, 'source', 'source-path.txt'), `${normalizedSourcePath}\n`)
  }

  if (importedMaterials) {
    await writeFile(join(projectDir, 'source', 'imported-materials.md'), `${importedMaterials}\n`)
  }

  return project
}

async function listProjects() {
  await mkdir(projectsDir, { recursive: true })
  const entries = await readdir(projectsDir, { withFileTypes: true })
  const projects = []

  for (const entry of entries) {
    if (!entry.isDirectory()) continue

    const projectFile = join(projectsDir, entry.name, 'project.json')
    if (!(await exists(projectFile))) continue

    try {
      const project = JSON.parse(await readFile(projectFile, 'utf8'))
      const projectDir = join(projectsDir, entry.name)
      const pngDir = join(projectDir, 'png')
      let previewAssets = []

      if (await exists(pngDir)) {
        const pngFiles = await readdir(pngDir)
        previewAssets = pngFiles
          .filter((file) => file.toLowerCase().endsWith('.png'))
          .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
          .map((file) => `/projects/${entry.name}/png/${file}`)
      }

      project.hasPreview = await exists(join(projectDir, 'preview', 'index.html'))
      project.previewAssets = previewAssets

      const captionFiles = [
        join(projectDir, 'source', '配文文稿.md'),
        join(projectDir, '配文文稿.md'),
        project.odinOutputDir ? join(project.odinOutputDir, '配文文稿.md') : '',
        project.type === 'xhs' ? join(odinXhsProjectDir(project), '配文文稿.md') : '',
      ].filter(Boolean)
      const copyFile = join(projectDir, 'source', 'copy.md')
      const acceptanceFile = join(projectDir, 'source', 'acceptance.md')
      let existingCaptionFile = ''
      for (const file of captionFiles) {
        if (await exists(file)) {
          existingCaptionFile = file
          break
        }
      }
      if (existingCaptionFile) {
        const caption = sanitizeText(await readFile(existingCaptionFile, 'utf8'))
        project.resultSummary = extractCaptionSummary(caption)
      } else if (await exists(copyFile)) {
        const copy = sanitizeText(await readFile(copyFile, 'utf8'))
        const acceptance = (await exists(acceptanceFile)) ? sanitizeText(await readFile(acceptanceFile, 'utf8')) : ''
        project.resultSummary =
          project.type === 'video'
            ? extractVideoCopySummary(copy)
            : extractProjectSummary(copy, acceptance)
      }
      if (project.type === 'video') {
        const scriptFile = join(projectDir, 'source', 'script.md')
        const outlineFile = join(projectDir, 'source', 'outline.md')
        project.resultSummary = project.resultSummary || {
          pageTitles: [],
          titleOptions: [],
          postBody: '',
          subtitle: '',
          caption: '',
          pageCount: '',
        }
        if (await exists(scriptFile)) {
          project.resultSummary.scriptText = sanitizeText(await readFile(scriptFile, 'utf8')).trim()
        }
        if (await exists(outlineFile)) {
          project.resultSummary.outlineText = sanitizeText(await readFile(outlineFile, 'utf8')).trim()
        }
      }

      projects.push(project)
    } catch {
      // Ignore malformed scratch projects.
    }
  }

  return projects.sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)))
}

async function copyFileIfExists(source, target) {
  if (!(await exists(source))) return false

  await mkdir(dirname(target), { recursive: true })
  await cp(source, target, { force: true })
  return true
}

async function copyDirIfExists(source, target) {
  if (!(await exists(source))) return false

  await mkdir(target, { recursive: true })
  await cp(source, target, { recursive: true, force: true })
  return true
}

async function writeFallbackXhsCaption(projectDir, targetFile) {
  const copyFile = join(projectDir, 'source', 'copy.md')
  const acceptanceFile = join(projectDir, 'source', 'acceptance.md')
  if (!(await exists(copyFile))) return false

  const copy = sanitizeText(await readFile(copyFile, 'utf8'))
  const acceptance = (await exists(acceptanceFile)) ? sanitizeText(await readFile(acceptanceFile, 'utf8')) : ''
  const summary = extractProjectSummary(copy, acceptance)
  const titleLines = (summary.titleOptions || []).slice(0, 4).map((title, index) => `## 标题 ${index + 1}\n${title}`)
  const caption = [
    '# 小红书发布文案',
    '',
    ...titleLines,
    '',
    '## 小红书配文',
    summary.postBody || '',
    '',
    '## 话题标签',
    '#设计师求职',
    '#作品集',
  ].join('\n\n')

  await writeFile(targetFile, `${caption.trim()}\n`)
  return true
}

async function syncXhsProjectToOdin(projectId, project) {
  if (project.type !== 'xhs') return null

  const projectDir = join(projectsDir, projectId)
  const targetDir = odinXhsProjectDir(project)
  await mkdir(targetDir, { recursive: true })

  const copied = []
  const copyPairs = [
    [join(projectDir, 'source', 'research.md'), join(targetDir, 'research.md')],
    [join(projectDir, 'source', 'calibration.md'), join(targetDir, 'calibration.md')],
    [join(projectDir, 'source', 'outline.md'), join(targetDir, 'outline.md')],
    [join(projectDir, 'source', 'acceptance.md'), join(targetDir, '验收记录.md')],
    [join(projectDir, '验收记录.md'), join(targetDir, '验收记录.md')],
    [join(projectDir, 'generate-cards.js'), join(targetDir, 'generate-cards.js')],
  ]

  for (const [source, target] of copyPairs) {
    if (await copyFileIfExists(source, target)) copied.push(relative(targetDir, target))
  }

  if (
    (await copyFileIfExists(join(projectDir, 'source', '配文文稿.md'), join(targetDir, '配文文稿.md'))) ||
    (await copyFileIfExists(join(projectDir, '配文文稿.md'), join(targetDir, '配文文稿.md'))) ||
    (await exists(join(targetDir, '配文文稿.md'))) ||
    (await writeFallbackXhsCaption(projectDir, join(targetDir, '配文文稿.md')))
  ) {
    copied.push('配文文稿.md')
  }

  if (await copyDirIfExists(join(projectDir, 'html'), join(targetDir, 'html'))) copied.push('html/')
  if (await copyDirIfExists(join(projectDir, 'png'), join(targetDir, 'png'))) copied.push('png/')

  if (!(await exists(join(targetDir, 'html'))) && await exists(join(projectDir, 'preview', 'index.html'))) {
    await mkdir(join(targetDir, 'html'), { recursive: true })
    await cp(join(projectDir, 'preview', 'index.html'), join(targetDir, 'html', 'p1-preview.html'), { force: true })
    copied.push('html/p1-preview.html')
  }

  const projectFile = join(projectDir, 'project.json')
  const latestProject = JSON.parse(await readFile(projectFile, 'utf8'))
  const outputs = [
    ...(latestProject.outputs || []),
    { type: 'odin-production-dir', path: targetDir },
  ]
  const dedupedOutputs = outputs.filter((output, index, array) => {
    const value = typeof output === 'string' ? output : output.path || output.type
    return array.findIndex((item) => (typeof item === 'string' ? item : item.path || item.type) === value) === index
  })

  await writeFile(
    projectFile,
    `${JSON.stringify({
      ...latestProject,
      odinOutputDir: targetDir,
      outputs: dedupedOutputs,
      updatedAt: new Date().toISOString(),
    }, null, 2)}\n`,
  )

  return { targetDir, copied }
}

function runCommand(command, args, cwd, input = '') {
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      cwd,
      env: process.env,
      shell: false,
    })

    let stdout = ''
    let stderr = ''

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString()
    })

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString()
    })

    if (input) {
      child.stdin.end(sanitizeText(input))
    }

    child.on('error', (error) => {
      resolve({ ok: false, code: 1, stdout, stderr: `${stderr}\n${error.message}`.trim() })
    })

    child.on('close', (code) => {
      resolve({ ok: code === 0, code, stdout, stderr })
    })
  })
}

function buildPrompt(project, task) {
  const pipeline = pipelinesById.get(project.type)
  const pipelineName = pipeline?.name || project.type
  const pipelineSkill = pipeline?.skill || '当前生产线默认规则'
  const relatedSkills = pipeline?.relatedSkills?.length ? pipeline.relatedSkills.join(', ') : '无'
  const workflow = pipeline?.workflow?.length ? pipeline.workflow.join(' -> ') : '未指定'
  const projectVideoAccount = project.type === 'video' ? (project.videoAccount || 'yaoning') : ''
  const sourceNote = project.sourcePath
    ? `\n本地资料目录已导入到 source/imported-materials.md，原始路径：${project.sourcePath}`
    : ''
  const odinTarget = project.type === 'xhs' ? odinXhsProjectDir(project) : ''
  const writeScope = project.type === 'xhs'
    ? `请只写入两个位置：当前项目目录，以及 Odin 正式生产目录：${odinTarget}。不要改这两个目录之外的文件。`
    : '请只在当前项目目录内写文件，不要改项目目录外的任何文件。'
  const xhsOutputContract = project.type === 'xhs'
    ? `
小红书多图信息图额外产出要求：
- 主引擎固定为 /Users/wangjiweid/.codex/skills/odin-carousel-infographic/，不要再调用旧的 /Users/wangjiweid/.codex/skills/odin-design-job-xhs-cards/ 独立流程。
- 先读取并严格执行 /Users/wangjiweid/.codex/skills/odin-carousel-infographic/SKILL.md 和生产线 /Users/wangjiweid/.codex/skills/odin-carousel-infographic/lines/xhs-carousel.md。
- 默认规格固定为小红书多图、3:4 竖图、1080x1440、多页 HTML、多页 PNG、research.md、calibration.md、outline.md、配文文稿.md。
- 如果主题涉及作品集、简历、面试、AI 项目包装、谈薪、设计职业发展、JD 分析、招聘方标准或项目复盘表达，必须在主 skill 中额外加载 /Users/wangjiweid/.codex/skills/odin-carousel-infographic/profiles/design-job.md；不要回退到旧 skill。
- 设计求职类主题的 Salary Playbook 模板使用新位置：/Users/wangjiweid/.codex/skills/odin-carousel-infographic/assets/templates/salary-playbook-generate-cards.template.js。
- 设计求职类页面必须执行 profiles/design-job.md 的高价值单元要求：招聘方标准、错误/改法、真实场景、可复用句子、评分规则或行动清单；不能只写概念解释。
- P1 封面大标题允许并优先使用两行以上换行；不要为了单行标题牺牲张力。页面不能半空，低密度页面必须补充可用模块、清单、对照或判断标准。
- 必须产出完整 \`配文文稿.md\`，它是工作台展示标题和小红书正文的唯一发布源；不要只把标题/配文藏在 \`copy.md\` 或 HTML 里。
- \`配文文稿.md\` 里的小红书配文要足够完整，开头直接下判断或损失，不要写”这组图主要讲/这组图片解释/本文将介绍”这类介绍型句子。
- 必须同步产出到 Odin 正式生产目录：${odinTarget}
- 目录命名遵守 /Volumes/Energey/第二大脑/01_Odin/AGENTS.md：YYMMDD_主题，不要加 _done。
- 同步目录必须符合 xhs-carousel 文件契约：research.md、calibration.md、outline.md、配文文稿.md、html/、png/；generate-cards.js、验收记录.md 可选但有则同步。
- 当前项目目录也要保留可预览文件，方便本地工作台展示。
- 如果项目来自 Obsidian 选题目录或选题文件，原文件只作为来源，不要移动。`
    : ''

  const videoOutputContract = project.type === 'video' && projectVideoAccount === 'yaoning'
    ? `
曜宁亲子 AI 视频额外产出要求：
- 主入口固定为 /Users/wangjiweid/.codex/skills/remotion-video-creator/SKILL.md。先按这个 Remotion 主 skill 建立视频生产方式：React/Remotion composition、Sequence、frame-based timing、render/preview 工作流；中文脚本同时遵守 zh-writing-guardrails。
- 曜宁账号只作为这条 Remotion 工作流的项目 profile：再读取 /Users/wangjiweid/.codex/skills/yaoning-remotion-video/SKILL.md 的当前版本，以及它引用的 references/visual-style.md、references/voice-guide.md、references/workflow.md、references/cover-example.png、references/frame-example.png。视觉、语气、文件集、验收规则以该 profile 补充约束为准。
- 不要把 yaoning-remotion-video 当成绕过 Remotion 的独立流程；最终必须落到 yn-ai-5s-demo Remotion 工程可渲染的数据和产物上。
- 视觉风格必须 1:1 还原 references/cover-example.png 和 references/frame-example.png：米黄渐变底（#FFF6E2 → #FFE9C4）、暖橙强调（#E07A14、#FFB52E）、紫色饰件（#6F62A8）、卡通插画（钟表/作业本/铅笔/草丛）、皇冠 badge “带曜宁玩 AI”、大字 hero（封面 96px+、内页 110px+）、关键词橙色高亮。
- 动画必须是插画驱动：每个镜头都要让中心插画元素动起来（豆豆机器人、规则板、灯泡、问号气泡、核对卡、放大镜、黑板、计时器、警示卡等），不能只换字幕或只做静态道具。
- 机器人必须参考用户品牌角色“豆豆”：白色圆润机身、黑色大屏脸、青蓝发光眼睛和笑脸、金色/粉色配件、星星天线；头部和身体都偏椭圆/胶囊轮廓，不要画成方块黄机器人、工业机器人或 emoji 机器人。
- 默认不要出现儿童头像、儿童身体或具体人物形象，避免年龄/性别/情绪指向性；除非用户明确要求人物，否则用物件隐喻表达亲子教育场景。
- 每个 scene 必须有不同主体构图，不能全片共用同一个钟表/作业本底图。示例：kid-meets-ai 用“想用 AI?”概念卡 + 豆豆机器人；family-rules-board 用家庭规则板 + 边界/陪用概念卡；ask-the-purpose 用先问卡 + 灯泡 + 问号；verify-answer 用平板 + 放大镜；kid-explains 用复述概念卡 + 黑板；time-limit 用沙漏/计时器；kid-vs-trap 用风险卡 + 警示平板。
- 严禁深绿/深蓝/纯黑背景、纯文字卡片、emoji 替插画、衬线/圆体字、缺皇冠 badge、关键词不上色、连续镜头同构静止、每帧都出现同一个表格/作业本底图。任何一项触发都按反例处理。
- 受众是家长（30-45 岁，妈妈占多），不是孩子。语气是”懂 AI 又陪孩子的家长”，不是 AI 专家科普。术语必须降维（具体降维表见 voice-guide.md）。
- 严禁在脚本里写”大家好””今天我们””感谢观看””这期视频主要讲”。开篇必须直接命中 voice-guide.md 5 种钩子模式之一。
- 脚本必须先兑现选题承诺：如果标题说“5 个工具”，脚本里就必须出现可执行的 5 个工具/工具类型/选择标准，不要偷换成泛泛的“5 个场景”；如果为了家长安全需要改成场景，也要在脚本第一轮就讲清“先按场景选工具”，并给出具体场景和工具池。
- source/script.md 必须是给用户确认的主文件：包含“最终旁白脚本”“屏幕字幕”“为什么这样讲/删掉了什么”的简短说明。每句旁白都要有具体判断或动作，不要只有口号。
- 生成 source/render-data.json 之前，先自测脚本：是否命中选题、是否有具体工具/标准、是否适合 15 秒、是否没有空泛概念。只把自测后的版本写入文件，不要展示自测过程。
- 必须按 workflow.md 的 6 步走完：source/research.md、source/script.md、source/outline.md、source/copy.md、preview/index.html、source/render-data.json。任何一件缺失都不算完工。
- source/render-data.json 必须严格符合 yn-ai-5s-demo/src/data/types.ts 的 ScriptData schema：
  {title, subtitle, fps:30, width:1080, height:1440, shotDurationFrames:60-90, cover:{title, subtitle, titleHighlight, note, noteHighlight}, shots:[{text, keyword, scene, captionMotion, highlightSync, visualBeats?}]}
- shots 控制在 3-6 个；keyword 必须是 text 的实际子串；captionMotion 只能是 slide-fade / emphasis-pop / soft-shake。
- scene 只能从这些值里选，并尽量不要连续重复：kid-meets-ai / family-rules-board / ask-the-purpose / verify-answer / kid-explains / time-limit / kid-vs-trap。
- highlightSync 必须匹配 scene 可动画元素：kid-meets-ai=robot/tablet/bubble；family-rules-board=rules/boundary；ask-the-purpose=lightbulb/question；verify-answer=magnifier/check/cross；kid-explains=speech/board；time-limit=hourglass/tablet；kid-vs-trap=tablet/warning。这个字段会驱动插画元素高亮，不要省略。
- 每个 shot 必须规划 2-3 个 visualBeats，让字幕和中间动画强关联。visualBeats 会被 yn-ai-5s-demo/src/motion/motionPresets.ts 真实驱动，不是备注。元素格式为 {frame,target,action,label?}；frame 必须在 0 到 shotDurationFrames-12 之间；action 只能是 pop/draw/pulse/shake/slide/flash；target 要使用该 scene 里的视觉对象或语义对象，比如 robot/tablet/bubble/rules/rules-list/boundary/lightbulb/question/prompt/magnifier/check/source/speech/board/hourglass/warning。label 应该是画面上短标签，不要超过 6 个汉字。
- 可选补充 visualPlan 字段，用来解释这句字幕的视觉意图和道具组合：{scene,intent,elements:[{id,role,text?,motion}]}。visualPlan 用于后续扩展和人工审阅，visualBeats 用于实际动画渲染。
- 这个文件是下游 /api/render-video 真实渲染 cover.png/frame.png/demo.mp4 的输入，schema 错了渲染会失败。
- preview/index.html 必须基于 /Users/wangjiweid/.codex/skills/yaoning-remotion-video/assets/preview-template.html 渲染，替换占位符，不要从零写 HTML。模板里的 SVG 卡通插画可以根据选题换元素，但必须只用 visual-style.md 列出的颜色 token 和描边规则。
- preview/index.html 必须分上下两屏：上屏对应 cover.png 的封面（含底部黄色灯泡说明条），下屏对应 frame.png 的内页（含进度条）。每屏 1080x1440。
- 当前工作台采用“先审脚本，再渲染视频”的流程。Agent 阶段不要真实渲染 public/output/cover.png、public/output/frame.png、public/output/demo.mp4，也不要把旧视频产物复制进项目；只产出 preview/index.html 和 source/render-data.json，等待用户确认脚本后由 /api/render-video 渲染。
- project.json 的 status 标记为 script_ready，hasPreview=true，updatedAt 用当前时间。`
    : project.type === 'video'
      ? `
Remotion 视频额外产出要求：
- 当前选择的视频账号不是曜宁（videoAccount=${projectVideoAccount || 'unknown'}），不要调用曜宁专属 yn-ai-5s-demo 动画工作流。
- 仍然按 remotion-video-creator 主 skill 产出 source/research.md、source/script.md、source/outline.md、source/copy.md、preview/index.html，并在 project.json 标记 preview_ready。
- 如果需要真实渲染，先补充该账号的专属 Remotion profile 和渲染工程映射。`
    : ''

  return `
你是这个本地设计生产系统的生成 agent。${writeScope}

项目类型：${pipelineName}
绑定 skill：${pipelineSkill}
关联 skills：${relatedSkills}
生产工作流：${workflow}
${projectVideoAccount ? `发布账号：${projectVideoAccount}` : ''}
项目名称：${project.name}
${sourceNote}
用户 Brief：
${project.brief}

任务：${task || '生成第一版结构和可预览 HTML。'}

请产出：
1. source/outline.md：内容结构、页面/卡片/镜头规划。
2. source/copy.md：可编辑正文或讲稿初稿。
3. preview/index.html：一个可直接打开的高质量 HTML 预览。
4. project.json：更新 status、updatedAt、outputs 字段。
${xhsOutputContract}
${videoOutputContract}

要求：
- 优先按绑定 skill 的工作流、输出目录、命名和验收规则执行；如果本提示和 skill 冲突，以 skill 为准。
- 如果是小红书多图信息图，按绑定的 odin-carousel-infographic 主引擎和 lines/xhs-carousel.md 跑完整研究、事实校准、卡片规划、HTML/PNG 生产和验收收尾，不要只生成单个示意预览；不要退回通用 preview 页面风格。
- 如果是小红书多图信息图，生成标题和小红书正文前必须先按 odin-xiaohongshu-note-title 规则做一轮自测：检查对象、场景、真实亏点、可收藏动作、视角一致性和标题前半句信息量；只把自测后的优化版写入 source/copy.md，不要把分析过程展示给用户。
- preview/index.html 必须内联 CSS，不依赖构建工具。
- Portfolio 页面要包含 overview、project background、design goals、process、solution、results。
- 小红书多图要按多页卡片节奏写清每页标题和正文。
- 课程 PPT 要按逐页教学结构组织，并包含讲稿提示。
- Remotion 视频严格按绑定的 remotion-video-creator 主 skill 组织 composition、Sequence、timing 与 render；如果发布账号是 yaoning，再套用 yaoning-remotion-video 的账号视觉/文案 profile 走前 5.5 步生产线（research/script/storyboard/copy/preview/render-data）。曜宁视觉风格必须 1:1 还原 references/cover-example.png 与 frame-example.png，必须是动态插画短片，严禁深色背景、纯文字卡片、emoji 替插画、只换字幕不换画面。不要在 Agent 阶段直接渲染视频，脚本确认后工作台会调用 /api/render-video。
- 所有文字自然、具体，避免空泛宣传语。
- 如果内容不足，请基于 Brief 合理补全，并在 source/outline.md 里标注"假设"。
`.trim()
}

function extractJsonObject(text) {
  const trimmed = sanitizeText(text).trim()

  try {
    return JSON.parse(trimmed)
  } catch {
    const match = trimmed.match(/\{[\s\S]*\}/)
    if (!match) return null

    try {
      return JSON.parse(match[0])
    } catch {
      return null
    }
  }
}

function buildOptimizeCopyPrompt(project, { titles = [], postBody = '', instruction = '' }) {
  return `
你要使用 odin-xiaohongshu-note-title skill 优化小红书图文发布文案，同时遵守 zh-writing-guardrails。
skill 文件：/Users/wangjiweid/.codex/skills/odin-xiaohongshu-note-title/SKILL.md

项目名称：${project.name}
生产线：${pipelinesById.get(project.type)?.name || project.type}
绑定 skill：${project.skill || '未指定'}
用户补充优化建议：
${sanitizeText(instruction).trim() || '无。请按 Odin 小红书图文正文与标题规则自行优化。'}

当前标题候选：
${titles.map((title, index) => `${index + 1}. ${sanitizeText(title)}`).join('\n') || '无'}

当前小红书正文：
${sanitizeText(postBody)}

项目 Brief：
${sanitizeText(project.brief || '')}

请只输出一个 JSON 对象，不要 Markdown，不要解释：
{
  "titles": ["标题1", "标题2", "标题3", "标题4"],
  "postBody": "完整小红书正文"
}

要求：
- 标题固定 4 个，优先 14-20 字，一眼看出对象、场景或真实亏点。
- 正文必须是完整可发布的小红书正文，不要逐页复述图片。
- 开头直接下判断，补真实后果、判断标准和可收藏动作。
- 输出前先自测对象、场景、真实亏点、可收藏动作、视角一致性和标题前半句信息量；只返回自测后的优化版，不要返回分析过程。
- 不要使用 emoji，不要写成讲义或口播稿。
`.trim()
}

app.get('/api/health', async (_request, response) => {
  const [codexAvailable, claudeAvailable] = await Promise.all([
    runCommand('which', ['codex'], rootDir),
    runCommand('which', ['claude'], rootDir),
  ])

  response.json({
    ok: true,
    providers: {
      codex: codexAvailable.ok ? codexAvailable.stdout.trim() : null,
      claude: claudeAvailable.ok ? claudeAvailable.stdout.trim() : null,
    },
  })
})

app.get('/api/projects', async (_request, response) => {
  response.json({ projects: await listProjects() })
})

app.post('/api/projects/:projectId/open', async (request, response) => {
  const { projectId } = request.params
  const projectDir = join(projectsDir, projectId)

  if (!(await exists(projectDir))) {
    response.status(404).json({ error: 'Project folder not found' })
    return
  }

  const result = await runCommand('open', [projectDir], rootDir)
  response.status(result.ok ? 200 : 500).json({
    ...result,
    path: projectDir,
  })
})

app.post('/api/source-preview', async (request, response) => {
  const { type, sourcePath = '' } = request.body || {}

  if (!type || !sourcePath.trim()) {
    response.status(400).json({ error: 'type and sourcePath are required' })
    return
  }

  try {
    response.json(await inspectSource({ type, sourcePath }))
  } catch (error) {
    response.status(400).json({ error: String(error) })
  }
})

app.post('/api/projects', async (request, response) => {
  const { name, type, brief = '', sourcePath = '', videoAccount = '' } = request.body || {}

  if (!pipelinesById.has(type)) {
    response.status(400).json({ error: 'unknown pipeline type' })
    return
  }

  if (!type || (!brief.trim() && !sourcePath.trim())) {
    response.status(400).json({ error: 'type and either brief or sourcePath are required' })
    return
  }

  try {
    const project = await createProject({ name, type, brief, sourcePath, videoAccount })
    response.json({ project })
  } catch (error) {
    response.status(400).json({ error: String(error) })
  }
})

app.post('/api/generate', async (request, response) => {
  try {
    const { projectId, provider = 'codex', task } = request.body || {}

    if (!projectId) {
      response.status(400).json({ error: 'projectId is required' })
      return
    }

    const projectDir = join(projectsDir, projectId)
    const projectFile = join(projectDir, 'project.json')

    if (!(await exists(projectFile))) {
      response.status(404).json({ error: 'Project not found' })
      return
    }

    const project = JSON.parse(await readFile(projectFile, 'utf8'))
    const prompt = sanitizeText(buildPrompt(project, task))

    const result =
      provider === 'claude'
        ? await runCommand('claude', ['--print', '--permission-mode', 'bypassPermissions'], projectDir, prompt)
        : await runCommand(
            'codex',
            [
              'exec',
              '--cd',
              projectDir,
              '--skip-git-repo-check',
              '--dangerously-bypass-approvals-and-sandbox',
              '-',
            ],
            projectDir,
            prompt,
          )

    let syncResult = null
    if (result.ok) {
      syncResult = await syncXhsProjectToOdin(projectId, project)
      if (syncResult) {
        result.stdout = [
          result.stdout,
          `\n已同步 Odin 正式生产目录：${syncResult.targetDir}`,
          syncResult.copied?.length ? `同步文件：${syncResult.copied.join(' / ')}` : '同步文件：暂无可复制文件，已创建目标目录。',
        ].filter(Boolean).join('\n')
      }
    }

    response.status(result.ok ? 200 : 500).json({ ...result, syncResult })
  } catch (error) {
    response.status(500).json({
      ok: false,
      code: 1,
      stdout: '',
      stderr: String(error),
    })
  }
})

const yaoningRemotionDir =
  process.env.YAONING_REMOTION_DIR ||
  '/Volumes/Energey/VideoProjects/Outputs/Yaoning/yn-ai-5s-demo'

const VALID_VISUAL_ROLES = new Set(['problem', 'misconception', 'reason', 'method', 'growth'])
const VALID_SCENES = new Set([
  'kid-meets-ai',
  'family-rules-board',
  'ask-the-purpose',
  'verify-answer',
  'kid-explains',
  'time-limit',
  'kid-vs-trap',
])
const VALID_CAPTION_MOTIONS = new Set(['slide-fade', 'emphasis-pop', 'soft-shake'])
const VALID_VISUAL_BEAT_ACTIONS = new Set(['pop', 'draw', 'pulse', 'shake', 'slide', 'flash'])
const SCENE_HIGHLIGHT_TARGETS = {
  'kid-meets-ai': new Set(['robot', 'tablet', 'bubble']),
  'family-rules-board': new Set(['rules', 'boundary']),
  'ask-the-purpose': new Set(['lightbulb', 'question']),
  'verify-answer': new Set(['magnifier', 'check', 'cross']),
  'kid-explains': new Set(['speech', 'board']),
  'time-limit': new Set(['hourglass', 'tablet']),
  'kid-vs-trap': new Set(['tablet', 'warning']),
}

function validateScriptData(data) {
  const errors = []
  if (!data || typeof data !== 'object') return ['render-data 不是 object']
  for (const key of ['title', 'subtitle']) {
    if (typeof data[key] !== 'string' || !data[key].trim()) errors.push(`${key} 必填且为字符串`)
  }
  if (data.fps !== 30) errors.push('fps 必须等于 30')
  if (data.width !== 1080) errors.push('width 必须等于 1080')
  if (data.height !== 1440) errors.push('height 必须等于 1440')
  if (typeof data.shotDurationFrames !== 'number' || data.shotDurationFrames < 60 || data.shotDurationFrames > 90) {
    errors.push('shotDurationFrames 必须在 60-90 之间')
  }
  if (!data.cover || typeof data.cover !== 'object') errors.push('cover 必填')
  else {
    if (typeof data.cover.title !== 'string' || !data.cover.title.trim()) errors.push('cover.title 必填')
    if (typeof data.cover.subtitle !== 'string') errors.push('cover.subtitle 必填')
    if (typeof data.cover.titleHighlight !== 'string' || !data.cover.titleHighlight.trim()) {
      errors.push('cover.titleHighlight 必填，封面大字里要橙色高亮的关键词')
    } else if (typeof data.cover.title === 'string' && !data.cover.title.includes(data.cover.titleHighlight)) {
      errors.push(`cover.titleHighlight "${data.cover.titleHighlight}" 必须是 cover.title 的子串`)
    }
    if (typeof data.cover.note !== 'string' || !data.cover.note.trim()) {
      errors.push('cover.note 必填，封面底部那行黄色灯泡说明文字')
    }
    if (typeof data.cover.noteHighlight !== 'string' || !data.cover.noteHighlight.trim()) {
      errors.push('cover.noteHighlight 必填，cover.note 里要橙色高亮的关键词')
    } else if (typeof data.cover.note === 'string' && !data.cover.note.includes(data.cover.noteHighlight)) {
      errors.push(`cover.noteHighlight "${data.cover.noteHighlight}" 必须是 cover.note 的子串`)
    }
  }
  if (!Array.isArray(data.shots) || data.shots.length < 3 || data.shots.length > 6) {
    errors.push('shots 必须是 3-6 个元素的数组')
  } else {
    data.shots.forEach((shot, i) => {
      if (!shot || typeof shot !== 'object') {
        errors.push(`shots[${i}] 不是 object`)
        return
      }
      if (typeof shot.text !== 'string' || !shot.text.trim()) errors.push(`shots[${i}].text 必填`)
      if (typeof shot.keyword !== 'string' || !shot.keyword.trim()) {
        errors.push(`shots[${i}].keyword 必填`)
      } else if (typeof shot.text === 'string' && !shot.text.includes(shot.keyword)) {
        errors.push(`shots[${i}].keyword "${shot.keyword}" 必须是 text "${shot.text}" 的子串`)
      }
      if (!VALID_SCENES.has(shot.scene)) {
        errors.push(`shots[${i}].scene 必须是: ${[...VALID_SCENES].join(' / ')}`)
      }
      if (!VALID_CAPTION_MOTIONS.has(shot.captionMotion)) {
        errors.push(`shots[${i}].captionMotion 必须是: ${[...VALID_CAPTION_MOTIONS].join(' / ')}`)
      }
      if (shot.highlightSync !== undefined) {
        if (typeof shot.highlightSync !== 'string') {
          errors.push(`shots[${i}].highlightSync 必须是字符串`)
        } else if (VALID_SCENES.has(shot.scene)) {
          const allowed = SCENE_HIGHLIGHT_TARGETS[shot.scene]
          if (!allowed.has(shot.highlightSync)) {
            errors.push(
              `shots[${i}].highlightSync "${shot.highlightSync}" 在 scene "${shot.scene}" 里不存在，可选: ${[...allowed].join(' / ')}`,
            )
          }
        }
      }
      if (shot.visualBeats !== undefined) {
        if (!Array.isArray(shot.visualBeats)) {
          errors.push(`shots[${i}].visualBeats 必须是数组`)
        } else if (shot.visualBeats.length < 2 || shot.visualBeats.length > 3) {
          errors.push(`shots[${i}].visualBeats 建议且必须是 2-3 个动作节点`)
        } else {
          shot.visualBeats.forEach((beat, beatIndex) => {
            if (!beat || typeof beat !== 'object') {
              errors.push(`shots[${i}].visualBeats[${beatIndex}] 不是 object`)
              return
            }
            if (
              typeof beat.frame !== 'number' ||
              beat.frame < 0 ||
              beat.frame > data.shotDurationFrames - 12
            ) {
              errors.push(`shots[${i}].visualBeats[${beatIndex}].frame 必须在 0 到 shotDurationFrames-12 之间`)
            }
            if (typeof beat.target !== 'string' || !beat.target.trim()) {
              errors.push(`shots[${i}].visualBeats[${beatIndex}].target 必填`)
            }
            if (!VALID_VISUAL_BEAT_ACTIONS.has(beat.action)) {
              errors.push(
                `shots[${i}].visualBeats[${beatIndex}].action 必须是: ${[...VALID_VISUAL_BEAT_ACTIONS].join(' / ')}`,
              )
            }
            if (beat.label !== undefined && typeof beat.label !== 'string') {
              errors.push(`shots[${i}].visualBeats[${beatIndex}].label 必须是字符串`)
            }
          })
        }
      }
    })
  }
  return errors
}

app.post('/api/render-video', async (request, response) => {
  try {
    const { projectId } = request.body || {}
    if (!projectId) {
      response.status(400).json({ ok: false, error: 'projectId is required' })
      return
    }

    const projectDir = join(projectsDir, projectId)
    const projectFile = join(projectDir, 'project.json')
    if (!(await exists(projectFile))) {
      response.status(404).json({ ok: false, error: 'Project not found' })
      return
    }
    const project = JSON.parse(await readFile(projectFile, 'utf8'))
    const projectVideoAccount = project.videoAccount || 'yaoning'
    if (project.type !== 'video') {
      response.status(400).json({ ok: false, error: '当前项目不是 Remotion 视频生产线，不能调用视频渲染。' })
      return
    }
    if (projectVideoAccount !== 'yaoning') {
      response.status(400).json({
        ok: false,
        error: `当前视频账号是 ${projectVideoAccount}，尚未绑定曜宁 yn-ai-5s-demo 动画渲染工作流。`,
      })
      return
    }

    const renderDataPath = join(projectDir, 'source', 'render-data.json')
    if (!(await exists(renderDataPath))) {
      response.status(400).json({
        ok: false,
        error:
          'source/render-data.json 不存在。yaoning-remotion-video skill 的 Step 5.5 必须产出这个文件。请重新生产，或手动补一份再来。',
      })
      return
    }

    let renderData
    try {
      renderData = JSON.parse(await readFile(renderDataPath, 'utf8'))
    } catch (parseError) {
      response.status(400).json({
        ok: false,
        error: `render-data.json 解析失败：${parseError.message}`,
      })
      return
    }

    const schemaErrors = validateScriptData(renderData)
    if (schemaErrors.length) {
      response.status(400).json({
        ok: false,
        error: 'render-data.json 不符合 ScriptData schema',
        details: schemaErrors,
      })
      return
    }

    if (!(await exists(yaoningRemotionDir))) {
      response.status(500).json({
        ok: false,
        error: `Remotion 工程目录不存在：${yaoningRemotionDir}。设置环境变量 YAONING_REMOTION_DIR 指向正确路径，或挂载外接硬盘。`,
      })
      return
    }

    const demoJsonPath = join(yaoningRemotionDir, 'src', 'data', 'demo.json')
    await writeFile(demoJsonPath, `${JSON.stringify(renderData, null, 2)}\n`)

    const renderTargets = [
      { label: 'render:cover', cmd: 'npx', args: ['remotion', 'still', 'src/index.ts', 'YaoningCover', 'public/output/cover.png'] },
      { label: 'render:frame', cmd: 'npx', args: ['remotion', 'still', 'src/index.ts', 'YaoningFrame', 'public/output/frame.png'] },
      { label: 'render:demo', cmd: 'npx', args: ['remotion', 'render', 'src/index.ts', 'YaoningDemo', 'public/output/demo.mp4', '--codec=h264', '--concurrency=1'] },
    ]
    const browserExecutable =
      process.env.YAONING_BROWSER_EXECUTABLE ||
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    const logs = []
    for (const target of renderTargets) {
      const args = [...target.args, '--browser-executable', browserExecutable]
      const result = await runCommand(target.cmd, args, yaoningRemotionDir)
      logs.push({
        target: target.label,
        code: result.code,
        stdoutTail: result.stdout.split('\n').slice(-20).join('\n'),
        stderrTail: result.stderr.split('\n').slice(-20).join('\n'),
      })
      if (!result.ok) {
        response.status(500).json({
          ok: false,
          error: `${target.label} 渲染失败（code=${result.code}）`,
          logs,
        })
        return
      }
    }

    const projectOutputDir = join(projectDir, 'public', 'output')
    await mkdir(projectOutputDir, { recursive: true })
    const sourceOutputDir = join(yaoningRemotionDir, 'public', 'output')
    const copied = []
    for (const file of ['cover.png', 'frame.png', 'demo.mp4']) {
      const src = join(sourceOutputDir, file)
      const dst = join(projectOutputDir, file)
      if (await exists(src)) {
        await cp(src, dst)
        copied.push(file)
      }
    }

    const renderedPaths = new Set([
      'public/output/cover.png',
      'public/output/frame.png',
      'public/output/demo.mp4',
    ])
    const filteredOutputs = Array.isArray(project.outputs)
      ? project.outputs.filter((item) => {
          const path = typeof item === 'string' ? item : item?.path || ''
          return !renderedPaths.has(path)
        })
      : []
    project.outputs = [
      ...filteredOutputs,
      { type: 'cover', path: 'public/output/cover.png' },
      { type: 'frame', path: 'public/output/frame.png' },
      { type: 'video', path: 'public/output/demo.mp4' },
    ]
    project.hasPreview = true
    project.status = 'rendered'
    project.updatedAt = new Date().toISOString()
    await writeFile(projectFile, `${JSON.stringify(project, null, 2)}\n`)

    response.json({ ok: true, project, copied, logs })
  } catch (error) {
    response.status(500).json({
      ok: false,
      error: String(error),
    })
  }
})

app.post('/api/optimize-copy', async (request, response) => {
  try {
    const { projectId, provider = 'codex', titles = [], postBody = '', instruction = '' } = request.body || {}

    if (!projectId) {
      response.status(400).json({ error: 'projectId is required' })
      return
    }

    const projectDir = join(projectsDir, projectId)
    const projectFile = join(projectDir, 'project.json')

    if (!(await exists(projectFile))) {
      response.status(404).json({ error: 'Project not found' })
      return
    }

    const project = JSON.parse(await readFile(projectFile, 'utf8'))
    const prompt = sanitizeText(buildOptimizeCopyPrompt(project, { titles, postBody, instruction }))
    const result =
      provider === 'claude'
        ? await runCommand('claude', ['--print', '--permission-mode', 'bypassPermissions'], projectDir, prompt)
        : await runCommand(
            'codex',
            [
              'exec',
              '--cd',
              projectDir,
              '--skip-git-repo-check',
              '--dangerously-bypass-approvals-and-sandbox',
              '-',
            ],
            projectDir,
            prompt,
          )

    if (!result.ok) {
      response.status(500).json(result)
      return
    }

    const parsed = extractJsonObject(result.stdout)
    if (!parsed || !Array.isArray(parsed.titles) || typeof parsed.postBody !== 'string') {
      response.status(500).json({
        ok: false,
        code: 1,
        stdout: result.stdout,
        stderr: '优化结果不是可解析的标题和正文 JSON。',
      })
      return
    }

    await writeFile(
      join(projectDir, 'source', 'optimized-xhs-copy.json'),
      `${JSON.stringify({ ...parsed, instruction, updatedAt: new Date().toISOString() }, null, 2)}\n`,
    )

    response.json({
      ok: true,
      titles: parsed.titles.slice(0, 4).map((title) => sanitizeText(title).trim()).filter(Boolean),
      postBody: sanitizeText(parsed.postBody).trim(),
      stdout: result.stdout,
      stderr: result.stderr,
    })
  } catch (error) {
    response.status(500).json({
      ok: false,
      code: 1,
      stdout: '',
      stderr: String(error),
    })
  }
})

app.use('/projects', express.static(projectsDir))
app.use(
  '/yaoning-output',
  express.static('/Volumes/Energey/VideoProjects/Outputs/Yaoning/yn-ai-5s-demo/public/output'),
)
app.use(express.static(join(rootDir, 'dist')))

const server = app.listen(port, '127.0.0.1', () => {
  console.log(`Local Design System API running at http://127.0.0.1:${port}`)
})

server.ref()

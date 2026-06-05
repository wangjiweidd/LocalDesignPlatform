import express from 'express'
import { access, chmod, cp, mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises'
import { constants, readFileSync } from 'node:fs'
import { basename, dirname, extname, join, relative, resolve } from 'node:path'
import { homedir, tmpdir } from 'node:os'
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
const codexSkillsDir = process.env.CODEX_SKILLS_DIR || join(homedir(), '.codex', 'skills')
const remotionVideoCreatorSkillPath = join(codexSkillsDir, 'remotion-video-creator', 'SKILL.md')
const remotionVideoTemplateDir = join(rootDir, 'templates', 'remotion-video')
const remotionContentSystemDir = join(remotionVideoTemplateDir, 'content-system')
const remotionRendererDir =
  process.env.REMOTION_VIDEO_RENDERER_DIR || join(rootDir, 'renderers', 'remotion-video')
const localMotionLibraryPath = join(rootDir, 'templates', 'remotion-video', 'motion-library.json')
const topicPoolConfigs = {
  yaoning: {
    rootPath: '/Users/jiweiwang/Downloads/100_Obsidian_Vault/第二大脑/02_曜宁/02_选题与研究/02_选题池',
    dashboardPath:
      '/Users/jiweiwang/Downloads/100_Obsidian_Vault/第二大脑/02_曜宁/02_选题与研究/02_选题池/00_选题管理仪表盘.md',
  },
  odin: {
    rootPath: '/Users/jiweiwang/Downloads/100_Obsidian_Vault/第二大脑/01_Odin/02_选题与研究/02_选题池',
    dashboardPath:
      '/Users/jiweiwang/Downloads/100_Obsidian_Vault/第二大脑/01_Odin/02_选题与研究/02_选题池/00_选题管理仪表板.md',
  },
}

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

function pipelineSkillLabel(pipeline) {
  return pipeline?.skillLabel || pipeline?.skill || '当前生产线默认规则'
}

function pipelineRelatedSkillsLabel(pipeline) {
  if (pipeline?.relatedSkillLabels?.length) return pipeline.relatedSkillLabels.join(', ')
  if (pipeline?.relatedSkills?.length) return pipeline.relatedSkills.join(', ')
  return '无'
}

function getXhsModeConfig(target) {
  const projectType = typeof target === 'string' ? target : target?.type
  if (projectType !== 'xhs') return null

  const pipeline = pipelinesById.get('xhs')
  const xhsModeId = typeof target === 'string' ? 'carousel' : target?.xhsMode || 'carousel'
  return pipeline?.modes?.find((mode) => mode.id === xhsModeId) || pipeline?.modes?.[0] || null
}

function effectivePipelineSkillLabel(pipeline, project) {
  const xhsMode = getXhsModeConfig(project)
  return xhsMode?.entrySkillLabel || xhsMode?.entrySkill || pipelineSkillLabel(pipeline)
}

function effectivePipelineRelatedSkillsLabel(pipeline, project) {
  const xhsMode = getXhsModeConfig(project)
  if (xhsMode?.relatedSkillLabels?.length) return xhsMode.relatedSkillLabels.join(', ')
  if (xhsMode?.relatedSkills?.length) return xhsMode.relatedSkills.join(', ')
  return pipelineRelatedSkillsLabel(pipeline)
}

function effectivePipelineWorkflow(pipeline, project) {
  const xhsMode = getXhsModeConfig(project)
  if (xhsMode?.workflow?.length) return xhsMode.workflow.join(' -> ')
  return pipeline?.workflow?.length ? pipeline.workflow.join(' -> ') : '未指定'
}

function copyCarrierLabel(projectType, xhsMode = 'carousel') {
  if (projectType === 'xhs') {
    return xhsMode === 'copy' ? '小红书标题与发布文案' : '小红书多图文案'
  }
  if (projectType === 'video') return '短视频发布文案与口播辅助文案'
  if (projectType === 'portfolio') return '作品集页面文案'
  if (projectType === 'course') return '课程页面与讲稿文案'
  return '通用内容文案'
}

function copyAuditWorkflow(projectType, xhsMode = 'carousel') {
  const common = [
    '先判断当前内容属于什么载体，再决定信息密度、句长和表达方式。',
    '内部按这个顺序处理：逻辑重构 -> 信息补足 -> 冗余压缩 -> 语气校正 -> 最终改写。',
    '不要直接顺着原文轻微润色；如果结构不对，先重排判断、证据、动作，再落笔。',
    '不要输出分析过程，只输出最终可用内容。',
  ]

  if (projectType === 'xhs') {
    if (xhsMode === 'copy') {
      return [
        ...common,
        '标题先解决对象、场景、亏点或收益，再考虑节奏感。',
        '正文开头先下判断，再给真实后果、判断标准、可执行动作，不要写成多图逐页说明。',
        '把配文文稿当最终交付，不要把关键信息只留在内部备注或页面结构里。',
      ]
    }

    return [
      ...common,
      '标题先解决对象、场景、亏点或收益，再考虑节奏感。',
      '正文开头先下判断，再给真实后果、判断标准、可执行动作，不要逐页复述图片。',
      '卡片页文案要一页一个主判断，适合被快速扫描，不要把长段文章硬塞进页面。',
    ]
  }

  if (projectType === 'video') {
    return [
      ...common,
      '口播句子要能自然读出来，屏幕字幕要能一眼扫懂，两者语义一致但密度可以不同。',
      '避免只有口号没有判断，避免只有节奏没有信息。',
      '预览页文案要服务于镜头理解和字幕确认，不要写成营销页。',
    ]
  }

  if (projectType === 'portfolio') {
    return [
      ...common,
      '作品集先交代背景、目标、约束、取舍、结果，再谈方法。',
      '页面文案要帮助招聘方快速判断负责范围和价值，不要用大段抽象自夸。',
      '每个模块必须回答一个招聘方会追问的问题。',
    ]
  }

  if (projectType === 'course') {
    return [
      ...common,
      '课程文案先保证概念顺序和理解负担，再考虑语气。',
      '页面标题和讲稿提示都要指向一个明确学习动作或判断。',
      '避免讲义式空话，也避免为了热闹牺牲可教性。',
    ]
  }

  return common
}

function copyAudienceRead(projectType, xhsMode = 'carousel') {
  if (projectType === 'xhs') {
    if (xhsMode === 'copy') {
      return '把当前任务理解为：面向会快速滑过内容的中文社媒读者，目标是在几秒内看懂对象、场景、损失或收益，并愿意收藏、转发或立刻复制你的表达。'
    }

    return '把当前任务理解为：面向会快速滑过内容的中文社媒读者，目标是在几秒内看懂对象、场景、损失或收益，并愿意收藏或继续翻页。'
  }

  if (projectType === 'video') {
    return '把当前任务理解为：面向短视频用户，先用一句话抓住值得继续看下去的判断，再用口播和字幕分担信息密度。'
  }

  if (projectType === 'portfolio') {
    return '把当前任务理解为：面向招聘方、面试官和设计负责人，他们先看负责范围、判断质量和结果证据，不看文采。'
  }

  if (projectType === 'course') {
    return '把当前任务理解为：面向需要迅速理解并复用方法的学习者，表达必须先帮人学会，再谈风格。'
  }

  return '先判断受众是谁、为什么读、读完要采取什么动作，再决定写法。'
}

function copyAntiSlopRules(projectType, xhsMode = 'carousel') {
  const common = [
    '吸收 stop-slop 的原则，但按中文语境执行：删除套话、开场预告、假强调、抽象大词和自我解释型句子。',
    '禁用这类开场：”这篇主要讲“、”先说结论“、”我们都知道“、”值得注意的是“、”说白了“、”本质上“、”在当下这个时代“。',
    '禁用这类强调：”真的“、”其实“、”非常“、”极其“、”一定程度上“、”可以说“、”不夸张地说“。能删就删，删不掉就改成具体事实。',
    '避免英语 stop-slop 明确反对的模板结构在中文里的对应写法：”不是 X，而是 Y“、”问题不在 X，在 Y“、”真正的关键是“、”你以为是 X，其实是 Y“。',
    '避免先列一堆“不是什么”再揭晓“是什么”。直接把结论写出来。',
    '不要让抽象名词自己行动。不要写“数据告诉我们”“问题被解决了”“决策浮现出来了”。要写清是谁判断、谁决定、谁修改。',
    '避免装腔作势的短句堆叠。不要为了做出“金句感”把一句完整判断切成三段。',
    '不要用“这说明了一个问题”“背后的原因很复杂”“影响是深远的”这种空结论。必须点明具体问题、具体原因、具体影响。',
  ]

  if (projectType === 'xhs') {
    if (xhsMode === 'copy') {
      return [
        ...common,
        '标题和正文不要写成老师讲义，也不要写成自媒体鸡汤。先给判断，再给证据和动作。',
        '不要把“这组图会讲什么”写进正文；这条能力线交付的是可直接发布的标题和正文。',
      ]
    }

    return [
      ...common,
      '小红书标题和正文不要写成老师讲义，也不要写成自媒体鸡汤。先给判断，再给证据和动作。',
      '不要出现“看完你就懂了”“建议收藏”“干货来了”这类平台化口播套话，除非它后面立刻接具体利益点。',
    ]
  }

  if (projectType === 'portfolio') {
    return [
      ...common,
      '作品集不要写“从 0 到 1 打造”“深度思考后”“全面提升体验”这类无证据的自夸句。',
      '不要用空栏目名撑结构，例如“项目背景 / 设计过程 / 最终方案”后面却没有关键判断。',
    ]
  }

  return common
}

function copyTasteRules(projectType, xhsMode = 'carousel') {
  const common = [
    '吸收 taste-skill 的前置判断：不要一上来套默认腔调。先读受众、载体、阅读场景，再定语言密度和句长。',
    '不要掉进默认模板：三段式空话、平均长度的小标题、每段都像同一种语气、每页都叫“方法/案例/总结”。',
    '标题、页标题、模块标题都要用普通人能一眼看懂的话命名，不要为了“设计感”强行编号、英文化、栏目化。',
  ]

  if (projectType === 'xhs') {
    if (xhsMode === 'copy') {
      return [
        ...common,
        '标题优先把真正的对象、场景和代价说清，不要写成“认知升级”“底层逻辑”这种空标签。',
        '正文段落服务于发布阅读，不要摆出很重的“专题策展”语气，也不要假装在讲一整套课程。',
      ]
    }

    return [
      ...common,
      '小红书卡片页标题优先说清这一页的判断，不要写成“01 / 认知升级”“02 / 核心差异”这种空标题。',
      'HTML 页面里的模块名、标签名、强调块都服务于快速扫描，不要摆出很重的“专题策展”语气。',
    ]
  }

  if (projectType === 'portfolio') {
    return [
      ...common,
      '作品集页面标题要像招聘方会问的问题，而不是像展览分区名。',
      '如果一个模块不能帮助招聘方判断价值，就删掉或并入别的模块。',
    ]
  }

  return common
}

function copyScoringRubric(projectType, xhsMode = 'carousel') {
  const base = [
    'Directness（直接度）：是不是直接在说事，而不是先宣布自己要说什么。',
    'Specificity（具体度）：有没有对象、场景、证据、动作，而不是抽象判断。',
    'Trust（信任感）：有没有把读者当成聪明人，而不是靠夸张、喂结论、强行提醒。',
    'Rhythm（节奏）：句长和段落有没有变化，还是每句都一个模子。',
    'Density（密度）：有没有还能继续删的空话、重复、套话。',
  ]

  if (projectType === 'xhs') {
    return [
      ...base,
      xhsMode === 'copy'
        ? 'Actionability（可执行性）：读者看完后，是否知道该检查什么、修改什么、如何发出去。'
        : 'Actionability（可执行性）：读者看完后，是否知道该检查什么、修改什么、避免什么。',
    ]
  }

  return base
}

function copyGateRules(projectType, xhsMode = 'carousel') {
  const commonL0 = [
    'L0 必须清零：空泛判断、主语缺失、逻辑跳步、为了顺口牺牲含义、与项目 Brief 明显不一致。',
    'L0 必须清零：套话开头，如“本文将介绍”“这组内容主要讲”“希望对你有帮助”。',
  ]
  const commonL1 = [
    'L1 控制密度：连续抽象句不要超过 1 处；连续没有证据或动作的判断不要超过 1 处。',
    'L1 控制密度：同义重复、模板化转折、过度排比都要压到最低。',
  ]
  const commonL2 = ['L2 可优化：节奏、记忆点、语气统一、页面扫描感。']

  if (projectType === 'xhs') {
    if (xhsMode === 'copy') {
      return [
        ...commonL0,
        'L0 标题：必须看得出对象、场景、真实亏点/收益三者中的至少两项；前半句不能空。',
        'L0 正文：开头 2 句内必须出现明确判断；正文里必须给出至少一个判断标准或可执行动作。',
        'L0 正文：不能写成“这组图主要讲什么”“下面展开讲讲”这种依赖卡片存在的说明句。',
        ...commonL1,
        'L1 标题：标题固定 4 个时，4 个角度不能只是同义改写，要有明显切入差异。',
        ...commonL2,
      ]
    }

    return [
      ...commonL0,
      'L0 标题：必须看得出对象、场景、真实亏点/收益三者中的至少两项；前半句不能空。',
      'L0 正文：开头 2 句内必须出现明确判断；正文里必须给出至少一个判断标准或可执行动作。',
      'L0 HTML/卡片：每页只承载一个主判断；不能出现大段介绍型废话。',
      ...commonL1,
      'L1 标题：标题固定 4 个时，4 个角度不能只是同义改写，要有明显切入差异。',
      ...commonL2,
    ]
  }

  if (projectType === 'video') {
    return [
      ...commonL0,
      'L0 标题：要能说明谁适合看、为什么现在要看，或看完能避免什么问题。',
      'L0 口播/正文：句子必须适合朗读；不要连续出现难读的长并列句。',
      'L0 字幕/预览：屏幕文字必须比口播更易扫读，不能把一整句口播原样塞满屏幕。',
      ...commonL1,
      'L1 口播：每段最好只落一个判断和一个支撑信息，避免信息团块。',
      ...commonL2,
    ]
  }

  if (projectType === 'portfolio') {
    return [
      ...commonL0,
      'L0 页面文案：必须能让招聘方看出项目背景、你的职责、关键取舍和结果证据。',
      'L0 页面文案：禁止只写“负责 UI 设计/提升体验”这类无边界表述。',
      'L0 HTML：模块标题必须是招聘方关心的问题，不要是空泛栏目名。',
      ...commonL1,
      'L1 页面文案：每个模块最多一个核心判断，证据优先于形容词。',
      ...commonL2,
    ]
  }

  if (projectType === 'course') {
    return [
      ...commonL0,
      'L0 页面/讲稿：每节必须说明要学什么、为什么重要、怎么用。',
      'L0 页面/讲稿：示例、步骤、结论三者至少占两项，不能只剩概念定义。',
      ...commonL1,
      'L1 讲稿：解释句和动作句要交替出现，避免连续解释造成听感疲劳。',
      ...commonL2,
    ]
  }

  return [...commonL0, ...commonL1, ...commonL2]
}

function copyReviewOutputSchema(projectType, xhsMode = 'carousel') {
  if (projectType === 'xhs') {
    return `{
  "titles": ["标题1", "标题2", "标题3", "标题4"],
  "postBody": "完整小红书正文",
  "review": {
    "carrier": "${copyCarrierLabel(projectType, xhsMode)}",
    "summary": "一句话说明本次主要改进",
    "passedGates": ["对象清楚", "开头直接下判断"],
    "risks": ["若 Brief 缺少真实案例，部分证据只能用通用判断表达"]
  }
}`
  }

  return `{
  "titles": ["标题1", "标题2", "标题3", "标题4"],
  "postBody": "优化后的正文",
  "review": {
    "carrier": "${copyCarrierLabel(projectType, xhsMode)}",
    "summary": "一句话说明本次主要改进",
    "passedGates": ["结构更清楚"],
    "risks": []
  }
}`
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?/)
  if (!match) return {}

  return match[1]
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .reduce((accumulator, line) => {
      const divider = line.indexOf(':')
      if (divider < 0) return accumulator
      const key = line.slice(0, divider).trim()
      const rawValue = line.slice(divider + 1).trim()
      accumulator[key] = rawValue.replace(/^['"]|['"]$/g, '')
      return accumulator
    }, {})
}

function stripFrontmatter(content) {
  return content.replace(/^---\n[\s\S]*?\n---\n?/, '').trim()
}

function extractTopicExcerpt(content) {
  const body = stripFrontmatter(content)
  const preferredSections = [
    /##\s+选题判断\s*\n([\s\S]*?)(?=\n##\s+|$)/,
    /##\s+📝\s*选题要讲什么\s*\n([\s\S]*?)(?=\n##\s+|$)/,
    /##\s+为什么这个选题有价值\s*\n([\s\S]*?)(?=\n##\s+|$)/,
  ]

  for (const pattern of preferredSections) {
    const match = body.match(pattern)?.[1]?.trim()
    if (!match) continue

    const lines = match
      .split('\n')
      .map((line) => line.replace(/^\s*[-*]\s*/, '').trim())
      .filter(Boolean)

    if (lines.length) {
      return lines.join(' ').slice(0, 180)
    }
  }

  return body
    .split('\n')
    .map((line) => line.replace(/^#+\s*/, '').trim())
    .filter(Boolean)
    .slice(0, 3)
    .join(' ')
    .slice(0, 180)
}

function topicPriorityRank(priority = '') {
  const normalized = String(priority).trim().toUpperCase()
  if (normalized === 'P0') return 0
  if (normalized === 'P1') return 1
  if (normalized === 'P2') return 2
  if (normalized === 'P3') return 3
  return 9
}

function topicStatusRank(status = '') {
  const source = String(status)
  if (source.includes('制作中')) return 0
  if (source.includes('规划中')) return 1
  if (source.includes('待爆款验证')) return 2
  if (source.includes('待验证')) return 3
  if (source.includes('归档')) return 9
  return 4
}

function stemName(filePath) {
  return basename(filePath, extname(filePath))
}

async function readTopicDashboard(account) {
  const config = topicPoolConfigs[account]
  if (!config || !(await exists(config.dashboardPath))) return null

  const raw = sanitizeText(await readFile(config.dashboardPath, 'utf8'))
  const frontmatter = parseFrontmatter(raw)
  const currentLink = raw.match(/先做：\[\[([^\]]+)\]\]/)?.[1] || ''
  const currentTopicKey = currentLink.split('|')[0].split('/').pop() || ''
  const featuredLinks = [...raw.matchAll(/\|\s*P\d+\s*\|\s*\[\[([^\]]+)\]\]/g)]
    .map((match) => match[1].split('|')[0].split('/').pop() || '')
    .filter(Boolean)

  return {
    title: frontmatter.title || raw.match(/^#\s+(.+)$/m)?.[1]?.trim() || '选题池',
    updated: frontmatter.updated || '',
    currentTopicKey,
    featuredKeys: featuredLinks,
  }
}

function preflightCopyOutputSchema(projectType, xhsMode = 'carousel') {
  return `{
  "name": "更清楚的项目名",
  "brief": "优化后的项目 Brief / 补充说明",
  "review": {
    "carrier": "${copyCarrierLabel(projectType, xhsMode)}",
    "summary": "一句话说明本次主要整理了什么",
    "passedGates": ["对象更清楚", "结构更直接"],
    "risks": []
  }
}`
}

async function listTopicPool(account) {
  const config = topicPoolConfigs[account]
  if (!config) {
    return {account, rootPath: '', dashboard: null, topics: []}
  }

  const rootPath = config.rootPath
  if (!(await exists(rootPath))) {
    return {account, rootPath, dashboard: null, topics: []}
  }

  const dashboard = await readTopicDashboard(account)
  const topics = []

  async function walk(directory) {
    const entries = await readdir(directory, {withFileTypes: true})
    for (const entry of entries) {
      const fullPath = join(directory, entry.name)
      if (entry.isDirectory()) {
        if (ignoredDirs.has(entry.name) || entry.name.includes('归档')) continue
        await walk(fullPath)
        continue
      }

      if (!entry.isFile() || extname(entry.name).toLowerCase() !== '.md') continue
      if (entry.name.startsWith('00_')) continue

      const raw = sanitizeText(await readFile(fullPath, 'utf8'))
      const frontmatter = parseFrontmatter(raw)
      const code = frontmatter.编号 || frontmatter.code || ''
      const title = frontmatter.标题 || frontmatter.title || extractHeading(raw) || stemName(fullPath)
      if (!code || !title) continue

      const relativePath = relative(rootPath, fullPath).replace(/\\/g, '/')
      const topicKey = stemName(fullPath)
      const status = frontmatter.状态 || frontmatter.选题状态 || ''
      topics.push({
        code,
        title,
        status,
        priority: frontmatter.优先级 || '',
        series: frontmatter.栏目 || frontmatter.领域 || relativePath.split('/')[0] || '',
        decision: frontmatter.推荐决策 || '',
        carrier: frontmatter.适合载体 || '',
        updated: frontmatter.updated || frontmatter.创建时间 || '',
        excerpt: extractTopicExcerpt(raw),
        path: fullPath,
        relativePath,
        isCurrent: dashboard?.currentTopicKey === topicKey,
        isFeatured: dashboard?.featuredKeys?.includes(topicKey) || false,
      })
    }
  }

  await walk(rootPath)

  topics.sort((left, right) => {
    const currentDelta = Number(Boolean(right.isCurrent)) - Number(Boolean(left.isCurrent))
    if (currentDelta !== 0) return currentDelta

    const featuredDelta = Number(Boolean(right.isFeatured)) - Number(Boolean(left.isFeatured))
    if (featuredDelta !== 0) return featuredDelta

    const priorityDelta = topicPriorityRank(left.priority) - topicPriorityRank(right.priority)
    if (priorityDelta !== 0) return priorityDelta

    const statusDelta = topicStatusRank(left.status) - topicStatusRank(right.status)
    if (statusDelta !== 0) return statusDelta

    return String(left.code).localeCompare(String(right.code), undefined, {numeric: true})
  })

  return {
    account,
    rootPath,
    dashboard: dashboard
      ? {
          title: dashboard.title,
          updated: dashboard.updated,
          currentTopicKey: dashboard.currentTopicKey,
        }
      : null,
    topics,
  }
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
  // 解析视频生产线产出的 source/copy.md：
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
    `绑定 skill：${pipelineSkillLabel(pipeline)}`,
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

async function createProject({
  name,
  type,
  brief = '',
  sourcePath = '',
  xhsMode = '',
  videoAccount = '',
  topicCode = '',
  topicPath = '',
}) {
  const pipeline = pipelinesById.get(type)
  const selectedXhsMode = type === 'xhs'
    ? pipeline?.modes?.find((mode) => mode.id === xhsMode) || pipeline?.modes?.[0] || null
    : null
  const normalizedSourcePath = sourcePath.trim() ? resolveUserPath(sourcePath.trim()) : ''
  const normalizedTopicPath = topicPath.trim() ? resolveUserPath(topicPath.trim()) : ''
  const projectName = fallbackProjectName(name, sourcePath)
  const normalizedVideoAccount = type === 'video' ? (videoAccount === 'odin' ? 'odin' : 'yaoning') : undefined
  const id = projectIdFromName(projectName)
  const projectDir = join(projectsDir, id)
  await mkdir(join(projectDir, 'source'), { recursive: true })
  await mkdir(join(projectDir, 'assets'), { recursive: true })
  await mkdir(join(projectDir, 'preview'), { recursive: true })
  await mkdir(join(projectDir, 'exports'), { recursive: true })
  if (type === 'video' && normalizedVideoAccount === 'odin') {
    await mkdir(join(projectDir, 'work', 'html'), { recursive: true })
    await mkdir(join(projectDir, 'work', '_codex'), { recursive: true })
  }

  const importedMaterials = await buildImportedMaterials(normalizedSourcePath)
  const mergedBrief = [
    sanitizeText(brief).trim(),
    importedMaterials ? `已导入本地资料目录：${normalizedSourcePath}` : '',
  ].filter(Boolean).join('\n\n')

  const project = {
    id,
    name: projectName,
    type,
    xhsMode: selectedXhsMode?.id,
    skill: selectedXhsMode?.entrySkill || pipeline?.skill,
    relatedSkills: selectedXhsMode?.relatedSkills || pipeline?.relatedSkills || [],
    workflow: selectedXhsMode?.workflow || pipeline?.workflow || [],
    videoAccount: normalizedVideoAccount,
    brief: mergedBrief,
    sourcePath: normalizedSourcePath || undefined,
    topicCode: sanitizeText(topicCode).trim() || undefined,
    topicPath: normalizedTopicPath || undefined,
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

  if (normalizedTopicPath) {
    await writeFile(join(projectDir, 'source', 'topic-path.txt'), `${normalizedTopicPath}\n`)
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

      const defaultPreview = join(projectDir, 'preview', 'index.html')
      const odinHtmlPreview = join(projectDir, 'work', 'html', 'index.html')
      project.hasPreview = (await exists(defaultPreview)) || (project.videoAccount === 'odin' && await exists(odinHtmlPreview))
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
        const scriptFile = (project.videoAccount === 'odin' && await exists(join(projectDir, 'work', 'script.md')))
          ? join(projectDir, 'work', 'script.md')
          : join(projectDir, 'source', 'script.md')
        const outlineFile = (project.videoAccount === 'odin' && await exists(join(projectDir, 'work', 'storyboard.md')))
          ? join(projectDir, 'work', 'storyboard.md')
          : join(projectDir, 'source', 'outline.md')
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

function runCommand(command, args, cwd, input = '', env = process.env) {
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      cwd,
      env,
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

async function prepareRemotionRenderEnv() {
  const env = { ...process.env }

  if (process.platform === 'darwin') {
    const esbuildPackage = `darwin-${process.arch}`
    const bundledEsbuild = join(remotionRendererDir, 'node_modules', '@esbuild', esbuildPackage, 'bin', 'esbuild')
    if (await exists(bundledEsbuild)) {
      const tmpEsbuild = join(tmpdir(), `lds-remotion-esbuild-${esbuildPackage}`)
      await cp(bundledEsbuild, tmpEsbuild)
      await chmod(tmpEsbuild, 0o755)
      env.ESBUILD_BINARY_PATH = tmpEsbuild
    }
  }

  return env
}

function buildPrompt(project, task) {
  const pipeline = pipelinesById.get(project.type)
  const xhsMode = getXhsModeConfig(project)
  const xhsModeId = xhsMode?.id || 'carousel'
  const pipelineName = pipeline?.name || project.type
  const pipelineSkill = effectivePipelineSkillLabel(pipeline, project)
  const relatedSkills = effectivePipelineRelatedSkillsLabel(pipeline, project)
  const workflow = effectivePipelineWorkflow(pipeline, project)
  const projectVideoAccount = project.type === 'video' ? (project.videoAccount || 'yaoning') : ''
  const isOdinVideo = project.type === 'video' && projectVideoAccount === 'odin'
  const sourceNote = project.sourcePath
    ? `\n本地资料目录已导入到 source/imported-materials.md，原始路径：${project.sourcePath}`
    : ''
  const odinTarget = project.type === 'xhs' ? odinXhsProjectDir(project) : ''
  const writeScope = project.type === 'xhs'
    ? `请只写入两个位置：当前项目目录，以及 Odin 正式生产目录：${odinTarget}。不要改这两个目录之外的文件。`
    : '请只在当前项目目录内写文件，不要改项目目录外的任何文件。'
  const xhsOutputContract = project.type === 'xhs' && xhsModeId === 'carousel'
    ? `
		小红书多图卡片额外产出要求：
	- 当前小红书内容生产默认走多图卡片子产线，主引擎固定为 /Users/wangjiweid/.codex/skills/xhs-carousel-infographic/。
	- Odin 设计求职主题默认加载 /Users/wangjiweid/.codex/skills/odin-design-job-xhs-cards/ 作为 profile/兼容层，不再把它当独立主引擎。
	- 先读取并严格执行 /Users/wangjiweid/.codex/skills/xhs-carousel-infographic/SKILL.md 和生产线 /Users/wangjiweid/.codex/skills/xhs-carousel-infographic/lines/xhs-carousel.md。
	- 默认规格固定为小红书多图、3:4 竖图、1080x1440、多页 HTML、多页 PNG、research.md、calibration.md、outline.md、配文文稿.md。
	- 如果主题涉及作品集、简历、面试、AI 项目包装、谈薪、设计职业发展、JD 分析、招聘方标准或项目复盘表达，必须在主引擎中额外加载 /Users/wangjiweid/.codex/skills/xhs-carousel-infographic/profiles/design-job.md。
	- 设计求职类主题的 Salary Playbook 模板使用新位置：/Users/wangjiweid/.codex/skills/xhs-carousel-infographic/assets/templates/salary-playbook-generate-cards.template.js。
- 设计求职类页面必须执行 profiles/design-job.md 的高价值单元要求：招聘方标准、错误/改法、真实场景、可复用句子、评分规则或行动清单；不能只写概念解释。
- P1 封面大标题允许并优先使用两行以上换行；不要为了单行标题牺牲张力。页面不能半空，低密度页面必须补充可用模块、清单、对照或判断标准。
- 必须产出完整 \`配文文稿.md\`，它是工作台展示标题和小红书正文的唯一发布源；不要只把标题/配文藏在 \`copy.md\` 或 HTML 里。
- \`配文文稿.md\` 里的小红书配文要足够完整，开头直接下判断或损失，不要写”这组图主要讲/这组图片解释/本文将介绍”这类介绍型句子。
- 必须同步产出到 Odin 正式生产目录：${odinTarget}
- 目录命名遵守 /Volumes/Energey/第二大脑/01_Odin/AGENTS.md：YYMMDD_主题，不要加 _done。
- 同步目录必须符合 xhs-carousel 文件契约：research.md、calibration.md、outline.md、配文文稿.md、html/、png/；generate-cards.js、验收记录.md 可选但有则同步。
- 当前项目目录也要保留可预览文件，方便本地工作台展示。
- 如果项目来自 Obsidian 选题目录或选题文件，原文件只作为来源，不要移动。`
    : project.type === 'xhs' && xhsModeId === 'copy'
      ? `
		小红书标题 / 正文 / 配文能力线额外产出要求：
	- 当前任务不走整套多图卡片渲染，不要生成 HTML、PNG、generate-cards.js 或逐页卡片结构。
	- 主能力固定为 /Users/wangjiweid/.codex/skills/odin-xiaohongshu-note-title/SKILL.md，并同时遵守 /Users/wangjiweid/.codex/skills/zh-writing-guardrails/SKILL.md 的中文护栏。
	- 必须产出 \`source/copy.md\`，包含 4 个标题候选、可直接发布正文，以及必要时的封面短文案备注。
	- 必须产出完整 \`配文文稿.md\`，它是工作台展示标题和小红书正文的唯一发布源；不要只把标题/配文藏在 \`source/copy.md\` 里。
	- \`配文文稿.md\` 开头直接给标题候选和可发布正文，不要写“这组图主要讲”“下面展开讲讲”这类依赖卡片存在的说明句。
	- 必须同步产出到 Odin 正式生产目录：${odinTarget}
	- 当前项目目录不要求生成 \`preview/index.html\`；工作台会直接读取 \`配文文稿.md\` 和 \`source/copy.md\`。
	- project.json 的 status 标记为 \`copy_ready\`，updatedAt 用当前时间，outputs 至少记录 \`配文文稿.md\`。`
    : ''

  const videoOutputContract = isOdinVideo
    ? `
Odin HyperFrames 视频额外产出要求：
- 当前项目必须按本仓库 ${join(rootDir, 'templates', 'odin-video')} 执行。Odin 默认渲染器是 HyperFrames HTML，不要产出 Remotion 的 source/render-data.json，不要调用 Remotion renderer。
- 必读本地文档：templates/odin-video/README.md、templates/odin-video/defaults.md、templates/odin-video/visual-system.md、templates/odin-video/script-markup.md、templates/odin-video/workflow-checklist.md。
- 先应用 defaults.md 的稳定假设，不要把账号定位、默认审美、preview 优先顺序反复拿出来问用户。只有影响事实准确性、核心判断或关键素材决策的未知项，才标注 [needs user confirmation]。
- 生产流程固定为：work/odin-video-spec.md、work/script.md、work/storyboard.md、work/voiceover-minimax.txt、work/html/index.html、preview/index.html、source/copy.md。任何一件缺失都不算完工。
- 为兼容当前工作台，preview/index.html 必须是可直接打开的 HyperFrames HTML 预览；可以与 work/html/index.html 内容相同，但不能是空壳跳转页。
- HTML 预览画布固定 1440x1920，使用 templates/odin-video/visual-system.md 的 Odin 证据板视觉语言：材料板、证据行、黑色关键词条、红色手绘批注、底部单一字幕。
- 每个场景都要先选择 visual-system.md 中的 scene type：Material Duo、Evidence Board、Keyword Bars、Screenshot Focus 或 Sticker Reaction。不要生成通用 SaaS 页面或 Remotion 风格数据卡。
- HyperFrames composition 必须有 data-composition-id、data-width="1440"、data-height="1920"、data-duration、data-track-index，并同步注册 window.__timelines。
- 动画使用 GSAP paused timeline；不要用 Math.random、Date.now、repeat:-1、setTimeout 或异步构建 timeline。
- 如果需要点状强调动画，可以使用 lottie-web，但只允许做稀疏的辅助层：章戳、marker spark、brief sticker reaction。不要让 Lottie 取代主场景结构。
- 声音和字幕同源。work/voiceover-minimax.txt 可以增加停顿和换行，但不能改写 work/script.md 的含义。
- Agent 阶段必须停在 HTML 预览，不要生成 final.mp4。project.json 的 status 标记为 html_preview_ready，hasPreview=true，outputs 至少记录 work/script.md、work/html/index.html、preview/index.html。`
    : project.type === 'video'
    ? `
Remotion 视频额外产出要求：
- 当前项目已经迁入 Local Design Platform 内部生产线，不要引用外部 /Users/jiweiwang/Downloads/Code case/Remotion-Video 作为长期依赖。
- 主入口仍可参考 ${remotionVideoCreatorSkillPath} 的 Remotion 基础工作流，但最终数据契约必须以本仓库文档为准：${remotionContentSystemDir}
- 必读本地文档：content-system/system-prompt.md、tracks/ai-education.md、tracks/knowledge-sharing.md、visual-rules/schemas.md、visual-rules/scenes.md、visual-rules/motion-presets.md、visual-rules/animation-styles.md、visual-rules/color-palettes.md、visual-rules/typography.md。
- 发布账号是 ${projectVideoAccount}。如果是 yaoning，source/render-data.json 必须是 track="ai-education" 的 EducationScriptData；如果是 odin，必须是 track="knowledge-sharing" 的 KnowledgeScriptData。
- source/render-data.json 必须符合 ${remotionRendererDir}/src/data/types-v2.ts：fps=30、width=1080、height=1920、shots 5-8 个、keyword 必须是 text 子串、captionKeyword 必须是 caption 子串、scene/motionPreset/animationStyle 只能使用本地 content-system 允许值。
- 生产流程固定为：source/research.md、source/script.md、source/outline.md、source/copy.md、preview/index.html、source/render-data.json。任何一件缺失都不算完工。
- source/script.md 是给用户确认的主文件，必须包含最终旁白脚本、屏幕字幕和简短说明；不要只写口号。
- source/copy.md 必须包含发布标题候选和可直接发布的正文。
- preview/index.html 用于脚本确认前预览，必须内联 CSS，不依赖构建工具。
- Agent 阶段不要真实渲染 public/output/cover.png、public/output/frame.png、public/output/video.mp4；脚本确认后工作台会调用 /api/render-video。
- project.json 的 status 标记为 script_ready，hasPreview=true，updatedAt 用当前时间。`
    : ''
  const outputChecklist = isOdinVideo
    ? `
请产出：
1. work/script.md：带 # 01、# 02 段落 ID 的可编辑口播脚本。
2. work/odin-video-spec.md：上游创意合同，使用 defaults.md 之后只保留真正阻塞的确认项。
3. work/storyboard.md：每段对应的 scene type、材料位置、批注动作和转场说明。
4. work/voiceover-minimax.txt：与脚本同义的 MiniMax 口播稿。
5. work/html/index.html：HyperFrames HTML 动画预览。
6. preview/index.html：工作台可直接 iframe 打开的同版 HyperFrames 预览。
7. source/copy.md：发布标题候选和发布正文。
8. project.json：更新 status、hasPreview、updatedAt、outputs 字段。`
    : project.type === 'xhs' && xhsModeId === 'copy'
    ? `
请产出：
1. source/copy.md：4 个标题候选、可编辑正文、配文整理。
2. 配文文稿.md：可直接发布的标题与正文汇总。
3. project.json：更新 status、updatedAt、outputs 字段。`
    : `
请产出：
1. source/outline.md：内容结构、页面/卡片/镜头规划。
2. source/copy.md：可编辑正文或讲稿初稿。
3. preview/index.html：一个可直接打开的高质量 HTML 预览。
4. project.json：更新 status、updatedAt、outputs 字段。`
  const xhsModeRequirements = project.type === 'xhs' && xhsModeId === 'copy'
    ? `
		- 如果是小红书标题 / 正文 / 配文能力线，只交付发布标题和正文，不要伪装成整套多图项目。
		- 生成标题和正文前必须先按 odin-xiaohongshu-note-title 规则做一轮自测：检查对象、场景、真实亏点、可收藏动作、视角一致性和标题前半句信息量；只把自测后的优化版写入 source/copy.md 和 配文文稿.md。
		- 不要生成逐页标题，不要用“P1 / P2 / 第 1 页”这类结构组织正文。`
    : project.type === 'xhs'
      ? `
		- 如果是小红书多图卡片，按绑定的 xhs-carousel-infographic 主引擎和 lines/xhs-carousel.md 跑完整研究、事实校准、卡片规划、HTML/PNG 生产和验收收尾，不要只生成单个示意预览；不要退回通用 preview 页面风格。
		- 如果是小红书多图卡片，生成标题和小红书正文前必须先按 odin-xiaohongshu-note-title 规则做一轮自测：检查对象、场景、真实亏点、可收藏动作、视角一致性和标题前半句信息量；只把自测后的优化版写入 source/copy.md，不要把分析过程展示给用户。
		- 小红书多图要按多页卡片节奏写清每页标题和正文。`
      : ''
  const previewRule = isOdinVideo
    ? '- preview/index.html 和 work/html/index.html 必须是完整 HyperFrames HTML composition，不依赖构建工具即可打开检查。'
    : project.type === 'xhs' && xhsModeId === 'copy'
    ? '- 这条能力线不需要生成 preview/index.html；如果你为了内部检查临时起草页面，不要把它当最终交付写入项目。'
    : '- preview/index.html 必须内联 CSS，不依赖构建工具。'
  const assumptionRule = project.type === 'xhs' && xhsModeId === 'copy'
    ? '- 如果内容不足，请基于 Brief 合理补全，并在 source/copy.md 顶部标注"假设"。'
    : isOdinVideo
      ? '- 如果内容不足，请基于 Brief 合理补全，并在 work/storyboard.md 里标注"假设"。'
    : '- 如果内容不足，请基于 Brief 合理补全，并在 source/outline.md 里标注"假设"。'
  const videoRule = isOdinVideo
    ? '- Odin 视频严格按 templates/odin-video 的 HyperFrames HTML 路线组织脚本、分镜、口播稿和预览；不要生成 Remotion render-data，也不要在 Agent 阶段渲染 MP4。'
    : project.type === 'video'
      ? '- Remotion 视频严格按本仓库 templates/remotion-video/content-system 的双轨规则组织脚本、分镜、JSON 数据和预览；不要在 Agent 阶段直接渲染视频，脚本确认后工作台会调用 /api/render-video。'
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

任务：${task || (project.type === 'xhs' && xhsModeId === 'copy' ? '生成第一版可发布标题与正文。' : '生成第一版结构和可预览 HTML。')}
${xhsMode ? `当前子产线：${xhsMode.label}` : ''}
${outputChecklist}
${xhsOutputContract}
${videoOutputContract}

	要求：
	- 优先按绑定 skill 的工作流、输出目录、命名和验收规则执行；如果本提示和 skill 冲突，以 skill 为准。
	- ${copyAudienceRead(project.type, xhsModeId)}
	- 先按载体判断文案任务：标题、长正文、页面文案、卡片文案、口播、字幕不是同一种写法。当前主载体是：${copyCarrierLabel(project.type, xhsModeId)}。
	- 内部写作流程固定为：${copyAuditWorkflow(project.type, xhsModeId).map((item, index) => `${index + 1}. ${item}`).join(' ')}
	- 在写 source/copy.md、配文文稿.md、source/script.md、preview/index.html 之前，先自检这些门禁：${copyGateRules(project.type, xhsModeId).join(' ')}
	- 同时执行这些反套话规则：${copyAntiSlopRules(project.type, xhsModeId).join(' ')}
	- 同时执行这些品味规则：${copyTasteRules(project.type, xhsModeId).join(' ')}
${xhsModeRequirements}
	${previewRule}
	- Portfolio 页面要包含 overview、project background、design goals、process、solution、results。
	- 课程 PPT 要按逐页教学结构组织，并包含讲稿提示。
	${videoRule}
	- 所有文字自然、具体，避免空泛宣传语。
	- 如果你发现原始 Brief 信息不足，先在 ${isOdinVideo ? 'work/storyboard.md' : project.type === 'xhs' && xhsModeId === 'copy' ? 'source/copy.md' : 'source/outline.md'} 标注缺口与假设，再用最保守、最不容易误导用户的表达完成文案。
	- preview/index.html 里的标题、导语、模块标题、按钮文案、注释文案都属于正式文案，不要把它当占位符草稿。
	${assumptionRule}
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

function normalizeStringList(values, limit = Infinity) {
  if (!Array.isArray(values)) return []
  return values
    .map((value) => sanitizeText(value).trim())
    .filter(Boolean)
    .slice(0, limit)
}

function buildOptimizeCopyPrompt(project, { titles = [], postBody = '', instruction = '' }) {
  const xhsModeId = getXhsModeConfig(project)?.id || 'carousel'
  const workflow = copyAuditWorkflow(project.type, xhsModeId)
  const gates = copyGateRules(project.type, xhsModeId)
  const antiSlop = copyAntiSlopRules(project.type, xhsModeId)
  const tasteRules = copyTasteRules(project.type, xhsModeId)
  const rubric = copyScoringRubric(project.type, xhsModeId)
  return `
你要在现有项目链路里优化文案，不要新建 skill，不要解释过程。对于小红书项目，继续遵守 odin-xiaohongshu-note-title 和 zh-writing-guardrails；对于其他项目，沿用同样的结构化审校方法。
skill 文件：/Users/wangjiweid/.codex/skills/odin-xiaohongshu-note-title/SKILL.md

项目名称：${project.name}
生产线：${pipelinesById.get(project.type)?.name || project.type}
绑定 skill：${project.skill || '未指定'}
当前文案主载体：${copyCarrierLabel(project.type, xhsModeId)}
受众与阅读场景判断：
${copyAudienceRead(project.type, xhsModeId)}
用户补充优化建议：
${sanitizeText(instruction).trim() || '无。请按 Odin 小红书图文正文与标题规则自行优化。'}

当前标题候选：
${titles.map((title, index) => `${index + 1}. ${sanitizeText(title)}`).join('\n') || '无'}

当前小红书正文：
${sanitizeText(postBody)}

项目 Brief：
${sanitizeText(project.brief || '')}

内部处理顺序：
${workflow.map((item, index) => `${index + 1}. ${item}`).join('\n')}

输出前必须逐项通过这些门禁：
${gates.map((item) => `- ${item}`).join('\n')}

同时必须执行这些反套话规则：
${antiSlop.map((item) => `- ${item}`).join('\n')}

同时必须执行这些品味规则：
${tasteRules.map((item) => `- ${item}`).join('\n')}

内部评分标尺：
${rubric.map((item) => `- ${item}`).join('\n')}

请只输出一个 JSON 对象，不要 Markdown，不要解释：
${copyReviewOutputSchema(project.type, xhsModeId)}

要求：
- 标题固定 4 个，优先 14-20 字，一眼看出对象、场景或真实亏点。
- 正文必须是完整可发布正文；如果是小红书，不要逐页复述图片；如果是其他载体，也不要把页面结构说明写进正文。
- 开头直接下判断，补真实后果、判断标准和可执行动作。
- review.summary 用一句话说明这次主要改进了什么。
- review.passedGates 填写你实际通过的关键门禁，2-5 条即可。
- review.risks 只写真实剩余风险；如果没有就返回空数组。
- 不要使用 emoji，不要写成讲义或口播稿。
`.trim()
}

function buildPreflightCopyPrompt({
  type,
  xhsMode = 'carousel',
  name = '',
  brief = '',
  sourceSummary = '',
}) {
  const workflow = copyAuditWorkflow(type, xhsMode)
  const gates = copyGateRules(type, xhsMode)
  const antiSlop = copyAntiSlopRules(type, xhsMode)
  const tasteRules = copyTasteRules(type, xhsMode)
  const rubric = copyScoringRubric(type, xhsMode)

  return `
你要在项目生成前，先把文案草稿整理成更适合生产的输入。不要新建 skill，不要解释过程，不要写最终成片文案。你的任务是把“项目名 + 补充说明 + 资料摘要”整理成一个更清楚、更可执行的生产 Brief。

生产线：${pipelinesById.get(type)?.name || type}
当前文案主载体：${copyCarrierLabel(type, xhsMode)}
受众与阅读场景判断：
${copyAudienceRead(type, xhsMode)}

当前项目名称：
${sanitizeText(name).trim() || '未填写'}

当前补充说明 / Brief：
${sanitizeText(brief).trim() || '未填写'}

已识别资料摘要：
${sanitizeText(sourceSummary).trim() || '无'}

内部处理顺序：
${workflow.map((item, index) => `${index + 1}. ${item}`).join('\n')}

输出前必须逐项通过这些门禁：
${gates.map((item) => `- ${item}`).join('\n')}

同时必须执行这些反套话规则：
${antiSlop.map((item) => `- ${item}`).join('\n')}

同时必须执行这些品味规则：
${tasteRules.map((item) => `- ${item}`).join('\n')}

内部评分标尺：
${rubric.map((item) => `- ${item}`).join('\n')}

请只输出一个 JSON 对象，不要 Markdown，不要解释：
${preflightCopyOutputSchema(type, xhsMode)}

要求：
- name 只在当前名称明显含糊、冗长或不利于后续生产时才改；否则保留原意并适度收紧。
- brief 目标是帮助后续生产线更稳定地生成结构、标题、正文和 HTML，不是直接写成最终发布文案。
- brief 必须说清对象、场景、核心判断、想要避免的空话，以及希望保留的材料重点。
- 如果资料不足，不要硬编事实；把不确定部分改写成保守、可执行的表达。
- 不要使用 emoji，不要写口号，不要写“本文将介绍/建议收藏/干货来了”。
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

app.get('/api/topic-pool', async (request, response) => {
  const account = request.query.account === 'odin' ? 'odin' : 'yaoning'

  try {
    response.json(await listTopicPool(account))
  } catch (error) {
    response.status(400).json({ error: String(error) })
  }
})

app.post('/api/preflight-copy', async (request, response) => {
  try {
    const { type, xhsMode = 'carousel', provider = 'codex', name = '', brief = '', sourceSummary = '' } = request.body || {}

    if (!pipelinesById.has(type)) {
      response.status(400).json({ error: 'unknown pipeline type' })
      return
    }

    if (!brief.trim() && !name.trim() && !sourceSummary.trim()) {
      response.status(400).json({ error: 'name, brief, or sourceSummary is required' })
      return
    }

    const prompt = sanitizeText(buildPreflightCopyPrompt({ type, xhsMode, name, brief, sourceSummary }))
    const result =
      provider === 'claude'
        ? await runCommand('claude', ['--print', '--permission-mode', 'bypassPermissions'], rootDir, prompt)
        : await runCommand(
            'codex',
            [
              'exec',
              '--cd',
              rootDir,
              '--skip-git-repo-check',
              '--dangerously-bypass-approvals-and-sandbox',
              '-',
            ],
            rootDir,
            prompt,
          )

    if (!result.ok) {
      response.status(500).json(result)
      return
    }

    const parsed = extractJsonObject(result.stdout)
    if (!parsed || typeof parsed.brief !== 'string') {
      response.status(500).json({
        ok: false,
        code: 1,
        stdout: result.stdout,
        stderr: '预优化结果不是可解析的 Brief JSON。',
      })
      return
    }

    const review = parsed.review && typeof parsed.review === 'object'
      ? {
          carrier: sanitizeText(parsed.review.carrier || copyCarrierLabel(type, xhsMode)).trim(),
          summary: sanitizeText(parsed.review.summary || '').trim(),
          passedGates: normalizeStringList(parsed.review.passedGates, 8),
          risks: normalizeStringList(parsed.review.risks, 8),
        }
      : {
          carrier: copyCarrierLabel(type, xhsMode),
          summary: '',
          passedGates: [],
          risks: [],
        }

    response.json({
      ok: true,
      name: sanitizeText(parsed.name || name).trim(),
      brief: sanitizeText(parsed.brief).trim(),
      review,
      stdout: result.stdout,
      stderr: result.stderr,
    })
  } catch (error) {
    response.status(500).json({
      ok: false,
      error: String(error),
    })
  }
})

app.post('/api/projects', async (request, response) => {
  const {
    name,
    type,
    brief = '',
    sourcePath = '',
    xhsMode = '',
    videoAccount = '',
    topicCode = '',
    topicPath = '',
  } = request.body || {}

  if (!pipelinesById.has(type)) {
    response.status(400).json({ error: 'unknown pipeline type' })
    return
  }

  if (!type || (!brief.trim() && !sourcePath.trim())) {
    response.status(400).json({ error: 'type and either brief or sourcePath are required' })
    return
  }

  try {
    const project = await createProject({
      name,
      type,
      brief,
      sourcePath,
      xhsMode,
      videoAccount,
      topicCode,
      topicPath,
    })
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

const VIDEO_TRACK_BY_ACCOUNT = {
  yaoning: 'ai-education',
  odin: 'knowledge-sharing',
}
const VALID_COLOR_SCHEMES = new Set(['dark', 'light'])
const VALID_ANIMATION_STYLES = new Set([
  'smooth-reveal',
  'snappy-pop',
  'bouncy-enter',
  'dramatic-slam',
  'heavy-settle',
])
const VALID_KNOWLEDGE_CONTENT_TYPES = new Set([
  'data-insight',
  'step-breakdown',
  'concept-explain',
  'quote-insight',
  'comparison',
  'checklist',
  'timeline',
])
const VALID_KNOWLEDGE_SCENES = new Set([
  'data-reveal',
  'step-list',
  'concept-card',
  'quote-hero',
  'comparison-split',
  'checklist-reveal',
  'timeline-flow',
  'material-board',
  'annotated-proof',
  'case-breakdown',
])
const VALID_KNOWLEDGE_MOTION_PRESETS = new Set([
  'stat-slam',
  'counter-tick',
  'list-stagger',
  'highlight-sweep',
  'split-slide',
  'check-draw',
  'dot-appear',
])
const VALID_EDUCATION_CONTENT_TYPES = new Set([
  'ai-concept',
  'family-challenge',
  'story-scene',
  'usage-demo',
  'safety-rule',
  'achievement',
  'qa-reveal',
])
const VALID_EDUCATION_SCENES = new Set([
  'ai-intro',
  'challenge-game',
  'story-moment',
  'demo-walk',
  'boundary-card',
  'celebrate-win',
  'qa-flip',
])
const VALID_EDUCATION_MOTION_PRESETS = new Set([
  'character-bounce',
  'bubble-pop',
  'star-burst',
  'question-wobble',
  'reveal-spring',
  'warning-pulse',
  'confetti-burst',
])
const VALID_AGE_TARGETS = new Set(['4-6', '7-10', '11-14'])

function validateRemotionScriptData(data, videoAccount = 'yaoning') {
  const errors = []
  if (!data || typeof data !== 'object') return ['render-data 不是 object']
  const expectedTrack = VIDEO_TRACK_BY_ACCOUNT[videoAccount] || 'ai-education'
  if (data.track !== expectedTrack) {
    errors.push(`track 必须是 ${expectedTrack}，当前账号 ${videoAccount} 不能使用 ${data.track || '空值'}`)
  }
  if (typeof data.title !== 'string' || !data.title.trim()) errors.push('title 必填且为字符串')
  if (typeof data.subtitle !== 'string') errors.push('subtitle 必须是字符串')
  if (data.fps !== 30) errors.push('fps 必须等于 30')
  if (data.width !== 1080) errors.push('width 必须等于 1080')
  if (data.height !== 1920) errors.push('height 必须等于 1920')
  if (!VALID_COLOR_SCHEMES.has(data.colorScheme)) {
    errors.push('colorScheme 必须是 dark 或 light')
  }
  if (typeof data.accentColor !== 'string' || !/^#[0-9a-f]{6}$/i.test(data.accentColor)) {
    errors.push('accentColor 必须是 6 位 hex 颜色，例如 #F97316')
  }
  if (
    typeof data.shotDurationFrames !== 'number' ||
    data.shotDurationFrames < 60 ||
    data.shotDurationFrames > 180
  ) {
    errors.push('shotDurationFrames 必须在 60-180 之间')
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
  }
  if (!Array.isArray(data.shots) || data.shots.length < 5 || data.shots.length > 8) {
    errors.push('shots 必须是 5-8 个元素的数组')
  } else {
    const isEducation = expectedTrack === 'ai-education'
    const validContentTypes = isEducation ? VALID_EDUCATION_CONTENT_TYPES : VALID_KNOWLEDGE_CONTENT_TYPES
    const validScenes = isEducation ? VALID_EDUCATION_SCENES : VALID_KNOWLEDGE_SCENES
    const validMotionPresets = isEducation ? VALID_EDUCATION_MOTION_PRESETS : VALID_KNOWLEDGE_MOTION_PRESETS
    if (!validContentTypes.has(data.contentType)) {
      errors.push(`contentType 必须是: ${[...validContentTypes].join(' / ')}`)
    }
    if (isEducation && !VALID_AGE_TARGETS.has(data.ageTarget)) {
      errors.push('ageTarget 必须是 4-6 / 7-10 / 11-14')
    }
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
      if (typeof shot.caption !== 'string' || !shot.caption.trim()) errors.push(`shots[${i}].caption 必填`)
      if (typeof shot.captionKeyword !== 'string' || !shot.captionKeyword.trim()) {
        errors.push(`shots[${i}].captionKeyword 必填`)
      } else if (typeof shot.caption === 'string' && !shot.caption.includes(shot.captionKeyword)) {
        errors.push(`shots[${i}].captionKeyword "${shot.captionKeyword}" 必须是 caption "${shot.caption}" 的子串`)
      }
      if (!validScenes.has(shot.scene)) {
        errors.push(`shots[${i}].scene 必须是: ${[...validScenes].join(' / ')}`)
      }
      if (!validMotionPresets.has(shot.motionPreset)) {
        errors.push(`shots[${i}].motionPreset 必须是: ${[...validMotionPresets].join(' / ')}`)
      }
      if (!VALID_ANIMATION_STYLES.has(shot.animationStyle)) {
        errors.push(`shots[${i}].animationStyle 必须是: ${[...VALID_ANIMATION_STYLES].join(' / ')}`)
      }
    })
    if (isEducation && data.contentType === 'qa-reveal') {
      const questionShots = data.shots.filter((shot) => shot?.isQuestionShot === true).length
      const answerShots = data.shots.filter((shot) => shot?.isAnswerShot === true).length
      if (questionShots !== 1) errors.push('qa-reveal 必须且只能有一个 isQuestionShot=true')
      if (answerShots !== 1) errors.push('qa-reveal 必须且只能有一个 isAnswerShot=true')
    }
    if (isEducation && data.contentType === 'achievement') {
      const hasCelebration = data.shots.some((shot) => shot?.lottieUrl || shot?.lottieId)
      if (!hasCelebration) errors.push('achievement 至少一个 shot 需要 lottieUrl 或 lottieId')
    }
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
    const renderDataPath = join(projectDir, 'source', 'render-data.json')
    if (!(await exists(renderDataPath))) {
      response.status(400).json({
        ok: false,
        error:
          'source/render-data.json 不存在。视频生产线必须先产出符合 templates/remotion-video/content-system 的 ScriptDataV2 数据。',
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

    const schemaErrors = validateRemotionScriptData(renderData, projectVideoAccount)
    if (schemaErrors.length) {
      response.status(400).json({
        ok: false,
        error: 'render-data.json 不符合 Remotion ScriptDataV2 schema',
        details: schemaErrors,
      })
      return
    }

    if (!(await exists(remotionRendererDir))) {
      response.status(500).json({
        ok: false,
        error: `Remotion renderer 不存在：${remotionRendererDir}。当前项目应内置 renderers/remotion-video，或设置 REMOTION_VIDEO_RENDERER_DIR。`,
      })
      return
    }

    const sourceOutputDir = join(remotionRendererDir, 'public', 'output')
    await mkdir(sourceOutputDir, { recursive: true })
    if (renderData.audioPath === 'output/voiceover.mp3') {
      const projectVoiceoverPath = join(projectDir, 'source', 'audio', 'voiceover.mp3')
      const rendererVoiceoverPath = join(sourceOutputDir, 'voiceover.mp3')
      if (await exists(projectVoiceoverPath)) {
        await cp(projectVoiceoverPath, rendererVoiceoverPath)
      }
    }
    const propsPath = join(projectDir, 'source', 'render-props.json')
    await writeFile(propsPath, `${JSON.stringify({ script: renderData }, null, 2)}\n`)
    const totalFrames = renderData.shots.reduce(
      (sum, shot) => sum + (typeof shot.durationFrames === 'number' ? shot.durationFrames : renderData.shotDurationFrames),
      0,
    )
    const frameNumber = Math.max(0, Math.min(totalFrames - 1, Math.floor(totalFrames / 2)))

    const renderTargets = [
      {
        label: 'render:cover',
        cmd: 'npx',
        args: ['remotion', 'still', 'src/index.ts', 'Cover', 'public/output/cover.png', '--frame', '30'],
      },
      {
        label: 'render:frame',
        cmd: 'npx',
        args: ['remotion', 'still', 'src/index.ts', 'VideoComposition', 'public/output/frame.png', '--frame', String(frameNumber)],
      },
    ]
    const browserExecutable =
      process.env.REMOTION_BROWSER_EXECUTABLE ||
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    const renderEnv = await prepareRemotionRenderEnv()
    const logs = []
    for (const target of renderTargets) {
      const args = [...target.args, '--props', propsPath, '--browser-executable', browserExecutable]
      const result = await runCommand(target.cmd, args, remotionRendererDir, '', renderEnv)
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

    const renderedVideoPath = join(sourceOutputDir, 'video.mp4')
    const frameSequenceVideoPath = join(sourceOutputDir, 'video-frame-sequence-safe.mp4')
    const videoResult = await runCommand(
      'npx',
      ['tsx', 'scripts/render-frame-sequence-video.ts', propsPath, frameSequenceVideoPath],
      remotionRendererDir,
      '',
      renderEnv,
    )
    logs.push({
      target: 'render:video-frame-sequence-safe',
      code: videoResult.code,
      stdoutTail: videoResult.stdout.split('\n').slice(-20).join('\n'),
      stderrTail: videoResult.stderr.split('\n').slice(-20).join('\n'),
    })
    if (!videoResult.ok) {
      response.status(500).json({
        ok: false,
        error: `帧序列安全视频渲染失败（code=${videoResult.code}）`,
        logs,
      })
      return
    }
    await cp(frameSequenceVideoPath, renderedVideoPath)

    const projectOutputDir = join(projectDir, 'public', 'output')
    await mkdir(projectOutputDir, { recursive: true })
    const copied = []
    for (const file of ['cover.png', 'frame.png', 'video.mp4']) {
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
      'public/output/video.mp4',
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
      { type: 'video', path: 'public/output/video.mp4' },
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

    const review = parsed.review && typeof parsed.review === 'object'
      ? {
          carrier: sanitizeText(parsed.review.carrier || copyCarrierLabel(project.type, project.xhsMode || 'carousel')).trim(),
          summary: sanitizeText(parsed.review.summary || '').trim(),
          passedGates: normalizeStringList(parsed.review.passedGates, 8),
          risks: normalizeStringList(parsed.review.risks, 8),
        }
      : {
          carrier: copyCarrierLabel(project.type, project.xhsMode || 'carousel'),
          summary: '',
          passedGates: [],
          risks: [],
        }

    await writeFile(
      join(projectDir, 'source', 'optimized-xhs-copy.json'),
      `${JSON.stringify({
        titles: normalizeStringList(parsed.titles, 4),
        postBody: sanitizeText(parsed.postBody).trim(),
        review,
        instruction,
        updatedAt: new Date().toISOString(),
      }, null, 2)}\n`,
    )

    response.json({
      ok: true,
      titles: normalizeStringList(parsed.titles, 4),
      postBody: sanitizeText(parsed.postBody).trim(),
      review,
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

app.post('/api/export-tts', async (request, response) => {
  try {
    const { projectId } = request.body || {}
    if (!projectId) {
      response.status(400).json({ ok: false, error: 'projectId is required' })
      return
    }

    const projectDir = join(projectsDir, projectId)
    const renderDataPath = join(projectDir, 'source', 'render-data.json')
    if (!(await exists(renderDataPath))) {
      response.status(400).json({
        ok: false,
        error: 'source/render-data.json 不存在。先生成脚本并产出 render-data.json，再导出口播稿。',
      })
      return
    }

    let script
    try {
      script = JSON.parse(await readFile(renderDataPath, 'utf8'))
    } catch (parseError) {
      response.status(400).json({ ok: false, error: `render-data.json 解析失败：${parseError.message}` })
      return
    }

    if (!Array.isArray(script.shots) || !script.shots.length) {
      response.status(400).json({ ok: false, error: 'render-data.json 缺少 shots 数组。' })
      return
    }

    const fps = Number(script.fps) || 30
    const shotFrames = Number(script.shotDurationFrames) || 90
    const shotDuration = (shotFrames / fps).toFixed(1)
    const totalSeconds = (script.shots.length * shotFrames / fps).toFixed(1)
    const captions = script.shots
      .map((shot) => sanitizeText(shot && shot.caption ? shot.caption : '').trim())
      .filter(Boolean)

    if (!captions.length) {
      response.status(400).json({ ok: false, error: '所有 shot 都没有 caption，无法导出口播稿。' })
      return
    }

    const header = [
      `# 视频：${script.title || projectId}`,
      `# 赛道：${script.track || 'unknown'}`,
      `# 每镜头：${shotDuration}s × ${script.shots.length} 镜头 = ${totalSeconds}s`,
      `#`,
      `# 下方可直接粘贴到 MiniMax 海螺 TTS（## 为段落分隔，平台会按段落自然停顿）：`,
      `# ${'='.repeat(60)}`,
      '',
    ].join('\n')

    const body = captions.join('\n##\n') + '\n'
    const exportsDir = join(projectDir, 'exports')
    await mkdir(exportsDir, { recursive: true })
    const outPath = join(exportsDir, 'voiceover.txt')
    await writeFile(outPath, header + '\n' + body, 'utf8')

    response.json({
      ok: true,
      path: relative(rootDir, outPath),
      shots: captions.length,
      totalSeconds: parseFloat(totalSeconds),
    })
  } catch (error) {
    response.status(500).json({ ok: false, error: String(error) })
  }
})

app.use('/projects', express.static(projectsDir))
app.use('/yaoning-output', express.static(join(remotionRendererDir, 'public', 'output')))
app.use('/remotion-output', express.static(join(remotionRendererDir, 'public', 'output')))
app.use(express.static(join(rootDir, 'dist')))

const server = app.listen(port, '127.0.0.1', () => {
  console.log(`Local Design System API running at http://127.0.0.1:${port}`)
})

server.ref()

import {
  Archive,
  ChevronRight,
  Clapperboard,
  FileImage,
  FileText,
  FolderOpen,
  LayoutDashboard,
  Monitor,
  PanelsTopLeft,
  Presentation,
  RotateCcw,
  Settings,
  Sparkles,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import pipelineConfig from '../pipelines.config.json'
import './App.css'

type PipelineId = 'xhs' | 'portfolio' | 'course' | 'video'
type XhsModeId = 'carousel' | 'copy' | 'topic'

type XhsMode = {
  id: XhsModeId
  label: string
  kind: 'workflow' | 'capability'
  description: string
  starter: string
  entrySkill: string
  entrySkillLabel?: string
  subflowLabel?: string
  capabilityLabels?: string[]
  sharedLabels?: string[]
  relatedSkills?: string[]
  relatedSkillLabels?: string[]
  workflow?: string[]
  steps?: string[]
  actionLabel: string
  preflightLabel?: string
  resultKind?: 'preview' | 'copy' | 'topic'
  status?: 'active' | 'coming-soon'
}

type Pipeline = {
  id: PipelineId
  name: string
  description: string
  formats: string[]
  accent: string
  icon: typeof FileImage
  steps: string[]
  starter: string
  skill: string
  skillLabel?: string
  workflowLabel?: string
  subflowLabel?: string
  capabilityLabels?: string[]
  sharedLabels?: string[]
  relatedSkills: string[]
  relatedSkillLabels?: string[]
  workflow: string[]
  modes?: XhsMode[]
}

type IconName = 'Clapperboard' | 'FileImage' | 'PanelsTopLeft' | 'Presentation'

type PipelineConfig = Omit<Pipeline, 'icon'> & {
  icon: IconName
}

type Project = {
  id: string
  name: string
  type: PipelineId
  xhsMode?: XhsModeId
  videoAccount?: VideoAccountId
  skill?: string
  relatedSkills?: string[]
  workflow?: string[]
  brief?: string
  sourcePath?: string
  topicCode?: string
  topicPath?: string
  updatedAt: string
  status: string
  outputs: Array<string | { type?: string; path?: string }>
  hasPreview?: boolean
  previewAssets?: string[]
  resultSummary?: {
    pageTitles?: string[]
    titleOptions?: string[]
    postBody?: string
    scriptText?: string
    outlineText?: string
    subtitle?: string
    caption?: string
    pageCount?: string
  }
}

type ProviderHealth = {
  codex: string | null
  claude: string | null
}

type CopyReview = {
  carrier?: string
  summary?: string
  passedGates?: string[]
  risks?: string[]
}

type SourcePreview = {
  suggestedName: string
  suggestedBrief: string
  fileCount: number
  sourcePath: string
}

type SourceMode = 'brief' | 'directory' | 'topic-pool'

type TopicPoolItem = {
  code: string
  title: string
  status: string
  priority: string
  series: string
  decision: string
  carrier: string
  excerpt: string
  path: string
  relativePath: string
  updated: string
  isCurrent: boolean
  isFeatured: boolean
}

type TopicPoolData = {
  account: VideoAccountId
  rootPath: string
  dashboard: {
    title: string
    updated: string
    currentTopicKey?: string
    featuredKeys?: string[]
  } | null
  topics: TopicPoolItem[]
}

const iconMap = {
  Clapperboard,
  FileImage,
  PanelsTopLeft,
  Presentation,
}

const pipelines: Pipeline[] = (pipelineConfig as PipelineConfig[]).map((pipeline) => ({
  ...pipeline,
  icon: iconMap[pipeline.icon],
}))

function formatOutput(output: string | { type?: string; path?: string }) {
  return typeof output === 'string' ? output : output.path || output.type || 'output'
}

function isModeAvailable(mode?: Pick<XhsMode, 'status'> | null) {
  return (mode?.status || 'active') !== 'coming-soon'
}

function getPipelineSkillLabel(
  pipeline?: Pick<Pipeline, 'skill' | 'skillLabel'> | null,
  mode?: Pick<XhsMode, 'entrySkill' | 'entrySkillLabel'> | null,
) {
  return mode?.entrySkillLabel || mode?.entrySkill || pipeline?.skillLabel || pipeline?.skill || '未指定'
}

function getPipelineStarterText(
  pipeline?: Pick<Pipeline, 'starter'> | null,
  mode?: Pick<XhsMode, 'starter'> | null,
) {
  return mode?.starter || pipeline?.starter || ''
}

function getPipelineSteps(
  pipeline?: Pick<Pipeline, 'steps'> | null,
  mode?: Pick<XhsMode, 'steps'> | null,
) {
  return mode?.steps?.length ? mode.steps : pipeline?.steps || []
}

function getPipelineStructure(pipeline?: Pipeline | null, mode?: XhsMode | null) {
  if (!pipeline) return []
  const items = []
  const subflowLabel = mode?.subflowLabel || pipeline.subflowLabel
  const capabilityLabels = mode?.capabilityLabels?.length ? mode.capabilityLabels : pipeline.capabilityLabels
  const sharedLabels = mode?.sharedLabels?.length ? mode.sharedLabels : pipeline.sharedLabels
  if (pipeline.workflowLabel) items.push({ label: '工作流入口', value: pipeline.workflowLabel })
  if (subflowLabel) items.push({ label: '当前子产线', value: subflowLabel })
  if (capabilityLabels?.length) items.push({ label: '文案能力', value: capabilityLabels.join(' / ') })
  if (sharedLabels?.length) items.push({ label: '共享护栏', value: sharedLabels.join(' / ') })
  return items
}

async function readResponse(response: Response) {
  const text = await response.text()
  const contentType = response.headers.get('content-type') || ''

  if (contentType.includes('application/json')) {
    return JSON.parse(text)
  }

  throw new Error(`接口返回了非 JSON 响应：${text.slice(0, 160)}`)
}

const sampleProjects: Project[] = [
  {
    id: '260429-xhs-ai-resume',
    name: 'AI 简历改造清单',
    type: 'xhs',
    updatedAt: '今天 14:20',
    status: '文案编辑',
    outputs: ['8 张 PNG', 'post-caption.md'],
  },
  {
    id: '260429-portfolio-saas',
    name: 'B 端数据看板作品集',
    type: 'portfolio',
    updatedAt: '今天 13:48',
    status: '结构规划',
    outputs: ['preview.html', 'layout-plan.json'],
  },
  {
    id: '260428-course-agent',
    name: 'Agent 课程第一讲',
    type: 'course',
    updatedAt: '昨天 22:10',
    status: '讲稿对齐',
    outputs: ['deck.pptx', 'slide-notes.md'],
  },
]

type VideoAccountId = 'yaoning' | 'odin'

const videoAccounts: Record<
  VideoAccountId,
  {label: string; brand: string; tagline: string; accent: string; bg: string; border: string}
> = {
  yaoning: {
    label: '曜宁 · 亲子 AI 教育',
    brand: '带曜宁玩 AI',
    tagline: 'Yaoning',
    accent: '#FFB52E',
    bg: 'linear-gradient(180deg, #fff5dc 0%, #ffe4b3 100%)',
    border: '#f1c47e',
  },
  odin: {
    label: 'Odin · 设计师求职导师',
    brand: 'Odin · 设计求职',
    tagline: 'Odin',
    accent: '#2D7FA3',
    bg: 'linear-gradient(180deg, #e9f3fb 0%, #c7dff0 100%)',
    border: '#7eaecc',
  },
}

function App() {
  const previewCanvasRef = useRef<HTMLDivElement | null>(null)
  const productionProgressTimerRef = useRef<number | null>(null)
  const [selectedPipelineId, setSelectedPipelineId] = useState<PipelineId>('portfolio')
  const [selectedXhsModeId, setSelectedXhsModeId] = useState<XhsModeId>('carousel')
  const [brief, setBrief] = useState('')
  const [projectName, setProjectName] = useState('')
  const [sourceMode, setSourceMode] = useState<SourceMode>('brief')
  const [sourcePath, setSourcePath] = useState('')
  const [sourcePreview, setSourcePreview] = useState<SourcePreview | null>(null)
  const [isReadingSource, setIsReadingSource] = useState(false)
  const [isPreflightingCopy, setIsPreflightingCopy] = useState(false)
  const [topicPool, setTopicPool] = useState<TopicPoolData | null>(null)
  const [isLoadingTopicPool, setIsLoadingTopicPool] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState<TopicPoolItem | null>(null)
  const [projects, setProjects] = useState<Project[]>(sampleProjects)
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null)
  const [provider, setProvider] = useState<'codex' | 'claude'>('codex')
  const [health, setHealth] = useState<ProviderHealth>({ codex: null, claude: null })
  const [isGenerating, setIsGenerating] = useState(false)
  const [agentLog, setAgentLog] = useState('等待生成任务。')
  const [previewScale, setPreviewScale] = useState(0.65)
  const [selectedPreviewIndex, setSelectedPreviewIndex] = useState(0)
  const [showCompletedSource, setShowCompletedSource] = useState(false)
  const [editableTitles, setEditableTitles] = useState<string[]>([])
  const [editablePostBody, setEditablePostBody] = useState('')
  const [isOptimizeDialogOpen, setIsOptimizeDialogOpen] = useState(false)
  const [optimizeInstruction, setOptimizeInstruction] = useState('')
  const [isOptimizingCopy, setIsOptimizingCopy] = useState(false)
  const [isRenderingVideo, setIsRenderingVideo] = useState(false)
  const [productionProgressStep, setProductionProgressStep] = useState<number | null>(null)
  const [videoAccount, setVideoAccount] = useState<VideoAccountId>('yaoning')
  const activeAccount = videoAccounts[videoAccount]

  const activePipeline = useMemo(
    () => pipelines.find((pipeline) => pipeline.id === selectedPipelineId) || pipelines[0],
    [selectedPipelineId],
  )
  const activeXhsMode = useMemo(
    () =>
      activePipeline.id === 'xhs'
        ? activePipeline.modes?.find((mode) => mode.id === selectedXhsModeId) || activePipeline.modes?.[0] || null
        : null,
    [activePipeline, selectedXhsModeId],
  )

  const activeProject = useMemo(
    () => projects.find((project) => project.id === activeProjectId) || null,
    [activeProjectId, projects],
  )
  const displayPipeline = useMemo(
    () => pipelines.find((pipeline) => pipeline.id === (activeProject?.type || selectedPipelineId)) || pipelines[0],
    [activeProject?.type, selectedPipelineId],
  )
  const isProjectMatchingPipeline = Boolean(
    activeProject && activeProject.type === selectedPipelineId,
  )
  const displayXhsMode = useMemo(() => {
    if (displayPipeline.id !== 'xhs') return null
    const modeId = isProjectMatchingPipeline ? activeProject?.xhsMode || selectedXhsModeId : selectedXhsModeId
    return displayPipeline.modes?.find((mode) => mode.id === modeId) || displayPipeline.modes?.[0] || null
  }, [activeProject?.xhsMode, displayPipeline, isProjectMatchingPipeline, selectedXhsModeId])
  const activeSteps = useMemo(
    () => getPipelineSteps(activePipeline, activeXhsMode),
    [activePipeline, activeXhsMode],
  )
  const displaySteps = useMemo(
    () => getPipelineSteps(displayPipeline, displayXhsMode),
    [displayPipeline, displayXhsMode],
  )
  const activePreviewPath =
    activeProject && isProjectMatchingPipeline
      ? `/projects/${activeProject.id}/preview/index.html`
      : ''
  const activePreviewAssets = isProjectMatchingPipeline ? activeProject?.previewAssets || [] : []
  const safePreviewIndex = activePreviewAssets[selectedPreviewIndex] ? selectedPreviewIndex : 0
  const activePreviewAsset = activePreviewAssets[safePreviewIndex]
  const hasCopyResult = Boolean(
    activeProject?.resultSummary?.titleOptions?.length ||
      activeProject?.resultSummary?.pageTitles?.length ||
      activeProject?.resultSummary?.postBody,
  )
  const isCompletedProject = Boolean(
    activeProject &&
      isProjectMatchingPipeline &&
      (activeProject.hasPreview ||
        activePreviewAssets.length ||
        (displayPipeline.id === 'xhs' && displayXhsMode?.resultKind === 'copy' && hasCopyResult)),
  )

  // Video-specific preview assets: cover.png / frame*.png / video.mp4
  const videoOutputUrl = useCallback(
    (path: string) => (activeProject ? `/projects/${activeProject.id}/${path}` : ''),
    [activeProject],
  )
  const videoOutputs = useMemo(() => {
    if (!activeProject || !isProjectMatchingPipeline || activeProject.type !== 'video') {
      return { cover: '', frames: [] as string[], video: '' }
    }
    const outputs = (activeProject.outputs || []) as Array<string | { type?: string; path?: string }>
    let cover = ''
    let video = ''
    const frames: string[] = []
    for (const item of outputs) {
      if (typeof item === 'string') continue
      const path = item.path || ''
      const type = item.type || ''
      if (!path) continue
      if (type === 'cover' || /(^|\/)cover\.png$/.test(path)) cover = videoOutputUrl(path)
      else if (type === 'video' || /\.mp4$/.test(path)) video = videoOutputUrl(path)
      else if (type === 'frame' || /(^|\/)frame[^/]*\.png$/.test(path)) frames.push(videoOutputUrl(path))
    }
    return { cover, frames, video }
  }, [activeProject, isProjectMatchingPipeline, videoOutputUrl])
  const hasVideoOutputs = Boolean(videoOutputs.cover || videoOutputs.video || videoOutputs.frames.length)
  const activeVideoScript = activeProject?.resultSummary?.scriptText || ''
  const activeVideoOutline = activeProject?.resultSummary?.outlineText || ''

  const hasSourceInput =
    sourceMode === 'directory'
      ? Boolean(sourcePath.trim() && sourcePreview)
      : sourceMode === 'topic-pool'
        ? Boolean(sourcePath.trim() && selectedTopic)
        : Boolean(brief.trim())
  const canStartProduction =
    !isCompletedProject &&
    hasSourceInput &&
    !isGenerating &&
    !isRenderingVideo &&
    !isReadingSource &&
    (activePipeline.id !== 'xhs' || isModeAvailable(activeXhsMode))
  const completedTitles = activeProject?.resultSummary?.pageTitles || []
  const showProductionProgress = (isGenerating || isRenderingVideo) && productionProgressStep !== null

  type VideoPipelineState = 'empty' | 'producing' | 'done'
  const videoPipelineState = useMemo<VideoPipelineState>(() => {
    if (activePipeline.id !== 'video') return 'empty'
    if (isCompletedProject) return 'done'
    if (isGenerating) return 'producing'
    return 'empty'
  }, [activePipeline.id, isCompletedProject, isGenerating])

  const isVideoPipeline = activePipeline.id === 'video'
  const isXhsPipeline = activePipeline.id === 'xhs'
  const isOdinVideoSelection = isVideoPipeline && videoAccount === 'odin'
  const isOdinVideoProject = Boolean(activeProject?.type === 'video' && (activeProject.videoAccount || videoAccount) === 'odin')
  const previewToolbarLabel =
    activePreviewPath ||
    (displayPipeline.id === 'xhs' && displayXhsMode?.resultKind === 'copy'
      ? '配文文稿.md / source/copy.md'
      : '等待生成 preview/index.html')

  useEffect(() => {
    const element = previewCanvasRef.current
    if (!element) return

    const resizeObserver = new ResizeObserver(([entry]) => {
      const availableWidth = entry.contentRect.width
      setPreviewScale(Math.min(1, Math.max(0.35, availableWidth / 1080)))
    })

    resizeObserver.observe(element)
    return () => resizeObserver.disconnect()
  }, [activeProject?.id])

  useEffect(() => {
    async function loadWorkspace() {
      try {
        const [healthResponse, projectsResponse] = await Promise.all([
          fetch('/api/health'),
          fetch('/api/projects'),
        ])
        const healthData = await readResponse(healthResponse)
        const projectsData = await readResponse(projectsResponse)
        setHealth(healthData.providers)

        if (projectsData.projects?.length) {
          setProjects(projectsData.projects)
          setActiveProjectId(projectsData.projects[0].id)
          setSelectedPipelineId(projectsData.projects[0].type)
          if (projectsData.projects[0].type === 'xhs') {
            setSelectedXhsModeId(projectsData.projects[0].xhsMode || 'carousel')
          }
          if (projectsData.projects[0].type === 'video') {
            setVideoAccount(projectsData.projects[0].videoAccount || 'yaoning')
          }
          setSelectedPreviewIndex(0)
          setEditableTitles((projectsData.projects[0].resultSummary?.titleOptions || []).slice(0, 4))
          setEditablePostBody(projectsData.projects[0].resultSummary?.postBody || '')
        }
      } catch (error) {
        setAgentLog(`后端未连接：${String(error)}`)
      }
    }

    void loadWorkspace()
  }, [])

  const loadTopicPool = useCallback(
    async (account: VideoAccountId) => {
      setIsLoadingTopicPool(true)
      try {
        const response = await fetch(`/api/topic-pool?account=${account}`)
        const data = await readResponse(response)
        if (!response.ok) {
          setAgentLog(data.error || '选题池读取失败。')
          setTopicPool(null)
          return
        }
        setTopicPool(data)
      } catch (error) {
        setAgentLog(`选题池读取失败：${String(error)}`)
        setTopicPool(null)
      } finally {
        setIsLoadingTopicPool(false)
      }
    },
    [],
  )

  useEffect(() => {
    if (selectedPipelineId !== 'video') return
    void loadTopicPool(videoAccount)
  }, [loadTopicPool, selectedPipelineId, videoAccount])

  useEffect(() => {
    if (!topicPool) {
      setSelectedTopic(null)
      return
    }

    const targetTopicPath =
      activeProject?.topicPath ||
      (sourceMode === 'topic-pool' ? sourcePath.trim() : '')

    if (!targetTopicPath && !activeProject?.topicCode) return

    const matchedTopic =
      topicPool.topics.find((topic) => topic.path === targetTopicPath) ||
      topicPool.topics.find((topic) => topic.code === activeProject?.topicCode) ||
      null

    if (matchedTopic) {
      setSelectedTopic(matchedTopic)
      if (sourceMode === 'topic-pool' && !brief.trim()) {
        setBrief(matchedTopic.excerpt)
      }
    }
  }, [activeProject?.topicCode, activeProject?.topicPath, brief, sourceMode, sourcePath, topicPool])

  function selectPipeline(pipelineId: PipelineId) {
    const pipeline = pipelines.find((item) => item.id === pipelineId) || pipelines[0]
    setSelectedPipelineId(pipeline.id)
    if (pipeline.id === 'xhs') {
      const firstAvailableMode =
        pipeline.modes?.find((mode) => isModeAvailable(mode))?.id || pipeline.modes?.[0]?.id || 'carousel'
      setSelectedXhsModeId(firstAvailableMode)
    } else {
      setSelectedXhsModeId('carousel')
    }
    setBrief('')
    setProjectName('')
    setSourceMode('brief')
    setSourcePath('')
    setSourcePreview(null)
    setSelectedTopic(null)
    setActiveProjectId(null)
    setSelectedPreviewIndex(0)
    setShowCompletedSource(false)
    setEditableTitles([])
    setEditablePostBody('')
    setIsOptimizeDialogOpen(false)
    setOptimizeInstruction('')
  }

  function selectProject(project: Project) {
    setActiveProjectId(project.id)
    setSelectedPipelineId(project.type)
    if (project.type === 'xhs') {
      setSelectedXhsModeId(project.xhsMode || 'carousel')
    }
    if (project.type === 'video') {
      setVideoAccount(project.videoAccount || 'yaoning')
    }
    setProjectName(project.name)
    setBrief(project.brief || '')
    setSourcePath(project.sourcePath || '')
    setSourcePreview(null)
    setSelectedTopic(null)
    setSourceMode(project.topicPath ? 'topic-pool' : project.sourcePath ? 'directory' : 'brief')
    setSelectedPreviewIndex(0)
    setShowCompletedSource(false)
    setEditableTitles((project.resultSummary?.titleOptions || []).slice(0, 4))
    setEditablePostBody(project.resultSummary?.postBody || '')
    setIsOptimizeDialogOpen(false)
    setOptimizeInstruction('')
  }

  function resetDraft() {
    const fallbackXhsMode =
      pipelines.find((pipeline) => pipeline.id === selectedPipelineId)?.modes?.find((mode) => isModeAvailable(mode))?.id ||
      'carousel'
    setProjectName('')
    setBrief('')
    setSourceMode('brief')
    setSourcePath('')
    setSourcePreview(null)
    setSelectedTopic(null)
    setActiveProjectId(null)
    if (selectedPipelineId === 'xhs') setSelectedXhsModeId(fallbackXhsMode)
    setSelectedPreviewIndex(0)
    setShowCompletedSource(false)
    setEditableTitles([])
    setEditablePostBody('')
    setIsOptimizeDialogOpen(false)
    setOptimizeInstruction('')
    stopProductionProgress()
    setAgentLog('等待生成任务。')
  }

  function stopProductionProgress() {
    if (productionProgressTimerRef.current !== null) {
      window.clearInterval(productionProgressTimerRef.current)
      productionProgressTimerRef.current = null
    }
    setProductionProgressStep(null)
  }

  function startProductionProgress() {
    if (productionProgressTimerRef.current !== null) {
      window.clearInterval(productionProgressTimerRef.current)
    }

    setProductionProgressStep(0)
    productionProgressTimerRef.current = window.setInterval(() => {
      setProductionProgressStep((current) => {
        if (current === null) return 0
        return Math.min(current + 1, Math.max(displaySteps.length - 1, 0))
      })
    }, 7000)
  }

  async function previewSource(path: string) {
    const trimmedPath = path.trim()
    setSourcePath(path)

    if (!trimmedPath) {
      setSourcePreview(null)
      return
    }

    setIsReadingSource(true)
    try {
      const response = await fetch('/api/source-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: selectedPipelineId, sourcePath: trimmedPath }),
      })

      const data = await readResponse(response)
      if (!response.ok) {
        setAgentLog(data.error || '目录读取失败。')
        setSourcePreview(null)
        return
      }

      setSourcePreview(data)
      setProjectName((current) => current.trim() || data.suggestedName)
      setBrief((current) => current.trim() || data.suggestedBrief)
      setAgentLog(`已读取 ${data.fileCount} 个资料文件。项目名称和 brief 已自动填入，可继续编辑。`)
    } catch (error) {
      setAgentLog(`目录读取失败：${String(error)}`)
    } finally {
      setIsReadingSource(false)
    }
  }

  function updateSourcePath(value: string) {
    setSourcePath(value)
    setSourcePreview(null)
    if (selectedTopic?.path !== value.trim()) {
      setSelectedTopic(null)
    }
  }

  function applyTopicToDraft(topic: TopicPoolItem) {
    setSourceMode('topic-pool')
    setSelectedTopic(topic)
    setProjectName(topic.title)
    setBrief(topic.excerpt)
    setSourcePath(topic.path)
    setSourcePreview({
      suggestedName: topic.title,
      suggestedBrief: topic.excerpt,
      fileCount: 1,
      sourcePath: topic.path,
    })
    setAgentLog(`已载入选题：${topic.code} · ${topic.title}`)
  }

  async function createProject(overrides?: { name?: string; brief?: string }) {
    const trimmedBrief = (overrides?.brief ?? brief).trim()
    const trimmedSourcePath = sourcePath.trim()
    const trimmedName = (overrides?.name ?? projectName).trim()

    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: trimmedName,
        type: selectedPipelineId,
        xhsMode: selectedPipelineId === 'xhs' ? activeXhsMode?.id : undefined,
        videoAccount: selectedPipelineId === 'video' ? videoAccount : undefined,
        brief: trimmedBrief,
        sourcePath: sourceMode === 'brief' ? '' : trimmedSourcePath,
        topicCode: sourceMode === 'topic-pool' ? selectedTopic?.code : undefined,
        topicPath: sourceMode === 'topic-pool' ? selectedTopic?.path : undefined,
      }),
    })

    if (!response.ok) {
      const data = await readResponse(response)
      setAgentLog(data.error || JSON.stringify(data))
      return null
    }

    const data = await readResponse(response)
    setProjects((current) => [data.project, ...current.filter((item) => item.id !== data.project.id)])
    setActiveProjectId(data.project.id)
    setSelectedPreviewIndex(0)
    setEditableTitles([])
    setEditablePostBody('')
    return data.project as Project
  }

  async function requestPreflightCopy() {
    const sourceSummary = sourcePreview?.suggestedBrief || ''
    if (!projectName.trim() && !brief.trim() && !sourceSummary.trim()) {
      throw new Error('先填写项目名称、补充说明，或先识别材料，再做预优化。')
    }

    const response = await fetch('/api/preflight-copy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: selectedPipelineId,
        xhsMode: selectedPipelineId === 'xhs' ? activeXhsMode?.id : undefined,
        provider,
        name: projectName,
        brief,
        sourceSummary,
      }),
    })

    const data = await readResponse(response)
    if (!response.ok) {
      throw new Error(data.stderr || data.error || '预优化失败。')
    }

    return data as { name?: string; brief?: string; review?: CopyReview }
  }

  async function preflightCopyDraft() {
    setIsPreflightingCopy(true)
    setAgentLog(
      isXhsPipeline && activeXhsMode?.id === 'copy'
        ? '正在整理标题 / 正文 / 配文这条能力线的输入...'
        : '正在预优化小红书生产输入...',
    )

    try {
      const data = await requestPreflightCopy()
      setProjectName(data.name || projectName)
      setBrief(data.brief || brief)
      const review = (data.review || {}) as CopyReview
      const summary = review.summary ? ` ${review.summary}` : ''
      setAgentLog(`已完成生成前文案整理。${summary}`.trim())
    } catch (error) {
      setAgentLog(`预优化失败：${String(error)}`)
    } finally {
      setIsPreflightingCopy(false)
    }
  }

  async function refreshProjects(targetProjectId = activeProjectId) {
    const projectsResponse = await fetch('/api/projects')
    const projectsData = await readResponse(projectsResponse)
    if (projectsData.projects?.length) {
      setProjects(projectsData.projects)
      const refreshedActiveProject = projectsData.projects.find((project: Project) => project.id === targetProjectId)
      if (refreshedActiveProject) {
        setEditableTitles((refreshedActiveProject.resultSummary?.titleOptions || []).slice(0, 4))
        setEditablePostBody(refreshedActiveProject.resultSummary?.postBody || '')
      }
    }
  }

  async function renderVideoProject(projectId: string, mode: 'auto' | 'manual' = 'manual') {
    if (isRenderingVideo) return false
    if (isOdinVideoProject) {
      setAgentLog('Odin 视频当前默认停在 HyperFrames HTML 预览。最终 MP4 导出需要接入 HyperFrames render，不再调用 Remotion renderer。')
      return false
    }
    setIsRenderingVideo(true)
    setProductionProgressStep(Math.max(displaySteps.length - 1, 0))
    setAgentLog(
      mode === 'auto'
        ? 'Agent 已完成脚本/分镜/数据文件，正在调用本地 Remotion renderer 渲染 cover.png / frame.png / video.mp4...'
        : '正在调用本地 Remotion renderer 渲染 cover.png / frame.png / video.mp4...',
    )

    try {
      const response = await fetch('/api/render-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok || !data?.ok) {
        const detail = Array.isArray(data?.details) ? `\n${data.details.join('\n')}` : ''
        const logsLine = Array.isArray(data?.logs)
          ? `\n${data.logs.map((log: { target: string; code: number; stderrTail?: string }) => `[${log.target}] code=${log.code}\n${log.stderrTail || ''}`).join('\n')}`
          : ''
        setAgentLog(`视频渲染失败：${data?.error || response.statusText}${detail}${logsLine}`)
        return false
      }

      await refreshProjects(projectId)
      setSelectedPreviewIndex(0)
      setAgentLog(
        `视频已渲染完成：${(data.copied || []).join(', ') || 'cover.png / frame.png / video.mp4'}。右侧可直接播放 video.mp4。`,
      )
      return true
    } catch (error) {
      setAgentLog(`视频渲染异常：${String(error)}`)
      return false
    } finally {
      setIsRenderingVideo(false)
      if (mode === 'manual') stopProductionProgress()
    }
  }

  async function generateWithAgent() {
    setIsGenerating(true)
    startProductionProgress()
    setAgentLog(
      isXhsPipeline && activeXhsMode?.id === 'copy'
        ? '正在准备文案项目，并调用本机 CLI Agent 生成标题与正文...'
        : '正在准备项目并调用本机 CLI Agent...',
    )

    try {
      let draftName = projectName
      let draftBrief = brief

      if (selectedPipelineId === 'xhs') {
        setIsPreflightingCopy(true)
        setAgentLog(
          activeXhsMode?.id === 'copy'
            ? '正在先整理文案输入，再进入标题 / 正文 / 配文能力线...'
            : '正在先做一轮自动文案审校，再进入小红书生产...',
        )
        try {
          const preflight = await requestPreflightCopy()
          draftName = preflight.name || draftName
          draftBrief = preflight.brief || draftBrief
          setProjectName(draftName)
          setBrief(draftBrief)
        } finally {
          setIsPreflightingCopy(false)
        }
      }

      const project = await createProject({ name: draftName, brief: draftBrief })
      if (!project) return

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project.id,
          provider,
          task:
            selectedPipelineId === 'xhs' && activeXhsMode?.id === 'copy'
              ? `为 ${activePipeline.name} 生成第一版可发布标题与正文交付。`
              : selectedPipelineId === 'video' && videoAccount === 'odin'
                ? `为 Odin 视频生成第一版 HyperFrames HTML 预览交付。`
              : `为 ${activePipeline.name} 生成第一版可预览交付包。`,
        }),
      })

      const result = await readResponse(response)
      setProductionProgressStep(displaySteps.length - 1)
      const output = [result.stdout, result.stderr].filter(Boolean).join('\n\n')
      setAgentLog(output || 'Agent 已完成，但没有输出日志。')

      await refreshProjects(project.id)
      if (project.type === 'video' && response.ok) {
        setAgentLog(
          project.videoAccount === 'odin'
            ? 'Odin HyperFrames 脚本、分镜和 HTML 预览已生成。请先检查预览，确认后再进入最终导出。'
            : '脚本、分镜和 Remotion 数据已生成。请先检查左侧脚本，确认后再点击「确认脚本并渲染」。',
        )
      } else if (project.type === 'xhs' && project.xhsMode === 'copy' && response.ok) {
        setAgentLog('标题候选和可发布正文已生成。左侧可以继续编辑，右侧会提示文案产物位置。')
      }
    } catch (error) {
      setAgentLog(`生成失败：${String(error)}`)
    } finally {
      setIsGenerating(false)
      stopProductionProgress()
    }
  }

  async function regenerateActiveProject() {
    if (!activeProject) return

    setIsGenerating(true)
    startProductionProgress()
    setAgentLog('正在重新生产当前项目...')

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: activeProject.id,
          provider,
          task:
            activeProject.type === 'xhs' && activeProject.xhsMode === 'copy'
              ? `根据当前项目资料重新生成 ${displayPipeline.name} 的标题与正文交付。`
              : activeProject.type === 'video' && activeProject.videoAccount === 'odin'
                ? `根据当前项目资料重新生成 Odin HyperFrames HTML 预览交付。`
              : `根据当前项目资料重新生成 ${displayPipeline.name} 交付包。`,
        }),
      })

      const result = await readResponse(response)
      setProductionProgressStep(displaySteps.length - 1)
      const output = [result.stdout, result.stderr].filter(Boolean).join('\n\n')
      setAgentLog(output || 'Agent 已完成，但没有输出日志。')
      await refreshProjects(activeProject.id)
      if (activeProject.type === 'video' && response.ok) {
        setAgentLog(
          activeProject.videoAccount === 'odin'
            ? '已重新生成 Odin HyperFrames 脚本、分镜和 HTML 预览。请先检查预览，确认后再进入最终导出。'
            : '已重新生成脚本、分镜和 Remotion 数据。请先检查左侧脚本，确认后再点击「确认脚本并渲染」。',
        )
      } else if (activeProject.type === 'xhs' && activeProject.xhsMode === 'copy' && response.ok) {
        setAgentLog('标题候选和可发布正文已重新生成。')
      }
    } catch (error) {
      setAgentLog(`重新生产失败：${String(error)}`)
    } finally {
      setIsGenerating(false)
      stopProductionProgress()
    }
  }

  async function optimizeCopy() {
    if (!activeProject) return

    setIsOptimizingCopy(true)
    setAgentLog('正在调用 Odin 小红书配文 skill 优化正文...')

    try {
      const response = await fetch('/api/optimize-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: activeProject.id,
          provider,
          titles: editableTitles,
          postBody: editablePostBody,
          instruction: optimizeInstruction,
        }),
      })

      const data = await readResponse(response)
      if (!response.ok) {
        setAgentLog(data.stderr || data.error || '优化正文失败。')
        return
      }

      setEditableTitles(data.titles || [])
      setEditablePostBody(data.postBody || '')
      setOptimizeInstruction('')
      setIsOptimizeDialogOpen(false)
      const review = (data.review || {}) as CopyReview
      const summary = review.summary ? ` ${review.summary}` : ''
      setAgentLog(`文案已按结构、信息、表达三层规则完成审校。${summary}`.trim())
    } catch (error) {
      setAgentLog(`优化正文失败：${String(error)}`)
    } finally {
      setIsOptimizingCopy(false)
    }
  }

  async function regenerateVideoPreview() {
    if (!activeProject) {
      setAgentLog('没有选中的项目，无法渲染视频。')
      return
    }
    await renderVideoProject(activeProject.id, 'manual')
  }

  async function exportTts() {
    if (!activeProject) {
      setAgentLog('没有选中的项目，无法导出口播稿。')
      return
    }
    setAgentLog('正在导出 MiniMax 口播稿...')
    try {
      const response = await fetch('/api/export-tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: activeProject.id }),
      })
      const data = await readResponse(response)
      if (!response.ok || !data.ok) {
        setAgentLog(`导出口播稿失败：${data.error || response.statusText}`)
        return
      }
      setAgentLog(`口播稿已导出：${data.path}（${data.shots} 镜头 / ${data.totalSeconds}s）。可复制到 MiniMax 海螺 TTS 网页生成音频。`)
    } catch (error) {
      setAgentLog(`导出口播稿失败：${String(error)}`)
    }
  }

  function optimizeVideoModule(moduleName: 'script' | 'storyboard' | 'caption' | 'visual') {
    const labels = {script: '脚本', storyboard: '分镜', caption: '字幕', visual: '视觉'}
    setAgentLog(`已请求局部优化：${labels[moduleName]}。Agent 会重读当前模块并按 skill 规则改写（占位行为）。`)
    // TODO: 接通后端 /api/optimize-video-module
  }

  async function openActiveProjectFolder() {
    if (!activeProject) return

    try {
      const response = await fetch(`/api/projects/${activeProject.id}/open`, { method: 'POST' })
      const data = await readResponse(response)

      if (!response.ok) {
        setAgentLog(data.error || data.stderr || '打开项目文件夹失败。')
        return
      }

      setAgentLog(`已打开项目文件夹：${data.path}`)
    } catch (error) {
      setAgentLog(`打开项目文件夹失败：${String(error)}`)
    }
  }

  const accountPickerNode = (
    <label
      className="remotion-account-picker header-corner"
      style={{background: activeAccount.bg, borderColor: activeAccount.border}}
      aria-label="切换发布账号"
    >
      <svg width="14" height="14" viewBox="0 0 32 32" aria-hidden>
        <path
          d="M3 9 L9 16 L16 5 L23 16 L29 9 L26 25 H6 Z"
          fill={activeAccount.accent}
          stroke="#B25C0C"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
      <span>{activeAccount.label}</span>
      <ChevronRight size={12} className="picker-caret" />
      <select
        value={videoAccount}
        onChange={(event) => {
          const nextAccount = event.target.value as VideoAccountId
          setVideoAccount(nextAccount)
          if (!activeProjectId && sourceMode === 'topic-pool') {
            setSelectedTopic(null)
            setProjectName('')
            setBrief('')
            setSourcePath('')
            setSourcePreview(null)
          }
        }}
      >
        {Object.entries(videoAccounts).map(([id, account]) => (
          <option key={id} value={id}>
            {account.label}
          </option>
        ))}
      </select>
    </label>
  )

  const xhsModePickerNode =
    activePipeline.id === 'xhs' && activePipeline.modes?.length ? (
      <section className="subflow-panel" aria-label="XHS subflows">
        <div className="subflow-panel-heading">
          <div>
            <span className="eyebrow">当前可选</span>
            <strong>先选子产线，再决定点击后的动作</strong>
          </div>
          <small>工作流 skill 和能力 skill 已分开显示。</small>
        </div>
        <div className="subflow-grid">
          {activePipeline.modes.map((mode) => {
            const isSelected = mode.id === selectedXhsModeId
            const isDisabled = !isModeAvailable(mode)
            return (
              <button
                className={`subflow-card ${isSelected ? 'selected' : ''}`}
                disabled={isDisabled}
                key={mode.id}
                onClick={() => {
                  if (isDisabled) return
                  setSelectedXhsModeId(mode.id)
                }}
                type="button"
              >
                <div className="subflow-card-top">
                  <strong>{mode.label}</strong>
                  <span>{mode.kind === 'workflow' ? 'workflow' : 'capability'}</span>
                </div>
                <p>{mode.description}</p>
                <div className="subflow-card-bottom">
                  <small>{getPipelineSkillLabel(activePipeline, mode)}</small>
                  {!isModeAvailable(mode) ? <em>即将接入</em> : null}
                </div>
              </button>
            )
          })}
        </div>
      </section>
    ) : null

  return (
    <main className="studio-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <LayoutDashboard size={20} />
          </div>
          <div>
            <strong>Local Design Studio</strong>
            <span>本地设计生产工作台</span>
          </div>
        </div>

        <nav className="nav-list" aria-label="Workspace">
          <button className="nav-item active" type="button">
            <Monitor size={18} />
            工作台
          </button>
          <button className="nav-item" type="button">
            <FolderOpen size={18} />
            项目
          </button>
          <button className="nav-item" type="button">
            <Archive size={18} />
            模板库
          </button>
          <button className="nav-item" type="button">
            <Settings size={18} />
            AI 设置
          </button>
        </nav>

        <section className="provider-panel">
          <div className="panel-heading">
            <Sparkles size={17} />
            AI Provider
          </div>
          <p>支持 OpenAI API Key 或本机 CLI Agent。当前版本先保留配置入口。</p>
          <div className="provider-options">
            <button
              className={provider === 'codex' ? 'selected' : ''}
              disabled={!health.codex}
              onClick={() => setProvider('codex')}
              type="button"
            >
              Codex CLI
            </button>
            <button
              className={provider === 'claude' ? 'selected' : ''}
              disabled={!health.claude}
              onClick={() => setProvider('claude')}
              type="button"
            >
              Claude Code
            </button>
          </div>
          <small>{health.codex ? 'Codex 已可用' : '未检测到 Codex CLI'}</small>
        </section>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Design Production System</p>
            <h1>把内容变成可预览、可返修、可导出的设计交付包</h1>
          </div>
          <button className="secondary-button" onClick={resetDraft} type="button">
            <RotateCcw size={18} />
            清空草稿
          </button>
        </header>

        <section className="pipeline-grid" aria-label="Production pipelines">
          {pipelines.map((pipeline) => {
            const Icon = pipeline.icon
            const isActive = pipeline.id === activePipeline.id

            return (
              <article
                className={`pipeline-card ${isActive ? 'selected' : ''}`}
                key={pipeline.id}
                onClick={() => selectPipeline(pipeline.id)}
                style={{ '--accent': pipeline.accent } as CSSProperties}
              >
                <div className="pipeline-title">
                  <div className="pipeline-icon">
                    <Icon size={20} />
                  </div>
                  <h2>{pipeline.name}</h2>
                </div>
                <p>{pipeline.description}</p>
                <div className="format-row">
                  {pipeline.formats.map((format) => (
                    <span key={format}>{format}</span>
                  ))}
                </div>
              </article>
            )
          })}
        </section>

        <section className="editor-layout">
          <div className="editor-panel">
            {isCompletedProject ? (
              <>
                <div className="result-summary">
                  <div className="result-summary-top">
                    <span className="status-pill">{isVideoPipeline && !hasVideoOutputs ? '待确认' : '已完成'}</span>
                    <span>
                      {isVideoPipeline
                        ? hasVideoOutputs
                          ? '可预览、可优化'
                          : '脚本已生成，确认后渲染视频'
                        : '可预览、可编辑'}
                    </span>
                  </div>
                  <h3>{activeProject?.name}</h3>
                  <div className="result-meta">
                    <span>{getPipelineSkillLabel(displayPipeline, displayXhsMode)}</span>
                    {isVideoPipeline ? (
                      <span>{(activeProject?.outputs || []).length} 个产物</span>
                    ) : displayPipeline.id === 'xhs' && displayXhsMode?.resultKind === 'copy' ? (
                      <span>标题与正文交付</span>
                    ) : (
                      <span>{activePreviewAssets.length || 1} 张预览图</span>
                    )}
                    <span>{activeProject?.status}</span>
                  </div>
                  {displayPipeline.id === 'xhs' ? (
                    <div className="pipeline-structure">
                      {getPipelineStructure(displayPipeline, displayXhsMode).map((item) => (
                        <div className="pipeline-structure-row" key={item.label}>
                          <strong>{item.label}</strong>
                          <span>{item.value}</span>
                        </div>
                      ))}
                    </div>
                  ) : null}
                  {isVideoPipeline ? accountPickerNode : null}
                </div>

                {isVideoPipeline ? (
                  <div className="remotion-stage-grid top-bar">
                    {displaySteps.map((step, index) => {
                      const isCurrent =
                        showProductionProgress && productionProgressStep === index
                      const isDone =
                        !showProductionProgress ||
                        (productionProgressStep !== null && index < productionProgressStep)
                      return (
                        <article
                          className={isCurrent ? 'focus' : isDone ? 'done' : ''}
                          key={step}
                        >
                          <span>
                            <em>{index + 1}</em>
                            {step}
                          </span>
                        </article>
                      )
                    })}
                  </div>
                ) : null}

                {showProductionProgress ? (
                  <section className="production-progress">
                    <div className="production-progress-heading">
                      <strong>正在重新生产</strong>
                      <span>{displaySteps[productionProgressStep] || '处理中'}</span>
                    </div>
                    <ol className="step-list progress">
                      {displaySteps.map((step, index) => (
                        <li
                          className={
                            index < productionProgressStep
                              ? 'done'
                              : index === productionProgressStep
                                ? 'current'
                                : ''
                          }
                          key={step}
                        >
                          <span>{index + 1}</span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </section>
                ) : null}

                {isVideoPipeline ? (
                  <>
                    <div className="remotion-optimize-bar">
                      <span className="remotion-optimize-label">局部优化</span>
                      <button
                        className="ghost-button small"
                        onClick={() => optimizeVideoModule('script')}
                        type="button"
                      >
                        脚本
                      </button>
                      <button
                        className="ghost-button small"
                        onClick={() => optimizeVideoModule('storyboard')}
                        type="button"
                      >
                        分镜
                      </button>
                      <button
                        className="ghost-button small"
                        onClick={() => optimizeVideoModule('caption')}
                        type="button"
                      >
                        字幕
                      </button>
                      <button
                        className="ghost-button small"
                        onClick={() => optimizeVideoModule('visual')}
                        type="button"
                      >
                        视觉
                      </button>
                      <button
                        className="ghost-button small"
                        onClick={() => void exportTts()}
                        type="button"
                      >
                        导出口播稿
                      </button>
                      <button
                        className="ghost-button small"
                        disabled={isRenderingVideo || isOdinVideoProject}
                        onClick={() => void regenerateVideoPreview()}
                        type="button"
                      >
                        {isOdinVideoProject ? 'HyperFrames 导出待接入' : isRenderingVideo ? '渲染中...' : '确认脚本并渲染'}
                      </button>
                    </div>
                  </>
                ) : null}

                {isVideoPipeline ? (
                  <section className="video-script-review">
                    <div className="copy-field-heading">
                      <span>脚本预览</span>
                      {!hasVideoOutputs ? (
                        <em>{isOdinVideoProject ? 'Odin 当前停在 HyperFrames HTML 预览' : '确认脚本后再进入视频渲染'}</em>
                      ) : null}
                    </div>
                    <pre>{activeVideoScript || (isOdinVideoProject ? '还没有读取到 work/script.md。' : '还没有读取到 source/script.md。')}</pre>
                    {activeVideoOutline ? (
                      <details>
                        <summary>查看分镜规划</summary>
                        <pre>{activeVideoOutline}</pre>
                      </details>
                    ) : null}
                  </section>
                ) : null}

                <section className="result-copy">
                  <div className="copy-field-heading">
                    <span>
                      {isVideoPipeline
                        ? '发布文案'
                        : displayXhsMode?.resultKind === 'copy'
                          ? '标题与发布文案'
                          : '小红书文案'}
                    </span>
                    <button
                      className="ghost-button small"
                      disabled={isOptimizingCopy}
                      onClick={() => setIsOptimizeDialogOpen(true)}
                      type="button"
                    >
                      {isOptimizingCopy ? '审校中...' : displayXhsMode?.resultKind === 'copy' ? '继续优化文案' : '优化文案'}
                    </button>
                  </div>
                  <div className="editable-copy-list">
                    {(editableTitles.length ? editableTitles : completedTitles.slice(0, 4)).slice(0, 4).map((title, index) => (
                      <label key={`${index}-${title}`}>
                        <span>标题 {index + 1}</span>
                        <input
                          value={title}
                          onChange={(event) => {
                            const nextTitles = [...editableTitles]
                            nextTitles[index] = event.target.value
                            setEditableTitles(nextTitles)
                          }}
                        />
                      </label>
                    ))}
                  </div>
                  <label className="editable-post-body">
                    <div className="copy-field-heading">
                      <span>
                        {isVideoPipeline
                          ? '发布配文'
                          : displayXhsMode?.resultKind === 'copy'
                            ? '可发布正文'
                            : '小红书正文'}
                      </span>
                    </div>
                    <textarea
                      value={editablePostBody}
                      onChange={(event) => setEditablePostBody(event.target.value)}
                      placeholder={
                        isVideoPipeline
                          ? '这里会显示视频发布配文（小红书 / 视频号 / 抖音通用），可直接编辑。'
                          : displayXhsMode?.resultKind === 'copy'
                            ? '这里会显示可直接发布的小红书正文与配文，可继续编辑。'
                            : '这里会显示可发布的小红书正文，可直接编辑。'
                      }
                    />
                  </label>
                </section>

                <div className="action-row compact-actions">
                  <button
                    className="primary-button"
                    onClick={resetDraft}
                    type="button"
                  >
                    生产下一条
                  </button>
                  <button
                    className="secondary-button"
                    disabled={isGenerating}
                    onClick={() => void regenerateActiveProject()}
                    type="button"
                  >
                    重新生产
                  </button>
                  <button
                    className="ghost-button"
                    onClick={() => setShowCompletedSource((value) => !value)}
                    type="button"
                  >
                    {showCompletedSource ? '收起生产输入' : '查看生产输入'}
                  </button>
                </div>

                {showCompletedSource ? (
                  <div className="source-snapshot">
                    <strong>生产输入</strong>
                    <span>{activeProject?.sourcePath || '手动 Brief'}</span>
                    <pre>{activeProject?.brief || '无'}</pre>
                  </div>
                ) : null}
              </>
            ) : (
              <>
                <div className="section-heading">
                  <div>
                    <p className="eyebrow">当前生产线</p>
                    <h2>{displayPipeline.name}</h2>
                  </div>
                  {isVideoPipeline ? accountPickerNode : null}
                </div>

                {isXhsPipeline ? xhsModePickerNode : null}

                {isVideoPipeline ? (
                  <div className="remotion-stage-grid top-bar">
                    {activeSteps.map((step, index) => {
                      const isCurrentStep =
                        videoPipelineState === 'producing' && productionProgressStep === index
                      const isDoneStep =
                        videoPipelineState === 'producing' &&
                        productionProgressStep !== null &&
                        index < productionProgressStep
                      return (
                        <article
                          className={isCurrentStep ? 'focus' : isDoneStep ? 'done' : ''}
                          key={step}
                        >
                          <span>
                            <em>{index + 1}</em>
                            {step}
                          </span>
                        </article>
                      )
                    })}
                  </div>
                ) : (
                  <ol className="step-list">
                    {activeSteps.map((step, index) => (
                      <li className={index === 0 ? 'current' : ''} key={step}>
                        <span>{index + 1}</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                )}

                {!isVideoPipeline ? (
                  <div className="pipeline-note">
                    <strong>{getPipelineSkillLabel(activePipeline, activeXhsMode)}</strong>
                    <span>{getPipelineStarterText(activePipeline, activeXhsMode)}</span>
                    {isXhsPipeline ? (
                      <div className="pipeline-structure">
                        {getPipelineStructure(activePipeline, activeXhsMode).map((item) => (
                          <div className="pipeline-structure-row" key={item.label}>
                            <strong>{item.label}</strong>
                            <span>{item.value}</span>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : null}

                {isVideoPipeline && videoPipelineState === 'producing' ? (
                  <div className="remotion-source-summary">
                    <div>
                      <strong>{projectName || activeProject?.name || '未命名选题'}</strong>
                      <span>
                        {sourceMode === 'directory'
                          ? sourcePath || '未指定路径'
                          : brief.slice(0, 90) + (brief.length > 90 ? '…' : '')}
                      </span>
                    </div>
                  </div>
                ) : null}

                {isVideoPipeline && videoPipelineState === 'producing' ? null : (
                  <>
                    <div className="field">
                      <span>材料来源</span>
                      <div className="segmented-control">
                        <button
                          className={sourceMode === 'brief' ? 'selected' : ''}
                          onClick={() => {
                            setSourceMode('brief')
                            setSourcePreview(null)
                            setSelectedTopic(null)
                          }}
                          type="button"
                        >
                          {isVideoPipeline ? '填写选题' : '手动 Brief'}
                        </button>
                        {isVideoPipeline ? (
                          <button
                            className={sourceMode === 'topic-pool' ? 'selected' : ''}
                            onClick={() => setSourceMode('topic-pool')}
                            type="button"
                          >
                            从选题池选择
                          </button>
                        ) : null}
                        <button
                          className={sourceMode === 'directory' ? 'selected' : ''}
                          onClick={() => {
                            setSourceMode('directory')
                            setSelectedTopic(null)
                          }}
                          type="button"
                        >
                          {isVideoPipeline ? '选择本地目录' : '本地目录'}
                        </button>
                      </div>
                    </div>

                    {sourceMode === 'topic-pool' ? (
                      <section className="topic-pool-panel">
                        <div className="topic-pool-header">
                          <div>
                            <strong>{topicPool?.dashboard?.title || '选题池'}</strong>
                            <span>{topicPool?.rootPath || '未读取到选题池目录'}</span>
                          </div>
                          <button
                            className="ghost-button small"
                            disabled={isLoadingTopicPool}
                            onClick={() => void loadTopicPool(videoAccount)}
                            type="button"
                          >
                            {isLoadingTopicPool ? '读取中...' : '刷新选题池'}
                          </button>
                        </div>

                        {topicPool?.dashboard ? (
                          <div className="topic-pool-dashboard">
                            <div>
                              <span>当前聚焦</span>
                              <strong>
                                {topicPool.topics.find((topic) => topic.isCurrent)?.title || '仪表盘里暂未标记先做选题'}
                              </strong>
                            </div>
                            <small>{topicPool.dashboard.updated ? `最近更新：${topicPool.dashboard.updated}` : '已连接仪表盘'}</small>
                          </div>
                        ) : null}

                        <div className="topic-pool-list">
                          {topicPool?.topics?.length ? (
                            topicPool.topics.map((topic) => {
                              const isSelected = selectedTopic?.path === topic.path
                              return (
                                <article className={`topic-pool-card ${isSelected ? 'selected' : ''}`} key={topic.path}>
                                  <div className="topic-pool-card-top">
                                    <div>
                                      <strong>{topic.title}</strong>
                                      <span>
                                        {topic.code}
                                        {topic.series ? ` · ${topic.series}` : ''}
                                      </span>
                                    </div>
                                    <div className="topic-pool-meta">
                                      {topic.priority ? <em>{topic.priority}</em> : null}
                                      {topic.status ? <em>{topic.status}</em> : null}
                                      {topic.isCurrent ? <em>先做</em> : null}
                                    </div>
                                  </div>
                                  <p>{topic.excerpt || '该选题暂无摘要。'}</p>
                                  <div className="topic-pool-card-bottom">
                                    <small>
                                      {topic.decision || topic.carrier || topic.relativePath}
                                    </small>
                                    <button
                                      className={isSelected ? 'secondary-button' : 'primary-button'}
                                      onClick={() => applyTopicToDraft(topic)}
                                      type="button"
                                    >
                                      {isSelected ? '已载入' : '载入选题'}
                                    </button>
                                  </div>
                                </article>
                              )
                            })
                          ) : (
                            <div className="topic-pool-empty">
                              {isLoadingTopicPool ? '正在读取选题池...' : '当前账号下还没有读到可用选题。'}
                            </div>
                          )}
                        </div>
                      </section>
                    ) : null}

                    {sourceMode === 'directory' ? (
                      <label className="field">
                        <span>Obsidian 或本地资料目录</span>
                        <div className="source-path-row">
                          <input
                            placeholder="/Users/你的用户名/.../Obsidian/选题资料目录"
                            value={sourcePath}
                            onChange={(event) => updateSourcePath(event.target.value)}
                          />
                          <button
                            className={`secondary-button identify-button ${sourcePreview ? 'identified' : ''}`}
                            disabled={!sourcePath.trim() || isReadingSource}
                            onClick={() => void previewSource(sourcePath)}
                            type="button"
                          >
                            {isReadingSource ? '识别中...' : sourcePreview ? '已识别' : '识别材料'}
                          </button>
                        </div>
                        <small className={sourcePreview ? 'is-success' : ''}>
                          {isReadingSource
                            ? '正在读取目录...'
                            : sourcePreview
                              ? `✓ 已读取 ${sourcePreview.fileCount} 个文件 · ${sourcePreview.sourcePath}`
                              : '请先粘贴绝对路径，再点击「识别材料」；~ 会自动展开'}
                        </small>
                      </label>
                    ) : null}

                    <label className="field">
                      <span>项目名称</span>
                      <input
                        placeholder={
                          sourceMode === 'topic-pool'
                            ? '从选题池载入后会自动填入，也可以手动修改'
                            : sourceMode === 'directory'
                            ? '识别后会自动填入，也可以手动修改'
                            : '可手动填写，留空则使用未命名项目'
                        }
                        value={projectName}
                        onChange={(event) => setProjectName(event.target.value)}
                      />
                    </label>

                    <label className="field">
                      <span>
                        {sourceMode === 'topic-pool'
                          ? '选题摘要'
                          : sourceMode === 'directory'
                          ? '补充说明'
                          : isVideoPipeline
                            ? '选题描述'
                            : isXhsPipeline && activeXhsMode?.id === 'copy'
                              ? '需求 / 草稿说明'
                              : '项目 Brief'}
                      </span>
                      <textarea
                        value={brief}
                        onChange={(event) => setBrief(event.target.value)}
                        placeholder={
                          sourceMode === 'topic-pool'
                            ? '选题池会自动带入摘要，你可以继续补充生产要求'
                            : sourceMode === 'directory'
                            ? '目录读取后会自动填入，可在这里补充或修改'
                            : getPipelineStarterText(activePipeline, activeXhsMode)
                        }
                      />
                    </label>

                    <div className="action-row">
                      {!isVideoPipeline ? (
                        <button
                          className="secondary-button"
                          disabled={isPreflightingCopy || isGenerating || (!projectName.trim() && !brief.trim() && !sourcePreview?.suggestedBrief)}
                          onClick={() => void preflightCopyDraft()}
                          type="button"
                        >
                          {isPreflightingCopy ? '整理中...' : activeXhsMode?.preflightLabel || '预优化文案'}
                        </button>
                      ) : null}
                      <button
                        className="primary-button"
                        disabled={!canStartProduction || isPreflightingCopy}
                        onClick={generateWithAgent}
                        type="button"
                      >
                        <Sparkles size={17} />
                        {isGenerating
                          ? isVideoPipeline
                            ? '生成脚本中...'
                            : isXhsPipeline && activeXhsMode?.id === 'copy'
                              ? '生成文案中...'
                              : '生产中...'
                          : isVideoPipeline
                            ? '生成脚本与分镜'
                            : activeXhsMode?.actionLabel || '开始生产'}
                      </button>
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          <div className="preview-panel">
            <div className="preview-toolbar">
              <span>{previewToolbarLabel}</span>
              <button
                className="ghost-button"
                disabled={!activeProject}
                onClick={() => void openActiveProjectFolder()}
                title={activeProject ? '在 Finder 中打开当前项目目录' : '当前还没有项目目录'}
                type="button"
              >
                {activeProject ? '打开文件夹' : '无项目'}
                <ChevronRight size={16} />
              </button>
            </div>
            {activePreviewAssets.length ? (
              <>
                <div className="preview-pages" aria-label="Preview pages">
                  {activePreviewAssets.map((asset, index) => (
                    <button
                      className={index === safePreviewIndex ? 'selected' : ''}
                      key={asset}
                      onClick={() => setSelectedPreviewIndex(index)}
                      type="button"
                    >
                      P{index + 1}
                    </button>
                  ))}
                </div>
                <div className="preview-image-stage">
                  <img alt={`${activeProject?.name || 'project'} P${safePreviewIndex + 1}`} src={activePreviewAsset} />
                </div>
              </>
            ) : isVideoPipeline && isProjectMatchingPipeline && hasVideoOutputs ? (
              <div className="preview-video-stage">
                {videoOutputs.video ? (
                  <video
                    className="preview-video-player"
                    src={videoOutputs.video}
                    poster={videoOutputs.frames[0] || undefined}
                    controls
                    playsInline
                  />
                ) : videoOutputs.cover ? (
                  <img className="preview-video-still" src={videoOutputs.cover} alt="cover" />
                ) : null}
                {(videoOutputs.cover || videoOutputs.frames.length) ? (
                  <div className="preview-video-strip">
                    {videoOutputs.cover ? (
                      <a href={videoOutputs.cover} target="_blank" rel="noreferrer">
                        <img src={videoOutputs.cover} alt="cover" />
                        <small>cover.png</small>
                      </a>
                    ) : null}
                    {videoOutputs.frames.map((url, index) => (
                      <a key={url} href={url} target="_blank" rel="noreferrer">
                        <img src={url} alt={`frame ${index + 1}`} />
                        <small>{url.split('/').pop()}</small>
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : activeProject?.hasPreview && isProjectMatchingPipeline ? (
              <div
                className="preview-canvas"
                ref={previewCanvasRef}
                style={{ height: `${1440 * previewScale}px` }}
              >
                <iframe
                  className="preview-frame"
                  key={activeProject.id}
                  src={activePreviewPath}
                  style={{ transform: `scale(${previewScale})` }}
                  title={`${activeProject.name} preview`}
                />
              </div>
            ) : displayPipeline.id === 'xhs' && displayXhsMode?.resultKind === 'copy' && isProjectMatchingPipeline && hasCopyResult ? (
              <div className="preview-copy-stage">
                <div className="preview-copy-card">
                  <FileText size={24} />
                  <strong>当前模式不生成卡片预览</strong>
                  <span>这条能力线会直接交付 `配文文稿.md` 和 `source/copy.md`，适合快速改标题、正文和配文。</span>
                </div>
                <div className="preview-copy-meta">
                  <span>{activeProject?.outputs.length || 0} 个记录产物</span>
                  <span>{activeProject?.status || 'copy_ready'}</span>
                </div>
              </div>
            ) : (
              <div className="preview-empty">
                <div>
                  <FileText size={24} />
                  <strong>{displayPipeline.id === 'xhs' && displayXhsMode?.resultKind === 'copy' ? '还没有文案交付' : '还没有可预览文件'}</strong>
                  <span>
                    {isVideoPipeline
                      ? isOdinVideoSelection
                        ? '点击"开始生产"后，Agent 会产出 HyperFrames HTML 预览、work/script.md 和 work/storyboard.md；默认不渲染 MP4。'
                        : '点击"开始生产"后，Agent 会产出 preview/index.html 和 source/render-data.json；确认脚本后再渲染 cover.png、frame.png 与 video.mp4。'
                      : displayPipeline.id === 'xhs' && displayXhsMode?.resultKind === 'copy'
                        ? '点击对应按钮后，Agent 会直接生成 `配文文稿.md` 和 `source/copy.md`，不再走 HTML / PNG 卡片渲染。'
                        : '点击"开始生产"后，Agent 会在当前项目里生成 preview/index.html。'}
                  </span>
                </div>
              </div>
            )}
            <pre className="agent-log">{agentLog}</pre>
          </div>
        </section>

        <section className="project-strip">
          <div className="section-heading compact">
            <div>
              <p className="eyebrow">Recent Projects</p>
              <h2>最近项目</h2>
            </div>
            <button className="ghost-button" type="button">全部项目</button>
          </div>
          <div className="project-table">
            {projects.map((project) => {
              const pipeline = pipelines.find((item) => item.id === project.type)!
              const Icon = pipeline.icon
              const projectMode =
                project.type === 'xhs'
                  ? pipeline.modes?.find((mode) => mode.id === (project.xhsMode || 'carousel'))
                  : null
              const outputLabel = project.outputs.map(formatOutput).join(' / ')

              return (
                <article
                  className={`project-row ${project.id === activeProjectId ? 'selected' : ''}`}
                  key={project.id}
                  onClick={() => selectProject(project)}
                >
                  <Icon size={18} />
                  <div>
                    <strong>{project.name}</strong>
                    <span>{pipeline.name}{projectMode ? ` · ${projectMode.label}` : ''} · {project.updatedAt}</span>
                  </div>
                  <span>{project.status}</span>
                  <span className="project-output" title={outputLabel}>{outputLabel}</span>
                  <FileText size={17} />
                </article>
              )
            })}
          </div>
          </section>
        </section>

        {isOptimizeDialogOpen ? (
          <div className="modal-backdrop" role="presentation">
            <form
              className="modal-panel"
              onSubmit={(event) => {
                event.preventDefault()
                void optimizeCopy()
              }}
            >
              <div className="modal-heading">
                <div>
                  <p className="eyebrow">Odin XHS Copy</p>
                  <h3>{displayXhsMode?.resultKind === 'copy' ? '优化标题与正文' : '优化文案'}</h3>
                </div>
              </div>
              <label className="field">
                <span>补充要求（可选）</span>
                <textarea
                  value={optimizeInstruction}
                  onChange={(event) => setOptimizeInstruction(event.target.value)}
                  placeholder="不填也可以。系统会默认检查对象、场景、真实亏点、空话和 AI 套话；这里只写你额外想强调的方向。"
                />
              </label>
              <div className="action-row compact-actions">
                <button className="primary-button" disabled={isOptimizingCopy} type="submit">
                  {isOptimizingCopy ? '优化中...' : '直接优化'}
                </button>
                <button
                  className="secondary-button"
                  disabled={isOptimizingCopy}
                  onClick={() => setIsOptimizeDialogOpen(false)}
                  type="button"
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        ) : null}
      </main>
  )
}

export default App

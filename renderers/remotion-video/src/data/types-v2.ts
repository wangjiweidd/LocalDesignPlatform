export type ColorScheme = 'dark' | 'light';

export type AnimationStyleId =
  | 'smooth-reveal'
  | 'snappy-pop'
  | 'bouncy-enter'
  | 'dramatic-slam'
  | 'heavy-settle';

export type CoverData = {
  title: string;
  subtitle: string;
  titleHighlight: string;
};

// ── Knowledge Sharing ─────────────────────────────────────────

export type KnowledgeContentType =
  | 'data-insight' | 'step-breakdown' | 'concept-explain'
  | 'quote-insight' | 'comparison' | 'checklist' | 'timeline';

export type KnowledgeSceneId =
  | 'data-reveal' | 'step-list' | 'concept-card'
  | 'quote-hero' | 'comparison-split' | 'checklist-reveal' | 'timeline-flow'
  | 'material-board' | 'annotated-proof' | 'case-breakdown';

export type KnowledgeMotionPresetId =
  | 'stat-slam' | 'counter-tick' | 'list-stagger'
  | 'highlight-sweep' | 'split-slide' | 'check-draw' | 'dot-appear';

export type TimelineEvent = {
  label?: string;
  text: string;
};

export type CaptionTokenTiming = {
  text: string;
  startMs: number;
  endMs: number;
  timestampMs: number | null;
  confidence: number | null;
};

export type CaptionTiming = {
  startMs: number;
  endMs: number;
  tokens?: CaptionTokenTiming[];
};

export type CaptionSegment = {
  text: string;
  startMs: number;
  endMs: number;
  keyword?: string;
};

export type KnowledgeShotData = {
  text: string;
  keyword: string;
  caption: string;
  voiceoverText?: string;
  durationFrames?: number;
  captionKeyword: string;
  captionTiming?: CaptionTiming;
  captionSegments?: CaptionSegment[];
  scene: KnowledgeSceneId;
  motionPreset: KnowledgeMotionPresetId;
  animationStyle: AnimationStyleId;
  dataValue?: string;
  stepNumber?: number;
  listIndex?: number;
  timelineYear?: string;
  comparisonSide?: 'left' | 'right' | 'neutral';
  // ComparisonSplit
  comparisonLeft?: string;
  comparisonRight?: string;
  leftText?: string;
  rightText?: string;
  // ChecklistReveal
  checklistItems?: string[];
  sectionLabel?: string;
  // TimelineFlow
  timelineEvents?: TimelineEvent[];
  lottieId?: string;
  characterId?: string;
  // Odin evidence-board scenes
  evidenceTitle?: string;
  evidenceSubtitle?: string;
  evidenceLines?: string[];
  evidenceHighlights?: string[];
  tagItems?: string[];
  proofLabels?: string[];
  caseBefore?: string;
  caseDecision?: string;
  caseResult?: string;
  callout?: string;
};

export type KnowledgeScriptData = {
  track: 'knowledge-sharing';
  contentType: KnowledgeContentType;
  title: string;
  subtitle: string;
  fps: 30;
  width: 1080 | 1440;
  height: 1920;
  colorScheme: ColorScheme;
  accentColor: string;
  shotDurationFrames: number;
  cover: CoverData;
  shots: KnowledgeShotData[];
};

// ── AI Education ──────────────────────────────────────────────

export type EducationContentType =
  | 'ai-concept' | 'family-challenge' | 'story-scene'
  | 'usage-demo' | 'safety-rule' | 'achievement' | 'qa-reveal';

export type EducationSceneId =
  | 'ai-intro' | 'challenge-game' | 'story-moment'
  | 'demo-walk' | 'boundary-card' | 'celebrate-win' | 'qa-flip';

export type EducationMotionPresetId =
  | 'character-bounce' | 'bubble-pop' | 'star-burst'
  | 'question-wobble' | 'reveal-spring' | 'warning-pulse' | 'confetti-burst';

export type AgeTarget = '4-6' | '7-10' | '11-14';

export type EducationShotData = {
  text: string;
  keyword: string;
  caption: string;
  voiceoverText?: string;
  durationFrames?: number;
  captionKeyword: string;
  captionTiming?: CaptionTiming;
  captionSegments?: CaptionSegment[];
  scene: EducationSceneId;
  motionPreset: EducationMotionPresetId;
  animationStyle: AnimationStyleId;
  characterName?: string;
  stepNumber?: number;
  lottieId?: string;
  lottieUrl?: string;
  isQuestionShot?: boolean;
  isAnswerShot?: boolean;
  enText?: string;
};

export type EducationCoverIconKey = 'three-bars' | 'check-seal' | 'lightbulb' | 'question-mark' | 'shield';

export type EducationCoverData = CoverData & {
  characterName?: string;
  heroIconKey?: EducationCoverIconKey;
};

export type EducationScriptData = {
  track: 'ai-education';
  contentType: EducationContentType;
  title: string;
  subtitle: string;
  fps: 30;
  width: 1080;
  height: 1920;
  colorScheme: ColorScheme;
  accentColor: string;
  ageTarget: AgeTarget;
  shotDurationFrames: number;
  cover: EducationCoverData;
  shots: EducationShotData[];
};

export type ScriptDataV2 = KnowledgeScriptData | EducationScriptData;
export type ScriptDataWithAudio = ScriptDataV2 & {
  audioPath?: string;
};

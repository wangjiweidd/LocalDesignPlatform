export type CaptionMotion = 'slide-fade' | 'emphasis-pop' | 'soft-shake';

export type SceneId =
  | 'kid-meets-ai'
  | 'family-rules-board'
  | 'ask-the-purpose'
  | 'verify-answer'
  | 'kid-explains'
  | 'time-limit'
  | 'kid-vs-trap';

export type LegacyBeatAction = 'pop' | 'draw' | 'pulse' | 'shake' | 'slide' | 'flash';
export type MotionAnchor = 'shot-start' | 'caption-start' | 'keyword' | 'caption-end' | 'shot-end';
export type MotionIntensity = 'low' | 'medium' | 'high';

export type MotionPresetId =
  | 'robot-breathe'
  | 'soft-pop'
  | 'gentle-slide'
  | 'attention-flash'
  | 'hand-drawn-check'
  | 'scan-sweep'
  | 'boundary-pulse'
  | 'question-bob'
  | 'lightbulb-glow'
  | 'timer-tick'
  | 'warning-nudge'
  | 'keyword-underline';

export type VisualBeat = {
  frame: number;
  target: string;
  action: LegacyBeatAction;
  preset: MotionPresetId;
  anchor: MotionAnchor;
  offsetFrames: number;
  durationFrames: number;
  intensity: MotionIntensity;
  label?: string;
};

export type ShotData = {
  text: string;
  keyword: string;
  scene: SceneId;
  captionMotion: CaptionMotion;
  highlightSync: string;
  visualBeats: VisualBeat[];
};

export type ScriptData = {
  title: string;
  subtitle: string;
  fps: 30;
  width: 1080;
  height: 1920;
  shotDurationFrames: number;
  cover: {
    title: string;
    subtitle: string;
    titleHighlight: string;
    note: string;
    noteHighlight: string;
  };
  shots: ShotData[];
};

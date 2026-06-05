import {spawnSync} from 'node:child_process';
import {copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import type {CaptionTokenTiming, ScriptDataWithAudio} from '../src/data/types-v2';

type RenderProps = {script: ScriptDataWithAudio};

const scriptDir = dirname(fileURLToPath(import.meta.url));
const rendererDir = resolve(scriptDir, '..');
const repoRoot = resolve(rendererDir, '..', '..');

const projectArg = process.argv[2] ?? '../../projects/2605200900-server-pipeline-test';
const projectDir = resolve(rendererDir, projectArg);
const renderDataPath = resolve(projectDir, 'source/render-data.json');
const renderPropsPath = resolve(projectDir, 'source/render-props.json');
const audioDir = resolve(projectDir, 'source/audio');
const exportDir = resolve(projectDir, 'exports');
const rendererOutputDir = resolve(rendererDir, 'public/output');
const edgeTtsBin = process.env.EDGE_TTS_BIN ?? resolve(repoRoot, '.venv-edge-tts/bin/edge-tts');
const voice = process.env.EDGE_TTS_VOICE ?? 'zh-CN-YunxiNeural';
const rate = process.env.EDGE_TTS_RATE ?? '+2%';
const pitch = process.env.EDGE_TTS_PITCH ?? '+0Hz';
const voiceStartMs = Number(process.env.VOICE_START_MS ?? 120);
const captionHoldMs = Number(process.env.CAPTION_HOLD_MS ?? 220);
const minShotFrames = Number(process.env.MIN_SHOT_FRAMES ?? 90);

if (!existsSync(renderDataPath)) {
  throw new Error(`Missing render data: ${renderDataPath}`);
}
if (!existsSync(edgeTtsBin)) {
  throw new Error(`Missing edge-tts binary: ${edgeTtsBin}`);
}

function run(cmd: string, args: string[], cwd = rendererDir): string {
  const result = spawnSync(cmd, args, {cwd, encoding: 'utf8'});
  if (result.status !== 0) {
    throw new Error(`${cmd} failed\n${result.stdout}\n${result.stderr}`);
  }
  return result.stdout;
}

function durationMs(filePath: string): number {
  const output = run('ffprobe', [
    '-v', 'error',
    '-show_entries', 'format=duration',
    '-of', 'json',
    filePath,
  ]);
  const parsed = JSON.parse(output) as {format?: {duration?: string}};
  return Math.round(Number(parsed.format?.duration ?? 0) * 1000);
}

function shellEscapeForConcat(filePath: string): string {
  return filePath.replace(/'/g, "'\\''");
}

function normalizeSpeechText(text: string): string {
  return text
    .replace(/<#\d+(?:\.\d+)?#>/g, '')
    .replace(/\+/g, '，加')
    .replace(/1~2/g, '一二')
    .replace(/3~4/g, '三四')
    .replace(/5~6/g, '五六')
    .replace(/4个/g, '四个')
    .replace(/2能力/g, '两个能力')
    .replace(/2硬/g, '两个硬')
    .replace(/\s+/g, '')
    .trim();
}

function distributeCaptionTokens(caption: string, startMs: number, typeEndMs: number): CaptionTokenTiming[] {
  const chars = Array.from(caption);
  const duration = Math.max(1, typeEndMs - startMs);
  return chars.map((char, index) => ({
    text: char,
    startMs: Math.round(startMs + (duration * index) / chars.length),
    endMs: Math.round(startMs + (duration * (index + 1)) / chars.length),
    timestampMs: null,
    confidence: null,
  }));
}

mkdirSync(audioDir, {recursive: true});
mkdirSync(exportDir, {recursive: true});
mkdirSync(rendererOutputDir, {recursive: true});

const script = JSON.parse(readFileSync(renderDataPath, 'utf8')) as ScriptDataWithAudio;
const fps = script.fps;

const rawShots = script.shots.map((shot, index) => {
  const shotNo = String(index + 1).padStart(2, '0');
  const rawAudioPath = resolve(audioDir, `voiceover-shot-${shotNo}.mp3`);
  const subtitlePath = resolve(audioDir, `voiceover-shot-${shotNo}.vtt`);
  const speechText = normalizeSpeechText(shot.voiceoverText ?? shot.caption);

  run(edgeTtsBin, [
    '--voice', voice,
    '--rate', rate,
    '--pitch', pitch,
    '--text', speechText,
    '--write-media', rawAudioPath,
    '--write-subtitles', subtitlePath,
  ], repoRoot);

  const audioMs = durationMs(rawAudioPath);
  const requiredFrames = Math.max(
    minShotFrames,
    Math.ceil(((voiceStartMs + audioMs + captionHoldMs) / 1000) * fps),
  );
  return {shot, index, rawAudioPath, subtitlePath, speechText, audioMs, requiredFrames};
});

const maxRequiredFrames = Math.max(...rawShots.map((shot) => shot.requiredFrames));
if (maxRequiredFrames > 150) {
  const overlong = rawShots
    .filter((shot) => shot.requiredFrames > 150)
    .map((shot) => `shot ${shot.index + 1}: ${shot.audioMs}ms "${shot.speechText}"`)
    .join('\n');
  throw new Error(`Voiceover is too long for the 5s shot limit. Shorten the copy or raise the schema limit.\n${overlong}`);
}

const shotDurationFrames = maxRequiredFrames;

const paddedAudioPaths = rawShots.map((item) => {
  const shotNo = String(item.index + 1).padStart(2, '0');
  const paddedPath = resolve(audioDir, `voiceover-shot-${shotNo}-padded.wav`);
  const itemShotDurationMs = Math.round((item.requiredFrames / fps) * 1000);
  run('ffmpeg', [
    '-y',
    '-i', item.rawAudioPath,
    '-af', `adelay=${voiceStartMs}|${voiceStartMs},apad,atrim=0:${(itemShotDurationMs / 1000).toFixed(3)}`,
    '-ar', '44100',
    '-ac', '2',
    paddedPath,
  ]);
  return paddedPath;
});

const concatListPath = resolve(audioDir, 'voiceover-concat.txt');
writeFileSync(
  concatListPath,
  paddedAudioPaths.map((filePath) => `file '${shellEscapeForConcat(filePath)}'`).join('\n') + '\n',
  'utf8',
);

const voiceoverPath = resolve(audioDir, 'voiceover.mp3');
run('ffmpeg', [
  '-y',
  '-f', 'concat',
  '-safe', '0',
  '-i', concatListPath,
  '-c:a', 'libmp3lame',
  '-q:a', '2',
  voiceoverPath,
]);

const rendererVoiceoverPath = resolve(rendererOutputDir, 'voiceover.mp3');
copyFileSync(voiceoverPath, rendererVoiceoverPath);

const timedShots = rawShots.map((item) => {
  const itemShotDurationMs = Math.round((item.requiredFrames / fps) * 1000);
  const speechEndMs = voiceStartMs + item.audioMs;
  const displayEndMs = Math.min(itemShotDurationMs - 100, speechEndMs + captionHoldMs);
  const typeEndMs = Math.max(
    voiceStartMs + 450,
    Math.min(speechEndMs - 80, displayEndMs - 260),
  );
  return {
    ...item.shot,
    durationFrames: item.requiredFrames,
    captionTiming: {
      startMs: voiceStartMs,
      endMs: Math.round(displayEndMs),
      tokens: distributeCaptionTokens(item.shot.caption, voiceStartMs, typeEndMs),
    },
  };
});

const timedScript: ScriptDataWithAudio = {
  ...script,
  shotDurationFrames,
  audioPath: 'output/voiceover.mp3',
  shots: timedShots,
};

const timingPlan = {
  source: renderDataPath,
  voice,
  rate,
  pitch,
  fps,
  shotDurationFrames,
  totalDurationMs: rawShots.reduce((total, item) => total + Math.round((item.requiredFrames / fps) * 1000), 0),
  audioPath: voiceoverPath,
  shots: rawShots.map((item) => ({
    index: item.index + 1,
    caption: item.shot.caption,
    speechText: item.speechText,
    audioMs: item.audioMs,
    durationFrames: item.requiredFrames,
    durationMs: Math.round((item.requiredFrames / fps) * 1000),
    captionTiming: timedShots[item.index].captionTiming,
  })),
};

writeFileSync(renderDataPath, JSON.stringify(timedScript, null, 2) + '\n', 'utf8');
writeFileSync(renderPropsPath, JSON.stringify({script: timedScript} satisfies RenderProps, null, 2) + '\n', 'utf8');
writeFileSync(resolve(exportDir, 'voice-timing-plan.json'), JSON.stringify(timingPlan, null, 2) + '\n', 'utf8');
writeFileSync(resolve(exportDir, 'voiceover.txt'), rawShots.map((item) => item.shot.caption).join('\n') + '\n', 'utf8');

console.log(JSON.stringify({
  projectDir,
  voice,
  rate,
  shotDurationFrames,
  totalDurationMs: timingPlan.totalDurationMs,
  voiceoverPath,
  rendererVoiceoverPath,
}, null, 2));

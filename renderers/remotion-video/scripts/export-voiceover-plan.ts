import {mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import type {ScriptDataV2} from '../src/data/types-v2';

type RenderProps = {script: ScriptDataV2};

const defaultPropsPath = '../../projects/2605200900-server-pipeline-test/source/render-props.json';
const propsPath = resolve(process.argv[2] ?? defaultPropsPath);
const outDir = resolve(process.argv[3] ?? `${dirname(propsPath)}/../exports`);

const renderProps = JSON.parse(readFileSync(propsPath, 'utf8')) as RenderProps;
const {script} = renderProps;
const shotDurationMs = Math.round((script.shotDurationFrames / script.fps) * 1000);
const voiceStartOffsetMs = 300;
const voiceEndPaddingMs = 300;

const compactPause = '<#0.04#>';
const segmentPause = '<#0.12#>';

function toMinimaxText(caption: string): string {
  return caption
    .replace(/，/g, `，${compactPause}`)
    .replace(/、/g, `、${compactPause}`)
    .replace(/\+/g, `+${compactPause}`);
}

const minimaxSegments: string[] = [];
const operationList: {
  segment_id: string;
  emotion: 'neutral';
  speed: 'normal';
  volume: 'normal';
  text: string;
  output_filename: string;
}[] = [];

const timingPlan = {
  fps: script.fps,
  shotDurationFrames: script.shotDurationFrames,
  shotDurationMs,
  source: propsPath,
  note: 'Target timing for MiniMax voiceover. Replace with real ASR/TTS timestamps after audio is generated.',
  shots: script.shots.map((shot, index) => {
    const globalShotStartMs = index * shotDurationMs;
    const relativeStartMs = voiceStartOffsetMs;
    const relativeEndMs = shotDurationMs - voiceEndPaddingMs;
    const globalStartMs = globalShotStartMs + relativeStartMs;
    const globalEndMs = globalShotStartMs + relativeEndMs;

    const minimaxText = toMinimaxText(shot.caption);
    minimaxSegments.push(minimaxText);
    operationList.push({
      segment_id: `shot-${index + 1}`,
      emotion: 'neutral',
      speed: 'normal',
      volume: 'normal',
      text: minimaxText,
      output_filename: `voiceover-shot-${String(index + 1).padStart(2, '0')}.mp3`,
    });

    return {
      index: index + 1,
      scene: shot.scene,
      caption: shot.caption,
      minimaxText,
      captionKeyword: shot.captionKeyword,
      target: {
        relativeStartMs,
        relativeEndMs,
        globalStartMs,
        globalEndMs,
      },
      captionTiming: {
        startMs: relativeStartMs,
        endMs: relativeEndMs,
      },
    };
  }),
};

mkdirSync(outDir, {recursive: true});
writeFileSync(resolve(outDir, 'minimax-voiceover.txt'), `${minimaxSegments.join(`${segmentPause}\n`)}\n`, 'utf8');
writeFileSync(resolve(outDir, 'voice-timing-plan.json'), `${JSON.stringify(timingPlan, null, 2)}\n`, 'utf8');
writeFileSync(resolve(outDir, 'minimax-operation-list.json'), `${JSON.stringify({
  title: script.title,
  note: 'MiniMax website input should contain only text and <#x#> pause tags. Do not paste metadata into the TTS box.',
  directPasteFile: resolve(outDir, 'minimax-voiceover.txt'),
  segments: operationList,
}, null, 2)}\n`, 'utf8');

console.log(`Voiceover text -> ${resolve(outDir, 'minimax-voiceover.txt')}`);
console.log(`Timing plan    -> ${resolve(outDir, 'voice-timing-plan.json')}`);
console.log(`Operation list -> ${resolve(outDir, 'minimax-operation-list.json')}`);

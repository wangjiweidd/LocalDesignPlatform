import {bundle} from '@remotion/bundler';
import {getCompositions, renderFrames} from '@remotion/renderer';
import {cp, mkdir, readFile, rm} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {spawn} from 'node:child_process';
import {dirname, resolve} from 'node:path';

type RenderProps = {
  script: {
    fps: number;
    width: number;
    height: number;
    audioPath?: string;
  };
};

const projectRoot = resolve('../..');
const rendererRoot = resolve('.');
const propsPath = resolve(
  process.argv[2] ?? '../../projects/2605200900-server-pipeline-test/source/render-props.json',
);
const projectOutputPath = resolve(
  process.argv[3] ?? '../../projects/2605200900-server-pipeline-test/public/output/video-frame-sequence-safe.mp4',
);
const rendererOutputPath = resolve('public/output/video-frame-sequence-safe.mp4');
const framesDir = resolve('public/output/frame-sequence-safe');
const browserExecutable =
  process.env.REMOTION_BROWSER_EXECUTABLE ||
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

function run(command: string, args: string[], cwd = rendererRoot): Promise<void> {
  return new Promise((resolveRun, reject) => {
    const child = spawn(command, args, {cwd, stdio: 'inherit'});
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) {
        resolveRun();
        return;
      }
      reject(new Error(`${command} exited with code ${code}`));
    });
  });
}

function getAudioPath(props: RenderProps): string {
  const audioPath = props.script.audioPath;
  if (!audioPath) {
    throw new Error('render-props.json does not include script.audioPath');
  }
  if (audioPath.startsWith('output/')) {
    return resolve('public', audioPath);
  }
  return resolve(audioPath);
}

const props = JSON.parse(await readFile(propsPath, 'utf8')) as RenderProps;
const audioPath = getAudioPath(props);
if (!existsSync(audioPath)) {
  throw new Error(`Audio file not found: ${audioPath}`);
}

await rm(framesDir, {recursive: true, force: true});
await mkdir(framesDir, {recursive: true});
await mkdir(dirname(rendererOutputPath), {recursive: true});
await mkdir(dirname(projectOutputPath), {recursive: true});

console.log('Bundling Remotion entry...');
const serveUrl = await bundle({
  entryPoint: resolve('src/index.ts'),
});

const compositions = await getCompositions(serveUrl, {
  inputProps: props,
  browserExecutable,
});
const composition = compositions.find((item) => item.id === 'VideoComposition');
if (!composition) {
  throw new Error('VideoComposition not found');
}

console.log(`Rendering ${composition.durationInFrames} PNG frames...`);
await renderFrames({
  serveUrl,
  composition,
  inputProps: props,
  outputDir: framesDir,
  imageFormat: 'png',
  imageSequencePattern: 'frame-[frame].[ext]',
  concurrency: 1,
  browserExecutable,
  muted: true,
  onStart: ({frameCount}) => {
    console.log(`Frame render started: ${frameCount} frames`);
  },
  onFrameUpdate: (framesRendered) => {
    if (framesRendered === 1 || framesRendered % 30 === 0 || framesRendered === composition.durationInFrames) {
      console.log(`Rendered frames: ${framesRendered}/${composition.durationInFrames}`);
    }
  },
});

console.log('Encoding browser-safe all-keyframe MP4...');
await run('ffmpeg', [
  '-y',
  '-framerate',
  String(props.script.fps),
  '-start_number',
  '0',
  '-i',
  resolve(framesDir, 'frame-%03d.png'),
  '-i',
  audioPath,
  '-map',
  '0:v:0',
  '-map',
  '1:a:0',
  '-c:v',
  'libx264',
  '-pix_fmt',
  'yuv420p',
  '-profile:v',
  'high',
  '-level',
  '4.1',
  '-preset',
  'medium',
  '-crf',
  '18',
  '-g',
  '1',
  '-keyint_min',
  '1',
  '-sc_threshold',
  '0',
  '-bf',
  '0',
  '-color_range',
  'tv',
  '-colorspace',
  'bt709',
  '-color_primaries',
  'bt709',
  '-color_trc',
  'bt709',
  '-c:a',
  'aac',
  '-b:a',
  '192k',
  '-ar',
  '48000',
  '-movflags',
  '+faststart',
  rendererOutputPath,
]);

if (rendererOutputPath !== projectOutputPath) {
  await cp(rendererOutputPath, projectOutputPath);
}
await cp(rendererOutputPath, resolve(dirname(projectOutputPath), 'video.mp4'));
console.log(`Done: ${projectOutputPath}`);
console.log(`Project root: ${projectRoot}`);

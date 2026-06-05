import {bundle} from '@remotion/bundler';
import {getCompositions, renderFrames} from '@remotion/renderer';
import {cp, mkdir, readFile, rm} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {spawn} from 'node:child_process';
import {dirname, resolve} from 'node:path';

type RenderProps = {
  script: {
    fps: number;
    audioPath?: string;
  };
};

const propsPath = resolve(process.argv[2] ?? '../../projects/2605200900-server-pipeline-test/source/render-props.json');
const projectOutputPath = resolve(process.argv[3] ?? '../../projects/2605200900-server-pipeline-test/public/output/video.mp4');
const framesDir = resolve(process.argv[4] ?? 'public/output/frame-sequence-props');
const rendererRoot = resolve('.');
const rendererOutputPath = resolve('public/output/video-props-frame-sequence.mp4');
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

function getAudioPath(props: RenderProps): string | null {
  const audioPath = props.script.audioPath;
  if (!audioPath) return null;
  if (audioPath.startsWith('output/')) return resolve('public', audioPath);
  return resolve(audioPath);
}

const props = JSON.parse(await readFile(propsPath, 'utf8')) as RenderProps;
const audioPath = getAudioPath(props);

await rm(framesDir, {recursive: true, force: true});
await mkdir(framesDir, {recursive: true});
await mkdir(dirname(projectOutputPath), {recursive: true});
await mkdir(dirname(rendererOutputPath), {recursive: true});

console.log('Bundling Remotion entry...');
const serveUrl = await bundle({entryPoint: resolve('src/index.ts')});
const compositions = await getCompositions(serveUrl, {inputProps: props, browserExecutable});
const composition = compositions.find((item) => item.id === 'VideoComposition');
if (!composition) throw new Error('VideoComposition not found');

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
  onFrameUpdate: (framesRendered) => {
    if (framesRendered === 1 || framesRendered % 30 === 0 || framesRendered === composition.durationInFrames) {
      console.log(`Rendered frames: ${framesRendered}/${composition.durationInFrames}`);
    }
  },
});

const args = [
  '-y',
  '-framerate',
  String(props.script.fps),
  '-start_number',
  '0',
  '-i',
  resolve(framesDir, 'frame-%03d.png'),
];

if (audioPath && existsSync(audioPath)) {
  args.push('-i', audioPath, '-map', '0:v:0', '-map', '1:a:0');
} else {
  args.push('-map', '0:v:0');
}

args.push(
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
);

if (audioPath && existsSync(audioPath)) {
  args.push('-c:a', 'aac', '-b:a', '192k', '-ar', '48000');
}

args.push('-movflags', '+faststart', rendererOutputPath);

console.log('Encoding MP4 from PNG frames...');
await run('ffmpeg', args);
await cp(rendererOutputPath, projectOutputPath);
console.log(`Done: ${projectOutputPath}`);

import {mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import type {CaptionTiming, ScriptDataV2} from '../src/data/types-v2';

type RenderProps = {script: ScriptDataV2};
type TimingPlan = {
  shots: {
    index: number;
    caption: string;
    captionTiming: CaptionTiming;
  }[];
};

const [propsArg, timingArg, outArg] = process.argv.slice(2);

if (!propsArg || !timingArg || !outArg) {
  console.error('Usage: npx tsx scripts/apply-caption-timing.ts <render-props.json> <voice-timing-plan.json> <output-render-props.json>');
  process.exit(1);
}

const propsPath = resolve(propsArg);
const timingPath = resolve(timingArg);
const outputPath = resolve(outArg);

const renderProps = JSON.parse(readFileSync(propsPath, 'utf8')) as RenderProps;
const timingPlan = JSON.parse(readFileSync(timingPath, 'utf8')) as TimingPlan;

const shots = renderProps.script.shots.map((shot, index) => {
  const planShot = timingPlan.shots.find((item) => item.index === index + 1);
  if (!planShot) return shot;
  if (planShot.caption !== shot.caption) {
    throw new Error(`Caption mismatch at shot ${index + 1}: timing="${planShot.caption}" render="${shot.caption}"`);
  }
  return {...shot, captionTiming: planShot.captionTiming};
});

mkdirSync(dirname(outputPath), {recursive: true});
writeFileSync(outputPath, `${JSON.stringify({...renderProps, script: {...renderProps.script, shots}}, null, 2)}\n`, 'utf8');
console.log(`Timed render props -> ${outputPath}`);

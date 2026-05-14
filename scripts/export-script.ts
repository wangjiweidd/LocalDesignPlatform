// Reads current-video.ts and writes a voiceover script.txt to public/output/
// Usage: npx tsx scripts/export-script.ts

import {readFileSync, writeFileSync, mkdirSync} from 'node:fs';
import {resolve} from 'node:path';

const scriptPath = resolve('./src/data/current-video.ts');

async function main() {
  const {script} = await import(scriptPath);

  const fps      = script.fps as number;
  const duration = (script.shotDurationFrames / fps).toFixed(1);

  const lines: string[] = [];
  lines.push(`视频：${script.title}`);
  lines.push(`赛道：${script.track}`);
  lines.push('');

  (script.shots as {caption: string}[]).forEach((shot, i: number) => {
    lines.push(`[镜头 ${i + 1} — ${duration}s]`);
    lines.push(shot.caption);
    lines.push('');
  });

  mkdirSync('public/output', {recursive: true});
  writeFileSync('public/output/script.txt', lines.join('\n'), 'utf8');
  console.log(`✓ script.txt written (${script.shots.length} shots) → public/output/script.txt`);
}

main().catch((e) => { console.error(e); process.exit(1); });

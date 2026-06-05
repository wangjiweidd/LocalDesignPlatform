// Reads current-video.ts and writes a voiceover script.txt to public/output/
// Usage: npx tsx scripts/export-script.ts

import {writeFileSync, mkdirSync} from 'node:fs';
import {resolve} from 'node:path';

async function main() {
  const scriptPath = resolve('./src/data/current-video.ts');
  const {script}   = await import(scriptPath) as {script: {
    title: string;
    track: string;
    fps: number;
    shotDurationFrames: number;
    shots: {text: string; caption: string}[];
  }};

  const fps          = script.fps as number;
  const shotDuration = (script.shotDurationFrames / fps).toFixed(1);
  const totalDuration = (script.shots.length * script.shotDurationFrames / fps).toFixed(1);

  const lines: string[] = [
    `视频：${script.title}`,
    `赛道：${script.track}`,
    `每镜头：${shotDuration}s  ×  ${script.shots.length} 镜头  =  ${totalDuration}s`,
    '',
  ];

  (script.shots as {caption: string}[]).forEach((shot, i: number) => {
    lines.push(`[镜头 ${i + 1} — ${shotDuration}s]`);
    lines.push(shot.caption);
    lines.push('');
  });

  mkdirSync('public/output', {recursive: true});
  writeFileSync('public/output/script.txt', lines.join('\n'), 'utf8');
  console.log(`✓ script.txt written (${script.shots.length} shots, ${totalDuration}s) → public/output/script.txt`);
}

main().catch((e) => { console.error(e); process.exit(1); });

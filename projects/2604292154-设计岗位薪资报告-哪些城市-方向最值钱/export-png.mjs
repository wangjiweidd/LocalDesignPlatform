import { spawnSync } from 'child_process';
import path from 'path';
import { pathToFileURL } from 'url';
import fs from 'fs';

const root = process.cwd();
const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const pages = [
  ['p1-cover.html','p1-cover.png'],
  ['p2-city-gap.html','p2-city-gap.png'],
  ['p3-city-choice.html','p3-city-choice.png'],
  ['p4-direction.html','p4-direction.png'],
  ['p5-experience.html','p5-experience.png'],
  ['p6-portfolio.html','p6-portfolio.png'],
  ['p7-salary-check.html','p7-salary-check.png'],
  ['p8-summary.html','p8-summary.png'],
];
fs.mkdirSync(path.join(root, 'png'), { recursive: true });
for (const [html, png] of pages) {
  const url = pathToFileURL(path.join(root, 'html', html)).href;
  const out = path.join(root, 'png', png);
  const args = [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--no-first-run',
    '--no-default-browser-check',
    '--window-size=1080,1440',
    `--screenshot=${out}`,
    url,
  ];
  const res = spawnSync(chrome, args, { encoding: 'utf8' });
  if (res.status !== 0) {
    console.error(res.stderr || res.stdout);
    process.exit(res.status || 1);
  }
  console.log(out);
}

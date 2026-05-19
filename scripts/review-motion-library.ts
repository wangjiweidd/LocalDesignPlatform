import {existsSync, readdirSync, readFileSync} from 'node:fs';
import {join, relative} from 'node:path';
import {execFileSync} from 'node:child_process';

type CountMap = Map<string, number>;

const ROOT = process.cwd();
const DATA_DIR = join(ROOT, 'src/data');
const SCENES_DIR = join(ROOT, 'src/scenes');
const COMPONENTS_DIR = join(ROOT, 'src/components');
const ASSETS_DIR = join(ROOT, 'public/assets');
const GENERATED_ASSETS_DIR = join(ROOT, 'public/assets/generated');
const TYPES_FILE = join(ROOT, 'src/data/types-v2.ts');
const SCENE_CATALOG = join(ROOT, 'content-system/visual-rules/scenes.md');
const MOTION_CATALOG = join(ROOT, 'content-system/visual-rules/motion-presets.md');

const FORBIDDEN_GIT_SCOPE = ['public/output/', 'node_modules/', 'build/', 'tmp/', '.DS_Store'];

function main() {
  const dataTexts = listFiles(DATA_DIR, ['.ts']).map(readText).join('\n');
  const typeText = readIfExists(TYPES_FILE);
  const sceneCatalogText = readIfExists(SCENE_CATALOG);
  const motionCatalogText = readIfExists(MOTION_CATALOG);

  const usedScenes = countValues(extractObjectValues(dataTexts, 'scene'));
  const usedPresets = countValues(extractObjectValues(dataTexts, 'motionPreset'));
  const usedStyles = countValues(extractObjectValues(dataTexts, 'animationStyle'));
  const usedLotties = countValues(extractObjectValues(dataTexts, 'lottieId'));

  const typedScenes = [
    ...extractUnionValues(typeText, 'KnowledgeSceneId'),
    ...extractUnionValues(typeText, 'EducationSceneId'),
  ];
  const typedPresets = [
    ...extractUnionValues(typeText, 'KnowledgeMotionPresetId'),
    ...extractUnionValues(typeText, 'EducationMotionPresetId'),
  ];
  const catalogScenes = extractMarkdownIds(sceneCatalogText);
  const catalogPresets = extractMarkdownIds(motionCatalogText);
  const implementedScenes = listFiles(SCENES_DIR, ['.tsx']).map((file) => kebabBaseName(file));
  const componentFiles = listFiles(COMPONENTS_DIR, ['.tsx']).map((file) => relative(ROOT, file));
  const generatedAssets = listFiles(GENERATED_ASSETS_DIR, ['.png', '.jpg', '.jpeg', '.webp']).map((file) => relative(ASSETS_DIR, file));
  const lottieAssets = listFiles(join(ASSETS_DIR, 'lottie'), ['.json']).map((file) => relative(ASSETS_DIR, file));
  const gitScope = inspectGitScope();

  const lines = [
    '# Motion Library Review',
    '',
    `Generated: ${new Date().toISOString()}`,
    '',
    '## Inventory',
    '',
    `- Scene components: ${implementedScenes.length}`,
    `- Shared components: ${componentFiles.length}`,
    `- Typed scene IDs: ${typedScenes.length}`,
    `- Catalog scene IDs: ${catalogScenes.length}`,
    `- Typed motion presets: ${typedPresets.length}`,
    `- Catalog motion presets: ${catalogPresets.length}`,
    `- Generated image assets: ${generatedAssets.length}`,
    `- Lottie assets: ${lottieAssets.length}`,
    '',
    '## Repeated Patterns',
    '',
    ...sectionList('Scenes used more than once', repeated(usedScenes)),
    ...sectionList('Motion presets used more than once', repeated(usedPresets)),
    ...sectionList('Animation styles used more than once', repeated(usedStyles)),
    ...sectionList('Lottie IDs used more than once', repeated(usedLotties)),
    '',
    '## Promotion Candidates',
    '',
    ...promotionCandidates(usedScenes, usedPresets, usedStyles),
    '',
    '## Catalog Gaps',
    '',
    ...catalogGaps(typedScenes, catalogScenes, implementedScenes, 'scene'),
    ...catalogGaps(typedPresets, catalogPresets, [], 'motion preset'),
    '',
    '## Git Scope',
    '',
    ...gitScope,
    '',
    '## Next Action',
    '',
    nextAction(usedScenes, usedPresets, gitScope),
    '',
  ];

  console.log(lines.join('\n'));
}

function readText(file: string) {
  return readFileSync(file, 'utf8');
}

function readIfExists(file: string) {
  return existsSync(file) ? readText(file) : '';
}

function listFiles(dir: string, extensions: string[]): string[] {
  if (!existsSync(dir)) return [];
  const result: string[] = [];
  for (const entry of readdirSync(dir, {withFileTypes: true})) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      result.push(...listFiles(path, extensions));
    } else if (extensions.some((extension) => entry.name.endsWith(extension))) {
      result.push(path);
    }
  }
  return result.sort();
}

function extractObjectValues(text: string, key: string) {
  const pattern = new RegExp(`\\b${key}\\s*:\\s*['"]([^'"]+)['"]`, 'g');
  return [...text.matchAll(pattern)].map((match) => match[1]);
}

function extractUnionValues(text: string, typeName: string) {
  const match = text.match(new RegExp(`export type ${typeName}\\s*=([\\s\\S]*?);`));
  if (!match) return [];
  return [...match[1].matchAll(/'([^']+)'/g)].map((item) => item[1]);
}

function extractMarkdownIds(text: string) {
  return [...text.matchAll(/^### `([^`]+)`/gm)].map((match) => match[1]);
}

function countValues(values: string[]): CountMap {
  const counts = new Map<string, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return counts;
}

function repeated(counts: CountMap) {
  return [...counts.entries()]
    .filter(([, count]) => count > 1)
    .sort((a, b) => b[1] - a[1])
    .map(([id, count]) => `${id} (${count}x)`);
}

function sectionList(title: string, items: string[]) {
  if (items.length === 0) return [`- ${title}: none`];
  return [`- ${title}:`, ...items.map((item) => `  - ${item}`)];
}

function promotionCandidates(scenes: CountMap, presets: CountMap, styles: CountMap) {
  const candidates: string[] = [];
  for (const [scene, count] of scenes) {
    if (count >= 2) candidates.push(`- scene template: \`${scene}\` is reused ${count}x; keep its props generic.`);
  }
  for (const [preset, count] of presets) {
    if (count >= 2) candidates.push(`- motion preset: \`${preset}\` is reused ${count}x; document ideal duration and easing.`);
  }
  for (const [style, count] of styles) {
    if (count >= 3) candidates.push(`- design token: \`${style}\` is reused ${count}x; keep timing values centralized.`);
  }
  return candidates.length > 0 ? candidates : ['- none'];
}

function catalogGaps(typed: string[], cataloged: string[], implemented: string[], label: string) {
  const lines: string[] = [];
  const missingFromCatalog = typed.filter((id) => !cataloged.includes(id));
  if (missingFromCatalog.length > 0) {
    lines.push(`- typed ${label}s missing from catalog: ${missingFromCatalog.map(formatId).join(', ')}`);
  }
  if (implemented.length > 0) {
    const missingImplementation = typed.filter((id) => !implemented.includes(id));
    if (missingImplementation.length > 0) {
      lines.push(`- typed ${label}s missing implementation: ${missingImplementation.map(formatId).join(', ')}`);
    }
  }
  return lines.length > 0 ? lines : [`- ${label}: no catalog gap detected`];
}

function inspectGitScope() {
  const status = execFileSync('git', ['status', '--porcelain', '--ignored'], {encoding: 'utf8'});
  const lines = status.split('\n').filter(Boolean);
  const badScope = lines.filter((line) => {
    const path = line.slice(3);
    const trackedOrUntracked = !line.startsWith('!!');
    return trackedOrUntracked && FORBIDDEN_GIT_SCOPE.some((forbidden) => path === forbidden.replace(/\/$/, '') || path.startsWith(forbidden));
  });
  const ignoredPresent = lines.filter((line) => line.startsWith('!!')).map((line) => line.slice(3));
  if (badScope.length > 0) return ['- forbidden files are in git scope:', ...badScope.map((line) => `  - ${line}`)];
  if (ignoredPresent.length > 0) return ['- no forbidden files in git scope', `- ignored generated/local paths present: ${ignoredPresent.slice(0, 8).join(', ')}`];
  return ['- no forbidden files in git scope'];
}

function nextAction(scenes: CountMap, presets: CountMap, gitScope: string[]) {
  if (gitScope.some((line) => line.includes('forbidden files are in git scope'))) {
    return '- Clean git scope before promoting library changes.';
  }
  const topScene = [...scenes.entries()].sort((a, b) => b[1] - a[1])[0];
  const topPreset = [...presets.entries()].sort((a, b) => b[1] - a[1])[0];
  if (topScene && topScene[1] >= 2) return `- Review \`${topScene[0]}\` as the next scene template candidate.`;
  if (topPreset && topPreset[1] >= 2) return `- Review \`${topPreset[0]}\` as the next motion preset candidate.`;
  return '- Keep collecting examples; no promotion pressure yet.';
}

function kebabBaseName(file: string) {
  return file
    .split('/')
    .at(-1)!
    .replace(/\.tsx$/, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase();
}

function formatId(id: string) {
  return `\`${id}\``;
}

main();

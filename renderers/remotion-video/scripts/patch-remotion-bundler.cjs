const {readFileSync, writeFileSync, existsSync} = require('node:fs');
const {join} = require('node:path');

const root = join(__dirname, '..');

const patches = [
  {
    file: join(root, 'node_modules', '@remotion', 'bundler', 'dist', 'index.js'),
    replacements: [
      [
        'const rspack_config_1 = require("./rspack-config");',
        '// Rspack is loaded lazily below. Loading it eagerly can hang macOS when the native binding is quarantined.',
      ],
      [
        '    rspackConfig: rspack_config_1.rspackConfig,',
        '    rspackConfig: (...args) => require("./rspack-config").rspackConfig(...args),',
      ],
      [
        '    createRspackCompiler: rspack_config_1.createRspackCompiler,',
        '    createRspackCompiler: (...args) => require("./rspack-config").createRspackCompiler(...args),',
      ],
    ],
  },
  {
    file: join(root, 'node_modules', '@remotion', 'bundler', 'dist', 'bundle.js'),
    replacements: [
      [
        'const rspack_config_1 = require("./rspack-config");',
        '// Rspack is loaded lazily in getConfig() only when options.rspack is true.',
      ],
      [
        `    if (options.rspack) {
        return (0, rspack_config_1.rspackConfig)(configArgs);
    }`,
        `    if (options.rspack) {
        return require("./rspack-config").rspackConfig(configArgs);
    }`,
      ],
    ],
  },
];

let patchedFiles = 0;

for (const patch of patches) {
  if (!existsSync(patch.file)) {
    continue;
  }

  let source = readFileSync(patch.file, 'utf8');
  const before = source;

  for (const [from, to] of patch.replacements) {
    if (source.includes(to)) {
      continue;
    }
    if (!source.includes(from)) {
      throw new Error(`Patch target not found in ${patch.file}: ${from}`);
    }
    source = source.replace(from, to);
  }

  if (source !== before) {
    writeFileSync(patch.file, source);
    patchedFiles += 1;
  }
}

if (patchedFiles > 0) {
  console.log(`Patched Remotion bundler lazy Rspack loading in ${patchedFiles} file(s).`);
}

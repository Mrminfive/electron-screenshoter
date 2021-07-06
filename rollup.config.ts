import path from 'path';
import { RollupOptions } from 'rollup';
import typescript from 'rollup-plugin-typescript2';
import copy from 'rollup-plugin-copy';
import { terser } from 'rollup-plugin-terser';
import { isProd, isDev } from './scripts/util';

const outputDir = isDev ? 'dev' : 'dist';

const getBasePlugins = (declaration = false) => {
  const basePlugins = [
    typescript({
      clean: true,
      objectHashIgnoreUnknownHack: false,
      tsconfigOverride: {
        compilerOptions: {
          module: 'esnext',
          declaration
        }
      }
    })
  ];

  return isProd
    ? [
        ...basePlugins,
        terser({
          sourcemap: true
        })
      ]
    : basePlugins;
};

const generateConfig: (name: string, declaration?: boolean) => RollupOptions = (
  name,
  declaration = false
) => {
  const isDir = !name.includes('.');

  return {
    input: `src/${name}${isDir ? '/index.ts' : ''}`,
    external: ['electron', 'path', 'url', 'fs', 'child_process'],
    output: {
      file: `${outputDir}/${isDir ? name : name.replace('.ts', '.js')}${
        isDir ? '/index.js' : ''
      }`,
      format: 'cjs',
      sourcemap: isDev
    },
    plugins: getBasePlugins(declaration)
  };
};

const configs: RollupOptions[] = [
  {
    ...generateConfig('index.ts', true)
  },
  generateConfig('main'),
  {
    ...generateConfig('renderer'),
    plugins: [
      ...getBasePlugins(),
      copy({
        targets: [
          {
            src: ['src/capturer/**/*', '!**/*.ts'],
            dest: path.join(outputDir, 'renderer')
          }
        ]
      })
    ]
  },
  {
    ...generateConfig('screenshot'),
    watch: {
      include: ['src/screenshot/**/*']
    },
    plugins: [
      ...getBasePlugins(),
      copy({
        targets: [
          { src: ['src/screenshot/**/*', '!**/*.ts'], dest: outputDir }
        ],
        flatten: false
      })
    ]
  }
];

export default configs;

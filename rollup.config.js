import createDefaultConfig from '@open-wc/building-rollup/modern-config';
import copy from 'rollup-plugin-copy';

const path = require('path');

// if you need to support IE11 use "modern-and-legacy-config" instead.
// import createDefaultConfig from '@open-wc/building-rollup/modern-and-legacy-config';

const outputDir = 'docs';

// list of global scripts in node_modules to be loaded in index.html
// relative path has to be preserved
const globalScripts = [
  'node_modules/graphql.js/graphql.min.js',
  'node_modules/json2csv/dist/json2csv.umd.js',
];

const defaultConfig = createDefaultConfig({
  input: './index.html',
  outputDir,
});

export default {
  ...defaultConfig,
  plugins: [
    ...defaultConfig.plugins,
    copy({
      targets: [
        ...globalScripts.map(file => ({
          src: file,
          dest: `${outputDir}/${path.dirname(file)}`,
        })),
        {
          src: '.nojekyll',
          dest: `${outputDir}`,
        },
      ],
    }),
  ],
};

const { defineConfig } = require('eslint/config');
const { reactHooks } = require('eslint-plugin-react-hooks');

// extends 'plugin:jsx-a11y/strict'
// plugins 'jsx-a11y',
module.exports = defineConfig([
  {
    extends: ['prettier', 'react-app'],
    plugins: ['prettier', '@babel', reactHooks.configs['recommended-latest']],
    parser: '@babel/eslint-parser',
    parserOptions: {
      requireConfigFile: false,
      babelOptions: {
        presets: ['@babel/preset-react'],
      },
    },
    rules: {
      'prettier/prettier': [1, { trailingComma: 'all', singleQuote: true }],
    },
  },
]);

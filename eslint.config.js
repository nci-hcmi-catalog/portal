const babel = require('eslint-plugin-babel');
const { defineConfig } = require('eslint/config');
const jsxA11y = require('eslint-plugin-jsx-a11y');
const prettier = require('eslint-plugin-prettier/recommended');
const { reactHooks } = require('eslint-plugin-react-hooks');

module.exports = defineConfig([
  {
    extends: ['react-app'],
    plugins: {
      'jsx-a11y': jsxA11y.flatConfigs.strict,
      '@babel': babel,
      reactHooks: reactHooks.configs['recommended-latest'],
    },
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
  prettier,
]);

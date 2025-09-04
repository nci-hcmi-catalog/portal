import babelPlugin from '@babel/eslint-plugin';
import babelParser from '@babel/eslint-parser';
import { defineConfig } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import js from '@eslint/js';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';

export default defineConfig([
  eslintConfigPrettier,
  jsxA11y.flatConfigs.recommended,
  reactHooks.configs['recommended-latest'],
  {
    files: ['**/*.js', '**/*.jsx', '**/*.cjs', '**/*.mjs', '**/*.tsx'],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        babelOptions: {
          configFile: './ui/.babelRc',
          presets: ['@babel/preset-env', '@babel/preset-react'],
        },
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      babel: babelPlugin,
      js,
    },
  },
]);

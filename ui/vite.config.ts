import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(() => {
  return {
    build: {
      outDir: 'build',
    },
    define: {
      process: process,
    },
    envPrefix: 'REACT_APP_',
    plugins: [
      react({
        jsxImportSource: '@emotion/react',
        babel: {
          plugins: ['@emotion/babel-plugin'],
        },
      }),
      tsconfigPaths(),
    ],
    resolve: {
      // Default legacy value "jsnext:main" is removed to support moment.js
      // See: https://github.com/vitejs/vite/issues/7376#issuecomment-2404599743
      mainFields: ['browser', 'module', 'jsnext'],
    },
    server: {
      port: 3000,
    },
  };
});

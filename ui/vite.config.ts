// import { reactRouter } from '@react-router/dev/vite';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    build: {
      commonjsOptions: {
        include: ['recompose', /@overture-stack\/arranger-components/],
      },
    },
    define: {
      'process.env': env,
    },
    optimizeDeps: {
      include: ['@overture-stack/arranger-components', 'recompose'],
    },
    plugins: [
      react({
        jsxImportSource: '@emotion/react',
        babel: {
          plugins: ['@emotion/babel-plugin'],
        },
      }),
      tsconfigPaths(),
    ],
  };
});

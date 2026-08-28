import tailwindcss from '@tailwindcss/vite';
import { devtools } from '@tanstack/devtools-vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { codeInspectorPlugin } from 'code-inspector-plugin';
import { configDefaults, defineConfig } from 'vitest/config';

const config = defineConfig(({ command, mode }) => ({
  resolve: { tsconfigPaths: true },
  plugins: [
    command === 'serve' && mode !== 'test' && codeInspectorPlugin({
      bundler: 'vite',
      editor: 'code',
    }),
    devtools(),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
  test: {
    environment: 'jsdom',
    exclude: ['e2e/**', ...configDefaults.exclude],
  },
}));

export default config;

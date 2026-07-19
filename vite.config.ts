import path from 'path';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // GitHub Pages serve o site em /<repo>/; no dev mantém a raiz
  base: command === 'build' ? '/b3ridge-web/' : '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
    env: {
      VITE_API_BASE_URL: 'https://brapi.dev/api/v2',
      VITE_API_TOKEN: 'test-token',
      TZ: 'America/Sao_Paulo',
    },
  },
}));

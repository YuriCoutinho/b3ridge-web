import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/b3ridge-web/' : '/',
  plugins: [react(), tailwindcss()],
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
      VITE_INTERNAL_API_URL: 'http://localhost:3333',
      TZ: 'America/Sao_Paulo',
    },
  },
}));

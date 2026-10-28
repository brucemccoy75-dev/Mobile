import { defineConfig } from 'vitest/config';
import { fileURLToPath, URL } from 'node:url';

// Tests target src/core only: pure logic, no Phaser, no DOM.
export default defineConfig({
  resolve: {
    alias: {
      '@core': fileURLToPath(new URL('./src/core', import.meta.url)),
      '@data': fileURLToPath(new URL('./src/data', import.meta.url)),
      '@save': fileURLToPath(new URL('./src/save', import.meta.url)),
      '@game': fileURLToPath(new URL('./src/game', import.meta.url)),
    },
  },
  test: {
    include: ['src/core/**/*.test.ts', 'src/data/**/*.test.ts', 'src/save/**/*.test.ts', 'src/game/*.test.ts'],
    environment: 'node',
  },
});

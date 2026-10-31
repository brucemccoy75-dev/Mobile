import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';
import { execSync } from 'node:child_process';

// The commit a build came from, shown on the title screen so a phone can tell which build it runs.
const build = (() => { try { return (process.env.GITHUB_SHA ?? execSync('git rev-parse HEAD').toString()).trim().slice(0, 7); } catch { return 'dev'; } })();

export default defineConfig({
  base: './',
  define: { __BUILD__: JSON.stringify(build) },
  resolve: {
    alias: {
      '@core': fileURLToPath(new URL('./src/core', import.meta.url)),
      '@data': fileURLToPath(new URL('./src/data', import.meta.url)),
      '@game': fileURLToPath(new URL('./src/game', import.meta.url)),
      '@save': fileURLToPath(new URL('./src/save', import.meta.url)),
    },
  },
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 1600, // phaser is one big vendor chunk by design
    sourcemap: true,
    rollupOptions: {
      // Three pages: the game, the card editor (DECISIONS #44) and the world editor (#55).
      input: { main: fileURLToPath(new URL('./index.html', import.meta.url)), editor: fileURLToPath(new URL('./editor.html', import.meta.url)), world: fileURLToPath(new URL('./world.html', import.meta.url)) },
      output: {
        manualChunks: (id) => (id.includes('node_modules/phaser') ? 'phaser' : undefined),
      },
    },
  },
  server: { port: 5173 },
});

import { defineConfig } from 'vite';

// Relative base so the same build works at https://brucemccoy75-dev.github.io/Mobile/poker/
// and when previewed locally.
export default defineConfig({
  base: './',
  build: {
    target: 'es2022',
    sourcemap: true,
  },
});

import Phaser from 'phaser';
import { BootScene } from '@game/scenes/BootScene';
import { TitleScene } from '@game/scenes/TitleScene';
import { computeGameSize, GAME_HEIGHT } from '@game/layout';

// Logical resolution: fixed height, width follows the device aspect (16:9 .. 21:9)
// so wide phones see more world instead of black bars. See src/game/layout.ts.
const { width, height } = computeGameSize(window.innerWidth, window.innerHeight);

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width,
  height,
  backgroundColor: '#0b0f1a',
  pixelArt: true,
  roundPixels: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  input: { activePointers: 2 },
  scene: [BootScene, TitleScene],
});

// Re-fit when the phone rotates or the browser chrome collapses.
let resizeTimer: number | undefined;
window.addEventListener('resize', () => {
  window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(() => {
    const next = computeGameSize(window.innerWidth, window.innerHeight);
    if (next.width !== game.scale.gameSize.width || next.height !== GAME_HEIGHT) {
      game.scale.resize(next.width, next.height);
    }
    game.scale.refresh();
  }, 100);
});

// Best effort: lock landscape where the browser allows it (Android in fullscreen).
document.addEventListener(
  'pointerdown',
  () => {
    const so = screen.orientation as ScreenOrientation & { lock?: (o: string) => Promise<void> };
    so.lock?.('landscape').catch(() => {/* unsupported, overlay handles it */});
  },
  { once: true },
);

// Exposed for debugging from the console / Playwright.
(window as unknown as { __rerpg: Phaser.Game }).__rerpg = game;

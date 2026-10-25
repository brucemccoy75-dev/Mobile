import Phaser from 'phaser';
import { BootScene } from '@game/scenes/BootScene';
import { TitleScene } from '@game/scenes/TitleScene';
import { ClassSelectScene } from '@game/scenes/ClassSelectScene';
import { CombatScene } from '@game/scenes/CombatScene';
import { OverworldScene } from '@game/scenes/OverworldScene';
import { RewardScene } from '@game/scenes/RewardScene';
import { RunEndScene } from '@game/scenes/RunEndScene';
import { ShopScene } from '@game/scenes/ShopScene';
import { HeirloomScene } from '@game/scenes/HeirloomScene';
import { LegacyScene } from '@game/scenes/LegacyScene';
import { QuestScene } from '@game/scenes/QuestScene';
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
  scene: [BootScene, TitleScene, ClassSelectScene, OverworldScene, CombatScene, RewardScene, RunEndScene, ShopScene, HeirloomScene, LegacyScene, QuestScene],
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

// First tap: go fullscreen where the browser allows it (Android, desktop; iOS only
// via "Add to Home Screen"), then try to lock landscape, which needs fullscreen on Android.
export function enterFullscreen(): void {
  try {
    if (game.scale.fullscreen.available && !game.scale.isFullscreen) game.scale.startFullscreen();
  } catch { /* not allowed here */ }
  const so = screen.orientation as ScreenOrientation & { lock?: (o: string) => Promise<void> };
  so.lock?.('landscape').catch(() => {/* unsupported, overlay handles it */});
}
document.addEventListener('pointerup', enterFullscreen, { once: true });

// Exposed for debugging from the console / Playwright.
(window as unknown as { __rerpg: Phaser.Game }).__rerpg = game;

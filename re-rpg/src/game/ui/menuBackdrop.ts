import Phaser from 'phaser';

/**
 * The backdrop behind the run-start menus (class select, heirlooms; DECISIONS #94): a Grok valley
 * under far snowcaps, covering the screen and muted under a dark veil so the choices stay the focus.
 * Without the art, the old flat dark background.
 */
export const MENU_VEIL = 0.55;
export function menuBackdrop(scene: Phaser.Scene): void {
  const { width: W, height: H } = scene.scale.gameSize;
  scene.cameras.main.setBackgroundColor(0x0b0f1a);
  if (!scene.textures.exists('menu_valley')) return;
  const img = scene.add.image(W / 2, H / 2, 'menu_valley').setDepth(-10);
  img.setScale(Math.max(W / img.width, H / img.height));
  scene.add.rectangle(W / 2, H / 2, W, H, 0x0b0f1a, MENU_VEIL).setDepth(-9);
  // A darker band at the top and bottom, where the title and the buttons sit.
  const g = scene.add.graphics().setDepth(-8);
  g.fillGradientStyle(0x0b0f1a, 0x0b0f1a, 0x0b0f1a, 0x0b0f1a, 0.7, 0.7, 0, 0); g.fillRect(0, 0, W, 90);
  g.fillGradientStyle(0x0b0f1a, 0x0b0f1a, 0x0b0f1a, 0x0b0f1a, 0, 0, 0.75, 0.75); g.fillRect(0, H - 120, W, 120);
}

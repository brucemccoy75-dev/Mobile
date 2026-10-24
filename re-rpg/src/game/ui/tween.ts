import type Phaser from 'phaser';

/** Promise-wrapped tween so event playback can be written as straight-line async code. */
export function tween(scene: Phaser.Scene, config: Phaser.Types.Tweens.TweenBuilderConfig): Promise<void> {
  return new Promise((resolve) => {
    scene.tweens.add({ ...config, onComplete: () => resolve() });
  });
}

export function wait(scene: Phaser.Scene, ms: number): Promise<void> {
  return new Promise((resolve) => scene.time.delayedCall(ms, resolve));
}

/** Floating combat text that rises and fades. */
export async function floatText(scene: Phaser.Scene, x: number, y: number, str: string, color: string, size = 28): Promise<void> {
  const t = scene.add.text(x, y, str, { fontFamily: 'system-ui, sans-serif', fontSize: `${size}px`, color, fontStyle: 'bold', stroke: '#000000', strokeThickness: 4 }).setOrigin(0.5).setDepth(50);
  await tween(scene, { targets: t, y: y - 48, alpha: 0, duration: 650, ease: 'Cubic.Out' });
  t.destroy();
}

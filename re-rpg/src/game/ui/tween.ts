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

/** Floating combat text: pops in, holds, then drifts up and fades. Big and slow enough to read on a phone. */
export async function floatText(scene: Phaser.Scene, x: number, y: number, str: string, color: string, size = 36, duration = 1100): Promise<void> {
  const t = scene.add.text(x, y, str, { fontFamily: 'system-ui, sans-serif', fontSize: `${size}px`, color, fontStyle: 'bold', stroke: '#000000', strokeThickness: 6 }).setOrigin(0.5).setDepth(50).setScale(0.6);
  await tween(scene, { targets: t, scale: 1, duration: 120, ease: 'Back.Out' });
  await tween(scene, { targets: t, y: y - 36, alpha: 0, duration: duration - 120, ease: 'Sine.In', delay: 150 });
  t.destroy();
}

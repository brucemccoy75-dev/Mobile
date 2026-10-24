import Phaser from 'phaser';
import { APP_VERSION } from '@game/version';

export class TitleScene extends Phaser.Scene {
  constructor() { super('Title'); }

  create() {
    const { width, height } = this.scale.gameSize;
    const cx = width / 2;

    this.add.text(cx, height * 0.36, 'Re-RPG', {
      fontFamily: 'system-ui, sans-serif', fontSize: '64px', color: '#e6e9f2', fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(cx, height * 0.36 + 56, 'a roguelike for your pocket', {
      fontFamily: 'system-ui, sans-serif', fontSize: '20px', color: '#8b93a7',
    }).setOrigin(0.5);

    const prompt = this.add.text(cx, height * 0.68, 'tap to begin', {
      fontFamily: 'system-ui, sans-serif', fontSize: '22px', color: '#c9a227',
    }).setOrigin(0.5);
    this.tweens.add({ targets: prompt, alpha: 0.35, duration: 800, yoyo: true, repeat: -1 });

    this.add.text(12, height - 12, `v${APP_VERSION}  ${width}x${height}`, {
      fontFamily: 'monospace', fontSize: '12px', color: '#4b5366',
    }).setOrigin(0, 1);

    this.input.once('pointerup', () => this.scene.start('ClassSelect'));
  }
}

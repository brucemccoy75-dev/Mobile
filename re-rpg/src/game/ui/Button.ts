import Phaser from 'phaser';
import { COLORS, text } from './theme';

export interface ButtonOpts {
  width?: number;
  height?: number;
  fill?: number;
  edge?: number;
  fontSize?: string;
  disabled?: boolean;
}

export class Button extends Phaser.GameObjects.Container {
  readonly bg: Phaser.GameObjects.Rectangle;
  readonly label: Phaser.GameObjects.Text;
  private enabled = true;

  constructor(scene: Phaser.Scene, x: number, y: number, str: string, onTap: () => void, opts: ButtonOpts = {}) {
    super(scene, x, y);
    const w = opts.width ?? 160, h = opts.height ?? 52;
    this.bg = scene.add.rectangle(0, 0, w, h, opts.fill ?? COLORS.panel).setStrokeStyle(2, opts.edge ?? COLORS.panelEdge);
    this.label = scene.add.text(0, 0, str, { ...text.button, fontSize: opts.fontSize ?? text.button.fontSize }).setOrigin(0.5);
    this.add([this.bg, this.label]);
    this.setSize(w, h);
    scene.add.existing(this);

    this.bg.setInteractive({ useHandCursor: true });
    this.bg.on('pointerdown', () => { if (this.enabled) this.setScale(0.96); });
    this.bg.on('pointerout', () => this.setScale(1));
    this.bg.on('pointerup', () => {
      this.setScale(1);
      if (this.enabled) onTap();
    });
    if (opts.disabled) this.setEnabled(false);
  }

  setEnabled(on: boolean): this {
    this.enabled = on;
    this.setAlpha(on ? 1 : 0.4);
    return this;
  }
}

import Phaser from 'phaser';
import type { Status } from '@data/types';
import { FONT, STATUS_LABELS } from './theme';

/** A row of small status pills under an HP bar. Rebuilt on every change; cheap. */
export class StatusChips extends Phaser.GameObjects.Container {
  private readonly alignRight: boolean;

  constructor(scene: Phaser.Scene, x: number, y: number, alignRight = false) {
    super(scene, x, y);
    this.alignRight = alignRight;
    scene.add.existing(this);
  }

  set(statuses: Status[]): void {
    this.removeAll(true);
    let cx = 0;
    for (const s of statuses) {
      const meta = STATUS_LABELS[s.id];
      const suffix = s.id === 'guard' ? ` x${s.magnitude}` : s.id === 'burn' ? ` ${s.magnitude}/${s.turns}` : s.id === 'chill' ? '' : ` ${s.turns}`;
      const t = this.scene.add.text(0, 0, meta.label + suffix, { fontFamily: FONT, fontSize: '12px', color: meta.color, fontStyle: 'bold' }).setOrigin(this.alignRight ? 1 : 0, 0.5);
      const w = t.width + 12;
      const bg = this.scene.add.rectangle(0, 0, w, 20, 0x000000, 0.45).setOrigin(this.alignRight ? 1 : 0, 0.5);
      bg.x = this.alignRight ? -cx : cx;
      t.x = this.alignRight ? -cx - 6 : cx + 6;
      this.add([bg, t]);
      cx += w + 6;
    }
  }
}

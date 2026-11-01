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

  /**
   * `fixed` are chips that last the whole fight (a cursed enemy's traits, DECISIONS #78): drawn first,
   * with a red edge, each with its own tap.
   */
  set(statuses: Status[], onTap?: (s: Status) => void, fixed: { label: string; color: string; edge?: number; tap?: () => void }[] = []): void {
    this.removeAll(true);
    let cx = 0;
    for (const f of fixed) {
      const t = this.scene.add.text(0, 0, f.label, { fontFamily: FONT, fontSize: '12px', color: f.color, fontStyle: 'bold' }).setOrigin(this.alignRight ? 1 : 0, 0.5);
      const w = t.width + 12;
      const bg = this.scene.add.rectangle(0, 0, w + 8, 26, 0x2a0a0e, 0.8).setOrigin(this.alignRight ? 1 : 0, 0.5).setStrokeStyle(1, f.edge ?? 0xd64545, 0.9);
      bg.x = this.alignRight ? -cx : cx;
      t.x = this.alignRight ? -cx - 10 : cx + 10;
      this.add([bg, t]);
      if (f.tap) { const tap = f.tap; bg.setInteractive({ useHandCursor: true }); bg.on('pointerup', () => tap()); }
      cx += w + 14;
    }
    for (const s of statuses) {
      const meta = STATUS_LABELS[s.id];
      const suffix = s.id === 'guard' || s.id === 'ward' || s.id === 'blackjack' ? ` x${s.magnitude}` : s.id === 'burn' || s.id === 'curse' ? ` ${s.magnitude}/${s.turns}` : s.id === 'chill' || s.id === 'brace' || s.id === 'scatter' ? '' : s.id === 'harden' || s.id === 'aegis' ? ` ${s.turns}` : s.id === 'stun' ? ` ${Math.max(0, s.turns - 1)}` : ` ${s.turns}`;
      const t = this.scene.add.text(0, 0, meta.label + suffix, { fontFamily: FONT, fontSize: '12px', color: meta.color, fontStyle: 'bold' }).setOrigin(this.alignRight ? 1 : 0, 0.5);
      const w = t.width + 12;
      const bg = this.scene.add.rectangle(0, 0, w + 8, 26, 0x000000, 0.55).setOrigin(this.alignRight ? 1 : 0, 0.5).setStrokeStyle(1, 0xffffff, 0.25);
      bg.x = this.alignRight ? -cx : cx;
      t.x = this.alignRight ? -cx - 10 : cx + 10;
      this.add([bg, t]);
      if (onTap) { bg.setInteractive({ useHandCursor: true }); bg.on('pointerup', () => onTap(s)); }
      cx += w + 14;
    }
  }
}

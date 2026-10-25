import Phaser from 'phaser';
import type { ClassId } from '@data/types';
import { LEGACY_GRANT, allocateLegacy, legacySummary, type LegacyChoice } from '@core/meta';
import { createSession, getMeta, persistMeta, persistRun, setSession } from '@game/session';
import { Button } from '@game/ui/Button';
import { COLORS, text } from '@game/ui/theme';

/**
 * The run after a win: spend the one Legacy point earned. Permanent, shared by
 * every class, never refunded (DECISIONS #18). Then the run is created as usual.
 */
export class LegacyScene extends Phaser.Scene {
  constructor() { super('Legacy'); }

  create(data: { classId: ClassId }) {
    const meta = getMeta(this);
    if (meta.legacyUnspent <= 0) { this.begin(data.classId); return; }
    const { width: W, height: H } = this.scale.gameSize;
    this.cameras.main.setBackgroundColor(0x0b0f1a);
    this.add.text(W / 2, 40, 'Legacy', { ...text.title, color: COLORS.gold }).setOrigin(0.5);
    this.add.text(W / 2, 92, 'Your victory leaves a permanent mark. Choose one. It stays for every run, every class, forever. No refunds.', { ...text.body, wordWrap: { width: W - 160 }, align: 'center' }).setOrigin(0.5);
    const cur = legacySummary(meta);
    this.add.text(W / 2, 134, cur ? `So far: ${cur}` : 'Your first Legacy point.', { ...text.small, color: COLORS.gold }).setOrigin(0.5);

    const opts: { c: LegacyChoice; title: string; body: string }[] = [
      { c: 'atk', title: `+${LEGACY_GRANT.atk} Attack`, body: 'Every hit, every card, every run.' },
      { c: 'def', title: `+${LEGACY_GRANT.def} Defence`, body: 'One less from every hit you take.' },
      { c: 'maxHp', title: `+${LEGACY_GRANT.maxHp} Max HP`, body: 'A deeper well for the whole run.' },
    ];
    const cw = 240, ch = 150, gap = 24;
    const x0 = W / 2 - ((opts.length * cw + (opts.length - 1) * gap) / 2) + cw / 2;
    opts.forEach((o, i) => {
      const x = x0 + i * (cw + gap), y = H / 2 + 50;
      const bg = this.add.rectangle(x, y, cw, ch, COLORS.panel).setStrokeStyle(3, COLORS.goldHex);
      this.add.text(x, y - 36, o.title, { ...text.h2, fontSize: '24px' }).setOrigin(0.5);
      this.add.text(x, y + 10, o.body, { ...text.body, fontSize: '14px', wordWrap: { width: cw - 24 }, align: 'center' }).setOrigin(0.5);
      this.add.text(x, y + 50, 'tap to choose', text.small).setOrigin(0.5);
      bg.setInteractive({ useHandCursor: true });
      bg.on('pointerup', () => { this.children.list.forEach((g) => (g as Phaser.GameObjects.Rectangle).disableInteractive?.()); void this.choose(o.c, data.classId); });
    });
    void Button; // (no cancel: the point must be spent now)
  }

  private async choose(c: LegacyChoice, classId: ClassId) {
    const meta = getMeta(this);
    allocateLegacy(meta, c);
    await persistMeta(this);
    this.begin(classId);
  }

  private begin(classId: ClassId) {
    const session = createSession(classId, getMeta(this));
    setSession(this, session);
    void persistRun(this).then(() => this.scene.start(session.heirloomChoices.length > 0 ? 'Heirloom' : 'Overworld'));
  }
}

import Phaser from 'phaser';
import { CLASSES, getSet } from '@data/index';
import type { ClassId } from '@data/types';
import { Button } from '@game/ui/Button';
import { CLASS_COLORS, COLORS, text } from '@game/ui/theme';
import { baseStatsFor, createSession, getMeta, persistRun, setSession } from '@game/session';
import { legacySummary } from '@core/meta';
import { CLASS_UNLOCK_HINT, HEIRLOOM_DEATHS, HEIRLOOM_OFFER, HEIRLOOM_PICKS, classUnlocked, heirloomPool, heirloomUnlocked } from '@core/meta';

export class ClassSelectScene extends Phaser.Scene {
  private selected: ClassId | null = null;
  private panels = new Map<ClassId, Phaser.GameObjects.Rectangle>();
  private setLabel!: Phaser.GameObjects.Text;
  private begin!: Button;

  constructor() { super('ClassSelect'); }

  create() {
    this.selected = null;
    this.panels.clear();
    const { width, height } = this.scale.gameSize;
    this.add.text(width / 2, 34, 'Choose your class', text.h2).setOrigin(0.5);

    const panelW = Math.min(260, (width - 80) / 3 - 16);
    const gap = 16;
    const totalW = panelW * 3 + gap * 2;
    const startX = width / 2 - totalW / 2 + panelW / 2;

    CLASSES.forEach((cls, i) => {
      const x = startX + i * (panelW + gap);
      const y = height / 2 - 20;
      const unlocked = classUnlocked(getMeta(this), cls.id);
      const bg = this.add.rectangle(x, y, panelW, 250, COLORS.panel).setStrokeStyle(3, COLORS.panelEdge);
      this.panels.set(cls.id, bg);
      this.add.rectangle(x, y - 80, 56, 72, CLASS_COLORS[cls.id] ?? COLORS.player);
      this.add.text(x, y - 30, cls.name, text.h2).setOrigin(0.5);
      const st = baseStatsFor(cls.id, getMeta(this));
      this.add.text(x, y + 4, `HP ${st.maxHp}   ATK ${st.atk}   DEF ${st.def}`, { ...text.body, color: legacySummary(getMeta(this)) ? COLORS.gold : COLORS.text }).setOrigin(0.5);
      const sets = cls.sets.map((id) => getSet(id).name).join('  ·  ');
      this.add.text(x, y + 36, 'sets', text.small).setOrigin(0.5);
      this.add.text(x, y + 58, sets, { ...text.body, fontSize: '14px', color: COLORS.gold }).setOrigin(0.5);
      const pool = heirloomPool(getMeta(this), cls.id);
      const n = pool.tomes.length + pool.items.length;
      if (unlocked) this.add.text(x, y + 96, n > 0 && heirloomUnlocked(getMeta(this)) ? `${n} unlocked (${pool.tomes.length} tomes, ${pool.items.length} items)` : 'starts with Attack + Defend', { ...text.small, color: n > 0 ? COLORS.gold : COLORS.muted }).setOrigin(0.5);

      if (unlocked) {
        bg.setInteractive({ useHandCursor: true });
        bg.on('pointerup', () => this.select(cls.id));
      } else {
        // Locked: dim the whole panel and say how to open it.
        this.add.rectangle(x, y, panelW, 250, 0x0b0f1a, 0.72).setDepth(2);
        this.add.text(x, y - 80, 'LOCKED', { ...text.h2, fontSize: '24px', color: '#e6e9f2' }).setOrigin(0.5).setDepth(3);
        this.add.text(x, y + 96, CLASS_UNLOCK_HINT, { ...text.small, fontSize: '13px', color: COLORS.gold, wordWrap: { width: panelW - 30 }, align: 'center' }).setOrigin(0.5).setDepth(3);
      }
    });

    this.setLabel = this.add.text(width / 2, height - 96, 'tap a class', text.small).setOrigin(0.5);

    this.begin = new Button(this, width / 2, height - 46, 'Begin', () => this.start(), { width: 200, fill: 0x1f2a44, edge: COLORS.goldHex, disabled: true });

    const meta = getMeta(this);
    const pool = meta.discoveredSkills.length + meta.discoveredItems.length;
    const heir = heirloomUnlocked(meta)
      ? (pool > 0 ? `Heirlooms: keep ${HEIRLOOM_PICKS} of ${HEIRLOOM_OFFER} random unlocks at the start of the run.` : 'Heirlooms unlocked, but nothing discovered yet.')
      : `Heirlooms unlock after ${HEIRLOOM_DEATHS} death${HEIRLOOM_DEATHS === 1 ? '' : 's'}.`;
    this.add.text(width / 2, 62, heir, { ...text.small, color: COLORS.gold }).setOrigin(0.5);

    new Button(this, 70, height - 46, 'Back', () => this.scene.start('Title'), { width: 110, height: 40, fontSize: '14px' });
  }

  private select(id: ClassId) {
    this.selected = id;
    for (const [cid, bg] of this.panels) bg.setStrokeStyle(3, cid === id ? COLORS.goldHex : COLORS.panelEdge);
    this.setLabel.setText('your set is rolled when the run begins');
    this.begin.setEnabled(true);
  }

  private start() {
    if (!this.selected) return;
    const classId = this.selected;
    this.cameras.main.fadeOut(200, 11, 15, 26);
    // A banked Legacy point is spent first; the Legacy scene then creates the run itself.
    if (getMeta(this).legacyUnspent > 0) {
      this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('Legacy', { classId }));
      return;
    }
    const session = createSession(classId, getMeta(this));
    setSession(this, session);
    void persistRun(this);
    this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start(session.heirloomChoices.length > 0 ? 'Heirloom' : 'Overworld'));
  }
}

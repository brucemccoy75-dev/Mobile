import Phaser from 'phaser';
import { CLASSES, getSet } from '@data/index';
import type { ClassId } from '@data/types';
import { Button } from '@game/ui/Button';
import { CLASS_COLORS, COLORS, text } from '@game/ui/theme';
import { baseStatsFor, createSession, getMeta, persistRun, setSession } from '@game/session';
import { legacySummary } from '@core/meta';
import { CLASS_UNLOCK_HINT, HEIRLOOM_OFFER, HEIRLOOM_PICKS, classProgress, classUnlocked, heirloomPool } from '@core/meta';
import { expToReach } from '@data/progression';

export class ClassSelectScene extends Phaser.Scene {
  private selected: ClassId | null = null;
  private panels = new Map<ClassId, Phaser.GameObjects.Rectangle>();
  private setLabel!: Phaser.GameObjects.Text;
  private begin!: Button;
  private skills!: Button;

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
      const prog = classProgress(getMeta(this), cls.id);
      if (unlocked) this.add.text(x, y + 96, `Level ${prog.level}  ·  ${prog.unlocked.length} families, ${pool.tomes.length} tomes${prog.points ? `  ·  ${prog.points} skill point${prog.points === 1 ? '' : 's'}!` : ''}`, { ...text.small, fontSize: '12px', color: prog.points ? COLORS.gold : COLORS.muted, wordWrap: { width: panelW - 20 }, align: 'center' }).setOrigin(0.5);

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

    this.add.text(width / 2, 62, `Each run opens with ${HEIRLOOM_OFFER} random tomes from your unlocked families; keep ${HEIRLOOM_PICKS}. Their families fill the run's loot.`, { ...text.small, color: COLORS.gold }).setOrigin(0.5);

    new Button(this, 70, height - 46, 'Back', () => this.scene.start('Title'), { width: 110, height: 40, fontSize: '14px' });
    this.skills = new Button(this, width - 90, height - 46, 'Skill tree', () => { if (this.selected) this.scene.start('SkillTree', { classId: this.selected }); }, { width: 150, height: 40, fontSize: '14px' });
    this.skills.setEnabled(false);
    void expToReach;
  }

  private select(id: ClassId) {
    this.selected = id;
    for (const [cid, bg] of this.panels) bg.setStrokeStyle(3, cid === id ? COLORS.goldHex : COLORS.panelEdge);
    const prog = classProgress(getMeta(this), id);
    this.setLabel.setText(`Level ${prog.level}  ·  ${prog.exp}/${expToReach(Math.min(10, prog.level + 1))} EXP  ·  ${prog.points} skill point${prog.points === 1 ? '' : 's'}`);
    this.begin.setEnabled(true);
    this.skills.setEnabled(true);
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

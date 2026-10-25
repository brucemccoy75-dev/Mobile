import Phaser from 'phaser';
import { CLASSES, ENEMIES, ITEMS, SKILLS, getClass, getEnemy, getItem, getSkill } from '@data/index';
import type { ClassId, EnemyId, SkillId, Slot } from '@data/types';
import { TOME_COPY_CAP } from '@data/skills';
import { DECK_CAP } from '@core/combat';
import { computeStats, equipmentFromIds } from '@core/run';
import { createSession, getMeta, setSession } from '@game/session';
import { Button } from '@game/ui/Button';
import { COLORS, text } from '@game/ui/theme';

export interface TestSetup { enemyId: EnemyId; extraId?: EnemyId | null; classId: ClassId; deck: SkillId[]; equipment: Record<Slot, string | null>; }
const SLOTS: Slot[] = ['weapon', 'body', 'relic'];
const defaultSetup = (): TestSetup => ({ enemyId: 'boar', classId: 'warrior', deck: [], equipment: { weapon: null, body: null, relic: null } });

/**
 * Dev sandbox (DECISIONS #26): pick any enemy, class, tomes and gear, then fight. Nothing here is
 * saved, logged or counted; the setup itself survives in the registry so "fight again" is one tap.
 */
export class TestModeScene extends Phaser.Scene {
  constructor() { super('TestMode'); }

  private setup!: TestSetup;

  create() {
    this.setup = (this.registry.get('testSetup') as TestSetup | undefined) ?? defaultSetup();
    const { width: W, height: H } = this.scale.gameSize;
    this.cameras.main.setBackgroundColor(0x0b0f1a);
    const small = { width: 196, height: 26, fontSize: '12px' as const };
    const sel = (on: boolean) => (on ? { fill: 0x3b2a1a, edge: COLORS.goldHex } : {});

    this.add.text(16, 14, 'TEST MODE', { ...text.h2, color: COLORS.gold }).setOrigin(0, 0);
    this.add.text(236, 22, 'nothing here is saved, logged or counted · class base stats, no legacy', { ...text.small, fontSize: '12px', color: COLORS.muted }).setOrigin(0, 0);
    new Button(this, W - 250, 24, 'Back', () => this.scene.start('Title'), { width: 110, height: 32, fontSize: '13px' });
    new Button(this, W - 100, 24, 'Fight', () => this.fight(), { width: 150, height: 36, fontSize: '15px', fill: 0x1f2a44, edge: COLORS.goldHex });

    // enemies
    const x0 = 16;
    this.add.text(x0, 50, 'Enemy  ·  "2nd" adds it behind the first', text.small).setOrigin(0, 0);
    ENEMIES.forEach((e, i) => {
      new Button(this, x0 + 76, 80 + i * 30, `${e.name}  ·  ${e.archetype === 'boss' ? 'boss' : `t${e.tier}`}`, () => this.set({ enemyId: e.id, extraId: this.setup.extraId === e.id ? null : this.setup.extraId }), { ...small, width: 152, ...sel(this.setup.enemyId === e.id) });
      new Button(this, x0 + 178, 80 + i * 30, '2nd', () => this.set({ extraId: this.setup.extraId === e.id ? null : e.id }), { width: 44, height: 26, fontSize: '11px', ...sel(this.setup.extraId === e.id) });
    });

    // class + tomes
    const x1 = 236;
    this.add.text(x1, 50, 'Class', text.small).setOrigin(0, 0);
    CLASSES.forEach((c, i) => new Button(this, x1 + 60 + i * 124, 78, c.name, () => this.set({ classId: c.id }), { width: 118, height: 26, fontSize: '12px', ...sel(this.setup.classId === c.id) }));
    const tomes = SKILLS.filter((k) => k.rarity !== 'basic');
    this.add.text(x1, 100, `Tomes  ·  deck ${this.setup.deck.length}/${DECK_CAP}  (tap adds a copy, at the cap tap removes)`, text.small).setOrigin(0, 0);
    tomes.forEach((k, i) => {
      const n = this.setup.deck.filter((d) => d === k.id).length;
      const col = i % 3, row = Math.floor(i / 3);
      new Button(this, x1 + 62 + col * 126, 130 + row * 28, `${k.name}${n ? `  ×${n}` : ''}`, () => this.toggleTome(k.id), { width: 122, height: 24, fontSize: '11px', ...sel(n > 0) });
    });

    // gear
    const x2 = 630;
    this.add.text(x2, 50, 'Gear  (tap equips, tap again unequips)', text.small).setOrigin(0, 0);
    let y = 78;
    for (const slot of SLOTS) {
      this.add.text(x2, y - 12, slot, { ...text.small, fontSize: '11px', color: COLORS.muted }).setOrigin(0, 0);
      const items = ITEMS.filter((it) => it.slot === slot);
      items.forEach((it, i) => {
        const col = i % 2, row = Math.floor(i / 2);
        new Button(this, x2 + 80 + col * 160, y + 18 + row * 26, it.name, () => this.toggleItem(slot, it.id), { width: 156, height: 22, fontSize: '11px', ...sel(this.setup.equipment[slot] === it.id) });
      });
      y += 18 + Math.ceil(items.length / 2) * 26 + 14;
    }

    // summary
    const eq = equipmentFromIds(this.setup.equipment, []);
    const st = computeStats(getClass(this.setup.classId).stats, eq);
    const deckNames = this.setup.deck.map((d) => getSkill(d).name).join(', ') || 'basics only';
    this.add.text(16, H - 12, `vs ${getEnemy(this.setup.enemyId).name}${this.setup.extraId ? ` & ${getEnemy(this.setup.extraId).name}` : ''}   ·   HP ${st.maxHp}  ATK ${st.atk}  DEF ${st.def}   ·   ${deckNames}`, { ...text.small, fontSize: '12px', wordWrap: { width: W - 32 } }).setOrigin(0, 1);
  }

  private set(patch: Partial<TestSetup>) {
    this.setup = { ...this.setup, ...patch };
    this.registry.set('testSetup', this.setup);
    this.scene.restart();
  }

  private toggleTome(id: SkillId) {
    const n = this.setup.deck.filter((d) => d === id).length;
    const deck = n >= TOME_COPY_CAP || this.setup.deck.length >= DECK_CAP ? this.setup.deck.filter((d) => d !== id) : [...this.setup.deck, id];
    this.set({ deck });
  }

  private toggleItem(slot: Slot, id: string) {
    this.set({ equipment: { ...this.setup.equipment, [slot]: this.setup.equipment[slot] === id ? null : id } });
  }

  private fight() {
    const s = createSession(this.setup.classId, getMeta(this), `TEST-${Date.now()}`);
    s.testMode = true;
    s.heirloomChoices = [];
    s.deck = [...this.setup.deck];
    s.equipment = equipmentFromIds(this.setup.equipment, []);
    s.base = { ...getClass(this.setup.classId).stats };
    s.stats = computeStats(s.base, s.equipment);
    s.hp = s.stats.maxHp;
    const enemy = getEnemy(this.setup.enemyId);
    s.pendingEncounter = { kind: enemy.archetype === 'boss' ? 'boss' : 'random', enemyId: enemy.id, tile: 'forest', extra: this.setup.extraId && this.setup.extraId !== enemy.id ? [this.setup.extraId] : undefined };
    setSession(this, s);
    this.scene.start('Combat');
  }
}
void getItem;

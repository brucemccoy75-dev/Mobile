import Phaser from 'phaser';
import { BACKDROP_GROUND, BACKDROP_HORIZON, artKey, backdropKey } from '@game/art';
import { describeSkill, getEnemy, getSkill } from '@data/index';
import type { Enemy, Intent, Posture } from '@data/types';
import { createCombat, currentIntent, isPlayerStunned, skillInCombat, step, type CombatEvent, type CombatState, type PlayerAction } from '@core/combat';
import { getMeta, getSession, getStore, persistMeta, persistRun, setName, setSession, spendConsumedTomes, type PendingEncounter, type RunSession } from '@game/session';
import { gainExp, recordDeath } from '@core/meta';
import { expForEnemy } from '@data/progression';
import { recordFight } from '@game/telemetry';
import { Button } from '@game/ui/Button';
import { Card, CARD_W } from '@game/ui/Card';
import { HpBar } from '@game/ui/HpBar';
import { StatusChips } from '@game/ui/StatusChips';
import { CLASS_COLORS, COLORS, FONT, POSTURE_TEXT, STATUS_LABELS, describeIntent, text } from '@game/ui/theme';
import type { Status } from '@data/types';
import { floatText, tween, wait } from '@game/ui/tween';

/**
 * Side-view turn-based combat. Phaser only renders: the engine in core/combat
 * owns the rules, and this scene replays its event log as animation.
 */
interface EnemyView {
  slot: number;
  def: Enemy;
  sprite: Phaser.GameObjects.Rectangle | Phaser.GameObjects.Image | Phaser.GameObjects.Sprite;
  x: number; y: number;
  nameText: Phaser.GameObjects.Text;
  hp: HpBar;
  chips: StatusChips;
  intentBg: Phaser.GameObjects.Rectangle;
  intentHead: Phaser.GameObjects.Text;
  intentText: Phaser.GameObjects.Text;
  intentNum: Phaser.GameObjects.Text;
  postureText: Phaser.GameObjects.Text;
}

export class CombatScene extends Phaser.Scene {
  private session!: RunSession;
  private encounter!: PendingEncounter;
  /** Primary enemy's definition (slot 0); per-slot defs live in state.enemyDefs. */
  private enemyDef!: Enemy;
  private state!: CombatState;
  /** Enemy slot the next card goes to; tap an enemy to change it (DECISIONS #29). */
  private target = 0;
  private busy = false;

  private playerSprite!: Phaser.GameObjects.Rectangle | Phaser.GameObjects.Image;
  /** One view per enemy slot: sprite, bar, chips and intent panel. */
  private views: EnemyView[] = [];
  private targetArrow!: Phaser.GameObjects.Text;
  private playerHp!: HpBar;
  /** HP as the playback has shown it so far; bars never read live state mid-step. */
  private dispHp: { player: number; enemies: number[] } = { player: 0, enemies: [] };
  private hpBefore = 0;
  private playerChips!: StatusChips;
  private roundText!: Phaser.GameObjects.Text;
  private phaseText!: Phaser.GameObjects.Text;
  private pileText!: Phaser.GameObjects.Text;
  private infoPanel: Phaser.GameObjects.GameObject[] = [];
  private infoTimers: Phaser.Time.TimerEvent[] = [];
  private infoDismiss: (() => void) | null = null;
  private banner!: Phaser.GameObjects.Text;
  private hand: Card[] = [];
  /** What the hand looks like at this point of the playback. The engine state is already end-of-round. */
  private displayHand: string[] = [];
  /** Likewise for status chips: a Guard played this turn must show before the enemy's hit consumes it. */
  private dispStatus: { player: Status[]; enemies: Status[][] } = { player: [], enemies: [] };
  private handHint!: Phaser.GameObjects.Text;
  private holdBtn!: Button;
  private holdMode = false;
  private handY = 0;
  private px = 0; private py = 0;

  constructor() { super('Combat'); }

  create() {
    this.busy = false;
    this.hand = [];
    this.displayHand = [];
    this.holdMode = false;
    this.session = getSession(this);
    if (!this.session.pendingEncounter) throw new Error('Combat started without an encounter');
    this.encounter = this.session.pendingEncounter;
    this.enemyDef = getEnemy(this.encounter.enemyId);
    this.hpBefore = this.session.hp;
    this.target = 0;
    this.views = [];
    this.state = createCombat({
      player: { name: this.session.classId, stats: this.session.stats, hp: this.session.hp, deck: this.session.deck },
      enemies: [this.encounter.enemyId, ...(this.encounter.extra ?? [])],
      rng: this.session.rng.stream('combat'),
      skillUpgrades: this.session.skillUpgrades,
    });

    this.buildLayout();
    this.cameras.main.fadeIn(200, 11, 15, 26);
    this.syncAll();
    void this.playEvents(this.state.log);
  }

  // ---------------------------------------------------------------- layout

  private buildLayout() {
    const { width: W, height: H } = this.scale.gameSize;
    this.px = W * 0.27; this.py = H * 0.56;
    this.handY = H - 66;
    const n = this.state.enemies.length;
    // One enemy stands at 73%; a duo spreads 62% / 84% with the rear one a touch smaller.
    const slotX = (slot: number) => (n === 1 ? W * 0.73 : slot === 0 ? W * 0.62 : W * 0.84);

    const groundY = this.py + 46;
    const bgKey = backdropKey(this.encounter.tile);
    if (this.textures.exists(bgKey)) {
      // backdrop: its ground band starts on the combatants' feet line, sides crop on narrow screens
      const src = this.textures.get(bgKey).getSourceImage() as { width: number; height: number };
      const scale = Math.max(W / src.width, groundY / (src.height * BACKDROP_HORIZON));
      this.add.image(W / 2, groundY, bgKey).setOrigin(0.5, BACKDROP_HORIZON).setScale(scale).setDepth(-3);
      this.add.rectangle(W / 2, groundY + (1 - BACKDROP_HORIZON) * src.height * scale - 1, W, H, BACKDROP_GROUND).setOrigin(0.5, 0).setDepth(-3);
      // dark fades keep the HUD and the hand legible over the art
      const g = this.add.graphics().setDepth(-2);
      g.fillStyle(0x000000, 0.1); g.fillRect(0, 0, W, H);
      g.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0.8, 0.8, 0, 0); g.fillRect(0, 0, W, 140);
      g.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0, 0, 0.75, 0.75); g.fillRect(0, H - 170, W, 170);
    } else {
      this.add.rectangle(W / 2, H * 0.66, W, 2, COLORS.panelEdge); // placeholder ground line
    }

    // combatants: real art when a texture was loaded (see BootScene.ART_FILES), placeholder shapes otherwise
    const heroKey = artKey(this, `hero_${this.session.classId}`);
    const heroIdle = `anim_hero_${this.session.classId}_idle`;
    if (this.anims.exists(heroIdle)) {
      this.playerSprite = this.add.sprite(this.px, this.py + 46, `hero_${this.session.classId}_idle_c`).setOrigin(0.5, 1).setScale(0.5).play(heroIdle);
    } else if (heroKey) {
      // @2x source shown at half size; feet on the ground line the placeholder's bottom edge sat on.
      this.playerSprite = this.add.image(this.px, this.py + 46, heroKey).setOrigin(0.5, 1).setScale(0.5);
    } else {
      this.playerSprite = this.add.rectangle(this.px, this.py, 64, 92, CLASS_COLORS[this.session.classId] ?? COLORS.player);
    }
    for (const def of this.state.enemyDefs) {
      const slot = this.views.length;
      const isBoss = def.archetype === 'boss';
      const esize = isBoss ? 120 : def.tier === 2 ? 92 : 76;
      const ex = slotX(slot);
      const scale = n === 1 || slot === 0 ? 0.5 : 0.44;
      let sprite: EnemyView['sprite'];
      let ey = H * 0.54;
      const enemyKey = artKey(this, `enemy_${def.id}`);
      if (enemyKey) {
        sprite = this.add.image(ex, groundY, enemyKey).setOrigin(0.5, 1).setScale(scale);
        ey = groundY - sprite.displayHeight / 2;
      } else {
        sprite = this.add.rectangle(ex, ey, esize * scale * 2, esize * scale * 2, isBoss ? COLORS.boss : COLORS.enemy);
      }
      sprite.setDepth(n - slot); // front enemy over the rear one
      const nameText = this.add.text(ex, groundY + 12, def.name, text.small).setOrigin(0.5, 0);
      // Tap an enemy to make it the target.
      sprite.setInteractive({ useHandCursor: true });
      sprite.on('pointerup', () => this.setTarget(slot));
      this.views.push({ slot, def, sprite, x: ex, y: ey, nameText } as EnemyView);
    }
    // Stills come alive cheaply: everyone fades in from a step back (the mirror of the death fade),
    // then breathes with a slow scale bob. Frame animation (docs/ART.md) is parked until the loop is fun.
    for (const [s, dir] of [[this.playerSprite, -1] as const, ...this.views.map((v) => [v.sprite, 1] as const)]) {
      const x = s.x;
      s.setAlpha(0).setX(x + 24 * dir);
      this.tweens.add({ targets: s, alpha: 1, x, duration: 420, ease: 'Quad.Out', onComplete: () => this.breathe(s) });
    }
    const eq = Object.values(this.session.equipment).filter(Boolean).map((i) => i!.name).join(' · ');
    this.add.text(this.px, this.py + 58, `${this.session.classId} · ${setName(this.session)}${eq ? `\n${eq}` : ''}`, { ...text.small, align: 'center' }).setOrigin(0.5, 0);

    // HP bars + status rows: the player's on the left; one per enemy on the right, stacked for a duo.
    const barW = Math.min(300, W * 0.3);
    this.playerHp = new HpBar(this, 24, 40, barW, this.session.classId.toUpperCase(), this.session.stats.maxHp);
    this.playerChips = new StatusChips(this, 24, 70);
    // Duo bars sit side by side in the same left-to-right order as the enemies, so each bar is over its owner.
    for (const v of this.views) {
      const ebarW = n === 1 ? barW : Math.min(170, W * 0.18);
      const right = n === 1 ? W - 24 : W - 24 - (n - 1 - v.slot) * (ebarW + 18);
      v.hp = new HpBar(this, right, 40, ebarW, v.def.name.toUpperCase(), v.def.stats.maxHp, true);
      v.chips = new StatusChips(this, right, 70, true);
    }

    // round + phase + piles
    this.roundText = this.add.text(W / 2, 16, '', { ...text.small, fontSize: '13px' }).setOrigin(0.5);
    this.phaseText = this.add.text(W / 2, 40, 'YOUR TURN', { ...text.body, fontSize: '16px', color: COLORS.gold, fontStyle: 'bold' }).setOrigin(0.5);
    this.pileText = this.add.text(W / 2, 60, '', text.mono).setOrigin(0.5);

    // enemy intent panels: above each enemy; a tall boss would push it into the HUD, so then it sits beside him.
    for (const v of this.views) {
      const pw = n === 1 ? 230 : 176, half = pw / 2 - 11;
      const tall = v.sprite.displayHeight > 170;
      const ix = tall ? Math.max(W / 2 - 40, v.x - v.sprite.displayWidth / 2 - pw / 2 - 10) : Math.min(W - pw / 2 - 6, v.x);
      // Duos sit the panels a little higher so the target arrow fits between panel and head.
      const iy = tall ? 190 : n === 1 ? Math.max(126, v.y - v.sprite.displayHeight / 2 - 58) : Math.max(112, v.y - v.sprite.displayHeight / 2 - 72);
      v.intentBg = this.add.rectangle(ix, iy, pw, 64, COLORS.panel, 0.9).setStrokeStyle(2, COLORS.panelEdge).setInteractive({ useHandCursor: true });
      v.intentBg.on('pointerup', () => this.explainIntent(v.slot));
      // The panel is a promise, not a state: the enemy does this after your move.
      v.intentHead = this.add.text(ix - half, iy - 34, n === 1 ? 'AFTER YOUR MOVE, IT WILL' : `${v.def.name.toUpperCase()} WILL`, { fontFamily: FONT, fontSize: '10px', color: '#9aa3b8', fontStyle: 'bold' }).setOrigin(0, 1);
      v.intentText = this.add.text(ix - half, iy - 10, '', { ...text.body, fontSize: n === 1 ? '14px' : '12px', fontStyle: 'bold', wordWrap: { width: pw - 60 } }).setOrigin(0, 0.5);
      v.intentNum = this.add.text(ix + half, iy - 10, '', { ...text.h2, fontSize: n === 1 ? '26px' : '22px' }).setOrigin(1, 0.5);
      v.postureText = this.add.text(ix, iy + 16, '', { ...text.small, fontSize: n === 1 ? text.small.fontSize : '11px' }).setOrigin(0.5);
    }
    // Target arrow: a gold chevron bobbing over the enemy the next card hits (duos only; a single enemy needs none).
    this.targetArrow = this.add.text(0, 0, '▼', { fontFamily: FONT, fontSize: '26px', color: COLORS.gold, fontStyle: 'bold', stroke: '#000000', strokeThickness: 4 }).setOrigin(0.5, 1).setDepth(8).setVisible(n > 1);
    this.tweens.add({ targets: this.targetArrow, y: '+=6', duration: 500, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    this.setTarget(0, true);

    // hand hint (shown while recovering or when the hand is empty)
    this.handHint = this.add.text(W / 2, this.handY, '', { ...text.body, color: '#ffd166', fontStyle: 'bold' }).setOrigin(0.5).setDepth(4);
    // Hold back: discard a card to pass the turn (the out for a trap turn).
    this.holdBtn = new Button(this, W - 70, this.handY, 'Hold', () => this.toggleHold(), { width: 100, height: 48, fontSize: '15px', fill: 0x2a2416, edge: 0x8a6a2b });

    // banner for big moments
    this.banner = this.add.text(W / 2, H * 0.3, '', { ...text.title, fontSize: '34px' }).setOrigin(0.5).setAlpha(0).setDepth(60);

    new Button(this, W / 2, H * 0.66 + 22, 'Quit', () => this.quit(), { width: 70, height: 28, fontSize: '12px' }).setDepth(5).setAlpha(0.6);
  }

  // ---------------------------------------------------------------- sync

  private syncChips() {
    this.playerChips.set(this.dispStatus.player, (s) => this.explainStatus(s, 'you'));
    for (const v of this.views) v.chips.set(this.dispStatus.enemies[v.slot] ?? [], (s) => this.explainStatus(s, v.def.name));
  }

  /** Reset the displayed statuses from the engine (end of playback). */
  private snapStatuses() {
    this.dispStatus = { player: this.state.player.statuses.map((s) => ({ ...s })), enemies: this.state.enemies.map((e) => e.statuses.map((s) => ({ ...s }))) };
  }

  private statusList(side: 'player' | 'enemy', who = 0): Status[] {
    if (side === 'player') return this.dispStatus.player;
    return (this.dispStatus.enemies[who] ??= []);
  }
  private dispUpsert(side: 'player' | 'enemy', status: Status, who = 0) {
    const list = this.statusList(side, who);
    const i = list.findIndex((s) => s.id === status.id);
    if (i >= 0) list[i] = status; else list.push(status);
  }
  private dispRemove(side: 'player' | 'enemy', id: Status['id'], who = 0) {
    const kept = this.statusList(side, who).filter((s) => s.id !== id);
    if (side === 'player') this.dispStatus.player = kept; else this.dispStatus.enemies[who] = kept;
  }
  private dispGuardHit(side: 'player' | 'enemy', id: 'guard' | 'ward' = 'guard', who = 0) {
    const list = this.statusList(side, who);
    if (list.some((s) => s.id === 'aegis')) return; // aegis absorbs without being consumed
    const g = list.find((s) => s.id === id);
    if (g) { g.magnitude -= 1; if (g.magnitude <= 0) this.dispRemove(side, id, who); }
  }

  /** Make `slot` the target of the next card and park the arrow over it. Dead slots fall back to the front living one. */
  private setTarget(slot: number, silent = false) {
    const live = this.state.enemies.filter((e) => !e.dead);
    const chosen = this.state.enemies[slot] && !this.state.enemies[slot]!.dead ? slot : (live[0]?.slot ?? 0);
    this.target = chosen;
    const v = this.views[chosen];
    if (!v) return;
    this.tweens.killTweensOf(this.targetArrow);
    this.targetArrow.setPosition(v.x, v.y - v.sprite.displayHeight / 2 - 10);
    this.tweens.add({ targets: this.targetArrow, y: '+=6', duration: 500, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    for (const o of this.views) o.intentBg.setStrokeStyle(2, o.slot === chosen && this.views.length > 1 ? COLORS.goldHex : COLORS.panelEdge);
    void silent;
  }

  /** Tap-to-explain panel for a status or the enemy's intent. Any tap dismisses it. */
  private showInfo(title: string, body: string, color: string) {
    this.hideInfo();
    const { width: W } = this.scale.gameSize;
    const y = 128;
    const bodyT = this.add.text(W / 2, y + 22, body, { ...text.body, fontSize: '15px', wordWrap: { width: Math.min(560, W - 80) }, align: 'center' }).setOrigin(0.5, 0).setDepth(91);
    const h = bodyT.height + 60;
    const bg = this.add.rectangle(W / 2, y + h / 2 - 6, Math.min(600, W - 40), h, 0x0b0f1a, 0.96).setStrokeStyle(2, COLORS.goldHex).setDepth(90);
    const titleT = this.add.text(W / 2, y, title, { ...text.body, fontSize: '15px', color, fontStyle: 'bold' }).setOrigin(0.5, 0).setDepth(91);
    this.infoPanel = [bg, titleT, bodyT];
    // Any tap dismisses (armed a beat later so the opening tap does not), or it fades after a while.
    // Timers and the listener are tracked so a stale one never closes a newer panel.
    const dismiss = () => this.hideInfo();
    this.infoTimers = [
      this.time.delayedCall(50, () => { this.infoDismiss = dismiss; this.input.once('pointerdown', dismiss); }),
      this.time.delayedCall(7000, dismiss),
    ];
  }
  private hideInfo() {
    for (const t of this.infoTimers) t.remove(false);
    this.infoTimers = [];
    if (this.infoDismiss) { this.input.off('pointerdown', this.infoDismiss); this.infoDismiss = null; }
    for (const o of this.infoPanel) o.destroy();
    this.infoPanel = [];
  }
  private explainStatus(s: Status, who: string) {
    const m = STATUS_LABELS[s.id];
    const dur = s.id === 'guard' || s.id === 'ward' ? `${s.magnitude} hit${s.magnitude === 1 ? '' : 's'} left` : s.id === 'burn' ? `${s.magnitude} per round, ${s.turns} round${s.turns === 1 ? '' : 's'} left` : s.id === 'chill' || s.id === 'brace' || s.id === 'scatter' ? 'until it triggers' : s.id === 'stun' ? `${Math.max(0, s.turns - 1)} turn${s.turns - 1 === 1 ? '' : 's'} left` : `${s.turns} round${s.turns === 1 ? '' : 's'} left`;
    this.showInfo(`${m.label} on ${who}  ·  ${dur}`, m.desc, m.color);
  }
  private explainIntent(who = 0) {
    const { intent, predictedDamage, moveName } = currentIntent(this.state, who);
    const status = 'status' in intent ? intent.status : undefined;
    const hits = intent.kind === 'attack' ? intent.hits : 1;
    const tell = POSTURE_TEXT[this.state.enemies[who]!.next.posture] ?? '';
    const drain = intent.kind === 'attack' && !!intent.drain;
    const magic = intent.kind === 'attack' && intent.dmgType === 'magic';
    this.showInfo(`${this.state.enemyDefs[who]!.name}, after your move`, `${describeIntent(intent.kind, moveName, predictedDamage, hits, status, drain, magic)}\n\nThe round after: ${tell.replace('then: ', '')}.`, '#ffb4b4');
  }

  /** A level is a moment: flash, a big banner, and the point can be spent right now (DECISIONS #32). */
  private levelUpFanfare(level: number, points: number) {
    const { width: W, height: H } = this.scale.gameSize;
    this.cameras.main.flash(260, 255, 220, 120);
    const big = this.add.text(W / 2, H * 0.16, `LEVEL ${level}!`, { ...text.title, fontSize: '46px', color: COLORS.gold, stroke: '#000000', strokeThickness: 8 }).setOrigin(0.5).setDepth(73).setScale(0.2).setAlpha(0);
    this.tweens.add({ targets: big, scale: 1, alpha: 1, duration: 420, ease: 'Back.Out' });
    this.tweens.add({ targets: big, scale: 1.06, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.InOut', delay: 420 });
    for (let i = 0; i < 14; i++) {
      const spark = this.add.text(W / 2 + (Math.random() - 0.5) * 60, H * 0.16, '✦', { fontFamily: FONT, fontSize: `${14 + Math.random() * 14}px`, color: i % 2 ? COLORS.gold : '#ffffff' }).setOrigin(0.5).setDepth(72);
      this.tweens.add({ targets: spark, x: spark.x + (Math.random() - 0.5) * 420, y: spark.y + (Math.random() - 0.7) * 220, alpha: 0, angle: 180, duration: 900 + Math.random() * 500, ease: 'Quad.Out', delay: 120, onComplete: () => spark.destroy() });
    }
    const total = getMeta(this).progress[this.session.classId]?.points ?? points;
    new Button(this, W / 2, H * 0.62 + 56, `Spend skill point${total === 1 ? '' : 's'} (${total})`, () => this.scene.start('SkillTree', { classId: this.session.classId, returnTo: 'Reward' }), { width: 260, height: 40, fontSize: '14px', fill: 0x173526, edge: 0x3fbf7a }).setDepth(72);
  }

  private hideIntent(who: number) {
    const v = this.views[who];
    if (!v) return;
    for (const o of [v.intentBg, v.intentHead, v.intentText, v.intentNum, v.postureText]) o.setVisible(false);
  }

  /** The enemy whose hit (or tick) took the last HP; the primary enemy if the log is unclear. */
  private killerName(): string {
    for (let i = this.state.log.length - 1; i >= 0; i--) {
      const e = this.state.log[i]!;
      if ((e.t === 'damage' && e.target === 'player' && !e.blocked) || e.t === 'counter' || (e.t === 'burn' && e.side === 'player')) return this.state.enemyDefs[(e as { who?: number }).who ?? 0]!.name;
    }
    return this.enemyDef.name;
  }

  /** Idle breathing: a slow 2.5% vertical squash on the feet-anchored sprite. Lunges tween x, so the two never fight. */
  private breathe(s: Phaser.GameObjects.Rectangle | Phaser.GameObjects.Image | Phaser.GameObjects.Sprite) {
    if (!s.active) return;
    this.tweens.add({ targets: s, scaleY: s.scaleY * 1.025, duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
  }

  private showHp(side: 'player' | 'enemy', delta: number, who = 0) {
    if (side === 'player') {
      this.dispHp.player = Math.max(0, Math.min(this.state.player.stats.maxHp, this.dispHp.player + delta));
      void this.playerHp.set(this.dispHp.player, this.state.player.stats.maxHp);
      return;
    }
    const c = this.state.enemies[who]!, v = this.views[who]!;
    this.dispHp.enemies[who] = Math.max(0, Math.min(c.stats.maxHp, (this.dispHp.enemies[who] ?? c.hp) + delta));
    void v.hp.set(this.dispHp.enemies[who]!, c.stats.maxHp);
  }

  private syncAll() {
    this.dispHp = { player: this.state.player.hp, enemies: this.state.enemies.map((e) => e.hp) };
    void this.playerHp.set(this.state.player.hp, this.state.player.stats.maxHp);
    for (const v of this.views) { const en = this.state.enemies[v.slot]!; if (en.dead) v.hp.setDead(); else void v.hp.set(en.hp, en.stats.maxHp); }
    this.setTarget(this.target, true);
    this.snapStatuses();
    this.syncChips();
    this.roundText.setText(`Round ${this.state.round}  ·  screen ${this.session.screenIndex + 1}`);
    this.pileText.setText(`deck ${this.state.player.deck.length}  ·  hand ${this.state.player.hand.length}  ·  discard ${this.state.player.discard.length}`);
    this.displayHand = this.state.player.hand.slice();
    this.rebuildHand();
  }

  private rebuildHand() {
    for (const c of this.hand) c.destroy();
    this.hand = [];
    const ids = this.displayHand;
    const gap = 12;
    const total = ids.length * CARD_W + (ids.length - 1) * gap;
    const startX = this.scale.gameSize.width / 2 - total / 2 + CARD_W / 2;
    ids.forEach((id, i) => {
      const sk = skillInCombat(this.state, id);
      const card = new Card(this, startX + i * (CARD_W + gap), this.handY, sk, () => this.act(this.holdMode ? { type: 'hold', index: i } : { type: 'card', index: i, target: this.target }), describeSkill(sk, this.state.player.stats), this.state.player.stats);
      this.hand.push(card);
    });
  }

  private dropFromDisplay(skill: string) {
    const i = this.displayHand.indexOf(skill);
    if (i >= 0) this.displayHand.splice(i, 1);
  }

  private setInputEnabled(on: boolean) {
    for (const c of this.hand) c.setEnabled(on);
    this.holdBtn.setEnabled(on);
    if (!on) this.toggleHold(false);
  }

  private toggleHold(force?: boolean) {
    this.holdMode = force ?? !this.holdMode;
    this.holdBtn.label.setText(this.holdMode ? 'Cancel' : 'Hold');
    this.handHint.setText(this.holdMode ? 'tap a card to hold it back and pass the turn' : '');
    for (const c of this.hand) c.setAlpha(this.holdMode ? 0.8 : 1);
  }

  /** Recovering (or an empty hand): the turn passes on its own after a beat. */
  private async autoPass() {
    const stunned = isPlayerStunned(this.state);
    const left = stunned ? Math.max(0, (this.state.player.statuses.find((s) => s.id === 'stun')?.turns ?? 1) - 1) : 0;
    this.handHint.setText(stunned ? `Recovering… ${left} turn${left === 1 ? '' : 's'} to go` : 'No cards. The turn passes.');
    for (const c of this.hand) c.setEnabled(false);
    await wait(this, 900);
    this.handHint.setText('');
    this.act({ type: 'skip' });
  }

  private showIntent(intent: Intent, posture: Posture, predicted: number, moveName: string, who = 0) {
    const v = this.views[who]!;
    const label = intent.kind === 'attack' ? `${moveName}${intent.hits > 1 ? ` x${intent.hits}` : ''}${intent.dmgType === 'magic' ? ' · magic' : ''}${intent.drain ? ' · drains' : ''}`
      : intent.kind === 'guard' ? `${moveName} (guard)`
      : intent.kind === 'debuff' ? `${moveName} → ${STATUS_LABELS[intent.status].label}`
      : intent.kind === 'buff' ? (intent.status === 'brace' ? `${moveName}: counters next hit` : intent.status === 'scatter' ? `${moveName}: halves single hits` : intent.status === 'harden' ? `${moveName}: takes half damage` : `${moveName} (+${intent.status})`)
      : `${moveName} (stagger)`;
    v.intentText.setText(label);
    v.intentNum.setText(intent.kind === 'attack' ? String(predicted) : intent.kind === 'guard' ? '🛡' : '');
    v.postureText.setText(POSTURE_TEXT[posture] ?? '');
  }

  // ---------------------------------------------------------------- actions

  private act(action: PlayerAction) {
    if (this.busy || this.state.outcome !== 'ongoing') return;
    const events = step(this.state, action);
    void this.playEvents(events);
  }

  private async playEvents(events: CombatEvent[]) {
    this.busy = true;
    this.setInputEnabled(false);
    this.hideInfo();
    for (const e of events) await this.playEvent(e);
    this.busy = false;
    if (this.state.outcome === 'ongoing') {
      this.syncAll();
      if (isPlayerStunned(this.state) || this.state.player.hand.length === 0) { void this.autoPass(); return; }
      this.setInputEnabled(true);
    } else {
      this.syncAll();
      this.setInputEnabled(false);
      await wait(this, 300);
      this.showResult();
    }
  }

  private async playEvent(e: CombatEvent): Promise<void> {
    const who = (e as { who?: number }).who ?? 0;
    const view = this.views[who] ?? this.views[0]!;
    const sprite = (side: 'player' | 'enemy') => (side === 'player' ? this.playerSprite : view.sprite);
    const pos = (side: 'player' | 'enemy') => (side === 'player' ? { x: this.px, y: this.py } : { x: view.x, y: view.y });
    switch (e.t) {
      case 'roundStart': {
        this.roundText.setText(`Round ${e.round}  ·  screen ${this.session.screenIndex + 1}`);
        this.phaseText.setText('YOUR TURN').setColor(COLORS.gold);
        // Belt and braces: every panel reflects this round's intent from the first frame of the round.
        for (const en of this.state.enemies) {
          if (en.dead) { this.hideIntent(en.slot); continue; }
          const ci = currentIntent(this.state, en.slot);
          this.showIntent(ci.intent, en.next.posture, ci.predictedDamage, ci.moveName, en.slot);
        }
        this.setTarget(this.target, true);
        // The hardened/warded/exposed countdowns ticked at end of round; show the ticked values now.
        this.snapStatuses(); this.syncChips();
        await wait(this, 250);
        return;
      }
      case 'deal': {
        this.displayHand = e.hand.slice();
        this.rebuildHand();
        const card = this.hand[this.hand.length - 1];
        if (card) { card.setScale(0.2); await tween(this, { targets: card, scale: 1, duration: 180, ease: 'Back.Out' }); }
        this.pileText.setText(`deck ${this.state.player.deck.length}  ·  hand ${this.state.player.hand.length}  ·  discard ${this.state.player.discard.length}`);
        return;
      }
      case 'exhaust': {
        await floatText(this, this.px, this.py - 110, 'spent for this fight', COLORS.muted, 20, 900);
        return;
      }
      case 'consumed': {
        await floatText(this, this.px, this.py - 110, 'tome spent', '#ffd166', 24, 1000);
        return;
      }
      case 'hold': {
        const card = this.hand.find((c) => c.skillId === e.skill);
        if (card) { for (const c of this.hand) c.setEnabled(false); await tween(this, { targets: card, y: card.y + 70, alpha: 0, duration: 180, ease: 'Quad.In' }); }
        this.dropFromDisplay(e.skill);
        this.rebuildHand();
        await floatText(this, this.px, this.py - 70, 'held back', COLORS.muted, 26, 900);
        return;
      }
      case 'counter': {
        this.cameras.main.shake(120, 0.007);
        if (e.blocked) { this.dispGuardHit('player'); this.syncChips(); }
        else this.showHp('player', -e.amount);
        await floatText(this, this.px, this.py - 30, e.blocked ? 'COUNTER BLOCKED' : `COUNTERED  -${e.amount}`, '#ff9f68', 34);
        return;
      }
      case 'handOverflow': {
        const card = this.hand.find((c) => c.skillId === e.discarded);
        if (card) await tween(this, { targets: card, y: card.y + 60, alpha: 0, duration: 200, ease: 'Quad.In' });
        this.dropFromDisplay(e.discarded);
        this.rebuildHand();
        await this.toast(`${skillInCombat(this.state, e.discarded).name} slipped from your hand`);
        return;
      }
      case 'reshuffle':
        await this.toast('deck reshuffled');
        return;
      case 'intent':
        this.showIntent(e.intent, e.posture, e.predictedDamage, e.moveName, who);
        return;
      case 'play': {
        const s = sprite(e.side), p = pos(e.side);
        const dir = e.side === 'player' ? 1 : -1;
        if (e.side === 'enemy') {
          // A clear beat between your action and the enemy's, naming the move it promised.
          this.phaseText.setText(`ENEMY TURN · ${view.def.name}: ${e.name}`).setColor('#ffb4b4');
          view.intentBg.setStrokeStyle(3, 0xff6b6b);
          await wait(this, 450);
        }
        if (e.side === 'player') {
          // The played card leaves the hand first, visibly, so "used" is never in doubt.
          const card = this.hand.find((c) => c.skillId === e.skill);
          if (card) {
            for (const c of this.hand) c.setEnabled(false);
            await tween(this, { targets: card, y: card.y - 70, alpha: 0, scale: 0.85, duration: 160, ease: 'Quad.In' });
          }
          this.dropFromDisplay(e.skill);
          this.rebuildHand();
        }
        // The name hangs over the actor while the lunge happens, instead of one after the other.
        void floatText(this, p.x, p.y - 84, e.name, e.side === 'player' ? COLORS.gold : '#ffb4b4', 24, 1300);
        await wait(this, 200);
        await tween(this, { targets: s, x: p.x + 28 * dir, duration: 110, yoyo: true, ease: 'Quad.Out' });
        return;
      }
      case 'damage': {
        const s = sprite(e.target), p = pos(e.target);
        if (e.blocked) {
          this.dispGuardHit(e.target, e.kind === 'magic' ? 'ward' : 'guard', who);
          this.syncChips();
          await floatText(this, p.x, p.y - 30, 'BLOCKED', COLORS.block, 30, 900);
        } else {
          this.cameras.main.shake(90, 0.005);
          void tween(this, { targets: s, x: p.x + (e.target === 'player' ? -10 : 10), duration: 50, yoyo: true, repeat: 1 });
          this.showHp(e.target, -e.amount, who);
          // Multi-hit numbers stagger sideways so they do not stack on top of each other.
          const dx = e.hits > 1 ? (e.hit - (e.hits + 1) / 2) * 34 : 0;
          const p2 = floatText(this, p.x + dx, p.y - 30, `-${e.amount}`, COLORS.damage, 40, 1100);
          await (e.hits > 1 && e.hit < e.hits ? wait(this, 260) : p2);
        }
        return;
      }
      case 'heal': {
        const p = pos(e.side);
        this.showHp(e.side, e.amount, who);
        await floatText(this, p.x, p.y - 30, `+${e.amount}`, COLORS.heal, 36);
        return;
      }
      case 'burn': {
        const p = pos(e.side);
        this.phaseText.setText('END OF ROUND').setColor(COLORS.muted);
        this.showHp(e.side, -e.amount, who);
        await floatText(this, p.x, p.y - 30, `${e.status === 'curse' ? 'curse' : 'burn'} -${e.amount}`, e.status === 'curse' ? '#c084fc' : COLORS.burn, 28);
        return;
      }
      case 'statusApplied': {
        this.dispUpsert(e.side, { id: e.status, turns: e.turns, magnitude: e.magnitude }, who);
        this.syncChips();
        // Guard is self-evident from the chip and the card name; everything else gets a callout.
        if (e.status === 'guard') { await wait(this, 350); return; }
        const p = pos(e.side);
        const m = STATUS_LABELS[e.status];
        await floatText(this, p.x, p.y - 110, m.label, m.color, 22, 900);
        return;
      }
      case 'statusExpired':
        this.dispRemove(e.side, e.status, who);
        this.syncChips();
        return;
      case 'statusResisted': {
        const p = pos(e.side);
        if (e.warded) { this.dispGuardHit(e.side, 'ward', who); this.syncChips(); await floatText(this, p.x, p.y - 30, 'WARDED', COLORS.block, 30, 900); return; }
        await floatText(this, p.x, p.y - 30, 'resisted', '#c7b3ff', 26, 900);
        return;
      }
      case 'chilled': {
        const p = pos(e.side);
        this.phaseText.setText('ENEMY TURN').setColor('#ffb4b4');
        await floatText(this, p.x, p.y - 30, 'CHILLED · skips', '#9ad7ff', 30);
        return;
      }
      case 'stunned': {
        const p = pos(e.side);
        await floatText(this, p.x, p.y - 30, 'recovering · turn skipped', '#ffd166', 26);
        return;
      }
      case 'phase':
        await this.bannerShow(`${view.def.name} rages!`);
        return;
      case 'death': {
        const s = sprite(e.side);
        if (s instanceof Phaser.GameObjects.Sprite) s.anims.stop();
        this.tweens.killTweensOf(s); // the breathing stops with the body
        if (e.side === 'enemy') { s.disableInteractive(); this.hideIntent(who); view.hp.setDead(); view.chips.set([]); view.nameText.setAlpha(0.4); }
        await tween(this, { targets: s, alpha: 0.15, y: s.y + 10, duration: 350 });
        if (e.side === 'enemy' && this.target === who) this.setTarget(-1, true);
        return;
      }
      case 'end':
        return;
    }
  }

  private async toast(msg: string) {
    const t = this.add.text(this.scale.gameSize.width / 2, this.handY - 70, msg, { ...text.small, fontSize: '14px', color: COLORS.text }).setOrigin(0.5).setAlpha(0);
    await tween(this, { targets: t, alpha: 1, duration: 120 });
    await wait(this, 500);
    await tween(this, { targets: t, alpha: 0, duration: 200 });
    t.destroy();
  }

  private async bannerShow(msg: string) {
    this.banner.setText(msg).setAlpha(0).setScale(0.8);
    await tween(this, { targets: this.banner, alpha: 1, scale: 1, duration: 200, ease: 'Back.Out' });
    await wait(this, 700);
    await tween(this, { targets: this.banner, alpha: 0, duration: 200 });
  }

  // ---------------------------------------------------------------- result

  private showResult() {
    const { width: W, height: H } = this.scale.gameSize;
    const won = this.state.outcome === 'won';
    const isBoss = this.encounter.kind === 'boss';
    this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.6).setDepth(70);
    const names = this.state.enemyDefs.map((d) => d.name).join(' & ');
    const title = won ? (isBoss ? `${names} fall${this.state.enemyDefs.length === 1 ? 's' : ''}!` : 'Victory') : 'You died';
    this.add.text(W / 2, H * 0.34, title, { ...text.title, color: won ? COLORS.gold : '#ff6b6b' }).setOrigin(0.5).setDepth(71);
    recordFight(this, this.session, this.encounter, this.hpBefore, this.state.player.hp, this.state.log, won ? 'won' : 'lost');

    if (this.session.testMode) {
      // Sandbox: no spoils, no death, nothing saved. Straight back into the same fight or the setup.
      this.add.text(W / 2, H * 0.34 + 46, `${won ? 'Won' : 'Lost'} in ${this.state.round} rounds  ·  ${this.state.player.hp}/${this.session.stats.maxHp} HP left  ·  ${this.state.enemies.map((en) => `${this.state.enemyDefs[en.slot]!.name} ${en.hp}/${en.stats.maxHp}`).join(', ')}`, text.body).setOrigin(0.5).setDepth(71);
      new Button(this, W / 2 - 120, H * 0.62, 'Fight again', () => { this.session.hp = this.session.stats.maxHp; this.scene.start('Combat'); }, { width: 200, fill: 0x1f2a44, edge: COLORS.goldHex }).setDepth(72);
      new Button(this, W / 2 + 120, H * 0.62, 'Setup', () => this.scene.start('TestMode'), { width: 200 }).setDepth(72);
      return;
    }

    const spent = spendConsumedTomes(this.session, this.state.player.consumed);
    if (spent.length) void persistRun(this);
    if (won) {
      // EXP for the kill(s) goes to this class's progression (DECISIONS #32) and survives the run.
      const exp = this.state.enemyDefs.reduce((a, d) => a + expForEnemy(d, this.encounter.kind, this.state.enemyDefs.length), 0);
      const gained = gainExp(getMeta(this), this.session.classId, exp);
      void persistMeta(this);
      this.add.text(W / 2, H * 0.34 + 74, `+${exp} EXP`, { ...text.body, fontSize: '15px', color: COLORS.gold, fontStyle: 'bold' }).setOrigin(0.5).setDepth(71);
      if (gained.to > gained.from) this.levelUpFanfare(gained.to, gained.points);
      this.session.hp = this.state.player.hp;
      this.session.encountersWon += 1;
      this.session.lastResult = { encounter: this.encounter, won: true };
      this.session.pendingEncounter = null;
      const sub = (isBoss
        ? 'The way forward opens. You are fully healed.'
        : `${this.session.hp}/${this.session.stats.maxHp} HP. No healing between fights.`) + (spent.length ? `  Spent: ${spent.join(', ')}.` : '');
      this.add.text(W / 2, H * 0.34 + 46, sub, text.body).setOrigin(0.5).setDepth(71);
      const source = this.encounter.kind === 'random' || this.encounter.kind === 'node' ? (this.encounter.extra?.length ? 'guard' : 'kill') : this.encounter.kind; // a duo (or elite) pays like a guard
      this.session.pendingOffer = { source };
      new Button(this, W / 2, H * 0.62, 'Take spoils', () => this.scene.start('Reward'), { width: 220, fill: 0x1f2a44, edge: COLORS.goldHex }).setDepth(72);
    } else {
      this.session.lastResult = { encounter: this.encounter, won: false };
      recordDeath(getMeta(this), this.session.screenIndex);
      void Promise.all([persistMeta(this), getStore(this).clearRun()]);
      const killer = this.killerName();
      this.add.text(W / 2, H * 0.34 + 46, `Slain by ${killer} on screen ${this.session.screenIndex + 1}.`, text.body).setOrigin(0.5).setDepth(71);
      new Button(this, W / 2, H * 0.62, 'Continue', () => this.scene.start('RunEnd', { won: false, killedBy: killer }), { width: 220, fill: 0x1f2a44, edge: COLORS.goldHex }).setDepth(72);
    }
  }

  private quit() {
    if (this.session.testMode) { this.scene.start('TestMode'); return; }
    // Leaving mid-fight forfeits the fight but not the run: the map state was saved before the encounter.
    setSession(this, null);
    this.scene.start('Title');
  }
}

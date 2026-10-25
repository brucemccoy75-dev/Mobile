import Phaser from 'phaser';
import { artKey } from '@game/art';
import { describeSkill, getEnemy, getSkill } from '@data/index';
import type { Enemy, Intent, Posture } from '@data/types';
import { createCombat, currentIntent, isPlayerStunned, skillInCombat, step, type CombatEvent, type CombatState, type PlayerAction } from '@core/combat';
import { getMeta, getSession, getStore, persistMeta, persistRun, setName, setSession, spendConsumedTomes, type PendingEncounter, type RunSession } from '@game/session';
import { recordDeath } from '@core/meta';
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
export class CombatScene extends Phaser.Scene {
  private session!: RunSession;
  private encounter!: PendingEncounter;
  private enemyDef!: Enemy;
  private state!: CombatState;
  private busy = false;

  private playerSprite!: Phaser.GameObjects.Rectangle | Phaser.GameObjects.Image;
  private enemySprite!: Phaser.GameObjects.Rectangle | Phaser.GameObjects.Image | Phaser.GameObjects.Sprite;
  private playerHp!: HpBar;
  private enemyHp!: HpBar;
  private playerChips!: StatusChips;
  private enemyChips!: StatusChips;
  private intentText!: Phaser.GameObjects.Text;
  private intentBg!: Phaser.GameObjects.Rectangle;
  private intentNum!: Phaser.GameObjects.Text;
  private postureText!: Phaser.GameObjects.Text;
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
  private dispStatus: { player: Status[]; enemy: Status[] } = { player: [], enemy: [] };
  private handHint!: Phaser.GameObjects.Text;
  private holdBtn!: Button;
  private holdMode = false;
  private handY = 0;
  private px = 0; private py = 0; private ex = 0; private ey = 0;

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
    this.state = createCombat({
      player: { name: this.session.classId, stats: this.session.stats, hp: this.session.hp, deck: this.session.deck },
      enemy: this.enemyDef,
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
    const isBoss = this.enemyDef.archetype === 'boss';
    this.px = W * 0.27; this.py = H * 0.56;
    this.ex = W * 0.73; this.ey = H * 0.54;
    this.handY = H - 66;

    // ground line
    this.add.rectangle(W / 2, H * 0.66, W, 2, COLORS.panelEdge);

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
    const esize = isBoss ? 120 : this.enemyDef.tier === 2 ? 92 : 76;
    const groundY = this.py + 46;
    const enemyKey = artKey(this, `enemy_${this.enemyDef.id}`);
    const enemyIdle = `anim_${this.enemyDef.id}_idle`;
    if (this.anims.exists(enemyIdle)) {
      // video-cut idle loop (docs/ART.md); frames are feet-anchored so the ground line holds
      this.enemySprite = this.add.sprite(this.ex, groundY, `${this.enemyDef.id}_idle_c`).setOrigin(0.5, 1).setScale(0.5).play(enemyIdle);
      this.ey = groundY - this.enemySprite.displayHeight / 2;
    } else if (enemyKey) {
      this.enemySprite = this.add.image(this.ex, groundY, enemyKey).setOrigin(0.5, 1).setScale(0.5);
      this.ey = groundY - this.enemySprite.displayHeight / 2;
    } else {
      this.enemySprite = this.add.rectangle(this.ex, this.ey, esize, esize, isBoss ? COLORS.boss : COLORS.enemy);
    }
    this.add.text(this.ex, groundY + 12, this.enemyDef.name, text.small).setOrigin(0.5, 0);
    const eq = Object.values(this.session.equipment).filter(Boolean).map((i) => i!.name).join(' · ');
    this.add.text(this.px, this.py + 58, `${this.session.classId} · ${setName(this.session)}${eq ? `\n${eq}` : ''}`, { ...text.small, align: 'center' }).setOrigin(0.5, 0);

    // HP bars + status rows
    const barW = Math.min(300, W * 0.3);
    this.playerHp = new HpBar(this, 24, 40, barW, this.session.classId.toUpperCase(), this.session.stats.maxHp);
    this.enemyHp = new HpBar(this, W - 24, 40, barW, this.enemyDef.name.toUpperCase(), this.enemyDef.stats.maxHp, true);
    this.playerChips = new StatusChips(this, 24, 70);
    this.enemyChips = new StatusChips(this, W - 24, 70, true);

    // round + phase + piles
    this.roundText = this.add.text(W / 2, 16, '', { ...text.small, fontSize: '13px' }).setOrigin(0.5);
    this.phaseText = this.add.text(W / 2, 40, 'YOUR TURN', { ...text.body, fontSize: '16px', color: COLORS.gold, fontStyle: 'bold' }).setOrigin(0.5);
    this.pileText = this.add.text(W / 2, 60, '', text.mono).setOrigin(0.5);

    // enemy intent panel
    const ix = this.ex, iy = this.ey - this.enemySprite.displayHeight / 2 - 58;
    const intentBg = this.add.rectangle(ix, iy, 230, 64, COLORS.panel, 0.9).setStrokeStyle(2, COLORS.panelEdge).setInteractive({ useHandCursor: true });
    intentBg.on('pointerup', () => this.explainIntent());
    this.intentBg = intentBg;
    // The panel is a promise, not a state: the enemy does this after your move.
    this.add.text(ix - 104, iy - 34, 'AFTER YOUR MOVE, IT WILL', { fontFamily: FONT, fontSize: '10px', color: '#9aa3b8', fontStyle: 'bold' }).setOrigin(0, 1);
    this.add.text(ix + 104, iy - 34, 'tap for details', { ...text.mono, fontSize: '10px' }).setOrigin(1, 1);
    this.intentText = this.add.text(ix - 104, iy - 10, '', { ...text.body, fontSize: '14px', fontStyle: 'bold' }).setOrigin(0, 0.5);
    this.intentNum = this.add.text(ix + 104, iy - 10, '', { ...text.h2, fontSize: '26px' }).setOrigin(1, 0.5);
    this.postureText = this.add.text(ix, iy + 16, '', text.small).setOrigin(0.5);

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
    this.enemyChips.set(this.dispStatus.enemy, (s) => this.explainStatus(s, this.enemyDef.name));
  }

  /** Reset the displayed statuses from the engine (end of playback). */
  private snapStatuses() {
    this.dispStatus = { player: this.state.player.statuses.map((s) => ({ ...s })), enemy: this.state.enemy.statuses.map((s) => ({ ...s })) };
  }

  private dispUpsert(side: 'player' | 'enemy', status: Status) {
    const list = this.dispStatus[side];
    const i = list.findIndex((s) => s.id === status.id);
    if (i >= 0) list[i] = status; else list.push(status);
  }
  private dispRemove(side: 'player' | 'enemy', id: Status['id']) {
    this.dispStatus[side] = this.dispStatus[side].filter((s) => s.id !== id);
  }
  private dispGuardHit(side: 'player' | 'enemy', id: 'guard' | 'ward' = 'guard') {
    if (this.dispStatus[side].some((s) => s.id === 'aegis')) return; // aegis absorbs without being consumed
    const g = this.dispStatus[side].find((s) => s.id === id);
    if (g) { g.magnitude -= 1; if (g.magnitude <= 0) this.dispRemove(side, id); }
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
  private explainIntent() {
    const { intent, predictedDamage, moveName } = currentIntent(this.state);
    const status = 'status' in intent ? intent.status : undefined;
    const hits = intent.kind === 'attack' ? intent.hits : 1;
    const tell = POSTURE_TEXT[this.state.enemy.next.posture] ?? '';
    const drain = intent.kind === 'attack' && !!intent.drain;
    const magic = intent.kind === 'attack' && intent.dmgType === 'magic';
    this.showInfo(`${this.enemyDef.name}, after your move`, `${describeIntent(intent.kind, moveName, predictedDamage, hits, status, drain, magic)}\n\nThe round after: ${tell.replace('then: ', '')}.`, '#ffb4b4');
  }

  private syncAll() {
    void this.playerHp.set(this.state.player.hp, this.state.player.stats.maxHp);
    void this.enemyHp.set(this.state.enemy.hp, this.state.enemy.stats.maxHp);
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
      const card = new Card(this, startX + i * (CARD_W + gap), this.handY, sk, () => this.act(this.holdMode ? { type: 'hold', index: i } : { type: 'card', index: i }), describeSkill(sk, this.state.player.stats));
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

  private showIntent(intent: Intent, posture: Posture, predicted: number, moveName: string) {
    const label = intent.kind === 'attack' ? `${moveName}${intent.hits > 1 ? ` x${intent.hits}` : ''}${intent.dmgType === 'magic' ? ' · magic' : ''}${intent.drain ? ' · drains' : ''}`
      : intent.kind === 'guard' ? `${moveName} (guard)`
      : intent.kind === 'debuff' ? `${moveName} → ${STATUS_LABELS[intent.status].label}`
      : intent.kind === 'buff' ? (intent.status === 'brace' ? `${moveName}: counters next hit` : intent.status === 'scatter' ? `${moveName}: halves single hits` : intent.status === 'harden' ? `${moveName}: takes half damage` : `${moveName} (+${intent.status})`)
      : `${moveName} (stagger)`;
    this.intentText.setText(label);
    this.intentNum.setText(intent.kind === 'attack' ? String(predicted) : intent.kind === 'guard' ? '🛡' : '');
    this.postureText.setText(POSTURE_TEXT[posture] ?? '');
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
    const sprite = (side: 'player' | 'enemy') => (side === 'player' ? this.playerSprite : this.enemySprite);
    const pos = (side: 'player' | 'enemy') => (side === 'player' ? { x: this.px, y: this.py } : { x: this.ex, y: this.ey });
    switch (e.t) {
      case 'roundStart': {
        this.roundText.setText(`Round ${e.round}  ·  screen ${this.session.screenIndex + 1}`);
        this.phaseText.setText('YOUR TURN').setColor(COLORS.gold);
        this.intentBg.setStrokeStyle(2, COLORS.panelEdge);
        // Belt and braces: the panel reflects this round's intent from the first frame of the round.
        const ci = currentIntent(this.state);
        this.showIntent(ci.intent, this.state.enemy.next.posture, ci.predictedDamage, ci.moveName);
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
        void this.playerHp.set(this.state.player.hp, this.state.player.stats.maxHp);
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
        this.showIntent(e.intent, e.posture, e.predictedDamage, e.moveName);
        return;
      case 'play': {
        const s = sprite(e.side), p = pos(e.side);
        const dir = e.side === 'player' ? 1 : -1;
        if (e.side === 'enemy') {
          // A clear beat between your action and the enemy's, naming the move it promised.
          this.phaseText.setText(`ENEMY TURN · ${e.name}`).setColor('#ffb4b4');
          this.intentBg.setStrokeStyle(3, 0xff6b6b);
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
          this.dispGuardHit(e.target, e.kind === 'magic' ? 'ward' : 'guard');
          this.syncChips();
          await floatText(this, p.x, p.y - 30, 'BLOCKED', COLORS.block, 30, 900);
        } else {
          this.cameras.main.shake(90, 0.005);
          void tween(this, { targets: s, x: p.x + (e.target === 'player' ? -10 : 10), duration: 50, yoyo: true, repeat: 1 });
          const bar = e.target === 'player' ? this.playerHp : this.enemyHp;
          const c = e.target === 'player' ? this.state.player : this.state.enemy;
          void bar.set(c.hp, c.stats.maxHp);
          // Multi-hit numbers stagger sideways so they do not stack on top of each other.
          const dx = e.hits > 1 ? (e.hit - (e.hits + 1) / 2) * 34 : 0;
          const p2 = floatText(this, p.x + dx, p.y - 30, `-${e.amount}`, COLORS.damage, 40, 1100);
          await (e.hits > 1 && e.hit < e.hits ? wait(this, 260) : p2);
        }
        return;
      }
      case 'heal': {
        const p = pos(e.side);
        const c = e.side === 'player' ? this.state.player : this.state.enemy;
        void (e.side === 'player' ? this.playerHp : this.enemyHp).set(c.hp, c.stats.maxHp);
        await floatText(this, p.x, p.y - 30, `+${e.amount}`, COLORS.heal, 36);
        return;
      }
      case 'burn': {
        const p = pos(e.side);
        const c = e.side === 'player' ? this.state.player : this.state.enemy;
        this.phaseText.setText('END OF ROUND').setColor(COLORS.muted);
        void (e.side === 'player' ? this.playerHp : this.enemyHp).set(c.hp, c.stats.maxHp);
        await floatText(this, p.x, p.y - 30, `${e.status === 'curse' ? 'curse' : 'burn'} -${e.amount}`, e.status === 'curse' ? '#c084fc' : COLORS.burn, 28);
        return;
      }
      case 'statusApplied': {
        this.dispUpsert(e.side, { id: e.status, turns: e.turns, magnitude: e.magnitude });
        this.syncChips();
        // Guard is self-evident from the chip and the card name; everything else gets a callout.
        if (e.status === 'guard') { await wait(this, 350); return; }
        const p = pos(e.side);
        const m = STATUS_LABELS[e.status];
        await floatText(this, p.x, p.y - 110, m.label, m.color, 22, 900);
        return;
      }
      case 'statusExpired':
        this.dispRemove(e.side, e.status);
        this.syncChips();
        return;
      case 'statusResisted': {
        const p = pos(e.side);
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
        await this.bannerShow(`${this.enemyDef.name} rages!`);
        return;
      case 'death': {
        const s = sprite(e.side);
        if (s instanceof Phaser.GameObjects.Sprite) s.anims.stop();
        await tween(this, { targets: s, alpha: 0.15, y: s.y + 10, duration: 350 });
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
    const title = won ? (isBoss ? `${this.enemyDef.name} falls!` : 'Victory') : 'You died';
    this.add.text(W / 2, H * 0.34, title, { ...text.title, color: won ? COLORS.gold : '#ff6b6b' }).setOrigin(0.5).setDepth(71);

    const spent = spendConsumedTomes(this.session, this.state.player.consumed);
    if (spent.length) void persistRun(this);
    if (won) {
      this.session.hp = this.state.player.hp;
      this.session.encountersWon += 1;
      this.session.lastResult = { encounter: this.encounter, won: true };
      this.session.pendingEncounter = null;
      const sub = (isBoss
        ? 'The way forward opens. You are fully healed.'
        : `${this.session.hp}/${this.session.stats.maxHp} HP. No healing between fights.`) + (spent.length ? `  Spent: ${spent.join(', ')}.` : '');
      this.add.text(W / 2, H * 0.34 + 46, sub, text.body).setOrigin(0.5).setDepth(71);
      const source = this.encounter.kind === 'random' ? 'kill' : this.encounter.kind;
      this.session.pendingOffer = { source };
      new Button(this, W / 2, H * 0.62, 'Take spoils', () => this.scene.start('Reward'), { width: 220, fill: 0x1f2a44, edge: COLORS.goldHex }).setDepth(72);
    } else {
      this.session.lastResult = { encounter: this.encounter, won: false };
      recordDeath(getMeta(this), this.session.screenIndex);
      void Promise.all([persistMeta(this), getStore(this).clearRun()]);
      this.add.text(W / 2, H * 0.34 + 46, `Slain by ${this.enemyDef.name} on screen ${this.session.screenIndex + 1}.`, text.body).setOrigin(0.5).setDepth(71);
      new Button(this, W / 2, H * 0.62, 'Continue', () => this.scene.start('RunEnd', { won: false, killedBy: this.enemyDef.name }), { width: 220, fill: 0x1f2a44, edge: COLORS.goldHex }).setDepth(72);
    }
  }

  private quit() {
    // Leaving mid-fight forfeits the fight but not the run: the map state was saved before the encounter.
    setSession(this, null);
    this.scene.start('Title');
  }
}

import Phaser from 'phaser';
import { getEnemy, getSkill } from '@data/index';
import type { Enemy, Intent, Posture } from '@data/types';
import { createCombat, isPlayerStunned, step, type CombatEvent, type CombatState, type PlayerAction } from '@core/combat';
import { getMeta, getSession, getStore, persistMeta, setName, setSession, type PendingEncounter, type RunSession } from '@game/session';
import { recordDeath } from '@core/meta';
import { Button } from '@game/ui/Button';
import { Card, CARD_W } from '@game/ui/Card';
import { HpBar } from '@game/ui/HpBar';
import { StatusChips } from '@game/ui/StatusChips';
import { CLASS_COLORS, COLORS, POSTURE_TEXT, text } from '@game/ui/theme';
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

  private playerSprite!: Phaser.GameObjects.Rectangle;
  private enemySprite!: Phaser.GameObjects.Rectangle;
  private playerHp!: HpBar;
  private enemyHp!: HpBar;
  private playerChips!: StatusChips;
  private enemyChips!: StatusChips;
  private intentText!: Phaser.GameObjects.Text;
  private intentNum!: Phaser.GameObjects.Text;
  private postureText!: Phaser.GameObjects.Text;
  private roundText!: Phaser.GameObjects.Text;
  private pileText!: Phaser.GameObjects.Text;
  private banner!: Phaser.GameObjects.Text;
  private hand: Card[] = [];
  private handHint!: Phaser.GameObjects.Text;
  private handY = 0;
  private px = 0; private py = 0; private ex = 0; private ey = 0;

  constructor() { super('Combat'); }

  create() {
    this.busy = false;
    this.hand = [];
    this.session = getSession(this);
    if (!this.session.pendingEncounter) throw new Error('Combat started without an encounter');
    this.encounter = this.session.pendingEncounter;
    this.enemyDef = getEnemy(this.encounter.enemyId);
    this.state = createCombat({
      player: { name: this.session.classId, stats: this.session.stats, hp: this.session.hp, deck: this.session.deck },
      enemy: this.enemyDef,
      rng: this.session.rng.stream('combat'),
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

    // combatants (placeholder shapes until the art pass)
    this.playerSprite = this.add.rectangle(this.px, this.py, 64, 92, CLASS_COLORS[this.session.classId] ?? COLORS.player);
    const esize = isBoss ? 120 : this.enemyDef.tier === 2 ? 92 : 76;
    this.enemySprite = this.add.rectangle(this.ex, this.ey, esize, esize, isBoss ? COLORS.boss : COLORS.enemy);
    this.add.text(this.ex, this.ey + esize / 2 + 12, this.enemyDef.name, text.small).setOrigin(0.5, 0);
    const eq = Object.values(this.session.equipment).filter(Boolean).map((i) => i!.name).join(' · ');
    this.add.text(this.px, this.py + 58, `${this.session.classId} · ${setName(this.session)}${eq ? `\n${eq}` : ''}`, { ...text.small, align: 'center' }).setOrigin(0.5, 0);

    // HP bars + status rows
    const barW = Math.min(300, W * 0.3);
    this.playerHp = new HpBar(this, 24, 40, barW, this.session.classId.toUpperCase(), this.session.stats.maxHp);
    this.enemyHp = new HpBar(this, W - 24, 40, barW, this.enemyDef.name.toUpperCase(), this.enemyDef.stats.maxHp, true);
    this.playerChips = new StatusChips(this, 24, 64);
    this.enemyChips = new StatusChips(this, W - 24, 64, true);

    // round + piles
    this.roundText = this.add.text(W / 2, 22, '', { ...text.small, fontSize: '14px' }).setOrigin(0.5);
    this.pileText = this.add.text(W / 2, 42, '', text.mono).setOrigin(0.5);

    // enemy intent panel
    const ix = this.ex, iy = this.ey - esize / 2 - 58;
    this.add.rectangle(ix, iy, 190, 64, COLORS.panel, 0.9).setStrokeStyle(2, COLORS.panelEdge);
    this.intentText = this.add.text(ix - 84, iy - 10, '', { ...text.body, fontSize: '15px', fontStyle: 'bold' }).setOrigin(0, 0.5);
    this.intentNum = this.add.text(ix + 84, iy - 10, '', { ...text.h2, fontSize: '26px' }).setOrigin(1, 0.5);
    this.postureText = this.add.text(ix, iy + 16, '', text.small).setOrigin(0.5);

    // hand hint (shown while recovering or when the hand is empty)
    this.handHint = this.add.text(W / 2, this.handY, '', { ...text.body, color: '#ffd166', fontStyle: 'bold' }).setOrigin(0.5).setDepth(4);

    // banner for big moments
    this.banner = this.add.text(W / 2, H * 0.3, '', { ...text.title, fontSize: '34px' }).setOrigin(0.5).setAlpha(0).setDepth(60);

    new Button(this, W / 2, H * 0.66 + 22, 'Quit', () => this.quit(), { width: 70, height: 28, fontSize: '12px' }).setDepth(5).setAlpha(0.6);
  }

  // ---------------------------------------------------------------- sync

  private syncAll() {
    void this.playerHp.set(this.state.player.hp, this.state.player.stats.maxHp);
    void this.enemyHp.set(this.state.enemy.hp, this.state.enemy.stats.maxHp);
    this.playerChips.set(this.state.player.statuses);
    this.enemyChips.set(this.state.enemy.statuses);
    this.roundText.setText(`Round ${this.state.round}  ·  screen ${this.session.screenIndex + 1}`);
    this.pileText.setText(`deck ${this.state.player.deck.length}  ·  hand ${this.state.player.hand.length}  ·  discard ${this.state.player.discard.length}`);
    this.rebuildHand();
  }

  private rebuildHand() {
    for (const c of this.hand) c.destroy();
    this.hand = [];
    const ids = this.state.player.hand;
    const gap = 12;
    const total = ids.length * CARD_W + (ids.length - 1) * gap;
    const startX = this.scale.gameSize.width / 2 - total / 2 + CARD_W / 2;
    ids.forEach((id, i) => {
      const card = new Card(this, startX + i * (CARD_W + gap), this.handY, getSkill(id), () => this.act({ type: 'card', index: i }));
      this.hand.push(card);
    });
    if (ids.length === 0 && this.state.outcome === 'ongoing') {
      // nothing in hand: say so once per round, quietly
    }
  }

  private setInputEnabled(on: boolean) {
    for (const c of this.hand) c.setEnabled(on);
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
    const label = intent.kind === 'attack' ? `${moveName}${intent.hits > 1 ? ` x${intent.hits}` : ''}`
      : intent.kind === 'guard' ? `${moveName} (guard)`
      : intent.kind === 'debuff' ? `${moveName} → ${intent.status}`
      : intent.kind === 'buff' ? `${moveName} (+${intent.status})`
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
      case 'roundStart':
        this.roundText.setText(`Round ${e.round}  ·  screen ${this.session.screenIndex + 1}`);
        return;
      case 'deal': {
        this.rebuildHand();
        const card = this.hand[this.hand.length - 1];
        if (card) { card.setScale(0.2); await tween(this, { targets: card, scale: 1, duration: 180, ease: 'Back.Out' }); }
        this.pileText.setText(`deck ${this.state.player.deck.length}  ·  hand ${this.state.player.hand.length}  ·  discard ${this.state.player.discard.length}`);
        return;
      }
      case 'handOverflow':
        await this.toast(`${getSkill(e.discarded).name} slipped from your hand`);
        return;
      case 'reshuffle':
        await this.toast('deck reshuffled');
        return;
      case 'intent':
        this.showIntent(e.intent, e.posture, e.predictedDamage, e.moveName);
        return;
      case 'play': {
        const s = sprite(e.side), p = pos(e.side);
        const dir = e.side === 'player' ? 1 : -1;
        this.playerChips.set(this.state.player.statuses);
        this.enemyChips.set(this.state.enemy.statuses);
        this.rebuildHand();
        await floatText(this, p.x, p.y - 70, e.name, e.side === 'player' ? COLORS.gold : '#ffb4b4', 20);
        await tween(this, { targets: s, x: p.x + 28 * dir, duration: 90, yoyo: true, ease: 'Quad.Out' });
        return;
      }
      case 'damage': {
        const s = sprite(e.target), p = pos(e.target);
        if (e.blocked) {
          await floatText(this, p.x, p.y - 30, 'BLOCK', COLORS.block, 24);
        } else {
          this.cameras.main.shake(80, 0.004);
          void tween(this, { targets: s, x: p.x + (e.target === 'player' ? -10 : 10), duration: 50, yoyo: true, repeat: 1 });
          const bar = e.target === 'player' ? this.playerHp : this.enemyHp;
          const c = e.target === 'player' ? this.state.player : this.state.enemy;
          void bar.set(c.hp, c.stats.maxHp);
          await floatText(this, p.x, p.y - 30, `-${e.amount}`, COLORS.damage, 30);
        }
        return;
      }
      case 'heal': {
        const p = pos(e.side);
        const c = e.side === 'player' ? this.state.player : this.state.enemy;
        void (e.side === 'player' ? this.playerHp : this.enemyHp).set(c.hp, c.stats.maxHp);
        await floatText(this, p.x, p.y - 30, `+${e.amount}`, COLORS.heal, 28);
        return;
      }
      case 'burn': {
        const p = pos(e.side);
        const c = e.side === 'player' ? this.state.player : this.state.enemy;
        void (e.side === 'player' ? this.playerHp : this.enemyHp).set(c.hp, c.stats.maxHp);
        await floatText(this, p.x, p.y - 30, `burn -${e.amount}`, COLORS.burn, 22);
        return;
      }
      case 'statusApplied':
      case 'statusExpired':
        this.playerChips.set(this.state.player.statuses);
        this.enemyChips.set(this.state.enemy.statuses);
        if (e.t === 'statusApplied') await wait(this, 120);
        return;
      case 'statusResisted': {
        const p = pos(e.side);
        await floatText(this, p.x, p.y - 30, 'resisted', '#c7b3ff', 20);
        return;
      }
      case 'chilled': {
        const p = pos(e.side);
        await floatText(this, p.x, p.y - 30, 'CHILLED', '#9ad7ff', 26);
        return;
      }
      case 'stunned': {
        const p = pos(e.side);
        this.playerChips.set(this.state.player.statuses);
        await floatText(this, p.x, p.y - 30, 'recovering', '#ffd166', 22);
        return;
      }
      case 'phase':
        await this.bannerShow(`${this.enemyDef.name} rages!`);
        return;
      case 'death': {
        const s = sprite(e.side);
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

    if (won) {
      this.session.hp = this.state.player.hp;
      this.session.encountersWon += 1;
      this.session.lastResult = { encounter: this.encounter, won: true };
      this.session.pendingEncounter = null;
      const sub = isBoss
        ? 'The way forward opens. You are fully healed.'
        : `${this.session.hp}/${this.session.stats.maxHp} HP. No healing between fights.`;
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

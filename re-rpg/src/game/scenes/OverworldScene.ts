import Phaser from 'phaser';
import { getEnemy, getSkill } from '@data/index';
import { key, roadBetween, type MapNode, type Tile } from '@core/map';
import { SCREEN_COUNT, currentNode, currentQuest, getMeta, getSession, getStore, isCleared, isEscorting, isFightNode, nodeById, nodeEncounter, persistMeta, persistRun, reachableNodes, routeTo, setSession, startScreen, treasureGold, type PendingEncounter, type RunSession } from '@game/session';
import { noteKill, questProgress, questReady } from '@core/quest';
import { gainExp, ghostOn, nudgeRelation, recordWin } from '@core/meta';
import { WREN_GRUDGE, ghostDef, wrenBoss } from '@core/variants';
import { WIN_EXP } from '@data/progression';
import { openDialogue } from '@game/dialogue';
import { artKey } from '@game/art';
import { Button } from '@game/ui/Button';
import { CLASS_COLORS, COLORS, FONT, text } from '@game/ui/theme';
import { tween, wait } from '@game/ui/tween';
import { groundIndices, propsFor } from '@game/tiles';
import { ensureRun } from '@game/telemetry';

/** World pixels per tile: about 11×5 tiles on a phone, close enough to read the ground. */
export const TILE = 72;
const K = TILE / 48;
const STEP_MS = 105;

/**
 * The node overworld (DECISIONS #37). The authored terrain is the backdrop; play happens on the
 * node network drawn over it. Tap a reachable node and the hero walks the road to it; arriving
 * runs the node's task (a chat, a fight, a shop, a chest, a shrine, the gate). A node can be
 * passed through only once its task is done. Nodes can be revisited: quests send you back.
 */
export class OverworldScene extends Phaser.Scene {
  private session!: RunSession;
  private player!: Phaser.GameObjects.Rectangle | Phaser.GameObjects.Image;
  private follower: Phaser.GameObjects.Rectangle | null = null;
  private markers = new Map<string, Phaser.GameObjects.Container>();
  private rings = new Map<string, Phaser.GameObjects.Arc>();
  private ghostSprite: Phaser.GameObjects.Container | null = null;
  private giverMark: Phaser.GameObjects.Text | null = null;
  private questText!: Phaser.GameObjects.Text;
  private hpText!: Phaser.GameObjects.Text;
  private hpFill!: Phaser.GameObjects.Rectangle;
  private goldText!: Phaser.GameObjects.Text;
  private toastText!: Phaser.GameObjects.Text;
  private locked = false;

  constructor() { super('Overworld'); }

  create() {
    // Scene objects are reused by Phaser; never trust field initialisers here.
    this.locked = false;
    this.markers.clear();
    this.rings.clear();
    this.follower = null;
    this.ghostSprite = null;
    this.giverMark = null;
    ensureRun(this, getSession(this), getMeta(this));
    this.session = getSession(this);
    const m = this.session.map;

    this.cameras.main.setBounds(0, 0, m.width * TILE, m.height * TILE);
    this.cameras.main.setBackgroundColor(0x0b0f1a);
    this.drawTiles();
    for (const n of m.nodes ?? []) this.drawNode(n);
    this.drawGhost();
    this.drawPlayer();
    this.buildHud();
    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
    this.cameras.main.fadeIn(250, 11, 15, 26);
    this.syncRings();

    const fresh = !this.session.lastResult && this.session.clearedNodes.size === 0;
    void this.applyLastResult().then(async () => {
      await persistRun(this);
      // The first node is the story node: arriving on the screen is arriving there.
      if (fresh) { await wait(this, 350); await this.enterNode(currentNode(this.session)); }
    });
  }

  // ---------------------------------------------------------------- drawing

  private get hasArt() { return this.textures.exists('ground_c') && this.textures.exists('props_c'); }
  private centre(t: Tile) { return { x: t.x * TILE + TILE / 2, y: t.y * TILE + TILE / 2 }; }

  private drawTiles() {
    const m = this.session.map;
    if (!this.hasArt) {
      const fill: Record<string, number> = { grass: 0x3b6d3a, forest: 0x244d2a, swamp: 0x4a5b3a, water: 0x2b5d8a, rock: 0x4a4f5a, road: 0xb8a06a, arena: 0x5a2b3a };
      const g = this.add.graphics().setDepth(1);
      for (let y = 0; y < m.height; y++) for (let x = 0; x < m.width; x++) { g.fillStyle(fill[m.tiles[y * m.width + x]!]!, 1); g.fillRect(x * TILE, y * TILE, TILE, TILE); }
      return;
    }
    const idx = groundIndices(m);
    const data: number[][] = [];
    for (let y = 0; y < m.height; y++) data.push(idx.slice(y * m.width, (y + 1) * m.width));
    const tilemap = this.make.tilemap({ data, tileWidth: 96, tileHeight: 96 });
    const tileset = tilemap.addTilesetImage('ground', 'ground_c', 96, 96, 0, 0);
    if (tileset) tilemap.createLayer(0, tileset, 0, 0)?.setScale(TILE / 96).setDepth(1);
    for (const p of propsFor(m)) this.add.image(p.x * TILE, p.y * TILE, 'props_c', p.frame).setOrigin(0.5, 1).setScale(p.scale * K).setDepth(2 + p.y / m.height);
  }

  private label(y: number, str: string, color = '#e6e9f2', size = 12) {
    return this.add.text(0, y, str, { fontFamily: FONT, fontSize: `${size}px`, color, stroke: '#000000', strokeThickness: 3, fontStyle: size > 12 ? 'bold' : 'normal' }).setOrigin(0.5, 0);
  }
  private skull(y: number, size: number, color = '#ffffff') {
    return this.add.text(0, y, '☠', { fontFamily: FONT, fontSize: `${size}px`, color, stroke: '#000000', strokeThickness: 4 }).setOrigin(0.5);
  }
  private creature(cont: Phaser.GameObjects.Container, enemyId: string, height: number, color: number) {
    const k = artKey(this, `enemy_${enemyId}`);
    if (k) { const src = this.textures.get(k).getSourceImage() as { height: number }; cont.add(this.add.image(0, height * 0.45, k).setOrigin(0.5, 1).setScale(height / src.height)); }
    else cont.add(this.add.circle(0, 0, height * 0.3, color));
  }
  private prop(cont: Phaser.GameObjects.Container, frame: string, scale: number, y = 14 * K, fallback: () => Phaser.GameObjects.GameObject[]) {
    if (this.hasArt) cont.add(this.add.image(0, y, 'props_c', frame).setOrigin(0.5, 1).setScale(scale * K));
    else cont.add(fallback());
  }

  /** The marker for a node, in its current state. Redrawn when the state changes. */
  private drawNode(n: MapNode) {
    this.markers.get(n.id)?.destroy();
    this.rings.get(n.id)?.destroy();
    const s = this.session;
    const c = this.centre(n.pos);
    const ring = this.add.circle(c.x, c.y + TILE * 0.18, TILE * 0.42).setStrokeStyle(3, 0xffffff, 0.75).setDepth(3).setVisible(false);
    this.rings.set(n.id, ring);
    const cont = this.add.container(c.x, c.y).setDepth(5);
    const cleared = isCleared(s, n);
    const names = [n.enemyId, ...(n.extra ?? [])].filter((id): id is string => !!id).map((id) => getEnemy(id).name);
    switch (n.kind) {
      case 'start': {
        this.prop(cont, 'campfire', 0.4, 14 * K, () => [this.add.circle(0, 0, 10 * K, 0xff8c42)]);
        if (s.screenIndex === 0 || currentQuest(s)) {
          cont.add(this.add.rectangle(TILE * 0.45, 2, 20 * K, 30 * K, 0x7a5c3a).setStrokeStyle(2, 0xc9a227));
          this.giverMark = this.add.text(TILE * 0.45, -26 * K, '', { fontFamily: FONT, fontSize: '24px', color: '#c9a227', fontStyle: 'bold', stroke: '#000000', strokeThickness: 3 }).setOrigin(0.5);
          cont.add(this.giverMark);
        }
        cont.add(this.label(20 * K, currentQuest(s)?.giver.name ?? 'camp', '#e0c060'));
        break;
      }
      case 'quest': case 'lost': {
        cont.add(this.add.circle(0, -2, 15 * K, cleared ? 0x3a4260 : 0xc9a227).setStrokeStyle(2, 0x000000, 0.6));
        cont.add(this.add.text(0, -2, '?', { fontFamily: FONT, fontSize: `${20 * K}px`, color: cleared ? '#8b93a7' : '#1a1200', fontStyle: 'bold' }).setOrigin(0.5));
        cont.add(this.label(16 * K, n.kind === 'lost' ? 'a voice' : 'someone', cleared ? '#8b93a7' : '#e0c060'));
        break;
      }
      case 'shop': this.prop(cont, 'tent', 0.5, 14 * K, () => [this.add.rectangle(0, 2, 34 * K, 30 * K, 0x7a3fb9)]); cont.add(this.label(20 * K, 'shop')); break;
      case 'treasure': this.prop(cont, 'chest', 0.4, 14 * K, () => [this.add.rectangle(0, 4, 30 * K, 20 * K, 0xc9a227)]); cont.add(this.label(20 * K, cleared ? 'emptied' : 'treasure', cleared ? '#8b93a7' : '#ffd166')); if (cleared) cont.setAlpha(0.45); break;
      case 'shrine': this.prop(cont, 'tower', 0.5, 18 * K, () => [this.add.rectangle(0, 0, 26 * K, 26 * K, 0x7dd3fc).setAngle(45)]); cont.add(this.label(20 * K, cleared ? 'shrine, faded' : 'shrine', cleared ? '#8b93a7' : '#bfe8ff')); if (cleared) cont.setAlpha(0.45); break;
      case 'monster': case 'unknown': case 'elite': case 'boss': {
        if (cleared) { this.prop(cont, 'skeleton', 0.4, 10 * K, () => [this.add.circle(0, 0, 6 * K, 0x8b93a7)]); cont.setAlpha(0.7); break; }
        if (n.kind === 'unknown' && !n.seen) {
          cont.add(this.add.text(-6 * K, -4 * K, '?', { fontFamily: FONT, fontSize: `${30 * K}px`, color: '#e6e9f2', fontStyle: 'bold', stroke: '#000000', strokeThickness: 5 }).setOrigin(0.5));
          cont.add(this.skull(10 * K, 16 * K, '#ffb4b4').setX(10 * K));
          cont.add(this.label(18 * K, 'something', '#ffb4b4'));
          break;
        }
        const h = n.kind === 'boss' ? TILE * 1.6 : n.kind === 'elite' ? TILE * 1.15 : TILE * 1.05;
        if (n.extra?.length) { const before = cont.length; this.creature(cont, n.extra[0]!, h * 0.85, 0xd64545); for (const o of cont.list.slice(before)) (o as Phaser.GameObjects.Image).x += TILE * 0.28; }
        this.creature(cont, n.enemyId!, h, n.kind === 'boss' ? COLORS.boss : 0xd64545);
        if (n.kind === 'elite') cont.add(this.skull(-h * 0.62, 26 * K, '#e0b4ff'));
        if (n.kind === 'boss') cont.add(this.skull(-h * 0.6, 40 * K, '#e0b4ff'));
        cont.add(this.label(h * 0.5, n.kind === 'boss' ? getEnemy(s.map.bossId).name : names.join(' & '), n.kind === 'monster' ? '#ffb4b4' : '#e0b4ff', n.kind === 'boss' ? 13 : 12));
        break;
      }
    }
    // The hit area: a generous disc so a thumb can take it. Container hit shapes are placed from the
    // top-left of the container's size, so the circle's centre is half the size in.
    cont.setSize(TILE * 1.2, TILE * 1.2).setInteractive(new Phaser.Geom.Circle(TILE * 0.6, TILE * 0.6, TILE * 0.6), Phaser.Geom.Circle.Contains);
    cont.on('pointerup', () => void this.onTapNode(n.id));
    this.markers.set(n.id, cont);
  }

  private drawGhost() {
    const s = this.session;
    this.ghostSprite?.destroy(); this.ghostSprite = null;
    const ghost = ghostOn(getMeta(this), s.screenIndex);
    if (!ghost || s.testMode || !ghost.nodeId || s.clearedNodes.has(ghost.nodeId)) return;
    const gc = this.centre(nodeById(s, ghost.nodeId).pos);
    const cont = this.add.container(gc.x + TILE * 0.55, gc.y - TILE * 0.25).setDepth(5);
    const hk = artKey(this, `hero_${ghost.classId}`);
    if (hk) { const src = this.textures.get(hk).getSourceImage() as { height: number }; cont.add(this.add.image(0, TILE * 0.42, hk).setOrigin(0.5, 1).setScale((TILE * 1.1) / src.height).setTint(0x8fb4ff).setAlpha(0.55)); }
    else cont.add(this.add.rectangle(0, 0, 26 * K, 38 * K, 0x8fb4ff, 0.5));
    cont.add(this.label(22 * K, 'your ghost', '#b8ccff'));
    this.tweens.add({ targets: cont, y: cont.y - 6, duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    this.ghostSprite = cont;
  }

  private drawPlayer() {
    const c = this.centre(this.session.playerPos);
    const k = artKey(this, `hero_${this.session.classId}`);
    if (k) { const src = this.textures.get(k).getSourceImage() as { height: number }; this.player = this.add.image(c.x, c.y + TILE * 0.42, k).setOrigin(0.5, 1).setScale((TILE * 1.25) / src.height).setDepth(6); }
    else this.player = this.add.rectangle(c.x, c.y, 26 * K, 38 * K, CLASS_COLORS[this.session.classId] ?? COLORS.player).setStrokeStyle(2, 0xffffff, 0.6).setDepth(6);
    if (isEscorting(this.session)) this.follower = this.add.rectangle(c.x - 22 * K, c.y + 6 * K, 18 * K, 26 * K, 0x9fb3c8).setStrokeStyle(2, 0xffffff, 0.6).setDepth(6);
  }
  private playerPosFor(t: Tile) { const c = this.centre(t); return { x: c.x, y: this.player instanceof Phaser.GameObjects.Image ? c.y + TILE * 0.42 : c.y }; }

  /** Rings under the nodes you can travel to from here. */
  private syncRings() {
    const open = new Set(reachableNodes(this.session).map((n) => n.id));
    for (const [id, r] of this.rings) {
      const on = open.has(id) && !this.locked;
      r.setVisible(on);
      this.tweens.killTweensOf(r);
      if (on) { r.setAlpha(0.9); this.tweens.add({ targets: r, alpha: 0.35, duration: 800, yoyo: true, repeat: -1, ease: 'Sine.InOut' }); }
    }
  }

  private syncQuestHud() {
    const q = currentQuest(this.session);
    if (!q) { this.questText.setText(''); this.giverMark?.setText('?'); return; }
    const ready = questReady(q, this.session.deck, this.session.equipment);
    this.giverMark?.setText(q.status === 'offered' ? '!' : q.status === 'active' ? (ready ? '✓' : '…') : q.status === 'declined' ? '?' : '');
    this.questText.setText(q.status === 'active' ? `Quest: ${questProgress(q, this.session.deck, this.session.equipment)}` : q.status === 'offered' ? `${q.giver.name} has work for you, back at the start.` : '');
  }

  private buildHud() {
    const { width: W, height: H } = this.scale.gameSize;
    const s = this.session;
    const hud = this.add.container(0, 0).setDepth(100).setScrollFactor(0);
    hud.add(this.add.rectangle(W / 2, 26, W, 52, 0x000000, 0.72).setOrigin(0.5));
    hud.add(this.add.text(16, 12, s.classId.toUpperCase(), { fontFamily: FONT, fontSize: '13px', color: COLORS.text, fontStyle: 'bold' }).setOrigin(0, 0));
    hud.add(this.add.rectangle(16, 36, 160, 10, COLORS.hpBack).setOrigin(0, 0.5));
    this.hpFill = this.add.rectangle(16, 36, 160, 10, COLORS.hp).setOrigin(0, 0.5);
    hud.add(this.hpFill);
    this.hpText = this.add.text(182, 36, '', { fontFamily: FONT, fontSize: '13px', color: COLORS.muted }).setOrigin(0, 0.5);
    hud.add(this.hpText);
    hud.add(this.add.text(W / 2, 14, `Screen ${s.screenIndex + 1} of ${SCREEN_COUNT}`, { fontFamily: FONT, fontSize: '14px', color: COLORS.text, fontStyle: 'bold' }).setOrigin(0.5, 0));
    hud.add(this.add.text(W / 2, 34, `seed ${s.seed}`, text.mono).setOrigin(0.5, 0));
    this.goldText = this.add.text(W - 60, 26, '', { fontFamily: FONT, fontSize: '15px', color: COLORS.gold, fontStyle: 'bold' }).setOrigin(1, 0.5);
    hud.add(this.goldText);
    const pts = getMeta(this).progress[s.classId]?.points ?? 0;
    if (pts > 0 && !s.testMode) {
      const t = this.add.text(W - 60, 44, `★ ${pts} skill point${pts === 1 ? '' : 's'} · tap to spend`, { fontFamily: FONT, fontSize: '12px', color: '#8ff0b8', fontStyle: 'bold', backgroundColor: '#0b0f1acc', padding: { x: 6, y: 3 } }).setOrigin(1, 0.5).setScrollFactor(0).setDepth(101).setInteractive({ useHandCursor: true });
      t.on('pointerup', () => { void persistRun(this); this.scene.start('SkillTree', { classId: s.classId, returnTo: 'Overworld' }); });
    }
    const quitBg = this.add.rectangle(W - 24, 26, 32, 32, COLORS.panel).setStrokeStyle(2, COLORS.panelEdge).setScrollFactor(0).setDepth(101).setInteractive({ useHandCursor: true });
    this.add.text(W - 24, 26, '✕', { fontFamily: FONT, fontSize: '14px', color: COLORS.text, fontStyle: 'bold' }).setOrigin(0.5).setScrollFactor(0).setDepth(102);
    quitBg.on('pointerup', () => this.quit());
    this.questText = this.add.text(W / 2, H - 10, '', { fontFamily: FONT, fontSize: '13px', color: COLORS.gold, backgroundColor: '#000000aa', padding: { x: 8, y: 4 } }).setOrigin(0.5, 1).setScrollFactor(0).setDepth(101);
    this.toastText = this.add.text(W / 2, 74, '', { fontFamily: FONT, fontSize: '15px', color: COLORS.text, backgroundColor: '#000000aa', padding: { x: 10, y: 6 }, wordWrap: { width: W - 80 }, align: 'center' }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(101).setAlpha(0);
    this.syncHud();
    this.syncQuestHud();
  }

  private syncHud() {
    const s = this.session;
    this.hpFill.displayWidth = 160 * Math.max(0, s.hp / s.stats.maxHp);
    this.hpFill.setFillStyle(s.hp / s.stats.maxHp <= 0.3 ? COLORS.hpLow : COLORS.hp);
    this.hpText.setText(`${s.hp}/${s.stats.maxHp}`);
    this.goldText.setText(`${s.gold} g`);
  }

  private async toast(msg: string, ms = 1400) {
    this.toastText.setText(msg).setAlpha(1);
    await wait(this, ms);
    await tween(this, { targets: this.toastText, alpha: 0, duration: 250 });
  }

  // ---------------------------------------------------------------- travel

  private async onTapNode(id: string) {
    if (this.locked) return;
    const s = this.session;
    if (currentNode(s).id === id) { await this.enterNode(currentNode(s)); return; }
    const route = routeTo(s, id);
    if (!route) { void this.toast('No open road there yet.', 900); return; }
    this.locked = true;
    this.syncRings();
    let from = currentNode(s);
    for (const n of route) {
      await this.walkLeg(from.pos, n.pos);
      s.playerPos = { ...n.pos };
      from = n;
    }
    this.locked = false;
    await this.enterNode(from);
  }

  /** Walk the road between two linked nodes, tile by tile. */
  private async walkLeg(a: Tile, b: Tile) {
    const path = roadBetween(this.session.map, a, b);
    for (const t of path) {
      const c = this.playerPosFor(t);
      const prev = { x: this.player.x, y: this.player.y };
      if (this.player instanceof Phaser.GameObjects.Image) this.player.setFlipX(c.x < prev.x);
      this.tweens.add({ targets: this.player, scaleY: this.player.scaleY * 0.94, duration: STEP_MS / 2, yoyo: true, ease: 'Sine.InOut' });
      await tween(this, { targets: this.player, x: c.x, y: c.y, duration: STEP_MS, ease: 'Linear' });
      if (this.follower) void tween(this, { targets: this.follower, x: prev.x, y: prev.y + 6, duration: STEP_MS, ease: 'Linear' });
    }
  }

  /** Arriving at a node runs its task. Cleared nodes are quiet places you can stand in. */
  private async enterNode(n: MapNode) {
    const s = this.session, meta = getMeta(this);
    this.locked = true;
    this.syncRings();
    const done = async () => { s.clearedNodes.add(n.id); this.drawNode(n); await persistRun(this); this.locked = false; this.syncRings(); this.syncHud(); };
    switch (n.kind) {
      case 'start': {
        const q = currentQuest(s);
        if (s.screenIndex === 0) { const r = await openDialogue(this, s, meta, 'giver:wren'); if (r?.notes.length) void persistMeta(this); }
        s.clearedNodes.add(n.id);
        if (q) { await persistRun(this); this.scene.start('Quest', { questId: q.id }); return; }
        await done(); return;
      }
      case 'quest': {
        const r = await openDialogue(this, s, meta, 'node:quest');
        if (r?.notes.length) { void persistMeta(this); void this.toast(r.notes.join('  ·  '), 1800); }
        if (r?.rearmed) { const re = nodeById(s, r.rearmed); this.drawNode(re); this.drawGhost(); }
        await done(); return;
      }
      case 'lost': {
        const q = currentQuest(s);
        const r = await openDialogue(this, s, meta, 'node:lost');
        void r;
        if (q?.escort && q.status === 'active' && !q.escort.following) {
          q.escort.following = true;
          const c = this.centre(n.pos);
          this.follower = this.add.rectangle(c.x - 22 * K, c.y + 6 * K, 18 * K, 26 * K, 0x9fb3c8).setStrokeStyle(2, 0xffffff, 0.6).setDepth(6);
          this.syncQuestHud();
          void this.toast(`${q.escort.name} follows you. Back to ${q.giver.name}.`, 2200);
        }
        await done(); return;
      }
      case 'shop': { s.clearedNodes.add(n.id); await persistRun(this); this.scene.start('Shop'); return; }
      case 'treasure': {
        if (isCleared(s, n)) { this.locked = false; this.syncRings(); return; }
        s.clearedNodes.add(n.id);
        this.drawNode(n);
        s.pendingOffer = { source: 'chest', gold: treasureGold(s, n) };
        await persistRun(this); this.scene.start('Reward'); return;
      }
      case 'shrine': {
        if (isCleared(s, n)) { void this.toast('The shrine is dark now.', 900); this.locked = false; this.syncRings(); return; }
        s.hp = s.stats.maxHp;
        void this.toast('Shrine: fully healed. It fades.');
        await done(); return;
      }
      default: {
        if (isCleared(s, n)) { this.locked = false; this.syncRings(); return; }
        if (n.kind === 'unknown' && !n.seen) { n.seen = true; this.drawNode(n); await wait(this, 350); }
        await this.encounterWithWords(nodeEncounter(s, n), n);
      }
    }
  }

  /**
   * Every fight opens with words (DECISIONS #35): the species' dialogue, or the gate's. An option may
   * end it without a fight, in which case the clearing is simply yours.
   */
  private async encounterWithWords(e: PendingEncounter, node: MapNode) {
    const s = this.session, meta = getMeta(this);
    let trigger = e.kind === 'boss' ? `gate:${e.enemyId}` : `pre_fight:${e.enemyId}`;
    // A clearing a quest re-armed: the brother, whatever the species.
    if (e.kind === 'node' && s.flags.has('rearmed') && s.flags.has('tinker_quest') && !s.flags.has('tinker_fight_won') && node.id === s.lastClearedNode) trigger = 'pre_fight:brother';
    // Wren takes Andre's place at the gate when the rats have been avenged enough (DECISIONS #36).
    if (e.kind === 'boss' && s.screenIndex === 0 && (meta.relations.wren ?? 0) <= WREN_GRUDGE && !s.testMode) {
      const w = s.equipment.weapon;
      e = { ...e, enemyId: 'wren', custom: [wrenBoss(w?.name ?? null, w ? w.mods.reduce((a, m) => a + (m.stat?.atk ?? 0), 0) : 0)] };
      trigger = 'gate:wren';
    }
    // Your ghost joins the fight it fell in, in the rear partner's place.
    const ghost = ghostOn(meta, s.screenIndex);
    if (ghost && !s.testMode && e.kind !== 'boss' && ghost.nodeId === node.id) {
      e = { ...e, extra: undefined, custom: [getEnemy(e.enemyId), ghostDef(ghost)], ghost: true };
      trigger = 'pre_fight:ghost';
    }
    const firstTome = ghost?.deck.find((id) => getSkill(id).rarity !== 'basic');
    const r = await openDialogue(this, s, meta, trigger, { species: getEnemy(e.enemyId).name.toLowerCase(), weapon: s.equipment.weapon?.name ?? 'fists', killer: ghost?.killerName ?? '', ghostClass: ghost?.classId ?? '', ghostCard: firstTome ? getSkill(firstTome).name : 'nothing' });
    if (r?.notes.length) { void persistMeta(this); void this.toast(r.notes.join('  ·  '), 1800); this.syncHud(); }
    if (r && r.skip && !r.fight) {
      s.clearedNodes.add(node.id);
      this.drawNode(node);
      await persistRun(this);
      this.locked = false; this.syncRings();
      return;
    }
    const pp = s.playerPos;
    s.pendingEncounter = { ...e, tile: s.map.tiles[pp.y * s.map.width + pp.x] };
    const name = e.custom ? e.custom.map((d) => d.name).join(' & ') : [e.enemyId, ...(e.extra ?? [])].map((id) => getEnemy(id).name).join(' & ');
    void this.toast(e.kind === 'boss' ? `${name} awaits` : node.kind === 'elite' ? `${name} hold the clearing` : `${name}`, 600);
    this.cameras.main.flash(180, 255, 255, 255);
    await wait(this, 450);
    this.scene.start('Combat');
  }

  // ---------------------------------------------------------------- results

  private async applyLastResult() {
    const s = this.session;
    const r = s.lastResult;
    if (!r) return;
    s.lastResult = null;
    if (!r.won) return; // death is handled in the combat scene
    const killed = r.encounter.custom ? r.encounter.custom.map((d) => d.id) : [r.encounter.enemyId, ...(r.encounter.extra ?? [])];
    // Wren's rats (DECISIONS #35): every pack killed on her screen costs standing, double if you promised.
    const rats = killed.filter((id) => id === 'rat_pack').length;
    if (rats && s.screenIndex === 0) {
      const v = nudgeRelation(getMeta(this), 'wren', -rats * (s.flags.has('rats_promise') ? 2 : 1));
      void persistMeta(this);
      void this.toast(v <= -2 ? 'Somewhere, Wren feels it. She will not forget.' : 'Somewhere, Wren feels it.', 2000);
    }
    if (killed.map((id) => noteKill(s.quests, id)).some(Boolean)) {
      const q = currentQuest(s);
      if (q?.hunt) void this.toast(`Hunt: ${q.hunt.name} ${Math.min(q.hunt.have, q.hunt.need)} / ${q.hunt.need}${q.hunt.have >= q.hunt.need ? ' — return to ' + q.giver.name : ''}`, 2200);
      this.syncQuestHud();
    }
    if (r.encounter.kind === 'node' && r.encounter.nodeId) {
      const n = nodeById(s, r.encounter.nodeId);
      s.clearedNodes.add(n.id);
      if (isFightNode(n)) s.lastClearedNode = n.id;
      if (s.flags.has('rearmed') && s.flags.has('tinker_quest') && !s.flags.has('tinker_fight_won')) s.flags.add('tinker_fight_won');
      this.drawNode(n);
      this.drawGhost();
      void this.toast('The clearing is yours.');
    } else if (r.encounter.kind === 'boss') {
      s.bossDefeated = true;
      if (r.encounter.nodeId) s.clearedNodes.add(r.encounter.nodeId);
      s.hp = s.stats.maxHp;
      const bn = (s.map.nodes ?? []).find((n) => n.kind === 'boss');
      if (bn) this.drawNode(bn);
      this.syncHud();
      await this.screenCleared();
    }
  }

  private async screenCleared() {
    this.locked = true;
    const { width: W, height: H } = this.scale.gameSize;
    const s = this.session;
    const last = s.screenIndex + 1 >= SCREEN_COUNT;
    await wait(this, 80);
    const cam = this.cameras.main;
    cam.stopFollow();
    const cx = cam.scrollX + W / 2, top = cam.scrollY;
    this.add.rectangle(cx, top + H / 2, W, H, 0x000000, 0.65).setDepth(120);
    this.add.text(cx, top + H * 0.36, last ? 'You win!' : `Screen ${s.screenIndex + 1} cleared`, { ...text.title, color: COLORS.gold }).setOrigin(0.5).setDepth(121);
    this.add.text(cx, top + H * 0.36 + 48, last ? `Both screens cleared with ${s.encountersWon} fights won. Seed ${s.seed}.` : 'Fully healed. The next screen is harder.', text.body).setOrigin(0.5).setDepth(121);
    new Button(this, cx, top + H * 0.64, last ? 'Continue' : 'Onward', () => {
      if (last) {
        recordWin(getMeta(this), SCREEN_COUNT, s.classId);
        if (!s.testMode) gainExp(getMeta(this), s.classId, WIN_EXP); // the win bonus (DECISIONS #32)
        void Promise.all([persistMeta(this), getStore(this).clearRun()]).then(() => this.scene.start('RunEnd', { won: true }));
        return;
      }
      startScreen(s, s.screenIndex + 1, getMeta(this));
      void persistRun(this).then(() => this.scene.restart());
    }, { width: 220, fill: 0x1f2a44, edge: COLORS.goldHex }).setDepth(122);
  }

  private quit() {
    void persistRun(this).then(() => { setSession(this, null); this.scene.start('Title'); });
  }
}
void key;

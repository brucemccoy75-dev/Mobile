import Phaser from 'phaser';
import { getEnemy } from '@data/index';
import { findPath, stepThreat, key, tileAt, type Tile, type TileType } from '@core/map';
import { SCREEN_COUNT, currentQuest, getMeta, getSession, getStore, isEscorting, persistMeta, persistRun, randomEnemy, setSession, startScreen, type PendingEncounter, type RunSession } from '@game/session';
import { ESCORT_THREAT_MULT, noteKill, questProgress, questReady } from '@core/quest';
import { recordWin } from '@core/meta';
import { Button } from '@game/ui/Button';
import { CLASS_COLORS, COLORS, FONT, text } from '@game/ui/theme';
import { tween, wait } from '@game/ui/tween';
import { GROUND_COLS, groundIndices, propsFor } from '@game/tiles';
import { ensureRun } from '@game/telemetry';

export const TILE = 48;

const TILE_FILL: Record<TileType, number> = {
  grass: 0x3b6d3a, forest: 0x244d2a, swamp: 0x4a5b3a, water: 0x2b5d8a, rock: 0x4a4f5a, road: 0xb8a06a, arena: 0x5a2b3a,
};

/**
 * Top-down overworld (ARCHITECTURE §4–6). Tap a tile to walk there along the
 * cheapest path; every step feeds the threat meter; guards, chests, shop,
 * shrine and the boss are walked onto. Combat is a separate scene; results
 * come back through the session.
 */
export class OverworldScene extends Phaser.Scene {
  private session!: RunSession;
  private player!: Phaser.GameObjects.Rectangle;
  private pathGfx!: Phaser.GameObjects.Graphics;
  private guardSprites = new Map<string, Phaser.GameObjects.Container>();
  private poiSprites = new Map<string, Phaser.GameObjects.Container>();
  private bossSprite!: Phaser.GameObjects.Container;
  private giverSprite!: Phaser.GameObjects.Container;
  private giverMark!: Phaser.GameObjects.Text;
  private npcSprite: Phaser.GameObjects.Container | null = null;
  private follower: Phaser.GameObjects.Rectangle | null = null;
  private questText!: Phaser.GameObjects.Text;
  private hpText!: Phaser.GameObjects.Text;
  private hpFill!: Phaser.GameObjects.Rectangle;
  private threatFill!: Phaser.GameObjects.Rectangle;
  private goldText!: Phaser.GameObjects.Text;
  private toastText!: Phaser.GameObjects.Text;
  private walking = false;
  private retarget: Tile | null = null;
  private locked = false;

  constructor() { super('Overworld'); }

  create() {
    // Scene objects are reused by Phaser; never trust field initialisers here.
    this.locked = false;
    this.walking = false;
    this.retarget = null;
    this.guardSprites.clear();
    this.poiSprites.clear();
    ensureRun(this, getSession(this), getMeta(this));
    this.npcSprite = null;
    this.follower = null;

    this.session = getSession(this);
    const m = this.session.map;

    this.cameras.main.setBounds(0, 0, m.width * TILE, m.height * TILE);
    this.cameras.main.setBackgroundColor(0x0b0f1a);
    this.drawTiles();
    this.drawPois();
    this.drawPlayer();
    this.buildHud();
    this.cameras.main.startFollow(this.player, true, 0.15, 0.15);
    this.cameras.main.fadeIn(250, 11, 15, 26);

    // Tap target: a zone under everything so UI on top wins the hit test.
    const zone = this.add.zone(0, 0, m.width * TILE, m.height * TILE).setOrigin(0).setInteractive().setDepth(0);
    zone.on('pointerup', (p: Phaser.Input.Pointer) => this.onTap(p));

    void this.applyLastResult().then(() => persistRun(this));
    const freshArrival = !this.session.lastResult && key(this.session.playerPos) === key(m.entry) && this.session.openedPois.size === 0 && this.session.defeatedGuards.size === 0;
    if (freshArrival) {
      const heir = this.session.heirloomName && this.session.screenIndex === 0 ? `Heirloom: ${this.session.heirloomName}.  ` : '';
      void this.toast(`${heir}Reach the boss in the east. Roads are safe; the wilds fill the threat meter. Guards hold the chests, shop and shrine.`, 4500);
    }
  }

  // ---------------------------------------------------------------- drawing

  private get hasArt() { return this.textures.exists('ground_c') && this.textures.exists('props_c'); }

  private drawTiles() {
    const m = this.session.map;
    if (this.hasArt) { this.drawArtTiles(); return; }
    const g = this.add.graphics().setDepth(1);
    for (let y = 0; y < m.height; y++) for (let x = 0; x < m.width; x++) {
      const t = m.tiles[y * m.width + x]!;
      const px = x * TILE, py = y * TILE;
      g.fillStyle(TILE_FILL[t], 1);
      g.fillRect(px, py, TILE, TILE);
      // cheap texture so tile types read at a glance
      switch (t) {
        case 'forest': g.fillStyle(0x1a3a20, 1); g.fillCircle(px + TILE / 2, py + TILE / 2 - 4, 14); g.fillStyle(0x3b2a1a, 1); g.fillRect(px + TILE / 2 - 3, py + TILE / 2 + 8, 6, 10); break;
        case 'swamp': g.fillStyle(0x3a4a2e, 1); g.fillCircle(px + 14, py + 16, 5); g.fillCircle(px + 32, py + 30, 7); break;
        case 'water': g.fillStyle(0x3f78a8, 1); g.fillRect(px + 6, py + 18, 20, 3); g.fillRect(px + 22, py + 32, 18, 3); break;
        case 'rock': g.fillStyle(0x5f6675, 1); g.fillRect(px + 8, py + 8, TILE - 16, TILE - 16); g.fillStyle(0x3a3f4a, 1); g.fillRect(px + 14, py + 14, 12, 12); break;
        case 'road': g.fillStyle(0xa58f5c, 1); g.fillRect(px + 10, py + 22, 8, 4); g.fillRect(px + 28, py + 12, 6, 4); break;
        case 'grass': g.fillStyle(0x447d42, 1); g.fillRect(px + 12, py + 30, 3, 6); g.fillRect(px + 30, py + 12, 3, 6); break;
        case 'arena': g.fillStyle(0x6e3646, 1); g.fillRect(px + 4, py + 4, TILE - 8, TILE - 8); break;
      }
    }
    g.lineStyle(1, 0x000000, 0.12);
    for (let x = 0; x <= m.width; x++) g.lineBetween(x * TILE, 0, x * TILE, m.height * TILE);
    for (let y = 0; y <= m.height; y++) g.lineBetween(0, y * TILE, m.width * TILE, y * TILE);
    this.pathGfx = this.add.graphics().setDepth(3);
  }

  /** Vector tileset + props (docs/ART.md). Sheet cells are 96 px, shown at half size so TILE stays 48. */
  private drawArtTiles() {
    const m = this.session.map;
    const idx = groundIndices(m);
    const data: number[][] = [];
    for (let y = 0; y < m.height; y++) data.push(idx.slice(y * m.width, (y + 1) * m.width));
    const tilemap = this.make.tilemap({ data, tileWidth: 96, tileHeight: 96 });
    const tileset = tilemap.addTilesetImage('ground', 'ground_c', 96, 96, 0, 0);
    if (tileset) tilemap.createLayer(0, tileset, 0, 0)?.setScale(TILE / 96).setDepth(1);
    for (const p of propsFor(m)) {
      // feet-anchored so a tree's trunk stays in its tile; drawn under actors, sorted by row
      this.add.image(p.x * TILE, p.y * TILE, 'props_c', p.frame).setOrigin(0.5, 1).setScale(p.scale).setDepth(2 + p.y / m.height);
    }
    this.pathGfx = this.add.graphics().setDepth(3);
  }

  private centre(t: Tile) { return { x: t.x * TILE + TILE / 2, y: t.y * TILE + TILE / 2 }; }

  private drawPois() {
    const m = this.session.map, s = this.session;
    for (const p of m.pois) {
      const c = this.centre(p.pos);
      const cont = this.add.container(c.x, c.y).setDepth(4);
      if (this.hasArt) {
        const frame = p.kind === 'chest' ? 'chest' : p.kind === 'shop' ? 'tent' : 'tower';
        cont.add(this.add.image(0, p.kind === 'shrine' ? 18 : 14, 'props_c', frame).setOrigin(0.5, 1).setScale(p.kind === 'chest' ? 0.4 : 0.5));
      } else if (p.kind === 'chest') {
        cont.add([this.add.rectangle(0, 4, 30, 20, 0xc9a227), this.add.rectangle(0, -7, 30, 8, 0xe0c060), this.add.rectangle(0, 4, 6, 8, 0x5a3a10)]);
      } else if (p.kind === 'shop') {
        cont.add([this.add.rectangle(0, 2, 34, 30, 0x7a3fb9), this.add.text(0, 2, '$', { fontFamily: FONT, fontSize: '20px', color: '#ffffff', fontStyle: 'bold' }).setOrigin(0.5)]);
      } else {
        cont.add([this.add.rectangle(0, 0, 26, 26, 0x7dd3fc).setAngle(45), this.add.rectangle(0, 0, 10, 10, 0xffffff).setAngle(45)]);
      }
      cont.add(this.add.text(0, 22, p.kind, { fontFamily: FONT, fontSize: '11px', color: '#e6e9f2' }).setOrigin(0.5, 0));
      if (s.openedPois.has(p.id) || s.usedShrines.has(p.id)) cont.setAlpha(0.35);
      this.poiSprites.set(p.id, cont);
    }
    for (const g of m.guards) {
      if (s.defeatedGuards.has(g.id)) continue;
      const c = this.centre(g.pos);
      const cont = this.add.container(c.x, c.y).setDepth(5);
      cont.add([this.add.circle(0, 0, 14, 0xd64545), this.add.text(0, 0, '!', { fontFamily: FONT, fontSize: '18px', color: '#ffffff', fontStyle: 'bold' }).setOrigin(0.5),
        this.add.text(0, 18, getEnemy(g.enemyId).name, { fontFamily: FONT, fontSize: '11px', color: '#ffb4b4' }).setOrigin(0.5, 0)]);
      this.guardSprites.set(g.id, cont);
    }
    const bc = this.centre(m.boss);
    this.bossSprite = this.add.container(bc.x, bc.y).setDepth(5);
    this.bossSprite.add([this.add.circle(0, 0, 26, COLORS.boss), this.add.text(0, 0, '☠', { fontFamily: FONT, fontSize: '26px', color: '#ffffff' }).setOrigin(0.5),
      this.add.text(0, 32, getEnemy(m.bossId).name, { fontFamily: FONT, fontSize: '12px', color: '#e0b4ff', fontStyle: 'bold' }).setOrigin(0.5, 0)]);
    if (s.bossDefeated) this.bossSprite.setAlpha(0.3);
    // quest giver, and the escort NPC while they are still out there
    const q = currentQuest(s);
    const gc = this.centre(m.questGiver);
    this.giverSprite = this.add.container(gc.x, gc.y).setDepth(5);
    if (this.hasArt) this.giverSprite.add(this.add.image(-22, 14, 'props_c', 'campfire').setOrigin(0.5, 1).setScale(0.4));
    this.giverSprite.add([this.add.rectangle(0, 2, 24, 34, 0x7a5c3a).setStrokeStyle(2, 0xc9a227), this.add.text(0, 24, q?.giver.name ?? 'stranger', { fontFamily: FONT, fontSize: '11px', color: '#e0c060' }).setOrigin(0.5, 0)]);
    this.giverMark = this.add.text(0, -30, '', { fontFamily: FONT, fontSize: '22px', color: '#c9a227', fontStyle: 'bold' }).setOrigin(0.5);
    this.giverSprite.add(this.giverMark);
    if (q?.escort && q.status === 'active' && !q.escort.following) {
      const nc = this.centre(q.escort.pos);
      this.npcSprite = this.add.container(nc.x, nc.y).setDepth(5);
      this.npcSprite.add([this.add.rectangle(0, 2, 22, 32, 0x9fb3c8).setStrokeStyle(2, 0xffffff, 0.6), this.add.text(0, 22, q.escort.name.split(' ')[0]!, { fontFamily: FONT, fontSize: '11px', color: '#dfe7f0' }).setOrigin(0.5, 0)]);
    }
    // entry marker
    const ec = this.centre(m.entry);
    this.add.text(ec.x, ec.y - 30, 'entry', { fontFamily: FONT, fontSize: '11px', color: '#8b93a7' }).setOrigin(0.5).setDepth(4);
  }

  private drawPlayer() {
    const c = this.centre(this.session.playerPos);
    this.player = this.add.rectangle(c.x, c.y, 26, 38, CLASS_COLORS[this.session.classId] ?? COLORS.player).setStrokeStyle(2, 0xffffff, 0.6).setDepth(6);
    if (isEscorting(this.session)) this.follower = this.add.rectangle(c.x - 22, c.y + 6, 18, 26, 0x9fb3c8).setStrokeStyle(2, 0xffffff, 0.6).setDepth(6);
  }

  private syncQuestHud() {
    const q = currentQuest(this.session);
    if (!q) { this.questText.setText(''); this.giverMark.setText('?'); return; }
    const ready = questReady(q, this.session.deck, this.session.equipment);
    this.giverMark.setText(q.status === 'offered' ? '!' : q.status === 'active' ? (ready ? '✓' : '…') : q.status === 'declined' ? '?' : '');
    this.questText.setText(q.status === 'active' ? `Quest: ${questProgress(q, this.session.deck, this.session.equipment)}` : q.status === 'offered' ? `${q.giver.name} has work for you (near the entry).` : '');
  }

  private buildHud() {
    const { width: W } = this.scale.gameSize;
    const hud = this.add.container(0, 0).setDepth(100).setScrollFactor(0);
    hud.add(this.add.rectangle(W / 2, 26, W, 52, 0x000000, 0.72).setOrigin(0.5));
    // HP
    hud.add(this.add.text(16, 12, this.session.classId.toUpperCase(), { fontFamily: FONT, fontSize: '13px', color: COLORS.text, fontStyle: 'bold' }).setOrigin(0, 0));
    hud.add(this.add.rectangle(16, 36, 160, 10, COLORS.hpBack).setOrigin(0, 0.5));
    this.hpFill = this.add.rectangle(16, 36, 160, 10, COLORS.hp).setOrigin(0, 0.5);
    hud.add(this.hpFill);
    this.hpText = this.add.text(182, 36, '', { fontFamily: FONT, fontSize: '13px', color: COLORS.muted }).setOrigin(0, 0.5);
    hud.add(this.hpText);
    // screen + seed
    hud.add(this.add.text(W / 2, 14, `Screen ${this.session.screenIndex + 1} of ${SCREEN_COUNT}`, { fontFamily: FONT, fontSize: '14px', color: COLORS.text, fontStyle: 'bold' }).setOrigin(0.5, 0));
    hud.add(this.add.text(W / 2, 34, `seed ${this.session.seed}`, text.mono).setOrigin(0.5, 0));
    // threat
    hud.add(this.add.text(W - 196, 12, 'THREAT', { fontFamily: FONT, fontSize: '12px', color: '#ff8c42', fontStyle: 'bold' }).setOrigin(0, 0));
    hud.add(this.add.rectangle(W - 196, 36, 150, 10, COLORS.hpBack).setOrigin(0, 0.5));
    this.threatFill = this.add.rectangle(W - 196, 36, 150, 10, 0xff8c42).setOrigin(0, 0.5); // full width first: displayWidth scales from it
    hud.add(this.threatFill);
    this.goldText = this.add.text(W - 240, 24, '', { fontFamily: FONT, fontSize: '13px', color: COLORS.gold, fontStyle: 'bold' }).setOrigin(1, 0.5);
    hud.add(this.goldText);
    // quit: a bare interactive rectangle, not a Button container (container children with scrollFactor 0 do not hit-test)
    const quitBg = this.add.rectangle(W - 24, 26, 32, 32, COLORS.panel).setStrokeStyle(2, COLORS.panelEdge).setScrollFactor(0).setDepth(101).setInteractive({ useHandCursor: true });
    this.add.text(W - 24, 26, '✕', { fontFamily: FONT, fontSize: '14px', color: COLORS.text, fontStyle: 'bold' }).setOrigin(0.5).setScrollFactor(0).setDepth(102);
    quitBg.on('pointerup', () => this.quit());
    // quest line (bottom)
    this.questText = this.add.text(W / 2, this.scale.gameSize.height - 10, '', { fontFamily: FONT, fontSize: '13px', color: COLORS.gold, backgroundColor: '#000000aa', padding: { x: 8, y: 4 } }).setOrigin(0.5, 1).setScrollFactor(0).setDepth(101);
    // toast
    this.toastText = this.add.text(W / 2, 74, '', { fontFamily: FONT, fontSize: '15px', color: COLORS.text, backgroundColor: '#000000aa', padding: { x: 10, y: 6 } }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(101).setAlpha(0);
    this.syncHud();
    this.syncQuestHud();
  }

  private syncHud() {
    const s = this.session;
    this.hpFill.displayWidth = 160 * Math.max(0, s.hp / s.stats.maxHp);
    this.hpFill.setFillStyle(s.hp / s.stats.maxHp <= 0.3 ? COLORS.hpLow : COLORS.hp);
    this.hpText.setText(`${s.hp}/${s.stats.maxHp}`);
    this.threatFill.displayWidth = 150 * Math.min(1, s.threat);
    this.goldText.setText(`${s.gold} g`);
  }

  private async toast(msg: string, ms = 1400) {
    this.toastText.setText(msg).setAlpha(1);
    await wait(this, ms);
    await tween(this, { targets: this.toastText, alpha: 0, duration: 250 });
  }

  // ---------------------------------------------------------------- input & movement

  private blockedSets() {
    const s = this.session;
    const guards = new Set<string>();
    for (const g of s.map.guards) if (!s.defeatedGuards.has(g.id)) guards.add(key(g.pos));
    if (!s.bossDefeated) guards.add(key(s.map.boss));
    return guards;
  }

  private onTap(p: Phaser.Input.Pointer) {
    if (this.locked) return;
    const target: Tile = { x: Math.floor(p.worldX / TILE), y: Math.floor(p.worldY / TILE) };
    if (this.walking) { this.retarget = target; return; }
    void this.walkTo(target);
  }

  private computePath(from: Tile, to: Tile): Tile[] | null {
    const obstacles = this.blockedSets();
    // Guards and the boss can be the destination (that's how you fight them) but never walked through.
    return findPath(this.session.map, from, to, { targetOnly: obstacles });
  }

  private drawPath(path: Tile[]) {
    this.pathGfx.clear();
    if (path.length === 0) return;
    this.pathGfx.lineStyle(3, 0xffffff, 0.55);
    const start = this.centre(this.session.playerPos);
    this.pathGfx.beginPath();
    this.pathGfx.moveTo(start.x, start.y);
    for (const t of path) { const c = this.centre(t); this.pathGfx.lineTo(c.x, c.y); }
    this.pathGfx.strokePath();
    const end = this.centre(path[path.length - 1]!);
    this.pathGfx.lineStyle(3, 0xffffff, 0.9);
    this.pathGfx.strokeCircle(end.x, end.y, 14);
  }

  private async walkTo(target: Tile) {
    const s = this.session;
    let path = this.computePath(s.playerPos, target);
    if (!path) { void this.toast("can't walk there", 700); return; }
    this.walking = true;
    this.drawPath(path);
    while (path.length > 0 && !this.locked) {
      if (this.retarget) {
        const nt = this.retarget; this.retarget = null;
        const np = this.computePath(s.playerPos, nt);
        if (np) { path = np; this.drawPath(path); } else { void this.toast("can't walk there", 700); }
        if (path.length === 0) break;
      }
      const next = path.shift()!;
      const c = this.centre(next);
      const prev = { x: this.player.x, y: this.player.y };
      await tween(this, { targets: this.player, x: c.x, y: c.y, duration: 110, ease: 'Linear' });
      if (this.follower) void tween(this, { targets: this.follower, x: prev.x, y: prev.y + 6, duration: 110, ease: 'Linear' });
      s.playerPos = next;
      this.drawPath(path);
      const stop = await this.onArrive(next);
      if (stop) break;
    }
    this.pathGfx.clear();
    this.walking = false;
  }

  /** Returns true when movement must stop (encounter or interaction). */
  private async onArrive(t: Tile): Promise<boolean> {
    const s = this.session, m = s.map;
    const k = key(t);

    // Quest giver and escort NPC are walked onto like POIs.
    const q = currentQuest(s);
    if (key(m.questGiver) === k && q) { this.locked = true; await persistRun(this); this.scene.start('Quest', { questId: q.id }); return true; }
    if (q?.escort && q.status === 'active' && !q.escort.following && key(q.escort.pos) === k) {
      q.escort.following = true;
      this.npcSprite?.destroy(); this.npcSprite = null;
      const c = this.centre(t);
      this.follower = this.add.rectangle(c.x - 22, c.y + 6, 18, 26, 0x9fb3c8).setStrokeStyle(2, 0xffffff, 0.6).setDepth(6);
      this.syncQuestHud();
      void persistRun(this);
      void this.toast(`${q.escort.name} follows you. Get back to ${q.giver.name}. The wilds will notice.`, 2600);
      return true;
    }

    const guard = m.guards.find((g) => key(g.pos) === k && !s.defeatedGuards.has(g.id));
    if (guard) { await this.startEncounter({ kind: 'guard', enemyId: guard.enemyId, guardId: guard.id }); return true; }
    if (key(m.boss) === k && !s.bossDefeated) { await this.startEncounter({ kind: 'boss', enemyId: m.bossId }); return true; }

    const poi = m.pois.find((p) => key(p.pos) === k);
    if (poi) {
      if (poi.kind === 'chest' && !s.openedPois.has(poi.id)) {
        s.openedPois.add(poi.id);
        this.poiSprites.get(poi.id)?.setAlpha(0.35);
        const gold = 10 + Math.round(poi.cost / 2) * (s.screenIndex + 1);
        s.pendingOffer = { source: 'chest', gold };
        this.locked = true;
        await persistRun(this);
        this.scene.start('Reward');
        return true;
      }
      if (poi.kind === 'shrine' && !s.usedShrines.has(poi.id)) {
        s.usedShrines.add(poi.id);
        s.hp = s.stats.maxHp;
        this.poiSprites.get(poi.id)?.setAlpha(0.35);
        this.syncHud();
        void this.toast('Shrine: fully healed. It fades.');
        void persistRun(this);
        return true;
      }
      if (poi.kind === 'shop') { this.locked = true; await persistRun(this); this.scene.start('Shop'); return true; }
    }

    // Plain tile: feed the threat meter.
    const tile = tileAt(m, t.x, t.y)!;
    const r = stepThreat(s.threat, tile, s.screenIndex, s.rng.stream('encounter'), isEscorting(s) ? ESCORT_THREAT_MULT : 1);
    s.threat = r.meter;
    this.syncHud();
    if (r.encounter) { await this.startEncounter({ kind: 'random', enemyId: randomEnemy(s) }); return true; }
    return false;
  }

  private async startEncounter(e: PendingEncounter) {
    this.locked = true;
    const pp = this.session.playerPos;
    this.session.pendingEncounter = { ...e, tile: tileAt(this.session.map, pp.x, pp.y) };
    const name = getEnemy(e.enemyId).name;
    void this.toast(e.kind === 'random' ? `Ambush! ${name}` : e.kind === 'guard' ? `${name} blocks the way` : `${name} awaits`, 600);
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
    if (noteKill(s.quests, r.encounter.enemyId)) {
      const q = currentQuest(s);
      if (q?.hunt) void this.toast(`Hunt: ${q.hunt.name} ${Math.min(q.hunt.have, q.hunt.need)} / ${q.hunt.need}${q.hunt.have >= q.hunt.need ? ' — return to ' + q.giver.name : ''}`, 2200);
      this.syncQuestHud();
    }
    if (r.encounter.kind === 'guard' && r.encounter.guardId) {
      s.defeatedGuards.add(r.encounter.guardId);
      this.guardSprites.get(r.encounter.guardId)?.destroy();
      void this.toast('The way is clear.');
    } else if (r.encounter.kind === 'boss') {
      s.bossDefeated = true;
      s.hp = s.stats.maxHp;
      this.bossSprite.setAlpha(0.3);
      this.syncHud();
      await this.screenCleared();
    }
  }

  private async screenCleared() {
    this.locked = true;
    const { width: W, height: H } = this.scale.gameSize;
    const s = this.session;
    const last = s.screenIndex + 1 >= SCREEN_COUNT;
    // Drawn in world space at the camera's current view: the camera is parked while locked,
    // and Button containers only hit-test reliably without scroll factors. The camera's
    // scroll is only settled after a frame has rendered, so wait one beat before reading it.
    await wait(this, 80);
    const cam = this.cameras.main;
    cam.stopFollow();
    const cx = cam.scrollX + W / 2, top = cam.scrollY;
    const dim = this.add.rectangle(cx, top + H / 2, W, H, 0x000000, 0.65).setDepth(120);
    const title = this.add.text(cx, top + H * 0.36, last ? 'You win!' : `Screen ${s.screenIndex + 1} cleared`, { ...text.title, color: COLORS.gold }).setOrigin(0.5).setDepth(121);
    const sub = this.add.text(cx, top + H * 0.36 + 48, last ? `Both screens cleared with ${s.encountersWon} fights won. Seed ${s.seed}.` : 'Fully healed. The next screen is harder.', text.body).setOrigin(0.5).setDepth(121);
    const btn = new Button(this, cx, top + H * 0.64, last ? 'Continue' : 'Onward', () => {
      if (last) {
        recordWin(getMeta(this), SCREEN_COUNT, s.classId);
        void Promise.all([persistMeta(this), getStore(this).clearRun()]).then(() => this.scene.start('RunEnd', { won: true }));
        return;
      }
      startScreen(s, s.screenIndex + 1, getMeta(this));
      void persistRun(this).then(() => this.scene.restart());
    }, { width: 220, fill: 0x1f2a44, edge: COLORS.goldHex });
    btn.setDepth(122);
    void dim; void title; void sub;
  }

  /** Leave to the title; the run stays saved and can be continued. */
  private quit() {
    void persistRun(this).then(() => { setSession(this, null); this.scene.start('Title'); });
  }
}

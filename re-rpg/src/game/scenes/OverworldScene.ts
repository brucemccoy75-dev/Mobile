import Phaser from 'phaser';
import { getEnemy, getSkill } from '@data/index';
import { findPath, stepThreat, key, tileAt, type MapNode, type Tile, type TileType } from '@core/map';
import { SCREEN_COUNT, SIGHT, currentQuest, getMeta, getSession, getStore, isDusk, isEscorting, nodeAt, nodeEncounter, persistMeta, persistRun, revealAround, rollEncounter, setSession, spendDaylight, startScreen, type PendingEncounter, type RunSession } from '@game/session';
import { ESCORT_THREAT_MULT, noteKill, questProgress, questReady } from '@core/quest';
import { gainExp, ghostOn, nudgeRelation, recordWin } from '@core/meta';
import { WREN_GRUDGE, ghostDef, wrenBoss } from '@core/variants';
import { openDialogue } from '@game/dialogue';
import { WIN_EXP } from '@data/progression';
import { artKey } from '@game/art';
import { Button } from '@game/ui/Button';
import { CLASS_COLORS, COLORS, FONT, text } from '@game/ui/theme';
import { tween, wait } from '@game/ui/tween';
import { groundIndices, propsFor } from '@game/tiles';
import { ensureRun } from '@game/telemetry';

/** World pixels per tile. 72 shows about 11×5 tiles on a phone: close enough to read the ground (DECISIONS #34). */
export const TILE = 72;
const K = TILE / 48; // prop and marker scale relative to the 48 px layout the art was packed for
const STEP_MS = 190;

const TILE_FILL: Record<TileType, number> = {
  grass: 0x3b6d3a, forest: 0x244d2a, swamp: 0x4a5b3a, water: 0x2b5d8a, rock: 0x4a4f5a, road: 0xb8a06a, arena: 0x5a2b3a,
};

/**
 * Top-down overworld (ARCHITECTURE §4–6, DECISIONS #34). Tap a seen tile to walk there along the
 * cheapest path. On authored maps fights live only at nodes, guards and the gate; steps spend
 * daylight, and dusk makes the remaining fights bolder. Fog hides what you have not walked near.
 * Procedural maps (the old threat meter) stay behind the map-mode toggle.
 */
export class OverworldScene extends Phaser.Scene {
  private session!: RunSession;
  private player!: Phaser.GameObjects.Rectangle | Phaser.GameObjects.Image;
  private pathGfx!: Phaser.GameObjects.Graphics;
  private guardSprites = new Map<string, Phaser.GameObjects.Container>();
  private poiSprites = new Map<string, Phaser.GameObjects.Container>();
  private nodeSprites = new Map<string, Phaser.GameObjects.Container>();
  private bossSprite!: Phaser.GameObjects.Container;
  private giverSprite!: Phaser.GameObjects.Container;
  private giverMark!: Phaser.GameObjects.Text;
  private npcSprite: Phaser.GameObjects.Container | null = null;
  private follower: Phaser.GameObjects.Rectangle | null = null;
  private fog: Phaser.GameObjects.Rectangle[] = [];
  private duskTint!: Phaser.GameObjects.Rectangle;
  private questText!: Phaser.GameObjects.Text;
  private hpText!: Phaser.GameObjects.Text;
  private hpFill!: Phaser.GameObjects.Rectangle;
  private meterLabel!: Phaser.GameObjects.Text;
  private meterFill!: Phaser.GameObjects.Rectangle;
  private meterText!: Phaser.GameObjects.Text;
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
    this.nodeSprites.clear();
    this.fog = [];
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
    this.drawFog();
    this.buildHud();
    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
    this.cameras.main.fadeIn(250, 11, 15, 26);

    // Tap target: a zone under everything so UI on top wins the hit test.
    const zone = this.add.zone(0, 0, m.width * TILE, m.height * TILE).setOrigin(0).setInteractive().setDepth(0);
    zone.on('pointerup', (p: Phaser.Input.Pointer) => this.onTap(p));

    void this.applyLastResult().then(() => persistRun(this));
    const freshArrival = !this.session.lastResult && key(this.session.playerPos) === key(m.entry) && this.session.openedPois.size === 0 && this.session.defeatedGuards.size === 0 && this.session.clearedNodes.size === 0;
    if (freshArrival) {
      const heir = this.session.heirloomName && this.session.screenIndex === 0 ? `Heirloom: ${this.session.heirloomName}.  ` : '';
      void this.toast(m.authored
        ? `${heir}The gate is east. Fights wait in the clearings; the roads between are safe. Daylight is short: wander, and dusk finds you.`
        : `${heir}Reach the boss in the east. Roads are safe; the wilds fill the threat meter. Guards hold the chests, shop and shrine.`, 5000);
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
      switch (t) {
        case 'forest': g.fillStyle(0x1a3a20, 1); g.fillCircle(px + TILE / 2, py + TILE / 2 - 4, 14 * K); g.fillStyle(0x3b2a1a, 1); g.fillRect(px + TILE / 2 - 3, py + TILE / 2 + 8, 6, 10); break;
        case 'swamp': g.fillStyle(0x3a4a2e, 1); g.fillCircle(px + 14 * K, py + 16 * K, 5 * K); g.fillCircle(px + 32 * K, py + 30 * K, 7 * K); break;
        case 'water': g.fillStyle(0x3f78a8, 1); g.fillRect(px + 6 * K, py + 18 * K, 20 * K, 3); g.fillRect(px + 22 * K, py + 32 * K, 18 * K, 3); break;
        case 'rock': g.fillStyle(0x5f6675, 1); g.fillRect(px + 8 * K, py + 8 * K, TILE - 16 * K, TILE - 16 * K); g.fillStyle(0x3a3f4a, 1); g.fillRect(px + 14 * K, py + 14 * K, 12 * K, 12 * K); break;
        case 'road': g.fillStyle(0xa58f5c, 1); g.fillRect(px + 10 * K, py + 22 * K, 8 * K, 4); g.fillRect(px + 28 * K, py + 12 * K, 6 * K, 4); break;
        case 'grass': g.fillStyle(0x447d42, 1); g.fillRect(px + 12 * K, py + 30 * K, 3, 6 * K); g.fillRect(px + 30 * K, py + 12 * K, 3, 6 * K); break;
        case 'arena': g.fillStyle(0x6e3646, 1); g.fillRect(px + 4, py + 4, TILE - 8, TILE - 8); break;
      }
    }
    this.pathGfx = this.add.graphics().setDepth(3);
  }

  /** Vector tileset + props (docs/ART.md). Sheet cells are 96 px, scaled to TILE. */
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
      this.add.image(p.x * TILE, p.y * TILE, 'props_c', p.frame).setOrigin(0.5, 1).setScale(p.scale * K).setDepth(2 + p.y / m.height);
    }
    for (const s of m.signposts ?? []) {
      const c = this.centre(s.pos);
      this.add.image(c.x + TILE * 0.3, c.y + TILE * 0.2, 'props_c', 'sign').setOrigin(0.5, 1).setScale(0.45 * K).setDepth(2 + s.pos.y / m.height);
    }
    this.pathGfx = this.add.graphics().setDepth(3);
  }

  private centre(t: Tile) { return { x: t.x * TILE + TILE / 2, y: t.y * TILE + TILE / 2 }; }

  /** A creature marker: its still when one exists, else a coloured disc with a letter. */
  private creatureMarker(cont: Phaser.GameObjects.Container, enemyId: string, height: number, fallback: { color: number; glyph: string; radius: number }) {
    const k = artKey(this, `enemy_${enemyId}`);
    if (k) {
      const src = this.textures.get(k).getSourceImage() as { height: number };
      cont.add(this.add.image(0, height * 0.45, k).setOrigin(0.5, 1).setScale(height / src.height));
    } else {
      cont.add([this.add.circle(0, 0, fallback.radius, fallback.color), this.add.text(0, 0, fallback.glyph, { fontFamily: FONT, fontSize: `${fallback.radius}px`, color: '#ffffff', fontStyle: 'bold' }).setOrigin(0.5)]);
    }
  }

  private drawPois() {
    const m = this.session.map, s = this.session;
    const label = (y: number, str: string, color = '#e6e9f2') => this.add.text(0, y, str, { fontFamily: FONT, fontSize: '12px', color, stroke: '#000000', strokeThickness: 3 }).setOrigin(0.5, 0);
    for (const p of m.pois) {
      const c = this.centre(p.pos);
      const cont = this.add.container(c.x, c.y).setDepth(4);
      if (this.hasArt) {
        const frame = p.kind === 'chest' ? 'chest' : p.kind === 'shop' ? 'tent' : 'tower';
        cont.add(this.add.image(0, (p.kind === 'shrine' ? 18 : 14) * K, 'props_c', frame).setOrigin(0.5, 1).setScale((p.kind === 'chest' ? 0.4 : 0.5) * K));
      } else if (p.kind === 'chest') {
        cont.add([this.add.rectangle(0, 4, 30 * K, 20 * K, 0xc9a227), this.add.rectangle(0, -7 * K, 30 * K, 8 * K, 0xe0c060), this.add.rectangle(0, 4, 6 * K, 8 * K, 0x5a3a10)]);
      } else if (p.kind === 'shop') {
        cont.add([this.add.rectangle(0, 2, 34 * K, 30 * K, 0x7a3fb9), this.add.text(0, 2, '$', { fontFamily: FONT, fontSize: '26px', color: '#ffffff', fontStyle: 'bold' }).setOrigin(0.5)]);
      } else {
        cont.add([this.add.rectangle(0, 0, 26 * K, 26 * K, 0x7dd3fc).setAngle(45), this.add.rectangle(0, 0, 10 * K, 10 * K, 0xffffff).setAngle(45)]);
      }
      cont.add(label(22 * K, p.kind));
      if (s.openedPois.has(p.id) || s.usedShrines.has(p.id)) cont.setAlpha(0.35);
      this.poiSprites.set(p.id, cont);
    }
    for (const g of m.guards) {
      if (s.defeatedGuards.has(g.id)) continue;
      const c = this.centre(g.pos);
      const cont = this.add.container(c.x, c.y).setDepth(5);
      this.creatureMarker(cont, g.enemyId, TILE * 1.05, { color: 0xd64545, glyph: '!', radius: 14 * K });
      cont.add(label(18 * K, getEnemy(g.enemyId).name, '#ffb4b4'));
      this.guardSprites.set(g.id, cont);
    }
    // Authored nodes: the fight that waits in each clearing, named so the lane's risk is readable.
    for (const n of m.nodes ?? []) {
      if (s.clearedNodes.has(n.id)) continue;
      const c = this.centre(n.pos);
      const cont = this.add.container(c.x, c.y).setDepth(5);
      const names = [n.enemyId, ...(n.extra ?? [])].map((id) => getEnemy(id).name);
      if (n.extra?.length) {
        // the rear partner peeks out behind the front one
        const before = cont.length;
        this.creatureMarker(cont, n.extra[0]!, TILE * 0.9, { color: 0xd64545, glyph: '!', radius: 11 * K });
        for (const o of cont.list.slice(before)) (o as Phaser.GameObjects.Image).x += TILE * 0.26;
      }
      this.creatureMarker(cont, n.enemyId, TILE * 1.05, { color: n.kind === 'elite' ? COLORS.boss : 0xd64545, glyph: n.kind === 'elite' ? '!!' : '!', radius: 14 * K });
      cont.add(label(18 * K, n.kind === 'elite' ? `${names.join(' & ')}` : names[0]!, n.kind === 'elite' ? '#e0b4ff' : '#ffb4b4'));
      if (n.kind === 'elite') cont.add(this.add.text(0, -TILE * 0.62, 'ELITE', { fontFamily: FONT, fontSize: '11px', color: '#e0b4ff', fontStyle: 'bold', stroke: '#000000', strokeThickness: 3 }).setOrigin(0.5));
      this.nodeSprites.set(n.id, cont);
    }
    const bc = this.centre(m.boss);
    this.bossSprite = this.add.container(bc.x, bc.y).setDepth(5);
    this.creatureMarker(this.bossSprite, m.bossId, TILE * 1.6, { color: COLORS.boss, glyph: '☠', radius: 26 * K });
    this.bossSprite.add(label(32 * K, getEnemy(m.bossId).name, '#e0b4ff'));
    if (s.bossDefeated) this.bossSprite.setAlpha(0.3);
    // Your ghost (DECISIONS #36): a pale copy of the hero where the last run died on this screen.
    const ghost = ghostOn(getMeta(this), s.screenIndex);
    if (ghost && !s.testMode && !(ghost.nodeId && s.clearedNodes.has(ghost.nodeId)) && !(ghost.guardId && s.defeatedGuards.has(ghost.guardId))) {
      const gc = this.centre(ghost.tile);
      const cont = this.add.container(gc.x + TILE * 0.5, gc.y - TILE * 0.2).setDepth(5);
      const hk = artKey(this, `hero_${ghost.classId}`);
      if (hk) { const src = this.textures.get(hk).getSourceImage() as { height: number }; cont.add(this.add.image(0, TILE * 0.42, hk).setOrigin(0.5, 1).setScale((TILE * 1.15) / src.height).setTint(0x8fb4ff).setAlpha(0.55)); }
      else cont.add(this.add.rectangle(0, 0, 26 * K, 38 * K, 0x8fb4ff, 0.5));
      cont.add(label(22 * K, 'your ghost', '#b8ccff'));
      this.tweens.add({ targets: cont, y: cont.y - 6, duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    }
    // quest giver, and the escort NPC while they are still out there
    const q = currentQuest(s);
    const gc = this.centre(m.questGiver);
    this.giverSprite = this.add.container(gc.x, gc.y).setDepth(5);
    if (this.hasArt) this.giverSprite.add(this.add.image(-22 * K, 14 * K, 'props_c', 'campfire').setOrigin(0.5, 1).setScale(0.4 * K));
    this.giverSprite.add([this.add.rectangle(0, 2, 24 * K, 34 * K, 0x7a5c3a).setStrokeStyle(2, 0xc9a227), label(24 * K, q?.giver.name ?? 'stranger', '#e0c060')]);
    this.giverMark = this.add.text(0, -30 * K, '', { fontFamily: FONT, fontSize: '26px', color: '#c9a227', fontStyle: 'bold', stroke: '#000000', strokeThickness: 3 }).setOrigin(0.5);
    this.giverSprite.add(this.giverMark);
    if (q?.escort && q.status === 'active' && !q.escort.following) {
      const nc = this.centre(q.escort.pos);
      this.npcSprite = this.add.container(nc.x, nc.y).setDepth(5);
      this.npcSprite.add([this.add.rectangle(0, 2, 22 * K, 32 * K, 0x9fb3c8).setStrokeStyle(2, 0xffffff, 0.6), label(22 * K, q.escort.name.split(' ')[0]!, '#dfe7f0')]);
    }
    // entry marker
    const ec = this.centre(m.entry);
    this.add.text(ec.x, ec.y - 30 * K, 'entry', { fontFamily: FONT, fontSize: '12px', color: '#8b93a7', stroke: '#000000', strokeThickness: 3 }).setOrigin(0.5).setDepth(4);
  }

  private drawPlayer() {
    const c = this.centre(this.session.playerPos);
    const k = artKey(this, `hero_${this.session.classId}`);
    if (k) {
      const src = this.textures.get(k).getSourceImage() as { height: number };
      this.player = this.add.image(c.x, c.y + TILE * 0.42, k).setOrigin(0.5, 1).setScale((TILE * 1.25) / src.height).setDepth(6);
    } else {
      this.player = this.add.rectangle(c.x, c.y, 26 * K, 38 * K, CLASS_COLORS[this.session.classId] ?? COLORS.player).setStrokeStyle(2, 0xffffff, 0.6).setDepth(6);
    }
    if (isEscorting(this.session)) this.follower = this.add.rectangle(c.x - 22 * K, c.y + 6 * K, 18 * K, 26 * K, 0x9fb3c8).setStrokeStyle(2, 0xffffff, 0.6).setDepth(6);
  }
  /** The player's feet-anchored sprite sits lower than the tile centre; this is where it belongs for a tile. */
  private playerPosFor(t: Tile) { const c = this.centre(t); return { x: c.x, y: this.player instanceof Phaser.GameObjects.Image ? c.y + TILE * 0.42 : c.y }; }

  /** Fog of war (DECISIONS #34): black over unseen tiles, a dim over tiles seen but out of sight now. */
  private drawFog() {
    const m = this.session.map;
    if (!m.authored) return;
    for (let y = 0; y < m.height; y++) for (let x = 0; x < m.width; x++) {
      this.fog.push(this.add.rectangle(x * TILE + TILE / 2, y * TILE + TILE / 2, TILE, TILE, 0x05070d).setDepth(40));
    }
    this.syncFog(false);
  }
  private syncFog(animate = true) {
    const m = this.session.map, s = this.session, p = s.playerPos;
    if (this.fog.length === 0) return;
    const dusk = isDusk(s);
    for (let y = 0; y < m.height; y++) for (let x = 0; x < m.width; x++) {
      const r = this.fog[y * m.width + x]!;
      const near = Math.abs(x - p.x) + Math.abs(y - p.y) <= SIGHT;
      const target = !s.seen.has(`${x},${y}`) ? 1 : near ? (dusk ? 0.15 : 0) : (dusk ? 0.6 : 0.42);
      if (!animate || Math.abs(r.alpha - target) < 0.01) r.setAlpha(target);
      else this.tweens.add({ targets: r, alpha: target, duration: 220 });
    }
  }

  private syncQuestHud() {
    const q = currentQuest(this.session);
    if (!q) { this.questText.setText(''); this.giverMark.setText('?'); return; }
    const ready = questReady(q, this.session.deck, this.session.equipment);
    this.giverMark.setText(q.status === 'offered' ? '!' : q.status === 'active' ? (ready ? '✓' : '…') : q.status === 'declined' ? '?' : '');
    this.questText.setText(q.status === 'active' ? `Quest: ${questProgress(q, this.session.deck, this.session.equipment)}` : q.status === 'offered' ? `${q.giver.name} has work for you (near the entry).` : '');
  }

  private buildHud() {
    const { width: W, height: H } = this.scale.gameSize;
    const s = this.session;
    const hud = this.add.container(0, 0).setDepth(100).setScrollFactor(0);
    hud.add(this.add.rectangle(W / 2, 26, W, 52, 0x000000, 0.72).setOrigin(0.5));
    // HP
    hud.add(this.add.text(16, 12, s.classId.toUpperCase(), { fontFamily: FONT, fontSize: '13px', color: COLORS.text, fontStyle: 'bold' }).setOrigin(0, 0));
    hud.add(this.add.rectangle(16, 36, 160, 10, COLORS.hpBack).setOrigin(0, 0.5));
    this.hpFill = this.add.rectangle(16, 36, 160, 10, COLORS.hp).setOrigin(0, 0.5);
    hud.add(this.hpFill);
    this.hpText = this.add.text(182, 36, '', { fontFamily: FONT, fontSize: '13px', color: COLORS.muted }).setOrigin(0, 0.5);
    hud.add(this.hpText);
    // screen + seed
    hud.add(this.add.text(W / 2, 14, `Screen ${s.screenIndex + 1} of ${SCREEN_COUNT}`, { fontFamily: FONT, fontSize: '14px', color: COLORS.text, fontStyle: 'bold' }).setOrigin(0.5, 0));
    hud.add(this.add.text(W / 2, 34, `seed ${s.seed}`, text.mono).setOrigin(0.5, 0));
    // daylight (authored) or threat (procedural)
    const authored = !!s.map.authored;
    this.meterLabel = this.add.text(W - 196, 12, authored ? 'DAYLIGHT' : 'THREAT', { fontFamily: FONT, fontSize: '12px', color: authored ? '#ffd166' : '#ff8c42', fontStyle: 'bold' }).setOrigin(0, 0);
    hud.add(this.meterLabel);
    hud.add(this.add.rectangle(W - 196, 36, 150, 10, COLORS.hpBack).setOrigin(0, 0.5));
    this.meterFill = this.add.rectangle(W - 196, 36, 150, 10, authored ? 0xffd166 : 0xff8c42).setOrigin(0, 0.5); // full width first: displayWidth scales from it
    hud.add(this.meterFill);
    this.meterText = this.add.text(W - 46, 12, '', { fontFamily: FONT, fontSize: '12px', color: COLORS.muted }).setOrigin(1, 0);
    hud.add(this.meterText);
    this.goldText = this.add.text(W - 240, 24, '', { fontFamily: FONT, fontSize: '13px', color: COLORS.gold, fontStyle: 'bold' }).setOrigin(1, 0.5);
    hud.add(this.goldText);
    // Dusk: the world goes blue. Drawn over the fog, under the HUD.
    this.duskTint = this.add.rectangle(W / 2, H / 2, W, H, 0x0a1440, 0.32).setScrollFactor(0).setDepth(60).setVisible(isDusk(s));
    // Unspent skill points: a bare interactive text (container children with scrollFactor 0 do not hit-test).
    const pts = getMeta(this).progress[s.classId]?.points ?? 0;
    if (pts > 0 && !s.testMode) {
      const t = this.add.text(W - 240, 44, `★ ${pts} skill point${pts === 1 ? '' : 's'} · tap to spend`, { fontFamily: FONT, fontSize: '12px', color: '#8ff0b8', fontStyle: 'bold', backgroundColor: '#0b0f1acc', padding: { x: 6, y: 3 } }).setOrigin(1, 0.5).setScrollFactor(0).setDepth(101).setInteractive({ useHandCursor: true });
      t.on('pointerup', () => { void persistRun(this); this.scene.start('SkillTree', { classId: s.classId, returnTo: 'Overworld' }); });
    }
    // quit: a bare interactive rectangle, not a Button container (container children with scrollFactor 0 do not hit-test)
    const quitBg = this.add.rectangle(W - 24, 26, 32, 32, COLORS.panel).setStrokeStyle(2, COLORS.panelEdge).setScrollFactor(0).setDepth(101).setInteractive({ useHandCursor: true });
    this.add.text(W - 24, 26, '✕', { fontFamily: FONT, fontSize: '14px', color: COLORS.text, fontStyle: 'bold' }).setOrigin(0.5).setScrollFactor(0).setDepth(102);
    quitBg.on('pointerup', () => this.quit());
    // quest line (bottom)
    this.questText = this.add.text(W / 2, H - 10, '', { fontFamily: FONT, fontSize: '13px', color: COLORS.gold, backgroundColor: '#000000aa', padding: { x: 8, y: 4 } }).setOrigin(0.5, 1).setScrollFactor(0).setDepth(101);
    // toast
    this.toastText = this.add.text(W / 2, 74, '', { fontFamily: FONT, fontSize: '15px', color: COLORS.text, backgroundColor: '#000000aa', padding: { x: 10, y: 6 }, wordWrap: { width: W - 80 }, align: 'center' }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(101).setAlpha(0);
    this.syncHud();
    this.syncQuestHud();
  }

  private syncHud() {
    const s = this.session;
    this.hpFill.displayWidth = 160 * Math.max(0, s.hp / s.stats.maxHp);
    this.hpFill.setFillStyle(s.hp / s.stats.maxHp <= 0.3 ? COLORS.hpLow : COLORS.hp);
    this.hpText.setText(`${s.hp}/${s.stats.maxHp}`);
    if (s.map.authored) {
      const frac = s.daylightMax > 0 ? s.daylight / s.daylightMax : 0;
      this.meterFill.displayWidth = 150 * Math.max(0, Math.min(1, frac));
      this.meterFill.setFillStyle(frac > 0.3 ? 0xffd166 : frac > 0 ? 0xff8c42 : 0x3b4a8a);
      this.meterLabel.setText(frac > 0 ? 'DAYLIGHT' : 'DUSK').setColor(frac > 0 ? '#ffd166' : '#9ab4ff');
      this.meterText.setText(frac > 0 ? `${s.daylight} steps` : 'the wilds are bold');
    } else {
      this.meterFill.displayWidth = 150 * Math.min(1, s.threat);
    }
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
    for (const n of s.map.nodes ?? []) if (!s.clearedNodes.has(n.id)) guards.add(key(n.pos));
    if (!s.bossDefeated) guards.add(key(s.map.boss));
    return guards;
  }

  private onTap(p: Phaser.Input.Pointer) {
    if (this.locked) return;
    const target: Tile = { x: Math.floor(p.worldX / TILE), y: Math.floor(p.worldY / TILE) };
    if (this.session.map.authored && !this.session.seen.has(key(target))) { void this.toast('You have not seen that far.', 700); return; }
    if (this.walking) { this.retarget = target; return; }
    void this.walkTo(target);
  }

  private computePath(from: Tile, to: Tile): Tile[] | null {
    const obstacles = this.blockedSets();
    // Guards, nodes and the boss can be the destination (that's how you fight them) but never walked through.
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
    this.pathGfx.strokeCircle(end.x, end.y, 14 * K);
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
      const c = this.playerPosFor(next);
      const prev = { x: this.player.x, y: this.player.y };
      if (this.player instanceof Phaser.GameObjects.Image) this.player.setFlipX(c.x < prev.x);
      // a small hop per step reads as walking without frames
      this.tweens.add({ targets: this.player, scaleY: this.player.scaleY * 0.94, duration: STEP_MS / 2, yoyo: true, ease: 'Sine.InOut' });
      await tween(this, { targets: this.player, x: c.x, y: c.y, duration: STEP_MS, ease: 'Linear' });
      if (this.follower) void tween(this, { targets: this.follower, x: prev.x - (this.player instanceof Phaser.GameObjects.Image ? 0 : 0), y: prev.y + 6, duration: STEP_MS, ease: 'Linear' });
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

    if (m.authored) {
      revealAround(s, t);
      this.syncFog();
      if (spendDaylight(s)) {
        this.duskTint.setVisible(true);
        this.syncFog();
        void this.toast('Dusk falls. The clearings ahead will not be fought alone, and the shrine goes dark.', 3200);
      }
      this.syncHud();
    }

    // Quest giver and escort NPC are walked onto like POIs.
    const q = currentQuest(s);
    if (key(m.questGiver) === k && q) {
      this.locked = true;
      if (m.authored && s.screenIndex === 0) { const r = await openDialogue(this, s, getMeta(this), 'giver:wren'); if (r?.notes.length) void persistMeta(this); }
      await persistRun(this); this.scene.start('Quest', { questId: q.id }); return true;
    }
    if (q?.escort && q.status === 'active' && !q.escort.following && key(q.escort.pos) === k) {
      q.escort.following = true;
      this.npcSprite?.destroy(); this.npcSprite = null;
      const c = this.centre(t);
      this.follower = this.add.rectangle(c.x - 22 * K, c.y + 6 * K, 18 * K, 26 * K, 0x9fb3c8).setStrokeStyle(2, 0xffffff, 0.6).setDepth(6);
      this.syncQuestHud();
      void persistRun(this);
      void this.toast(`${q.escort.name} follows you. Get back to ${q.giver.name}.${m.authored ? '' : ' The wilds will notice.'}`, 2600);
      return true;
    }

    const guard = m.guards.find((g) => key(g.pos) === k && !s.defeatedGuards.has(g.id));
    if (guard) { await this.encounterWithWords({ kind: 'guard', enemyId: guard.enemyId, guardId: guard.id }); return true; }
    const node = nodeAt(s, t);
    if (node) { await this.encounterWithWords(nodeEncounter(s, node), node); return true; }
    if (key(m.boss) === k && !s.bossDefeated) { await this.encounterWithWords({ kind: 'boss', enemyId: m.bossId }); return true; }

    const sign = m.signposts?.find((sp) => key(sp.pos) === k);
    if (sign) { this.locked = true; await openDialogue(this, s, getMeta(this), `sign:${sign.id}`); this.locked = false; }

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
        if (isDusk(s)) { void this.toast('The shrine is dark. Its light went with the day.', 1800); return true; }
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

    if (m.authored) return false;
    // Procedural maps: plain tiles feed the threat meter.
    const tile = tileAt(m, t.x, t.y)!;
    const r = stepThreat(s.threat, tile, s.screenIndex, s.rng.stream('encounter'), isEscorting(s) ? ESCORT_THREAT_MULT : 1);
    s.threat = r.meter;
    this.syncHud();
    if (r.encounter) { await this.startEncounter(rollEncounter(s)); return true; }
    return false;
  }

  /**
   * Every fight opens with words (DECISIONS #35): the species' dialogue, or the gate's. An option may
   * end it without a fight, in which case the clearing or post is simply yours. Random ambushes
   * on procedural maps keep their old silence.
   */
  private async encounterWithWords(e: PendingEncounter, node?: MapNode) {
    const s = this.session, meta = getMeta(this);
    this.locked = true;
    let trigger = e.kind === 'boss' ? `gate:${e.enemyId}` : `pre_fight:${e.enemyId}`;
    // Wren takes Andre's place at the gate when the rats have been avenged enough (DECISIONS #36).
    if (e.kind === 'boss' && s.screenIndex === 0 && (meta.relations.wren ?? 0) <= WREN_GRUDGE && !s.testMode) {
      const w = s.equipment.weapon;
      e = { ...e, enemyId: 'wren', custom: [wrenBoss(w?.name ?? null, w ? (w.mods.reduce((a, m) => a + (m.stat?.atk ?? 0), 0)) : 0)] };
      trigger = 'gate:wren';
    }
    // Your ghost joins the fight it fell in, in the rear partner's place.
    const ghost = ghostOn(meta, s.screenIndex);
    if (ghost && !s.testMode && e.kind !== 'boss' && ((e.nodeId && ghost.nodeId === e.nodeId) || (e.guardId && ghost.guardId === e.guardId))) {
      e = { ...e, extra: undefined, custom: [getEnemy(e.enemyId), ghostDef(ghost)], ghost: true };
      trigger = 'pre_fight:ghost';
    }
    const r = await openDialogue(this, s, meta, trigger, { weapon: s.equipment.weapon?.name ?? 'fists', killer: ghost?.killerName ?? '', ghostClass: ghost?.classId ?? '', ghostCard: ghost?.deck.find((id) => getSkill(id).rarity !== 'basic') ? getSkill(ghost.deck.find((id) => getSkill(id).rarity !== 'basic')!).name : 'nothing' });
    if (r?.notes.length) { void persistMeta(this); void this.toast(r.notes.join('  ·  '), 1800); this.syncHud(); }
    if (r && r.skip && !r.fight) {
      if (e.kind === 'guard' && e.guardId) { s.defeatedGuards.add(e.guardId); this.guardSprites.get(e.guardId)?.destroy(); }
      if (e.kind === 'node' && e.nodeId) { s.clearedNodes.add(e.nodeId); this.nodeSprites.get(e.nodeId)?.destroy(); }
      await persistRun(this);
      this.locked = false;
      return;
    }
    await this.startEncounter(e, node);
  }

  private async startEncounter(e: PendingEncounter, node?: MapNode) {
    this.locked = true;
    const pp = this.session.playerPos;
    this.session.pendingEncounter = { ...e, tile: tileAt(this.session.map, pp.x, pp.y) };
    const name = e.custom ? e.custom.map((d) => d.name).join(' & ') : [e.enemyId, ...(e.extra ?? [])].map((id) => getEnemy(id).name).join(' & ');
    const line = e.kind === 'random' ? `Ambush! ${name}` : e.kind === 'guard' ? `${name} blocks the way` : e.kind === 'node' ? (node?.kind === 'elite' ? `${name} hold the clearing` : e.extra?.length ? `${name}, bold in the dark` : `${name} waits here`) : `${name} awaits`;
    void this.toast(line, 600);
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
    if (rats && s.map.authored && s.screenIndex === 0) {
      const v = nudgeRelation(getMeta(this), 'wren', -rats * (s.flags.has('rats_promise') ? 2 : 1));
      void persistMeta(this);
      void this.toast(v <= -2 ? 'Somewhere, Wren feels it. She will not forget.' : 'Somewhere, Wren feels it.', 2000);
    }
    if (killed.map((id) => noteKill(s.quests, id)).some(Boolean)) {
      const q = currentQuest(s);
      if (q?.hunt) void this.toast(`Hunt: ${q.hunt.name} ${Math.min(q.hunt.have, q.hunt.need)} / ${q.hunt.need}${q.hunt.have >= q.hunt.need ? ' — return to ' + q.giver.name : ''}`, 2200);
      this.syncQuestHud();
    }
    if (r.encounter.kind === 'guard' && r.encounter.guardId) {
      s.defeatedGuards.add(r.encounter.guardId);
      this.guardSprites.get(r.encounter.guardId)?.destroy();
      void this.toast('The way is clear.');
    } else if (r.encounter.kind === 'node' && r.encounter.nodeId) {
      s.clearedNodes.add(r.encounter.nodeId);
      this.nodeSprites.get(r.encounter.nodeId)?.destroy();
      void this.toast('The clearing is yours.');
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
      if (!s.testMode) gainExp(getMeta(this), s.classId, WIN_EXP); // the win bonus (DECISIONS #32)
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

import Phaser from 'phaser';
import { createMeta, migrateMeta, type MetaState } from '@core/meta';
import type { RunState } from '@core/run';
import { LocalSaveStore, browserKeyValue } from '@save/LocalSaveStore';
import { SyncedSaveStore } from '@save/SyncedSaveStore';
import { createFirebaseCloud } from '@save/firebase';
import { firebaseConfig } from '@save/config';
import { mergeMeta } from '@core/meta';
import { setMeta } from '@game/session';
import { TelemetryStore } from '@game/telemetry';
import ANIMS from '@data/anims.json';

/** Spritesheets cut from generated video by scripts/video-to-sheet.py; keyed `<name>_<anim>` (e.g. boar_idle). */
export const ART_ANIMS: Record<string, { file: string; frameWidth: number; frameHeight: number; frames: number; fps: number; loop: boolean; pause?: number }> = ANIMS;

/** Optional art, keyed by the texture name the scenes look for (docs/ART.md). Missing files keep the placeholder shapes. */
export const ART_FILES: Record<string, string> = {
  hero_warrior_c: 'art/c/hero_warrior@2x.png', // chosen style (flat vector)
  hero_warrior_a: 'art/a/hero_warrior@2x.png', // pixel, kept for on-device comparison
  enemy_boar_c: 'art/c/boar@2x.png',
  enemy_hex_imp_c: 'art/c/hex_imp@2x.png',
  enemy_adept_necromancer_c: 'art/c/adept_necromancer@2x.png',
  enemy_shell_beetle_c: 'art/c/shell_beetle@2x.png',
  enemy_rat_pack_c: 'art/c/rat_pack@2x.png',
  enemy_gatekeeper_c: 'art/c/gatekeeper@2x.png', // Knight Andre
  // Screen 2's frost five (DECISIONS #84), from Grok (art-src/frost-enemies/).
  enemy_ogre_c: 'art/c/ogre@2x.png',
  enemy_iron_knight_c: 'art/c/iron_knight@2x.png',
  enemy_witch_c: 'art/c/witch@2x.png',
  enemy_harpies_c: 'art/c/harpies@2x.png',
  enemy_warden_c: 'art/c/warden@2x.png',
  // The Treasure Dungeon's five (DECISIONS #83, #84), from Grok (art-src/dungeon-enemies/).
  enemy_wrath_wraith_c: 'art/c/wrath_wraith@2x.png',
  enemy_midden_queen_c: 'art/c/midden_queen@2x.png',
  enemy_hogpile_c: 'art/c/hogpile@2x.png',
  enemy_spiteful_alpaca_c: 'art/c/spiteful_alpaca@2x.png',
  enemy_bramble_hornet_c: 'art/c/bramble_hornet@2x.png',
  bg_forest: 'art/c/bg_forest.jpg',
  bg_tundra: 'art/c/bg_tundra.jpg', // screen 2's battles (DECISIONS #80)
  title: 'art/c/title.jpg', // title screen key art with the logo (docs/ART.md, DECISIONS #74)
  map_1: 'art/c/map1.jpg', // painted screen 1 (docs/ART.md); the tileset draws when a screen has no painting
  fx_curse_skull: 'art/c/fx_curse_skull.png', // the curse's skull and crossbones (DECISIONS #79)
  map_2: 'art/c/map2.jpg',
  map_dungeon1: 'art/c/map_dungeon1.jpg', // the Treasure Dungeon (DECISIONS #84)
  bg_dungeon: 'art/c/bg_dungeon.jpg', // painted screen 2, the Frozen Pass (DECISIONS #76)
};

/** Wires persistence and loads meta before the title shows. Optional art loads here too. */
export class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }

  preload() {
    this.load.on('loaderror', (file: { key: string }) => console.info(`art: no ${file.key}, using placeholder`));
    for (const [key, path] of Object.entries(ART_FILES)) this.load.image(key, path);
    // overworld ground tileset + prop atlas (scripts/pack-tiles.py); missing files keep the flat-colour map
    this.load.image('ground_c', 'art/c/ground.png');
    this.load.atlas('props_c', 'art/c/props.png', 'art/c/props.json');
    for (const [key, a] of Object.entries(ART_ANIMS)) this.load.spritesheet(`${key}_c`, a.file, { frameWidth: a.frameWidth, frameHeight: a.frameHeight });
  }

  /** Global animations from the manifest; scenes play `anim_<name>_<anim>` when it exists. */
  private createAnims() {
    for (const [key, a] of Object.entries(ART_ANIMS)) {
      if (!this.textures.exists(`${key}_c`)) continue;
      this.anims.create({ key: `anim_${key}`, frames: this.anims.generateFrameNumbers(`${key}_c`, { start: (a as { start?: number }).start ?? 0, end: a.frames - 1 }), frameRate: a.fps, repeat: a.loop ? -1 : 0, repeatDelay: a.pause ?? 0 });
    }
  }

  create() {
    this.createAnims();
    const local = new LocalSaveStore<MetaState, RunState>(browserKeyValue());
    this.registry.set('store', local);
    this.registry.set('telemetry', new TelemetryStore());
    this.registry.set('cloud', null);
    void (async () => {
      // Cloud save is optional: without a Firebase config the game is local-only.
      const cfg = firebaseConfig();
      if (cfg) {
        try {
          const cloud = await createFirebaseCloud<MetaState, RunState>(cfg);
          const synced = new SyncedSaveStore<MetaState, RunState>(local, cloud, mergeMeta);
          this.registry.set('store', synced);
          this.registry.set('cloud', cloud);
          window.addEventListener('pagehide', () => void synced.flush());
        } catch (e) {
          console.warn('cloud save unavailable, staying local', e);
        }
      }
      const store = this.registry.get('store') as LocalSaveStore<MetaState, RunState>;
      const meta = migrateMeta(await store.loadMeta());
      setMeta(this, meta ?? createMeta());
      if (meta) await store.saveMeta(meta);
      this.scene.start('Title');
    })();
  }
}

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
  bg_forest: 'art/c/bg_forest.jpg',
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
      this.anims.create({ key: `anim_${key}`, frames: this.anims.generateFrameNumbers(`${key}_c`, { start: 0, end: a.frames - 1 }), frameRate: a.fps, repeat: a.loop ? -1 : 0, repeatDelay: a.pause ?? 0 });
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

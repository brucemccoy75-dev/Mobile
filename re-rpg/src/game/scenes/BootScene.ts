import Phaser from 'phaser';
import { createMeta, migrateMeta, type MetaState } from '@core/meta';
import type { RunState } from '@core/run';
import { LocalSaveStore, browserKeyValue } from '@save/LocalSaveStore';
import { SyncedSaveStore } from '@save/SyncedSaveStore';
import { createFirebaseCloud } from '@save/firebase';
import { firebaseConfig } from '@save/config';
import { mergeMeta } from '@core/meta';
import { setMeta } from '@game/session';

/** Optional art, keyed by the texture name the scenes look for (docs/ART.md). Missing files keep the placeholder shapes. */
export const ART_FILES: Record<string, string> = {
  hero_warrior_c: 'art/c/hero_warrior@2x.png', // chosen style (flat vector)
  hero_warrior_a: 'art/a/hero_warrior@2x.png', // pixel, kept for on-device comparison
  enemy_boar_c: 'art/c/boar@2x.png',
};

/** Wires persistence and loads meta before the title shows. Optional art loads here too. */
export class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }

  preload() {
    this.load.on('loaderror', (file: { key: string }) => console.info(`art: no ${file.key}, using placeholder`));
    for (const [key, path] of Object.entries(ART_FILES)) this.load.image(key, path);
  }

  create() {
    const local = new LocalSaveStore<MetaState, RunState>(browserKeyValue());
    this.registry.set('store', local);
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

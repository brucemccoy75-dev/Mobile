import Phaser from 'phaser';
import { createMeta, META_VERSION, type MetaState } from '@core/meta';
import type { RunState } from '@core/run';
import { LocalSaveStore, browserKeyValue } from '@save/LocalSaveStore';
import { setMeta } from '@game/session';

/** Wires persistence and loads meta before the title shows. Assets load here later. */
export class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }

  create() {
    const store = new LocalSaveStore<MetaState, RunState>(browserKeyValue());
    this.registry.set('store', store);
    void (async () => {
      const meta = await store.loadMeta();
      setMeta(this, meta && meta.version === META_VERSION ? meta : createMeta());
      this.scene.start('Title');
    })();
  }
}

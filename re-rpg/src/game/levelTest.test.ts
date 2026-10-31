import { describe, expect, it, vi } from 'vitest';
import type Phaser from 'phaser';
import { createMeta, gainExp } from '@core/meta';
import { createLevelTest, createSession, endSavedRun, holdMeta, offRecord, persistMeta, persistRun, restoreMeta, setMeta, setSession } from './session';

/** A scene with just the registry and a store that records what was written (DECISIONS #76). */
function fakeScene() {
  const reg = new Map<string, unknown>();
  const store = { saveRun: vi.fn(async () => {}), saveMeta: vi.fn(async () => {}), clearRun: vi.fn(async () => {}) };
  reg.set('store', store);
  const registry = { get: (k: string) => reg.get(k), set: (k: string, v: unknown) => { reg.set(k, v); }, remove: (k: string) => { reg.delete(k); } };
  return { scene: { registry } as unknown as Phaser.Scene, store };
}

describe('level select (DECISIONS #76)', () => {
  it('starts a run on the chosen screen, off the record', () => {
    const s = createLevelTest('warrior', createMeta(), 1);
    expect(s.screenIndex).toBe(1);
    expect([s.map.width, s.map.height]).toEqual([48, 27]);
    expect(s.map.bossId).toBe('warden');
    expect(s.playerPos).toEqual(s.map.entry);
    expect(s.levelTest).toBe(true);
    expect(offRecord(s)).toBe(true);
    expect(createLevelTest('warrior', createMeta(), 0).screenIndex).toBe(0);
    expect(offRecord(createSession('warrior', createMeta()))).toBe(false);
  });

  it('never saves the run or the meta, and leaves the saved run in place when it ends', async () => {
    const { scene, store } = fakeScene();
    setMeta(scene, createMeta());
    setSession(scene, createLevelTest('warrior', holdMeta(scene), 1));
    await persistRun(scene);
    await persistMeta(scene);
    await endSavedRun(scene);
    expect(store.saveRun).not.toHaveBeenCalled();
    expect(store.saveMeta).not.toHaveBeenCalled();
    expect(store.clearRun).not.toHaveBeenCalled();
    // A real run still saves and clears.
    setSession(scene, createSession('warrior', createMeta()));
    await persistRun(scene); await persistMeta(scene); await endSavedRun(scene);
    expect(store.saveRun).toHaveBeenCalledTimes(1);
    expect(store.saveMeta).toHaveBeenCalledTimes(1);
    expect(store.clearRun).toHaveBeenCalledTimes(1);
  });

  it('plays on a copy of the meta; the title screen puts the real one back', () => {
    const { scene } = fakeScene();
    const real = createMeta();
    setMeta(scene, real);
    const copy = holdMeta(scene);
    expect(copy).not.toBe(real);
    gainExp(copy, 'warrior', 500);
    copy.deaths += 3;
    expect(holdMeta(scene)).not.toBe(real); // a second level test keeps the real one held
    restoreMeta(scene);
    expect(scene.registry.get('meta')).toBe(real);
    expect(real.deaths).toBe(0);
    expect(real.progress.warrior?.exp ?? 0).toBe(0);
    expect(copy.progress.warrior?.exp ?? 0).toBeGreaterThan(0);
    restoreMeta(scene); // nothing held: no change
    expect(scene.registry.get('meta')).toBe(real);
  });
});

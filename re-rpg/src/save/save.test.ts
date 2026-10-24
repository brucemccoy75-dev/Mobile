import { describe, it, expect } from 'vitest';
import { LocalSaveStore, MemoryKeyValue } from './LocalSaveStore';

type M = { version: number; updatedAt: number; deaths: number };
type R = { version: number; updatedAt: number; seed: string };

describe('LocalSaveStore', () => {
  it('round-trips meta and run and clears run', async () => {
    const s = new LocalSaveStore<M, R>(new MemoryKeyValue());
    expect(await s.loadMeta()).toBeNull();
    await s.saveMeta({ version: 1, updatedAt: 1, deaths: 2 });
    await s.saveRun({ version: 1, updatedAt: 1, seed: 'X' });
    expect((await s.loadMeta())?.deaths).toBe(2);
    expect((await s.loadRun())?.seed).toBe('X');
    await s.clearRun();
    expect(await s.loadRun()).toBeNull();
  });

  it('survives a throwing backend', async () => {
    const bad = { getItem: () => { throw new Error('nope'); }, setItem: () => { throw new Error('nope'); }, removeItem: () => { throw new Error('nope'); } };
    const s = new LocalSaveStore<M, R>(bad);
    await expect(s.saveMeta({ version: 1, updatedAt: 1, deaths: 0 })).resolves.toBeUndefined();
    expect(await s.loadMeta()).toBeNull();
  });
});

import { describe, it, expect } from 'vitest';
import { LocalSaveStore, MemoryKeyValue } from './LocalSaveStore';
import { SyncedSaveStore, type Cloud, type CloudDoc } from './SyncedSaveStore';
import { createMeta, mergeMeta, type MetaState } from '@core/meta';

type R = { version: number; updatedAt: number; seed: string };

class MemoryCloud implements Cloud<MetaState, R> {
  doc: CloudDoc<MetaState, R> | null = null;
  saves = 0;
  fail = false;
  async load() { if (this.fail) throw new Error('offline'); return this.doc; }
  async save(d: CloudDoc<MetaState, R>) { if (this.fail) throw new Error('offline'); this.doc = JSON.parse(JSON.stringify(d)); this.saves++; }
}

const make = (cloud: MemoryCloud, kv = new MemoryKeyValue()) => new SyncedSaveStore<MetaState, R>(new LocalSaveStore(kv), cloud, mergeMeta, 0);

describe('SyncedSaveStore', () => {
  it('merges cloud meta into local on first load and pushes the merge', async () => {
    const cloud = new MemoryCloud();
    const cm = createMeta(); cm.deaths = 4; cm.discoveredSkills = ['fireball'];
    cloud.doc = { meta: cm, run: null, updatedAt: 1 };
    const kv = new MemoryKeyValue();
    const local = new LocalSaveStore<MetaState, R>(kv);
    const lm = createMeta(); lm.deaths = 1; lm.discoveredItems = ['bloodstone'];
    await local.saveMeta(lm);
    const s = make(cloud, kv);
    const m = (await s.loadMeta())!;
    expect(m.deaths).toBe(4);
    expect(m.discoveredSkills).toEqual(['fireball']);
    expect(m.discoveredItems).toEqual(['bloodstone']);
    expect(cloud.doc!.meta!.discoveredItems).toEqual(['bloodstone']);
  });

  it('takes the newer run from either side', async () => {
    const cloud = new MemoryCloud();
    cloud.doc = { meta: null, run: { version: 1, updatedAt: 200, seed: 'cloud' }, updatedAt: 1 };
    const kv = new MemoryKeyValue();
    await new LocalSaveStore<MetaState, R>(kv).saveRun({ version: 1, updatedAt: 100, seed: 'local' });
    expect((await make(cloud, kv).loadRun())!.seed).toBe('cloud');
    const cloud2 = new MemoryCloud();
    cloud2.doc = { meta: null, run: { version: 1, updatedAt: 50, seed: 'cloud' }, updatedAt: 1 };
    const kv2 = new MemoryKeyValue();
    await new LocalSaveStore<MetaState, R>(kv2).saveRun({ version: 1, updatedAt: 100, seed: 'local' });
    expect((await make(cloud2, kv2).loadRun())!.seed).toBe('local');
  });

  it('writes local immediately and cloud after flush; clearRun clears both', async () => {
    const cloud = new MemoryCloud();
    const s = make(cloud);
    await s.saveRun({ version: 1, updatedAt: 5, seed: 'x' });
    expect((await s.loadRun())!.seed).toBe('x');
    await s.flush();
    expect(cloud.doc!.run!.seed).toBe('x');
    await s.clearRun();
    await s.flush();
    expect(cloud.doc!.run).toBeNull();
  });

  it('keeps working when the cloud is down and records the error', async () => {
    const cloud = new MemoryCloud(); cloud.fail = true;
    const s = make(cloud);
    await s.saveMeta({ ...createMeta(), deaths: 9 });
    expect((await s.loadMeta())!.deaths).toBe(9);
    await s.flush();
    expect(s.lastError).toBeTruthy();
    cloud.fail = false;
    await s.flush();
    expect(cloud.doc!.meta!.deaths).toBe(9);
    expect(s.lastError).toBeNull();
  });
});

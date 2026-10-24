import { describe, it, expect } from 'vitest';
import { Rng, RunRng, hashString, newSeed } from './rng';

describe('Rng', () => {
  it('is deterministic for the same seed', () => {
    const a = new Rng(1234), b = new Rng(1234);
    const seqA = Array.from({ length: 20 }, () => a.next());
    const seqB = Array.from({ length: 20 }, () => b.next());
    expect(seqA).toEqual(seqB);
  });

  it('differs across seeds', () => {
    expect(new Rng(1).next()).not.toBe(new Rng(2).next());
  });

  it('stays within [0,1) and int() within bounds', () => {
    const r = new Rng(99);
    for (let i = 0; i < 10_000; i++) {
      const f = r.next();
      expect(f).toBeGreaterThanOrEqual(0);
      expect(f).toBeLessThan(1);
      const n = r.int(3, 7);
      expect(n).toBeGreaterThanOrEqual(3);
      expect(n).toBeLessThanOrEqual(7);
    }
  });

  it('int() is roughly uniform', () => {
    const r = new Rng(7);
    const counts = [0, 0, 0, 0];
    for (let i = 0; i < 40_000; i++) counts[r.int(0, 3)]!++;
    for (const c of counts) expect(c).toBeGreaterThan(9_000);
  });

  it('weighted() respects weights and skips zero weights', () => {
    const r = new Rng(5);
    const items = [{ id: 'a', w: 0 }, { id: 'b', w: 1 }, { id: 'c', w: 3 }];
    const counts: Record<string, number> = { a: 0, b: 0, c: 0 };
    for (let i = 0; i < 20_000; i++) counts[r.weighted(items, (x) => x.w).id]!++;
    expect(counts.a).toBe(0);
    expect(counts.c! / counts.b!).toBeGreaterThan(2.5);
    expect(counts.c! / counts.b!).toBeLessThan(3.5);
  });

  it('shuffle() is a permutation and does not mutate input', () => {
    const r = new Rng(11);
    const input = [1, 2, 3, 4, 5, 6];
    const out = r.shuffle(input);
    expect(input).toEqual([1, 2, 3, 4, 5, 6]);
    expect(out.slice().sort()).toEqual(input);
  });

  it('state round-trips', () => {
    const r = new Rng(42);
    r.next(); r.next();
    const s = r.getState();
    const expected = r.next();
    r.setState(s);
    expect(r.next()).toBe(expected);
  });
});

describe('RunRng', () => {
  it('streams are independent: draining one leaves the others untouched', () => {
    const a = new RunRng('AMBER-FOX-1000');
    const b = new RunRng('AMBER-FOX-1000');
    for (let i = 0; i < 100; i++) a.stream('loot').next();
    expect(a.stream('map').next()).toBe(b.stream('map').next());
  });

  it('snapshot/restore resumes exactly', () => {
    const a = new RunRng('IRON-OWL-2222');
    a.stream('combat').next();
    const snap = a.snapshot();
    const expected = a.stream('combat').next();
    const b = new RunRng('IRON-OWL-2222');
    b.restore(snap);
    expect(b.stream('combat').next()).toBe(expected);
  });
});

describe('seeds', () => {
  it('hashString is stable', () => {
    expect(hashString('re-rpg')).toBe(hashString('re-rpg'));
    expect(hashString('a')).not.toBe(hashString('b'));
  });

  it('newSeed has the WORD-ANIMAL-NNNN shape', () => {
    expect(newSeed()).toMatch(/^[A-Z]+-[A-Z]+-\d{4}$/);
  });
});

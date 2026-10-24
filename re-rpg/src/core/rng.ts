// Seeded, splittable PRNG. Every random decision in the game goes through a
// named stream so a loot roll never perturbs the map and runs replay from a seed.
//
// Streams: 'map' | 'encounter' | 'loot' | 'combat' | 'meta'. Add more freely;
// a stream's sequence depends only on (seed, name).

export type StreamName = 'map' | 'encounter' | 'loot' | 'combat' | 'meta' | (string & {});

/** 32-bit string hash (cyrb53-style, truncated) used to derive stream seeds. */
export function hashString(str: string, seed = 0): number {
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (h2 >>> 0) ^ (h1 >>> 0);
}

/** mulberry32: small, fast, good enough for games; state is a single uint32. */
export class Rng {
  private state: number;

  constructor(seed: number) {
    this.state = seed >>> 0;
  }

  /** Uniform float in [0, 1). */
  next(): number {
    let t = (this.state = (this.state + 0x6d2b79f5) >>> 0);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /** Integer in [min, max] inclusive. */
  int(min: number, max: number): number {
    return min + Math.floor(this.next() * (max - min + 1));
  }

  /** True with probability p. */
  chance(p: number): boolean {
    return this.next() < p;
  }

  pick<T>(items: readonly T[]): T {
    if (items.length === 0) throw new Error('Rng.pick: empty array');
    return items[Math.floor(this.next() * items.length)] as T;
  }

  /** Weighted pick; weights <= 0 are never chosen. */
  weighted<T>(items: readonly T[], weightOf: (item: T) => number): T {
    let total = 0;
    for (const it of items) total += Math.max(0, weightOf(it));
    if (total <= 0) throw new Error('Rng.weighted: no positive weights');
    let r = this.next() * total;
    for (const it of items) {
      r -= Math.max(0, weightOf(it));
      if (r < 0) return it;
    }
    return items[items.length - 1] as T;
  }

  /** Fisher–Yates, returns a new array. */
  shuffle<T>(items: readonly T[]): T[] {
    const a = items.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [a[i], a[j]] = [a[j] as T, a[i] as T];
    }
    return a;
  }

  /** Serialisable state so a saved run resumes mid-sequence. */
  getState(): number { return this.state; }
  setState(s: number) { this.state = s >>> 0; }
}

/** A run seed fans out into independent named streams. */
export class RunRng {
  private streams = new Map<string, Rng>();

  constructor(public readonly seed: string) {}

  stream(name: StreamName): Rng {
    let s = this.streams.get(name);
    if (!s) {
      s = new Rng(hashString(`${this.seed}::${name}`));
      this.streams.set(name, s);
    }
    return s;
  }

  snapshot(): Record<string, number> {
    const out: Record<string, number> = {};
    for (const [k, v] of this.streams) out[k] = v.getState();
    return out;
  }

  restore(states: Record<string, number>) {
    for (const [k, v] of Object.entries(states)) this.stream(k).setState(v);
  }
}

/** Human-friendly seed like "AMBER-FOX-4821" for sharing/debugging. */
export function newSeed(entropy: () => number = Math.random): string {
  const words = ['AMBER', 'IRON', 'MOSS', 'ASH', 'FROST', 'EMBER', 'STORM', 'GLOOM', 'SILVER', 'THORN', 'RUNE', 'VALE'];
  const animals = ['FOX', 'BOAR', 'OWL', 'WOLF', 'HART', 'CROW', 'LYNX', 'TOAD', 'HAWK', 'ELK', 'ASP', 'MOTH'];
  const w = words[Math.floor(entropy() * words.length)];
  const a = animals[Math.floor(entropy() * animals.length)];
  const n = Math.floor(entropy() * 9000) + 1000;
  return `${w}-${a}-${n}`;
}

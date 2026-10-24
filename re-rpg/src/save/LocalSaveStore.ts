import type { SaveStore, Versioned } from './SaveStore';

export interface KeyValue {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

/**
 * localStorage-backed store. Every read/write is wrapped: private windows and
 * cleared site data must degrade to "no save", never to a crash.
 */
export class LocalSaveStore<Meta extends Versioned, Run extends Versioned> implements SaveStore<Meta, Run> {
  constructor(private readonly kv: KeyValue, private readonly prefix = 'rerpg') {}

  private read<T>(key: string): T | null {
    try {
      const raw = this.kv.getItem(`${this.prefix}:${key}`);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch { return null; }
  }
  private write(key: string, value: unknown): void {
    try { this.kv.setItem(`${this.prefix}:${key}`, JSON.stringify(value)); } catch { /* storage unavailable */ }
  }

  async loadMeta() { return this.read<Meta>('meta'); }
  async saveMeta(meta: Meta) { this.write('meta', meta); }
  async loadRun() { return this.read<Run>('run'); }
  async saveRun(run: Run) { this.write('run', run); }
  async clearRun() { try { this.kv.removeItem(`${this.prefix}:run`); } catch { /* ignore */ } }
}

/** In-memory fallback for tests and for browsers that block storage entirely. */
export class MemoryKeyValue implements KeyValue {
  private m = new Map<string, string>();
  getItem(k: string) { return this.m.get(k) ?? null; }
  setItem(k: string, v: string) { this.m.set(k, v); }
  removeItem(k: string) { this.m.delete(k); }
}

export function browserKeyValue(): KeyValue {
  try {
    const t = '__rerpg_probe__';
    localStorage.setItem(t, '1'); localStorage.removeItem(t);
    return localStorage;
  } catch { return new MemoryKeyValue(); }
}

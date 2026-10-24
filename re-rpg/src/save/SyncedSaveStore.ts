import type { SaveStore, Versioned } from './SaveStore';

/** One document per player in the cloud: { meta, run, updatedAt }. */
export interface CloudDoc<Meta, Run> { meta: Meta | null; run: Run | null; updatedAt: number; }

export interface Cloud<Meta, Run> {
  load(): Promise<CloudDoc<Meta, Run> | null>;
  save(doc: CloudDoc<Meta, Run>): Promise<void>;
}

/**
 * Local-first store with a cloud behind it (ARCHITECTURE §8).
 * - Reads come from local, after one cloud pull per session that merges meta
 *   (union/max via `mergeMeta`) and takes the newer run.
 * - Writes go local immediately and to the cloud debounced; `flush()` forces it.
 * - Cloud failures never surface to the game: local always wins on error.
 */
export class SyncedSaveStore<Meta extends Versioned, Run extends Versioned> implements SaveStore<Meta, Run> {
  private pulled = false;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private pending: Promise<void> = Promise.resolve();
  lastError: unknown = null;

  constructor(
    private readonly local: SaveStore<Meta, Run>,
    private readonly cloud: Cloud<Meta, Run>,
    private readonly mergeMeta: (a: Meta, b: Meta) => Meta,
    private readonly debounceMs = 500,
  ) {}

  /** Pull once, merge, write the merge back to both sides. Safe to call repeatedly. */
  async pull(): Promise<void> {
    if (this.pulled) return;
    this.pulled = true;
    let doc: CloudDoc<Meta, Run> | null;
    try { doc = await this.cloud.load(); } catch (e) { this.lastError = e; this.pulled = false; return; }
    if (!doc) { await this.push(); return; }
    const localMeta = await this.local.loadMeta();
    const localRun = await this.local.loadRun();
    const meta = localMeta && doc.meta ? this.mergeMeta(localMeta, doc.meta) : (localMeta ?? doc.meta);
    const run = pickNewer(localRun, doc.run);
    if (meta) await this.local.saveMeta(meta);
    if (run) await this.local.saveRun(run); else await this.local.clearRun();
    await this.push();
  }

  private async push(): Promise<void> {
    const [meta, run] = await Promise.all([this.local.loadMeta(), this.local.loadRun()]);
    try { await this.cloud.save({ meta, run, updatedAt: Date.now() }); this.lastError = null; }
    catch (e) { this.lastError = e; }
  }

  private schedulePush(): void {
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => { this.timer = null; this.pending = this.pending.then(() => this.push()); }, this.debounceMs);
  }

  /** Push now (e.g. before the page hides). */
  async flush(): Promise<void> {
    if (this.timer) { clearTimeout(this.timer); this.timer = null; }
    this.pending = this.pending.then(() => this.push());
    await this.pending;
  }

  /** Force a fresh pull on the next load (after linking an account that may hold other progress). */
  invalidate(): void { this.pulled = false; }

  async loadMeta() { await this.pull(); return this.local.loadMeta(); }
  async saveMeta(meta: Meta) { await this.local.saveMeta(meta); this.schedulePush(); }
  async loadRun() { await this.pull(); return this.local.loadRun(); }
  async saveRun(run: Run) { await this.local.saveRun(run); this.schedulePush(); }
  async clearRun() { await this.local.clearRun(); this.schedulePush(); }
}

function pickNewer<R extends Versioned>(a: R | null, b: R | null): R | null {
  if (!a) return b; if (!b) return a;
  return b.updatedAt > a.updatedAt ? b : a;
}

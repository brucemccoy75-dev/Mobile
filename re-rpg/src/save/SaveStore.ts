// Persistence boundary. Game code only ever sees this interface.
// Milestone 4: LocalSaveStore (IndexedDB). Milestone 4b: FirebaseSaveStore
// wrapping the local one with push/pull sync and merge rules (see docs/ARCHITECTURE.md §8).

export interface Versioned { version: number; updatedAt: number; }

export interface SaveStore<Meta extends Versioned, Run extends Versioned> {
  loadMeta(): Promise<Meta | null>;
  saveMeta(meta: Meta): Promise<void>;
  loadRun(): Promise<Run | null>;
  saveRun(run: Run): Promise<void>;
  clearRun(): Promise<void>;
}

import type Phaser from 'phaser';
import type { CombatEvent } from '@core/combat';
import type { MetaState } from '@core/meta';
import { equipmentToIds } from '@core/run';
import { describeRuns, emptyLog, endRun, startRun, summarizeFight, type FightRecord, type TelemetryLog } from '@core/telemetry';
import { browserKeyValue, type KeyValue } from '@save/LocalSaveStore';
import { APP_VERSION } from '@game/version';
import type { PendingEncounter, RunSession } from '@game/session';

const KEY = 'rerpg:telemetry';

/** Local ring buffer of run records (DECISIONS #26). Reads and writes never throw. */
export class TelemetryStore {
  log: TelemetryLog;
  constructor(private readonly kv: KeyValue = browserKeyValue()) {
    let log: TelemetryLog | null = null;
    try { const raw = kv.getItem(KEY); log = raw ? (JSON.parse(raw) as TelemetryLog) : null; } catch { /* unreadable */ }
    this.log = log && Array.isArray(log.runs) ? log : emptyLog();
  }
  save() { try { this.kv.setItem(KEY, JSON.stringify(this.log)); } catch { /* storage unavailable */ } }
  export(): string { return JSON.stringify({ exportedAt: new Date().toISOString(), appVersion: APP_VERSION, summary: describeRuns(this.log), ...this.log }, null, 1); }
}

export const getTelemetry = (scene: Phaser.Scene): TelemetryStore => {
  let t = scene.registry.get('telemetry') as TelemetryStore | undefined;
  if (!t) { t = new TelemetryStore(); scene.registry.set('telemetry', t); }
  return t;
};

const snapshot = (s: RunSession) => ({ deck: [...s.deck], equipment: equipmentToIds(s.equipment) as Record<string, string | null>, stats: { ...s.stats } });

/** Called when a run enters the overworld; idempotent, so continuing a save is fine. Test mode is never logged. */
export function ensureRun(scene: Phaser.Scene, s: RunSession, meta: MetaState): void {
  if (s.testMode) return;
  const t = getTelemetry(scene);
  startRun(t.log, { appVersion: APP_VERSION, seed: s.seed, classId: s.classId, setId: s.setId, legacy: { ...meta.legacy }, start: snapshot(s), startedAt: Date.now() });
  t.save();
}

export function recordFight(scene: Phaser.Scene, s: RunSession, e: PendingEncounter, hpBefore: number, hpAfter: number, log: CombatEvent[], outcome: 'won' | 'lost'): void {
  if (s.testMode) return;
  const t = getTelemetry(scene);
  const run = t.log.runs.find((r) => r.seed === s.seed);
  if (!run) return;
  const f: FightRecord = { at: Date.now(), screen: s.screenIndex + 1, enemyId: e.enemyId, kind: e.kind, tile: e.tile, hpBefore, hpAfter, ...summarizeFight(log), outcome, ...snapshot(s), gold: s.gold };
  run.fights.push(f);
  if (e.kind === 'boss' && outcome === 'won') run.screensCleared = Math.max(run.screensCleared, s.screenIndex + 1);
  t.save();
}

export function recordReward(scene: Phaser.Scene, s: RunSession, r: { source: string; offered: string[]; picked?: string; sold?: string; replaced?: string; gold: number }): void {
  if (s.testMode) return;
  const t = getTelemetry(scene);
  const run = t.log.runs.find((x) => x.seed === s.seed);
  if (!run) return;
  run.rewards.push({ at: Date.now(), screen: s.screenIndex + 1, ...r });
  t.save();
}

export function recordShop(scene: Phaser.Scene, s: RunSession, bought: string, price: number): void {
  if (s.testMode) return;
  const t = getTelemetry(scene);
  const run = t.log.runs.find((x) => x.seed === s.seed);
  if (!run) return;
  run.shop.push({ at: Date.now(), screen: s.screenIndex + 1, bought, price });
  t.save();
}

export function recordRunEnd(scene: Phaser.Scene, s: RunSession, outcome: 'won' | 'died', diedTo?: string): void {
  if (s.testMode) return;
  const t = getTelemetry(scene);
  endRun(t.log, s.seed, outcome, diedTo);
  t.save();
}

/** Share the JSON: a file via Web Share on phones, the clipboard elsewhere. Returns a one-line result for a toast. */
export async function shareRunLog(scene: Phaser.Scene): Promise<string> {
  const t = getTelemetry(scene);
  if (t.log.runs.length === 0) return 'no runs recorded yet';
  const json = t.export();
  const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
  try {
    const file = new File([json], `re-rpg-runs-${new Date().toISOString().slice(0, 10)}.json`, { type: 'application/json' });
    if (nav.share && nav.canShare?.({ files: [file] })) { await nav.share({ files: [file], title: 'Re-RPG run log' }); return `shared ${t.log.runs.length} runs`; }
  } catch (e) { if ((e as Error).name === 'AbortError') return 'share cancelled'; }
  try { await navigator.clipboard.writeText(json); return `copied ${t.log.runs.length} runs to the clipboard`; } catch { /* no clipboard */ }
  console.info(json);
  return 'could not share: log printed to the console';
}

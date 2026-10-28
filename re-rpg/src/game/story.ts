import type { MetaState } from '@core/meta';
import { allHold, type DEffect } from '@core/dialogue';
import { noteKill } from '@core/quest';
import { WORLD } from '@data/world';
import { applyOption } from '@game/dialogue';
import { currentQuest, isFightNode, nodeById, storyCtx, type PendingEncounter, type RunSession } from '@game/session';

/** What a win changed, for the map to show: toasts, the node cleared, a boss beaten. */
export interface WinReport { notes: string[]; cleared?: string; boss: boolean; hunt?: string; }

/**
 * Everything a won fight changes in the run (DECISIONS #61), applied the moment the fight is won
 * and before any save, so closing the app on the spoils screen loses nothing. The map only shows
 * the result. Enemies' on-kill hooks (world.json `enemies[id].onKill`, first entry whose conditions
 * hold, per enemy killed) are data: Wren's rats live there now.
 */
export function applyWin(s: RunSession, meta: MetaState, enc: PendingEncounter): WinReport {
  const report: WinReport = { notes: [], boss: false };
  const killed = enc.custom ? enc.custom.map((d) => d.id) : [enc.enemyId, ...(enc.extra ?? [])];
  for (const id of killed) {
    const hook = (WORLD.enemies[id]?.onKill ?? []).find((h) => allHold(h.when, storyCtx(s, meta)));
    if (hook) report.notes.push(...applyEffects(s, meta, hook.effects));
  }
  if (killed.map((id) => noteKill(s.quests, id)).some(Boolean)) {
    const q = currentQuest(s);
    if (q?.hunt) report.hunt = `Hunt: ${q.hunt.name} ${Math.min(q.hunt.have, q.hunt.need)} / ${q.hunt.need}${q.hunt.have >= q.hunt.need ? ' — return to ' + q.giver.name : ''}`;
  }
  if (enc.kind === 'node' && enc.nodeId) {
    const n = nodeById(s, enc.nodeId);
    s.clearedNodes.add(n.id);
    if (isFightNode(n)) s.lastClearedNode = n.id;
    // A re-armed node pays its win flag only when it is the one won (the brother, #61).
    if (n.rearm) { if (n.rearm.winFlag) s.flags.add(n.rearm.winFlag); delete n.rearm; }
    report.cleared = n.id;
  } else if (enc.kind === 'boss') {
    s.bossDefeated = true;
    if (enc.nodeId) s.clearedNodes.add(enc.nodeId);
    s.hp = s.stats.maxHp;
    report.boss = true;
  }
  return report;
}

/** Dialogue effects outside a dialogue (an on-kill hook): same rules, same notes. */
function applyEffects(s: RunSession, meta: MetaState, effects: DEffect[]): string[] {
  return applyOption(s, meta, { text: '', effects }).notes;
}

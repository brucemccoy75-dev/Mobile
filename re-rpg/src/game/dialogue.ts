import type Phaser from 'phaser';
import { DIALOGUE } from '@data/dialogue';
import { getSkill } from '@data/index';
import { buildPool } from '@core/loot';
import { classProgress, deathsOn, nudgeRelation, type MetaState } from '@core/meta';
import { pickDialogue, resolve, type Dialogue, type DialogueCtx, type DOption } from '@core/dialogue';
import { DECK_CAP } from '@core/combat';
import { applyTome, poolCtx, type RunSession } from '@game/session';

/** The dialogue context for this moment of the run (DECISIONS #35). */
export function dialogueCtx(s: RunSession, meta: MetaState): DialogueCtx {
  return {
    flags: s.flags, relations: meta.relations ?? {}, deathsOnScreen: deathsOn(meta, s.screenIndex), deathsTotal: meta.deaths, lastKiller: meta.lastKiller,
    level: classProgress(meta, s.classId).level, classId: s.classId, gold: s.gold, daylight: s.daylight, rng: s.rng.stream('quest'),
  };
}

/** Dialogue is skippable once this screen has been beaten before (the user's rule). */
export const canSkipDialogue = (s: RunSession, meta: MetaState): boolean => meta.bestScreen > s.screenIndex;

export const findDialogue = (trigger: string, s: RunSession, meta: MetaState): Dialogue | null => pickDialogue(DIALOGUE, trigger, dialogueCtx(s, meta));

export interface Applied { fight: boolean; skip: boolean; next?: string; notes: string[]; }

/** Apply an option to the run and meta; returns what the scene should do next and what to say about it. */
export function applyOption(s: RunSession, meta: MetaState, o: DOption): Applied {
  const r = resolve(o.effects);
  const notes: string[] = [];
  for (const f of r.flags) { if (f.value) s.flags.add(f.flag); else s.flags.delete(f.flag); }
  for (const rel of r.relations) { const v = nudgeRelation(meta, rel.relation, rel.delta); notes.push(`${cap(rel.relation)} ${rel.delta > 0 ? '+' : ''}${rel.delta} (${v})`); }
  if (r.gold) { s.gold = Math.max(0, s.gold + r.gold); notes.push(`${r.gold > 0 ? '+' : ''}${r.gold} gold`); }
  if (r.hp) { s.hp = Math.max(1, Math.min(s.stats.maxHp, s.hp + r.hp)); notes.push(`${r.hp > 0 ? '+' : ''}${r.hp} HP`); }
  if (r.daylight) { s.daylight = Math.max(0, s.daylight + r.daylight); notes.push(`${r.daylight} daylight`); }
  for (const t of r.tomes) {
    const skill = t === 'random' ? s.rng.stream('loot').pick(buildPool(poolCtx(s, meta)).tomes) : getSkill(t);
    if (!skill) continue;
    if (s.deck.length >= DECK_CAP) { notes.push(`${skill.name} left behind: deck full`); continue; }
    applyTome(s, skill); notes.push(`Learned ${skill.name}`);
  }
  return { fight: r.fight, skip: r.skip, next: r.next, notes };
}

const cap = (w: string) => w.charAt(0).toUpperCase() + w.slice(1);

export interface DialogueResult { fight: boolean; skip: boolean; notes: string[]; }

/**
 * Open the speech box over the current scene and wait for the player. Resolves null when no entry
 * answers the trigger, so callers fall through to whatever they did before dialogue existed.
 */
export function openDialogue(scene: Phaser.Scene, s: RunSession, meta: MetaState, trigger: string, vars: Record<string, string | number> = {}): Promise<DialogueResult | null> {
  const first = findDialogue(trigger, s, meta);
  if (!first) return Promise.resolve(null);
  return new Promise((done) => {
    scene.scene.launch('Dialogue', { first, vars, resolve: done });
    scene.scene.bringToTop('Dialogue');
  });
}

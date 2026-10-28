import type { Dialogue } from '@core/dialogue';
import { CONTENT_GLYPHS, listSlots } from '@core/map/authored';
import { RULE_KINDS, type NodeRule } from '@core/map/types';
import { ENEMIES, SKILLS } from './index';
import { SCREEN1 } from './maps/screen1';
import { SCREEN2 } from './maps/screen2';

/**
 * The world file (DECISIONS #55): everything the world editor (world.html) edits. The dialogue
 * library, each enemy's everyday lines, and per-node rules for each screen. The game reads it at
 * load; an exported file is imported by the procedure in docs/WORLD.md.
 *
 *   dialogue   every entry the game can say (trigger, speaker, conditions, lines, options)
 *   enemies    per enemy id, `defaults`: the entries it picks from at random when no conditional
 *              entry of its own holds and its node has no override
 *   screens    per screen index, node rules by node id (kind or odds, species or pair, dialogue)
 */
export const WORLD_VERSION = 1;

export interface WorldData {
  version: number;
  enemies: Record<string, { defaults: string[] }>;
  screens: { nodes: Record<string, NodeRule> }[];
  dialogue: Dialogue[];
}

/** The authored layouts, by screen index; node ids come from these and never change (no new nodes, #55). */
export const SCREEN_ASCII = [SCREEN1, SCREEN2];

/** The trigger an enemy's own words answer to: a gate for a boss, a pre-fight line for the rest. */
export const enemyTrigger = (id: string): string => (ENEMIES.find((e) => e.id === id)?.archetype === 'boss' ? `gate:${id}` : `pre_fight:${id}`);

/** Triggers the game asks for by name and must answer (Wren may say nothing, so giver:wren is not here). */
export const STORY_TRIGGERS = ['node:quest', 'node:lost', 'pre_fight:brother', 'gate:wren', 'pre_fight:ghost'];

const isId = (s: unknown) => typeof s === 'string' && /^[a-z][a-z0-9_]*$/.test(s);

/** Every rule the world file must satisfy. One line per problem, empty when clean. */
export function validateWorld(w: WorldData): string[] {
  const out: string[] = [];
  const bad = (s: string) => out.push(s);
  if (w.version !== WORLD_VERSION) bad(`version must be ${WORLD_VERSION}`);
  const ids = new Set<string>();
  for (const d of w.dialogue ?? []) {
    const at = `dialogue ${d.id}`;
    if (!isId(d.id)) bad(`${at}: id must be lower_snake_case`);
    if (ids.has(d.id)) bad(`${at}: duplicate id`);
    ids.add(d.id);
    if (!d.trigger?.trim()) bad(`${at}: needs a trigger`);
    if (!d.speaker?.trim()) bad(`${at}: needs a speaker`);
    if (!d.lines?.length || d.lines.some((l) => !l.trim())) bad(`${at}: needs at least one line, none empty`);
    if (!d.options?.length) bad(`${at}: needs at least one option`);
  }
  const triggers = new Set((w.dialogue ?? []).map((d) => d.trigger));
  const skillIds = new Set(SKILLS.map((k) => k.id));
  for (const d of w.dialogue ?? []) for (const o of d.options ?? []) {
    const at = `dialogue ${d.id} option "${o.text}"`;
    if (!o.text?.trim()) bad(`dialogue ${d.id}: an option has no text`);
    for (const e of o.effects ?? []) {
      if ('next' in e && !triggers.has(e.next)) bad(`${at}: next "${e.next}" answers no entry`);
      if ('tome' in e && e.tome !== 'random' && !skillIds.has(e.tome)) bad(`${at}: unknown card ${e.tome}`);
    }
    if (!(o.effects ?? []).some((e) => 'fight' in e || 'skip' in e || 'next' in e) && (d.trigger.startsWith('pre_fight:') || d.trigger.startsWith('gate:'))) bad(`${at}: a pre-fight option must fight, walk on or lead on`);
  }
  const always = (trig: string) => (w.dialogue ?? []).some((d) => d.trigger === trig && !(d.when?.length));
  for (const t of STORY_TRIGGERS) if (!always(t)) bad(`trigger ${t}: needs an entry with no conditions`);
  for (const e of ENEMIES) {
    const trig = enemyTrigger(e.id);
    const defs = w.enemies?.[e.id]?.defaults ?? [];
    if (!defs.length && !always(trig)) bad(`enemy ${e.id}: needs a default line (or an entry for ${trig} with no conditions)`);
    for (const id of defs) {
      const d = (w.dialogue ?? []).find((x) => x.id === id);
      if (!d) bad(`enemy ${e.id}: default ${id} is not a dialogue`);
      else if (d.trigger !== trig) bad(`enemy ${e.id}: default ${id} answers ${d.trigger}, not ${trig}`);
    }
  }
  for (const id of Object.keys(w.enemies ?? {})) if (!ENEMIES.some((e) => e.id === id)) bad(`enemy ${id}: no such enemy`);
  if ((w.screens ?? []).length !== SCREEN_ASCII.length) bad(`screens: expected ${SCREEN_ASCII.length}`);
  (w.screens ?? []).forEach((sc, i) => {
    const slots = listSlots(SCREEN_ASCII[i] ?? '');
    const tier = i === 0 ? 1 : 2;
    for (const [nid, r] of Object.entries(sc.nodes ?? {})) {
      const at = `screen ${i + 1} ${nid}`;
      const slot = slots.find((s) => s.id === nid);
      if (!slot) { bad(`${at}: no such node`); continue; }
      const content = CONTENT_GLYPHS.includes(slot.glyph), boss = slot.glyph === 'B';
      if ((r.kind || r.odds) && !content) bad(`${at}: a story node or the boss keeps its kind`);
      if (r.kind && r.odds) bad(`${at}: a kind or odds, not both`);
      if (r.kind && !RULE_KINDS.includes(r.kind)) bad(`${at}: unknown kind ${r.kind}`);
      if (r.odds) {
        const ent = Object.entries(r.odds);
        if (!ent.length) bad(`${at}: odds need at least one kind`);
        for (const [k, v] of ent) { if (!(RULE_KINDS as readonly string[]).includes(k)) bad(`${at}: unknown kind ${k}`); if (typeof v !== 'number' || !(v > 0)) bad(`${at}: odds for ${k} must be above 0`); }
      }
      const enemy = (id: string) => ENEMIES.find((e) => e.id === id);
      if (r.enemy) {
        const e = enemy(r.enemy);
        if (!e) bad(`${at}: no enemy ${r.enemy}`);
        else if (boss ? e.archetype !== 'boss' : e.archetype === 'boss' || e.tier !== tier) bad(`${at}: ${r.enemy} does not belong here`);
        if (!boss && !content) bad(`${at}: only fight slots and the boss take an enemy`);
      }
      if (r.pair) {
        if (!content) bad(`${at}: only fight slots take a pair`);
        for (const id of r.pair) { const e = enemy(id); if (!e || e.archetype === 'boss' || e.tier !== tier) bad(`${at}: pair member ${id} does not belong here`); }
        if (r.enemy) bad(`${at}: an enemy or a pair, not both`);
      }
      if (r.dialogue && !ids.has(r.dialogue)) bad(`${at}: no dialogue ${r.dialogue}`);
    }
  });
  return out;
}

/** What an import changes, for the commit message. */
export function diffWorld(a: WorldData, b: WorldData): string[] {
  const out: string[] = [];
  const same = (x: unknown, y: unknown) => JSON.stringify(x) === JSON.stringify(y);
  const old = new Map(a.dialogue.map((d) => [d.id, d]));
  for (const d of b.dialogue) { const o = old.get(d.id); if (!o) out.push(`new dialogue ${d.id}`); else if (!same(o, d)) out.push(`changed dialogue ${d.id}`); }
  for (const id of old.keys()) if (!b.dialogue.some((d) => d.id === id)) out.push(`removed dialogue ${id}`);
  for (const id of new Set([...Object.keys(a.enemies), ...Object.keys(b.enemies)])) if (!same(a.enemies[id], b.enemies[id])) out.push(`enemy ${id} defaults: [${(a.enemies[id]?.defaults ?? []).join(', ')}] -> [${(b.enemies[id]?.defaults ?? []).join(', ')}]`);
  b.screens.forEach((sc, i) => {
    const before = a.screens[i]?.nodes ?? {};
    for (const id of new Set([...Object.keys(before), ...Object.keys(sc.nodes)])) if (!same(before[id], sc.nodes[id])) out.push(`screen ${i + 1} ${id}: ${JSON.stringify(before[id] ?? {})} -> ${JSON.stringify(sc.nodes[id] ?? {})}`);
  });
  return out;
}

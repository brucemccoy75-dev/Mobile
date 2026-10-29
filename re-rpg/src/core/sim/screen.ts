import { basicsFor } from '@data/skills';
import { SETS, getClass } from '@data/index';
import { nodeRules } from '@data/world';
import { SCREEN1 } from '@data/maps/screen1';
import { SCREEN2 } from '@data/maps/screen2';
import type { ClassId, Enemy, SetId, SkillId } from '@data/types';
import { RunRng, type Rng } from '@core/rng';
import { createCombat } from '@core/combat';
import { SHRINE_HEAL, parseScreen, type MapNode, type ScreenMap } from '@core/map';
import { HEIRLOOM_OFFER, HEIRLOOM_PICKS } from '@core/meta';
import { wrenBoss } from '@core/variants';
import type { Policy } from './policy';
import { runFight, withMods, type GauntletResult, type Loadout } from './gauntlet';

/**
 * The screen mirror (DECISIONS #67): the four-fight gauntlet is a floor for a deck, not a run.
 * This plays the real screen instead: the authored map rolled from the seed with the designer's
 * node rules, so its duos, unknowns and shrine are the ones a player meets; a run opens with
 * heirlooms drawn like a real one; HP carries over; the shrine is saved for when it is needed;
 * and the gate is who the designer meets there: Knight Andre while the story is off (#72), or
 * Wren with your weapon for logs from when she held it.
 * Not modelled: loot, gold and the shop, level-ups during the run, quests and dialogue.
 */
export type Route = 'clear' | 'short';
export type Gate = 'wren' | 'gatekeeper';

export interface ScreenOptions {
  /** `families` set: the deck is two heirlooms drawn from them each run (the loadout's `deck` is ignored). */
  loadout: Loadout & { families?: SetId[] };
  /** "clear" fights every fight on the screen; "short" only those on the shortest road to the gate. */
  route: Route;
  boss: Gate;
  policy: Policy;
  seed: string;
  screenIndex?: 0 | 1;
}

export interface ScreenResult extends GauntletResult {
  /** Fights on the route, and how many of those fought were duos. */
  fights: number;
  duos: number;
  deathInDuo: boolean;
}

const FIGHTS = new Set(['monster', 'unknown', 'elite']);

export function buildScreen(seed: string, screenIndex: 0 | 1 = 0): ScreenMap {
  return parseScreen(screenIndex === 0 ? SCREEN1 : SCREEN2, new RunRng(seed).stream('map'), { seed, screenIndex, rules: nodeRules(screenIndex) });
}

/** The nodes a route visits before the gate, nearest first: fights and the shrine. */
export function screenRoute(map: ScreenMap, route: Route): MapNode[] {
  const nodes = map.nodes ?? [];
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const start = nodes.find((n) => n.kind === 'start')!, gate = nodes.find((n) => n.kind === 'boss')!;
  const parent = new Map<string, string | null>([[start.id, null]]);
  const order: MapNode[] = [];
  for (let q = [start]; q.length;) {
    const n = q.shift()!;
    order.push(n);
    for (const l of n.links) if (!parent.has(l)) { parent.set(l, n.id); q.push(byId.get(l)!); }
  }
  let visit = order;
  if (route === 'short') {
    const path = new Set<string>();
    for (let id: string | null | undefined = gate.id; id; id = parent.get(id)) path.add(id);
    visit = order.filter((n) => path.has(n.id));
  }
  return visit.filter((n) => FIGHTS.has(n.kind) || n.kind === 'shrine');
}

/** Two heirlooms from the loadout's families: HEIRLOOM_OFFER offered at random, HEIRLOOM_PICKS kept. */
export function rollHeirlooms(lo: { families?: SetId[] }, rng: Rng): SkillId[] {
  let pool = [...new Set((lo.families ?? []).flatMap((id) => SETS.find((s) => s.id === id)?.skills ?? []))];
  const offer: SkillId[] = [];
  while (pool.length && offer.length < HEIRLOOM_OFFER) { const c = rng.pick(pool); offer.push(c); pool = pool.filter((x) => x !== c); }
  return rng.shuffle(offer).slice(0, HEIRLOOM_PICKS);
}

export function runScreen(o: ScreenOptions): ScreenResult {
  const cls = getClass(o.loadout.classId);
  const stats = withMods(cls.stats, o.loadout.statMods);
  const rng = new RunRng(o.seed);
  const map = buildScreen(o.seed, o.screenIndex ?? 0);
  const route = screenRoute(map, o.route);
  const deck = o.loadout.families ? rollHeirlooms(o.loadout, rng.stream('heirlooms')) : [...o.loadout.deck];
  let hp = stats.maxHp, rounds = 0, fightsWon = 0, duos = 0, shrine = false;
  const fights = route.filter((n) => FIGHTS.has(n.kind)).length;
  // A careful player keeps the shrine for when they are low, or for the gate.
  const useShrine = () => { if (shrine) { hp = Math.min(stats.maxHp, hp + Math.round(stats.maxHp * SHRINE_HEAL)); shrine = false; } };

  const fight = (enemies: (string | Enemy)[]) => {
    const s = createCombat({ player: { stats, hp, deck, basics: basicsFor(o.loadout.classId) }, enemies, rng: rng.stream('combat') });
    runFight(s, o.policy);
    rounds += s.round;
    hp = s.player.hp;
    for (const id of s.player.consumed) { const i = deck.indexOf(id); if (i >= 0) deck.splice(i, 1); }
    return s.outcome === 'won';
  };

  for (const n of route) {
    if (n.kind === 'shrine') { shrine = true; if (hp <= stats.maxHp / 2) useShrine(); continue; }
    const enemies = [n.enemyId!, ...(n.extra ?? [])];
    if (enemies.length > 1) duos++;
    if (!fight(enemies)) return { reachedBoss: false, beatBoss: false, fightsWon, hpAtBoss: 0, rounds, deathBy: enemies.join('+'), fights, duos, deathInDuo: enemies.length > 1 };
    fightsWon++;
    if (hp <= stats.maxHp / 2) useShrine();
  }
  useShrine();
  const hpAtBoss = hp;
  const boss = o.boss === 'wren' ? wrenBoss(null, stats.gearAtk ?? 0) : 'gatekeeper';
  const beat = fight([boss]);
  return { reachedBoss: true, beatBoss: beat, fightsWon: fightsWon + (beat ? 1 : 0), hpAtBoss, rounds, deathBy: beat ? undefined : o.boss, fights, duos, deathInDuo: false };
}

/** Fresh, then two heirlooms from each of the class's families that hold cards, then from each pair of them. */
export function screenLoadouts(classId: ClassId, maxHp = 0): (Loadout & { families?: SetId[] })[] {
  const fams = SETS.filter((s) => s.classId === classId && s.skills.length > 0);
  const statMods = maxHp ? { maxHp } : undefined;
  const out: (Loadout & { families?: SetId[] })[] = [{ label: `${classId} fresh`, classId, deck: [], statMods }];
  for (const f of fams) out.push({ label: `${classId} ${f.name}`, classId, deck: [], families: [f.id], statMods });
  for (let i = 0; i < fams.length; i++) for (let j = i + 1; j < fams.length; j++) {
    const ids = [fams[i]!.id, fams[j]!.id].sort();
    out.push({ label: `${classId} ${ids.map((id) => SETS.find((s) => s.id === id)!.name).join('+')}`, classId, deck: [], families: ids, statMods });
  }
  return out;
}

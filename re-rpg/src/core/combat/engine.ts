import { BASIC_DECK } from '@data/skills';
import { getEnemy, getSkill } from '@data/index';
import { skillWith, type SkillUpgrades } from '@core/run/upgrade';
import type { Effect, Enemy, EnemyId, Intent, SkillId, Stats, StatusId } from '@data/types';
import { Rng } from '@core/rng';
import { advanceMoves, pickMove } from './ai';
import { computeHit, predictDamage } from './damage';
import { HAND_CAP, dealOne, playCard } from './deck';
import { applyStatus, consumeBlock, consumeBrace, consumeChill, getStatus, hasStatus, removeStatus, tickStatuses } from './status';
import type { Combatant, CombatEvent, CombatState, EnemyCombatant, PlayerAction, PlayerCombatant } from './types';

export interface PlayerSetup {
  name?: string;
  stats: Stats;
  hp?: number;          // carried-over HP; defaults to maxHp
  deck: SkillId[];
  /** Cards added to every fight's deck; defaults to BASIC_DECK (scenes pass the class's basics). Tests pass [] for control. */
  basics?: SkillId[];
}

export interface CombatOptions {
  player: PlayerSetup;
  /** A single enemy, or `enemies` for a pack (front first). One of the two is required. */
  enemy?: EnemyId | Enemy;
  enemies?: (EnemyId | Enemy)[];
  rng: Rng;             // the run's 'combat' stream
  skillUpgrades?: SkillUpgrades;
}

/** The skill as it plays in this fight, with any run-local upgrade applied. */
export const skillInCombat = (state: CombatState, id: SkillId) => skillWith(getSkill(id), state.skillUpgrades);

export const livingEnemies = (state: CombatState): EnemyCombatant[] => state.enemies.filter((e) => !e.dead);

/** The enemy a player action hits: the asked-for slot if alive, else the front-most living one. */
export function resolveTarget(state: CombatState, slot?: number): EnemyCombatant {
  const asked = slot !== undefined ? state.enemies[slot] : undefined;
  if (asked && !asked.dead) return asked;
  return livingEnemies(state)[0] ?? state.enemies[0]!;
}

/** Build the state and run the first round start (deal + intents). */
export function createCombat(opts: CombatOptions): CombatState {
  const sources = opts.enemies ?? (opts.enemy !== undefined ? [opts.enemy] : []);
  if (sources.length === 0) throw new Error('createCombat: no enemy');
  const defs = sources.map((e) => (typeof e === 'string' ? getEnemy(e) : e));
  const roll = () => opts.rng.next();

  const player: PlayerCombatant = {
    side: 'player', name: opts.player.name ?? 'Hero',
    stats: { ...opts.player.stats }, hp: opts.player.hp ?? opts.player.stats.maxHp,
    statuses: [], deck: opts.rng.shuffle([...(opts.player.basics ?? BASIC_DECK), ...opts.player.deck]), hand: [], discard: [], exhausted: [], consumed: [],
  };
  const enemies = defs.map((def, slot) => {
    const base = { side: 'enemy' as const, name: def.name, enemyId: def.id, slot, dead: false, stats: { ...def.stats }, hp: def.stats.maxHp, statuses: [], phase: 0, seqIndex: 0 };
    const e = base as unknown as EnemyCombatant;
    e.current = pickMove(e, def, roll);
    e.next = pickMove(e, def, roll);
    return e;
  });

  const state: CombatState = { skillUpgrades: { ...(opts.skillUpgrades ?? {}) }, round: 0, outcome: 'ongoing', player, enemies, enemyDefs: defs, enemy: enemies[0]!, enemyDef: defs[0]!, rngState: opts.rng.getState(), log: [] };
  const events: CombatEvent[] = [];
  startRound(state, opts.rng, events);
  state.rngState = opts.rng.getState();
  state.log.push(...events);
  return state;
}

/** Events since the given log length; scenes consume these for animation. */
export function eventsSince(state: CombatState, fromIndex: number): CombatEvent[] {
  return state.log.slice(fromIndex);
}

/** The intent display for one enemy this round, with damage predicted against current statuses. */
export function currentIntent(state: CombatState, who = 0): { intent: Intent; predictedDamage: number; moveName: string } {
  const e = state.enemies[who] ?? state.enemy;
  const m = e.current;
  const predictedDamage = m.intent.kind === 'attack'
    ? predictDamage(e, state.player, m.intent.mult, m.intent.hits, m.intent.ignoreDef)
    : 0;
  return { intent: m.intent, predictedDamage, moveName: m.name };
}

/** Every living enemy's intent this round, in slot order. */
export const currentIntents = (state: CombatState) => livingEnemies(state).map((e) => ({ who: e.slot, ...currentIntent(state, e.slot) }));

/** True while the player is Recovering and must pass the turn (the scene auto-steps with `skip`). */
export const isPlayerStunned = (state: CombatState) => hasStatus(state.player, 'stun');

/** Stamp the enemy slot on every event pushed since `from` (events only know sides). */
function tagWho(events: CombatEvent[], from: number, who: number): void {
  for (let i = from; i < events.length; i++) {
    const e = events[i] as CombatEvent & { who?: number };
    if ('who' in e || e.t === 'roundStart' || e.t === 'deal' || e.t === 'handOverflow' || e.t === 'reshuffle' || e.t === 'hold' || e.t === 'exhaust' || e.t === 'consumed' || e.t === 'end') continue;
    e.who = who;
  }
}

/**
 * One full round from the player's decision:
 *   player acts on a target → each living enemy acts (unless Chilled) → end-of-round ticks → next round start.
 * Returns the events of this step; they are also appended to state.log.
 */
export function step(state: CombatState, action: PlayerAction): CombatEvent[] {
  if (state.outcome !== 'ongoing') throw new Error('Combat is over');
  const rng = new Rng(state.rngState);
  const roll = () => rng.next();
  const events: CombatEvent[] = [];

  // Player turn
  if (isPlayerStunned(state)) {
    events.push({ t: 'stunned', side: 'player', turnsLeft: getStatus(state.player, 'stun')!.turns - 1 });
  } else if (action.type === 'skip') {
    if (state.player.hand.length > 0) throw new Error('Cannot skip with cards in hand');
  } else if (action.type === 'hold') {
    const id = playCard(state.player, action.index);
    events.push({ t: 'hold', skill: id });
  } else {
    const target = resolveTarget(state, action.target);
    const skill = skillInCombat(state, playCard(state.player, action.index));
    const from = events.length;
    events.push({ t: 'play', side: 'player', skill: skill.id, name: skill.name });
    if (skill.uses) {
      // Not back into the discard: once-per-fight waits for the next fight, fleeting is gone for good.
      state.player.discard.pop();
      if (skill.uses === 'once_per_fight') { state.player.exhausted.push(skill.id); events.push({ t: 'exhaust', skill: skill.id }); }
      else { state.player.consumed.push(skill.id); events.push({ t: 'consumed', skill: skill.id }); }
    }
    tagWho(events, from, target.slot);
    for (const e of skill.effects) {
      if (e.type === 'damage' && e.targets === 'all') { sweep(state, e, events); continue; }
      if (e.type === 'strip') { strip(e.targets === 'all' ? livingEnemies(state) : [target], e.statuses, events); continue; }
      const f = events.length;
      applyEffects([e], state.player, target, roll, events);
      tagWho(events, f, target.slot);
    }
    if (checkDeaths(state, events)) return finish(state, rng, events);
  }

  // Enemy turns, front to back
  for (const e of livingEnemies(state)) {
    const from = events.length;
    if (!consumeChill(e, events)) {
      const move = e.current;
      events.push({ t: 'play', side: 'enemy', skill: move.id, name: move.name });
      applyEffects(move.effects, e, state.player, roll, events);
    }
    tagWho(events, from, e.slot);
    if (checkDeaths(state, events)) return finish(state, rng, events);
  }

  // End of round: enemies tick first, so an enemy that burns to death never gets its curse ticking on you.
  for (const e of livingEnemies(state)) {
    const from = events.length;
    tickStatuses(e, events);
    tagWho(events, from, e.slot);
    if (checkDeaths(state, events)) return finish(state, rng, events);
  }
  tickStatuses(state.player, events);
  if (checkDeaths(state, events)) return finish(state, rng, events);
  for (const e of livingEnemies(state)) {
    const from = events.length;
    advanceMoves(e, state.enemyDefs[e.slot]!, roll, events);
    tagWho(events, from, e.slot);
  }

  startRound(state, rng, events);
  return finish(state, rng, events);
}

function finish(state: CombatState, rng: Rng, events: CombatEvent[]): CombatEvent[] {
  state.rngState = rng.getState();
  state.log.push(...events);
  return events;
}

function startRound(state: CombatState, rng: Rng, events: CombatEvent[]): void {
  state.round += 1;
  events.push({ t: 'roundStart', round: state.round });
  // The new intents are announced before the deals, so the panels never show last
  // round's promise next to this round's state while cards are animating in.
  for (const e of livingEnemies(state)) {
    const { intent, predictedDamage, moveName } = currentIntent(state, e.slot);
    events.push({ t: 'intent', intent, posture: e.next.posture, predictedDamage, moveName, who: e.slot });
  }
  // Opening hand fills to the cap so round 1 is a choice; afterwards one card per round.
  const deals = state.round === 1 ? HAND_CAP : 1;
  for (let i = 0; i < deals; i++) dealOne(state.player, (a) => rng.shuffle(a), events);
}

function checkDeaths(state: CombatState, events: CombatEvent[]): boolean {
  for (const e of state.enemies) {
    if (e.dead || e.hp > 0) continue;
    e.dead = true;
    events.push({ t: 'death', side: 'enemy', who: e.slot });
  }
  if (state.enemies.every((e) => e.dead)) {
    state.outcome = 'won';
    events.push({ t: 'end', outcome: 'won' });
    return true;
  }
  if (state.player.hp <= 0) {
    events.push({ t: 'death', side: 'player' });
    state.outcome = 'lost';
    events.push({ t: 'end', outcome: 'lost' });
    return true;
  }
  return false;
}

/**
 * A sweep (DECISIONS #44, #47) lands on every living enemy at once: hit 1 on all of them front to back,
 * then hit 2, and so on. Every event of hit N carries `volley: N` so the scene can play a volley together.
 */
function sweep(state: CombatState, e: Extract<Effect, { type: 'damage' }>, events: CombatEvent[]): void {
  const victims = livingEnemies(state);
  const hits = e.hits ?? 1;
  const dealt = victims.map(() => 0);
  for (let i = 0; i < hits; i++) {
    victims.forEach((v, k) => {
      if (v.hp <= 0) return;
      const f = events.length;
      dealt[k]! += applyHit(state.player, v, e, i, hits, events);
      tagWho(events, f, v.slot);
      for (let j = f; j < events.length; j++) (events[j] as CombatEvent & { volley?: number }).volley = i + 1;
    });
  }
  victims.forEach((v, k) => {
    const f = events.length;
    afterHits(state.player, v, e, hits, dealt[k]!, events);
    tagWho(events, f, v.slot);
  });
}

/**
 * Remove guard / remove buffs (DECISIONS #48): the listed statuses leave each victim before the
 * card's hit. A strip over every enemy is volley 0, so the scene plays it on all of them at once.
 */
function strip(victims: EnemyCombatant[], statuses: StatusId[], events: CombatEvent[]): void {
  for (const v of victims) {
    const f = events.length;
    stripStatuses(v, statuses, events);
    tagWho(events, f, v.slot);
    if (victims.length > 1) for (let j = f; j < events.length; j++) (events[j] as CombatEvent & { volley?: number }).volley = 0;
  }
}

function stripStatuses(c: Combatant, statuses: StatusId[], events: CombatEvent[]): void {
  for (const id of statuses) {
    if (!hasStatus(c, id)) continue;
    removeStatus(c, id, events);
    (events[events.length - 1] as Extract<CombatEvent, { t: 'statusExpired' }>).stripped = true;
  }
}

/** One hit of a damage effect: blocks, the damage, Brace's counter. Returns the damage that landed. */
function applyHit(self: Combatant, other: Combatant, e: Extract<Effect, { type: 'damage' }>, i: number, hits: number, events: CombatEvent[]): number {
  const amount = computeHit(self, other, e.mult, e.ignoreDef, e.flat ?? 0, hits);
  // Aegis stops everything; Guard stops physical; Ward stops magic.
  if (hasStatus(other, 'aegis') || consumeBlock(other, e.kind === 'magic' ? 'ward' : 'guard', events)) {
    events.push({ t: 'damage', source: self.side, target: other.side, amount: 0, blocked: true, hit: i + 1, hits, kind: e.kind ?? 'physical' });
    return 0;
  }
  const applied = Math.min(other.hp, amount);
  other.hp -= applied;
  events.push({ t: 'damage', source: self.side, target: other.side, amount: applied, blocked: false, hit: i + 1, hits, kind: e.kind ?? 'physical' });
  // Brace: the first hit that lands is thrown back at the attacker (blockable by Guard, ignores def).
  // A killing blow is never countered: death ends everything the dead side had going.
  if (i === 0 && applied > 0 && other.hp > 0 && consumeBrace(other, events)) {
    // The counter is a physical blow: Guard or Aegis stop it.
    if (hasStatus(self, 'aegis') || consumeBlock(self, 'guard', events)) events.push({ t: 'counter', amount: 0, blocked: true });
    else { const back = Math.min(self.hp, applied); self.hp -= back; events.push({ t: 'counter', amount: back, blocked: false }); }
  }
  return applied;
}

/** What follows the last hit of a damage effect on one target: Scatter is spent, drain heals. */
function afterHits(self: Combatant, other: Combatant, e: Extract<Effect, { type: 'damage' }>, hits: number, dealt: number, events: CombatEvent[]): void {
  if (hits === 1 && hasStatus(other, 'scatter')) removeStatus(other, 'scatter', events);
  if (e.lifesteal && dealt > 0) heal(self, Math.round(dealt * e.lifesteal), events);
}

export function applyEffects(effects: Effect[], self: Combatant, other: Combatant, roll: () => number, events: CombatEvent[]): void {
  for (const e of effects) {
    switch (e.type) {
      case 'damage': {
        const hits = e.hits ?? 1;
        let dealt = 0;
        for (let i = 0; i < hits; i++) {
          if (other.hp <= 0) break;
          dealt += applyHit(self, other, e, i, hits, events);
        }
        afterHits(self, other, e, hits, dealt, events);
        break;
      }
      case 'strip':
        stripStatuses(other, e.statuses, events);
        break;
      case 'heal': {
        const amount = Math.round((e.flat ?? 0) + (e.pct ?? 0) * self.stats.maxHp);
        heal(self, amount, events);
        break;
      }
      case 'status': {
        const target = e.target === 'self' ? self : other;
        // A hostile spell-status (curse, hex) is a magic hit for blocking purposes: Aegis or one Ward stack stops it.
        if (target !== self && e.kind === 'magic' && (hasStatus(target, 'aegis') || consumeBlock(target, 'ward', events))) {
          events.push({ t: 'statusResisted', side: target.side, status: e.status, warded: true });
          break;
        }
        if (e.chance !== undefined && roll() >= e.chance) {
          events.push({ t: 'statusResisted', side: target.side, status: e.status });
          break;
        }
        applyStatus(target, e.status, e.turns, e.magnitude ?? 1, events);
        break;
      }
    }
  }
}

function heal(c: Combatant, amount: number, events: CombatEvent[]): void {
  if (hasStatus(c, 'curse')) amount = Math.floor(amount / 2); // Cursed: healing halved
  const applied = Math.max(0, Math.min(c.stats.maxHp - c.hp, amount));
  if (applied === 0) return;
  c.hp += applied;
  events.push({ t: 'heal', side: c.side, amount: applied });
}

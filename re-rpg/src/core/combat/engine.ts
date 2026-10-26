import { BASIC_DECK } from '@data/skills';
import { getEnemy, getSkill } from '@data/index';
import { skillWith, type SkillUpgrades } from '@core/run/upgrade';
import type { Effect, Enemy, EnemyId, Intent, SkillId, Stats } from '@data/types';
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
  /** Once-per-screen cards already spent on this screen: one deck copy each is left out of the fight. */
  exhausted?: SkillId[];
}

export interface CombatOptions {
  player: PlayerSetup;
  /** A single enemy, or `enemies` for a pack (front first). One of the two is required. */
  enemy?: EnemyId | Enemy;
  enemies?: (EnemyId | Enemy)[];
  rng: Rng;             // the run's 'combat' stream
  skillUpgrades?: SkillUpgrades;
}

/** The deck minus one copy per spent once-per-screen card. */
function withoutSpent(deck: SkillId[], spent: SkillId[]): SkillId[] {
  const out = [...deck];
  for (const id of spent) { const i = out.indexOf(id); if (i >= 0) out.splice(i, 1); }
  return out;
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
    statuses: [], deck: opts.rng.shuffle([...(opts.player.basics ?? BASIC_DECK), ...withoutSpent(opts.player.deck, opts.player.exhausted ?? [])]), hand: [], discard: [], exhausted: [], consumed: [],
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
      if (skill.uses === 'once_per_fight' || skill.uses === 'once_per_screen') { state.player.exhausted.push(skill.id); events.push({ t: 'exhaust', skill: skill.id }); }
      else { state.player.consumed.push(skill.id); events.push({ t: 'consumed', skill: skill.id }); }
    }
    applyEffects(skill.effects, state.player, target, roll, events);
    tagWho(events, from, target.slot);
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

export function applyEffects(effects: Effect[], self: Combatant, other: Combatant, roll: () => number, events: CombatEvent[]): void {
  for (const e of effects) {
    switch (e.type) {
      case 'damage': {
        const hits = e.hits ?? 1;
        let dealt = 0;
        for (let i = 0; i < hits; i++) {
          if (other.hp <= 0) break;
          const amount = computeHit(self, other, e.mult, e.ignoreDef, e.flat ?? 0, hits);
          // Aegis stops everything; Guard stops physical; Ward stops magic.
          if (hasStatus(other, 'aegis') || consumeBlock(other, e.kind === 'magic' ? 'ward' : 'guard', events)) {
            events.push({ t: 'damage', source: self.side, target: other.side, amount: 0, blocked: true, hit: i + 1, hits, kind: e.kind ?? 'physical' });
            continue;
          }
          const applied = Math.min(other.hp, amount);
          other.hp -= applied;
          dealt += applied;
          events.push({ t: 'damage', source: self.side, target: other.side, amount: applied, blocked: false, hit: i + 1, hits, kind: e.kind ?? 'physical' });
          // Brace: the first hit that lands is thrown back at the attacker (blockable by Guard, ignores def).
          // A killing blow is never countered: death ends everything the dead side had going.
          if (i === 0 && applied > 0 && other.hp > 0 && consumeBrace(other, events)) {
            // The counter is a physical blow: Guard or Aegis stop it.
            if (hasStatus(self, 'aegis') || consumeBlock(self, 'guard', events)) events.push({ t: 'counter', amount: 0, blocked: true });
            else { const back = Math.min(self.hp, applied); self.hp -= back; events.push({ t: 'counter', amount: back, blocked: false }); }
          }
        }
        if (hits === 1 && hasStatus(other, 'scatter')) removeStatus(other, 'scatter', events);
        if (e.lifesteal && dealt > 0) heal(self, Math.round(dealt * e.lifesteal), events);
        break;
      }
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

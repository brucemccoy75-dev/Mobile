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
  /** Cards added to every fight's deck; defaults to BASIC_DECK. Tests pass [] for control. */
  basics?: SkillId[];
}

export interface CombatOptions {
  player: PlayerSetup;
  enemy: EnemyId | Enemy;
  rng: Rng;             // the run's 'combat' stream
  skillUpgrades?: SkillUpgrades;
}

/** The skill as it plays in this fight, with any run-local upgrade applied. */
export const skillInCombat = (state: CombatState, id: SkillId) => skillWith(getSkill(id), state.skillUpgrades);

/** Build the state and run the first round start (deal + intent). */
export function createCombat(opts: CombatOptions): CombatState {
  const def = typeof opts.enemy === 'string' ? getEnemy(opts.enemy) : opts.enemy;
  const roll = () => opts.rng.next();

  const player: PlayerCombatant = {
    side: 'player', name: opts.player.name ?? 'Hero',
    stats: { ...opts.player.stats }, hp: opts.player.hp ?? opts.player.stats.maxHp,
    statuses: [], deck: opts.rng.shuffle([...(opts.player.basics ?? BASIC_DECK), ...opts.player.deck]), hand: [], discard: [], exhausted: [], consumed: [],
  };
  const enemyBase = { side: 'enemy' as const, name: def.name, enemyId: def.id, stats: { ...def.stats }, hp: def.stats.maxHp, statuses: [], phase: 0, seqIndex: 0 };
  const enemy = enemyBase as unknown as EnemyCombatant;
  enemy.current = pickMove(enemy, def, roll);
  enemy.next = pickMove(enemy, def, roll);

  const state: CombatState = { skillUpgrades: { ...(opts.skillUpgrades ?? {}) }, round: 0, outcome: 'ongoing', player, enemy, enemyDef: def, rngState: opts.rng.getState(), log: [] };
  const events: CombatEvent[] = [];
  startRound(state, def, opts.rng, events);
  state.rngState = opts.rng.getState();
  state.log.push(...events);
  return state;
}

/** Events since the given log length; scenes consume these for animation. */
export function eventsSince(state: CombatState, fromIndex: number): CombatEvent[] {
  return state.log.slice(fromIndex);
}

/** The intent display for the current round, with damage predicted against current statuses. */
export function currentIntent(state: CombatState): { intent: Intent; predictedDamage: number; moveName: string } {
  const m = state.enemy.current;
  const predictedDamage = m.intent.kind === 'attack'
    ? predictDamage(state.enemy, state.player, m.intent.mult, m.intent.hits, m.intent.ignoreDef)
    : 0;
  return { intent: m.intent, predictedDamage, moveName: m.name };
}

/** True while the player is Recovering and must pass the turn (the scene auto-steps with `skip`). */
export const isPlayerStunned = (state: CombatState) => hasStatus(state.player, 'stun');

/**
 * One full round from the player's decision:
 *   player acts → enemy acts (unless Chilled) → end-of-round ticks → next round start.
 * Returns the events of this step; they are also appended to state.log.
 */
export function step(state: CombatState, action: PlayerAction): CombatEvent[] {
  if (state.outcome !== 'ongoing') throw new Error('Combat is over');
  const def = state.enemyDef;
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
    const skill = skillInCombat(state, playCard(state.player, action.index));
    events.push({ t: 'play', side: 'player', skill: skill.id, name: skill.name });
    if (skill.uses) {
      // Not back into the discard: once-per-fight waits for the next fight, fleeting is gone for good.
      state.player.discard.pop();
      if (skill.uses === 'once_per_fight') { state.player.exhausted.push(skill.id); events.push({ t: 'exhaust', skill: skill.id }); }
      else { state.player.consumed.push(skill.id); events.push({ t: 'consumed', skill: skill.id }); }
    }
    applyEffects(skill.effects, state.player, state.enemy, roll, events);
    if (checkDeaths(state, events)) return finish(state, rng, events);
  }

  // Enemy turn
  if (!consumeChill(state.enemy, events)) {
    const move = state.enemy.current;
    events.push({ t: 'play', side: 'enemy', skill: move.id, name: move.name });
    applyEffects(move.effects, state.enemy, state.player, roll, events);
    if (checkDeaths(state, events)) return finish(state, rng, events);
  }

  // End of round: the enemy's ticks first, so an enemy that burns to death never gets its curse ticking on you.
  tickStatuses(state.enemy, events);
  if (checkDeaths(state, events)) return finish(state, rng, events);
  tickStatuses(state.player, events);
  if (checkDeaths(state, events)) return finish(state, rng, events);
  advanceMoves(state.enemy, def, roll, events);

  startRound(state, def, rng, events);
  return finish(state, rng, events);
}

function finish(state: CombatState, rng: Rng, events: CombatEvent[]): CombatEvent[] {
  state.rngState = rng.getState();
  state.log.push(...events);
  return events;
}

function startRound(state: CombatState, _def: Enemy, rng: Rng, events: CombatEvent[]): void {
  state.round += 1;
  events.push({ t: 'roundStart', round: state.round });
  // The new intent is announced before the deals, so the panel never shows last
  // round's promise next to this round's state while cards are animating in.
  const { intent, predictedDamage, moveName } = currentIntent(state);
  events.push({ t: 'intent', intent, posture: state.enemy.next.posture, predictedDamage, moveName });
  // Opening hand fills to the cap so round 1 is a choice; afterwards one card per round.
  const deals = state.round === 1 ? HAND_CAP : 1;
  for (let i = 0; i < deals; i++) dealOne(state.player, (a) => rng.shuffle(a), events);
}

function checkDeaths(state: CombatState, events: CombatEvent[]): boolean {
  if (state.enemy.hp <= 0) {
    events.push({ t: 'death', side: 'enemy' });
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

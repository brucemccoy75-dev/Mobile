import { BASIC_DECK } from '@data/skills';
import { getEnemy, getSkill } from '@data/index';
import { skillWith, type SkillUpgrades } from '@core/run/upgrade';
import type { Condition, Effect, Enemy, EnemyId, Intent, Skill, SkillId, Stats, StatusId } from '@data/types';
import { Rng } from '@core/rng';
import { vfxForEffects, vfxForSkill } from '@core/vfx';
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

  const state: CombatState = { skillUpgrades: { ...(opts.skillUpgrades ?? {}) }, round: 0, outcome: 'ongoing', player, enemies, enemyDefs: defs, enemy: enemies[0]!, enemyDef: defs[0]!, rngState: opts.rng.getState(), log: [], playsLeft: 1 };
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
    if (playableIndices(state).length > 0) throw new Error('Cannot skip with a playable card in hand');
  } else if (action.type === 'hold') {
    const id = playCard(state.player, action.index);
    events.push({ t: 'hold', skill: id });
    state.playsLeft -= 1;
  } else {
    const target = resolveTarget(state, action.target);
    const asked = state.player.hand[action.index];
    if (asked !== undefined && isLocked(state, asked)) throw new Error(`Regen: ${asked} deals damage and cannot be played`);
    const skill = skillInCombat(state, playCard(state.player, action.index));
    const from = events.length;
    events.push({ t: 'play', side: 'player', skill: skill.id, name: skill.name, vfx: vfxForSkill(skill) });
    if (skill.uses) {
      // Not back into the discard: once-per-fight waits for the next fight, fleeting is gone for good.
      state.player.discard.pop();
      if (skill.uses === 'once_per_fight') { state.player.exhausted.push(skill.id); events.push({ t: 'exhaust', skill: skill.id }); }
      else { state.player.consumed.push(skill.id); events.push({ t: 'consumed', skill: skill.id }); }
    }
    tagWho(events, from, target.slot);
    // A branching card (DECISIONS #69) becomes the branch it takes, before anything else rolls.
    const effects = resolveBranches(skill.effects, state, target, action.call ?? 'heads', roll, events);
    // Luck (DECISIONS #50): one roll per damage card for a critical hit. Luck 0 rolls nothing.
    const luckChance = (state.player.stats.luck ?? 0) * LUCK_PER_POINT;
    const crit = luckChance > 0 && effects.some((e) => e.type === 'damage') && roll() < luckChance;
    if (crit) events.push({ t: 'crit' });
    const struck = effects.some((e) => e.type === 'damage' && e.targets === 'all') ? livingEnemies(state) : [target];
    for (const e of effects) {
      if (e.type === 'damage' && e.targets === 'all') { sweep(state, e, events, crit); continue; }
      // Backfire (DECISIONS #51): compiled last, so the damage has landed; a survivor among those struck turns it on you.
      if (e.type === 'backfire') {
        if (struck.some((v) => v.hp > 0)) {
          const amount = Math.min(state.player.hp, Math.round(e.pct * state.player.stats.maxHp));
          state.player.hp -= amount;
          events.push({ t: 'backfire', amount });
        }
        continue;
      }
      if (e.type === 'strip') { strip(e.targets === 'all' ? livingEnemies(state) : [target], e.statuses, events); continue; }
      if (e.type === 'extraPlay') { state.playsLeft += e.n; continue; }
      if (e.type === 'draw') { for (let i = 0; i < e.upTo && state.player.hand.length < e.upTo; i++) dealOne(state.player, (a) => rng.shuffle(a), events); continue; }
      const f = events.length;
      applyEffects([e], state.player, target, roll, events, crit);
      tagWho(events, f, target.slot);
    }
    // Blackjack (DECISIONS #69, #71): playing it draws a playing card onto the total; then what lands
    // adds to it. Past 21 you die, even on a killing blow.
    if (effects.some((e) => e.type === 'status' && e.target === 'self' && e.status === 'blackjack')) {
      const rank = CARD_RANKS[Math.floor(roll() * CARD_RANKS.length)]!, suit = CARD_SUITS[Math.floor(roll() * CARD_SUITS.length)]!;
      const value = blackjackValue(rank);
      if (rank === 'A') state.blackjackSoft = (state.blackjackSoft ?? 0) + 1;
      const total = addToBlackjack(state, value);
      events.push({ t: 'blackjackDraw', rank, suit, value, total });
      if (total > BLACKJACK_LIMIT) return bust(state, rng, events, total);
    }
    if (hasStatus(state.player, 'blackjack')) {
      const landed = events.slice(from).reduce((a, e) => a + (e.t === 'damage' && e.source === 'player' ? e.amount : 0), 0);
      if (landed > 0) {
        const total = addToBlackjack(state, landed);
        if (total > BLACKJACK_LIMIT) return bust(state, rng, events, total);
        events.push({ t: 'blackjack', total });
      }
    }
    if (checkDeaths(state, events)) return finish(state, rng, events);
    state.playsLeft -= 1;
    // ...and one for a bonus turn: one more card before the enemies move; once per round, never on an empty hand.
    if (luckChance > 0 && !state.bonusTaken && state.player.hand.length > 0 && roll() < luckChance) {
      state.bonusTaken = true;
      state.playsLeft += 1;
      events.push({ t: 'bonusTurn' });
    }
  }

  // One play per enemy alive when the turn began (DECISIONS #68), so a kill keeps the rest: the
  // enemies wait until the plays are used or the hand is empty. Nothing ticks inside a turn, but the
  // hand is back to 3 before every card (#70).
  if (action.type !== 'skip' && !events.some((e) => e.t === 'stunned') && state.playsLeft > 0) {
    for (let i = 0; i < HAND_CAP && state.player.hand.length < HAND_CAP; i++) dealOne(state.player, (a) => rng.shuffle(a), events);
  }
  if (action.type !== 'skip' && !events.some((e) => e.t === 'stunned') && state.playsLeft > 0 && state.player.hand.length > 0) {
    events.push({ t: 'plays', left: state.playsLeft });
    return finish(state, rng, events);
  }

  // Enemy turns, front to back
  for (const e of livingEnemies(state)) {
    const from = events.length;
    if (!consumeChill(e, events)) {
      const move = e.current;
      events.push({ t: 'play', side: 'enemy', skill: move.id, name: move.name, vfx: vfxForEffects(move.effects) });
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
  state.bonusTaken = false;
  events.push({ t: 'roundStart', round: state.round });
  // The new intents are announced before the deals, so the panels never show last
  // round's promise next to this round's state while cards are animating in.
  for (const e of livingEnemies(state)) {
    const { intent, predictedDamage, moveName } = currentIntent(state, e.slot);
    events.push({ t: 'intent', intent, posture: e.next.posture, predictedDamage, moveName, who: e.slot });
  }
  // Every round starts with a full hand (DECISIONS #53): draw whatever is missing, none if nothing was played (inside a turn the hand refills after each card, #70).
  const deals = Math.max(0, HAND_CAP - state.player.hand.length);
  for (let i = 0; i < deals; i++) dealOne(state.player, (a) => rng.shuffle(a), events);
  state.playsLeft = Math.max(1, livingEnemies(state).length);
  if (state.playsLeft > 1) events.push({ t: 'plays', left: state.playsLeft });
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
function sweep(state: CombatState, e: Extract<Effect, { type: 'damage' }>, events: CombatEvent[], crit = false): void {
  const victims = livingEnemies(state);
  const hits = e.hits ?? 1;
  const dealt = victims.map(() => 0);
  for (let i = 0; i < hits; i++) {
    victims.forEach((v, k) => {
      if (v.hp <= 0) return;
      const f = events.length;
      dealt[k]! += applyHit(state.player, v, e, i, hits, events, crit);
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

/** Blackjack's bust line (DECISIONS #69). */
export const BLACKJACK_LIMIT = 21;
/** What a Utility Knife (or any `targetDebuffed` card) counts as a debuff. */
export const DEBUFFS: readonly StatusId[] = ['exposed', 'weak', 'burn', 'chill', 'stun', 'curse'];

const CARD_RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'] as const;
const CARD_SUITS = ['♠', '♥', '♦', '♣'] as const;
/** A playing card's blackjack value: Ace 11 (it can drop to 1), faces 10, the rest their number. */
export const blackjackValue = (rank: string): number => (rank === 'A' ? 11 : rank === 'J' || rank === 'Q' || rank === 'K' ? 10 : Number(rank));

/** Add to Blackjack's total; an Ace still counted as 11 drops to 1 rather than let it pass 21. */
function addToBlackjack(state: CombatState, n: number): number {
  let total = (state.blackjackTotal ?? 0) + n;
  while (total > BLACKJACK_LIMIT && (state.blackjackSoft ?? 0) > 0) { total -= 10; state.blackjackSoft = (state.blackjackSoft ?? 0) - 1; }
  state.blackjackTotal = total;
  return total;
}

function bust(state: CombatState, rng: Rng, events: CombatEvent[], total: number): CombatEvent[] {
  state.player.hp = 0;
  state.outcome = 'lost';
  events.push({ t: 'bust', total }, { t: 'death', side: 'player' }, { t: 'end', outcome: 'lost' });
  return finish(state, rng, events);
}

const dealsDamage = (effects: Effect[]): boolean => effects.some((e) => e.type === 'damage' || (e.type === 'if' && (dealsDamage(e.then) || dealsDamage(e.else))));
/** Regen (DECISIONS #69): while it lasts, no card that can deal damage may be played. */
export const isLocked = (state: CombatState, id: SkillId): boolean => hasStatus(state.player, 'regen') && dealsDamage(skillInCombat(state, id).effects);
export const canPlay = (state: CombatState, index: number): boolean => { const id = state.player.hand[index]; return id !== undefined && !isLocked(state, id); };
export const playableIndices = (state: CombatState): number[] => state.player.hand.map((_, i) => i).filter((i) => canPlay(state, i));

function holds(cond: Condition, state: CombatState, target: Combatant): boolean {
  if (cond.kind === 'selfHpBelow') return state.player.hp < cond.pct * state.player.stats.maxHp;
  if (cond.kind === 'targetDebuffed') return DEBUFFS.some((id) => hasStatus(target, id));
  return true;
}

/** Replace each branch with the side it takes; a coin is flipped here and its call compared. */
function resolveBranches(effects: Effect[], state: CombatState, target: Combatant, call: 'heads' | 'tails', roll: () => number, events: CombatEvent[]): Effect[] {
  return effects.flatMap((e) => {
    if (e.type !== 'if') return [e];
    let yes: boolean;
    if (e.cond.kind === 'coin') {
      const result = roll() < 0.5 ? 'heads' : 'tails';
      yes = result === call;
      events.push({ t: 'coin', call, result, won: yes });
    } else yes = holds(e.cond, state, target);
    return resolveBranches(yes ? e.then : e.else, state, target, call, roll, events);
  });
}

/** The effects a card would have right now against `target`, for its face and the sim: a coin shows its winning side. */
export function effectsNow(state: CombatState, skill: Skill, target: Combatant): Effect[] {
  return skill.effects.flatMap((e) => (e.type !== 'if' ? [e] : effectsNow(state, { ...skill, effects: e.cond.kind === 'coin' || holds(e.cond, state, target) ? e.then : e.else }, target)));
}

/** Luck (DECISIONS #50, #52): each point is 0.2% chance of a critical hit and of a bonus turn, per card; base luck 5 is 1%. */
export const LUCK_PER_POINT = 0.002;
export const CRIT_MULT = 1.5;

/** One hit of a damage effect: blocks, the damage, Brace's counter. Returns the damage that landed. */
function applyHit(self: Combatant, other: Combatant, e: Extract<Effect, { type: 'damage' }>, i: number, hits: number, events: CombatEvent[], crit = false): number {
  const base = computeHit(self, other, e.mult, e.ignoreDef, e.flat ?? 0, hits);
  // A critical hit (DECISIONS #50) is +50% of what would land, rounded up.
  const amount = crit ? Math.ceil(base * CRIT_MULT) : base;
  // Aegis stops everything; Guard stops physical; Ward stops magic.
  if (hasStatus(other, 'aegis') || consumeBlock(other, e.kind === 'magic' ? 'ward' : 'guard', events)) {
    events.push({ t: 'damage', source: self.side, target: other.side, amount: 0, blocked: true, hit: i + 1, hits, kind: e.kind ?? 'physical' });
    return 0;
  }
  const applied = Math.min(other.hp, amount);
  other.hp -= applied;
  events.push({ t: 'damage', source: self.side, target: other.side, amount: applied, blocked: false, hit: i + 1, hits, kind: e.kind ?? 'physical', ...(crit ? { crit: true } : {}) });
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

export function applyEffects(effects: Effect[], self: Combatant, other: Combatant, roll: () => number, events: CombatEvent[], crit = false): void {
  for (const e of effects) {
    switch (e.type) {
      case 'damage': {
        const hits = e.hits ?? 1;
        let dealt = 0;
        for (let i = 0; i < hits; i++) {
          if (other.hp <= 0) break;
          dealt += applyHit(self, other, e, i, hits, events, crit);
        }
        afterHits(self, other, e, hits, dealt, events);
        break;
      }
      case 'strip':
        stripStatuses(other, e.statuses, events);
        break;
      case 'backfire':
      case 'if':
      case 'extraPlay':
      case 'draw':
        break; // the player's card play resolves these in step(); no enemy move carries one
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

import type { Condition, Effect, Skill, Stats, StatusId } from './types';

const STATUS_NAME: Record<StatusId, string> = {
  exposed: 'Exposed', guard: 'Guard', ward: 'Ward', aegis: 'Aegis', burn: 'Burn', chill: 'Chill', weak: 'Weak', stun: 'Recovering', brace: 'Braced', scatter: 'Scattered', curse: 'Cursed', harden: 'Hardened',
  regen: 'Lunch Break', blackjack: 'Blackjack',
};

const rounds = (n: number) => `${n} round${n === 1 ? '' : 's'}`;

/** Base damage of one hit with the given stats: class attack × multiplier + gear attack + flat. Enemy defence and intent are not considered. */
export function baseHit(stats: Stats, e: Extract<Effect, { type: 'damage' }>): number {
  const gear = stats.gearAtk ?? 0;
  return Math.max(1, Math.round((stats.atk - gear) * e.mult) + gear + (e.flat ?? 0));
}

/**
 * Card text with real numbers for the current hero ("Deal 8 damage" rather than
 * "160%"). Deliberately ignores the enemy: what the card does, not what will land.
 */
export function describeSkill(skill: Skill, stats: Stats): string {
  const parts = describeEffects(skill.effects, stats);
  if (skill.grow) parts.push(`+${skill.grow} damage every time it lands, for the run.`);
  if (skill.locksCards) parts.push('While you hold it, you can take no other card.');
  if (skill.uses === 'once_per_fight') parts.push('Once per fight.');
  if (skill.uses === 'fleeting') parts.push('Fleeting: spent when played.');
  return parts.join(' ');
}

/** What a branch asks, as the start of its sentence (DECISIONS #69). */
const askText = (c: Condition): [string, string] =>
  c.kind === 'selfHpBelow' ? [`If your HP is below ${Math.round(c.pct * 100)}%:`, 'Otherwise:']
  : c.kind === 'targetDebuffed' ? ['If the enemy has a debuff:', 'Otherwise:']
  : ['Call the coin. Right:', 'Wrong:'];

/** Plain timed statuses on yourself, which read as one sentence when several share a duration. */
const PLAIN_SELF: ReadonlySet<StatusId> = new Set(['weak', 'exposed', 'curse', 'burn', 'harden', 'brace', 'scatter']);
const isPlainSelf = (e: Effect): e is Extract<Effect, { type: 'status' }> => e.type === 'status' && e.target === 'self' && PLAIN_SELF.has(e.status) && e.chance === undefined;

function describeEffects(effects: Effect[], stats: Stats): string[] {
  const parts: string[] = [];
  // Several plain statuses on yourself for the same rounds: "You are Weak, Exposed and Cursed for 2 rounds." (#69)
  const group = effects.filter(isPlainSelf);
  const merged = group.length > 1 && group.every((g) => g.turns === group[0]!.turns);
  if (merged) {
    const names = group.map((g) => STATUS_NAME[g.status]);
    parts.push(`You are ${names.slice(0, -1).join(', ')} and ${names.at(-1)} for ${rounds(group[0]!.turns)}.`);
  }
  for (const e of effects) {
    if (merged && isPlainSelf(e)) continue;
    switch (e.type) {
      case 'if': {
        const [yes, no] = askText(e.cond);
        parts.push(`${yes} ${describeEffects(e.then, stats).join(' ')}`);
        if (e.else.length) parts.push(`${no} ${describeEffects(e.else, stats).join(' ')}`);
        break;
      }
      case 'extraPlay':
        parts.push(`${e.n === 1 ? 'One more card' : `${e.n} more cards`} this turn.`);
        break;
      case 'draw':
        parts.push(`Draw to ${e.upTo} cards.`);
        break;
      case 'damage': {
        const n = baseHit(stats, e);
        const hits = e.hits ?? 1;
        const kind = e.kind === 'magic' ? 'magic ' : '';
        let s = hits > 1 ? `${hits} hits of ${n} ${kind}damage` : `Deal ${n} ${kind}damage`;
        if (e.targets === 'all') s += ' to every enemy';
        if (e.ignoreDef) s += ', ignoring defence';
        if (e.lifesteal) s += `, heal ${e.lifesteal >= 1 ? 'all' : e.lifesteal === 0.5 ? 'half' : `${Math.round(e.lifesteal * 100)}%`} of it`;
        parts.push(s + '.');
        break;
      }
      case 'strip': {
        // Remove guard / remove buffs (DECISIONS #48): compiled ahead of the damage, read first.
        const whose = e.targets === 'all' ? "every enemy's" : "the enemy's";
        parts.push(e.statuses.length === 1 ? `Remove ${whose} ${STATUS_NAME[e.statuses[0]!]} first.` : `Remove ${whose} buffs first.`);
        break;
      }
      case 'backfire':
        parts.push(e.pct >= 1 ? 'If the target survives, you lose all your HP.' : `If the target survives, you lose ${Math.round(e.pct * stats.maxHp)} HP.`);
        break;
      case 'heal': {
        const n = Math.round((e.flat ?? 0) + (e.pct ?? 0) * stats.maxHp);
        parts.push(`Heal ${n} HP.`);
        break;
      }
      case 'status': {
        const chance = e.chance !== undefined && e.chance < 1 ? `${Math.round(e.chance * 100)}% chance: ` : '';
        if (e.target === 'self') {
          if (e.status === 'guard') parts.push(`Block the next ${e.magnitude === 1 || !e.magnitude ? 'physical hit' : `${e.magnitude} physical hits`}.`);
          else if (e.status === 'ward') parts.push(`Block the next ${e.magnitude === 1 || !e.magnitude ? 'magic hit or curse' : `${e.magnitude} magic hits or curses`}.`);
          else if (e.status === 'aegis') parts.push(`Block every hit for ${rounds(e.turns)}.`);
          else if (e.status === 'weak') parts.push(e.turns <= 2 ? 'Tiring: Weak next turn.' : `You are Weak for ${rounds(e.turns)}.`);
          else if (e.status === 'stun') parts.push(`Recovering: skip your next ${e.turns - 1} turn${e.turns - 1 === 1 ? '' : 's'}.`);
          else if (e.status === 'exposed') parts.push(e.turns === 1 ? 'You are Exposed this round.' : `You are Exposed for ${rounds(e.turns)}.`);
          else if (e.status === 'regen') parts.push(`Lunch Break: heal ${Math.round((stats.maxHp * (e.magnitude ?? 0)) / 100)} HP a round for ${rounds(e.turns)}. No damage cards meanwhile.`);
          else if (e.status === 'blackjack') parts.push(`Blackjack: draw a card to start your total (A 11 or 1, faces 10). Hits deal ${e.magnitude ?? 1}× for the fight and add to it. Over 21, you die.`);
          else if (e.status === 'curse') parts.push(`You are Cursed (${e.magnitude ?? 1} a round, heals halved) for ${rounds(e.turns)}.`);
          else parts.push(`You are ${STATUS_NAME[e.status]} for ${rounds(e.turns)}.`);
        } else {
          if (e.status === 'burn' || e.status === 'curse') parts.push(`${chance}${STATUS_NAME[e.status]} ${e.magnitude ?? 1} per round for ${rounds(e.turns)}.`);
          else if (e.status === 'chill') parts.push(`${chance}Chill: the enemy skips its next action.`);
          else parts.push(`${chance}Enemy ${STATUS_NAME[e.status]} for ${rounds(e.turns)}.`);
        }
        break;
      }
    }
  }
  return parts;
}

/** Card face: colour family plus the one number that matters, shown large under the text (DECISIONS #28). */
export type CardKind = 'attack' | 'defense' | 'heal' | 'magic';
export interface CardFace { kind: CardKind; value: string; unit: string; }
/** What a damage card will do to the current target, hit by hit, with the reasons the number differs from the card's own (DECISIONS #40). Computed by core/combat `previewDamage`. */
export interface CardPreview { hits: { amount: number; blocked: boolean }[]; reasons: string[]; }

/**
 * With a `preview` (in combat, against the chosen target) the headline is the number that will
 * actually land, armour, Harden, Exposed, Weak, Scatter and blocks included, and the unit names
 * why it differs from the text's base number. Without one (shop, rewards) it is the base.
 */
export function cardFace(skill: Skill, stats: Stats, preview?: CardPreview): CardFace {
  // A branching card's face is its first side; in combat the scene passes the side it would take now (DECISIONS #69).
  const effects = skill.effects.flatMap((e) => (e.type === 'if' ? e.then : [e]));
  const dmg = effects.find((e): e is Extract<Effect, { type: 'damage' }> => e.type === 'damage');
  const heal = effects.find((e): e is Extract<Effect, { type: 'heal' }> => e.type === 'heal');
  const st = effects.filter((e): e is Extract<Effect, { type: 'status' }> => e.type === 'status');
  if (dmg) {
    const hits = dmg.hits ?? 1, n = baseHit(stats, dmg);
    const magic = dmg.kind === 'magic';
    const kind = magic ? 'magic' : 'attack', unit = (magic ? 'magic' : 'damage') + (dmg.targets === 'all' ? ' to all' : '');
    if (!preview) return { kind, value: hits > 1 ? `${n}×${hits}` : `${n}`, unit };
    const landing = preview.hits.filter((h) => !h.blocked);
    const why = preview.reasons.length ? ` · ${preview.reasons.join(', ')}` : '';
    if (landing.length === 0) return { kind, value: '0', unit: `blocked${why}` };
    const same = landing.every((h) => h.amount === landing[0]!.amount);
    const value = landing.length > 1 && same && landing.length === hits ? `${landing[0]!.amount}×${hits}` : `${landing.reduce((a, h) => a + h.amount, 0)}`;
    return { kind, value, unit: unit + why };
  }
  if (heal) return { kind: 'heal', value: `${Math.round((heal.flat ?? 0) + (heal.pct ?? 0) * stats.maxHp)}`, unit: 'heal' };
  const regen = st.find((e) => e.target === 'self' && e.status === 'regen');
  if (regen) return { kind: 'heal', value: `${Math.round((stats.maxHp * (regen.magnitude ?? 0)) / 100)}×${regen.turns}`, unit: 'heal' };
  const bj = st.find((e) => e.target === 'self' && e.status === 'blackjack');
  if (bj) return { kind: 'attack', value: `×${bj.magnitude ?? 1}`, unit: 'to 21' };
  const block = st.find((e) => e.target === 'self' && (e.status === 'guard' || e.status === 'ward' || e.status === 'aegis'));
  if (block) {
    if (block.status === 'aegis') return { kind: 'defense', value: `${block.turns}`, unit: block.turns === 1 ? 'round' : 'rounds' };
    const m = block.magnitude ?? 1;
    return { kind: 'defense', value: `${m}`, unit: block.status === 'ward' ? (m === 1 ? 'spell' : 'spells') : (m === 1 ? 'hit' : 'hits') };
  }
  const hostile = st.find((e) => e.target === 'enemy');
  if (hostile) {
    if (hostile.status === 'burn' || hostile.status === 'curse') return { kind: 'magic', value: `${hostile.magnitude ?? 1}×${hostile.turns}`, unit: STATUS_NAME[hostile.status].toLowerCase() };
    if (hostile.status === 'chill') return { kind: 'magic', value: '1', unit: 'skip' };
    return { kind: 'magic', value: `${hostile.turns}`, unit: STATUS_NAME[hostile.status].toLowerCase() };
  }
  // A side that only costs you (Utility Knife against a clean enemy, #69): say so instead of a blank face.
  const cost = st.find((e) => e.target === 'self' && (e.status === 'weak' || e.status === 'exposed' || e.status === 'curse'));
  if (cost && st.every((e) => e.target === 'self') && !effects.some((e) => e.type === 'strip')) return { kind: 'defense', value: '0', unit: `${STATUS_NAME[cost.status].toLowerCase()} on you` };
  const strip = effects.find((e): e is Extract<Effect, { type: 'strip' }> => e.type === 'strip');
  if (strip) return { kind: 'attack', value: '', unit: strip.statuses.length === 1 ? `removes ${STATUS_NAME[strip.statuses[0]!].toLowerCase()}` : 'removes buffs' };
  return { kind: 'defense', value: '', unit: '' };
}


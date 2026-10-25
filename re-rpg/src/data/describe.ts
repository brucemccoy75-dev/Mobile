import type { Effect, Skill, Stats, StatusId } from './types';

const STATUS_NAME: Record<StatusId, string> = {
  exposed: 'Exposed', guard: 'Guard', ward: 'Ward', aegis: 'Aegis', burn: 'Burn', chill: 'Chill', weak: 'Weak', stun: 'Recovering', brace: 'Braced', scatter: 'Scattered', curse: 'Cursed', harden: 'Hardened',
};

const rounds = (n: number) => `${n} round${n === 1 ? '' : 's'}`;

/** Base damage of one hit with the given stats: attack × multiplier + flat. Enemy defence and intent are not considered. */
export function baseHit(stats: Stats, e: Extract<Effect, { type: 'damage' }>): number {
  return Math.max(1, Math.round(stats.atk * e.mult) + (e.flat ?? 0));
}

/**
 * Card text with real numbers for the current hero ("Deal 8 damage" rather than
 * "160%"). Deliberately ignores the enemy: what the card does, not what will land.
 */
export function describeSkill(skill: Skill, stats: Stats): string {
  const parts: string[] = [];
  for (const e of skill.effects) {
    switch (e.type) {
      case 'damage': {
        const n = baseHit(stats, e);
        const hits = e.hits ?? 1;
        const kind = e.kind === 'magic' ? 'magic ' : '';
        let s = hits > 1 ? `${hits} hits of ${n} ${kind}damage` : `Deal ${n} ${kind}damage`;
        if (e.ignoreDef) s += ', ignoring defence';
        if (e.lifesteal) s += `, heal ${e.lifesteal >= 1 ? 'all' : e.lifesteal === 0.5 ? 'half' : `${Math.round(e.lifesteal * 100)}%`} of it`;
        parts.push(s + '.');
        break;
      }
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
  if (skill.uses === 'once_per_fight') parts.push('Once per fight.');
  if (skill.uses === 'fleeting') parts.push('Fleeting: spent when played.');
  return parts.join(' ');
}

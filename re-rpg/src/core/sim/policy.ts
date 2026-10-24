import { getSkill } from '@data/index';
import type { Effect } from '@data/types';
import { currentIntent, hasStatus, type CombatState, type PlayerAction } from '@core/combat';

export type Policy = (s: CombatState) => PlayerAction;

const has = (effects: Effect[], pred: (e: Effect) => boolean) => effects.some(pred);
const isHeal = (e: Effect) => e.type === 'heal' || (e.type === 'damage' && !!e.lifesteal);
const isGuard = (e: Effect) => e.type === 'status' && e.target === 'self' && e.status === 'guard';
const isDamage = (e: Effect) => e.type === 'damage';
const selfExposes = (e: Effect) => e.type === 'status' && e.target === 'self' && e.status === 'exposed';
const dmgValue = (effects: Effect[], enemyAttacking: boolean) =>
  effects.reduce((v, e) => {
    if (e.type === 'damage') return v + e.mult * (e.hits ?? 1) + (e.ignoreDef ? 0.5 : 0);
    if (e.type === 'status' && e.target === 'enemy') {
      // Chill is consumed by the enemy's next action: worthless unless that action is an attack.
      if (e.status === 'chill') return v + (enemyAttacking ? 1.2 : 0) * (e.chance ?? 1);
      return v + (e.status === 'exposed' ? 1.5 : e.status === 'burn' ? (e.magnitude ?? 1) * e.turns * 0.25 : 0.6) * (e.chance ?? 1);
    }
    return v;
  }, 0);

/**
 * Greedy, intent-reading policy. Not clever, deliberately: it approximates a
 * player who reads the screen and takes the obvious play, which is the
 * baseline the balance should be tuned around.
 */
export const greedy: Policy = (s) => {
  const { intent, predictedDamage } = currentIntent(s);
  const hp = s.player.hp;
  const maxHp = s.player.stats.maxHp;
  const guarded = hasStatus(s.player, 'guard');
  const hand = s.player.hand.map((id, index) => ({ index, skill: getSkill(id) }));
  const incomingAttack = intent.kind === 'attack';
  const enemyGuarded = hasStatus(s.enemy, 'guard');

  // 1. Lethal or heavy incoming hit and no guard: block. "Heavy" is read from the
  //    intent itself (a wind-up or multi-hit) or from what it would cost right now.
  //    Prefer a guard card that covers every incoming hit, then one that also hits back, then Defend.
  const bigMove = intent.kind === 'attack' && intent.mult * intent.hits >= 1.5;
  const heavy = incomingAttack && !guarded && (predictedDamage >= hp || bigMove || predictedDamage >= hp * 0.4);
  if (heavy) {
    const hits = intent.kind === 'attack' ? intent.hits : 1;
    const guardOf = (h: { skill: { effects: Effect[] } }) => h.skill.effects.reduce((m, e) => (isGuard(e) && e.type === 'status' ? Math.max(m, e.magnitude ?? 1) : m), 0);
    const full = hand.filter((h) => guardOf(h) >= hits).sort((a, b) => guardOf(b) - guardOf(a))[0];
    if (full && hits > 1) return { type: 'card', index: full.index };
    const guardCard = hand.find((h) => has(h.skill.effects, isGuard) && has(h.skill.effects, isDamage));
    if (guardCard) return { type: 'card', index: guardCard.index };
    if (full) return { type: 'card', index: full.index };
    return { type: 'basic', id: 'defend' };
  }

  // 2. Low HP and a heal in hand, when the enemy is not about to punish Exposed hard.
  if (hp <= maxHp * 0.4) {
    const healCard = hand.find((h) => has(h.skill.effects, isHeal) && !(has(h.skill.effects, selfExposes) && incomingAttack && predictedDamage * 2 >= hp));
    if (healCard) return { type: 'card', index: healCard.index };
  }

  // 3. Enemy is guarding: a single big hit is wasted; prefer multi-hit, statuses, or a cheap poke.
  // 4. Otherwise play the highest-value damage card, avoiding self-Exposed when a big hit is coming.
  const candidates = hand
    .filter((h) => !(has(h.skill.effects, selfExposes) && incomingAttack && predictedDamage * 2 >= hp))
    .filter((h) => !has(h.skill.effects, isHeal) || hp <= maxHp * 0.6)
    .map((h) => ({ ...h, value: enemyGuarded ? dmgValue(h.skill.effects.filter((e) => e.type !== 'damage' || (e.hits ?? 1) > 1), incomingAttack) : dmgValue(h.skill.effects, incomingAttack) }))
    .sort((a, b) => b.value - a.value);
  const best = candidates[0];
  if (best && best.value > (enemyGuarded ? 0 : 1.0)) return { type: 'card', index: best.index };

  // 5. Basics: attack, unless the enemy guards (then still attack; it strips the guard).
  return { type: 'basic', id: 'attack' };
};

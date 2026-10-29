import { getSkill } from '@data/index';
import type { Effect } from '@data/types';
import { BLACKJACK_LIMIT, currentIntents, effectsNow, hasStatus, isPlayerStunned, livingEnemies, playableIndices, previewDamage, type CombatState, type PlayerAction } from '@core/combat';

export type Policy = (s: CombatState) => PlayerAction;

const has = (effects: Effect[], pred: (e: Effect) => boolean) => effects.some(pred);
const isHeal = (e: Effect) => e.type === 'heal' || (e.type === 'damage' && !!e.lifesteal) || (e.type === 'status' && e.target === 'self' && e.status === 'regen');
const isGuard = (e: Effect) => e.type === 'status' && e.target === 'self' && (e.status === 'guard' || e.status === 'ward' || e.status === 'aegis');
const blocks = (e: Effect, magic: boolean) => e.type === 'status' && e.target === 'self' && (e.status === 'aegis' || e.status === (magic ? 'ward' : 'guard'));
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
  // Lunch Break (DECISIONS #69) can leave nothing playable: then the turn passes.
  const playable = playableIndices(s);
  if (isPlayerStunned(s) || playable.length === 0) return { type: 'skip' };
  // Duos: incoming damage is the sum over living enemies; the target is the weakest one that is not braced.
  const intents = currentIntents(s);
  const living = livingEnemies(s);
  const targetEnemy = [...living].sort((a, b) => (hasStatus(a, 'brace') ? 1 : 0) - (hasStatus(b, 'brace') ? 1 : 0) || a.hp - b.hp)[0] ?? s.enemy;
  const target = targetEnemy.slot;
  const attackIntents = intents.filter((i) => i.intent.kind === 'attack');
  const predictedDamage = intents.reduce((a, i) => a + i.predictedDamage, 0);
  // The "intent" the single-enemy rules read: the heaviest incoming attack, else the first non-attack.
  const primary = attackIntents.sort((a, b) => b.predictedDamage - a.predictedDamage)[0] ?? intents[0]!;
  const intent = primary.intent;
  const hp = s.player.hp;
  const maxHp = s.player.stats.maxHp;
  const guarded = hasStatus(s.player, 'aegis') || (intent.kind === 'attack' && intent.dmgType === 'magic' ? hasStatus(s.player, 'ward') : hasStatus(s.player, 'guard'));
  // Each card as it would play right now: a branching card is the side it takes (a coin, its winning side), #69.
  // Under Blackjack a hit that would pass 21 is not a card at all; if that leaves nothing, hold one back.
  const busts = (effects: Effect[]) => hasStatus(s.player, 'blackjack') && effects.some((e) => e.type === 'damage') &&
    (s.blackjackTotal ?? 0) + effects.reduce((a, e) => a + (e.type === 'damage' ? (e.targets === 'all' ? living : [targetEnemy]).reduce((t, v) => t + previewDamage(s.player, v, e).hits.reduce((x, h) => x + h.amount, 0), 0) : 0), 0) > BLACKJACK_LIMIT;
  const hand = s.player.hand.map((id, index) => ({ index, skill: { ...getSkill(id), effects: effectsNow(s, getSkill(id), targetEnemy) } }))
    .filter((h) => playable.includes(h.index) && !busts(h.skill.effects));
  if (!hand.length) return { type: 'hold', index: playable[0]! };
  const incomingAttack = attackIntents.length > 0;
  const enemyGuarded = hasStatus(targetEnemy, 'guard');
  const card = (index: number): PlayerAction => ({ type: 'card', index, target });

  // 0. The target is braced (counters the next hit) or scattered (halves a single hit):
  //    play something that is not a single big hit; failing that, hold back the weakest card.
  const braced = hasStatus(targetEnemy, 'brace');
  const scattered = hasStatus(targetEnemy, 'scatter');
  if (braced || scattered) {
    const safe = hand.filter((h) => {
      const dmg = h.skill.effects.find((e) => e.type === 'damage');
      if (!dmg) return true;                                   // guard / heal / pure status
      if (dmg.type === 'damage' && (dmg.hits ?? 1) > 1) return true; // multi-hit slips through both
      return false;
    });
    const guardish = safe.find((h) => has(h.skill.effects, isGuard));
    if (braced && guardish) return card(guardish.index);
    const multi = safe.find((h) => has(h.skill.effects, isDamage));
    if (multi) return card(multi.index);
    if (safe[0] && braced) return card(safe[0].index);
    if (braced) {
      // Nothing safe: a small hit is a small counter. Hold only if even the smallest hit would be ruinous.
      const weakest = hand.map((h) => ({ ...h, v: dmgValue(h.skill.effects, incomingAttack) })).sort((a, b) => a.v - b.v)[0]!;
      const smallHit = Math.round(s.player.stats.atk * 1.0);
      if (smallHit >= hp * 0.5) return { type: 'hold', index: weakest.index };
      return card(weakest.index);
    }
  }

  // 1. Lethal or heavy incoming hit and no guard: block. "Heavy" is read from the
  //    intent itself (a wind-up or multi-hit) or from what it would cost right now.
  //    Prefer a guard card that covers every incoming hit, then one that also hits back, then Defend.
  const bigMove = intent.kind === 'attack' && intent.mult * intent.hits >= 1.5;
  const magicIn = intent.kind === 'attack' && intent.dmgType === 'magic';
  const heavy = incomingAttack && !guarded && (predictedDamage >= hp || bigMove || predictedDamage >= hp * 0.4);
  if (heavy) {
    const hits = intent.kind === 'attack' ? intent.hits : 1;
    const guardOf = (h: { skill: { effects: Effect[] } }) => h.skill.effects.reduce((m, e) => (blocks(e, magicIn) && e.type === 'status' ? Math.max(m, e.status === 'aegis' ? 99 : (e.magnitude ?? 1)) : m), 0);
    const full = hand.filter((h) => guardOf(h) >= hits).sort((a, b) => guardOf(b) - guardOf(a))[0];
    if (full && hits > 1) return card(full.index);
    const guardCard = hand.find((h) => has(h.skill.effects, (e) => blocks(e, magicIn)) && has(h.skill.effects, isDamage));
    if (guardCard) return card(guardCard.index);
    if (full) return card(full.index);
    // no matching block in hand: fall through and hit back
  }

  // 2. Low HP and a heal in hand. Recovering heals cost two turns: only when the heal outweighs
  //    what the enemy will do in the meantime (rough: two enemy hits).
  if (hp <= maxHp * 0.4) {
    const healCard = hand.find((h) => {
      if (!has(h.skill.effects, isHeal)) return false;
      const stuns = h.skill.effects.some((e) => e.type === 'status' && e.target === 'self' && e.status === 'stun');
      const healAmt = h.skill.effects.reduce((v, e) => v + (e.type === 'heal' ? (e.pct ?? 0) * maxHp + (e.flat ?? 0) : 0), 0);
      const typicalHit = living.reduce((a, e) => a + Math.max(1, e.stats.atk - s.player.stats.def), 0);
      return !stuns || healAmt > typicalHit * 2 + 1 && hp > typicalHit * 2;
    });
    if (healCard) return card(healCard.index);
  }
  // 1b. A curse coming in: one Ward stack wards it off, and the DoT costs more than the card.
  if (intents.some((i) => i.intent.kind === 'debuff' && i.intent.status === 'curse') && !hasStatus(s.player, 'ward') && !hasStatus(s.player, 'aegis')) {
    const ward = hand.find((h) => h.skill.id === 'ward');
    if (ward) return card(ward.index);
  }

  // 3. Enemy is guarding: a single big hit is wasted; prefer multi-hit, statuses, or a cheap poke.
  // 4. Otherwise play the highest-value damage card, avoiding self-Exposed when a big hit is coming.
  const candidates = hand
    .filter((h) => !(has(h.skill.effects, selfExposes) && incomingAttack && predictedDamage * 2 >= hp))
    .filter((h) => !has(h.skill.effects, isHeal) || hp <= maxHp * 0.6)
    .map((h) => ({ ...h, value: enemyGuarded ? dmgValue(h.skill.effects.filter((e) => e.type !== 'damage' || (e.hits ?? 1) > 1), incomingAttack) : dmgValue(h.skill.effects, incomingAttack) }))
    .sort((a, b) => b.value - a.value);
  const best = candidates[0];
  if (best && best.value > (enemyGuarded ? 0 : 0.9)) return card(best.index);

  // 5. Nothing worth playing. A guarding enemy must be stripped with the cheapest hit
  //    (defending into a permanent guard is a stalemate); otherwise block an incoming
  //    attack if a Defend is in hand, else throw the cheapest damage, else anything.
  const anyDmg = hand.filter((h) => has(h.skill.effects, isDamage)).sort((a, b) => dmgValue(a.skill.effects, incomingAttack) - dmgValue(b.skill.effects, incomingAttack))[0];
  if (enemyGuarded && anyDmg) return card(anyDmg.index);
  const defend = hand.find((h) => h.skill.id === (magicIn ? 'ward' : 'defend'));
  if (defend && incomingAttack && !guarded) return card(defend.index);
  if (anyDmg) return card(anyDmg.index);
  return card(hand[0]!.index);
};

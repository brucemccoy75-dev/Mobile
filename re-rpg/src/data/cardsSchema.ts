import type { ClassId, Condition, DamageKind, Effect, Rarity, SetId, Skill, SkillSet, SkillUses, StatusId } from './types';
import { VFX_KINDS, type VfxKind } from '@core/vfx';

/**
 * The card model (DECISIONS #44): every card is the same record, built in the card editor and
 * stored in cards.json. The game never reads these records directly; `compileCards` turns them
 * into the engine's Skill/effect lists at load, so combat code knows nothing about the editor.
 *
 *   damage   percent of class attack, a flat bonus added after it (gear adds the same way),
 *            hits, physical or magic, ignore defence, drain (heal a share of what landed),
 *            and whether it hits the chosen enemy or every living enemy.
 *   heal     percent of max HP and/or a flat amount.
 *   modifiers  links into the modifier lookup: a named status on self or enemy with its
 *            rounds, amount and chance. "Tiring" (self weak 2 rounds) is defined once and
 *            linked from every card that is tiring. Two modifier statuses take something away
 *            instead (DECISIONS #48): remove_guard and remove_buffs run before the card's damage,
 *            on the enemies the damage hits.
 *   condition / else  a card may branch (DECISIONS #69): the damage, heal and modifiers above
 *            are what it does when the condition holds (your HP below a percent, the enemy
 *            carrying a debuff, or a coin you call); `else` is what it does otherwise.
 *   families own membership: a card drops when a family that lists it is unlocked.
 */
export const CARDS_VERSION = 2;

export interface CardDamage {
  percent: number;        // 100 = class attack
  bonus: number;          // flat, after the percent
  hits: number;           // 1 or more, each at percent + bonus
  type: DamageKind;
  ignoreDef: boolean;
  drain: number;          // percent of damage dealt healed back, 0 = none
  targets: 'one' | 'all'; // the chosen enemy, or every living enemy (DECISIONS #44)
}
export interface CardHeal { percent: number; flat: number; }
/** What a branching card asks (DECISIONS #69). */
export type CardCondition = { kind: 'self_hp_below'; percent: number } | { kind: 'enemy_debuffed' } | { kind: 'coin' };
export const CONDITION_KINDS: CardCondition['kind'][] = ['self_hp_below', 'enemy_debuffed', 'coin'];
/** The otherwise side of a branching card. */
export interface CardBranch { damage: CardDamage | null; heal: CardHeal | null; modifiers: string[]; }
export interface CardDef {
  id: string;
  name: string;
  classId: ClassId | 'any';
  rarity: Rarity;
  uses: SkillUses | null;
  damage: CardDamage | null;
  heal: CardHeal | null;
  modifiers: string[];
  /** The battle effect (DECISIONS #59); absent = chosen from what the card does. */
  vfx?: VfxKind;
  /** A branching card (DECISIONS #69): damage/heal/modifiers run when this holds, `else` otherwise. */
  condition?: CardCondition;
  else?: CardBranch;
  note?: string;
}
/** A status to give, or one of the two removals (DECISIONS #48). */
export type ModifierStatus = StatusId | 'remove_guard' | 'remove_buffs' | 'backfire' | 'extra_play' | 'draw_to';
export interface ModifierDef {
  id: string;
  name: string;
  target: 'self' | 'enemy';
  status: ModifierStatus;
  /** Rounds it lasts (end-of-round ticks, DECISIONS #40). Ignored for guard/ward (hits-based) and chill (one action). */
  rounds?: number;
  /** Hits blocked for guard/ward; damage per round for burn/curse. */
  amount?: number;
  /** Percent chance to apply; absent = always. */
  chance?: number;
  /** A hostile status that Ward can block. */
  magic?: boolean;
  /** Optional card text; generated from the numbers when absent. */
  text?: string;
}
export interface FamilyDef { id: SetId; classId: ClassId; name: string; cards: string[]; }
export interface TreeNodeDef { setId: SetId; cost: number; requires?: SetId[]; }
export interface CardsData {
  version: number;
  basics: Record<string, string[]>;
  modifiers: ModifierDef[];
  cards: CardDef[];
  families: FamilyDef[];
  trees: Record<ClassId, TreeNodeDef[]>;
}

export const STATUS_IDS: StatusId[] = ['exposed', 'guard', 'ward', 'aegis', 'burn', 'chill', 'weak', 'stun', 'brace', 'scatter', 'curse', 'harden', 'regen', 'blackjack'];
/** What each removal takes off the enemy: Guard alone, or every status that helps its holder. */
export const REMOVALS: Record<'remove_guard' | 'remove_buffs', StatusId[]> = {
  remove_guard: ['guard'],
  remove_buffs: ['guard', 'ward', 'aegis', 'harden', 'brace', 'scatter'],
};
export const isRemoval = (s: ModifierStatus): s is keyof typeof REMOVALS => s in REMOVALS;
/** Every value the modifier's status field takes, in editor order. */
export const MODIFIER_STATUSES: ModifierStatus[] = [...STATUS_IDS, 'remove_guard', 'remove_buffs', 'backfire', 'extra_play', 'draw_to'];
/** Modifiers that are an action on your turn, not a status (DECISIONS #69): play more, draw up. */
export const TURN_MODIFIERS: ModifierStatus[] = ['extra_play', 'draw_to'];
export const RARITIES: Rarity[] = ['basic', 'common', 'uncommon', 'rare'];
export const USES: SkillUses[] = ['fleeting', 'once_per_fight'];
export const CLASS_IDS: ClassId[] = ['warrior', 'wizard', 'shaman'];
/** Which statuses are counted in hits (consumed by hits), which last a single action, which take an amount. */
export const HIT_STATUSES: StatusId[] = ['guard', 'ward'];
export const AMOUNT_STATUSES: StatusId[] = ['guard', 'ward', 'burn', 'curse', 'regen', 'blackjack'];

// ---------------------------------------------------------------- compile

export function modifierEffect(m: ModifierDef, targets?: 'one' | 'all'): Effect {
  if (m.status === 'backfire') return { type: 'backfire', pct: (m.amount ?? 100) / 100 };
  if (m.status === 'extra_play') return { type: 'extraPlay', n: m.amount ?? 1 };
  if (m.status === 'draw_to') return { type: 'draw', upTo: m.amount ?? 3 };
  if (isRemoval(m.status)) {
    const s: Extract<Effect, { type: 'strip' }> = { type: 'strip', statuses: [...REMOVALS[m.status]] };
    if (targets === 'all') s.targets = 'all';
    return s;
  }
  // Guard and Ward are spent by hits and Blackjack lasts the fight (#69): none of them run out by rounds.
  const e: Extract<Effect, { type: 'status' }> = { type: 'status', target: m.target, status: m.status, turns: HIT_STATUSES.includes(m.status) || m.status === 'blackjack' ? 99 : m.status === 'chill' ? 1 : (m.rounds ?? 1) };
  if (m.amount !== undefined) e.magnitude = m.amount;
  if (m.chance !== undefined && m.chance < 100) e.chance = m.chance / 100;
  if (m.magic) e.kind = 'magic';
  return e;
}

export function damageEffect(d: CardDamage): Effect {
  const e: Extract<Effect, { type: 'damage' }> = { type: 'damage', mult: d.percent / 100 };
  if (d.bonus) e.flat = d.bonus;
  if (d.hits > 1) e.hits = d.hits;
  if (d.ignoreDef) e.ignoreDef = true;
  if (d.type === 'magic') e.kind = 'magic';
  if (d.drain) e.lifesteal = d.drain / 100;
  if (d.targets === 'all') e.targets = 'all';
  return e;
}

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;

/** Text for a modifier: its own line if it has one, else built from the numbers. */
export function modifierText(m: ModifierDef, targets?: 'one' | 'all'): string {
  if (m.text) return m.text;
  if (m.status === 'backfire') return (m.amount ?? 100) >= 100 ? 'If the target survives, you lose all your HP.' : `If the target survives, you lose ${m.amount}% of your max HP.`;
  if (m.status === 'extra_play') return `Play ${(m.amount ?? 1) === 1 ? 'one more card' : `${m.amount} more cards`} this turn.`;
  if (m.status === 'draw_to') return `Draw until you hold ${m.amount ?? 3}.`;
  if (m.status === 'regen') return `Lunch Break: heal ${m.amount ?? 0}% of max HP a round for ${plural(m.rounds ?? 1, 'round')}. No damage cards meanwhile.`;
  if (m.status === 'blackjack') return `Blackjack: your hits deal ${m.amount ?? 1}× for the rest of the fight. Deal more than 21 in total and you die.`;
  if (isRemoval(m.status)) {
    const whose = targets === 'all' ? "every enemy's" : "the enemy's";
    return m.status === 'remove_guard' ? `Remove ${whose} Guard first.` : `Remove ${whose} buffs first (Guard, Ward, Aegis, Hardened, Braced, Scattered).`;
  }
  const cap = m.status.charAt(0).toUpperCase() + m.status.slice(1);
  const chance = m.chance !== undefined && m.chance < 100 ? `${m.chance}% chance to ` : '';
  if (m.status === 'guard') return `Block the next ${m.amount === 1 || !m.amount ? 'physical hit' : `${m.amount} physical hits`}.`;
  if (m.status === 'ward') return `Block the next ${m.amount === 1 || !m.amount ? 'magic hit or curse' : `${m.amount} magic hits or curses`}.`;
  if (m.status === 'aegis') return `Block every hit for ${plural(m.rounds ?? 1, 'round')}.`;
  if (m.status === 'chill') return `${chance}Chill: the enemy skips its next action.`;
  if ((m.status === 'burn' || m.status === 'curse') && m.target === 'self') return `${chance}You are ${m.status === 'curse' ? 'Cursed' : 'Burning'} (${m.amount ?? 1} a round) for ${plural(m.rounds ?? 1, 'round')}.`;
  if (m.status === 'burn' || m.status === 'curse') return `${chance}${cap} ${m.amount ?? 1} for ${plural(m.rounds ?? 1, 'round')}.`;
  if (m.target === 'self') return `${chance}You are ${m.status === 'stun' ? 'Recovering' : cap} for ${plural(m.rounds ?? 1, 'round')}.`;
  return `${chance}Enemy is ${cap} for ${plural(m.rounds ?? 1, 'round')}.`;
}

/** The static card text (percentages; the game shows computed numbers on the card itself). */
export function cardText(c: CardDef, mods: Map<string, ModifierDef>): string {
  const parts: string[] = [];
  if (c.condition) {
    const [yes, no] = c.condition.kind === 'self_hp_below' ? [`If your HP is below ${c.condition.percent}%:`, 'Otherwise:'] : c.condition.kind === 'enemy_debuffed' ? ['If the enemy has a debuff:', 'Otherwise:'] : ['Call the coin. Right:', 'Wrong:'];
    parts.push(`${yes} ${branchText(c, mods)}`);
    if (c.else) parts.push(`${no} ${branchText(c.else, mods)}`);
  } else parts.push(branchText(c, mods));
  if (c.uses === 'once_per_fight') parts.push('Once per fight.');
  if (c.uses === 'fleeting') parts.push('Fleeting: spent when played.');
  return parts.filter(Boolean).join(' ');
}

function branchText(c: CardBranch, mods: Map<string, ModifierDef>): string {
  const parts: string[] = [];
  // Removals run before the damage, so they read first (DECISIONS #48).
  const linked = c.modifiers.map((id) => mods.get(id)).filter((m): m is ModifierDef => !!m);
  for (const m of linked) if (isRemoval(m.status)) parts.push(modifierText(m, c.damage?.targets));
  if (c.damage) {
    const d = c.damage;
    const kind = d.type === 'magic' ? ' magic' : '';
    let s = d.hits > 1 ? `${d.hits} hits of ${d.percent}%${d.bonus ? ` + ${d.bonus}` : ''}${kind} damage` : `Deal ${d.percent}%${d.bonus ? ` + ${d.bonus}` : ''}${kind} damage`;
    if (d.targets === 'all') s += ' to every enemy';
    if (d.ignoreDef) s += ', ignoring defence';
    if (d.drain) s += `, heal ${d.drain}% of it`;
    parts.push(s + '.');
  }
  if (c.heal) parts.push(`Heal ${c.heal.percent ? `${c.heal.percent}%` : ''}${c.heal.percent && c.heal.flat ? ' + ' : ''}${c.heal.flat ? `${c.heal.flat}` : ''} HP.`);
  for (const m of linked) if (!isRemoval(m.status)) parts.push(modifierText(m));
  return parts.join(' ');
}

export interface Compiled { skills: Skill[]; sets: SkillSet[]; trees: Record<ClassId, { setId: SetId; cost: number; requires?: SetId[] }[]>; basics: Record<string, string[]>; }

export function compileCards(data: CardsData): Compiled {
  const mods = new Map(data.modifiers.map((m) => [m.id, m]));
  const familyOfClassCard = new Map<string, SetId>();
  for (const f of data.families) for (const id of f.cards) {
    const c = data.cards.find((x) => x.id === id);
    if (c && c.classId === f.classId) familyOfClassCard.set(id, f.id);
  }
  const branch = (c: CardBranch, id: string): Effect[] => {
    const effects: Effect[] = [];
    if (c.damage) effects.push(damageEffect(c.damage));
    if (c.heal) { const h: Extract<Effect, { type: 'heal' }> = { type: 'heal' }; if (c.heal.percent) h.pct = c.heal.percent / 100; if (c.heal.flat) h.flat = c.heal.flat; effects.push(h); }
    for (const mid of c.modifiers) { const m = mods.get(mid); if (!m) throw new Error(`card ${id}: unknown modifier ${mid}`); effects.push(modifierEffect(m, c.damage?.targets)); }
    // Removals run ahead of the damage, a backfire after everything, whatever their place in the list (DECISIONS #48, #51).
    const order = (e: Effect) => (e.type === 'strip' ? 0 : e.type === 'backfire' ? 2 : 1);
    return effects.sort((a, b) => order(a) - order(b));
  };
  const skills: Skill[] = data.cards.map((c) => {
    let effects = branch(c, c.id);
    // A branching card is one effect holding both sides (DECISIONS #69).
    if (c.condition) effects = [{ type: 'if', cond: conditionOf(c.condition), then: effects, else: c.else ? branch(c.else, c.id) : [] }];
    const sk: Skill = { id: c.id, name: c.name, text: cardText(c, mods), classId: c.classId, rarity: c.rarity, effects };
    const fam = familyOfClassCard.get(c.id);
    if (fam) sk.setId = fam;
    if (c.uses) sk.uses = c.uses;
    if (c.vfx) sk.vfx = c.vfx;
    return sk;
  });
  const sets: SkillSet[] = data.families.map((f) => ({ id: f.id, classId: f.classId, name: f.name, skills: [...f.cards] }));
  return { skills, sets, trees: data.trees, basics: data.basics };
}

const conditionOf = (c: CardCondition): Condition =>
  c.kind === 'self_hp_below' ? { kind: 'selfHpBelow', pct: c.percent / 100 } : c.kind === 'enemy_debuffed' ? { kind: 'targetDebuffed' } : { kind: 'coin' };

// ---------------------------------------------------------------- validate

const isInt = (n: unknown, lo: number, hi: number) => typeof n === 'number' && Number.isInteger(n) && n >= lo && n <= hi;

/**
 * Every rule a cards file must satisfy on its own. Returns one line per problem, empty when
 * clean. `shipped` adds the import rules (docs/CARDS.md): no id leaves, basics and the other
 * classes stay as they were.
 */
export function validateCards(data: CardsData, shipped?: CardsData): string[] {
  const out: string[] = [];
  const bad = (s: string) => out.push(s);
  if (data.version !== CARDS_VERSION) bad(`version must be ${CARDS_VERSION}`);
  const ids = new Set<string>();
  for (const c of data.cards ?? []) { if (ids.has(c.id)) bad(`card ${c.id}: duplicate id`); ids.add(c.id); }
  const mods = new Map<string, ModifierDef>();
  for (const m of data.modifiers ?? []) {
    if (mods.has(m.id)) bad(`modifier ${m.id}: duplicate id`);
    mods.set(m.id, m);
    if (!/^[a-z][a-z0-9_]*$/.test(m.id)) bad(`modifier ${m.id}: id must be lower_snake_case`);
    if (!m.name?.trim()) bad(`modifier ${m.id}: needs a name`);
    if (m.target !== 'self' && m.target !== 'enemy') bad(`modifier ${m.id}: target must be self or enemy`);
    if (!MODIFIER_STATUSES.includes(m.status)) bad(`modifier ${m.id}: unknown status ${m.status}`);
    if (m.status === 'backfire') {
      if (m.target !== 'self') bad(`modifier ${m.id}: backfire works on yourself only`);
      if (!isInt(m.amount, 1, 100)) bad(`modifier ${m.id}: backfire needs an amount (percent of max HP, 1-100)`);
      if (m.rounds !== undefined || m.chance !== undefined || m.magic) bad(`modifier ${m.id}: backfire takes no rounds, chance or magic`);
      continue;
    }
    if (TURN_MODIFIERS.includes(m.status)) {
      if (m.target !== 'self') bad(`modifier ${m.id}: ${m.status} works on yourself only`);
      if (!isInt(m.amount, 1, 3)) bad(`modifier ${m.id}: ${m.status} needs an amount 1-3`);
      if (m.rounds !== undefined || m.chance !== undefined || m.magic) bad(`modifier ${m.id}: ${m.status} takes no rounds, chance or magic`);
      continue;
    }
    if (m.status === 'regen') {
      if (m.target !== 'self') bad(`modifier ${m.id}: regen works on yourself only`);
      if (!isInt(m.amount, 1, 50)) bad(`modifier ${m.id}: regen amount is a percent of max HP, 1-50`);
      if (!isInt(m.rounds, 1, 9)) bad(`modifier ${m.id}: regen needs rounds 1-9`);
      if (m.chance !== undefined || m.magic) bad(`modifier ${m.id}: regen takes no chance or magic`);
      continue;
    }
    if (m.status === 'blackjack') {
      if (m.target !== 'self') bad(`modifier ${m.id}: blackjack works on yourself only`);
      if (!isInt(m.amount, 2, 9) || m.rounds !== undefined || m.chance !== undefined || m.magic) bad(`modifier ${m.id}: blackjack lasts the fight: amount 2-9, no rounds or chance`);
      continue;
    }
    if (isRemoval(m.status)) {
      if (m.target !== 'enemy') bad(`modifier ${m.id}: ${m.status} works on the enemy only`);
      if (m.rounds !== undefined || m.amount !== undefined || m.chance !== undefined || m.magic) bad(`modifier ${m.id}: ${m.status} takes no rounds, amount, chance or magic`);
      continue;
    }
    const st = m.status as StatusId; // the turn modifiers, removals, backfire, regen and blackjack were handled above
    if (m.rounds !== undefined && !isInt(m.rounds, 1, 9)) bad(`modifier ${m.id}: rounds must be 1-9`);
    if (!HIT_STATUSES.includes(st) && st !== 'chill' && m.rounds === undefined) bad(`modifier ${m.id}: ${st} needs rounds`);
    if (m.amount !== undefined && !isInt(m.amount, 1, 9)) bad(`modifier ${m.id}: amount must be 1-9`);
    if (AMOUNT_STATUSES.includes(st) && m.amount === undefined) bad(`modifier ${m.id}: ${st} needs an amount`);
    if (m.chance !== undefined && !isInt(m.chance, 1, 100)) bad(`modifier ${m.id}: chance must be 1-100`);
  }
  for (const c of data.cards ?? []) {
    const w = `card ${c.id}`;
    if (!/^[a-z][a-z0-9_]*$/.test(c.id)) bad(`${w}: id must be lower_snake_case`);
    if (!c.name?.trim()) bad(`${w}: needs a name`);
    if (c.classId !== 'any' && !CLASS_IDS.includes(c.classId)) bad(`${w}: unknown class ${c.classId}`);
    if (!RARITIES.includes(c.rarity)) bad(`${w}: unknown rarity ${c.rarity}`);
    if (c.uses !== null && c.uses !== undefined && !USES.includes(c.uses)) bad(`${w}: uses must be empty, fleeting or once_per_fight`);
    if (!c.damage && !c.heal && !(c.modifiers?.length)) bad(`${w}: needs damage, heal or a modifier`);
    if (c.vfx !== undefined && !VFX_KINDS.includes(c.vfx)) bad(`${w}: unknown effect ${c.vfx}`);
    checkBranch(c, w, '', mods, bad);
    if (c.condition !== undefined) {
      if (!CONDITION_KINDS.includes(c.condition.kind)) bad(`${w}: unknown condition ${(c.condition as { kind: string }).kind}`);
      if (c.condition.kind === 'self_hp_below' && !isInt(c.condition.percent, 1, 99)) bad(`${w}: HP threshold must be 1-99`);
    }
    if (c.else) {
      if (!c.condition) bad(`${w}: an otherwise branch needs a condition`);
      if (!c.else.damage && !c.else.heal && !(c.else.modifiers?.length)) bad(`${w}: the otherwise branch needs damage, heal or a modifier`);
      checkBranch(c.else, w, 'otherwise ', mods, bad);
    }
  }
  const famIds = new Set<string>();
  const cardById = new Map((data.cards ?? []).map((c) => [c.id, c]));
  for (const f of data.families ?? []) {
    const w = `family ${f.id}`;
    if (famIds.has(f.id)) bad(`${w}: duplicate id`); famIds.add(f.id);
    if (!CLASS_IDS.includes(f.classId)) bad(`${w}: unknown class ${f.classId}`);
    if (!f.name?.trim()) bad(`${w}: needs a name`);
    for (const id of f.cards ?? []) {
      const c = cardById.get(id);
      if (!c) { bad(`${w}: unknown card ${id}`); continue; }
      if (c.rarity === 'basic') bad(`${w}: basics are in every fight and do not belong to a family (${id})`);
      if (c.classId !== 'any' && c.classId !== f.classId) bad(`${w}: ${id} belongs to the ${c.classId}`);
    }
  }
  for (const c of data.cards ?? []) {
    for (const cls of CLASS_IDS) {
      const n = (data.families ?? []).filter((f) => f.classId === cls && f.cards.includes(c.id)).length;
      if (n > 1) bad(`card ${c.id}: listed by ${n} ${cls} families; one at most`);
    }
    // A basic card lives in a starting deck or nowhere at all.
    if (c.rarity === 'basic' && !CLASS_IDS.some((cls) => (data.basics?.[cls] ?? []).includes(c.id))) bad(`card ${c.id}: basic rarity but in no class's starting deck (add it on the Skill tree tab, or give it a rarity and a family)`);
  }
  for (const cls of CLASS_IDS) {
    const basics = data.basics?.[cls] ?? [];
    if (!basics.length) bad(`basics ${cls}: the starting deck is empty`);
    if (basics.length > 6) bad(`basics ${cls}: at most 6 starting cards`);
    for (const id of basics) { const c = cardById.get(id); if (!c) bad(`basics ${cls}: unknown card ${id}`); else if (c.rarity !== 'basic') bad(`basics ${cls}: ${id} is not a basic card`); }
    const nodes = data.trees?.[cls] ?? [];
    for (const n of nodes) {
      if (!famIds.has(n.setId)) bad(`tree ${cls}: unknown family ${n.setId}`);
      if (!isInt(n.cost, 0, 10)) bad(`tree ${cls}/${n.setId}: cost must be 0-10`);
      for (const r of n.requires ?? []) { if (!nodes.some((x) => x.setId === r)) bad(`tree ${cls}/${n.setId}: requires unknown node ${r}`); if (r === n.setId) bad(`tree ${cls}/${n.setId}: requires itself`); }
    }
    for (const f of data.families ?? []) if (f.classId === cls && !nodes.some((n) => n.setId === f.id)) bad(`tree ${cls}: family ${f.id} has no node`);
  }
  if (shipped) {
    const shippedIds = new Set(shipped.cards.map((c) => c.id));
    for (const id of shippedIds) if (!cardById.has(id)) bad(`import: card ${id} was removed; set its family to none instead`);
    for (const id of shipped.families.map((f) => f.id)) if (!famIds.has(id)) bad(`import: family ${id} was removed`);
    const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
    // The warrior's starting deck is the designer's; the other classes' decks and the shared basics (used by every class) are frozen.
    for (const cls of ['wizard', 'shaman'] as ClassId[]) if (!same(shipped.basics[cls], data.basics[cls])) bad(`import: ${cls} starting deck changed; only the warrior is in scope`);
    for (const c of shipped.cards) if (c.rarity === 'basic' && c.classId === 'any' && !same(c, cardById.get(c.id))) bad(`import: shared basic card ${c.id} changed (every class deals it; ask for a design change)`);
    for (const cls of ['wizard', 'shaman'] as ClassId[]) {
      const pick = (d: CardsData) => ({ cards: d.cards.filter((c) => c.classId === cls), families: d.families.filter((f) => f.classId === cls), tree: d.trees[cls] });
      if (!same(pick(shipped), pick(data))) bad(`import: ${cls} data changed; only the warrior is in scope`);
    }
  }
  return out;
}

/** The damage, heal and modifier rules, for a card's main side or its otherwise side (`side` prefixes the message). */
function checkBranch(b: CardBranch, w: string, side: string, mods: Map<string, ModifierDef>, bad: (s: string) => void): void {
  if (b.damage) {
    const d = b.damage;
    if (!isInt(d.percent, 0, 500)) bad(`${w}: ${side}damage percent must be 0-500`);
    if (!isInt(d.bonus, 0, 30)) bad(`${w}: ${side}damage bonus must be 0-30`);
    if (!isInt(d.hits, 1, 6)) bad(`${w}: ${side}hits must be 1-6`);
    if (d.type !== 'physical' && d.type !== 'magic') bad(`${w}: ${side}damage type must be physical or magic`);
    if (!isInt(d.drain, 0, 100)) bad(`${w}: ${side}drain must be 0-100`);
    if (d.targets !== 'one' && d.targets !== 'all') bad(`${w}: ${side}targets must be one or all`);
    if (d.percent === 0 && d.bonus === 0) bad(`${w}: ${side}damage needs a percent or a bonus`);
  }
  if (b.heal) {
    if (!isInt(b.heal.percent, 0, 100)) bad(`${w}: ${side}heal percent must be 0-100`);
    if (!isInt(b.heal.flat, 0, 50)) bad(`${w}: ${side}heal flat must be 0-50`);
    if (b.heal.percent === 0 && b.heal.flat === 0) bad(`${w}: ${side}heal needs a percent or a flat amount`);
  }
  for (const id of b.modifiers ?? []) if (!mods.has(id)) bad(`${w}: unknown modifier ${id}`);
  if (new Set(b.modifiers ?? []).size !== (b.modifiers ?? []).length) bad(`${w}: a modifier is linked twice`);
}

/** Human summary of what an import changes, for the commit message. */
export function diffCards(shipped: CardsData, data: CardsData): string[] {
  const out: string[] = [];
  const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
  const old = new Map(shipped.cards.map((c) => [c.id, c]));
  for (const c of data.cards) { const o = old.get(c.id); if (!o) out.push(`new card ${c.id} (${c.name})`); else if (!same(o, c)) out.push(`changed ${c.id}`); }
  const oldM = new Map(shipped.modifiers.map((m) => [m.id, m]));
  for (const m of data.modifiers) { const o = oldM.get(m.id); if (!o) out.push(`new modifier ${m.id}`); else if (!same(o, m)) out.push(`changed modifier ${m.id}`); }
  for (const id of oldM.keys()) if (!data.modifiers.some((m) => m.id === id)) out.push(`removed modifier ${id}`);
  const oldF = new Map(shipped.families.map((f) => [f.id, f]));
  for (const f of data.families) { const o = oldF.get(f.id); if (!o) out.push(`new family ${f.id} (${f.name})`); else if (!same(o, f)) out.push(`family ${f.id}: ${o.name} [${o.cards.join(', ')}] -> ${f.name} [${f.cards.join(', ')}]`); }
  if (!same(shipped.trees, data.trees)) out.push('tree costs or prerequisites changed');
  if (!same(shipped.basics.warrior, data.basics.warrior)) out.push(`warrior starting deck: [${(shipped.basics.warrior ?? []).join(', ')}] -> [${(data.basics.warrior ?? []).join(', ')}]`);
  return out;
}

/**
 * The card editor (DECISIONS #44): a plain page, reached from the title screen, that edits the
 * card records in cards.json and exports the file. The game never reads the editor's draft;
 * an exported file is imported by the procedure in docs/CARDS.md.
 */
import { CARDS_DATA, cardText, diffCards, modifierText, validateCards, type CardDef, type CardsData, type ModifierDef } from '@data/index';
import { CLASS_IDS, RARITIES, MODIFIER_STATUSES, USES, AMOUNT_STATUSES, HIT_STATUSES, damageEffect, isRemoval } from '@data/cardsSchema';
import type { StatusId } from '@data/types';
import { computeHit } from '@core/combat/damage';

const DRAFT_KEY = 'rerpg:cards-draft';
const SHIPPED: CardsData = JSON.parse(JSON.stringify(CARDS_DATA));
const clone = <T>(x: T): T => JSON.parse(JSON.stringify(x));

interface State { data: CardsData & { basics: Record<string, string[]> & { warrior: string[] } }; tab: 'cards' | 'modifiers' | 'tree'; editing: string | null; editingMod: string | null; atk: number; gear: number; def: number; }
const state: State = { data: loadDraft(), tab: 'cards', editing: null, editingMod: null, atk: 4, gear: 0, def: 0 };

function loadDraft(): State['data'] {
  try { const raw = localStorage.getItem(DRAFT_KEY); if (raw) { const d = JSON.parse(raw) as State['data']; if (d.version === SHIPPED.version && Array.isArray(d.cards) && Array.isArray(d.basics?.warrior)) return d; } } catch { /* fresh */ }
  return clone(SHIPPED) as State['data'];
}
function saveDraft() { try { localStorage.setItem(DRAFT_KEY, JSON.stringify(state.data)); } catch { /* ignore */ } }

const app = document.getElementById('app')!;
const h = (tag: string, attrs: Record<string, unknown> = {}, ...children: (Node | string | null | undefined)[]): HTMLElement => {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') el.className = String(v);
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v as EventListener);
    else if (v !== undefined && v !== null && v !== false) el.setAttribute(k, String(v));
  }
  for (const c of children) if (c !== null && c !== undefined) el.append(c);
  return el;
};

// ---------------------------------------------------------------- numbers

/** One hit for the test hero against the test DEF: exactly computeHit. */
function hitFor(c: CardDef): { per: number; total: number; base: number } | null {
  if (!c.damage) return null;
  const e = damageEffect(c.damage);
  if (e.type !== 'damage') return null;
  const attacker = { side: 'player' as const, name: 'test', hp: 1, stats: { maxHp: 1, atk: state.atk + state.gear, def: 0, gearAtk: state.gear }, statuses: [] };
  const target = { side: 'enemy' as const, name: 'dummy', hp: 999, stats: { maxHp: 999, atk: 0, def: state.def }, statuses: [] };
  const per = computeHit(attacker, target, e.mult, e.ignoreDef, e.flat ?? 0, c.damage.hits);
  const base = Math.round(state.atk * e.mult) + state.gear + (e.flat ?? 0);
  return { per, total: per * c.damage.hits, base };
}
const mods = () => new Map(state.data.modifiers.map((m) => [m.id, m]));
const familyOfCard = (id: string) => state.data.families.find((f) => f.classId === 'warrior' && f.cards.includes(id));
const usedBy = (modId: string) => state.data.cards.filter((c) => c.modifiers.includes(modId)).map((c) => c.name);
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '') || 'card';
const isShippedCard = (id: string) => SHIPPED.cards.some((c) => c.id === id);
const inScope = (c: CardDef) => c.classId === 'warrior' || c.classId === 'any';

function summary(c: CardDef): string {
  const m = mods();
  const bits: string[] = [];
  if (c.damage) bits.push(`${c.damage.percent}%${c.damage.bonus ? ` +${c.damage.bonus}` : ''}${c.damage.hits > 1 ? ` ×${c.damage.hits}` : ''} ${c.damage.type}${c.damage.targets === 'all' ? ' · all enemies' : ''}${c.damage.ignoreDef ? ' · ignores DEF' : ''}${c.damage.drain ? ` · drain ${c.damage.drain}%` : ''}`);
  if (c.heal) bits.push(`heal ${c.heal.percent ? `${c.heal.percent}%` : ''}${c.heal.flat ? ` +${c.heal.flat}` : ''}`);
  for (const id of c.modifiers) bits.push(m.get(id)?.name ?? `?${id}`);
  if (c.uses) bits.push(c.uses === 'fleeting' ? 'fleeting' : 'once per fight');
  return bits.join(' · ');
}

// ---------------------------------------------------------------- render

function render() {
  saveDraft();
  app.replaceChildren();
  const problems = validateCards(state.data, SHIPPED);
  const changes = diffCards(SHIPPED, state.data);
  app.append(
    h('h1', {}, 'Re-RPG card editor'),
    h('div', { class: 'bar' },
      h('label', {}, 'test attack ', numInput(state.atk, (v) => { state.atk = v; render(); }, 1, 30)),
      h('label', {}, 'test gear ', numInput(state.gear, (v) => { state.gear = v; render(); }, 0, 10)),
      h('label', {}, 'target DEF ', numInput(state.def, (v) => { state.def = v; render(); }, 0, 10)),
    ),
    h('div', { class: 'actions' },
      h('button', { class: 'primary', onclick: exportJson }, 'Export cards.json'),
      h('button', { onclick: copyJson }, 'Copy JSON'),
      h('button', { class: 'danger', onclick: () => { if (confirm('Throw away every edit and reload the shipped cards?')) { state.data = clone(SHIPPED) as State['data']; state.editing = null; state.editingMod = null; render(); } } }, 'Reset to shipped'),
      h('button', { onclick: () => { window.location.href = './'; } }, 'Back to the game'),
    ),
    problems.length ? h('div', { class: 'problems' }, problems.join('\n')) : h('div', { class: 'ok' }, changes.length ? `${changes.length} change${changes.length === 1 ? '' : 's'} from shipped: ${changes.join('; ')}` : 'No changes from the shipped cards.'),
    h('div', { class: 'tabs', role: 'tablist' },
      ...(['cards', 'modifiers', 'tree'] as const).map((t) => h('button', { role: 'tab', 'aria-selected': state.tab === t, onclick: () => { state.tab = t; render(); } }, t === 'cards' ? 'Cards' : t === 'modifiers' ? 'Modifiers' : 'Skill tree')),
    ),
    state.tab === 'cards' ? cardsTab() : state.tab === 'modifiers' ? modifiersTab() : treeTab(),
  );
}

function numInput(value: number, onInput: (v: number) => void, min = 0, max = 999): HTMLElement {
  return h('input', { type: 'number', value, min, max, inputmode: 'numeric', onchange: (ev: Event) => onInput(Math.max(min, Math.min(max, Number((ev.target as HTMLInputElement).value) || 0))) });
}
function select(value: string, options: [string, string][], onChange: (v: string) => void): HTMLElement {
  const el = h('select', { onchange: (ev: Event) => onChange((ev.target as HTMLSelectElement).value) }, ...options.map(([v, label]) => h('option', { value: v, selected: v === value }, label)));
  return el;
}

// ---------------------------------------------------------------- cards tab

function cardsTab(): HTMLElement {
  const groups: [string, CardDef[]][] = [];
  groups.push(['Starting deck (dealt in every warrior fight; edit it on the Skill tree tab)', [...new Set(state.data.basics.warrior)].map((id) => state.data.cards.find((c) => c.id === id)!).filter(Boolean)]);
  for (const f of state.data.families.filter((f) => f.classId === 'warrior')) groups.push([`${f.name} (${state.data.trees.warrior.find((n) => n.setId === f.id)?.cost ?? 0} points)`, f.cards.map((id) => state.data.cards.find((c) => c.id === id)!).filter(Boolean)]);
  const placed = new Set(groups.flatMap(([, cs]) => cs.map((c) => c.id)));
  groups.push(['Basic cards not in the warrior\'s starting deck (never dealt)', state.data.cards.filter((c) => inScope(c) && c.rarity === 'basic' && !placed.has(c.id))]);
  groups.push(['No family (never drops for a warrior)', state.data.cards.filter((c) => inScope(c) && c.rarity !== 'basic' && !placed.has(c.id))]);
  const other = state.data.cards.filter((c) => !inScope(c));
  const el = h('div', {});
  el.append(h('div', { class: 'actions' }, h('button', { class: 'primary', onclick: addCard }, '+ New card')));
  for (const [title, cards] of groups) {
    el.append(h('h2', {}, title));
    const list = h('div', { class: 'list' });
    for (const c of cards) {
      if (state.editing === c.id) list.append(cardForm(c));
      else list.append(cardRow(c));
    }
    if (!cards.length) list.append(h('div', { class: 'muted' }, 'nothing here'));
    el.append(list);
  }
  el.append(h('h2', {}, 'Other classes (out of scope, read only)'));
  const list = h('div', { class: 'list' });
  for (const c of other) list.append(cardRow(c, true));
  el.append(list);
  return el;
}

function cardRow(c: CardDef, readOnly = false): HTMLElement {
  const n = hitFor(c);
  return h('div', { class: 'row' + (readOnly ? ' ro' : ''), onclick: readOnly ? undefined : () => { state.editing = c.id; render(); } },
    h('div', { class: 'name' }, `${c.name} `, h('span', { class: 'muted' }, `· ${c.rarity}${c.classId === 'any' ? ' · any class' : ''}`)),
    h('div', { class: 'num' }, n ? `${n.total}` : c.heal ? `+${c.heal.percent ? `${c.heal.percent}%` : c.heal.flat}` : ''),
    h('div', { class: 'sum' }, summary(c)),
  );
}

function cardForm(c: CardDef): HTMLElement {
  const m = mods();
  const shipped = isShippedCard(c.id);
  const fam = familyOfCard(c.id);
  const famOptions: [string, string][] = [['', 'none'], ...state.data.families.filter((f) => f.classId === 'warrior').map((f) => [f.id, f.name] as [string, string])];
  const n = hitFor(c);
  const setFamily = (id: string) => { for (const f of state.data.families) if (f.classId === 'warrior') f.cards = f.cards.filter((x) => x !== c.id); if (id) state.data.families.find((f) => f.id === id)!.cards.push(c.id); };
  const dmg = c.damage;
  const form = h('div', { class: 'form' },
    h('div', { class: 'grid' },
      h('label', {}, 'id (fixed once shipped)', h('input', { value: c.id, disabled: shipped, onchange: (ev: Event) => { const v = slug((ev.target as HTMLInputElement).value); if (state.data.cards.some((x) => x.id === v && x !== c)) { alert('that id is taken'); render(); return; } for (const f of state.data.families) f.cards = f.cards.map((x) => (x === c.id ? v : x)); c.id = v; state.editing = v; render(); } })),
      h('label', {}, 'name', h('input', { value: c.name, onchange: (ev: Event) => { c.name = (ev.target as HTMLInputElement).value; render(); } })),
      h('label', {}, 'class', select(c.classId, [['warrior', 'warrior'], ['any', 'any class']], (v) => { c.classId = v as CardDef['classId']; render(); })),
      h('label', {}, c.rarity === 'basic' ? 'starting deck' : 'family (tree node)', c.rarity === 'basic' ? h('span', { class: 'muted' }, state.data.basics.warrior.includes(c.id) ? `in the warrior's starting deck ×${state.data.basics.warrior.filter((x) => x === c.id).length}` : 'not in the starting deck: add it on the Skill tree tab') : select(fam?.id ?? '', famOptions, (v) => { setFamily(v); render(); })),
      h('label', {}, 'rarity', select(c.rarity, RARITIES.map((r) => [r, r === 'basic' ? 'basic (starting deck only, never drops)' : r]), (v) => { c.rarity = v as CardDef['rarity']; if (v === 'basic') setFamily(''); else state.data.basics.warrior = state.data.basics.warrior.filter((x) => x !== c.id); render(); })),
      h('label', {}, 'uses', select(c.uses ?? '', [['', 'normal tome'], ...USES.map((u) => [u, u === 'fleeting' ? 'fleeting (gone when played)' : 'once per fight'] as [string, string])], (v) => { c.uses = (v || null) as CardDef['uses']; render(); })),
    ),
    h('h2', {}, 'Damage'),
    h('div', { class: 'chips' }, h('label', {}, h('input', { type: 'checkbox', checked: !!dmg, onchange: (ev: Event) => { c.damage = (ev.target as HTMLInputElement).checked ? { percent: 100, bonus: 0, hits: 1, type: 'physical', ignoreDef: false, drain: 0, targets: 'one' } : null; render(); } }), 'this card deals damage')),
    dmg ? h('div', { class: 'grid' },
      h('label', {}, 'percent of class attack', numInput(dmg.percent, (v) => { dmg.percent = v; render(); }, 0, 500)),
      h('label', {}, 'bonus (flat, after %)', numInput(dmg.bonus, (v) => { dmg.bonus = v; render(); }, 0, 30)),
      h('label', {}, 'hits', numInput(dmg.hits, (v) => { dmg.hits = v; render(); }, 1, 6)),
      h('label', {}, 'type', select(dmg.type, [['physical', 'physical (Guard blocks)'], ['magic', 'magic (Ward blocks)']], (v) => { dmg.type = v as 'physical' | 'magic'; render(); })),
      h('label', {}, 'targets', select(dmg.targets, [['one', 'the chosen enemy'], ['all', 'every living enemy']], (v) => { dmg.targets = v as 'one' | 'all'; render(); })),
      h('label', {}, 'drain % (heal a share of damage)', numInput(dmg.drain, (v) => { dmg.drain = v; render(); }, 0, 100)),
      h('label', {}, 'ignore defence', h('input', { type: 'checkbox', checked: dmg.ignoreDef, onchange: (ev: Event) => { dmg.ignoreDef = (ev.target as HTMLInputElement).checked; render(); } })),
    ) : null,
    n ? h('div', { class: 'calc' }, `With attack ${state.atk}${state.gear ? ` + gear ${state.gear}` : ''}: ${n.base} per hit before armour, ${n.per} against DEF ${state.def}${dmg && dmg.hits > 1 ? ` × ${dmg.hits} = ${n.total}` : ''}${dmg?.targets === 'all' ? ', to each enemy' : ''}.`) : null,
    h('h2', {}, 'Heal'),
    h('div', { class: 'chips' }, h('label', {}, h('input', { type: 'checkbox', checked: !!c.heal, onchange: (ev: Event) => { c.heal = (ev.target as HTMLInputElement).checked ? { percent: 25, flat: 0 } : null; render(); } }), 'this card heals')),
    c.heal ? h('div', { class: 'grid' },
      h('label', {}, 'percent of max HP', numInput(c.heal.percent, (v) => { c.heal!.percent = v; render(); }, 0, 100)),
      h('label', {}, 'flat HP', numInput(c.heal.flat, (v) => { c.heal!.flat = v; render(); }, 0, 50)),
    ) : null,
    h('h2', {}, 'Modifiers (in the order they apply)'),
    h('div', { class: 'chips' }, ...state.data.modifiers.map((md) => h('label', {}, h('input', { type: 'checkbox', checked: c.modifiers.includes(md.id), onchange: (ev: Event) => { c.modifiers = (ev.target as HTMLInputElement).checked ? [...c.modifiers, md.id] : c.modifiers.filter((x) => x !== md.id); render(); } }), `${md.name} `, h('span', { class: 'muted' }, modifierText(md))))),
    h('div', { class: 'muted' }, 'Need a modifier that is not listed? Add it on the Modifiers tab, then link it here.'),
    h('label', {}, 'note (for the designers, not shown in game)', h('input', { value: c.note ?? '', onchange: (ev: Event) => { const v = (ev.target as HTMLInputElement).value.trim(); if (v) c.note = v; else delete c.note; render(); } })),
    h('div', { class: 'text' }, 'Card text: ', cardText(c, m)),
    h('div', { class: 'actions' },
      h('button', { class: 'primary', onclick: () => { state.editing = null; render(); } }, 'Done'),
      h('button', { onclick: () => { const copy = clone(c); copy.id = slug(c.name + '_copy'); let i = 2; while (state.data.cards.some((x) => x.id === copy.id)) copy.id = slug(c.name) + `_copy${i++}`; copy.name = c.name + ' copy'; state.data.cards.push(copy); if (fam) fam.cards.push(copy.id); state.editing = copy.id; render(); } }, 'Duplicate'),
      shipped ? h('span', { class: 'muted' }, 'Shipped cards cannot be deleted; set the family to none to retire one.') : h('button', { class: 'danger', onclick: () => { if (!confirm(`Delete ${c.name}?`)) return; state.data.cards = state.data.cards.filter((x) => x !== c); for (const f of state.data.families) f.cards = f.cards.filter((x) => x !== c.id); state.editing = null; render(); } }, 'Delete'),
    ),
  );
  return form;
}

function addCard() {
  let id = 'new_card', i = 2;
  while (state.data.cards.some((c) => c.id === id)) id = `new_card_${i++}`;
  const c: CardDef = { id, name: 'New card', classId: 'warrior', rarity: 'common', uses: null, damage: { percent: 100, bonus: 0, hits: 1, type: 'physical', ignoreDef: false, drain: 0, targets: 'one' }, heal: null, modifiers: [] };
  state.data.cards.push(c);
  state.editing = id;
  render();
}

// ---------------------------------------------------------------- modifiers tab

function modifiersTab(): HTMLElement {
  const el = h('div', {});
  el.append(h('div', { class: 'actions' }, h('button', { class: 'primary', onclick: () => { let id = 'new_modifier', i = 2; while (state.data.modifiers.some((m) => m.id === id)) id = `new_modifier_${i++}`; state.data.modifiers.push({ id, name: 'New modifier', target: 'self', status: 'guard', amount: 1 }); state.editingMod = id; render(); } }, '+ New modifier')));
  el.append(h('div', { class: 'muted' }, 'A modifier is a status with fixed numbers. Cards link modifiers; a change here changes every card that links it.'));
  const list = h('div', { class: 'list' });
  for (const m of state.data.modifiers) {
    if (state.editingMod === m.id) { list.append(modifierForm(m)); continue; }
    const users = usedBy(m.id);
    list.append(h('div', { class: 'row', onclick: () => { state.editingMod = m.id; render(); } },
      h('div', { class: 'name' }, m.name, ' ', h('span', { class: 'muted' }, `· ${m.target} ${m.status}`)),
      h('div', { class: 'muted' }, users.length ? `used by ${users.length}` : 'unused'),
      h('div', { class: 'sum' }, modifierText(m) + (users.length ? ` — ${users.join(', ')}` : '')),
    ));
  }
  el.append(list);
  return el;
}

function modifierForm(m: ModifierDef): HTMLElement {
  const users = usedBy(m.id);
  // A removal (DECISIONS #48) is always on the enemy and has no numbers: it runs before the card's hit.
  const removal = isRemoval(m.status);
  // A backfire (DECISIONS #51) is on yourself and takes one number: the share of max HP it costs.
  const backfire = m.status === 'backfire';
  const fixed = removal || backfire;
  const st = m.status as StatusId;
  const needsRounds = !fixed && !HIT_STATUSES.includes(st) && st !== 'chill';
  const needsAmount = !fixed && AMOUNT_STATUSES.includes(st);
  return h('div', { class: 'form' },
    h('div', { class: 'grid' },
      h('label', {}, 'id', h('input', { value: m.id, disabled: users.length > 0, onchange: (ev: Event) => { const v = slug((ev.target as HTMLInputElement).value); if (state.data.modifiers.some((x) => x.id === v && x !== m)) { alert('that id is taken'); render(); return; } m.id = v; state.editingMod = v; render(); } })),
      h('label', {}, 'name', h('input', { value: m.name, onchange: (ev: Event) => { m.name = (ev.target as HTMLInputElement).value; render(); } })),
      fixed ? null : h('label', {}, 'who gets it', select(m.target, [['self', 'self (the hero)'], ['enemy', 'the enemy']], (v) => { m.target = v as 'self' | 'enemy'; render(); })),
      h('label', {}, 'status', select(m.status, MODIFIER_STATUSES.map((s) => [s, s === 'remove_guard' ? 'remove guard (before the hit)' : s === 'remove_buffs' ? 'remove all buffs (before the hit)' : s === 'backfire' ? 'backfire (if the target survives)' : s]), (v) => {
        m.status = v as ModifierDef['status'];
        if (m.status === 'backfire') { m.target = 'self'; m.amount = 100; delete m.rounds; delete m.chance; delete m.magic; render(); return; }
        if (isRemoval(m.status)) { m.target = 'enemy'; delete m.rounds; delete m.amount; delete m.chance; delete m.magic; render(); return; }
        const s = m.status as StatusId;
        if (HIT_STATUSES.includes(s) || s === 'chill') delete m.rounds; else m.rounds ??= 2;
        if (AMOUNT_STATUSES.includes(s)) m.amount ??= 1; else delete m.amount;
        render();
      })),
      needsRounds ? h('label', {}, 'rounds (end-of-round ticks)', numInput(m.rounds ?? 1, (v) => { m.rounds = v; render(); }, 1, 9)) : null,
      backfire ? h('label', {}, 'max HP lost if the target survives (%)', numInput(m.amount ?? 100, (v) => { m.amount = v; render(); }, 1, 100)) : null,
      needsAmount ? h('label', {}, HIT_STATUSES.includes(st) ? 'hits blocked' : 'damage per round', numInput(m.amount ?? 1, (v) => { m.amount = v; render(); }, 1, 9)) : null,
      fixed ? null : h('label', {}, 'chance % (blank = always)', h('input', { type: 'number', value: m.chance ?? '', min: 1, max: 100, inputmode: 'numeric', onchange: (ev: Event) => { const v = Number((ev.target as HTMLInputElement).value); if (v >= 1 && v <= 100) m.chance = v; else delete m.chance; render(); } })),
      m.target === 'enemy' && !fixed ? h('label', {}, 'counts as magic (Ward can block it)', h('input', { type: 'checkbox', checked: !!m.magic, onchange: (ev: Event) => { if ((ev.target as HTMLInputElement).checked) m.magic = true; else delete m.magic; render(); } })) : null,
      h('label', {}, 'card text (blank = generated)', h('input', { value: m.text ?? '', onchange: (ev: Event) => { const v = (ev.target as HTMLInputElement).value.trim(); if (v) m.text = v; else delete m.text; render(); } })),
    ),
    h('div', { class: 'text' }, 'Reads as: ', modifierText(m)),
    removal ? h('div', { class: 'muted' }, 'Runs before the card\'s damage, on the enemies the damage hits (every enemy for a card that hits all). Remove guard takes Guard only; remove all buffs takes Guard, Ward, Aegis, Hardened, Braced and Scattered.') : null,
    backfire ? h('div', { class: 'muted' }, 'Checked after the card\'s damage: if the target (any enemy it hit, for a card that hits all) is still standing, you lose this share of your max HP. No Guard, Ward or Aegis stops it. 100% means the gamble is your life.') : null,
    fixed ? null : h('div', { class: 'muted' }, 'Timing: a status ticks at the end of the round it was applied in. Self, 1 round = this round only; self, 2 rounds = this round and your next turn; enemy, 2 rounds = your next turn. Guard and Ward count hits, Chill lasts one enemy action.'),
    h('div', { class: 'actions' },
      h('button', { class: 'primary', onclick: () => { state.editingMod = null; render(); } }, 'Done'),
      users.length ? h('span', { class: 'muted' }, `Linked by ${users.join(', ')}; unlink it there before deleting.`) : h('button', { class: 'danger', onclick: () => { state.data.modifiers = state.data.modifiers.filter((x) => x !== m); state.editingMod = null; render(); } }, 'Delete'),
    ),
  );
}

// ---------------------------------------------------------------- tree tab

function treeTab(): HTMLElement {
  const nodes = state.data.trees.warrior;
  const table = h('table', {}, h('tr', {}, h('th', {}, 'family'), h('th', {}, 'cost (points)'), h('th', {}, 'requires'), h('th', {}, 'cards')));
  for (const n of nodes) {
    const f = state.data.families.find((x) => x.id === n.setId)!;
    table.append(h('tr', {},
      h('td', {}, h('input', { value: f.name, onchange: (ev: Event) => { f.name = (ev.target as HTMLInputElement).value; render(); } })),
      h('td', {}, numInput(n.cost, (v) => { n.cost = v; render(); }, 0, 10)),
      h('td', {}, h('div', { class: 'chips' }, ...nodes.filter((o) => o !== n).map((o) => h('label', {}, h('input', { type: 'checkbox', checked: (n.requires ?? []).includes(o.setId), onchange: (ev: Event) => { const req = new Set(n.requires ?? []); if ((ev.target as HTMLInputElement).checked) req.add(o.setId); else req.delete(o.setId); if (req.size) n.requires = [...req]; else delete n.requires; render(); } }), state.data.families.find((x) => x.id === o.setId)!.name)))),
      h('td', { class: 'muted' }, f.cards.map((id) => state.data.cards.find((c) => c.id === id)?.name ?? id).join(', ')),
    ));
  }
  // Starting deck: the basic cards dealt in every warrior fight, with copies.
  const deck = state.data.basics.warrior;
  const basicsAvail = state.data.cards.filter((c) => c.rarity === 'basic');
  const deckBox = h('div', { class: 'form' },
    h('div', { class: 'muted' }, 'Dealt on top of the run deck in every fight, not counted against the deck cap. Make a card basic on the Cards tab to list it here. Attack, Defend and Ward are shared with the other classes and cannot be edited; a new basic can.'),
    h('div', { class: 'chips' }, ...[...new Set(deck)].map((id) => { const c = basicsAvail.find((x) => x.id === id); const n = deck.filter((x) => x === id).length; return h('label', {}, `${c?.name ?? id} ×${n} `, h('button', { onclick: () => { state.data.basics.warrior = [...deck, id]; render(); } }, '+'), h('button', { onclick: () => { const i = deck.lastIndexOf(id); if (i >= 0) { deck.splice(i, 1); render(); } } }, '−')); })),
    h('div', { class: 'chips' }, ...basicsAvail.filter((c) => !deck.includes(c.id)).map((c) => h('button', { onclick: () => { state.data.basics.warrior = [...deck, c.id]; render(); } }, `+ ${c.name}`))),
  );
  return h('div', {}, h('h2', {}, 'Starting deck'), deckBox, h('h2', {}, 'Tree nodes'), h('div', { class: 'muted' }, 'Points come one per level. A family drops its cards once bought; a card\'s family is set on the Cards tab.'), table,
    h('div', { class: 'actions' }, h('button', { class: 'primary', onclick: () => { let id = 'warrior_new', i = 2; while (state.data.families.some((f) => f.id === id)) id = `warrior_new_${i++}`; state.data.families.push({ id, classId: 'warrior', name: 'New family', cards: [] }); nodes.push({ setId: id, cost: 2 }); render(); } }, '+ New family')));
}

// ---------------------------------------------------------------- export

const jsonText = () => JSON.stringify(state.data, null, 2) + '\n';
async function exportJson() {
  const text = jsonText();
  const file = new File([text], 'cards.json', { type: 'application/json' });
  const nav = navigator as Navigator & { canShare?: (d: { files: File[] }) => boolean };
  if (nav.share && nav.canShare?.({ files: [file] })) { try { await nav.share({ files: [file], title: 'cards.json' }); return; } catch { /* fall through to download */ } }
  const url = URL.createObjectURL(file);
  const a = h('a', { href: url, download: 'cards.json' }) as HTMLAnchorElement;
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
async function copyJson() {
  try { await navigator.clipboard.writeText(jsonText()); alert('Copied cards.json to the clipboard.'); } catch { prompt('Copy this:', jsonText()); }
}

render();

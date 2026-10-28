/**
 * The world editor (DECISIONS #55): a phone-first page, reached from the title screen, that edits
 * world.json (node rules per screen, the dialogue library, each enemy's everyday lines) and exports
 * the file. Like the card editor it never changes the game: an exported file is imported by the
 * procedure in docs/WORLD.md.
 */
import './editor.css';
import { WORLD } from '@data/world';
import { SCREEN_ASCII, diffWorld, enemyTrigger, validateWorld, type WorldData } from '@data/worldSchema';
import { CONTENT_GLYPHS, listSlots, type Slot } from '@core/map/authored';
import { RULE_KINDS, type NodeRule, type RuleKind } from '@core/map/types';
import { CLASSES, ENEMIES, SKILLS } from '@data/index';
import { PAIRS } from '@data/packs';
import type { Cond, DEffect, Dialogue, DOption } from '@core/dialogue';
import type { QuestDef } from '@core/quest';
import { ITEMS } from '@data/index';

const DRAFT_KEY = 'rerpg:world-draft';
const clone = <T>(x: T): T => JSON.parse(JSON.stringify(x));
const SHIPPED: WorldData = clone(WORLD);

type Tab = 'nodes' | 'quests' | 'dialogue' | 'enemies';
interface State { data: WorldData; tab: Tab; screen: number; node: string | null; dlg: string | null; quest: string | null; pin: string | null; search: string; }
const state: State = { data: loadDraft(), tab: 'nodes', screen: 0, node: null, dlg: null, quest: null, pin: null, search: '' };

function loadDraft(): WorldData {
  try { const raw = localStorage.getItem(DRAFT_KEY); if (raw) { const d = JSON.parse(raw) as WorldData; if (d.version === SHIPPED.version && Array.isArray(d.dialogue) && Array.isArray(d.screens)) return d; } } catch { /* fresh */ }
  return clone(SHIPPED);
}
function saveDraft() { try { localStorage.setItem(DRAFT_KEY, JSON.stringify(state.data)); } catch { /* ignore */ } }

const app = document.getElementById('app')!;
type Child = Node | string | null | undefined | false;
const h = (tag: string, attrs: Record<string, unknown> = {}, ...children: Child[]): HTMLElement => {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') el.className = String(v);
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v as EventListener);
    else if (k === 'style' && typeof v === 'string') el.setAttribute('style', v);
    else if (v !== undefined && v !== null && v !== false) el.setAttribute(k, String(v));
  }
  for (const c of children) if (c !== null && c !== undefined && c !== false) el.append(c);
  return el;
};
const select = (value: string, options: [string, string][], onChange: (v: string) => void): HTMLElement =>
  h('select', { onchange: (ev: Event) => onChange((ev.target as HTMLSelectElement).value) }, ...options.map(([v, label]) => h('option', { value: v, selected: v === value }, label)));
const text = (value: string, onChange: (v: string) => void, attrs: Record<string, unknown> = {}): HTMLElement =>
  h('input', { value, onchange: (ev: Event) => onChange((ev.target as HTMLInputElement).value), ...attrs });
/** A number field; blank gives undefined. */
const num = (value: number | undefined, onChange: (v: number | undefined) => void, attrs: Record<string, unknown> = {}): HTMLElement =>
  h('input', { type: 'number', inputmode: 'numeric', value: value ?? '', onchange: (ev: Event) => { const raw = (ev.target as HTMLInputElement).value.trim(); onChange(raw === '' || isNaN(Number(raw)) ? undefined : Number(raw)); }, ...attrs });
const seg = <T extends string>(value: T, options: [T, string][], onChange: (v: T) => void): HTMLElement =>
  h('div', { class: 'seg' }, ...options.map(([v, label]) => h('button', { 'aria-pressed': v === value, onclick: () => onChange(v) }, label)));
const field = (label: string, ...control: Child[]): HTMLElement => h('label', {}, label, ...control);

// ---------------------------------------------------------------- shared lookups

const GLYPH: Record<string, string> = { E: 'start camp', q: 'quest node', n: 'lost one\'s node', B: 'boss', o: 'open slot', x: 'elite', f: 'monster', u: 'unknown', c: 'treasure', s: 'shop', h: 'shrine' };
const GLYPH_DEFAULT: Record<string, string> = {
  E: 'Wren\'s words, then the quest', q: 'Tam\'s words', n: 'the lost one\'s words', B: 'the gate boss and its words',
  o: 'rolled each run: a shop, a shrine, treasure or a fight', x: 'always a duo', f: 'a fight', u: 'a hidden fight', c: 'treasure', s: 'the shop', h: 'a shrine',
};
const SHORT: Record<string, string> = { E: 'start', q: 'Tam', n: 'lost', B: 'boss', o: 'open', x: 'elite', f: 'fight', u: 'unknown', c: 'chest', s: 'shop', h: 'shrine' };
const KIND_LABEL: Record<RuleKind, string> = { monster: 'Monster', unknown: 'Unknown', elite: 'Elite duo', treasure: 'Treasure', shop: 'Shop', shrine: 'Shrine' };
const enemyName = (id: string) => ENEMIES.find((e) => e.id === id)?.name ?? id;
const tierOf = (screen: number) => (screen === 0 ? 1 : 2);
const fightersFor = (screen: number) => ENEMIES.filter((e) => e.archetype !== 'boss' && e.tier === tierOf(screen));
const bosses = () => ENEMIES.filter((e) => e.archetype === 'boss');
const firstLine = (d: Dialogue) => (d.lines[0] ?? '').slice(0, 70) + ((d.lines[0] ?? '').length > 70 ? '…' : '');
const dlgById = (id: string) => state.data.dialogue.find((d) => d.id === id);
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '') || 'line';
const freshId = (base: string) => { let id = slug(base), i = 2; while (dlgById(id)) id = `${slug(base)}_${i++}`; return id; };

// ---------------------------------------------------------------- page

function render() {
  saveDraft();
  const scrollY = window.scrollY;
  app.replaceChildren();
  const problems = validateWorld(state.data);
  const changes = diffWorld(SHIPPED, state.data);
  app.append(
    h('h1', {}, 'Re-RPG world editor'),
    h('div', { class: 'actions' },
      h('button', { class: 'primary', onclick: exportJson }, 'Export world.json'),
      h('button', { onclick: copyJson }, 'Copy JSON'),
      h('button', { class: 'danger', onclick: () => { if (confirm('Throw away every edit and reload the shipped world?')) { state.data = clone(SHIPPED); state.node = null; state.dlg = null; render(); } } }, 'Reset'),
      h('button', { onclick: () => { window.location.href = './'; } }, 'Game'),
    ),
    problems.length ? h('div', { class: 'problems' }, problems.join('\n')) : h('div', { class: 'ok' }, changes.length ? `${changes.length} change${changes.length === 1 ? '' : 's'} from shipped` : 'No changes from the shipped world.'),
    h('div', { class: 'tabs sticky', role: 'tablist' },
      ...(['nodes', 'quests', 'dialogue', 'enemies'] as const).map((t) => h('button', { role: 'tab', 'aria-selected': state.tab === t, onclick: () => { state.tab = t; render(); window.scrollTo(0, 0); } }, t === 'nodes' ? 'Nodes' : t === 'quests' ? 'Quests' : t === 'dialogue' ? 'Words' : 'Enemies')),
    ),
    state.tab === 'nodes' ? nodesTab() : state.tab === 'quests' ? questsTab() : state.tab === 'dialogue' ? dialogueTab() : enemiesTab(),
  );
  window.scrollTo(0, scrollY);
}

// ---------------------------------------------------------------- nodes

const rulesOf = (screen: number): Record<string, NodeRule> => (state.data.screens[screen] ??= { nodes: {} }).nodes;
function setRule(rules: Record<string, NodeRule>, id: string, r: NodeRule) {
  const clean = Object.fromEntries(Object.entries(r).filter(([, v]) => v !== undefined)) as NodeRule;
  if (Object.keys(clean).length) rules[id] = clean; else delete rules[id];
  render();
}

function nodesTab(): HTMLElement {
  const ascii = SCREEN_ASCII[state.screen]!;
  const rows = ascii.split('\n').map((r) => r.trimEnd()).filter((r) => r.length > 0);
  const W = Math.max(...rows.map((r) => r.length)), H = rows.length;
  const slots = listSlots(ascii);
  const rules = rulesOf(state.screen);
  const map = h('div', { class: 'map', style: `aspect-ratio: ${W} / ${H}` });
  if (state.screen === 0) map.append(h('img', { src: './art/c/map1.jpg', alt: 'screen 1', draggable: 'false' }));
  else map.append(terrainGrid(rows, W));
  for (const s of slots) {
    const ruled = !!rules[s.id];
    const cls = ['dot', ruled ? 'ruled' : '', state.node === s.id ? 'sel' : '', CONTENT_GLYPHS.includes(s.glyph) ? '' : 'story'].filter(Boolean).join(' ');
    map.append(h('button', { class: cls, style: `left:${((s.pos.x + 0.5) / W) * 100}%; top:${((s.pos.y + 0.5) / H) * 100}%`, onclick: () => { state.node = state.node === s.id ? null : s.id; render(); }, 'aria-label': s.id }, s.id.replace('node_', '')));
  }
  const sel = slots.find((s) => s.id === state.node);
  const ruledList = slots.filter((s) => rules[s.id]);
  return h('div', {},
    seg(String(state.screen) as '0' | '1', [['0', 'Screen 1'], ['1', 'Screen 2']], (v) => { state.screen = Number(v); state.node = null; render(); }),
    h('div', { class: 'muted', style: 'margin:6px 0' }, 'Tap a node on the map (it scrolls sideways) or in the list. Gold has rules; dashed are story nodes and the boss.'),
    h('div', { class: 'mapwrap' }, map),
    h('div', { class: 'nodechips' }, ...slots.map((s) => h('button', { class: rules[s.id] ? 'ruled' : '', 'aria-pressed': state.node === s.id, onclick: () => { state.node = state.node === s.id ? null : s.id; render(); } }, `${s.id.replace('node_', '')} ${SHORT[s.glyph]}`))),
    sel ? nodePanel(sel, state.screen, rules, () => { state.node = null; }) : h('div', { class: 'muted', style: 'margin-top:8px' }, 'No node selected.'),
    h('h2', {}, `Rules on screen ${state.screen + 1} (${ruledList.length})`),
    ruledList.length ? h('div', { class: 'list' }, ...ruledList.map((s) => h('div', { class: 'row', onclick: () => { state.node = s.id; render(); } },
      h('div', { class: 'name' }, `${s.id} · ${GLYPH[s.glyph]}`), h('div', {}), h('div', { class: 'sum' }, ruleSummary(rules[s.id]!))))) : h('div', { class: 'muted' }, 'None yet: every node rolls as usual.'),
  );
}

const TERRAIN_COLOR: Record<string, string> = { '.': '#3b5a2e', '#': '#24401f', '=': '#a08455', '~': '#2d5c8a', '^': '#57534e', '%': '#3e4a2a', A: '#7a6a4a' };
function terrainGrid(rows: string[], W: number): HTMLElement {
  const g = h('div', { class: 'grid-bg', style: `grid-template-columns: repeat(${W}, 1fr)` });
  for (const r of rows) for (let x = 0; x < W; x++) { const ch = r[x] ?? '^'; g.append(h('div', { style: `background:${TERRAIN_COLOR[ch] ?? (ch === 'B' ? TERRAIN_COLOR.A : TERRAIN_COLOR['='])}` })); }
  return g;
}

function ruleSummary(r: NodeRule): string {
  const bits: string[] = [];
  if (r.kind) bits.push(`always ${KIND_LABEL[r.kind]}`);
  if (r.odds) { const t = Object.values(r.odds).reduce((a, b) => a + (b ?? 0), 0); bits.push(Object.entries(r.odds).map(([k, w]) => `${KIND_LABEL[k as RuleKind]} ${Math.round(((w ?? 0) / t) * 100)}%`).join(', ')); }
  if (r.enemy) bits.push(enemyName(r.enemy));
  if (r.pair) bits.push(`${enemyName(r.pair[0])} + ${enemyName(r.pair[1])}`);
  if (r.dialogue) bits.push(`words: ${dlgById(r.dialogue)?.speaker ?? '?'} (${r.dialogue})`);
  return bits.join(' · ');
}

/** One node's rules, in a screen's own set or a special quest's pins (DECISIONS #58). */
function nodePanel(s: Slot, screen: number, rules: Record<string, NodeRule>, close: () => void): HTMLElement {
  const r: NodeRule = { ...(rules[s.id] ?? {}) };
  const content = CONTENT_GLYPHS.includes(s.glyph), boss = s.glyph === 'B';
  const put = (patch: Partial<NodeRule>) => setRule(rules, s.id, { ...r, ...patch });
  const el = h('div', { class: 'form' },
    h('div', { class: 'name' }, `${s.id} · ${GLYPH[s.glyph]}`),
    h('div', { class: 'muted' }, `Unset: ${GLYPH_DEFAULT[s.glyph]}.`),
  );
  if (content) {
    const mode: 'rolled' | 'always' | 'odds' = r.kind ? 'always' : r.odds ? 'odds' : 'rolled';
    el.append(h('h2', {}, 'What it is'), seg(mode, [['rolled', 'Rolled'], ['always', 'Always'], ['odds', 'Odds']], (m) => {
      if (m === 'rolled') put({ kind: undefined, odds: undefined });
      if (m === 'always') put({ kind: r.kind ?? 'monster', odds: undefined });
      if (m === 'odds') put({ kind: undefined, odds: r.odds ?? { monster: 3, treasure: 1 } });
    }));
    if (r.kind) el.append(seg(r.kind, RULE_KINDS.map((k) => [k, KIND_LABEL[k]] as [RuleKind, string]), (k) => put({ kind: k })));
    if (r.odds) {
      const odds = r.odds;
      const total = Object.values(odds).reduce((a, b) => a + (b ?? 0), 0) || 1;
      el.append(h('div', { class: 'sub' }, h('div', { class: 'muted' }, 'Weights: the chance of each is its share of the total. Blank or 0 leaves it out.'),
        ...RULE_KINDS.map((k) => h('div', { class: 'kv' }, h('span', {}, KIND_LABEL[k]), num(odds[k], (v) => { const o = { ...odds }; if (v && v > 0) o[k] = v; else delete o[k]; put({ odds: Object.keys(o).length ? o : undefined }); }, { min: 0, max: 100, style: 'width:72px' }), h('span', { class: 'muted' }, odds[k] ? `${Math.round((odds[k]! / total) * 100)}%` : '–')))));
    }
  }
  if (content || boss) {
    const fmode: 'rolled' | 'one' | 'pair' = r.pair ? 'pair' : r.enemy ? 'one' : 'rolled';
    const pool = boss ? bosses() : fightersFor(screen);
    el.append(h('h2', {}, boss ? 'Who holds the gate' : 'Who you fight (if it is a fight)'),
      seg(fmode, boss ? [['rolled', 'Usual'], ['one', 'Pick']] : [['rolled', 'Rolled'], ['one', 'One enemy'], ['pair', 'A duo']], (m) => {
        if (m === 'rolled') put({ enemy: undefined, pair: undefined });
        if (m === 'one') put({ enemy: r.enemy ?? pool[0]!.id, pair: undefined });
        if (m === 'pair') put({ enemy: undefined, pair: r.pair ?? (PAIRS[tierOf(screen) as 1 | 2][0]!) });
      }));
    if (r.enemy) el.append(select(r.enemy, pool.map((e) => [e.id, e.name]), (v) => put({ enemy: v })));
    if (r.pair) {
      const pair = r.pair;
      el.append(h('div', { class: 'grid' },
        field('front', select(pair[0], pool.map((e) => [e.id, e.name]), (v) => put({ pair: [v, pair[1]] }))),
        field('behind', select(pair[1], pool.map((e) => [e.id, e.name]), (v) => put({ pair: [pair[0], v] })))),
        h('div', { class: 'chips' }, ...PAIRS[tierOf(screen) as 1 | 2].map(([a, b]) => h('button', { onclick: () => put({ pair: [a, b] }) }, `${enemyName(a)} + ${enemyName(b)}`))));
    }
  }
  el.append(h('h2', {}, 'Words'), dialoguePicker(r.dialogue, (v) => put({ dialogue: v || undefined }), 'Usual words'));
  const d = r.dialogue ? dlgById(r.dialogue) : undefined;
  if (d) el.append(h('div', { class: 'say' }, `${d.speaker}: ${firstLine(d)}`), h('button', { onclick: () => openDialogue(d.id) }, 'Edit these words'));
  el.append(h('div', { class: 'actions' },
    h('button', { class: 'primary', onclick: () => { close(); render(); } }, 'Done'),
    Object.keys(r).length ? h('button', { class: 'danger', onclick: () => setRule(rules, s.id, {}) }, 'Clear rules') : null));
  return el;
}

/** Every dialogue entry in a select, grouped by speaker. */
function dialoguePicker(value: string | undefined, onChange: (v: string) => void, blank: string): HTMLElement {
  const bySpeaker = new Map<string, Dialogue[]>();
  for (const d of state.data.dialogue) bySpeaker.set(d.speaker, [...(bySpeaker.get(d.speaker) ?? []), d]);
  const sel = h('select', { onchange: (ev: Event) => onChange((ev.target as HTMLSelectElement).value) }, h('option', { value: '', selected: !value }, blank));
  for (const [sp, list] of bySpeaker) sel.append(h('optgroup', { label: sp }, ...list.map((d) => h('option', { value: d.id, selected: d.id === value }, `${d.id}: ${firstLine(d)}`))));
  return sel;
}

// ---------------------------------------------------------------- dialogue

function openDialogue(id: string) { state.tab = 'dialogue'; state.dlg = id; state.search = ''; render(); document.getElementById(`d-${id}`)?.scrollIntoView({ block: 'start' }); }

function dialogueTab(): HTMLElement {
  const q = state.search.toLowerCase();
  const list = state.data.dialogue.filter((d) => !q || [d.id, d.speaker, d.trigger, ...d.lines].some((x) => x.toLowerCase().includes(q)));
  return h('div', {},
    h('div', { class: 'bar' },
      h('input', { type: 'search', placeholder: 'Search words, speakers, triggers', value: state.search, style: 'flex:1', oninput: (ev: Event) => { state.search = (ev.target as HTMLInputElement).value; render(); (document.querySelector('input[type=search]') as HTMLInputElement | null)?.focus(); } }),
      h('button', { class: 'primary', onclick: () => { const d = newEntry('new_line', 'new_line', 'Someone'); openDialogue(d.id); } }, '+ New')),
    h('div', { class: 'list' }, ...list.map((d) => (state.dlg === d.id ? dialogueForm(d) : dialogueRow(d)))),
    list.length ? null : h('div', { class: 'muted' }, 'Nothing matches.'),
  );
}

function dialogueRow(d: Dialogue): HTMLElement {
  return h('div', { class: 'row', id: `d-${d.id}`, onclick: () => { state.dlg = d.id; render(); } },
    h('div', { class: 'name' }, d.speaker), h('div', { class: 'muted' }, d.trigger),
    h('div', { class: 'sum' }, `${d.id}${d.when?.length ? ' · only when ' + d.when.map(condLabel).join(', ') : ''} — ${firstLine(d)}`));
}

function newEntry(id: string, trigger: string, speaker: string, portrait?: string): Dialogue {
  const d: Dialogue = { id: freshId(id), trigger, speaker, lines: [''], options: [{ text: 'Fight.', effects: [{ fight: true }], default: true }] };
  if (portrait) d.portrait = portrait;
  state.data.dialogue.push(d);
  return d;
}

/** Who points at a dialogue entry, so a referenced one is not deleted or renamed from under them. */
function referencesTo(id: string): string[] {
  const out: string[] = [];
  for (const [eid, e] of Object.entries(state.data.enemies)) if (e.defaults.includes(id)) out.push(`${enemyName(eid)}'s defaults`);
  state.data.screens.forEach((sc, i) => { for (const [nid, r] of Object.entries(sc.nodes)) if (r.dialogue === id) out.push(`screen ${i + 1} ${nid}`); });
  return out;
}

function dialogueForm(d: Dialogue): HTMLElement {
  const refs = referencesTo(d.id), shipped = SHIPPED.dialogue.some((x) => x.id === d.id);
  const triggers = [...new Set([...state.data.dialogue.map((x) => x.trigger), ...ENEMIES.map((e) => enemyTrigger(e.id)), 'node:quest', 'node:lost', 'giver:wren'])].sort();
  const portraits = [...new Set(state.data.dialogue.map((x) => x.portrait).filter((p): p is string => !!p))].sort();
  const el = h('div', { class: 'form', id: `d-${d.id}` },
    h('div', { class: 'grid' },
      field('id', text(d.id, (v) => { const id = slug(v); if (id !== d.id && dlgById(id)) { alert('That id is taken.'); render(); return; } d.id = id; state.dlg = id; render(); }, { disabled: shipped || refs.length > 0 })),
      field('speaker', text(d.speaker, (v) => { d.speaker = v; render(); })),
      field('trigger (what asks for it)', text(d.trigger, (v) => { d.trigger = v.trim(); render(); }, { list: 'triggers' }), h('datalist', { id: 'triggers' }, ...triggers.map((t) => h('option', { value: t })))),
      field('portrait', text(d.portrait ?? '', (v) => { if (v.trim()) d.portrait = v.trim(); else delete d.portrait; render(); }, { list: 'portraits', placeholder: 'none' }), h('datalist', { id: 'portraits' }, ...portraits.map((p) => h('option', { value: p })))),
    ),
    h('h2', {}, 'Lines'),
    h('div', { class: 'lines list' }, ...d.lines.map((l, i) => h('div', { class: 'kv', style: 'grid-template-columns:1fr auto' },
      h('textarea', { rows: 2, onchange: (ev: Event) => { d.lines[i] = (ev.target as HTMLTextAreaElement).value; render(); } }, l),
      h('button', { onclick: () => { d.lines.splice(i, 1); if (!d.lines.length) d.lines.push(''); render(); }, 'aria-label': 'remove line' }, '✕')))),
    h('button', { onclick: () => { d.lines.push(''); render(); } }, '+ Line'),
    h('div', { class: 'muted' }, 'Fill-ins: {species} {weapon} {killer} {ghostClass} {ghostCard}.'),
    h('h2', {}, 'Only when (all must hold; none = always)'),
    condList(d.when ?? [], (w) => { if (w.length) d.when = w; else delete d.when; render(); }),
    h('h2', {}, 'Options'),
    ...d.options.map((o, i) => optionForm(d, o, i)),
    h('button', { onclick: () => { d.options.push({ text: 'Fight.', effects: [{ fight: true }] }); render(); } }, '+ Option'),
    h('div', { class: 'actions' },
      h('button', { class: 'primary', onclick: () => { state.dlg = null; render(); } }, 'Done'),
      h('button', { onclick: () => { const c = clone(d); c.id = freshId(d.id); state.data.dialogue.splice(state.data.dialogue.indexOf(d) + 1, 0, c); state.dlg = c.id; render(); } }, 'Duplicate'),
      shipped || refs.length ? h('span', { class: 'muted' }, refs.length ? `Used by ${refs.join(', ')}.` : 'A shipped entry stays; unhook it instead.') :
        h('button', { class: 'danger', onclick: () => { state.data.dialogue = state.data.dialogue.filter((x) => x !== d); state.dlg = null; render(); } }, 'Delete'),
    ),
  );
  return el;
}

function optionForm(d: Dialogue, o: DOption, i: number): HTMLElement {
  return h('div', { class: 'sub' },
    h('div', { class: 'kv', style: 'grid-template-columns:1fr auto' }, text(o.text, (v) => { o.text = v; render(); }, { placeholder: 'What the player says' }),
      h('button', { onclick: () => { d.options.splice(i, 1); render(); }, 'aria-label': 'remove option' }, '✕')),
    h('label', { class: 'chips' }, h('label', {}, h('input', { type: 'checkbox', checked: !!o.default, onchange: (ev: Event) => { for (const x of d.options) delete x.default; if ((ev.target as HTMLInputElement).checked) o.default = true; render(); } }), 'the one Skip picks')),
    h('div', { class: 'muted' }, 'Shown only when:'),
    condList(o.when ?? [], (w) => { if (w.length) o.when = w; else delete o.when; render(); }),
    h('div', { class: 'muted' }, 'Does:'),
    effectList(o.effects, (e) => { o.effects = e; render(); }),
  );
}

// ---- conditions

type CondType = 'flag' | 'relation' | 'deaths' | 'killedBy' | 'level' | 'gold' | 'fights' | 'class' | 'chance';
const COND_TYPES: [CondType, string][] = [['flag', 'a flag'], ['relation', 'a relation'], ['deaths', 'deaths'], ['killedBy', 'last killed by'], ['level', 'level'], ['gold', 'gold'], ['fights', 'fights won'], ['class', 'class'], ['chance', 'chance']];
const condType = (c: Cond): CondType => Object.keys(c)[0] as CondType;
const blankCond = (t: CondType): Cond => (t === 'flag' ? { flag: 'some_flag' } : t === 'relation' ? { relation: 'wren', min: 1 } : t === 'deaths' ? { deaths: 'screen', min: 1 } : t === 'killedBy' ? { killedBy: 'boar' } : t === 'level' ? { level: { min: 2 } } : t === 'gold' ? { gold: { min: 5 } } : t === 'fights' ? { fights: { min: 1 } } : t === 'class' ? { class: 'warrior' } : { chance: 0.5 });
const range = (r: { min?: number; max?: number }) => `${r.min !== undefined ? `≥${r.min}` : ''}${r.min !== undefined && r.max !== undefined ? ' ' : ''}${r.max !== undefined ? `≤${r.max}` : ''}`;
function condLabel(c: Cond): string {
  if ('flag' in c) return `${c.is === false ? 'not ' : ''}${c.flag}`;
  if ('relation' in c) return `${c.relation} ${range(c)}`;
  if ('deaths' in c) return `deaths (${c.deaths}) ${range(c)}`;
  if ('killedBy' in c) return `killed by ${enemyName(c.killedBy)}`;
  if ('level' in c) return `level ${range(c.level)}`;
  if ('gold' in c) return `gold ≥${c.gold.min ?? 0}`;
  if ('fights' in c) return `fights ${range(c.fights)}`;
  if ('class' in c) return c.class;
  return `${Math.round(c.chance * 100)}% chance`;
}

function condList(list: Cond[], onChange: (l: Cond[]) => void): HTMLElement {
  const set = (i: number, c: Cond) => { const l = [...list]; l[i] = c; onChange(l); };
  return h('div', { class: 'list' },
    ...list.map((c, i) => h('div', { class: 'kv', style: 'grid-template-columns:auto 1fr auto' },
      select(condType(c), COND_TYPES, (t) => set(i, blankCond(t as CondType))),
      condFields(c, (n) => set(i, n)),
      h('button', { onclick: () => onChange(list.filter((_, j) => j !== i)), 'aria-label': 'remove condition' }, '✕'))),
    h('button', { onclick: () => onChange([...list, blankCond('flag')]) }, '+ Condition'));
}

function condFields(c: Cond, set: (c: Cond) => void): HTMLElement {
  const box = h('div', { class: 'chips' });
  const minmax = (r: { min?: number; max?: number }, put: (r: { min?: number; max?: number }) => void) => [
    num(r.min, (v) => put({ ...r, min: v }), { placeholder: 'min', style: 'width:68px' }), num(r.max, (v) => put({ ...r, max: v }), { placeholder: 'max', style: 'width:68px' })];
  if ('flag' in c) box.append(text(c.flag, (v) => set({ ...c, flag: slug(v) }), { style: 'width:130px' }), select(c.is === false ? 'no' : 'yes', [['yes', 'is set'], ['no', 'is not set']], (v) => set(v === 'no' ? { flag: c.flag, is: false } : { flag: c.flag })));
  else if ('relation' in c) box.append(text(c.relation, (v) => set({ ...c, relation: slug(v) }), { style: 'width:100px' }), ...minmax(c, (r) => set({ relation: c.relation, ...r })));
  else if ('deaths' in c) box.append(select(c.deaths, [['screen', 'on this screen'], ['total', 'in total']], (v) => set({ ...c, deaths: v as 'screen' | 'total' })), ...minmax(c, (r) => set({ deaths: c.deaths, ...r })));
  else if ('killedBy' in c) box.append(select(c.killedBy, ENEMIES.map((e) => [e.id, e.name]), (v) => set({ killedBy: v })));
  else if ('level' in c) box.append(...minmax(c.level, (r) => set({ level: r })));
  else if ('gold' in c) box.append(num(c.gold.min, (v) => set({ gold: { min: v } }), { placeholder: 'min', style: 'width:68px' }));
  else if ('fights' in c) box.append(...minmax(c.fights, (r) => set({ fights: r })));
  else if ('class' in c) box.append(select(c.class, CLASSES.map((k) => [k.id, k.name]), (v) => set({ class: v as typeof c.class })));
  else box.append(num(Math.round(c.chance * 100), (v) => set({ chance: Math.max(1, Math.min(100, v ?? 50)) / 100 }), { style: 'width:68px' }), h('span', { class: 'muted' }, '%'));
  return box;
}

// ---- effects

type EffType = 'fight' | 'skip' | 'next' | 'flag' | 'relation' | 'gold' | 'hp' | 'tome' | 'rearm';
const EFF_TYPES: [EffType, string][] = [['fight', 'start the fight'], ['skip', 'walk on'], ['next', 'lead on to'], ['flag', 'set a flag'], ['relation', 'move a relation'], ['gold', 'gold'], ['hp', 'HP'], ['tome', 'give a card'], ['rearm', 're-arm last fight']];
const effType = (e: DEffect): EffType => Object.keys(e)[0] as EffType;
const blankEff = (t: EffType): DEffect => (t === 'fight' ? { fight: true } : t === 'skip' ? { skip: true } : t === 'next' ? { next: state.data.dialogue[0]!.trigger } : t === 'flag' ? { flag: 'some_flag' } : t === 'relation' ? { relation: 'wren', delta: 1 } : t === 'gold' ? { gold: 5 } : t === 'hp' ? { hp: -2 } : t === 'tome' ? { tome: 'random' } : { rearm: true });

function effectList(list: DEffect[], onChange: (l: DEffect[]) => void): HTMLElement {
  const set = (i: number, e: DEffect) => { const l = [...list]; l[i] = e; onChange(l); };
  const triggers = [...new Set(state.data.dialogue.map((d) => d.trigger))].sort();
  return h('div', { class: 'list' },
    ...list.map((e, i) => {
      const box = h('div', { class: 'chips' });
      if ('next' in e) box.append(select(e.next, triggers.map((t) => [t, t]), (v) => set(i, { next: v })));
      else if ('flag' in e) box.append(text(e.flag, (v) => set(i, { ...e, flag: slug(v) }), { style: 'width:130px' }), select(e.value === false ? 'off' : 'on', [['on', 'on'], ['off', 'off']], (v) => set(i, v === 'off' ? { flag: e.flag, value: false } : { flag: e.flag })));
      else if ('relation' in e) box.append(text(e.relation, (v) => set(i, { ...e, relation: slug(v) }), { style: 'width:100px' }), num(e.delta, (v) => set(i, { ...e, delta: v ?? 0 }), { style: 'width:68px' }));
      else if ('gold' in e) box.append(num(e.gold, (v) => set(i, { gold: v ?? 0 }), { style: 'width:80px' }));
      else if ('hp' in e) box.append(num(e.hp, (v) => set(i, { hp: v ?? 0 }), { style: 'width:80px' }));
      else if ('tome' in e) box.append(select(e.tome, [['random', 'random from the run'], ...SKILLS.filter((k) => k.rarity !== 'basic').map((k) => [k.id, k.name] as [string, string])], (v) => set(i, { tome: v })));
      return h('div', { class: 'kv', style: 'grid-template-columns:auto 1fr auto' },
        select(effType(e), EFF_TYPES, (t) => set(i, blankEff(t as EffType))), box,
        h('button', { onclick: () => onChange(list.filter((_, j) => j !== i)), 'aria-label': 'remove effect' }, '✕'));
    }),
    h('button', { onclick: () => onChange([...list, blankEff('fight')]) }, '+ Effect'));
}

// ---------------------------------------------------------------- quests (DECISIONS #57)

type QKind = 'fetch' | 'hunt' | 'escort';
const QTYPE_LABEL: Record<QuestDef['type'], string> = { rolled: 'Rolled', fetch: 'Fetch', hunt: 'Hunt', escort: 'Escort' };
const people = (screen: number) => listSlots(SCREEN_ASCII[screen]!).filter((x) => 'Eqn'.includes(x.glyph));
const personLabel = (screen: number, id: string) => { const x = people(screen).find((p) => p.id === id); return x ? `${GLYPH[x.glyph]} (${id})` : id; };

function questsTab(): HTMLElement {
  const el = h('div', {}, h('div', { class: 'muted', style: 'margin:6px 0' }, 'Each run, a screen offers one quest whose "only when" holds. On a special run it offers its special quest when one qualifies. A quest can lead on to the next with "then".'),
    h('div', { class: 'kv', style: 'grid-template-columns:1fr auto auto' }, h('span', {}, 'Special runs'), num(Math.round((state.data.specialChance ?? 0) * 100), (v) => { state.data.specialChance = Math.max(0, Math.min(100, v ?? 0)) / 100; render(); }, { min: 0, max: 100, style: 'width:72px' }), h('span', { class: 'muted' }, '% of runs')),
    h('div', { class: 'actions' }, h('button', { class: 'primary', onclick: newQuest }, '+ New quest')));
  for (const screen of [0, 1]) {
    el.append(h('h2', {}, `Screen ${screen + 1}`));
    const qs = (state.data.quests ??= []).filter((q) => q.screen === screen);
    el.append(h('div', { class: 'list' }, ...qs.map((q) => (state.quest === q.id ? questForm(q) : h('div', { class: 'row', onclick: () => { state.quest = q.id; render(); } },
      h('div', { class: 'name' }, q.name), h('div', { class: 'muted' }, `${QTYPE_LABEL[q.type]}${q.special ? ' · special' : ''}`),
      h('div', { class: 'sum' }, `${q.voice.name} at ${personLabel(q.screen, q.giver)}${q.when?.length ? ' · only when ' + q.when.map(condLabel).join(', ') : ''}${q.then ? ` · then ${q.then}` : ''}`))))),
      qs.length ? '' : h('div', { class: 'muted' }, 'No quest: this screen offers none.'));
  }
  return el;
}

/** The nodes a special quest pins for its run (DECISIONS #58): the same panel as the Nodes tab, on the quest's own rules. */
function pinsEditor(q: QuestDef): HTMLElement {
  const slots = listSlots(SCREEN_ASCII[q.screen]!);
  const pins = (q.nodes ??= {});
  const sel = slots.find((x) => x.id === state.pin);
  const el = h('div', { class: 'sub' }, h('div', { class: 'muted' }, 'While this is the screen\'s quest, these nodes are set like this (over the Nodes tab). Tap a node:'),
    h('div', { class: 'nodechips' }, ...slots.map((x) => h('button', { class: pins[x.id] ? 'ruled' : '', 'aria-pressed': state.pin === x.id, onclick: () => { state.pin = state.pin === x.id ? null : x.id; render(); } }, `${x.id.replace('node_', '')} ${SHORT[x.glyph]}`))),
    sel ? nodePanel(sel, q.screen, pins, () => { state.pin = null; }) : '',
    ...Object.entries(pins).map(([id, r]) => h('div', { class: 'say' }, `${id}: ${ruleSummary(r)}`)));
  if (!Object.keys(pins).length && !sel) delete q.nodes;
  return el;
}

function newQuest() {
  const wren = SHIPPED.quests[0]!;
  let id = 'new_quest', i = 2; while (state.data.quests.some((q) => q.id === id)) id = `new_quest_${i++}`;
  const q: QuestDef = { id, name: 'New quest', screen: state.screen, giver: 'node_6', type: 'hunt', voice: { ...clone(wren.voice), name: 'Someone', title: '' }, hunt: { need: 2 }, reward: {} };
  state.data.quests.push(q); state.quest = id; render();
}

function questForm(q: QuestDef): HTMLElement {
  const shipped = SHIPPED.quests.some((x) => x.id === q.id);
  const used = (k: QKind) => q.type === k || q.type === 'rolled';
  const pool = fightersFor(q.screen);
  const v = q.voice;
  const line = (label: string, value: string, put: (s: string) => void) => field(label, h('textarea', { rows: 2, onchange: (ev: Event) => { put((ev.target as HTMLTextAreaElement).value); render(); } }, value));
  const el = h('div', { class: 'form', id: `q-${q.id}` },
    h('div', { class: 'grid' },
      field('name', text(q.name, (x) => { q.name = x; render(); })),
      field('id', text(q.id, (x) => { const id = slug(x); if (id !== q.id && state.data.quests.some((o) => o.id === id)) { alert('That id is taken.'); render(); return; } for (const o of state.data.quests) if (o.then === q.id) o.then = id; q.id = id; state.quest = id; render(); }, { disabled: shipped })),
      field('screen', select(String(q.screen), [['0', 'Screen 1'], ['1', 'Screen 2']], (x) => { q.screen = Number(x); delete q.then; if (q.hunt?.enemy) delete q.hunt.enemy; render(); })),
      field('who gives it, where', select(q.giver, people(q.screen).map((p) => [p.id, personLabel(q.screen, p.id)]), (x) => { q.giver = x; render(); })),
    ),
    h('h2', {}, 'Type'),
    seg(q.type, (['rolled', 'fetch', 'hunt', 'escort'] as const).map((t) => [t, QTYPE_LABEL[t]]), (t) => { q.type = t; if (used('escort') && !q.escort?.node) q.escort = { node: people(q.screen).find((p) => p.id !== q.giver)!.id }; render(); }),
    q.type === 'rolled' ? h('div', { class: 'muted' }, 'Each run picks fetch, hunt or escort; set up all three below.') : null,
  );
  if (used('fetch')) el.append(h('h2', {}, 'Fetch: what to bring'), select(q.fetch?.id ?? '', [['', 'Rolled from the run\'s loot'], ...ITEMS.map((i) => [i.id, `item: ${i.name}`] as [string, string]), ...SKILLS.filter((k) => k.rarity !== 'basic').map((k) => [k.id, `card: ${k.name}`] as [string, string])], (x) => { if (x) q.fetch = { id: x }; else delete q.fetch; render(); }));
  if (used('hunt')) {
    const hunt = (q.hunt ??= {});
    el.append(h('h2', {}, 'Hunt: what to kill'),
      h('div', { class: 'grid' },
        field('species', select(hunt.enemy ?? '', [['', 'Rolled from this screen'], ...pool.map((e) => [e.id, e.name] as [string, string])], (x) => { if (x) hunt.enemy = x; else delete hunt.enemy; render(); })),
        field('how many', num(hunt.need ?? 2, (x) => { hunt.need = Math.max(1, Math.min(9, x ?? 2)); render(); }, { min: 1, max: 9 }))),
      hunt.enemy ? '' : h('div', { class: 'chips' }, h('span', { class: 'muted' }, 'never ask for:'), ...pool.map((e) => h('label', {}, h('input', { type: 'checkbox', checked: (hunt.avoid ?? []).includes(e.id), onchange: (ev: Event) => { const on = (ev.target as HTMLInputElement).checked; hunt.avoid = on ? [...(hunt.avoid ?? []), e.id] : (hunt.avoid ?? []).filter((x) => x !== e.id); if (!hunt.avoid.length) delete hunt.avoid; render(); } }), e.name))));
  }
  if (used('escort')) {
    const esc = (q.escort ??= {});
    el.append(h('h2', {}, 'Escort: who, and where they wait'), h('div', { class: 'grid' },
      field('waits at', select(esc.node ?? '', [['', 'choose…'], ...people(q.screen).filter((p) => p.id !== q.giver).map((p) => [p.id, personLabel(q.screen, p.id)] as [string, string])], (x) => { if (x) esc.node = x; else delete esc.node; render(); })),
      field('their name (blank = rolled)', text(esc.name ?? '', (x) => { if (x.trim()) esc.name = x.trim(); else delete esc.name; render(); }))));
  }
  el.append(h('h2', {}, 'The giver\'s lines'), h('div', { class: 'grid' },
    field('giver name', text(v.name, (x) => { v.name = x; render(); })), field('title', text(v.title, (x) => { v.title = x; render(); }))),
    h('div', { class: 'muted' }, 'Fill-ins: {target} and {need}.'));
  for (const k of ['fetch', 'hunt', 'escort'] as const) if (used(k)) el.append(line(`${k}: the offer`, v.intro[k], (x) => { v.intro[k] = x; }), line(`${k}: the thanks`, v.complete[k], (x) => { v.complete[k] = x; }));
  el.append(line('on accept', v.accept, (x) => { v.accept = x; }), line('not done yet', v.progress, (x) => { v.progress = x; }), line('on decline', v.decline, (x) => { v.decline = x; }));
  const r = q.reward;
  el.append(h('h2', {}, 'Reward'), h('div', { class: 'grid' },
    field('gold (blank = standard)', num(r.gold, (x) => { if (x === undefined) delete r.gold; else r.gold = Math.max(0, Math.min(500, Math.round(x))); render(); }, { min: 0, max: 500 })),
    field('spoils pick', select(r.offer ?? '', [['', 'standard for the type'], ['none', 'none'], ['kill', 'small (kill)'], ['guard', 'good (guard)'], ['chest', 'chest'], ['boss', 'boss']], (x) => { if (x) r.offer = x as typeof r.offer; else delete r.offer; render(); })),
    field('card', select(r.tome ?? '', [['', 'none'], ...SKILLS.filter((k) => k.rarity !== 'basic').map((k) => [k.id, k.name] as [string, string])], (x) => { if (x) r.tome = x; else delete r.tome; render(); })),
    field('sets flag', text(r.flag ?? '', (x) => { const f = slug(x); if (x.trim()) r.flag = f; else delete r.flag; render(); }, { placeholder: 'none' })),
    field('relation', text(r.relation?.name ?? '', (x) => { if (x.trim()) r.relation = { name: slug(x), delta: r.relation?.delta ?? 1 }; else delete r.relation; render(); }, { placeholder: 'none' })),
    r.relation ? field('by', num(r.relation.delta, (x) => { r.relation!.delta = x ?? 0; render(); })) : ''),
    h('div', { class: 'muted' }, 'Standard: fetch 15 gold and the item back +1; hunt 25 gold and a good pick; escort 20 gold and a chest. Doubled on screen 2.'),
    h('h2', {}, 'Offered only when (none = always)'),
    condList(q.when ?? [], (w) => { if (w.length) q.when = w; else delete q.when; render(); }),
    h('h2', {}, 'Runs'),
    h('div', { class: 'chips' }, h('label', {}, h('input', { type: 'checkbox', checked: !!q.special, onchange: (ev: Event) => { if ((ev.target as HTMLInputElement).checked) q.special = true; else { delete q.special; delete q.nodes; } render(); } }), 'special runs only')),
    q.special ? pinsEditor(q) : '',
    field('then offer', select(q.then ?? '', [['', 'nothing'], ...state.data.quests.filter((o) => o.screen === q.screen && o.id !== q.id).map((o) => [o.id, o.name] as [string, string])], (x) => { if (x) q.then = x; else delete q.then; render(); })),
    h('div', { class: 'actions' },
      h('button', { class: 'primary', onclick: () => { state.quest = null; render(); } }, 'Done'),
      h('button', { onclick: () => { const c = clone(q); let id = `${q.id}_copy`, i = 2; while (state.data.quests.some((o) => o.id === id)) id = `${q.id}_copy_${i++}`; c.id = id; c.name += ' (copy)'; state.data.quests.push(c); state.quest = id; render(); } }, 'Duplicate'),
      shipped ? h('span', { class: 'muted' }, 'A shipped quest stays; make it special or give it a condition to retire it.') : h('button', { class: 'danger', onclick: () => { state.data.quests = state.data.quests.filter((o) => o !== q); for (const o of state.data.quests) if (o.then === q.id) delete o.then; state.quest = null; render(); } }, 'Delete')));
  return el;
}

// ---------------------------------------------------------------- enemies

function enemiesTab(): HTMLElement {
  const el = h('div', {}, h('div', { class: 'muted', style: 'margin:6px 0' }, 'Each enemy\'s everyday lines: when none of its "only when" entries holds and its node has no override, it says one of these at random. Aim for 10–20 each.'));
  for (const tier of [1, 2] as const) {
    el.append(h('h2', {}, `Screen ${tier}`));
    const list = h('div', { class: 'list' });
    for (const e of ENEMIES.filter((x) => (x.archetype === 'boss' ? (x.tier === 'boss1' ? 1 : 2) : x.tier) === tier)) {
      const trig = enemyTrigger(e.id);
      const ent = (state.data.enemies[e.id] ??= { defaults: [] });
      const entries = state.data.dialogue.filter((d) => d.trigger === trig);
      list.append(h('div', { class: 'form' },
        h('div', { class: 'name' }, `${e.name}  `, h('span', { class: 'muted' }, `${ent.defaults.length} everyday line${ent.defaults.length === 1 ? '' : 's'} · ${trig}`)),
        ...entries.map((d) => h('div', { class: 'kv', style: 'grid-template-columns:auto 1fr auto' },
          h('input', { type: 'checkbox', checked: ent.defaults.includes(d.id), 'aria-label': 'everyday', onchange: (ev: Event) => { ent.defaults = (ev.target as HTMLInputElement).checked ? [...ent.defaults, d.id] : ent.defaults.filter((x) => x !== d.id); render(); } }),
          h('div', { class: 'say' }, `${d.when?.length ? `[only when ${d.when.map(condLabel).join(', ')}] ` : ''}${firstLine(d)}`),
          h('button', { onclick: () => openDialogue(d.id) }, 'Edit'))),
        h('button', { onclick: () => { const d = newEntry(`${e.id}_line`, trig, e.name, `enemy_${e.id}`); ent.defaults.push(d.id); openDialogue(d.id); } }, '+ New everyday line'),
      ));
    }
    el.append(list);
  }
  return el;
}

// ---------------------------------------------------------------- export

const jsonText = () => JSON.stringify(state.data, null, 2) + '\n';
async function exportJson() {
  const file = new File([jsonText()], 'world.json', { type: 'application/json' });
  const nav = navigator as Navigator & { canShare?: (d: { files: File[] }) => boolean };
  if (nav.share && nav.canShare?.({ files: [file] })) { try { await nav.share({ files: [file], title: 'world.json' }); return; } catch { /* fall through to download */ } }
  const url = URL.createObjectURL(file);
  const a = h('a', { href: url, download: 'world.json' }) as HTMLAnchorElement;
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
async function copyJson() {
  try { await navigator.clipboard.writeText(jsonText()); alert('Copied world.json to the clipboard.'); } catch { prompt('Copy this:', jsonText()); }
}

render();

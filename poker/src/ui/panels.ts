// In-game panels: pause menu, hand replay with everyone's cards and equity per street, settings,
// and the career screen.
import { equity } from '../bots/equity';
import { TOURNAMENTS, type TournamentKey } from '../bots/characters';
import { describeHand, evaluate } from '../engine/evaluator';
import { type Hand, type Street } from '../engine/hand';
import { mulberry32 } from '../engine/rng';
import { type Save, TROPHIES } from '../game/career';
import { money } from './format';
import { cardHtml, ordinal } from './overlay';

export interface ReplayPlayer {
  seat: number;
  name: string;
}

const STREETS: Street[] = ['preflop', 'flop', 'turn', 'river'];

function streetBoard(hand: Hand, street: Street): number[] {
  const n = street === 'preflop' ? 0 : street === 'flop' ? 3 : street === 'turn' ? 4 : 5;
  return hand.board.slice(0, n);
}

/** Equity of every player still in the hand at the start of each street, against the actual cards. */
export function replayEquities(hand: Hand): Map<Street, Map<number, number>> {
  const rng = mulberry32(hand.handNumber * 7919 + 1);
  const out = new Map<Street, Map<number, number>>();
  const foldedBefore = new Map<number, Street | 'never'>();
  for (const p of hand.players) foldedBefore.set(p.seat, 'never');
  let street: Street = 'preflop';
  for (const e of hand.events) {
    if (e.type === 'street') street = e.street;
    if (e.type === 'action' && e.action.type === 'fold') foldedBefore.set(e.seat, street);
  }
  const reached = new Set<Street>(['preflop']);
  for (const e of hand.events) if (e.type === 'street') reached.add(e.street);
  for (const s of STREETS) {
    if (!reached.has(s)) break;
    const board = streetBoard(hand, s);
    const live = hand.players.filter((p) => {
      const f = foldedBefore.get(p.seat);
      return f === 'never' || STREETS.indexOf(f as Street) >= STREETS.indexOf(s);
    });
    const m = new Map<number, number>();
    if (live.length === 1) m.set(live[0].seat, 1);
    else if (board.length === 5) {
      const scores = live.map((p) => ({ seat: p.seat, score: evaluate([...p.hole, ...board]) }));
      const top = Math.max(...scores.map((x) => x.score));
      const winners = scores.filter((x) => x.score === top);
      for (const x of scores) m.set(x.seat, x.score === top ? 1 / winners.length : 0);
    } else {
      for (const p of live) {
        const others = live.filter((q) => q.seat !== p.seat).map((q) => [[q.hole[0], q.hole[1]]]);
        m.set(p.seat, equity(p.hole, board, others.length, { rng, samples: 240, ranges: others }));
      }
    }
    out.set(s, m);
  }
  return out;
}

export class Panels {
  private readonly root: HTMLElement;
  onResume: () => void = () => {};
  onQuit: () => void = () => {};
  onSettings: (s: Save['settings']) => void = () => {};
  onReset: () => void = () => {};

  constructor(root: HTMLElement) {
    this.root = root;
  }

  get isOpen(): boolean {
    return this.root.classList.contains('show');
  }

  private render(html: string): void {
    this.root.innerHTML = `<div class="panel">${html}</div>`;
    this.root.classList.add('show');
  }

  close(): void {
    this.root.classList.remove('show');
    this.root.innerHTML = '';
  }

  pause(hasHistory: boolean, save: Save): void {
    this.render(`
      <div class="eyebrow">Paused</div>
      <div class="stack">
        <button class="primary resume">Resume</button>
        <button class="row replay" ${hasHistory ? '' : 'disabled'}>Last hand, with hole cam</button>
        <button class="row settings">Settings</button>
        <button class="row quit">Quit to menu</button>
      </div>`);
    this.root.querySelector('.resume')!.addEventListener('click', () => this.onResume());
    this.root.querySelector('.replay')!.addEventListener('click', () => this.onReplayRequest());
    this.root.querySelector('.settings')!.addEventListener('click', () => this.settings(save, () => this.pause(hasHistory, save)));
    this.root.querySelector('.quit')!.addEventListener('click', () => this.onQuit());
  }

  onReplayRequest: () => void = () => {};

  replay(history: Hand[], players: ReplayPlayer[], index: number, onBack: () => void): void {
    const hand = history[index];
    const name = (seat: number) => players.find((p) => p.seat === seat)?.name ?? `Seat ${seat}`;
    const eq = replayEquities(hand);
    const live = (s: Street) => eq.get(s);
    const reached = STREETS.filter((s) => eq.has(s));
    const actionsByStreet = new Map<Street, string[]>();
    let street: Street = 'preflop';
    for (const e of hand.events) {
      if (e.type === 'street') street = e.street;
      if (e.type === 'post') (actionsByStreet.get('preflop') ?? actionsByStreet.set('preflop', []).get('preflop')!).push(`${name(e.seat)} posts ${money(e.amount)}`);
      if (e.type === 'action') {
        const a = e.action;
        const text = a.type === 'fold' ? 'folds' : a.type === 'check' ? 'checks' : a.type === 'call' ? `calls ${money(e.amount)}` : a.type === 'bet' ? `bets ${money(a.amount)}` : `raises to ${money(a.amount)}`;
        (actionsByStreet.get(street) ?? actionsByStreet.set(street, []).get(street)!).push(`${name(e.seat)} ${text}${e.allIn ? ' (all in)' : ''}`);
      }
    }
    const end = hand.events.at(-1);
    const winners = end?.type === 'end' ? end.winners : [];
    const seats = hand.players.map((p) => {
      const cells = reached.map((s) => {
        const v = live(s)?.get(p.seat);
        return `<td>${v === undefined ? '<span class="dim">—</span>' : `${Math.round(v * 100)}%`}</td>`;
      }).join('');
      const final = hand.board.length >= 3 ? describeHand(evaluate([...p.hole, ...hand.board])) : '';
      return `<tr class="${winners.includes(p.seat) ? 'win' : ''} ${p.folded ? 'folded' : ''}"><td class="pname">${name(p.seat)}</td><td class="cards">${p.hole.map(cardHtml).join('')}</td>${cells}<td class="desc">${p.folded ? 'folded' : final}</td></tr>`;
    }).join('');
    const streetsHtml = reached.map((s) => `<div class="street"><div class="sname">${s}${s !== 'preflop' ? ` <span class="cards">${streetBoard(hand, s).slice(s === 'flop' ? 0 : s === 'turn' ? 3 : 4).map(cardHtml).join('')}</span>` : ''}</div><div class="acts">${(actionsByStreet.get(s) ?? []).join(' · ')}</div></div>`).join('');
    this.render(`
      <div class="replayhead">
        <button class="link back">Back</button>
        <div class="eyebrow">Hand ${hand.handNumber} · hole cam</div>
        <div class="nav"><button class="link prev" ${index > 0 ? '' : 'disabled'}>Older</button><button class="link next" ${index < history.length - 1 ? '' : 'disabled'}>Newer</button></div>
      </div>
      <div class="replaybody">
        <table class="eqtable"><thead><tr><th></th><th></th>${reached.map((s) => `<th>${s}</th>`).join('')}<th></th></tr></thead><tbody>${seats}</tbody></table>
        <div class="streets">${streetsHtml}</div>
      </div>`);
    this.root.querySelector('.back')!.addEventListener('click', onBack);
    this.root.querySelector('.prev')!.addEventListener('click', () => this.replay(history, players, index - 1, onBack));
    this.root.querySelector('.next')!.addEventListener('click', () => this.replay(history, players, index + 1, onBack));
  }

  settings(save: Save, onBack: () => void): void {
    const s = save.settings;
    this.render(`
      <div class="eyebrow">Settings</div>
      <div class="stack">
        <label class="row toggle"><span>Sound</span><input type="checkbox" class="sound" ${s.sound ? 'checked' : ''}></label>
        <label class="row toggle"><span>Table talk</span>
          <select class="banter"><option value="1" ${s.banter === 1 ? 'selected' : ''}>Normal</option><option value="0.5" ${s.banter === 0.5 ? 'selected' : ''}>Less</option><option value="0" ${s.banter === 0 ? 'selected' : ''}>Off</option></select></label>
        <button class="row danger reset">Reset career and bot memories</button>
        <button class="primary back">Done</button>
      </div>`);
    const apply = () => {
      s.sound = this.root.querySelector<HTMLInputElement>('.sound')!.checked;
      s.banter = Number(this.root.querySelector<HTMLSelectElement>('.banter')!.value);
      this.onSettings(s);
    };
    this.root.querySelector('.sound')!.addEventListener('change', apply);
    this.root.querySelector('.banter')!.addEventListener('change', apply);
    this.root.querySelector('.reset')!.addEventListener('click', () => {
      if (confirm('Wipe your career, trophies and what the bots remember about you?')) this.onReset();
    });
    this.root.querySelector('.back')!.addEventListener('click', onBack);
  }

  career(save: Save, onBack: () => void): void {
    const keys = Object.keys(TOURNAMENTS) as TournamentKey[];
    const rows = keys.map((k) => {
      const r = save.tournaments[k];
      const finishes = r.finishes.slice(1).map((n, i) => `<span class="fin"><b>${ordinal(i + 1)}</b> ${n}</span>`).join('');
      return `<div class="crow"><div class="cname">${TOURNAMENTS[k].name}</div>
        <div class="cstats">${r.played} played · ${r.wins} won · ${r.handsPlayed} hands</div>
        <div class="cfin">${finishes}</div>
        <div class="cbest">${r.bestHand ? `Best hand: ${r.bestHand.description}` : 'No showdowns won yet'}${r.biggestPot ? ` · Biggest pot: ${money(r.biggestPot)}` : ''}</div></div>`;
    }).join('');
    const trophies = TROPHIES.map((t) => {
      const got = save.trophies[t.id];
      return `<div class="trophy ${got ? 'got' : ''}"><div class="tn">${t.name}</div><div class="tb">${t.blurb}</div>${got && got.count > 1 ? `<div class="tc">×${got.count}</div>` : ''}</div>`;
    }).join('');
    this.render(`
      <div class="replayhead"><button class="link back">Back</button><div class="eyebrow">Career</div><div></div></div>
      <div class="replaybody">
        <div class="career">${rows}</div>
        <div class="eyebrow" style="margin-top:14px">Trophies · ${Object.keys(save.trophies).length} of ${TROPHIES.length}</div>
        <div class="trophies">${trophies}</div>
      </div>`);
    this.root.querySelector('.back')!.addEventListener('click', onBack);
  }
}

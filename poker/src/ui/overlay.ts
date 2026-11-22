// HTML labels pinned to points in the 3D scene: name plates, bets, the pot, plus the big hole
// cards, the info strip and toasts.
import * as THREE from 'three';
import { type Card, RANK_CHARS, rankOf, suitOf } from '../engine/cards';
import { type BlindLevel } from '../engine/tournament';
import { money } from './format';

interface Anchored {
  el: HTMLElement;
  pos: THREE.Vector3;
  offsetY: number;
}

const SUIT_GLYPH = ['♣', '♦', '♥', '♠'];

export function cardHtml(card: Card): string {
  const r = RANK_CHARS[rankOf(card)];
  const s = suitOf(card);
  const red = s === 1 || s === 2;
  return `<div class="pcard ${red ? 'red' : ''}"><span class="rank">${r === 'T' ? '10' : r}</span><span class="suit">${SUIT_GLYPH[s]}</span></div>`;
}

export class Overlay {
  private readonly root: HTMLElement;
  private readonly holeEl: HTMLElement;
  private readonly infoEl: HTMLElement;
  private readonly toastEl: HTMLElement;
  private anchored = new Map<string, Anchored>();
  private plates = new Map<number, HTMLElement>();
  private tmp = new THREE.Vector3();
  private toastTimer: number | null = null;
  private level: BlindLevel | null = null;
  private handNumber = 0;
  tournamentName = '';

  private readonly boardEl: HTMLElement;
  private boardCards: Card[] = [];
  private potAmount = 0;

  private readonly meEl: HTMLElement;
  private readonly standingsEl: HTMLElement;

  constructor(root: HTMLElement, holeEl: HTMLElement, infoEl: HTMLElement, toastEl: HTMLElement, boardEl: HTMLElement, meEl: HTMLElement, standingsEl: HTMLElement) {
    this.root = root;
    this.meEl = meEl;
    this.standingsEl = standingsEl;
    standingsEl.addEventListener('click', () => this.hideStandings());
    this.holeEl = holeEl;
    this.infoEl = infoEl;
    this.toastEl = toastEl;
    this.boardEl = boardEl;
  }

  /** The community cards, big and readable, at the top of the screen. */
  setBoard(cards: Card[]): void {
    const same = cards.length === this.boardCards.length && cards.every((c, i) => c === this.boardCards[i]);
    if (same) return;
    const added = cards.length > this.boardCards.length;
    this.boardCards = [...cards];
    const slots = cards.map((c, i) => `<div class="slot ${added && i >= cards.length - (cards.length === 3 ? 3 : 1) ? 'new' : ''}">${cardHtml(c)}</div>`);
    for (let i = cards.length; i < 5; i++) slots.push('<div class="slot empty"></div>');
    this.boardEl.querySelector('.cards')!.innerHTML = slots.join('');
    this.renderPot();
  }

  private renderPot(): void {
    const el = this.boardEl.querySelector('.potline')!;
    el.textContent = this.potAmount > 0 ? `POT ${money(this.potAmount)}` : '';
    this.boardEl.classList.toggle('show', this.boardCards.length > 0 || this.potAmount > 0);
  }

  private anchor(key: string, pos: THREE.Vector3, className: string, offsetY = 0): HTMLElement {
    let a = this.anchored.get(key);
    if (!a) {
      const el = document.createElement('div');
      el.className = className;
      this.root.appendChild(el);
      a = { el, pos: pos.clone(), offsetY };
      this.anchored.set(key, a);
    } else {
      a.pos.copy(pos);
    }
    return a.el;
  }

  plate(seat: number, pos: THREE.Vector3, name: string, stack: number): void {
    const el = seat === 0 ? this.meEl : this.anchor(`plate${seat}`, pos, 'plate', 0);
    if (seat === 0) el.className = 'plate me';
    el.innerHTML = `<div class="tag"></div><div class="pos"></div><div class="name"></div><div class="stack"></div>`;
    el.querySelector('.name')!.textContent = name;
    el.querySelector('.stack')!.textContent = money(stack);
    el.dataset.seat = String(seat);
    this.plates.set(seat, el);
  }

  setStack(seat: number, stack: number): void {
    const el = this.plates.get(seat);
    if (el) el.querySelector('.stack')!.textContent = stack > 0 ? money(stack) : 'ALL IN';
  }

  setTag(seat: number, text: string, kind = ''): void {
    const el = this.plates.get(seat);
    if (!el) return;
    const tag = el.querySelector('.tag') as HTMLElement;
    tag.textContent = text;
    tag.className = `tag ${kind}`;
    tag.classList.toggle('show', text.length > 0);
  }

  /** Table position badge: BTN, SB, BB, UTG, HJ, CO. Empty hides it. */
  setPosition(seat: number, label: string): void {
    const el = this.plates.get(seat)?.querySelector('.pos') as HTMLElement | undefined;
    if (!el) return;
    el.textContent = label;
    el.classList.toggle('show', label.length > 0);
    el.classList.toggle('btn', label === 'BTN');
  }

  /** Between hands: everyone ranked by stack, with their position for the coming hand. */
  showStandings(rows: { seat: number; name: string; stack: number; position: string; finish?: number }[], header: string, ms: number): void {
    const el = this.standingsEl;
    const sorted = [...rows].sort((a, b) => {
      if (a.finish && b.finish) return a.finish - b.finish;
      if (a.finish) return 1;
      if (b.finish) return -1;
      return b.stack - a.stack;
    });
    el.innerHTML = `<div class="shead">${header}</div><ol>${sorted
      .map((r, i) => `<li class="${r.seat === 0 ? 'you' : ''} ${r.finish ? 'out' : ''}"><span class="rank">${r.finish ? ordinal(r.finish) : i + 1}</span><span class="nm">${r.name}</span><span class="pos ${r.position === 'BTN' ? 'btn' : ''}">${r.position}</span><span class="st">${r.finish ? 'OUT' : money(r.stack)}</span></li>`)
      .join('')}</ol>`;
    el.classList.add('show');
    const token = String(Date.now());
    el.dataset.token = token;
    window.setTimeout(() => {
      if (el.dataset.token === token) el.classList.remove('show');
    }, ms);
  }

  hideStandings(): void {
    this.standingsEl.classList.remove('show');
  }

  /** A glow on the plate of whoever is talking. */
  setSpeaking(seat: number, on: boolean): void {
    (seat === 0 ? this.meEl : this.plates.get(seat))?.classList.toggle('speaking', on);
  }

  setActive(seat: number | null): void {
    for (const [s, el] of this.plates) el.classList.toggle('active', s === seat);
  }

  setFolded(seat: number, folded: boolean): void {
    this.plates.get(seat)?.classList.toggle('folded', folded);
  }

  setOut(seat: number, finish: number): void {
    const el = this.plates.get(seat);
    if (!el) return;
    el.classList.add('out');
    el.querySelector('.stack')!.textContent = `OUT · ${ordinal(finish)}`;
  }

  setBet(seat: number, amount: number, pos?: THREE.Vector3): void {
    const el = this.anchor(`bet${seat}`, pos ?? this.anchored.get(`bet${seat}`)?.pos ?? new THREE.Vector3(), 'bet', 20);
    el.textContent = amount > 0 ? money(amount) : '';
    el.classList.toggle('show', amount > 0);
  }

  setPot(amount: number, _pos?: THREE.Vector3): void {
    this.potAmount = amount;
    this.renderPot();
  }

  setHole(cards: Card[] | null): void {
    this.holeEl.innerHTML = cards ? cards.map(cardHtml).join('') : '';
    this.holeEl.classList.toggle('show', !!cards);
  }

  setInfo(info: { level?: BlindLevel; handNumber?: number }): void {
    if (info.level) this.level = info.level;
    if (info.handNumber !== undefined) this.handNumber = info.handNumber;
    const l = this.level;
    this.infoEl.textContent = `${this.tournamentName}${this.handNumber ? ` · Hand ${this.handNumber}` : ''}${l ? ` · Blinds ${money(l.sb)}/${money(l.bb)}${l.ante ? ` · Ante ${money(l.ante)}` : ''}` : ''}`;
  }

  toast(text: string, ms = 2200): void {
    this.toastEl.textContent = text;
    this.toastEl.classList.add('show');
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = window.setTimeout(() => this.toastEl.classList.remove('show'), ms);
  }

  /** Screen x from which a side panel covers the table; anchored labels under it are hidden. */
  panelLeft: number | null = null;

  /** Projects every anchored element to the screen. Called each frame. */
  update(camera: THREE.Camera, width: number, height: number): void {
    for (const a of this.anchored.values()) {
      this.tmp.copy(a.pos).project(camera);
      const behind = this.tmp.z > 1 || (this.panelLeft !== null && (this.tmp.x * 0.5 + 0.5) * width > this.panelLeft - 20);
      let x = (this.tmp.x * 0.5 + 0.5) * width;
      const y = (-this.tmp.y * 0.5 + 0.5) * height + a.offsetY;
      // Keep bubbles and plates on screen when a seat sits near the edge.
      const half = a.el.offsetWidth / 2 + 8;
      if (half > 8) x = Math.min(width - half, Math.max(half, x));
      a.el.style.transform = `translate(-50%, -50%) translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      a.el.style.visibility = behind ? 'hidden' : 'visible';
    }
  }

  /** A speech bubble over a seat (or the dealer) for a while. */
  say(key: string, pos: THREE.Vector3, text: string, ms: number): void {
    const el = this.anchor(`say${key}`, pos, 'bubble', -14);
    el.textContent = text;
    el.classList.add('show');
    const token = String(Date.now());
    el.dataset.token = token;
    window.setTimeout(() => {
      if (el.dataset.token === token) el.classList.remove('show');
    }, ms);
  }

  clear(): void {
    for (const a of this.anchored.values()) a.el.remove();
    this.anchored.clear();
    this.plates.clear();
    this.meEl.className = 'plate me';
    this.meEl.innerHTML = '';
    this.setHole(null);
    this.potAmount = 0;
    this.boardCards = [];
    this.boardEl.classList.remove('show');
  }
}

export function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

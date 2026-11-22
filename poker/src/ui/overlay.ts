// HTML labels pinned to points in the 3D scene: name plates, bets, the pot, plus the big hole
// cards, the info strip and toasts.
import * as THREE from 'three';
import { type Card, RANK_CHARS, rankOf, suitOf } from '../engine/cards';
import { type BlindLevel } from '../engine/tournament';

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

  constructor(root: HTMLElement, holeEl: HTMLElement, infoEl: HTMLElement, toastEl: HTMLElement) {
    this.root = root;
    this.holeEl = holeEl;
    this.infoEl = infoEl;
    this.toastEl = toastEl;
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
    const el = this.anchor(`plate${seat}`, pos, 'plate', seat === 0 ? 10 : 0);
    el.innerHTML = `<div class="tag"></div><div class="name"></div><div class="stack"></div>`;
    el.querySelector('.name')!.textContent = name;
    el.querySelector('.stack')!.textContent = String(stack);
    el.dataset.seat = String(seat);
    this.plates.set(seat, el);
  }

  setStack(seat: number, stack: number): void {
    const el = this.plates.get(seat);
    if (el) el.querySelector('.stack')!.textContent = stack > 0 ? String(stack) : 'ALL IN';
  }

  setTag(seat: number, text: string, kind = ''): void {
    const el = this.plates.get(seat);
    if (!el) return;
    const tag = el.querySelector('.tag') as HTMLElement;
    tag.textContent = text;
    tag.className = `tag ${kind}`;
    tag.classList.toggle('show', text.length > 0);
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
    const el = this.anchor(`bet${seat}`, pos ?? this.anchored.get(`bet${seat}`)?.pos ?? new THREE.Vector3(), 'bet', -26);
    el.textContent = amount > 0 ? String(amount) : '';
    el.classList.toggle('show', amount > 0);
  }

  setPot(amount: number, pos?: THREE.Vector3): void {
    const el = this.anchor('pot', pos ?? this.anchored.get('pot')?.pos ?? new THREE.Vector3(0, 0, -0.6), 'pot', 24);
    el.textContent = amount > 0 ? `POT ${amount}` : '';
    el.classList.toggle('show', amount > 0);
  }

  setHole(cards: Card[] | null): void {
    this.holeEl.innerHTML = cards ? cards.map(cardHtml).join('') : '';
    this.holeEl.classList.toggle('show', !!cards);
  }

  setInfo(info: { level?: BlindLevel; handNumber?: number }): void {
    if (info.level) this.level = info.level;
    if (info.handNumber !== undefined) this.handNumber = info.handNumber;
    const l = this.level;
    this.infoEl.textContent = `${this.tournamentName}${this.handNumber ? ` · Hand ${this.handNumber}` : ''}${l ? ` · Blinds ${l.sb}/${l.bb}${l.ante ? ` · Ante ${l.ante}` : ''}` : ''}`;
  }

  toast(text: string, ms = 2200): void {
    this.toastEl.textContent = text;
    this.toastEl.classList.add('show');
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = window.setTimeout(() => this.toastEl.classList.remove('show'), ms);
  }

  /** Projects every anchored element to the screen. Called each frame. */
  update(camera: THREE.Camera, width: number, height: number): void {
    for (const a of this.anchored.values()) {
      this.tmp.copy(a.pos).project(camera);
      const behind = this.tmp.z > 1;
      const x = (this.tmp.x * 0.5 + 0.5) * width;
      const y = (-this.tmp.y * 0.5 + 0.5) * height + a.offsetY;
      a.el.style.transform = `translate(-50%, -50%) translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      a.el.style.visibility = behind ? 'hidden' : 'visible';
    }
  }

  clear(): void {
    for (const a of this.anchored.values()) a.el.remove();
    this.anchored.clear();
    this.plates.clear();
    this.setHole(null);
  }
}

export function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

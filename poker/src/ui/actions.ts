// The human's action bar: fold, check or call, bet or raise with a sizing panel, and a shot clock.
import { type Action, type LegalActions } from '../engine/hand';

export interface Spot {
  legal: LegalActions;
  /** Chips in the middle before the human acts. */
  pot: number;
  /** The human's chips already in on this street. */
  streetBet: number;
  bigBlind: number;
  deadline: number | null;
}

export class ActionBar {
  private readonly root: HTMLElement;
  private readonly fold: HTMLButtonElement;
  private readonly passive: HTMLButtonElement;
  private readonly aggressive: HTMLButtonElement;
  private readonly sizing: HTMLElement;
  private readonly slider: HTMLInputElement;
  private readonly amountEl: HTMLElement;
  private readonly confirm: HTMLButtonElement;
  private readonly clock: HTMLElement;
  private spot: Spot | null = null;
  private clockTotal = 1;
  private raf = 0;
  onAction: (a: Action) => void = () => {};

  constructor(root: HTMLElement) {
    this.root = root;
    this.fold = root.querySelector('.fold')!;
    this.passive = root.querySelector('.passive')!;
    this.aggressive = root.querySelector('.aggressive')!;
    this.sizing = root.querySelector('.sizing')!;
    this.slider = root.querySelector('input[type=range]')!;
    this.amountEl = root.querySelector('.amount')!;
    this.confirm = root.querySelector('.confirm')!;
    this.clock = root.querySelector('.clock')!;

    this.fold.addEventListener('click', () => this.send({ type: 'fold' }));
    this.passive.addEventListener('click', () => {
      if (!this.spot) return;
      this.send(this.spot.legal.canCheck ? { type: 'check' } : { type: 'call' });
    });
    this.aggressive.addEventListener('click', () => {
      this.sizing.classList.toggle('show');
      this.syncAmount();
    });
    this.slider.addEventListener('input', () => this.syncAmount());
    this.confirm.addEventListener('click', () => {
      if (!this.spot) return;
      const amount = Number(this.slider.value);
      this.send(this.spot.legal.canBet ? { type: 'bet', amount } : { type: 'raise', amount });
    });
    for (const b of root.querySelectorAll<HTMLButtonElement>('.quick')) {
      b.addEventListener('click', () => this.quick(b.dataset.size!));
    }
  }

  show(spot: Spot): void {
    this.spot = spot;
    const { legal } = spot;
    this.fold.disabled = legal.canCheck;
    const callAllIn = !legal.canCheck && legal.callAmount >= legal.maxTo - spot.streetBet;
    this.passive.textContent = legal.canCheck ? 'Check' : callAllIn ? `Call ${legal.callAmount} · all in` : `Call ${legal.callAmount}`;
    const canAggress = legal.canBet || legal.canRaise;
    this.aggressive.disabled = !canAggress;
    this.aggressive.textContent = legal.canBet ? 'Bet' : 'Raise';
    const min = legal.canBet ? legal.minBet : legal.minRaiseTo;
    this.slider.min = String(min);
    this.slider.max = String(legal.maxTo);
    this.slider.step = String(Math.max(1, Math.min(spot.bigBlind / 2, 25)));
    this.slider.value = String(min);
    this.sizing.classList.remove('show');
    this.syncAmount();
    this.root.classList.add('show');
    this.clockTotal = spot.deadline ? Math.max(1, spot.deadline - Date.now()) : 1;
    cancelAnimationFrame(this.raf);
    if (spot.deadline) this.tickClock();
    else this.clock.style.transform = 'scaleX(0)';
  }

  hide(): void {
    this.spot = null;
    this.root.classList.remove('show');
    this.sizing.classList.remove('show');
    cancelAnimationFrame(this.raf);
  }

  private tickClock(): void {
    if (!this.spot?.deadline) return;
    const left = Math.max(0, this.spot.deadline - Date.now());
    const f = left / this.clockTotal;
    this.clock.style.transform = `scaleX(${f.toFixed(3)})`;
    this.clock.classList.toggle('urgent', left < 5000);
    if (left > 0) this.raf = requestAnimationFrame(() => this.tickClock());
  }

  /** Raise-to total for a bet of `fraction` of the pot after calling. */
  private potFraction(fraction: number): number {
    const { legal, pot, streetBet } = this.spot!;
    const call = legal.canCheck ? 0 : legal.callAmount;
    return streetBet + call + Math.round((pot + call) * fraction);
  }

  private quick(size: string): void {
    if (!this.spot) return;
    const { legal } = this.spot;
    const min = legal.canBet ? legal.minBet : legal.minRaiseTo;
    let amount: number;
    switch (size) {
      case 'min': amount = min; break;
      case 'half': amount = this.potFraction(0.5); break;
      case 'threeq': amount = this.potFraction(0.75); break;
      case 'pot': amount = this.potFraction(1); break;
      default: amount = legal.maxTo;
    }
    amount = Math.round(amount / 25) * 25;
    amount = Math.max(min, Math.min(legal.maxTo, amount));
    this.slider.value = String(amount);
    this.syncAmount();
  }

  private syncAmount(): void {
    if (!this.spot) return;
    const { legal } = this.spot;
    const v = Number(this.slider.value);
    const allIn = v >= legal.maxTo;
    const verb = legal.canBet ? 'Bet' : 'Raise to';
    this.amountEl.textContent = allIn ? `All in · ${v}` : `${verb} ${v}`;
    this.confirm.textContent = allIn ? 'All in' : legal.canBet ? 'Bet' : 'Raise';
  }

  private send(a: Action): void {
    this.hide();
    this.onAction(a);
  }
}

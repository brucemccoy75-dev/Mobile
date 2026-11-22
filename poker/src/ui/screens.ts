// Full-screen menus: title, tournament select, results.
import { TOURNAMENTS, type TournamentKey } from '../bots/characters';
import { type TournamentPlayer } from '../engine/tournament';
import { ordinal } from './overlay';

const BLURBS: Record<TournamentKey, string> = {
  tutorial: 'Nits and tourists. Scared money and loose money. Take both.',
  vegas: 'The full mix. Nobody at this table plays the same way.',
  championship: 'Calculators and pros only. Every mistake gets punished.',
};

export class Screens {
  private readonly root: HTMLElement;

  constructor(root: HTMLElement) {
    this.root = root;
  }

  private render(html: string): void {
    this.root.innerHTML = html;
    this.root.classList.add('show');
  }

  hide(): void {
    this.root.classList.remove('show');
    this.root.innerHTML = '';
  }

  title(onPlay: () => void): void {
    this.render(`
      <div class="screen title">
        <div class="eyebrow">No-Limit Hold'em · six-max · you against five</div>
        <h1>Poker,<br>I Hardly Knew Her</h1>
        <button class="primary">Play</button>
      </div>`);
    this.root.querySelector('button')!.addEventListener('click', onPlay);
  }

  select(onPick: (key: TournamentKey) => void, onBack: () => void): void {
    const cards = (Object.keys(TOURNAMENTS) as TournamentKey[])
      .map((k) => `<button class="tcard" data-key="${k}"><div class="tname">${TOURNAMENTS[k].name}</div><div class="tblurb">${BLURBS[k]}</div></button>`)
      .join('');
    this.render(`
      <div class="screen select">
        <div class="eyebrow">Pick a table</div>
        <div class="tcards">${cards}</div>
        <button class="link back">Back</button>
      </div>`);
    for (const b of this.root.querySelectorAll<HTMLButtonElement>('.tcard')) {
      b.addEventListener('click', () => onPick(b.dataset.key as TournamentKey));
    }
    this.root.querySelector('.back')!.addEventListener('click', onBack);
  }

  results(r: { humanFinish: number; standings: TournamentPlayer[]; handsPlayed: number; tournament: string }, onAgain: () => void, onMenu: () => void): void {
    const rows = r.standings
      .map((p) => `<li class="${p.seat === 0 ? 'you' : ''}"><span>${p.finish ? ordinal(p.finish) : '—'}</span><span>${p.name}</span><span>${p.stack}</span></li>`)
      .join('');
    const headline = r.humanFinish === 1 ? 'You won.' : r.humanFinish === 2 ? 'Second. So close.' : `${ordinal(r.humanFinish)} place.`;
    this.render(`
      <div class="screen results">
        <div class="eyebrow">${r.tournament} · ${r.handsPlayed} hands</div>
        <h2>${headline}</h2>
        <ol>${rows}</ol>
        <div class="row">
          <button class="primary again">Play again</button>
          <button class="link menu">Menu</button>
        </div>
      </div>`);
    this.root.querySelector('.again')!.addEventListener('click', onAgain);
    this.root.querySelector('.menu')!.addEventListener('click', onMenu);
  }
}

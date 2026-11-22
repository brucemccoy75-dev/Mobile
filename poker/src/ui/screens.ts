// Full-screen menus: title with the intro video, pick your opponents, results.
import { type Character } from '../bots/characters';
import { type TournamentPlayer } from '../engine/tournament';
import { money } from './format';
import { ordinal } from './overlay';

/** The intro plays once per visit; later trips to the title show it paused behind the menu. */
let introPlayed = false;

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

  title(name: string, onPlay: (name: string) => void, onCareer: () => void, onSettings: () => void): void {
    const first = !introPlayed;
    this.render(`
      <video class="intro ${first ? 'playing' : ''}" autoplay muted playsinline preload="auto"><source src="./intro.mp4" type="video/mp4"></video>
      ${first ? '<button class="link skip">Skip</button>' : ''}
      <div class="screen title ${first ? 'waiting' : ''}">
        <div class="eyebrow">No-Limit Hold'em · six-max · you against five of Dave's friends</div>
        <h1>Poker Night<br>at Dave's</h1>
        <div class="namerow"><label>They'll call you</label><input class="name" maxlength="14" value="${name.replace(/"/g, '')}" /></div>
        <button class="primary">Who's playing?</button>
        <div class="links"><button class="link go-career">Career</button><button class="link go-settings">Settings</button></div>
      </div>`);
    const video = this.root.querySelector<HTMLVideoElement>('video.intro')!;
    const screen = this.root.querySelector<HTMLElement>('.screen.title')!;
    const reveal = () => {
      introPlayed = true;
      video.classList.remove('playing');
      screen.classList.remove('waiting');
      this.root.querySelector('.skip')?.remove();
      video.removeEventListener('click', reveal);
    };
    video.addEventListener('error', () => {
      video.remove();
      reveal();
    }, { once: true });
    if (first) {
      video.addEventListener('ended', reveal, { once: true });
      video.addEventListener('click', reveal);
      this.root.querySelector('.skip')!.addEventListener('click', reveal);
      // If autoplay is refused, do not leave the player staring at a black frame.
      void video.play().catch(reveal);
      window.setTimeout(() => {
        if (video.paused && !introPlayed) reveal();
      }, 1500);
    } else {
      video.pause();
      video.currentTime = 19.5;
    }
    const input = this.root.querySelector<HTMLInputElement>('.name')!;
    this.root.querySelector('button.primary')!.addEventListener('click', () => onPlay(input.value.trim() || name));
    this.root.querySelector('.go-career')!.addEventListener('click', onCareer);
    this.root.querySelector('.go-settings')!.addEventListener('click', onSettings);
  }

  /** Pick five opponents. Everyone wants in, and says so. */
  select(characters: Character[], portraitBase: string, onDeal: (lineup: Character[]) => void, onBack: () => void): void {
    const picked: string[] = [];
    const cards = characters
      .map((c) => `<button class="pcardc" data-id="${c.id}">
          <div class="bubble"></div>
          <div class="face"><img src="${portraitBase}${c.id}.png" alt="" draggable="false"></div>
          <div class="pname">${c.name}</div>
          <div class="tick">✓</div>
        </button>`)
      .join('');
    this.render(`
      <div class="screen pick">
        <div class="pickhead">
          <button class="link back">Back</button>
          <div class="eyebrow">Who's coming tonight? <span class="count">Pick 5</span></div>
          <button class="link random">Random five</button>
        </div>
        <div class="pgrid">${cards}</div>
        <button class="primary deal" disabled>Deal</button>
      </div>`);
    const root = this.root;
    const countEl = root.querySelector('.count')!;
    const dealBtn = root.querySelector<HTMLButtonElement>('.deal')!;
    const byId = (id: string) => characters.find((c) => c.id === id)!;
    // One man talks at a time; his bubble fades after a few seconds.
    let talking: { id: string; timer: number } | null = null;
    const bubbleOf = (id: string) => root.querySelector<HTMLElement>(`.pcardc[data-id="${id}"] .bubble`)!;
    const say = (id: string, text: string, pop = false) => {
      if (!text) return;
      if (talking) {
        window.clearTimeout(talking.timer);
        bubbleOf(talking.id).classList.remove('show', 'pop');
      }
      const b = bubbleOf(id);
      b.textContent = text;
      b.classList.toggle('pop', pop);
      b.classList.add('show');
      const timer = window.setTimeout(() => {
        b.classList.remove('show', 'pop');
        if (talking && talking.id === id) talking = null;
      }, 3500);
      talking = { id, timer };
    };
    const refresh = () => {
      for (const card of root.querySelectorAll<HTMLElement>('.pcardc')) {
        const on = picked.includes(card.dataset.id!);
        card.classList.toggle('on', on);
        card.classList.toggle('full', !on && picked.length >= 5);
      }
      countEl.textContent = picked.length >= 5 ? 'Table’s full' : `Pick ${5 - picked.length} more`;
      dealBtn.disabled = picked.length !== 5;
    };
    for (const card of root.querySelectorAll<HTMLElement>('.pcardc')) {
      card.addEventListener('click', () => {
        const id = card.dataset.id!;
        const c = byId(id);
        const i = picked.indexOf(id);
        if (i >= 0) {
          picked.splice(i, 1);
          say(id, c.dropped, true);
        } else if (picked.length < 5) {
          picked.push(id);
          say(id, c.picked, true);
        } else {
          say(id, c.pitch[Math.floor(Math.random() * c.pitch.length)]);
        }
        refresh();
      });
    }
    root.querySelector('.random')!.addEventListener('click', () => {
      picked.length = 0;
      const pool = [...characters].sort(() => Math.random() - 0.5).slice(0, 5);
      for (const c of pool) picked.push(c.id);
      say(pool[0].id, pool[0].picked, true);
      refresh();
    });
    dealBtn.addEventListener('click', () => onDeal(picked.map(byId)));
    root.querySelector('.back')!.addEventListener('click', onBack);
    // Chatter: every few seconds one man who is not picked makes his pitch.
    const chatter = window.setInterval(() => {
      if (!root.contains(dealBtn)) {
        window.clearInterval(chatter);
        return;
      }
      if (talking) return;
      const out = characters.filter((c) => !picked.includes(c.id) && c.pitch.some((p) => p));
      if (out.length === 0) return;
      const c = out[Math.floor(Math.random() * out.length)];
      say(c.id, c.pitch[Math.floor(Math.random() * c.pitch.length)]);
    }, 4500);
    window.setTimeout(() => {
      const c = characters.find((x) => x.id === 'sal') ?? characters[0];
      say(c.id, c.pitch[0]);
    }, 500);
    refresh();
  }

  results(r: { humanFinish: number; standings: TournamentPlayer[]; handsPlayed: number; tournament: string; earned: { name: string }[] }, onAgain: () => void, onMenu: () => void): void {
    const rows = r.standings
      .map((p) => `<li class="${p.seat === 0 ? 'you' : ''}"><span>${p.finish ? ordinal(p.finish) : '—'}</span><span>${p.name}</span><span>${money(p.stack)}</span></li>`)
      .join('');
    const headline = r.humanFinish === 1 ? 'You won.' : r.humanFinish === 2 ? 'Second. So close.' : `${ordinal(r.humanFinish)} place.`;
    this.render(`
      <div class="screen results">
        <div class="eyebrow">${r.tournament} · ${r.handsPlayed} hands</div>
        <h2>${headline}</h2>
        ${r.earned.length ? `<div class="earned">${r.earned.map((t) => `<span>🏆 ${t.name}</span>`).join('')}</div>` : ''}
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

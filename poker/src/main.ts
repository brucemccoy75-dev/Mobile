// Wires the screens, the 3D table, the action bar and the game controller together.
import { type BotMemory } from './bots/bot';
import { TOURNAMENTS, type TournamentKey } from './bots/characters';
import { mulberry32, seedFromString } from './engine/rng';
import { HUMAN_SEAT, TableController, type TableEvent } from './game/table';
import { TableScene } from './scene/table-scene';
import { pickLineup } from './sim/run';
import { ActionBar } from './ui/actions';
import { Overlay } from './ui/overlay';
import { Screens } from './ui/screens';

const $ = <T extends HTMLElement>(sel: string): T => {
  const el = document.querySelector<T>(sel);
  if (!el) throw new Error(`missing ${sel}`);
  return el;
};

const overlay = new Overlay($('#overlay'), $('#hole'), $('#info'), $('#toast'));
const scene = new TableScene($('#game'), overlay);
const actions = new ActionBar($('#actions'));
const screens = new Screens($('#screens'));
const fastButton = $<HTMLButtonElement>('#fast');
const menuButton = $<HTMLButtonElement>('#menu');

let fast = false;
scene.setSpeed(() => (fast ? 4 : 1));
fastButton.addEventListener('click', () => {
  fast = !fast;
  fastButton.classList.toggle('on', fast);
});

const MEMORY_KEY = 'pihkh.memories.v1';
function loadMemories(): Record<string, BotMemory> {
  try {
    const raw = localStorage.getItem(MEMORY_KEY);
    return raw ? (JSON.parse(raw) as Record<string, BotMemory>) : {};
  } catch {
    return {};
  }
}
function saveMemories(m: Record<string, BotMemory>): void {
  try {
    localStorage.setItem(MEMORY_KEY, JSON.stringify({ ...loadMemories(), ...m }));
  } catch {
    // Storage may be unavailable; the game still plays.
  }
}

let controller: TableController | null = null;

function showMenu(): void {
  screens.title(() => screens.select(start, showMenu));
}

function start(key: TournamentKey): void {
  screens.hide();
  overlay.clear();
  overlay.tournamentName = TOURNAMENTS[key].name;
  const seed = seedFromString(`${key}:${Date.now()}:${Math.random()}`);
  const rng = mulberry32(seed);
  const lineup = pickLineup(key, rng, 5);
  const table = new TableController({
    lineup,
    humanName: 'You',
    rng,
    memories: loadMemories(),
    speed: () => (fast ? 4 : 1),
    presenter: {
      async present(ev: TableEvent) {
        if (ev.type === 'action' && ev.seat === HUMAN_SEAT) actions.hide();
        if (ev.type === 'turn' && ev.seat !== HUMAN_SEAT) actions.hide();
        await scene.present(ev);
        if (ev.type === 'turn' && ev.seat === HUMAN_SEAT && table.hand) {
          const me = table.hand.player(HUMAN_SEAT);
          actions.show({
            legal: ev.legal,
            pot: table.hand.potTotal(),
            streetBet: me.streetBet,
            bigBlind: table.hand.bigBlind,
            deadline: ev.deadline,
          });
        }
      },
    },
  });
  controller = table;
  actions.onAction = (a) => void table.humanAct(a);
  table.run().then((result) => {
    saveMemories(table.memories());
    actions.hide();
    screens.results(
      { ...result, handsPlayed: table.tournament.handsPlayed, tournament: TOURNAMENTS[key].name },
      () => start(key),
      showMenu,
    );
  });
}

menuButton.addEventListener('click', () => {
  if (!controller) return;
  controller.stop();
  controller = null;
  actions.hide();
  showMenu();
});

showMenu();

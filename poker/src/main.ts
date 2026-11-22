// Wires the screens, the 3D table, the action bar, the panels and the game controller together.
import { TOURNAMENTS, type TournamentKey } from './bots/characters';
import { mulberry32, seedFromString } from './engine/rng';
import { Banter, DEALER_SEAT } from './game/banter';
import { TournamentTracker, clearSave, loadSave, recordTournament, writeSave } from './game/career';
import { type LegalActions } from './engine/hand';
import { HUMAN_SEAT, TableController, type TableEvent } from './game/table';
import { DEALER_POS, figurePos } from './scene/layout';
import { TableScene } from './scene/table-scene';
import { pickLineup } from './sim/run';
import { ActionBar } from './ui/actions';
import { Overlay } from './ui/overlay';
import { Panels } from './ui/panels';
import { Screens } from './ui/screens';

const $ = <T extends HTMLElement>(sel: string): T => {
  const el = document.querySelector<T>(sel);
  if (!el) throw new Error(`missing ${sel}`);
  return el;
};

const overlay = new Overlay($('#overlay'), $('#hole'), $('#info'), $('#toast'), $('#board'), $('#me'), $('#standings'));
const scene = new TableScene($('#game'), overlay);
const actions = new ActionBar($('#actions'));
const screens = new Screens($('#screens'));
const panels = new Panels($('#panels'));
const fastButton = $<HTMLButtonElement>('#fast');
const menuButton = $<HTMLButtonElement>('#menu');

let save = loadSave();
let fast = false;
let controller: TableController | null = null;
let banter: Banter | null = null;

scene.setSpeed(() => (fast ? 4 : 1));
fastButton.addEventListener('click', () => {
  fast = !fast;
  fastButton.classList.toggle('on', fast);
});

function bubblePos(seat: number) {
  const p = seat === DEALER_SEAT ? DEALER_POS.clone() : figurePos(seat);
  p.y = 1.85;
  return p;
}

function applySettings(): void {
  if (banter) banter.density = save.settings.banter;
  scene.audio.setEnabled(save.settings.sound);
  writeSave(save);
}
scene.audio.setEnabled(save.settings.sound);

panels.onSettings = applySettings;
panels.onReset = () => {
  clearSave();
  save = loadSave();
  panels.close();
  if (controller) {
    controller.stop();
    controller = null;
  }
  showMenu();
};

function showMenu(): void {
  panels.close();
  actions.hide();
  screens.title(
    save.name,
    (name) => {
      save.name = name;
      writeSave(save);
      screens.select(start, showMenu);
    },
    () => panels.career(save, () => panels.close()),
    () => panels.settings(save, () => panels.close()),
  );
}

function start(key: TournamentKey): void {
  screens.hide();
  panels.close();
  overlay.clear();
  overlay.tournamentName = TOURNAMENTS[key].name;
  const seed = seedFromString(`${key}:${Date.now()}:${Math.random()}`);
  const rng = mulberry32(seed);
  const lineup = pickLineup(key, rng, 5);
  const tracker = new TournamentTracker();
  banter = new Banter(mulberry32(seed ^ 0x5bd1e995));
  banter.density = save.settings.banter;
  const talk = banter;

  const table = new TableController({
    lineup,
    humanName: save.name,
    rng,
    memories: save.memories,
    speed: () => (fast ? 4 : 1),
    presenter: {
      async present(ev: TableEvent) {
        tracker.onEvent(ev);
        if (ev.type === 'action' && ev.seat === HUMAN_SEAT) actions.hide();
        if (ev.type === 'turn' && ev.seat !== HUMAN_SEAT) actions.hide();
        const who = {
          ids: new Map(table.seats.map((s) => [s.seat, s.id])),
          names: new Map(table.seats.map((s) => [s.seat, s.name])),
          clarity: (seat: number) => table.bots.get(seat)?.stats.clarity ?? 0,
        };
        const said = talk.onEvent(ev, who);
        if (said) {
          overlay.say(said.speaker, bubblePos(said.seat), said.text, Math.min(6000, 2200 + said.text.length * 45));
          void scene.social(said.seat, said.targetSeat, said.trigger);
        }
        await scene.present(ev);
        if (ev.type === 'bust' && table.tournament.active().length === 2) {
          const hu = talk.headsUp(who);
          if (hu) {
            overlay.say(hu.speaker, bubblePos(hu.seat), hu.text, 4500);
            void scene.social(hu.seat, hu.targetSeat, hu.trigger);
          }
        }
        if (ev.type === 'turn' && ev.seat === HUMAN_SEAT && table.hand) showActions(table, ev.legal, ev.deadline);
      },
    },
  });
  table.onDeadline = (deadline) => showActions(table, table.humanLegal, deadline);
  controller = table;
  actions.onAction = (a) => void table.humanAct(a);

  table.run().then((result) => {
    if (controller !== table) return;
    controller = null;
    save.memories = { ...save.memories, ...table.memories() };
    const earned = recordTournament(save, { key, humanFinish: result.humanFinish, handsPlayed: table.tournament.handsPlayed }, tracker);
    writeSave(save);
    actions.hide();
    panels.close();
    screens.results(
      { ...result, handsPlayed: table.tournament.handsPlayed, tournament: TOURNAMENTS[key].name, earned },
      () => start(key),
      showMenu,
    );
  });
}

function showActions(table: TableController, legal: LegalActions | null, deadline: number | null): void {
  const hand = table.hand;
  if (!hand || !legal || table.isPaused) return;
  const me = hand.player(HUMAN_SEAT);
  actions.show({ legal, pot: hand.potTotal(), streetBet: me.streetBet, bigBlind: hand.bigBlind, deadline });
}

function openPause(): void {
  const table = controller;
  if (!table) return;
  table.pause();
  actions.hide();
  const players = table.seats.map((s) => ({ seat: s.seat, name: s.name }));
  panels.onResume = () => {
    panels.close();
    table.resume();
    if (table.humanLegal) showActions(table, table.humanLegal, null);
  };
  panels.onQuit = () => {
    panels.close();
    table.stop();
    controller = null;
    showMenu();
  };
  panels.onReplayRequest = () => {
    const h = table.history;
    if (h.length) panels.replay(h, players, h.length - 1, () => panels.pause(h.length > 0, save));
  };
  panels.pause(table.history.length > 0, save);
}

menuButton.addEventListener('click', () => {
  if (!controller) return;
  if (panels.isOpen) return;
  openPause();
});

(window as unknown as { __scene: unknown }).__scene = scene;
showMenu();

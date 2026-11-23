// Decides who says what, when. Lines are picked by trigger and mood from each character's set,
// never repeated until the set runs dry, and rate-limited so the table stays readable.
import { CONVERSATIONS, INTERJECTIONS, type Conversation, type Interjection, type Stance } from '../content/conversations';
import { TEASES } from '../content/teases';
import { DEALER_OPENERS, OPENERS } from '../content/openers';
import { CHARACTERS } from '../bots/characters';
import { type ThinkMove, thinkAloud } from './thinking';
import { LINES } from '../content/lines';
import { type Line, type Mood, type Trigger } from '../content/triggers';
import { HandCategory, categoryOf, evaluate } from '../engine/evaluator';
import { type Hand } from '../engine/hand';
import { type Rng } from '../engine/rng';
import { HUMAN_SEAT, type TableEvent } from './table';
import { preflopPercentile } from '../bots/equity';

export interface Speech {
  seat: number;
  /** 'dealer' for the dealer, otherwise the character id. */
  speaker: string;
  text: string;
  trigger: Trigger;
  /** The seat the line is about, when it is about someone. */
  targetSeat?: number;
  /** Part of a two-man conversation rather than a reaction to the game. */
  conversation?: boolean;
  /** The last line of that conversation. */
  last?: boolean;
}

export const DEALER_SEAT = -1;

interface Vars {
  target?: string;
  targetSeat?: number;
  hand?: string;
  amount?: number;
}

export interface BanterTable {
  /** Character id per seat. Human is 'human'. */
  ids: Map<number, string>;
  names: Map<number, string>;
  /** Clarity per bot seat, for mood. */
  clarity: (seat: number) => number;
  /** Where each bot stands on AI, for the arguments. */
  stance?: (seat: number) => Stance;
  /** How talkative and how needling each bot is; defaults to 1 and 1. */
  traits?: (seat: number) => { talk: number; trash: number };
  /** IQ per bot seat; the sharp ones think out loud. */
  iq?: (seat: number) => number;
}

const NEEDLES: Trigger[] = ['targetFoldsToMe', 'targetCallsMeDown', 'targetTank', 'targetInstant', 'targetChecks', 'winShowdown', 'stackedTarget', 'playerOut'];

const COOLDOWN_MS = 9000;
/** A man silent this long gets the next quiet moment to himself. */
const QUIET_MS = 200000;
/** Needles that become a personal dig when they land on a man the table knows. */
const TEASABLE: Trigger[] = ['targetFoldsToMe', 'targetCallsMeDown', 'targetChecks', 'winShowdown', 'stackedTarget', 'playerOut', 'badBeatGiven', 'targetTank', 'targetInstant'];
const GLOBAL_GAP_MS = 1800;
const URGENT: Trigger[] = ['badBeatTaken', 'stackedTarget', 'stackedByTarget', 'allIn', 'headsUp', 'termination'];

function escape(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export class Banter {
  private used = new Map<string, Set<Line>>();
  private lastSpoke = new Map<string, number>();
  private lastAny = 0;
  private rng: Rng;
  private now: () => number;
  private hand: Hand | null = null;
  private lastAggressor: number | null = null;
  private humanLastThink = 0;
  /** Chance multiplier; 0 silences the table. */
  density = 1;
  private convo: { conv: Conversation; a: number; b: number; next: number; lastAt: number; gone?: string } | null = null;
  /** Seats the dealer has already dealt with. The dead do not talk. */
  private gone = new Set<number>();
  private usedConvos = new Set<Conversation>();
  private usedJabs = new Set<Interjection>();
  private usedTeases = new Map<string, Set<string>>();
  private recentThoughts = new Map<string, string[]>();
  /** Men still owed a good-luck line as the night opens. */
  private openers: number[] = [];
  /** Names of men not at this table; a line that mentions one is never said. */
  private absent: { key: string; re: RegExp | null; present: Set<string> } | null = null;

  private mentionsAbsent(text: string, table: BanterTable): boolean {
    const key = [...table.ids.values()].sort().join(',');
    if (!this.absent || this.absent.key !== key) {
      const here = new Set(table.ids.values());
      // Longer names first so "David Sr" is matched before "David".
      const byLength = (a: string, b: string) => b.length - a.length;
      const gone = CHARACTERS.filter((c) => !here.has(c.id)).map((c) => c.name).sort(byLength);
      const present = CHARACTERS.filter((c) => here.has(c.id)).map((c) => c.name).sort(byLength);
      const alt = [...present, ...gone].sort(byLength).map(escape).join('|');
      this.absent = { key, re: gone.length > 0 ? new RegExp(`\\b(?:${alt})\\b`, 'g') : null, present: new Set(present) };
    }
    if (!this.absent.re) return false;
    for (const m of text.matchAll(this.absent.re)) if (!this.absent.present.has(m[0])) return true;
    return false;
  }
  /** A bystander's dry line queued for after the current exchange. */
  private jab: { seat: number; target: number; text: string; at: number } | null = null;
  private lastConvoEnd = -1e9;

  constructor(rng: Rng, now: () => number = () => Date.now()) {
    this.rng = rng;
    this.now = now;
  }

  /**
   * A clock tick between events, so the table keeps talking while the player thinks: exchanges
   * carry on, a new one may start, the opening round and Bruce's last word land on time.
   */
  tick(table: BanterTable): Speech | null {
    if (this.openers.length > 0) return this.opener(table);
    return this.chatter({ type: 'tick' } as unknown as TableEvent, table);
  }

  /** Feeds a table event; returns at most one thing someone says. */
  onEvent(ev: TableEvent, table: BanterTable): Speech | null {
    if (this.openers.length > 0 && ev.type !== 'tournamentStart') {
      const said = this.opener(table);
      if (said) return said;
      // Once the action starts, the pleasantries are over.
      if (ev.type === 'action' || this.hand?.board.length) this.openers = [];
      return null;
    }
    const said = this.onGameEvent(ev, table);
    if (said) return said;
    return this.chatter(ev, table);
  }

  private onGameEvent(ev: TableEvent, table: BanterTable): Speech | null {
    switch (ev.type) {
      case 'tournamentStart': {
        // Nobody is owed a line yet, and the first things said are good luck, of a sort.
        const now = this.now();
        for (const id of table.ids.values()) this.lastSpoke.set(id, now);
        this.lastAny = now - GLOBAL_GAP_MS;
        this.openers = this.shuffled(this.seatsOf(table)).slice(0, 2 + (this.chance(0.5) ? 1 : 0));
        if (this.chance(0.35)) this.openers.push(DEALER_SEAT);
        return this.opener(table);
      }
      case 'handStart': {
        this.hand = ev.hand;
        this.lastAggressor = null;
        const bots = this.botsInHand(table);
        const bb = ev.level.bb;
        for (const seat of this.shuffled(bots)) {
          const stack = ev.stacks[seat] ?? 0;
          if (!this.chance((table.traits?.(seat).talk ?? 1))) continue;
          const total = Object.values(ev.stacks).reduce((a, b) => a + b, 0);
          if (stack / bb < 10 && this.chance(0.18)) return this.say(seat, 'shortStack', table);
          if (stack > total * 0.42 && this.chance(0.1)) return this.say(seat, 'chipLeader', table);
        }
        if (bots.length > 0 && this.chance(0.02)) return this.say(this.pickSpeaker(bots, table), 'dealtIn', table);
        // Between hands somebody has a go at somebody.
        if (bots.length > 1 && this.chance(0.07)) return this.say(this.pickSpeaker(bots, table, true), "idle", table);
        if (this.chance(0.03)) return this.say(DEALER_SEAT, 'dealtIn', table);
        return null;
      }
      case 'action':
        return this.onAction(ev, table);
      case 'handEnd':
        return this.onHandEnd(ev, table);
      case 'bust': {
        // Skynet always has a word as the laser fires; the table frets about it after, then eats.
        for (const s of ev.seats) this.gone.add(s);
        const gone = ev.seats[0];
        const name = table.names.get(gone) ?? 'friend';
        this.queueAftermath(table, name);
        const line = this.pickLine('dealer', 'termination', 'calm');
        if (!line) return null;
        const now = this.now();
        this.lastAny = now;
        this.lastSpoke.set('dealer', now);
        return { seat: DEALER_SEAT, speaker: 'dealer', text: line.s.replace(/\{target\}/g, name), trigger: 'termination', targetSeat: gone };
      }
      case 'turn': {
        if (ev.seat === HUMAN_SEAT) return null;
        // Facing a shove: a reaction from the one deciding.
        if (this.hand && ev.legal.callAmount >= this.hand.player(ev.seat).stack * 0.6 && ev.legal.callAmount > 0 && this.chance(0.3)) {
          return this.say(ev.seat, 'facingAllIn', table, { target: this.aggressorName(table) });
        }
        // Table chatter from someone who has folded.
        const idle = this.botsInHand(table).filter((s) => s !== ev.seat && this.hand!.player(s).folded);
        if (idle.length > 0 && this.chance(0.02)) return this.say(this.pickSpeaker(idle, table), 'idle', table);
        if (this.chance(0.005)) return this.say(DEALER_SEAT, 'idle', table);
        return null;
      }
      case 'level':
        return null;
      default:
        return null;
    }
  }

  // ---- conversations ---------------------------------------------------------------------------------

  /** Keeps a two-man conversation going in the gaps, or starts a new one now and then. */
  private chatter(ev: TableEvent, table: BanterTable): Speech | null {
    if (ev.type === 'tournamentEnd') return null;
    const now = this.now();
    const actor = this.hand && !this.hand.isComplete ? this.hand.actor : null;
    const bigPot = this.hand ? this.hand.potTotal() > 0.3 * this.avgStack() : false;
    if (this.jab) {
      const j = this.jab;
      if (!table.ids.has(j.seat) || !table.ids.has(j.target)) {
        this.jab = null;
        return null;
      }
      if (now - j.at < 5200 || j.seat === actor || bigPot) return null;
      this.jab = null;
      this.lastAny = now;
      this.lastConvoEnd = now;
      this.lastSpoke.set(table.ids.get(j.seat)!, now);
      return { seat: j.seat, speaker: table.ids.get(j.seat)!, text: j.text, trigger: 'idle', targetSeat: j.target, conversation: true, last: true };
    }
    if (this.convo) {
      const c = this.convo;
      const [role] = c.conv.lines[c.next];
      const seat = role === 'A' ? c.a : c.b;
      // A big pot ends the chat; otherwise wait for a gap, and never talk over your own decision.
      if (bigPot) {
        this.convo = null;
        this.lastConvoEnd = now;
        return null;
      }
      if (now - c.lastAt < 5200 || seat === actor) return null;
      if (!table.ids.has(c.a) || !table.ids.has(c.b) || this.gone.has(c.a) || this.gone.has(c.b)) {
        this.convo = null;
        return null;
      }
      return this.speakConvo(table);
    }
    const quiet = now - this.lastAny > 3500 && now - this.lastConvoEnd > 40000;
    const moment = ev.type === 'turn' || ev.type === 'handEnd' || ev.type === 'handStart' || (ev.type as string) === 'tick';
    if (quiet && moment && !bigPot) {
      // Somebody who has not said a word in a couple of minutes gets the floor.
      const silent = this.seatsOf(table).filter((s) => s !== actor && now - (this.lastSpoke.get(table.ids.get(s)!) ?? -1e9) > QUIET_MS);
      if (silent.length > 0 && this.chance(0.3)) {
        const seat = this.pick(silent);
        const said = this.sayForced(seat, 'idle', table);
        if (said) return said;
      }
    }
    if (!quiet || !moment || bigPot || !this.chance(ev.type === "handEnd" || ev.type === "handStart" ? 0.1 : 0.03)) return null;
    return this.startConversation(table, actor);
  }

  /** Lines up a short exchange about the man who just got vaporised, for the next quiet moment. */
  private queueAftermath(table: BanterTable, gone: string): void {
    const bots = this.seatsOf(table);
    if (bots.length < 2) return;
    const pool = CONVERSATIONS.filter((c) => c.tag === 'kill');
    const fresh = pool.filter((c) => !this.usedConvos.has(c));
    const conv = this.pick(fresh.length > 0 ? fresh : pool);
    this.usedConvos.add(conv);
    const [a, b] = this.shuffled(bots);
    this.jab = null;
    this.convo = { conv, a, b, next: 0, lastAt: this.now(), gone };
  }

  private startConversation(table: BanterTable, actor: number | null): Speech | null {
    const bots = this.allBotSeats(table).filter((s) => s !== actor && !(this.hand && !this.hand.isComplete && this.hand.players.some((p) => p.seat === s && !p.folded && s === actor)));
    if (bots.length < 2) return null;
    const stance = (s: number): Stance => table.stance?.(s) ?? 'meh';
    const regular = CONVERSATIONS.filter((c) => c.tag !== 'kill' && !c.lines.some(([, l]) => this.mentionsAbsent(l, table)));
    const fresh = regular.filter((c) => !this.usedConvos.has(c));
    const pool = fresh.length > 0 ? fresh : regular;
    if (fresh.length === 0) this.usedConvos.clear();
    for (const conv of this.shuffled(pool)) {
      // A man with no lines (Menafee) only takes part when an exchange names him on purpose.
      const mute = (s: number) => (LINES[table.ids.get(s) ?? ''] ?? []).length === 0;
      // Jack is sixteen: he only talks about his wife when an exchange is written for him.
      const kid = (s: number) => conv.tag === 'spouse' && table.ids.get(s) === 'sal';
      const fits = (s: number, need?: Stance, who?: string[]) =>
        (!need || stance(s) === need) && (who ? who.includes(table.ids.get(s) ?? '') : !mute(s) && !kid(s));
      const pairs: [number, number][] = [];
      for (const a of bots) for (const b of bots) if (a !== b && fits(a, conv.needs?.A, conv.who?.A) && fits(b, conv.needs?.B, conv.who?.B)) pairs.push([a, b]);
      if (pairs.length === 0) continue;
      // Talkative men end up in more conversations; the quiet ones mostly listen.
      const weight = (p: [number, number]) => (table.traits?.(p[0]).talk ?? 1) * (table.traits?.(p[1]).talk ?? 1) * this.silence(table, p[0]) * this.silence(table, p[1]);
      const total = pairs.reduce((s, p) => s + weight(p), 0);
      let x = this.rng() * total;
      let chosen = pairs[0];
      for (const p of pairs) {
        x -= weight(p);
        if (x <= 0) { chosen = p; break; }
      }
      const [a, b] = chosen;
      this.convo = { conv, a, b, next: 0, lastAt: -1e9 };
      this.usedConvos.add(conv);
      return this.speakConvo(table);
    }
    return null;
  }

  private speakConvo(table: BanterTable): Speech | null {
    const c = this.convo!;
    const [role, raw] = c.conv.lines[c.next];
    const seat = role === 'A' ? c.a : c.b;
    const other = role === 'A' ? c.b : c.a;
    const id = table.ids.get(seat);
    if (!id) return null;
    const now = this.now();
    c.lastAt = now;
    this.lastAny = now;
    this.lastSpoke.set(id, now);
    c.next++;
    let last = c.next >= c.conv.lines.length;
    if (last) {
      this.convo = null;
      this.lastConvoEnd = now;
      // Someone who sat the exchange out may get the last word.
      this.jab = this.interject(table, c.conv, c.a, c.b);
      if (this.jab) last = false;
    }
    const text = raw
      .replace(/\{A\}/g, table.names.get(c.a) ?? 'pal')
      .replace(/\{B\}/g, table.names.get(c.b) ?? 'pal')
      .replace(/\{you\}/g, table.names.get(HUMAN_SEAT) ?? 'the kid')
      .replace(/\{gone\}/g, c.gone ?? 'him');
    return { seat, speaker: id, text, trigger: 'idle', targetSeat: last ? other : undefined, conversation: true, last };
  }

  /** Picks a bystander's line to follow an exchange between seats a and b, or null. */
  private interject(table: BanterTable, conv: Conversation, a: number, b: number): { seat: number; target: number; text: string; at: number } | null {
    const bystanders = this.allBotSeats(table).filter((s) => s !== a && s !== b && INTERJECTIONS.some((j) => j.who === table.ids.get(s)));
    if (bystanders.length === 0) return null;
    const seat = this.pick(bystanders);
    const id = table.ids.get(seat)!;
    const chance = 0.45 * (table.traits?.(seat).trash ?? 1);
    if (!this.chance(chance)) return null;
    const idA = table.ids.get(a) ?? '';
    const idB = table.ids.get(b) ?? '';
    const fits = INTERJECTIONS.filter((j) => j.who === id && (j.at ? j.at.includes(idA) || j.at.includes(idB) : !j.tag || j.tag === conv.tag) && !this.mentionsAbsent(j.s, table));
    if (fits.length === 0) return null;
    let fresh = fits.filter((j) => !this.usedJabs.has(j));
    if (fresh.length === 0) {
      for (const j of fits) this.usedJabs.delete(j);
      fresh = fits;
    }
    // Aimed lines beat theme lines beat the all-purpose ones.
    const aimed = fresh.filter((j) => j.at);
    const themed = fresh.filter((j) => !j.at && j.tag);
    const pool = aimed.length > 0 && this.chance(0.8) ? aimed : themed.length > 0 && this.chance(0.7) ? themed : fresh;
    const jab = this.pick(pool);
    this.usedJabs.add(jab);
    // An aimed line lands on the man it names and {them} is the other one; a theme line lands on
    // whoever started the story.
    const target = jab.at ? (jab.at.includes(idB) && !jab.at.includes(idA) ? b : a) : a;
    const them = jab.at ? (target === a ? b : a) : a;
    const text = jab.s.replace(/\{them\}/g, table.names.get(them) ?? 'pal');
    return { seat, target, text, at: this.now() };
  }

  /** Call when the hand reaches heads-up (two players left in the tournament). */
  headsUp(table: BanterTable): Speech | null {
    const bots = this.seatsOf(table);
    if (bots.length > 0 && this.chance(0.7)) return this.say(bots[0], 'headsUp', table, { target: table.names.get(HUMAN_SEAT) });
    return this.say(DEALER_SEAT, 'headsUp', table);
  }

  private onAction(ev: Extract<TableEvent, { type: 'action' }>, table: BanterTable): Speech | null {
    const hand = this.hand;
    if (!hand) return null;
    const type = ev.action.type;
    const pot = hand.potTotal();
    const bigPot = pot > 0.3 * this.avgStack();
    const damp = bigPot ? 0.5 : 1;
    const aggressorBefore = this.aggressorThisStreet(hand);
    if (type === 'bet' || type === 'raise') this.lastAggressor = ev.seat;

    if (type === 'check' && this.chance(0.09 * damp)) {
      const others = this.botsInHand(table).filter((s) => s !== ev.seat && !hand.player(s).folded);
      if (others.length > 0) {
        const said = this.say(this.pickSpeaker(others, table, true), 'targetChecks', table, { targetSeat: ev.seat });
        if (said) return said;
      }
    }
    if (ev.seat === HUMAN_SEAT) {
      this.humanLastThink = ev.thinkMs;
      const bots = this.botsInHand(table).filter((s) => !hand.player(s).folded);
      if (bots.length === 0) return null;
      if (ev.thinkMs > 12000 && this.chance(0.35)) return this.say(this.pickSpeaker(bots, table, true), 'targetTank', table, { target: table.names.get(HUMAN_SEAT) });
      if (ev.thinkMs < 700 && type !== 'fold' && this.chance(0.06)) return this.say(this.pickSpeaker(bots, table, true), 'targetInstant', table, { target: table.names.get(HUMAN_SEAT) });
      // Folding to a real bet draws a line; folding to a min-raise does not.
      if (type === 'fold' && aggressorBefore !== null && aggressorBefore !== HUMAN_SEAT && pot >= 6 * hand.bigBlind && this.chance(0.18 * damp)) {
        return this.say(aggressorBefore, 'targetFoldsToMe', table, { target: table.names.get(HUMAN_SEAT) });
      }
      return null;
    }

    const me = hand.player(ev.seat);
    // The sharp players say what they are thinking as they act; the line agrees with the move.
    const thought = this.thinking(ev.seat, ev, aggressorBefore, table);
    if (thought) return thought;
    if (ev.allIn && type !== 'fold' && type !== 'check' && this.chance(0.6)) return this.say(ev.seat, 'allIn', table, { target: this.aggressorName(table, aggressorBefore) });
    switch (type) {
      case 'fold':
        if (ev.street === 'preflop' && this.chance(0.03 * damp)) return this.say(ev.seat, 'foldPreflop', table);
        return null;
      case 'bet':
      case 'raise': {
        const over = aggressorBefore !== null && aggressorBefore !== ev.seat;
        // An open is routine; a raise over a bet, or a big bet, is a play.
        const bigBet = ev.amount >= Math.max(8 * hand.bigBlind, 0.6 * pot);
        if (this.chance((over ? 0.3 : bigBet ? 0.2 : 0.05) * damp)) return this.say(ev.seat, over ? 'reraise' : 'raise', table, { target: over ? table.names.get(aggressorBefore!) : undefined });
        return null;
      }
      case 'call': {
        const big = ev.amount >= 0.35 * (pot - ev.amount) || ev.amount >= 0.25 * (me.stack + ev.amount);
        if (big && ev.amount >= 5 * hand.bigBlind && this.chance(0.35)) return this.say(ev.seat, 'callBig', table, { target: this.aggressorName(table, aggressorBefore) });
        return null;
      }
      default:
        return null;
    }
  }

  private onHandEnd(ev: Extract<TableEvent, { type: 'handEnd' }>, table: BanterTable): Speech | null {
    const hand = ev.hand;
    const showdown = hand.events.some((e) => e.type === 'showdown');
    const winners = ev.winners;
    const live = hand.live().map((p) => p.seat);
    const losers = live.filter((s) => !winners.includes(s));
    const biggestLoser = losers.sort((a, b) => (hand.player(a).committed - hand.player(b).committed))[losers.length - 1];
    const riverAggressor = this.lastAggressorOnRiver(hand);
    const candidates: { seat: number; t: Trigger; p: number; vars: Vars }[] = [];
    const name = (s: number | undefined) => (s === undefined ? undefined : table.names.get(s));
    const busted = (s: number) => hand.player(s).stack === 0;
    // Only pots that matter get a word: the odds scale with the pot against the average stack.
    const pot = hand.potTotal();
    const size = pot / Math.max(1, this.avgStack());
    const weight = size >= 0.2 ? 1 : size >= 0.08 ? 0.6 : 0.25;

    for (const [seatKey, outcome] of Object.entries(ev.outcomes)) {
      const seat = Number(seatKey);
      if (!outcome || seat === HUMAN_SEAT) continue;
      const won = winners.includes(seat);
      const p = hand.player(seat);
      if (p.folded) continue;
      if (won) {
        const target = biggestLoser;
        if (target !== undefined && busted(target)) candidates.push({ seat, t: 'stackedTarget', p: 0.9, vars: { target: name(target) } });
        if (!showdown) {
          const weak = this.isWeak(hand, seat);
          if (weak && this.lastAggressor === seat) candidates.push({ seat, t: 'bluffWorked', p: 0.3, vars: {} });
          else candidates.push({ seat, t: 'winNoShowdown', p: 0.22, vars: { target: name(target) } });
        } else {
          if (outcome.suckOut) candidates.push({ seat, t: 'badBeatGiven', p: 0.45, vars: { target: name(target) } });
          if (target !== undefined && riverAggressor === seat && target === HUMAN_SEAT) candidates.push({ seat, t: 'targetCallsMeDown', p: 0.45, vars: { target: name(target) } });
          candidates.push({ seat, t: 'winShowdown', p: 0.55, vars: { target: name(target), hand: this.shown(hand, seat) } });
        }
      } else if (showdown) {
        const target = winners[0];
        if (busted(seat)) candidates.push({ seat, t: 'stackedByTarget', p: 0.85, vars: { target: name(target) } });
        if (outcome.badBeat) candidates.push({ seat, t: 'badBeatTaken', p: 0.8, vars: { target: name(target) } });
        if (riverAggressor === seat && this.isWeak(hand, seat)) candidates.push({ seat, t: 'bluffCaught', p: 0.55, vars: { target: name(target) } });
        candidates.push({ seat, t: 'loseShowdown', p: 0.5, vars: { target: name(target) } });
      }
    }
    // The dealer announces showdown winners now and then.
    if (showdown && winners.length === 1 && this.chance(0.12)) {
      candidates.push({ seat: DEALER_SEAT, t: 'winShowdown', p: 1, vars: { hand: this.shown(hand, winners[0]) } });
    }
    for (const c of this.shuffled(candidates.sort((a, b) => b.p - a.p))) {
      // Knockouts and bad beats are always worth a word; the rest depend on the pot.
      const always = c.t === 'stackedTarget' || c.t === 'stackedByTarget' || c.t === 'badBeatTaken';
      if (this.chance(c.p * (always ? 1 : weight))) {
        const s = this.say(c.seat, c.t, table, c.vars);
        if (s) return s;
      }
    }
    return null;
  }

  // ---- helpers -----------------------------------------------------------------------------------

  private say(seat: number, trigger: Trigger, table: BanterTable, vars: Vars = {}): Speech | null {
    const id = seat === DEALER_SEAT ? 'dealer' : table.ids.get(seat);
    if (!id || id === 'human') return null;
    if (vars.targetSeat !== undefined && vars.target === undefined) vars.target = table.names.get(vars.targetSeat);
    if (vars.targetSeat === undefined && vars.target !== undefined) {
      for (const [s, n] of table.names) if (n === vars.target) vars.targetSeat = s;
    }
    const now = this.now();
    const urgent = URGENT.includes(trigger);
    // A conversation in progress has the floor; only the dealer's laser interrupts it.
    if ((this.convo || this.jab) && trigger !== 'termination') return null;
    if (!urgent && now - this.lastAny < GLOBAL_GAP_MS) return null;
    if (seat !== DEALER_SEAT && table.traits) {
      const t = table.traits(seat);
      const gate = Math.min(1, t.talk * (NEEDLES.includes(trigger) ? t.trash : 1) * this.silence(table, seat));
      if (!urgent && this.rng() > gate) return null;
    }
    if (now - (this.lastSpoke.get(id) ?? -1e9) < (urgent ? COOLDOWN_MS / 3 : COOLDOWN_MS)) return null;
    const mood: Mood = seat !== DEALER_SEAT && table.clarity(seat) >= 55 ? 'tilted' : 'calm';
    // Idle chatter is sometimes a dig at whoever is handy.
    if (trigger === 'idle' && seat !== DEALER_SEAT && vars.targetSeat === undefined && this.chance(0.6)) {
      const marks = this.allBotSeats(table).filter((s) => s !== seat && TEASES[table.ids.get(s) ?? '']);
      if (marks.length > 0) vars.targetSeat = this.pick(marks);
    }
    const tease = seat !== DEALER_SEAT && vars.targetSeat !== undefined && vars.targetSeat !== seat && (TEASABLE.includes(trigger) || trigger === 'idle')
      ? this.pickTease(table.ids.get(vars.targetSeat) ?? '', trigger === 'idle' ? 1 : 0.75, table)
      : null;
    const line: Line | null = tease ? { t: 'tease', s: tease } : this.pickLine(id, trigger, mood, table);
    if (!line) return null;
    this.lastAny = now;
    this.lastSpoke.set(id, now);
    const text = line.s
      .replace(/\{target\}/g, vars.target ?? 'friend')
      .replace(/\{hand\}/g, vars.hand ?? 'the hand')
      .replace(/\{amount\}/g, String(vars.amount ?? ''));
    return { seat, speaker: id, text, trigger: line.t === 'tease' ? 'tease' : trigger, targetSeat: vars.targetSeat };
  }

  /** A fresh dig at the man with that id, or null. Each dig is used once before any repeats. */
  private pickTease(targetId: string, chance: number, table: BanterTable): string | null {
    const pool = (TEASES[targetId] ?? []).filter((t) => !this.mentionsAbsent(t, table));
    if (!pool || pool.length === 0 || !this.chance(chance)) return null;
    let used = this.usedTeases.get(targetId);
    if (!used) {
      used = new Set();
      this.usedTeases.set(targetId, used);
    }
    let fresh = pool.filter((t) => !used.has(t));
    if (fresh.length === 0) {
      used.clear();
      fresh = pool;
    }
    const t = this.pick(fresh);
    used.add(t);
    return t;
  }

  /** A sharp player thinks out loud while deciding: a claim that is true about half the time. */
  private thinking(seat: number, ev: Extract<TableEvent, { type: 'action' }>, aggressorBefore: number | null, table: BanterTable): Speech | null {
    const hand = this.hand;
    const id = table.ids.get(seat);
    if (!hand || !id || !table.iq || table.iq(seat) < 72) return null;
    const type = ev.action.type;
    const move: ThinkMove = ev.allIn && type !== 'fold' && type !== 'check' ? 'allin' : type === 'bet' ? 'raise' : type === 'raise' ? 'raise' : type === 'call' ? 'call' : type === 'fold' ? 'fold' : 'check';
    const facing = aggressorBefore !== null && aggressorBefore !== seat;
    const pre = hand.board.length < 3;
    // Only the moments that matter: facing a bet after the flop, or a big move of his own.
    const odds = pre ? (facing && move !== 'fold' ? 0.05 : 0) : facing ? (move === 'fold' ? 0.15 : 0.3) : move === 'raise' || move === 'allin' ? 0.18 : 0;
    if (!this.chance(odds)) return null;
    if (this.convo || this.jab) return null;
    const now = this.now();
    if (now - this.lastAny < GLOBAL_GAP_MS || now - (this.lastSpoke.get(id) ?? -1e9) < COOLDOWN_MS) return null;
    // The line is aimed at the bettor, or at you if you are still in.
    let targetSeat: number | null = facing ? aggressorBefore : null;
    if (targetSeat === seat) targetSeat = null;
    if (targetSeat === null && hand.players.some((p) => p.seat === HUMAN_SEAT && !p.folded)) targetSeat = HUMAN_SEAT;
    const target = targetSeat !== null && hand.players.some((p) => p.seat === targetSeat)
      ? { name: table.names.get(targetSeat) ?? 'friend', hole: hand.player(targetSeat).hole }
      : undefined;
    let text: string | null = null;
    const recent = this.recentThoughts.get(id) ?? [];
    for (let i = 0; i < 4 && (text === null || recent.includes(text)); i++) {
      text = thinkAloud({ hand, seat, move, target, rng: this.rng });
    }
    if (!text || recent.includes(text)) return null;
    this.recentThoughts.set(id, [...recent.slice(-5), text]);
    this.lastAny = now;
    this.lastSpoke.set(id, now);
    return { seat, speaker: id, text, trigger: 'thinking', targetSeat: targetSeat ?? undefined };
  }

  /** The next good-luck line of the opening round, spaced out. */
  private opener(table: BanterTable): Speech | null {
    const now = this.now();
    if (now - this.lastAny < 4000) return null;
    const seat = this.openers.shift();
    if (seat === undefined) return null;
    const id = seat === DEALER_SEAT ? 'dealer' : table.ids.get(seat);
    if (!id) return null;
    const own = this.pickLine(id, 'gameStart', 'calm', table);
    const pool = seat === DEALER_SEAT ? DEALER_OPENERS : OPENERS.filter((l) => !this.mentionsAbsent(l, table));
    const text = (own ? own.s : this.pick(pool)).replace(/\{you\}/g, table.names.get(HUMAN_SEAT) ?? 'you').replace(/\{target\}/g, table.names.get(HUMAN_SEAT) ?? 'you');
    this.lastAny = now;
    this.lastSpoke.set(id, now);
    return { seat, speaker: id, text, trigger: 'gameStart', targetSeat: HUMAN_SEAT };
  }

  /** A line with no gates but the cooldown: for men the table has been ignoring. */
  private sayForced(seat: number, trigger: Trigger, table: BanterTable): Speech | null {
    const id = table.ids.get(seat);
    if (!id || id === 'human') return null;
    const mood: Mood = table.clarity(seat) >= 55 ? 'tilted' : 'calm';
    const line = this.pickLine(id, trigger, mood, table);
    if (!line) return null;
    const now = this.now();
    this.lastAny = now;
    this.lastSpoke.set(id, now);
    const text = line.s.replace(/\{target\}/g, table.names.get(HUMAN_SEAT) ?? 'friend').replace(/\{hand\}/g, 'the hand');
    return { seat, speaker: id, text, trigger };
  }

  private pickLine(id: string, trigger: Trigger, mood: Mood, table?: BanterTable): Line | null {
    const all = (LINES[id] ?? []).filter((l) => l.t === trigger && (!l.m || l.m === 'any' || l.m === mood) && !(table && this.mentionsAbsent(l.s, table)));
    // Tilted players prefer tilted lines when there are any.
    const tilted = mood === 'tilted' ? all.filter((l) => l.m === 'tilted') : [];
    const pool = tilted.length > 0 && this.chance(0.7) ? tilted : all;
    if (pool.length === 0) return null;
    let used = this.used.get(id);
    if (!used) {
      used = new Set();
      this.used.set(id, used);
    }
    let fresh = pool.filter((l) => !used.has(l));
    if (fresh.length === 0) {
      for (const l of pool) used.delete(l);
      fresh = pool;
    }
    const line = this.pick(fresh);
    used.add(line);
    return line;
  }

  private chance(p: number): boolean {
    return this.rng() < p * this.density;
  }

  private pick<T>(items: T[]): T {
    return items[Math.floor(this.rng() * items.length)];
  }

  /** A speaker weighted by how much he talks (and, for needling, how much he enjoys it). */
  /** 1 for a man who just spoke, rising with every quiet minute, so nobody stays silent all night. */
  private silence(table: BanterTable, seat: number): number {
    const id = table.ids.get(seat) ?? '';
    const quiet = this.now() - (this.lastSpoke.get(id) ?? this.now() - QUIET_MS);
    return 1 + Math.max(0, quiet) / 45000;
  }

  private pickSpeaker(seats: number[], table: BanterTable, needling = false): number {
    const w = (s: number) => {
      const t = table.traits?.(s) ?? { talk: 1, trash: 1 };
      return t.talk * (needling ? t.trash : 1) * this.silence(table, s);
    };
    const total = seats.reduce((a, s) => a + w(s), 0);
    let x = this.rng() * total;
    for (const s of seats) {
      x -= w(s);
      if (x <= 0) return s;
    }
    return seats[seats.length - 1];
  }

  private shuffled<T>(items: T[]): T[] {
    const out = [...items];
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(this.rng() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  }

  /** Bot seats that can speak at all: not the human, and not a man with no lines. */
  private seatsOf(table: BanterTable): number[] {
    return [...table.ids.entries()]
      .filter(([s, id]) => id !== 'human' && s !== DEALER_SEAT && !this.gone.has(s) && (LINES[id] ?? []).length > 0)
      .map(([s]) => s);
  }

  /** Every bot seat, including the silent ones, for exchanges that name them. */
  private allBotSeats(table: BanterTable): number[] {
    return [...table.ids.entries()].filter(([s, id]) => id !== 'human' && s !== DEALER_SEAT && !this.gone.has(s)).map(([s]) => s);
  }

  private botsInHand(table: BanterTable): number[] {
    const hand = this.hand;
    return this.seatsOf(table).filter((s) => hand?.players.some((p) => p.seat === s));
  }

  private avgStack(): number {
    const hand = this.hand;
    if (!hand) return 10000;
    return hand.players.reduce((a, p) => a + p.stack + p.committed, 0) / hand.players.length;
  }

  private aggressorName(table: BanterTable, seat: number | null = this.lastAggressor): string | undefined {
    return seat === null ? undefined : table.names.get(seat);
  }

  private isWeak(hand: Hand, seat: number): boolean {
    const p = hand.player(seat);
    if (hand.board.length < 3) return preflopPercentile(p.hole) > 0.45;
    return categoryOf(evaluate([...p.hole, ...hand.board])) <= HandCategory.Pair;
  }

  private shown(hand: Hand, seat: number): string | undefined {
    const e = hand.events.find((x) => x.type === 'showdown' && x.seat === seat);
    return e && e.type === 'showdown' ? e.description : undefined;
  }

  /** Who bet or raised last on the current street before the most recent action, or null. */
  private aggressorThisStreet(hand: Hand): number | null {
    let seat: number | null = null;
    const events = hand.events.slice(0, -1);
    for (const e of events) {
      if (e.type === 'street') seat = null;
      if (e.type === 'action' && (e.action.type === 'bet' || e.action.type === 'raise')) seat = e.seat;
    }
    return seat;
  }

  private lastAggressorOnRiver(hand: Hand): number | null {
    let onRiver = false;
    let seat: number | null = null;
    for (const e of hand.events) {
      if (e.type === 'street') onRiver = e.street === 'river';
      if (onRiver && e.type === 'action' && (e.action.type === 'bet' || e.action.type === 'raise')) seat = e.seat;
    }
    return seat;
  }
}

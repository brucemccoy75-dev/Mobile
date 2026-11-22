# Poker — Design Document (v1, for sign-off)

Single-player, phone-first, 3D No-Limit Texas Hold'em. You against five bots at a
six-seat table with a dealer. Tournament play only. Looks like watching poker on TV.

Status: **awaiting sign-off**. Nothing beyond the pipeline scaffold is built.

---

## 1. Locked decisions

| Area | Decision |
|---|---|
| Variant | No-Limit Texas Hold'em only |
| Format | 6-max sit-and-go: you + 5 bots. Ends when you bust or win |
| Stacks / blinds | 10,000 chips. Blinds 50/100. Levels rise every 8 hands. Antes from level 4. No rebuys |
| Tournaments | Tutorial (Type 1 + 2 bots), Vegas (all types), Championship (Type 3 + 4). All open from the start |
| Tutorial | Softest opponents only. No teaching aids |
| Dealer | Visible dealer character who deals, announces action, and has a small line set |
| Bots | Fixed named roster. 5 seated per tournament from those eligible |
| Persistence | Device only (browser storage). No accounts |
| Stats shown | Hidden. Tilt shows through behavior and comments, never as a number |
| Reads help | Tap a player: last shown-down hands and a few recent actions. No notes, no auto labels |
| Orientation | Landscape. Rotate prompt in portrait |
| Faces | 2D portraits with expression states, mounted in the 3D scene. Procedural placeholders first; real art later |
| Hole cards | Only yours during the hand. After the hand, optional replay with everyone's cards (hole cam) |
| Camera | TV view by default. Swipe to orbit, snapping to seats. Tap a face for bio and recent moves. Auto-cuts to the actor in big moments unless you are looking around |
| Comments | Text speech bubbles. Raw tone: swearing allowed, no slurs |
| Timing | 20-second shot clock on you. Your speed is a tell bots can read |
| Pace | Realistic bot think times (1–6 s) with a fast-forward toggle |
| Audio | Cards, chips, ambient casino. All mutable. No music |
| Career | Results per tournament. Trophies and achievements |
| Later | Cash games, real portrait art, device text-to-speech |

---

## 2. Bot types

| Type | Name | Core style |
|---|---|---|
| 1 | Nit | Scared money. Plays few hands, folds to pressure, rarely bluffs, overvalues losing chips. Beatable by aggression |
| 2 | Tourist | Wild and aggressive. Plays too many hands, chases draws, overbets, bluffs randomly. Beatable by patience and value |
| 3 | Calculator | Plays the best odds. Range-based, pot odds and equity driven, position aware, rarely bluffs without equity. Beatable by exploiting predictability |
| 4 | Pro | Odds plus bluffing, timing, and flow. Reads your history and speed, applies pressure at the right moment, wins at all costs. Beatable only by playing well and varying your own game |

Type decides the **decision style**. Stats (below) decide how **well** that style is executed.

---

## 3. Player stats

Every bot has three stats, 0–100. They are hidden from you.

**IQ** — how well the bot evaluates odds and position.
- Controls the accuracy of its equity estimate: estimate = true equity + noise, noise shrinks as IQ rises.
- Controls how much position adjusts its ranges.
- Low IQ: misjudges draws, overvalues top pair, ignores position.

**Read** — how well the bot reacts to other players' past moves.
- Controls how much of your history it actually uses: aggression frequency, showdown strength, fold-to-raise rate, and timing.
- High Read: adjusts its bluff and call frequencies against you specifically, and against each other bot.
- Low Read: treats everyone as the same average opponent.

**Clarity** — the tilt meter. Starts at the bot's baseline each tournament.
- Goes **up** when the bot gets sucked out on, loses a big pot, or loses a hand it was a big favorite in. The worse the beat and the bigger the pot, the larger the jump.
- Goes **down** within the game as the bot wins pots, especially big ones, and slowly over uneventful hands.
- Effect: as clarity rises the bot gets more aggressive and looser (raises more, calls down lighter, bluffs more, think time shortens) and its effective IQ and Read drop. Each type expresses tilt its own way: a tilted nit starts calling, a tilted tourist goes all-in, a tilted calculator ignores odds, a tilted pro over-bluffs.
- Expression: face state, comment choice, and action timing. Never a number.

Per-type baselines (proposed): Nit IQ 35–55, Read 20–40. Tourist IQ 20–40, Read 15–35. Calculator IQ 75–95, Read 40–60. Pro IQ 80–95, Read 80–95. Clarity baseline 10–30 for all, individual per character.

**Persistence between tournaments**: each bot keeps its IQ and Read, its memory of your play (rolling history of your actions and showdowns), and a head-to-head record against you. Clarity resets to baseline.

---

## 4. Bot decision model

One engine, parameterized by type and stats.

1. **Hand evaluation**: fast 7-card evaluator. Preflop uses a 169-hand strength table. Postflop uses Monte Carlo equity against estimated opponent ranges, with IQ noise applied.
2. **Opponent model**: per opponent, a running profile (VPIP, aggression, fold-to-bet, showdown strength, timing). Read decides how much of this profile replaces the default assumption.
3. **Action selection**: each type has a policy that maps (equity estimate, pot odds, position, stack depth, opponent profile, clarity) to a weighted set of fold / call / raise-size options. Randomness within the weights keeps bots unpredictable.
4. **Timing**: think time drawn from a per-type distribution, shortened by tilt, lengthened on hard decisions. Pros also use deliberate timing as a tell.
5. **Your timing**: fast action and slow action are recorded as features in your profile. Bots with high Read use them.

---

## 5. Roster

12 named characters, 3 per type, each with a name, short bio, portrait, voice (comment style), and stat baselines. Eligibility per tournament: Tutorial seats Types 1–2, Vegas any, Championship Types 3–4. 5 are drawn each time, so tables vary. One dealer character.

Character names, bios, and portraits are produced in the content phase and reviewed by you. Placeholder figures (procedural, stylized, clearly distinct silhouettes and colors) ship first.

---

## 6. Comments

Goal: 100+ lines per type, written in each character's voice, raw tone. Lines are tagged by **trigger** and **mood** (clarity band), and the game picks a matching unused line.

Triggers (first pass): dealt in, folds preflop, raises, re-raises, calls big bet, goes all-in, wins without showdown, wins at showdown, loses at showdown, bad beat taken, bad beat given, bluff caught, bluff worked, you fold to them, you call them down, you stack them, they stack you, long tank by you, instant action by you, short-stacked, chip leader, new blind level, player eliminated, heads-up, idle chatter.

Rate limits keep it from being noisy: at most one speaker per action, a cooldown per character, and the table gets quieter in big pots. Dealer lines: deal announcements, action prompts, blind level changes, eliminations.

Display: speech bubble beside the speaker's seat, readable from the TV camera, 2–4 seconds.

---

## 7. Screens and flow

1. **Title / menu** — play, career, settings.
2. **Tournament select** — Tutorial, Vegas, Championship, each with your record and trophies.
3. **Table** — the game. TV camera, your cards large bottom-center, action bar (fold / check-call / bet-raise with a slider and quick sizes), shot clock ring, pot and board center, each seat with portrait, name, stack, current bet, and dealer button.
4. **Hand replay** — after any hand, tap to re-watch with all hole cards shown and equity per street.
5. **Player card** — tap a face: name, bio, stack, last shown-down hands, last few actions.
6. **Results** — finish position, hands played, biggest pot, best hand, trophies earned.
7. **Career** — per-tournament results, trophy case, achievements.
8. **Settings** — sound, fast-forward, comment density, reset save.

---

## 8. Visual direction

- Broadcast look: dark room, warm pool of light on a green or blue felt, wooden rail, soft shadows, shallow depth of field on the camera cuts.
- Cards: crisp, large, physically dealt and flipped. Chips stack and slide in animated bets.
- Seats: portrait at each seat with expression states (neutral, thinking, pleased, annoyed, tilted, shocked). Placeholder: stylized procedural busts.
- Overlays: minimal, clean, TV-graphics style name plates and pot readouts.
- Camera: a rail of preset shots (table, each seat, board close-up, your cards). Swipe orbits between seat shots; auto-director cuts for all-ins, showdowns, and eliminations.
- 60 fps target on mid-range phones. Pixel ratio capped at 2.

---

## 9. Technical plan

- Vite + TypeScript + Three.js (already scaffolded). PWA installable.
- `engine/` pure TypeScript, no DOM: deck, evaluator, betting rules, tournament state, bot AI, stats, comment selection. Fully unit tested with Vitest, deterministic with seeded random.
- `scene/` Three.js rendering, animations, camera director.
- `ui/` HTML overlay for action bar, bubbles, menus.
- `content/` roster, bios, comment lines.
- Save: versioned JSON in localStorage.
- Hosted at https://brucemccoy75-dev.github.io/Mobile/poker/ by the existing workflow.

---

## 10. Build order

1. Engine: rules, evaluator, tournament loop, hand history. Tests.
2. Bot engine: stats, opponent model, the four policies, clarity. Simulation harness that pits types against each other to tune them.
3. Table scene: felt, cards, chips, seats, camera director, action bar, shot clock. Playable against bots with placeholder faces.
4. Comments: trigger system, roster, first 400+ lines.
5. Tournaments, results, career, trophies, settings, replay.
6. Polish: audio, animations, expressions, performance pass on real phones.
7. Later: real portrait art, text-to-speech, cash games.

---

## 11. Open points for you

- Bot stat baselines in section 3 are my proposal; tell me if you want nits dumber or pros sharper.
- Clarity rises on bad beats and falls on wins, per your note. Should it also fall slowly over quiet hands? (I assume yes.)
- 12 characters, 3 per type. More or fewer?
- Felt color: green or blue?

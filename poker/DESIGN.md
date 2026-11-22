# Poker Night at Dave's — Design Document (v1, for sign-off)

Single-player, phone-first, 3D No-Limit Texas Hold'em. You against five bots at a
six-seat table with a dealer. Tournament play only. Looks like watching poker on TV.

**The vibe**: very accurate, genuinely fun poker, wrapped in dry humor. The bots needle
you and each other with timely insults and banter that are always *funny* first. The game
never plays dumb for a laugh; the poker is real, the table talk is the comedy.

Status: **approved 2026-11-22**. Open points resolved: stat baselines as proposed; clarity also drifts down slowly over quiet hands; 12 characters, 3 per type; green felt; build order as proposed.

Build progress: steps 1 to 6 of section 10 are implemented and live at https://brucemccoy75-dev.github.io/Mobile/poker/ with placeholder figures and synthesized sound. Remaining: real portrait art, text-to-speech, cash games, and tuning from real play.

---

## 1. Locked decisions

| Area | Decision |
|---|---|
| Variant | No-Limit Texas Hold'em only |
| Format | 6-max sit-and-go: you + 5 bots. Ends when you bust or win |
| Stacks / blinds | 10,000 chips. Blinds 50/100. Levels rise every 8 hands. Antes from level 4. No rebuys |
| Format | One format, *Poker Night*: you pick any five of the twelve men on the home screen. No table tiers (the Kids Table / Adult Table / Real Poker split was built and then removed) |
| Dealer | Skynet, Dave's android. Deals, misquotes science fiction, and vaporises whoever busts (red laser, puff of smoke, chair stays empty) |
| Bots | Fixed named roster of twelve, modelled on the real crew. You seat five |
| Persistence | Device only (browser storage). No accounts |
| Stats shown | Hidden. Tilt shows through behavior and comments, never as a number |
| Reads help | Hole-cam replay of the last hand from the pause menu. No notes, no auto labels |
| Orientation | Landscape. Rotate prompt in portrait |
| Faces | 2D portraits with expression states, mounted in the 3D scene. Procedural placeholders first; real art later |
| Hole cards | Only yours during the hand. After the hand, optional replay with everyone's cards (hole cam) |
| Camera | Fixed TV view of the table. No swipe or tap to look around. Whoever is talking appears in a picture-in-picture panel down the right side with the line as a caption |
| Comments | Captions in the speaker panel. Raw tone: swearing allowed, no slurs. Always funny: dry, timely, character-driven. Two-man conversations about the office, AI and data centres, wives, NH weather, out-of-date Boston sports, D&D, and Division II girls' sports. Lines are never cut off before they can be read; nobody stays silent for long |
| Name | *Poker Night at Dave's* (was *Poker, I Hardly Knew Her*) |
| Timing | No shot clock. Your speed is still tracked and is a tell bots can read |
| Pace | Realistic bot think times (1–6 s) with a fast-forward toggle |
| Audio | Cards, chips, ambient casino. All mutable. No music |
| Career | One overall record (nights, wins, finishes, best hand, biggest pot) plus a rivalry record per man: nights together, who finished ahead, knockouts each way. Trophies |
| Later | Cash games, portrait expression variants, device text-to-speech |

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
- Goes **down** within the game as the bot wins pots, especially big ones, and drifts down slowly over uneventful hands.
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

Twelve named men, modelled on the real crew: two nits (David Sr, Paul), five tourists (Kevin, Tim, Luca, Jack, Menafee), two calculators (Jonathan, Will) and three pros (Bawb, David, Bruce), each with a bio, portrait, voice and stat baselines (the table is in `HANDOFF.md`). You pick five on the home screen; each man pitches to be picked. Menafee never shows up: his seat is an empty chair that people talk to. Skynet is the dealer.

All thirteen portraits are in (`docs/portraits.md` has the prompts and the green-screen pipeline). Expression variants are the remaining art step.

---

## 6. Comments and humor

The comedy is the game's personality, so it gets the same care as the poker.

**Rules for every line**
- Funny first. A line that is merely rude gets cut. Dry beats loud.
- Timely: tied to what just happened, at the moment it happened. A bad beat gets the needle while the chips are still sliding.
- In character: a nit's humor is anxious and self-deprecating, a tourist's is loud and clueless, a calculator's is deadpan and literal, a pro's is cool, cutting, and rarely wasted.
- Earned: insults aimed at you reference your actual play (the hand you showed, the fold you made, how long you tanked). Generic trash talk is a last resort.
- Running gags: characters have recurring bits and callbacks within a tournament, and the dealer has a dry, long-suffering voice that comments on the table rather than the hands.
- Bots talk to each other, not only to you, so the table feels alive when you are not in the hand.

Goal: 100+ lines per type, written in each character's voice, raw tone. Lines are tagged by **trigger** and **mood** (clarity band), and the game picks a matching unused line.

Triggers (first pass): dealt in, folds preflop, raises, re-raises, calls big bet, goes all-in, wins without showdown, wins at showdown, loses at showdown, bad beat taken, bad beat given, bluff caught, bluff worked, you fold to them, you call them down, you stack them, they stack you, long tank by you, instant action by you, short-stacked, chip leader, new blind level, player eliminated, heads-up, idle chatter.

Rate limits keep it from being noisy: at most one speaker per action, a cooldown per character, and the table gets quieter in big pots. Dealer lines: deal announcements, action prompts, blind level changes, eliminations.

Display: speech bubble beside the speaker's seat, readable from the TV camera, 2–4 seconds.

---

## 7. Screens and flow

1. **Intro** — a short video, skippable, once per visit.
2. **Home** — the pick screen: all twelve men pitching to be picked, choose five (or Random five), your name, Deal, Career, Settings. There is no separate title screen.
3. **Table** — the game on a fixed 1000x460 stage that scales to any screen. Fixed TV camera, the board large at the top, your cards and stack bottom right, action bar bottom left (fold / check-call / bet-raise with a slider and quick sizes), each seat with portrait, name plate and stack in dollars, dealer button, a speaker panel down the right side. A standings card on hand one and whenever the blinds go up. A result card mid-table at the end of each hand showing who showed what and who won. Busted men are vaporised by the dealer.
4. **Hand replay** — from the pause menu, the last hand with all hole cards and equity per street.
5. **Results** — finish position, hands played, trophies earned, play again or home.
6. **Career** — overall record, rivalry record per man (record against you, knockouts each way), trophy case.
7. **Settings** — sound, comment density, reset save.

---

## 8. Visual direction

- Broadcast look: dark room, warm pool of light on a green or blue felt, wooden rail, soft shadows, shallow depth of field on the camera cuts.
- Cards: crisp, large, physically dealt and flipped. Chips stack and slide in animated bets.
- Seats: portrait at each seat with expression states (neutral, thinking, pleased, annoyed, tilted, shocked). Placeholder: stylized procedural busts.
- Overlays: minimal, clean, TV-graphics style name plates and pot readouts.
- Camera: one fixed table shot. Close-ups happen in the speaker panel (a second camera rendered into a scissor region), never by moving the main view.
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
3. Table scene: felt, cards, chips, seats, fixed camera, action bar. Playable against bots with placeholder faces. (Done; the shot clock was built and removed.)
4. Comments: trigger system, roster, first 400+ lines.
5. Tournaments, results, career, trophies, settings, replay.
6. Polish: audio, animations, expressions, performance pass on real phones.
7. Later: real portrait art, text-to-speech, cash games.

---

## 11. Resolved points

- Stat baselines: as proposed in section 3, to be tuned in the simulator.
- Clarity: rises on bad beats and big losses, falls on wins, and drifts down slowly over quiet hands.
- Roster: 12 characters, modelled on the real crew; type counts are uneven (2 nits, 5 tourists, 2 calculators, 3 pros).
- Tables: dropped in favour of picking your five opponents. Career tracks rivalries instead of table records.
- Shot clock: dropped. Swipe-to-look: dropped. Title screen: dropped.
- Felt: green.

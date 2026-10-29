# Next session notes

## Start here (updated 2026-10-28)

**State.** Branch `claude/re-rpg-mobile-architecture-t26won`, folder `re-rpg/`, live on GitHub
Pages at https://brucemccoy75-dev.github.io/Mobile/ (deploys ~70 s after a push; poll
`origin/gh-pages` for "Deploy re-rpg <sha>"). 287 tests pass (`npm run check`: typecheck,
cards:validate, world:validate, tests, build). The game today is:

- **Node overworld** (DECISIONS #37): a static node network per screen over an authored terrain,
  contents rolled per run (and shaped by node rules, #55), tap a reachable node to travel, swipe to
  pan. Screen 1 is painted (`public/art/c/map1.jpg`, #39); screen 2 uses the tileset. Subtle
  ambience: dust behind the hero, ripples on water, birds now and then (#60). `?dev` shows an overlay.
- **The story is switched off** (#72) while the designer balances: `STORY.enabled = false` in
  `src/data/world.ts`. A run is the fixed start, the map's usual placement, and Knight Andre
  always at the gate. There are no quests, special runs, dialogue, on-kill hooks or Wren, and the
  story nodes are plain dots. Everything is kept: `world.json` (#55–#61) holds the dialogue
  library, everyday lines, on-kill hooks, node rules and quests, and the world editor still edits
  it. Set the switch to `true` to bring it all back. The ghost is also off (`GHOST_ENABLED`, #54).
- **Combat**:
  - a hand of 3 before every card (#53, #70);
  - one card per enemy alive: a duo is two cards (#68);
  - branching cards on HP below a percent, a debuffed enemy or a coin you call; Lunch Break's
    Regen, which locks damage cards; Blackjack ×5 to 21, opening with a drawn card (#69, #71);
  - statuses that land together play together (#64); sweeps hit every enemy at once (#47);
  - remove guard / remove buffs (#48), backfire (#51);
  - luck: crits and bonus turns, 1% each at base (#50, #52).
- **Battle effects** (#59, #62), chosen from what a card does or named per card in the card
  editor:
  - slash, fireball, lightning, frost, arcane, heal;
  - poison cloud over the head, and a curse skull of smoke (#65);
  - sandwich, playing cards and coin (#69);
  - a quick coloured shield per status, and a fast deflection on a block that stops the slash
    or spell at the shield (#63, #66).
- **Progression**: levels 1–10 per class, +1 max HP per level and a rare card or gold (#49);
  warrior tree Bulwark, Berserker → Paladin, Shadow Knight → Weaponmaster (#46); Shadow Knight
  holds Minor leech, Leech, Death Touch; Bulwark gained Desperation and Utility Knife, Berserker
  Lunch Break, Blackjack and Trickster (#69); Paladin and Weaponmaster are empty. Nothing drops
  without a node (#42).

**Two editors, phone first** (title screen): the **card editor** (`editor.html`, `docs/CARDS.md`)
and the **world editor** (`world.html`, `docs/WORLD.md`: Nodes, Quests, Words, Enemies). The
designer edits on the phone and sends an exported `cards.json` or `world.json`; the import is the
fixed procedure in the matching doc (validate, check, pinned tests only, commit). Never hand-edit
card numbers or story in TypeScript. A new mechanic or story capability is an engine change with
tests first, then a schema field, an editor control and a validator rule.

**Working loop.** Edit → `npm run check` → start `npx vite preview --port 4174 --strictPort` in its
own command → Playwright at 844×390 (the game) or 390×844 (the editors) with `window.__rerpg`
(Test Mode: set registry `testSetup`, call `TestMode.fight()`, then `Combat.act()` and poll
`busy`; to answer a dialogue from a script, `scene('Dialogue').choose(d, option)`) → commit with
the attribution lines → `git push -u origin <branch>` → poll gh-pages. Record decisions in
`docs/DECISIONS.md` (next number is 73). Screenshots of checks go in `docs/audit/<topic>-<date>/`.

**Run logs** (`docs/PLAYTESTS.md`, DECISIONS #67). When the designer sends a run log, always:
1. save it in `docs/playtests/`;
2. run `npm run playtest -- <log>` (real runs next to the screen-1 mirror: how often each reaches
   and beats the boss);
3. run `npm run sim -- --screen --class warrior` and `npm run sim -- --class warrior`;
4. write it up as the next "Phone test N" at the top of `docs/BALANCE.md`;
5. recommend, and change nothing without the designer.

Latest: **Phone test 8** (2026-10-28):
- fresh and Berserker runs reach Wren 0% (mirror 0%);
- 63–75% of deaths come in duos;
- levels shorten fights but don't add wins.

Since then: one card per enemy alive (#68). In the mirror, duo deaths fell to 35–48% and the
shortest road reaches Wren 6–37%. A full clear still almost never does. The next run log is the
first real test of #68.

**Scope.** Only the warrior is being balanced. Wizard and shaman cards, families and trees are
frozen by the validator until the warrior is done.

## Backlog, in order

1. **Pacing and balance**, the focus now (the story is off for it, #72). From Phone test 8
   (BALANCE.md), with the designer:
   - what a full clear should cost (a camp near the gate, duos shown on the map as a choice, a shop
     that turns gold into HP: all world data);
   - growth within a run against growth across runs;
   - fill Paladin and Weaponmaster through editor imports.

   Sim: model loot and the shop in the screen mirror, so it predicts a run instead of flooring it.
2. **Remaining hard-coded story → data** (from the #61 review):
   - Wren at the gate (`OverworldScene` encounter, `WREN_GRUDGE`) as `screens[i].gate: [{when, boss, trigger}]`.
   - Her boss-win payoff (`CombatScene`: +9 relation, `wren_beaten`) as an on-kill hook for a
     custom boss (the validator allows only roster ids today).
   - The start node's words per screen (`giver:wren` only on screen 1) as `screens[i].start`.
   - Node labels ("camp", "a voice", "someone") as a node-rule `label`.
   - One variable set (`{weapon}`, `{species}`…) for every dialogue, not only before fights.
3. **World editor performance**: every change rebuilds the page and re-runs validate and diff.
   Re-render only the edited panel; validate, diff and save the draft when idle. Matters once the
   library holds ~300 entries.
4. **Dead code**: the generated-map path (`src/core/map/generate.ts`, `encounter.ts`, `findPath`)
   and `generateQuest` / `GIVERS` are used only by tests; switch those tests to the authored map
   and `questFromDef`, then delete (keep `costField`). `RunState` still carries threat / POI fields
   for old saves.
5. **Art queue**: screen-2 painting (prompt in `docs/ART.md`, layout in `art-src/layout-screen2.png`),
   painted node icons, Wren's still, life on the painting.
6. **Story, when the switch goes back on** (#72): each enemy's everyday lines (10–20 each, by
   personality, with the designer), the first special-run quest, and lines for Tam's node on
   screen 2.
7. Small: long card text now steps its font down a size (#69); check Death Touch and Spirit
   Boomerang on a phone. Dialogue `chance` conditions draw from the quest stream (move them to
   their own stream).

# Next session notes

## Start here (updated 2026-10-28)

**State.** Branch `claude/re-rpg-mobile-architecture-t26won`, folder `re-rpg/`, live on GitHub
Pages at https://brucemccoy75-dev.github.io/Mobile/ (deploys ~70 s after a push; poll
`origin/gh-pages` for "Deploy re-rpg <sha>"). 253 tests pass (`npm run check`: typecheck,
cards:validate, world:validate, tests, build). The game today is:

- **Node overworld** (DECISIONS #37): a static node network per screen over an authored terrain,
  contents rolled per run (and shaped by node rules, #55), tap a reachable node to travel, swipe to
  pan. Screen 1 is painted (`public/art/c/map1.jpg`, #39); screen 2 uses the tileset. Subtle
  ambience: dust behind the hero, ripples on water, birds now and then (#60). `?dev` shows an overlay.
- **Story** lives in `src/data/world.json` (#55–#61): the dialogue library, each enemy's everyday
  lines and on-kill hooks, per-node rules, quests, and the special-run chance (20%). Wren gives
  screen 1's quest at the start camp; Tam's re-arm errand is dialogue on screen 1; Old Marrow or
  Sister Vell gives screen 2's. Your ghost is switched off (`GHOST_ENABLED`, #54), kept for later.
- **Combat**: a hand of 3 every round (#53), statuses that land together play together (#64), duos, sweeps hit every enemy at once (#47), remove
  guard / remove buffs (#48), backfire (#51), luck: crits and bonus turns 1% each at base (#50,
  #52). Battle effects (#59, #62): slash, a quick coloured shield per status and a fast deflection on a block (#63), fireball,
  lightning, frost, poison cloud over the head, curse skull, arcane, heal, chosen from what a card
  does (or named per card in the card editor).
- **Progression**: levels 1–10 per class, +1 max HP per level and a rare card or gold (#49);
  warrior tree Bulwark, Berserker → Paladin, Shadow Knight → Weaponmaster (#46); Shadow Knight
  holds Minor leech, Leech, Death Touch; Paladin and Weaponmaster are empty. Nothing drops without
  a node (#42).

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
`docs/DECISIONS.md` (next number is 65). Screenshots of checks go in `docs/audit/<topic>-<date>/`.

**Scope.** Only the warrior is being balanced. Wizard and shaman cards, families and trees are
frozen by the validator until the warrior is done.

## Backlog, in order

1. **Story with the designer.** Write each enemy's everyday lines (10–20 each, by personality;
   the designer wants to do this together), the first special-run quest, and lines for Tam's node
   on screen 2 (it is quiet there since #61).
2. **Card balance** through editor imports: fill Paladin and Weaponmaster; give the sim a Shadow
   Knight loadout (`src/core/sim`); watch a fresh run: does a no-family warrior die before the
   boss, does a one-family warrior reach it, is holding a fleeting Mighty Blow for the boss a
   choice? Next lever if singles cost nothing: gear max HP no longer heals (declined so far).
3. **Remaining hard-coded story → data** (from the #61 review):
   - Wren at the gate (`OverworldScene` encounter, `WREN_GRUDGE`) as `screens[i].gate: [{when, boss, trigger}]`.
   - Her boss-win payoff (`CombatScene`: +9 relation, `wren_beaten`) as an on-kill hook for a
     custom boss (the validator allows only roster ids today).
   - The start node's words per screen (`giver:wren` only on screen 1) as `screens[i].start`.
   - Node labels ("camp", "a voice", "someone") as a node-rule `label`.
   - One variable set (`{weapon}`, `{species}`…) for every dialogue, not only before fights.
4. **World editor performance**: every change rebuilds the page and re-runs validate and diff.
   Re-render only the edited panel; validate, diff and save the draft when idle. Matters once the
   library holds ~300 entries.
5. **Dead code**: the generated-map path (`src/core/map/generate.ts`, `encounter.ts`, `findPath`)
   and `generateQuest` / `GIVERS` are used only by tests; switch those tests to the authored map
   and `questFromDef`, then delete (keep `costField`). `RunState` still carries threat / POI fields
   for old saves.
6. **Art queue**: screen-2 painting (prompt in `docs/ART.md`, layout in `art-src/layout-screen2.png`),
   painted node icons, Wren's still, life on the painting.
7. Small: long card text overflows the card face (Death Touch, Spirit Boomerang); dialogue
   `chance` conditions draw from the quest stream (move to their own stream).

# Next session notes

## Start here (updated 2026-10-26, night)

**State.** Branch `claude/re-rpg-mobile-architecture-t26won`, folder `re-rpg/`, live on GitHub
Pages at https://brucemccoy75-dev.github.io/Mobile/ (deploys ~70 s after a push; poll
`origin/gh-pages` for "Deploy re-rpg <sha>"). 193 tests pass (`npm run check`). Last commit:
see `git log`. The game today is:

- **Node overworld** (DECISIONS #37): a static node network per screen over an authored
  terrain, contents rolled per run, tap a reachable node to travel, swipe to pan. Screen 1 has a
  painted backdrop (`public/art/c/map1.jpg`, DECISIONS #39); screen 2 still uses the tileset.
  Dark plates under markers. Dev overlay with `?dev` in the URL.
- **Dialogue with options** at every node (DECISIONS #35), relations and deaths per screen in
  meta v5, Wren the rat-keeper at the start node, Tam the tinker's re-arm quest, Andre's
  escalating gate lines, Wren replacing Andre at relation ≤ −2, your ghost at the node you died
  on (DECISIONS #36).
- **Combat**: duos, target arrow, fixed enemy rotations, flat gear attack (#31), equipment caps
  (#33), Bind Wound 25% once per fight, shop heal 35%, shrine half (#38, #39).
- **Progression**: EXP levels 1–10 per class; the warrior's two nodes cost a point each (#41),
  wizard and shaman nodes are still free; heirlooms every run that has a family. Nothing drops
  without a node, the general tomes included (#42); basics are per class (warrior has no Ward);
  all four special tomes are fleeting; duos 30% on screen 1; selling pays 25%.

**Working loop.** Edit → `npm run check` (typecheck, cards:validate, tests, build) → `nohup npx
vite preview --port 4174 --strictPort &` (start it in its own command; `pkill` in a chained
command kills the chain) → Playwright at 844×390 with `window.__rerpg` (write a throwaway script
per check; Test Mode is driven by setting registry `testSetup` and calling `TestMode.fight()`,
then `Combat.act()` and polling `busy`) → commit with the attribution lines → `git push -u origin
<branch>` → poll gh-pages. Record decisions in `docs/DECISIONS.md` (next number is 45).

**Cards.** Every card is a record in `src/data/cards.json`; the game compiles it at load. The
designer edits cards in the in-game card editor (title screen → card editor, `editor.html`) and
sends back an exported `cards.json`; the import is the fixed procedure in `docs/CARDS.md`
(validate, check, pinned numbers, sim, commit). Never hand-edit card numbers in TypeScript. A new
mechanic (status, trigger, target shape) is an engine change with tests first, then a schema and
editor field, then cards.

**Scope.** Only the warrior is being balanced. Wizard and shaman cards, families and trees are
frozen by the validator and out of scope until the warrior is done.

**Watch in the next fresh run.** Both warrior families cost 2 points (#43), so the first family
lands at level 3, about seven kills in. Does a no-family warrior die before the boss, does a
one-family warrior reach it, and does holding a fleeting Mighty Blow for the boss feel like a
choice? If singles still cost nothing after a node, the next lever is gear max HP no longer
healing (proposed in the #42 review, declined for now). The last two fresh runs reached Wren and
died there (run log in docs/audit is from before #42; export a new one).

**Then, in order (unchanged):** screen-2 painting (prompt in docs/ART.md, layout in
`art-src/layout-screen2.png`); life on the painting (lake shimmer, cloud shadows); painted
node icons; fill the skill trees; a quest generator that speaks node ids; Wren's still.

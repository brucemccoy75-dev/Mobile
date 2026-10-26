# Cards: the model, the editor and the import procedure

Every card in the game is one record in `src/data/cards.json` (DECISIONS #44). The game compiles
those records into engine effects at load (`src/data/cardsSchema.ts`); nothing about cards is
written in TypeScript by hand. Only the warrior is being balanced; wizard and shaman cards are in
the file but out of scope and must not change.

## The model

| Part | Fields | Meaning |
|---|---|---|
| card | id, name, classId (`warrior` or `any`), rarity, uses | identity; `uses` is empty, `fleeting` (destroyed when played) or `once_per_fight` |
| card.damage | percent, bonus, hits, type, ignoreDef, drain, targets | `percent` of class attack; `bonus` is flat and added after it (gear adds the same way); `hits` each at that size; `type` physical (Guard blocks) or magic (Ward blocks); `drain` heals that percent of damage dealt; `targets` is `one` (the chosen enemy) or `all` (every living enemy) |
| card.heal | percent, flat | percent of max HP plus a flat amount |
| card.modifiers | list of modifier ids | applied in order after damage and heal |
| modifier | id, name, target, status, rounds, amount, chance, magic, text | a status on `self` or `enemy`: guard/ward count `amount` hits, burn/curse deal `amount` per round, chill lasts one action, everything else lasts `rounds`; `chance` is a percent; `magic` marks a hostile status that Ward can block; `text` overrides the generated card line |
| family | id, classId, name, cards | a skill-tree node; a card drops once a family that lists it is unlocked; a card is in at most one family per class |
| trees | per class: setId, cost, requires | node costs in skill points and prerequisites |
| basics | per class: card ids | cards in every fight, not counted against the deck cap |

A hit is `round(class attack × percent / 100) + gear attack + bonus`, then armour (never more than
half), then the target's Harden and Exposed and the attacker's Weak (DECISIONS #40). Status
timing: a status ticks at the end of the round it was applied in, so self 1 round covers this
round only, self 2 rounds covers this round and your next turn, enemy 2 rounds covers your next
turn.

Anything the model cannot express (a new status, a new trigger, a new target shape) is an engine
change first: add it with tests, expose it in the schema and the editor, then build cards with it.
"Every living enemy" was the first of these.

## The editor

Title screen → **card editor** (`editor.html`). It loads the shipped cards, keeps a draft in the
browser while you work, and never changes the game: the game only reads what is committed.

- The header's **test attack**, **test gear** and **target DEF** drive the computed number on
  every card, using the engine's own hit formula.
- **Cards**: grouped by family. Tap a card to edit; `+ New card`, Duplicate, Delete (new cards
  only; a shipped card is retired by setting its family to none). Other classes are listed read
  only.
- **Modifiers**: the lookup. Add one here, then link it from any card. A modifier used by a card
  cannot be deleted or renamed by id.
- **Skill tree**: family names, costs, prerequisites, `+ New family`.
- The green line says what differs from shipped; a red box lists rule breaks, with the card id.
- **Export cards.json** downloads the file (the share sheet on iOS). Send it to the session that
  imports it.

## Import procedure (for any model, no judgement calls)

Input: an exported `cards.json`. Work in `re-rpg/` on the game branch.

1. Copy the file to `src/data/cards.json`. Do not edit it by hand, do not reformat it.
2. Run `npm run cards:validate`. It checks the file against the committed one: ids unique and
   lower_snake_case, no shipped card or family removed, basics unchanged, wizard and shaman data
   unchanged, every family and modifier id resolves, every card has damage, heal or a modifier,
   numbers in range, tree costs 0–10 with resolvable prerequisites. One line per problem, exit 1.
   **Any problem: stop, report the lines verbatim, change nothing.**
3. Run `npm run check` (typecheck, validate, tests, build). Tests that may legitimately fail
   after a card change are the pinned-number tests in `src/data/describe.test.ts`,
   `src/core/combat/engine.test.ts`, `src/core/combat/status.test.ts`, `src/game/session.test.ts`,
   `src/core/loot/loot.test.ts`, `src/core/meta/meta.test.ts` and `src/data/data.test.ts`. For
   those, update the expected value to what the card now does and nothing else. **A failure
   anywhere else, or a failure you cannot map to a changed card: stop and report.**
4. Run `npm run sim -- --class warrior --runs 1000` and paste the table under a dated heading at
   the top of `docs/BALANCE.md` with one line naming the changed cards (the validator printed
   them).
5. Commit with the message `Cards: <the validator's change list>` plus the attribution lines,
   push with `git push -u origin <branch>`, and poll `origin/gh-pages` for "Deploy re-rpg <sha>".

Out of bounds for an import: editing any file other than `src/data/cards.json`, the test files
named above and `docs/BALANCE.md`; touching the engine; changing wizard or shaman data; deleting
a card. Those are design changes and go back to the designer.

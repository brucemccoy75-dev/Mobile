# World: the map rules, the dialogue and the import procedure

Everything the world editor edits is one file, `src/data/world.json` (DECISIONS #55). The game
reads it at load. Like the cards (docs/CARDS.md), the designer edits it in the editor on the
phone, exports it, and a session imports it by the fixed procedure below.

## The model

| Part | Fields | Meaning |
|---|---|---|
| dialogue | id, trigger, speaker, portrait, when, lines, options | one thing someone can say; `trigger` is what asks for it (`pre_fight:boar`, `gate:gatekeeper`, `node:quest`, `giver:wren`, or the `next` of another entry); `when` are conditions; each option has `when` (hides it) and effects |
| enemies | per enemy id: defaults | the entries it picks from at random when none of its conditional entries holds and its node has no override |
| screens | per screen, nodes by id: kind, odds, enemy, pair, dialogue | the designer's rules for one node; anything unset is rolled as before |

**Which words play at a fight**, first match wins: a story turn the game forces (the brother a
quest sent back, Wren at the gate, the ghost when it is on); the node's dialogue override; the
enemy's conditional entries in file order (the boar that remembers the apple); one of the enemy's
defaults at random; the first entry for the trigger with no conditions.

**Node rules.** Node ids are fixed by the screen layout (`node_0` is the first slot reading left
to right, top to bottom); there are no new nodes. A content slot (open, elite, monster, unknown,
treasure, shop, shrine glyphs) takes a fixed `kind` or `odds` (weights per kind, rolled each run),
an `enemy` or a `pair` for its fight, and a `dialogue`. The start, quest and lost nodes take a
`dialogue` only (it replaces Wren's, Tam's or the lost one's words). The boss takes an `enemy`
(another boss) and a `dialogue`. A shop or shrine a rule places counts against the run's one of
each; unruled slots fill from the usual bag.

## The editor

Title screen → **world editor** (`world.html`), phone first. It keeps a draft in the browser and
never changes the game.

- **Nodes**: pick a screen; the map scrolls sideways on a phone, and the list under it picks any
  node exactly (some sit a tile apart). A node's panel sets what it is (Rolled, Always a kind, or
  Odds with a weight per kind and the resulting percentages), who you fight (rolled, one enemy or a
  duo, with the authored pairs as one-tap chips; the boss picks a boss) and its words (any dialogue
  entry, with a preview and a jump to edit it). Ruled nodes are gold and listed under the map.
- **Dialogue**: search, then tap an entry to edit its speaker, trigger, portrait, lines, its
  "only when" conditions and its options (text, conditions that hide it, effects, the one Skip
  picks). New, Duplicate, and Delete for an entry nothing uses; shipped entries stay.
- **Enemies**: each enemy's entries for its own trigger, with a tick for the everyday ones and
  "+ New everyday line" (it opens the new entry in the Dialogue tab, already ticked).
- The green line counts changes from shipped; a red box lists rule breaks. **Export world.json**
  downloads it (the share sheet on iOS).

## Import procedure (for any model, no judgement calls)

Input: an exported `world.json`. Work in `re-rpg/` on the game branch.

1. Copy the file to `src/data/world.json`. Do not edit it by hand, do not reformat it.
2. Run `npm run world:validate`. One line per problem, exit 1.
   **Any problem: stop, report the lines verbatim, change nothing.**
3. Run `npm run check`. Tests that may legitimately fail after a world change are the dialogue
   ids pinned in `src/core/dialogue/dialogue.test.ts` and `src/data/world.test.ts`; update the
   expected value to what the file now says and nothing else. **Any other failure: stop and report.**
4. Commit with `World: <the validator's change list>` plus the attribution lines, push, and poll
   `origin/gh-pages` for "Deploy re-rpg <sha>".

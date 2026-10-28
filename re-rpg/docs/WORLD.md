# World: the map rules, the dialogue and the import procedure

Everything the world editor edits is one file, `src/data/world.json` (DECISIONS #55). The game
reads it at load. Like the cards (docs/CARDS.md), the designer edits it in the editor on the
phone, exports it, and a session imports it by the fixed procedure below.

## The model

| Part | Fields | Meaning |
|---|---|---|
| dialogue | id, trigger, speaker, portrait, when, lines, options | one thing someone can say; `trigger` is what asks for it (`pre_fight:boar`, `gate:gatekeeper`, `node:quest`, `giver:wren`, or the `next` of another entry); `when` are conditions; each option has `when` (hides it) and effects |
| enemies | per enemy id: defaults, onKill | `defaults`: the entries it picks from at random when none of its conditional entries holds and its node has no override; `onKill`: story when one is killed (below) |
| screens | per screen, nodes by id: kind, odds, enemy, pair, dialogue | the designer's rules for one node; anything unset is rolled as before |
| specialChance | 0–1 | the share of runs that are special (DECISIONS #58; 0.2) |
| quests | id, name, screen, giver, type, voice, fetch, hunt, escort, reward, when, special, then, nodes | a quest a screen can offer (DECISIONS #57): see below |

**Quests.** Each run, each screen offers one quest: one of its quests whose `when` holds (special
ones only on a special run), picked at random if several qualify. `giver` is the node it is
offered and handed in at, and `escort.node` where an escort waits: the start camp, the quest node
or the lost one's node, never a fight, never the same node. `type` is fetch, hunt, escort or
rolled (one of the three each run). Unset targets roll: a fetch from the run's loot, a hunt from
this screen's species (minus `avoid`), an escort's name from the usual list. `voice` is the giver's
name, title and lines (an offer and a thanks per kind, plus accept, progress, decline; `{target}`
and `{need}` fill in). Unset rewards are the standard ones (fetch 15 gold and the item back +1,
hunt 25 and a good pick, escort 20 and a chest; doubled on screen 2); `flag`, `relation` and
`tome` add to them. `then` names a quest on the same screen the giver offers once this one is
handed in. Tam's re-arm errand is written as dialogue (flags, conditions and the re-arm effect),
so it is edited on the Words tab.

**Special runs** (DECISIONS #58). Each run rolls once, at the start, whether it is special
(`specialChance`, kept in the save). On a special run each screen offers one of its `special`
quests whose conditions hold; with none, the usual quest. A special quest may pin `nodes` (the
same rules as the Nodes tab, by node id): while it is the screen's quest, those rules replace the
screen's own for that node. A special run says "Something is different on this road today." as
the screen opens.

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

## Conditions and effects (the story vocabulary)

Every "only when" (dialogue entries, options, quests, on-kill hooks) uses these; all must hold.

| Condition | Holds when |
|---|---|
| flag (is) | a run flag is set (or not) |
| remembered (is) | a flag the world remembers across runs is set (or not) |
| relation min/max | a named relation (wren, gerald, imp, andre, tinker, …) is in range |
| deaths screen/total min/max | deaths on this screen or in total are in range |
| killedBy | the last killing blow was this species |
| level min/max, gold min, fights min/max | the class level, gold held, fights won this run |
| class | the hero's class |
| screen | this happens on that screen (0 = screen 1) |
| quest is | a world.json quest this run is none, offered, active, ready (can be handed in), done or declined |
| has | a card in the deck or an item worn |
| special | this is (or is not) a special run |
| chance | a percent roll |
| not / any | the inner condition fails / at least one inner condition holds |

| Effect | Does |
|---|---|
| fight / skip / next | start the fight / walk on / lead on to the entry answering that trigger |
| flag (on/off) | set or clear a run flag |
| remember | remember a flag across runs |
| relation delta | move a relation |
| gold, hp | add or take gold or HP |
| tome | give a card (or a random one from the run's families) |
| quest | offer a world.json quest on this screen now, at its giver |
| note | show a line as a toast |
| rearm (trigger, win flag) | send the last cleared fight back bigger; the node greets you with that trigger and sets the win flag when you win it there |

**On-kill hooks.** `enemies[id].onKill` is a list of `{when, effects}`; when one of that enemy is
killed, the first entry whose conditions hold runs its effects (Wren's rats live here). Wins are
applied the moment the fight is won, before any save.

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
- **Quests**: per screen, tap a quest to edit who gives it and where, its type and targets, the
  giver's lines (only the ones its type needs), rewards, conditions, special-runs-only and the
  next quest in its chain; a special quest also pins nodes, with the same panel as the Nodes tab.
  The tab also sets the share of special runs. New, Duplicate, and Delete for a quest that did not ship.
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

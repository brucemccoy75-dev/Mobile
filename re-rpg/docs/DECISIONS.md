# Re-RPG — Design Decisions Log

Decisions made in planning session 1. Each entry: decision, rationale, implications.

| # | Topic | Decision |
|---|---|---|
| 1 | Healing | HP is a run resource. No healing after fights. In-fight healing is rare and costly (long cooldown-equivalent via deck rarity, turn cost, downsides). Shrine = one clean full heal per screen. Boss kill = full heal. HP drain is the primary death driver. |
| 2 | Skill limiter | **Dealt hand, not cooldowns.** Known skills form a deck shuffled per encounter. Round 1 deals a full hand of 3 (amended after phone test 1; was 1/2/3), then 1 per round. Hand cap 3. When full, each new deal discards the oldest card in hand. Played skills go to a discard pile; reshuffle when the deck is empty. **Amended after phone test 1:** Attack and Defend are cards too. Every fight's deck is the run deck plus two Attacks and one Defend (not counted against the cap), so there is no always-available button and the opening rounds are real draws. Future: stamina meter for multi-play turns. |
| 3 | Enemy intent | Exact intent shown for the current round (icon + number) plus a posture tell for the following round. Two-step lookahead. |
| 4 | Rewards | Kill: pick 1 of 2 (item or tome), skip allowed, gold on top. Chest and boss: pick 1 of 3. **Amended after phone test 2:** any choice can be **sold** instead (≈40% of shop price); selling still counts as a discovery, so no reward is ever dead. |
| 5 | Set roll | Rolled set defines this run's set-tome pool only. Start with Attack, Defend, empty deck, no gear. Equipped items leave the drop pool (a slot holds one). **Amended after phone test 2:** tomes may drop again; copies stack in the deck so a favourite skill comes up more often. |
| 6 | Heirloom | From the first death onward, each run opens with a **spread of up to 4 random unlocks** (discovered items and tomes usable by the class, weighted toward the rolled set) and the player **keeps 2**. Amended after phone test 2 from one random heirloom. Slot growth is a later knob. |
| 7 | POC scope out | Multi-enemy fights, fleeing, fog of war, inventory. All out. |
| 8 | Persistence | Firebase. Anonymous auth on first launch, link Google account later. Firestore: one document per player (MetaState + current RunState). Local-first with a sync adapter; game code only sees a `SaveStore` interface. |
| 9 | Deck cap | 10 known skills (was 6: with one card per round the small deck got repetitive by screen 2). Tomes beyond the cap force a binding swap or skip. Cap becomes an item/set stat later. If long fights stale, first lever is dealing 2 cards per round after round 5. |
| 10 | Repo | Built in `re-rpg/` inside this repo; GitHub Pages (gh-pages) now serves the game, map3d is gone. Firebase Hosting on `main` once a project exists. |
| 11 | Healing cost | Healing skills heal 35% and leave you **Exposed for 2 rounds**: a heal is a bet that you can block or outpace the next two doubled hits. History: a one-round Exposed was no deterrent (phone test 1); two skipped turns (Recovering) made the heal not worth playing (phone test 5). The Recovering status stays in the engine for future enemies and skills. |
| 13 | Attack budget | Flat attack on a base of 4 was +25% per point, so +5 gear made screen 1 trivial. Budget: common +1 free; uncommon +2 only with a cost (DEF or HP); rare +3 with a real cost; relics are the only way higher and always pay in HP (Bloodstone +3/−6 HP, Glass Idol +4/−12 HP). A maxed hero sits near +5, not +9. |
| 14 | Big hits scale flat | "Big hit" skills use a flat bonus, not a multiplier: Broadsword 100% + 4, Inferno 100% + 10. Same damage at base attack, far less with gear. Multipliers stay for modest skills (Fireball 150%, Lightning 160%). |
| 15 | Enemy answers + Hold | Enemies get telegraphed answers to pound-strike play: **Brace** (Boar, Ogre: the next hit that lands is thrown back, blockable by Guard), **Scatter** (Rats, Harpies: the next single hit does half; multi-hit unaffected). Enemy HP raised (screen 1: 14–20, Gatekeeper 48; screen 2: 24–34, Warden 58). **Hold** lets the player discard a card to pass the turn, the universal out for a trap turn at the cost of tempo and a card. Tomes cap at **2 copies** per deck. |
| 16 | Class gating | Warrior is the only class open at first. Wizard and Shaman unlock after a run is **won as Warrior** (per-class win counts in MetaState, v2 with migration). |
| 17 | Card text | Skill cards state real numbers from the hero's current stats ("Deal 8 damage"), never percentages. They ignore the enemy's defence and intent on purpose: what the card does, not what will land. |
| 18 | Legacy | Every win of the final boss banks one **Legacy point**. The next run opens with a one-time choice: +1 ATK, +1 DEF or +5 max HP. Permanent, shared by all classes, never refunded; five wins means five allocations. The run's base stats are frozen into its save so a later allocation never changes a run in progress. |
| 19 | Quests | One randomised quest per screen from a giver placed near the entry (testing placement). Kinds: **fetch** (bring an item you have equipped or a tome you carry; the copy is lost, a **+1 version** returns for this run only), **hunt** (kill 2 of an enemy type present on this map), **escort** (find an NPC far off the road and bring them back; threat ×1.25 while they follow). Rewards: gold, plus a spoils pick for hunt and escort. Quests are data templates with giver voices (`data/quests.ts`) so story and lore attach there. |
| 20 | Armour hardens | Armoured enemies' shell is a **50% damage reduction for a turn**, not a full block (phone test 6: full blocks made the beetle a slog). Bosses keep real Guard for their rhythm puzzles. Combat chips and the hand are both driven by playback events, never the live state. |
| 21 | Special tomes | Two tiers beyond normal tomes, usable by every class and always in the pool: **rare, once per fight** (Mighty Blow 200%, Stand Firm: block every hit for 2 rounds; exhausted when played, back next fight) and **fleeting** (Last Strike 300%, Final Stand: 3 rounds; the tome is destroyed when played). Uncommon rarity for fleeting so they turn up. Discovered like any tome, so they feed heirlooms. |
| 22 | Physical vs magic | Damage is **physical** or **magic**. **Guard** (Defend, Shield Bash, Ice Armor) stops the next physical hit; **Ward** (new basic, Warding Blast) stops the next magic hit; **Aegis** (Stand Firm, Final Stand) stops everything for its rounds. Basics are now Attack ×2, Defend, Ward. Shield Bash and Warding Blast are *tiring*: Weak on your next turn. Enemy Guard is physical-only too, so spells pass a guarding boss. Later option: per-class basics (warrior Defend, wizard Ward, shaman both). |
| 12 | Damage floor | Defence never removes more than half a hit: `max(1, ceil(base/2), base − def)`. Flat subtraction made a 4-attack hero deal 1 to a 3-defence beetle (20-round fights). Armour now lengthens fights, it does not stall them. |

## Knock-on changes

- **Defend is a basic action**, so the Warrior Tank set replaces it. Draft: Shield Bash (small damage + Guard) alongside Bind Wound.
- Healing skills carry a tax to honour decision 1: Bind Wound heals small and ends the turn; Mend heals more but applies Weak to the caster for 1 turn.
- Early runs drain the tome pool after two tomes (decision 5), so offers fall back to equipment and gold. That is intentional pressure toward discovery.
- Simulator primary metric: HP remaining on arrival at Boss 1, and % of runs that arrive at all, bucketed by number of discovered entries.

## 23. Map layout rules (tidy screens)

Phone test with real tiles: per-tile random biomes read as noise, rocks among trees were confusing, and POIs landed inside thickets. Rules now live in `LAYOUT` in `src/core/map/generate.ts`:
- Biomes are broad regions from low-frequency value noise, majority-smoothed, and patches under 5 tiles become grass. Forest grows likelier with distance from the road; swamp only 5+ steps out. One grass tile each side of the road stays clear.
- Obstacles are rock ridges (short lines with bumps) and elliptical lakes, never within 2 steps of the road; bodies under 3 tiles are dropped; forest touching rock or water becomes grass so rocks sit in open ground.
- Every POI, the quest giver and the NPC spot sit in a 3×3 grass clearing.
- Each POI gets a detour wall across the midpoint of its cheapest approach, kept only if entry still reaches the boss, every POI, the giver and the NPC. Validation also checks those last two now.

## 24. Ward covers spell-statuses; HP bars follow the playback

Phone test: the necromancer's Curse walked through Ward, and the Boar's Gore looked free because the HP bar had already dropped to the end-of-round value when the preceding counter played. Now a hostile status flagged `kind: 'magic'` (every enemy hex and curse) is a magic hit for blocking: Aegis ignores it, one Ward stack is spent to stop it, and the scene shows WARDED. Ward's text reads "magic hit or curse". The scene keeps its own displayed HP per side and moves it per damage, counter, heal and tick event, snapping to the real value only when the step ends, the same rule the hand and status chips already follow.

## 25. Death ends everything; equipment never wounds

Phone test. (a) A braced enemy countered the hit that killed it, and an enemy burning to death at end of round still got its curse tick on the player. Now a killing blow is never countered, and end-of-round ticks run enemy-first and stop the moment a side dies. (b) Swapping to a relic with lower max HP drained current HP by the difference. Now a max-HP gain is real HP gained, a max-HP loss only lowers the ceiling (current HP clamped), so changing gear is never a self-inflicted wound.

## 26. Run telemetry and Test Mode

Balance calls were being made from the greedy sim and memory of phone sessions. Now every real run writes a record (`src/core/telemetry`): seed, class, set, legacy, the deck and gear at the start, and per fight the screen, enemy, rounds, HP before/after, damage dealt/taken/blocked, counters, DoT, heals, cards played and holds, plus every reward offered/picked/sold and every shop purchase, and how the run ended. The last 20 runs live in local storage (`rerpg:telemetry`); "run log" on the title and end screens shares the JSON (Web Share on phones, clipboard elsewhere). Test Mode (title screen) fights any enemy with any deck and gear for quick checks; its fights are never recorded, never saved, and never touch the meta.

## 27. Exposed and Weak stack by duration

Phone test: Bind Wound's self-Exposed and an enemy Hex looked like one status. A repeat of a timed debuff used to take the longer duration only. Now Exposed and Weak add their rounds (capped at 4); the multiplier never compounds, so a double Exposed is longer, not ×4. Guard/Ward still stack hits, DoTs still take the larger magnitude and longer duration.

## 28. Card faces: colour by kind, one big number

Cards are coloured by what they do, not by rarity: attack red, defence blue, heal green, magic orange (rarity moved into the name colour). Under the text one headline number sits large in the corner with its unit (4 damage, 1 hit, 2 rounds, 9 heal, 3×3 burn), chosen by `cardFace()` in `src/data/describe.ts` from the first damage, heal, self-block or hostile status effect. Fleeting and once-per-fight cards carry a corner tag (purple FLEETING, gold ONCE). Cards grew to 150×112 to fit.

## 29. Duos: two enemies, one target arrow

Enemy scripts are deterministic on purpose (reading the Boar is the fun), so variety comes from combinations, not dice. The engine now holds `enemies[]` (front first); each has its own script, intent, statuses and HP, acts in slot order, and ticks before the player. Cards take a `target` slot: a gold arrow bobs over the targeted enemy and tapping an enemy retargets. Multi-hit cards hit the target only for now; sweeps and taunts are future cards. A dead target falls back to the front living enemy. Wild encounters roll an authored pair from `src/data/packs.ts` 20% of the time on screen 1 and 40% on screen 2; guards and bosses stay single until pairs prove out. A duo pays like a guard fight. Telemetry lists every enemy; hunts count all of them. Test Mode has a "2nd" picker.

## 30. Pacing: faster, not easier

Target rounds per fight: trash 3–4, guards and duos 5–7, bosses 10+. Enemy HP came down about a third and attack went up one so damage per fight stays while rounds fall: Boar 12/5, Shell Beetle 10/4 def 1, Hex Imp 11/4, Necromancer 11/4 with Bone Bolt 1.5× and Lifetap healing half, Rat Pack 12/3; Ogre 24/7 (Smash 2.2×), Iron Knight 18/6 def 3, Witch 17/6, Harpies 18/4. Bosses got longer instead: Knight Andre 52/7, Warden 62/8. Greedy-sim duels for a fresh warrior now run 3–6 rounds (necromancer longest); the boss stays a long fight for the tank build. The player buff is deferred until telemetry from duos lands.

## 31. Gear attack is flat, not multiplied

Run log: three attack items took a warrior from 4 to 11 attack and Mighty Blow doubled that to 20, one-shotting every screen-1 enemy before it acted. Gear used to add to ATK and every card multiplied the total. Now a hit is class attack × card multiplier + gear attack + the card's flat bonus (`Stats.gearAtk`, set by `computeStats`). Attack is unchanged; Mighty Blow at +7 gear drops from 22 to 15, Broadsword from 18 to 15, and low-multiplier cards like Shield Bash gain a little. Stacking still matters, it stops compounding.

## 32. Per-class progression: EXP, skill tree, heirloom families

The run log showed power coming from volume of rewards and stacked gear, and veterans needed something to grow that is not raw numbers. Progression is breadth, never depth: cards never level, so a maxed player's cards hit exactly as hard as a new player's and screen 1 stays dangerous by construction.
- **EXP per kill**, by tier (10 / 18, bosses 60 / 90), ×1.33 as a guard, ×1.5 per member of a duo; a win pays 120. Levels 1–10 on a steep curve: 30 EXP to level 2, each step ×1.6, about 3400 total, the last step alone ~1300. A screen-1 clear is worth about 200.
- **One skill point per level**, spent on a per-class skill tree whose nodes are card families (the existing sets). Costs are per node in `src/data/progression.ts` so a tree can be any shape and need not have ten families; the two current sets per class are free nodes. Nothing is shared between classes and nothing is refunded. The tree is spent between runs (ClassSelect → Skill tree).
- **Heirlooms every run**: a random spread of 4 tomes drawn across the class's unlocked families (not one per family, so the dice decide the direction). Keep 2; they start in the deck and *only their families* fill the run's tome pool, plus the always-on general tomes. Items left the spread; equipment stays its own discovery-gated pool. Discovery no longer gates tomes.
- Legacy stat points stay as they are for now; folding them into the tree is a later call. Meta v4 (`progress` per class), run state carries `families`, telemetry records families and level.

## 33. Equipment is small: ATK +1, DEF +1, HP carries rarity

Run log after the flat-gear change: +8 gear attack still made the basic Attack a 12-damage one-shot against 10–12 HP enemies, so fights ended before the enemy acted and HP never mattered. Supersedes the attack budget in #13. Caps: body DEF +1 at most, weapons ATK +1 at most, relics ATK +1 at most; rarity shows up as max HP (+3 common, +5/6 uncommon, +6/8 rare) and costs are paid in HP. The most attack ordinary gear can add is +2 (weapon plus relic), so a geared warrior's Attack is 6, not 12. Boss relics are the one place the caps break (Gatekeeper's Eye +2/+2, Warden's Seal +3 DEF/+8 HP) and they only drop from boss loot; more of them is the plan for making bosses worth it. Quest upgrades still add +1 to an item's main stat, run-local.


## 34. Authored maps, daylight and fog (routes as roads)

The procedural generator (#23) is parked on branch `overworld-procedural` and behind the title's
map toggle. Each screen is now a hand-authored ASCII layout (`src/data/maps`, legend in
`core/map/authored.ts`, drafted with `scripts/author-map.py`): three lanes of clearings joined
by roads, converging on the boss gate. Fights live only at nodes (`f` single, `x` elite duo),
guards and the gate; the road between is safe. Node and guard species are rolled per run from
the screen's roster, so layouts are fixed and contents are not. Steps spend a daylight budget
(2.5× the shortest entry-to-boss walk); after dusk plain nodes roll duos 60% of the time and the
shrine goes dark. Fog of war hides tiles never within 4 steps; only seen tiles can be tapped.
Tiles are 72 px (about 11×5 on a phone), steps take 190 ms, and the hero and enemies stand on
the map as their stills. Why: a fixed world can be designed for flow, landmarks and story, and
knowing where the harpies wait is player knowledge beating RNG; the daylight clock keeps
exploring a decision instead of free upside.

## 35. Dialogue with options at every encounter; the world remembers

Every node, guard, gate, signpost and the quest giver opens a speech box (`DialogueScene`) with a
few lines and two or three options. Writing is data (`src/data/dialogue.ts`); the rules are a
small pure module (`core/dialogue`): conditions read run flags, persistent relations, deaths on
this screen, the last killer, level, gold and daylight; effects set flags, nudge a relation, cost
or pay gold, HP or daylight, hand over a tome, and then start the fight or let you walk on.
Relations and deaths per screen live in meta (v5) so the world reacts across deaths: Knight
Andre's lines escalate with each death at his gate, the imp remembers the book, Gerald remembers
the dance. Screen 1's giver is Wren the rat-keeper; every rat pack killed on her screen costs
standing (double if you promised). Dialogue becomes skippable once the screen has been beaten;
Skip applies the default option of the whole chain. Why: the comparison with other card games
is unavoidable, so the uniqueness budget goes to characters who remember you dying.

## 36. Enemies you made: Wren at the gate, and your ghost

Two enemies exist only because of what the player did, both built at encounter time as ordinary
`Enemy` definitions (`core/variants`) handed to the fight through `PendingEncounter.custom`, so
the engine and the combat scene never special-case them. **Wren** takes Knight Andre's place at
the screen-1 gate once her standing is −2 or lower (two rat packs, or one after a promise); she
swings an attack named after your equipped weapon and gains its ATK, with a rat tide and a
Whistle (Weak) between. Beating her squares the account. **Your ghost** is left where the last
run died on this screen (nodes and guards; a gate death leaves none): your stats, your cards
turned into a rotation, pale blue, holding the hero's still. It joins the fight it fell in, in the
rear partner's place, and grows by one each time a run dies there again. Laying it to rest gives
back its gold (capped at 60) and one of the cards it died holding. One ghost per screen, in meta.
Why: deaths become content, the map gets a personal grudge on it, and the first "the world
reacted to me" moment arrives on the first return trip.

## 37. The node overworld: static network, random contents, tap to travel

Supersedes the free-walking parts of #34. Free-form walking felt wrong once fights lived only in
clearings, so the overworld is now a node network drawn over the authored terrain: tap a node, the
hero walks the road to it, arriving runs its task. The network per screen is authored
(`scripts/author-map.py`, every road junction is a node so a link never forks between nodes);
what each open slot holds is rolled per run from a bag (one shop, one shrine, a few treasures,
the rest monsters, about 40% of them unknown; dead ends take the calm types first). Fixed: the
start node (always the story chat), the mid-map quest node, the lost one, two elites, the boss at
the end. Node icons carry the risk: a known monster shows its still, an unknown one a question
mark with a skull, elites a bigger skull, the boss the biggest, quests a question mark. Rules: a
node can be passed through only once its task is done; fights are quiet once won; shops can be
revisited but do not restock; treasure and shrines are consumed once; any direction is allowed,
so quests can send you back. First quest arc: Wren at node 1, a fight at node 2, Wren comments on
it, Tam the tinker at node 3 re-arms node 2 with "the brother" (a bigger pair), the reward on
return. Daylight, fog of war, signposts and the procedural toggle are gone from play (the
generator stays in the tree and on branch `overworld-procedural`). Inspiration: Puzzle Quest's
overworld, kept simpler.

## 38. Bind Wound is once per fight

The first full node-map playthrough (ASH-ELK-4673, 11 fights, no deaths) took 129 damage and
healed 80 of it back, 7 Bind Wound plays doing most of that. Duos were the only fights that hurt
(108 of the 129) and they ran 7–11 rounds, long enough for the deck to cycle and the heal to come
round twice or three times. Bind Wound is now once per fight: still the emergency button, no longer
a loop. Two copies in the deck still mean two heals. If duos still feel soft after this, the next
levers are the shop heal price and the shrine healing half rather than full.

## 39. Painted overworld backdrops; sustain nerfs

Each screen can carry one painted map (`public/art/c/map<N>.jpg`, texture `map_<N>`); when it
exists it replaces the tileset and props for that screen, and the node markers, hero and ghost
stand on it. Pipeline (docs/ART.md): `scripts/layout-image.py` renders the ASCII layout at
in-game size, the painting is generated image-to-image from it, then the dev overlay
(`?dev` or `localStorage rerpg:dev=1`) draws the code's roads over the painting and the ASCII is
moved to match. Screen 1 is painted; the tileset still draws screen 2 until it is.
Sustain, after the first node-map playthrough healed back most of the duo damage: Bind Wound
heals 25% (was 35%) and is once per fight (#38), the shop heal restores 35% (was 50%), the
shrine heals half (was full).

## 40. Status timing is pinned; the card headline is what will land

Play report: the Shell Beetle "took reduced damage before HARDENED showed". The audit (engine
event log, then Playwright at 844×390 on the beetle, Hex Imp, Adept Necromancer, Boar, a
beetle–boar duo and a Shield Bash run; screenshots in `docs/audit/status-2026-10-26/`) found
the engine and the chips in step all along. What was wrong was the card: it said 4 while the
beetle's DEF 1 made every hit land 3 from round 1, and 2 during the hardened turn, so the
"early" reduction was armour and the hardened turn read as a second, unannounced one. The only
chip oddity is a count flip: a turns-2 self-buff shows HARDENED 2 during the enemy's turn and
HARDENED 1 from the next round start, because every timed status ticks at the end of the round
it was applied in. That stays: the chip shows the engine's number at that moment.

The rules, pinned by `src/core/combat/status.test.ts`:
- A round is: you act → each living enemy acts → enemy statuses tick → yours tick → next round.
  `turns` counts those end-of-round ticks, and a status applied mid-round ticks at that round's
  end whoever applied it. Counted in your turns: your self-status with turns 1 covers this
  round's enemy attacks only (Broadsword's Exposed); turns 2 covers this round and your next
  turn (Shield Bash's Weak, Bind Wound's Exposed); a status you put on an enemy with turns 2
  covers your next turn (Exposing Strike, Stagger); an enemy's self-buff with turns 2 covers
  your next turn (Shell, Brace, Scatter; Brace and Scatter are also spent by the hit); an
  enemy's debuff on you with turns 2 covers the next round, your turn and its attack (Hex, the
  imp's Weak).
- Guard, Ward and Chill never tick: hits and actions spend them. Burn and Curse deal their
  damage at every tick, the first at the end of the round they were cast in, so "Burn 2 for 2
  rounds" is two ticks. Aegis ticks like the rest. Recovering with turns N skips N turns.
- The log carries `statusApplied` and `statusExpired` where they happen and `roundStart` after
  all ticks; the scene draws chips from those events, so the chips at a round start are exactly
  the engine's statuses for that decision. A chip's number is ticks left.
- The card headline is what the chosen target will take now (the body text keeps the card's own
  number, #17 still holds there): `previewDamage` runs the card's hits through `computeHit`
  against the target with the statuses the playback has shown so far, spending Aegis, Guard and
  Ward in order. The unit names why it differs: "2 damage · armour, hardened", "0 blocked ·
  guarded". Tapping another enemy redraws the hand. Enemy intent numbers stay "if every hit
  lands": whether you Guard is your own call, so your Guard is not subtracted from them.

## 41. The warrior's families cost a point each

To put the level-up and heirloom systems under test, Bulwark and Berserker are no longer free:
each costs one skill point, so a fresh warrior runs on the basics and the general tomes
(Warding Blast, Mighty Blow, Stand Firm, Last Strike, Final Stand) until level 2 (30 EXP, about
three kills), buys a family between runs, and only then sees a heirloom spread. A run with no
family has no spread and goes straight to the overworld; its label reads "basics only". Wizard
and Shaman keep both families free for now. Meta v6 takes back the warrior nodes that v5 handed
out for free (nothing was ever bought before, so nothing is lost) and keeps the points already
earned, so an existing level-3 warrior arrives with two points to spend on exactly these two
nodes. A family bought during a run (from the overworld or a reward screen) joins the run at
once: its tomes drop from the next reward on and the run is saved with it; the shop keeps its
stock until the next screen.

## 42. Nothing drops without a node; Mighty Blow and Stand Firm are once per screen

The first fresh run after #41 (IRON-CROW-8003) said the lock did not bite: the general tomes
were ungated and stronger than either family. Mighty Blow came out of the second chest, was
played in 7 of the next 9 fights, and one-shot every 11-HP enemy on the screen, so six singles in
a row cost 3 HP; the three duos did 39 of the 46 pre-boss damage. Selling five unwanted offers
paid for the shop heal and a Last Strike.
- **The general tomes are family cards.** The attack pair (Mighty Blow, Last Strike) sits in each
  class's damage family (Berserker, Pyromancy, Stormcaller), the defence trio (Warding Blast,
  Stand Firm, Final Stand) in its defence family (Bulwark, Cryomancy, Spiritcaller). The loot
  pool, the shop and the heirloom spread draw from the run's families only, so a warrior with no
  node finds no tomes at all. `familyOf(classId, skillId)` names a tome's family for a class.
- **Basics are per class.** Warrior: Attack, Attack, Defend. Wizard: Attack, Attack, Ward.
  Shaman: all four. A warrior's answer to magic is Bulwark (Warding Blast, Stand Firm, Final
  Stand), not a free Ward every fight. The engine's default stays the full four for tests.
- **Every special tome is fleeting.** Mighty Blow and Stand Firm were briefly "once per screen";
  that was a second rule for the same idea, so they are fleeting like Last Strike and Final
  Stand: the tome is destroyed when played, one copy per play. Rare rarity stays. The question
  the run already asked about Last Strike (the duo, or the boss?) now applies to all four. The
  engine keeps once-per-fight, but no card uses it.
- **Duos at 30% on screen 1** (was 20%), because duos are where the HP goes.
- **Selling pays 25%** of shop price (was 40%). Selling stays so no reward is dead (#4), but it
  no longer converts a spare vest into a third of a heal.
Not taken: gear max HP as a heal stays (the user chose to keep it). The sim gauntlet now drops
fleeting tomes from its deck once played and uses the class basics; see BALANCE.md.

## 43. The card sheet is the editing surface; warrior families cost two points

Only the warrior is being balanced; wizard and shaman are out of scope until it is done. Cards,
families and tree nodes now live in `src/data/cards.json`, and `scripts/cards-xlsx.py` turns it
into `docs/cards.xlsx` and back (`export` / `import` / `check`). The sheet has one row per card
with its family (the tree node that drops it), rarity, uses and up to three effects in a small
language ("damage 100% +4", "self guard 1", "enemy burn 2 for 2 rounds"), a Skill tree sheet
with costs and prerequisites, and a How-to sheet. The round trip is byte-identical; an edited
sheet is imported with one command and `npm run check` then says what the numbers broke.
Bulwark and Berserker cost two points each (was one, #41): the second fresh run under #42
bought its first family after three kills and reached Wren with a full Berserker deck; at two
points the first family lands at level 3, about seven kills in.

## 44. One card model, a card editor in the game, and a mechanical import

The spreadsheet of #43 asked the designer to think in percentages and a mini-language; it lasted
one message. Replaced by a model every card shares (`docs/CARDS.md`): damage as percent of class
attack plus a flat bonus, hits, type, ignore-defence, drain, and the target shape; heal; and
links into a modifier lookup, where a status with fixed numbers (Tiring = self Weak 2 rounds) is
defined once and linked from any card. Families own membership and the tree owns costs. The
game compiles the records into engine effects at load; the engine did not change for this,
except for the first new capability built the way all future ones will be: a damage effect may
target every living enemy (`targets: all`), with the sweep running front to back and the card
headline showing the total.
The editor is a page reached from the title screen, phone first: test attack, test gear and
target DEF drive a computed number per card through the engine's own formula; tabs for cards,
modifiers and the tree; an export button. It never changes the game on the device: the file it
exports is imported by a fixed procedure (validate against the committed file, run the checks,
update only pinned numbers, re-run the sim, commit) written so a cheaper model can do it without
judgement. Shipped card ids are permanent (retire by removing the family); basics and the other
two classes are frozen by the validator. The sheet and its script are gone.

## 45. The starting deck is the designer's too

The first editor export built Bellow as a basic card and it arrived in no deck: the editor had
no control over which cards are dealt every fight, and the import rules froze the basics lists
outright. Now the Skill tree tab edits the warrior's starting deck (cards and copies), a card
can be made basic on the Cards tab, and the validator allows the warrior's deck to change while
keeping the shared basics (Attack, Defend, Ward, dealt to every class) and the other classes'
decks frozen, and rejects a basic-rarity card that is in no deck. Bellow (0% +1, ignores
defence, every enemy) joins the warrior's starting deck beside Attack ×2 and Defend, as it was
meant to.

## 46. The warrior tree: Shadow Knight, Paladin, Weaponmaster

Three more families, laid out as a tree: Berserker unlocks Shadow Knight (2 points), Bulwark
unlocks Paladin (2 points), and Weaponmaster (1 point) needs both and is the last warrior
family. All three are empty until the designer fills them in the card editor; an empty family
is legal and buys nothing yet. The skill tree screen now draws nodes in tiers by prerequisite
with a link from each node to what it unlocks, and a detail panel for the tapped node with its
cards and the Unlock button; a locked node says which family it needs by name.

## 47. A sweep lands on every enemy at once

Play report: Spirit Boomerang hit the first enemy twice, then the second twice, one after the
other. A card that hits every enemy should hit them together. The engine now resolves a sweep
(`targets: all`) hit by hit: hit 1 on every living enemy front to back, then hit 2, and so on;
Scatter and drain still settle per enemy after its last hit. Every event of hit N (the damage,
a Guard or Ward it spends, a Brace counter it draws) carries `volley: N`, and the combat scene
plays each volley as one beat, one sequence per enemy running in parallel, so the numbers and
HP bars of all targets move at the same moment. Single-target cards carry no volley and play as
before. The outcome of a fight does not change (the sim table is identical); only the order of
events and their playback do. Pinned by the multi-hit sweep test in `engine.test.ts`; screenshots
in `docs/audit/sweep-2026-10-27/`.

## 48. Remove guard and remove buffs: a modifier that takes away, before the hit

The designer asked for a card attribute that strips the enemy's buffs, so Bellow can break
every Guard and still land in the same turn. It is a modifier like the others, so any card can
link it from the editor: the modifier's status list gains `remove_guard` (takes Guard) and
`remove_buffs` (takes every status that helps its holder: Guard, Ward, Aegis, Hardened, Braced,
Scattered). A removal is always on the enemy and has no rounds, amount, chance or magic; the
validator rejects any of those, and the editor hides them.
- **It runs first.** The compiler puts a removal ahead of the card's damage whatever its place
  in the modifier list, so the hit that follows meets no Guard. The card text reads it first
  ("Remove every enemy's Guard first. Deal 1 damage to every enemy…").
- **It follows the damage's targets.** On a card that hits every enemy it strips every living
  enemy, as one beat (volley 0, #47); otherwise only the chosen enemy. A card with no damage
  strips the chosen enemy.
- **It is never blocked**: a Ward does not stop a removal, and it leaves debuffs alone.
- The engine has a new `strip` effect; each status it takes is a `statusExpired` event marked
  `stripped`, which the scene calls out ("GUARD removed"). The card headline in combat already
  assumes the strip, so a Bellow that will break a Guard shows the damage that will land, not
  "0 blocked".
No card links a removal yet: the modifier is made and linked in the editor, then imported.
Pinned by the strip tests in `engine.test.ts` and `data.test.ts`; screenshots in
`docs/audit/strip-2026-10-27/` (taken with a throwaway build that linked one to Bellow).

## 49. The ghost is rare; a level is +1 max HP and a rare card or gold

Designer's call after play: your ghost should not wait at its clearing every run, and a level-up
should give something beyond a skill point.
- **The ghost walks in on one run in ten.** `GHOST_CHANCE = 0.1`, rolled per run and screen from
  the run seed (`ghostAppears`), so the map marker and the fight always agree and a reload keeps
  the answer. On the other nine runs the ghost record stays in meta, unseen, until a later run
  meets it or a new death replaces it.
- **Every level past the first is +1 max HP for good** (`LEVEL_HP`), per class: a new run's base
  includes it, and a level gained mid-run adds it to the run at once, HP included.
- **Each level also rolls a reward**: 25% a rare card (`LEVEL_RARE_CHANCE`) from the run's
  families straight into the deck, otherwise 15 gold (`LEVEL_GOLD`). With no family, no rare card
  left in the pool (two copies held) or a full deck, it is the gold. Nothing drops without a node
  (#42) still holds. The level-up banner names what came: "+1 max HP · Mighty Blow".
The numbers are first guesses for the designer to tune. Pinned by `session.test.ts` and
`variants.test.ts`; screenshots in `docs/audit/levelup-ghost-2026-10-27/`.

## 50. Luck: critical hits, bonus turns and rarer finds

The designer asked for a new player stat, luck, used three ways. One unit throughout: **each
point of luck is 1.2%**.
- **Critical hit.** One roll per damage card you play: luck × 1.2% chance that every hit of that
  card lands at +50% (rounded up, after armour, before blocks; a sweep crits every enemy). The
  card headline stays the normal number; the crit is a surprise.
- **Bonus turn.** After a card resolves, a second roll: luck × 1.2% chance the enemies wait and
  you play again this round (no ticks, no new card). At most once per round, never on an empty
  hand, never from holding or skipping.
- **Rarer finds.** Luck × 1.2 is added to the rare weight of every reward source and the shop
  (the weights sum to about 100, so it reads as percentage points), and luck × 1.2% to the
  level-up rare chance of #49.
- **Fanfare.** A crit is a camera shake, a gold "CRITICAL HIT! every hit +50%" callout with
  sparks, then big gold numbers with "!"; a bonus turn is a green flash, a "BONUS TURN! play again
  before they move" callout, and the phase line reads "YOUR TURN · BONUS".
- **Where luck comes from.** Every class starts at 5 (6%); gear can carry luck (`stat.luck` in an
  item mod), though no item does yet. Luck shows beside ATK and DEF on class select, the reward
  and shop status lines and Test Mode. Luck 0 rolls nothing, so fights without luck replay exactly
  as before. Wizard and shaman get the same 5; their card data is untouched.
The sim passes luck through now (BALANCE.md, 2026-10-27 Luck). Pinned by the luck tests in
`engine.test.ts`, `loot.test.ts` and `session.test.ts`; screenshots in `docs/audit/luck-2026-10-27/`.

## 51. Backfire: a card that costs you if it does not kill

Death Touch (Shadow Knight: 500%, ignores defence, drain 40%, fleeting) came with a note asking
for a new modifier: if the card does not kill its target, it damages you for your max HP. It is
a modifier status like the others, `backfire`, on yourself, with one number: `amount`, the
percent of max HP it costs (1-100; 100 reads "If the target survives, you lose all your HP.").
- **When.** The compiler puts it after everything else on the card, so the damage, drain and
  any crit have landed first. If the chosen target is still standing (any enemy the card struck,
  for a card that hits every enemy), you lose that share of max HP. A kill costs nothing; a
  different enemy surviving a single-target kill does not count.
- **Nothing stops it.** No Guard, Ward or Aegis: it is the price of the card, not a hit. At
  100% it is the gamble of your life, so the headline (the damage it will do, #40) is what the
  player reads to decide.
- **Fanfare.** A shake, a purple flash, the HP loss in big purple numbers and a "BACKFIRE! it
  survived, and the spell turns on you" callout.
- The editor offers it in the status list ("backfire (if the target survives)") with one field,
  max HP lost (%); the validator requires it on yourself with an amount.
Imported with the designer's export of the same day; the Backfire modifier (100%) was added and
linked to Death Touch at their request, in the file, as the card's note asked. Pinned by the
backfire tests in `engine.test.ts` and `data.test.ts`; screenshots in `docs/audit/backfire-2026-10-27/`.

## 52. Crits and bonus turns are 1% at base luck

Designer's call after play: critical hits and lucky extra turns came far too often. At luck × 1.2%
a base-luck hero rolled 6% per card for each, and a fight is many cards. Now each point of luck
is 0.2% (`LUCK_PER_POINT`), so base luck 5 is 1% per card for a crit and 1% for a bonus turn. The
rare-odds part of #50 (luck × 1.2 rare weight, luck × 1.2% on the level-up roll) is unchanged.
The sim is back within a point of the luck-0 table. Pinned by the luck tests in `engine.test.ts`.

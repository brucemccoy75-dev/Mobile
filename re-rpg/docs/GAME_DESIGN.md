# Re-RPG — Game Design (POC scope)

Pitch: a roguelike RPG for phones in landscape. Pick a class, explore a randomised open-feeling map, fight turn-based side-view battles, loot binding equipment and skill tomes, die, and come back stronger because everything you discovered now feeds future runs. Replay power fantasy through RNG set rolls and loot synergy, not grinding.

## 1. The loop

```
Title → Class select (set rolled) → Screen 1 overworld
   ↳ random encounter / guard fight → Combat → Reward (binding choices) → back to map
   ↳ chest / shop / shrine
   ↳ Boss 1 → Screen 2 (harder) → Boss 2 → Victory
Death at any point → Death summary (what you discovered) → Title
```

POC "win" = kill Boss 2. Expected first-run outcome = die before Boss 1.

## 2. Classes

| Class | HP | Identity | POC sets (one rolled per run) |
|---|---|---|---|
| Warrior (open) | 25 | Melee, armor, attrition | **Tank**: Shield Bash (dmg + Guard), Bind Wound (heal, Recovering) · **DPS**: Broadsword Strike (160%, overextends: Exposed this round), Exposing Strike |
| Wizard (unlock: win as Warrior) | 20 | Burst, self-risk | **Fire**: Fireball, Inferno (ultimate, leaves caster Exposed) · **Frost**: Frost Bolt (chance to Chill = enemy skips a turn), Ice Armor (temporary def) |
| Shaman (unlock: win as Warrior) | 20 | Sustain + nature damage over time | **Spirit**: Mend (heal), Spirit Lash (damage + heal small %) · **Storm**: Lightning (damage, ignores part of def), Static Field (Burn-like damage over time) |

Shaman is deliberately the "healer with teeth" so the three classes read as tank / burst / sustain. Base stats: everyone starts with the basics Attack and Defend, an empty skill deck, no equipment, atk 4 / def 0, so an unequipped run is meant to be fragile.

## 3. Skills: the dealt hand

Known skills form a **deck** (cap **6**). Every encounter:

1. Shuffle the deck.
2. Round 1 deals a full hand of 3 (or the whole deck if smaller), then one card per round. **Hand cap 3.**
3. Once the hand is full, each new round still deals one and the **oldest card in hand is discarded**. Holding skills is punished.
4. A played skill goes to the **discard pile**. When the deck is empty the discard is reshuffled.
5. **Attack** (×2) and **Defend** (×1) are shuffled into every fight's deck on top of the run deck and do not count against the cap. There is no always-available button: a hand of three Attacks when you needed a block is the game.
6. **Hold**: discard one card to pass the turn. The out for a trap turn (a braced enemy and a hand of strikes); it costs the card and the tempo, so it is never the default.
7. **Copies**: a deck holds at most 2 of any tome. Two Broadswords make the strike frequent; the brace makes that a risk, not a free lunch.

Tomes add a skill to the deck. At the cap, a tome forces a binding swap or a skip, the same rule as equipment. Big-hit skills scale with a **flat bonus** (Broadsword 100% + 4, Inferno 100% + 10) so gear does not multiply them. Later knobs: a stamina meter for multi-play turns, deal 2 per round in long fights, "+1 deck size" and "+1 hand size" as item stats.

Healing skills honour the HP-drain rule: they are rare in the pool and cost tempo. Bind Wound and Mend heal 40% and apply **Recovering**: you skip your next two turns while the enemy keeps acting, so a heal is a bet on surviving two free hits.

Skills are data: `effects[]` of damage(mult), heal(flat/%), applyStatus(target, id, turns), guard, and `selfStatus`.

POC statuses: **Exposed** (takes 2x damage), **Guard** (blocks the next hit; stacks to 3), **Burn** (N dmg at end of round), **Chill** (skip next action), **Weak** (deal half damage), **Recovering** (player skips their turns while it lasts), **Braced** (enemy: the next hit that lands is countered), **Scattered** (enemy: the next single hit does half), **Cursed** (DoT at end of round and healing halved). Durations count end-of-round ticks: a status applied on the player's turn with 1 turn covers the enemy's action that round; a self-status the enemy applies on its own turn needs 2 turns to be exploitable next round.

## 4. Equipment

Three slots: body, weapon, relic. No inventory. Finding a better item means replacing a worn one on the spot via a compare panel (old vs new, stat deltas coloured). Skip is allowed. Relics are the wild cards (big upside with a downside, e.g. +5 atk / −8 max HP) and the primary synergy hook later (triggers like "on heal: deal damage equal to amount healed").

Rarity: common / uncommon / rare / boss. Rarity gates the modifier budget, not just numbers. **Attack budget** (DECISIONS #13): common +1 free, uncommon +2 with a cost, rare +3 with a cost, relics pay in HP for anything more. POC content: 22 items in `src/data/items.ts`, several class-limited and set-tagged so the affinity weighting has something to bite on. Equipping moves current HP by the max-HP delta, so a +6 amulet is 6 real HP and a −10 idol is a real wound.

## 5. Loot & pools (the replay engine)

**Per-run pool** = the rolled set's 2 skills + everything in `MetaState.discovered*` for that class + class-agnostic items, **minus equipped items** (a slot holds one). Tomes may repeat: a second copy of a skill in the deck makes it come up more often, which is the deck-building lever.

Rules:

1. **Discovery**: an item/skill becomes discovered the first time it is picked up (not merely seen). Death does not undo it.
2. **Offer, don't grant**: rewards show **pick 1 of 2** (3 for chests/bosses). A growing pool with blind single drops would dilute; choice makes a bigger pool feel like power. Enemies still drop gold on top. Any offered reward can be **sold** instead (≈40% of its shop price) and still counts as discovered, so a reward screen never feels wasted.
3. **Set affinity weighting**: items tagged with the active set get 2x weight. This is how synergy emerges without hand-scripting.
4. **Depth scales rarity**: encounter distance from the entry and screen index shift the rarity curve. Guards > randoms, chests > guards, bosses > chests. Boss drops always include a rare.
5. **Heirlooms**: from the first death onward, each new run opens with a **spread of up to 4 random unlocks** for the class (weighted toward the rolled set) and the player **keeps 2**. This is the direct "previous unlocks make you stronger faster" mechanic and the main pacing knob for "a few deaths then you reach the boss". Spread size and pick count are the later knobs.
6. Later: discovered sets become rollable at class select; set tiers (Tank I → Tank II) widen the pool.

## 6. Enemies (POC roster)

Enemies are designed as *answers* to kits so set identity matters:

| Archetype | Screen 1 | Screen 2 | What it tests |
|---|---|---|---|
| Brute | Boar | Ogre | Telegraphed big hit → Defend / Chill timing; **Brace** throws the next landing hit back |
| Armored | Shell Beetle | Iron Knight | High def → Exposing Strike / Lightning shine |
| Caster | Hex Imp, **Adept Necromancer** | Witch | Applies Exposed/Weak to player → sustain and tempo. The Necromancer **Curses** (DoT, healing halved) and **Lifetaps** (drains HP to heal itself): the first enemy magic |
| Swarm (single sprite, multi-hit) | Rat Pack | Harpies | Many small hits → Guard efficiency, Burn value; **Scatter** halves the next single hit |
| **Boss 1 Gatekeeper** | 3-turn cycle: Guard → Crush (2 hits, so one Defend only halves it) → Stagger (Exposed). Reads as a rhythm puzzle. | | |
| **Boss 2 Warden** | Two phases: Slash/Guard/Smash, then at half HP Rend (3 hits)/Curse (Weak)/Smash. | | |

One enemy per encounter for POC (multi-target adds UI and AI scope). **Intent**: the exact move for the current round is shown above the enemy (icon + number), plus a posture tell for the round after. Enemy move sets are sequences or weighted tables so the engine always knows one step beyond the shown intent.

## 7. Overworld rules

- Each screen: entry west, boss arena east, main road between. 1 shop, 2 chests, 1 shrine placed off-road behind danger tiles and a visible guard. POIs are spread west→east in bands; each costs at least 8 danger-weighted steps from the road.
- Threat meter numbers: road 0, grass 0.08, forest 0.2, swamp 0.3 per step; fires at 1.0 and resets to 0–0.35. Screen 2 multiplies by 1.3.
- Open UX item: the camera only follows the player, there is no drag-to-pan, so far tiles are reached by walking in legs. Revisit after phone testing (candidates: drag-to-pan with a tap threshold, or a zoomed-out minimap toggle).
- Encounter roll per tile entered, by tile type. A threat meter shows accumulated risk.
- **No healing after fights.** HP is a run resource and HP drain is the main death driver. Sources: shrine (one use per screen, full heal), shop (buy heal, expensive), rare taxed healing skills, relics with a downside. Boss kill = full heal and screen transition.
- No fleeing in POC. Route choice is the escape mechanism.
- Gold: dropped by enemies (4–8 per kill, 8–14 per guard, 30 per boss, chests by path cost), reset on death. Shop stock per screen: 2 items, 1 tome when the pool has one, and a 50% heal once per shop. Prices: common 20, uncommon 35, rare 60, boss 90 (tomes +10), heal 30, all × screen number.

## 8. Death & meta

Death screen shows: cause, how far you got, **newly discovered** entries (highlighted), total pool size, and the run seed. Death count gates early unlocks:

- Death 1: second set for the class becomes rollable (so run 2 can feel different).
- Death 2+: heirloom active (if anything discovered).
- Future: death milestones unlock new sets / relic slots.

## 9. Decisions

All planning questions are resolved; see `DECISIONS.md`. Remaining later knobs: heirloom slot growth, stamina meter, deal rate in long fights, set tiers.

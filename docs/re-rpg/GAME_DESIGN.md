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
| Warrior | 25 | Melee, armor, attrition | **Tank**: Defend, Bind Wound · **DPS**: Broadsword Strike, Exposing Strike |
| Wizard | 20 | Burst, self-risk | **Fire**: Fireball, Inferno (ultimate, leaves caster Exposed) · **Frost**: Frost Bolt (chance to Chill = enemy skips a turn), Ice Armor (temporary def) |
| Shaman | 20 | Sustain + nature damage over time | **Spirit**: Mend (heal), Spirit Lash (damage + heal small %) · **Storm**: Lightning (damage, ignores part of def), Static Field (Burn-like damage over time) |

Shaman is deliberately the "healer with teeth" so the three classes read as tank / burst / sustain. Base stats: everyone starts with Attack only, no equipment, atk 4 / def 0, so an unequipped run is meant to be fragile.

## 3. Skills

- Each run holds **4 skill slots**: Attack (permanent) + 3 learned. Picking up a tome when full forces a swap or a skip. Binding, like equipment.
- **Limiter: cooldowns**, no mana for POC. Attack has none. Set skills have 1–3 turn cooldowns; ultimates 4–5 plus a self-cost. Cooldowns make "which skill now" the whole fight without a second resource to teach.
- Skills are data: `effects[]` of damage(mult), heal(flat/%), applyStatus(target, id, turns), guard, and `selfStatus`.

POC statuses: **Exposed** (takes 2x damage, 2 turns), **Guard** (block next hit), **Burn** (N dmg per turn), **Chill** (skip next action), **Weak** (deal half damage).

## 4. Equipment

Three slots: body, weapon, relic. No inventory. Finding a better item means replacing a worn one on the spot via a compare panel (old vs new, stat deltas coloured). Skip is allowed. Relics are the wild cards (big upside with a downside, e.g. +5 atk / −8 max HP) and the primary synergy hook later (triggers like "on heal: deal damage equal to amount healed").

Rarity: common / uncommon / rare / boss. Rarity gates the modifier budget, not just numbers.

## 5. Loot & pools (the replay engine)

**Per-run pool** = class basics (the rolled set's 2 skills, 2–3 starter items) + everything in `MetaState.discovered*` for that class + class-agnostic discovered items.

Rules:

1. **Discovery**: an item/skill becomes discovered the first time it is picked up (not merely seen). Death does not undo it.
2. **Offer, don't grant**: rewards show **pick 1 of 2** (3 for chests/bosses). A growing pool with blind single drops would dilute; choice makes a bigger pool feel like power. Enemies still drop gold on top.
3. **Set affinity weighting**: items tagged with the active set get 2x weight. This is how synergy emerges without hand-scripting.
4. **Depth scales rarity**: encounter distance from the entry and screen index shift the rarity curve. Guards > randoms, chests > guards, bosses > chests. Boss drops always include a rare.
5. **Heirloom**: once the player has discovered anything, each new run starts with **one random discovered item or tome**. This is the direct "previous unlocks make you stronger faster" mechanic and the main pacing knob for "a few deaths then you reach the boss".
6. Later: discovered sets become rollable at class select; set tiers (Tank I → Tank II) widen the pool.

## 6. Enemies (POC roster)

Enemies are designed as *answers* to kits so set identity matters:

| Archetype | Screen 1 | Screen 2 | What it tests |
|---|---|---|---|
| Brute | Boar | Ogre | Telegraphed big hit → Defend / Chill timing |
| Armored | Shell Beetle | Iron Knight | High def → Exposing Strike / Lightning shine |
| Caster | Hex Imp | Witch | Applies Exposed/Weak to player → sustain and tempo |
| Swarm (single sprite, multi-hit) | Rat Pack | Harpies | Many small hits → Guard efficiency, Burn value |
| **Boss 1 Gatekeeper** | 3-turn cycle: Guard → Big Hit → Exposed self. Reads as a rhythm puzzle. | | |
| **Boss 2 Warden** | Two phases, summons a swarm at half HP, applies Weak. | | |

One enemy per encounter for POC (multi-target adds UI and AI scope). Intent is visible above the enemy every turn.

## 7. Overworld rules

- Each screen: entry west, boss arena east, main road between. 1 shop, 2 chests, 1 shrine placed off-road behind danger tiles and a visible guard.
- Encounter roll per tile entered, by tile type. A threat meter shows accumulated risk.
- **No healing after fights.** HP is a run resource. Sources: shrine (one use, full heal), shop (buy heal), Bind Wound/Mend, relics. Boss kill = full heal and screen transition.
- No fleeing in POC. Route choice is the escape mechanism.
- Gold: dropped by enemies, reset on death. Shop sells 2 items + 1 heal, prices scale with screen.

## 8. Death & meta

Death screen shows: cause, how far you got, **newly discovered** entries (highlighted), total pool size, and the run seed. Death count gates early unlocks:

- Death 1: second set for the class becomes rollable (so run 2 can feel different).
- Death 2+: heirloom active (if anything discovered).
- Future: death milestones unlock new sets / relic slots.

## 9. Open questions (need decisions)

1. **Set roll semantics**: does the rolled set define the run's tome pool only (tomes still have to drop), or do you start the run with one set skill in hand? Draft assumes pool-only plus heirloom later.
2. **Skill slots**: 4 total ok? Alternative is 3.
3. **Enemy intents** visible (StS) or hidden (FF)? Draft assumes visible; it makes Defend/Chill/Guard real decisions.
4. **Pick-1-of-2 vs single blind grant** on kills. Draft picks choice. Chests/boss 1-of-3.
5. **Healing model**: no auto-heal between fights (draft) vs partial heal on screen clear.
6. **Multi-enemy fights**: out of POC. Confirm.
7. **Flee**: out of POC. Confirm.
8. **Deploy target**: replace the map3d gh-pages site or deploy under a subpath.

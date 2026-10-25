# Re-RPG — Balance Baseline (after phone test 3)

Produced by `npm run sim` with the greedy intent-reading policy (`src/core/sim/policy.ts`). Re-run after any numbers change and replace the tables. Gauntlet = 4 random fights of the screen's tier, HP carried over, no healing between fights, then the boss.

Loadouts: **fresh** = Attack/Defend only, empty deck. **Set** = the two set tomes in the deck. **gearN** = a full three-slot kit for screen N (`GEAR_KIT` in `src/core/sim/gauntlet.ts`). The sim does not model loot choice, relics or 4-card decks, so these are floors, not expectations.

## Targets (DECISIONS #1, #6)

- Fresh runs should almost never reach Boss 1. ✅ (≤ 5%)
- A run that found both set tomes should reach Boss 1 often but beat him only with the right read. ✅
- Set + screen-1 kit should beat Boss 1 most of the time. ✅ for guard-bearing sets; ❌ Berserker and Stormcaller (pure damage, no block) still lose the rhythm fight.
- Screen 2 should need screen-2 gear and a bigger deck. ✅ for Bulwark, Cryomancy, Spiritcaller; ❌ pure damage sets vs the Warden.

## Changes after phone test 6

- **Armoured enemies harden instead of guarding**: Shell Beetle's Shell and Iron Knight's Brace Plate halve incoming damage for a turn rather than blocking a hit outright. No more wasted swings into a shell, so the beetle stops being a 20-round fight; fresh-run death causes shift away from it.

## Changes after phone test 5

- **Heals cost Exposed again, not turns**: Bind Wound / Mend heal 35% and leave you Exposed for 2 rounds. Under greedy play this makes Bulwark the clear boss-killer of screen 1 (set alone beats the Gatekeeper ~77%), because the heal is free on his guard and stagger rounds and that is exactly the read a tank should be making. Variants tried: 40%/2 (88%), 30%/2 (68%), any heal with Exposed 3 (0%: the policy heals into the Crush). Watch whether it feels earned on the phone.

## Changes after phone test 4

- **Adept Necromancer** joins screen 1 (16 HP, Curse 1 per round for 4 rounds with healing halved, Lifetap drains and heals it). A first cut at 18 HP / Curse 2×3 made it the top killer of the Bulwark set under greedy play (halved Bind Wound into two skipped turns), so it was softened before shipping.
- Wizard and Shaman are locked until a warrior win; the sim still runs all three for tuning.

## Changes after phone test 3 (power curve)

- **Attack gear budget** (DECISIONS #13) and **flat big hits** (#14): a +5 warrior with Broadsword no longer one-shots screen 1.
- **Enemy HP up**: Boar 20, Beetle 14 (DEF 2), Imp 16, Rats 18, Gatekeeper 48; Ogre 34, Knight 26 (DEF 4), Witch 24, Harpies 26, Warden 58. Double shells were tried and reverted: they stall the fight rather than shape it.
- **Brace** (Boar, Ogre) and **Scatter** (Rats, Harpies) punish single big hits; **Hold** is the out. Sim policy plays guard/multi-hit into a brace, holds only when even a small hit would be ruinous.
- **Tome copies capped at 2.**

Shape under greedy play: fresh reaches boss 24–36% / beats 0%; set alone beats 0–21%; set + screen-1 kit beats Bulwark 70, Cryomancy 92, Pyromancy 26, Spiritcaller 13, Berserker 6, Stormcaller 4. The pure-damage sets now need the stagger window and a real block to beat the Gatekeeper, which the greedy policy does not plan for; a heirloom pair and a second copy of the strike are the intended route. Watch Berserker on the phone: if it feels unwinnable rather than demanding, Gatekeeper 48 → 44 is the first knob.

## Changes after phone test 2

- **Broadsword Strike** 200% → 160% with a self-Exposed round (it one-shot most of screen 1 with any weapon). Tier-1 HP +2 across the board (Boar 16, Beetle 12, Imp 12, Rats 14) so a geared hero needs two hits, not one.
- **Heirloom from the first death** (was second).

## Changes after phone test 1

- **Opening hand of 3** (was 1, then 2, then 3): round 1 is a choice. Sim policy also learned to strip an enemy guard instead of turtling into it, which had produced fake 50-round stalemates.

- **Attack/Defend are cards** (2 + 1 in every fight's deck). Blocking now depends on the draw, which made both bosses far harder; Gatekeeper Crush went 2×1.3 → 2×1.0, Warden Smash 2.0 → 1.6 (phase 2: Rend 3×0.6, Smash 2.0).
- **Defence floor**: a hit is never reduced below half. Shell Beetle 12 HP / DEF 3 → 10 / 2, Iron Knight DEF 5 → 4. Trash fights went from 15–20 rounds to 3–6, so fresh runs now reach Boss 1 15–35% of the time and die there (0% beat), which is the better place to die.
- **Recovering heals**: Bind Wound / Mend heal 40% and skip two turns. The sim policy only heals when the heal outweighs two enemy hits.

Resulting shape (with the opening hand of 3): fresh reaches boss 13–32% / beats 0%; set alone beats 0–34%; set + screen-1 kit beats 30–99% (Bulwark 93, Berserker 97, Cryomancy 99, Pyromancy 74, Spiritcaller 30, Stormcaller 37). Screen 2 with the screen-2 kit: 33–96% except Stormcaller (6%).

## Changes made in the milestone 5 pass

1. **Shaman**: DEF 0 → 1, Spirit Lash lifesteal 25% → 50%, Mend's Weak 2 rounds → 1. Spiritcaller reach went 9% → 59%, Spiritcaller+gear1 beat 87% → 92%.
2. **Cryomancy**: Frost Bolt Chill 50% → 65%. With the policy fix below, Gatekeeper beat rate 0% → 79% (set only).
3. **Warden**: 60 HP / DEF 3 → 50 HP / DEF 2, a Stagger added to the phase-1 cycle, Rend 3×0.8 → 3×0.7.
4. **Sim policy**: plays a guard card that covers every hit of a multi-hit wind-up (Ice Armor vs Crush) and stops wasting Chill on non-attack rounds. These were policy flaws masquerading as balance problems.

## Still open

- **Pure damage sets vs bosses** (Berserker, Pyromancy on screen 2, Stormcaller): the two-hit Crush and the Warden's Rend punish builds with no block. Intended to be solved by unlocks (Tortoise Charm, Plate, a discovered guard tome) and by 4-card decks, which the sim does not model yet. Revisit once the sim can draw from the loot pool.
- **Rat Pack** remains the top screen-1 killer for DEF 0–1 classes. Working as intended.

## Screen 1 (1000 runs)

```
loadout, greedy policy

loadout                        reach boss  beat boss  hp@boss fights rounds  deaths
warrior fresh                       49.4%       0.0%      4.6   3.26   28.9  gatekeeper 49%, adept_necromancer 30%, rat_pack 21%
warrior Bulwark                     91.5%      77.6%     12.3   4.64   63.3  gatekeeper 14%, adept_necromancer 7%, rat_pack 2%
warrior Berserker                   79.3%       0.0%      6.8   3.78   17.1  gatekeeper 79%, boar 7%, adept_necromancer 6%
warrior Bulwark+gear1              100.0%      99.8%     16.3   5.00   35.8  gatekeeper 0%
warrior Berserker+gear1            100.0%      11.6%     21.4   4.12   17.8  gatekeeper 88%
warrior both sets+gear1            100.0%      71.4%     19.8   4.71   23.0  gatekeeper 29%

wizard fresh                        42.6%       0.0%      5.0   2.98   23.8  gatekeeper 43%, adept_necromancer 39%, rat_pack 19%
wizard Pyromancy                    80.8%       0.0%      6.9   3.77   13.2  gatekeeper 81%, boar 10%, rat_pack 4%
wizard Cryomancy                    89.6%      20.7%      5.7   4.08   27.5  gatekeeper 69%, rat_pack 8%, adept_necromancer 2%
wizard Pyromancy+gear1             100.0%      27.2%     17.9   4.27   11.9  gatekeeper 73%
wizard Cryomancy+gear1             100.0%      92.8%     15.9   4.93   23.6  gatekeeper 7%
wizard both sets+gear1             100.0%      83.8%     18.2   4.84   15.6  gatekeeper 16%

shaman fresh                        35.6%       0.0%      4.2   2.80   27.6  adept_necromancer 38%, gatekeeper 36%, rat_pack 27%
shaman Spiritcaller                 85.3%       0.2%     11.0   3.73   32.6  gatekeeper 85%, adept_necromancer 10%, boar 4%
shaman Stormcaller                  41.3%       0.0%      3.2   3.25   15.2  gatekeeper 41%, boar 21%, adept_necromancer 17%
shaman Spiritcaller+gear1          100.0%      94.6%     15.4   4.95   32.1  gatekeeper 5%
shaman Stormcaller+gear1           100.0%       4.6%     12.2   4.05   17.0  gatekeeper 95%
shaman both sets+gear1              99.7%      55.0%     14.5   4.55   21.7  gatekeeper 45%, boar 0%
```

## Screen 2 (500 runs, screen-2 kit)

```
loadout, greedy policy

loadout                        reach boss  beat boss  hp@boss fights rounds  deaths
warrior fresh                       41.2%       0.0%      8.8   2.74  104.8  harpies 59%, warden 41%
warrior Bulwark                     44.8%       8.8%     13.0   2.58   70.6  ogre 53%, warden 36%, harpies 2%
warrior Berserker                    0.2%       0.0%      7.0   1.00   14.4  iron_knight 39%, ogre 36%, harpies 13%
warrior Bulwark+gear2               99.6%      99.6%     19.0   4.99   46.5  ogre 0%
warrior Berserker+gear2             93.2%      12.6%     13.0   4.06   23.7  warden 81%, iron_knight 4%, ogre 2%
warrior both sets+gear2             89.8%      71.6%     16.6   4.51   31.4  warden 18%, ogre 9%, harpies 1%

wizard fresh                        34.0%       0.0%     10.0   2.24   64.4  harpies 66%, warden 34%
wizard Pyromancy                     1.2%       0.0%      2.8   1.18    9.3  ogre 36%, iron_knight 31%, harpies 23%
wizard Cryomancy                    48.8%       3.4%      8.1   2.91   41.6  harpies 50%, warden 45%, iron_knight 1%
wizard Pyromancy+gear2              97.0%      32.8%     14.8   4.30   18.0  warden 64%, ogre 3%, iron_knight 0%
wizard Cryomancy+gear2             100.0%      89.8%     14.4   4.90   28.4  warden 10%
wizard both sets+gear2              98.2%      80.4%     16.5   4.77   20.1  warden 18%, ogre 1%, harpies 0%

shaman fresh                        38.8%       0.0%      8.0   2.59  102.2  harpies 61%, warden 39%
shaman Spiritcaller                  9.4%       0.0%     11.0   1.22   27.8  iron_knight 46%, ogre 41%, warden 9%
shaman Stormcaller                   0.6%       0.0%      4.3   1.31   12.8  ogre 42%, iron_knight 24%, harpies 19%
shaman Spiritcaller+gear2           91.6%      90.2%     18.9   4.66   37.4  ogre 8%, warden 1%
shaman Stormcaller+gear2            94.6%       1.4%      7.3   3.96   22.5  warden 93%, ogre 3%, harpies 1%
shaman both sets+gear2              75.2%      50.6%     15.3   3.99   25.2  warden 25%, ogre 23%, iron_knight 2%
```

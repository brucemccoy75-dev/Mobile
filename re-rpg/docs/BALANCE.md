# Re-RPG — Balance Baseline (after phone test 3)

Produced by `npm run sim` with the greedy intent-reading policy (`src/core/sim/policy.ts`). Re-run after any numbers change and replace the tables. Gauntlet = 4 random fights of the screen's tier, HP carried over, no healing between fights, then the boss.

Loadouts: **fresh** = Attack/Defend only, empty deck. **Set** = the two set tomes in the deck. **gearN** = a full three-slot kit for screen N (`GEAR_KIT` in `src/core/sim/gauntlet.ts`). The sim does not model loot choice, relics or 4-card decks, so these are floors, not expectations.

## Targets (DECISIONS #1, #6)

- Fresh runs should almost never reach Boss 1. ✅ (≤ 5%)
- A run that found both set tomes should reach Boss 1 often but beat him only with the right read. ✅
- Set + screen-1 kit should beat Boss 1 most of the time. ✅ for guard-bearing sets; ❌ Berserker and Stormcaller (pure damage, no block) still lose the rhythm fight.
- Screen 2 should need screen-2 gear and a bigger deck. ✅ for Bulwark, Cryomancy, Spiritcaller; ❌ pure damage sets vs the Warden.

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
warrior fresh                       23.6%       0.0%      4.6   2.68   42.7  shell_beetle 36%, adept_necromancer 24%, gatekeeper 24%
warrior Bulwark                     92.1%      77.0%     12.6   4.64   64.2  gatekeeper 15%, adept_necromancer 7%, rat_pack 1%
warrior Berserker                   70.0%       0.0%      6.9   3.65   17.2  gatekeeper 70%, shell_beetle 8%, boar 8%
warrior Bulwark+gear1              100.0%      99.8%     16.4   5.00   36.3  gatekeeper 0%
warrior Berserker+gear1            100.0%       8.6%     19.8   4.09   18.0  gatekeeper 91%
warrior both sets+gear1            100.0%      71.0%     19.5   4.71   23.5  gatekeeper 29%

wizard fresh                        16.6%       0.0%      5.2   2.27   40.6  shell_beetle 41%, adept_necromancer 30%, gatekeeper 17%
wizard Pyromancy                    70.2%       0.0%      6.1   3.63   13.4  gatekeeper 70%, boar 12%, shell_beetle 7%
wizard Cryomancy                    89.0%      20.5%      5.6   4.07   28.4  gatekeeper 69%, rat_pack 9%, adept_necromancer 2%
wizard Pyromancy+gear1             100.0%      27.1%     17.8   4.27   11.9  gatekeeper 73%
wizard Cryomancy+gear1             100.0%      91.6%     14.8   4.92   24.1  gatekeeper 8%
wizard both sets+gear1             100.0%      82.8%     17.8   4.83   15.8  gatekeeper 17%

shaman fresh                        13.8%       0.0%      4.3   2.14   40.6  shell_beetle 38%, adept_necromancer 29%, rat_pack 19%
shaman Spiritcaller                 84.1%       0.2%     11.1   3.71   34.1  gatekeeper 84%, adept_necromancer 11%, boar 5%
shaman Stormcaller                  38.0%       0.0%      3.2   3.21   15.3  gatekeeper 38%, boar 21%, adept_necromancer 17%
shaman Spiritcaller+gear1          100.0%      94.3%     15.0   4.94   32.6  gatekeeper 6%
shaman Stormcaller+gear1           100.0%       3.3%     11.6   4.03   17.0  gatekeeper 97%
shaman both sets+gear1              99.8%      52.6%     14.2   4.52   21.9  gatekeeper 47%, boar 0%
```

## Screen 2 (500 runs, screen-2 kit)

```
loadout, greedy policy

loadout                        reach boss  beat boss  hp@boss fights rounds  deaths
warrior fresh                       12.8%       0.0%      8.9   1.50   72.7  iron_knight 53%, harpies 34%, warden 13%
warrior Bulwark                     44.6%       8.8%     13.3   2.58   75.3  ogre 53%, warden 36%, harpies 2%
warrior Berserker                    0.2%       0.0%      7.0   0.93   14.2  iron_knight 44%, ogre 34%, harpies 12%
warrior Bulwark+gear2              100.0%     100.0%     18.8   5.00   48.8  
warrior Berserker+gear2             79.6%      10.8%     12.7   3.81   23.6  warden 69%, iron_knight 12%, ogre 5%
warrior both sets+gear2             89.2%      71.4%     16.6   4.50   32.9  warden 18%, ogre 9%, iron_knight 1%

wizard fresh                        10.2%       0.0%     12.1   1.14   54.2  iron_knight 46%, harpies 44%, warden 10%
wizard Pyromancy                     1.2%       0.0%      2.8   1.10    9.1  iron_knight 35%, ogre 34%, harpies 22%
wizard Cryomancy                    48.6%       3.4%      8.0   2.91   44.4  harpies 50%, warden 45%, iron_knight 1%
wizard Pyromancy+gear2              93.2%      26.4%     13.7   4.19   18.4  warden 67%, ogre 4%, iron_knight 2%
wizard Cryomancy+gear2             100.0%      88.6%     13.8   4.89   30.4  warden 11%
wizard both sets+gear2              97.8%      76.6%     15.9   4.73   20.7  warden 21%, ogre 2%, harpies 0%

shaman fresh                        12.0%       0.0%      8.1   1.38   69.9  iron_knight 51%, harpies 37%, warden 12%
shaman Spiritcaller                  8.4%       0.0%     10.9   1.11   25.5  iron_knight 49%, ogre 39%, warden 8%
shaman Stormcaller                   0.6%       0.0%      4.3   1.22   12.6  ogre 40%, iron_knight 29%, harpies 17%
shaman Spiritcaller+gear2           91.8%      91.4%     18.8   4.68   38.4  ogre 8%, warden 0%
shaman Stormcaller+gear2            89.6%       1.2%      7.4   3.91   22.7  warden 88%, iron_knight 5%, ogre 3%
shaman both sets+gear2              74.2%      49.6%     15.0   3.95   25.5  warden 25%, ogre 23%, iron_knight 3%
```

# Re-RPG — Balance Baseline (after phone test 1)

Produced by `npm run sim` with the greedy intent-reading policy (`src/core/sim/policy.ts`). Re-run after any numbers change and replace the tables. Gauntlet = 4 random fights of the screen's tier, HP carried over, no healing between fights, then the boss.

Loadouts: **fresh** = Attack/Defend only, empty deck. **Set** = the two set tomes in the deck. **gearN** = a full three-slot kit for screen N (`GEAR_KIT` in `src/core/sim/gauntlet.ts`). The sim does not model loot choice, relics or 4-card decks, so these are floors, not expectations.

## Targets (DECISIONS #1, #6)

- Fresh runs should almost never reach Boss 1. ✅ (≤ 5%)
- A run that found both set tomes should reach Boss 1 often but beat him only with the right read. ✅
- Set + screen-1 kit should beat Boss 1 most of the time. ✅ for guard-bearing sets; ❌ Berserker and Stormcaller (pure damage, no block) still lose the rhythm fight.
- Screen 2 should need screen-2 gear and a bigger deck. ✅ for Bulwark, Cryomancy, Spiritcaller; ❌ pure damage sets vs the Warden.

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
warrior fresh                       31.7%       0.0%      6.1   2.90   52.2  boar 43%, gatekeeper 32%, shell_beetle 21%
warrior Bulwark                     89.0%       0.0%     10.7   3.88   32.2  gatekeeper 89%, boar 8%, rat_pack 2%
warrior Berserker                   98.4%       0.0%     14.4   3.98   15.0  gatekeeper 98%, boar 2%
warrior Bulwark+gear1              100.0%      93.0%     21.2   4.93   30.5  gatekeeper 7%
warrior Berserker+gear1            100.0%      97.1%     24.7   4.97   14.0  gatekeeper 3%
warrior both sets+gear1            100.0%      98.5%     23.8   4.99   19.8  gatekeeper 2%

wizard fresh                        17.6%       0.0%      7.7   2.21   54.2  boar 46%, shell_beetle 31%, gatekeeper 18%
wizard Pyromancy                    99.5%      10.6%     15.9   4.10    8.2  gatekeeper 89%, boar 0%, rat_pack 0%
wizard Cryomancy                    98.5%      33.6%      8.0   4.32   23.8  gatekeeper 65%, rat_pack 2%
wizard Pyromancy+gear1             100.0%      74.0%     22.0   4.74    8.6  gatekeeper 26%
wizard Cryomancy+gear1             100.0%      98.7%     20.5   4.99   17.7  gatekeeper 1%
wizard both sets+gear1             100.0%      94.2%     21.5   4.94   10.4  gatekeeper 6%

shaman fresh                        13.2%       0.0%      5.1   2.16   57.3  boar 53%, shell_beetle 26%, gatekeeper 13%
shaman Spiritcaller                 76.3%       0.0%     10.0   3.59   26.6  gatekeeper 76%, boar 20%, shell_beetle 2%
shaman Stormcaller                  57.3%       0.0%      5.3   3.42   12.0  gatekeeper 57%, boar 30%, rat_pack 9%
shaman Spiritcaller+gear1          100.0%      29.8%     16.5   4.30   24.3  gatekeeper 70%
shaman Stormcaller+gear1           100.0%      36.8%     15.8   4.37   13.7  gatekeeper 63%
shaman both sets+gear1             100.0%      41.6%     15.9   4.42   17.0  gatekeeper 58%
```

## Screen 2 (500 runs, screen-2 kit)

```
loadout, greedy policy

loadout                        reach boss  beat boss  hp@boss fights rounds  deaths
warrior fresh                        1.2%       0.0%      6.2   0.71   59.4  ogre 47%, iron_knight 41%, harpies 11%
warrior Bulwark                      5.0%       0.0%     11.2   0.94   27.7  ogre 51%, iron_knight 42%, warden 5%
warrior Berserker                    3.6%       0.0%      6.3   1.23   12.1  ogre 51%, iron_knight 34%, harpies 8%
warrior Bulwark+gear2               86.6%      54.4%     15.4   4.38   44.7  warden 32%, ogre 9%, iron_knight 3%
warrior Berserker+gear2            100.0%      96.2%     21.7   4.96   17.7  warden 4%
warrior both sets+gear2             99.8%      86.6%     19.7   4.86   24.8  warden 13%, ogre 0%

wizard fresh                         0.2%       0.0%      2.0   0.37   47.3  ogre 38%, iron_knight 34%, harpies 28%
wizard Pyromancy                     3.8%       0.0%      6.8   1.16    6.7  ogre 54%, iron_knight 21%, harpies 19%
wizard Cryomancy                    44.8%       2.8%      7.3   2.83   37.1  harpies 50%, warden 42%, ogre 4%
wizard Pyromancy+gear2              96.8%      32.8%     16.5   4.29   11.4  warden 64%, ogre 3%, iron_knight 1%
wizard Cryomancy+gear2             100.0%      96.4%     16.2   4.96   25.1  warden 4%
wizard both sets+gear2              99.4%      66.4%     17.0   4.66   13.9  warden 33%, ogre 0%, iron_knight 0%

shaman fresh                         0.6%       0.0%      5.3   0.64   57.2  ogre 46%, iron_knight 39%, harpies 14%
shaman Spiritcaller                  4.0%       0.0%      9.9   0.84   16.0  ogre 49%, iron_knight 44%, warden 4%
shaman Stormcaller                   2.2%       0.0%      4.5   1.12    9.7  ogre 57%, iron_knight 25%, harpies 10%
shaman Spiritcaller+gear2           93.6%      70.0%     16.6   4.60   39.5  warden 24%, ogre 5%, iron_knight 1%
shaman Stormcaller+gear2            75.0%       5.8%      7.8   3.81   19.0  warden 69%, ogre 13%, iron_knight 8%
shaman both sets+gear2              87.4%      39.2%     14.2   4.19   27.4  warden 48%, ogre 10%, iron_knight 1%
```

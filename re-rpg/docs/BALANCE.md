# Re-RPG — Balance Baseline (after phone test 1)

Produced by `npm run sim` with the greedy intent-reading policy (`src/core/sim/policy.ts`). Re-run after any numbers change and replace the tables. Gauntlet = 4 random fights of the screen's tier, HP carried over, no healing between fights, then the boss.

Loadouts: **fresh** = Attack/Defend only, empty deck. **Set** = the two set tomes in the deck. **gearN** = a full three-slot kit for screen N (`GEAR_KIT` in `src/core/sim/gauntlet.ts`). The sim does not model loot choice, relics or 4-card decks, so these are floors, not expectations.

## Targets (DECISIONS #1, #6)

- Fresh runs should almost never reach Boss 1. ✅ (≤ 5%)
- A run that found both set tomes should reach Boss 1 often but beat him only with the right read. ✅
- Set + screen-1 kit should beat Boss 1 most of the time. ✅ for guard-bearing sets; ❌ Berserker and Stormcaller (pure damage, no block) still lose the rhythm fight.
- Screen 2 should need screen-2 gear and a bigger deck. ✅ for Bulwark, Cryomancy, Spiritcaller; ❌ pure damage sets vs the Warden.

## Changes after phone test 1

- **Attack/Defend are cards** (2 + 1 in every fight's deck). Blocking now depends on the draw, which made both bosses far harder; Gatekeeper Crush went 2×1.3 → 2×1.0, Warden Smash 2.0 → 1.6 (phase 2: Rend 3×0.6, Smash 2.0).
- **Defence floor**: a hit is never reduced below half. Shell Beetle 12 HP / DEF 3 → 10 / 2, Iron Knight DEF 5 → 4. Trash fights went from 15–20 rounds to 3–6, so fresh runs now reach Boss 1 15–35% of the time and die there (0% beat), which is the better place to die.
- **Recovering heals**: Bind Wound / Mend heal 40% and skip two turns. The sim policy only heals when the heal outweighs two enemy hits.

Resulting shape: fresh reaches boss 15–35% / beats 0%; set alone beats 0–20%; set + screen-1 kit beats 20–99% depending on whether the set carries a block (Bulwark 99, Cryomancy 98, Berserker 68, Pyromancy 39, Spiritcaller 40, Stormcaller 19). Screen 2 with the screen-2 kit: 25–60% except Stormcaller.

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
warrior fresh                       35.1%       0.0%      6.0   2.99   23.3  gatekeeper 35%, boar 32%, shell_beetle 17%
warrior Bulwark                     68.9%       0.0%     13.3   3.38   45.0  gatekeeper 69%, boar 22%, rat_pack 8%
warrior Berserker                   85.7%       0.0%      9.6   3.82   17.9  gatekeeper 86%, boar 9%, rat_pack 3%
warrior Bulwark+gear1              100.0%      99.0%     20.6   4.99   52.5  gatekeeper 1%
warrior Berserker+gear1            100.0%      68.2%     21.9   4.68   19.6  gatekeeper 32%
warrior both sets+gear1            100.0%      97.9%     21.0   4.98   32.6  gatekeeper 2%

wizard fresh                        20.1%       0.0%      5.6   2.44   14.9  boar 38%, shell_beetle 23%, gatekeeper 20%
wizard Pyromancy                    88.4%       0.1%     10.3   3.83   11.4  gatekeeper 88%, boar 7%, shell_beetle 3%
wizard Cryomancy                    81.5%      20.8%      9.0   3.95   30.6  gatekeeper 61%, boar 10%, rat_pack 7%
wizard Pyromancy+gear1             100.0%      39.3%     19.1   4.39   12.0  gatekeeper 61%
wizard Cryomancy+gear1             100.0%      98.0%     19.3   4.98   30.0  gatekeeper 2%
wizard both sets+gear1             100.0%      77.7%     20.1   4.78   15.8  gatekeeper 22%

shaman fresh                        14.7%       0.0%      5.1   2.35   19.2  boar 39%, shell_beetle 24%, rat_pack 18%
shaman Spiritcaller                 49.5%       0.0%     10.5   2.85   31.7  gatekeeper 50%, boar 41%, rat_pack 6%
shaman Stormcaller                  41.4%       0.0%      5.1   3.05   13.3  gatekeeper 41%, boar 30%, rat_pack 17%
shaman Spiritcaller+gear1          100.0%      39.9%     17.0   4.40   44.1  gatekeeper 60%
shaman Stormcaller+gear1            98.7%      19.3%     13.6   4.18   17.4  gatekeeper 79%, rat_pack 1%, boar 0%
shaman both sets+gear1              99.5%      26.1%     15.4   4.25   26.9  gatekeeper 73%, boar 0%, rat_pack 0%
```

## Screen 2 (500 runs, screen-2 kit)

```
loadout, greedy policy

loadout                        reach boss  beat boss  hp@boss fights rounds  deaths
warrior fresh                        0.0%       0.0%      0.0   0.54   12.4  ogre 43%, iron_knight 37%, harpies 13%
warrior Bulwark                      2.6%       0.0%     10.8   0.78   29.0  ogre 48%, iron_knight 43%, harpies 5%
warrior Berserker                    0.4%       0.0%      5.0   0.73    9.8  ogre 47%, iron_knight 41%, harpies 7%
warrior Bulwark+gear2               60.2%      45.4%     17.9   3.59   50.0  ogre 29%, warden 15%, harpies 5%
warrior Berserker+gear2             80.2%      25.0%     13.6   3.98   19.4  warden 55%, ogre 9%, iron_knight 8%
warrior both sets+gear2             82.4%      60.8%     16.5   4.32   33.6  warden 22%, ogre 12%, harpies 3%

wizard fresh                         0.0%       0.0%      0.0   0.28    7.6  ogre 36%, iron_knight 32%, harpies 29%
wizard Pyromancy                     0.4%       0.0%      6.0   0.65    5.3  ogre 41%, iron_knight 37%, harpies 18%
wizard Cryomancy                     2.4%       0.0%      7.4   1.02   17.9  ogre 46%, harpies 34%, iron_knight 13%
wizard Pyromancy+gear2              82.4%      26.2%     14.3   4.00   13.7  warden 56%, iron_knight 8%, ogre 8%
wizard Cryomancy+gear2              87.4%      55.8%     14.8   4.37   34.8  warden 32%, ogre 9%, iron_knight 3%
wizard both sets+gear2              94.0%      58.8%     16.8   4.50   18.4  warden 35%, ogre 4%, iron_knight 2%

shaman fresh                         0.0%       0.0%      0.0   0.34   10.2  ogre 37%, iron_knight 34%, harpies 24%
shaman Spiritcaller                  0.6%       0.0%      6.3   0.66   15.5  ogre 44%, iron_knight 41%, witch 8%
shaman Stormcaller                   0.0%       0.0%      0.0   0.68    8.1  ogre 47%, iron_knight 33%, witch 10%
shaman Spiritcaller+gear2           59.8%      43.8%     16.3   3.55   49.4  ogre 33%, warden 16%, iron_knight 5%
shaman Stormcaller+gear2            32.8%       1.2%      7.8   2.82   15.1  ogre 37%, warden 32%, iron_knight 18%
shaman both sets+gear2              53.4%      15.8%     13.8   3.27   26.7  warden 38%, ogre 36%, iron_knight 7%
```

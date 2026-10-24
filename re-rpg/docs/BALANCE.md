# Re-RPG — Balance Baseline (milestone 5 pass)

Produced by `npm run sim` with the greedy intent-reading policy (`src/core/sim/policy.ts`). Re-run after any numbers change and replace the tables. Gauntlet = 4 random fights of the screen's tier, HP carried over, no healing between fights, then the boss.

Loadouts: **fresh** = Attack/Defend only, empty deck. **Set** = the two set tomes in the deck. **gearN** = a full three-slot kit for screen N (`GEAR_KIT` in `src/core/sim/gauntlet.ts`). The sim does not model loot choice, relics or 4-card decks, so these are floors, not expectations.

## Targets (DECISIONS #1, #6)

- Fresh runs should almost never reach Boss 1. ✅ (≤ 5%)
- A run that found both set tomes should reach Boss 1 often but beat him only with the right read. ✅
- Set + screen-1 kit should beat Boss 1 most of the time. ✅ for guard-bearing sets; ❌ Berserker and Stormcaller (pure damage, no block) still lose the rhythm fight.
- Screen 2 should need screen-2 gear and a bigger deck. ✅ for Bulwark, Cryomancy, Spiritcaller; ❌ pure damage sets vs the Warden.

## Changes made in this pass

1. **Shaman**: DEF 0 → 1, Spirit Lash lifesteal 25% → 50%, Mend's Weak 2 rounds → 1. Spiritcaller reach went 9% → 59%, Spiritcaller+gear1 beat 87% → 92%.
2. **Cryomancy**: Frost Bolt Chill 50% → 65%. With the policy fix below, Gatekeeper beat rate 0% → 79% (set only).
3. **Warden**: 60 HP / DEF 3 → 50 HP / DEF 2, a Stagger added to the phase-1 cycle, Rend 3×0.8 → 3×0.7.
4. **Sim policy**: plays a guard card that covers every hit of a multi-hit wind-up (Ice Armor vs Crush) and stops wasting Chill on non-attack rounds. These were policy flaws masquerading as balance problems.

## Still open

- **Pure damage sets vs bosses** (Berserker, Pyromancy on screen 2, Stormcaller): the two-hit Crush and the Warden's Rend punish builds with no block. Intended to be solved by unlocks (Tortoise Charm, Plate, a discovered guard tome) and by 4-card decks, which the sim does not model yet. Revisit once the sim can draw from the loot pool.
- **Rat Pack** remains the top screen-1 killer for DEF 0–1 classes. Working as intended.

## Screen 1 (1000 runs)

```
loadout                        reach boss  beat boss  hp@boss fights rounds  deaths
warrior fresh                        5.2%       0.0%      7.0   1.29   53.6  shell_beetle 52%, boar 24%, rat_pack 19%
warrior Bulwark                     96.4%      94.0%     12.4   4.89   62.4  rat_pack 4%, gatekeeper 2%
warrior Berserker                   54.8%       0.0%     11.8   3.11   30.1  gatekeeper 55%, rat_pack 23%, boar 14%
warrior Bulwark+gear1              100.0%     100.0%     18.9   5.00   26.4  
warrior Berserker+gear1             92.1%      17.2%     21.0   4.01   21.2  gatekeeper 75%, rat_pack 6%, boar 2%
warrior both sets+gear1             99.8%      98.8%     20.8   4.99   22.2  gatekeeper 1%, rat_pack 0%

wizard fresh                         4.4%       0.0%      8.8   1.44   42.4  rat_pack 41%, boar 29%, shell_beetle 25%
wizard Pyromancy                    78.3%      48.5%     14.2   4.11   16.8  gatekeeper 30%, boar 13%, rat_pack 9%
wizard Cryomancy                    79.0%      79.0%      7.3   4.36   29.7  rat_pack 21%
wizard Pyromancy+gear1              97.3%      88.4%     19.0   4.83   11.1  gatekeeper 9%, rat_pack 2%, boar 1%
wizard Cryomancy+gear1              90.5%      90.5%     15.0   4.72   21.8  rat_pack 10%
wizard both sets+gear1              96.1%      90.6%     17.4   4.83   12.9  gatekeeper 6%, rat_pack 4%

shaman fresh                         2.0%       0.0%      6.2   1.00   50.4  shell_beetle 46%, boar 27%, rat_pack 25%
shaman Spiritcaller                 59.0%       0.0%     11.9   3.02   66.6  gatekeeper 59%, rat_pack 28%, boar 13%
shaman Stormcaller                  32.2%       0.0%      4.9   2.75   32.9  boar 35%, rat_pack 33%, gatekeeper 32%
shaman Spiritcaller+gear1           92.1%      92.1%     16.6   4.75   32.9  rat_pack 8%
shaman Stormcaller+gear1            79.8%       0.1%     13.3   3.61   19.4  gatekeeper 80%, rat_pack 16%, boar 4%
shaman both sets+gear1              87.7%      81.2%     15.0   4.56   30.3  rat_pack 11%, gatekeeper 7%, boar 1%

```

## Screen 2 (500 runs, screen-2 kit)

```
loadout                        reach boss  beat boss  hp@boss fights rounds  deaths
warrior fresh                        0.2%       0.0%      4.0   0.38   51.8  ogre 39%, iron_knight 34%, harpies 27%
warrior Bulwark                     81.0%      81.0%     11.8   4.41  134.3  harpies 19%
warrior Berserker                    0.4%       0.0%      7.5   0.46   53.0  ogre 41%, iron_knight 35%, harpies 23%
warrior Bulwark+gear2               99.6%      99.6%     17.5   4.99   43.3  harpies 0%
warrior Berserker+gear2             83.0%      36.2%     18.4   4.07   33.5  warden 47%, harpies 9%, ogre 6%
warrior both sets+gear2             98.4%      98.4%     18.2   4.97   30.3  harpies 2%

wizard fresh                         0.0%       0.0%      0.0   0.29   45.6  ogre 36%, iron_knight 32%, harpies 31%
wizard Pyromancy                    10.4%       0.0%      8.1   1.32   46.3  ogre 59%, harpies 31%, warden 10%
wizard Cryomancy                    35.2%       9.8%     10.4   2.32   42.3  harpies 65%, warden 25%
wizard Pyromancy+gear2              86.0%      10.2%     16.4   3.90   19.3  warden 76%, ogre 12%, harpies 2%
wizard Cryomancy+gear2              91.6%      82.8%     14.5   4.67   26.5  warden 9%, harpies 8%
wizard both sets+gear2              95.8%      47.4%     14.5   4.41   17.6  warden 48%, harpies 4%

shaman fresh                         0.0%       0.0%      0.0   0.32   48.7  ogre 37%, iron_knight 33%, harpies 30%
shaman Spiritcaller                  1.6%       0.0%     12.4   0.54   59.5  ogre 43%, iron_knight 38%, harpies 18%
shaman Stormcaller                  10.0%       0.0%      6.5   1.39   50.5  ogre 61%, harpies 29%, warden 10%
shaman Spiritcaller+gear2           92.4%      92.4%     18.3   4.76   44.8  harpies 7%, ogre 0%
shaman Stormcaller+gear2            36.2%       0.0%      5.9   2.91   42.2  warden 36%, ogre 32%, harpies 32%
shaman both sets+gear2              89.2%      89.2%     16.0   4.68   40.6  harpies 9%, ogre 2%

```

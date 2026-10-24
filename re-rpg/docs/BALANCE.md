# Re-RPG — Balance Baseline (milestone 1)

Produced by `npm run sim` with the greedy intent-reading policy (`src/core/sim/policy.ts`). Re-run after any numbers change and replace the tables. Gauntlet = 4 random fights of the screen's tier, HP carried over, no healing between fights, then the boss.

Loadouts: **fresh** = Attack/Defend only, empty deck. **Set** = the two set tomes in the deck. **gearN** = a full three-slot kit for screen N (`GEAR_KIT` in `src/core/sim/gauntlet.ts`).

## Targets (DECISIONS #1, #6)

- Fresh runs should almost never reach Boss 1. ✅ (≤ 5%)
- A run that found both set tomes should reach Boss 1 often but beat him only with the right read. ✅ for warrior/wizard, ❌ shaman.
- Set + screen-1 kit should beat Boss 1 most of the time. ✅ except Cryomancy and Stormcaller.
- Screen 2 should need screen-2 gear and a 4-skill deck. ❌ Warden currently beats everything but warrior Bulwark.

## Known issues to tune (milestone 5)

1. **Shaman** is the weakest class in every row. Mend's Weak tax (2 rounds) plus atk 4 / def 0 / 20 HP compounds. Candidates: Weak 1 round, Spirit Lash lifesteal 50%, or shaman def 1.
2. **Warden** (60 HP, def 3) stalls builds without def-ignoring or Exposed; Bulwark fights average 100+ rounds. Candidates: 48 HP, or stagger in phase 1 cycle.
3. **Ogre** dominates screen-2 deaths for casters (Smash 2.5x). Fine if the screen-2 kit catches up; revisit after gear exists.
4. **Cryomancy** cannot beat the Gatekeeper (Ice Armor blocks 2 of 2 Crush hits only if drawn in time; Frost Bolt's Chill is 50%). Candidates: Chill 65%, or Ice Armor 3 hits.
5. **Rat Pack** is the main screen-1 killer for 0-def classes: three 1-damage hits ignore the min-1 floor benefit of def. Working as intended, but check it feels fair with the threat meter.

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
wizard Cryomancy                    26.9%       0.0%      8.8   2.40   39.8  boar 38%, rat_pack 35%, gatekeeper 27%
wizard Pyromancy+gear1              97.3%      88.4%     19.0   4.83   11.1  gatekeeper 9%, rat_pack 2%, boar 1%
wizard Cryomancy+gear1              83.6%       5.2%     15.2   3.73   21.0  gatekeeper 78%, rat_pack 12%, boar 4%
wizard both sets+gear1              93.9%      62.8%     17.5   4.51   13.6  gatekeeper 31%, rat_pack 5%, boar 1%

shaman fresh                         0.3%       0.0%      8.7   0.52   50.5  boar 41%, shell_beetle 37%, rat_pack 22%
shaman Spiritcaller                  9.4%       0.0%     11.6   1.20   48.7  boar 55%, rat_pack 36%, gatekeeper 9%
shaman Stormcaller                  16.3%       0.0%      5.1   2.02   37.0  boar 45%, rat_pack 39%, gatekeeper 16%
shaman Spiritcaller+gear1           86.7%      86.6%     14.3   4.58   49.5  rat_pack 13%, boar 1%, gatekeeper 0%
shaman Stormcaller+gear1            70.9%       0.0%     11.2   3.48   20.9  gatekeeper 71%, rat_pack 19%, boar 10%
shaman both sets+gear1              80.8%      63.9%     12.8   4.27   33.7  gatekeeper 17%, rat_pack 14%, boar 5%

```

## Screen 2 (500 runs, screen-2 kit)

```
loadout                        reach boss  beat boss  hp@boss fights rounds  deaths
warrior fresh                        0.2%       0.0%      4.0   0.38   51.8  ogre 39%, iron_knight 34%, harpies 27%
warrior Bulwark                     81.0%       0.0%     11.8   3.60  130.8  warden 81%, harpies 19%
warrior Berserker                    0.4%       0.0%      7.5   0.46   53.1  ogre 41%, iron_knight 35%, harpies 23%
warrior Bulwark+gear2               99.6%      99.6%     17.5   4.99   57.6  harpies 0%
warrior Berserker+gear2             83.0%       0.0%     18.4   3.71   45.0  warden 83%, harpies 9%, ogre 6%
warrior both sets+gear2             98.4%      97.6%     18.2   4.96   40.5  harpies 2%, warden 1%

wizard fresh                         0.0%       0.0%      0.0   0.29   45.6  ogre 36%, iron_knight 32%, harpies 31%
wizard Pyromancy                    10.4%       0.0%      8.1   1.32   47.5  ogre 59%, harpies 31%, warden 10%
wizard Cryomancy                     0.4%       0.0%      3.0   0.36   47.0  ogre 38%, iron_knight 33%, harpies 28%
wizard Pyromancy+gear2              86.0%       1.0%     16.4   3.80   21.2  warden 85%, ogre 12%, harpies 2%
wizard Cryomancy+gear2              67.0%       0.0%     13.8   3.46   45.5  warden 67%, ogre 23%, harpies 10%
wizard both sets+gear2              79.6%       0.6%     15.4   3.70   29.2  warden 79%, ogre 17%, harpies 4%

shaman fresh                         0.0%       0.0%      0.0   0.29   45.6  ogre 36%, iron_knight 32%, harpies 31%
shaman Spiritcaller                  0.0%       0.0%      0.0   0.30   46.8  ogre 37%, iron_knight 33%, harpies 31%
shaman Stormcaller                   6.2%       0.0%      7.8   1.03   42.0  ogre 52%, harpies 41%, warden 6%
shaman Spiritcaller+gear2           76.4%       0.0%     17.4   3.51   63.8  warden 76%, ogre 15%, harpies 9%
shaman Stormcaller+gear2            24.2%       0.0%      6.3   2.49   46.6  ogre 46%, harpies 30%, warden 24%
shaman both sets+gear2              55.0%       0.0%     14.6   3.16   54.1  warden 55%, ogre 34%, harpies 11%

```

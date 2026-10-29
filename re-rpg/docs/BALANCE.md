# Re-RPG — Balance Baseline

Newest first. Run logs are read with the procedure in `docs/PLAYTESTS.md` (`npm run playtest`, then both sim tables). Produced by `npm run sim` with the greedy intent-reading policy (`src/core/sim/policy.ts`). Re-run after any numbers change and replace the tables. Gauntlet = 4 random fights of the screen's tier, HP carried over, no healing between fights, then the boss.

Loadouts: **fresh** = Attack/Defend only, empty deck. **Set** = the two set tomes in the deck. **gearN** = a full three-slot kit for screen N (`GEAR_KIT` in `src/core/sim/gauntlet.ts`). The sim does not model loot choice, relics or 4-card decks, so these are floors, not expectations.

## Story off, Knight Andre at the gate 2026-10-29 (DECISIONS #72)

The baseline to balance against: no quests, no dialogue, Knight Andre (52 HP) always at the gate.
`npm run sim -- --screen --class warrior --runs 1000`:

```
full clear                     reach boss  beat boss  hp@boss fights rounds  deaths
warrior fresh                        0.0%       0.0%      0.0   2.57   21.3  adept_necromancer 29%, boar 19%, rat_pack 11%
warrior Bulwark                      0.2%       0.0%      3.5   2.56   23.8  adept_necromancer 31%, boar 20%, rat_pack 11%
warrior Berserker                    0.1%       0.0%      9.0   2.70   19.9  adept_necromancer 29%, boar 19%, adept_necromancer+boar 11%
warrior Shadow Knight                3.1%       0.0%      8.1   4.46   29.7  boar 22%, adept_necromancer+boar 16%, boar+hex_imp 14%
warrior Berserker+Bulwark            0.1%       0.0%      6.0   2.76   22.7  adept_necromancer 29%, boar 18%, rat_pack 12%
warrior Shadow Knight+Bulwark        0.4%       0.0%      6.3   3.10   25.3  adept_necromancer 27%, boar 21%, rat_pack 11%
warrior Berserker+Shadow Knight       0.9%       0.0%     10.0   3.20   22.4  adept_necromancer 26%, boar 16%, adept_necromancer+boar 13%

shortest road                  reach boss  beat boss  hp@boss fights rounds  deaths
warrior fresh                        6.9%       0.0%      6.1   2.27   19.5  adept_necromancer 17%, adept_necromancer+boar 15%, boar 13%
warrior Bulwark                     10.7%       0.0%      8.0   2.24   21.7  adept_necromancer 19%, adept_necromancer+boar 14%, boar 12%
warrior Berserker                   15.5%       0.0%      9.3   2.34   18.3  adept_necromancer 19%, gatekeeper 16%, adept_necromancer+boar 13%
warrior Shadow Knight               42.4%       0.0%      9.5   3.23   23.0  gatekeeper 42%, boar+hex_imp 15%, adept_necromancer+boar 14%
warrior Berserker+Bulwark           12.7%       0.0%      9.3   2.32   20.1  adept_necromancer 20%, adept_necromancer+boar 16%, gatekeeper 13%
warrior Shadow Knight+Bulwark       17.6%       0.0%      8.0   2.57   22.2  gatekeeper 18%, adept_necromancer+boar 17%, adept_necromancer 14%
warrior Berserker+Shadow Knight     22.6%       0.0%     10.5   2.56   19.3  gatekeeper 23%, adept_necromancer+boar 15%, adept_necromancer 14%
```

Reading:
- Reaching the gate is the same as with Wren (same road). Andre, like Wren, is beaten 0% by any
  loadout with two heirlooms and no loot.
- Real runs carry loot, so the next run log is the first real look at Andre since the node map.
- The four-fight gauntlet already used Andre and is unchanged.

## Blackjack opening draw 2026-10-29 (DECISIONS #71)

Playing Blackjack now draws a playing card whose value starts the total. Berserker rows only (the
rest are unchanged):

```
screen mirror, full clear      reach boss  beat boss  hp@boss fights rounds  deaths
warrior Berserker                    0.1%       0.0%      9.0   2.70   19.9  adept_necromancer 29%, boar 19%, adept_necromancer+boar 11%
warrior Berserker+Bulwark            0.1%       0.0%      6.0   2.76   22.7  adept_necromancer 29%, boar 18%, rat_pack 12%
warrior Berserker+Shadow Knight       0.9%       0.0%     10.0   3.20   22.4  adept_necromancer 26%, boar 16%, adept_necromancer+boar 13%
screen mirror, shortest road
warrior Berserker                   15.5%       0.0%      9.3   2.34   18.3  adept_necromancer 19%, wren 16%, adept_necromancer+boar 13%
warrior Berserker+Bulwark           12.7%       0.0%      9.3   2.32   20.1  adept_necromancer 20%, adept_necromancer+boar 16%, wren 13%
warrior Berserker+Shadow Knight     22.6%       0.0%     10.5   2.56   19.5  wren 23%, adept_necromancer+boar 15%, adept_necromancer 15%
gauntlet
warrior Berserker                   51.2%       0.0%     11.7   3.03   14.9  gatekeeper 51%, adept_necromancer 20%, boar 19%
warrior Berserker+gear1             77.3%       0.0%     16.6   3.56   16.0  gatekeeper 77%, adept_necromancer 10%, boar 9%
warrior both sets+gear1             81.0%       0.1%     17.2   3.63   22.0  gatekeeper 81%, boar 9%, adept_necromancer 8%
```

Reading:
- Berserker is slightly weaker: shortest road 17.1% to 15.5%, gauntlet 57.0% to 51.2%.
- The opening card leaves less room under 21. At ×5 an Attack (20) busts after any draw but an
  Ace, so Blackjack now wants small hits.
- The multiplier (the modifier's amount) is the lever if that is too tight.

## Three cards before every card 2026-10-29 (DECISIONS #70)

The hand refills to 3 after every card that leaves the turn going on (duo turns, bonus turns).

`npm run sim -- --screen --class warrior --runs 1000`:

```
full clear                     reach boss  beat boss  hp@boss fights rounds  deaths
warrior fresh                        0.0%       0.0%      0.0   2.57   21.3  adept_necromancer 29%, boar 19%, rat_pack 11%
warrior Bulwark                      0.2%       0.0%      3.5   2.56   23.8  adept_necromancer 31%, boar 20%, rat_pack 11%
warrior Berserker                    0.1%       0.0%      9.0   2.84   20.5  adept_necromancer 28%, boar 20%, adept_necromancer+boar 12%
warrior Shadow Knight                3.1%       0.0%      8.1   4.46   29.8  boar 22%, adept_necromancer+boar 16%, boar+hex_imp 14%
warrior Berserker+Bulwark            0.1%       0.0%      6.0   2.81   22.9  adept_necromancer 29%, boar 18%, rat_pack 12%
warrior Shadow Knight+Bulwark        0.4%       0.0%      6.3   3.10   25.3  adept_necromancer 27%, boar 21%, rat_pack 11%
warrior Berserker+Shadow Knight       0.9%       0.0%     10.0   3.30   22.9  adept_necromancer 25%, boar 16%, adept_necromancer+boar 13%

shortest road                  reach boss  beat boss  hp@boss fights rounds  deaths
warrior fresh                        6.9%       0.0%      6.1   2.27   19.6  adept_necromancer 17%, adept_necromancer+boar 15%, boar 13%
warrior Bulwark                     10.7%       0.0%      8.0   2.24   21.9  adept_necromancer 19%, adept_necromancer+boar 14%, boar 12%
warrior Berserker                   17.1%       0.0%      9.5   2.44   18.7  adept_necromancer 18%, wren 17%, adept_necromancer+boar 13%
warrior Shadow Knight               42.4%       0.0%      9.5   3.23   23.7  wren 42%, boar+hex_imp 15%, adept_necromancer+boar 14%
warrior Berserker+Bulwark           13.0%       0.0%      9.3   2.36   20.3  adept_necromancer 19%, adept_necromancer+boar 16%, wren 13%
warrior Shadow Knight+Bulwark       17.6%       0.0%      8.0   2.57   22.4  wren 18%, adept_necromancer+boar 17%, adept_necromancer 14%
warrior Berserker+Shadow Knight     23.8%       0.0%     10.3   2.63   19.8  wren 24%, adept_necromancer+boar 15%, adept_necromancer 14%
```

`npm run sim -- --class warrior --runs 1000` (single fights; only bonus turns change): within a
point of the table below (fresh 26.3%, Bulwark 31.2%, Berserker 57.0%, both sets+gear1 beat
Andre 0.4%).

Reading: against #69's mirror, the shortest road gains 1–6 points everywhere, Shadow Knight most
(36.5% to 42.4%). The full clear barely moves (0–3.1%): the ten-fight attrition (Phone test 8) is
still the wall.

## Cards import 2026-10-29 (DECISIONS #69: Desperation, Utility Knife, Lunch Break, Blackjack, Trickster)

New cards desperation and utility_knife (Bulwark), lunch_break, blackjack and trickster
(Berserker); new modifiers lunch_regen, blackjack_x5, extra_play_1, draw_to_3, weak_self_2,
curse_self_2.

`npm run sim -- --class warrior --runs 1000` (four-fight gauntlet; a set loadout holds its whole
family, so the new cards are in it):

```
warrior fresh                       25.6%       0.0%      5.8   2.64   20.4  adept_necromancer 32%, gatekeeper 26%, boar 25%
warrior Bulwark                     30.9%       0.0%     10.0   2.66   27.3  gatekeeper 31%, adept_necromancer 28%, boar 27%
warrior Berserker                   56.7%       0.0%     11.5   3.16   14.9  gatekeeper 57%, adept_necromancer 19%, boar 17%
warrior Bulwark+gear1               81.5%       0.1%     16.0   3.71   29.6  gatekeeper 81%, boar 9%, adept_necromancer 7%
warrior Berserker+gear1             82.5%       0.0%     16.5   3.69   15.8  gatekeeper 83%, adept_necromancer 7%, boar 7%
warrior both sets+gear1             84.8%       0.6%     17.3   3.74   21.9  gatekeeper 84%, boar 8%, adept_necromancer 6%
```

`npm run sim -- --screen --class warrior --runs 1000` (two heirlooms drawn from the family):

```
full clear                     reach boss  beat boss  hp@boss fights rounds  deaths
warrior fresh                        0.0%       0.0%      0.0   2.52   21.0  adept_necromancer 28%, boar 19%, rat_pack 11%
warrior Bulwark                      0.1%       0.0%      4.0   2.54   23.5  adept_necromancer 31%, boar 19%, rat_pack 11%
warrior Berserker                    0.2%       0.0%      8.5   2.79   19.9  adept_necromancer 26%, boar 19%, adept_necromancer+boar 13%
warrior Shadow Knight                1.6%       0.0%      8.9   4.37   29.1  boar 22%, boar+hex_imp 15%, adept_necromancer+boar 14%
warrior Berserker+Bulwark            0.2%       0.0%     12.5   2.77   22.5  adept_necromancer 29%, boar 17%, rat_pack 12%
warrior Shadow Knight+Bulwark        1.0%       0.0%      6.5   3.07   25.1  adept_necromancer 26%, boar 20%, adept_necromancer+boar 11%
warrior Berserker+Shadow Knight       0.6%       0.0%     10.3   3.23   22.5  adept_necromancer 25%, boar 17%, adept_necromancer+boar 13%

shortest road                  reach boss  beat boss  hp@boss fights rounds  deaths
warrior fresh                        5.9%       0.0%      6.2   2.22   19.3  adept_necromancer+boar 17%, adept_necromancer 16%, boar 13%
warrior Bulwark                      9.1%       0.0%      8.6   2.21   21.4  adept_necromancer 20%, adept_necromancer+boar 14%, boar 12%
warrior Berserker                   15.0%       0.0%      8.5   2.41   18.2  adept_necromancer 17%, wren 15%, adept_necromancer+boar 14%
warrior Shadow Knight               36.5%       0.0%      9.2   3.17   23.2  wren 37%, boar+hex_imp 16%, adept_necromancer+boar 16%
warrior Berserker+Bulwark           11.6%       0.0%     10.1   2.32   20.0  adept_necromancer 19%, adept_necromancer+boar 16%, boar+hex_imp 12%
warrior Shadow Knight+Bulwark       15.7%       0.0%      8.5   2.52   21.8  adept_necromancer+boar 16%, wren 16%, adept_necromancer 13%
warrior Berserker+Shadow Knight      21.8%       0.0%      9.5   2.63   19.6  wren 22%, boar+hex_imp 15%, adept_necromancer 14%
```

Reading:
- **Bulwark and Berserker got weaker in the sim** (gauntlet: Berserker 81.8% to 56.7%, Bulwark
  39.9% to 30.9%; mirror shortest road: Berserker 18.0% to 15.0%, Bulwark 12.7% to 9.1%). Shadow
  Knight, untouched, is identical, so the change is the new cards. Two causes:
  - Two heirlooms are now drawn from 8 Berserker cards (was 5), so Mighty Blow and Broadsword
    come up less.
  - The greedy policy plays the new cards badly. It calls the coin blind (half its Tricksters
    curse it), throws Utility Knife into clean enemies (Tiring), and has no plan for Blackjack
    beyond not busting.

  Read this as "the sim cannot judge these cards", not as their strength.
- **Blackjack's shape at attack 4**: the first hit is 20.
  - One Attack ends any single screen-1 enemy, and only the 10–12 HP that lands counts.
  - In a duo, the second kill busts.
  - Wren (46 HP) cannot be finished under it.
- The next run log is the real test.

## Plays per living enemy 2026-10-29 (DECISIONS #68)

One card per enemy alive at the start of the turn; the hand stays 3. Single fights are untouched,
so the four-fight gauntlet is identical to Phone test 8's.

`npm run sim -- --screen --class warrior` after (before in brackets, from Phone test 8):

```
full clear                     reach boss  beat boss  hp@boss fights rounds  deaths
warrior fresh                        0.0%       0.0%      0.0   2.52   21.0  adept_necromancer 28%, boar 19%, rat_pack 11%
warrior Bulwark                      0.0%       0.0%      0.0   2.79   25.6  adept_necromancer 27%, boar 19%, rat_pack 12%
warrior Berserker                    0.1%       0.0%      5.0   3.36   18.4  adept_necromancer 20%, boar 18%, adept_necromancer+boar 13%
warrior Shadow Knight                1.6%       0.0%      8.9   4.37   29.1  boar 22%, boar+hex_imp 15%, adept_necromancer+boar 14%
warrior Berserker+Bulwark            0.4%       0.0%      3.3   3.11   22.4  adept_necromancer 22%, boar 18%, adept_necromancer+boar 13%
warrior Shadow Knight+Bulwark        0.6%       0.0%      4.7   3.28   26.4  boar 23%, adept_necromancer 22%, adept_necromancer+boar 13%
warrior Berserker+Shadow Knight       0.3%       0.0%      9.3   3.74   22.3  boar 19%, adept_necromancer 16%, adept_necromancer+boar 14%

shortest road                  reach boss  beat boss  hp@boss fights rounds  deaths
warrior fresh                        5.9%       0.0%      6.2   2.22   19.3  adept_necromancer+boar 17%, adept_necromancer 16%, boar 13%
warrior Bulwark                     12.7%       0.0%      8.2   2.36   22.9  adept_necromancer 17%, adept_necromancer+boar 15%, wren 13%
warrior Berserker                   18.0%       0.0%      8.4   2.77   16.3  wren 18%, adept_necromancer+boar 16%, boar+hex_imp 15%
warrior Shadow Knight               36.5%       0.0%      9.2   3.17   23.2  wren 37%, boar+hex_imp 16%, adept_necromancer+boar 16%
warrior Berserker+Bulwark           16.6%       0.0%      9.1   2.55   19.9  wren 17%, adept_necromancer 15%, adept_necromancer+boar 14%
warrior Shadow Knight+Bulwark       19.4%       0.0%      9.0   2.63   22.9  wren 19%, adept_necromancer+boar 17%, boar+hex_imp 14%
warrior Berserker+Shadow Knight     27.6%       0.0%      8.7   2.94   19.1  wren 28%, boar+hex_imp 15%, adept_necromancer+boar 14%
```

Against Phone test 8's mirror:
- **Duo deaths** fell from 50–63% to 35–48% of deaths on a full clear. The top killers are now
  single fights (Necromancer, Boar), worn down by HP carried over.
- **Shortest road** reaches Wren 6–37% (was 0.3–7%), and Wren is now its top killer for most
  loadouts.
- **Full clear** still almost never reaches Wren (0–1.6%). Fights won rose by 0.3–1.1. The
  ten-fight attrition is the remaining wall (Phone test 8, open questions).
- **Shadow Knight gains most**: Leech hits both enemies and drains (why it gains more than the
  others is not measured).
- **Beat boss is 0% everywhere.** The mirror has no loot, so this stays a floor; the next run log
  will say how far real runs move.

## Phone test 8 (run log 2026-10-28)

Procedure: `docs/PLAYTESTS.md`. Log: `docs/playtests/2026-10-28-runs.json` (20 warrior runs over
two evenings, 17 finished, all on screen 1; two deaths were to the ghost, since switched off).

`npm run playtest -- docs/playtests/2026-10-28-runs.json` (gate Wren, 1000 mirror runs a row):

```
group                          n lvl |       reach boss |        beat boss |       fights won |   deaths in duos
                                     | real  clear short | real  clear short | real  clear short | real  clear short
fresh                          8   1 |    0%    0%    0% |    0%    0%    0% |   3.3   2.2   1.9 |   63%   50%   67%
Berserker                      4   4 |    0%    0%    5% |    0%    0%    0% |   4.5   3.1   2.5 |   75%   58%   75%
Bulwark                        1   3 |  100%    0%    2% |    0%    0%    0% |  10.0   2.5   2.1 |    0%   51%   68%
Berserker+Shadow Knight        4   5 |    0%    0%    9% |    0%    0%    0% |   2.3   3.4   2.6 |   75%   63%   76%
```

`npm run sim -- --screen --class warrior` (the mirror for every loadout, level 1):

```
full clear                     reach boss  beat boss  hp@boss fights rounds  deaths
warrior fresh                        0.0%       0.0%      0.0   2.17   18.7  adept_necromancer 24%, adept_necromancer+boar 15%, boar 14%
warrior Bulwark                      0.0%       0.0%      0.0   2.33   22.5  adept_necromancer 22%, adept_necromancer+boar 16%, boar 15%
warrior Berserker                    0.0%       0.0%      0.0   2.88   16.4  adept_necromancer+boar 17%, adept_necromancer 16%, boar 15%
warrior Shadow Knight                0.2%       0.0%      5.0   3.30   22.8  adept_necromancer+boar 21%, boar+hex_imp 19%, shell_beetle+rat_pack 15%
warrior Berserker+Bulwark            0.0%       0.0%      0.0   2.60   19.5  adept_necromancer 19%, adept_necromancer+boar 17%, boar 14%
warrior Shadow Knight+Bulwark        0.0%       0.0%      0.0   2.65   22.4  adept_necromancer+boar 18%, adept_necromancer 18%, boar 17%
warrior Berserker+Shadow Knight       0.0%       0.0%      0.0   3.06   18.9  adept_necromancer+boar 18%, boar 15%, boar+hex_imp 15%

shortest road                  reach boss  beat boss  hp@boss fights rounds  deaths
warrior fresh                        0.3%       0.0%      2.0   1.90   17.0  adept_necromancer+boar 19%, rat_pack+hex_imp 16%, shell_beetle+rat_pack 16%
warrior Bulwark                      1.4%       0.0%      7.5   1.97   20.0  adept_necromancer+boar 19%, rat_pack+hex_imp 16%, shell_beetle+rat_pack 16%
warrior Berserker                    2.7%       0.0%      7.3   2.35   14.2  adept_necromancer+boar 20%, shell_beetle+rat_pack 18%, boar+hex_imp 18%
warrior Shadow Knight                6.6%       0.0%      7.7   2.49   18.7  adept_necromancer+boar 24%, boar+hex_imp 22%, shell_beetle+rat_pack 17%
warrior Berserker+Bulwark            3.5%       0.0%      6.7   2.17   17.4  adept_necromancer+boar 19%, boar+hex_imp 17%, rat_pack+hex_imp 16%
warrior Shadow Knight+Bulwark        3.8%       0.0%      6.6   2.19   19.7  adept_necromancer+boar 21%, boar+hex_imp 18%, rat_pack+hex_imp 16%
warrior Berserker+Shadow Knight       4.2%       0.0%      8.1   2.41   16.1  adept_necromancer+boar 22%, boar+hex_imp 19%, shell_beetle+rat_pack 19%
```

`npm run sim -- --class warrior` (four-fight gauntlet): unchanged from the Hand of 3 table below
(fresh 25.6% reach, Bulwark 39.9%, Berserker 81.8%, both sets+gear1 beat Andre 0.6%).

Reading:
- **Mirror and real runs agree on the wall.** Fresh and Berserker reach Wren 0% in both on a full
  clear, and most deaths come in duos in both (real 63–75%, mirror 50–63%) although duos are
  under a third of fights (29% real).
- **Real runs win more fights than the mirror**: fresh 3.3 against 2.2, and the one Bulwark run
  that reached Wren won 10 against 2.5. The mirror has only its two heirlooms; real runs pick up
  gear and cards on the way and buy heals. The Bulwark run took 2 Shield Bash, 2 Warding Blast,
  Bind Wound, Final Stand, a mace, a chain shirt and a relic, and healed 68 before the gate. So in
  the mirror, as in play, what gets a run through screen 1 is loot, not the families it opens with.
- **The four-fight gauntlet overstates a run by about 80 points** (Berserker 82% against 0% real).
  It has four fights against about ten, no duos, no Wren, and the whole family in hand. It stays
  as the historic floor for a deck; the mirror is the run comparison from now on.
- **Levels make fights shorter, not safer.**
  - Rounds per fight: 6.3 fresh against 3.7 Berserker.
  - Damage taken per round rose with level: alone 0.9 at L1 to 1.9 at L5; in duos 2.9 to 5.3.
  - Fights won did not rise: fresh 3.3, Berserker (L4) 4.5, Berserker+Shadow Knight (L5) 2.3.
  - In the mirror the opening families move fights won by about one at most (2.2 to 3.4).
  - Attack and once-per-fight cards crowd Defend and Ward out of a 3-card hand, and nothing comes
    back between fights to repay a faster kill.
- **Attrition**: HP regained between fights, median 0–2. A full clear is about 10 fights on one HP
  bar plus one shrine.
- **Gold is idle**: long runs died holding 126–187 gold; three Heals and one Mighty Blow were all
  that was bought.
- **Little dice in a fight**: damage dealt is exactly the enemy's HP every fight, four of the five
  screen-1 enemies run fixed sequences, and luck's 1% crits and bonus turns are rarely seen.
- **Against the Targets**:
  - "Fresh runs should almost never reach Boss 1" ✅ (real 0 of 8, mirror 0–0.3%).
  - "A run that found both set tomes should reach Boss 1 often" ❌ (1 of 9 family runs; mirror
    0% on a full clear).
  - "Set + kit should beat Boss 1 most of the time": one attempt, lost with Wren at 10 of 46.
- **Caveats**: 17 finished runs. Every level-5 run was a Shadow Knight build, so "L5" may be that
  family rather than levels. The mirror is a floor (no loot or shop, greedy play).

Open questions for the designer (nothing changed):
- What should a full clear cost? A shrine or camp near the gate, duos visible on the map as a
  choice, and a shop that turns gold into HP are all world data (node rules).
- Should growth come within a run (loot) more than across runs (levels)? Today a level-1 run and a
  level-5 run end in about the same place.
- Sim: model loot and the shop in the mirror so it can predict a run, not only floor it.

## Hand of 3 every round 2026-10-27 (DECISIONS #53)

Each round draws up to 3 instead of dealing one. Warrior gauntlet, 1000 runs, greedy policy:

```
loadout                        reach boss  beat boss  hp@boss fights rounds  deaths
warrior fresh                       25.6%       0.0%      5.8   2.64   20.4  adept_necromancer 32%, gatekeeper 26%, boar 25%
warrior Bulwark                     39.9%       0.0%     10.5   2.84   28.9  gatekeeper 40%, boar 27%, adept_necromancer 23%
warrior Berserker                   81.8%       0.0%     11.3   3.75   13.6  gatekeeper 82%, boar 8%, adept_necromancer 6%
warrior Bulwark+gear1               85.9%       0.0%     16.8   3.76   30.4  gatekeeper 86%, boar 9%, adept_necromancer 3%
warrior Berserker+gear1             99.2%       0.0%     17.8   3.99   13.7  gatekeeper 99%, boar 1%, adept_necromancer 0%
warrior both sets+gear1             96.4%       0.6%     18.4   3.96   21.2  gatekeeper 96%, boar 2%, adept_necromancer 1%
```

Within a point of the table below: the greedy policy always plays a card, so its hand was already back to 3 every round except after a bonus turn (1% per card).

## Luck odds 2026-10-27 (DECISIONS #52)

Crits and bonus turns are luck × 0.2% per card (was 1.2%): base luck 5 is 1% each. Rare odds unchanged. Warrior gauntlet, 1000 runs, greedy policy:

```
loadout                        reach boss  beat boss  hp@boss fights rounds  deaths
warrior fresh                       24.9%       0.0%      5.9   2.62   20.4  adept_necromancer 32%, gatekeeper 25%, boar 25%
warrior Bulwark                     39.4%       0.0%     10.6   2.84   28.9  gatekeeper 39%, boar 27%, adept_necromancer 22%
warrior Berserker                   82.0%       0.0%     11.3   3.76   13.6  gatekeeper 82%, boar 8%, adept_necromancer 6%
warrior Bulwark+gear1               86.0%       0.0%     16.7   3.76   30.5  gatekeeper 86%, boar 9%, adept_necromancer 3%
warrior Berserker+gear1             99.2%       0.0%     17.9   3.99   13.7  gatekeeper 99%, boar 1%, adept_necromancer 0%
warrior both sets+gear1             96.3%       0.8%     18.4   3.96   21.2  gatekeeper 96%, boar 2%, adept_necromancer 1%
```

Back to within a point of the luck-0 table (fresh 25.4%, Bulwark 39.1%, Berserker 81.1%): at 1% luck is a rare treat, not a lever.

## Cards import 2026-10-27 (Shadow Knight: Minor leech, Leech, Death Touch)

Changed: new cards minorleech (Minor leech, common: 100%, heal 10%, Tiring), leech (Leech, rare, once per fight: 100% to every enemy, drain 40%, Ward 1 + Overextend), deathtoufh (Death Touch, rare, fleeting: 500%, ignores defence, drain 40%, Backfire 100%); new modifier backfire (DECISIONS #51), linked to Death Touch at the designer's request; Shadow Knight holds all three. The warrior gauntlet table is unchanged from the Luck entry below: the sim has no Shadow Knight loadout yet, so none of these cards is played in it.

## Luck 2026-10-27 (DECISIONS #50)

Every class has luck 5: 6% per card of a critical hit (+50%) and 6% of a bonus turn (once per round), and +6 rare weight on rewards and the shop. The sim now passes luck through (its stat helper dropped it). Same cards as the entry below. Warrior gauntlet, 1000 runs, greedy policy:

```
loadout                        reach boss  beat boss  hp@boss fights rounds  deaths
warrior fresh                       28.9%       0.0%      6.0   2.73   20.7  adept_necromancer 30%, gatekeeper 29%, boar 24%
warrior Bulwark                     46.7%       0.0%     11.1   3.00   29.0  gatekeeper 47%, boar 22%, adept_necromancer 21%
warrior Berserker                   85.5%       0.0%     11.9   3.80   13.6  gatekeeper 86%, boar 6%, adept_necromancer 5%
warrior Bulwark+gear1               89.6%       0.0%     18.0   3.84   31.1  gatekeeper 90%, boar 6%, adept_necromancer 3%
warrior Berserker+gear1             99.6%       0.1%     18.8   3.99   13.8  gatekeeper 100%, boar 0%
warrior both sets+gear1             97.0%       1.2%     19.5   3.97   21.4  gatekeeper 96%, boar 2%, adept_necromancer 1%
```

Against luck 0: fresh 25.4% → 28.9% reach, Bulwark 39.1% → 46.7%, Berserker 81.1% → 85.5%, both sets+gear1 beat boss 0.5% → 1.2%. The sim does not model loot, so the rare-odds part is not in these numbers.

## Cards import 2026-10-27 (Repair Boomerang, six-card starting deck)

Changed: new card healboomerang (Repair Boomerang, Bulwark, class any, rare, once per fight: 0% +2, 2 hits, magic, ignores defence, every enemy, drain 50%, Overextend + Tiring + Ward 1); warrior starting deck Attack, Attack, Defend, Bellow → Attack, Attack, Defend, Bellow, Defend, Ward. The export also added Overextend to the shared Ward; the validator rejected that and the designer dropped it, so Ward is unchanged. Warrior gauntlet, 1000 runs, greedy policy:

```
loadout                        reach boss  beat boss  hp@boss fights rounds  deaths
warrior fresh                       25.4%       0.0%      5.6   2.62   20.4  adept_necromancer 30%, boar 27%, gatekeeper 25%
warrior Bulwark                     39.1%       0.0%     10.6   2.82   28.9  gatekeeper 39%, boar 27%, adept_necromancer 24%
warrior Berserker                   81.1%       0.0%     11.2   3.75   13.6  gatekeeper 81%, boar 8%, adept_necromancer 6%
warrior Bulwark+gear1               85.8%       0.0%     16.5   3.76   30.5  gatekeeper 86%, boar 9%, adept_necromancer 4%
warrior Berserker+gear1             99.1%       0.0%     17.7   3.99   13.7  gatekeeper 99%, boar 1%, adept_necromancer 0%
warrior both sets+gear1             95.8%       0.5%     18.2   3.95   21.1  gatekeeper 95%, boar 2%, adept_necromancer 1%
```

Against the previous import: fresh 56.5% → 25.4% reach, Berserker 92.1% → 81.1%, Bulwark+gear1 87.8% → 85.8%, both sets+gear1 beat boss 1.8% → 0.5%. Two more non-attacking basics dilute the hand for every loadout; Bulwark's reach is unchanged and it arrives with more HP (9.0 → 10.6).

## Cards import 2026-10-27 (Spirit Boomerang)

Changed: spiritboomerang (10% +4 → 0% +1, 2 hits, magic, now ignores defence; still every enemy, once per fight, Overextend + Tiring). Warrior gauntlet, 1000 runs, greedy policy:

```
loadout                        reach boss  beat boss  hp@boss fights rounds  deaths
warrior fresh                       56.5%       0.0%      4.9   3.46   16.3  gatekeeper 57%, adept_necromancer 23%, boar 11%
warrior Bulwark                     39.1%       0.0%      9.0   2.89   28.0  gatekeeper 39%, adept_necromancer 32%, boar 19%
warrior Berserker                   92.1%       0.0%     14.2   3.87   12.0  gatekeeper 92%, boar 4%, adept_necromancer 3%
warrior Bulwark+gear1               87.8%       0.0%     14.2   3.84   29.4  gatekeeper 88%, adept_necromancer 6%, boar 5%
warrior Berserker+gear1             99.4%       0.0%     20.4   3.99   12.2  gatekeeper 99%, boar 0%, hex_imp 0%
warrior both sets+gear1             97.8%       1.8%     18.6   3.99   20.8  gatekeeper 96%, boar 1%, adept_necromancer 0%
```

Against the committed cards just before this import (same seeds): Berserker 99.7% → 92.1% reach, both sets+gear1 3.4% → 1.8% beat boss; fresh and Bulwark rows are unchanged. The fresh and Bulwark rows differ from the table below because Bellow joined the warrior's starting deck (DECISIONS #45) after that table was taken.

## Cards import 2026-10-27 (first editor export)

Changed: shield_bash (60% → 25%), broadsword (100% +4 → 110% +4, uncommon), exposing_strike (100% → 75%), warding_blast (renamed Explosive Potion, 60% → 50% magic); new: spiritboomerang (Berserker: 10% +4, 2 hits, magic, every enemy, once per fight, Overextend + Tiring), bellow (basic rarity, in no basics list, so it is never dealt and never drops). Warrior gauntlet, 1000 runs, greedy policy:

```
loadout                        reach boss  beat boss  hp@boss fights rounds  deaths
warrior fresh                       72.9%       0.0%      5.8   3.66   18.6  gatekeeper 73%, adept_necromancer 23%, rat_pack 5%
warrior Bulwark                     57.8%       0.0%     10.3   3.29   30.3  gatekeeper 58%, adept_necromancer 27%, boar 10%
warrior Berserker                  100.0%       0.0%     15.6   4.00   11.4  gatekeeper 100%
warrior Bulwark+gear1               92.9%       0.0%     15.1   3.90   30.6  gatekeeper 93%, adept_necromancer 5%, boar 1%
warrior Berserker+gear1            100.0%       0.1%     21.2   4.00   11.4  gatekeeper 100%
warrior both sets+gear1             99.8%       7.8%     20.8   4.08   20.6  gatekeeper 92%, boar 0%
```

## Targets (DECISIONS #1, #6)

- Fresh runs should almost never reach Boss 1. ✅ (≤ 5%)
- A run that found both set tomes should reach Boss 1 often but beat him only with the right read. ✅
- Set + screen-1 kit should beat Boss 1 most of the time. ✅ for guard-bearing sets; ❌ Berserker and Stormcaller (pure damage, no block) still lose the rhythm fight.
- Screen 2 should need screen-2 gear and a bigger deck. ✅ for Bulwark, Cryomancy, Spiritcaller; ❌ pure damage sets vs the Warden.

## Changes after the first fresh run under the tree lock (DECISIONS #42)

- **General tomes are family cards; nothing drops without a node.** The sim's "set" loadouts now carry the family's generals too (Berserker = Broadsword, Exposing Strike, Mighty Blow, Last Strike; Bulwark = Shield Bash, Bind Wound, Warding Blast, Stand Firm, Final Stand), so the set rows are richer decks than before. "Fresh" is basics only, which for a warrior is now Attack, Attack, Defend (no Ward).
- **All four special tomes are fleeting**: the gauntlet drops a tome from its deck once it is played, the way the run does (the table was produced under the short-lived "once per screen" rule, which behaves identically inside one gauntlet).
- **Duos 30% on screen 1, selling 25%**: neither is modelled by the sim (no duos, no loot).
- This is the first re-run of the table since the pacing pass (#30 cut enemy HP a third), Bind Wound once per fight (#38) and the heal nerfs (#39), so the deltas against the old table carry all of those at once. The two that matter: under greedy play a fresh warrior now reaches Andre about three times in four (the four-fight gauntlet is short, and the greedy policy never holds a card), and Bulwark no longer beats him on its own (a single 25% Bind Wound is not a plan). The policy plays Mighty Blow in the first fight it is dealt, which is the choice fleeting is meant to create; a smarter policy would hold it, and the "both sets" rows are the ones to read for a run that found its cards.
- The real fresh run that prompted this (docs/audit, IRON-CROW-8003) had 11 fights, 3 duos and a shop, none of which the gauntlet has. Treat these as floors for a deck, not as run outcomes.

## Changes after phone test 7

- **Physical vs magic**: Guard stops only physical hits, the new **Ward** basic stops only magic, Aegis stops both. Basics are now Attack ×2, Defend, Ward (one more dead card against physical enemies on screen 1). **Shield Bash** and the new **Warding Blast** are tiring: Weak on your next turn. Witch and Necromancer cast; everything else is physical. Enemy Guard is physical-only, so spells pass a guarding boss.

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
warrior fresh                       72.9%       0.0%      5.8   3.66   18.6  gatekeeper 73%, adept_necromancer 23%, rat_pack 5%
warrior Bulwark                     91.4%       0.0%     11.9   3.87   38.5  gatekeeper 91%, adept_necromancer 5%, boar 3%
warrior Berserker                  100.0%       0.0%     19.7   4.00   11.0  gatekeeper 100%
warrior Bulwark+gear1               99.6%       0.0%     17.7   3.99   36.3  gatekeeper 100%, adept_necromancer 0%, boar 0%
warrior Berserker+gear1            100.0%       2.2%     24.8   4.02   12.1  gatekeeper 98%
warrior both sets+gear1             99.9%      26.1%     22.1   4.26   22.9  gatekeeper 74%, boar 0%

wizard fresh                         1.1%       0.0%      1.9   1.65   26.4  adept_necromancer 32%, boar 30%, rat_pack 16%
wizard Pyromancy                    99.3%       8.0%     13.8   4.07    9.5  gatekeeper 91%, rat_pack 0%, boar 0%
wizard Cryomancy                    88.6%      15.6%      9.8   3.96   29.4  gatekeeper 73%, boar 6%, rat_pack 4%
wizard Pyromancy+gear1             100.0%      25.5%     19.5   4.25    9.2  gatekeeper 75%
wizard Cryomancy+gear1              98.5%      49.7%     15.3   4.47   29.7  gatekeeper 49%, boar 1%, rat_pack 0%
wizard both sets+gear1             100.0%      80.0%     19.2   4.80   16.4  gatekeeper 20%

shaman fresh                        19.1%       0.0%      3.4   2.56   14.9  boar 32%, adept_necromancer 30%, gatekeeper 19%
shaman Spiritcaller                 89.7%       0.0%     12.1   3.82   31.0  gatekeeper 90%, boar 9%, adept_necromancer 0%
shaman Stormcaller                  92.8%       0.0%     11.6   3.90   11.0  gatekeeper 93%, boar 5%, adept_necromancer 1%
shaman Spiritcaller+gear1           98.0%       0.0%     16.7   3.96   30.3  gatekeeper 98%, boar 2%, adept_necromancer 0%
shaman Stormcaller+gear1            99.0%       1.2%     16.9   4.00   11.7  gatekeeper 98%, boar 1%, adept_necromancer 0%
shaman both sets+gear1              99.3%      11.1%     16.9   4.10   19.8  gatekeeper 88%, boar 1%, shell_beetle 0%
```

## Screen 2 (500 runs, screen-2 kit)

```
loadout, greedy policy

loadout                        reach boss  beat boss  hp@boss fights rounds  deaths
warrior fresh                        0.6%       0.0%      6.0   0.64   15.5  ogre 46%, iron_knight 39%, harpies 14%
warrior Bulwark                     12.6%       0.0%     12.0   1.46   45.5  ogre 63%, iron_knight 13%, warden 13%
warrior Berserker                    0.0%       0.0%      0.0   0.68   11.6  ogre 46%, iron_knight 38%, harpies 9%
warrior Bulwark+gear2               79.2%      66.6%     18.8   4.23   54.4  ogre 20%, warden 13%, harpies 1%
warrior Berserker+gear2             60.0%       4.2%     10.8   3.44   19.9  warden 56%, ogre 22%, iron_knight 9%
warrior both sets+gear2             71.4%      30.8%     15.7   3.73   31.1  warden 41%, ogre 27%, harpies 1%

wizard fresh                         0.2%       0.0%      2.0   0.36    9.6  ogre 38%, iron_knight 34%, harpies 28%
wizard Pyromancy                     0.2%       0.0%      2.0   0.78    7.2  ogre 47%, iron_knight 27%, harpies 19%
wizard Cryomancy                     0.8%       0.0%      6.5   1.13   19.2  ogre 42%, harpies 41%, witch 13%
wizard Pyromancy+gear2              67.4%      17.6%     13.3   3.57   14.9  warden 50%, ogre 25%, iron_knight 4%
wizard Cryomancy+gear2              89.4%      54.4%     12.6   4.38   32.1  warden 35%, ogre 9%, witch 1%
wizard both sets+gear2              89.6%      55.0%     15.2   4.35   19.0  warden 35%, ogre 8%, harpies 1%

shaman fresh                         0.4%       0.0%      5.0   0.56   12.8  ogre 43%, iron_knight 37%, harpies 19%
shaman Spiritcaller                  2.8%       0.0%      9.6   0.78   18.4  ogre 48%, iron_knight 41%, harpies 6%
shaman Stormcaller                   0.0%       0.0%      0.0   0.90   10.7  ogre 50%, iron_knight 21%, witch 15%
shaman Spiritcaller+gear2           73.4%      56.2%     18.9   3.98   37.0  ogre 27%, warden 17%
shaman Stormcaller+gear2            45.2%       0.6%      7.2   3.09   17.7  warden 45%, ogre 36%, harpies 7%
shaman both sets+gear2              71.2%      29.2%     15.4   3.70   24.8  warden 42%, ogre 28%, iron_knight 1%
```

## Pacing pass (DECISIONS #30) and duos (DECISIONS #29)

Greedy-sim duels, fresh warrior (basics only), 200 fights each, after the pass:

| Enemy | Rounds | HP left |
|---|---|---|
| Boar | 4.0 | 68% |
| Shell Beetle | 4.0 | 76% |
| Hex Imp | 3.0 | 76% |
| Adept Necromancer | 6.3 | 59% |
| Rat Pack | 3.5 | 81% |

Gauntlet (4 wild fights then Knight Andre): fresh warrior reaches the boss 41% (was 8%), beats it 0%; Bulwark+gear1 beats it 92% in ~30 rounds (the greedy tank defends every third round; humans with Broadsword do it in far fewer). Tier 2: Bulwark+gear2 beats the Warden 18%, dies to him 60%. Duos are not in the sim yet; their first numbers come from the run log.


## Node-map playthrough 1 (2026-10-26, ASH-ELK-4673)

Warrior, Berserker + Bulwark heirlooms, no gear at start. All 11 fight nodes on screen 1 cleared,
then the gate (where a crash stopped the run; fixed). Singles ended in 1–3 rounds (Last Strike
one-shot two of them). The three duo fights took 29, 24 and 37 damage over 7–11 rounds; everything
else combined took 21. Healed 80 of 129 taken. Gold 154 by fight 9, 145 spent at the shop (heal,
mace, shirt, Final Stand). Reading: trash pacing is right, duos are the game, sustain erased the
attrition that should make a full clear a gamble. Change: Bind Wound once per fight (DECISIONS #38).

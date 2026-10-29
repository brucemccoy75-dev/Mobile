# Playtests: reading a run log against the simulator

Every real run writes a record (DECISIONS #26). After a session of play the designer taps **run
log** on the title or end screen and sends the JSON. Each run log is read the same way, every
time, against the simulator. The question is always "how often does the sim get to the boss, and
how often did the designer?" (DECISIONS #67).

## Procedure (every run log, every session)

1. **Save the log** as `docs/playtests/<date>-runs.json`, with the date the runs were played.
   It holds the last 20 runs, so a later log overlaps an earlier one; keep both.
2. **Compare it with the sim:** `npm run playtest -- docs/playtests/<date>-runs.json`. It groups
   the finished runs by heirloom families and prints them next to the **screen mirror** for the
   same families at the group's median level. The comparison covers:
   - how often each reaches the boss and beats it;
   - fights won;
   - the share of deaths that came in duos.

   It also prints the top deaths, HP regained between fights, rounds per fight and the duo share
   of fights.
3. **Run both sim tables:**
   - `npm run sim -- --screen --class warrior` (the mirror for every loadout);
   - `npm run sim -- --class warrior` (the four-fight gauntlet, the historic floor every BALANCE.md
     table since milestone 1 is in).
4. **Write it up** as a new section at the top of `docs/BALANCE.md`:
   `## Phone test N (run log <date>)`, where N is the last phone test plus one. Include:
   - the playtest table and both sim tables, pasted as they print;
   - a reading, in this order:
     - where the real runs and the mirror agree, and where they part (and why: loot, the shop,
       smarter play, sample size);
     - what the log says against the **Targets** section of BALANCE.md;
     - what changed since the last phone test;
     - the open questions.
5. **Recommend; don't change.** Put proposed changes to the designer; numbers move only when the
   designer says so. Cards still change only through editor imports. An accepted change becomes
   a DECISIONS.md entry and is followed by a re-run of steps 2–3.
6. **Point NEXT.md at it:** "Start here" names the latest phone test and its headline numbers.

## What the two sims are

- **Screen mirror** (`src/core/sim/screen.ts`, `--screen`):
  - plays the real authored map, rolled from the seed with the designer's node rules
    (`world.json`), so its duos, unknowns and shrine are the ones a player meets;
  - opens with two heirlooms drawn the way a run draws them, and carries HP over;
  - saves the shrine for when HP is at half or less, or for the gate;
  - fights the gate as the designer meets it: Knight Andre while the story is off (DECISIONS #72).
    `--boss wren` is for logs from when Wren held the gate (with the player's weapon);
  - has two routes: **clear** (every fight on the screen, as the designer plays) and **short**
    (only the shortest road to the gate).
- **Gauntlet** (`src/core/sim/gauntlet.ts`, default): four random single fights then Andre, with
  the whole family in the deck. A floor for a deck, not a run.

Neither models loot, gold, the shop, level-ups during a run, quests or dialogue. Both use the
greedy intent-reading policy (`src/core/sim/policy.ts`), which never holds a card and plays worse
than a person. So read the sim as a floor. When real runs beat it, look at what they had that it
doesn't (the log's rewards and shop list say).

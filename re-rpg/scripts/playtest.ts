// Read a run log against the simulator (DECISIONS #67; procedure in docs/PLAYTESTS.md).
//   npm run playtest -- docs/playtests/2026-10-28-runs.json
//   npm run playtest -- <log.json> --runs 2000 --boss wren   (for logs from when Wren held the gate)
// For each group of finished runs (by heirloom families) it prints what really happened, then
// the screen mirror for the same families at the group's median level, full clear and shortest
// road, so "how often does the sim reach the boss" sits next to "how often did you".
import { readFileSync } from 'node:fs';
import { SETS } from '@data/index';
import type { ClassId } from '@data/types';
import { LEVEL_HP } from '@data/progression';
import { summarizeRuns, type TelemetryLog } from '@core/telemetry';
import { greedy } from '@core/sim/policy';
import { runScreen, type Gate, type Route, type ScreenResult } from '@core/sim/screen';

const args = process.argv.slice(2);
const opt = (name: string, def: string) => { const i = args.indexOf(`--${name}`); return i >= 0 && args[i + 1] !== undefined ? args[i + 1]! : def; };
const file = args.find((a) => !a.startsWith('--') && !/^\d+$/.test(a) && a !== opt('boss', ''));
if (!file) { console.error('usage: npm run playtest -- <run-log.json> [--runs 1000] [--boss wren|gatekeeper]'); process.exit(1); }
const runs = Number(opt('runs', '1000'));
const boss = opt('boss', 'gatekeeper') as Gate; // Knight Andre while the story is off (#72)

const log = JSON.parse(readFileSync(file, 'utf8')) as TelemetryLog;
const classes = [...new Set(log.runs.map((r) => r.classId))];
const name = (id: string) => SETS.find((s) => s.id === id)?.name ?? id;
const pct = (n: number) => `${n.toFixed(0)}%`.padStart(5);
const median = (xs: number[]) => [...xs].sort((a, b) => a - b)[xs.length >> 1] ?? 1;
const top = (deaths: Record<string, number>, n: number) => Object.entries(deaths).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k, v]) => `${k} ${((100 * v) / n).toFixed(0)}%`).join(', ');

const finished = log.runs.filter((r) => r.outcome === 'died' || r.outcome === 'won').length;
console.log(`\n${file}: ${log.runs.length} runs, ${finished} finished (abandoned and ongoing runs are left out)`);
console.log(`Sim: screen mirror, ${runs} runs per row, greedy policy, gate = ${boss}. Logs from before 2026-10-29 may have met Wren there (--boss wren).\n`);

for (const classId of classes) {
  const groups = summarizeRuns({ ...log, runs: log.runs.filter((r) => r.classId === classId) }, name);
  console.log(`${classId}\n`);
  console.log(`${'group'.padEnd(28)} ${'n'.padStart(3)} ${'lvl'.padStart(3)} | ${'reach boss'.padStart(16)} | ${'beat boss'.padStart(16)} | ${'fights won'.padStart(16)} | ${'deaths in duos'.padStart(16)}`);
  console.log(`${''.padEnd(36)} | ${'real  clear short'.padStart(16)} | ${'real  clear short'.padStart(16)} | ${'real  clear short'.padStart(16)} | ${'real  clear short'.padStart(16)}`);
  const details: string[] = [];
  for (const g of groups) {
    const level = median(g.levels);
    const lo = { label: g.label, classId: classId as ClassId, deck: [], families: g.families.length ? g.families : undefined, statMods: { maxHp: (level - 1) * LEVEL_HP } };
    const sim = (route: Route) => {
      const rs: ScreenResult[] = Array.from({ length: runs }, (_, i) => runScreen({ loadout: lo, route, boss, policy: greedy, seed: `mirror-${i}` }));
      const dead = rs.filter((r) => r.deathBy);
      const deaths: Record<string, number> = {};
      for (const r of dead) deaths[r.deathBy!] = (deaths[r.deathBy!] ?? 0) + 1;
      return {
        reach: (100 * rs.filter((r) => r.reachedBoss).length) / runs,
        beat: (100 * rs.filter((r) => r.beatBoss).length) / runs,
        won: rs.reduce((s, r) => s + r.fightsWon, 0) / runs,
        duoDeaths: dead.length ? (100 * dead.filter((r) => r.deathInDuo).length) / dead.length : 0,
        fights: rs.reduce((s, r) => s + r.fights, 0) / runs,
        deaths: top(deaths, runs),
      };
    };
    const c = sim('clear'), s = sim('short');
    const f1 = (n: number) => n.toFixed(1).padStart(5);
    console.log(`${g.label.padEnd(28)} ${String(g.runs).padStart(3)} ${String(level).padStart(3)} | ${pct(g.reachBossPct)} ${pct(c.reach)} ${pct(s.reach)} | ${pct(g.beatBossPct)} ${pct(c.beat)} ${pct(s.beat)} | ${f1(g.avgFightsWon)} ${f1(c.won)} ${f1(s.won)} | ${pct(g.duoDeathPct)} ${pct(c.duoDeaths)} ${pct(s.duoDeaths)}`);
    details.push(`${g.label}: real deaths ${top(g.deaths, g.runs) || 'none'}; HP back between fights (median) ${g.medianRegen}; ${g.avgRoundsPerFight.toFixed(1)} rounds a fight; duos ${g.duoFightPct.toFixed(0)}% of fights.`);
    details.push(`${''.padEnd(g.label.length)}  sim clear (${c.fights.toFixed(1)} fights on the route): ${c.deaths}`);
    details.push(`${''.padEnd(g.label.length)}  sim short (${s.fights.toFixed(1)} fights on the route): ${s.deaths}`);
  }
  console.log(`\n${details.join('\n')}\n`);
}

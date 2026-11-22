// npm run sim -- [--n 40] [--seed 1] [--samples 120]
import { mulberry32 } from '../engine/rng';
import { mixedLineup, runTournament, summarize } from './run';

const args = process.argv.slice(2);
const opt = (name: string, def: string) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : def;
};
const n = Number(opt('n', '40'));
const seed = Number(opt('seed', '1'));
const samples = Number(opt('samples', '120'));

const started = Date.now();
const reports = [];
for (let i = 0; i < n; i++) {
  const s = seed + i;
  const rng = mulberry32(s * 7919);
  const lineup = mixedLineup(rng);
  reports.push(runTournament(lineup, { seed: s, samples }));
  process.stdout.write(`\rtournament ${i + 1}/${n}`);
}
console.log(`\n${n} tournaments in ${((Date.now() - started) / 1000).toFixed(1)}s`);

const { types, avgHands, players } = summarize(reports);
console.log(`avg hands per tournament: ${avgHands.toFixed(1)}\n`);
const pct = (x: number) => `${(100 * x).toFixed(0).padStart(3)}%`;
console.log('type         seats  avgFin  wins  vpip  pfr   aggr  f2bet  sdWon  maxTilt');
for (const t of [...types].sort((a, b) => a.avgFinish - b.avgFinish)) {
  console.log(
    `${t.type.padEnd(12)} ${String(t.seats).padStart(5)}  ${t.avgFinish.toFixed(2).padStart(6)}  ${String(t.wins).padStart(4)}  ` +
      `${pct(t.vpip)}  ${pct(t.pfr)}  ${pct(t.aggression)}  ${pct(t.foldToBet)}   ${pct(t.wtsdWon)}  ${t.avgMaxClarity.toFixed(0).padStart(5)}`,
  );
}
console.log('\nplayer        avgFin  n');
for (const [id, p] of Object.entries(players).sort((a, b) => a[1].avg - b[1].avg)) {
  console.log(`${id.padEnd(12)}  ${p.avg.toFixed(2).padStart(6)}  ${p.finishes.length}`);
}

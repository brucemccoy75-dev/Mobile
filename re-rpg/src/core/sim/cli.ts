import { basicsFor } from '@data/skills';
// Headless balance simulator.
//   npm run sim                       all classes, screen 1 gauntlet, 1000 runs each
//   npm run sim -- --runs 5000 --class warrior --fights 4 --tier 1 --boss gatekeeper
//   npm run sim -- --duel boar        one-on-one win rates against a single enemy
//   npm run sim -- --screen --class warrior   the screen-1 mirror (DECISIONS #67): real map, duos, shrine, Knight Andre (--boss wren for Wren)
import { CLASSES, getEnemy } from '@data/index';
import type { ClassId } from '@data/types';
import { RunRng } from '@core/rng';
import { createCombat } from '@core/combat';
import { greedy } from './policy';
import { runFight, runGauntlet, standardLoadouts, summarize, withMods, type Summary } from './gauntlet';
import { runScreen, screenLoadouts, type Gate, type Route } from './screen';

const args = process.argv.slice(2);
const opt = (name: string, def: string) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] !== undefined ? args[i + 1]! : def;
};
const runs = Number(opt('runs', '1000'));
const fights = Number(opt('fights', '4'));
const tier = Number(opt('tier', '1')) as 1 | 2;
const boss = opt('boss', tier === 1 ? 'gatekeeper' : 'warden');
const classFilter = opt('class', '');
const duel = opt('duel', '');
const classes = (classFilter ? [classFilter] : CLASSES.map((c) => c.id)) as ClassId[];

const pct = (n: number) => `${n.toFixed(1).padStart(5)}%`;
const screen = args.includes('--screen');

if (screen) {
  const gate = opt('boss', 'gatekeeper') as Gate; // Knight Andre: the story (and Wren) is off, #72
  console.log(`\nScreen-1 mirror: the real map per seed (duos, shrine), two heirlooms, gate = ${gate}, ${runs} runs per loadout, greedy policy\n`);
  for (const classId of classes) {
    for (const route of ['clear', 'short'] as Route[]) {
      console.log(`${(route === 'clear' ? 'full clear' : 'shortest road').padEnd(30)} ${'reach boss'.padStart(10)} ${'beat boss'.padStart(10)} ${'hp@boss'.padStart(8)} ${'fights'.padStart(6)} ${'rounds'.padStart(6)}  deaths`);
      for (const lo of screenLoadouts(classId)) {
        const results = Array.from({ length: runs }, (_, i) => runScreen({ loadout: lo, route, boss: gate, policy: greedy, seed: `mirror-${i}` }));
        const s = summarize(lo.label, results);
        const deaths = Object.entries(s.deaths).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k, v]) => `${k} ${((100 * v) / runs).toFixed(0)}%`).join(', ');
        console.log(`${s.label.padEnd(30)} ${pct(s.reachBossPct).padStart(10)} ${pct(s.beatBossPct).padStart(10)} ${s.avgHpAtBoss.toFixed(1).padStart(8)} ${s.avgFightsWon.toFixed(2).padStart(6)} ${s.avgRounds.toFixed(1).padStart(6)}  ${deaths}`);
      }
      console.log('');
    }
  }
} else if (duel) {
  const enemy = getEnemy(duel);
  console.log(`\nDuel vs ${enemy.name} (${runs} fights each)\n`);
  for (const classId of classes) {
    for (const lo of standardLoadouts(classId)) {
      let wins = 0, hpLeft = 0, rounds = 0;
      for (let i = 0; i < runs; i++) {
        const rng = new RunRng(`duel-${i}`);
        const cls = CLASSES.find((c) => c.id === classId)!;
        const stats = withMods(cls.stats, lo.statMods);
        const s = runFight(createCombat({ player: { stats, deck: lo.deck, basics: basicsFor(lo.classId) }, enemy, rng: rng.stream('combat') }), greedy);
        if (s.outcome === 'won') { wins++; hpLeft += s.player.hp / stats.maxHp; }
        rounds += s.round;
      }
      console.log(`${lo.label.padEnd(30)} win ${pct((100 * wins) / runs)}  hp left ${pct((100 * hpLeft) / Math.max(1, wins))}  rounds ${(rounds / runs).toFixed(1)}`);
    }
  }
} else {
  console.log(`\nGauntlet: ${fights} random tier-${tier} fights then ${boss}, ${runs} runs per loadout, greedy policy\n`);
  console.log(`${'loadout'.padEnd(30)} ${'reach boss'.padStart(10)} ${'beat boss'.padStart(10)} ${'hp@boss'.padStart(8)} ${'fights'.padStart(6)} ${'rounds'.padStart(6)}  deaths`);
  const all: Summary[] = [];
  for (const classId of classes) {
    for (const lo of standardLoadouts(classId, tier)) {
      const results = Array.from({ length: runs }, (_, i) => runGauntlet({ loadout: lo, fights, tier, boss, policy: greedy, seed: `sim-${i}` }));
      const s = summarize(lo.label, results);
      all.push(s);
      const deaths = Object.entries(s.deaths).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k, v]) => `${k} ${((100 * v) / runs).toFixed(0)}%`).join(', ');
      console.log(`${s.label.padEnd(30)} ${pct(s.reachBossPct).padStart(10)} ${pct(s.beatBossPct).padStart(10)} ${s.avgHpAtBoss.toFixed(1).padStart(8)} ${s.avgFightsWon.toFixed(2).padStart(6)} ${s.avgRounds.toFixed(1).padStart(6)}  ${deaths}`);
    }
    console.log('');
  }
}

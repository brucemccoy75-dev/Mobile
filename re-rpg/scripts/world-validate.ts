/**
 * Import gate for a world.json produced by the world editor (docs/WORLD.md, DECISIONS #55).
 *
 *   npm run world:validate            checks src/data/world.json against the committed version
 *   npm run world:validate -- FILE    checks FILE (an exported world.json) against the committed version
 *
 * Prints one line per problem and exits 1; prints the list of changes and exits 0 when clean.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { diffWorld, validateWorld, type WorldData } from '../src/data/worldSchema';

const file = process.argv[2] ?? 'src/data/world.json';
const data = JSON.parse(readFileSync(file, 'utf8')) as WorldData;
let shipped: WorldData | undefined;
try { shipped = JSON.parse(execFileSync('git', ['show', 'HEAD:./src/data/world.json'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })) as WorldData; }
catch { console.log('note: no committed world.json yet; the file is checked on its own'); }
const problems = validateWorld(data);
if (problems.length) {
  console.log(`${file}: ${problems.length} problem${problems.length === 1 ? '' : 's'}`);
  for (const p of problems) console.log('  - ' + p);
  process.exit(1);
}
const changes = shipped ? diffWorld(shipped, data) : [];
console.log(`${file}: valid. ${changes.length ? 'Changes from the committed world:' : 'No changes from the committed world.'}`);
for (const c of changes) console.log('  - ' + c);

/**
 * Import gate for a cards.json produced by the card editor (docs/CARDS.md, DECISIONS #44).
 *
 *   npm run cards:validate            checks src/data/cards.json against the committed version
 *   npm run cards:validate -- FILE    checks FILE (an exported cards.json) against the committed version
 *
 * Prints one line per problem and exits 1; prints the list of changes and exits 0 when clean.
 * Nothing is written. The import procedure copies the file into place first, then runs this.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { CARDS_VERSION, validateCards, diffCards, type CardsData } from '../src/data/cardsSchema';

const file = process.argv[2] ?? 'src/data/cards.json';
const data = JSON.parse(readFileSync(file, 'utf8')) as CardsData;
let shipped: CardsData;
try {
  shipped = JSON.parse(execFileSync('git', ['show', 'HEAD:./src/data/cards.json'], { encoding: 'utf8' })) as CardsData;
} catch {
  console.error('could not read the committed cards.json from git; run this inside the repository');
  process.exit(2);
}
// A committed file from before this format cannot be a baseline: validate the file alone and say so.
const baseline = shipped.version === CARDS_VERSION ? shipped : undefined;
if (!baseline) console.log('note: the committed cards.json is an older format; import rules (removed ids, other classes untouched) were not checked');
const problems = validateCards(data, baseline);
if (problems.length) {
  console.log(`${file}: ${problems.length} problem${problems.length === 1 ? '' : 's'}`);
  for (const p of problems) console.log('  - ' + p);
  process.exit(1);
}
const changes = baseline ? diffCards(baseline, data) : [];
console.log(`${file}: valid. ${changes.length ? 'Changes from the committed cards:' : 'No changes from the committed cards.'}`);
for (const c of changes) console.log('  - ' + c);

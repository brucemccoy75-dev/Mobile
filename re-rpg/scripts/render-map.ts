import { RunRng } from '@core/rng';
import { parseScreen, renderAscii } from '@core/map';
import { SCREEN1 } from '@data/maps/screen1';
import { SCREEN2 } from '@data/maps/screen2';
for (const [i, a] of [SCREEN1, SCREEN2].entries()) {
  try { const m = parseScreen(a, new RunRng('x').stream('map'), { seed: 'x', screenIndex: i }); console.log(renderAscii(m)); console.log(m.nodes!.map(n=>`${n.id}:${n.kind}:${n.enemyId}${n.extra?'+'+n.extra:''}`).join(' '), '\n', m.pois.map(p=>`${p.id}@${p.pos.x},${p.pos.y} cost ${p.cost.toFixed(0)} guard ${p.guardId}`).join(' | ')); }
  catch (e) { console.log('screen', i + 1, (e as Error).message); }
}

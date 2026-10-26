import { RunRng } from '@core/rng';
import { parseScreen, renderAscii } from '@core/map';
import { SCREEN1 } from '@data/maps/screen1';
import { SCREEN2 } from '@data/maps/screen2';
for (const [i, a] of [SCREEN1, SCREEN2].entries()) {
  const m = parseScreen(a, new RunRng(process.argv[2] ?? 'x').stream('map'), { seed: 'x', screenIndex: i });
  console.log(renderAscii(m));
  console.log(m.nodes!.map((n) => `${n.id}:${n.kind}${n.enemyId ? ':' + n.enemyId : ''}${n.extra ? '+' + n.extra : ''}@${n.pos.x},${n.pos.y}->[${n.links.join(',')}]`).join('\n'));
}

// Playthrough: title -> class select -> a fight, playing the first card each round. Screenshots to [outDir].
// Usage: npm run build && (npm run preview -- --port 4173 &) && node scripts/playthrough.cjs smoke-out
const { chromium } = require('playwright');
(async () => {
  const out = process.argv[2] ?? 'smoke-out'; require('fs').mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 844, height: 390 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errors.push(m.text()); });
  page.on('pageerror', e => errors.push(String(e)));
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
  const active = (name) => page.waitForFunction((n) => window.__rerpg && window.__rerpg.scene.isActive(n), name, { timeout: 15000 });
  await active('Title');
  // game->css coords: game is 1169x540 in an 844x390 css canvas
  const g = await page.evaluate(() => [window.__rerpg.scale.gameSize.width, window.__rerpg.scale.gameSize.height]);
  const sx = 844 / g[0], sy = 390 / g[1];
  const tap = async (gx, gy) => { await page.touchscreen.tap(gx * sx, gy * sy); };
  await tap(g[0] / 2, g[1] / 2);
  await active('ClassSelect');
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${out}/m2-classselect.png` });
  // pick the middle class (wizard) then Begin
  await tap(g[0] / 2, g[1] / 2 - 20);
  await page.waitForTimeout(200);
  await tap(g[0] / 2, g[1] - 46);
  await active('Combat');
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${out}/m2-combat-r1.png` });
  const info = async () => page.evaluate(() => { const s = window.__rerpg.scene.getScene('Combat'); const st = s.state; return { round: st.round, hp: st.player.hp, ehp: st.enemy.hp, hand: st.player.hand, outcome: st.outcome, enemy: st.enemyDef.id, intent: st.enemy.current.name }; });
  console.log('start', JSON.stringify(await info()));
  // play: tap first card if any, else attack; up to 8 rounds
  for (let i = 0; i < 14; i++) {
    const st = await info();
    if (st.outcome !== 'ongoing') break;
    if (st.hand.length > 0) await tap(g[0] / 2 - (st.hand.length - 1) * 76, g[1] - 66); else await tap(92, g[1] - 66);
    await page.waitForTimeout(4200);
    if (i === 3) await page.screenshot({ path: `${out}/m2-combat-r4.png` });
  }
  console.log('end', JSON.stringify(await info()));
  await page.waitForTimeout(3000);
  await page.screenshot({ path: `${out}/m2-combat-end.png` });
  console.log('errors', JSON.stringify(errors));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });

// Playthrough: new run -> pretend the boss just fell -> the "Onward" overlay must be tappable and move to screen 2.
// Usage: npm run build && (npm run preview -- --port 4173 &) && node scripts/playthrough-boss.cjs smoke-out
const { chromium } = require('playwright');
(async () => {
  const out = process.argv[2] ?? 'smoke-out'; require('fs').mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 844, height: 390 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', m => { if ((m.type() === 'error') && !m.text().includes('GL Driver')) errors.push(m.text()); });
  page.on('pageerror', e => errors.push(String(e)));
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
  const active = (name) => page.waitForFunction((n) => window.__rerpg && window.__rerpg.scene.isActive(n), name, { timeout: 15000 });
  await page.evaluate(() => localStorage.removeItem('rerpg:run'));
  await page.reload({ waitUntil: 'networkidle' });
  await active('Title');
  const g = await page.evaluate(() => [window.__rerpg.scale.gameSize.width, window.__rerpg.scale.gameSize.height]);
  const sx = 844 / g[0], sy = 390 / g[1];
  const tap = async (gx, gy) => page.touchscreen.tap(gx * sx, gy * sy);
  await tap(g[0] / 2, g[1] * 0.66);
  await active('ClassSelect'); await page.waitForTimeout(200);
  await tap(g[0] / 2 - 276, g[1] / 2 - 20); await page.waitForTimeout(150);
  await tap(g[0] / 2, g[1] - 46);
  await active('Overworld'); await page.waitForTimeout(500);
  // Stand in the arena with the boss "just beaten", as the combat scene would hand it back.
  await page.evaluate(() => {
    const s = window.__rerpg.registry.get('session');
    s.playerPos = { x: s.map.boss.x - 1, y: s.map.boss.y };
    s.lastResult = { encounter: { kind: 'boss', enemyId: s.map.bossId }, won: true };
    window.__rerpg.scene.getScene('Overworld').scene.restart();
  });
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${out}/boss-cleared.png` });
  const before = await page.evaluate(() => window.__rerpg.registry.get('session').screenIndex);
  await tap(g[0] / 2, g[1] * 0.64); // Onward
  await page.waitForTimeout(900);
  const after = await page.evaluate(() => { const s = window.__rerpg.registry.get('session'); return { screen: s.screenIndex, pos: s.playerPos, entry: s.map.entry, boss: s.map.bossId, hp: s.hp }; });
  console.log(JSON.stringify({ before, after, onwardWorked: after.screen === before + 1, errors }));
  await page.screenshot({ path: `${out}/screen2.png` });
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });

// Playthrough: new run -> teleport beside the shop with gold -> buy an item and the heal -> leave -> reload -> Continue restores it.
// Usage: npm run build && (npm run preview -- --port 4173 &) && node scripts/playthrough-shop.cjs smoke-out
const { chromium } = require('playwright');
(async () => {
  const out = process.argv[2] ?? 'smoke-out'; require('fs').mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 844, height: 390 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', m => { if ((m.type() === 'error' || m.type() === 'warning') && !m.text().includes('GL Driver')) errors.push(m.text()); });
  page.on('pageerror', e => errors.push(String(e)));
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
  const active = (name) => page.waitForFunction((n) => window.__rerpg && window.__rerpg.scene.isActive(n), name, { timeout: 15000 });
  await page.evaluate(() => { localStorage.removeItem('rerpg:run'); });
  await page.reload({ waitUntil: 'networkidle' });
  await active('Title');
  const g = await page.evaluate(() => [window.__rerpg.scale.gameSize.width, window.__rerpg.scale.gameSize.height]);
  const sx = 844 / g[0], sy = 390 / g[1];
  const tap = async (gx, gy) => page.touchscreen.tap(gx * sx, gy * sy);
  await page.screenshot({ path: `${out}/m5-title.png` });
  await tap(g[0] / 2, g[1] * 0.66);
  await active('ClassSelect');
  await page.waitForTimeout(200);
  await tap(g[0] / 2 - 276, g[1] / 2 - 20);
  await page.waitForTimeout(150);
  await tap(g[0] / 2, g[1] - 46);
  await active('Overworld');
  await page.waitForTimeout(500);
  // Dev shortcut: rich hero standing next to the shop with its guard already beaten.
  await page.evaluate(() => {
    const s = window.__rerpg.registry.get('session');
    const shop = s.map.pois.find(p => p.kind === 'shop');
    const guard = s.map.guards.find(x => x.poiId === shop.id);
    s.defeatedGuards.add(guard.id); s.gold = 200; s.playerPos = { ...guard.pos };
    window.__rerpg.scene.getScene('Overworld').scene.restart();
  });
  await page.waitForTimeout(600);
  const shopPos = await page.evaluate(() => window.__rerpg.registry.get('session').map.pois.find(p => p.kind === 'shop').pos);
  const pt = await page.evaluate(([tx, ty]) => { const sc = window.__rerpg.scene.getScene('Overworld'); const cam = sc.cameras.main; return [(tx * 48 + 24 - cam.scrollX) * cam.zoom, (ty * 48 + 24 - cam.scrollY) * cam.zoom]; }, [shopPos.x, shopPos.y]);
  await tap(pt[0], pt[1]);
  await active('Shop');
  await page.waitForTimeout(500);
  const stock = () => page.evaluate(() => { const s = window.__rerpg.registry.get('session'); return { gold: s.gold, hp: s.hp, maxHp: s.stats.maxHp, lines: s.shop.lines.map(l => `${l.kind}:${l.id}:${l.price}${l.sold ? ':sold' : ''}`), heal: [s.shop.healPrice, s.shop.healUsed], eq: Object.fromEntries(Object.entries(s.equipment).map(([k, v]) => [k, v && v.id])), deck: s.deck }; });
  console.log('shop', JSON.stringify(await stock()));
  await page.screenshot({ path: `${out}/m5-shop.png` });
  // buy the first line
  const n = (await stock()).lines.length + 1;
  const cw = 220, gap = 16;
  const x0 = g[0] / 2 - ((n * cw + (n - 1) * gap) / 2) + cw / 2;
  await tap(x0, g[1] / 2 - 10);
  await page.waitForTimeout(500);
  // wound the hero, then buy the heal (last card)
  await page.evaluate(() => { const s = window.__rerpg.registry.get('session'); s.hp = 5; window.__rerpg.scene.getScene('Shop').render(); });
  await page.waitForTimeout(200);
  await tap(x0 + (n - 1) * (cw + gap), g[1] / 2 - 10);
  await page.waitForTimeout(400);
  console.log('after buys', JSON.stringify(await stock()));
  await page.screenshot({ path: `${out}/m5-shop-after.png` });
  await tap(g[0] / 2, g[1] - 46); // Leave
  await active('Overworld');
  await page.waitForTimeout(400);
  await page.reload({ waitUntil: 'networkidle' });
  await active('Title');
  await page.waitForTimeout(400);
  await tap(g[0] / 2, g[1] * 0.66); // Continue
  await active('Overworld');
  await page.waitForTimeout(400);
  console.log('resumed', JSON.stringify(await stock()));
  console.log('errors', JSON.stringify(errors));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });

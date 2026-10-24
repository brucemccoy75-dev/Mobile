// Playthrough: seeds meta with 2 deaths + a discovery, checks the heirloom, dies, checks RunEnd and run clearing.
// Usage: npm run build && (npm run preview -- --port 4173 &) && node scripts/playthrough-death.cjs smoke-out
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
  await active('Title');
  const g = await page.evaluate(() => [window.__rerpg.scale.gameSize.width, window.__rerpg.scale.gameSize.height]);
  const sx = 844 / g[0], sy = 390 / g[1];
  const tap = async (gx, gy) => page.touchscreen.tap(gx * sx, gy * sy);
  const meta = () => page.evaluate(() => window.__rerpg.registry.get('meta'));
  // seed meta so the heirloom path is exercised: 2 deaths and a discovered item
  await page.evaluate(() => { localStorage.setItem('rerpg:meta', JSON.stringify({ version: 1, updatedAt: 1, deaths: 2, wins: 0, bestScreen: 0, discoveredSkills: ['broadsword'], discoveredItems: ['heart_amulet'] })); localStorage.removeItem('rerpg:run'); });
  await page.reload({ waitUntil: 'networkidle' });
  await active('Title');
  await tap(g[0] / 2, g[1] * 0.66); // New run (no Continue since run removed)
  await active('ClassSelect');
  await page.waitForTimeout(200);
  await page.screenshot({ path: `${out}/m4b-classselect.png` });
  await tap(g[0] / 2 - 276, g[1] / 2 - 20);
  await page.waitForTimeout(150);
  await tap(g[0] / 2, g[1] - 46);
  await active('Overworld');
  await page.waitForTimeout(500);
  const s0 = await page.evaluate(() => { const s = window.__rerpg.registry.get('session'); return { heir: s.heirloomName, deck: s.deck, eq: s.equipment.relic && s.equipment.relic.id, hp: s.hp, maxHp: s.stats.maxHp }; });
  console.log('heirloom start', JSON.stringify(s0));
  await page.screenshot({ path: `${out}/m4b-heirloom.png` });
  // doom the hero and walk into the wilds
  await page.evaluate(() => { window.__rerpg.registry.get('session').hp = 1; });
  const guard = await page.evaluate(() => window.__rerpg.registry.get('session').map.guards[0].pos);
  const tapTile = async (tx, ty) => { const pt = await page.evaluate(([tx, ty]) => { const sc = window.__rerpg.scene.getScene('Overworld'); const cam = sc.cameras.main; return [(tx * 48 + 24 - cam.scrollX) * cam.zoom, (ty * 48 + 24 - cam.scrollY) * cam.zoom]; }, [tx, ty]); await tap(pt[0], pt[1]); };
  for (let leg = 0; leg < 14; leg++) {
    if (await page.evaluate(() => window.__rerpg.scene.isActive('Combat'))) break;
    const cl = await page.evaluate(([gx, gy]) => { const sc = window.__rerpg.scene.getScene('Overworld'); const v = sc.cameras.main.worldView; const c = (n, a, b) => Math.max(a, Math.min(b, n)); return [c(gx, Math.ceil(v.x / 48) + 1, Math.floor(v.right / 48) - 2), c(gy, Math.ceil(v.y / 48) + 2, Math.floor(v.bottom / 48) - 2)]; }, [guard.x, guard.y]);
    await tapTile(cl[0], cl[1]);
    await page.waitForFunction(() => { const sc = window.__rerpg.scene.getScene('Overworld'); return window.__rerpg.scene.isActive('Combat') || (sc && sc.walking === false); }, null, { timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(300);
  }
  await active('Combat');
  await page.waitForTimeout(800);
  const cinfo = () => page.evaluate(() => { const st = window.__rerpg.scene.getScene('Combat').state; return { outcome: st.outcome, hand: st.player.hand.length, hp: st.player.hp }; });
  for (let i = 0; i < 20; i++) {
    const c = await cinfo();
    if (c.outcome !== 'ongoing') break;
    await tap(92, g[1] - 66); // attack into the hit
    await page.waitForTimeout(4200);
  }
  console.log('fight', JSON.stringify(await cinfo()));
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${out}/m4b-dead.png` });
  await tap(g[0] / 2, g[1] * 0.62);
  await active('RunEnd');
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${out}/m4b-runend.png` });
  console.log('meta after death', JSON.stringify(await meta()));
  console.log('run cleared', await page.evaluate(() => !localStorage.getItem('rerpg:run')));
  await tap(g[0] / 2, g[1] - 50); // Try again
  await active('ClassSelect');
  console.log('errors', JSON.stringify(errors));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });

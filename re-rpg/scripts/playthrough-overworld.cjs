// Playthrough: title -> class select -> overworld -> walk until an ambush -> win the fight -> back on the map.
// Usage: npm run build && (npm run preview -- --port 4173 &) && node scripts/playthrough-overworld.cjs smoke-out
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
  await tap(g[0] / 2, g[1] / 2);
  await active('ClassSelect');
  await page.waitForTimeout(200);
  await tap(g[0] / 2 - 276, g[1] / 2 - 20); // warrior
  await page.waitForTimeout(150);
  await tap(g[0] / 2, g[1] - 46);
  await active('Overworld');
  await page.waitForTimeout(700);
  const info = () => page.evaluate(() => { const s = window.__rerpg.registry.get('session'); return { seed: s.seed, pos: s.playerPos, threat: +s.threat.toFixed(2), hp: s.hp, gold: s.gold, entry: s.map.entry, boss: s.map.boss, pois: s.map.pois.map(p => [p.kind, p.pos.x, p.pos.y]), guards: s.map.guards.map(x => [x.enemyId, x.pos.x, x.pos.y]), pending: s.pendingEncounter }; });
  const st0 = await info();
  console.log('overworld', JSON.stringify(st0));
  await page.screenshot({ path: `${out}/m3-overworld.png` });
  // tap a tile ~6 east of the player along the road: convert world tile -> screen via camera
  const tapTile = async (tx, ty) => {
    const pt = await page.evaluate(([tx, ty]) => { const sc = window.__rerpg.scene.getScene('Overworld'); const cam = sc.cameras.main; return [(tx * 48 + 24 - cam.scrollX) * cam.zoom, (ty * 48 + 24 - cam.scrollY) * cam.zoom]; }, [tx, ty]);
    await tap(pt[0], pt[1]);
  };
  await tapTile(st0.pos.x + 6, st0.pos.y);
  await page.waitForTimeout(350);
  await page.screenshot({ path: `${out}/m3-walking.png` });
  await page.waitForTimeout(900);
  const st1 = await info();
  console.log('after walk', JSON.stringify({ pos: st1.pos, threat: st1.threat, pending: st1.pending }));
  // now head into the wilds: walk toward the first guard (fight it) — guard tile is a valid target
  const gd = st1.guards[0];
  // Walk in legs: each tap targets the guard clamped into the current camera view, like a thumb would.
  for (let leg = 0; leg < 12; leg++) {
    if (await page.evaluate(() => window.__rerpg.scene.isActive('Combat'))) break;
    const clamped = await page.evaluate(([gx, gy]) => { const sc = window.__rerpg.scene.getScene('Overworld'); const v = sc.cameras.main.worldView; const cl = (n, a, b) => Math.max(a, Math.min(b, n)); return [cl(gx, Math.ceil(v.x / 48) + 1, Math.floor(v.right / 48) - 2), cl(gy, Math.ceil(v.y / 48) + 2, Math.floor(v.bottom / 48) - 2)]; }, [gd[1], gd[2]]);
    await tapTile(clamped[0], clamped[1]);
    await page.waitForFunction(() => { const sc = window.__rerpg.scene.getScene('Overworld'); return window.__rerpg.scene.isActive('Combat') || (sc && sc.walking === false); }, null, { timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(300);
  }
  await page.waitForFunction(() => window.__rerpg.scene.isActive('Combat'), null, { timeout: 3000 }).catch(() => {});
  const st2 = await info();
  console.log('encounter', JSON.stringify({ pos: st2.pos, threat: st2.threat, pending: st2.pending, hp: st2.hp }));
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${out}/m3-encounter.png` });
  // finish the fight: play first card or attack until it ends, then Continue back to the map
  const cinfo = () => page.evaluate(() => { const sc = window.__rerpg.scene.getScene('Combat'); const st = sc.state; return { outcome: st.outcome, hand: st.player.hand.length, hp: st.player.hp }; });
  for (let i = 0; i < 30; i++) {
    const c = await cinfo();
    if (c.outcome !== 'ongoing') break;
    if (c.hand > 0) await tap(g[0] / 2 - (c.hand - 1) * 76, g[1] - 66); else await tap(92, g[1] - 66);
    await page.waitForTimeout(4200);
  }
  const c = await cinfo();
  console.log('fight', JSON.stringify(c));
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${out}/m3-fightend.png` });
  if (c.outcome === 'won') {
    await tap(g[0] / 2, g[1] * 0.62); // Continue
    await active('Overworld');
    await page.waitForTimeout(600);
    const st3 = await info();
    console.log('back', JSON.stringify({ pos: st3.pos, hp: st3.hp, threat: st3.threat, pending: st3.pending }));
    await page.screenshot({ path: `${out}/m3-back.png` });
  }
  console.log('errors', JSON.stringify(errors));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });

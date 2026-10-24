// Playthrough: new run -> ambush -> win -> reward pick -> reload -> Continue restores the run. Screenshots to [outDir].
// Usage: npm run build && (npm run preview -- --port 4173 &) && node scripts/playthrough-loot.cjs smoke-out
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
  const sess = () => page.evaluate(() => { const s = window.__rerpg.registry.get('session'); return s ? { seed: s.seed, pos: s.playerPos, hp: s.hp, maxHp: s.stats.maxHp, gold: s.gold, deck: s.deck, eq: Object.fromEntries(Object.entries(s.equipment).map(([k, v]) => [k, v && v.id])), heir: s.heirloomName, screen: s.screenIndex } : null; });
  const meta = () => page.evaluate(() => window.__rerpg.registry.get('meta'));
  const tapTile = async (tx, ty) => { const pt = await page.evaluate(([tx, ty]) => { const sc = window.__rerpg.scene.getScene('Overworld'); const cam = sc.cameras.main; return [(tx * 48 + 24 - cam.scrollX) * cam.zoom, (ty * 48 + 24 - cam.scrollY) * cam.zoom]; }, [tx, ty]); await tap(pt[0], pt[1]); };

  await page.screenshot({ path: `${out}/m4-title.png` });
  await tap(g[0] / 2, g[1] * 0.66); // New run
  await active('ClassSelect');
  await page.waitForTimeout(200);
  await tap(g[0] / 2 - 276, g[1] / 2 - 20); // warrior
  await page.waitForTimeout(150);
  await tap(g[0] / 2, g[1] - 46);
  await active('Overworld');
  await page.waitForTimeout(600);
  const s0 = await sess();
  console.log('start', JSON.stringify(s0));
  const saved0 = await page.evaluate(() => !!localStorage.getItem('rerpg:run'));
  console.log('saved after start', saved0);

  // wander into the wilds until an encounter (walk toward the first guard in camera-sized legs)
  const guard = await page.evaluate(() => { const s = window.__rerpg.registry.get('session'); return s.map.guards[0].pos; });
  for (let leg = 0; leg < 14; leg++) {
    if (await page.evaluate(() => window.__rerpg.scene.isActive('Combat'))) break;
    const clamped = await page.evaluate(([gx, gy]) => { const sc = window.__rerpg.scene.getScene('Overworld'); const v = sc.cameras.main.worldView; const cl = (n, a, b) => Math.max(a, Math.min(b, n)); return [cl(gx, Math.ceil(v.x / 48) + 1, Math.floor(v.right / 48) - 2), cl(gy, Math.ceil(v.y / 48) + 2, Math.floor(v.bottom / 48) - 2)]; }, [guard.x, guard.y]);
    await tapTile(clamped[0], clamped[1]);
    await page.waitForFunction(() => { const sc = window.__rerpg.scene.getScene('Overworld'); return window.__rerpg.scene.isActive('Combat') || (sc && sc.walking === false); }, null, { timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(300);
  }
  await active('Combat');
  await page.waitForTimeout(800);
  // fight
  const cinfo = () => page.evaluate(() => { const sc = window.__rerpg.scene.getScene('Combat'); const st = sc.state; return { outcome: st.outcome, hand: st.player.hand.length, hp: st.player.hp, enemy: st.enemyDef.id }; });
  for (let i = 0; i < 40; i++) {
    const c = await cinfo();
    if (c.outcome !== 'ongoing') break;
    if (c.hand > 0) await tap(g[0] / 2 - (c.hand - 1) * 76, g[1] - 66); else await tap(92, g[1] - 66);
    await page.waitForTimeout(4200);
  }
  const c = await cinfo();
  console.log('fight', JSON.stringify(c));
  await page.waitForTimeout(1200);
  await tap(g[0] / 2, g[1] * 0.62); // Take spoils / Continue
  if (c.outcome === 'won') {
    await active('Reward');
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${out}/m4-reward.png` });
    const offer = await page.evaluate(() => { const sc = window.__rerpg.scene.getScene('Reward'); return sc.offer.choices.map(x => x.kind === 'tome' ? `tome:${x.skill.id}` : `item:${x.item.id}:${x.item.slot}`).concat([`gold:${sc.offer.gold}`]); });
    console.log('offer', JSON.stringify(offer));
    // pick the first choice (left card)
    const n = offer.length - 1;
    const cw = 250, gap = 20;
    const x0 = g[0] / 2 - ((n * cw + (n - 1) * gap) / 2) + cw / 2;
    await tap(x0, g[1] / 2 - 10);
    await page.waitForTimeout(600);
    // if a compare/swap panel opened (slot occupied), press Equip at (W/2-100, H/2+124)
    const stillReward = await page.evaluate(() => window.__rerpg.scene.isActive('Reward'));
    if (stillReward) {
      const hasOverlay = await page.evaluate(() => { const sc = window.__rerpg.scene.getScene('Reward'); return sc.overlay.length > 0; });
      if (hasOverlay) { await page.screenshot({ path: `${out}/m4-compare.png` }); await tap(g[0] / 2 - 100, g[1] / 2 + 124); }
    }
    await active('Overworld');
    await page.waitForTimeout(500);
    const s1 = await sess();
    console.log('after reward', JSON.stringify(s1));
    console.log('meta', JSON.stringify(await meta()));
    await page.screenshot({ path: `${out}/m4-afterreward.png` });
    // reload: Continue should appear and restore the same run
    await page.reload({ waitUntil: 'networkidle' });
    await active('Title');
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${out}/m4-title-continue.png` });
    await tap(g[0] / 2, g[1] * 0.66); // Continue
    await active('Overworld');
    await page.waitForTimeout(500);
    const s2 = await sess();
    console.log('resumed', JSON.stringify(s2));
    console.log('resume matches', JSON.stringify(s1) === JSON.stringify(s2));
  } else {
    await active('RunEnd');
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${out}/m4-death.png` });
    console.log('meta after death', JSON.stringify(await meta()));
    const runSaved = await page.evaluate(() => !!localStorage.getItem('rerpg:run'));
    console.log('run cleared after death', !runSaved);
  }
  console.log('errors', JSON.stringify(errors));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });

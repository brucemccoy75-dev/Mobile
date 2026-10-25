// Playthrough: meta with 1 death + unlocks -> New run -> Heirloom spread, keep 2 -> Overworld; then a won fight -> Sell a reward.
// Usage: npm run build && (npm run preview -- --port 4174 &) && node scripts/playthrough-heirloom.cjs smoke-out
const { chromium } = require('playwright');
(async () => {
  const out = process.argv[2] ?? 'smoke-out'; require('fs').mkdirSync(out, { recursive: true });
  const port = process.env.PORT || 4174;
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 844, height: 390 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', m => { if ((m.type() === 'error') && !m.text().includes('GL Driver')) errors.push(m.text()); });
  page.on('pageerror', e => errors.push(String(e)));
  await page.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle' });
  const active = (name) => page.waitForFunction((n) => window.__rerpg && window.__rerpg.scene.isActive(n), name, { timeout: 15000 });
  await page.evaluate(() => { localStorage.setItem('rerpg:meta', JSON.stringify({ version: 1, updatedAt: 1, deaths: 1, wins: 0, bestScreen: 0, discoveredSkills: ['broadsword', 'shield_bash', 'exposing_strike'], discoveredItems: ['heart_amulet', 'iron_mace', 'plate_harness'] })); localStorage.removeItem('rerpg:run'); });
  await page.reload({ waitUntil: 'networkidle' });
  await active('Title');
  const g = await page.evaluate(() => [window.__rerpg.scale.gameSize.width, window.__rerpg.scale.gameSize.height]);
  const sx = 844 / g[0], sy = 390 / g[1];
  const tap = async (gx, gy) => page.touchscreen.tap(gx * sx, gy * sy);
  await tap(g[0] / 2, g[1] * 0.66); await active('ClassSelect'); await page.waitForTimeout(200);
  await page.screenshot({ path: `${out}/heir-classselect.png` });
  await tap(g[0] / 2 - 276, g[1] / 2 - 20); await page.waitForTimeout(150);
  await tap(g[0] / 2, g[1] - 46);
  await active('Heirloom'); await page.waitForTimeout(500);
  const choices = await page.evaluate(() => window.__rerpg.registry.get('session').heirloomChoices.map(h => h.kind === 'tome' ? `tome:${h.skill.id}` : `item:${h.item.id}`));
  console.log('spread', JSON.stringify(choices));
  await page.screenshot({ path: `${out}/heir-spread.png` });
  const n = choices.length, cw = Math.min(240, (g[0] - 80) / n - 16), gap = 16;
  const x0 = g[0] / 2 - ((n * cw + (n - 1) * gap) / 2) + cw / 2;
  await tap(x0, g[1] / 2 - 10); await page.waitForTimeout(150);
  if (n > 1) { await tap(x0 + (cw + gap), g[1] / 2 - 10); await page.waitForTimeout(150); }
  await page.screenshot({ path: `${out}/heir-picked.png` });
  await tap(g[0] / 2, g[1] - 46); // Begin
  await active('Overworld'); await page.waitForTimeout(500);
  const s0 = await page.evaluate(() => { const s = window.__rerpg.registry.get('session'); return { heir: s.heirloomName, deck: s.deck, eq: Object.fromEntries(Object.entries(s.equipment).map(([k, v]) => [k, v && v.id])), maxHp: s.stats.maxHp, hp: s.hp }; });
  console.log('after heirlooms', JSON.stringify(s0));
  // Fight and sell the first reward.
  await page.evaluate(() => { const s = window.__rerpg.registry.get('session'); s.pendingEncounter = { kind: 'random', enemyId: 'hex_imp' }; window.__rerpg.scene.getScene('Overworld').scene.start('Combat'); });
  await active('Combat'); await page.waitForTimeout(800);
  const cinfo = () => page.evaluate(() => { const st = window.__rerpg.scene.getScene('Combat').state; return { outcome: st.outcome, hand: st.player.hand.slice(), hp: st.player.hp }; });
  for (let i = 0; i < 30; i++) {
    const c = await cinfo();
    if (c.outcome !== 'ongoing') break;
    // prefer a damage card: attack/broadsword/exposing_strike, else first
    let idx = c.hand.findIndex(id => ['broadsword', 'exposing_strike', 'attack', 'shield_bash'].includes(id)); if (idx < 0) idx = 0;
    const hn = c.hand.length; const hx0 = g[0] / 2 - ((hn * 140 + (hn - 1) * 12) / 2) + 70;
    await tap(hx0 + idx * 152, g[1] - 66);
    await page.waitForTimeout(4500);
  }
  console.log('fight', JSON.stringify(await cinfo()));
  await page.waitForTimeout(1200);
  await tap(g[0] / 2, g[1] * 0.62); // Take spoils
  await active('Reward'); await page.waitForTimeout(500);
  await page.screenshot({ path: `${out}/reward-sell.png` });
  const before = await page.evaluate(() => { const s = window.__rerpg.registry.get('session'); const sc = window.__rerpg.scene.getScene('Reward'); return { gold: s.gold, offer: sc.offer.choices.map(x => x.kind === 'tome' ? `tome:${x.skill.id}` : `item:${x.item.id}`), meta: window.__rerpg.registry.get('meta') }; });
  const rn = before.offer.length, rcw = 250, rgap = 20;
  const rx0 = g[0] / 2 - ((rn * rcw + (rn - 1) * rgap) / 2) + rcw / 2;
  await tap(rx0, g[1] / 2 - 10 + 170 / 2 + 24); // Sell under first card
  await active('Overworld'); await page.waitForTimeout(400);
  const after = await page.evaluate(() => { const s = window.__rerpg.registry.get('session'); return { gold: s.gold, newDisc: s.newDiscoveries, deck: s.deck, eq: Object.fromEntries(Object.entries(s.equipment).map(([k, v]) => [k, v && v.id])) }; });
  console.log('sell', JSON.stringify({ offer: before.offer, goldBefore: before.gold, goldAfter: after.gold, newDiscoveries: after.newDisc, deck: after.deck }));
  console.log('errors', JSON.stringify(errors));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });

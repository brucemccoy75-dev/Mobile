// Playthrough: the quest giver near the entry; accept; then force each quest kind in turn and hand it in.
// Usage: npm run build && (npm run preview -- --port 4174 &) && node scripts/playthrough-quest.cjs smoke-out
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
  await page.evaluate(() => { localStorage.removeItem('rerpg:run'); localStorage.setItem('rerpg:meta', JSON.stringify({ version: 3, updatedAt: 1, deaths: 0, wins: 0, bestScreen: 0, discoveredSkills: [], discoveredItems: [], winsByClass: {}, legacy: { atk: 0, def: 0, maxHp: 0 }, legacyUnspent: 0 })); });
  await page.reload({ waitUntil: 'networkidle' }); await active('Title');
  const g = await page.evaluate(() => [window.__rerpg.scale.gameSize.width, window.__rerpg.scale.gameSize.height]);
  const sx = 844 / g[0], sy = 390 / g[1];
  const tap = async (gx, gy) => page.touchscreen.tap(gx * sx, gy * sy);
  const tapTile = async (tx, ty) => { const pt = await page.evaluate(([tx, ty]) => { const sc = window.__rerpg.scene.getScene('Overworld'); const cam = sc.cameras.main; return [(tx * 48 + 24 - cam.scrollX) * cam.zoom, (ty * 48 + 24 - cam.scrollY) * cam.zoom]; }, [tx, ty]); await tap(pt[0], pt[1]); };
  await tap(g[0] / 2, g[1] * 0.66); await active('ClassSelect'); await page.waitForTimeout(200);
  await tap(g[0] / 2 - 276, g[1] / 2 - 20); await page.waitForTimeout(150); await tap(g[0] / 2, g[1] - 46);
  await active('Overworld'); await page.waitForTimeout(500);
  const q0 = await page.evaluate(() => { const s = window.__rerpg.registry.get('session'); const q = s.quests[0]; return { kind: q.kind, giver: q.giver.name, pos: q.giver.pos, entry: s.map.entry, status: q.status }; });
  console.log('quest', JSON.stringify(q0));
  await page.screenshot({ path: `${out}/quest-map.png` });
  // Walk onto the giver (within view of the entry).
  await tapTile(q0.pos.x, q0.pos.y);
  await page.waitForFunction(() => window.__rerpg.scene.isActive('Quest') || window.__rerpg.scene.isActive('Combat'), null, { timeout: 20000 });
  if (await page.evaluate(() => window.__rerpg.scene.isActive('Combat'))) { console.log('ambushed on the way; aborting the walk test'); }
  else {
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${out}/quest-offer.png` });
    await tap(g[0] / 2 - 110, g[1] - 46); // Accept
    await active('Overworld'); await page.waitForTimeout(300);
    console.log('accepted', JSON.stringify(await page.evaluate(() => { const s = window.__rerpg.registry.get('session'); return { status: s.quests[0].status, hud: window.__rerpg.scene.getScene('Overworld').questText.text }; })));
  }
  // Force each kind and hand it in via the Quest scene.
  const runKind = async (setup) => {
    await page.evaluate(setup);
    await page.evaluate(() => { const s = window.__rerpg.registry.get('session'); window.__rerpg.scene.getScene('Overworld').scene.start('Quest', { questId: s.quests[0].id }); });
    await active('Quest'); await page.waitForTimeout(300);
    const before = await page.evaluate(() => { const s = window.__rerpg.registry.get('session'); return { gold: s.gold, atk: s.stats.atk, w: s.equipment.weapon && s.equipment.weapon.name, up: { ...s.skillUpgrades } }; });
    await tap(g[0] / 2, g[1] - 46); // Hand it in
    await page.waitForFunction(() => window.__rerpg.scene.isActive('Overworld') || window.__rerpg.scene.isActive('Reward'), null, { timeout: 10000 });
    const where = await page.evaluate(() => window.__rerpg.scene.isActive('Reward') ? 'Reward' : 'Overworld');
    if (where === 'Reward') { await page.waitForTimeout(300); await tap(g[0] / 2, g[1] - 40); await active('Overworld'); } // take nothing
    await page.waitForTimeout(300);
    const after = await page.evaluate(() => { const s = window.__rerpg.registry.get('session'); return { gold: s.gold, atk: s.stats.atk, w: s.equipment.weapon && s.equipment.weapon.name, up: { ...s.skillUpgrades }, status: s.quests[0].status }; });
    return { via: where, before, after };
  };
  const fetchItem = await runKind(() => { const s = window.__rerpg.registry.get('session'); const q = s.quests[0]; q.kind = 'fetch'; q.hunt = undefined; q.escort = undefined; q.status = 'active'; q.fetch = { type: 'item', id: 'rusty_sword', name: 'Rusty Sword' }; q.reward = { gold: 15 }; const it = { id: 'rusty_sword', name: 'Rusty Sword', slot: 'weapon', rarity: 'common', text: '+1 ATK', mods: [{ stat: { atk: 1 } }] }; s.equipment.weapon = it; s.stats = { ...s.stats, atk: s.base.atk + 1 }; });
  console.log('fetch item', JSON.stringify(fetchItem));
  const fetchTome = await runKind(() => { const s = window.__rerpg.registry.get('session'); const q = s.quests[0]; q.kind = 'fetch'; q.status = 'active'; q.fetch = { type: 'tome', id: 'broadsword', name: 'Broadsword Strike' }; s.deck = ['broadsword']; });
  console.log('fetch tome', JSON.stringify(fetchTome));
  const hunt = await runKind(() => { const s = window.__rerpg.registry.get('session'); const q = s.quests[0]; q.kind = 'hunt'; q.fetch = undefined; q.status = 'active'; q.hunt = { enemyId: 'boar', name: 'Boar', need: 2, have: 2 }; q.reward = { gold: 25, offer: 'guard' }; });
  console.log('hunt', JSON.stringify(hunt));
  const escort = await runKind(() => { const s = window.__rerpg.registry.get('session'); const q = s.quests[0]; q.kind = 'escort'; q.hunt = undefined; q.status = 'active'; q.escort = { name: 'Pell the forager', pos: s.map.npcSpot, following: true }; q.reward = { gold: 20, offer: 'chest' }; });
  console.log('escort', JSON.stringify(escort));
  // Escort pickup on the map: NPC adjacent, walk onto it, follower appears, threat multiplier applies.
  await page.evaluate(() => { const s = window.__rerpg.registry.get('session'); const q = s.quests[0]; q.status = 'active'; q.escort.following = false; q.escort.pos = { x: s.playerPos.x + 1, y: s.playerPos.y }; const m = s.map; m.tiles[q.escort.pos.y * m.width + q.escort.pos.x] = 'grass'; window.__rerpg.scene.getScene('Overworld').scene.restart(); });
  await page.waitForTimeout(600);
  const npc = await page.evaluate(() => window.__rerpg.registry.get('session').quests[0].escort.pos);
  await tapTile(npc.x, npc.y); await page.waitForTimeout(900);
  console.log('escort pickup', JSON.stringify(await page.evaluate(() => { const s = window.__rerpg.registry.get('session'); const sc = window.__rerpg.scene.getScene('Overworld'); return { following: s.quests[0].escort.following, follower: !!sc.follower, hud: sc.questText.text }; })));
  await page.screenshot({ path: `${out}/quest-escort.png` });
  console.log('errors', JSON.stringify(errors));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });

// Playthrough: a v2 meta with one warrior win -> migration banks a Legacy point -> New run -> Legacy choice (+5 HP) -> run base reflects it -> reload keeps it.
// Usage: npm run build && (npm run preview -- --port 4174 &) && node scripts/playthrough-legacy.cjs smoke-out
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
  await page.evaluate(() => { localStorage.setItem('rerpg:meta', JSON.stringify({ version: 2, updatedAt: 1, deaths: 2, wins: 1, bestScreen: 2, discoveredSkills: ['broadsword'], discoveredItems: ['heart_amulet'], winsByClass: { warrior: 1 } })); localStorage.removeItem('rerpg:run'); });
  await page.reload({ waitUntil: 'networkidle' }); await active('Title');
  const g = await page.evaluate(() => [window.__rerpg.scale.gameSize.width, window.__rerpg.scale.gameSize.height]);
  const sx = 844 / g[0], sy = 390 / g[1];
  const tap = async (gx, gy) => page.touchscreen.tap(gx * sx, gy * sy);
  const meta0 = await page.evaluate(() => window.__rerpg.registry.get('meta'));
  console.log('migrated', JSON.stringify({ v: meta0.version, unspent: meta0.legacyUnspent, legacy: meta0.legacy, wizardOpen: !!meta0.winsByClass.warrior }));
  await tap(g[0] / 2, g[1] * 0.66); await active('ClassSelect'); await page.waitForTimeout(250);
  await tap(g[0] / 2 - 276, g[1] / 2 - 20); await page.waitForTimeout(150); await tap(g[0] / 2, g[1] - 46);
  await active('Legacy'); await page.waitForTimeout(500);
  await page.screenshot({ path: `${out}/legacy.png` });
  // third option: +5 max HP
  const cw = 240, gap = 24; const x0 = g[0] / 2 - ((3 * cw + 2 * gap) / 2) + cw / 2;
  await tap(x0 + 2 * (cw + gap), g[1] / 2 + 50);
  await page.waitForFunction(() => window.__rerpg.scene.isActive('Overworld') || window.__rerpg.scene.isActive('Heirloom'), null, { timeout: 15000 });
  const where = await page.evaluate(() => window.__rerpg.scene.isActive('Heirloom') ? 'Heirloom' : 'Overworld');
  if (where === 'Heirloom') { await tap(g[0] / 2, g[1] - 46); await active('Overworld'); }
  await page.waitForTimeout(400);
  const s0 = await page.evaluate(() => { const s = window.__rerpg.registry.get('session'); const m = window.__rerpg.registry.get('meta'); return { base: s.base, hp: s.hp, legacy: m.legacy, unspent: m.legacyUnspent, saved: JSON.parse(localStorage.getItem('rerpg:meta')).legacy }; });
  console.log('after legacy', JSON.stringify({ via: where, ...s0 }));
  await page.reload({ waitUntil: 'networkidle' }); await active('Title'); await page.waitForTimeout(300);
  await page.screenshot({ path: `${out}/legacy-title.png` });
  const titleLine = await page.evaluate(() => window.__rerpg.scene.getScene('Title').children.list.filter(o => o.type === 'Text').map(o => o.text).find(t => t.includes('legacy')));
  console.log(JSON.stringify({ titleLine, errors }));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });

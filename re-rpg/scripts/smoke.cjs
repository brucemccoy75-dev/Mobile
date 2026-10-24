// Smoke test: boots the built game at phone viewports and reports console errors.
// Usage: npm run build && npm run preview -- --port 4173 &  then  node scripts/smoke.cjs [outDir]
// Needs `playwright` resolvable (npm i -D playwright, or a global install).
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const browser = await chromium.launch();
  const out = process.argv[2] ?? 'smoke-out'; fs.mkdirSync(out, { recursive: true });
  const errors = [];
  // iPhone 14-ish landscape, dpr 3
  const ctx = await browser.newContext({ viewport: { width: 844, height: 390 }, deviceScaleFactor: 3, hasTouch: true, isMobile: true });
  const page = await ctx.newPage();
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push(String(e)));
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.__rerpg && window.__rerpg.scene.isActive('Title'), null, { timeout: 15000 });
  const info = await page.evaluate(() => {
    const g = window.__rerpg; const c = document.querySelector('canvas');
    return { game: [g.scale.gameSize.width, g.scale.gameSize.height], canvasCss: [c.clientWidth, c.clientHeight], renderer: g.renderer.constructor.name, rotateVisible: getComputedStyle(document.getElementById('rotate')).display };
  });
  await page.screenshot({ path: `${out}/landscape.png` });
  // Tap and confirm the scene responds.
  await page.touchscreen.tap(400, 200);
  await page.waitForTimeout(400);
  // Portrait: rotate overlay should show.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(300);
  const portrait = await page.evaluate(() => getComputedStyle(document.getElementById('rotate')).display);
  await page.screenshot({ path: `${out}/portrait.png` });
  // Wide 20:9 phone
  await page.setViewportSize({ width: 915, height: 412 });
  await page.waitForTimeout(400);
  const wide = await page.evaluate(() => { const g = window.__rerpg; return [g.scale.gameSize.width, g.scale.gameSize.height]; });
  await page.screenshot({ path: `${out}/wide.png` });
  console.log(JSON.stringify({ info, portraitOverlay: portrait, wideGameSize: wide, errors }, null, 2));

  // Icons from the SVG
  const svg = fs.readFileSync('public/icons/icon.svg', 'utf8');
  for (const size of [192, 512]) {
    const p = await browser.newPage({ viewport: { width: size, height: size } });
    await p.setContent(`<html><body style="margin:0;background:transparent">${svg.replace('<svg ', `<svg width="${size}" height="${size}" `)}</body></html>`);
    await p.screenshot({ path: `${out}/icon-${size}.png`, omitBackground: true });
    await p.close();
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });

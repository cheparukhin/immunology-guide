#!/usr/bin/env node
// Generate the site's raster images from the live site (dev-only; re-run after a
// brand or home-hero change):
//   assets/img/share-card.jpg        1200×630 Open Graph / Twitter card (the home hero; JPEG ≈ 100 KB,
//                                    a PNG of this glowing scene is ~1 MB)
//   assets/img/favicon-32.png        32×32 PNG favicon (from assets/img/favicon.svg)
//   assets/img/apple-touch-icon.png  180×180 home-screen icon (full bleed; iOS rounds it)
//
//   node tools/make-images.mjs [--wait 1500] [--motion]   (default: the reduced-motion still: a T cell meeting the cancer cell)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { startServer } from './lib/server.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'assets/img');
const argv = process.argv.slice(2);
const wait = Number(argv[argv.indexOf('--wait') + 1]) || 1500;
fs.mkdirSync(OUT, { recursive: true });

const server = await startServer(ROOT);
const browser = await chromium.launch();
try {
  // ---- Share card: the home hero, full bleed, title + tagline, no chrome.
  const ctx = await browser.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1, colorScheme: 'dark', reducedMotion: argv.includes('--motion') ? 'no-preference' : 'reduce' });
  const page = await ctx.newPage();
  await page.goto(server.url + 'index.html', { waitUntil: 'load' });
  await page.addStyleTag({ content: `
    .site-header, .progress, .skip-link, .home-hero__actions, .home-hero__meta, .home-hero__legend,
    .home-hero__fig .fig__controls, .fig__hud, .fig-hero-controls, .home-hero [class*="pause"] { display: none !important; }
    html, body { overflow: hidden !important; background: #0B1024 !important; }
    main { padding: 0 !important; margin: 0 !important; }
    .home-hero { padding: 0 !important; }
    .home-hero__frame { height: 630px !important; border-radius: 0 !important; box-shadow: none !important; }
    .home-hero__text { left: 84px !important; width: 560px !important; }
    .home-hero__title { font-size: 124px !important; }
    .home-hero__sub { font-size: 27px !important; max-width: 30rem !important; }
    .home-hero__text > * { animation: none !important; opacity: 1 !important; transform: none !important; }
  ` });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForFunction(() => (window.__so?.figures?.() || []).every((f) => f.status !== 'loading' && f.status !== 'pending'), null, { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(wait);
  // Hide any button the hero adds over the stage (pause control etc.).
  await page.evaluate(() => document.querySelectorAll('.home-hero button').forEach((b) => { b.style.display = 'none'; }));
  await page.screenshot({ path: path.join(OUT, 'share-card.jpg'), type: 'jpeg', quality: 88, clip: { x: 0, y: 0, width: 1200, height: 630 } });
  await ctx.close();
  console.log('wrote assets/img/share-card.jpg (1200×630)');

  // ---- PNG icons from the SVG favicon.
  const svg = fs.readFileSync(path.join(OUT, 'favicon.svg'), 'utf8');
  const icon = async (size, file, { bleed = false } = {}) => {
    const c = await browser.newContext({ viewport: { width: size, height: size }, deviceScaleFactor: 1 });
    const p = await c.newPage();
    // Full-bleed variant: square tile (iOS applies its own corner mask), mark slightly smaller.
    const body = bleed
      ? svg.replace(/<rect[^>]*\/>/, '<rect width="32" height="32" fill="#0E121B"/>').replace('viewBox="0 0 32 32"', 'viewBox="-3 -3 38 38"')
        .replace('<rect width="32" height="32" fill="#0E121B"/>', '<rect x="-3" y="-3" width="38" height="38" fill="#0E121B"/>')
      : svg;
    await p.setContent(`<!doctype html><html><body style="margin:0;background:transparent">${body.replace('<svg ', `<svg width="${size}" height="${size}" `)}</body></html>`);
    await p.screenshot({ path: path.join(OUT, file), omitBackground: !bleed, clip: { x: 0, y: 0, width: size, height: size } });
    await c.close();
    console.log(`wrote assets/img/${file} (${size}×${size})`);
  };
  await icon(32, 'favicon-32.png');
  await icon(180, 'apple-touch-icon.png', { bleed: true });
} finally {
  await browser.close();
  await server.close();
}

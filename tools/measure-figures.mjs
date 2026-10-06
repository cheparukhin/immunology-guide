#!/usr/bin/env node
// Measures how much space each figure takes once mounted, so the build can reserve it
// before the module loads (no layout shift while figures lazy-load).
//
//   node tools/measure-figures.mjs                       # every chapter-like page at the root
//   node tools/measure-figures.mjs 05-t-cells.html       # one or more pages
//   then: node tools/build-content.mjs [--only 05]       # the build reads the measurements
//
// For each figure, at desktop (1440) and phone (390) widths, it records:
//   aspect  the mounted stage's width / height
//   extra   px the figure grows on mount outside its stage (rows above/below, captions, cards)
//   side    px of width an info card beside the stage takes (desktop), if any
// into assets/data/figure-sizes.json (merged; other figures are kept). Run it after a
// figure's layout changes, then rebuild its page.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { startServer } from './lib/server.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'assets/data/figure-sizes.json');
let pages = process.argv.slice(2).filter((a) => !a.startsWith('--'));
if (!pages.length) pages = fs.readdirSync(ROOT).filter((f) => f.endsWith('.html') && !f.startsWith('_preview-') && !['glossary.html', 'sources.html', '_dev.html'].includes(f)).sort();

const VIEWPORTS = { desktop: { width: 1440, height: 900 }, mobile: { width: 390, height: 844, isMobile: true, hasTouch: true } };
const probe = () => [...document.querySelectorAll('figure.fig[data-figure]:not(.fig--hero)')].map((f) => {
  const st = f.querySelector('.fig__stage');
  const fr = f.getBoundingClientRect();
  const sr = st ? st.getBoundingClientRect() : fr;
  const main = f.querySelector('.fig__main.has-side');
  // Side column (info card beside the stage): the width the stage gives up.
  const side = main && sr.width < fr.width - 8 ? Math.round(fr.width - sr.width) : 0;
  return { id: f.dataset.figure, rest: fr.height - sr.height, aspect: sr.width / Math.max(1, sr.height), side };
});

const server = await startServer(ROOT);
const browser = await chromium.launch();
const results = {};
try {
  for (const file of pages) {
    for (const [vpName, vp] of Object.entries(VIEWPORTS)) {
      const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: !!vp.isMobile, hasTouch: !!vp.hasTouch });
      const page = await ctx.newPage();
      // Measure the un-reserved, pre-mount layout as soon as fonts are ready.
      await page.addInitScript((src) => {
        addEventListener('DOMContentLoaded', () => {
          const st = document.createElement('style');
          st.textContent = '.fig{--rsv-extra:0px!important;--rsv-extra-c:0px!important}html{scroll-behavior:auto!important}*,*::before,*::after{backdrop-filter:none!important}';
          document.head.append(st);
          document.fonts.ready.then(() => { window.__pre = (0, eval)(src)(); });
        });
      }, `(${probe.toString()})`);
      await page.goto(server.url + file, { waitUntil: 'load' });
      await page.waitForFunction(() => window.__pre, null, { timeout: 15000 });
      await page.evaluate(() => window.__so?.mountAll?.());
      await page.waitForFunction(() => (window.__so?.figures?.() || []).every((f) => f.status === 'mounted' || f.status === 'failed'), null, { timeout: 30000 }).catch(() => {});
      // Wait until every figure's height has been stable for ~1 s (max 8 s).
      await page.evaluate(async () => {
        const hs = () => [...document.querySelectorAll('figure.fig[data-figure]')].map((f) => Math.round(f.getBoundingClientRect().height)).join(',');
        let last = ''; let stable = 0;
        for (let k = 0; k < 40 && stable < 4; k++) { await new Promise((r) => setTimeout(r, 250)); const h = hs(); stable = h === last ? stable + 1 : 0; last = h; }
      });
      const statuses = Object.fromEntries((await page.evaluate(() => window.__so?.figures?.() || [])).map((f) => [f.id, f.status]));
      const pre = await page.evaluate(() => window.__pre);
      const post = await page.evaluate(probe);
      for (const p of post) {
        if (statuses[p.id] !== 'mounted') continue;
        const before = pre.find((x) => x.id === p.id);
        if (!before) continue;
        // extra = growth of everything except the stage (rows above/below it, captions,
        // cards under it); the stage itself is reserved by aspect (+ side column).
        (results[p.id] ||= {})[vpName] = { aspect: Math.round(p.aspect * 10000) / 10000, extra: Math.max(0, Math.round(p.rest - before.rest)), ...(p.side ? { side: p.side } : {}) };
      }
      await ctx.close();
    }
    process.stdout.write(`measured ${file}\n`);
  }
} finally {
  await browser.close();
  await server.close();
}

let data = {};
try { data = JSON.parse(fs.readFileSync(OUT, 'utf8')); } catch { /* new file */ }
for (const [id, v] of Object.entries(results)) data[id] = { ...data[id], ...v };
const sorted = Object.fromEntries(Object.keys(data).sort().map((k) => [k, data[k]]));
const tmp = `${OUT}.tmp-${process.pid}`;
fs.writeFileSync(tmp, JSON.stringify(sorted, null, 2) + '\n');
fs.renameSync(tmp, OUT);
console.log(`wrote assets/data/figure-sizes.json (${Object.keys(results).length} figures measured, ${Object.keys(sorted).length} total). Rebuild pages to apply.`);

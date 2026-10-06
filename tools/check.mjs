#!/usr/bin/env node
// Site-wide checker. For every HTML page at the repo root (or the ones given):
//   • console errors, page errors, failed requests (all figures force-mounted)
//   • figures that fail to mount, figure ids without a module file,
//     figures without fallback/alt text
//   • horizontal overflow at 390px width
//   • broken internal links and #anchors (links to planned-but-unbuilt pages
//     from chapters.json are warnings, not errors)
//   • data-term ids missing from assets/data/glossary.json
//   • <img> without alt, duplicate ids
//
//   node tools/check.mjs                      # every page
//   node tools/check.mjs _sample.html 04-presentation.html
//   node tools/check.mjs --json               # machine-readable
//   node tools/check.mjs --strict             # warnings also fail
//   node tools/check.mjs --pending-ok         # figure modules not built yet = warning, not error
// Exit code 1 if any error (or any warning with --strict).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { startServer, collectDiagnostics, overflowProbe } from './lib/server.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const asJson = argv.includes('--json');
const strict = argv.includes('--strict');
const quiet = argv.includes('--quiet');
const pendingOk = argv.includes('--pending-ok');
let pages = argv.filter((a) => !a.startsWith('--'));
const allPages = fs.readdirSync(ROOT).filter((f) => f.endsWith('.html')).sort();
if (!pages.length) pages = allPages.filter((f) => !f.startsWith('_preview-'));   // previews are throwaway
for (const p of pages) if (!allPages.includes(p)) { console.error(`No such page at the repo root: ${p}`); process.exit(2); }

const chapters = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/data/chapters.json'), 'utf8'));
const planned = new Set([...chapters.pages, ...(chapters.extras || [])].map((p) => p.file));
let glossary = {};
try { glossary = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/data/glossary.json'), 'utf8')); } catch { /* reported below */ }

const idCache = new Map();
function idsOf(file) {
  if (!idCache.has(file)) {
    const html = fs.readFileSync(path.join(ROOT, file), 'utf8');
    idCache.set(file, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  }
  return idCache.get(file);
}

// Collected in the page.
const domProbe = () => {
  const ids = [...document.querySelectorAll('[id]')].map((e) => e.id);
  const dupIds = ids.filter((id, i) => ids.indexOf(id) !== i);
  const links = [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href'));
  const terms = [...document.querySelectorAll('a.term[data-term], [data-term]')].map((a) => a.dataset.term);
  let local = {};
  try { local = JSON.parse(document.getElementById('page-glossary')?.textContent || '{}'); } catch { /* ignore */ }
  const figures = [...document.querySelectorAll('figure.fig[data-figure]')].map((f) => ({
    id: f.dataset.figure,
    decorative: f.getAttribute('aria-hidden') === 'true',
    fallback: (f.querySelector('.fig__fallback')?.textContent || '').replace(/Interactive figure unavailable · description/, '').trim().length,
  }));
  const imgs = [...document.querySelectorAll('img')].filter((i) => !i.hasAttribute('alt')).map((i) => i.getAttribute('src'));
  const statuses = window.__so?.figures?.() || [];
  const sheets = [...document.querySelectorAll('link[rel="stylesheet"]')].map((l) => l.getAttribute('href'));
  return { ids: [...new Set(ids)], dupIds: [...new Set(dupIds)], links, terms: [...new Set(terms)], localTerms: Object.keys(local), figures, imgs, statuses, sheets };
};

const server = await startServer(ROOT);
const browser = await chromium.launch();
const results = [];

async function checkPage(file) {
  const errors = [];
  const warnings = [];
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  const diag = collectDiagnostics(page, server.url);
  // Headless Chromium software-renders backdrop blur on every scroll (~0.5 s per step on
  // long pages); it is irrelevant to these checks, so turn it (and smooth scrolling) off.
  await page.addInitScript(() => addEventListener('DOMContentLoaded', () => {
    const st = document.createElement('style');
    st.textContent = '*,*::before,*::after{backdrop-filter:none!important;-webkit-backdrop-filter:none!important}html{scroll-behavior:auto!important}';
    document.head.append(st);
  }));
  try {
    await page.goto(server.url + file, { waitUntil: 'load', timeout: 20000 });
    await page.evaluate(() => document.fonts.ready);
    // Mount every figure, then visit the page top to bottom so lazy behaviour runs.
    await page.evaluate(() => window.__so?.mountAll?.()).catch(() => {});
    await page.waitForFunction(() => (window.__so?.figures?.() || []).every((f) => f.status === 'mounted' || f.status === 'failed'), null, { timeout: 15000 }).catch(() => warnings.push('figures still loading after 15 s'));
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < h; y += 1600) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(25); }
    await page.waitForTimeout(400);
    const overflow = await page.evaluate(overflowProbe);
    const dom = await page.evaluate(domProbe);

    // Figure modules that don't exist yet: one line per page instead of 404 + console
    // error + "not found" for each (their 404s and mount errors are expected).
    const missing = [...new Set(dom.figures.map((f) => f.id).filter((id) => !fs.existsSync(path.join(ROOT, 'assets/js/figures', `${id}.js`))))];
    const isMissingNoise = (msg) => missing.some((id) => msg.includes(`assets/js/figures/${id}.js`) || msg.includes(`[figure ${id}]`));
    if (missing.length) (pendingOk ? warnings : errors).push(`figure modules not built yet (${missing.length}): ${missing.join(', ')}`);

    // Runtime problems
    for (const e of diag.pageErrors) errors.push(`page error: ${e.split('\n')[0]}`);
    for (const e of diag.consoleErrors) {
      if (/Failed to load resource/.test(e)) continue;      // reported as failed requests
      if (isMissingNoise(e)) continue;
      errors.push(`console error: ${e}`);
    }
    for (const w of diag.consoleWarnings) warnings.push(`console warning: ${w}`);
    for (const r of new Set(diag.failedRequests)) if (!isMissingNoise(r)) errors.push(`failed request: ${r}`);
    if (overflow.detected) errors.push(`horizontal overflow at 390px: document ${overflow.documentWidth}px wide (${overflow.offenders.slice(0, 4).join(', ')})`);

    // Figures
    for (const f of dom.figures) {
      if (!f.decorative && !f.fallback) errors.push(`figure "${f.id}": no fallback/alt text`);
    }
    for (const s of dom.statuses) {
      if (s.status === 'failed' && fs.existsSync(path.join(ROOT, 'assets/js/figures', `${s.id}.js`))) errors.push(`figure "${s.id}" failed to mount: ${(s.error || '').split('\n')[0]}`);
    }

    // Glossary terms
    const local = new Set(dom.localTerms);
    for (const t of dom.terms) if (!glossary[t] && !local.has(t)) errors.push(`glossary term "${t}" missing from assets/data/glossary.json`);

    // Images, ids
    for (const src of dom.imgs) errors.push(`<img> without alt: ${src}`);
    for (const id of dom.dupIds) errors.push(`duplicate id="${id}"`);

    // Links
    const pageIds = new Set(dom.ids);
    const plannedMissing = new Map();
    for (const href of new Set(dom.links)) {
      if (/^(https?:|mailto:|tel:|data:|javascript:)/i.test(href)) continue;
      const [rawPath, hash] = href.split('#');
      const target = rawPath ? path.posix.normalize(decodeURIComponent(rawPath.split('?')[0])) : file;
      if (!rawPath) {
        if (hash && !pageIds.has(decodeURIComponent(hash))) errors.push(`broken anchor: #${hash}`);
        continue;
      }
      if (target.startsWith('..') || path.isAbsolute(target)) { errors.push(`link escapes the site root or is absolute: ${href}`); continue; }
      const abs = path.join(ROOT, target);
      if (!fs.existsSync(abs)) {
        if (planned.has(target)) plannedMissing.set(target, (plannedMissing.get(target) || 0) + 1);
        else errors.push(`broken link: ${href}`);
        continue;
      }
      if (hash && target.endsWith('.html') && !idsOf(target).has(decodeURIComponent(hash))) errors.push(`broken anchor: ${href}`);
    }
    for (const [t, n] of plannedMissing) warnings.push(`links to planned page not built yet: ${t} (${n} link${n > 1 ? 's' : ''})`);

    // Per-chapter CSS present but not linked
    const m = file.match(/^(\d\d)-/);
    for (const css of [m && `assets/css/chapters/ch${m[1]}.css`, `assets/css/chapters/${file.replace(/\.html$/, '')}.css`].filter(Boolean)) {
      if (fs.existsSync(path.join(ROOT, css)) && !dom.sheets.includes(css)) warnings.push(`${css} exists but is not linked: re-run node tools/build-content.mjs --only ${file.replace(/\.html$/, '')}`);
    }

    const mounted = dom.statuses.filter((s) => s.status === 'mounted').length;
    results.push({ page: file, errors, warnings, figures: `${mounted}/${dom.statuses.length}`, overflow: overflow.detected });
  } catch (err) {
    errors.push(`checker crashed on this page: ${String(err.message || err).split('\n')[0]}`);
    results.push({ page: file, errors, warnings, figures: '?', overflow: null });
  } finally {
    await context.close();
  }
}

try {
  const queue = [...pages];
  const workers = Array.from({ length: Math.min(4, queue.length) }, async () => {
    while (queue.length) await checkPage(queue.shift());
  });
  await Promise.all(workers);
} finally {
  await browser.close();
  await server.close();
}

results.sort((a, b) => a.page.localeCompare(b.page));
const nErr = results.reduce((n, r) => n + r.errors.length, 0);
const nWarn = results.reduce((n, r) => n + r.warnings.length, 0);
if (asJson) {
  console.log(JSON.stringify({ errors: nErr, warnings: nWarn, pages: results }, null, 2));
} else {
  console.log(`check: ${results.length} page${results.length === 1 ? '' : 's'} · ${nErr} error${nErr === 1 ? '' : 's'} · ${nWarn} warning${nWarn === 1 ? '' : 's'}\n`);
  for (const r of results) {
    const ok = !r.errors.length;
    if (quiet && ok && !r.warnings.length) continue;
    console.log(`${ok ? '✓' : '✗'} ${r.page}   figures mounted ${r.figures}${r.overflow === false ? ' · no overflow at 390px' : ''}`);
    for (const e of r.errors) console.log(`    ✗ ${e}`);
    for (const w of r.warnings) console.log(`    ⚠ ${w}`);
  }
}
process.exitCode = nErr || (strict && nWarn) ? 1 : 0;

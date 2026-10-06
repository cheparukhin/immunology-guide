#!/usr/bin/env node
// Site-level QA audits (accessibility, cross-browser, performance, subpath hosting,
// file://, metadata). Complements tools/check.mjs (links, overflow, figure mounting).
//
//   node tools/site-audit.mjs axe       [pages…] [--viewports desktop,mobile] [--themes light,dark]
//   node tools/site-audit.mjs browsers  [pages…] [--browsers webkit,firefox]
//   node tools/site-audit.mjs perf      [pages…] [--throttle 4]
//   node tools/site-audit.mjs lazy      [pages…]        (figure modules fetched only near the viewport; idle rAF when no figure is on screen)
//   node tools/site-audit.mjs subpath   [pages…]        (site copied to <tmp>/site/sub/dir/ and served from its parent)
//   node tools/site-audit.mjs file      [pages…]        (file:// degrades to fallback text)
//   node tools/site-audit.mjs meta                      (title, description, OG/Twitter, icons, theme-color, lang)
//   node tools/site-audit.mjs keyboard  [pages…]        (tab order, focus visibility, skip link, menus, popovers, quiz)
//   node tools/site-audit.mjs motion    [pages…]        (prefers-reduced-motion: visible figures are still)
//   node tools/site-audit.mjs all
// Options: --json <file> (write the raw results), --quiet.
// Default pages: every reader-facing page (chapters.json pages + extras). Dev pages
// (_*.html, art-gallery.html) are never audited unless named.
// Exit code 1 if anything is reported as an error.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium, webkit, firefox } from 'playwright';
import { startServer, collectDiagnostics, overflowProbe } from './lib/server.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const mode = argv[0] && !argv[0].startsWith('--') ? argv.shift() : 'all';
const flag = (name, def) => {
  const i = argv.indexOf(`--${name}`);
  if (i < 0) return def;
  const v = argv[i + 1];
  argv.splice(i, v && !v.startsWith('--') ? 2 : 1);
  return v && !v.startsWith('--') ? v : true;
};
const jsonOut = flag('json', null);
const quiet = !!flag('quiet', false);
const VIEWPORTS = { desktop: { width: 1440, height: 900 }, mobile: { width: 390, height: 844, isMobile: true, hasTouch: true } };
const viewports = String(flag('viewports', 'desktop,mobile')).split(',');
const themes = String(flag('themes', 'light,dark')).split(',');
const browsersWanted = String(flag('browsers', 'webkit,firefox')).split(',');
const throttle = Number(flag('throttle', 4));

const chapters = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/data/chapters.json'), 'utf8'));
const READER_PAGES = [...(chapters.extras || []).filter((x) => x.id === 'index'), ...chapters.pages, ...(chapters.extras || []).filter((x) => x.id !== 'index')].map((p) => p.file);
const pages = argv.filter((a) => !a.startsWith('--'));
const PAGES = pages.length ? pages : READER_PAGES;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (...a) => { if (!quiet) console.log(...a); };
const report = { mode, errors: [], warnings: [], results: {} };
const err = (msg) => { report.errors.push(msg); };
const warn = (msg) => { report.warnings.push(msg); };

const NO_BLUR = '*,*::before,*::after{backdrop-filter:none!important;-webkit-backdrop-filter:none!important}html{scroll-behavior:auto!important}';

async function pool(items, n, fn) {
  const q = [...items];
  await Promise.all(Array.from({ length: Math.min(n, q.length) }, async () => { while (q.length) await fn(q.shift()); }));
}

async function mountAll(page, { scroll = true, timeout = 20000 } = {}) {
  await page.evaluate(() => window.__so?.mountAll?.()).catch(() => {});
  await page.waitForFunction(() => (window.__so?.figures?.() || []).every((f) => f.status === 'mounted' || f.status === 'failed'), null, { timeout }).catch(() => {});
  if (scroll) {
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    const vh = await page.evaluate(() => innerHeight);
    for (let y = 0; y < h; y += Math.round(vh * 0.8)) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await sleep(40); }
    await page.evaluate(() => window.scrollTo(0, 0));
  }
  await sleep(500);
}

// Which figure does an element belong to? (axe targets are CSS selectors)
const figureOf = (sel) => {
  const el = document.querySelector(sel);
  const f = el?.closest?.('figure[data-figure]');
  return f ? f.dataset.figure : null;
};

// ------------------------------------------------------------------ axe
async function runAxe() {
  const { default: AxeBuilder } = await import('@axe-core/playwright');
  const server = await startServer(ROOT);
  const browser = await chromium.launch();
  const combos = [];
  for (const file of PAGES) for (const vp of viewports) for (const theme of themes) combos.push({ file, vp, theme });
  const byRule = new Map();   // rule → { impact, help, nodes: Map(key → {pages:Set, target, figure, html, summary}) }
  await pool(combos, 4, async ({ file, vp, theme }) => {
    const ctx = await browser.newContext({ viewport: { width: VIEWPORTS[vp].width, height: VIEWPORTS[vp].height }, isMobile: !!VIEWPORTS[vp].isMobile, hasTouch: !!VIEWPORTS[vp].hasTouch, colorScheme: theme });
    const page = await ctx.newPage();
    await page.addInitScript((css) => addEventListener('DOMContentLoaded', () => { const s = document.createElement('style'); s.textContent = css; document.head.append(s); }), NO_BLUR);
    try {
      await page.goto(server.url + file, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      await mountAll(page);
      const res = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
        .analyze();
      for (const v of res.violations) {
        if (!byRule.has(v.id)) byRule.set(v.id, { impact: v.impact, help: v.help, nodes: new Map() });
        const rule = byRule.get(v.id);
        for (const n of v.nodes) {
          const target = n.target.join(' ');
          const fig = await page.evaluate(figureOf, n.target[n.target.length - 1]).catch(() => null);
          const key = `${fig || ''}|${target.replace(/:nth-child\(\d+\)/g, '')}`;
          if (!rule.nodes.has(key)) rule.nodes.set(key, { target, figure: fig, html: n.html.slice(0, 220), summary: (n.failureSummary || '').split('\n').slice(0, 3).join(' '), where: new Set() });
          rule.nodes.get(key).where.add(`${file} ${vp}/${theme}`);
        }
      }
      log(`axe ${file} ${vp}/${theme}: ${res.violations.length} rule(s) violated`);
    } catch (e) {
      err(`axe crashed on ${file} ${vp}/${theme}: ${String(e.message || e).split('\n')[0]}`);
    } finally { await ctx.close(); }
  });
  await browser.close(); await server.close();
  const out = [];
  for (const [id, r] of byRule) {
    const nodes = [...r.nodes.values()].map((n) => ({ ...n, where: [...n.where] }));
    out.push({ id, impact: r.impact, help: r.help, nodes });
    const shared = nodes.filter((n) => !n.figure);
    const figs = nodes.filter((n) => n.figure);
    if (shared.length) err(`axe ${id} (${r.impact}) ${r.help}: ${shared.length} shared-code node(s), e.g. ${shared[0].target} on ${shared[0].where[0]}`);
    if (figs.length) warn(`axe ${id} (${r.impact}) in figures: ${[...new Set(figs.map((n) => n.figure))].join(', ')}`);
  }
  report.results.axe = out;
}

// ------------------------------------------------------------------ cross-browser
async function runBrowsers() {
  const server = await startServer(ROOT);
  const engines = { webkit, firefox, chromium };
  report.results.browsers = {};
  for (const name of browsersWanted) {
    let browser;
    try { browser = await engines[name].launch(); } catch (e) { warn(`${name} could not be launched here: ${String(e.message || e).split('\n').find((l) => /Could not|error/i.test(l)) || 'launch failed'}`); continue; }
    const rows = [];
    await pool(PAGES, 3, async (file) => {
      for (const vpName of ['desktop', 'mobile']) {
        const vp = VIEWPORTS[vpName];
        // Firefox has no isMobile; emulate the width + touch only.
        const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, hasTouch: !!vp.hasTouch, ...(name !== 'firefox' && vp.isMobile ? { isMobile: true } : {}) });
        const page = await ctx.newPage();
        const diag = collectDiagnostics(page, server.url);
        try {
          await page.goto(server.url + file, { waitUntil: 'load', timeout: 30000 });
          await page.evaluate(() => document.fonts.ready);
          await mountAll(page, { timeout: 30000 });
          const figs = await page.evaluate(() => (window.__so?.figures?.() || []));
          const overflow = await page.evaluate(overflowProbe);
          const fonts = await page.evaluate(() => {
            const fams = {};
            for (const f of document.fonts) { const k = f.family.replace(/"/g, ''); fams[k] ||= []; fams[k].push(f.status); }
            const used = (sel) => { const el = document.querySelector(sel); return el ? getComputedStyle(el).fontFamily.split(',')[0].replace(/"/g, '').trim() : null; };
            return {
              loaded: Object.fromEntries(Object.entries(fams).map(([k, v]) => [k, v.filter((s) => s === 'loaded').length])),
              check: { body: document.fonts.check('18px "Source Serif 4"'), display: document.fonts.check('40px Fraunces'), ui: document.fonts.check('15px Inter') },
              h1: used('h1'),
            };
          });
          const feats = await page.evaluate(() => ({
            structuredClone: typeof structuredClone === 'function',
            has: CSS.supports('selector(:has(a))'),
            nesting: CSS.supports('selector(&)'),
            backdrop: CSS.supports('backdrop-filter', 'blur(2px)') || CSS.supports('-webkit-backdrop-filter', 'blur(2px)'),
            dialog: typeof HTMLDialogElement === 'function',
            containerQueries: CSS.supports('container-type', 'inline-size'),
          }));
          const failed = figs.filter((f) => f.status === 'failed');
          const pending = figs.filter((f) => f.status !== 'mounted' && f.status !== 'failed');
          const row = { file, vp: vpName, figures: `${figs.length - failed.length - pending.length}/${figs.length}`, failed: failed.map((f) => `${f.id}: ${(f.error || '').split('\n')[0]}`), pending: pending.map((f) => f.id), consoleErrors: diag.consoleErrors, pageErrors: diag.pageErrors, failedRequests: [...new Set(diag.failedRequests)], overflow: overflow.detected ? overflow : false, fonts, feats };
          rows.push(row);
          for (const f of row.failed) err(`${name} ${file} ${vpName}: figure failed: ${f}`);
          if (row.pending.length) warn(`${name} ${file} ${vpName}: figures still loading: ${row.pending.join(', ')}`);
          for (const e of diag.pageErrors) err(`${name} ${file} ${vpName}: page error: ${e.split('\n')[0]}`);
          for (const e of diag.consoleErrors) err(`${name} ${file} ${vpName}: console error: ${e}`);
          for (const r of row.failedRequests) err(`${name} ${file} ${vpName}: failed request: ${r}`);
          if (overflow.detected && vpName === 'mobile') err(`${name} ${file}: horizontal overflow at 390px (${overflow.offenders.slice(0, 3).join(', ')})`);
          if (!fonts.check.body || !fonts.check.display) warn(`${name} ${file} ${vpName}: web fonts not all loaded ${JSON.stringify(fonts.check)}`);
          log(`${name} ${file} ${vpName}: figures ${row.figures}${diag.consoleErrors.length + diag.pageErrors.length ? ' · ERRORS' : ''}`);
        } catch (e) {
          err(`${name} ${file} ${vpName}: crashed: ${String(e.message || e).split('\n')[0]}`);
        } finally { await ctx.close(); }
      }
    });
    report.results.browsers[name] = rows;
    await browser.close();
  }
  await server.close();
}

// ------------------------------------------------------------------ perf
async function runPerf() {
  const server = await startServer(ROOT);
  const browser = await chromium.launch();
  const rows = [];
  for (const file of PAGES) {
    for (const vpName of ['mobile', 'desktop']) {
      const vp = VIEWPORTS[vpName];
      const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: !!vp.isMobile, hasTouch: !!vp.hasTouch, deviceScaleFactor: vp.isMobile ? 2 : 1 });
      const page = await ctx.newPage();
      const cdp = await ctx.newCDPSession(page);
      await cdp.send('Performance.enable');
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: throttle });
      await page.addInitScript(() => {
        window.__perf = { long: [], lcp: 0, cls: 0 };
        try { new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__perf.long.push({ start: e.startTime, dur: e.duration }); }).observe({ type: 'longtask', buffered: true }); } catch {}
        try { new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__perf.lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true }); } catch {}
        try { new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__perf.cls += e.value; }).observe({ type: 'layout-shift', buffered: true }); } catch {}
      });
      const res = [];
      page.on('requestfinished', async (req) => {
        try {
          const r = await req.response();
          const body = await r.body().catch(() => Buffer.alloc(0));
          res.push({ url: req.url().replace(server.url, ''), type: req.resourceType(), bytes: body.length, gz: zlib.gzipSync(body).length, t: Date.now() });
        } catch { /* ignore */ }
      });
      try {
        const t0 = Date.now();
        await page.goto(server.url + file, { waitUntil: 'load' });
        await sleep(1500);
        const initial = { bytes: res.reduce((n, r) => n + r.bytes, 0), gz: res.reduce((n, r) => n + r.gz, 0), js: res.filter((r) => r.type === 'script').reduce((n, r) => n + r.gz, 0), requests: res.length, figureModules: res.filter((r) => /assets\/js\/figures\//.test(r.url)).map((r) => r.url.split('/').pop()) };
        const paint = await page.evaluate(() => Object.fromEntries(performance.getEntriesByType('paint').map((e) => [e.name, Math.round(e.startTime)])));
        const loadMetrics = Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map((m) => [m.name, m.value]));
        // Scroll the whole page at reading pace (wheel steps), counting long tasks.
        const before = await page.evaluate(() => window.__perf.long.length);
        const h = await page.evaluate(() => document.documentElement.scrollHeight);
        const tScroll = Date.now();
        for (let y = 0; y < h; y += 240) { await page.mouse.wheel(0, 240); await sleep(60); }
        await sleep(800);
        const scrollMs = Date.now() - tScroll;
        const perf = await page.evaluate(() => window.__perf);
        const scrollLong = perf.long.slice(before);
        const endMetrics = Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map((m) => [m.name, m.value]));
        const figMount = (await page.evaluate(() => (window.__so?.figures?.() || []).map((f) => ({ id: f.id, mountMs: f.mountMs ?? null, loadMs: f.loadMs ?? null }))))
          .sort((a, b) => (b.mountMs || 0) - (a.mountMs || 0));
        const total = { bytes: res.reduce((n, r) => n + r.bytes, 0), gz: res.reduce((n, r) => n + r.gz, 0), js: res.filter((r) => r.type === 'script').reduce((n, r) => n + r.gz, 0), requests: res.length };
        const row = {
          file, vp: vpName,
          fcp: paint['first-contentful-paint'], lcp: Math.round(perf.lcp), cls: +perf.cls.toFixed(3),
          initial, total,
          scriptLoadMs: Math.round(loadMetrics.ScriptDuration * 1000), scriptTotalMs: Math.round(endMetrics.ScriptDuration * 1000),
          longTasksScroll: scrollLong.length, tbtScroll: Math.round(scrollLong.reduce((n, l) => n + Math.max(0, l.dur - 50), 0)), maxLongTask: Math.round(Math.max(0, ...scrollLong.map((l) => l.dur))), scrollMs,
          heap: Math.round(endMetrics.JSHeapUsedSize / 1e6),
          figMount,
        };
        for (const f of figMount) if (f.mountMs > 250) warn(`perf ${file} ${vpName}: figure ${f.id} mount took ${f.mountMs} ms at ${throttle}× CPU throttle (blocks scrolling)`);
        rows.push(row);
        log(`perf ${file} ${vpName}: FCP ${row.fcp}ms LCP ${row.lcp}ms CLS ${row.cls} · initial ${(initial.gz / 1024).toFixed(0)}KB gz (${initial.requests} req, JS ${(initial.js / 1024).toFixed(0)}KB, figs ${initial.figureModules.length}) · total ${(total.gz / 1024).toFixed(0)}KB gz · script ${row.scriptTotalMs}ms · scroll long tasks ${row.longTasksScroll} (TBT ${row.tbtScroll}ms, max ${row.maxLongTask}ms) · slowest mounts ${figMount.slice(0, 3).map((f) => `${f.id} ${f.mountMs}ms`).join(', ')}`);
        void t0;
      } catch (e) {
        err(`perf ${file} ${vpName}: crashed: ${String(e.message || e).split('\n')[0]}`);
      } finally { await ctx.close(); }
    }
  }
  await browser.close(); await server.close();
  report.results.perf = rows;
}

// ------------------------------------------------------------------ lazy loading & off-screen pausing
async function runLazy() {
  const server = await startServer(ROOT);
  const browser = await chromium.launch();
  const rows = [];
  await pool(PAGES, 3, async (file) => {
    for (const vpName of ['desktop', 'mobile']) {
      const vp = VIEWPORTS[vpName];
      const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: !!vp.isMobile, hasTouch: !!vp.hasTouch });
      const page = await ctx.newPage();
      const fetched = [];
      page.on('request', (r) => { const m = r.url().match(/assets\/js\/figures\/([^/]+)\.js/); if (m) fetched.push(m[1]); });
      await page.addInitScript(() => {
        // Count animation frames that do work (rAF callbacks requested).
        window.__raf = 0;
        const raf = window.requestAnimationFrame.bind(window);
        window.requestAnimationFrame = (cb) => { window.__raf++; return raf(cb); };
      });
      try {
        await page.goto(server.url + file, { waitUntil: 'load' });
        await sleep(1200);
        // Figures whose top is within viewport + 900px margin may load; nothing else.
        const atLoad = [...new Set(fetched)];
        const near = await page.evaluate(() => [...document.querySelectorAll('figure.fig[data-figure]')].filter((f) => { const r = f.getBoundingClientRect(); return r.top < innerHeight + 900 && r.bottom > -900; }).map((f) => f.dataset.figure));
        const early = atLoad.filter((id) => !near.includes(id) && !/^(art|shared)/.test(id));
        if (early.length) err(`lazy ${file} ${vpName}: figure modules fetched before nearing the viewport: ${early.join(', ')}`);
        // Find a scroll position with no figure on screen (prose or sources) and measure idle rAF.
        const spot = await page.evaluate(() => {
          const figs = [...document.querySelectorAll('figure.fig[data-figure], .home-hero')];
          const H = document.documentElement.scrollHeight;
          for (let y = H - innerHeight; y > 0; y -= 200) {
            const clear = figs.every((f) => { const r = f.getBoundingClientRect(); const top = r.top + scrollY; return top + r.height < y || top > y + innerHeight; });
            if (clear) return y;
          }
          return null;
        });
        let idle = null;
        if (spot != null) {
          // Visit every figure first so they all mount and start, then park on the clear spot.
          await mountAll(page, { scroll: true });
          await page.evaluate((y) => window.scrollTo(0, y), spot);
          await sleep(1500);
          const a = await page.evaluate(() => window.__raf);
          await sleep(2000);
          const b = await page.evaluate(() => window.__raf);
          idle = Math.round((b - a) / 2);
          const running = await page.evaluate(() => {
            const g = window.__so?.gsap;
            return g ? g.globalTimeline.getChildren(true, true, false).filter((t) => t.isActive()).length : null;
          });
          if (idle > 5) warn(`lazy ${file} ${vpName}: ${idle} rAF callbacks/s while no figure is on screen (y=${spot})`);
          rows.push({ file, vp: vpName, fetchedAtLoad: atLoad, near, idleRafPerSec: idle, activeTweens: running, clearSpot: spot });
        } else rows.push({ file, vp: vpName, fetchedAtLoad: atLoad, near, idleRafPerSec: null });
        log(`lazy ${file} ${vpName}: fetched at load [${atLoad.join(', ')}] · idle rAF/s ${idle}`);
      } catch (e) {
        err(`lazy ${file} ${vpName}: crashed: ${String(e.message || e).split('\n')[0]}`);
      } finally { await ctx.close(); }
    }
  });
  await browser.close(); await server.close();
  report.results.lazy = rows;
}

// ------------------------------------------------------------------ subpath hosting
function copySite(dest) {
  const skip = new Set(['tools', 'content', 'docs', 'node_modules', '.git', '.DS_Store']);
  fs.mkdirSync(dest, { recursive: true });
  for (const name of fs.readdirSync(ROOT)) {
    if (skip.has(name)) continue;
    fs.cpSync(path.join(ROOT, name), path.join(dest, name), { recursive: true });
  }
}
async function runSubpath() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'so-subpath-'));
  const site = path.join(tmp, 'site');
  copySite(path.join(site, 'sub', 'dir'));
  const server = await startServer(site);
  const base = server.url + 'sub/dir/';
  const browser = await chromium.launch();
  const rows = [];
  await pool([...PAGES, ''], 3, async (file) => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await ctx.newPage();
    const diag = collectDiagnostics(page, server.url);
    const outside = [];
    page.on('request', (r) => { const u = r.url(); if (u.startsWith(server.url) && !u.startsWith(base)) outside.push(u.replace(server.url, '/')); });
    try {
      await page.goto(base + file, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      await mountAll(page);
      const res = await page.evaluate(async () => {
        const out = {};
        out.fonts = [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family.replace(/"/g, ''));
        const figs = window.__so?.figures?.() || [];
        out.figures = `${figs.filter((f) => f.status === 'mounted').length}/${figs.length}`;
        out.failed = figs.filter((f) => f.status === 'failed').map((f) => f.id);
        return out;
      });
      // Glossary popover: fetches glossary.json relative to the site root.
      const term = page.locator('main .prose a.term[data-term], main a.term[data-term]').first();
      if (await term.count()) {
        await term.scrollIntoViewIfNeeded();
        await term.hover();
        await sleep(700);
        res.popover = await page.evaluate(() => document.querySelector('.popover--term.is-open .popover__def')?.textContent?.slice(0, 60) || null);
        await page.mouse.move(2, 2);
      }
      // Chapter menu: fetches chapters.json relative to the site root.
      await page.click('[data-menu-toggle]');
      await sleep(400);
      res.menuLinks = await page.evaluate(() => document.querySelectorAll('dialog.drawer[open] a.drawer__link').length);
      res.menuHere = await page.evaluate(() => document.querySelector('dialog.drawer[open] [aria-current="page"]')?.getAttribute('href') || null);
      const row = { file: file || '(directory URL)', ...res, outside: [...new Set(outside)], consoleErrors: diag.consoleErrors, failedRequests: [...new Set(diag.failedRequests)] };
      rows.push(row);
      if (row.outside.length) err(`subpath ${row.file}: requests escaped the subpath: ${row.outside.slice(0, 4).join(', ')}`);
      for (const r of row.failedRequests) err(`subpath ${row.file}: failed request ${r}`);
      for (const e of row.consoleErrors) err(`subpath ${row.file}: console error ${e}`);
      if (row.failed.length) err(`subpath ${row.file}: figures failed: ${row.failed.join(', ')}`);
      if (row.popover === null) err(`subpath ${row.file}: glossary popover did not load a definition`);
      if (!row.menuLinks) err(`subpath ${row.file}: chapter menu did not build`);
      if (!row.fonts.length) err(`subpath ${row.file}: no web fonts loaded`);
      log(`subpath ${row.file}: figures ${row.figures} · fonts ${[...new Set(row.fonts)].join('/')} · popover ${row.popover === undefined ? '-' : row.popover ? 'ok' : 'FAIL'} · menu ${row.menuLinks} links (here: ${row.menuHere})`);
    } catch (e) {
      err(`subpath ${file}: crashed: ${String(e.message || e).split('\n')[0]}`);
    } finally { await ctx.close(); }
  });
  await browser.close(); await server.close();
  fs.rmSync(tmp, { recursive: true, force: true });
  report.results.subpath = rows;
}

// ------------------------------------------------------------------ file://
async function runFile() {
  const rows = [];
  for (const [name, engine] of [['chromium', chromium], ['webkit', webkit], ['firefox', firefox]]) {
    let browser;
    try { browser = await engine.launch(); } catch (e) { warn(`${name} could not be launched here (file:// not tested)`); continue; }
    for (const file of PAGES.filter((f) => /^(index|0\d|interlude|glossary)/.test(f)).slice(0, 4)) {
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
      const page = await ctx.newPage();
      try {
        await page.goto(pathToFileURL(path.join(ROOT, file)).href, { waitUntil: 'load' });
        await sleep(1500);
        const st = await page.evaluate(() => {
          const fb = [...document.querySelectorAll('figure.fig .fig__fallback')];
          const vis = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && +cs.opacity > 0.1; };
          return {
            js: document.documentElement.classList.contains('js'),
            booted: !!window.__so,
            fallbacks: fb.length, fallbacksVisible: fb.filter(vis).length,
            mounted: (window.__so?.figures?.() || []).filter((f) => f.status === 'mounted').length,
            quizExplain: [...document.querySelectorAll('.quiz__explain')].filter(vis).length,
            quizTotal: document.querySelectorAll('.quiz__explain').length,
            deadButtons: [...document.querySelectorAll('[data-theme-toggle], [data-menu-toggle]')].filter(vis).length,
          };
        });
        rows.push({ browser: name, file, ...st });
        const degraded = !st.booted;
        if (degraded && st.fallbacks && st.fallbacksVisible < st.fallbacks) err(`file:// ${name} ${file}: JS did not run but only ${st.fallbacksVisible}/${st.fallbacks} figure descriptions are visible`);
        if (degraded && st.quizTotal && st.quizExplain < st.quizTotal) err(`file:// ${name} ${file}: JS did not run but quiz explanations are hidden`);
        if (degraded && st.deadButtons) err(`file:// ${name} ${file}: JS did not run but ${st.deadButtons} header buttons are shown (they do nothing)`);
        log(`file:// ${name} ${file}: booted ${st.booted} · figures mounted ${st.mounted} · fallbacks visible ${st.fallbacksVisible}/${st.fallbacks} · quiz explanations ${st.quizExplain}/${st.quizTotal}`);
      } catch (e) {
        err(`file:// ${name} ${file}: crashed: ${String(e.message || e).split('\n')[0]}`);
      } finally { await ctx.close(); }
    }
    await browser.close();
  }
  report.results.file = rows;
}

// ------------------------------------------------------------------ metadata (static parse)
function runMeta() {
  const rows = [];
  const files = pages.length ? pages : READER_PAGES;
  const titles = new Map();
  for (const file of files) {
    const html = fs.readFileSync(path.join(ROOT, file), 'utf8');
    const head = html.slice(0, html.indexOf('</head>'));
    const get = (re) => (head.match(re) || [])[1] || null;
    const meta = (attr, name) => get(new RegExp(`<meta\\s+${attr}="${name.replace(/[:]/g, '\\$&')}"\\s+content="([^"]*)"`));
    const row = {
      file,
      lang: get(/<html[^>]*\slang="([^"]+)"/) || (html.match(/<html[^>]*\slang="([^"]+)"/) || [])[1] || null,
      title: get(/<title>([^<]*)<\/title>/),
      description: meta('name', 'description'),
      canonical: get(/<link rel="canonical" href="([^"]+)"/),
      ogTitle: meta('property', 'og:title'), ogDescription: meta('property', 'og:description'), ogImage: meta('property', 'og:image'), ogType: meta('property', 'og:type'),
      twitterCard: meta('name', 'twitter:card'), twitterImage: meta('name', 'twitter:image'),
      iconSvg: /<link rel="icon"[^>]*type="image\/svg\+xml"|<link rel="icon" href="[^"]*\.svg"/.test(head),
      iconPng: /<link rel="(?:icon|apple-touch-icon)"[^>]*\.png"/.test(head),
      themeColors: (head.match(/<meta name="theme-color"/g) || []).length,
      robotsNoindex: /<meta name="robots" content="noindex"/.test(head),
    };
    rows.push(row);
    for (const k of ['lang', 'title', 'description', 'ogTitle', 'ogDescription', 'ogImage', 'twitterCard']) if (!row[k]) err(`meta ${file}: missing ${k}`);
    if (row.description && (row.description.length < 50 || row.description.length > 170)) warn(`meta ${file}: description is ${row.description.length} chars (aim for 50–160)`);
    if (!row.iconSvg) err(`meta ${file}: no SVG favicon file link`);
    if (!row.iconPng) err(`meta ${file}: no PNG icon (apple-touch-icon / icon png)`);
    if (row.themeColors < 2) err(`meta ${file}: theme-color for light and dark missing`);
    if (row.ogImage) {
      const img = row.ogImage.replace(/^https?:\/\/[^/]+\/(?:[^/]+\/)*?(?=assets\/)/, '');
      if (!/^https?:/.test(row.ogImage) && !fs.existsSync(path.join(ROOT, img))) err(`meta ${file}: og:image ${row.ogImage} not found`);
    }
    if (titles.has(row.title)) err(`meta ${file}: duplicate <title> with ${titles.get(row.title)}`);
    titles.set(row.title, file);
  }
  // Dev pages must not be linked from reader pages.
  const dev = fs.readdirSync(ROOT).filter((f) => /^_.*\.html$|^art-gallery\.html$/.test(f));
  for (const file of READER_PAGES) {
    const html = fs.readFileSync(path.join(ROOT, file), 'utf8');
    for (const d of dev) if (new RegExp(`href="${d.replace('.', '\\.')}[#"?]`).test(html)) err(`meta ${file}: links to dev page ${d}`);
  }
  for (const d of dev) {
    const html = fs.readFileSync(path.join(ROOT, d), 'utf8');
    if (!/<meta name="robots" content="noindex/.test(html)) warn(`meta ${d}: dev page without <meta name="robots" content="noindex">`);
  }
  const cj = JSON.stringify(chapters);
  for (const d of dev) if (cj.includes(d)) err(`chapters.json lists dev page ${d}`);
  report.results.meta = rows;
  log(`meta: ${rows.length} pages checked`);
}

// ------------------------------------------------------------------ keyboard
async function runKeyboard() {
  const server = await startServer(ROOT);
  const browser = await chromium.launch();
  const rows = [];
  for (const file of PAGES) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    const diag = collectDiagnostics(page, server.url);
    await page.addInitScript((css) => addEventListener('DOMContentLoaded', () => { const s = document.createElement('style'); s.textContent = css; document.head.append(s); }), NO_BLUR);
    const issues = [];
    try {
      await page.goto(server.url + file, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      await mountAll(page);
      // 1. First Tab lands on the skip link, which is visible when focused and moves focus to <main>.
      await page.keyboard.press('Tab');
      await sleep(350);   // the skip link slides in (--dur-2)
      const skip = await page.evaluate(() => { const a = document.activeElement; const r = a.getBoundingClientRect(); return { cls: a.className, visible: r.width > 1 && r.height > 1 && r.top >= 0 && r.bottom <= innerHeight }; });
      if (skip.cls !== 'skip-link' || !skip.visible) issues.push(`first Tab: ${JSON.stringify(skip)} (want a visible .skip-link)`);
      await page.keyboard.press('Enter');
      await sleep(200);
      await page.keyboard.press('Tab');
      const afterSkip = await page.evaluate(() => { const a = document.activeElement; return { inMain: !!a.closest('main'), tag: a.tagName, txt: (a.textContent || '').trim().slice(0, 30) }; });
      if (!afterSkip.inMain) issues.push(`Tab after skip link lands outside <main>: ${JSON.stringify(afterSkip)}`);
      // 2. Walk the whole tab order; every stop needs a visible focus indicator and a name.
      await page.evaluate(() => { document.activeElement?.blur(); window.scrollTo(0, 0); });
      const stops = [];
      for (let i = 0; i < 900; i++) {
        await page.keyboard.press('Tab');
        const s = await page.evaluate(() => {
          const a = document.activeElement;
          if (!a || a === document.body) return null;
          const cs = getComputedStyle(a);
          // SVG controls draw their own focus shape; range inputs ring their thumb (::-webkit-slider-thumb).
          const ownRing = a instanceof SVGElement || (a.tagName === 'INPUT' && a.type === 'range');
          const ring = ownRing || (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) || (cs.boxShadow && cs.boxShadow !== 'none');
          const r = a.getBoundingClientRect();
          const name = (a.getAttribute('aria-label') || a.textContent || a.getAttribute('title') || a.value || '').trim().replace(/\s+/g, ' ').slice(0, 40);
          const fig = a.closest('figure[data-figure]')?.dataset.figure || null;
          let sel = a.tagName.toLowerCase() + (a.className && typeof a.className === 'string' ? '.' + a.className.trim().split(/\s+/).slice(0, 2).join('.') : '');
          return { sel, name, ring: !!ring, onScreen: r.bottom > 0 && r.top < innerHeight && r.width > 0, fig, y: Math.round(r.top + scrollY), hiddenAncestor: !!a.closest('[aria-hidden="true"]') };
        });
        if (!s) break;
        if (stops.length && stops[0].sel === s.sel && stops[0].y === s.y && stops[0].name === s.name) break;   // wrapped around
        stops.push(s);
      }
      const noRing = stops.filter((s) => !s.ring);
      const offScreen = stops.filter((s) => !s.onScreen);
      const unnamed = stops.filter((s) => !s.name);
      const hidden = stops.filter((s) => s.hiddenAncestor);
      for (const s of noRing.filter((x) => !x.fig).slice(0, 5)) issues.push(`no visible focus indicator: ${s.sel} "${s.name}"`);
      for (const s of offScreen.filter((x) => !x.fig).slice(0, 5)) issues.push(`focused element not scrolled on screen: ${s.sel} "${s.name}"`);
      for (const s of unnamed.filter((x) => !x.fig).slice(0, 5)) issues.push(`focusable without a name: ${s.sel}`);
      for (const s of hidden.slice(0, 5)) issues.push(`focusable inside aria-hidden: ${s.sel} "${s.name}"${s.fig ? ` (figure ${s.fig})` : ''}`);
      const figNoRing = [...new Set(noRing.filter((x) => x.fig).map((x) => x.fig))];
      if (figNoRing.length) warn(`keyboard ${file}: focus ring missing on controls in figures ${figNoRing.join(', ')}`);
      // 3. Theme menu: opens with Enter, arrows move, Escape closes and restores focus.
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.focus('[data-theme-toggle]');
      await page.keyboard.press('Enter');
      await sleep(100);
      const tm1 = await page.evaluate(() => document.activeElement?.getAttribute('role'));
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Escape');
      const tm2 = await page.evaluate(() => ({ back: document.activeElement?.matches('[data-theme-toggle]'), open: !!document.querySelector('.theme-menu') }));
      if (tm1 !== 'menuitemradio' || !tm2.back || tm2.open) issues.push(`theme menu keyboard: focus=${tm1} after Escape ${JSON.stringify(tm2)}`);
      // 4. Chapter menu: opens as a modal dialog, focus inside, Escape closes and restores focus.
      await page.focus('[data-menu-toggle]');
      await page.keyboard.press('Enter');
      await sleep(400);
      const cm1 = await page.evaluate(() => ({ open: !!document.querySelector('dialog.drawer[open]'), inside: !!document.activeElement?.closest('dialog') }));
      await page.keyboard.press('Escape');
      await sleep(200);
      const cm2 = await page.evaluate(() => ({ open: !!document.querySelector('dialog.drawer[open]'), back: document.activeElement?.matches('[data-menu-toggle]'), overflow: document.documentElement.style.overflow }));
      if (!cm1.open || !cm1.inside || cm2.open || !cm2.back || cm2.overflow) issues.push(`chapter menu keyboard: ${JSON.stringify({ cm1, cm2 })}`);
      // 5. Glossary term: focus shows a popover (aria-describedby), Escape hides it.
      if (await page.$('main a.term[data-term]')) {
        await page.evaluate(() => document.querySelector('main a.term[data-term]').scrollIntoView({ block: 'center' }));
        await page.evaluate(() => document.querySelector('main a.term[data-term]').previousElementSibling?.focus?.());
        // Focus via keyboard so :focus-visible matches.
        await page.evaluate(() => { const t = document.querySelector('main a.term[data-term]'); t.setAttribute('data-kb', '1'); });
        await page.focus('main a.term[data-kb]');
        await sleep(400);
        const g1 = await page.evaluate(() => { const p = document.querySelector('.popover--term'); const t = document.querySelector('main a.term[data-kb]'); return { open: !!p && !p.hidden, described: t.getAttribute('aria-describedby') === p?.id }; });
        await page.keyboard.press('Escape');
        await sleep(300);
        const g2 = await page.evaluate(() => { const p = document.querySelector('.popover--term'); return { open: !!p && !p.hidden && p.classList.contains('is-open'), focus: document.activeElement?.matches('a.term') }; });
        if (!g1.open || !g1.described || g2.open || !g2.focus) issues.push(`glossary popover keyboard: ${JSON.stringify({ g1, g2 })}`);
      }
      // 6. Citation: focus previews the source.
      if (await page.$('sup.cite a')) {
        await page.focus('sup.cite a');
        await sleep(300);
        const c1 = await page.evaluate(() => { const p = document.querySelector('.popover--term'); return !!p && !p.hidden && !!p.querySelector('.popover__cite'); });
        await page.keyboard.press('Escape');
        if (!c1) issues.push('citation preview did not open on keyboard focus');
      }
      // 7. Quiz: options are buttons; Enter answers; focus moves to "Try again" on a wrong answer.
      if (await page.$('.quiz__option[data-correct="false"]')) {
        await page.focus('.quiz__option[data-correct="false"]');
        await page.keyboard.press('Enter');
        await sleep(150);
        const q = await page.evaluate(() => ({ focus: document.activeElement?.textContent?.trim(), live: [...document.querySelectorAll('.quiz [aria-live]')].map((l) => l.textContent).join('|').slice(0, 60) }));
        if (!/Try again/.test(q.focus || '') || !q.live) issues.push(`quiz keyboard: ${JSON.stringify(q)}`);
      }
      // 8. Go deeper: summary toggles with Enter/Space.
      if (await page.$('details.deep-dive > summary')) {
        await page.focus('details.deep-dive > summary');
        await page.keyboard.press('Enter');
        const open = await page.evaluate(() => document.querySelector('details.deep-dive').open);
        await page.keyboard.press(' ');
        const closed = await page.evaluate(() => !document.querySelector('details.deep-dive').open);
        if (!open || !closed) issues.push('deep-dive summary not keyboard operable');
      }
      // 9. Stepper: Next/Previous buttons reachable, ArrowRight/Left on dots, caption live region.
      const st = await page.$('.stepper');
      if (st) {
        const s = await page.evaluate(() => {
          const el = document.querySelector('.stepper');
          const fig = el.closest('figure');
          const next = el.querySelector('[aria-label="Next step"]');
          const live = fig.querySelector('[aria-live]');
          return { next: !!next, nextName: next?.getAttribute('aria-label'), live: !!live, dots: el.querySelectorAll('.step-dot').length };
        });
        if (!s.next || !s.live) issues.push(`stepper a11y: ${JSON.stringify(s)}`);
      }
      rows.push({ file, stops: stops.length, noRing: noRing.length, offScreen: offScreen.length, unnamed: unnamed.length, issues, consoleErrors: diag.consoleErrors });
      for (const i of issues) err(`keyboard ${file}: ${i}`);
      for (const e of diag.consoleErrors) err(`keyboard ${file}: console error ${e}`);
      log(`keyboard ${file}: ${stops.length} tab stops · ${issues.length} issue(s)`);
    } catch (e) {
      err(`keyboard ${file}: crashed: ${String(e.message || e).split('\n')[0]}`);
    } finally { await ctx.close(); }
  }
  await browser.close(); await server.close();
  report.results.keyboard = rows;
}

// ------------------------------------------------------------------ reduced motion
// With prefers-reduced-motion, a figure on screen should be still: no rAF loop, no
// CSS animation. Counts rAF callbacks/s and running CSS animations per visible figure.
async function runMotion() {
  const server = await startServer(ROOT);
  const browser = await chromium.launch();
  const rows = [];
  await pool(PAGES, 3, async (file) => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    const diag = collectDiagnostics(page, server.url);
    await page.addInitScript(() => {
      window.__raf = 0;
      const raf = window.requestAnimationFrame.bind(window);
      window.requestAnimationFrame = (cb) => { window.__raf++; return raf(cb); };
    });
    try {
      await page.goto(server.url + file, { waitUntil: 'load' });
      await mountAll(page);
      const ids = await page.evaluate(() => [...document.querySelectorAll('figure.fig[data-figure]')].map((f) => f.dataset.figure));
      for (const id of ids) {
        await page.evaluate((i) => document.querySelector(`figure[data-figure="${i}"]`).scrollIntoView({ block: 'center' }), id);
        await sleep(1500);
        const a = await page.evaluate(() => window.__raf);
        await sleep(1000);
        const r = await page.evaluate((i) => ({
          raf: window.__raf,
          css: document.getAnimations().filter((an) => an.playState === 'running' && an.effect?.target?.closest?.(`figure[data-figure="${i}"]`)).map((an) => an.animationName || an.constructor.name).slice(0, 4),
        }), id);
        const perSec = r.raf - a;
        rows.push({ file, id, rafPerSec: perSec, cssAnimations: r.css });
        if (perSec > 5) warn(`motion ${file}: figure ${id} still requests ${perSec} frames/s under reduced motion`);
        if (r.css.length) warn(`motion ${file}: figure ${id} runs CSS animations under reduced motion: ${r.css.join(', ')}`);
      }
      for (const e of diag.pageErrors) err(`motion ${file}: page error ${e.split('\n')[0]}`);
      for (const e of diag.consoleErrors) err(`motion ${file}: console error ${e}`);
      log(`motion ${file}: ${ids.length} figures checked`);
    } catch (e) {
      err(`motion ${file}: crashed: ${String(e.message || e).split('\n')[0]}`);
    } finally { await ctx.close(); }
  });
  await browser.close(); await server.close();
  report.results.motion = rows;
}

const MODES = { motion: runMotion, axe: runAxe, browsers: runBrowsers, perf: runPerf, lazy: runLazy, subpath: runSubpath, file: runFile, meta: runMeta, keyboard: runKeyboard };
if (mode === 'all') { for (const m of ['meta', 'subpath', 'file', 'lazy', 'motion', 'keyboard', 'axe', 'browsers', 'perf']) await MODES[m](); }
else if (MODES[mode]) await MODES[mode]();
else { console.error(`Unknown mode "${mode}". Modes: ${Object.keys(MODES).join(', ')}, all`); process.exit(2); }

if (jsonOut) fs.writeFileSync(path.resolve(jsonOut), JSON.stringify(report, null, 2));
console.log(`\nsite-audit ${mode}: ${report.errors.length} error(s), ${report.warnings.length} warning(s)`);
for (const e of report.errors) console.log(`  ✗ ${e}`);
for (const w of report.warnings) console.log(`  ⚠ ${w}`);
process.exitCode = report.errors.length ? 1 : 0;

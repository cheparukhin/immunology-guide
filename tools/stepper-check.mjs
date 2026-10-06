#!/usr/bin/env node
// Verifies that a stepper figure reaches the SAME visual state for every step
// no matter how the reader gets there: Next, Back, jumping with the dots, or
// with prefers-reduced-motion (instant jumps). Compares the attributes of every
// element inside the stage (rounded), ignoring ambient (idle-loop) attributes.
//
//   node tools/stepper-check.mjs --page _sample.html --figure demo-stepper
//   node tools/stepper-check.mjs --page 04-presentation.html --figure ch04-mhc1-pathway --viewport mobile
//
// Exit code 1 if any path disagrees with the step-by-step reference.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { startServer, parseViewport } from './lib/server.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const get = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d; };
const pageFile = get('--page');
const figId = get('--figure');
const vp = parseViewport(get('--viewport', 'desktop'));
const SPEED = Number(get('--speed', 20));
if (!pageFile || !figId) { console.error('Usage: node tools/stepper-check.mjs --page <file.html> --figure <id> [--viewport desktop|mobile] [--speed 20]'); process.exit(2); }

const FIG = `figure[data-figure="${figId}"]`;

// Serialize the stage: element path → rounded attributes.
const snapshotFn = (sel) => {
  const stage = document.querySelector(`${sel} .fig__stage`);
  const out = {};
  const round = (v) => v.replace(/-?\d+\.\d+/g, (n) => String(Math.round(Number(n) * 10) / 10)).replace(/-0(?![.\d])/g, '0');
  const walk = (el, p) => {
    const attrs = {};
    for (const a of el.attributes) {
      if (['id', 'class', 'aria-hidden', 'role', 'focusable', 'data-hit', 'style', 'data-ambient', 'aria-labelledby', 'aria-describedby', 'aria-controls', 'for'].includes(a.name)) continue;
      // Generated ids (uniqueId: "rg-1a", "seg-4"…) depend on mount order: normalize references.
      attrs[a.name] = round(a.value).replace(/#([a-z]+)-[0-9a-z]+\b/g, '#$1-N');
    }
    const cs = el.style && el.style.cssText ? round(el.style.cssText) : '';
    if (cs) attrs.style = cs;
    // Idle loops (ctx.ambient) are allowed to differ: drop their transform-ish attributes.
    if (el.hasAttribute('data-ambient')) { delete attrs.transform; delete attrs.style; delete attrs['data-svg-origin']; }
    out[p] = attrs;
    [...el.children].forEach((c, i) => walk(c, `${p}/${c.tagName}${i}`));
  };
  [...stage.children].forEach((c, i) => walk(c, `${c.tagName}${i}`));
  return out;
};

function diff(a, b, ignore) {
  const out = [];
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const k of keys) {
    const x = a[k] || {}; const y = b[k] || {};
    for (const at of new Set([...Object.keys(x), ...Object.keys(y)])) {
      if (ignore.has(`${k}@${at}`)) continue;
      if (x[at] !== y[at]) out.push(`${k} [${at}]: ${String(x[at]).slice(0, 60)} ≠ ${String(y[at]).slice(0, 60)}`);
    }
  }
  return out;
}

const server = await startServer(ROOT);
const browser = await chromium.launch();
let failures = 0;

async function open(reducedMotion) {
  const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: !!vp.isMobile, hasTouch: !!vp.hasTouch, reducedMotion: reducedMotion ? 'reduce' : 'no-preference' });
  const page = await context.newPage();
  const errors = [];
  // Every figure is mounted, so ignore errors that belong to OTHER figures (or their 404s).
  const foreign = (t) => /Failed to load resource/.test(t)
    || [...t.matchAll(/\[figure ([\w-]+)\]|figures\/([\w-]+)\.js/g)].some((m) => (m[1] || m[2]) !== figId);
  page.on('pageerror', (e) => { const t = String(e.stack || e); if (!foreign(t)) errors.push(t.split('\n')[0]); });
  page.on('console', (m) => { if (m.type() === 'error' && !foreign(m.text())) errors.push(m.text()); });
  // No smooth scrolling (positions must be exact) and no backdrop blur (slow in headless).
  await page.addInitScript(() => addEventListener('DOMContentLoaded', () => {
    const st = document.createElement('style');
    st.textContent = 'html{scroll-behavior:auto!important}*,*::before,*::after{backdrop-filter:none!important;-webkit-backdrop-filter:none!important}';
    document.head.append(st);
  }));
  await page.goto(server.url + pageFile, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  // Mount EVERY figure up front so the page stops growing (other figures mounting later
  // would shift ours off-screen mid-check, especially on phones).
  await page.evaluate(() => window.__so?.mountAll?.());
  await page.waitForFunction(() => (window.__so?.figures?.() || []).every((f) => f.status === 'mounted' || f.status === 'failed'), null, { timeout: 30000 }).catch(() => {});
  await recenter(page);
  await page.waitForFunction((id) => ['mounted', 'failed'].includes(window.__so?.figure?.(id)?.status), figId, { timeout: 15000 });
  if (await page.evaluate((id) => window.__so.figure(id).status, figId) === 'failed') throw new Error(`figure ${figId} failed to mount`);
  // Speed every GSAP animation up so the check runs quickly.
  await page.evaluate(async (s) => { const m = await import(new URL('assets/vendor/gsap/index.js', location.href).href); m.gsap.globalTimeline.timeScale(s); }, SPEED);
  const n = await page.locator(`${FIG} .step-dot`).count();
  return { context, page, n, errors };
}
/** Center the figure's stage (or the figure itself) and wait until its position is stable for a few frames.
 *  Centering the stage, not the whole figure, matters for figures taller than the viewport. */
async function recenter(page) {
  await page.evaluate(async (sel) => {
    const fig = document.querySelector(sel);
    const el = fig.querySelector('.fig__stage') || fig;
    const frame = () => new Promise((r) => requestAnimationFrame(() => r()));
    let last = null;
    for (let k = 0; k < 40; k++) {
      el.scrollIntoView({ block: 'center', behavior: 'instant' });
      await frame(); await frame();
      const top = Math.round(el.getBoundingClientRect().top);
      if (top === last) return;
      last = top;
    }
  }, FIG);
}
const settle = (page, ms = 12000 / SPEED + 250) => page.waitForTimeout(ms);
const snap = (page) => page.evaluate(snapshotFn, FIG);
// All clicks are programmatic (dots are hidden on phones; no auto-scrolling), and the
// figure is re-centered before each one.
const press = async (page, sel, i = 0) => { await recenter(page); await page.locator(sel).nth(i).evaluate((el) => el.click()); };
const clickDot = (page, i) => press(page, `${FIG} .step-dot`, i);
const next = (page) => press(page, `${FIG} [aria-label="Next step"]`);
const prev = (page) => press(page, `${FIG} [aria-label="Previous step"]`);

try {
  // 1) Reference: step through with Next.
  const A = await open(false);
  if (!A.n) {
    // Some figures run a continuous sim and use a stepper only under reduced motion.
    await A.context.close();
    const R = await open(true);
    if (!R.n) throw new Error(`no stepper found in ${figId} (with or without reduced motion)`);
    console.log(`${figId}: stepper only under reduced motion (${R.n} steps): checking Next vs dot jumps there`);
    await settle(R.page, 600);
    const refR = [await snap(R.page)];
    for (let i = 1; i < R.n; i++) { await next(R.page); await settle(R.page, 300); refR.push(await snap(R.page)); }
    for (const i of [R.n - 1, 0, Math.floor(R.n / 2), 1].filter((k) => k < R.n)) {
      await clickDot(R.page, i); await settle(R.page, 300);
      const d = diff(refR[i], await snap(R.page), new Set());
      if (d.length) { failures++; console.log(`  ✗ Reduced motion dot jump → step ${i + 1}: ${d.length} difference(s)\n      ${d.slice(0, 6).join('\n      ')}`); }
      else console.log(`  ✓ Reduced motion dot jump → step ${i + 1}`);
    }
    if (R.errors.length) { failures++; console.log(`  ✗ console/page errors: ${R.errors.slice(0, 3).join(' | ')}`); }
    await R.context.close();
    throw Object.assign(new Error('done'), { done: true });
  }
  await settle(A.page, 2500);
  const ignore = new Set();
  const ref = [await snap(A.page)];
  for (let i = 1; i < A.n; i++) { await next(A.page); await settle(A.page); ref.push(await snap(A.page)); }
  console.log(`${figId}: ${A.n} steps (elements marked data-ambient are ignored)`);

  const report = (label, i, s) => {
    const d = diff(ref[i], s, ignore);
    if (d.length) { failures++; console.log(`  ✗ ${label} → step ${i + 1}: ${d.length} difference(s)\n      ${d.slice(0, 6).join('\n      ')}`); }
    else console.log(`  ✓ ${label} → step ${i + 1}`);
  };

  // 2) Back with Prev from the end.
  for (let i = A.n - 2; i >= 0; i--) { await prev(A.page); await settle(A.page); report('Back', i, await snap(A.page)); }
  // 3) Dot jumps in a scrambled order.
  const order = [A.n - 1, 0, Math.floor(A.n / 2), A.n - 1, 1, A.n - 2, 0].filter((i) => i >= 0 && i < A.n);
  for (const i of order) { await clickDot(A.page, i); await settle(A.page); report('Dot jump', i, await snap(A.page)); }
  // 4) Rapid clicks (interrupting animations), then settle.
  await clickDot(A.page, 0); await settle(A.page);
  for (let i = 1; i < A.n; i++) await next(A.page);
  await settle(A.page); report('Rapid Next ×' + (A.n - 1), A.n - 1, await snap(A.page));
  if (A.errors.length) { failures++; console.log(`  ✗ console/page errors: ${A.errors.slice(0, 3).join(' | ')}`); }
  await A.context.close();

  // 5) Reduced motion: instant jumps must match too.
  const B = await open(true);
  await settle(B.page, 600);
  for (const i of [A.n - 1, 0, Math.floor(A.n / 2)]) { await clickDot(B.page, i); await settle(B.page, 300); report('Reduced motion', i, await snap(B.page)); }
  if (B.errors.length) { failures++; console.log(`  ✗ console/page errors (reduced motion): ${B.errors.slice(0, 3).join(' | ')}`); }
  await B.context.close();
} catch (err) {
  if (!err.done) {
    failures++;
    console.error(`✗ ${err.message}`);
  }
} finally {
  await browser.close();
  await server.close();
}
console.log(failures ? `\n${failures} problem(s)` : '\nAll paths agree.');
process.exitCode = failures ? 1 : 0;

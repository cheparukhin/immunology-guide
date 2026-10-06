#!/usr/bin/env node
// Screenshot + diagnostics for one page. Starts its own static server on a
// free port, so any number of agents can run it at the same time.
//
//   node tools/shot.mjs --page _sample.html
//   node tools/shot.mjs --page _sample.html --viewport desktop,mobile --theme light,dark --full
//   node tools/shot.mjs --page _sample.html --figure demo-stepper --click next --times 4 --wait 1600
//   node tools/shot.mjs --page _sample.html --figure demo-sim --reduced-motion
//
// Always prints a JSON summary: console errors/warnings, page errors, failed
// requests, horizontal overflow, figures that failed to mount, files written.
// Full option list: node tools/shot.mjs --help   (and tools/README.md)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { startServer, parseViewport, collectDiagnostics, overflowProbe, figureProbe } from './lib/server.mjs';

const TOOLS = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(TOOLS, '..');

const HELP = `Usage: node tools/shot.mjs [--page file.html] [options]

  --page <file>          page at the repo root (default index.html; may also be given positionally)
  --viewport <v>[,<v>]   desktop (1440x900) | laptop (1280x800) | tablet (820x1180) |
                         mobile (390x844, touch) | small (360x740, touch) | WxH   (default desktop)
  --theme <t>[,<t>]      light | dark   (emulates prefers-color-scheme; default light)
  --full                 full-page screenshot (scrolls first so lazy figures mount)
  --figure <id>          screenshot one figure (scrolled into view, waits for mount)
  --selector <css>       screenshot one element
  --scroll <css|px>      scroll an element (or a y offset) into view before the shot
  --click <css|next|prev|play> [--times N]
                         click N times (default 1), screenshot after each click.
                         next/prev/play target the stepper of --figure (or the first stepper).
                         With --figure, --click/--tap/--focus selectors are scoped inside that figure
  --tap <css> [--times N] like --click but a touch tap (use with a touch viewport: mobile/small)
  --key <key> [--times N] press a key N times (after --focus), screenshot after each
  --focus <css>          focus an element before the shot (shows focus rings)
  --hover <css>          hover an element before the shot (e.g. a glossary term)
  --eval <js>            run JavaScript in the page before the shot
  --wait <ms>            settle time before each screenshot (default 500; 1800 with --figure)
  --reduced-motion       emulate prefers-reduced-motion: reduce
  --dpr <n>              device pixel ratio (default 1; 2 for mobile/small)
  --out <dir>            output directory (default tools/out)
  --name <prefix>        file name prefix (default: page name)
  --no-shot              diagnostics only
`;

// ------------------------------------------------------------------ args
const argv = process.argv.slice(2);
const opt = { page: null, viewport: 'desktop', theme: 'light', times: 1, out: path.join(TOOLS, 'out') };
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  const next = () => argv[++i];
  switch (a) {
    case '-h': case '--help': console.log(HELP); process.exit(0); break;
    case '--page': opt.page = next(); break;
    case '--viewport': opt.viewport = next(); break;
    case '--theme': opt.theme = next(); break;
    case '--full': opt.full = true; break;
    case '--figure': opt.figure = next(); break;
    case '--selector': opt.selector = next(); break;
    case '--scroll': opt.scroll = next(); break;
    case '--click': opt.click = next(); break;
    case '--key': opt.key = next(); break;
    case '--tap': opt.tap = next(); break;
    case '--times': opt.times = Number(next()) || 1; break;
    case '--focus': opt.focus = next(); break;
    case '--hover': opt.hover = next(); break;
    case '--eval': opt.eval = next(); break;
    case '--wait': opt.wait = Number(next()); break;
    case '--reduced-motion': opt.reducedMotion = true; break;
    case '--dpr': opt.dpr = Number(next()); break;
    case '--out': opt.out = path.resolve(next()); break;
    case '--name': opt.name = next(); break;
    case '--no-shot': opt.noShot = true; break;
    default:
      if (!a.startsWith('--') && !opt.page) opt.page = a;
      else { console.error(`Unknown option ${a}\n\n${HELP}`); process.exit(2); }
  }
}
opt.page ||= 'index.html';
if (!fs.existsSync(path.join(ROOT, opt.page.split(/[?#]/)[0]))) {
  console.error(`No such page: ${opt.page} (pages live at the repo root)`);
  process.exit(2);
}
const settle = opt.wait ?? (opt.figure ? 1800 : 500);
const viewports = opt.viewport.split(',').map((v) => parseViewport(v.trim()));
const themes = opt.theme.split(',').map((t) => t.trim());
fs.mkdirSync(opt.out, { recursive: true });

const STEP_ALIASES = {
  next: '.stepper [aria-label="Next step"]',
  prev: '.stepper [aria-label="Previous step"]',
  play: '.stepper .btn--play',
};

// ------------------------------------------------------------------ helpers
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitForFigures(page, ids, timeout = 10000) {
  await page.waitForFunction((want) => {
    const figs = window.__so?.figures?.();
    if (!figs) return false;
    return figs.filter((f) => !want || want.includes(f.id)).every((f) => f.status === 'mounted' || f.status === 'failed');
  }, ids, { timeout }).catch(() => {});
}

async function scrollThrough(page) {
  // Visit every screenful (so figures play their intro), then return to the top.
  // Backdrop blur is switched off meanwhile: headless Chromium repaints it in software.
  const noBlur = await page.addStyleTag({ content: '*,*::before,*::after{backdrop-filter:none!important;-webkit-backdrop-filter:none!important}' });
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  const vh = await page.evaluate(() => innerHeight);
  for (let y = 0; y < h; y += Math.round(vh * 0.8)) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await sleep(60);
  }
  await noBlur.evaluate((n) => n.remove());
  await page.evaluate(() => window.__so?.mountAll?.());
  await waitForFigures(page);
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(400);
}

function scoped(sel) {
  const s = STEP_ALIASES[sel] || sel;
  return opt.figure ? `figure[data-figure="${opt.figure}"] ${s}` : s;
}

// ------------------------------------------------------------------ run
const server = await startServer(ROOT);
const browser = await chromium.launch();
const results = [];
try {
  for (const vp of viewports) {
    for (const theme of themes) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: opt.dpr || (vp.isMobile ? 2 : 1),
        isMobile: !!vp.isMobile,
        hasTouch: !!vp.hasTouch,
        colorScheme: theme === 'dark' ? 'dark' : 'light',
        reducedMotion: opt.reducedMotion ? 'reduce' : 'no-preference',
      });
      const page = await context.newPage();
      const diag = collectDiagnostics(page, server.url);
      const shots = [];
      const base = [
        opt.name || opt.page.replace(/\.html.*$/, ''),
        opt.figure, opt.selector && 'el', vp.name, theme, opt.reducedMotion && 'rm', opt.full && 'full',
      ].filter(Boolean).join('-').replace(/[^\w.-]+/g, '_');
      const target = opt.figure ? `figure[data-figure="${opt.figure}"]` : opt.selector;
      // Keep the target centered (and therefore "visible" to the figure, so its
      // animations keep running) before every action and every capture.
      const recenter = async () => {
        if (!target) return;
        await page.locator(target).first().evaluate(async (el) => {
          const frame = () => new Promise((r) => requestAnimationFrame(() => r()));
          const r = el.getBoundingClientRect();
          if (r.height <= innerHeight) el.scrollIntoView({ block: 'center', behavior: 'instant' });
          else if (r.top > innerHeight * 0.1 || r.bottom < innerHeight * 0.9) el.scrollIntoView({ block: 'start', behavior: 'instant' });
          await frame(); await frame();
        });
      };
      const shoot = async (suffix = '') => {
        await recenter();
        await sleep(settle);
        if (opt.noShot) return;
        const file = path.join(opt.out, `${base}${suffix}.png`);
        // Fixed chrome (header, progress bar, TOC rail) is meaningless in element and
        // full-page captures and lands in odd places: hide it for the capture.
        const chrome = target || opt.full
          ? await page.addStyleTag({ content: `.progress,.toc{visibility:hidden!important}${target ? '.site-header{visibility:hidden!important}' : ''}` })
          : null;
        if (target) {
          // Clip a screenshot to the element (plus a little air). If it fits the viewport,
          // capture the viewport as is: a full-page capture resizes the viewport, which makes
          // figures briefly think they are off-screen (pausing their animations).
          const box = await page.locator(target).first().evaluate((el, pad) => {
            const r = el.getBoundingClientRect();
            const fits = r.top - pad >= 0 && r.bottom + pad <= innerHeight;
            const x = Math.max(0, r.left - pad);
            const y = fits ? r.top - pad : Math.max(0, r.top + scrollY - pad);
            return { fits, x: x + (fits ? 0 : scrollX), y, width: Math.min(document.documentElement.clientWidth - x, r.width + 2 * pad), height: r.height + 2 * pad };
          }, opt.figure ? 12 : 0);
          const { fits, ...clip } = box;
          await page.screenshot({ path: file, fullPage: !fits, clip });
          if (!fits) await recenter();
        } else await page.screenshot({ path: file, fullPage: !!opt.full });
        if (chrome) await chrome.evaluate((n) => n.remove());
        shots.push(path.relative(process.cwd(), file));
      };

      // Smooth scrolling would shift element clips mid-capture: turn it off for the tool.
      await page.addInitScript(() => {
        addEventListener('DOMContentLoaded', () => {
          const st = document.createElement('style');
          st.textContent = 'html{scroll-behavior:auto!important}';
          document.head.append(st);
        });
      });
      await page.goto(server.url + opt.page, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      await sleep(150);

      if (opt.full) await scrollThrough(page);
      if (opt.scroll) {
        if (/^\d+$/.test(opt.scroll)) await page.evaluate((y) => window.scrollTo(0, y), Number(opt.scroll));
        else await page.locator(opt.scroll).first().evaluate((el) => el.scrollIntoView({ block: 'start' }));
        await sleep(300);
      }
      if (opt.figure) {
        const fig = page.locator(`figure[data-figure="${opt.figure}"]`);
        if (!(await fig.count())) throw new Error(`No figure with data-figure="${opt.figure}" on ${opt.page}`);
        await fig.evaluate((el) => el.scrollIntoView({ block: 'center' }));
        await waitForFigures(page, [opt.figure]);
      }
      if (opt.selector) await page.locator(opt.selector).first().scrollIntoViewIfNeeded();
      if (opt.eval) await page.evaluate(opt.eval);
      if (opt.focus) await page.locator(scoped(opt.focus)).first().focus();
      if (opt.hover) await page.locator(opt.hover).first().hover();

      const acting = opt.click || opt.tap || opt.key;
      await shoot(acting ? '-00' : '');
      for (let k = 1; acting && k <= opt.times; k++) {
        await recenter();
        if (opt.click) await page.locator(scoped(opt.click)).first().click();
        else if (opt.tap) await page.locator(scoped(opt.tap)).first().tap();
        else await page.keyboard.press(opt.key);
        await shoot(`-${String(k).padStart(2, '0')}`);
      }

      const overflow = await page.evaluate(overflowProbe);
      const figures = await page.evaluate(figureProbe);
      results.push({
        page: opt.page,
        viewport: `${vp.name} ${vp.width}x${vp.height}`,
        theme,
        reducedMotion: !!opt.reducedMotion,
        screenshots: shots,
        consoleErrors: diag.consoleErrors,
        consoleWarnings: diag.consoleWarnings,
        pageErrors: diag.pageErrors,
        failedRequests: [...new Set(diag.failedRequests)],
        overflow,
        figures,
        ok: !diag.consoleErrors.length && !diag.pageErrors.length && !diag.failedRequests.length && !overflow.detected && !figures.failed.length,
      });
      await context.close();
    }
  }
} catch (err) {
  results.push({ error: String(err.stack || err) });
  process.exitCode = 1;
} finally {
  await browser.close();
  await server.close();
}
console.log(JSON.stringify(results.length === 1 ? results[0] : results, null, 2));

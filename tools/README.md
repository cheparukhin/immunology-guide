# tools/: dev-only build & QA

Nothing here ships with the site. The site itself has no build step: plain HTML, CSS and ES modules. These tools generate chapter pages from drafts and check the result. Every tool starts its **own** static server on a free port, so any number of agents can run them at the same time.

Setup (once): `cd tools && npm install` (Playwright's Chromium is already installed).
Run everything **from the repo root**.

## build-content.mjs: drafts → pages

```bash
node tools/build-content.mjs                 # every draft in content/drafts/
node tools/build-content.mjs --only 04       # one chapter (prefix or id; comma list ok: --only 04,05)
node tools/build-content.mjs --only _sample  # the sample page (_sample.html)
node tools/build-content.mjs --check         # parse and report problems, write nothing
node tools/build-content.mjs --only 04 --preview   # writes _preview-04-presentation.html instead of the real page
node tools/build-content.mjs --glossary-report     # + docs/reviews/glossary-conflicts.md
```

* Output: `<file>.html` at the repo root (file name from `assets/data/chapters.json`), plus `assets/data/glossary.json`, `assets/data/sources.json`, and the generated pages `glossary.html`, `sources.html` and `_dev.html` (build status: every page and figure id, module present or missing). All of these are regenerated from **all** drafts on every run, even with `--only`.
* Glossary: `content/glossary.md` (same `- id | Term | Definition` lines) is the canonical glossary, and its entries win. Ids it doesn't list use the earliest chapter's draft definition. "Introduced in…" points to the first chapter that uses `{{id}}`. Each run prints a one-line conflict count; `--glossary-report` writes `docs/reviews/glossary-conflicts.md` (every conflicting id, all variants with their drafts, first use, plus undefined and unused ids).
* Drafts named `_*.md` are dev samples. They get a page, but stay out of the site glossary/sources (their terms are embedded in the page).
* Writes are atomic and skipped when unchanged; re-running is idempotent.
* Warnings to act on: undefined glossary terms, citations without a source, figures without alt text, quiz options without explanations, unknown directives. Duplicate glossary ids are listed once per chapter.
* House style applied by the build: a citation marker always follows `. , ; :` ("you.¹", even if the draft wrote "you¹."). Quiz options are shuffled with a fixed seed (page id + question text), so the drafted order doesn't matter and the order never changes between builds. A warning appears when the key is the longest option in more than half of a page's questions.
* Chapter end: Next card (from the next draft's frontmatter: title, first sentence of `subtitle`, `reading_time`, `hero`), then the collapsed Sources, then the pager (Previous only). The last chapter gets the end-of-book panel, with text from its frontmatter `coda:`.
* Per-chapter CSS: create `assets/css/chapters/chNN.css`, then re-run the build so the page links it.
* Delete `_preview-*.html` files when you're done (`tools/check.mjs` ignores them).

## shot.mjs: screenshots + diagnostics

```bash
node tools/shot.mjs --page _sample.html                                   # desktop, light, viewport shot
node tools/shot.mjs --page _sample.html --viewport desktop,mobile --theme light,dark --full
node tools/shot.mjs --page _sample.html --figure demo-stepper             # one figure, scrolled in, mounted
node tools/shot.mjs --page _sample.html --figure demo-stepper --click next --times 4 --wait 5000
node tools/shot.mjs --page _sample.html --figure demo-sim --reduced-motion
node tools/shot.mjs --page _sample.html --viewport mobile --tap "a.term[data-term=chemokine]"     # touch
node tools/shot.mjs --page _sample.html --hover "a.term[data-term=phagocytosis]" --scroll "#how-a-macrophage-eats"
node tools/shot.mjs --page _sample.html --click "[data-menu-toggle]" --viewport mobile             # chapter menu
node tools/shot.mjs --page _sample.html --figure demo-stepper --focus next --key ArrowRight --times 2
node tools/shot.mjs --page _sample.html --selector ".quiz" --click ".quiz__option[data-correct=false]"
node tools/shot.mjs --page _sample.html --eval "document.querySelector('.deep-dive').open = true" --selector ".deep-dive"
node tools/shot.mjs --help
```

| Option | |
|---|---|
| `--page <file>` | page at the repo root (or positional) |
| `--viewport` | `desktop` 1440×900 · `laptop` 1280×800 · `tablet` 820×1180 · `mobile` 390×844 (touch, 2×) · `small` 360×740 · `WxH`. Comma list allowed |
| `--theme` | `light` / `dark` (emulates the OS preference). Comma list allowed |
| `--full` | full-page shot (scrolls first so lazy figures mount) |
| `--figure <id>` / `--selector <css>` | element shot (fixed header/TOC hidden during capture) |
| `--click <css>` / `--tap <css>` / `--key <key>` + `--times N` | act N times, one screenshot after each (`-00` is before). The figure/selector is re-centered before every action and capture, so it stays "visible" (animations keep running) across the whole run. `next`, `prev`, `play` are shortcuts for the stepper of `--figure`. With `--figure`, `--click`/`--tap`/`--focus` selectors are looked up **inside that figure** (e.g. `--focus svg`) |
| `--wait <ms>` | settle time before each shot (default 500; 1800 with `--figure`) |
| `--scroll <css or px>`, `--hover <css>`, `--focus <css>`, `--eval <js>` | prepare the shot |
| `--reduced-motion`, `--dpr N`, `--out <dir>` (default `tools/out/`), `--name <prefix>`, `--no-shot` | |

The JSON summary (printed every time) includes `consoleErrors`, `consoleWarnings`, `pageErrors`, `failedRequests`, `overflow` (`detected`, document width, the elements sticking out), `figures` (`mounted`, `failed` with error, `pending`), `screenshots`, and `ok` (true when all of the above are clean). Open the PNGs to review them; `tools/out/` is scratch space.

## measure-figures.mjs: reserve figure space (no layout shift)

```bash
node tools/measure-figures.mjs                 # every page
node tools/measure-figures.mjs 05-t-cells.html # one page, then: node tools/build-content.mjs --only 05
```
For each mounted figure, at 1440px and 390px wide, it records the stage aspect and how much the figure grows below its stage on mount, in `assets/data/figure-sizes.json` (merged, atomic). The build reserves exactly that before the module loads, so the page doesn't jump as figures lazy-load. Re-run it after a figure's layout changes.

## stepper-check.mjs: stepper state consistency

```bash
node tools/stepper-check.mjs --page _sample.html --figure demo-stepper [--viewport mobile]
```
Mounts every figure on the page first (so the page stops growing), re-centers the figure before each action, and clicks programmatically (works on phones where dots are hidden). Steps through with Next to record a reference state per step, then checks that Back, dot jumps in a scrambled order, rapid clicking, and reduced-motion jumps all land in exactly the same state (every attribute inside the stage, rounded; idle loops registered with `ctx.ambient` are ignored). If a figure only builds a stepper under reduced motion (a continuous sim otherwise, e.g. ch11-oncolytic), it checks Next against dot jumps there. Exit code 1 if anything disagrees.

## check.mjs: site-wide checker

```bash
node tools/check.mjs                       # every page at the root (except _preview-*)
node tools/check.mjs _sample.html 04-presentation.html
node tools/check.mjs --quiet               # only pages with problems
node tools/check.mjs --strict              # warnings fail too
node tools/check.mjs --pending-ok          # unbuilt figure modules are warnings, not errors
node tools/check.mjs --json
```
Each page is loaded at 390px with all figures force-mounted. Errors: console/page errors, failed requests, horizontal overflow at 390px, figures that fail to mount, figure modules not built yet (one line per page; a warning with `--pending-ok`), figures without fallback text, broken internal links and anchors, `data-term` ids missing from `glossary.json`, `<img>` without alt, duplicate ids. Warnings: console warnings, links to pages listed in `chapters.json` that aren't built yet, unlinked per-chapter CSS. Exit code 1 on errors.

## vendor.mjs: refresh vendored assets

```bash
node tools/vendor.mjs
```
Copies the variable fonts (Fraunces, Source Serif 4, Inter; latin + latin-ext) into `assets/fonts/`, and GSAP's ES-module build (minified per file) into `assets/vendor/gsap/`, regenerating `assets/vendor/gsap/index.js`. Only needed after upgrading the npm packages.

## site-audit.mjs: site-level QA (accessibility, browsers, performance, hosting)

```bash
node tools/site-audit.mjs axe        [pages…]   # axe-core (WCAG 2.2 AA + best practice), light+dark × desktop+390px, figures mounted
node tools/site-audit.mjs keyboard   [pages…]   # Tab order, visible focus, skip link, theme/chapter menus, popovers, quiz, Go deeper, stepper
node tools/site-audit.mjs browsers   [pages…] [--browsers webkit,firefox,chromium]   # console errors, figures mount, 390px overflow, fonts, API support
node tools/site-audit.mjs perf       [pages…] [--throttle 4]   # bytes (raw + gzip), FCP/LCP/CLS, script time, long tasks while scrolling, slowest figure mounts
node tools/site-audit.mjs lazy       [pages…]   # no figure module fetched before it nears the viewport; idle rAF/s when no figure is on screen
node tools/site-audit.mjs motion     [pages…]   # prefers-reduced-motion: every visible figure is still (no rAF loop, no CSS animation)
node tools/site-audit.mjs subpath    [pages…]   # copies the site to <tmp>/site/sub/dir/, serves the parent: pages, figures, fonts, glossary + menu fetches
node tools/site-audit.mjs file       [pages…]   # file:// shows figure descriptions and quiz explanations (no dead buttons)
node tools/site-audit.mjs meta                  # lang, title, description, Open Graph/Twitter, icons, theme-color; dev pages unlinked + noindex
node tools/site-audit.mjs all  [--json out.json] [--quiet]
```
Default pages are the reader-facing ones (chapters.json pages + extras); dev pages are only audited when named. Findings in shared code are errors; findings inside a figure are listed by figure id (warnings). Exit code 1 on errors. `npm install` in `tools/` brings `@axe-core/playwright`; the extra engines need `npx playwright install webkit firefox`. (On this Mac, Firefox 155 refuses to start headless under the agent session, "Could not find profile folder"; the audit skips it with a warning.) The figure loader records `loadMs`/`mountMs` per figure in `window.__so.figures()`, which `perf` uses.

## make-images.mjs: share card and PNG icons

```bash
node tools/make-images.mjs            # assets/img/share-card.jpg (1200×630), favicon-32.png, apple-touch-icon.png
```
The share card is the live home hero (its reduced-motion still: a killer T cell meeting the cancer cell) with the title and tagline, no chrome. Icons are rendered from `assets/img/favicon.svg` (the brand mark). Re-run after a brand or home-hero change. Social sites need absolute image URLs: set `site.url` in `assets/data/chapters.json` (e.g. `"https://example.org/self-and-other/"`) and rebuild; the build then also writes `canonical`, `og:url` and `sitemap.xml` (reader pages only). The shared `<head>` block (icons, theme colors, social cards, theme boot script) lives in `tools/lib/template.mjs`; the build copies it into the hand-written `index.html` and `about.html` between `<!-- head:start -->` and `<!-- head:end -->`.

## Fonts

`assets/fonts/` holds the variable woff2 files from `vendor.mjs` plus one hand-made subset, `fraunces-amp-italic.woff2`: the italic ampersand of the header brand, so pages that use no other Fraunces italic skip the 146 KB face. After upgrading Fraunces, regenerate it (fontTools: `pip install fonttools brotli`):
```bash
pyftsubset assets/fonts/fraunces-latin-italic.woff2 --unicodes=U+0026 --layout-features='*' --flavor=woff2 --output-file=assets/fonts/fraunces-amp-italic.woff2
```

## Preview and deploy

The site is plain static files with relative paths: no build step at serve time, no server configuration, no `robots.txt` needed (dev pages carry `<meta name="robots" content="noindex">` and nothing reader-facing links to them).

* **Preview** from the repo root (ES modules don't load from `file://`; opened that way, pages fall back to text descriptions of the figures):
  ```bash
  python3 -m http.server 8000        # → http://localhost:8000/
  npx serve .                        # or any static server
  ```
* **Deploy** to any static host (GitHub Pages, Netlify, Cloudflare Pages, S3, a plain web server), at the domain root or under a subpath (`/repo/` works as is). Before deploying: set `site.url` in `assets/data/chapters.json` and run `node tools/build-content.mjs`. Upload the site files only:
  ```bash
  rsync -a --delete --exclude '.*' \
    --exclude '/tools/' --exclude '/content/' --exclude '/docs/' --exclude '/dist/' --exclude '/h-*/' \
    --exclude '/_*.html' --exclude '/art-gallery.html' --exclude '/*.txt' \
    ./ dist/                          # then publish dist/ (≈ 7 MB)
  ```
  Let the host gzip/brotli text files. Nothing is fingerprinted, so cache HTML, `assets/js/` and `assets/data/` briefly (or revalidate) and `assets/fonts/`, `assets/img/` and `assets/vendor/` for long.

## Files
```
tools/
  build-content.mjs   drafts → pages, glossary.json, sources.json
  shot.mjs            screenshots + diagnostics
  check.mjs           site-wide checks
  stepper-check.mjs   stepper consistency
  measure-figures.mjs mounted figure sizes → assets/data/figure-sizes.json
  site-audit.mjs      site-level QA: axe, keyboard, WebKit/Firefox, performance, lazy loading, reduced motion, subpath, file://, metadata
  make-images.mjs     share card (1200×630) + PNG icons from the live site
  vendor.mjs          fonts + GSAP vendoring
  lib/template.mjs    page shell (header, footer, <head>); shared by the build
  lib/server.mjs      ephemeral static server, viewports, probes
  out/                screenshots (scratch)
```

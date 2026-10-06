# Site QA: accessibility, cross-browser, performance, robustness, metadata

Site-level audit of the 17 reader-facing pages (home, 12 chapters, interlude, glossary, sources, about), 6 October 2026. Every check is scripted and repeatable: `node tools/site-audit.mjs <mode>` (new; see `tools/README.md`) plus the existing `tools/check.mjs`. Dev pages (`_dev.html`, `_sample.html`, `_kit-demo.html`, `art-gallery.html`) were excluded except for the "unlinked and noindex" check.

**Status after this pass:** `check.mjs` 21 pages, 0 errors, 0 warnings. axe (WCAG 2.2 AA + best practice, light/dark × 1440/390 px, every figure mounted): **0 violations in shared code**, 4 rules left inside 8 figures (listed below). Keyboard walk: 0 issues on all 17 pages. WebKit: 17 pages × desktop/phone, 0 console errors, every figure mounts, no 390 px overflow. Subpath hosting: 0 errors. `file://`: degrades to text. Reduced motion: every visible figure is still. Metadata: 0 errors.

---

## 1. Accessibility

### Method
* `site-audit axe`: axe-core 4.13 via `@axe-core/playwright` (installed in `tools/`), tags wcag2a/aa, wcag21a/aa, wcag22aa, best-practice; 68 runs (17 pages × light/dark × desktop/390 px), after `mountAll()` and a scroll through the page. Each finding is mapped to the figure that contains it, if any.
* `site-audit keyboard`: real Tab presses through the whole page (44–416 stops per page): every stop must be on screen, named, not inside `aria-hidden`, and show a focus indicator; skip link first and visible, lands in `<main>`; theme menu (Enter, arrows, Escape returns focus); chapter menu (modal `<dialog>`, focus inside, Escape returns focus and unlocks scrolling); glossary term (keyboard focus opens the popover, `aria-describedby` set, Escape closes, focus stays); citation preview on focus; quiz (Enter answers, focus moves to "Try again", live region speaks); Go deeper (Enter/Space); stepper (named Next button, live caption).
* `site-audit motion`: with `prefers-reduced-motion: reduce`, each figure is scrolled into view and must request no animation frames and run no CSS animations: 0 findings across 58 figures.
* Reflow: no horizontal overflow at 320 px on any page (WCAG 1.4.10).

### Fixed (shared code)
| Issue | Where | Fix |
|---|---|---|
| "Chapters" button had no accessible name on phones (label `display:none`) — axe `button-name`, critical, every page | `layout.css` | Label is visually hidden below 40rem instead of removed |
| Empty `<th>` in comparison tables (`empty-table-header`) — ch. 4, 10 | build template | The empty corner cell becomes `<td>`; each body row's first cell becomes `<th scope="row">` (styled in `base.css`) |
| Badge words (✓ ≈ ✕ ~) 4.2:1 on their own tint (e.g. ch02-nk-missing-self "Spared") | `components.css` | `.badge__label` mixes 30 % ink into the outcome color (≥ 6:1, both themes); glyph unchanged |
| Card-chip description 4.25:1 on the pressed (accent-tinted) fill | `components.css` | `--ink-2` when pressed |
| Stage tags ("Illustrative", "Not to scale") at 11 px reached 4.46:1 on tinted light stages | `figures.css` | `.fig-tag-caps` uses `--fg-2` |
| Loading pulse kept animating under reduced motion | `figures.css` | Static under `prefers-reduced-motion` |

The automated keyboard walk flagged SVG `g[role=button]` controls and range inputs as "no focus ring"; these draw their own focus shape (SVG rect / slider thumb). Spot-checked on screenshots (ch07-evidence, int-timeline): visible. The audit now treats them as such.

### Remaining figure-level (by id)
| Figure | Rule | Detail | Suggested fix |
|---|---|---|---|
| ch12-resistance, ch12-combinations | aria-allowed-attr (critical) | The modules set `role="radio"` on kit chips, which carry `aria-pressed` (not allowed on radios) | Drop the `radiogroup`/`radio` roles (keep the kit's toggle buttons) or switch to `aria-checked` and restyle on it |
| ch08-tail | nested-interactive (serious) | `button.tl-row` contains focusable source links (`[14]`) | Move the citation links out of the row buttons (e.g. a source line under the list) |
| ch07-cycle | color-contrast | `.c7-part` #8D6A29 on #F9ECD5 = 4.25:1 (12 px bold, light theme) | Darker text or lighter chip fill |
| ch09-humanization | color-contrast | `.hz-stop__year` `--ink-3` on #E8E7F0 = 4.25:1 | `--ink-2` |
| ch10-logic-gates | color-contrast | slider `output` dimmed to #7B7C7D / #8B8B8E (3.2–4.5:1, both themes) | Don't dim the value; `--ink-2` |
| ch11-oncolytic | color-contrast | `.onc-count > .fig-tag-caps` overrides the tag color back to `--ink-3` (4.46:1) | Remove the override |

---

## 2. Cross-browser

### Method
`site-audit browsers --browsers webkit` (Playwright WebKit 26.6 ≈ Safari 26): every page at 1440 px and 390 px (touch), all figures mounted: console/page errors, failed requests, figures mounted, overflow, web fonts loaded (`document.fonts.check`), support for `structuredClone`, `:has()`, nesting, `backdrop-filter`, `<dialog>`, container queries. Plus side-by-side screenshots (WebKit vs Chromium) of the home hero, a chapter hero lens, dark-stage figures (ch04-mhc1-pathway), a chart with drop-shadow + pictogram (ch08-tail) and ch01-scale. Static scan of all CSS/JS for features newer than Safari 16.4.

### Results
* **WebKit: clean.** 34/34 page-viewport runs, every figure mounted, fonts loaded, no overflow. SVG filters (glow, grain), gradients, masks, `backdrop-filter` (header) render as in Chromium.
* An early WebKit run caught `CSS.escape is not a function` in `figures/shared/chart.js` (breaking ch07-immunoediting, ch08-tail, ch11-hpv, ch11-four-fixes, ch12-ctdna). It was a mid-edit state of the shared kit (the file shadows the global `CSS` with a module-level `const CSS = \`…\``); it was gone on re-run. See the hygiene note below.
* Static scan: no CSS nesting; `:has()` only in a progressive badge padding rule; `color-mix`, container queries, `svh` (with `vh` fallback), `@starting-style` and `interpolate-size` (both progressive) are fine on Safari ≥ 16.4/17. JS: no `structuredClone`, `Promise.withResolvers`, `Object.groupBy`, set methods, iterator helpers, `scrollend` or lookbehind regexes; canvas `roundRect` is feature-tested; `requestIdleCallback` (absent in Safari) falls back to `setTimeout`.
* **Fixed:** the glossary toolbar's blur lacked `-webkit-backdrop-filter` (Safari ≤ 17 showed it opaque).
* **Firefox could not be tested here:** both Playwright's Firefox 155 and the installed Firefox 155.0.1 exit at launch with "Could not find profile folder" under this agent's macOS session (sandbox on or off). The audit skips Firefox with a warning; please run `node tools/site-audit.mjs browsers --browsers firefox` on another machine before launch. Nothing Gecko-specific was found by static review (no `alignment-baseline`, no `-webkit-`-only properties without the standard one, `dominant-baseline` used for SVG text is supported).
* Cosmetic: at device-pixel-ratio 1, WebKit rasterizes the chapter-hero lens mask in visible steps; at DPR 2 (every Mac/iPhone screen) it is smooth. Left as is.

---

## 3. Performance

### Method
`site-audit perf`: Chromium, CPU throttled 4×, phone (390 px, DPR 2) and desktop. Bytes per request (raw and gzip-estimated), FCP/LCP/CLS, script time (CDP), long tasks while wheel-scrolling the whole page, and per-figure `mountMs` (the loader now records `loadMs`/`mountMs` in `window.__so.figures()`). `site-audit lazy`: which figure modules are fetched at load vs. which are within viewport + 900 px; animation frames per second while no figure is on screen.

### Numbers (after fixes; first visit, nothing cached; local server)
| Page | First paint (4× CPU) | Initial transfer (gzip) | of which fonts | JS at load (gzip) | Slowest figure mount (4× CPU) |
|---|---|---|---|---|---|
| Home | ~205 ms | 888 KB | 470 KB | 204 KB (hero art library + GSAP) | home-hero 110 ms |
| Chapters | 180–270 ms | 694–848 KB | 410–560 KB | 208 KB (hero figure only) | see below |
| Glossary / Sources / About | 120–250 ms | 512 / 612 / 484 KB | 410 KB | 28–30 KB | n/a |

Repeat visits fetch ~150–250 KB (fonts cached). CLS ≈ 0 everywhere except ch12-ctdna on phones (below). Lazy loading works: at load only the chapter's hero module is fetched; every other figure module is requested only within 900 px of the viewport (verified on all pages, desktop and phone); figure loops, ambient tweens and tracked art animations pause off-screen and in hidden tabs.

### Fixed (shared code)
* **Fonts: −141 KB on 12 of 17 first page views.** The header brand's italic "&" pulled in the full Fraunces italic (146 KB) on every page. A 5 KB subset (`assets/fonts/fraunces-amp-italic.woff2`, U+0026, all axes) is declared after the full face, so the full italic now loads only where other Fraunces italic text appears (home, ch. 2, 4, 6, 9). Preloads were reviewed and kept at two (Fraunces + Source Serif upright: the hero title and body); no "preloaded but unused" warnings.
* **Figure mounts scheduled off active scrolling.** Within 900 px the module, GSAP and UI are fetched and evaluated at once, but `mount()` (the expensive part: up to 0.9 s at 4× CPU) now runs when scrolling pauses (140 ms), when the figure is within 250 px, or after 2.5 s, whichever is first. `mountAll()` (tools) is unchanged. A/B on phones at 4× CPU with reader-like scrolling (half-screen bursts, 0.7 s pauses): ch04-lymph-node-search's ~330 ms mount moved from mid-scroll into a pause; on ch. 1, 3 and 8 the long tasks barely moved, because the figures' mounts are simply long (figure-level fixes below matter more).
* Figure reservations re-measured (`measure-figures.mjs`, all pages): unchanged, so the remaining CLS is not a stale reservation.

### Remaining (figure / art level)
| Where | Finding | Suggested fix |
|---|---|---|
| ch01-scale (~600 ms), ch03-clonal-selection (620–780), ch04-lymph-node-search (400–880), ch08-tail (~600), ch05-thymus (~440), ch08-two-brakes (~300), ch01-gene-to-protein (~300), ch10-journey (~300) | `mount()` blocks the main thread this long at 4× CPU (mid-range phone) | Build only the first step's scene at mount; create later steps/panels lazily (first visit or `onceVisible`); reuse defs/sprites; avoid layout reads inside build loops |
| `assets/js/art/animate.js` (art library) | The shared ticker keeps requesting a frame (60/s) whenever any art animation exists, even when all are paused or off-screen: 60 rAF/s on every chapter page while reading plain text. No visual effect, but it keeps the phone's rendering loop awake (battery) | Stop the loop when no animation is runnable; restart it from `resume()` / the visibility observer |
| ch12-ctdna | On phones its slider grows ~54 px after it scrolls into view, pushing the cards below (CLS 0.04–0.10) | Render the slider's label/value at mount (or reserve its height) |
| ch10-crs | `backdrop-filter` without `-webkit-` (Safari ≤ 17: no blur; the panel is 94 % opaque, so cosmetic) | Add the prefixed property |

---

## 4. Robustness

* **Subpath hosting** (`site-audit subpath`: the site copied to `<tmp>/site/sub/dir/`, served from `<tmp>/site/`): all 17 pages plus the bare directory URL load with no failed request and no request escaping the subpath; every figure mounts; all three font families load; the glossary popover fetches `glossary.json` and shows a definition; the chapter menu builds from `chapters.json` and marks the current page (`index.html` for the directory URL). All asset paths are relative or resolved from `import.meta.url`.
* **`file://`** (fixed): Chromium, WebKit (and Firefox) refuse ES modules from `file://`, but the inline boot script still set the `js` class, so quiz explanations stayed hidden and the theme/menu buttons were shown but dead. The boot script now skips the `js` class on `file://` (site.js adds it when it does run), and the module script tag gets `onerror` to fall back the same way if `site.js` ever fails to load over http (verified by removing `site.js`: no `js` class, all 16 quiz explanations visible, header buttons hidden). Result on `file://`: figure descriptions, all quiz explanations and no dead buttons (Chromium, WebKit).
* **Links:** `check.mjs` (internal links and anchors on 21 pages): 0 errors. External: 385 unique links (313 DOI, 27 PubMed, 45 other), all well-formed (https, `doi.org/10.…`, no trailing punctuation). Gentle sample: 16 DOIs via the doi.org handle API (1 req/s) all resolve; all 27 PMIDs exist (one batched E-utilities call). The two surprising titles (Hemoglobin C disease, caffeine) are intentional ch. 1 citations.
* No 404s, console errors or warnings on any page in Chromium or WebKit.

---

## 5. Metadata & polish

* **Every reader page now has:** `lang="en"`, unique `<title>`, meta description (home shortened to 159 chars), `color-scheme`, `theme-color` for light (#FAF7F2) and dark (#0E121B), SVG favicon file (`assets/img/favicon.svg`, the brand mark) + 32 px PNG + 180 px `apple-touch-icon`, Open Graph (`og:type`, `og:site_name`, `og:title`, `og:description`, `og:image` + size + alt) and `twitter:card=summary_large_image`. Dev pages get `robots: noindex` and no social tags.
* **Share card:** `assets/img/share-card.jpg`, 1200×630, 107 KB: the live home hero (its reduced-motion still: a killer T cell meeting the violet cancer cell, the contact glow) with the title and tagline. JPEG because a PNG of this glowing scene is ~1 MB. Regenerate with `node tools/make-images.mjs`.
* **One source of truth for the head:** `headMeta()` in `tools/lib/template.mjs`. Generated pages use it directly; the build copies the same block into the hand-written `index.html` and `about.html` between `<!-- head:start -->`/`<!-- head:end -->` (only that block and the `site.js` tag are touched).
* **Absolute URLs:** social sites need an absolute `og:image`. `assets/data/chapters.json → site.url` (empty now) switches `og:image`, `og:url`, `canonical` to absolute and makes the build write `sitemap.xml` (reader pages only). **Set it before launch** and rebuild; the build prints a reminder while it is empty.
* **`--c-mast`** (#C9C2D6, = art palette `mast`) + `--c-mast-deep` (#6E6680, 5.1:1 on paper) + `--c-mast-granule` (#5B5FA8) added to `tokens.css`; exposed as `ctx.colors.mast`, `ctx.colors.deep.mast`, `ctx.colors.stroke.mast`, `ctx.colors.mastGranule`. (Docs not edited here, owner please: DESIGN.md §2 palette list needs the `--c-mast` line, and the DESIGN.md §4 hand-written page shell should say to copy the `<!-- head:start -->…<!-- head:end -->` block from `index.html` (icons, social cards, the new boot script) and the `site.js` tag with its `onerror`.)
* **Print stylesheet:** always the light palette (dark text even when the screen theme is dark), no chrome; each figure prints as its written description plus all step captions; every Go deeper is opened before printing (`beforeprint`) and closed after; quiz explanations shown; headings kept with their text.
* **Dev pages** (`_dev.html`, `_sample.html`, `_kit-demo.html`, `art-gallery.html`, `_preview-*`): not linked from any reader page, not in `chapters.json`, the menu or the sitemap; all carry `noindex`. `tools/README.md` has preview (`python3 -m http.server`, `npx serve`) and deploy notes, including an rsync recipe that leaves them (and tools/, content/, docs/) out.

---

## 6. Open items by severity

**High (before launch)**
1. Set `site.url` in `assets/data/chapters.json` and rebuild, or social previews will not show the image (relative `og:image`).
2. Run the Firefox smoke test elsewhere (`node tools/site-audit.mjs browsers --browsers firefox`); it could not start in this environment.
3. Stray files at the repo root that must not be published: `hdr.txt` and `sid.txt` (HTTP headers and an MCP session id from a tool run), `h-interlude-1020/` (a screenshot), `.DS_Store`. The README's rsync recipe excludes them; better to delete them.

**Medium (figure / art owners)**
4. ch12-resistance, ch12-combinations: invalid `aria-pressed` on `role="radio"` (critical in axe).
5. ch08-tail: links nested in row buttons.
6. Mount cost of ch01-scale, ch03-clonal-selection, ch04-lymph-node-search, ch08-tail, ch05-thymus (≥ 400 ms at 4× CPU).
7. `art/animate.js`: idle 60 rAF/s while every art animation is paused/off-screen.

**Low**
8. Contrast just under 4.5:1 in ch07-cycle, ch09-humanization, ch10-logic-gates, ch11-oncolytic (small text).
9. ch12-ctdna layout shift on phones; ch10-crs unprefixed `backdrop-filter`.
10. Hygiene: 40 figure modules plus `figures/shared/chart.js` and `cycle-wheel.js` declare `const CSS = \`…\`` at module level, shadowing the global `CSS` (`CSS.escape`, `CSS.supports`); that is what briefly broke chart.js. Rename to `STYLES`.
11. WebKit lens mask stepping at DPR 1 only (cosmetic).

---

## 7. Files changed

* `assets/css/tokens.css` (`--c-mast*`), `layout.css` (menu label), `components.css` (badge, chip, glossary toolbar prefix), `figures.css` (stage tag color, reduced-motion spinner, figure print block), `base.css` (row headers, print stylesheet), `fonts.css` (ampersand subset face).
* `assets/js/site.js` (print: open details), `assets/js/ui/figures.js` (mount scheduling, `mountMs`/`loadMs`, `mast` colors).
* `assets/fonts/fraunces-amp-italic.woff2`, `assets/img/` (favicon.svg, favicon-32.png, apple-touch-icon.png, share-card.jpg).
* `assets/data/chapters.json` (`site.url`, `shareImage`, `shareImageAlt`).
* `tools/lib/template.mjs` (`headMeta`, `file://` guard, `SITE_SCRIPT`), `tools/build-content.mjs` (row headers, noindex for dev/preview pages, head sync for index/about, sitemap), `tools/lib/site-pages.mjs`, `tools/site-audit.mjs` (new), `tools/make-images.mjs` (new), `tools/vendor.mjs` (reminder), `tools/README.md`, `tools/package.json` (`@axe-core/playwright`).
* Regenerated: every chapter page, `glossary.html`, `sources.html`, `_dev.html`, `_sample.html`; head block of `index.html`, `about.html`.

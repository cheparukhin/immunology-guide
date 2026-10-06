# Design system

The site is a calm, editorial reading experience: warm paper, impeccable long-form type, generous whitespace. Its figures are windows into a glowing microscopic world. This document lists the tokens and every component with copy-paste markup, says when to use which, and gives visual rules for figure authors. The CSS lives in `assets/css/`:

| File | Contents |
|---|---|
| `fonts.css` | `@font-face` for Fraunces, Source Serif 4, Inter (self-hosted variable woff2, latin + latin-ext) |
| `tokens.css` | every color, size, duration; dark theme |
| `base.css` | reset, body, long-form typography (`.prose`) |
| `layout.css` | header, progress bar, chapter menu, hero, content grid, TOC, sources, pager, footer |
| `components.css` | callouts, Go deeper, takeaways, quiz, glossary terms, citations, popover, buttons, slider, switch, segmented, legend, stat, step dots |
| `figures.css` | figure frame, dark/light stages, in-figure text classes, controls bar, captions |
| `chapters/chNN.css` | optional per-chapter additions (owned by chapter builders; linked automatically by the build) |

Rule of thumb: **use tokens, never raw values.** If you need a value that doesn't exist, ask for a token.

---

## 1. Principles

1. **Reading first.** The text column is sacred: about 68 characters per line, 18–20px serif, nothing animated next to it.
2. **Figures are windows.** The dark stage is the "luminous microscope": deep navy, soft glow, a vignette. Light stages are for charts, timelines and schematics.
3. **Quiet chrome.** UI is Inter, small, gray, and gets out of the way. Accent indigo marks only links, labels and the current state.
4. **Calm motion.** Slow, physical easing; nothing flashes; everything respects reduced motion and pauses off-screen.
5. **Two themes, equal care.** Every component is designed for both. The dark stage is identical in both themes.

---

## 2. Tokens (`tokens.css`)

### Page colors
| Token | Light | Dark | Use |
|---|---|---|---|
| `--paper` | `#FAF7F2` | `#0E121B` | page background |
| `--paper-2` / `--paper-3` | `#F3EEE5` / `#ECE5DA` | `#151A26` / `#1B2131` | sunken panels (Go deeper, quiz, code) / hover |
| `--surface` | `#FFFFFF` | `#171D2A` | cards, popovers, light stage |
| `--ink` | `#1B1F2A` | `#E8E5DF` | text (15:1) |
| `--ink-2` | `#4A5163` | `#B4B8C5` | secondary text (7:1) |
| `--ink-3` | `#666C80` | `#9097A9` | meta, captions labels (≥ 4.8:1) |
| `--rule` / `--rule-strong` | `#E6E0D6` / `#D3CBBE` | `#242B3A` / `#343C4F` | hairlines / control borders |
| `--accent` | `#3348E0` | `#8EA2FF` | links, labels, focus, current state (6.3:1 / 7.8:1) |
| `--accent-soft`, `--accent-line` | translucent accent | | hover fills, underlines |
| `--success`, `--danger` (+ `-soft`) | | | quiz feedback only |
| `--key`, `--clinic`, `--note` (+ `-ink`, `-tint`) | indigo, teal, bronze | | callout identities |
| `--chart-1…5`, `--chart-muted`, `--chart-grid`, `--chart-axis` | | | data series on light stages |

### Cell & molecule palette (both themes, PLAN §4)
`--c-healthy #E9C9A1` · `--c-cancer #B65FD8` · `--c-cd8 #4C8DFF` · `--c-cd4 #2EC4C9` · `--c-treg #8C95C9` · `--c-bcell #F2B33D` · `--c-antibody #F2B33D` · `--c-nk #FF8A3D` · `--c-macrophage #FF7A6B` · `--c-m2 #B7727E` · `--c-dc #4FD18B` · `--c-neutrophil #F4A6C8` · `--c-mdsc #A7A35A` · `--c-fibroblast #9C8F80` · `--c-bacteria #B5D94A` · `--c-virus #FF4D5E` · `--c-mhc #D9DEEA` · `--c-self-peptide #E9C9A1` · `--c-neo-peptide #FF3D7F` · `--c-inhibit #E5484D` · `--c-activate #3DDC97` · `--c-drug #F2B33D` (+ `--c-drug-outline #FFF`) · `--c-mast #C9C2D6` (mast cell; `--c-mast-deep #6E6680`, 5.1:1 on paper; granules `--c-mast-granule #5B5FA8`; in JS `ctx.colors.mast`, `ctx.colors.deep.mast`, `ctx.colors.stroke.mast`, `ctx.colors.mastGranule`).

Each has a `-deep` twin (e.g. `--c-cd8-deep #3C6EC5`) with ≥ 4.6:1 contrast on paper: use it for strokes and text on **light** stages in the light theme, and the base color for fills. Light stages turn dark in the dark theme, where the base colors read best. In JS, `ctx.colors.stroke.cd8` picks the right one for you (`ctx.colors.cd8` and `ctx.colors.deep.cd8` are the raw values).

### Stage tokens
`--stage-dark-a #0B1024` (edge) → `--stage-dark-b #131B36` (center glow), `--stage-dark-ink #E9ECF6`, `--stage-dark-ink-2 #A9B1CC`, `--stage-dark-ink-3`, `--stage-dark-line`, `--stage-dark-grid`, `--stage-dark-border`.
Inside any `.fig__stage` use the **stage-aware** variables, which switch between dark and light stages: `--fg`, `--fg-2`, `--fg-3`, `--line`, `--grid`, `--halo` (a background-colored outline for text), `--stage-focus`.

### Type
| Token | Value | Use |
|---|---|---|
| `--font-display` | Fraunces | titles, headings, key ideas, pull quotes |
| `--font-body` | Source Serif 4 | reading text, captions |
| `--font-ui` | Inter | UI, labels, figure text |
| `--text-body` | 18 → 20px | body |
| `--text-lead` | 20 → 24px | first paragraph |
| `--text-sm` | 16–17px | captions, notes, sources |
| `--text-ui` / `--text-xs` / `--text-2xs` | 15 / 13 / 12px | buttons / UI / uppercase micro labels |
| `--text-h1` / `--text-h2` / `--text-h3` | 42→84 / 28→40 / 21→24px | |
| `--leading-body` | 1.65 | |
| `--tracking-caps` | 0.08em | uppercase labels |
| `--fraunces-soft` / `--fraunces-display` | `"SOFT" 50` / `"SOFT" 100` | Fraunces character (via `font-variation-settings`); optical size is automatic |

### Space, shape, depth, motion
* Spacing: `--s-1 … --s-10` = 4, 8, 12, 16, 24, 32, 48, 64, 96, 128px. Prose rhythm: `--flow` (1.15em between paragraphs), `--flow-lg` (2.75rem around figures and callouts).
* Layout: `--measure 42rem` (text column), `--wide 72rem` (wide figures), `--gutter` (16px on phones → 48px), `--header-h 3.5rem`.
* Radii: `--r-xs 4` · `--r-sm 6` · `--r-md 10` · `--r-lg 16` · `--r-xl 22` · `--r-pill`.
* Shadows: `--shadow-1` (resting card), `--shadow-2` (hover), `--shadow-3` (popover, drawer), `--shadow-stage`.
* Motion: `--dur-1 120ms` (hover) · `--dur-2 220ms` (small UI) · `--dur-3 420ms` (panels) · `--dur-4 800ms` (figure level). Eases `--ease-out`, `--ease-in-out`, `--ease-in`, `--ease-spring` (gentle). All durations become 0 under reduced motion. The GSAP equivalents are `'so.out'`, `'so.inOut'`, `'so.in'`.

### Theming
Light tokens live on `:root`. Dark tokens are redefined under `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { … } }` **and** under `:root[data-theme="dark"]`. Keep both blocks in sync. The theme button sets `data-theme` on `<html>` (stored in `localStorage` key `so-theme`). An inline script in `<head>` applies it before first paint. JS listens with `onThemeChange` from `assets/js/ui/theme.js` (event `so:themechange`).

---

## 3. Typography in practice

* **Chapter title** (`.hero__title`): Fraunces, optical size auto, SOFT 70, weight 420, tight tracking. The big outlined numeral (`.hero__num`) hangs in the left margin on wide screens and sits above the title on narrow ones.
* **Dek** (`.hero__dek`): Source Serif italic, `--text-lead`, `--ink-2`.
* **Lead paragraph**: the first paragraph gets `.lead` (larger) and a Fraunces drop cap in accent.
* **h2**: Fraunces 460, preceded by a short accent rule. **h3**: Fraunces 560. **h4**: Inter uppercase micro label.
* **Body**: oldstyle proportional numerals; headings and UI use lining numerals; tables and stats use tabular figures.
* **Small caps** for acronyms in running text if desired: `<span class="sc">DNA</span>`. **UI caps**: `.caps` / `.label-caps`.
* Links: accent with a soft underline that strengthens on hover; external links get a small ↗.
* Quotes: the build converts straight quotes to curly ones, `'` to ’, and `...` to …. Write plain ASCII in drafts.

---

## 4. Page shell (hand-written pages: home, about)

Chapter pages, `glossary.html` and `sources.html` are generated by `tools/build-content.mjs` (template: `tools/lib/template.mjs`). Pages written by hand must use the same shell. **The `<head>` is shared:** copy the block between `<!-- head:start -->` and `<!-- head:end -->` from `index.html` (icons, theme colors, social cards, the boot script that sets the `js` class except on `file://`), and the `site.js` tag with its `onerror` fallback. The build keeps that block and tag in sync in `index.html` and `about.html` (`headMeta()` and `SITE_SCRIPT` in `template.mjs`). The skeleton below shows the order. Its head lines are older than that block, so use the block, not these lines:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Glossary · Self &amp; Other</title>
  <meta name="description" content="…">
  <meta name="color-scheme" content="light dark">
  <script>(function(){var d=document.documentElement;d.classList.add('js');try{var t=localStorage.getItem('so-theme');if(t==='light'||t==='dark')d.setAttribute('data-theme',t);}catch(e){}})();</script>
  <link rel="preload" href="assets/fonts/source-serif-4-latin-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="assets/fonts/fraunces-latin-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="assets/css/fonts.css">
  <link rel="stylesheet" href="assets/css/tokens.css">
  <link rel="stylesheet" href="assets/css/base.css">
  <link rel="stylesheet" href="assets/css/layout.css">
  <link rel="stylesheet" href="assets/css/components.css">
  <link rel="stylesheet" href="assets/css/figures.css">
  <script type="module" src="assets/js/site.js"></script>
</head>
<body class="page-glossary" data-page="glossary">
  <a class="skip-link" href="#main">Skip to content</a>
  <div class="progress" aria-hidden="true"><div class="progress__bar"></div></div>
  <!-- header: copy from any generated chapter page (the .site-header block) -->
  <main id="main">
    <div class="page-grid prose">
      <h1>…</h1>
      …
    </div>
  </main>
  <!-- footer: copy from any generated chapter page (the .site-footer block) -->
</body>
</html>
```

The easiest way to get the exact header and footer is to copy them from `_sample.html`. They contain no page-specific data except the optional `.site-header__context` (chapter number and title, shown after scrolling past the hero), which can stay empty. A generator can also import `page()` from `tools/lib/template.mjs`.

---

## 5. Layout

`.chapter-body` (and `.page-grid` for other pages) is a named-line grid:

```
[full-start] gutter [wide-start] … [content-start] text column (42rem) [content-end] … [wide-end] gutter [full-end]
```

* Every direct child sits in `content` by default.
* `.is-wide` / `.fig--wide` → up to `--wide` (72rem). `.is-full` / `.fig--full` → edge to edge.
* On phones every column collapses to the screen minus 16px gutters. Nothing may overflow horizontally (`tools/check.mjs` tests 390px).
* **Hero** (`.hero`): kicker (Part), numeral, label ("Chapter 4"), title, dek, meta (reading time, figure count). Optional hero figure (frontmatter `hero: <figure-id>` → `.hero--art .hero__art > .fig.fig--hero`): a round "lens" into the microscope beside the title on wide screens (≥ 75rem; crisp edge with a soft shadow in the light theme, feathered into the page in the dark theme, via `--lens-feather` / `--lens-shadow`), a soft-edged 2:1 band under the dek on narrower screens. With a lens, the title and dek share a 28.5rem column (`--hero-text-w`) and the title's size is capped by its longest word (`--title-longest`, emitted by the build), so a title of any length wraps beside the lens and never runs under it (checked for every chapter from 360 to 2560 px wide). Minimal frame: no number, title, controls or caption. Reference pages (glossary, sources) use the quieter `.hero--page`.
* **TOC** (`details.toc`): the build lists every `h2` (+ Takeaways, Sources). Below 75rem it's a collapsed "In this chapter" disclosure at the top of the article. From 75rem up it becomes a fixed rail in the left margin that appears after the hero and fades away whenever a wide figure passes behind it. Scroll-spy marks the current section (`aria-current`).
* **Chapter end** (build, POLISH S3): after the takeaways comes a **Next card** (`nav.next-chapter > a.next-card`). It shows the next chapter's label, title, the first sentence of its subtitle, its reading time and a small round lens with that chapter's live hero figure (`.fig--hero.fig--lens`, lazy-loaded like any figure). Then **Sources**, collapsed (`details.sources-block` with the "Sources (N)" heading in its summary). `site.js` opens it before any jump to `#src-n` or `#sources`, and each cited source ends with a ↩ link to its first citation (`a.src-up`). Last comes the **pager** (`nav.pager`), which keeps only "Previous" on chapters, because Next is the card above. The last chapter shows an **end-of-book panel** (`section.book-end`) instead of a Next card: the frontmatter `coda:` text plus Glossary, All sources, About and Start again (Chapter 1).
* **Pull quote** (`blockquote.pullquote`, written as HTML in a draft, `aria-hidden` because it repeats the text): a quiet epigraph, not a heading. It is centered in a 28rem column under a short accent rule, in light Fraunces at about 1.25–1.5rem in `--ink-2`, with less space below than above.
* **Sources page** (`sources.html`): a sticky filter box like the glossary's search ("/" focuses it, `?q=` prefills it). Each cited source has a ↩ link to its first citation in the chapter.
* **Header**: brand, chapter context (after the hero), theme menu (Light / Dark / Auto), "Chapters" drawer (built from `assets/data/chapters.json`, current page marked and expanded with its sections). It tucks away while reading down and returns on any upward scroll.
* **Progress**: a 2px accent bar at the top of the viewport tracks the article.

---

## 6. Components

### Callouts. When to use which
| Component | Draft directive | Use for | Avoid |
|---|---|---|---|
| **Key idea** | `:::key-idea` | The one or two sentences the reader must not miss (≈ 1–3 per chapter). Set in the display face between hairlines. | Long text, lists, citations-heavy content |
| **In the clinic** | `:::clinic` | A short real-world or clinical connection: a drug, a trial, a patient story. Teal, left rule. | Medical advice |
| **Note** | `:::note Optional title` | A small aside: naming, history, a caveat. Bronze, left rule. | Anything essential (put it in the text) |
| **Go deeper** | `:::deep-dive Title` | Collapsible depth: molecular names, numbers, controversies. Can contain anything, even figures. | Content the main story depends on |
| **Takeaways** | `:::takeaways` | 4–6 bullets at the end of a chapter. Numbered, card. | Mid-chapter summaries |
| **Quiz** | `:::quiz` | 3–4 multiple-choice questions with a one-sentence explanation per option. | Trick questions |

```html
<div class="callout callout--key" role="note">
  <p class="callout__label label-caps"><svg …/>Key idea</p>
  <div class="callout__body"><p>…</p></div>
</div>

<aside class="callout callout--clinic">
  <p class="callout__label label-caps"><svg …/>In the clinic</p>
  <div class="callout__body"><p>…</p></div>
</aside>

<aside class="callout callout--note">
  <p class="callout__label label-caps"><svg …/>A note on names</p>
  <div class="callout__body"><p>…</p></div>
</aside>

<details class="deep-dive">
  <summary>
    <span class="deep-dive__label label-caps">Go deeper</span>
    <span class="deep-dive__title">Why only some peptides fit</span>
    <span class="deep-dive__icon" aria-hidden="true"></span>
  </summary>
  <div class="deep-dive__body"><p>…</p></div>
</details>

<section class="takeaways" aria-labelledby="takeaways">
  <p class="takeaways__label label-caps">Before you go</p>
  <h2 id="takeaways" data-toc-title="Takeaways">Takeaways</h2>
  <ul><li>…</li></ul>
</section>
```

### Quiz
```html
<section class="quiz" data-quiz aria-label="Check your understanding">
  <div class="quiz__head">
    <p class="quiz__label label-caps">Check your understanding</p>
    <p class="quiz__score">2 questions</p>
  </div>
  <div class="quiz__q" data-q>
    <p class="quiz__question" id="quiz-1-q1"><span class="quiz__qnum">1.</span>Question?</p>
    <ul class="quiz__options" role="list" aria-labelledby="quiz-1-q1">
      <li><button type="button" class="quiz__option" data-correct="false">
        <span class="quiz__marker" aria-hidden="true">A</span>
        <span class="quiz__text">Option</span>
        <span class="quiz__explain">Why it's wrong.</span>
      </button></li>
    </ul>
    <div class="quiz__foot"></div>
  </div>
</section>
```
Behavior (`ui/quiz.js`): picking an option locks the question and reveals its explanation. If it's right, all explanations show. If it's wrong, the reader gets "Try again" (resets the question) and "Show answer". The result is announced politely and the score updates. Without JS, all explanations are visible.

### Glossary terms and popovers
```html
<a class="term" data-term="mhc" href="glossary.html#mhc">MHC molecules</a>
```
Draft: `{{mhc|MHC molecules}}` (or `{{mhc}}` to use the glossary's term name, lowercased mid-sentence). Definitions come from `assets/data/glossary.json` (`{ term, def, chapter, chapterLabel, chapterTitle, page, canonical? }`, where `term` and `def` are inline HTML). They are assembled by the build: an entry in `content/glossary.md` (the canonical glossary) wins, and otherwise the earliest chapter's definition is used. `chapter`/`page` point to the **first chapter that uses the term**, whose first occurrence carries `id="term-<id>"`, so "Introduced in…" links land exactly there. Hover with intent delay, keyboard focus, or first tap on touch shows a popover. A second tap or Enter follows the link, and Escape or scrolling closes it. Popovers stay inside the viewport, flip above when there's no room below, and never trap focus. Mark a term on its **first use in a chapter** only.

### Citations and sources
```html
<sup class="cite"><a href="#src-3" id="ref-3" aria-label="Source 3">3</a></sup>
<sup class="cite"><a href="#src-2">2</a><span class="sep">,</span><a href="#src-5">5</a></sup>   <!-- [^2][^5] -->
…
<h2 id="sources" class="sources-title">Sources</h2>
<ol class="sources-list" role="list">
  <li id="src-3"><span class="src-num">3</span>Author A, et al. Title. <em>Journal</em> 2020;1:1. <a href="https://doi.org/…">doi:…</a></li>
</ol>
```
Hovering or focusing a citation previews the source. Clicking jumps to it, highlights it (`:target`), and adds a "↩ Back to text" link. The build turns `doi:…` and `PMID …` into links.

### Figure frame
See `docs/FIGURES.md` §2 for the full markup. Classes: `.fig` (`--wide`, `--full`, `--hero`), `.fig__head`, `.fig__label`, `.fig__title`, `.fig__stage[data-stage="dark|light"]`, `.fig__fallback`, `.fig__controls`, `.fig__caption`, `.fig__steps > .fig__step(.is-active)`. States: `.is-loading`, `.is-mounted`, `.is-failed`, `.is-compact`, `.is-offscreen`.

### Controls
Built by `ctx.ui.*` (see FIGURES.md §6). The markup is also usable on hand-written pages:

```html
<button class="btn">Default</button>
<button class="btn btn--primary">Primary</button>
<button class="btn btn--ghost">Ghost</button>
<button class="btn btn--icon" aria-label="Next"><svg …/></button>        <!-- + .btn--sm -->

<div class="slider" style="--fill: 60%">
  <label class="slider__label" for="s1">Signal strength</label><output class="slider__value" for="s1">60%</output>
  <input class="slider__input" id="s1" type="range" min="0" max="100" value="60">
</div>

<button class="switch" role="switch" aria-checked="true"><span class="switch__track" aria-hidden="true"></span><span>Show antibodies</span></button>

<div class="segmented"><span class="segmented__label" id="seg1">Cell</span>
  <div class="segmented__track" role="radiogroup" aria-labelledby="seg1">
    <button class="segmented__opt" role="radio" aria-checked="true">Healthy</button>
    <button class="segmented__opt" role="radio" aria-checked="false" tabindex="-1">Infected</button>
  </div>
</div>

<ul class="legend" role="list"><li class="legend__item" style="--sw: var(--c-cd8)"><span class="legend__swatch"></span><span>Killer T cell</span></li></ul>
<div class="stat"><span class="stat__label">At the site</span><span class="stat__value">42<small> / 200</small></span></div>
```
Step dots: `.step-dots > button.step-dot[aria-current="step"|.is-done][data-tip]`. Tooltips come from `data-tip`.

### Figure UI kit (chips, info card, badges, stage HUD)
Built by `ctx.ui.chips`, `ctx.ui.infoCard`, `ctx.ui.badge` / `badgeHTML`, `ctx.badgeSVG`, `ctx.tag`, `ctx.ui.clock` (API: FIGURES.md §6b). When to use which:
* **Chips** (`.chips` › `.chip[aria-pressed]`, `variant: 'card'` for tiles with a description line): choosing *things* (targets, therapies, cell types), single or multi. Use a segmented control for 2–4 mutually exclusive *modes*, and a switch for on/off.
* **Info card** (`.info-card`): the details of the current selection. It sits beside the stage on wide figures (`fig__main.has-side`, ≥ 900px) and becomes an inline panel under the stage on phones. Never a modal or bottom sheet.
* **Outcome badges** (`.badge--yes|partial|no|varies`, glyphs ✓ ≈ ✕ ~; tokens `--yes --partial --no --varies`, brighter inside dark stages): the verdict of a recognition, test or treatment. Shape and color always travel together.
* **Stage HUD** (`.fig__hud`): corner stacks over the stage. **Tags** (`.fig-tag-caps`: "Illustrative", "Not to scale", "Time compressed", top right, two at most) and the **clock** (`.fig-clock`: clock icon + tabular time, top left). Both are quiet, small-caps or tabular Inter, and never interactive.

### Popover
`.popover` (+ `.popover--tip` for small figure tooltips) is a single floating element managed by `ui/popover.js` (`new Floating().show(anchor, html)`). Don't build other tooltip systems.

---

### Generated reference pages
`glossary.html` (A–Z sections with a sticky letter, a sticky search + A–Z bar: search matches at word starts, term names first, then definitions; `/` focuses it, `?q=` prefills it; every entry has `id="<term-id>"` and an "Introduced in…" link) and `sources.html` (one numbered list per chapter, `id="<chapter-id>"` per chapter, `id="<chapter-id>-src-<n>"` per source, chapter TOC rail) are generated by the build, as is `_dev.html` (build status: pages, every figure id and whether its module exists). Never edit them by hand.

## 7. Draft → page cheat sheet

| Draft | Page |
|---|---|
| frontmatter `title`, `subtitle`, `part`, `reading_time`, `hero` | hero |
| first paragraph | `.lead` with drop cap |
| `## Heading` / `### Sub` | `h2`/`h3` with ids and anchor links; h2s feed the TOC |
| `{{id|text}}`, `{{id}}` | glossary term link |
| `[^3]`, `[^1][^4]`, `[^1, 4]` | citation superscripts |
| Markdown table | `.table-wrap > table` (scrolls horizontally inside its box on phones) |
| `:::figure id` | figure frame, auto-numbered "Figure N.M" |
| `:::key-idea`, `:::clinic`, `:::note Title`, `:::deep-dive Title`, `:::takeaways`, `:::quiz` | components above |
| `## Glossary` | removed from the page → `assets/data/glossary.json` |
| `## Sources` | numbered `.sources-list` with ids `src-N` → also `assets/data/sources.json` |

---

## 8. Visual guidance for figure authors

### Stages
* **Dark stage** (`stage: dark`): biology. Deep navy radial gradient, fine grain, vignette. Cells glow softly. Identical in both page themes. Labels in `--fg` (near white), secondary in `--fg-2`.
* **Light stage** (`stage: light`): charts, timelines, schematics, maps. Paper/surface background with ink lines; follows the page theme. Use `-deep` palette variants for strokes and text, base colors for fills, and `--chart-*` tokens for data series.
* One stage per figure. Don't put dark panels inside light stages or the reverse.

### Composition
* One idea per figure. One focal point per step. Use motion to direct the eye, not to decorate.
* Leave air: ~6–8% of the stage width as a margin around the main subject, and keep labels clear of the rounded corners.
* Depth: subject in full color and glow; context (neighboring cells, tissue) at 5–15% opacity, out of focus.
* No faces or eyes on cells. Recognizable by silhouette, texture, color, and always a label.

### Labels inside figures
| Class | Size (user units) | Rendered floor | Use |
|---|---|---|---|
| `t-title` | 18 | 15px | rare in-figure headings |
| `t-label` | 15, weight 560 | 13px | names of things |
| `t-small` | 13, `--fg-2` | 12px | secondary annotations, values |
| `t-caps` | 12 uppercase | 11px | axis titles, region names |

* Labels sit horizontally, never rotated. Connect them with thin leader lines (`.leader`, 1px non-scaling, `--line`) ending in a 2–3px dot (`.leader-dot`).
* Add `t-halo` when a label crosses a busy background.
* Keep in-figure text short (1–4 words). Explanations belong in the HTML caption.
* Numbers in charts: `t-num` (tabular).

### Color
* Use the entity palette consistently: a CD8 T cell is always `--c-cd8`, wherever it appears on the site.
* Inhibitory signals: `--c-inhibit` **plus** a minus/bar glyph. Activating: `--c-activate` **plus** a plus/arrow glyph. Never color alone.
* Highlights: brighten (white core, stronger glow) rather than introducing new hues.

### Phones
* Prefer **re-layout over shrinking**: switch to a portrait viewBox (~400 units wide, aspect 4:5 or 5:7) below 600px of stage width. Stack side-by-side scenes vertically and move legends below the stage.
* Rendered text ≥ 13px for labels (automatic with the `.t-*` classes when `ctx.createSVG` is used).
* Touch targets ≥ 40px. Never hide information behind hover only.

### Motion
* Durations 0.6–1.8s for meaningful moves, 0.3–0.5s for fades. Easing `so.inOut`, arrivals `so.out`.
* Idle motion is subtle (scale ≤ 1.5%, rotation ≤ 4°) and always via `ctx.ambient`.
* Nothing flashes or strobes, and loops never run off-screen.

---

## 9. Accessibility rules (whole site)

* Semantic HTML: one `h1`, ordered headings, lists for lists, `button` for actions, `a` for navigation.
* Visible focus everywhere (`:focus-visible` ring in accent; on dark stages `--stage-focus`).
* Text contrast ≥ 4.5:1 (tokens are tuned for it; check new combinations).
* Figures: description via alt text, keyboard-operable controls, announcements via `aria-live`.
* `prefers-reduced-motion` honored by CSS (durations → 0, smooth scrolling off) and JS (`ctx.reducedMotion`).
* Never rely on color alone. Never trap focus except in the modal menu (a native `<dialog>`).

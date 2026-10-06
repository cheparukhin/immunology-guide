// Generated reference pages: glossary.html, sources.html, _dev.html.
// Called by tools/build-content.mjs on every run; never edit the output by hand.
import fs from 'node:fs';
import path from 'node:path';
import { page, esc, indent, ICON } from './template.mjs';

const stripTags = (html) => String(html || '').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim();
const fold = (s) => stripTags(s).normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase();
const SEARCH_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/></svg>';

function referenceHero({ kicker, title, dek, meta }) {
  return `<header class="hero hero--page">
  <div class="hero__inner">
    <p class="hero__kicker"><span class="part">${esc(kicker)}</span></p>
    <h1 class="hero__title">${esc(title)}</h1>
    <p class="hero__dek">${dek}</p>
    <p class="hero__meta">${meta}</p>
  </div>
</header>`;
}

// ---------------------------------------------------------------- glossary.html
export function glossaryPage({ glossary }) {
  const entries = Object.entries(glossary).map(([id, e]) => {
    const key = fold(e.term).replace(/^[^a-z0-9]+/, '');
    const letter = /^[a-z]/.test(key) ? key[0].toUpperCase() : '#';
    return { id, ...e, key, letter };
  }).sort((a, b) => a.key.localeCompare(b.key, 'en'));
  const letters = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ', '#'];
  const byLetter = new Map(letters.map((l) => [l, []]));
  for (const e of entries) byLetter.get(e.letter).push(e);

  const az = letters
    .filter((l) => l !== '#' || byLetter.get('#').length)
    .map((l) => (byLetter.get(l).length
      ? `<a href="#letter-${l === '#' ? 'num' : l.toLowerCase()}" data-letter="${l}">${l}</a>`
      : `<span aria-hidden="true">${l}</span>`))
    .join('');

  const sections = letters.filter((l) => byLetter.get(l).length).map((l) => {
    const sid = `letter-${l === '#' ? 'num' : l.toLowerCase()}`;
    const items = byLetter.get(l).map((e) => {
      const intro = e.page
        ? `<a class="glossary-entry__intro" href="${esc(e.page)}#term-${e.id}">Introduced in ${esc(e.chapterLabel || e.chapterTitle)}${e.chapterLabel && e.chapterTitle ? ` · ${esc(e.chapterTitle)}` : ''}</a>`
        : '';
      const words = (t) => ` ${fold(t).replace(/[^a-z0-9]+/g, ' ').trim()} `;
      return `<div class="glossary-entry" id="${e.id}" data-name="${esc(words(`${e.term} ${e.id}`))}" data-search="${esc(words(e.def))}">
  <dt class="glossary-entry__term">${e.term}</dt>
  <dd class="glossary-entry__def">${e.def}</dd>${intro ? `
  <dd class="glossary-entry__meta">${intro}</dd>` : ''}
</div>`;
    }).join('\n');
    return `<section class="glossary-letter" aria-labelledby="${sid}">
  <h2 class="glossary-letter__title" id="${sid}">${l}</h2>
  <dl class="glossary-list">
${indent(items, 4)}
  </dl>
</section>`;
  }).join('\n');

  const n = entries.length;
  const main = `<article class="chapter page-reference">
${indent(referenceHero({
    kicker: 'Reference',
    title: 'Glossary',
    dek: 'Every technical term in the guide, in plain words, with a link to the chapter that introduces it.',
    meta: `<span>${n} terms</span>`,
  }), 2)}
  <div class="chapter-body prose glossary-page" data-toc="off">
    <div class="glossary-tools is-wide" data-glossary-tools>
      <label class="glossary-search">
        ${SEARCH_ICON}
        <span class="visually-hidden">Search the glossary</span>
        <input type="search" placeholder="Search ${n} terms" autocomplete="off" spellcheck="false" data-glossary-search>
        <kbd class="glossary-search__key" aria-hidden="true">/</kbd>
      </label>
      <nav class="az" aria-label="Jump to letter">${az}</nav>
      <p class="glossary-count" aria-live="polite" data-glossary-count></p>
    </div>
${indent(sections, 4)}
    <p class="glossary-empty is-wide" data-glossary-empty hidden>No terms match your search.</p>
  </div>
</article>`;
  return page({
    title: 'Glossary',
    description: `All ${n} terms used in Self & Other, an illustrated guide to immunology and cancer immunotherapy, defined in plain language.`,
    bodyClass: 'page-glossary no-tuck',
    pageId: 'glossary',
    file: 'glossary.html',
    main,
    context: { num: 'Reference', title: 'Glossary' },
  });
}

// ---------------------------------------------------------------- sources.html
export function sourcesPage({ sources, order }) {
  const ids = Object.keys(sources).sort((a, b) => {
    const ia = order.indexOf(a); const ib = order.indexOf(b);
    return (ia < 0 ? 999 : ia) - (ib < 0 ? 999 : ib) || a.localeCompare(b);
  });
  const total = ids.reduce((k, id) => k + sources[id].sources.length, 0);
  const sections = ids.map((id) => {
    const c = sources[id];
    const back = (x) => (x.cited ? ` <a class="src-up" href="${esc(c.file)}#ref-${x.n}" aria-label="First cited in ${esc(c.label || c.title)}">↩</a>` : '');
    const items = c.sources.map((x) => `  <li id="${id}-src-${x.n}"><span class="src-num">${x.n}</span>${x.html}${back(x)}</li>`).join('\n');
    const label = c.label || '';
    return `<h2 id="${id}" class="sources-chapter" data-toc-title="${esc(label ? `${label.replace('Chapter ', '')} · ${c.title}` : c.title)}"><span class="sources-chapter__label">${esc(label)}</span><a href="${esc(c.file)}">${esc(c.title)}</a></h2>
<p class="sources-chapter__count">${c.sources.length} source${c.sources.length === 1 ? '' : 's'}, numbered as cited in the chapter.</p>
<ol class="sources-list" role="list">
${items}
</ol>`;
  }).join('\n');
  const toc = `<details class="toc" id="toc">
  <summary class="toc__summary"><span>Chapters</span>${ICON.chevronDown}</summary>
  <p class="toc__title" aria-hidden="true">Chapters</p>
  <ol class="toc__list" role="list">
${ids.map((id) => `    <li><a href="#${id}">${esc((sources[id].label ? `${sources[id].label.replace('Chapter ', '')} · ` : '') + sources[id].title)}</a></li>`).join('\n')}
  </ol>
</details>`;
  const main = `<article class="chapter page-reference">
${indent(referenceHero({
    kicker: 'Reference',
    title: 'Sources',
    dek: 'The papers, reviews and public records behind every chapter. Every specific number in the guide should be traceable to one of them.',
    meta: `<span>${total} sources</span><span>${ids.length} chapters</span>`,
  }), 2)}
  <div class="chapter-body prose sources-page">
${indent(toc, 4)}
    <div class="glossary-tools sources-tools is-wide" data-sources-tools>
      <label class="glossary-search">
        ${SEARCH_ICON}
        <span class="visually-hidden">Filter the sources</span>
        <input type="search" placeholder="Filter ${total} sources: author, journal, year, topic" autocomplete="off" spellcheck="false" data-sources-filter>
        <kbd class="glossary-search__key" aria-hidden="true">/</kbd>
      </label>
      <p class="glossary-count" aria-live="polite" data-sources-count></p>
    </div>
${indent(sections, 4)}
    <p class="glossary-empty is-wide" data-sources-empty hidden>No sources match your filter.</p>
  </div>
</article>`;
  return page({
    title: 'Sources',
    description: `The ${total} sources behind Self & Other, chapter by chapter.`,
    bodyClass: 'page-sources',
    pageId: 'sources',
    file: 'sources.html',
    main,
    context: { num: 'Reference', title: 'Sources' },
  });
}

// ---------------------------------------------------------------- _dev.html
export function devPage({ chapters, draftsMeta, figureIndex, glossaryCount, conflicts, unresolved, root }) {
  const exists = (f) => fs.existsSync(path.join(root, f));
  const ok = (b) => (b ? '<span class="dev-ok">✓</span>' : '<span class="dev-no">✗</span>');
  const drafts = new Map(draftsMeta.map((d) => [d.id, d]));
  const allPages = [...chapters.pages, ...(chapters.extras || [])];
  const pageRows = allPages.map((p) => {
    const figs = figureIndex.filter((f) => f.pageId === p.id);
    const built = figs.filter((f) => exists(`assets/js/figures/${f.id}.js`)).length;
    return `<tr>
  <td>${p.number ?? ''}</td>
  <td>${exists(p.file) ? `<a href="${esc(p.file)}">${esc(p.title)}</a>` : esc(p.title)}</td>
  <td><code>${esc(p.file)}</code></td>
  <td>${ok(exists(p.file))}</td>
  <td>${drafts.has(p.id) ? `<code>${esc(drafts.get(p.id).name)}</code>` : '–'}</td>
  <td class="num">${figs.length ? `${built} / ${figs.length}` : '–'}</td>
</tr>`;
  }).join('\n');
  const devPages = fs.readdirSync(root).filter((f) => f.startsWith('_') && f.endsWith('.html') && f !== '_dev.html').sort()
    .map((f) => `<a href="${esc(f)}"><code>${esc(f)}</code></a>`).join(' · ');
  const figRows = figureIndex.map((f) => {
    const mod = `assets/js/figures/${f.id}.js`;
    return `<tr data-module="${esc(mod)}">
  <td><code>${esc(f.id)}</code></td>
  <td>${f.number ? `<a href="${esc(f.page)}#${esc(f.domId)}">${esc(f.number)}</a>` : (f.hero ? 'hero' : '–')}</td>
  <td>${esc(f.title || '')}</td>
  <td>${esc(f.kind || '')}</td>
  <td>${esc(f.stage || '')}</td>
  <td class="num">${f.steps || ''}</td>
  <td class="dev-status">${ok(exists(mod))}</td>
</tr>`;
  }).join('\n');
  const nFig = figureIndex.length;
  const nBuilt = figureIndex.filter((f) => exists(`assets/js/figures/${f.id}.js`)).length;
  const main = `<div class="page-grid prose dev-page" data-toc="off">
  <h1>Build status</h1>
  <p>Developer page, generated by <code>node tools/build-content.mjs</code>. Statuses were correct at build time; module statuses re-check live below. Not linked from the site.</p>
  <p><strong>${nBuilt} / ${nFig}</strong> figure modules exist · <strong>${glossaryCount}</strong> glossary terms · <strong>${conflicts}</strong> glossary ids with conflicting definitions (${unresolved} unresolved, see <code>docs/reviews/glossary-conflicts.md</code> after <code>--glossary-report</code>).</p>
  <p>Dev pages: ${devPages || '–'}</p>
  <h2 id="pages">Pages</h2>
  <div class="table-wrap is-wide">
    <table>
      <thead><tr><th>#</th><th>Title</th><th>File</th><th>Built</th><th>Draft</th><th class="num">Figures built</th></tr></thead>
      <tbody>
${indent(pageRows, 8)}
      </tbody>
    </table>
  </div>
  <h2 id="figures">Figures</h2>
  <div class="table-wrap is-wide">
    <table>
      <thead><tr><th>Figure id</th><th>No.</th><th>Title</th><th>Kind</th><th>Stage</th><th class="num">Steps</th><th>Module</th></tr></thead>
      <tbody>
${indent(figRows, 8)}
      </tbody>
    </table>
  </div>
  <h2 id="commands">Commands</h2>
  <pre><code>node tools/build-content.mjs                      # all pages + glossary/sources/_dev
node tools/build-content.mjs --only 04 --glossary-report
node tools/shot.mjs --page 04-presentation.html --figure ch04-mhc1-pathway --viewport desktop,mobile --theme light,dark
node tools/stepper-check.mjs --page 04-presentation.html --figure ch04-mhc1-pathway
node tools/check.mjs --quiet</code></pre>
</div>
<script type="module">
  // Re-check module files live, so the table stays useful while figures are being built.
  // (Skipped in automated browsers so QA runs don't log 404s for unbuilt modules.)
  if (!navigator.webdriver) for (const row of document.querySelectorAll('tr[data-module]')) {
    fetch(row.dataset.module, { method: 'HEAD', cache: 'no-store' })
      .then((r) => { row.querySelector('.dev-status').innerHTML = r.ok ? '<span class="dev-ok">✓</span>' : '<span class="dev-no">✗</span>'; })
      .catch(() => {});
  }
</script>`;
  return page({
    title: 'Build status',
    description: 'Developer status page.',
    bodyClass: 'page-dev',
    pageId: '_dev',
    main,
    noindex: true,
  });
}

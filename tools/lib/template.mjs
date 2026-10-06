// Page shell shared by every generated page (and reusable for future
// generated pages such as glossary.html / sources.html).
// Paths are relative so the site works from any subpath.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Indent every non-empty line of `html` by `n` spaces (keeps <pre> contents intact). */
export function indent(html, n) {
  const pad = ' '.repeat(n);
  let inPre = false;
  return html.split('\n').map((line) => {
    const out = inPre || !line.trim() ? line : pad + line;
    const opens = (line.match(/<pre[\s>]/g) || []).length;
    const closes = (line.match(/<\/pre>/g) || []).length;
    if (opens > closes) inPre = true;
    else if (closes > opens) inPre = false;
    return out;
  }).join('\n');
}

const BLOCK = 'ul|ol|li|blockquote|div|section|aside|details|figure|header|footer|nav|table|thead|tbody|tfoot|tr|figcaption|dl|main|article|summary';
const OPEN_RE = new RegExp(`<(${BLOCK})(\\s[^>]*)?>`, 'g');
const CLOSE_RE = new RegExp(`</(${BLOCK})>`, 'g');
const LEADING_CLOSE_RE = new RegExp(`^(\\s*</(${BLOCK})>)+`);

/** Re-indent block-level HTML (e.g. marked output) by nesting depth. */
export function prettyBlocks(html) {
  const out = [];
  let depth = 0;
  let inPre = false;
  let script = null; // { base, cut } while inside a multi-line <script>
  for (const raw of html.split('\n')) {
    const line = raw.trim();
    if (inPre) {
      out.push(raw);
      if (/<\/pre>/.test(raw)) inPre = false;
      continue;
    }
    if (script) {
      // keep the script's own relative indentation (JSON blocks)
      const lead = raw.match(/^\s*/)[0].length;
      out.push(raw.trim() ? '  '.repeat(script.base) + raw.slice(Math.min(lead, script.cut)) : '');
      if (/<\/script>/.test(raw)) script = null;
      continue;
    }
    if (/^<script[\s>]/.test(line) && !/<\/script>/.test(line)) {
      out.push('  '.repeat(depth) + line);
      script = { base: depth, cut: raw.match(/^\s*/)[0].length };
      continue;
    }
    if (!line) { out.push(''); continue; }
    const lead = line.match(LEADING_CLOSE_RE);
    const leadCloses = lead ? (lead[0].match(CLOSE_RE) || []).length : 0;
    depth = Math.max(0, depth - leadCloses);
    out.push('  '.repeat(depth) + line);
    if (/<pre[\s>]/.test(line) && !/<\/pre>/.test(line)) { inPre = true; continue; }
    const opens = (line.match(OPEN_RE) || []).length;
    const closes = (line.match(CLOSE_RE) || []).length - leadCloses;
    depth = Math.max(0, depth + opens - closes);
  }
  // collapse runs of blank lines
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

const ICON = {
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>',
  figure: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="3.5" y="5" width="17" height="14" rx="2.5"/><circle cx="9" cy="11" r="2.2"/><path d="M20.5 15.5l-5-4.5-7.5 8"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M4 7h16M4 12h16M4 17h10"/></svg>',
  auto: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="8.5"/><path d="M12 3.5v17a8.5 8.5 0 0 0 0-17z" fill="currentColor" stroke="none"/></svg>',
  arrowLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
  arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  chevronDown: '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M6 9l6 6 6-6"/></svg>',
};
export { ICON };

// ------------------------------------------------------------------ site config & <head> meta
// assets/data/chapters.json → site: { title, tagline, url, shareImage, shareImageAlt }.
// `url` (absolute, e.g. "https://example.org/self-and-other/") is optional: when set,
// og:image / og:url / canonical become absolute (social sites need absolute image URLs).
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
let siteCache = null;
export function siteConfig() {
  if (!siteCache) {
    let site = {};
    try { site = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/data/chapters.json'), 'utf8')).site || {}; } catch { /* defaults */ }
    siteCache = {
      title: site.title || 'Self & Other',
      url: site.url ? String(site.url).replace(/\/?$/, '/') : '',
      shareImage: site.shareImage || 'assets/img/share-card.jpg',
      shareImageAlt: site.shareImageAlt || 'Self & Other: glowing immune cells under the microscope. An illustrated guide to the immune system and cancer immunotherapy.',
    };
  }
  return siteCache;
}

// Theme before first paint. The `js` class (which hides figure fallback text and quiz
// explanations until scripts run) is only added where ES modules can load: never on
// file:// (browsers block module scripts there). site.js adds it again when it boots.
const THEME_BOOT = "(function(){var d=document.documentElement;if(location.protocol!=='file:')d.classList.add('js');try{var t=localStorage.getItem('so-theme');if(t==='light'||t==='dark')d.setAttribute('data-theme',t);}catch(e){}})();";
// If the module graph fails to load (404, blocked), fall back to the no-JS presentation.
export const SITE_SCRIPT = `<script type="module" src="assets/js/site.js" onerror="document.documentElement.classList.remove('js')"></script>`;

/**
 * Head lines shared by every page (generated and hand-written): theme colors, icons,
 * social cards, robots, theme boot script. Hand-written pages (index.html, about.html)
 * carry the same block between <!-- head:start --> and <!-- head:end --> markers;
 * tools/build-content.mjs keeps it in sync.
 */
export function headMeta({ title, ogTitle, description = '', file = '', type = 'article', noindex = false } = {}) {
  const site = siteConfig();
  const fullTitle = ogTitle || (title && title !== site.title ? `${title} · ${site.title}` : site.title);
  const pageUrl = site.url && file ? site.url + (file === 'index.html' ? '' : file) : '';
  const image = site.url + site.shareImage;
  const lines = [
    '<meta name="theme-color" content="#FAF7F2" media="(prefers-color-scheme: light)">',
    '<meta name="theme-color" content="#0E121B" media="(prefers-color-scheme: dark)">',
    '<link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">',
    '<link rel="icon" href="assets/img/favicon-32.png" type="image/png" sizes="32x32">',
    '<link rel="apple-touch-icon" href="assets/img/apple-touch-icon.png">',
  ];
  if (noindex) lines.push('<meta name="robots" content="noindex">');
  else if (pageUrl) lines.push(`<link rel="canonical" href="${esc(pageUrl)}">`);
  if (!noindex) {
    lines.push(
      `<meta property="og:type" content="${type}">`,
      `<meta property="og:site_name" content="${esc(site.title)}">`,
      `<meta property="og:title" content="${esc(fullTitle)}">`,
      `<meta property="og:description" content="${esc(description)}">`,
      ...(pageUrl ? [`<meta property="og:url" content="${esc(pageUrl)}">`] : []),
      `<meta property="og:image" content="${esc(image)}">`,
      '<meta property="og:image:width" content="1200">',
      '<meta property="og:image:height" content="630">',
      `<meta property="og:image:alt" content="${esc(site.shareImageAlt)}">`,
      '<meta name="twitter:card" content="summary_large_image">',
    );
  }
  lines.push(`<script>${THEME_BOOT}</script>`);
  return lines.join('\n');
}

export function header({ contextNum = '', contextTitle = '' } = {}) {
  return `<header class="site-header">
  <a class="brand" href="index.html" aria-label="Self &amp; Other, home">
    <svg class="brand__mark" viewBox="0 0 26 18" aria-hidden="true" focusable="false"><circle class="self" cx="9" cy="9" r="7"/><circle class="other" cx="17" cy="9" r="6.2"/></svg>
    <span>Self <span class="brand__amp">&amp;</span> Other</span>
  </a>
  <div class="site-header__context" aria-hidden="true">${contextTitle ? `
    <span class="sep"></span>
    <span class="num">${esc(contextNum)}</span>
    <span class="title">${esc(contextTitle)}</span>
  ` : ''}</div>
  <div class="site-header__actions">
    <button class="icon-btn" type="button" data-theme-toggle aria-haspopup="menu" aria-expanded="false" aria-label="Color theme">${ICON.auto}</button>
    <button class="icon-btn" type="button" data-menu-toggle aria-haspopup="dialog" aria-expanded="false">${ICON.menu}<span class="icon-btn__label">Chapters</span></button>
  </div>
</header>`;
}

export function footer() {
  return `<footer class="site-footer">
  <div class="site-footer__inner">
    <div>
      <a class="brand" href="index.html"><span>Self <span class="brand__amp">&amp;</span> Other</span></a>
      <p>An illustrated guide to the immune system and the new science of cancer immunotherapy. For understanding, not medical advice: talk to your care team about any treatment decision.</p>
    </div>
    <nav aria-label="Site">
      <a href="index.html">Home</a>
      <a href="glossary.html">Glossary</a>
      <a href="sources.html">Sources</a>
      <a href="about.html">About</a>
    </nav>
  </div>
</footer>`;
}

/**
 * Full HTML document.
 * @param o.title       page title (without site name)
 * @param o.description meta description
 * @param o.bodyClass   class on <body>
 * @param o.pageId      data-page attribute on <body>
 * @param o.main        inner HTML of <main>
 * @param o.extraCss    array of stylesheet hrefs (relative)
 * @param o.preload     array of font files to preload
 * @param o.context     { num, title } for the header's chapter context
 * @param o.headExtra   extra <head> HTML
 * @param o.file        output file name (canonical / og:url when site.url is set)
 * @param o.ogType      og:type (default 'article'; 'website' for the home page)
 * @param o.noindex     dev pages: robots noindex, no social cards
 */
export function page(o) {
  const css = ['fonts', 'tokens', 'base', 'layout', 'components', 'figures'].map((n) => `assets/css/${n}.css`).concat(o.extraCss || []);
  const preload = o.preload ?? ['source-serif-4-latin-normal.woff2', 'fraunces-latin-normal.woff2'];
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(o.title)}${o.title ? ' · ' : ''}Self &amp; Other</title>
  <meta name="description" content="${esc(o.description || '')}">
  <meta name="color-scheme" content="light dark">
${indent(headMeta({ title: o.title, description: o.description, file: o.file, type: o.ogType || 'article', noindex: o.noindex }), 2)}
${preload.map((f) => `  <link rel="preload" href="assets/fonts/${f}" as="font" type="font/woff2" crossorigin>`).join('\n')}
${css.map((href) => `  <link rel="stylesheet" href="${href}">`).join('\n')}
  ${SITE_SCRIPT}${o.headExtra ? '\n' + indent(o.headExtra, 2) : ''}
</head>
<body class="${esc(o.bodyClass || '')}"${o.pageId ? ` data-page="${esc(o.pageId)}"` : ''}>
  <a class="skip-link" href="#main">Skip to content</a>
  <div class="progress" aria-hidden="true"><div class="progress__bar"></div></div>
${indent(header({ contextNum: o.context?.num, contextTitle: o.context?.title }), 2)}
  <main id="main">
${indent(o.main, 4)}
  </main>
${indent(footer(), 2)}
</body>
</html>
`;
}

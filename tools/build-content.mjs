#!/usr/bin/env node
// Build chapter pages from Markdown drafts.
//
//   node tools/build-content.mjs              # every draft in content/drafts/
//   node tools/build-content.mjs --only 04    # one chapter (prefix or id; repeatable / comma list)
//   node tools/build-content.mjs --only _sample
//   node tools/build-content.mjs --check      # parse + report, write nothing
//   node tools/build-content.mjs --only 04 --preview   # write _preview-04-presentation.html (review a draft
//                                                        without touching the real page; delete when done)
//   node tools/build-content.mjs --glossary-report     # also write docs/reviews/glossary-conflicts.md
//
// Also generated on every run (from all drafts): glossary.html, sources.html and
// _dev.html (a status page listing every page and figure).
// content/glossary.md (optional, same "- id | Term | Definition" lines) holds the
// canonical glossary: its entries win over draft definitions; drafts fill the gaps.
//
// Inputs:  content/drafts/NN-slug.md   (format: docs/PLAN.md §6)
//          assets/data/chapters.json   (site map: file names, numbers, parts, prev/next)
// Outputs: <file>.html at the repo root (file name from chapters.json)
//          assets/data/glossary.json  (merged from every draft's "## Glossary"; earliest chapter wins)
//          assets/data/sources.json   (per-chapter source lists)
// Drafts whose name starts with "_" are dev samples: they get a page, but stay
// out of glossary.json / sources.json (their terms are embedded in the page).
//
// Writes are atomic (temp file + rename) and skipped when unchanged, so it is
// safe for several agents to run this concurrently and repeatedly.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Marked } from 'marked';
import { page, esc, indent, prettyBlocks, ICON, headMeta, siteConfig, SITE_SCRIPT } from './lib/template.mjs';
import { glossaryPage, sourcesPage, devPage } from './lib/site-pages.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DRAFTS = path.join(ROOT, 'content/drafts');
const DATA = path.join(ROOT, 'assets/data');

// ------------------------------------------------------------------ CLI
const args = process.argv.slice(2);
const only = [];
let checkOnly = false;
let preview = false;   // write _preview-<file>.html instead of the real page (for reviewing drafts)
let glossaryReport = false;   // write docs/reviews/glossary-conflicts.md
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--only') only.push(...String(args[++i] || '').split(',').filter(Boolean));
  else if (args[i].startsWith('--only=')) only.push(...args[i].slice(7).split(',').filter(Boolean));
  else if (args[i] === '--check') checkOnly = true;
  else if (args[i] === '--preview') preview = true;
  else if (args[i] === '--glossary-report') glossaryReport = true;
  else if (args[i] === '-h' || args[i] === '--help') {
    console.log('Usage: node tools/build-content.mjs [--only 04[,05]] [--check] [--preview] [--glossary-report]');
    process.exit(0);
  }
}

const warnings = [];
const warn = (where, msg) => { warnings.push(`${where}: ${msg}`); };
// {{id|text}} / {{id}} / [^n] inside glossary entries are flattened to plain text.
const flatMarkup = (s) => s.replace(/\{\{\s*[^|}]+\|([^}]*)\}\}/g, '$1').replace(/\{\{\s*([^}]+)\}\}/g, '$1').replace(/\s*\[\^[\d,\s]+\]/g, '');
const inlineMd = new Marked({ gfm: true });

// Typographic quotes/apostrophes/ellipses in text nodes (never inside tags, code or scripts).
const SMART_RESET = new Set(['p', 'li', 'br', 'div', 'td', 'th', 'h1', 'h2', 'h3', 'h4', 'blockquote', 'figcaption', 'summary', 'span']);
function smarten(html) {
  let skip = 0;
  let prev = ' ';
  return html.split(/(<[^>]*>)/).map((part) => {
    if (part.startsWith('<')) {
      const m = part.match(/^<\/?([a-z0-9]+)/i);
      const tag = m ? m[1].toLowerCase() : '';
      if (['code', 'pre', 'script', 'style', 'kbd', 'samp'].includes(tag)) skip += part.startsWith('</') ? -1 : 1;
      if (SMART_RESET.has(tag) && !part.startsWith('</')) prev = ' ';
      return part;
    }
    if (skip > 0 || !part) return part;
    const t = part.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\.\.\./g, '\u2026');
    let out = '';
    for (let i = 0; i < t.length; i++) {
      const c = t[i];
      const before = i ? t[i - 1] : prev;
      const opening = /[\s(\[{\u2014\u2013\u2018\u201C/-]/.test(before);
      if (c === '"') out += opening ? '\u201C' : '\u201D';
      else if (c === "'") out += opening && /[A-Za-z]/.test(t[i + 1] || '') && !/^'(?:tis|twas|em|n)\b/i.test(t.slice(i)) ? '\u2018' : '\u2019';
      else out += c;
    }
    prev = t[t.length - 1];
    return out;
  }).join('');
}

// ------------------------------------------------------------------ IO
function writeAtomic(file, content) {
  if (checkOnly) return false;
  try { if (fs.readFileSync(file, 'utf8') === content) return false; } catch { /* new file */ }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = `${file}.tmp-${process.pid}-${Math.random().toString(36).slice(2, 8)}`;
  fs.writeFileSync(tmp, content);
  fs.renameSync(tmp, file);
  return true;
}

const chapters = JSON.parse(fs.readFileSync(path.join(DATA, 'chapters.json'), 'utf8'));
const pageById = new Map(chapters.pages.map((p, i) => [p.id, { ...p, order: i }]));
const partById = new Map(chapters.parts.map((p) => [p.id, p]));
const extraById = new Map((chapters.extras || []).map((p) => [p.id, p]));

// Comparison tables written with an empty top-left cell: that cell becomes a <td> (an empty
// <th> names nothing) and each body row's first cell becomes its row header.
function rowHeaders(table) {
  const corner = /(<thead>\s*<tr>\s*)<th(\s[^>]*)?>\s*<\/th>/;
  if (!corner.test(table)) return table;
  return table
    .replace(corner, '$1<td></td>')
    .replace(/(<tbody>[\s\S]*<\/tbody>)/, (body) => body.replace(/(<tr>\s*)<td(\s[^>]*)?>([\s\S]*?)<\/td>/g, '$1<th scope="row"$2>$3</th>'));
}

// ------------------------------------------------------------------ text utils
const slugify = (s) => s.toLowerCase()
  .replace(/<[^>]+>/g, '')
  .replace(/&[a-z]+;/g, '')
  .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  .slice(0, 60) || 'section';
const stripTags = (html) => html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim();
const dedent = (lines) => {
  const ind = Math.min(...lines.filter((l) => l.trim()).map((l) => l.match(/^\s*/)[0].length));
  return lines.map((l) => l.slice(Number.isFinite(ind) ? ind : 0));
};

function parseFrontmatter(src, where) {
  const m = src.match(/^\uFEFF?---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) { warn(where, 'no frontmatter'); return { fm: {}, body: src }; }
  const fm = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z_][\w-]*)\s*:\s*(.*)$/);
    if (!kv) continue;
    let v = kv[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    fm[kv[1].toLowerCase()] = v;
  }
  return { fm, body: src.slice(m[0].length) };
}

// ------------------------------------------------------------------ per-page build state
function createBuild(info) {
  const st = {
    info,                     // { id, file, number, label, ... }
    headingIds: new Set(),
    figureCount: 0,
    figures: [],              // { id, number }
    termsUsed: new Set(),
    citesUsed: new Set(),
    citeCounter: new Map(),
    quizCount: 0,
    glossaryLocal: {},
  };

  // Inline transforms applied to Markdown before marked sees it.
  st.inlinePre = (md) => md
    // {{id|text}} and {{id}} → glossary term links
    .replace(/\{\{\s*([a-z0-9][a-z0-9_-]*)\s*(?:\|([^}]*))?\}\}/gi, (_, id, text, offset, whole) => {
      const key = id.toLowerCase();
      st.termsUsed.add(key);
      const sentenceStart = /(^|[.!?:]["'\u201D\u2019]?\s+|\n\s*|^\s*[-*]\s+)$/.test(whole.slice(Math.max(0, offset - 6), offset)) || offset === 0;
      const shown = text != null && text.trim() ? text.trim() : `@@TERM:${key}:${sentenceStart ? 'cap' : 'lc'}@@`;
      return `<a class="term" data-term="${key}" href="glossary.html#${key}">${shown}</a>`;
    })
    // [^1], [^1][^2], [^1, 3] → one superscript group
    // (preceding spaces are dropped and a word joiner glues the marker to its word,
    //  so a superscript can never wrap onto a line of its own). House style: the marker
    //  follows a period, comma, semicolon or colon ("inside you.¹"), whichever way the
    //  draft wrote it ("inside you¹." is moved).
    .replace(/[ \t]*((?:\[\^\s*\d+(?:\s*,\s*\d+)*\s*\])+)([.,;:](?![.\d]))?/g, (_, group, punct = '') => {
      const nums = [...group.matchAll(/\d+/g)].map((x) => Number(x[0]));
      const links = nums.map((n) => {
        st.citesUsed.add(n);
        const k = (st.citeCounter.get(n) || 0) + 1;
        st.citeCounter.set(n, k);
        return `<a href="#src-${n}" id="ref-${n}${k > 1 ? `-${k}` : ''}" aria-label="Source ${n}">${n}</a>`;
      });
      return `${punct}\u2060<sup class="cite">${links.join('<span class="sep">,</span>')}</sup>`;
    });

  const marked = new Marked({
    gfm: true,
    renderer: {
      heading({ tokens, depth }) {
        const inner = this.parser.parseInline(tokens);
        if (depth === 1) { warn(info.id, `"# ${stripTags(inner)}": use ## for sections (the title comes from frontmatter)`); depth = 2; }
        let id = slugify(stripTags(inner));
        let k = 2;
        while (st.headingIds.has(id)) id = `${slugify(stripTags(inner))}-${k++}`;
        st.headingIds.add(id);
        const anchor = depth <= 3 ? `<a class="heading-anchor" href="#${id}" aria-label="Link to this section">#</a>` : '';
        return `<h${depth} id="${id}">${inner}${anchor}</h${depth}>\n`;
      },
      image({ href, title, text }) {
        if (!text) warn(info.id, `image ${href} has no alt text`);
        return `<img src="${esc(href)}" alt="${esc(text || '')}"${title ? ` title="${esc(title)}"` : ''} loading="lazy" decoding="async">`;
      },
    },
  });
  st.md = (src) => {
    let html = smarten(marked.parse(st.inlinePre(src)));
    html = html.replace(/<table>[\s\S]*?<\/table>/g, rowHeaders);
    html = html.replace(/<table>/g, '<div class="table-wrap">\n<table>').replace(/<\/table>/g, '</table>\n</div>');
    return html;
  };
  st.inline = (src) => smarten(marked.parseInline(st.inlinePre(src.trim())));
  return st;
}

// ------------------------------------------------------------------ sections: Glossary & Sources
function extractSection(body, name) {
  const re = new RegExp(`^##\\s+${name}\\s*$`, 'im');
  const m = body.match(re);
  if (!m) return { body, section: null };
  const start = m.index;
  const after = body.slice(start + m[0].length);
  const next = after.search(/^##\s+/m);
  const section = next === -1 ? after : after.slice(0, next);
  const rest = body.slice(0, start) + (next === -1 ? '' : after.slice(next));
  return { body: rest, section };
}

function parseGlossary(text, where) {
  const out = [];
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line.startsWith('-') && !line.startsWith('*')) {
      if (line && out.length) out[out.length - 1].def += ' ' + line;   // wrapped definition
      continue;
    }
    const parts = line.replace(/^[-*]\s*/, '').split('|').map((s) => s.trim());
    if (parts.length < 3) { warn(where, `glossary line not "id | Term | Definition": ${line}`); continue; }
    const [id, term, ...def] = parts;
    if (!/^[a-z0-9][a-z0-9_-]*$/i.test(id)) { warn(where, `bad glossary id "${id}"`); continue; }
    out.push({ id: id.toLowerCase(), term, def: def.join(' | ') });
  }
  return out;
}

function parseSources(text) {
  const items = [];
  for (const raw of text.split(/\r?\n/)) {
    const m = raw.match(/^\s*(\d+)[.)]\s+(.*)$/);
    if (m) items.push({ n: Number(m[1]), md: m[2].trim() });
    else if (raw.trim() && items.length) items[items.length - 1].md += ' ' + raw.trim();
  }
  return items;
}

function linkifySource(html) {
  // doi:10.xxxx/… and bare DOIs/PMIDs/URLs that are not already links
  return html
    .replace(/(^|[\s(>])(?:doi:\s*|https?:\/\/(?:dx\.)?doi\.org\/)?(10\.\d{4,9}\/[^\s<>"]+?)(?=[.,;)]?(?:\s|<|$))/gi, (all, pre, doi) => {
      if (/href="[^"]*$/.test(pre)) return all;
      return `${pre}<a href="https://doi.org/${doi}">doi:${doi}</a>`;
    })
    .replace(/(^|[\s(>])PMID:?\s*(\d{5,9})/g, (_, pre, id) => `${pre}<a href="https://pubmed.ncbi.nlm.nih.gov/${id}/">PMID ${id}</a>`)
    .replace(/(^|[\s(])(https?:\/\/[^\s<]+[^\s<.,;)])/g, (_, pre, url) => `${pre}<a href="${url}">${url.replace(/^https?:\/\/(www\.)?/, '')}</a>`);
}

// ------------------------------------------------------------------ directives
/** Split a body into a tree of markdown chunks and :::directives. */
function parseBlocks(src, where) {
  const lines = src.split(/\r?\n/);
  const root = { children: [] };
  const stack = [root];
  let buf = [];
  let fence = null;
  const flush = () => {
    if (buf.length) {
      const top = stack[stack.length - 1];
      if (top.raw !== undefined) top.raw.push(...buf);
      else top.children.push({ type: 'md', text: buf.join('\n') });
      buf = [];
    }
  };
  for (const line of lines) {
    const f = line.match(/^\s*(```|~~~)/);
    if (f) { fence = fence === f[1] ? null : (fence || f[1]); buf.push(line); continue; }
    if (fence) { buf.push(line); continue; }
    const open = line.match(/^:::\s*([a-z][a-z-]*)\s*(.*)$/i);
    const close = /^:::\s*$/.test(line);
    const top = stack[stack.length - 1];
    if (open && top.raw === undefined) {
      flush();
      const name = open[1].toLowerCase();
      const node = { type: 'directive', name, args: open[2].trim(), children: [] };
      if (name === 'figure' || name === 'quiz') node.raw = [];
      top.children.push(node);
      stack.push(node);
    } else if (close && stack.length > 1) {
      flush();
      stack.pop();
    } else {
      buf.push(line);
    }
  }
  flush();
  if (stack.length > 1) warn(where, `unclosed :::${stack[stack.length - 1].name}`);
  return root.children;
}

/** YAML-ish figure fields: `key: value`, `key: |` blocks, indented continuations. */
function parseFields(lines) {
  const fields = {};
  let key = null;
  let block = [];
  const end = () => {
    if (!key) return;
    const isBlock = fields[key] === '|' || fields[key] === '>' || fields[key] === '';
    if (isBlock) fields[key] = dedent(block).join('\n').replace(/\s+$/, '');
    else if (block.length) fields[key] = [fields[key], ...block.map((l) => l.trim())].join(key === 'steps' ? '\n' : ' ').trim();
    block = [];
  };
  for (const line of lines) {
    const m = line.match(/^([a-z_]+)\s*:\s?(.*)$/i);
    if (m && !/^\s/.test(line)) {
      end();
      key = m[1].toLowerCase();
      fields[key] = m[2].trim();
    } else if (key) {
      block.push(line);
    }
  }
  end();
  return fields;
}

function parseSteps(text) {
  const steps = [];
  for (const raw of (text || '').split(/\r?\n/)) {
    const m = raw.match(/^\s*(?:\d+[.)]|[-*])\s+(.*)$/);
    if (m) steps.push(m[1].trim());
    else if (raw.trim() && steps.length) steps[steps.length - 1] += ' ' + raw.trim();
  }
  return steps.map((s) => {
    const t = s.match(/^\*\*(.+?)\*\*\s*(?:[—–:.-]\s*)?(.*)$/);
    return t ? { title: t[1].replace(/[.:]$/, '').trim(), md: t[2] } : { title: '', md: s };
  });
}

/**
 * Static facts about a figure module, used to reserve its space before it mounts
 * (no layout shift): its first literal ctx.setAspect(a, b) call and whether it uses
 * the stepper (controls row + step captions). null when the module doesn't exist yet.
 */
const moduleCache = new Map();
function moduleInfo(id) {
  if (moduleCache.has(id)) return moduleCache.get(id);
  const file = path.join(ROOT, 'assets/js/figures', `${id}.js`);
  let info = null;
  if (fs.existsSync(file)) {
    const src = fs.readFileSync(file, 'utf8');
    info = { stepper: /\bui\.stepper\s*\(/.test(src), aspect: null, auto: false, calls: false };
    const num = (x) => (/^[\d\s.()+*/-]+$/.test(x) ? Function(`"use strict";return (${x})`)() : NaN);
    for (const m of src.matchAll(/ctx\.setAspect\(([^()]*(?:\([^()]*\)[^()]*)*)\)/g)) {
      info.calls = true;
      const args = m[1].split(',').map((a) => a.trim()).filter(Boolean);
      if (/^['"]auto['"]$/.test(args[0] || '')) { info.auto = true; break; }
      const vals = args.map(num);
      if (vals.length && vals.every((v) => Number.isFinite(v) && v > 0)) { info.aspect = [vals[0], vals[1] ?? vals[0]]; break; }
    }
    if (!info.calls) info.aspect = [16 / 9, 16 / 9];   // runtime default when a module never sets one
  }
  moduleCache.set(id, info);
  return info;
}
const ratio = (v) => String(Math.round(v * 10000) / 10000);
// Measured mounted sizes (tools/measure-figures.mjs): exact aspect + extra height below
// the stage, at desktop and phone widths. Optional; static reservations apply without it.
let figureSizes = {};
try { figureSizes = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/data/figure-sizes.json'), 'utf8')); } catch { /* not measured yet */ }

function renderFigure(st, node, { hero = false } = {}) {
  const [id, ...flags] = node.args.split(/\s+/);
  const f = parseFields(node.raw);
  if (!id) { warn(st.info.id, ':::figure without an id'); return ''; }
  if (!/^[a-z0-9][a-z0-9-]*$/.test(id)) warn(st.info.id, `figure id "${id}" should be lowercase-kebab`);
  const stage = (f.stage || 'dark').split(/[\s|]/)[0].toLowerCase();
  if (!['dark', 'light'].includes(stage)) warn(st.info.id, `figure ${id}: stage "${f.stage}" (use dark | light)`);
  const width = (flags.find((x) => ['text', 'wide', 'full'].includes(x)) || f.width || 'wide').toLowerCase();
  const kind = (f.kind || '').split(/[\s|]/)[0].toLowerCase();
  if (!f.alt && !hero) warn(st.info.id, `figure ${id} has no alt text`);
  if (!f.title && !hero) warn(st.info.id, `figure ${id} has no title`);

  let number = '';
  let domId = `fig-${id}`;
  if (!hero) {
    st.figureCount += 1;
    number = st.info.number != null && st.info.number !== '' ? `${st.info.number}.${st.figureCount}` : String(st.figureCount);
    domId = `fig-${number.replace(/\./g, '-')}`;
  }
  if (st.figures.some((x) => x.id === id)) warn(st.info.id, `figure id "${id}" is used twice on this page`);
  const steps = parseSteps(f.steps).map((s) => {
    const html = st.inline(s.md);
    return { title: s.title, html, text: stripTags(html) };
  });
  st.figures.push({ id, number, domId, hero, title: stripTags(st.inline(f.title || '')), kind, stage, steps: steps.length });
  if (kind === 'stepper' && !steps.length) warn(st.info.id, `figure ${id} is a stepper but has no steps:`);
  const data = { id, number, title: f.title || '', kind, stage };
  if (steps.length) data.steps = steps;
  // JSON inside <script>: escape "<" so "</script>" can never terminate it.
  const json = JSON.stringify(data, null, 2).replace(/</g, '\\u003c');
  const altHtml = f.alt ? st.inline(f.alt) : '';
  const captionHtml = f.caption ? st.inline(f.caption) : '';
  // Reserved stage shape before mount: the module's literal setAspect() wins (it is what
  // will happen), then the draft's `aspect:` field, then defaults (dark 16:9 / 4:5 on
  // phones, light 16:9). Modules set the real value on mount, so a match means no jump.
  const mod = moduleInfo(id);
  const fromDraft = f.aspect ? f.aspect.split(/[\s,]+/).map((x) => { const [a, b] = x.split(/[:/]/).map(Number); return b ? a / b : a; }) : [];
  let reserve = null;
  if (!hero) {
    if (mod?.aspect) reserve = mod.aspect;
    else if (fromDraft.length && fromDraft.every((v) => v > 0)) reserve = [fromDraft[0], fromDraft[1] ?? fromDraft[0]];
    else if (!mod?.auto) reserve = stage === 'dark' ? [16 / 9, 4 / 5] : [16 / 9, 16 / 9];
  }
  const measured = !hero && mod ? figureSizes[id] : null;
  if (measured?.desktop?.aspect || measured?.mobile?.aspect) {
    reserve = [measured.desktop?.aspect ?? reserve?.[0] ?? 16 / 9, measured.mobile?.aspect ?? reserve?.[1] ?? 16 / 9];
  }
  const extra = measured ? [measured.desktop?.extra || 0, measured.mobile?.extra || 0] : [0, 0];
  const styleParts = [];
  if (reserve) styleParts.push(`--fig-aspect: ${ratio(reserve[0])};`, `--fig-aspect-compact: ${ratio(reserve[1])};`);
  if (extra[0]) styleParts.push(`--rsv-extra: ${extra[0]}px;`);
  if (extra[1]) styleParts.push(`--rsv-extra-c: ${extra[1]}px;`);
  if (measured?.desktop?.side) styleParts.push(`--rsv-side: ${measured.desktop.side}px;`);
  const style = styleParts.length ? ` style="${styleParts.join(' ')}"` : '';
  const usesStepper = !hero && mod?.stepper && steps.length > 0;
  const cls = ['fig', hero ? 'fig--hero' : `fig--${width}`].join(' ');
  const titleId = `${domId}-title`;
  const descId = `${domId}-desc`;
  const labelled = hero ? (f.alt ? ` aria-label="${esc(stripTags(altHtml))}"` : ' aria-hidden="true"') : ` aria-labelledby="${titleId}" aria-describedby="${descId}"`;
  // Steppers: render the writer's step captions now (the stepper adopts this space on
  // mount), so the caption area doesn't pop in; without JS they read as a list.
  const prerendered = usesStepper ? `<div class="fig__steps" data-prerender>
${steps.map((x, i) => `  <div class="fig__step${i === 0 ? ' is-active' : ''}"${i ? ' aria-hidden="true"' : ''}><span class="fig__step-num">Step ${i + 1} <span class="of">of ${steps.length}</span>${x.title ? ` <span class="t">· ${esc(x.title)}</span>` : ''}</span><p class="fig__step-text">${x.html}</p></div>`).join('\n')}
</div>` : '';
  return `<figure class="${cls}" id="${domId}" data-figure="${esc(id)}" data-stage="${stage}"${kind ? ` data-kind="${esc(kind)}"` : ''}${usesStepper ? ' data-stepper' : ''}${style}${labelled}>
${hero ? '' : `  <header class="fig__head">
    <span class="fig__label">Figure ${number}</span>
    <span class="fig__title" id="${titleId}">${st.inline(f.title || '')}</span>
  </header>
`}  <div class="fig__stage" data-stage="${stage}">
    <div class="fig__fallback" id="${descId}">
      <p><span class="fig__fallback-note">Interactive figure unavailable · description</span>${altHtml}</p>
    </div>
  </div>
${hero ? '' : `  <div class="fig__controls"></div>
  <figcaption class="fig__caption">${prerendered ? `\n${indent(prerendered, 4)}\n    ` : ''}${captionHtml ? `<p>${captionHtml}</p>` : ''}</figcaption>
`}  <script type="application/json" class="fig-data">
${indent(json, 4)}
  </script>
</figure>
`;
}

// Seeded shuffle (POLISH S7): option order is fixed at build time, stable per question
// (seed = page id + question text), so the key isn't always in the drafted position.
function hash32(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return h >>> 0;
}
function seededShuffle(arr, seed) {
  let a = seed || 1;
  const rnd = () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [out[i], out[j]] = [out[j], out[i]]; }
  return out;
}

function renderQuiz(st, node) {
  st.quizCount += 1;
  const qn = st.quizCount;
  const questions = [];
  let cur = null;
  let lastOpt = null;
  let sentenceSplit = false;
  for (const raw of node.raw) {
    const line = raw.trim();
    if (!line) continue;
    const q = line.match(/^(?:\d+[.)]\s*)?(?:\*\*)?Q(?:\d+)?[:.](?:\*\*)?\s*(.*)$/i);
    const o = line.match(/^[-*]\s*\[( |x|X)\]\s*(.*)$/);
    if (q) { cur = { q: q[1], options: [] }; questions.push(cur); lastOpt = null; }
    else if (o && cur) {
      let [text, ...why] = o[2].split(/\s+(?:—|–|--)\s+/);
      if (!why.length) {
        // Fallback: "Option text. Why it is right or wrong." → split after the first sentence.
        const m = text.match(/^(.+?[.?!])\s+(\S.*)$/);
        if (m) { text = m[1].replace(/\.$/, ''); why = [m[2]]; sentenceSplit = true; }
      }
      lastOpt = { correct: o[1].toLowerCase() === 'x', text: text.trim(), why: why.join(' — ').trim() };
      cur.options.push(lastOpt);
    } else if (lastOpt) lastOpt.why += ' ' + line;
    else if (cur) cur.q += ' ' + line;
  }
  if (!questions.length) { warn(st.info.id, 'empty :::quiz'); return ''; }
  if (sentenceSplit) warn(st.info.id, 'quiz options separate the explanation with ". " instead of " — "; split after the first sentence (check the result)');
  const letters = 'ABCDEFGH';
  const qs = questions.map((qq, i) => {
    const qid = `quiz-${qn}-q${i + 1}`;
    if (qq.options.filter((o) => o.correct).length !== 1) warn(st.info.id, `quiz question ${i + 1} should have exactly one [x] option`);
    // Is the key the (strictly) longest option? (Test-wise readers learn to pick it.)
    const len = (o) => flatMarkup(o.text).replace(/[*_`]/g, '').trim().length;   // no st.inline: it counts citations
    const key = qq.options.find((o) => o.correct);
    st.quizQuestions = (st.quizQuestions || 0) + 1;
    if (key && qq.options.every((o) => o === key || len(o) < len(key))) st.quizKeyLongest = (st.quizKeyLongest || 0) + 1;
    const opts = seededShuffle(qq.options, hash32(`${st.info.id}|${qq.q}`)).map((o, k) => {
      if (!o.why) warn(st.info.id, `quiz question ${i + 1}, option ${letters[k]} has no explanation (use " — why")`);
      return `  <li>
    <button type="button" class="quiz__option" data-correct="${o.correct}">
      <span class="quiz__marker" aria-hidden="true">${letters[k]}</span>
      <span class="quiz__text">${st.inline(o.text)}</span>
      <span class="quiz__explain">${st.inline(o.why)}</span>
    </button>
  </li>`;
    }).join('\n');
    return `<div class="quiz__q" data-q>
  <p class="quiz__question" id="${qid}">${questions.length > 1 ? `<span class="quiz__qnum">${i + 1}.</span>` : ''}${st.inline(qq.q)}</p>
  <ul class="quiz__options" role="list" aria-labelledby="${qid}">
${indent(opts, 2)}
  </ul>
  <div class="quiz__foot"></div>
</div>`;
  }).join('\n');
  return `<section class="quiz" data-quiz aria-label="Check your understanding">
  <div class="quiz__head">
    <p class="quiz__label label-caps">Check your understanding</p>
    <p class="quiz__score">${questions.length} question${questions.length > 1 ? 's' : ''}</p>
  </div>
${indent(qs, 2)}
</section>
`;
}

const CALLOUTS = {
  'key-idea': { cls: 'callout--key', label: 'Key idea', role: 'note' },
  clinic: { cls: 'callout--clinic', label: 'In the clinic', tag: 'aside' },
  note: { cls: 'callout--note', label: 'Note', tag: 'aside' },
};
const CALLOUT_ICONS = {
  'key-idea': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/><circle cx="12" cy="12" r="3"/></svg>',
  clinic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M9.5 3.5h5v6h6v5h-6v6h-5v-6h-6v-5h6z"/></svg>',
  note: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 4h10l4 4v12H5z"/><path d="M15 4v4h4M8.5 12.5h7M8.5 16h5"/></svg>',
};

function renderNodes(st, nodes, ctx = {}) {
  let html = '';
  for (const node of nodes) {
    if (node.type === 'md') { html += st.md(node.text); continue; }
    const body = () => prettyBlocks(renderNodes(st, node.children, ctx));
    switch (node.name) {
      case 'figure':
        if (ctx.heroId && node.args.split(/\s+/)[0] === ctx.heroId) { ctx.heroHtml = renderFigure(st, node, { hero: true }); break; }
        html += renderFigure(st, node);
        break;
      case 'quiz':
        html += renderQuiz(st, node);
        break;
      case 'deep-dive': {
        const title = node.args || 'Go deeper';
        html += `<details class="deep-dive">
  <summary>
    <span class="deep-dive__label label-caps">Go deeper</span>
    <span class="deep-dive__title">${st.inline(title)}</span>
    <span class="deep-dive__icon" aria-hidden="true"></span>
  </summary>
  <div class="deep-dive__body">
${indent(body(), 4)}
  </div>
</details>
`;
        break;
      }
      case 'key-idea':
      case 'clinic':
      case 'note': {
        const c = CALLOUTS[node.name];
        const tag = c.tag || 'div';
        const label = node.args || c.label;
        html += `<${tag} class="callout ${c.cls}"${c.role ? ` role="${c.role}"` : ''}>
  <p class="callout__label label-caps">${CALLOUT_ICONS[node.name]}${esc(label)}</p>
  <div class="callout__body">
${indent(body(), 4)}
  </div>
</${tag}>
`;
        break;
      }
      case 'takeaways': {
        const hid = st.headingIds.has('takeaways') ? 'takeaways-2' : 'takeaways';
        st.headingIds.add(hid);
        html += `<section class="takeaways" aria-labelledby="${hid}">
  <p class="takeaways__label label-caps">Before you go</p>
  <h2 id="${hid}" data-toc-title="Takeaways">${esc(node.args || 'Takeaways')}</h2>
${indent(body(), 2)}
</section>
`;
        break;
      }
      default:
        warn(st.info.id, `unknown directive :::${node.name} (rendered as a note)`);
        html += `<aside class="callout callout--note">
  <div class="callout__body">
${indent(body(), 4)}
  </div>
</aside>
`;
    }
  }
  return html;
}

// ------------------------------------------------------------------ page assembly
const metaById = new Map();   // draft id → { fm, body, … } (filled by pass 1, below)
function partLabel(info) {
  const p = info.part ? partById.get(info.part) : null;
  return p ? `Part ${p.id} · ${p.title}` : '';
}

function pagerCard(target, dir) {
  if (!target) return '';
  const isPrev = dir === 'prev';
  return `<a class="pager__card pager__card--${dir}" href="${esc(target.file)}" rel="${dir}">
  <span class="pager__dir">${isPrev ? ICON.arrowLeft : ''}${isPrev ? 'Previous' : 'Next'}${isPrev ? '' : ICON.arrowRight}</span>
  ${target.label ? `<span class="pager__num">${esc(target.label)}</span>` : ''}
  <span class="pager__title">${esc(target.title)}</span>
</a>`;
}

// Chapter end (POLISH S3). Next card: right after the takeaways — title, one-line description,
// reading time and a small live lens of the next chapter's hero figure.
function firstSentence(text) {
  const t = String(text || '').trim();
  const m = t.match(/^(.+?[.!?])(\s|$)/);
  return m ? m[1] : t;
}
function nextChapterCard(next) {
  const meta = metaById.get(next.id);
  const fm = meta?.fm || {};
  const dek = fm.subtitle ? esc(stripTags(smarten(inlineMd.parseInline(flatMarkup(firstSentence(fm.subtitle)))))) : '';
  const label = next.label || (next.number != null && next.number !== '' ? `Chapter ${next.number}` : '');
  const lens = fm.hero ? `
    <div class="next-card__lens" aria-hidden="true">
      <figure class="fig fig--hero fig--lens" data-figure="${esc(fm.hero)}" data-stage="dark" aria-hidden="true">
        <div class="fig__stage" data-stage="dark"></div>
      </figure>
    </div>` : '';
  return `<nav class="next-chapter" aria-label="Next chapter">
  <a class="next-card" href="${esc(next.file)}" rel="next">${lens}
    <div class="next-card__body">
      <span class="next-card__dir">Next${label ? ` · ${esc(label)}` : ''}</span>
      <span class="next-card__title">${esc(next.title)}</span>${dek ? `
      <span class="next-card__dek">${dek}</span>` : ''}${fm.reading_time ? `
      <span class="next-card__meta">${ICON.clock}${esc(String(fm.reading_time))} min read</span>` : ''}
    </div>
    <span class="next-card__arrow" aria-hidden="true">${ICON.arrowRight}</span>
  </a>
</nav>`;
}
// The last chapter: an end-of-book panel instead of an empty "Next" (coda from frontmatter `coda:`).
function bookEndPanel(fm, st, totalSources) {
  if (!fm.coda) warn(st.info.id, 'last chapter: frontmatter "coda:" is missing (the end-of-book panel shows links only)');
  const first = chapters.pages.find((p) => p.number != null && p.number !== '') || chapters.pages[0];
  const link = (href, title, sub) => `<a class="book-end__link" href="${esc(href)}"><span class="book-end__link-title">${title}</span><span class="book-end__link-sub">${sub}</span></a>`;
  return `<section class="book-end" aria-labelledby="book-end-title">
  <p class="book-end__label label-caps">The end of the guide</p>
  <h2 class="book-end__title" id="book-end-title">You’ve reached the end</h2>${fm.coda ? `
  <p class="book-end__coda">${st.inline(String(fm.coda))}</p>` : ''}
  <nav class="book-end__links" aria-label="Where to go next">
    ${link('glossary.html', 'Glossary', 'Every term, in plain words')}
    ${link('sources.html', 'All sources', `${totalSources ? `${totalSources} papers and records` : 'Chapter by chapter'}`)}
    ${link('about.html', 'About this guide', 'How it was made, and its limits')}
    ${first ? link(first.file, 'Start again', esc(`${first.label || 'Chapter 1'} · ${first.title}`)) : ''}
  </nav>
</section>`;
}

function neighbours(info, fm) {
  const resolve = (id) => (id ? pageById.get(id) || extraById.get(id) || null : null);
  if (fm.prev || fm.next) return { prev: resolve(fm.prev), next: resolve(fm.next) };
  const i = pageById.get(info.id)?.order;
  if (i == null) return { prev: null, next: null };
  return { prev: chapters.pages[i - 1] || null, next: chapters.pages[i + 1] || null };
}

function buildPage(draftFile, glossaryAll) {
  const where = path.basename(draftFile);
  const src = fs.readFileSync(draftFile, 'utf8');
  const { fm, body: rawBody } = parseFrontmatter(src, where);
  const id = fm.id || path.basename(draftFile, '.md');
  const listed = pageById.get(id);
  const isDev = path.basename(draftFile).startsWith('_');
  if (!listed && !isDev) warn(where, `id "${id}" is not in assets/data/chapters.json`);
  const info = {
    id,
    file: listed?.file || `${id}.html`,
    number: fm.number ?? listed?.number ?? '',
    label: listed?.label || (fm.number != null && fm.number !== '' ? `Chapter ${fm.number}` : ''),
    part: fm.part || listed?.part || null,
    title: fm.title || listed?.title || id,
    subtitle: fm.subtitle || '',
  };
  for (const k of ['title', 'subtitle', 'part', 'reading_time']) if (!fm[k]) warn(where, `frontmatter is missing "${k}"`);
  if (listed && fm.title && fm.title !== listed.title) warn(where, `title "${fm.title}" differs from chapters.json "${listed.title}"`);

  const st = createBuild(info);
  let { body, section: glossSec } = extractSection(rawBody, 'Glossary');
  let srcSec;
  ({ body, section: srcSec } = extractSection(body, 'Sources'));
  const glossary = glossSec ? parseGlossary(glossSec, where) : [];
  const sources = srcSec ? parseSources(srcSec) : [];
  for (const g of glossary) {
    st.glossaryLocal[g.id] = { term: smarten(inlineMd.parseInline(flatMarkup(g.term))), def: smarten(inlineMd.parseInline(flatMarkup(g.def))), chapterLabel: info.label };
  }

  // Body
  const nodes = parseBlocks(body, where);
  const rctx = { heroId: fm.hero || null, heroHtml: '' };
  let main = prettyBlocks(renderNodes(st, nodes, rctx));
  if (fm.hero && !rctx.heroHtml) {
    // Decorative hero (no :::figure block): an ambient scene, hidden from assistive tech.
    rctx.heroHtml = `<figure class="fig fig--hero" data-figure="${esc(fm.hero)}" data-stage="dark" aria-hidden="true">
  <div class="fig__stage" data-stage="dark"></div>
</figure>`;
    st.figures.push({ id: fm.hero, number: '', hero: true, title: '(hero)', kind: 'hero', stage: 'dark', steps: 0 });
  }
  // Lead paragraph: the first paragraph if it comes before any section heading.
  main = main.replace(/^<p>/, '<p class="lead">');

  // Sources
  let sourcesHtml = '';
  if (sources.length) {
    const items = sources.map((s) => {
      const html = linkifySource(st.inline(s.md));
      return { n: s.n, html, text: stripTags(html) };
    });
    st.sourcesOut = items;
    const sid = st.headingIds.has('sources') ? 'sources-list' : 'sources';
    // Collapsed (POLISH S3): citation popovers cover in-text use; a jump to #src-n opens it.
    // Each cited source links back up to its first citation (POLISH S6).
    const back = (n) => (st.citesUsed.has(n) ? ` <a class="src-up" href="#ref-${n}" aria-label="Back to where source ${n} is first cited">↩</a>` : '');
    sourcesHtml = `<details class="sources-block" data-sources>
  <summary class="sources-block__summary"><h2 id="${sid}" class="sources-title">Sources <span class="sources-block__count">(${items.length})</span></h2>${ICON.chevronDown}</summary>
  <ol class="sources-list" role="list">
${items.map((s) => `    <li id="src-${s.n}"><span class="src-num">${s.n}</span>${s.html}${back(s.n)}</li>`).join('\n')}
  </ol>
</details>`;
    const nums = new Set(items.map((s) => s.n));
    for (const n of st.citesUsed) if (!nums.has(n)) warn(where, `citation [^${n}] has no matching source`);
  } else if (st.citesUsed.size) warn(where, 'citations used but no "## Sources" section');

  // Resolve {{id}} without display text, and check terms exist.
  const allTerms = { ...glossaryAll, ...st.glossaryLocal };
  const termName = (k, mode) => {
    if (!allTerms[k]) return k;
    let name = stripTags(allTerms[k].term).replace(/\s*\(.*\)$/, '');
    // "Phagocytosis" → "phagocytosis" mid-sentence; acronyms ("MHC", "T cell", "CD8") stay as written.
    if (mode === 'lc' && /^[A-Z][a-z]/.test(name) && !/^[A-Z][a-z]+[A-Z]/.test(name)) name = name[0].toLowerCase() + name.slice(1);
    return name;
  };
  main = main.replace(/@@TERM:([a-z0-9_-]+):(cap|lc)@@/g, (_, k, mode) => termName(k, mode));
  // The first use of each term on the page gets an anchor (glossary.html links "Introduced in…" here).
  // Terms inside figure-data JSON are escaped (\u003c), so they never match.
  const anchored = new Set();
  main = main.replace(/<a class="term" data-term="([a-z0-9_-]+)"/g, (m, k) => {
    if (anchored.has(k)) return m;
    anchored.add(k);
    return `<a class="term" id="term-${k}" data-term="${k}"`;
  });
  for (const t of st.termsUsed) if (!allTerms[t]) warn(where, `glossary term "${t}" is not defined in any draft's ## Glossary`);

  // Page chrome
  const words = stripTags(main).split(/\s+/).length;
  const minutes = Number(fm.reading_time) || Math.max(1, Math.round(words / 230));
  const nFig = st.figures.filter((f) => f.number).length;
  const { prev, next } = neighbours(info, fm);
  const toc = `<details class="toc" id="toc">
  <summary class="toc__summary"><span>In this chapter</span>${ICON.chevronDown}</summary>
  <p class="toc__title" aria-hidden="true">In this chapter</p>
  <ol class="toc__list" role="list">
${[...main.matchAll(/<h2 id="([^"]+)"(?: data-toc-title="([^"]+)")?[^>]*>(.*?)<\/h2>/g)].map((m) => `    <li><a href="#${m[1]}">${esc(m[2] || stripTags(m[3]).replace(/#$/, ''))}</a></li>`).join('\n')}${sourcesHtml ? `\n    <li><a href="#sources">Sources</a></li>` : ''}
  </ol>
</details>`;
  const kicker = [partLabel(info) && `<span class="part">${esc(partLabel(info))}</span>`].filter(Boolean);
  const hero = `<header class="hero${rctx.heroHtml ? ' hero--art' : ''}">
  <div class="hero__inner">
    ${kicker.length ? `<p class="hero__kicker">${kicker.join('<span class="dot" aria-hidden="true"></span>')}</p>` : ''}
    <div class="hero__heading">
      ${info.number !== '' && info.number != null ? `<span class="hero__num" aria-hidden="true">${esc(info.number)}</span>` : ''}
      ${info.label ? `<p class="hero__label">${esc(info.label)}</p>` : ''}
      <h1 class="hero__title" style="--title-longest: ${Math.max(...info.title.split(/\s+/).map((w) => w.replace(/[^\p{L}\p{N}]/gu, '').length), 6)};">${esc(info.title)}</h1>
    </div>
    ${info.subtitle ? `<p class="hero__dek">${st.inline(info.subtitle)}</p>` : ''}
    <p class="hero__meta">
      <span>${ICON.clock}${minutes} min read</span>${nFig ? `
      <span>${ICON.figure}${nFig} interactive figure${nFig > 1 ? 's' : ''}</span>` : ''}
    </p>${rctx.heroHtml ? `
    <div class="hero__art">
${indent(rctx.heroHtml.trim(), 6)}
    </div>` : ''}
  </div>
</header>`;

  const isChapter = !!listed && !isDev;
  // The Next card sits after the takeaways; the bottom pager then only needs "Previous".
  const pagerNext = isChapter ? null : next;
  const pager = prev || pagerNext ? `<nav class="pager is-wide" aria-label="Chapters">
${indent([pagerCard(prev, 'prev'), pagerCard(pagerNext, 'next')].filter(Boolean).join('\n'), 2)}
</nav>` : '';
  const totalSources = [...metaById.values()].reduce((k, d) => k + (d.isDev ? 0 : d.sourceCount || 0), 0);
  const endHtml = !isChapter ? '' : next ? nextChapterCard(next) : prev ? bookEndPanel(fm, st, totalSources) : '';
  if (st.quizQuestions && st.quizKeyLongest > st.quizQuestions / 2) {
    warn(where, `quiz: the key is the longest option in ${st.quizKeyLongest} of ${st.quizQuestions} questions (make distractors as long and specific)`);
  }

  const article = `<article class="chapter">
${indent(hero, 2)}
  <div class="chapter-body prose">
${indent(toc, 4)}
${indent(main, 4)}
${endHtml ? indent(endHtml, 4) : ''}
${sourcesHtml ? indent(sourcesHtml, 4) : ''}
${pager ? indent(pager, 4) : ''}
  </div>
</article>`;

  // Optional per-page CSS owned by the chapter builder: chapters/chNN.css (numbered
  // chapters) or chapters/<id>.css (e.g. interlude-history.css). Linked only if it exists.
  const chapterCss = (() => {
    const names = [];
    if (/^\d+$/.test(String(info.number))) names.push(`ch${String(info.number).padStart(2, '0')}`);
    names.push(info.id);
    const hit = names.find((n) => fs.existsSync(path.join(ROOT, `assets/css/chapters/${n}.css`)));
    return hit ? [`assets/css/chapters/${hit}.css`] : [];
  })();
  const headExtra = isDev && Object.keys(st.glossaryLocal).length
    ? `<script type="application/json" id="page-glossary">${JSON.stringify(st.glossaryLocal).replace(/</g, '\\u003c')}</script>`
    : '';
  const htmlOut = page({
    title: info.title,
    description: stripTags(st.inline(info.subtitle || '')),
    bodyClass: 'page-chapter',
    pageId: info.id,
    main: article.replace(/\n{2,}/g, '\n'),
    extraCss: chapterCss,
    context: { num: info.number !== '' && info.number != null ? `Ch. ${info.number}` : info.label, title: info.title },
    headExtra,
    file: info.file,
    noindex: isDev || preview,   // dev samples and draft previews stay out of search engines
  });

  return {
    id, isDev, info, file: info.file, html: htmlOut, glossary, sources: st.sourcesOut || [], figures: st.figures,
    order: listed ? listed.order : 1000,
  };
}

// ------------------------------------------------------------------ main
const draftFiles = fs.existsSync(DRAFTS)
  ? fs.readdirSync(DRAFTS).filter((f) => f.endsWith('.md')).sort().map((f) => path.join(DRAFTS, f))
  : [];

// Pass 1: read every draft once (glossary, sources and term usage are site-wide).
const draftsMeta = draftFiles.map((file) => {
  const src = fs.readFileSync(file, 'utf8');
  const { fm, body } = parseFrontmatter(src, path.basename(file));
  const id = fm.id || path.basename(file, '.md');
  const { section } = extractSection(body, 'Glossary');
  return { file, name: path.basename(file), id, fm, body, src, isDev: path.basename(file).startsWith('_'), order: pageById.get(id)?.order ?? 1000, glossarySrc: section };
}).sort((a, b) => a.order - b.order || a.file.localeCompare(b.file));
for (const d of draftsMeta) {
  const srcSec = extractSection(extractSection(d.body, 'Glossary').body, 'Sources').section;
  d.sourceCount = srcSec ? parseSources(srcSec).length : 0;
  metaById.set(d.id, d);
}

// ---- Glossary model
// variants: every definition of every id in every (non-dev) draft, in reading order.
// canonical: content/glossary.md entries (win over drafts).
// firstUse: the first chapter (reading order) whose text uses {{id}}; "Introduced in" points there.
const normDef = (s) => stripTags(s).toLowerCase().replace(/[“”"’']/g, '').replace(/\s+/g, ' ').replace(/[.\s]+$/, '').trim();
const variants = {};
for (const d of draftsMeta) {
  if (d.isDev || !d.glossarySrc) continue;
  for (const g of parseGlossary(d.glossarySrc, d.name)) (variants[g.id] ||= []).push({ ...g, draft: d });
}
const canonical = {};
const CANON_FILE = path.join(ROOT, 'content/glossary.md');
if (fs.existsSync(CANON_FILE)) {
  const text = fs.readFileSync(CANON_FILE, 'utf8').replace(/<!--[\s\S]*?-->/g, '').split(/\r?\n/).filter((l) => !/^\s*#/.test(l)).join('\n');
  for (const g of parseGlossary(text, 'content/glossary.md')) {
    if (canonical[g.id]) warn('content/glossary.md', `id "${g.id}" appears twice; keeping the first`);
    else canonical[g.id] = g;
  }
}
const firstUse = {};
const usedIn = {};
for (const d of draftsMeta) {
  if (d.isDev) continue;
  const body = extractSection(d.body, 'Glossary').body;
  for (const m of body.matchAll(/\{\{\s*([a-z0-9][a-z0-9_-]*)/gi)) {
    const k = m[1].toLowerCase();
    if (!firstUse[k]) firstUse[k] = d;
    (usedIn[k] ||= new Set()).add(d);
  }
}
const chapterKeyOf = (d) => (d.id.match(/^(\d+)/) || [])[1] || d.id.replace(/-.*/, '');
const glossaryAll = {};
for (const id of new Set([...Object.keys(variants), ...Object.keys(canonical)])) {
  const src = canonical[id] || variants[id][0];
  const home = firstUse[id] || variants[id]?.[0]?.draft || null;
  const listed = home ? pageById.get(home.id) : null;
  glossaryAll[id] = {
    term: smarten(inlineMd.parseInline(flatMarkup(src.term))),
    def: smarten(inlineMd.parseInline(flatMarkup(src.def))),
    chapter: home ? chapterKeyOf(home) : '',
    chapterLabel: listed?.label || '',
    chapterTitle: listed?.title || home?.fm.title || '',
    page: home ? listed?.file || `${home.id}.html` : '',
    ...(canonical[id] ? { canonical: true } : {}),
  };
}
const conflicts = Object.entries(variants)
  .filter(([, vs]) => new Set(vs.map((v) => normDef(v.def))).size > 1)
  .map(([id, vs]) => ({ id, vs, resolved: !!canonical[id] }));
const unresolved = conflicts.filter((c) => !c.resolved);

// Pass 2: build pages.
const matchesOnly = (d) => !only.length || only.some((o) => d.id === o || d.id.startsWith(o) || d.name.startsWith(o));
const selected = draftsMeta.filter(matchesOnly);
if (only.length && !selected.length) {
  console.error(`No draft matches --only ${only.join(',')}. Drafts: ${draftsMeta.map((d) => d.name).join(', ') || '(none)'}`);
  process.exit(1);
}

const results = [];
const figureIndex = [];   // for _dev.html: every figure in every draft
for (const d of draftsMeta) {
  const build = selected.includes(d);
  try {
    const r = buildPage(d.file, glossaryAll);
    for (const f of r.figures) figureIndex.push({ ...f, page: r.file, pageId: r.id, isDev: r.isDev });
    if (!build) continue;
    results.push(r);
    const outFile = preview ? `_preview-${r.file}` : r.file;
    const changed = writeAtomic(path.join(ROOT, outFile), r.html);
    const missingModules = r.figures.filter((f) => !fs.existsSync(path.join(ROOT, 'assets/js/figures', `${f.id}.js`))).map((f) => f.id);
    console.log(`${changed ? 'wrote ' : checkOnly ? 'parsed' : 'same  '} ${outFile.padEnd(26)} ${String(r.figures.length).padStart(2)} fig  ${String(r.sources.length).padStart(2)} src  ${String(r.glossary.length).padStart(2)} terms${missingModules.length ? `   (figure modules not built yet: ${missingModules.length})` : ''}`);
  } catch (err) {
    if (!build) continue;
    console.error(`FAILED ${d.name}: ${err.stack || err}`);
    process.exitCode = 1;
  }
}

// Site-wide data (always regenerated from all drafts so --only runs stay consistent).
const sortedGlossary = Object.fromEntries(Object.keys(glossaryAll).sort().map((k) => [k, glossaryAll[k]]));
const gChanged = writeAtomic(path.join(DATA, 'glossary.json'), JSON.stringify(sortedGlossary, null, 2) + '\n');

const sourcesOut = {};
for (const d of draftsMeta) {
  if (d.isDev) continue;
  const { section } = extractSection(extractSection(d.body, 'Glossary').body, 'Sources');
  if (!section) continue;
  const listed = pageById.get(d.id);
  const citedNums = new Set();
  for (const m of extractSection(d.body, 'Glossary').body.matchAll(/\[\^\s*(\d+(?:\s*,\s*\d+)*)\s*\]/g)) for (const n of m[1].split(',')) citedNums.add(Number(n));
  const items = parseSources(section).map((x) => {
    const html = linkifySource(smarten(inlineMd.parseInline(flatMarkup(x.md))));
    return { n: x.n, html, text: stripTags(html), ...(citedNums.has(x.n) ? { cited: true } : {}) };
  });
  if (items.length) sourcesOut[d.id] = { title: d.fm.title || listed?.title || d.id, label: listed?.label || '', file: listed?.file || `${d.id}.html`, sources: items };
}
const sChanged = writeAtomic(path.join(DATA, 'sources.json'), JSON.stringify(sourcesOut, null, 2) + '\n');
console.log(`${gChanged ? 'wrote ' : 'same  '} assets/data/glossary.json  ${Object.keys(glossaryAll).length} terms (${Object.keys(canonical).length} canonical)`);
console.log(`${sChanged ? 'wrote ' : 'same  '} assets/data/sources.json   ${Object.keys(sourcesOut).length} chapters`);

// Generated site pages (cheap, deterministic: always rebuilt).
if (!preview) {
  const sitePages = {
    'glossary.html': glossaryPage({ glossary: sortedGlossary }),
    'sources.html': sourcesPage({ sources: sourcesOut, order: chapters.pages.map((p) => p.id) }),
    '_dev.html': devPage({ chapters, draftsMeta, figureIndex, glossaryCount: Object.keys(glossaryAll).length, conflicts: conflicts.length, unresolved: unresolved.length, root: ROOT }),
  };
  for (const [file, html] of Object.entries(sitePages)) {
    const changed = writeAtomic(path.join(ROOT, file), html);
    console.log(`${changed ? 'wrote ' : checkOnly ? 'parsed' : 'same  '} ${file}`);
  }
}

// Hand-written pages (index.html, about.html) share the generated pages' <head> block
// (icons, theme colors, social cards, theme boot script) between <!-- head:start -->
// and <!-- head:end -->. Only that block and the site.js tag are touched.
if (!preview) {
  const HAND = {
    'index.html': { title: '', ogTitle: 'Self & Other: an illustrated guide to the immune system and cancer immunotherapy', type: 'website' },
    'about.html': { title: 'About' },
  };
  const unesc = (s) => s.replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
  for (const [file, o] of Object.entries(HAND)) {
    const abs = path.join(ROOT, file);
    if (!fs.existsSync(abs)) continue;
    const html = fs.readFileSync(abs, 'utf8');
    const description = unesc((html.match(/<meta name="description" content="([^"]*)">/) || [])[1] || '');
    const block = `<!-- head:start (generated by tools/build-content.mjs; edit tools/lib/template.mjs) -->\n${headMeta({ title: o.title, ogTitle: o.ogTitle, description, file, type: o.type || 'article' })}\n<!-- head:end -->`;
    let out = html;
    if (/<!-- head:start[\s\S]*?<!-- head:end -->/.test(out)) out = out.replace(/<!-- head:start[\s\S]*?<!-- head:end -->/, () => indent(block, 2).trimStart());
    else out = out.replace(/<meta name="theme-color"[\s\S]*?<script>\(function\(\)\{var d=document\.documentElement;[^\n]*<\/script>/, () => indent(block, 2).trimStart());
    out = out.replace(/<script type="module" src="assets\/js\/site\.js"[^>]*><\/script>/, SITE_SCRIPT);
    const changed = writeAtomic(abs, out);
    console.log(`${changed ? 'wrote ' : checkOnly ? 'parsed' : 'same  '} ${file} (head block)`);
  }

  // sitemap.xml: reader pages only (never _*.html or art-gallery.html), and only when the
  // public URL is known (chapters.json → site.url); a sitemap needs absolute URLs.
  const site = siteConfig();
  const sitemapFile = path.join(ROOT, 'sitemap.xml');
  if (site.url) {
    const files = [...(chapters.extras || []).map((x) => x.file), ...chapters.pages.map((p) => p.file)]
      .filter((f) => fs.existsSync(path.join(ROOT, f)));
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${files.map((f) => `  <url><loc>${esc(site.url + (f === 'index.html' ? '' : f))}</loc></url>`).join('\n')}\n</urlset>\n`;
    const changed = writeAtomic(sitemapFile, xml);
    console.log(`${changed ? 'wrote ' : checkOnly ? 'parsed' : 'same  '} sitemap.xml (${files.length} pages)`);
  } else if (!checkOnly) {
    console.log('note   og:image and canonical URLs are relative: set "url" in assets/data/chapters.json → site before deploying (also enables sitemap.xml)');
  }
}

// Glossary health, one line; details on request.
const undefinedTerms = Object.keys(usedIn).filter((k) => !glossaryAll[k]);
console.log(`glossary: ${conflicts.length} id${conflicts.length === 1 ? '' : 's'} defined differently across drafts (${conflicts.length - unresolved.length} resolved by content/glossary.md)${undefinedTerms.length ? ` · ${undefinedTerms.length} used but undefined` : ''}${glossaryReport ? '' : ' → details: --glossary-report'}`);
if (glossaryReport && !checkOnly) {
  const file = path.join(ROOT, 'docs/reviews/glossary-conflicts.md');
  writeAtomic(file, glossaryConflictReport({ conflicts, canonical, firstUse, usedIn, glossaryAll, variants, undefinedTerms }));
  console.log(`wrote  docs/reviews/glossary-conflicts.md`);
}

// De-duplicate warnings.
const uniq = [...new Set(warnings)];
if (uniq.length) {
  console.log(`\n${uniq.length} warning${uniq.length > 1 ? 's' : ''}:`);
  for (const w of uniq) console.log(`  ⚠ ${w}`);
}

// ------------------------------------------------------------------ glossary conflict report
function glossaryConflictReport({ conflicts: list, canonical: canon, firstUse: first, usedIn: used, glossaryAll: all, variants: vars, undefinedTerms: undef }) {
  const md = (s) => stripTags(inlineMd.parseInline(flatMarkup(s))).replace(/\|/g, '\\|');
  const out = [];
  out.push('# Glossary conflicts', '');
  out.push('Generated by `node tools/build-content.mjs --glossary-report`. Do not edit by hand: it is rewritten on every run.', '');
  out.push('Several chapter drafts define the same glossary id with different wording. Until an id has a canonical entry in `content/glossary.md`, the site uses the **earliest chapter\'s** definition (reading order). To resolve an id, add one line to `content/glossary.md`:', '');
  out.push('```', '- id | Term | Definition (1–2 plain-language sentences)', '```', '');
  const nRes = list.filter((c) => c.resolved).length;
  out.push(`**${list.length} conflicting ids** · ${nRes} resolved · ${list.length - nRes} to do · ${Object.keys(all).length} glossary ids in total · ${Object.keys(canon).length} canonical entries.`, '');
  out.push('Each id lists where it is first used (the glossary links there as "Introduced in…"), then every variant with the drafts that use that wording.', '');
  for (const c of [...list].sort((a, b) => Number(a.resolved) - Number(b.resolved) || a.id.localeCompare(b.id))) {
    out.push(`## \`${c.id}\` ${c.resolved ? '✓ resolved' : '✗ unresolved'}`, '');
    const fu = first[c.id];
    const users = [...(used[c.id] || [])].map((d) => d.id);
    out.push(`First used in **${fu ? fu.id : '(never used with {{…}})'}**${users.length > 1 ? `; also used in ${users.filter((u) => u !== fu?.id).join(', ')}` : ''}.`, '');
    if (canon[c.id]) out.push(`Canonical: **${md(canon[c.id].term)}**: ${md(canon[c.id].def)}`, '');
    const groups = new Map();
    for (const v of c.vs) {
      const key = normDef(v.def);
      if (!groups.has(key)) groups.set(key, { v, drafts: [] });
      groups.get(key).drafts.push(v.draft.id);
    }
    out.push('| Drafts | Term | Definition |', '|---|---|---|');
    for (const { v, drafts } of groups.values()) out.push(`| ${drafts.join(', ')} | ${md(v.term)} | ${md(v.def)} |`);
    out.push('');
  }
  if (undef.length) {
    out.push('## Used with `{{id}}` but defined nowhere', '');
    for (const k of undef.sort()) out.push(`- \`${k}\`: used in ${[...used[k]].map((d) => d.id).join(', ')}`);
    out.push('');
  }
  const unused = Object.keys(vars).filter((k) => !used[k]).sort();
  if (unused.length) {
    out.push('## Defined but never marked with `{{id}}` in any chapter', '', unused.map((k) => `\`${k}\``).join(', '), '');
  }
  return out.join('\n');
}

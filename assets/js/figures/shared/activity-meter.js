// shared/activity-meter.js — push/pull ledgers, gauges and segment meters (platform task P4).
// API: docs/shared/activity-meter.md
//
// Teaching-model outputs are words, meters or tiers labeled "Illustrative", never numbers
// (FIGURE-AUDIT §4 rules 17, 19). Signs use the site's + / − discs (rule 10). Colors come from
// CSS tokens, so one drawing is right on dark stages, light stages and both page themes.
import { gsap } from '../../../vendor/gsap/index.js';
import * as ART from '../../art/index.js';

const NS = 'http://www.w3.org/2000/svg';
const DEG = Math.PI / 180;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const clamp01 = (v) => clamp(v, 0, 1);
const lerp = (a, b, t) => a + (b - a) * t;
const f = (v) => String(Math.round(v * 100) / 100);
const ease = (name) => gsap.parseEase(name || 'so.inOut') || gsap.parseEase('power2.inOut');
const reducedMotion = () => (ART.prefersReducedMotion ? ART.prefersReducedMotion() : false);

function node(tag, attrs = {}, parent) {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) {
    const v = attrs[k];
    if (v == null || v === false) continue;
    if (k === 'text') e.textContent = v;
    else e.setAttribute(k, String(v));
  }
  if (parent) parent.appendChild(e);
  return e;
}

const COLOR = { '+': 'var(--c-activate, #3DDC97)', '-': 'var(--c-inhibit, #E5484D)', null: 'var(--fg-2)' };
// One fill grammar for every meter on the site (POLISH B6): benefit / attack / activity = killer-blue,
// risk / harm = brake-crimson, tumor burden = cancer-violet; empty = a hairline track. Same tokens on
// dark and light stages. `tone` picks one explicitly; otherwise it is read from the meter's title
// (or, for an untitled meter in HTML, from the heading just before its host element).
const TONES = {
  benefit: 'var(--c-cd8, #4C8DFF)',
  go: 'var(--c-activate, #3DDC97)',
  risk: 'var(--c-inhibit, #E5484D)',
  cancer: 'var(--c-cancer, #B65FD8)',
  neutral: 'var(--fg-2)',
};
function guessTone(text = '') {
  if (/risk|damage|side.?effect|toxic|harm/i.test(text)) return 'risk';
  if (/tumou?r cells|cancer cells/i.test(text)) return 'cancer';
  return 'benefit';
}
const TRACK = 'fill: var(--fg); fill-opacity: 0.04; stroke: var(--fg-3); stroke-opacity: 0.6; stroke-width: 1; vector-effect: non-scaling-stroke';
const WORD = (v) => (v < 0.08 ? 'none' : v < 0.38 ? 'weak' : v < 0.7 ? 'medium' : 'strong');

/** + / − disc drawn with tokens (so it themes for free); null → neutral dot. */
function signDisc(parent, sign, { x, y, r = 7 }) {
  const g = node('g', { transform: `translate(${f(x)} ${f(y)})` }, parent);
  if (sign === '+' || sign === '-') {
    node('circle', { r, style: `fill: ${COLOR[sign]}; stroke: var(--halo); stroke-width: 1.2` }, g);
    const k = r * 0.52;
    node('path', { d: sign === '+' ? `M${-k} 0H${k}M0 ${-k}V${k}` : `M${-k} 0H${k}`, style: `stroke: ${sign === '+' ? '#0B1024' : '#FFFFFF'}; stroke-width: ${f(Math.max(1.4, r * 0.32))}; stroke-linecap: round` }, g);
  } else {
    node('circle', { r: r * 0.55, style: 'fill: var(--fg-3)' }, g);
  }
  return g;
}

/** Seek-safe tween of a pure render(p). */
function drive(tl, render, { duration, ease: e, pos }) {
  let v = 0;
  const proxy = {};
  Object.defineProperty(proxy, 'p', { get: () => v, set: (x) => { v = x; render(x); }, enumerable: true });
  tl.fromTo(proxy, { p: 0 }, { p: 1, duration: Math.max(0.001, duration), ease: e, immediateRender: false }, pos);
}

export function meter(parent, opts = {}) {
  const {
    mode = 'ledger', orient = 'h', segments = [], zones = [], count = 5, title = '', net = 'Net effect',
    tag = 'Illustrative', x = 0, y = 0, values,
  } = opts;
  const ctxText = !title && parent && !(typeof SVGElement !== 'undefined' && parent instanceof SVGElement) ? (parent.previousElementSibling?.textContent || '') : '';
  const toneColor = TONES[opts.tone] || opts.color || TONES[guessTone(title || opts.label || ctxText)];
  const domain = opts.domain || (mode === 'ledger' ? [-1, 1] : [0, 1]);
  const isSvg = typeof SVGElement !== 'undefined' && parent instanceof SVGElement;
  let root, host;
  if (isSvg) {
    host = node('g', { class: 'so-meter', transform: `translate(${f(x)} ${f(y)})` }, parent);
    root = host;
  } else {
    root = node('svg', { class: 'so-meter-svg', 'aria-hidden': 'true', focusable: 'false', overflow: 'visible' });
    root.style.display = 'block';
    root.style.maxWidth = '100%';
    host = node('g', { class: 'so-meter' }, root);
    parent.appendChild(root);
  }

  const plan = { v: {}, net: 0, value: domain[0] };
  for (const s of segments) plan.v[s.id] = 0;
  const parts = {};
  let W, H;

  // ------------------------------------------------------------------ header
  let top = 0;
  function header(width) {
    if (title) node('text', { class: 't-caps', x: 0, y: 12, text: title }, host);
    if (tag) node('text', { class: 't-caps t-muted t-end', x: width, y: 12, 'text-anchor': 'end', text: tag, style: 'fill: var(--fg-3)' }, host);
    top = title || tag ? 26 : 0;
  }

  // ------------------------------------------------------------------ ledger
  if (mode === 'ledger' && orient !== 'v') {
    W = opts.width ?? 300;
    header(W);
    const rowH = 30;
    const labelW = Math.round(W * 0.38);
    const x0 = labelW, x1 = W, cx = (x0 + x1) / 2, half = (x1 - x0) / 2 - 2;
    const rows = segments.map((s, i) => {
      const yy = top + i * rowH + rowH / 2;
      signDisc(host, s.sign ?? null, { x: 8, y: yy, r: 7.5 });
      node('text', { class: 't-small', x: 22, y: yy, 'dominant-baseline': 'central', text: s.label, style: 'fill: var(--fg)' }, host);
      node('line', { x1: x0, x2: x1, y1: yy, y2: yy, style: 'stroke: var(--line); stroke-width: 1; vector-effect: non-scaling-stroke' }, host);
      const bar = node('rect', { x: cx, y: yy - 6, width: 0, height: 12, rx: 3, style: `fill: ${COLOR[s.sign ?? null]}; fill-opacity: 0.9` }, host);
      return { s, bar, yy };
    });
    node('line', { x1: cx, x2: cx, y1: top + 4, y2: top + segments.length * rowH - 4, style: 'stroke: var(--fg-3); stroke-width: 1; vector-effect: non-scaling-stroke' }, host);
    let netParts = null;
    let bottomExtra = 0;
    let bottom = top + segments.length * rowH;
    if (net) {
      const yy = bottom + 22;
      node('line', { x1: 0, x2: W, y1: bottom + 4, y2: bottom + 4, style: 'stroke: var(--line); stroke-width: 1; vector-effect: non-scaling-stroke' }, host);
      node('text', { class: 't-small', x: 0, y: yy, 'dominant-baseline': 'central', text: net, style: 'fill: var(--fg); font-weight: 650' }, host);
      const toX = (v) => cx + (clamp(v, domain[0], domain[1]) / Math.max(Math.abs(domain[0]), Math.abs(domain[1]))) * half;
      // zone labels: one row when they fit, else alternate two rows (never overlapping)
      const capsW = (t) => t.length * 7.4 + 6;
      const centers = zones.map((z) => (toX(z.from) + toX(z.to)) / 2);
      const crowded = zones.some((z, k) => k && centers[k] - centers[k - 1] < (capsW(z.label) + capsW(zones[k - 1].label)) / 2);
      zones.forEach((z, k) => {
        const zx0 = toX(z.from), zx1 = toX(z.to);
        node('rect', { x: zx0, y: yy - 8, width: Math.max(0, zx1 - zx0), height: 16, style: `fill: var(--fg); fill-opacity: ${k % 2 ? 0.06 : 0.11}` }, host);
        const row = crowded && k % 2 ? 1 : 0;
        if (row) node('line', { x1: centers[k], x2: centers[k], y1: yy + 9, y2: yy + 26, style: 'stroke: var(--line); stroke-width: 1; vector-effect: non-scaling-stroke' }, host);
        node('text', { class: 't-caps t-mid', x: centers[k], y: yy + 22 + row * 15, 'text-anchor': 'middle', text: z.label, style: 'fill: var(--fg-3)' }, host);
      });
      if (crowded) bottomExtra = 15;
      const bar = node('rect', { x: cx, y: yy - 4, width: 0, height: 8, rx: 2, style: `fill: ${toneColor}; fill-opacity: 0.95` }, host);
      const needle = node('g', { transform: `translate(${f(cx)} ${f(yy)})` }, host);
      node('path', { d: 'M0 -12V12', style: 'stroke: var(--fg); stroke-width: 2.4; stroke-linecap: round' }, needle);
      node('path', { d: 'M-5 -16L5 -16L0 -10Z', style: 'fill: var(--fg)' }, needle);
      const zoneLabels = [...host.querySelectorAll('text.t-caps.t-mid')];
      netParts = { bar, needle, yy, toX, zoneLabels };
      bottom = yy + 32 + bottomExtra;
    }
    H = bottom;
    parts.render = (st) => {
      rows.forEach((r) => {
        const v = clamp01(st.v[r.s.id] ?? 0) * half;
        if (r.s.sign === '-') { r.bar.setAttribute('x', f(cx - v)); r.bar.setAttribute('width', f(v)); }
        else { r.bar.setAttribute('x', f(cx)); r.bar.setAttribute('width', f(v)); }
      });
      if (netParts) {
        const nx = netParts.toX(st.net);
        netParts.bar.setAttribute('x', f(Math.min(cx, nx)));
        netParts.bar.setAttribute('width', f(Math.abs(nx - cx)));
        netParts.bar.style.fill = st.net < 0 ? COLOR['-'] : toneColor;
        netParts.needle.setAttribute('transform', `translate(${f(nx)} ${f(netParts.yy)})`);
        zones.forEach((z, k) => {
          const on = st.net >= z.from && st.net <= z.to;
          const lab = netParts.zoneLabels[k];
          if (lab) lab.setAttribute('style', `fill: ${on ? 'var(--fg)' : 'var(--fg-3)'}`);
        });
      }
    };
  }

  // ------------------------------------------------------------------ ledger, vertical
  if (mode === 'ledger' && orient === 'v') {
    const colW = 58;
    const n = segments.length + (net ? 1 : 0);
    W = opts.width ?? n * colW;
    header(W);
    const h = 120, base = top + 18 + h / 2;
    const cw = W / n;
    node('line', { x1: 0, x2: W, y1: base, y2: base, style: 'stroke: var(--fg-3); stroke-width: 1; vector-effect: non-scaling-stroke' }, host);
    const cols = segments.map((s, i) => {
      const cx = cw * (i + 0.5);
      node('line', { x1: cx, x2: cx, y1: base - h / 2, y2: base + h / 2, style: 'stroke: var(--line); stroke-width: 1; vector-effect: non-scaling-stroke' }, host);
      const bar = node('rect', { x: cx - 9, y: base, width: 18, height: 0, rx: 3, style: `fill: ${COLOR[s.sign ?? null]}; fill-opacity: 0.9` }, host);
      signDisc(host, s.sign ?? null, { x: cx, y: base + h / 2 + 14, r: 7.5 });
      node('text', { class: 't-small t-mid', x: cx, y: base + h / 2 + 36, 'text-anchor': 'middle', text: s.label, style: 'fill: var(--fg)' }, host);
      return { s, bar, cx };
    });
    let netBar = null;
    if (net) {
      const cx = cw * (segments.length + 0.5);
      netBar = node('rect', { x: cx - 11, y: base, width: 22, height: 0, rx: 3, style: `fill: ${toneColor}; fill-opacity: 0.95` }, host);
      node('text', { class: 't-small t-mid', x: cx, y: base + h / 2 + 36, 'text-anchor': 'middle', text: net, style: 'fill: var(--fg); font-weight: 650' }, host);
    }
    H = base + h / 2 + 48;
    parts.render = (st) => {
      cols.forEach((c) => {
        const v = clamp01(st.v[c.s.id] ?? 0) * (h / 2);
        if (c.s.sign === '-') { c.bar.setAttribute('y', f(base)); c.bar.setAttribute('height', f(v)); }
        else { c.bar.setAttribute('y', f(base - v)); c.bar.setAttribute('height', f(v)); }
      });
      if (netBar) {
        const v = clamp(st.net, -1, 1) * (h / 2);
        netBar.setAttribute('y', f(v >= 0 ? base - v : base));
        netBar.setAttribute('height', f(Math.abs(v)));
        netBar.style.fill = v < 0 ? COLOR['-'] : toneColor;
      }
    };
  }

  // ------------------------------------------------------------------ gauge
  if (mode === 'gauge') {
    W = opts.width ?? 220;
    header(W);
    const R = W * 0.36, cx = W / 2, cy = top + 30 + R;
    const toA = (v) => 180 + ((clamp(v, domain[0], domain[1]) - domain[0]) / (domain[1] - domain[0])) * 180;
    const arc = (a0, a1, r) => {
      const p0 = [cx + Math.cos(a0 * DEG) * r, cy + Math.sin(a0 * DEG) * r];
      const p1 = [cx + Math.cos(a1 * DEG) * r, cy + Math.sin(a1 * DEG) * r];
      return `M${f(p0[0])} ${f(p0[1])}A${f(r)} ${f(r)} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${f(p1[0])} ${f(p1[1])}`;
    };
    // empty: a faint band between two hairlines (the gauge's version of the segment track)
    node('path', { d: arc(180, 360, R), style: 'fill: none; stroke: var(--fg); stroke-opacity: 0.05; stroke-width: 14; stroke-linecap: butt' }, host);
    for (const rr of [R - 7, R + 7]) node('path', { d: arc(180, 360, rr), style: 'fill: none; stroke: var(--fg-3); stroke-opacity: 0.6; stroke-width: 1; vector-effect: non-scaling-stroke' }, host);
    const zl = zones.map((z, k) => {
      const a0 = toA(z.from), a1 = toA(z.to);
      if (k) {
        const t = [cx + Math.cos(a0 * DEG) * (R - 9), cy + Math.sin(a0 * DEG) * (R - 9), cx + Math.cos(a0 * DEG) * (R + 9), cy + Math.sin(a0 * DEG) * (R + 9)];
        node('line', { x1: t[0], y1: t[1], x2: t[2], y2: t[3], style: 'stroke: var(--fg-3); stroke-width: 1.2' }, host);
      }
      const am = (a0 + a1) / 2;
      const lx = cx + Math.cos(am * DEG) * (R + 22), ly = cy + Math.sin(am * DEG) * (R + 22);
      const anchor = Math.cos(am * DEG) < -0.35 ? 'end' : Math.cos(am * DEG) > 0.35 ? 'start' : 'middle';
      return node('text', { class: 't-caps', x: lx, y: ly, 'text-anchor': anchor, 'dominant-baseline': 'central', text: z.label, style: 'fill: var(--fg-3)' }, host);
    });
    const fill = node('path', { d: arc(180, 180.01, R), style: `fill: none; stroke: ${toneColor}; stroke-opacity: 0.95; stroke-width: 14` }, host);
    const needle = node('g', { transform: `translate(${f(cx)} ${f(cy)}) rotate(180)` }, host);
    node('path', { d: `M0 -2.6L${f(R * 0.86)} 0L0 2.6Z`, style: 'fill: var(--fg)' }, needle);
    node('circle', { cx, cy, r: 6, style: 'fill: var(--fg); stroke: var(--halo); stroke-width: 2' }, host);
    let discs = 0;
    segments.forEach((s, i) => {
      const dx = cx + (i - (segments.length - 1) / 2) * 34;
      signDisc(host, s.sign ?? null, { x: dx, y: cy + 24, r: 8 });
      discs = 1;
    });
    H = cy + (discs ? 40 : 14);
    parts.render = (st) => {
      const a = toA(st.value);
      fill.setAttribute('d', arc(180, Math.max(180.01, a), R));
      needle.setAttribute('transform', `translate(${f(cx)} ${f(cy)}) rotate(${f(a)})`);
      zones.forEach((z, k) => {
        const on = st.value >= z.from && st.value <= z.to;
        zl[k].setAttribute('style', `fill: ${on ? 'var(--fg)' : 'var(--fg-3)'}`);
      });
    };
  }

  // ------------------------------------------------------------------ segments
  if (mode === 'segments') {
    const named = segments.length > 0;
    const n = named ? segments.length : count;
    const vertical = orient === 'v';
    W = opts.width ?? (vertical ? 70 : 260);
    header(W);
    const gapB = 4;
    const blocks = [];
    if (!vertical) {
      const bw = (W - gapB * (n - 1)) / n, bh = 14, by = top + (named ? 18 : 4);
      for (let i = 0; i < n; i++) {
        const bx = i * (bw + gapB);
        node('rect', { x: bx + 0.5, y: by + 0.5, width: Math.max(0, bw - 1), height: bh - 1, rx: 3, style: TRACK }, host);
        const fillR = node('rect', { x: bx, y: by, width: 0, height: bh, rx: 3, style: `fill: ${named ? COLOR[segments[i].sign ?? null] : toneColor}; fill-opacity: 0.95` }, host);
        if (named) {
          signDisc(host, segments[i].sign ?? null, { x: bx + 8, y: by - 10, r: 6.5 });
          node('text', { class: 't-small', x: bx, y: by + bh + 16, text: segments[i].label, style: 'fill: var(--fg)' }, host);
        }
        blocks.push({ r: fillR, x: bx, w: bw });
      }
      H = by + bh + (named ? 24 : 6);
      if (zones.length && !named) {
        zones.forEach((z) => node('text', { class: 't-caps', x: (z.from + z.to) / 2 * W, y: H + 12, 'text-anchor': 'middle', text: z.label, style: 'fill: var(--fg-3)' }, host));
        H += 20;
      }
    } else {
      const bh = 14, bw = Math.min(40, W - 20);
      for (let i = 0; i < n; i++) {
        const by = top + (n - 1 - i) * (bh + gapB);
        node('rect', { x: 0.5, y: by + 0.5, width: Math.max(0, bw - 1), height: bh - 1, rx: 3, style: TRACK }, host);
        const fillR = node('rect', { x: 0, y: by, width: 0, height: bh, rx: 3, style: `fill: ${named ? COLOR[segments[i].sign ?? null] : toneColor}; fill-opacity: 0.95` }, host);
        blocks.push({ r: fillR, x: 0, w: bw });
      }
      H = top + n * (bh + gapB);
    }
    parts.render = (st) => {
      blocks.forEach((b, i) => {
        const k = named ? clamp01(st.v[segments[i].id] ?? 0) : clamp01(((st.value - domain[0]) / (domain[1] - domain[0])) * n - i);
        b.r.setAttribute('width', f(b.w * k));
      });
    };
  }

  if (!parts.render) throw new Error(`meter: unknown mode "${mode}"`);
  if (!isSvg) {
    root.setAttribute('viewBox', `-2 -2 ${f(W + 4)} ${f(H + 4)}`);
    root.setAttribute('width', f(W + 4));
    root.setAttribute('height', f(H + 4));
  }

  // ------------------------------------------------------------------ values
  function normalize(values) {
    const next = { v: { ...plan.v }, net: plan.net, value: plan.value };
    if (values == null) return next;
    if (typeof values === 'number') { next.value = values; return next; }
    if ('value' in values) next.value = values.value;
    for (const s of segments) if (s.id in values) next.v[s.id] = clamp01(values[s.id]);
    next.net = 'net' in values ? values.net : segments.reduce((a, s) => a + (s.sign === '-' ? -1 : s.sign === '+' ? 1 : 0) * (next.v[s.id] || 0), 0);
    next.net = clamp(next.net, domain[0], domain[1]);
    return next;
  }
  const mixState = (A, B, t) => ({
    v: Object.fromEntries(Object.keys(B.v).map((k) => [k, lerp(A.v[k] || 0, B.v[k] || 0, t)])),
    net: lerp(A.net, B.net, t), value: lerp(A.value, B.value, t),
  });

  function set(values, { duration = 0.8, ease: ez = 'so.inOut', tl, pos } = {}) {
    const A = { v: { ...plan.v }, net: plan.net, value: plan.value };
    const B = normalize(values);
    Object.assign(plan, { v: B.v, net: B.net, value: B.value });
    const e = ease(ez);
    if (tl) {
      const sub = gsap.timeline();
      drive(sub, (p) => parts.render(mixState(A, B, e(p))), { duration, ease: 'none', pos: 0 });
      tl.add(sub, pos);
      return { start: sub.startTime(), end: sub.startTime() + sub.duration() };
    }
    if (reducedMotion() || !duration) { parts.render(B); return null; }
    const sub = gsap.timeline();
    drive(sub, (p) => parts.render(mixState(A, B, e(p))), { duration, ease: 'none', pos: 0 });
    return sub;
  }

  function describe() {
    const bits = [];
    if (mode === 'gauge' || (mode === 'segments' && !segments.length)) {
      const z = zones.find((q) => plan.value >= q.from && plan.value <= q.to);
      bits.push(`${title || 'Level'}: ${z ? z.label.toLowerCase() : WORD((plan.value - domain[0]) / (domain[1] - domain[0]))}.`);
    } else {
      for (const s of segments) {
        const w = WORD(plan.v[s.id] || 0);
        bits.push(`${s.label}: ${w}${w === 'none' ? '' : s.sign === '+' ? ' push' : s.sign === '-' ? ' pull' : ''}.`);
      }
      if (mode === 'ledger' && net) {
        const z = zones.find((q) => plan.net >= q.from && plan.net <= q.to);
        if (z) bits.push(`${net}: ${z.label.toLowerCase()}.`);
      }
    }
    return bits.join(' ');
  }

  if (values != null) { const B = normalize(values); Object.assign(plan, { v: B.v, net: B.net, value: B.value }); }
  parts.render(plan);

  return {
    el: root,
    get width() { return W; },
    get height() { return H; },
    set,
    get values() { return { ...plan.v, net: plan.net, value: plan.value }; },
    describe,
  };
}

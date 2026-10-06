// _kit-demo.js — dev-only sandbox for the P4 cell kit (loaded by /_kit-demo.html).
// Each demo builds one paused timeline; the seek test compares DOM snapshots taken in
// order with snapshots taken after backward / scrambled jumps.
import { gsap } from '../../../vendor/gsap/index.js';
import {
  tCell, cancerCell, healthyCell, nkCell, macrophage, placeOnMembrane, pd1, antibody, tissueField,
} from '../../art/index.js';
import * as CA from './cell-actions.js';
import { synapseScene } from './synapse.js';
import { meter } from './activity-meter.js';
import * as AG from './agents.js';

const NS = 'http://www.w3.org/2000/svg';
const grid = document.getElementById('grid');
const demos = [];

function card(title, code, { wide = false, viewBox = '0 0 640 360', aspect } = {}) {
  const wrap = document.createElement('figure');
  wrap.className = `demo fig${wide ? ' wide' : ''}`;
  wrap.innerHTML = `<h2>${title} <code>${code}</code></h2><div class="fig__stage" data-stage="dark"></div>
    <div class="bar"><button type="button">▶</button><input type="range" min="0" max="1000" value="0" aria-label="Scrub ${title}"><span class="res">…</span></div>`;
  grid.append(wrap);
  const stage = wrap.querySelector('.fig__stage');
  if (aspect) stage.style.setProperty('--fig-aspect', aspect);
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', viewBox);
  svg.setAttribute('class', 'fig__svg');
  stage.append(svg);
  return { wrap, stage, svg };
}

function demo(title, code, fn, opts) {
  const c = card(title, code, opts);
  const tl = gsap.timeline({ paused: true });
  fn(c.svg, tl, c);
  const range = c.wrap.querySelector('input');
  const btn = c.wrap.querySelector('button');
  const dur = () => tl.duration() || 1;
  tl.eventCallback('onUpdate', () => { range.value = String(Math.round((tl.time() / dur()) * 1000)); });
  range.addEventListener('input', () => { tl.pause(); tl.seek((range.value / 1000) * dur(), true); });
  btn.addEventListener('click', () => { if (tl.progress() >= 1) tl.seek(0, true); tl.paused() ? tl.play() : tl.pause(); });
  tl.progress(1, true).progress(0, true);
  demos.push({ title, tl, svg: c.svg, res: c.wrap.querySelector('.res') });
}

// ------------------------------------------------------------------ snapshot + seek test
function snapshot(root) {
  const out = [];
  const round = (v) => v.replace(/-?\d+\.\d+/g, (n) => String(Math.round(Number(n) * 10) / 10)).replace(/-0(?![.\d])/g, '0');
  const walk = (el, p) => {
    const attrs = [];
    for (const a of el.attributes) attrs.push(`${a.name}=${round(a.value)}`);
    if (el.style && el.style.cssText) attrs.push(`style=${round(el.style.cssText)}`);
    out.push(`${p}{${attrs.join(';')}}`);
    [...el.children].forEach((c, i) => walk(c, `${p}/${c.tagName}${i}`));
  };
  walk(root, 'svg');
  return out;
}
function seekTest(d) {
  const D = d.tl.duration();
  const times = Array.from({ length: 24 }, (_, i) => (i / 23) * D);
  const ref = times.map((t) => { d.tl.seek(t, true); return snapshot(d.svg); });
  const order = [23, 0, 12, 5, 19, 2, 22, 9, 16, 1, 11, 20, 7, 14, 3, 18, 6, 23, 10, 0, 15, 8, 21, 4, 13, 17];
  let bad = 0, first = '';
  let prevT = null;
  for (const i of order) {
    d.tl.seek(times[i], true);
    const s = snapshot(d.svg);
    const r = ref[i];
    const pT = prevT; prevT = times[i];
    const n = Math.max(s.length, r.length);
    for (let k = 0; k < n; k++) {
      if (s[k] !== r[k]) { bad++; if (!first) { const a = r[k] || '∅', b = s[k] || '∅'; let j = 0; while (j < a.length && a[j] === b[j]) j++; first = `t=${times[i].toFixed(2)} (from ${(pT ?? 0).toFixed(2)}): ${a.slice(0, a.indexOf('{') + 1)}… ${a.slice(Math.max(0, j - 30), j + 60)} ≠ ${b.slice(Math.max(0, j - 30), j + 60)}`; } break; }
    }
  }
  d.tl.seek(0, true);
  return { ok: !bad, bad, first, n: order.length };
}

// ------------------------------------------------------------------ scenes
const st = 'dark';
const bg = (svg, seed = 3) => svg.append(tissueField({ width: 640, height: 360, seed, stage: st, density: 0.6 }));
const killerArt = (seed = 3, r = 30, extra = {}) => tCell({ variant: 'cd8', r, state: 'activated', seed, stage: st, ...extra });

demo('approach · probe', 'approach(tl, a, b) · probe(tl, a, c)', (svg, tl) => {
  bg(svg, 1);
  const b1 = CA.rig(healthyCell({ r: 42, seed: 4, mhc: 8, stage: st }), { x: 220, y: 110, parent: svg });
  const b2 = CA.rig(healthyCell({ r: 40, seed: 9, mhc: 8, stage: st }), { x: 330, y: 270, parent: svg });
  const tg = CA.rig(cancerCell({ r: 54, seed: 5, stage: st }), { x: 520, y: 170, parent: svg });
  const k = CA.rig(killerArt(), { x: 50, y: 210, parent: svg });
  CA.probe(tl, k, b1, { hold: 0.5 });
  CA.probe(tl, k, b2, { hold: 0.5 });
  CA.approach(tl, k, tg, { via: [[420, 250]] });
  CA.recognize(tl, k, tg);
});

demo('dock · recognize', 'dock(tl, k, t, { seal: true }) · recognize(tl, k)', (svg, tl) => {
  bg(svg, 2);
  const tg = CA.rig(cancerCell({ r: 70, seed: 8, stage: st }), { x: 410, y: 180, parent: svg });
  const k = CA.rig(killerArt(4, 34), { x: 120, y: 190, parent: svg });
  CA.approach(tl, k, tg, { gap: 6 });
  CA.recognize(tl, k, tg);
  CA.dock(tl, k, tg, { seal: true });
});

demo('unpolarize · polarize', 'unpolarize(k) · polarize(tl, k, target)', (svg, tl) => {
  bg(svg, 3);
  const tg = CA.rig(cancerCell({ r: 66, seed: 2, stage: st }), { x: 420, y: 180, parent: svg });
  const k = CA.rig(killerArt(6, 52), { x: 200, y: 180, parent: svg });
  CA.unpolarize(k, { angle: 180 });
  CA.dock(tl, k, tg, { seal: true });
  CA.polarize(tl, k, tg);
});

demo('kill (cell scale)', 'kill(tl, killer, target)', (svg, tl) => {
  bg(svg, 4);
  const tg = CA.rig(cancerCell({ r: 62, seed: 11, stage: st }), { x: 410, y: 180, parent: svg });
  const k = CA.rig(killerArt(7, 32), { x: 120, y: 190, parent: svg });
  CA.unpolarize(k);
  CA.approach(tl, k, tg);
  CA.recognize(tl, k, tg);
  CA.kill(tl, k, tg);
});

demo('kill · NK, perforin puff', 'kill(tl, nk, target, { perforin: true })', (svg, tl) => {
  bg(svg, 5);
  const tg = CA.rig(healthyCell({ r: 70, seed: 3, state: 'infected', stage: st }), { x: 420, y: 180, parent: svg });
  const k = CA.rig(nkCell({ r: 46, state: 'activated', seed: 5, stage: st }), { x: 150, y: 180, parent: svg });
  CA.approach(tl, k, tg);
  CA.kill(tl, k, tg, { perforin: true, seal: true });
});

demo('die · clearUp', 'die(tl, cell) · clearUp(tl, macrophage, dead)', (svg, tl) => {
  bg(svg, 6);
  const dead = CA.rig(cancerCell({ r: 56, seed: 12, stage: st }), { x: 250, y: 170, parent: svg });
  const mac = CA.rig(macrophage({ r: 78, seed: 4, stage: st }), { x: 560, y: 280, parent: svg });
  CA.die(tl, dead, { duration: 2.4 });
  CA.clearUp(tl, mac, dead);
});

demo('divide ×2 ×2', 'divide(tl, cell, 2) → daughters', (svg, tl) => {
  bg(svg, 7);
  const c = CA.rig(tCell({ variant: 'cd8', r: 26, state: 'activated', seed: 9, stage: st, tcrKey: 7 }), { x: 320, y: 180, parent: svg });
  const [a, b] = CA.divide(tl, c, 2, { angle: 0, spread: 70 });
  CA.divide(tl, a, 2, { angle: 90, spread: 50, pos: '-=0.2' });
  CA.divide(tl, b, 2, { angle: 90, spread: 50, pos: '<' });
});

demo('swap (state crossfade)', 'swap(tl, rig, next)', (svg, tl) => {
  bg(svg, 8);
  const k = CA.rig(tCell({ variant: 'cd8', r: 40, state: 'resting', seed: 5, stage: st }), { x: 200, y: 180, parent: svg });
  CA.swap(tl, k, tCell({ variant: 'cd8', r: 40, state: 'activated', seed: 5, stage: st }), { duration: 1.2 });
  CA.move(tl, k, { x: 460, y: 180 });
});

demo('dockAntibody', 'dockAntibody(tl, ab, pd1Glyph)', (svg, tl) => {
  bg(svg, 9);
  const art = tCell({ variant: 'cd8', r: 60, seed: 3, stage: st, receptors: false });
  const glyphs = placeOnMembrane(art, (o) => pd1({ ...o, icon: false }), { count: 7, size: 24, seed: 3 });
  const k = CA.rig(art, { x: 300, y: 190, parent: svg });
  const fx = CA.fxLayer(svg);
  glyphs.slice(0, 3).forEach((g, i) => {
    const ab = antibody({ variant: 'therapeutic', size: 26, stage: st });
    fx.append(ab);
    CA.dockAntibody(tl, ab, g, { pos: i * 0.35 });
  });
  CA.move(tl, k, { x: 330, y: 180, duration: 1 });
});

demo('emit (3 kinds)', "emit(tl, from, { kind: 'cytokine' | 'interferon' | 'danger' })", (svg, tl) => {
  bg(svg, 10);
  const a = CA.rig(tCell({ variant: 'cd4', r: 30, state: 'activated', seed: 2, stage: st, cytokines: false }), { x: 120, y: 180, parent: svg });
  const b = CA.rig(tCell({ variant: 'cd8', r: 30, state: 'activated', seed: 2, stage: st }), { x: 320, y: 180, parent: svg });
  const c = CA.rig(cancerCell({ r: 40, seed: 6, stage: st }), { x: 520, y: 180, parent: svg });
  CA.emit(tl, a, { kind: 'cytokine', n: 12, r: 90 });
  CA.emit(tl, b, { kind: 'interferon', n: 10, r: 100, pos: 0.2 });
  CA.die(tl, c, { duration: 2, pos: 0 });
  CA.emit(tl, c, { kind: 'danger', n: 7, r: 80, pos: 1.2 });
});

demo('pulseAlong', "pulseAlong(tl, path, '+' | '-' | null)", (svg, tl) => {
  bg(svg, 11);
  const mk = (d) => { const p = document.createElementNS(NS, 'path'); p.setAttribute('d', d); p.setAttribute('class', 'leader'); p.setAttribute('fill', 'none'); svg.append(p); return p; };
  const p1 = mk('M60 100 C 200 40, 380 160, 580 90');
  const p2 = mk('M60 200 C 220 260, 400 140, 580 220');
  const p3 = mk('M60 300 L 580 300');
  CA.pulseAlong(tl, p1, '+', { duration: 1.6 });
  CA.pulseAlong(tl, p2, '-', { duration: 1.6, pos: 0.3 });
  CA.pulseAlong(tl, p3, null, { duration: 1.6, pos: 0.6 });
});

// ------------------------------------------------------------------ synapse
demo('synapse · checkpoint blockade', "synapseScene · engage · cap('pd1-pdl1', 'top')", (svg, tl) => {
  const syn = synapseScene(svg, { x: 320, y: 180, width: 600, size: 40, top: { color: 'cd8' }, bottom: { color: 'cancer' },
    pairs: [{ kind: 'tcr-mhc', n: 2, peptide: ['neo', 'self'] }, { kind: 'pd1-pdl1', n: 3 }] });
  syn.pulses(true);
  syn.engage('tcr-mhc', true, { tl });
  syn.engage('pd1-pdl1', true, { tl, pos: '+=0.3' });
  syn.cap('pd1-pdl1', 'top', {}, { tl, pos: '+=0.5' });
}, { wide: false });

demo('synapse · lens-scale kill', 'engage · deliver · admit · repair', (svg, tl) => {
  const syn = synapseScene(svg, { x: 320, y: 180, width: 640, size: 40, top: { color: 'cd8' }, bottom: { color: 'cancer' },
    pairs: [{ kind: 'lfa1-icam1', x: [-150, 150] }, { kind: 'tcr-mhc', x: [-96, -44, 104], peptide: ['self', 'neo', 'neo'], coreceptor: [null, 'cd8', null] }] });
  syn.engage('tcr-mhc', true, { tl });
  syn.engage('lfa1-icam1', true, { tl });
  syn.deliver({ tl, x: 30, pores: [12, 50] });
  syn.admit({ tl });
  syn.repair({ tl });
});

demo('synapse · CD28 / CTLA-4 / CAR', "engage('cd28-b7') · engage('ctla4-b7') · car-antigen", (svg, tl) => {
  const a = synapseScene(svg, { x: 170, y: 180, width: 300, size: 34, top: { color: 'cd8' }, bottom: { color: 'dc' },
    pairs: [{ kind: 'cd28-b7', n: 2 }, { kind: 'ctla4-b7', n: 2 }] });
  const b = synapseScene(svg, { x: 490, y: 180, width: 260, size: 30, top: { color: 'cd8' }, bottom: { color: 'cancer' },
    pairs: [{ kind: 'car-antigen', n: 3, antigen: { shape: 'diamond' } }] });
  a.engage('cd28-b7', true, { tl });
  b.engage('car-antigen', true, { tl, pos: '<' });
  a.engage('cd28-b7', false, { tl });
  a.engage('ctla4-b7', true, { tl, pos: '<' });
});

demo('synapse · shop window shuts', 'setDisplay(false) · setDisplay(true)', (svg, tl) => {
  const syn = synapseScene(svg, { x: 320, y: 180, width: 560, size: 40, top: { color: 'cd8' }, bottom: { color: 'cancer' },
    pairs: [{ kind: 'tcr-mhc', n: 4, peptide: ['neo', 'self', 'neo', 'self'] }] });
  syn.engage('tcr-mhc', true, { tl });
  syn.setDisplay(false, { tl, pos: '+=0.4' });
  syn.setDisplay(true, { tl, pos: '+=0.4' });
  syn.engage('tcr-mhc', true, { tl });
});

// ------------------------------------------------------------------ meters
demo('activity meters', "meter(svg, { mode: 'ledger' | 'gauge' | 'segments' }).set(values, { tl })", (svg, tl) => {
  const ledger = meter(svg, { mode: 'ledger', x: 24, y: 20, width: 280, title: 'T-cell activity',
    segments: [{ id: 'tcr', label: 'TCR signal', sign: '+' }, { id: 'cd28', label: 'CD28', sign: '+' }, { id: 'pd1', label: 'PD-1', sign: '-' }],
    zones: [{ from: -1, to: 0, label: 'Off' }, { from: 0, to: 0.45, label: 'Held back' }, { from: 0.45, to: 1, label: 'Attack' }],
    values: { tcr: 0, cd28: 0, pd1: 0 } });
  const gauge = meter(svg, { mode: 'gauge', x: 380, y: 14, width: 210, title: 'Outcome', tag: null,
    zones: [{ from: 0, to: 0.33, label: 'Quiet' }, { from: 0.33, to: 0.66, label: 'Dampened' }, { from: 0.66, to: 1, label: 'Killing' }], values: 0.1 });
  const segs = meter(svg, { mode: 'segments', x: 380, y: 236, width: 210, count: 5, title: 'Persistence', tag: null, values: 0.2 });
  ledger.set({ tcr: 0.8, cd28: 0.5, pd1: 0 }, { tl });
  gauge.set(0.85, { tl, pos: '<' });
  segs.set(0.9, { tl, pos: '<' });
  ledger.set({ tcr: 0.8, cd28: 0.5, pd1: 0.9 }, { tl, pos: '+=0.3' });
  gauge.set(0.45, { tl, pos: '<' });
  segs.set(0.4, { tl, pos: '<' });
});

demo('activity meter · vertical ledger', "meter(svg, { mode: 'ledger', orient: 'v' })", (svg, tl) => {
  const m = meter(svg, { mode: 'ledger', orient: 'v', x: 150, y: 24, width: 340, title: 'Signals',
    segments: [{ id: 'tcr', label: 'TCR', sign: '+' }, { id: 'cd28', label: 'CD28', sign: '+' }, { id: 'ctla4', label: 'CTLA-4', sign: '-' }, { id: 'pd1', label: 'PD-1', sign: '-' }],
    values: { tcr: 0.2, cd28: 0.1 } });
  m.set({ tcr: 0.9, cd28: 0.7, ctla4: 0.1, pd1: 0.2 }, { tl });
  m.set({ tcr: 0.9, cd28: 0.2, ctla4: 0.8, pd1: 0.6 }, { tl, pos: '+=0.3' });
});

// ------------------------------------------------------------------ agents (canvas)
(async () => {
  const c = card('agents · crowd kit', 'walk · relax · rateToP · killSpecks · divisionPinch · contactRing', { wide: true, aspect: '21 / 9' });
  const canvas = document.createElement('canvas');
  canvas.className = 'fig__canvas';
  c.svg.replaceWith(canvas);
  const W = 1180, H = 506;
  const dpr = Math.min(2, devicePixelRatio || 1);
  canvas.width = W * dpr; canvas.height = H * dpr;
  const g = canvas.getContext('2d');
  g.setTransform(dpr * canvas.clientWidth / W || dpr, 0, 0, dpr * canvas.clientWidth / W || dpr, 0, 0);
  const sheet = await AG.spriteStates({ t: ['tCell', { variant: 'cd8', r: 10, state: 'activated' }], c: ['cancerCell', { r: 15 }] }, { seeds: 3 });
  const sim = (seed) => {
    const R = AG.rng(seed);
    const cells = [];
    for (let i = 0; i < 26; i++) cells.push({ id: i, x: R.range(30, W - 30), y: R.range(30, H - 30), r: 11, state: 't', variant: i, rng: AG.rng(seed * 100 + i), speed: 46 });
    for (let i = 0; i < 70; i++) cells.push({ id: 100 + i, x: R.range(560, W - 40), y: R.range(40, H - 40), r: 16, state: 'c', variant: i, rng: AG.rng(seed * 300 + i), speed: 4 });
    const fx = AG.createEffects();
    const hash = AG.spatialHash(36);
    const near = [];
    let t = 0;
    const step = (dt) => {
      t += dt;
      for (const a of cells) if (!a.dead && !a.dying) AG.walk(a, dt, { bounds: { x0: 0, y0: 0, x1: W, y1: H }, bias: a.state === 't' ? { x: 860, y: H / 2, strength: 0.25 } : null });
      hash.build(cells.filter((a) => !a.dead));
      AG.relax(cells.filter((a) => !a.dead && !a.dying), { hash });
      for (const k of cells) {
        if (k.state !== 't' || k.dead) continue;
        for (const v of hash.near(k.x, k.y, 30, near)) {
          if (v.state === 'c' && !v.dying && !v.dead && k.rng() < AG.rateToP(0.6, dt)) { AG.contactRing(fx, (k.x + v.x) / 2, (k.y + v.y) / 2, { color: '#4C8DFF' }); AG.killSpecks(fx, v, { color: '#B65FD8' }); }
        }
        if (!k.pinch && k.rng() < AG.rateToP(0.03, dt) && cells.length < 140) AG.divisionPinch(fx, k, { onSplit: (a, ang, at) => cells.push({ ...a, id: 1000 + cells.length, x: at.x, y: at.y, pinch: null, rng: AG.rng(a.id * 7 + cells.length) }) });
      }
      fx.step(dt);
    };
    return { cells, fx, step: AG.fixedStep(step), get t() { return t; } };
  };
  // determinism: two runs with the same seed must agree after 600 steps
  const A = sim(5), B = sim(5);
  for (let i = 0; i < 600; i++) { A.step(1 / 60); B.step(1 / 60); }
  const same = A.cells.length === B.cells.length && A.cells.every((a, i) => Math.abs(a.x - B.cells[i].x) < 1e-9 && Math.abs(a.y - B.cells[i].y) < 1e-9 && !!a.dead === !!B.cells[i].dead);
  const res = c.wrap.querySelector('.res');
  res.textContent = same ? 'deterministic ✓' : 'deterministic ✕';
  res.className = `res ${same ? 'ok' : 'bad'}`;
  const S = sim(5);
  let playing = !matchMedia('(prefers-reduced-motion: reduce)').matches;
  let last = 0;
  const draw = () => {
    g.setTransform(dpr * (canvas.clientWidth / W), 0, 0, dpr * (canvas.clientWidth / W), 0, 0);
    g.clearRect(0, 0, W, H);
    for (const a of S.cells) if (!a.dead) sheet.draw(g, a);
    S.fx.draw(g);
  };
  const frame = (now) => { const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60; last = now; if (playing) S.step(dt); draw(); requestAnimationFrame(frame); };
  for (let i = 0; i < 90; i++) S.step(1 / 60);
  requestAnimationFrame(frame);
  const btn = c.wrap.querySelector('button');
  btn.textContent = playing ? '❚❚' : '▶';
  btn.addEventListener('click', () => { playing = !playing; btn.textContent = playing ? '❚❚' : '▶'; });
  c.wrap.querySelector('input').remove();
  window.__agents = { same, count: () => S.cells.filter((a) => !a.dead).length };
})();

// ------------------------------------------------------------------ run the seek test
requestAnimationFrame(() => {
  let fails = 0;
  for (const d of demos) {
    const r = seekTest(d);
    d.result = r;
    d.res.textContent = r.ok ? `seek ✓ ${d.tl.duration().toFixed(1)} s` : `seek ✕ ${r.bad}/${r.n}`;
    d.res.className = `res ${r.ok ? 'ok' : 'bad'}`;
    if (!r.ok) { fails++; console.warn(`[kit-demo] ${d.title}: ${r.first}`); }
  }
  document.getElementById('summary').textContent = fails ? `Seek test: ${fails} of ${demos.length} demos disagree (see console).` : `Seek test: all ${demos.length} demos agree.`;
  window.__kit = { demos: demos.map((d) => ({ title: d.title, duration: d.tl.duration(), ...d.result })), seek(i, p) { demos[i].tl.progress(p, true); }, seekAll(p) { demos.forEach((d) => d.tl.progress(p, true)); } };
});

// demo-sim — reference implementation of a CANVAS SIMULATION figure.
// "Following the alarm": ~200 immune cells crawl at random; an infection site
// releases a chemical signal (a chemokine) and the cells' random turns become
// slightly biased toward it. A slider sets the signal strength.
//
// Copy this file when building a simulation. It shows:
//   • ctx.canvas() — a DPR-aware (≤ 2×) canvas that tracks the stage size
//   • ctx.loop()   — a rAF loop that pauses itself off-screen / in hidden tabs
//                    and does not autoplay under prefers-reduced-motion
//   • state kept in normalized units, so resizing never scrambles the scene
//   • a compact (portrait) layout chosen in ctx.onResize, not a shrunken one
//   • controls from ctx.ui: playPause (bound to the loop), slider, button, stat, legend
//   • stage HUD: ctx.ui.clock for simulated time, ctx.tag('Illustrative' / 'Time compressed')
//   • art-library sprites (assets/js/art/sprites.js): real crawling neutrophils,
//     rasterized once, drawn 200× per frame and rotated to their heading
//
// Science note (for builders): real chemotaxis works like this — a neutrophil
// can't "see" the source; it senses a slightly higher concentration on one side
// and turns that way more often. The model below is a biased persistent random
// walk, which captures that behaviour qualitatively (not quantitatively).

import { preloadSprites, drawSprite } from '../art/index.js';

const COUNT = 200;
const SITE_R = 0.07;          // radius of the infection site (fraction of the short side)

export default async function mount(fig, ctx) {
  const c = ctx.colors;
  const rng = ctx.random(7);   // seeded: the first frame looks the same on every load

  ctx.setAspect(16 / 9, 4 / 5);
  const cv = ctx.canvas();
  const g = cv.g;

  // ---------------------------------------------------------------- state
  // Positions are normalized (0..1 of the stage width/height).
  const cells = [];
  function seed() {
    cells.length = 0;
    for (let i = 0; i < COUNT; i++) {
      cells.push({
        x: rng(), y: rng(),
        heading: rng() * Math.PI * 2,
        speed: 0.6 + rng() * 0.8,     // individual personalities
        size: 0.8 + rng() * 0.4,
        phase: rng() * 10,
        tx: 0, ty: 0,                 // previous position, for the motion tail
        arrived: false,
      });
    }
    for (const p of cells) { p.tx = p.x; p.ty = p.y; }
  }
  seed();
  const bacteria = Array.from({ length: 14 }, () => ({ a: rng() * Math.PI * 2, r: Math.sqrt(rng()) * 0.8, rot: rng() * Math.PI, ph: rng() * 6 }));

  let strength = 0.6;           // 0..1 chemokine signal
  let layout = null;            // { sx, sy } source position (normalized) — set in onResize
  let time = 0;

  // ---------------------------------------------------------------- sprites
  // Cells come from the illustration library, rasterized once into bitmaps (a few
  // seeds per state for variety). Crawling neutrophils face +x, so drawing them
  // rotated by their heading makes each one lead with its front edge.
  let sprites = null;
  async function buildSprites() {
    const seeds = [1, 2, 3, 4];
    const imgs = await preloadSprites([
      ...seeds.map((seed) => ['neutrophil', { r: 8, state: 'crawling', polarity: 0, seed, stage: 'dark', detail: 'low' }]),
      ...seeds.map((seed) => ['neutrophil', { r: 9, state: 'activated', seed, stage: 'dark', detail: 'low' }]),
      ...[1, 2, 3].map((seed) => ['bacterium', { r: 7, angle: 0, seed, stage: 'dark' }]),
    ]);
    sprites = { crawling: imgs.slice(0, 4), arrived: imgs.slice(4, 8), bact: imgs.slice(8) };
  }
  await buildSprites();        // mount may be async: the loader waits for it

  // ---------------------------------------------------------------- simulation
  function step(dt) {
    time += dt;
    const { width: w, height: h } = cv;
    const short = Math.min(w, h);
    const sx = layout.sx * w;
    const sy = layout.sy * h;
    const siteR = SITE_R * short;
    const range = 0.55 * Math.max(w, h);                 // how far the signal reaches
    const v = 0.11 * short;                              // crawling speed, px/s
    for (const p of cells) {
      p.tx = p.x; p.ty = p.y;
      const x = p.x * w; const y = p.y * h;
      const dx = sx - x; const dy = sy - y;
      const d = Math.hypot(dx, dy) || 1;
      // Persistent random walk: the heading wanders...
      p.heading += rng.gauss() * 2.4 * Math.sqrt(dt);
      // ...and turns toward the source a little more often where the signal is stronger.
      const felt = strength / (1 + (d / range) ** 2);
      const toward = Math.atan2(dy, dx);
      p.heading += Math.sin(toward - p.heading) * felt * 3.2 * dt;
      // Cells that reach the site slow down and mill around it.
      p.arrived = d < siteR * 1.9;
      const spd = v * p.speed * (p.arrived ? 0.25 : 1) * (0.75 + 0.25 * Math.sin(time * 2 + p.phase));
      let nx = x + Math.cos(p.heading) * spd * dt;
      let ny = y + Math.sin(p.heading) * spd * dt;
      // Soft walls: reflect the heading.
      if (nx < 4 || nx > w - 4) { p.heading = Math.PI - p.heading; nx = Math.min(w - 4, Math.max(4, nx)); }
      if (ny < 4 || ny > h - 4) { p.heading = -p.heading; ny = Math.min(h - 4, Math.max(4, ny)); }
      // Don't pile into the site's center.
      if (d < siteR * 0.9) { nx -= (dx / d) * 0.6; ny -= (dy / d) * 0.6; }
      p.x = nx / w; p.y = ny / h;
    }
  }

  // ---------------------------------------------------------------- render
  function render() {
    if (!sprites) return;
    const { width: w, height: h } = cv;
    const short = Math.min(w, h);
    const sx = layout.sx * w;
    const sy = layout.sy * h;
    const siteR = SITE_R * short;
    cv.clear();

    // Chemokine field: a soft coral glow and slow rings, both scaled by strength.
    if (strength > 0) {
      const field = g.createRadialGradient(sx, sy, siteR * 0.5, sx, sy, Math.max(w, h) * 0.6);
      field.addColorStop(0, ctx.alpha(c.macrophage, 0.22 * strength));
      field.addColorStop(0.35, ctx.alpha(c.macrophage, 0.07 * strength));
      field.addColorStop(1, ctx.alpha(c.macrophage, 0));
      g.fillStyle = field;
      g.fillRect(0, 0, w, h);
      g.lineWidth = 1;
      for (let k = 0; k < 3; k++) {
        const t = ((time * 0.12 + k / 3) % 1);
        g.strokeStyle = ctx.alpha(c.macrophage, 0.28 * strength * (1 - t));
        g.beginPath();
        g.arc(sx, sy, siteR + t * short * 0.55, 0, Math.PI * 2);
        g.stroke();
      }
    }

    // Infection site: a cluster of bacteria (art sprites).
    bacteria.forEach((b, i) => {
      const bx = sx + Math.cos(b.a) * b.r * siteR + Math.sin(time * 1.3 + b.ph) * 1.2;
      const by = sy + Math.sin(b.a) * b.r * siteR + Math.cos(time * 1.1 + b.ph) * 1.2;
      drawSprite(g, sprites.bact[i % sprites.bact.length], bx, by, { rotation: b.rot + Math.sin(time * 0.8 + b.ph) * 0.2 });
    });

    // Cells: short motion tail + glowing body.
    g.lineCap = 'round';
    g.lineWidth = 1.5;
    g.strokeStyle = ctx.alpha(c.neutrophil, 0.28);
    g.beginPath();
    for (const p of cells) {
      g.moveTo(p.tx * w, p.ty * h);
      g.lineTo(p.x * w - (p.x - p.tx) * w * 6, p.y * h - (p.y - p.ty) * h * 6);
    }
    g.stroke();
    cells.forEach((p, i) => {
      const set = p.arrived ? sprites.arrived : sprites.crawling;
      drawSprite(g, set[i % set.length], p.x * w, p.y * h, { rotation: p.heading, scale: p.size });
    });

    // In-canvas label (≥ 13px). Canvas text uses the page's Inter.
    g.font = '600 13px Inter, system-ui, sans-serif';
    g.textAlign = 'center';
    g.fillStyle = c.fg;
    g.shadowColor = c.stageA;
    g.shadowBlur = 6;
    g.fillText('Infection site', sx, sy + siteR * 1.9 + 16);
    g.shadowBlur = 0;

    const n = cells.reduce((k, p) => k + (p.arrived ? 1 : 0), 0);
    if (n !== lastCount) { lastCount = n; atSite.set(n); }
  }
  let lastCount = -1;

  // ---------------------------------------------------------------- controls
  // Stage HUD: simulated time (1 s on screen ≈ 1 min) and honesty tags (FIGURE-AUDIT §4 rules 16–17).
  const clock = ctx.ui.clock({ value: '0 min' });
  ctx.tag('Illustrative');
  ctx.tag('Time compressed');
  let minutes = 0;
  let shown = 0;

  const loop = ctx.loop((dt) => {
    step(dt);
    render();
    const m = Math.floor((minutes += dt));
    if (m !== shown) { shown = m; clock.set(`${m} min`); }
  });   // autoplays unless reduced motion; stops if the reader turns reduced motion on

  // Bound to the loop both ways: the button follows reduced-motion stops automatically.
  ctx.ui.playPause({ loop, onChange: (on) => ctx.announce(on ? 'Simulation running' : 'Simulation paused') });
  ctx.ui.button({
    label: 'Scatter', icon: 'reset', variant: 'ghost',
    onClick: () => { seed(); minutes = 0; shown = 0; clock.set('0 min'); render(); if (!loop.playing) ctx.announce('Cells scattered'); },
  });
  ctx.ui.slider({
    label: 'Signal strength',
    min: 0, max: 100, step: 1, value: strength * 100,
    format: (v) => (v === 0 ? 'Off' : `${v}%`),
    onInput: (v) => { strength = v / 100; if (!loop.playing) render(); },
  });
  ctx.ui.spacer();
  const atSite = ctx.ui.stat({ label: 'At the site', value: 0, unit: ` / ${COUNT}` });
  ctx.ui.legend([
    { label: 'Neutrophil (immune cell)', color: c.neutrophil, shape: 'glow' },
    { label: 'Bacteria', color: c.bacteria, shape: 'square' },
    { label: 'Chemokine signal', color: c.macrophage, shape: 'ring' },
  ]);

  // ---------------------------------------------------------------- layout
  // Landscape: source on the right. Portrait (phones): source near the bottom.
  ctx.onResize(({ compact }) => {
    layout = compact ? { sx: 0.5, sy: 0.8 } : { sx: 0.8, sy: 0.5 };
    render();                 // always show a correct frame, even when paused
  });
  ctx.onThemeChange(() => render());   // colors are read from CSS tokens

  return {
    // The loop already pauses itself off-screen; nothing else to clean up.
    destroy() { loop.pause(); },
  };
}

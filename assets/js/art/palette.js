// Self & Other — illustration library
// palette.js: canonical colors (PLAN §4) + derived tones for both stages.
//
// RULE: every entity keeps its canonical color everywhere on the site.
// Never invent a new hue for a cell type; use the factory or PALETTE[key].

/** Canonical entity colors — exact hexes from docs/PLAN.md §4. */
export const PALETTE = Object.freeze({
  healthy: '#E9C9A1',        // healthy body cell — sand
  cancer: '#B65FD8',         // cancer cell — violet-magenta
  cd8: '#4C8DFF',            // CD8 killer T cell — electric blue
  cd4: '#2EC4C9',            // CD4 helper T cell — teal
  treg: '#8C95C9',           // regulatory T cell — slate-lavender
  bCell: '#F2B33D',          // B cell / plasma cell / antibodies — amber-gold
  plasma: '#F2B33D',
  antibody: '#F2B33D',
  nk: '#FF8A3D',             // NK cell — orange
  m1: '#FF7A6B',             // macrophage M1 — coral
  m2: '#B7727E',             // macrophage M2 / TAM — dusky rose
  dendritic: '#4FD18B',      // dendritic cell — green
  neutrophil: '#F4A6C8',     // neutrophil — pale pink
  mdsc: '#A7A35A',           // MDSC — muted olive
  fibroblast: '#9C8F80',     // fibroblast / stroma — gray-beige
  bacteria: '#B5D94A',       // bacteria — chartreuse
  virus: '#FF4D5E',          // virus — red-coral
  mhc: '#D9DEEA',            // MHC molecule — pale silver
  selfPeptide: '#E9C9A1',    // self peptide — sand
  foreignPeptide: '#FF3D7F', // foreign / neo-peptide — hot pink
  inhibitory: '#E5484D',     // brakes — crimson (always pair with a minus/bar icon)
  activating: '#3DDC97',     // activating — green-cyan (always pair with plus/arrow)

  // Supplementary colors (not in the PLAN table; used for background & helper glyphs).
  // Keep them muted so they never compete with the canonical entities.
  rbc: '#C4505A',            // red blood cell (background in vessels)
  platelet: '#C9B6DA',       // platelet
  endothelium: '#C9A9A6',    // vessel wall cells
  lymph: '#9FC3D9',          // lymphatic / lymph node structures
  ecm: '#8E9BC0',            // extracellular-matrix fibers on the dark stage
  payload: '#E6F7FF',        // ADC payload ("warhead") — near-white spark
  linker: '#AEB7C8',         // ADC linker
  mouse: '#8FA3BF',          // mouse-derived antibody parts (humanization figure)
  b7: '#A8E6CF',             // B7 (CD80/86) costimulatory ligand — pale mint
  ligand: '#C9D3E8',         // generic ligand
  antigen: '#E3C8F5',        // generic tumor surface antigen (CD19, HER2…) — shape carries identity
  proteasome: '#B9C3D9',
  splinter: '#8A6A4F',
  danger: '#FFE6A6',         // danger signal spark (pale gold four-point star; never an antibody)
  mast: '#C9C2D6',           // mast cell body (pale lilac-gray)
  mastGranule: '#5B5FA8',    // mast cell granules (deep indigo; histamine)

  // Aliases matching the foundation's CSS tokens (--c-*) so either name works.
  macrophage: '#FF7A6B', tam: '#B7727E', dc: '#4FD18B', bcell: '#F2B33D', neoPeptide: '#FF3D7F',
  inhibit: '#E5484D', activate: '#3DDC97', drug: '#F2B33D',
});

/** Base-pair colors for DNA/RNA (always shown with letters too). */
export const BASES = Object.freeze({ A: '#6EC5FF', T: '#FFB454', U: '#FFB454', G: '#7EE081', C: '#FF7AA8' });

/** Stage (background) colors. */
export const STAGES = Object.freeze({
  dark: Object.freeze({
    bg: '#0B1024', bg2: '#131B36', ink: '#E9EDF7', ink2: '#AAB3CC', ink3: '#7480A0',
    line: '#C9D3F0', rule: '#2A3458', shadow: '#05070F',
  }),
  light: Object.freeze({
    bg: '#FAF7F2', bg2: '#FFFFFF', ink: '#1B1F2A', ink2: '#4A5163', ink3: '#7A8194',
    line: '#1B1F2A', rule: '#E6E0D6', shadow: '#1B1F2A',
  }),
});

export const WHITE = '#FFFFFF';

// ---------------------------------------------------------------- color math

const hexCache = new Map();
export function hexToRgb(hex) {
  let v = hexCache.get(hex);
  if (v) return v;
  let h = String(hex).trim().replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const num = parseInt(h.slice(0, 6), 16);
  v = [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  hexCache.set(hex, v);
  return v;
}

export function rgbToHex([r, g, b]) {
  const c = (x) => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, '0');
  return `#${c(r)}${c(g)}${c(b)}`.toUpperCase();
}

/** Mix color a toward color b by t (0 = a, 1 = b). */
export function mix(a, b, t) {
  const A = hexToRgb(resolve(a)), B = hexToRgb(resolve(b));
  return rgbToHex([A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t]);
}
export const lighten = (hex, t) => mix(hex, WHITE, t);
export const darken = (hex, t) => mix(hex, '#000000', t);

export function rgbToHsl([r, g, b]) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h /= 6;
  }
  return [h * 360, s, l];
}

export function hslToRgb([h, s, l]) {
  h = ((h % 360) + 360) % 360 / 360;
  if (s === 0) return [l * 255, l * 255, l * 255];
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const f = (t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  return [f(h + 1 / 3) * 255, f(h) * 255, f(h - 1 / 3) * 255];
}

/** Reduce saturation by t (0..1). */
export function desaturate(hex, t) {
  const [h, s, l] = rgbToHsl(hexToRgb(resolve(hex)));
  return rgbToHex(hslToRgb([h, s * (1 - t), l]));
}

// OKLab (perceptual) conversions — used to darken colors without turning warm hues muddy
// (as mixing with navy does) or pastels garish (as HSL darkening does).
const toLin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
const toSrgb = (c) => 255 * (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(Math.max(0, c), 1 / 2.4) - 0.055);
export function hexToOklab(hex) {
  const [R, G, B] = hexToRgb(resolve(hex)).map(toLin);
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
  const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
  const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}
export function oklabToHex([L, a, b]) {
  const l = Math.pow(L + 0.3963377774 * a + 0.2158037573 * b, 3);
  const m = Math.pow(L - 0.1055613458 * a - 0.0638541728 * b, 3);
  const s = Math.pow(L - 0.0894841775 * a - 1.291485548 * b, 3);
  return rgbToHex([
    toSrgb(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    toSrgb(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    toSrgb(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ]);
}

/**
 * Darken toward a neutral near-black (keeps hue; unlike mixing with the navy stage it does
 * not gray-out warm colors, and unlike HSL darkening it does not make pastels garish).
 */
export function shade(hex, t) {
  return mix(hex, '#08090E', t);
}

/** Rotate hue by `deg` degrees (for tumor sub-clones only — keep within ±25°). */
export function shiftHue(hex, d) {
  const [h, s, l] = rgbToHsl(hexToRgb(resolve(hex)));
  return rgbToHex(hslToRgb([h + d, s, l]));
}

/** Relative luminance (WCAG). */
export function luminance(hex) {
  const lin = (c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  const [r, g, b] = hexToRgb(resolve(hex));
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/** rgba() string, handy for one-off strokes. */
export function rgba(hex, a) {
  const [r, g, b] = hexToRgb(resolve(hex));
  return `rgba(${r},${g},${b},${a})`;
}

/** Accept a palette key ('cd8') or any hex ('#4C8DFF'). */
export function resolve(c) {
  if (!c) return '#888888';
  if (c[0] === '#') return c;
  return PALETTE[c] || c;
}

/**
 * Which art stage to use for a figure element: 'dark' on dark stages, and on light-stage
 * figures when the page theme is dark (light stages follow the page theme, so their
 * surface turns dark too). Re-render on ctx.onThemeChange for light-stage figures.
 */
export function stageFor(el) {
  const holder = el && el.closest ? el.closest('[data-stage]') : null;
  if (holder && holder.getAttribute('data-stage') === 'dark') return 'dark';
  if (typeof document === 'undefined') return 'light';
  const t = document.documentElement.getAttribute('data-theme');
  if (t === 'dark') return 'dark';
  if (t === 'light') return 'light';
  return typeof matchMedia !== 'undefined' && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function stageOf(stage) {
  return STAGES[stage === 'light' ? 'light' : 'dark'];
}

// ---------------------------------------------------------------- derived tones

const toneCache = new Map();

/**
 * Derived tones for drawing an entity of base color `color` on `stage`.
 * intensity: 1 = normal, >1 brighter (activated), <1 dimmer (exhausted, dying).
 * desat: 0..1 extra desaturation (exhausted, dying).
 *
 * Dark stage  → luminous: translucent gradient body, bright membrane rim, soft halo,
 *               dense darker nucleus.
 * Light stage → crisp illustration: pale tint fill, defined darker stroke, no halo.
 */
export function tones(color, stage = 'dark', { intensity = 1, desat = 0 } = {}) {
  const key = `${color}|${stage}|${intensity}|${desat}`;
  let t = toneCache.get(key);
  if (t) return t;
  let base = resolve(color);
  if (desat) base = desaturate(base, desat);
  const S = stageOf(stage);
  const k = Math.max(0.3, Math.min(1.6, intensity));

  if (stage === 'light') {
    const L = luminance(base);
    // very pale colors (sand, pink, silver) need a stronger tint to separate from paper
    const tint = L > 0.5 ? 0.62 : L > 0.3 ? 0.74 : 0.8;
    const inkMix = L > 0.5 ? 0.5 : 0.38;
    t = {
      stage: 'light', base,
      bodyIn: mix(base, WHITE, Math.min(0.92, tint + 0.12)),
      bodyMid: mix(base, WHITE, tint + 0.05),
      bodyOut: mix(base, WHITE, tint - 0.06 * k),
      bodyOpacity: 1,
      rim: mix(base, S.ink, inkMix - (k - 1) * 0.1),
      rimOpacity: 1,
      halo: base, haloOpacity: 0,
      sheen: WHITE, sheenOpacity: 0.5,
      nucIn: mix(base, WHITE, tint - 0.28),
      nucOut: mix(base, WHITE, tint - 0.4),
      nucRim: mix(base, S.ink, inkMix + 0.04),
      chromatin: mix(base, S.ink, 0.3), chromatinOpacity: 0.22,
      chromatinLight: WHITE, chromatinLightOpacity: 0.18,
      nucleolus: mix(base, S.ink, 0.42),
      granule: mix(base, S.ink, 0.3), granuleEdge: mix(base, WHITE, 0.4),
      fuzz: mix(base, S.ink, 0.28), fuzzOpacity: 0.6,
      detail: mix(base, S.ink, 0.4), detailOpacity: 0.45,
      glyphFill: mix(base, WHITE, 0.5), glyphStroke: mix(base, S.ink, 0.45),
      glyphLight: mix(base, WHITE, 0.75),
      glow: base, glowOpacity: 0,
      ink: S.ink,
    };
  } else {
    const bg = S.bg;
    const dk = (v) => Math.max(0, Math.min(1, v));
    const lift = (k - 1) * 0.5; // activated cells glow brighter
    t = {
      stage: 'dark', base,
      bodyIn: mix(shade(base, dk(0.56 - lift * 0.4)), bg, 0.32),
      bodyMid: mix(shade(base, dk(0.42 - lift * 0.4)), bg, 0.18),
      bodyOut: shade(base, dk(0.24 - lift * 0.3)),
      bodyOpacity: 0.93,
      rim: mix(base, WHITE, dk(0.3 + lift * 0.6)),
      rimOpacity: dk(0.92 * Math.min(1, k + 0.15)),
      halo: base, haloOpacity: dk(0.26 * k * k),
      sheen: mix(base, WHITE, 0.7), sheenOpacity: 0.14,
      nucIn: mix(shade(base, dk(0.66 - lift * 0.3)), bg, 0.42),
      nucOut: mix(shade(base, dk(0.56 - lift * 0.3)), bg, 0.3),
      nucRim: mix(base, bg, dk(0.25 - lift * 0.2)),
      chromatin: mix(shade(base, 0.8), bg, 0.5), chromatinOpacity: 0.5,
      chromatinLight: mix(base, WHITE, 0.15), chromatinLightOpacity: 0.16,
      nucleolus: mix(shade(base, 0.78), bg, 0.4),
      granule: mix(base, WHITE, dk(0.5 + lift * 0.6)), granuleEdge: shade(base, 0.55),
      fuzz: mix(base, WHITE, 0.25), fuzzOpacity: dk(0.55 * k),
      detail: mix(base, WHITE, 0.3), detailOpacity: 0.3,
      glyphFill: mix(shade(base, 0.5), bg, 0.2), glyphStroke: mix(base, WHITE, 0.22),
      glyphLight: mix(base, WHITE, 0.5),
      glow: base, glowOpacity: dk(0.5 * k),
      ink: S.ink,
    };
  }
  toneCache.set(key, t);
  return t;
}

/** Compact style for molecule glyphs. */
export function glyphTones(color, stage = 'dark', { emphasis = 0 } = {}) {
  const base = resolve(color);
  const S = stageOf(stage);
  if (stage === 'light') {
    const L = luminance(base);
    const inkMix = L > 0.55 ? 0.55 : L > 0.3 ? 0.45 : 0.3;
    return {
      base,
      fill: mix(base, WHITE, L > 0.55 ? 0.25 : 0.45),
      fill2: mix(base, WHITE, L > 0.55 ? 0.55 : 0.7),
      stroke: mix(base, S.ink, inkMix),
      dark: mix(base, S.ink, inkMix + 0.15),
      light: mix(base, WHITE, 0.8),
      glow: base, glowOpacity: 0,
    };
  }
  return {
    base,
    fill: mix(shade(base, 0.5 - emphasis * 0.25), S.bg, 0.15),
    fill2: mix(base, S.bg, 0.12),
    stroke: mix(base, WHITE, 0.25 + emphasis * 0.25),
    dark: mix(base, S.bg, 0.6),
    light: mix(base, WHITE, 0.55),
    glow: base, glowOpacity: 0.35 + emphasis * 0.2,
  };
}

/** Relative real-world diameters (T cell = 1) — use to keep scenes in scale. */
export const RELATIVE_SIZE = Object.freeze({
  tCell: 1, bCell: 1.05, plasmaCell: 1.5, nkCell: 1.2, neutrophil: 1.45, mdsc: 1.15,
  macrophage: 2.6, dendriticCell: 2.8, healthyCell: 1.9, cancerCell: 2.2,
  fibroblast: 3.2, redBloodCell: 1.05, platelet: 0.35, bacterium: 0.3, virus: 0.02,
});

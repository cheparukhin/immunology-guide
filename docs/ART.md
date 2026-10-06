# Self & Other — Illustration Library (`assets/js/art/`)

The shared, dependency-free library of cells, molecules, pathogens and scenes used by every
figure on the site. It produces **SVG DOM elements** (and cached bitmaps for canvas crowds) in
the "luminous microscope" style of PLAN §4.

* **Live gallery (dev only):** `art-gallery.html` at the repo root — every factory, every state,
  both stages, sizes, molecules on membranes, scenes, motion, sprites, plus a color-vision
  simulator. Each caption is the exact call that drew it. **Look there first.**
* Owner: the art agent. Figure builders consume; never fork or restyle the library inside a figure.
  If you need a new entity or state, request it (describe it precisely in your report).

### What's new (platform task P2 — FIGURE-AUDIT §3 art additions)
| # | Addition | Section |
|---|---|---|
| ① | `setDying(cell, p)` / `dyingState(cell)` — seekable, stepper-safe apoptosis (tween it with GSAP) | §9 |
| ② | `interferon()` — hollow ring in the sender's color; `cytokineCloud({ kind:'interferon' })` | §5 |
| ③ | `dangerSpark()` — pale-gold four-point star (DAMPs / alarm); `cytokineCloud({ kind:'danger' })` | §5 |
| ④ | `tcrKey()` / `epitopeKey()` / `keyChip()` — clone identity (46 seeded notches + 'triangle'·'star'·'diamond'); `tCell({ tcrKey })`, `tcr({ key })`, `mhc1({ key })` | §5b |
| ⑤ | `lymphNodeField()` — lymph-node interior (reticular mesh, T zone, follicles) | §8 |
| ⑥ | `mhc1({ pockets, anchors })` + `mhcGroove({ view, pockets, ridge, peptide })`, `anchorFits()`, `peptideFits()` | §5c |
| ⑦ | `vesicle({ kind:'endosome'|'lysosome'|'er' })`, `tapGate({ state })` | §5d |
| ⑧ | `mastCell({ release })` + `setDegranulation(cell, p)`; palette `mast`, `mastGranule` | §4 |
| ⑨ | `macrophage({ polarization: 0..1 })` — continuous fight ↔ repair morph | §4 |
| ⑩ | `bodyMap({ organs })` + `organIcon(name)` — gender-neutral silhouette, organ glyphs, anchors | §8b |
| + | `DOCK_GAP`, `HEAD_Y`, `antibodyTips()` — engaged-pair geometry for synapses and drug docking | §6 |

### What's new (task H — builder requests)
| Addition | Section |
|---|---|
| `setNecrotic(cell, p)` / `necrosisState(cell)` + `state: 'necrotic'` on `healthyCell` / `cancerCell` — messy, inflammatory death (swell → tear → spill + danger sparks), seekable | §9 |
| `setDying(cell, 0)` now resets fragment / body transforms too; virions, blebs and the Golgi fade with the dying cell | §9 |
| `pamp({ kind: 'lps'|'flagellin'|'dna'|'rna'|'atp'|'uricAcid' })` — pattern tokens (PAMPs / DAMPs) | §5 |
| `lfa1({ state })`, `icam1()`, `cd8()`, `cd4()` — adhesion and coreceptor glyphs; `DOCK_GAP['lfa1-icam1']` | §5 |
| `neutrophil({ state: 'crawling' })` redrawn: broad ruffled lamellipodium in front, round body, small uropod knob behind (no longer lemon-shaped) | §4 |
| `dendriticCell({ maturity: 0..1 })` — continuous maturation (processes lengthen and branch, MHC-II + B7 appear) | §4 |
| `bCell({ key })` — B-cell clones with keyed receptor tips | §4 / §5b |
| Hero kit for chapter vignettes: `docs/shared/hero-kit.md` | — |

---

## 1. Quick start

```js
// in assets/js/figures/chNN-something.js
import { tCell, cancerCell, placeOnMembrane, pd1, breathe, apoptosis, label } from '../art/index.js';

export default function mount(fig, ctx) {
  const svg = ctx.createSVG({ viewBox: '0 0 960 540' });

  const killer = tCell({ variant: 'cd8', r: 40, state: 'activated', polarity: 0, seed: 3 });
  killer.setAttribute('transform', 'translate(330 270)');

  const tumor = cancerCell({ r: 70, pdl1: true, seed: 8 });
  tumor.setAttribute('transform', 'translate(560 270)');

  svg.append(killer, tumor);
  svg.append(label({ x: 560, y: 380, text: 'Cancer cell', anchor: 'middle' }));

  const loops = [breathe(killer), breathe(tumor)];          // no-ops under reduced motion
  return { destroy: () => loops.forEach((h) => h.stop()) };
}
```

* Import path from a figure module: `'../art/index.js'` (relative, no build step). Individual
  modules (`'../art/cells.js'` …) also work.
* **No setup needed for gradients.** Factories register their gradients in one hidden
  `<svg id="sao-art-defs">` appended to `<body>` the first time they run (see §11).
* Everything is **deterministic**: same options + same `seed` ⇒ identical drawing.

---

## 2. Conventions (read once)

| Topic | Rule |
|---|---|
| Origin | Every cell, pathogen and object-scene is a `<g>` **centred at (0,0)**. Position it with a transform: `node.setAttribute('transform', 'translate(x y)')` or `gsap.set(node, { x, y })`. |
| `r` | Nominal radius in px (SVG user units). Round cells: the membrane radius. Cells with long processes (macrophage, dendritic cell, fibroblast) and platelets: the **overall extent**, so the cell always fits a circle of radius ≈ `r`. Activated lymphocytes are drawn ~15–18 % larger (they're blasts). Receptors stick out a further ~0.3 r. Exact extent: `cellInfo(node).extent`. |
| Molecule anchor | (0,0) is where the molecule meets the **outer membrane surface**; the extracellular part points **up (−y)**; transmembrane stubs, CAR signalling domains and signal icons hang **below (+y)** inside the cell. `size` = height of the extracellular part. Free molecules (antibody, cytokine, granzyme, BiTE) accept `anchor: 'center'` or are centred already. |
| `stage` | `'dark'` (default; luminous, glowing) or `'light'` (crisp illustration: pale fills, defined ink strokes, no glow). Choose with `stageFor(fig)` (§3). |
| `detail` | `'auto'` (default) · `'high'` · `'low'`. Cells: high when r ≥ 18. Molecules: high when size ≥ 22 (≥ 24 when seated by `placeOnMembrane`). Low = 3–6 nodes per cell for crowds. |
| `seed` | Any number/string. Vary it across a crowd; keep it fixed for one character across steps. |
| `glow` | `false` removes the soft halo (dark stage). |
| `receptors` | Cells: `true/false`; default true when detail is high and r ≥ 16. |
| `polarity` | Degrees (0 = right, 90 = down — SVG y points down). Direction an activated / crawling cell faces. |
| Parts | Sub-elements carry `data-part="…"` so you can animate them: `node.querySelector('[data-part="nucleus"]')`. |
| Units | All numbers are SVG user units. Design figures in a fixed viewBox (e.g. 960×540) and let the SVG scale. |

---

## 3. Color rules

**Cells keep their canonical colors everywhere on the site.** Never recolor a cell type, never
invent a new hue for an existing entity, and never rely on color alone (PLAN §4): every
distinction is also carried by silhouette, texture, an icon or a label.

`PALETTE` (exact PLAN hexes; the foundation's CSS `--c-*` tokens use the same values):

| key | hex | entity | key | hex | entity |
|---|---|---|---|---|---|
| `healthy` | `#E9C9A1` | healthy body cell | `m1` / `macrophage` | `#FF7A6B` | macrophage M1 |
| `cancer` | `#B65FD8` | cancer cell | `m2` | `#B7727E` | M2 / TAM |
| `cd8` | `#4C8DFF` | killer T cell | `dendritic` / `dc` | `#4FD18B` | dendritic cell |
| `cd4` | `#2EC4C9` | helper T cell | `neutrophil` | `#F4A6C8` | neutrophil |
| `treg` | `#8C95C9` | regulatory T cell | `mdsc` | `#A7A35A` | MDSC |
| `bCell` / `plasma` / `antibody` / `drug` | `#F2B33D` | B, plasma, antibodies | `fibroblast` | `#9C8F80` | stroma |
| `nk` | `#FF8A3D` | NK cell | `bacteria` | `#B5D94A` | bacteria |
| `mast` | `#C9C2D6` | mast cell (granules `mastGranule #5B5FA8`) | `tam` | `#B7727E` | tumor-associated macrophage (same as `m2`) |
| `mhc` | `#D9DEEA` | MHC | `virus` | `#FF4D5E` | virus |
| `selfPeptide` | `#E9C9A1` | self peptide | `foreignPeptide` / `neoPeptide` | `#FF3D7F` | foreign / neo-peptide |
| `inhibitory` / `inhibit` | `#E5484D` | brakes (+ bar icon) | `activating` / `activate` | `#3DDC97` | activating (+ plus icon) |

Supplementary (muted, background roles): `rbc #C4505A`, `platelet #C9B6DA`, `endothelium #C9A9A6`,
`lymph #9FC3D9`, `ecm #8E9BC0`, `payload #E6F7FF` (ADC warhead), `linker #AEB7C8`,
`mouse #8FA3BF` (mouse-derived antibody parts), `b7 #A8E6CF`, `ligand #C9D3E8`,
`antigen #E3C8F5`, `proteasome #B9C3D9`, `splinter #8A6A4F`, `danger #FFE6A6` (danger sparks), `mast #C9C2D6` + `mastGranule #5B5FA8` (mast cell). DNA/RNA bases: `BASES` (always shown
with letters).

Any `color` option accepts a palette key (`'cd4'`) or a hex.

**Stages.** `STAGES.dark = { bg '#0B1024', bg2 '#131B36', ink … }`, `STAGES.light = { bg '#FAF7F2', bg2 '#FFFFFF', ink '#1B1F2A', ink2, ink3, rule }`.
Light-stage figures follow the page theme (their surface turns dark in dark mode), so pick the
art stage at runtime and re-render on theme change:

```js
import { stageFor } from '../art/index.js';
const draw = () => { svg.replaceChildren(); /* … build with { stage: stageFor(fig) } … */ };
draw();
ctx.onThemeChange(draw);   // only needed for data-stage="light" figures
```

Color helpers: `tones(color, stage, { intensity, desat })` (all derived shades the cells use),
`glyphTones(color, stage)`, `mix(a, b, t)`, `lighten`, `darken`, `shade` (darken toward neutral
black), `desaturate`, `shiftHue` (tumor sub-clones only, ≤ ±25°), `luminance`, `rgba(hex, a)`,
`resolve(keyOrHex)`. `RELATIVE_SIZE` gives real-world diameters relative to a T cell (macrophage
2.6, dendritic 2.8, cancer 2.2, neutrophil 1.45 …) — use it when a scene claims to be to scale.

---

## 4. Cells (`cells.js`)

All factories: `{ r, seed, stage, detail, glow, receptors, state, polarity, color }` + their own
options. Return a `<g class="sao-cell sao-<kind>" data-cell data-state data-stage>`.

**Common parts:** `glow` (halo circle) · `membrane` (`> path.sao-membrane`, the outline) ·
`sheen` · `microvilli` · `cytoplasm` · `granules` (`> [data-part=granule]` circles in high
detail) · `nucleus` (`> .sao-nucleus-envelope`, `chromatin`, `nucleolus`) · `receptors`
(each glyph a child `<g>`).

| Factory | Default r | States / key options | Silhouette & texture cues | Extra parts |
|---|---|---|---|---|
| `tCell` | 24 | `variant: 'cd8'|'cd4'|'treg'`, `state: 'resting'|'activated'|'exhausted'`, `polarity`, `cytokines:false`, `tcrKey` (clone identity, §5b) | small, round, fine microvilli fuzz, big nucleus, forked TCRs. **activated:** larger, brighter, front lamellipodium + rear uropod, TCRs gathered at the front; CD8 granules massed at the front; CD4 releases cytokine dots. **exhausted:** dim, desaturated, sparse fuzz, PD-1 (crimson, notched heads) all over. **treg:** dense CD25 lollipops + a few CTLA-4. CD8 vs CD4 also differ by granules (CD8 only). | `cytokines` |
| `bCell` | 25 | `state: 'resting'|'activated'`, `polarity`, `key` (clone identity: receptors become keyed tips in gold, §5b) | round, smoother membrane, gold Y-shaped BCRs; activated: BCRs capped toward `polarity` | |
| `plasmaCell` | 34 | `secreting` (default true), `antibodies` (count), `angle` | oval, eccentric clock-face nucleus, layered rough-ER arcs, pale Golgi | `er`, `golgi`, `antibodies` |
| `nkCell` | 27 | `state: 'resting'|'activated'`, `polarity` | round, kidney nucleus, LARGE bright granules, mixed activating (green +) / inhibitory (crimson) receptors | |
| `macrophage` | 60 (extent) | **`polarization: 0..1`** (continuous, reversible; 0 = fight end, 1 = repair end), `variant: 'm1'` (≡ 0.12) `|'tam'` (≡ 0.88; `'m2'` accepted), `state: 'resting'|'activated'|'engulfing'`, `polarity`, `receptors: true` (opt-in MHC-II) | big, amoeboid, ruffled edge folds, pseudopods, vacuoles with debris. Fight end: coral, spiky pseudopods + fine filopodia, strong ruffles, few vacuoles. Repair end: dusky rose, smoother, slightly elongated broad lamellae, more vacuoles. Color, outline and vacuoles interpolate smoothly → drive it from a slider (color is quantized to 1/50 steps). A tumor-associated macrophage = `polarization ≥ 0.8` / `variant:'tam'`; label it **"tumor-associated macrophage", never "M2"**. engulfing: phagocytic cup toward `polarity` — prey at `cellInfo(m).mouth`. `data-variant` = 'm1' / 'mixed' / 'tam', `data-polarization`. | `ruffles`, `vacuoles` (> `vacuole`), `cytokines` |
| `mastCell` | 30 | `release: 0..1`; then **`setDegranulation(cell, p)`** (seekable, no clock) | pale lilac-gray body (`PALETTE.mast`) densely packed with deep-indigo granules (`mastGranule`), round nucleus — unmistakably different from the pale-pink lobed neutrophil and the orange NK cell. Degranulation: outer granules drift out through the membrane ("it empties its granules"). | `granules` (> `granule`) |
| `dendriticCell` | 70 (extent) | `state: 'immature'|'mature'`, `maturity: 0..1` (continuous; overrides state; quantized to 0.05), `peptide` (`'foreign'` default when mature) | star-shaped; immature: short thick processes + many vesicles; mature: long, thin, branched, curling dendrites studded with MHC-II(+peptide) and B7 | `vacuoles` |
| `neutrophil` | 32 | `state: 'resting'|'crawling'|'activated'`, `polarity`, `lobes` (3–4) | round, slightly ruffled, **multi-lobed nucleus**, fine pale granules; crawling: a broad, ruffled lamellipodium toward `polarity`, the round body behind, a small knob-like uropod at the rear | `ruffles` |
| `mdsc` | 22 | – | small, irregular/angular, band-shaped pinched nucleus, few granules | |
| `healthyCell` | 40 | `state: 'healthy'|'infected'|'stressed'|'necrotic'` (+ `progress`), `mhc` (bool/count), `peptides` (pattern, e.g. `['self','viral']`), `shape: 'polygon'|'round'`, `sides` | calm rounded polygon, neat central nucleus, mitochondria; MHC-I "shop windows" with sand self-peptides. infected: virions inside + hot-pink viral peptides; stressed: green stress ligands among MHC | `virions` |
| `cancerCell` | 46 | `state: 'visible'|'hidden'|'dying'|'dividing'|'necrotic'`, `mhc` (count), `peptides`, `pdl1` (true/count), `nuclei: 1|2`, `progress` (dying 0..1), `antigens: { shape, color, count }`, `clone` (0–4) | irregular lumpy membrane; large misshapen nucleus with prominent nucleoli (sometimes 2 nuclei). visible: MHC-I with hot-pink neoantigens; hidden: no MHC at all; dying: shrinks, round blebs, condensed then fragmented nucleus, apoptotic bodies; dividing: pinched peanut, two nuclei | `blebs`, `antigens` |
| `fibroblast` | 70 (half-length) | `angle` (deg) | spindle with two long tapering ends (S-curve), elongated nucleus, stress fibres. Lay many in parallel for a stromal wall. | |
| `redBloodCell` | 14 | `view: 'face'|'tilted'|'side'`, `angle` | biconcave disc, muted (background only) | |
| `platelet` | 6 | `state: 'resting'|'activated'` | small irregular disc; activated = spiky | |
| `genericCell` | 30 | `color`, `irregularity`, `nucleus` (rel. size, 0 = none), `nucleusShape: 'round'|'kidney'|'irregular'|'oval'`, `granules`, `microvilli`, `intensity`, `desat`, `kind` | for anything not covered (monocyte, "a cell") — prefer a specific factory | |

`CELLS` maps names → factories. `cellInfo(node)` returns
`{ kind, variant, state, stage, r, rEff, extent, color, outline: [[x,y]…], regen(t, extra), … }`
— the outline (in the cell's own coordinates) is what `placeOnMembrane` and the animations use.

**State changes** are new drawings: build the new state with the **same seed** and crossfade
(see §9 recipe B). The shapes stay recognisably the same cell.

---

## 5. Molecules (`molecules.js`)

All glyphs: `{ size (default 16), stage, detail, color }` → `<g class="sao-mol sao-<name>" data-mol>`.
Colors default to the canonical ones (TCR = CD8 blue unless you pass `color: 'cd4'`).

| Factory | Options | Look / meaning | Parts |
|---|---|---|---|
| `mhc1` | `peptide: 'self'|'foreign'|'viral'|'neo'|'none'|hex`, `key` + `keySize` (§5b), `pockets: [a, b]` + `anchors: [a, b]` (§5c) | silver cup on one stalk + side bead (β2m) holding a short peptide bead. Foreign/neo: hot pink, bright core + glow (shape cue too). `peptide:'none'` = an empty cup **inside the ER only** — a shuttered window is *absent* cups (rule 3). Draw cups ≥ 14 px when identity matters. | `stalk`, `b2m`, `groove`, `pockets`, `peptide` |
| `mhc2` | `peptide` | two stalks, open-ended groove, longer peptide overhanging both ends | `alpha`, `beta`, `groove`, `peptide` |
| `tcr` | `cd3`, `cd3Color`, `color` | α/β chains, constant + lighter variable domains, CDR arc | `alpha`, `beta`, `variable` (`cdr`), `cd3` (`itam`) |
| `cd3` | – | CD3 εγ/εδ + ζ tails with ITAM marks | `cd3` |
| `bcr` | antibody options | membrane-anchored gold antibody | as antibody |
| `antibody` | `variant: 'generic'|'therapeutic'|'bispecific'|'adc'|'bite'`, `origin: 'human'|'mouse'|'chimeric'|'humanized'`, `targets: [colorA, colorB]`, `dar`, `cleaved`, `membrane`, `anchor: 'base'|'center'`, `highlight` | gold Y (heavy + light chains, lighter variable tips, CDR loops). therapeutic = white outline (drugs). Mouse parts slate-blue **and** hatched. Bispecific: tips colored by target cell, right tip square. ADC: hexagon payloads on linkers; `cleaved` = released. | `fc`, `hinge`, `fab-left/right`, `variable-left/right`, `cdr`, `highlight`, `linker`, `payloads` > `payload` |
| `bite` | `targets` | blinatumomab-style: two single-chain binders + flexible linker, no Fc; centred, horizontal; `size` = length | `binder-left`, `binder-right`, `linker` |
| `cd28` | `icon:false` | green-cyan dimer + **plus** icon | `chain-a/b`, `icon-plus` |
| `ctla4` | `icon:false` | crimson dimer, grippier heads + **bar** icon | `chain-a/b`, `icon-minus` |
| `b7` | – | pale-mint stalk with round head (CD80/86) | `igc`, `head` |
| `pd1` | `icon:false` | crimson stalk, head with a square **socket** + bar icon | `stalk`, `head` |
| `pdl1` | – | light crimson, head with a square **plug** (fits PD-1) | `igc`, `head` |
| `car` | `generation: 1|2|3`, `costim: ['cd28'|'4-1bb'|'ox40', …]`, `parts: [...]`, `membrane`, `membraneColor`, `binderColor`, `cd3zColor`; default size 56 | modular CAR: gold scFv binder (from an antibody) · silver hinge · TM block · costim (CD28 rounded square / 4-1BB hexagon / OX40 diamond, each with +) · blue CD3ζ with 3 ITAM ticks | `binder`, `hinge`, `transmembrane`, `costim-1`, `costim-2`, `cd3z`, `membrane` |
| `perforin` | `view: 'top'|'side'`, `subunits` | ring of subunits around a pore / two pillars | `ring`, `hole` / `pillar-left/right` |
| `granzyme` | `rotation` (default size 6) | two-lobed protease bead with a cleft, centred | `cleft` |
| `cytokine` | `color` (sender's color), default size 4 | small glowing dot, centred | `glow`, `core` |
| `cytokineCloud` | `count, radius, inner, seed, size, color, kind: 'cytokine'|'interferon'|'danger'` | a loose cloud around (0,0) | children are glyphs |
| `pamp` | `kind: 'lps'|'flagellin'|'dna'|'rna'|'atp'|'uricAcid'` (alias `'crystal'`), `size` (16, overall length), `color`, `rotation` | pattern tokens for pattern-recognition figures. LPS (two lipid tails, sugar hexagons, beads; chartreuse), flagellin (wavy filament segment), DNA (mini double helix), RNA (single strand with base stubs; red-coral), ATP (base + sugar + three phosphates; pale gold — a DAMP), uric-acid crystals (white needles). Centred | `token` |
| `lfa1` | `state: 'extended'|'bent'` | integrin: two legs + headpiece; bent = resting (folded over) | `legs`, `head`, `i-domain` |
| `icam1` | – | five Ig beads on a slightly bent stalk (LFA-1's partner on APCs, targets, endothelium) | `beads` |
| `cd8`, `cd4` | – | coreceptors: CD8 αβ (two short stalks, Ig heads) · CD4 (one chain of four Ig domains) | `heads` / `domains` |
| `interferon` | `color` (**sender's** color), default size 6 | **hollow ring** + soft glow, centred. Cytokines are solid dots, interferons rings (FIGURE-AUDIT rule 12: coral in ch02, blue IFN-γ in ch05/07/12, sand in ch11) | `glow`, `ring` |
| `dangerSpark` | `size` (8), `rotation`, `color` (default `PALETTE.danger` #FFE6A6) | pale-gold four-point star = danger signal released by dying/burst cells (rule 11). Never use for ADC payloads (those are hexagons) | `glow`, `star` |
| `receptor` / `ligand` | `profile: 'notch'|'round'|'triangle'|'wave'|'step'`, ligand `fit: 0..1` | shape-fit teaching pair. Dock: put the ligand at `(0, +receptor.getAttribute('data-dock-y'))` in the receptor's frame. fit 1 = snug, 0 = wrong shape (lift it a little to show it can't seat). | `stalk`, `head` / `body` |
| `antigen` | `shape: 'circle'|'diamond'|'triangle'|'square'|'hex'|'star'`, `color` | generic surface target (CD19, HER2, BCMA…) — **shape carries identity** | `stalk`, `head` |
| `cd25`, `tlr`, `nkActivating`, `nkInhibitory`, `stressLigand`, `fas`, `fasL` | `icon:false` where relevant | IL-2Rα dot; horseshoe danger sensor with ribs; NKG2D-like (+); KIR-like (−); MICA-like trefoil; Fas / FasL trimers | |
| `signalIcon` | `type: 'activating'|'inhibitory'`, `size`, `x`, `y` | plus disc / bar disc — attach to any signal you draw | `icon-plus` / `icon-minus` |
| `peptideChain` | `length, beadR, fold (0..1), seed, color, colors[], highlight[]` | beads on a backbone, centred; fold 0 = line, 1 = compact protein; highlighted beads = hot-pink "typo" | `backbone`, `bead` (`data-index`) |
| `peptidePositions` | same | bead centres for any fold — tween beads yourself for a folding animation | – |
| `dna` | `sequence, rise, width, letters, highlight[], twist` | double helix with base-pair rungs (colors + letters), mutation highlight | `backbone-a/b`, `pairs` > `pair`, `letters` |
| `rna` | `sequence, rise, letters, highlight[]` | single strand with base stubs (U) | `backbone`, `bases` > `base` |
| `proteasome` | `caps`, `capColor`, default size 40 | barrel of 4 rings + regulatory caps, centred, vertical | `barrel`, `channel`, `cap-top/bottom` |

`MOLECULES` maps names → factories (so you can pass `'tcr'` as a string to the placement helpers).

### 5b. Clone identity: `tcrKey` / `epitopeKey` (`keys.js`)

FIGURE-AUDIT rule 13: a clone's identity is the **notch on its receptor tip**; the one antigen it
recognizes carries the **complementary plug**.

| Function | Options | Notes |
|---|---|---|
| `tcrKey({ key, size, color, stage, form, detail })` | `key`: integer (seeds `0 … KEY_COUNT−1` = 46 guaranteed-distinct notches), any string (hashed), or `'triangle'|'star'|'diamond'`. `form: 'receptor'` (membrane glyph: two chains + notched tip; anchor = membrane) or `'tip'` (just the notched badge, centred, notch exaggerated — for crowd dots and sprites, readable from ~10 px). `color`: the cell's color. | `data-key`, `data-dock-y` (top of the tip). Parts: `chains`, `tip`. |
| `epitopeKey({ key, size, color, stage, facing, glow })` | same `key`; `size` = the matching receptor's size; `facing: 'down'` (plug toward +y — docks into a receptor in the same frame) or `'up'` (plug pokes up, e.g. presented). Default hot pink + glow. Named keys are those shapes (▼, ★, ◆). | Dock: `ep.setAttribute('transform', 'translate(0 ' + rec.dataset.dockY + ')'); rec.append(ep)`. Parts: `plug`, `glow`. |
| `keyChip({ key, size, color, stage })` | – | Tiny legend/chip glyph: the named shape, or a notched badge. |
| `keyId(key)`, `keySocket(key)`, `keyPlug(key)`, `KEY_COUNT`, `KEY_NAMES` | – | Geometry in units of size (for canvas drawing or custom art). |

Integrations: `tCell({ tcrKey: 7 })` (every TCR on the cell carries the notch), `tcr({ key })`,
`mhc1({ peptide: 'neo', key: 7, keySize })` (the peptide is drawn as the matching plug poking out of
the cup; use the T cell's glyph size as `keySize`). A mismatched key simply doesn't seat — lift it a
few px. Daughter cells keep their parent's key (same `key`, same color). For canvas crowds,
`await sprite('tcrKey', { key, form: 'tip', size: 10, color: 'cd8' })`.

### 5c. The groove up close: pockets, anchors, ridges (`groove.js`)

For ch04-peptide-plus-groove (and HLA variants anywhere). **Shape carries the logic:**
anchor beads `'circle'` ● / `'square'` ■ / `'triangle'` ▲; pockets `'round'` (fits ●), `'square'` (■),
`'triangle'` (▲), `'wide'` (● or ■); ridge patterns `'A' | 'B' | 'C'` (three bumps per wall; other
strings are seeded); up-facing patterns `'x' | 'y' | 'z'` (dot / twin bars / chevron caps on beads 4–6).

* `anchorFits(pocket, anchor)`, `peptideFits(pockets, anchors)` — the only rule; use them to build
  the truth table (Ana `['round','round']` · Ben `['wide','round']` · Chen `['square','triangle']`).
* `mhc1({ size: 60, pockets: ['wide','round'], anchors: ['square','circle'], peptide: 'self' })` — two
  shaped sockets in the cup floor; if **both** anchors fit, a mini 3-bead peptide (anchor · body ·
  anchor) lies in the groove with its anchors seated (hot pink + glow when foreign/neo); if they don't
  fit, the cup shows no peptide. `peptide: 'none'` + `pockets` = an empty cup waiting in the ER.
* `mhcGroove({ view: 'side'|'top', width: 360, pockets, ridge, peptide: { kind, anchors, pattern, color } | null, seated: true, stage })`
  — centred close-up. **side**: a trough with two shaped pockets carved into the floor, the back
  wall (α-helix) carrying the ridge bumps, a 9-bead peptide whose beads 2 and 9 drop into the pockets
  when they fit (an anchor that doesn't fit rests on the rim) and beads 4–6 raised with the pattern caps.
  **top**: platform between two helical walls with ridge knobs, pocket shapes in the floor, the peptide
  along the middle (anchors darker = down, up-beads larger = up). Parts: `platform`, `wall-back` /
  `wall-a` / `wall-b`, `ridge`, `pockets` (> `pocket` data-type), `peptide` (> `bead` data-role
  `anchor|up|plain`), `backbone`. `cellInfo(g) → { beads, pockets, ridge, fits, contacts: { peptide, wallA, wallB } }`
  — `contacts` are where a diagonally docked TCR paddle's three loops land (one on the up-beads,
  one on each wall's ridge). The TCR paddle itself is figure-local art (single use).

### 5d. Compartments (`organelles.js`)

| Function | Options | Look |
|---|---|---|
| `vesicle({ kind: 'endosome' })` | `r` (24), `cargo` (debris bits), `tagged` (of which carry a hot-pink tumor-protein tag), `seed`, `stage`, `color` | clear bubble with a double membrane holding eaten debris (ch04-cross-presentation's "bubble") |
| `vesicle({ kind: 'lysosome' })` | `r` (12) | small, dense, granular |
| `vesicle({ kind: 'er' })` | `width` (220), `height` (150), `ribosomes` (true) | the ER as one smooth, soft-edged compartment studded with ribosomes (an honest simplification — don't add the Golgi) |
| `tapGate({ size: 28, state: 'open'|'closed'|'blocked', peptide })` | anchor = channel centre on the membrane; channel along y (cytosol −y → ER +y; rotate as needed) | two pale-silver halves around a channel, nucleotide-binding domains on the cytosolic side; `peptide:true` shows beads in transit; `blocked` adds the crimson ⊣ bar across the mouth (rule 10) |

All are centred at (0,0) (`cellInfo(vesicle) → { outline, rx, ry }`), so you can `placeOnMembrane`
onto an ER outline: `placeOnMembrane(er, (o) => mhc1({ ...o, peptide: 'none' }), { count: 3, inset: 12 })`.

---

## 6. Seating molecules on membranes

### `placeOnMembrane(cell, glyph, options)` → array of placed `<g>`

```js
placeOnMembrane(t, 'tcr', { count: 9, arcStart: -50, arcEnd: 50, size: 16 });
placeOnMembrane(c, (o, i) => mhc1({ ...o, peptide: i % 3 ? 'self' : 'viral' }), { count: 12, size: 18 });
placeOnMembrane(k, (o) => antigen({ ...o, shape: 'diamond' }), { count: 10, size: 16, layer: 'antigens' });
```

* `cell`: any cell/pathogen from this library (uses its true outline), or `{ outline: [[x,y]…], parent: g }`.
* `glyph`: factory name or `(opts, index) => element`. It receives `{ size, stage, detail }` (+ `opts.opts`).
* Options: `count` (8), `arcStart`/`arcEnd` (degrees, 0 = right, 90 = down; omit for the full ring),
  `size` (≈ 0.34 r), `sizeJitter` (0..1), `tilt` (± random degrees), `seed`, `inset` (px pushed
  inward), `offset` (0..1 phase along the arc — use it to interleave two kinds), `stage`
  (defaults to the cell's), `detail` (default low below 24 px, high above), `layer` (data-part of the
  container, default `'receptors'`).
* Glyphs are evenly spaced by arc length and rotated to face outward. Each gets
  `data-angle` (outward normal, degrees) and `data-base-transform` (used by `jitter`).
* Build cells with `receptors: false` when you want full control of their surface.

### `placeAlong(parent, glyph, { x0, x1, y, count, facing: 'up'|'down', size, stage, jitter, layer })`

For flat membranes (molecular close-ups). `facing: 'down'` rotates glyphs 180° (top cell of a
synapse).

**Synapse recipe** (molecular scale):

```js
const syn = synapse({ width: 900, gap: 120, top: { color: 'cd8' }, bottom: { color: 'cancer' } });
const { topY, bottomY } = cellInfo(syn);
placeAlong(syn, (o) => tcr({ ...o, cd3: true }), { x0: -60, x1: 60, y: topY, count: 1, facing: 'down', size: 56 });
placeAlong(syn, (o) => mhc1({ ...o, peptide: 'neo' }), { x0: -60, x1: 60, y: bottomY, count: 1, size: 56 });
```

**Engaged pairs.** `DOCK_GAP[pair] × size` is the membrane-to-membrane gap at which two facing glyphs
of the same `size` are engaged: `'tcr-mhc1'` 1.62 (TCR resting on the cup rim), `'tcr-mhc2'` 1.56,
`'tcrKey-mhc1Key'` 1.84, `'pd1-pdl1'` 1.72 (plug interlocked in socket), `'cd28-b7'` 1.65,
`'ctla4-b7'` 1.64, `'car-antigen'` 2.0, `'nkInhibitory-mhc1'` 1.83, `'nkActivating-stressLigand'` 1.75.
To show "engaged" vs "apart", move the glyphs (or the two membranes) between `DOCK_GAP` and
`DOCK_GAP + 0.3`. An engaged PD-1/PD-L1 pair shows its single crimson "−" disc on the T-cell side
(the `pd1` glyph's built-in icon; pass `icon:false` on unengaged PD-1s).
`HEAD_Y[name] × size` = the top of a glyph's head (e.g. where a drug antibody tip should land);
`antibodyTips(size)` → `{ left, right, fc }` arm-tip coordinates of an `antibody` in its own frame,
so a drug can cap a target head with one tip, Fc pointing away (rule 9).

---

## 7. Pathogens (`pathogens.js`)

| Factory | Options | Notes |
|---|---|---|
| `bacterium` | `shape: 'rod'|'coccus'`, `r` (rod half-length / coccus radius), `angle`, `flagella` (0–3), `pili`, `pamps` (bright surface motifs for pattern recognition), `arrangement: 'single'|'pair'|'chain'|'cluster'`, `opsonized` (antibodies bound by their tips, Fc outward), `antibodies` (count) | parts: `body`, `wall`, `nucleoid`, `flagella`, `pili`, `pamps`, `antibodies`. Rotation lives on an inner group, so `transform` on the root is free for positioning. |
| `virus` | `r` (10), `spikes` (12), `genome` | icosahedral capsid with facets, club spikes, coiled genome. parts: `spikes`, `capsid`, `facets`, `genome` |
| `splinter` | `length` (160), `angle` | wooden shard pointing +x. parts: `shard`, `grain` |

`invert(glyph, size)` flips a membrane glyph so its tips touch the anchor (used for opsonization).

---

## 8. Scenes (`scenes.js`)

* **Area pieces** fill a box `{ x = 0, y = 0, width, height }`: `stageBackground`, `tissueField`, `ecmFibers`, `particleField`, `lymphNodeField`.
* **Object pieces** are centred at (0,0) like cells (linear ones run along x): `bloodVessel`, `lymphaticVessel`, `lymphNode`, `membraneSurface`, `synapse`.

| Factory | Options | Info / parts |
|---|---|---|
| `stageBackground` | `width, height, x, y, stage, vignette` | Navy radial + vignette (only when the stage must live inside the SVG, e.g. exports — the figure CSS already paints stages). |
| `tissueField` | `width, height, x, y, seed, stage, density, tint, fibers, ghosts, particles` | Low-contrast background: ECM fibres, out-of-focus "ghost" cells, dust. Put it first. |
| `ecmFibers` | `width, height, x, y, count, seed, stage, angle, spread, waviness, opacity, color` | 2 paths total — cheap. |
| `particleField` | `width, height, x, y, count, seed, stage, color, size: [min,max], opacity` | individual circles (`data-part="particle"`) for `drift()` |
| `bloodVessel` | `length (500), width (110, outer diameter), wall (14), seed, stage, leaky, gaps: [x…], rbc (14), streaks, wallColor` | `cellInfo(v) → { lumenTop, lumenBottom, wallTop, wallBottom, gaps: [{ x, wall, width }] }`. Parts: `lumen`, `flow`, `rbcs`, `wall-top`, `wall-bottom` (> `endothelial`), `basement`, `gaps`. Neutrophils extravasate through `gaps` on the bottom wall. |
| `lymphNodeField` | `width, height, x, y, seed, stage, follicles (3), mesh (true), dots (true), density (1), label (false → "LYMPH NODE" t-caps)` | **Area piece** for scenes *inside* a node (rule 14): soft oval capsule + subcapsular sinus, fine reticular mesh (the scaffolding T cells crawl along), central blue T-cell zone, gold B-cell follicles near the rim, faint resident dots. `cellInfo → { cx, cy, rx, ry, tZone:{cx,cy,rx,ry}, follicles:[{x,y,r}], inside(x,y), randomPoint(rng) }` — use `inside()` to keep walkers in the oval. Parts: `capsule`, `sinus`, `tzone`, `follicles`, `mesh`, `residents`, `label`. Draw it as the SVG background behind a canvas crowd. |
| `lymphaticVessel` | `length, width, valves, seed, stage, flow (±1)` | parts: `lumen`, `wall-top`, `wall-bottom`, `valves` |
| `lymphNode` | `r (170, half-width), seed, stage, follicles (5), afferent (3), cells (true)` | bean with capsule + subcapsular sinus, gold B-cell follicles with germinal centres, blue T-cell paracortex (dot texture = lymphocytes), medullary cords, HEVs, afferent / efferent lymphatics, artery + vein at the hilum (right). `cellInfo → { follicles:[{x,y,r}], paracortex:{x,y}, afferent:[{x,y,ox,oy,angle}], efferent:{x,y}, hev:[{x,y}] }` |
| `membraneSurface` | `width, thickness (12), color (cell color), stage, detail, depth (cytoplasm tint), side: 'up'|'down'` | Lipid bilayer; outer surface at y = 0; extracellular side up (or down when `side:'down'`). Seat molecules with `placeAlong(m, 'tcr', { y: 0 })`. |
| `synapse` | `width, gap, top: { color }, bottom: { color }, stage, thickness, depth, detail` | two facing membranes; `cellInfo → { topY, bottomY }`; parts `membrane-top`, `membrane-bottom` |
| `label` | `x, y, text, anchor, leader: [x2,y2], stage, size (13), weight, color, dot, caps` | Inter (`var(--font-ui)`), thin leader line + dot, legibility halo. Keep in-SVG text short and ≥ 13 px rendered (use `ctx.pxPerUnit(svg)`). |

### 8b. Body map (`bodymap.js`)

`bodyMap({ height: 460, stage, organs: 'all' | [names] | [], outline: true })` — a calm,
front-facing, **gender-neutral** human silhouette (no face, no features), centred at (0,0) with the
feet at +height/2, plus schematic organ glyphs in muted anatomical tones (so crimson hotspot rings
and canonical cell colors stand out). Front view: the person's left (heart, spleen) is on the
viewer's right.

Organs: `brain`, `pituitary`, `eye` (opt-in only — never draw a pair), `salivary`, `thyroid`,
`thymus`, `lungs`, `heart`, `liver`, `stomach`, `spleen`, `pancreas`, `adrenals`, `kidneys`, `gut`
(colon + small intestine), `marrow` (femurs), `lymphNodes` (neck, armpits, groin), `skin` (forearm
patch), `joints` (knees), `muscle` (upper arm), `nerves` (arm). Aliases: `colon`, `'bone marrow'`,
`'lymph nodes'`, `knee`, `kidney`, `lung`, `adrenal`, `eyes` …

* Every organ is `<g data-part="organ" data-organ="liver">` (tint / pulse it yourself).
* `cellInfo(body).anchors[name] → { x, y, r, pts }` in the body's local px, for **every** organ even
  when not drawn — hotspot rings (`r`), leader lines, AIRE organ chips. `pts` lists each side of
  paired organs.
* `organIcon(name, { size: 24, stage })` (or `organIcon({ name, size })`) — one organ as a
  standalone icon centred at (0,0): AIRE organ proteins (pancreas, eye, stomach, salivary gland),
  legends, cards.
* ch08-side-effects is a light stage: use `stage: stageFor(fig)` and re-render on theme change.

---

## 9. Motion

### Built-in helpers (`animate.js`) — all return `{ stop(), pause(), resume(), finished, running }`

| Helper | What it does | Reduced motion |
|---|---|---|
| **`setDying(cell, p, { remnants, seed })`** | **Seekable apoptosis** (FIGURE-AUDIT rule 6). `p` 0 → 1: 0–0.45 shrink, round blebs, color drains · 0.3–0.65 nucleus condenses then fragments · 0.65–1 breaks into a loose cluster of apoptotic bodies. A pure function of `p` — no clock — so Back, dot-jumps and scrubbing give identical frames; `p = 0` restores the exact original drawing (and on a fresh cell does nothing). `remnants:false` fades the bodies out at the end (crowds). Works on every cell type. `data-state` → `'apoptotic'` / `'dead'`. | n/a (you set p) |
| **`setNecrotic(cell, p, { seed })`** / **`necrosisState(cell)`** | **Seekable necrosis**: messy, inflammatory death (injury, a burst infected cell, oncolysis), deliberately unlike apoptosis. The cell swells and pales (0–0.4), its membrane tears open in three places as contents and `dangerSpark`s spill out (0.3–0.7), and the nucleus dissolves as debris scatters (0.6–1). A pure function of `p`; `p = 0` restores the original exactly. Use apoptosis (`setDying`) for killer-cell and NK kills, and necrosis for injury and burst cells. | n/a |
| **`dyingState(cell, opts)`** | Tweenable proxy `{ p }`: `tl.to(dyingState(target), { p: 1, duration: 2.6, ease: 'none' }, 'kill')`. **Use this in steppers and `cell-actions.kill`**, never `apoptosis()`. | your timeline's rule |
| `breathe(cell, { amplitude: 1, period: 6, fps: 24 })` | outline gently wobbles; dendrites/pseudopods sway (regenerates the membrane path ~24×/s) | not started |
| `wobble(cell)` | livelier breathe | not started |
| `crawl(cell, { to: [x,y] | path: [[x,y]…], speed: 28, stride: 1.6, loop, onArrive })` | amoeboid inch-worm locomotion: pseudopod toward the heading, body follows. **Owns the cell's `transform`** (`translate(x y)`) | jumps to destination |
| `jitter(elements, { amplitude: 5°, speed })` | thermal jiggle of receptors about their anchors: `jitter(cell.querySelectorAll('[data-part="receptors"] > *'))` | not started |
| `drift(elements, { amplitude: 6, speed: 0.25 })` | slow floating (particles, cytokines, free antibodies) | not started |
| `glowPulse(target, { color, radius, duration: 1800, repeat: 0, scale: 1.6 })` | slow swelling ring of light = recognition event (never flashes) | static ring for `duration` |
| `apoptosis(cell, { duration: 2800, remove: false, onComplete })` (alias `kill`) | self-running one-shot of the same sequence (drives `setDying`). Owns a clock → **not stepper-safe**; fine for free-running sims | jumps to end state |
| `tween({ duration, ease, onUpdate(p), onComplete })` | generic dependency-free tween | jumps to end |

* All loops share one `requestAnimationFrame`, pause in hidden tabs and when their SVG is
  off-screen (IntersectionObserver). Still: **stop handles in your figure's `destroy()`**.
* `prefersReducedMotion()`, `onReducedMotionChange(fn)`, `setReducedMotion(true|false|null)` (dev override).
* Static rendering is always complete: never rely on an animation to make a drawing correct.

### With GSAP (`ctx.gsap`)

GSAP and the library mix fine — just never let two systems drive the same attribute
(e.g. don't `crawl()` and `gsap.to(cell, { x })` the same element; wrap in a `<g>` instead).

* Position cells with GSAP from the start: `gsap.set(cell, { x: 300, y: 200 })`, then tween `x/y`.
* Scale/rotate a cell about its centre, or a glyph about its membrane anchor, with
  `transformOrigin: anchorOrigin(node)` (GSAP's SVG default is the bbox's top-left corner):
  ```js
  import { anchorOrigin } from '../art/index.js';
  gsap.to(tcrGlyph, { rotation: '+=12', scale: 1.15, transformOrigin: anchorOrigin(tcrGlyph) });
  gsap.to(cell, { scale: 1.2, transformOrigin: anchorOrigin(cell) });     // or svgOrigin: `${x} ${y}`
  ```
* Parts inside a cell are in the cell's frame (centre = 0,0, units = px):
  `gsap.to(cell.querySelectorAll('[data-part="granule"]'), { x: 12, duration: 1.2, stagger: 0.05 })`
  (polarize granules toward a target at the right). Fade a part: `gsap.to(cell.querySelector('[data-part="receptors"]'), { opacity: 0 })`.
* MorphSVG works on `[data-part="membrane"] > path` (e.g. morph to the `regen()` of a new state), but a crossfade is usually prettier and cheaper.

### Recipes

**A. Killer T cell kills a cancer cell (stepper)**
```js
const tc = tCell({ variant: 'cd8', r: 38, state: 'activated', polarity: 0, seed: 2 });
const ca = cancerCell({ r: 64, seed: 5 });
gsap.set(tc, { x: 150, y: 270 }); gsap.set(ca, { x: 560, y: 270 });
svg.append(tc, ca);
const tl = gsap.timeline({ paused: true })
  .to(tc, { x: 440, duration: 1.6, ease: 'power2.inOut' })                       // approach
  .add(() => glowPulse(tc, { color: 'cd8' }))                                     // recognition
  .to(tc.querySelectorAll('[data-part="granule"]'), { x: 8, duration: 0.8 }, '+=0.2')
  .to(dyingState(ca), { p: 1, duration: 2.6, ease: 'none' }, '+=0.4');            // kill (seekable)
// steppers: build each step's end state directly — e.g. setDying(ca, step >= 4 ? 1 : 0) — and
// under reduced motion jump with tl.progress(1). glowPulse owns a clock: in steppers prefer a
// tweened ring (shared/cell-actions recognize()).
```

**B. Change a cell's state (crossfade, same seed)**
```js
const next = tCell({ variant: 'cd8', r: 30, seed: 7, state: 'exhausted' });
next.setAttribute('transform', old.getAttribute('transform')); next.style.opacity = 0;
old.after(next);
gsap.to(next, { opacity: 1, duration: 0.8 }); gsap.to(old, { opacity: 0, duration: 0.8, onComplete: () => old.remove() });
```

**C. Checkpoint blockade** — PD-1 on the T cell, PD-L1 on the tumor, then a drug antibody
(`antibody({ variant: 'therapeutic', anchor: 'center', size: 28 })`) docks onto the PD-1 head:
tween its `x/y` to the PD-1 glyph's head position (`glyph` anchor + rotated `(0, -size*0.8)`).

**D. NK missing-self** — `healthyCell({ state: 'stressed', mhc: n })` with `n` from a slider
(rebuild on input; same seed so the cell doesn't jump).

---

## 10. Canvas crowds (`sprites.js`)

For > ~150 moving cells use Canvas 2D with cached bitmaps:

```js
import { preloadSprites, drawSprite } from '../art/index.js';
const imgs = await preloadSprites([
  ['tCell', { variant: 'cd8', r: 9, seed: 1 }], ['tCell', { variant: 'cd8', r: 9, seed: 2 }],
  ['cancerCell', { r: 15, seed: 1 }], ['cancerCell', { r: 15, seed: 2, state: 'hidden' }],
]);
// each frame (ctx in CSS px; e.g. const cv = ctx.canvas(); cv.g):
drawSprite(cv.g, imgs[0], x, y, { rotation: 0, scale: 1, alpha: 1 });
```

* `sprite(kind, params, { scale, pad })` → `Promise<ImageBitmap | HTMLCanvasElement>`, cached by
  (kind, params, scale). Default scale = devicePixelRatio capped at 2. The bitmap is square and
  centred on the factory's origin; `drawSprite` centres it on (x, y) in CSS px.
* `spriteInfo(img) → { size, ext, scale, kind, params }`; `clearSprites()` after a theme/stage change.
* Use a **handful of seeds** (4–8 variants per type), not one per agent. In the gallery: 8 sprites
  rasterize in ~20 ms; 300 agents draw at 60 fps.
* Sprites have no `data-part`s — swap bitmaps to show state changes (pre-render each state).

---

## 11. Defs, ids, export

* Paints come from `defs.js` (`bodyFill`, `haloFill`, `nucleusFill`, `sheenFill`, `dotGlow`,
  `stageFill`, `vignetteFill`, `radial`, `linear`). Each definition is content-hashed
  (`sao-<kind>-<hash>`) and registered **once per page** in `<svg id="sao-art-defs">` (hidden,
  0×0, never `display:none`). Consequences: no duplicate ids across figures; figures inside
  `display:none` tabs never break other figures' gradients; nothing to set up.
* `ensureDefs(svg)` — optional explicit call (idempotent).
* `inlineDefs(svg)` — copies referenced definitions into an SVG for **standalone export**
  (download/serialize). Sprites do this automatically.
* Filters are expensive: `glowFilter(strength)` and `blurFilter(amount)` (defocus) exist for a
  handful of hero elements only. Halos use gradients instead.
* Don't add a `<base href>` to pages: it breaks `url(#…)` references in SVG.

---

## 12. Performance budget

* A typical high-detail cell is 8–15 nodes + its receptors (≈ 2 nodes per low-detail glyph).
  60 mixed cells on a tissue field ≈ 1,300 SVG nodes, built in ~10 ms.
* Crowds of SVG cells: use r < 18 (auto low detail) or `detail: 'low'`; switch to sprites above ~150.
* `breathe` regenerates one path per cell ~24×/s: fine for ~30 cells. For more, breathe only the
  foreground cells.
* Avoid `filter` on many elements; avoid animating gradients.

---

## 13. Do / Don't

**Do**
* Use the factories for every cell and molecule; keep canonical colors.
* Pair every color distinction with a shape, icon or label (the gallery's *Vision* menu shows the
  grayscale / deuteranopia / protanopia view — check your figure the same way).
* Keep a cell's `seed` constant across steps so it stays the same individual.
* Use `stage: 'light'` (via `stageFor`) on light-stage figures; the dark luminous look belongs on dark stages.
* Label cells (PLAN: "always with labels") with `label()` or HTML overlays.
* Honor reduced motion: the helpers do; your GSAP timelines must too (`ctx.reducedMotion`, `ctx.ambient`).

**Don't**
* Don't draw faces, eyes or expressions on anything. (The library avoids symmetric dark "eye"
  pairs in nuclei; don't add them.)
* Don't recolor a cell type to mean something else, or tint a whole figure.
* Don't scale a cell's stroke width by hand — pass the right `r` instead (strokes scale with r).
* Don't put filters on crowds, or run `breathe` on 100 cells.
* Don't mutate library internals; if something is missing, ask the art owner.

---

## 14. Lower-level building blocks (for new shapes)

`shapes.js`: `rng(seed)` (seeded PRNG with `.range .int .pick .chance .gauss .fork`),
`blobRadius({ r, seed, irregularity, ruffle, bumps, blebs, squash })`, `polarPoints`,
`smoothPath(points, { closed, smooth })`, `armOutline(bodyR, arms)` (bodies with dendrites /
pseudopods / spindles, incl. branches), `roundedPolygonPath`, `samplePerimeter`, `rayHit`,
`scatterInDisc`, `foldedPositions`, `bandPoints`, `edgeFolds`.
`svg.js`: `el(tag, attrs, children)`, `group`, `part(name)`, `svgRoot`, `place(node, x, y, rot, scale)`,
`circleD`, `ellipseD`, `capsuleD`, `roundRectD`, `polygonD`.
`FACTORIES` (from `index.js`) maps every factory name to its function.

---

## 15. Known limitations

* `breathe` / `crawl` regenerate only the membrane outline; receptors, microvilli and the
  nucleus stay put (amplitudes are kept small so receptors stay seated).
* State changes are rebuilds (same seed) + crossfade — there is no in-place `setState`.
* At ≤ 12 px, molecule glyphs are told apart mostly by color and rough silhouette; use
  ≥ 14 px (or a label) when the identity of a specific molecule matters.
* Light-stage figures must re-render on theme change (`stageFor` + `ctx.onThemeChange`).
* Sprites have no named parts; text inside sprites (DNA letters) uses fallback fonts.
* `mhcGroove` doesn't draw the TCR paddle (single-use, figure-local); dock it on `cellInfo(groove).contacts`.
* `bodyMap` is a front view only; organs are schematic (positions anatomically plausible, not to scale).
* Macrophage `polarization` quantizes color to 1/50 steps (gradients are shared defs).
* The gallery's *Composition test* section shows how pieces combine (defocused background
  cells via `blurFilter`, labels, cytokines) — copy its structure for hero scenes.

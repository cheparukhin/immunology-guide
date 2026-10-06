# Figure audit: the whole set, before the build

Art direction and interaction-design decisions for all **50 figures** in `all-figure-specs.md`, plus 13 chapter heroes. Where this document conflicts with a figure spec on **look, vocabulary, shared code or build grouping**, this document wins. Where it conflicts on **science or reader-facing text**, the spec wins unless §7 says otherwise. Builders still use the writers' captions verbatim.

Effort units: S = 1, M = 2, L = 3, XL = 5. The total is about 151 units.

---

## 1. Inventory

Risk tags: **Sci** = scientific accuracy, **Mob** = phone layout, **Perf** = performance, **Load** = cognitive overload.

| id | ch | kind | stage | learning goal (one line) | cx | main risks |
|---|---|---|---|---|---|---|
| ch01-scale | 1 | explorer | dark | Feel the ladder from hand to amino acid | XL | Perf: 8 nested, scaled scenes; much bespoke art (hand, skin, spike beads); Mob: label thinning |
| ch01-gene-to-protein | 1 | stepper + sandbox | dark | DNA → mRNA → protein; one letter can be silent, swap, sickle or stop | XL | Mob: 27-tile strip, popover → sheet; Sci: exact genetic code; Load: sandbox chips |
| ch01-binding | 1 | sim | dark | Fit sets dwell time; occupancy = affinity × amount | M | Sci: hit the tuning targets numerically |
| ch01-census | 1 | chart | light | 1.8 trillion cells: where, which, how heavy | L | Mob: 184 squares + labels; mast-cell hue missing |
| ch02-pattern-recognition | 2 | explorer | dark | Sensors detect classes of danger, by location, and set the alarm | XL | Load: 8 sensors × 5 suspects + names toggle; Mob: sensor labels; Sci: fixed locations |
| ch02-inflammation | 2 | stepper | dark | Four signs by mechanism; roll → stick → squeeze | XL | Perf: flowing blood + 9 states; mast cell not in library |
| ch02-nk-missing-self | 2 | explorer | dark | NK cells weigh stop vs go; an empty window exposes a cell | L | Sci: model needs an on-screen "simplified" tag |
| ch02-macrophage-spectrum | 2 | explorer | dark | Fight ↔ repair continuum; tumors push toward repair | M | Art: continuous morph not supported yet |
| ch03-vdj | 3 | sim | dark | Random V(D)J + seams → vast variety, much waste | XL | Load: 3-stage disclosure; Mob: 40 V tiles; overlaps ch03-numbers |
| ch03-numbers | 3 | chart | light | Possible receptors ≫ present receptors | M | Mob: tall log ladder |
| ch03-clonal-selection | 3 | stepper | dark | Select, copy, contract, remember; memory is specific | XL | Perf: ~420 canvas agents + live chart; Sci: three data sources in one figure |
| ch03-antibody | 3 | explorer | dark | Tips bind, Fc recruits; four jobs | XL | 9 mini-scenes (5 modes × with/without); Mob: vertical re-layout |
| ch04-mhc1-pathway | 4 | stepper | dark | Every cell displays fragments; viruses and mutations change the display | L | 6 steps × 4 scenario rebuilds; Mob: portrait pipeline |
| ch04-peptide-plus-groove | 4 | explorer | dark | The TCR reads peptide plus groove; HLA differs by person | L | Sci: exact truth table; custom groove art; Mob: grid |
| ch04-cross-presentation | 4 | stepper | dark | DCs route eaten tumor material onto class I | S | Sci: route B starts in the bubble |
| ch04-lymph-node-search | 4 | sim | dark | Many brief random contacts find a 1-in-10⁵ match | M | Sci: no homing; Perf: 400 agents |
| ch04-three-signals | 4 | explorer | dark | Signal 1 alone = anergy; 1+2 activates; 3 briefs | L | Load: toggles, presets, memory strip, sequel |
| ch05-thymus | 5 | sim | dark | Grip-dial selection; ~3% graduate; AIRE | XL | Load; Perf: 1,000-candidate run; needs body map |
| ch05-kill | 5 | stepper | dark | Contact kill: recognize, seal, perforate, self-destruct, move on | L | Mob: lens replaces main view; the canonical kill (sets the grammar) |
| ch05-brakes | 5 | explorer | dark | CTLA-4 caps priming, PD-1 dampens tissue attack; knockouts → autoimmunity | XL | Load: 2 scenes × scrubber × knockout; overlap with ch08 |
| ch05-exhaustion | 5 | sim | dark | Chronic antigen → TOX exhaustion; the stem-like reserve answers PD-1 release | XL | Load; chart inside a dark stage; overlap with ch08-two-brakes |
| ch06-clonal-evolution | 6 | sim | dark | Mutation + selection; drivers pile up; trunk vs branch | XL | Sci/Perf: tuning; 1,200-site canvas + live tree; Mob: tree |
| ch06-antigen-kinds | 6 | explorer | light | Every tumor target is a trade-off | M | Mob: chip tray + card |
| ch06-typo-to-target | 6 | stepper | dark | Five gates; inherited HLA decides display | L | Sci: HLA constraints; Load: Part B |
| ch06-tmb | 6 | chart | light | Burden spans >1,000×; sun/tobacco; MMR ≈ ×11 | L | Mob: 29 rows on a log axis |
| ch07-evidence | 7 | chart | light | Immunosuppression raises infection-driven cancers | M | low |
| ch07-immunoediting | 7 | sim | dark | T-cell pressure selects hidden cells: the three Es | XL | Sci: tuning targets; Perf: 600 cells; charts in a dark stage |
| ch07-cycle | 7 | explorer | dark | 7 steps; any break stalls; therapies repair or skip | L | Shared wheel API; Mob: node labels |
| ch07-tme | 7 | explorer | dark | Inflamed / excluded / desert; PD-1 blockers help mainly inflamed | L | Perf: ~60 SVG cells; Load: secondary layer |
| int-timeline | int | explorer | light | Decades of near-silence, then a burst after 2010 | L | Mob: separate vertical layout; marker collisions |
| ch08-blockade | 8 | explorer | dark | The drug covers one partner of the handshake; recognition still required | M | Vocab: off-palette PD-1/PD-L1 |
| ch08-two-brakes | 8 | stepper | dark | Anti-CTLA-4 widens priming; anti-PD-1 refreshes tumor T cells | L | Overlap with ch05; Mob: panel tabs |
| ch08-tail | 8 | chart | light | A durable tail, not a shifted median | M | Sci: smoothed curves; footnote must stay visible |
| ch08-side-effects | 8 | explorer | light | irAEs can hit any organ; rates by drug; glands often permanent | M | Mob: 13 hotspots crowd the head/neck |
| ch09-humanization | 9 | explorer | dark | The grip lives in 6 loops; the frame is swapped; names record it | M | 12-domain antibody art |
| ch09-wiring | 9 | explorer | dark | Blocking EGFR fails when KRAS is stuck on | S | low |
| ch09-adc | 9 | stepper | dark | Bind → swallow → release → kill; bystander effect | M | Sci: bystander overstated; payload glyph clash |
| ch09-bridge | 9 | sim | dark | Engagers make any T cell a killer; TCR-based ones need HLA | M | Perf: canvas, ~50 agents |
| ch10-build-a-car | 10 | explorer | dark | Signal 2 in the tail = persistence | M | low |
| ch10-journey | 10 | stepper | light | Vein to vein in ~3 weeks; expansion happens inside the patient | L | 9 bespoke vignettes; Mob: vertical |
| ch10-crs | 10 | sim | dark | Host macrophages make the fever; IL-6R block spares the therapy | M | Sci: curve offsets; chart in a dark stage |
| ch10-logic-gates | 10 | sim | dark | AND logic buys safety and costs escape | M | Sci: illustrative tag missing |
| ch11-hpv | 11 | chart | light | Vaccination cut cervical cancer; earlier is better | M | low |
| ch11-four-fixes | 11 | explorer | dark | A vaccine needs four links at once | L | Load: 4 switches × 2 scenes |
| ch11-personal-vaccine | 11 | explorer | dark | Choose by fit, standing out, clonality | L | Load; Mob: 8 cards |
| ch11-oncolytic | 11 | sim | dark | The virus bursts alarm-deaf cells → in-situ vaccine | L | Counters look like data |
| ch12-resistance | 12 | explorer | dark | Resistance = distinct breaks; anti-PD-1 fixes one | XL | 7 vignettes; Mob: very long stack |
| ch12-combinations | 12 | sim | dark | Repair the broken step; side effects cost | L | Mob; model sanity checks |
| ch12-neoadjuvant | 12 | stepper | dark | A tumor in place primes more clones | L | Two synced lanes; Mob: lane toggle |
| ch12-ctdna | 12 | chart | light | ctDNA sees relapse months before scans, above a floor | M | 2025–26 card facts |

**Mix:** 11 steppers, 12 simulations, 20 explorers, 7 charts; 39 dark and 11 light stages.

---

## 2. Overlaps and decisions

**A. Brakes cluster** (ch04-three-signals sequel, ch05-brakes, ch05-kill step 8, ch05-exhaustion, ch08-blockade, ch08-two-brakes, ch07-tme drug, ch11-four-fixes, ch12-resistance chip 1). Decision: **differentiate, with shared parts.** Each figure owns one question:
- **ch05-brakes** owns *why brakes exist and how they work*, with no drugs. It is rebuilt as a **stepper** (its 6 captions already exist) with a knockout toggle per scene. The free 0–72 h and 0–48 h scrubbers are dropped (XL → L). The ledger is the shared `activity-meter`.
- **ch05-exhaustion** owns *the stem-like reserve*. Implement it as deterministic keyframed populations (not a stochastic sim): XL → L.
- **ch08-blockade** owns *the molecular act of blocking*. It is the only drug close-up, built on the shared `synapse` scene.
- **ch08-two-brakes** owns *where each drug acts, and what the combination costs*. Its tumor panel reuses ch05-exhaustion's stem-like/terminal vocabulary verbatim and teaches nothing new about exhaustion. The same task builds both, so they match.
- **ch04-three-signals:** **cut the "Then what?" CTLA-4 sequel** (ch05-brakes scene 1 owns it) and the memory strip. Keep one line under the outcome readout: "The brake that follows → Chapter 5."
- The spec's request to build ch05-brakes scenes "for reuse by ch08-two-brakes" is **void**: the two scenes differ, and coupling them would serialize the build.

**B. Cancer-immunity cycle** (ch07-cycle, ch12-resistance, ch12-combinations). Decision: **shared component + differentiate.** All three use `shared/cycle-wheel.js` with one data module, `shared/cycle-data.js` (replacing the spec's `ch07-cycle-data.js`): STEPS, THERAPIES, MECHANISMS (resistance chips) and PROFILES (combination profiles). Roles:
- ch07 *learns* the steps (wheel-led).
- ch12-resistance *diagnoses*. It is led by its vignette; the wheel is a compact locator about 40% wide, with no tour.
- ch12-combinations *treats*. It is led by the wheel, with strength bars, meters and a tray.

Combination profiles A–D show the matching resistance chip's icon and the canonical ch07 term as a subtitle: A "Inflamed but braked" ↔ Brake on; B "Walled off (excluded)"; C "Cold desert"; D "Invisible to killer T cells" ↔ Shop window shut. Readers should see one story told three ways. One agent builds both ch12 figures.

**C. Tumor neighborhood** (ch07-tme, ch12-resistance vignettes 1/5/6, ch11-four-fixes tumor panel, ch12-combinations). Decision: **differentiate, no shared scene module.** A shared scene would serialize ch07 → ch12, so each figure draws its own scene from the art library. The vocabulary rules in §4 keep them consistent. ch12-resistance vignette 5 must look like ch07-tme "Excluded", and vignette 6 (left half) like "Desert".

**D. Lymph node + clonal expansion** (ch03-clonal-selection, ch04-lymph-node-search, ch04-three-signals, ch05-brakes knockout, ch08-two-brakes, ch11-four-fixes, ch11-oncolytic, ch12-neoadjuvant). Decision: **shared art + helpers, differentiated goals:**
- ch03 = selection, expansion and memory as a population over time.
- ch04-search = the search problem (rate and odds).
- ch12-neoadjuvant = clone breadth depends on the antigen supply.
- ch11-oncolytic = the tumor as its own vaccine.

All of them use art `lymphNodeField` for interiors, `cell-actions.divide()` for "photocopying", and `tcrKey` for clone identity. ch11-oncolytic and ch12-neoadjuvant tell the same tumor → DC → node → T cell → distant-site story. One agent builds both, with the same path and lane grammar.

**E. Contact and kill** (ch05-kill canonical; ch02-nk, ch03-antibody ADCC, ch04-mhc1 recognition, ch06-typo recognition, ch07-tme, ch08-*, ch09-bridge, ch10-*, ch11-*, ch12-*). Decision: **shared component** (`cell-actions.js` for SVG, `agents.js` for canvas). ch05-kill is built inside the same platform task, as the reference.

**F. MHC display** (ch04-mhc1-pathway, ch04-peptide-plus-groove, ch06-typo-to-target, ch09-bridge "other HLA", ch11-personal-vaccine shop windows, ch02-nk window slider). Decision: **shared art.** The art library adds `mhc1` pocket variants and an `mhcGroove` close-up. ch04-peptide-plus-groove and ch06-typo-to-target are one task, because typo-to-target's step 4 is peptide-plus-groove applied to a real patient.

**G. Choosing targets** (ch06-antigen-kinds, ch06-typo-to-target, ch06-tmb, ch11-personal-vaccine). Decision: **differentiate:** kinds = trade-off map; typo = gates for one mutation; tmb = counts, not targets; personal-vaccine = choosing plus clonality. ch11-personal-vaccine's tree **must copy ch06-clonal-evolution's tree style**: a thick labeled "trunk", hue-shifted branches with letter labels and hatches. ch06-antigen-kinds and ch11-personal-vaccine are one task.

**H. Library size** (ch03-vdj counter panel vs ch03-numbers ladder). Decision: **trim the VDJ counter** to "Heavy-chain choices: ≈40 × 23 × 6 = 5,520" plus the live tallies, and add "How big is the library? ↓". The ladder owns the orders of magnitude. Same task.

**I. Antibody anatomy** (ch01-scale stops 6–7, ch03-antibody, ch09-humanization, ch09-adc). Decision: **shared art.** Every antibody is the library `antibody()` with 12 domains at high detail. ch03-antibody and ch09-humanization are one task.

**J. Weakest-link models** (ch11-four-fixes min(P,K); ch12-combinations min over steps; ch12-resistance outcome badge). Decision: **one outcome vocabulary**, the foundation badge ✕ / ≈ / ✓ / ~. ch11-four-fixes tiers become ✕ "Little or no effect", ≈ "A response, no clear benefit" and ✓ (tier 2 text verbatim), replacing ○ ◐ ●.

**K. Body map** (ch05-thymus AIRE-off, ch05-brakes knockout, ch08-side-effects). Decision: **shared art** (`bodyMap`).

**L. Unit grids / "out of 100"** (ch01-census, ch05-thymus, ch06-typo scoreboard, ch08-tail, ch11-hpv, ch11-four-fixes dots). Decision: **shared component** (`unit-grid.js`).

---

## 3. Shared components to build once

All new code lives in `assets/js/figures/shared/`, owned by the platform task that builds it. Its API is frozen at the end of Wave 0, and later changes go by request. Art additions go into `assets/js/art/*` (art agent). UI additions go into `assets/js/ui/*` (foundation agent).

| Component | API sketch | Used by | Built by |
|---|---|---|---|
| `shared/cycle-wheel.js` + `shared/cycle-data.js` | `createCycleWheel(ctx, parent, { size, density:'full'\|'locator', bands, flow })` → `{ el, selectStep(n), setStates([{ step, state:'ok'\|'weak'\|'broken'\|'skipped'\|'replaced', strength }]), setFlow(0..1), ring(steps, kind:'acts'\|'entersAt'), halo({ dense:[2,3], faint:[6] }), setCenter(text), onStep(fn) }`. Data exports STEPS, THERAPIES, MECHANISMS, PROFILES, and STATUS strings (single source for every "approved / in trials / company-reported" phrase) | ch07-cycle, ch12-resistance, ch12-combinations | P5 |
| `shared/chart.js` | `scale({ type:'linear'\|'log', domain, range })`, `axis(g, { scale, orient, ticks, format, title, grid })`, `line(g, pts, { curve:'monotone'\|'linear', dash, width, color, drawIn })`, `bars(g, items, { whiskers })`, `band(g, { x0, x1, label, hatch })`, `threshold(g, { y, label })`, `axisBreak`, `directLabel`, `rows({ items, rowH, labelW, onSelect })` (focusable row bands with keyboard), `cursor(ctx, g, { domain, step, onMove })` (pointer + touch + keys, ARIA slider). `theme: 'light'\|'stage-dark'`, redraw on theme change | ch03-numbers, ch03-clonal-selection, ch05-exhaustion, ch06-tmb, ch07-evidence, ch07-immunoediting, ch08-tail, ch10-crs, ch10-journey, ch10-logic-gates, ch11-hpv, ch12-ctdna | P3 |
| `shared/unit-grid.js` | `unitGrid(g, { count, cols, size, gap, shape:'square'\|'circle'\|'person'\|'bead', group(i) })` → `{ setStates(states, { stagger }), highlight(group), relayout(fn, { duration }) }`; states: filled / outline / outline+check / dim / hatch | ch01-census, ch05-thymus, ch06-typo-to-target, ch08-tail, ch11-hpv, ch11-four-fixes | P3 |
| `shared/cell-actions.js` | **Stepper-safe** timeline builders (append to a passed `tl`; no state in `call()`): `approach`, `dock(tl, killer, target, { flatten })`, `recognize(tl, killer, at)` (glowPulse-like ring as a tween + green "+" badge), `polarize(tl, killer, toward)`, `kill(tl, killer, target, { perforin, duration })`, `detach`, `divide(tl, cell, n)` → daughters (same seed and `tcrKey`), `dockAntibody(tl, ab, glyph)`, `emit(tl, from, { kind:'cytokine'\|'interferon'\|'danger', color, n, r })`, `pulseAlong(tl, path, sign)`. Each has a free-running twin that returns a gsap timeline | ~25 figures (§2E) | P4 |
| `shared/agents.js` | Canvas crowd kit: `rateToP(k, dt)`, `spatialHash(cell)`, `walk(a, dt, { speed, bias })`, `relax(agents)`, `spriteStates(defs)` (preload per state), effects `killSpecks`, `divisionPinch`, `contactRing`. Seeded and deterministic | ch01-binding, ch03-clonal-selection, ch04-lymph-node-search, ch05-thymus, ch07-immunoediting, ch09-bridge, ch10-crs, ch10-logic-gates, ch11-oncolytic | P4 |
| `shared/activity-meter.js` | `meter(parent, { mode:'ledger'\|'gauge'\|'segments', orient, zones, segments:[{ id, label, sign }], tag:'Illustrative' })` → `{ set(values, { duration }) }`; signs render + / − icons | ch05-brakes, ch08-blockade, ch08-two-brakes, ch10-build-a-car, ch10-logic-gates, ch12-resistance, ch12-combinations, ch11-four-fixes | P4 |
| `shared/synapse.js` | Molecular gap built on the art `synapse` + `placeAlong`: `synapseScene(svg, { top, bottom, pairs:[{ kind:'tcr-mhc'\|'pd1-pdl1'\|'cd28-b7'\|'ctla4-b7'\|'car-antigen', n, peptide }], life:[2, 4] })` → `{ engage(kind, on), cap(kind, side, ab), pulses(on), setDisplay(on) }` | ch08-blockade (primary), ch04-three-signals contact band, ch05-kill lens, ch10-build-a-car membrane | P4 |
| **Art additions** (`assets/js/art`) | ① **seekable apoptosis** `setDying(cell, p)` (tweenable; `apoptosis()` runs its own loop and is not stepper-safe) ② `interferon` (hollow ring, sender color) ③ `dangerSpark` (pale-gold four-point star) ④ `tcrKey({ seed\|shape })` / `epitopeKey` (≥40 seeded notches + named triangle/star/diamond) ⑤ `lymphNodeField({ width, height })` (oval interior: reticular mesh, T-zone dots, follicle tint) ⑥ `mhc1({ pockets:[a,b] })` + `mhcGroove({ view:'top'\|'side', pockets, ridge, peptide:{ beads, anchors } })` ⑦ `vesicle({ kind:'endosome'\|'lysosome'\|'er' })`, `tapGate` ⑧ `mastCell` + palette key `mast` ⑨ macrophage `polarization: 0..1` ⑩ `bodyMap({ organs })` (front silhouette, organ glyphs, anchor coordinates, gender-neutral, no face) | Most figures | P2 |
| **Foundation additions** (`assets/js/ui`) | `ctx.ui.chips({ options, multi, max })` (card/chip tray, aria-pressed); `ctx.ui.infoCard()` (detail card: beside the stage on desktop, an inline panel under the stage on phones; **replaces every "bottom sheet"** in the specs); `ctx.ui.badge({ kind:'yes'\|'partial'\|'no'\|'varies' })`; `ctx.tag(text, corner)` (stage tags); `ctx.ui.clock()` (HUD time badge); icons: scalpel, syringe, pill, plane, thermometer, drop, bolt, padlock, sun, smoke, shield, block (⊣), tilde | ~30 figures | P1 |
| `shared/hero-kit.js` | `heroScene(ctx, { draw(svg, w, h), loop(t), still() })`: subject inside the central circle (the lens), schedule `every(sec, fn)`, reduced-motion still, consistent cell scale | 13 heroes | H |

**Single-use props** (hand, fingerprint, ribosome, selectins/integrins, complement and MAC pore, Fc receptor, EGFR, test tube, culture vessel, apheresis machine, anti-drug antibody) may be drawn locally in the figure, using palette tokens and ART stroke conventions. Anything used in **two or more figures** must come from the art library.

**File contention:** figure CSS goes inside the module, as one `<style>` scoped by `[data-figure="id"]`. No figure task creates `assets/css/chapters/chNN.css`, because several tasks share each chapter.

---

## 4. Visual-vocabulary rules (everywhere, no exceptions)

1. **Stages.** Biology is dark; data is light. **No paper insets inside dark stages.** The charts inside ch03-clonal-selection, ch05-exhaustion, ch07-immunoediting, ch10-crs and ch10-logic-gates are drawn *dark-native* with `chart.js theme:'stage-dark'`. This overrides the specs that ask for a light inset.
2. **Cells** come from library factories in canonical colors. Red blood cells are `redBloodCell` (not #9E2B3A). The mast cell is `mastCell`. TAMs are `macrophage({ variant:'tam' })` or a polarization of 0.8 or more; never label them "M2". Exhausted cells are `tCell({ state:'exhausted' })`. Activated T cells are drawn only when activated (naive cells never patrol tissue).
3. **MHC-I + peptide** uses `mhc1({ peptide })`. Peptide color = status: self is sand; any foreign or neo peptide is hot pink with a glow. Only ch04-mhc1-pathway, which contrasts virus with mutation side by side, may tint viral peptides red-coral, and only with its origin icons. **A shuttered window is absent cups, never empty cups on the surface.** Draw cups at ≥14 px whenever their identity matters.
4. **Surface antigens** (CAR, antibody and engager targets) use `antigen()` on a stalk; shape = identity. HER2 = diamond; a generic CAR or engager target = circle; logic-gate A = square, B = triangle. Peptides never stand on stalks, and antigens never sit in cups. EGFR is the only bespoke receptor (ch09-wiring).
5. **Recognition:** the TCR (`tcr`) meets `mhc1` head to head, then a recognition ring (`recognize()`, the T cell's color, white core) plus a green-cyan "+" disc at the contact. CD4 cells read `mhc2`.
6. **Kill grammar** (`cell-actions.kill`, from ch05-kill): dock and flatten → granules slide to the contact → perforin/granzyme puff only at lens scale → the target dies by `setDying` (shrink, blebs, fragments) → the killer detaches intact → optionally, a macrophage clears up. NK cells use the same grammar in orange. In crowds: shrink plus 4–6 specks fading over 0.6 s. Never an explosion, never engulfing. **Nothing flashes.** Every "brief flash" in the specs (ch07-tme, ch08-blockade) becomes a recognition ring.
7. **PD-1 / PD-L1:** library `pd1` (crimson stalk, socket head) **on T cells only**; `pdl1` (light crimson, plug head) on tumor, myeloid or tissue cells. An engaged pair has interlocked heads plus one crimson "−" disc on the T-cell side. This overrides ch08-blockade's blue PD-1 and violet PD-L1 and ch08-two-brakes' violet PD-L1. **⊣ never stands for PD-L1.**
8. **CD28 / CTLA-4 / B7:** `cd28` (green-cyan, "+"), `ctla4` (crimson, bar), `b7` (pale mint, **no icon**; the "+" belongs to CD28, overriding ch08-two-brakes). CTLA-4 appears only on activated T cells and Tregs.
9. **Drug antibodies:** `antibody({ variant:'therapeutic' })`, gold with a white outline. They bind with one arm tip capping the target head, Fc pointing away. They never kill and never sit on a cell type their target isn't on. **Natural antibodies** are gold with no outline. Bispecifics use `'bispecific'` / `bite()`. **ADC payloads are the library `adc` hexagons (#E6F7FF),** overriding ch09-adc's four-point stars, which belong to danger signals. Mouse-derived parts use `origin:'mouse'` (slate plus hatch), overriding #A3A9D6. CAR tails use library `car` costim glyphs (CD28 rounded square, 4-1BB hexagon, overriding ch10-build-a-car's circle/square).
10. **Signals and outcomes:** activating = green-cyan "+" disc; inhibitory = crimson "−" bar disc (`signalIcon`); ✓ = passes or recognized; ✕ = fails or dies (ch05-thymus "deleted" uses ✕, not "−"); ≈ = partial; ~ = varies; ⊣ (crimson) = a blocked step or gate.
11. **Danger:** dying or burst cells release `dangerSpark`s. An alarmed DC is `dendriticCell({ state:'mature' })`; a quiet one is `'immature'`. In ch02, molecular DAMPs keep their specific tokens.
12. **Cytokines** are solid dots in the **sender's** color. **Interferons are hollow rings in the sender's color**: coral in ch02 (overriding #9FD3FF), blue IFN-γ in ch05/07/12, sand in ch11-oncolytic. IL-6 = coral (macrophage); IL-12 = green dots.
13. **Clone identity = `tcrKey` notch on the TCR tip**, with the matching `epitopeKey` on the antigen. This replaces ch08-two-brakes' stripe/dot/chevron patterns. ch12-neoadjuvant uses the named triangle/star/diamond keys, with hot-pink matching glyphs.
14. **Lymph nodes:** `lymphNodeField` for interior scenes and `lymphNode` for maps and icons. Label "LYMPH NODE" in t-caps.
15. **Subclones** use `cancerCell({ clone })` / `shiftHue` ≤ ±25°, **always** with a letter or hatch.
16. **Time and phase:** a HUD at the top left (`ctx.ui.clock`): clock icon plus phrase or value in tabular Inter. Compressed time always says "Time compressed". Day counters never run backward. Phases are labeled bands behind charts and grouped step dots in steppers.
17. **Stage tags:** "Not to scale", "Illustrative", "Time compressed", top right in t-caps and `--fg-3`, two at most. Any figure with invented quantities carries "Illustrative".
18. **"Most fail":** show attrition *in the scene* (fragments fade, cells fall away), then show the endpoint as a `unitGrid`. **Never a funnel with per-stage numbers** unless every stage is measured. A demo ratio ("1 in 400") always sits beside the real one on screen.
19. **Real vs stylized numbers:** real data goes on a light stage with a visible source line (ink-3, 12 px) and per-mark source tooltips. Teaching-model outputs are words, meters or tiers labeled "Illustrative, not measured", **never percentages**. A sim counter that looks like data (ch11-oncolytic) gets an "Illustrative" tag beside it.
20. **Chart color:** data series use `--chart-1…5`, not entity colors, unless the series *is* an entity (T-cell counts in blue, cancer DNA in violet). ch08-tail's crimson/indigo/gold become chart tokens, plus line styles. int-timeline lanes map to chart tokens.
21. **Guided-then-free:** every explorer with Back/Next runs through `ctx.ui.stepper` and ends by unlocking all controls. There are no hand-rolled steppers.
22. **Molecular labels:** plain names by default; molecular names in a toggle or in "i" chips. In-SVG text stays at 1–4 words.

---

## 5. Diversity and pacing

**Kinds:** a good mix. In reading order there is no run of more than two steppers or two simulations. The one repetition is four explorers in a row (ch07-cycle, ch07-tme, int-timeline, ch08-blockade), but they are visually unlike each other (wheel, tissue, timeline, molecules), so it is acceptable. The real repetition is **guided Back/Next in about 22 figures**. Rule 21 makes it predictable instead of tiresome: short guided paths, then free play.

**Weight is front-loaded.** Part I carries 9 of the 13 XL figures. ch05 (thymus, kill, brakes, exhaustion) and ch03 (vdj, clonal-selection, antibody) are the heaviest chapters; Part III chapters are lighter. Reductions decided above or here:
- ch05-brakes becomes a stepper; ch05-exhaustion is keyframed; ch04-three-signals loses its sequel and memory strip.
- **ch02-pattern-recognition:** cut drag-and-drop (tap and keyboard only); show sensor names as numbered badges on every screen size, with the names in the legend.
- **ch12-resistance:** vignette 7 (host factors) becomes a static icon trio; vignette 2 (nothing new to see) becomes a short non-looping sequence; XL → L.
- **ch05-thymus:** at most 20 animated foreground cells during the run; the rest are canvas dots.
- **ch01-gene-to-protein:** the sandbox chips are the primary path; free tapping of letters is secondary.

**Ideas without a figure:**
- *CD4 helpers* (ch05 "The conductors"): covered ambiently by the ch05 hero (§6). No new interactive.
- *Biomarkers* (ch08): link back to ch06-tmb; no new figure.
- *Naked antibody mechanisms in ch09:* ch03-antibody's "Target: cancer cell" toggle covers them; ch09 text links to it.
- *Oncogene vs tumor suppressor:* stays in text; ch09-wiring later shows "stuck on".

**No new figures are added.** **No cuts are required.** If the schedule slips, cut in this order:
1. ch02-macrophage-spectrum: the text plus ch07-tme's TAMs carry the idea.
2. ch03-numbers: becomes a static ladder.
3. ch12-ctdna's blood-sample panel: drop it and keep the chart.

---

## 6. Chapter hero vignettes

**Common spec:**
- Dark lens, `tissueField` background with defocused ghosts, 3–7 foreground cells at r ≈ 28–60 in a ~600-unit view.
- Subject inside the central circle; no labels, no controls, `aria-hidden`.
- One quiet event every 20–40 s, with art helpers registered via `ctx.track`; reduced motion shows the key moment as a still.
- No hero repeats the home hero's patrol-and-kill.

| Page | Vignette |
|---|---|
| ch01 | A sand body cell breathes at the center while pale ligands drift past its receptors; a few dock with a soft glow and later let go. |
| ch02 | A coral macrophage crawls through tissue and engulfs a drifting chartreuse bacterium as a neutrophil crawls past (promote `demo-hero`). |
| ch03 | Gold B cells drift, each wearing a different receptor-tip key; a passing antigen fits one, which glows and splits into a small clone of identical keys. |
| ch04 | A mature dendritic cell waves dendrites studded with pink peptides; blue T cells brush past, and every half-minute one docks and glows. |
| ch05 | A teal helper T cell docks on a dendritic cell; teal cytokine dots reach a nearby blue killer, which crossfades to its activated form and crawls off. |
| ch06 | Among calm sand cells, one violet cancer cell slowly pinches in two; its daughters, a shade apart in hue, nudge the healthy neighbors aside. |
| ch07 | A blue killer approaches a small cancer cluster; one cell's shop window quietly sinks away (crossfade to `hidden`), and the T cell passes it by. |
| interlude | At the lens center, three silhouettes dissolve into one another: a chartreuse bacterium (Coley), a white-outlined gold antibody, a blue CAR-T cell. |
| ch08 | A dim T cell sits docked to a cancer cell, its PD-1 and PD-L1 locked; gold drug antibodies drift in and cap PD-1, and the T cell brightens and polarizes its granules. |
| ch09 | White-outlined gold antibodies settle tips-first onto a cancer cell's surface antigens, while one bispecific quietly bridges a passing T cell to it. |
| ch10 | A CAR-T cell, studded with gold binders, touches a cancer cell's antigen knob, then splits into two CAR-T cells that drift apart. |
| ch11 | An immature dendritic cell takes up a few tiny vaccine particles and slowly matures: its dendrites lengthen and pink peptides appear in its windows. |
| ch12 | At the edge of a cold violet tumor nest, blue T cells trickle one by one out of a vessel and into the nest: a cold tumor slowly turning hot. |

---

## 7. Scientific and honesty red flags

1. **ch07-cycle THERAPIES, car-t status:** "first solid-tumor approval (stomach cancer, China, 2026)" must read "approved in China (June 2026)" — **supervisor-verified: a regular NMPA approval, not conditional** (CARsgen release; OncLive).
2. **One string per recent claim.** Every mention of the personalized mRNA vaccine's phase 3 result (int-timeline, ch07-cycle, ch11-four-fixes, ch12-combinations) says "company-reported" and "not yet approved". These strings live in `cycle-data.js` STATUS, and the others copy them verbatim. The IMvigor011 "FDA approval May 2026" in the ch12-ctdna card and the satri-cel claim must be re-verified against their sources before ship. Builders do not edit them.
3. **Unlabeled stylized numbers.** Add an "Illustrative" tag to:
   - ch11-oncolytic counters (25 → 5, 12 → 9);
   - ch10-logic-gates meters;
   - ch02-nk-missing-self ("Simplified model");
   - ch05-thymus, where the "Illustrative" subtitle must stay visible during the AIRE-off run.
4. **ch03-clonal-selection mixes three sources** (B-cell field, mouse CD8 counts, human antibody timing). The disclosure sentence must sit *on the stage* under the chart, not only in a caption, and the top panel is titled "Killer T cells in mice (measured)".
5. **ch09-adc:** "all or nearly all 7 die" overstates the bystander effect. Under T-DXd, one HER2-0 cell that touches no dying cell survives.
6. **ch10-logic-gates:** "Attack A" killing *every* healthy lung cell needs the "Illustrative" tag; on-target/off-tumor harm depends on how much antigen the cells carry.
7. **ch12-neoadjuvant step 6:** the deterministic relapse lane gets an on-stage tag "one possible course", alongside the caption's hedging.
8. **ch08-blockade:** the gauge always reaches "killing" with a drug. Keep the "Illustrative" tag visible and never animate a kill without displayed neoantigen (as specced).
9. **ch03-vdj and ch03-numbers disagree on light-chain choices (320 vs 325).** Use "≈325" in both.
10. **ch08-tail:** the smoothing footnote and "earlier trial" note must remain visible on phones, not collapsed.
11. **Checked and fine:** ch06-typo-to-target's "1.6%" (Parkhurst 2019, confirmed against the PubMed abstract, doi:10.1158/2159-8290.CD-18-1494); the ch06-tmb ratios (≈150×, ≈11×, ≈37×); the ch08-tail decline rates; the ch08-side-effects death ratios; the int-timeline milestone count (28).

---

## 8. Build plan

**Task list** (effort in units; target 5–8 per agent; XL figures run solo):

| Task | Scope | Units | Depends on |
|---|---|---|---|
| **P1** Foundation additions | chips, infoCard, badge, stage tags, clock, icons | 4 | — |
| **P2** Art additions | items ①–⑩ (§3), delivered in that order | 7 | — |
| **P3** Chart kit | `chart.js`, `unit-grid.js` + **ch07-evidence**, **ch06-tmb** | 8 | P1 |
| **P4** Cell kit | `cell-actions.js`, `agents.js`, `activity-meter.js`, `synapse.js` + **ch05-kill** | 7 | P2 ① |
| **P5** Cycle wheel | `cycle-wheel.js`, `cycle-data.js` + **ch07-cycle** | 6 | P1 |
| F1 | ch01-scale | 5 | — |
| F2 | ch01-gene-to-protein + ch01-binding | 7 | — (binding adopts `agents.js` if ready) |
| F3 | ch03-vdj + ch03-numbers | 7 | P3 for numbers (build vdj first) |
| F4 | ch06-clonal-evolution | 5 | — |
| F5 | ch02-pattern-recognition + ch02-macrophage-spectrum | 6 | P1, P2 |
| F6 | ch02-inflammation | 5 | P2, P4 |
| F7 | ch02-nk-missing-self + ch04-mhc1-pathway + ch04-cross-presentation | 7 | P2, P4 |
| F8 | ch03-clonal-selection + ch04-lymph-node-search | 7 | P2–P4 |
| F9 | ch03-antibody + ch09-humanization | 7 | P2, P4 |
| F10 | ch04-peptide-plus-groove + ch06-typo-to-target | 6 | P2–P4 |
| F11 | ch04-three-signals + ch05-brakes | 7 | P2, P4 |
| F12 | ch05-thymus | 5 | P2–P4 |
| F13 | ch05-exhaustion + ch08-two-brakes | 7 | P2–P4 |
| F14 | ch06-antigen-kinds + ch11-personal-vaccine | 5 | P1–P4; ch06-clonal-evolution tree (F4) |
| F15 | ch07-immunoediting | 5 | P3, P4 |
| F16 | ch07-tme + ch11-four-fixes | 6 | P1, P2, P4 |
| F17 | ch08-blockade + ch08-tail + ch08-side-effects | 6 | P1–P4 |
| F18 | ch09-wiring + ch09-adc + ch09-bridge | 5 | P2, P4 |
| F19 | ch10-build-a-car + ch10-crs + ch10-logic-gates | 6 | P3, P4 |
| F20 | ch11-oncolytic + ch12-neoadjuvant | 6 | P2, P4 |
| F21 | ch12-resistance + ch12-combinations | 7 | P1, P4, P5 |
| F22 | ch01-census + ch11-hpv + ch12-ctdna | 6 | P1, P2 (mast hue), P3 |
| F23 | int-timeline + ch10-journey | 6 | P1, P3 |
| H | `hero-kit.js` + 13 heroes (art agent) | 6 | P2, P4 |
| Q | Cross-figure vocabulary QA: screenshots of all 50 at 1440 and 390, against §4; fixes routed to owners | 4 | all |

That is **5 platform tasks and 24 figure tasks (F1–F23 plus H)**, then one QA pass. Several platform tasks also build figures (ch05-kill, ch07-evidence, ch06-tmb, ch07-cycle), so each kit has a real first user.

**Waves** (at most 20 concurrent agents):
- **Wave 0** (9 agents): P1–P5 and F1–F4. F1–F4 need no new shared code. P2 is the critical path, so it delivers in two drops: ①–⑤ early, ⑥–⑩ by the end of the wave. P3 publishes its API in `docs/FIGURES.md` §16 (foundation edit via P1) before building its own figures.
- **Wave 1** (16 agents, starting when P1–P5 are done; ≤ 20 with F1–F4 still running): F5–F13 and F15–F21. Longest first: F8, F11, F13, F21, F7, F9.
- **Wave 2** (4 agents, as slots free up): F14 (after F4, for the tree style), F22, F23, H.
- **Wave 3** (1 agent): Q.

**Rules for every builder:**
- Read §4 before drawing anything.
- Import only from `../art/index.js`, `./shared/*` and `ctx`.
- Request missing multi-use art instead of drawing it.
- Keep figure CSS inside the module.
- Keep captions verbatim.
- If a spec conflicts with §4, follow §4 and note it in your report.

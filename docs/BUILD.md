# Builder brief (read before building any figure or shared component)

You are building part of "Self & Other", a premium interactive science site (see `docs/PLAN.md`). The figures are the heart of the site: each must teach one idea beautifully and correctly.

## Read first
1. `docs/PLAN.md` — vision, audience (curious, science-interested lay adults), art direction (§4).
2. `docs/aggregate/FIGURE-AUDIT.md` — **§4 Visual-vocabulary rules are binding** (they override individual specs). §2 says which figure owns which idea; §3 lists shared components and their APIs.
3. `docs/DESIGN.md`, `docs/FIGURES.md` (figure module contract, `ctx` API, stepper, art-library integration, `ctx.track`), `docs/ART.md` (cells, molecules, scenes, animation helpers, sprites).
4. Your figure's spec: the `:::figure <id>` block in `content/drafts/NN-*.md` (title, goal, spec, steps, data, alt) **and the surrounding chapter text**, so the figure matches the narrative. `steps` captions are shown to readers verbatim — never rewrite them in code; they arrive via ctx.
5. Reference implementations: `assets/js/figures/demo-*.js`, `assets/js/figures/home-*.js`.

## Rules
- Module: `assets/js/figures/<id>.js`, default export `mount(fig, ctx)`. Import only from `../art/index.js`, `./shared/*`, `../vendor/gsap/…` (or `ctx.gsap`) and `ctx`. No new dependencies.
- Figure CSS lives inside the module (one `<style>` scoped by `[data-figure="<id>"]`, injected once). Never create or edit shared CSS files, `assets/css/chapters/*`, drafts, or generated HTML pages.
- Never edit files you don't own. Shared components belong to their platform task; art to the art agent; `ctx`/UI to the foundation agent. If you need something missing, implement a local fallback and list the request in your report (multi-use art must eventually come from the library).
- If the spec conflicts with FIGURE-AUDIT §4, follow §4 and say so in your report. If the spec is scientifically doubtful or infeasible, keep the learning goal, simplify honestly, and report it.
- Stepper-driven figures use `ctx.ui.stepper` (no hand-rolled steppers); every step must be reachable by Back and by dot-jump with an identical end state (`node tools/stepper-check.mjs`).
- Mobile (390px) must be genuinely good: re-layout rather than shrink; in-figure text ≥ ~13px rendered; tap targets ≥ 44px; no horizontal overflow.
- Light-stage figures must look right in both page themes (re-render on theme change). Dark stages look the same in both.
- `prefers-reduced-motion`: no ambient loops; steppers jump to end states; simulations show a meaningful still or step manually.
- Performance: no work while off-screen (`ctx.loop`, `ctx.track`); ≤ ~60 animated SVG cells or use canvas sprites; no layout thrash; 60fps on a laptop.
- Accessibility: keyboard-operable controls, aria labels, live captions; never encode meaning by color alone.
- Invented/stylized quantities carry an on-stage "Illustrative" tag (§4 rule 17/19). Real data shows its source line.

## Build & QA loop (iterate until it's genuinely beautiful and correct)
- Rebuild the page: `node tools/build-content.mjs --only NN` (safe to run concurrently).
- Screenshot: `node tools/shot.mjs --page NN-slug.html --figure <id> --viewport desktop,mobile --theme light,dark [--click next --times N] [--reduced-motion]` (see `tools/README.md`). **Read the PNGs** and critique them like an art director and a scientist: composition, hierarchy, legibility, color, motion timing, does it teach the goal at a glance? Do at least 3 improvement rounds.
- `node tools/stepper-check.mjs --page NN-slug.html --figure <id>` for steppers; `node tools/check.mjs` must show no errors for your page (other figures may still be pending).
- Check the console output of shot.mjs (no errors/warnings from your module).
- Keep scratch files (screenshots, experiments) in a temporary folder outside the repository, or under `tools/out/`, which is git-ignored.

## Final report (under 150 words)
Figures/components built; deviations from spec (and why); requests for shared code/art; known limitations. No code in the report.

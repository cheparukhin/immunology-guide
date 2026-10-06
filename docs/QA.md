# Figure review brief (Q2)

Every figure is now built by a different agent. You review a set of figures **as an expert scientist, an art director, and a QA engineer at once**, and you **fix what you find directly** in the figure modules you've been assigned (you own them exclusively during this pass). The goal: every figure is scientifically correct, consistent with the chapter text and with the rest of the site, beautiful, legible on phones, accessible and fast.

## Read first
`docs/PLAN.md` (§1 audience, §4 art direction) · `docs/aggregate/FIGURE-AUDIT.md` **§4 visual-vocabulary rules (binding)** and §7 · `docs/BUILD.md` · `docs/FIGURES.md` · `docs/ART.md` · `docs/aggregate/EDITOR-REVIEW.md` "Global decisions" (terminology & canonical numbers). For each figure: its `:::figure` spec and the surrounding chapter text in `content/drafts/NN-*.md`.

## For each figure
1. **Walk it fully**: every step (stepper), every control state/preset/toggle, the free-play end state, at desktop (1440) and phone (390), light and dark page themes, and reduced motion. Use `node tools/shot.mjs` (`--click next --times N`, `--eval` to set states), `node tools/stepper-check.mjs`, and Read the screenshots carefully (zoom with `--selector` crops when needed).
2. **Science**: is everything shown and written on stage correct and consistent with the chapter text and the canonical numbers? (Sizes, what binds what, order of events, which cell does what, labels, numbers/data with sources, "Illustrative" tags on stylized quantities, company-reported labels.) No misleading simplification. Captions come from the draft — if a caption itself is wrong, list it (don't edit drafts).
3. **Consistency**: §4 rules (colors, glyphs, recognition/kill grammar, PD-1/PD-L1, antibodies, interferons, clone keys, badges, tags, time HUD, chart tokens) and consistency with sibling figures (same entity drawn the same way across the site).
4. **Craft**: composition, hierarchy, legibility (in-figure text ≥ ~13px rendered on phones; tap targets ≥ 44px), no overlaps/clipping, motion timing (no step > ~8 s without reason; nothing flashes), elegant empty states, no layout jumps.
5. **Robustness & performance**: no console errors/warnings; stepper back/dot-jump states identical; no work off-screen; measure FPS and SVG node count (e.g. `--eval` with `performance.now()`/`requestAnimationFrame` sampling and `document.querySelectorAll('[data-figure=ID] *').length`); aim ≥ 50 fps on desktop during animation and keep node counts sane (> ~3,000 nodes is a smell — simplify or move crowds to canvas).
6. **Accessibility**: keyboard path through controls, focus visible, aria labels, the fallback/alt text matches what the figure shows, nothing encoded by color alone.

## Fix
- Fix issues directly in your assigned `assets/js/figures/<id>.js` modules (and figure-scoped CSS inside them). Keep fixes surgical; re-run stepper-check and screenshots after each fix.
- Don't edit shared components (`assets/js/figures/shared/*`, `assets/js/art/*`, `assets/js/ui/*`, `site.js`, CSS) or drafts. If a fix needs a shared change or a caption/spec change, write it up precisely in your log (file, line, exact change).
- Rebuild pages with `node tools/build-content.mjs --only NN` if needed (safe concurrently).

## Log
Write `docs/aggregate/QA-figures-<your-set>.md`: per figure — status (✓ shipped / fixed / needs shared change), issues found and what you changed, remaining issues with severity, fps and node count. Final report (under 200 words): counts, the most serious issues found/fixed, and the exact list of shared-code or caption changes you need.

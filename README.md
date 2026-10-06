# Self & Other

An illustrated, interactive guide to the immune system and cancer immunotherapy, written for curious adults without a biology background. It has twelve chapters and a history interlude, more than 50 interactive figures, a glossary and full source lists. The content is current as of October 2026.

**Contents:** cells and molecular recognition · innate immunity · adaptive immunity · antigen presentation · T-cell selection, killing and regulation · cancer cells and tumor antigens · immune surveillance and tumor escape · a history of immunotherapy · checkpoint inhibitors · therapeutic antibodies · cell therapies · cancer vaccines and oncolytic viruses · resistance and new directions.

> The guide was researched, written, illustrated and fact-checked by AI (Anthropic's Claude), working from published research and regulatory documents, with a source for every claim. It has not yet been reviewed by an immunologist. It is for understanding, **not medical advice**. `about.html` explains how it was made.

## Read it locally

The site is static: plain HTML, CSS and ES modules, with no build step needed to view it. ES modules must be served over HTTP:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000. Any static host works, including GitHub Pages, and the site also runs from a subfolder because all paths are relative.

## How it is organized

| Path | What it is |
|---|---|
| `index.html`, `01-cells.html` … `12-frontier.html`, `interlude-history.html`, `glossary.html`, `sources.html`, `about.html` | The pages. Chapter, glossary and sources pages are **generated**; don't edit them by hand. |
| `content/drafts/*.md` | The chapter text: Markdown plus directives for figures, "Go deeper" boxes, quizzes, glossary entries and sources. Edit these. |
| `content/glossary.md` | Canonical glossary definitions (they override the chapter drafts). |
| `assets/js/figures/*.js` | One module per interactive figure. `shared/` holds reusable kits: charts, cell animations, the cancer-immunity-cycle wheel and others. |
| `assets/js/art/` | The illustration library of cells and molecules. `art-gallery.html` shows every piece. |
| `assets/js/site.js`, `assets/js/ui/`, `assets/css/` | Site shell, components and design system. |
| `docs/` | Plan, style guide (`STYLE.md`), design system, figure contract (`FIGURES.md`), art library (`ART.md`), and the review and QA reports from the build (`docs/reviews`, `docs/aggregate`). |
| `tools/` | Dev-only tooling. See `tools/README.md`. |

## Editing workflow

```bash
cd tools && npm install && cd ..   # once: dev tooling (Playwright, marked)
node tools/build-content.mjs       # regenerate pages from content/drafts
node tools/check.mjs               # site-wide check: errors, links, glossary, overflow
node tools/shot.mjs --page 05-t-cells.html --figure ch05-kill --viewport desktop,mobile
```

Writing follows `docs/STYLE.md`: plain, exact prose for an intelligent non-specialist, with correct scientific terms explained at first use.

## Notes

- Before deploying to a public domain, set `site.url` in `assets/data/chapters.json` and rebuild, so social-share previews get absolute URLs.
- Tested in Chromium and WebKit (Safari). Firefox has not been tested.
- `tools/stage-artifact.sh <dir>` packages the site for publishing as a Claude Artifact.

## License

- **Text, figures and illustrations** are licensed under [Creative Commons Attribution-NonCommercial 4.0](https://creativecommons.org/licenses/by-nc/4.0/) (CC BY-NC 4.0); see [`LICENSE-CONTENT.md`](LICENSE-CONTENT.md). This covers the chapter text and glossary (`content/`, `assets/data/`), the rendered pages, the figure and illustration modules (`assets/js/figures/`, `assets/js/art/`), images (`assets/img/`) and `docs/`.
- **Code** (the site shell, UI components, styles and tooling: `assets/js/site.js`, `assets/js/ui/`, `assets/css/`, `tools/`) is licensed under the [MIT License](LICENSE).
- **Third-party:** GSAP (`assets/vendor/gsap/`) is used under GreenSock's standard no-charge license. The fonts in `assets/fonts/` (Fraunces, Inter, Source Serif 4) are under the SIL Open Font License; their license files are included.

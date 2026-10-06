// int-timeline — "130 years of immunotherapy, at a glance" (interlude).
//
// ONE idea: almost nothing for decades, then a crowded burst after 2010.
// Desktop: a linear 1885 → 2027 axis (never compressed) with five modality lanes
// (chart tokens, FIGURE-AUDIT §4 rule 20), three faint era bands, a "Now" line and a
// source line (rule 19). Markers: ring = finding, diamond = approval, ⊘ = setback.
// Labels appear only where they fit; elsewhere on hover / focus, or when one lane is
// chosen (then forced, with leader lines). Phones (< 768 px): a vertical list with a
// rail, dashed dividers for gaps longer than 10 years, and the detail card inline under
// the tapped row. Every milestone opens ctx.ui.infoCard. The personalized-vaccine card
// copies the shared STATUS strings verbatim (FIGURE-AUDIT §7.2).
// All milestone text is the draft's verified `data` JSON, embedded below unchanged.
import { scale, chartRoot, axis, chartFrame } from './shared/chart.js';
import { STATUS } from './shared/cycle-data.js';

const DATA = // verbatim from content/drafts/interlude-history.md (figure int-timeline, data)
{
  "lanes": [
    {"id": "ideas",       "label": "Ideas & recognition",            "glyph": "book",      "description": "Theories, lab discoveries and prizes that changed what people thought was possible."},
    {"id": "microbes",    "label": "Microbes, cytokines & vaccines", "glyph": "bacterium", "description": "Stimulating immunity with microbes, cytokines or vaccines (Chapter 11; cytokines return in Chapter 12)."},
    {"id": "antibodies",  "label": "Antibody drugs",                 "glyph": "y",         "description": "Lab-made antibodies that mark or block cancer cells, carry drugs into them, or link T cells to them (Chapter 9)."},
    {"id": "checkpoints", "label": "Checkpoint inhibitors",          "glyph": "brake",     "description": "Antibodies that release the brakes on T cells (Chapter 8)."},
    {"id": "cells",       "label": "Cell therapies",                 "glyph": "cell",      "description": "T cells removed, multiplied or engineered, then returned to the patient (Chapter 10)."}
  ],
  "types": ["finding", "approval", "setback"],
  "sources_note": "Numbers refer to this chapter's Sources list. US approval dates come from FDA announcements and records [8].",
  "milestones": [
    {"id": "coley-1891", "date": "1891", "lane": "microbes", "type": "finding", "tag": "Clinical experiment",
     "title": "Coley's toxins", "short": "Coley's toxins",
     "what": "New York surgeon William Coley injects streptococcal bacteria into a patient's tumor and sees it shrink. He soon switches to heat-killed bacteria, 'Coley's toxins', and treats close to a thousand patients.",
     "why": "The first sustained, systematic attempt to fight cancer by provoking an infection-like reaction (German doctors had tried it before him). Dramatic in some patients, it was inconsistent, never properly tested and eclipsed by radiation.",
     "chapter": "11-vaccines", "sources": [1, 2]},
    {"id": "surveillance-1957", "date": "1957", "lane": "ideas", "type": "finding", "tag": "Idea",
     "title": "Immunosurveillance", "short": "Immunosurveillance",
     "what": "Building on a 1909 guess by Paul Ehrlich, Macfarlane Burnet (1957) and Lewis Thomas (1959) propose that lymphocytes patrol the body and destroy newly transformed cells before they become tumors.",
     "why": "It gave tumor immunology a guiding theory, and gave skeptics a clear target.",
     "chapter": "07-escape", "sources": [2, 3]},
    {"id": "nude-1974", "date": "1974-02", "lane": "ideas", "type": "setback", "tag": "Setback",
     "title": "The nude-mouse 'disproof'", "short": "Nude mice",
     "what": "Osias Stutman finds that nude mice, which lack most T cells, develop no more chemically induced tumors than normal mice.",
     "why": "Widely read as disproving immunosurveillance, it pushed the idea out of fashion for about 25 years. Chapter 7 explains why the experiment misled.",
     "chapter": "07-escape", "sources": [3, 21]},
    {"id": "hybridoma-1975", "date": "1975-08", "lane": "antibodies", "type": "finding", "tag": "Lab finding",
     "title": "Monoclonal antibodies", "short": "Monoclonal antibodies",
     "what": "Georges Köhler and César Milstein in Cambridge fuse antibody-secreting B cells with immortal myeloma (cancer) cells. The resulting 'hybridomas' secrete unlimited amounts of one chosen antibody. They shared the 1984 Nobel Prize with Niels Jerne.",
     "why": "Antibodies became precision tools and, two decades later, drugs. Every checkpoint inhibitor approved so far is an antibody.",
     "chapter": "09-antibodies", "sources": [4, 2]},
    {"id": "bcg-1976", "date": "1976-08", "lane": "microbes", "type": "finding", "tag": "Clinical study",
     "title": "BCG for bladder cancer", "short": "BCG",
     "what": "Alvaro Morales and colleagues wash the bladders of patients with recurring superficial bladder tumors with BCG, a tuberculosis vaccine, and recurrences fall in their first 9 patients. US approval for bladder cancer follows in 1990.",
     "why": "Coley's idea, done locally and reproducibly. BCG is still a mainstay of early bladder-cancer treatment.",
     "chapter": "11-vaccines", "sources": [5, 8]},
    {"id": "il2-1984", "date": "1984-11", "lane": "microbes", "type": "finding", "tag": "Clinical trial",
     "title": "First IL-2 responder", "short": "IL-2 works",
     "what": "At the US National Cancer Institute, a 33-year-old woman with widespread melanoma responds to very high doses of interleukin-2, a cytokine that drives T cells to proliferate. Her tumors disappear within months, and nearly 30 years later she was still disease-free.",
     "why": "An immune-only treatment could erase large tumors, at the cost of severe toxicity. IL-2 was approved for kidney cancer (1992) and melanoma (1998); roughly 5–10% of patients respond completely.",
     "chapter": "12-frontier", "sources": [6]},
    {"id": "ctla4-1987", "date": "1987", "lane": "checkpoints", "type": "finding", "tag": "Lab finding",
     "title": "CTLA-4 found", "short": "CTLA-4 found",
     "what": "Pierre Golstein's lab in Marseille finds CTLA-4, a T-cell molecule of unknown function. In 1994–95 two groups show that it is an inhibitory receptor, a brake on T-cell activation.",
     "why": "The first of the brakes that checkpoint drugs would later release.",
     "chapter": "05-t-cells", "sources": [2]},
    {"id": "til-1988", "date": "1988-12", "lane": "cells", "type": "finding", "tag": "Clinical trial",
     "title": "TIL therapy", "short": "First TIL",
     "what": "Steven Rosenberg's team grows T cells out of patients' melanomas, expands them with IL-2 and infuses them back. Tumors shrink in about half of the first 20 patients.",
     "why": "It showed that a patient's own T cells, expanded outside the body, can attack cancer. This is the root of later cell therapies.",
     "chapter": "10-cell-therapy", "sources": [6]},
    {"id": "car-1989", "date": "1989-12", "lane": "cells", "type": "finding", "tag": "Lab finding",
     "title": "Antibody-guided T cells", "short": "Early CAR",
     "what": "Zelig Eshhar's group at the Weizmann Institute gives T cells receptors built partly from antibodies, among the first chimeric antigen receptors (CARs). A Japanese team had reported a similar design in 1987, and Eshhar's 1993 single-chain version became the template for today's CARs.",
     "why": "The blueprint for CAR-T cells, though two more decades of redesign were needed before they worked in patients.",
     "chapter": "10-cell-therapy", "sources": [12, 13]},
    {"id": "pd1-1992", "date": "1992-11", "lane": "checkpoints", "type": "finding", "tag": "Lab finding",
     "title": "PD-1 found", "short": "PD-1 found",
     "what": "Tasuku Honjo's lab in Kyoto, studying genes expressed during apoptosis (programmed cell death), finds PD-1 ('programmed death-1'). Mice lacking it later reveal it as a second brake on T cells.",
     "why": "PD-1 and its ligand PD-L1 are the targets of most of today's checkpoint inhibitors.",
     "chapter": "05-t-cells", "sources": [2]},
    {"id": "ctla4block-1996", "date": "1996-03", "lane": "checkpoints", "type": "finding", "tag": "Lab finding",
     "title": "Releasing the brake", "short": "Releasing the brake",
     "what": "Dana Leach, Matthew Krummel and James Allison show that an antibody blocking CTLA-4 makes mice reject established tumors and stay immune to them afterward.",
     "why": "A new strategy: remove the immune system's brake instead of stimulating it, without needing to know what the T cells recognize.",
     "chapter": "08-checkpoints", "sources": [9, 2]},
    {"id": "rituximab-1997", "date": "1997-11-26", "lane": "antibodies", "type": "approval", "tag": "Approval",
     "title": "Rituximab", "short": "Rituximab",
     "what": "Rituximab (Rituxan), which marks lymphoma cells carrying the CD20 molecule for destruction, becomes the first monoclonal antibody approved in the US to treat cancer. Trastuzumab (Herceptin), for HER2-positive breast cancer, follows in 1998.",
     "why": "Köhler and Milstein's lab tool becomes a mainstream cancer drug.",
     "chapter": "09-antibodies", "sources": [8]},
    {"id": "hpv-2006", "date": "2006-06-08", "lane": "microbes", "type": "approval", "tag": "Approval",
     "title": "HPV vaccine", "short": "HPV vaccine",
     "what": "The first vaccine against human papillomavirus, the virus behind most cervical cancers, is approved in the US.",
     "why": "Blocking the virus prevents the cancer. Preventive vaccines remain the biggest success among cancer vaccines.",
     "chapter": "11-vaccines", "sources": [8]},
    {"id": "treme-2008", "date": "2008-04", "lane": "checkpoints", "type": "setback", "tag": "Setback",
     "title": "A sister drug fails", "short": "Trial stopped",
     "what": "A 655-patient trial of tremelimumab, another antibody that blocks CTLA-4, is stopped after it fails to beat chemotherapy in melanoma. Tumors shrank in no more patients than with chemotherapy, but those responses lasted much longer.",
     "why": "It deepened the skepticism just before the breakthrough. Tremelimumab itself was approved in 2022, in combination, for liver cancer.",
     "chapter": "08-checkpoints", "sources": [10, 8]},
    {"id": "ipilimumab-2011", "date": "2011-03-25", "lane": "checkpoints", "type": "approval", "tag": "Approval",
     "title": "Ipilimumab", "short": "Ipilimumab",
     "what": "In a phase 3 trial in previously treated melanoma, median survival was 10 months with ipilimumab (Yervoy), versus 6.4 months with a comparison vaccine alone. The FDA approves it in March 2011.",
     "why": "The first therapy approved by the FDA shown to help people with metastatic melanoma live longer, and the first approved checkpoint inhibitor.",
     "chapter": "08-checkpoints", "sources": [11, 8]},
    {"id": "emily-2012", "date": "2012-04", "lane": "cells", "type": "finding", "tag": "Clinical trial",
     "title": "Emily Whitehead", "short": "CAR-T for a child",
     "what": "Six-year-old Emily Whitehead, whose leukemia had relapsed twice, becomes the first child to receive the Philadelphia team's CD19-targeted CAR-T cells. Ten years later she was still cancer-free.",
     "why": "CAR-T cells could clear aggressive, treatment-resistant leukemia in a child. Chapter 10 describes her case, including how her doctors saved her from the treatment's side effects.",
     "chapter": "10-cell-therapy", "sources": [14, 15]},
    {"id": "pembro-2014", "date": "2014-09-04", "lane": "checkpoints", "type": "approval", "tag": "Approval",
     "title": "PD-1 blockers", "short": "PD-1 blockers",
     "what": "After a 2012 trial showed lasting tumor shrinkage in about one in five to one in four patients with melanoma, lung or kidney cancer, pembrolizumab (Keytruda) becomes the first PD-1 blocker approved in the US. Nivolumab (Opdivo) follows in December.",
     "why": "PD-1 blockers went on to be approved for many types of cancer.",
     "chapter": "08-checkpoints", "sources": [22, 2, 8]},
    {"id": "blinatumomab-2014", "date": "2014-12-03", "lane": "antibodies", "type": "approval", "tag": "Approval",
     "title": "A T-cell engager", "short": "T-cell engager",
     "what": "Blinatumomab (Blincyto), an antibody with two different arms that physically links T cells to leukemia cells, is approved for a form of acute lymphoblastic leukemia.",
     "why": "The first bispecific T-cell engager approved in the US. Others followed, at first mostly for blood cancers.",
     "chapter": "09-antibodies", "sources": [8]},
    {"id": "tvec-2015", "date": "2015-10-27", "lane": "microbes", "type": "approval", "tag": "Approval",
     "title": "A cancer-killing virus", "short": "Cancer-killing virus",
     "what": "Talimogene laherparepvec (T-VEC, Imlygic) is approved for melanoma and is injected directly into tumors. It is a herpes virus engineered to infect and lyse (burst) cancer cells and to make them secrete an immune-attracting cytokine.",
     "why": "The first oncolytic virus approved in the US. It turns the injected tumor into its own vaccine.",
     "chapter": "11-vaccines", "sources": [8]},
    {"id": "msi-2017", "date": "2017-05-23", "lane": "checkpoints", "type": "approval", "tag": "Approval",
     "title": "One drug, any organ", "short": "Tissue-agnostic",
     "what": "Pembrolizumab is approved for advanced solid tumors that are mismatch-repair deficient (MSI-high) and have progressed after earlier treatment, wherever in the body they started. About 40% of patients in the supporting trials responded.",
     "why": "The FDA's first cancer approval based on a molecular feature of the tumor rather than the organ it came from.",
     "chapter": "08-checkpoints", "sources": [8]},
    {"id": "kymriah-2017", "date": "2017-08-30", "lane": "cells", "type": "approval", "tag": "Approval",
     "title": "CAR-T approved", "short": "First CAR-T approval",
     "what": "Tisagenlecleucel (Kymriah) is approved for children and young adults whose B-cell leukemia had returned or resisted other treatment. In the pivotal trial, 83% were in remission within three months.",
     "why": "The first CAR-T therapy approved in the US, which the FDA described as the first gene therapy available in the country.",
     "chapter": "10-cell-therapy", "sources": [8, 13]},
    {"id": "nobel-2018", "date": "2018-10-01", "lane": "ideas", "type": "finding", "tag": "Recognition",
     "title": "Nobel Prize to Allison and Honjo", "short": "Nobel Prize",
     "what": "James Allison and Tasuku Honjo share the Nobel Prize in Physiology or Medicine for discovering cancer therapy by inhibiting negative immune regulation.",
     "why": "It recognized the brakes, and the idea of releasing them, as a new pillar of cancer treatment.",
     "chapter": "08-checkpoints", "sources": [2]},
    {"id": "tdxd-2019", "date": "2019-12-20", "lane": "antibodies", "type": "approval", "tag": "Approval",
     "title": "An antibody that delivers a drug", "short": "Antibody–drug conjugate",
     "what": "Trastuzumab deruxtecan (Enhertu), an antibody that carries a potent cytotoxic drug into cancer cells bearing HER2, is approved for HER2-positive breast cancer. In 2022 it becomes the first drug approved in the US for 'HER2-low' breast cancer.",
     "why": "It showed that a well-designed antibody–drug conjugate can work even when tumors carry only modest amounts of the target.",
     "chapter": "09-antibodies", "sources": [8]},
    {"id": "lifileucel-2024", "date": "2024-02-16", "lane": "cells", "type": "approval", "tag": "Approval",
     "title": "TIL therapy approved", "short": "First TIL approval",
     "what": "Lifileucel (Amtagvi) is approved for advanced melanoma that had already progressed on PD-1 treatment. About 31% of patients in the supporting trial responded.",
     "why": "The first T-cell therapy approved in the US for a solid tumor, more than 35 years after the first TIL report.",
     "chapter": "10-cell-therapy", "sources": [8, 6]},
    {"id": "tarlatamab-2024", "date": "2024-05-16", "lane": "antibodies", "type": "approval", "tag": "Approval",
     "title": "A T-cell engager for lung cancer", "short": "Engager for lung cancer",
     "what": "Tarlatamab (Imdelltra), a bispecific antibody that links T cells to small-cell lung cancer cells, is approved for patients whose disease progressed after chemotherapy; 40% responded.",
     "why": "Tebentafusp (2022) had shown that T-cell engagers could work in a rare solid tumor. Tarlatamab brought them to a common, aggressive one.",
     "chapter": "09-antibodies", "sources": [8]},
    {"id": "nadina-2024", "date": "2024-06", "lane": "checkpoints", "type": "finding", "tag": "Clinical trial",
     "title": "Treat before surgery", "short": "Before surgery",
     "what": "In a large trial in stage III melanoma, giving ipilimumab plus nivolumab before surgery clearly beats surgery followed by standard treatment.",
     "why": "Strong evidence that timing matters: immunotherapy may work best while the tumor is still in place. Chapter 12 has the details.",
     "chapter": "12-frontier", "sources": [17]},
    {"id": "afamicel-2024", "date": "2024-08-02", "lane": "cells", "type": "approval", "tag": "Approval",
     "title": "Engineered T-cell receptors", "short": "First TCR-T",
     "what": "Afamitresgene autoleucel (Tecelra) is approved for synovial sarcoma, a soft-tissue cancer, in patients with a matching tissue type; 43% responded. It consists of T cells engineered with a receptor that recognizes a peptide from the MAGE-A4 protein.",
     "why": "The first engineered T-cell receptor therapy approved in the US. Unlike a CAR, it can target proteins made inside the cell.",
     "chapter": "10-cell-therapy", "sources": [8]},
    {"id": "interpath-2026", "date": "2026-08-19", "lane": "microbes", "type": "finding", "tag": "Company-reported, not yet approved",
     "title": "Personalized mRNA vaccine, phase 3", "short": "mRNA vaccine trial",
     "what": "A personalized mRNA vaccine with pembrolizumab met its main goal in a phase 3 melanoma trial, according to its makers in 2026 (company-reported); full results are awaited, and it is not yet approved (Chapter 11).",
     "why": "After decades of disappointing cancer vaccines, its makers called it the first positive phase 3 result for a vaccine built from each patient's own tumor mutations.",
     "chapter": "11-vaccines", "sources": [18, 19]}
  ]
};

const ID = 'int-timeline';
const LANE_VAR = {
  ideas: 'var(--chart-4)', microbes: 'var(--chart-2)', antibodies: 'var(--chart-3)', checkpoints: 'var(--chart-5)', cells: 'var(--chart-1)',
};
const ERAS = [
  { label: 'Hunches', from: 1885, to: 1975, wash: 0 },
  { label: 'Tools and doubt', from: 1975, to: 2010, wash: 0.028 },
  { label: 'Breakthrough and branching out', from: 2010, to: 2027, wash: 0.055 },
];
const DOMAIN = [1885, 2027];
const ZOOM = [1972.6, 2027.4];             // POLISH B9: "Zoom to 1975–2026" (the dense years, every label shown)
const ZOOM_FROM = 1975;
const NOW = 2026.78;                       // early October 2026
const VERTICAL_BELOW = 768;                // viewport width (px) below which the list layout is used
const HINT_ID = 'ipilimumab-2011';
const SOURCE_TEXT = 'Dates: FDA approval records and published papers; see Sources below.';
const DEFAULT_DESC = 'Five kinds of treatment, one lane each. Choose a lane to highlight it.';
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const TYPE_LABEL = { finding: 'finding', approval: 'approval', setback: 'setback' };

// Small line glyphs (24-unit box, stroke = currentColor).
const GLYPHS = {
  book: '<path d="M12 7.2C9.6 5.6 6.4 5.2 3 6v12.4c3.4-.8 6.6-.4 9 1.2 2.4-1.6 5.6-2 9-1.2V6c-3.4-.8-6.6-.4-9 1.2z"/><path d="M12 7.2v12.4"/>',
  bacterium: '<rect x="3.2" y="8.3" width="17.6" height="7.4" rx="3.7" transform="rotate(-24 12 12)"/><path d="M19.4 6.2c1-.9 1.2-2.1 2.4-2.5"/><circle cx="9.6" cy="13" r=".9" fill="currentColor" stroke="none"/><circle cx="13.6" cy="11.2" r=".9" fill="currentColor" stroke="none"/>',
  y: '<path d="M12 21.2v-8.4M12 12.8 6.6 6.6M12 12.8l5.4-6.2"/><path d="M4.4 8.6 7.6 5M19.6 8.6 16.4 5"/>',
  brake: '<path d="M4.5 4.5v15" stroke-width="2.6"/><circle cx="15" cy="12" r="5.6"/><path d="M12.4 12h5.2"/>',
  cell: '<circle cx="10.4" cy="13.4" r="7"/><circle cx="10.4" cy="13.4" r="2.4"/><path d="M15.4 8.4l3-3"/><path d="M16.3 3.6l3.9.2.2 3.9"/>',
};
const glyphMarkup = (name, size = 16) => `<svg class="tl-glyph" viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${GLYPHS[name] || ''}</svg>`;

// Marker shapes (centered at 0,0). r = ring radius; the diamond is a little larger so both read as 16 px+.
const R_RING = 7.4;
const R_DIAMOND = 9.6;
function markerMarkup(type, color, { scale: k = 1 } = {}) {
  const r = R_RING * k;
  const d = R_DIAMOND * k;
  if (type === 'approval') {
    const dd = d + 2.2 * k;
    return `<path d="M0 ${-dd}L${dd} 0L0 ${dd}L${-dd} 0Z" style="fill:var(--halo)"/>`
      + `<path d="M0 ${-d}L${d} 0L0 ${d}L${-d} 0Z" style="fill:${color}"/>`;
  }
  let s = `<circle r="${(r + 3.3 * k).toFixed(2)}" style="fill:var(--halo)"/>`
    + `<circle r="${r.toFixed(2)}" style="fill:var(--halo);stroke:${color};stroke-width:${(2.6 * k).toFixed(2)}"/>`;
  if (type === 'setback') {
    const q = r * 0.72;
    s += `<path d="M${q.toFixed(2)} ${(-q).toFixed(2)}L${(-q).toFixed(2)} ${q.toFixed(2)}" style="stroke:${color};stroke-width:${(2.4 * k).toFixed(2)};stroke-linecap:round"/>`;
  }
  return s;
}
const markerSVG = (type, color, size = 22) => `<svg class="tl-mk" viewBox="-12 -12 24 24" width="${size}" height="${size}" aria-hidden="true" focusable="false">${markerMarkup(type, color)}</svg>`;

const CSS = `
[data-figure="${ID}"] .tl-top { display: flex; flex-direction: column; gap: 6px; }
[data-figure="${ID}"] .tl-row2 { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px 18px; }
[data-figure="${ID}"].tl-vertical .tl-zoom { display: none; }
[data-figure="${ID}"] .tl-desc { margin: 0; min-height: 1.45em; font: 450 14px/1.45 var(--font-ui); color: var(--fg-2); text-wrap: pretty; }
[data-figure="${ID}"] .tl-desc b { font-weight: 620; color: var(--fg); }
[data-figure="${ID}"] .tl-legend { display: flex; flex-wrap: wrap; gap: 4px 18px; margin: 0; padding: 0; list-style: none; font: 500 13px/1.4 var(--font-ui); color: var(--fg-2); }
[data-figure="${ID}"] .tl-legend li { display: inline-flex; align-items: center; gap: 6px; }
[data-figure="${ID}"] .tl-legend .tl-mk { width: 18px; height: 18px; }
[data-figure="${ID}"] .chip .tl-chiplabel { display: inline-flex; align-items: center; gap: 6px; }
[data-figure="${ID}"] .chip .tl-glyph { flex: none; color: var(--fg-2); }
[data-figure="${ID}"] .chip[aria-pressed="true"] .tl-glyph { color: var(--fg); }
[data-figure="${ID}"] .tl-svg { display: block; width: 100%; height: auto; overflow: visible; }
[data-figure="${ID}"] svg .tl-m { cursor: pointer; outline: none; transition: opacity .25s ease; }
[data-figure="${ID}"] svg .tl-m__shape { transform-box: fill-box; transform-origin: center; transition: transform .2s ease; }
[data-figure="${ID}"] svg .tl-m:hover .tl-m__shape { transform: scale(1.12); }
[data-figure="${ID}"] svg .tl-m.is-open .tl-m__shape { transform: scale(1.25); }
[data-figure="${ID}"] svg .tl-m__halo { opacity: 0; transition: opacity .25s ease; }
[data-figure="${ID}"] svg .tl-m.is-open .tl-m__halo { opacity: 0.22; }
[data-figure="${ID}"] svg .tl-m__focus { fill: none; stroke: var(--stage-focus, var(--accent)); stroke-width: 2; opacity: 0; }
[data-figure="${ID}"] svg .tl-m:focus-visible .tl-m__focus { opacity: 1; }
[data-figure="${ID}"] svg .is-dim { opacity: 0.15; }
[data-figure="${ID}"] svg .tl-lbl { transition: opacity .25s ease; pointer-events: none; }
[data-figure="${ID}"] svg .tl-lbl text { font-weight: 520; fill: var(--fg); }
[data-figure="${ID}"] svg .tl-lane-name { fill: var(--fg-2); }
[data-figure="${ID}"] svg .tl-era { fill: var(--fg-3); }
[data-figure="${ID}"] svg .tl-hint text { fill: var(--accent); font-weight: 600; }
[data-figure="${ID}"] svg .tl-hover { pointer-events: none; }
[data-figure="${ID}"] svg .tl-hover rect { fill: var(--surface); stroke: var(--rule-strong, var(--line)); stroke-width: 1; }
[data-figure="${ID}"] svg .tl-hover text { fill: var(--fg); font-weight: 560; }
[data-figure="${ID}"] svg .tl-now { fill: var(--fg); font-weight: 650; }
/* phone list */
[data-figure="${ID}"] .tl-list { position: relative; list-style: none; margin: 4px 0 0; padding: 0; }
[data-figure="${ID}"] .tl-list::before { content: ""; position: absolute; left: 19px; top: 6px; bottom: 6px; width: 2px; border-radius: 1px; background: var(--rule-strong, var(--line)); }
[data-figure="${ID}"] .tl-list > li { position: relative; margin: 0; padding: 0; transition: opacity .25s ease; }
[data-figure="${ID}"] .tl-list > li.is-dim { opacity: 0.15; }
[data-figure="${ID}"] .tl-row { display: grid; grid-template-columns: 40px 50px minmax(0, 1fr); align-items: center; gap: 0 6px; width: 100%; min-height: 62px;
  margin: 0; padding: 4px 6px 4px 0; border: 0; border-radius: var(--r-md, 10px); background: transparent; color: inherit; text-align: left; font: inherit; cursor: pointer; }
[data-figure="${ID}"] .tl-row:hover { background: color-mix(in srgb, var(--fg) 4%, transparent); }
[data-figure="${ID}"] .tl-row:focus-visible { outline: 2px solid var(--accent); outline-offset: -2px; }
[data-figure="${ID}"] .tl-row.is-open { background: color-mix(in srgb, var(--fg) 6%, transparent); }
[data-figure="${ID}"] .tl-row__mk { display: grid; place-items: center; }
[data-figure="${ID}"] .tl-row__date { display: flex; flex-direction: column; font: 500 13px/1.3 var(--font-ui); font-variant-numeric: tabular-nums; color: var(--fg-3); }
[data-figure="${ID}"] .tl-row__date b { font-weight: 650; font-size: 14px; color: var(--fg-2); }
[data-figure="${ID}"] .tl-row__txt { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
[data-figure="${ID}"] .tl-row__title { font: 600 15px/1.3 var(--font-ui); color: var(--fg); }
[data-figure="${ID}"] .tl-row__lane { display: inline-flex; align-items: center; gap: 5px; font: 500 13px/1.3 var(--font-ui); color: var(--fg-3); }
[data-figure="${ID}"] .tl-row__lane .tl-glyph { width: 14px; height: 14px; flex: none; }
[data-figure="${ID}"] .tl-list > li.tl-gap { display: flex; align-items: center; gap: 10px; height: 46px; padding-left: 46px; font: 500 13px/1 var(--font-ui); color: var(--fg-3); font-variant-numeric: tabular-nums; }
[data-figure="${ID}"] .tl-gap::before { content: ""; position: absolute; left: 15px; top: 4px; bottom: 4px; width: 10px; background: var(--halo, var(--surface)); }
[data-figure="${ID}"] .tl-gap::after { content: ""; position: absolute; left: 19px; top: 4px; bottom: 4px; border-left: 2px dashed var(--rule-strong, var(--line)); }
[data-figure="${ID}"] .tl-gap span { flex: none; }
[data-figure="${ID}"] .tl-gap i { flex: 1; height: 0; border-top: 1px dashed var(--rule-strong, var(--line)); }
[data-figure="${ID}"] .tl-list > li.tl-eraH { padding: 14px 0 4px 46px; font: 650 11px/1.2 var(--font-ui); letter-spacing: .08em; text-transform: uppercase; color: var(--fg-3); }
[data-figure="${ID}"] .tl-list > li.tl-eraH:first-child { padding-top: 2px; }
[data-figure="${ID}"] .tl-list > li.tl-cardslot { padding: 2px 0 12px 30px; }
[data-figure="${ID}"].tl-vertical .chips__tray { flex-wrap: nowrap; overflow-x: auto; overscroll-behavior-x: contain; scrollbar-width: thin; padding-bottom: 4px; }
[data-figure="${ID}"].tl-vertical .chip { flex: none; }
[data-figure="${ID}"].tl-vertical .info-card.is-empty { display: none; }
/* card */
[data-figure="${ID}"] .info-card__kicker:has(.tl-k) { text-transform: none; letter-spacing: 0; color: inherit; font-weight: inherit; }
[data-figure="${ID}"] .tl-k { display: flex; flex-direction: column; gap: 4px; margin-bottom: 2px; }
[data-figure="${ID}"] .tl-k__date { font: 650 15px/1.2 var(--font-ui); font-variant-numeric: tabular-nums; color: var(--ink); }
[data-figure="${ID}"] .tl-k__lane { display: flex; align-items: flex-start; gap: 7px; font: 520 13px/1.35 var(--font-ui); color: var(--ink-2); }
[data-figure="${ID}"] .tl-k__lane > span:first-child { flex: none; display: inline-flex; margin-top: 1px; }
[data-figure="${ID}"] .tl-c-h { margin: 0.9em 0 0.15em !important; font: 650 11px/1.3 var(--font-ui); letter-spacing: .08em; text-transform: uppercase; color: var(--ink-3); }
[data-figure="${ID}"] .tl-c-h:first-child { margin-top: 0 !important; }
[data-figure="${ID}"] .tl-c-h + p { margin-top: 0 !important; }
[data-figure="${ID}"] .tl-c-link { margin-top: 1em !important; }
[data-figure="${ID}"] .tl-chip { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; min-height: 36px; border-radius: var(--r-pill); border: 1px solid var(--rule-strong, var(--rule));
  font: 560 13px/1.3 var(--font-ui); color: var(--accent); text-decoration: none; background: var(--surface); }
[data-figure="${ID}"] .tl-chip:hover { border-color: var(--accent); }
[data-figure="${ID}"] .tl-c-src { font: 500 12px/1.45 var(--font-ui); color: var(--ink-3); }
[data-figure="${ID}"] .tl-c-src a { color: var(--accent); text-decoration: none; font-variant-numeric: tabular-nums; }
[data-figure="${ID}"] .tl-c-nav { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin-top: 1em !important; padding-top: 10px; border-top: 1px solid var(--rule); }
[data-figure="${ID}"] .tl-c-nav .tl-c-close { margin-left: auto; }
[data-figure="${ID}"] svg .tl-lbl .leader { stroke: var(--fg-3); }
[data-figure="${ID}"] svg .tl-lbl .tl-ldot { fill: var(--fg-3); }
[data-figure="${ID}"] svg .tl-bracket { fill: none; stroke: var(--fg-3); stroke-width: 1; opacity: .55; }
@container fig (max-width: 899.98px) { [data-figure="${ID}"] .tl-c-nav .tl-c-close { display: none; } }
@media (prefers-reduced-motion: reduce) {
  [data-figure="${ID}"] svg .tl-m, [data-figure="${ID}"] svg .tl-m__shape, [data-figure="${ID}"] svg .tl-m__halo,
  [data-figure="${ID}"] svg .tl-lbl, [data-figure="${ID}"] .tl-list > li { transition: none; }
}
`;
function injectCSS() {
  if (document.getElementById(`${ID}-css`)) return;
  const s = document.createElement('style');
  s.id = `${ID}-css`;
  s.textContent = CSS;
  document.head.append(s);
}

// ------------------------------------------------------------------ data helpers
function parseDate(str) {
  const [y, m, d] = str.split('-').map(Number);
  const frac = m ? (m - 1 + (d ? (d - 0.5) / 31 : 0.5)) / 12 : 0.5;
  const label = d ? `${d} ${MONTHS[m - 1]} ${y}` : m ? `${MONTHS[m - 1]} ${y}` : String(y);
  return { y, t: y + frac, label };
}
// Typographic quotes for display (the data keeps the draft's ASCII quotes).
const smart = (s) => String(s)
  .replace(/(^|[\s([{—–-])'/g, '$1‘').replace(/'/g, '’')
  .replace(/(^|[\s([{—–-])"/g, '$1“').replace(/"/g, '”');
const lcFirst = (s) => s.charAt(0).toLowerCase() + s.slice(1);

const LANES = DATA.lanes.map((l, i) => ({ ...l, index: i, color: LANE_VAR[l.id] }));
const LANE = Object.fromEntries(LANES.map((l) => [l.id, l]));
const MS = DATA.milestones
  .map((m) => ({ ...m, ...parseDate(m.date) }))
  .sort((a, b) => a.t - b.t);
MS.forEach((m, i) => { m.order = i; });

// The personalized-vaccine card uses the one shared status string (FIGURE-AUDIT §7.2).
function statusFor(m) {
  if (m.id !== 'interpath-2026') return null;
  const st = STATUS['mrna-vaccine'];
  if (!st) return null;
  return { tag: st.tag, what: st.card ?? `${st.text}.` };
}
const tagOf = (m) => statusFor(m)?.tag ?? m.tag;
const whatOf = (m) => statusFor(m)?.what ?? m.what;
const ariaOf = (m) => `${m.label}, ${LANE[m.lane].label}, ${TYPE_LABEL[m.type]}: ${smart(m.title)}`;

// ================================================================== mount
export default async function mount(fig, ctx) {
  injectCSS();
  const F = chartFrame(ctx, { toolbar: true, source: '', card: false });
  F.sourceEl.hidden = false;
  F.sourceEl.replaceChildren(
    document.createTextNode(SOURCE_TEXT.replace('Sources below.', '')),
    ctx.h('a', { href: '#sources' }, 'Sources'),
    document.createTextNode(' below.'),
  );
  F.sourceEl.style.cssText = 'color: var(--fg-3)';
  const srcLink = F.sourceEl.querySelector('a');
  srcLink.style.cssText = 'color: inherit; text-decoration: underline; text-decoration-color: var(--line); text-underline-offset: 2px;';

  // Chapter titles for the "Read more" chips (chapters.json; graceful fallback).
  let CHAPTERS = {};
  try {
    const res = await fetch(new URL('../../data/chapters.json', import.meta.url));
    if (res.ok) CHAPTERS = Object.fromEntries((await res.json()).pages.map((p) => [p.id, p]));
  } catch (e) { /* the chip falls back to the chapter number */ }
  const chapterOf = (id) => {
    const p = CHAPTERS[id];
    const n = Number.parseInt(id, 10);
    return {
      href: p?.file || `${id}.html`,
      text: p ? `${p.label}: ${p.title}` : `Chapter ${n}`,
    };
  };

  // ---------------------------------------------------------------- state
  let selected = new Set();                 // empty = all lanes
  let openId = null;
  let hintOn = true;
  let vertical = null;
  let zoom = false;                         // desktop only: 1975–2026 instead of the full span
  let lastW = 0;
  let H = {};                               // horizontal-layout handles
  let V = {};                               // vertical-layout handles
  const laneOn = (id) => selected.size === 0 || selected.has(id);
  const inView = (m) => vertical || !zoom || m.t >= ZOOM_FROM;
  const visibleMs = () => MS.filter((m) => laneOn(m.lane) && inView(m));

  // ---------------------------------------------------------------- top: chips, description, legend
  const chipLabel = (l) => {
    const s = ctx.h('span', { class: 'tl-chiplabel', html: glyphMarkup(l.glyph, 16) });
    s.append(document.createTextNode(l.label));
    return s;
  };
  const chips = ctx.ui.chips({
    label: 'Show treatment types',
    hideLabel: true,
    multi: true,
    parent: F.toolbar,
    value: ['all'],
    options: [
      { value: 'all', label: 'All' },
      ...LANES.map((l) => ({ value: l.id, label: chipLabel(l), color: l.color, title: l.description })),
    ],
    onChange: (_v, { option }) => onChip(option?.value),
  });
  const desc = ctx.h('p', { class: 'tl-desc', 'aria-live': 'off' });
  const legend = ctx.h('ul', { class: 'tl-legend', 'aria-label': 'Marker shapes' },
    ctx.h('li', { html: `${markerSVG('finding', 'var(--fg-2)')}<span>finding or trial result</span>` }),
    ctx.h('li', { html: `${markerSVG('approval', 'var(--fg-2)')}<span>approval</span>` }),
    ctx.h('li', { html: `${markerSVG('setback', 'var(--fg-2)')}<span>setback</span>` }));
  const zoomSeg = ctx.ui.segmented({
    label: 'Years shown', hideLabel: true, parent: null, value: 'all',
    options: [{ value: 'all', label: '1890–2026' }, { value: 'zoom', label: 'Zoom to 1975–2026' }],
    onChange: (v) => {
      zoom = v === 'zoom';
      dismissHint();
      if (openId && !inView(MS.find((m) => m.id === openId))) closeCard();
      drawHorizontal();
      ctx.announce(zoom ? 'Showing 1975 to 2026, with every milestone labeled.' : 'Showing the whole span, 1890 to 2026.');
    },
  });
  zoomSeg.el.classList.add('tl-zoom');
  F.top.append(ctx.h('div', { class: 'tl-top' }, desc, ctx.h('div', { class: 'tl-row2' }, legend, zoomSeg.el)));

  let hoverDesc = null;
  function paintDesc() {
    const lane = hoverDesc ? LANE[hoverDesc] : selected.size === 1 ? LANE[[...selected][0]] : null;
    desc.replaceChildren();
    if (lane) {
      desc.append(ctx.h('b', null, `${lane.label}: `), document.createTextNode(lane.description));
    } else if (selected.size > 1) {
      desc.textContent = `Showing ${[...selected].map((id) => LANE[id].label).join(', ')}.`;
    } else desc.textContent = DEFAULT_DESC;
  }
  for (const [v, b] of chips.buttons) {
    if (v === 'all') continue;
    ctx.on(b, 'pointerenter', (e) => { if (e.pointerType === 'mouse') { hoverDesc = v; paintDesc(); } });
    ctx.on(b, 'pointerleave', () => { hoverDesc = null; paintDesc(); });
    ctx.on(b, 'focus', () => { hoverDesc = v; paintDesc(); });
    ctx.on(b, 'blur', () => { hoverDesc = null; paintDesc(); });
  }
  paintDesc();

  function onChip(v) {
    dismissHint();
    if (!v || v === 'all') selected = new Set();
    else if (selected.has(v)) selected.delete(v);
    else selected.add(v);
    if (selected.size === LANES.length) selected = new Set();
    chips.set(selected.size ? [...selected] : ['all']);
    paintDesc();
    applyFilter();
    const names = selected.size ? [...selected].map((id) => LANE[id].label).join(', ') : 'all treatment types';
    ctx.announce(`Showing ${names}.`);
  }

  // ---------------------------------------------------------------- info card
  const card = ctx.ui.infoCard({ placement: 'auto', width: '19.5rem', empty: 'Tap any marker to see what happened and why it mattered.', closable: true });
  const cardHome = card.el.parentElement;
  ctx.on(card.el.querySelector('.info-card__close'), 'click', () => closeCard({ fromKit: true }));

  function cardBody(m) {
    const lane = LANE[m.lane];
    const ch = chapterOf(m.chapter);
    const body = ctx.h('div', { class: 'tl-c' },
      ctx.h('p', { class: 'tl-c-h' }, 'What happened'),
      ctx.h('p', null, smart(whatOf(m))),
      ctx.h('p', { class: 'tl-c-h' }, 'Why it mattered'),
      ctx.h('p', null, smart(m.why)),
      ctx.h('p', { class: 'tl-c-link' }, ctx.h('a', { class: 'tl-chip', href: ch.href }, `Read more → ${ch.text}`)));
    const src = ctx.h('p', { class: 'tl-c-src' }, m.sources.length > 1 ? 'Sources ' : 'Source ');
    const sup = ctx.h('sup');
    m.sources.forEach((n, i) => {
      if (i) sup.append(document.createTextNode(', '));
      sup.append(ctx.h('a', { href: `#src-${n}`, 'aria-label': `Source ${n}` }, String(n)));
    });
    src.append(sup);
    body.append(src);
    const vis = visibleMs();
    const k = vis.indexOf(m);
    const prev = k > 0 ? vis[k - 1] : k < 0 ? [...vis].reverse().find((x) => x.t < m.t) : null;
    const next = k >= 0 ? vis[k + 1] : vis.find((x) => x.t > m.t);
    const btn = (label, iconPath, target, cls) => {
      const b = ctx.h('button', { type: 'button', class: `btn btn--ghost btn--sm ${cls}`, 'aria-label': target ? `${label}: ${target.label}, ${smart(target.title)}` : label,
        html: `${iconPath}<span class="btn__text">${label}</span>` });
      if (!target) b.disabled = true;
      else b.addEventListener('click', () => openCard(target.id, { focus: true }));
      return b;
    };
    const ic = (d) => `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`;
    const close = ctx.h('button', { type: 'button', class: 'btn btn--ghost btn--sm btn--icon tl-c-close', 'aria-label': 'Close details', title: 'Close (Esc)', html: ic('M6 6l12 12M18 6L6 18') });
    close.addEventListener('click', () => closeCard({ refocus: true }));
    body.append(ctx.h('div', { class: 'tl-c-nav' },
      btn('Earlier', ic('M15 5l-7 7 7 7'), prev, 'tl-c-prev'),
      btn('Later', ic('M9 5l7 7-7 7'), next, 'tl-c-next'),
      close));
    void lane;
    return body;
  }
  function kicker(m) {
    const lane = LANE[m.lane];
    const k = ctx.h('span', { class: 'tl-k' },
      ctx.h('span', { class: 'tl-k__date' }, m.label),
      ctx.h('span', { class: 'tl-k__lane', html: `<span style="color:${lane.color}">${glyphMarkup(lane.glyph, 16)}</span>` }, ctx.h('span', null, `${lane.label} · ${tagOf(m)}`)));
    return k;
  }

  function openCard(id, { focus = false } = {}) {
    dismissHint();
    const m = MS.find((x) => x.id === id);
    if (!m) return;
    openId = id;
    paintOpen();
    if (vertical) placeCardUnderRow(id);
    card.show({ kicker: kicker(m), title: smart(m.title), body: cardBody(m), scroll: !!vertical });
    if (focus) focusMarker(id);
  }
  function closeCard({ refocus = false, fromKit = false } = {}) {
    const was = openId;
    openId = null;
    paintOpen();
    if (!fromKit) card.hide();
    restoreCard();
    if (refocus && was) focusMarker(was);
  }
  function restoreCard() {
    if (card.el.parentElement !== cardHome) cardHome.append(card.el);
    V.slot?.remove();
    if (V.slot) V.slot = null;
  }
  ctx.on(fig, 'keydown', (e) => {
    if (e.key === 'Escape' && openId) { e.preventDefault(); closeCard({ refocus: true }); }
  });

  function focusMarker(id) {
    const el = vertical ? V.rows?.[id]?.btn : H.marks?.[id]?.el;
    el?.focus({ preventScroll: !vertical });
  }
  function paintOpen() {
    if (H.marks) for (const [id, mk] of Object.entries(H.marks)) mk.el.classList.toggle('is-open', id === openId);
    if (V.rows) for (const [id, r] of Object.entries(V.rows)) {
      r.btn.classList.toggle('is-open', id === openId);
      r.btn.setAttribute('aria-expanded', String(id === openId));
    }
    if (H.marks) placeLabels();
  }

  // ---------------------------------------------------------------- hint
  function dismissHint() {
    if (!hintOn) return;
    hintOn = false;
    H.hint?.remove();
    if (H.marks) placeLabels();
  }

  // ================================================================ horizontal layout
  function measureFactory(svg) {
    const probe = ctx.svg('text', { class: 't-small', x: -9999, y: -9999, 'aria-hidden': 'true' }, svg);
    const cache = new Map();
    return (text, cls = 't-small') => {
      const key = `${cls}|${text}`;
      if (cache.has(key)) return cache.get(key);
      probe.setAttribute('class', cls);
      probe.textContent = text;
      let w = 0;
      try { w = probe.getComputedTextLength(); } catch (e) { /* not rendered */ }
      if (!w) w = text.length * 7;
      cache.set(key, w);
      return w;
    };
  }

  function drawHorizontal() {
    const W = Math.max(480, Math.round(F.main.clientWidth || ctx.width - 40));
    lastW = W;
    F.main.replaceChildren();
    const padL = 6;
    const padR = 10;
    const eraH = 44;
    const laneH = 70;
    const lanesTop = eraH + 4;
    const axisY = lanesTop + LANES.length * laneH + 2;
    const Ht = axisY + 46;
    const svg = ctx.createSVG({
      viewBox: `0 0 ${W} ${Ht}`, parent: F.main, interactive: true, className: 'tl-svg',
      label: 'Timeline from 1885 to 2027 in five lanes. Tab to the markers; use the arrow keys to move between them and Enter for details.',
    });
    svg.setAttribute('width', W);
    svg.setAttribute('height', Ht);
    const g = chartRoot(svg);
    const measure = measureFactory(svg);
    const D = zoom ? ZOOM : DOMAIN;
    const x = scale({ domain: D, range: [padL, W - padR] });
    // Eras clipped to the shown span; a sliver too narrow to name is dropped.
    const eras = ERAS.map((e) => ({ ...e, from: Math.max(e.from, D[0]), to: Math.min(e.to, D[1]) })).filter((e) => e.to - e.from >= (zoom ? 6 : 1));
    const laneTop = (i) => lanesTop + i * laneH;
    const rowY = (i, row) => laneTop(i) + (row ? 58 : 36);

    // Era bands (faint washes) and their labels.
    const bandsG = ctx.svg('g', { class: 'tl-bands', 'aria-hidden': 'true' }, g);
    for (const e of eras) {
      if (e.wash) ctx.svg('rect', { x: x(e.from), y: 0, width: x(e.to) - x(e.from), height: axisY, style: `fill:var(--fg);fill-opacity:${e.wash}` }, bandsG);
      ctx.svg('line', { x1: x(e.from), x2: x(e.from), y1: 0, y2: axisY, class: 'ck-grid', style: e.from === D[0] ? 'opacity:0' : 'stroke-dasharray:2 3' }, bandsG);
    }
    // Era labels: one line, left-aligned in the band, when it fits; otherwise two lines, and
    // right-aligned to the band's end if still too wide. A neighbour that would collide is
    // wrapped onto two lines as well.
    const eraLayout = (e, wrap) => {
      const text = e.label.toUpperCase();
      const bw = x(e.to) - x(e.from) - 10;
      let lines = [text];
      if (wrap || measure(text, 't-caps') > bw) {
        const words = text.split(' ');
        let best = null;
        for (let k = 1; k < words.length; k++) {
          const ls = [words.slice(0, k).join(' '), words.slice(k).join(' ')];
          const mw = Math.max(...ls.map((l) => measure(l, 't-caps')));
          if (!best || mw < best.mw) best = { ls, mw };
        }
        if (best) lines = best.ls;
      }
      const mw = Math.max(...lines.map((l) => measure(l, 't-caps')));
      const end = mw > bw;
      const ax = end ? Math.min(x(e.to), W - padR) - 4 : x(e.from) + 6;
      return { e, lines, anchor: end ? 'end' : 'start', ax, left: end ? ax - mw : ax, right: end ? ax : ax + mw };
    };
    const eraL = eras.map((e) => eraLayout(e, false));
    for (let i = eraL.length - 1; i > 0; i--) {
      if (eraL[i].left < eraL[i - 1].right + 12) eraL[i - 1] = eraLayout(eras[i - 1], true);
    }
    for (const e of eras) {
      const bx0 = x(e.from) + 3;
      const bx1 = Math.min(x(e.to), W - padR) - 3;
      ctx.svg('path', { class: 'tl-bracket', d: `M${bx0} ${eraH - 1}V${eraH - 5}H${bx1}V${eraH - 1}` }, g);
    }
    for (const L of eraL) {
      const t = ctx.svg('text', { class: `t-caps tl-era${L.anchor === 'end' ? ' t-end' : ''}`, x: L.ax, y: L.lines.length > 1 ? 12 : 26 }, g);
      L.lines.forEach((ln, i) => ctx.svg('tspan', { x: L.ax, dy: i ? 15 : 0, text: ln }, t));
    }

    // Axis: ticks every 10 years, labels every 20, faint gridlines.
    const ticks = [];
    if (zoom) for (let yv = 1975; yv <= 2025; yv += 5) ticks.push(yv);
    else for (let yv = 1890; yv <= 2020; yv += 10) ticks.push(yv);
    axis(g, {
      scale: x, orient: 'bottom', at: axisY, ticks, format: String,
      labels: (v) => (zoom ? v % 10 === 0 : (v - 1890) % 20 === 0), grid: [lanesTop, axisY], tickSize: 5,
    });
    if (zoom) {
      const n = MS.filter((m) => m.t < ZOOM_FROM).length;
      ctx.svg('text', { class: 't-small t-muted', x: padL + 2, y: axisY + 36, text: `← ${n} earlier milestones, 1891–1974`, style: 'fill:var(--fg-3)' }, g);
    }
    // Lane separators and headers.
    const lanesG = ctx.svg('g', { class: 'tl-lanes' }, g);
    LANES.forEach((l, i) => {
      if (i) ctx.svg('line', { class: 'ck-grid', x1: padL, x2: W - padR, y1: laneTop(i), y2: laneTop(i) }, lanesG);
      const hg = ctx.svg('g', { class: 'tl-lane-h', 'data-lane': l.id, transform: `translate(${padL + 2} ${laneTop(i) + 15})` }, lanesG);
      const gl = ctx.svg('g', { transform: 'translate(0 -11) scale(0.62)', style: `color:${l.color}`, fill: 'none', stroke: 'currentColor', 'stroke-width': 2.2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, hg);
      gl.innerHTML = GLYPHS[l.glyph];
      ctx.svg('text', { class: 't-caps t-halo tl-lane-name', x: 21, y: 0, text: l.label.toUpperCase() }, hg);
    });

    // "Now" line.
    const nowX = x(NOW);
    ctx.svg('line', { x1: nowX, x2: nowX, y1: lanesTop - 2, y2: axisY + 4, style: 'stroke:var(--fg-2);stroke-width:1.25' }, g);
    ctx.svg('text', { class: 't-small t-end tl-now', x: nowX + 3, y: axisY + 36, text: 'Now (2026)' }, g);

    // Marker rows: collision-free within each lane (≤ 2 rows).
    const minSep = 21;
    const rowLast = {};
    const shown = MS.filter(inView);
    for (const m of shown) {
      const li = LANE[m.lane].index;
      const px = x(m.t);
      const last = rowLast[li] || [-Infinity, -Infinity];
      let row = 0;
      if (px - last[0] < minSep) row = px - last[1] >= minSep ? 1 : 0;
      last[row] = px;
      rowLast[li] = last;
      m.px = px;
      m.py = rowY(li, row);
      m.row = row;
    }

    const labelsG = ctx.svg('g', { class: 'tl-labels', 'aria-hidden': 'true' }, g);
    const marksG = ctx.svg('g', { class: 'tl-marks' }, g);
    const marks = {};
    for (const m of shown) {
      const lane = LANE[m.lane];
      const el = ctx.svg('g', {
        class: 'tl-m', tabindex: 0, role: 'button', 'aria-label': ariaOf(m), 'data-id': m.id, 'data-lane': m.lane,
        transform: `translate(${m.px.toFixed(1)} ${m.py})`,
      }, marksG);
      ctx.svg('circle', { class: 'tl-m__halo', r: 17, style: `fill:${lane.color}` }, el);
      const shape = ctx.svg('g', { class: 'tl-m__shape' }, el);
      shape.innerHTML = markerMarkup(m.type, lane.color);
      ctx.svg('circle', { class: 'tl-m__focus', r: 14.5 }, el);
      ctx.svg('circle', { r: 13, style: 'fill:transparent' }, el);
      marks[m.id] = { el, m };
      el.addEventListener('click', () => openCard(m.id), { signal: ctx.signal });
      el.addEventListener('keydown', (e) => onMarkerKey(e, m), { signal: ctx.signal });
      el.addEventListener('pointerenter', () => showHover(m), { signal: ctx.signal });
      el.addEventListener('pointerleave', () => hideHover(m), { signal: ctx.signal });
      el.addEventListener('focus', () => showHover(m), { signal: ctx.signal });
      el.addEventListener('blur', () => hideHover(m), { signal: ctx.signal });
    }

    // Hover / focus label (for markers whose label is hidden).
    const hover = ctx.svg('g', { class: 'tl-hover', opacity: 0, 'aria-hidden': 'true' }, g);
    const hoverRect = ctx.svg('rect', { rx: 6, ry: 6, height: 24 }, hover);
    const hoverText = ctx.svg('text', { class: 't-small', y: 0 }, hover);

    // Initial hint next to the 2011 ipilimumab marker.
    let hint = null;
    if (hintOn) {
      const hm = MS.find((m) => m.id === HINT_ID);
      hint = ctx.svg('g', { class: 'tl-hint', 'aria-hidden': 'true' }, g);
      ctx.svg('circle', { cx: hm.px, cy: hm.py, r: 16.5, style: 'fill:none;stroke:var(--accent);stroke-width:1.6' }, hint);
      const ty = laneTop(LANE[hm.lane].index) + 15;
      const tx = hm.px - 26;
      const tw = measure('Tap any marker', 't-small');
      ctx.svg('path', { d: `M${tx + 4} ${ty - 4} Q${hm.px - 10} ${ty - 4} ${hm.px - 9} ${hm.py - 13}`, style: 'fill:none;stroke:var(--accent);stroke-width:1.2' }, hint);
      ctx.svg('text', { class: 't-small t-end t-halo', x: tx, y: ty, text: 'Tap any marker' }, hint);
      hint.dataset.box = JSON.stringify([tx - tw - 2, ty - 13, tw + 6, 18]);
    }

    H = { svg, g, x, marks, labelsG, hover, hoverRect, hoverText, hint, measure, W, padL, padR, laneTop, labelOf: {} };
    applyFilter({ instant: true });
    paintOpen();
  }

  // Label placement: fit-only by default; forced (with leaders) when exactly one lane is chosen.
  function placeLabels() {
    if (!H.labelsG) return;
    const { labelsG, measure, W, padL, padR, laneTop } = H;
    labelsG.replaceChildren();
    H.labelOf = {};
    const boxes = [];
    const hit = (b) => boxes.some((o) => b[0] < o[0] + o[2] && b[0] + b[2] > o[0] && b[1] < o[1] + o[3] && b[1] + b[3] > o[1]);
    const forced = selected.size === 1 ? [...selected][0] : null;
    const relevant = MS.filter((m) => laneOn(m.lane) && inView(m));
    // Obstacles: markers (all, unless forcing a lane), lane headers, the hint.
    for (const m of MS.filter(inView)) {
      if (forced && m.lane !== forced) continue;
      boxes.push([m.px - 11, m.py - 11, 22, 22]);
    }
    LANES.forEach((l, i) => boxes.push([padL, laneTop(i) + 2, 24 + measure(l.label.toUpperCase(), 't-caps'), 18]));
    if (hintOn && H.hint?.dataset.box) boxes.push(JSON.parse(H.hint.dataset.box));
    const xMin = padL + 2;
    const xMax = W - padR - 4;
    const put = (m, text, tx, ty, anchor, leader) => {
      const lg = ctx.svg('g', { class: `tl-lbl${laneOn(m.lane) ? '' : ' is-dim'}`, 'data-lane': m.lane }, labelsG);
      if (leader) {
        ctx.svg('path', { class: 'leader', d: leader.d }, lg);
        ctx.svg('circle', { class: 'tl-ldot', cx: leader.x, cy: leader.y, r: 1.8 }, lg);
      }
      ctx.svg('text', { class: `t-small t-halo${anchor === 'end' ? ' t-end' : anchor === 'middle' ? ' t-mid' : ''}`, x: tx.toFixed(1), y: ty.toFixed(1), text }, lg);
      H.labelOf[m.id] = lg;
    };
    // Open marker first (its label must show), then chronological.
    const order = [...relevant].sort((a, b) => (a.id === openId ? -1 : b.id === openId ? 1 : a.t - b.t));
    // Unforced labels only where the timeline is sparse: before 2010, or a marker that stands
    // alone in its lane. The burst stays a crowd of shapes; hover, focus or a lane chip names them.
    const isolated = (m) => !MS.some((o) => o !== m && o.lane === m.lane && Math.abs(o.t - m.t) < 6);
    const pending = [];
    for (const m of order) {
      if (!zoom && !forced && m.id !== openId && m.t >= 2010 && !isolated(m)) continue;   // zoomed: try every label
      if (forced && m.lane !== forced && m.id !== openId) continue;
      const text = smart(m.short);
      const w = measure(text, 't-small');
      const cands = [
        { b: [m.px + 13, m.py - 9, w + 2, 18], tx: m.px + 13, ty: m.py + 4.5, anchor: 'start' },
        { b: [m.px - 13 - w - 2, m.py - 9, w + 2, 18], tx: m.px - 13, ty: m.py + 4.5, anchor: 'end' },
      ];
      if (zoom && !forced && m.id !== openId) {
        // Zoomed: a label may also sit just above or below its marker (inside its own lane),
        // nudged sideways with a short leader when the spot right over the marker is taken.
        const li = LANE[m.lane].index;
        const lo = laneTop(li) + 1;
        const hi = laneTop(li) + 69;
        for (const dir of [-1, 1]) {
          const ty = dir < 0 ? m.py - 15 : m.py + 25;
          if (ty - 13 < lo || ty + 5 > hi) continue;
          for (const shift of [0, w / 2 + 8, -(w / 2 + 8)]) {
            const lx = Math.min(Math.max(m.px + shift, xMin + w / 2), xMax - w / 2);
            const leader = Math.abs(lx - m.px) > w / 2 - 4
              ? { d: `M${(lx + (lx > m.px ? -w / 2 : w / 2)).toFixed(1)} ${(ty - 4).toFixed(1)}L${m.px.toFixed(1)} ${(m.py + dir * 10).toFixed(1)}`, x: m.px.toFixed(1), y: (m.py + dir * 10).toFixed(1) }
              : null;
            cands.push({ b: [lx - w / 2 - 1, ty - 13, w + 2, 18], tx: lx, ty, anchor: 'middle', leader });
          }
        }
      }
      if (m.id === openId && forced !== m.lane) {
        for (const k of [1, 2, 3, 4]) {
          for (const dir of m.row ? [1, -1] : [-1, 1]) {
            const ty = m.py + dir * (k * 19 + (dir < 0 ? 0 : 8));
            for (const shift of [0, w / 2 + 10, -(w / 2 + 10)]) {
              const lx = Math.min(Math.max(m.px + shift, xMin + w / 2), xMax - w / 2);
              const top = ty - 13;
              if (top < 30 || ty > H.svg.viewBox.baseVal.height - 46) continue;
              const ly = dir < 0 ? ty + 4 : ty - 13;
              cands.push({ b: [lx - w / 2 - 1, top, w + 2, 18], tx: lx, ty, anchor: 'middle',
                leader: { d: `M${lx.toFixed(1)} ${ly.toFixed(1)}L${m.px.toFixed(1)} ${(m.py + dir * 12).toFixed(1)}`, x: m.px.toFixed(1), y: (m.py + dir * 12).toFixed(1) } });
            }
          }
        }
      }
      const c = cands.find((cd) => cd.b[0] >= xMin && cd.b[0] + cd.b[2] <= xMax && !hit(cd.b));
      if (c) { boxes.push(c.b); put(m, text, c.tx, c.ty, c.anchor, c.leader); }
      else if (forced === m.lane) pending.push({ m, text, w: w + 2 });
    }
    // Forced lane: every label that did not fit beside its marker goes into the row above the
    // markers, spread in date order (so leaders never cross) and slid left into the empty decades.
    if (pending.length) {
      const li = LANE[forced].index;
      const lo = padL + 34 + measure(LANE[forced].label.toUpperCase(), 't-caps');
      const gap = 12;
      // Spread labels in date order between lo and xMax, as close to their markers as possible.
      const relax = (items) => {
        let edge = lo;
        for (const it of items) { it.x = Math.max(it.m.px - it.w / 2, edge); edge = it.x + it.w + gap; }
        edge = xMax;
        for (let i = items.length - 1; i >= 0; i--) { const it = items[i]; it.x = Math.min(it.x, edge - it.w); edge = it.x - gap; }
        return !items.length || (items[0].x >= lo - 0.5 && items.every((it) => Math.abs(it.x + it.w / 2 - it.m.px) < 80));
      };
      pending.sort((a, b) => a.m.px - b.m.px);
      const tiers = [{ y: laneTop(li) + 13, items: pending }];
      if (!relax(pending)) {
        // Two staggered rows (the upper one reaches into the faded lane above).
        const upper = li > 0 ? laneTop(li) - 7 : laneTop(li) + 82;
        tiers[0].items = pending.filter((_, i) => i % 2 === 0);
        tiers.push({ y: upper, items: pending.filter((_, i) => i % 2 === 1) });
        tiers.forEach((t) => relax(t.items));
      }
      for (const t of tiers) {
        for (const it of t.items) {
          if (it.x < lo - 1) continue;
          const cx = it.x + it.w / 2;
          const below = t.y > it.m.py;
          const ly = below ? t.y - 13 : t.y + 4;
          const my = it.m.py + (below ? 11 : -11);
          put(it.m, it.text, cx, t.y, 'middle', { d: `M${cx.toFixed(1)} ${ly}L${it.m.px.toFixed(1)} ${my.toFixed(1)}`, x: it.m.px.toFixed(1), y: my.toFixed(1) });
        }
      }
    }
  }

  function showHover(m) {
    if (!H.hover || H.labelOf[m.id]) return;
    const text = `${m.label} · ${smart(m.short)}`;
    const w = H.measure(text, 't-small') + 16;
    const lx = Math.min(Math.max(m.px - w / 2, H.padL), H.W - H.padR - w);
    const above = m.py - 24 > 30;
    const ty = above ? m.py - 30 : m.py + 16;
    H.hoverRect.setAttribute('x', lx);
    H.hoverRect.setAttribute('y', ty);
    H.hoverRect.setAttribute('width', w);
    H.hoverText.setAttribute('x', lx + 8);
    H.hoverText.setAttribute('y', ty + 16.5);
    H.hoverText.textContent = text;
    H.hover.setAttribute('opacity', 1);
    H.hover.dataset.id = m.id;
  }
  function hideHover(m) {
    if (!H.hover || (m && H.hover.dataset.id !== m.id)) return;
    H.hover.setAttribute('opacity', 0);
  }

  function onMarkerKey(e, m) {
    const vis = visibleMs();
    let target = null;
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openCard(m.id); return; }
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      const k = vis.indexOf(m);
      const list = k >= 0 ? vis : MS;
      const j = list.indexOf(m) + (e.key === 'ArrowRight' ? 1 : -1);
      target = list[Math.max(0, Math.min(list.length - 1, j))];
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      const dir = e.key === 'ArrowDown' ? 1 : -1;
      for (let li = LANE[m.lane].index + dir; li >= 0 && li < LANES.length; li += dir) {
        if (!laneOn(LANES[li].id)) continue;
        const cand = MS.filter((x) => x.lane === LANES[li].id && inView(x));
        if (!cand.length) continue;
        target = cand.reduce((a, b) => (Math.abs(b.t - m.t) < Math.abs(a.t - m.t) ? b : a));
        break;
      }
    } else if (e.key === 'Home') target = vis[0];
    else if (e.key === 'End') target = vis[vis.length - 1];
    else return;
    e.preventDefault();
    dismissHint();
    if (target && target !== m) {
      H.marks[target.id]?.el.focus({ preventScroll: true });
      if (openId) openCard(target.id);
    }
  }

  // ================================================================ vertical layout (phones)
  function drawVertical() {
    lastW = 0;
    F.main.replaceChildren();
    const list = ctx.h('ol', { class: 'tl-list', 'aria-label': 'Milestones, oldest first' });
    const rows = {};
    let prev = null;
    let era = null;
    for (const m of MS) {
      const e = ERAS.find((er) => m.t >= er.from && m.t < er.to) || ERAS[ERAS.length - 1];
      if (e !== era) {
        era = e;
        list.append(ctx.h('li', { class: 'tl-eraH', 'aria-hidden': 'true' }, e.label));
      } else if (prev && m.y - prev.y > 10) {
        const gap = ctx.h('li', { class: 'tl-gap' }, ctx.h('span', null, `… ${m.y - prev.y} years …`), ctx.h('i', { 'aria-hidden': 'true' }));
        gap.setAttribute('aria-label', `${m.y - prev.y} years with no milestone`);
        list.append(gap);
      }
      const lane = LANE[m.lane];
      const btn = ctx.h('button', { type: 'button', class: 'tl-row', 'aria-label': ariaOf(m), 'aria-expanded': 'false', dataset: { id: m.id } },
        ctx.h('span', { class: 'tl-row__mk', html: markerSVG(m.type, lane.color, 22) }),
        ctx.h('span', { class: 'tl-row__date' }, ctx.h('b', null, String(m.y)), m.label === String(m.y) ? null : ctx.h('span', null, m.label.replace(` ${m.y}`, ''))),
        ctx.h('span', { class: 'tl-row__txt' },
          ctx.h('span', { class: 'tl-row__title' }, smart(m.short)),
          ctx.h('span', { class: 'tl-row__lane', html: `<span style="color:${lane.color};display:inline-flex">${glyphMarkup(lane.glyph, 14)}</span>` }, lane.label)));
      btn.addEventListener('click', () => (openId === m.id ? closeCard() : openCard(m.id)), { signal: ctx.signal });
      const li = ctx.h('li', { class: 'tl-item', dataset: { lane: m.lane } }, btn);
      list.append(li);
      rows[m.id] = { li, btn };
      prev = m;
    }
    F.main.append(list);
    V = { list, rows, slot: null };
    applyFilter({ instant: true });
    paintOpen();
  }
  function placeCardUnderRow(id) {
    const r = V.rows?.[id];
    if (!r) return;
    if (!V.slot) V.slot = ctx.h('li', { class: 'tl-cardslot' });
    r.li.after(V.slot);
    V.slot.append(card.el);
  }

  // ---------------------------------------------------------------- filtering
  function applyFilter() {
    if (H.marks && !vertical) {
      for (const { el, m } of Object.values(H.marks)) {
        const on = laneOn(m.lane);
        el.classList.toggle('is-dim', !on);
        el.setAttribute('tabindex', on ? '0' : '-1');
      }
      H.svg.querySelectorAll('.tl-lane-h').forEach((n) => n.classList.toggle('is-dim', !laneOn(n.dataset.lane)));
      placeLabels();
    }
    if (V.rows && vertical) {
      for (const [id, r] of Object.entries(V.rows)) {
        const on = laneOn(MS.find((m) => m.id === id).lane);
        r.li.classList.toggle('is-dim', !on);
      }
    }
    // Keep the open card's Prev/Next in step with the filter.
    if (openId) {
      const m = MS.find((x) => x.id === openId);
      card.show({ kicker: kicker(m), title: smart(m.title), body: cardBody(m) });
    }
  }

  // ---------------------------------------------------------------- layout switching
  function layout() {
    // Phones (< 768 px viewport), or any figure too narrow for a readable horizontal axis.
    const wantVertical = window.innerWidth < VERTICAL_BELOW || (fig.clientWidth || ctx.width) < 560;
    fig.classList.toggle('tl-vertical', wantVertical);
    if (wantVertical !== vertical) {
      vertical = wantVertical;
      H = {};
      V = {};
      restoreCard();
      if (vertical) drawVertical(); else drawHorizontal();
      if (openId) openCard(openId);
      return;
    }
    if (!vertical) {
      const W = Math.round(F.main.clientWidth);
      if (W && Math.abs(W - lastW) > 2) drawHorizontal();
    }
  }
  ctx.onResize(() => layout());
  layout();
  // Re-measure labels once the web fonts are in.
  document.fonts?.ready?.then(() => { if (!vertical && !ctx.signal.aborted) drawHorizontal(); });

  ctx.on(fig, 'pointerdown', (e) => { if (e.target.closest?.('.tl-m, .chip, .tl-row')) dismissHint(); });

  return {};
}

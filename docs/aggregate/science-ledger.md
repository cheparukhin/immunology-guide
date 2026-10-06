# Science ledger — aggregate scientific review (running notes)

Purpose: record mechanisms/numbers/framings as stated per chapter so cross-chapter checks don't rely on memory. Line numbers = `docs/aggregate/book-reading-copy.md`.

## Ch 1 (L3–288)
- Immune cells 1.8 T (1.5 woman, 1 T child), 1.2 kg, ~6% of cells; neutrophils >1/3 (~660 bn), T cells ~1/4 (~470 bn); macrophages 1/10 by number, ~half by weight. Location: 40% BM, 39% lymphatic organs, 19% tissues, 2% blood; <2% of T cells in blood. (Sender 2023)
- Affinity: KD; antibody ceiling ~0.1 nM (Foote & Eisen); TCR KD 1–100 µM; single contact ~1 s–1 min; engineered TCR pM; affinity ↔ selectivity trade-off.
- Self = learned (tolerance); Medawar 1953; Matzinger danger 1994; "two-key logic" → two-factor authentication (Ch4).
- Frameshifts can make new protein stretches conspicuous to immune system → Ch6.
- Caffeine as receptor blocker → Ch8 blocking antibodies analogy.
- Casgevy Dec 2023, ≥12 y; edit switches on fetal Hb (BCL11A enhancer) — not fixing letter. OK.

## Ch 2 (L290–549)
- 10 human TLRs; TLR4=LPS, TLR5=flagellin; endosomal 3/7/8/9. cGAS–STING (STING on ER membrane).
- Neutrophils 50–100 bn/day; half-life 6–8 h classic.
- Complement: CD55/CD46/CD59 overexpressed on tumors; C5a may recruit suppressive cells.
- Interferons raise MHC-I display. cGAS–STING in DCs needed for priming against tumor (mouse) → Ch7/12.
- NK: missing self (Kärre); KIR, NKG2A/HLA-E; NKG2D/MICA/B/ULBP; CD16 ADCC; education/licensing. Imai 2000 Japan cohort ~40% lower cancer risk (correlation). Limits: poor penetration of solid tumors; NKG2A blockade etc. → Ch12.
- "T cells kill tumor cells whose windows show abnormal fragments, while cells that lost windows survive" → Ch7.
- M1/M2 = spectrum; TAMs toward repair end; Dvorak 1986 "wounds that do not heal"; chronic inflammation → cancer (H. pylori, HBV/HCV, IBD).
- Key idea: "No danger signal, no response… a tumor rarely raises the alarm." "It largely misses cancer."
- Trained immunity (BCG) months not decades.

## Ch 3 (L552–820)
- Heavy chain ~40 V, 23 D, 6 J → ~5,500; light ~320; ~1.8–2 M combos. 10^15 possible TCRs; antibodies 10^16–10^18 across 10 people (Briney).
- Repertoire: ≥10^8 TCRβ (Qi 2014), model ~10^10 (Lythe). "10^7–10^8 textbook = minimums."
- Precursor frequency (mouse): 1 in 200,000 naive CD8 (Blattman 2002), 100–200 cells → ~10 M in a week (>14 divisions); 95% die; ~500,000 memory.
- Primary response 1–2 weeks; secondary 3–4 days.
- Antibody 4 jobs: neutralization, opsonization, complement, ADCC (NK via Fc receptors). IgG 4 subclasses.
- B-cell self-reactivity 55–75% early (Wardemann 2003).
- "T-cell receptor never mutates after it leaves the thymus."
- Antibody half-lives (Amanna 2007).

## Ch 4 (L823–1090)
- MHC-I: proteasome → TAP → ER → groove 8–10 aa, anchors (pos 2 and C-term); ~1 in 5,000 peptides survive; ~200,000 class I/lymphocyte, <10,000 distinct peptides. DRiPs. Immunoproteasome (IFN).
- Ch4 says "Chapter 2 called it an ID badge" — but Ch2 actually calls MHC-I "shop window" (L448). [consistency nit; editor]
- HLA: 3 class I genes, ≤6 molecules; >45,000 alleles by mid-2026.
- Alloreactivity ~7% T cells (mouse) vs 1 in 100,000 for a viral peptide.
- MHC-II: pro APCs (DC, macrophage, B); 13–25 aa (avg ~15); mature DC ~2 M class II. Invariant chain/CLIP/HLA-DM.
- Cross-presentation: Bevan 1976; cDC1 (Batf3 KO mice fail to reject tumors); cDC1 carry tumor material to dLN (Roberts 2016 / Salmon 2016).
- Precursor frequency 1 in 10^4–10^6 (most at rare end), "closer to 1 in 100,000" in figure/takeaway; mouse 15–1,100 cells.
- DC–T contacts ~3 min; DC touches few thousand T cells/h.
- Signal 1 alone → anergy (in vitro; Jenkins & Schwartz); in vivo also abortive proliferation/deletion. Signal 2 = CD28–B7 (CD80/86). Signal 3 = IL-12 + type I IFN for CD8.
- CTLA-4 appears after activation, binds B7 more tightly than CD28.
- Key-idea wording: "Most tumors never infect dendritic cells" (odd phrasing).

## Ch 5 (L1101–1396)
- Thymus: ~3% survive (Egerton 1990); ~6 deleted per graduate (Stritesky 2013), 3/4 deletions cortical; AIRE ~1/5 of 19,000 genes (mouse).
- Male-antigen T cells: men only ~3× fewer (Yu 2015); anergic.
- Tregs FOXP3; IL-2 sink; CTLA-4 trans-endocytosis of B7; scurfy; IPEX; Nobel 2025 Brunkow, Ramsdell, Sakaguchi (correct).
- Kill: ~3 pMHC to kill (Purbhoo 2004); 30 s pores; 80 s repair; 2–16 kills/day in vivo (Halle 2016). Fas/FasL. IFN-γ, TNF.
- CD4 help: CD40L–CD40 licensing; cDC1 platform; Th1 most associated w/ tumor control.
- CTLA-4: after activation; binds B7 more tightly; trans-endocytosis; "acts mainly during priming"; KO mice die 3–4 wk; Treg-specific KO fatal.
- PD-1: Honjo 1992; PD-L1 induced by IFN-γ; "acts mainly in tissues, effector phase"; SHP2; PD-L2 on DC/macrophages; PD-L1–CD80 cis. KO: milder, lupus-like/cardiomyopathy. Box: "mainly", PD-1 also in LN.
- Abatacept (CTLA-4-Ig) for RA.
- Exhaustion: TOX; PD-1, TIM-3, LAG-3; Tpex TCF1+ (Im 2016; Miller 2019); "releasing PD-1 brake… mostly does not revive the most exhausted cells. It wakes the reserve." Epigenetic scarring (Pauken 2016). "Lasting control may require clearing antigen or combining approaches."
- NOTE: Ch5 frames PD-1 blockade = Tpex proliferation; no mention of clonal replacement / new clones from outside the tumor (Yost 2019) — check Ch8.

## Ch 6 (L1399–1663)
- Eyelid skin: ~1/4 cells carry driver mutation; 140/cm² (Martincorena 2015).
- ~3 mutations per stem-cell division (Tomasetti). 2–8 drivers (Vogelstein 2013). 20–30 years.
- Infections cause ~2.2 M cancers/yr (~1 in 8) (de Martel 2020 ~13%).
- KRAS G12D GADGVGKSA; HLA-C*08:02 (~8% white, 11% Black Americans); Tran 2016 — regrowth lost chromosome 6 (HLA LOH).
- Tumor antigens 4 kinds: neoantigens, viral (E6/E7; EBV), cancer-testis (>200 genes; sperm lack MHC-I; MAGE-A1 Boon 1991, NY-ESO-1 1997), TAAs (HER2, gp100, MART-1). Vitiligo 3.4% meta (Teulings 2015).
- 1.6% of protein-changing mutations recognized; 99% unique (Parkhurst 2019). TESLA 608/37. Ott 2017 CD4 60% vs CD8 16%.
- TMB: typical differ ~150-fold; individual >1000-fold; MSI-H ~10×; TMB explains ~half of variance in anti-PD-1 ORR (Yarchoan 2017). Merkel.
- CRC dMMR ~15% (3/4 sporadic), metastatic ~1 in 20.
- Clonal neoantigens (McGranahan 2016). NY-ESO-1 patchy in 6/25 synovial sarcomas.
- Ch6 L1510: tumor rarely sounds alarm; DCs stay immature; T cells switched off.

## Ch 7 (L1666–1996)
- Shankaran 2001: RAG2-/- 30/52 vs WT 11/57 at 160 d; ~40% unedited tumors rejected. Koebel 2007 equilibrium (T cells+IFN-γ, not NK). Matsushita 2012 spectrin-β2.
- Engels 2011: 175,732 transplants, SIR 2.1; Kaposi ~61; NHL 7.5; breast/prostate not raised; ~7 excess cancers/1,000/yr. 2024 meta 113 studies.
- Galon 2006; Immunoscore (Pagès 2018) 8% vs 32% recurrence.
- HLA LOH ~40% NSCLC (McGranahan 2017); subclonal, more in mets.
- Cycle (Chen & Mellman 2013), 7 steps; set point (2017); 2023 update (intratumoral niches; progenitor T cells "possibly in LN"; immunotype).
- L1808: "anti-CTLA-4 acts at priming and anti-PD-1 at killing (Ch 8)"; "Engineered T cells and T-cell-engaging antibodies… skipping the first three steps."
- Escape: Hide (B2M; HLA LOH) → step 6; Brake (PD-L1 adaptive resistance, Taube 2012) → step 7; corrupt guards (Treg, MDSC, TAM) → steps 7 & 3; walls (CAF, TGF-β, Mariathasan 2018; bintrafusp failure) → step 5; poison (adenosine CD39/CD73/A2A; IDO1/epacadostat failure; lactate; glucose partitioning Reinfeld 2021; hypoxia) → step 7; deaf (JAK1/2; Zaretsky 2016: 2 JAK, 1 B2M of 4) → steps 6 & 7.
- Inflamed/excluded/desert. β-catenin excludes DCs (Spranger 2015). TLS 2020 (3 Nature papers).
- "Checkpoint inhibitors release brakes on T cells that are already there" (L1928) — tension with Ch5 Tpex/new-clone framing.

## Interlude (L1999–2195)
- Coley 1891; toxins stopped 1952; FDA 1962. Ehrlich 1909; Burnet/Thomas late 1950s; 1974 nude mice (Stutman).
- Köhler & Milstein 1975; rituximab 1997; trastuzumab 1998. BCG 1976 (Morales). IFN-α 1986 (hairy cell). HD IL-2 1992 RCC / 1998 melanoma; ORR 15–20%, CR 5–10%. TIL 1988 ~half of 20. Vaccines 2.6% of 440 (Rosenberg 2004).
- CTLA-4 1987 Golstein; 1994–95 brake (Walunas/Bluestone; Krummel/Allison); Leach 1996. Medarex 1999. PD-1 1992; B7-H1 1999; PD-L1 2000; 2002 tumors use PD-L1.
- Tremelimumab 2008 (655 pts; OS 12.6 vs 10.7; DoR 35.8 vs 13.7). Ipi 2010 (OS 10 vs 6.4 mo), approved 2011. Nivo 2012 Topalian. PD-1 approved 2014.
- Eshhar 1989; Emily Whitehead April 2012; tocilizumab; Science BTY 2013; Carter 2015.
- Tissue-agnostic 2017; first CAR-T 2017; Nobel 2018.
- NADINA EFS 12-mo 57%→84%. KEYNOTE-942 HR ~0.56 "borderline". **Aug 2026: Merck/Moderna reported phase 3 met primary endpoint (company-reported)** [VERIFY]. **BioNTech ended autogene cevumeran CRC trial (crossed futility Oct 2025; OS imbalance)** [VERIFY].
- Gemtuzumab 2000 → withdrawn 2010 → 2017.
- 2023 US: 57/100 eligible, ~20 respond (Haslam/Prasad-type estimate) — also in Ch8 [consistent].
- Tremelimumab+durvalumab HCC 2022.

## Ch 8 (L2198–2481)
- CTLA-4 "acts early in LN"; PD-1 "acts later, in tissues". Brake analogy limits.
- IgG4 PD-1 blockers; atezo/durva Fc-silenced IgG1; avelumab IgG1 active; ipi IgG1; treme IgG2. Anti-PD-L1 also blocks PD-L1–B7(CD80).
- Anti-CTLA-4: lowers activation threshold, broader repertoire ("one leading idea"); Treg depletion: mouse yes (Arce Vargas 2018), human mixed (Sharma 2019); FcγRIIIa V158F polymorphism.
- Anti-PD-1: "works mostly through reserve (Tpex)"; clonal replacement (Yost 2019, BCC/SCC); "clonal revival" (Liu 2022 NSCLC 47 biopsies/36 pts). Newcomers "receptors could already recognize the tumor". Key idea: "including some that had not yet been switched on."
- CheckMate 067 10-y: median OS 19.9/36.9/71.9 mo; 10-y OS 19/37/43%; HR combo vs nivo 0.85 (0.69–1.05); 52% combo alive-not-dead-of-melanoma ...; PFS at 3y → 96–97% MSS at 10 y.
- Robert 2011 dacarbazine 9.1 mo, 12% 3-y. Schadendorf pooled 1,861: plateau ~1 in 5 from year 3.
- KEYNOTE-024 5-y OS 32% vs 16%.
- Le 2015: 1,782 vs 73 mutations; 4/10 vs 0/18. Hodgkin 20/23. Kidney "puzzle".
- Cold: pancreatic, most CRC, prostate, GBM — no ICI approval except dMMR/TMB-H.
- 57/100 eligible, 20/100 respond (2023).
- TMB-H ≥10 mut/Mb 2020 (KEYNOTE-158 29% vs 6%); McGrail 2021 ~40% vs ~15%.
- RELATIVITY-047 714 pts PFS 10.1 vs 4.6, gr3-4 19 vs 10%; approved 2022. ECHO-301 706 pts. SKYSCRAPER-01 "521 people" [check: 534?]. Fianlimab May 2026 (1,546 pts; HR 0.85 NS; company) [VERIFY]. Roche stopped tiragolumab July 2025 [VERIFY]; Arcus/Gilead stopped STAR-221 Dec 2025 [VERIFY].
- irAEs: nivo 86% any, 21% gr3-4; ipi 28%; combo 59%. Fatal: 1/270 PD-(L)1, 1/90 CTLA-4, 1/80 combo (Wang 2018). Myocarditis 1/1,700 nivo, 1/370 combo; ~half fatal. Hypothyroid ~7%/13%; hypophysitis 3% ipi /6% combo / <1% PD-1; adrenal 4% combo.
- Pseudoprogression 4.7%; HPD 13.8% vs 5.1% chemo (Ferrara 2018).
- "Every checkpoint inhibitor approved so far is a monoclonal antibody" (IgG).

## Ch 9 (L2484–2769)
- Köhler & Milstein 1975, Nobel 1984; OKT3 1986. Chimeric/humanized/fully human (2002, 2006). INN: source infix dropped 2017; -mab retired Oct 2021 → -tug/-bart/-mig/-ment; first new-stem approvals 2025 China.
- HER2 15–20% breast; Slamon OS 20→25 mo; cardiac 27%/16% with anthracycline.
- Cetuximab KRAS (Karapetis 2008 9.5 vs 4.8). Rituximab CD20 (ADCC/CDC/ADCP); R-CHOP CR 63→76%. Bevacizumab 15.6→20.3.
- Ravetch 2000 FcγR dependence (mouse).
- ADC: ~0.1% dose reaches tumor; T-DM1 DAR 3.5 non-cleavable; T-DXd DAR 8 cleavable, bystander; DB-03 12-mo PFS 76 vs 34%; DB-04 OS 23.4 vs 16.8, ILD 12%/0.8% fatal; HER2-low approval 2022.
- TCE: CD3; "veteran T cells… can kill without signal 2"; precursor freq "1 in 100,000 to a million"; bypass MHC; CRS. Blinatumomab 2014 (TOWER 7.7 vs 4.0), half-life ~2 h. Teclistamab MajesTEC-1 ORR 63%, CRS 72% (<1% severe), infections 76%/45%. MajesTEC-3 Tec-Dara 3-y PFS 83 vs 30%, fatal AEs 7.1 vs 5.9%; **FDA approved March 2026** [VERIFY]. Tarlatamab DeLLphi-304 OS 13.6 vs 8.3; accelerated 2024; **full approval Nov 2025** [VERIFY]. Tebentafusp 2022 (first TCE for solid tumor), HLA-A*02:01, 1-y OS 73 vs 59%.
- EV+pembro OS 31.5 vs 16.1.
- Antigen escape after BCMA/GPRC5D (deletion, epitope mutation).

## Ch 10 (L2772–3032)
- Porter 2011 CLL; Eshhar 1989; 1st gen failure (Kershaw 2006); 2nd gen CD28 (2002) / 4-1BB (2004). All approved = 2nd gen. CAR "removes the independent check".
- Obe-cel Nov 2024 (FELIX 77%, CRS ≥3 2.4%, ICANS ≥3 7.1%).
- MHC-independence; "a few thousand of ~20,000 proteins reach the surface".
- Prices $373–475k launch → $462–594k by 2025. [Cost paragraph duplicated L2848/L2850]
- ELIANA ~81% remission, 76% 1-y OS; ZUMA-1 5-y 43% OS, 31% ongoing response; CARTITUDE-4 12-mo PFS 76 vs 49%. Melenhorst 2022 (CD4 dominance). "~60% of lymphoma responders eventually relapse."
- CRS: IL-6 mainly from host macrophages (mouse); tocilizumab; Emily Whitehead.
- ICANS: 60% axi-cel, 40% tisa-cel; severe 7–21%. NRM: infection > half (≈8,000 pts); CRS+ICANS ~1/9.
- Boxed warning April 2024: 22 cases / >27,000 doses; 3 CAR+. Stanford 724 pts 1 T-cell lymphoma (no vector involvement).
- REMS removed June 2025 (2-week proximity/driving). **MZL approval Dec 2025** [VERIFY].
- **Satri-cel (claudin-18.2) conditional approval China June 2026 — first solid-tumor CAR-T** [VERIFY]; PFS 3.25 vs 1.77 mo; ~all CRS; 99% ≥gr3 AE.
- HER2 CAR-T death 2010; CD19-neg relapse; GPC3 CAR ± IL-15; CARv3-TEAM-E; GD2 DMG; suicide switch.
- TIL: phase 3 49% vs 21% (ipi); lifileucel Feb 2024 accelerated, 31.5% of 73; EU application withdrawn. "first T-cell therapy approved for solid tumor".
- TCR-T: MAGE-A3/titin deaths; afami-cel Aug 2024 accelerated, **confirmed June 2026, extended to ≥12 y** [VERIFY]; HLA-A*02; ~4/10 respond.
- In vivo CAR-T: 5 myeloma pts viral vector (4 resp, 3 CR, all ≥gr3, enrollment stopped) [VERIFY]; 5 lupus pts LNP-mRNA CD19 [VERIFY]. Erlangen 15 pts autoimmune.

## Ch 11 (L3036–3301)
- Scotland zero cervical cancers (Palmer 2024); Sweden 88%/53% (Lei 2020); England 87/62/34% (Falcaro 2021). Costa Rica 2,189 (Hildesheim 2007). Single dose WHO 2022.
- Infection-attributable 2.2 M (2018), HPV 690k, HBV 360k. Taiwan HBV: 0.23 vs 0.92/100k.
- Rosenberg 2.6% of 440. Four weak links. MAGRIT 2,312 pts HR 1.02.
- Sipuleucel-T 2010, OS 21.7→25.8 (512 men), no PFS change.
- Personalized: up to 34 (intismeran) / 20 (autogene cevumeran); LNP i.m. vs lipoplex i.v.; ~6 wk manufacturing; 9 wk median to dose. 25/230 (11%) neoantigens immunogenic (Rojas 2023); Ott 2017 60%/16%; Sahin 2017 13 pts; B2M-loss relapse.
- KEYNOTE-942: 157 pts; 22% vs 40%; HR 0.56 (0.31–1.02), p=0.053; gr≥3 25 vs 18%; 5-y HR 0.51 (0.29–0.89), descriptive. **INTerpath-001 1,137 pts; Aug 2026 met RFS + DMFS at interim (company); data due at congress later Oct** [VERIFY].
- Russia NeoOncovac Nov 2025 [check].
- Pancreatic (Rojas 2023; Sethna 2025): 16 pts, half responders; T-cell lifespan 7.7 y; IMCODE003 260 pts.
- **BioNTech stopped CRC ctDNA+ phase 2 (vaccine alone) Aug 2026; futility Oct 2025; OS imbalance** [VERIFY].
- **ELI-002 7P phase 2 (144 pts) missed primary June 2026** [VERIFY].
- T-VEC 2015 (OPTiM DRR 16% vs 2%); MASTERKEY-265 (692) negative. **RP1 accelerated approval Aug 2026 (Tudriqev), ORR 24%** [VERIFY].

## Ch 12 (L3304–3566)
- Cercek 2022 dostarlimab 12/12. 57/20 (2023) again.
- L3324: "PD-1 blockers act mainly on the last link… (CTLA-4 at priming)"; key idea L3355 "releasing the PD-1 brake mainly repairs the last one".
- ~3/4 PD-1 responses in melanoma last (Zaretsky). Anagnostou 2017 7–18 neoantigens lost. B2M LOH 30% NR vs 10% R (Sade-Feldman 2017); biallelic only NR. JAK1/2 two hits. dMMR B2M-loss 20/21 respond, γδ T cells (de Vries 2023). HLA heterozygosity 1,535 pts (Chowell 2018).
- STING agonist 106 pts ~10% ORR. 5,683 PD-(L)1 trials by end 2021. Bempeg PIVOT IO-001 783 pts ORR 28 vs 36%.
- Neoadjuvant: OpACIN 20 pts; S1801 313 pts 2-y EFS 72 vs 49%; NADINA 423 pts 84 vs 57%, MPR 59%, gr≥3 ~30 vs ~15%; CheckMate 816 5-y OS 65 vs 55%, pCR 95% 5-y OS. Cercek 2025: 117 pts dMMR; 92% 2-y RFS. NCCN preferred; AZUR-1 (154 pts) **PDUFA Feb 2027** [VERIFY].
- Microbiome: Routy/Gopalakrishnan 2018; Baruch 3/10, Davar 6/15; RCC placebo-controlled FMT 45 pts (70 vs 41% 12-mo PFS); fiber 128 pts; FMT ESBL death.
- IMvigor011: 250 ctDNA+ randomized, OS 21→33 mo; 357 ctDNA-negative 88% DFS at 2 y. **FDA approved May 2026** [VERIFY].
- CD47: ENHANCE 539 pts; fatal AEs 15.2 vs 9.8%. Ivonescimab HARMONi-2 PFS 11.1 vs 5.8; **OS 30.8 vs 22.6 at Sept 2026 conference** [VERIFY]; China approval 2025; HARMONi OS NS. [CHECK FDA status of ivonescimab by Oct 2026]
- Pembrolizumab ~$12,000/dose US early 2025; ~$200k/yr; India low-dose nivo 16→43% 1-y OS; WHO EML 2025; patents 2028.
- NK forward ref from Ch2 ("NKG2A blockade… Chapter 12") — Ch12 has only "antibodies that recruit NK cells"; no NKG2A (monalizumab phase 3 failure) [GAP].

## Final cross-chapter verdict (see SCIENCE-REVIEW.md)
- MUST: M1 anti-PD-1 = step 7 only (Ch7 text + ch07-cycle data + Ch12 key idea vs Ch8's LN/blood reserve; evidence PMID 33007259, 36208623, 31359002). M2 "no danger signal" absolutism vs tumor-promoting inflammation (Ch2/6/7/11; PMID 25517615, 21930765). M3 Ch10 duplicated price paragraph (draft L111/L113).
- SHOULD: S1 Ch4 "ID badge" back-ref; S2 8–10 vs 8–11 aa; S3 precursor-frequency range Ch4 vs Ch9; S4 "every ICI is a mAb" vs China bispecifics; S5 GEP/Immunoscore exist; S6 subcutaneous PD-1 blockers (Dec 2024 / Sept 2025); S7 DeLLphi-305 Sept 2026 (company); S8 ivonescimab PDUFA 14 Nov 2026; S9 NKG2A forward-ref unpaid + INTERLINK-1 failure (PMID 40300079); S10 1-in-8 vs 1-in-10 infection fraction; S11 HLA allele count precision (3.63 = 44,876); S12 hedge "newcomers already primed".
- Gaps: STK11/PTEN tumor-intrinsic resistance; NK-directed therapy outcomes; surrogate endpoints (RFS/EFS/pCR); myeloid cells as dominant infiltrate; B cells/TLS in main text; TRM; what "response" omits.

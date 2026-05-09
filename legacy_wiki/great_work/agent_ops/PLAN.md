# Great Work Done in Utah — Research Plan

## Purpose

A wiki of work done in Utah that changed the world. Not a booster piece — an honest accounting of the research, institutions, projects, and companies that originated here and genuinely moved the needle. Meant to give context to anyone wondering why Utah produces so many ambitious people.

Geographic scope: **Utah**. "Done in Utah" means the work was primarily created, developed, or originated here — not merely that the company later moved elsewhere.

---

## Inclusion bar — be generous

Great work is easy to undercount in retrospect. The significance of the University of Utah's computer graphics program wasn't obvious in 1968; the Jarvik-7 looked like a failure before it redefined what was possible. Include anything where a reasonable case can be made that Utah's contribution meaningfully advanced a field. Let the tier signal confidence; don't exclude on uncertainty.

**Tier system:**

- **⭐ S** — Definitively world-changing. The work is in textbooks, changed the trajectory of a field, or the world is measurably different because it happened in Utah.
- **A** — Strong contribution. Significant advance, important institution, or major deployment. The case is clear even if the impact is bounded.
- **B** — Real contribution with caveats. Mattered to a sector or community; significant at a regional or industry level; disputed legacy.
- **C** — Plausible but limited. Some lasting signal; not enough to be confident of broad impact.
- **D** — Weak but in. Something was here; the world-changing claim is questionable.
- **F** — Placeholder. Noticed in research; not yet validated.
- **P-A / P-B / P-C** — Recent or speculative watchlist tiers. Use these for work with credible signals but insufficient historical proof. Do not count them in the main totals until the upgrade trigger is met.

**Entry format by tier:** S/A/B use the full entry format. C/D can use a shorter form. F entries can be a single line.

**Attribution field:** for new entries, especially speculative and borderline ones, include a short attribution sentence when the Utah claim is not obvious:

```
**Utah attribution:** Strong - instrument designed, built, and calibrated at SDL in North Logan
```

Use **strong** when the work itself happened in Utah; **medium** when Utah supplied a decisive person, facility, dataset, or field site but the work was distributed; **weak** when the Utah claim is biographical, corporate, or indirect. Weak attribution does not disqualify an entry, but it should lower the tier or sharpen the caveats.

**Speculative entries:** focus on the work, not the company or area. Use titles like "Multiplexed Medical Radioisotope Production" rather than "Nusano." Early work should still end up in the wiki when it has a plausible Utah tie and enough substance to explain the work. Every speculative entry should include:

- **Why this might become great work** — what would have to be true for the work to matter at world scale
- **Signals so far** — grants, deployments, papers, customers, clinical status, field tests, patents, or technical milestones
- **What would upgrade this** — concrete evidence that would move it into the main S/A/B/C/D tier system
- **Caveats** — why the claim might fail or be overstated

---

## Entry Format

```
## Work / Institution / Project Name [⭐ if S-tier]

**Tier:** [S / A / B / C / D / F]
**Domain:** [e.g., Computing, Medicine, Aerospace, Culture]
**Type:** [Research program / Company / Project / Institution / Discovery]
**Era:** [e.g., 1965–1980, or ongoing]
**Location:** [City, UT]

## What it was

One paragraph: what they built, discovered, or created.

## Why it mattered

Counterfactual argument — what would have been different or slower without this work?

## The hard problem they solved

What was genuinely unsolved before they tackled it?

## Lasting impact

What traces of this work are still visible in the world today?

## Key people

Who drove it? Names and roles.

## Caveats

Honest concerns about overstatement, failure modes, or contested legacy.

## Learn more

Papers, books, talks, articles.
```

---

## Taxonomy

Each entry lives in one of these domain directories:

- `computing-and-software/` — computer graphics, programming languages, operating systems, early software companies
- `mathematics-and-theoretical-science/` — pure mathematics, theoretical computer science, mathematical physics, and field-shaping theoretical work that does not fit a lab-science bucket
- `medicine-and-biology/` — medical devices, clinical firsts, biomedical research
- `aerospace-and-propulsion/` — rocket motors, satellites, defense systems
- `physics-and-materials/` — physical science discoveries, materials research
- `environment-and-earth/` — conservation, geology, water systems, ecology
- `culture-and-arts/` — film, music, literature, architecture
- `industry-and-infrastructure/` — mining, manufacturing, railroads, energy infrastructure
- `defense-and-security/` — proving grounds, security infrastructure, morally complex defense work

---

## Research Operating System

Use this section to keep the project from becoming a pile of solved leads and half-remembered maybes. The goal is not bureaucracy; it is preserving judgment so the next session starts with traction.

For agents focused on rereading, critiquing, reranking, refreshing, or answering continuity questions about existing entries, use `great_work/agent_ops/EDITORIAL_PLAN.md` and `great_work/agent_ops/prompts/wiki-editor-agent.md`. This file remains the main plan for source-first expansion and new-entry research.

### Current sweep handoff

**Last updated:** 2026-05-07
**Current mode:** Source-first artifact mining, with medicine/FDA/ClinicalTrials and federal award databases producing the highest-quality watchlist entries.
**Most recent pattern:** ARPA-E/DOE/OSTI searches mostly resurfaced already-captured Utah energy leads, which is useful coverage evidence. A broader NSF/CCI source-first branch surfaced the University of Utah-anchored Center for Synthetic Organic Electrochemistry as a P-B watchlist entry; the renewed center is now Missouri S&T-led, so keep attribution caveats clear. Defense procurement checks worked when starting from Army/DIU program names rather than company names; the Army SRR / Teal Black Widow trail produced a P-B watchlist entry with an official Army production source.
**Next best move:** Continue the active lead queue from the top, but favor direct database searches over press searches. For medicine, try FDA 510(k)/De Novo/PMA, ClinicalTrials.gov, PubMed, NIH RePORTER, and SBIR by Utah company address, University of Utah correspondent, or Salt Lake City sponsor. For energy and defense, keep mining ARPA-E/OSTI, USAspending, SAM.gov, DIU, AFWERX, SpaceWERX, service releases, and DOE/NSF center lists for concrete artifacts rather than institutional prestige alone.

### Active lead queue

Work from the top of this queue unless a clearly better lead appears. Update it as soon as a lead is written, skipped, or demoted.

| Priority | Lead | Domain | Why promising | Next source to check | Likely tier |
|---|---|---|---|---|---|
| High | NIH / ClinicalTrials / FDA Utah sweep | Medicine & Biology | Best chance of finding serious work hidden behind ordinary company names | ClinicalTrials.gov, FDA designations, NIH RePORTER, PubMed | P-B / P-A |
| High | ARPA-E / DOE / OSTI Utah sweep | Industry & Infrastructure / Physics & Materials | Good fit for geothermal, nuclear, grid, critical minerals, and hard-tech signals | ARPA-E awards, DOE project pages, OSTI papers | P-B / B |
| High | DoD procurement reality check | Defense & Security / Aerospace | Distinguishes demos from deployed systems | USAspending, SAM.gov, DIU, AFWERX, SpaceWERX, service releases | P-B / B |
| Medium | SDL mission-specific instruments beyond WISE/SABER/SOFIE/MSX | Aerospace & Propulsion | Strong Utah execution and primary-source trail | NASA mission pages, SDL publications, IRSA/HEASARC archives | B / A |
| Medium | Utah patent sweep by frontier terms | Cross-domain | Good for obscure Utah inventions that never got press | Google Patents / Lens plus Utah cities and assignees | F / P-C / P-B |
| Medium | University repository and tech-transfer sweep | Cross-domain | Finds methods before they become companies | U of U, BYU, USU dissertations, faculty CVs, tech-transfer pages | F / P-C / B |
| Low | Culture/architecture/publishing/film sweep | Culture & Arts | Underrepresented but harder to source as "world-changing" | Utah history sources, awards, archives, institutional histories | C / B |

### Lead decision template

Use this quick form while sweeping. If the answers are strong enough, write the page immediately; if not, add the lead to the skip/revisit log or `_messy_thoughts.md`.

```
Lead:
Source checked:
Signal: paper / grant / patent / FDA / clinical trial / procurement / deployment / dataset / customer
Utah tie: strong / medium / weak / unknown
Work focus:
Likely tier:
Decision: write / skip / revisit / messy thoughts
Upgrade trigger:
Caveat:
```

### Minimum source standards

- **Historical S/A/B entries:** use at least one primary or institutional source plus one independent, archival, peer-reviewed, or database source when available.
- **Speculative P entries:** require at least one technical, regulatory, grant, clinical, procurement, patent, deployment, or dataset source. Company press alone is a lead, not enough for a page unless the caveats are unusually clear.
- **Medicine entries:** prefer FDA, ClinicalTrials.gov, PubMed, NIH RePORTER, trial publications, or hospital/university sources over funding announcements.
- **Energy/nuclear entries:** prefer DOE, ARPA-E, NRC, OSTI, permits, operating data, or peer-reviewed technical papers over launch coverage.
- **Defense entries:** prefer contracts, procurement records, named evaluations, operational fielding, or service releases over demo videos and sales language.
- **Aerospace instrument entries:** distinguish the Utah-built instrument/subsystem from the whole mission; do not claim the mission when the Utah work was integration, calibration, payload electronics, or a component.

### Skip / revisit log

Add leads here when they looked promising but did not yet justify a page. This keeps future sessions from re-spending the same hour.

| Lead | Decision | Why | Revisit when |
|---|---|---|---|
| ICON MIGHTI/FUV and SDL payload integration | Skip for now | Public trail suggests SDL contributed camera systems and payload integration for instruments led elsewhere; standalone Utah-work claim is weaker than SABER/SOFIE/MSX | Stronger source shows SDL-built core instrument, distinctive dataset, or Utah-led science |
| LT adjuvant vaccine patch / Intercell H5N1 trials | Skip for now | ClinicalTrials.gov shows a Salt Lake City trial site, but the sponsor and vaccine-patch work do not appear Utah-originated from the quick source trail | A stronger source shows Utah invention, manufacturing, trial leadership, or a Utah institution as more than a recruitment site |
| Metal-hydride thermal battery for EV HVAC | Skip for now | ARPA-E/OSTI trail shows real University of Utah prototype work, but the final technical report says commercial applications remain challenging and no durable deployment/adoption surfaced | Evidence of vehicle, stationary HVAC, or solar-thermal deployment with measured cycle life, energy density, cost, and customer adoption |
| Lipocine TLANDO oral testosterone | Skip for now | FDA approval and Salt Lake City sponsorship are real, but the public trail reads as a narrower drug-delivery/product entry in a crowded testosterone-replacement category rather than likely great work | Evidence of unusually broad adoption, major clinical-practice change, superior safety/adherence outcomes, or a reusable Lipocine formulation platform with multiple approved drugs |
| Transit Scientific XO Cross / XO Score peripheral catheters | Skip for now | Multiple FDA 510(k)s and a Utah / University of Utah Center for Medical Innovation regulatory trail are real, but the quick sweep did not surface independent clinical outcomes, broad adoption, acquisition, or a distinctive enough field-level shift beyond a promising vascular-device product line | Peer-reviewed clinical outcomes, meaningful commercial adoption, independent physician evidence, or a transaction/procurement signal showing the platform changed peripheral vascular intervention practice |
| IONIQ ProLung electrical-impedance lung-cancer test | Skip for now | Salt Lake City company, FDA Breakthrough Device claim, and 2022 De Novo submission announcement are real signals, but this sweep did not find public FDA marketing authorization, posted clinical-trial results, or peer-reviewed validation strong enough for a page | FDA authorization, published prospective validation, clinical adoption, or independent evidence that impedance/AI screening improves lung-cancer diagnostic decisions |
| Lumea Viewer+ digital pathology software | Skip for now | FDA 510(k) clearance and Lehi applicant address are real, but the available FDA summary appears to rely on bench, rendering, measurement, and human-factors testing rather than clinical-outcome or distinctive field-change evidence; Techcyte already covers the stronger Utah AI pathology lead | Independent clinical workflow/outcome evidence, broad pathology-lab adoption, or evidence that Lumea's tissue-handling plus viewer stack materially changes diagnosis quality, turnaround, or specimen adequacy |
| Carbon-negative comminution and critical-mineral recovery using Bingham Canyon ore | Revisit | ARPA-E MINER project is real and uses Bingham Canyon feedstock plus a University of Utah bioleaching/carbon-fixation role, but the lead institution is University of Kentucky and the public trail is still mostly proposed/active R&D rather than Utah-led demonstrated work | Bench or pilot results show major comminution-energy reduction, mineral recovery, and carbon-mineralization/fixation performance on Bingham Canyon material, with University of Utah or Utah field-site contribution clearly central |
| DOE EFRC MUSE geo-architected materials center | Revisit | DOE confirms the University of Utah-led 2018-2024 Energy Frontier Research Center and a real publication stream on confined fluids in porous/geo-architected materials, but the quick sweep did not surface a specific field-changing method, dataset, material, or deployment beyond center-level research activity | A review or independent source shows MUSE models, materials, measurements, or datasets became widely used in carbon storage, geothermal, subsurface energy, separations, or porous-materials science |

### Maintenance checks

- After adding or retiering entries, run `python3 scripts/check_great_work_totals.py` and update README totals if needed.
- After adding speculative README rows, run `python3 scripts/check_great_work_watchlist_links.py` to catch missing or mistyped page links.
- Keep `README.md` as the public index and `PLAN.md` as the working memory. If a lead is written, update both immediately.
- Preserve raw, uncertain leads in `_messy_thoughts.md` or the skip log; do not let them crowd the active queue.

### Reranking notes

**2026-05-06 editorial pass:** Retiered several index items to keep the tiers counterfactual rather than celebratory.

- Promoted **Spiral Jetty** from A to S because it is a textbook-defining Land art work whose site-specific meaning depends on Great Salt Lake.
- Promoted **Bingham Canyon Mine** from B to A because it helped prove low-grade porphyry copper mass mining at global scale, despite the environmental and labor caveats.
- Demoted **Electric Traffic Signal** from A to B because the Salt Lake City device is a real early electric signal, but later patented and standardized systems carried more of the global lineage.
- Moved **Mariana Minerals — Copper One** from historical B to P-B because the claimed autonomy-first mine restarted only in April 2026; it needs independent production, safety, uptime, cost, and replication evidence before entering historical totals.

Future rerank passes should ask whether an entry's evidence shows durable field change already, or only a plausible route to future field change. Recent operating sites, clinical products, defense systems, and energy projects should default to P tiers until adoption or measured performance is no longer mostly prospective.

---

## Research Strategy

The strategy has three phases: known leads (fast, high-confidence), source sweeps (systematic), and era sweeps (catches things that don't fit a domain or source). Run them roughly in order — known leads first since they're free, source sweeps second for coverage, era sweeps last to catch the gaps.

---

### Phase 1 — Known Leads (do these first)

Entries that are very likely S or A tier based on prior knowledge. Each is a web search + one or two primary sources away from a full entry.

**Industry & Infrastructure**
- [x] **Transcontinental Railroad — Golden Spike (1869)** — S tier entry written
- [x] **ZCMI cooperative retail network (1868–2001)** — B tier entry written; regional cooperative commercial and manufacturing network with caveats around the disputed "America's first department store" claim
- [x] **Electric traffic signal / Lester Wire (1912)** — A tier entry written; early Salt Lake City electric signal with caveats around disputed first claims and later patented systems
- [x] **Cooperative irrigation institutions (1847–early 1900s)** — B tier entry written; large-scale Anglo-American irrigation settlement model with Indigenous/Spanish precedence caveats
- [x] **Lehi beet sugar industry / Utah-Idaho Sugar** — B tier entry written; irrigated Mountain West beet-sugar processing, cutting stations, seed programs, and regional agricultural-industrial infrastructure
- [x] **Geneva Steel (1942–2001)** — B tier entry written
- [x] **Utah FORGE / enhanced geothermal systems** — A tier entry written; national EGS field lab near Milford
- [x] **Great Salt Lake direct lithium extraction** — P-B watchlist entry written; upgrade requires commercial production plus independent lake-impact monitoring
- [x] **Commercial-scale enhanced geothermal at Cape Station** — P-A watchlist entry written; upgrade requires first power and sustained commercial performance
- [x] **AI-native geothermal exploration** — P-A watchlist entry written; upgrade requires multiple AI-sited discoveries reaching commercial operation with independently improved drilling economics
- [x] **Hybrid flywheel-battery modular power plants** — P-B watchlist entry written; upgrade requires independently measured fleets proving uptime, response, economics, and utility value
- [x] **Advanced nuclear test reactor at San Rafael** — P-B watchlist entry written; upgrade requires safe power operation, useful public test data, and a credible path to commercial reactor licensing
- [x] **AI-scale behind-the-meter energy gigasites** — P-B watchlist entry written; upgrade requires operating AI loads with completed dedicated generation/storage and transparent grid, emissions, water, and local-impact accounting
- [x] **AI-assisted molten-salt microreactors** — P-B watchlist entry written; upgrade requires regulator-credible prototype or demonstration reactor with transparent safety, materials, waste, and cost data
- [x] **High-throughput HALEU enrichment** — P-B watchlist entry written; upgrade requires delivery of commercial-grade HALEU under licensed, independently validated production conditions
- [x] **Pressurized closed-loop geothermal / Rodatherm** — P-B watchlist entry written; upgrade requires Utah pilot operation with independent power, uptime, heat-transfer, and cost data, followed by financed scale-up

**Computing & Software**
- [x] **Evans & Sutherland (1968–present)** — A tier entry written
- [x] **Philo Farnsworth** — C tier entry written; honest about Utah claim being birthplace only
- [x] **FamilySearch genealogical infrastructure / GEDCOM** — A tier entry written; global genealogy archive plus de facto data-exchange standard created from Utah
- [x] **Soundstream / commercial digital audio recording** — A tier entry written; Salt Lake City company founded by U of U professor Thomas Stockham
- [x] **Scientific Computing and Imaging Institute / open scientific visualization infrastructure** — A tier entry written; SCI, SCIRun, Seg3D, ImageVis3D, and image-based biomedical simulation as post-graphics-era Utah computing infrastructure
- [x] **T-splines geometric modeling / BYU CAD research** — B tier entry written; Thomas Sederberg's T-splines moved from BYU research and Utah startup into Autodesk's design-tool ecosystem
- [x] **Iomega Zip Drive** — B tier entry written; Roy-based removable-storage product that became a major 1990s personal-computing bridge between floppy disks and later CD-R/USB/flash/cloud storage
- [x] **Omniture web analytics** — B tier entry written; Provo/Orem enterprise web-analytics company whose 2009 Adobe acquisition helped move Adobe into digital marketing and customer-experience software
- [x] **Autonomous building controls / PassiveLogic** — P-B watchlist entry written; upgrade requires independently measured portfolio deployments showing energy, comfort, and labor gains
- [x] **Biohybrid neural-tissue computing / Intactis Bio** — P-C watchlist entry written; upgrade requires peer-reviewed, reproducible benchmark wins over fair silicon baselines on useful workloads

**Mathematics & Theoretical Science**
- [x] **Hacon-McKernan / minimal model program** — A tier entry written; University of Utah mathematician Christopher Hacon's Breakthrough Prize-recognized work on birational algebraic geometry and the minimal model program, with caveat that the work is collaborative and international
- [x] **Bestvina-Brady groups** — B tier entry written; University of Utah Inventiones paper introducing a named geometric group theory construction with lasting use in finiteness-property questions
- [x] **James Cannon / Cannon's conjecture and Cannon-Thurston maps** — B tier entry written; careful Utah-timing caveat because the original Cannon-Thurston collaboration straddles Wisconsin/BYU timing and William Thurston, while Cannon's conjecture and related combinatorial-conformal program have a stronger BYU-era claim
- [x] **Park City Mathematics Institute** — B tier entry written; Utah-born NSF Regional Geometry Institute that became IAS/PCMI and a durable Park City model for integrating research mathematicians, students, faculty, education researchers, and teachers
- [~] **Other Utah pure-math landmarks** — initial sweep found Hacon/minimal model program and Bestvina-Brady groups; keep looking through University of Utah math awards, ICM/plenary recognitions, and faculty pages for work with external field-level recognition

**Medicine & Biology**
- [x] **Mario Capecchi — gene targeting (Nobel 2007)** — S tier entry written
- [ ] **Willem Kolff — hemodialysis context** — Kolff invented dialysis in the Netherlands; his Utah-era work is primarily the Jarvik-7 program (already covered); likely skip unless further research surfaces distinct Utah-era contributions
- [x] **Myriad Genetics — BRCA gene testing** — A tier entry written
- [x] **Recursion OS / phenomic drug discovery** — P-A watchlist entry written; upgrade requires clinical proof or durable discovery-economics improvement
- [x] **Multiplexed medical radioisotope production** — P-A watchlist entry written; upgrade requires routine commercial isotope delivery
- [x] **3D-printed microfluidics for lab-on-a-chip devices** — P-A watchlist entry written; upgrade requires broad adoption in diagnostics, biology, or microfluidic manufacturing
- [x] **Injectable disc cell therapy / DiscGenics** — P-A watchlist entry written; upgrade requires positive Phase 3 results, FDA approval, reliable manufacturing, and real-world reduction in surgery/opioid/disability burden
- [x] **Proteomic preterm-birth risk testing / PreTRM** — P-A watchlist entry written; Salt Lake City proteomic pregnancy-risk test with validation and intervention-trial signals, upgrade requires independent replication, payer/guideline adoption, and real-world reductions in very early preterm birth, NICU use, and neonatal morbidity
- [x] **Utah Array / BCI platform** — P-B watchlist entry written; upgrade requires cleared/take-home medical BCI or durable real-world patient use
- [x] **Powered bionic leg** — P-B watchlist entry written; upgrade requires commercial/FDA path or durable real-world mobility gains
- [x] **Bidirectional LUKE Arm neuroprosthesis** — P-B watchlist entry written; distinct from the Utah Array BCI platform because the work is a peripheral nerve interface plus prosthetic control/sensory-feedback system built around the DEKA LUKE Arm
- [x] **Head-mounted retinal surgery robot** — P-B watchlist entry written; upgrade requires human clinical results or therapeutic-delivery use
- [x] **Specialized photoneuromodulation for Parkinson's disease** — P-B watchlist entry written; upgrade requires positive pivotal results, FDA clearance, and durable at-home use
- [x] **Noninvasive deep-brain ultrasound neuromodulation** — P-A watchlist entry written; University of Utah / SPIRE DIADEM low-intensity focused-ultrasound platform with peer-reviewed human pilot data for chronic pain and depression, upgrade requires multicenter randomized evidence, FDA clearance/approval, and practical repeatable clinical use
- [x] **MRI-guided focused ultrasound breast ablation / MUSE** — P-B watchlist entry written; upgrade requires published feasibility data, larger complete-ablation trials, and regulator-cleared surgery-sparing use
- [x] **Dynamic compression orthopedic implants / CoAptix** — P-B watchlist entry written; upgrade requires clinical adoption plus measured fusion, nonunion, revision, and complication outcomes after the 2026 FDA 510(k) clearance
- [x] **Percutaneous Bone Bolt fracture fixation** — P-B watchlist entry written; University of Utah Orthopaedic Innovation Center implant system with FDA 510(k), first patient cases, and multicenter observational-study signal; upgrade requires peer-reviewed clinical outcomes, commercial distribution, and independent evidence of better stability, mobility, complications, or revision rates
- [x] **Tacrolimus-eluting nerve guidance conduit / Microsurgical Innovations** — P-B watchlist entry written; University of Utah biodegradable FK506 conduit work with 2024 rat-model paper and NIH/STTR Phase II commercialization signal, upgrade requires large-animal, manufacturing, regulatory, and human repair evidence
- [x] **Low-dose intraoperative 3D surgical imaging / nView s1** — P-B watchlist entry written; Salt Lake City FDA-cleared surgical imaging/navigation system with NSF SBIR trail and pediatric/adult surgical use, upgrade requires independent multicenter dose, accuracy, workflow, and outcome evidence
- [x] **Cell-impermeable dialysis-access endoprosthesis / WRAPSODY** — P-B watchlist entry written; FDA PMA-approved Merit Medical device for hemodialysis access stenosis/occlusion, upgrade requires peer-reviewed pivotal and registry evidence showing durable patency, fewer reinterventions, and broad dialysis-access adoption
- [x] **Inflammasome-targeted therapeutics** — P-B watchlist entry written; upgrade requires Phase 2 patient efficacy or larger disease-modifying trials with validated endpoints
- [x] **Heterodyned whole-body vibration neuromodulation / NeuroNova** — P-B watchlist entry written; upgrade requires completed Phase 2 evidence, independent replication, regulator-recognized indication-specific use, and durable real-world clinical outcomes
- [x] **In-vitro human spermatogenesis / Paterna Biosciences** — P-B watchlist entry written; upgrade requires peer-reviewed replication, genetic/epigenetic safety data, and regulator-approved clinical pregnancies with follow-up
- [x] **Multi-Antigen T-Cell Hybridizers / Thera-T Pharmaceutics** — P-B watchlist entry written; upgrade requires first-in-human data showing controllable toxicity and meaningful tumor responses versus fixed T-cell engagers
- [x] **Mirror-image D-peptide HIV entry inhibitors / CPT31** — P-B watchlist entry written; University of Utah / Navigen antiviral-design platform with peer-reviewed design, resistance, pharmacokinetic, nonhuman-primate, NIH/SBIR, and Phase 1 trial signals; upgrade requires published Phase 1 results, active later-stage development, and a clinical role beside existing HIV options
- [x] **Novel ribosomal antibiotics for drug-resistant bacteria / Curza** — P-B watchlist entry written; University of Utah-origin antibiotic-discovery work with NIH, CARB-X, and patent signals, upgrade requires IND opening, human safety/exposure data, and clinical infection efficacy
- [x] **AI voice-biomarker health screening / Canary Speech** — P-B watchlist entry written; upgrade requires prospective, independent validation that voice screening improves clinical decisions, monitoring, or outcomes across diverse real-world settings
- [x] **AI-assisted digital pathology workflows / Techcyte** — P-B watchlist entry written; upgrade requires regulator-authorized human diagnostic workflows with measured accuracy, turnaround, reproducibility, and labor gains
- [x] **Golden Broccoli glycine biosensor** — P-C watchlist entry written; University of Utah RNA imaging tool, upgrade requires independent adoption and discoveries enabled by live-cell glycine measurement
- [x] **Nonimaging ultrasound reflux detection / SondeFlux** — P-C watchlist entry written; RefloDx / University of Utah-origin pulse-echo ultrasound method with NSF Phase II and feasibility papers, upgrade requires prospective validation, FDA clearance, and evidence that noninvasive monitoring changes care
- [x] **Wearable wireless EEG seizure monitoring / Epitel REMI** — P-B watchlist entry written; FDA-cleared Salt Lake City reduced-channel EEG and AI event-detection platform with NIH, ClinicalTrials.gov, and peer-reviewed validation signals; upgrade requires independent multicenter evidence, real-world deployment, and outcome/workflow gains
- [x] **Mindfulness-Oriented Recovery Enhancement** — P-B watchlist entry written; University of Utah-developed behavioral treatment for chronic pain, opioid misuse, and addiction with NIH-funded randomized trials, ClinicalTrials.gov records, and mechanistic studies; upgrade requires independent multisite evidence, real-world implementation, and durable clinical utility
- [x] **EEG-guided propofol antidepressant treatment** — P-C watchlist entry written; University of Utah / Huntsman Mental Health Institute protocol for high-dose propofol anesthesia in treatment-resistant depression with pilot, ClinicalTrials.gov, dosing-model, and small randomized-trial signals, but controlled evidence remains underpowered and not statistically decisive
- [x] **Biodegradable vascular anastomosis coupler** — P-C watchlist entry written; University of Utah / Microsurgical Innovations small-vessel coupler with dissertation, patent, peer-reviewed preclinical, and NIH SBIR Phase II evidence, but no human clinical or FDA-cleared product signal surfaced
- [x] **Augmented-reality surgical navigation** — P-B watchlist entry written; Novarad OpenSight/VisAR with FDA 510(k)s, Utah applicant addresses, and early peer-reviewed spine-procedure evidence; upgrade requires independent multicenter evidence of accuracy, workflow, radiation, cost, complication, or revision benefits in routine surgical use
- [x] **Human glial progenitor cell therapy / Q-Cells** — P-C watchlist entry written; Q Therapeutics Salt Lake City cell-therapy platform with University of Utah-licensed IP, ClinicalTrials.gov Phase 1/2 ALS and transverse-myelitis signals, and peer-reviewed cell-tracking work, but no published human efficacy evidence surfaced
- [x] **Aqueous ionic liquid embolic device / Fluidx GPX** — P-B watchlist entry written; Salt Lake City embolic gel platform with peer-reviewed first-in-human data, University of Utah-linked material-characterization work, and CMS-approved IDE pivotal-trial signal; upgrade requires FDA clearance/approval, peer-reviewed pivotal results, and routine use with durable outcome or workflow advantages
- [x] **Sutureless tendon-repair implant / CoNextions TR** — P-B watchlist entry written; Salt Lake City FDA-cleared tendon-repair coupler with ClinicalTrials.gov and randomized-trial signals, but adoption and independent outcome evidence remain thin
- [x] **LifePolymer synthetic heart valves / Foldax TRIA** — P-A watchlist entry written; Salt Lake City-headquartered Foldax polymer-valve platform with ClinicalTrials.gov, peer-reviewed aortic/mitral signals, and 2025 India commercial approval/launch, but attribution is distributed across Caltech, CSIRO, non-Utah clinical sites, and Indian manufacturing
- [x] **Intermountain clinical quality improvement** — A tier entry written; healthcare delivery science and learning-health-system influence from Salt Lake City
- [x] **Conotoxins and Prialt** — A tier entry written; U of U cone-snail venom research produced ziconotide and major neuroscience probes
- [x] **Zinc-finger nuclease genome editing** — A tier entry written; Dana Carroll/U of U work helped establish targetable nucleases before CRISPR
- [x] **HIV capsid biology and the lenacapavir foundation** — A tier entry written; Wesley Sundquist's University of Utah structural virology helped establish the HIV capsid target behind Gilead's first-in-class capsid inhibitor and FDA-approved twice-yearly PrEP
- [x] **ADAR RNA editing and double-stranded RNA biology** — A tier entry written; Brenda Bass's University of Utah lab helped define ADAR specificity, natural substrates, Dicer/dsRNA biology, and self/non-self RNA recognition, with caveat that the initial ADAR-like activity discovery was pre-Utah
- [x] **BioFire FilmArray multiplex PCR diagnostics** — A tier entry written; Salt Lake City automated nested multiplex PCR platform helped make syndromic infectious-disease testing routine in hospital labs and biodefense settings
- [x] **Rapid-cycle real-time PCR and the LightCycler** — A tier entry written; Carl Wittwer's University of Utah / ARUP / Idaho Technology work helped define rapid real-time PCR, fluorescence melting analysis, the LightCycler instrument lineage, and high-resolution melting diagnostics
- [x] **Sorenson medical device cluster** — B tier entry written; Salt Lake City disposable mask, venous catheter, monitoring, and hospital-device company lineage with caveats around exact first-in-category claims
- [x] **Scientia Vascular neurovascular access platform** — B tier entry written; Salt Lake City guidewire/microcatheter platform with FDA-cleared products, roughly 310 employees, and Medtronic's 2026 $550M acquisition agreement
- [x] **Silicon nitride orthopedic biomaterials / Amedica-SINTX** — B tier entry written; Salt Lake City FDA-cleared ceramic implant-material platform with peer-reviewed material-science support and caveats around clinical superiority claims

**Physics & Materials**
- [x] **Cold fusion — Pons & Fleischmann (1989)** — D tier entry written
- [x] **Harvey Fletcher — stereophonic sound** — B tier entry written; honest about Bell Labs being the work location
- [x] **H. Tracy Hall diamond presses** — B tier entry written; careful distinction between GE first synthesis and BYU/Provo high-pressure apparatus follow-through
- [x] **HAMR low-carbon titanium powder** — P-A watchlist entry written; University of Utah / Zak Fang ARPA-E titanium metallurgy process with peer-reviewed validation, R&D 100 recognition, and pilot commercialization, upgrade requires sustained production plus independent quality, cost, energy, emissions, and qualification evidence
- [x] **Cell-level battery pack management** — P-B watchlist entry written from ARPA-E AMPED, OSTI impact-sheet, USU dissertation/lab, IEEE publication trail, and patent sources; upgrade requires deployed vehicle, grid-storage, defense, or second-life battery systems with independent pack-life, cost, safety, and usable-energy evidence
- [x] **Two-step chloride volatility fuel reprocessing** — P-C watchlist entry written from DOE/ARPA-E ONWARDS, DOE EM webinar, BYU PyRO lab, and National Academies context; upgrade requires one-kilogram batch results with U/TRU recovery, mass balance, gas recycle, waste-stream accounting, and safeguards review
- [x] **Coordination-driven supramolecular self-assembly / Peter Stang** — A tier entry written; National Medal-recognized University of Utah chemistry program
- [x] **OMVPE LED crystal growth / Gerald Stringfellow** — B tier entry written; original HP breakthrough plus University of Utah conceptual advances, textbook, and semiconductor-materials follow-through
- [x] **Henry Eyring / University of Utah theoretical chemistry school** — B tier entry written; focuses on Utah-era theoretical-chemistry institution-building and significant-structure liquid theory, with explicit caveat that transition-state / absolute-rate theory itself was developed before Eyring moved to Utah
- [x] **Telescope Array / ultra-high-energy cosmic rays** — B tier entry written; University of Utah-led West Desert observatory with the 2014 hotspot result and 2023 Amaterasu particle detection
- [x] **Fly's Eye and HiRes ultra-high-energy cosmic rays** — A tier entry written; University of Utah-led West Desert program that detected the 1991 Oh-My-God particle and later reported the first five-sigma observation of the GZK suppression

**Culture & Arts**
- [x] **Mormon Tabernacle Choir** — A tier entry written
- [x] **Bonneville Salt Flats / land speed records** — C tier entry written
- [x] **Spiral Jetty** — S tier entry written; canonical Great Salt Lake earthwork and one of the defining works of Land art
- [x] **Sun Tunnels** — B tier entry written; Nancy Holt's Utah desert solstice-aligned land-art installation
- [x] **Utah Shakespeare Festival** — B tier entry written; Tony-winning Cedar City/SUU regional theater institution
- [x] **Utah Symphony Abravanel Mahler cycle** — B tier entry written; first complete Mahler symphony cycle recorded by an American orchestra and a key Utah orchestra-building project

**Environment & Earth**
- [x] **Utah national parks establishment** — B tier entry written
- [x] **Henry Mountains laccolith geology** — A tier entry written; Gilbert's Utah fieldwork became a classic model for shallow igneous intrusions and host-rock deformation
- [x] **Great Salt Lake science** — B tier entry written; framed as a natural laboratory and distributed research program rather than a single invention
- [x] **Cleveland-Lloyd Dinosaur Quarry / Jurassic National Monument** — B tier entry written; world-class Allosaurus bonebed and paleontology site
- [x] **BYU water modeling systems / GMS, SMS, WMS** — B tier entry written; BYU/Aquaveo hydrology, hydraulics, and groundwater modeling software with global professional adoption
- [x] **Great Salt Lake dust health and control science** — P-B watchlist entry written; upgrade requires operational monitoring, policy adoption, or scaled mitigation
- [x] **Airborne imaging of freshwater beneath Great Salt Lake** — P-B watchlist entry written; upgrade requires full-lake validation and management relevance
- [x] **Drone cloud-seeding validation for Great Salt Lake watersheds** — P-B watchlist entry written; upgrade requires peer-reviewed validation, independent replication, multi-season measured gains, and honest Great Salt Lake water accounting
- [x] **Physics-based AI air quality forecasting / Trace AQ** — P-C watchlist entry written; upgrade requires independent forecast-skill benchmarks and adoption that measurably reduces smoke/dust/pollution exposure
- [x] **Networked soil carbon flux sensors / SOCNET** — P-C watchlist entry written from ARPA-E SMARTFARM records; upgrade requires field validation, multi-season sensor durability, uncertainty estimates, and adoption in carbon accounting or farm decisions
- [x] **Seafloor carbon assessment probes / SEASCAPE** — P-C watchlist entry written from ARPA-E SEA-CO2, University of Utah ECE, and peer-reviewed MEMS dissolved-CO2 sensor sources; upgrade requires seafloor validation, independent comparison with accepted carbon/pH methods, and use in real marine carbon-removal MRV workflows
- [x] **Bioinspired glycolipid dust mitigation / GlycoSurf** — P-C watchlist entry written; NIH/NIEHS Phase I/II environmental-health materials work with medium Utah attribution because University of Arizona is central; upgrade requires peer-reviewed field data, safety testing, and meaningful dust-exposure reduction
- [x] **Utah Water Research Laboratory** — B tier entry written; USU hydraulic modeling and water-engineering research infrastructure

**Aerospace & Propulsion**
- [x] **Small Satellite Conference (USU, 1987–present)** — A tier entry written; ecosystem-builder for the global smallsat community
- [x] **WISE infrared sky survey instrument** — A tier entry written; SDL-built cryogenic infrared payload enabled NASA's WISE all-sky survey, with careful attribution to the Utah-built instrument rather than the whole mission
- [x] **SABER / TIMED upper-atmosphere instrument** — A tier entry written; SDL-designed, fabricated, and calibrated infrared limb sounder produced a multi-decade mesosphere/lower-thermosphere dataset used in roughly 2,000+ peer-reviewed papers
- [x] **SOFIE / AIM polar mesospheric cloud instrument** — B tier entry written; SDL-built solar-occultation instrument helped NASA's AIM mission measure night-shining clouds, cloud chemistry, and upper-atmosphere conditions from 2007 to 2023
- [x] **MSX / SPIRIT III infrared survey instrumentation** — B tier entry written; dual-use missile-defense experiment whose Utah-built SPIRIT III radiometer/interferometer subsystems also contributed to a durable mid-infrared astronomy archive
- [x] **MOXIE solid oxide electrolysis stack / OxEon** — B tier entry written; North Salt Lake-built SOXE stack was the oxygen-producing electrochemical core inside MIT-led / JPL-managed MOXIE, the first in-situ resource utilization demonstration on another planet
- [x] **Atmospheric Waves Experiment / AWE** — P-B watchlist entry written; NASA ISS instrument built by SDL with USU-led science and 2025 public release of first 3,000 orbits of airglow/gravity-wave data
- [x] **NEO Surveyor infrared asteroid telescope** — P-B watchlist entry written; NASA planetary-defense telescope undergoing integration and testing at SDL in Logan, upgrade requires launch and survey impact
- [x] **Origami deployable space structures** — P-B watchlist entry written; upgrade requires flight hardware or broad adoption
- [x] **High-density sustainable aviation fuels** — P-B watchlist entry written; upgrade requires ASTM qualification, commercial airline use, and independently validated lifecycle/performance data

**Defense & Security**
- [x] **Dugway Proving Ground (1942–present)** — B tier entry written; technically important but morally fraught defense test infrastructure
- [x] **Hill AFB Minuteman ICBM sustainment** — B tier entry written; long-duration nuclear missile sustainment infrastructure with explicit moral caveats
- [x] **Utah Test and Training Range** — B tier entry written; West Desert weapons test/training airspace infrastructure with environmental caveats
- [x] **NSA Utah Data Center** — B tier entry written; major intelligence data infrastructure with privacy/civil-liberties caveats
- [x] **Autonomous low-collateral counter-UAS interception** — P-B watchlist entry written; upgrade requires independent operational validation and sustained deployment
- [x] **Edge AI swarming autonomy** — P-B watchlist entry written; upgrade requires independent operational proof, cross-platform performance, and sustained procurement
- [x] **Fiber-optic attritable FPV drone manufacturing** — P-B watchlist entry written; upgrade requires sustained procurement plus independent field performance under jamming, GPS denial, and realistic attrition
- [x] **Compact holographic drone-swarm radar / Spotter Global** — P-B watchlist entry written; upgrade requires independent tests against fast FPV drones, coordinated swarms, clutter, weather, and fielded counter-UAS integrations
- [x] **Army Short-Range Reconnaissance UAS / Teal Black Widow** — P-B watchlist entry written from Army production reporting, Red Cat/DIU/Army SRR chronology, and Teal manufacturing sources; upgrade requires sustained procurement plus operational evidence of reliable small-unit ISR under realistic contested conditions

---

### Phase 2 — Source Sweeps (systematic coverage)

Each source is a list or database that surfaces entries not caught by domain intuition.

**Awards & recognition databases** — filter by Utah institution affiliation
- [x] **Nobel Prize database** — official Nobel affiliation list shows University of Utah only for Mario Capecchi's 2007 Physiology or Medicine prize; no BYU/USU-affiliated Nobel prize surfaced
- [x] **Breakthrough Prize database** — surfaced Christopher Hacon's 2018 Mathematics prize; entry written under the new Mathematics & Theoretical Science domain
- [~] **National Medal of Science / National Medal of Technology and Innovation** — initial sweep found Stang as Utah-done work and several Utah alumni/offsite-work cases; Henry Eyring is a notable Utah-affiliated National Medal case, but absolute-rate / transition-state theory was mainly pre-Utah, so assess a narrower Utah theoretical-chemistry-school entry before adding
- [~] **National Inventors Hall of Fame** — first pass found John Moses Browning; entry written; still search for less obvious Utah-era work beyond Utah-born/offsite inventors
- [~] **IEEE Milestones** — first pass found Utah computer graphics milestone only, already covered; still check full dedicated-milestones list for hidden Utah ties
- [x] **ASME Historic Mechanical Engineering Landmarks** — Utah designations checked; Browning Firearms Collection and EIMCO Rocker Shovel Loader entries written
- [~] **National Historic Landmarks / Natural Landmarks / geoheritage** — NPS/NHL pass mostly surfaced already-covered historic sites; adjacent natural-landmark and geoheritage sweep produced Henry Mountains laccolith geology as an A-tier entry

**Institution sweeps** — walk the notable output of each major Utah research institution
- [~] **University of Utah** — notable alumni pages, research highlights, centennial publications, college-by-college notable contributions (focus on: College of Engineering, School of Medicine, College of Science, College of Fine Arts); SCI Institute sweep produced a new A-tier computing entry
- [x] **University of Utah / LDS Hospital medical informatics** — HELP clinical decision support system added as an A-tier medicine-and-biology entry; distinct from the existing Intermountain clinical quality-improvement entry because HELP is the operational hospital information and real-time decision-support system itself
- [~] **BYU** — research contributions; BYU has strong physics and engineering programs; check for landmark publications or spinouts; first pass produced BYU water modeling systems as a B-tier environment/software infrastructure entry
- [~] **Utah State University** — deeper passes added powered roadway electrification / ASPIRE, synthetic spider silk biomanufacturing, AggieAir scientific UAV remote sensing, dwarf crops for spaceflight, Utah Water Research Laboratory, and the Shingo Institute operational-excellence standard; still sweep agriculture, remote sensing, and SDL mission-specific work for less obvious mission- or method-level entries
- [~] **Dixie State / SUU / UVU** — lower probability but worth a quick pass; SUU/Cedar City pass produced Utah Shakespeare Festival as a B-tier culture entry, still check UVU and former Dixie State / Utah Tech for distinctive institution-level work

**Archive sweeps** — primary historical sources
- [ ] **Utah State Historical Society** — publications and collections; good for pre-1950 industrial and infrastructure history
- [ ] **Deseret News / Salt Lake Tribune archives** — search "first in the world", "pioneered", "invented" with Utah datelines; filter to pre-1990 for historical entries
- [ ] **IEEE/ACM oral history archives** — multiple Utah computing alumni have recorded histories; scan for mentions of other Utah-era work
- [ ] **Smithsonian Lemelson Center** — inventor oral histories; check for Utah affiliations

---

### Phase 3 — Era Sweeps (catches cross-domain gaps)

Walk through Utah history chronologically and ask: "what was the most significant work happening in Utah in this period?"

- [~] **Pioneer/settlement era (1847–1890)** — cooperative irrigation, transcontinental railroad, and ZCMI cooperative retail network covered; still assess territorial governance, cooperative economy, and settlement planning
- [~] **Industrial era (1890–1945)** — Bingham Canyon scale-up, Lehi/Utah-Idaho beet sugar, Geneva Steel, Thiokol origins, WWII defense mobilization; what was built here that supplied the war or nation?
- [ ] **Cold War era (1945–1970)** — Dugway Proving Ground, Hill AFB ICBM sustainment, and UTTR covered; still assess early aerospace and other federal investments that created lasting capability
- [ ] **Computing/biomedical era (1970–2000)** — the U of U graphics program, Jarvik-7, WordPerfect/Novell, Myriad Genetics; this era is already well-represented; fill gaps
- [ ] **Modern era (2000–present)** — Silicon Slopes, Recursion, autonomous mining, EGS; ongoing sweep

---

### Phase 4 — Speculative Signal Mining

Recent great work usually appears first in low-key technical places, not prestige retrospectives. Use this phase to find early-stage work that may have Utah origins or Utah execution. The goal is to capture specific work: the instrument built, method demonstrated, dataset released, field test run, trial started, standard shaped, or manufacturing process proven.

**Second-pass direction update:** the strongest new signals are clustering around (1) Utah as a physical-world operating-system testbed - autonomous mines, energy/data campuses, building controls, and airspace defense; (2) frontier bio/medicine where Utah has both labs and translation infrastructure - gametes, immunotherapy, isotope supply, photoneuromodulation, and AI pathology; and (3) energy-dense aerospace/defense fuels and geothermal variants where the next proof is operating data, not another launch article. Treat "world's first" claims as a lead generator, then immediately look for permits, trials, contracts, peer-reviewed papers, regulator status, or named customers.

**Future research directions from the second pass:**

- [x] **Utah land-art corridor and contemporary outdoor art** — Powder Mountain open-air art museum P-B watchlist entry written; still track whether Dia/Holt/Smithson ties, public access, stewardship, and critical reception mature into more than resort-linked cultural infrastructure
- [ ] **Physical-world operating systems** — follow MarianaOS, PassiveLogic, Creekstone/BluSky-style energy campuses, Spotter/Fortem airspace systems, and autonomous industrial control. Look for uptime, safety, throughput, cost, and adoption data rather than demos.
- [ ] **Measured weather modification and watershed augmentation** — Utah is becoming a live proving ground for drone seeding, remote ground generators, radar/satellite validation, and SNOWSCAPE-style field campaigns. Treat company claims as leads; look for peer-reviewed event validation, raw-data access, acre-foot accounting, airspace/safety constraints, and Great Salt Lake materiality.
- [x] **Powered roadway electrification / ASPIRE** — P-B watchlist entry written; upgrade requires multi-year fleet deployments with public uptime, efficiency, maintenance, safety, and cost data
- [x] **USU dwarf crops for spaceflight** — B-tier entry written; first crop bred specifically for spaceflight plus controlled-environment wheat productivity work
- [x] **AggieAir scientific UAV remote sensing** — B-tier entry written; early USU water/agriculture remote-sensing UAV platform with scientific data workflows and publication trail
- [ ] **Frontier fertility and reproductive biology** — track Paterna's in-vitro spermatogenesis claim for peer-reviewed data, independent replication, genetic/epigenetic safety, clinical trial records, and regulatory constraints.
- [x] **Native long-read epigenomic sequencing** — P-C watchlist entry written for Wasatch BioLabs' dTMS/dWMS and Oxford Nanopore service infrastructure; upgrade requires external validation, clinical/research adoption, or diagnostic deployment showing native-read methylation changes what can be discovered or measured
- [ ] **Programmable immunotherapy** — watch MATCH / Thera-T for IND-enabling work, manufacturing strategy, first-in-human trials, cytokine-release data, and evidence that modular antigen matching beats fixed bispecifics.
- [x] **Mirror-image peptide therapeutics** — CPT31 / University of Utah / Navigen P-B watchlist entry written; continue watching for published Phase 1 data, licensing, later-stage trials, or a second D-peptide candidate reaching human testing.
- [x] **AI voice biomarkers for clinical screening** — Canary Speech P-B watchlist entry written after peer-reviewed MCI signal, Parkinson's research, Microsoft Healthcare AI designation, and Intermountain MS study; upgrade requires prospective clinical utility, independent validation, and privacy-safe deployment.
- [ ] **AI pathology and diagnostic workflow infrastructure** — follow Techcyte, ARUP, Mayo Clinic Platform, BD, and related Utah lab-medicine work. Prioritize FDA/CE status, real-world lab metrics, and peer-reviewed diagnostic performance.
- [x] **Wearable wireless EEG seizure monitoring** — Epitel REMI P-B watchlist entry written from NIH SBIR, ClinicalTrials.gov, FDA 510(k), and peer-reviewed validation sources; upgrade requires independent multicenter evidence and broad real-world clinical utility.
- [~] **Noninvasive therapeutic and diagnostic devices** — MUSE breast ablation, heterodyned whole-body vibration neuromodulation, and RefloDx nonimaging reflux detection are now on the watchlist; continue verifying PhotoPharmics light-therapy work, focused-ultrasound variants, and noninvasive diagnostic-device signals through trial registries, NIH/NSF RePORTER-style grant records, FDA breakthrough/510(k)/De Novo records, and peer-reviewed data.
- [x] **EEG-guided propofol antidepressant treatment** — P-C watchlist entry written from University of Utah ClinicalTrials.gov, pilot-study, medRxiv randomized-trial, and dosing-model sources; upgrade requires peer-reviewed larger controlled trials with durable benefit, safety, pharmacodynamic target validation, and independent replication
- [x] **Extended-release non-opioid postoperative analgesia** — P-B watchlist entry written for Rebel Medicine's Alevatrix bupivacaine depot work; upgrade requires human trial data showing safe opioid-sparing pain control, followed by approval and real-world adoption
- [x] **Refillable local antibiotic delivery / Purgo Pouch** — P-B watchlist entry written; University of Utah-origin refillable local therapy device for open fracture-related infections, with FDA Breakthrough Device designation, DoD funding, and preclinical sheep/veterinary signals; upgrade requires human infection, repeat-surgery, union, safety, and adoption data
- [x] **Biodegradable vascular anastomosis coupler** — P-C watchlist entry written from University of Utah dissertation, patents, NIH SBIR, and peer-reviewed preclinical sources; upgrade requires regulator-visible product progress, large-animal durability, human feasibility, and comparison with hand suturing or existing couplers
- [x] **Augmented-reality surgical navigation** — P-B watchlist entry written from FDA OpenSight/VisAR records, Novarad's Utah product trail, and peer-reviewed image-guided spine-procedure literature; upgrade requires independent multicenter outcome and workflow evidence
- [x] **Human glial progenitor cell therapy** — P-C watchlist entry written from Q Therapeutics, ClinicalTrials.gov, patent/IP, and peer-reviewed cell-tracking sources; upgrade requires posted or published human safety, target-engagement, and efficacy evidence plus credible manufacturing data
- [x] **Mindfulness-Oriented Recovery Enhancement** — P-B watchlist entry written from ClinicalTrials.gov, NIH/NCCIH/HEAL, University of Utah, and peer-reviewed RCT/mechanism sources; upgrade requires independent multisite trials and routine-practice evidence showing durable pain, opioid-misuse, relapse, or utilization benefits
- [~] **Domestic isotope, HALEU, and nuclear-fuel supply chains** — keep Nusano, San Rafael Energy Lab, University of Utah fuel-cycle work, and BYU chloride-volatility work under close watch. Safeguarded pyrochemical used-fuel recycling and two-step chloride volatility fuel reprocessing P-C entries written; still look for licensed production, delivered isotope/fuel lots, hot-cell/process validation, material-accountancy evidence, customer use, and independent safety review.
- [x] **Synthetic spider silk biomanufacturing** — P-B watchlist entry written; upgrade requires commercial production with customer use and independent performance/cost validation
- [x] **Hydrogen-reduction melt-less steelmaking** — P-B watchlist entry written from DOE/ARPA-E ROSIE and University of Utah powder-metallurgy signals; upgrade requires qualified pilot-line steel products plus independent emissions, energy, cost, and performance validation
- [x] **HAMR low-carbon titanium powder** — P-A watchlist entry written from ARPA-E/OSTI, University of Utah, peer-reviewed, R&D 100, and IperionX commercialization sources; upgrade requires sustained production plus independent quality, cost, energy, emissions, and customer qualification evidence
- [x] **Cell-level battery pack management** — P-B watchlist entry written from ARPA-E AMPED / OSTI, Utah State dissertation and lab pages, IEEE publication trail, patents, and follow-on ONR microgrid work; upgrade requires deployed vehicle, grid-storage, defense, or second-life battery systems with independent pack-life, cost, safety, and usable-energy evidence
- [x] **ML-guided niobium alloys for high-temperature turbines** — P-C watchlist entry written from ARPA-E ULTIMATE, OSTI, and peer-reviewed materials-informatics sources; upgrade requires experimental alloy validation, coating/oxidation proof, and representative turbine-component or qualification evidence
- [x] **Synthetic organic electrochemistry center / CSOE** — P-B watchlist entry written from NSF Center for Chemical Innovation records, University of Utah Phase II reporting, current CSOE publication sources, and peer-reviewed electrosynthesis papers; upgrade requires broad lab or industrial adoption of CSOE methods, cells, standards, or reactions with measured safety, waste, cost, or scale advantages
- [~] **Energy-dense aerospace and defense fuels** — CycloKinetics folded into the high-density sustainable aviation fuels entry as the defense/space extension of the CleanJoule advanced-fuels family; still look for military fuel qualification, ASTM progress, engine/rocket test data, DoD contracts, and production volumes.
- [ ] **Geothermal variants beyond Fervo** — follow Rodatherm, Zanskar, Utah FORGE, and any SUPERHOT / ARPA-E Utah awardees. The proof points are drilled wells, flow/heat-transfer data, power generation, seismicity, water use, and project finance.
- [ ] **Air-quality and Great Salt Lake exposure infrastructure** — connect Trace AQ, Great Salt Lake dust science, airborne freshwater imaging, and public-health monitoring. Look for independent forecast skill, operational adoption, and exposure reduction.
- [x] **Agricultural carbon measurement instrumentation** — SOCNET P-C watchlist entry written from ARPA-E SMARTFARM records; continue looking for field deployments, validation datasets, and whether Utah-built sensors enter carbon-intensity or carbon-credit workflows.
- [x] **Marine carbon measurement instrumentation** — SEASCAPE P-C watchlist entry written from ARPA-E SEA-CO2 and University of Utah sensor sources; continue watching for seafloor deployment data, MRV workflows, and independent ocean-carbon validation.
- [~] **Defense procurement reality checks** — for drone, radar, swarming, and counter-UAS claims, search SAM.gov, USAspending, Army/AFWERX/DIU releases, field evaluations, and allied procurement announcements to distinguish sales language from deployment. Army SRR / Teal Black Widow produced a P-B watchlist entry; continue with Fortem, Palladyne, Spotter, Vector, Anduril-adjacent Utah sites, and Hill/UTTR procurement traces.

Look for early signals in:

- low-view conference talks and workshop videos
- preprints and obscure proceedings
- SBIR/STTR awards and federal grant databases
- university lab pages, tech-transfer disclosures, dissertations, and faculty CVs
- patents with Utah inventors, assignees, or lab addresses
- clinical trials, FDA device records, and IRB-adjacent research signals
- procurement awards, DoD demos, AFWERX/SpaceWERX/DIU programs
- job postings for strange technical roles
- benchmark leaderboards, datasets, GitHub repos, model cards, release notes
- local demo days, student competitions, capstone pages, and thesis repositories
- tech-magazine exclusives and sensational trade coverage, treated as weak signal until matched against papers, permits, awards, clinical records, product data, or named deployments

**Capture first, judge later:** preserve raw thoughts with minimal friction, but do not let the scratchpad become a graveyard for real Utah work. Use `_messy_thoughts.md` for tangents, cool non-Utah companies, ideas for new work, unknown Utah ties, and leads that are still too blurry to write. If a lead has a plausible Utah tie and enough substance to describe the work, create a speculative wiki entry instead of leaving it only in messy thoughts.

**Utah attribution checks:** for each lead, look for at least one of:

- work performed at a Utah lab, field site, factory, range, hospital, mine, lake, or campus
- key inventor/researcher had Utah institutional affiliation during the work
- grant, patent, trial, or procurement lists a Utah address
- dataset, prototype, pilot, or instrument was produced in Utah
- company is elsewhere, but the specific field test or deployment happened in Utah

**Signal scoring:** mark each raw lead with:

- `Signal:` paper / grant / patent / demo / field deployment / clinical trial / customer / standard / dataset / open source
- `Utah tie:` strong / medium / weak / unknown
- `Work focus:` the actual thing built, discovered, deployed, or tested
- `Possible tier:` P-A / P-B / P-C / F
- `Upgrade evidence:` what would make it a real wiki entry

**Wiki-first rule for early work:** create a speculative domain page when there is enough to write:

- what the work is
- why it might matter
- signals so far
- what would upgrade it
- caveats
- links/sources

Use `_messy_thoughts.md` for material that does not yet meet that bar: unclear Utah tie, no named work, no source trail, purely personal idea, non-Utah tangent, or an interesting company/technology outside the wiki's current scope.

Creative search tactics:

- **Reverse-affiliation search:** start from frontier terms, then add Utah institutions:
  - `"tomographic additive manufacturing" "University of Utah"`
  - `"volumetric printing" BYU`
  - `"high temperature electronics" "Utah State University"`
  - `"microfluidic organoid" "Salt Lake City"`
- **Patent-first search:** search Google Patents/Lens for frontier terms plus Utah cities: Salt Lake City, Provo, Logan, Ogden, Lehi, Lindon, Draper, West Valley City.
- **Video archaeology:** search YouTube/Vimeo conference channels with terms like `workshop`, `poster`, `student competition`, `demo day`, `invited talk`, then check speaker affiliations.
- **Grant drift:** search SBIR/NSF/NIH/ARPA-E by Utah, then follow the technical terms from abstracts into papers, patents, and job postings.
- **Job-posting inference:** look for rare phrases in Utah job posts: `tomographic reconstruction`, `photopolymer kinetics`, `downhole electronics`, `radiochemistry automation`, `counter-UAS autonomy`, `hyperspectral payload`, `organoid screening`.
- **People trails:** find a Utah professor, grad student, or founder, then inspect CVs, dissertations, lab alumni, startup pages, and patents.
- **Field-site trails:** search by Utah places that host weird work: Great Salt Lake, Milford/FORGE, Dugway, UTTR, Hill AFB, Bingham Canyon, West Desert, Logan/SmallSat, Huntsman, Moran Eye Center.

---

### After the May 2026 speculative sweep

The easy surface layer is not exhausted, but it is no longer the best mine. Tech magazines, local business press, and startup-funding articles still produce leads, but the hit rate drops quickly after the obvious Utah deep-tech names. They are best used as **radar**, not as the main source of truth: good for noticing strange phrases like `living neural tissue`, `HALEU`, `fiber optic FPV`, or `AI data-center gigasite`, then pivoting to primary sources.

The next rich vein is likely **institutional and regulatory records**:

- **Clinical and FDA trails:** ClinicalTrials.gov, FDA designations, trial publications, and company CMC/manufacturing notes. DiscGenics surfaced because it had Phase 3, RMAT/Fast Track, and a Salt Lake cGMP facility. Similar searches may uncover serious Utah work hiding behind ordinary biotech names.
- **Federal awards and procurement:** SBIR/STTR, NIH RePORTER, NSF awards, ARPA-E, DOE, AFWERX, SpaceWERX, DIU, SAM.gov, and DoD contract announcements. Defense and energy stories become much more real when there is a named award, test event, or customer.
- **Patents and technical papers:** Google Patents, Lens, OSTI, IEEE, PubMed, arXiv, and university repositories. These are better than press coverage for Utah-specific attribution because inventor addresses, affiliations, grants, and enabling methods show up there.
- **University lab-to-company trails:** U of U, BYU, USU, Moran Eye Center, Huntsman, SCI, ARUP, Altitude Lab, Recursion-adjacent alumni, and Space Dynamics Lab. Start from faculty CVs, dissertations, tech-transfer pages, and lab alumni rather than from company rankings.
- **Field-site trails:** Milford/FORGE, San Rafael Energy Lab, Great Salt Lake, Dugway, UTTR, Hill AFB, Bingham Canyon, Logan/SmallSat, and West Desert test corridors. Some of Utah's best "great work" is not headquartered here; it happens because Utah is the test site.

Judgment call: **there is definitely more to search, but the press-driven pass is close to saturation for now.** Another hour of TechBuzz/Utah Business/TechCrunch-style searching will mostly yield incremental startup entries, SaaS noise, or claims too thin for wiki pages. The next pass should be source-first and artifact-first: grants, trials, patents, papers, contracts, demos, and facilities. Search for the thing built or validated, then decide whether the company deserves mention.

Best next sweeps:

- **NIH/ClinicalTrials sweep:** Utah + Phase 2/3 + RMAT/Fast Track/breakthrough device + cGMP/manufacturing
- **DOE/ARPA-E/OSTI sweep:** Utah + geothermal, nuclear, HALEU, molten salt, grid storage, hydrogen, critical minerals
- **DoD/procurement sweep:** Utah + counter-UAS, sUAS, autonomy, ISR, EW, missile sustainment, hypersonics, space domain awareness
- **Patent sweep:** Utah cities + `molten salt`, `radioisotope`, `microfluidic`, `neural tissue`, `photoneuromodulation`, `geothermal`, `fiber optic drone`, `solid state transformer`
- **University repository sweep:** U of U/BYU/USU dissertations and tech-transfer disclosures for obscure methods that have not become companies yet

---

### Domain coverage status

| Domain | Entries | Known leads remaining |
|---|---|---|
| Computing & software | 9 + 2 speculative | U of U/BYU AI/robotics/security papers; biohybrid computing needs independent validation |
| Medicine & biology | 8 + 15 speculative | NIH/ClinicalTrials/FDA sweep; Purgo Pouch and extended-release non-opioid analgesia now have watchlist pages, but still need human data |
| Aerospace & propulsion | 7 + 2 speculative | USU/SDL payloads beyond WISE/SABER/SOFIE/MSX/AWE/NEO Surveyor, SmallSat spillovers, deployables, Utah flight/test infrastructure |
| Physics & materials | 4 + 2 speculative | BYU/U of U physics sweep; hydrogen-reduction steelmaking needs pilot and qualification evidence |
| Environment & earth | 7 + 3 speculative | Great Basin water science; Colorado Plateau paleontology sweep |
| Culture & arts | 4 | Architecture, publishing, film production sweep |
| Industry & infrastructure | 6 + 9 speculative | DOE/ARPA-E/OSTI, nuclear fuel/reactor paths, AI power campuses, critical minerals |
| Defense & security | 4 + 4 speculative | DoD awards, AFWERX/SpaceWERX/DIU, field demos, procurement durability |

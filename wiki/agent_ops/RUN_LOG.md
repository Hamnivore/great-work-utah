# Great Work Utah Wiki Agent Run Log

## Run: 2026-06-18 MDT — Parallel wiki expansion (coordinator merge)

### Seed Worklist Item

- item: 1. Legacy Research Wikis; 9. GOEO Test Personas; 11. Business-Service Provider Categories
- starting status: first_pass / ready
- ending status: first_pass

### Goal

Continue expanding the public wiki via parallel subagents, then merge coordination files, cross-link guides, and retire duplicate pages.

### Files Created (by subagents; partial list)

- 20+ venture pages: BioFire, Halia, Huntsman Cancer Institute, IMSAR, Strider, PassiveLogic, Torus, Wavetronix, Teal, Palladyne AI, Energy Fuels / White Mesa, Weave, Varda, Nusano, Utah Quantum, Utah NeuroRobotics Lab, and others
- 11 work pages: WordPerfect and Novell, Omniture Web Analytics, Soundstream and Commercial Digital Audio Recording, Conotoxins and Prialt, Intermountain Clinical Quality Improvement, H. Tracy Hall diamond presses, Harvey Fletcher stereophonic sound, Iomega Zip Drive, Philo Farnsworth television, Pons-Fleischmann cold fusion, and Utah Array BCI Platform
- 12 helper pages: BBCetc, Maschoff Brennan, NOW CFO, RQM+, Tanner, Wilson Sonsini Salt Lake City, Eide Bailly, Kirton McConkie, Parsons Behle & Latimer, Preferred CFO, Tanner LLC, and Workman Nydegger
- 10 answer pages: GOEO persona answers, thematic founder-navigation answers, and why-this-is-better-than-linkedin
- 68 new source records for ventures, work, helpers, and resource-verification passes

### Files Updated (coordinator)

- `wiki/agent_ops/index.md` — refreshed coverage snapshot and inventory
- `wiki/guides/find-meaningful-work.md` — Emerging Bets and second-pass Hidden Gems
- `wiki/guides/utah-deep-tech-map.md` — software history, defense, energy, medical delivery anchors
- `wiki/guides/find-business-services.md` — professional-services helper routing
- `docs/wiki-seed-worklist.md` — progress notes on items 1, 9, 11

### Files Deleted

- `wiki/work/wordperfect-novell.md` (duplicate of wordperfect-and-novell)
- `wiki/work/conotoxins-prialt.md` (duplicate of conotoxins-and-prialt)
- `wiki/work/soundstream-digital-recording.md` (duplicate merged into soundstream-digital-audio-recording)

### Key Findings

- Eight parallel agent batches produced substantial overlap (Worker E and defense/MI batches both touched IMSAR, Strider, PassiveLogic, Torus). Coordinator deduplicated at index level; no venture file collisions observed.
- Fourteen malformed `ventures/*-md` files (no `.md` extension, old schema) remain and should be converted or removed in a dedicated pass.
- Gap-fill agents launched for remaining ventures (Weave, Varda, Hypercraft, etc.), physics/medicine work pages, advisor/cofounder guides, and named GOEO persona answers.

### Next Best Tasks

- Convert or retire `ventures/*-md` malformed stubs (Qualtrics, Domo, Novell, etc.)
- Add license-clean hero images for new venture pages
- Decide whether overlapping source records such as `utah-neurorobotics-lab-official-site.md` / `utah-neurorobotics-lab-official-website.md` should be compacted.

### Index Update

- coverage snapshot refreshed: yes (ventures 14→36, work 15→26, helpers 1→13, answers 0→10, sources 29→97, guides 5→7)
- entries added: see index.md Ventures, Helpers, Work, Answers sections

## Run: 2026-05-16 MDT - Work layer continuation pass

### Seed Worklist Item

- item: 1. Legacy Research Wikis
- starting status: first_pass
- ending status: first_pass

### Goal

Continue the public `wiki/work/` migration from the legacy `great_work` corpus and broaden the Utah deep-tech map beyond the first historical anchors.

### Files Read

- `docs/wiki-seed-worklist.md`
- `wiki/agent_ops/schema.md`
- `wiki/agent_ops/index.md`
- `wiki/work/utah-computer-graphics-program.md`
- `wiki/guides/utah-deep-tech-map.md`
- `legacy_wiki/great_work/README.md`
- `legacy_wiki/great_work/industry-and-infrastructure/utah-forge.md`
- `legacy_wiki/great_work/defense-and-security/⭐browning-firearms-designs.md`
- `legacy_wiki/great_work/physics-and-materials/flys-eye-and-hires-cosmic-rays.md`
- `legacy_wiki/great_work/medicine-and-biology/utah-population-database.md`
- `legacy_wiki/great_work/medicine-and-biology/help-clinical-decision-support-system.md`
- `legacy_wiki/great_work/computing-and-software/⭐arpanet-fourth-node.md`
- `legacy_wiki/great_work/computing-and-software/evans-and-sutherland.md`
- `legacy_wiki/great_work/medicine-and-biology/myriad-genetics-brca.md`
- `legacy_wiki/great_work/defense-and-security/utah-test-and-training-range.md`
- `legacy_wiki/great_work/defense-and-security/dugway-proving-ground.md`

### Files Created

- `wiki/agent_ops/locks/2026-05-16-work-layer-second-pass.md`
- `wiki/work/utah-forge.md`
- `wiki/work/browning-firearms-designs.md`
- `wiki/work/flys-eye-hires-cosmic-rays.md`
- `wiki/work/utah-population-database.md`
- `wiki/work/help-clinical-decision-support-system.md`
- `wiki/work/arpanet-fourth-node.md`
- `wiki/work/evans-and-sutherland.md`
- `wiki/work/myriad-genetics-brca.md`
- `wiki/work/utah-test-and-training-range.md`
- `wiki/work/dugway-proving-ground.md`

### Files Updated

- `docs/wiki-seed-worklist.md`
- `wiki/agent_ops/index.md`
- `wiki/agent_ops/RUN_LOG.md`
- `wiki/agent_ops/locks/2026-05-16-work-layer-second-pass.md`
- `wiki/guides/utah-deep-tech-map.md`

### Key Findings

- The best next `work/` slice was not more of the same; it broadened the map into geothermal field infrastructure, defense/mechanical design, astroparticle physics, population-scale medical data, clinical informatics, early internet history, graphics commercialization, clinical genomics, and defense test infrastructure.
- The filesystem no longer contains the synthetic `people/`, `matches/`, old demo guide, or two demo source pages that the ops index still listed. The inventory was refreshed to match the current tree, without restoring or deleting those pages.
- `work/` now has fifteen public entries, enough to make the deep-tech map feel like a real navigation layer rather than a one-off historical appendix.

### Decisions Made

- Kept the new work pages at `Status: Draft` and `Confidence: Medium` because they still need source-record pages and, in some cases, stronger primary-source citation.
- Did not add hero imagery in this pass; imagery remains a separate rights-clearance task.
- Added a clear caveat to Browning's page and guide mention because the impact is inseparable from weapons and organized violence.

### Validation

- Checked the new pages for required `Status`, `Confidence`, and `Updated` header lines.
- Checked local wiki markdown links in the touched guide and work pages.
- `npm run build:wiki` succeeded after sandbox escalation for `tsx` IPC permissions: 469 entries built into `src/data/generated/all.json`, with editorial overlays applied to 30 entries from `wiki/`.
- `npm run build` succeeded after sandbox escalation. Vite emitted only the existing large-chunk warning.

### Problems / Uncertainty

- Several unrelated local changes and deletions were already present in the worktree. This run worked with the resulting wiki tree and did not revert them.
- Source-record pages for the new work entries are still missing.

### Next Best Tasks

- Migrate Utah labor-history context for Golden Spike, WordPerfect / Novell, Soundstream, Intermountain clinical quality improvement, and Conotoxins / Prialt.
- Add source records for DOE FORGE, ASME Browning, U of U Oh-My-God particle, UPDB official page, the core HELP papers, Node 4 history, Evans & Sutherland records, the Myriad Supreme Court case, Hill AFB UTTR, and Dugway exposure documentation.
- Add license-clean hero images for the fifteen `work/` entries.

## Run: 2026-05-16 MDT - Historical work anchors migration

### Seed Worklist Item

- item: 1. Legacy Research Wikis
- starting status: first_pass
- ending status: first_pass

### Goal

Add the first public `wiki/work/` entries from the legacy `great_work` corpus and create a guide that connects those historical anchors to the current venture map.

### Files Read

- `docs/wiki-seed-worklist.md`
- `wiki/agent_ops/PLAYBOOK.md`
- `wiki/agent_ops/schema.md`
- `wiki/agent_ops/index.md`
- `legacy_wiki/great_work/README.md`
- `legacy_wiki/great_work/computing-and-software/⭐utah-computer-graphics-program.md`
- `legacy_wiki/great_work/medicine-and-biology/⭐capecchi-gene-targeting.md`
- `legacy_wiki/great_work/aerospace-and-propulsion/⭐thiokol-solid-rocket-motors.md`
- `legacy_wiki/great_work/industry-and-infrastructure/⭐golden-spike-transcontinental-railroad.md`
- `legacy_wiki/great_work/culture-and-arts/⭐spiral-jetty.md`

### Files Created

- `wiki/agent_ops/locks/2026-05-16-historical-work-anchors.md`
- `wiki/work/utah-computer-graphics-program.md`
- `wiki/work/capecchi-gene-targeting.md`
- `wiki/work/thiokol-solid-rocket-motors.md`
- `wiki/work/golden-spike-transcontinental-railroad.md`
- `wiki/work/spiral-jetty.md`
- `wiki/guides/utah-deep-tech-map.md`

### Files Updated

- `docs/wiki-seed-worklist.md`
- `wiki/agent_ops/index.md`
- `wiki/agent_ops/RUN_LOG.md`
- `wiki/agent_ops/locks/2026-05-16-historical-work-anchors.md`

### Key Findings

- `wiki/work/` was empty before this pass, even though the legacy `great_work` corpus has strong S-tier historical anchors.
- The first useful public slice is cross-domain rather than exhaustive: computing, biomedical research, aerospace manufacturing, rail infrastructure, and Land art.
- The new deep-tech map is more useful when it pairs historical anchors with current venture pages instead of treating history as a separate museum shelf.

### Decisions Made

- Kept source links directly in each first-pass work page rather than creating a source-record page for every historical link in this run.
- Avoided public references to legacy provenance; provenance is recorded here and in the worklist.
- Left all pages as `Status: Draft` and `Confidence: Medium` because they need a source-record pass and imagery pass before becoming strong public references.

### Validation

- `npm run build:wiki` succeeded after sandbox escalation for `tsx` IPC permissions: 469 entries built into `src/data/generated/all.json`.
- `npm run build` succeeded after sandbox escalation. Vite emitted only the existing large-chunk warning.

### Problems / Uncertainty

- Several unrelated local changes and deletions were present after validation; they were not reverted or coordinated in this run.
- The new work pages still need dedicated source records for the strongest evidence and license-clean hero images.
- Some claims, especially around Utah computer-graphics alumni lineage and Thiokol program lineage, should receive a tighter primary-source pass before promotion.

### Next Best Tasks

- Add source records for Nobel Prize 2007, University of Utah computing history, NPS Golden Spike, Dia/UMFA Spiral Jetty, NASA Shuttle boosters, and Rogers Commission material.
- Continue `work/` migration with Utah FORGE, Browning firearms designs, Fly's Eye / HiRes, Utah Population Database, HELP clinical decision support, and Golden Spike labor-history context.
- Link the deep-tech map into the UI or search affordances if it becomes a demo navigation surface.


---

## Earlier Runs (Archived)

Runs from 2026-05-09 (the initial build runs) have been archived to keep this file under the hard cap.
See [RUN_LOG-archive-2026-05-09.md](RUN_LOG-archive-2026-05-09.md) for the full 2026-05-09 run history.

---

## Run: 2026-06-18 MDT - Wiki skill v0.2.0 docs migration slice

### Goal

Adopt the v0.2.0 migration addendum's M1 size caps and M4/M5 relationship conventions in Great Work's documentation while preserving bold-prefix headers.

### Files Updated

- `docs/wiki-architecture.md` - added size discipline, `## See Also`, and bold-prefix `**Relates:**` graph conventions.
- `wiki/agent_ops/schema.md` - added `Relates` as an optional repeatable header, page-size caps, `## See Also` guidance, template sections, and validation checks.

### Decisions Made

- Kept Great Work's `**Key:** value` header schema rather than adopting blockquote metadata.
- Standardized graph edges as repeatable `**Relates:** verb [Title](../folder/page.md)` lines, with `## See Also` as the human-readable relative-link section.

### Verification

- Documentation-only change; no build or lint command was run.

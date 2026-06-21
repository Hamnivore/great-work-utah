# Wiki Log

## [2026-06-19] people | first wave — 12 people pages, 7 source stubs, lint clean

- Created `wiki/people/` first wave: dave-bearss, fred-lampropoulos, florian-solzbacher, ryan-smith-imsar, aaron-skonnard, chad-testa, josh-james, karl-sun, ryan-smith-qualtrics, tim-latimer, jared-rutter, davis-smith (12 total).
- Resolved 5 broken See Also links from venture pages (halia-therapeutics, imsar, curza, pluralsight, blackrock-neurotech) that pre-existed without targets.
- Created 7 new source stub pages to clear 39→0 lint errors: iris-biomedical-official-website, nielson-scientific-doe-sbir, tellus-networked-sensor-solutions-official-website, wave-wireless-vehicle-electrification-official-website, great-salt-lake-usgs, nsa-utah-data-center-official-website (pre-existed), + jump-aero legacy-provenance fix.
- Updated `wiki/indexes/people.md` (12 entries) and `wiki/indexes/sources.md` (2 new rows).
- Checks: lint 0 errors 0 warnings, build 604 entries, people=12, ventures=108, sources=194.

## [2026-06-19] migrate | energy, transportation, and education venture batch (9 companies)

- Migrated legacy `places_you_can_work/` entries to source-first venture pages: OxEon Energy, Rodatherm Energy, Valar Atomics, Electric Power Systems, Jump Aero, WAVE, BYU-Pathway Worldwide, Sandbox, SchoolAI.
- Added 9 official-website source records; three parallel subagents plus boss index integration and Fervo↔Rodatherm cross-link.
- Lint: 0 errors. Build: 532 entries, ventures=82.

## [2026-06-19] migrate | health-and-longevity gap batch 2 (6 companies)

- Migrated legacy `places_you_can_work/health-and-longevity/` entries to source-first venture pages: Rebel Medicine, Spire Therapeutics, Trace AQ, SymbioCellTech, BioEnergenix, NephroNovus.
- Added 6 source records (official websites for four; U of U Health press release for BioEnergenix; Altitude Lab portfolio for NephroNovus).
- Three parallel subagents; boss integrated indexes and ran checks.
- BioEnergenix and NephroNovus marked **Confidence: Low** — sparse or stale public evidence.
- Lint: 0 errors. Build: 532 entries, ventures=82. Source coverage: 93.6% direct links, 1 uncited page remaining.

## [2026-06-19] judgment-layer | people launch + venture↔resource matches

- Launched `wiki/people/` with 5 founder bios: Dave Bearss, Aaron Skonnard, Ryan Smith (IMSAR), Florian Solzbacher, Chad Testa.
- Added 5 venture↔resource matches: Halia/Coreform/Blackrock ↔ Nucleus Fund; Curza ↔ UTIF; Inherent Biosciences ↔ BIOHive Utah.
- Three parallel subagents + boss integration on indexes, log, and two resource matches.
- Lint: 0 errors, 534 files. Build: 534 entries, people=5, matches=17. Next: person↔venture matches; refresh BIOHive resource stub.

## [2026-06-19] build | people pages — Florian Solzbacher, Chad Testa

- Added `wiki/people/florian-solzbacher.md` (Blackrock Neurotech co-founder) and `wiki/people/chad-testa.md` (Curza CEO).
- Sourced from existing venture and source pages only; no private contact info.
- Updated `wiki/indexes/people.md` and people count in `wiki/index.md`.

## [2026-06-19] migrate | biological-engineering venture gap batch (4 companies)

- Migrated legacy `places_you_can_work/biological-engineering/` entries to source-first venture pages: Curza, 3Helix, Evolution Bio, CaLycia Biosciences.
- Added 6 source records (official websites for Curza, 3Helix, CaLycia; English Lab + VEGAS paper for Evolution Bio).
- Two parallel subagents; boss integrated indexes and fixed Evolution Bio duplicate `Relates` header.
- Lint: 0 errors. Build: 494 entries, ventures=67.

## [2026-06-19] judgment-layer | matches pilot — 12 match pages across 5 venture×helper pairings

- Audited and registered 8 pre-existing unindexed match pages.
- Added 5 new match pages: Halia↔Maschoff Brennan, Fortem↔Parsons Behle, BioFire↔RQM+ (detailed), Recursion↔Wilson Sonsini, BambooHR↔NOW CFO.
- Resolved BioFire duplicate (kept the more detailed `-x-` version, deleted the legacy stub).
- Updated `wiki/index.md` matches count; `wiki/indexes/matches.md` now lists all 12 pages.
- Lint: 0 errors, 0 warnings.

## [2026-06-18] migrate | adopted shared wiki skill registry and sharded index

- Added repository-level `WIKI.md` registry and `wiki/WIKI.md` root marker.
- Added sharded skill index at `wiki/index.md` plus `wiki/indexes/*.md` for 406 public pages.
- Preserved Great Work's bold-prefix page schema and fact-layer / judgment-layer ontology.

## [2026-06-19] sdk-migration | trigger.dev v3 → v4 imports + write safety

- Fixed `@trigger.dev/sdk/v3` imports to `@trigger.dev/sdk` in: `trigger.config.ts`, `src/trigger/wiki-agent.ts`, `src/trigger/search-agent.ts`, `api/trigger-token.ts`. SDK already installed at ^4.4.5; only import paths were stale.
- Added write-safety guard to `search-agent.ts` write_file handler: blocks overwrite of existing pages; returns a read-first instruction instead.
- Lint: 0 warnings (pre-existing venture broken-source errors unrelated to this change).

## [2026-06-19] judgment-layer | people pilot — 5 people pages + 4 source records

- Created: `wiki/people/josh-james.md`, `ryan-smith-qualtrics.md`, `tim-latimer.md`, `karl-sun.md`. Aaron Skonnard already existed.
- Created 4 source records: `josh-james-domo-bio.md`, `ryan-smith-qualtrics-bio.md`, `tim-latimer-fervo-bio.md`, `karl-sun-lucid-bio.md`.
- Added `Relates: helps` back-links from `ventures/domo.md`, `ventures/qualtrics.md`, `ventures/fervo-energy.md`, `ventures/lucid-software.md`, and `work/omniture-web-analytics.md`.
- Build: 588 entries, people=10, sources=180. Lint: 0 warnings, 23 pre-existing errors (unrelated broken-source links from migration batches).

# Wiki Log

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

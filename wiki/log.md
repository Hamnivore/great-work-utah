# Wiki Log

## [2026-06-25] runtime | Ask / Trigger.dev write-safety hardening

- Removed remaining Trigger.dev v3 imports from runtime tasks and kept v4 `@trigger.dev/sdk` usage.
- Hardened public Ask runtime: trigger token TTL is 15 minutes; public search-agent writes are disabled unless explicitly enabled; GitHub wiki writes validate `wiki/<category>/<slug>.md` paths and refuse overwrites by default; scheduled wiki-agent writes are gated behind an explicit env flag.
- Added missing source records for Sarcos/Palladyne AI and Sword Health while resolving final wiki-lint failures from the concurrent venture/match wave.
- Checks: runtime-targeted ESLint clean; `npm run lint:wiki` 0 errors/0 warnings; `npm run build` built 636 entries; `npm run report:source-coverage` 0 errors and all 197 source records cited.

## [2026-06-25] boss-pass | schema upgrades, index rebuild, log split

- Rewrote 5 ventures pages from old `## Overview` schema to current schema (Summary, Impact, What They Are Building, What They Need Now, Who Could Help, Utah Context, Evidence, Open Questions): `oc-tanner.md`, `podium.md`, `sarcos-technology-and-robotics.md`, `sword-health.md`, `wordperfect.md`.
- Rebuilt `wiki/indexes/ventures.md` from current page content — 117 entries with prose summaries rather than stale focus-tag entries. Fixed 19 entries that had truncated summaries due to abbreviation periods (U.S., Inc., St., Dr.).
- Split `wiki/agent_ops/RUN_LOG.md`: archived 995 lines of 2026-05-09 initial build runs to `wiki/agent_ops/RUN_LOG-archive-2026-05-09.md`; main log reduced from 1221 lines (hard cap violation) to 236 lines.

## [2026-06-25] judgment-layer | person↔venture matches (Josh James, Aaron Skonnard, Ryan Smith/Qualtrics)

- Added 3 person↔venture match pages completing coverage for the three Silicon Slopes SaaS founders who had no match pages: `josh-james-x-domo.md`, `aaron-skonnard-x-pluralsight.md`, `ryan-smith-qualtrics-x-qualtrics.md`.
- Command Center pass: committed accumulated clean working-tree changes from prior agents (venture filename fixes, 16+ person-centered match pages, Frontend Wiki UX src fixes, log/index updates).
- Superseded stale claims `2026-06-25-person-centered-matches.md` and `2026-06-25-person-venture-matches.md`; their work had been completed but not formally closed.
- Updated `wiki/indexes/matches.md` to 37 entries (3 new rows added); updated root match count in `wiki/index.md` from 34 to 37.
- Checks: `npm run lint:wiki` 0 errors/0 warnings; `npm run build:wiki` built 636 entries, matches=37, sources=197.

## [2026-06-25] judgment-layer | person-helper matches — 3 pages

- Added person-helper match pages: Chad Testa↔BBCetc, Dave Bearss↔Nucleus Institute, Florian Solzbacher↔RQM+.
- Integrated alongside the concurrent person-centered match wave; `wiki/indexes/matches.md` and root match count now cover all 37 match files.
- Repaired adjacent broken links surfaced by final lint: retargeted a Josh James See Also link and added missing Podium, Sarcos, and Sword Health official-source records.
- Checks: `npm run lint:wiki` 0 errors/0 warnings; `npm run build:wiki` built 636 entries with matches=37 and sources=197; `npm run report:source-coverage` 0 errors, all 197 source records cited.

## [2026-06-25] judgment-layer | person-centered matches — 17 pages indexed

- Integrated 17 person-centered match pages spanning biotech, neurotechnology, geothermal, SaaS, defense, accounting/legal helpers, and mission-led consumer work.
- Boss-added pages in this pass include Tim Latimer↔Zanskar Geothermal, Florian Solzbacher↔Ripple Neuro, and Fred Lampropoulos↔Ripple Neuro.
- Reconciled `wiki/indexes/matches.md` to all 34 files in `wiki/matches/` and updated the sharded root match count to 34.
- Checks: `npm run lint:wiki` 0 errors/0 warnings; `npm run build:wiki` built 630 entries with matches=34; `npm run report:source-coverage` 0 errors, 524 warnings, all 194 source records cited.

## [2026-06-21] frontend | wiki UX — Directory + Entry labels cover all 9 wiki types

- Updated `src/pages/Directory.tsx`: replaced legacy `places_you_can_work`/`great_work` filter chips with full `PUBLIC_WIKI_SOURCES` set (ventures, people, helpers, resources, work, guides, matches, answers, sources, all). Default filter is now `ventures`.
- Updated `src/pages/Entry.tsx`: replaced per-type `if` chain with a `SOURCE_LABELS` map covering all 9 public wiki types; imported `PublicWikiSource` type.
- Closed stale active claims: `migration-factory-final-wave` (all 30 pages existed), `application-data-contract` (build script was already correct), `people-pages-first-wave` (all 8 pages existed).
- Checks: tsc clean, lint 0 errors 0 warnings, build 604 entries, app build clean (2.47s).

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

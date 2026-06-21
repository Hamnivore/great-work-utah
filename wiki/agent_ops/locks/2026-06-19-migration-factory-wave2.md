# Work Claim: Migration Factory — Legacy Wave 2 (Multi-Category)

**Status:** done
**Agent:** Claude Sonnet boss agent
**Started:** 2026-06-19 ~18:00 MDT
**Updated:** 2026-06-21

## Goal

Migrate the remaining ~44 legacy `places_you_can_work` entries into `wiki/ventures/` pages with matching `wiki/sources/` records. Cover all categories not yet claimed: energy, manufacturing, space, transportation, scientific-infrastructure, remaining bio-engineering, remaining health-and-longevity, other, art-and-meaning, food-and-agriculture.

## Broad Edit Zone

- `wiki/ventures/` — new venture pages for all targets
- `wiki/sources/` — official-website source records per venture
- `wiki/indexes/` — refreshed after all subagents complete
- this claim file

## Read-Only Context

- `wiki/agent_ops/schema.md`
- `wiki/WIKI.md`
- `legacy_wiki/places_you_can_work/` — seed material
- `wiki/ventures/torus.md`, `wiki/ventures/fortem-technologies.md` — style reference
- `wiki/sources/torus-official-website.md` — source record style reference

## Must Not Edit

- `wiki/agent_ops/RUN_LOG.md`, `DECISIONS.md` — coordinator-owned
- `wiki/agent_ops/index.md` — coordinator-owned
- Files claimed by other active agents
- `scripts/*`, `src/lib/*` — Application Data Contract already done

## Subagents

- **Group A (Energy):** fervo-energy, zanskar-geothermal, oxeon-energy, rodatherm-energy, valar-atomics
- **Group B (Manufacturing):** act-aerospace, enduracure, hexcel, innosys, ionic-mt, merit-medical, sky-quarry
- **Group C (Space + Transportation):** northrop-grumman-promontory, ram-aviation-space-defense, space-dynamics-laboratory, electric-power-systems, jump-aero, wave-inc
- **Group D (Sci-Infra + remaining Bio):** ripple-neuro, tellus, utah-arch, iris-biomedical, araknitek, batu-biologics, bioparin, cleanjoule, thera-t-pharmaceutics
- **Group E (Health remaining):** bioenergenix, nephronovus, rebel-medicine, recursion-pharmaceuticals, spire-therapeutic, symbiocelltech, trace-aq
- **Boss (Other + Art/Food):** eden-technologies, great-salt-lake, nielson-scientific, nsa-utah-data-center, cosm, deseret-book-bonneville, music-ai, utah-film-industry, renaissance-ag, usu-integrated-biosystems

## Progress

- Claimed slice. Launched 5 parallel subagents + boss working Other/Art/Food batch in parallel.
- All 5 subagents completed. Most venture pages already existed from prior sessions — subagents created missing source records and fixed Relates: fields.
- Boss batch created: cosm, music-ai, eden-technologies, great-salt-lake, nsa-utah-data-center, renaissance-ag (plus deseret-book-bonneville, nielson-scientific, usu-integrated-biosystems, utah-film-industry created by a prior agent).
- Fixed 2 duplicate pages (tellus-networked-sensor-solutions, wave-wireless-vehicle-electrification) — removed in favor of canonical shorter slugs.
- Created missing source records: iris-biomedical-official-website, nielson-scientific-doe-sbir.
- Fixed jump-aero-official-website legacy-provenance lint error.
- Checks: lint 0 errors (603 files), build 603 entries, ventures=108, sources=194, people=12.

## Files Changed

**New venture pages (boss batch):**
- `wiki/ventures/cosm.md`, `wiki/ventures/music-ai.md`, `wiki/ventures/eden-technologies.md`
- `wiki/ventures/great-salt-lake.md`, `wiki/ventures/nsa-utah-data-center.md`, `wiki/ventures/renaissance-ag.md`

**New source records:**
- `wiki/sources/cosm-official-website.md`, `wiki/sources/music-ai-official-website.md`
- `wiki/sources/eden-technologies-official-website.md`, `wiki/sources/renaissance-ag-official-website.md`
- `wiki/sources/iris-biomedical-official-website.md`, `wiki/sources/nielson-scientific-doe-sbir.md`
- `wiki/sources/fervo-energy-official-website.md`, `wiki/sources/zanskar-geothermal-official-website.md`
- `wiki/sources/merit-medical-official-website.md`
- `wiki/sources/northrop-grumman-promontory-official-website.md`
- `wiki/sources/ram-aviation-space-defense-official-website.md`
- `wiki/sources/space-dynamics-laboratory-official-website.md`

**Removed duplicates:**
- `wiki/ventures/tellus-networked-sensor-solutions.md` (duplicate of `tellus.md`)
- `wiki/ventures/wave-wireless-vehicle-electrification.md` (duplicate of `wave-inc.md`)
- `wiki/sources/tellus-networked-sensor-solutions-official-website.md`
- `wiki/sources/wave-wireless-vehicle-electrification-official-website.md`

**Fixed:**
- `wiki/sources/jump-aero-official-website.md` — removed legacy-provenance language

## Handoff / Next Step

- **People pages** — 12 pages now in `wiki/people/`; growing but sparse. Key figures still missing.
- **Guides source coverage** — 7 guides lack `Relates: cites` edges; editorial pass needed.
- **Remaining legacy categories** — education (all done), tools-for-thought (all done), art-and-meaning (cosm/music-ai/film/deseret-book done, sundance already existed).
- **Source coverage audit** — run `node scripts/wiki-source-coverage.mjs` to measure current cites coverage across the enlarged wiki.

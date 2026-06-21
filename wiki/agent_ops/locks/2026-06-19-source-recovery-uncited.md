# Work Claim: Source Recovery — Uncited Pages

**Status:** done
**Agent:** Codex boss agent
**Started:** 2026-06-19 12:35 MDT
**Updated:** 2026-06-19 13:30 MDT

## Goal

Create `wiki/sources/` records for the 7+ uncited and source-poor wiki pages, then add `**Relates:** cites [...]` edges to connect them. Target pages have external evidence in `## Evidence` sections but no corresponding source record pages.

Coverage baseline: `node scripts/wiki-source-coverage.mjs` reports:
- 7 uncited pages (4 work, 2 ventures, 1 answer)
- work: 4 fact-layer-only (have cross-links but no source records)
- `Relates: cites` edges: 5.1% coverage (17/336)

## Broad Edit Zone

- `wiki/sources/` — new source record pages
- `wiki/work/` — add `**Relates:** cites [...]` edges
- `wiki/ventures/intactis-bio.md`, `wiki/ventures/jarvik-7-artificial-heart.md` — add edges
- `wiki/work/conotoxins-and-prialt.md` — add edges

## Read-Only Context

- `wiki/agent_ops/schema.md` (source page format: Status, Confidence, Source Type, URL, Publisher, Accessed, Updated, Summary, Useful Claims, Reliability Notes, Related Pages)
- `wiki/sources/` (existing source records for style reference)

## Must Not Edit

- `wiki/agent_ops/RUN_LOG.md`
- `wiki/agent_ops/DECISIONS.md`
- Resources directory (196 directory-only resources are out of scope for this run)
- Guides and answers (separate judgment-layer issue)

## Subagents

- Group A: h-tracy-hall, harvey-fletcher work pages
- Group B: iomega, omniture, philo-farnsworth work pages
- Group C: intactis-bio, jarvik-7, conotoxins-and-prialt

## Progress

- Claimed slice, launched 3 parallel subagents.
- **Group A** (h-tracy-hall, harvey-fletcher): 6 source records created (NIHF, C&EN, BYU Archives, BYU News Grammy, Utah History, ETHW); 6 Relates edges added.
- **Group B** (iomega, omniture, philo-farnsworth): 6 source records created (Iomega 10-K, Standard-Examiner, Omniture SEC 14D-9, Deseret News, Census Bureau, Linda Hall Library); 6 Relates edges added.
- **Group C** (intactis-bio, jarvik-7, conotoxins): 5 source records created (PR Newswire, U of U cardiology, Smithsonian, U of U news release, DailyMed); 5 Relates edges added.
- Boss directly: Added Relates edges to intermountain-clinical-quality-improvement, torus, autonomous-solutions-inc, utah-neurorobotics-lab (4 orphan source citations resolved).
- Removed 2 duplicate source files (strider-technologies-official-website.md, tanner-official-site.md) via git rm.
- Created source records and venture pages for telescope-array and pons-fleischmann-cold-fusion (2 remaining uncited pages fixed).
- Added citation for conotoxins-prialt-sources.md (last uncited source record).
- Updated WIKI.md article count (455 → 494).

## Coverage Improvement

Before: direct 91.1%, Relates:cites 5.1%, source records cited 94.0%, uncited pages 7
After: direct 93.2%, Relates:cites 11.1%, source records cited 100.0%, uncited pages 1

## Files Changed

- 22 new source records in wiki/sources/
- Relates edges added to 15 wiki pages
- 2 new venture pages (telescope-array-official-website.md, axios-cold-fusion-35-years.md as source records; 3helix.md and inherent-biosciences.md existed)
- 2 duplicate source files removed via git rm

## Handoff / Next Step

- Remaining: 1 uncited answer page (persona-specific synthesis — by design), 7 guides all fact-layer-only (judgment pages that need editorial Relates: cites additions).
- Resources: 196 directory-only pages are the largest coverage gap; these require bulk source creation work beyond this slice scope.
- Run `node scripts/wiki-source-coverage.mjs` to monitor ongoing coverage.

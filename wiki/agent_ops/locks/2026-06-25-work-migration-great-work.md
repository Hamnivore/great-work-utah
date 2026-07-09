# Work Claim: wiki/work Migration — Legacy great_work Corpus

**Status:** active
**Agent:** Claude boss (Sonnet 4.6)
**Started:** 2026-06-25 MDT
**Updated:** 2026-06-25 MDT

## Goal

Migrate all unmigrated entries from `legacy_wiki/great_work/` into properly formatted `wiki/work/` pages. Create companion `wiki/sources/` records from "Learn more" links where available.

Current state: 26/161 migrated. 112 content entries remain across 8 categories (agent_ops dir excluded).

## Category Breakdown (unmigrated)

| Category | Remaining |
|---|---|
| medicine-and-biology | ~43 |
| industry-and-infrastructure | ~22 |
| environment-and-earth | ~16 |
| aerospace-and-propulsion | ~12 |
| physics-and-materials | ~7 |
| culture-and-arts | ~7 |
| defense-and-security | ~6 |
| mathematics-and-theoretical-science | ~4 |
| computing-and-software | ~1 |

## Broad Edit Zone

- `wiki/work/` — new pages per legacy entry
- `wiki/sources/` — source records from "Learn more" links
- `wiki/indexes/work.md`, `wiki/indexes/sources.md` — updated by `npm run build:wiki:skill-index` after completion

## Read-Only Context

- `legacy_wiki/great_work/<category>/<slug>.md` — source content per entry
- `wiki/work/omniture-web-analytics.md` — format exemplar
- `wiki/agent_ops/schema.md` — wiki schema
- `wiki/sources/omniture-adobe-sec-14d9-2009.md` — source record format exemplar

## Must Not Edit

- Any `wiki/work/<slug>.md` that already exists (26 pages done)
- `wiki/ventures/`, `wiki/people/`, `wiki/matches/`, `wiki/guides/`
- `scripts/`, `src/lib/`, `wiki/agent_ops/RUN_LOG.md`, `DECISIONS.md`

## Subagents

- **Group A (medicine-and-biology)**: All 55 entries in `legacy_wiki/great_work/medicine-and-biology/`, skip already-migrated
- **Group B (industry-and-infrastructure)**: All 24 entries in `legacy_wiki/great_work/industry-and-infrastructure/`, skip already-migrated
- **Group C (environment-and-earth + math)**: `environment-and-earth/` (16) + `mathematics-and-theoretical-science/` (4)
- **Group D (aerospace + culture)**: `aerospace-and-propulsion/` (12) + `culture-and-arts/` (7)
- **Group E (defense + physics + computing)**: `defense-and-security/` (10, skip 4 migrated) + `physics-and-materials/` (13, skip 6 migrated) + `computing-and-software/` (13, skip 12 migrated)

## Progress

- Claimed slice. Launching 5 parallel subagents.

## Files Changed

- Pending (subagent results).

## Handoff / Next Step

- After all groups: boss runs lint + build + coverage, updates roadmap, marks claim done.
- Next priority: source records for the 11 ventures with only raw https:// evidence.

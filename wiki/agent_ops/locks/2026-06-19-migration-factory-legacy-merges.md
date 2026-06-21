# Work Claim: Migration Factory — Legacy-Backed Venture Merges

**Status:** done
**Agent:** Cursor boss agent
**Started:** 2026-06-19 12:00 MDT
**Updated:** 2026-06-19 12:15 MDT

## Goal

Complete the Migration Factory slice for legacy-backed malformed ventures: convert `domo`, `instructure`, `pluralsight`, and `qualtrics` from `wiki/ventures/*-md` stubs into proper schema-compliant `.md` venture pages seeded from `legacy_wiki/`, add source records, delete malformed filenames, and validate with wiki lint/build.

## Broad Edit Zone

- `wiki/ventures/domo.md`, `instructure.md`, `pluralsight.md`, `qualtrics.md`
- `wiki/sources/*` for those ventures
- `wiki/ventures/domo-md`, `instructure-md`, `pluralsight-md`, `qualtrics-md` (delete after validation)
- `wiki/agent_ops/locks/2026-06-19-migration-factory-legacy-merges.md`

## Read-Only Context

- `docs/old-db-migration-malformed-ventures.md`
- `legacy_wiki/places_you_can_work/`
- `wiki/agent_ops/schema.md`
- `wiki/ventures/fortem-technologies.md` (exemplar)
- `wiki/sources/fortem-official-website.md` (source exemplar)

## Must Not Edit

- `wiki/agent_ops/index.md`, `RUN_LOG.md`, `DECISIONS.md`, `docs/wiki-seed-worklist.md`
- Other malformed `*-md` files (ancestry, bamboohr, etc.) — Source Recovery owns those
- Files claimed by `2026-06-19-1111-source-coverage-report.md`

## Subagents

- Domo migrator (legacy merge + source)
- Instructure migrator (legacy merge + source)
- Pluralsight migrator (legacy merge + source)
- Qualtrics migrator (legacy merge + source; fix founder list vs malformed stub)

## Progress

- Claimed Migration Factory legacy-backed merge group per `docs/old-db-migration-malformed-ventures.md` handoff.
- Launched four parallel subagents; subagents completed venture pages and source records.
- Boss verified all four `.md` pages exist with required headers, Evidence sections, and `Relates: cites` lines.
- Malformed `*-md` files removed for domo, instructure, pluralsight, qualtrics.
- Qualtrics founder list corrected (Ryan/Scott/Jared/Stuart Smith and Orgill; removed erroneous Josh Gubler from malformed stub).
- Instructure ownership updated to KKR/Dragoneer 2024 take-private per source page.
- Ran `npm run lint:wiki`: no errors in merge-group files; repo has 10 pre-existing errors elsewhere.
- Ran `npm run build:wiki`: succeeded, 469 entries.

## Files Changed

- `wiki/ventures/domo.md`
- `wiki/ventures/instructure.md`
- `wiki/ventures/pluralsight.md`
- `wiki/ventures/qualtrics.md`
- `wiki/sources/domo-official-website.md`
- `wiki/sources/instructure-official-website.md`
- `wiki/sources/pluralsight-official-website.md`
- `wiki/sources/qualtrics-official-website.md`
- `src/data/generated/all.json`
- deleted: `wiki/ventures/domo-md`, `instructure-md`, `pluralsight-md`, `qualtrics-md`

## Handoff / Next Step

- Source Recovery should continue with remaining malformed ventures: ancestry, bamboohr, cotopaxi, lucid-software, overstock-com, skullcandy, vivint-smart-home, owlet-baby-care.
- Myriad-genetics needs venture/work separation review before conversion.
- Novell should be retired or folded into `wiki/work/wordperfect-and-novell.md`.

# Work Claim: Source Recovery — Malformed Venture Conversions

**Status:** done
**Agent:** Cursor boss agent
**Started:** 2026-06-19 12:30 MDT
**Updated:** 2026-06-19 13:45 MDT

## Goal

Complete the Source Recovery slice for source-first malformed ventures: create source records, convert `ancestry`, `bamboohr`, `cotopaxi`, `lucid-software`, `overstock-com`, `owlet-baby-care`, `skullcandy`, and `vivint-smart-home` into schema-compliant `.md` pages with `Relates: cites`, retire `novell-md` after confirming coverage in `wiki/work/wordperfect-and-novell.md`, delete malformed filenames, and validate.

## Broad Edit Zone

- `wiki/ventures/{ancestry,bamboohr,cotopaxi,lucid-software,overstock-com,owlet-baby-care,skullcandy,vivint-smart-home,myriad-genetics}.md`
- `wiki/sources/*` for those ventures
- `wiki/ventures/*-md` (delete after validation)
- `wiki/work/wordperfect-and-novell.md` (See Also link only)
- this claim file

## Read-Only Context

- `docs/old-db-migration-malformed-ventures.md`
- `wiki/agent_ops/schema.md`
- `wiki/ventures/fortem-technologies.md`
- `wiki/sources/fortem-official-website.md`

## Must Not Edit

- `wiki/agent_ops/index.md`, `RUN_LOG.md`, `DECISIONS.md`, `docs/wiki-seed-worklist.md`
- `scripts/*`, `package.json` — Source Technology claim

## Subagents

- Utah SaaS batch: ancestry, bamboohr, owlet-baby-care (prior session)
- Consumer/brand batch: cotopaxi, lucid-software, skullcandy (prior session)
- Corporate history batch: overstock-com, vivint-smart-home (prior session)
- Myriad Genetics migrator (venture/work separation + source)

## Progress

- Claimed Source Recovery source-first group per malformed-ventures handoff.
- Prior subagents completed 7 venture pages + 8 source records; malformed stubs for ancestry, bamboohr, cotopaxi, lucid-software, overstock-com, skullcandy, vivint-smart-home were already removed.
- Boss critical path: created `wiki/ventures/owlet-baby-care.md` (fixed broken source link), deleted `novell-md`, added See Also to `wiki/work/wordperfect-and-novell.md`.
- Launched Myriad Genetics subagent: created venture + source pages, cross-linked work page, deleted `myriad-genetics-md`.
- All 14 malformed venture files from inventory are now resolved (4 legacy merges + 9 source-first conversions + novell retired + myriad venture/work split).
- Checks: `npm run lint:wiki` 0 errors (16 warnings); `npm run build:wiki` OK (469 entries).

## Files Changed

- `wiki/ventures/owlet-baby-care.md` (created)
- `wiki/ventures/myriad-genetics.md` (created by subagent)
- `wiki/sources/myriad-genetics-official-website.md` (created by subagent)
- `wiki/work/myriad-genetics-brca.md` (See Also cross-links)
- `wiki/work/wordperfect-and-novell.md` (See Also; retired novell venture question)
- `wiki/indexes/ventures.md`, `wiki/indexes/sources.md` (subagent)
- `src/data/generated/all.json` (rebuilt)
- deleted: `wiki/ventures/novell-md`, `wiki/ventures/myriad-genetics-md`

## Handoff / Next Step

- Malformed venture inventory is clear. No `*-md` stubs remain in `wiki/ventures/`.
- Wiki Skill Compliance: address 16 discouraged `-page` suffix warnings in `wiki/sources/` when a lint-debt boss claims that slice.
- Source Recovery follow-up: deepen FDA/regulatory sources for Owlet; SEC/investor sources for Myriad financials and MRD competitive position.

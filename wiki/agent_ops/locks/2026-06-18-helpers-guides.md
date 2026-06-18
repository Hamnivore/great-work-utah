# Work Claim: Helpers + Advisor/Cofounder Guides

**Status:** complete
**Agent:** helpers-guides subagent (seed worklist item 11)
**Started:** 2026-06-18 06:58 MT
**Updated:** 2026-06-18 07:20 MT

## Goal

Make business-service providers first-class. Create ~5-6 publicly-sourced
`helpers/` pages for established Utah business-service organizations (startup/IP
law, accounting/tax/CFO, patents, SBIR/grant consulting), each with a matching
`sources/` source-record page for the official site. Then create two new guides
that route founders to advisors and cofounders.

## Owned Files / Folders

- `wiki/helpers/<slug>.md` (new helper pages, ~5-6)
- `wiki/sources/<slug>.md` (one source record per helper, official sites)
- `wiki/guides/find-an-advisor.md` (NEW)
- `wiki/guides/find-a-cofounder.md` (NEW)
- `wiki/agent_ops/locks/2026-06-18-helpers-guides.md` (this file)

## Read-Only Context

- `wiki/agent_ops/schema.md`
- `wiki/agent_ops/agents.md`
- `wiki/helpers/nucleus-institute.md`
- `wiki/guides/find-business-services.md`
- `wiki/resources/score-utah.md`, `wiki/resources/utah-sbdc.md`

## Must Not Edit

- `wiki/agent_ops/index.md`, `RUN_LOG.md`, `DECISIONS.md`
- `docs/wiki-seed-worklist.md`
- existing guides (find-business-services.md, etc.)
- files claimed by other active agents (defense/health/mi ventures, worker-a..f)

## Plan

1. Web-verify candidate Utah providers; pick ~5-6 with strong public evidence.
2. Create helper pages (HELPER template) + matching source records.
3. Create find-an-advisor.md and find-a-cofounder.md guides (GUIDE template).
4. Validate headers, links, source quality. Update this claim with results.

## Progress

- Web-verified 6 Utah providers via official sites + Chambers/IAM/press.
- Created 6 helper pages, 6 matching source records, 2 new guides.
- `npm run build:wiki` passes (469 entries; new pages picked up).
- Lint clean on new files.

## Files Changed

Helpers (created):
- `wiki/helpers/kirton-mcconkie.md`
- `wiki/helpers/parsons-behle-latimer.md`
- `wiki/helpers/workman-nydegger.md`
- `wiki/helpers/tanner-llc.md`
- `wiki/helpers/eide-bailly-utah.md`
- `wiki/helpers/preferred-cfo.md`

Sources (created):
- `wiki/sources/kirton-mcconkie-official-website.md`
- `wiki/sources/parsons-behle-latimer-official-website.md`
- `wiki/sources/workman-nydegger-official-website.md`
- `wiki/sources/tanner-llc-official-website.md`
- `wiki/sources/eide-bailly-official-website.md`
- `wiki/sources/preferred-cfo-official-website.md`

Guides (created):
- `wiki/guides/find-an-advisor.md`
- `wiki/guides/find-a-cofounder.md`

## Handoff / Next Step

- Coordinator to merge index.md / RUN_LOG.md lines from final response.
- Could NOT source as Utah-based standalone helpers this run: Durham Jones &
  Pinegar, Foley & Lardner SLC, Snell & Wilmer SLC (verifiable but not written —
  picked Kirton/Parsons instead), Maschoff Brennan (IP, not verified this run),
  and a Utah-based SBIR/grant consultancy (E.B. Howard appears non-Utah; Utah's
  SBIR help is already covered by resources/nucleus-grow.md, so no helper made).
- Next best: add Utah university entrepreneurship programs + a cofounder-matching
  venue as resources/ so find-a-cofounder.md has stronger routes; add a
  people/ layer for named advisors.

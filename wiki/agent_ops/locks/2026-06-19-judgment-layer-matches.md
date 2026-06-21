# Work Claim: Judgment Layer — Initial Match Pages

**Status:** done
**Agent:** Claude boss agent
**Started:** 2026-06-19 13:15 MDT
**Updated:** 2026-06-19 13:45 MDT

## Goal

Create the first set of match pages in `wiki/matches/`, connecting Utah ventures to helpers based on public evidence. The `matches/` directory does not yet exist; this claim creates it and establishes the first 6–8 match pages across medical-device regulatory, IP/patent, and finance categories.

## Broad Edit Zone

- `wiki/matches/*.md` (all new files)
- `wiki/agent_ops/locks/2026-06-19-judgment-layer-matches.md`

## Read-Only Context

- `wiki/agent_ops/schema.md`
- `wiki/ventures/blackrock-neurotech.md`, `recursion-pharmaceuticals.md`, `fortem-technologies.md`, `fervo-energy.md`, `halia-therapeutics.md`, `biofire-diagnostics.md`, `passivelogic.md`
- `wiki/helpers/rqm-plus.md`, `maschoff-brennan.md`, `workman-nydegger.md`, `now-cfo.md`, `nucleus-institute.md`
- `wiki/guides/find-meaningful-work.md`

## Must Not Edit

- `wiki/agent_ops/index.md`, `RUN_LOG.md`, `DECISIONS.md`, `docs/wiki-seed-worklist.md`
- `wiki/ventures/*`, `wiki/helpers/*` (read-only)
- Files claimed by active agents

## Subagents

- IP batch (Subagent A): recursion/workman-nydegger, fortem/maschoff-brennan, halia/workman-nydegger
- Finance/regulatory batch (Subagent B): passivelogic/now-cfo, biofire/rqm-plus, zanskar/maschoff-brennan
- Boss handles: blackrock-neurotech/rqm-plus, fervo-energy/maschoff-brennan

## Progress

- Claimed Judgment Layer. Created `wiki/matches/` directory.
- Launched Subagent A (IP matches) and Subagent B (finance/regulatory matches) in parallel; boss wrote two match pages on critical path.
- Found two additional match pages from a prior session agent: `fortem-technologies-x-parsons-behle-latimer.md` and `halia-therapeutics-x-maschoff-brennan.md` (different pairings, no conflict).
- Ran `npm run lint:wiki`: 0 errors, 0 warnings. Ran `npm run build:wiki`: succeeded, 452 entries, matches=10.

## Files Changed

- `wiki/matches/blackrock-neurotech-rqm-plus.md` (boss)
- `wiki/matches/fervo-energy-maschoff-brennan.md` (boss)
- `wiki/matches/recursion-pharmaceuticals-workman-nydegger.md` (Subagent A)
- `wiki/matches/fortem-technologies-maschoff-brennan.md` (Subagent A)
- `wiki/matches/halia-therapeutics-workman-nydegger.md` (Subagent A)
- `wiki/matches/passivelogic-now-cfo.md` (Subagent B)
- `wiki/matches/biofire-diagnostics-rqm-plus.md` (Subagent B)
- `wiki/matches/zanskar-geothermal-maschoff-brennan.md` (Subagent B)
- `wiki/agent_ops/locks/2026-06-19-judgment-layer-matches.md`

## Handoff / Next Step

- Judgment Layer follow-up: write `people/` pages for key Utah founders and researchers (0 currently); these would enable person <-> venture and person <-> helper match pages.
- Add `Relates: cites` back-links from venture and helper pages to the new match pages.
- Next guide candidate: "Which Utah IP firms work best for which founders?" — synthesizes the IP match pages into a routing guide.

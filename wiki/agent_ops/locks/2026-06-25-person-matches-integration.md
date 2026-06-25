# Work Claim: Person-Matches Integration + Missing Person Match Pages

**Status:** done
**Agent:** Claude boss (Sonnet 4.6)
**Started:** 2026-06-25
**Updated:** 2026-06-25

## Goal

1. **Command Center pass**: commit the accumulated clean working-tree changes from the prior Frontend Wiki UX and person-centered-matches agents (venture renames, match pages, index/log updates, src fixes).
2. **Supersede stale claims**: mark `2026-06-25-person-centered-matches.md` and `2026-06-25-person-venture-matches.md` as superseded (work was completed but not formally closed).
3. **Index repair**: add the 4 untracked match pages missing from `wiki/indexes/matches.md` (jared-rutter-x-wilson-sonsini, karl-sun-x-wilson-sonsini, tim-latimer-x-utah-forge, ryan-smith-imsar-x-47g).
4. **Missing person match pages**: create person↔venture match pages for Josh James, Aaron Skonnard, and Ryan Smith (Qualtrics) — the three people pages that currently have no match pages at all.
5. Run `npm run lint:wiki` + `npm run build:wiki` + `npx tsc --noEmit`; fix any issues; commit.

## Broad Edit Zone

- `wiki/matches/` — new match pages + reading existing
- `wiki/indexes/matches.md` — add 4 missing entries + new entries
- `wiki/index.md` — update match/venture counts
- `wiki/log.md` — append operation entry
- `wiki/agent_ops/locks/2026-06-25-person-centered-matches.md` — mark superseded
- `wiki/agent_ops/locks/2026-06-25-person-venture-matches.md` — mark superseded
- `wiki/agent_ops/locks/2026-06-25-person-matches-integration.md` — this file
- `wiki/agent_ops/leader-agent-roadmap.md` — append roadmap log entry

## Read-Only Context

- `wiki/people/josh-james.md`
- `wiki/people/aaron-skonnard.md`
- `wiki/people/ryan-smith-qualtrics.md`
- `wiki/ventures/domo.md`, `wiki/ventures/qualtrics.md`, `wiki/ventures/pluralsight.md`
- Existing `wiki/matches/*.md` for style reference
- `wiki/agent_ops/leader-agent-roadmap.md`

## Must Not Edit

- `raw/` — immutable sources
- Other active claim files
- `src/` unless checks reveal a direct break
- `wiki/` content pages not in the edit zone

## Subagents

- Subagent A: josh-james match pages (Domo + Omniture/work connection)
- Subagent B: aaron-skonnard match pages (Pluralsight)
- Subagent C: ryan-smith-qualtrics match pages (Qualtrics)
- Boss: index repair + venture renames commit + integration pass

## Progress

- 2026-06-25: Claimed slice. Committed accumulated working-tree changes from prior agent waves. Superseded stale 2026-06-25 claims. Added 4 missing index entries (jared-rutter-x-wilson-sonsini, karl-sun-x-wilson-sonsini, tim-latimer-x-utah-forge, ryan-smith-imsar-x-47g — already in index from prior agent). Wrote 3 new person↔venture match pages (josh-james-x-domo, aaron-skonnard-x-pluralsight, ryan-smith-qualtrics-x-qualtrics). Updated matches index to 37 entries; updated root count to 37. Checks: lint 0 errors, build 636 entries, tsc clean.

## Files Changed

- `wiki/agent_ops/locks/2026-06-25-person-matches-integration.md` (this file)
- `wiki/matches/josh-james-x-domo.md` (new)
- `wiki/matches/aaron-skonnard-x-pluralsight.md` (new)
- `wiki/matches/ryan-smith-qualtrics-x-qualtrics.md` (new)
- `wiki/indexes/matches.md` — 3 new rows added
- `wiki/index.md` — matches count 34→37
- `wiki/log.md` — entry appended
- Venture filename renames (10 files), people file cleanups (2 staged deletions), src link fixes — committed in same batch
- `wiki/agent_ops/locks/2026-06-25-person-centered-matches.md` — marked superseded
- `wiki/agent_ops/locks/2026-06-25-person-venture-matches.md` — marked superseded

## Handoff / Next Step

- All 12 people pages now have at least one match page except those with limited public source coverage. Next natural step: second people batch (Recursion, Fortem, BioFire, Halia founders) or source-coverage audit for guides.

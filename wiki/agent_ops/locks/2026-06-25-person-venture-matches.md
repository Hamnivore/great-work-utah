# Work Claim: Person Venture Matches

**Status:** superseded
**Agent:** GPT-5.5
**Started:** 2026-06-25 10:51 MDT
**Updated:** 2026-06-25 10:51 MDT

## Goal

Complete a Judgment Layer slice by adding sourced person↔venture match pages for recently completed people pages, then refresh the match index, root counts, log, and checks.

## Broad Edit Zone

- `wiki/matches/`
- `wiki/indexes/matches.md`
- `wiki/index.md`
- `wiki/log.md`
- this claim file

## Read-Only Context

- `wiki/people/`
- `wiki/ventures/`
- `wiki/sources/`
- `wiki/indexes/people.md`
- `wiki/indexes/ventures.md`
- `wiki/agent_ops/leader-agent-roadmap.md`

## Must Not Edit

- Other `wiki/agent_ops/locks/*.md` files
- Existing active boss zones, if any appear during the run
- `raw/`
- Application source files unless checks reveal a direct break caused by this slice

## Plan

1. Have read-only subagents identify strongest person↔venture candidates and evidence paths.
2. Boss writes a compact batch of high-confidence match pages.
3. Refresh `wiki/indexes/matches.md`, `wiki/index.md`, and `wiki/log.md`.
4. Run wiki lint/build checks and update this claim with results.

## Progress

- 2026-06-25: Claimed slice after confirming existing visible locks are done/completed.

## Files Changed

- `wiki/agent_ops/locks/2026-06-25-person-venture-matches.md`

## Handoff / Next Step

- Superseded by broader claim `2026-06-25-person-centered-matches.md`, which includes person-to-venture, helper, and resource match pages.

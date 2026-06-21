# Work Claim: Source Coverage Report

**Status:** done
**Agent:** Codex boss agent
**Started:** 2026-06-19 11:11 MDT
**Updated:** 2026-06-19 11:35 MDT

## Goal

Finish a Source Technology slice: add a deterministic report that audits public wiki pages for source coverage and `Relates: cites` coverage, then use subagents to review source/page patterns and validation risk.

## Broad Edit Zone

- `scripts/wiki-source-coverage.mjs`
- `package.json`
- `wiki/agent_ops/locks/2026-06-19-1111-source-coverage-report.md`

## Read-Only Context

- `wiki/`
- `wiki/agent_ops/leader-agent-roadmap.md`
- `wiki/agent_ops/PLAYBOOK.md`
- `wiki/agent_ops/schema.md`
- `scripts/wiki-lint.mjs`
- `scripts/build-wiki-skill-index.mjs`

## Must Not Edit

- files claimed by other active agents
- `wiki/agent_ops/RUN_LOG.md`
- `wiki/agent_ops/DECISIONS.md`
- `docs/wiki-seed-worklist.md`
- public wiki content pages outside this claim's edit zone

## Plan

1. Inspect existing wiki scripts and source-page conventions.
2. Launch subagents for source-pattern audit and validator-risk review.
3. Implement `wiki-source-coverage` with text and JSON output.
4. Add an npm script for the report.
5. Run wiki lint, source coverage, and wiki builds.
6. Update this claim with results.

## Progress

- Claimed Source Technology slice.
- Launched two read-only subagents:
  - Lovelace audited real wiki source/citation patterns and edge cases.
  - Linnaeus reviewed CLI shape, JSON shape, warning/error policy, and verification risks.
- Added a deterministic source coverage report with text, JSON, strict mode, and list modes.
- Folded in subagent findings:
  - distinguishes direct provider source coverage from broad Startup State directory/import coverage
  - includes legacy `[source:slug]` inline token resolution
  - scans extensionless markdown-like public files so malformed venture pages are not missed
  - reports unreferenced source records and missing source metadata as warnings
- Added `npm run report:source-coverage`.
- Ran source coverage report and determinism check; JSON output was stable across two runs.
- Spot-checked:
  - `wiki/resources/kinect-capital.md` => `linked-source`
  - `wiki/resources/washington-area-chamber-of-commerce.md` => `directory-only`
  - `wiki/ventures/qualtrics.md` => `graph-ready` after concurrent migration work

## Files Changed

- `scripts/wiki-source-coverage.mjs`
- `package.json`
- `wiki/agent_ops/locks/2026-06-19-1111-source-coverage-report.md`

## Handoff / Next Step

- Checks:
  - `npm run report:source-coverage` passed with `0 errors` and source-debt warnings.
  - `node scripts/wiki-source-coverage.mjs --json` passed.
  - Determinism check with two JSON runs and `diff` passed.
  - `node --check scripts/wiki-source-coverage.mjs` passed.
  - `npm run lint:wiki` passed with 16 pre-existing discouraged filename suffix warnings.
  - `npm run build:wiki:skill-index` passed.
  - `npm run build:wiki` passed after escalation because sandboxed `tsx` could not create its IPC socket under `/tmp`.
  - `npm run lint` failed on unrelated existing repo-wide issues in `.trigger/tmp`, `src/components/navbar-prototypes/BubbleGraph.tsx`, `src/lib/page-transitions.tsx`, `src/templates/markdown/MarkdownLayouts.tsx`, and `src/trigger/search-agent.ts`.
- Next best task: add a small CI/report doc or dashboard widget that consumes the JSON `lintFindings`, then start paying down `directory-only-source-coverage` resources in batches.

# Work Claim: Ask / Runtime Hardening

**Status:** done
**Agent:** Codex boss agent
**Started:** 2026-06-25 10:52 MDT
**Updated:** 2026-06-25 11:31 MDT

## Goal

Complete a bounded Ask / Runtime slice from the leader roadmap: verify Trigger.dev v4 usage, harden runtime write safety where needed, and run the wiki/app checks needed to leave the slice shippable.

## Broad Edit Zone

- `src/trigger/`
- `api/trigger-token.ts`
- `src/pages/Ask.tsx`
- `scripts/build-wiki-index.ts`
- `scripts/wiki-lint.mjs`
- `wiki/index.md`
- `wiki/indexes/*.md`

## Read-Only Context

- `wiki/agent_ops/leader-agent-roadmap.md`
- `wiki/agent_ops/locks/`
- `wiki/log.md`
- `src/data/generated/all.json`

## Must Not Edit

- Active claim files owned by other agents, if any appear during the run.
- Existing unrelated dirty work unless a validation failure makes a narrow integration edit necessary.
- `raw/`

## Plan

1. Read runtime and Ask code.
2. Coordinate Trigger.dev/runtime and wiki-index explorer subagents.
3. Patch runtime safety or generated-index contract issues found in this slice.
4. Run `npm run lint:wiki`, `npm run build:wiki`, and relevant TypeScript/build checks.
5. Update this claim with results and handoff.

## Progress

- 2026-06-25 10:52 MDT: Claimed slice. Spawned two explorer subagents: Trigger.dev/runtime audit and wiki-index/rename-health audit.
- 2026-06-25 11:31 MDT: Completed runtime hardening and integration checks. Trigger.dev v3 imports are gone; public Ask writes are gated; GitHub writes validate wiki paths and refuse overwrites by default; scheduled wiki-agent writes are disabled unless explicitly enabled; public trigger token lifetime is 15 minutes.
- 2026-06-25 11:31 MDT: Integrated adjacent lint failures from concurrent venture/match work by adding missing Sarcos/Palladyne AI and Sword Health source records.

## Files Changed

- `wiki/agent_ops/locks/2026-06-25-1052-ask-runtime-hardening.md`
- `api/trigger-token.ts`
- `src/trigger/github-wiki.ts`
- `src/trigger/hello-world.ts`
- `src/trigger/llm.ts`
- `src/trigger/search-agent.ts`
- `src/trigger/wiki-agent.ts`
- `wiki/sources/sarcos-official-website.md`
- `wiki/sources/sword-health-official-website.md`
- `wiki/index.md`
- `wiki/indexes/sources.md`

## Handoff / Next Step

- Checks: `rg` found no Trigger.dev v3/deprecated job/wait patterns in runtime slice; `npx eslint src/trigger/*.ts api/trigger-token.ts` passed; `npm run lint:wiki` passed with 0 errors/0 warnings; `npm run build` passed and built 636 wiki entries; `npm run report:source-coverage` passed with 0 errors and all 197 source records cited.
- Residual risk: full `npm run lint` still reports unrelated existing lint debt in `.trigger/tmp`, `BubbleGraph.tsx`, `page-transitions.tsx`, and `MarkdownLayouts.tsx`.
- Next: split write-capable wiki drafting into an authenticated/admin-only task or review queue before enabling `SEARCH_AGENT_WRITE_ENABLED` / `WIKI_AGENT_WRITES_ENABLED` in production.

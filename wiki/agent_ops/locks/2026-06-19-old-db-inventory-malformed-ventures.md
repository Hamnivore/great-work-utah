# Work Claim: Old DB Inventory - Malformed Ventures

**Status:** done
**Agent:** Codex boss
**Started:** 2026-06-19 11:03 MDT
**Updated:** 2026-06-19 11:12 MDT

## Goal

Run a real boss-agent slice for the Old DB Inventory workstream: inventory malformed `wiki/ventures/*-md` files, identify likely duplicates or migration targets, create a compact migration report, and improve the boss-agent workflow where friction appears.

## Broad Edit Zone

- `docs/old-db-migration-malformed-ventures.md`
- `wiki/agent_ops/leader-agent-roadmap.md`
- `wiki/agent_ops/locks/2026-06-19-old-db-inventory-malformed-ventures.md`

## Read-Only Context

- `wiki/ventures/`
- `legacy_wiki/`
- `wiki/agent_ops/locks/`
- `wiki/agent_ops/index.md`
- `docs/wiki-seed-worklist.md`

## Known Avoid Zones

- Public wiki content pages
- Shared integration files unless only noting a required handoff
- Files claimed by active venture/content agents

## Subagents

- Claim hygiene explorer: inspected active/stale locks and collision risk.
- Malformed venture explorer: inspected malformed venture files, proper public duplicates, and likely legacy source paths.

## Progress

- Opened boss claim and launched two read-only subagents.
- Created `docs/old-db-migration-malformed-ventures.md`.
- Folded subagent findings into the manifest.
- Found workflow friction: stale `active` claims, inconsistent completion statuses, `TEMPLATE.md` false-positive active status, and timestamp convention drift.
- Updated the lock template, locks README, and roadmap to make future boss scans cheaper.
- Ran `npm run lint:wiki`: failed on existing wiki debt, not this report. Notable errors: broken links to retired `conotoxins-prialt.md` and `wordperfect-novell.md`, plus missing `Updated` headers in several `wiki/work/` pages.
- Ran `npm run build:wiki`: sandbox failed on `tsx` IPC, reran with approval, succeeded and rebuilt `src/data/generated/all.json`.

## Files Changed

- `wiki/agent_ops/locks/2026-06-19-old-db-inventory-malformed-ventures.md`
- `docs/old-db-migration-malformed-ventures.md`
- `wiki/agent_ops/leader-agent-roadmap.md`
- `wiki/agent_ops/locks/TEMPLATE.md`
- `wiki/agent_ops/locks/README.md`
- `src/data/generated/all.json`

## Handoff / Next Step

- Migration Factory should claim the legacy-backed merge group first: `domo`, `instructure`, `myriad-genetics`, `pluralsight`, `qualtrics`.
- Source Recovery should claim source-first reviews: `ancestry`, `bamboohr`, `cotopaxi`, `lucid-software`, `overstock-com`, `skullcandy`, `vivint-smart-home`.
- `novell-md` should likely be retired after comparison with `wiki/work/wordperfect-and-novell.md`.

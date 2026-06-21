# Leader Agent Roadmap

**Status:** Draft
**Confidence:** Medium
**Updated:** 2026-06-19

Short coordination map for migrating the old corpus into the new wiki, fixing missing sources, and running many concurrent boss agents.

## Edit Rules

- Keep this file short. Put details in claim files or reports.
- Many bosses may work at once. Each boss claims a broad zone, not exact files.
- Subagents discover exact files as they work, then report files touched.
- Claim files with `done`, `complete`, `completed`, or `superseded` status are history; prefer `done` for finished claims and `superseded` for replaced claims. If a claim has contradictory statuses, read its handoff before treating it as active.
- Do not edit another active boss's section except to note a dependency or conflict.
- Shared files like `wiki/agent_ops/index.md`, `RUN_LOG.md`, `DECISIONS.md`, and `docs/wiki-seed-worklist.md` are coordinator-owned during crowded runs.
- Use `wiki/agent_ops/locks/TEMPLATE.md` for boss claims and subagent handoffs.

## Boss Loop

1. Read the wiki skill instructions before acting; every boss and subagent doing wiki work should follow that skill.
2. Read active claims in `wiki/agent_ops/locks/`.
3. Pick a ready workstream or slice that does not obviously collide.
4. Create a claim: goal, broad edit zone, read-only context, known avoid zones.
5. Launch as many subagents as are genuinely useful. Large slices usually need many.
6. Tell subagents doing wiki work to read and follow the wiki skill too.
7. Work alongside subagents on the critical path; do not just delegate from an ivory tower.
8. Stay close to subagents: review results, redirect, integrate, and spawn follow-up workers when needed.
9. Drive the slice to completion unless blocked; avoid stopping at plans or partial inventories.
10. Track accomplishments in the claim as subagents return.
11. Run relevant checks: `npm run lint:wiki`, `npm run build:wiki`, source coverage, graph/link checks, app build.
12. Summarize outcome here only when status changes or a major slice completes.
13. After a concurrent wave, run a Command Center integration pass before launching the next wave: close or supersede stale claims, rebuild app and skill indexes, run lint/source coverage, and publish one breakage report.

## Workstreams

1. `[ready]` **Command Center** — Coordinate claims, merge shared files, refresh counts, resolve conflicts.
2. `[ready]` **Old DB Inventory** — Inventory `legacy_wiki/` and `src/data/generated/all.json`; classify each item for migration.
3. `[ready]` **Migration Factory** — Convert legacy content into `wiki/{ventures,work,helpers,resources,people}`; merge or retire duplicates and malformed pages.
4. `[ready]` **Source Recovery** — Create/repair `wiki/sources/`; audit pages for missing evidence, weak claims, and missing `Relates: cites`.
5. `[ready]` **Source Technology** — Build source coverage, scraper, PDF/text capture, browser/AI-browser, and source-debt reports.
6. `[ready]` **Wiki Skill Compliance** — Align Great Work with wiki skill v0.2.0: `WIKI.md`, indexes, possible `raw/`, graph, stats, lint.
7. `[ready]` **Judgment Layer** — Build `guides`, `matches`, and `answers` from sourced fact pages; criteria and caveats required.
8. `[ready]` **Application Data Contract** — Make `scripts/build-wiki-index.ts` and `src/lib/*` consume the new public wiki ontology.
9. `[ready]` **Ask / Runtime** — Move Trigger.dev code to v4 SDK, harden Ask, saved-answer filing, source-recovery tasks, and write safety.
10. `[ready]` **Frontend Wiki UX** — Browse/render new wiki types: ventures, helpers, resources, work, people, guides, matches, answers, sources.

## First Concurrent Wave

Start together: Old DB Inventory, Source Technology, Migration Factory, Source Recovery, Application Data Contract.

Then launch: Judgment Layer, Ask / Runtime, Frontend Wiki UX, Command Center integration pass.

## Handoff Format

```markdown
- YYYY-MM-DD: Claimed `<claim-file>`. Launched <subagents>. Completed <outputs>. Checks: <commands/results>. Blockers: <gaps>. Next: <one follow-up>.
```

## Decisions

- **Resolved:** Use the wiki skill source-capture model: immutable captures live in `raw/`; wiki pages cite/summarize them. Capture verbatim when possible, use digest only when capture is not practical, and mark unreachable sources as uncaptured.
- **Resolved:** Source strength is editorial judgment. Direct sources are usually strong and indirect sources are usually useful, but quality, specificity, and trustworthiness matter more than a rigid direct/indirect rule.
- **Resolved:** Legacy entries are being retired. App searchability for legacy content is not important except as a temporary migration aid.

## Roadmap Log

- Keep detailed logs in claim files. The roadmap log should stay tiny.
- 2026-06-19: Command Center audit found stale active claims, lint failures, source-token drift, stale indexes, and roadmap-log bloat. See `wiki/agent_ops/concurrent-boss-wave-audit-2026-06-19.md`.
- 2026-06-19: Claimed `wiki/agent_ops/locks/2026-06-19-1600-judgment-layer-people-and-resource-matches.md` (resumed). Launched 3 subagents + boss integration. Completed 5 `wiki/people/` bios (Bearss, Skonnard, Smith/IMSAR, Solzbacher, Testa) and 5 venture↔resource matches (Halia/Coreform/Blackrock↔Nucleus Fund; Curza↔UTIF; Inherent↔BIOHive). Checks: lint 0 errors, build 534 entries, people=5, matches=17. Blockers: BIOHive resource still stub/low-confidence; Chad Testa CEO title uncaptured in official source. Next: person↔venture matches; BIOHive editorial refresh.
- 2026-06-19: Claimed `wiki/agent_ops/locks/2026-06-19-migration-factory-defense-gaps.md`. Migrated 6 defense-and-security legacy ventures (wasatch-ionics, l3harris-salt-lake, 309th SWEG, xandem, uttr, vector) via 2 parallel subagents + boss cross-link integration; fixed 3 lint orphans from parallel health work (3helix, inherent-biosciences, sethera-therapeutics). Checks: lint 0 errors, build 494 entries, ventures=67. Next: health-and-longevity gap batch or source records for new defense pages. Added 5 match pages (Halia↔Maschoff Brennan, Fortem↔Parsons Behle, BioFire↔RQM+ detailed, Recursion↔Wilson Sonsini, BambooHR↔NOW CFO) using 3 parallel subagents + boss parallel writes. Audited and indexed 8 pre-existing pages; resolved BioFire duplicate. Checks: lint 0 errors, build 454 entries, matches=12. Next: people pages (0 currently); venture↔resource matches (Halia/Nucleus, SBIR-eligible ventures/BBCetc).
- 2026-06-19: Claimed `wiki/agent_ops/locks/2026-06-19-judgment-layer-matches.md`. Created `wiki/matches/` directory and wrote 8 match pages across medical-device regulatory (Blackrock/RQM+), cleantech IP (Fervo/Maschoff Brennan, Zanskar/Maschoff Brennan), pharma IP (Recursion/Workman Nydegger, Halia/Workman Nydegger), defense IP (Fortem/Maschoff Brennan), IVD regulatory (BioFire/RQM+), and finance ops (PassiveLogic/NOW CFO). Two prior-session pages also present (Fortem/Parsons Behle, Halia/Maschoff Brennan). Checks: lint 0 errors, build 452 entries, matches=10. Next: people pages (0 currently) to enable person↔venture matches; IP routing guide.
- 2026-06-19: Claimed `wiki/agent_ops/locks/2026-06-19-source-recovery-malformed-ventures.md`. Completed full malformed-venture Source Recovery slice: all 14 inventory items resolved (9 source-first conversions, 4 legacy merges, novell retired, myriad venture/work split). Boss created owlet venture page; Myriad subagent added venture + source. Checks: lint 0 errors; build:wiki OK (469 entries). Blockers: none. Next: wiki `-page` suffix lint debt or Application Data Contract.
- 2026-06-19: Claimed `wiki/agent_ops/locks/2026-06-19-source-recovery-malformed-ventures.md`. Completed eight source-first malformed venture conversions (ancestry through vivint) with three subagents; 10 source pages; only `myriad-genetics-md` remains.
- 2026-06-19: Claimed `wiki/agent_ops/locks/2026-06-19-roadmap-shakedown.md`. Completed a boss-loop shakedown and tightened statuses, claim-reading, and resolved-decision wording.
- 2026-06-19: Claimed `wiki/agent_ops/locks/2026-06-19-1215-source-recovery-malformed-batch1.md`. Completed bamboohr and owlet-baby-care conversions with two subagents; wiki lint 0 errors, build 469 entries. Blockers: none. Next: ancestry/cotopaxi/lucid source-first batch.
- 2026-06-19: Claimed `wiki/agent_ops/locks/2026-06-19-migration-factory-legacy-merges.md`. Completed domo/instructure/pluralsight/qualtrics legacy merges; four subagents + boss verification; deleted malformed stubs; checks pass for merge group.
- 2026-06-19: Claimed `wiki/agent_ops/locks/2026-06-19-old-db-inventory-malformed-ventures.md`. Completed malformed venture inventory, launched two subagents, wrote `docs/old-db-migration-malformed-ventures.md`, and tightened lock conventions.
- 2026-06-19: Claimed `wiki/agent_ops/locks/2026-06-19-1300-migration-factory-myriad-and-gaps.md`. Closed malformed-venture migration (Myriad verified, zero `*-md` stubs); migrated coreform, culmination-bio, intan-technologies, epitel with two subagents; lint 0 errors, build 446 entries. Blockers: none. Next: legacy `places_you_can_work` gap batches.
- 2026-06-19: Claimed `wiki/agent_ops/locks/2026-06-19-migration-factory-final.md`. Verified all malformed venture files migrated; launched filename-fix subagent (16 source renames, 24 reference updates); confirmed Application Data Contract complete (build-wiki-index.ts + types.ts updated). Checks: lint 0 errors, 0 warnings; build clean.
- 2026-06-19: Claimed `wiki/agent_ops/locks/2026-06-19-source-recovery-uncited.md`. Ran 3 parallel source-recovery subagents (Groups A/B/C: 17 source records, 17 Relates edges). Boss fixed 4 orphan source citations, removed 2 duplicate source records, resolved 2 remaining uncited pages (telescope-array, pons-fleischmann). Coverage: source records cited 94% → 100%, uncited pages 7 → 1, Relates:cites 5.1% → 11.1%, 494 entries built. WIKI.md count updated 455 → 494.
- 2026-06-21: Claimed `wiki/agent_ops/locks/2026-06-21-source-recovery-final-four.md`. Boss integration pass: confirmed concurrent agents resolved final 4 broken source links (great-salt-lake-usgs, nsa-utah-data-center, tellus, wave-inc) and renamed 2 venture files (tellus-networked-sensor-solutions → tellus, wave-wireless-vehicle-electrification → wave-inc). Refreshed skill index; committed accumulated concurrent-wave changes. Checks: lint 0 errors, build 604 entries, sources=194. Next: Ask/Runtime or Frontend Wiki UX.

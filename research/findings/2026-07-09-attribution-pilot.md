# Findings: E9 — attribution pilot (energy domain)

**Date:** 2026-07-09 · **Conventions:** `design/placement-conventions.md` · **Generator:** `harness/gen-views.mjs` (output `harness/views/`, gitignored) · **Scope:** 39 candidate pages judged, 22 attributed with `**Domain:**` / `**Region:**` / `**Needs-reviewed:**` headers by two Sonnet agents following the conventions doc.

## What the pilot produced

- 22 pages now carry real metadata (energy primary: 14; energy secondary: 8). Ventures with needs-sections got `**Needs-reviewed:**` anchors; work/ pages correctly got none.
- `harness/views/energy.md` — the first metadata-generated sector hub (7KB): primary players with regions, "who they need right now" with review dates, and secondaries demoted to an "Also relevant (primary domain elsewhere)" section. This is the H3-as-view artifact the hierarchy synthesis called for.
- `harness/views/by-region.md` — the first cross-cutting facet view, free, from the same metadata.

## Measured: keyword classification vs. attributed metadata

On the 22 attributed pages: 0 keyword false-positives, 1 false-negative (Great Salt Lake — a place page with no energy keywords in its focus line). **The keyword classifier's real failure is ranking, not detection: 6 of its 21 "energy" pages are actually secondary members** (CleanJoule, EPS, Hypercraft, Wasatch Ionics, MOXIE, Pons–Fleischmann) that keywords count as full members — the precise mechanism by which single-weight tagging dilutes indexes. *Caveat: the candidate list itself came from keyword sweeps, so this comparison cannot see false-negatives outside the sweep; the false-negative rate is a floor, not an estimate.*

## The conventions doc worked — and failed exactly where probes predicted

The strongest single result: **the two attributors ruled opposite ways on the same entity class** — CleanJoule → aerospace-defense primary, the SAF work page → energy primary; both are "fuel sold to aviation." A conventions gap converts directly into corpus inconsistency at a measured rate of one collision per ~20 pages attributed. Both agents also *named* their gaps precisely (the ambiguity-report protocol works). Seven gaps surfaced and were adjudicated into conventions v1.1 the same day:

1. Energy carriers sold into another sector → customer sector is primary, energy secondary (SAF page corrected to match).
2. Nuclear ≠ energy by default (power → energy; isotopes → health-bio; deterrent → aerospace-defense).
3. Downstream materials (copper, magnesium): secondary only if a stated business line.
4. Debunked technologies (Pons–Fleischmann): primary = the lens the page is written through; claimed sector goes secondary.
5. In-state dual-site region: field site first, HQ in parentheses.
6. Place/topic pages (Great Salt Lake): a legitimate atom; area-label regions allowed.
7. Unknown region: `unknown (Utah)`, lint-flagged; people take regions/out-of-state format by analogy.

## Determinism re-probe (2 agents, conventions v1.1, original 3 bundles)

Compared to the pre-conventions probes (which treated every unstated convention as a coin flip):

- **Hand-edit fan-out collapsed to zero.** Both agents, all three bundles: "which nav docs must a human edit?" → *none*, quoting the generated-views principle. The original probes required 2–9 hand-edits per bundle across schemas. The biggest decay vector (forgotten index updates) is eliminated *by construction*.
- **VoltSafe: fully deterministic.** Identical path, identical headers, zero reported gaps, both runs.
- **Alan Kay: headers deterministic, slug not.** Both derived `work/` page + `computing` + correct *omission* of Needs-reviewed from the template rule (a subtle inference, made correctly twice). Slugs differed (`alan-kay-1970-…` vs `university-of-utah-oop-…-1970`) — both flagged the missing naming rule; both flagged the subjective people-page threshold.
- **Wasatch: still ambiguous — but now *convergently* ambiguous.** Both runs independently identified the identical two-layer gap: the nuclear tiebreaker doesn't cover RTGs/space power, and the dual-business fallback chain (revenue → Utah footprint) exhausts with no escape hatch — one noted that Region has an escape hatch while Domain doesn't, a fair design critique. Neither guessed confidently; both flagged for review. **Convergent, honest ambiguity is the correct failure mode** — the schema now fails loudly instead of silently.

All three residual gaps were adjudicated into conventions v1.2 same-day: RTG/space-power rule; dual-business final fallback (`**Domain-flagged:** review` escape hatch mirroring Region's); achievement slug pattern + the two-link rule for people pages (objective, grep-checkable).

## E9 verdict

The views-over-attributed-storage architecture behaves as designed at pilot scale: metadata placement is deterministic where conventions speak, convergently and *loudly* ambiguous where they don't, hand-maintained navigation is gone, and each ambiguity found converts into a one-line convention within the same day. The conventions doc is a living rulebook whose gaps are discovered by the same probe protocol every time — this loop (attribute → collect ambiguity reports → adjudicate → re-probe) is the wiki's constitutional process, and it works.

Remaining before full rollout: n is small (2 attributors, 2 re-probe runs, one domain); the loop should run once more on a second domain (health-bio or aerospace-defense, which the energy pilot showed are entangled with energy) before attributing all ~390 fact pages.

## Costs

Attribution ran ~90K tokens per ~20-page batch (agents read every page fully). Extrapolated to the remaining ~370 fact pages: roughly 8–10 batches — cheap enough to do in one pass when the conventions stabilize.

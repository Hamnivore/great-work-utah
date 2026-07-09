# Wiki hierarchy — audit and restructuring proposal

**Date:** 2026-07-09 · **Status:** the derived document layer **passed round 3** (`findings/2026-07-09-round3-hierarchy-and-contribution.md`): needs.md used 4/4 runs, previously-missed gem found 2/2, matches/answers unfetched with no quality loss, cost down. Cleared to promote the derived layer into the real build; the expensive rebuild (step 3 below) is now justified by data.

## Goals (maintainer directives)

1. Gems must be easy to find — reliably, by cold agents.
2. The structure should be good for *compacting* knowledge as it grows.
3. Restructuring cost is acceptable, any number of times. Test with reorganized documents first; expensive rebuild later.

## Audit of the current categories (2026-07-09)

| Category | Pages | Verdict |
|---|---|---|
| ventures | 117 | Sound. Strong section schema (Summary/Impact/What They Need Now/Open Questions/Evidence on ~117/117 pages) — this schema is the wiki's biggest structural asset. |
| resources | 218 | Sound but uneven: some entries are directory-import stubs marked low-confidence. Fine — confidence grades carry the signal. |
| sources | 197 | Sound. Evidence layer, referenced by everything. |
| work | 26 | Sound and distinctive (the proof-of-possibility layer). |
| people | 12 | Thin but legitimate. Growth area. |
| helpers | 12 | Sound. |
| guides | 7 | Sound — this is where taste lives. Undergrown relative to its importance. |
| **matches** | 37 | **Does not earn its existence.** Contents are (a) founders "matched" to their own companies (josh-james-x-domo, ryan-smith-qualtrics-x-qualtrics — a match between a founder and the company he founded), (b) speculative venture↔law-firm pairings graded "Strength: Plausible" (halia-therapeutics-x-maschoff-brennan), (c) demo artifacts (tim-latimer-x-*) that cost round-1 test agents wasted fetches. Zero pages match an actual user to an opportunity — which was the category's stated purpose. |
| **answers** | 10 | **Mostly demo relics.** 7 of 10 are synthetic-persona artifacts ("Resources for Priya… **Synthetic persona**… see docs/personas.md" — they even link outside the wiki). 2 are genuinely durable Q&A (where-to-find-sbir-help-in-utah, who-helps-with-government-contracting-in-utah). 1 is marketing (why-this-is-better-than-linkedin). |

## Proposal

### Layer 1 — facts (keep, strengthen schema)

`ventures/ people/ helpers/ resources/ work/ sources/`. The section schema (`## Summary`, `## Impact`, `## What They Need Now`, `## Open Questions`, `## Evidence`, `**Focus:**`, `**Confidence:**`) is **load-bearing**: derived indexes are generated from it. Lint must enforce it; extending it (e.g., a `**Needs:**` one-liner header) is the kind of restructuring that's always worth it.

### Layer 2 — judgment (consolidate into guides/)

- **Dissolve `matches/`.** The one useful thing agents did with it (see how a recommendation is argued) becomes a guide (`guides/how-to-argue-a-match.md`) with one worked example inline. Real relationships ("X's IP counsel is Y") belong on the entity pages as `**Relates:**` edges — they're facts, not judgment. Celebrity-pair case studies (josh-james-x-domo) fold into the person/venture pages' existing content. Nothing of value is lost; 37 pages of category noise disappear.
- **Prune `answers/`** to durable, person-independent Q&A (keep 2, promote to guides or a `faq` section of guides; delete 7 persona demos + 1 marketing page — they reference non-wiki files and mislead agents into thinking they're about real people).
- `guides/` becomes the single judgment surface. Growth area: audience-scoped gem lists ("if you're a drilling engineer, the three pages worth your time") are guides.

### Layer 3 — derived (generated, never hand-edited, always current)

- `indexes/needs.md` — every venture's What They Need Now, one line each (the hiring view; 30KB).
- `indexes/<category>.md` — enriched one-liners: title · focus · needs-clause · confidence.
- `indexes/index.md` (master) — the three layers, explained in one screen.
- Later candidates: `open-questions.md` (what the wiki wants to know — doubles as a contribution menu), `tags.md`.
- `/wanted.md` — generated from contribution notes; the standing to-do list of the commons.

**Why this also serves compaction:** derived indexes are recomputed, so compacting or splitting fact pages never breaks the navigation layer; the schema gives compaction a stable target shape; and judgment pages cite fact pages rather than duplicating them, so facts compact without orphaning judgment.

### What "gem-findable" means operationally

A gem is findable when a cold agent reaches it through **any** of: (1) its needs/focus line in a derived index (recall), (2) a guide that names it for an audience (taste), (3) graph edges from adjacent pages (context). The needs index provides (1) mechanically. (2) requires editorial guides — humans or strong agents write those. (3) requires the `Relates`/`See Also` discipline the schema already has.

## Sequencing

1. ✅ Build derived layer as harness overlay; test cold (round 3, in progress).
2. If the document layer wins: generate derived indexes into `wiki/indexes/` for real (script in build), rewrite `wiki/index.md` as the layered master.
3. Then the expensive rebuild: dissolve matches/, prune answers/, fix inbound links (measured 2026-07-09: 27 non-index pages link into `matches/`, 11 into `answers/` — mostly See Also lines; ~40 pages to touch), lint schema, regenerate.
4. Only after hierarchy proves itself: search tooling to native-parity (grep endpoint — see `findings/2026-07-09-search-vs-grep.md`).

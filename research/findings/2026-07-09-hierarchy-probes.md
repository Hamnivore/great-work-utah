# Findings: six hierarchy redesigns — structural metrics + placement probes

**Date:** 2026-07-09 · **Designs:** `design/hierarchy-redesigns.md` · **Generator:** `harness/gen-hierarchies.mjs` (overlays in `harness/hierarchies/`, gitignored) · **Probe protocol:** `harness/placement-probe.md`

Per the testing philosophy: these tests surface *why* a schema fails, they don't crown winners — the 650 existing pages were written for the type tree, and every overlay here is a mechanical approximation of what a curator would build. Read the failure *kinds*, not the scores.

## Structural metrics (deterministic)

| Schema | Nav docs | Nav KB | Page coverage | Gems linked (of 4) |
|---|---|---|---|---|
| H2 facets | 22 | 340 | 393/393 | 4 |
| H3 domain tree | 10 | 271 | 393/393 | 4 |
| H4 journeys | 5 | 88 | 316/393 | 4 |
| H5 MOC graph | 13 | 159 | 381/393 | 4 |
| H6 opportunity ledger | 2 | 52 | **150/393** | **2** |
| H7 codex | 10 | 537 | 393/393 | 4 |

(H1 control — current type tree + derived indexes — for comparison: 12 nav docs, ~180KB incl. needs.md, 393/393, 4/4.)

What the numbers say:

- **H6 orphans 62% of the wiki.** The opportunity atom has no home for context, history, or orgs without current openings — structural confirmation of the predicted failure. It also missed 2 of 4 ground-truth gems (Utah FORGE is a `work` page; it isn't an "opening"). H6 is a *view*, not a schema.
- **H4 orphans 20%.** Anything without a journey is invisible; sources, people, and general context fell out. Also a view, not a schema.
- **H2's facet explosion is real but bounded** (22 docs, 340KB) — and every doc is generated, so the cost is bytes, not maintenance.
- **H7's navigation *is* the content** (537KB) — cheap to generate, expensive to read cross-domain.
- **Cross-domain reality:** the keyword classifier put 349/393 fact pages in 2+ domains. The number is inflated by loose regexes (a tooling confound — `culture-place` absorbed 250 pages), but the direction is unavoidable: ACT Aerospace is aerospace *and* materials *and* manufacturing; Wasatch-style entities are the norm, not the edge case. **Any schema requiring one page = one domain will misfile constantly.** Domains must be overlapping views over flat storage — Wikipedia's architecture, rediscovered from our own data.

## Placement probes (1 cold agent per schema + H1 control, 3 fact bundles each)

Protocol: `harness/placement-probe.md`. Bundle 1 = clean venture (VoltSafe); bundle 2 = cross-cutting entity (Wasatch Isotope Works: FDA medical + NRC defense/space); bundle 3 = historical achievement (Alan Kay 1970). **Method caveats:** n=1 per schema — the per-schema details are existence proofs; only the *convergent* findings below count as robust. Two probes (H5, H7) were mildly contaminated by real repo filenames visible in their environment, which biased their path choices (both filed ventures under `wiki/work/`); their ambiguity findings are unaffected.

Distinctive failure each schema exposed:

- **H1 (control, type tree + derived indexes):** placement fully deterministic on all 3 bundles — its strength as a writing target. Strains found: no way to represent an entity with two businesses/two needs-tracks; the uniform section schema produces forced boilerplate on historical pages ("What They Need Now" on a 1970 event); flat 300-line indexes and an undifferentiated needs.md are the predicted scale breaks; no backlink integrity checking.
- **H2 (facets):** the domain facet forces "what it serves" vs. "what it makes" with no rule; multi-tagging is honest but **dilutes every index it touches — no primary/secondary weighting**; fixed `need` vocabulary can't express real categories (NRC licensing ≠ business-ops); no relationship layer at all; per-page update fan-out of 6–9 docs (all generated, so cost is bytes not labor).
- **H3 (domain tree):** the single-home rule has **no tiebreaker** (customer? product? discipline?) and the cross-cutting entity makes every choice arbitrary; findability then depends on hand-maintained cross-links that are "easy to forget and easy to let drift"; hubs can't hold "the whole sector on one page" at 2×; no orthogonal axis (region, time, type) exists at all.
- **H4 (journeys):** hubs are **write-contention hot files** (one entity = up to 4 lines in find-work.md); "right now" has no expiry mechanism, so the core promise (currency) rots by default; one grouping dimension is not enough; orphaning is silent — findability is a manual editorial act per page.
- **H5 (MOC graph):** curator attention per map is the bottleneck (~108 pages/map at 1,300); the 2-hop reachability lint **becomes gameable — "reachability and discoverability quietly decouple"**; cross-cutting pages multiply the edit surface combinatorially; the probe predicted the schema would have to concede structure back (sub-sections inside maps).
- **H6 (opportunity ledger):** opening granularity is undefined (per role? per regulatory track? per company?) so contributors will fragment inconsistently; `/capital/` scope forks (sources vs. events); **history has no home** — "silently demoted to supporting evidence"; staleness management is the primary maintenance load and has no described process.
- **H7 (codex):** multi-domain entities triple-duplicate into generated megafiles with no primary-inclusion rule; **no master answer to "which codex is X in?"** without already knowing the taxonomy; cross-cutting facets (region, regulatory, stage) have no home; codex growth is uneven and there's no split mechanism; regeneration fan-out grows super-linearly with cross-domain density.

## Synthesis — what all seven probes agree on

Six findings appeared independently in nearly every probe, regardless of schema:

1. **The cross-cutting entity is the norm, not the edge case.** Every schema strained on Wasatch Isotope Works; the structural classifier said the same thing about the real corpus. Any design that requires one page = one home fails on contact. Multi-membership needs *weighted* membership (primary/secondary) or every index it appears in gets diluted.
2. **Hand-curated navigation is the universal scaling bottleneck.** Every probe, unprompted, asked for the same three machines: generated indexes, generated backlinks/orphan detection, and automated staleness handling. Curation only survives where it's bounded (a handful of guides), never as the load-bearing findability mechanism.
3. **Flat one-line index docs stop working near ~100 entries.** Generated indexes must sub-group (by subdomain, role, stage) to stay scannable — "generated and current" is not the same as "findable."
4. **Typed content needs typed page schemas.** "What They Need Now" on a 1970 event is boilerplate; needs-claims need review-by dates; evidence records aren't ventures. One uniform template quietly degrades corpus quality.
5. **The atom conventions must be written down.** Person vs. event vs. program (bundle 3 stumped every schema); opening granularity (H6); source granularity (H1); region granularity (H2). **A schema is the directory layout *plus* the placement conventions — the probes treated every unstated convention as a coin flip, and coin flips are how wikis rot.**
6. **One navigation axis is never enough.** Region, regulatory regime, stage, and time recurred as orphaned facets in every single-axis design. Multiple simultaneous views are mandatory — which is Wikipedia's architecture (flat storage, categories + navboxes + lists + links as parallel overlays), rediscovered from our own probes.

### The architecture this points to (hierarchy v2, "views over attributed storage")

- **Storage:** keep pages where they are (typed dirs as a storage convention; URLs never move — moving 650 files buys nothing and breaks the web).
- **Attribute the pages** (this is the expensive rebuild worth doing): `**Domain:** <primary>, <secondary…>`, `**Region:**`, review-by dates on needs-claims, per-type section templates, and a written placement-conventions doc (tiebreaker: domain = sector served; atom rules for person/event/program; granularity rules).
- **Every hierarchy becomes a generated view:** domain hubs (H3), needs/opportunity board with expiry (H6), facet indexes with primary-weighted placement (H2), thin journey hubs (H4), optional per-domain codex digests (H7). Views are cheap; only metadata quality is expensive — and metadata lives on the page, where contributors already write.
- **Curation only in guides** (the bounded H5 layer), pointing into the generated views.
- **Lint as the schema's immune system:** metadata completeness, backlink integrity, orphan detection, stale-needs flagging.

This also answers "which of the six wins": **none as a storage schema, most of them as views.** The six redesigns turned out to be six *views* fighting over one storage slot that none of them should occupy.

### Next

1. Draft the placement-conventions doc + per-type templates (`design/`), spec the metadata headers.
2. Pilot the attribution on one domain's pages (~50 pages, energy) + regenerate views from real metadata instead of keyword classification; re-run one navigation probe and one placement probe against the piloted views (with repetition on the load-bearing comparison).
3. Then the matches/answers dissolution rides along with the attribution rebuild (same editing pass).

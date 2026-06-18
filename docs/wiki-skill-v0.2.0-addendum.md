# Great Work × Wiki Skill v0.2.0 — Addendum

Great Work is built on the same Karpathy-style LLM-wiki pattern as the shared `wiki` skill (now v0.2.0). But Great Work is a *product over a wiki*, not a general research KB, so it intentionally diverges from the base skill in places. This addendum splits those divergences into two lists:

- **Part 1 — Keep as Great Work extensions.** Ways Great Work is unique *and better for its use case*. These stay; the base skill should not overwrite them. If anything, the base skill could learn from some.
- **Part 2 — Migration plan.** Ways Great Work is unique *in a worse way* — gaps the v0.2.0 skill already solves. Adopt these.

See [wiki-architecture.md](wiki-architecture.md) for the existing design and the base skill's `SKILL.md` for v0.2.0 (size discipline, index sharding, BM25 search, relational graph).

---

## Part 1 — Keep as Great Work extensions (unique & better)

These are deliberate, product-driven choices. Preserve them on top of the base skill.

1. **Bold-prefix headers (`**Status:** Draft`) instead of blockquote (`> Status:`).** Chosen so non-technical Utahns can edit pages without learning YAML or blockquote syntax. Lower edit barrier is a product requirement here. *Keep.* (The base skill's v0.2.0 scripts assume the `>` convention — see Part 2 for the adapter.)

2. **Fact pages vs judgment pages.** `ventures/ people/ helpers/ resources/ work/ sources/` (describe) are kept separate from `guides/ matches/ answers/` (recommend). This "entities describe; guides/matches/answers recommend" split is a *sharper ontology* than the base skill's flat topic dirs, and it's exactly what a matching product needs. *Keep* — and it's a candidate to upstream into the base skill as an optional page-type layer.

3. **Named visual layouts + editorial overlay.** `**Layout:** cover-story|magazine|postcard|…` plus `**Hero:**`/`**Pull:**` merged by slug in `build-wiki-index.ts`. The base skill has no presentation layer because it isn't user-facing; Great Work renders to end users. *Keep.*

4. **No universal entity tiers; audience-scoped ranking.** Rankings live only in `guides/`, `matches/`, `answers/` with explicit audience + criteria — never as a global score on an entity page. This is a genuine product insight (different users need different rankings). *Keep.*

5. **Two-tree build with editorial overlay.** Canonical public `wiki/` + agent-only `legacy_wiki/` seed (symlink), merged by slug in the build, with the rule "never expose internal/legacy provenance publicly." A real migration/seeding pattern the base skill doesn't model. *Keep.*

6. **End-user client-side search (Fuse.js over `all.json`).** This is a *different thing* from the skill's agent-time BM25 `wiki_search.py`: it's a shipped product feature for site visitors, not an agent retrieval tool. *Keep* — but see Part 2 for the scaling ceiling.

7. **Domain operation vocabulary.** Ingest / **Ask** (article generation, not chat) / **Match** / Lint / Evolve. The Ask and Match operations are domain specializations of the base QUERY. *Keep.*

8. **`agent_ops/` coordination.** `locks/` social-lock files, `RUN_LOG.md`, `DECISIONS.md` for multi-agent work. *Keep* (richer than the base skill's single-coordinator rule).

---

## Part 2 — Migration plan (unique-worse → adopt from v0.2.0)

These are places where Great Work is behind the base skill. Each item maps to a v0.2.0 capability. Because Great Work keeps bold-prefix headers (Part 1 #1) and a build pipeline, the work is mostly *adapting* the skill's tooling to Great Work's conventions, not changing Great Work's content format.

### M1. Size discipline — adopt the caps
The architecture doc has no page-size limits. As fact pages accrete evidence, some will bloat and become expensive to read/render.
- **Action:** adopt soft 400 / hard 800-line caps; add a one-concept-per-page rule to `wiki-architecture.md`. Run a size check (see M3) over `wiki/` and split offenders, leaving a summary + See Also.
- **Maps to:** v0.2.0 *Size Discipline* + `references/scaling-playbook.md`.

### M2. The `all.json` + Fuse.js ceiling — shard the generated index
Today `build-wiki-index.ts` compiles *every* entry into one `src/data/generated/all.json` shipped whole to every browser, and the index is a single catalog. This is the exact bottleneck v0.2.0's sharding addresses, but on the *generated artifact* rather than the markdown.
- **Action (near-term, fine for hackathon scale):** nothing — it's small today.
- **Action (as it grows):** split `all.json` per fact-type (`ventures.json`, `helpers.json`, …) loaded on demand; OR move search server-side. Keep Fuse.js for the per-shard client search. Mirror the skill's "shard at ~150 entries / ~300 index lines" trigger on the generated data.
- **Maps to:** v0.2.0 *Index Sharding* (applied to the build output).

### M3. Lint is aspirational — wire up a real linter
`wiki-architecture.md` lists lint checks (missing H1, missing required header lines, stale dates, broken links, orphans, private-contact leakage) but no script implements them; the base skill ships a tested `wiki_lint.py`.
- **Action:** port `wiki_lint.py` with a **bold-prefix header parser** (Great Work uses `**Key:** value`, not `> Key:`). The parsing logic in `scripts/build-wiki-index.ts` (`parseBoldPrefixHeader`) already does this — reuse its convention. Add Great-Work-specific checks: required `**Status:**`/`**Updated:**`, fact-vs-judgment placement, "judgment page cites a fact page," and the private-contact-info / no-legacy-provenance guardrails. Call it from `npm run build:wiki` (or pre-commit) so broken pages fail the build.
- **Maps to:** v0.2.0 *LINT* + `scripts/wiki_lint.py`.

### M4. No graph — make "explainable matching" relational
Great Work's whole pitch is explainable matching (who helps whom, who's suited for what), yet relationships live only as prose in `matches/`/`guides/` and informal cross-links. This is the strongest fit for v0.2.0's graph layer.
- **Action:** adopt the graph layer with Great-Work-typed edges. Nodes = fact pages (ventures/people/helpers/resources/work). Edges = the judgment layer made explicit: `helps` (helper→venture), `suited-for` (person→venture/work), `recommends`/`cites` (guide/match → fact page). Extract from `## See Also` + a bold-prefix relation line (the analog of `> Relates:`, e.g. `**Relates:** helps [Recursion](../ventures/recursion.md)`). Then "who helps medical-device founders?" and "shortest path from this engineer to a venture" become queries, not re-derivations — and matches become verifiable against the graph.
- **Maps to:** v0.2.0 *GRAPH* + `references/graph-workflow.md`.

### M5. Informal cross-links — formalize for extraction
Cross-references are prose/slug-matched, not a checkable link structure, so neither lint nor a graph can be trusted.
- **Action:** standardize on relative-link `## See Also` sections (and the `**Relates:**` line from M4) so M3's lint can verify them and M4's extractor can harvest them. The editorial overlay already proves slug-based linking works; formalize it into real links.
- **Maps to:** v0.2.0 *Conventions* (relative links, See Also as graph edges).

### Suggested order
M3 (lint — catches regressions immediately) → M5 (formalize links — prerequisite for graph) → M4 (matching graph — biggest product win) → M1 (size caps — cheap discipline) → M2 (shard `all.json` — only when it grows).

### What does NOT migrate
Everything in Part 1. In particular, do **not** switch Great Work to blockquote headers, flat topic dirs, or agent-time-only search — those would regress the product. The base skill's scripts should be adapted to Great Work's conventions, not the reverse.

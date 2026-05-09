# Great Work Wiki Editorial Plan

This plan is for agents whose job is to read, critique, rerank, refresh, and improve the existing `great_work` wiki. It complements `great_work/agent_ops/PLAN.md`, which remains the main operating plan for source-first expansion and new entry research.

## Purpose

The editorial branch exists to keep the wiki trustworthy as it grows.

New-research agents are optimized for discovery: find promising Utah-linked work, verify it, write entries, and keep the lead queue moving. Editorial agents are optimized for judgment: reread what already exists, test claims against evidence, notice stale pages, keep tiers meaningful, and make the wiki more useful to future builders.

Because agents often have time for only one article or a small handful of articles, iterative coverage is tracked in `great_work/agent_ops/editorial_passes/`. Use those pass files to record partial progress, handoffs, blocked judgments, and completed audits.

## What Editorial Agents Do

- Rerank historical and speculative entries when evidence no longer matches the current tier.
- Answer continuity questions such as "what happened to this project?", "are they still doing great work?", and "did the promise pan out?"
- Refresh stale entries after approvals, clinical results, launches, shutdowns, acquisitions, failed replications, deployment data, or policy changes.
- Strengthen weak entries with primary sources, clearer attribution, sharper caveats, and better counterfactual arguments.
- Split entries that mix several distinct works, or merge pages that duplicate the same contribution.
- Identify entries that are company-centered when they should be work-centered.
- Improve titles, domain placement, README rows, living-institution notes, and learn-more sources.
- Maintain the editorial audit queue and record durable reranking judgments.

## Editorial Standards

### Tier Test

Use the same tier system as `great_work/agent_ops/PLAN.md`, but apply it with special attention to consistency across the whole wiki.

- **S**: textbook-defining, field-changing, or world-historical; the world is measurably different because this happened in Utah or because Utah supplied a decisive site, institution, or artifact.
- **A**: strong, durable contribution with clear field, industry, clinical, cultural, or institutional impact.
- **B**: real contribution with caveats; important to a sector, region, professional community, or enabling ecosystem.
- **C**: plausible but limited; interesting and real, but narrower or less proven than B.
- **D**: weak but historically worth keeping; the claim is marginal, indirect, or mostly cautionary.
- **P-A / P-B / P-C**: future-facing watchlist tiers; credible signals exist, but durable impact is not proven yet.

### Counterfactual Test

For every rerank, ask:

- What would be missing, slower, worse, or less developed if this work had never happened?
- Is the impact broad, deep, or both?
- Did Utah do the work, enable the work, host the decisive field site, or only supply a person or later company address?
- Is this entry being rewarded for fame, valuation, novelty, or boosterism rather than durable contribution?
- Is the current evidence historical, or merely prospective?

### Freshness Test

Check whether anything material has changed since the page was written:

- regulatory approval, clearance, designation, warning, or rejection
- posted or published clinical-trial results
- peer-reviewed replication, contradiction, or retraction
- launch, flight result, mission end, dataset release, or instrument failure
- commercial deployment, customer adoption, procurement, acquisition, shutdown, bankruptcy, or pivot
- policy adoption, environmental outcome, infrastructure performance, or public data release
- new archival source that clarifies credit, timing, or Utah attribution

### Source Test

Prefer durable evidence:

- primary sources and official databases
- peer-reviewed literature and technical reports
- regulatory filings and approval summaries
- public datasets, mission archives, procurement records, patents, standards, and institutional archives
- independent histories, field surveys, or domain-specific reference works

Use press only to discover leads unless the claim is about reception, public controversy, or cultural history where press itself is part of the record.

## Editorial Workflow

1. Read the relevant prompt: `great_work/agent_ops/prompts/wiki-editor-agent.md`.
2. Read `great_work/README.md`, `great_work/agent_ops/PLAN.md`, this file, the active pass tracker in `great_work/agent_ops/editorial_passes/`, and the entry or domain being audited.
3. Decide whether the user asked for:
   - a focused article answer
   - a freshness check
   - a rerank
   - a domain audit
   - a whole-wiki audit
   - process/tooling improvement
4. Gather sources only as deeply as the decision requires. Recent/freshness questions usually require live source checks.
5. Make the smallest useful edit that improves truth, ranking, sourcing, or continuity.
6. Update indexes and queues:
   - `README.md` for tier/path/watchlist changes
   - `great_work/agent_ops/PLAN.md` for source-expansion operating memory
   - this file for editorial audit findings and rerank priorities
   - `great_work/agent_ops/editorial_passes/*.md` for article-level pass progress and handoffs
   - `great_work/agent_ops/_messy_thoughts.md` for unresolved fragments
7. Run validation scripts after README/watchlist changes:
   - `python3 scripts/check_great_work_totals.py`
   - `python3 scripts/check_great_work_watchlist_links.py`
8. Commit small, descriptive changes.

Run `python3 scripts/check_great_work_editorial_coverage.py` when you want an informational report on which entries have appeared in editorial pass files. It is expected to report incomplete coverage until a full pass is actually complete.

## Audit Format

Use this table when doing a domain or whole-wiki pass.

| Entry | Current tier | Recommended tier | Confidence | Utah attribution | Freshness | Editorial action |
|---|---|---|---|---|---|---|

Use this block when auditing one entry.

```
Entry:
Current tier:
Recommended tier:
Confidence:
Utah attribution:
Freshness status:
Main evidence:
Main caveat:
Recommended edit:
Follow-up source:
```

## Whole-Wiki Rerank Plan

A real whole-wiki rerank should happen in passes, not as one giant edit.

Use `great_work/agent_ops/editorial_passes/whole-wiki-rerank-2026-05.md` as the active ledger for the current broad pass. Add one row per article audited, even if the article is unchanged.

1. **Index Calibration Pass**
   - Read every README row.
   - Flag obvious tier inconsistencies without editing every article.
   - Output an audit table into this file.

2. **Historical Entry Pass**
   - Read every S/A/B/C/D entry.
   - Check source quality, Utah attribution, and counterfactual impact.
   - Make small tier/content edits by domain.

3. **Speculative Watchlist Pass**
   - Read every P-A/P-B/P-C entry.
   - Check whether upgrade triggers have been met, weakened, or need rewriting.
   - Move stale or overhyped items down; promote proven items into historical tiers.

4. **Freshness Pass**
   - Prioritize entries with dates after 2023, ongoing trials, pending launches, regulatory claims, active defense deployments, or startup/product claims.
   - Add "last checked" notes only if the wiki adopts a consistent convention.

5. **Source Quality Pass**
   - Replace weak press-only sourcing with primary or archival sources.
   - Add missing FDA, ClinicalTrials.gov, PubMed, DOE, NASA, USGS, OSTI, patent, or institutional archive links.

6. **Builder Usefulness Pass**
   - Add living institutions, methods, places, datasets, labs, companies, and learning paths where entries are too retrospective.

## Current Editorial Queue

| Priority | Item | Why it matters | Suggested action |
|---|---|---|---|
| High | Whole-wiki tier calibration | The index has grown through many sessions; tiers need cross-domain consistency. | Build an audit table for all historical entries before making broad reranks. |
| High | Speculative watchlist calibration | P-A/P-B/P-C entries are numerous and time-sensitive. | Check upgrade triggers and demote/promote stale or proven items. |
| High | Recent 2025-2026 operating claims | New companies, mines, reactors, defense systems, and medical devices can look more proven than they are. | Default to P tiers unless independent operating evidence exists. |
| Medium | Weak Utah attribution entries | Weak attribution can be valid, but readers need honesty. | Add or sharpen Utah attribution notes and caveats. |
| Medium | Press-heavy historical entries | Some older pages were written quickly from secondary coverage. | Replace or supplement with primary, archival, regulatory, or peer-reviewed sources. |
| Medium | Culture and arts calibration | Culture impact has different evidence than science/technology, but still needs counterfactual rigor. | Compare Sundance, Spiral Jetty, Tabernacle Choir, Sun Tunnels, Utah Symphony, and Utah Shakespeare Festival. |
| Low | Entry-format consistency | Some entries lack attribution, key people, or living-institution notes. | Normalize opportunistically when touching pages. |

## Durable Reranking Judgments

Record major reranking decisions here so future agents do not relitigate them without new evidence.

| Date | Entry | Decision | Rationale |
|---|---|---|---|
| 2026-05-06 | Spiral Jetty | A -> S | Textbook-defining Land art work whose meaning depends on Great Salt Lake; Utah attribution is site-specific rather than artist-biographical. |
| 2026-05-06 | Bingham Canyon Mine | B -> A | Helped prove low-grade porphyry copper mass mining at global scale; impact is large despite environmental and labor caveats. |
| 2026-05-06 | Electric Traffic Signal | A -> B | Real early Utah electric-signal work, but later patented and standardized systems carried more of the global traffic-control lineage. |
| 2026-05-06 | Mariana Minerals - Copper One | B -> P-B | Restarted only in April 2026; needs independent production, safety, uptime, cost, and replication evidence before historical ranking. |

# Editorial Pass Tracking

This directory tracks iterative editorial passes over the `great_work` wiki.

Agents should use these files when they are auditing, reranking, refreshing, or deeply revising existing entries. A single agent may review one article, a handful of articles, or a small domain slice. The tracker is designed for partial progress.

## How to Work a Pass

1. Read `great_work/agent_ops/EDITORIAL_PLAN.md` and `great_work/agent_ops/prompts/wiki-editor-agent.md`.
2. Pick a pass file, usually the most recent active one.
3. Choose a small work unit:
   - one difficult article
   - 2-5 straightforward articles
   - a tiny cluster with the same issue, such as "recent P-B medical devices"
4. Add or update rows in the pass file as you work.
5. Record the result even if you only investigated and decided not to edit.
6. Run validation scripts after README/watchlist edits.
7. Commit small, descriptive changes.

## Status Values

- `queued` - identified but not yet audited
- `in-progress` - actively being reviewed in this session
- `audited` - read and judged; no content change needed or not enough evidence to edit
- `edited` - article, README, plan, or tracker changed
- `blocked` - could not reach a judgment; needs a specific source or decision
- `revisit` - not urgent now, but should be checked after a trigger date or event

## Coverage Reports

Run this to see which entry pages have appeared in any editorial pass file:

```bash
python3 scripts/check_great_work_editorial_coverage.py
```

This report is informational by default. It should not fail just because the whole wiki has not been audited yet.

## Active Passes

- [`whole-wiki-rerank-2026-05.md`](whole-wiki-rerank-2026-05.md) - first broad tier/freshness/source-quality calibration pass.

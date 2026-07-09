# Great Work Utah — wiki

A flat, attributed, view-based wiki of the highest-impact work happening in Utah. Restructured 2026-07-09 from typed directories to **views over attributed storage** (rationale and evidence: `research/findings/`).

## Layout

- `pages/` — every page, one flat namespace, ~600 markdown files. **The only thing contributors edit.**
- `meta/` — the schema: `conventions.md` (principles + precedents for placement), `attributes.md` (metadata registry), `charter.md` (what "great work" means; used to prioritize, never to gatekeep).
- `views/` — **generated, never hand-edited**: master index, type indexes, the needs board, sector hubs, by-region. Regenerate with `node scripts/build-views.mjs` after any page change.
- `agent_ops/`, `outreach/`, `log.md` — internal agent coordination; not public content.

## Page anatomy

H1 title, then bold-prefix metadata (`**Type:**`, `**Status:**`, `**Confidence:**`, `**Focus:**`, `**Domain:**` primary-first, `**Region:**`, `**Needs-reviewed:**` — see `meta/attributes.md`), then the sections required for the page's Type (see `meta/conventions.md`). Links are same-directory relative: `[Fervo Energy](fervo-energy.md)`. Links to pages that *should* exist are allowed — lint feeds them to the wanted queue.

## Working here

1. Read `meta/conventions.md` before placing or writing anything; reason from its principles and report any case they fail to decide (ambiguity reports are how the schema improves).
2. Edit or add pages in `pages/` only. Never touch `views/` by hand.
3. Run `node scripts/build-views.mjs` (regenerates views) and `node scripts/wiki-lint.mjs` (checks metadata, templates, links, staleness) before finishing.
4. Prefer official/primary sources; press releases are leads, not proof. Cite `Type: source` pages from Evidence sections.
5. Domain/Region attribution is mid-rollout (22/604 pages). When you touch a page, attribute it.

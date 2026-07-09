# Migration record: the flatten (2026-07-09)

Executed `scripts/flatten-wiki.mjs --apply` implementing views-over-attributed-storage (`findings/2026-07-09-hierarchy-probes.md`). Backup of the pre-flatten wiki + research: `wiki-backup-preflatten.tar.gz` at repo root (delete once the new structure has survived a while).

## What happened

- **604 pages moved** from 7 typed directories into flat `wiki/pages/`, each gaining a `**Type:**` header derived from its old directory (answers-keepers → `guide`).
- **46 pages deleted**: all 37 `matches/` (founders "matched" to their own companies, speculative vendor pairings, demo artifacts — audit in `design/hierarchy-v1.md`), 8 of 10 `answers/` (synthetic-persona demos + marketing; kept where-to-find-sbir-help and who-helps-with-government-contracting as guides), and the mis-filed duplicate `ventures/jarvik-7-artificial-heart.md` (work/ copy kept — higher confidence, has Era).
- **1,618 internal links rewritten** to flat same-dir form; 2 link-lines to deleted pages dropped; 0 prose links needed unlinking (all other deleted-page links lived inside other deleted pages).
- **7 slug collisions resolved**: 6 sources renamed with `-source` suffix; 1 was the Jarvik duplicate.
- **18 pre-existing dangling source links** (3 recent pages citing never-created sources) normalized to flat form; they now surface via lint as wanted pages.
- Old `wiki/index.md` + `wiki/indexes/` deleted — replaced by generated `wiki/views/` (17 views from `scripts/build-views.mjs`: master index, 7 type indexes, needs board, 7 sector hubs (attributed pages only), by-region). Zero dangling links in generated views.
- `wiki/meta/` installed: `conventions.md` (principles + precedents, flat-adapted), `attributes.md` (the registry), `charter.md`. `wiki/WIKI.md` rewritten.

## Invariants going forward

- Contributors edit `pages/` only; views regenerate (`node scripts/build-views.mjs`); lint (`scripts/wiki-lint.mjs`, rewritten for this schema) enforces attributes/templates/links.
- Attribution coverage at migration: 22/604. Full rollout is E10.
- Site URL scheme: `/pages/<slug>.md`, `/views/<view>.md`, `/meta/<doc>.md`, manual at `/llms.txt` (see interface-v3 flatten update).

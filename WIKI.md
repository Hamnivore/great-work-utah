# Great Work Wiki

One wiki instance, `wiki/`: a flat, attributed, view-based wiki of the highest-impact work happening in Utah. All layout, conventions, metadata schema, and working instructions live in `wiki/WIKI.md` — start there.

Quick pointers:

- `wiki/pages/` — every page, flat namespace, ~600 markdown files. The only thing contributors edit.
- `wiki/meta/` — the schema (`conventions.md`, `attributes.md`, `charter.md`).
- `wiki/views/` — generated indexes; regenerate with `node scripts/build-views.mjs`, never hand-edit.
- `node scripts/wiki-lint.mjs` — checks metadata, templates, links, and staleness against `wiki/meta/`.

See `wiki/WIKI.md` for the full picture.

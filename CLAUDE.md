# great-work — greatutah.work

An LLM-first wiki of the highest-impact work happening in Utah (~600 pages). The primary
audience is visiting AI agents, who read raw markdown at stable URLs; humans get a thin
React shell over the same files. The agent manual is `public/llms.txt`.

## Layout

- `wiki/pages/` — every wiki page, one flat namespace. The only content contributors edit.
- `wiki/views/` — **generated** indexes (master index, type views, needs board). Never hand-edit.
- `wiki/meta/` — the schema: `conventions.md`, `attributes.md`, `charter.md`.
- `src/` — the small human-facing React app (routes: `/`, `/p/:slug`, `/v/:view`, `/contribute`).
- `api/contribute.ts` — Vercel function; notes → GitHub issues, pages → PRs (review-gated).
- `public/llms.txt` — the entire agent interface; keep it in sync with the URL scheme.
- `research/` — the design corpus (findings, specs, tested manual text).

## URL scheme (production)

`/pages/<slug>.md`, `/views/<view>.md`, `/meta/<doc>.md` — static files, copied into `dist/`
at build time. `/llms.txt` is the manual. `POST /api/contribute` is the single write endpoint.

## Commands

- `node scripts/build-views.mjs` — regenerate `wiki/views/` after any page change.
- `node scripts/wiki-lint.mjs` — check metadata, templates, links, staleness.
- `npm run build` — views + typecheck + vite build + copy wiki into `dist/`.
- `npm run startup-state:check` — diff live startup.utah.gov resources vs wiki
  (`research/startup-state/`); use `:check:strict` in CI-style gates.
- `npm run startup-state:sync` — refresh matching pages from the live WP API.

Run both wiki commands before finishing any change to `wiki/pages/`.

## Before interface / navigation / contribution work

Read `research/README.md` first — it records standing product directives and the tested
findings behind the current design. `research/design/interface-v3.md` is the interface spec;
don't re-litigate decisions recorded there.

# Shadow Wiki

This is the repository's non-public companion wiki for exceptional work without a substantive
Utah connection. It is registered in the repository-level [WIKI.md](../WIKI.md#shadow-wiki).

## Boundary

Put a subject here when both are true:

1. Its plausible impact is unusually large under [the charter](../wiki/meta/charter.md).
2. There is no documented, substantive Utah connection that would justify a page in the public
   Great Work Utah wiki.

"Not Utah-connected" is a routing rule, not a quality judgment. If a substantive Utah connection
later emerges, move the article into `wiki/pages/` using that wiki's schema and leave a short
migration note in this wiki's log. Never publish or cross-link shadow pages from public pages,
generated views, the site UI, or `public/llms.txt`.

## Layout

- `raw/<topic>/` — immutable source captures. Capture the original text whenever possible.
- `wiki/<topic>/` — synthesized articles, one concept per page.
- `wiki/index.md` — the complete catalog; update it with every article change.
- `wiki/log.md` — append-only operation history.

Topic directories are one level deep and use kebab-case. Add them only when content exists.

## Article format

```markdown
# Title

> Sources: Author/organization, YYYY-MM-DD
> Raw: [Source title](../../raw/topic/YYYY-MM-DD-source.md)
> Updated: YYYY-MM-DD

## Overview

Why this is exceptional, in one paragraph.

## Impact

Reason about depth, breadth, permanence, plausible bounds, and the counterfactual.

## Evidence

Distinguish demonstrated facts from claims and unresolved bets.

## Open Questions

Name material uncertainty, including any possible Utah connection.

## See Also

Use relative links only; omit this section when there are none.
```

Raw source files declare `Source`, `Collected`, `Published`, and `Capture`. `Capture` must be one
of `verbatim`, `digest`, or `uncaptured`; only `verbatim` is ground truth suitable for verification.

## Workflow

1. Search both wiki indexes before adding a subject.
2. Capture sources under `raw/`; never rewrite an existing capture.
3. Write or update the article, then update `wiki/index.md` and append `wiki/log.md`.
4. Run `npm run lint:shadow-wiki`.
5. Stage only the files involved in the operation. The shadow wiki may be committed and pushed
   normally, but it must remain outside every website route and build artifact.

Prefer official records, papers, technical documentation, and direct statements. Treat press and
marketing material as leads rather than proof. Keep one concept per article, split pages near 400
lines, and never let a page exceed 800 lines.

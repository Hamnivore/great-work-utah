# Great Work Wiki Registry

This repository contains one public wiki instance plus an internal legacy seed corpus.

| Wiki | Path | Scope | Article count | Index |
|------|------|-------|---------------|-------|
| Great Work Utah | `wiki/` | Utah ventures, helpers, resources, historical work, sources, guides, matches, and answers for meaningful-work discovery. | 588 public pages | [index](wiki/index.md) |

`legacy_wiki/` is internal seed material only. Do not cite or link legacy provenance from public pages.

## Wiki Instance Details

### Great Work Utah

Created: 2026-05-09

Great Work Utah is a product-facing LLM wiki for discovering serious work, useful helpers, resources, historical anchors, and explainable matches in Utah. It keeps the base wiki skill's durable-markdown philosophy while preserving Great Work's product-specific schema: bold-prefix headers, fact pages separated from judgment pages, named layouts, and no universal entity tiers.

Subtopics:

- `ventures/` — startups, labs, spinouts, companies, nonprofits, and serious initiatives
- `people/` — founder, operator, researcher, student, executive, and candidate biographies
- `helpers/` — hands-on advisors, firms, funds, service providers, and connector institutions
- `resources/` — programs, grants, accelerators, facilities, capital paths, courses, and datasets
- `work/` — historical and current examples of great Utah work
- `sources/` — public evidence records and raw/source notes
- `guides/`, `matches/`, `answers/` — judgment and synthesis pages that cite the fact layer

Conventions:

- Public pages use an H1 followed by bold-prefix headers such as `**Status:**`, `**Confidence:**`, and `**Updated:**`.
- Preserve the fact-layer / judgment-layer split: entity pages describe; guides, matches, and answers recommend.
- Do not add universal tiers to entity pages. Audience-scoped ranking belongs in judgment pages.
- Use relative Markdown links and `## See Also` sections for explicit cross-page references.
- Use `**Relates:** <verb> [Target](relative-path)` for typed relationship edges when a page needs graph extraction.
- Page size caps follow the shared wiki skill: 400-line soft cap, 800-line hard cap.

Source preferences:

- Prefer official pages, government records, university pages, public filings, primary research, regulatory records, procurement records, and independent sources.
- Press releases are useful leads but should not be treated as neutral proof.
- Internal legacy material may guide migration work but must remain out of public-facing provenance.

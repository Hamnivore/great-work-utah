# Placement conventions — principles and precedents

**Status:** normative once adopted — this document is *part of the schema*. v2 (2026-07-09): restructured from a flat rulebook into **principles + precedents** so it scales. Reason from the principles; the precedents are worked examples calibrating them, grown by adjudicating probe-discovered gaps. **Compaction discipline:** when a principle accumulates more than ~10 precedents, or two precedents conflict, the principle is wrong — refactor it rather than adding an eleventh precedent. Related: `charter.md` plays this same role for judgment/prioritization.

## The four principles

**P1 — Classify by the change in the world the entity is trying to cause, not the tools it uses.** Domains describe intended effect (the sector served, the outcome pursued), never discipline, ingredients, or infrastructure.

**P2 — One page per thing someone would cite independently.** The atom is whatever a reader or another page would want to link to on its own: a legal entity, an achievement, a program, a place, an evidence artifact.

**P3 — Record what you know; flag what you don't; never silently guess.** Every required field has an escape hatch that says "unresolved" loudly, and lint routes flagged items to an editor. Convergent, honest ambiguity is the correct failure mode.

**P4 — Pages are edited; views are compiled.** Contributors touch exactly one thing: the page. Every index, hub, board, and codex regenerates from metadata. If a change seems to need a hand-edit to an index, the metadata is wrong or a generator is missing a view.

## Metadata headers (bold-prefix, after the H1, alongside Status/Confidence)

- `**Domain:** <primary>, <secondary>, …` — first entry is primary (exactly one); views list a page prominently under its primary, compactly ("also relevant") under secondaries.
- `**Region:** <place>` — where the distinctive Utah work happens.
- `**Needs-reviewed:** YYYY-MM-DD` — required on any page with `## What They Need Now`; needs older than 6 months get lint-flagged and marked "(unverified since <date>)" in generated boards.
- `**Ownership:** founder-led private | private | public | PE-owned | nonprofit | government` — a checkable fact the judgment layer interprets (see `charter.md` §6). Optional in the pilot; candidate for required-on-ventures.

Applies to: ventures, resources, work, people, helpers. Not sources (evidence) or guides (judgment).

**Attribute registry:** the authoritative list of attributes and their vocabularies lives in one file the lint and generators parse (`wiki/meta/attributes.md` once shipped; this doc is its draft). Each entry records: name · applies-to · vocabulary with one-line value definitions · required/optional · **which views consume it**. An attribute must earn its existence by powering a view; a vocabulary value is added the way a precedent is — by adjudicating a real case.

## P1 precedents (domain)

1. Sector served beats discipline practiced: VoltSafe Labs (battery *test equipment* for storage manufacturers) → `energy, materials-mfg`. A law firm serving biotech → `capital-programs, health-bio`.
2. Energy carriers sold into another sector (fuels, propellants, powertrains): customer sector primary, `energy` secondary — CleanJoule/SAF → `aerospace-defense, energy`. *(Adjudicated after two attributors ruled opposite ways on the same class.)*
3. Nuclear splits by intended effect: grid power → `energy`; medical isotopes → `health-bio`; deterrent → `aerospace-defense`; space/defense power sources (RTGs) → `aerospace-defense` primary, `energy`/`space-science` secondary.
4. Downstream/general-purpose materials (copper, magnesium): a sector is a secondary only if the page names it as a stated business line — "feeds into everything" tags nothing.
5. Failed/debunked technologies: primary = the lens the page is written through (Pons–Fleischmann → `culture-place`); the claimed sector goes secondary so the sector's history view still finds it.
6. Genuinely dual businesses: one primary — by revenue/effort center if public, else the Utah-heavier half, else the line the entity names first in its own self-description **plus** `**Domain-flagged:** review` (P3 escape hatch). Never leave primary unstated. Low-stakes by construction: secondaries stay findable in every view.

## Region precedents

1. Distinctive Utah work site beats HQ; in-state dual-site: field site first, HQ parenthesized — `Juab County (HQ: Provo)`.
2. Single-sited → city; field/distributed → county; programs → `statewide`; out-of-state HQ → `out-of-state (Utah operations: <place>)` (applies to people by analogy).
3. Natural features may use an area label (`Great Salt Lake basin`). Unknown → `unknown (Utah)`, lint-flagged (P3).

## P2 precedents (atoms)

1. Organization: one page per legal entity; business lines are sections; needs-tracks are separate bullets in `What They Need Now`.
2. Achievement vs. person: achievements are `work/` pages, slug `<the-thing>-<year>` when historical, named for the work not the person. A person gets a `people/` page iff they are a live Utah node (reachable, hiring, advising, building) **or** two existing pages would link to them (the two-link rule — grep-checkable). Passed-through luminaries get achievement pages, not biographies.
3. Program vs. instance: one `resources/` page per recurring program; cohorts/awards are content within it.
4. Source granularity: one `sources/` page per evidence artifact (one filing, one article, one dataset), not per claim.
5. Place/topic pages are legitimate atoms (`culture-place` primary by default, area-label region).
6. Openings are not atoms: needs live on the org page, one bullet per role-family per business line. (H6's undefined-grain trap, avoided.)

## Page-type templates (required sections)

- **ventures**: Summary · Impact · Utah Context · What They Need Now · Open Questions · Evidence (+ optional Who Could Help, See Also)
- **work**: Summary · Impact · Utah Context · What It Took · Open Questions · Evidence — no "What They Need Now" (forced boilerplate on history)
- **resources**: Summary · Who It's For · How To Use It · Open Questions · Evidence
- **people**: Summary · Track Record · What They're Looking For · Evidence
- **helpers**: Summary · Who They Help · Evidence

Impact sections follow the charter's shape — depth, breadth, permanence, counterfactual, and the named bet where the work is contrarian (`charter.md` §"How the charter connects").

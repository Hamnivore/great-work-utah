# Conventions — principles and precedents

Normative. Pages live flat in `pages/`, one namespace; everything else about organization is metadata (`attributes.md`) and generated views (`views/`). Reason from the principles; precedents are worked examples. When a principle collects more than ~10 precedents or two conflict, refactor the principle. Judgment/prioritization uses `charter.md`.

## Principles

**P1 — Classify by the change in the world the entity is trying to cause**, not the tools it uses. Domains are intended effect, never discipline or ingredients.

**P2 — One page per thing someone would cite independently**: a legal entity, an achievement, a program, a place, an evidence artifact.

**P3 — Record what you know; flag what you don't; never silently guess.** Every required field has a loud escape hatch; lint routes flags to an editor.

**P4 — Pages are edited; views are compiled.** Contributors touch exactly one thing: the page in `pages/`. Every view regenerates from metadata (`node scripts/build-views.mjs`). If a change seems to need a hand-edit to a view, the metadata is wrong or a generator is missing a view.

## P1 precedents (Domain)

1. Sector served beats discipline practiced: battery *test equipment* for storage manufacturers → `energy, materials-mfg`; a law firm serving biotech → `capital-programs, health-bio`.
2. Energy carriers sold into another sector (fuels, propellants, powertrains): customer sector primary, `energy` secondary — CleanJoule → `aerospace-defense, energy`.
3. Nuclear splits by intended effect: grid power → `energy`; medical isotopes → `health-bio`; deterrent → `aerospace-defense`; space/defense power sources (RTGs) → `aerospace-defense` primary, `energy`/`space-science` secondary.
4. Downstream/general-purpose materials: a sector is a secondary only if the page names it as a stated business line — "feeds into everything" tags nothing.
5. Failed/debunked technologies: primary = the lens the page is written through (Pons–Fleischmann → `culture-place`); claimed sector secondary.
6. Dual businesses: one primary — revenue/effort center if public, else the Utah-heavier half, else the line the entity names first in its own self-description **plus** `**Domain-flagged:** review`. Never leave primary unstated; secondaries stay findable in every view.

## Location precedents

1. `Primary Location` is the entity's canonical home for identity: headquarters for organizations, main institution for people, main site for works/places, or `unknown` when evidence is thin.
2. `Utah Location` is the Utah-specific footprint: a city, county, named site, area label, `statewide`, `no verified Utah presence`, or `unknown`. Never fold HQ and Utah footprint into one prose field.
3. `Region` is the normalized by-region key compiled into views. During rollout it is written explicitly, but it should match the Utah Location at the level useful for browsing: city for single-sited Utah work, county for field/distributed work, area label for natural features, `statewide`, `no verified Utah presence`, or `unknown`.
4. Out-of-state entities with a verified Utah operation split cleanly: Fervo → `Primary Location: Houston, TX`; `Utah Location: Beaver County, UT`; `Region: Beaver County`.
5. Out-of-state entities with no verified Utah operation use `Utah Location: no verified Utah presence`; `Region: no verified Utah presence`.
6. Out-of-state or unclear entities whose Utah relationship is still being investigated use `Utah Location: unknown`; `Region: unknown`, with the uncertainty named in `## Utah Context` or `## Open Questions`.
7. In-state dual-site entities put the identity anchor in `Primary Location` and the Utah footprint in `Utah Location` without parenthetical compression: EnergySolutions → `Primary Location: Salt Lake City, UT`; `Utah Location: Clive, UT (disposal site); Salt Lake City, UT (HQ)`.
8. Programs/resources that serve all of Utah use `Utah Location: statewide`; regional service areas should name the counties or region label.
9. Natural features use an area label for both primary and Utah location when appropriate (`Great Salt Lake basin`).
10. The legacy `Location` field is superseded. Do not add new `Location` metadata lines.

## P2 precedents (atoms)

1. Organization: one page per legal entity; business lines are sections; needs-tracks are separate bullets in `## What They Need Now`.
2. Achievement vs. person: achievements are `Type: work` pages, slug `<the-thing>-<year>` when historical, named for the work not the person. A person gets a page iff they are a live Utah node (reachable, hiring, advising, building) **or** two existing pages would link to them. Passed-through luminaries get achievement pages, not biographies.
3. Program vs. instance: one `Type: resource` page per recurring program; cohorts/awards are content within it.
4. Sources: one `Type: source` page per evidence artifact (one filing, one article, one dataset), not per claim. If a source slug would collide with an entity slug, suffix `-source`.
5. Place/topic pages are legitimate atoms (`culture-place` primary by default, area-label region).
6. Openings are not atoms: needs live on the org page, one bullet per role-family per business line.

## Page templates (required sections by Type)

- **venture**: Summary · Impact · Utah Context · What They Need Now · Open Questions · Evidence (+ optional Who Could Help, See Also)
- **work**: Summary · Impact · Utah Context · What It Took · Open Questions · Evidence — no "What They Need Now"
- **resource**: Summary · Who It's For · How To Use It · Open Questions · Evidence
- **person**: Summary · Track Record · What They're Looking For · Evidence
- **helper**: Summary · Who They Help · Evidence
- **guide**: free-form; must cite fact pages rather than restating them
- **source**: what the artifact is, what it supports, retrieval date/URL

Impact sections argue the charter's dimensions — depth, breadth, permanence, bounds, counterfactual — as prose with reasoning, plus `**Bet:**` where the work is contrarian.

## Links

Same-directory relative links only: `[Fervo Energy](fervo-energy.md)`. A link to a page that should exist but doesn't is allowed — lint reports it to the wanted queue rather than failing.

# Conventions — principles and precedents

Normative. Pages live flat in `pages/`, one namespace; everything else about organization is metadata (`attributes.md`) and generated views (`views/`). Reason from the principles; precedents are worked examples. When a principle collects more than ~10 precedents or two conflict, refactor the principle. Judgment/prioritization uses `charter.md`.

## Principles

**P1 — Classify by the change in the world the entity is trying to cause**, not the tools it uses. Domains are intended effect, never discipline or ingredients.

**P2 — One page per thing someone would cite independently**: a legal entity, an achievement, a program, a place, an evidence artifact.

**P3 — Record what you know; flag what you don't; never silently guess.** Every required field has a loud escape hatch; lint routes flags to an editor.

**P4 — Pages are edited; views are compiled.** Contributors touch exactly one thing: the page in `pages/`. Every view regenerates from metadata (`node scripts/build-views.mjs`). If a change seems to need a hand-edit to a view, the metadata is wrong or a generator is missing a view.

**P5 — Capture evidence, don't link to it.** A URL is a pointer, not a record. For sources a public
institution is obliged to keep (filings, award records, datasets, papers), capture the **key** — the
identifier plus the accession/award/DOI — so the record stays retrievable by a machine forever. For
everything else, capture the **bytes**: an archive snapshot plus the verbatim sentences the claims
rest on. A figure that cannot be quoted from a captured source is not a figure this wiki asserts.

## Roles

`**Roles:**` identifies the broad families of contributors an entity says it currently needs. It is optional, applies only to pages with `## What They Need Now`, and is compiled into role views for people looking for work. Each value must be supported by the needs section: tag the work the entity is asking people to do, not its sector, its `Focus`, technologies or ingredients it uses, or every profession that could conceivably work there.

Use the smallest supported set of broad role families. For example, a biotech venture seeking software engineers gets `software-engineering`, not `biology-life-sciences` merely because biology is its sector. Keep specialties such as frontend, backend, machine learning, molecular biology, and enterprise sales in the prose of `## What They Need Now`; map them to the registry's stable role families for browsing. Separate multiple values with commas.

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
11. Map metadata is an all-or-nothing tuple: `Map Location`, `Coordinates`, `Location Precision`, and `Location Source`. Coordinates use WGS84 decimal `latitude, longitude` and must fall within Utah.
12. Use `Location Precision: exact` only for a clearly public organizational, facility, campus, or work site whose public source identifies the street address or publishes the named site's coordinates. `Map Location` must state that address or named site at matching granularity; never publish exact coordinates while showing only a broader label.
13. Use `Location Precision: approximate` for a named public campus/site or a city/county/area anchor. The coordinate must not imply more precision than `Map Location` states.
14. Never publish a person, residence, private workplace, or ambiguous address as a site point. People and entities without a safe public site may appear only at a coarse city/county/area anchor derived from `Region`; the displayed label must explicitly say it is regional and not a street address. Omit statewide-only services, `unknown`, and `no verified Utah presence` from point data.
15. A map location is a discoverability anchor, not necessarily an entity's headquarters or full service area. `Primary Location`, `Utah Location`, and `Region` retain those meanings.
16. Location corrections and removal requests use `POST /api/contribute` with `kind: note` and the affected page path. A request to remove an unsafe or unwanted point does not require a replacement location.
17. A clearly named public Google Maps place listing is sufficient evidence for an organizational or work-site street address when no direct official location page is available. Prefer the official page when it publishes the address. A search result that identifies only a city, service area, mailbox, residence, or ambiguous namesake does not qualify.
18. Multi-site entities keep one primary map tuple and repeat `**Additional Map Location:** address | latitude, longitude | exact | https://source` for each additional documented public Utah site. Each site becomes its own map and proximity-search point while linking to the same canonical page. Do not duplicate regional anchors or private/sensitive sites.

## P2 precedents (atoms)

1. Organization: one page per legal entity; business lines are sections; needs-tracks are separate bullets in `## What They Need Now`.
2. Achievement vs. person: achievements are `Type: work` pages, slug `<the-thing>-<year>` when historical, named for the work not the person. A person gets a page iff they are a live Utah node (reachable, hiring, advising, building) **or** two existing pages would link to them. Passed-through luminaries get achievement pages, not biographies.
3. Program vs. instance: one `Type: resource` page per recurring program; cohorts/awards are content within it.
4. Sources: one `Type: source` page per evidence artifact (one filing, one article, one dataset), not per claim. If a source slug would collide with an entity slug, suffix `-source`.
5. Place/topic pages are legitimate atoms (`culture-place` primary by default, area-label region).
6. Openings are not atoms: needs live on the org page, one bullet per role-family per business line.

## P5 precedents (evidence capture)

Worked out on the first three pages taken all the way down — `myriad-genetics.md` (public company),
`fervo-energy.md` (registrant with a live project), `business-technical-assistance-center.md` (dead
website). Plan and phasing: `research/design/raw-source-capture.md`.

1. **The identifier comes before the research.** Resolve `cik`, `ein`, `uei`, `ror`, or
   `utah-entity` first; every later figure is then a query, not a search. Myriad's CIK made its
   revenue, net loss, headcount, and headquarters address a five-minute pull.
2. **One source page per artifact, even from the same filer.** Fervo's IPO prospectus and its Q1
   10-Q are two pages, because they are two documents with different dates and different numbers —
   P2 applied to filings.
3. **A newer primary source supersedes an older self-reported one, and the page says so.** Fervo's
   2023 groundbreaking release announced Cape Station at 400 MW; the 2026 prospectus states 500 MW
   under construction. The page carries the current figure, names the earlier one with its date, and
   does not silently drop it. Never average conflicting sources, and never leave the conflict
   unstated.
4. **A dead website is not a dead subject, and the registry decides which.** BTAC's site has
   returned HTTP 500 since spring 2025, and its Confidence was Low for that reason. The IRS
   exempt-organization record shows the entity active and filing for tax period 2025-12 — so the
   organization is documented as operating while its site is documented as broken. Resolve existence
   questions against a registry before downgrading a page or calling a subject defunct.
5. **Primary records correct metadata, including location.** The 10-K's principal-executive-offices
   address moved Myriad's map point off a stale research-park address; the 990 registration and the
   org's own archived site agreed on BTAC's street address against a third-party directory listing.
   When a primary record contradicts a map tuple, the primary record wins and becomes the
   `Location Source`.
6. **Quote before you lose it.** BTAC's amenities are only knowable now from a 2025-03-25 snapshot
   taken twelve days before the site broke. Anything self-reported gets `Archive` + `## Verbatim` at
   the moment it is cited, not when someone notices the 404.
7. **A reusable dataset is its own source page.** The Utah IRS Business Master File extract is one
   `Source Type: dataset` page that any nonprofit page can cite with its own EIN, rather than 200
   near-identical pages. Cite the dataset page and record the row's key inline.
8. **Sometimes the ephemeral source is the accurate one, and it is citable.** `nunug.org` has a news
   feed stopping in 2020 and a next-meeting slot reading TBA, so from its website the group looks
   dead; it has in fact met monthly since a March 2026 "comeback meeting" announced in a public
   community Slack. Kids Code Camp's event page shows its final date as though the camp had never
   been rescheduled from June. In both cases the durable public artifact is *less* accurate about the
   present than the ephemeral one. Capture it as `Source Type: testimony` with self-contained quotes —
   the maintainer's ruling on which workspaces are citable, and the fields such a page must omit, is
   normative in `attributes.md`, "Community-channel testimony". **Sandbox Slack is leads-only and is
   never a source.**
9. **Write dated things so they stay true after the date passes.** Pages are written once and often
   not touched for a year, so a page built around "this weekend", "upcoming", "next month", or "will
   be" is wrong within days and silently misleads every reader after that. Anchor every instance to an
   absolute date and phrase it so the sentence survives: *"Part 2 was scheduled for August 14–15,
   2026, in Lehi"* stays true forever; *"AI Builder Day is coming up this Friday"* is false by
   Saturday. Put the durable material — what the thing is, who it is for, how it works, what it costs
   — in the body, and confine dates to instances. Where the outcome matters, make the gap explicit in
   `## Open Questions` (*"did the August 2026 edition run as scheduled, and what came of it?"*) so the
   page names its own staleness instead of asserting a stale fact. This applies to recurring programs
   (P2 precedent 3), conferences, cohorts, deadlines, and funding rounds alike.
10. **An agent that cannot re-derive a citation flags it; it does not delete it.** Learned the hard way
   on 2026-08-11, when two agents worked this corpus concurrently and one removed the other's
   testimony pages and its IRS-resolved `**Identifiers:**` values, rewriting a page to say the
   evidence "does not establish" a fact a federal record did establish. In a diff, deletion is
   indistinguishable from cleanup, and it silently destroys primary-record work that cost real effort
   to resolve. If a citation looks unsupportable, say so in `## Open Questions` or in
   `research/`, and leave the evidence in place for an editor.
8. **Tier follows the speaker, not the letterhead.** A `.gov` or `.edu` URL is not primary by
   domain. A record an institution created under a duty is primary; a page it published about
   itself is `official-page` or `press-release`, and a history essay it published is `reference`.
   The 2026-08-11 migration found eleven pages typed `Government Record`, four of which were agency
   news articles and history essays — keeping their old label would have promoted press releases to
   primary tier and made the Confidence rubric decorative.
9. **A permanent record behind an impermanent link still needs capturing.** BTAC's 990 data is
   permanent at the IRS and was cited through ProPublica; Iomega's 10-K was cited through a
   third-party EDGAR mirror. Prefer the issuing body's URL, and where that is not practical, treat
   the page as fragile and capture it. Lint reports these as `primary-behind-mirror`.
10. **A quote is checkable or it is just our word.** Every self-reported or secondary source page
    carries a `**Raw:**` capture in `raw/`, and lint requires each `## Verbatim` blockquote to be a
    literal substring of it (`verbatim-not-in-raw`). This is what makes the corpus's excerpts
    evidence rather than assertion, and it is the reason to capture the document at the moment you
    quote it.
11. **There is no legacy tier and no grandfather clause.** A vocabulary that tolerates 49 values
    enforces nothing: until 2026-08-11 the Confidence check silently skipped every page whose
    `Source Type` it did not recognize, which was 220 of 231 source pages. When a schema changes,
    migrate the whole corpus in one pass with a script whose mapping a reviewer can audit, and let
    the remaining work show up as a counted backlog rather than an exemption.

## Page templates (required sections by Type)

- **venture**: Summary · Impact · Utah Context · What They Need Now · Open Questions · Evidence (+ optional Who Could Help, See Also)
- **work**: Summary · Impact · Utah Context · What It Took · Open Questions · Evidence — no "What They Need Now"
- **resource**: Summary · Who It's For · How To Use It · Open Questions · Evidence
- **person**: Summary · Track Record · What They're Looking For · Evidence
- **helper**: Summary · Who They Help · Evidence
- **guide**: free-form; must cite fact pages rather than restating them
- **source**: Summary · Useful Claims · Reliability Notes · Related Pages, plus `**Source Type:**`
  (closed vocabulary), `**Publisher:**` and `**URL:**`. `**Retrieved:**` is written by scripts, never
  by hand. Self-reported and secondary tiers add `**Archive:**` / `**Archived:**`, a `**Raw:**`
  capture, and a `## Verbatim` section of exact quotes; primary tiers cited at their issuing body
  record the accession number, award ID, or DOI instead (see `attributes.md`, "Verbatim excerpts and
  archives"). Every figure in `## Useful Claims` must be quotable from `## Verbatim`, and every
  `## Verbatim` quote must appear in the `**Raw:**` capture.
  `## Useful Claims` is bounded by the document: it says what *this* document establishes, not what
  is true about the subject. A founding year, an executive's name, or a metric that the document does
  not contain belongs on a fact page that cites a document which does — even when the fact is
  certainly correct. Where the claim matters and nothing supports it yet, write the document's
  silence instead ("the homepage does not state a founding date"), which keeps the gap visible; or
  hand the claim to the page that owns it with a normal `[link](other-page.md)`. Lint enforces the
  mechanical half of this (`claim-anchor-not-in-raw`: dates and magnitudes absent from the capture).
  One source page describes one document, or several documents that share one `Source Type` — never
  a mix of tiers, which no single value can honestly label.

Impact sections argue the charter's dimensions — depth, breadth, permanence, bounds, counterfactual — as prose with reasoning, plus `**Bet:**` where the work is contrarian.

Every page type may end with an optional `## Maintainer Notes` section. When present, it must be
the final level-two section and must not be empty. Put wiki-production work there: presentation and
asset tasks, migration or internal-provenance notes, unresolved editorial decisions, and cleanup or
tooling instructions. This section is editorial state, not evidence, and must not be cited as support
for a factual claim. Reader-relevant uncertainty stays in `## Open Questions`; limitations that
change how a source should be weighed stay in `## Reliability Notes`; warnings that affect how a
reader should use a resource stay in the normal page prose.

## Links

Same-directory relative links only: `[Fervo Energy](fervo-energy.md)`. A link to a page that should exist but doesn't is allowed — lint reports it to the wanted queue rather than failing.

**Fetcher-safe URLs:** HTML-sanitizing clients often strip markdown `](href)` targets. On `## Evidence`, `## See Also`, and `**Relates:**` lines, after each wiki link append bare absolute URLs in plain text: the page on this site (`https://greatutah.work/pages/{slug}.md`) and, when the target is a `source` with `**URL:**`, that external URL. Optional page metadata `**Website:**` and `**Careers:**` are bare `https://` URLs only — never wrap them in markdown links.

**Careers URLs serve the human applicant**, not the fetching agent: record the org's general careers/jobs landing page or its own ATS board (Greenhouse, Lever, Workday, ApplicantPro, …). JS-rendered boards are acceptable — agents hand the URL to the user rather than fetching it; note readability limits in Open Questions if useful. Never record an individual job posting, an aggregator (LinkedIn, Indeed), or a raw ATS API endpoint. In prose, "What They Need Now" states role families and durable hiring emphasis — never lists of currently-open postings, which churn; the board is one click away. A standing general-application path (evergreen posting, HR email) is fine to name.

**Broken or relocated official sites:** `**Website:**` must be the best *currently usable* public URL (successor org, corrected typo, or https canonical)—not a parked domain or known 404. When the historical URL still matters, keep it once under Evidence with a plain label (`Former website`, `Wayback snapshot`). Do not treat a bot/WAF block as proof the site is dead: verify with a real browser (`npm run links:recover:browser`) before lowering Confidence. Confirmed typo/redirect pairs belong in `research/link-recovery/url-aliases.json` so future agents can reuse them.

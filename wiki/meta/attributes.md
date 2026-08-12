# Attribute registry

The authoritative list of page metadata. Lint and the view generators parse this file. An attribute exists only if a view consumes it; a vocabulary value is added by adjudicating a real case (see `conventions.md`). Headers are bold-prefix lines after the H1: `**Key:** value`.

| Attribute | Applies to | Required | Vocabulary | Consumed by |
|---|---|---|---|---|
| Type | all pages | yes | venture · person · helper · resource · work · guide · source | type indexes, master index, templates lint |
| Status | all pages | yes | Stub · Draft · Useful — page maturity; see "Status and Confidence" below | trust display |
| Confidence | all except guides | yes | High · Medium · Low — evidentiary support; see "Status and Confidence" below | trust display, index lines |
| Focus | all except sources | yes | free tags, comma-separated | index lines, shortlisting |
| Domain | venture, person, helper, resource, work | rollout in progress | energy · health-bio · aerospace-defense · computing · materials-mfg · space-science · capital-programs · culture-place — first entry is primary | sector hubs, facet indexes |
| Primary Location | venture, person, helper, resource, work | rollout in progress | canonical main home: HQ, main lab, main site, institution, or `unknown` | identity, shortlisting, location migration |
| Utah Location | venture, person, helper, resource, work | rollout in progress | verified Utah city/county/site/area; `statewide`; `no verified Utah presence`; `unknown` | Utah-footprint audit, future region derivation |
| Region | venture, person, helper, resource, work | rollout in progress | normalized by-region key derived from Utah Location: Utah city/county/area; `statewide`; `no verified Utah presence`; `unknown` | by-region view |
| Map Location | venture, helper, resource, work | optional; required with any explicit map field | public Utah site at the same granularity as Coordinates; people/private/ambiguous entities are generated only from coarse Region anchors | regional overlay, map display |
| Coordinates | venture, helper, resource, work | optional; required with any map field | WGS84 decimal `latitude, longitude`; Utah bounds only | `/locations.geojson`, future proximity queries |
| Location Precision | venture, helper, resource, work | optional; required with any map field | exact · approximate | regional overlay privacy and map display |
| Location Source | venture, helper, resource, work | optional; required with any map field | public `https://` URL supporting the mapped site | regional overlay provenance |
| Identifiers | venture, person, helper, resource, work | rollout in progress | `key=value` pairs, comma-separated, from the closed key list in "Identifiers" below | registry harvesters (the join key), evidence health view, lint |
| Source Type | source | yes | closed: filing · government-record · dataset · peer-reviewed · patent · preprint · news · reference · testimony · official-page · press-release — see "Source Type and tiers" | evidence tiering, Confidence check, lint |
| Retrieved | source | yes, where the page has a `URL:` that resolves; **written by scripts only** | `YYYY-MM-DD` a script last fetched the live URL successfully | staleness, drift re-check |
| Archive | source | required for self-reported/secondary tiers | one bare `https://web.archive.org/...` snapshot URL | ephemerality insurance |
| Archived | source | required with Archive | `YYYY-MM-DD` capture date of that snapshot | ephemerality insurance |
| Raw | source | required for self-reported/secondary tiers | repo-relative path into `raw/`, written by scripts | verbatim verification, drift detection |
| Needs-reviewed | any page with `## What They Need Now` | yes (with that section) | `YYYY-MM-DD` | needs board staleness flags |
| Roles | any page with `## What They Need Now` | optional | software-engineering · data-science · biology-life-sciences · physical-sciences · hardware-engineering · manufacturing-operations · clinical-regulatory · product-design · sales-business-development · marketing-communications · finance-accounting · legal-policy · program-project-management · field-skilled-trades · people-operations — comma-separated; each role must be stated or clearly supported by the needs section | by-role directory and role views |
| Website | venture, helper, resource, work | optional | bare `https://` URL (no markdown link) — official site | needs board, agent shortlists |
| Careers | venture, helper, resource | optional | bare `https://` URL (no markdown link) of the org's general careers/jobs page or its own ATS board — never a single posting, an aggregator, or a raw ATS API endpoint | needs board, job-seeker next step |
| Ownership | venture | optional (candidate for required) | founder-led private · private · public · PE-owned · nonprofit · government | judgment layer (see charter.md) |
| URL | source | yes | the one document this source page is about, or `Unknown` when no official page could be confirmed | capture, archive resolution, tier checks, lint |
| Publisher | source | optional | who published the document, when that is not the subject itself | attribution by a reader |
| Published | source | optional | `YYYY-MM-DD` the document itself carries, distinct from `Retrieved` | dating a claim to the document, not the fetch |
| Additional Map Location | venture, helper, resource, work | optional | `address \| latitude, longitude \| exact\|approximate \| https://source` — one per line, requires a complete primary map tuple | map display for multi-site entities |
| Stage | venture | optional | free text: maturity, ownership, and funding posture — **asserted, not sourced; see below** | by-stage view (grouping key derived at build time) |
| Era | work, venture, person | optional | free text naming the period the work spans — **asserted, not sourced; see below** | by-era view (grouped by the earliest year named) |
| Audience | guide | optional | who the guide is written for | guides view |
| Relates | any | optional | `cites [Page](slug.md)` — **legacy**; the corpus derives this from `## Evidence` into the [evidence graph](../views/evidence.md), and lint treats a source reachable only from here as uncited | nothing; kept until removed |
| Domain-flagged | any | no | `review` | lint queue for editor adjudication |
| Location | legacy only | no | superseded by `Primary Location` + `Utah Location` | lint warning until removed |
| Updated | all pages | yes | `YYYY-MM-DD` | index lines, staleness |

Lint holds this table's key column as a closed set (`unknown-metadata-key`). That is aimed at
misspellings: `**Regoin:**` drops a page out of every regional view while still looking attributed
on the page, and nothing else would notice.

### Asserted but unsourced: Stage, Era, Audience

These three are now consumed — `Stage` and `Era` group [by-stage](../views/by-stage.md) and
[by-era](../views/by-era.md), `Audience` prints on [guides](../views/guides.md) — but they are
**unlike every other attribute in the table above**, and the difference matters more than the
coverage number.

`Domain`, `Region`, `Type`, `Focus` describe *placement*: where a page belongs in the corpus. Being
wrong about them misfiles a page. `Stage` and `Era` assert *facts about the world* — that a company
is public, that an era ran 1991 to the present — in the same bold-prefix register readers have
learned to trust, while **no source page backs them and no check governs them**. `Confidence` grades
the page body's evidence and says nothing about these lines. So a reader who acts on "public
(NASDAQ: MYGN)" is trusting an unattributed assertion that looks exactly like a checked one.

The debt: **every `Stage` and `Era` value needs a citation**, at which point they become gradeable
like anything else. Until then both views carry the warning inline, which is where a reader who can
act on it actually is. `Stage` is the more urgent of the two — it is the more volatile claim (a
funding round dates in months) and the more consequential one, and its free text frequently
re-encodes `Ownership`, which is already a closed vocabulary above.

Grouping keys for both are **derived at build time** from the free text (131 distinct `Stage` values
across 135 pages), not stored — see `STAGES` and `ERAS` in `build-views.mjs`. That keeps the
author's wording authoritative, prints it beside every entry, and means correcting the buckets never
means rewriting pages. When these fields get sources, a closed vocabulary should replace the
heuristic.

### Removed 2026-08-11: Layout, Hero, Hero caption

Deleted from 353 pages. `Layout` held the single value `field-guide` on all 241 pages that had it.
`Hero` was 112 values of which 106 were `picsum.photos` placeholders and 5 more pointed into
`/img/heroes/front/`, a directory that does not exist — and `prerender.mjs` suppressed the field
from display anyway, so every one of them was written, hidden, and dangling. `Hero caption` largely
annotated those placeholders as placeholders.

Recorded because the failure is worth recognizing again: metadata that nothing reads does not stay
neutral. Agents saw 241 pages carrying `**Layout:**` and copied it forward, so the corpus kept
manufacturing a field whose only effect was to make the next agent write it too.

## Identifiers

`**Identifiers:**` records the stable keys that let a machine pull an entity's primary records from
public registries — forever, without a search. One line, lowercase keys, `key=value`, comma-separated:

```
**Identifiers:** cik=0000899923, ein=87-0494517
```

Closed key vocabulary and the shape lint enforces:

| Key | Shape | What it unlocks |
|---|---|---|
| `cik` | 10 digits, zero-padded | SEC EDGAR filings, XBRL financial facts |
| `ein` | `##-#######` | IRS exempt-org records, Form 990 financials |
| `uei` | 12 alphanumerics | federal contracts and grants (USAspending, SAM) |
| `lei` | 20 alphanumerics | global legal-entity registry |
| `ror` | `0` + 8 alphanumerics | research institutions; papers and grants |
| `orcid` | `####-####-####-###[0-9X]` | a researcher's publication record |
| `utah-entity` | Utah Division of Corporations entity number | state registration, status, registered agent |
| `wikidata` | `Q` + digits | cross-registry reconciliation |

Rules. **Corroborate before recording**: a key belongs to this entity only if the registry's own
name *and* city/state match the page, or another primary record links them. A wrong key is worse than
no key, because every later harvest inherits it. When resolution fails, record nothing and say why in
`## Open Questions` — P3. Identifiers are for organizations and public researchers; never record a
key that identifies a private individual's household or a private address.

**How much the place has to match depends on the registry**, and the first corpus-wide resolution
run settled it in both directions. For `ein`, place is required: IRS exempt-organization names are
regional by construction and collide across states, so a flawless name match found a Davis Chamber
of Commerce in Oklahoma, a Carbon County economic development office in Wyoming, and an unrelated
Michigan charity called Ancestry. For `cik` the same requirement would be wrong — Fervo files from
Houston and drills in Beaver County, Northrop's Promontory plant answers to Virginia — and a CIK is
unique to a registrant, so an exact name match is already decisive. Two further traps: a near-match
is not a match when the extra word names a different legal entity (`Cotopaxi Foundation` is not
Cotopaxi, and a foundation's finances are not the company's), and **prefer the entity's own
registrant over its parent's** — a subsidiary carrying the acquirer's CIK hands a harvester the
parent's consolidated financials (see `blue-raven-solar.md`). `scripts/resolve-identifiers.mjs`
enforces all of this; `--audit` is what keeps it honest.

## Source Type and tiers

The vocabulary is closed, and each value carries a **tier** that says what kind of trust it can
carry. Tier is not a separate attribute — it is a property of the type, listed here.

| Source Type | Tier | What it is |
|---|---|---|
| `filing` | primary | filed with a regulator or court under legal accuracy duties — SEC 10-K/S-1/424B4/Form D, IRS 990, state corporate filings |
| `government-record` | primary | a record a government created in the course of its own business — award record, permit, statute, docket |
| `dataset` | primary | a published machine-readable dataset or API from an authoritative publisher — IRS BMF, USAspending, EIA, PatentsView |
| `peer-reviewed` | primary | a paper in a peer-reviewed venue; cite the DOI |
| `patent` | primary | a granted patent or published application |
| `preprint` | secondary | arXiv/bioRxiv/working paper — real evidence, not yet reviewed |
| `news` | secondary | independent journalism or trade press — a newsroom with no stake in the subject |
| `reference` | secondary | an encyclopedia, wiki, or history/reference site summarizing other work — Wikipedia, ETHW, an agency's history essay |
| `testimony` | secondary | a firsthand account by a named or anonymous participant; the wiki holds the report itself. Includes public community-channel posts — see "Community-channel testimony" below for which workspaces are citable and what such a page may and may not carry |
| `official-page` | self-reported | the subject's own site, program page, fact sheet, or collection record |
| `press-release` | self-reported | an announcement by the subject, its funder, or its agency about itself |

This is what makes Confidence checkable: **`Confidence: High` requires at least one cited source at
the primary tier.** A page whose entire evidence base is `official-page` and `press-release` is
Medium at best, however many links it carries.

**Tier follows the speaker and the duty to preserve — not the letterhead.** A `.gov`, `.edu`, or
museum URL is not primary by domain. The question is which of two things you are looking at:

- A record an institution *created in the course of its duties*, and must keep: an SEC filing, an FDA
  drug label, a Rogers Commission report, a permit, a docket, an award record. **Primary.**
- A page an institution *published about itself or about history*: a program page, a fact sheet, a
  news article on `army.mil`, a state history essay, a lab's own site. **`official-page`,
  `press-release`, or `reference`** depending on whether it is marketing, an announcement, or a
  summary of other work.

This distinction is the whole point of tiering, and it was exactly what the pre-2026-08 freeform
vocabulary destroyed: eleven pages were typed `Government Record`, of which four were agency news
articles and history essays. Migrating them by their old label would have promoted press releases to
primary tier and made the Confidence check worthless.

Two consequences worth stating, because both look wrong at first glance:

- **Multi-document source pages are allowed only when every document shares one type.** Two
  peer-reviewed papers on one page is fine. A university explainer plus the journal paper it
  describes is not: split it, because one `Source Type` cannot describe both and taking either value
  misrepresents half the claims.
- **A third-party register is not primary unless someone must keep it.** A B Corp certification
  listing is authoritative about the certification and still `official-page`, because B Lab is under
  no obligation to preserve the page. It therefore needs an archive snapshot, which is the behaviour
  we want.

## Verbatim excerpts and archives

A link is not evidence once it 404s. Two failure modes, two fixes, and which one applies is decided
by tier:

- **Primary tier** (`filing`, `government-record`, `dataset`, `peer-reviewed`, `patent`) — the
  publisher is the archive. Record the accession number, award ID, DOI, or query in the page and the
  record stays retrievable. `Archive` is optional. Quote the artifact when the claim is prose rather
  than a table cell.
- **Self-reported and secondary tiers** (`official-page`, `press-release`, `news`, `reference`,
  `preprint`, `testimony`) — nobody is obliged to keep these. Three things are required:
  1. `**Archive:**` + `**Archived:**` — a snapshot URL and its capture date.
  2. `**Raw:**` — the captured document itself, in `raw/` (below).
  3. `## Verbatim` — the *exact* sentences the claims rest on, as blockquotes, each with a locator
     (`— Home page, "Amenities"`). Never paraphrase inside a blockquote; paraphrase belongs in
     `## Useful Claims`. Budget ≤1,500 characters per page: quote the load-bearing sentences, not
     the document.

### Community-channel testimony

**Maintainer ruling, 2026-08-11. Normative. Do not reverse this without the maintainer.** In their own
words:

> The Forge Utah, JustBuild, and NUNUG slacks are public, so the information within them can be
> treated as public too. Try not to post private-ish conversations/threads, but in general, anything
> on there can be treated similarly to, say, a reddit post.

This restates a rule already recorded in the scraper that feeds this wiki
(`~/coding/scrapers/README.md`, "Sourcing rules"): *Slack is citable when no other source exists, but
Slack is ephemeral, so every captured message must be a self-contained citation.*

What follows from it:

- **Citable:** the Forge Utah, JustBuild, and NUNUG workspaces. Treat their public channels like a
  public forum post.
- **Never citable:** the Sandbox workspace (`sandboxu.slack.com`). It is leads-only — use it to find
  companies and founders, then source every claim from the company's own site or a public record.
  This half of the rule is unchanged and is not covered by the ruling above.
- **DMs and group DMs are not collected** and must never appear.
- **Editorial restraint still applies.** An announcement written to be spread is the easy case; a
  member working through a personal decision is not, even in a public channel. Prefer announcements,
  public claims about public things, and statements made in a professional capacity. Never reproduce
  a résumé, a phone number, a personal email, or a job search in progress.
- **`Source Type: testimony`, and the tier is about durability, not secrecy.** A workspace permalink
  resolves only for signed-in members, so no script can fetch it signed out and the Internet Archive
  cannot crawl past the login, and Slack retention will eventually delete the message. Such a page
  therefore carries **no `Retrieved:` and no `Archive:`/`Archived:`** — their absence is the signal
  that this is a source nothing can re-fetch. Do not stamp `Retrieved:` onto one; a date there would
  assert a successful live fetch that never happened, which is exactly the false staleness signal this
  registry exists to prevent. (`migrate-source-metadata.mjs` did that once, off a 200 that was a
  62KB login shell; `isAuthWalledHost()` now stops it.)
- **It does carry `Raw:`, and the verbatim check applies in full.** The messages were captured with a
  real session by the scraper that feeds this wiki, so they are not lost to us — run
  `node scripts/capture-slack-sources.mjs --stem <slug> --write`. It matches each `## Verbatim`
  blockquote against the message corpus, writes the messages that carry them into `raw/<slug>/`, and
  **refuses to capture a page whose quote matches no message**, naming the quote. That makes it the
  fabrication check run at capture time rather than at lint time. Its first run rejected four quotes
  across three pages where an author had silently tidied the source — inserted `/` separators between
  what were newlines, an em-dash that was not there, a comma inside an address. None changed the
  meaning; all of them made the quote something the speaker did not type, which is the thing this
  mechanism exists to catch.
- **The self-contained quote is the durability mechanism.** Every blockquote carries speaker, channel,
  workspace, and ISO date inline, and is long enough to stand alone once the original is gone.
- **`## Reliability Notes` must state the limit.** An announcement proves scheduling, never
  attendance; a reader's opinion proves reception, never the fact being asserted.

Two worked examples, both cases where the ephemeral channel is *more accurate than the public
website*: `nunug-2026-meeting-announcements.md` (the group's site looks dormant while it has met
monthly since a "comeback meeting") and `utah-kids-code-camp-2026-announcements.md` (the event page
shows the final date as though the camp had never been rescheduled).

**Known gap:** because there is no `Raw:` capture, `verbatim-not-in-raw` cannot check these quotes, so
a fabricated Slack quote would currently land undetected. The fix and its rationale are in
`research/raw-data/class-c-private-ephemeral-sources.md`; until it lands, these pages depend on author
discipline rather than on the mechanical check.

`## Verbatim` is also the corpus's anti-fabrication device, and it is checked twice:

- **every figure asserted in `## Useful Claims` must appear in `## Verbatim`**
  (`claim-figure-not-in-verbatim`). If a number cannot be quoted, it cannot be claimed.
- **every `## Verbatim` blockquote must appear in the captured raw document**
  (`verbatim-not-in-raw`). This is the stronger check: it makes a quote a *substring of the source*
  rather than a substring of our own page, so a fabricated or silently "tidied" quote fails the build
  even when it is internally consistent.

`**Retrieved:**` is written by scripts, never by hand — a hand-typed retrieval date is the authoring
date wearing a costume, which is why every date in the pre-2026-08 corpus landed inside one
three-month window and the staleness signal was worthless. A page whose URL no longer resolves has
**no** `Retrieved:`; absence is the signal, and the archive and raw capture are what carry the claims.

## Raw captures (`raw/`)

`raw/` holds captured source documents with **none of our content in them** — no metadata, no
commentary, no schema. One directory per source page, one file per capture:

```
raw/<source-slug>/<YYYY-MM-DD>-<sha256-first-12>.txt    the extracted document text
raw/<source-slug>/<YYYY-MM-DD>-<sha256-first-12>.json   url, fetched-at, status, content-type, hashes
```

**Captures are immutable, and the filename enforces it.** The name contains the hash of the contents,
so an edited capture is a different file by construction — there is no way to quietly revise one. When
a page changes, capture it again; both captures stay, and the pair is the drift record. Nothing in
`raw/` is ever edited or deleted, which is what lets `**Raw:**` be a stable citation target.

Rules that keep it small and honest:

- **Class B only.** Primary-tier sources are already kept by their publisher under a mandate; a 10-K
  is retrievable from EDGAR forever by accession number, so copying it here is redundant. Capture what
  nobody else is obliged to keep.
- **Extracted text, not bytes.** Text is what a claim rests on, and it is greppable, diffable, and
  ~20× smaller than the HTML. The `.json` sidecar keeps the hash of the original bytes so the
  extraction can be audited against a Wayback copy.
- **HTML and PDF are both capturable.** `capture-raw-sources.mjs` routes on content type, extracting
  markup itself and PDFs via `scripts/lib/pdf-text.mjs`. A PDF capture records `document_format`,
  `pdf_pages`, and `text_extractor` in the sidecar. This matters for sourcing strategy: Inspector
  General audits, agency reports, court filings, and Federal Register notices are all in reach, so
  "it's a PDF" is no longer a reason to settle for a press release about the document. A scan with no
  text layer still fails, loudly — it needs OCR, which the wiki does not do.
- **Not published.** `raw/` is a repo asset, not a wiki route: it is not copied into `dist/` and not
  listed in `llms.txt`. Agents get the verbatim excerpts, which is what they need; the raw store is
  what lets *us* prove the excerpts are real. Publishing it is a live question, deferred with a named
  trigger in `research/design/raw-source-capture.md`.

## Status and Confidence

These two are rendered as badges at the top of every prerendered page, so they are the first thing a reader or an arriving agent uses to decide how much weight to put on the page. Both vocabularies are closed and lint-enforced (`invalid-status`, `invalid-confidence`).

### Status — how complete the page is

Status grades the **page**, never the subject and never the facts. It answers "how much of this page is written?", so a reader can check it against the page in front of them.

- **Stub** — a placeholder. The page identifies its subject and little else: sections required by its Type are missing or one line long, and `## Evidence` is empty or holds a single link. Treat it as a pointer that the subject exists and a note that someone should write it; do not expect it to answer a question.
- **Draft** — written but unfinished. The required sections for the Type all exist and say something real, but at least one is thin, a known gap is unfilled, or facets (`Domain`, `Region`, the map tuple) are still unattributed. This is the default for a page produced in one research pass and not returned to, and it is where most of the corpus sits.
- **Useful** — complete for its Type. Every required section is present and substantive, each load-bearing claim has an Evidence line behind it, and `## Open Questions` names what is still unknown instead of leaving the gap silent. A reader can act on the page without first going to another one.

**Status is not a fact-verification claim.** No value here means a human checked the facts. Pages are merged by one maintainer who catches nonsense and off-scope material; that gate does not fact-check sentences. `Reviewed` was in this registry until 2026-07-27, was never used by any page, and is retired precisely because it implied a review that does not happen. Verification lives in Confidence and in `## Evidence`.

Status is written by whoever last edited the page, and it should be raised only by editing the page up to the next definition — never as an assertion about the subject's own health or activity. A dormant company can have a Useful page; a thriving one can have a Stub.

### Confidence — how well the cited evidence supports the claims

Confidence grades the **evidence**, read against the page's `## Evidence` section (on `Type: source` pages, against the artifact itself and `## Reliability Notes`). A load-bearing claim is a sentence a reader would repeat or act on: what the entity does, what it built, the number, the date, the location, the current state.

- **High** — every load-bearing claim traces to a **primary-tier** source cited on the page (see "Source Type and tiers"): an SEC or state filing, an IRS 990, a government dataset or award record, a peer-reviewed paper, a patent, a court document, a statute. Where sources conflict, the page says which it followed and why. A subject's own website is `self-reported`, not primary: it is good evidence of what the subject says and weak evidence that the thing is so.
- **Medium** — sourced, but one link in the chain is weaker: secondary reporting (trade press, local news, a university press release) standing in for the primary record; an official source that is plainly out of date; or a page where most claims are well cited and a named minority are not. This is the honest default for a page assembled from public reporting rather than documents.
- **Low** — the evidence does not carry the claims. A single source; a source that only repeats what the page asserts (self-description, marketing copy); material inference from adjacent facts; or a source that could not be retrieved and verified. Follow the Evidence links before repeating anything from a Low page.

Two rules keep the grade auditable. **Grade to the weakest load-bearing claim, not the average** — one unsupported number in an otherwise well-cited page makes it Medium. And **only sources move the grade**: adding citations raises Confidence, adding prose does not. If a page's Confidence and its Evidence section disagree, the Evidence section is right.

### They are orthogonal

Status and Confidence measure different things and move independently. Any of the nine combinations is legitimate; neither is a tiebreaker for the other.

- **Stub + High.** A page created the day a program is authorized, carrying the program's name, its authorizing bill number, and one Evidence line pointing at the enrolled statute. Nothing is written — no Who It's For, no How To Use It — so it is a Stub. The one claim it makes is carried by the primary document it cites, so it is High. Writing the rest of the page will not raise its Confidence; finding out whether the program actually opened will.
- **Useful + Low.** `araknitek-official-website.md` is finished: it states plainly that no official URL could be confirmed, records what the venture page's claims actually rest on (the USU Randy Lewis lab's research record, not the company's own materials), and says what would resolve it. There is nothing left to write, so it is Useful. What it rests on is a lab's publication record and inference about a spinout that may be dormant, so it is Low. Citing more sources would raise it to Medium; adding sections would only make it longer.

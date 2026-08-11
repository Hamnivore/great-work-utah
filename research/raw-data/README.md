# Raw source capture — playbook

Operational companion to [`../design/raw-source-capture.md`](../design/raw-source-capture.md), which
holds the argument, the phasing, and the falsifiers. This file is what an agent needs open while
actually doing the work. Schema lives in `wiki/meta/attributes.md` ("Identifiers", "Source Type and
tiers", "Verbatim excerpts and archives") and `wiki/meta/conventions.md` (P5 and its precedents).

**Phase 0 is done** (2026-08-11): the schema, the lint checks, and three worked pages —
`myriad-genetics.md`, `fervo-energy.md`, `business-technical-assistance-center.md` — plus the six
source pages they cite. Read those three before starting a shard; they are the format.

**The whole corpus was migrated onto the closed vocabulary the same day**, so there is no "legacy"
class of page and no check that skips one. All 231 source pages carry a vocabulary `Source Type`;
`Accessed:` is gone and is now a hard error; `Retrieved:` is script-written only. What remains is a
counted backlog, regenerated on every lint run at `capture-backlog.md`.

## The two-class rule

Decide this first, every time, because it determines the whole procedure:

- **Primary tier** (`filing`, `government-record`, `dataset`, `peer-reviewed`, `patent`) **cited at
  its issuing body** — an institution keeps it under a mandate. Capture the **key**: identifier plus
  accession/award/DOI, and the API path that returns it. No snapshot, no raw capture.
- **Everything else** — `official-page`, `press-release`, `news`, `reference`, `preprint`,
  `testimony`, *and* any primary document cited through a mirror rather than the issuing body.
  Nobody must keep these. Capture the **bytes**: `**Archive:**` + `**Archived:**`, a `**Raw:**`
  capture in `raw/`, and a `## Verbatim` section of exact quotes, ≤1,500 characters.

Don't copy what a government keeps; don't merely link what nobody keeps. And note the second clause
covers a case that looks like the first: a 10-K is permanent at EDGAR, but a 10-K cited through
`edgar.secdatabase.com` is a permanent record behind an impermanent link. Lint reports those as
`primary-behind-mirror`; fix the URL, or capture it.

Tier follows **the speaker and the duty to preserve, never the domain**. A `.gov` news article is a
press release. A state history essay is `reference`. This is not pedantry: the pre-migration corpus
had eleven pages typed `Government Record`, four of which were exactly those two things.

## Commands

```bash
npm run sources:migrate                      # dry run: show the Source Type plan and any refusals
npm run sources:retrieve                     # --write --probe: migrate + fetch URLs for Retrieved
npm run sources:capture -- --stem <slug> --write     # capture one document into raw/
npm run sources:capture -- --all --limit 20 --write  # work the backlog in batches
node scripts/wiki-lint.mjs                   # verifies every quote against its capture
```

`migrate-source-metadata.mjs` refuses rather than guesses: an unmapped value or a page bundling
documents of different tiers is reported for a human, not assigned a plausible type. If you add a
mapping, add it to the table in the script so the decision is reviewable — never to a regex.

## Working the capture backlog

Each page in `capture-backlog.md` needs four things, in this order:

1. `npm run sources:capture -- --stem <slug> --write` — fetches the live URL, falling back to the
   `Archive:` snapshot when the live one is gone, and writes `raw/<slug>/<date>-<hash>.txt`.
2. `**Archive:**` + `**Archived:**` — a Wayback snapshot URL and its capture date.
3. `## Verbatim` — the load-bearing sentences, quoted exactly from the capture you just made. Read
   the capture; do not quote from memory of the page.
4. `node scripts/wiki-lint.mjs` — `verbatim-not-in-raw` will tell you if a quote is not a literal
   substring of the document. If it fires, the quote is wrong or the page changed under you. It is
   not a formatting nit, and the fix is never to loosen the check.

Captures are immutable: never edit or delete one, re-capture instead. `raw/README.md` explains why
the filename carries a content hash.

## Registry endpoints, as probed 2026-08-11

Status is what a plain `curl` with an identifying User-Agent returned on that date. Re-verify before
relying on any of them, and add corrections here.

| Registry | Endpoint | Auth | Probe | Notes |
|---|---|---|---|---|
| SEC company index | `https://www.sec.gov/files/company_tickers.json` | none | 200 | name/ticker → CIK, 795 KB |
| SEC submissions | `https://data.sec.gov/submissions/CIK##########.json` | none | 200 | every filing, EIN, addresses, former names |
| SEC XBRL facts | `https://data.sec.gov/api/xbrl/companyconcept/CIK##########/us-gaap/<tag>.json` | none | 200 | exact figures with the accession that reported them |
| SEC full-text search | `https://efts.sec.gov/LATEST/search-index?q=<query>&forms=<form>` | none | 200 | use this, **not** `www.sec.gov/cgi-bin/browse-edgar` (403) |
| USAspending | `https://api.usaspending.gov/api/v2/...` | none | 200 | search endpoints are **POST**; GET returns 405 |
| SBIR/STTR | `https://api.www.sbir.gov/public/api/awards` | none | **429** | rate-limited on the first request; back off and cache |
| NIH RePORTER | `https://api.reporter.nih.gov/v2/projects/search` | none | 405 on GET | **POST** with a criteria object |
| NSF awards | `https://api.nsf.gov/services/v1/awards.json?awardeeStateCode=UT` | none | 200 | trivial statewide sweep |
| ClinicalTrials.gov | `https://clinicaltrials.gov/api/v2/studies` | none | 200 | |
| openFDA | `https://api.fda.gov/device/510k.json`, `/drug/drugsfda.json` | none (keyed = higher limits) | 200 | |
| IRS BMF (Utah) | `https://www.irs.gov/pub/irs-soi/eo_ut.csv` | none | 200 | 2.2 MB; **best source of Utah EINs** |
| ProPublica Nonprofits | `https://projects.propublica.org/nonprofits/api/v2/organizations/<ein>.json` | none | 200 | 990 history; attribution requested |
| Crossref / OpenAlex / ORCID / ROR | `api.crossref.org`, `api.openalex.org`, `pub.orcid.org`, `api.ror.org` | none | 200 | papers, authors, institutions |
| OSTI (DOE) | `https://www.osti.gov/api/v1/records` | none | 200 | |
| NASA TechPort | `https://techport.nasa.gov/api/projects` | none | 200 | |
| GLEIF | `https://api.gleif.org/api/v1/lei-records` | none | 200 | thin for private US firms |
| Wayback availability | `http://archive.org/wayback/available?url=<url>` | none | 200, **429s easily** | one at a time, with sleeps |
| Wayback CDX | `https://web.archive.org/cdx/search/cdx?url=<url>&output=json` | none | 200 (occasionally times out) | `limit=-6` for latest; the `length` column reveals when a site broke |
| Wayback Save Page Now | `https://web.archive.org/save/` | **archive.org S3 keys** | 401 | **maintainer prerequisite** — no new captures without it |
| PatentsView | `https://search.patentsview.org/api/v1/patent/` | **free API key** | no response without key | |
| USPTO ODP | `https://api.uspto.gov/api/v1/...` | **API key** | 401 | |
| EIA v2 | `https://api.eia.gov/v2/...` | **free API key** | 403 | bulk EIA-860 files are keyless |
| SAM.gov entities | `https://api.sam.gov/entity-information/v3/entities` | **API key** | 404 without key | USAspending usually suffices |
| grants.gov | `https://api.grants.gov/v1/api/search2` | none | 403 on GET | POST only |
| Utah Div. of Corporations | `https://secure.utah.gov/bes/` | none | 301 → live | no documented API; expect scraping + browser fallback |
| transparent.utah.gov | `https://transparent.utah.gov/` | none | 200 | state contracts and expenditures by vendor |
| opendata.utah.gov | `https://opendata.utah.gov/api/catalog/v1?q=<term>` | none | 200 | Socrata catalog |
| UGRC geospatial | `https://opendata.gis.utah.gov/` | none | 200 | authoritative Utah layers |
| Utah DWS | `https://jobs.utah.gov/wi/data/` | none | 200 | employment and wage series |
| Utah Legislature | `https://le.utah.gov/` | none | 200 | bills and appropriations for `resource` pages |
| Utah DOGM | `https://oilgas.ogm.utah.gov/` | none | 200 | wells, mines, operators |
| GOEO incentives, Utah DEQ permits | — | none | guessed paths soft-404'd | locate current index during Phase 3 |

Send a real User-Agent that identifies the project (SEC requires it; several others rate-limit
anonymous traffic harder).

## Worked recipes from Phase 0

Company → CIK → figures, entirely deterministic:

```bash
UA='greatutah.work wiki research (contact via https://greatutah.work/about)'
curl -sS -A "$UA" https://www.sec.gov/files/company_tickers.json \
  | jq -r '.[] | select(.title|test("MYRIAD";"i")) | "\(.cik_str) \(.ticker) \(.title)"'
curl -sS -A "$UA" https://data.sec.gov/submissions/CIK0000899923.json \
  | jq -r '"ein: \(.ein)  addr: \(.addresses.business.street1), \(.addresses.business.city)"'
curl -sS -A "$UA" https://data.sec.gov/api/xbrl/companyconcept/CIK0000899923/us-gaap/NetIncomeLoss.json \
  | jq -r '.units.USD[] | select(.form=="10-K" and .fp=="FY") | "\(.start)..\(.end) \(.val) \(.accn)"'
```

Filing document URL from an accession number: strip the dashes for the directory —
`0000899923-26-000018` → `https://www.sec.gov/Archives/edgar/data/899923/000089992326000018/<primaryDocument>`.

Quoting a filing: download once, strip tags, then grep windows around keywords. Never read a 10-K
into an agent's context to find one number.

```bash
python3 - <<'PY'
import re, html
raw = open("filing.htm", encoding="utf-8", errors="replace").read()
raw = re.sub(r"(?is)<(script|style).*?</\1>", " ", raw)
txt = html.unescape(re.sub(r"(?s)<[^>]+>", " ", raw))
open("filing.txt", "w").write(re.sub(r"[ \t\u00a0]+", " ", txt))
PY
rg -o '[^.]{0,220}full-time equivalent employees[^.]{0,220}\.' filing.txt
```

Nonprofit → EIN → status and financials:

```bash
curl -s https://www.irs.gov/pub/irs-soi/eo_ut.csv | rg -i 'SOUTHEASTERN UTAH BUSINESS'
curl -s https://projects.propublica.org/nonprofits/api/v2/organizations/870530362.json | jq '.filings_with_data[0]'
```

Dead or blocked URL, and when it died:

```bash
curl -sS -o /dev/null -w '%{http_code}\n' https://www.btac.business/          # 500
curl -s 'https://web.archive.org/cdx/search/cdx?url=www.btac.business&output=json&from=20240601&to=20250718&filter=statuscode:200'
curl -s --compressed 'https://web.archive.org/web/20250325062537id_/https://www.btac.business/' -o snap.html
```

Two traps that cost time in Phase 0: Wayback `id_` responses come back gzipped (use `--compressed` or
decompress), and a plain fetch of `fervoenergy.com` returns **403** from a WAF — which is not a dead
site. Verify with `npm run links:recover:browser` or the archive before touching Confidence.

Geocoding a primary-sourced address (Nominatim, identifying UA, ≥1 s between calls):

```bash
curl -sS -A 'greatutah-wiki-research/1.0 (https://greatutah.work/about)' --get \
  'https://nominatim.openstreetmap.org/search' \
  --data-urlencode 'q=322 North 2200 West, Salt Lake City, UT 84116' --data-urlencode 'format=jsonv2'
```

## What lint enforces

`node scripts/wiki-lint.mjs` (add `--json` for machine output). New codes:

| Code | Severity | Fires when |
|---|---|---|
| `invalid-identifier`, `duplicate-identifier`, `unexpected-identifiers` | error | `**Identifiers:**` key outside the vocabulary, wrong shape, repeated, or on a source/guide page |
| `incomplete-archive`, `invalid-archive`, `invalid-archived` | error | `Archive`/`Archived` half-present, not a `web.archive.org` URL, or not an ISO date |
| `invalid-retrieved` | error | `**Retrieved:**` is not `YYYY-MM-DD` |
| `claim-figure-not-in-verbatim` | warning | a figure in `## Useful Claims` is not carried by `## Verbatim` (±0.5% tolerance; claims that link another page are exempt) |
| `stale-retrieval` | warning | `Retrieved` older than ~6 months |
| `confidence-without-primary` | warning | `Confidence: High` while every tiered source cited is self-reported or secondary |
| `nonstandard-source-type`, `legacy-accessed`, `missing-archive`, `missing-verbatim` | warning, aggregated | rollout migrations — one finding each with examples, not 220 lines |

Coverage ratios in the summary are the progress metric: identifiers, Source Type in vocabulary,
Retrieved, Archive, Verbatim, and cited figures. Baseline on 2026-08-11, immediately after Phase 0:

```
Identifier coverage: 3/413        Source Type in vocabulary: 10/230
Retrieved coverage: 10/230        Archive coverage: 5/5     Verbatim coverage: 5/5
Cited figures: 34/285 numeric lines on fact pages
```

`claim-figure-not-in-verbatim` earned its place immediately: on first run it caught two roundings of
my own — "roughly $110,000" for a filed $109,245, and "$461.8 million" where only $461,836,000 was
quoted (that one is inside tolerance and passes; the first is not and did not). Trust it.

## Subagent shards

Nine rules in the plan; the ones that bite in practice:

1. **Scripts fetch, agents judge.** If an agent is transcribing numbers out of a fetched document, the
   pipeline is wrong. Extract with a script, quote with a script, let the agent choose *which*
   sentences matter and what the page should say.
2. **Disjoint file ownership.** A shard is a set of slugs. Nobody touches `wiki/views/` (generated),
   `wiki/meta/` (one editor), or another shard's pages.
3. **`unresolved` + reason code is a correct answer** (P3). Never let a shard invent a key it could not
   corroborate: registry name *and* city/state must match, or another primary record must link them.
4. **A checker agent gets the diff, not the task**, and tries to break it: is the number in the quote,
   does the URL resolve, does the identifier belong to *this* entity.
5. **PII.** No personal addresses, no private individuals' names where they add nothing. Form D and
   business registries expose officers and registered agents; BMF rows expose care-of contacts. The
   Phase 0 precedent is `irs-bmf-utah-exempt-organizations.md`, which quotes its row with
   `% [name redacted]`.
6. **Idempotence is the acceptance test.** Re-run a finished shard; the diff must be empty.

## Generated artifacts (all gitignored)

`research/raw-data/cache/`, `coverage-matrix.json`, `coverage-report.md`, `queue/`, `reports/`. The
durable assets are the identifiers and quotes on the pages themselves — everything here is
re-derivable from them, which is the point.

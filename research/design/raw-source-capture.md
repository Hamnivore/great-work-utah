# Raw source capture

**Status:** 2026-08-11. **Phase 0 is done and passed its gate** — the schema (D1–D6) is written into
`wiki/meta/`, the lint checks are live on the real corpus, and three pages plus six source pages are
worked examples. See [Phase 0 results](#phase-0-results-measured-2026-08-11) for what the two probes
measured. Phases 1–5 are not implemented.
Read [`static-html-is-the-second-half.md`](static-html-is-the-second-half.md)
for the two-channel model and `research/README.md` for the standing directives this plan obeys —
especially directive 2 (radical simplicity), directive 8 (test cold with subagents), and
`wiki/meta/conventions.md` P3 (record what you know; flag what you don't; never silently guess).

The goal: make every load-bearing claim in the corpus **re-derivable by a machine** from a primary
record, and make the corpus survive the death of the web pages it was written from.

---

## The problem, measured

Audited 2026-08-11 against 648 pages (413 fact pages, 224 `Type: source`, 11 guides). These are
counts, not impressions; the scripts are in the audit section at the bottom.

| Measure | Value | What it means |
|---|---:|---|
| Fact pages citing exactly one source page | 302 / 413 | The median claim has a single point of failure |
| Fact pages citing zero source pages | 63 | Evidence is a bare URL or nothing |
| Resource pages whose evidence is `startup-utah-resource-list` | 174 / 228 | One directory listing is the evidence for 42% of all fact pages |
| Source pages typed `Official Website` | 135 / 224 | The evidence base is mostly *what the subject says about itself* |
| Verbatim excerpts on source pages | **0** | Nothing survives the URL (the corpus's only 11 blockquotes are on resource pages) |
| `web.archive.org` URLs vs. distinct external URLs | 4 / 1,214 | No ephemerality insurance |
| Numeric prose lines with no adjacent citation | ~582 / 657 (89%) | Figures float free of their sources |
| Stable identifiers recorded | 2 CIK, 7 DOI, 3 NCT, 0 of everything else | No join key to any registry |
| `Accessed:` / `Updated:` dates outside 2026-05→2026-08 | 0 / 648 | Staleness signal is dead on arrival |
| Distinct `Source Type` values (41 used exactly once) | 49 | Unlintable vocabulary |

Read together they say one thing: **the wiki is currently a summary of the web, not a record of
primary sources.** It is not checkable (a linter cannot tell whether "$299M raised" is true, or
even where it came from), and it is not durable (when `atavistik.bio` reorganizes, the claim's only
support disappears and no future agent can tell what was on the page).

Two failure modes hide inside "ephemerality", and they need different fixes:

- **URL rot** — the address stops resolving. Fixed by an archive snapshot.
- **Content drift** — the address resolves and now says something else. Fixed by a verbatim
  excerpt plus a hash, so a re-check can *detect* the change instead of silently inheriting it.

Neither is fixed by adding more links.

---

## What "raw data" means here

The single most important decision in this plan. Sources split into two classes with opposite
capture strategies, and conflating them is how projects like this turn into a data warehouse.

**Class A — durable, queryable, canonical registries.** SEC EDGAR, USAspending, NIH RePORTER, NSF,
PatentsView, ClinicalTrials.gov, openFDA, IRS 990, EIA, Utah's own registries. Somebody with a
statutory mandate keeps these forever and serves them over an API. For Class A the raw asset we
capture is **a stable identifier plus the query that reaches the record** — a CIK, an EIN, a UEI, a
ROR, a Utah entity number. Given the key, every figure is re-derivable on demand, forever, by a
script. Copying the rows into git is redundant and rots.

**Class B — fragile, non-canonical, unique.** Company sites, press releases, program pages, local
trade press, one-off PDFs, university lab pages. Nobody is obligated to keep these and most will be
gone or rewritten in five years. For Class B the raw asset is **the bytes**: a verbatim excerpt
carrying the exact sentences the claim rests on, an archive snapshot URL, and a content hash.

The rule that follows: **don't copy what a government keeps; don't merely link what nobody keeps.**
135 of our 224 source pages are Class B *official websites* with no excerpt and no snapshot — the
single largest concentration of risk in the corpus, and the cheapest thing to fix.

### Not doing

- No parallel `wiki/data/` tree, no per-page JSON sidecars, no per-claim data objects. Deferred, with
  a named trigger (below), because every one of them needs new plumbing in the build copy step, the
  dev middleware, `vercel.json`, and `llms.txt` — see [Constraints](#constraints-the-machinery-imposes).
- No bulk dataset copies in git. The harvest cache is generated and gitignored, like
  `research/startup-state/live-catalog.json`.
- No LLM in the extraction path. See [Orchestration doctrine](#orchestration-doctrine), rule 1.

---

## Constraints the machinery imposes

Measured 2026-08-11. These are not preferences, they are what the build already does.

1. **Only `wiki/{pages,views,meta}` reach `dist/`**, via one `cp -r` in `package.json`. A new
   published directory needs: the copy step, a new branch in the `vite.config.ts` dev middleware
   (its regex is `^\/(pages|views|meta)\/([a-z0-9-]+\.md)$`), a Content-Type block in `vercel.json`
   (schema-validated on deploy, rejects unknown keys, cannot carry comments), and a `public/llms.txt`
   update or agents will never find it. That is five edits and a new interface to document — hence
   deferred.
2. **`scripts/build-search-index.mjs` bundles the full text of every page** into
   `api/_search-corpus.mjs` (2.39 MB today, ~1.06× the 2.25 MB page corpus) and ships it inside the
   search function. Page text is not free. Budget: ≤1,500 chars of excerpt per source page. At 224
   existing + ~400 new source pages that is ≈0.75 MB added to the corpus and the bundle — fine
   against Vercel's limits, and it makes `/api/search` *better*, because quoted figures become
   greppable.
3. **Cross-entity rollups already have a mechanism**: generated views (`wiki/views/`, P4 — pages are
   edited, views are compiled). If agents need "every Utah SBIR award", that is a generated view over
   page metadata, not a new data tree. **Trigger for revisiting `wiki/data/`:** a harvest family that
   produces more than ~50 rows per entity, or a real cold-agent failure that a view cannot fix.
4. **`api/contribute.ts` caps a page at 40,000 chars and opens one PR per page.** Bulk harvest goes
   through direct commits on a branch, not the endpoint. The endpoint stays the contribution ladder
   for outside agents; it is not an ingestion pipe.
5. **`scripts/wiki-lint.mjs` hard-codes its vocabularies** (`wiki/meta/attributes.md` is the human
   registry) and reports coverage ratios in its summary. New checks go in `lintPage()`; new
   cross-page checks after the page loop, next to the wanted-pages resolution.
6. **Established fetch idioms to copy, not reinvent**: `fetchProbe()` / `browserProbe()` /
   `waybackNearest()` in `scripts/recover-broken-links.mjs`; paginated `fetchAll()` +
   gitignored report writing in `scripts/check-startup-state-resources.mjs`; and — most
   important — `upsertMeta()` / `replaceSectionBody()` in `scripts/sync-startup-state-from-api.mjs`,
   which is the existing precedent for **writing machine fields onto a page without touching
   editorial prose**, idempotently.

---

## Schema decisions (Phase 0 settles these)

Each addition has to earn its place: `attributes.md` says an attribute exists only if a consumer
uses it. Named consumers below are lint, the harvesters, the re-check harness, and one new view.

**D1 — `**Identifiers:**` on fact pages.** One line, lowercase keys, comma-separated:
`**Identifiers:** cik=0001505952, utah-entity=8231610-0142, uei=XYZ123ABC456`. Closed key
vocabulary: `cik`, `ein`, `uei`, `lei`, `ror`, `orcid`, `utah-entity`, `wikidata`. Lint validates
shape per key (CIK 10 digits, EIN `##-#######`, UEI 12 alnum, LEI 20 alnum, ORCID `####-####-####-###[0-9X]`,
Wikidata `Q\d+`). Consumers: every Class A harvester (this is the join key), the coverage matrix, and
lint coverage output. **This is the highest-leverage single change in the plan** — it converts
"research this company" into "run twelve registries against a key".

**D2 — `## Verbatim` section on `Type: source` pages, required for Class B.** One or more
blockquotes of the *exact* sentences that carry the claims, each with a locator (page/section/heading)
and nothing paraphrased. ≤1,500 chars total. This is simultaneously the ephemerality insurance and
the anti-hallucination device: a figure that appears on a fact page must appear verbatim in an
excerpt on a cited source page, which is *mechanically checkable* (lint `figure-not-in-verbatim`).
It is the only defence against subagent-invented numbers that does not depend on trusting the agent.

**D3 — `**Archive:**` + `**Archived:**` + `**Retrieved:**` on source pages.** Wayback URL, its
capture timestamp, and the date a machine last fetched the live URL. `**Retrieved:**` is written
**only by scripts**, never by hand — that is what makes staleness real, given that all 648
hand-written dates today land in one three-month window. `**Accessed:**` becomes legacy with a lint
warning, following the `Location` → `Primary Location` precedent. Optionally `**Content-Hash:**`
(sha256 of normalized extracted text) so the re-check harness can report drift rather than guess.

**D4 — close the `Source Type` vocabulary, 49 → 9, and give each value a tier.** Proposed:
`filing`, `government-record`, `dataset`, `peer-reviewed`, `preprint`, `patent`, `official-page`,
`press-release`, `news`. Tier is documented per value in `attributes.md` (primary /
official-self-reported / secondary) rather than added as a new attribute. Payoff: the `Confidence`
rubric becomes enforceable for the first time — lint `confidence-without-primary` flags any
`Confidence: High` page whose cited sources are all self-reported or secondary. **Measured scope
(2026-08-11): 3 pages fire today, and ~12 of the 29 `Confidence: High` fact pages will fire once
Phase 2 closes the vocabulary** — not the "large share of 135" this section originally guessed, because
`Confidence: High` is rare (29 of 413 fact pages). The check is a scalpel, not a dragnet; the
official-website monoculture is a coverage-ratio problem, not a confidence-rubric one.

**D5 — figures cite inline; no new required section.** A load-bearing number in prose names its
source page inline with the existing link convention. No `## Key Figures` table: adding a required
section to 413 pages fights simplicity and would be filled with paraphrase. Lint gets
`figure-without-source` as a **warning** plus a coverage ratio in the summary (like Domain coverage),
so the 582-line backlog is visible and shrinking without blocking every PR.

**D6 — where bytes live.** ~~Excerpts in the page. Snapshots at the Internet Archive. Committing
bytes requires a maintainer decision; the default is no.~~ **Revised 2026-08-11 (maintainer
decision): captures are committed, in `raw/`.** Excerpts stay in the page and snapshots stay at the
Internet Archive, and in addition every Class B source page carries a `**Raw:**` capture of the
extracted document text, committed to the repo.

The reason to reverse the default is that it buys a check nothing else can: with the document
present, lint requires every `## Verbatim` blockquote to be a **literal substring of the capture**
(`verbatim-not-in-raw`). Before, a quote only had to be internally consistent with our own page,
which is no constraint at all on an agent that writes both. This is the anti-fabrication device D2
was reaching for and could not reach without the bytes.

Design, in `wiki/meta/attributes.md` "Raw captures" and `raw/README.md`:

- `raw/<source-slug>/<YYYY-MM-DD>-<sha256-first-12>.txt` plus a `.json` sidecar of fetch facts.
- **Immutability is structural, not a policy.** The filename carries the content hash, so an edited
  capture is a different file and cannot masquerade as the cited one. Re-capture rather than revise;
  both captures stay, and the pair is the drift record. This is the maintainer's own framing: if it
  is truly a raw document, keep it, and if it must change, that is a new copy.
- **Extracted text, not raw bytes** — what a claim rests on, greppable and diffable, ~20× smaller.
  The sidecar keeps the SHA-256 of the original bytes so extraction can be audited against Wayback.
- **Class B only**, plus primary-tier documents cited through a mirror (`primary-behind-mirror`).
  Never a document already permanent at its issuing body: `raw/` must not become a stale partial
  mirror of EDGAR.
- **Not published.** Not copied into `dist/`, not in `llms.txt`. Agents get the excerpts; the store
  is how we keep the excerpts honest. **Trigger for publishing it:** a cold-agent probe that fails
  because the agent wanted to check a quote against its document and could not.

Size, measured on the first six captures: 1.4–17 KB of text each, median ~4 KB. At ~220 Class B
pages that is well under 2 MB — smaller than the search index already in the repo.

---

## The registry: where raw data actually is

Probed live 2026-08-11 with a plain `curl` and an identifying User-Agent. Status is what I measured;
**re-verify at harvest time** and record aliases/quirks in the playbook, exactly as
`research/link-recovery/url-aliases.json` does for moved URLs.

### Class A — federal

| Family | What it yields | Join key | Probe 2026-08-11 | Notes |
|---|---|---|---|---|
| **SEC EDGAR submissions** `data.sec.gov/submissions/CIK##########.json` | filings index, addresses, former names | `cik` | 200 | UA header required by SEC policy; ~10 req/s |
| **SEC full-text search** `efts.sec.gov/LATEST/search-index?q=` | finds the CIK from a name; Form D hits | name → `cik` | 200 | `www.sec.gov/cgi-bin/browse-edgar` returned **403** — use efts |
| **SEC Form D** (via the two above) | **private raise amounts, dates, officers, HQ** for Utah startups | `cik` | 200 | Highest-yield unexploited vein for our 127 ventures. PII caveat below |
| **USAspending v2** `api.usaspending.gov` | contracts, grants, sub-awards, place of performance | `uei` | 200 (search endpoints are POST-only; GET → 405) | Public domain |
| **SBIR/STTR** `api.www.sbir.gov` | firm-level SBIR awards — dense for deep-tech ventures | firm name + state | **429 on first request** | Needs backoff/caching from the start |
| **NIH RePORTER v2** `api.reporter.nih.gov/v2/projects/search` | grants to U of U, USU, Utah companies | org name, `ein` | 405 on GET → POST required | |
| **NSF awards** `api.nsf.gov/services/v1/awards.json?awardeeStateCode=UT` | NSF awards statewide | awardee name | 200 | Trivial statewide sweep |
| **PatentsView** `search.patentsview.org` | patents by assignee + state | assignee name | **no response without key** | Free API key required; attribution terms |
| **USPTO ODP** `api.uspto.gov` | applications, assignments | assignee | 401 | Key required |
| **ClinicalTrials.gov v2** `clinicaltrials.gov/api/v2/studies` | trials, sponsors, sites | `nct`, sponsor | 200 | |
| **openFDA** `api.fda.gov` (510k, PMA, drugsfda) | device clearances, approvals | applicant name | 200 | |
| **IRS BMF** `irs.gov/pub/irs-soi/eo_ut.csv` | **every Utah exempt org + EIN**, 2.2 MB | name → `ein` | 200 | Best single source of EINs for helpers/resources |
| **ProPublica Nonprofit Explorer** `projects.propublica.org/nonprofits/api/v2` | 990 financials, officers | `ein` | 200 | Attribution requested |
| **EIA v2** `api.eia.gov/v2` | generator-level Utah plant data (EIA-860/923) | plant ID | 403 (key required); bulk 860 page 200 | For energy-domain pages |
| **OSTI / NASA TechPort / grants.gov** | DOE and NASA project records | award no. | 200 / 200 / 403 GET (POST) | Secondary priority |
| **Crossref · OpenAlex · ORCID · ROR · arXiv** | papers, authors, institutions | `doi`, `orcid`, `ror` | 200 (arXiv 301→https) | For `work` and `person` pages |
| **GLEIF LEI** `api.gleif.org` | legal entity identifiers | `lei` | 200 | Thin coverage for private US firms |
| **SAM.gov entities** | UEI ↔ legal name ↔ address | `uei` | 404 without key | Key required; USAspending is usually enough |

### Class A — Utah, which is where this wiki is differentiated

Nobody else is joining these to a curated corpus. This is the part of the plan with no substitute.

| Family | What it yields | Probe 2026-08-11 |
|---|---|---|
| **Utah Division of Corporations** business search (`secure.utah.gov/bes/`) | entity number, status, registration date, registered agent, principal address | 301 → live; no documented API, expect scraping + browser fallback |
| **transparent.utah.gov** | state contracts, expenditures by vendor, entity-level financials | 200 |
| **opendata.utah.gov** (Socrata) `?/api/catalog/v1` | statewide datasets, searchable catalog | 200 |
| **opendata.gis.utah.gov** (UGRC) | authoritative geospatial layers — feeds the map/location work | 200 |
| **jobs.utah.gov/wi/data** (DWS) | employment, wages, industry counts by county | 200 |
| **le.utah.gov** | bills, appropriations, program authorizations for `Type: resource` pages | 200 (302 on the year index) |
| **Utah DOGM** `oilgas.ogm.utah.gov` | wells, mines, operators | 200 |
| **GOEO incentives** (`business.utah.gov`) | EDTIF/economic-development awards: job and wage commitments | probe hit a soft 404 — locate the current index during Phase 3 |
| **Utah DEQ permits** | air/water permits naming facilities and capacities | soft 404 on the guessed path — same |

### Class B — the fragile 1,214

The existing external URLs, dominated by `startup.utah.gov` (458 instances), `en.wikipedia.org` (68),
`business.utah.gov` (52), `jobs.utah.gov` (37), then a long tail of company sites. Capture strategy:
excerpt + snapshot + hash. Tooling exists: `waybackNearest()` for existing captures;
`archive.org/wayback/available` answered 200 today while `web.archive.org/cdx/...` timed out (retry
both). **Save Page Now returned 401** — new captures need an archive.org account and S3-style keys, so
that is a maintainer prerequisite, not something a subagent can conjure.

---

## The mechanism that makes "everything" tractable: the coverage matrix

"Find all of the raw sources for everything" cannot be done by asking 413 agents to search the web
per page — that is unbounded, unrepeatable, and exactly how hallucinated citations get in.

Instead, invert it. Once a page has identifiers (Phase 1), a script runs every registry against every
key and writes one generated, gitignored artifact:

```
research/raw-data/coverage-matrix.json     # fact page × registry → hit count + record IDs
research/raw-data/coverage-report.md       # human/agent-readable, mirrors startup-state's report
```

A row reads: `fervo-energy · usaspending 3 · patentsview 12 · eia 1 · sec 0 · utah-corp 1`. Now
exhaustiveness is *computed*, not hoped for: a page with unexploited hits is a queue item, a page
with zero hits across all registries is a known-thin entity to be marked as such, and re-running the
matrix next quarter surfaces everything new. Subagents stop being researchers and become writers of
records the machine already found — which is the only version of this that scales and stays honest.

---

## Phases

### Phase 0 — one worked example, no fan-out (1 session, single agent)

Fan-out before the format is settled multiplies mistakes by the number of subagents. So: take **three
pages all the way to the bottom** — a public company (`omniture-web-analytics` or `domo`, has a CIK),
a private venture (`fervo-energy`, has federal awards and no filings), and a
`startup-utah-resource-list`-only resource page — and produce for each the identifiers, the Class A
records, the Class B excerpts and snapshots, and inline-cited figures.

Then, and only then: write the D1–D6 decisions into `wiki/meta/attributes.md` and
`wiki/meta/conventions.md` as principles with these three as precedents; add the lint checks; write
`research/raw-data/README.md` as the operational playbook.

**Exit criteria.** Three pages complete · lint codes landing on the real corpus with sane counts ·
one cold-subagent probe: hand a fresh agent only the new `fervo-energy` and ask it to verify three
figures, and see whether it can do it without leaving the wiki.

**Done 2026-08-11.** Pages: `myriad-genetics` (public company, CIK + 10-K + XBRL), `fervo-energy`
(private-then-public venture, IPO prospectus + 10-Q), `business-technical-assistance-center`
(startup-list-only resource, EIN + BMF + 990 + a dead website recovered from Wayback). Six new source
pages, four rewritten. All three exit criteria met — see results below.

### Phase 1 — identifier resolution (the join keys)

Script proposes candidates per page (name + city + domain matched against SEC full-text search, the
IRS BMF CSV, Utah business search, USAspending recipients, ROR). Subagents adjudicate ambiguity only,
seeing candidates side by side. Expect real trouble with common names (`Nucleus`, `Torus`, `Sandbox`)
and with defunct entities. `unresolved` with a reason code is a legal, correct outcome.

**Exit:** ≥80% of the 127 ventures carry at least one identifier; ≥90% of helper/resource nonprofits
carry an EIN; every unresolved page names *why* in Open Questions. Precision measured against a
30-entity hand-checked gold set — a wrong CIK is worse than no CIK, because it poisons every later
harvest.

### Phase 2 — ephemerality triage and capture

Prioritized by blast radius: `startup-utah-resource-list` first (174 dependents), then source pages
backing a numeric claim, then the remaining 135 official-website pages. For each: snapshot, record
`Archive`/`Archived`/`Retrieved`, add `## Verbatim`, set `Source Type` from the closed vocabulary.

**Exit:** every source page with fan-in ≥2 has a snapshot and an excerpt; the **dead-URL drill**
(below) passes on a 20-page sample.

### Phase 3 — Class A harvest, one family per subagent

Fan out by *registry*, not by page: an agent that has read the USAspending API docs once should spend
its context writing 40 award records, not re-learning the API. Each family produces new `Type: source`
pages (a record of a query against a durable dataset — `Source Type: dataset` or `government-record`,
which needs no excerpt because the registry is the archive) and real figures on the fact pages, each
with the record ID.

Sequence by yield: SEC Form D and USAspending first (touch the most ventures), then SBIR, NIH, NSF,
patents, then Utah state, then the domain-specific ones (EIA, openFDA, ClinicalTrials).

### Phase 4 — naked-number remediation

The 582 uncited numeric lines, sharded by slug. For each figure: find it in a captured excerpt or a
Class A record and cite inline; if it cannot be found, **downgrade the claim** — attribute it
("Fortem reports…"), move it to Open Questions, or delete it. A number nobody can source is not a
fact the wiki should assert, and this phase will legitimately *remove* content.

### Phase 5 — the machinery that keeps it true

- `scripts/recheck-sources.mjs` — re-fetch, compare hash, write a drift report; `--strict` for CI.
- New lint codes: `invalid-source-type`, `missing-verbatim`, `missing-archive`, `stale-retrieval`,
  `legacy-accessed`, `invalid-identifier`, `figure-without-source`, `figure-not-in-verbatim`,
  `single-source-evidence`, `evidence-monoculture`, `confidence-without-primary`.
- New coverage ratios in the lint summary: identifier coverage, excerpt coverage, archive coverage,
  cited-figure coverage. Progress becomes a number, as with Domain and Region rollout.
- One generated view — `views/sources.md`, an evidence-health board: what is unarchived, what drifted,
  what rests on a single self-reported source. This is also what satisfies D1's "a consumer must use
  it" requirement.
- `public/llms.txt`: tell arriving agents that figures carry inline citations and that source pages
  carry verbatim excerpts. This is a *feature* for them — it is the difference between citing us and
  having to re-verify us.
- Extend `scripts/search.test.mjs`, `build-views.test.mjs`, and (if routes change)
  `prerender.test.mjs`.

---

## Phase 0 results, measured 2026-08-11

Two cold subagents on a weaker model (directive 8: probe with what a typical consumer agent actually
runs), each given only the files and forbidden from fetching anything.

### Probe 1 — cold verification

Ten load-bearing claims across the three pages, posed as a real user question ("which numbers can I
trust?"). Result: **9 VERIFIED-PRIMARY, 1 VERIFIED-SELF-REPORTED-but-archived, 0 unverifiable** —
against a target of ≥8 and a baseline of near zero. One of the nine (whether BTAC still operates) is
primary only as to legal existence and filing status; the probe itself drew that line, noting no
federal record can say whether the door is open. The one self-reported claim (BTAC's amenity list)
is correctly self-reported: no government record lists a coworking space's conference rooms, and the
agent independently reached the right conclusion about it, telling the user "as of March 2025 they
advertised X, but that was before their site died."

What it found useful, unprompted and in this order: the closed `Source Type` vocabulary let it sort
filings from PR without reading them; `## Verbatim` let it confirm figures word-for-word without
leaving the corpus; the documented XBRL query let it say "I can re-run this myself"; Open Questions
stopped it chasing gaps the wiki already knew about.

Its attack pass found **no fabrications and no unacknowledged contradictions** — it checked every
figure on the three pages against the excerpts and re-derived the BTAC BMF-vs-990 discrepancy and the
Fervo 400→500 MW supersession, both of which the pages already disclose. Treat that clean result with
suspicion rather than pride: a compliant model on three hand-built pages is close to the easiest
possible case, and a checker that finds nothing is weak evidence. The load-bearing signal is Probe 2,
which was constructed so that agreeableness could not produce a passing number.

Its one real complaint is a genuine design question: it wanted a per-page "data quality scorecard"
because confidence signals are spread across pages. **Rejected for now** — that is D5's rejected
`## Key Figures` table wearing a new hat, and `views/sources.md` (Phase 5) is the right home for it.
Recorded here so the next agent to propose it knows it has been considered twice.

### Probe 2 — dead-URL drill

Scenario: five years out, every URL dead except Wayback and mandated-archive systems (SEC, IRS, DOI,
USAspending, ClinicalTrials, openFDA). ProPublica deliberately counted as *gone*, since a nonprofit
aggregator has no statutory duty to persist.

| Sample | Load-bearing claims surviving |
|---|---:|
| The four Phase 0 pages | **34 / 37 (92%)** |
| Three untouched control ventures | **0 / 24 (0%)** |

The controls were picked blind by the probe on one rule — Evidence cites only an `*-official-website.md`
page. That 0% is the actual state of ~135 source pages and 302 single-source fact pages, and it is the
number this whole plan exists to move.

Worst individual case, spot-checked and confirmed: `vivint-smart-home.md` asserts a multi-billion-dollar
business and a $2.8B acquisition by a public parent at `**Confidence:** Medium`, citing exactly one
source — `vivint-official-website.md`. NRG's 10-K and Vivint's own 2020–2023 filings are public,
permanent, and were never cited. Under the drill a reader cannot establish the company existed.

**The generalizable finding, and the reason Phase 3 sequencing is right:** every control page would
have been saved by *one* mandated-archive citation — one SEC filing, one EIN, one award ID. Survival is
not proportional to citation count; it is a step function at the first primary source. That argues for
breadth before depth: one identifier on 300 pages beats twelve registries on 25.

### Corrections this forced

- D4's scope estimate was wrong and is fixed above (3 before the migration, 16 after — the estimate
  was ~12, not "a large share of 135").
- `confidence-without-primary` was suppressed by the untiered vocabulary: it could only judge sources
  whose `Source Type` was in the closed list, so 220 of 231 source pages were invisible to it. That
  was fixed the same day by migrating the whole corpus rather than waiting for Phase 2 — see below.

## The legacy-category removal, 2026-08-11

Phase 0 left the closed vocabulary applying to 11 of 231 source pages and everything else in a
"rollout" bucket the checks skipped. That is a **grandfather clause**, and it made the corpus's most
important check advisory: a `Confidence: High` page could rest entirely on marketing and pass,
provided its source pages had not been migrated yet. So the migration was pulled forward and the
legacy category deleted outright.

`scripts/migrate-source-metadata.mjs` does it in one auditable pass: an explicit 49-entry mapping
table (never fuzzy matching), per-page overrides where a legacy value spanned tiers, and a refusal
list for anything it will not decide. Re-running is a no-op. What it found:

| | |
|---|---|
| Source Type in the closed vocabulary | 11/231 → **231/231** |
| `confidence-without-primary` firing | 3 → **16** |
| Hand-typed `Accessed:` dates | 220 → **0** (now a hard error) |
| Script-verified `Retrieved:` dates | 10 → **188** (of 231; 38 URLs did not resolve and correctly have none) |

Three findings worth keeping:

1. **The freeform vocabulary was actively laundering tier.** Eleven pages were typed
   `Government Record` — a primary value — and four were agency news articles and history essays
   (`army.mil` announcements, a Census history story, a Utah state history essay). Migrating by label
   would have promoted press releases to primary tier. Tier has to follow the speaker and the duty to
   preserve, not the domain, and that rule is now written into `attributes.md` and `conventions.md`.
2. **The 9-value vocabulary was two values short**, which the tail proved rather than argued:
   `reference` (encyclopedias, wikis, agency history writing — 9 pages) and `testimony` (a firsthand
   participant account the wiki holds itself — 1 page). Both are secondary tier.
3. **A permanent record behind an impermanent link is still fragile.** New check
   `primary-behind-mirror` caught three, one of them mine from Phase 0: BTAC's 990 data cited via
   ProPublica, Iomega's 10-K via a third-party EDGAR mirror, and *Myriad v. AMP* via Justia. Capture
   requirement now depends on tier **and** whether the cited host is one somebody must preserve.

One page had to be split by hand: `flys-eye-hires-cosmic-rays-source.md` bundled a university
explainer with the *Physical Review Letters* paper it describes under the value
"University Explainer; Peer-Reviewed Paper". No single tier describes that, so it became two pages.
The general rule is now in `conventions.md`: one source page describes one document, or several
sharing one type, never a mix of tiers.

**What did not change: the size of the real problem.** 220 source pages owe a capture, 215 owe an
archive snapshot, 214 owe a verbatim excerpt. Removing the legacy category did not fix that and was
not meant to; it converted a silent exemption into a counted backlog at
`research/raw-data/capture-backlog.md` (generated), which is the Phase 2 queue. The lesson for the
remaining phases is that **the schema should be migrated in one pass at the moment it changes**, with
the leftover work carried as a coverage ratio — never as a category of page the checks agree not to
look at.

### Live lint baseline

```
errors: 0 · warnings: 5 (confidence-without-primary 3 · legacy-accessed 1 · nonstandard-source-type 1)
Identifier coverage:            3/413 eligible pages
Source Type in vocabulary:     10/230 source pages
Retrieved (script-written):    10/230 source pages
Archive coverage:               5/5 source pages that need capture
Verbatim coverage:              5/5 source pages that need capture
Cited figures:                 34/285 numeric lines on fact pages
```

The three aggregate rollout warnings (220 pages each) follow the existing Domain/Region precedent:
corpus-wide migrations are one warning with a count, not 220 lines of noise nobody reads.

---

## The fan-out, 2026-08-11: what nine cheap agents taught

Eleven subagents ran against the schema above — nine writing `## Verbatim` sections from captures in
`raw/`, two hunting primary sources for `confidence-without-primary` pages. The Verbatim shards ran on
a small fast model, on the maintainer's prompt, and the result is the most useful finding here.

**The check is what makes a weak model safe.** The shard task is "copy the load-bearing sentences out
of a file already on disk," and `verbatim-not-in-raw` verifies each quote is a literal substring of
that file. A cheap model cannot smuggle a fabricated quote past it; it can only fail loudly. Across
~170 pages the check fired exactly once, and that turned out to be a bug in the *checker*, not the
agent: the quote was correct, but written with markdown-escaped inner quotes (`\"`), and normalization
treated the backslash as a character the document lacked. Fixed in `scripts/lib/verbatim.mjs` with a
test asserting it still fails when a word inside the escaped quote changes. **The general lesson is
that model strength should be spent where no check exists.** Judgment about *which* URL is the issuing
body, or whether a superlative is provable at all, has no mechanical verifier — that is where the
expensive model belongs.

**The dangerous artifact is a successful capture of the wrong document.** `culmination-bio-official-website`
cited `culmination.com`. That domain now forwards every path to `intermountainhealthcare.org`, so the
fetch returned HTTP 200 and a large, clean, quotable page — of a hospital system. Nothing looked
broken, and an agent dutifully started quoting it. A failed fetch is loud; a redirect that silently
substitutes one speaker for another reads as evidence. Hence `capture-off-site`: the linter compares
the domain a capture actually came from (`final_url` in the sidecar) against the domain the page
cites. Five pages tripped it, and only one was a genuine error — the others were an acquisition
(`kennecott.com` → `riotinto.com`), two canonical-domain moves (`ramasd.com` → `ram.space`, and a
rebrand from Bidi Contracting to Struvia), and a project serving its canonical name from a
dynamic-DNS host. So the check warns rather than refuses, and is cleared either by pointing `URL:` at
where the document now lives or by naming the destination domain in the page's prose. It cannot be
cleared by ignoring it, which is the point.

**Reading the primary document changes claims, not just their footnotes.** Two examples from this
session. `iomega-sec-10k-1995` was cited through a commercial EDGAR reseller; moving it to EDGAR's own
copy and actually reading the filing showed the page's "Utah-based corporation" was wrong — Iomega was
incorporated in Delaware in April 1980, with its operations in Roy — and that "the Zip drive shipped
in March 1995" overstated the record, since what shipped was the 100MB drive while the 25MB version
was still "planned." Neither error was detectable from the summary the page had been built from. A
shard agent found the same shape of error on `merit-medical-official-website`, which claimed "more
than 6,000 employees" where the site says approximately 7,000.

**Duplicated policy drifts silently.** The mandated-host list existed in three scripts. It had fallen
out of sync, and the copy the linter used was missing `supremecourt.gov`, so the Supreme Court's own
website counted as a host nobody must preserve. It now lives once, in `scripts/lib/hosts.mjs`, with
the criteria for adding a host written beside it — `nps.gov` and `usgs.gov` were added there after an
agent correctly argued that citing the National Park Service was being punished as if NPS were a
mirror of itself.

**An agent's report of what it changed is not evidence; `git diff` is.** One agent reported that
"something outside my session" had changed `**Confidence:** High` to `Medium` on eight pages, of which
it claimed only one. The diff shows all eight changed, the resulting pages are coherent — each names
what keeps it at Medium — and no other agent was working those files. The likeliest explanation is
simply that the agent lost track of its own edits over a long run, which is worth expecting rather
than treating as an anomaly. The operational rule: when a report and the repository disagree about
what happened, check the repository, and judge the resulting state on its merits instead of trying to
reconstruct authorship. A parallel run needs disjoint file ownership precisely because attribution
after the fact is unreliable.

**What the agents could not do, they reported instead of inventing.** The recurring case is a page
whose claims came from a site's interior pages while the capture is only its homepage: roughly 60
pages now carry an explicit note that a named claim is not in the capture. That is a real backlog, but
it is an *honest* one, and it is machine-findable. The failure mode it replaced — a confident page
with no way to tell which sentences the document actually supports — was not.

---

## The adversarial round, 2026-08-11: what only a strong reader catches

Seven fact-page clusters were ingested by cheap shards, then handed to expensive checkers whose only
instruction was to break them. Every finding below passed `wiki-lint.mjs` with zero errors, which is
the point of the exercise: these are the defect classes the mechanical checks structurally cannot
see.

**The worst defect was a false statement about our own evidence.** `best-friends-animal-society` said
its no-kill capture "predates any post-deadline accounting," excusing a passed 2025 deadline on the
grounds that the wiki's evidence was older than the deadline. The sidecar said otherwise: the
document was fetched 2026-08-11, seven months *after* the deadline, and was the organization's
current campaign page — retitled, recounting the goal in the past tense, naming no new date. The
honest finding was the exact inverse of what the page claimed, and it flattered the subject. No check
catches this, because every quote was real and every quote was in the capture. **A capture's
`fetched_at` is a claim about the world, and prose that characterizes a capture has to be checked
against the sidecar, not against the quotes.** It is worth stating that this class is *created* by
raw capture: before we held the bytes, no page could be wrong about what its own evidence was.

**Two tooling defects were found through page-level symptoms, and both were silent.**

1. *Legacy entity decoding.* SEC filings write curly quotes as numeric references naming C1 control
   characters (`&#147;`). The decoder passed them through literally, so captures contained invisible
   control bytes and a correctly transcribed quote could never be a substring of the capture.
   `verbatim-not-in-raw` fired on a correct quote — the check working, but with a failure message
   that would push an agent toward pasting mojibake into the wiki to satisfy it. Fixed with the HTML
   standard's replacement table in `scripts/capture-raw-sources.mjs`.
2. *Archive resolution against the pre-redirect URL.* `resolve-archive-snapshots.mjs` asked the CDX
   index about the page's `**URL:**` rather than the `final_url` actually captured. Where a site had
   moved a page, this produced two distinct failures: a false "no Internet Archive snapshot exists"
   (WGU, whose `/about/*` pages now serve from `/student-experience/*` — snapshots existed all along),
   and, worse, a *successful* resolution to a snapshot of the pre-move page, which cannot contain the
   quotes it is supposed to insure. Best Friends' about-page snapshot was from 2016 while its quoted
   sentence says "four decades after they broke ground." The resolver now prefers the captured
   `final_url` and reports when it had to. **The general rule: every script that reasons about a
   source should reason about the URL the bytes came from, not the URL we asked for.** `capture-off-site`
   already encoded this for domains; nothing had encoded it for paths.

**A script-owned field can be silently destroyed by an agent rewriting the page.** Three source pages
lacked `**Retrieved:**` while carrying `**Raw:**`, because the agents wrote the page *after* capture
and preserved only the field they needed. Since `attributes.md` defines absence of `Retrieved:` as
meaning the URL no longer resolves, three live URLs were marked dead by omission — a false signal
produced entirely by edit order. Re-running the owning script restored all three, and the corpus-wide
probe took coverage from 200/284 to 248/284. Worth a lint check eventually; worth knowing now that
**an agent that rewrites a whole file after running a script silently reverts that script.**

**Primary-tier government records are mostly PDFs, and we could not capture PDFs.** *(Resolved the
same day — see "PDF capture" below.)* `capture-raw-sources.mjs` refused non-markup content types. The
concrete cost surfaced on WGU: the document bearing on that page's central claim — ED-OIG/A05M0009,
the 2017 Department of Education audit of whether competency-based courses meet the "regular and
substantive interaction" standard — is a PDF on `oig.ed.gov`. The page could name it as a capture
target but not cite it. That was the largest gap between the doctrine and the tooling: the sources we
most want were the ones the extractor refused.

**Confidence grading drifts upward without a mechanical anchor.** Measured across the corpus, 152 of
197 `official-page` source pages are Medium — but the newest cluster had graded three self-reported
pages High, while two fact pages resting *entirely* on the subject's marketing copy sat at Medium
where the rubric says Low. `confidence-without-primary` only inspects High, so everything below it
drifts. Grading is judgment and probably should stay judgment, but the asymmetry is worth knowing:
nothing pushes back on a Medium.

**What survived the attack is as informative as what didn't.** No fabricated figure, date, URL, or
quote was found anywhere in thirteen pages written by cheap models — the checker traced every number
and every quoted string into the captures. The failures were all *interpretive*: real quotes
reassembled into a claim the document does not make (a founding story the source page's own
Reliability Notes disclaim), a completed sale asserted where the same page's Open Questions call it
unconfirmed, a fifteen-year gap between two datapoints presented as continuous tenure. This is the
strongest evidence yet for the division of labor: **the capture-and-quote layer is safe to hand to a
weak model because it is checked; the sentences built on top of the quotes are not checked by
anything, and that is where the strong model — or an adversarial second pass — has to be spent.**

---

## The second adversarial round, 2026-08-11: the defect moved up a section

Three cheap auditors read disjoint thirds of the 226 source pages that had both a capture and
quotes, told to find defects and forbidden to edit. All three, independently, reported the same
thing, and it was not the thing the machinery was built to catch: **quoting was fine and the claims
were not.** Between them they named 52 defects, and the dominant class by far was a date, figure, or
executive name sitting in `## Useful Claims` that appeared nowhere in the document the page cited.
Energy Fuels' page dated a Denison Mines acquisition to 2012 against a homepage capture containing
neither the year nor the name; ASI's carried "379M tons hauled" and "4.51M autonomous miles" against
two positioning sentences; US Magnesium's gave a Chapter 11 filing date of September 10, 2025 against
an article that says only "declared bankruptcy in September."

Spot-checking every high-severity finding against the captures confirmed all of them, which is worth
recording on its own: **cheap models are entirely adequate as adversaries.** They were more reliable
here than as writers, because the task has a ground truth on disk and no incentive to finish.

The mechanism of the defect is the interesting part. `verbatim-not-in-raw` worked exactly as
designed — no auditor found a fabricated quote in the deep-reviewed set — and by working, it made the
pages *more* dangerous. A reader who checks the quote, finds it exact, and infers that the rest of
the page was checked too has been misled by our own diligence. **Verification that covers one
section of a page implies verification of the whole page, whether or not it delivers it.** That is a
general hazard of partial checking, and the fix is not more prose telling agents to be careful.

Two responses, both durable:

1. **A scoping rule, in `conventions.md`.** On a `Type: source` page, `## Useful Claims` means what
   *this document* establishes — not what is true about the subject. A certainly-correct founding
   year that the document does not contain belongs on a fact page citing a document that does. The
   honest alternative is to write the document's *silence* ("the homepage does not state a founding
   date"), which keeps the gap visible instead of papering it.
2. **A check for the mechanical half, `claim-anchor-not-in-raw`** (`scripts/lib/claims.mjs`). Dates,
   years, and magnitudes in `## Useful Claims` must appear somewhere in the capture. It found 28
   pages, reproducing the auditors' list without having seen it — including two pages they missed,
   and one of mine from Phase 0, where a rotating "latest news" module meant a claim about what the
   page *showed* was no longer true of the current capture.

What the check deliberately does not attempt: "framed as validating Utah Valley's capability to
produce enterprise-scale software companies" is the same defect in prose, and catching it needs a
reader. The mechanized part is the part that is unambiguous once you look, which is also the part
that scales. The rest is what adversaries are for, and they are cheap.

Two design notes earned by the tests, both about not being annoying. Notation is not a defect: a
document writing "379 million" supports a page writing "379M", and a document writing "Sept. 15"
supports "September 15" — a check that cries wolf on these gets switched off rather than obeyed. And
one assertion must produce exactly one finding: reporting "September 10, 2025" as both a bad date and
a bad year inflates the count and erodes the same trust.

The exemption needs care in the other direction too. A bullet may legitimately name a figure the
capture lacks in exactly two situations, and both announce themselves: it hands the claim to another
page with a link, or it is *about* the document's silence. Recognizing the second cannot be done with
a negation word list — a bare "not" or "no" appears in most sentences and would let any unsourced
year through behind one. It requires language about the document.

**And the silence exemption is itself a claim that can be false**, which produced the round's worst
single defect. Spire Therapeutics' page stated that two population figures and a study-recruitment
invitation were *absent* from its capture when all three were in it. The hedge made the page sound
more careful than a bald assertion would have, while saying something untrue about our own evidence —
the same class as the Best Friends defect above, and again invisible to every quote check. It now has
a check of its own: a bullet claiming the document lacks a magnitude or a date, where the document has
it, is a finding. Bare years are excluded from that direction deliberately, because a stray copyright
line would convict an honest note.

**The cause was a layout, and it cut both ways.** Sites render statistics as bands where the number
and its caption are separate elements, so extraction puts `20M` on one line and "People in the United
States suffer from treatment-resistant chronic pain" on the next. A writer searching the capture for
"approximately 20 million" found nothing and concluded the figure was absent. An auditor searching
Hexcel's capture for "18 global" found nothing and reported an unsupported claim — but the capture has
`18` above "Global manufacturing sites", so the page was right and the finding was wrong. **The same
extraction artifact generated a false negative for a writer and a false positive for a reviewer.**
When a figure seems missing, search for it as the site renders it before writing down that it is not
there.

**The coverage figure was measuring the wrong thing, and had been all along.** A page with a bare
`## Verbatim` heading and nothing under it counted as covered, because an empty section body is
whitespace and whitespace is truthy. One page was in that state, so the number the entire capture
effort is judged by was overstated by one — small, but the metric was structurally incapable of
noticing, which is the part that matters. Content now means a blockquote *or* a fenced block, because
seven dataset and API pages legitimately carry machine output (JSON fields, a gauge reading, a CDX
row) in fences and contain no `>` at all; those are verified by the query recorded beside them. **A
coverage metric that can be satisfied by an empty heading is a metric that will be.**

**Agents reading global lint during a parallel run report each other's half-finished work as
pre-existing.** Three shards each ran `wiki-lint` to check themselves and reported `errors: 8`,
`errors: 5`, and `errors: 0` respectively, each attributing the count to "other shards" or "unrelated
pre-existing" pages. All three were reading transient states of files being edited concurrently; the
true count was zero throughout. This is a mild variant of the attribution problem recorded under
orchestration doctrine, and it argues for the same discipline: a parallel worker should verify *its
own files*, and only the orchestrator should read a global count, after the run.

`## Summary` is checked on the same footing as `## Useful Claims`, added after a shard agent
correctly fixed Lucid's claims to the captured "100M+ users" and left "70M+" standing in the summary
two paragraphs above — along with a description of a co-founder as CEO that the captured page
contradicts. Nine pages fired. The summary is what views and search results surface, so a stale
figure there is read by more people than one in a bullet, and fixing the bullets alone had made the
page inconsistent with itself.

## Personal information in captures — settled 2026-08-11

**D7 — captures are committed even when the document contains personal information about identifiable
people.** Maintainer decision, 2026-08-11: republishing what a publisher already published is not
ours to second-guess, and `raw/` takes no exception. The quarantine described below was lifted and
`.gitignore` carries no capture exclusions.

The case that raised it is recorded here because the reasoning matters for the next one, and because
the pipeline gave no signal at all.

The doctrine as written has no view on personal information, and the first case it met is a hard one.
`tibhospice.org`'s homepage reprints a 2023 *Deseret News* feature about The INN Between. The wiki
cites that homepage for two structural facts — a "one of America's first hospices" attribution and a
bed count. The same document, and therefore the same capture, names terminally ill residents
alongside their medical diagnoses, addiction histories, and criminal convictions, plus family members
and several people who have since died.

The page authors got this right on their own: the four `.md` pages reproduce none of it, and the
source page says so explicitly. **The capture policy underneath them silently undid that**, because
`raw/` is committed and captures are never deleted.

The considerations, since this will recur:

- **The material is already public**, published deliberately as journalism, with the subjects'
  participation. Nothing here is a leak.
- **But committing it changes its permanence and its reach.** A public Git repo optimized for
  machine reading, under a rule that captures are never deleted, removes any possibility that these
  people are ever forgotten — including if the publisher takes the story down at a family's request.
  We would be assuming a power over the record that the publisher retains and we cannot give back.
- **The wiki gains nothing from it.** Every quote we hold is structural. Not one needs a name.

Alternatives considered and rejected: capturing a narrower URL (loses the two claims we cite, since
the structural sentences are interleaved with the narrative rather than appended after it); redacting
on capture (a redacted capture is no longer the document, which weakens what `verbatim-not-in-raw`
means); and a local-only capture flag (preserves the check for whoever holds the file, but gives up
the guarantee that any clone can verify every quote).

**The rule that stands.** Capture the document as published. The judgment about what to *repeat*
lives in the pages, where it is visible and reviewable — and in this case it was exercised correctly
without prompting: the four `.md` pages carry none of the personal detail, and the source page says
so. That separation is the point. A capture is a record of what a source said; a page is what this
wiki asserts. Conflating them would either corrupt the evidence base or import material no one
intended to publish.

What this case is really evidence for is narrower and worth keeping in view: **nothing in the
pipeline noticed.** The fetch succeeded, lint passed, the sidecar looked ordinary. If a future
decision ever needs to distinguish "faithful copy" from "faithful copy we should not republish,"
there is currently no place for that distinction to live and no check that would surface a candidate.
Detection, not policy, is the gap.

A related item is now unblocked: `the-inn-between-official-website` is one capture carrying two tiers
— the organization's own copy and a reprinted newspaper feature — and the wiki holds no citation to
the original article, whose URL sits in the capture. Splitting out a `Source Type: news` page is
correct on its own terms and no longer waits on anything.

---

## PDF capture, 2026-08-11

`scripts/lib/pdf-text.mjs` extracts text from PDF bytes via `pdfjs-dist`; the capture script fetches
bytes rather than text, routes by content type or `%PDF-` magic, and records `document_format`,
`pdf_pages`, and `text_extractor` in the sidecar. Everything else is unchanged: same filename hashing,
same immutability, same `verbatim-not-in-raw` check.

**Why this was worth building rather than working around.** Primary tier is the whole point of the
doctrine, and primary tier is mostly PDFs — Inspector General audits, Form 990s, court filings,
agency reports, Federal Register notices. Refusing them meant the wiki's evidence base skewed
structurally toward whatever institutions happened to publish in HTML, which is to say toward
marketing copy. Two pages had already been reduced to *naming* the document that would settle their
central claim.

**The engineering problem is that a PDF has no lines and no words.** It records positioned glyph
runs; both joins have to be inferred, and each has a characteristic failure that is invisible on
inspection but fatal to quoting:

- **Word spaces.** Producers that emit one run per word yield `regularandsubstantiveinteraction`
  unless a gap threshold inserts spaces. A human skimming the capture reads right past it; every
  copied quote fails.
- **Line breaks.** Inferred from baseline shifts. The first implementation measured the shift against
  the *current* run's height, so a footnote marker set in a smaller face read as a line break and
  split the sentence it annotated. The unit test for superscripts caught it. Now measured against the
  taller of the two runs.

Both are tested in `scripts/pdf-text.test.mjs` against synthetic item arrays, including the negative
cases — runs that abut mid-word must *not* gain a space, small jitter must *not* split a line —
because an extractor that only over-joins or only over-splits passes a naive test suite.

**Failure is loud, by design.** A PDF that will not parse, or a scan with no text layer, fails the
capture rather than writing a short or garbled file. This was confirmed accidentally and usefully:
ProPublica returns HTTP 403 with an HTML error body for its 990 PDF downloads, and the extractor
threw `InvalidPDFException` instead of capturing an error page. That is the `culmination-bio` lesson
applied to a new content type — **the dangerous artifact is a successful capture of the wrong
document**, and for binaries the wrong document usually arrives disguised as HTML.

Validated end to end on ED-OIG/A05M0009: 93 pages, 228,652 characters, reading order intact, and the
quotes on `ed-oig-wgu-title-iv-audit-2017.md` pass `verbatim-not-in-raw` against it.

Still out of reach: **scanned documents with no text layer** (needs OCR, and OCR output is a
transcription rather than the document, which the doctrine should probably treat as a different
tier), and **hosts that block automated PDF downloads** — ProPublica among them, so IRS Form 990 PDFs
need a different route, most likely the IRS e-file XML.

---

## What to mechanize, 2026-08-11: dividing the checker's work from lint's

Two adversarial rounds produced a long defect list, and the question worth answering is not "were
these real" but "which will happen again". A defect a strong reader must catch is worth their whole
context. A defect that recurs on schedule and has a deterministic test is theft from that context.
So each finding was measured against the whole corpus before deciding, on the rule that **a check
earns its place by the count it returns on pages nobody was auditing** — a defect found only on the
pages just reviewed is an incident, and one found on pages nobody has looked at is a class.

Four earned it, and all four are now in `wiki-lint.mjs`:

| Check | Severity | Found | Why it recurs |
|---|---|---|---|
| `source-cited-outside-evidence` | error | 8 pages | An agent writes a source page, works it into the prose where it belongs, never returns to the list at the bottom |
| `capture-url-drift` | warning | 7 pages over time | A path-level redirect leaves **URL:** naming a document the capture does not hold |
| `retrieved-missing-despite-capture` | warning | 12 pages in one sitting | Rewriting a page around new quotes carries `**Raw:**` across and drops the script-owned fields |
| `unknown-metadata-key` | warning | 0 | Pure typo insurance; the closed set was derived from the corpus, not guessed |

`source-cited-outside-evidence` is the one that mattered most, because it was **silently disabling a
check that already existed**. `confidence-without-primary` reads the Evidence section and nothing
else, so a page resting on a filing cited only in its Impact paragraph looked, to lint, like a page
resting on nothing — the grade went ungoverned and the primary source looked uncited from the other
direction. Three of the eight were written the same day, by an agent explicitly trying to be careful,
which is the definition of foreseeable. It is an error rather than a warning because the fix is
mechanical and the failure is invisible from the page itself.

### The check not to add

The obvious next check — *every cited source is self-reported, so Confidence must not exceed Low* —
**fires on 313 pages**, the majority of the corpus. That number is the finding. Either the corpus is
systematically over-graded, or `Medium` in practice means "the subject's own account, captured and
quoted", and the written definition never said so. Either way a warning is the wrong instrument: it
would train agents to mass-downgrade to `Low` and destroy what Confidence distinguishes, or to
scroll past a code that fires everywhere. **Whether a specific page's claims outrun its sources is a
judgment**, and it stays with the adversarial reader.

That is the line generally. Lint takes what is *structural* — is the source listed, does **URL:**
name the captured document, is the field present, is the key spelled right. The checker keeps what
is *interpretive* — does the quote support the claim, is the snapshot contemporaneous with the
sentence it insures, is the figure stale, is the confidence honest. The first four checks exist so
the second list is what a strong model actually spends its context on.

### The dead-metadata sweep

Registering the keys surfaced something separate: **seven fields on 700-odd page instances were read
by no consumer at all**, against `attributes.md`'s own rule that an attribute exists only if a view
consumes it. Adjudicated the same day — three removed, four consumed:

`Layout` (241 pages) held one value, `field-guide`, everywhere. `Hero` (112) was 106
`picsum.photos` placeholders plus five paths into `/img/heroes/front/`, a directory that does not
exist, and `prerender.mjs` suppressed the field from display regardless — written, hidden, and
dangling. `Hero caption` mostly annotated the placeholders as placeholders. All three deleted.

`Stage`, `Era`, and `Audience` now drive views; `Relates` turned out to be something else entirely.

**The generative finding is `Relates`.** It carried `cites [Page](slug.md)` links on 176 pages —
hand-maintained edges duplicating what `## Evidence` already states. Deriving the inverse index
instead (`views/evidence.md`: every source and what rests on it) took nine lines and cannot drift
out of agreement with the citations, because it *is* the citations. It also produced something no
page can show you: **the sources nothing cites** — three of them, each a source page reachable only
from `**Relates:**`, i.e. gathered and then never actually cited. That is unfinished work, and it
was invisible while a hand-written field was standing in for a derived one. `source-cited-outside-
evidence` now reads `**Relates:**` as prose for exactly this reason.

Repairing those three then made a fourth defect visible: `wordperfect-and-novell.md` had been graded
`Confidence: High` while every Evidence entry was a bare external URL, so nothing was tiered and
`confidence-without-primary` skipped it entirely. **A page can hide from the confidence check by
citing nothing the corpus can tier** — untiered is not the same as unsupported, and the check treats
them alike. Worth a future rule: `High` with zero tiered sources should not be silence.

**The lesson to carry: unread metadata does not stay neutral.** Agents saw 241 pages carrying
`**Layout:**` and copied it forward, so the corpus kept manufacturing a field whose only effect was
to make the next agent write it too. A field is either consumed or removed; there is no third state
in which it sits harmlessly.

One debt is now explicit rather than latent. `Stage` and `Era` are unlike every other attribute:
`Domain`, `Region`, `Type` and `Focus` describe *placement*, and being wrong misfiles a page, while
`Stage` and `Era` assert *facts about the world* — that a company is public, that an era began in
1991 — in the same trusted bold-prefix register, with no source page behind them and no check over
them. `Confidence` grades the body and says nothing about these lines. Both views state that inline,
where a reader who could act on it actually is, and the grouping keys are derived at build time so
that correcting them never means rewriting pages. Sourcing them is the follow-up.

---

## Orchestration doctrine

The user constraint is that this happens with many subagents. Nine rules, most of them learned from
what already exists in this repo.

**1. Scripts fetch, agents judge.** An LLM asked to read a filing and write a number into a page is a
hallucination vector with no audit trail. The deterministic parts — fetch, paginate, extract, hash,
snapshot, write metadata via `upsertMeta()` — belong to scripts. Agents do entity resolution, excerpt
selection, conflict adjudication, and prose. Where an agent must state a figure, D2 forces the figure
to also exist verbatim in an excerpt, so lint catches inventions mechanically.

**2. Disjoint file ownership.** A shard is a disjoint set of page slugs. No agent touches
`wiki/views/` (generated), `wiki/meta/` (adjudicated by one editor), or another shard's pages. Merge
conflicts become structurally impossible rather than managed.

**3. The task file is the interface.** `research/raw-data/queue/<phase>-<shard>.json` in, a report
of the same name out. No shared mutable state, no agent-to-agent messaging, and a failed shard is
re-runnable in isolation.

**4. A refusal path in every task record.** `unresolved` + reason code is a first-class outcome.
Conventions P3 makes "I could not find it" the *correct* answer; an orchestration that only rewards
filled fields manufactures plausible garbage.

**5. Verification is a separate agent with the opposite incentive.** A checker gets the diff, not the
task, and tries to break it: does the quoted excerpt actually contain the number? Does the URL
resolve? Does the identifier's registered name and city match this entity? Roughly one checker per
three producers.

**6. Pilot at n=3 before scaling.** Directive 8: single runs are existence proofs, not rates. Run
three independent agents over the *same* 20-page shard, measure inter-agent agreement and precision
against the gold set, and only fan out when both hold. Disagreement is a spec bug, not agent noise.

**7. Batch size and model.** 15–20 pages or one registry family per subagent; 4–6 concurrent.
Cheaper models for record-writing against a fetched, machine-extracted record; the strong model for
identity adjudication and for anything that decides to delete a claim.

**8. One PR per shard, `wiki-lint` as the gate.** Run views + search index + lint before the PR, as
AGENTS.md requires. A shard whose lint output regresses does not merge.

**9. Idempotence is the acceptance test.** Re-running a completed shard must produce an empty diff —
the `sync-startup-state-from-api.mjs` property. Without it, quarterly re-harvest is impossible and the
whole thing decays back to a one-time snapshot.

| Phase | Shard key | Agent owns | Output contract |
|---|---|---|---|
| 1 identifiers | 20 slugs | those `.md` files | `**Identifiers:**` line or `unresolved` + reason |
| 2 capture | 20 source slugs | those `.md` files | `Archive`/`Archived`/`Retrieved`/`Source Type` + `## Verbatim` |
| 3 harvest | one registry | new source pages + cited fact pages | one source page per query, record IDs on figures |
| 4 figures | 20 slugs | those `.md` files | every figure cited, attributed, moved, or deleted |

---

## Risks

| Risk | Defusal |
|---|---|
| **Subagents invent figures** | D2: the figure must appear verbatim in an excerpt; lint `figure-not-in-verbatim`; adversarial checker |
| **PII.** Form D lists officers and often home-adjacent addresses; business registries list registered agents | Never publish a person's address or a private site. Conventions precedent 14 already says this — extend it explicitly to harvested records. Officer *names* only where the person is a public principal |
| **Wrong identifier poisons everything downstream** | Gold-set precision gate in Phase 1; name+city+domain corroboration required; `unresolved` preferred over a guess |
| **Rate limits and keys** | SBIR 429'd on the first request; Wayback SPN, PatentsView, EIA, SAM, USPTO ODP all need keys. Cache every response; backoff; the maintainer must obtain SPN + PatentsView + EIA keys before Phase 2/3 |
| **Licensing and ToS** | SEC UA policy; PatentsView and ProPublica attribution; Google Scholar and Google Maps results are not bulk-harvestable. Record terms per family in the playbook |
| **Repo and bundle bloat** | ≤1,500 chars excerpt/page (≈0.75 MB corpus-wide); no bytes in git by default; harvest cache gitignored |
| **Pages get worse to read** | The failure mode named in `static-html-is-the-second-half.md`, applied here: if prose starts reading like a citation dump, the excerpt belongs on the source page and the fact page keeps one link. Cold-agent probes at each phase catch this |
| **Scope creep into a data warehouse** | The Class A/B rule, the deferred `wiki/data/` with a named trigger, and views-not-trees for rollups |

---

## Success metrics and falsifiers

Every "now" below is `wiki-lint` output as of 2026-08-11, i.e. post-Phase-0, so progress is read off
the same instrument that gates the PRs.

| Measure | Pre-Phase-0 | Now | Target |
|---|---:|---:|---|
| Fact pages with ≥1 identifier | ~2 | 3 / 413 | ≥300 |
| Source pages with a `Source Type` in the closed vocabulary | 0 | **231 / 231** | held at 100% |
| Source pages with a script-verified `Retrieved:` | 0 | 188 / 231 | every resolving URL |
| Source pages with an archive snapshot | 4 | 5 / 220 owing capture | ≥90% of fan-in ≥1 |
| Source pages with a verbatim excerpt | 0 | 6 / 220 owing capture | 100% of Class B |
| Source pages with a `Raw:` capture | 0 | 6 / 220 owing capture | 100% of Class B |
| `Confidence: High` pages resting on no primary source | 3 *(suppressed)* | **16** *(all visible)* | 0 |
| Numeric lines with an inline citation | ~11% | 34 / 285 (12%) | ≥70% |
| Fact pages resting on exactly one source | 302 | 302 | ≤150 |
| Resource pages whose only source is the startup.utah.gov list | 174 | 174 | ≤60 |

Two rows need reading carefully. The capture denominator is now the honest one — 220 pages, not the
5 that Phase 0's untiered corpus could see — so the archive and verbatim ratios fell from a flattering
"5/5" to a true "5/220" without anything getting worse. And `confidence-without-primary` rising from
3 to 16 is the check starting to work, not the corpus degrading. A metric that improves because the
instrument went blind is the failure mode to watch for here.

The figure denominators also differ by instrument: the pre-Phase-0 audit counted 657 numeric prose
lines with a loose regex, lint counts 285 with a stricter one — compare within a column, never across.

Two probes decide whether this worked, and both are cheap. Both were run at Phase 0 and their results
are [above](#phase-0-results-measured-2026-08-11); re-run them unchanged at each phase exit so the
series is comparable.

- **Cold verification probe.** Give a fresh agent 10 random load-bearing claims and *only* the wiki.
  Count how many it can verify to a primary record without external search. Near zero pre-Phase-0;
  target ≥8; **Phase 0 scored 8/10 primary on the worked pages.** The number that matters from here is
  the same probe on *randomly sampled* pages, which will start near zero and is the real series.
- **Dead-URL drill.** Take 20 Class B sources, treat every live URL as 404, and count the claims that
  still stand on excerpt + snapshot alone. This is the ephemerality metric, and it is the whole point.
  **Phase 0: 92% on the worked pages, 0% on blind-picked controls.** Phase 2's exit is that number
  rising on the controls.

**What would falsify the plan.** (a) If Phase 1 cannot resolve identifiers for more than ~60% of
private ventures, Class A harvesting is only worth it for public, funded, or awarded entities, and the
rest of the corpus stays Class B — cut Phase 3 accordingly. (b) If excerpt + snapshot does not move
the cold verification probe, the bottleneck is page structure, not evidence, and the effort belongs in
Phase 4 alone. (c) If lint's new checks fire so broadly that they are routinely ignored, they were
specified as errors where they should have been coverage ratios. Record whichever happens in
`research/findings/`; a negative result is the more valuable one and must not be quietly dropped.

---

## Sequence

Phase 0 next, in one sitting, by one agent — it is the gate. **Maintainer prerequisites** that block
later phases and should be obtained in parallel: an archive.org account with Save Page Now S3 keys
(Phase 2), and free API keys for PatentsView and EIA (Phase 3). Phases 1 → 2 → 3 → 4 then run with
fan-out; Phase 5's lint codes and coverage ratios should land incrementally alongside the phase that
first needs each one, not at the end.

---

## Audit reproduction

The measurements at the top were produced with throwaway scripts over `wiki/pages/*.md`; the durable
versions belong in `scripts/` in Phase 5. Spot checks:

```bash
rg '^\*\*Type:\*\* ' wiki/pages -o --no-filename | sort | uniq -c | sort -rn
rg '^\*\*Source Type:\*\*.*' wiki/pages -o --no-filename | sort | uniq -c | sort -rn
rg -l 'web\.archive\.org' wiki/pages | wc -l                      # 4 pages
rg -l '^\*\*Type:\*\* source' wiki/pages | xargs rg -l '^> ' | wc -l   # excerpts on source pages: 0
rg -o 'https?://[^ )>]+' wiki/pages --no-filename | sed -E 's#https?://([^/]+).*#\1#' \
  | sort | uniq -c | sort -rn | head -25
```

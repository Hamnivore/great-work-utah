# Handoff: finishing the Best of State import

Written 2026-08-11 for the agent who picks this up. Read this, then
`research/design/raw-source-capture.md` (doctrine + orchestration rules). Everything below assumes
those rules rather than repeating them.

## State (updated 2026-08-11, third pass)

**Five things below are now done; the rest of this document still stands.**

1. **The blocking Best of State source page** is written and then some:
   `best-of-state-awards.md` plus seven captured source pages. Cite the year's winner document, say
   *medal* or *statue*, never ingest a featured card from the rebuilt site, and never cite the about
   page for a number. Details in the companion leads file's "Ingested, second pass".
2. **Track A is effectively complete.** Every live Tier 1 lead has a fact page with captured sources.
   Two loose ends: **Catherine deVries** has no page and no recorded refusal, and the four defunct
   entities (Linux Networx, Millenniata/M-DISC, Altiris, Wirthlin) are still held back deliberately.
3. **Track B item 1, the troubled-teen industry, is written** as
   `utah-congregate-care-oversight-reform.md` with six source pages. It turned out to be a two-statute
   reform, not one: S.B. 297 (2025) created the ombudsman, and the ombudsman is *not* independent.
   Read the cluster note in `2026-08-11-best-of-state-2003-2019.md` before extending it.

4. **Track B item 2, the direct-selling cluster, is written** as `utah-direct-selling-industry.md`,
   with `nu-skin.md` new, `usana.md` rebuilt on the FY2025 10-K, and nine source pages (two 10-Ks, the
   Gardner Institute study, doTERRA's earnings disclosure, the pyramid-scheme statute, the 1997 Nu Skin
   consent decree, the 2020 FTC release plus three letters, the Young Living docket). Read the
   "Ingested, third pass" section of `2026-08-11-best-of-state-2020-2026.md` before extending it — in
   particular, the per-capita version of "direct-selling capital" is false, the Gardner earnings figures
   are broken by the study's own footnote 31, and doTERRA and Young Living are larger Utah employers
   than either public company.

5. **Both clusters have now been through adversarial audit and the findings are applied**
   (lint 0 errors, 94 tests passing, views and index rebuilt). Two were substantive enough to change
   what the pages claim, and both are recorded as traps below: the S.B. 297 "transparency loss" was a
   pre-existing subsection misread as new, and the Congregate Care Advisory Committee does not hold the
   four powers two pages credited it with — the Office of Licensing does, in consultation with it. The
   audits also produced real gains: the 2026 Best of State directory's smallest division is Sports &
   Recreation at 17 (not Science & Technology at 21); one individual holds seven 2026 medals and Odyssey
   House of Utah holds ten, which is the corpus's best evidence for what medal counts measure; and the
   two open "Best of State medal not asserted" questions on `sistema-utah.md` and
   `huntsman-world-senior-games.md` are now closed against captured winner documents.

6. **The direct-selling cluster has also been through two adversarial audits (41 findings) and all of
   them are applied.** Three changed what the corpus asserts. The doTERRA disclosure's `**Archive:**`
   snapshot served the 2023 edition of the document, so it was removed and the page now says the file is
   unarchivable and why. The Gardner study's headline 17,487 jobs is a sum of 11,678 company + 5,312
   supplier + 497 *modelled* convention jobs, which unwound a "firmest number in the study" claim and a
   percentage base on three pages. And the Young Living Misdemeanor Information turned out to be
   text-extractable after the docket page had written it off, so it is now
   `us-v-young-living-misdemeanor-information-2017.md` — a primary page carrying the two counts, the
   spikenard/CITES export, and the Peruvian decree. The cluster page dropped to `Confidence: Medium`
   (its numeric base is an industry-commissioned `reference` source), lost "Nu Skin is the oldest large
   firm" and "the two public companies" (Nature's Sunshine 1972; NATR and LFVN are listed too), and all
   three fact pages stopped asserting job-board counts. Every one of these is a trap below.

**Next in Track B:** MegaDiamond and Diamicron to finish the diamond lineage (item 3), then the
Attorney General's office as a program incubator (item 4). The cheapest remaining direct-selling work
is per-company pages for doTERRA, Young Living, Nature's Sunshine, LifeVantage and Modere — all now
have a cluster page and a statute page to hang off.

Leads are extracted and triaged; the import is the unfinished part.

- `2026-08-11-best-of-state-2020-2026.md` and `2026-08-11-best-of-state-2003-2019.md` — the leads,
  tiered, with calibration sections on what the award does and does not evidence.
- `best-of-state-winners-2003-2019.tsv` — the raw recovered winner rows.

**Seven Tier 1 leads are ingested and have survived an adversarial pass:** US Synthetic, Best Friends
Animal Society, Western Governors University, The Other Side Academy, ARUP Laboratories, Bunnell
Incorporated, The INN Between. Each has a fact page plus captured source pages.

**Of the 22 Tier 1 leads that were open when this document was written, 17 now have pages** — SafeUT,
YESCO, auticon US, Spectrum Solutions, Crumbl, Blue Raven Solar, Mountain Heights Academy, CHOICE
Humanitarian, Huntsman World Senior Games, Sistema Utah, Hope Squad, Carterra (formerly Wasatch
Microfluidics), Imagine Learning, CompHealth, Globus Relief, Apa Sherpa (as
`apa-sherpa-foundation.md`), and Orbit Irrigation (as `orbit-irrigation-products.md`).

**Five remain open.** Four are the deliberately held-back defunct entities — Linux Networx, Wirthlin
Worldwide, Millenniata / M-DISC, Altiris — and the fifth is **Catherine deVries**, who has neither a
page nor a recorded refusal. (`devries-total-artificial-heart-nejm-1984.md` is William DeVries, a
different person.)

Twelve **cluster leads** also remain, in the two files' "Cluster leads" sections. Do not treat these
as leftovers — see the ordering below.

## Order of work

**Sequence by whether a mechanical check protects the work, not by tier.** That is the one lesson
that should change how this is scheduled. `verbatim-not-in-raw` makes single-entity pages safe for a
cheap model, because the task reduces to "capture the document, then quote it." Cluster pages have no
single document and therefore no mechanical check at all, so they need a strong agent — and they are
where the most interesting content is. The two tracks are independent and should run concurrently.

**First, and blocking both tracks:** the Best of State archive source page. One `Type: source` page
for the program itself, carrying the calibration points from both leads files and distinguishing
*medal* from *statue* winners. Every page citing an award inherits that caveat, so writing it once
stops 30-odd pages from each re-deriving it. Capture the winner PDFs
(`/pdf/2019_BOS_Winners_lowres.pdf`, `/pdf/2022_bos_winners.pdf`, `/pdf/2025_bos_winners.pdf`) —
PDFs are capturable now.

**Track A — cheap subagents, single-entity pages.** The 22 Tier 1 live entities in shards (below),
then Tier 2. Mechanically checked, so parallelize hard.

**Track B — you, or a strong model, on cluster pages.** Ordered by charter value, and note that the
top three all have primary sources available, which is what makes them writable rather than
essayistic:

1. **The troubled-teen industry.** Probably the highest-value single page available from this whole
   exercise. Utah is the national center of adolescent residential treatment; the sector carries
   sustained survivor testimony and national reporting, and **SB 127 (2021)** imposed new oversight —
   an enrolled statute is primary tier, and state licensing records are public. High magnitude,
   deeply contested, which is precisely the case the charter says to include and rank by bound rather
   than by sign. Handle it honestly in both directions.
2. ~~**Utah as the direct-selling capital.**~~ **Done, third pass.** The 10-K route worked, with one
   correction worth carrying forward: the two SEC registrants are *not* the cluster's largest Utah
   employers, so filings alone understate it. Industry-commissioned economics (the Gardner study) had to
   be split by provenance — administrative payroll data versus a de-identified 12-company survey — and
   the study's own footnotes are the best evidence against its headline earnings figures.
3. **Finish the Utah diamond lineage.** Mostly done — `us-synthetic.md` closed the industrial half —
   but **MegaDiamond and Diamicron still have no pages**, and the ChampionX/SLB divestiture thread
   is documented in SEC filings. Cheapest remaining win in the file.
4. **The Attorney General's office as a program incubator** (SafeUT, Utah@EASE, Children's Justice
   Centers, Opioid Task Force). Has primary sources; document the mechanism, with the controversy
   attached to that office's leadership handled straight.
5. **Utah System of Technical Colleges** — state placement-rate data exists and the wiki has only
   fragments. **USU Extension** — five programs medaled, no page for Extension itself.
6. **Rural anchors** (Price, Ephraim, Mt. Pleasant, Kanab, St. George, Milford, Peoa). Lower
   magnitude, but this is where region coverage is thinnest, so the marginal value is high.
7. The softer ones — restaurant franchising, community theater density, scrapbooking, call centers,
   engineering firms. Several need a statistic the wiki does not have (per-capita theater
   attendance, for instance). Do not write these until the number exists; a cluster page with no
   measurement is an essay.

**Last: Tier 1 defunct entities** — Linux Networx, Millenniata/M-DISC, Altiris, Wirthlin. These need
Wayback judgment rather than a live fetch and are a poor fit for a cheap model.

## Sharding (Track A)

Follow the orchestration doctrine. The parts that bit hardest here:

- **One subagent per 3–4 leads**, 4–6 concurrent. Each shard owns a disjoint set of page slugs and
  touches nothing else. Do not let two agents share a source page.
- **Cheap/fast model for ingestion** (`composer-2.5-fast` worked). The shard task is "capture the
  document, then quote it," and `verbatim-not-in-raw` mechanically verifies the output — a weak
  model cannot smuggle a fabricated quote past it, only fail loudly. Across ~170 pages, no cheap
  agent fabricated a quote, figure, date, or URL.
- **Spend model strength where no check exists.** Every failure the checkers found was
  *interpretive*: real quotes reassembled into claims the document does not make. Budget accordingly.
- **Always run adversarial checkers afterward, on a strong model, with the opposite incentive** —
  tell them to break the pages, not to confirm them. Both rounds found serious defects in work that
  passed lint with zero errors. This step is not optional; treat unchecked pages as unfinished.
- **Give each shard the same worked reference.** `us-synthetic.md` plus its source pages is the
  model: fact page, captured sources, disclosed conflicts, self-reported claims attributed.

## Per-lead workflow, for the shard prompt

1. Create the `Type: source` page stub(s) with `**URL:**` pointing at the real document.
2. `node scripts/capture-raw-sources.mjs --stem <slug> --write`
3. `node scripts/resolve-archive-snapshots.mjs --stem <slug> --write`
4. Write `## Useful Claims` and `## Verbatim` **from the capture in `raw/`**, never from memory or
   from a search snippet. Every figure in Useful Claims must be quotable from Verbatim.
5. Write the fact page from the source pages. Attribute anything self-reported. Disclose conflicts
   instead of averaging them.
6. `node scripts/build-views.mjs && node scripts/build-search-index.mjs && node scripts/wiki-lint.mjs`
   — zero errors before reporting done.
7. Attribute `Domain` and `Region` on everything. Many of these are non-Wasatch-Front, which is where
   coverage is thinnest.

## Traps, all of them found the hard way

- **Lint passing means nothing about truth.** Every defect both checkers found passed `wiki-lint`
  with zero errors.
- **Prose about a capture must be checked against the sidecar, not the quotes.** One page claimed its
  capture "predates any post-deadline accounting" when `fetched_at` showed it was taken seven months
  *after* — a false statement about our own evidence that flattered the subject. Read
  `final_url` and `fetched_at` before characterizing any document.
- **`final_url` ≠ `URL`.** Sites move pages. Point `**URL:**` at what was actually captured, or the
  archive snapshot insures a document that cannot contain the quotes.
- **An agent that rewrites a page after running a script silently reverts that script.** Three pages
  lost their script-written `**Retrieved:**` this way, which the schema reads as "URL is dead." Run
  `node scripts/migrate-source-metadata.mjs --write --probe` at the end of a batch.
- **Read the whole API response, not the row you wanted.** A page counted four FDA approvals as live
  competitors; `decision_code` in the same response marked two withdrawn. The disproving field is
  usually right next to the claim.
- **A superlative in a source is a claim about the source, not about the world.** Attribute it, or
  leave it out. "The company says" is never wrong.
- **Grade Confidence to the weakest load-bearing claim.** A page resting entirely on the subject's
  own marketing copy is Low, however well written. Nothing in lint pushes back on an inflated
  Medium.
- **Do not assert the contents of a page you did not capture** — including addresses. If it matters,
  capture it; if not, drop it.
- **Multi-line locator lines break the quote check.** Keep the `— locator` to one line.
- **The elision marker has to be one the checker knows.** `…`, `...` and `[...]` are recognized;
  `[…]` — a bracket around the single ellipsis character — is not, and silently turns one quote into
  two fragments with stray brackets that cannot match. Two `verbatim-not-in-raw` errors came from this.
- **PDF text extraction hyphenates across line breaks, and the checker sees the break as a space.** A
  document that prints "self-\nemployment" normalizes to "self- employment", so a quote spanning that
  wrap will never match. Pick quote boundaries that avoid hyphenated wraps and footnote-marker digits
  (a bare `26` on its own line between two sentences is a footnote reference, and it lands in the middle
  of the normalized text).
- **A source page that owes a capture should get one even when its URL is a mirror.** The Young Living
  docket page was written from a hand fetch and read as uncaptured until
  `capture-raw-sources.mjs --stem` was run against it; the quotes were right, but nothing could prove
  it. If a page quotes something, capture the something.
- **A bracketed passage in an enrolled bill is what the bill *deletes*, and the inserted text is
  underlined — which text extraction throws away.** So a section reprinted in an enrolled copy tells you
  nothing about whether any given sentence is new. One page read subsection 26B-2-709(6) out of the S.B.
  297 copy and announced a "transparency loss inside a transparency reform"; the identical sentence was
  already law in the version renumbered by Laws of Utah 2024, Chapter 267. **Diff an amended section
  against the prior codified version** at
  `le.utah.gov/xcode/Title<T>/Chapter<C>/C<section>_<YYYYMMDDYYYYMMDD>.html` before characterizing any
  change. The real change in that section — a 48-month bar on investigating stale complaints, replacing
  a bar on anonymous ones — was more consequential than the invented one, and it was two lines away.
- **Whose power is it?** "The office ... shall, in consultation with the committee" is not "the committee
  defines." Two pages credited a new advisory committee with four powers the statute gives the regulator,
  which inverts the accountability the bill actually creates. Read the verb's subject.
- **A section number from a printed-line quote is a guess unless you find the enclosing
  `Section N. Section X is amended` header.** A five-hour crisis clock was cited to 26B-2-124.1 when the
  enclosing section was 26B-2-124 — the section *before* the one whose number the quote sat nearest.
- **Two numbers in the same sentence of a news story may not be the same unit.** "Cited programs more
  than 200 times" and "found just four violations" invited a fiftyfold ratio that neither figure
  supports. Report both as given; do not divide.
- **An unnamed characterization is usually attributable to someone specific, and the specific version is
  stronger.** "Inspections were announced" was carried as ambient fact and belonged to the state's own
  former top regulator, on the record. Finding the speaker upgraded the claim instead of weakening it.
- **"Fabricated" asserts intent; "placeholder" asserts what you can see.** Six repeating demo rows on a
  rebuilt site support the second word only.
- **Repeat winners are a taxonomy fact, not a scandal.** One individual holds seven of 474 medals in the
  2026 directory and one nonprofit holds ten. Both are real entrants, entering many paid categories is
  allowed, and the finding is about what medal *counts* measure.
- **`archive.org/download/...` reports capture drift by design.** The Internet Archive redirects to a
  per-request storage node (`dn711008.ca.archive.org`), so `capture-url-drift` fires. Do not "fix" it
  by pasting the node hostname into `**URL:**` — that pins the page to a hostname that changes between
  fetches. Say so on the page instead.
- **An `**Archive:**` snapshot can serve a *different edition* of the document at the same URL, and that
  is worse than having none.** doTERRA's earnings disclosure lives at a stable overwrite path; the
  Wayback snapshot recorded on the page served the **2023** edition (92%, 54%, $35 fee) while the page
  described the 2026 one. Save Page Now did not fix it — a snapshot requested 2026-08-11 came back as
  2023 as well, 151 KB against a live 2.1 MB, because the CDN answers the archiver with an older object.
  The live URL did serve the current file, hashing to exactly the `bytes_sha256` in the capture sidecar.
  **Verify an archive snapshot's edition before recording it, especially for CDN-hosted PDFs**, and
  when a document cannot be archived, say so instead of pointing at something that resolves.
- **Test every PDF before declaring a filing unquotable.** The Young Living page said both underlying
  court filings were untextable scans; the Misdemeanor Information extracts cleanly and carried the two
  counts, the plant, the CITES certificate and the Peruvian decree — the whole conduct account the page
  said the record lacked. It is now its own source page. Only the 46-page plea statement is a real scan.
- **A total that sums unlike components is not a measurement.** The Gardner study's headline 17,487 jobs
  is 11,678 company + 5,312 supplier + 497 *modelled* convention jobs; the page had called it
  administrative payroll data and "the study's firmest number." Read the components table before quoting
  a total, and check what a percentage's base is — the 73.8% Utah County share is of 11,678, not 17,487.
- **A report can contradict itself, and the fix is to say so, not to pick.** Gardner's Section 1 narrative
  gives $182.8 million in state and local tax revenue; its fiscal section and Table 2 give $191.4 million.
  Neither is a typo of the other and $182.8 million appears in no table.
- **"The two public companies" was false in a table that never mentioned listing status.** Nature's
  Sunshine and LifeVantage are Utah-headquartered registrants too, so Utah has at least four listed direct
  sellers; "Utah's two public direct sellers" means "the two whose filings we ingested." The same table
  killed "Nu Skin is the oldest of the cluster's large firms" — Nature's Sunshine is 1972.
- **A live job board is a pointer, not evidence.** Opening counts read off Workday and Jobvite boards were
  asserted on three pages with the live URL listed under `## Evidence`. P5 is explicit: a figure that
  cannot be quoted from a captured source is not a figure to assert. Workday serves listings only over
  POST, so this repo's fetcher cannot capture it at all. Describe the shape of demand, date the reading,
  and drop the counts.
- **A consent decree that disclaims liability does not document harm.** "A specific, documented harm to
  consumers" described a 1997 decree entered without adjudication, whose penalty went to the Treasury and
  which ordered no redress. It documents an unsubstantiated-claims violation of a standing order.
- **Check the statute for the word "primary" before writing "exclusive."** 76-17-303(5) gives the county
  or district attorney *primary* responsibility; the page said enforcement rested there "not with a state
  agency," which the text does not say and subsection (6)(c) contradicts.
- **A capture that does not contain the quotes insures nothing.** Capturing `76-17-P3.html` produced a
  table of contents and eight instant `verbatim-not-in-raw` errors, because the quotes live in four
  separate section documents. The capture was backed out and the gap stated on the page; a `Raw:` field
  pointing at the wrong document is worse than an absent one.
- **When the claim-anchor check rejects a date, it is usually right.** "June 2010" failed because the scan
  renders it "June 20 I 0". The date is obvious to a reader and absent from the capture, which is exactly
  the case the check exists for — state the reading in the notes rather than asserting the figure.

## Definition of done

`wiki-lint` clean, `npm test` passing, views and search index regenerated, every new page checked by
an adversarial agent and its findings applied, and both leads files updated with an "Ingested"
entry naming what was written and what the sources turned out to disprove. Those disproofs are the
most valuable output of this exercise — record them.

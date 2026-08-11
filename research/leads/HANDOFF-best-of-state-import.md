# Handoff: finishing the Best of State import

Written 2026-08-11 for the agent who picks this up. Read this, then
`research/design/raw-source-capture.md` (doctrine + orchestration rules). Everything below assumes
those rules rather than repeating them.

## State (updated 2026-08-11, second pass)

**Three things below are now done; the rest of this document still stands.**

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

**Next in Track B, unchanged in priority:** the direct-selling cluster (item 2 — note
`utah-direct-selling-industry.md` is already a wanted page referenced by five FTC/DOJ source pages,
so the source work is partly done), then MegaDiamond and Diamicron to finish the diamond lineage
(item 3).

Leads are extracted and triaged; the import is the unfinished part.

- `2026-08-11-best-of-state-2020-2026.md` and `2026-08-11-best-of-state-2003-2019.md` — the leads,
  tiered, with calibration sections on what the award does and does not evidence.
- `best-of-state-winners-2003-2019.tsv` — the raw recovered winner rows.

**Seven Tier 1 leads are ingested and have survived an adversarial pass:** US Synthetic, Best Friends
Animal Society, Western Governors University, The Other Side Academy, ARUP Laboratories, Bunnell
Incorporated, The INN Between. Each has a fact page plus captured source pages.

**22 Tier 1 leads remain, none of them started.** From the 2020–2026 file: SafeUT, YESCO, auticon US,
Spectrum Solutions, Crumbl, Blue Raven Solar, Mountain Heights Academy, CHOICE Humanitarian,
Huntsman World Senior Games, Sistema Utah. From 2003–2019: Linux Networx, Hope Squad / Gregory
Hudnall, Wirthlin Worldwide, Apa Sherpa, Catherine deVries, Millenniata / M-DISC, Altiris, Wasatch
Microfluidics (now Carterra), Imagine Learning, CompHealth, Globus Relief, Orbit Irrigation.
(Checked: no page exists for any of them. `devries-total-artificial-heart-nejm-1984.md` is William
DeVries, a different person.)

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
2. **Utah as the direct-selling capital.** USANA and Nu Skin are SEC registrants, so scale claims are
   recoverable from 10-Ks rather than from industry PR. Also contested, also charter-appropriate.
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

## Definition of done

`wiki-lint` clean, `npm test` passing, views and search index regenerated, every new page checked by
an adversarial agent and its findings applied, and both leads files updated with an "Ingested"
entry naming what was written and what the sources turned out to disprove. Those disproofs are the
most valuable output of this exercise — record them.

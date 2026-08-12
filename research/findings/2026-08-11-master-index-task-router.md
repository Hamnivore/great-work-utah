# Master index as a task router

**Date:** 2026-08-11
**Status:** implemented; three cold probes are existence checks, not measured rates

## Problem

The generated master index had remained a compact directory of type and facet views while the
corpus grew to nearly 900 pages. It accurately named the available indexes but made `llms.txt` do
most of the actual routing. Search, proximity, curated guides, evidence navigation, and facet
coverage were not visible. Eight sector hubs were compressed into one line, and the document did
not distinguish exhaustive type indexes from partial metadata-derived views.

## Change

`scripts/build-views.mjs` now generates a task-first master index. It routes work seeking, venture
building, non-VC small-business help, research commercialization, sectors, proximity, history,
evidence inspection, and exact-phrase search before presenting facets and exhaustive type indexes.
It computes corpus and coverage counts from the pages rather than freezing them in prose. Domain
and Region coverage are stated explicitly; Stage and Era retain their warning that metadata claims
are not sourced. Curated guide entry points are explicit, while the full contribution contract
remains in `llms.txt`.

The human homepage's “Browse the wiki” link now opens the master index instead of assuming every
browse session is a job search.

## Cold probes and revision

Three fresh agents received only the proposed `wiki/views/index.md` and one task each:

1. A software engineer seeking Utah climate/energy work chose by-role, the energy hub, and needs.
   It correctly joined role and sector views, but flagged that role views cover only stated-needs
   pages, needs are not confirmed openings, and partial Domain coverage needs a search fallback.
2. A rural small-business owner seeking practical non-VC help chose by-region, Find Business
   Services, and Find an Advisor. It found a route, but the original “start, fund, or grow” wording
   overemphasized venture capital and did not name the non-VC path.
3. A biotech evidence-and-proximity task chose health-bio, the evidence graph, and by-region. It
   correctly found all three surfaces, but had to infer the company-to-source sequence and adapt an
   Ogden proximity example to Salt Lake City.

The shipped revision separates high-growth funding from Main Street/rural help; labels needs as
leads rather than openings; states the limited population behind role views; tells agents to use
synonym search and complete type indexes when a sector hub is sparse; describes subject page →
Evidence links → inverse evidence graph; and uses a Salt Lake City proximity example.

## What this establishes

The task-first shape supported all three tested routes without prior knowledge of `llms.txt`, and
the probes found actionable ambiguities before release. It does not establish success rates across
models or tasks. A later interface experiment should repeat key scenarios at n≥3 per condition and
compare navigation logs against the previous index if the index becomes a publication claim.

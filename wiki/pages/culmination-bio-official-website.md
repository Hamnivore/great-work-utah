# Official Website: Culmination Bio

**Type:** source
**Status:** Useful
**Confidence:** Medium
**Source Type:** official-page
**URL:** https://web.archive.org/web/20250330042617/https://www.culmination.com/
**Publisher:** Culmination Bio
**Retrieved:** 2026-08-11
**Archive:** https://web.archive.org/web/20250330042617/https://www.culmination.com/
**Archived:** 2025-03-30
**Updated:** 2026-08-11

## Summary

Culmination Bio's official website as it stood on 2025-03-30, describing a biotech data platform built from Intermountain Health's longitudinal patient records, organized into searchable discovery cohorts for pharma and technology partners.

The live site is gone. `culmination.com` now forwards every path — root, `/about`, `/platform`, even the press-release URLs still in search indexes — to `intermountainhealthcare.org`. This page therefore cites the last archived snapshot of the real site rather than a live URL, and the forwarding is itself a fact worth recording: see [Culmination Bio](culmination-bio.md) for what it suggests about the spinoff's status.

## Useful Claims

- The archived site has not yet been captured into `raw/`, so this page does not currently assert
  its former platform, scale, or partnership claims.

## Reliability Notes

The prior capture was removed from this page because it holds the `intermountainhealthcare.org`
homepage that `culmination.com` forwarded to on 2026-08-11, not Culmination's own words. The immutable
capture remains on disk as a redirect record, but it is not evidence for this source page. The next
agent here should capture the snapshot named in **Archive:** and write a `## Verbatim` section from it.

How this was caught is worth recording, because the failure mode is subtle. The URL on this page was fetched, returned HTTP 200, and produced a large, clean, quotable document — so nothing looked broken. The document was a different organization's homepage. Redirect-following turns a dead company's domain into its parent's marketing copy without any error, and a capture that silently substitutes one speaker for another is more dangerous than a failed fetch: it reads as evidence. The linter now compares the domain a capture actually came from against the domain the page cites (`capture-off-site`).

This is an official company source. It is useful for platform positioning, data-scope claims, and partnership structure, but data quality, representativeness, regulatory posture, and commercial traction should be cross-checked with Intermountain Health announcements, investor disclosures, and independent reporting before being treated as high-confidence evidence. Every figure above is the company describing its own asset to prospective customers.

## Related Pages

- [Culmination Bio](culmination-bio.md)

## See Also

- [Intermountain Health launch announcement (2023)](https://news.intermountainhealth.org/intermountain-health-launches-culmination-bio/) · https://news.intermountainhealth.org/intermountain-health-launches-culmination-bio/ — parent-system announcement cited in legacy seed material; not yet captured as a dedicated wiki source page

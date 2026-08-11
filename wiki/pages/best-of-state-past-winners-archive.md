# Source: Best of State Past Winners Archive

**Type:** source
**Status:** Useful
**Confidence:** Medium
**Source Type:** official-page
**Publisher:** Best of State Foundation
**URL:** https://www.bestofstate.org/past-winners?year=2025
**Raw:** raw/best-of-state-past-winners-archive/2026-08-11-ea326b8f3a75.txt
**Retrieved:** 2026-08-11
**Updated:** 2026-08-11

## Summary

The program's own archive of past winners. Its value to this wiki is entirely negative, and worth
recording as such: it establishes **where the official record stops**. The archive offers 2020 through
2025 and calls that a "Permanent Record", for a program whose own winner books date it two decades
earlier ([Best of State Awards](best-of-state-awards.md)). Everything the wiki holds about the earlier
years was recovered from the Internet Archive instead.

## Useful Claims

- **The official archive begins at 2020.** The page's own heading is "Archive Since 2020" and its year
  selector offers 2025, 2024, 2023, 2022, 2021, and 2020 — nothing earlier.
- **It labels that six-year window a "Permanent Record".**
- **Each year links out to a PDF** where one exists; the 2025 entry offers a 4.5 MB download, which is
  [the program book](best-of-state-2025-winners-list.md) this wiki captured.
- **The winner rows themselves are not in the served HTML.** They load client-side: the captured
  document contains "Loading 2025 winners…" where the list would be. A plain fetch of this URL
  therefore yields no winners at all, only the frame around them.

## Verbatim

> "Past Winners — Best of State Archive Since 2020"
> — Page title

> "Permanent Record • 2020 – 2025"
> — Section eyebrow, above the year selector

> "Choose a year to see the winners recognized that season. Where available, each entry links to the organization's official website."
> — Introduction

> "Loading… Download 2025 PDF · 4.5 MB"
> — Year panel, 2025

> "Loading 2025 winners…"
> — Year panel, 2025

## Reliability Notes

**This capture is 672 characters of shell, and that is the point of it.** It is not evidence about any
winner and must never be cited as such; it is evidence about the boundary of the official record and
about how the page behaves when a machine fetches it.

**It corrects a working assumption in this wiki's own leads files.** Those files record that the year
pages are server-rendered, so that `?year=YYYY` returns different content — which was true when they
were harvested. It is not true of the rebuilt site: the year is a client-side fetch, and the requested
URL `…/past-winners` redirects to `…/past-winners?year=2025`, which is the URL recorded above because
it is the one actually captured.

**No archive snapshot exists** for this route; the CDX index holds no 200-status capture of it. A
snapshot of the *pre-rebuild* `/past-winners` page does exist, and deliberately is not recorded in
`**Archive:**` — it is a snapshot of a different document, and pointing this page's ephemerality
insurance at it would insure sentences that document does not contain.

## Related Pages

- [Best of State Awards](best-of-state-awards.md)
- [Source: Best of State 2025 Awards Program Book (PDF)](best-of-state-2025-winners-list.md)
- [Source: Best of State 2026 Winners Page](best-of-state-2026-winners-page.md)

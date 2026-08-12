# Source: Utah Tech Calendar submission page

**Type:** source
**Status:** Useful
**Confidence:** Medium
**Source Type:** official-page
**URL:** https://utahtechcalendar.com/submit
**Publisher:** Utah Tech Calendar
**Retrieved:** 2026-08-12
**Raw:** raw/utah-tech-calendar-submission-page/2026-08-12-1832702d6837.txt
**Updated:** 2026-08-12

## Summary

The Utah Tech Calendar's submission page. It is short and carries one thing the rest of the site does
not spell out: **the mechanism by which an event gets in**, which is structured-data extraction from a
URL rather than a form an organizer fills in.

It also states the site's base in a fuller form than the header does — "compiled in Cottonwood
Heights, Utah".

## Useful Claims

- Submission has **two modes**: paste the URL of **one event**, or **suggest a whole calendar** for
  which a scraper is then written.
- Event submission is **automated by structured data**: the accepted inputs are **Luma, Eventbrite,
  Meetup, Silicon Slopes, or any conference page emitting schema.org event markup**, from which
  **title, date, and venue are extracted automatically**.
- **Hand-built calendars are explicitly out of scope for single-URL submission** and are routed to the
  "suggest a source" path instead.
- The site states there is **no manual data entry required of the submitter** in either mode.
- The footer describes the calendar as **"compiled in cottonwood heights, utah · updated nightly"**
  and lists **archive, about, iCal, RSS, and embed** endpoints alongside submit.

## Verbatim

> Paste a URL to one event and we'll pull the details. Or suggest a whole calendar and we'll wire up the scraper. Either way, no manual data-entry on your end.
> — Submit page, lede

> Luma, Eventbrite, Meetup, Silicon Slopes, or any conference page with schema.org event markup. We'll pull the title, date, venue automatically.
> — Submit page, "Event URL" field help

> What works as a URL? Luma, Eventbrite, Meetup, plus any conference page that emits schema.org event structured data. If you have a calendar that's hand-built, use the "suggest a source" mode and we'll take a look.
> — Submit page, explanatory note

> compiled in cottonwood heights, utah · updated nightly
> — Footer

## Reliability Notes

Self-reported tier: the operator describing his own intake process.

The claims here are **unusually checkable for a marketing page**, because they are mechanical. Either
a pasted Luma URL yields a listing or it does not, and any reader can test it. Nothing here was
tested, so the mechanism is recorded as described rather than as verified.

What the page does **not** say is as important as what it does. There is no stated turnaround time, no
statement of who reviews a submission or against what rule, and no appeal path for a rejected event.
The inclusion criteria live on
[the Discover page](utah-tech-calendar-discover-page.md) and are illustrated rather than specified, so
an organizer submitting an event cannot tell in advance whether it will be judged "craft, not tech".

One structural consequence worth drawing out: because ingestion keys on **schema.org event markup**,
the calendar's coverage is a function of **how an organizer publishes**, not of how significant the
event is. An important gathering announced only in a Slack message or a PDF flyer is invisible to this
pipeline no matter who is running it, and the "suggest a source" path is the only route in.

## Related Pages

- [Utah Tech Calendar](utah-tech-calendar.md)
- [Source: Utah Tech Calendar homepage](utah-tech-calendar-official-website.md)
- [Source: Utah Tech Calendar "Discover" page](utah-tech-calendar-discover-page.md)

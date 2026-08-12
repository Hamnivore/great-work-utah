# Utah Tech Calendar

**Type:** resource
**Status:** Draft
**Confidence:** Medium
**Tier:** D
**Focus:** statewide tech event aggregation, automated schema.org ingestion, nightly refresh, no-signup index
**Primary Location:** Cottonwood Heights, UT
**Utah Location:** Cottonwood Heights, UT
**Region:** statewide
**Website:** https://utahtechcalendar.com/
**Domain:** computing, culture-place
**Updated:** 2026-08-12

## Summary

Utah Tech Calendar is a statewide index of **in-person** Utah technology events — meetups,
conferences, founder mixers, and developer nights across Salt Lake City, Provo, Lehi, Ogden, and the
rest of the state. At capture it listed **149 entries for August 2026**, drawn from **72 watched
sources** and refreshed **nightly**, with **no account required** to read it
([official website](utah-tech-calendar-official-website.md)).

It was built by **Benjamin Reece** and announced by him in June 2026, out of frustration with an
existing calendar that was "missing sources and features I needed"
([origin announcements](utah-tech-calendar-origin-announcements.md)).

The reason it is a distinct thing rather than another event list is the ingestion model. Rather than
asking organizers to enter events by hand, it **scrapes structured data**: any page emitting
schema.org event markup — Luma, Eventbrite, Meetup, Silicon Slopes, and conference sites — can be
submitted as a URL and parsed automatically, and whole calendars are onboarded by adding a scraper for
the source. Named upstream feeds include **47G** and **BioUtah**, so its reach extends past software
into aerospace and life sciences.

## Who It's For

Anyone trying to find out what is happening in Utah technology this week without joining anything.
The site aims at founders, designers, scientists, operators — "anyone building here" — and its
deliberate constraint is **in-person only**, which makes it a tool for meeting people rather than a
webinar feed.

It is equally useful to organizers, who can get an event listed by submitting a URL instead of
maintaining a presence on someone else's platform.

## What It Provides

- **A nightly-refreshed statewide index** of in-person tech and tech-adjacent events, filterable by
  region, city, tag, group, source, type, and date, in weekly or monthly views.
- **Provenance on every entry**: each event shows the upstream feed it came from, so a reader can see
  whether a listing originated on Meetup, Luma, Eventbrite, or a direct submission — and go check it.
- **Automated submission**: paste an event URL and the title, date, and venue are extracted from
  schema.org markup; suggest a whole calendar and a scraper is added for it.
- **Curated verticals** — nine at capture, including AI, fintech, and healthtech — for readers who
  want a slice rather than the whole state.
- **Multiple delivery channels** (four at capture) for following the calendar rather than visiting it.
- **No signup, no account, no paywall.**

## How To Use It

Open `utahtechcalendar.com` and filter to your city or vertical; nothing is gated. Then two habits
worth forming:

- **Verify on the organizer's own page before you go.** The listings are machine-extracted from
  upstream feeds and the site itself frames the entry as a pointer, showing you which source it came
  from precisely so you can check it.
- **Do not treat absence as evidence.** The calendar can only see events published somewhere it
  watches. An event announced only in a Slack channel or a private list is structurally invisible to
  it — this corpus holds a documented case of exactly that, an organizer noting in June 2026 that his
  Kids Code Camp was missing from a Utah tech calendar
  ([Kids Code Camp 2026 announcements](utah-kids-code-camp-2026-announcements.md)).

If you organize an event, submit the URL rather than waiting to be found; if you run a whole calendar,
suggest it as a source and it can be wired up wholesale.

## Cost / Eligibility

Free, with no account required. Individual events carry their own costs and eligibility — the calendar
is a discovery layer, not a ticketing system.

## Best Fits

Someone new to Utah, or new to its technology community, who does not yet know which organizations
exist and therefore cannot follow them individually. That is the gap the site names for itself — "you
don't know what you don't know" — and an aggregate index solves it in a way that following ten Meetup
groups does not.

It also fits an organizer who would rather publish once, wherever they already publish, and be picked
up automatically.

## Evidence

- [Source: Utah Tech Calendar homepage](utah-tech-calendar-official-website.md) · https://greatutah.work/pages/utah-tech-calendar-official-website.md · https://utahtechcalendar.com/ — scope, nightly refresh, Cottonwood Heights base, 149 August entries, per-entry source attribution
- [Source: Utah Tech Calendar "Discover" page](utah-tech-calendar-discover-page.md) · https://greatutah.work/pages/utah-tech-calendar-discover-page.md · https://utahtechcalendar.com/discover — 72 sources, the four-stage pipeline, the published inclusion policy, the nine verticals and four delivery channels
- [Source: Utah Tech Calendar submission page](utah-tech-calendar-submission-page.md) · https://greatutah.work/pages/utah-tech-calendar-submission-page.md · https://utahtechcalendar.com/submit — schema.org extraction, the two submission modes
- [Source: Utah Tech Calendar origin announcements (Forge Utah Slack)](utah-tech-calendar-origin-announcements.md) · https://greatutah.work/pages/utah-tech-calendar-origin-announcements.md — authorship, motivation, and the naming collision with Utah Tech University
- [Source: Kids Code Camp 2026 announcements (Forge Utah Slack)](utah-kids-code-camp-2026-announcements.md) · https://greatutah.work/pages/utah-kids-code-camp-2026-announcements.md — an organizer reporting his event missing from a Utah tech calendar, the one located limit on the coverage claim

## Open Questions

- **What is the relationship to [Forge Utah](forge-utah.md)?** Forge's homepage promotes the calendar
  prominently under a "UTAH TECH CALENDAR" banner reading "Ours and everyone else's". **An earlier
  version of this page read that as Forge operating the calendar; that was wrong.** The phrase
  describes the *events* listed — Forge's own plus other organizations' — and in the launch thread
  Forge's president distinguishes his own calendar from this one by name. Whether Forge funds,
  endorses, or merely links to it is unresolved.
- **Is the coverage claim testable?** "Comprehensive" and "72 sources watched" are the operator's own
  figures, displayed as statistics, with no way to check either.
- **Who decides what gets in?** The inclusion policy is published and illustrated — certification
  spam, non-technical craft classes, and cross-posted workshops are shown being rejected — but it is
  demonstrated by six chosen examples rather than specified, and no reviewer, turnaround, or appeal
  path is named. An organizer cannot tell in advance whether their event will be judged "craft, not
  tech".
- **Do "72 sources watched" and "one schema across thirteen sources" describe the same thing?** Both
  appear on the Discover page and nothing reconciles them.
- **Who maintains it now?** Authorship is established for June 2026 by the builder's own announcement.
  Nothing establishes ongoing maintenance, succession, or what happens if he stops.
- **What is the relationship to Utah Dev Events**, the Google Sheet-based predecessor it was built to
  improve on, and is that still maintained?
- **Is the operator a person or an entity?** No registration, business name, or funding model was
  located, and the site names none.

## See Also

- [Forge Utah](forge-utah.md) · https://greatutah.work/pages/forge-utah.md — promotes the calendar from its homepage
- [Utah Geek Events](utah-geek-events.md) · https://greatutah.work/pages/utah-geek-events.md — another Utah event index, differently organized
- [CTO Breakfast Utah](cto-breakfast-utah.md) · https://greatutah.work/pages/cto-breakfast-utah.md — one of the recurring events it carries
- [AI Builder Day](ai-builder-day.md) · https://greatutah.work/pages/ai-builder-day.md

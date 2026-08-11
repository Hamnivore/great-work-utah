# Source: BTAC Official Website (archived)

**Type:** source
**Status:** Useful
**Confidence:** High
**Source Type:** official-page
**URL:** https://www.btac.business/
**Archive:** https://web.archive.org/web/20250325062537/https://www.btac.business/
**Archived:** 2025-03-25
**Publisher:** Southeastern Utah Business and Technical Assistance Center (BTAC)
**Raw:** raw/btac-official-website-archive/2026-08-11-daec9c85154b.txt
**Retrieved:** 2026-08-11
**Updated:** 2026-08-11
**Relates:** cites [Business Technical Assistance Center](business-technical-assistance-center.md) · https://greatutah.work/pages/business-technical-assistance-center.md · https://web.archive.org/web/20250325062537/https://www.btac.business/

## Summary

BTAC's own website, captured before it broke. The live URL has returned an HTTP 500 WordPress error
since spring 2025 — re-checked 2026-08-11, still 500 — so everything the organization published about
itself now survives only in the Internet Archive.

This page exists as the worked example of why self-reported sources are captured rather than linked
(`meta/conventions.md` P5). Without the snapshot and the quotes below, the wiki's description of BTAC's
facility would rest on a third-party directory listing and nothing else.

## Useful Claims

- BTAC published its address as **375 S. Carbon Ave, Price, UT 84501**, with phone **(435) 637-7336**
  and contact address `info@btac.business`. This agrees with the organization's IRS registration and
  contradicts the third-party directory address the wiki page previously carried.
- The site described a coworking space in **Carbon County, Utah**, and stated a mission of providing
  remote workspace, business incubation space, and a technology learning space in partnership with
  local governments, educational institutions, and local businesses, to build an entrepreneurial
  ecosystem in southeast Utah.
- Published amenities were: free parking, security, business address, **24 hour access**, **fiber
  internet**, industry events, events, mail services, easy monthly billing, printing services, event
  space, **conference meeting rooms**, and phone booths.
- A commercial kitchen is referenced in the site's own articles ("Commercial Kitchen Opens
  Opportunities for Food Service"), but was **not** listed among the amenities.
- **No pricing or membership rates were published** anywhere on the captured page.
- The site was substantively intact at the 2025-03-25 capture (29,378 bytes) and had already been
  replaced by a 2,348-byte error page by the 2025-04-06 capture — so the failure occurred within that
  twelve-day window and has persisted for over a year.

## Verbatim

> "Our dynamic coworking space – located in Carbon County, Utah – is the perfect setting for a growing
> business to flourish"
> — Home page, hero

> "BTAC Mission Statement To provide innovative ongoing professional remote workspace, services, and
> business incubation space, and a hands on technological learning space by partnering with local
> governments, educational institutions and local businesses to foster an entrepreneurial ecosystem in
> southeast Utah."
> — Home page, "BTAC Mission Statement"

> "Amenities Free Parking Security Business Address 24 Hour Access Fiber Internet Industry Events
> Events Mail Services Easy Monthly Billing Printing Services Event Space Conference Meeting Rooms
> Phone Booths"
> — Home page, "Amenities" (list rendered inline)

> "Address 375 S. Carbon Ave Price, UT 84501 Contact Feel free to contact us at.. (435) 637-7336
> info@btac.business"
> — Home page, footer

Staff and board names appearing in the same footer are omitted deliberately; they are private
individuals and add nothing the wiki needs.

The capture history that dates the failure, exactly as the Internet Archive's CDX API returned it
(`urlkey, timestamp, original, mimetype, statuscode, digest, length` — note the length column):

```
["business,btac)/","20250325062537","https://www.btac.business/","text/html","200","636KKWM3J6L6RKQEVDEYJYKUJVC53RWD","29378"]
["business,btac)/","20250406113319","https://www.btac.business/","text/html","200","67P2MCO53ITTMLP5Z5B3HPL44BT37OGJ","2348"]
```

## Reliability Notes

Self-reported tier: this is the organization describing itself, so it is strong evidence of what BTAC
claimed to offer and weak evidence that any of it is available today. It is now also *historical* —
the newest capture with real content is from March 2025, and a coworking space's amenities, hours, and
pricing are exactly the facts that change without notice.

The archive record is what makes the failure date knowable. The CDX query below returns the capture
history, and the length column is the tell: ~19,000–30,000 bytes while the site worked, ~2,200 bytes
once it broke.

```bash
curl -s 'https://web.archive.org/cdx/search/cdx?url=www.btac.business&output=json&from=20240601&to=20250718&filter=statuscode:200'
curl -sS -o /dev/null -w '%{http_code}\n' https://www.btac.business/   # 500 as of 2026-08-11
```

Per `meta/conventions.md`, a failed fetch is not proof a site is dead — but a WordPress 500 that has
persisted across sixteen months of independent captures is not a WAF block, and the organization's
continued IRS filings ([Source: IRS Form 990 Record — Southeastern Utah BTAC](btac-form-990-record.md))
separate a broken site from a closed organization.

## Related Pages

- [Business Technical Assistance Center](business-technical-assistance-center.md)
- [Source: IRS Form 990 Record — Southeastern Utah BTAC](btac-form-990-record.md)
- [Source: IRS Exempt Organizations Business Master File, Utah Extract](irs-bmf-utah-exempt-organizations.md)

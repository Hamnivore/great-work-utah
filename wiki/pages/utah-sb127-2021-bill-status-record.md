# Source: Utah S.B. 127 (2021) Legislative Status Record

**Type:** source
**Status:** Useful
**Confidence:** High
**Source Type:** government-record
**URL:** https://le.utah.gov/data/2021GS/SB0127.json
**Publisher:** Utah State Legislature
**Retrieved:** 2026-08-12
**Raw:** raw/utah-sb127-2021-bill-status-record/2026-08-11-a26f01f5fd42.txt
**Updated:** 2026-08-11

## Summary

The Legislature's machine-readable status record for **S.B. 127 (2021 General Session)** — the JSON
document that the bill's own page on `le.utah.gov` renders as its status tab. It exists here for one
reason the enrolled bill cannot supply: the date the governor signed it, and the path it took to get
there.

## Useful Claims

- **The bill became law on 2021-03-22.** The record's last action is "Governor Signed", owned by the
  Lieutenant Governor's office for filing, timestamped 2021-03-22T16:54:11.000Z, and the action
  history's final row is dated 2021-03-22.
- **The version that passed was a substitute**, `SB0127S01`, not the bill as introduced. The record
  shows a Senate committee substitute and amendment recommendation on 2021-02-08.
- **It moved through the 2021 session in five weeks**: numbered 2021-01-25, Senate third reading
  passed 2021-02-16, House third reading passed 2021-03-02, signed 2021-03-22.
- **Two House floor amendments failed** on 2021-03-02 before the bill passed third reading.
- **The bill was returned to House Rules "due to fiscal impact"** on 2021-02-24 despite appropriating
  nothing itself, and a fiscal note was published during the Senate stage.
- **The Legislature's own subject tags for it** are Juveniles, Substance Abuse, Mental Health,
  Judicial Operations, Human Services, Department of Human Services, Human Services Licensure, Office
  of Licensing, and Substance Use Disorder Treatment — and the code sections it touches are
  62A-2-101, 62A-2-106, 62A-2-118, 62A-2-120, 62A-2-123, and 62A-2-124.

## Verbatim

> "'lastaction':'Governor Signed', 'lastactionowner':'Lieutenant Governor's office for filing', 'lastactiontime':'2021-03-22T16:54:11.000Z',"
> — Bill-level fields

> "{'date':'2021-03-22', 'action':'Governor Signed','location':'Lieutenant Governor's office for filing'}"
> — Final row of the action history

> "{'date':'2021-03-02', 'action':'House/ floor amendment failed','location':'House 3rd Reading Calendar for Senate bills'}"
> — Action history

> "'bill':'SB0127', 'version':'SB0127S01', 'shorttitle':'Human Services Program Amendments',"
> — Bill-level fields

## Reliability Notes

**Primary tier: the Legislature's own record of its own proceedings**, at a mandated host, so no
archive snapshot is owed. The capture is the JSON as served; quotes above are fragments of it, with
double quotes folded to single quotes as markdown nesting requires.

**This endpoint is undocumented.** It was found by reading the bill page's client-side script
(`/js/rexBill.js`), which builds the URL as `/data/<sessionID>/<billNumber>.json`. It is the source
the Legislature's own page displays, which is the argument for trusting it; it carries no versioning
or stability promise, which is the argument for having captured it.

**The 2021 schema differs from later sessions.** This record's action history gives dates, actions,
and locations but no vote tallies, so the margins by which S.B. 127 passed are not knowable from it —
where [the 2025 record](utah-sb297-2025-bill-status-record.md) does carry a `voteStr` on every roll
call. Contemporaneous reporting described the 2021 package as approved "with only a handful of
opposing votes" ([APM Reports](apm-reports-utah-youth-treatment-inspections-2021.md)); that remains a
journalist's characterization, not a tally this wiki holds.

## Related Pages

- [Utah Congregate Care Oversight Reform](utah-congregate-care-oversight-reform.md)
- [Source: Utah S.B. 127 (2021) — Human Services Program Amendments](utah-sb127-2021-congregate-care-statute.md)
- [Source: Utah S.B. 297 (2025) Legislative Status Record](utah-sb297-2025-bill-status-record.md)

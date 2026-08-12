# Source: Utah S.B. 297 (2025) Legislative Status Record

**Type:** source
**Status:** Useful
**Confidence:** High
**Source Type:** government-record
**URL:** https://le.utah.gov/data/2025GS/SB0297.json
**Publisher:** Utah State Legislature
**Retrieved:** 2026-08-12
**Raw:** raw/utah-sb297-2025-bill-status-record/2026-08-11-88c2e416fb8d.txt
**Updated:** 2026-08-11

## Summary

The Legislature's machine-readable status record for **S.B. 297 (2025 General Session)**, "Congregate
Care Amendments". It supplies what the enrolled statute does not: that the bill was signed on
2025-03-19, that it was rewritten five times on its way through, and that it drew real opposition —
six no votes in the Senate and nineteen in the House.

That last point is why this record is worth a page rather than a footnote. The earlier round of reform
passed close to unanimously ([S.B. 127](utah-sb127-2021-bill-status-record.md)); this one, which
created an ombudsman with powers of entry and records access, did not.

## Useful Claims

- **The bill became law on 2025-03-19.** Last action "Governor Signed", owner "Lieutenant Governor's
  office for filing", action date 2025-03-19 8:24 AM.
- **The enacted version was the fifth substitute**, `SB0297S05`, floor-amended once in the House on
  2025-03-05.
- **Roll calls**: Senate third reading 19-6-4 on 2025-02-28; House third reading 53-19-3 on
  2025-03-05; Senate concurrence in the House amendment 27-1-1 later that day. Senate second reading
  had passed 24-3-2 the previous day.
- **No committee member in either chamber voted against it**: Senate Judiciary, Law Enforcement, and
  Criminal Justice reported it favorably 8-0-1 on 2025-02-21; House Health and Human Services reported
  it favorably 10-0-4 on 2025-03-04. "Unanimous" is the wrong word for the second of those — four
  members did not vote, so ten of a fourteen-member committee carried it.
- **It was returned to House Rules "due to fiscal impact"** on 2025-03-04, and fiscal notes were
  published for substitutes 2 through 5.
- **Sponsors**: Sen. Michael K. McKell as prime sponsor — the same senator who carried
  [S.B. 127 in 2021](utah-sb127-2021-congregate-care-statute.md) — with Rep. Casey Snider as floor
  sponsor.
- **The record's own subject tags** include Child Welfare, Health Care Facilities, Mental Health,
  Juvenile Justice Services, and the Office of Licensing and Background Checks; the code sections it
  touches are 26B-1-204, 26B-1-334, 26B-2-101, 26B-2-104, 26B-2-107, 26B-2-120, 26B-2-124, and
  26B-2-709.

## Verbatim

> "'lastAction':'Governor Signed','lastActionOwner':'Lieutenant Governor's office for filing','lastActionDate':'3/19/2025'"
> — Bill-level fields

> "{'description':'Senate/ passed 3rd reading','owner':'Clerk of the House','actionDate':'2/28/2025 3:39 PM','actionClass':'S','voteID':'1462','voiceVote':'0','voteHouse':'S','voteStr':'19-6-4'"
> — Action history

> "{'description':'House/ passed 3rd reading','owner':'Senate Secretary','actionDate':'3/5/2025 3:11 PM','actionClass':'H','voteID':'1200','voiceVote':'0','voteHouse':'H','voteStr':'53-19-3'"
> — Action history

> "'voteStr':'27-1-1','actionCode':'SCONCUR'"
> — Action history, Senate concurrence

> "'billNumberLong':'SB0297S05','fileNumber':'2025FL1086','shortTitle':'Congregate Care Amendments'"
> — Bill-level fields

> "'primeSponsorName':'Sen. McKell, Michael K.','primeSponsorHouse':'S','floorSponsor':'SNIDEC','floorSponsorName':'Rep. Snider, Casey'"
> — Bill-level fields

## Reliability Notes

**Primary tier: the Legislature's own record of its own proceedings**, at a mandated host, so no
archive snapshot is owed. Quotes are fragments of the JSON as served, with double quotes folded to
single quotes for markdown nesting; the words, names, dates, and tallies are unchanged.

**This endpoint is undocumented**, found by reading the bill page's own client-side script
(`/js/rexBill.js`), which builds `/data/<sessionID>/<billNumber>.json`. It is what the Legislature's
page displays, and it carries no stability promise — hence the capture.

**A vote string is three numbers, and the third is not a no vote.** Utah records yea-nay-absent, so
53-19-3 is fifty-three for, nineteen against, three not voting. Reading the third figure as
opposition would overstate the contest, and reading the second as noise would understate it.

**The record says nothing about why anyone voted no**, and this page does not guess. Floor-debate
audio for the four listed floor items exists in the Legislature's own archive and has not been
reviewed; the committee agendas and minutes are linked from the same record.

**A status record is not a statute.** For what the bill actually requires, read
[the enrolled text](utah-sb297-2025-congregate-care-statute.md); this document establishes only that
it passed, when, by what margins, and in which version.

## Related Pages

- [Utah Congregate Care Oversight Reform](utah-congregate-care-oversight-reform.md)
- [Source: Utah S.B. 297 (2025) — Congregate Care Amendments](utah-sb297-2025-congregate-care-statute.md)
- [Source: Utah S.B. 127 (2021) Legislative Status Record](utah-sb127-2021-bill-status-record.md)

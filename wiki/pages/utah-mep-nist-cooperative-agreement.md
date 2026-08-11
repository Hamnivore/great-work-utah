# Source: Utah MEP Center NIST Cooperative Agreement 70NANB21H095

**Type:** source
**Status:** Useful
**Confidence:** High
**Source Type:** government-record
**URL:** https://www.usaspending.gov/award/ASST_NON_70NANB21H095_013
**Publisher:** USAspending.gov (U.S. Department of the Treasury), from Department of Commerce / NIST award reporting
**Retrieved:** 2026-08-11
**Updated:** 2026-08-11

## Summary

The federal award record behind Utah MEP: NIST cooperative agreement **70NANB21H095**, "UNIVERSITY OF
UTAH MANUFACTURING EXTENSION PARTNERSHIP CENTER (UUMEP)", awarded to the **University of Utah** and
running **2021-10-01 through 2026-09-30**.

It establishes three things the organization's own website cannot. Utah MEP is the federally
designated Manufacturing Extension Partnership center for Utah, operating under a Department of
Commerce cooperative agreement rather than as an independent nonprofit or a state agency. Its legal
recipient of record is the University of Utah. And the money is mostly *not* federal: the record
carries a larger non-federal cost share than federal obligation, which is what the MEP statute
requires and what makes the center a cost-shared public/private arrangement rather than a grant
program.

## Useful Claims

- Award identity: FAIN **70NANB21H095**, a cooperative agreement (assistance type **05**), signed
  **2021-08-06**, period of performance **2021-10-01** to **2026-09-30**, awarded by the **National
  Institute of Standards and Technology** within the Department of Commerce, under CFDA program
  **11.611, "Manufacturing Extension Partnership"**.
- Recipient: **University of Utah**, UEI **LL8GLEVH6MG3**, 75 South 2000 East, Salt Lake City, UT
  84112 (Salt Lake County). Place of performance is the same Salt Lake City address. Utah MEP itself
  has no separate federal registration — a USAspending recipient search for "Utah MEP" or "Utah
  Manufacturing Extension" returns nothing.
- Money: federal obligation **$7,362,990**, non-federal funding **$10,137,235**, total funding
  **$17,500,225**. The center passed through **$2,153,669** in **6** subawards.
- The cost share is statutory, not incidental: the program's eligibility text states that applicants
  "generally must contribute at least 50 percent of the proposed service's capital, annual operating
  and maintenance costs," under **15 U.S.C. § 278k**.
- The program's stated purpose, from the CFDA objectives, is to improve the competitiveness of firms
  "by accelerating the usage of appropriate manufacturing technology by smaller U.S. based
  manufacturing firms," with states as partners in delivering technical assistance — the mandate
  under which Utah MEP's service catalog exists.
- This is a continuing designation, not a one-off: the same recipient held the predecessor award
  **70NANB16H222**, **$4,621,392.03**, covering 2016-10-01 to 2021-09-30.
- Program scale for context, from the CFDA record: MEP cooperative agreements nationally were
  **$155,372,000** in FY2023, with FY2025 estimated at **$144,361,000**. Utah's center is one of a
  national network funded from that line.

## Verbatim

From the award record, exactly as the API returns it:

```
generated_unique_award_id  ASST_NON_70NANB21H095_013
fain                       70NANB21H095
type_description           COOPERATIVE AGREEMENT (B)
description                UNIVERSITY OF UTAH MANUFACTURING EXTENSION PARTNERSHIP CENTER (UUMEP)
date_signed                2021-08-06
period_of_performance      2021-10-01 to 2026-09-30
total_obligation           7362990.0
non_federal_funding        10137235.0
total_funding              17500225.0
subaward_count             6
total_subaward_amount      2153669.0
recipient_name             UNIVERSITY OF UTAH
recipient_uei              LL8GLEVH6MG3
recipient address          75 SOUTH 2000 EAST, SALT LAKE CITY, UT 84112, SALT LAKE county
awarding agency            Department of Commerce / National Institute of Standards and Technology
cfda_number                11.611
cfda_title                 Manufacturing Extension Partnership
```

From the CFDA program record attached to the award:

> For MEP Center projects under 15 U.S.C. § 278k, eligible applicants shall be U.S.-based nonprofit
> institutions or organizations or a consortium thereof; institutions of higher education; or a
> State, U.S. territory, local or tribal government. Applicants generally must contribute at least 50
> percent of the proposed service's capital, annual operating and maintenance costs.

— `cfda_info[0].applicant_eligibility`

> Establish, maintain, and support Manufacturing Extension Centers and services, the functions of
> which are to improve the competitiveness of firms by accelerating the usage of appropriate
> manufacturing technology by smaller U.S. based manufacturing firms, and partner with the States in
> developing such technical assistance programs and services for their manufacturing base.

— `cfda_info[0].cfda_objectives`

> (Cooperative Agreements) FY 23$155,372,000.00; FY 24 est $151,675,000.00; FY 25 est
> $144,361,000.00; FY 22$132,000,000.00

— `cfda_info[0].cfda_obligations`

Predecessor award, from the same search endpoint:

```
70NANB16H222 | UNIVERSITY OF UTAH | 4621392.03 | 2016-10-01 to 2021-09-30 |
  UNIVERSITY OF UTAH MANUFACTURING EXTENSION PARTNERSHIP (UUMEP) CENTER
```

## Reliability Notes

Primary tier at a host obliged to keep it: a federal assistance record, reported by NIST, retrievable
by FAIN at USAspending.

What it establishes and what it does not. It establishes the center's federal designation, operator,
funding, cost share, term, and statutory mandate. It says **nothing about services delivered** — no
client counts, no engagement list, no pricing — so Utah MEP's service catalog remains self-reported
and belongs to the official-site source, not to this record. It also does not settle the center's
street address: the recipient address here is the University of Utah's central administrative address,
while the center publishes a Merrill Engineering Building room as its office. Both can be true, and
the map metadata should follow the center's own contact page rather than this record.

Two cautions on the money. **Non-federal funding is as reported, not audited** — the cost-share figure
comes from the recipient's reporting, and MEP centers commonly count in-kind state and client
contributions toward it. **The award is nearing its end date** (2026-09-30), so a reader checking after
that date should look for a successor FAIN rather than assuming lapse; MEP designations are
recompeted, as the 2016 predecessor award shows.

To re-check:

```bash
curl -s https://api.usaspending.gov/api/v2/awards/ASST_NON_70NANB21H095_013/ \
  | jq '{fain, total_obligation, non_federal_funding, period_of_performance,
         recipient: .recipient.recipient_uei, cfda: .cfda_info[0].cfda_number}'
```

## Related Pages

- [Utah MEP](utah-mep.md)
- [Utah MEP Official Site](utah-mep-official-site.md)

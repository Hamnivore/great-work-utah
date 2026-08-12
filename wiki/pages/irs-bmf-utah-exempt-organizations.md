# Source: IRS Exempt Organizations Business Master File, Utah Extract

**Type:** source
**Status:** Useful
**Confidence:** High
**Source Type:** dataset
**URL:** https://www.irs.gov/pub/irs-soi/eo_ut.csv
**Publisher:** Internal Revenue Service (Statistics of Income — Exempt Organizations Business Master File)
**Retrieved:** 2026-08-12
**Updated:** 2026-08-11

## Summary

The IRS publishes its Exempt Organizations Business Master File as one CSV per state. `eo_ut.csv` is
the Utah extract: one row per organization the IRS currently recognizes as tax-exempt in Utah, keyed
by EIN. Retrieved 2026-08-11 at 2,227,145 bytes.

This is the cheapest authoritative answer to three questions the wiki asks constantly about
nonprofits, chambers, incubators, and community programs: **does this organization legally exist, is
it still filing, and how big is it?** It answers all three without depending on the organization's
website, which is what makes it the right first stop when a `helper` or `resource` page's site has
gone dark.

It is a reusable source: any page with an `**Identifiers:** ein=...` line can cite this dataset and
quote its own row, rather than each page inventing a separate source page for the same file.

## Useful Claims

- Every row carries: EIN, legal name, care-of contact, mailing address, subsection code, affiliation,
  classification, ruling date, deductibility, foundation code, organization type, exemption status,
  the tax period of the most recent return processed, and asset, income, and revenue amounts in
  dollars, plus an NTEE classification code.
- `SUBSECTION` **03** identifies a 501(c)(3); `STATUS` **01** is an unconditional exemption in force;
  `FOUNDATION` **16** is a 509(a)(2) publicly supported charity; the `RULING` field is `YYYYMM` of the
  exemption determination. Column definitions are published by the IRS with the extract.
- `TAX_PERIOD` is the strongest available liveness signal short of a state registry: a period within
  the last ~18 months means the organization filed a return recently, whatever its website is doing.
- The dataset is a snapshot, not a history. It carries only the most recent return processed; use
  [Source: IRS Form 990 Record — Southeastern Utah BTAC](btac-form-990-record.md)-style filing records
  for multi-year financials.

## Verbatim

Header row, exactly as published:

```
EIN,NAME,ICO,STREET,CITY,STATE,ZIP,GROUP,SUBSECTION,AFFILIATION,CLASSIFICATION,RULING,DEDUCTIBILITY,FOUNDATION,ACTIVITY,ORGANIZATION,STATUS,TAX_PERIOD,ASSET_CD,INCOME_CD,FILING_REQ_CD,PF_FILING_REQ_CD,ACCT_PD,ASSET_AMT,INCOME_AMT,REVENUE_AMT,NTEE_CD,SORT_NAME
```

The row for EIN 87-0530362, cited by
[Business Technical Assistance Center](business-technical-assistance-center.md). The care-of
individual's name is redacted here — it is a private person, not a public principal, and the wiki does
not republish personal contact details (see `meta/conventions.md`, location precedent 14):

```
870530362,SOUTHEASTERN UTAH BUSINESS AND TECHNICAL ASSISTANCE CENTER INC,% [name redacted],PO BOX 1106,PRICE,UT,84501-1106,0000,03,3,1200,199605,1,16,995402000,1,01,202512,3,4,01,0,12,78627,116876,116876,S30,
```

Decoded: 501(c)(3) (`SUBSECTION 03`), exemption ruling **1996-05** (`RULING 199605`), unconditional
exemption in force (`STATUS 01`), 509(a)(2) public charity (`FOUNDATION 16`), most recent return
processed for tax period **2025-12** (`TAX_PERIOD 202512`), assets **$78,627**, income **$116,876**,
revenue **$116,876**, NTEE **S30** (economic development).

## Reliability Notes

Primary-tier. This is the IRS's own administrative record, republished by the IRS, and it is the
authority on exempt status. Three limits matter in practice.

First, it lags: rows reflect the most recent return the IRS has *processed*, which can trail filing by
months, so absence of a recent tax period is weak evidence of dormancy while presence is strong
evidence of activity. Second, addresses are mailing addresses — frequently a PO box or an
accountant's office — and must never be treated as a physical site for map metadata. Third, revenue
and asset amounts come from the return as filed, unaudited, and for small filers (990-EZ, 990-N) they
are coarse.

To re-check a row:

```bash
curl -s https://www.irs.gov/pub/irs-soi/eo_ut.csv | rg '^870530362,'
```

## Related Pages

- [Business Technical Assistance Center](business-technical-assistance-center.md)
- [Source: IRS Form 990 Record — Southeastern Utah BTAC](btac-form-990-record.md)

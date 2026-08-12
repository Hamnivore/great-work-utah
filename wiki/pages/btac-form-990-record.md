# Source: IRS Form 990 Record — Southeastern Utah BTAC

**Type:** source
**Status:** Useful
**Confidence:** High
**Source Type:** dataset
**URL:** https://projects.propublica.org/nonprofits/api/v2/organizations/870530362.json
**Publisher:** ProPublica Nonprofit Explorer (republishing IRS Form 990 data)
**Raw:** raw/btac-form-990-record/2026-08-11-f65336abf0a2.txt
**Retrieved:** 2026-08-12
**Updated:** 2026-08-11
**Relates:** cites [Business Technical Assistance Center](business-technical-assistance-center.md) · https://greatutah.work/pages/business-technical-assistance-center.md · https://projects.propublica.org/nonprofits/organizations/870530362

## Summary

The Form 990 filing history of **Southeastern Utah Business and Technical Assistance Center Inc**
(EIN **87-0530362**), the legal entity behind BTAC in Price, as returned by ProPublica's Nonprofit
Explorer API on 2026-08-11.

This record exists on the wiki because BTAC's own website has been broken since spring 2025, which had
left its page at `Confidence: Low` with an open question about whether the organization still operates.
The filing history answers that: it has filed a Form 990-EZ every year, most recently for tax year
2024 (filed 2025-07-11), and the IRS Business Master File carries a return processed for tax period
2025-12.

## Useful Claims

- The organization is a 501(c)(3) with an IRS exemption ruling dated **1996-05-01**, registered at
  **375 South Carbon Ave, Price, UT 84501** — the same street address the organization's own archived
  website published, and a different address from the third-party directory listing the wiki had used.
- Most recent fiscal year with extracted financial data is **2023**: revenue **$109,245**, expenses
  **$109,923**, total assets **$244,294**.
- Prior years show a small, stable operation: 2022 revenue **$65,945**; 2021 revenue **$101,777**;
  2020 revenue **$54,681**; 2019 revenue **$58,936**. Across every year on record since 2011, revenue
  has ranged from **$23,179** (2014) to **$109,245** (2023).
- A Form 990-EZ for tax year **2024** was filed on **2025-07-11** and is available as a PDF, though its
  line items were not yet extracted into the API's structured data when retrieved.
- The organization files **990-EZ**, which places it under the IRS gross-receipts threshold for the
  full Form 990 — i.e. this is a small community organization, not an institution.

## Verbatim

Key fields exactly as the API returned them (`filings_with_data`, most recent first; amounts in USD):

```
organization.name      Southeastern Utah Business And Technical Assistance Center Inc
organization.address   375 SOUTH CARBON AVE, Price, UT 84501-2909
organization.ruling    1996-05-01
tax_prd_yr 2023  totrevenue 109245  totfuncexpns 109923  totassetsend 244294  form 990EZ
tax_prd_yr 2022  totrevenue  65945  totfuncexpns  74905  totassetsend 244972  form 990EZ
tax_prd_yr 2021  totrevenue 101777  totfuncexpns  35794  totassetsend 253932  form 990EZ
tax_prd_yr 2020  totrevenue  54681  totfuncexpns  48345  totassetsend 187949  form 990EZ
tax_prd_yr 2019  totrevenue  58936  totfuncexpns  35051  totassetsend 181614  form 990EZ
tax_prd_yr 2018  totrevenue  56151  totfuncexpns  49688  totassetsend 157730  form 990EZ
tax_prd_yr 2017  totrevenue  63244  totfuncexpns  47202  totassetsend 151267  form 990EZ
tax_prd_yr 2016  totrevenue  47736  totfuncexpns  33397  totassetsend 135225  form 990EZ
tax_prd_yr 2015  totrevenue  29729  totfuncexpns  37136  totassetsend 120886  form 990EZ
tax_prd_yr 2014  totrevenue  23179  totfuncexpns  51891  totassetsend 128293  form 990EZ
tax_prd_yr 2013  totrevenue  30258  totfuncexpns  46035  totassetsend 157004  form 990EZ
tax_prd_yr 2012  totrevenue 103741  totfuncexpns  52790  totassetsend 172781  form 990EZ
tax_prd_yr 2011  totrevenue  53107  totfuncexpns  55943  totassetsend 121830  form 990EZ
filings_without_data: tax_prd_yr 2024, 990EZ, filed 2025-07-11 (PDF available)
```

## Reliability Notes

The underlying artifacts — the Form 990-EZ returns — are primary-tier: filed with the IRS under
penalty of perjury and public by statute. ProPublica is an intermediary, not the publisher of record;
it is a well-established and faithful one, but for a specific line item cite the return PDF itself
rather than the API. ProPublica asks for attribution, which this page provides.

Two limits. Structured data lags the filing by roughly a year, so the most recent year available here
(2023) is not the most recent year filed (2024) — the IRS Business Master File is more current on
status and headline revenue, and disagrees on scale for the newest period, reporting assets of $78,627
and revenue of $116,876 for tax period 2025-12. Both records are cited rather than reconciled; the
divergence is itself a fact about a small filer's fluctuating balance sheet. Second, a 990-EZ says
nothing about programs, pricing, or whether a physical facility is open — for that, only a person on
the ground or a working website will do.

This page carries no **Archive:** snapshot, and cannot: the Wayback Machine holds no capture of this
URL, because crawlers index pages and this is a JSON API response. The protection against the
endpoint changing is therefore the committed copy under **Raw:** above, whose figures the linter
checks the quoted excerpt against. If ProPublica retires this API, re-derive the same facts from the
IRS directly — the exempt-organization filing data is public in bulk, and the BMF extract cited below
already carries this EIN.

To re-check:

```bash
curl -s https://projects.propublica.org/nonprofits/api/v2/organizations/870530362.json | jq '.filings_with_data[0]'
```

## Related Pages

- [Business Technical Assistance Center](business-technical-assistance-center.md)
- [Source: IRS Exempt Organizations Business Master File, Utah Extract](irs-bmf-utah-exempt-organizations.md)
- [Source: BTAC Official Website (archived)](btac-official-website-archive.md)

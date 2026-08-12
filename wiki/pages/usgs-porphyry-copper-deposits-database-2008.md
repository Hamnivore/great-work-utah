# USGS Porphyry Copper Deposits of the World, 2008 (OFR 2008-1155)

**Type:** source
**Status:** Useful
**Confidence:** High
**Source Type:** dataset
**Publisher:** U.S. Geological Survey
**Retrieved:** 2026-08-12
**URL:** https://doi.org/10.3133/ofr20081155
**Updated:** 2026-08-11

## Summary

The USGS's global inventory of porphyry copper deposits — Singer, Berger, and Moring, Open-File Report 2008-1155 — published as a report plus a machine-readable data folder with one row per deposit. Its Bingham row is the authoritative size-and-grade record for the orebody under the Bingham Canyon Mine, and it is a reusable source: any Utah porphyry deposit page can cite this one page and record its own row key inline (P5 precedent 7).

## Useful Claims

- The Bingham deposit appears as `depname` "Bingham", `rec_id` 670, `dep_id` 36, `stprov` Utah, at 40.529167, -112.153889.
- Ore tonnage (`oreton`) is 3230, in millions of metric tons. The database defines this field as "Total tons of ore based on total production, reserves, and resources at the lowest possible cutoff grade, in millions of metric tons" — it is the deposit total across what has been mined and what remains, not an annual or cumulative production figure.
- Grades are recorded as copper 0.882 percent, molybdenum 0.053 percent, gold 0.38 g/t, and silver 3.3 g/t. `cugrd` is defined as the "Average grade of copper for the deposit, as percent of metal in ore" — a deposit-wide average over that same production-plus-resources tonnage, which is not the same quantity as the grade of ore being mined in any given year.
- Discovery date (`discdate`) is 1863 and startup date (`startdate`) is 1906, the latter defined as the "Date mining of the deposit began".
- Deposit age is given as 37.0 ± 0.27 Ma by Re-Os dating, with host and deposit rocks recorded as latite porphyry, minette, monzonite, quartz latite porphyry, quartz monzonite porphyry, breccia, and skarn.

## Reliability Notes

Primary tier: a published machine-readable dataset from an authoritative publisher, cited by DOI. The DOI resolves at doi.org and the USGS is obliged to keep the report, so no archive snapshot is owed; the retrieval key is the DOI plus the row identifiers recorded above.

Read the tonnage and grade fields for what they are. Both are deposit totals under a stated definition, compiled in 2008 from the literature — they are not production accounting, not reserves as a company would report them under a securities regime, and not current mined grade. A page that quotes the 0.882 percent copper figure as "the ore grade at Bingham" will contradict operating figures in the 0.3–0.5 percent range and both can be correct, because they measure different things. Say which one is meant.

The compilation dates from 2008 and is explicitly a snapshot: the report describes itself as an update of earlier versions revised because of "substantial increases in resources in some deposits". Mining and reserve additions since 2008 are not in it.

## Related Pages

- [Kennecott Bingham Canyon Mine](bingham-canyon-mine.md)

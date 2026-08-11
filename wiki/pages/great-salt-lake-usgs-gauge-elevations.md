# Source: USGS Great Salt Lake Gauge Elevations (NWIS)

**Type:** source
**Status:** Useful
**Confidence:** High
**Source Type:** dataset
**URL:** https://doi.org/10.5066/F7P55KJN
**Publisher:** U.S. Geological Survey — National Water Information System (NWIS)
**Retrieved:** 2026-08-11
**Updated:** 2026-08-11

## Summary

The Great Salt Lake's surface elevation is measured rather than asserted, and the USGS is the body
that measures it. Two lake-stage gauges report it: site **10010000** — `GREAT SALT LAKE AT SALTAIR
BOAT HARBOR, UT`, in the south arm — and site **10010100** — `GREAT SALT LAKE NEAR SALINE, UT`, in
the north arm, above the railroad causeway that separates the two water bodies. Both publish
parameter code **62614**, `Lake or reservoir water surface elevation above NGVD 1929, ft`, through
the National Water Information System.

The daily-value series at Saltair begins in **1847**, which makes it one of the longest
environmental records in the interior West and the only one that can settle an argument about
whether the lake is rising or falling this year. Any page on this wiki that needs a lake level
should cite this dataset with a site number, a parameter code, and a date instead of repeating a
figure from a news story.

## Useful Claims

- Two gauges, two arms, one parameter: **10010000** at Saltair Boat Harbor (south arm, Salt Lake
  County, 40.73133329, -112.2135569) and **10010100** near Saline (north arm, Box Elder County,
  41.25521065, -112.496903), both reporting parameter **62614** in feet above the NGVD 1929 datum.
  The two arms are hydrologically separated by the causeway and do not read the same number.
- Fetched **2026-08-11**: the south-arm gauge read **4190.5 feet** at 13:45 MDT and the north-arm
  gauge read **4190.1 feet** at 13:15 MDT. Both are flagged provisional.
- The lowest daily mean elevation in the Saltair record is **4188.5 feet**, on **2022-11-07**. This
  is the measured floor of the 2022 record low.
- The highest daily mean in the record is **4211.60 feet**, reached 1986-06-03 and twice in the
  1870s (1872-06-27 and 1873-07-16).
- The record opens **1847-10-18** at **4199.80 feet**. Measured top to measured bottom, the lake has
  moved roughly 23 vertical feet across the record — on a lake this flat, that is the difference
  between the historic high stand and exposed lakebed across hundreds of square miles.
- Elevation is what this dataset carries. Surface area, volume, and salinity are not in it; they are
  derived from elevation through bathymetry, and a claim about area needs an elevation–area–capacity
  table, not this series alone.

## Verbatim

Instantaneous values, from
`https://waterservices.usgs.gov/nwis/iv/?sites=10010000,10010100&parameterCd=62614&format=json`
retrieved 2026-08-11 (site name, then the latest value object exactly as returned):

```
"siteName":"GREAT SALT LAKE AT SALTAIR BOAT HARBOR, UT" ... "value":"4190.5","qualifiers":["P"],"dateTime":"2026-08-11T13:45:00.000-06:00"
"siteName":"GREAT SALT LAKE NEAR SALINE, UT" ... "value":"4190.1","qualifiers":["P"],"dateTime":"2026-08-11T13:15:00.000-06:00"
"variableName":"Lake or reservoir water surface elevation above NGVD 1929, ft"
"qualifierCode":"P","qualifierDescription":"Provisional data subject to revision."
```

Daily values for 10010000, from
`https://waterservices.usgs.gov/nwis/dv/?sites=10010000&parameterCd=62614&startDT=1847-01-01&endDT=2026-08-11&format=rdb`
(tab-separated: agency, site, date, daily mean elevation in feet, approval code):

```
agency_cd	site_no	datetime	325949_62614_00003	325949_62614_00003_cd
USGS	10010000	1847-10-18	4199.80	A:e
USGS	10010000	1872-06-27	4211.60	A:e
USGS	10010000	1986-06-03	4211.60	A
USGS	10010000	2022-11-07	4188.5	A:e
USGS	10010000	2026-08-10	4190.4	P
```

## Reliability Notes

Primary tier. This is a federal monitoring record the USGS created and maintains under its own
mandate, published as a citable dataset (DOI `10.5066/F7P55KJN`), and it is retrievable forever by
site number and parameter code — which is why this page records the query rather than an archive
snapshot.

Four limits matter when quoting it. **Provisional versus approved:** recent values carry the `P`
flag and are subject to revision; the historical extremes above carry `A` (approved), and `A:e`
marks an approved value that was estimated rather than directly recorded, which is normal for the
nineteenth-century portion of the series. **Two arms, two numbers:** the north and south arms are
separated by the causeway and differ by a few tenths of a foot to several feet depending on the
year, so a lake level is meaningless without saying which gauge. **Datum:** these are feet above
NGVD 1929, not NAVD 88; a figure from another source on a different datum is not comparable without
conversion. **Daily mean versus instantaneous:** the extremes above are daily means, so a
single-moment reading can dip below the record daily minimum without breaking it.

To re-check the current level:

```bash
curl -s "https://waterservices.usgs.gov/nwis/iv/?sites=10010000&parameterCd=62614&format=rdb" | tail -2
```

## Related Pages

- [Great Salt Lake](great-salt-lake.md)
- [USGS Great Salt Lake Science](great-salt-lake-usgs.md)
- [Official Website: Great Salt Lake](great-salt-lake-official-website.md)

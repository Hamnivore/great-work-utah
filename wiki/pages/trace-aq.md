# Trace AQ

**Type:** venture
**Status:** Draft
**Confidence:** Medium
**Focus:** air quality forecasting, wildfire smoke, physics-based AI, atmospheric science, public health alerts
**Stage:** Seed ($1.25M, 2025; Rusheen Capital Management-led)
**Primary Location:** Salt Lake City, UT
**Utah Location:** Salt Lake City, UT
**Region:** Salt Lake City
**Website:** https://www.traceaq.com/
**Updated:** 2026-06-19
**Needs-reviewed:** 2026-06-19
**Hero:** https://picsum.photos/seed/trace-aq-wildfire-smoke-forecast-2026/1600/1100
**Pull:** *Physics-based AI smoke forecasts that warn communities before public data says the air is dangerous.*
**Relates:** cites [Official Website: Trace AQ](trace-aq-official-website.md) · https://greatutah.work/pages/trace-aq-official-website.md · https://www.traceaq.com/

## Summary

Trace AQ is a Salt Lake City startup providing physics-based AI air quality and wildfire smoke forecasting. The company spun out of University of Utah research in Chemical Engineering and Atmospheric Sciences, licensing NSF-funded forecasting technology through the U's Technology Licensing Office.

Products include Flow AQ (a consumer mobile app with forecasts, alerts, and health-driven insights), Trace AQ | Aero (an enterprise and researcher forecasting platform with API access), and the ADAPT embeddable widget. The company closed a $1.25 million seed round in 2025 led by Rusheen Capital Management, with Thin Line Capital and Curt Doman participating.

## Impact

Wildfire smoke is a fast-growing public health crisis across the western United States. Salt Lake City's inversion bowl and Mountain West geography make the region acutely exposed, but smoke now regularly blankets populations from the Pacific Coast to the Great Plains. Standard public forecasts (EPA AirNow, NWS) can underpredict unhealthy air events — Trace AQ claims its 2025 fire-season forecasts correctly predicted roughly 400% more unhealthy air events than competitors or publicly available forecasts.

Accurate advance warning can reduce outdoor exposure on dangerous days, potentially lowering respiratory hospitalizations, asthma attacks, and long-term lung disease burden. At scale, earlier warnings shift behavior from reactive (staying inside after air is already bad) to proactive (planning training, school recess, and clinical outreach around forecasted events).

## What They Are Building

Trace AQ couples fluid dynamics, combustion chemistry, atmospheric chemistry, and local micrometeorology in physics-based models augmented with machine learning — running at finer resolution and faster update cycles than coarse-grid standard models. Per its official website, the product stack includes:

1. **Flow AQ** — mobile app with up to four-day forecasts, real-time conditions, personalized alerts, and health insights for any chosen location.
2. **Trace AQ | Aero** — forecasting platform with plume-rise modeling, continuous source detection, timelapse visualizations, and dual API access for integration.
3. **ADAPT widget** — embeddable live air-quality forecast for third-party websites.
4. **Whitepapers** — science-driven publications on athletic training impacts and the Air Quality Analytics (AQA) forecast engine.

The hard engineering problems are nonlinear coupling of wind fields, emission factors by fuel type, secondary aerosol formation, and local micrometeorology — especially for wildfire plume rise and transport at actionable resolution.

## What They Need Now

Likely needs include atmospheric scientists, computational fluid dynamicists, ML engineers focused on physical modeling, API and SaaS infrastructure engineers, healthcare and public-sector sales operators, and customer-success staff for enterprise deployments. Seed-stage capital implies pressure to prove customer acquisition alongside forecast accuracy.

## Who Could Help

Useful helpers include public health departments and hospital systems adopting air-quality alert integrations, athletic organizations and school districts with outdoor-activity scheduling needs, atmospheric-science advisors, Utah Venture Hub and Energy Accelerator connectors, and enterprise API customers in healthcare, insurance, and outdoor recreation.

## Utah Context

Trace AQ is a University of Utah spinout founded by researchers Heather Holmes (Chemical Engineering), Derek Mallia (Atmospheric Sciences), and Taylor (Kai) Wilmot, with Victor Gill as founding CEO handling commercialization. The company worked with the U's Technology Licensing Office and Venture Hub Energy Accelerator. Salt Lake Valley's chronic air-quality challenges — inversion, dust, ozone, and wildfire smoke — make Utah both a natural testbed and mission-aligned market.

## Evidence

- [Official Website: Trace AQ](trace-aq-official-website.md) · https://greatutah.work/pages/trace-aq-official-website.md · https://www.traceaq.com/
- [U of U TLO: Flow AQ launch feature](https://technologylicensing.utah.edu/news-events/startups/u-of-u-startup-launches-new-air-quality-forecasting-app) · https://technologylicensing.utah.edu/news-events/startups/u-of-u-startup-launches-new-air-quality-forecasting-app
- [TechBuzz: $1.25M seed round](https://www.techbuzznews.com/trace-aq-raises-1-25-million-seed/) · https://www.techbuzznews.com/trace-aq-raises-1-25-million-seed/

## See Also

- [Epitel](epitel.md) · https://greatutah.work/pages/epitel.md — another U of U spinout translating research into health-facing products
- [Culmination Bio](culmination-bio.md) · https://greatutah.work/pages/culmination-bio.md — Utah health data infrastructure with population-scale clinical signal

## Open Questions

- Forecast accuracy advantage versus large incumbents (The Weather Company, Tomorrow.io, AirNow) over multiple fire seasons is not independently benchmarked on this page.
- Commercial API licensing may cap impact relative to adoption by public health systems and government agencies — a harder but higher-leverage channel.
- $1.25M seed is early for scaling forecasting infrastructure and enterprise sales simultaneously.
- Moat durability (unique data, exclusive partnerships, regulatory adoption) is not yet established; accuracy gaps at large players may narrow over time.

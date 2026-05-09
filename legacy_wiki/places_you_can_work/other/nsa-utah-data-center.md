# NSA Utah Data Center

**Tier:** D — mission integrity questionable
**Domain:** Other — US federal intelligence mass data storage
**Also relevant to:** [Defense & security](../defense-and-security/)
**Type:** US federal facility (National Security Agency, under Department of Defense)
**Stage:** Operational since 2014
**Location:** Camp Williams, Bluffdale, UT
**Nickname:** "Bumblehive" (occasional internal reference)

## Why this is in the wiki

The NSA Utah Data Center is not something you can apply to work at in the usual wiki sense — it is a classified federal intelligence facility. It is included here for two honest reasons:

1. **Utah's data-infrastructure identity is partly shaped by its presence.** The facility is the largest-publicly-known data center in the state at ~1 million square feet, with reported capacity in the exabyte range. Its construction required local infrastructure (power, water, fiber) that has had spillover effects on Utah's commercial data center industry.
2. **Mission ethics are not optional.** The facility's role in mass collection of communications metadata — revealed in the 2013 Snowden disclosures — is a specific kind of world-changing work. Whether it is *net positive* world-changing is contested; reasonable people disagree. Either way, readers thinking about where to spend their working hours in defense or intelligence should know this facility exists and shapes the state's technical infrastructure landscape.

## What it is

- Officially: **Intelligence Community Comprehensive National Cybersecurity Initiative (IC CNCI) Data Center**
- Opened 2014 after ~$1.5B construction
- ~1.5M sq ft footprint; ~100,000 sq ft of raised-floor compute
- ~65 MW power consumption (with major water-cooling footprint sourced from the local aquifer)
- Role: mass storage and processing of SIGINT data collected by NSA's global collection apparatus
- Staffing: classified; reported to be a mix of NSA direct-hires and cleared contractors (Booz Allen, SAIC, Leidos, Raytheon)

## The hard problem

Running an exabyte-scale storage and analytics facility in a high-elevation desert environment, on classified networks, with real-time query requirements across decades-long retention windows. Cooling is a major infrastructure challenge (Utah's dry climate helps; the water usage doesn't). Cybersecurity at nation-state adversary level — the facility is an obvious target. Data engineering at this scale on classified infrastructure, where standard tooling (AWS, GCP) can't be used, is a specialized niche.

## Mechanism of impact

Classified intelligence collection and analysis at national-security scale. Impact on the outside world depends on which NSA programs and products the data feeds. Also: the facility has been a visible symbol in ongoing public debates about mass surveillance, civil liberties, and the Fourth Amendment.

## What kind of contributor thrives here

Cleared software and data engineers, distributed systems engineers, cybersecurity specialists, and intelligence analysts — with TS/SCI clearance and polygraph access. Most positions are routed through contractors; direct NSA civilian employment is also possible but lengthy. Career path is institutional.

## Ownership

US federal government — NSA / Department of Defense.

## Why this is not ⭐

Not a company; mission ethics are contested; individual contributor visibility is by design zero outside the program. Listed for completeness because any honest account of Utah's technical landscape includes this facility, and readers considering defense/intelligence work should know about it.

## Caveats

- Mission ethics are genuinely contested. Mass surveillance programs have critics across the political spectrum. Anyone considering work here should think carefully
- Clearance requirement is an absolute gate (TS/SCI with polygraph)
- Classified work means zero public portfolio; career mobility is into other cleared positions, not commercial tech
- Contractor vs. direct-hire tradeoffs are significant
- Limited public information on staffing, scale, or specific programs

## Learn more

- [Wikipedia: Utah Data Center](https://en.wikipedia.org/wiki/Utah_Data_Center)
- [Wired: The NSA Is Building the Country's Biggest Spy Center (2012)](https://www.wired.com/2012/03/ff-nsadatacenter/) — the canonical overview article
- [Forbes: NSA Utah Data Center Overview](https://www.forbes.com)

# Intan Technologies

**Type:** venture
**Status:** Draft
**Confidence:** Medium
**Focus:** neural recording, electrophysiology, integrated circuits, neuroscience infrastructure, brain-computer interfaces
**Stage:** Established private company; widely deployed research ICs
**Primary Location:** Los Angeles, CA
**Utah Location:** no verified Utah presence
**Region:** no verified Utah presence
**Website:** https://intantech.com/
**Careers:** https://intantech.com/careers.html
**Updated:** 2026-07-14
**Needs-reviewed:** 2026-07-14
**Hero:** https://picsum.photos/seed/intan-technologies-neural-ics-2026/1600/1100
**Pull:** *Off-the-shelf amplifier chips that let neuroscience labs record from hundreds of neurons without building custom front-end electronics.*
**Relates:** cites [Official Website: Intan Technologies](intan-technologies-official-website.md) · https://greatutah.work/pages/intan-technologies-official-website.md · https://intantech.com/

## Summary

Intan Technologies makes high-channel-count, low-noise integrated circuits for neural recording and stimulation. Its RHD and RHS chip families provide simultaneous amplification, filtering, and ADC conversion across 16 to 128 channels in a single package — work that historically required custom amplifier boards in every lab.

The company is small by headcount but widely deployed: its chips appear in Open Ephys rigs, commercial neural-interface systems, and academic custom setups around the world. Founder Reid Harrison is a University of Utah Neural Engineering alumnus, which is why Intan appears on Utah neural-engineering industry lists despite Los Angeles headquarters.

## Impact

Historically, front-end electronics bottlenecked systems neuroscience. A researcher who wanted 100+ simultaneous channels spent years on hardware rather than science. Intan's chips changed the supply chain: labs could buy proven amplifier ICs off the shelf at noise floors competitive with custom designs.

The impact is diffused but high-leverage. Papers, BCI systems, and neural-engineering startups that rely on multi-channel electrophysiology often depend on Intan-class front ends — including systems built by Utah companies such as [Blackrock Neurotech](blackrock-neurotech.md) and other integrators in the neural-interface ecosystem.

## What They Are Building

Intan develops analog and mixed-signal ICs for electrophysiology, plus supporting firmware, data-acquisition software (RHX), and complete headstage systems. Product lines include:

1. **RHD amplifier chips** — multi-channel neural recording front ends.
2. **RHS stim/amplifier chips** — combined recording and stimulation with artifact-suppression challenges.
3. **RHD and RHS systems** — controllers, headstages, and cables (now distributed primarily through White Mountain Systems per the company's 2026 announcement).
4. **Design resources** — datasheets, STM32 firmware frameworks, and application notes for chip integrators.

The core engineering problem is low-noise, low-power amplification of microvolt-scale neural signals across dozens to hundreds of channels on one die without crosstalk — plus safe switching between record and stimulate modes on shared electrodes.

## What They Need Now
Likely needs include analog and mixed-signal IC designers, biomedical electronics engineers, firmware engineers for embedded acquisition systems, and application engineers who can support integrators worldwide. Open positions are rare — the team is small, so individual leverage is high but hiring volume is limited when roles do open.

## Who Could Help

Useful helpers include semiconductor foundry and packaging partners, FDA-aware regulatory consultants for medical-device integrators, university technology-transfer offices in neuroscience-heavy regions, and distributors with reach into academic and medtech OEM customers.

## Utah Context

Intan is not headquartered in Utah, but Reid Harrison's University of Utah Neural Engineering training and the company's presence on the U of U industry list tie it to the Wasatch Front neuroengineering cluster. Utah readers evaluating neural-interface careers should understand Intan as upstream infrastructure — the chip layer beneath systems companies like [Blackrock Neurotech](blackrock-neurotech.md), [SCI Institute](sci-institute.md) research tools, and commercial recording platforms.

## Evidence

- [Official Website: Intan Technologies](intan-technologies-official-website.md) · https://greatutah.work/pages/intan-technologies-official-website.md · https://intantech.com/

## See Also

- [Blackrock Neurotech](blackrock-neurotech.md) · https://greatutah.work/pages/blackrock-neurotech.md — Utah systems company in the intracortical BCI stack
- [Utah Array BCI Platform](utah-array-bci-platform.md) · https://greatutah.work/pages/utah-array-bci-platform.md — foundational Utah research platform in the same ecosystem
- [SCI Institute](sci-institute.md) · https://greatutah.work/pages/sci-institute.md — Utah academic infrastructure for neural engineering and imaging

## Open Questions

- Exact current headcount, revenue, and ownership structure are not established on this page.
- How the 2026 White Mountain Systems distribution arrangement affects Intan's direct customer relationships and roadmap should be tracked.
- Competition at the high end from Neuropixels (IMEC) and other integrated platforms may shift which labs buy discrete Intan chips versus all-in-one probes.
- The placeholder hero should be swapped for a cleared product, chip, or lab image before magazine layout use.

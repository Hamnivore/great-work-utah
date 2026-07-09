# Ripple Neuro

**Type:** venture
**Status:** Draft
**Confidence:** Medium
**Focus:** neural recording, neural stimulation, BCI, neuroscience instrumentation, ASIC, electrophysiology
**Stage:** Private, operational since 2004; NIH HEAL-funded neuromodulation programs active
**Location:** Salt Lake City, UT
**Updated:** 2026-06-19
**Needs-reviewed:** 2026-06-19
**Hero:** https://picsum.photos/seed/ripple-neuro-2026/1600/1100
**Pull:** *The instruments that make invasive neuroscience possible — 512 channels of real-time neural recording, in a palm-sized wireless system, built over 20 years from the same University of Utah lineage as the Utah Array.*
**Relates:** cites [Official Website: Ripple Neuro](ripple-neuro-official-website.md)

## Summary

Ripple Neuro is a Salt Lake City-based neuroscience instrumentation company founded in 2004 as a spinout from the University of Utah. It builds the neural recording and stimulation hardware that research neuroscientists use to run invasive electrophysiology experiments: multi-hundred-channel amplifiers, real-time signal processors, and stimulation systems capable of simultaneous recording and stimulation without artifact swamping. The company's founding lineage connects to the neural engineering cluster at the University of Utah that also produced Blackrock Neurotech and the Utah Array — one of the most influential implantable electrode technologies in neuroscience.

Ripple's product families include the Grapevine neural signal processor (up to 512 channels), the Trek portable electrophysiology system (palm-sized, wireless, designed for naturalistic behavior experiments), and Summit neuromodulation research systems. The company also operates Ripple Neuromed, a clinically-oriented sister presence. Revenue comes from instrument sales to research labs and government-funded R&D contracts, including active programs under NIH's HEAL Initiative targeting chronic pain and neuromodulation.

## Impact

Almost every major result in invasive neuroscience over the past decade — BCI decoding, neural prosthetics, motor cortex population studies, closed-loop neuromodulation — required a multi-channel recording system. For a significant fraction of those labs, that system is a Ripple product. The counterfactual is concrete: without Ripple, labs would roll their own electronics (burning grad-student years on hardware rather than neuroscience) or accept lower channel counts from simpler commercial systems.

The NIH HEAL-funded neuromodulation work connects Ripple to the chronic pain problem — which affects 50M+ Americans and is a primary driver of the opioid crisis. If implantable closed-loop neuromodulation eventually works clinically, Ripple's instrumentation is part of the research lineage that gets it there. The Trek system's portable, wireless form factor extends this potential to naturalistic behavioral experiments that stationary rig setups cannot support.

## What They Are Building

Ripple builds research-grade neural recording and stimulation hardware, from analog front-ends through signal processing to software integration. The core engineering challenge is recording low-microvolt neural signals across hundreds of channels simultaneously while stimulating other channels without stimulation artifact contaminating the recordings — a fundamental analog electronics problem at scale that requires custom ASIC design.

The Trek system represents a form-factor bet: shrinking the full Grapevine capability into a palm-sized wireless device enables experiments in freely moving animals and, eventually, ambulatory human subjects. This unlocks experimental designs that stationary rig setups cannot support, expanding the scientific questions that can be asked.

## What They Need Now

Likely needs include analog and mixed-signal hardware engineers, ASIC designers, embedded firmware engineers, and biomedical engineers with genuine interest in neuroscience. The team is order-of-dozens rather than hundreds; individual leverage is high. People who want to design instruments rather than use them — and who can work across the full stack from transistor to experiment — are the profile.

## Who Could Help

Useful helpers include NIH program officers and neuromodulation researchers who can guide HEAL-aligned product directions, neural prosthetics labs that push the limits of channel count and real-time processing, regulatory specialists who understand the path from research-grade to clinical-grade neural devices, and ASIC foundry relationships that support custom analog front-end development.

## Utah Context

Ripple Neuro sits within the University of Utah's neural engineering cluster — one of the most consequential clusters of neurotechnology origin in the world. The Utah Array was invented here; Blackrock Neurotech (now part of a different entity) came from here; Ripple came from here. The University of Utah's Department of Biomedical Engineering and its neuroscience programs continue to produce students and postdocs who flow into this ecosystem. Salt Lake City's relatively low cost of living supports a small, deep-expertise team without the cost pressure that would push them toward commercial compromises.

## Evidence

- [Official Website: Ripple Neuro](ripple-neuro-official-website.md)

## See Also

- [Utah Arch Research Group](utah-arch.md) — Utah's hardware architecture research group working on the compute substrates that could eventually support next-generation neural signal processing at scale.
- [TELLUS](tellus.md) — another Utah scientific-infrastructure company building specialized sensing hardware with long R&D timelines and government-funding models.

## Open Questions

- What is Ripple's current employee count and revenue range? Public databases show no major VC rounds, but the instrument sales and government contract model could support a stable mid-sized team.
- How far is the Trek system from enabling ambulatory human BCI experiments, and what regulatory pathway would that require?
- What is the relationship between Ripple Neuro and Ripple Neuromed — separate entities, shared ownership, or a single entity with separate commercial presences?
- Which specific NIH HEAL programs is Ripple currently supporting, and what milestones define success?
- The placeholder hero should be replaced with a cleared product image of the Grapevine or Trek system when rights are confirmed.

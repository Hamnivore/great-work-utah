# Utah Arch Research Group

**Type:** venture
**Status:** Draft
**Confidence:** Medium
**Focus:** hardware architecture, ML accelerators, fully homomorphic encryption, privacy-preserving ML, 3D nanofabric, computer architecture
**Stage:** University research group; NSF and DARPA funded
**Primary Location:** Salt Lake City, UT
**Utah Location:** Salt Lake City, UT
**Region:** Salt Lake City
**Updated:** 2026-06-19
**Needs-reviewed:** 2026-06-19
**Hero:** https://picsum.photos/seed/utah-arch-2026/1600/1100
**Relates:** cites [Official Website: Utah Arch Research Group](utah-arch-official-website.md)

## Summary

The Utah Arch Research Group is a computer architecture research lab in the University of Utah School of Computing. The group focuses on redesigning the hardware stack underneath machine learning and privacy-preserving computation — specifically, building accelerators for ML inference and fully homomorphic encryption (FHE), and exploring emerging compute substrates including 3D nanofabric.

This is an academic research group, not a company. Contributions flow through publications at top venues (HPCA, ASPLOS, ISCA, IEEE S&P) and through PhD graduates who carry ideas into commercial silicon at companies including Apple, NVIDIA, Google, and Intel, as well as emerging FHE hardware startups.

## Impact

Two problems the group is working on have outsized long-term significance:

**Encrypted inference.** Running ML models on encrypted data — so the model produces an answer without ever seeing the underlying plaintext — is technically possible via FHE but historically carries a 10,000x or worse performance overhead. Closing that gap to single-digit slowdowns is a hardware problem, and solving it unlocks a category of privacy-preserving applications in health, finance, and government that currently cannot exist. Utah Arch appears to be one of the academic groups doing serious FHE accelerator work at top venues.

**Post-Moore compute substrates.** Silicon scaling has slowed; domain-specific accelerators and new compute fabrics (3D nanofabric, processing-in-memory, carbon-nanotube logic) represent the next major era. The group publishes on these at the same venues as the major industrial research labs.

If encrypted ML accelerators reach real production systems in the next decade, the academic work getting it there will include contributions from groups like this one. The mechanism is slower than a startup but broader in eventual footprint.

## What They Are Building

- **FHE hardware accelerators** — co-designed circuits, microarchitectures, memory hierarchies, and compilers tuned for the arithmetic patterns of lattice cryptography, which differ radically from neural network and GPU workloads
- **ML accelerator research** — hardware designs for efficient inference, particularly for workloads that don't map well to existing GPU-class hardware
- **3D nanofabric** — early-stage exploration of post-silicon compute substrates; speculative but publishing at serious venues

The core technical challenge for FHE is that lattice-based cryptographic operations have radically different memory access and arithmetic patterns than either neural networks or what GPU hardware was designed for. Orders-of-magnitude speedups require co-designing the full stack.

## What They Need Now

The group recruits PhD students and postdocs. Strong candidates would have background spanning circuits, microarchitecture, cryptography mathematics, and at least some ML — a combination that is genuinely rare. This is not the right environment for someone who wants to ship a product in two years; it is the right environment for someone who wants to be a co-author on a paper that changes a field.

Funded by NSF, DARPA, and industry collaborations. Research autonomy is standard academic — the work is open research and student training, not commercial execution.

## Who Could Help

The group's primary relationships are with the academic computer architecture and systems security communities. Industrial relationships through research collaborations and PhD alumni pipelines connect to Apple, NVIDIA, Google, Intel, and the emerging FHE hardware companies (Niobium, Optalysys, and others).

Federal research funding from NSF and DARPA is the primary resource dependency; the current volatility in federal research funding is a real risk for the group's programs.

## Utah Context

Utah Arch sits at the intersection of two of the University of Utah's strongest computing traditions — systems architecture and applied cryptography — and represents the kind of foundational research that feeds commercial outcomes indirectly over 5–15 year horizons. The School of Computing has a strong hardware tradition; this group is its frontier edge.

For students and postdocs interested in hardware architecture at the ML/security intersection, Utah Arch is among a small number of academic groups in the country doing this work at top venues.

## Evidence

- [Official Website: Utah Arch Research Group](utah-arch-official-website.md)

## See Also

- [Ripple Neuro](ripple-neuro.md) — another Utah scientific-infrastructure entity working at the hardware/science intersection

## Open Questions

- Current PI and group composition; public web pages for academic groups can lag actual membership.
- Specific papers and results at HPCA/ASPLOS/ISCA/IEEE S&P — worth reading directly to assess the current frontier of the work.
- Federal research funding stability: DARPA and NSF programs are the primary support; any changes in federal research priorities affect the group's trajectory.
- Spinout potential: if FHE-ML performance crosses a commercial threshold, who would own or commercialize results from this group?
- The 3D nanofabric line of work is genuinely speculative; timeline to any practical application is unclear.
- The placeholder hero should be replaced with a licensed lab or research photograph when rights are confirmed.

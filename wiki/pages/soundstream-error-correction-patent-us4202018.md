# U.S. Patent 4,202,018 — Stockham / Soundstream, Error Recognition and Correction

**Type:** source
**Status:** Useful
**Confidence:** High
**Source Type:** patent
**Publisher:** U.S. Patent and Trademark Office
**Retrieved:** 2026-08-11
**URL:** https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/4202018
**Updated:** 2026-08-11

## Summary

Thomas G. Stockham Jr.'s patent on the error detection and correction scheme inside the Soundstream digital recorder, assigned to Soundstream, Inc. It is the primary documentary record that Soundstream existed as a corporation building custom digital-audio hardware, and it describes the 16-bit linear signal chain and the tape-error problem the machine was built to survive.

## Useful Claims

- Patent number 4,202,018, titled "Apparatus and method for providing error recognition and correction of recorded digital information". Application serial no. 05/946,067, filed September 27, 1978; granted May 6, 1980. Inventor of record: Thomas G. Stockham, Jr. Original assignee of record: Soundstream, Inc.
- The recorded assignment history identifies Soundstream as a Utah company: the 1986 reassignment to Digital Recording is recorded from "SOUNDSTREAM, INC. A CORP. OF UTAH".
- The signal chain described is 16-bit linear PCM. The specification names the converters as "16 bit linear analog to digital converter (A/D)", and the audio path takes each 16-bit word, adds a parity bit and synchronization code bits, and writes "a 20 bit word output".
- The correction scheme is redundancy across tape tracks rather than a modern error-correcting code: two main tracks plus a backup track carrying the most significant half of each word, with per-word parity and sync checks deciding which copy to believe, and interpolation "between good data" when neither can be trusted.
- The patent states plainly why this was necessary — dropouts are expected, not exceptional: information loss in tape recording is "a statistical probability that increases with equipment age, magnetic tape wear, and like factors, and so must be planned for."
- International filings followed under PCT/US1979/000793, with counterparts filed in Japan, Canada, the United Kingdom, the Netherlands, and at the EPO.

## Reliability Notes

Primary tier. A granted U.S. patent is a dated public instrument the USPTO must preserve and retrieve by number forever, so no archive snapshot is owed. The URL is the issuing body's own PDF of the grant.

Scope, stated carefully. The patent proves that Soundstream, Inc. was a Utah corporation with Stockham as its named inventor, shipping custom 16-bit linear digital audio hardware in 1978, and it documents the error-handling design that made tape-based digital recording survivable. It does not carry the company's May 1975 founding date, its sampling rates, the eighteen recorders built, the label list, or the Telarc sessions; those remain with the scholarly and reference accounts the fact page cites. Nor can any patent settle the "first commercial digital recording company in the United States" claim — a priority superlative is a historiographic judgment, not a fact a document of this kind records, and the fact page names that limit in its Open Questions.

Two related Soundstream patents exist and are not covered here — 4,328,580 (Stockham and Bruce C. Rothaar) and 4,433,348 — each of which would be its own source page under P2.

## Related Pages

- [Soundstream and Commercial Digital Audio Recording](soundstream-digital-audio-recording.md)

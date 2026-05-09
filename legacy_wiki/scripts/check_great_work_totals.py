#!/usr/bin/env python3
"""Check the Great Work README tier totals against the indexed rows."""

from pathlib import Path
import re
import sys


ROOT = Path(__file__).resolve().parents[1]
README = ROOT / "great_work" / "README.md"
TIERS = ("S", "A", "B", "C", "D")


def main() -> int:
    text = README.read_text(encoding="utf-8")
    main_index, _, _ = text.partition("## Recent / Speculative Watchlist")

    counts = {tier: 0 for tier in TIERS}
    for match in re.finditer(r"^\| \*\*(S|A|B|C|D)\*\* \|", main_index, re.MULTILINE):
        counts[match.group(1)] += 1

    total = sum(counts.values())
    expected = (
        f"**Totals:** {total} entries - "
        f"{counts['S']} S . {counts['A']} A . {counts['B']} B . "
        f"{counts['C']} C . {counts['D']} D"
    )

    totals_line = next(
        (line.strip() for line in text.splitlines() if line.startswith("**Totals:**")),
        None,
    )
    if totals_line is None:
        print("No totals line found in great_work/README.md")
        print(f"Computed: {expected}")
        return 1

    normalized = totals_line.replace("·", ".").replace("—", "-")
    normalized = re.sub(r"\s+", " ", normalized)
    if normalized != expected:
        print("README totals are out of sync.")
        print(f"Found:    {totals_line}")
        print(f"Computed: {expected}")
        return 1

    print(f"README totals OK: {totals_line}")
    return 0


if __name__ == "__main__":
    sys.exit(main())

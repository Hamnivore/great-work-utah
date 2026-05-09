#!/usr/bin/env python3
"""Check speculative Great Work README links point to existing local pages."""

from pathlib import Path
import re
import sys


ROOT = Path(__file__).resolve().parents[1]
GREAT_WORK = ROOT / "great_work"
README = GREAT_WORK / "README.md"


def main() -> int:
    text = README.read_text(encoding="utf-8")
    _, marker, rest = text.partition("## Recent / Speculative Watchlist")
    if not marker:
        print("No speculative watchlist section found in great_work/README.md")
        return 1

    watchlist, _, _ = rest.partition("## The tier convention")
    failures = []

    for match in re.finditer(r"\[([^\]]+)\]\(([^)]+\.md)\)", watchlist):
        label, href = match.groups()
        if href.startswith(("http://", "https://", "#")):
            continue
        target = (GREAT_WORK / href).resolve()
        try:
            target.relative_to(GREAT_WORK.resolve())
        except ValueError:
            failures.append(f"{label}: link escapes great_work ({href})")
            continue
        if not target.exists():
            failures.append(f"{label}: missing {href}")

    if failures:
        print("Speculative watchlist has broken local links:")
        for failure in failures:
            print(f"- {failure}")
        return 1

    print("Speculative watchlist links OK")
    return 0


if __name__ == "__main__":
    sys.exit(main())

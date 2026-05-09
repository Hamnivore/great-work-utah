#!/usr/bin/env python3
"""Report Great Work entry coverage in editorial pass files."""

from collections import defaultdict
from pathlib import Path
import re
import sys


ROOT = Path(__file__).resolve().parents[1]
GREAT_WORK = ROOT / "great_work"
PASSES = GREAT_WORK / "agent_ops" / "editorial_passes"
NON_ENTRY_DIRS = {"agent_ops", "prompts", "editorial_passes"}


def entry_paths() -> set[str]:
    entries = set()
    for path in GREAT_WORK.glob("*/*.md"):
        if path.parent.name in NON_ENTRY_DIRS:
            continue
        entries.add(path.relative_to(ROOT).as_posix())
    return entries


def pass_refs() -> set[str]:
    if not PASSES.exists():
        return set()

    refs = set()
    pattern = re.compile(r"great_work/[A-Za-z0-9_-]+/[^)\s|`]+\.md")
    for path in PASSES.glob("*.md"):
        text = path.read_text(encoding="utf-8")
        refs.update(match.group(0) for match in pattern.finditer(text))
    return refs


def main() -> int:
    entries = entry_paths()
    refs = pass_refs()
    domain_names = {Path(entry).parent.name for entry in entries}

    entry_refs = {
        ref for ref in refs
        if len(Path(ref).parts) >= 3 and Path(ref).parent.name in domain_names
    }
    bad_refs = sorted(ref for ref in entry_refs if ref not in entries)
    covered = entries & entry_refs
    missing = sorted(entries - covered)

    print(f"Editorial coverage: {len(covered)} / {len(entries)} entry pages mentioned in pass files")

    if bad_refs:
        print("\nBroken editorial pass entry references:")
        for ref in bad_refs:
            print(f"- {ref}")
        return 1

    by_domain: dict[str, list[str]] = defaultdict(list)
    for entry in missing:
        by_domain[Path(entry).parent.name].append(entry)

    if missing:
        print("\nMissing by domain:")
        for domain in sorted(by_domain):
            print(f"- {domain}: {len(by_domain[domain])}")
    else:
        print("\nAll entry pages are mentioned in editorial pass files.")

    return 0


if __name__ == "__main__":
    sys.exit(main())

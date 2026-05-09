"""Embed AI-generation metadata into the PNG text chunks for our generated images.

Sets PNG tEXt chunks that survive when the file is downloaded or re-uploaded:
  - Software / CreatorTool: which agent and model produced the image
  - Source: explicit "AI-generated" tag
  - Description: human-readable description
  - Comment: prominent disclosure that the image is AI-generated and not a photograph
  - Author: producing agent
  - CreationTime: ISO date

Conforms to common downstream conventions (Wikimedia Commons AI-generated content
guidance, C2PA/IPTC "DigitalSourceType: TrainedAlgorithmicMedia" naming).
"""

from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image, PngImagePlugin

REPO = Path(__file__).resolve().parents[1]
IMAGE_INFO = [
    {
        "path": REPO / "public/img/heroes/intactis-bio.png",
        "description": (
            "Editorial illustration: a clear silicone microfluidic biochip "
            "cradling a small cluster of living neural tissue, wired to a "
            "silicon microelectrode array, with electronics out of focus in "
            "the background. Generated as a placeholder hero for the Intactis "
            "Bio venture page."
        ),
    },
    {
        "path": REPO / "public/img/categories/defense-and-security.png",
        "description": (
            "Editorial illustration: a small fixed-wing reconnaissance drone "
            "in silhouette, flying low over the Utah West Desert at golden "
            "hour. Generated as the category image for Defense and Security."
        ),
    },
    {
        "path": REPO / "public/img/categories/energy.png",
        "description": (
            "Editorial illustration: a geothermal-style drilling rig at "
            "twilight in a Utah high-desert basin, lit warmly from below "
            "with steam rising at the wellhead. Generated as the category "
            "image for Energy."
        ),
    },
]

CREATOR = "Cursor agent (Claude Opus 4.7) via the workspace image-generation tool"
COMMON = {
    "Software": CREATOR,
    "CreatorTool": CREATOR,
    "Source": "AI-generated",
    "DigitalSourceType": "TrainedAlgorithmicMedia",  # IPTC/C2PA convention
    "Author": "Cursor agent (Claude Opus 4.7)",
    "Copyright": (
        "Generated for the Great Work Utah wiki demo. Treat as unlicensed "
        "synthetic media; replace with a license-cleared photograph before "
        "production use."
    ),
    "CreationTime": "2026-05-09",
}
COMMENT = (
    "AI-GENERATED IMAGE — not a photograph. Produced by the Cursor agent "
    "(Claude Opus 4.7) image-generation tool on 2026-05-09 for the Great "
    "Work Utah wiki cover-stack demo. Replace with a license-cleared "
    "photograph before any production use."
)


def annotate(path: Path, description: str) -> None:
    if not path.exists():
        print(f"  SKIP (missing): {path}")
        return
    with Image.open(path) as img:
        img.load()
        info = PngImagePlugin.PngInfo()
        for key, value in COMMON.items():
            info.add_text(key, value)
        info.add_text("Description", description)
        info.add_text("Comment", COMMENT)
        img.save(path, pnginfo=info, format="PNG")
    print(f"  tagged: {path.relative_to(REPO)}")


def verify(path: Path) -> None:
    with Image.open(path) as img:
        info = img.info
    keys = ["Software", "Source", "DigitalSourceType", "Comment"]
    print(f"  {path.relative_to(REPO)}")
    for key in keys:
        value = info.get(key, "(missing)")
        if isinstance(value, str) and len(value) > 80:
            value = value[:77] + "..."
        print(f"    {key}: {value}")


def main() -> int:
    print("Embedding AI-generation metadata:")
    for entry in IMAGE_INFO:
        annotate(entry["path"], entry["description"])
    print()
    print("Verifying:")
    for entry in IMAGE_INFO:
        if entry["path"].exists():
            verify(entry["path"])
    return 0


if __name__ == "__main__":
    sys.exit(main())

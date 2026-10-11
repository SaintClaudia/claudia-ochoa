"""Rebuild lightweight display assets from the original artwork and font.

Run: python3 games/chaising-birdies/optimize_assets.py
Requires Pillow and fontTools with WOFF2 support.
"""
from pathlib import Path
from PIL import Image
from fontTools import subset

ROOT = Path(__file__).resolve().parent


def resized(source, destination, width, quality=85):
    with Image.open(ROOT / source) as image:
        height = round(image.height * width / image.width)
        image.resize((width, height), Image.Resampling.LANCZOS).save(
            ROOT / destination, "WEBP", quality=quality, method=6
        )


resized("chasing-birdies-logo-reverse.webp", "chasing-birdies-logo-small.webp", 320)
resized("fairway-title.webp", "fairway-title-mobile.webp", 1280, quality=82)
resized("fairway-title.webp", "fairway-title-desktop.webp", 1672, quality=82)

# Match the previous sheet offsets at the 82 x 108 portrait size.
# Crops retain the same heads and torsos, without downloading the full sheets.
for player, offsets, top in [
    ("purdy", {"uniform": 66, "golf": 239}, 9),
    ("mccaffrey", {"uniform": 73, "golf": 230}, 3),
    ("kittle", {"uniform": 61, "golf": 245}, 9),
]:
    with Image.open(ROOT / "players" / f"{player}.webp") as image:
        width = image.width / 4
        height = width * 108 / 82
        y = height * top / 100
        for attire, offset in offsets.items():
            x = width * offset / 100
            image.crop((round(x), round(y), round(x + width), round(y + height))).resize(
                (164, 216), Image.Resampling.LANCZOS
            ).save(ROOT / "players" / f"{player}-portrait-{attire}.webp", "WEBP", quality=88, method=6)

options = subset.Options()
options.flavor = "woff2"
font = subset.load_font(str(ROOT / "anton.ttf"), options)
subsetter = subset.Subsetter(options=options)
subsetter.populate(unicodes=[*range(0x100), *range(0x2000, 0x2070), *range(0x2190, 0x2200), 0x2713])
subsetter.subset(font)
subset.save_font(font, str(ROOT / "anton-latin.woff2"), options)
print("Rebuilt logo, responsive heroes, six portraits, and Anton WOFF2.")

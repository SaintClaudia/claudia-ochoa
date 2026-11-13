#!/usr/bin/env python3
"""
Stamps shared HTML partials into every page that has their markers.

Usage:
    python3 build.py

Run this whenever you change a shared partial, then commit and push.

Markers used in HTML files:
    <!-- FOOTER:START --> ... <!-- FOOTER:END -->
    <!-- PORTFOLIO-NAV:START --> ... <!-- PORTFOLIO-NAV:END -->
    <!-- CONTACT-OVERLAY:START --> ... <!-- CONTACT-OVERLAY:END -->
    <!-- LOVESAC-NAV:START --> ... <!-- LOVESAC-NAV:END -->
    <!-- LOVESAC-FOOTER:START --> ... <!-- LOVESAC-FOOTER:END -->
    <!-- LOVESAC-STORE-DROP:START --> ... <!-- LOVESAC-STORE-DROP:END -->
    <!-- LOVESAC-CORE-SCRIPTS:START --> ... <!-- LOVESAC-CORE-SCRIPTS:END -->
    <!-- LOVESAC-PAGE-SCRIPTS:START --> ... <!-- LOVESAC-PAGE-SCRIPTS:END -->
    <!-- ANALYTICS:START --> ... <!-- ANALYTICS:END -->
    <!-- HEAD-BASICS:START --> ... <!-- HEAD-BASICS:END -->
    <!-- HOME-FONTS:START --> ... <!-- HOME-FONTS:END -->
    <!-- HOME-SHARED-CSS:START --> ... <!-- HOME-SHARED-CSS:END -->
"""

import argparse
import hashlib
import re
import glob
import os
import sys

parser = argparse.ArgumentParser(description='Stamp shared HTML partials into rendered pages.')
parser.add_argument(
    '--check',
    action='store_true',
    help='verify that generated regions are current without writing files',
)
args = parser.parse_args()

BASE = os.path.dirname(os.path.abspath(__file__))

partials = [
    ('_birdies-screens.html', '<!-- BIRDIES-SCREENS:START -->', '<!-- BIRDIES-SCREENS:END -->'),
    ('_analytics.html',         '<!-- ANALYTICS:START -->',         '<!-- ANALYTICS:END -->'),
    ('_head-basics.html',       '<!-- HEAD-BASICS:START -->',       '<!-- HEAD-BASICS:END -->'),
    ('_portfolio-footer-styles.html', '<!-- PORTFOLIO-FOOTER-STYLES:START -->', '<!-- PORTFOLIO-FOOTER-STYLES:END -->'),
    ('_portfolio-fonts.html',   '<!-- PORTFOLIO-FONTS:START -->',   '<!-- PORTFOLIO-FONTS:END -->'),
    ('_footer.html',            '<!-- FOOTER:START -->',            '<!-- FOOTER:END -->'),
    ('_portfolio-nav.html',     '<!-- PORTFOLIO-NAV:START -->',     '<!-- PORTFOLIO-NAV:END -->'),
    ('_portfolio-nav-assets.html', '<!-- PORTFOLIO-NAV-ASSETS:START -->', '<!-- PORTFOLIO-NAV-ASSETS:END -->'),
    ('_contact-overlay.html',   '<!-- CONTACT-OVERLAY:START -->',   '<!-- CONTACT-OVERLAY:END -->'),
    ('_lovesac-nav.html',       '<!-- LOVESAC-NAV:START -->',       '<!-- LOVESAC-NAV:END -->'),
    ('_lovesac-footer.html',    '<!-- LOVESAC-FOOTER:START -->',    '<!-- LOVESAC-FOOTER:END -->'),
    ('_lovesac-store-drop.html', '<!-- LOVESAC-STORE-DROP:START -->', '<!-- LOVESAC-STORE-DROP:END -->'),
    ('_lovesac-core-scripts.html', '<!-- LOVESAC-CORE-SCRIPTS:START -->', '<!-- LOVESAC-CORE-SCRIPTS:END -->'),
    ('_lovesac-page-scripts.html', '<!-- LOVESAC-PAGE-SCRIPTS:START -->', '<!-- LOVESAC-PAGE-SCRIPTS:END -->'),
]

files = (
    glob.glob(f'{BASE}/*.html') +
    glob.glob(f'{BASE}/work/*.html') +
    glob.glob(f'{BASE}/blog/*.html')
)
files = [
    f for f in files
    if not os.path.basename(f).startswith('_') or os.path.basename(f) == '_template.html'
]

total_updated = 0
total_stale = 0


def version_stylesheets(content):
    """Use content hashes so every page requests the same current stylesheet."""
    def replace(match):
        asset = match.group(1)
        path = os.path.join(BASE, asset.lstrip('/'))
        if not os.path.isfile(path):
            raise FileNotFoundError(f'Referenced stylesheet not found: {asset}')
        with open(path, 'rb') as source:
            version = hashlib.sha256(source.read()).hexdigest()[:12]
        return f'href="{asset}?v={version}"'
    return re.sub(r'href="(/css/[^"?]+\.css)(?:\?v=[^"&]*)?"', replace, content)

# Inline the homepage styles in their existing cascade order. Shared source files
# remain authoritative; other pages continue to use cacheable stylesheets.
embedded_assets = [
    (("css/portfolio-foundation.css", "css/portfolio-story.css", "css/ask-read-pills.css", "css/ask-read-composer.css",
      "css/portfolio-footer.css", "css/portfolio-nav.css", "css/birdies-screens.css",
      "css/liquid-intro.css"),
     "<!-- HOME-STYLES:START -->", "<!-- HOME-STYLES:END -->", "<style>\n", "\n</style>"),
]



def marker_region(content, start, end, path):
    """Return a marker region, failing on malformed or ambiguous markup."""
    start_count = content.count(start)
    end_count = content.count(end)
    relative_path = os.path.relpath(path, BASE)
    if start_count != end_count:
        raise ValueError(
            f'{relative_path}: unmatched markers for {start} '
            f'({start_count} start, {end_count} end)'
        )
    if start_count > 1:
        raise ValueError(f'{relative_path}: duplicate marker region for {start}')
    if start_count == 0:
        return None
    start_index = content.index(start)
    end_index = content.index(end)
    if end_index < start_index:
        raise ValueError(f'{relative_path}: end marker appears before start marker for {start}')
    return start_index, end_index + len(end)

for partial_file, START, END in partials:
    partial_path = os.path.join(BASE, partial_file)
    if not os.path.exists(partial_path):
        raise FileNotFoundError(f'Required partial not found: {partial_file}')

    content_partial = version_stylesheets(open(partial_path).read().strip())
    print(f'\n--- {partial_file} ---')
    updated = 0
    used = 0

    for path in sorted(files):
        content = open(path).read()
        region = marker_region(content, START, END, path)
        if region is None:
            continue
        used += 1
        s, e = region
        new_content = content[:s] + START + '\n' + content_partial + '\n' + END + content[e:]
        if new_content != content:
            status = 'stale' if args.check else 'updated'
            print(f'  {status} {os.path.relpath(path, BASE)}')
            if not args.check:
                open(path, 'w').write(new_content)
            updated += 1
        else:
            print(f'  unchanged {os.path.relpath(path, BASE)}')

    if used == 0:
        raise ValueError(f'{partial_file}: no pages contain its marker region')
    if args.check:
        total_stale += updated
    else:
        total_updated += updated

for asset_file, START, END, prefix, suffix in embedded_assets:
    asset_files = asset_file if isinstance(asset_file, tuple) else (asset_file,)
    asset_contents = []
    for source_file in asset_files:
        asset_path = os.path.join(BASE, source_file)
        if not os.path.exists(asset_path):
            raise FileNotFoundError(f'Required embedded asset not found: {source_file}')
        asset_contents.append(open(asset_path).read().strip())
    embedded_content = prefix + "\n".join(asset_contents) + suffix
    print(f'\n--- embedded {asset_file} ---')
    updated = 0
    used = 0

    for path in sorted(files):
        content = open(path).read()
        region = marker_region(content, START, END, path)
        if region is None:
            continue
        used += 1
        s, e = region
        new_content = content[:s] + START + '\n' + embedded_content + '\n' + END + content[e:]
        if new_content != content:
            status = 'stale' if args.check else 'updated'
            print(f'  {status} {os.path.relpath(path, BASE)}')
            if not args.check:
                open(path, 'w').write(new_content)
            updated += 1
        else:
            print(f'  unchanged {os.path.relpath(path, BASE)}')

    if used == 0:
        raise ValueError(f'{asset_file}: no pages contain its embedded marker region')
    if args.check:
        total_stale += updated
    else:
        total_updated += updated

# Also version page-specific CSS outside generated partials. Partials are
# normalized before comparison above, so --check stays read-only/idempotent.
for path in sorted(files + glob.glob(f'{BASE}/previews/*.html')):
    content = open(path).read()
    updated_content = version_stylesheets(content)
    if updated_content != content:
        if args.check:
            total_stale += 1
            print(f'  stale stylesheet versions: {os.path.relpath(path, BASE)}')
        else:
            with open(path, 'w') as output:
                output.write(updated_content)
            total_updated += 1

if args.check:
    if total_stale:
        print(f'\n{total_stale} generated region(s) are stale. Run python3 build.py.')
        sys.exit(1)
    print('\nAll generated regions are current.')
else:
    print(f'\n{total_updated} file(s) updated total.')

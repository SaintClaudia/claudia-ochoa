#!/usr/bin/env python3
"""
Stamps shared HTML partials into every page that has their markers.

Usage:
    python3 build.py

Run this whenever you change a shared partial, then commit and push.

Markers used in HTML files:
    <!-- FOOTER:START --> ... <!-- FOOTER:END -->
    <!-- PORTFOLIO-NAV:START --> ... <!-- PORTFOLIO-NAV:END -->
    <!-- PORTFOLIO-NAV-MENU:START --> ... <!-- PORTFOLIO-NAV-MENU:END -->
    <!-- CONTACT-OVERLAY:START --> ... <!-- CONTACT-OVERLAY:END -->
    <!-- CASE-STUDY-FOOTER:START --> ... <!-- CASE-STUDY-FOOTER:END -->
    <!-- LOVESAC-NAV:START --> ... <!-- LOVESAC-NAV:END -->
    <!-- LOVESAC-FOOTER:START --> ... <!-- LOVESAC-FOOTER:END -->
    <!-- LOVESAC-STORE-DROP:START --> ... <!-- LOVESAC-STORE-DROP:END -->
    <!-- LOVESAC-CORE-SCRIPTS:START --> ... <!-- LOVESAC-CORE-SCRIPTS:END -->
    <!-- LOVESAC-PAGE-SCRIPTS:START --> ... <!-- LOVESAC-PAGE-SCRIPTS:END -->
    <!-- ANALYTICS:START --> ... <!-- ANALYTICS:END -->
    <!-- HEAD-BASICS:START --> ... <!-- HEAD-BASICS:END -->
"""

import argparse
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
    ('_analytics.html',         '<!-- ANALYTICS:START -->',         '<!-- ANALYTICS:END -->'),
    ('_head-basics.html',       '<!-- HEAD-BASICS:START -->',       '<!-- HEAD-BASICS:END -->'),
    ('_portfolio-fonts.html',   '<!-- PORTFOLIO-FONTS:START -->',   '<!-- PORTFOLIO-FONTS:END -->'),
    ('_footer.html',            '<!-- FOOTER:START -->',            '<!-- FOOTER:END -->'),
    ('_portfolio-nav.html',     '<!-- PORTFOLIO-NAV:START -->',     '<!-- PORTFOLIO-NAV:END -->'),
    ('_portfolio-nav-menu.html', '<!-- PORTFOLIO-NAV-MENU:START -->', '<!-- PORTFOLIO-NAV-MENU:END -->'),
    ('_contact-overlay.html',   '<!-- CONTACT-OVERLAY:START -->',   '<!-- CONTACT-OVERLAY:END -->'),
    ('_case-study-footer.html', '<!-- CASE-STUDY-FOOTER:START -->', '<!-- CASE-STUDY-FOOTER:END -->'),
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
files = [f for f in files if not os.path.basename(f).startswith('_')]

total_updated = 0
total_stale = 0



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

    content_partial = open(partial_path).read().strip()
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

if args.check:
    if total_stale:
        print(f'\n{total_stale} generated region(s) are stale. Run python3 build.py.')
        sys.exit(1)
    print('\nAll generated regions are current.')
else:
    print(f'\n{total_updated} file(s) updated total.')

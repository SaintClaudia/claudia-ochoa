#!/usr/bin/env python3
"""
Stamps shared HTML partials into every page that has their markers.

Usage:
    python3 build.py

Run this whenever you change a shared partial, then commit and push.

Markers used in HTML files:
    <!-- FOOTER:START --> ... <!-- FOOTER:END -->
    <!-- CASE-STUDY-FOOTER:START --> ... <!-- CASE-STUDY-FOOTER:END -->
    <!-- LOVESAC-NAV:START --> ... <!-- LOVESAC-NAV:END -->
    <!-- LOVESAC-FOOTER:START --> ... <!-- LOVESAC-FOOTER:END -->
"""

import os, glob

BASE = os.path.dirname(os.path.abspath(__file__))

partials = [
    ('_footer.html',            '<!-- FOOTER:START -->',            '<!-- FOOTER:END -->'),
    ('_case-study-footer.html', '<!-- CASE-STUDY-FOOTER:START -->', '<!-- CASE-STUDY-FOOTER:END -->'),
    ('_lovesac-nav.html',       '<!-- LOVESAC-NAV:START -->',       '<!-- LOVESAC-NAV:END -->'),
    ('_lovesac-footer.html',    '<!-- LOVESAC-FOOTER:START -->',    '<!-- LOVESAC-FOOTER:END -->'),
]

files = (
    glob.glob(f'{BASE}/*.html') +
    glob.glob(f'{BASE}/work/*.html') +
    glob.glob(f'{BASE}/blog/*.html')
)
files = [f for f in files if not os.path.basename(f).startswith('_')]

total_updated = 0

for partial_file, START, END in partials:
    partial_path = os.path.join(BASE, partial_file)
    if not os.path.exists(partial_path):
        print(f'  WARN: {partial_file} not found, skipping')
        continue

    content_partial = open(partial_path).read().strip()
    print(f'\n--- {partial_file} ---')
    updated = 0

    for path in sorted(files):
        content = open(path).read()
        if START not in content:
            continue
        s = content.index(START)
        e = content.index(END) + len(END)
        new_content = content[:s] + START + '\n' + content_partial + '\n' + END + content[e:]
        if new_content != content:
            open(path, 'w').write(new_content)
            print(f'  updated {os.path.relpath(path, BASE)}')
            updated += 1
        else:
            print(f'  unchanged {os.path.relpath(path, BASE)}')

    total_updated += updated

print(f'\n{total_updated} file(s) updated total.')

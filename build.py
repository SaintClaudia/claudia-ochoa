#!/usr/bin/env python3
"""
Stamps _nav.html into every HTML page between <!-- NAV:START --> and <!-- NAV:END -->.

Usage:
    python3 build.py

Run this whenever you change _nav.html, then commit and push.
"""

import os, glob

BASE = os.path.dirname(os.path.abspath(__file__))
NAV_FILE = os.path.join(BASE, '_nav.html')
START = '<!-- NAV:START -->'
END   = '<!-- NAV:END -->'

nav = open(NAV_FILE).read().strip()

files = (
    glob.glob(f'{BASE}/*.html') +
    glob.glob(f'{BASE}/work/*.html') +
    glob.glob(f'{BASE}/blog/*.html')
)
files = [f for f in files if '_nav.html' not in f]

updated = 0
for path in sorted(files):
    content = open(path).read()
    if START not in content:
        continue
    s = content.index(START)
    e = content.index(END) + len(END)
    new_content = content[:s] + START + '\n' + nav + '\n' + END + content[e:]
    if new_content != content:
        open(path, 'w').write(new_content)
        print(f'  updated {os.path.relpath(path, BASE)}')
        updated += 1
    else:
        print(f'  unchanged {os.path.relpath(path, BASE)}')

print(f'\n{updated} file(s) updated.')

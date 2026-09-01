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
    <!-- CASE-STUDY-TOPBAR:START --> ... <!-- CASE-STUDY-TOPBAR:END -->
    <!-- CASE-STUDY-FOOTER:START --> ... <!-- CASE-STUDY-FOOTER:END -->
    <!-- LOVESAC-NAV:START --> ... <!-- LOVESAC-NAV:END -->
    <!-- LOVESAC-FOOTER:START --> ... <!-- LOVESAC-FOOTER:END -->
"""

import os, glob

BASE = os.path.dirname(os.path.abspath(__file__))

partials = [
    ('_footer.html',            '<!-- FOOTER:START -->',            '<!-- FOOTER:END -->'),
    ('_portfolio-nav.html',     '<!-- PORTFOLIO-NAV:START -->',     '<!-- PORTFOLIO-NAV:END -->'),
    ('_contact-overlay.html',   '<!-- CONTACT-OVERLAY:START -->',   '<!-- CONTACT-OVERLAY:END -->'),
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

case_studies = [
    ('lovesac-case-study.html',   '01', 'Redesign',         'lovesac-hero.webp',             'Lovesac: from a viral critique to a full redesign'),
    ('lovesac-case-study-2.html', '02', 'Deep Dive',        'lovesac-life-moving.webp',      'A closer look at the moments that matter'),
    ('lovesac-case-study-3.html', '03', 'Research',         'lovesac-life-kids.webp',        'What the research actually says'),
    ('lovesac-case-study-4.html', '04', 'Content Strategy', 'lovesac-life-apartment.webp',   'Say it like you mean it'),
    ('lovesac-case-study-5.html', '05', 'Development',      'lovesac-life-stealthtech.webp', 'Past the score'),
    ('lovesac-case-study-6.html', '06', 'Synopsis',         'lovesac-life-house.webp',       'The Business Case'),
]


def render_case_study_topbar(current_file):
    """Render the shared series topbar with the current page marked accessibly."""
    items = []
    current = next(item for item in case_studies if item[0] == current_file)
    for filename, number, label, image, title in case_studies:
        tip = (
            f'<span class="tip-card" aria-hidden="true"><span class="tip-media">'
            f'<img class="tip-photo" data-src="/images/{image}" alt="" decoding="async">'
            f'<img class="tip-logo" data-src="/images/lovesac-wordmark-cream.png" alt="" decoding="async">'
            f'</span><span class="tip-body"><span class="tip-kicker">{label}</span>'
            f'<span class="tip-title">{title}</span></span></span>'
        )
        aria = f'Part {int(number)} of 6: {label}'
        if filename == current_file:
            item = f'<span class="current" aria-current="page" aria-label="{aria}">{number}{tip}</span>'
        else:
            item = f'<a href="{filename}" aria-label="{aria}">{number}{tip}</a>'
        items.append(f'      {item}')

    template = open(os.path.join(BASE, '_case-study-topbar.html')).read().strip()
    return template.replace('{{CASE_STUDY_SERIES_NAV}}', '\n'.join(items)).replace(
        '{{CASE_STUDY_TAG}}', f'Case Study {current[1]} · {current[2]}'
    )

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

print('\n--- _case-study-topbar.html ---')
topbar_start = '<!-- CASE-STUDY-TOPBAR:START -->'
topbar_end = '<!-- CASE-STUDY-TOPBAR:END -->'
topbar_updated = 0
for filename, *_ in case_studies:
    path = os.path.join(BASE, 'work', filename)
    content = open(path).read()
    if topbar_start not in content:
        continue
    s = content.index(topbar_start)
    e = content.index(topbar_end) + len(topbar_end)
    rendered = render_case_study_topbar(filename)
    new_content = content[:s] + topbar_start + '\n' + rendered + '\n' + topbar_end + content[e:]
    if new_content != content:
        open(path, 'w').write(new_content)
        print(f'  updated {os.path.relpath(path, BASE)}')
        topbar_updated += 1
    else:
        print(f'  unchanged {os.path.relpath(path, BASE)}')

total_updated += topbar_updated

print(f'\n{total_updated} file(s) updated total.')

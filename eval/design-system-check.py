#!/usr/bin/env python3
"""Dependency-free guardrails for the active portfolio's shared design and assets."""
from html.parser import HTMLParser
from pathlib import Path
import re
import sys
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
PAGES = ('index.html', 'about.html', 'contact.html', '404.html',
         'work/nebulae.html', 'work/the-otherside.html')
errors = []
stylesheets = set()
image_count = 0


def asset(url, page):
    parts = urlsplit(url)
    if parts.scheme or parts.netloc or not parts.path:
        return
    path = (ROOT / unquote(parts.path).lstrip('/') if parts.path.startswith('/')
            else page.parent / unquote(parts.path)).resolve()
    if not path.is_file():
        errors.append(f'{page.relative_to(ROOT)}: missing asset {url}')
    return path


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__(convert_charrefs=True)
        self.path = path
        self.foundation = 0

    def handle_starttag(self, tag, attributes):
        global image_count
        attrs = dict(attributes)
        if tag == 'link' and attrs.get('rel') == 'stylesheet':
            path = asset(attrs.get('href', ''), self.path)
            if path:
                stylesheets.add(path)
                self.foundation += path.name == 'portfolio-foundation.css'
        if tag in ('img', 'source', 'video', 'script'):
            asset(attrs.get('src', ''), self.path)
        if tag == 'video':
            asset(attrs.get('poster', ''), self.path)
        if tag in ('img', 'source'):
            for candidate in attrs.get('srcset', '').split(','):
                if candidate.strip():
                    asset(candidate.strip().split()[0], self.path)
        if tag == 'img':
            image_count += 1
            if 'alt' not in attrs:
                errors.append(f'{self.path.name}: image lacks alt: {attrs.get("src")}')
            if not all(attrs.get(key, '').isdigit() and int(attrs[key]) > 0
                       for key in ('width', 'height')):
                errors.append(f'{self.path.name}: image lacks intrinsic dimensions: {attrs.get("src")}')
            if attrs.get('loading') == 'lazy' and attrs.get('fetchpriority') == 'high':
                errors.append(f'{self.path.name}: image is both lazy and high priority')


for name in PAGES:
    path = ROOT / name
    text = path.read_text()
    page = Page(path)
    page.feed(text)
    if name == 'index.html':
        if '/* Portfolio design primitives.' not in text:
            errors.append('index.html: missing embedded design foundation')
        # These sources are intentionally inlined by build.py.
        stylesheets.update(ROOT / 'css' / f'{s}.css' for s in (
            'portfolio-foundation', 'portfolio-story', 'ask-read-pills',
            'ask-read-composer', 'portfolio-footer', 'portfolio-nav',
            'birdies-screens', 'liquid-intro'))
    elif page.foundation != 1:
        errors.append(f'{name}: expected one shared foundation stylesheet')

for path in sorted(stylesheets):
    if not path.is_file():
        continue
    text = path.read_text()
    for url in re.findall(r'url\([\'\"]?([^\)\'\"]+)', text):
        asset(url, path)
    for name, value in re.findall(r'(--[\w-]+)\s*:\s*([^;}]+)', text):
        if re.search(r'var\(\s*' + re.escape(name) + r'\s*[,)]', value):
            errors.append(f'{path.name}: self-referencing token {name}')
    if path.name != 'portfolio-foundation.css':
        if '@font-face' in text:
            errors.append(f'{path.name}: declare active portfolio fonts in the foundation')
        if re.search(r'font-family\s*:\s*(Inter|AskReadOutfit)\b', text):
            errors.append(f'{path.name}: use a shared font-family token')

if errors:
    print('\n'.join(errors), file=sys.stderr)
    sys.exit(1)
print(f'Design system checks passed: {len(PAGES)} pages, '
      f'{len(stylesheets)} stylesheets, {image_count} images.')

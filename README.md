# claudiaochoa.co

Personal portfolio of Claudia Ochoa — Product Design Leader blending business strategy with human-centered design.

## Live site

[claudiaochoa.co](https://claudiaochoa.co)

## Stack

Plain HTML, CSS, and vanilla JS. No frameworks, no build step, no dependencies. Fast and lightweight.

## Structure

```
/
├── index.html                        # Homepage — featured work grid
├── 404.html                          # Custom error page
├── _nav.html                         # Shared nav partial (single source of truth)
├── _footer.html                      # Shared footer partial (single source of truth)
├── build.py                          # Stamps _nav.html and _footer.html into all pages
├── favicon.svg                       # Heart favicon (SVG)
├── favicon-192.png                   # Heart favicon (PNG, for Google Search)
├── favicon-32.png                    # Heart favicon (PNG, browser tab fallback)
├── sitemap.xml                       # All pages for search engine discovery
├── robots.txt                        # Crawl directives
├── CNAME                             # Custom domain for GitHub Pages
├── css/
│   ├── style.css                     # Site chrome: nav, footer, contact form, password gate (index.html, 404.html)
│   └── case-study.css                # Shared design system: colors, type, topbar, hero, buttons, footer
│                                      # typography — used by index.html + all 6 case studies. Not used by the
│                                      # Lovesac redesign prototype pages (a deliberately separate system).
├── js/
│   └── main.js                       # Scroll reveal, nav, contact form
├── images/
├── work/
│   ├── lovesac-case-study.html       # Lovesac — Redesign (featured concept case study)
│   ├── lovesac-case-study-2.html     # Lovesac — deep dive: mobile nav & Room Fit (linked from case study 1)
│   ├── lovesac-case-study-3.html     # Lovesac — research: sentiment, competitors, StealthTech (linked from case study 2)
│   ├── lovesac-case-study-4.html     # Lovesac — voice & content strategy (linked from case study 3)
│   ├── lovesac-case-study-5.html     # Lovesac — Development: Heuristic Evaluation — security headers, console health, accessibility & agentic browsing beyond the automated score (linked from case study 4)
│   ├── lovesac-case-study-6.html     # Lovesac — one-page synopsis of case studies 1-5 (linked from case study 5)
│   ├── lovesac-redesign.html         # Lovesac — working interactive prototype (linked from the case study)
│   ├── lovesac-sactionals.html       # Lovesac prototype — product/cart page
│   ├── lovesac-what-to-expect.html   # Lovesac prototype — what to expect page
│   └── lovesac-support.html          # Lovesac prototype — customer support page
```

Everything on the live site is linked from somewhere — no hidden or orphaned pages.

## Deploying changes

```bash
git add <files>
git commit -m "describe what changed"
git push
```

GitHub Pages deploys automatically. Changes are live within 1–2 minutes.

## Updating the nav or footer

The footer lives in a single file, `_footer.html`, stamped into every page (including
`index.html`) by `build.py`.

`index.html`'s nav is maintained on its own, directly in `index.html` — not stamped
from `_nav.html`. It's permanently pared down to a wordmark and a theme toggle (no
Home/Contact icons, no mobile menu), which is deliberately different from `_nav.html`'s
full nav used by every other page, so it isn't part of the shared-partial sync.

To change the footer:
1. Edit `_footer.html`
2. Run `python3 build.py` — stamps the update into every page
3. Commit and push all changed files

To change `_nav.html` (used by every page except `index.html`):
1. Edit `_nav.html`
2. Run `python3 build.py` — stamps the update into every page except `index.html`
3. Commit and push all changed files

## Adding a case study

1. Copy an existing file from `work/` and rename it
2. Update the title, meta description, Open Graph tags, and canonical URL in `<head>`
3. Update content and cover image reference
4. Add the cover image to `images/`
5. Add a card to `index.html`
6. Add the URL to `sitemap.xml`
7. Push

## Editing shared case-study styles

Colors, typography, topbar, hero, section-head, context-strip, buttons, and footer
typography live once in `css/case-study.css` and are linked by `index.html` and all
6 case studies — not copy-pasted per page. Edit `css/case-study.css` for anything
that should change everywhere; edit a page's own `<style>` block only for content
specific to that page (narrative sections, charts, demos). This file is unrelated
to the Lovesac redesign prototype pages (`lovesac-redesign.html`, `lovesac-sactionals.html`,
`lovesac-what-to-expect.html`, `lovesac-support.html`), which mock the real Lovesac
site's own look and are a deliberately separate system.

## SEO

Every page has:
- Unique `<meta name="description">` tag
- Open Graph tags (`og:title`, `og:description`, `og:url`, `og:type`, `og:image`)
- Twitter Card tags for link preview on X/Twitter and iMessage
- `<link rel="canonical">` to prevent duplicate content issues
- PNG favicons at 192×192 and 32×32 for Google Search and browser tabs

The homepage has JSON-LD `Person` schema. `lovesac-case-study.html` additionally has JSON-LD `CreativeWork` schema (with a nested `author` referencing the Person) — the featured piece, prioritized in `sitemap.xml` at 0.9 and kept with a current `lastmod` whenever it's meaningfully updated.

`sitemap.xml` lists all pages and is referenced in `robots.txt`. The sitemap is submitted to Google Search Console at `https://claudiaochoa.co/sitemap.xml`. Bump a page's `lastmod` (and `priority`, if it's a piece you want surfaced) whenever its content changes materially — stale dates and generic priorities give search engines less reason to recrawl or rank it.

## Accessibility

Targets **WCAG 2.1 AA**. Implemented across all pages:

- **Skip link** — visually hidden "Skip to main content" link is the first focusable element on every page; appears on keyboard focus
- **Focus indicators** — `:focus-visible` styles on all interactive elements (nav icons, buttons, links, form inputs)
- **Reduced motion** — `@media (prefers-reduced-motion: reduce)` disables all transitions and animations for users with that OS setting enabled
- **Heading hierarchy** — all pages follow a clean h1 → h2 structure; no skipped levels
- **Image alt text** — all images have descriptive alt text
- **ARIA labels** — nav icon buttons and interactive controls have `aria-label` attributes
- **Semantic landmarks** — `<main id="main-content">` on every page

When adding new pages: use `<h2>` for section headings under the page `<h1>`, include `alt` on all images, and add `aria-label` to icon-only buttons.

## Performance

- Case study thumbnails are compressed JPEG or WebP (photographic content) or PNG (flat UI screenshots) — never an uncompressed PNG of a photo
- Fonts are preconnected via `<link rel="preconnect">`
- No external JS dependencies

## Infrastructure

- Hosted on **GitHub Pages**
- Custom domain configured via GoDaddy DNS → GitHub Pages A records
- TLS enforced via GitHub Pages
- Analytics via **Google Analytics 4** (`G-3G6X2P2669`)
- Domain verified with Google Search Console

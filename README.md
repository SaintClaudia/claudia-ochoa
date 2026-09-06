# claudiaochoa.co

Personal portfolio of Claudia Ochoa — AI Experience and Product Design Leader blending emerging technology, business strategy, and human-centered design.

## Live site

[claudiaochoa.co](https://claudiaochoa.co)

## Stack

Plain HTML, CSS, and vanilla JS. No frameworks or package dependencies. A small
Python script stamps shared partials into deployable HTML files; GitHub Pages
serves those files directly.

## Structure

```
/
├── index.html                        # Homepage — featured work grid
├── about.html                        # About Claudia — identity, background, and featured work
├── 404.html                          # Custom error page
├── _footer.html                      # Shared footer partial (single source of truth)
├── _portfolio-nav.html               # Shared navigation for the homepage and 404 page
├── _contact-overlay.html             # Shared contact form for the homepage and 404 page
├── _analytics.html                   # Shared Google Analytics bootstrap for every rendered page
├── _head-basics.html                 # Shared charset, viewport, favicon, and Apple touch-icon tags
├── _portfolio-fonts.html             # Shared preloads for the self-hosted portfolio fonts
├── _case-study-topbar.html           # Shared topbar template for the six case studies
├── _case-study-footer.html           # Shared footer for the six case studies
├── _lovesac-nav.html                 # Shared navigation for the Lovesac prototype pages
├── _lovesac-footer.html              # Shared footer for three Lovesac prototype pages
├── build.py                          # Stamps shared HTML partials into their pages
├── favicon.svg                       # Heart favicon (SVG)
├── favicon-192.png                   # Heart favicon (PNG, for Google Search)
├── favicon-32.png                    # Heart favicon (PNG, browser tab fallback)
├── sitemap.xml                       # All pages for search engine discovery
├── robots.txt                        # Crawl directives
├── llms.txt                          # Curated AI/agent guide to authoritative portfolio content
├── BACKLOG.md                        # Deferred work outside the active agentic-readiness stream
├── output/pdf/Claudia_Ochoa_Resume.pdf # Branded, ATS-readable two-page résumé
├── resume/build_resume.py            # Editable ReportLab source for the résumé PDF
├── CNAME                             # Custom domain for GitHub Pages
├── worker/                           # Cloudflare Worker + KV API for case-study polls
├── worker-csp/                       # Cloudflare Worker that adds CSP and Permissions-Policy headers
├── fonts/                            # Self-hosted portfolio fonts and license
├── css/
│   ├── case-study.css                # The whole design system — colors, type, nav, hero, buttons, footer,
│                                      # contact overlay — for index.html, about.html, 404.html, and all 6 case studies.
│                                      # Not used by the Lovesac redesign prototype pages (a deliberately
│                                      # separate system).
│   └── lovesac-prototype.css          # Shared foundation for the Lovesac Redesign, Support, and What to Expect
│                                      # prototype pages — tokens, nav, drawers, common sections, and footer
├── js/
│   ├── main.js                       # Shared theme, contact form, and portfolio behavior
│   ├── portfolio-webmcp.js           # Progressive WebMCP pilot for grounded, read-only portfolio questions
│   ├── font-preload.js               # Activates asynchronously preloaded font stylesheets site-wide
│   ├── case-study-topbar.js          # Shared hide/show-on-scroll behavior for case-study topbars
│   ├── case-study-toc.js             # Shared case-study section rail navigation and active states
│   ├── case-study-tooltips.js        # Lazy-loads case-study series tooltip images on interaction
│   ├── case-study-tables.js          # Responsive-table scroll state for case studies 02–06
│   ├── case-study-counters.js        # Shared in-view metric animation for case studies 02 and 06
│   ├── case-study-polls.js           # Shared poll rendering, persistence, and Worker requests
│   ├── lovesac-focus-scope.js         # Shared keyboard focus containment and restoration for prototype overlays
│   ├── lovesac-mobile-nav.js         # Shared prototype mobile navigation for four Lovesac pages
│   ├── lovesac-mega-menu.js          # Shared desktop prototype mega-menu behavior
│   ├── lovesac-nav-scroll.js         # Shared prototype hide/show-on-scroll navigation behavior
│   ├── lovesac-prototype-feedback.js # Shared mock-link, search, and toast feedback behavior
│   ├── lovesac-store-finder.js       # Shared prototype store drawer and map behavior
│   ├── lovesac-drawers.js            # Shared account and cart drawer controller
│   ├── lovesac-hero-parallax.js      # Shared prototype hero parallax behavior
│   ├── lovesac-lazy-backgrounds.js   # Loads below-fold prototype background images near the viewport
│   ├── lovesac-search-panel.js       # Shared prototype desktop search panel behavior
│   └── lovesac-back-link.js          # Shared prototype back-to-portfolio visibility behavior
├── images/
├── blog/
│   ├── index.html                    # Blog listing page
│   └── _template.html                # Starting point for a new post (copy, don't edit in place)
├── work/
│   ├── lovesac-case-study.html       # Lovesac — Redesign (featured concept case study)
│   ├── walmart-my-hiring-dashboard.html # Walmart — corporate hiring manager dashboard within Me@Campus
│   ├── thd-giftcards.html             # The Home Depot — research-led gift card and mixed-cart checkout case study
│   ├── walmart-genai.html             # Walmart — human-centered GenAI candidate-experience leadership case study
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

## Agent interfaces

The site exposes the same published evidence through complementary interfaces:

- `/llms.txt` provides a curated discovery guide.
- Content negotiation serves concise Markdown when an agent prefers `text/markdown`.
- `/mcp` provides a public, stateless, read-only MCP server.
- Supporting browsers receive one progressive WebMCP tool, `ask_portfolio`, on the
  homepage. It uses the existing grounded portfolio guide, returns canonical source
  links, and is unavailable to cross-origin frames through the `tools=(self)` policy.

WebMCP is an experimental enhancement. Browsers without `document.modelContext`
continue to receive the normal site with no fallback script or user-facing change.

## Local development

The portfolio is static, so preview it with any local HTTP server:

```bash
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000). Run
`python3 build.py --check` before committing to verify that generated HTML is
current. The Cloudflare Workers have their own setup and development commands
in [`worker/README.md`](worker/README.md) and
[`worker-csp/README.md`](worker-csp/README.md).

## Deploying changes

```bash
python3 build.py
python3 build.py --check
git add <files>
git commit -m "describe what changed"
git push
```

GitHub Pages deploys automatically. Changes are live within 1–2 minutes.
The `Code quality` GitHub Actions workflow runs the same generated-file and
syntax checks on every push and pull request.

## Updating the nav or footer

`index.html`, `about.html`, and `404.html` share the same simple navigation and contact overlay,
stamped from `_portfolio-nav.html` and `_contact-overlay.html`. The homepage
hides the shared wordmark with page-specific CSS because linking home from the
homepage is redundant. The six case studies use a separate `.topbar` component
(back link, series nav, tag), generated from `_case-study-topbar.html` and the
per-page metadata in `build.py`.

Shared markup is maintained in partial files and stamped into the applicable
pages by `build.py`:

- `_footer.html` — portfolio footer used by `index.html`, `about.html`, and `404.html`
- `_analytics.html` — Google Analytics bootstrap used by every rendered page
- `_head-basics.html` — charset, viewport, favicon, and Apple touch-icon tags used by every rendered page
- `_portfolio-nav.html` — navigation used by `index.html`, `about.html`, and `404.html`
- `_contact-overlay.html` — contact form used by `index.html`, `about.html`, and `404.html`
- `_case-study-topbar.html` — topbar used by all six case studies; its active
  series item and page tag are generated from the metadata in `build.py`
- `_case-study-footer.html` — footer used by all six case studies
- `_lovesac-nav.html` — navigation used by all four Lovesac prototype pages
- `_lovesac-footer.html` — footer used by the Sactionals, What to Expect, and
  Customer Support prototype pages; the redesign homepage keeps its intentional
  footer variant inline
- `_lovesac-core-scripts.html` — focus, feedback, search, store, and drawer behavior used by all four Lovesac prototype pages
- `_lovesac-page-scripts.html` — mobile navigation, mega menu, back link, nav scroll, and hero behavior used by the three editorial Lovesac prototype pages

To change shared markup:
1. Edit the applicable partial
2. Run `python3 build.py` — stamps the update into every page that uses it
3. Commit and push all changed files

Run `python3 build.py --check` for a read-only validation. It exits with an
error if a generated region is stale or if markers are missing, duplicated,
reversed, or unmatched.

## Adding a blog post

1. Copy `blog/_template.html` to `blog/<slug>.html` (lowercase, hyphenated, no dates in the slug)
2. Fill in every `REPLACE:` marker — title, dates, description, OG/Twitter tags, canonical URL, byline, and body copy
3. Add a card for the post to `blog/index.html`, newest first, above the "Add new posts above this line" comment (and remove the "first post is on its way" empty state the first time)
4. Add the new URL to `sitemap.xml`
5. Run `python3 build.py`, then `python3 build.py --check`
6. Push

## Adding a case study

1. Copy an existing file from `work/` and rename it
2. Update the title, meta description, Open Graph tags, and canonical URL in `<head>`
3. Update content and cover image reference
4. Add the cover image to `images/`
5. Add a card to `index.html`
6. Add the URL to `sitemap.xml`
7. Push

## Editing shared styles

`css/case-study.css` is the entire design system for `index.html`, `about.html`, `404.html`, and
all 6 case studies — colors, typography, nav/topbar, hero, section-head,
context-strip, buttons, footer, contact overlay, password gate, and citation
patterns, all linked once instead of copy-pasted per page. Edit it for anything
that should change everywhere; edit a page's own `<style>` block only for content
specific to that page (the homepage's work-grid card, a case study's narrative
sections, charts, demos). This file is unrelated to the Lovesac redesign prototype
pages (`lovesac-redesign.html`, `lovesac-sactionals.html`, `lovesac-what-to-expect.html`,
`lovesac-support.html`), which mock the real Lovesac site's own look and are a
deliberately separate system. Shared Redesign, Support, and What to Expect styles
live in `css/lovesac-prototype.css`; their inline style blocks contain page-specific rules.

## SEO

Every page has:
- Unique `<meta name="description">` tag
- Open Graph tags (`og:title`, `og:description`, `og:url`, `og:type`, `og:image`)
- Twitter Card tags for link preview on X/Twitter and iMessage
- `<link rel="canonical">` to prevent duplicate content issues
- PNG favicons at 192×192 and 32×32 for Google Search and browser tabs

The homepage has JSON-LD `Person` schema. The Walmart GenAI and featured Lovesac case studies additionally use `CreativeWork` schema with an `author` reference to the Person. The AI leadership case is prioritized in `sitemap.xml` at 0.9; meaningful content updates should keep each page's `lastmod` current.

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
- Portfolio fonts are self-hosted and preloaded to avoid third-party latency and layout shift
- No framework or package-runtime dependencies
- Leaflet map assets load on demand only when the prototype store finder opens

## Infrastructure

- Hosted on **GitHub Pages**
- Custom domain configured via GoDaddy DNS → GitHub Pages A records
- TLS enforced via GitHub Pages
- Analytics via **Google Analytics 4** (`G-3G6X2P2669`)
- Case-study poll counts stored in Cloudflare KV through [`worker/`](worker/)
- CSP and Permissions-Policy response headers added by [`worker-csp/`](worker-csp/)
- Domain verified with Google Search Console

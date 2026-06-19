# claudiaochoa.co

Personal portfolio of Claudia Ochoa — Product Design Leader specializing in AI-powered experiences.

## Live site

[claudiaochoa.co](https://claudiaochoa.co)

## Stack

Plain HTML, CSS, and vanilla JS. No frameworks, no build step, no dependencies. Fast and lightweight.

## Structure

```
/
├── index.html                        # Homepage — featured work grid
├── about.html                        # About page
├── 404.html                          # Custom error page
├── _nav.html                         # Shared nav partial (single source of truth)
├── build.py                          # Stamps _nav.html into all pages
├── favicon.svg                       # Heart favicon (SVG)
├── favicon-192.png                   # Heart favicon (PNG, for Google Search)
├── favicon-32.png                    # Heart favicon (PNG, browser tab fallback)
├── sitemap.xml                       # All pages for search engine discovery
├── robots.txt                        # Crawl directives
├── CNAME                             # Custom domain for GitHub Pages
├── css/
│   └── style.css                     # All styles
├── js/
│   └── main.js                       # Scroll reveal, nav, reading time, contact form
├── images/
│   └── blog/                         # Blog post images (WebP)
├── work/
│   ├── walmart-careers.html          # Redesigning Walmart's Candidate Experience
│   ├── walmart-genai.html            # Transforming Hiring with GenAI
│   ├── walmart-my-hiring-dashboard.html  # My Hiring Dashboard
│   ├── walmart-mecampus-redesign.html    # Me@Campus Redesign
│   ├── walmart-carplay.html          # CarPlay Experience for Associates
│   ├── walmart-connect.html          # Building Community for Relocating Associates
│   ├── thd-giftcards.html            # The Home Depot Gift Cards
│   ├── thd-militarydiscount.html     # The Home Depot Military Discount
│   ├── bible-study.html              # Designing for Formation (personal)
│   └── personal-portfolio.html       # From Template to Code (personal)
└── blog/
    ├── index.html                    # Blog index
    ├── surprise-and-delight.html
    ├── the-true-reality-of-speed.html
    ├── when-the-office-mandate-broke-my-creative-spirit.html
    ├── the-new-ways-of-working-with-ai.html
    ├── from-storytelling-to-systems.html
    └── making-it-easier-from-the-other-side.html
```

## Deploying changes

```bash
git add <files>
git commit -m "describe what changed"
git push
```

GitHub Pages deploys automatically. Changes are live within 1–2 minutes.

## Updating the nav

The nav (skip link, top nav, mobile menu, contact overlay) lives in one place: `_nav.html`.

To change it:
1. Edit `_nav.html`
2. Run `python3 build.py` — this stamps the updated nav into every page
3. Commit and push all changed files

## Adding a case study

1. Copy an existing file from `work/` and rename it
2. Update the title, meta description, Open Graph tags, and canonical URL in `<head>`
3. Update content and cover image reference
4. Add the cover image to `images/`
5. Add a card to `index.html`
6. Add the URL to `sitemap.xml`
7. Push

## Adding a blog post

1. Copy an existing file from `blog/` and rename it
2. Update the title, meta description, Open Graph tags, canonical URL, and JSON-LD Article schema in `<head>`
3. Update the `<time datetime="YYYY-MM-DD">` date in the body
4. Update the content and hero image (use WebP format)
5. Add a card to `blog/index.html`
6. Add the URL to `sitemap.xml`
7. Push

Reading time is calculated automatically from word count — no manual step needed.

## SEO

Every page has:
- Unique `<meta name="description">` tag
- Open Graph tags (`og:title`, `og:description`, `og:url`, `og:type`, `og:image`)
- Twitter Card tags for link preview on X/Twitter and iMessage
- `<link rel="canonical">` to prevent duplicate content issues
- PNG favicons at 192×192 and 32×32 for Google Search and browser tabs

Blog posts additionally have:
- JSON-LD `Article` schema (headline, description, author, datePublished, image)
- `<time datetime="YYYY-MM-DD">` on the publish date

The homepage has JSON-LD `Person` schema.

`sitemap.xml` lists all pages and is referenced in `robots.txt`. The sitemap is submitted to Google Search Console at `https://claudiaochoa.co/sitemap.xml`.

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

- All blog images are WebP (avg 92% smaller than original PNGs, ~17MB saved)
- Work case study thumbnails are already WebP
- Fonts are preconnected via `<link rel="preconnect">`
- No external JS dependencies

## Infrastructure

- Hosted on **GitHub Pages**
- Custom domain configured via GoDaddy DNS → GitHub Pages A records
- TLS enforced via GitHub Pages
- Analytics via **Google Analytics 4** (`G-3G6X2P2669`)
- Domain verified with Google Search Console

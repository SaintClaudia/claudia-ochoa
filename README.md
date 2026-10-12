# claudiaochoa.co

Personal portfolio of Claudia Ochoa — AI Experience and Product Design Leader blending emerging technology, business strategy, and human-centered design.

## Live site

[claudiaochoa.co](https://claudiaochoa.co)

## Portfolio redesign

Work is the homepage, with full-screen project stories and independent device motion. About and Contact are separate pages. The three pages share `css/portfolio-story.css` and `js/portfolio-story.js`; all portfolio pages share `_portfolio-nav.html`, `css/portfolio-nav.css`, and `js/portfolio-nav.js`; the menu lists Walmart, Lovesac, and Home Depot case studies. `/work/` redirects to `/`. Existing case-study and blog URLs remain available. Contact uses the existing Web3Forms integration.

Edit the production pages and shared story assets directly. `redesign/` is an ignored local review snapshot. The new pages preserve canonical/social metadata, structured data, analytics, and reduced-motion support. Homepage WebMCP remains available.

## Stack

Plain HTML, CSS, and vanilla JS. No frameworks or package dependencies. A small
Python script stamps shared partials into deployable HTML files; GitHub Pages
serves those files directly.

## Structure

```
/
├── index.html                        # Work homepage — full-screen project storytelling
├── work/index.html                   # Redirect to the Work homepage
├── about.html                        # About Claudia — identity, background, and featured work
├── 404.html                          # Custom error page
├── _footer.html                      # Shared footer partial (single source of truth)
├── _portfolio-nav.html               # Shared header and menu for all portfolio pages
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

Portfolio pages are linked from the site. The intentionally unlinked game prototype
at `/games/chasing-birdies/` is excluded from navigation, the sitemap, and agent
discovery, and has a `noindex, nofollow` directive. An unlinked URL is still public
when deployed.

## Chasing Birdies

An independent, buildless arcade golf game at `games/chasing-birdies/index.html`.
Compatibility pages redirect the former misspelled game and player-gallery URLs
to the corrected path on GitHub Pages. The site Worker also includes a permanent
redirect for all old paths, including assets, ready for its next deployment.
The game has its own canonical URL, search description, Open Graph/Twitter
sharing metadata, and factual `VideoGame` JSON-LD describing local play.
Choose 1–3 local players, select Purdy, McCaffrey, or Kittle for each player,
and choose a football uniform or Niners golf attire. Three coastal holes feature
club selection, aim and power controls, tap/drag aiming, wind, rough, bunkers,
water penalties, a scorecard, and round results. Each participant takes one shot
per turn; finished players are skipped. A twelve-stroke pickup keeps rounds moving.
Club buttons show maximum distance for the current golfer and lie. Full-power
ranges are 285–320 yd for drivers, 165–180 yd for 7 irons, 80–85 yd for sand
wedges, and 60 yd for putters on the green. Rough and sand reduce these ranges,
with stronger reductions for drivers and putters. Wedges preserve bunker recovery.
Club and power suggestions use distance, lie, and head/tail wind; players can
adjust both. Each club has its own wind response and flight height, with lower
flight on softer shots. Green detection follows the drawn ellipse.
Mobile rounds put club selection, aim and power sliders, and Swing directly
beneath the course. A mobile Swing button inside the course also shows the selected
club and power, and is disabled during playback. The landing preview shows expected distance and surface,
with water and out-of-bounds warnings. Dragging the target adjusts both aim and
power with wind compensation; pulling back from the ball also adjusts the shot.
Mobile gestures wait for Swing by default; swing on release can be enabled in
How to play. Player details and the scorecard expand below the controls,
and shot transitions return the course to view. Desktop retains keyboard controls
and defaults to swing on release for pull-back gestures.
Rolling shots and landings can bump resting balls, transferring motion and
deflecting glancing hits. Balls waiting to tee off and holed balls are excluded.
Bumps do not add strokes to other players; a bumped ball entering the cup finishes
with its existing stroke count. A bumped ball sent into a hazard is restored to
a safe resting position without a penalty. The deterministic motion module is
`ball-physics.js`; run its collision checks with
`node --test games/chasing-birdies/ball-physics.test.cjs`.
Ball collisions have timed impact clicks. The cup-drop sound uses a cleaned,
user-confirmed recording, loaded only when sound is enabled. Hole and round
completion have no victory ping. Driver, iron, and wedge shots use a trimmed recording from the
supplied hit voice memo; the putter keeps its existing sound. Source and edit details are in `games/chasing-birdies/audio/README.md`.

Preview at `http://localhost:8000/games/chasing-birdies/` using the static server
below. The game uses its own CSS and JavaScript, self-hosted portfolio fonts,
procedural canvas course art, and transparent player costume sheets. The pitch-aligned
arcade edition adds the self-hosted Anton font (license alongside it), blue HUD
panels, and generated coastal title artwork in `fairway-title.webp`; its ImageGen
prompt is retained in `artwork-prompt.txt`. The Clubhouse loads responsive hero versions,
a small logo, and pre-cropped portraits. Swing sheets load when a round starts,
for selected golfers only. `anton-latin.woff2` is a subset of the licensed Anton
source font. Rebuild these display assets after artwork changes with
`python3 games/chasing-birdies/optimize_assets.py` (Pillow and fontTools with
WOFF2 support), then update the hero cache versions in the HTML and CSS. Player sheets in `players/` cover
uniform and golf variants for all three players, using official headshots as
likeness references; generation prompts and source links live in `players/README.md`.
The unlinked `players/index.html` comparison view displays all six looks. It requires
no external services. Round state is held in memory and resets on reload.
Keep it unlinked until ready to announce.

## Agent interfaces

The site exposes the same published evidence through complementary interfaces:

- `/llms.txt` provides a curated discovery guide.
- Content negotiation serves concise Markdown when an agent prefers `text/markdown`.
- `/mcp` provides a public, stateless, read-only MCP server.
- Supporting browsers receive one progressive WebMCP tool, `ask_portfolio`, on the
  homepage. It uses the existing grounded portfolio guide, returns canonical source
  links, and relies on the WebMCP permission's default `self` allowlist so it is not
  available to cross-origin frames.

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

All 19 portfolio pages use `_portfolio-nav.html` for the header and menu. `_portfolio-nav-assets.html` supplies the single navigation stylesheet and script. Edit these shared sources and run `python3 build.py`; do not edit generated navigation blocks in individual pages. The shared script handles the current-page state, opening, closing, Escape, and focus recovery.

Shared markup is maintained in partial files and stamped into the applicable
pages by `build.py`:

- `_footer.html` — portfolio footer used by `about.html`, `404.html`, and `work/index.html`
- `_analytics.html` — Google Analytics bootstrap used by every rendered page
- `_head-basics.html` — charset, viewport, favicon, and Apple touch-icon tags used by every rendered page
- `_portfolio-nav.html` — header and menu used across all portfolio pages
- `_portfolio-nav-assets.html` — shared header/menu stylesheet and behavior
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
2. Use the shared `/css/blog.css` components and the template’s numbered section layout. Keep listing titles as plain `<h2>` headings; the image and “Read the post” button link to the article. Use `image-full` on a lead image or card image to preserve a full 3:2 composition.
3. Fill in every `REPLACE:` marker — title, dates, description, OG/Twitter tags, canonical URL, byline, and body copy
4. Add a card for the post to `blog/index.html`, newest first, above the "Add new posts above this line" comment (and remove the "first post is on its way" empty state the first time)
5. Add the new URL to `sitemap.xml`
6. Run `python3 build.py`, then `python3 build.py --check`
7. Push


## Adding a case study

1. Copy an existing file from `work/` and rename it
2. Update the title, meta description, Open Graph tags, and canonical URL in `<head>`
3. Update content and cover image reference
4. Add the cover image to `images/`
5. Add a card to `work/index.html`
6. Add the URL to `sitemap.xml`
7. Push

## Editing shared styles

`css/case-study.css` is the entire design system for `index.html`, `about.html`, `404.html`,
`work/index.html`, and all 6 case studies — colors, typography, nav/topbar, hero, section-head,
context-strip, buttons, footer, contact overlay, password gate, and citation
patterns, all linked once instead of copy-pasted per page. Edit it for anything
that should change everywhere; edit a page's own `<style>` block only for content
specific to that page (the homepage's fixed-viewport hero and glow, the work
index's work-grid card, a case study's narrative sections, charts, demos). This
file is unrelated to the Lovesac redesign prototype
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

### Chasing Birdies player balance

Player traits are fictional arcade choices, not measured abilities of the real
athletes. Purdy drives 285 yd at full power and has the least wind drift;
McCaffrey drives 300 yd and retains more distance from rough and sand;
Kittle drives 320 yd with stronger irons and greater wind drift. Wedge ranges
are 95/98/100 yd; putting is identical, even from poor lies. No random miss
is added: the aiming preview and actual shot use the same calculation in
`player-skills.js`. Power shows the selected club's distance before wind.
Run balance checks with `node --test games/chasing-birdies/player-skills.test.cjs`.

The three holes use distinct coastal layouts: Coastal kickoff is a wide, open
par 4; The golden gate is a narrower par 4 crossing the map beside cool lagoons;
The faithful finish is a longer, warmer-toned par 5 dogleg with bunkers at the
turn. Fairway lie detection uses each hole's rendered fairway width.

The opening screen uses the existing lightweight logo with a waving SVG flag
and a creator credit, then reveals the clubhouse after 4 seconds. Skip intro
and Escape enter immediately. Reduced motion and JavaScript-disabled browsers
bypass the animation. It runs once per page load, never on returning to the
clubhouse within a round. No audio or additional image assets load for it.

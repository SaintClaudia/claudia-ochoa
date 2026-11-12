# claudiaochoa.co

Personal portfolio of Claudia Ochoa — Creative and Product Design Leader blending emerging technology, business strategy, and human-centered design.

## Live site

[claudiaochoa.co](https://claudiaochoa.co)

## Portfolio redesign

Work is the homepage, with full-screen project stories and independent device motion. About and Contact are separate pages. The three pages share `css/portfolio-story.css` and `js/portfolio-story.js`; all portfolio pages share `_portfolio-nav.html`, `css/portfolio-nav.css`, and `js/portfolio-nav.js`; the menu lists Ask Read, Chasing Birdies, and Brock Purdy 13. `/work/` redirects to `/`. Earlier Walmart, Home Depot, and Lovesac pages, prototypes, and the blog are archived at their original URLs. Archive pages carry `noindex, follow`, are excluded from the sitemap and curated AI sources, and preserve their original content and design. Blog audit reports are also excluded from indexing. The blog template is archived; do not use it for new active content without explicitly restoring it. Contact uses the existing Web3Forms integration.

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
├── _contact-overlay.html             # Legacy contact form for archived pages
├── _analytics.html                   # Shared Google Analytics bootstrap for every rendered page
├── _head-basics.html                 # Shared charset, viewport, favicon, and Apple touch-icon tags
├── _portfolio-fonts.html             # Shared preloads for the self-hosted portfolio fonts
├── _case-study-topbar.html           # Shared topbar template for the six case studies
├── _lovesac-nav.html                 # Shared navigation for the Lovesac prototype pages
├── _lovesac-footer.html              # Shared footer for three Lovesac prototype pages
├── build.py                          # Stamps shared HTML partials into their pages
├── favicon.svg                       # Organic mark favicon (SVG)
├── favicon-192.png                   # Organic mark favicon (PNG, for Google Search)
├── favicon-32.png                    # Organic mark favicon (PNG, browser tab fallback)
├── sitemap.xml                       # Current indexable portfolio pages
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
│   ├── case-study.css                # Preserved design system for archived case studies and blog pages
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

The portfolio swing section uses a 6.8-second, locally hosted H.264 concept film
with a reference-based Brock Purdy likeness. It plays once when visible, pauses
offscreen, offers pause/replay controls, and stays still for reduced-motion
visitors until they choose to play. Native controls remain available without
JavaScript. See `docs/chasing-birdies-swing-film.md` for provenance and review.

The portfolio story at `work/chasing-birdies.html` presents Chasing Birdies with
Brock Purdy as its lead and a 16-player concept roster spanning teams and eras.
The roster uses four staggered desktop columns, three on tablet, and two on phones;
its gentle scroll motion respects reduced-motion preferences. Golf portraits carry
current-team or last-played-for logos, while the separate customization sequence
retains football uniforms. Artwork provenance and team assignments are recorded in
`images/birdies-roster-artwork.md`. This concept roster is separate from the existing
three-character playable prototype described below.

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

## Shared visual design

`css/portfolio-foundation.css` is the source of truth for the active portfolio's
font declarations, font stacks, text sizes, neutral colors, gutters, section
spacing, and media radii. Component styles consume these tokens. Inter is the
portfolio typeface; Outfit belongs to Ask Read product interfaces. Project
artwork and brand palettes remain scoped to their own stories. Archived case
studies, the blog, and independent prototypes retain their original designs.
See [the design-system guide](docs/design-system.md) for conventions and scope.

`build.py` embeds the foundation in the homepage and stamps its stylesheet into
the shared navigation assets on other portfolio pages. It also derives local
stylesheet versions from file contents; manual CSS version increments are no
longer needed. Run the build after CSS changes, including those embedded on the
homepage, and commit the regenerated HTML.

```bash
python3 build.py
python3 build.py --check
python3 eval/design-system-check.py
```

The design check verifies the seven active pages, referenced local assets,
image dimensions and alt attributes, and central font ownership. It runs in CI.
Browser review is still required for layout, contrast over imagery, keyboard
interaction, zoom, and reduced-motion behavior.

## Updating the nav or footer

Portfolio pages use `_portfolio-nav.html` for the header and menu. `_portfolio-nav-assets.html` supplies the single navigation stylesheet and script. Edit these shared sources and run `python3 build.py`; do not edit generated navigation blocks in individual pages. The shared script handles the current-page state, opening, closing, Escape, and focus recovery.

Shared markup is maintained in partial files and stamped into the applicable
pages by `build.py`:

- `_footer.html` — shared portfolio footer stamped into current and archived portfolio pages
- `_analytics.html` — Google Analytics bootstrap used by every rendered page
- `_head-basics.html` — charset, viewport, favicon, and Apple touch-icon tags used by every rendered page
- `_portfolio-nav.html` — header and menu used across all portfolio pages
- `_portfolio-nav-assets.html` — shared header/menu stylesheet and behavior
- `_contact-overlay.html` — legacy contact form retained on archived pages
- `_case-study-topbar.html` — topbar used by all six case studies; its active
  series item and page tag are generated from the metadata in `build.py`
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

## Archived content maintenance

The blog and earlier case studies are historical references. Preserve their URLs,
archive notices, and `noindex, follow` directives. Do not use the archived blog
or case-study templates for new active portfolio pages, or add archived URLs to
the sitemap, unless explicitly restoring that content.

## Adding a featured project

1. Use a current project page (`work/ask-read.html`, `work/chasing-birdies.html`,
   or `work/brock-purdy-13.html`) as the structural reference.
2. Update content, artwork, title, description, canonical URL, social metadata,
   and any structured data to accurately describe the new project.
3. Add the homepage story in `index.html` and the navigation entry in
   `_portfolio-nav.html`; update project numbering as needed. `work/index.html`
   is a redirect, not a project listing.
4. Give headings and links meaningful project names for screen-reader navigation.
   Keep decorative mock interfaces out of the reading order and keyboard focus.
5. Update `sitemap.xml`, `llms.txt`, and the curated resources in
   `worker-csp/src/portfolio-knowledge.js` when featuring the project for discovery.
6. Run `python3 build.py`, `python3 build.py --check`, and relevant checks for
   changed scripts or Worker resources. Review desktop, mobile, keyboard, and
   screen-reader behavior before publishing.
7. Commit and push the static changes. Changes to Worker resources also require
   the separate Worker test and deployment workflow in `worker-csp/README.md`.

## Editing shared styles

`css/portfolio-story.css` provides the current portfolio foundation; `css/case-story.css`
extends it for the three featured projects. The 404 page uses the current foundation,
with its existing centered error layout. `css/portfolio-nav.css` and
`css/portfolio-footer.css` supply the shared navigation and footer.

`css/case-study.css` preserves the earlier design system for archived case studies
and blog pages. `css/archive.css` adds a small archive notice without restyling
historical content. This
file is unrelated to the Lovesac redesign prototype
pages (`lovesac-redesign.html`, `lovesac-sactionals.html`, `lovesac-what-to-expect.html`,
`lovesac-support.html`), which mock the real Lovesac site's own look and are a
deliberately separate system. Shared Redesign, Support, and What to Expect styles
live in `css/lovesac-prototype.css`; their inline style blocks contain page-specific rules.

## SEO

Current portfolio pages carry canonical URLs, descriptions, Open Graph/Twitter
sharing metadata, and shared favicons. The homepage includes `Person` JSON-LD.
Archived pages retain their historical metadata alongside `noindex, follow`.

`sitemap.xml` lists the six current portfolio routes: Home, About, Contact,
Ask Read, Chasing Birdies, and Brock Purdy 13. It excludes archived work, the blog,
and the unlinked game prototype. `robots.txt` references the sitemap. Keep each
page's `lastmod` accurate when making meaningful content changes.

### Naming conventions

Use lowercase, hyphen-separated names for new public pages, stylesheets, scripts,
and images, such as `work/ask-read.html` and `images/ask-read-showcase.webp`.
Prefix project assets with their project name and shared portfolio assets with
`portfolio-`. Keep existing CSS component prefixes consistent within each system
(`site-`, `story-`, `cs-`, `askread-`, and `birdies-`); do not rename selectors
without updating their HTML and JavaScript references. HTML partials use a leading
underscore. Preserve brand names in visible copy: Ask Read, Chasing Birdies, and
Brock Purdy 13. The résumé download keeps its human-readable filename.

Existing archive asset names and compatibility redirects are intentional exceptions.
Do not rename published URLs just for cosmetic consistency; preserve old links
with redirects when a URL genuinely needs to change.

Review on 2026-11-11: all six sitemap pages have unique titles and descriptions,
self-canonical URLs, one H1, and `lang="en"`. All HTML links and fragment targets
from those pages resolve locally. The six live routes returned HTTP 200; a missing
route returned 404. The linked NFL PDF and Cowboys article returned 200. LinkedIn
returned 999 to the automated request, so its destination was not verified.
About and Contact now include explicit social-image descriptions, and Contact
also has explicit Twitter metadata and ContactPage JSON-LD. This review checks
metadata and link integrity, not search-engine indexing or rendered social cards.

## Accessibility

WCAG 2.1 AA is the target, not a claim of a completed site-wide conformance audit.
Automated scores support review; the actual keyboard and listening experience
remains the acceptance standard.

- Preserve the skip link, semantic main landmark, heading hierarchy, visible
  focus indicators, and reduced-motion behavior. Current portfolio pages use
  `id="main"`; older archived pages may use different landmark IDs.
- Give informative images useful alternatives and decorative images empty alt
  text. Do not narrate decorative device internals as independent page content.
- Name icon-only controls and make project links understandable out of context.
- The homepage introduces Claudia Ochoa in its h1, includes each project name in
  its h2 and concept link, and exposes the Ask Read mockup as one concise image
  description. The mockup internals are `aria-hidden` and `inert`; decorative
  project counters and the duplicate wordmark are hidden from screen readers.
  `.sr-only` in `css/portfolio-story.css` supplies the additional spoken context.
- The homepage skip-link and selected-work targets have `tabindex="-1"` so they
  can receive focus without adding extra Tab stops.

Reviewed November 10, 2026: all six active pages were inspected through Chrome's
macOS accessibility tree and keyboard input. Main and overview jump targets now
accept focus; main landmarks have an explicit name. The Ask Read title precedes
its preview, decorative mockups cannot receive focus, and evidence/Library
controls remain usable. Related-project links have concise names; the Birdies
roster follows its introduction in reading order. Contact restores submit focus
after responses without taking focus from another control.

A localhost-only Contact test verified failure/success messages and focus recovery
without sending a real message. On November 11, 2026, Claudia confirmed the
VoiceOver walkthrough of all six current pages was verified. This closes the
listening follow-up through user confirmation, not automated speech capture. See
[the initial review record](docs/accessibility-review-2026-11-10.md) for the
November 10 checks and tool limitations, and `BACKLOG.md` for the completed
follow-up. Do not extend these results to archived pages.

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

## Sharing and archive maintenance

`images/og-card.png` is Claudia's supplied “Ideas, made visible” artwork, copied
unchanged from the 1731 × 909 PNG. The homepage and archived blog index use the
versioned `og-card.png?v=3` URL. Current project pages keep their own artwork with
explicit Open Graph dimensions, image descriptions, and Twitter metadata.
About and Contact have separate metadata and are maintained independently.

Archived URL families: `/blog/` (including reports), `/work/lovesac-*.html`,
`/work/walmart-*.html`, and `/work/thd-giftcards.html`. Keep these files and their
assets to preserve existing links. Do not block them in robots.txt: crawlers need
to read their noindex directives. Current AI resources live in
`worker-csp/src/portfolio-knowledge.js`; changes to that file require a separate
Worker deployment in addition to the static GitHub Pages deployment.

## Homepage loading

The homepage embeds its stylesheet sources in cascade order using the
`HOME-STYLES` region in `build.py`, avoiding render-blocking CSS requests.
Edit the shared CSS sources, then run `python3 build.py`; never edit the stamped
style block directly. Other pages retain external stylesheets. The introductory
SVG wordmark is preloaded at high priority. Below-fold film thumbnails use
responsive WebP sizes; the homepage fragrance image uses a WebP derivative.
Original artwork remains available for project pages and social sharing.

## About page

`about.html` uses Claudia's supplied “Curiosity, shaped by experience” draft with
the master navigation, shared footer, and standard Contact CTA. Its scoped layout
lives in `css/about-story.css`; `js/about-story.js` animates the favicon-inspired
sculpture continuously while visible, honoring the device's reduced-motion setting.
There is no visible pause control. The original embedded portrait matches the
existing headshot asset, which is reused without duplicating its image data.

### Shared editorial typography

`css/portfolio-story.css` owns the `--site-body-size`, `--site-body-leading`, `--site-lead-size`, and `--site-lead-leading` tokens. About biography copy, homepage project summaries, and Contact copy consume this scale; use these tokens instead of page-specific body sizes. About inherits the site font. Run `python3 build.py` after changing shared CSS to refresh the homepage’s generated inline styles.

`css/editorial-pages.css` supplies the shared light surface, colors, gutters, focus styles, and navigation treatment for About and Contact. Contact uses the “Good work starts with a conversation.” heading, shared body scale and pill button, with the existing Web3Forms delivery and LinkedIn link.

### Redesign cleanup status — November 10, 2026

The shipped cleanup includes archive/discovery separation, refreshed sharing
artwork, homepage loading and Safari wordmark fixes, the About redesign, shared
editorial typography, Contact styling and focus refinements, CTA contrast, link
underline motion, and descriptive homepage screen-reader names. The homepage
wordmark is a directly rendered SVG; preserve that first-paint behavior.

About and Contact share the dot texture and editorial tokens in
`css/editorial-pages.css`. Contact fields use an underline focus treatment, its
form sits on a white surface with a subtle shadow, and editorial links animate
their underline left to right while respecting reduced-motion preferences.

Local `tmp/` review artifacts are untracked and are not part of the deployment.
Do not commit or delete them as part of routine site updates. As of November 11,
2026, the current redesign follow-up in `BACKLOG.md` is complete, including
Claudia’s confirmation of VoiceOver verification. No other unresolved redesign
items are recorded; this status is not a blanket audit of archived pages or assets.

# Mobile layout review — October 24, 2026

Reviewed the local site in Chrome responsive viewports at 320, 375, 390, 430, and 768 pixels wide. The 34 routes below include the Work homepage, current and legacy case studies, blog posts and reports, Lovesac prototypes, and Chasing Birdies game and diagnostics. Redirect routes were checked at their destination. Templates, shared HTML partials, and the Google verification file are not rendered content pages.

## Corrections

- Increased shared color-palette row gaps from 12px to 28px while retaining 12px column gaps. Wrapped rows now have more space below the previous row’s hex labels in Chasing Birdies, Ask Read, and Brock Purdy 13.
- Centered Ask Read’s QB Intelligence tablet within the introduction’s text gutters and kept its background glow within the tablet’s horizontal bounds. The page previously extended 23–66px beyond the tested mobile viewport widths.
- Updated stylesheet version queries on all three affected case studies.

## Verification

- All 170 route/width combinations have document scroll width equal to viewport width after the corrections, using fresh page URLs to avoid cached navigation results.
- Visually reviewed page captures and main sections of the three current stories, the longer Lovesac case studies, Home Depot, and the blog article layouts.
- Checked the Work introduction, score grid, and expanded site menu at 320px; Chasing Birdies customization, clubhouse, and active course controls at 390px.
- Checked the three affected stories at 1440px; no horizontal overflow or palette label collisions observed.
- `python3 build.py --check` and `git diff --check` pass.

This review used desktop Chrome viewport emulation. Changes are local and have not been deployed. Review screenshots and measurement JSON are in `/tmp/portfolio-mobile-review/`.

## Routes

- `/`
- `/about.html`
- `/contact.html`
- `/404.html`
- `/work/ask-read.html`
- `/work/chasing-birdies.html`
- `/work/brock-purdy-13.html`
- `/work/lovesac-case-study.html`
- `/work/lovesac-case-study-2.html`
- `/work/lovesac-case-study-3.html`
- `/work/lovesac-case-study-4.html`
- `/work/lovesac-case-study-5.html`
- `/work/lovesac-case-study-6.html`
- `/work/walmart-genai.html`
- `/work/walmart-my-hiring-dashboard.html`
- `/work/thd-giftcards.html`
- `/work/lovesac-redesign.html`
- `/work/lovesac-sactionals.html`
- `/work/lovesac-support.html`
- `/work/lovesac-what-to-expect.html`
- `/blog/`
- `/blog/cultural-intelligence.html`
- `/blog/eat-your-own-dog-food.html`
- `/blog/pump-up-the-volume.html`
- `/blog/the-rejected-stone.html`
- `/blog/reports/walmart-pagespeed-report.html`
- `/blog/reports/homedepot-pagespeed-report.html`
- `/blog/reports/salesforce-pagespeed-report.html`
- `/blog/reports/workday-pagespeed-report.html`
- `/games/chasing-birdies/`
- `/games/chasing-birdies/players/`
- `/work/chasing-birdies-rig.html`
- `/work/chasing-birdies-rig-debug.html`
- `/work/`

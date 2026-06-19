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
├── favicon.svg                       # Heart favicon
├── sitemap.xml                       # All pages for search engine discovery
├── robots.txt                        # Crawl directives
├── CNAME                             # Custom domain for GitHub Pages
├── css/
│   └── style.css                     # All styles
├── js/
│   └── main.js                       # Scroll reveal, nav hide, hamburger menu, progress bar
├── images/
│   └── blog/                         # Blog post images
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

## Adding a case study

1. Copy an existing file from `work/` and rename it
2. Update the title, meta description, and Open Graph tags in `<head>`
3. Update content and cover image reference
4. Add the cover image to `images/`
5. Add a card to `index.html`
6. Add the URL to `sitemap.xml`
7. Push

## Adding a blog post

1. Copy an existing file from `blog/` and rename it
2. Update the title, meta description, and Open Graph tags in `<head>` (use `og:type` = `article`)
3. Update the content and hero image
4. Add a card to `blog/index.html`
5. Add the URL to `sitemap.xml`
6. Push

## SEO

Every page has:
- Unique `<meta name="description">` tag
- Open Graph tags (`og:title`, `og:description`, `og:url`, `og:type`, `og:image`)
- Twitter Card tags (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`)

`sitemap.xml` lists all pages and is referenced in `robots.txt`. Submit the sitemap to Google Search Console for faster indexing: `https://claudiaochoa.co/sitemap.xml`

## Infrastructure

- Hosted on **GitHub Pages**
- Custom domain configured via GoDaddy DNS → GitHub Pages A records
- TLS enforced via GitHub Pages
- Analytics via **Google Analytics 4** (`G-3G6X2P2669`)

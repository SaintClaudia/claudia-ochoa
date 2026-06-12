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
├── favicon.svg                       # heart favicon
├── CNAME                             # Custom domain for GitHub Pages
├── css/
│   └── style.css                     # All styles
├── js/
│   └── main.js                       # Scroll reveal, nav hide, hamburger menu, progress bar
├── images/
│   ├── Walmart_Spark.png.webp
│   ├── Walmart_GenAI.png.webp
│   ├── Walmart_MyHiring.png.webp
│   ├── Walmart_Me.png.webp
│   ├── Walmart_CarPlay.png.webp
│   ├── Walmart_Connect.png.webp
│   ├── HomeDepot_GiftCards.png.webp
│   └── THD_MilitaryDiscount.png.webp
└── work/
    ├── walmart-careers.html
    ├── walmart-genai.html
    ├── walmart-my-hiring-dashboard.html
    ├── walmart-mecampus-redesign.html
    ├── walmart-carplay.html
    ├── walmart-connect.html
    ├── thd-giftcards.html
    └── thd-militarydiscount.html
```

## Deploying changes

```bash
cd ~/Downloads/claudiaochoa
git add .
git commit -m "describe what changed"
git push
```

GitHub Pages deploys automatically. Changes are live within 1–2 minutes.

## Adding a case study

1. Copy an existing file from `work/` and rename it
2. Update the content and cover image reference
3. Add the cover image to `images/`
4. Add a card to `index.html`
5. Push

## Infrastructure

- Hosted on **GitHub Pages**
- Custom domain configured via GoDaddy DNS → GitHub Pages A records
- TLS enforced via GitHub Pages
- Analytics via **Google Analytics 4** (`G-3G6X2P2669`)

## Known todos

- [ ] Add contact section
- [ ] Blog page

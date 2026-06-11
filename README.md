# claudiaochoa.co

Portfolio site for Claudia Ochoa — UX Designer & AI Innovation specialist.

## Stack

Pure HTML + CSS + vanilla JS. No frameworks, no build step, no dependencies. Fast by default.

## Deploying to GitHub Pages

### 1. Create your GitHub repo

Go to github.com → New repository → name it exactly: `claudiaochoa.github.io`
(or any name if you'll use a custom domain)

### 2. Push this folder

```bash
cd /path/to/this/folder
git init
git add .
git commit -m "Initial portfolio launch"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/claudiaochoa.github.io.git
git push -u origin main
```

### 3. Enable GitHub Pages

- Go to your repo → Settings → Pages
- Source: Deploy from a branch → main → / (root)
- Save

Your site will be live at `https://YOUR_USERNAME.github.io` within a few minutes.

### 4. Add custom domain (claudiaochoa.co)

In GitHub Pages settings → Custom domain → enter `claudiaochoa.co` → Save.

This creates a `CNAME` file automatically. Then in GoDaddy DNS:

| Type  | Name | Value                    | TTL  |
|-------|------|--------------------------|------|
| A     | @    | 185.199.108.153          | 600  |
| A     | @    | 185.199.109.153          | 600  |
| A     | @    | 185.199.110.153          | 600  |
| A     | @    | 185.199.111.153          | 600  |
| CNAME | www  | YOUR_USERNAME.github.io. | 600  |

DNS can take up to 24 hours to propagate. Enable "Enforce HTTPS" in GitHub Pages settings after.

## Updating images

Right now images are loaded from the Squarespace CDN. To host them yourself:

1. Download each image from your Squarespace media library
2. Put them in an `images/` folder in this repo
3. Update the `src` paths in each HTML file to `../images/filename.png` (or `images/` from root)

## Structure

```
/
├── index.html          # Homepage — work grid
├── about.html          # About page
├── css/
│   └── style.css
├── js/
│   └── main.js
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

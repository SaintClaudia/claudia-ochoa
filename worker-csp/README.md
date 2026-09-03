# portfolio-csp-and-markdown

Cloudflare Worker that sits in front of claudiaochoa.co (GitHub Pages) to add
`Content-Security-Policy` and `Permissions-Policy` response headers, which
GitHub Pages can't set on its own. The other security headers
(`X-Frame-Options`, `Strict-Transport-Security`, `Referrer-Policy`,
`X-Content-Type-Options`) are already added separately via a Cloudflare
Transform Rule and are untouched by this worker.

The same worker also provides standards-based Markdown negotiation for AI
agents. HTML pages requested with `Accept: text/markdown` (or a preferred
`text/*` range) are converted to concise Markdown with YAML metadata and
preserved JSON-LD. Regular browser requests continue to receive HTML. Both
representations declare `Content-Signal: ai-train=no, search=yes,
ai-input=yes`, allowing AI search, citation, and agentic use while reserving
model-training rights.

HTML responses advertise their negotiated Markdown representation with
`rel="alternate"`. HTML and Markdown responses point agents to the site's
curated [`/llms.txt`](../llms.txt) guide with `rel="describedby"`.

## How it works

- Passes non-HTML responses straight through, unmodified.
- Converts HTML to Markdown only when the request explicitly prefers Markdown,
  adds `Vary: Accept`, and reports approximate original/Markdown token counts.
- For HTML responses, uses `HTMLRewriter` to add a fresh per-request
  `nonce="..."` attribute to every `<script>` tag, then sets
  `script-src 'self' 'nonce-...' <allowed CDNs>` — no `'unsafe-inline'`
  needed for scripts.
- `style-src` stays `'unsafe-inline'` (no nonce) because the site still has
  ~700 inline `style="..."` attributes; a nonce in the same directive would
  make browsers ignore `'unsafe-inline'` and break all of them. Converting
  those attributes to classes would let `style-src` drop `'unsafe-inline'`
  too, but that's a separate, much larger effort.
- `fetch(request)` (passing the original request object) re-enters the
  zone's routing and falls through to the real origin once this worker has
  a route on `claudiaochoa.co/*` — this is what avoids an infinite loop.
  Under `wrangler dev` there's no zone route to fall through to, so the dev
  build proxies explicitly to the live site instead (see `isLocalDev` in
  `src/index.js`).

## Local dev

```bash
npm install
npm run dev
```

Hits `http://localhost:8787` and proxies to the real `https://claudiaochoa.co`
for content, so you're testing the rewrite/header logic against real pages
without touching production.

Test Markdown negotiation locally with:

```bash
curl -H 'Accept: text/markdown' http://localhost:8787/
```

## Deploy

```bash
npm run deploy
```

`wrangler.toml` intentionally ships with **no route**. The first deploy only
publishes to the worker's own `*.workers.dev` subdomain — it does not affect
site traffic. Adding

```toml
routes = [{ pattern = "claudiaochoa.co/*", zone_name = "claudiaochoa.co" }]
```

to `wrangler.toml` and redeploying is what actually puts this worker in
front of live traffic. Do that only after testing `npm run dev` against the
pages you care about.

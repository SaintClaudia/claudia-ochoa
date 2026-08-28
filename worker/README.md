# portfolio-poll

Cloudflare Worker + KV backing the "before/after" polls on claudiaochoa.co case
studies. One `poll_id` per poll, each with choices `before` / `after`. Currently
live:

- `lovesac-redesign` — on `work/lovesac-case-study.html`
- `lovesac-desktop-nav`, `lovesac-accessibility-audio`, `lovesac-credit-card` —
  on `work/lovesac-case-study-2.html`

Reuse the same worker for future case study polls by giving each a new
`poll_id`.

## One-time setup

```bash
cd worker
npm install
npx wrangler login

# Create the KV namespace that stores vote counts, then paste the
# returned id into wrangler.toml (REPLACE_WITH_KV_NAMESPACE_ID)
npx wrangler kv namespace create POLL_KV
```

## Local dev

```bash
npm run dev
```

## Deploy

```bash
npm run deploy
```

Note the deployed URL (e.g. `https://portfolio-poll.<your-subdomain>.workers.dev`)
— it goes into `POLL_WORKER_URL` in each case study page's poll script.

## API

- `GET /poll/:id` → `{ "before": 12, "after": 34 }`
- `POST /poll/:id` with JSON body `{ "choice": "before" | "after" }` → same
  shape, after incrementing. One vote per choice per visitor is enforced
  server-side by IP+UA fingerprint (30-day TTL), in addition to the
  localStorage lock on the page itself.

CORS is locked to `https://claudiaochoa.co` (plus `localhost` for local
preview).

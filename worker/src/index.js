const ALLOWED_ORIGINS = new Set([
  "https://claudiaochoa.co",
  "http://localhost:8000",
  "http://127.0.0.1:8000",
]);

const CHOICE_RE = /^[a-z0-9-]{1,32}$/;
const POLL_ID_RE = /^[a-z0-9-]{1,64}$/;
const VOTE_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.has(origin) ? origin : "https://claudiaochoa.co";
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
}

function json(data, origin, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
  });
}

async function hashFingerprint(request, env) {
  const ip = request.headers.get("CF-Connecting-IP") || "";
  const ua = request.headers.get("User-Agent") || "";
  const data = new TextEncoder().encode(`${ip}::${ua}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "";

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders(origin) });
    }

    const match = url.pathname.match(/^\/poll\/([^/]+)\/?$/);
    if (!match) {
      return json({ error: "not found" }, origin, 404);
    }
    const pollId = match[1];
    if (!POLL_ID_RE.test(pollId)) {
      return json({ error: "invalid poll id" }, origin, 400);
    }
    const key = `poll:${pollId}`;

    if (request.method === "GET") {
      const stored = await env.POLL_KV.get(key, "json");
      return json(stored || {}, origin);
    }

    if (request.method === "POST") {
      let body;
      try {
        body = await request.json();
      } catch {
        return json({ error: "invalid body" }, origin, 400);
      }
      const choice = body && body.choice;
      if (typeof choice !== "string" || !CHOICE_RE.test(choice)) {
        return json({ error: "invalid choice" }, origin, 400);
      }

      const fingerprint = await hashFingerprint(request, env);
      const voteKey = `voted:${pollId}:${fingerprint}`;
      const alreadyVoted = await env.POLL_KV.get(voteKey);
      if (alreadyVoted) {
        const stored = await env.POLL_KV.get(key, "json");
        return json(stored || {}, origin, 200);
      }

      const stored = (await env.POLL_KV.get(key, "json")) || {};
      stored[choice] = (stored[choice] || 0) + 1;
      await env.POLL_KV.put(key, JSON.stringify(stored));
      await env.POLL_KV.put(voteKey, "1", { expirationTtl: VOTE_TTL_SECONDS });

      return json(stored, origin);
    }

    return json({ error: "method not allowed" }, origin, 405);
  },
};

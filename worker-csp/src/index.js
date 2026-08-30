function randomNonce() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

function buildCSP(nonce) {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' https://www.googletagmanager.com https://www.google-analytics.com https://unpkg.com https://portfolio-poll.claudiajochoa.workers.dev`,
    // No nonce here: a nonce- or hash-source in a directive makes browsers
    // ignore 'unsafe-inline' in that same directive, which would break every
    // style="..." attribute on the site. style-src stays unsafe-inline-only
    // until those attributes are converted to classes.
    `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com`,
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' https://*.tile.openstreetmap.org https://www.google-analytics.com https://www.googletagmanager.com",
    "connect-src 'self' https://api.web3forms.com https://portfolio-poll.claudiajochoa.workers.dev https://www.google-analytics.com https://www.googletagmanager.com",
    "frame-src https://open.spotify.com https://www.tiktok.com",
    "frame-ancestors 'self'",
    "base-uri 'self'",
    "form-action 'self' https://api.web3forms.com",
  ].join("; ");
}

const PERMISSIONS_POLICY =
  "geolocation=(), microphone=(), camera=(), payment=(), usb=(), interest-cohort=()";

class NonceInjector {
  constructor(nonce) {
    this.nonce = nonce;
  }
  element(element) {
    element.setAttribute("nonce", this.nonce);
  }
}

export default {
  async fetch(request) {
    // fetch(request) re-enters the zone's routing and falls through to the
    // real origin once this worker has a production route on claudiaochoa.co.
    // Under `wrangler dev` there's no zone route to fall through to, so
    // proxy explicitly to the live site for local testing only.
    const url = new URL(request.url);
    const isLocalDev = url.hostname === "localhost" || url.hostname === "127.0.0.1";
    const upstreamRequest = isLocalDev
      ? new Request("https://claudiaochoa.co" + url.pathname + url.search, request)
      : request;

    const response = await fetch(upstreamRequest);

    const contentType = response.headers.get("Content-Type") || "";
    if (!contentType.includes("text/html")) {
      return response;
    }

    const nonce = randomNonce();
    // Only <script> gets a nonce; see the style-src comment in buildCSP for why
    // <style> doesn't.
    const rewriter = new HTMLRewriter().on("script", new NonceInjector(nonce));

    const rewritten = rewriter.transform(response);
    const newResponse = new Response(rewritten.body, rewritten);
    newResponse.headers.set("Content-Security-Policy", buildCSP(nonce));
    newResponse.headers.set("Permissions-Policy", PERMISSIONS_POLICY);
    return newResponse;
  },
};

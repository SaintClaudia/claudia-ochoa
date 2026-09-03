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
    // 'wasm-unsafe-eval' (not the broader 'unsafe-eval') is required for
    // Google's vector map renderer, which compiles WebAssembly for tile
    // decoding. 'strict-dynamic' lets browsers that honor it ignore the host
    // allowlist (host allowlists can be bypassed via JSONP-style endpoints on
    // those domains) and trust only scripts the nonce'd scripts themselves
    // load; 'unsafe-inline' is a no-op fallback for browsers too old to
    // support nonces (they ignore it once a nonce is present).
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-inline' 'wasm-unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://maps.googleapis.com https://portfolio-poll.claudiajochoa.workers.dev`,
    // No nonce here: a nonce- or hash-source in a directive makes browsers
    // ignore 'unsafe-inline' in that same directive, which would break every
    // style="..." attribute on the site. style-src stays unsafe-inline-only
    // until those attributes are converted to classes.
    `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
    "font-src 'self' https://fonts.gstatic.com",
    // data: is for the map SDK's own inlined control icons (zoom, pan), not
    // user content.
    "img-src 'self' data: https://maps.googleapis.com https://maps.gstatic.com https://www.google-analytics.com https://www.googletagmanager.com",
    "connect-src 'self' https://api.web3forms.com https://maps.googleapis.com https://www.gstatic.com https://portfolio-poll.claudiajochoa.workers.dev https://www.google-analytics.com https://www.googletagmanager.com",
    // Google's vector map rendering spawns Web Workers from blob: URLs for
    // tile decoding; without this they fall back to script-src, which has
    // no blob: source and silently blocks them.
    "worker-src 'self' blob:",
    "frame-src https://open.spotify.com https://www.tiktok.com",
    "frame-ancestors 'self'",
    "base-uri 'self'",
    "form-action 'self' https://api.web3forms.com",
    "require-trusted-types-for 'script'",
    // `case-study-html`, `site-analytics`, and `lovesac-store-finder` are
    // this site's own policies. `goog#html` is what the Maps JS API
    // actually creates internally when loaded via a raw script tag
    // (confirmed by live console testing — public docs describe
    // `google-maps-api#html`, used by the separate @googlemaps/js-api-loader
    // npm package, which this site doesn't use; kept below in case any Maps
    // feature does end up using it). `'allow-duplicates'` is required
    // because Maps' library creates `goog#html` more than once per page
    // load. Verified clean via Report-Only testing (headless page loads
    // plus manual click-through of the store finder, Maps, room-fit
    // calculator, and product filters) before switching this to enforcing.
    "trusted-types case-study-html site-analytics lovesac-store-finder goog#html google-maps-api-loader google-maps-api#html lit-html 'allow-duplicates'",
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
    // Isolates the top-level browsing context from cross-origin popups/openers
    // (the site opens no windows via window.open, so this has no UX impact).
    newResponse.headers.set("Cross-Origin-Opener-Policy", "same-origin");
    return newResponse;
  },
};

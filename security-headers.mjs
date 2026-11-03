/**
 * Shared security headers for both the Astro middleware (SSR responses) and
 * `server.mjs` (prerendered HTML, static assets, API responses).
 *
 * Kept at the project root because the production Docker image copies
 * `server.mjs` but not `src/`, so both entry points must be able to import it.
 */

const DEFAULT_CMS_ORIGIN = "https://exam.tif.uin-suska.ac.id";
const UIN_WILDCARD_ORIGIN = "https://*.uin-suska.ac.id";

/** Headers that never depend on the request or the environment. */
export const BASE_SECURITY_HEADERS = Object.freeze({
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "SAMEORIGIN",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy":
    "camera=(), microphone=(), geolocation=(), browsing-topics=(), payment=(), usb=(), serial=(), hid=()",
  "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
  "Cross-Origin-Resource-Policy": "same-origin",
  "X-Permitted-Cross-Domain-Policies": "none",
  "X-DNS-Prefetch-Control": "off",
});

function originOf(value) {
  if (!value || typeof value !== "string") return null;
  try {
    const url = new URL(value.trim());
    if (!["http:", "https:"].includes(url.protocol)) return null;
    return url.origin;
  } catch {
    return null;
  }
}

/**
 * Image/font origins allowed by the CSP.
 *
 * Derived from the configured CMS URLs instead of allowing every HTTPS host.
 * The `*.uin-suska.ac.id` wildcard keeps assets from other university services
 * working when editors paste an absolute URL into Directus.
 */
export function allowedAssetOrigins(env = {}) {
  const origins = new Set([DEFAULT_CMS_ORIGIN, UIN_WILDCARD_ORIGIN]);
  for (const key of ["PUBLIC_BASE_ASSETS_URL", "BASE_API_URL"]) {
    const origin = originOf(env?.[key]);
    if (origin) origins.add(origin);
  }
  return [...origins];
}

/**
 * Builds the production Content Security Policy.
 *
 * Notes:
 * - No `'unsafe-inline'` or `'unsafe-eval'`: the build emits every script as
 *   an external module (`vite.build.assetsInlineLimit: 0`) and every
 *   stylesheet as a file (`build.inlineStylesheets: "never"`).
 * - `script-src-attr 'none'` blocks inline event handlers (`onclick=`, ...),
 *   which are the most common XSS sink.
 * - Fonts are self-hosted, so Google Fonts origins are no longer needed.
 *
 * If a future component needs an inline script, prefer moving it to
 * `src/scripts/*.js`. Astro CSP hashes are not used because view transitions
 * (`<ClientRouter />`) are unsupported with hash-based CSP.
 */
export function buildContentSecurityPolicy({ env = {}, dev = false } = {}) {
  const assetOrigins = allowedAssetOrigins(env);

  if (dev) {
    // Vite injects inline styles/scripts and needs a websocket for HMR, so the
    // dev policy is intentionally looser. Production never uses this branch.
    return [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: " + assetOrigins.join(" "),
      "font-src 'self' data:",
      "connect-src 'self' ws: wss:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
    ].join("; ");
  }

  const directives = [
    "default-src 'self'",
    "script-src 'self'",
    "script-src-attr 'none'",
    "style-src 'self'",
    "style-src-attr 'none'",
    "img-src 'self' data: blob: " + assetOrigins.join(" "),
    "font-src 'self' data:",
    "connect-src 'self'",
    "media-src 'self'",
    "frame-src 'self' https://www.google.com https://maps.google.com https://www.youtube.com https://youtube.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
    "manifest-src 'self'",
    "worker-src 'self'",
    "upgrade-insecure-requests",
  ];

  return directives.join("; ");
}

/** HSTS is only meaningful on HTTPS responses. */
export function hstsHeader(env = {}) {
  const maxAge = Number(env?.HSTS_MAX_AGE ?? 31536000);
  if (!Number.isFinite(maxAge) || maxAge <= 0) return null;
  return `max-age=${Math.floor(maxAge)}`;
}

/**
 * Returns the security headers for a response.
 *
 * @param {{ env?: Record<string, string | undefined>, dev?: boolean, secure?: boolean }} [options]
 * @returns {Record<string, string>}
 */
export function securityHeaders({ env = {}, dev = false, secure = false } = {}) {
  const headers = { ...BASE_SECURITY_HEADERS };
  const csp = buildContentSecurityPolicy({ env, dev });

  if (csp) headers["Content-Security-Policy"] = csp;

  if (secure) {
    const hsts = hstsHeader(env);
    if (hsts) headers["Strict-Transport-Security"] = hsts;
  }

  return headers;
}

/** Applies the headers to an Astro `Response` object. */
export function applySecurityHeaders(response, options = {}) {
  if (!response || !(response instanceof Response)) return response;

  const dev = options.dev ?? false;
  for (const [name, value] of Object.entries(securityHeaders({ ...options, dev }))) {
    response.headers.set(name, value);
  }

  return response;
}

/** True when the request reached us over HTTPS (directly or via a proxy). */
export function isSecureRequest(request, { trustProxy = false } = {}) {
  const url = request instanceof Request ? request.url : String(request?.url || "");
  try {
    if (new URL(url).protocol === "https:") return true;
  } catch {
    // Ignore malformed URLs; fall through to the headers below.
  }

  const headers = request?.headers;
  if (!headers) return false;

  if (trustProxy) {
    const forwarded = String(headers.get?.("x-forwarded-proto") || "").split(",")[0].trim();
    if (forwarded.toLowerCase() === "https") return true;
  }

  return false;
}

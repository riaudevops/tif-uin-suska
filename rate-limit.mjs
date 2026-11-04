/**
 * In-memory rate limiting for the SSR/API surface.
 *
 * The site runs as a single Node/Bun process behind a reverse proxy, so a
 * per-process fixed-window counter is enough to blunt scraping, search-index
 * hammering and bot floods without adding a Redis dependency.
 *
 * Configuration (environment variables):
 *   RATE_LIMIT_ENABLED   "false" disables the limiter (default: enabled)
 *   RATE_LIMIT_WINDOW_MS window length in ms (default: 60000)
 *   RATE_LIMIT_MAX       requests per window for normal page requests (default: 120)
 *   RATE_LIMIT_API_MAX   requests per window for /api/* (default: 30)
 *   RATE_LIMIT_MAX_KEYS  safety cap for the bucket map (default: 20000)
 *   TRUST_PROXY          "false" ignores X-Forwarded-For (default: trusted)
 *
 * Limits are intentionally generous: a normal visitor loads ~10-20 documents
 * per minute, while a scraper or a bot loop hits the cap quickly.
 */

const DEFAULT_WINDOW_MS = 60_000;
const DEFAULT_MAX = 120;
const DEFAULT_API_MAX = 30;
const DEFAULT_MAX_KEYS = 20_000;

/** Paths that never consume the document budget. */
const SKIP_PREFIXES = ["/_astro/", "/fonts/", "/logo/", "/landing-pages/"];

const SKIP_RE =
  /\.(webp|avif|png|jpe?g|gif|svg|ico|bmp|woff2?|ttf|otf|eot|css|js|map|txt|xml|json|pdf)$/i;

function positiveInt(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
}

export function rateLimitConfig(env = {}) {
  return {
    enabled: !/^(0|false|no)$/i.test(String(env.RATE_LIMIT_ENABLED ?? "true")),
    windowMs: positiveInt(env.RATE_LIMIT_WINDOW_MS, DEFAULT_WINDOW_MS),
    max: positiveInt(env.RATE_LIMIT_MAX, DEFAULT_MAX),
    apiMax: positiveInt(env.RATE_LIMIT_API_MAX, DEFAULT_API_MAX),
    maxKeys: positiveInt(env.RATE_LIMIT_MAX_KEYS, DEFAULT_MAX_KEYS),
    trustProxy: !/^(0|false|no)$/i.test(String(env.TRUST_PROXY ?? "true")),
    hops: positiveInt(env.TRUST_PROXY_HOPS, 1),
  };
}

/** Strips a port / brackets from an IP value; rejects malformed input. */
function normalizeIp(value) {
  let ip = String(value || "").trim();
  if (!ip) return null;

  if (ip.startsWith("[")) {
    const end = ip.indexOf("]");
    if (end !== -1) ip = ip.slice(1, end);
  } else if (/^\d{1,3}(?:\.\d{1,3}){3}:\d+$/.test(ip)) {
    ip = ip.slice(0, ip.lastIndexOf(":"));
  }

  return /^[0-9a-fA-F:.]{2,45}$/.test(ip) ? ip : null;
}

/**
 * Client IP used for rate limiting.
 *
 * `X-Forwarded-For` is client-controlled: sending
 * `X-Forwarded-For: <random>` to a proxy that appends the real address produces
 * `<random>, <real>`. Reading the *leftmost* entry would therefore let anyone
 * rotate the header and bypass the limiter entirely, so the rightmost entry
 * (written by the closest trusted proxy) is used instead.
 *
 * `TRUST_PROXY_HOPS` walks further left when several trusted proxies sit in
 * front of the app (e.g. Cloudflare + nginx + app = 2 or 3).
 */
export function clientIp(req, { trustProxy = true, hops = 1 } = {}) {
  if (trustProxy) {
    const chain = String(req.headers["x-forwarded-for"] || "")
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean)
      .slice(-10); // ignore absurdly long header chains

    if (chain.length > 0) {
      const trustedHops = Math.max(1, Math.min(hops, chain.length));
      const candidate = normalizeIp(chain[chain.length - trustedHops]);
      if (candidate) return candidate;
    }

    const realIp = normalizeIp(req.headers["x-real-ip"]);
    if (realIp) return realIp;
  }

  return normalizeIp(req.socket?.remoteAddress) || "unknown";
}

/** Endpoints that build data per request and get the stricter budget. */
function isDataEndpoint(pathname) {
  return pathname.startsWith("/api/") || pathname === "/sitemap.xml";
}

function isSkippable(pathname) {
  // Data endpoints always count, even when they look like static files.
  if (isDataEndpoint(pathname)) return false;
  if (SKIP_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return true;
  return SKIP_RE.test(pathname);
}

/**
 * Creates a limiter instance. Returns `{ check(req, pathname) }` where the
 * result is either `null` (allowed) or `{ retryAfter, limit, remaining }`.
 */
export function createRateLimiter(env = {}) {
  const config = rateLimitConfig(env);
  /** @type {Map<string, { count: number, resetAt: number }>} */
  const buckets = new Map();
  let lastSweep = Date.now();

  function sweep(now) {
    if (now - lastSweep < config.windowMs) return;
    lastSweep = now;
    for (const [key, bucket] of buckets) {
      if (bucket.resetAt <= now) buckets.delete(key);
    }
    // Hard cap: drop the oldest entries rather than growing without bound.
    if (buckets.size > config.maxKeys) {
      const overflow = buckets.size - config.maxKeys;
      let removed = 0;
      for (const key of buckets.keys()) {
        buckets.delete(key);
        if (++removed >= overflow) break;
      }
    }
  }

  function check(req, pathname) {
    if (!config.enabled || isSkippable(pathname)) return null;

    const now = Date.now();
    sweep(now);

    const isApi = isDataEndpoint(pathname);
    const limit = isApi ? config.apiMax : config.max;
    const ip = clientIp(req, { trustProxy: config.trustProxy, hops: config.hops });
    const key = `${isApi ? "api" : "page"}:${ip}`;

    let bucket = buckets.get(key);
    if (!bucket || bucket.resetAt <= now) {
      // Enforce the cap on every insert, not only during the periodic sweep:
      // within a single window the map could otherwise grow without bound
      // (each unique client key costs an entry).
      if (buckets.size >= config.maxKeys) {
        const oldest = buckets.keys().next();
        if (!oldest.done) buckets.delete(oldest.value);
      }
      bucket = { count: 0, resetAt: now + config.windowMs };
      buckets.set(key, bucket);
    }

    bucket.count += 1;

    if (bucket.count > limit) {
      return {
        retryAfter: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
        limit,
        remaining: 0,
      };
    }

    return null;
  }

  return { check, config, stats: () => ({ size: buckets.size, maxKeys: config.maxKeys }) };
}

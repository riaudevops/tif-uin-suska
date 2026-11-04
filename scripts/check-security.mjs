#!/usr/bin/env bun
/**
 * Security regression check for the built site.
 *
 * Verifies the invariants Paket E introduced:
 *   1. No inline `<script>` blocks (JSON-LD excluded) in emitted HTML.
 *   2. No inline `on*=` event handlers and no inline `style=` attributes.
 *   3. No `unsafe-eval` anywhere in build output.
 *   4. Security headers are present on prerendered and SSR pages, and HSTS is
 *      only sent over HTTPS.
 *   5. Rate limiting returns 429 with `Retry-After` on API and page floods.
 *
 * Usage: `bun run security:check` (requires `bun run build` first).
 */

import fs from "node:fs";
import path from "node:path";
import net from "node:net";
import { spawn } from "node:child_process";
import { createRateLimiter, clientIp } from "../rate-limit.mjs";

const ROOT = process.cwd();
const CLIENT_DIR = path.join(ROOT, "dist", "client");
const PORT = Number(process.env.SECURITY_CHECK_PORT || 4599);
let BASE = `http://127.0.0.1:${PORT}`;

const failures = [];
function fail(message) {
  failures.push(message);
  console.error(`✖ ${message}`);
}
function pass(message) {
  console.log(`✔ ${message}`);
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else files.push(full);
  }
  return files;
}

// ---------------------------------------------------------------- static scan
if (!fs.existsSync(CLIENT_DIR)) {
  console.error("dist/client not found. Run `bun run build` first.");
  process.exit(1);
}

const htmlFiles = walk(CLIENT_DIR).filter((file) => file.endsWith(".html"));
if (htmlFiles.length === 0) fail("no prerendered HTML files found");

const INLINE_SCRIPT_RE = /<script(?![^>]*\bsrc=)(?![^>]*application\/ld\+json)[^>]*>/gi;
const EVENT_HANDLER_RE = /\son[a-z]+\s*=\s*"/i;
const STYLE_ATTR_RE = /\sstyle\s*=\s*"/i;

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  const rel = path.relative(CLIENT_DIR, file);

  const inlineScripts = html.match(INLINE_SCRIPT_RE) || [];
  if (inlineScripts.length > 0) {
    fail(`${rel}: ${inlineScripts.length} inline <script> block(s)`);
  }
  if (EVENT_HANDLER_RE.test(html)) fail(`${rel}: inline event handler attribute`);
  if (STYLE_ATTR_RE.test(html)) fail(`${rel}: inline style attribute`);
}
if (failures.length === 0) pass(`${htmlFiles.length} HTML files have no inline script/handler/style`);

const jsFiles = walk(CLIENT_DIR).filter((file) => file.endsWith(".js"));
let evalHits = 0;
for (const file of jsFiles) {
  const code = fs.readFileSync(file, "utf8");
  if (/\beval\s*\(|new\s+Function\s*\(/.test(code)) {
    evalHits += 1;
    fail(`${path.relative(CLIENT_DIR, file)}: uses eval/new Function`);
  }
}
if (evalHits === 0) pass(`${jsFiles.length} client bundles contain no eval/new Function`);

// ------------------------------------------------------ rate limiter unit tests
{
  const req = (xff) => ({
    headers: { "x-forwarded-for": xff },
    socket: { remoteAddress: "9.9.9.9" },
  });

  if (clientIp(req("1.1.1.1, 2.2.2.2"), { trustProxy: true }) !== "2.2.2.2") {
    fail("clientIp does not prefer the proxy-written (rightmost) address");
  }
  if (clientIp(req("1.1.1.1"), { trustProxy: false }) !== "9.9.9.9") {
    fail("clientIp trusts X-Forwarded-For even when TRUST_PROXY is off");
  }

  // The bucket map must stay capped inside a single long window.
  const unit = createRateLimiter({
    RATE_LIMIT_WINDOW_MS: "3600000",
    RATE_LIMIT_MAX_KEYS: "50",
    RATE_LIMIT_MAX: "1000",
  });
  for (let i = 0; i < 2000; i += 1) {
    unit.check(req(`10.${(i >> 8) & 255}.${i & 255}.1`), "/news");
  }
  const { size, maxKeys } = unit.stats();
  if (size > maxKeys) fail(`rate limiter map grew to ${size} (cap ${maxKeys})`);

  if (failures.length === 0) pass("rate limiter IP parsing and memory cap verified");
}

// ---------------------------------------------------------------- runtime scan
const mainPort = await findFreePort(PORT);
BASE = `http://127.0.0.1:${mainPort}`;

const server = spawn(process.execPath, ["server.mjs"], {
  cwd: ROOT,
  env: {
    ...process.env,
    PORT: String(mainPort),
    HOST: "127.0.0.1",
    NODE_ENV: "production",
    RATE_LIMIT_MAX: "6",
    RATE_LIMIT_API_MAX: "3",
  },
  stdio: ["ignore", "pipe", "pipe"],
});

const logs = [];
server.stdout.on("data", (chunk) => logs.push(String(chunk)));
server.stderr.on("data", (chunk) => logs.push(String(chunk)));

async function waitForServer() {
  for (let i = 0; i < 60; i += 1) {
    try {
      const res = await fetch(`${BASE}/`);
      if (res.status < 500) return;
    } catch {
      // Not ready yet.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`server did not start:\n${logs.join("")}`);
}

/** Fails when the CSP falls back to an unsafe source or a stale origin. */
function assertStrictCsp(csp, label) {
  if (!csp) return;
  if (/unsafe-eval/.test(csp)) fail(`${label}: CSP allows unsafe-eval`);
  if (/script-src[^;]*'unsafe-inline'/.test(csp)) fail(`${label}: CSP allows inline scripts`);
  if (/style-src[^;]*'unsafe-inline'/.test(csp)) fail(`${label}: CSP allows inline styles`);
  if (!/script-src-attr 'none'/.test(csp)) fail(`${label}: CSP missing script-src-attr 'none'`);
  if (!/style-src-attr 'none'/.test(csp)) fail(`${label}: CSP missing style-src-attr 'none'`);
  if (/fonts\.googleapis|fonts\.gstatic|cloudflareinsights/.test(csp)) {
    fail(`${label}: CSP references third-party origins that are no longer used`);
  }
  if (/img-src[^;]*\shttps:(\s|;|$)/.test(csp)) fail(`${label}: img-src allows every HTTPS host`);
  // On plain HTTP this directive rewrites same-origin assets to https:// and
  // breaks the page (e.g. a staging deployment without TLS).
  if (/upgrade-insecure-requests/.test(csp)) {
    fail(`${label}: upgrade-insecure-requests sent over plain HTTP`);
  }
}

function assertHeader(response, name, label) {
  const value = response.headers.get(name);
  if (!value) fail(`${label}: missing ${name}`);
  return value;
}

try {
  await waitForServer();

  // Prerendered page: headers must come from server.mjs (middleware never runs).
  const prerendered = await fetch(`${BASE}/accreditation`);
  if (prerendered.status !== 200) fail(`/accreditation returned ${prerendered.status}`);
  const csp = assertHeader(prerendered, "content-security-policy", "/accreditation");
  assertStrictCsp(csp, "/accreditation");
  assertHeader(prerendered, "x-content-type-options", "/accreditation");
  assertHeader(prerendered, "referrer-policy", "/accreditation");
  assertHeader(prerendered, "permissions-policy", "/accreditation");
  if (prerendered.headers.get("strict-transport-security")) {
    fail("HSTS sent over plain HTTP");
  }

  // SSR page: middleware path.
  const ssr = await fetch(`${BASE}/news`);
  if (ssr.status !== 200) fail(`/news returned ${ssr.status}`);
  const ssrCsp = assertHeader(ssr, "content-security-policy", "/news");
  assertStrictCsp(ssrCsp, "/news");

  // HSTS only when the request arrived over HTTPS.
  const https = await fetch(`${BASE}/accreditation`, {
    headers: { "x-forwarded-proto": "https" },
  });
  const hsts = https.headers.get("strict-transport-security");
  if (!hsts || !/max-age=\d{6,}/.test(hsts)) fail("HSTS missing for HTTPS request");

  // Hashed assets keep their long cache policy.
  const assetUrl = fs
    .readdirSync(path.join(CLIENT_DIR, "_astro"))
    .find((name) => name.endsWith(".css"));
  if (assetUrl) {
    const asset = await fetch(`${BASE}/_astro/${assetUrl}`, { method: "HEAD" });
    const cache = asset.headers.get("cache-control") || "";
    if (!/immutable/.test(cache)) fail(`/_astro/${assetUrl} is not cached as immutable`);
  }

  // Rate limiting: pages.
  let pageLimited = null;
  for (let i = 0; i < 10; i += 1) {
    const res = await fetch(`${BASE}/news`, { headers: { "x-forwarded-for": "198.51.100.10" } });
    if (res.status === 429) {
      pageLimited = res;
      break;
    }
  }
  if (!pageLimited) fail("page rate limit never triggered");
  else {
    assertHeader(pageLimited, "retry-after", "429 page");
    const cache = pageLimited.headers.get("cache-control") || "";
    if (!/no-store/.test(cache)) fail("429 response is cacheable");
  }

  // Rate limiting: data endpoints.
  let apiLimited = null;
  for (let i = 0; i < 8; i += 1) {
    const res = await fetch(`${BASE}/api/search-index.json`, {
      headers: { "x-forwarded-for": "198.51.100.11" },
    });
    if (res.status === 429) {
      apiLimited = res;
      break;
    }
  }
  if (!apiLimited) fail("API rate limit never triggered");

  // Rate limiting must not be bypassable by rotating a client-supplied
  // X-Forwarded-For prefix: only the rightmost (proxy-written) entry counts.
  let spoofLimited = null;
  for (let i = 0; i < 12; i += 1) {
    const res = await fetch(`${BASE}/news`, {
      headers: { "x-forwarded-for": `10.0.0.${i}, 203.0.113.77` },
    });
    if (res.status === 429) {
      spoofLimited = res;
      break;
    }
  }
  if (!spoofLimited) {
    fail("rotating X-Forwarded-For bypasses the rate limiter");
  }

  // Traversal-shaped requests must not inherit the prerendered HTML cache.
  for (const probe of ["/news/../news", "/%2e%2e/%2e%2e/etc/passwd"]) {
    const res = await fetch(`${BASE}${probe}`, { redirect: "manual" });
    const cache = res.headers.get("cache-control") || "";
    if (/max-age=300/.test(cache)) {
      fail(`${probe}: traversal-shaped request received the prerendered cache policy`);
    }
  }

  // A different client is unaffected.
  const other = await fetch(`${BASE}/news`, { headers: { "x-forwarded-for": "198.51.100.12" } });
  if (other.status !== 200) fail(`rate limiter leaked across IPs (${other.status})`);

  // Write methods are rejected outright: there are no write endpoints.
  const post = await fetch(`${BASE}/news`, {
    method: "POST",
    body: "a=1",
    headers: { "x-forwarded-for": "198.51.100.20" },
  });
  if (post.status !== 405) fail(`POST /news returned ${post.status}, expected 405`);
  const allow = post.headers.get("allow") || "";
  if (!/GET/.test(allow)) fail("405 response does not advertise allowed methods");

  // Oversized bodies are rejected before rendering.
  const big = await fetch(`${BASE}/news`, {
    method: "POST",
    headers: { "content-type": "text/plain", "x-forwarded-for": "198.51.100.21" },
    body: "a".repeat(400_000),
  });
  if (big.status !== 405 && big.status !== 413) fail(`oversized POST returned ${big.status}`);

  // Static assets never consume the budget.
  for (let i = 0; i < 8; i += 1) {
    const res = await fetch(`${BASE}/fonts/figtree-latin.woff2`, { method: "HEAD" });
    if (res.status === 429) {
      fail("static font assets are rate limited");
      break;
    }
  }

  if (failures.length === 0) pass("runtime security headers, HSTS and rate limiting verified");
} finally {
  server.kill("SIGTERM");
}

if (failures.length > 0) {
  console.error(`\n${failures.length} security check(s) failed.`);
  process.exit(1);
}

/** Finds a free TCP port so a stale server can never masquerade as ours. */
function findFreePort(start) {
  return new Promise((resolve, reject) => {
    const attempt = (port) => {
      const probe = net.createServer();
      probe.once("error", () => {
        if (port > start + 25) reject(new Error("no free port found"));
        else attempt(port + 1);
      });
      probe.once("listening", () => {
        probe.close(() => resolve(port));
      });
      probe.listen(port, "127.0.0.1");
    };
    attempt(start);
  });
}

// ------------------------------------------------- runtime env vs build-time
// `import.meta.env` is inlined at build time. A container started with
// TRUST_PROXY=false must stop trusting X-Forwarded-Proto for SSR pages too,
// otherwise the middleware and server.mjs disagree on where the request came
// from (and HSTS is set from a spoofable header).
{
  const port = await findFreePort(PORT + 1);
  const base = `http://127.0.0.1:${port}`;
  const proc = spawn(process.execPath, ["server.mjs"], {
    cwd: ROOT,
    env: {
      ...process.env,
      PORT: String(port),
      HOST: "127.0.0.1",
      TRUST_PROXY: "false",
      RATE_LIMIT_ENABLED: "false",
    },
    stdio: ["ignore", "pipe", "pipe"],
  });

  try {
    let ready = false;
    for (let i = 0; i < 60; i += 1) {
      try {
        const res = await fetch(`${base}/news`);
        if (res.status < 500) {
          ready = true;
          break;
        }
      } catch {
        // Not ready yet.
      }
      await new Promise((resolve) => setTimeout(resolve, 250));
    }

    if (!ready) {
      fail("TRUST_PROXY=false test server did not start");
    } else {
      // Prerendered HTML is served by server.mjs, which sees the raw socket and
      // therefore can enforce TRUST_PROXY. (For SSR pages Astro's adapter
      // derives `request.url` from X-Forwarded-Proto, so the scheme is already
      // proxy-supplied there.)
      const res = await fetch(`${base}/accreditation`, {
        headers: { "x-forwarded-proto": "https" },
      });
      if (res.headers.get("strict-transport-security")) {
        fail("HSTS is sent while TRUST_PROXY=false (build-time env overrides runtime)");
      } else {
        pass("TRUST_PROXY=false is honoured at runtime for static responses");
      }
    }
  } finally {
    proc.kill("SIGTERM");
  }
}

if (failures.length > 0) {
  console.error(`\n${failures.length} security check(s) failed.`);
  process.exit(1);
}

console.log("\nAll security checks passed.");

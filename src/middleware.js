import { defineMiddleware } from "astro:middleware";
import { LEGACY_REDIRECTS } from "./lib/legacy-redirects.js";
import { applySecurityHeaders, isSecureRequest } from "../security-headers.mjs";

// Patterns for common vulnerability probes / bot scans
const BOT_PROBE_PATTERNS = [
  /\.(php|asp|aspx|jsp|cgi|pl|env|git|bak|sql|config|yml|yaml|ini)$/i,
  /^\/(wp-admin|wp-login|wp-content|wp-includes|xmlrpc|phpmyadmin|pma|admin\/|administrator|eval-stdin|telescope|_profiler|\.env|\.git)/i,
];

/**
 * Dev detection must not rely on `import.meta.env.DEV` alone: this repository
 * ships a `.env` with `NODE_ENV=production`, which flips `DEV` to `false` even
 * under `astro dev`. `MODE` stays "development" in that case.
 *
 * Astro explicitly does not support its CSP feature in dev, and Vite injects
 * inline styles for HMR, so the strict production CSP is skipped there.
 */
const DEV_MODE = import.meta.env?.MODE ?? "";
const IS_DEV =
  import.meta.env?.DEV === true ||
  DEV_MODE === "development" ||
  DEV_MODE === "dev";
const TRUST_PROXY = !/^(0|false|no)$/i.test(String(import.meta.env?.TRUST_PROXY ?? "true"));

/** Applies dev-aware security headers, including HSTS only on HTTPS. */
function harden(response, context) {
  const hardened = applySecurityHeaders(response, {
    env: import.meta.env,
    dev: IS_DEV,
    secure: isSecureRequest(context.request, { trustProxy: TRUST_PROXY }),
  });

  // API/data responses should never be cached as documents.
  if (hardened?.headers.get("content-type")?.includes("application/json")) {
    hardened.headers.set("X-Content-Type-Options", "nosniff");
    if (!hardened.headers.has("Cache-Control")) {
      hardened.headers.set("Cache-Control", "no-store");
    }
  }

  return hardened;
}

export const onRequest = defineMiddleware(async (context, next) => {
  const { url } = context;
  const pathname = url.pathname;

  // Intercept bot scanning probes (wp-login.php, xmlrpc, etc.) with a lightweight 404
  if (BOT_PROBE_PATTERNS.some((pattern) => pattern.test(pathname))) {
    return harden(
      new Response("Not Found", {
        status: 404,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "X-Robots-Tag": "noindex, nofollow",
        },
      }),
      context,
    );
  }

  let response;

  if (context.locals.locale) {
    response = await next();
    return harden(response, context);
  }

  const localePrefix = pathname.match(/^\/(en|id)(?:\/|$)/)?.[1];

  if (localePrefix) {
    context.locals.locale = localePrefix;
    context.locals.originalUrl = url.href;
    let basePath = pathname.replace(/^\/(?:en|id)/, "");
    if (!basePath.startsWith("/")) basePath = "/" + basePath;

    // Legacy paths keep working under a locale prefix (`/id/berita`), which the
    // static `redirects` config cannot handle because the prefix is stripped
    // by a rewrite rather than a redirect.
    const normalizedBase = basePath.replace(/\/+$/, "") || "/";
    const legacyTarget = LEGACY_REDIRECTS[normalizedBase];
    if (legacyTarget) {
      const localizedTarget =
        localePrefix === "id"
          ? legacyTarget === "/"
            ? "/id"
            : `/id${legacyTarget}`
          : legacyTarget;
      return harden(
        new Response(null, {
          status: 301,
          headers: { Location: `${localizedTarget}${url.search}` },
        }),
        context,
      );
    }

    response = await context.rewrite(new URL(`${basePath}${url.search}`, url.origin));
  } else {
    context.locals.locale = "en";
    context.locals.originalUrl = url.href;
    response = await next();
  }

  return harden(response, context);
});

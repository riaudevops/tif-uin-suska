import { defineMiddleware } from "astro:middleware";

// Patterns for common vulnerability probes / bot scans
const BOT_PROBE_PATTERNS = [
  /\.(php|asp|aspx|jsp|cgi|pl|env|git|bak|sql|config|yml|yaml|ini)$/i,
  /^\/(wp-admin|wp-login|wp-content|wp-includes|xmlrpc|phpmyadmin|pma|admin\/|administrator|eval-stdin|telescope|_profiler|\.env|\.git)/i,
];

// Content Security Policy directive
const CSP_DIRECTIVES = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://static.cloudflareinsights.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https: http:",
  "font-src 'self' data: https://fonts.gstatic.com",
  "connect-src 'self' https://exam.tif.uin-suska.ac.id https://*.uin-suska.ac.id https://cloudflareinsights.com",
  "frame-src 'self' https://www.google.com https://maps.google.com https://www.youtube.com https://youtube.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join("; ");

function applySecurityHeaders(response) {
  if (!response || !(response instanceof Response)) return response;

  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), browsing-topics=(), payment=()"
  );
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  response.headers.set("Content-Security-Policy", CSP_DIRECTIVES);

  return response;
}

export const onRequest = defineMiddleware(async (context, next) => {
  const { url } = context;
  const pathname = url.pathname;

  // Intercept bot scanning probes (wp-login.php, xmlrpc, etc.) with a lightweight 404
  if (BOT_PROBE_PATTERNS.some((pattern) => pattern.test(pathname))) {
    return new Response("Not Found", {
      status: 404,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  }

  let response;

  if (context.locals.locale) {
    response = await next();
    return applySecurityHeaders(response);
  }

  const localePrefix = pathname.match(/^\/(en|id)(?:\/|$)/)?.[1];

  if (localePrefix) {
    context.locals.locale = localePrefix;
    context.locals.originalUrl = url.href;
    let basePath = pathname.replace(/^\/(?:en|id)/, "");
    if (!basePath.startsWith("/")) basePath = "/" + basePath;
    response = await context.rewrite(new URL(`${basePath}${url.search}`, url.origin));
  } else {
    context.locals.locale = "en";
    context.locals.originalUrl = url.href;
    response = await next();
  }

  return applySecurityHeaders(response);
});

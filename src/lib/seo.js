/**
 * Helpers for canonical URLs, language alternates, and social images.
 *
 * The i18n strategy is:
 *   - English (default locale) has **no** prefix: `/news`
 *   - Indonesian is always prefixed: `/id/news`
 *
 * These helpers accept a "locale-less" path (optionally with a query string)
 * and produce absolute URLs for a given language.
 */

export const DEFAULT_SITE = "https://tif.uin-suska.ac.id";
export const FALLBACK_OG_IMAGE = "/landing-pages/gedung-faste.webp";

/** Matches a leading `/en` or `/id` segment (but not `/identity`). */
const LOCALE_PREFIX_RE = /^\/(?:en|id)(?=\/|$)/;

/**
 * Normalizes a pathname: ensures a single leading slash and no trailing slash.
 * The root stays `/`.
 */
export function normalizePathname(pathname) {
  let path = String(pathname || "/").trim();
  if (!path.startsWith("/")) path = `/${path}`;
  path = path.replace(/\/{2,}/g, "/");
  if (path.length > 1) path = path.replace(/\/+$/, "");
  return path || "/";
}

/**
 * Splits a path+query into a locale-less path and its query string.
 * `/id/news?page=2` -> { path: "/news", query: "?page=2" }
 */
export function splitLocale(pathWithQuery) {
  const raw = String(pathWithQuery || "/");
  const queryIndex = raw.indexOf("?");
  const rawPath = queryIndex === -1 ? raw : raw.slice(0, queryIndex);
  const query = queryIndex === -1 ? "" : raw.slice(queryIndex);

  const stripped = rawPath.replace(LOCALE_PREFIX_RE, "") || "/";
  return { path: normalizePathname(stripped), query };
}

/**
 * Builds an absolute URL for a locale-less path in the given language.
 */
export function localeUrl(pathWithQuery, lang, siteUrl = DEFAULT_SITE) {
  const base = String(siteUrl || DEFAULT_SITE).replace(/\/+$/, "");
  const { path, query } = splitLocale(pathWithQuery);
  const prefix = lang === "id" ? "/id" : "";
  const pathname = path === "/" ? prefix || "/" : `${prefix}${path}`;

  return new URL(`${pathname}${query}`, base).href;
}

/**
 * Returns absolute `en` and `id` URLs for the same locale-less path.
 */
export function languageAlternates(pathWithQuery, siteUrl = DEFAULT_SITE) {
  return {
    en: localeUrl(pathWithQuery, "en", siteUrl),
    id: localeUrl(pathWithQuery, "id", siteUrl),
  };
}

/**
 * Removes common tracking parameters so they never leak into canonical URLs.
 */
const TRACKING_PARAM_RE = /^(utm_|fbclid$|gclid$|msclkid$|yclid$|_ga$)/i;

export function stripTrackingParams(search) {
  const raw = String(search || "");
  if (!raw || raw === "?") return "";

  const params = new URLSearchParams(raw);
  let changed = false;

  for (const key of [...params.keys()]) {
    if (TRACKING_PARAM_RE.test(key)) {
      params.delete(key);
      changed = true;
    }
  }

  if (!changed) return raw;
  const cleaned = params.toString();
  return cleaned ? `?${cleaned}` : "";
}

/**
 * Resolves an image reference from props or the CMS into an absolute, usable URL.
 *
 * Handles:
 *   - null / empty / the literal Directus placeholder `"default"`
 *   - absolute http(s) URLs
 *   - relative paths (`/landing-pages/gedung.webp`)
 *   - legacy `http://localhost/...` values stored in old CMS rows
 */
export function resolveImageUrl(image, siteUrl = DEFAULT_SITE, fallback = FALLBACK_OG_IMAGE) {
  const base = String(siteUrl || DEFAULT_SITE).replace(/\/+$/, "");
  const raw = typeof image === "string" ? image.trim() : "";

  let candidate = raw && raw.toLowerCase() !== "default" ? raw : fallback;

  if (/^https?:\/\//i.test(candidate)) {
    try {
      const parsed = new URL(candidate);
      const host = parsed.hostname.toLowerCase();
      if (host === "localhost" || host === "127.0.0.1" || host === "0.0.0.0" || host === "[::1]") {
        candidate = fallback;
      } else {
        return parsed.href;
      }
    } catch {
      candidate = fallback;
    }
  }

  return new URL(candidate.startsWith("/") ? candidate : `/${candidate}`, base).href;
}

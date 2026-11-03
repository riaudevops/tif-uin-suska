/**
 * Helpers for values coming from the CMS (Directus) before they reach `href`
 * or `src` attributes.
 *
 * Editors can paste arbitrary strings; rendering them unvalidated in an `href`
 * enables `javascript:` URL XSS even when the rest of the page is safe.
 */

const SAFE_URL_PROTOCOLS = new Set(["http:", "https:", "mailto:", "tel:"]);

/**
 * Returns a safe absolute URL or `fallback` (default `#`).
 *
 * Relative URLs are resolved against the site root so they stay internal.
 *
 * @param {unknown} value
 * @param {string} [fallback]
 * @returns {string}
 */
export function safeExternalUrl(value, fallback = "#") {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  if (!trimmed) return fallback;

  // Reject control characters that browsers strip (e.g. "java\nscript:").
  if (/[\u0000-\u001F\u007F]/.test(trimmed)) return fallback;

  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return trimmed;

  try {
    const url = new URL(trimmed);
    return SAFE_URL_PROTOCOLS.has(url.protocol) ? url.href : fallback;
  } catch {
    // Not an absolute URL: treat plausible bare domains as HTTPS.
    if (/^[a-z0-9.-]+\.[a-z]{2,}(?:[/?#].*)?$/i.test(trimmed)) {
      return `https://${trimmed}`;
    }
    return fallback;
  }
}

/**
 * Builds a `mailto:` link only when the address looks valid.
 *
 * @param {unknown} email
 * @param {string} [fallback]
 */
export function safeMailto(email, fallback = "#") {
  if (typeof email !== "string") return fallback;
  const trimmed = email.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)) return fallback;
  return `mailto:${trimmed}`;
}

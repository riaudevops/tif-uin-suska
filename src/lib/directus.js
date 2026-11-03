/**
 * Centralized Directus client for SSR data access.
 *
 * Why this exists:
 *   - Every page used to call `fetch()` directly, each with different headers,
 *     no timeout, and no consistent error handling.
 *   - Some collections return `FORBIDDEN` for the public role. Callers must be
 *     able to tell "CMS is not accessible" apart from "CMS has no entries", so
 *     the UI never invents content.
 *
 * Usage:
 *   const result = await getCollection("berita", { query: "&limit=3" });
 *   if (!result.ok) { ...handle error... }
 *   const items = result.data;
 */

import { API_ITEMS_URL } from "./cms.js";
import { fetchWithCache } from "./cachedFetch.js";

const DEFAULT_TTL_MS = 60 * 1000;
const DEFAULT_TIMEOUT_MS = 8000;

/** Server-side only. Never expose this through a `PUBLIC_` variable. */
export const DIRECTUS_TOKEN = import.meta.env?.DIRECTUS_TOKEN || "";

export const DIRECTUS_CONFIGURED = Boolean(
  String(import.meta.env?.BASE_API_URL || process.env?.BASE_API_URL || "").trim(),
);

export const DIRECTUS_AUTHENTICATED = Boolean(DIRECTUS_TOKEN);

function buildHeaders(extraHeaders = {}) {
  return {
    "Content-Type": "application/json",
    ...(DIRECTUS_TOKEN ? { Authorization: `Bearer ${DIRECTUS_TOKEN}` } : {}),
    ...extraHeaders,
  };
}

/**
 * Classifies a failed Directus response.
 *
 * @param {number} status
 * @param {string} [code] - Directus error `extensions.code`
 * @returns {"forbidden"|"not-found"|"unauthorized"|"server"|"http"}
 */
function classifyStatus(status, code) {
  if (code === "FORBIDDEN" || status === 403) return "forbidden";
  if (status === 401) return "unauthorized";
  if (status === 404 || code === "ROUTE_NOT_FOUND") return "not-found";
  if (status >= 500) return "server";
  return "http";
}

/**
 * Fetches a collection and never throws.
 *
 * @param {string} collection - e.g. "berita"
 * @param {object} [options]
 * @param {string} [options.query] - raw query string, e.g. "&limit=3&sort=-date"
 * @param {number} [options.ttlMs] - cache TTL (default 60s)
 * @param {number} [options.timeoutMs]
 * @param {object} [options.headers]
 * @returns {Promise<{
 *   ok: boolean,
 *   data: any[],
 *   meta: object|null,
 *   count: number,
 *   status: number,
 *   error: null | { kind: string, message: string, status: number }
 * }>}
 */
export async function getCollection(collection, options = {}) {
  const {
    query = "",
    ttlMs = DEFAULT_TTL_MS,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    headers = {},
  } = options;

  const url = `${API_ITEMS_URL}/${collection}${query ? (query.startsWith("?") || query.startsWith("&") ? query : `&${query}`) : ""}`;

  try {
    const json = await fetchWithCache(
      url,
      { headers: buildHeaders(headers), signal: AbortSignal.timeout(timeoutMs) },
      ttlMs,
    );

    const data = Array.isArray(json?.data) ? json.data : json?.data ? [json.data] : [];

    return {
      ok: true,
      data,
      meta: json?.meta ?? null,
      count: Number(json?.meta?.total ?? json?.meta?.filter_count ?? data.length) || data.length,
      status: 200,
      error: null,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    // Surface Directus error payloads (they are attached by cachedFetch on
    // non-2xx responses that carry a JSON body).
    const details = error && typeof error === "object" ? error.directus : null;
    const status = Number(details?.status ?? error?.status ?? 0) || 0;
    const code = details?.code;

    let kind = "network";
    if (message.includes("aborted") || error?.name === "TimeoutError" || error?.name === "AbortError") {
      kind = "timeout";
    } else if (status) {
      kind = classifyStatus(status, code);
    }

    return {
      ok: false,
      data: [],
      meta: null,
      count: 0,
      status,
      error: {
        kind,
        message: details?.message || message,
        status,
      },
    };
  }
}

/** True when the collection cannot be read with the current credentials. */
export function isAccessError(result) {
  return (
    !result?.ok &&
    ["forbidden", "unauthorized"].includes(result?.error?.kind)
  );
}

/** True when the CMS itself could not be reached / returned a server error. */
export function isTransportError(result) {
  return (
    !result?.ok &&
    ["network", "timeout", "server"].includes(result?.error?.kind)
  );
}

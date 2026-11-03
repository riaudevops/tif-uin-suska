/**
 * In-memory server-side cache for fetch requests to prevent repeated slow API
 * calls during SSR and reduce TTFB (Time to First Byte).
 *
 * Also attaches the Directus error payload (`status`, `code`, `message`) to the
 * thrown error so callers can distinguish "forbidden" from "not found" instead
 * of treating every failure as an empty result.
 */

const cache = new Map();
const inflight = new Map();

/** Prevents unbounded growth of the process-wide cache. */
const MAX_ENTRIES = 500;

function pruneIfNeeded() {
  if (cache.size <= MAX_ENTRIES) return;
  const excess = cache.size - MAX_ENTRIES;
  let removed = 0;
  for (const key of cache.keys()) {
    cache.delete(key);
    if (++removed >= excess) break;
  }
}

export async function fetchWithCache(url, options = {}, ttlMs = 30000) {
  const cacheKey = `${url}:${JSON.stringify(options.headers || {})}`;
  const now = Date.now();
  const cached = cache.get(cacheKey);

  if (cached && now - cached.timestamp < ttlMs) {
    return cached.data;
  }

  // Coalesce concurrent identical requests (e.g. several components asking for
  // the same collection while rendering one page).
  if (inflight.has(cacheKey)) {
    return inflight.get(cacheKey);
  }

  const request = (async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      // Compose an external signal with the internal timeout (if provided).
      const externalSignal = options.signal;
      if (externalSignal) {
        if (externalSignal.aborted) controller.abort();
        else externalSignal.addEventListener("abort", () => controller.abort(), { once: true });
      }

      let res;
      try {
        res = await fetch(url, {
          ...options,
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timeoutId);
      }

      if (!res.ok) {
        let details = null;
        try {
          const text = await res.text();
          const parsed = text ? JSON.parse(text) : null;
          const first = parsed?.errors?.[0];
          details = {
            status: res.status,
            code: first?.extensions?.code,
            message: first?.message || `HTTP ${res.status}`,
          };
        } catch {
          details = { status: res.status, code: undefined, message: `HTTP ${res.status}` };
        }

        if (cached) return cached.data; // fallback to stale cache if API error

        const error = new Error(`Fetch failed with status ${res.status}`);
        error.status = res.status;
        error.directus = details;
        throw error;
      }

      const data = await res.json();
      cache.set(cacheKey, { data, timestamp: now });
      pruneIfNeeded();
      return data;
    } catch (err) {
      if (cached) {
        console.warn(`[cachedFetch] Error fetching ${url}, using stale cache:`, err.message);
        return cached.data;
      }
      throw err;
    } finally {
      inflight.delete(cacheKey);
    }
  })();

  inflight.set(cacheKey, request);
  return request;
}

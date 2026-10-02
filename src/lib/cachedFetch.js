/**
 * In-memory server-side cache for fetch requests to prevent repeated slow API calls
 * during SSR and reduce TTFB (Time to First Byte).
 */

const cache = new Map();

export async function fetchWithCache(url, options = {}, ttlMs = 30000) {
  const cacheKey = `${url}:${JSON.stringify(options.headers || {})}`;
  const now = Date.now();
  const cached = cache.get(cacheKey);

  if (cached && now - cached.timestamp < ttlMs) {
    return cached.data;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      if (cached) return cached.data; // fallback to stale cache if API error
      throw new Error(`Fetch failed with status ${res.status}`);
    }

    const data = await res.json();
    cache.set(cacheKey, { data, timestamp: now });
    return data;
  } catch (err) {
    if (cached) {
      console.warn(`[cachedFetch] Error fetching ${url}, using stale cache:`, err.message);
      return cached.data;
    }
    throw err;
  }
}

/**
 * Centralized CMS configuration and URL normalizer for Directus.
 *
 * Handles:
 * - BASE_API_URL with or without trailing "/items"
 * - PUBLIC_BASE_ASSETS_URL for public browser asset loading
 * - Fallbacks for local development and SSR
 */

const rawBaseApi = (
  (typeof import.meta !== "undefined" && import.meta.env?.BASE_API_URL) ||
  (typeof process !== "undefined" && process.env?.BASE_API_URL) ||
  "https://exam.tif.uin-suska.ac.id/9545b1b23ab81781c22942d7214b150b"
)
  .trim()
  .replace(/\/+$/, "");

// Root CMS URL without trailing /items (e.g. "https://exam.tif.uin-suska.ac.id/9545b1b23ab81781c22942d7214b150b")
export const API_URL = rawBaseApi.replace(/\/items$/, "");

// Directus /items collection endpoint root (e.g. "https://exam.tif.uin-suska.ac.id/9545b1b23ab81781c22942d7214b150b/items")
export const API_ITEMS_URL = `${API_URL}/items`;
export const API_BASE_URL = API_ITEMS_URL;

// Public Assets Base URL for browser access (e.g. "https://exam.tif.uin-suska.ac.id/9545b1b23ab81781c22942d7214b150b/assets")
const rawAssetsUrl = (
  (typeof import.meta !== "undefined" && import.meta.env?.PUBLIC_BASE_ASSETS_URL) ||
  (typeof process !== "undefined" && process.env?.PUBLIC_BASE_ASSETS_URL) ||
  "https://exam.tif.uin-suska.ac.id/9545b1b23ab81781c22942d7214b150b/assets"
)
  .trim()
  .replace(/\/+$/, "");

export const ASSET_BASE_URL = rawAssetsUrl ? rawAssetsUrl : `${API_URL}/assets`;
export const ASSET_URL = `${ASSET_BASE_URL}/`;

/**
 * Formats an asset URL for a specific display size.
 *
 * Directus can generate derived images on the fly; asking for ~800px WebP
 * thumbnails instead of the original upload keeps cards light. External URLs
 * and local `/public` paths are returned unchanged.
 *
 * @param {string} fileOrUrl
 * @param {{ width?: number, height?: number, fit?: string, quality?: number, format?: string }} [options]
 * @param {string} [fallback]
 */
export function getImageUrl(fileOrUrl, options = {}, fallback = "") {
  const base = getAssetUrl(fileOrUrl, fallback);
  if (!base) return base;

  // Only transform assets served by Directus (UUID references).
  if (!base.startsWith(ASSET_URL)) return base;

  const params = new URLSearchParams();
  if (options.width) params.set("width", String(options.width));
  if (options.height) params.set("height", String(options.height));
  if (options.fit) params.set("fit", options.fit);
  if (options.quality) params.set("quality", String(options.quality));
  params.set("format", options.format || "webp");

  const separator = base.includes("?") ? "&" : "?";
  return `${base}${separator}${params.toString()}`;
}

export function getAssetUrl(fileOrUrl, fallback = "") {
  if (!fileOrUrl || typeof fileOrUrl !== "string") return fallback;
  const trimmed = fileOrUrl.trim();
  if (!trimmed || trimmed === "default") return fallback;
  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith("/")) {
    return trimmed;
  }
  return `${ASSET_URL}${trimmed}`;
}

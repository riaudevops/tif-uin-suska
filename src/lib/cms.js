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
  "http://cms-tif-uin-suska:8055"
)
  .trim()
  .replace(/\/+$/, "");

// Root CMS URL without trailing /items (e.g. "http://cms-tif-uin-suska:8055")
export const API_URL = rawBaseApi.replace(/\/items$/, "");

// Directus /items collection endpoint root (e.g. "http://cms-tif-uin-suska:8055/items")
export const API_ITEMS_URL = `${API_URL}/items`;
export const API_BASE_URL = API_ITEMS_URL;

// Public Assets Base URL for browser access (e.g. "https://tif.uin-suska.ac.id/cms/assets")
const rawAssetsUrl = (
  (typeof import.meta !== "undefined" && import.meta.env?.PUBLIC_BASE_ASSETS_URL) ||
  (typeof process !== "undefined" && process.env?.PUBLIC_BASE_ASSETS_URL) ||
  ""
)
  .trim()
  .replace(/\/+$/, "");

export const ASSET_BASE_URL = rawAssetsUrl ? rawAssetsUrl : `${API_URL}/assets`;
export const ASSET_URL = `${ASSET_BASE_URL}/`;

/**
 * Safely format an asset or image URL.
 * Handles full URLs, relative paths, null/undefined, and Directus file UUIDs.
 */
export function getAssetUrl(fileOrUrl, fallback = "") {
  if (!fileOrUrl || typeof fileOrUrl !== "string") return fallback;
  const trimmed = fileOrUrl.trim();
  if (!trimmed || trimmed === "default") return fallback;
  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith("/")) {
    return trimmed;
  }
  return `${ASSET_URL}${trimmed}`;
}

import { API_ITEMS_URL } from "@/lib/cms.js";
import { fetchWithCache } from "@/lib/cachedFetch.js";
import { getBeritaSlugMap } from "@/lib/berita.js";

export const prerender = false;

const SITE = (import.meta.env.SITE || "https://tif.uin-suska.ac.id").replace(/\/+$/, "");
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

/**
 * Locale-less routes that are safe to index.
 *
 * Deliberately excluded:
 *   - `/404` (not a real page)
 *   - `/alumni` (currently an empty placeholder)
 *   - `/academics/{internship,thesis,scholarships}/[slug]` (content is still a
 *     hardcoded fallback; revisit once the Directus collections are readable)
 */
const STATIC_ROUTES = [
  "/",
  "/academics/curriculum",
  "/academics/internship",
  "/academics/labs-squad",
  "/academics/scholarships",
  "/academics/thesis",
  "/accreditation",
  "/events",
  "/international-office",
  "/news",
  "/partners",
  "/profile/achievements",
  "/profile/classrooms",
  "/profile/faculty",
  "/profile/guidelines",
  "/profile/history",
  "/profile/laboratories",
  "/profile/organization",
  "/profile/strategic-plan",
  "/profile/vision-mission",
  "/research/aiorc",
  "/research/information-technology",
  "/research/software-engineering",
];

let cachedXml = "";
let cachedAt = 0;

const API_TOKEN = import.meta.env?.DIRECTUS_TOKEN;
const API_HEADERS = {
  "Content-Type": "application/json",
  ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
};

function escapeXml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function absolute(path) {
  return `${SITE}${path === "/" ? "" : path}`;
}

/** Returns the English and Indonesian absolute URLs for a locale-less route. */
function localePair(route) {
  return {
    en: route === "/" ? `${SITE}/` : absolute(route),
    id: route === "/" ? `${SITE}/id` : `${SITE}/id${route}`,
  };
}

function urlEntry({ loc, lastmod, alternates }) {
  const lines = [`    <loc>${escapeXml(loc)}</loc>`];

  if (lastmod) {
    const parsed = new Date(lastmod);
    if (!Number.isNaN(parsed.getTime())) {
      lines.push(`    <lastmod>${parsed.toISOString()}</lastmod>`);
    }
  }

  if (alternates) {
    lines.push(
      `    <xhtml:link rel="alternate" hreflang="en" href="${escapeXml(alternates.en)}"/>`,
      `    <xhtml:link rel="alternate" hreflang="id" href="${escapeXml(alternates.id)}"/>`,
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(alternates.en)}"/>`,
    );
  }

  return `  <url>\n${lines.join("\n")}\n  </url>`;
}

/**
 * Adds one record per language for a locale-less route, skipping URLs that were
 * already emitted (Directus contains a couple of articles sharing a slug).
 */
function addLocalized(records, seen, route, lastmod) {
  const alternates = localePair(route);

  for (const loc of [alternates.en, alternates.id]) {
    if (seen.has(loc)) continue;
    seen.add(loc);
    records.push({ loc, lastmod, alternates });
  }
}

async function fetchItems(query) {
  try {
    const json = await fetchWithCache(
      `${API_ITEMS_URL}${query}`,
      { headers: API_HEADERS },
      5 * 60 * 1000,
    );
    return Array.isArray(json?.data) ? json.data : [];
  } catch {
    return [];
  }
}

async function addDynamicEntries(records, seen) {
  const [articles, lecturers] = await Promise.all([
    fetchItems(
      "/berita?fields=id,date,modified,translations.languages_code,translations.slug_translate" +
        "&filter[status][_in]=publish,Publish,published,Published" +
        "&sort=-date&limit=-1",
    ),
    fetchItems("/dosen_tif?fields=id&limit=-1"),
  ]);

  for (const article of articles) {
    const slugs = getBeritaSlugMap(article);
    if (!slugs.en || !slugs.id) continue;

    const alternates = {
      en: `${SITE}/news/${slugs.en}`,
      id: `${SITE}/id/news/${slugs.id}`,
    };
    const lastmod = article.modified || article.date;

    for (const loc of [alternates.en, alternates.id]) {
      if (seen.has(loc)) continue;
      seen.add(loc);
      records.push({ loc, lastmod, alternates });
    }
  }

  for (const lecturer of lecturers) {
    if (lecturer?.id === undefined || lecturer?.id === null) continue;
    addLocalized(records, seen, `/profile/faculty/${lecturer.id}`);
  }
}

function serialize(records) {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...records.map(urlEntry),
    "</urlset>",
    "",
  ].join("\n");
}

async function buildSitemap() {
  const records = [];
  const seen = new Set();

  for (const route of STATIC_ROUTES) {
    addLocalized(records, seen, route);
  }

  try {
    await addDynamicEntries(records, seen);
  } catch (error) {
    // Never fail the whole sitemap because of the CMS: serve static pages only.
    console.error(
      "[sitemap] dynamic entries failed:",
      error instanceof Error ? error.message : String(error),
    );
  }

  return serialize(records);
}

export const GET = async () => {
  const now = Date.now();

  if (!cachedXml || now - cachedAt > CACHE_TTL_MS) {
    cachedXml = await buildSitemap();
    cachedAt = now;
  }

  return new Response(cachedXml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};

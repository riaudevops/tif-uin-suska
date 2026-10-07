/**
 * Utility functions and field constants for Berita (News) collection.
 * Supports the multi-language Directus schema with `translations` relation.
 */

export const BERITA_LIST_FIELDS = 'id,date,modified,status,featured_image,images,categories.*,translations.*';
export const BERITA_DETAIL_FIELDS = 'id,user_created,date,modified,status,images,featured_image,categories.*,translations.*';

function getFirstContentImage(content = '') {
  const markdownImage = content.match(/!\[[^\]]*\]\(([^)\r\n]+)\)/);
  const htmlImage = content.match(/<img\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/i);
  const source = markdownImage?.[1] || htmlImage?.[1];
  if (!source) return null;

  return source
    .trim()
    .replace(/\.\s+(?=(?:jpe?g|png|gif|webp|avif|svg)(?:[?#]|$))/i, '.');
}

/**
 * Normalizes a single berita item from Directus based on requested language.
 *
 * @param {object} item - Raw berita item from Directus
 * @param {string} lang - 'id' or 'en'
 * @returns {object|null}
 */
export function normalizeBerita(item, lang = 'id') {
  if (!item || typeof item !== 'object') return null;

  const currentLang = (lang || 'id').toLowerCase();
  const translations = Array.isArray(item.translations) ? item.translations : [];

  // Match current language first, fallback to Indonesian ('id'), or first available translation
  const matchedTranslation = translations.find(
    (t) => (t?.languages_code || '').toLowerCase() === currentLang
  );
  const fallbackTranslation =
    translations.find((t) => (t?.languages_code || '').toLowerCase() === 'id') ||
    translations[0] ||
    {};

  const active = matchedTranslation || fallbackTranslation;

  // Title fallback
  const title = (
    active.title_translate ||
    fallbackTranslation.title_translate ||
    item.title ||
    ''
  ).trim();

  // Slug fallback
  const slug = (
    active.slug_translate ||
    fallbackTranslation.slug_translate ||
    item.slug ||
    String(item.id || '')
  ).trim();

  // Excerpt fallback
  const excerpt = (
    active.excerpt_translate ||
    fallbackTranslation.excerpt_translate ||
    item.excerpt ||
    ''
  ).trim();

  // Content / Body fallback
  const body = (
    active.content_translate ||
    fallbackTranslation.content_translate ||
    item.body ||
    item.content ||
    ''
  ).trim();

  // Category fallback
  let category = '';
  if (item.categories && typeof item.categories === 'object') {
    category = item.categories.title || item.categories.name || '';
  } else if (typeof item.categories === 'string') {
    category = item.categories;
  }
  if (!category) {
    category = currentLang === 'en' ? 'News' : 'Berita';
  }

  // Image fallback: check featured_image first, then images
  let image = null;
  if (item.featured_image && item.featured_image !== 'default') {
    image = item.featured_image;
  } else if (item.images && item.images !== 'default') {
    image = item.images;
  } else {
    image = getFirstContentImage(body);
  }

  return {
    ...item,
    title,
    slug,
    excerpt,
    body,
    content: body,
    category,
    image,
    featured_image: image || item.featured_image || null,
    images: image || item.images || null,
    date: item.date || item.modified || null,
    modified: item.modified || item.date || null,
    activeTranslation: active,
  };
}

/**
 * Normalizes an array of berita items.
 *
 * @param {Array} items
 * @param {string} lang
 * @returns {Array}
 */
export function normalizeBeritaList(items, lang = 'id') {
  if (!Array.isArray(items)) return [];
  return items.map((item) => normalizeBerita(item, lang)).filter(Boolean);
}

/**
 * Builds Directus query parameters for Berita list and search.
 *
 * @param {object} options
 * @returns {URLSearchParams}
 */
export function buildBeritaQueryParams({
  searchQuery = '',
  page = 1,
  limit = 9,
  sort = '-date,-modified',
  status = 'publish,Publish,published,Published',
  fields = BERITA_LIST_FIELDS,
} = {}) {
  const params = new URLSearchParams({
    fields,
    sort,
    limit: String(limit),
    page: String(page),
    meta: 'filter_count',
  });

  if (status) {
    params.set('filter[status][_in]', status);
  }

  const query = (searchQuery || '').trim();
  if (query) {
    params.set('filter[_or][0][translations][title_translate][_icontains]', query);
    params.set('filter[_or][1][translations][excerpt_translate][_icontains]', query);
    params.set('filter[_or][2][translations][content_translate][_icontains]', query);
  }

  return params;
}

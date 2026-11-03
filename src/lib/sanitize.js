import sanitizeHtml from "sanitize-html";

/**
 * Sanitizer options for article bodies coming from Directus.
 *
 * The default `sanitize-html` allow-list already blocks `<script>`, `on*=`
 * handlers and `javascript:` URLs. These options tighten it further:
 * - images are allowed but only over http(s) — no `data:` payloads
 * - links get `rel="noopener noreferrer"` and open in a new tab only when
 *   they are external
 * - no `<style>`, `<iframe>` or embedding tags
 *
 * @param {unknown} html
 * @returns {string}
 */
export function sanitizeArticleHtml(html) {
  const input = typeof html === "string" ? html : "";
  if (!input.trim()) return "";

  return sanitizeHtml(input, {
    allowedTags: [
      ...sanitizeHtml.defaults.allowedTags,
      "img",
      "figure",
      "figcaption",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
    ],
    allowedAttributes: {
      a: ["href", "name", "target", "rel", "title"],
      img: ["src", "alt", "title", "width", "height", "loading", "decoding"],
      "*": ["class"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: {
      img: ["http", "https"],
      a: ["http", "https", "mailto", "tel"],
    },
    allowProtocolRelative: false,
    disallowedTagsMode: "discard",
    transformTags: {
      a: (tagName, attribs) => {
        const href = String(attribs.href || "");
        const isExternal = /^https?:\/\//i.test(href);
        return {
          tagName,
          attribs: {
            ...attribs,
            ...(isExternal
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {}),
          },
        };
      },
    },
  });
}

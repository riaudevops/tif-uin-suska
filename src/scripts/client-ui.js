/**
 * Small progressive-enhancement helpers used by most pages.
 *
 * These behaviours used to live in inline event handler attributes
 * (`onerror=`, `onclick=`), which are blocked by the CSP
 * (`script-src-attr 'none'`). Keeping them in a bundled module means the
 * markup only carries data attributes.
 *
 * Bundled by Vite, so the CSP only needs `script-src 'self'`.
 */

export function initImageFallbacks(root = document) {
  root.querySelectorAll("img[data-fallback-src]").forEach((img) => {
    if (img.dataset.fallbackBound === "1") return;
    img.dataset.fallbackBound = "1";

    const applyFallback = () => {
      const fallback = img.dataset.fallbackSrc;
      if (!fallback) return;
      // Guard against a broken fallback image causing an infinite loop.
      img.removeAttribute("data-fallback-src");
      img.src = fallback;
    };

    img.addEventListener("error", applyFallback, { once: true });

    // The `error` event may have fired before this deferred module executed
    // (the image starts loading as soon as the HTML parser reaches it), so
    // also check images that have already failed.
    if (img.complete && img.naturalWidth === 0 && img.currentSrc !== "") {
      applyFallback();
    }
  });
}

export function initBackButtons(root = document) {
  root.querySelectorAll("[data-go-back]").forEach((button) => {
    if (button.dataset.goBackBound === "1") return;
    button.dataset.goBackBound = "1";

    button.addEventListener("click", () => {
      // Only navigate within our own history; never trust an external referrer.
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.assign("/");
      }
    });
  });
}

function initAll() {
  initImageFallbacks();
  initBackButtons();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAll, { once: true });
} else {
  initAll();
}

document.addEventListener("astro:page-load", initAll);

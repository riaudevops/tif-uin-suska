# Website Program Studi Teknik Informatika — UIN Suska Riau

Profil resmi Program Studi Teknik Informatika, Fakultas Sains dan Teknologi,
UIN Sultan Syarif Kasim Riau.

- **Framework:** Astro 7 (SSR, `@astrojs/node` standalone)
- **Styling:** Tailwind CSS 4
- **CMS:** Directus (REST `/items`)
- **Bahasa:** Inggris (default, tanpa prefix) dan Indonesia (`/id/...`)
- **Deploy:** Docker → GHCR → Portainer

## 🚀 Project Structure

```text
/
├── public/                  # static assets (images, logos, robots.txt)
├── public/fonts/            # self-hosted Figtree (no Google Fonts request)
├── scripts/
│   ├── check-cms.mjs        # Directus health check
│   └── check-security.mjs   # CSP/HSTS/rate-limit regression check
├── src
│   ├── components/
│   │   ├── globals/         # navbar, footer icons, SEO, search, states
│   │   └── pages/           # per-section page sections
│   ├── layouts/Layout.astro # html shell + SEO + navbar/footer
│   ├── lib/
│   │   ├── cms.js           # Directus URL + asset URL helpers
│   │   ├── cachedFetch.js   # SSR cache, timeout, request coalescing
│   │   ├── directus.js      # central client (auth, errors, cache)
│   │   ├── seo.js           # canonical / hreflang helpers
│   │   ├── legacy-redirects.js
│   │   ├── berita.js        # news normalizer + per-language slugs
│   │   ├── dosen.js         # lecturer normalizer
│   │   ├── agenda.js        # events normalizer
│   │   ├── prestasi.js      # achievements normalizer
│   │   ├── search.js        # site search index
│   │   ├── sanitize.js      # hardened allow-list for CMS article HTML
│   │   ├── url-safety.js    # validates CMS-supplied href/mailto values
│   │   └── translations.js  # i18n strings
│   ├── middleware.js        # locale rewrite, legacy redirects, security headers
│   ├── scripts/             # bundled client behaviour (no inline scripts)
│   ├── pages/               # routes
│   └── styles/global.css
├── astro.config.mjs
├── security-headers.mjs     # shared CSP/HSTS/header definitions
├── rate-limit.mjs           # in-process limiter for SSR + data endpoints
├── server.mjs               # production entry (headers, limit, cache, gzip)
├── Dockerfile
└── package.json
```

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `bun install`             | Installs dependencies                            |
| `bun run dev`             | Starts local dev server at `localhost:4321`      |
| `bun run build`           | Build your production site to `./dist/`          |
| `bun run preview`         | Preview your build locally, before deploying     |
| `bun run check`           | Runs `astro check` (type/diagnostics)            |
| `bun run ci`              | `check` + `build` + `security:check` (CI gate)   |
| `bun run security:check`  | Verifies CSP, HSTS, inline-script and rate limits |
| `bun run start`           | Serves `./dist` with `server.mjs` (production)   |
| `bun run cms:check`       | Verifies Directus collection access              |
| `bun run images:optimize` | Re-encodes `public/` images to WebP              |
| `bun run astro ...`       | Run CLI commands like `astro add`, `astro check` |

> **Package manager:** this project uses **Bun**. `bun.lock` is the single source
> of truth — do not commit `package-lock.json`, `yarn.lock`, or `pnpm-lock.yaml`.

## ✅ Build & CI

Before an image is built, the GitHub Actions workflow (`.github/workflows/deploy.yml`)
runs a quality gate:

1. `bun install --frozen-lockfile`
2. `bun run check`
3. `bun run build`
4. `bun run security:check`

If any step fails, the Docker image is never built or deployed. Run the same
commands locally before pushing.

If you change dependencies, regenerate the lockfile with `bun install` and commit
`bun.lock` together with `package.json`; otherwise `--frozen-lockfile` fails both
in CI and inside the Docker build.

### When it deploys

| Trigger | Docker tags | Portainer webhook |
| :--- | :--- | :--- |
| Push to `master` | `master`, `master-<sha>`, `latest` | `PORTAINER_WEBHOOK_URL` |
| Push to `staging` | `staging`, `staging-<sha>` | `PORTAINER_WEBHOOK_URL` |
| Push to `dev` | `dev`, `dev-<sha>` | `PORTAINER_WEBHOOK_URL` |
| **Push a git tag** (`v*` or `*.*.*`) | **the git tag itself** (`v1.2.3`, `2.0.0`) | **`PORTAINER_WEBHOOK_URL_PROD`** |
| Manual (`workflow_dispatch`) | tags of the selected ref | depends on the ref |

A tag push builds the image from the tagged commit only (no `latest`, so a
release can never silently become "latest"). It runs in the `Production`
environment so the `PORTAINER_WEBHOOK_URL_PROD` secret can live there.

```sh
git tag v1.2.3
git push origin v1.2.3     # -> image ghcr.io/riaudevops/fe-tif-uin-suska:v1.2.3
```

Deploys are serialised per ref (`concurrency: deploy-<ref>` with
`cancel-in-progress`), so a burst of pushes cannot race the same Portainer
stack, while a tag release still gets its own slot.

Required repository/environment secrets: `BASE_API_URL`, `DIRECTUS_TOKEN`,
`BASIC_AUTH_USER`, `BASIC_AUTH_PASS`, `PORTAINER_WEBHOOK_URL`, and
`PORTAINER_WEBHOOK_URL_PROD` for tag releases.

## ⚡ Runtime & assets

Production runs through **`server.mjs`**, not the raw `dist/server/entry.mjs`.
The stock entry serves static files through `send@1.x`, which drops the adapter's
cache headers and compresses nothing. `server.mjs` wraps the generated handler and
adds:

| Path                          | `Cache-Control`                                        |
| :---------------------------- | :----------------------------------------------------- |
| `/_astro/*` (hashed)          | `public, max-age=31536000, immutable`                  |
| images, fonts, icons          | `public, max-age=604800, stale-while-revalidate=86400` |
| HTML pages                    | untouched (no cache header)                            |
| prerendered HTML (built files) | `public, max-age=300, stale-while-revalidate=86400`    |
| SSR HTML (CMS-backed routes)  | no cache header (always fresh)                         |
| `/sitemap.xml`, `/api/*`      | whatever the endpoint declares                         |

Responses with a compressible `Content-Type` above ~1.4 KB are gzipped on the fly
(`Vary: Accept-Encoding`); already-compressed formats such as WebP are passed
through. Endpoints that set their own `Cache-Control` keep it.

Every image in `public/` is **WebP**, generated by `bun run images:optimize`
(Sharp, see `scripts/optimize-images.mjs`). Display sizes are capped per folder
(900 px for lab/classroom cards, 1200 px for people, 1600 px for hero images) and
each file is only converted when the result is smaller than the source. Add new
photos as JPEG and run the script — `bun run images:optimize --check` fails if an
unconverted JPEG is still around. Directus uploads are resized on the fly by
`getImageUrl()` in `src/lib/cms.js` instead.

## 🔒 Security

Security headers are defined once in `security-headers.mjs` and applied by both
the Astro middleware (SSR responses) and `server.mjs` (prerendered HTML, static
assets, API responses). Prerendered pages bypass the middleware entirely, so the
headers must live in the Node wrapper too.

| Header | Value |
| :--- | :--- |
| `Content-Security-Policy` | `default-src 'self'`, `script-src 'self'`, `style-src 'self'`, `*-src-attr 'none'` — no inline scripts, styles or `unsafe-eval` |
| `Strict-Transport-Security` | `max-age=31536000`, only when the request arrived over HTTPS |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` / `frame-ancestors` | `SAMEORIGIN` / `'self'` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | camera, microphone, geolocation, payment, USB, … disabled |
| `Cross-Origin-Opener-Policy` | `same-origin-allow-popups` |
| `Cross-Origin-Resource-Policy` | `same-origin` |

Notes on the CSP:

- No inline `<script>` or `<style>` is emitted: component behaviour lives in
  `src/scripts/*.js` and Vite bundles it. `build.assetsInlineLimit: 0` keeps even
  tiny scripts as external files, and `build.inlineStylesheets: "never"` emits
  stylesheets as files. That is why the CSP needs neither `'unsafe-inline'` nor
  Astro CSP hashes (which are incompatible with `<ClientRouter />`).
- `script-src-attr 'none'` / `style-src-attr 'none'` block inline event handlers
  (`onclick=`, `onerror=`) and `style="..."` attributes. UI behaviour uses data
  attributes (`data-fallback-src`, `data-go-back`, `data-search-*`).
- `'unsafe-eval'` was removed; nothing in the app or its bundles needs it.
- `upgrade-insecure-requests` and HSTS are only sent when the request actually
  arrived over HTTPS. On plain HTTP the directive would rewrite same-origin
  CSS/JS/font URLs to `https://` and break the page (e.g. HTTP-only staging).
- Fonts are self-hosted in `public/fonts/`, so Google Fonts origins are gone.
- `img-src` is limited to the configured CMS origin plus `*.uin-suska.ac.id`
  instead of every HTTPS host. Editors who host images elsewhere must add that
  origin through `CSP_IMG_SRC_EXTRA` (see `.env.example`); otherwise the image
  is blocked, which is visible in the browser console.

CMS content is untrusted input:

- Article bodies go through `sanitizeArticleHtml()` (`src/lib/sanitize.js`),
  which uses an allow-list, forces `rel="noopener noreferrer"` on external links
  and rejects `data:` images.
- CMS-supplied `href` values go through `safeExternalUrl()` / `safeMailto()`
  (`src/lib/url-safety.js`) so `javascript:` URLs cannot be injected.
- JSON-LD escapes `<`, `>` and `&` so CMS text cannot break out of the
  `<script type="application/ld+json">` block.

### Rate limiting

`rate-limit.mjs` runs in `server.mjs` before Astro renders. It is an in-process
fixed-window counter (keyed by client IP), which is sufficient for a single
container behind a reverse proxy:

| Variable | Default | Meaning |
| :--- | :--- | :--- |
| `RATE_LIMIT_ENABLED` | `true` | set `false` to disable |
| `RATE_LIMIT_WINDOW_MS` | `60000` | window length |
| `RATE_LIMIT_MAX` | `120` | page/SSR requests per window per IP |
| `RATE_LIMIT_API_MAX` | `30` | `/api/*` and `/sitemap.xml` per window per IP |
| `RATE_LIMIT_MAX_KEYS` | `20000` | hard cap on tracked clients (oldest evicted) |
| `TRUST_PROXY` | `true` | read `X-Forwarded-For` / `X-Real-IP` |
| `TRUST_PROXY_HOPS` | `1` | trusted proxies in front of the app |

Static assets (`/_astro/*`, images, fonts) never consume the budget. When the
limit is exceeded the server returns `429` with `Retry-After` and
`Cache-Control: no-store`.

Client identity uses the **rightmost** `X-Forwarded-For` entry — the value
written by the closest trusted proxy. Reading the leftmost entry (a common
mistake) lets a client rotate `X-Forwarded-For: <random>` through an appending
proxy and never hit the limit. Raise `TRUST_PROXY_HOPS` when running more than
one proxy (e.g. Cloudflare + nginx) and set `TRUST_PROXY=false` when the
container is exposed directly.

### Request hardening

The site has no write endpoints (no forms, actions or uploads), so `server.mjs`
rejects everything except `GET`, `HEAD` and `OPTIONS` with `405` and an `Allow`
header before Astro renders. Bodies above `MAX_BODY_BYTES` (default 256 KB) get
`413`. Astro's own `security.checkOrigin` and `allowedDomains` settings stay on
as a second layer.

> If a real form or upload endpoint is added later, update `READ_METHODS` in
> `server.mjs` together with the CSRF/origin policy.

Set `TRUST_PROXY=false` if the container is exposed directly without a trusted
reverse proxy, otherwise clients could spoof their IP.

### Verifying security

```sh
bun run build
bun run security:check
```

The script fails when emitted HTML contains inline scripts/handlers/styles, a
client bundle uses `eval`/`new Function`, the CSP regresses, HSTS is sent over
HTTP, or the rate limiter stops working. It runs automatically as part of
`bun run ci`.

## 🗄️ Content & CMS

Environment variables (see `.env.example`):

| Variable | Scope | Purpose |
| :--- | :--- | :--- |
| `BASE_API_URL` | build + runtime | Directus base URL, without `/items` |
| `PUBLIC_BASE_ASSETS_URL` | build + runtime | public asset base for the browser |
| `DIRECTUS_TOKEN` | **server only** | token for collections the public role cannot read |

> `DIRECTUS_TOKEN` must never be renamed to `PUBLIC_DIRECTUS_TOKEN`. It is only
> used during SSR/SSG and is passed to Docker as a build arg in CI.

### Required collections

`berita`, `dosen_tif`, `agenda`, `hero_slider`, `kurikulum`, `prestasi`,
`beasiswa`, `tugas_akhir`, `kerja_praktik` (plus optional `information`,
`software`, `aiorc_fields`, `aiorc_info`).

Verify access at any time:

```sh
bun run cms:check          # human-readable table
bun run cms:check -- --json
```

The script exits non-zero when a required collection is forbidden, missing, or
unreachable.

### Error handling policy

The app never invents content:

| Situation | Response |
| :--- | :--- |
| Entry does not exist | `404` + `noindex` state page |
| Collection forbidden (403/401) | `503` + `Retry-After` on detail pages |
| CMS unreachable / 5xx | `503` + `Retry-After` on detail pages |
| Readable but empty | `200` + honest "no data yet" message |
| List page with failing CMS | `200` (static content stays useful) + notice |

Commented-out "dummy" announcements were removed on purpose. If a page shows
"temporarily unavailable", run `bun run cms:check` before assuming a code bug.

### Known data issues

1. **`beasiswa`, `tugas_akhir`, `kerja_praktik`, `aiorc_info` return `FORBIDDEN`**
   for the public role. Either grant read access in Directus or provide
   `DIRECTUS_TOKEN` at build/runtime.
2. **Two news rows share the same translated slug**
   (`odd-semester-lecture-schedule-2016-2017`, IDs 1071 and 1444). The site
   deterministically serves the newest one; the other is only reachable by ID.
   Clean this up in the CMS.
3. **`dosen_tif` has no `modified` field** — requesting it returns `FORBIDDEN`
   for the field, so sitemap entries for lecturer pages omit `lastmod`.
4. **Legacy `featured_image` values** contain `default` and `http://localhost/...`.
   These are replaced by `/landing-pages/gedung.jpg` at render time, but the CMS
   rows should be fixed.

## 🔗 Routing & i18n

- English is the default locale and has **no prefix** (`/news`).
- Indonesian is always prefixed (`/id/news`).
- Legacy paths are defined once in `src/lib/legacy-redirects.js` and applied
  both by `astro.config.mjs` (301) and by the middleware for locale-prefixed
  requests (`/id/berita` → `/id/news`).
- Canonical and `hreflang` URLs are produced by `src/lib/seo.js` from the
  original request path (`Astro.locals.originalUrl`), not the rewritten route.
- Search result pages (`?q=...`) are `noindex`.

## 🗺️ Sitemap

`/sitemap.xml` is generated at runtime (`src/pages/sitemap.xml.js`), not by an
integration. It includes static routes, published news (per-language slugs), and
lecturer profiles, with `hreflang` alternates and deduplication. It excludes
`/404`, `/alumni`, and the academic detail pages until their CMS collections are
readable.

## 🔍 Search

`/api/search-index.json?lang=en|id` builds the client-side search index from
static routes plus news, lecturers, events, scholarships, thesis, and internship
entries. Results always point at canonical, locale-correct URLs.

## 👀 Want to learn more?

- [Astro documentation](https://docs.astro.build)
- [Directus documentation](https://docs.directus.io)

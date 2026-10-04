# THE CHEMICAL FACTORY — Current State Report

**Date:** 2026-10-04
**Stack:** Static HTML/CSS/vanilla JS. No framework, no build step, no bundler.

This is the current-state companion to
[SECURITY-REPORT.md](SECURITY-REPORT.md) (the original baseline audit, kept
unchanged for the record) and
[SECURITY-HEADERS.md](SECURITY-HEADERS.md) (deployable host configuration).

---

## 1. What was changed

### Phase 1 — Security (`820c41d`)

| Area | Change |
| --- | --- |
| Third-party JS | GSAP `3.12.5` vendored to `js/vendor/`. No `cdnjs.cloudflare.com` reference remains. |
| CSP | `Content-Security-Policy` meta on all 12 pages. `script-src 'self'`, `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`. |
| Referrer | `strict-origin-when-cross-origin` on all pages. |
| XSS surface | All `innerHTML` string interpolation escaped via `esc()`; `localStorage`/`sessionStorage` reads length-bounded and type-checked. |
| Forms | Real client validation, honeypots, honest delivery. `FORM_ENDPOINT` is `null`, so submission composes a `mailto:` draft the user sends themselves. Fake success messaging removed. |
| Embeds | Google Maps iframe sandboxed and lazy-loaded. |
| Dead links | Placeholder Facebook/LinkedIn/X links removed; only the verified Instagram link remains. |
| Inputs | Every input/select has a `name`, `maxlength` where appropriate, and an associated `<label>`. |
| Hosting | `SECURITY-HEADERS.md` with copy-paste Vercel / Netlify / Apache / Nginx config, including HSTS caution and PDF caching. |

### Phase 2 — Secure downloads (`3054e58`)

The 14 datasheets were rebuilt rather than just moved.

| Property | Before | After |
| --- | --- | --- |
| Page size | ~3200 × 4800 pt (~44 × 67 in) | ~7.8 × 11.69 in (A4-proportional) |
| Resolution | source | 300 DPI |
| Total size | 31.6 MB | 22.4 MB (−29%) |
| Paths | `products/*.pdf` | `downloads/<lowercase-product-id>.pdf` |
| Metadata | carried from scanner | stripped (empty `/Info` dictionary) |
| Encoding | mixed | `/DCTDecode`, JPEG q80 |

Also: `downloads/manifest.json`; product data now carries measured
`datasheetKb` and `datasheetPages`; `js/products.js` validates every
datasheet href against `DATASHEET_RE` before rendering.

### Phase 3.1 — Reduced motion (`298f400`)

`js/motion.js` is the single GSAP `matchMedia` gate. Reduced-motion visitors
get no reveals, no parallax and no counters; a CSS safety net force-shows
`[data-reveal]`, `[data-hero]`, the watermark and the hero front image, so
content can never be stranded invisible if JS fails.

Preloader: 3397 ms normally, **33 ms** under reduced motion.

### Phase 3.2/3.3 — Images (`c929d9e`)

47 non-empty static images carry measured `width`/`height` (CLS), with
`loading="lazy"` + `decoding="async"` below the fold and
`loading="eager"` + `fetchpriority="high"` on hero banners. All 29
JS-rendered product/datasheet/detail images carry the same, plus descriptive
alt text.

The two JS-filled modal images intentionally keep an empty `src` — the browser
cannot know their size until the modal opens.

### Phase 3.4/3.5 — SEO and legal pages

- Fixed a **double-encoded em dash** (`U+009D` mojibake) at 3 sites in `index.html`.
- Unique `<meta name="description">` on all 12 pages (12/12 distinct),
  126–184 chars on the nine main pages and 87–129 on the three legal drafts.
- Open Graph + Twitter card tags on all pages (`og:type`, `og:site_name`,
  `og:title`, `og:description`, `og:image`, `og:image:alt`, `twitter:card`).
- `product-detail.html` serves 14 products from one template, so per-product
  title/description/OG image are written into `<head>` at runtime — 14 unique
  descriptions, each clamped to ≤155 chars on a word boundary.
- `robots.txt` and a generated `sitemap.xml` (8 pages + 14 products = 22 URLs).
- New `privacy.html`, `terms.html`, `cookie.html`; footer links now point at
  them instead of dead `#privacy` / `#terms` / `#cookie` anchors.

---

## 2. Verification

All of the following were run against a local `python -m http.server`.

| Check | Tool | Result |
| --- | --- | --- |
| Pages × motion modes | `tools/audit-pages.js` | **26/26 ok** (12 pages + valid-id detail, normal and reduced) |
| Console / CSP | same | no errors, no violations |
| Local assets | `tools/check-assets.py` | 235 refs, 0 broken |
| Live internal links | ad-hoc | 209 refs, 0 broken |
| Motion gate | `tools/verify-motion-gate.js` | PASS both modes |
| Images | `tools/verify-images.js` | PASS, 29/29 |
| Datasheets | `tools/verify-datasheets.js` | PASS, 14/14 HTTP 200 |
| Text encoding | ad-hoc byte scan | no mojibake in any `.html/.css/.js/.md/.xml` |

The reduced-motion audit previously reported `#detail-missing` as "still
hidden". That was a **false positive**: with a valid product id that element
*should* be `display:none`. The auditor now skips elements carrying the site's
own `.hidden` class while still reporting a bare `display:none`, so a genuinely
failed region is not masked.

---

## 3. Open items

These need input or a decision. None is a defect that can be closed by guessing.

### Blocking a real launch

1. **Production domain** — `TODO(owner)`. Canonical links, `og:url`,
   `robots.txt` `Sitemap:` and all 22 sitemap URLs use the literal marker
   `SITE-URL-PLACEHOLDER`. The canonical tags are present but commented out so
   no broken absolute URL ships. Search for `SITE-URL-PLACEHOLDER` and
   `SITE_URL` and replace once known.
2. **Legal review** — `privacy.html`, `terms.html`, `cookie.html` are drafts,
   marked as such on the page, and set to `noindex`. They are excluded from the
   sitemap until approved. Unresolved `TODO`s on the pages themselves cover the
   retention period and the governing-law/liability sections.
3. **Hosting choice** — determines which block of `SECURITY-HEADERS.md` applies.
   `frame-ancestors 'none'` cannot be delivered by a `<meta>` tag at all.
4. **Form delivery** — `FORM_ENDPOINT = null`. Currently a `mailto:` handoff.
   If a server-side handler is added, the privacy and cookie pages must be
   updated to match.

### Content the owner must supply

5. **YouTube video ID** — the placeholder embed was removed rather than shipped
   as a dead frame. No video markup exists, so no video-card animation was
   written.
6. **Facebook / LinkedIn / X URLs** — unknown, so those links were removed.
7. **Real estimator rates** — the quote estimator uses placeholder rates and is
   unchanged; wiring it to real PKR rates needs the actual price list.
8. **Client logos / permission** — the roster stays text-only (43 names in five
   grouped sections). Government and defence bodies are named without permission
   confirmation; logos are not used.
9. **`PU ELASTO PRO`** single- vs two-component wording is unresolved.

### Known technical limitations

10. **The PDFs are scans with no text layer.** They were cleaned and
    re-encoded, but they are images of pages, not selectable text. They are
    therefore not accessible to screen readers and not searchable, and Google
    cannot index their contents. No OCR tool was available in this environment
    (`tesseract`, `ocrmypdf`, `pdftotext`, `pytesseract`, `pdf2image` all
    absent), so this was **not** done rather than done badly. To fix: OCR the
    originals, then re-run `tools/clean-datasheets.py`. The original source PDFs
    are recoverable from git at `820c41d`.
11. **Google Fonts is a render-blocking third-party `@import`** in
    `css/styles.css`. It was retained deliberately. It can delay
    `DOMContentLoaded` when the font request stalls, and it discloses the
    visitor's IP to Google. Self-hosting the two families would fix both.
12. **`style-src` needs `'unsafe-inline'`** because the site sets element styles
    from JS at runtime. Removing it would require moving those to CSS
    custom-properties or a nonce-based build — out of scope for a no-build
    static site.

---

## 4. Tooling

`tools/` is development-only and is not part of the deployed site:

| File | Purpose |
| --- | --- |
| `audit-pages.js` | Renders every page in Chrome, both motion modes; console/CSP/failed-request/hidden-element checks. |
| `verify-motion-gate.js` | Asserts the reduced-motion gate. |
| `verify-preloader-gate.js` | Preloader timing + full-motion preservation. |
| `verify-images.js` | JS-rendered image attribute checks. |
| `verify-datasheets.js` | Fetches every datasheet URL. |
| `check-assets.py` | Whole-tree asset reference check, comment- and CSS-relative aware. |
| `clean-datasheets.py` | Rebuilds the PDFs. |
| `seo.py` | Writes per-page meta blocks. |
| `sitemap.py` | Regenerates `sitemap.xml`; skips `noindex` pages. |
| `policy-pages.py` | Generates the three legal pages from one template. |
| `optimize-images.py` | Idempotent static image hint/dimension pass. |

`package.json`, `package-lock.json` and `node_modules/` are gitignored dev
dependencies.

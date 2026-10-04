# Security headers

Host-level security headers for The Chemical Factory static site.

The `<meta http-equiv="Content-Security-Policy">` tag in every HTML page is the
baseline, but a meta tag **cannot** set `frame-ancestors`, HSTS, `X-Content-Type-Options`,
`Referrer-Policy` or `Permissions-Policy`. Add the headers below at your host for full
coverage. The meta tag is kept as defence-in-depth for static file previews and CDNs
that ignore host config.

---

## Where this policy came from

The CSP is derived from what the site actually loads, not from a generic template.
Verified with `grep` across `*.html`, `js/*.js` and `css/*.css`:

| Resource | Used? | Detail | Directive |
| --- | --- | --- | --- |
| Local JS (`js/*.js`, `js/vendor/*.js`) | yes | GSAP 3.12.5 + ScrollTrigger are now vendored, not from a CDN | `script-src 'self'` |
| Inline `<script>` blocks | **no** | none on any page | `script-src 'self'` is safe |
| Inline `on*=` handlers | **no** | the one `onerror` on the preloader brush was moved into JS | `script-src 'self'` is safe |
| `eval` / `new Function` | **no** | none | `script-src 'self'` is safe |
| Google Fonts CSS (`Caveat`, `DM Sans`) | **yes** | `@import` at `css/styles.css:1` | `style-src`, `font-src` |
| Local font `fonts/Hertical Sans.ttf` | yes | via `@font-face` | `font-src 'self'` |
| Inline `style="..."` attributes | **yes** | ~12 across the HTML plus JS `.style` writes | needs `'unsafe-inline'` |
| Google Maps embed | **yes** | `contact.html`, one `<iframe>` | `frame-src` |
| YouTube embed | **no** | the case-study video block was removed (placeholder ID) | allowed proactively, see TODO |
| All images | local | `img-src 'self' data:` | `img-src` |
| `fetch` / XHR / WebSocket | **no** | none in the codebase | `connect-src 'self'` |
| `<object>` / `<embed>` | **no** | none | `object-src 'none'` |
| Form submissions | JS-handled | `mailto:` hand-off or `FORM_ENDPOINT` in `js/forms.js` | `form-action 'self'` |

> **Why `style-src` keeps `'unsafe-inline'`:** the design system sets spacing and
> layout through `style` attributes on ~12 elements, and `js/main.js` / `js/animations.js`
> write `element.style` at runtime. Removing `'unsafe-inline'` requires moving all of
> that into utility classes or CSS custom properties first. Script injection is still
> fully blocked, which is where the real risk sits.

---

## The policy

```
default-src 'self';
script-src 'self';
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com;
img-src 'self' data:;
connect-src 'self';
frame-src https://www.google.com https://www.youtube-nocookie.com;
object-src 'none';
base-uri 'self';
form-action 'self';
frame-ancestors 'none'
```

The `frame-ancestors 'none'` directive is only valid in a **header**, not in the meta tag.

---

## Vercel — `vercel.json`

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; frame-src https://www.google.com https://www.youtube-nocookie.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'"
        },
        { "key": "Strict-Transport-Security", "value": "max-age=31536000; includeSubDomains" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
        { "key": "X-Frame-Options", "value": "DENY" }
      ]
    },
    {
      "source": "/downloads/(.*)",
      "headers": [
        { "key": "Content-Type", "value": "application/pdf" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Content-Disposition", "value": "attachment" },
        { "key": "Cache-Control", "value": "public, max-age=86400" }
      ]
    },
    {
      "source": "/js/vendor/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

---

## Netlify — `_headers`

```
/*
  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; frame-src https://www.google.com https://www.youtube-nocookie.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
  X-Frame-Options: DENY

/downloads/*
  Content-Type: application/pdf
  X-Content-Type-Options: nosniff
  Content-Disposition: attachment
  Cache-Control: public, max-age=86400

/js/vendor/*
  Cache-Control: public, max-age=31536000, immutable
```

---

## Apache — `.htaccess`

```apache
# Security headers
<IfModule mod_headers.c>
  Header always set Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; frame-src https://www.google.com https://www.youtube-nocookie.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'"
  Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
  Header always set X-Content-Type-Options "nosniff"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set Permissions-Policy "camera=(), microphone=(), geolocation=(), interest-cohort=()"
  Header always set X-Frame-Options "DENY"
</IfModule>

# Force HTTPS (only enable once a valid certificate is installed)
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{HTTPS} !=on
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>

# Datasheets must download, never render inline, and never be MIME-sniffed
<FilesMatch "\.pdf$">
  Header set Content-Type "application/pdf"
  Header set X-Content-Type-Options "nosniff"
  Header set Content-Disposition "attachment"
</FilesMatch>

# Long cache for vendored libraries (filenames are not hashed, so keep this modest)
<FilesMatch "\.(js|css)$">
  Header set Cache-Control "public, max-age=604800"
</FilesMatch>

# Block access to dotfiles
<FilesMatch "^\.">
  Require all denied
</FilesMatch>
```

---

## Nginx — `server` block

```nginx
server {
    listen 443 ssl http2;
    server_name example.com;   # TODO(owner): your real domain

    root /var/www/the-chemical-factory;
    index index.html;

    add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; frame-src https://www.google.com https://www.youtube-nocookie.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), interest-cohort=()" always;
    add_header X-Frame-Options "DENY" always;

    # Datasheets
    location /downloads/ {
        types { application/pdf pdf; }
        default_type application/pdf;
        add_header Content-Disposition "attachment" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Cache-Control "public, max-age=86400" always;
    }

    # Vendored libraries
    location /js/vendor/ {
        add_header Cache-Control "public, max-age=31536000, immutable" always;
    }

    location / {
        try_files $uri $uri/ $uri.html =404;
    }
}
```

> Nginx `add_header` does not inherit into a `location` block once that block has its
> own `add_header`. That is why the download and vendor locations repeat their headers.

---

## HSTS caution

`includeSubDomains` applies to every subdomain. Only enable it if you are certain all of
them are HTTPS-only, otherwise drop it and use `max-age=31536000` alone. Start with a short
`max-age` (e.g. `300`) and raise it once you are confident.

---

## Vendored GSAP provenance

GSAP is served from the site's own origin now, so no `integrity` attribute is needed.
The files were fetched from cdnjs at the original version and their hashes recorded here
so you can re-verify a fresh download:

```
js/vendor/gsap.min.js         sha384-83835387F22FE4F3D4E313F28445AA3DCC2D3573AF75A0C8F0B2E7C987F23593A32897984328F343D5F9DBBE5E063A6D
js/vendor/ScrollTrigger.min.js sha384-6774446B3EFD97621A019A89B12001B536E18E0394632577A7DD1736700F0921E0DC4313CF57E8BAE9EAF56651B63DDD
```

Recompute with:

```bash
openssl dgst -sha384 -binary js/vendor/gsap.min.js | openssl base64 -A
```

If you ever go back to a CDN, use those exact values with
`crossorigin="anonymous"` — but note that GSAP's own licence (standard "no charge" GSAP
licence) permits self-hosting, which is what is done here.

---

## Open TODOs

| Item | Why it is open |
| --- | --- |
| Canonical domain | `SITE_URL` in `js/seo.js` is a placeholder; needed for canonical URLs, `sitemap.xml`, `robots.txt` and the policy pages |
| Hosting platform | Pick one snippet above; headers differ per host |
| Form delivery | `FORM_ENDPOINT` in `js/forms.js` is `null`, so forms open the visitor's mail client |
| YouTube video ID | Case-study video removed; `frame-src` already allows `youtube-nocookie` |
| Social URLs | Facebook / LinkedIn / X placeholders were removed; see `SOCIAL` in `js/components.js` |

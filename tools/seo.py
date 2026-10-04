"""Phase 3.4: per-page titles, meta descriptions, Open Graph and Twitter cards.

Adds a consistent block to every page's <head>:
  - a unique description written from the page's own content
  - og:title / og:description / og:type / og:url / og:image / og:site_name
  - twitter:card and the matching title/description/image
  - robots directives

Canonical + og:url need the live domain, which is not known yet, so they are
written as a clearly marked TODO that SITE-URL-PLACEHOLDER marks. tools/seo.js
reports exactly which lines still need the real domain.

`product-detail.html` is a single template rendered for 14 products, so it
gets a generic-but-accurate description; products.js updates document.title
and the meta tags per product at runtime.
"""
import glob
import io
import re
import sys

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

BRAND = "THE CHEMICAL FACTORY"
SITE_NAME = "The Chemical Factory"

# page -> (description, og_type, og_image)
META = {
    "index.html": (
        "Pakistan manufacturer of waterproofing chemicals, construction "
        "sealants and polyurethane systems for concrete, masonry and steel. "
        "9+ years, 43 projects delivered across Pakistan.",
        "website", "images/hero-bg-back.png"),
    "about.html": (
        "Founded in 2016, The Chemical Factory manufactures waterproofing and "
        "construction chemicals in Karachi, Pakistan, supplying contractors "
        "and consultants nationwide.",
        "website", "images/technician.jpg"),
    "services.html": (
        "Waterproofing and structural repair services: liquid applied "
        "membranes, PU injection, concrete protection and tanking for "
        "buildings, tanks and infrastructure in Pakistan.",
        "website", "images/flat-roof.jpg"),
    "products.html": (
        "Browse 14 technical construction chemicals: polyurethane injection "
        "resins, cementitious waterstops, PU membranes, expansion joint "
        "sealants and tile adhesives. Download full datasheets.",
        "website", "images/product-banner.jpg"),
    "product-detail.html": (
        "Technical specifications, packaging, coverage rates and application "
        "guidelines for The Chemical Factory construction chemical range.",
        "product", "images/product-banner.jpg"),
    "projects.html": (
        "Completed waterproofing and structural repair projects across "
        "Pakistan, including commercial, industrial and residential work.",
        "website", "images/construction.jpg"),
    "datasheets.html": (
        "Download PDF technical datasheets for the full The Chemical Factory "
        "range, including property matrices, consumption figures and "
        "application guidelines.",
        "website", "images/product-banner.jpg"),
    "clients.html": (
        "The Chemical Factory has supplied waterproofing materials to 43 "
        "organisations across Pakistan, from developers and consultants to "
        "government and defence bodies.",
        "website", "images/construction.jpg"),
    "contact.html": (
        "Contact The Chemical Factory in Karachi for product advice, "
        "technical datasheets, project quotations and site support. "
        "Call +92 304 3600297 or email dechemicalfactory@gmail.com.",
        "website", "images/roof-structure.jpg"),
}

# Stripped for the new policy pages too (Phase 3.5).
META["privacy.html"] = (
    "How The Chemical Factory collects, uses and protects the information "
    "you submit through this website. Draft pending legal review.",
    "website", "images/logo.jpeg")
META["terms.html"] = (
    "Terms of use for The Chemical Factory's website and products. Draft "
    "pending legal review.",
    "website", "images/logo.jpeg")
META["cookie.html"] = (
    "Which cookies and local storage this website uses, and why. Draft "
    "pending legal review.",
    "website", "images/logo.jpeg")


def title_of(src):
    m = re.search(r"<title>(.*?)</title>", src, re.S | re.I)
    return m.group(1).strip() if m else None


def build(page, title, desc, og_type, og_image):
    """Return the meta block, minus the canonical/og:url that need a domain."""
    return (
        '\n      <!-- SEO (Phase 3.4) -->\n'
        '      <meta name="description" content="{desc}" />\n'
        '      <meta name="robots" content="index, follow, max-image-preview:large" />\n'
        '      <meta property="og:type" content="{og_type}" />\n'
        '      <meta property="og:site_name" content="{site}" />\n'
        '      <meta property="og:title" content="{title}" />\n'
        '      <meta property="og:description" content="{desc}" />\n'
        '      <meta property="og:image" content="{img}" />\n'
        '      <meta property="og:image:alt" content="{title}" />\n'
        '      <!-- TODO(owner): canonical + og:url need the live domain.\n'
        '           Run python tools/seo.py to see the exact lines once known.\n'
        '      <link rel="canonical" href="{{SITE_URL}}/{page}" />\n'
        '      <meta property="og:url" content="{{SITE_URL}}/{page}" /> -->\n'
        '      <meta name="twitter:card" content="summary_large_image" />\n'
        '      <meta name="twitter:title" content="{title}" />\n'
        '      <meta name="twitter:description" content="{desc}" />\n'
        '      <meta name="twitter:image" content="{img}" />'
    ).format(desc=desc, og_type=og_type, site=SITE_NAME, title=title,
             img=og_image, page=page)


def main():
    changed = 0
    for page, (desc, og_type, og_image) in META.items():
        if not glob.glob(page):
            continue                      # policy pages not created yet
        src = io.open(page, encoding="utf-8", newline="").read()
        if 'name="description"' in src:
            print("  %-22s already has a description, skipped" % page)
            continue

        title = title_of(src)
        block = build(page, title, desc, og_type, og_image)

        # insert immediately after </title>
        m = re.search(r"</title>", src, re.I)
        if not m:
            print("  %-22s NO <title>, skipped" % page)
            continue
        out = src[:m.end()] + block + src[m.end():]
        io.open(page, "w", encoding="utf-8", newline="").write(out)
        changed += 1
        print("  %-22s + description (%d chars), og + twitter card" % (page, len(desc)))

    print("\n%d page(s) updated" % changed)
    return 0


if __name__ == "__main__":
    sys.exit(main())

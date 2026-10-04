#!/usr/bin/env python
"""Phase 3.5: generate privacy.html, terms.html and cookie.html.

These three pages are structurally identical apart from their body copy, so
they are generated from one template. Re-run after editing CONTENT below.

IMPORTANT: every page is a DRAFT. The body deliberately avoids stating legal
positions the business has not confirmed (no retention periods in days, no
jurisdiction clause, no named processors). Where a real policy needs a fact we
do not have, the text says so and carries a TODO for the owner rather than
inventing something plausible. These need review by a lawyer before launch.

Run:  python tools/policy-pages.py
"""
import io
import os
import sys

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

CSP = ("default-src 'self'; script-src 'self'; "
       "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
       "font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; "
       "connect-src 'self'; "
       "frame-src https://www.google.com https://www.youtube-nocookie.com; "
       "object-src 'none'; base-uri 'self'; form-action 'self'")

DRAFT_BANNER = """
      <div class="policy-draft" role="note">
        <strong>Draft &mdash; not yet legally reviewed.</strong>
        This page is a plain-English starting point. It is not legal advice and
        has not been checked by a lawyer. Items marked
        <em>TODO</em> need a decision from the business before this goes live.
      </div>
"""

STYLE = """
/* Policy pages (privacy / terms / cookie) - Phase 3.5 */
.policy-draft {
  background: #fff8e6;
  border: 1px solid #e8d9a8;
  border-left: 4px solid #b8860b;
  border-radius: 0.5rem;
  padding: 1rem 1.25rem;
  margin: 0 0 2.5rem;
  font-size: 0.9375rem;
  line-height: 1.6;
}
.policy-draft strong { color: #7a5c00; }
.policy-body { max-width: 46rem; }
.policy-body h2 {
  margin: 2.75rem 0 0.75rem;
  font-size: 1.25rem;
  line-height: 1.3;
}
.policy-body h3 { margin: 1.75rem 0 0.5rem; font-size: 1.0625rem; }
.policy-body p,
.policy-body li { font-size: 0.9375rem; line-height: 1.75; color: var(--gray-600); }
.policy-body ul { padding-left: 1.25rem; margin: 0.75rem 0; }
.policy-body li { margin-bottom: 0.4rem; }
.policy-body li::marker { color: var(--burgundy); }
.policy-body a { color: var(--burgundy); text-decoration: underline; }
.policy-body a:hover { color: var(--burgundy-dark); }
.policy-todo {
  display: inline-block;
  background: #fdecec;
  border: 1px solid #f2c2c2;
  border-radius: 0.25rem;
  padding: 0.05rem 0.4rem;
  font-size: 0.8125rem;
  font-style: normal;
  color: #a32020;
}
.policy-updated {
  margin-top: 3rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--gray-200);
  font-size: 0.8125rem;
  color: var(--gray-500);
}
"""

TEMPLATE = """<!doctype html>
<html lang="en" class="scroll-smooth">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Content-Security-Policy" content="{csp}" />
    <meta name="referrer" content="strict-origin-when-cross-origin" />
    <title>{title}</title>
    <meta name="description" content="{desc}" />
    <meta name="robots" content="noindex, follow" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="The Chemical Factory" />
    <meta property="og:title" content="{title}" />
    <meta property="og:description" content="{desc}" />
    <meta property="og:image" content="images/logo.jpeg" />
    <!-- TODO(owner): canonical + og:url need the live domain.
    <link rel="canonical" href="{{SITE_URL}}/{page}" />
    <meta property="og:url" content="{{SITE_URL}}/{page}" /> -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="{title}" />
    <meta name="twitter:description" content="{desc}" />
    <meta name="twitter:image" content="images/logo.jpeg" />
    <link rel="stylesheet" href="css/styles.css">
    <link rel="stylesheet" href="css/icons-anim.css">
    <link rel="stylesheet" href="css/pages.css">
    <link rel="icon" type="image/png" href="images/fav-log.png" />
    <style>{style}</style>
  </head>
  <body data-page="policy">
    <a class="skip-link" href="#main">Skip to content</a>
    <div id="preloader-root"></div>
    <div id="navbar-root"></div>

    <main id="main">
      <section class="page-hero">
        <picture class="page-hero__banner-media">
          <img class="page-hero__banner" src="images/banner.webp" alt="" width="1983" height="793" loading="eager" fetchpriority="high" decoding="async" />
        </picture>
        <div class="container">
          <h1 class="page-hero__title">{h1}</h1>
          <p class="page-hero__sub">{sub}</p>
        </div>
      </section>

      <section class="page-section">
        <div class="container">
          {banner}
          <div class="policy-body">
{body}
            <p class="policy-updated">
              Draft generated for The Chemical Factory, Karachi, Pakistan.
              <em>TODO(owner): set the effective date once this is reviewed.</em>
            </p>
          </div>
        </div>
      </section>
    </main>

    <div id="footer-root"></div>
    <div id="modal-root"></div>

    <script src="js/vendor/gsap.min.js"></script>
    <script src="js/vendor/ScrollTrigger.min.js"></script>
    <script src="js/motion.js"></script>
    <script src="js/icons.js"></script>
    <script src="js/components.js"></script>
    <script src="js/forms.js"></script>
    <script src="js/main.js"></script>
  </body>
</html>
"""

TODO = '<em class="policy-todo">TODO</em>'

PRIVACY_BODY = """            <h2>What this website collects</h2>
            <p>
              This website is a static brochure plus a set of forms. It has no
              user accounts, no login and no advertising or analytics trackers.
            </p>
            <h3>Information you send us</h3>
            <p>
              If you use the enquiry or quote forms, we receive whatever you
              type in them: your name, contact details, project location and
              the description you provide.
            </p>
            <ul>
              <li>
                <strong>Contact forms:</strong> name, email address, phone
                number and your message.
              </li>
              <li>
                <strong>Product inspection request:</strong> the product you
                are interested in, the approximate area, and a description of
                the damage and any previous repair attempts.
              </li>
            </ul>
            <p>
              While the site sends form details to your own email application so
              you can review and send the message, nothing is transmitted to a
              server we control until you send it.
              {todo} if a server-side form handler is added later, this
              section and the cookies page must be updated to match.
            </p>

            <h3>Information collected automatically</h3>
            <p>
              The site stores one item in your browser's session storage, a
              flag recording that you have seen the loading animation, so the
              animation is not shown again during the same visit. This never
              leaves your browser.
            </p>

            <h2>How your information is used</h2>
            <ul>
              <li>To reply to your enquiry or quote request.</li>
              <li>To send technical datasheets you have asked for.</li>
              <li>To prepare a quotation or technical recommendation.</li>
            </ul>
            <p>
              We do not sell your information, and we do not share it with
              advertisers.
            </p>

            <h2>How long it is kept</h2>
            <p>
              Enquiry records are kept only as long as needed to deal with the
              enquiry and any resulting project.
              {todo} confirm the retention period and write it here as a
              specific period, for example a number of months or years.
            </p>

            <h2>Who can see it</h2>
            <p>
              Staff at The Chemical Factory. If a project requires it, we would
              also share details with a contractor or consultant working on
              your project, and we would tell you when we do.
            </p>

            <h2>Embedded content</h2>
            <p>
              The contact page embeds a Google map. Google may set its own
              cookies and process your IP address when that map loads. If you
              would rather it did not, opening the page with a content blocker
              enabled avoids the request entirely.
            </p>

            <h2>Your choices</h2>
            <p>
              You can ask us at any time what information we hold about you, ask
              for a copy, or ask us to delete it. Email
              <a href="mailto:dechemicalfactory@gmail.com">dechemicalfactory@gmail.com</a>.
            </p>

            <h2>Contact</h2>
            <p>
              The Chemical Factory, Office #1, Plot #99-C, Street #11, Jami
              Commercial, DHA Phase VII, Karachi, Pakistan.
              <a href="mailto:dechemicalfactory@gmail.com">dechemicalfactory@gmail.com</a>
              &middot; <a href="tel:+923043600297">+92 304 3600297</a>
            </p>""".replace("{todo}", TODO)

TERMS_BODY = """            <h2>About these terms</h2>
            <p>
              These terms cover your use of this website. Buying or using our
              products is a separate matter governed by the supply agreement or
              invoice for that order.
              {todo} have these reviewed by a lawyer and decide which
              additional sections are needed, for example a formal limitation of
              liability or a governing-law clause.
            </p>

            <h2>Product information</h2>
            <p>
              Technical datasheets, property data and coverage figures are
              supplied in good faith and are believed to be accurate at the
              time of publication. Conditions vary between substrates, and site
              preparation and application matter, so figures are guidance rather
              than a guarantee of performance.
            </p>
            <p>
              Always read the datasheet for the specific product before use. If
              you are unsure about suitability for a substrate or condition, ask
              us first.
            </p>

            <h2>Quotations and estimates</h2>
            <p>
              Prices, coverage rates and the indicative ranges shown in the
              quote estimator are estimates only. A binding price is given
              only in a written quotation. Site conditions can change a
              quantity significantly, so verify against the datasheet and, for
              larger works, ask for a site visit.
            </p>

            <h2>Intellectual property</h2>
            <p>
              The text, layout, product names and images on this site belong to
              The Chemical Factory or are used with permission. You may download
              the datasheets and quote from this site for your own projects.
              You may not resell them, rebrand them, or present them as your
              own material.
            </p>

            <h2>Third-party links</h2>
            <p>
              Where we link to another site, such as a map or a social profile,
              we do not control it and we are not responsible for its content or
              its privacy practices.
            </p>

            <h2>Availability and liability</h2>
            <p>
              We try to keep the site accurate and available but do not promise
              it will always be error-free or online. To the extent the law
              allows, we are not liable for loss arising from reliance on
              general information published here rather than on product-specific
              advice given to you.
            </p>

            <h2>Changes to these terms</h2>
            <p>
              We may update these terms. The date below shows the current
              version.
            </p>

            <h2>Contact</h2>
            <p>
              Questions about these terms:
              <a href="mailto:dechemicalfactory@gmail.com">dechemicalfactory@gmail.com</a>
              &middot; <a href="tel:+923043600297">+92 304 3600297</a>
            </p>""".replace("{todo}", TODO)

COOKIE_BODY = """            <h2>Short version</h2>
            <p>
              This site sets no advertising or analytics cookies and has no
              tracking of any kind. The only thing stored is a single flag in
              your browser's session storage, used so the loading animation is
              not shown twice in one visit.
            </p>

            <h2>What is actually used</h2>
            <h3>Session storage &mdash; cf-seen</h3>
            <p>
              When the loading animation first runs, the site writes a value of
              <code>1</code> under the key <code>cf-seen</code> in session
              storage. This is used only to decide whether to play the
              animation on the next page of the same visit.
            </p>
            <ul>
              <li><strong>Type:</strong> strictly necessary, first-party.</li>
              <li>
                <strong>Lifetime:</strong> cleared when you close the browser
                tab or window. It is never written to disk permanently.
              </li>
              <li>
                <strong>Contains:</strong> no identifier, no personal data, no
                fingerprint.
              </li>
            </ul>

            <h3>Local and quote state</h3>
            <p>
              If you open the product inspection questionnaire and then move to
              the quote form, the answers you entered are carried across in
              session storage so you do not have to retype them. This is stored
              in your browser only and is never transmitted unless you send the
              form yourself.
            </p>

            <h2>Third-party cookies</h2>
            <h3>Google Fonts</h3>
            <p>
              The site's headings and body text use Google Fonts. When those
              fonts load, Google's servers see your IP address and browser
              user agent. Google states it does not use font requests to build
              an advertising profile, but this is a transfer of data to a third
              party and it is disclosed here rather than left implicit.
            </p>
            <h3>Google Maps</h3>
            <p>
              The contact page embeds a map. Google may set cookies and process
              your data when it loads.
              {todo} if the map is switched to a static image, or removed,
              update this section.
            </p>

            <h2>Turning things off</h2>
            <p>
              Session storage cannot be blocked by a privacy setting, but it can
              be cleared at any time through your browser's site-data controls.
              Blocking third-party requests stops the font and map requests,
              in which case the page falls back to system fonts.
            </p>

            <h2>Contact</h2>
            <p>
              <a href="mailto:dechemicalfactory@gmail.com">dechemicalfactory@gmail.com</a>
            </p>""".replace("{todo}", TODO)

PAGES = {
    "privacy.html": {
        "title": "Privacy Policy — THE CHEMICAL FACTORY",
        "desc": "How The Chemical Factory collects, uses and protects the "
                "information you submit through this website. Draft pending "
                "legal review.",
        "h1": "Privacy Policy",
        "sub": "What we collect when you contact us, and what we do with it.",
        "body": PRIVACY_BODY,
    },
    "terms.html": {
        "title": "Terms & Conditions — THE CHEMICAL FACTORY",
        "desc": "Terms of use for The Chemical Factory's website and "
                "products. Draft pending legal review.",
        "h1": "Terms & Conditions",
        "sub": "Using this site, and the basis on which we supply information.",
        "body": TERMS_BODY,
    },
    "cookie.html": {
        "title": "Cookie Policy — THE CHEMICAL FACTORY",
        "desc": "Which cookies and local storage this website uses, and why. "
                "Draft pending legal review.",
        "h1": "Cookie Policy",
        "sub": "Short answer: no trackers. Here is the detail.",
        "body": COOKIE_BODY,
    },
}

NAV = {
    "privacy.html": ("#privacy", "Privacy Policy"),
    "terms.html": ("#terms", "Terms & Conditions"),
    "cookie.html": ("#cookie", "Cookie Policy"),
}


def main():
    for page, d in PAGES.items():
        html = TEMPLATE.format(
            csp=CSP, title=d["title"], desc=d["desc"], page=page,
            h1=d["h1"], sub=d["sub"], body=d["body"],
            banner=DRAFT_BANNER.strip(), style=STYLE.strip())
        io.open(page, "w", encoding="utf-8", newline="\n").write(html)
        print("  wrote %-14s (%d bytes)" % (page, len(html)))

    # Point the footer at the real pages instead of dead #anchors.
    comp = io.open("js/components.js", encoding="utf-8", newline="").read()
    changed = 0
    for page, (frag, label) in NAV.items():
        old_anchor = "'%s'" % frag
        if old_anchor in comp and ('"%s"' % page) not in comp:
            comp = comp.replace("'" + frag + "'", "'%s'" % page, 1)
            changed += 1
    if changed:
        io.open("js/components.js", "w", encoding="utf-8", newline="").write(comp)
        print("  updated %d footer link(s) in js/components.js" % changed)

    print("\nrun 'python tools/sitemap.py' to include the new pages")
    return 0


if __name__ == "__main__":
    sys.exit(main())

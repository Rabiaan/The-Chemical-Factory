/* ============================================================
   THE CHEMICAL FACTORY — shared components
   Injects the navbar, footer, and quote modal into every page
   via #nav-root / #footer-root / #modal-root placeholders.
   Nav links point to the multi-page site and highlight the
   current page (set <body data-page="...">).
   ============================================================ */
(function () {
  'use strict';

  function ic(name) {
    return window.ICON ? window.ICON(name) : '';
  }

  var NAV_ITEMS = [
    { page: 'home', href: 'index.html', label: 'Home' },
    { page: 'products', href: 'products.html', label: 'Products' },
    { page: 'projects', href: 'projects.html', label: 'Projects' },
    { page: 'clients', href: 'clients.html', label: 'Clients' },
    { page: 'datasheets', href: 'datasheets.html', label: 'Datasheets' },
    { page: 'services', href: 'services.html', label: 'Services' },
    { page: 'about', href: 'about.html', label: 'About' },
    { page: 'contact', href: 'contact.html', label: 'Contact' }
  ];

  /* Only real, verified profile URLs are listed here.
     TODO(owner): supply the genuine Facebook / LinkedIn / X profile URLs, then re-add
     them to this array. Placeholder "#" hrefs were removed because they produced
     dead links that looked clickable. See SECURITY-HEADERS.md for the full TODO list. */
  var SOCIAL = [
    { label: 'Instagram', href: 'https://www.instagram.com/thechemicalfactory/', name: 'instagram' },
    { label: 'Facebook', href: 'https://www.facebook.com/p/The-Chemical-Factory-61568350412428/', name: 'facebook' }
  ];

  var currentPage = (document.body && document.body.getAttribute('data-page')) || '';

  function navLinks(mobile) {
    return NAV_ITEMS.map(function (item) {
      var active = item.page === currentPage ? ' is-active' : '';
      if (mobile) {
        return '<a href="' + item.href + '" class="mobile-menu__link' + active + '">' + item.label + '</a>';
      }
      var icon = '';
      return '<a href="' + item.href + '" class="nav-pill__link' + active + '">' + icon + '<span>' + item.label + '</span></a>';
    }).join('');
  }

  var NAVBAR =
    '<header id="navbar" class="navbar">'
    + '<div class="navbar__inner">'
    + '<a href="index.html" class="brand-link" aria-label="The Chemical Factory - Home">'
    + '<span class="brand-pill"><img src="images/fav-log.webp" alt="The Chemical Factory" class="logo__img"></span>'
    + '</a>'
    + '<nav class="nav-pill">' + navLinks(false) + '</nav>'
    + '<div class="navbar__actions">'
    + '<button type="button" class="btn-nav-cta js-open-quote">'
    + '<span>Let\'s Talk to Us</span>'
    + '<span class="btn-nav-cta__circle">' + ic('arrow-right') + '</span>'
    + '</button>'
    + '</div>'
    + '<button type="button" id="mobile-menu-btn" class="mobile-toggle" aria-label="Toggle navigation" aria-expanded="false">'
    + '<svg id="icon-menu" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>'
    + '<svg id="icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:none"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>'
    + '</button>'
    + '</div>'
    + '<div id="mobile-menu" class="mobile-menu">'
    + '<div class="mobile-menu__links">'
    + navLinks(true)
    + '<hr class="mobile-menu__divider">'
    + '<button type="button" class="mobile-menu__quote js-open-quote"><span>Get a Quick Quote</span>' + ic('arrow-right') + '</button>'
    + '</div>'
    + '</div>'
    + '</header>';

  var FOOTER =
    '<footer class="tcf-footer">'
    + '<div class="tcf-footer__inner">'
    + '<div class="tcf-footer__top">'
    + '<div class="tcf-footer__brand">'
    + '<a href="index.html" class="tcf-footer__logo" aria-label="The Chemical Factory home">'
    + '<img src="images/fav-log.webp" alt="" width="44" height="44" loading="lazy" decoding="async">'
    + '<span>THE CHEMICAL FACTORY</span>'
    + '</a>'
    + '<p class="tcf-footer__about">'
    + 'Construction chemicals and building products for concrete, joints, roofs and foundations, backed by practical technical support across Pakistan.'
    + '</p>'
    + '<div class="tcf-footer__social">'
    + '<a href="https://www.instagram.com/thechemicalfactory/" aria-label="Instagram" target="_blank" rel="noopener noreferrer">'
    + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="5"></rect><circle cx="12" cy="12" r="4"></circle><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"></circle></svg>'
    + '</a>'
    + '<a href="https://www.facebook.com/p/The-Chemical-Factory-61568350412428/" aria-label="Facebook" target="_blank" rel="noopener noreferrer">'
    + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>'
    + '</a>'
    + '</div>'
    + '</div>'
    + '<nav class="tcf-footer__col" aria-label="Footer">'
    + '<h3 class="tcf-footer__title">Explore</h3>'
    + '<ul class="tcf-footer__links">'
    + '<li><a href="index.html">Home</a></li>'
    + '<li><a href="products.html">Products</a></li>'
    + '<li><a href="projects.html">Projects</a></li>'
    + '<li><a href="clients.html">Clients</a></li>'
    + '<li><a href="datasheets.html">Datasheets</a></li>'
    + '<li><a href="services.html">Services</a></li>'
    + '<li><a href="about.html">About</a></li>'
    + '<li><a href="contact.html">Contact</a></li>'
    + '</ul>'
    + '</nav>'
    + '<div class="tcf-footer__col">'
    + '<h3 class="tcf-footer__title">Get in touch</h3>'
    + '<ul class="tcf-footer__contact">'
    + '<li>'
    + '<span class="tcf-footer__ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"></path></svg></span>'
    + '<span><a href="tel:+923043600297">+92 304 3600297</a><br><a href="tel:+922135885870">+92 21 35885870</a></span>'
    + '</li>'
    + '<li>'
    + '<span class="tcf-footer__ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="m22 7-10 6L2 7"></path></svg></span>'
    + '<span><a href="mailto:dechemicalfactory@gmail.com">dechemicalfactory@gmail.com</a></span>'
    + '</li>'
    + '</ul>'
    + '<a href="contact.html" class="tcf-footer__cta">Request a Quote'
    + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>'
    + '</a>'
    + '</div>'
    + '</div>'
    + '<div class="tcf-footer__offices">'
    + '<h3 class="tcf-footer__title">Our offices</h3>'
    + '<div class="tcf-footer__office-grid">'
    + '<article class="tcf-office">'
    + '<span class="tcf-footer__ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></span>'
    + '<h4>Karachi</h4>'
    + '<p>Office #1, Plot #99-C, Street #11, Jami Commercial, DHA Phase VII, Karachi, Pakistan</p>'
    + '<a href="https://www.google.com/maps/search/?api=1&query=Plot+99-C+Jami+Commercial+DHA+Phase+7+Karachi" target="_blank" rel="noopener noreferrer">Get directions</a>'
    + '</article>'
    + '<article class="tcf-office">'
    + '<span class="tcf-footer__ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></span>'
    + '<h4>Lahore</h4>'
    + '<p>Office#1, 1st floor Butt Plaza, near Broadway, Pak Arab Society, Lahore</p>'
    + '<a href="https://www.google.com/maps/search/?api=1&query=Butt+Plaza+Broadway+Pak+Arab+Society+Lahore" target="_blank" rel="noopener noreferrer">Get directions</a>'
    + '</article>'
    + '<article class="tcf-office">'
    + '<span class="tcf-footer__ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></span>'
    + '<h4>Rahim Yar Khan</h4>'
    + '<p>Office no.04, Street 01, Main Nor-e-Wali Tibi Rd, Rahim Yar Khan</p>'
    + '<a href="https://www.google.com/maps/search/?api=1&query=Nor-e-Wali+Tibi+Rd+Rahim+Yar+Khan" target="_blank" rel="noopener noreferrer">Get directions</a>'
    + '</article>'
    + '</div>'
    + '</div>'
    + '<div class="tcf-footer__bottom">'
    + '<p>&copy; <span id="year">2026</span> THE CHEMICAL FACTORY. All rights reserved. Built to Dominate.<br>Built by <a href="https://frame-gen.com" target="_blank" rel="noopener noreferrer">Framegen</a></p>'
    + '<ul class="tcf-footer__legal">'
    + '<li><a href="privacy.html">Privacy Policy</a></li>'
    + '<li><a href="terms.html">Terms &amp; Conditions</a></li>'
    + '<li><a href="cookie.html">Cookie Policy</a></li>'
    + '</ul>'
    + '</div>'
    + '</div>'
    + '</footer>';

  var QUOTE_MODAL =
    '<div id="quote-modal" class="lightbox" aria-hidden="true">'
    + '<div class="quote-modal">'
    + '<div class="modal-header">'
    + '<div>'
    + '<span class="modal-header__eyebrow">Free Site Inspection &amp; Estimate</span>'
    + '<h3 class="modal-header__title">Request a Quote</h3>'
    + '</div>'
    + '<button type="button" class="modal-close js-close-quote" aria-label="Close modal">'
    + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>'
    + '</button>'
    + '</div>'
    + '<div class="modal-body">'
    + '<div id="quote-form-view">'
    + '<form id="quote-form" class="quote-form" novalidate method="post" action="send-mail.php">'
    /* Honeypot: off-screen, never filled by a human. Dropped by js/forms.js. */
    + '<div class="hp-field" aria-hidden="true">'
    + '<label for="quote-website">Company website</label>'
    + '<input type="text" id="quote-website" name="company-website" tabindex="-1" autocomplete="off" value="" />'
    + '</div>'
    + '<div class="estimator">'
    + '<div class="estimator__title">'
    + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>'
    + '<span>Interactive Coverage Estimator</span>'
    + '</div>'
    + '<div class="estimator__grid">'
    + '<div>'
    + '<label class="form-label" for="area-type">Structure Area Type</label>'
    + '<select id="area-type" class="form-select"><option>Waterproofing</option><option>Construction Chemicals</option><option>Heat Insulation</option><option>Steel Anchoring</option><option>Epoxy Flooring</option><option>PU Injection System</option><option>Building Rehabilitation</option><option>CFRP Strengthening</option></select>'
    + '</div>'
    + '<div>'
    + '<label class="form-label" for="system">Chemical Coating System</label>'
    + '<select id="system" class="form-select"><option>Bitumen Membrane / Coating</option><option>Acrylic Two Component</option><option>Single Component Crystalline</option><option>Polyurethane Base Waterproofing</option><option>Polyurethane / Epoxy Injection</option><option>Epoxy &amp; PU Flooring</option><option>PS Board Insulation</option><option>Cementitious &amp; Epoxy Repair</option><option>CFRP Strengthening</option><option>Chemical Steel Anchor</option></select>'
    + '</div>'
    + '</div>'
    + '<div>'
    + '<div class="estimator__slider-head"><span>Estimated Area Size</span><span id="sqft-value" class="estimator__sqft">1,500 sq. ft.</span></div>'
    + '<input type="range" id="sqft-slider" class="slider" min="200" max="20000" step="100" value="1500" />'
    + '</div>'
    + '<div class="estimator__result"><span>Estimated Project Range:</span><span id="est-range" class="estimator__price">$3,300 to $5,700</span></div>'
    + '</div>'
    + '<div class="form-grid">'
    + '<div><label class="form-label" for="name">Full Name <span aria-hidden="true">*</span></label>'
    + '<input type="text" id="name" name="name" class="form-input" autocomplete="name" maxlength="100" placeholder="e.g. Ahmed Khan" required data-validate="name" aria-describedby="name-error" aria-required="true" />'
    + '<p class="form-error" id="name-error" aria-live="polite"></p></div>'
    + '<div><label class="form-label" for="phone">Phone Number <span aria-hidden="true">*</span></label>'
    + '<input type="tel" id="phone" name="phone" class="form-input" autocomplete="tel" maxlength="20" placeholder="e.g. +92 304 3600297" required data-validate="phone" aria-describedby="phone-error" aria-required="true" />'
    + '<p class="form-error" id="phone-error" aria-live="polite"></p></div>'
    + '<div><label class="form-label" for="email">Email Address <span class="form-field__opt">(optional)</span></label>'
    + '<input type="email" id="email" name="email" class="form-input" autocomplete="email" maxlength="254" placeholder="name@example.com" data-validate="email" aria-describedby="email-error" />'
    + '<p class="form-error" id="email-error" aria-live="polite"></p></div>'
    + '<div><label class="form-label" for="city">City / Location</label>'
    + '<input type="text" id="city" name="city" class="form-input" autocomplete="address-level2" maxlength="120" placeholder="e.g. Karachi, Pakistan" /></div>'
    + '</div>'
    + '<div><label class="form-label" for="notes">Project Notes / Existing Leak Symptoms</label>'
    + '<textarea id="notes" name="notes" class="form-textarea" rows="3" maxlength="500" placeholder="Describe active leaks, surface conditions, or special site access..."></textarea></div>'
    + '<div class="inspection-picker" id="inspection-picker" style="display:none">'
    + '<div class="inspection-picker__title">'
    + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>'
    + '<span>Inspection Questions</span>'
    + '</div>'
    + '<p class="inspection-picker__hint">Answer these so the engineer arrives prepared. Your answers are carried into the contact form automatically.</p>'
    + '<div class="inspection-picker__product" id="inspection-product"></div>'
    + '<div class="form-grid">'
    + '<div><label class="form-label" for="insp-area">Approximate Area (sq. ft.)</label><input type="number" id="insp-area" name="insp-area" class="form-input" min="0" max="1000000" step="50" maxlength="9" inputmode="numeric" placeholder="e.g. 1500" /></div>'
    + '<div><label class="form-label" for="insp-timeline">When do you need it done?</label><select id="insp-timeline" class="form-select"><option>Urgent - active leak</option><option>Within 1 month</option><option>Within 3 months</option><option>Planning / budgeting stage</option></select></div>'
    + '</div>'
    + '<div><label class="form-label" for="insp-structure">Structure / Area Type *</label><select id="insp-structure" class="form-select"><option>Terrace &amp; Flat Roof</option><option>Basement &amp; Sub-structure Tanking</option><option>Bathroom &amp; Wet Area</option><option>Industrial Floor / Epoxy Decking</option><option>Expansion Joint &amp; Injection</option><option>Water Tank / Reservoir</option><option>Podium &amp; Retaining Wall</option><option>Structural Strengthening</option><option>Other</option></select></div>'
    + '<div><label class="form-label" for="insp-symptoms">Observed Symptoms</label>'
    + '<div class="chip-group" id="insp-symptoms">'
    + '<label class="chip-check"><input type="checkbox" value="Active water leak" /><span>Active water leak</span></label>'
    + '<label class="chip-check"><input type="checkbox" value="Dampness / staining" /><span>Dampness / staining</span></label>'
    + '<label class="chip-check"><input type="checkbox" value="Efflorescence" /><span>Efflorescence</span></label>'
    + '<label class="chip-check"><input type="checkbox" value="Cracks in substrate" /><span>Cracks in substrate</span></label>'
    + '<label class="chip-check"><input type="checkbox" value="Peeling / delamination" /><span>Peeling / delamination</span></label>'
    + '<label class="chip-check"><input type="checkbox" value="Sealant failure" /><span>Sealant failure</span></label>'
    + '<label class="chip-check"><input type="checkbox" value="No visible defect - preventive check" /><span>Preventive check</span></label>'
    + '</div></div>'
    + '<div><label class="form-label" for="insp-history">Previous Repair Attempts</label><textarea id="insp-history" name="insp-history" class="form-textarea" rows="2" maxlength="500" placeholder="What has already been tried, and how long did it last?"></textarea></div>'
    + '<div class="inspection-picker__note">You will be taken to our contact form with all of this pre-filled &mdash; just add your name and phone number.</div>'
    + '<div class="inspection-picker__actions">'
    + '<button type="button" class="btn-inspection-continue js-inspection-continue">'
    + '<span>Continue to Contact Form</span>'
    + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>'
    + '</button>'
    + '</div>'
    + '</div>'
    + '<div class="form-footer">'
    + '<div class="form-footer__note">'
    + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>'
    + '<span>100% Free Site Inspection &amp; Zero Obligation</span>'
    + '</div>'
    + '<button type="submit" class="btn-submit"><span>Submit Request</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg></button>'
    + '</div>'
    + '</form>'
    + '</div>'
    + '<div id="quote-success-view" class="quote-success" style="display:none">'
    + '<div class="quote-success__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg></div>'
    + '<h4 class="quote-success__title">Inspection Request Received!</h4>'
    + '<p class="quote-success__text">Thank you, <span id="success-name" class="quote-success__strong">Valued Client</span>. One of our chemical engineers will contact you at <span id="success-phone" class="quote-success__strong">your number</span> to schedule a free moisture inspection in <span id="success-city" class="quote-success__strong">your city</span>.</p>'
    + '<button type="button" class="btn-success-done">Done</button>'
    + '</div>'
    + '</div>'
    + '</div>'
    + '</div>';

  var PRELOADER =
    '<div class="preloader" id="preloader" aria-hidden="true">'
    + '<div class="preloader__text">'
    + 'CHEMICALLY ENGINEERED FOR <em class="heading-accent">EXCELLENCE</em>'
    + '</div>'
    + '<div class="preloader__brush">'
    /* NOTE: no inline onerror= here on purpose. CSP is script-src 'self', which
       blocks inline event handlers. The fallback is attached in JS below. */
    + '<img src="images/brush.webp" alt="" class="preloader__brush-img" />'
    + '</div>'
    + '</div>';

  /* ---------- Preloader text split (animation item 12) ----------
     Turns the loading line into per-word spans so js/animations.js can
     stagger them. Nothing about the reading order changes: the full
     string stays on the wrapper as aria-label and every generated span
     is aria-hidden, so a screen reader still announces one sentence
     rather than a run of separate words.

     This runs here rather than in animations.js on purpose: main.js
     captures text.offsetWidth for the brush wipe, and it has to measure
     the final markup, not the plain string. */
  var SPLIT_CLASS = 'preloader__word';

  /* Appends "a b c" to frag as span('a') span('b') span('c').
     Spacing between words is handled by flex gap on the container. */
  function pushWords(text, frag) {
    var made = [];
    var parts = String(text).split(/(\s+)/);
    for (var i = 0; i < parts.length; i++) {
      var part = parts[i];
      if (!part) continue;
      if (/^\s+$/.test(part)) continue;
      var span = document.createElement('span');
      span.className = SPLIT_CLASS;
      span.setAttribute('aria-hidden', 'true');
      span.textContent = part;
      frag.appendChild(span);
      made.push(span);
    }
    return made;
  }

  /* Walks one node's children, splitting text nodes and keeping element
     wrappers (e.g. <em class="heading-accent">) so the accent survives. */
  function splitNode(source, target) {
    var words = [];
    var kids = Array.prototype.slice.call(source.childNodes);
    for (var i = 0; i < kids.length; i++) {
      var kid = kids[i];
      if (kid.nodeType === 3) {
        words = words.concat(pushWords(kid.nodeValue, target));
      } else if (kid.nodeType === 1) {
        var shell = kid.cloneNode(false);
        shell.setAttribute('aria-hidden', 'true');
        words = words.concat(splitNode(kid, shell));
        target.appendChild(shell);
      }
    }
    return words;
  }

  function splitPreloaderText() {
    var text = document.querySelector('#preloader .preloader__text');
    if (!text || text.__tcfSplit) return;
    text.__tcfSplit = true;

    var source = text.textContent.replace(/\s+/g, ' ').trim();
    if (!source) return;

    var frag = document.createDocumentFragment();
    var words = splitNode(text, frag);
    if (!words.length) return;

    text.textContent = '';
    text.setAttribute('aria-label', source);
    text.appendChild(frag);
    /* Handed to js/animations.js, which only plays the tween. */
    text.__tcfWords = words;
  }

  /* Replaces the old inline onerror="this.style.display='none'" on the brush image.
     Keeps the preloader looking correct if images/brush.webp is ever missing. */
  function guardBrushImage() {
    var img = document.querySelector('#preloader .preloader__brush-img');
    if (!img) return;
    img.addEventListener('error', function () { img.style.display = 'none'; });
    /* Already-complete/failed images do not always fire 'error', so check state too. */
    if (img.complete && img.naturalWidth === 0) img.style.display = 'none';
  }

  var WHATSAPP_SVG =
    '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">'
    + '<path d="M16.004 3.2c-7.06 0-12.8 5.74-12.8 12.8 0 2.26.59 4.46 1.71 6.4L3.2 28.8l6.55-1.71a12.74 12.74 0 0 0 6.25 1.63c7.06 0 12.8-5.74 12.8-12.8 0-3.42-1.33-6.63-3.75-9.05a12.72 12.72 0 0 0-9.05-3.67zm7.48 18.28c-.31.88-1.83 1.71-2.52 1.77-.68.07-1.35.31-4.53-1.01-3.83-1.59-6.25-5.72-6.44-5.98-.19-.26-1.54-2.04-1.54-3.89s.98-2.76 1.32-3.14c.34-.38.75-.48 1-.48.25 0 .5.01.72.01.23.01.54-.09.85.65.31.76 1.06 2.62 1.15 2.81.1.19.16.42.03.68-.13.26-.19.42-.39.65-.19.23-.41.51-.58.68-.19.19-.39.4-.17.78.23.38 1.01 1.66 2.16 2.69 1.49 1.33 2.74 1.74 3.13 1.94.39.19.61.16.84-.1.23-.26.97-1.13 1.22-1.52.26-.39.52-.32.87-.19.36.13 2.26 1.07 2.65 1.26.39.19.64.29.74.45.09.16.09.94-.23 1.81z"/>'
    + '</svg>';

  function mountWhatsApp() {
    if (document.getElementById('whatsapp-fab')) return;
    var fab = document.createElement('a');
    fab.id = 'whatsapp-fab';
    fab.className = 'whatsapp-fab';
    fab.href = 'https://wa.me/923043600297';
    fab.target = '_blank';
    fab.rel = 'noopener noreferrer';
    fab.setAttribute('aria-label', 'Chat on WhatsApp');
    fab.innerHTML = WHATSAPP_SVG;
    document.body.appendChild(fab);
  }

  function mount() {
    var navRoot = document.getElementById('nav-root');
    var footerRoot = document.getElementById('footer-root');
    var modalRoot = document.getElementById('modal-root');

    if (navRoot) navRoot.innerHTML = NAVBAR;
    if (footerRoot) footerRoot.innerHTML = FOOTER;
    if (modalRoot) modalRoot.innerHTML = QUOTE_MODAL;

    /* Footer year */
    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    /* Navbar scrolled state */
    var navbar = document.getElementById('navbar');
    function onScroll() {
      if (navbar) navbar.classList.toggle('scrolled', (window.scrollY || 0) > 30);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* Mobile menu */
    var mobileMenu = document.getElementById('mobile-menu');
    var mobileMenuBtn = document.getElementById('mobile-menu-btn');
    var iconMenu = document.getElementById('icon-menu');
    var iconClose = document.getElementById('icon-close');

    function closeMobileMenu() {
      if (!mobileMenu) return;
      mobileMenu.classList.remove('open');
      if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'false');
      if (iconMenu) iconMenu.style.display = 'block';
      if (iconClose) iconClose.style.display = 'none';
    }

    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener('click', function () {
        var isOpen = mobileMenu.classList.toggle('open');
        mobileMenuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        if (iconMenu) iconMenu.style.display = isOpen ? 'none' : 'block';
        if (iconClose) iconClose.style.display = isOpen ? 'block' : 'none';
      });
    }

    var menuLinks = document.querySelectorAll('#mobile-menu a, #mobile-menu button');
    for (var i = 0; i < menuLinks.length; i++) {
      menuLinks[i].addEventListener('click', closeMobileMenu);
    }

    mountWhatsApp();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }

    /* ---------- Preloader visibility ----------
     Disabled: using the new fullscreen circular loader on home only. */
  function shouldShowPreloader() {
    return false;
  }

  /* Preloader injection disabled. */
  var preloaderRoot = document.getElementById('preloader-root');
  if (preloaderRoot) {
    preloaderRoot.innerHTML = '';
  }
})();
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
    { page: 'home', href: 'index.html', label: 'Home', icon: true },
    { page: 'products', href: 'products.html', label: 'Products' },
    { page: 'projects', href: 'projects.html', label: 'Projects' },
    { page: 'datasheets', href: 'datasheets.html', label: 'Datasheets' },
    { page: 'services', href: 'services.html', label: 'Services' },
    { page: 'about', href: 'about.html', label: 'About' },
    { page: 'contact', href: 'contact.html', label: 'Contact' }
  ];

  var SOCIAL = [
    { label: 'Instagram', href: '#instagram', name: 'instagram' },
    { label: 'Facebook', href: '#facebook', name: 'facebook' },
    { label: 'LinkedIn', href: '#linkedin', name: 'linkedin' },
    { label: 'Twitter X', href: '#twitter', name: 'twitter' }
  ];

  var currentPage = (document.body && document.body.getAttribute('data-page')) || '';

  function navLinks(mobile) {
    return NAV_ITEMS.map(function (item) {
      var active = item.page === currentPage ? ' is-active' : '';
      if (mobile) {
        return '<a href="#" class="mobile-menu__link' + active + '">' + item.label + '</a>';
      }
      var icon = item.icon ? '<span class="nav-pill__icon">' + ic('home') + '</span>' : '';
      return '<a href="#" class="nav-pill__link' + active + '">' + icon + '<span>' + item.label + '</span></a>';
    }).join('');
  }

  var NAVBAR =
    '<header id="navbar" class="navbar">'
    + '<div class="navbar__inner">'
    + '<a href="index.html" class="brand-link" aria-label="The Chemical Factory - Home">'
    + '<span class="brand-pill"><img src="images/logo-removebg-preview.png" alt="The Chemical Factory" class="logo__img"></span>'
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
    '<footer id="contact" class="footer">'
    + '<div class="footer__content">'
    + '<p class="footer__desc">'
    + 'Discover advanced chemical waterproofing systems crafted with high-purity polymer engineering, modern application standards, and guaranteed long-term protection for every structure.'
    + '</p>'
    + '<div class="social-row">'
    + SOCIAL.map(function (s) {
      return '<a href="' + s.href + '" aria-label="' + s.label + '" class="social-icon">' + ic(s.name) + '</a>';
    }).join('')
    + '</div>'
    + '<nav class="footer__nav">'
    + NAV_ITEMS.map(function (item) {
      return '<a href="' + item.href + '" class="footer__nav-link">' + item.label + '</a>';
    }).join('')
    + '</nav>'
    + '<div class="footer__legal">'
    + '<a href="#privacy" class="footer__legal-link">Privacy Policy</a>'
    + '<span>|</span>'
    + '<a href="#terms" class="footer__legal-link">Terms &amp; Conditions</a>'
    + '<span>|</span>'
    + '<a href="#cookie" class="footer__legal-link">Cookie Policy</a>'
    + '</div>'
    + '<div class="footer__copy">© <span id="year">2025</span> THE CHEMICAL FACTORY. All rights reserved. Built to Dominate.</div>'
    + '<div class="footer__credit">Built by <a href="https://www.frame-gen.com/" target="_blank" rel="noopener noreferrer">Framegen</a></div>'
    + '</div>'
    + '</footer>';

  var QUOTE_MODAL =
    '<div id="quote-modal" class="lightbox" aria-hidden="true">'
    + '<div class="quote-modal">'
    + '<div class="modal-header">'
    + '<div>'
    + '<span class="modal-header__eyebrow">Free Site Inspection &amp; Estimate</span>'
    + '<h3 class="modal-header__title">Get a Waterproofing Quote</h3>'
    + '</div>'
    + '<button type="button" class="modal-close js-close-quote" aria-label="Close modal">'
    + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>'
    + '</button>'
    + '</div>'
    + '<div class="modal-body">'
    + '<div id="quote-form-view">'
    + '<form id="quote-form" class="quote-form" novalidate>'
    + '<div class="estimator">'
    + '<div class="estimator__title">'
    + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>'
    + '<span>Interactive Coverage Estimator</span>'
    + '</div>'
    + '<div class="estimator__grid">'
    + '<div>'
    + '<label class="form-label" for="area-type">Structure Area Type</label>'
    + '<select id="area-type" class="form-select"><option>Terrace &amp; Flat Roof</option><option>Basement &amp; Sub-structure Tanking</option><option>Bathroom &amp; Wet Area</option><option>Industrial Deck &amp; Polyurea</option><option>Expansion Joint &amp; Injection</option></select>'
    + '</div>'
    + '<div>'
    + '<label class="form-label" for="system">Chemical Coating System</label>'
    + '<select id="system" class="form-select"><option>Polyurethane Liquid Membrane</option><option>Fast-Curing Polyurea Spray</option><option>Bituminous Torch-on Sheet</option><option>Crystalline Slurry Coating</option></select>'
    + '</div>'
    + '</div>'
    + '<div>'
    + '<div class="estimator__slider-head"><span>Estimated Area Size</span><span id="sqft-value" class="estimator__sqft">1,500 sq. ft.</span></div>'
    + '<input type="range" id="sqft-slider" class="slider" min="200" max="20000" step="100" value="1500" />'
    + '</div>'
    + '<div class="estimator__result"><span>Estimated Project Range:</span><span id="est-range" class="estimator__price">$3,300 – $5,700</span></div>'
    + '</div>'
    + '<div class="form-grid">'
    + '<div><label class="form-label" for="name">Full Name *</label><input type="text" id="name" class="form-input" placeholder="e.g. John Miller" required /></div>'
    + '<div><label class="form-label" for="phone">Phone Number *</label><input type="tel" id="phone" class="form-input" placeholder="e.g. +1 (555) 019-2834" required /></div>'
    + '<div><label class="form-label" for="email">Email Address</label><input type="email" id="email" class="form-input" placeholder="john@example.com" /></div>'
    + '<div><label class="form-label" for="city">City / Location</label><input type="text" id="city" class="form-input" placeholder="e.g. Chicago, IL" /></div>'
    + '</div>'
    + '<div><label class="form-label" for="notes">Project Notes / Existing Leak Symptoms</label><textarea id="notes" class="form-textarea" rows="3" placeholder="Describe active leaks, surface conditions, or special site access..."></textarea></div>'
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
    + 'LET\'S BUILD A <em class="heading-accent">SEAL</em> THAT LASTS'
    + '</div>'
    + '<div class="preloader__brush">'
    + '<img src="images/brush.png" alt="" class="preloader__brush-img" onerror="this.style.display=\'none\'" />'
    + '</div>'
    + '</div>';

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
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }

  /* Preloader must exist before main.js runs, so inject it immediately */
  var preloaderRoot = document.getElementById('preloader-root');
  if (preloaderRoot) preloaderRoot.innerHTML = PRELOADER;
})();

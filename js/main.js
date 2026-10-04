/* ============================================================
   THE CHEMICAL FACTORY — multi-page site interactivity
   Per-page behaviors + GSAP animations. Navbar, footer, and
   mobile menu are injected by components.js.
   ============================================================ */

(function () {
  'use strict';

  var $ = function (sel, ctx) {
    return (ctx || document).querySelector(sel);
  };
  var $$ = function (sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  };

  var page = (document.body && document.body.getAttribute('data-page')) || '';
  var hasG = typeof window.gsap !== 'undefined';

  /* ---------- Modal helpers ---------- */
  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  /* ---------- Quote Modal ---------- */
  /* NOTE: js/components.js injects the modal on DOMContentLoaded, which runs
     after this file. So these must be resolved lazily, and clicks delegated,
     rather than captured once at load time. */
  function quoteModal() { return $('#quote-modal'); }
  function quoteFormView() { return $('#quote-form-view'); }
  function quoteSuccessView() { return $('#quote-success-view'); }

  /* ---------- Inspection questions (product detail page) ----------
     Clicking "Start Inspection" on a product page asks a few site questions,
     then hands the answers to the contact form via sessionStorage. */
  var INSPECTION_KEY = 'tcf-inspection';

  function fill(str, id, value) {
    var el = $(id);
    if (el && value) el.value = value;
    return str;
  }

  function openInspection(btn) {
    var picker = $('#inspection-picker');
    var inspProduct = $('#inspection-product');

    /* Show the questions block only when opened from a product page */
    if (!picker) { openModal(quoteModal()); return; }

    picker.style.display = 'block';

    /* Reset previously chosen answers so a second visit starts clean */
    $$('#insp-symptoms input[type="checkbox"]').forEach(function (cb) { cb.checked = false; });
    ['#insp-area', '#insp-history'].forEach(function (sel) {
      var el = $(sel);
      if (el) el.value = '';
    });
    var timeline = $('#insp-timeline');
    if (timeline) timeline.selectedIndex = 0;
    var structure = $('#insp-structure');
    if (structure) structure.selectedIndex = 0;

    /* Show which product prompted this, and pre-select a matching structure type */
    var pName = btn.getAttribute('data-product-name');
    var pSub = btn.getAttribute('data-product-subtitle');
    var pCat = btn.getAttribute('data-product-category');
    var pPack = btn.getAttribute('data-product-packaging');
    if (inspProduct) {
      inspProduct.innerHTML = btn.getAttribute('data-product-id')
        ? '<strong>' + pName + '</strong><span>' + pSub + '</span>'
          + '<span class="inspection-picker__meta">' + pCat + ' &middot; Pack: ' + pPack + '</span>'
        : '';
      inspProduct.style.display = btn.getAttribute('data-product-id') ? '' : 'none';
    }

    /* Reflect the product in the estimator's system dropdown when we can */
    var systemSel = $('#system');
    if (systemSel && pCat) {
      var opts = Array.prototype.map.call(systemSel.options, function (o) { return o.textContent; });
      var guess = opts.find(function (t) {
        var hay = (pCat + ' ' + (pSub || '')).toLowerCase();
        var needle = t.toLowerCase();
        var a = needle.indexOf('polyurethane') !== -1 && hay.indexOf('polyurethane') !== -1;
        var b = needle.indexOf('polyurea') !== -1 && hay.indexOf('polyurea') !== -1;
        var c = needle.indexOf('bituminous') !== -1 && hay.indexOf('bituminous') !== -1;
        var d = needle.indexOf('crystalline') !== -1 && hay.indexOf('crystalline') !== -1;
        return a || b || c || d;
      });
      if (guess) systemSel.value = guess;
    }

    var notes = $('#notes');
    if (notes && !notes.value) {
      notes.value = pName ? 'Interested in ' + pName + ' (' + (pSub || '') + ') for a site inspection.' : '';
    }

    openModal(quoteModal());
  }

  /* Delegated so it also catches buttons injected after this file runs */
  document.addEventListener('click', function (e) {
    var openBtn = e.target.closest ? e.target.closest('.js-open-quote') : null;
    if (openBtn) {
      if (openBtn.classList.contains('js-open-inspection')) openInspection(openBtn);
      else openModal(quoteModal());
      return;
    }
    var cont = e.target.closest ? e.target.closest('.js-inspection-continue') : null;
    if (cont) submitInspection(cont);
  });

/* "Continue to contact form" inside the inspection block */
  function submitInspection() {
    var structure = $('#insp-structure');
    if (!structure || !structure.value) {
      showToast('Please choose the structure / area type');
      if (structure) structure.focus();
      return;
    }

    var symptoms = $$('#insp-symptoms input[type="checkbox"]')
      .filter(function (cb) { return cb.checked; })
      .map(function (cb) { return cb.value; });

    /* Product context comes from the inspection CTA that opened this modal */
    var openBtn = $('.js-open-inspection');
    var productName = openBtn && openBtn.getAttribute('data-product-name');

    var lines = ['SITE INSPECTION REQUEST'];
    if (productName) {
      lines.push('Product of interest: ' + productName);
      lines.push('Product type: ' + (openBtn.getAttribute('data-product-subtitle') || '-'));
      lines.push('Product category: ' + (openBtn.getAttribute('data-product-category') || '-'));
      lines.push('Packaging: ' + (openBtn.getAttribute('data-product-packaging') || '-'));
    }
    lines.push('Structure / area: ' + structure.value);
    var area = $('#insp-area');
    if (area && area.value) lines.push('Approximate area: ' + area.value + ' sq. ft.');
    var timeline = $('#insp-timeline');
    if (timeline && timeline.value) lines.push('Timeline: ' + timeline.value);
    lines.push('Observed symptoms: ' + (symptoms.length ? symptoms.join(', ') : 'None reported'));
    var history = $('#insp-history');
    if (history && history.value.trim()) lines.push('Previous repairs: ' + history.value.trim());
    var notes = $('#notes');
    if (notes && notes.value.trim()) lines.push('Additional notes: ' + notes.value.trim());

    var city = $('#city');
    if (city && city.value.trim()) lines.push('City / location: ' + city.value.trim());

    var payload = {
      subject: 'Free Site Inspection',
      message: lines.join('\n'),
      name: ($('#name') && $('#name').value) || '',
      phone: ($('#phone') && $('#phone').value) || '',
      email: ($('#email') && $('#email').value) || ''
    };

    try {
      sessionStorage.setItem(INSPECTION_KEY, JSON.stringify(payload));
    } catch (err) {
      /* Private browsing: fall through and open the contact page unfilled */
    }

    closeModal(quoteModal());
    window.location.href = 'contact.html';
  }

  document.addEventListener('click', function (e) {
    var closeBtn = e.target.closest ? e.target.closest('.js-close-quote') : null;
    if (closeBtn) closeModal(quoteModal());
  });

  /* ---------- Quote estimator ----------
     Also injected by components.js, so bind after mount. */
  function initEstimator() {
  var sqftSlider = $('#sqft-slider');
  var sqftValue = $('#sqft-value');
  var estRange = $('#est-range');

  function updateEstimate() {
    var sqft = sqftSlider ? parseInt(sqftSlider.value, 10) : 1500;
    if (sqftValue) sqftValue.textContent = sqft.toLocaleString() + ' sq. ft.';
    if (estRange) {
      var low = Math.round(sqft * 2.2);
      var high = Math.round(sqft * 3.8);
      estRange.textContent = '$' + low.toLocaleString() + ' – $' + high.toLocaleString();
    }
  }
  if (sqftSlider) {
    sqftSlider.addEventListener('input', updateEstimate);
  }

  /* ---------- Quote form submit ---------- */
  var quoteForm = $('#quote-form');

  if (quoteForm) {
    quoteForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = $('#name').value.trim();
      var phone = $('#phone').value.trim();
      var city = $('#city').value.trim();
      $('#success-name').textContent = name || 'Valued Client';
      $('#success-phone').textContent = phone || 'your number';
      $('#success-city').textContent = city || 'your city';
      var fv = quoteFormView();
      var sv = quoteSuccessView();
      if (fv) fv.style.display = 'none';
      if (sv) sv.style.display = 'flex';
    });
  }

  $$('.btn-success-done').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var fv = quoteFormView();
      var sv = quoteSuccessView();
      if (fv) fv.style.display = 'block';
      if (sv) sv.style.display = 'none';
      closeModal(quoteModal());
    });
  });
  }

  /* components.js mounts the modal on DOMContentLoaded, which happens after this
     file runs. Bind once the markup actually exists (works whether components.js
     has already mounted or mounts later). */
  function initWhenModalReady() {
    if ($('#quote-modal')) { initEstimator(); return; }
    document.addEventListener('DOMContentLoaded', initEstimator, { once: true });
  }
  initWhenModalReady();

  /* ---------- Filter bar (products + projects) ---------- */
  function applyFilter(filterBar, cards, category) {
    $$('.filter-btn', filterBar).forEach(function (btn) {
      btn.classList.toggle('is-active', btn.getAttribute('data-category') === category);
    });
    cards.forEach(function (card) {
      card.style.display = (category === 'All' || card.getAttribute('data-category') === category)
        ? ''
        : 'none';
    });
  }

  $$('.filter-bar').forEach(function (bar) {
    var cards = $$('.product-card, .project-card');
    var barCards = cards.filter(function (card) {
      return bar.closest('.container') === card.closest('.container');
    });
    $$('.filter-btn', bar).forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyFilter(bar, barCards, btn.getAttribute('data-category'));
      });
    });
  });

  /* ---------- Projects: lightbox ---------- */
  var projectModal = $('#project-modal');
  var projectModalImg = $('#project-modal-img');
  var projectModalCat = $('#project-modal-cat');
  var projectModalTitle = $('#project-modal-title');
  var projectModalLocation = $('#project-modal-location');
  var projectModalDesc = $('#project-modal-desc');
  var projectModalSystem = $('#project-modal-system');

  var projectsData = [
    {
      year: '2024',
      category: 'Basement & Tanking',
      title: 'Commercial Office Foundation Tanking',
      location: 'Metropolitan Financial District',
      image: 'images/construction.jpg',
      description: 'Comprehensive sub-grade tanking using elastomeric bituminous sheet membrane with protective drainage board for a 14-story subterranean parking deck.',
      systemUsed: 'TCF Elastomeric Bituminous Membrane 4mm'
    },
    {
      year: '2024',
      category: 'Terrace & Roof',
      title: 'Modern Residential Terrace Waterproofing',
      location: 'Green Valley Estates',
      image: 'images/roof-structure.jpg',
      description: 'UV-stable liquid polyurethane coating system applied over inverted flat roof insulation with integrated solar pad root resistance.',
      systemUsed: 'TCF Polyurethane Liquid Membrane'
    },
    {
      year: '2025',
      category: 'Wet Areas',
      title: 'Luxury Home Wet Area & Pool Sealing',
      location: 'Coastal Crest Villas',
      image: 'images/wet-area.jpg',
      description: 'Flexible cementitious 2-component polymer coating applied underneath natural marble tiles in 18 high-end wet rooms and infinity pool basin.',
      systemUsed: 'TCF Polymer Cementitious Flex Coat'
    },
    {
      year: '2023',
      category: 'Basement & Tanking',
      title: 'Apartment Complex Sub-structure Upgrade',
      location: 'Riverside Towers',
      image: 'images/apartment.jpg',
      description: 'Active groundwater leak mitigation using high-pressure polyurethane resin crack injection behind elevator shafts and basement retaining walls.',
      systemUsed: 'TCF Hydrophobic PU Resin Injection'
    },
    {
      year: '2022',
      category: 'Industrial',
      title: 'Industrial Warehouse Polyurea Coating',
      location: 'Logistics Hub North',
      image: 'images/warehouse.jpg',
      description: 'Fast-curing pure polyurea spray-applied waterproofing lining across 12,000 sq.m metal deck roof, tested against chemical corrosion.',
      systemUsed: 'TCF Spray Polyurea Hybrid 2.5mm'
    },
    {
      year: '2025',
      category: 'Terrace & Roof',
      title: 'Storm Damage Flat Roof Restoration',
      location: 'Harbor Commercial Center',
      image: 'images/flat-roof.jpg',
      description: 'Emergency seam repair, ponding water remediation, and full acrylic elastomeric topcoat application for commercial strip mall.',
      systemUsed: 'TCF Solar Reflective Acrylic Shield'
    },
    {
      year: '2024',
      category: 'Terrace & Roof',
      title: 'Shopping Mall Terrace Membrane Overlay',
      location: 'Downtown Shopping District',
      image: 'images/application.jpg',
      description: 'Seamless polyurethane overlay across retail terrace decks with thermal-break details and high-traffic abrasion topcoat.',
      systemUsed: 'TCF Polyurethane Liquid Membrane + Elastomeric Topcoat'
    },
    {
      year: '2023',
      category: 'Industrial',
      title: 'Petrochemical Plant Concrete Injection',
      location: 'Industrial Park',
      image: 'images/technician.jpg',
      description: 'Structural crack strengthening and waterproofing of process-area slabs using hydrophobic PU resin and crystalline grout.',
      systemUsed: 'TCF Hydrophobic PU Resin + Crystalline Grout'
    },
    {
      year: '2021',
      category: 'Terrace & Roof',
      title: 'City Center Office Roof Recoating',
      location: 'Downtown Business Quarter',
      image: 'images/roof-structure.jpg',
      description: 'Full recoat of aging elastomeric roof membrane including flashings, drains, and a solar-reflective topcoat for energy savings.',
      systemUsed: 'TCF Solar Reflective Acrylic Shield'
    }
  ];

  function openProject(index) {
    var p = projectsData[index];
    if (!p) return;
    projectModalImg.src = p.image;
    projectModalImg.alt = p.title;
    projectModalCat.textContent = p.category + ' • ' + p.year;
    projectModalTitle.textContent = p.title;
    projectModalLocation.textContent = p.location;
    projectModalDesc.textContent = p.description;
    projectModalSystem.textContent = p.systemUsed;
    openModal(projectModal);
  }

  $$('.project-card').forEach(function (card) {
    card.addEventListener('click', function () {
      openProject(parseInt(card.getAttribute('data-index'), 10));
    });
  });

  $$('.js-close-project').forEach(function (btn) {
    btn.addEventListener('click', function () {
      closeModal(projectModal);
    });
  });

  /* ---------- Infinite carousel (3 cards visible) ---------- */
  function initInfiniteCarousel(cfg) {
    var grid = $(cfg.grid);
    var track = $(cfg.track);
    var dots = $$(cfg.dots);
    var prevBtn = $(cfg.prev);
    var nextBtn = $(cfg.next);

    if (!track) return;

    var baseCards = $$(cfg.card, track);
    var count = baseCards.length;
    var index = count;
    var step = 0;
    var timer = null;
    var delay = cfg.delay || 3200;

    baseCards.forEach(function (c) { track.appendChild(c.cloneNode(true)); });
    baseCards.forEach(function (c) { track.appendChild(c.cloneNode(true)); });

    function measure() {
      var first = $(cfg.card, track);
      var style = window.getComputedStyle(track);
      var gap = parseFloat(style.columnGap || style.gap || '0') || 0;
      step = first ? first.offsetWidth + gap : 0;
    }

    function setTransition(on) {
      track.style.transition = on ? '' : 'none';
    }

    function moveTo(i) {
      track.style.transform = 'translateX(-' + i * step + 'px)';
      var logical = ((i - count) % count + count) % count;
      dots.forEach(function (dot, d) {
        dot.classList.toggle('is-active', d === logical);
      });
    }

    function snap() {
      setTransition(false);
      moveTo(index);
      void track.offsetWidth;
      setTransition(true);
    }

    function next() {
      index++;
      if (index >= 2 * count) {
        index = count;
        snap();
        index++;
      }
      moveTo(index);
    }

    function prev() {
      index--;
      if (index < count) {
        index = 2 * count - 1;
        snap();
        index--;
      }
      moveTo(index);
    }

    function goToLogical(logical) {
      index = count + logical;
      moveTo(index);
      restart();
    }

    function start() {
      stop();
      timer = window.setInterval(next, delay);
    }
    function stop() {
      if (timer) window.clearInterval(timer);
      timer = null;
    }
    function restart() {
      start();
    }

    measure();
    moveTo(index);

    if (grid) {
      grid.addEventListener('mouseenter', stop);
      grid.addEventListener('mouseleave', start);
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        goToLogical(parseInt(dot.getAttribute('data-index'), 10));
      });
    });
    if (prevBtn) {
      prevBtn.addEventListener('click', function () { prev(); restart(); });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', function () { next(); restart(); });
    }
    if (cfg.cardGoTo) {
      track.addEventListener('click', function (e) {
        var card = e.target.closest ? e.target.closest(cfg.card) : null;
        if (card) goToLogical(parseInt(card.getAttribute('data-index'), 10));
      });
    }

    window.addEventListener('resize', function () {
      measure();
      setTransition(false);
      moveTo(index);
      void track.offsetWidth;
      setTransition(true);
    });

    start();
  }

  initInfiniteCarousel({
    grid: '.products-slider__grid',
    track: '.products-slider__track',
    dots: '.products-slider__dot',
    prev: '#products-prev',
    next: '#products-next',
    card: '.product-card',
    cardGoTo: false,
    delay: 3200
  });

  /* ---------- FAQ accordion ---------- */
  var faqItems = $$('.faq-item');
  faqItems.forEach(function (item, idx) {
    var q = $('.faq-item__q', item);
    if (!q) return;
    q.addEventListener('click', function () {
      var isOpen = item.classList.contains('is-open');
      faqItems.forEach(function (other, otherIdx) {
        other.classList.toggle('is-open', !isOpen && otherIdx === idx);
      });
    });
  });

  /* ---------- Video modal ---------- */
  /* Disabled: the case-study video block was removed from index.html
     (it pointed at a placeholder YouTube ID). Re-enable alongside the markup. */
  var videoModal = $('#video-modal');
  var videoFrame = $('#video-frame');

  function openVideo() {
    if (videoFrame) {
      videoFrame.src = videoFrame.getAttribute('data-src') + '?autoplay=1';
    }
    openModal(videoModal);
  }

  function closeVideo() {
    if (videoFrame) videoFrame.src = '';
    closeModal(videoModal);
  }

  $$('.js-open-video').forEach(function (btn) {
    btn.addEventListener('click', openVideo);
  });
  $$('.js-close-video').forEach(function (btn) {
    btn.addEventListener('click', closeVideo);
  });

  /* ---------- Toast (shared) ---------- */
  var toastEl = null;
  function showToast(message) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = message;
    toastEl.classList.add('is-show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function () {
      toastEl.classList.remove('is-show');
    }, 2600);
  }

  /* Datasheet search + downloads are handled by js/products.js */

  /* ---------- Contact form ---------- */
  var contactForm = $('#contact-form');
  if (contactForm) {

    /* Pre-fill from the product-page inspection questions (if any) */
    (function applyInspectionPrefill() {
      var raw;
      try { raw = sessionStorage.getItem(INSPECTION_KEY); } catch (err) { return; }
      if (!raw) return;

      var data;
      try { data = JSON.parse(raw); } catch (err) { return; }
      if (!data) return;

      fill('', '#contact-name', data.name);
      fill('', '#contact-phone', data.phone);
      fill('', '#contact-email', data.email);
      fill('', '#contact-message', data.message);

      var subject = $('#contact-subject');
      if (subject && data.subject) {
        var match = Array.prototype.find.call(subject.options, function (o) {
          return o.textContent.trim() === data.subject;
        });
        if (match) subject.value = match.textContent;
      }

      try { sessionStorage.removeItem(INSPECTION_KEY); } catch (err) { /* ignore */ }

      /* Highlight the form so the user sees it was filled for them */
      var wrap = contactForm.closest ? contactForm.closest('.contact-form-wrap') : null;
      if (wrap) {
        wrap.classList.add('is-prefilled');
        setTimeout(function () { wrap.classList.remove('is-prefilled'); }, 6000);
      }

      var msg = $('#contact-message');
      if (msg) {
        msg.focus({ preventScroll: true });
        if (msg.scrollIntoView) msg.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    })();

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = $('#contact-name').value.trim();
      var phone = $('#contact-phone').value.trim();
      if (!name || !phone) {
        showToast('Please add your name and phone number');
        return;
      }
      showToast('Inspection request sent — our team will reply within 24 hours');
      contactForm.reset();
      var wrap = contactForm.closest ? contactForm.closest('.contact-form-wrap') : null;
      if (wrap) wrap.classList.remove('is-prefilled');
    });
  }

  /* ---------- Escape key closes modals ---------- */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeModal(quoteModal());
      closeModal(projectModal);
      closeVideo();
    }
  });

  /* ---------- GSAP animations ---------- */
  function initGSAP() {
    /* Home hero entrance: fade in up after the preloader finishes */
    function prepareHomeEntrance() {
      if (typeof window.gsap === 'undefined') return;
      var heroEls = $$('[data-hero]');
      if (!heroEls.length || page !== 'home') return;
      gsap.set(heroEls, { opacity: 0, y: 30 });
    }

    function playHomeEntrance() {
      if (typeof window.gsap === 'undefined') return;
      var heroEls = $$('[data-hero]');
      if (!heroEls.length || page !== 'home') return;
      var watermark = $('.hero__watermark');
      var heroList = watermark
        ? heroEls.filter(function (el) { return el !== watermark; })
        : heroEls;
      gsap.set(heroEls, { opacity: 0, y: 30 });
      var tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.9 } });
      tl.to(heroList, { opacity: 1, y: 0, stagger: 0.14 });
      if (watermark) {
        tl.to(watermark, { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }, '+=0.6');
      }
    }

    /* Preloader: brush sweeps left-to-right, wiping the text as it passes, then fades down.
       Shown only on the very first page load of a visit; skipped on in-site page
       switches, back/forward navigation, and reloads. */
    var preloader = $('#preloader');
    if (preloader) {
      var seenBefore = false;
      try {
        seenBefore = sessionStorage.getItem('cf-seen') === '1';
        sessionStorage.setItem('cf-seen', '1');
      } catch (err) { /* ignore */ }

      if (seenBefore) {
        document.documentElement.classList.remove('preloader-active');
        preloader.classList.add('is-done');
        playHomeEntrance();
      } else {
        var brush = $('.preloader__brush', preloader);
        var text = $('.preloader__text', preloader);
        document.documentElement.classList.add('preloader-active');
        if (typeof window.gsap !== 'undefined' && brush) {
          var travel = function () { return window.innerWidth + 240; };
          var textW = text ? text.offsetWidth : 0;
          gsap.timeline({
            onComplete: function () {
              document.documentElement.classList.remove('preloader-active');
              preloader.classList.add('is-done');
            }
          })
            .fromTo(brush,
              { xPercent: -50, yPercent: -50, x: -240 },
              {
                xPercent: -50, yPercent: -50,
                x: travel,
                duration: 3.2,
                ease: 'power2.inOut',
                onUpdate: function () {
                  if (text && textW) {
                    var x = gsap.getProperty(brush, 'x');
                    var f = Math.min(Math.max(x / textW, 0), 1);
                    text.style.clipPath = 'inset(0 ' + ((1 - f) * 100).toFixed(2) + '% 0 0)';
                  }
                }
              }, 0)
            .to(preloader, {
              autoAlpha: 0, y: 80, duration: 0.7, ease: 'power2.inOut', delay: 0.4,
              onStart: function () {
                prepareHomeEntrance();
                playHomeEntrance();
              }
            });
        } else {
          document.documentElement.classList.remove('preloader-active');
          preloader.classList.add('is-done');
          playHomeEntrance();
        }
      }
    } else {
      playHomeEntrance();
    }

    if (!hasG) return;

    if (typeof window.ScrollTrigger !== 'undefined') {
      /* Reveal-on-scroll for [data-reveal] blocks */
      $$('[data-reveal]').forEach(function (el) {
        gsap.fromTo(el,
          { opacity: 0, y: 36 },
          {
            opacity: 1, y: 0, duration: 0.85, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true }
          });
      });

      /* Hero background parallax (home only) */
      var heroBg = $('#hero-bg');
      var heroWatermark = $('.hero__watermark');
      var heroFrontImg = $('.hero__front-img');
      if (heroBg && page === 'home') {
        gsap.to(heroBg, {
          yPercent: 14, ease: 'none',
          scrollTrigger: { trigger: heroBg, start: 'top top', end: 'bottom top', scrub: true }
        });
        if (heroFrontImg) {
          gsap.to(heroFrontImg, {
            yPercent: 12, ease: 'none',
            scrollTrigger: { trigger: heroBg, start: 'top top', end: 'bottom top', scrub: true }
          });
        }
        if (heroWatermark) {
          gsap.to(heroWatermark, {
            yPercent: 6, ease: 'none',
            scrollTrigger: { trigger: heroBg, start: 'top top', end: 'bottom top', scrub: true }
          });
        }
      }

      /* About secondary image parallax (home only) */
      var aboutParallax = $('#about-parallax-card');
      if (aboutParallax) {
        gsap.to(aboutParallax, {
          y: -24, ease: 'none',
          scrollTrigger: { trigger: aboutParallax, start: 'top bottom', end: 'bottom top', scrub: true }
        });
      }
    }
  }

  /* ---------- Count-up stat values ---------- */
  var statValues = $$('.stat__value');
  if (statValues.length && typeof IntersectionObserver !== 'undefined') {
    function animateCounter(el) {
      var match = el.textContent.trim().match(/^([\d.,]+)(.*)$/);
      if (!match) return;
      var target = parseFloat(match[1].replace(/,/g, ''));
      var suffix = match[2];
      var duration = 3000;
      var start = null;
      function step(ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 4);
        el.textContent = Math.round(target * eased).toLocaleString() + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    var statObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    statValues.forEach(function (el) {
      statObserver.observe(el);
    });
  }

  /* ---------- Initial state ---------- */
  initGSAP();
})();

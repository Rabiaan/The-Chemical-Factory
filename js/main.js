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

  /* ---------- Escaping / sanitising ----------
     Anything that reaches innerHTML must go through esc(). Values that come back
     out of sessionStorage are treated as untrusted and run through cleanStr(). */
  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /* Trim to a sane length and strip control characters. Returns a string. */
  function cleanStr(value, maxLen) {
    var s = String(value == null ? '' : value);
    /* eslint-disable-next-line no-control-regex */
    s = s.replace(/[\u0000-\u001f\u007f]/g, ' ');
    s = s.replace(/\s+/g, ' ').trim();
    var max = typeof maxLen === 'number' ? maxLen : 500;
    return s.length > max ? s.slice(0, max) : s;
  }

  /* Keep newlines for multi-line free text, but still bound the length. */
  function cleanMultiline(value, maxLen) {
    var s = String(value == null ? '' : value).replace(/\r\n?/g, '\n');
    s = s.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, ' ');
    s = s.replace(/\n{3,}/g, '\n\n').trim();
    var max = typeof maxLen === 'number' ? maxLen : 2000;
    return s.length > max ? s.slice(0, max) : s;
  }

  /* ---------- Modal helpers ----------
     js/animations.js may register window.ModalFx to animate a panel in and
     out. It is optional: when nothing is registered the behaviour is exactly
     as before (class + aria + scroll lock, synchronously). */
  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (window.ModalFx && typeof window.ModalFx.open === 'function') {
      window.ModalFx.open(modal);
    }
  }

  function closeModal(modal) {
    if (!modal) return;
    /* The animation module owns the hide step when it is present, so the
       panel gets to animate out before display:none lands. It always calls
       back into finishModalClose() to do the hiding. */
    if (window.ModalFx && typeof window.ModalFx.close === 'function') {
      window.ModalFx.close(modal);
      return;
    }
    finishModalClose(modal);
  }

  function finishModalClose(modal) {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  /* Publish the hide step so an animation module can run it at the end of
     its exit tween. Registering only `finish` does not opt main.js into the
     animated path - closeModal above still checks specifically for `close`. */
  window.ModalFx = window.ModalFx || {};
  window.ModalFx.finish = finishModalClose;

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

    /* Show which product prompted this, and pre-select a matching structure type.
       These come from data-* attributes. They are first-party today, but they are
       still escaped + length-bounded before touching innerHTML. */
    var pId = cleanStr(btn.getAttribute('data-product-id'), 80);
    var pName = cleanStr(btn.getAttribute('data-product-name'), 120);
    var pSub = cleanStr(btn.getAttribute('data-product-subtitle'), 160);
    var pCat = cleanStr(btn.getAttribute('data-product-category'), 80);
    var pPack = cleanStr(btn.getAttribute('data-product-packaging'), 80);
    if (inspProduct) {
      inspProduct.innerHTML = pId
        ? '<strong>' + esc(pName) + '</strong><span>' + esc(pSub) + '</span>'
          + '<span class="inspection-picker__meta">' + esc(pCat) + ' &middot; Pack: ' + esc(pPack) + '</span>'
        : '';
      inspProduct.style.display = pId ? '' : 'none';
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
      /* Only trust values that match a checkbox that exists in our own markup. */
      .map(function (cb) { return cleanStr(cb.value, 60); });

    /* Product context comes from the inspection CTA that opened this modal */
    var openBtn = $('.js-open-inspection');
    var productName = openBtn && cleanStr(openBtn.getAttribute('data-product-name'), 120);

    var lines = ['SITE INSPECTION REQUEST'];
    if (productName) {
      lines.push('Product of interest: ' + productName);
      lines.push('Product type: ' + (cleanStr(openBtn.getAttribute('data-product-subtitle'), 160) || '-'));
      lines.push('Product category: ' + (cleanStr(openBtn.getAttribute('data-product-category'), 80) || '-'));
      lines.push('Packaging: ' + (cleanStr(openBtn.getAttribute('data-product-packaging'), 80) || '-'));
    }
    lines.push('Structure / area: ' + cleanStr(structure.value, 80));
    var area = $('#insp-area');
    if (area && area.value) lines.push('Approximate area: ' + cleanStr(area.value, 20) + ' sq. ft.');
    var timeline = $('#insp-timeline');
    if (timeline && timeline.value) lines.push('Timeline: ' + cleanStr(timeline.value, 80));
    lines.push('Observed symptoms: ' + (symptoms.length ? symptoms.join(', ') : 'None reported'));
    var history = $('#insp-history');
    if (history && cleanStr(history.value)) lines.push('Previous repairs: ' + cleanStr(history.value, 1000));
    var notes = $('#notes');
    if (notes && cleanStr(notes.value)) lines.push('Additional notes: ' + cleanStr(notes.value, 1000));

    var city = $('#city');
    if (city && cleanStr(city.value)) lines.push('City / location: ' + cleanStr(city.value, 120));

    var payload = {
      subject: 'Free Site Inspection',
      message: cleanMultiline(lines.join('\n'), 3000),
      name: cleanStr($('#name') && $('#name').value, 100),
      phone: cleanStr($('#phone') && $('#phone').value, 20),
      email: cleanStr($('#email') && $('#email').value, 254)
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

  /* ---------- Quote form submit ----------
     Moved to js/forms.js, which validates the fields, runs the honeypot and
     actually opens a prefilled mail client. Keeping a second handler here
     would double-submit. Only the estimator maths stays in main.js. */

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
    /* Hiding cards reflows the grid and moves every card below the fold, so
       the scroll-reveal triggers are now pointing at stale positions. Without
       a refresh the remaining cards either reveal at the wrong scroll depth
       or, if they were hidden when their trigger was created, never get a
       valid start at all and stay at opacity 0. Deferred a frame so the
       layout has settled. */
    window.requestAnimationFrame(function () {
      if (window.Motion) window.Motion.refresh();
      else if (window.ScrollTrigger) window.ScrollTrigger.refresh();
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
  var projectModalVideo = $('#project-modal-video');
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
      image: 'projects/WhatsApp%20Image%202026-10-05%20at%209.49.48%20PM.webp',
      description: 'Comprehensive sub-grade tanking using elastomeric bituminous sheet membrane with protective drainage board for a 14-story subterranean parking deck.',
      systemUsed: 'TCF Elastomeric Bituminous Membrane 4mm'
    },
    {
      year: '2024',
      category: 'Below-Grade Structures',
      title: 'Residential Foundation & Lift Pit Waterproofing',
      location: 'Green Valley Estates',
      image: 'projects/WhatsApp%20Image%202026-10-05%20at%209.50.26%20PM.webp',
      description: 'Cementitious waterproof coating applied across the cast-in-situ foundation walls and lift pit of a residential block, with detailing at the kicker joint and waterstop before backfilling.',
      systemUsed: 'TCF CHEM 2K SHIELD Cementitious Waterproof Coating'
    },
    {
      year: '2025',
      category: 'Retaining Walls',
      title: 'Underground Retaining Wall Waterproofing',
      location: 'Coastal Crest Villas',
      image: 'projects/WhatsApp%20Image%202026-10-05%20at%209.50.28%20PM.webp',
      description: 'Externally applied bituminous waterproofing membrane to a below-grade concrete retaining wall, protected and drained before soil backfill to stop groundwater ingress into the adjacent basement.',
      systemUsed: 'TCF CHEM BITU GUARD Bituminous Waterproofing Membrane'
    },
    {
      year: '2023',
      category: 'Epoxy Flooring',
      title: 'Apartment Complex Corridor Epoxy Flooring',
      location: 'Riverside Towers',
      image: 'projects/WhatsApp%20Image%202026-10-05%20at%209.49.47%20PM.webp',
      description: 'Seamless self-levelling epoxy floor system laid over the prepared concrete slab of an apartment tower corridor, giving a light grey, chemical-resistant and easy-to-clean finish.',
      systemUsed: 'TCF CHEMADD SP PRO Epoxy Flooring System'
    },
    {
      year: '2022',
      category: 'Industrial',
      title: 'Industrial Warehouse Polyurea Coating',
      location: 'Logistics Hub North',
      image: 'projects/WhatsApp%20Image%202026-10-05%20at%209.50.27%20PM.webp',
      description: 'Fast-curing pure polyurea spray-applied waterproofing lining across 12,000 sq.m metal deck roof, tested against chemical corrosion.',
      systemUsed: 'TCF Spray Polyurea Hybrid 2.5mm'
    },
    {
      year: '2025',
      category: 'Terrace & Roof',
      title: 'Storm Damage Flat Roof Restoration',
      location: 'Harbor Commercial Center',
      image: 'projects/WhatsApp%20Image%202026-10-05%20at%209.50.07%20PM.webp',
      description: 'Emergency seam repair, ponding water remediation, and full acrylic elastomeric topcoat application for commercial strip mall.',
      systemUsed: 'TCF Solar Reflective Acrylic Shield'
    },
    {
      year: '2024',
      category: 'Terrace & Roof',
      title: 'Shopping Mall Terrace Membrane Overlay',
      location: 'Downtown Shopping District',
      image: 'projects/WhatsApp%20Image%202026-10-05%20at%209.50.26%20PM.webp',
      description: 'Seamless polyurethane overlay across retail terrace decks with thermal-break details and high-traffic abrasion topcoat.',
      systemUsed: 'TCF Polyurethane Liquid Membrane + Elastomeric Topcoat'
    },
    {
      year: '2023',
      category: 'Industrial',
      title: 'Petrochemical Plant Concrete Injection',
      location: 'Industrial Park',
      image: 'projects/WhatsApp%20Image%202026-10-05%20at%209.50.23%20PM.webp',
      description: 'Structural crack strengthening and waterproofing of process-area slabs using hydrophobic PU resin and crystalline grout.',
      systemUsed: 'TCF Hydrophobic PU Resin + Crystalline Grout'
    },
    {
      year: '2021',
      category: 'Terrace & Roof',
      title: 'City Center Office Roof Recoating',
      location: 'Downtown Business Quarter',
      image: 'projects/WhatsApp%20Image%202026-10-05%20at%209.50.23%20PM%20(1).webp',
      description: 'Full recoat of aging elastomeric roof membrane including flashings, drains, and a solar-reflective topcoat for energy savings.',
      systemUsed: 'TCF Solar Reflective Acrylic Shield'
    }
  ];

  /* Two lightbox shapes share #project-modal:
     - home: a detail panel driven by projectsData (cards carry data-index)
     - projects page: a bare photo/video viewer (cards carry data-type/data-src)
     Either side can be absent, so every field is written defensively. */
  function stopProjectVideo() {
    if (!projectModalVideo) return;
    try { projectModalVideo.pause(); } catch (err) { /* not playing */ }
    projectModalVideo.removeAttribute('src');
  }

  function openProject(index) {
    var p = projectsData[index];
    if (!p || !projectModalImg) return;
    stopProjectVideo();
    if (projectModalVideo) projectModalVideo.hidden = true;
    projectModalImg.hidden = false;
    projectModalImg.src = p.image;
    projectModalImg.alt = p.title;
    if (projectModalCat) projectModalCat.textContent = p.category;
    if (projectModalTitle) projectModalTitle.textContent = p.title;
    if (projectModalLocation) projectModalLocation.textContent = p.location;
    if (projectModalDesc) projectModalDesc.textContent = p.description;
    if (projectModalSystem) projectModalSystem.textContent = p.systemUsed;
    openModal(projectModal);
  }

  function openProjectMedia(card) {
    var type = card.getAttribute('data-type');
    var src = card.getAttribute('data-src');
    if (!src || !projectModalImg) return;
    if (type === 'video') {
      if (projectModalVideo) {
        projectModalImg.hidden = true;
        projectModalImg.removeAttribute('src');
        projectModalVideo.hidden = false;
        projectModalVideo.setAttribute('src', src);
        openModal(projectModal);
        var playing = projectModalVideo.play();
        if (playing && playing.catch) playing.catch(function () { /* autoplay blocked */ });
        return;
      }
    }
    stopProjectVideo();
    if (projectModalVideo) projectModalVideo.hidden = true;
    projectModalImg.hidden = false;
    projectModalImg.src = src;
    projectModalImg.alt = card.getAttribute('data-alt') || 'Project site photo';
    openModal(projectModal);
  }

  function closeProjectModal() {
    stopProjectVideo();
    closeModal(projectModal);
  }

  $$('.project-card').forEach(function (card) {
    card.addEventListener('click', function () {
      if (card.hasAttribute('data-type')) openProjectMedia(card);
      else openProject(parseInt(card.getAttribute('data-index'), 10));
    });
  });

  $$('.js-close-project').forEach(function (btn) {
    btn.addEventListener('click', function () {
      closeProjectModal();
    });
  });

  /* ---------- Client logo tiles: decode before first paint ---------- */
  /* Both logo areas live inside animated/composited containers. An image that
     gets composited before its pixels are decoded shows as a black tile until
     something (hover, selection, focus) forces a repaint. decode() up front so
     the first painted frame already has real pixels. */
  $$('.clients-strip__logo--img img, .clients-group__logo img').forEach(function (img) {
    if (typeof img.decode !== 'function') return;
    img.decode().catch(function () { /* already decoded, or failed: browser paints what it can */ });
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

    /* Track movement: GSAP when it is available and motion is allowed,
       otherwise the CSS transition on .products-slider__track exactly as
       before. The class tells the stylesheet to drop its transition so the
       two never fight over the same transform. */
    function prefersGsap() {
      if (typeof window.gsap === 'undefined') return false;
      if (window.Motion && typeof window.Motion.prefersReduced === 'function') {
        return !window.Motion.prefersReduced();
      }
      return !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }

    function measure() {
      var first = $(cfg.card, track);
      var style = window.getComputedStyle(track);
      var gap = parseFloat(style.columnGap || style.gap || '0') || 0;
      step = first ? first.offsetWidth + gap : 0;
    }

    function setTransition(on) {
      track.style.transition = on ? '' : 'none';
    }

    /* `instant` jumps without a tween - used for the initial position,
       for the wrap-around correction and after a resize. */
    function moveTo(i, instant) {
      var x = -(i * step);
      if (prefersGsap()) {
        if (instant) {
          gsap.set(track, { x: x });
        } else {
          gsap.to(track, { x: x, duration: 0.65, ease: 'power3.out', overwrite: true });
        }
      } else {
        track.style.transform = 'translateX(' + x + 'px)';
      }
      var logical = ((i - count) % count + count) % count;
      dots.forEach(function (dot, d) {
        dot.classList.toggle('is-active', d === logical);
      });
    }

    function snap() {
      if (prefersGsap()) { moveTo(index, true); return; }
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

    /* The class only tells the stylesheet to drop its transition, so it has
       to follow the OS setting: leaving it behind would either leave the
       track with no transition at all, or leave the stylesheet and GSAP
       animating the same transform. Motion.onChange also fires once on
       registration, which covers the initial state. */
    function syncTrackMode() {
      var on = prefersGsap();
      if (on && !track.classList.contains('js-gsap-track')) {
        gsap.set(track, { x: -index * step });
      } else if (!on) {
        /* Drop any inline transform GSAP left behind before handing the
           track back to the CSS transition. */
        track.style.transform = '';
      }
      track.classList.toggle('js-gsap-track', on);
    }
    if (window.Motion) {
      window.Motion.onChange(syncTrackMode);
    } else {
      syncTrackMode();
    }

    moveTo(index, true);

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
      snap();
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
      if (!raw || raw.length > 20000) return;

      var data;
      try { data = JSON.parse(raw); } catch (err) { return; }
      if (!data || typeof data !== 'object') return;

      /* sessionStorage is attacker-writable (same-origin XSS, extensions, devtools),
         so validate shape and re-clean every field before it reaches the DOM.
         fill() only ever assigns .value, never innerHTML. */
      var safe = {
        name: cleanStr(data.name, 100),
        phone: cleanStr(data.phone, 20),
        email: cleanStr(data.email, 254),
        /* Matches the field's maxlength=500. The inspection payload is built in
           priority order (product, structure, area, timeline, symptoms, then
           free-text notes), so truncating here keeps the most useful lines. */
        message: cleanMultiline(data.message, 500),
        subject: cleanStr(data.subject, 80)
      };

      fill('', '#contact-name', safe.name);
      fill('', '#contact-phone', safe.phone);
      fill('', '#contact-email', safe.email);
      fill('', '#contact-message', safe.message);

      /* Only accept a subject that literally exists as one of our own <option>s. */
      var subject = $('#contact-subject');
      if (subject && safe.subject) {
        var match = Array.prototype.find.call(subject.options, function (o) {
          return o.textContent.trim() === safe.subject;
        });
        if (match) subject.value = match.value;
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

    /* Submission itself moved to js/forms.js (validation + real mailto hand-off).
       Only the pre-fill-from-sessionStorage behaviour stays here. */
    var wrap0 = contactForm.closest ? contactForm.closest('.contact-form-wrap') : null;
    if (wrap0) wrap0.classList.add('js-contact-form');
  }

  /* ---------- Escape key closes modals ---------- */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeModal(quoteModal());
      closeProjectModal();
      closeVideo();
    }
  });

  /* ---------- GSAP animations ---------- */
  function initGSAP() {
    var reducedNow = (window.Motion && Motion.prefersReduced()) || false;

    /* When motion is reduced the visitor must still see all content, so the
       "before" state is never applied and anything already dimmed is reset.
       This runs first, and again if the OS setting changes mid-session. */
    function ensureVisible() {
      if (window.Motion) Motion.showFinal('[data-hero], [data-reveal], .hero__watermark');
    }
    if (reducedNow) ensureVisible();
    if (window.Motion) Motion.onChange(function (isReduced) { if (isReduced) Motion.settle(); });

    /* Home hero entrance: fade in up after the preloader finishes */
    function prepareHomeEntrance() {
      if (typeof window.gsap === 'undefined') return;
      if (reducedNow) { ensureVisible(); return; }
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
      if (reducedNow) { ensureVisible(); return; }
      gsap.set(heroEls, { opacity: 0, y: 30 });
      var tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.9 } });
      tl.to(heroList, { opacity: 1, y: 0, stagger: 0.14 });
      if (watermark) {
        tl.to(watermark, { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }, '+=0.6');
      }
    }

    /* Preloader: brush sweeps left-to-right, wiping the text as it passes, then fades down.
       components.js injects #preloader only on a hard reload or the first visit
       in this tab (Navigation Timing tells a refresh apart from an in-site
       link click). If the element is present we play the timeline; on
       in-site navigations it was never injected, so entrances run
       immediately with no flash.
       Under reduced motion the wipe is skipped entirely -- the preloader is
       dismissed immediately instead of holding the page for ~4.3s. */
    var preloader = $('#preloader');
    if (preloader && !reducedNow) {
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
            ensureVisible();
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
    } else {
      if (preloader) {
        document.documentElement.classList.remove('preloader-active');
        preloader.classList.add('is-done');
      }
      prepareHomeEntrance();
      playHomeEntrance();
    }

    if (!hasG) return;

    if (typeof window.ScrollTrigger !== 'undefined') {
      /* Reveal-on-scroll for [data-reveal] blocks. Only registered in the
         no-preference branch; the reduce branch leaves CSS opacity untouched. */
      if (window.Motion) {
        Motion.full(function () {
          $$('[data-reveal]').forEach(function (el) {
            gsap.fromTo(el,
              { opacity: 0, y: 36 },
              {
                opacity: 1, y: 0, duration: 0.85, ease: 'power2.out',
                scrollTrigger: { trigger: el, start: 'top 88%', once: true }
              });
          });
          if (window.Motion) Motion.refresh();
        });
      }

      /* Parallax: pure decorative movement, so it is opt-in motion only.
         Nothing is hidden behind these, so skipping them is safe. */
      if (window.Motion) {
        Motion.full(function () {
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

          var aboutParallax = $('#about-parallax-card');
          if (aboutParallax) {
            gsap.to(aboutParallax, {
              y: -24, ease: 'none',
              scrollTrigger: { trigger: aboutParallax, start: 'top bottom', end: 'bottom top', scrub: true }
            });
          }
        });
      }
    }
  }

  /* ---------- Count-up stat values ----------
     With reduced motion the number is already in the markup, so there is
     nothing to animate: skip the observer entirely rather than re-writing
     the same value 60 times a second. */
  var statValues = $$('.stat__value');
  if (statValues.length && typeof IntersectionObserver !== 'undefined'
      && !(window.Motion && Motion.prefersReduced())) {
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

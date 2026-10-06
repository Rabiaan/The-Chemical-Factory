/* ============================================================
   THE CHEMICAL FACTORY - scroll, hover and ambient animations
   ------------------------------------------------------------
   Companion to js/main.js. main.js owns the preloader, the hero
   entrance and the generic [data-reveal] reveals; this file owns
   everything that is specific to a component:

     1. service cards        6. FAQ accordion
     2. project cards        7. CTA bands
     3. products slider      8. why-section features
     4/5. (see report)       9. mobile menu
                            10. magnetic hero CTA
                            12. preloader letter reveal
                            + products / product-detail reveal

   Rules this file keeps to:
     - Every tween is registered through Motion.full(), which is the
       single gsap.matchMedia() context in js/motion.js. Pointer-only
       effects get their own compound context so they are gated on
       "(prefers-reduced-motion: no-preference) and (hover: hover)
       and (pointer: fine)".
     - Hidden "before" states are written from JS, never from the
       stylesheet, so a JS failure leaves the page fully readable.
     - Every entrance is fromTo + clearProps, so nothing is left
       translated, scaled or transparent once it has played.
     - Anything that reveals on scroll uses once: true, and anything
       rendered by js/products.js is re-measured with
       ScrollTrigger.refresh() after a re-render.
   ============================================================ */
(function () {
  'use strict';

  /* Never wire up twice, even if the script tag is duplicated. */
  if (window.__tcfAnimations) return;
  window.__tcfAnimations = true;

  var $ = function (sel, ctx) {
    return (ctx || document).querySelector(sel);
  };
  var $$ = function (sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  };

  /* Lists always go through gsap.utils.toArray - never gsap.utils.to,
     which expects a single target. */
  function toArray(sel, ctx) {
    if (typeof window.gsap === 'undefined' || !window.gsap.utils) return [];
    return window.gsap.utils.toArray(sel, ctx);
  }

  function hasGsap() {
    return typeof window.gsap !== 'undefined';
  }
  function hasST() {
    return typeof window.ScrollTrigger !== 'undefined';
  }

  /* components.js injects the navbar and the quote modal on
     DOMContentLoaded, so anything that depends on them has to wait. */
  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  }

  /* ============================================================
     Preloader handshake
     ------------------------------------------------------------
     Load-time entrances must not play behind the preloader. We do
     not own the preloader timeline (main.js does), so instead of
     hooking into it we watch for the `is-done` class that main.js
     sets on completion, with a hard timeout as a failsafe: if the
     brush tween ever throws, content still becomes visible.
     ============================================================ */
  var preloaderWaiters = [];
  var preloaderSettled = false;

  function flushPreloaderWaiters() {
    if (preloaderSettled) return;
    preloaderSettled = true;
    var list = preloaderWaiters.slice();
    preloaderWaiters.length = 0;
    for (var i = 0; i < list.length; i++) {
      try { list[i](); } catch (err) { /* one bad waiter must not block the rest */ }
    }
    /* The preloader held `overflow:hidden` on <html>, so the document height
       and every scroll position were measured against a locked page. Triggers
       registered in the waiters above need re-measuring now it is released. */
    if (hasST()) {
      if (window.Motion) window.Motion.refresh();
      else window.ScrollTrigger.refresh();
    }
  }

  function afterPreloader(fn) {
    if (preloaderSettled) { fn(); return; }
    preloaderWaiters.push(fn);
  }

  function watchPreloader() {
    var pre = $('#preloader');
    /* No preloader on this page, or it was skipped (returning visitor,
       or reduced motion): main.js has already settled the entrance. */
    if (!pre || pre.classList.contains('is-done')) {
      flushPreloaderWaiters();
      return;
    }
    if (typeof MutationObserver === 'undefined') {
      window.setTimeout(flushPreloaderWaiters, 4500);
      return;
    }
    var mo = new MutationObserver(function () {
      if (pre.classList.contains('is-done')) {
        mo.disconnect();
        flushPreloaderWaiters();
      }
    });
    mo.observe(pre, { attributes: true, attributeFilter: ['class'] });
    /* The brush sweep is ~3.2s plus a 0.7s fade. 6s is comfortably
       past that and only ever reached if the timeline never fired. */
    window.setTimeout(flushPreloaderWaiters, 6000);
  }

  /* ============================================================
     Shared reveal helper
     ------------------------------------------------------------
     One trigger per card, so each card animates as it actually
     reaches the viewport, and the stagger is applied as a per-ROW
     delay. Two reasons it is not grouped by parent:

       - The card grids are CSS grids, not one wrapper per row.
         Every card in #productResults / #projects-grid shares a
         single parent, so parent grouping collapses the whole grid
         into one batch and the "stagger" becomes a diagonal sweep
         down the columns instead of a sweep along each row.
       - A trigger keyed to one element dies with it. Those grids are
         filtered by setting display:none on the cards (main.js
         applyFilter), so a row whose first card was hidden had no
         measurable position and could never fire - the row stayed
         at opacity 0.

     Rows are found by comparing offsetTop, which is why the callers
     must not register while the page is still behind the preloader:
     see afterPreloader() in every call site below.
     ============================================================ */
  var EASE_OUT = 'power2.out';

  /* Assigns each element a row index by its vertical offset. Cards in the
     same visual row share an offsetTop, so a 2px tolerance absorbs
     sub-pixel rounding without merging neighbouring rows. */
  function rowIndexes(els) {
    var order = els
      .map(function (el, i) { return { el: el, i: i, top: el.offsetTop, left: el.offsetLeft }; })
      .sort(function (a, b) { return (a.top - b.top) || (a.left - b.left); });

    var rows = [];
    var lastTop = null;
    for (var i = 0; i < order.length; i++) {
      if (lastTop === null || Math.abs(order[i].top - lastTop) > 2) {
        rows.push([]);
        lastTop = order[i].top;
      }
      rows[rows.length - 1].push(order[i]);
    }

    var out = [];
    for (var r = 0; r < rows.length; r++) {
      rows[r].forEach(function (item) { out[item.i] = r; });
    }
    return out;
  }

  function revealGrid(sel, opts) {
    if (!hasST()) return [];
    opts = opts || {};
    var scope = opts.scope || null;
    var els = scope ? toArray(sel, scope) : toArray(sel);
    if (!els.length) return [];

    var y = opts.y == null ? 50 : opts.y;
    var stagger = opts.stagger == null ? 0.15 : opts.stagger;
    var duration = opts.duration == null ? 0.8 : opts.duration;
    var start = opts.start || 'top 88%';
    var rows = rowIndexes(els);

    /* Hold the cards at their start state NOW rather than when the trigger
       fires. A trigger whose start is already passed - the first row of a
       grid that sits inside the fold, as on projects.html - is created and
       immediately enters; without this the row would paint at full opacity
       for a frame and then snap to 0, a visible flash as the preloader
       lifts.

       Only cards that are currently laid out get held. A card the filter
       has set to display:none has no measurable position, so it gets no
       trigger start either, and holding it at opacity 0 would strand it
       invisible once the filter is reset. */
    var held = els.filter(function (el) {
      return el.offsetWidth || el.offsetHeight || el.getClientRects().length;
    });
    if (held.length) window.gsap.set(held, { opacity: 0, y: y });

    var made = [];
    for (var i = 0; i < els.length; i++) {
      (function (el, row) {
        made.push(window.ScrollTrigger.create({
          trigger: el,
          start: start,
          once: true,
          onEnter: function () {
            window.gsap.fromTo(el,
              { opacity: 0, y: y },
              {
                opacity: 1, y: 0,
                duration: duration,
                /* Left to right along the row; the next row starts after. */
                delay: row * stagger,
                ease: EASE_OUT,
                overwrite: true,
                clearProps: 'transform,opacity'
              });
          }
        }));
      })(els[i], rows[i] || 0);
    }
    return made;
  }

  /* ============================================================
     1. Service cards (index .service-card, services .service-block)
     ------------------------------------------------------------
     Hover lift / image zoom are deliberately NOT animated here:
     css/styles.css:1390 and css/pages.css:1114 already do both with
     a transition. Adding GSAP on top would fight the stylesheet.
     ============================================================ */
  /* Every grid reveal is registered through afterPreloader(). These grids put
     their first row inside the fold on common viewports, and a ScrollTrigger
     whose start position is already passed fires the moment it is created -
     which, during the preloader, is a reveal the visitor never sees. */
  function initServiceCards() {
    afterPreloader(function () {
      revealGrid('.service-card', { y: 50, stagger: 0.15 });
      revealGrid('.service-block', { y: 50, stagger: 0.15 });
      revealGrid('.process-step', { y: 34, stagger: 0.12 });
    });
  }

  /* ============================================================
     2. Project cards (index, projects)
     Hover image zoom is CSS (.project-card:hover > img), so this
     only adds the entrance.
     ============================================================ */
  function initProjectCards() {
    afterPreloader(function () {
      revealGrid('.project-card', { y: 50, stagger: 0.15 });
    });
  }

  /* ============================================================
     2b. Lightbox open / close
     ------------------------------------------------------------
     main.js owns the modal class + aria + scroll lock. It calls
     window.ModalFx.open() after showing a panel and delegates the
     hide step to window.ModalFx.close(), which lets us animate the
     panel out *before* display:none lands. Escape handling and the
     close button are untouched in main.js.
     ============================================================ */
  function initLightboxFx() {
    var boxes = $$('.lightbox');
    var teardowns = [];

    function attach(box) {
      if (!box || box.__tcfLightbox) return;
      box.__tcfLightbox = true;
      box.classList.add('js-fx');

      var panel = $('.lightbox__panel', box);
      var opener = null;

      function focusables() {
        return $$('a[href], button, [tabindex]:not([tabindex="-1"])', box)
          .filter(function (el) { return el.offsetWidth || el.offsetHeight || el === document.activeElement; });
      }

      /* main.js -> openModal() lands here, after `.open` is applied. */
      function onOpen() {
        opener = document.activeElement;
        gsap.killTweensOf(box);
        if (panel) gsap.killTweensOf(panel);
        var f = focusables();
        if (!f.length) {
          /* Nothing to focus: show it rather than fading into a dead end. */
          gsap.set(box, { clearProps: 'opacity' });
          return;
        }
        gsap.fromTo(box,
          { opacity: 0 },
          { opacity: 1, duration: 0.28, ease: 'power2.out', overwrite: true });
        if (panel) {
          gsap.fromTo(panel,
            { opacity: 0, scale: 0.94, y: 18 },
            {
              opacity: 1, scale: 1, y: 0,
              duration: 0.42, ease: 'back.out(1.4)',
              overwrite: true, clearProps: 'transform'
            });
        }
        if (f[0].focus) f[0].focus({ preventScroll: true });
      }

      /* main.js -> closeModal() delegates here so the panel can animate out
         before display:none lands. The hide step itself is main.js's. */
      function onClose() {
        gsap.killTweensOf(box);
        if (panel) gsap.killTweensOf(panel);

        var finish = function () {
          if (window.ModalFx && typeof window.ModalFx.finish === 'function') {
            window.ModalFx.finish(box);
          } else {
            box.classList.remove('open');
            box.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
          }
          gsap.set(box, { clearProps: 'opacity' });
          if (panel) gsap.set(panel, { clearProps: 'transform,opacity' });
          if (opener && opener.focus) opener.focus({ preventScroll: true });
          opener = null;
        };

        var tl = gsap.timeline({ onComplete: finish });
        if (panel) {
          tl.to(panel, { opacity: 0, scale: 0.96, y: 10, duration: 0.22, ease: 'power2.in' }, 0);
        }
        tl.to(box, { opacity: 0, duration: 0.26, ease: 'power2.in' }, 0);
      }

      box.__tcfOpen = onOpen;
      box.__tcfClose = onClose;
      teardowns.push(function () {
        box.__tcfLightbox = false;
        box.__tcfOpen = null;
        box.__tcfClose = null;
        box.classList.remove('js-fx');
      });
    }

    boxes.forEach(attach);

    /* main.js calls these from openModal()/closeModal(). Registration is
       last-resort safe: if a panel has no handler (another page, or motion
       was switched off mid-visit) close() still hides it via main.js. */
    window.ModalFx = window.ModalFx || {};
    window.ModalFx.open = function (modal) {
      if (modal && typeof modal.__tcfOpen === 'function') modal.__tcfOpen();
    };
    window.ModalFx.close = function (modal) {
      if (modal && typeof modal.__tcfClose === 'function') {
        modal.__tcfClose();
        return;
      }
      if (modal && typeof window.ModalFx.finish === 'function') window.ModalFx.finish(modal);
    };

    return {
      attach: attach,
      teardown: function () {
        window.ModalFx.open = null;
        window.ModalFx.close = null;
        teardowns.forEach(function (fn) { fn(); });
        teardowns.length = 0;
      }
    };
  }

  /* ============================================================
     3. Featured products slider (index)
     The track movement itself is GSAP-driven from main.js
     (initInfiniteCarousel). Here we only add the card entrance.
     Hover lift and image zoom are already in css/pages.css:443-446
     (`.product-card:hover` and `.product-card:hover .product-card__img
     img`), so they are deliberately not animated here - a GSAP scale on
     the same element would fight the stylesheet's translateY and
     shadow, and only the first N cards are ours anyway.
     ============================================================ */
  function initSliderCards() {
    var track = $('.products-slider__track');
    if (!track) return;

    var all = toArray('.product-card', track);
    if (!all.length) return;

    /* One dot per real product, so the originals are the first N. */
    var dots = $$('.products-slider__dot').length;
    var originals = dots > 0 ? all.slice(0, dots) : all.slice(0, 1);

    afterPreloader(function () {
      gsap.fromTo(originals,
        { opacity: 0, y: 26 },
        {
          opacity: 1, y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: EASE_OUT,
          overwrite: true,
          clearProps: 'transform,opacity'
        });
    });
  }

  /* ============================================================
     6. FAQ accordion (index)
     ------------------------------------------------------------
     main.js toggles `.is-open` and stays the source of truth. We
     watch that class and animate the height of `.faq-item` (which
     already has overflow:hidden), rather than the answer - the
     answer carries vertical padding, so a height tween on it would
     leave a gap when closed.

     MutationObserver callbacks are microtasks, so they run before
     the browser paints: the answer is display:block for zero frames,
     which is what stops the answer flashing open for a frame.
     ============================================================ */
  function initFaq() {
    var list = $('#faq-list');
    if (!list || typeof MutationObserver === 'undefined') return null;

    document.documentElement.classList.add('js-faq-anim');

    var items = $$('.faq-item', list);

    function qBtn(item) { return $('.faq-item__q', item); }
    function answer(item) { return $('.faq-item__a', item); }

    /* Card height with the answer collapsed: the question button plus the
       card's own top/bottom borders. */
    function closedHeight(item) {
      var q = qBtn(item);
      if (!q) return 0;
      var cs = window.getComputedStyle(item);
      var bt = parseFloat(cs.borderTopWidth) || 0;
      var bb = parseFloat(cs.borderBottomWidth) || 0;
      return q.getBoundingClientRect().height + bt + bb;
    }

    function release(item) {
      var a = answer(item);
      if (a) a.style.display = '';
      gsap.set(item, { clearProps: 'height' });
    }

    function rotateIcon(item, open) {
      var icon = $('.faq-item__icon', item);
      if (!icon) return;
      gsap.to(icon, {
        rotate: open ? 180 : 0,
        duration: 0.45,
        ease: 'back.out(1.6)',
        overwrite: true
      });
    }

    function animate(item, open) {
      if (!qBtn(item)) return;
      gsap.killTweensOf(item);

      if (open) {
        /* `.is-open` is already applied when we get here, so the card is
           laying the answer out at its natural height - and
           height:'auto' hands that back to the stylesheet on completion,
           so a font swap or reflow cannot leave a stale pixel value. */
        gsap.fromTo(item,
          { height: closedHeight(item) },
          {
            height: 'auto',
            duration: 0.45,
            ease: 'power3.out',
            overwrite: true,
            clearProps: 'height'
          });
      } else {
        /* Closing is the awkward direction: `.is-open` is already gone, so
           the answer is display:none and the card already measures
           collapsed. Force it back to laid-out for the length of the
           tween, and start from the height cached when it was open -
           measuring now would collapse to the target immediately. */
        var a = answer(item);
        if (a) a.style.display = 'block';
        gsap.fromTo(item,
          { height: item.__tcfOpenH || item.getBoundingClientRect().height },
          {
            height: closedHeight(item),
            duration: 0.35,
            ease: 'power3.inOut',
            overwrite: true,
            clearProps: 'height',
            onComplete: function () { release(item); }
          });
      }
      rotateIcon(item, open);
    }

    var mo = new MutationObserver(function (mutations) {
      for (var i = 0; i < mutations.length; i++) {
        var item = mutations[i].target;
        var q = qBtn(item);
        if (!q) continue;
        var open = item.classList.contains('is-open');
        q.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (open) {
          /* Cache now, while the answer is laid out, for the next close. */
          var a = answer(item);
          if (a) a.style.display = '';
          item.__tcfOpenH = item.getBoundingClientRect().height;
        }
        animate(item, open);
      }
    });

    items.forEach(function (item) {
      var q = qBtn(item);
      if (q) q.setAttribute('aria-expanded', item.classList.contains('is-open') ? 'true' : 'false');
      mo.observe(item, { attributes: true, attributeFilter: ['class'] });
    });

    return function teardown() {
      mo.disconnect();
      items.forEach(function (item) {
        release(item);
        var icon = $('.faq-item__icon', item);
        if (icon) gsap.set(icon, { clearProps: 'transform' });
        item.__tcfOpenH = null;
      });
      document.documentElement.classList.remove('js-faq-anim');
    };
  }

  /* ============================================================
     7. CTA bands (every page that has one)
     ============================================================ */
  function initCtaBands() {
    if (!hasST()) return;

    var bands = toArray('.cta-band');
    bands.forEach(function (band) {
      var img = $('img', $('.cta-band__bg', band) || band);
      if (img) {
        /* Scaled to 1.2 first so the +/-8% travel never exposes an edge. */
        gsap.fromTo(img,
          { yPercent: -8, scale: 1.2 },
          {
            yPercent: 8, scale: 1.2,
            ease: 'none',
            force3D: true,
            scrollTrigger: {
              trigger: band,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
              invalidateOnRefresh: true
            }
          });
      }

      var text = toArray('.cta-band__title, .cta-band__sub', band);
      var actions = $('.cta-band__actions', band);

      var st = { trigger: band, start: 'top 82%', once: true };

      if (text.length) {
        gsap.fromTo(text,
          { opacity: 0, x: -40 },
          {
            opacity: 1, x: 0,
            duration: 0.8, stagger: 0.12, ease: EASE_OUT,
            overwrite: true,
            clearProps: 'transform,opacity',
            scrollTrigger: st
          });
      }
      if (actions) {
        gsap.fromTo(actions,
          { opacity: 0, x: 40 },
          {
            opacity: 1, x: 0,
            duration: 0.8, ease: EASE_OUT,
            overwrite: true,
            clearProps: 'transform,opacity',
            scrollTrigger: { trigger: band, start: 'top 82%', once: true }
          });
      }
    });
  }

  /* ============================================================
     8. Why-section features (index)
     No :hover rule exists for these in CSS, so the icon scale is new.
     ============================================================ */
  function initWhyFeatures() {
    if (!hasST()) return;

    var feats = toArray('.why__feature');
    if (!feats.length) return;

    /* Pair each card with its own icon rather than assuming every card has
       one - a compact icon list would silently shift the pairing and put
       the hover on the wrong card. */
    var pairs = [];
    feats.forEach(function (f) {
      var icon = $('.why__feature-icon', f);
      if (icon) pairs.push({ card: f, icon: icon });
    });

    var icons = pairs.map(function (p) { return p.icon; });

    gsap.fromTo(feats,
      { opacity: 0, y: 34 },
      {
        opacity: 1, y: 0,
        duration: 0.75,
        stagger: 0.13,
        ease: EASE_OUT,
        overwrite: true,
        clearProps: 'transform,opacity',
        scrollTrigger: { trigger: '.why__features', start: 'top 85%', once: true }
      });

    if (!icons.length) return null;

    /* Landed in the same scroll position as the card entrance, so the
       bounce reads as part of the reveal rather than a second event. */
    gsap.fromTo(icons,
      { scale: 0.4, opacity: 0 },
      {
        scale: 1, opacity: 1,
        duration: 0.65,
        stagger: 0.13,
        ease: 'back.out(2.2)',
        overwrite: true,
        clearProps: 'transform,opacity',
        scrollTrigger: { trigger: '.why__features', start: 'top 85%', once: true }
      });

    return null;
  }

  /* Icon pulse on hover. No :hover rule exists in CSS for these, so this
     is additive - and it is registered only inside the fine-pointer
     context in boot(), because a touch tap would fire it with nowhere to
     move the pointer away again. */
  function initWhyHover() {
    var teardowns = [];
    toArray('.why__feature').forEach(function (card) {
      var icon = $('.why__feature-icon', card);
      if (!icon) return;
      var on = function () {
        gsap.to(icon, { scale: 1.18, duration: 0.3, ease: 'back.out(2)', overwrite: true });
      };
      var off = function () {
        gsap.to(icon, { scale: 1, duration: 0.4, ease: 'power2.out', overwrite: true, clearProps: 'transform' });
      };
      card.addEventListener('mouseenter', on);
      card.addEventListener('mouseleave', off);
      teardowns.push(function () {
        card.removeEventListener('mouseenter', on);
        card.removeEventListener('mouseleave', off);
        gsap.killTweensOf(icon);
        gsap.set(icon, { clearProps: 'transform' });
      });
    });
    return teardowns;
  }

  /* ============================================================
     9. Mobile menu
     ------------------------------------------------------------
     components.js owns the `.open` class, aria-expanded and the
     hamburger/cross icon swap. We only animate the panel and add
     the focus handling the menu never had.
     ============================================================ */
  function initMobileMenu() {
    var btn = $('#mobile-menu-btn');
    var menu = $('#mobile-menu');
    if (!btn || !menu || typeof MutationObserver === 'undefined') return null;

    menu.classList.add('js-menu-fx');
    var links = toArray('.mobile-menu__link', menu);
    var opener = null;

    function firstFocusable() {
      return $('.mobile-menu__link', menu) || $('.mobile-menu__quote', menu);
    }

    function animateOpen() {
      gsap.killTweensOf(menu);
      gsap.killTweensOf(links);
      gsap.set(menu, { xPercent: 100, opacity: 0 });
      gsap.to(menu, {
        xPercent: 0, opacity: 1,
        duration: 0.38, ease: 'power3.out', overwrite: true,
        clearProps: 'transform,opacity'
      });
      if (links.length) {
        gsap.fromTo(links,
          { opacity: 0, x: 24 },
          {
            opacity: 1, x: 0,
            duration: 0.4, stagger: 0.045, ease: EASE_OUT, delay: 0.06,
            overwrite: true, clearProps: 'transform,opacity'
          });
      }
      var target = firstFocusable();
      if (target && target.focus) target.focus({ preventScroll: true });
    }

    function animateClose() {
      gsap.killTweensOf(menu);
      gsap.killTweensOf(links);
      gsap.to(menu, {
        xPercent: 100, opacity: 0,
        duration: 0.26, ease: 'power3.in',
        overwrite: true,
        onComplete: function () {
          gsap.set(menu, { clearProps: 'transform,opacity' });
          gsap.set(links, { clearProps: 'transform,opacity' });
        }
      });
    }

    /* Seed the tracked state so the observer ignores class churn that has
       nothing to do with opening (e.g. .js-menu-fx being removed on
       teardown), which would otherwise fire a spurious close + focus grab. */
    menu.__tcfWasOpen = menu.classList.contains('open');

    var mo = new MutationObserver(function () {
      var isOpen = menu.classList.contains('open');
      if (isOpen === menu.__tcfWasOpen) return;
      menu.__tcfWasOpen = isOpen;

      if (isOpen) {
        opener = document.activeElement;
        animateOpen();
        return;
      }
      /* Move focus out of the panel straight away rather than waiting for
         the exit tween, so a keyboard user is never stranded inside it. */
      animateClose();
      if (btn.focus) btn.focus({ preventScroll: true });
    });
    mo.observe(menu, { attributes: true, attributeFilter: ['class'] });

    /* components.js has no Escape handler for the menu. */
    function onKey(e) {
      if (e.key !== 'Escape' || !menu.classList.contains('open')) return;
      btn.click();
    }
    document.addEventListener('keydown', onKey);

    return function teardown() {
      mo.disconnect();
      document.removeEventListener('keydown', onKey);
      gsap.killTweensOf(menu);
      gsap.killTweensOf(links);
      gsap.set(menu, { clearProps: 'transform,opacity' });
      gsap.set(links, { clearProps: 'transform,opacity' });
      menu.classList.remove('js-menu-fx');
    };
  }

  /* ============================================================
     10. Magnetic hero CTA
     ---------------------------------------------------------
     .btn-hero-cta:hover scales in CSS (styles.css:626). Because an
     inline transform beats a stylesheet rule, the tween has to put
     that scale back in itself, otherwise hovering would lose it.
     ============================================================ */
  /* Returns an array of teardown functions, matching initWhyHover, so the
     pointer context in boot() can register them uniformly. */
  function initMagnetic() {
    var teardowns = [];
    var buttons = toArray('.btn-hero-cta');

    buttons.forEach(function (btn) {
      var strength = 0.2;

      function move(e) {
        var r = btn.getBoundingClientRect();
        if (!r.width || !r.height) return;
        var dx = (e.clientX - (r.left + r.width / 2)) * strength;
        var dy = (e.clientY - (r.top + r.height / 2)) * strength;
        gsap.to(btn, {
          x: dx, y: dy, scale: 1.05,
          duration: 0.4, ease: 'power3.out', overwrite: true
        });
      }

      function reset() {
        gsap.to(btn, {
          x: 0, y: 0, scale: 1,
          duration: 0.55, ease: 'elastic.out(1, 0.5)', overwrite: true,
          clearProps: 'transform'
        });
      }

      btn.addEventListener('mousemove', move);
      btn.addEventListener('mouseenter', move);
      btn.addEventListener('mouseleave', reset);

      teardowns.push(function () {
        btn.removeEventListener('mousemove', move);
        btn.removeEventListener('mouseenter', move);
        btn.removeEventListener('mouseleave', reset);
        gsap.killTweensOf(btn);
        gsap.set(btn, { clearProps: 'transform' });
      });
    });

    return teardowns;
  }

  /* ============================================================
     12. Preloader letter reveal
     components.js splits .preloader__text into word spans before
     main.js measures it, so this only plays the tween. The brush
     timeline in main.js is untouched.
     ============================================================ */
  function initPreloaderLetters() {
    var text = $('.preloader__text');
    if (!text || !text.__tcfSplit) return;
    /* Already dismissed (returning visitor, or reduced motion). */
    var pre = $('#preloader');
    if (!pre || pre.classList.contains('is-done')) return;

    var words = text.__tcfWords || [];
    if (!words.length) return;

    gsap.fromTo(words,
      { opacity: 0, yPercent: 60 },
      {
        opacity: 1, yPercent: 0,
        duration: 0.7,
        stagger: 0.09,
        ease: 'power3.out',
        overwrite: true
      });
  }

  /* ============================================================
     Dynamic pages
     ============================================================ */
  function initCatalogReveal() {
    var grid = $('#productResults');
    if (!grid || !hasST() || typeof MutationObserver === 'undefined') return null;

    var live = [];

    function killLive() {
      live.forEach(function (t) {
        try { t.kill(); } catch (err) { /* already dead */ }
      });
      live = [];
    }

    function reveal() {
      /* Kill the previous pass so re-filtering cannot stack triggers. */
      killLive();

      var cards = toArray('.product-card', grid).filter(function (card) {
        /* Skip anything the filter hid, so nothing is left invisible. */
        return card.offsetWidth || card.offsetHeight || card.getClientRects().length;
      });
      if (!cards.length) return;

      gsap.set(cards, { clearProps: 'transform,opacity' });

      /* revealGrid, not ScrollTrigger.batch: batch groups by how close cards
         are to the scroll line, which cuts across the 2-column catalog and
         staggers diagonally. revealGrid staggers along each visual row, the
         same as the service and project grids. */
      live = revealGrid('.product-card', {
        y: 40, stagger: 0.08, start: 'top 90%', scope: grid
      }).filter(function (t) { return t && t.kill; });
    }

    var queued = false;
    function schedule() {
      if (queued) return;
      queued = true;
      /* Coalesce the burst of mutations innerHTML produces into one pass. */
      window.requestAnimationFrame(function () {
        queued = false;
        reveal();
        if (window.Motion) Motion.refresh();
        else if (hasST()) window.ScrollTrigger.refresh();
      });
    }

    /* Held until the preloader is gone. The catalog grid sits just below the
       fold at most viewport heights, but a short window or a tall screen puts
       the first row on screen at load - and anything that animates then is
       invisible to the visitor. */
    afterPreloader(reveal);

    var mo = new MutationObserver(schedule);
    mo.observe(grid, { childList: true });

    return function teardown() {
      mo.disconnect();
      killLive();
    };
  }

  function initDetailReveal() {
    var main = $('#detail-main');
    /* initDetail() in products.js has already run: either the panel is
       populated, or it is still .hidden because the id did not match. */
    if (!main || main.classList.contains('hidden')) return;

    var panels = toArray('.detail-panel', main);
    if (panels.length) {
      afterPreloader(function () {
        revealGrid('.detail-panel', { y: 34, stagger: 0.12, start: 'top 90%', scope: main });
      });
    }

    /* Icons lists and technical tables render from JS, so reveal their
       items in reading order rather than as one block. Note these are the
       containers, not their `li`s - the stagger runs over the children. */
    var groups = toArray('#detail-features, #detail-apps, #detail-standards', main);
    groups.forEach(function (group) {
      var items = toArray('li', group);
      if (!items.length) return;
      gsap.fromTo(items,
        { opacity: 0, x: -16 },
        {
          opacity: 1, x: 0,
          duration: 0.5, stagger: 0.06, ease: EASE_OUT,
          overwrite: true, clearProps: 'transform,opacity',
          scrollTrigger: { trigger: group, start: 'top 90%', once: true }
        });
    });

    var extras = toArray('.info-card, .guideline, #related-grid .product-card', main);
    if (extras.length) {
      gsap.fromTo(extras,
        { opacity: 0, y: 26 },
        {
          opacity: 1, y: 0,
          duration: 0.6, stagger: 0.08, ease: EASE_OUT,
          overwrite: true, clearProps: 'transform,opacity',
          scrollTrigger: { trigger: extras[0], start: 'top 92%', once: true }
        });
    }
  }

  /* Datasheet list: rendered once, then filtered by display toggling, so
     the existing triggers need a refresh whenever the visible set changes. */
  function initDatasheetReveal() {
    var grid = $('#datasheet-cards');
    if (!grid) return null;
    afterPreloader(function () {
      revealGrid('.ds-card', { y: 34, stagger: 0.07, start: 'top 92%' });
    });

    var input = $('#datasheet-search');
    if (!input) return null;
    var queued = false;
    var onInput = function () {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(function () {
        queued = false;
        if (window.Motion) Motion.refresh();
        else if (hasST()) window.ScrollTrigger.refresh();
      });
    };
    input.addEventListener('input', onInput);
    return function teardown() {
      input.removeEventListener('input', onInput);
    };
  }

  /* ============================================================
     Reduced-motion safety net
     ------------------------------------------------------------
     Motion.settle() clears [data-hero] and [data-reveal]. The
     selectors below are the ones this file hides, so they have to be
     named here too - otherwise flipping the OS setting mid-visit
     could leave a card transparent.
     ============================================================ */
  var OWNED = [
    '.service-card', '.service-block', '.process-step', '.project-card',
    '.why__feature', '.why__feature-icon',
    '.cta-band', '.cta-band__title', '.cta-band__sub', '.cta-band__actions',
    '.product-card', '.ds-card', '.detail-panel',
    '#detail-features li', '#detail-apps li', '#detail-standards li',
    '.datasheet-table tbody tr', '.process-row',
    '.faq-item', '.faq-item__a', '.faq-item__icon',
    '.info-card', '.guideline',
    '.mobile-menu', '.mobile-menu__link', '.preloader__word'
  ].join(', ');

  function settleOwned() {
    if (window.Motion && window.Motion.showFinal) {
      window.Motion.showFinal(OWNED);
    } else {
      var els = $$(OWNED);
      els.forEach(function (el) {
        if (hasGsap()) window.gsap.set(el, { clearProps: 'transform,opacity' });
        el.style.opacity = '1';
      });
    }
    /* The height/transform the accordion and mobile menu rely on. */
    if (hasGsap()) {
      window.gsap.set($$('.faq-item'), { clearProps: 'height' });
      window.gsap.set($$('.faq-item__icon'), { clearProps: 'transform' });
      var menu = $('#mobile-menu');
      if (menu) window.gsap.set(menu, { clearProps: 'transform,opacity' });
      window.gsap.set($$('.mobile-menu__link'), { clearProps: 'transform,opacity' });
      window.gsap.set($$('.lightbox'), { clearProps: 'opacity' });
      window.gsap.set($$('.lightbox__panel'), { clearProps: 'transform,opacity' });
      /* A killed scrub leaves the parallax image parked mid-travel. Put it
         back to its stylesheet transform instead. */
      window.gsap.set($$('.cta-band__bg img'), { clearProps: 'transform' });
      window.gsap.set($$('.preloader__word'), { clearProps: 'transform,opacity' });
    }
    document.documentElement.classList.remove('js-faq-anim');
    var m = $('#mobile-menu');
    if (m) m.classList.remove('js-menu-fx');
    $$('.lightbox').forEach(function (b) { b.classList.remove('js-fx'); });
  }

  /* ============================================================
     Boot
     ============================================================ */
  function setup(token) {
    var teardowns = [];

    function push(t) {
      if (typeof t === 'function') teardowns.push(t);
      else if (t && typeof t.forEach === 'function') t.forEach(function (fn) { if (typeof fn === 'function') teardowns.push(fn); });
    }

    function run() {
      if (token.dead) return;

      /* The quote modal does not exist until components.js mounts it. */
      var fx = initLightboxFx();
      if (fx) {
        var quote = $('#quote-modal');
        if (quote) fx.attach(quote);
        push(function () { fx.teardown(); });
      }

      push(initServiceCards());
      push(initProjectCards());
      push(initSliderCards());
      push(initFaq());
      push(initCtaBands());
      push(initWhyFeatures());
      push(initMobileMenu());
      push(initCatalogReveal());
      push(initDatasheetReveal());

      if (!hasST()) return;
      initDetailReveal();
      /* Played now, not after the preloader: the point of this one is to be
         seen *through* the brush wipe, and the preloader is still on screen
         at this point. Queuing it behind afterPreloader() would guarantee
         the is-done guard below bailed out before a single frame ran. */
      initPreloaderLetters();

      token.teardown = function () {
        teardowns.forEach(function (fn) {
          try { fn(); } catch (err) { /* keep tearing the rest down */ }
        });
        teardowns.length = 0;
      };
    }

    onReady(run);
  }

  function boot() {
    if (!hasGsap()) return;
    if (!hasST()) {
      /* ScrollTrigger is required for the reveals; without it we still
         run the component animations that do not scroll. */
      if (!window.Motion) return;
    }

    watchPreloader();

    if (window.Motion) {
      /* Everything that may move, under the one existing gate. The token is
         created per activation, not shared: the revert marks it dead, so a
         shared one would refuse to re-arm when the visitor switches the OS
         setting back. */
      window.Motion.full(function () {
        var token = {};
        setup(token);
        return function () { token.dead = true; if (token.teardown) token.teardown(); };
      });

      /* Pointer-gated effects get their own compound context so they are
         only live when motion is allowed AND the pointer can hover. */
      if (hasGsap() && typeof window.gsap.matchMedia === 'function') {
        var pointerCtx = window.gsap.matchMedia();
        pointerCtx.add(
          '(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)',
          function () {
            if (window.Motion && window.Motion.prefersReduced()) return null;
            var reverters = [];
            var whyHover = initWhyHover();
            if (whyHover && whyHover.length) {
              reverters.push(function () { whyHover.forEach(function (fn) { fn(); }); });
            }
            var magnetic = initMagnetic();
            if (magnetic && magnetic.length) {
              reverters.push(function () { magnetic.forEach(function (fn) { fn(); }); });
            }
            return function () { reverters.forEach(function (fn) { fn(); }); };
          }
        );
      }

      window.Motion.onChange(function (isReduced) {
        if (isReduced) settleOwned();
      });
      return;
    }

    /* No Motion gate on this page: fall back to a plain matchMedia. */
    if (typeof window.gsap.matchMedia === 'function') {
      var ctx = window.gsap.matchMedia();
      ctx.add('(prefers-reduced-motion: no-preference)', function () {
        setup({});
        return function () { settleOwned(); };
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

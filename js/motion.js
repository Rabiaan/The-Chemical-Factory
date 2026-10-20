/* ============================================================
   THE CHEMICAL FACTORY - motion preference gate
   ------------------------------------------------------------
   Single place that decides whether this page is allowed to
   animate. Everything that moves -- js/main.js and js/animations.js
   -- goes through Motion.reduced() / Motion.full() so the
   prefers-reduced-motion setting is honoured in exactly one place.

   Why a gate rather than scattered checks: the failure mode is
   elements being left at their "before" state (opacity: 0) when an
   animation is skipped. Every branch here therefore has an explicit
   "show the final state" path.

   Under reduce:      no parallax, no scrub, no transform entrances,
                      no decorative loops, preloader finishes instantly,
                      stat counters render their real value.
   Under no-preference: full animation set as normal.
   ============================================================ */
(function (global) {
  'use strict';

  var REDUCE = '(prefers-reduced-motion: reduce)';
  var NO_PREFERENCE = '(prefers-reduced-motion: no-preference)';

  var reducedQuery = null;
  var cachedReduced = null;
  var mm = null;
  var listeners = [];

  function hasGsap() {
    return typeof global.gsap !== 'undefined';
  }

  function query() {
    if (!global.matchMedia) return null;
    if (!reducedQuery) reducedQuery = global.matchMedia(REDUCE);
    return reducedQuery;
  }

  /* Live value. Cached only until the first call, then re-read so a
     mid-session OS change (common on Windows/macOS) is picked up. */
  function prefersReduced() {
    var mq = query();
    cachedReduced = mq ? mq.matches : false;
    return cachedReduced;
  }

  /* The single gsap.matchMedia() context. Created once, reused by
     Motion.reduced() and Motion.full() on both sides. */
  function context() {
    if (!hasGsap() || typeof global.gsap.matchMedia !== 'function') return null;
    if (!mm) mm = global.gsap.matchMedia();
    return mm;
  }

  /* Run fn only when the visitor has asked for reduced motion.
     fn may return a teardown function - gsap.matchMedia() uses whatever the
     condition callback returns as its revert handler, so it has to be passed
     straight back out or nothing registered under this gate can ever be
     torn down again (which is what happens when the OS setting flips while
     the tab is open). */
  function reduced(fn) {
    var ctx = context();
    if (!ctx) {
      // No matchMedia support (very old browser): treat as reduced.
      if (prefersReduced()) fn();
      return;
    }
    ctx.add(REDUCE, function () { return fn(); });
  }

  /* Run fn only when full motion is allowed. Same return-value rule as above. */
  function full(fn) {
    var ctx = context();
    if (!ctx) {
      if (!prefersReduced()) fn();
      return;
    }
    ctx.add(NO_PREFERENCE, function () { return fn(); });
  }

  /* Called on every preference change (and once at startup) so state can be
     corrected if the OS setting flips while the tab is open. */
  function onChange(fn) {
    listeners.push(fn);
    fn(prefersReduced());
  }

  function notify() {
    var reducedNow = prefersReduced();
    for (var i = 0; i < listeners.length; i++) {
      try { listeners[i](reducedNow); } catch (err) { /* never let one break the rest */ }
    }
  }

  /* ============================================================
     Safety net: force elements to their final, visible state.

     This is the part that prevents the classic reduced-motion bug
     where an element stays invisible because the animation that was
     supposed to reveal it never ran. Safe to call more than once and
     safe to call when nothing was ever hidden.
     ============================================================ */
  function showFinal(selector) {
    var els = document.querySelectorAll(selector);
    if (!els.length) return 0;
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (hasGsap()) {
        // clearProps wipes inline transform/opacity GSAP wrote, back to CSS.
        global.gsap.set(el, { clearProps: 'transform,opacity,visibility,clipPath' });
      }
      el.style.opacity = '1';
      el.style.visibility = 'visible';
    }
    return els.length;
  }

  /* ScrollTrigger positions go stale when content is injected or filtered.
     Centralised so dynamic pages (products, projects, datasheets) have one
     correct way to ask for a re-measure. */
  function refresh() {
    if (hasGsap() && global.ScrollTrigger && typeof global.ScrollTrigger.refresh === 'function') {
      global.ScrollTrigger.refresh();
    }
  }

  /* Full teardown: kill tweens and ScrollTriggers. Used when the visitor
     switches to reduced motion while a page is open. */
  function settle() {
    if (!hasGsap()) return;
    if (typeof global.gsap.killTweensOf === 'function') global.gsap.killTweensOf('*');
    if (global.ScrollTrigger && typeof global.ScrollTrigger.getAll === 'function') {
      var all = global.ScrollTrigger.getAll() || [];
      for (var i = 0; i < all.length; i++) {
        if (typeof all[i].kill === 'function') all[i].kill();
      }
    }
    showFinal('[data-hero], [data-reveal], .hero__watermark, .hero__front-img');
    refresh();
  }

  function boot() {
    var mq = query();
    if (mq) {
      if (typeof mq.addEventListener === 'function') mq.addEventListener('change', notify);
      else if (typeof mq.addListener === 'function') mq.addListener(notify);   // Safari < 14
    }
    prefersReduced();   // prime the cache
  }

  global.Motion = {
    REDUCE: REDUCE,
    NO_PREFERENCE: NO_PREFERENCE,
    prefersReduced: prefersReduced,
    reduced: reduced,
    full: full,
    onChange: onChange,
    showFinal: showFinal,
    refresh: refresh,
    settle: settle,
    boot: boot
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})(window);

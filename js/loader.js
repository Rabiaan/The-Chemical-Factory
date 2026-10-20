/* ============================================================
   THE CHEMICAL FACTORY — fullscreen loader
   ------------------------------------------------------------
   Vanilla JS + GSAP. GSAP is the site's vendored 3.12.5 build
   (js/vendor/gsap.min.js) — the same pinned version the spec
   references on cdnjs, but the site CSP is `script-src 'self'`,
   so the local copy is used.

   Flow:
     1. Show only once per session (sessionStorage: cf-loader-seen).
     2. Lock scroll, reveal the overlay.
     3. Preload the stack images; combine real load progress with a
        ~2.6s minimum so the count is smooth, never stalls, and the
        whole sequence finishes inside ~5s.
     4. Stack images one at a time (clip-path reveal from the bottom,
        tiny random rotation/offset); the last lands straight on top.
     5. At 100: fade the ring/counter, expand the last image to cover
        the viewport (clip-path, no reflow), hand off to the hero.
     6. Reveal the hero text (masked word stagger), fade the navbar in,
        then remove the loader + unlock scroll.
     7. Dispatch `tcf:loader-reveal` so animations.js starts the hero
        slider (Ken Burns + autoplay) only after the handoff, keeping
        its crop identical to the expand banner.

   If anything throws or takes too long, a 5s failsafe finishes it.
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Config ----------
     Stack images, bottom → top. Content photos only — no banner images
     from other pages. The LAST entry is the handoff image: it must be
     the same file (and therefore the same crop) as the hero background
     so the expand-to-fullscreen handoff is seamless. Today that is the
     home hero slider's first slide — keep both copies in sync.
     All entries are existing site WebPs; keep each under ~200 KB. */
  var IMAGES = [
    'images/application.webp',                      /* project shot 1 */
    'images/flat-roof.webp',                        /* project shot 2 */
    'images/wet-area.webp',                         /* project shot 3 */
    'images/construction.webp',                     /* project shot 4 */
    'images/technician.webp',                       /* crew at work */
    'images/slider-hero-banner/waterproofing.webp'  /* LAST = handoff = hero slide 1 */
  ];
  /* The handoff must match the hero slide 1 <picture> in index.html: at
     the same breakpoint the <source media> uses, the hero shows the
     mobile crop — so the loader's last card and expand banner must too. */
  var MOBILE_HANDOFF = 'images/slider-hero-banner-mobile/waterproofing.webp';
  var isMobileHero = !!(window.matchMedia && window.matchMedia('(max-width: 768px)').matches);
  function srcFor(i) {
    return (isMobileHero && i === IMAGES.length - 1) ? MOBILE_HANDOFF : IMAGES[i];
  }
  /* The final image, used for the expand-to-fullscreen handoff. */
  var HANDOFF_SRC = srcFor(IMAGES.length - 1);

  var MIN_DURATION = 2600;   /* ms — floor for the count (whole sequence < 5s) */
  var FAILSAFE = 5000;       /* ms — finish no matter what */
  var LAST_AT = 0.85;        /* last image lands ~85% */

  var loader = document.getElementById('tcf-loader');
  if (!loader) return;

  var numEl = document.getElementById('tcf-loader-num');
  var stackEl = loader.querySelector('.tcf-loader__stack');
  var ringEl = loader.querySelector('.tcf-loader__ring');
  var counterEl = loader.querySelector('.tcf-loader__counter');
  var innerEl = loader.querySelector('.tcf-loader__inner');
  var taglineEl = loader.querySelector('.tcf-loader__tagline');

  var reduced = (window.Motion && Motion.prefersReduced && Motion.prefersReduced())
    || (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var hasGsap = typeof window.gsap !== 'undefined';

  /* ---------- Once per session ----------
     Key is versioned so the old loader's flag does not suppress this one.
     Add ?loader to the URL to force a run while designing/testing. */
  var force = /[?&]loader(=1|=on|=true)?(&|$)/.test(window.location.search);
  var seen = false;
  if (!force) {
    try { seen = sessionStorage.getItem('tcf-loader-seen') === '1'; } catch (err) { seen = false; }
  }
  try { sessionStorage.setItem('tcf-loader-seen', '1'); } catch (err) { /* private mode */ }

  /* The loader owns the hero handoff on a first visit — including under
     reduced motion, so main.js never plays the entrance behind the
     overlay. main.js checks window.__tcfLoaderOwnsHero. */
  if (!seen) window.__tcfLoaderOwnsHero = true;

  if (seen) {
    /* Later visits: no overlay. Let main.js play the hero as normal. */
    window.__tcfLoaderOwnsHero = false;
    if (loader.parentNode) loader.parentNode.removeChild(loader);
    return;
  }

  /* ---------- Lock scroll while loading ---------- */
  var prevOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';

  function unlock() {
    document.body.style.overflow = prevOverflow || '';
  }

  /* ---------- Preload the stack images (real progress) ---------- */
  var loaded = 0;
  var loadedFrac = 0;

  function trackLoad() {
    loaded++;
    loadedFrac = IMAGES.length ? loaded / IMAGES.length : 1;
  }

  var images = IMAGES.map(function (_src, i) {
    var img = new Image();
    img.onload = trackLoad;
    img.onerror = trackLoad;
    img.src = srcFor(i);
    return img;
  });
  var lastPreload = images[images.length - 1];

  /* ---------- Counter (smoothed, never jumps) ---------- */
  var display = 0;       /* eased value actually shown (0-100) */
  var target = 0;        /* current target from load + time progress */
  var rafId = null;
  var startTime = (window.performance && performance.now()) || Date.now();
  var finished = false;

  function now() { return (window.performance && performance.now()) || Date.now(); }

  function setNumber(v) {
    if (!numEl) return;
    numEl.textContent = String(Math.round(v));
  }
  setNumber(0);

  /* Draws each card as its slice of the range is passed. */
  var shown = 0;
  function revealCards(progress) {
    /* Reduced motion / no GSAP: skip the stack — only the handoff image,
       placed statically inside the ring. */
    if (reduced || !hasGsap) {
      if (!shown && IMAGES.length) {
        stackEl.appendChild(buildCard(IMAGES.length - 1));
        shown = IMAGES.length;
      }
      return;
    }
    while (shown < IMAGES.length) {
      var trigger = shown === IMAGES.length - 1
        ? LAST_AT
        : (shown / IMAGES.length);
      if (progress < trigger) break;
      spawnCard(shown);
      shown++;
    }
  }

  /* Builds a card element with no entrance animation. */
  function buildCard(i) {
    var card = document.createElement('div');
    card.className = 'tcf-loader__card';
    card.style.opacity = '1';
    card.style.clipPath = 'none';
    var img = document.createElement('img');
    img.src = srcFor(i);
    img.alt = '';
    card.appendChild(img);
    return card;
  }

  /* Adds a card with the clip reveal + tiny hand-stacked rotation/offset. */
  function spawnCard(i) {
    var card = document.createElement('div');
    card.className = 'tcf-loader__card';
    var img = document.createElement('img');
    img.src = srcFor(i);
    img.alt = '';
    card.appendChild(img);
    stackEl.appendChild(card);

    /* The final card lands straight and centred, on top of the pile. */
    var isLast = i === IMAGES.length - 1;
    var rot = isLast ? 0 : (Math.random() * 6 - 3);
    var dx = isLast ? 0 : (Math.random() * 18 - 9);
    var dy = isLast ? 0 : (Math.random() * 18 - 9);

    gsap.fromTo(card,
      { clipPath: 'inset(100% 0 0 0)', rotation: rot, x: dx, y: dy, opacity: 1 },
      {
        clipPath: 'inset(0% 0 0 0)',
        duration: 0.5,
        ease: 'power3.out',
        rotation: rot,
        x: dx,
        y: dy,
        onComplete: function () {
          if (isLast) gsap.set(card, { clearProps: 'transform' });
        }
      });
  }

  /* Single rAF loop: eases the shown number toward the target. */
  function tick() {
    if (finished) return;
    var elapsed = now() - startTime;

    /* Blend real load progress with the minimum-duration floor: whichever
       is further along drives the count, so it tracks real loading but is
       never faster than the floor. */
    var timeFrac = Math.min(elapsed / MIN_DURATION, 1);
    var realFrac = Math.max(loadedFrac, timeFrac);
    target = realFrac * 100;

    /* Smooth toward the target so the number never jumps. */
    display += (target - display) * 0.12;
    if (target - display < 0.2) display = target;

    setNumber(display);
    revealCards(display / 100);

    /* Finish only once the handoff image is decoded, so the expand
       never reveals a blank frame (errors also set .complete). */
    if (display >= 99.6 && lastPreload && lastPreload.complete) {
      finish();
      return;
    }
    rafId = window.requestAnimationFrame(tick);
  }

  /* ---------- Headline word masks ----------
     Splits an element's text into per-word spans, each inside an
     overflow-hidden mask so words can slide up independently. Returns
     the word spans. Idempotent. */
  function splitWords(el) {
    if (!el) return [];
    if (el.__tcfWords) return el.__tcfWords;
    var words = (el.textContent || '').split(/\s+/).filter(Boolean);
    if (!words.length) return [];
    el.textContent = '';
    var spans = [];
    for (var i = 0; i < words.length; i++) {
      var mask = document.createElement('span');
      mask.className = 'tcf-word-mask';
      mask.setAttribute('aria-hidden', 'true');
      var word = document.createElement('span');
      word.className = 'tcf-word';
      word.textContent = words[i];
      mask.appendChild(word);
      el.appendChild(mask);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
      spans.push(word);
    }
    el.__tcfWords = spans;
    return spans;
  }

  /* ---------- Hero reveal (after the loader hands off) ---------- */
  function revealHero() {
    if (!hasGsap) return;
    if (document.body.getAttribute('data-page') !== 'home') return;

    var nav = document.getElementById('navbar');
    var watermark = document.querySelector('.hero__watermark');
    var watermarkText = document.querySelector('.hero__watermark-text');

    if (reduced) {
      /* Just show everything — no transform, no mask. */
      if (window.Motion) Motion.showFinal('[data-hero], [data-reveal], .hero__watermark');
      if (nav) gsap.set(nav, { clearProps: 'opacity' });
      return;
    }

    /* Hide the navbar up front (it sits under the opaque overlay anyway)
       so it can fade in last, after the hero text. Disable the CSS
       transition during the fade so GSAP owns opacity outright. */
    if (nav) {
      nav.style.transition = 'none';
      gsap.set(nav, { opacity: 0 });
    }

    /* Headline: the watermark is the hero's visible headline today (the
       h1 is commented out in index.html). Split it into masked words
       that slide up with a 0.1s stagger. If a real multi-line headline
       is ever restored, wrap each line in .hero__line inside a mask —
       those get the same treatment via the .hero__line query. */
    var lines = gsap.utils.toArray('.hero__line');
    var words = lines.length ? lines : splitWords(watermarkText);
    if (words.length) gsap.set(words, { yPercent: 115 });

    var heroEls = gsap.utils.toArray('[data-hero]');
    var list = watermark
      ? heroEls.filter(function (el) { return el !== watermark; })
      : heroEls;
    gsap.set(list, { opacity: 0, y: 30 });
    if (watermark) gsap.set(watermark, { opacity: 0 });

    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    /* 1. Headline words rise out of their masks. */
    if (words.length) {
      tl.to(words, { yPercent: 0, duration: 0.9, stagger: 0.1 }, 0);
      if (watermark) tl.to(watermark, { opacity: 1, duration: 0.5 }, 0);
    } else if (watermark) {
      tl.to(watermark, { opacity: 1, y: 0, duration: 1.0 }, 0);
    }
    /* 2. Sub-text card, CTA and feature pills fade up. */
    tl.to(list, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 }, words.length ? '-=0.35' : 0);
    /* 3. Navbar last. */
    if (nav) {
      tl.to(nav, {
        opacity: 1,
        duration: 0.6,
        onComplete: function () {
          nav.style.transition = '';
          gsap.set(nav, { clearProps: 'opacity' });
        }
      }, '-=0.3');
    }
  }

  /* ---------- Finish sequence ---------- */
  function finish() {
    if (finished) return;
    finished = true;
    if (rafId) window.cancelAnimationFrame(rafId);
    display = 100;
    setNumber(100);
    loader.classList.add('is-finished');
    /* Out of the a11y tree the moment the sequence starts; the node
       itself is removed at cleanup. */
    loader.setAttribute('aria-hidden', 'true');

    function cleanup() {
      if (loader.parentNode) loader.parentNode.removeChild(loader);
      unlock();
      if (window.__tcfLoaderOwnsHero) window.__tcfLoaderOwnsHero = false;
      /* Tell animations.js the handoff is complete: the hero slider's
         Ken Burns + autoplay start now, so its crop matches the banner
         the loader just expanded. */
      document.dispatchEvent(new CustomEvent('tcf:loader-reveal'));
    }

    function handoff() {
      /* 1. Ring, counter + tagline fade out and the medallion scales down
         slightly. The scale targets __inner because the ring's CSS spin
         animation would override any GSAP transform on the ring itself. */
      if (hasGsap) {
        gsap.to([ringEl, counterEl, taglineEl].filter(Boolean), {
          opacity: 0, duration: 0.35, ease: reduced ? 'none' : 'power2.in'
        });
        if (!reduced && innerEl) {
          gsap.to(innerEl, { scale: 0.92, duration: 0.35, ease: 'power2.in' });
        }
      }

      /* 2. Expand a full-bleed copy of the handoff image from the last
         card's rect to the viewport via clip-path (no layout reflow).
         object-fit: cover + the identical hero image underneath means
         step 3 drops the loader with no visible jump. */
      var lastCard = stackEl.querySelector('.tcf-loader__card:last-child');
      var banner = document.createElement('div');
      banner.className = 'tcf-loader__banner';
      var bimg = new Image();
      bimg.src = HANDOFF_SRC;
      bimg.alt = '';
      banner.appendChild(bimg);

      function expand() {
        var r = lastCard
          ? lastCard.getBoundingClientRect()
          : { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
        var vw = window.innerWidth;
        var vh = window.innerHeight;
        banner.style.clipPath = 'inset(' +
          r.top + 'px ' +
          (vw - (r.left + r.width)) + 'px ' +
          (vh - (r.top + r.height)) + 'px ' +
          r.left + 'px)';
        loader.appendChild(banner);

        if (!hasGsap || reduced) {
          banner.style.clipPath = 'inset(0 0 0 0)';
          afterExpand();
          return;
        }
        gsap.to(banner, {
          clipPath: 'inset(0px 0px 0px 0px)',
          duration: 0.8,
          ease: 'expo.inOut',
          onComplete: afterExpand
        });
      }

      function afterExpand() {
        /* 3. The hero background is already the same image at the same
           crop, so crossfade the loader out — no visible jump. Reveal
           the hero text underneath while it fades. */
        revealHero();
        loader.style.transition = 'opacity 0.35s ease';
        loader.style.opacity = '0';
        window.setTimeout(cleanup, reduced ? 420 : 320);
      }

      if (hasGsap && !reduced) {
        /* Wait for the ring/counter fade, then expand. */
        gsap.delayedCall(0.37, expand);
      } else {
        expand();
      }
    }

    /* Reduced motion: 0.4s fade straight into the hero, no expand. */
    if (reduced) {
      revealHero();
      if (hasGsap) {
        gsap.to(loader, { opacity: 0, duration: 0.4, ease: 'none', onComplete: cleanup });
      } else {
        cleanup();
      }
      return;
    }
    handoff();
  }

  /* ---------- Failsafe: never get stuck ---------- */
  window.setTimeout(function () {
    if (!finished) finish();
  }, FAILSAFE);

  /* ---------- Boot ---------- */
  loader.hidden = false;
  rafId = window.requestAnimationFrame(tick);
})();

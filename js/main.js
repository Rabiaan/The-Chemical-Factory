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
  var quoteModal = $('#quote-modal');
  var quoteFormView = $('#quote-form-view');
  var quoteSuccessView = $('#quote-success-view');

  $$('.js-open-quote').forEach(function (btn) {
    btn.addEventListener('click', function () {
      openModal(quoteModal);
    });
  });

  $$('.js-close-quote').forEach(function (btn) {
    btn.addEventListener('click', function () {
      closeModal(quoteModal);
    });
  });

  /* ---------- Quote estimator ---------- */
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
      if (quoteFormView) quoteFormView.style.display = 'none';
      if (quoteSuccessView) quoteSuccessView.style.display = 'flex';
    });
  }

  $$('.btn-success-done').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (quoteFormView) quoteFormView.style.display = 'block';
      if (quoteSuccessView) quoteSuccessView.style.display = 'none';
      closeModal(quoteModal);
    });
  });

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

  /* ---------- Services: infinite carousel (3 cards visible) ---------- */
  var servicesGrid = $('.services__grid');
  var servicesTrack = $('.services__track');
  var serviceDots = $$('.services__dot');
  var servicesPrev = $('#services-prev');
  var servicesNext = $('#services-next');

  if (servicesTrack) {
    var baseCards = $$('.service-card', servicesTrack);
    var count = baseCards.length;
    var index = count;
    var step = 0;
    var timer = null;
    var delay = 3200;

    baseCards.forEach(function (c) { servicesTrack.appendChild(c.cloneNode(true)); });
    baseCards.forEach(function (c) { servicesTrack.appendChild(c.cloneNode(true)); });

    function measure() {
      var first = $('.service-card', servicesTrack);
      var style = window.getComputedStyle(servicesTrack);
      var gap = parseFloat(style.columnGap || style.gap || '0') || 0;
      step = first ? first.offsetWidth + gap : 0;
    }

    function setTransition(on) {
      servicesTrack.style.transition = on ? '' : 'none';
    }

    function moveTo(i) {
      servicesTrack.style.transform = 'translateX(-' + i * step + 'px)';
      var logical = ((i - count) % count + count) % count;
      serviceDots.forEach(function (dot, d) {
        dot.classList.toggle('is-active', d === logical);
      });
    }

    function snap() {
      setTransition(false);
      moveTo(index);
      void servicesTrack.offsetWidth;
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

    servicesGrid.addEventListener('mouseenter', stop);
    servicesGrid.addEventListener('mouseleave', start);

    serviceDots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        goToLogical(parseInt(dot.getAttribute('data-index'), 10));
      });
    });
    if (servicesPrev) {
      servicesPrev.addEventListener('click', function () { prev(); restart(); });
    }
    if (servicesNext) {
      servicesNext.addEventListener('click', function () { next(); restart(); });
    }
    servicesTrack.addEventListener('click', function (e) {
      var card = e.target.closest ? e.target.closest('.service-card') : null;
      if (card) goToLogical(parseInt(card.getAttribute('data-index'), 10));
    });

    window.addEventListener('resize', function () {
      measure();
      setTransition(false);
      moveTo(index);
      void servicesTrack.offsetWidth;
      setTransition(true);
    });

    start();
  }

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

  /* ---------- Datasheets: search + download toast ---------- */
  var datasheetSearch = $('#datasheet-search');
  var datasheetRows = $$('#datasheet-table tbody tr');

  if (datasheetSearch) {
    datasheetSearch.addEventListener('input', function () {
      var q = datasheetSearch.value.trim().toLowerCase();
      datasheetRows.forEach(function (row) {
        row.style.display = (!q || (row.getAttribute('data-search') || '').toLowerCase().indexOf(q) !== -1)
          ? ''
          : 'none';
      });
    });
  }

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

  $$('.js-download-datasheet').forEach(function (btn) {
    btn.addEventListener('click', function () {
      showToast('Datasheet download started — check your downloads folder');
    });
  });

  /* ---------- Contact form ---------- */
  var contactForm = $('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      showToast('Message sent — our team will reply within 24 hours');
      contactForm.reset();
    });
  }

  /* ---------- Escape key closes modals ---------- */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeModal(quoteModal);
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

    /* Preloader: brush sweeps left-to-right, wiping the text as it passes, then fades down */
    var preloader = $('#preloader');
    if (preloader) {
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
      if (heroBg && page === 'home') {
        gsap.to(heroBg, {
          yPercent: 8, ease: 'none',
          scrollTrigger: { trigger: heroBg, start: 'top top', end: 'bottom top', scrub: true }
        });
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
  updateEstimate();
  initGSAP();
})();

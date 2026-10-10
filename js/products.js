/* ============================================================
   THE CHEMICAL FACTORY — product catalog, detail & datasheet rendering
   Depends on js/products-data.js (window.TCF_PRODUCTS).
   - products.html         (data-page="products")   renders the full catalog grid
   - product-detail.html   (?id=<productId>)        renders the product detail page
   - datasheets.html                                renders the datasheet download list
   ============================================================ */
(function () {
  'use strict';

  var DATA = window.TCF_PRODUCTS;
  if (!DATA) return;

  var PRODUCTS = DATA.products;
  var CATEGORIES = DATA.categories;
  var SYSTEMS = DATA.systems;

  function $(sel) { return document.querySelector(sel); }

  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function findProduct(id) {
    var i;
    if (!id) return null;
    for (i = 0; i < PRODUCTS.length; i++) {
      if (PRODUCTS[i].id === id) return PRODUCTS[i];
    }
    return null;
  }

  function detailHref(id) {
    return 'product-detail.html?id=' + encodeURIComponent(id);
  }

  function categoryName(id) {
    var i;
    for (i = 0; i < CATEGORIES.length; i++) {
      if (CATEGORIES[i].id === id) return CATEGORIES[i].name;
    }
    return id;
  }

  function categoryOf(product) {
    for (var i = 0; i < CATEGORIES.length; i++) {
      if (CATEGORIES[i].id === product.category) return CATEGORIES[i];
    }
    return null;
  }

  function systemOf(product) {
    var cat = categoryOf(product);
    return cat ? cat.system : null;
  }

  /* ---------- Icons ---------- */
  var ARROW =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
    + '<line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>';

  var DOWNLOAD_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
    + '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>'
    + '</svg>';

  var PDF_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
    + '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>'
    + '<line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/></svg>';

  var CHEV =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
    + '<polyline points="9 18 15 12 9 6"/></svg>';

  var CHECK_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
    + '<polyline points="20 6 9 17 4 12"/></svg>';

  /* ---------- Reusable fragments ---------- */

  /* Card highlight bullets */
  function renderHighlights(items, limit) {
    var list = (items || []).slice(0, limit || 4);
    if (!list.length) return '';
    return '<ul class="product-card__points">'
      + list.map(function (h) {
        return '<li><span class="product-card__tick">' + CHECK_SVG + '</span>' + esc(h) + '</li>';
      }).join('')
      + '</ul>';
  }

  /* Product images carry their measured intrinsic size so the browser can
     reserve space before the bytes arrive. Values come from imageW/imageH in
     products-data.js, which were read off the real files. */
  function imageAttrs(p) {
    var w = parseInt(p.imageW, 10);
    var h = parseInt(p.imageH, 10);
    var out = ' loading="lazy" decoding="async"';
    if (w > 0 && h > 0) out = ' width="' + w + '" height="' + h + '"' + out;
    return out;
  }

  /* Datasheet paths are generated from product ids, but the value still gets
     written into an href, so it is re-validated here. Anything that is not a
     lowercase product-id PDF under downloads/ is dropped rather than rendered. */
  var DATASHEET_RE = /^downloads\/[a-z0-9][a-z0-9-]*\.pdf$/;

  function safeDatasheet(product) {
    var path = product && product.datasheet;
    return (typeof path === 'string' && DATASHEET_RE.test(path)) ? path : '';
  }

  /* "PDF · 1.6 MB" - real measured size, never a guessed string */
  function datasheetMeta(product) {
    var kb = parseInt(product.datasheetKb, 10);
    if (!kb || kb < 1) return 'PDF';
    var mb = kb / 1024;
    return 'PDF · ' + (mb >= 10 ? mb.toFixed(0) + ' MB' : mb.toFixed(1) + ' MB');
  }

  /* Datasheet download link (works everywhere: cards, detail, datasheets page) */
  function renderDownloadLink(product, className, label, extraAttrs) {
    var path = safeDatasheet(product);
    if (!path) return '';
    var title = product.name + ' technical datasheet (' + datasheetMeta(product) + ')';
    return '<a class="' + className + '" href="' + esc(path) + '" download type="application/pdf"'
      + ' aria-label="' + esc(title) + '" data-pdf="' + esc(path) + '"'
      + (extraAttrs || '') + '>'
      + '<span class="product-card__download-icon">' + PDF_SVG + '</span>'
      + '<span>' + esc(label || 'Download Datasheet') + '</span>'
      + '<span class="product-card__download-meta">' + esc(datasheetMeta(product)) + '</span>'
      + '</a>';
  }

  /* ============================================================
     Shared product card
     Image + name + subtitle + a few details. No ratings.
     ============================================================ */
  function renderCard(p) {
    var badges = (p.badges || []).slice(0, 2).map(function (b) {
      return '<span class="product-card__badge">' + esc(b) + '</span>';
    }).join('');

    var pack = p.packaging
      ? '<div class="product-card__packs"><span class="product-card__chip">Pack: ' + esc(p.packaging) + '</span></div>'
      : '';

    return '<article class="product-card" data-category="' + esc(p.category) + '" data-id="' + esc(p.id) + '">'
      + '<a class="product-card__img" href="' + detailHref(p.id) + '" aria-label="View ' + esc(p.name) + '">'
      + '<img src="' + esc(p.image) + '" alt="' + esc(p.name) + '"' + imageAttrs(p) + ' />'
      + '<span class="product-card__cat">' + esc(p.categoryLabel) + '</span>'
      + (badges ? '<span class="product-card__badges">' + badges + '</span>' : '')
      + '</a>'
      + '<div class="product-card__body">'
      + '<h3 class="product-card__name">' + esc(p.name) + '</h3>'
      + '<p class="product-card__spec">' + esc(p.subTitle) + '</p>'
      + renderHighlights(p.highlights, 4)
      + pack
      + '<div class="product-card__foot">'
      + '<a href="' + detailHref(p.id) + '" class="product-card__view">View Details<span class="product-card__arrow">' + ARROW + '</span></a>'
      + renderDownloadLink(p, 'product-card__download', 'Datasheet')
      + '</div>'
      + '</div>'
      + '</article>';
  }

  /* ============================================================
     Catalog page (products.html)
     ============================================================ */
  function buildCategories() {
    var cats = [{ id: 'all', name: 'All Products', count: PRODUCTS.length, system: 'all' }];
    CATEGORIES.forEach(function (c) {
      var count = PRODUCTS.filter(function (p) { return p.category === c.id; }).length;
      cats.push({ id: c.id, name: c.name, count: count, system: c.system });
    });
    return cats;
  }

  function buildSystems() {
    var list = [{ id: 'all', name: 'All Systems', count: PRODUCTS.length }];
    SYSTEMS.forEach(function (s) {
      if (s.id === 'all') return;
      var count = PRODUCTS.filter(function (p) { return systemOf(p) === s.id; }).length;
      list.push({ id: s.id, name: s.name, count: count });
    });
    return list;
  }

  function initCatalog() {
    var results = $('#productResults');
    var noResults = $('#noResults');
    var resultsText = $('#resultsText');
    var sidebarCats = $('#sidebarCategories');
    var sidebarSystems = $('#sidebarSystems');
    var sidebarPdfs = $('#sidebarDatasheets');
    var mobileCatSelect = $('#mobileCategorySelect');
    var mobileSysSelect = $('#mobileSystemSelect');
    var mobileFilters = $('#mobileFilters');
    var sortSelect = $('#sortSelect');
    var heroSearch = $('#product-hero-search');
    var searchInput = $('#product-search-input');
    var searchForm = $('#product-search-form');

    if (!results) return;

    var categories = buildCategories();
    var systems = buildSystems();

    var state = {
      selectedCategory: 'all',
      selectedSystem: 'all',
      searchQuery: '',
      sortBy: 'default'
    };

    function filtered() {
      var q = state.searchQuery.trim().toLowerCase();
      return PRODUCTS.filter(function (p) {
        if (state.selectedCategory !== 'all' && p.category !== state.selectedCategory) return false;
        if (state.selectedSystem !== 'all' && systemOf(p) !== state.selectedSystem) return false;
        if (q) {
          var hay = [
            p.name,
            p.subTitle,
            p.categoryLabel,
            p.description,
            (p.highlights || []).join(' '),
            (p.uses || []).join(' '),
            (p.keyFeatures || []).join(' ')
          ].join(' ').toLowerCase();
          if (hay.indexOf(q) === -1) return false;
        }
        return true;
      }).sort(function (a, b) {
        switch (state.sortBy) {
          case 'name': return a.name.localeCompare(b.name);
          case 'name-desc': return b.name.localeCompare(a.name);
          default: return 0;
        }
      });
    }

    /* Only group by category when no narrower filter is active */
    function grouped() {
      var list = filtered();
      if (state.selectedCategory !== 'all') {
        return [{ cat: { id: state.selectedCategory, name: categoryName(state.selectedCategory) }, products: list }];
      }
      if (state.selectedSystem !== 'all') {
        var sys = systems.filter(function (s) { return s.id === state.selectedSystem; })[0];
        return [{ cat: { id: state.selectedSystem, name: sys ? sys.name : state.selectedSystem }, products: list }];
      }
      return categories
        .filter(function (c) { return c.id !== 'all'; })
        .map(function (cat) {
          return { cat: cat, products: list.filter(function (p) { return p.category === cat.id; }) };
        })
        .filter(function (g) { return g.products.length > 0; });
    }

    function renderSidebar() {
      if (sidebarCats) {
        sidebarCats.innerHTML = categories.map(function (c) {
          var active = state.selectedCategory === c.id ? 'active' : '';
          return '<button type="button" class="cat-item ' + active + '" data-category="' + esc(c.id) + '">'
            + '<span>' + esc(c.name) + '</span><span class="n">(' + c.count + ')</span></button>';
        }).join('');
      }
      if (sidebarSystems) {
        sidebarSystems.innerHTML = systems.map(function (s) {
          var active = state.selectedSystem === s.id ? 'active' : '';
          return '<button type="button" class="cat-item ' + active + '" data-system="' + esc(s.id) + '">'
            + '<span>' + esc(s.name) + '</span><span class="n">(' + s.count + ')</span></button>';
        }).join('');
      }
      if (sidebarPdfs) {
        sidebarPdfs.innerHTML = PRODUCTS.map(function (p) {
          var path = safeDatasheet(p);
          if (!path) return '';
          return '<a class="pdf-item" href="' + esc(path) + '" download type="application/pdf"'
            + ' aria-label="' + esc(p.name + ' technical datasheet (' + datasheetMeta(p) + ')') + '"'
            + ' data-pdf="' + esc(path) + '"'
            + ' data-search="' + esc(p.name + ' ' + p.categoryLabel) + '">'
            + '<span class="pdf-item__icon">' + PDF_SVG + '</span>'
            + '<span class="pdf-item__text">' + esc(p.name) + '</span>'
            + '<span class="pdf-item__size">' + esc(datasheetMeta(p)) + '</span></a>';
        }).join('');
      }
      if (mobileCatSelect) {
        mobileCatSelect.innerHTML = categories.map(function (c) {
          return '<option value="' + esc(c.id) + '"' + (c.id === state.selectedCategory ? ' selected' : '') + '>'
            + esc(c.name) + ' (' + c.count + ')</option>';
        }).join('');
      }
      if (mobileSysSelect) {
        mobileSysSelect.innerHTML = systems.map(function (s) {
          return '<option value="' + esc(s.id) + '"' + (s.id === state.selectedSystem ? ' selected' : '') + '>'
            + esc(s.name) + ' (' + s.count + ')</option>';
        }).join('');
      }
    }

    function renderResultsBar() {
      if (!resultsText) return;
      var n = filtered().length;
      var html = 'Showing <strong>' + n + '</strong> result' + (n === 1 ? '' : 's');
      var scope = null;
      if (state.selectedCategory !== 'all') scope = categoryName(state.selectedCategory);
      else if (state.selectedSystem !== 'all') {
        var sys = systems.filter(function (s) { return s.id === state.selectedSystem; })[0];
        scope = sys ? sys.name : null;
      }
      if (scope) html += '<span class="in-cat">in ' + esc(scope) + '</span>';
      resultsText.innerHTML = html;
    }

    function renderResults() {
      var list = filtered();
      var groups = grouped();
      var hasResults = list.length > 0;

      if (noResults) noResults.classList.toggle('hidden', hasResults);
      results.classList.toggle('hidden', !hasResults);
      if (!hasResults) return;

      results.innerHTML = groups.map(function (g) {
        return '<section class="cat-group">'
          + '<div class="cat-group__head">'
          + '<div class="cat-group__title"><span class="cat-group__dot"></span><h2>' + esc(g.cat.name) + '</h2></div>'
          + '<span class="cat-group__count">' + g.products.length + ' product' + (g.products.length === 1 ? '' : 's') + '</span>'
          + '</div>'
          + '<div class="products__grid products__grid--catalog">'
          + g.products.map(renderCard).join('')
          + '</div>'
          + '</section>';
      }).join('');
    }

    function renderAll() {
      renderSidebar();
      renderResultsBar();
      renderResults();
    }

    /* Category clicks (sidebar) */
    if (sidebarCats) {
      sidebarCats.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-category]');
        if (!btn) return;
        state.selectedCategory = btn.getAttribute('data-category');
        if (mobileFilters) mobileFilters.classList.add('hidden');
        renderAll();
      });
    }

    /* System clicks (sidebar) */
    if (sidebarSystems) {
      sidebarSystems.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-system]');
        if (!btn) return;
        state.selectedSystem = btn.getAttribute('data-system');
        if (mobileFilters) mobileFilters.classList.add('hidden');
        renderAll();
      });
    }

    /* Mobile selects */
    if (mobileCatSelect) {
      mobileCatSelect.addEventListener('change', function () {
        state.selectedCategory = mobileCatSelect.value;
        renderAll();
      });
    }
    if (mobileSysSelect) {
      mobileSysSelect.addEventListener('change', function () {
        state.selectedSystem = mobileSysSelect.value;
        renderAll();
      });
    }

    /* Search: hero input + catalog input, live */
    if (heroSearch) {
      heroSearch.addEventListener('input', function () {
        state.searchQuery = heroSearch.value;
        if (searchInput && searchInput.value !== heroSearch.value) searchInput.value = heroSearch.value;
        renderAll();
      });
    }
    if (searchInput) {
      searchInput.addEventListener('input', function () {
        state.searchQuery = searchInput.value;
        if (heroSearch && heroSearch.value !== searchInput.value) heroSearch.value = searchInput.value;
        renderAll();
      });
    }
    if (searchForm) {
      searchForm.addEventListener('submit', function (e) {
        e.preventDefault();
        state.searchQuery = searchInput ? searchInput.value : '';
        if (heroSearch) heroSearch.value = state.searchQuery;
        renderAll();
      });
    }

    /* Sort */
    if (sortSelect) {
      sortSelect.addEventListener('change', function () {
        state.sortBy = sortSelect.value;
        renderAll();
      });
    }

    /* Mobile filters toggle */
    if ($('#btnMobileFilters') && mobileFilters) {
      $('#btnMobileFilters').addEventListener('click', function () {
        mobileFilters.classList.toggle('hidden');
      });
    }
    if ($('#btnCloseMobileFilters') && mobileFilters) {
      $('#btnCloseMobileFilters').addEventListener('click', function () {
        mobileFilters.classList.add('hidden');
      });
    }

    /* Reset all filters */
    var resetBtn = $('#btnReset');
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        state.selectedCategory = 'all';
        state.selectedSystem = 'all';
        state.searchQuery = '';
        state.sortBy = 'default';
        if (heroSearch) heroSearch.value = '';
        if (searchInput) searchInput.value = '';
        if (sortSelect) sortSelect.value = 'default';
        renderAll();
      });
    }

    renderAll();
  }

  /* ============================================================
     Product detail page (product-detail.html?id=...)
     ============================================================ */
  function setText(sel, value) {
    var el = $(sel);
    if (el && value != null) el.innerHTML = value;
  }

  function setHtml(sel, html) {
    var el = $(sel);
    if (el) el.innerHTML = html;
  }

  /* Reads ?id=... but never injects it. The value is only used as a lookup key
     against PRODUCTS (see findProduct); anything unrecognised falls through to
     the "Product Not Found" panel. Length + character checks keep a hostile
     query string from becoming a cheap DoS. */
  function readProductId() {
      var raw = null;
      try {
        raw = new URLSearchParams(window.location.search).get('id');
      } catch (err) {
        var m = (window.location.search || '').match(/[?&]id=([^&]+)/);
        raw = m ? m[1] : null;
      }
      if (raw == null) {
        /* Clean permalink form: /product-detail/chem-2k-shield (see .htaccess) */
        var pm = (window.location.pathname || '').match(/\/product-detail\/([a-z0-9][a-z0-9-]*)\/?$/i);
        raw = pm ? pm[1] : null;
      }
      if (raw == null) return null;
    var id;
    try {
      id = decodeURIComponent(String(raw));
    } catch (err) {
      return null;
    }
    id = String(id).trim();
    if (!id || id.length > 80) return null;
    if (!/^[a-z0-9][a-z0-9-]*$/i.test(id)) return null;   /* ids look like chem-pu-elasto-pro */
    return id;
  }

  function initDetail() {
    var id = readProductId();
    var p = findProduct(id);
    var missing = $('#detail-missing');
    var main = $('#detail-main');
    if (!p) {
      if (missing) missing.classList.remove('hidden');
      if (main) main.classList.add('hidden');
      return;
    }
    if (missing) missing.classList.add('hidden');
    if (main) main.classList.remove('hidden');

    /* One product-detail.html template serves all 14 products, so the per-product
       SEO text is written into <head> at runtime. Crawlers that execute JS see
       product-specific metadata; the static tags in product-detail.html remain
       an accurate generic fallback. */
    function setMeta(attr, key, content) {
      if (!content) return;
      var sel = attr === 'name' ? 'meta[name="' + key + '"]' : 'meta[property="' + key + '"]';
      var el = document.head.querySelector(sel);
      if (el) { el.setAttribute('content', content); return; }
      el = document.createElement('meta');
      el.setAttribute(attr, key);
      el.setAttribute('content', content);
      document.head.appendChild(el);
    }

    /* Search engines truncate around 155 chars, so build to that budget and cut
       on a word boundary rather than mid-word. */
    function clamp(str, max) {
      str = String(str || '').replace(/\s+/g, ' ').trim();
      if (str.length <= max) return str;
      var cut = str.slice(0, max - 1);
      var sp = cut.lastIndexOf(' ');
      if (sp > max * 0.6) cut = cut.slice(0, sp);
      return cut.replace(/[\s,;:.–—-]+$/, '') + '…';
    }

    /* Lead with the product name, then its one-line purpose, then enough of the
       long description to fill the remaining budget. */
    var lead = p.name + ' - ' + p.subTitle + '. ';
    var metaDesc = clamp(lead + (p.description || ''), 155);

    document.title = p.name + ' — THE CHEMICAL FACTORY';
    setMeta('name', 'description', metaDesc);
    setMeta('property', 'og:title', p.name + ' — THE CHEMICAL FACTORY');
    setMeta('property', 'og:description', metaDesc);
    setMeta('property', 'og:image', p.image);
    setMeta('name', 'twitter:title', p.name + ' — THE CHEMICAL FACTORY');
    setMeta('name', 'twitter:description', metaDesc);
    setMeta('name', 'twitter:image', p.image);

    /* Media column */
    var mainImg = $('#detail-img');
    if (mainImg) {
      mainImg.src = p.image;
      mainImg.alt = p.name + ' - product packaging';
      mainImg.width = parseInt(p.imageW, 10) || mainImg.width;
      mainImg.height = parseInt(p.imageH, 10) || mainImg.height;
      mainImg.setAttribute('decoding', 'async');
    }
    setHtml('#detail-chips', [
      { label: 'Packaging', value: p.packaging },
      { label: 'Shelf Life', value: (p.importantInfo || []).filter(function (i) { return /shelf life/i.test(i.label); }).map(function (i) { return i.value; })[0] || '\u2014' },
      { label: 'Datasheet', value: datasheetMeta(p) }
    ].map(function (c) {
      return '<div class="detail-chip"><span>' + esc(c.label) + '</span><strong>' + esc(c.value) + '</strong></div>';
    }).join(''));

    /* Overview panel */
    setText('#detail-cat', p.categoryLabel);
    setText('#detail-name', p.name);
    setText('#crumb-product', p.name);
    setText('#detail-subtitle', p.subTitle);
    setText('#detail-desc', p.description);

    /* Quick facts */
    setHtml('#detail-facts', [
      { label: 'Theoretical Coverage', value: p.coverage },
      { label: 'Packaging', value: p.packaging },
      { label: 'Hazard Class', value: ((p.importantInfo || []).filter(function (i) { return /hazard/i.test(i.label); })[0] || {}).value || '\u2014' },
      { label: 'Datasheet', value: '' }
    ].map(function (f) {
      if (f.label === 'Datasheet') {
        return '<div class="detail-extra__card">'
          + '<div class="detail-extra__icon">' + PDF_SVG + '</div>'
          + '<div>'
          + '<div class="detail-extra__label">' + esc(f.label) + '</div>'
          + '<div class="detail-extra__value">' + renderDownloadLink(p, 'detail-pdf-link', 'Download PDF Datasheet') + '</div>'
          + '</div></div>';
      }
      return '<div class="detail-extra__card">'
        + '<div class="detail-extra__icon">' + DOWNLOAD_SVG + '</div>'
        + '<div>'
        + '<div class="detail-extra__label">' + esc(f.label) + '</div>'
        + '<div class="detail-extra__value">' + esc(f.value) + '</div>'
        + '</div></div>';
    }).join(''));

    /* Key features (icon list) */
    setHtml('#detail-features', (p.keyFeatures || []).map(function (f) {
      return '<li>' + esc(f.charAt(0) + f.slice(1).toLowerCase()) + '</li>';
    }).join(''));

    /* Recommended uses */
    setHtml('#detail-apps', (p.uses || []).map(function (u) { return '<li>' + esc(u) + '</li>'; }).join(''));

    /* Full technical data table */
    setHtml('#detail-specs', (p.techData || []).map(function (row) {
      return '<tr><td class="data-table__name">' + esc(row.property) + '</td>'
        + '<td><strong>' + esc(row.value) + '</strong></td></tr>';
    }).join(''));

    /* Consumption + guidance */
    setHtml('#detail-consumption', [
      '<h3 class="detail-panel__title">Consumption &amp; Coverage</h3>'
      + '<ul class="detail-list detail-list--plain">'
      + (p.consumption || []).map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('')
      + '</ul>'
      + (p.guidance ? '<p class="detail-note">' + esc(p.guidance) + '</p>' : '')
    ].join(''));

    /* Standards */
    setHtml('#detail-standards', (p.standards || []).map(function (s) {
      return '<li>' + esc(s) + '</li>';
    }).join(''));

    /* Important information grid */
    setHtml('#detail-important', (p.importantInfo || []).map(function (i) {
      return '<div class="info-card">'
        + '<div class="info-card__label">' + esc(i.label) + '</div>'
        + '<div class="info-card__value">' + esc(i.value) + '</div>'
        + '</div>';
    }).join(''));

    /* Application guidelines */
    setHtml('#detail-guidelines', (p.applicationGuidelines || []).map(function (g) {
      return '<div class="guideline">'
        + '<div class="guideline__head">'
        + '<span class="guideline__icon">' + CHECK_SVG + '</span>'
        + '<h3 class="guideline__title">' + esc(g.title) + '</h3>'
        + '</div>'
        + '<p class="guideline__text">' + esc(g.text) + '</p>'
        + '</div>';
    }).join(''));

    /* Disclaimer */
    setText('#detail-disclaimer', DATA.disclaimer);

    /* Main datasheet call-to-action */
    setHtml('#detail-datasheet-cta',
      '<div class="datasheet-cta">'
      + '<div class="datasheet-cta__icon">' + PDF_SVG + '</div>'
      + '<div class="datasheet-cta__text">'
      + '<h3 class="datasheet-cta__title">Full Technical Datasheet (PDF)</h3>'
      + '<p class="datasheet-cta__sub">Complete property matrix, consumption figures and application guidelines for '
      + esc(p.name) + '.</p>'
      + '</div>'
      + renderDownloadLink(p, 'btn-datasheet-download', 'Download PDF')
      + '</div>');

    /* Tag the inspection CTA with this product so the quote modal can pre-fill it */
    setText('#detail-cta-product', 'Site Inspection');
    Array.prototype.forEach.call(document.querySelectorAll('.js-open-inspection'), function (btn) {
      btn.setAttribute('data-product-id', p.id);
      btn.setAttribute('data-product-name', p.name);
      btn.setAttribute('data-product-subtitle', p.subTitle);
      btn.setAttribute('data-product-category', p.categoryLabel);
      btn.setAttribute('data-product-packaging', p.packaging);
    });

    /* WhatsApp CTA */
    var waLink = $('#detail-wa');
    if (waLink) {
      var msg = 'Hello The Chemical Factory team, I would like to inquire about *'
        + p.name + '* (' + p.subTitle + '). Please share availability, pricing, and technical guidance.';
      waLink.href = 'https://wa.me/923043600297?text=' + encodeURIComponent(msg);
    }

    /* Related products (same system first, then same category) */
    var relatedGrid = $('#related-grid');
    if (relatedGrid) {
      var related = PRODUCTS
        .filter(function (r) { return r.id !== p.id && r.category === p.category; });
      if (related.length < 3) {
        PRODUCTS
          .filter(function (r) {
            return r.id !== p.id && related.indexOf(r) === -1 && systemOf(r) === systemOf(p);
          })
          .forEach(function (r) { related.push(r); });
      }
      relatedGrid.innerHTML = related.slice(0, 3).map(renderCard).join('');
    }
  }

  /* ============================================================
     Datasheets page (datasheets.html)
     ============================================================ */
  function initDatasheets() {
    var grid = $('#datasheet-cards');
    if (!grid) return;

    grid.innerHTML = PRODUCTS.map(function (p) {
      if (!safeDatasheet(p)) return '';
      var search = [
        p.name,
        p.subTitle,
        p.categoryLabel,
        p.packaging,
        p.coverage
      ].join(' ').toLowerCase();
      return '<article class="ds-card" data-search="' + esc(search) + '">'
        + '<a class="ds-card__preview" href="' + detailHref(p.id) + '" aria-label="View ' + esc(p.name) + ' details">'
        + '<img class="ds-card__img" src="' + esc(p.image) + '" alt="' + esc(p.name) + '"' + imageAttrs(p) + ' />'
        + '</a>'
        + '<div class="ds-card__body">'
        + '<h3 class="ds-card__title">' + esc(p.name) + '</h3>'
        + '<dl class="ds-card__meta">'
        + '<div class="ds-card__meta-row"><dt>Packaging</dt><dd>' + esc(p.packaging) + '</dd></div>'
        + '<div class="ds-card__meta-row"><dt>Coverage</dt><dd>' + esc(p.coverage) + '</dd></div>'
        + '</dl>'
        + renderDownloadLink(p, 'ds-card__download', 'Download')
        + '</div>'
        + '</article>';
    }).join('');

    var countEl = $('#datasheet-count');
    if (countEl) countEl.innerHTML = '<strong>' + PRODUCTS.length + '</strong> downloadable product datasheets';

    /* Search filter */
    var input = $('#datasheet-search');
    if (input) {
      input.addEventListener('input', function () {
        var q = input.value.trim().toLowerCase();
        var cards = grid.querySelectorAll('.ds-card');
        var visible = 0;
        Array.prototype.forEach.call(cards, function (card) {
          var hit = !q || (card.getAttribute('data-search') || '').indexOf(q) !== -1;
          card.style.display = hit ? '' : 'none';
          if (hit) visible += 1;
        });
        var none = $('#datasheet-no-results');
        if (none) none.classList.toggle('hidden', visible > 0);
        var bar = $('#datasheet-cards');
        if (bar) bar.classList.toggle('hidden', visible === 0);
      });
    }
  }

  /* ============================================================
     Toast for datasheet downloads (survives re-renders)
     ============================================================ */
  var downloadToastTimer = null;
  function showDownloadToast() {
    var el = document.querySelector('.toast');
    if (!el) {
      el = document.createElement('div');
      el.className = 'toast';
      document.body.appendChild(el);
    }
    el.textContent = 'Datasheet download started \u2014 check your downloads folder';
    el.classList.add('is-show');
    clearTimeout(downloadToastTimer);
    downloadToastTimer = setTimeout(function () {
      el.classList.remove('is-show');
    }, 2600);
  }

  document.addEventListener('click', function (e) {
    var link = e.target.closest ? e.target.closest('a[data-pdf]') : null;
    if (!link) return;
    showDownloadToast();
  });

  /* ============================================================
     Init based on page contents
     ============================================================ */
  if ($('#productResults')) initCatalog();
  if ($('#detail-main')) initDetail();
  if ($('#datasheet-cards')) initDatasheets();
})();
/* ============================================================
   THE CHEMICAL FACTORY — product catalog & detail rendering
   Depends on js/products-data.js (window.TCF_PRODUCTS).
   - products.html         (data-page="products")         renders the full catalog grid
   - product-detail.html   (?id=<productId>)              renders the product detail page
   ============================================================ */
(function () {
  'use strict';

  var DATA = window.TCF_PRODUCTS;
  if (!DATA) return;

  function $(sel) { return document.querySelector(sel); }

  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function fmt(n, fraction) {
    var opts = fraction ? { minimumFractionDigits: 2, maximumFractionDigits: 2 } : {};
    return Number(n).toLocaleString('en-US', opts);
  }

  function findProduct(id) {
    var i;
    for (i = 0; i < DATA.products.length; i++) {
      if (DATA.products[i].id === id) return DATA.products[i];
    }
    return null;
  }

  function detailHref(id) {
    return 'product-detail.html?id=' + encodeURIComponent(id);
  }

  var ARROW =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
    + '<line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>';

  var DOWNLOAD_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
    + '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>'
    + '</svg>';

  /* ============================================================
     Shared product card
     ============================================================ */
  function renderCard(p) {
    var badges = '';
    if (p.onSale) badges += '<span class="product-card__badge product-card__badge--sale">Sale!</span>';
    if (p.badge) badges += '<span class="product-card__badge">' + esc(p.badge) + '</span>';
    var chips = p.variants.slice(0, 3).map(function (v) {
      return '<span class="product-card__chip">' + esc(v.size.replace(' (Liquid + Powder)', '')) + '</span>';
    }).join('');
    var more = p.variants.length > 3
      ? '<span class="product-card__chip product-card__chip--more">+' + (p.variants.length - 3) + ' more</span>'
      : '';

    return '<article class="product-card" data-category="' + esc(p.category) + '" data-id="' + esc(p.id) + '">'
      + '<a class="product-card__img" href="' + detailHref(p.id) + '" aria-label="View ' + esc(p.name) + '">'
      + '<img src="' + esc(p.image) + '" alt="' + esc(p.name) + '" loading="lazy" />'
      + '<span class="product-card__cat">' + esc(p.subCategory || p.categoryLabel) + '</span>'
      + '<span class="product-card__badges">' + badges + '</span>'
      + '</a>'
      + '<div class="product-card__body">'
      + '<div class="product-card__meta">'
      + '<span class="product-card__stars">&#9733; ' + p.rating + ' <span class="product-card__rv">(' + p.reviewCount + ')</span></span>'
      + '</div>'
      + '<h3 class="product-card__name">' + esc(p.name) + '</h3>'
      + '<p class="product-card__spec">' + esc(p.subTitle) + '</p>'
      + (chips ? '<div class="product-card__packs">' + chips + more + '</div>' : '')
      + '<div class="product-card__foot">'
      + '<a href="' + detailHref(p.id) + '" class="product-card__view">View Details<span class="product-card__arrow">' + ARROW + '</span></a>'
      + '<button type="button" class="product-card__download js-download-product"><span class="product-card__download-icon">' + DOWNLOAD_SVG + '</span>Download</button>'
      + '</div>'
      + '</div>'
      + '</article>';
  }

  /* ============================================================
     Catalog page (products.html)
     ============================================================ */
  var CATEGORY_META = {
    coatings:    'Waterproofing Coatings',
    diluters:    'Diluters & Solvents',
    repellents:  'Water Repellents',
    sealants:    'Sealants & Gap Fillers',
    admixtures:  'Admixtures & Hardeners',
    membranes:   'Geomembranes & Liners'
  };

  function buildCategories() {
    var cats = [{ id: 'all', name: 'All Products', count: DATA.products.length }];
    DATA.products.forEach(function (p) {
      var existing = null;
      var i;
      for (i = 0; i < cats.length; i++) {
        if (cats[i].id === p.category) { existing = cats[i]; break; }
      }
      if (existing) {
        existing.count += 1;
      } else {
        cats.push({ id: p.category, name: CATEGORY_META[p.category] || p.category, count: 1 });
      }
    });
    return cats;
  }

  function initCatalog() {
    var results = $('#productResults');
    var noResults = $('#noResults');
    var resultsText = $('#resultsText');
    var sidebarCats = $('#sidebarCategories');
    var mobileCatSelect = $('#mobileCategorySelect');
    var mobileFilters = $('#mobileFilters');
    var priceRange = $('#priceRange');
    var priceValue = $('#priceValue');
    var sortSelect = $('#sortSelect');
    var heroSearch = $('#product-hero-search');
    var searchInput = $('#product-search-input');
    var searchForm = $('#product-search-form');

    if (!results) return;

    var categories = buildCategories();

    var state = {
      selectedCategory: 'all',
      searchQuery: '',
      sortBy: 'default',
      maxPrice: 55000
    };

    function filtered() {
      var q = state.searchQuery.trim().toLowerCase();
      return DATA.products.filter(function (p) {
        if (state.selectedCategory !== 'all' && p.category !== state.selectedCategory) return false;
        if (q) {
          var hay = (p.name + ' ' + (p.subTitle || '') + ' ' + (p.description || '') + ' ' + (p.subCategory || '')).toLowerCase();
          if (hay.indexOf(q) === -1) return false;
        }
        if (p.minPrice > state.maxPrice) return false;
        return true;
      }).sort(function (a, b) {
        switch (state.sortBy) {
          case 'price-asc': return a.minPrice - b.minPrice;
          case 'price-desc': return b.minPrice - a.minPrice;
          case 'rating': return b.rating - a.rating;
          case 'name': return a.name.localeCompare(b.name);
          default: return 0;
        }
      });
    }

    function grouped() {
      var list = filtered();
      var cats = state.selectedCategory === 'all'
        ? categories.filter(function (c) { return c.id !== 'all'; })
        : categories.filter(function (c) { return c.id === state.selectedCategory; });
      return cats
        .map(function (cat) {
          return {
            cat: cat,
            products: list.filter(function (p) { return p.category === cat.id; })
          };
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
      if (mobileCatSelect) {
        mobileCatSelect.innerHTML = categories.map(function (c) {
          return '<option value="' + esc(c.id) + '"' + (c.id === state.selectedCategory ? ' selected' : '') + '>'
            + esc(c.name) + ' (' + c.count + ')</option>';
        }).join('');
      }
    }

    function renderResultsBar() {
      var n = filtered().length;
      var html = 'Showing <strong>' + n + '</strong> results';
      if (state.selectedCategory !== 'all') {
        var cat = categories.filter(function (c) { return c.id === state.selectedCategory; })[0];
        if (cat) html += '<span class="in-cat">in ' + esc(cat.name) + '</span>';
      }
      if (resultsText) resultsText.innerHTML = html;
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
          + '<span class="cat-group__count">' + g.products.length + ' products</span>'
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

    function updatePrice() {
      if (!priceRange) return;
      state.maxPrice = parseInt(priceRange.value, 10) || 55000;
      if (priceValue) priceValue.textContent = fmt(state.maxPrice);
      renderAll();
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

    /* Mobile category select */
    if (mobileCatSelect) {
      mobileCatSelect.addEventListener('change', function () {
        state.selectedCategory = mobileCatSelect.value;
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

    /* Price range */
    if (priceRange) priceRange.addEventListener('input', updatePrice);

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
        state.searchQuery = '';
        state.sortBy = 'default';
        state.maxPrice = 55000;
        if (heroSearch) heroSearch.value = '';
        if (searchInput) searchInput.value = '';
        if (sortSelect) sortSelect.value = 'default';
        if (priceRange) priceRange.value = '55000';
        renderAll();
      });
    }

    renderAll();
  }

  /* ============================================================
     Product detail page (product-detail.html?id=...)
     ============================================================ */
  function initDetail() {
    var id = null;
    try {
      id = new URLSearchParams(window.location.search).get('id');
    } catch (err) {
      var m = (window.location.search || '').match(/[?&]id=([^&]+)/);
      id = m ? decodeURIComponent(m[1]) : null;
    }

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

    document.title = p.name + ' — THE CHEMICAL FACTORY';

    /* Hero */
    var heroImg = $('#detail-hero-img');
    var crumb = $('#detail-crumb');
    var heroTitle = $('#detail-title');
    var heroSub = $('#detail-sub');
    if (heroImg) heroImg.src = p.image;
    if (crumb) crumb.textContent = 'Products / ' + (p.categoryLabel || '');
    if (heroTitle) heroTitle.textContent = p.name;
    if (heroSub) heroSub.textContent = p.subTitle;

    /* Main info column */
    var mainImg = $('#detail-img');
    var mainCat = $('#detail-cat');
    var mainName = $('#detail-name');
    var mainSub = $('#detail-subtitle');
    var mainDesc = $('#detail-desc');
    var mainRating = $('#detail-rating');
    if (mainImg) mainImg.src = p.image;
    if (mainImg) mainImg.alt = p.name;
    if (mainCat) mainCat.textContent = p.categoryLabel + ' \u2022 ' + (p.subCategory || '');
    if (mainName) mainName.textContent = p.name;
    if (mainSub) mainSub.textContent = p.subTitle;
    if (mainDesc) mainDesc.textContent = p.description;
    if (mainRating) mainRating.innerHTML = '&#9733; ' + p.rating + ' <span>(' + p.reviewCount + ' reviews)</span>';

    /* Variants table */
    var variantsBody = $('#detail-variants');
    if (variantsBody) {
      variantsBody.innerHTML = p.variants.map(function (v) {
        var was = v.originalPrice
          ? '<span class="detail-was">Rs ' + fmt(v.originalPrice) + '</span>'
          : '';
        return '<tr>'
          + '<td class="data-table__name">' + esc(v.size) + '</td>'
          + '<td><span class="data-table__cat">' + esc(v.unit) + '</span></td>'
          + '<td><strong>Rs ' + fmt(v.price, true) + '</strong>' + was + '</td>'
          + '</tr>';
      }).join('');
    }

    /* Key features + applications */
    var featuresEl = $('#detail-features');
    var appsEl = $('#detail-apps');
    if (featuresEl) {
      featuresEl.innerHTML = p.keyFeatures.map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('');
    }
    if (appsEl) {
      appsEl.innerHTML = p.applications.map(function (a) { return '<li>' + esc(a) + '</li>'; }).join('');
    }

    /* Coverage + curing */
    var covEl = $('#detail-coverage');
    var cureEl = $('#detail-curing');
    if (covEl) covEl.textContent = p.coverage;
    if (cureEl) cureEl.textContent = p.curingTime;

    /* Technical specs table */
    var specBody = $('#detail-specs');
    if (specBody) {
      var tds = p.technicalSpecs || {};
      var known = ['basePolymer', 'elongation', 'tensileStrength', 'temperatureResistance', 'vocContent', 'specificGravity', 'thickness', 'softeningPoint', 'weight', 'shelfLife'];
      var rows = '';
      rows += tds.basePolymer ? specRow('Base Chemistry', tds.basePolymer) : '';
      rows += tds.elongation ? specRow('Elongation at Break', tds.elongation) : '';
      rows += tds.tensileStrength ? specRow('Tensile Strength', tds.tensileStrength) : '';
      rows += tds.temperatureResistance ? specRow('Temperature Limits', tds.temperatureResistance) : '';
      rows += tds.vocContent ? specRow('VOC Content', tds.vocContent) : '';
      rows += tds.specificGravity ? specRow('Specific Gravity', tds.specificGravity) : '';
      rows += tds.thickness ? specRow('Thickness', tds.thickness) : '';
      rows += tds.softeningPoint ? specRow('Softening Point', tds.softeningPoint) : '';
      rows += tds.weight ? specRow('Weight', tds.weight) : '';
      rows += tds.shelfLife ? specRow('Shelf Life', tds.shelfLife) : '';
      Object.keys(tds).forEach(function (key) {
        if (known.indexOf(key) === -1) {
          var label = key.replace(/([A-Z])/g, ' $1').replace(/^./, function (c) { return c.toUpperCase(); });
          rows += specRow(label, tds[key]);
        }
      });
      specBody.innerHTML = rows;
    }

    /* WhatsApp CTA */
    var waLink = $('#detail-wa');
    if (waLink) {
      var msg = 'Hello The Chemical Factory team, I would like to inquire about *'
        + p.name + '* (' + p.subTitle + '). Please share availability, pricing, and technical guidance.';
      waLink.href = 'https://wa.me/923043600297?text=' + encodeURIComponent(msg);
    }

    /* Related products */
    var relatedGrid = $('#related-grid');
    if (relatedGrid) {
      var related = DATA.products
        .filter(function (r) { return r.id !== p.id && r.category === p.category; })
        .slice(0, 3);
      relatedGrid.innerHTML = related.map(renderCard).join('');
    }
  }

  function specRow(k, v) {
    return '<tr><td>' + esc(k) + '</td><td><strong>' + esc(v) + '</strong></td></tr>';
  }

  /* ============================================================
     Shared toast + card download delegation (survives re-renders)
     ============================================================ */
  var downloadToastTimer = null;
  document.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('.js-download-product') : null;
    if (!btn) return;
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
  });

  /* ============================================================
     Init based on page contents
     ============================================================ */
  if ($('#productResults')) initCatalog();
  if ($('#detail-main')) initDetail();
})();

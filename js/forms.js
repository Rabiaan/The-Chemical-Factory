/* ============================================================
   THE CHEMICAL FACTORY — form validation + honest submission
   Loaded on every page (after components.js, before main.js).

   Why this exists
   ----------------
   The contact form and the quote modal used to show a green success
   panel while sending absolutely nothing anywhere. That is misleading,
   so this module does one of two honest things:

     1. Builds a prefilled mailto: link from the validated fields and
        hands it to the visitor's own mail client. No backend needed.
     2. OR, once a real endpoint exists, posts the same payload there
        (see TODO below).

   It never uses action="mailto:" on the <form> element, because that
   attribute is unreliable across browsers and leaks the whole body into
   the URL / a new tab.

   Everything user-supplied is trimmed, length-bounded, and rendered
   with textContent or encodeURIComponent. Nothing here touches innerHTML.
   ============================================================ */
(function () {
  'use strict';

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  };

  /* Where the enquiry is actually delivered. The mail client is opened
     with this address. TODO(owner): confirm this is the monitored sales
     inbox, and switch to a real form endpoint (Formspree/Netlify Forms/
     own API) if you would rather not rely on the visitor's mail client. */
  var CONTACT_EMAIL = 'dechemicalfactory@gmail.com';

  /* Optional WhatsApp hand-off. Same number as the footer CTA. */
  var WHATSAPP_NUMBER = '923043600297';

  /* ---------- Field rules ---------- */
  var MAX = { name: 100, email: 254, phone: 20, message: 500 };

  /* Deliberately permissive: international numbers vary wildly.
     Requires 7-15 digits, and allows an optional leading +. */
  var RE_PHONE = /^\+?[0-9][0-9\s().-]{5,19}$/;
  var RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  /* Rejects the classic header-injection guard: no CR/LF anywhere. */
  var RE_NO_NEWLINE = /[\r\n]/;

  function trim(v) { return String(v == null ? '' : v).trim(); }

  function countDigits(s) {
    var m = String(s).replace(/[^0-9]/g, '');
    return m.length;
  }

  function validators() {
    return {
      name: function (v) {
        var s = trim(v);
        if (!s) return 'Please enter your name.';
        if (s.length > MAX.name) return 'Name must be ' + MAX.name + ' characters or fewer.';
        if (RE_NO_NEWLINE.test(s)) return 'Name cannot contain line breaks.';
        return '';
      },
      phone: function (v) {
        var s = trim(v);
        if (!s) return 'Please enter your phone number.';
        if (s.length > MAX.phone) return 'Phone number looks too long.';
        if (!RE_PHONE.test(s)) return 'Use digits, spaces and + only (e.g. +92 304 3600297).';
        var d = countDigits(s);
        if (d < 7 || d > 15) return 'Phone number must contain 7 to 15 digits.';
        return '';
      },
      email: function (v) {
        var s = trim(v);
        if (!s) return '';                      /* optional */
        if (s.length > MAX.email) return 'Email address is too long.';
        if (RE_NO_NEWLINE.test(s)) return 'Email cannot contain line breaks.';
        if (!RE_EMAIL.test(s)) return 'That does not look like a valid email address.';
        return '';
      },
      message: function (v) {
        var s = trim(v);
        if (s.length > MAX.message) return 'Please keep this under ' + MAX.message + ' characters.';
        return '';
      }
    };
  }

  /* ---------- Accessible inline errors ----------
     Each field gets a sibling error node with aria-live="polite" so screen
     readers announce the problem without stealing focus. The field itself is
     flagged aria-invalid. No alert(), no native bubble (forms use novalidate). */
  function errorNodeFor(field) {
    var id = field.id;
    if (!id) return null;
    return document.getElementById(id + '-error');
  }

  function setFieldError(field, message) {
    if (!field) return;
    var node = errorNodeFor(field);
    if (message) {
      field.setAttribute('aria-invalid', 'true');
      field.classList.add('has-error');
      if (node) {
        node.textContent = message;
        /* Tie the message to the input for assistive tech. */
        var describedBy = (field.getAttribute('aria-describedby') || '')
          .split(/\s+/).filter(Boolean);
        if (describedBy.indexOf(node.id) === -1) describedBy.push(node.id);
        field.setAttribute('aria-describedby', describedBy.join(' '));
      }
    } else {
      field.removeAttribute('aria-invalid');
      field.classList.remove('has-error');
      if (node) node.textContent = '';
    }
  }

  /* Validates one field by its id, using the rules above.
     Returns true when valid. */
  function validateField(field) {
    if (!field) return true;
    var rules = validators();
    var kind = field.getAttribute('data-validate');
    var msg = '';
    if (kind && rules[kind]) msg = rules[kind](field.value);
    setFieldError(field, msg);
    return !msg;
  }

  /* Validates every [data-validate] field inside root.
     Focuses the first invalid one and returns false if anything failed. */
  function validateForm(root) {
    if (!root) return true;
    var fields = $$('[data-validate]', root);
    var firstBad = null;
    fields.forEach(function (f) {
      if (!validateField(f) && !firstBad) firstBad = f;
    });
    if (firstBad) {
      try { firstBad.focus({ preventScroll: false }); } catch (e) { firstBad.focus(); }
      return false;
    }
    return true;
  }

  /* Re-validate on blur once a field has been marked invalid, so the error
     clears as soon as the visitor fixes it (without nagging while typing). */
  function wireLiveValidation(root) {
    $$('[data-validate]', root).forEach(function (f) {
      f.addEventListener('blur', function () {
        if (f.getAttribute('aria-invalid') === 'true') validateField(f);
      });
      f.addEventListener('input', function () {
        if (f.getAttribute('aria-invalid') === 'true') validateField(f);
      });
    });
  }

  /* ---------- Honeypot ----------
     A real visitor never sees or fills this. Bots that fill every input
     get their submission dropped silently. */
  var HONEYPOT_FIELD = 'company-website';
  function honeypotTripped(form) {
    var hp = form.querySelector('input[name="' + HONEYPOT_FIELD + '"]');
    return !!(hp && trim(hp.value));
  }

  /* ---------- Building the outgoing message ---------- */
  function collect(form, mapping) {
    var out = {};
    Object.keys(mapping).forEach(function (key) {
      var el = form.querySelector(mapping[key]);
      out[key] = el ? trim(el.value) : '';
    });
    return out;
  }

  function buildBody(subject, rows) {
    var lines = [subject, ''];
    rows.forEach(function (r) {
      if (r.value) lines.push(r.label + ': ' + r.value);
    });
    var extra = rows.filter(function (r) { return r.multiline && r.value; })
      .map(function (r) { return r.label + ':\n' + r.value; });
    if (extra.length) {
      lines.push('');
      lines = lines.concat(extra);
    }
    return lines.join('\n');
  }

  /* Opens the visitor's mail client with everything filled in.
     Returns the mailto URL so callers can log or test it. */
  function buildMailto(subject, body) {
    return 'mailto:' + encodeURIComponent(CONTACT_EMAIL)
      + '?subject=' + encodeURIComponent(subject)
      + '&body=' + encodeURIComponent(body);
  }

  function buildWhatsApp(body) {
    return 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(body);
  }

  /* Same-origin PHP endpoint (send-mail.php) that emails the enquiry to
     CONTACT_EMAIL via the host's mail(). Requires PHP on the host — standard
     on cPanel / shared Apache hosting. If the endpoint is missing or mail()
     is not configured, deliver() falls back to the mailto: hand-off below so
     the visitor still has a way to reach us. */
  var FORM_ENDPOINT = 'send-mail.php';

  function deliver(payload, mailtoUrl, onDone) {
    if (!FORM_ENDPOINT || typeof window.fetch !== 'function') {
      window.location.href = mailtoUrl;
      if (onDone) onDone(payload);
      return;
    }

    var controller = typeof AbortController === 'function' ? new AbortController() : null;
    var timer = controller ? window.setTimeout(function () { controller.abort(); }, 15000) : null;

    window.fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=UTF-8', 'Accept': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller ? controller.signal : undefined
    }).then(function (res) {
      if (timer) window.clearTimeout(timer);
      return res.json().catch(function () { return { ok: res.ok }; }).then(function (data) {
        if (res.ok && data && data.ok) {
          if (onDone) onDone(payload);
          return;
        }
        throw new Error((data && data.status) || 'send_failed');
      });
    }).catch(function () {
      if (timer) window.clearTimeout(timer);
      /* Endpoint unreachable or mail() failed — hand off to the mail client. */
      showFormToast('Could not send automatically — opening your email app instead.');
      window.location.href = mailtoUrl;
      if (onDone) onDone(payload);
    });
  }

  /* ---------- Shared toast ---------- */
  function showFormToast(message) {
    var el = document.querySelector('.toast');
    if (!el) {
      el = document.createElement('div');
      el.className = 'toast';
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.classList.add('is-show');
    window.clearTimeout(el._toastTimer);
    el._toastTimer = window.setTimeout(function () { el.classList.remove('is-show'); }, 4000);
  }

  /* ---------- Contact page form ---------- */
  function initContactForm() {
    var form = $('#contact-form');
    if (!form) return;
    wireLiveValidation(form);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (honeypotTripped(form)) return;                 /* silently drop bots */
      if (!validateForm(form)) return;

      var data = collect(form, {
        name: '#contact-name',
        phone: '#contact-phone',
        email: '#contact-email',
        subject: '#contact-subject',
        message: '#contact-message'
      });

      var subject = 'Website enquiry: ' + (data.subject || 'General');
      var body = buildBody('Website enquiry from thechemicalfactory.com', [
        { label: 'Name', value: data.name },
        { label: 'Phone', value: data.phone },
        { label: 'Email', value: data.email },
        { label: 'Subject', value: data.subject },
        { label: 'Project details', value: data.message, multiline: true }
      ]);

      var payload = {
        form: 'contact',
        name: data.name,
        phone: data.phone,
        email: data.email,
        subject: data.subject || 'General',
        message: data.message
      };
      var mailtoUrl = buildMailto(subject, body);

      deliver(payload, mailtoUrl, function () {
        showFormToast('Opening your email app — press send to finish.');
        form.reset();
        $$('[data-validate]', form).forEach(function (f) { setFieldError(f, ''); });
      });
    });
  }

  /* ---------- Quote modal form ---------- */
  function initQuoteForm() {
    var form = $('#quote-form');
    if (!form) return;
    wireLiveValidation(form);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (honeypotTripped(form)) return;
      if (!validateForm(form)) return;

      var data = collect(form, {
        name: '#name',
        phone: '#phone',
        email: '#email',
        city: '#city',
        notes: '#notes',
        areaType: '#area-type',
        system: '#system',
        sqft: '#sqft-value',
        price: '#est-range',
        symptoms: '#insp-symptoms'
      });

      /* Selected checkboxes in the inspection picker. Values come from our own
         markup, but are re-read defensively. */
      var symptoms = $$('#insp-symptoms input[type="checkbox"]')
        .filter(function (cb) { return cb.checked; })
        .map(function (cb) { return trim(cb.value); })
        .join(', ');

      var subject = 'Quote request: ' + (data.areaType || 'General');
      var body = buildBody('Quote request from thechemicalfactory.com', [
        { label: 'Name', value: data.name },
        { label: 'Phone', value: data.phone },
        { label: 'Email', value: data.email },
        { label: 'City', value: data.city },
        { label: 'Area type', value: data.areaType },
        { label: 'System', value: data.system },
        { label: 'Estimated area', value: data.sqft },
        { label: 'Indicative range', value: data.price },
        { label: 'Observed symptoms', value: symptoms },
        { label: 'Project notes', value: data.notes, multiline: true }
      ]);

      /* TODO(owner): the estimator figures are indicative only. Once real
         per-system rates exist, replace the sqft*2.2 / sqft*3.8 maths in
         main.js#initEstimator and mention the rate basis in the email body. */

      var payload = {
        form: 'quote',
        name: data.name,
        phone: data.phone,
        email: data.email,
        subject: data.areaType || 'General',
        message: data.notes,
        city: data.city,
        areaType: data.areaType,
        system: data.system,
        sqft: data.sqft,
        price: data.price,
        symptoms: symptoms
      };
      var mailtoUrl = buildMailto(subject, body);

      var fv = $('#quote-form-view');
      var sv = $('#quote-success-view');
      var successName = $('#success-name');
      var successPhone = $('#success-phone');
      var successCity = $('#success-city');
      if (successName) successName.textContent = data.name;
      if (successPhone) successPhone.textContent = data.phone;
      if (successCity) successCity.textContent = data.city || 'your area';

      deliver(payload, mailtoUrl, function () {
        if (fv) fv.style.display = 'none';
        if (sv) sv.style.display = 'flex';
      });
    });
  }

  /* The modal is injected by components.js on DOMContentLoaded, which is after
     this file runs, so bind on DOMContentLoaded (idempotent via the guard). */
  function initAll() {
    initContactForm();
    if (!$('#quote-form')) {
      document.addEventListener('DOMContentLoaded', initQuoteForm, { once: true });
    } else {
      initQuoteForm();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  /* Small public surface for debugging / future pages. */
  window.TCFForms = {
    validateForm: validateForm,
    validateField: validateField,
    buildMailto: buildMailto,
    buildWhatsApp: buildWhatsApp,
    clean: trim,
    limits: MAX
  };
})();

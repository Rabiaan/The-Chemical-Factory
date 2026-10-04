/* Headless page auditor: loads every page in real Chrome, captures console
   errors/warnings, page errors, failed requests and CSP violations, then
   checks that nothing important is stuck hidden.

   Usage: node tools/audit-pages.js [baseUrl]
   Kept out of the shipped site; delete before deploying if unwanted.        */
const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE = process.argv[2] || 'http://localhost:8899';
const ROOT = path.resolve(__dirname, '..');

const PAGES = [
  'index.html', 'products.html', 'product-detail.html', 'projects.html',
  'datasheets.html', 'services.html', 'about.html', 'clients.html', 'contact.html',
  'privacy.html', 'terms.html', 'cookie.html'
];

// Product detail needs a real id to render its content, not the not-found state.
const EXTRA = [['product-detail.html?id=chem-pu-elasto', 'product-detail (valid id)']];

function chromeSafeArgs() {
  return ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'];
}

async function audit(browser, url, label, opts = {}) {
  const page = await browser.newPage();
  const problems = [];
  const notes = [];

  page.on('console', (msg) => {
    const t = msg.type();
    const text = msg.text();
    if (t === 'error' || t === 'warning') {
      // Google Fonts is genuinely external and allowed by CSP; note it separately.
      if (/fonts\.(googleapis|gstatic)\.com/.test(text)) { notes.push('font: ' + text); return; }
      if (/net::ERR_/.test(text) && /fonts\./.test(text)) { notes.push('font net: ' + text); return; }
      problems.push(`console.${t}: ${text}`);
    }
  });
  page.on('pageerror', (err) => problems.push('pageerror: ' + err.message));
  page.on('requestfailed', (req) => {
    const u = req.url();
    if (/fonts\.(googleapis|gstatic)\.com/.test(u)) { notes.push('font blocked: ' + u); return; }
    problems.push(`requestfailed: ${u} (${req.failure() && req.failure().errorText})`);
  });
  page.on('response', (res) => {
    const u = res.url();
    if (/fonts\.(googleapis|gstatic)\.com/.test(u)) return;
    if (res.status() >= 400) problems.push(`http ${res.status()}: ${u}`);
  });

  await page.setViewport({ width: 1440, height: 900 });
  if (opts.reducedMotion) {
    await page.emulateMediaFeatures([
      { name: 'prefers-reduced-motion', value: 'reduce' }
    ]);
  }

  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
  } catch (e) {
    problems.push('goto failed: ' + e.message);
  }

  // Let entrance animations settle. The preloader brush wipe alone runs ~4.3s,
  // so anything shorter reports legitimately-hidden hero elements as stuck.
  await new Promise(r => setTimeout(r, opts.reducedMotion ? 1500 : 6500));

  // Nothing critical should be invisible.
  const hidden = await page.evaluate(() => {
    const out = [];
    const sel = ['#navbar', '#site-footer', 'main', '.page-section', '.container'];
    sel.forEach(s => {
      document.querySelectorAll(s).forEach((el, i) => {
        const cs = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        // An element the page deliberately hides via the site's own .hidden class
        // (e.g. #detail-missing when the product id is valid) is correct, not stuck.
// A bare display:none with no .hidden marker is still reported, because that
        // would mean a real region failed to render.
        if (el.classList.contains('hidden')) return;
        if ((cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) < 0.02) && r.height === 0) {
          out.push(`${s}[${i}] hidden (display=${cs.display} vis=${cs.visibility} op=${cs.opacity})`);
        }
      });
    });
    // GSAP initial-hidden elements must have been resolved IF they are on screen.
    // Below-the-fold reveals are legitimately still transparent until scrolled.
    ['[data-hero]', '[data-reveal]'].forEach(s => {
      document.querySelectorAll(s).forEach((el, i) => {
        const cs = getComputedStyle(el);
        if (cs.display === 'none') return;
        const r = el.getBoundingClientRect();
        const inView = r.top < window.innerHeight && r.bottom > 0;
        if (inView && parseFloat(cs.opacity) < 0.02) {
          out.push(`${s}[${i}] in viewport but still transparent op=${cs.opacity}`);
        }
      });
    });
    return out;
  });

  const preloaderStuck = await page.evaluate(() => {
    const p = document.getElementById('preloader');
    if (!p) return null;
    const cs = getComputedStyle(p);
    return { cls: p.className, op: cs.opacity, disp: cs.display };
  });

  const counters = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.stat__value, .stat-tile__value'))
      .map(e => e.textContent.trim())
  );

  const formFields = await page.evaluate(() => {
    const res = { total: 0, missingLabel: [], missingName: [], missingMax: [] };
    document.querySelectorAll('input:not([type=hidden]), textarea, select').forEach(el => {
      if (el.closest('.hp-field')) return;
      if (el.type === 'checkbox' || el.type === 'radio' || el.type === 'range') return;
      res.total++;
      const id = el.id;
      const hasLabel = (id && document.querySelector(`label[for="${CSS.escape(id)}"]`)) || el.getAttribute('aria-label') || el.getAttribute('aria-labelledby');
      if (!hasLabel) res.missingLabel.push(id || el.name || el.outerHTML.slice(0, 60));
      if (!el.name && el.tagName !== 'SELECT') res.missingName.push(id || el.outerHTML.slice(0, 60));
      const needMax = ['text', 'email', 'tel', 'search', 'url'].includes(el.type) || el.tagName === 'TEXTAREA';
      if (needMax && !el.hasAttribute('maxlength')) res.missingMax.push(id || el.outerHTML.slice(0, 60));
    });
    return res;
  });

  await page.close();
  return { label, problems, notes, hidden, preloaderStuck, counters, formFields };
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: chromeSafeArgs()
  });

  const targets = PAGES.map(p => [p, p]).concat(EXTRA);
  let totalProblems = 0;

  console.log('='.repeat(78));
  console.log('NORMAL MOTION');
  console.log('='.repeat(78));
  for (const [pathName, label] of targets) {
    const r = await audit(browser, `${BASE}/${pathName}`, label);
    totalProblems += r.problems.length;
    const status = r.problems.length ? 'FAIL' : 'ok  ';
    console.log(`\n[${status}] ${r.label}`);
    r.problems.forEach(p => console.log('    ! ' + p));
    if (r.hidden.length) { console.log('    ! hidden elements:'); r.hidden.slice(0, 6).forEach(h => console.log('        ' + h)); }
    if (r.preloaderStuck) console.log('    preloader: ' + JSON.stringify(r.preloaderStuck));
    if (r.counters.length) console.log('    counters: ' + r.counters.join(' | '));
    if (r.formFields.total) {
      const f = r.formFields;
      if (f.missingLabel.length) console.log('    ! inputs missing label: ' + f.missingLabel.join(', '));
      if (f.missingName.length) console.log('    ! inputs missing name: ' + f.missingName.join(', '));
      if (f.missingMax.length) console.log('    ! inputs missing maxlength: ' + f.missingMax.join(', '));
    }
    if (r.notes.length && process.env.VERBOSE) r.notes.forEach(n => console.log('    . ' + n));
  }

  console.log('\n' + '='.repeat(78));
  console.log('REDUCED MOTION (prefers-reduced-motion: reduce)');
  console.log('='.repeat(78));
  for (const [pathName, label] of targets) {
    const r = await audit(browser, `${BASE}/${pathName}`, label, { reducedMotion: true });
    totalProblems += r.problems.length;
    const status = r.problems.length ? 'FAIL' : 'ok  ';
    console.log(`\n[${status}] ${r.label} (reduced)`);
    r.problems.forEach(p => console.log('    ! ' + p));
    if (r.hidden.length) { console.log('    ! STILL HIDDEN under reduced motion:'); r.hidden.slice(0, 8).forEach(h => console.log('        ' + h)); }
    if (r.preloaderStuck) console.log('    preloader: ' + JSON.stringify(r.preloaderStuck));
    if (r.counters.length) console.log('    counters: ' + r.counters.join(' | '));
  }

  await browser.close();
  console.log('\n' + '='.repeat(78));
  console.log(totalProblems === 0 ? 'NO CONSOLE ERRORS / CSP VIOLATIONS DETECTED' : `${totalProblems} PROBLEM(S) FOUND`);
  console.log('='.repeat(78));
  process.exit(totalProblems === 0 ? 0 : 1);
})();

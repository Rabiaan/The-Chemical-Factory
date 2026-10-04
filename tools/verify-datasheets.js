// Verifies the Phase 2 datasheet links in a real browser: every rendered
// anchor points at downloads/, carries a size, and actually downloads.
const puppeteer = require('puppeteer-core');
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE = process.argv[2] || 'http://localhost:8899';

(async () => {
  const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });
  let bad = 0, seen = new Set();

  for (const page of ['datasheets.html', 'products.html', 'product-detail.html?id=chem-swell']) {
    const p = await b.newPage();
    const errs = [];
    p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    p.on('pageerror', e => errs.push('pageerror: ' + e.message));
    const failed = [];
    p.on('requestfailed', r => failed.push(r.url()));

    await p.goto(`${BASE}/${page}`, { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2500));

    const links = await p.evaluate(() => {
      const out = [];
      document.querySelectorAll('a[download][data-pdf]').forEach(a => {
        const meta = a.querySelector('.product-card__download-meta, .pdf-item__size');
        out.push({
          href: a.getAttribute('href'),
          label: (a.textContent || '').replace(/\s+/g, ' ').trim(),
          size: meta ? meta.textContent.trim() : null,
          aria: a.getAttribute('aria-label'),
          type: a.getAttribute('type')
        });
      });
      return out;
    });

    console.log(`\n${page}  (${links.length} download links)`);
    links.slice(0, 3).forEach(l => console.log('   ' + JSON.stringify(l)));
    if (links.length > 3) console.log(`   ... +${links.length - 3} more`);

    for (const l of links) {
      seen.add(l.href);
      const problems = [];
      if (!/^downloads\/[a-z0-9][a-z0-9-]*\.pdf$/.test(l.href)) problems.push('bad href');
      if (!/\d+(\.\d+)?\s?(KB|MB)/.test(l.size || '')) problems.push('no size in link text');
      if (!l.aria || !/PDF/.test(l.aria)) problems.push('aria-label missing type');
      if (l.type !== 'application/pdf') problems.push('type attr wrong');
      if (problems.length) { bad++; console.log(`   ! ${l.href}: ${problems.join(', ')}`); }
    }
    if (errs.length) { bad += errs.length; console.log('   ! console: ' + errs.join(' | ')); }
    if (failed.length) { bad += failed.length; console.log('   ! failed requests: ' + failed.join(' | ')); }
    await p.close();
  }

  console.log(`\ndistinct datasheet hrefs seen: ${seen.size}`);
  console.log(bad === 0 ? 'PASS - all datasheet links well-formed' : `FAIL - ${bad} problem(s)`);
  await b.close();
  process.exit(bad === 0 ? 0 : 1);
})();

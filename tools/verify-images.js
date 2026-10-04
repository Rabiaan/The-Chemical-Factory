// Confirms images rendered by JS (product cards, datasheet cards, detail
// main image) carry the same loading hints as the static markup.
const puppeteer = require('puppeteer-core');
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE = process.argv[2] || 'http://localhost:8899';

const CHECK = `(sel) => [...document.querySelectorAll(sel)].map(i => ({
    src: (i.getAttribute('src')||'').split('/').pop(),
    w: i.getAttribute('width'), h: i.getAttribute('height'),
    loading: i.getAttribute('loading'), decoding: i.getAttribute('decoding'),
    alt: i.getAttribute('alt') }))`;

(async () => {
  const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });
  let bad = 0;

  // img-only selectors: .product-card__img is a wrapper div, not the element.
  const targets = [
    ['products.html', '.product-card img'],
    ['datasheets.html', '.ds-card__img'],
    ['product-detail.html?id=chem-joint-lock', '#detail-img']
  ];

  for (const [page, sel] of targets) {
    const p = await b.newPage();
    await p.setViewport({ width: 1440, height: 900 });
    const errs = [];
    p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    p.on('pageerror', e => errs.push('pageerror: ' + e.message));
    await p.goto(`${BASE}/${page}`, { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1800));

    const imgs = await p.evaluate(eval(CHECK), sel);
    const problems = [];
    imgs.forEach(i => {
      const miss = [];
      if (!i.w || !i.h) miss.push('width/height');
      if (i.loading !== 'lazy' && i.loading !== 'eager') miss.push('loading');
      if (i.decoding !== 'async') miss.push('decoding');
      if (i.alt === null || i.alt === 'Product image') miss.push('alt is generic');
      if (miss.length) { problems.push(`${i.src}: ${miss.join(',')}`); bad++; }
    });

    console.log(`  ${page.padEnd(38)} ${imgs.length} imgs  ${problems.length ? 'PROBLEMS' : 'ok'}`);
    if (imgs.length) console.log(`     e.g. ${JSON.stringify(imgs[0])}`);
    problems.slice(0, 3).forEach(x => console.log(`     ! ${x}`));
    if (errs.length) { bad += errs.length; console.log('     ! console: ' + errs.join(' | ')); }
    await p.close();
  }

  console.log(bad === 0 ? '\nPASS - JS-rendered images carry width/height/loading/decoding/descriptive alt'
                         : `\nFAIL - ${bad} issue(s)`);
  await b.close();
  process.exit(bad ? 1 : 0);
})();

const puppeteer = require('puppeteer-core');
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE = process.argv[2] || 'http://localhost:8899';
const PAGE = process.argv[3] || 'index.html';
const WAIT = parseInt(process.argv[4] || '6000', 10);

(async () => {
  const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });
  const p = await b.newPage();
  await p.setViewport({ width: 1440, height: 900 });
  await p.goto(`${BASE}/${PAGE}`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, WAIT));

  const info = await p.evaluate(() => {
    const out = [];
    document.querySelectorAll('[data-reveal]').forEach((el, i) => {
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      const inView = r.top < innerHeight && r.bottom > 0;
      if (!inView) return;
      out.push({
        i,
        cls: el.className.slice(0, 60),
        op: cs.opacity,
        transform: cs.transform,
        top: Math.round(r.top),
        h: Math.round(r.height),
        text: (el.textContent || '').trim().slice(0, 45)
      });
    });
    return {
      els: out,
      hasST: typeof ScrollTrigger !== 'undefined',
      stCount: typeof ScrollTrigger !== 'undefined' ? ScrollTrigger.getAll().length : 0,
      docH: document.documentElement.scrollHeight,
      htmlCls: document.documentElement.className,
      bodyOverflow: getComputedStyle(document.body).overflow,
      htmlOverflow: getComputedStyle(document.documentElement).overflow,
      preloaderActive: document.documentElement.classList.contains('preloader-active')
    };
  });
  console.log(JSON.stringify(info, null, 2));

  // Now scroll down and re-check
  await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
  await new Promise(r => setTimeout(r, 2500));
  const after = await p.evaluate(() => {
    let stuck = 0, total = 0;
    document.querySelectorAll('[data-reveal]').forEach(el => {
      total++;
      if (parseFloat(getComputedStyle(el).opacity) < 0.02) stuck++;
    });
    return { total, stuck, stCount: ScrollTrigger.getAll().length };
  });
  console.log('AFTER SCROLL:', JSON.stringify(after));
  await b.close();
})();

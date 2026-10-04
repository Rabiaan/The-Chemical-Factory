const puppeteer = require('puppeteer-core');
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE = process.argv[2] || 'http://localhost:8899';
const PAGE = process.argv[3] || 'index.html';

(async () => {
  const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });
  const p = await b.newPage();
  await p.setViewport({ width: 1440, height: 900 });
  await p.goto(`${BASE}/${PAGE}`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 6500));

  // Smooth incremental scroll through the whole page, like a human.
  const docH = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < docH; y += 400) {
    await p.evaluate(v => window.scrollTo(0, v), y);
    await new Promise(r => setTimeout(r, 120));
  }
  await new Promise(r => setTimeout(r, 2500));

  const stuck = await p.evaluate(() => {
    const out = [];
    document.querySelectorAll('[data-reveal], [data-hero]').forEach((el, i) => {
      const cs = getComputedStyle(el);
      if (parseFloat(cs.opacity) < 0.02 && cs.display !== 'none') {
        const r = el.getBoundingClientRect();
        out.push({
          i,
          tag: el.tagName,
          cls: (el.className || '').slice(0, 50),
          op: cs.opacity,
          docTop: Math.round(r.top + window.scrollY),
          h: Math.round(r.height),
          text: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 50)
        });
      }
    });
    return out;
  });
  console.log('STUCK AFTER FULL SCROLL (' + PAGE + '): ' + stuck.length);
  stuck.forEach(s => console.log('  ' + JSON.stringify(s)));
  await b.close();
})();

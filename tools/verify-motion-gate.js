// Phase 3.1 gate check.
// The whole point of the reduced-motion branch is that nothing stays
// invisible and no number stays stuck at zero. This asserts exactly that,
// under both settings, on every page.
const puppeteer = require('puppeteer-core');
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE = process.argv[2] || 'http://localhost:8899';
const PAGES = ['index.html', 'about.html', 'services.html', 'products.html',
  'product-detail.html?id=chem-swell', 'projects.html', 'datasheets.html',
  'contact.html', 'clients.html'];

(async () => {
  const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });
  let failures = 0;

  for (const reduced of [true, false]) {
    console.log(`\n${'='.repeat(64)}\nprefers-reduced-motion: ${reduced ? 'REDUCE' : 'no-preference'}\n${'='.repeat(64)}`);

    for (const page of PAGES) {
      const p = await b.newPage();
      await p.setViewport({ width: 1440, height: 900 });
      if (reduced) await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
      else await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);

      const errs = [];
      p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
      p.on('pageerror', e => errs.push('pageerror: ' + e.message));

      await p.goto(`${BASE}/${page}`, { waitUntil: 'networkidle2' });
      // Preloader is ~4.3s at most; reduced motion must be immediate.
      await new Promise(r => setTimeout(r, 2500));

      const t0 = Date.now();
      const res = await p.evaluate(() => {
        // Walk the page so every ScrollTrigger fires, like a real visitor.
        const h = document.documentElement.scrollHeight;
        window.scrollTo(0, h);
        return h;
      });
      for (let y = res; y >= 0; y -= 500) {
        await p.evaluate(v => window.scrollTo(0, v), y);
        await new Promise(r => setTimeout(r, 60));
      }
      await new Promise(r => setTimeout(r, 1200));
      await p.evaluate(() => window.scrollTo(0, 0));
      await new Promise(r => setTimeout(r, 400));

      const out = await p.evaluate(() => {
        const hidden = [];
        document.querySelectorAll('[data-reveal], [data-hero]').forEach((el, i) => {
          const cs = getComputedStyle(el);
          const r = el.getBoundingClientRect();
          if (cs.display === 'none' || r.height === 0) return;      // legitimately not rendered
          if (parseFloat(cs.opacity) < 0.05) {
            hidden.push(`[${el.tagName}.${(el.className || '').split(' ')[0]}] "${(el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 30)}" op=${cs.opacity}`);
          }
        });
        const stats = [...document.querySelectorAll('.stat__value')].map(e => e.textContent.trim());
        const zeroStats = [...document.querySelectorAll('.stat__value')]
          .filter(e => /^[\s0,.]*$/.test(e.textContent.replace(/[+%K+]/g, '').trim())).length;
        const pre = document.querySelector('#preloader');
        return {
          hidden,
          stats,
          zeroStats,
          preloaderGone: !pre || getComputedStyle(pre).display === 'none' || pre.classList.contains('is-done'),
          bodyScrollable: document.documentElement.scrollHeight > window.innerHeight,
          motionReduced: window.Motion ? Motion.prefersReduced() : null
        };
      });

      const problems = [];
      if (out.hidden.length) problems.push(`${out.hidden.length} invisible: ${out.hidden.slice(0, 3).join(' | ')}`);
      if (out.zeroStats) problems.push(`${out.zeroStats} stat counter(s) blank/zero`);
      if (!out.preloaderGone) problems.push('preloader never dismissed');
      if (out.motionReduced !== reduced) problems.push(`Motion.prefersReduced()=${out.motionReduced} but expected ${reduced}`);
      if (errs.length) problems.push(`console: ${errs.join(' | ')}`);

      if (problems.length) {
        failures++;
        console.log(`  FAIL ${page}`);
        problems.forEach(x => console.log(`       - ${x}`));
      } else {
        console.log(`  ok   ${page.padEnd(30)} stats=[${out.stats.join(', ')}]`);
      }
      await p.close();
    }
  }

  console.log(failures === 0 ? '\nPASS - gate behaves correctly in both modes' : `\nFAIL - ${failures} page/mode combination(s)`);
  await b.close();
  process.exit(failures ? 1 : 0);
})();

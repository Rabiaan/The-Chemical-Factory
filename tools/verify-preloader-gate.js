// Confirms the reduced-motion gate is a real optimisation, not just a
// cosmetic one: the preloader must be skipped, while full-motion pages
// must still have live tweens and ScrollTriggers running.
const puppeteer = require('puppeteer-core');
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const B = process.argv[2] || 'http://localhost:8899';

(async () => {
  const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });
  for (const red of [true, false]) {
    const p = await b.newPage();
    await p.setViewport({ width: 1440, height: 900 });
    await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: red ? 'reduce' : 'no-preference' }]);

    // Wait for networkidle2 FIRST: css/styles.css @imports Google Fonts, and
    // that stylesheet blocks DOMContentLoaded. Timing from goto() would
    // measure the font fetch, not the preloader.
    await p.goto(B + '/index.html', { waitUntil: 'networkidle2' });

    // Force the "first visit" path so the preloader actually plays.
    await p.evaluate(() => { try { sessionStorage.removeItem('cf-seen'); } catch (e) {} });

    const t0 = Date.now();
    await p.waitForFunction(() => {
      const e = document.querySelector('#preloader');
      return !e || e.classList.contains('is-done') || getComputedStyle(e).display === 'none';
    }, { timeout: 20000, polling: 100 });
    const ms = Date.now() - t0;

    await new Promise(r => setTimeout(r, 1200));
    const anim = await p.evaluate(() => ({
      tweens: typeof gsap !== 'undefined' ? gsap.globalTimeline.getChildren(true, true, false).length : -1,
      triggers: typeof ScrollTrigger !== 'undefined' ? ScrollTrigger.getAll().length : -1,
      transformed: [...document.querySelectorAll('[data-hero]')].filter(e => getComputedStyle(e).transform !== 'none').length
    }));

    const label = red ? 'REDUCE     ' : 'no-preference';
    console.log(`  ${label}: preloader dismissed after ${String(ms).padStart(5)}ms | tweens=${anim.tweens} scrollTriggers=${anim.triggers} transformedHeroes=${anim.transformed}`);
    await p.close();
  }
  await b.close();
})();

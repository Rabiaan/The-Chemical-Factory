const fs = require('fs');
const p = 'D:/Web-Projects/The Chemical Factory React/The Chemical Factory Html Backup/js/components.js';
let s = fs.readFileSync(p, 'utf8');
const start = s.indexOf('/* ---------- Preloader visibility');
if (start === -1) {
  console.log('not found');
  process.exit(1);
}
const end = s.indexOf('})();', start);
if (end === -1) {
  console.log('bad end');
  process.exit(1);
}
const newBlock = "  /* ---------- Preloader visibility ----------\n     Disabled: using the new fullscreen circular loader on home only. */\n  function shouldShowPreloader() {\n    return false;\n  }\n\n  /* Preloader injection disabled. */\n  var preloaderRoot = document.getElementById('preloader-root');\n  if (preloaderRoot) {\n    preloaderRoot.innerHTML = '';\n  }\n})();";
s = s.slice(0, start) + newBlock;
fs.writeFileSync(p, s);
console.log('ok');

import sys
from pathlib import Path

p = Path(r'D:\Web-Projects\The Chemical Factory React\The Chemical Factory Html Backup\js\components.js')
s = p.read_text(encoding='utf-8')
start = s.find('/* ---------- Preloader visibility')
if start == -1:
    print('not found')
    sys.exit(1)
end = s.find('})();', start)
if end == -1:
    print('bad')
    sys.exit(1)
new_block = '''  /* ---------- Preloader visibility ----------
     Disabled: using the new fullscreen circular loader on home only. */
  function shouldShowPreloader() {
    return false;
  }

  /* Preloader injection disabled. */
  var preloaderRoot = document.getElementById('preloader-root');
  if (preloaderRoot) {
    preloaderRoot.innerHTML = '';
  }
})();'''
s2 = s[:start] + new_block
p.write_text(s2, encoding='utf-8')
print('ok')

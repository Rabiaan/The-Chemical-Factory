"""Whole-tree asset check.

The browser audits only catch requests that actually fire, so a
loading="lazy" image pointing at a deleted file is invisible to them.
This resolves every asset reference in HTML, CSS and JS against disk.
"""
import glob
import io
import os
import re
import sys
from urllib.parse import unquote, urlparse

HTML = re.compile(r"""(?:src|href)\s*=\s*["']([^"']+)["']""", re.I)
CSS_URL = re.compile(r"""url\(\s*['"]?([^'")]+)['"]?\s*\)""", re.I)
JS_STR = re.compile(r"""['"]((?:images|products|css|js|fonts|downloads)/[^'"]+)['"]""")

EXTERNAL = re.compile(r"^(?:[a-z]+:)?//|^mailto:|^tel:|^javascript:|^data:", re.I)
ANCHOR = re.compile(r"^#")

missing = {}
checked = 0
IGNORED_COMMENT = re.compile(r"<!--.*?-->", re.S)


def note(ref, where):
    """Check one reference.

    Paths are resolved two ways because the codebase uses two conventions:
      - CSS writes '../fonts/x.ttf' (relative to the stylesheet)
      - JS writes 'images/x.jpg' (relative to the site root)
    """
    global checked
    if not ref or ANCHOR.match(ref) or EXTERNAL.match(ref):
        return
    path = unquote(urlparse(ref).path)
    if not path or path.endswith("/"):
        return
    checked += 1

    rel = path.replace("/", os.sep)
    here = os.path.dirname(where.replace("/", os.sep))
    candidates = [
        os.path.normpath(os.path.join(here, rel)),      # relative to the file
        os.path.normpath(rel),                          # relative to site root
    ]
    if not any(os.path.isfile(c) for c in candidates):
        missing.setdefault(ref, []).append(where)


def read(path):
    """Read a file with HTML comments removed when it is markup."""
    s = io.open(path, encoding="utf-8", errors="replace").read()
    if path.endswith((".html", ".htm")):
        # Comments hold usage examples (e.g. "drop logo files here") that are
        # not live references. Scanning them produced false 404s.
        s = IGNORED_COMMENT.sub(" ", s)
    return s


for page in sorted(glob.glob("*.html")):
    for m in HTML.finditer(read(page)):
        note(m.group(1).strip(), page)

for sheet in sorted(glob.glob("css/*.css")) + sorted(glob.glob("*.css")):
    for m in CSS_URL.finditer(read(sheet)):
        note(m.group(1).strip(), sheet)

for script in sorted(glob.glob("js/*.js")):
    for m in JS_STR.finditer(read(script)):
        note(m.group(1).strip(), script)

print("checked %d local asset references across html/css/js" % checked)
if not missing:
    print("PASS - every referenced file exists on disk")
    sys.exit(0)

print("\n%d BROKEN reference(s):\n" % len(missing))
for ref, where in sorted(missing.items()):
    print("  %s" % ref)
    for w in where:
        print("      referenced in %s" % w)
sys.exit(1)

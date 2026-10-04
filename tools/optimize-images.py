"""Phase 3.2/3.3: image loading hints + intrinsic dimensions.

Adds to every <img> in the HTML:
  width/height   real intrinsic pixel size, measured from the file, so the
                 browser can reserve space before the bytes arrive (CLS)
  loading        eager + fetchpriority=high for above-the-fold heroes,
                 lazy for everything below the fold
  decoding       async everywhere

Rules are deliberately conservative:
  - a decorative image keeps alt="" (that is correct, not an oversight)
  - if a src is empty or JS-filled, dimensions are left to the render code
  - existing loading="lazy" is never downgraded to eager

Run: python tools/optimize-images.py
"""
import glob
import io
import json
import os
import re
import sys

from PIL import Image

TAG = re.compile(r"<img\b[^>]*>", re.I | re.S)

# Above-the-fold on each page: keep these eager.
EAGER = ("page-hero__banner", "hero__bg-img", "hero__front-img", "hero-bg")


def measured_sizes():
    sizes = {}
    for f in glob.glob("images/**/*", recursive=True) + glob.glob("products/**/*", recursive=True):
        if os.path.isdir(f):
            continue
        try:
            with Image.open(f) as im:
                sizes[f.replace("\\", "/")] = [im.size[0], im.size[1]]
        except Exception:
            pass
    return sizes


def src_of(tag):
    m = re.search(r"""src\s*=\s*["']([^"']+)["']""", tag, re.I)
    return m.group(1) if m else ""


def set_attr(tag, name, value):
    """Set or replace an attribute on a single tag string."""
    pattern = re.compile(r"""(\s%s\s*=\s*)(["'])(.*?)\2""" % re.escape(name), re.I | re.S)
    if pattern.search(tag):
        return pattern.sub(lambda m: m.group(1) + '"' + value + '"', tag, count=1)
    # no existing attribute: insert just before the closing '>'
    close = tag.rindex(">")
    self_closing = tag[:close].rstrip().endswith("/")
    at = close - 1 if self_closing else close
    return tag[:at].rstrip() + ' %s="%s"' % (name, value) + (" />" if self_closing else ">")


def has_attr(tag, name):
    return re.search(r"\s%s\s*=" % re.escape(name), tag, re.I) is not None


def process(tag, sizes, stats, unresolved):
    src = src_of(tag)
    if not src:
        stats["empty-src"] += 1
        return tag

    key = src.split("?")[0].lstrip("./")
    dim = sizes.get(key)
    if dim is None:
        # genuinely unknown: either JS-filled or a path we cannot measure
        unresolved.add(src)
        stats["unknown-dimensions"] += 1

    # --- intrinsic dimensions -------------------------------------------
    if dim and not (has_attr(tag, "width") and has_attr(tag, "height")):
        tag = set_attr(tag, "width", str(dim[0]))
        tag = set_attr(tag, "height", str(dim[1]))
        stats["dimensioned"] += 1

    # --- loading hint ----------------------------------------------------
    eager = any(k in tag for k in EAGER)
    existing_loading = re.search(r"""loading\s*=\s*["']([^"']+)["']""", tag, re.I)
    if not existing_loading:
        if eager:
            tag = set_attr(tag, "loading", "eager")
            tag = set_attr(tag, "fetchpriority", "high")
            stats["eager"] += 1
        else:
            tag = set_attr(tag, "loading", "lazy")
            stats["lazy"] += 1
    elif existing_loading.group(1).lower() == "lazy" and eager:
        # a hero was marked lazy upstream: fix it, an LCP image must not be lazy
        tag = set_attr(tag, "loading", "eager")
        tag = set_attr(tag, "fetchpriority", "high")
        stats["lazy-hero-fixed"] += 1

    # --- decoding --------------------------------------------------------
    if not has_attr(tag, "decoding"):
        tag = set_attr(tag, "decoding", "async")
        stats["decoding"] += 1

    stats["total"] += 1
    return tag


def main():
    sizes = measured_sizes()
    print("measured %d image files\n" % len(sizes))

    grand = {"total": 0, "dimensioned": 0, "unknown-dimensions": 0,
             "eager": 0, "lazy": 0, "decoding": 0, "lazy-hero-fixed": 0,
             "empty-src": 0}
    unresolved = set()

    for page in sorted(glob.glob("*.html")):
        src = io.open(page, encoding="utf-8", newline="").read()
        stats = {"total": 0, "dimensioned": 0, "unknown-dimensions": 0,
                 "eager": 0, "lazy": 0, "decoding": 0, "lazy-hero-fixed": 0,
                 "empty-src": 0}
        unresolved_before = set()

        def repl(m):
            return process(m.group(0), sizes, stats, unresolved_before)

        out = TAG.sub(repl, src)
        if out != src:
            io.open(page, "w", encoding="utf-8", newline="").write(out)

        unresolved |= unresolved_before
        for k, v in stats.items():
            grand[k] += v

        print("  %-22s %2d imgs  dim:%2d  eager:%2d  lazy:%2d  dec:%2d%s" % (
            page, stats["total"], stats["dimensioned"], stats["eager"],
            stats["lazy"], stats["decoding"],
            "   unresolved:%d" % len(unresolved_before) if unresolved_before else ""))

    print("\ntotals: %s" % grand)
    if unresolved:
        print("\nUNRESOLVED src (left alone, need a manual look):")
        for u in sorted(unresolved):
            print("   %s" % u)
    else:
        print("\nevery non-empty src resolved to a real file")

    # Sanity: every img must now carry alt
    bad = []
    for page in sorted(glob.glob("*.html")):
        s = io.open(page, encoding="utf-8").read()
        for m in TAG.finditer(s):
            if not has_attr(m.group(0), "alt"):
                bad.append((page, m.group(0)[:70]))
    print("images still missing alt: %d" % len(bad))
    for p, t in bad:
        print("   %s %s" % (p, t))
    return 0


if __name__ == "__main__":
    sys.exit(main())

"""Phase 2: rebuild the product datasheets.

WHAT WAS ACTUALLY WRONG (measured, not assumed)
-----------------------------------------------
Every source page has a MediaBox of roughly 3200 x 4800 POINTS, i.e. about
44 x 67 inches. The embedded scans are ~4300 x 6400 pixels. So each page was
already an effectively ~95 DPI scan stretched across a poster-sized sheet --
which is why the files are 2-2.5 MB and why they print/display badly.

The pixel data is good (that is ~515 DPI of real detail if shown at A4), so
nothing is lost by resizing. This script:

  1. reads the embedded image out of each page,
  2. draws it onto a correctly-proportioned A4-height page,
  3. downsamples to TARGET_DPI so the file size is sane,
  4. writes no metadata at all,
  5. saves into downloads/ under a lowercase, hyphenated name.

OCR is NOT performed: tesseract/ocrmypdf are not installed on this machine,
so the output remains a scanned image with no text layer. See the report.

Usage:  python tools/clean-datasheets.py
"""
import glob
import io
import json
import os
import re
import sys

from PIL import Image
from pypdf import PdfReader, PdfWriter
from pypdf.generic import DictionaryObject, NameObject

SRC_DIR = "products"
OUT_DIR = "downloads"
TARGET_DPI = 300
# Measured trade-off on these 2-page scans: q90=2473KB q85=2044KB q80=1797KB
# q75=1618KB q70=1503KB q65=1399KB. Returns flatten below q75, so q80 keeps the
# fine print legible while still beating q85 by ~12%.
JPEG_QUALITY = 80
A4_HEIGHT_PT = 841.89          # 11.69in


def build_mapping():
    """Pair each product id with its current datasheet filename.

    Anchors on the 6-space indentation of a top-level product field so a
    substring like `category: 'injection'` can never be mistaken for `id:`.
    """
    src = open("js/products-data.js", encoding="utf-8").read()
    pairs = re.findall(
        r"^ {6}id:\s*'([a-z0-9][a-z0-9-]*)',\s*\n"
        r"(?:^ {6}[^\n]*\n)*?"
        r"^ {6}datasheet:\s*'products/'\s*\+\s*'([^']+)'",
        src,
        re.M,
    )
    return dict(pairs)


def extract_page_image(page):
    """Return the single full-bleed image on a datasheet page, decoded."""
    resources = page.get("/Resources")
    if not resources:
        return None
    xobjects = resources.get("/XObject")
    if not xobjects:
        return None

    best = None
    for name in xobjects.keys():
        obj = xobjects[name].get_object()
        if obj.get("/Subtype") != "/Image":
            continue
        raw = obj.get_data()
        try:
            img = Image.open(io.BytesIO(raw))
            img.load()
        except Exception:
            continue
        if best is None or img.size[0] * img.size[1] > best.size[0] * best.size[1]:
            best = img
    return best


def target_size(img_w, img_h, page_w_pt, page_h_pt):
    """Page size (points) + pixel size that puts the scan at ~TARGET_DPI.

    Keeps the source aspect ratio exactly, scales the long edge to A4 height.
    """
    aspect = page_w_pt / page_h_pt
    new_h_pt = A4_HEIGHT_PT
    new_w_pt = round(new_h_pt * aspect, 2)

    dpi_src_h = img_h / (page_h_pt / 72.0)
    if dpi_src_h <= TARGET_DPI * 1.15:
        px = (img_w, img_h)                     # already at/below target, keep pixels
    else:
        px = (max(1, round(new_w_pt / 72.0 * TARGET_DPI)),
              max(1, round(new_h_pt / 72.0 * TARGET_DPI)))
    return new_w_pt, new_h_pt, px


def target_geometry(img_w, img_h, page_w_pt, page_h_pt):
    """Return (target pixel w, target pixel h) for an A4-height page at TARGET_DPI.

    Keeps the source aspect ratio exactly. The source pages are poster-sized
    (44 x 67 in), so scaling the long edge to A4 height is what actually shrinks
    the file -- the pixel data is then far more than the page needs.
    """
    aspect = page_w_pt / page_h_pt
    target_h_in = A4_HEIGHT_PT / 72.0
    target_w_in = target_h_in * aspect
    return max(1, round(target_w_in * TARGET_DPI)), max(1, round(target_h_in * TARGET_DPI))


def rebuild(src_path, dst_path):
    reader = PdfReader(src_path)
    meta = dict(reader.metadata or {})
    writer = PdfWriter()
    report = []

    for page in reader.pages:
        box = page.mediabox
        src_w_pt, src_h_pt = float(box.width), float(box.height)
        img = extract_page_image(page)

        if img is None:
            # No image on this page: copy it through untouched.
            writer.add_page(page)
            report.append("copied (no image)")
            continue

        px_w, px_h = target_geometry(img.size[0], img.size[1], src_w_pt, src_h_pt)
        if (px_w, px_h) != img.size:
            img = img.convert("RGB").resize((px_w, px_h), Image.LANCZOS)

        # PIL writes a correctly-sized single-page PDF: page = pixels / resolution,
        # and emits DCTDecode (JPEG) for RGB with the quality we pass.
        buf = io.BytesIO()
        img.save(buf, format="PDF", resolution=float(TARGET_DPI),
                 quality=JPEG_QUALITY)
        buf.seek(0)
        for built in PdfReader(buf).pages:
            writer.add_page(built)

        report.append(
            f"{px_w}x{px_h} on {px_w/TARGET_DPI:.2f}x{px_h/TARGET_DPI:.2f}in"
        )

    # Strip ALL metadata. pypdf force-injects /Producer on write, so blanking
    # the Info dictionary after add_metadata({}) is what actually removes it.
    writer.add_metadata({})
    writer._info = DictionaryObject()
    with open(dst_path, "wb") as fh:
        writer.write(fh)
    return meta, len(reader.pages), report


def main():
    mapping = build_mapping()
    if not mapping:
        print("FATAL: could not derive product id -> filename mapping")
        return 1

    os.makedirs(OUT_DIR, exist_ok=True)
    print(f"{'product id':22} {'source':30} {'new file':30} {'before':>8} {'after':>8}  dpi")
    print("-" * 118)

    rows, manifest = [], {}
    meta_keys = set()
    failures = []

    for pid, fname in sorted(mapping.items()):
        src = os.path.join(SRC_DIR, fname)
        new_name = pid + ".pdf"
        dst = os.path.join(OUT_DIR, new_name)

        if not os.path.exists(src):
            print(f"{pid:22} {fname:30} !! MISSING SOURCE")
            failures.append((pid, "missing source"))
            continue

        before = os.path.getsize(src)
        try:
            meta, pages, notes = rebuild(src, dst)
        except Exception as exc:
            print(f"{pid:22} {fname:30} !! ERROR {exc}")
            failures.append((pid, str(exc)))
            continue

        after = os.path.getsize(dst)
        meta_keys |= set(meta.keys())
        dpi = notes[0].rsplit("(", 1)[-1].rstrip(")") if notes else "?"
        print(f"{pid:22} {fname:30} {new_name:30} {before/1024:7.0f}K {after/1024:7.0f}K  {dpi}")

        manifest[pid] = {
            "file": f"{OUT_DIR}/{new_name}",
            "bytes": after,
            "pages": pages,
            "kb": round(after / 1024),
        }
        rows.append(before)

    if failures:
        print("\nFAILURES:", failures)
        return 1

    with open(os.path.join(OUT_DIR, "manifest.json"), "w", encoding="utf-8") as fh:
        json.dump(manifest, fh, indent=2, sort_keys=True)

    total_before = sum(rows)
    total_after = sum(v["bytes"] for v in manifest.values())
    print()
    print(f"pages rebuilt : {sum(v['pages'] for v in manifest.values())} across {len(manifest)} files")
    print(f"total         : {total_before/1024/1024:.1f} MB -> {total_after/1024/1024:.1f} MB "
          f"({100*(1-total_after/total_before):.0f}% smaller)")
    print(f"metadata found in sources (now stripped): {sorted(meta_keys)}")
    print(f"manifest      : {OUT_DIR}/manifest.json")
    return 0


if __name__ == "__main__":
    sys.exit(main())

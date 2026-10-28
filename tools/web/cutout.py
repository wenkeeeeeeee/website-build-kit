"""Clean cut-outs for websites.

  python cutout.py shadow <in.png> <out.webp> [--max 320] [--sat .12] [--light 150]
      Remove the pale grey studio shadow under a transparent cut-out (it shows as a halo on coloured
      backgrounds), crop to content, shrink to --max px. Works on saturated food (nuts, saffron, pomegranate).
      Check the result on a coloured background: pale or grey subjects (figs, glass, white flesh) lose
      pixels; for those pick another image instead of tuning thresholds.
  python cutout.py logo <in.jpg> <out.png>
      Dark logo on a light background -> white logo on transparent (use as a CSS mask and fill with any colour).
  python cutout.py sheet <out.jpg> <img> [<img> ...] [--bg 2f5d3a]
      Contact sheet on a coloured background, to review cut-outs quickly.
"""
import argparse
import numpy as np
from PIL import Image


def shadow(src, dst, size, sat_max, light):
    im = np.asarray(Image.open(src).convert('RGBA')).astype(np.float32)
    rgb, al = im[..., :3], im[..., 3]
    mx = rgb.max(-1)
    sat = (mx - rgb.min(-1)) / np.maximum(mx, 1)
    al = np.where((sat < sat_max) & (mx > light), 0, al)   # pale, grey = shadow
    al = np.where(al < 40, 0, al)                           # soft fringe
    img = Image.fromarray(np.dstack([rgb, al]).astype(np.uint8))
    img = img.crop(img.getbbox())
    img.thumbnail((size, size), Image.LANCZOS)
    img.save(dst, 'WEBP', quality=88, method=6) if dst.lower().endswith('.webp') else img.save(dst)
    print(dst, img.size)


def logo(src, dst):
    lum = np.asarray(Image.open(src).convert('L'), dtype=np.float32)
    bg, ink = np.percentile(lum, 90), np.percentile(lum, 3)
    a = np.clip((bg - lum) / max(bg - ink, 1), 0, 1) ** 0.9
    out = np.zeros(lum.shape + (4,), np.uint8)
    out[..., :3] = 255
    out[..., 3] = (a * 255).astype(np.uint8)
    Image.fromarray(out).save(dst, optimize=True)
    print(dst, out.shape[1::-1])


def sheet(dst, files, bg):
    tile = 220
    cols = min(5, len(files))
    s = Image.new('RGB', (tile * cols, tile * ((len(files) + cols - 1) // cols)), '#' + bg)
    for i, f in enumerate(files):
        im = Image.open(f).convert('RGBA')
        im.thumbnail((tile - 16, tile - 16))
        s.paste(im, ((i % cols) * tile + 8, (i // cols) * tile + 8), im)
    s.save(dst, quality=88)
    print(dst)


if __name__ == '__main__':
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('cmd', choices=['shadow', 'logo', 'sheet'])
    ap.add_argument('paths', nargs='+')
    ap.add_argument('--max', type=int, default=320)
    ap.add_argument('--sat', type=float, default=.12)
    ap.add_argument('--light', type=float, default=150)
    ap.add_argument('--bg', default='2f5d3a')
    a = ap.parse_args()
    if a.cmd == 'shadow':
        shadow(a.paths[0], a.paths[1], a.max, a.sat, a.light)
    elif a.cmd == 'logo':
        logo(a.paths[0], a.paths[1])
    else:
        sheet(a.paths[0], a.paths[1:], a.bg)

#!/usr/bin/env python3
"""Cut an effect sprite generated on a flat green (#00ff00) background (DECISIONS #79).

usage: cut-green.py <src.jpg> <out.png> <size_px>
       cut-green.py <src.jpg> <out.png> <W>x<H>   (a frame: the whole image keyed and resized to WxH, no crop; DECISIONS #85)
Keys out green (soft edge), removes green spill from the outline, crops to the shape and fits it in a
transparent square of <size_px>. Unlike cut-sprite.py it also clears green that is enclosed (the gaps
between a skull and its crossbones).
"""
import sys
from PIL import Image

src, out, size_arg = sys.argv[1], sys.argv[2], sys.argv[3]
frame = 'x' in size_arg
im = Image.open(src).convert('RGB')
w, h = im.size
px = im.load()
rgba = Image.new('RGBA', (w, h))
po = rgba.load()
for y in range(h):
    for x in range(w):
        r, g, b = px[x, y]
        excess = g - max(r, b)          # how green this pixel is beyond its other channels
        a = 255 if excess < 40 else 0 if excess > 110 else int(255 * (110 - excess) / 70)
        if a < 255: g = min(g, max(r, b))  # despill: an edge pixel keeps no green cast
        po[x, y] = (r, g, b, a)
if frame:
    fw, fh = (int(v) for v in size_arg.split('x'))
    rgba.resize((fw, fh), Image.LANCZOS).save(out)
    print(out, (fw, fh), 'frame')
    sys.exit(0)
size = int(size_arg)
box = rgba.getbbox()
cut = rgba.crop(box)
s = (size - 4) / max(cut.size)
cut = cut.resize((max(1, round(cut.size[0] * s)), max(1, round(cut.size[1] * s))), Image.LANCZOS)
canvas = Image.new('RGBA', (size, size), (0, 0, 0, 0))
canvas.paste(cut, ((size - cut.size[0]) // 2, (size - cut.size[1]) // 2), cut)
canvas.save(out)
print(out, canvas.size, 'from', box)

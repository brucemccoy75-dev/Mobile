#!/usr/bin/env python3
"""Cut a generated character image (plain background) into a battle sprite.

usage: cut-sprite.py <src.jpg> <out_dir> <name> <height_px> [canvas_px]
Writes <out_dir>/<name>.png (1x) and <name>@2x.png. See docs/ART.md section 0.
"""
import sys
from collections import deque
from PIL import Image, ImageFilter

src, out_dir, name, height = sys.argv[1], sys.argv[2], sys.argv[3], int(sys.argv[4])
canvas = int(sys.argv[5]) if len(sys.argv) > 5 else height + 16
TOL = 60

im = Image.open(src).convert('RGB')
w, h = im.size
px = im.load()
corners = [px[0, 0], px[w - 1, 0], px[0, h - 1], px[w - 1, h - 1]]
bg = tuple(sorted(c[i] for c in corners)[1] for i in range(3))

def is_bg(p):
    return abs(p[0] - bg[0]) + abs(p[1] - bg[1]) + abs(p[2] - bg[2]) <= TOL

# flood fill background from the border so enclosed light areas (eyes, tusks) survive
mask = Image.new('L', (w, h), 255)
mp = mask.load()
seen = bytearray(w * h)
q = deque()
for x in range(w):
    q.append((x, 0)); q.append((x, h - 1))
for y in range(h):
    q.append((0, y)); q.append((w - 1, y))
while q:
    x, y = q.popleft()
    i = y * w + x
    if seen[i] or not is_bg(px[x, y]):
        continue
    seen[i] = 1
    mp[x, y] = 0
    if x > 0: q.append((x - 1, y))
    if x < w - 1: q.append((x + 1, y))
    if y > 0: q.append((x, y - 1))
    if y < h - 1: q.append((x, y + 1))

mask = mask.filter(ImageFilter.MinFilter(3))  # erode the halo
rgba = im.convert('RGBA'); rgba.putalpha(mask)
box = mask.getbbox(); fig = rgba.crop(box)
print(f'{src} -> {out_dir} figure {fig.size}')
for scale, suffix in ((1, ''), (2, '@2x')):
    th = height * scale
    tw = round(fig.width * th / fig.height)
    f = fig.resize((tw, th), Image.LANCZOS)
    cw = max(canvas * scale, tw); ch = canvas * scale
    out = Image.new('RGBA', (cw, ch), (0, 0, 0, 0))
    out.paste(f, ((cw - tw) // 2, ch - th), f)
    out.save(f'{out_dir}/{name}{suffix}.png')
    print(f'  {name}{suffix}.png {out.size}')

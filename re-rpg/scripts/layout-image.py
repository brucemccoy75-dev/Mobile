#!/usr/bin/env python3
"""Flat layout reference of an authored screen (DECISIONS #38): terrain colours plus node dots, at the
in-game size (72 px per tile). Feed it to image-to-image generation so the painted map keeps our roads,
lakes and clearings where the code expects them. Usage: layout-image.py <screen1|screen2> <out.png> [--snow]
(--soft blurs terrain and rounds roads; --snow paints snow, snowy pines and ice, for the tundra screen.)"""
import sys, re
from PIL import Image, ImageDraw
src = open(f'src/data/maps/{sys.argv[1]}.ts').read()
rows = [r for r in re.search(r'`\n([\s\S]*?)\n`', src).group(1).split('\n') if r]
T = 72
COL = {'.': (86, 150, 70), '#': (34, 90, 44), '=': (205, 180, 120), '~': (58, 120, 170), '^': (110, 112, 120), '%': (92, 110, 70), 'A': (190, 160, 110)}
if '--snow' in sys.argv:
    COL.update({'.': (226, 236, 244), '#': (40, 84, 76), '=': (150, 128, 104), '~': (150, 200, 232), '^': (120, 132, 150), 'A': (176, 196, 214)})
NODE = set('EoxqnBfucsh')
W, H = len(rows[0]) * T, len(rows) * T
im = Image.new('RGB', (W, H)); d = ImageDraw.Draw(im)
for y, r in enumerate(rows):
    for x, ch in enumerate(r):
        c = COL['='] if ch in NODE and ch != 'B' else COL['A'] if ch == 'B' else COL[ch]
        d.rectangle([x * T, y * T, (x + 1) * T - 1, (y + 1) * T - 1], fill=c)
for y, r in enumerate(rows):
    for x, ch in enumerate(r):
        if ch in NODE:
            cx, cy = x * T + T // 2, y * T + T // 2
            d.ellipse([cx - 26, cy - 26, cx + 26, cy + 26], fill=(240, 220, 120), outline=(60, 40, 10), width=4)
if '--soft' in sys.argv:
    # A softer reference: blurred terrain, rounded roads, small dots, so the painting is not boxy.
    from PIL import ImageFilter
    base = Image.new('RGB', (W, H)); bd = ImageDraw.Draw(base)
    for y, r in enumerate(rows):
        for x, ch in enumerate(r):
            c = COL['.'] if ch in NODE or ch == '=' else COL['A'] if ch == 'B' else COL[ch]
            bd.rectangle([x * T, y * T, (x + 1) * T - 1, (y + 1) * T - 1], fill=c)
    im = base.filter(ImageFilter.GaussianBlur(T * 0.45)); d = ImageDraw.Draw(im)
    road = lambda x, y: 0 <= y < len(rows) and 0 <= x < len(rows[y]) and (rows[y][x] == '=' or rows[y][x] in NODE)
    for y, r in enumerate(rows):
        for x, ch in enumerate(r):
            if not road(x, y): continue
            cx, cy = x * T + T // 2, y * T + T // 2
            d.ellipse([cx - 20, cy - 20, cx + 20, cy + 20], fill=COL['='])
            for dx, dy in ((1, 0), (0, 1)):
                if road(x + dx, y + dy): d.line([cx, cy, cx + dx * T, cy + dy * T], fill=COL['='], width=40)
    for y, r in enumerate(rows):
        for x, ch in enumerate(r):
            if ch in NODE:
                cx, cy = x * T + T // 2, y * T + T // 2
                d.ellipse([cx - 16, cy - 16, cx + 16, cy + 16], fill=(240, 220, 120), outline=(60, 40, 10), width=3)
im.save(sys.argv[2])
print(sys.argv[2], im.size)

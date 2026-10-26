#!/usr/bin/env python3
"""Flat layout reference of an authored screen (DECISIONS #38): terrain colours plus node dots, at the
in-game size (72 px per tile). Feed it to image-to-image generation so the painted map keeps our roads,
lakes and clearings where the code expects them. Usage: layout-image.py <screen1|screen2> <out.png>"""
import sys, re
from PIL import Image, ImageDraw
src = open(f'src/data/maps/{sys.argv[1]}.ts').read()
rows = [r for r in re.search(r'`\n([\s\S]*?)\n`', src).group(1).split('\n') if r]
T = 72
COL = {'.': (86, 150, 70), '#': (34, 90, 44), '=': (205, 180, 120), '~': (58, 120, 170), '^': (110, 112, 120), '%': (92, 110, 70), 'A': (190, 160, 110)}
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
im.save(sys.argv[2])
print(sys.argv[2], im.size)

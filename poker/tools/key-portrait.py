#!/usr/bin/env python3
"""Keys the flat #00b140 green out of a generated portrait and writes a 1024x1024 RGBA PNG.

    python3 tools/key-portrait.py IMG_2551.jpeg public/portraits/sal.png

Only green that touches the image border is removed, so green inside the subject survives. The green
spill is pulled off edge pixels so hair does not glow against the felt.
"""
import sys
from collections import deque

import numpy as np
from PIL import Image, ImageFilter


def key(src: str, dst: str, size: int = 1024) -> None:
    im = Image.open(src).convert('RGB')
    a = np.asarray(im).astype(int)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    green = (g > 120) & (g - r > 60) & (g - b > 60)

    h, w = green.shape
    seen = np.zeros_like(green, dtype=bool)
    q: deque = deque()
    for x in range(w):
        for y in (0, h - 1):
            if green[y, x] and not seen[y, x]:
                seen[y, x] = True
                q.append((y, x))
    for y in range(h):
        for x in (0, w - 1):
            if green[y, x] and not seen[y, x]:
                seen[y, x] = True
                q.append((y, x))
    while q:
        y, x = q.popleft()
        for ny, nx in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
            if 0 <= ny < h and 0 <= nx < w and green[ny, nx] and not seen[ny, nx]:
                seen[ny, nx] = True
                q.append((ny, nx))

    alpha = Image.fromarray(np.where(seen, 0, 255).astype(np.uint8))
    alpha = alpha.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1.0))

    rgb = a.copy()
    spill = np.clip(g - np.maximum(r, b), 0, None)
    rgb[..., 1] = g - (spill * 0.6).astype(int)
    out = Image.fromarray(rgb.clip(0, 255).astype(np.uint8)).convert('RGBA')
    out.putalpha(alpha)
    out.resize((size, size), Image.LANCZOS).save(dst, optimize=True)
    print(f'{dst}: {round(float((np.asarray(alpha) < 128).mean()) * 100)}% background removed')


if __name__ == '__main__':
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    key(sys.argv[1], sys.argv[2])

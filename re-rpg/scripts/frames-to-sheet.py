#!/usr/bin/env python3
"""Turn separate generated frames (plain background) into a Phaser spritesheet (docs/ART.md).

usage: frames-to-sheet.py <name> <anim> <char_height_px> <fps> <frame>... [--start N]

Each source is brought to the same canvas height (they are renders of the same character at the
same relative size), then background-keyed (flood fill from the border, tolerance 60 against the median of its
corners), all frames share one scale (the tallest figure becomes <char_height_px>, at 2x), and
every figure stands on the same baseline, centred on its upper body so a swinging leg does not
shift it. Writes public/art/c/<name>_<anim>@2x.png and records it in src/data/anims.json;
`--start` makes the animation begin at that frame (frame 0 can be a standing pose).
"""
import json, os, sys
from collections import deque
from PIL import Image, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TOL = 60
args = sys.argv[1:]
start = 0
if '--start' in args:
    i = args.index('--start'); start = int(args[i + 1]); del args[i:i + 2]
name, anim, char_h, fps, files = args[0], args[1], int(args[2]), int(args[3]), args[4:]


CANVAS_H = 1248  # every source is brought to this height first: the same character fills the same share of each canvas


def cut(path: str) -> Image.Image:
    im = Image.open(path).convert('RGB')
    if im.height != CANVAS_H: im = im.resize((round(im.width * CANVAS_H / im.height), CANVAS_H), Image.LANCZOS)
    w, h = im.size; px = im.load()
    corners = [px[0, 0], px[w - 1, 0], px[0, h - 1], px[w - 1, h - 1]]
    bg = tuple(sorted(c[i] for c in corners)[1] for i in range(3))
    near = lambda c: sum(abs(c[i] - bg[i]) for i in range(3)) <= TOL
    mask = Image.new('L', (w, h), 255); mp = mask.load(); seen = bytearray(w * h); q = deque()
    for x in range(w): q.extend([(x, 0), (x, h - 1)])
    for y in range(h): q.extend([(0, y), (w - 1, y)])
    while q:
        x, y = q.popleft(); i = y * w + x
        if seen[i] or not near(px[x, y]): continue
        seen[i] = 1; mp[x, y] = 0
        if x > 0: q.append((x - 1, y))
        if x < w - 1: q.append((x + 1, y))
        if y > 0: q.append((x, y - 1))
        if y < h - 1: q.append((x, y + 1))
    mask = mask.filter(ImageFilter.MinFilter(3))  # eat the anti-aliased halo
    out = im.convert('RGBA'); out.putalpha(mask)
    return out.crop(mask.getbbox())


figs = [cut(f) for f in files]
scale = char_h / max(f.height for f in figs)
figs = [f.resize((max(1, round(f.width * scale)), max(1, round(f.height * scale))), Image.LANCZOS) for f in figs]


def body_centre(f: Image.Image) -> float:
    # The upper 60% (head, torso, shield) holds still while the legs swing.
    top = f.crop((0, 0, f.width, int(f.height * 0.6)))
    bb = top.getchannel('A').getbbox() or (0, 0, f.width, 0)
    return (bb[0] + bb[2]) / 2


pad = 8
fw = max(int(2 * max(max(body_centre(f), f.width - body_centre(f)) for f in figs)) + 2 * pad, 1)
fh = char_h + 2 * pad
sheet = Image.new('RGBA', (fw * len(figs), fh), (0, 0, 0, 0))
for i, f in enumerate(figs):
    sheet.alpha_composite(f, (i * fw + round(fw / 2 - body_centre(f)), fh - pad - f.height))
out = os.path.join(ROOT, 'public', 'art', 'c', f'{name}_{anim}@2x.png')
sheet.save(out)
manifest_path = os.path.join(ROOT, 'src', 'data', 'anims.json')
manifest = json.load(open(manifest_path)) if os.path.exists(manifest_path) else {}
manifest[f'{name}_{anim}'] = {'file': f'art/c/{name}_{anim}@2x.png', 'frameWidth': fw, 'frameHeight': fh, 'frames': len(figs), 'fps': fps, 'loop': True, 'start': start, 'height': char_h}
json.dump(manifest, open(manifest_path, 'w'), indent=2)
print(f'{out} {sheet.size} frame {fw}x{fh} x{len(figs)} (anim from frame {start})')

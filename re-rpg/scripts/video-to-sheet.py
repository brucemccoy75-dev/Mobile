#!/usr/bin/env python3
"""Turn a generated character video (plain background, locked camera) into a Phaser spritesheet.

usage: video-to-sheet.py <video> <name> <anim> <height_px> [--fps 10] [--once] [--min 0.8] [--max 2.5]

Steps: ffmpeg extracts frames at --fps; each frame is background-keyed (border flood fill),
anchored on the feet of its largest blob so camera drift disappears, and scaled so the median
figure height is <height_px> (at 2x). A loop window is chosen where two frames ~1-2.5 s apart
look most alike (--once keeps the whole clip instead, for deaths). Writes
public/art/c/<name>_<anim>@2x.png and records frame size, count and fps in src/data/anims.json.
"""
import argparse, json, os, subprocess, sys, tempfile
from collections import deque
from PIL import Image, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'public', 'art', 'c')
MANIFEST = os.path.join(ROOT, 'src', 'data', 'anims.json')
TOL = 60

ap = argparse.ArgumentParser()
ap.add_argument('video'); ap.add_argument('name'); ap.add_argument('anim'); ap.add_argument('height', type=int)
ap.add_argument('--fps', type=int, default=10); ap.add_argument('--once', action='store_true')
ap.add_argument('--min', type=float, default=0.8); ap.add_argument('--max', type=float, default=2.5)
ap.add_argument('--cols', type=int, default=4)
args = ap.parse_args()

tmp = tempfile.mkdtemp(prefix='v2s-')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', args.video, '-vf', f'fps={args.fps}', os.path.join(tmp, 'f%04d.png')], check=True)
files = sorted(f for f in os.listdir(tmp) if f.endswith('.png'))
print(f'{len(files)} frames at {args.fps} fps')

def key_frame(im):
    im = im.convert('RGB'); w, h = im.size; px = im.load()
    corners = [px[0, 0], px[w - 1, 0], px[0, h - 1], px[w - 1, h - 1]]
    bg = tuple(sorted(c[i] for c in corners)[1] for i in range(3))
    is_bg = lambda p: abs(p[0] - bg[0]) + abs(p[1] - bg[1]) + abs(p[2] - bg[2]) <= TOL
    mask = Image.new('L', (w, h), 255); mp = mask.load(); seen = bytearray(w * h); q = deque()
    for x in range(w): q.append((x, 0)); q.append((x, h - 1))
    for y in range(h): q.append((0, y)); q.append((w - 1, y))
    while q:
        x, y = q.popleft(); i = y * w + x
        if seen[i] or not is_bg(px[x, y]): continue
        seen[i] = 1; mp[x, y] = 0
        if x > 0: q.append((x - 1, y))
        if x < w - 1: q.append((x + 1, y))
        if y > 0: q.append((x, y - 1))
        if y < h - 1: q.append((x, y + 1))
    mask = mask.filter(ImageFilter.MinFilter(3))
    rgba = im.convert('RGBA'); rgba.putalpha(mask)
    return rgba, mask

def largest_blob_bbox(mask):
    """bbox of the biggest opaque component (the body, not snort puffs)."""
    w, h = mask.size; mp = mask.load(); seen = bytearray(w * h); best = None
    for y0 in range(0, h, 2):
        for x0 in range(0, w, 2):
            if mp[x0, y0] == 0 or seen[y0 * w + x0]: continue
            q = deque([(x0, y0)]); seen[y0 * w + x0] = 1; n = 0; x1 = x2 = x0; y1 = y2 = y0
            while q:
                x, y = q.popleft(); n += 1
                x1 = min(x1, x); x2 = max(x2, x); y1 = min(y1, y); y2 = max(y2, y)
                for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
                    if 0 <= nx < w and 0 <= ny < h and mp[nx, ny] and not seen[ny * w + nx]:
                        seen[ny * w + nx] = 1; q.append((nx, ny))
            if best is None or n > best[0]: best = (n, (x1, y1, x2 + 1, y2 + 1))
    return best[1]

frames = []
for f in files:
    rgba, mask = key_frame(Image.open(os.path.join(tmp, f)))
    body = largest_blob_bbox(mask)
    frames.append((rgba, body))

heights = sorted(b[3] - b[1] for _, b in frames)
med_h = heights[len(heights) // 2]
scale = args.height / med_h
print(f'median body height {med_h}px -> scale {scale:.3f}')

# canvas: wide enough for every frame once anchored on the body's bottom-centre
left = right = top = 0
for rgba, (x1, y1, x2, y2) in frames:
    cx = (x1 + x2) / 2; full = rgba.getbbox() or (x1, y1, x2, y2)
    left = max(left, (cx - full[0]) * scale); right = max(right, (full[2] - cx) * scale); top = max(top, (y2 - full[1]) * scale)
pad = 4
FW = int(left + right) + 2 * pad; FH = int(top) + 2 * pad
anchor_x = int(left) + pad; anchor_y = FH - pad
cells = []
for rgba, (x1, y1, x2, y2) in frames:
    im = rgba.resize((round(rgba.width * scale), round(rgba.height * scale)), Image.LANCZOS)
    cx = (x1 + x2) / 2 * scale; by = y2 * scale
    cell = Image.new('RGBA', (FW, FH), (0, 0, 0, 0))
    cell.paste(im, (round(anchor_x - cx), round(anchor_y - by)), im)
    cells.append(cell)

def diff(a, b):
    sa = a.resize((48, 48), Image.BILINEAR); sb = b.resize((48, 48), Image.BILINEAR)
    pa = sa.load(); pb = sb.load(); d = 0
    for y in range(48):
        for x in range(48):
            d += sum(abs(pa[x, y][i] - pb[x, y][i]) for i in range(4))
    return d

if args.once:
    chosen = cells
else:
    best = None
    lo, hi = max(2, int(args.min * args.fps)), int(args.max * args.fps)
    for i in range(len(cells)):
        for j in range(i + lo, min(len(cells), i + hi + 1)):
            d = diff(cells[i], cells[j]) / (1 + 0.02 * (j - i))  # mild preference for longer loops
            if best is None or d < best[0]: best = (d, i, j)
    _, i, j = best
    chosen = cells[i:j]
    print(f'loop frames {i}..{j - 1} ({len(chosen)} frames, {len(chosen) / args.fps:.1f}s)')

cols = min(args.cols, len(chosen)); rows = (len(chosen) + cols - 1) // cols
sheet = Image.new('RGBA', (cols * FW, rows * FH), (0, 0, 0, 0))
for k, c in enumerate(chosen): sheet.paste(c, ((k % cols) * FW, (k // cols) * FH))
out = os.path.join(OUT, f'{args.name}_{args.anim}@2x.png')
sheet.save(out, optimize=True)
manifest = json.load(open(MANIFEST)) if os.path.exists(MANIFEST) else {}
manifest[f'{args.name}_{args.anim}'] = {'file': f'art/c/{args.name}_{args.anim}@2x.png', 'frameWidth': FW, 'frameHeight': FH, 'frames': len(chosen), 'fps': args.fps, 'loop': not args.once}
json.dump(manifest, open(MANIFEST, 'w'), indent=2)
print(f'{out} {sheet.size} frame {FW}x{FH} x{len(chosen)}; manifest {MANIFEST}')

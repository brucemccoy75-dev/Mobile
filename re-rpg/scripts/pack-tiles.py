#!/usr/bin/env python3
"""Pack the CraftPix top-down vector freebies into the game's ground tileset + prop atlas.

Inputs (gitignored, see docs/ART.md): art-src/packs/summer/PNG, art-src/packs/swamp/PNG
Outputs: public/art/c/ground.png (96 px cells, 8 columns: summer 1-56, swamp 1-56, water)
         public/art/c/props.png + props.json (Phaser JSON-hash atlas)
Everything is packed at 2x game size (game TILE = 48, ground cells are 96) and displayed at 0.5.
"""
import glob, json, os, sys
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PACKS = os.path.join(ROOT, 'art-src', 'packs')
OUT = os.path.join(ROOT, 'public', 'art', 'c')
CELL = 96
F = CELL / 256  # 0.375: pack scale for 256 px source tiles

def ground_files(pack):
    files = sorted(glob.glob(os.path.join(PACKS, pack, 'PNG', '*Ground*.png')), key=lambda f: int(f.split()[-1][:-4]))
    assert len(files) == 56, (pack, len(files))
    return files

# swamp pack's dark "outside" terrain -> summer grass, so swamp blobs sit seamlessly on the summer ground
RECOLOR = {(100, 136, 59): (110, 168, 67), (143, 171, 57): (155, 191, 59)}

def recolor(im):
    im = im.convert('RGBA')
    px = im.load()
    for y in range(im.height):
        for x in range(im.width):
            r, g, b, a = px[x, y]
            m = RECOLOR.get((r, g, b))
            if m: px[x, y] = (m[0], m[1], m[2], a)
    return im

def water_tile():
    t = Image.new('RGBA', (256, 256), (63, 127, 181, 255))
    d = ImageDraw.Draw(t)
    for (x, y, w) in ((40, 70, 90), (150, 150, 70), (90, 200, 60), (190, 40, 50)):
        d.rounded_rectangle((x, y, x + w, y + 14), radius=7, fill=(95, 159, 208, 255))
    return t

def pack_ground():
    tiles = [Image.open(f).convert('RGBA') for f in ground_files('summer')]
    tiles += [recolor(Image.open(f)) for f in ground_files('swamp')]
    tiles.append(water_tile())
    cols = 8
    rows = (len(tiles) + cols - 1) // cols
    sheet = Image.new('RGBA', (cols * CELL, rows * CELL), (0, 0, 0, 0))
    for i, t in enumerate(tiles):
        t = t.resize((CELL, CELL), Image.LANCZOS)
        sheet.paste(t, ((i % cols) * CELL, (i // cols) * CELL))
    sheet.save(os.path.join(OUT, 'ground.png'), optimize=True)
    print('ground.png', sheet.size, len(tiles), 'tiles')

# (frame name, pack, source basename, scale factor relative to F)
PROPS = [
    ('tree_small', 'summer', 'Prop - Tree Small', 1), ('tree_medium', 'summer', 'Prop - Tree Medium', 1), ('tree_large', 'summer', 'prop - Tree Large', 1),
    ('bush_small', 'summer', 'Prop - Bushes Small', 1), ('bush_medium', 'summer', 'Prop - Bushes Medium', 1), ('bush_large', 'summer', 'Prop - Bushes Large', 1),
    ('stump_short', 'summer', 'Prop - Tree Stump Short', 1), ('stump_tall', 'summer', 'Prop - Tree Stump Tall', 1),
    ('chest', 'summer', 'Prop - Treasure Chest', 1), ('tent', 'summer', 'Prop - Tent', 1), ('campfire', 'summer', 'Prop - Campfire', 1),
    ('tower', 'summer', 'Prop - Magic Stone Tower', 1), ('flag', 'summer', 'Prop - Flag', 1), ('well', 'summer', 'Prop - Well', 1),
    ('skeleton', 'swamp', 'Prop - Animal Skeleton', 1), ('sign', 'swamp', 'Prop - Danger Sign', 1), ('lantern', 'swamp', 'Prop - Lantern', 1),
    ('rafflesia', 'swamp', 'Prop - Rafflesia', 1), ('cave', 'swamp', 'Prop - Cave Enterance', 1),
] + [(f'rock_{i}', 'summer', f'Prop - Rock 0{i}', 2) for i in range(1, 6)] \
  + [(f'boulder_{i}', 'swamp', f'Prop - Boulder {i}', 1) for i in range(1, 4)] \
  + [(f'shrub_{i}', 'swamp', f'Prop - Shrub Swamp {i}', 1) for i in range(1, 4)] \
  + [(f'sticks_{i}', 'swamp', f'Prop - Sticks {i}', 1) for i in range(1, 6)] \
  + [(f'waterplant_{i}', 'swamp', f'Prop - Water Plant {i}', 1) for i in range(1, 4)] \
  + [(f'leaf_{i}', 'swamp', f'Prop - Leaf on the Water {i}', 1) for i in range(1, 4)] \
  + [(f'srock_{i}', 'swamp', f'Prop - Rock {i}', 2) for i in range(1, 6)]

def find(pack, base):
    hits = glob.glob(os.path.join(PACKS, pack, 'PNG', f'*_{base}.png'))
    assert len(hits) == 1, (pack, base, hits)
    return hits[0]

def pack_props():
    items = []
    for name, pack, base, k in PROPS:
        im = Image.open(find(pack, base)).convert('RGBA')
        im = im.resize((max(1, round(im.width * F * k)), max(1, round(im.height * F * k))), Image.LANCZOS)
        items.append((name, im))
    items.sort(key=lambda it: -it[1].height)
    W = 1024; PAD = 2
    x = y = rowh = 0; frames = {}; placed = []
    for name, im in items:
        if x + im.width + PAD > W: x = 0; y += rowh + PAD; rowh = 0
        frames[name] = {'frame': {'x': x, 'y': y, 'w': im.width, 'h': im.height}, 'rotated': False, 'trimmed': False,
                        'spriteSourceSize': {'x': 0, 'y': 0, 'w': im.width, 'h': im.height}, 'sourceSize': {'w': im.width, 'h': im.height}}
        placed.append((x, y, im)); x += im.width + PAD; rowh = max(rowh, im.height)
    H = y + rowh
    sheet = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    for px, py, im in placed: sheet.paste(im, (px, py), im)
    sheet.save(os.path.join(OUT, 'props.png'), optimize=True)
    json.dump({'frames': frames, 'meta': {'image': 'props.png', 'size': {'w': W, 'h': H}, 'scale': '1'}}, open(os.path.join(OUT, 'props.json'), 'w'))
    print('props.png', sheet.size, len(frames), 'frames')

if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    pack_ground(); pack_props()

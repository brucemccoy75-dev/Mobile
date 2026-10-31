#!/usr/bin/env python3
"""Assembles the authored screens (DECISIONS #37, node overworld) and prints them; paste into src/data/maps.
Letters on roads are node slots: E start (always the story node), o open slot (typed per run), x elite,
q the mid-map quest node, n the lost one, B boss. Usage: author-map.py forest|marsh|tundra (tundra is screen 2). Terrain: . grass # forest = road ~ water ^ rock % swamp A arena."""
import sys
W, H = 36, 18
def blank():
    g = [['.' for _ in range(W)] for _ in range(H)]
    for x in range(W): g[0][x] = g[H-1][x] = '^'
    for y in range(H): g[y][0] = g[y][W-1] = '^'
    return g
def put(g, x, y, ch): g[y][x] = ch
def hline(g, y, x0, x1, ch='='):
    for x in range(min(x0,x1), max(x0,x1)+1): put(g, x, y, ch)
def vline(g, x, y0, y1, ch='='):
    for y in range(min(y0,y1), max(y0,y1)+1): put(g, x, y, ch)
def rect(g, x0, y0, x1, y1, ch):
    for y in range(y0, y1+1):
        for x in range(x0, x1+1): put(g, x, y, ch)

def screen(biome):
    g = blank()
    wood = '%' if biome == 'marsh' else '#'
    rect(g, 2, 1, 6, 4, wood); rect(g, 26, 1, 33, 3, wood); rect(g, 2, 11, 7, 16, wood); rect(g, 29, 14, 33, 16, wood)
    rect(g, 15, 5, 19, 6, '~'); rect(g, 17, 10, 21, 11, '~')
    rect(g, 11, 10, 12, 11, wood); rect(g, 24, 4, 25, 5, wood)
    # main road and arena
    hline(g, 8, 1, 28)
    rect(g, 29, 5, 33, 11, '^'); rect(g, 30, 6, 32, 10, 'A'); put(g, 29, 8, 'A'); put(g, 31, 8, 'B')
    # north lane with two spurs (traced from the screen-1 painting: row 2, west side at x=10, rounded corners)
    vline(g, 10, 3, 7); hline(g, 2, 11, 22); put(g, 11, 3, '='); put(g, 22, 3, '='); put(g, 23, 3, '='); vline(g, 23, 4, 7); put(g, 14, 1, '='); put(g, 18, 1, '=')
    # south lane with a spur and the road east to the lost one
    vline(g, 14, 9, 13); hline(g, 13, 14, 30); vline(g, 26, 9, 12); vline(g, 20, 14, 15)
    # nodes: every road junction is a node, so a link never forks between nodes
    put(g, 1, 8, 'E'); put(g, 5, 8, 'o'); put(g, 10, 8, 'q'); put(g, 14, 8, 'o'); put(g, 19, 8, 'o'); put(g, 23, 8, 'o'); put(g, 26, 8, 'x')
    put(g, 10, 5, 'o'); put(g, 14, 2, 'o'); put(g, 14, 1, 'o'); put(g, 18, 2, 'o'); put(g, 18, 1, 'o'); put(g, 23, 5, 'o')
    put(g, 14, 11, 'o'); put(g, 20, 13, 'x'); put(g, 20, 15, 'o'); put(g, 26, 13, 'o'); put(g, 30, 13, 'n')
    # a rock bar so the south lane is only entered at its two ends
    hline(g, 10, 15, 16, '^'); hline(g, 10, 22, 25, '^')
    return '\n'.join(''.join(r) for r in g)

def tundra():
    """Screen 2, the Frozen Pass (DECISIONS #76): traced from the painting public/art/c/map2.jpg (48x27 tiles at
    26.7 px on the 1280x720 source). Roads are corner-point paths; diagonal roads become staircases. No two roads touch
    except at a node, so every junction is a node."""
    W, H = 48, 27
    g = [['.' for _ in range(W)] for _ in range(H)]
    def rect(x0, y0, x1, y1, ch):
        for y in range(y0, y1+1):
            for x in range(x0, x1+1): g[y][x] = ch
    # terrain under the painting: cliffs and crags ^, pines #, ice ~ (cosmetic; the painting draws the screen)
    rect(0, 0, 47, 1, '^'); rect(0, 0, 4, 2, '#'); rect(0, 3, 4, 10, '#'); rect(28, 0, 47, 4, '^'); rect(42, 5, 47, 8, '^')
    rect(12, 3, 20, 6, '~'); rect(23, 2, 25, 8, '~'); rect(20, 9, 24, 12, '~'); rect(22, 14, 25, 19, '~')
    rect(10, 15, 21, 19, '~'); rect(32, 16, 40, 20, '~')
    rect(10, 9, 13, 11, '^'); rect(30, 11, 34, 13, '^'); rect(38, 11, 41, 15, '^'); rect(15, 21, 18, 24, '^'); rect(29, 22, 31, 24, '^')
    rect(0, 15, 4, 26, '#'); rect(5, 19, 6, 26, '#'); rect(9, 23, 14, 26, '#'); rect(33, 24, 37, 26, '#'); rect(41, 9, 47, 26, '#')
    # the warden's ice fortress: walls of rock, a courtyard (arena), the gate on the road
    rect(36, 4, 43, 8, '^'); rect(37, 5, 42, 7, 'A'); g[8][39] = 'A'
    paths = [
        [(1, 14), (5, 14)],                                                   # the west edge to the first crossroads
        [(5, 14), (6, 14), (6, 13), (12, 13)], [(12, 13), (26, 13)],          # the main road east
        [(17, 13), (17, 9)],                                                  # north to the lake crossroads
        [(17, 9), (16, 9), (16, 8), (13, 8), (13, 7), (11, 7)],               # west under the lake
        [(11, 7), (11, 6), (10, 6), (10, 5), (8, 5), (8, 4), (6, 4), (6, 3), (5, 3)],  # the spur up to the north-west pines
        [(11, 7), (11, 9)],                                                   # the spur down to the rocks
        [(5, 14), (5, 16), (6, 16), (6, 17), (7, 17), (7, 18), (8, 18), (8, 19), (9, 19), (9, 20), (12, 20)],  # south-east round the big lake
        [(12, 20), (12, 22), (10, 22), (10, 24), (8, 24), (8, 25), (7, 25)],  # the south-west spur
        [(12, 20), (21, 20)],                                                 # under the big lake
        [(21, 20), (21, 22), (23, 22), (23, 24), (24, 24)],                   # down to the south crossroads
        [(24, 24), (24, 26)],                                                 # the short south spur, off the bottom edge
        [(21, 20), (22, 20), (22, 19), (26, 19), (26, 18), (27, 18), (27, 17), (29, 17)],  # east along the stream
        [(17, 9), (18, 9), (18, 8), (26, 8)],                                 # the north road
        [(26, 8), (27, 8), (27, 9), (28, 9), (28, 10), (30, 10)],
        [(26, 13), (26, 12), (30, 12), (30, 10)],                             # up past the crags
        [(30, 10), (35, 10)],
        [(35, 10), (36, 10), (36, 9), (39, 9)],                               # to the gate
        [(35, 10), (35, 14)],
        [(35, 14), (35, 15), (33, 15), (33, 16), (31, 16), (31, 17), (29, 17)],
        [(26, 13), (26, 14), (27, 14), (27, 15), (29, 15), (29, 17)],
        [(24, 24), (25, 24), (25, 23), (27, 23), (27, 22), (30, 22), (30, 21), (32, 21)],
        [(32, 21), (32, 19), (29, 19), (29, 17)],
        [(32, 21), (33, 21), (33, 22), (35, 22), (35, 23), (37, 23), (37, 24), (38, 24), (38, 25)],  # the south-east spur
    ]
    for path in paths:
        for (x0, y0), (x1, y1) in zip(path, path[1:]):
            assert x0 == x1 or y0 == y1, (x0, y0, x1, y1)
            for y in range(min(y0, y1), max(y0, y1)+1):
                for x in range(min(x0, x1), max(x0, x1)+1): g[y][x] = '='
    nodes = {'E': [(1, 14)], 'q': [(12, 13)], 'n': [(35, 23)], 'B': [(39, 6)], 'x': [(38, 9), (21, 13), (31, 19), (8, 18)], 'o': [
        (5, 14), (17, 13), (11, 7), (17, 9), (12, 20), (21, 20), (26, 8), (30, 10), (35, 10), (26, 13), (35, 14), (29, 17), (32, 21), (24, 24),
        (5, 3), (11, 9), (7, 25), (24, 26), (38, 25),
        (9, 13), (14, 8), (8, 5), (10, 23), (16, 20), (23, 22), (24, 19), (28, 22), (27, 15), (28, 12), (22, 8), (33, 15), (33, 10)]}
    for ch, ps in nodes.items():
        for x, y in ps: g[y][x] = ch
    return '\n'.join(''.join(r) for r in g)

arg = sys.argv[1] if len(sys.argv) > 1 else 'forest'
print(tundra() if arg == 'tundra' else screen(arg))

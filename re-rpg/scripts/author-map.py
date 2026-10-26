#!/usr/bin/env python3
"""Assembles the authored screens from placements (DECISIONS #34) and prints them; paste the output into src/data/maps."""
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
def nook(g, x, y, ch, gx, gy):
    """A POI in a rock pocket with its guard at the mouth."""
    for dx in (-1, 0, 1):
        for dy in (-1, 0, 1):
            if (dx, dy) != (0, 0): put(g, x+dx, y+dy, '^')
    put(g, x, y, ch); put(g, gx, gy, 'g')

def screen(biome):
    g = blank()
    wood, wet = ('%', '%') if biome == 'marsh' else ('#', '#')
    # forest clumps and a lake between the lanes
    rect(g, 2, 1, 6, 4, wood); rect(g, 26, 1, 33, 3, wood); rect(g, 2, 11, 7, 16, wood); rect(g, 29, 13, 33, 16, wood)
    rect(g, 15, 5, 19, 6, '~'); rect(g, 17, 10, 21, 11, wet if biome == 'marsh' else '~')
    rect(g, 11, 10, 12, 11, wood); rect(g, 24, 4, 25, 5, wood)
    # main road and arena
    hline(g, 8, 1, 28)
    rect(g, 29, 5, 33, 11, '^'); rect(g, 30, 6, 32, 10, 'A'); put(g, 29, 8, 'A'); put(g, 31, 8, 'B')
    # north lane
    vline(g, 9, 3, 7); hline(g, 3, 9, 23); vline(g, 23, 4, 7)
    # south lane
    vline(g, 14, 9, 13); hline(g, 13, 14, 26); vline(g, 26, 9, 12)
    # entry, giver
    put(g, 1, 8, 'E'); put(g, 2, 6, 'q'); put(g, 2, 7, '.')
    # main road contents
    put(g, 5, 8, 'f'); put(g, 8, 8, 'p'); put(g, 13, 8, 'p'); put(g, 19, 8, 'f'); put(g, 27, 8, 'x')
    put(g, 17, 7, 's'); put(g, 16, 7, '.'); put(g, 18, 7, '.')
    # north lane contents
    put(g, 9, 5, 'f'); nook(g, 13, 1, 'c', 13, 2); put(g, 13, 3, '='); nook(g, 18, 1, 'h', 18, 2); put(g, 18, 3, '='); put(g, 23, 5, 'f'); put(g, 20, 3, 'p')
    # south lane contents
    put(g, 14, 11, 'f'); put(g, 20, 13, 'x'); nook(g, 23, 15, 'c', 23, 14); put(g, 23, 13, '='); put(g, 26, 11, 'p')
    rect(g, 27, 13, 31, 14, '.'); put(g, 30, 14, 'n')
    # detour: a rock bar south of the main road so the south lane is only entered at the fork
    hline(g, 10, 15, 16, '^'); hline(g, 10, 22, 25, '^')
    return '\n'.join(''.join(r) for r in g)

print(screen(sys.argv[1] if len(sys.argv) > 1 else 'forest'))

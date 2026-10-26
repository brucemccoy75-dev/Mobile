#!/usr/bin/env python3
"""Assembles the authored screens (DECISIONS #37, node overworld) and prints them; paste into src/data/maps.
Letters on roads are node slots: E start (always the story node), o open slot (typed per run), x elite,
q the mid-map quest node, n the lost one, B boss. Terrain: . grass # forest = road ~ water ^ rock % swamp A arena."""
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

print(screen(sys.argv[1] if len(sys.argv) > 1 else 'forest'))

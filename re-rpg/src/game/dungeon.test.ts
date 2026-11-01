import { describe, expect, it } from 'vitest';
import { createMeta } from '@core/meta';
import { getEnemy } from '@data/index';
import { DUNGEON_ROSTER } from '@data/enemies';
import { DUNGEON_PRIZES, createSession, deserialize, enterDungeon, inDungeon, leaveDungeon, nodeEncounter, serialize } from './session';

const door = (s: ReturnType<typeof createSession>) => s.map.nodes!.find((n) => n.kind === 'dungeon')!;

describe('the Treasure Dungeon (DECISIONS #84)', () => {
  it('screen 1 has one door, at the bottom of the map, and it is no fight', () => {
    const s = createSession('warrior', createMeta(), 'DOOR');
    const doors = s.map.nodes!.filter((n) => n.kind === 'dungeon');
    expect(doors).toHaveLength(1);
    expect(doors[0]!.pos).toEqual({ x: 20, y: 15 });
    expect(Math.max(...s.map.nodes!.map((n) => n.pos.y))).toBe(15);
    expect(doors[0]!.enemyId).toBeUndefined();
  });

  it('in: a straight hall of five, three fights from its own five at +50%, a chest with one of three prizes', () => {
    const s = createSession('warrior', createMeta(), 'DOWN');
    const surface = s.map, at = { ...s.playerPos };
    enterDungeon(s, door(s));
    expect(inDungeon(s)).toBe(true);
    const nodes = s.map.nodes!;
    expect(nodes.map((n) => n.kind)).toEqual(['start', 'unknown', 'unknown', 'unknown', 'treasure']);
    expect(new Set(nodes.map((n) => n.pos.y)).size).toBe(1); // one straight line
    expect(s.playerPos).toEqual(nodes[0]!.pos);
    expect(DUNGEON_PRIZES as readonly string[]).toContain(nodes[4]!.prize);
    for (const n of nodes.slice(1, 4)) {
      for (const id of [n.enemyId!, ...(n.extra ?? [])]) expect(DUNGEON_ROSTER as readonly string[]).toContain(id);
      const e = nodeEncounter(s, n);
      const base = getEnemy(n.enemyId!);
      expect(e.custom![0]!.stats.maxHp).toBe(Math.round(base.stats.maxHp * 1.5));
      expect(e.custom![0]!.stats.atk).toBe(Math.round(base.stats.atk * 1.5));
      expect(e.custom).toHaveLength(1 + (n.extra?.length ?? 0));
    }
    // A save in the dungeon comes back in the dungeon, prize and all.
    const back = deserialize(serialize(s), createMeta());
    expect(inDungeon(back)).toBe(true);
    expect(back.map.nodes![4]!.prize).toBe(nodes[4]!.prize);
    expect(back.surface!.doorNode).toBe(door({ ...s, map: surface } as typeof s).id);
    // Out: screen 1 as it was, at the door, sealed.
    leaveDungeon(back);
    expect(inDungeon(back)).toBe(false);
    expect(back.map.nodes!.length).toBe(surface.nodes!.length);
    expect(back.playerPos).toEqual(door(back).pos);
    expect(back.dungeonDone).toBe(true);
    expect(back.clearedNodes.has(door(back).id)).toBe(true);
    expect(() => enterDungeon(back, door(back))).toThrow(/sealed/);
    expect(at).toBeDefined();
  });

  it('about a third of the dungeon fights are duos, and every prize turns up across runs', () => {
    let fights = 0, duos = 0;
    const prizes = new Set<string>();
    for (let k = 0; k < 200; k++) {
      const s = createSession('warrior', createMeta(), `D${k}`);
      enterDungeon(s, door(s));
      for (const n of s.map.nodes!) { if (n.kind === 'unknown') { fights++; if (n.extra?.length) duos++; } if (n.prize) prizes.add(n.prize); }
    }
    expect(duos / fights).toBeGreaterThan(0.25);
    expect(duos / fights).toBeLessThan(0.45);
    expect([...prizes].sort()).toEqual([...DUNGEON_PRIZES].sort());
  });
});

import { describe, expect, it } from 'vitest';
import { Rng } from '@core/rng';
import { createCombat, step } from '@core/combat';
import { createMeta, ghostOn, layGhost, leaveGhost } from '@core/meta';
import { GHOST_CHANCE, ghostAppears, ghostDef, ghostSpoils, wrenBoss, type GhostRecord } from './index';

const ghostRec = (deck: string[], strength = 0): GhostRecord => ({ classId: 'warrior', screenIndex: 0, tile: { x: 5, y: 8 }, nodeId: 'node_2', deck, stats: { maxHp: 25, atk: 5, def: 1 }, equipment: { body: null, weapon: 'iron_mace', relic: null }, killer: 'boar', killerName: 'Boar', gold: 80, strength, at: 1 });

describe('boss variants', () => {
  it('Wren swings your weapon by name and gains its attack', () => {
    const w = wrenBoss('Iron Mace', 1);
    expect(w.table.kind === 'sequence' && w.table.moves[0]!.name).toBe('Your Iron Mace');
    expect(w.stats.atk).toBe(7);
    expect(wrenBoss(null, 0).stats.atk).toBe(6);
    expect(w.tier).toBe('boss1');
  });
  it('a ghost fights with the cards it died holding and gets stronger each time', () => {
    const g = ghostDef(ghostRec(['shield_bash', 'mighty_blow', 'bind_wound', 'attack']));
    const names = g.table.kind === 'sequence' ? g.table.moves.map((m) => m.name) : [];
    expect(names).toContain('Shield Bash');
    expect(names).toContain('Mighty Blow');
    expect(g.stats.maxHp).toBe(25);
    expect(ghostDef(ghostRec(['attack'], 3)).stats.maxHp).toBe(31);
    expect(ghostDef(ghostRec([])).table.kind === 'sequence' && ghostDef(ghostRec([])).table.moves.length).toBe(2);
  });
  it('ghost and Wren run through the engine as ordinary enemies', () => {
    const s = createCombat({ player: { stats: { maxHp: 30, atk: 5, def: 0 }, deck: [] }, enemies: ['boar', ghostDef(ghostRec(['mighty_blow']))], rng: new Rng(3) });
    expect(s.enemies).toHaveLength(2);
    step(s, { type: 'card', index: 0, target: 1 });
    expect(s.outcome).toBe('ongoing');
    const w = createCombat({ player: { stats: { maxHp: 30, atk: 5, def: 0 }, deck: [] }, enemy: wrenBoss('Oak Wand', 1), rng: new Rng(3) });
    expect(w.enemyDef.name).toContain('Wren');
  });
  it('spoils give back capped gold and a non-basic card; meta keeps one ghost per screen that grows', () => {
    expect(ghostSpoils(ghostRec(['attack', 'mighty_blow']))).toEqual({ gold: 60, tome: 'mighty_blow' });
    expect(ghostSpoils(ghostRec(['attack'])).tome).toBeNull();
    const meta = createMeta();
    const { strength: s0 } = leaveGhost(meta, { ...ghostRec([]), strength: undefined, at: undefined } as never);
    expect(s0).toBe(0);
    expect(leaveGhost(meta, ghostRec([])).strength).toBe(1);
    expect(ghostOn(meta, 0)?.strength).toBe(1);
    expect(ghostOn(meta, 1)).toBeUndefined();
    layGhost(meta, 0);
    expect(ghostOn(meta, 0)).toBeUndefined();
  });
  it('a ghost walks in about one run in ten (DECISIONS #49), fixed per run and screen', () => {
    expect(GHOST_CHANCE).toBe(0.1);
    const seen = Array.from({ length: 2000 }, (_, i) => ghostAppears(`SEED-${i}`, 0)).filter(Boolean).length;
    expect(seen / 2000).toBeGreaterThan(0.08);
    expect(seen / 2000).toBeLessThan(0.12);
    for (let i = 0; i < 50; i++) expect(ghostAppears(`SEED-${i}`, 1)).toBe(ghostAppears(`SEED-${i}`, 1));
  });
});

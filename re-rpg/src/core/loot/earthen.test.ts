import { describe, expect, it } from 'vitest';
import { Rng } from '@core/rng';
import { createMeta } from '@core/meta';
import { emptyEquipment, gearOf, redrawCost } from '@core/run';
import { getItem } from '@data/index';
import { buildPool, rollOffer, rollShopStock } from './index';

const ctx = (bossId?: string) => ({ classId: 'warrior' as const, families: [], meta: createMeta(), deck: [], equipment: emptyEquipment(), ...(bossId ? { bossId } : {}) });
const EARTHEN = ['earthen_armor', 'earthen_blade', 'earthen_relic'];

describe('the Earthen set (DECISIONS #82)', () => {
  it("only Knight Andre's loot offers it: never a fight, a chest, the shop or another boss", () => {
    const ids = (c: ReturnType<typeof ctx>) => buildPool(c).items.map((i) => i.id);
    for (const id of EARTHEN) {
      expect(ids(ctx('gatekeeper'))).toContain(id);
      expect(ids(ctx())).not.toContain(id);
      expect(ids(ctx('warden'))).not.toContain(id);
    }
    let seen = 0;
    for (let k = 0; k < 400; k++) {
      for (const src of ['kill', 'guard', 'chest'] as const) expect(rollOffer(src, 0, ctx(), new Rng(k)).choices.some((c) => c.kind === 'item' && EARTHEN.includes(c.item.id))).toBe(false);
      expect(rollShopStock(0, ctx(), new Rng(k)).lines.some((l) => EARTHEN.includes(l.id))).toBe(false);
      if (rollOffer('boss', 0, ctx('gatekeeper'), new Rng(k)).choices.some((c) => c.kind === 'item' && EARTHEN.includes(c.item.id))) seen++;
    }
    expect(seen).toBeGreaterThan(0);
    // eslint-disable-next-line no-console
    console.log(`Andre's loot offered an Earthen piece in ${((100 * seen) / 400).toFixed(1)}% of 400 rolls`);
  });

  it('what each piece does', () => {
    const eq = { body: getItem('earthen_armor'), weapon: getItem('earthen_blade'), relic: getItem('earthen_relic') };
    expect(gearOf(eq)).toEqual({ immune: ['weak'], pierce: 0.5, redraw: true });
    expect(redrawCost(eq)).toBe(20);
    expect(gearOf(emptyEquipment())).toBeUndefined();
    expect(redrawCost(emptyEquipment())).toBeNull();
    expect(getItem('earthen_armor').mods[0]!.stat).toEqual({ def: 2, atk: -2 });
    expect(getItem('earthen_blade').mods[0]!.stat).toEqual({ atk: 2 });
  });
});

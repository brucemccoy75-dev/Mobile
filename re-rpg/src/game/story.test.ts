import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createMeta } from '@core/meta';
import { createSession, currentQuest, nodeById, rearmLastFight, storyCtx } from './session';
import { applyWin } from './story';
import { applyOption } from './dialogue';
import { STORY } from '@data/world';

// These tests are the story's own: they run with it switched on (DECISIONS #72).
beforeAll(() => { STORY.enabled = true; });
afterAll(() => { STORY.enabled = false; });

const fightNode = (s: ReturnType<typeof createSession>) => s.map.nodes!.find((n) => n.kind === 'monster' || n.kind === 'unknown')!;

describe('wins are applied before any save (DECISIONS #61)', () => {
  it('a node win clears the node at once and counts toward a hunt', () => {
    const meta = createMeta();
    const s = createSession('warrior', meta, 'WIN-1');
    const n = fightNode(s);
    const q = currentQuest(s)!;
    q.kind = 'hunt'; q.fetch = undefined; q.escort = undefined; q.status = 'active'; q.hunt = { enemyId: n.enemyId!, name: 'x', need: 2, have: 0 };
    const r = applyWin(s, meta, { kind: 'node', enemyId: n.enemyId!, nodeId: n.id, extra: n.extra });
    expect(s.clearedNodes.has(n.id)).toBe(true);
    expect(s.lastClearedNode).toBe(n.id);
    expect(q.hunt.have).toBeGreaterThanOrEqual(1);
    expect(r.cleared).toBe(n.id);
  });
  it("an enemy's on-kill hooks are data: killing Wren's rats costs her standing, double after a promise", () => {
    const meta = createMeta();
    const s = createSession('warrior', meta, 'WIN-2');
    const r1 = applyWin(s, meta, { kind: 'node', enemyId: 'rat_pack', nodeId: fightNode(s).id });
    expect(meta.relations.wren).toBe(-1);
    expect(r1.notes.join(' ')).toContain('Wren');
    s.flags.add('rats_promise');
    applyWin(s, meta, { kind: 'node', enemyId: 'rat_pack', nodeId: fightNode(s).id });
    expect(meta.relations.wren).toBe(-3);
  });
  it('a re-armed node carries its own words and win flag; winning another node does not set it', () => {
    const meta = createMeta();
    const s = createSession('warrior', meta, 'WIN-3');
    const [a, b] = s.map.nodes!.filter((n) => n.kind === 'monster' || n.kind === 'unknown');
    applyWin(s, meta, { kind: 'node', enemyId: a!.enemyId!, nodeId: a!.id });
    const re = rearmLastFight(s, { trigger: 'pre_fight:brother', winFlag: 'tinker_fight_won' })!;
    expect(re.id).toBe(a!.id);
    expect(nodeById(s, a!.id).rearm).toEqual({ trigger: 'pre_fight:brother', winFlag: 'tinker_fight_won' });
    applyWin(s, meta, { kind: 'node', enemyId: b!.enemyId!, nodeId: b!.id });
    expect(s.flags.has('tinker_fight_won')).toBe(false);
    applyWin(s, meta, { kind: 'node', enemyId: re.enemyId!, nodeId: re.id, extra: re.extra });
    expect(s.flags.has('tinker_fight_won')).toBe(true);
    expect(nodeById(s, a!.id).rearm).toBeUndefined();
  });
  it('a boss win marks the screen beaten and heals', () => {
    const meta = createMeta();
    const s = createSession('warrior', meta, 'WIN-4');
    s.hp = 3;
    const boss = s.map.nodes!.find((n) => n.kind === 'boss')!;
    expect(applyWin(s, meta, { kind: 'boss', enemyId: boss.enemyId!, nodeId: boss.id }).boss).toBe(true);
    expect([s.bossDefeated, s.hp, s.clearedNodes.has(boss.id)]).toEqual([true, s.stats.maxHp, true]);
  });
});

describe('the story context and effects (DECISIONS #61)', () => {
  it('reads screen, quest states, held cards, special and remembered flags', () => {
    const meta = createMeta();
    meta.memory = ['saw_wren_cry'];
    const s = createSession('warrior', meta, 'CTX-1');
    s.deck.push('shield_bash');
    const c = storyCtx(s, meta);
    expect(c.screen).toBe(0);
    expect(c.quests).toEqual({ wren_errand: 'offered' });
    expect(c.has!('shield_bash')).toBe(true);
    expect(c.memory!.has('saw_wren_cry')).toBe(true);
  });
  it('remember lasts across runs; quest offers a world.json quest now; note says a line', () => {
    const meta = createMeta();
    const s = createSession('warrior', meta, 'CTX-2');
    const r = applyOption(s, meta, { text: 'x', effects: [{ remember: 'met_the_king' }, { quest: 'wren_errand' }, { note: 'The road goes quiet.' }] });
    expect(meta.memory).toContain('met_the_king');
    expect(s.quests.filter((q) => q.defId === 'wren_errand')).toHaveLength(2);
    expect(r.notes).toContain('The road goes quiet.');
  });
});

import { afterEach, describe, expect, it } from 'vitest';
import { createMeta } from '@core/meta';
import { STORY } from '@data/world';
import { createSession, currentQuest, questGiverNode } from './session';
import { applyWin } from './story';

/** The story switch (DECISIONS #72): off while the designer balances; the code stays for later. */
describe('story switched off (DECISIONS #72)', () => {
  afterEach(() => { STORY.enabled = false; });

  it('is off by default', () => {
    expect(STORY.enabled).toBe(false);
  });

  it('a run has no quest and is never a special run', () => {
    const meta = createMeta();
    for (let i = 0; i < 40; i++) {
      const s = createSession('warrior', meta, `PLAIN-${i}`);
      expect(s.quests).toEqual([]);
      expect(currentQuest(s)).toBeUndefined();
      expect(s.special).toBe(false);
      expect(questGiverNode(s)).toBeUndefined(); // no quest, so no one at the camp to draw (the map crashed on this)
    }
  });

  it('a kill runs no on-kill hook: killing rats costs nothing with Wren', () => {
    const meta = createMeta();
    const s = createSession('warrior', meta, 'PLAIN-RATS');
    s.flags.add('rats_promise');
    const report = applyWin(s, meta, { kind: 'node', enemyId: 'rat_pack' });
    expect(report.notes).toEqual([]);
    expect(meta.relations.wren ?? 0).toBe(0);
  });

  it('switched back on, the quest and the hooks return', () => {
    STORY.enabled = true;
    const meta = createMeta();
    const s = createSession('warrior', meta, 'STORY-ON');
    expect(currentQuest(s)).toBeDefined();
    applyWin(s, meta, { kind: 'node', enemyId: 'rat_pack' });
    expect(meta.relations.wren).toBeLessThan(0);
  });
});

import worldJson from './world.json';
import { enemyTrigger, type WorldData } from './worldSchema';

/** The world file (DECISIONS #55), as the game reads it. Edited in the world editor, never by hand. */
export const WORLD = worldJson as unknown as WorldData;

/**
 * The story switch (DECISIONS #72). Off while the designer balances: no quests or special runs, no
 * words anywhere (camp, story nodes, pre-fight, gate), no on-kill hooks, and the gate is always the
 * screen's own boss (no Wren). The world file and every story system stay; set `enabled` to bring
 * them back. Tests of the story turn it on for themselves.
 */
export const STORY = { enabled: false };

/** The everyday lines for a trigger: an enemy's defaults for its own pre-fight or gate trigger. */
export function defaultsFor(trigger: string): string[] {
  const [, id] = trigger.split(':');
  if (!id || enemyTrigger(id) !== trigger) return [];
  return WORLD.enemies[id]?.defaults ?? [];
}

/** Node rules for a screen. */
export const nodeRules = (screenIndex: number) => WORLD.screens[screenIndex]?.nodes ?? {};

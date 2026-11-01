import type { EnemyId, SkillId } from '@data/types';
import type { MapNode, ScreenMap } from '@core/map/types';

/**
 * The tutorial (DECISIONS #96): a short training run on its own map, the Training Grounds, with set
 * fights and set hands, in which the hero cannot die. Lessons are short lines over a dimmed screen
 * that point at one thing; most wait for the player to do that thing. Their words are data
 * (`tutorial.lessons` in world.json, the world editor's Tutorial tab); when and where each one shows is
 * fixed here. It is off the record like a level-select run, and it ends at class select.
 */

/** Every lesson, in the order a training run meets them, and where it shows (for the editor). */
export const LESSONS = [
  { id: 'welcome', where: 'Training map: as it opens' },
  { id: 'travel', where: 'Training map: points at the next clearing; waits for the tap' },
  { id: 'hand', where: 'First fight (Boar): points at your hand' },
  { id: 'intent', where: 'First fight: points at the enemy\'s intent panel' },
  { id: 'guard', where: 'First fight: points at Defend; waits for it to be played' },
  { id: 'attack', where: 'First fight, second turn: points at Attack; waits for it to be played' },
  { id: 'statuses', where: 'Any training fight: the first turn that starts with a status chip showing' },
  { id: 'reward', where: 'The first spoils screen of the training run' },
  { id: 'ward', where: 'Second fight (Hex Imp): points at Ward; waits for it to be played' },
  { id: 'hold', where: 'Second fight, second turn: points at your hand; waits for a press and hold' },
  { id: 'shrine', where: 'Arriving at the training shrine, before it asks' },
  { id: 'shop', where: 'The training shop, as it opens' },
  { id: 'duo', where: 'The duo fight: points at both enemies' },
  { id: 'final', where: 'Arriving at the last training fight' },
  { id: 'ready', where: 'The end of training, before class select' },
  { id: 'heirlooms', where: 'Real runs: the first heirloom screen, once' },
] as const;
export type LessonId = (typeof LESSONS)[number]['id'];
export const LESSON_IDS: readonly LessonId[] = LESSONS.map((l) => l.id);
/** The longest a lesson's line may be: two lines of the overlay on a small phone and a bit. */
export const LESSON_MAX = 200;

/** The words file shape (world.json `tutorial`). */
export interface TutorialData { lessons: Record<string, string> }

/** One line per problem: every lesson has words, 1–LESSON_MAX characters, and there are no strays. */
export function validateTutorial(t: TutorialData | undefined): string[] {
  if (!t || typeof t.lessons !== 'object' || !t.lessons) return ['tutorial: needs lessons'];
  const out: string[] = [];
  for (const id of LESSON_IDS) {
    const s = t.lessons[id];
    if (typeof s !== 'string' || !s.trim()) out.push(`tutorial ${id}: needs a line`);
    else if (s.length > LESSON_MAX) out.push(`tutorial ${id}: ${s.length} characters, at most ${LESSON_MAX}`);
  }
  for (const id of Object.keys(t.lessons)) if (!(LESSON_IDS as readonly string[]).includes(id)) out.push(`tutorial ${id}: no such lesson`);
  return out;
}

// ---------------------------------------------------------------- the training run

export type TrainingKind = 'start' | 'monster' | 'shrine' | 'shop' | 'treasure';
export interface TrainingStop {
  kind: TrainingKind;
  /** A fight's enemies, front first. */
  enemies?: EnemyId[];
  /** A fight's deal, in order (the starting cards, rearranged); unset = shuffled as usual. */
  hand?: SkillId[];
  /** The lesson shown on arriving, before the node's task. */
  arrive?: LessonId;
}

/** The Training Grounds' road, start to end (src/data/maps/training.ts). */
export const TRAINING: readonly TrainingStop[] = [
  { kind: 'start' },
  { kind: 'monster', enemies: ['boar'], hand: ['defend', 'attack', 'attack', 'ward', 'bellow', 'defend'] }, // Tusk first: Defend, then Attack
  { kind: 'monster', enemies: ['hex_imp'], hand: ['ward', 'attack', 'attack', 'defend', 'bellow', 'defend'] }, // Hex (magic) first: Ward
  { kind: 'shrine', arrive: 'shrine' },
  { kind: 'shop' },
  { kind: 'treasure' },
  { kind: 'monster', enemies: ['shell_beetle', 'rat_pack'], hand: ['attack', 'attack', 'defend', 'ward', 'bellow', 'defend'] },
  { kind: 'monster', enemies: ['adept_necromancer'], arrive: 'final' },
];
/** Gold the training run starts with, so its shop can sell something. */
export const TRAINING_GOLD = 30;

/** The map's nodes in road order from the start (the training road never branches). */
export function roadOrder(map: ScreenMap): MapNode[] {
  const nodes = map.nodes ?? [];
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const start = nodes.find((n) => n.kind === 'start');
  if (!start) return [];
  const out: MapNode[] = [start];
  for (let cur: MapNode | undefined = start, prev = ''; cur;) {
    const next: MapNode | undefined = cur.links.filter((l) => l !== prev).map((l) => byId.get(l)!)[0];
    if (!next || out.includes(next)) break;
    out.push(next); prev = cur.id; cur = next;
  }
  return out;
}
/** Where a node sits on the training road (0 = the start), or -1. */
export const stopIndex = (map: ScreenMap, nodeId: string): number => roadOrder(map).findIndex((n) => n.id === nodeId);

// ---------------------------------------------------------------- the meta flags

/** Flags in `meta.tutorial`: the training run has been finished or skipped; the heirloom lesson was seen. */
export const TUTORIAL_DONE = 'done', HEIRLOOMS_SEEN = 'heirlooms';
export const tutorialDone = (m: { tutorial?: string[] }): boolean => !!m.tutorial?.includes(TUTORIAL_DONE);
export function markTutorial(m: { tutorial?: string[]; updatedAt: number }, flag: string): void {
  m.tutorial = [...new Set([...(m.tutorial ?? []), flag])];
  m.updatedAt = Date.now();
}

import type Phaser from 'phaser';
import { HEIRLOOMS_SEEN, TUTORIAL_DONE, markTutorial, type LessonId } from '@core/tutorial';
import type { MetaState } from '@core/meta';
import { WORLD } from '@data/world';
import { createTraining, getMeta, getStore, holdMeta, peekSession, restoreMeta, setSession } from '@game/session';
import { showLesson, type Rect } from '@game/ui/TutorialOverlay';

/** A lesson's words (world.json `tutorial`, edited in the world editor; DECISIONS #96). */
export const lessonLine = (id: LessonId): string => WORLD.tutorial?.lessons?.[id] ?? '';

/** Start the training run (DECISIONS #96): off the record, on a copy of the meta, straight to its map. */
export function startTraining(scene: Phaser.Scene): void {
  setSession(scene, createTraining(holdMeta(scene)));
  scene.scene.start('Overworld');
}

/** Set a tutorial flag on the real meta (a training run plays on a copy) and save it. */
export async function markReal(scene: Phaser.Scene, flag: string): Promise<void> {
  const real = (scene.registry.get('metaHeld') as MetaState | undefined) ?? getMeta(scene);
  markTutorial(real, flag);
  await getStore(scene).saveMeta(real);
}

/** Training is over, finished or skipped: it counts as done, the real meta is back, and a real run starts at class select. */
export async function endTraining(scene: Phaser.Scene): Promise<void> {
  await markReal(scene, TUTORIAL_DONE);
  restoreMeta(scene);
  setSession(scene, null);
  scene.scene.start('ClassSelect');
}

/**
 * Show one training lesson, once per training run. Returns false when the player skipped the
 * tutorial (the scene is already on its way to class select) or the lesson was already shown.
 */
export async function trainingLesson(scene: Phaser.Scene, id: LessonId, o: { target?: () => Rect | null; until?: Promise<unknown>; ok?: string; noSkip?: boolean } = {}): Promise<boolean> {
  const s = peekSession(scene);
  if (!s?.training || s.training.shown.includes(id)) return false;
  s.training.shown.push(id);
  let skipped = false;
  const r = await showLesson(scene, { line: lessonLine(id), ...o, ...(o.noSkip ? {} : { onSkip: () => { skipped = true; void endTraining(scene); } }) });
  return r === 'ok' && !skipped;
}
export const lessonShown = (scene: Phaser.Scene, id: LessonId): boolean => !!peekSession(scene)?.training?.shown.includes(id);

/** The heirloom lesson (real runs): once ever, not in demo, level select or Test Mode. */
export async function heirloomLesson(scene: Phaser.Scene, target: () => Rect | null): Promise<void> {
  const s = peekSession(scene);
  if (!s || s.levelTest || s.testMode || s.demo || getMeta(scene).tutorial?.includes(HEIRLOOMS_SEEN)) return;
  markTutorial(getMeta(scene), HEIRLOOMS_SEEN);
  void getStore(scene).saveMeta(getMeta(scene));
  await showLesson(scene, { line: lessonLine('heirlooms'), target });
}

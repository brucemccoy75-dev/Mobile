import Phaser from 'phaser';
import { getClass, getSet, getSkill } from '@data/index';
import type { ClassId, SetId } from '@data/types';
import { TREES, expToReach, type TreeNode } from '@data/progression';
import { classProgress, nodeState, unlockNode } from '@core/meta';
import { adoptFamily, getMeta, peekSession, persistMeta, persistRun } from '@game/session';
import { Button } from '@game/ui/Button';
import { COLORS, FONT, text } from '@game/ui/theme';

/**
 * The class's skill tree (DECISIONS #32, #46): nodes are card families, bought with skill points
 * earned by levelling that class. Drawn in tiers by prerequisite, roots on top, with a link from
 * each node to the ones it unlocks; tap a node for its cards and the Unlock button.
 */
export class SkillTreeScene extends Phaser.Scene {
  private selected: SetId | null = null;
  private detail: Phaser.GameObjects.GameObject[] = [];

  constructor() { super('SkillTree'); }

  create(data: { classId: ClassId; returnTo?: string; selected?: SetId }) {
    const classId = data.classId;
    const returnTo = data.returnTo ?? 'ClassSelect';
    const meta = getMeta(this);
    const prog = classProgress(meta, classId);
    const { width: W, height: H } = this.scale.gameSize;
    this.cameras.main.setBackgroundColor(0x0b0f1a);
    this.detail = [];

    this.add.text(W / 2, 24, `${getClass(classId).name}  ·  Skill tree`, { ...text.h2, fontSize: '20px' }).setOrigin(0.5);
    const next = prog.level >= 10 ? 'max level' : `${prog.exp}/${expToReach(prog.level + 1)} EXP to level ${prog.level + 1}`;
    this.add.text(W / 2, 50, `Level ${prog.level}  ·  ${next}  ·  ${prog.points} skill point${prog.points === 1 ? '' : 's'} to spend`, { ...text.small, fontSize: '13px', color: prog.points ? COLORS.gold : COLORS.muted }).setOrigin(0.5);

    const nodes = TREES[classId];
    // Tier = longest chain of prerequisites above the node, so roots sit on top and Weaponmaster at the bottom.
    const tierOf = new Map<SetId, number>();
    const tier = (n: TreeNode): number => {
      const t = tierOf.get(n.setId);
      if (t !== undefined) return t;
      const v = (n.requires ?? []).reduce((m, r) => Math.max(m, tier(nodes.find((x) => x.setId === r)!) + 1), 0);
      tierOf.set(n.setId, v);
      return v;
    };
    nodes.forEach(tier);
    const tiers = Math.max(...nodes.map((n) => tierOf.get(n.setId)!)) + 1;

    // Tree on the left two thirds, detail panel on the right.
    const treeW = W * 0.62, treeX0 = 24, top = 86, bottom = H - 70;
    const nw = Math.min(176, treeW / 2.4), nh = 54;
    const rowY = (t: number) => (tiers === 1 ? (top + bottom) / 2 : top + nh / 2 + (t * (bottom - top - nh)) / (tiers - 1));
    const pos = new Map<SetId, { x: number; y: number }>();
    for (let t = 0; t < tiers; t++) {
      // Each tier sits under its parents: nodes are ordered by the mean x of what they require, so links do not cross.
      const parentX = (n: TreeNode) => { const xs = (n.requires ?? []).map((r) => pos.get(r)?.x ?? 0); return xs.length ? xs.reduce((a, x) => a + x, 0) / xs.length : 0; };
      const row = nodes.filter((n) => tierOf.get(n.setId) === t).map((n, i) => ({ n, i })).sort((a, b) => (t === 0 ? a.i - b.i : parentX(a.n) - parentX(b.n) || a.i - b.i)).map((x) => x.n);
      row.forEach((n, i) => pos.set(n.setId, { x: treeX0 + (treeW * (i + 1)) / (row.length + 1), y: rowY(t) }));
    }
    // Links first, so the boxes sit on top of them.
    const g = this.add.graphics();
    for (const n of nodes) for (const r of n.requires ?? []) {
      const a = pos.get(r)!, b = pos.get(n.setId)!;
      const owned = nodeState(meta, classId, r).state === 'owned';
      g.lineStyle(3, owned ? COLORS.goldHex : COLORS.panelEdge, 1);
      g.beginPath(); g.moveTo(a.x, a.y + nh / 2); g.lineTo(a.x, (a.y + b.y) / 2); g.lineTo(b.x, (a.y + b.y) / 2); g.lineTo(b.x, b.y - nh / 2); g.strokePath();
    }
    const first = nodes.find((n) => nodeState(meta, classId, n.setId).state === 'available') ?? nodes[0]!;
    this.selected = data.selected && nodes.some((n) => n.setId === data.selected) ? data.selected : first.setId;
    const boxes = new Map<SetId, Phaser.GameObjects.Rectangle>();
    for (const n of nodes) {
      const { x, y } = pos.get(n.setId)!;
      const st = nodeState(meta, classId, n.setId);
      const set = getSet(n.setId);
      const edge = st.state === 'owned' ? COLORS.goldHex : st.state === 'available' ? 0x3fbf7a : COLORS.panelEdge;
      const box = this.add.rectangle(x, y, nw, nh, st.state === 'owned' ? 0x1f2a44 : COLORS.panel).setStrokeStyle(3, edge).setInteractive({ useHandCursor: true });
      box.on('pointerup', () => { this.selected = n.setId; this.showDetail(classId, returnTo, n, boxes); });
      boxes.set(n.setId, box);
      this.add.text(x, y - 9, set.name, { fontFamily: FONT, fontSize: '15px', color: st.state === 'locked' ? COLORS.muted : COLORS.text, fontStyle: 'bold' }).setOrigin(0.5);
      this.add.text(x, y + 12, st.state === 'owned' ? 'OWNED' : n.cost === 0 ? 'FREE' : `${n.cost} POINT${n.cost === 1 ? '' : 'S'}${st.state === 'locked' && (n.requires?.length ?? 0) > 0 ? ' · LOCKED' : ''}`, { fontFamily: FONT, fontSize: '10px', color: st.state === 'owned' ? COLORS.gold : st.state === 'available' ? '#8ff0b8' : '#9aa3b8', fontStyle: 'bold' }).setOrigin(0.5);
    }
    this.showDetail(classId, returnTo, nodes.find((n) => n.setId === this.selected)!, boxes);

    new Button(this, W / 2, H - 32, returnTo === 'ClassSelect' ? 'Back' : 'Back to the run', () => this.scene.start(returnTo), { width: 200, height: 36, fontSize: '14px' });
  }

  /** The right-hand panel: the selected family's cards, its state and the Unlock button. */
  private showDetail(classId: ClassId, returnTo: string, n: TreeNode, boxes: Map<SetId, Phaser.GameObjects.Rectangle>) {
    for (const o of this.detail) o.destroy();
    this.detail = [];
    const meta = getMeta(this);
    const { width: W, height: H } = this.scale.gameSize;
    for (const [id, box] of boxes) box.setStrokeStyle(id === n.setId ? 4 : 3, id === n.setId ? 0xffffff : (nodeState(meta, classId, id).state === 'owned' ? COLORS.goldHex : nodeState(meta, classId, id).state === 'available' ? 0x3fbf7a : COLORS.panelEdge));
    const px = W * 0.64 + 12, pw = W - px - 24, py = 86, ph = H - 70 - py;
    const set = getSet(n.setId);
    const st = nodeState(meta, classId, n.setId);
    const add = <T extends Phaser.GameObjects.GameObject>(o: T): T => { this.detail.push(o); return o; };
    add(this.add.rectangle(px + pw / 2, py + ph / 2, pw, ph, COLORS.panel, 0.9).setStrokeStyle(2, COLORS.panelEdge));
    add(this.add.text(px + 14, py + 12, set.name, { ...text.h2, fontSize: '19px' }));
    const req = (n.requires ?? []).map((r) => getSet(r).name);
    add(this.add.text(px + 14, py + 40, `${st.state === 'owned' ? 'Owned' : n.cost === 0 ? 'Free' : `${n.cost} skill point${n.cost === 1 ? '' : 's'}`}${req.length ? `  ·  after ${req.join(' and ')}` : ''}`, { ...text.small, fontSize: '12px', color: st.state === 'owned' ? COLORS.gold : COLORS.muted, wordWrap: { width: pw - 28 } }));
    const cards = set.skills.map((id) => getSkill(id).name);
    add(this.add.text(px + 14, py + 68, cards.length ? cards.join('\n') : 'No cards in this family yet.', { ...text.body, fontSize: '13px', lineSpacing: 3, color: cards.length ? COLORS.text : COLORS.muted, wordWrap: { width: pw - 28 } }));
    if (st.state === 'available') {
      add(new Button(this, px + pw / 2, py + ph - 30, 'Unlock', () => {
        if (!unlockNode(meta, classId, n.setId)) return;
        // Bought mid-run (from the overworld or a reward screen): the family drops from now on, not next run.
        const run = peekSession(this);
        const inRun = run !== null && run.classId === classId && returnTo !== 'ClassSelect';
        if (inRun && adoptFamily(run, n.setId)) void persistRun(this);
        void persistMeta(this).then(() => this.scene.restart({ classId, returnTo, selected: n.setId }));
      }, { width: pw - 40, height: 36, fontSize: '14px', fill: 0x173526, edge: 0x3fbf7a }));
    } else if (st.state === 'locked' && st.reason) {
      add(this.add.text(px + pw / 2, py + ph - 30, st.reason, { ...text.small, fontSize: '12px', color: COLORS.muted, wordWrap: { width: pw - 28 }, align: 'center' }).setOrigin(0.5));
    }
  }
}

import Phaser from 'phaser';
import { getClass, getSet, getSkill } from '@data/index';
import type { ClassId } from '@data/types';
import { TREES, expToReach } from '@data/progression';
import { classProgress, nodeState, unlockNode } from '@core/meta';
import { getMeta, persistMeta } from '@game/session';
import { Button } from '@game/ui/Button';
import { COLORS, text } from '@game/ui/theme';

/**
 * The class's skill tree (DECISIONS #32): nodes are card families, bought with skill points
 * earned by levelling that class. Spent between runs, never refunded, never shared.
 */
export class SkillTreeScene extends Phaser.Scene {
  constructor() { super('SkillTree'); }

  create(data: { classId: ClassId; returnTo?: string }) {
    const classId = data.classId;
    const returnTo = data.returnTo ?? 'ClassSelect';
    const meta = getMeta(this);
    const prog = classProgress(meta, classId);
    const { width: W, height: H } = this.scale.gameSize;
    this.cameras.main.setBackgroundColor(0x0b0f1a);

    this.add.text(W / 2, 30, `${getClass(classId).name}  ·  Skill tree`, text.h2).setOrigin(0.5);
    const next = prog.level >= 10 ? 'max level' : `${prog.exp}/${expToReach(prog.level + 1)} EXP to level ${prog.level + 1}`;
    this.add.text(W / 2, 60, `Level ${prog.level}  ·  ${next}  ·  ${prog.points} skill point${prog.points === 1 ? '' : 's'} to spend`, { ...text.small, fontSize: '14px', color: prog.points ? COLORS.gold : COLORS.muted }).setOrigin(0.5);

    const nodes = TREES[classId];
    const cw = Math.min(220, (W - 80) / Math.max(3, nodes.length) - 14), ch = 200, gap = 14;
    const startX = W / 2 - ((nodes.length * cw + (nodes.length - 1) * gap) / 2) + cw / 2;
    nodes.forEach((n, i) => {
      const x = startX + i * (cw + gap), y = H / 2 - 6;
      const st = nodeState(meta, classId, n.setId);
      const set = getSet(n.setId);
      const edge = st.state === 'owned' ? COLORS.goldHex : st.state === 'available' ? 0x3fbf7a : COLORS.panelEdge;
      this.add.rectangle(x, y, cw, ch, st.state === 'owned' ? 0x1f2a44 : COLORS.panel).setStrokeStyle(3, edge);
      this.add.text(x, y - ch / 2 + 18, st.state === 'owned' ? 'OWNED' : n.cost === 0 ? 'FREE' : `${n.cost} POINT${n.cost === 1 ? '' : 'S'}`, { ...text.small, fontSize: '11px', color: st.state === 'owned' ? COLORS.gold : '#9aa3b8' }).setOrigin(0.5);
      this.add.text(x, y - ch / 2 + 46, set.name, { ...text.h2, fontSize: '19px', wordWrap: { width: cw - 20 }, align: 'center' }).setOrigin(0.5);
      this.add.text(x, y - ch / 2 + 78, set.skills.map((id) => getSkill(id).name).join('\n'), { ...text.body, fontSize: '13px', align: 'center', lineSpacing: 4, color: st.state === 'locked' ? COLORS.muted : COLORS.text }).setOrigin(0.5, 0);
      if (st.state === 'available') {
        new Button(this, x, y + ch / 2 - 28, 'Unlock', () => { if (unlockNode(meta, classId, n.setId)) void persistMeta(this).then(() => this.scene.restart({ classId, returnTo })); }, { width: cw - 40, height: 36, fontSize: '14px', fill: 0x173526, edge: 0x3fbf7a });
      } else if (st.state === 'locked' && st.reason) {
        this.add.text(x, y + ch / 2 - 22, st.reason, { ...text.small, fontSize: '11px', color: COLORS.muted, wordWrap: { width: cw - 20 }, align: 'center' }).setOrigin(0.5);
      }
    });

    this.add.text(W / 2, H - 88, 'Points come from levelling this class. Nothing here is shared with the other classes, and nothing is refunded. New families appear here as they are added to the game.', { ...text.small, fontSize: '12px', color: COLORS.muted, wordWrap: { width: W - 160 }, align: 'center' }).setOrigin(0.5);
    new Button(this, W / 2, H - 46, returnTo === 'ClassSelect' ? 'Back' : 'Back to the run', () => this.scene.start(returnTo), { width: 200, height: 40, fontSize: '14px' });
  }
}

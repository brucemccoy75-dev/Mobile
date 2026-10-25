import Phaser from 'phaser';
import { questProgress, questReady, type Quest } from '@core/quest';
import { getSession, persistRun, turnInQuest, type RunSession } from '@game/session';
import { Button } from '@game/ui/Button';
import { COLORS, FONT, text } from '@game/ui/theme';

/**
 * Talking to a quest giver. A dialogue panel today; the same scene will carry
 * story beats and lore entries later (the giver's lines live in data/quests.ts).
 */
export class QuestScene extends Phaser.Scene {
  private session!: RunSession;
  private quest!: Quest;

  constructor() { super('Quest'); }

  create(data: { questId: string }) {
    this.session = getSession(this);
    const q = this.session.quests.find((x) => x.id === data.questId);
    if (!q) { this.scene.start('Overworld'); return; }
    this.quest = q;
    const { width: W, height: H } = this.scale.gameSize;
    this.cameras.main.setBackgroundColor(0x0b0f1a);

    // Giver portrait placeholder + name
    this.add.rectangle(W * 0.18, H * 0.42, 110, 150, 0x7a5c3a).setStrokeStyle(3, COLORS.goldHex);
    this.add.text(W * 0.18, H * 0.42 + 92, q.giver.name, { ...text.h2, fontSize: '18px' }).setOrigin(0.5);
    this.add.text(W * 0.18, H * 0.42 + 114, q.giver.title, text.small).setOrigin(0.5);

    const kindLabel = { fetch: 'FETCH', hunt: 'HUNT', escort: 'ESCORT' }[q.kind];
    this.add.text(W * 0.36, 48, `${kindLabel} · ${q.kind === 'fetch' ? 'bring an item' : q.kind === 'hunt' ? 'slay' : 'bring someone home'}`, { fontFamily: FONT, fontSize: '12px', color: '#9aa3b8', fontStyle: 'bold' }).setOrigin(0, 0.5);

    const ready = questReady(q, this.session.deck, this.session.equipment);
    const line = q.status === 'offered' ? q.giver.intro : q.status === 'done' ? 'Safe travels.' : q.status === 'declined' ? q.giver.decline : ready ? q.giver.complete : `${q.giver.progress}\n\n${questProgress(q, this.session.deck, this.session.equipment)}`;
    const box = this.add.rectangle(W * 0.36 + (W * 0.58) / 2, H * 0.42, W * 0.58, 190, COLORS.panel).setStrokeStyle(2, COLORS.panelEdge);
    void box;
    this.add.text(W * 0.36 + 18, H * 0.42 - 80, `“${line}”`, { ...text.body, fontSize: '17px', wordWrap: { width: W * 0.58 - 36 }, lineSpacing: 4 }).setOrigin(0, 0);

    const rewardText = q.fetch
      ? `Reward: ${q.reward.gold} gold, and your ${q.fetch.name} returns as a +1 version. You keep neither the original nor the choice.`
      : `Reward: ${q.reward.gold} gold${q.reward.offer ? ' and a pick of spoils' : ''}.${q.escort ? ' The wilds stir more while someone follows you.' : ''}`;
    this.add.text(W * 0.36, H * 0.42 + 112, rewardText, { ...text.small, fontSize: '13px', color: COLORS.gold, wordWrap: { width: W * 0.58 } }).setOrigin(0, 0);

    const leave = () => void persistRun(this).then(() => this.scene.start('Overworld'));
    if (q.status === 'offered') {
      new Button(this, W / 2 - 110, H - 46, 'Accept', () => { q.status = 'active'; leave(); }, { width: 180, fill: 0x1f2a44, edge: COLORS.goldHex });
      new Button(this, W / 2 + 110, H - 46, 'Not now', () => { q.status = 'declined'; leave(); }, { width: 180 });
    } else if (q.status === 'active' && ready) {
      new Button(this, W / 2, H - 46, 'Hand it in', () => this.turnIn(), { width: 220, fill: 0x1f2a44, edge: COLORS.goldHex });
    } else if (q.status === 'declined') {
      new Button(this, W / 2 - 110, H - 46, 'Changed my mind', () => { q.status = 'active'; leave(); }, { width: 200, fill: 0x1f2a44, edge: COLORS.goldHex });
      new Button(this, W / 2 + 110, H - 46, 'Leave', leave, { width: 160 });
    } else {
      new Button(this, W / 2, H - 46, 'Leave', leave, { width: 180 });
    }
  }

  private turnIn() {
    const r = turnInQuest(this.session, this.quest);
    if (r.offer) this.session.pendingOffer = { source: r.offer, gold: 0 };
    void persistRun(this).then(() => this.scene.start(r.offer ? 'Reward' : 'Overworld'));
  }
}

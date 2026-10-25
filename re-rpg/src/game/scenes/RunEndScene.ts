import Phaser from 'phaser';
import { getItem, getSkill, ITEMS, SKILLS } from '@data/index';
import { HEIRLOOM_DEATHS, HEIRLOOM_OFFER, HEIRLOOM_PICKS, classUnlocked } from '@core/meta';
import { getMeta, peekSession, setSession } from '@game/session';
import { Button } from '@game/ui/Button';
import { COLORS, text } from '@game/ui/theme';

export interface RunEndData { won: boolean; killedBy?: string; }

/** The death / victory beat: what you discovered and what it unlocks next time. */
export class RunEndScene extends Phaser.Scene {
  constructor() { super('RunEnd'); }

  create(data: RunEndData) {
    const s = peekSession(this);
    const meta = getMeta(this);
    const { width: W, height: H } = this.scale.gameSize;
    this.cameras.main.setBackgroundColor(0x0b0f1a);

    this.add.text(W / 2, 48, data.won ? 'Victory' : 'You died', { ...text.title, color: data.won ? COLORS.gold : '#ff6b6b' }).setOrigin(0.5);
    const where = s ? `screen ${s.screenIndex + 1}, ${s.encountersWon} fights won, ${s.gold} gold` : '';
    this.add.text(W / 2, 96, data.won ? `Both screens cleared. ${where}.` : `Slain by ${data.killedBy ?? 'the wilds'} on ${where}.`, text.body).setOrigin(0.5);
    if (s) this.add.text(W / 2, 120, `seed ${s.seed}`, text.mono).setOrigin(0.5);

    const names = (s?.newDiscoveries ?? []).map((id) => SKILLS.some((k) => k.id === id) ? `${getSkill(id).name} (tome)` : `${getItem(id).name} (${getItem(id).slot})`);
    this.add.text(W / 2, 160, names.length ? 'New discoveries this run' : 'Nothing new discovered this run', { ...text.h2, fontSize: '18px', color: names.length ? COLORS.gold : COLORS.muted }).setOrigin(0.5);
    this.add.text(W / 2, 188, names.join('   ·   ') || 'Find tomes and gear to grow the loot pool for next time.', { ...text.body, wordWrap: { width: W - 120 }, align: 'center' }).setOrigin(0.5, 0);

    if (data.won) {
      const lines = ['Legacy point earned: +1 Attack, +1 Defence or +5 Max HP, chosen at the start of your next run. Permanent.'];
      if (s?.classId === 'warrior' && (meta.winsByClass.warrior ?? 0) === 1 && classUnlocked(meta, 'wizard')) lines.unshift('Wizard and Shaman unlocked');
      this.add.text(W / 2, H * 0.5 + 4, lines.join('\n'), { ...text.h2, fontSize: '18px', color: COLORS.gold, align: 'center', lineSpacing: 6, wordWrap: { width: W - 160 } }).setOrigin(0.5);
    }
    const poolSkills = meta.discoveredSkills.length, poolItems = meta.discoveredItems.length;
    const maxSkills = SKILLS.filter((k) => k.rarity !== 'basic').length, maxItems = ITEMS.length;
    const lines = [
      `Loot pool: ${poolSkills}/${maxSkills} tomes, ${poolItems}/${maxItems} items discovered`,
      `Deaths ${meta.deaths}  ·  Wins ${meta.wins}  ·  Best screen ${meta.bestScreen}`,
      meta.deaths >= HEIRLOOM_DEATHS
        ? `Heirlooms active: each run opens with ${HEIRLOOM_OFFER} random unlocks, keep ${HEIRLOOM_PICKS}.`
        : `Heirlooms unlock after ${HEIRLOOM_DEATHS} death: start each run with ${HEIRLOOM_PICKS} of your unlocks.`,
    ];
    this.add.text(W / 2, H - 150, lines.join('\n'), { ...text.small, fontSize: '14px', align: 'center', lineSpacing: 6 }).setOrigin(0.5);

    new Button(this, W / 2, H - 50, data.won ? 'Back to title' : 'Try again', () => {
      setSession(this, null);
      this.scene.start(data.won ? 'Title' : 'ClassSelect');
    }, { width: 220, fill: 0x1f2a44, edge: COLORS.goldHex });
  }
}

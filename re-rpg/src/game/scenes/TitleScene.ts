import Phaser from 'phaser';
import { RUN_VERSION } from '@core/run';
import { createMeta } from '@core/meta';
import { APP_VERSION } from '@game/version';
import { deserialize, getMeta, getStore, setMeta, setSession } from '@game/session';
import { Button } from '@game/ui/Button';
import { COLORS, text } from '@game/ui/theme';

export class TitleScene extends Phaser.Scene {
  constructor() { super('Title'); }

  create() {
    const { width, height } = this.scale.gameSize;
    const cx = width / 2;
    const meta = getMeta(this);

    this.add.text(cx, height * 0.3, 'Re-RPG', { ...text.title, fontSize: '64px' }).setOrigin(0.5);
    this.add.text(cx, height * 0.3 + 52, 'a roguelike for your pocket', { ...text.body, fontSize: '20px', color: COLORS.muted }).setOrigin(0.5);
    this.add.text(cx, height * 0.3 + 84, `deaths ${meta.deaths}  ·  wins ${meta.wins}  ·  discovered ${meta.discoveredSkills.length + meta.discoveredItems.length}`, text.small).setOrigin(0.5);

    const newRun = new Button(this, cx, height * 0.66, 'New run', () => this.scene.start('ClassSelect'), { width: 220, fill: 0x1f2a44, edge: COLORS.goldHex });
    void newRun;

    void getStore(this).loadRun().then((run) => {
      if (!run || run.version !== RUN_VERSION) return;
      newRun.y = height * 0.66 + 62;
      new Button(this, cx, height * 0.66, `Continue  (${run.classId}, screen ${run.screenIndex + 1})`, () => {
        setSession(this, deserialize(run));
        this.scene.start('Overworld');
      }, { width: 320, fill: 0x1f2a44, edge: COLORS.goldHex });
    });

    this.add.text(12, height - 12, `v${APP_VERSION}  ${width}x${height}`, text.mono).setOrigin(0, 1);
    new Button(this, width - 80, height - 24, 'wipe save', async () => {
      await getStore(this).clearRun();
      const fresh = createMeta();
      setMeta(this, fresh);
      await getStore(this).saveMeta(fresh);
      this.scene.restart();
    }, { width: 120, height: 28, fontSize: '12px' }).setAlpha(0.5);
  }
}

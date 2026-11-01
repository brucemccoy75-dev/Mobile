import Phaser from 'phaser';
import { RUN_VERSION } from '@core/run';
import { createMeta } from '@core/meta';
import { APP_VERSION, BUILD } from '@game/version';
import { SCREEN_COUNT, createDemo, createLevelTest, deserialize, getMeta, getStore, holdMeta, restoreMeta, setMeta, setSession } from '@game/session';
import { legacySummary } from '@core/meta';
import { Button } from '@game/ui/Button';
import { ART_STYLE_LABEL, getArtStyle, nextArtStyle, setArtStyle } from '@game/art';
import { shareRunLog } from '@game/telemetry';
import { devMode } from '@game/scenes/OverworldScene';
import type { FirebaseCloud } from '@save/firebase';
import type { SyncedSaveStore } from '@save/SyncedSaveStore';
import type { MetaState } from '@core/meta';
import type { RunState } from '@core/run';
import { COLORS, text } from '@game/ui/theme';
import { tutorialDone } from '@core/tutorial';
import { startTraining } from '@game/tutorial';

export class TitleScene extends Phaser.Scene {
  constructor() { super('Title'); }

  /** Cloud status + "Link Google" when running on Firebase; a quiet note otherwise. */
  private cloudLine(cx: number, y: number) {
    const cloud = this.registry.get('cloud') as FirebaseCloud<MetaState, RunState> | null;
    if (!cloud) { this.add.text(cx, y, 'local save only · cloud not configured', text.mono).setOrigin(0.5, 1); return; }
    const label = this.add.text(cx - 90, y, '', text.mono).setOrigin(1, 1);
    const render = (a = cloud.account()) => label.setText(a ? (a.anonymous ? 'cloud: anonymous device' : `cloud: ${a.displayName ?? 'linked'}`) : 'cloud: signed out');
    render();
    cloud.onAccountChange((a) => render(a));
    if (cloud.account()?.anonymous !== false) {
      const btn = new Button(this, cx + 10, y - 14, 'Link Google account', async () => {
        try {
          await cloud.linkGoogle();
          (getStore(this) as SyncedSaveStore<MetaState, RunState>).invalidate();
          await getStore(this).loadMeta().then((m) => m && setMeta(this, m));
          this.scene.restart();
        } catch (e) { label.setText(`link failed: ${(e as Error).message}`); }
      }, { width: 190, height: 28, fontSize: '12px' });
      btn.setAlpha(0.8);
    }
  }

  create() {
    const { width, height } = this.scale.gameSize;
    const cx = width / 2;
    restoreMeta(this); // back from a level-select run: the real meta again (DECISIONS #76)
    const meta = getMeta(this);

    const record = `deaths ${meta.deaths}  ·  wins ${meta.wins}  ·  discovered ${meta.discoveredSkills.length + meta.discoveredItems.length}${legacySummary(meta) ? `  ·  legacy ${legacySummary(meta)}` : ''}`;
    if (this.textures.exists('title')) {
      // Key art (DECISIONS #74): the logo is in the picture. Cover the screen, centred, so any phone
      // shape crops only the sides; a dark band along the bottom keeps the small buttons readable.
      const art = this.add.image(cx, height / 2, 'title');
      art.setScale(Math.max(width / art.width, height / art.height));
      const band = this.add.graphics();
      band.fillGradientStyle(0x0b0f1a, 0x0b0f1a, 0x0b0f1a, 0x0b0f1a, 0, 0, 0.85, 0.85);
      band.fillRect(0, height - 110, width, 110);
      this.add.text(cx, height * 0.36, record, { ...text.small, color: '#f1e6cc', backgroundColor: '#0b0f1acc', padding: { x: 10, y: 4 } }).setOrigin(0.5);
    } else {
      this.add.text(cx, height * 0.3, 'Re-RPG', { ...text.title, fontSize: '64px' }).setOrigin(0.5);
      this.add.text(cx, height * 0.3 + 52, 'a roguelike for your pocket', { ...text.body, fontSize: '20px', color: COLORS.muted }).setOrigin(0.5);
      this.add.text(cx, height * 0.3 + 84, record, text.small).setOrigin(0.5);
    }

    // A new player's first New run is the training run (DECISIONS #96); its Skip leads on to class select.
    const newRun = new Button(this, cx, height * 0.66, 'New run', () => (tutorialDone(getMeta(this)) ? this.scene.start('ClassSelect') : startTraining(this)), { width: 220, fill: 0x1f2a44, edge: COLORS.goldHex });
    void newRun;

    void getStore(this).loadRun().then((run) => {
      if (!run || run.version !== RUN_VERSION) return;
      newRun.y = height * 0.66 + 62;
      new Button(this, cx, height * 0.66, `Continue  (${run.classId}, screen ${run.screenIndex + 1})`, () => {
        setSession(this, deserialize(run, getMeta(this)));
        this.scene.start('Overworld');
      }, { width: 320, fill: 0x1f2a44, edge: COLORS.goldHex });
    });

    this.add.text(12, height - 12, `v${APP_VERSION} · build ${BUILD}  ${width}x${height}`, text.mono).setOrigin(0, 1);
    this.cloudLine(cx, height - 16);
    // The player's row (DECISIONS #95): demo mode, the run log, wipe save, fullscreen.
    new Button(this, width - 104, height - 60, 'Demo mode', () => this.levelSelect(), { width: 176, height: 36, fontSize: '15px', fill: 0x1f2a44, edge: COLORS.goldHex });
    new Button(this, width - 440, height - 60, 'Tutorial', () => this.startTraining(), { width: 130, height: 30, fontSize: '13px' }).setAlpha(0.85);
    const logBtn = new Button(this, width - 290, height - 60, 'export run log', () => void shareRunLog(this).then((m) => { logBtn.label.setText(m); logBtn.bg.width = Math.max(150, logBtn.label.width + 24); }), { width: 150, height: 30, fontSize: '12px' }).setAlpha(0.8);
    // Wiping asks for a second tap: it is one of only three buttons now.
    let armed = false;
    const wipe = new Button(this, width - 80, height - 22, 'wipe save', async () => {
      if (!armed) { armed = true; wipe.label.setText('tap again to wipe'); wipe.bg.width = 150; this.time.delayedCall(3000, () => { armed = false; wipe.label.setText('wipe save'); wipe.bg.width = 110; }); return; }
      await getStore(this).clearRun();
      const fresh = createMeta();
      setMeta(this, fresh);
      await getStore(this).saveMeta(fresh);
      this.scene.restart();
    }, { width: 110, height: 28, fontSize: '12px' }).setAlpha(0.6);
    // Re-enter fullscreen after the browser's back gesture dropped it.
    new Button(this, width - 216, height - 22, 'fullscreen', () => {
      try { if (this.scale.fullscreen.available) this.scale.isFullscreen ? this.scale.stopFullscreen() : this.scale.startFullscreen(); } catch { /* ignore */ }
    }, { width: 100, height: 28, fontSize: '12px' }).setAlpha(0.5);
    // Designer tools only with `?dev` (or localStorage rerpg:dev = 1): Test Mode, the two editors, the art switch.
    if (devMode()) {
      const dev = { width: 110, height: 26, fontSize: '11px' };
      new Button(this, 70, 30, 'test mode', () => this.scene.start('TestMode'), dev).setAlpha(0.7);
      new Button(this, 190, 30, 'card editor', () => { window.location.href = './editor.html'; }, dev).setAlpha(0.7);
      new Button(this, 70, 60, 'world editor', () => { window.location.href = './world.html'; }, dev).setAlpha(0.7);
      const artBtn = new Button(this, 190, 60, `art ${ART_STYLE_LABEL[getArtStyle()]}`, () => {
        setArtStyle(nextArtStyle(getArtStyle()));
        artBtn.label.setText(`art ${ART_STYLE_LABEL[getArtStyle()]}`);
      }, dev).setAlpha(0.6);
    }
  }

  /** Demo mode (DECISIONS #93; was level select, #76): pick a screen, play it with a hand of Doom, off the record. */
  private levelSelect() {
    const { width, height } = this.scale.gameSize;
    const cx = width / 2, cy = height / 2;
    const parts: Phaser.GameObjects.GameObject[] = [];
    const close = () => parts.forEach((p) => p.destroy());
    parts.push(this.add.rectangle(cx, cy, width, height, 0x0b0f1a, 0.94).setInteractive().setDepth(200));
    parts.push(this.add.text(cx, cy - 92, 'Demo mode', { ...text.title, fontSize: '30px' }).setOrigin(0.5).setDepth(201));
    parts.push(this.add.text(cx, cy - 58, 'Your hand is Doom: every play kills every enemy. Not saved, logged or counted.', { ...text.small, color: COLORS.muted }).setOrigin(0.5).setDepth(201));
    const names = ['Screen 1 · Gate Road', 'Screen 2 · Frozen Pass'];
    for (let i = 0; i < SCREEN_COUNT; i++) {
      const x = cx + (i - (SCREEN_COUNT - 1) / 2) * 260;
      parts.push(new Button(this, x, cy + 4, names[i] ?? `Screen ${i + 1}`, () => this.startDemo(i), { width: 240, fill: 0x1f2a44, edge: COLORS.goldHex }).setDepth(202));
    }
    parts.push(new Button(this, cx, cy + 120, 'Cancel', close, { width: 140, height: 40, fontSize: '14px' }).setDepth(202));
  }

  /** A demo run on screen `index` (DECISIONS #93): straight to the map, no heirlooms. */
  startDemo(index: number) {
    setSession(this, createDemo('warrior', holdMeta(this), index));
    this.scene.start('Overworld');
  }

  /** Replay the training run (DECISIONS #96), from the title's Tutorial button or a script. */
  startTraining() { startTraining(this); }

  /** A plain level-select run on screen `index` (#76): no button any more, but scripts and tests use it. */
  startLevel(index: number) {
    const s = createLevelTest('warrior', holdMeta(this), index);
    setSession(this, s);
    this.scene.start(s.heirloomChoices.length > 0 ? 'Heirloom' : 'Overworld');
  }
}

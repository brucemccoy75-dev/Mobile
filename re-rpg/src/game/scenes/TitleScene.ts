import Phaser from 'phaser';
import { RUN_VERSION } from '@core/run';
import { createMeta } from '@core/meta';
import { APP_VERSION } from '@game/version';
import { deserialize, getMeta, getStore, setMeta, setSession } from '@game/session';
import { legacySummary } from '@core/meta';
import { Button } from '@game/ui/Button';
import { ART_STYLE_LABEL, getArtStyle, nextArtStyle, setArtStyle } from '@game/art';
import { MAP_MODE_LABEL, getMapMode, setMapMode } from '@game/mapmode';
import { shareRunLog } from '@game/telemetry';
import type { FirebaseCloud } from '@save/firebase';
import type { SyncedSaveStore } from '@save/SyncedSaveStore';
import type { MetaState } from '@core/meta';
import type { RunState } from '@core/run';
import { COLORS, text } from '@game/ui/theme';

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
    const meta = getMeta(this);

    this.add.text(cx, height * 0.3, 'Re-RPG', { ...text.title, fontSize: '64px' }).setOrigin(0.5);
    this.add.text(cx, height * 0.3 + 52, 'a roguelike for your pocket', { ...text.body, fontSize: '20px', color: COLORS.muted }).setOrigin(0.5);
    this.add.text(cx, height * 0.3 + 84, `deaths ${meta.deaths}  ·  wins ${meta.wins}  ·  discovered ${meta.discoveredSkills.length + meta.discoveredItems.length}${legacySummary(meta) ? `  ·  legacy ${legacySummary(meta)}` : ''}`, text.small).setOrigin(0.5);

    const newRun = new Button(this, cx, height * 0.66, 'New run', () => this.scene.start('ClassSelect'), { width: 220, fill: 0x1f2a44, edge: COLORS.goldHex });
    void newRun;

    void getStore(this).loadRun().then((run) => {
      if (!run || run.version !== RUN_VERSION) return;
      newRun.y = height * 0.66 + 62;
      new Button(this, cx, height * 0.66, `Continue  (${run.classId}, screen ${run.screenIndex + 1})`, () => {
        setSession(this, deserialize(run, getMeta(this)));
        this.scene.start('Overworld');
      }, { width: 320, fill: 0x1f2a44, edge: COLORS.goldHex });
    });

    this.add.text(12, height - 12, `v${APP_VERSION}  ${width}x${height}`, text.mono).setOrigin(0, 1);
    this.cloudLine(cx, height - 16);
    // Re-enter fullscreen after the browser's back gesture dropped it.
    new Button(this, width - 170, height - 24, 'fullscreen', () => {
      try { if (this.scale.fullscreen.available) this.scale.isFullscreen ? this.scale.stopFullscreen() : this.scale.startFullscreen(); } catch { /* ignore */ }
    }, { width: 100, height: 28, fontSize: '12px' }).setAlpha(0.5);
    // Dev row: sandbox fights and the run log export (DECISIONS #26).
    new Button(this, width - 80, height - 58, 'test mode', () => this.scene.start('TestMode'), { width: 120, height: 28, fontSize: '12px' }).setAlpha(0.7);
    const logBtn = new Button(this, width - 210, height - 58, 'run log', () => void shareRunLog(this).then((m) => { logBtn.label.setText(m); logBtn.bg.width = Math.max(120, logBtn.label.width + 24); }), { width: 120, height: 28, fontSize: '12px' }).setAlpha(0.7);
    // Art style A/B switch (docs/ART.md): C is the chosen look, A stays for comparison.
    const artBtn = new Button(this, width - 290, height - 24, `art ${ART_STYLE_LABEL[getArtStyle()]}`, () => {
      setArtStyle(nextArtStyle(getArtStyle()));
      artBtn.label.setText(`art ${ART_STYLE_LABEL[getArtStyle()]}`);
    }, { width: 120, height: 28, fontSize: '12px' }).setAlpha(0.5);
    // Map mode (DECISIONS #34): authored lanes are the game; the generator stays one tap away.
    const mapBtn = new Button(this, width - 420, height - 24, `map ${MAP_MODE_LABEL[getMapMode()]}`, () => {
      setMapMode(getMapMode() === 'authored' ? 'procedural' : 'authored');
      mapBtn.label.setText(`map ${MAP_MODE_LABEL[getMapMode()]}`);
    }, { width: 130, height: 28, fontSize: '12px' }).setAlpha(0.5);
    new Button(this, width - 80, height - 24, 'wipe save', async () => {
      await getStore(this).clearRun();
      const fresh = createMeta();
      setMeta(this, fresh);
      await getStore(this).saveMeta(fresh);
      this.scene.restart();
    }, { width: 100, height: 28, fontSize: '12px' }).setAlpha(0.5);
  }
}

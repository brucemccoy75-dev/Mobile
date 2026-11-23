// The 3D table: felt, rail, figures, cards and chips, animated from table events.
import * as THREE from 'three';
import { type Card } from '../engine/cards';
import { type Hand } from '../engine/hand';
import { HUMAN_SEAT, type Presenter, type TableEvent } from '../game/table';
import { type Overlay } from '../ui/overlay';
import { CardMesh } from './cards';
import { ChipStack } from './chips';
import { Director, TABLE_VIEW, closeUpOf, seatPose } from './director';
import { STAGE_H, STAGE_W, type Stage } from '../ui/stage';
import { type Expression, Figure } from './figures';
import * as L from './layout';
import { TableAudio } from './audio';
import { DEALER_NAME } from '../bots/characters';
import { mulberry32 } from '../engine/rng';
import { Tweens, easeInOutCubic, easeOutCubic, linear } from './tween';
import { money } from '../ui/format';

export class TableScene implements Presenter {
  readonly renderer: THREE.WebGLRenderer;
  readonly scene = new THREE.Scene();
  readonly camera: THREE.PerspectiveCamera;
  readonly director: Director;
  readonly tweens = new Tweens();
  readonly audio = new TableAudio();
  private readonly container: HTMLElement;
  private readonly overlay: Overlay;
  private figures = new Map<number, Figure>();
  private dealerFigure: Figure | null = null;
  private hole = new Map<number, CardMesh[]>();
  private board: CardMesh[] = [];
  private bets = new Map<number, ChipStack>();
  private betAmounts = new Map<number, number>();
  private pot = new ChipStack();
  private button: THREE.Mesh;
  private hand: Hand | null = null;
  private out = new Set<number>();
  private finishes = new Map<number, number>();
  private moodBase = new Map<number, Expression>();
  private lastFrame = 0;
  private readonly stage: Stage;
  private seatNames = new Map<number, string>();
  private levelChanged = false;
  private puffTexture: THREE.CanvasTexture | null = null;
  private pendingResult: (() => Promise<void>) | null = null;
  /** Where a plate hangs on a standee, in the figure's own units: just above where the portrait fades out. */
  private readonly plateLocal = new THREE.Vector3(0, 0.5, 0.02);
  private shownHands = new Map<number, { cards: Card[]; description: string }>();
  private payouts = new Map<number, number>();
  /** The picture-in-picture camera and what it is looking at. */
  private readonly pipCamera = new THREE.PerspectiveCamera(34, 1.5, 0.1, 60);
  private pip: { seat: number; token: number } | null = null;
  private pipEl: HTMLElement | null = null;
  private pipToken = 0;

  constructor(container: HTMLElement, overlay: Overlay, stage: Stage) {
    this.stage = stage;
    this.container = container;
    this.overlay = overlay;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    container.appendChild(this.renderer.domElement);

    this.scene.background = new THREE.Color(0x07100b);
    this.scene.fog = new THREE.Fog(0x07100b, 14, 30);
    this.camera = new THREE.PerspectiveCamera(40, 1, 0.1, 60);
    this.director = new Director(this.camera);

    this.buildRoom();
    this.buildTable();
    this.button = this.buildButton();
    this.scene.add(this.pot.group);
    this.pot.group.position.copy(L.POT_POS);

    stage.onFit = () => this.resize();
    this.resize();
    this.renderer.setAnimationLoop((t) => this.frame(t));
  }

  setSpeed(fn: () => number): void {
    this.tweens.speed = fn;
  }

  /** The HTML frame the inset renders into, with its name and caption elements. */
  attachInset(el: HTMLElement): void {
    this.pipEl = el;
  }

  /** Lays the half-dark backing around the close-up so the panel reads as one surface. */
  private layoutBacking(): void {
    const el = this.pipEl;
    if (!el) return;
    const p = this.stage.toStage(el.getBoundingClientRect());
    const f = this.stage.toStage((el.querySelector('.frame') as HTMLElement).getBoundingClientRect());
    const set = (cls: string, top: number, bottom: number, left: number, right: number) => {
      const b = el.querySelector(`.backing.${cls}`) as HTMLElement;
      b.style.top = `${top}px`;
      b.style.bottom = `${bottom}px`;
      b.style.left = `${left}px`;
      b.style.right = `${right}px`;
    };
    set('top', 0, p.height - (f.top - p.top), 0, 0);
    set('bottom', f.bottom - p.top, 0, 0, 0);
    set('left', f.top - p.top, p.height - (f.bottom - p.top), 0, p.width - (f.left - p.left));
    set('right', f.top - p.top, p.height - (f.bottom - p.top), f.right - p.left, 0);
  }

  /** Shows a close-up of a seat (or the dealer, -1) in the inset for a while. */
  showInset(seat: number, ms: number, name: string, caption: string): number {
    const token = ++this.pipToken;
    const wasShowing = this.pip !== null;
    const changed = !this.pip || this.pip.seat !== seat;
    this.pip = { seat, token };
    const el = this.pipEl;
    if (el) {
      const fill = () => {
        el.querySelector('.who')!.textContent = name;
        const cap = el.querySelector('.caption') as HTMLElement;
        cap.textContent = caption;
        cap.classList.toggle('show', caption.length > 0);
        el.classList.remove('swap');
      };
      if (wasShowing && changed) {
        // Crossfade the name and caption when the panel passes from one speaker to the next.
        el.classList.add('swap');
        window.setTimeout(() => {
          if (this.pipToken === token) fill();
        }, 180);
      } else fill();
      el.classList.add('show');
      this.layoutBacking();
    }
    this.overlay.setSpeaking(seat, true);
    // Layout position, not the bounding box: the panel is mid-slide when it opens.
    if (el) this.overlay.panelLeft = el.offsetLeft;
    window.setTimeout(() => {
      if (this.pipToken === token) this.hideInset();
    }, ms);
    return token;
  }

  hideInset(): void {
    if (this.pip) this.overlay.setSpeaking(this.pip.seat, false);
    this.pip = null;
    this.pipEl?.classList.remove('show');
    this.overlay.panelLeft = null;
  }

  private renderInset(): void {
    const el = this.pipEl;
    if (!this.pip || !el) return;
    const frame = el.querySelector('.frame') as HTMLElement;
    const r = this.stage.toStage(frame.getBoundingClientRect());
    const c = this.stage.toStage(this.renderer.domElement.getBoundingClientRect());
    // Viewport and scissor take the canvas's CSS pixels, which are stage units.
    const x = Math.round(r.left - c.left);
    const y = Math.round(c.bottom - r.bottom);
    const w = Math.round(r.width);
    const h = Math.round(r.height);
    if (w <= 0 || h <= 0) return;
    const fig0 = this.figures.get(this.pip.seat);
    let pose = this.pip.seat === -1 ? closeUpOf(L.DEALER_POS) : seatPose(this.pip.seat);
    if (fig0?.portrait) {
      // A flat portrait standee reads best from closer in, squarely from the front.
      const f = fig0.group.position;
      const k = fig0.group.scale.x;
      const toCentre = new THREE.Vector3(-f.x, 0, -f.z).normalize();
      pose = { pos: f.clone().add(toCentre.multiplyScalar(1.75 * k)).setY(1.4 * k), look: new THREE.Vector3(f.x, 1.22 * k, f.z) };
    }
    this.pipCamera.aspect = r.width / r.height;
    this.pipCamera.updateProjectionMatrix();
    this.pipCamera.position.copy(pose.pos);
    this.pipCamera.lookAt(pose.look);
    // A folded speaker is faded at the table but shown in full inside the inset.
    const fig = this.pip.seat === -1 ? this.dealerFigure : this.figures.get(this.pip.seat);
    const wasFolded = fig?.folded ?? false;
    if (fig && wasFolded) fig.setFolded(false);
    fig?.faceCamera(this.pipCamera.position);
    this.renderer.setScissorTest(true);
    this.renderer.setViewport(x, y, w, h);
    this.renderer.setScissor(x, y, w, h);
    this.renderer.render(this.scene, this.pipCamera);
    this.renderer.setScissorTest(false);
    if (fig && wasFolded) fig.setFolded(true);
    fig?.faceCamera(this.camera.position);
    const size = this.renderer.getSize(new THREE.Vector2());
    this.renderer.setViewport(0, 0, size.x, size.y);
  }

  // ---- building ----------------------------------------------------------------------------------

  /** The two looks: Dave's room (a photo backdrop, daylight) and the dark room with a lamp. */
  private darkSet: THREE.Object3D[] = [];
  private brightSet: THREE.Object3D[] = [];
  private roomOn = false;

  setRoom(on: boolean): void {
    this.roomOn = on;
    for (const o of this.darkSet) o.visible = !on;
    for (const o of this.brightSet) o.visible = on;
    if (on) {
      // A bright room: warm off-white walls, the oak floor fading into them with distance.
      this.scene.background = new THREE.Color(0x6e665b);
      this.scene.fog = new THREE.Fog(0x6e665b, 16, 32);
      this.renderer.toneMappingExposure = 0.92;
    } else {
      this.scene.background = new THREE.Color(0x07100b);
      this.scene.fog = new THREE.Fog(0x07100b, 18, 36);
      this.renderer.toneMappingExposure = 1.05;
    }
  }

  /** Wide light-oak planks, drawn once: plank tones vary, seams are thin, grain is faint. */
  private plankTexture(): THREE.CanvasTexture {
    const c = document.createElement('canvas');
    c.width = c.height = 1024;
    const g = c.getContext('2d')!;
    const planks = 6;
    const w = c.width / planks;
    const rng = mulberry32(7);
    for (let i = 0; i < planks; i++) {
      // Each plank is a column; a stagger line across it breaks the run.
      const tone = 0.9 + rng() * 0.18;
      const base = `rgb(${Math.round(172 * tone)}, ${Math.round(138 * tone)}, ${Math.round(92 * tone)})`;
      g.fillStyle = base;
      g.fillRect(i * w, 0, w, c.height);
      // Grain: long faint streaks.
      for (let k = 0; k < 26; k++) {
        const x = i * w + rng() * w;
        g.strokeStyle = `rgba(120, 85, 45, ${0.05 + rng() * 0.08})`;
        g.lineWidth = 1 + rng() * 2;
        g.beginPath();
        g.moveTo(x, 0);
        g.bezierCurveTo(x + (rng() - 0.5) * 18, c.height * 0.33, x + (rng() - 0.5) * 18, c.height * 0.66, x + (rng() - 0.5) * 10, c.height);
        g.stroke();
      }
      // The seam and a butt joint somewhere along the plank.
      g.fillStyle = 'rgba(90, 62, 35, .55)';
      g.fillRect(i * w, 0, 2, c.height);
      const joint = rng() * c.height;
      g.fillRect(i * w, joint, w, 2);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.anisotropy = 8;
    return tex;
  }

  private buildRoom(): void {
    const hemi = new THREE.HemisphereLight(0xcfd8d2, 0x1a2a20, 0.35);
    this.scene.add(hemi);
    this.darkSet.push(hemi);
    const key = new THREE.SpotLight(0xfff1dc, 260, 30, 0.62, 0.55, 1.6);
    key.position.set(0.5, 9.5, 1.5);
    key.target.position.set(0, 0, 0);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.bias = -0.0004;
    key.shadow.radius = 4;
    this.scene.add(key, key.target);
    this.darkSet.push(key);
    const fill = new THREE.DirectionalLight(0xbfd4ff, 0.5);
    fill.position.set(-6, 6, 8);
    this.scene.add(fill);
    this.darkSet.push(fill);
    const rim = new THREE.DirectionalLight(0xffd9a8, 0.55);
    rim.position.set(0, 4, -10);
    this.scene.add(rim);
    this.darkSet.push(rim);
    // Soft light from your side of the table so faces read from the front.
    const front = new THREE.DirectionalLight(0xfff2e0, 0.75);
    front.position.set(0, 3.5, 9);
    this.scene.add(front);

    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(22, 48),
      new THREE.MeshStandardMaterial({ color: 0x2a1c16, roughness: 0.95 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.2;
    floor.receiveShadow = true;
    this.scene.add(floor);
    this.darkSet.push(floor);

    // Dave's room: daylight from the windows on the right, a soft sky, and a floor that only
    // catches the table's shadow so the photo's planks show through.
    const sky = new THREE.HemisphereLight(0xfff6ea, 0x8c7352, 0.5);
    this.scene.add(sky);
    const sun = new THREE.DirectionalLight(0xffe9cc, 1.15);
    sun.position.set(7, 9, 4);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.bias = -0.0004;
    sun.shadow.camera.left = sun.shadow.camera.bottom = -8;
    sun.shadow.camera.right = sun.shadow.camera.top = 8;
    this.scene.add(sun, sun.target);
    const bounce = new THREE.DirectionalLight(0xfff0dc, 0.35);
    bounce.position.set(-5, 3, 8);
    this.scene.add(bounce);
    const planks = this.plankTexture();
    planks.repeat.set(9, 9);
    const oak = new THREE.Mesh(new THREE.PlaneGeometry(48, 48), new THREE.MeshStandardMaterial({ map: planks, roughness: 0.88, metalness: 0 }));
    oak.rotation.x = -Math.PI / 2;
    oak.position.y = -1.2;
    oak.receiveShadow = true;
    this.scene.add(oak);
    this.brightSet.push(sky, sun, bounce, oak);
    for (const o of this.brightSet) o.visible = false;
  }

  private buildTable(): void {
    const feltMat = new THREE.MeshStandardMaterial({ color: 0x1d6f3d, roughness: 0.96 });
    const felt = new THREE.Mesh(new THREE.CylinderGeometry(L.FELT_RX, L.FELT_RX, 0.16, 96), feltMat);
    felt.scale.z = L.FELT_RZ / L.FELT_RX;
    felt.position.y = -0.08;
    felt.receiveShadow = true;
    this.scene.add(felt);
    // The dragon printed on the felt: a wide decal just above the cloth, under cards and chips,
    // shaded like the felt so it reads as dyed in rather than stuck on.
    const dragonTex = new THREE.TextureLoader().load(`${import.meta.env.BASE_URL}dragon.webp`);
    dragonTex.colorSpace = THREE.SRGBColorSpace;
    dragonTex.anisotropy = 8;
    const dragon = new THREE.Mesh(
      new THREE.PlaneGeometry(7.4, 7.4 * (864 / 1536)),
      new THREE.MeshStandardMaterial({ map: dragonTex, transparent: true, opacity: 0.55, roughness: 1, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -1 }),
    );
    dragon.rotation.x = -Math.PI / 2;
    dragon.position.set(0, 0.003, -0.1);
    dragon.receiveShadow = true;
    this.scene.add(dragon);

    // A darker betting line, drawn as a thin ring.
    const line = new THREE.Mesh(
      new THREE.RingGeometry(L.FELT_RX * 0.62, L.FELT_RX * 0.63, 96),
      new THREE.MeshStandardMaterial({ color: 0x155a30, roughness: 1 }),
    );
    line.rotation.x = -Math.PI / 2;
    line.scale.y = L.FELT_RZ / L.FELT_RX;
    line.position.y = 0.002;
    this.scene.add(line);

    const railMat = new THREE.MeshStandardMaterial({ color: 0x3a2113, roughness: 0.55, metalness: 0.05 });
    const rail = new THREE.Mesh(new THREE.TorusGeometry(L.FELT_RX + 0.05, 0.3, 18, 120), railMat);
    rail.rotation.x = Math.PI / 2;
    rail.scale.y = (L.FELT_RZ + 0.05) / (L.FELT_RX + 0.05);
    rail.position.y = 0.06;
    rail.castShadow = true;
    rail.receiveShadow = true;
    this.scene.add(rail);

    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(L.FELT_RX + 0.2, L.FELT_RX - 0.4, 1.05, 64),
      new THREE.MeshStandardMaterial({ color: 0x1a110c, roughness: 0.8 }),
    );
    base.scale.z = L.FELT_RZ / L.FELT_RX;
    base.position.y = -0.66;
    base.castShadow = true;
    this.scene.add(base);

    const dealer = new Figure('dealer', true);
    this.dealerFigure = dealer;
    dealer.group.position.copy(L.DEALER_POS);
    dealer.group.position.y = 0.12;
    dealer.group.rotation.y = L.faceCentre(L.DEALER_POS);
    dealer.setScale(1.18 * this.equalise(L.DEALER_POS));
    this.scene.add(dealer.group);
  }

  private buildButton(): THREE.Mesh {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 128;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#f6f1e6';
    ctx.beginPath();
    ctx.arc(64, 64, 62, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1c1c1c';
    ctx.font = 'bold 72px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('D', 64, 68);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    const mat = [
      new THREE.MeshStandardMaterial({ color: 0xe9e2d2 }),
      new THREE.MeshStandardMaterial({ map: tex }),
      new THREE.MeshStandardMaterial({ color: 0xe9e2d2 }),
    ];
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.045, 32), mat);
    mesh.position.copy(L.buttonPos(0));
    mesh.castShadow = true;
    this.scene.add(mesh);
    return mesh;
  }

  /** Scale that makes a figure at `p` the same size on screen as one at the far seat. */
  private equalise(p: THREE.Vector3): number {
    const ref = L.figurePos(2).distanceTo(TABLE_VIEW.pos);
    return (p.distanceTo(TABLE_VIEW.pos) / ref) * 1.3;
  }

  private figureFor(seat: number, id: string): Figure {
    let f = this.figures.get(seat);
    if (f) return f;
    f = new Figure(id);
    const p = L.figurePos(seat);
    f.group.position.copy(p);
    f.group.position.y = 0.05;
    f.group.rotation.y = L.faceCentre(p);
    // Every bust lands the same height on screen: scale with distance from the fixed camera.
    f.setScale(this.equalise(p));
    f.group.visible = seat !== HUMAN_SEAT;
    f.group.userData.seat = seat;
    this.scene.add(f.group);
    this.figures.set(seat, f);
    const stack = new ChipStack();
    stack.group.position.copy(L.betPos(seat));
    this.scene.add(stack.group);
    this.bets.set(seat, stack);
    return f;
  }

  // ---- frame and input ---------------------------------------------------------------------------

  private resize(): void {
    this.layoutBacking();
    this.renderer.setPixelRatio(Math.min(3, window.devicePixelRatio * this.stage.scale));
    this.renderer.setSize(STAGE_W, STAGE_H, true);
    this.camera.aspect = STAGE_W / STAGE_H;
    this.camera.updateProjectionMatrix();
  }

  private frame(t: number): void {
    const dt = this.lastFrame ? Math.min(100, t - this.lastFrame) : 16;
    this.lastFrame = t;
    this.tweens.tick(dt);
    for (const [seat, f] of this.figures) {
      if (!f.group.visible) continue;
      f.tick(t);
      f.faceCamera(this.camera.position);
      // The plate sits tight over the faded foot of the standee, so it draws the clean bottom line.
      if (f.portrait) this.overlay.movePlate(seat, f.group.localToWorld(this.plateLocal.clone()));
    }
    if (this.dealerFigure) {
      this.dealerFigure.faceCamera(this.camera.position);
      if (this.dealerFigure.portrait) this.overlay.movePlate(-1, this.dealerFigure.group.localToWorld(this.plateLocal.clone()));
    }
    this.overlay.update(this.camera, STAGE_W, STAGE_H);
    this.renderer.render(this.scene, this.camera);
    this.renderInset();
  }

  // ---- presenting events -------------------------------------------------------------------------

  async present(ev: TableEvent): Promise<void> {
    switch (ev.type) {
      case 'tournamentStart':
        for (const s of ev.seats) {
          this.figureFor(s.seat, s.id);
          this.seatNames.set(s.seat, s.name);
          this.overlay.plate(s.seat, L.platePos(s.seat), s.name, s.stack, 0);
        }
        this.overlay.dealerPlate(L.DEALER_PLATE_POS, DEALER_NAME, 0);
        this.overlay.setInfo({ level: ev.level, handNumber: 0 });
        return;
      case 'handStart':
        return this.handStart(ev.hand, ev.level);
      case 'post':
        return this.post(ev.seat, ev.amount);
      case 'deal':
        return this.deal(ev.seat, ev.cards);
      case 'turn':
        return this.turn(ev.seat);
      case 'action':
        return this.action(ev.seat, ev.action.type, ev.amount, ev.allIn);
      case 'street':
        return this.street(ev.board);
      case 'showdown':
        return this.showdown(ev.seat, ev.cards, ev.description);
      case 'payout':
        return this.payout(ev.seat, ev.amount, ev.returned);
      case 'handEnd':
        return this.handEnd(ev);
      case 'bust':
        for (const s of ev.seats) {
          this.out.add(s);
          this.finishes.set(s, ev.finishes[s]);
          this.overlay.setOut(s, ev.finishes[s]);
          this.overlay.setPosition(s, '');
          await this.vaporise(s);
        }
        if (this.pendingResult) {
          const show = this.pendingResult;
          this.pendingResult = null;
          await show();
        }
        return;
      case 'level':
        this.levelChanged = true;
        this.overlay.setInfo({ level: ev.level });
        this.overlay.toast(`Blinds up: ${money(ev.level.sb)} / ${money(ev.level.bb)}${ev.level.ante ? ` · ante ${money(ev.level.ante)}` : ''}`);
        return this.tweens.delay(600);
      case 'tournamentEnd':
        return;
    }
  }

  /** Skynet's red laser hits the seat; a puff of smoke; the man is gone. */
  private async vaporise(seat: number): Promise<void> {
    const flash = document.getElementById('flash');
    const fig = this.figures.get(seat);
    const from = L.DEALER_POS.clone().add(new THREE.Vector3(0, 1.22, 0));
    const to = seat === HUMAN_SEAT ? this.camera.position.clone().add(new THREE.Vector3(0, -0.3, 0)) : L.figurePos(seat).add(new THREE.Vector3(0, 0.95, 0));
    this.audio.play('zap');
    // The beam: a bright core and a soft glow, both additive.
    const dir = to.clone().sub(from);
    const len = dir.length();
    const beam = new THREE.Group();
    const mk = (r: number, opacity: number) => {
      const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 8, 1, true), new THREE.MeshBasicMaterial({ color: 0xff2a1a, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false }));
      m.position.y = len / 2;
      beam.add(m);
      return m;
    };
    const core = mk(0.018, 1);
    const glow = mk(0.07, 0.35);
    beam.position.copy(from);
    beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
    beam.scale.y = 0.001;
    this.scene.add(beam);
    await this.tweens.run(140, (t) => { beam.scale.y = Math.max(0.001, t); });
    await this.tweens.run(320, (t) => {
      const f = 0.75 + 0.25 * Math.sin(t * 60);
      (core.material as THREE.MeshBasicMaterial).opacity = f;
      (glow.material as THREE.MeshBasicMaterial).opacity = 0.35 * f;
      if (flash) flash.style.opacity = String(seat === HUMAN_SEAT ? 0.55 * f : 0.18 * f);
    });
    // The puff, and the man is gone.
    if (fig) fig.group.visible = false;
    if (flash) flash.style.opacity = '0';
    const puff = this.makePuff(seat === HUMAN_SEAT ? to.clone().add(new THREE.Vector3(0, -0.4, -1.2)) : to.clone().add(new THREE.Vector3(0, -0.25, 0)));
    this.scene.add(puff.group);
    await Promise.all([
      this.tweens.run(180, (t) => { beam.scale.y = Math.max(0.001, 1 - t); (glow.material as THREE.MeshBasicMaterial).opacity = 0.35 * (1 - t); }),
      this.tweens.run(900, (t) => puff.update(t)),
    ]);
    this.scene.remove(beam);
    this.scene.remove(puff.group);
    for (const m of beam.children) { (m as THREE.Mesh).geometry.dispose(); ((m as THREE.Mesh).material as THREE.Material).dispose(); }
    puff.dispose();
    await this.tweens.delay(250);
  }

  private makePuff(at: THREE.Vector3): { group: THREE.Group; update: (t: number) => void; dispose: () => void } {
    if (!this.puffTexture) {
      const c = document.createElement('canvas');
      c.width = c.height = 64;
      const g = c.getContext('2d')!;
      const grad = g.createRadialGradient(32, 32, 2, 32, 32, 32);
      grad.addColorStop(0, 'rgba(230,225,215,1)');
      grad.addColorStop(0.5, 'rgba(170,165,160,.55)');
      grad.addColorStop(1, 'rgba(120,115,110,0)');
      g.fillStyle = grad;
      g.fillRect(0, 0, 64, 64);
      this.puffTexture = new THREE.CanvasTexture(c);
    }
    const group = new THREE.Group();
    const bits: { s: THREE.Sprite; v: THREE.Vector3; size: number }[] = [];
    for (let i = 0; i < 26; i++) {
      const mat = new THREE.SpriteMaterial({ map: this.puffTexture, transparent: true, opacity: 0.85, depthWrite: false });
      const s = new THREE.Sprite(mat);
      const a = Math.random() * Math.PI * 2;
      const r = 0.1 + Math.random() * 0.35;
      s.position.set(at.x + Math.cos(a) * r * 0.3, at.y + (Math.random() - 0.3) * 0.3, at.z + Math.sin(a) * r * 0.3);
      bits.push({ s, v: new THREE.Vector3(Math.cos(a) * r, 0.25 + Math.random() * 0.5, Math.sin(a) * r), size: 0.25 + Math.random() * 0.35 });
      group.add(s);
    }
    // A few red embers.
    for (let i = 0; i < 8; i++) {
      const mat = new THREE.SpriteMaterial({ map: this.puffTexture, color: 0xff5030, transparent: true, opacity: 1, depthWrite: false, blending: THREE.AdditiveBlending });
      const s = new THREE.Sprite(mat);
      s.position.copy(at);
      const a = Math.random() * Math.PI * 2;
      bits.push({ s, v: new THREE.Vector3(Math.cos(a) * 0.8, 0.6 + Math.random() * 0.8, Math.sin(a) * 0.8), size: 0.08 });
      group.add(s);
    }
    const start = bits.map((b) => b.s.position.clone());
    return {
      group,
      update: (t: number) => {
        for (let i = 0; i < bits.length; i++) {
          const b = bits[i];
          b.s.position.copy(start[i]).addScaledVector(b.v, t);
          const k = b.size * (0.4 + 1.6 * t);
          b.s.scale.set(k, k, 1);
          (b.s.material as THREE.SpriteMaterial).opacity = (b.size < 0.1 ? 1 : 0.85) * (1 - t) * (1 - t);
        }
      },
      dispose: () => { for (const b of bits) b.s.material.dispose(); },
    };
  }

  private refreshStacks(): void {
    if (!this.hand) return;
    for (const p of this.hand.players) this.overlay.setStack(p.seat, p.stack);
  }

  /** BTN, SB, BB, UTG, HJ, CO for the seats in a hand, by seat order from the button. */
  static positions(hand: Hand): Map<number, string> {
    const seats = hand.players.map((p) => p.seat);
    const n = seats.length;
    const bi = seats.indexOf(hand.button);
    const order = seats.map((_, k) => seats[(bi + k) % n]);
    const labels = n === 2 ? ['BTN', 'BB'] : ['BTN', 'SB', 'BB', ...(n === 6 ? ['UTG', 'HJ', 'CO'] : n === 5 ? ['UTG', 'CO'] : n === 4 ? ['UTG'] : [])];
    const out = new Map<number, string>();
    order.forEach((s, i) => out.set(s, labels[i] ?? ''));
    return out;
  }

  private humanToAct = false;

  /**
   * Someone speaks: their close-up appears in the inset with the line as a caption, their face
   * reacts, and if the line is about someone else that person gets a short reaction shot.
   */
  speak(speakerSeat: number, targetSeat: number | undefined, text: string, ms: number, trigger: string, name: string, conversation = false): Promise<void> {
    // Lines queue behind the one on screen until it has been up long enough to read. A reaction
    // line that has waited too long is stale and dropped; conversation lines keep their order.
    const queuedAt = performance.now();
    const run = this.speechChain.then(async () => {
      const waited = performance.now() - queuedAt;
      if (!conversation && waited > 6000) return;
      const readMs = Math.min(ms, 1600 + text.length * 42);
      const done = this.speakNow(speakerSeat, targetSeat, text, ms, trigger, name);
      await Promise.race([done, new Promise<void>((r) => setTimeout(r, readMs))]);
    });
    this.speechChain = run.catch(() => undefined);
    return run;
  }

  private speechChain: Promise<void> = Promise.resolve();

  private async speakNow(speakerSeat: number, targetSeat: number | undefined, text: string, ms: number, trigger: string, name: string): Promise<void> {
    const speaker = this.figures.get(speakerSeat);
    const target = targetSeat !== undefined ? this.figures.get(targetSeat) : undefined;
    const needle = ['targetFoldsToMe', 'targetCallsMeDown', 'targetTank', 'targetInstant', 'winShowdown', 'stackedTarget', 'badBeatGiven', 'playerOut'].includes(trigger);
    const sore = ['badBeatTaken', 'loseShowdown', 'stackedByTarget', 'bluffCaught'].includes(trigger);
    if (speaker && !this.out.has(speakerSeat)) speaker.setExpression(sore ? 'annoyed' : needle ? 'happy' : speaker.expression);
    const reaction = target && targetSeat !== undefined && targetSeat !== 0 && targetSeat !== speakerSeat ? 900 : 0;
    const token = this.showInset(speakerSeat, ms - reaction, name, text);
    await new Promise((r) => setTimeout(r, Math.max(0, ms - reaction)));
    if (this.pipToken !== token) return;
    if (reaction && target && targetSeat !== undefined) {
      if (needle && !this.out.has(targetSeat)) target.setExpression('annoyed');
      this.showInset(targetSeat, reaction, this.seatNames.get(targetSeat) ?? '', '');
      await new Promise((r) => setTimeout(r, reaction));
    }
    if (speaker && !this.out.has(speakerSeat)) speaker.setExpression(this.moodBase.get(speakerSeat) ?? 'neutral');
    if (target && targetSeat !== undefined && !this.out.has(targetSeat)) target.setExpression(this.moodBase.get(targetSeat) ?? 'neutral');
  }

  private async handStart(hand: Hand, level: { sb: number; bb: number; ante: number }): Promise<void> {
    this.hand = hand;
    this.tweens.clear();
    this.humanToAct = false;
    // Standings between hands: who is where, and what seat they are in for this one.
    const positions = TableScene.positions(hand);
    const rows = [...this.figures.keys()].map((seat) => {
      const p = hand.players.find((q) => q.seat === seat);
      return { seat, name: this.seatNames.get(seat) ?? '', stack: p ? p.stack + p.committed : 0, position: positions.get(seat) ?? '', finish: this.finishes.get(seat) };
    });
    const fast = this.tweens.speed() > 1.5;
    if (hand.handNumber === 1 || this.levelChanged) {
      const head = hand.handNumber === 1 ? `Hand 1 · Blinds ${money(level.sb)} / ${money(level.bb)}` : `Blinds up: ${money(level.sb)} / ${money(level.bb)}${level.ante ? ` · ante ${money(level.ante)}` : ''}`;
      this.overlay.showStandings(rows, head, fast ? 900 : 3200);
    }
    this.levelChanged = false;
    for (const [seat, label] of positions) this.overlay.setPosition(seat, label);
    for (const seat of this.figures.keys()) {
      if (!positions.has(seat)) this.overlay.setPosition(seat, '');
      this.figures.get(seat)?.setFolded(!hand.players.some((p) => p.seat === seat) && !this.out.has(seat));
    }
    for (const cards of this.hole.values()) for (const c of cards) this.removeCard(c);
    this.hole.clear();
    for (const c of this.board) this.removeCard(c);
    this.board = [];
    for (const [seat, stack] of this.bets) {
      stack.set(0);
      stack.group.position.copy(L.betPos(seat));
      this.overlay.setBet(seat, 0);
    }
    this.betAmounts.clear();
    this.pot.set(0);
    this.pot.group.position.copy(L.POT_POS);
    this.overlay.setPot(0);
    this.overlay.setHole(null);
    this.overlay.setBoard([]);
    this.overlay.hideResult();
    this.shownHands.clear();
    this.payouts.clear();
    this.overlay.setInfo({ level, handNumber: hand.handNumber });
    for (const [seat, f] of this.figures) {
      if (!this.out.has(seat)) f.setExpression(this.moodBase.get(seat) ?? 'neutral');
      this.overlay.setTag(seat, '');
      this.overlay.setFolded(seat, !hand.players.some((p) => p.seat === seat));
    }
    this.refreshStacks();
    const target = L.buttonPos(hand.button);
    const from = this.button.position.clone();
    await this.tweens.run(350, (t) => {
      this.button.position.lerpVectors(from, target, t);
      this.button.position.y = 0.01 + Math.sin(Math.PI * t) * 0.3;
    });
  }

  private async post(seat: number, amount: number): Promise<void> {
    const total = (this.betAmounts.get(seat) ?? 0) + amount;
    this.betAmounts.set(seat, total);
    this.refreshStacks();
    await this.dropBet(seat, total, 220);
  }

  private dropBet(seat: number, total: number, ms: number): Promise<void> {
    this.audio.play(total >= 1000 ? 'chips' : 'chip');
    const stack = this.bets.get(seat)!;
    stack.set(total);
    this.overlay.setBet(seat, total, L.betPos(seat));
    const base = L.betPos(seat);
    return this.tweens.run(ms, (t) => {
      stack.group.position.set(base.x, (1 - t) * 0.35, base.z);
    });
  }

  private async deal(seat: number, cards: Card[]): Promise<void> {
    const bot = seat !== HUMAN_SEAT;
    const pos = L.holePos(seat, bot);
    const yaw = L.cardYaw(pos);
    const side = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw));
    const meshes: CardMesh[] = [];
    for (let i = 0; i < cards.length; i++) {
      const m = new CardMesh(bot ? null : cards[i]);
      // Other men's cards are small and tucked by the rail; yours are full size.
      if (bot) m.group.scale.setScalar(0.62);
      m.group.position.copy(L.DEAL_ORIGIN);
      m.group.rotation.y = yaw + 0.6;
      this.scene.add(m.group);
      meshes.push(m);
      this.audio.play('deal', 0.8);
      const target = pos.clone().add(side.clone().multiplyScalar((i - 0.5) * (bot ? 0.24 : 0.4)));
      target.y += i * 0.004;
      const from = L.DEAL_ORIGIN.clone();
      const startYaw = m.group.rotation.y;
      const p = this.tweens.run(230, (t) => {
        m.group.position.lerpVectors(from, target, t);
        m.group.position.y += Math.sin(Math.PI * t) * 0.4;
        m.group.rotation.y = startYaw + (yaw - startYaw) * t;
      });
      if (i < cards.length - 1) await this.tweens.delay(90);
      else await p;
    }
    this.hole.set(seat, meshes);
    if (seat === HUMAN_SEAT) {
      meshes.forEach((m, i) => (m.setCard(cards[i]), void 0));
      await Promise.all(meshes.map((m, i) => this.flipCard(m, true, 280, i * 70)));
      this.overlay.setHole(cards);
    }
  }

  private async flipCard(card: CardMesh, faceUp: boolean, ms: number, delay = 0): Promise<void> {
    if (delay) await this.tweens.delay(delay);
    this.audio.play('flip');
    const from = card.flip.rotation.x;
    const to = faceUp ? 0 : Math.PI;
    const baseY = card.group.position.y;
    await this.tweens.run(ms, (t) => {
      card.flip.rotation.x = from + (to - from) * t;
      card.group.position.y = baseY + Math.sin(Math.PI * t) * 0.22;
    }, easeInOutCubic);
  }

  private removeCard(c: CardMesh): void {
    this.scene.remove(c.group);
    c.dispose();
  }

  private async turn(seat: number): Promise<void> {
    this.overlay.setActive(seat);
    this.humanToAct = seat === HUMAN_SEAT;
    if (seat === HUMAN_SEAT) this.audio.play('tick', 0.6);
    if (seat !== HUMAN_SEAT) this.figures.get(seat)?.setExpression('thinking');
  }

  private async action(seat: number, type: string, amount: number, allIn: boolean): Promise<void> {
    this.overlay.setActive(null);
    if (seat === HUMAN_SEAT) this.humanToAct = false;
    const f = this.figures.get(seat);
    if (f && !this.out.has(seat)) f.setExpression(this.moodBase.get(seat) ?? 'neutral');
    const hand = this.hand!;
    const p = hand.player(seat);
    const label = allIn ? 'ALL IN' : type === 'raise' ? `RAISE ${money(p.streetBet)}` : type === 'bet' ? `BET ${money(p.streetBet)}` : type.toUpperCase();
    this.overlay.setTag(seat, label, type === 'fold' ? 'muted' : allIn ? 'hot' : type === 'raise' || type === 'bet' ? 'strong' : '');
    this.refreshStacks();
    if (type === 'fold') {
      this.audio.play('fold');
      this.overlay.setFolded(seat, true);
      if (seat !== HUMAN_SEAT) f?.setFolded(true);
      if (seat === HUMAN_SEAT) this.overlay.setHole(null);
      const cards = this.hole.get(seat) ?? [];
      this.hole.delete(seat);
      await Promise.all(cards.map((c, i) => {
        const from = c.group.position.clone();
        const to = L.MUCK_POS.clone().add(new THREE.Vector3(i * 0.05, 0.02 * i, 0));
        return this.tweens.run(320, (t) => {
          c.group.position.lerpVectors(from, to, t);
          c.group.position.y += Math.sin(Math.PI * t) * 0.3;
        }).then(() => this.removeCard(c));
      }));
      return;
    }
    if (amount > 0) {
      this.betAmounts.set(seat, p.streetBet);
      if (allIn) this.audio.play('allin');
      if (allIn && seat !== HUMAN_SEAT && !this.pip) this.showInset(seat, 2200, this.seatNames.get(seat) ?? '', 'All in');
      await this.dropBet(seat, p.streetBet, 260);
      if (allIn) await this.tweens.delay(500);
    } else {
      await this.tweens.delay(220);
    }
  }

  private async gatherBets(): Promise<void> {
    const moving: Promise<void>[] = [];
    for (const [seat, amount] of this.betAmounts) {
      if (amount <= 0) continue;
      const stack = this.bets.get(seat)!;
      this.audio.play('chips', 0.6);
      const from = stack.group.position.clone();
      this.overlay.setBet(seat, 0);
      moving.push(this.tweens.run(380, (t) => {
        stack.group.position.lerpVectors(from, L.POT_POS, t);
      }, easeInOutCubic).then(() => {
        stack.set(0);
        stack.group.position.copy(L.betPos(seat));
      }));
    }
    this.betAmounts.clear();
    await Promise.all(moving);
    const total = this.hand?.potTotal() ?? 0;
    this.pot.set(total);
    this.overlay.setPot(total, L.POT_LABEL_POS);
  }

  private async street(board: Card[]): Promise<void> {
    await this.gatherBets();
    for (const [seat] of this.figures) this.overlay.setTag(seat, '');
    const start = this.board.length;
    const deals: Promise<void>[] = [];
    for (let i = start; i < board.length; i++) {
      const m = new CardMesh(board[i]);
      m.group.position.copy(L.DEAL_ORIGIN);
      this.scene.add(m.group);
      this.board.push(m);
      const from = L.DEAL_ORIGIN.clone();
      const to = L.boardPos(i);
      const delay = (i - start) * 140;
      deals.push(this.tweens.delay(delay).then(() => this.tweens.run(260, (t) => {
        m.group.position.lerpVectors(from, to, t);
        m.group.position.y += Math.sin(Math.PI * t) * 0.35;
      })).then(() => this.flipCard(m, true, 300)).then(() => this.overlay.setBoard(board.slice(0, i + 1))));
    }
    await Promise.all(deals);
  }

  private async showdown(seat: number, cards: Card[], description: string): Promise<void> {
    this.shownHands.set(seat, { cards, description });
    const meshes = this.hole.get(seat) ?? [];
    this.overlay.setTag(seat, description.toUpperCase(), 'strong');
    if (seat !== HUMAN_SEAT) {
      meshes.forEach((m, i) => m.setCard(cards[i]));
      await Promise.all(meshes.map((m, i) => this.flipCard(m, true, 320, i * 80)));
      await this.tweens.delay(250);
    }
  }

  private async payout(seat: number, amount: number, returned: boolean): Promise<void> {
    if (this.betAmounts.size > 0) await this.gatherBets();
    if (returned) {
      this.refreshStacks();
      return;
    }
    this.payouts.set(seat, (this.payouts.get(seat) ?? 0) + amount);
    const from = this.pot.group.position.clone();
    const to = L.betPos(seat);
    this.overlay.setTag(seat, `WINS ${money(amount)}`, 'hot');
    this.audio.play(amount >= 3000 ? 'win' : 'chips');
    this.pot.set(amount);
    await this.tweens.run(520, (t) => {
      this.pot.group.position.lerpVectors(from, to, t);
      this.pot.group.position.y = Math.sin(Math.PI * t) * 0.2;
    }, easeInOutCubic);
    this.pot.set(0);
    this.pot.group.position.copy(L.POT_POS);
    this.overlay.setPot(0);
    this.refreshStacks();
    this.figures.get(seat)?.setExpression('happy');
  }

  private async handEnd(ev: Extract<TableEvent, { type: 'handEnd' }>): Promise<void> {
    for (const [seat, outcome] of Object.entries(ev.outcomes)) {
      const s = Number(seat);
      const f = this.figures.get(s);
      if (!f || !outcome) continue;
      const mood = ev.moods[s];
      const base: Expression = mood && mood.clarity >= 60 ? 'tilted' : 'neutral';
      this.moodBase.set(s, base);
      // The red creeps in from clarity 25 and is full at 85.
      if (mood) f.setTilt((mood.clarity - 25) / 60);
      if (outcome.badBeat) f.setExpression('shocked');
      else if (outcome.net < 0 && Math.abs(outcome.net) > 0.2 * Math.max(1, outcome.stackAfter)) f.setExpression('annoyed');
      else if (outcome.net > 0) f.setExpression('happy');
    }
    const showdown = ev.hand.events.some((e) => e.type === 'showdown');
    // When somebody just lost his last chip the dealer deals with him first, over a clear table;
    // the result card follows the laser.
    const busting = ev.hand.players.some((p) => p.stack === 0 && !ev.winners.includes(p.seat));
    if (busting) {
      this.pendingResult = async () => {
        this.showResult(ev.hand, ev.winners, showdown);
        await this.tweens.delay(showdown ? 2400 : 1200);
      };
      await this.tweens.delay(500);
      return;
    }
    this.showResult(ev.hand, ev.winners, showdown);
    await this.tweens.delay(showdown ? 2400 : 1200);
  }

  /** The result card: winners first, then everyone else who showed. */
  private showResult(hand: Hand, winners: number[], showdown: boolean): void {
    const name = (seat: number) => (seat === HUMAN_SEAT ? 'You' : this.seatNames.get(seat) ?? '');
    const amountOf = (seat: number) => this.payouts.get(seat) ?? 0;
    if (!showdown) {
      const w = winners[0];
      if (w === undefined) return;
      this.overlay.showResult(`${name(w)} ${w === HUMAN_SEAT ? 'take' : 'takes'} ${money(amountOf(w))}. Everyone else folded.`, []);
      return;
    }
    const live = hand.players.filter((p) => !p.folded);
    const ordered = [...live].sort((a, b) => Number(winners.includes(b.seat)) - Number(winners.includes(a.seat)));
    const rows = ordered.map((p) => {
      const shown = this.shownHands.get(p.seat);
      return {
        name: name(p.seat),
        cards: shown?.cards ?? p.hole,
        description: shown?.description ?? '',
        winner: winners.includes(p.seat),
        amount: amountOf(p.seat),
        you: p.seat === HUMAN_SEAT,
      };
    });
    const top = rows[0];
    const headline = winners.length > 1
      ? `Split pot: ${winners.map(name).join(' and ')} with ${top.description}`
      : `${top.name} ${top.you ? 'win' : 'wins'} ${money(top.amount)} with ${top.description}`;
    this.overlay.showResult(headline, rows);
  }
}
void easeOutCubic;
void linear;

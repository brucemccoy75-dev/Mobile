// The 3D table: felt, rail, figures, cards and chips, animated from table events.
import * as THREE from 'three';
import { type Card } from '../engine/cards';
import { type Hand } from '../engine/hand';
import { HUMAN_SEAT, type Presenter, type TableEvent } from '../game/table';
import { type Overlay } from '../ui/overlay';
import { CardMesh } from './cards';
import { ChipStack } from './chips';
import { Director, closeUpOf, seatPose } from './director';
import { type Expression, Figure } from './figures';
import * as L from './layout';
import { TableAudio } from './audio';
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
  private pointer: { x: number; y: number; moved: boolean; id: number } | null = null;
  private raycaster = new THREE.Raycaster();
  private seatNames = new Map<number, string>();
  /** The picture-in-picture camera and what it is looking at. */
  private readonly pipCamera = new THREE.PerspectiveCamera(34, 1.5, 0.1, 60);
  private pip: { seat: number; token: number } | null = null;
  private pipEl: HTMLElement | null = null;
  private pipToken = 0;

  constructor(container: HTMLElement, overlay: Overlay) {
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
    this.camera = new THREE.PerspectiveCamera(48, 1, 0.1, 60);
    this.director = new Director(this.camera, this.tweens);

    this.buildRoom();
    this.buildTable();
    this.button = this.buildButton();
    this.scene.add(this.pot.group);
    this.pot.group.position.copy(L.POT_POS);

    this.bindPointer();
    window.addEventListener('resize', () => this.resize());
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
    const p = el.getBoundingClientRect();
    const f = (el.querySelector('.frame') as HTMLElement).getBoundingClientRect();
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
    if (el) this.overlay.panelLeft = el.getBoundingClientRect().left;
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
    const r = frame.getBoundingClientRect();
    const c = this.renderer.domElement.getBoundingClientRect();
    // Viewport and scissor take CSS pixels; the renderer applies the pixel ratio itself.
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
      const toCentre = new THREE.Vector3(-f.x, 0, -f.z).normalize();
      pose = { pos: f.clone().add(toCentre.multiplyScalar(1.75)).setY(1.4), look: new THREE.Vector3(f.x, 1.22, f.z) };
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

  private buildRoom(): void {
    this.scene.add(new THREE.HemisphereLight(0xcfd8d2, 0x1a2a20, 0.35));
    const key = new THREE.SpotLight(0xfff1dc, 260, 30, 0.62, 0.55, 1.6);
    key.position.set(0.5, 9.5, 1.5);
    key.target.position.set(0, 0, 0);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.bias = -0.0004;
    key.shadow.radius = 4;
    this.scene.add(key, key.target);
    const fill = new THREE.DirectionalLight(0xbfd4ff, 0.5);
    fill.position.set(-6, 6, 8);
    this.scene.add(fill);
    const rim = new THREE.DirectionalLight(0xffd9a8, 0.55);
    rim.position.set(0, 4, -10);
    this.scene.add(rim);
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
  }

  private buildTable(): void {
    const feltMat = new THREE.MeshStandardMaterial({ color: 0x1d6f3d, roughness: 0.96 });
    const felt = new THREE.Mesh(new THREE.CylinderGeometry(L.FELT_RX, L.FELT_RX, 0.16, 96), feltMat);
    felt.scale.z = L.FELT_RZ / L.FELT_RX;
    felt.position.y = -0.08;
    felt.receiveShadow = true;
    this.scene.add(felt);

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
    dealer.group.position.y = 0.05;
    dealer.group.rotation.y = L.faceCentre(L.DEALER_POS);
    dealer.group.scale.setScalar(0.95);
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

  private figureFor(seat: number, id: string): Figure {
    let f = this.figures.get(seat);
    if (f) return f;
    f = new Figure(id);
    const p = L.figurePos(seat);
    f.group.position.copy(p);
    f.group.position.y = -0.1;
    f.group.rotation.y = L.faceCentre(p);
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
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.director.setAspect(w / h);
  }

  private frame(t: number): void {
    const dt = this.lastFrame ? Math.min(100, t - this.lastFrame) : 16;
    this.lastFrame = t;
    this.tweens.tick(dt);
    this.director.tick();
    for (const f of this.figures.values()) {
      if (!f.group.visible) continue;
      f.tick(t);
      f.faceCamera(this.camera.position);
    }
    this.dealerFigure?.faceCamera(this.camera.position);
    this.overlay.update(this.camera, this.container.clientWidth, this.container.clientHeight);
    this.renderer.render(this.scene, this.camera);
    this.renderInset();
  }

  private bindPointer(): void {
    const el = this.renderer.domElement;
    el.addEventListener('pointerdown', (e) => {
      this.pointer = { x: e.clientX, y: e.clientY, moved: false, id: e.pointerId };
    });
    el.addEventListener('pointermove', (e) => {
      if (!this.pointer || e.pointerId !== this.pointer.id) return;
      const dx = e.clientX - this.pointer.x;
      if (!this.pointer.moved && Math.abs(dx) > 8) {
        this.pointer.moved = true;
        this.director.dragStart();
      }
      if (this.pointer.moved) {
        this.director.dragMove(dx);
        this.pointer.x = e.clientX;
      }
    });
    const up = (e: PointerEvent) => {
      if (!this.pointer || e.pointerId !== this.pointer.id) return;
      if (this.pointer.moved) this.director.dragEnd();
      else this.tap(e.clientX, e.clientY);
      this.pointer = null;
    };
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
  }

  private tap(x: number, y: number): void {
    const rect = this.renderer.domElement.getBoundingClientRect();
    const ndc = new THREE.Vector2(((x - rect.left) / rect.width) * 2 - 1, -((y - rect.top) / rect.height) * 2 + 1);
    this.raycaster.setFromCamera(ndc, this.camera);
    const targets = [...this.figures.values()].filter((f) => f.group.visible).map((f) => f.group);
    const hit = this.raycaster.intersectObjects(targets, true)[0];
    if (hit) {
      let o: THREE.Object3D | null = hit.object;
      while (o && o.userData.seat === undefined) o = o.parent;
      if (o) {
        this.director.lookAt(o.userData.seat as number);
        return;
      }
    }
    if (this.director.cursor !== 0) this.director.lookAt(this.director.cursor);
  }

  // ---- presenting events -------------------------------------------------------------------------

  async present(ev: TableEvent): Promise<void> {
    switch (ev.type) {
      case 'tournamentStart':
        for (const s of ev.seats) {
          this.figureFor(s.seat, s.id);
          this.seatNames.set(s.seat, s.name);
          this.overlay.plate(s.seat, L.platePos(s.seat), s.name, s.stack);
        }
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
          this.figures.get(s)?.setOut(true);
          this.overlay.setOut(s, ev.finishes[s]);
          this.overlay.setPosition(s, '');
        }
        return;
      case 'level':
        this.overlay.setInfo({ level: ev.level });
        this.overlay.toast(`Blinds up: ${money(ev.level.sb)} / ${money(ev.level.bb)}${ev.level.ante ? ` · ante ${money(ev.level.ante)}` : ''}`);
        return this.tweens.delay(600);
      case 'tournamentEnd':
        return;
    }
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
  async speak(speakerSeat: number, targetSeat: number | undefined, text: string, ms: number, trigger: string, name: string): Promise<void> {
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
    this.overlay.showStandings(rows, `Hand ${hand.handNumber} · Blinds ${money(level.sb)} / ${money(level.bb)}`, fast ? 700 : 2600);
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
    const pos = L.holePos(seat);
    const yaw = L.cardYaw(pos);
    const side = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw));
    const meshes: CardMesh[] = [];
    for (let i = 0; i < cards.length; i++) {
      const m = new CardMesh(seat === HUMAN_SEAT ? cards[i] : null);
      m.group.position.copy(L.DEAL_ORIGIN);
      m.group.rotation.y = yaw + 0.6;
      this.scene.add(m.group);
      meshes.push(m);
      this.audio.play('deal', 0.8);
      const target = pos.clone().add(side.clone().multiplyScalar((i - 0.5) * 0.4));
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
      if (allIn && seat !== HUMAN_SEAT) this.showInset(seat, 2200, this.seatNames.get(seat) ?? '', 'All in');
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
      if (outcome.badBeat) f.setExpression('shocked');
      else if (outcome.net < 0 && Math.abs(outcome.net) > 0.2 * Math.max(1, outcome.stackAfter)) f.setExpression('annoyed');
      else if (outcome.net > 0) f.setExpression('happy');
    }
    const showdown = ev.hand.events.some((e) => e.type === 'showdown');
    await this.tweens.delay(showdown ? 1400 : 700);
  }
}
void easeOutCubic;
void linear;

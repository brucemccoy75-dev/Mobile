// A fixed-size stage scaled uniformly to fit whatever screen the game is on. Every HUD element and
// the 3D canvas live inside it in stage units, so the layout is identical on every device; leftover
// screen becomes dark bars.
export const STAGE_W = 1000;
export const STAGE_H = 460;

export class Stage {
  readonly el: HTMLElement;
  private readonly probe: HTMLElement;
  scale = 1;
  onFit: (scale: number) => void = () => {};

  constructor(el: HTMLElement, probe: HTMLElement) {
    this.el = el;
    this.probe = probe;
    const refit = () => this.fit();
    window.addEventListener('resize', refit);
    window.addEventListener('orientationchange', refit);
    window.visualViewport?.addEventListener('resize', refit);
    window.visualViewport?.addEventListener('scroll', refit);
    document.addEventListener('fullscreenchange', refit);
    this.fit();
    // Some browsers report the final viewport a moment after load or after a toolbar hides.
    window.setTimeout(refit, 250);
    window.setTimeout(refit, 1000);
  }

  /** Measures the visible viewport and safe areas, then scales and centres the stage. */
  fit(): void {
    const vv = window.visualViewport;
    const vw = vv?.width ?? window.innerWidth;
    const vh = vv?.height ?? window.innerHeight;
    const ox = vv?.offsetLeft ?? 0;
    const oy = vv?.offsetTop ?? 0;
    const cs = getComputedStyle(this.probe);
    const inset = {
      left: parseFloat(cs.paddingLeft) || 0,
      right: parseFloat(cs.paddingRight) || 0,
      top: parseFloat(cs.paddingTop) || 0,
      bottom: parseFloat(cs.paddingBottom) || 0,
    };
    const aw = Math.max(1, vw - inset.left - inset.right);
    const ah = Math.max(1, vh - inset.top - inset.bottom);
    const scale = Math.min(aw / STAGE_W, ah / STAGE_H);
    const x = ox + inset.left + (aw - STAGE_W * scale) / 2;
    const y = oy + inset.top + (ah - STAGE_H * scale) / 2;
    this.scale = scale;
    this.el.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) scale(${scale.toFixed(4)})`;
    this.onFit(scale);
  }

  /** A screen-space rectangle expressed in stage units. */
  toStage(rect: DOMRect): { left: number; top: number; width: number; height: number; right: number; bottom: number } {
    const s = this.el.getBoundingClientRect();
    const k = 1 / this.scale;
    const left = (rect.left - s.left) * k;
    const top = (rect.top - s.top) * k;
    const width = rect.width * k;
    const height = rect.height * k;
    return { left, top, width, height, right: left + width, bottom: top + height };
  }
}

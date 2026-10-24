// One logical height everywhere; width adapts to the device aspect ratio.
// 540 tall at 3x pixel scale gives ~11 rows of 48px tiles plus UI.
export const GAME_HEIGHT = 540;
export const MIN_WIDTH = 960;   // 16:9
export const MAX_WIDTH = 1260;  // 21:9

export function computeGameSize(innerWidth: number, innerHeight: number) {
  const aspect = innerWidth / Math.max(1, innerHeight);
  const landscapeAspect = aspect >= 1 ? aspect : 1 / aspect; // portrait: plan for the rotated size
  const width = Math.round(Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, GAME_HEIGHT * landscapeAspect)));
  return { width, height: GAME_HEIGHT };
}

// Safe-area insets (notch / home indicator) in CSS px, read from the env() values.
export function safeAreaInsets() {
  const probe = document.createElement('div');
  probe.style.cssText =
    'position:fixed;top:env(safe-area-inset-top);right:env(safe-area-inset-right);' +
    'bottom:env(safe-area-inset-bottom);left:env(safe-area-inset-left);visibility:hidden;pointer-events:none';
  document.body.appendChild(probe);
  const cs = getComputedStyle(probe);
  const px = (v: string) => parseFloat(v) || 0;
  const insets = { top: px(cs.top), right: px(cs.right), bottom: px(cs.bottom), left: px(cs.left) };
  probe.remove();
  return insets;
}

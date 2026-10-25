import type { Rarity, StatusId } from '@data/types';

export const FONT = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
export const MONO = 'ui-monospace, Menlo, Consolas, monospace';

export const COLORS = {
  bg: 0x0b0f1a,
  panel: 0x141a2b,
  panelEdge: 0x2a3350,
  text: '#e6e9f2',
  muted: '#8b93a7',
  gold: '#c9a227',
  goldHex: 0xc9a227,
  hp: 0x3fb950,
  hpLow: 0xd64545,
  hpBack: 0x2a3350,
  player: 0x4f8cff,
  enemy: 0xd64545,
  boss: 0x9b4fff,
  block: '#7dd3fc',
  heal: '#3fb950',
  damage: '#ffffff',
  burn: '#ff8c42',
};

export const CLASS_COLORS: Record<string, number> = {
  warrior: 0xd97b3a,
  wizard: 0x4f8cff,
  shaman: 0x3fb98f,
};

export const RARITY_COLORS: Record<Rarity, number> = {
  basic: 0x3a4260,
  common: 0x2f6f4e,
  uncommon: 0x2f5c9e,
  rare: 0x7a3fb9,
  boss: 0xb0731c,
};

export const STATUS_LABELS: Record<StatusId, { label: string; color: string }> = {
  exposed: { label: 'EXPOSED', color: '#ff6b6b' },
  guard: { label: 'GUARD', color: '#7dd3fc' },
  burn: { label: 'BURN', color: '#ff8c42' },
  chill: { label: 'CHILL', color: '#9ad7ff' },
  weak: { label: 'WEAK', color: '#c7b3ff' },
  stun: { label: 'RECOVERING', color: '#ffd166' },
};

export const POSTURE_TEXT: Record<string, string> = {
  aggressive: 'next: attacks',
  defensive: 'next: guards',
  sinister: 'next: casts',
  charging: 'next: winds up!',
  reeling: 'next: staggers',
};

export const text = {
  title: { fontFamily: FONT, fontSize: '40px', color: COLORS.text, fontStyle: 'bold' },
  h2: { fontFamily: FONT, fontSize: '24px', color: COLORS.text, fontStyle: 'bold' },
  body: { fontFamily: FONT, fontSize: '16px', color: COLORS.text },
  small: { fontFamily: FONT, fontSize: '13px', color: COLORS.muted },
  mono: { fontFamily: MONO, fontSize: '12px', color: '#4b5366' },
  button: { fontFamily: FONT, fontSize: '18px', color: COLORS.text, fontStyle: 'bold' },
};

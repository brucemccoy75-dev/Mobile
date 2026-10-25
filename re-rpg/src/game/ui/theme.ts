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

export const STATUS_LABELS: Record<StatusId, { label: string; color: string; desc: string }> = {
  exposed: { label: 'EXPOSED', color: '#ff6b6b', desc: 'Takes double damage from every hit while it lasts.' },
  guard: { label: 'GUARD', color: '#7dd3fc', desc: 'Blocks the next hit completely. Each stack blocks one hit, then it is gone.' },
  burn: { label: 'BURN', color: '#ff8c42', desc: 'Loses HP at the end of every round. Burn ignores Guard.' },
  chill: { label: 'CHILL', color: '#9ad7ff', desc: 'Skips its next action.' },
  weak: { label: 'WEAK', color: '#c7b3ff', desc: 'Deals half damage while it lasts.' },
  stun: { label: 'RECOVERING', color: '#ffd166', desc: 'Skips turns while it lasts. The enemy keeps acting.' },
  brace: { label: 'BRACED', color: '#ff9f68', desc: 'The next hit that lands is thrown straight back at the attacker. A Guard blocks the counter; a small hit means a small counter.' },
  scatter: { label: 'SCATTERED', color: '#b8f0c8', desc: 'The next single hit does half damage. Attacks with several hits are unaffected.' },
};

/** Plain-language reading of an enemy intent for the tap-to-explain panel. */
export function describeIntent(kind: string, moveName: string, predicted: number, hits: number, status?: StatusId): string {
  switch (kind) {
    case 'attack': return hits > 1 ? `${moveName}: ${hits} hits for about ${predicted} total. Each Guard stack blocks one hit.` : `${moveName}: one hit for about ${predicted}. Defend blocks it.`;
    case 'guard': return `${moveName}: raises a guard, so your next hit is blocked. Strip it with a cheap hit, or wait it out.`;
    case 'debuff': return `${moveName}: inflicts ${STATUS_LABELS[status!].label} on you. ${STATUS_LABELS[status!].desc}`;
    case 'buff': return `${moveName}: ${STATUS_LABELS[status!].desc}`;
    case 'stagger': return `${moveName}: it loses its footing and is Exposed for your next turn. Hit it hard.`;
    default: return moveName;
  }
}

export const POSTURE_TEXT: Record<string, string> = {
  aggressive: 'next: attacks',
  defensive: 'next: guards',
  sinister: 'next: casts',
  charging: 'next: winds up!',
  reeling: 'next: staggers',
  countering: 'next: braces to counter!',
  evasive: 'next: scatters',
};

export const text = {
  title: { fontFamily: FONT, fontSize: '40px', color: COLORS.text, fontStyle: 'bold' },
  h2: { fontFamily: FONT, fontSize: '24px', color: COLORS.text, fontStyle: 'bold' },
  body: { fontFamily: FONT, fontSize: '16px', color: COLORS.text },
  small: { fontFamily: FONT, fontSize: '13px', color: COLORS.muted },
  mono: { fontFamily: MONO, fontSize: '12px', color: '#4b5366' },
  button: { fontFamily: FONT, fontSize: '18px', color: COLORS.text, fontStyle: 'bold' },
};

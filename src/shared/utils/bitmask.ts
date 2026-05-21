// Shared input bitmask encoding (uint16). One source of truth — used by every room.
// Bit positions match client/src/game/hooks/useGameInput.ts.

export const INPUT_BITS = {
  moveLeft: 0,
  moveRight: 1,
  moveUp: 2,
  moveDown: 3,
  attack: 4,
  defense: 5,
  dodge: 6,
  jump: 7,
  chargeHeld: 8,
  specialTap: 9,
} as const;

export interface PlayerInput {
  moveLeft?: boolean;
  moveRight?: boolean;
  moveUp?: boolean;
  moveDown?: boolean;
  jump?: boolean;
  attack?: boolean;
  defense?: boolean;
  dodge?: boolean;
  chargeHeld?: boolean;
  specialTap?: boolean;
  // Legacy / compat fields kept so the server still accepts pre-bitmask object inputs.
  specialMove?: boolean;
  direction?: { x: number; y: number };
  comboKeys?: string[];
}

export function decodeBitmask(mask: number): PlayerInput {
  return {
    moveLeft:   (mask & (1 << INPUT_BITS.moveLeft))   !== 0,
    moveRight:  (mask & (1 << INPUT_BITS.moveRight))  !== 0,
    moveUp:     (mask & (1 << INPUT_BITS.moveUp))     !== 0,
    moveDown:   (mask & (1 << INPUT_BITS.moveDown))   !== 0,
    attack:     (mask & (1 << INPUT_BITS.attack))     !== 0,
    defense:    (mask & (1 << INPUT_BITS.defense))    !== 0,
    dodge:      (mask & (1 << INPUT_BITS.dodge))      !== 0,
    jump:       (mask & (1 << INPUT_BITS.jump))       !== 0,
    chargeHeld: (mask & (1 << INPUT_BITS.chargeHeld)) !== 0,
    specialTap: (mask & (1 << INPUT_BITS.specialTap)) !== 0,
  };
}

// Server accepts both encoded uint16 and legacy object form (back-compat).
export function normalizeInput(raw: number | PlayerInput | undefined): PlayerInput {
  if (raw == null) return {};
  if (typeof raw === "number") return decodeBitmask(raw);
  return raw;
}

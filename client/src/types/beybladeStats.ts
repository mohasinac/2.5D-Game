// [GAME-CLIENT] Beyblade stat types — mirrors root types/beybladeStats.ts for the Vite client.

import type { BeybladeComboSlot } from "./comboTask";
import type { SpecialMoveConfig } from "./specialMove";
import type { ElementType } from "./comboTask";

export type BeybladeType = "attack" | "defense" | "stamina" | "balanced";
export type SpinDirection = "left" | "right";

export interface PointOfContact {
  angle: number;
  damageMultiplier: number;
  width: number;
}

export interface SpinStealPoint {
  angle: number;
  spinStealMultiplier: number;
  width: number;
}

export interface TypeDistribution {
  attack: number;
  defense: number;
  stamina: number;
  total: number;
}

export interface AdminOverrides {
  maxStamina?: number;
  spinDecayRate?: number;
  spinStealFactor?: number;
  damageMultiplier?: number;
  damageTaken?: number;
  knockbackDistance?: number;
  invulnerabilityChance?: number;
  speed?: number;
}

export interface BeybladeStats {
  id: string;
  displayName: string;
  fileName: string;
  imageUrl?: string;
  imagePosition?: { x: number; y: number; scale: number; rotation: number };
  type: BeybladeType;
  spinDirection: SpinDirection;
  mass: number;
  radius: number;
  actualSize?: number;
  typeDistribution: TypeDistribution;
  // Derived stats (computed from typeDistribution + type archetype bonuses)
  damageMultiplier: number;
  damageTaken: number;
  knockbackDistance: number;
  invulnerabilityChance: number;
  spinDecayRate: number;
  maxSpin: number;
  spinStealFactor: number;
  maxStamina: number;
  speed?: number;
  rotationSpeed?: number;
  pointsOfContact: PointOfContact[];
  spinStealPoints?: SpinStealPoint[];
  // Admin features
  adminOverrides?: AdminOverrides;
  /** @deprecated Use comboSlots instead */
  enabledCombos?: string[];
  /** Per-bey combo slot assignments (replaces enabledCombos) */
  comboSlots?: BeybladeComboSlot[];
  /** Special move configuration */
  specialMove?: SpecialMoveConfig;
  /** Element types (max 2) */
  elementTypes?: ElementType[];
  /** Jump force (N) — 0 by default; set > 0 for jump-capable beys */
  jumpForce?: number;
  /** Max jump height (cm) */
  jumpHeight?: number;
  /** Burst resistance 0–100; higher = harder to burst */
  burstResistance?: number;
  createdAt?: any;
  updatedAt?: any;
}

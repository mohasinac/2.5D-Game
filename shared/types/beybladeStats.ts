// Beyblade stat types and calculation functions.

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
  /** Vivid hex color (e.g. "#00d4ff") used for in-game rendering tint and admin UI. */
  color?: string;
  /** Burst resistance 0–100; higher = harder to burst */
  burstResistance?: number;
  createdAt?: any;
  updatedAt?: any;
}

export function validateTypeDistribution(dist: TypeDistribution): boolean {
  const { attack, defense, stamina, total } = dist;
  if (attack < 0 || defense < 0 || stamina < 0) return false;
  if (attack > 150 || defense > 150 || stamina > 150) return false;
  if (attack + defense + stamina !== 360) return false;
  if (total !== 360) return false;
  return true;
}

export function calculateStats(dist: TypeDistribution) {
  const { attack, defense, stamina } = dist;
  const damageMultiplier = 1.0 + attack * 0.01;
  const speedPerSecond = 10 + attack * 0.1;
  const damageTaken = 1.0 - defense / 300;
  const maxStamina = Math.ceil(1000 + stamina * (2000 / 150));
  const attackPower = attack + 100;
  const defensePower = defense + 100;
  const staminaPower = stamina + 100;
  return {
    damageMultiplier,
    speedPerSecond,
    rotationSpeed: speedPerSecond,
    damagePerHit: damageMultiplier * 100,
    damageTaken,
    knockbackDistance: 10 - defense / 60,
    invulnerabilityChance: 10 + defense / 15,
    damageReduction: 1 / damageTaken,
    maxStamina,
    spinStealPercent: 10 + stamina * (40 / 150),
    spinDecayRate: Math.max(0.5, 10 - stamina / 60),
    attackPower,
    defensePower,
    staminaPower,
    speedMultiplier: attackPower,
    knockbackResistance: defensePower,
    spinStealPower: staminaPower,
  };
}

export function calculateTypeBonuses(type: BeybladeType): { attackMultiplier: number; defenseMultiplier: number; maxStamina: number } {
  switch (type) {
    case "attack":  return { attackMultiplier: 1.2, defenseMultiplier: 1.0, maxStamina: 2500 };
    case "defense": return { attackMultiplier: 1.0, defenseMultiplier: 0.8, maxStamina: 2500 };
    case "stamina": return { attackMultiplier: 1.0, defenseMultiplier: 1.0, maxStamina: 3000 };
    default:        return { attackMultiplier: 1.0, defenseMultiplier: 1.0, maxStamina: 2500 };
  }
}

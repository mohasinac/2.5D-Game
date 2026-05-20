// [GAME-CLIENT] Beyblade stat types — mirrors root types/beybladeStats.ts for the Vite client.

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
  enabledCombos?: string[];
  createdAt?: any;
  updatedAt?: any;
}

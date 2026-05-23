// Physics flags: per-beyblade collision/behavior override set.
// Stored in Firestore beyblade_stats.physicsFlags and applied at match start.

export interface BeybladePhysicsFlags {
  // Matter.js collision mask flags
  collisionWithBeys: boolean;
  collisionWithArena: boolean;
  collisionWithObstacles: boolean;
  collisionWithProjectiles: boolean;
  // General behaviour
  invulnerable: boolean;
  noDamageOutput: boolean;
  noKnockback: boolean;
  noGravityWell: boolean;
  noSpinZone: boolean;
  noTriggerZone: boolean;
  // Phasing — bey passes through category entirely (no response, no damage)
  phasesObstacles: boolean;
  phasesArenaBounds: boolean;
  phasesBeys: boolean;
  phasesProjectiles: boolean;
  // Permanent immunity (distinct from i-frame isInvulnerable timer)
  damageImmune: boolean;
  ringOutImmune: boolean;
  burstImmune: boolean;
  spinOutImmune: boolean;
  knockoutImmune: boolean;
  // Friendly collision
  friendlyCollisionEnabled: boolean;
}

export const PHYSICS_FLAGS_DEFAULTS: BeybladePhysicsFlags = {
  collisionWithBeys:         true,
  collisionWithArena:        true,
  collisionWithObstacles:    true,
  collisionWithProjectiles:  true,
  invulnerable:              false,
  noDamageOutput:            false,
  noKnockback:               false,
  noGravityWell:             false,
  noSpinZone:                false,
  noTriggerZone:             false,
  phasesObstacles:           false,
  phasesArenaBounds:         false,
  phasesBeys:                false,
  phasesProjectiles:         false,
  damageImmune:              false,
  ringOutImmune:             false,
  burstImmune:               false,
  spinOutImmune:             false,
  knockoutImmune:            false,
  friendlyCollisionEnabled:  false,
};

export function resolvePhysicsFlags(raw: Partial<BeybladePhysicsFlags> | undefined): BeybladePhysicsFlags {
  return { ...PHYSICS_FLAGS_DEFAULTS, ...(raw ?? {}) };
}

// Matter.js collision category bitmasks.
export const COLLISION_CATEGORIES = {
  BEYBLADE:    0x0001,
  ARENA_WALL:  0x0002,
  OBSTACLE:    0x0004,
  PROJECTILE:  0x0008,
} as const;

/**
 * Build a collision mask for a beyblade based on its physics flags.
 * The mask controls which categories this body will collide with in Matter.js.
 * Phasing flags override the corresponding collision flag — a phasing bey
 * is removed from the mask so Matter.js never generates a contact for that category.
 */
export function buildCollisionMask(flags: BeybladePhysicsFlags): number {
  let mask = 0;
  if (flags.collisionWithBeys        && !flags.phasesBeys)         mask |= COLLISION_CATEGORIES.BEYBLADE;
  if (flags.collisionWithArena       && !flags.phasesArenaBounds)  mask |= COLLISION_CATEGORIES.ARENA_WALL;
  if (flags.collisionWithObstacles   && !flags.phasesObstacles)    mask |= COLLISION_CATEGORIES.OBSTACLE;
  if (flags.collisionWithProjectiles && !flags.phasesProjectiles)  mask |= COLLISION_CATEGORIES.PROJECTILE;
  return mask;
}

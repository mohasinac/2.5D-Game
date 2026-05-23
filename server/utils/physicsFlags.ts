// Physics flags: per-beyblade collision/behavior override set.
// Stored in Firestore beyblade_stats.physicsFlags and applied at match start.

export interface BeybladePhysicsFlags {
  collisionWithBeys: boolean;
  collisionWithArena: boolean;
  collisionWithObstacles: boolean;
  collisionWithProjectiles: boolean;
  invulnerable: boolean;
  noDamageOutput: boolean;
  noKnockback: boolean;
  noGravityWell: boolean;
  noSpinZone: boolean;
  noTriggerZone: boolean;
}

export const PHYSICS_FLAGS_DEFAULTS: BeybladePhysicsFlags = {
  collisionWithBeys:        true,
  collisionWithArena:       true,
  collisionWithObstacles:   true,
  collisionWithProjectiles: true,
  invulnerable:             false,
  noDamageOutput:           false,
  noKnockback:              false,
  noGravityWell:            false,
  noSpinZone:               false,
  noTriggerZone:            false,
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
 * The mask controls which categories this body will collide with.
 */
export function buildCollisionMask(flags: BeybladePhysicsFlags): number {
  let mask = 0;
  if (flags.collisionWithBeys)        mask |= COLLISION_CATEGORIES.BEYBLADE;
  if (flags.collisionWithArena)       mask |= COLLISION_CATEGORIES.ARENA_WALL;
  if (flags.collisionWithObstacles)   mask |= COLLISION_CATEGORIES.OBSTACLE;
  if (flags.collisionWithProjectiles) mask |= COLLISION_CATEGORIES.PROJECTILE;
  return mask;
}

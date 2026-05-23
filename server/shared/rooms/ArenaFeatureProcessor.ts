// Shared arena feature collision/effect processing.
// Extracted from the duplicate processArenaFeatures blocks in
// BattleRoom (~108 LOC), TryoutRoom (~111 LOC), AIBattleRoom, TournamentBattleRoom.
//
// Pure function — takes the beyblade, the arena config, dt, and a physics bridge.
// Returns an effect summary the caller broadcasts.

import * as Matter from "matter-js";
import type { Beyblade, GameState } from "../../rooms/schema/GameState";
import type { ArenaConfig, FloorHazardZoneConfig } from "../../types/shared";
import { wallBowlForce } from "../physics/ArenaUtils";
import { dispatchBehaviorRef, type MechanicContext } from "../../physics/MechanicRegistry";

export interface ArenaPhysicsBridge {
  checkLoopCollision(id: string, loops: any[]): {
    inLoop: boolean;
    loopIndex: number;
    loopConfig: { speedBoost: number; spinBoost?: number } | null;
  };
  checkWaterCollision(id: string, water: any): boolean;
  checkPitCollision(id: string, pits: any[]): {
    damagePerSecond: number;
    escapeThreshold?: number;
  } | null;
  checkObstacleCollision(id: string): { colliding: boolean; obstacleId?: string | null; damage: number };
  applyLoopBoost(id: string, boost: number): void;
  applyWaterResistance(id: string, multiplier: number): void;
  applyForce(id: string, fx: number, fy: number): void;
  applyKnockback(id: string, direction: { x: number; y: number }, distance: number): void;
  /** Set absolute position (used by wrecking_ball and swap_position). */
  setPosition?(id: string, x: number, y: number): void;
  /** Freeze bey velocity in place (sticky physics). */
  setVelocity?(id: string, vx: number, vy: number): void;
  /** Get current position. */
  getPosition?(id: string): { x: number; y: number } | null;
}

export interface ArenaEffectEvents {
  obstacleHit?: { playerId: string; damage: number };
  wallHit?: { playerId: string; damage: number };
  /** Fired when an electric zone or electrified obstacle disables the bey. */
  electricDisable?: { playerId: string; ticks: number };
  /** Fired when a wrecking ball or magnet applies unusual force. */
  specialForce?: { playerId: string; type: string };
}

// ── I2: Behavior executor ────────────────────────────────────────────────────

/** Set of behaviorIds we have already logged an unrecognized-behavior warning for.
 *  Prevents log spam on every tick. */
const _warnedBehaviorIds = new Set<string>();

/**
 * Execute a named behavior on a set of affected beyblades.
 * Dispatches through MechanicRegistry for all namespaced behaviorIds.
 */
function executeBehavior(
  behaviorId: string,
  params: Record<string, unknown>,
  beys: Array<{ id: string; x: number; y: number; velocityX: number; velocityY: number }>,
  physics: ArenaPhysicsBridge,
  beybladeSchema?: Map<string, any>,
): void {
  switch (true) {
    // Inline handler for the most common case (movement.orbit) — keeps zero overhead
    case behaviorId === "movement.orbit": {
      const cx = (params.centerX as number) ?? 0;
      const cy = (params.centerY as number) ?? 0;
      const intensity = (params.intensity as number) ?? 0.002;
      const dir = (params.direction as string) === "ccw" ? -1 : 1;
      for (const bey of beys) {
        const dx = bey.x - cx;
        const dy = bey.y - cy;
        const d = Math.sqrt(dx * dx + dy * dy) || 1;
        physics.applyForce(bey.id, (-dy / d) * dir * intensity, (dx / d) * dir * intensity);
      }
      break;
    }

    // All other namespaced behaviorIds → MechanicRegistry
    case behaviorId.startsWith("movement."):
    case behaviorId.startsWith("factor."):
    case behaviorId.startsWith("transform."):
    case behaviorId.startsWith("spawn."):
    case behaviorId.startsWith("arena."): {
      for (const bey of beys) {
        const beySchema = beybladeSchema?.get(bey.id);
        if (!beySchema) continue;
        const ctx: MechanicContext = {
          bey: beySchema,
          dt: 1 / 60,
          applyForce: physics.applyForce.bind(physics),
          applyKnockback: physics.applyKnockback.bind(physics),
          setVelocity: physics.setVelocity?.bind(physics),
          getPosition: physics.getPosition?.bind(physics),
        };
        dispatchBehaviorRef({ behaviorId, params }, ctx);
      }
      break;
    }

    default:
      if (!_warnedBehaviorIds.has(behaviorId)) {
        _warnedBehaviorIds.add(behaviorId);
        console.warn(`[ArenaFeatureProcessor] Unknown behaviorId "${behaviorId}" — skipping.`);
      }
  }
}

// ── I5: Bey → arena-feature transformation ───────────────────────────────────

export interface BeyTransformState {
  beyId: string;
  transformTo: string;
  savedSpin: number;
  savedBody: Matter.Body;
  expiresAtTick: number;
  tempFeatureId: string;
}

// ── Phase Z helpers ─────────────────────────────────────────────────────────

/** Euclidean distance squared (avoids sqrt when only comparison needed). */
function distSq(ax: number, ay: number, bx: number, by: number): number {
  return (ax - bx) ** 2 + (ay - by) ** 2;
}

/** Returns obstacle x/y in pixels from an obstacle config (which stores cm). */
function obstaclePosPx(obs: any, pxPerCm = 24): { x: number; y: number } {
  // Some older configs store em units; new ones store cm via shape.
  // Heuristic: if the obstacle has a shape.kind, use x/y as cm.
  return { x: (obs.x ?? 0) * pxPerCm, y: (obs.y ?? 0) * pxPerCm };
}

// ── Z1c: Wrecking ball kinematic update ─────────────────────────────────────

/**
 * Each tick, move wrecking_ball obstacles to their swinging position and check
 * if any beyblade is inside the ball's radius.  The "cable" anchor is the
 * obstacle's static x/y position in the arena config; the ball swings from there.
 */
export function processWreckingBalls(
  beyblade: Beyblade,
  obstacles: any[],
  matchElapsedMs: number,
  dt: number,
  physics: ArenaPhysicsBridge,
): ArenaEffectEvents {
  const events: ArenaEffectEvents = {};
  for (const obs of obstacles) {
    // I2: If feature has a behaviorId, hand off to behavior executor and skip default logic
    if (obs.behaviorId) {
      executeBehavior(obs.behaviorId, obs.behaviorParams ?? {}, [beyblade], physics);
      continue;
    }
    if (obs.shape?.kind !== "wrecking_ball") continue;
    if (obs.triggerState === "off") continue;

    const { radiusCm, cableLength, swingAmplitudeDeg, swingPeriodMs, startPhaseDeg = 0 } = obs.shape;
    const phaseDeg = startPhaseDeg + (360 * matchElapsedMs) / (swingPeriodMs || 3000);
    const swingAngleRad = ((swingAmplitudeDeg * Math.cos((phaseDeg * Math.PI) / 180)) * Math.PI) / 180;

    const anchorX = (obs.x ?? 0) * 24;
    const anchorY = (obs.y ?? 0) * 24;
    const ballX = anchorX + Math.sin(swingAngleRad) * cableLength * 24;
    const ballY = anchorY + Math.cos(swingAngleRad) * cableLength * 24;

    const ballRadiusPx = (radiusCm ?? 5) * 24;
    const bx = beyblade.x, by = beyblade.y;

    if (distSq(bx, by, ballX, ballY) < ballRadiusPx ** 2) {
      const nx = bx - ballX, ny = by - ballY;
      const len = Math.sqrt(nx * nx + ny * ny) || 1;
      physics.applyKnockback(beyblade.id, { x: nx / len, y: ny / len }, (obs.recoilDistance ?? 12));
      const dmg = (obs.damage ?? 20) * beyblade.damageTaken;
      beyblade.health -= dmg;
      beyblade.damageReceived += dmg;
      events.obstacleHit = { playerId: beyblade.id, damage: dmg };
    }
  }
  return events;
}

// ── Z1d: Special physics types ──────────────────────────────────────────────

/** Magnetic obstacles: attract or repel beys within magnetRadiusCm. */
export function processMagnets(
  beyblade: Beyblade,
  obstacles: any[],
  physics: ArenaPhysicsBridge,
): void {
  for (const obs of obstacles) {
    // I2: If feature has a behaviorId, hand off to behavior executor and skip default logic
    if (obs.behaviorId) {
      executeBehavior(obs.behaviorId, obs.behaviorParams ?? {}, [beyblade], physics);
      continue;
    }
    const pb = obs.physics;
    if (!pb || pb.type !== "magnetic") continue;
    if (obs.triggerState === "off") continue;

    const radiusPx = (pb.magnetRadiusCm ?? 15) * 24;
    const strength = pb.magnetStrength ?? 5; // + = attract, - = repel
    const opx = obstaclePosPx(obs);
    const dx = opx.x - beyblade.x, dy = opx.y - beyblade.y;
    const d = Math.sqrt(dx * dx + dy * dy) || 1;

    if (d < radiusPx) {
      const falloff = 1 - d / radiusPx;
      const fx = (dx / d) * strength * falloff * 0.001;
      const fy = (dy / d) * strength * falloff * 0.001;
      physics.applyForce(beyblade.id, fx, fy);
    }
  }
}

/** Electrified obstacles: disable combos + specials on contact. */
export function processElectrified(
  beyblade: Beyblade,
  obstacles: any[],
  physics: ArenaPhysicsBridge,
): ArenaEffectEvents {
  const events: ArenaEffectEvents = {};
  for (const obs of obstacles) {
    // I2: If feature has a behaviorId, hand off to behavior executor and skip default logic
    if (obs.behaviorId) {
      executeBehavior(obs.behaviorId, obs.behaviorParams ?? {}, [beyblade], physics);
      continue;
    }
    const pb = obs.physics;
    if (!pb || pb.type !== "electrified") continue;
    if (obs.triggerState === "off") continue;

    const collisionCheck = physics.checkObstacleCollision(beyblade.id);
    if (collisionCheck.colliding && collisionCheck.obstacleId === String(obs.id ?? "")) {
      const disableTicks = pb.disableTicks ?? 60;
      // Extend control lock so combos/specials are blocked.
      const lockUntil = Date.now() + disableTicks * (1000 / 60);
      if (beyblade.controlLockedUntilMs < lockUntil) {
        beyblade.controlLockedUntilMs = lockUntil;
        beyblade.controlLockSource = "electric";
      }
      events.electricDisable = { playerId: beyblade.id, ticks: disableTicks };
    }
  }
  return events;
}

/** Spinner obstacles: add angular velocity impulse on contact. */
export function processSpinners(
  beyblade: Beyblade,
  obstacles: any[],
  physics: ArenaPhysicsBridge,
): void {
  for (const obs of obstacles) {
    // I2: If feature has a behaviorId, hand off to behavior executor and skip default logic
    if (obs.behaviorId) {
      executeBehavior(obs.behaviorId, obs.behaviorParams ?? {}, [beyblade], physics);
      continue;
    }
    const pb = obs.physics;
    if (!pb || pb.type !== "spinner") continue;
    if (obs.triggerState === "off") continue;

    const collisionCheck = physics.checkObstacleCollision(beyblade.id);
    if (collisionCheck.colliding && collisionCheck.obstacleId === String(obs.id ?? "")) {
      const rpm = pb.spinRpmImpulse ?? 200;
      // Convert rpm boost to spin units (game spin is 0–maxSpin ~2000)
      const spinBoost = (rpm / 3000) * beyblade.maxSpin * 0.1;
      beyblade.spin = Math.min(beyblade.maxSpin, beyblade.spin + spinBoost);
    }
  }
}

/** Sticky obstacles: freeze bey velocity for stickyDurationTicks on contact. */
export function processSticky(
  beyblade: Beyblade,
  obstacles: any[],
  physics: ArenaPhysicsBridge,
): void {
  for (const obs of obstacles) {
    // I2: If feature has a behaviorId, hand off to behavior executor and skip default logic
    if (obs.behaviorId) {
      executeBehavior(obs.behaviorId, obs.behaviorParams ?? {}, [beyblade], physics);
      continue;
    }
    const pb = obs.physics;
    if (!pb || pb.type !== "sticky") continue;
    if (obs.triggerState === "off") continue;

    const collisionCheck = physics.checkObstacleCollision(beyblade.id);
    if (collisionCheck.colliding && collisionCheck.obstacleId === String(obs.id ?? "")) {
      const stickyTicks = pb.stickyDurationTicks ?? 30;
      const lockUntil = Date.now() + stickyTicks * (1000 / 60);
      if (beyblade.controlLockedUntilMs < lockUntil) {
        beyblade.controlLockedUntilMs = lockUntil;
        beyblade.controlLockSource = "sticky";
      }
      physics.setVelocity?.(beyblade.id, 0, 0);
    }
  }
}

/** Crushers: no per-bey processing needed (kinematic translate handled in room tick).
 *  On contact, apply extra damage from the crushing force. */
export function processCrushers(
  beyblade: Beyblade,
  obstacles: any[],
  physics: ArenaPhysicsBridge,
): void {
  for (const obs of obstacles) {
    // I2: If feature has a behaviorId, hand off to behavior executor and skip default logic
    if (obs.behaviorId) {
      executeBehavior(obs.behaviorId, obs.behaviorParams ?? {}, [beyblade], physics);
      continue;
    }
    const pb = obs.physics;
    if (!pb || pb.type !== "crusher") continue;
    if (obs.triggerState === "off") continue;

    const collisionCheck = physics.checkObstacleCollision(beyblade.id);
    if (collisionCheck.colliding && collisionCheck.obstacleId === String(obs.id ?? "")) {
      // Crusher hits deal 1.5× the base obstacle damage.
      const extraDmg = (obs.damage ?? 20) * 0.5 * beyblade.damageTaken;
      beyblade.health -= extraDmg;
      beyblade.damageReceived += extraDmg;
    }
  }
}

// ── Z5c: Floor hazard + effect zone overlap checks ──────────────────────────

const HARDCODED_ZONE_IMMUNITIES: Record<string, string[]> = {
  fire:["ice"], water:["fire"], earth:["electric","emp"], lightning:["electric","emp"],
  wind:["time_slow","sticky","mud"], ice:["ice"], light:["void"], nature:["drain"],
  thunder:["electric","emp"],
  void:["lava","ice","mud","healing","emp","magnet","antigravity","electric","time_slow","repulsion","size_shrink","size_grow","trampoline","combo_boost","drain"],
};

export function processFloorHazardZones(
  beyblade: Beyblade,
  zones: FloorHazardZoneConfig[],
  dt: number,
  physics: ArenaPhysicsBridge,
  customZoneImmunities?: Record<string, string[]>,
): ArenaEffectEvents {
  const events: ArenaEffectEvents = {};
  if (!zones?.length) return events;

  const effectiveImmunities = customZoneImmunities ?? HARDCODED_ZONE_IMMUNITIES;

  for (const zone of zones) {
    if (zone.activeByDefault === false) continue;

    const radiusPx = (zone.radius_cm ?? 5) * 24;
    const zx = (zone.x_cm ?? 0) * 24;
    const zy = (zone.y_cm ?? 0) * 24;
    const inZone = distSq(beyblade.x, beyblade.y, zx, zy) < radiusPx ** 2;
    if (!inZone) continue;

    // AB7: element immunity check — skip this zone entirely if bey is immune
    const beyElems: string[] = (beyblade as any).elementTypes ?? [];
    if (beyElems.length > 0 && (zone as any).elementType) {
      const isImmune = beyElems.some(e => effectiveImmunities[e]?.includes(zone.hazardType ?? ""));
      if (isImmune) continue;
    }

    let intensity = zone.intensity ?? 1.0;

    // AB7: zone bonus — bey element matches zone element → bonus effect
    if (beyElems.length > 0 && (zone as any).elementType && beyElems.includes((zone as any).elementType)) {
      intensity *= 1.5; // 50% stronger effect for matching element
    }

    switch (zone.hazardType) {
      case "lava":
        beyblade.health -= (zone.damagePerTick ?? 5) * intensity;
        beyblade.spin = Math.max(0, beyblade.spin - (beyblade.maxSpin * (zone.spinDecayMult ?? 1.5) - beyblade.maxSpin) * dt);
        break;

      case "electric": {
        const ticks = (zone.disableTicks ?? 90) | 0;
        const lockUntil = Date.now() + ticks * (1000 / 60);
        if (beyblade.controlLockedUntilMs < lockUntil) {
          beyblade.controlLockedUntilMs = lockUntil;
          beyblade.controlLockSource = "electric";
        }
        events.electricDisable = { playerId: beyblade.id, ticks };
        break;
      }

      case "time_slow":
        // Multiply bey velocity down — the physics bridge handles actual velocity;
        // we approximate by reducing speed via a force opposing motion.
        physics.applyForce(
          beyblade.id,
          -beyblade.velocityX * 0.7 * intensity * dt,
          -beyblade.velocityY * 0.7 * intensity * dt,
        );
        break;

      case "repulsion": {
        const dx = beyblade.x - zx, dy = beyblade.y - zy;
        const d = Math.sqrt(dx * dx + dy * dy) || 1;
        physics.applyForce(beyblade.id, (dx / d) * 0.05 * intensity, (dy / d) * 0.05 * intensity);
        break;
      }

      case "drain":
        beyblade.power = Math.max(0, (beyblade.power ?? 0) - 2 * intensity * dt * 60);
        break;

      case "ice":
        physics.applyWaterResistance(beyblade.id, zone.frictionMultiplier ?? 0.05);
        break;

      case "mud":
        physics.applyWaterResistance(beyblade.id, 2.5 * intensity);
        break;

      case "trampoline":
        // Pop-up effect applied once on zone contact
        physics.applyForce(beyblade.id, 0, -0.1 * intensity);
        break;

      case "combo_boost":
        beyblade.power = Math.min(100, (beyblade.power ?? 0) + 3 * intensity * dt * 60);
        break;

      case "void":
        // Instant ring-out zone — set isRingOut
        beyblade.isRingOut = true;
        break;

      case "poison":
        // Spin drain + health damage (like lava but weaker and no fire theme)
        beyblade.health -= (zone.damagePerTick ?? 2) * intensity;
        beyblade.spin = Math.max(0, beyblade.spin - 15 * intensity * dt);
        break;

      // size_shrink / size_grow are visual; no server-side stat changes needed here.
    }
  }
  return events;
}

export function processEffectZones(
  beyblade: Beyblade,
  zones: any[],
  dt: number,
  physics: ArenaPhysicsBridge,
): void {
  if (!zones?.length) return;
  for (const zone of zones) {
    if (zone.activeByDefault === false) continue;

    const radiusPx = (zone.radius_cm ?? 5) * 24;
    const zx = (zone.x_cm ?? 0) * 24, zy = (zone.y_cm ?? 0) * 24;
    if (distSq(beyblade.x, beyblade.y, zx, zy) >= radiusPx ** 2) continue;

    const intensity = zone.intensity ?? 1.0;
    switch (zone.effectType) {
      case "power_charge":
        beyblade.power = Math.min(100, (beyblade.power ?? 0) + 2 * intensity * dt * 60);
        break;
      case "spin_recovery":
        beyblade.spin = Math.min(beyblade.maxSpin, beyblade.spin + 50 * intensity * dt);
        break;
      case "turbo_zone":
        physics.applyForce(beyblade.id, beyblade.velocityX * 0.3 * intensity * dt, beyblade.velocityY * 0.3 * intensity * dt);
        break;
      case "safe_zone":
        // Nullify incoming damage — handled upstream by checking safe zone flag
        break;
      case "respawn_point":
        // Just mark position; actual respawn logic is in the room
        break;
    }
  }
}

// ── Z7a: Ramp physics ────────────────────────────────────────────────────────

/**
 * Apply ramp force to a bey standing on a ramp obstacle.
 * For 2D this is a lateral force in the direction of the ramp slope.
 */
export function processRamps(
  beyblade: Beyblade,
  obstacles: any[],
  dt: number,
  physics: ArenaPhysicsBridge,
): void {
  for (const obs of obstacles) {
    // I2: If feature has a behaviorId, hand off to behavior executor and skip default logic
    if (obs.behaviorId) {
      executeBehavior(obs.behaviorId, obs.behaviorParams ?? {}, [beyblade], physics);
      continue;
    }
    const pb = obs.physics;
    if (!pb || pb.type !== "ramp") continue;
    if (obs.triggerState === "off") continue;

    const collisionCheck = physics.checkObstacleCollision(beyblade.id);
    if (!collisionCheck.colliding || collisionCheck.obstacleId !== String(obs.id ?? "")) continue;

    const rampAngleDeg = pb.rampAngleDeg ?? 30;
    const rampAngleRad = (rampAngleDeg * Math.PI) / 180;
    const gravity = 980; // cm/s² (approximate)
    const rampForce = Math.sin(rampAngleRad) * beyblade.mass * gravity * 0.000001;

    // Apply force in the down-ramp direction (toward lower edge of obstacle)
    const obsAngle = Math.atan2(obs.y ?? 0, obs.x ?? 0) + Math.PI;
    physics.applyForce(beyblade.id, Math.cos(obsAngle) * rampForce * dt, Math.sin(obsAngle) * rampForce * dt);
  }
}

// ── Z7b: Ledge physics ───────────────────────────────────────────────────────

/**
 * When a bey crosses a ledge boundary, apply a pop impulse (two-way) or
 * reflect velocity (one-way high-to-low crossing).
 */
export function processLedges(
  beyblade: Beyblade,
  obstacles: any[],
  dt: number,
  physics: ArenaPhysicsBridge,
): void {
  for (const obs of obstacles) {
    // I2: If feature has a behaviorId, hand off to behavior executor and skip default logic
    if (obs.behaviorId) {
      executeBehavior(obs.behaviorId, obs.behaviorParams ?? {}, [beyblade], physics);
      continue;
    }
    const pb = obs.physics;
    if (!pb || pb.type !== "ledge") continue;
    if (obs.triggerState === "off") continue;

    const collisionCheck = physics.checkObstacleCollision(beyblade.id);
    if (!collisionCheck.colliding || collisionCheck.obstacleId !== String(obs.id ?? "")) continue;

    const jumpableHeightCm = pb.jumpableHeightCm ?? 4;
    const impulse = jumpableHeightCm * 40 * 0.000001;

    if (pb.direction === "one-way") {
      // Block high→low crossing: reflect y-velocity
      physics.applyForce(beyblade.id, 0, -beyblade.velocityY * 2);
    } else {
      // Two-way: pop impulse upward
      physics.applyForce(beyblade.id, 0, -impulse);
    }
  }
}

// ── Z8c: Environmental effects (wind / storm) ────────────────────────────────

/**
 * Apply per-tick wind / environmental forces.
 * Called from BattleRoom.tick() once per frame if arena.environmentalEffect is set.
 */
export function applyEnvironmentalEffects(
  beyblade: Beyblade,
  envEffect: { preset: string; intensity?: number; intervalMs?: number } | undefined,
  matchElapsedMs: number,
  dt: number,
  physics: ArenaPhysicsBridge,
): void {
  if (!envEffect) return;
  const intensity = envEffect.intensity ?? 0.5;

  switch (envEffect.preset) {
    case "storm": {
      // Oscillating lateral wind
      const period = envEffect.intervalMs ?? 4000;
      const wind = Math.sin((2 * Math.PI * matchElapsedMs) / period) * intensity * 0.003;
      physics.applyForce(beyblade.id, wind, 0);
      break;
    }
    case "blizzard": {
      // Fixed lateral force
      physics.applyForce(beyblade.id, intensity * 0.002, 0);
      break;
    }
    case "volcanic": {
      // Periodic upward push (thermal updraft approximation)
      const pop = Math.abs(Math.sin((2 * Math.PI * matchElapsedMs) / 3000)) * intensity * 0.002;
      physics.applyForce(beyblade.id, 0, -pop);
      break;
    }
    case "underwater": {
      // Drag — oppose velocity
      physics.applyForce(beyblade.id, -beyblade.velocityX * 0.15 * intensity * dt, -beyblade.velocityY * 0.15 * intensity * dt);
      break;
    }
    case "earthquake": {
      // Periodic random shake — every ~2s
      if (Math.floor(matchElapsedMs / 2000) !== Math.floor((matchElapsedMs - dt * 1000) / 2000)) {
        const shakeX = (Math.random() - 0.5) * intensity * 0.01;
        const shakeY = (Math.random() - 0.5) * intensity * 0.01;
        physics.applyForce(beyblade.id, shakeX, shakeY);
      }
      break;
    }
  }
}

// ── AA6: Arena-wide spawn position resolution ────────────────────────────────

export interface ResolvedPosition { x: number; y: number; }

/**
 * Resolve `scattered_in_arena` spawn positions using the room PRNG.
 * Attempts up to 200 random samples to place `count` non-overlapping points.
 * Falls back to best effort if constraints can't all be satisfied.
 */
export function resolveScatteredInArena(
  count: number,
  arenaRadiusPx: number,
  arenaCx: number,
  arenaCy: number,
  rand: () => number,
  minSpacingCm = 10,
  avoidCenterCm = 0,
  avoidEdgeCm = 0,
): ResolvedPosition[] {
  const PX_PER_CM = 24;
  const minSpacingPx = minSpacingCm * PX_PER_CM;
  const avoidCenterPx = avoidCenterCm * PX_PER_CM;
  const innerRadius = Math.max(0, avoidCenterPx);
  const outerRadius = arenaRadiusPx - avoidEdgeCm * PX_PER_CM;

  const positions: ResolvedPosition[] = [];
  const maxAttempts = 200;
  let attempt = 0;

  while (positions.length < count && attempt < maxAttempts) {
    attempt++;
    const angle = rand() * Math.PI * 2;
    const r = innerRadius + rand() * (outerRadius - innerRadius);
    const x = arenaCx + Math.cos(angle) * r;
    const y = arenaCy + Math.sin(angle) * r;

    const tooClose = positions.some(p => {
      const dx = p.x - x; const dy = p.y - y;
      return dx * dx + dy * dy < minSpacingPx * minSpacingPx;
    });
    if (!tooClose) positions.push({ x, y });
  }
  return positions;
}

/**
 * Resolve `ring_around_arena` spawn positions — evenly spaced on a circle.
 * radiusFraction: 0–1 fraction of arenaRadiusPx.
 */
export function resolveRingAroundArena(
  count: number,
  radiusFraction: number,
  arenaRadiusPx: number,
  arenaCx: number,
  arenaCy: number,
  startAngle = 0,
): ResolvedPosition[] {
  const r = arenaRadiusPx * Math.max(0.05, Math.min(1.0, radiusFraction));
  const positions: ResolvedPosition[] = [];
  for (let i = 0; i < count; i++) {
    const angle = startAngle + (i / count) * Math.PI * 2;
    positions.push({ x: arenaCx + Math.cos(angle) * r, y: arenaCy + Math.sin(angle) * r });
  }
  return positions;
}

/**
 * Resolve `entire_arena` — returns the arena center with the full arena radius.
 * The caller uses this to create a single zone covering the whole arena.
 */
export function resolveEntireArena(
  arenaRadiusPx: number,
  arenaCx: number,
  arenaCy: number,
): ResolvedPosition & { radiusPx: number } {
  return { x: arenaCx, y: arenaCy, radiusPx: arenaRadiusPx };
}

/**
 * AA6: Unified spawn position resolver.
 *
 * Converts arena-design position types ("entire_arena", "scattered_in_arena",
 * "ring_around_arena") into concrete cm-space coordinates using a seeded PRNG
 * so results are deterministic per match.
 *
 * All coordinates are returned relative to the arena center (0, 0).
 *
 * @param positionType  - Layout strategy.
 * @param params        - Per-strategy tuning knobs (all optional).
 * @param arenaRadiusCm - Playable arena radius in centimetres.
 * @param prng          - Seeded PRNG function; must NOT be Math.random.
 */
export function resolveArenaSpawnPositions(
  positionType: "entire_arena" | "scattered_in_arena" | "ring_around_arena",
  params: {
    count?: number;
    minSpacingCm?: number;
    avoidCenterCm?: number;
    avoidEdgeCm?: number;
    radiusFraction?: number;
  },
  arenaRadiusCm: number,
  prng: () => number,
): Array<{ x: number; y: number }> {
  const count = params.count ?? 4;
  const positions: Array<{ x: number; y: number }> = [];

  if (positionType === "ring_around_arena") {
    const r = arenaRadiusCm * (params.radiusFraction ?? 0.75);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      positions.push({ x: Math.cos(angle) * r, y: Math.sin(angle) * r });
    }
    return positions;
  }

  if (positionType === "entire_arena") {
    // One zone covering entire arena — caller uses arenaRadiusCm as zone radius.
    return [{ x: 0, y: 0 }];
  }

  // scattered_in_arena: pick N valid positions with minSpacing enforcement.
  const maxR = arenaRadiusCm - (params.avoidEdgeCm ?? 10);
  const minR = params.avoidCenterCm ?? 0;
  const minSpacing = params.minSpacingCm ?? 20;

  let attempts = 0;
  while (positions.length < count && attempts < count * 20) {
    attempts++;
    const angle = prng() * Math.PI * 2;
    const r = minR + prng() * (maxR - minR);
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;
    const tooClose = positions.some(p => Math.hypot(x - p.x, y - p.y) < minSpacing);
    if (!tooClose) positions.push({ x, y });
  }
  return positions;
}

// ── V5: Elevation zone physics ───────────────────────────────────────────────

/**
 * Apply spin boost to a beyblade while it is inside an elevation zone (raised platform).
 * Supports both `x_cm`/`y_cm`/`radius_cm` (primary schema fields) and
 * `x`/`y`/`radius` (V4 spec alias fields).
 */
export function processElevationZones(
  beyblade: Beyblade,
  zones: any[],
  dt: number,
): void {
  if (!zones?.length) return;
  for (const zone of zones) {
    if (!zone) continue;
    if (zone.activeByDefault === false) continue;
    if (zone.controlledBySwitchId && zone.triggerState === "off") continue;

    const zx = ((zone.x_cm ?? zone.x) ?? 0) * 24;
    const zy = ((zone.y_cm ?? zone.y) ?? 0) * 24;
    const zr = ((zone.radius_cm ?? zone.radius) ?? 5) * 24;
    if (distSq(beyblade.x, beyblade.y, zx, zy) >= zr * zr) continue;

    // spinBoostPercent (V4 spec field) takes priority over spinBoostOnPlatform (spin/s)
    const spinBoostPct = zone.spinBoostPercent as number | undefined;
    const spinBoostPerSec = zone.spinBoostOnPlatform as number | undefined;

    if (spinBoostPct !== undefined && spinBoostPct > 0) {
      // Percentage of current spin per second
      beyblade.spin = Math.min(
        beyblade.maxSpin,
        beyblade.spin + beyblade.spin * (spinBoostPct / 100) * dt,
      );
    } else if (spinBoostPerSec !== undefined && spinBoostPerSec > 0) {
      beyblade.spin = Math.min(beyblade.maxSpin, beyblade.spin + spinBoostPerSec * dt);
    }
  }
}

// Process all per-tick arena interactions for a single beyblade.
// Side-effects: mutates beyblade fields, calls into the physics bridge.
// Returns events the room may want to broadcast.
export function processArenaFeatures(
  beyblade: Beyblade,
  arenaData: ArenaConfig,
  arenaState: GameState["arena"],
  dt: number,
  physics: ArenaPhysicsBridge,
  rand: () => number,
  matchElapsedMs = 0,
  customZoneImmunities?: Record<string, string[]>,
): ArenaEffectEvents {
  const events: ArenaEffectEvents = {};

  // ─── Speed loops ───────────────────────────────────────────────────────────
  if ((arenaData.loops?.length ?? 0) > 0) {
    const loopCheck = physics.checkLoopCollision(beyblade.id, arenaData.loops ?? []);
    if (loopCheck.inLoop && loopCheck.loopConfig) {
      if (!beyblade.inLoop) {
        beyblade.inLoop = true;
        beyblade.loopIndex = loopCheck.loopIndex;
        beyblade.loopEntryTime = Date.now();
        beyblade.loopSpeedBoost = loopCheck.loopConfig.speedBoost;
        beyblade.loopSpinBoost = loopCheck.loopConfig.spinBoost || 0;
        physics.applyLoopBoost(beyblade.id, loopCheck.loopConfig.speedBoost);
      }
      if (beyblade.loopSpinBoost > 0) {
        beyblade.spin = Math.min(beyblade.maxSpin, beyblade.spin + beyblade.loopSpinBoost * dt);
      }
    } else if (beyblade.inLoop) {
      beyblade.inLoop = false;
      beyblade.loopIndex = -1;
      beyblade.loopSpeedBoost = 1.0;
      beyblade.loopSpinBoost = 0;
    }
  }

  // ─── Water bodies ──────────────────────────────────────────────────────────
  const waterBodies = arenaData.waterBodies;
  if ((waterBodies?.length ?? 0) > 0) {
    const inWater = physics.checkWaterCollision(beyblade.id, waterBodies![0]);
    if (inWater) {
      if (!beyblade.inWater) {
        beyblade.inWater = true;
        const wc = waterBodies![0];
        const speedLoss = wc.effects?.speedLoss ?? 0.3;
        beyblade.waterSpeedMultiplier = 1 - speedLoss;
        beyblade.waterSpinDrain = wc.effects?.spinDrainPerSecond ?? 10;
      }
      physics.applyWaterResistance(beyblade.id, beyblade.waterSpeedMultiplier);
      beyblade.spin = Math.max(0, beyblade.spin - beyblade.waterSpinDrain * dt);
    } else if (beyblade.inWater) {
      beyblade.inWater = false;
      beyblade.waterSpeedMultiplier = 1.0;
      beyblade.waterSpinDrain = 0;
    }
  }

  // ─── Pits ──────────────────────────────────────────────────────────────────
  if ((arenaData.pits?.length ?? 0) > 0) {
    const pitConfig = physics.checkPitCollision(beyblade.id, arenaData.pits ?? []);
    if (pitConfig) {
      if (!beyblade.inPit) {
        beyblade.inPit = true;
        beyblade.currentPitId = `pit_${arenaData.pits?.indexOf(pitConfig as any) ?? 0}`;
        beyblade.pitDamageRate = pitConfig.damagePerSecond;

        // spike_pit: instant ring-out, no escape chance
        if ((pitConfig as any).type === "spike_pit") {
          beyblade.isRingOut = true;
          beyblade.eliminationType = "ring_out";
          beyblade.inPit = false;
          return events;
        }
      }
      beyblade.spin = Math.max(0, beyblade.spin - beyblade.pitDamageRate * beyblade.spin * dt / 100);
      const escapeThreshold = pitConfig.escapeThreshold ?? 50;
      const canEscape = beyblade.spin > (beyblade.maxSpin * escapeThreshold / 100);
      if (canEscape && rand() < 0.1 * dt) {
        beyblade.inPit = false;
        beyblade.currentPitId = "";
        beyblade.pitDamageRate = 0;
        physics.applyForce(beyblade.id, 0, -0.05 * beyblade.mass);
      }
    } else if (beyblade.inPit) {
      beyblade.inPit = false;
      beyblade.currentPitId = "";
      beyblade.pitDamageRate = 0;
    }
  }

  // ─── Obstacles ─────────────────────────────────────────────────────────────
  const obstacleCheck = physics.checkObstacleCollision(beyblade.id);
  if (obstacleCheck.colliding) {
    if (!beyblade.collidingWithObstacle || beyblade.lastObstacleId !== obstacleCheck.obstacleId) {
      beyblade.collidingWithObstacle = true;
      beyblade.lastObstacleId = obstacleCheck.obstacleId || "";
      const damage = obstacleCheck.damage * beyblade.damageTaken;
      beyblade.health -= damage;
      beyblade.damageReceived += damage;
      physics.applyKnockback(
        beyblade.id,
        { x: beyblade.velocityX, y: beyblade.velocityY },
        beyblade.knockbackDistance,
      );
      events.obstacleHit = { playerId: beyblade.id, damage };
    }
  } else {
    beyblade.collidingWithObstacle = false;
    beyblade.lastObstacleId = "";
  }

  // ─── Wall ──────────────────────────────────────────────────────────────────
  if (arenaData.wall?.enabled) {
    const dx = beyblade.x - (arenaState.width * 16) / 2;
    const dy = beyblade.y - (arenaState.height * 16) / 2;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const arenaRadius = Math.min(arenaState.width, arenaState.height) * 16 * 0.45;

    if (distance > arenaRadius * 0.95) {
      let wallDamage = arenaData.wall.baseDamage;
      if (arenaData.wall.hasSpikes) wallDamage *= arenaData.wall.spikeDamageMultiplier;
      wallDamage *= beyblade.damageTaken;

      beyblade.health -= wallDamage;
      beyblade.damageReceived += wallDamage;

      const wallForce = wallBowlForce(
        arenaData.wall.recoilDistance * beyblade.knockbackDistance,
        arenaState.wallAngle,
      );
      physics.applyKnockback(beyblade.id, { x: -dx, y: -dy }, wallForce);
      events.wallHit = { playerId: beyblade.id, damage: wallDamage };
    }
  }

  // ─── Phase Z: new physics types ────────────────────────────────────────────
  if ((arenaData.obstacles?.length ?? 0) > 0) {
    const obs = arenaData.obstacles as any[];

    // Z1c — wrecking balls
    const wbEvents = processWreckingBalls(beyblade, obs, matchElapsedMs, dt, physics);
    if (wbEvents.obstacleHit) events.obstacleHit = wbEvents.obstacleHit;

    // Z1d — magnetic / electrified / spinner / sticky / crusher
    processMagnets(beyblade, obs, physics);
    const elEvents = processElectrified(beyblade, obs, physics);
    if (elEvents.electricDisable) events.electricDisable = elEvents.electricDisable;
    processSpinners(beyblade, obs, physics);
    processSticky(beyblade, obs, physics);
    processCrushers(beyblade, obs, physics);

    // Z7 — ramps + ledges
    processRamps(beyblade, obs, dt, physics);
    processLedges(beyblade, obs, dt, physics);
  }

  // Z5c — floor hazard zones
  if ((arenaData.floorHazardZones?.length ?? 0) > 0) {
    const fhEvents = processFloorHazardZones(beyblade, arenaData.floorHazardZones!, dt, physics, customZoneImmunities);
    if (fhEvents.electricDisable) events.electricDisable = fhEvents.electricDisable;
  }

  // V5 — elevation zones (raised platforms with spin boost)
  if ((arenaData as any).elevationZones?.length) {
    processElevationZones(beyblade, (arenaData as any).elevationZones, dt);
  }

  // Z5c — effect zones
  if ((arenaData as any).effectZones?.length) {
    processEffectZones(beyblade, (arenaData as any).effectZones, dt, physics);
  }

  // Z8c — environmental effects
  if ((arenaData as any).environmentalEffect) {
    applyEnvironmentalEffects(beyblade, (arenaData as any).environmentalEffect, matchElapsedMs, dt, physics);
  }

  // ─── Spin zones ────────────────────────────────────────────────────────────
  const spinZones: any[] = (arenaData as any).spinZones ?? [];
  for (const zone of spinZones) {
    if (!zone) continue;
    // I2: behaviorId check — hand off and skip default logic
    if (zone.behaviorId) {
      executeBehavior(zone.behaviorId, zone.behaviorParams ?? {}, [beyblade], physics);
      continue;
    }
    if (zone.controlledBySwitchId && zone.triggerState === "off") continue;
    const zxPx = (zone.x_cm ?? 0) * 24;
    const zyPx = (zone.y_cm ?? 0) * 24;
    const zrPx = (zone.radius_cm ?? 5) * 24;
    if (distSq(beyblade.x, beyblade.y, zxPx, zyPx) >= zrPx * zrPx) continue;

    const intensityRad = zone.intensityRadPerSec ?? 1.0;
    const dir = zone.direction === "ccw" ? -1 : 1;
    const applyTo: string = zone.applyTo ?? "both";

    if (applyTo === "linear" || applyTo === "both") {
      // Orbit: tangent force around zone center
      const dx = beyblade.x - zxPx;
      const dy = beyblade.y - zyPx;
      const d = Math.sqrt(dx * dx + dy * dy) || 1;
      const tx = (-dy / d) * dir;
      const ty = (dx / d) * dir;
      physics.applyForce(beyblade.id, tx * intensityRad * 0.002, ty * intensityRad * 0.002);
    }
    if (applyTo === "spin" || applyTo === "both") {
      // Spin top-up in the zone's spin direction
      const spinBoost = intensityRad * 10 * dt;
      beyblade.spin = Math.min(beyblade.maxSpin, beyblade.spin + spinBoost);
    }
  }

  // ─── Gravity holes ─────────────────────────────────────────────────────────
  const gravityHoles: any[] = (arenaData as any).gravityHoles ?? [];
  for (const hole of gravityHoles) {
    if (!hole) continue;
    // I2: behaviorId check — hand off and skip default logic
    if (hole.behaviorId) {
      executeBehavior(hole.behaviorId, hole.behaviorParams ?? {}, [beyblade], physics);
      continue;
    }
    if (hole.controlledBySwitchId && hole.triggerState === "off") continue;
    const hxPx = (hole.x_cm ?? 0) * 24;
    const hyPx = (hole.y_cm ?? 0) * 24;
    const hrPx = (hole.effectiveRadiusCm ?? 10) * 24;
    const dx = hxPx - beyblade.x;
    const dy = hyPx - beyblade.y;
    const d = Math.sqrt(dx * dx + dy * dy) || 1;
    if (d >= hrPx) continue;

    const forceN = hole.forceN ?? 0.01;
    const falloff = 1 - d / hrPx;
    const fx = (dx / d) * forceN * falloff;
    const fy = (dy / d) * forceN * falloff;
    physics.applyForce(beyblade.id, fx, fy);
  }

  // ─── Bumps ─────────────────────────────────────────────────────────────────
  const bumps: any[] = (arenaData as any).bumps ?? [];
  for (const bump of bumps) {
    if (!bump) continue;
    // I2: behaviorId check — hand off and skip default logic
    if (bump.behaviorId) {
      executeBehavior(bump.behaviorId, bump.behaviorParams ?? {}, [beyblade], physics);
      continue;
    }
    if (bump.controlledBySwitchId && bump.triggerState === "off") continue;
    const bxPx = (bump.x_cm ?? 0) * 24;
    const byPx = (bump.y_cm ?? 0) * 24;
    const brPx = (bump.radius_cm ?? 3) * 24;
    if (distSq(beyblade.x, beyblade.y, bxPx, byPx) >= brPx * brPx) continue;

    // Vertical pop + lateral recoil from bump center
    const recoil = bump.recoil ?? 0.05;
    const ddx = beyblade.x - bxPx;
    const ddy = beyblade.y - byPx;
    const dd = Math.sqrt(ddx * ddx + ddy * ddy) || 1;
    physics.applyForce(beyblade.id, (ddx / dd) * recoil, (ddy / dd) * recoil);
  }

  // ─── Directional Zones (Phase ZP) ─────────────────────────────────────────
  const directionalZones: any[] = (arenaData as any).directionalZones ?? [];
  for (const zone of directionalZones) {
    if (!zone) continue;
    if (zone.behaviorId) {
      executeBehavior(zone.behaviorId, zone.behaviorParams ?? {}, [beyblade], physics);
      continue;
    }
    if (zone.controlledBySwitchId && zone.triggerState === "off") continue;

    // Pulse gating
    if (zone.pulse) {
      const cycle = (zone.pulse.activeMs + zone.pulse.pauseMs);
      const phase = matchElapsedMs % cycle;
      if (phase > zone.pulse.activeMs) continue;
    }

    const zxPx = (zone.x_cm ?? 0) * 24;
    const zyPx = (zone.y_cm ?? 0) * 24;
    const zrPx = (zone.radius_cm ?? 8) * 24;
    const angleRad = ((zone.angleDeg ?? 0) * Math.PI) / 180;
    const force: number = zone.force ?? 0.005;
    const bx = beyblade.x, by = beyblade.y;
    const dx = bx - zxPx, dy = by - zyPx;

    switch (zone.type) {
      case "wind_corridor": {
        // Rectangle: perpendicular axis check
        const halfW = ((zone.width_cm ?? 8) * 24) / 2;
        const halfL = ((zone.length_cm ?? 20) * 24) / 2;
        const cosA = Math.cos(angleRad), sinA = Math.sin(angleRad);
        const localX = dx * cosA + dy * sinA;
        const localY = -dx * sinA + dy * cosA;
        if (Math.abs(localX) > halfL || Math.abs(localY) > halfW) break;
        // Push in wind direction
        physics.applyForce(beyblade.id, Math.cos(angleRad) * force, Math.sin(angleRad) * force);
        break;
      }
      case "tornado": {
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        if (dist > zrPx) break;
        const falloff = 1 - dist / zrPx;
        const spinDir = zone.spinDirection === "ccw" ? -1 : 1;
        const rotFactor = zone.rotationFactor ?? 1.0;
        // Tangential orbit component
        const tx = (-dy / dist) * spinDir;
        const ty = (dx / dist) * spinDir;
        physics.applyForce(beyblade.id, tx * force * rotFactor * falloff, ty * force * rotFactor * falloff);
        // Inward pull component — stronger near rim, gentler at eye
        const pullForce = (zone.centerPullForce ?? force * 0.5);
        const rimFalloff = dist / zrPx; // 0 at center, 1 at rim
        physics.applyForce(beyblade.id, (-dx / dist) * pullForce * rimFalloff, (-dy / dist) * pullForce * rimFalloff);
        break;
      }
      case "vortex": {
        // Pure inward spiral — quadratic pull near center
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        if (dist > zrPx) break;
        const t = 1 - dist / zrPx; // 0 at rim, 1 at center
        const pullF = (zone.centerPullForce ?? force) * t * t;
        physics.applyForce(beyblade.id, (-dx / dist) * pullF, (-dy / dist) * pullF);
        // Weak tangent at rim, strong at center
        const spinDir2 = zone.spinDirection === "ccw" ? -1 : 1;
        const tx2 = (-dy / dist) * spinDir2 * t;
        const ty2 = (dx / dist) * spinDir2 * t;
        physics.applyForce(beyblade.id, tx2 * force * 0.4, ty2 * force * 0.4);
        break;
      }
      case "updraft": {
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        if (dist > zrPx) break;
        // Reduce outward drift (pull toward zone center softly)
        physics.applyForce(beyblade.id, (-dx / dist) * force * 0.3, (-dy / dist) * force * 0.3);
        // Spin recovery bonus
        const recovPerSec = zone.spinRecoveryPerSec ?? 30;
        beyblade.spin = Math.min(beyblade.maxSpin, beyblade.spin + recovPerSec * dt);
        break;
      }
      case "downdraft": {
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        if (dist > zrPx) break;
        // Pin beys in place — apply velocity damping
        if (physics.setVelocity) {
          physics.setVelocity(beyblade.id, beyblade.velocityX * 0.85, beyblade.velocityY * 0.85);
        }
        // Extra spin drain
        const drainMult = zone.spinDrainMult ?? 1.5;
        beyblade.spin = Math.max(0, beyblade.spin - (beyblade.spin * 0.008 * drainMult * dt));
        break;
      }
      case "slipstream": {
        // Rectangular channel aligned with angleDeg — reduces drag, pushes gently along lane
        const halfW = ((zone.width_cm ?? 6) * 24) / 2;
        const halfL = ((zone.length_cm ?? 18) * 24) / 2;
        const cosA = Math.cos(angleRad), sinA = Math.sin(angleRad);
        const localX = dx * cosA + dy * sinA;
        const localY = -dx * sinA + dy * cosA;
        if (Math.abs(localX) > halfL || Math.abs(localY) > halfW) break;
        // Gentle push + velocity amplification along lane
        physics.applyForce(beyblade.id, Math.cos(angleRad) * force * 0.6, Math.sin(angleRad) * force * 0.6);
        beyblade.velocityX *= 1 + 0.02 * dt;
        beyblade.velocityY *= 1 + 0.02 * dt;
        break;
      }
      case "dust_devil": {
        // Small fast-spinning column — erratic orbit + random wobble
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        if (dist > zrPx) break;
        const spinDir3 = zone.spinDirection === "ccw" ? -1 : 1;
        const tx3 = (-dy / dist) * spinDir3;
        const ty3 = (dx / dist) * spinDir3;
        const falloff3 = 1 - dist / zrPx;
        physics.applyForce(beyblade.id, tx3 * force * 1.8 * falloff3, ty3 * force * 1.8 * falloff3);
        // Random wobble (seeded from beyblade id to stay deterministic enough)
        const wobble = force * 0.5;
        const seed = (beyblade.x * 7 + beyblade.y * 13 + matchElapsedMs * 0.001) % 1;
        physics.applyForce(beyblade.id, (seed - 0.5) * wobble, ((seed * 1.618) % 1 - 0.5) * wobble);
        break;
      }
    }
  }

  return events;
}

// ── G1: processTriggerZones (P0 CRITICAL) ────────────────────────────────────

export function processTriggerZones(
  beyblade: Beyblade,
  triggerZones: any[],
  dt: number,
  physics: ArenaPhysicsBridge,
  physFlagsCache?: Map<string, any>,
): ArenaEffectEvents {
  const events: ArenaEffectEvents = {};
  if (!triggerZones?.length) return events;

  const bx = beyblade.x, by = beyblade.y;

  for (const zone of triggerZones) {
    if (zone.triggerState === "off") continue;
    if (physFlagsCache?.get(beyblade.id)?.noTriggerZone) continue;

    const zx = (zone.x_cm ?? zone.x ?? 0) * 24;
    const zy = (zone.y_cm ?? zone.y ?? 0) * 24;
    const zr = (zone.radius_cm ?? zone.radius ?? 2) * 24;
    const inZone = (bx - zx) ** 2 + (by - zy) ** 2 <= zr ** 2;
    if (!inZone) continue;

    const kind = typeof zone.kind === "string" ? zone.kind : zone.kind?.type ?? "";

    switch (kind) {
      case "damage":
        if (!beyblade.invulnerable) {
          const dmg = (zone.kind?.perSecond ?? zone.value ?? 5) * dt * beyblade.damageTaken;
          beyblade.health -= dmg;
          beyblade.damageReceived += dmg;
        }
        break;
      case "heal":
        beyblade.health = Math.min(beyblade.health + (zone.kind?.perSecond ?? zone.value ?? 5) * dt, beyblade.maxHealth);
        break;
      case "knockout":
        beyblade.isRingOut = true;
        beyblade.eliminationType = "ring_out";
        break;
      case "spin-boost":
        beyblade.spin = Math.min(beyblade.spin + (zone.kind?.perSecond ?? zone.value ?? 20) * dt, beyblade.maxSpin);
        break;
      case "expel":
        physics.applyForce(beyblade.id, zone.kind?.impulseCm ?? 0.05, 0);
        break;
      case "speed-scale":
        beyblade.velocityX *= (zone.kind?.multiplier ?? 0.7);
        beyblade.velocityY *= (zone.kind?.multiplier ?? 0.7);
        break;
      case "safe":
        beyblade.isInvulnerable = true;
        beyblade.invulnerabilityTimer = Math.max(beyblade.invulnerabilityTimer, dt);
        break;
      default:
        if (zone.behaviorId) {
          executeBehavior(zone.behaviorId, zone.behaviorParams ?? {}, [beyblade], physics);
        }
    }
  }
  return events;
}

// ── G2: processGearRails (P1) ─────────────────────────────────────────────────

export function processGearRails(
  beyblade: Beyblade,
  gearRails: any[],
  dt: number,
  physics: ArenaPhysicsBridge,
): void {
  if (!gearRails?.length) return;

  const bx = beyblade.x, by = beyblade.y;
  const SNAP_RADIUS_PX = 3 * 24; // 3 cm

  for (const rail of gearRails) {
    if (beyblade.xtremeEngaged && beyblade.xtremeRailId === rail.id) {
      beyblade.xtremeRailProgress += dt * (1 + rail.speedBoostPermille / 1000);
      if (beyblade.xtremeRailProgress >= 1) {
        beyblade.xtremeEngaged = false;
        beyblade.xtremeRailId = "";
        beyblade.xtremeRailProgress = 0;
      }
      continue;
    }

    if (beyblade.xtremeEngaged) continue;
    if (rail.requiresGearCompatibleBit && !beyblade.gearCompatibleBit) continue;

    const pts = (rail.polylineCm ?? []).map((p: any) => ({ x: p.x * 24, y: p.y * 24 }));
    for (let i = 0; i < pts.length - 1; i++) {
      const ax = pts[i].x, ay = pts[i].y;
      const bx2 = pts[i + 1].x, by2 = pts[i + 1].y;
      const len = Math.sqrt((bx2 - ax) ** 2 + (by2 - ay) ** 2) || 1;
      const t = Math.max(0, Math.min(1, ((bx - ax) * (bx2 - ax) + (by - ay) * (by2 - ay)) / (len ** 2)));
      const closestX = ax + t * (bx2 - ax);
      const closestY = ay + t * (by2 - ay);
      const dist = Math.sqrt((bx - closestX) ** 2 + (by - closestY) ** 2);

      if (dist <= SNAP_RADIUS_PX) {
        beyblade.xtremeEngaged = true;
        beyblade.xtremeRailId = rail.id;
        beyblade.xtremeRailProgress = t;
        physics.applyForce(beyblade.id,
          ((bx2 - ax) / len) * rail.speedBoostPermille * 0.00001,
          ((by2 - ay) / len) * rail.speedBoostPermille * 0.00001,
        );
        break;
      }
    }
  }
}

// ── G3: processScoringZones (P1) ──────────────────────────────────────────────

export function processScoringZones(
  beyblade: Beyblade,
  scoringZones: any[],
  gameState: GameState,
  userId: string,
): void {
  if (!scoringZones?.length) return;
  if (!beyblade.isRingOut) return;

  const bx = beyblade.x, by = beyblade.y;
  for (const zone of scoringZones) {
    const zx = zone.x_cm * 24, zy = zone.y_cm * 24;
    const zr = zone.radius_cm * 24;
    if ((bx - zx) ** 2 + (by - zy) ** 2 <= zr ** 2) {
      const current = gameState.playerPoints.get(userId) ?? 0;
      gameState.playerPoints.set(userId, current + (zone.points ?? 1));
      break;
    }
  }
}

// ── G4: processTornadoRidge (P2) ──────────────────────────────────────────────

export function processTornadoRidge(
  beyblade: Beyblade,
  tornadoRidge: any,
  dt: number,
  physics: ArenaPhysicsBridge,
): void {
  if (!tornadoRidge) return;

  const radiusPx = tornadoRidge.radiusCm * 24;
  const widthPx = (tornadoRidge.widthCm ?? 4) * 24;
  const bx = beyblade.x, by = beyblade.y;
  const distFromCenter = Math.sqrt(bx * bx + by * by);

  if (Math.abs(distFromCenter - radiusPx) > widthPx / 2) return;

  const dir = tornadoRidge.direction === "ccw" ? -1 : 1;
  const d = distFromCenter || 1;
  const tx = (-by / d) * dir;
  const ty = (bx / d) * dir;
  const intensity = tornadoRidge.orbitIntensity ?? 0.003;
  physics.applyForce(beyblade.id, tx * intensity, ty * intensity);
  beyblade.spin = Math.min(beyblade.spin + (tornadoRidge.spinBoostPercent ?? 2) * dt, beyblade.maxSpin);
}

// ── G6: processTiltMechanic / Zero-G (P3) ────────────────────────────────────

export function processTiltMechanic(
  beyblades: Map<string, Beyblade>,
  zeroGConfig: any,
  matchElapsedMs: number,
): void {
  if (!zeroGConfig) return;

  const period = zeroGConfig.tiltPeriodMs ?? 8000;
  const maxTilt = (zeroGConfig.maxTiltDeg ?? 15) * Math.PI / 180;
  const t = matchElapsedMs % period;
  const tiltAngle = maxTilt * Math.sin((2 * Math.PI * t) / period);
  const gravScale = Math.max(zeroGConfig.minGravityScale ?? 0.2, 1 - Math.abs(Math.sin(tiltAngle)));

  for (const [, bey] of beyblades) {
    bey.effectiveGravity = 9.8 * gravScale;
    if (gravScale < 0.3) {
      bey.spinDecayRate *= 0.5;
    }
  }
}

// ── I5: ArenaFeatureProcessor class ─────────────────────────────────────────
//
// Wraps per-match bey-transformation state. Rooms that want to use
// handleBeyTransformation() should instantiate one per room and call
// tickBeyTransforms(currentTick) each frame.

export class ArenaFeatureProcessor {
  private activeBeyTransforms: Map<string, BeyTransformState> = new Map();

  // Runtime references — set by the room before calling process() or
  // handleBeyTransformation().
  private _gravityWells: any[] = [];
  private _obstacles: any[] = [];
  private _physicsBodyMap: Map<string, Matter.Body> = new Map();
  private _physicsSetSensor: ((id: string, isSensor: boolean) => void) | null = null;

  // ─── Public API ─────────────────────────────────────────────────────────

  /**
   * Call each frame from the room's tick() after processArenaFeatures().
   * Reverts transforms that have expired.
   */
  tickBeyTransforms(currentTick: number): void {
    for (const [beyId, state] of this.activeBeyTransforms) {
      if (currentTick >= state.expiresAtTick) {
        this._revertBeyTransformation(beyId, state);
      }
    }
  }

  /**
   * Register a physics body for a beyblade so the transformer can set it as sensor.
   * The room should call this whenever a body is created/destroyed.
   */
  registerBody(beyId: string, body: Matter.Body): void {
    this._physicsBodyMap.set(beyId, body);
  }

  /**
   * Provide a callback the processor can use to toggle isSensor on a body.
   * If not provided, body.isSensor is set directly (requires the body reference).
   */
  setSensorCallback(fn: (id: string, isSensor: boolean) => void): void {
    this._physicsSetSensor = fn;
  }

  /**
   * Transform a beyblade into a temporary arena feature.
   *
   * @param beyId       Schema id of the beyblade to transform.
   * @param transformTo Feature type: "gravity_well" | "obstacle" | others (stubs).
   * @param params      Feature-specific parameters.
   * @param durationTicks Number of ticks before reverting.
   * @param bey         Live Beyblade schema object (for saving spin + position).
   */
  handleBeyTransformation(
    beyId: string,
    transformTo: string,
    params: Record<string, unknown>,
    durationTicks: number,
    currentTick: number,
    bey: Beyblade,
  ): void {
    if (this.activeBeyTransforms.has(beyId)) return; // already transformed

    const body = this._physicsBodyMap.get(beyId);
    if (!body) {
      console.warn(`[ArenaFeatureProcessor] handleBeyTransformation: no body for "${beyId}"`);
      return;
    }

    // 1. Save spin + make bey body a sensor (no collision)
    const savedSpin = bey.spin;
    body.isSensor = true;
    if (this._physicsSetSensor) this._physicsSetSensor(beyId, true);

    // 2. Build a unique temp feature id
    const tempFeatureId = `transform_${beyId}_${currentTick}`;

    // 3. Create temp feature at bey's position
    switch (transformTo) {
      case "gravity_well": {
        const strength = (params.strength as number) ?? (bey.mass * 0.01);
        const radiusCm = (params.radiusCm as number) ?? 15;
        const durationMs = (params.durationMs as number) ?? (durationTicks * (1000 / 60));
        this._gravityWells.push({
          id: tempFeatureId,
          x_cm: bey.x / 24,
          y_cm: bey.y / 24,
          forceN: strength,
          effectiveRadiusCm: radiusCm,
          activeMs: durationMs,
          intervalMs: 0,
          warningMs: 0,
          visibility: "visible",
          _tempTransform: true,
        });
        break;
      }
      case "obstacle": {
        const radiusCm = (params.radiusCm as number) ?? 5;
        const damage = (params.damage as number) ?? 10;
        this._obstacles.push({
          id: tempFeatureId,
          x: bey.x / 24,
          y: bey.y / 24,
          radius: radiusCm * 24,
          health: 9999,
          damage,
          recoilDistance: 8,
          indestructible: true,
          _tempTransform: true,
        });
        break;
      }
      // TODO: "spin_zone" transform type — apply orbit/spin in radius around bey's position
      // TODO: "turret" transform type — bey becomes a turret firing at opponents
      // TODO: "water_body" transform type — bey becomes a hazard liquid zone
      default:
        console.warn(`[ArenaFeatureProcessor] handleBeyTransformation: unhandled type "${transformTo}" — no temp feature created.`);
        break;
    }

    this.activeBeyTransforms.set(beyId, {
      beyId,
      transformTo,
      savedSpin,
      savedBody: body,
      expiresAtTick: currentTick + durationTicks,
      tempFeatureId,
    });
  }

  // ─── Internal ────────────────────────────────────────────────────────────

  private _revertBeyTransformation(beyId: string, state: BeyTransformState): void {
    // Restore physics body to collidable
    state.savedBody.isSensor = false;
    if (this._physicsSetSensor) this._physicsSetSensor(beyId, false);

    // Remove temp feature from live arrays
    this._gravityWells = this._gravityWells.filter(
      (g: any) => g.id !== state.tempFeatureId,
    );
    this._obstacles = this._obstacles.filter(
      (o: any) => o.id !== state.tempFeatureId,
    );

    // The room is responsible for restoring spin from state.savedSpin after calling
    // tickBeyTransforms — it can listen for the "transform-reverted" notification or
    // simply check activeBeyTransforms.has(beyId) before/after the tick.
    // We expose the saved spin via the public accessor below.

    this.activeBeyTransforms.delete(beyId);
  }

  /** Returns the saved spin for a beyblade whose transform just expired.
   *  Call this right after tickBeyTransforms() to restore spin in the schema. */
  getSavedSpin(beyId: string): number | undefined {
    // After revert the entry is deleted; callers should read before tickBeyTransforms
    // removes it. This is a best-effort helper for room code.
    return this.activeBeyTransforms.get(beyId)?.savedSpin;
  }

  /** Read-only view of current gravity wells (including temp transform entries). */
  get gravityWells(): readonly any[] { return this._gravityWells; }

  /** Read-only view of current obstacles (including temp transform entries). */
  get obstacles(): readonly any[] { return this._obstacles; }

  /** Whether a given bey is currently transformed. */
  isTransformed(beyId: string): boolean {
    return this.activeBeyTransforms.has(beyId);
  }
}

// Phase Z — extended turret attack types + fire pattern targeting.
// Z4a: new TurretAttackType values (laser_sweep, sniper, shotgun, mine_layer,
//      gravity_cannon, emp, tracking_missile, burst_fire, plasma_ring, tractor_beam)
// Z4b: TurretFirePattern-based target selection
// Z4c: per-tick server handlers for each new type

import type { Beyblade } from "../../rooms/schema/GameState";

export interface TurretProcessorBridge {
  applyForce(id: string, fx: number, fy: number): void;
  applyKnockback(id: string, dir: { x: number; y: number }, dist: number): void;
  getPosition(id: string): { x: number; y: number } | null;
}

export interface TurretRuntimeState {
  burstFired?: number;       // bullets fired in current burst
  burstReloadUntilMs?: number;
  sniperChargeStartMs?: number;
  laserCurrentAngleDeg?: number;
  tractorActive?: boolean;
}

// ── Z4b: Fire pattern target selection ─────────────────────────────────────

/**
 * Pick a target beyblade based on the turret fire pattern.
 */
export function selectTarget(
  pattern: string | undefined,
  beyblades: Beyblade[],
  turretX: number,
  turretY: number,
  roundRobinIndex: number,
  currentAngleDeg: number,
): Beyblade | null {
  const active = beyblades.filter(b => b.isActive && !b.isRingOut);
  if (!active.length) return null;

  switch (pattern) {
    case "nearest": {
      let best: Beyblade | null = null, bestD = Infinity;
      for (const b of active) {
        const d = (b.x - turretX) ** 2 + (b.y - turretY) ** 2;
        if (d < bestD) { bestD = d; best = b; }
      }
      return best;
    }
    case "furthest": {
      let best: Beyblade | null = null, bestD = -Infinity;
      for (const b of active) {
        const d = (b.x - turretX) ** 2 + (b.y - turretY) ** 2;
        if (d > bestD) { bestD = d; best = b; }
      }
      return best;
    }
    case "random":
      return active[Math.floor(Math.random() * active.length)];

    case "round_robin":
      return active[roundRobinIndex % active.length];

    case "lowest_spin": {
      let best: Beyblade | null = null, bestSpin = Infinity;
      for (const b of active) {
        if (b.spin < bestSpin) { bestSpin = b.spin; best = b; }
      }
      return best;
    }
    case "highest_spin": {
      let best: Beyblade | null = null, bestSpin = -Infinity;
      for (const b of active) {
        if (b.spin > bestSpin) { bestSpin = b.spin; best = b; }
      }
      return best;
    }
    case "center":
      // Return the bey closest to arena center (0,0)
      return active.reduce((a, b) =>
        (a.x ** 2 + a.y ** 2) < (b.x ** 2 + b.y ** 2) ? a : b, active[0]);

    default: // "nearest" fallback
      return selectTarget("nearest", beyblades, turretX, turretY, roundRobinIndex, currentAngleDeg);
  }
}

// ── Z4c: New attack type handlers ───────────────────────────────────────────

/** laser_sweep: rotating beam that damages beys in the sweep path each tick. */
export function processLaserSweep(
  turretConfig: any,
  runtime: TurretRuntimeState,
  beyblades: Beyblade[],
  dt: number,
  bridge: TurretProcessorBridge,
): void {
  const sweepSpeedDeg = turretConfig.laserSweepSpeedDeg ?? 90;
  const arcHalf = (turretConfig.laserSweepArcDeg ?? 180) / 2;
  const rangePx = (turretConfig.attackRange ?? 25) * 24;

  runtime.laserCurrentAngleDeg = ((runtime.laserCurrentAngleDeg ?? 0) + sweepSpeedDeg * dt) % 360;

  const beamAngleRad = (runtime.laserCurrentAngleDeg * Math.PI) / 180;
  const tx = (turretConfig.x ?? 0) * 24;
  const ty = (turretConfig.y ?? 0) * 24;

  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - tx, dy = b.y - ty;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > rangePx) continue;

    const bAngle = Math.atan2(dy, dx);
    const sweep = (turretConfig.laserSweepArcDeg ?? 180);
    const diff = Math.abs(((bAngle - beamAngleRad + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
    if (diff < (sweep / 2) * (Math.PI / 180)) {
      const dmg = (turretConfig.attackDamage ?? 15) * dt;
      b.health -= dmg * b.damageTaken;
      b.damageReceived += dmg;
    }
  }
}

/** emp: AoE that disables combos + specials for all beys inside radius. */
export function processEMP(
  turretConfig: any,
  beyblades: Beyblade[],
  nowMs: number,
): void {
  const rangePx = (turretConfig.attackRange ?? 25) * 24;
  const disableTicks = turretConfig.empDisableTicks ?? 120;
  const lockMs = disableTicks * (1000 / 60);
  const tx = (turretConfig.x ?? 0) * 24;
  const ty = (turretConfig.y ?? 0) * 24;

  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - tx, dy = b.y - ty;
    if (dx * dx + dy * dy > rangePx ** 2) continue;

    const lockUntil = nowMs + lockMs;
    if (b.controlLockedUntilMs < lockUntil) {
      b.controlLockedUntilMs = lockUntil;
      b.controlLockSource = "emp";
    }
  }
}

/** tractor_beam: sustained pull force toward turret each tick while active. */
export function processTractorBeam(
  turretConfig: any,
  beyblades: Beyblade[],
  dt: number,
  bridge: TurretProcessorBridge,
): void {
  const rangePx = (turretConfig.attackRange ?? 25) * 24;
  const force = (turretConfig.tractorBeamForce ?? 3) * 0.001;
  const tx = (turretConfig.x ?? 0) * 24;
  const ty = (turretConfig.y ?? 0) * 24;

  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = tx - b.x, dy = ty - b.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    if (dist > rangePx) continue;

    const falloff = 1 - dist / rangePx;
    bridge.applyForce(b.id, (dx / dist) * force * falloff, (dy / dist) * force * falloff);
  }
}

/** tracking_missile: steer toward target bey (call once per tick until hit). */
export function steerTrackingMissile(
  missile: { x: number; y: number; vx: number; vy: number; targetId: string; speed: number },
  beyblades: Beyblade[],
  trackingDegPerSec: number,
  dt: number,
): { vx: number; vy: number } {
  const target = beyblades.find(b => b.id === missile.targetId && b.isActive);
  if (!target) return { vx: missile.vx, vy: missile.vy };

  const dx = target.x - missile.x, dy = target.y - missile.y;
  const desiredAngle = Math.atan2(dy, dx);
  const currentAngle = Math.atan2(missile.vy, missile.vx);
  let delta = desiredAngle - currentAngle;
  // Wrap to [-π, π]
  while (delta > Math.PI) delta -= Math.PI * 2;
  while (delta < -Math.PI) delta += Math.PI * 2;

  const maxTurn = (trackingDegPerSec * Math.PI) / 180 * dt;
  const turn = Math.max(-maxTurn, Math.min(maxTurn, delta));
  const newAngle = currentAngle + turn;
  const spd = Math.sqrt(missile.vx ** 2 + missile.vy ** 2) || missile.speed;

  return { vx: Math.cos(newAngle) * spd, vy: Math.sin(newAngle) * spd };
}

/** burst_fire: check if a burst can fire (not in reload), return true if a bullet should be emitted. */
export function checkBurstFire(
  turretConfig: any,
  runtime: TurretRuntimeState,
  nowMs: number,
): boolean {
  const burstCount = turretConfig.burstCount ?? 5;
  const burstIntervalSec = turretConfig.burstIntervalSec ?? 0.1;
  const reloadSec = turretConfig.burstReloadSec ?? 2;

  if (runtime.burstReloadUntilMs && nowMs < runtime.burstReloadUntilMs) return false;
  if (!runtime.burstFired) runtime.burstFired = 0;

  runtime.burstFired++;
  if (runtime.burstFired >= burstCount) {
    runtime.burstFired = 0;
    runtime.burstReloadUntilMs = nowMs + reloadSec * 1000;
  }
  return true;
}

/** shotgun: returns N spread bullet angles from base angle. */
export function getShotgunAngles(
  baseAngleDeg: number,
  coneHalfDeg: number,
  bulletCount: number,
): number[] {
  const angles: number[] = [];
  const count = Math.max(1, bulletCount);
  for (let i = 0; i < count; i++) {
    const t = count === 1 ? 0 : (i / (count - 1)) * 2 - 1; // -1 to 1
    angles.push(baseAngleDeg + t * coneHalfDeg);
  }
  return angles;
}

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
  setVelocity?(id: string, vx: number, vy: number): void;
}

export interface TurretRuntimeState {
  burstFired?: number;
  burstReloadUntilMs?: number;
  sniperChargeStartMs?: number;
  laserCurrentAngleDeg?: number;
  tractorActive?: boolean;
  overheatPenaltyRemaining?: number;
  leechSeedTargetId?: string;
  leechSeedExpiresMs?: number;
  vineWhipTargetId?: string;
  vineWhipExpiresMs?: number;
  gravityFieldExpiresMs?: number;
  sandTombCenterX?: number;
  sandTombCenterY?: number;
  sandTombExpiresMs?: number;
  whirlpoolCenterX?: number;
  whirlpoolCenterY?: number;
  whirlpoolExpiresMs?: number;
  sporeCenterX?: number;
  sporeCenterY?: number;
  sporeExpiresMs?: number;
  earthquakeNextRingMs?: number;
  earthquakeCurrentRing?: number;
  earthquakeOriginX?: number;
  earthquakeOriginY?: number;
  // Round 3 / type-move runtime state
  magmaStormAngleDeg?: number;
  aquaRingTargetId?: string;
  aquaRingExpiresMs?: number;
  magneticFieldExpiresMs?: number;
  thunderStormNextStrikeMs?: number;
  thunderStormExpiresMs?: number;
  bloomDoomChargeStartMs?: number;
  bloomDoomAbsorbedSpin?: number;
  phantomForceExpiresMs?: number;
  solarBeamChargeStartMs?: number;
  blackHoleCenterX?: number;
  blackHoleCenterY?: number;
  blackHoleExpiresMs?: number;
  // Fighting / close-range / aerial runtime state
  gravityGripTargetId?: string;
  gravityGripExpiresMs?: number;
  razorSpinAngleDeg?: number;
  spinSlashAngleDeg?: number;
  antiGravTargetId?: string;
  antiGravLandMs?: number;
  antiGravOriginX?: number;
  antiGravOriginY?: number;
  magnetBombPullUntilMs?: number;
  metalSoundTargets?: string[];
  // Stat-change / charge runtime state
  swordsDanceChargesLeft?: number;
  meditatePrimed?: boolean;
  nastyPlotChargesLeft?: number;
  agilityChargesLeft?: number;
  chargeCannonChargeStartMs?: number;
  solarChargeStartMs?: number;
  outrageRampageUntilMs?: number;
  // Future-sight pending strikes
  futureSightPending?: Array<{ targetId: string; landMs: number; damage: number }>;
  // Poison / status debuff tracking
  poisonTargets?: Array<{ id: string; stacksDmgPerSec: number; expiresMs: number }>;
  // Weather state
  weatherType?: string;
  weatherExpiresMs?: number;
  // Terrain state
  terrainType?: string;
  terrainExpiresMs?: number;
  // Launcher / airborne state
  uppercutTargetId?: string;
  uppercutLandMs?: number;
  // MK move state
  spearChainTargetId?: string;
  cryoLanceTargetId?: string;
  cryoLanceFrozenMs?: number;
  dragonFireballBounceCount?: number;
  dragonFireballX?: number;
  dragonFireballY?: number;
  dragonFireballVx?: number;
  dragonFireballVy?: number;
  dragonFireballExpiresMs?: number;
  // Defensive buff state
  hardenUntilMs?: number;
  defenseCurlUntilMs?: number;
  defenseCurlNextShotBoosted?: boolean;
  withdrawUntilMs?: number;
  barrierActive?: boolean;
  cosmicPowerUntilMs?: number;
  // ── Street Fighter runtime state ──────────────────────────────────────────
  electricBodyUntilMs?: number;
  hundredKicksTargetId?: string;
  hundredKicksHitsLeft?: number;
  hundredKicksNextHitMs?: number;
  // ── Bleach Bankai runtime state ───────────────────────────────────────────
  senbonzakuraActive?: boolean;
  daiGurenCenterX?: number;
  daiGurenCenterY?: number;
  daiGurenRadius?: number;
  daiGurenExpiresMs?: number;
  mukenCenterX?: number;
  mukenCenterY?: number;
  mukenRadius?: number;
  mukenExpiresMs?: number;
  zankaFieldActive?: boolean;
  zankaFieldExpiresMs?: number;
  zankaFieldCenterX?: number;
  zankaFieldCenterY?: number;
  suzumebachiMarkedTarget?: string;
  hihioSweepAngle?: number;
  hihioSweepUntilMs?: number;
  // ── Naruto runtime state ──────────────────────────────────────────────────
  sandBurialTargetId?: string;
  sandBurialHoldUntilMs?: number;
  amaterasuCenterX?: number;
  amaterasuCenterY?: number;
  amaterasuExpiresMs?: number;
  susanooUntilMs?: number;
  susanooNextPulseMs?: number;
  // ── Ninja technique runtime state ─────────────────────────────────────────
  substitutionUntilMs?: number;
  wireTrapTargetId?: string;
  wireTrapUntilMs?: number;
  explodingTagX?: number;
  explodingTagY?: number;
  explodingTagActive?: boolean;
  smokeBombTargets?: Array<{ id: string; expiresMs: number }>;
  // ── Transformation runtime state ─────────────────────────────────────────
  ultraFormUntilMs?: number;
  demonFormUntilMs?: number;
  sageModeUntilMs?: number;
  sageModeNextRegenMs?: number;
  bankaiUntilMs?: number;
  bankaiNextPulseMs?: number;
  susanooFullUntilMs?: number;
  titanShiftUntilMs?: number;
  titanShiftNextPulseMs?: number;
  // ── Summon runtime state ──────────────────────────────────────────────────
  summonSlugUntilMs?: number;
  summonSlugNextHealMs?: number;
  summonSnakeTargetId?: string;
  summonSnakeUntilMs?: number;
  // ── Tekken runtime state ──────────────────────────────────────────────────
  rageDrivePrimed?: boolean;
  kiChargeTekChargesStored?: number;
  kiChargeTekBoostUntilMs?: number;
  heatSmashIgniteTargetId?: string;
  heatSmashIgniteUntilMs?: number;
  // ── Time-based runtime state ──────────────────────────────────────────────
  timeLoopTargetId?: string;
  timeLoopDamage?: number;
  timeLoopFireMs?: number;
  timeAccelTargets?: Array<{ id: string; expiresMs: number }>;
  timeStopUntilMs?: number;
  // ── Extended Bankai runtime state ─────────────────────────────────────────
  ryujinJakkaFullUntilMs?: number;
  minazukiUntilMs?: number;
  resurreccionUntilMs?: number;
  maskOnUntilMs?: number;
  // ── Arrancar runtime state ────────────────────────────────────────────────
  hierroUntilMs?: string;
  hierroTargetId?: string;
  descorrerActive?: boolean;
  // ── Genjutsu runtime state ────────────────────────────────────────────────
  tsukuyomiTargetId?: string;
  tsukuyomiUntilMs?: number;
  izanagiChargesLeft?: number;
  izanamiTargetId?: string;
  izanamiUntilMs?: number;
  amaterasuMarkedTargets?: Array<{ id: string; expiresMs: number; triggerDmg: number }>;
  crowGenjutsuUntilMs?: number;
  susanooItachiTargetId?: string;
  susanooItachiUntilMs?: number;
  // ── Extended summon runtime state ─────────────────────────────────────────
  summonRyuchiTargetId?: string;
  summonRyuchiUntilMs?: number;
  summonMyobokuBoostUntilMs?: number;
  // ── Size / Weight runtime state ───────────────────────────────────────────
  enlargeTargetId?: string;
  enlargeUntilMs?: number;
  shrinkTargetId?: string;
  shrinkUntilMs?: number;
  massShiftTargetId?: string;
  massShiftUntilMs?: number;
  // ── Transformation runtime state ──────────────────────────────────────────
  hollowTransformTargetId?: string;
  hollowTransformUntilMs?: number;
  hollowTransformNextPulseMs?: number;
  kyuubiModeTargetId?: string;
  kyuubiModeUntilMs?: number;
  bijuuModeTargetId?: string;
  bijuuModeUntilMs?: number;
  curseMark2TargetId?: string;
  curseMark2UntilMs?: number;
  sixPathsUntilMs?: number;
  tenTailsUntilMs?: number;
  berserkHollowTargetId?: string;
  berserkHollowUntilMs?: number;
  berserkHollowNextHitMs?: number;
  // ── Deidara runtime state ─────────────────────────────────────────────────
  claySpiderTargetId?: string;
  claySpiderX?: number;
  claySpiderY?: number;
  claySpiderActive?: boolean;
  clayDragonTargetId?: string;
  clayDragonX?: number;
  clayDragonY?: number;
  clayDragonActive?: boolean;
  clayBombX?: number;
  clayBombY?: number;
  clayBombActive?: boolean;
  clayC4TargetId?: string;
  clayC4UntilMs?: number;
  activeClayCount?: number;
  // ── Akatsuki runtime state ────────────────────────────────────────────────
  chibakuTenseiCenterX?: number;
  chibakuTenseiCenterY?: number;
  chibakuTenseiCrushMs?: number;
  jashinLinkedTargetId?: string;
  jashinLinkUntilMs?: number;
  kamuiTargetId?: string;
  kamuiReturnMs?: number;
  earthGrudgeTargetId?: string;
  earthGrudgeUntilMs?: number;
  woodDragonTargetId?: string;
  woodDragonUntilMs?: number;
  // Obito moves
  spiralEyeUntilMs?: number;
  spiralEyePhase?: "pull" | "fling";
  phantomPassTargetId?: string;
  phantomPassUntilMs?: number;
  blackZetsuTargetId?: string;
  blackZetsuUntilMs?: number;
  truthSeekerTargetId?: string;
  truthSeekerUntilMs?: number;
  // Rinnegan paths
  pretaPathTargetId?: string;
  pretaPathUntilMs?: number;
  // Eight Gates
  eightGatesTargetId?: string;
  eightGatesUntilMs?: number;
  // Aizen hypnosis
  kyokaSuigetsuUntilMs?: number;
  // Barragan respira
  respiraUntilMs?: number;
  // Spirit Bomb
  spiritBombChargeUntilMs?: number;
  spiritBombFired?: boolean;
  // ── Illusion runtime state ────────────────────────────────────────────────
  mirrorWorldUntilMs?: number;
  perfectMirageTargetId?: string;
  perfectMirageUntilMs?: number;
  phantasmalShiftTargetId?: string;
  phantasmalShiftUntilMs?: number;
  echoImageDecoys?: Array<{ realId: string; ghostX: number; ghostY: number; hp: number }>;
  genjutsuVeilUntilMs?: number;
  falseFlagPairA?: string;
  falseFlagPairB?: string;
  falseFlagUntilMs?: number;
  mindFractureTargetId?: string;
  mindFractureUntilMs?: number;
  // ── Contra bey power-up runtime state ────────────────────────────────────
  railbeyTargetId?: string;
  railbeyUntilMs?: number;
  minigunBeyTargetId?: string;
  minigunBeyPulsesLeft?: number;
  minigunBeyNextPulseMs?: number;
  heatSeekerBeyTargetId?: string;
  heatSeekerBeyActive?: boolean;
  bombBeyTargetId?: string;
  bombBeyDetonateMs?: number;
  shieldBeyTargetId?: string;
  shieldBeyActive?: boolean;
  turboBeyTargetId?: string;
  turboBeyUntilMs?: number;
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

// ── Phase ZP: Pokémon-inspired attack handlers ───────────────────────────────

/** surf: wide water wave that sweeps across in a line — lateral push + slow. */
export function processSurf(
  turretConfig: any,
  beyblades: Beyblade[],
  waveProgress: number, // 0→1 fraction of wave travel
  bridge: TurretProcessorBridge,
): void {
  const tx = (turretConfig.x ?? 0) * 24;
  const ty = (turretConfig.y ?? 0) * 24;
  const rangePx = (turretConfig.attackRange ?? 25) * 24;
  const waveWidthPx = turretConfig.surfWaveWidthPx ?? 120;
  const angleRad = ((turretConfig.surfAngleDeg ?? 0) * Math.PI) / 180;
  const waveFrontDist = rangePx * waveProgress;
  const cosA = Math.cos(angleRad), sinA = Math.sin(angleRad);

  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - tx, dy = b.y - ty;
    // Project onto wave direction
    const along = dx * cosA + dy * sinA;
    const perp = Math.abs(-dx * sinA + dy * cosA);
    if (perp > waveWidthPx / 2) continue;
    if (along < waveFrontDist - waveWidthPx || along > waveFrontDist) continue;

    const dmg = (turretConfig.attackDamage ?? 15) * b.damageTaken;
    b.health -= dmg;
    b.damageReceived += dmg;
    bridge.applyForce(b.id, cosA * (turretConfig.surfKnockback ?? 0.04), sinA * (turretConfig.surfKnockback ?? 0.04));
  }
}

/** hydro_pump: single-target directional water jet — linear knockback + slow. */
export function processHydroPump(
  turretConfig: any,
  target: Beyblade,
  bridge: TurretProcessorBridge,
): void {
  const tx = (turretConfig.x ?? 0) * 24;
  const ty = (turretConfig.y ?? 0) * 24;
  const dx = target.x - tx, dy = target.y - ty;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  const kb = turretConfig.hydroPumpKnockback ?? 0.08;
  bridge.applyForce(target.id, (dx / dist) * kb, (dy / dist) * kb);
  const dmg = (turretConfig.attackDamage ?? 20) * target.damageTaken;
  target.health -= dmg;
  target.damageReceived += dmg;
}

/** fire_spin: places a fire ring around target that traps + drains spin per tick. */
export function processFireSpinTick(
  turretConfig: any,
  trapState: { centerX: number; centerY: number; expiresMs: number },
  beyblades: Beyblade[],
  nowMs: number,
  dt: number,
  bridge: TurretProcessorBridge,
): void {
  if (nowMs >= trapState.expiresMs) return;
  const radiusPx = turretConfig.fireSpinRadiusPx ?? 60;
  const drain = (turretConfig.fireSpinSpinDrainPerSec ?? 40) * dt;
  const dmg = (turretConfig.attackDamage ?? 5) * dt;

  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - trapState.centerX, dy = b.y - trapState.centerY;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    if (dist > radiusPx) continue;
    // Damage + spin drain while inside ring
    b.spin = Math.max(0, b.spin - drain);
    if (!b.invulnerable) {
      b.health -= dmg * b.damageTaken;
      b.damageReceived += dmg;
    }
    // Soft containment: push back inward if fleeing
    if (dist > radiusPx * 0.7) {
      bridge.applyForce(b.id, -(dx / dist) * 0.005, -(dy / dist) * 0.005);
    }
  }
}

/** thunderbolt: instant line strike — stuns target (control lock). */
export function processThunderbolt(
  turretConfig: any,
  target: Beyblade,
  nowMs: number,
): void {
  const dmg = (turretConfig.attackDamage ?? 25) * target.damageTaken;
  target.health -= dmg;
  target.damageReceived += dmg;
  const stunSec = turretConfig.thunderboltStunSec ?? 1.5;
  const stunUntil = nowMs + stunSec * 1000;
  if (target.controlLockedUntilMs < stunUntil) {
    target.controlLockedUntilMs = stunUntil;
    target.controlLockSource = "thunderbolt";
  }
}

/** psychic: pulsing push/pull alternating field. Returns current phase. */
export function processPsychic(
  turretConfig: any,
  beyblades: Beyblade[],
  matchElapsedMs: number,
  dt: number,
  bridge: TurretProcessorBridge,
): void {
  const tx = (turretConfig.x ?? 0) * 24;
  const ty = (turretConfig.y ?? 0) * 24;
  const rangePx = (turretConfig.attackRange ?? 25) * 24;
  const cycleSec = turretConfig.psychicCycleIntervalSec ?? 2;
  const force = turretConfig.psychicForce ?? 0.006;
  const phase = Math.sin((2 * Math.PI * matchElapsedMs) / (cycleSec * 1000));

  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - tx, dy = b.y - ty;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    if (dist > rangePx) continue;
    const falloff = 1 - dist / rangePx;
    // Positive phase = repel, negative = attract
    const dir = phase >= 0 ? 1 : -1;
    bridge.applyForce(b.id, (dx / dist) * force * dir * falloff, (dy / dist) * force * dir * falloff);
    if (Math.abs(phase) > 0.8) {
      const dmg = (turretConfig.attackDamage ?? 10) * dt * Math.abs(phase) * b.damageTaken;
      b.health -= dmg;
      b.damageReceived += dmg;
    }
  }
}

/** gust: arena-wide directional wind burst — pushes ALL beys in a direction. */
export function processGust(
  turretConfig: any,
  beyblades: Beyblade[],
  bridge: TurretProcessorBridge,
): void {
  const angleDeg = turretConfig.gustAngleDeg ?? 0;
  const angleRad = (angleDeg * Math.PI) / 180;
  const force = turretConfig.gustForce ?? 0.01;
  const cx = Math.cos(angleRad) * force;
  const cy = Math.sin(angleRad) * force;

  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    bridge.applyForce(b.id, cx, cy);
  }
}

/** shadow_ball: creates a slow-moving projectile state that splits on impact. */
export function createShadowBall(
  turretConfig: any,
  target: Beyblade,
  turretX: number,
  turretY: number,
): { x: number; y: number; vx: number; vy: number; fragments: number; speed: number } {
  const dx = target.x - turretX, dy = target.y - turretY;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  const speed = (turretConfig.shadowBallSpeedPx ?? 180) / 24;
  return {
    x: turretX, y: turretY,
    vx: (dx / dist) * speed,
    vy: (dy / dist) * speed,
    fragments: turretConfig.shadowBallFragments ?? 3,
    speed,
  };
}

/** fire_blast: wide five-petal burst — AoE + DOT burn. */
export function processFireBlast(
  turretConfig: any,
  beyblades: Beyblade[],
  turretX: number,
  turretY: number,
  baseAngleDeg: number,
): void {
  const petals = turretConfig.fireBlastPetals ?? 5;
  const rangePx = (turretConfig.attackRange ?? 25) * 24;
  const spreadRad = (2 * Math.PI) / petals;

  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - turretX, dy = b.y - turretY;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    if (dist > rangePx) continue;

    // Check if bey falls inside any petal sector
    const bAngle = Math.atan2(dy, dx);
    const base = (baseAngleDeg * Math.PI) / 180;
    let inPetal = false;
    for (let p = 0; p < petals; p++) {
      const petalAngle = base + p * spreadRad;
      let diff = Math.abs(((bAngle - petalAngle + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
      if (diff < spreadRad * 0.45) { inPetal = true; break; }
    }
    if (!inPetal) continue;

    const falloff = 1 - dist / rangePx;
    const dmg = (turretConfig.attackDamage ?? 30) * falloff * b.damageTaken;
    b.health -= dmg;
    b.damageReceived += dmg;
  }
}

/** sludge_bomb: creates a poison hazard zone at target position. */
export function createSludgeBombZone(
  turretConfig: any,
  targetX: number,
  targetY: number,
  nowMs: number,
): { x: number; y: number; radiusPx: number; expiresMs: number; slowMult: number; dmgPerSec: number } {
  return {
    x: targetX,
    y: targetY,
    radiusPx: turretConfig.sludgeBombRadiusPx ?? 70,
    expiresMs: nowMs + (turretConfig.sludgeBombLifetimeSec ?? 6) * 1000,
    slowMult: turretConfig.sludgeBombSlowMult ?? 0.5,
    dmgPerSec: turretConfig.attackDamage ?? 6,
  };
}

/** Apply active sludge bomb zones to a beyblade each tick. */
export function applySludgeZones(
  zones: Array<{ x: number; y: number; radiusPx: number; expiresMs: number; slowMult: number; dmgPerSec: number }>,
  beyblade: Beyblade,
  nowMs: number,
  dt: number,
): void {
  for (const zone of zones) {
    if (nowMs >= zone.expiresMs) continue;
    const dx = beyblade.x - zone.x, dy = beyblade.y - zone.y;
    if (dx * dx + dy * dy > zone.radiusPx ** 2) continue;
    beyblade.velocityX *= zone.slowMult;
    beyblade.velocityY *= zone.slowMult;
    if (!beyblade.invulnerable) {
      const dmg = zone.dmgPerSec * dt * beyblade.damageTaken;
      beyblade.health -= dmg;
      beyblade.damageReceived += dmg;
    }
  }
}

/** toxic_spikes: creates floor spike mines that poison beys that cross them. */
export function createToxicSpikes(
  turretConfig: any,
  targetX: number,
  targetY: number,
  nowMs: number,
): Array<{ x: number; y: number; triggerPx: number; poisonPerSec: number; triggered: boolean }> {
  const count = turretConfig.toxicSpikeCount ?? 4;
  const triggerPx = turretConfig.toxicSpikeTriggerPx ?? 30;
  const poisonPerSec = turretConfig.toxicSpikePoisonPerSec ?? 6;
  const spikes = [];
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    const r = 24 * 2; // 2 cm spread
    spikes.push({ x: targetX + Math.cos(a) * r, y: targetY + Math.sin(a) * r, triggerPx, poisonPerSec, triggered: false });
  }
  return spikes;
}

/** roar: control-scrambles all beys in range briefly. */
export function processRoar(
  turretConfig: any,
  beyblades: Beyblade[],
  turretX: number,
  turretY: number,
  nowMs: number,
): void {
  const rangePx = (turretConfig.attackRange ?? 25) * 24;
  const scrambleSec = turretConfig.roarScrambleSec ?? 2;
  const lockUntil = nowMs + scrambleSec * 1000;

  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - turretX, dy = b.y - turretY;
    if (dx * dx + dy * dy > rangePx ** 2) continue;
    if (b.controlLockedUntilMs < lockUntil) {
      b.controlLockedUntilMs = lockUntil;
      b.controlLockSource = "roar";
    }
    // Knockback outward from turret center
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const falloff = 1 - dist / rangePx;
    b.health -= (turretConfig.attackDamage ?? 8) * falloff * b.damageTaken;
    b.damageReceived += (turretConfig.attackDamage ?? 8) * falloff;
  }
}

/** multi_missile: returns N target beys for simultaneous missile launch. */
export function selectMultiMissileTargets(
  turretConfig: any,
  beyblades: Beyblade[],
  turretX: number,
  turretY: number,
): Beyblade[] {
  const count = Math.max(1, turretConfig.multiMissileCount ?? 3);
  const active = beyblades.filter(b => b.isActive && !b.isRingOut);
  if (!active.length) return [];
  const sorted = [...active].sort((a, b2) => {
    const da = (a.x - turretX) ** 2 + (a.y - turretY) ** 2;
    const db2 = (b2.x - turretX) ** 2 + (b2.y - turretY) ** 2;
    return da - db2;
  });
  const targets: Beyblade[] = [];
  for (let i = 0; i < count; i++) targets.push(sorted[i % sorted.length]);
  return targets;
}

// ── Phase ZP-2: extended move handlers ──────────────────────────────────────

/** blizzard: wide ice-storm cone — freeze + slow, optionally drops ice floor patches. */
export function processBlizzard(
  turretConfig: any,
  beyblades: Beyblade[],
  turretX: number,
  turretY: number,
  aimAngleDeg: number,
  nowMs: number,
  bridge: TurretProcessorBridge,
): void {
  const rangePx = (turretConfig.attackRange ?? 25) * 24;
  const coneHalf = (turretConfig.blizzardConeHalfDeg ?? 50) * Math.PI / 180;
  const aimRad = aimAngleDeg * Math.PI / 180;
  const freezeSec = turretConfig.blizzardFreezeDurationSec ?? 2;

  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - turretX, dy = b.y - turretY;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    if (dist > rangePx) continue;
    const bAngle = Math.atan2(dy, dx);
    let diff = Math.abs(((bAngle - aimRad + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
    if (diff > coneHalf) continue;
    const falloff = 1 - dist / rangePx;
    const dmg = (turretConfig.attackDamage ?? 20) * falloff * b.damageTaken;
    b.health -= dmg;
    b.damageReceived += dmg;
    // Freeze: halt velocity + spin drain
    if (bridge.setVelocity) bridge.setVelocity(b.id, b.velocityX * 0.1, b.velocityY * 0.1);
    const lockUntil = nowMs + freezeSec * 1000;
    if (b.controlLockedUntilMs < lockUntil) {
      b.controlLockedUntilMs = lockUntil;
      b.controlLockSource = "blizzard_freeze";
    }
  }
}

/** earthquake: fires radial shockwave rings — call once per ring emission. */
export function processEarthquakeRing(
  turretConfig: any,
  beyblades: Beyblade[],
  turretX: number,
  turretY: number,
  ringRadiusPx: number,
  bridge: TurretProcessorBridge,
): void {
  const ringThicknessPx = 40;
  const baseDmg = turretConfig.attackDamage ?? 18;

  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - turretX, dy = b.y - turretY;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    if (Math.abs(dist - ringRadiusPx) > ringThicknessPx) continue;
    const dmg = baseDmg * b.damageTaken;
    b.health -= dmg;
    b.damageReceived += dmg;
    // Push outward
    bridge.applyForce(b.id, (dx / dist) * 0.025, (dy / dist) * 0.025);
  }
}

/** flamethrower: sustained narrow tracking beam — applies burn DoT. */
export function processFlamethrower(
  turretConfig: any,
  target: Beyblade,
  turretX: number,
  turretY: number,
  dt: number,
): void {
  const dx = target.x - turretX, dy = target.y - turretY;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  const rangePx = (turretConfig.attackRange ?? 25) * 24;
  if (dist > rangePx) return;
  const burnPerSec = turretConfig.flamethrowerBurnPerSec ?? 8;
  const dmg = burnPerSec * dt * target.damageTaken;
  target.health -= dmg;
  target.damageReceived += dmg;
}

/** ice_beam: hitscan precision shot — freezes target velocity + drains spin. */
export function processIceBeam(
  turretConfig: any,
  target: Beyblade,
  nowMs: number,
  bridge: TurretProcessorBridge,
): void {
  const dmg = (turretConfig.attackDamage ?? 25) * target.damageTaken;
  target.health -= dmg;
  target.damageReceived += dmg;
  // Halt movement
  if (bridge.setVelocity) bridge.setVelocity(target.id, 0, 0);
  // Freeze control
  const freezeSec = turretConfig.iceBeamFreezeDurationSec ?? 2;
  const lockUntil = nowMs + freezeSec * 1000;
  if (target.controlLockedUntilMs < lockUntil) {
    target.controlLockedUntilMs = lockUntil;
    target.controlLockSource = "ice_beam";
  }
}

/** dragon_breath: short-range cone blast with stagger chance. */
export function processDragonBreath(
  turretConfig: any,
  beyblades: Beyblade[],
  turretX: number,
  turretY: number,
  aimAngleDeg: number,
  nowMs: number,
  rand: () => number,
): void {
  const rangePx = (turretConfig.attackRange ?? 15) * 24;
  const coneHalf = (turretConfig.dragonBreathConeHalfDeg ?? 25) * Math.PI / 180;
  const aimRad = aimAngleDeg * Math.PI / 180;
  const staggerChance = turretConfig.dragonBreathStaggerChance ?? 0.35;
  const staggerSec = turretConfig.dragonBreathStaggerSec ?? 1;

  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - turretX, dy = b.y - turretY;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    if (dist > rangePx) continue;
    const bAngle = Math.atan2(dy, dx);
    let diff = Math.abs(((bAngle - aimRad + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
    if (diff > coneHalf) continue;
    const falloff = 1 - dist / rangePx;
    const dmg = (turretConfig.attackDamage ?? 22) * falloff * b.damageTaken;
    b.health -= dmg;
    b.damageReceived += dmg;
    if (rand() < staggerChance) {
      const lockUntil = nowMs + staggerSec * 1000;
      if (b.controlLockedUntilMs < lockUntil) {
        b.controlLockedUntilMs = lockUntil;
        b.controlLockSource = "dragon_breath_stagger";
      }
    }
  }
}

/** confuse_ray: no damage — reverses target input for duration. */
export function processConfuseRay(
  turretConfig: any,
  target: Beyblade,
  nowMs: number,
): void {
  const durationSec = turretConfig.confuseRayDurationSec ?? 3;
  const confusedUntil = nowMs + durationSec * 1000;
  if ((target as any).confusedUntilMs < confusedUntil) {
    (target as any).confusedUntilMs = confusedUntil;
    (target as any).inputReversed = true;
  }
}

/** leech_seed: per-tick drain on a latched target. Call once per tick for the duration. */
export function processLeechSeedTick(
  turretConfig: any,
  target: Beyblade,
  dt: number,
): void {
  const healthDrain = (turretConfig.leechSeedHealthPerSec ?? 5) * dt * target.damageTaken;
  const spinDrain = (turretConfig.leechSeedSpinPerSec ?? 20) * dt;
  target.health -= healthDrain;
  target.damageReceived += healthDrain;
  target.spin = Math.max(0, target.spin - spinDrain);
}

/** vine_whip: per-tick pull of specific target toward turret. */
export function processVineWhipTick(
  turretConfig: any,
  target: Beyblade,
  turretX: number,
  turretY: number,
  dt: number,
  bridge: TurretProcessorBridge,
): void {
  const dx = turretX - target.x, dy = turretY - target.y;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  const pullForce = (turretConfig.vineWhipPullForce ?? 0.015) * dt * 60;
  bridge.applyForce(target.id, (dx / dist) * pullForce, (dy / dist) * pullForce);
}

/** sticky_web: creates a web zone at a position. Apply to beys each tick. */
export function createStickyWeb(
  turretConfig: any,
  targetX: number,
  targetY: number,
  nowMs: number,
): { x: number; y: number; radiusPx: number; expiresMs: number; slowMult: number } {
  return {
    x: targetX, y: targetY,
    radiusPx: turretConfig.stickyWebRadiusPx ?? 60,
    expiresMs: nowMs + (turretConfig.stickyWebDurationSec ?? 8) * 1000,
    slowMult: turretConfig.stickyWebSlowMult ?? 0.1,
  };
}

export function applyStickyWebs(
  webs: Array<{ x: number; y: number; radiusPx: number; expiresMs: number; slowMult: number }>,
  beyblade: Beyblade,
  nowMs: number,
): void {
  for (const web of webs) {
    if (nowMs >= web.expiresMs) continue;
    const dx = beyblade.x - web.x, dy = beyblade.y - web.y;
    if (dx * dx + dy * dy > web.radiusPx ** 2) continue;
    beyblade.velocityX *= web.slowMult;
    beyblade.velocityY *= web.slowMult;
  }
}

/** gravity_field: pull all beys toward arena center (0,0) for a duration. */
export function processGravityFieldTick(
  turretConfig: any,
  beyblades: Beyblade[],
  dt: number,
  bridge: TurretProcessorBridge,
): void {
  const force = (turretConfig.gravityFieldForce ?? 0.008) * dt * 60;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = -b.x, dy = -b.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    bridge.applyForce(b.id, (dx / dist) * force, (dy / dist) * force);
  }
}

/** sand_tomb: traps target in sand vortex — orbit + containment + DoT. */
export function processSandTombTick(
  turretConfig: any,
  trapState: { centerX: number; centerY: number; expiresMs: number },
  beyblades: Beyblade[],
  nowMs: number,
  dt: number,
  bridge: TurretProcessorBridge,
): void {
  if (nowMs >= trapState.expiresMs) return;
  const radiusPx = turretConfig.sandTombRadiusPx ?? 70;
  const pushForce = turretConfig.sandTombPushbackForce ?? 0.007;
  const dmg = (turretConfig.attackDamage ?? 8) * dt;

  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - trapState.centerX, dy = b.y - trapState.centerY;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    if (dist > radiusPx) continue;
    // DoT
    if (!b.invulnerable) {
      b.health -= dmg * b.damageTaken;
      b.damageReceived += dmg;
    }
    // Tangential orbit (cw)
    const tx = -dy / dist, ty = dx / dist;
    bridge.applyForce(b.id, tx * pushForce * 0.5, ty * pushForce * 0.5);
    // Containment: push back toward center when near rim
    if (dist > radiusPx * 0.75) {
      bridge.applyForce(b.id, -(dx / dist) * pushForce, -(dy / dist) * pushForce);
    }
  }
}

/** zap_cannon: slow homing projectile state — creates guaranteed paralysis on collision. */
export function createZapCannon(
  turretConfig: any,
  target: Beyblade,
  turretX: number,
  turretY: number,
): { x: number; y: number; vx: number; vy: number; targetId: string; speed: number; paralysisSec: number } {
  const dx = target.x - turretX, dy = target.y - turretY;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  const speed = (turretConfig.zapCannonSpeedPx ?? 100) / 24;
  return {
    x: turretX, y: turretY,
    vx: (dx / dist) * speed, vy: (dy / dist) * speed,
    targetId: target.id,
    speed,
    paralysisSec: turretConfig.zapCannonParalysisSec ?? 3,
  };
}

export function applyZapCannonHit(
  turretConfig: any,
  target: Beyblade,
  paralysisSec: number,
  nowMs: number,
  bridge: TurretProcessorBridge,
): void {
  const dmg = (turretConfig.attackDamage ?? 20) * target.damageTaken;
  target.health -= dmg;
  target.damageReceived += dmg;
  if (bridge.setVelocity) bridge.setVelocity(target.id, 0, 0);
  const lockUntil = nowMs + paralysisSec * 1000;
  if (target.controlLockedUntilMs < lockUntil) {
    target.controlLockedUntilMs = lockUntil;
    target.controlLockSource = "zap_cannon";
  }
}

/** chain_lightning: arc through N nearest beys, halving damage each jump. */
export function processChainLightning(
  turretConfig: any,
  beyblades: Beyblade[],
  startX: number,
  startY: number,
  nowMs: number,
): void {
  const jumps = Math.max(1, turretConfig.chainLightningJumps ?? 3);
  const decay = turretConfig.chainLightningDecay ?? 0.5;
  const stunSec = turretConfig.chainLightningStunSec ?? 0.8;
  let dmg = turretConfig.attackDamage ?? 22;
  let cx = startX, cy = startY;
  const hit = new Set<string>();

  for (let j = 0; j < jumps; j++) {
    let best: Beyblade | null = null, bestDist = Infinity;
    for (const b of beyblades) {
      if (!b.isActive || b.isRingOut || hit.has(b.id)) continue;
      const d = (b.x - cx) ** 2 + (b.y - cy) ** 2;
      if (d < bestDist) { bestDist = d; best = b; }
    }
    if (!best) break;
    hit.add(best.id);
    best.health -= dmg * best.damageTaken;
    best.damageReceived += dmg;
    const lockUntil = nowMs + stunSec * 1000;
    if (best.controlLockedUntilMs < lockUntil) {
      best.controlLockedUntilMs = lockUntil;
      best.controlLockSource = "chain_lightning";
    }
    cx = best.x; cy = best.y;
    dmg *= decay;
  }
}

/** spore: per-tick effect inside cloud — heavy spin drain + sleep on first entry. */
export function processSporeCloudTick(
  turretConfig: any,
  cloudState: { x: number; y: number; expiresMs: number },
  beyblades: Beyblade[],
  nowMs: number,
  dt: number,
): void {
  if (nowMs >= cloudState.expiresMs) return;
  const radiusPx = turretConfig.sporeRadiusPx ?? 60;
  const drainMult = turretConfig.sporeSpinDrainMult ?? 2.0;
  const sleepSec = turretConfig.sporeSleepDurationSec ?? 2;

  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - cloudState.x, dy = b.y - cloudState.y;
    if (dx * dx + dy * dy > radiusPx ** 2) continue;
    // Heavy spin drain
    b.spin = Math.max(0, b.spin - b.spin * 0.008 * drainMult * dt * 60);
    // Sleep on first entry this tick
    const lockUntil = nowMs + sleepSec * 1000;
    if (b.controlLockedUntilMs < lockUntil) {
      b.controlLockedUntilMs = lockUntil;
      b.controlLockSource = "spore_sleep";
    }
  }
}

/** dark_void: returns N projectile states targeting different beys. */
export function createDarkVoid(
  turretConfig: any,
  beyblades: Beyblade[],
  turretX: number,
  turretY: number,
): Array<{ x: number; y: number; vx: number; vy: number; targetId: string; speed: number; fragments: number }> {
  const count = Math.max(1, turretConfig.darkVoidCount ?? 3);
  const speed = (turretConfig.darkVoidSpeedPx ?? 150) / 24;
  const active = beyblades.filter(b => b.isActive && !b.isRingOut);
  if (!active.length) return [];
  const result = [];
  for (let i = 0; i < count; i++) {
    const target = active[i % active.length];
    const dx = target.x - turretX, dy = target.y - turretY;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    result.push({ x: turretX, y: turretY, vx: (dx / dist) * speed, vy: (dy / dist) * speed, targetId: target.id, speed, fragments: 2 });
  }
  return result;
}

/** rock_slide: drop N boulders at random offsets around target, each AoE. */
export function processRockSlide(
  turretConfig: any,
  beyblades: Beyblade[],
  targetX: number,
  targetY: number,
  rand: () => number,
): void {
  const boulderCount = turretConfig.rockSlideBoulderCount ?? 5;
  const scatterPx = turretConfig.rockSlideScatterPx ?? 120;
  const boulderAoePx = turretConfig.rockSlideBoulderAoePx ?? 30;
  const dmg = turretConfig.attackDamage ?? 15;

  for (let b2 = 0; b2 < boulderCount; b2++) {
    const angle = rand() * Math.PI * 2;
    const r = rand() * scatterPx;
    const boulderX = targetX + Math.cos(angle) * r;
    const boulderY = targetY + Math.sin(angle) * r;
    for (const b of beyblades) {
      if (!b.isActive || b.isRingOut) continue;
      const dx = b.x - boulderX, dy = b.y - boulderY;
      if (dx * dx + dy * dy > boulderAoePx ** 2) continue;
      const falloff = 1 - Math.sqrt(dx * dx + dy * dy) / boulderAoePx;
      b.health -= dmg * falloff * b.damageTaken;
      b.damageReceived += dmg * falloff;
    }
  }
}

/** whirlpool: per-tick orbit + DoT inside water vortex zone. */
export function processWhirlpoolTick(
  turretConfig: any,
  trapState: { centerX: number; centerY: number; expiresMs: number },
  beyblades: Beyblade[],
  nowMs: number,
  dt: number,
  bridge: TurretProcessorBridge,
): void {
  if (nowMs >= trapState.expiresMs) return;
  const radiusPx = turretConfig.whirlpoolRadiusPx ?? 80;
  const orbitForce = turretConfig.whirlpoolOrbitForce ?? 0.006;
  const dmg = (turretConfig.attackDamage ?? 6) * dt;

  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - trapState.centerX, dy = b.y - trapState.centerY;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    if (dist > radiusPx) continue;
    const falloff = 1 - dist / radiusPx;
    // Orbit (cw)
    const tx = -dy / dist, ty = dx / dist;
    bridge.applyForce(b.id, tx * orbitForce * falloff, ty * orbitForce * falloff);
    // Inward pull
    bridge.applyForce(b.id, -(dx / dist) * orbitForce * 0.4 * falloff, -(dy / dist) * orbitForce * 0.4 * falloff);
    if (!b.invulnerable) {
      b.health -= dmg * b.damageTaken;
      b.damageReceived += dmg;
    }
  }
}

/** stealth_rock: places hidden rock damage zones at scattered positions. */
export function createStealthRocks(
  turretConfig: any,
  targetX: number,
  targetY: number,
  nowMs: number,
  rand: () => number,
): Array<{ x: number; y: number; radiusPx: number; expiresMs: number; dmgPerSec: number }> {
  const count = turretConfig.stealthRockCount ?? 6;
  const rockRadiusPx = turretConfig.stealthRockRadiusPx ?? 40;
  const dmgPerSec = turretConfig.stealthRockDmgPerSec ?? 4;
  const expiresMs = nowMs + (turretConfig.stealthRockDurationSec ?? 10) * 1000;
  const scatterPx = (turretConfig.attackRange ?? 20) * 24 * 0.6;
  const rocks = [];
  for (let i = 0; i < count; i++) {
    const a = rand() * Math.PI * 2;
    const r = rand() * scatterPx;
    rocks.push({ x: targetX + Math.cos(a) * r, y: targetY + Math.sin(a) * r, radiusPx: rockRadiusPx, expiresMs, dmgPerSec });
  }
  return rocks;
}

export function applyStealthRocks(
  rocks: Array<{ x: number; y: number; radiusPx: number; expiresMs: number; dmgPerSec: number }>,
  beyblade: Beyblade,
  nowMs: number,
  dt: number,
): void {
  for (const rock of rocks) {
    if (nowMs >= rock.expiresMs) continue;
    const dx = beyblade.x - rock.x, dy = beyblade.y - rock.y;
    if (dx * dx + dy * dy > rock.radiusPx ** 2) continue;
    if (!beyblade.invulnerable) {
      const dmg = rock.dmgPerSec * dt * beyblade.damageTaken;
      beyblade.health -= dmg;
      beyblade.damageReceived += dmg;
    }
  }
}

// ── Round 3: Fire type ──────────────────────────────────────────────────────

/** ember: fast projectile that leaves a burn DoT. Call when projectile hits. */
export function applyEmberBurn(
  turretConfig: any,
  target: Beyblade,
  nowMs: number,
): void {
  const baseDmg = turretConfig.attackDamage ?? 10;
  const tickDmg = turretConfig.emberBurnTickDmg ?? 5;
  const ticks = turretConfig.emberBurnTicks ?? 3;
  const intervalSec = turretConfig.emberBurnIntervalSec ?? 0.5;
  if (!target.invulnerable) {
    target.health -= baseDmg * target.damageTaken;
    target.damageReceived += baseDmg;
  }
  // Store burn using controlLockSource trick — burn handled by applyActiveBurns
  (target as any)._emberBurnTicks = ticks;
  (target as any)._emberBurnTickDmg = tickDmg;
  (target as any)._emberBurnIntervalMs = intervalSec * 1000;
  (target as any)._emberBurnNextMs = nowMs + intervalSec * 1000;
}

/** applyActiveBurns: call each tick to drain burn DoT. */
export function applyActiveBurns(beyblades: Beyblade[], nowMs: number): void {
  for (const b of beyblades) {
    if (!(b as any)._emberBurnTicks) continue;
    if (nowMs < (b as any)._emberBurnNextMs) continue;
    const dmg = (b as any)._emberBurnTickDmg as number;
    if (!b.invulnerable) {
      b.health -= dmg * b.damageTaken;
      b.damageReceived += dmg;
    }
    (b as any)._emberBurnTicks -= 1;
    if ((b as any)._emberBurnTicks <= 0) {
      delete (b as any)._emberBurnTicks;
    } else {
      (b as any)._emberBurnNextMs += (b as any)._emberBurnIntervalMs;
    }
  }
}

/** magma_storm: rotating lava ring at fixed radius — damages beys crossing it. */
export function processMagmaStorm(
  turretConfig: any,
  runtime: TurretRuntimeState,
  beyblades: Beyblade[],
  dt: number,
): void {
  const rotSpeed = turretConfig.magmaStormRotationSpeedDeg ?? 30;
  runtime.magmaStormAngleDeg = ((runtime.magmaStormAngleDeg ?? 0) + rotSpeed * dt) % 360;
  const ringR = (turretConfig.magmaStormRingRadiusPx ?? 100);
  const ringW = (turretConfig.magmaStormRingWidthPx ?? 24) / 2;
  const tx = (turretConfig.x ?? 0) * 24;
  const ty = (turretConfig.y ?? 0) * 24;
  const dmgPerSec = turretConfig.attackDamage ?? 15;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - tx, dy = b.y - ty;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (Math.abs(dist - ringR) < ringW) {
      const dmg = dmgPerSec * dt * b.damageTaken;
      if (!b.invulnerable) { b.health -= dmg; b.damageReceived += dmg; }
    }
  }
}

/** eruption: ULTIMATE — geysers at all active bey positions simultaneously. */
export function processEruption(
  turretConfig: any,
  beyblades: Beyblade[],
  nowMs: number,
): void {
  const aoeR = turretConfig.eruptionGeyserAoePx ?? 80;
  const baseDmg = turretConfig.attackDamage ?? 40;
  const extraPerBey = turretConfig.eruptionExtraDmgPerBey ?? 10;
  const active = beyblades.filter(b => b.isActive && !b.isRingOut);
  const count = active.length;
  for (const b of active) {
    const dmg = (baseDmg + extraPerBey * (count - 1)) * b.damageTaken;
    if (!b.invulnerable) { b.health -= dmg; b.damageReceived += dmg; }
    applyEmberBurn({ attackDamage: 0, emberBurnTickDmg: 8, emberBurnTicks: 3, emberBurnIntervalSec: 0.5 }, b, nowMs);
  }
}

// ── Round 3: Water type ─────────────────────────────────────────────────────

/** bubble_beam: N slow projectiles — apply slow on projectile hit. */
export function applyBubbleBeamSlow(
  turretConfig: any,
  target: Beyblade,
  nowMs: number,
): void {
  const mult = turretConfig.bubbleBeamSlowMult ?? 0.65;
  const durationMs = (turretConfig.bubbleBeamSlowDurationSec ?? 1.5) * 1000;
  (target as any)._speedSlowMult = mult;
  (target as any)._speedSlowExpiresMs = nowMs + durationMs;
}

/** aqua_ring: orbiting water ring tick — spin drain per second while active. */
export function processAquaRingTick(
  turretConfig: any,
  runtime: TurretRuntimeState,
  beyblades: Beyblade[],
  nowMs: number,
  dt: number,
): void {
  if (!runtime.aquaRingTargetId || nowMs >= (runtime.aquaRingExpiresMs ?? 0)) return;
  const target = beyblades.find(b => b.id === runtime.aquaRingTargetId && b.isActive && !b.isRingOut);
  if (!target) return;
  const drain = (turretConfig.aquaRingSpinDrainPerSec ?? 25) * dt;
  target.spin = Math.max(0, target.spin - drain);
}

/** origin_pulse: ULTIMATE — arena-wide push wave. Call twice (wave 1 and wave 2). */
export function applyOriginPulseWave(
  turretConfig: any,
  beyblades: Beyblade[],
  bridge: TurretProcessorBridge,
): void {
  const force = turretConfig.originPulsePushForce ?? 0.06;
  const tx = (turretConfig.x ?? 0) * 24;
  const ty = (turretConfig.y ?? 0) * 24;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - tx, dy = b.y - ty;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    bridge.applyForce(b.id, (dx / dist) * force, (dy / dist) * force);
    const dmg = (turretConfig.attackDamage ?? 20) * b.damageTaken;
    if (!b.invulnerable) { b.health -= dmg; b.damageReceived += dmg; }
  }
}

// ── Round 3: Ice type ───────────────────────────────────────────────────────

/** icicle_spear: apply a single spear hit. Call for each spear in the volley. */
export function applyIcicleSpear(
  turretConfig: any,
  target: Beyblade,
): void {
  const dmg = (turretConfig.attackDamage ?? 12) * target.damageTaken;
  if (!target.invulnerable) { target.health -= dmg; target.damageReceived += dmg; }
}

/** hail: apply a single ice chunk landing — like rock_slide but smaller. */
export function applyHailChunk(
  turretConfig: any,
  beyblades: Beyblade[],
  centerX: number,
  centerY: number,
  bridge: TurretProcessorBridge,
): void {
  const aoeR = turretConfig.hailChunkAoePx ?? 25;
  const dmg = turretConfig.attackDamage ?? 10;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - centerX, dy = b.y - centerY;
    if (dx * dx + dy * dy > aoeR * aoeR) continue;
    if (!b.invulnerable) { b.health -= dmg * b.damageTaken; b.damageReceived += dmg; }
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    bridge.applyForce(b.id, (dx / dist) * 0.03, (dy / dist) * 0.03);
  }
}

/** glacial_lance: ULTIMATE — freeze all beys hit by the piercing beam. */
export function applyGlacialLance(
  turretConfig: any,
  beyblades: Beyblade[],
  nowMs: number,
  bridge: TurretProcessorBridge,
): void {
  const freezeSec = turretConfig.glacialLanceFreezeSec ?? 4;
  const dmg = turretConfig.attackDamage ?? 50;
  const lockUntil = nowMs + freezeSec * 1000;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    if (!b.invulnerable) { b.health -= dmg * b.damageTaken; b.damageReceived += dmg; }
    if (b.controlLockedUntilMs < lockUntil) {
      b.controlLockedUntilMs = lockUntil;
      b.controlLockSource = "glacial_lance";
    }
    if (bridge.setVelocity) bridge.setVelocity(b.id, 0, 0);
  }
}

// ── Round 3: Lightning type ─────────────────────────────────────────────────

/** thunder_wave: AoE slow field — reduces speed of all beys inside. */
export function applyThunderWave(
  turretConfig: any,
  beyblades: Beyblade[],
  nowMs: number,
): void {
  const rangePx = (turretConfig.attackRange ?? 25) * 24;
  const tx = (turretConfig.x ?? 0) * 24;
  const ty = (turretConfig.y ?? 0) * 24;
  const durationMs = (turretConfig.thunderWaveDurationSec ?? 3) * 1000;
  const mult = turretConfig.thunderWaveSpeedMult ?? 0.5;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - tx, dy = b.y - ty;
    if (dx * dx + dy * dy > rangePx * rangePx) continue;
    (b as any)._speedSlowMult = mult;
    (b as any)._speedSlowExpiresMs = nowMs + durationMs;
  }
}

/** discharge: omnidirectional burst — damages + spin-drains all nearby beys. */
export function applyDischarge(
  turretConfig: any,
  beyblades: Beyblade[],
  bridge: TurretProcessorBridge,
): void {
  const rangePx = turretConfig.dischargeRadiusPx ?? 150;
  const tx = (turretConfig.x ?? 0) * 24;
  const ty = (turretConfig.y ?? 0) * 24;
  const dmg = turretConfig.attackDamage ?? 20;
  const spinDrain = turretConfig.dischargeSpinDrainPerSec ?? 30;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - tx, dy = b.y - ty;
    if (dx * dx + dy * dy > rangePx * rangePx) continue;
    if (!b.invulnerable) { b.health -= dmg * b.damageTaken; b.damageReceived += dmg; }
    b.spin = Math.max(0, b.spin - spinDrain * 0.016);
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    bridge.applyForce(b.id, (dx / dist) * 0.02, (dy / dist) * 0.02);
  }
}

/** bolt_strike: ULTIMATE — simultaneous lightning hits on ALL beys. */
export function applyBoltStrike(
  turretConfig: any,
  beyblades: Beyblade[],
  nowMs: number,
): void {
  const dmg = turretConfig.attackDamage ?? 35;
  const paralysisSec = turretConfig.boltStrikeParalysisSec ?? 2;
  const lockUntil = nowMs + paralysisSec * 1000;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    if (!b.invulnerable) { b.health -= dmg * b.damageTaken; b.damageReceived += dmg; }
    if (b.controlLockedUntilMs < lockUntil) {
      b.controlLockedUntilMs = lockUntil;
      b.controlLockSource = "bolt_strike";
    }
  }
}

// ── Round 3: Wind type ──────────────────────────────────────────────────────

/** air_slash: flinch chance on projectile hit. */
export function applyAirSlash(
  turretConfig: any,
  target: Beyblade,
  nowMs: number,
  rand: () => number,
): void {
  const dmg = turretConfig.attackDamage ?? 18;
  if (!target.invulnerable) { target.health -= dmg * target.damageTaken; target.damageReceived += dmg; }
  if (rand() < (turretConfig.airSlashFlinchChance ?? 0.3)) {
    const lockUntil = nowMs + (turretConfig.airSlashFlinchSec ?? 0.5) * 1000;
    if (target.controlLockedUntilMs < lockUntil) {
      target.controlLockedUntilMs = lockUntil;
      target.controlLockSource = "air_slash";
    }
  }
}

/** hurricane: on-arrival spin zone — apply to all beys inside spin zone radius. */
export function applyHurricaneSpinZone(
  turretConfig: any,
  beyblades: Beyblade[],
  centerX: number,
  centerY: number,
  bridge: TurretProcessorBridge,
): void {
  const r = turretConfig.hurricaneSpinZoneRadiusPx ?? 70;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - centerX, dy = b.y - centerY;
    if (dx * dx + dy * dy > r * r) continue;
    // Tangential orbit force
    bridge.applyForce(b.id, -dy / (Math.sqrt(dx * dx + dy * dy) || 1) * 0.015,
                              dx / (Math.sqrt(dx * dx + dy * dy) || 1) * 0.015);
  }
}

/** aeroblast: ULTIMATE — full push toward ring-out direction. */
export function applyAeroblast(
  turretConfig: any,
  beyblades: Beyblade[],
  bridge: TurretProcessorBridge,
): void {
  const force = turretConfig.aeroblastPushForce ?? 0.08;
  const tx = (turretConfig.x ?? 0) * 24;
  const ty = (turretConfig.y ?? 0) * 24;
  const dmg = turretConfig.attackDamage ?? 30;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - tx, dy = b.y - ty;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    bridge.applyForce(b.id, (dx / dist) * force, (dy / dist) * force);
    if (!b.invulnerable) { b.health -= dmg * b.damageTaken; b.damageReceived += dmg; }
  }
}

// ── Round 3: Earth type ─────────────────────────────────────────────────────

/** stone_edge: single shard impact with crit chance. */
export function applyStoneEdgeShard(
  turretConfig: any,
  target: Beyblade,
  rand: () => number,
): void {
  const baseDmg = turretConfig.attackDamage ?? 15;
  const critChance = turretConfig.stoneEdgeCritChance ?? 0.5;
  const critMult = turretConfig.stoneEdgeCritMult ?? 1.5;
  const mult = rand() < critChance ? critMult : 1.0;
  const dmg = baseDmg * mult * target.damageTaken;
  if (!target.invulnerable) { target.health -= dmg; target.damageReceived += dmg; }
}

/** dig: surface AoE at stored position — damages beys in AoE on pop. */
export function applyDigSurface(
  turretConfig: any,
  beyblades: Beyblade[],
  centerX: number,
  centerY: number,
  bridge: TurretProcessorBridge,
): void {
  const aoeR = turretConfig.digAoePx ?? 50;
  const dmg = (turretConfig.attackDamage ?? 35);
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - centerX, dy = b.y - centerY;
    if (dx * dx + dy * dy > aoeR * aoeR) continue;
    if (!b.invulnerable) { b.health -= dmg * b.damageTaken; b.damageReceived += dmg; }
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    bridge.applyForce(b.id, (dx / dist) * 0.05, (dy / dist) * 0.05);
  }
}

/** tectonic_rage: ULTIMATE — fissure lines launched from turret center. */
export function applyTectonicRage(
  turretConfig: any,
  beyblades: Beyblade[],
  fissureAnglesDeg: number[],
  bridge: TurretProcessorBridge,
): void {
  const fissureW = turretConfig.tectonicRageFissureWidthPx ?? 40;
  const dmg = turretConfig.attackDamage ?? 45;
  const tx = (turretConfig.x ?? 0) * 24;
  const ty = (turretConfig.y ?? 0) * 24;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const bdx = b.x - tx, bdy = b.y - ty;
    for (const deg of fissureAnglesDeg) {
      const rad = (deg * Math.PI) / 180;
      const dot = bdx * Math.cos(rad) + bdy * Math.sin(rad);
      const perpDist = Math.abs(-bdx * Math.sin(rad) + bdy * Math.cos(rad));
      if (dot > 0 && perpDist < fissureW / 2) {
        if (!b.invulnerable) { b.health -= dmg * b.damageTaken; b.damageReceived += dmg; }
        bridge.applyForce(b.id, Math.cos(rad) * 0.06, Math.sin(rad) * 0.06);
        break;
      }
    }
  }
}

// ── Round 3: Metal type ─────────────────────────────────────────────────────

/** flash_cannon: precision beam — bypasses damageTaken multiplier. */
export function applyFlashCannon(
  turretConfig: any,
  target: Beyblade,
  nowMs: number,
): void {
  const dmg = turretConfig.attackDamage ?? 35;
  if (!target.invulnerable) { target.health -= dmg; target.damageReceived += dmg; }
}

/** bullet_punch: single rapid hit in the multi-hit combo. */
export function applyBulletPunchHit(
  turretConfig: any,
  target: Beyblade,
  hitIndex: number,
): void {
  const dmg = (turretConfig.attackDamage ?? 10) * target.damageTaken;
  if (!target.invulnerable) { target.health -= dmg; target.damageReceived += dmg; }
}

/** steel_surge: expanding spike wall — damages beys caught by advancing front. */
export function applySteelSurgeTick(
  turretConfig: any,
  beyblades: Beyblade[],
  surgeRadiusPx: number,
  dt: number,
  bridge: TurretProcessorBridge,
): void {
  const tx = (turretConfig.x ?? 0) * 24;
  const ty = (turretConfig.y ?? 0) * 24;
  const dmgPerTick = turretConfig.steelSurgeDmgPerTick ?? 20;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - tx, dy = b.y - ty;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (Math.abs(dist - surgeRadiusPx) < 20) {
      const dmg = dmgPerTick * dt * b.damageTaken;
      if (!b.invulnerable) { b.health -= dmg; b.damageReceived += dmg; }
      const dl = Math.sqrt(dx * dx + dy * dy) || 1;
      bridge.applyForce(b.id, (dx / dl) * 0.04, (dy / dl) * 0.04);
    }
  }
}

// ── Round 3: Nature type ────────────────────────────────────────────────────

/** absorb: sustained drain beam tick — sap spin + health. */
export function processAbsorbTick(
  turretConfig: any,
  target: Beyblade,
  dt: number,
): void {
  const hpPerSec = turretConfig.absorbHpPerSec ?? 8;
  const spinPerSec = turretConfig.absorbSpinPerSec ?? 15;
  const hpDrain = hpPerSec * dt * target.damageTaken;
  if (!target.invulnerable) { target.health -= hpDrain; target.damageReceived += hpDrain; }
  target.spin = Math.max(0, target.spin - spinPerSec * dt);
}

/** bloom_doom: ULTIMATE — release stored spin as burst force on all beys. */
export function applyBloomDoomBurst(
  turretConfig: any,
  beyblades: Beyblade[],
  absorbedSpin: number,
  bridge: TurretProcessorBridge,
): void {
  const tx = (turretConfig.x ?? 0) * 24;
  const ty = (turretConfig.y ?? 0) * 24;
  const forceMult = turretConfig.bloomDoomBurstForceMult ?? 0.00002;
  const force = absorbedSpin * forceMult;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - tx, dy = b.y - ty;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    bridge.applyForce(b.id, (dx / dist) * force, (dy / dist) * force);
    const dmg = turretConfig.attackDamage ?? 30;
    if (!b.invulnerable) { b.health -= dmg * b.damageTaken; b.damageReceived += dmg; }
  }
}

// ── Round 3: Shadow type ────────────────────────────────────────────────────

/** night_shade: deals fraction of target's CURRENT health, ignores defense. */
export function applyNightShade(turretConfig: any, target: Beyblade): void {
  const fraction = turretConfig.nightShadeHpFraction ?? 0.25;
  const dmg = target.health * fraction;
  if (!target.invulnerable) { target.health -= dmg; target.damageReceived += dmg; }
}

/** shadow_force: homing dark projectile hit. */
export function applyShadowForce(turretConfig: any, target: Beyblade): void {
  const dmg = (turretConfig.attackDamage ?? 30) * target.damageTaken;
  if (!target.invulnerable) { target.health -= dmg; target.damageReceived += dmg; }
}

/** phantom_force: ULTIMATE — realm tick, all beys take DoT + confusion. */
export function applyPhantomForceTick(
  turretConfig: any,
  beyblades: Beyblade[],
  nowMs: number,
  dt: number,
): void {
  const dmgPerSec = turretConfig.phantomForceDmgPerSec ?? 15;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dmg = dmgPerSec * dt * b.damageTaken;
    if (!b.invulnerable) { b.health -= dmg; b.damageReceived += dmg; }
  }
}

// ── Round 3: Light type ─────────────────────────────────────────────────────

/** flash: arena-wide blind — control locks all active beys. */
export function applyFlash(
  turretConfig: any,
  beyblades: Beyblade[],
  nowMs: number,
): void {
  const lockUntil = nowMs + (turretConfig.flashBlindSec ?? 1.5) * 1000;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    if (b.controlLockedUntilMs < lockUntil) {
      b.controlLockedUntilMs = lockUntil;
      b.controlLockSource = "flash";
    }
  }
}

/** solar_beam: charge then fire — bypasses defense. */
export function applySolarBeam(turretConfig: any, target: Beyblade): void {
  const dmg = (turretConfig.attackDamage ?? 30) * (turretConfig.solarBeamDamageMult ?? 2.5);
  if (!target.invulnerable) { target.health -= dmg; target.damageReceived += dmg; }
}

/** solar_flare: ULTIMATE — arena-wide blind + ignores all defense multipliers. */
export function applySolarFlare(
  turretConfig: any,
  beyblades: Beyblade[],
  nowMs: number,
): void {
  const lockUntil = nowMs + (turretConfig.solarFlareBlindSec ?? 3) * 1000;
  const dmg = turretConfig.solarFlareDamage ?? 40;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    if (!b.invulnerable) { b.health -= dmg; b.damageReceived += dmg; }
    if (b.controlLockedUntilMs < lockUntil) {
      b.controlLockedUntilMs = lockUntil;
      b.controlLockSource = "solar_flare";
    }
  }
}

// ── Round 3: Thunder/Storm type ─────────────────────────────────────────────

/** spark: quick jolt — double damage if target is slowed. */
export function applySpark(
  turretConfig: any,
  target: Beyblade,
  nowMs: number,
): void {
  const isSlowed = (target as any)._speedSlowExpiresMs && nowMs < (target as any)._speedSlowExpiresMs;
  const wetMult = isSlowed ? (turretConfig.sparkWetDamageMult ?? 2.0) : 1.0;
  const dmg = (turretConfig.attackDamage ?? 15) * wetMult * target.damageTaken;
  if (!target.invulnerable) { target.health -= dmg; target.damageReceived += dmg; }
}

/** magnetic_field: sustained pull all beys toward turret. */
export function processMagneticFieldTick(
  turretConfig: any,
  runtime: TurretRuntimeState,
  beyblades: Beyblade[],
  nowMs: number,
  dt: number,
  bridge: TurretProcessorBridge,
): void {
  if (nowMs >= (runtime.magneticFieldExpiresMs ?? 0)) return;
  const force = (turretConfig.magneticFieldOrbitForce ?? 0.012);
  const tx = (turretConfig.x ?? 0) * 24;
  const ty = (turretConfig.y ?? 0) * 24;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = tx - b.x, dy = ty - b.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    bridge.applyForce(b.id, (dx / dist) * force, (dy / dist) * force);
  }
}

/** thunder_storm tick: periodic lightning strikes every interval. */
export function processThunderStormTick(
  turretConfig: any,
  runtime: TurretRuntimeState,
  beyblades: Beyblade[],
  nowMs: number,
  rand: () => number,
): void {
  if (nowMs >= (runtime.thunderStormExpiresMs ?? 0)) return;
  if (nowMs < (runtime.thunderStormNextStrikeMs ?? 0)) return;
  const intervalMs = (turretConfig.thunderStormStrikeIntervalSec ?? 1.5) * 1000;
  runtime.thunderStormNextStrikeMs = nowMs + intervalMs;
  const active = beyblades.filter(b => b.isActive && !b.isRingOut);
  if (!active.length) return;
  const target = active[Math.floor(rand() * active.length)];
  const dmg = (turretConfig.thunderStormStrikeDmg ?? 15) * target.damageTaken;
  if (!target.invulnerable) { target.health -= dmg; target.damageReceived += dmg; }
}

// ── Round 3: Void type ──────────────────────────────────────────────────────

/** distortion: randomly teleport target to a new arena position. */
export function applyDistortion(
  turretConfig: any,
  target: Beyblade,
  rand: () => number,
): void {
  const radiusPx = (turretConfig.distortionTeleportRadiusCm ?? 20) * 24;
  const angle = rand() * Math.PI * 2;
  const r = rand() * radiusPx;
  target.x = Math.cos(angle) * r;
  target.y = Math.sin(angle) * r;
}

/** black_hole_shot tick: singularity pull force on all beys inside radius. */
export function processBlackHoleTick(
  turretConfig: any,
  runtime: TurretRuntimeState,
  beyblades: Beyblade[],
  nowMs: number,
  dt: number,
  bridge: TurretProcessorBridge,
): void {
  if (nowMs >= (runtime.blackHoleExpiresMs ?? 0)) return;
  const cx = runtime.blackHoleCenterX ?? 0;
  const cy = runtime.blackHoleCenterY ?? 0;
  const r = turretConfig.blackHoleShotRadiusPx ?? 80;
  const force = turretConfig.blackHoleShotForce ?? 0.01;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = cx - b.x, dy = cy - b.y;
    if (dx * dx + dy * dy > r * r) continue;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    bridge.applyForce(b.id, (dx / dist) * force, (dy / dist) * force);
  }
}

/** spacial_rend: ULTIMATE — teleport all beys + massive void damage. */
export function applySpacialRend(
  turretConfig: any,
  beyblades: Beyblade[],
  rand: () => number,
): void {
  const radiusPx = (turretConfig.spacialRendTeleportRadiusCm ?? 20) * 24;
  const dmg = turretConfig.spacialRendDamage ?? 50;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    if (!b.invulnerable) { b.health -= dmg * b.damageTaken; b.damageReceived += dmg; }
    const angle = rand() * Math.PI * 2;
    const r = rand() * radiusPx;
    b.x = Math.cos(angle) * r;
    b.y = Math.sin(angle) * r;
  }
}

// ── Fighting / Impact moves ─────────────────────────────────────────────────

/** cross_slash: X-beam — bonus damage if target below 50% spin. */
export function applyCrossSlash(turretConfig: any, target: Beyblade): void {
  const stability = target.spin / (target.maxSpin || 1);
  const mult = stability < 0.5 ? (turretConfig.crossSlashBonusMult ?? 1.5) : 1.0;
  const dmg = (turretConfig.attackDamage ?? 20) * mult * target.damageTaken;
  if (!target.invulnerable) { target.health -= dmg; target.damageReceived += dmg; }
}

/** impact_burst: knockback + input confusion on hit. */
export function applyImpactBurst(
  turretConfig: any,
  target: Beyblade,
  nowMs: number,
  bridge: TurretProcessorBridge,
): void {
  const dmg = (turretConfig.attackDamage ?? 22) * target.damageTaken;
  if (!target.invulnerable) { target.health -= dmg; target.damageReceived += dmg; }
  bridge.applyKnockback(target.id, { x: target.x, y: target.y }, turretConfig.impactBurstKnockback ?? 0.07);
  const lockUntil = nowMs + (turretConfig.impactBurstConfusionSec ?? 1.5) * 1000;
  if (target.controlLockedUntilMs < lockUntil) {
    target.controlLockedUntilMs = lockUntil;
    target.controlLockSource = "impact_burst";
  }
}

/** armor_pierce: defense-shattering — ignores invulnerability, clears defense buffs. */
export function applyArmorPierce(turretConfig: any, target: Beyblade, nowMs: number): void {
  const dmg = turretConfig.attackDamage ?? 25;
  target.health -= dmg; // intentionally bypasses invulnerable + damageTaken
  target.damageReceived += dmg;
  (target as any)._armorPierceDebuffExpiresMs = nowMs + (turretConfig.armorPierceShatterSec ?? 3) * 1000;
}

/** flurry_barrage: one hit in the burst — called for each shot in sequence. */
export function applyFlurryBarrageHit(
  turretConfig: any,
  target: Beyblade,
  hitIndex: number,
): void {
  const base = turretConfig.attackDamage ?? 8;
  const escalate = turretConfig.flurryBarrageEscalateMult ?? 0.3;
  const dmg = base * (1 + hitIndex * escalate) * target.damageTaken;
  if (!target.invulnerable) { target.health -= dmg; target.damageReceived += dmg; }
}

/** mach_shot: ultra-fast priority bolt — full damage on direct hit. */
export function applyMachShot(turretConfig: any, target: Beyblade): void {
  const dmg = (turretConfig.attackDamage ?? 20) * target.damageTaken;
  if (!target.invulnerable) { target.health -= dmg; target.damageReceived += dmg; }
}

/** gravity_grip: per-tick hold + spin drain. */
export function processGravityGripTick(
  turretConfig: any,
  runtime: TurretRuntimeState,
  beyblades: Beyblade[],
  nowMs: number,
  dt: number,
  bridge: TurretProcessorBridge,
): void {
  if (!runtime.gravityGripTargetId || nowMs >= (runtime.gravityGripExpiresMs ?? 0)) return;
  const target = beyblades.find(b => b.id === runtime.gravityGripTargetId && b.isActive && !b.isRingOut);
  if (!target) return;
  const tx = (turretConfig.x ?? 0) * 24;
  const ty = (turretConfig.y ?? 0) * 24;
  // Pull toward turret
  const dx = tx - target.x, dy = ty - target.y;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  bridge.applyForce(target.id, (dx / dist) * 0.04, (dy / dist) * 0.04);
  // Spin drain
  target.spin = Math.max(0, target.spin - (turretConfig.gravityGripSpinDrainPerSec ?? 40) * dt);
}

/** ram_charge: heavy kinetic shot — stun chance on hit. */
export function applyRamCharge(
  turretConfig: any,
  target: Beyblade,
  nowMs: number,
  rand: () => number,
  bridge: TurretProcessorBridge,
): void {
  const dmg = (turretConfig.attackDamage ?? 28) * target.damageTaken;
  if (!target.invulnerable) { target.health -= dmg; target.damageReceived += dmg; }
  bridge.applyKnockback(target.id, { x: target.x, y: target.y }, 0.05);
  if (rand() < (turretConfig.ramChargeStunChance ?? 0.3)) {
    const lockUntil = nowMs + (turretConfig.ramChargeStunSec ?? 1.0) * 1000;
    if (target.controlLockedUntilMs < lockUntil) {
      target.controlLockedUntilMs = lockUntil;
      target.controlLockSource = "ram_charge";
    }
  }
}

/** graviton_throw: launches bey toward nearest arena wall. */
export function applyGravitonThrow(
  turretConfig: any,
  target: Beyblade,
  bridge: TurretProcessorBridge,
): void {
  const dmg = (turretConfig.attackDamage ?? 20) * target.damageTaken;
  if (!target.invulnerable) { target.health -= dmg; target.damageReceived += dmg; }
  // Push directly away from center (toward wall)
  const dist = Math.sqrt(target.x * target.x + target.y * target.y) || 1;
  const force = turretConfig.gravitonThrowForce ?? 0.12;
  bridge.applyForce(target.id, (target.x / dist) * force, (target.y / dist) * force);
}

// ── Close-range moves ───────────────────────────────────────────────────────

/** razor_spin: spinning blade aura — damages all beys inside each tick. */
export function processRazorSpinTick(
  turretConfig: any,
  runtime: TurretRuntimeState,
  beyblades: Beyblade[],
  dt: number,
): void {
  runtime.razorSpinAngleDeg = ((runtime.razorSpinAngleDeg ?? 0) + 180 * dt) % 360;
  const auraR = turretConfig.razorSpinRadiusPx ?? 70;
  const dmgPerSec = turretConfig.razorSpinDmgPerSec ?? 20;
  const tx = (turretConfig.x ?? 0) * 24;
  const ty = (turretConfig.y ?? 0) * 24;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - tx, dy = b.y - ty;
    if (dx * dx + dy * dy > auraR * auraR) continue;
    const dmg = dmgPerSec * dt * b.damageTaken;
    if (!b.invulnerable) { b.health -= dmg; b.damageReceived += dmg; }
  }
}

/** point_blank: extreme damage only if bey is within very short range. */
export function applyPointBlank(turretConfig: any, beyblades: Beyblade[], bridge: TurretProcessorBridge): void {
  const rangePx = turretConfig.pointBlankRangePx ?? 60;
  const damageMult = turretConfig.pointBlankDamageMult ?? 3.0;
  const tx = (turretConfig.x ?? 0) * 24;
  const ty = (turretConfig.y ?? 0) * 24;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - tx, dy = b.y - ty;
    if (dx * dx + dy * dy > rangePx * rangePx) continue;
    const dmg = (turretConfig.attackDamage ?? 15) * damageMult * b.damageTaken;
    if (!b.invulnerable) { b.health -= dmg; b.damageReceived += dmg; }
  }
}

/** static_field: auto-shock on proximity entry — tracks last-hit time per bey. */
export function processStaticFieldTick(
  turretConfig: any,
  beyblades: Beyblade[],
  nowMs: number,
): void {
  const fieldR = turretConfig.staticFieldRadiusPx ?? 80;
  const shockDmg = turretConfig.staticFieldShockDmg ?? 15;
  const cooldownMs = turretConfig.staticFieldCooldownMs ?? 1000;
  const tx = (turretConfig.x ?? 0) * 24;
  const ty = (turretConfig.y ?? 0) * 24;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - tx, dy = b.y - ty;
    if (dx * dx + dy * dy > fieldR * fieldR) continue;
    const lastHit = (b as any)._staticFieldLastHitMs ?? 0;
    if (nowMs - lastHit < cooldownMs) continue;
    (b as any)._staticFieldLastHitMs = nowMs;
    if (!b.invulnerable) { b.health -= shockDmg * b.damageTaken; b.damageReceived += shockDmg; }
  }
}

/** acid_spray: cone debuff — increases target's damageTaken temporarily. */
export function applyAcidSpray(
  turretConfig: any,
  target: Beyblade,
  nowMs: number,
): void {
  const dmg = (turretConfig.attackDamage ?? 12) * target.damageTaken;
  if (!target.invulnerable) { target.health -= dmg; target.damageReceived += dmg; }
  const mult = turretConfig.acidSprayDefBreakMult ?? 1.5;
  const expiresMs = nowMs + (turretConfig.acidSprayDebuffSec ?? 3) * 1000;
  if (!(target as any)._acidDebuffExpiresMs || (target as any)._acidDebuffExpiresMs < expiresMs) {
    (target as any)._acidDebuffMult = mult;
    (target as any)._acidDebuffExpiresMs = expiresMs;
    target.damageTaken *= mult;
  }
}

/** applyAcidDebuffExpiry: call each tick to restore damageTaken when debuff expires. */
export function applyAcidDebuffExpiry(beyblades: Beyblade[], nowMs: number): void {
  for (const b of beyblades) {
    if (!(b as any)._acidDebuffExpiresMs) continue;
    if (nowMs >= (b as any)._acidDebuffExpiresMs) {
      b.damageTaken /= (b as any)._acidDebuffMult ?? 1.5;
      delete (b as any)._acidDebuffExpiresMs;
      delete (b as any)._acidDebuffMult;
    }
  }
}

/** shockwave: radial push all nearby beys outward. */
export function applyShockwave(
  turretConfig: any,
  beyblades: Beyblade[],
  bridge: TurretProcessorBridge,
): void {
  const pulseR = turretConfig.shockwaveRadiusPx ?? 120;
  const force = turretConfig.shockwavePushForce ?? 0.08;
  const tx = (turretConfig.x ?? 0) * 24;
  const ty = (turretConfig.y ?? 0) * 24;
  const dmg = turretConfig.attackDamage ?? 15;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - tx, dy = b.y - ty;
    if (dx * dx + dy * dy > pulseR * pulseR) continue;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    bridge.applyForce(b.id, (dx / dist) * force, (dy / dist) * force);
    if (!b.invulnerable) { b.health -= dmg * b.damageTaken; b.damageReceived += dmg; }
  }
}

/** spin_slash: rotating blade arms — multi-hit sweep tick. */
export function processSpinSlashTick(
  turretConfig: any,
  runtime: TurretRuntimeState,
  beyblades: Beyblade[],
  dt: number,
): void {
  const arms = turretConfig.spinSlashArms ?? 3;
  runtime.spinSlashAngleDeg = ((runtime.spinSlashAngleDeg ?? 0) + (turretConfig.spinSlashSpeedDeg ?? 180) * dt) % 360;
  const bladeR = (turretConfig.attackRange ?? 8) * 24 * 0.5;
  const tx = (turretConfig.x ?? 0) * 24;
  const ty = (turretConfig.y ?? 0) * 24;
  const dmg = turretConfig.attackDamage ?? 10;
  for (let a = 0; a < arms; a++) {
    const armDeg = runtime.spinSlashAngleDeg + (360 / arms) * a;
    const armRad = (armDeg * Math.PI) / 180;
    const bx = tx + Math.cos(armRad) * bladeR;
    const by = ty + Math.sin(armRad) * bladeR;
    for (const b of beyblades) {
      if (!b.isActive || b.isRingOut) continue;
      const dx = b.x - bx, dy = b.y - by;
      if (dx * dx + dy * dy > 1024) continue; // 32px hit radius
      const hit = dmg * dt * b.damageTaken;
      if (!b.invulnerable) { b.health -= hit; b.damageReceived += hit; }
    }
  }
}

/** guillotine: execution shot — massive damage only if target below spin threshold. */
export function applyGuillotine(turretConfig: any, target: Beyblade): boolean {
  const threshold = turretConfig.guillotineSpinThreshold ?? 0.25;
  if (target.spin / (target.maxSpin || 1) > threshold) return false;
  const dmg = turretConfig.guillotineDamage ?? 120;
  if (!target.invulnerable) { target.health -= dmg; target.damageReceived += dmg; }
  return true;
}

// ── Aerial / Ground ─────────────────────────────────────────────────────────

/** anti_grav: lift target (mark it airborne); call processAntiGravTick each frame. */
export function triggerAntiGrav(
  turretConfig: any,
  runtime: TurretRuntimeState,
  target: Beyblade,
  nowMs: number,
  bridge: TurretProcessorBridge,
): void {
  runtime.antiGravTargetId = target.id;
  runtime.antiGravOriginX = target.x;
  runtime.antiGravOriginY = target.y;
  runtime.antiGravLandMs = nowMs + (turretConfig.antiGravAirborneSec ?? 1.5) * 1000;
  if (bridge.setVelocity) bridge.setVelocity(target.id, 0, 0);
  target.invulnerable = true; // airborne = invulnerable + no physics
}

export function processAntiGravTick(
  turretConfig: any,
  runtime: TurretRuntimeState,
  beyblades: Beyblade[],
  nowMs: number,
  bridge: TurretProcessorBridge,
): void {
  if (!runtime.antiGravTargetId || nowMs < (runtime.antiGravLandMs ?? 0)) return;
  const target = beyblades.find(b => b.id === runtime.antiGravTargetId);
  if (!target) { runtime.antiGravTargetId = undefined; return; }
  target.invulnerable = false;
  // Slam AoE at landing position
  const aoeR = turretConfig.antiGravSlamAoePx ?? 70;
  const slamDmg = turretConfig.antiGravSlamDamage ?? 30;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - target.x, dy = b.y - target.y;
    if (dx * dx + dy * dy > aoeR * aoeR) continue;
    if (!b.invulnerable) { b.health -= slamDmg * b.damageTaken; b.damageReceived += slamDmg; }
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    bridge.applyForce(b.id, (dx / dist) * 0.04, (dy / dist) * 0.04);
  }
  runtime.antiGravTargetId = undefined;
}

// ── Bug type ────────────────────────────────────────────────────────────────

/** drain_sting: steals fraction of target's current health. */
export function applyDrainSting(turretConfig: any, source: any, target: Beyblade): void {
  const fraction = turretConfig.drainStingFraction ?? 0.1;
  const stolen = target.health * fraction;
  if (!target.invulnerable) { target.health -= stolen; target.damageReceived += stolen; }
}

/** string_shot: snare — extreme speed reduction + disables dodge. */
export function applyStringShot(turretConfig: any, target: Beyblade, nowMs: number): void {
  const mult = turretConfig.stringShotSpeedMult ?? 0.3;
  const durationMs = (turretConfig.stringShotDurationSec ?? 3) * 1000;
  (target as any)._speedSlowMult = mult;
  (target as any)._speedSlowExpiresMs = nowMs + durationMs;
}

/** silver_wind: ULTIMATE — AoE damage + negates all active buffs. */
export function applySilverWind(
  turretConfig: any,
  beyblades: Beyblade[],
  bridge: TurretProcessorBridge,
): void {
  const r = turretConfig.silverWindRadiusPx ?? 150;
  const dmg = turretConfig.silverWindDamage ?? 35;
  const tx = (turretConfig.x ?? 0) * 24;
  const ty = (turretConfig.y ?? 0) * 24;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - tx, dy = b.y - ty;
    if (dx * dx + dy * dy > r * r) continue;
    if (!b.invulnerable) { b.health -= dmg * b.damageTaken; b.damageReceived += dmg; }
    // Negate speed slow buffs
    delete (b as any)._speedSlowMult;
    delete (b as any)._speedSlowExpiresMs;
    delete (b as any)._acidDebuffExpiresMs;
  }
}

// ── Dark type ───────────────────────────────────────────────────────────────

/** sting_bolt: high-crit energy jolt. */
export function applyStingBolt(turretConfig: any, target: Beyblade, rand: () => number): void {
  const critChance = turretConfig.stingBoltCritChance ?? 0.3;
  const critMult = turretConfig.stingBoltCritMult ?? 2.0;
  const mult = rand() < critChance ? critMult : 1.0;
  const dmg = (turretConfig.attackDamage ?? 15) * mult * target.damageTaken;
  if (!target.invulnerable) { target.health -= dmg; target.damageReceived += dmg; }
}

/** foul_play: uses target's own attack multiplier against them. */
export function applyFoulPlay(turretConfig: any, target: Beyblade): void {
  const mult = turretConfig.foulPlayReflectMult ?? 1.0;
  const atkMult = (target as any).attackMultiplier ?? 1.0;
  const dmg = (turretConfig.attackDamage ?? 20) * atkMult * mult * target.damageTaken;
  if (!target.invulnerable) { target.health -= dmg; target.damageReceived += dmg; }
}

/** dark_pulse: ULTIMATE — AoE stagger + heavy spin drain. */
export function applyDarkPulse(
  turretConfig: any,
  beyblades: Beyblade[],
  nowMs: number,
  bridge: TurretProcessorBridge,
): void {
  const r = turretConfig.darkPulseRadiusPx ?? 160;
  const tx = (turretConfig.x ?? 0) * 24;
  const ty = (turretConfig.y ?? 0) * 24;
  const staggerMs = (turretConfig.darkPulseStaggerSec ?? 1.0) * 1000;
  const spinFraction = turretConfig.darkPulseSpinDrainFraction ?? 0.25;
  const lockUntil = nowMs + staggerMs;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - tx, dy = b.y - ty;
    if (dx * dx + dy * dy > r * r) continue;
    if (!b.invulnerable) {
      const dmg = (turretConfig.attackDamage ?? 25) * b.damageTaken;
      b.health -= dmg; b.damageReceived += dmg;
    }
    b.spin = Math.max(0, b.spin - b.spin * spinFraction);
    if (b.controlLockedUntilMs < lockUntil) {
      b.controlLockedUntilMs = lockUntil;
      b.controlLockSource = "dark_pulse";
    }
  }
}

// ── Steel type ──────────────────────────────────────────────────────────────

/** steel_ram: heavy bolt — knockback + brief stun. */
export function applySteelRam(
  turretConfig: any,
  target: Beyblade,
  nowMs: number,
  bridge: TurretProcessorBridge,
): void {
  const dmg = (turretConfig.attackDamage ?? 30) * target.damageTaken;
  if (!target.invulnerable) { target.health -= dmg; target.damageReceived += dmg; }
  bridge.applyKnockback(target.id, { x: target.x, y: target.y }, turretConfig.steelRamKnockback ?? 0.09);
  const lockUntil = nowMs + (turretConfig.steelRamStunSec ?? 0.8) * 1000;
  if (target.controlLockedUntilMs < lockUntil) {
    target.controlLockedUntilMs = lockUntil;
    target.controlLockSource = "steel_ram";
  }
}

/** metal_sound: defense-shredding screech — multiplies target's damageTaken. */
export function applyMetalSound(turretConfig: any, target: Beyblade, nowMs: number): void {
  const mult = turretConfig.metalSoundDefBreakMult ?? 1.8;
  const expiresMs = nowMs + (turretConfig.metalSoundDurationSec ?? 4) * 1000;
  if (!(target as any)._metalSoundExpiresMs || (target as any)._metalSoundExpiresMs < expiresMs) {
    target.damageTaken *= mult;
    (target as any)._metalSoundMult = mult;
    (target as any)._metalSoundExpiresMs = expiresMs;
  }
}

/** applyMetalSoundExpiry: restore damageTaken each tick when debuff expires. */
export function applyMetalSoundExpiry(beyblades: Beyblade[], nowMs: number): void {
  for (const b of beyblades) {
    if (!(b as any)._metalSoundExpiresMs) continue;
    if (nowMs >= (b as any)._metalSoundExpiresMs) {
      b.damageTaken /= (b as any)._metalSoundMult ?? 1.8;
      delete (b as any)._metalSoundExpiresMs;
      delete (b as any)._metalSoundMult;
    }
  }
}

/** magnet_bomb: ULTIMATE — pull phase then explosion. */
export function processMagnetBombTick(
  turretConfig: any,
  runtime: TurretRuntimeState,
  beyblades: Beyblade[],
  nowMs: number,
  dt: number,
  bridge: TurretProcessorBridge,
): void {
  const pullUntil = runtime.magnetBombPullUntilMs ?? 0;
  const tx = (turretConfig.x ?? 0) * 24;
  const ty = (turretConfig.y ?? 0) * 24;
  if (nowMs < pullUntil) {
    const pullForce = turretConfig.magnetBombPullForce ?? 0.02;
    for (const b of beyblades) {
      if (!b.isActive || b.isRingOut) continue;
      const dx = tx - b.x, dy = ty - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      bridge.applyForce(b.id, (dx / dist) * pullForce, (dy / dist) * pullForce);
    }
  } else if (nowMs < pullUntil + 100) {
    // Explosion tick — fires once right after pull phase
    const r = turretConfig.magnetBombRadiusPx ?? 200;
    const force = turretConfig.magnetBombPushForce ?? 0.18;
    const dmg = turretConfig.attackDamage ?? 50;
    for (const b of beyblades) {
      if (!b.isActive || b.isRingOut) continue;
      const dx = b.x - tx, dy = b.y - ty;
      if (dx * dx + dy * dy > r * r) continue;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      bridge.applyForce(b.id, (dx / dist) * force, (dy / dist) * force);
      if (!b.invulnerable) { b.health -= dmg * b.damageTaken; b.damageReceived += dmg; }
    }
  }
}

// ── Normal type ─────────────────────────────────────────────────────────────

/** tackle: basic kinetic knockback bolt. */
export function applyTackle(turretConfig: any, target: Beyblade, bridge: TurretProcessorBridge): void {
  const dmg = (turretConfig.attackDamage ?? 15) * target.damageTaken;
  if (!target.invulnerable) { target.health -= dmg; target.damageReceived += dmg; }
  bridge.applyKnockback(target.id, { x: target.x, y: target.y }, turretConfig.tackleKnockback ?? 0.05);
}

/** drill_shot: piercing bolt — high crit + passes through first target. */
export function applyDrillShot(
  turretConfig: any,
  beyblades: Beyblade[],
  originX: number,
  originY: number,
  dirX: number,
  dirY: number,
  rand: () => number,
): void {
  const critChance = turretConfig.drillShotCritChance ?? 0.25;
  const piercePx = turretConfig.drillShotPiercePx ?? 80;
  let firstHit = false;
  let firstHitX = 0, firstHitY = 0;
  const sorted = [...beyblades]
    .filter(b => b.isActive && !b.isRingOut)
    .sort((a, b) => {
      const da = (a.x - originX) * dirX + (a.y - originY) * dirY;
      const db = (b.x - originX) * dirX + (b.y - originY) * dirY;
      return da - db;
    });
  for (const b of sorted) {
    const proj = (b.x - originX) * dirX + (b.y - originY) * dirY;
    if (!firstHit && proj > 0) {
      firstHit = true;
      firstHitX = b.x; firstHitY = b.y;
    } else if (firstHit) {
      const dx = b.x - firstHitX, dy = b.y - firstHitY;
      if (dx * dx + dy * dy > piercePx * piercePx) continue;
    } else continue;
    const critMult = rand() < critChance ? 2.0 : 1.0;
    const dmg = (turretConfig.attackDamage ?? 18) * critMult * b.damageTaken;
    if (!b.invulnerable) { b.health -= dmg; b.damageReceived += dmg; }
  }
}

/** hyper_voice: ULTIMATE — arena-wide equal damage + brief stagger. */
export function applyHyperVoice(turretConfig: any, beyblades: Beyblade[], nowMs: number): void {
  const dmg = turretConfig.hyperVoiceDamage ?? 25;
  const staggerMs = (turretConfig.hyperVoiceStaggerSec ?? 0.5) * 1000;
  const lockUntil = nowMs + staggerMs;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    if (!b.invulnerable) { b.health -= dmg * b.damageTaken; b.damageReceived += dmg; }
    if (b.controlLockedUntilMs < lockUntil) {
      b.controlLockedUntilMs = lockUntil;
      b.controlLockSource = "hyper_voice";
    }
  }
}

// ── Stat-change moves ───────────────────────────────────────────────────────

/** tail_whip: AoE debuff — beys take extra damage for duration. */
export function applyTailWhip(turretConfig: any, beyblades: Beyblade[], nowMs: number): void {
  const r = turretConfig.tailWhipRadiusPx ?? 140;
  const mult = turretConfig.tailWhipDamageMult ?? 1.3;
  const expiresMs = nowMs + (turretConfig.tailWhipDurationSec ?? 4) * 1000;
  const tx = (turretConfig.x ?? 0) * 24;
  const ty = (turretConfig.y ?? 0) * 24;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - tx, dy = b.y - ty;
    if (dx * dx + dy * dy > r * r) continue;
    if (!(b as any)._tailWhipExpiresMs || (b as any)._tailWhipExpiresMs < expiresMs) {
      b.damageTaken *= mult;
      (b as any)._tailWhipMult = mult;
      (b as any)._tailWhipExpiresMs = expiresMs;
    }
  }
}

/** applyTailWhipExpiry: restore damageTaken when tail_whip debuff expires. */
export function applyTailWhipExpiry(beyblades: Beyblade[], nowMs: number): void {
  for (const b of beyblades) {
    if (!(b as any)._tailWhipExpiresMs) continue;
    if (nowMs >= (b as any)._tailWhipExpiresMs) {
      b.damageTaken /= (b as any)._tailWhipMult ?? 1.3;
      delete (b as any)._tailWhipExpiresMs;
      delete (b as any)._tailWhipMult;
    }
  }
}

/** growl: AoE debuff — increases spin drain rate on affected beys. */
export function applyGrowl(turretConfig: any, beyblades: Beyblade[], nowMs: number): void {
  const r = turretConfig.growlRadiusPx ?? 140;
  const expiresMs = nowMs + (turretConfig.growlDurationSec ?? 4) * 1000;
  const mult = turretConfig.growlSpinDrainMult ?? 1.5;
  const tx = (turretConfig.x ?? 0) * 24;
  const ty = (turretConfig.y ?? 0) * 24;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - tx, dy = b.y - ty;
    if (dx * dx + dy * dy > r * r) continue;
    if (!(b as any)._growlExpiresMs || (b as any)._growlExpiresMs < expiresMs) {
      (b as any)._growlSpinDrainMult = mult;
      (b as any)._growlExpiresMs = expiresMs;
    }
  }
}

// ── Poison type ─────────────────────────────────────────────────────────────

/** poison_jab: applies stacking poison DoT. */
export function applyPoisonJab(
  turretConfig: any,
  runtime: TurretRuntimeState,
  target: Beyblade,
  nowMs: number,
): void {
  const baseDmg = (turretConfig.attackDamage ?? 12) * target.damageTaken;
  if (!target.invulnerable) { target.health -= baseDmg; target.damageReceived += baseDmg; }
  const dotDmg = (turretConfig.poisonJabDotPerSec ?? 5) * (turretConfig.poisonJabStacks ?? 1);
  const expiresMs = nowMs + (turretConfig.poisonJabDotDurationSec ?? 4) * 1000;
  if (!runtime.poisonTargets) runtime.poisonTargets = [];
  const existing = runtime.poisonTargets.find(p => p.id === target.id);
  if (existing) {
    existing.stacksDmgPerSec += dotDmg;
    existing.expiresMs = Math.max(existing.expiresMs, expiresMs);
  } else {
    runtime.poisonTargets.push({ id: target.id, stacksDmgPerSec: dotDmg, expiresMs });
  }
}

/** applyPoisonTick: drain health from poisoned targets each tick. */
export function applyPoisonTick(
  runtime: TurretRuntimeState,
  beyblades: Beyblade[],
  nowMs: number,
  dt: number,
): void {
  if (!runtime.poisonTargets?.length) return;
  runtime.poisonTargets = runtime.poisonTargets.filter(p => nowMs < p.expiresMs);
  for (const poison of runtime.poisonTargets) {
    const b = beyblades.find(b => b.id === poison.id && b.isActive && !b.isRingOut);
    if (!b) continue;
    const dmg = poison.stacksDmgPerSec * dt * b.damageTaken;
    if (!b.invulnerable) { b.health -= dmg; b.damageReceived += dmg; }
  }
}

/** venoshock: double damage if target has an active status condition. */
export function applyVenoshock(turretConfig: any, target: Beyblade, nowMs: number): void {
  const hasStatus = (
    (target.controlLockedUntilMs > nowMs) ||
    ((target as any)._speedSlowExpiresMs && nowMs < (target as any)._speedSlowExpiresMs) ||
    ((target as any)._emberBurnTicks && (target as any)._emberBurnTicks > 0)
  );
  const mult = hasStatus ? (turretConfig.venoshockStatusMult ?? 2.0) : 1.0;
  const dmg = (turretConfig.attackDamage ?? 20) * mult * target.damageTaken;
  if (!target.invulnerable) { target.health -= dmg; target.damageReceived += dmg; }
}

// ── Psychic extra ───────────────────────────────────────────────────────────

/** psyshock: hits a random bey but ignores defense multiplier. */
export function applyPsyshock(turretConfig: any, target: Beyblade): void {
  const dmg = turretConfig.attackDamage ?? 25;
  if (!target.invulnerable) { target.health -= dmg; target.damageReceived += dmg; }
}

/** applyFutureSightStrikes: check and apply any pending future_sight hits. */
export function applyFutureSightStrikes(
  runtime: TurretRuntimeState,
  beyblades: Beyblade[],
  nowMs: number,
): void {
  if (!runtime.futureSightPending?.length) return;
  const fired: typeof runtime.futureSightPending = [];
  const remaining: typeof runtime.futureSightPending = [];
  for (const pending of runtime.futureSightPending) {
    if (nowMs >= pending.landMs) fired.push(pending);
    else remaining.push(pending);
  }
  runtime.futureSightPending = remaining;
  for (const strike of fired) {
    const b = beyblades.find(b => b.id === strike.targetId && b.isActive && !b.isRingOut);
    if (!b) continue;
    if (!b.invulnerable) { b.health -= strike.damage * b.damageTaken; b.damageReceived += strike.damage; }
  }
}

// ── Dragon type ─────────────────────────────────────────────────────────────

/** dragon_slash: one slash of the triple combo — stagger chance on last hit. */
export function applyDragonSlashHit(
  turretConfig: any,
  target: Beyblade,
  nowMs: number,
  hitIndex: number,
  totalHits: number,
  rand: () => number,
): void {
  const dmg = (turretConfig.attackDamage ?? 15) * target.damageTaken;
  if (!target.invulnerable) { target.health -= dmg; target.damageReceived += dmg; }
  if (hitIndex === totalHits - 1 && rand() < (turretConfig.dragonSlashStaggerChance ?? 0.4)) {
    const lockUntil = nowMs + 600;
    if (target.controlLockedUntilMs < lockUntil) {
      target.controlLockedUntilMs = lockUntil;
      target.controlLockSource = "dragon_slash";
    }
  }
}

/** outrage tick: fire repeated hits at random targets during rampage. */
export function processOutrageTick(
  turretConfig: any,
  runtime: TurretRuntimeState,
  beyblades: Beyblade[],
  nowMs: number,
  dt: number,
  rand: () => number,
): void {
  if (!runtime.outrageRampageUntilMs || nowMs >= runtime.outrageRampageUntilMs) return;
  const active = beyblades.filter(b => b.isActive && !b.isRingOut);
  if (!active.length) return;
  const target = active[Math.floor(rand() * active.length)];
  const dmg = (turretConfig.attackDamage ?? 35) * dt * target.damageTaken;
  if (!target.invulnerable) { target.health -= dmg; target.damageReceived += dmg; }
}

// ── Ghost extra ─────────────────────────────────────────────────────────────

/** hex: double damage if target has any status condition. */
export function applyHex(turretConfig: any, target: Beyblade, nowMs: number): void {
  const hasStatus = (
    (target.controlLockedUntilMs > nowMs) ||
    ((target as any)._speedSlowExpiresMs && nowMs < (target as any)._speedSlowExpiresMs) ||
    ((target as any)._emberBurnTicks && (target as any)._emberBurnTicks > 0)
  );
  const mult = hasStatus ? (turretConfig.hexStatusMult ?? 2.0) : 1.0;
  const dmg = (turretConfig.attackDamage ?? 20) * mult * target.damageTaken;
  if (!target.invulnerable) { target.health -= dmg; target.damageReceived += dmg; }
}

/** ghost_strike: phasing pulse — ignores range check, always connects. */
export function applyGhostStrike(turretConfig: any, beyblades: Beyblade[], nowMs: number): void {
  const maxRange = turretConfig.ghostStrikeRangePx ?? 80;
  const dmg = turretConfig.attackDamage ?? 22;
  const tx = (turretConfig.x ?? 0) * 24;
  const ty = (turretConfig.y ?? 0) * 24;
  let nearest: Beyblade | null = null;
  let nearestD = Infinity;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const d = (b.x - tx) ** 2 + (b.y - ty) ** 2;
    if (d < nearestD) { nearestD = d; nearest = b; }
  }
  if (!nearest) return;
  if (!nearest.invulnerable) { nearest.health -= dmg * nearest.damageTaken; nearest.damageReceived += dmg; }
}

// ── Fairy type ──────────────────────────────────────────────────────────────

/** moonblast: energy ball with strong knockback. */
export function applyMoonblast(turretConfig: any, target: Beyblade, bridge: TurretProcessorBridge): void {
  const dmg = (turretConfig.attackDamage ?? 22) * target.damageTaken;
  if (!target.invulnerable) { target.health -= dmg; target.damageReceived += dmg; }
  bridge.applyKnockback(target.id, { x: target.x, y: target.y }, turretConfig.moonblastKnockback ?? 0.07);
}

/** dazzling_gleam: blinding flash AoE — control locks all beys in radius. */
export function applyDazzlingGleam(turretConfig: any, beyblades: Beyblade[], nowMs: number): void {
  const r = turretConfig.dazzlingGleamRadiusPx ?? 120;
  const lockUntil = nowMs + (turretConfig.dazzlingGleamLockSec ?? 0.8) * 1000;
  const dmg = turretConfig.attackDamage ?? 18;
  const tx = (turretConfig.x ?? 0) * 24;
  const ty = (turretConfig.y ?? 0) * 24;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - tx, dy = b.y - ty;
    if (dx * dx + dy * dy > r * r) continue;
    if (!b.invulnerable) { b.health -= dmg * b.damageTaken; b.damageReceived += dmg; }
    if (b.controlLockedUntilMs < lockUntil) {
      b.controlLockedUntilMs = lockUntil;
      b.controlLockSource = "dazzling_gleam";
    }
  }
}

// ── Weather / Environment ───────────────────────────────────────────────────

/** setWeather: sets the active weather state on turret runtime. */
export function setWeather(
  turretConfig: any,
  runtime: TurretRuntimeState,
  weatherType: string,
  nowMs: number,
): void {
  runtime.weatherType = weatherType;
  runtime.weatherExpiresMs = nowMs + (turretConfig.weatherDurationSec ?? 8) * 1000;
}

/** applyWeatherTick: per-tick effects for active weather conditions. */
export function applyWeatherTick(
  runtime: TurretRuntimeState,
  beyblades: Beyblade[],
  nowMs: number,
  dt: number,
  rand: () => number,
  bridge: TurretProcessorBridge,
): void {
  if (!runtime.weatherType || nowMs >= (runtime.weatherExpiresMs ?? 0)) return;
  switch (runtime.weatherType) {
    case "sandstorm": {
      const dotDmg = 3 * dt;
      for (const b of beyblades) {
        if (!b.isActive || b.isRingOut) continue;
        if (!b.invulnerable) { b.health -= dotDmg * b.damageTaken; b.damageReceived += dotDmg; }
      }
      break;
    }
    case "hail_weather": {
      // handled via scheduled strikes (caller must check thunderStormNextStrikeMs pattern)
      break;
    }
    case "grassy_terrain": {
      for (const b of beyblades) {
        if (!b.isActive || b.isRingOut) continue;
        const recovery = 10 * dt;
        b.spin = Math.min(b.maxSpin ?? 2000, b.spin + recovery);
      }
      break;
    }
  }
}

/** getWeatherMult: returns damage multiplier for a given attack type + current weather. */
export function getWeatherMult(
  runtime: TurretRuntimeState,
  attackType: string,
  turretConfig: any,
  nowMs: number,
): number {
  if (!runtime.weatherType || nowMs >= (runtime.weatherExpiresMs ?? 0)) return 1.0;
  const W = runtime.weatherType;
  if (W === "sunny_day" && ["fire_spin", "flamethrower", "ember", "magma_storm", "eruption", "flare_blitz"].includes(attackType))
    return turretConfig.sunnyFireMult ?? 1.5;
  if (W === "sunny_day" && ["surf", "hydro_pump", "bubble_beam", "aqua_ring", "origin_pulse", "rain_dance"].includes(attackType))
    return 0.5;
  if (W === "rain_dance" && ["surf", "hydro_pump", "bubble_beam", "aqua_ring", "origin_pulse"].includes(attackType))
    return turretConfig.rainWaterMult ?? 1.5;
  if (W === "rain_dance" && ["fire_spin", "flamethrower", "ember", "magma_storm", "eruption"].includes(attackType))
    return 0.5;
  if (W === "hail_weather" && ["icicle_spear", "hail", "glacial_lance", "ice_beam", "blizzard"].includes(attackType))
    return 1.5;
  if (W === "electric_terrain" && ["thunderbolt", "thunder_wave", "discharge", "bolt_strike", "spark", "magnetic_field", "thunder_storm"].includes(attackType))
    return 1.3;
  if (W === "grassy_terrain" && ["absorb", "vine_whip", "leech_seed", "petal_dance", "bloom_doom", "silver_wind"].includes(attackType))
    return 1.3;
  return 1.0;
}

// ── Charge moves ────────────────────────────────────────────────────────────

/** applyCharge: boosts next shot — sets runtime flag. */
export function triggerCharge(
  turretConfig: any,
  runtime: TurretRuntimeState,
): void {
  runtime.swordsDanceChargesLeft = 1; // reuse swordsDance counter for "charge" (1 shot)
  // Override: store actual mult under chargePrimed
  (runtime as any).chargePrimed = true;
  (runtime as any).chargeDamageMult = turretConfig.chargeDamageMult ?? 1.8;
  (runtime as any).chargeParalysisChance = turretConfig.chargeParalysisChance ?? 0.3;
}

/** charge_cannon: 2-turn charge-up then devastating shot. */
export function triggerChargeCannon(
  turretConfig: any,
  runtime: TurretRuntimeState,
  nowMs: number,
): void {
  runtime.chargeCannonChargeStartMs = nowMs;
}

export function isChargeCannonReady(runtime: TurretRuntimeState, turretConfig: any, nowMs: number): boolean {
  if (!runtime.chargeCannonChargeStartMs) return false;
  return nowMs >= runtime.chargeCannonChargeStartMs + (turretConfig.chargeCannonChargeSec ?? 1.5) * 1000;
}

export function applyChargeCannonShot(
  turretConfig: any,
  runtime: TurretRuntimeState,
  target: Beyblade,
  nowMs: number,
  bridge: TurretProcessorBridge,
): void {
  runtime.chargeCannonChargeStartMs = undefined;
  const dmg = turretConfig.attackDamage ?? 80;
  if (!target.invulnerable) { target.health -= dmg; target.damageReceived += dmg; }
  const lockUntil = nowMs + (turretConfig.chargeCannonKnockdownSec ?? 1.5) * 1000;
  if (target.controlLockedUntilMs < lockUntil) {
    target.controlLockedUntilMs = lockUntil;
    target.controlLockSource = "charge_cannon";
  }
  bridge.applyKnockback(target.id, { x: target.x, y: target.y }, 0.1);
}

// ── Speed / Power moves ──────────────────────────────────────────────────────

/** extreme_speed: priority bolt — full damage, applied at top of cooldown cycle. */
export function applyExtremeSpeed(turretConfig: any, target: Beyblade): void {
  const dmg = (turretConfig.attackDamage ?? 20) * target.damageTaken;
  if (!target.invulnerable) { target.health -= dmg; target.damageReceived += dmg; }
}

/** flare_blitz: massive fire + burn, turret takes recoil. Returns recoil damage. */
export function applyFlareBlitz(turretConfig: any, target: Beyblade, nowMs: number): number {
  const dmg = (turretConfig.attackDamage ?? 45) * target.damageTaken;
  if (!target.invulnerable) { target.health -= dmg; target.damageReceived += dmg; }
  applyEmberBurn({ attackDamage: 0, emberBurnTickDmg: 12, emberBurnTicks: 4, emberBurnIntervalSec: 0.6 }, target, nowMs);
  return dmg * (turretConfig.flareBlitzRecoilFraction ?? 0.33);
}

/** thunder_ram: electric charge + paralysis, returns recoil. */
export function applyThunderRam(
  turretConfig: any,
  target: Beyblade,
  nowMs: number,
  rand: () => number,
  bridge: TurretProcessorBridge,
): number {
  const dmg = (turretConfig.attackDamage ?? 40) * target.damageTaken;
  if (!target.invulnerable) { target.health -= dmg; target.damageReceived += dmg; }
  if (rand() < (turretConfig.thunderRamParalysisChance ?? 0.2)) {
    const lockUntil = nowMs + 1500;
    if (target.controlLockedUntilMs < lockUntil) {
      target.controlLockedUntilMs = lockUntil;
      target.controlLockSource = "thunder_ram";
    }
  }
  bridge.applyKnockback(target.id, { x: target.x, y: target.y }, 0.08);
  return dmg * (turretConfig.thunderRamRecoilFraction ?? 0.33);
}

/** thunder_drive: electric surge with recoil. */
export function applyThunderDrive(
  turretConfig: any,
  target: Beyblade,
  bridge: TurretProcessorBridge,
): number {
  const dmg = (turretConfig.attackDamage ?? 30) * target.damageTaken;
  if (!target.invulnerable) { target.health -= dmg; target.damageReceived += dmg; }
  bridge.applyKnockback(target.id, { x: target.x, y: target.y }, 0.06);
  return dmg * (turretConfig.thunderDriveRecoilFraction ?? 0.25);
}

/** power_drive: reliable charge with recoil, no secondary effects. */
export function applyPowerDrive(
  turretConfig: any,
  target: Beyblade,
  bridge: TurretProcessorBridge,
): number {
  const dmg = (turretConfig.attackDamage ?? 25) * target.damageTaken;
  if (!target.invulnerable) { target.health -= dmg; target.damageReceived += dmg; }
  bridge.applyKnockback(target.id, { x: target.x, y: target.y }, 0.06);
  return dmg * (turretConfig.powerDriveRecoilFraction ?? 0.25);
}

// ── Launcher / Airborne moves ───────────────────────────────────────────────

/** uppercut: close-range upward launcher. */
export function applyUppercut(
  turretConfig: any,
  runtime: TurretRuntimeState,
  beyblades: Beyblade[],
  nowMs: number,
  bridge: TurretProcessorBridge,
): void {
  const rangePx = turretConfig.uppercutRangePx ?? 80;
  const tx = (turretConfig.x ?? 0) * 24;
  const ty = (turretConfig.y ?? 0) * 24;
  let closest: Beyblade | null = null;
  let closestD = Infinity;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const d = (b.x - tx) ** 2 + (b.y - ty) ** 2;
    if (d < closestD && d <= rangePx * rangePx) { closestD = d; closest = b; }
  }
  if (!closest) return;
  const dmg = (turretConfig.attackDamage ?? 20) * closest.damageTaken;
  if (!closest.invulnerable) { closest.health -= dmg; closest.damageReceived += dmg; }
  runtime.uppercutTargetId = closest.id;
  runtime.uppercutLandMs = nowMs + (turretConfig.uppercutAirborneSec ?? 1.2) * 1000;
  if (bridge.setVelocity) bridge.setVelocity(closest.id, 0, 0);
  closest.invulnerable = true;
}

export function processUppercutLand(
  turretConfig: any,
  runtime: TurretRuntimeState,
  beyblades: Beyblade[],
  nowMs: number,
  bridge: TurretProcessorBridge,
): void {
  if (!runtime.uppercutTargetId || nowMs < (runtime.uppercutLandMs ?? 0)) return;
  const target = beyblades.find(b => b.id === runtime.uppercutTargetId);
  if (target) {
    target.invulnerable = false;
    bridge.applyForce(target.id, 0, 0.01); // nudge downward
  }
  runtime.uppercutTargetId = undefined;
}

/** launch_spike: ground eruption at target — AoE pop. */
export function applyLaunchSpike(
  turretConfig: any,
  beyblades: Beyblade[],
  centerX: number,
  centerY: number,
  nowMs: number,
  bridge: TurretProcessorBridge,
): void {
  const aoeR = turretConfig.launchSpikeAoePx ?? 60;
  const dmg = turretConfig.attackDamage ?? 25;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - centerX, dy = b.y - centerY;
    if (dx * dx + dy * dy > aoeR * aoeR) continue;
    if (!b.invulnerable) { b.health -= dmg * b.damageTaken; b.damageReceived += dmg; }
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    bridge.applyForce(b.id, (dx / dist) * 0.06, (dy / dist) * 0.06);
  }
}

/** sky_uppercut: powerful launcher — creates spin zone at peak position. */
export function applySkyUppercut(
  turretConfig: any,
  runtime: TurretRuntimeState,
  beyblades: Beyblade[],
  target: Beyblade,
  nowMs: number,
  bridge: TurretProcessorBridge,
): void {
  const dmg = (turretConfig.attackDamage ?? 30) * target.damageTaken;
  if (!target.invulnerable) { target.health -= dmg; target.damageReceived += dmg; }
  runtime.antiGravTargetId = target.id;
  runtime.antiGravLandMs = nowMs + (turretConfig.uppercutAirborneSec ?? 1.5) * 1000;
  if (bridge.setVelocity) bridge.setVelocity(target.id, 0, 0);
  target.invulnerable = true;
}

// ── Mortal Kombat inspired ───────────────────────────────────────────────────

/** spear_chain: chain grabs nearest bey and pulls toward turret. */
export function applySpearChain(
  turretConfig: any,
  runtime: TurretRuntimeState,
  target: Beyblade,
  bridge: TurretProcessorBridge,
): void {
  const dmg = (turretConfig.attackDamage ?? 18) * target.damageTaken;
  if (!target.invulnerable) { target.health -= dmg; target.damageReceived += dmg; }
  runtime.spearChainTargetId = target.id;
  // Immediate pull force toward turret
  const tx = (turretConfig.x ?? 0) * 24;
  const ty = (turretConfig.y ?? 0) * 24;
  const dx = tx - target.x, dy = ty - target.y;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  const force = turretConfig.spearChainPullForce ?? 0.12;
  bridge.applyForce(target.id, (dx / dist) * force, (dy / dist) * force);
}

/** cryo_lance: freeze on hit, shatter if already frozen. */
export function applyCryoLance(
  turretConfig: any,
  runtime: TurretRuntimeState,
  target: Beyblade,
  nowMs: number,
  bridge: TurretProcessorBridge,
): void {
  const alreadyFrozen = runtime.cryoLanceTargetId === target.id &&
    nowMs < (runtime.cryoLanceFrozenMs ?? 0);
  if (alreadyFrozen) {
    // Shatter hit — multiplied damage + velocity reset
    const mult = turretConfig.cryoLanceShatterMult ?? 2.5;
    const dmg = (turretConfig.attackDamage ?? 20) * mult * target.damageTaken;
    if (!target.invulnerable) { target.health -= dmg; target.damageReceived += dmg; }
    if (bridge.setVelocity) bridge.setVelocity(target.id, 0, 0);
    runtime.cryoLanceTargetId = undefined;
    runtime.cryoLanceFrozenMs = undefined;
    target.controlLockedUntilMs = 0;
  } else {
    // Freeze
    const freezeMs = 2500;
    if (!target.invulnerable) {
      const dmg = (turretConfig.attackDamage ?? 15) * target.damageTaken;
      target.health -= dmg; target.damageReceived += dmg;
    }
    runtime.cryoLanceTargetId = target.id;
    runtime.cryoLanceFrozenMs = nowMs + freezeMs;
    if (bridge.setVelocity) bridge.setVelocity(target.id, 0, 0);
    const lockUntil = nowMs + freezeMs;
    if (target.controlLockedUntilMs < lockUntil) {
      target.controlLockedUntilMs = lockUntil;
      target.controlLockSource = "cryo_lance";
    }
  }
}

/** ring_blade: line-slice through all beys along a direction. */
export function applyRingBlade(
  turretConfig: any,
  beyblades: Beyblade[],
  aimDirX: number,
  aimDirY: number,
): void {
  const halfW = (turretConfig.ringBladeWidthPx ?? 20) / 2;
  const tx = (turretConfig.x ?? 0) * 24;
  const ty = (turretConfig.y ?? 0) * 24;
  const dmg = turretConfig.attackDamage ?? 28;
  const passes = turretConfig.ringBladePasses ?? 2;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - tx, dy = b.y - ty;
    const perpDist = Math.abs(-dx * aimDirY + dy * aimDirX);
    if (perpDist <= halfW) {
      const totalDmg = dmg * passes * b.damageTaken;
      if (!b.invulnerable) { b.health -= totalDmg; b.damageReceived += totalDmg; }
    }
  }
}

/** portal_strike: instant position-swap + lightning burst at landing. */
export function applyPortalStrike(
  turretConfig: any,
  beyblades: Beyblade[],
  targetX: number,
  targetY: number,
  nowMs: number,
  bridge: TurretProcessorBridge,
): void {
  const burstR = turretConfig.portalStrikeBurstRadiusPx ?? 100;
  const dmg = turretConfig.attackDamage ?? 30;
  const lockUntil = nowMs + 500;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - targetX, dy = b.y - targetY;
    if (dx * dx + dy * dy > burstR * burstR) continue;
    if (!b.invulnerable) { b.health -= dmg * b.damageTaken; b.damageReceived += dmg; }
    if (b.controlLockedUntilMs < lockUntil) {
      b.controlLockedUntilMs = lockUntil;
      b.controlLockSource = "portal_strike";
    }
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    bridge.applyForce(b.id, (dx / dist) * 0.05, (dy / dist) * 0.05);
  }
}

/** dragon_fireball tick: bouncing fireball — damages beys it collides with. */
export function processDragonFireballTick(
  turretConfig: any,
  runtime: TurretRuntimeState,
  beyblades: Beyblade[],
  nowMs: number,
  dt: number,
  arenaRadiusPx: number,
): void {
  if (!runtime.dragonFireballExpiresMs || nowMs >= runtime.dragonFireballExpiresMs) return;
  const spd = (turretConfig.bulletSpeed ?? 200) * dt;
  runtime.dragonFireballX = (runtime.dragonFireballX ?? 0) + (runtime.dragonFireballVx ?? 1) * spd;
  runtime.dragonFireballY = (runtime.dragonFireballY ?? 0) + (runtime.dragonFireballVy ?? 0) * spd;
  // Bounce off arena edge
  const bfx = runtime.dragonFireballX, bfy = runtime.dragonFireballY;
  if (Math.sqrt(bfx * bfx + bfy * bfy) > arenaRadiusPx) {
    const norm = Math.sqrt(bfx * bfx + bfy * bfy);
    const nx = bfx / norm, ny = bfy / norm;
    const dot = (runtime.dragonFireballVx ?? 1) * nx + (runtime.dragonFireballVy ?? 0) * ny;
    runtime.dragonFireballVx = (runtime.dragonFireballVx ?? 1) - 2 * dot * nx;
    runtime.dragonFireballVy = (runtime.dragonFireballVy ?? 0) - 2 * dot * ny;
    (runtime.dragonFireballBounceCount ?? 0) < (turretConfig.dragonFireballBounces ?? 3)
      ? (runtime.dragonFireballBounceCount = (runtime.dragonFireballBounceCount ?? 0) + 1)
      : (runtime.dragonFireballExpiresMs = 0);
  }
  const aoeR = turretConfig.dragonFireballAoePx ?? 40;
  const dmg = turretConfig.attackDamage ?? 20;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - (runtime.dragonFireballX ?? 0);
    const dy = b.y - (runtime.dragonFireballY ?? 0);
    if (dx * dx + dy * dy > aoeR * aoeR) continue;
    if (!b.invulnerable) { b.health -= dmg * b.damageTaken; b.damageReceived += dmg; }
  }
}

/** inferno_slam: pull bey then ground fire explosion. */
export function applyInfernoSlam(
  turretConfig: any,
  beyblades: Beyblade[],
  centerX: number,
  centerY: number,
  nowMs: number,
  bridge: TurretProcessorBridge,
): void {
  const aoeR = turretConfig.infernoSlamAoePx ?? 120;
  const dmg = turretConfig.attackDamage ?? 35;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - centerX, dy = b.y - centerY;
    if (dx * dx + dy * dy > aoeR * aoeR) continue;
    if (!b.invulnerable) { b.health -= dmg * b.damageTaken; b.damageReceived += dmg; }
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    bridge.applyForce(b.id, (dx / dist) * 0.07, (dy / dist) * 0.07);
    // Burn DoT
    applyEmberBurn({ attackDamage: 0, emberBurnTickDmg: 10, emberBurnTicks: 3, emberBurnIntervalSec: 0.7 }, b, nowMs);
  }
}

// ── Defensive self-buff moves ───────────────────────────────────────────────

/** harden: turret becomes invulnerable for duration + marks next shot defense-bypass. */
export function triggerHarden(turretConfig: any, runtime: TurretRuntimeState, nowMs: number): void {
  runtime.hardenUntilMs = nowMs + (turretConfig.hardenDurationSec ?? 1.5) * 1000;
  runtime.nastyPlotChargesLeft = (runtime.nastyPlotChargesLeft ?? 0) + 1; // next shot bypasses defense
}

/** defense_curl: invulnerable briefly + boosts next shot. */
export function triggerDefenseCurl(turretConfig: any, runtime: TurretRuntimeState, nowMs: number): void {
  runtime.defenseCurlUntilMs = nowMs + (turretConfig.defenseCurlDurationSec ?? 1.0) * 1000;
  runtime.defenseCurlNextShotBoosted = true;
}

/** withdraw: invulnerable for longer + halves next cooldown. */
export function triggerWithdraw(turretConfig: any, runtime: TurretRuntimeState, nowMs: number): void {
  runtime.withdrawUntilMs = nowMs + (turretConfig.withdrawDurationSec ?? 2.0) * 1000;
  runtime.agilityChargesLeft = (runtime.agilityChargesLeft ?? 0) + 1;
}

/** barrier: sets turret to reflect next hit. Actual reflection handled by caller. */
export function triggerBarrier(runtime: TurretRuntimeState): void {
  runtime.barrierActive = true;
}

/** cosmic_power: reduces all beys' attack output, boosts turret range. */
export function applyCosmicPower(
  turretConfig: any,
  runtime: TurretRuntimeState,
  beyblades: Beyblade[],
  nowMs: number,
): void {
  runtime.cosmicPowerUntilMs = nowMs + (turretConfig.cosmicPowerDurationSec ?? 5) * 1000;
  const atkReduction = turretConfig.cosmicPowerAtkReduction ?? 0.75;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    if (!(b as any)._cosmicPowerDebuffExpiresMs) {
      (b as any)._cosmicPowerAtkMult = atkReduction;
      (b as any)._cosmicPowerDebuffExpiresMs = runtime.cosmicPowerUntilMs;
      if ((b as any).attackMultiplier !== undefined) (b as any).attackMultiplier *= atkReduction;
    }
  }
}

/** overheat: returns true if the turret should apply cooldown penalty this shot. */
export function checkOverheatPenalty(
  turretConfig: any,
  runtime: TurretRuntimeState,
): boolean {
  if (!runtime.overheatPenaltyRemaining) return false;
  runtime.overheatPenaltyRemaining = Math.max(0, (runtime.overheatPenaltyRemaining ?? 0) - 1);
  return true;
}

export function triggerOverheat(
  turretConfig: any,
  runtime: TurretRuntimeState,
): void {
  runtime.overheatPenaltyRemaining = turretConfig.overheatPenaltyShots ?? 2;
}

// ═══════════════════════════════════════════════════════════════════════════
// STREET FIGHTER HANDLERS
// ═══════════════════════════════════════════════════════════════════════════

export function fireHadoken(turretConfig: any, target: Beyblade, bridge: TurretProcessorBridge): void {
  const dmg = turretConfig.hadokenDamage ?? 25;
  target.health = Math.max(0, target.health - dmg);
  target.damageTaken = (target.damageTaken ?? 0) + dmg;
  const dx = target.x - (turretConfig.x ?? 0) * 24;
  const dy = target.y - (turretConfig.y ?? 0) * 24;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  bridge.applyKnockback(target.id, { x: dx / dist, y: dy / dist }, 200);
}

export function applyShoryuken(turretConfig: any, target: Beyblade, nowMs: number): void {
  target.invulnerable = true;
  const airborneSec = turretConfig.shoryukenAirborneSec ?? 0.6;
  (target as any)._shoryukenLandMs = nowMs + airborneSec * 1000;
  (target as any)._shoryukenBurnPerSec = turretConfig.shoryukenBurnPerSec ?? 10;
  (target as any)._shoryukenBurnUntilMs = nowMs + airborneSec * 1000;
}

export function processShoryukenTick(target: Beyblade, nowMs: number, dtMs: number): void {
  if ((target as any)._shoryukenLandMs && nowMs >= (target as any)._shoryukenLandMs) {
    target.invulnerable = false;
    delete (target as any)._shoryukenLandMs;
  }
  if ((target as any)._shoryukenBurnUntilMs && nowMs < (target as any)._shoryukenBurnUntilMs) {
    const dmg = ((target as any)._shoryukenBurnPerSec ?? 10) * dtMs / 1000;
    target.health = Math.max(0, target.health - dmg);
    target.damageTaken = (target.damageTaken ?? 0) + dmg;
  } else if ((target as any)._shoryukenBurnUntilMs) {
    delete (target as any)._shoryukenBurnUntilMs;
    delete (target as any)._shoryukenBurnPerSec;
  }
}

export function applySonicBoom(turretConfig: any, target: Beyblade, bridge: TurretProcessorBridge): void {
  const dmg = turretConfig.sonicBoomDamage ?? 20;
  target.health = Math.max(0, target.health - dmg);
  target.damageTaken = (target.damageTaken ?? 0) + dmg;
  const tx = (turretConfig.x ?? 0) * 24; const ty = (turretConfig.y ?? 0) * 24;
  const dx = target.x - tx; const dy = target.y - ty;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  bridge.applyKnockback(target.id, { x: dx / dist, y: dy / dist }, 350);
}

export function applyFlashKick(turretConfig: any, beyblades: Beyblade[], bridge: TurretProcessorBridge, tx: number, ty: number): void {
  const radius = turretConfig.flashKickRadius ?? 80;
  const dmg = turretConfig.flashKickDamage ?? 30;
  const r2 = radius * radius;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - tx; const dy = b.y - ty;
    if (dx * dx + dy * dy <= r2) {
      b.health = Math.max(0, b.health - dmg);
      b.damageTaken = (b.damageTaken ?? 0) + dmg;
      bridge.applyKnockback(b.id, { x: dx / (Math.sqrt(dx * dx + dy * dy) || 1), y: -1 }, 500);
    }
  }
}

export function applyRagingDemon(turretConfig: any, target: Beyblade): void {
  const threshold = turretConfig.ragingDemonThreshold ?? 0.25;
  const spinFrac = target.spin / (target.maxSpin || 2000);
  const mult = spinFrac <= threshold ? (turretConfig.ragingDemonMult ?? 3.0) : 1.0;
  const dmg = 30 * mult;
  target.health = Math.max(0, target.health - dmg);
  target.damageTaken = (target.damageTaken ?? 0) + dmg;
}

export function applySpiralDrillHit(turretConfig: any, target: Beyblade, bridge: TurretProcessorBridge): void {
  const dmg = turretConfig.spiralDrillDmgPerHit ?? 12;
  target.health = Math.max(0, target.health - dmg);
  target.damageTaken = (target.damageTaken ?? 0) + dmg;
  bridge.applyForce(target.id, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100);
}

export function triggerHundredKicks(turretConfig: any, runtime: TurretRuntimeState, target: Beyblade, nowMs: number): void {
  runtime.hundredKicksTargetId = target.id;
  runtime.hundredKicksHitsLeft = turretConfig.hundredKicksHits ?? 10;
  runtime.hundredKicksNextHitMs = nowMs;
}

export function processHundredKicksTick(turretConfig: any, runtime: TurretRuntimeState, beyblades: Beyblade[], bridge: TurretProcessorBridge, nowMs: number): void {
  if (!runtime.hundredKicksTargetId || !runtime.hundredKicksHitsLeft) return;
  if (nowMs < (runtime.hundredKicksNextHitMs ?? 0)) return;
  const target = beyblades.find(b => b.id === runtime.hundredKicksTargetId && b.isActive);
  if (!target) { runtime.hundredKicksTargetId = undefined; return; }
  const dmg = 6;
  target.health = Math.max(0, target.health - dmg);
  target.damageTaken = (target.damageTaken ?? 0) + dmg;
  bridge.applyForce(target.id, (Math.random() - 0.5) * 150, (Math.random() - 0.5) * 150);
  runtime.hundredKicksHitsLeft!--;
  runtime.hundredKicksNextHitMs = nowMs + (turretConfig.hundredKicksIntervalMs ?? 40);
  if (runtime.hundredKicksHitsLeft! <= 0) runtime.hundredKicksTargetId = undefined;
}

export function triggerElectricBody(turretConfig: any, runtime: TurretRuntimeState, nowMs: number): void {
  runtime.electricBodyUntilMs = nowMs + (turretConfig.electricBodyDurationSec ?? 4) * 1000;
}

export function processElectricBodyTick(turretConfig: any, runtime: TurretRuntimeState, beyblades: Beyblade[], tx: number, ty: number, nowMs: number, dtMs: number): void {
  if (!runtime.electricBodyUntilMs || nowMs > runtime.electricBodyUntilMs) return;
  const r2 = ((turretConfig.electricBodyRadius ?? 70) ** 2);
  const dps = turretConfig.electricBodyDpsPerSec ?? 8;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - tx; const dy = b.y - ty;
    if (dx * dx + dy * dy <= r2) { const dmg = dps * dtMs / 1000; b.health = Math.max(0, b.health - dmg); b.damageTaken = (b.damageTaken ?? 0) + dmg; }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// BLEACH BANKAI HANDLERS
// ═══════════════════════════════════════════════════════════════════════════

export function applyTensaZangetsu(turretConfig: any, target: Beyblade): void {
  const dmg = turretConfig.tensaZangetsuDamage ?? 80;
  target.health = Math.max(0, target.health - dmg);
  target.damageTaken = (target.damageTaken ?? 0) + dmg;
}

export function applySenbonzakura(turretConfig: any, beyblades: Beyblade[], bridge: TurretProcessorBridge, tx: number, ty: number): void {
  const shards = turretConfig.senbonzakuraShards ?? 30;
  const dmgPerShard = turretConfig.senbonzakuraDmgPerShard ?? 5;
  const r2 = ((turretConfig.senbonzakuraRadius ?? 200) ** 2);
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - tx; const dy = b.y - ty;
    if (dx * dx + dy * dy > r2) continue;
    const total = dmgPerShard * Math.max(1, Math.floor(shards / 8));
    b.health = Math.max(0, b.health - total);
    b.damageTaken = (b.damageTaken ?? 0) + total;
    bridge.applyForce(b.id, (Math.random() - 0.5) * 200, (Math.random() - 0.5) * 200);
  }
}

export function triggerDaiGurenIce(turretConfig: any, runtime: TurretRuntimeState, tx: number, ty: number, nowMs: number): void {
  runtime.daiGurenCenterX = tx; runtime.daiGurenCenterY = ty; runtime.daiGurenRadius = 0;
  runtime.daiGurenExpiresMs = nowMs + (turretConfig.daiGurenFreezeSec ?? 3) * 1000 + 2000;
}

export function processDaiGurenTick(turretConfig: any, runtime: TurretRuntimeState, beyblades: Beyblade[], nowMs: number, dtMs: number): void {
  if (!runtime.daiGurenExpiresMs || nowMs > runtime.daiGurenExpiresMs) return;
  runtime.daiGurenRadius = Math.min(turretConfig.daiGurenMaxRadius ?? 180, (runtime.daiGurenRadius ?? 0) + (turretConfig.daiGurenExpandSpeed ?? 120) * dtMs / 1000);
  const cx = runtime.daiGurenCenterX ?? 0; const cy = runtime.daiGurenCenterY ?? 0; const r2 = runtime.daiGurenRadius ** 2;
  const freezeSec = turretConfig.daiGurenFreezeSec ?? 3;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut || (b as any)._daiGurenFrozen) continue;
    const dx = b.x - cx; const dy = b.y - cy;
    if (dx * dx + dy * dy <= r2) {
      (b as any)._daiGurenFrozen = true;
      b.controlLockedUntilMs = Math.max(b.controlLockedUntilMs ?? 0, nowMs + freezeSec * 1000);
      b.controlLockSource = "daiguren_ice"; b.spin = Math.max(0, b.spin * 0.7);
    }
  }
}

export function applyAbsoluteZero(turretConfig: any, target: Beyblade, nowMs: number): void {
  const freezeSec = turretConfig.absoluteZeroFreezeSec ?? 2;
  target.controlLockedUntilMs = Math.max(target.controlLockedUntilMs ?? 0, nowMs + freezeSec * 1000);
  target.controlLockSource = "absolute_zero";
  (target as any)._absoluteZeroShatterMs = nowMs + freezeSec * 1000;
  (target as any)._absoluteZeroShatterDmg = turretConfig.absoluteZeroShatterDmg ?? 120;
}

export function processAbsoluteZeroShatter(target: Beyblade, nowMs: number): void {
  if (!(target as any)._absoluteZeroShatterMs) return;
  if (nowMs >= (target as any)._absoluteZeroShatterMs) {
    const dmg = (target as any)._absoluteZeroShatterDmg ?? 120;
    target.health = Math.max(0, target.health - dmg); target.damageTaken = (target.damageTaken ?? 0) + dmg;
    delete (target as any)._absoluteZeroShatterMs; delete (target as any)._absoluteZeroShatterDmg;
  }
}

export function triggerMukenPoison(turretConfig: any, runtime: TurretRuntimeState, tx: number, ty: number, nowMs: number): void {
  runtime.mukenCenterX = tx; runtime.mukenCenterY = ty;
  runtime.mukenRadius = turretConfig.mukenPoisonInitRadius ?? 60;
  runtime.mukenExpiresMs = nowMs + (turretConfig.muken_poisonDurationSec ?? 8) * 1000;
}

export function processMukenPoisonTick(turretConfig: any, runtime: TurretRuntimeState, beyblades: Beyblade[], nowMs: number, dtMs: number): void {
  if (!runtime.mukenExpiresMs || nowMs > runtime.mukenExpiresMs) return;
  runtime.mukenRadius = (runtime.mukenRadius ?? 60) + (turretConfig.mukenPoisonExpandSpeed ?? 30) * dtMs / 1000;
  const cx = runtime.mukenCenterX ?? 0; const cy = runtime.mukenCenterY ?? 0; const r2 = (runtime.mukenRadius) ** 2;
  const dps = turretConfig.mukenPoisonDotPerSec ?? 12;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - cx; const dy = b.y - cy;
    if (dx * dx + dy * dy <= r2) { const dmg = dps * dtMs / 1000; b.health = Math.max(0, b.health - dmg); b.damageTaken = (b.damageTaken ?? 0) + dmg; }
  }
}

export function triggerZankaIncinerate(turretConfig: any, runtime: TurretRuntimeState, tx: number, ty: number, nowMs: number): void {
  runtime.zankaFieldActive = true;
  runtime.zankaFieldExpiresMs = nowMs + (turretConfig.zankaFieldDurationSec ?? 6) * 1000;
  runtime.zankaFieldCenterX = tx; runtime.zankaFieldCenterY = ty;
}

export function processZankaFieldTick(turretConfig: any, runtime: TurretRuntimeState, beyblades: Beyblade[], nowMs: number, dtMs: number): void {
  if (!runtime.zankaFieldActive || !runtime.zankaFieldExpiresMs) return;
  if (nowMs > runtime.zankaFieldExpiresMs) { runtime.zankaFieldActive = false; return; }
  const cx = runtime.zankaFieldCenterX ?? 0; const cy = runtime.zankaFieldCenterY ?? 0;
  const r2 = 150 * 150; const dps = turretConfig.zankaFieldDotPerSec ?? 15;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - cx; const dy = b.y - cy;
    if (dx * dx + dy * dy <= r2) { const dmg = dps * dtMs / 1000; b.health = Math.max(0, b.health - dmg); b.damageTaken = (b.damageTaken ?? 0) + dmg; }
  }
}

export function applySuzumebachi(turretConfig: any, runtime: TurretRuntimeState, target: Beyblade): void {
  if (runtime.suzumebachiMarkedTarget === target.id) {
    const spinFrac = target.spin / (target.maxSpin || 2000);
    if (spinFrac <= (turretConfig.suzumebachiKillThreshold ?? 0.15)) {
      target.health = 0; target.spin = 0; target.isActive = false;
    } else {
      const dmg = 40; target.health = Math.max(0, target.health - dmg); target.damageTaken = (target.damageTaken ?? 0) + dmg;
    }
    runtime.suzumebachiMarkedTarget = undefined;
  } else {
    runtime.suzumebachiMarkedTarget = target.id;
    const dmg = turretConfig.suzumebachiFirstHitDmg ?? 10;
    target.health = Math.max(0, target.health - dmg); target.damageTaken = (target.damageTaken ?? 0) + dmg;
  }
}

export function triggerHihioConstruct(turretConfig: any, runtime: TurretRuntimeState, nowMs: number): void {
  runtime.hihioSweepAngle = 0;
  runtime.hihioSweepUntilMs = nowMs + (turretConfig.hihioTrailLingerMs ?? 800);
}

export function processHihioSweepTick(turretConfig: any, runtime: TurretRuntimeState, beyblades: Beyblade[], tx: number, ty: number, nowMs: number, dtMs: number): void {
  if (!runtime.hihioSweepUntilMs || nowMs > runtime.hihioSweepUntilMs) return;
  const arcDeg = turretConfig.hihioSweepArcDeg ?? 90;
  const sweepSpeed = arcDeg / ((turretConfig.hihioTrailLingerMs ?? 800) / 1000);
  runtime.hihioSweepAngle = (runtime.hihioSweepAngle ?? 0) + sweepSpeed * dtMs / 1000;
  const currentAngleRad = (runtime.hihioSweepAngle ?? 0) * Math.PI / 180;
  const dmg = (turretConfig.hihioDamage ?? 40) * dtMs / 1000;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - tx; const dy = b.y - ty;
    if (Math.abs(Math.atan2(dy, dx) - currentAngleRad) < 0.3) {
      b.health = Math.max(0, b.health - dmg); b.damageTaken = (b.damageTaken ?? 0) + dmg;
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// NARUTO HANDLERS
// ═══════════════════════════════════════════════════════════════════════════

export function applyRasengan(turretConfig: any, target: Beyblade, bridge: TurretProcessorBridge, tx: number, ty: number): void {
  const radius = turretConfig.rasenganRadius ?? 30;
  const dx = target.x - tx; const dy = target.y - ty;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  if (dist > radius * 2) return;
  const dmg = turretConfig.rasenganDamage ?? 55;
  target.health = Math.max(0, target.health - dmg); target.damageTaken = (target.damageTaken ?? 0) + dmg;
  bridge.applyKnockback(target.id, { x: dx / dist, y: dy / dist }, turretConfig.rasenganKnockback ?? 700);
  target.spin = Math.max(0, target.spin - 300);
}

export function applyChidori(turretConfig: any, target: Beyblade, nowMs: number): void {
  const dmg = turretConfig.chidoriDamage ?? 70;
  target.health = Math.max(0, target.health - dmg); target.damageTaken = (target.damageTaken ?? 0) + dmg;
  target.controlLockedUntilMs = Math.max(target.controlLockedUntilMs ?? 0, nowMs + 800);
  target.controlLockSource = "chidori";
}

export function applyShadowClone(turretConfig: any, target: Beyblade, bridge: TurretProcessorBridge): void {
  const dirs = turretConfig.shadowCloneDirections ?? 4;
  const dmgPerHit = turretConfig.shadowCloneDmgPerHit ?? 15;
  target.health = Math.max(0, target.health - dmgPerHit * dirs); target.damageTaken = (target.damageTaken ?? 0) + dmgPerHit * dirs;
  for (let i = 0; i < dirs; i++) { const a = (i / dirs) * Math.PI * 2; bridge.applyForce(target.id, Math.cos(a) * 120, Math.sin(a) * 120); }
}

export function triggerSandBurial(turretConfig: any, runtime: TurretRuntimeState, target: Beyblade, nowMs: number): void {
  runtime.sandBurialTargetId = target.id;
  runtime.sandBurialHoldUntilMs = nowMs + (turretConfig.sandBurialHoldSec ?? 2) * 1000;
}

export function processSandBurialTick(turretConfig: any, runtime: TurretRuntimeState, beyblades: Beyblade[], bridge: TurretProcessorBridge, nowMs: number): void {
  if (!runtime.sandBurialTargetId) return;
  const target = beyblades.find(b => b.id === runtime.sandBurialTargetId);
  if (!target) { runtime.sandBurialTargetId = undefined; return; }
  if (nowMs >= (runtime.sandBurialHoldUntilMs ?? 0)) {
    const dmg = turretConfig.sandBurialDamage ?? 50;
    target.health = Math.max(0, target.health - dmg); target.damageTaken = (target.damageTaken ?? 0) + dmg;
    runtime.sandBurialTargetId = undefined;
    bridge.applyKnockback(target.id, { x: 0, y: -1 }, 400);
  } else if (bridge.setVelocity) bridge.setVelocity(target.id, 0, 0);
}

export function applyFireballJutsu(turretConfig: any, beyblades: Beyblade[], tx: number, ty: number, aimAngleRad: number): void {
  const halfRad = (turretConfig.fireballJutsuConeHalfDeg ?? 25) * Math.PI / 180;
  const range = turretConfig.fireballJutsuRange ?? 250; const dmg = turretConfig.fireballJutsuDamage ?? 35;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - tx; const dy = b.y - ty;
    if (Math.sqrt(dx * dx + dy * dy) > range) continue;
    let diff = Math.abs(Math.atan2(dy, dx) - aimAngleRad);
    if (diff > Math.PI) diff = 2 * Math.PI - diff;
    if (diff <= halfRad) { b.health = Math.max(0, b.health - dmg); b.damageTaken = (b.damageTaken ?? 0) + dmg; (b as any)._emberBurnTicks = ((b as any)._emberBurnTicks ?? 0) + 3; }
  }
}

export function applyEightTrigrams(turretConfig: any, target: Beyblade, bridge: TurretProcessorBridge): void {
  const hits = turretConfig.eightTrigramsHits ?? 8; const dmgPerHit = turretConfig.eightTriggramsDmgPerHit ?? 8;
  target.health = Math.max(0, target.health - dmgPerHit * hits); target.damageTaken = (target.damageTaken ?? 0) + dmgPerHit * hits;
  target.spin = Math.max(0, target.spin - hits * 20);
  for (let i = 0; i < hits; i++) bridge.applyForce(target.id, (Math.random() - 0.5) * 80, (Math.random() - 0.5) * 80);
}

export function triggerAmaterasu(turretConfig: any, runtime: TurretRuntimeState, target: Beyblade, nowMs: number): void {
  runtime.amaterasuCenterX = target.x; runtime.amaterasuCenterY = target.y;
  runtime.amaterasuExpiresMs = nowMs + (turretConfig.amaterasuDurationSec ?? 10) * 1000;
}

export function processAmaterasuTick(turretConfig: any, runtime: TurretRuntimeState, beyblades: Beyblade[], nowMs: number, dtMs: number): void {
  if (!runtime.amaterasuExpiresMs || nowMs > runtime.amaterasuExpiresMs) return;
  const cx = runtime.amaterasuCenterX ?? 0; const cy = runtime.amaterasuCenterY ?? 0;
  const r2 = ((turretConfig.amaterasuRadius ?? 40) ** 2); const dps = turretConfig.amaterasuDotPerSec ?? 20;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - cx; const dy = b.y - cy;
    if (dx * dx + dy * dy <= r2) { const dmg = dps * dtMs / 1000; b.health = Math.max(0, b.health - dmg); b.damageTaken = (b.damageTaken ?? 0) + dmg; }
  }
}

export function triggerSusanoo(turretConfig: any, runtime: TurretRuntimeState, nowMs: number): void {
  runtime.susanooUntilMs = nowMs + (turretConfig.susanooShieldSec ?? 5) * 1000;
  runtime.susanooNextPulseMs = nowMs + (turretConfig.susanooPulseIntervalMs ?? 1500);
}

export function processSusanooTick(turretConfig: any, runtime: TurretRuntimeState, beyblades: Beyblade[], bridge: TurretProcessorBridge, tx: number, ty: number, nowMs: number): void {
  if (!runtime.susanooUntilMs || nowMs > runtime.susanooUntilMs) return;
  if (nowMs < (runtime.susanooNextPulseMs ?? 0)) return;
  runtime.susanooNextPulseMs = nowMs + (turretConfig.susanooPulseIntervalMs ?? 1500);
  const dmg = turretConfig.susanooCounterDmg ?? 30; const r2 = 120 * 120;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - tx; const dy = b.y - ty;
    if (dx * dx + dy * dy <= r2) { b.health = Math.max(0, b.health - dmg); b.damageTaken = (b.damageTaken ?? 0) + dmg; }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// NINJA TECHNIQUE HANDLERS
// ═══════════════════════════════════════════════════════════════════════════

export function triggerSubstitution(turretConfig: any, runtime: TurretRuntimeState, nowMs: number): void {
  runtime.substitutionUntilMs = nowMs + (turretConfig.substitutionInvulSec ?? 1.5) * 1000;
}

export function applyShadowShuriken(turretConfig: any, target: Beyblade, bridge: TurretProcessorBridge): void {
  const dmg = turretConfig.shadowShurikenDmg ?? 20;
  target.health = Math.max(0, target.health - dmg * 2); target.damageTaken = (target.damageTaken ?? 0) + dmg * 2;
  const rad = (turretConfig.shadowShurikenAngleDeg ?? 15) * Math.PI / 180;
  bridge.applyForce(target.id, Math.sin(rad) * 200, -Math.cos(rad) * 200);
}

export function applyKunaiBarrage(turretConfig: any, beyblades: Beyblade[], tx: number, ty: number, aimAngleRad: number): void {
  const count = turretConfig.kunaiBarrageCount ?? 5; const spreadDeg = turretConfig.kunaiBarrageSpreadDeg ?? 60;
  const dmgPerHit = turretConfig.kunaiBarrageDmgPerHit ?? 12;
  const spreadRad = (spreadDeg * Math.PI / 180) / (count - 1 || 1);
  const startAngle = aimAngleRad - (spreadDeg * Math.PI / 180) / 2;
  for (let i = 0; i < count; i++) {
    const a = startAngle + i * spreadRad;
    for (const b of beyblades) {
      if (!b.isActive || b.isRingOut) continue;
      const dx = b.x - tx; const dy = b.y - ty;
      if (Math.sqrt(dx * dx + dy * dy) > 250) continue;
      let diff = Math.abs(Math.atan2(dy, dx) - a);
      if (diff > Math.PI) diff = 2 * Math.PI - diff;
      if (diff < 0.15) { b.health = Math.max(0, b.health - dmgPerHit); b.damageTaken = (b.damageTaken ?? 0) + dmgPerHit; }
    }
  }
}

export function applySmokeBomb(turretConfig: any, beyblades: Beyblade[], tx: number, ty: number, nowMs: number): void {
  const expiresMs = nowMs + (turretConfig.smokeBombDurationSec ?? 4) * 1000; const r2 = 120 * 120;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - tx; const dy = b.y - ty;
    if (dx * dx + dy * dy <= r2) {
      (b as any)._smokeBombSpinMult = turretConfig.smokeBombSpinGainMult ?? 0.5;
      (b as any)._smokeBombExpiresMs = expiresMs;
    }
  }
}

export function applySmokeBombExpiry(beyblades: Beyblade[], nowMs: number): void {
  for (const b of beyblades) {
    if ((b as any)._smokeBombExpiresMs && nowMs >= (b as any)._smokeBombExpiresMs) {
      delete (b as any)._smokeBombSpinMult; delete (b as any)._smokeBombExpiresMs;
    }
  }
}

export function triggerWireTrap(turretConfig: any, runtime: TurretRuntimeState, target: Beyblade, nowMs: number): void {
  runtime.wireTrapTargetId = target.id;
  runtime.wireTrapUntilMs = nowMs + (turretConfig.wireTrapHoldSec ?? 2) * 1000;
}

export function processWireTrapTick(turretConfig: any, runtime: TurretRuntimeState, beyblades: Beyblade[], bridge: TurretProcessorBridge, tx: number, ty: number, nowMs: number): void {
  if (!runtime.wireTrapTargetId) return;
  if (nowMs >= (runtime.wireTrapUntilMs ?? 0)) { runtime.wireTrapTargetId = undefined; return; }
  const target = beyblades.find(b => b.id === runtime.wireTrapTargetId && b.isActive);
  if (!target) { runtime.wireTrapTargetId = undefined; return; }
  const dx = tx - target.x; const dy = ty - target.y; const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  const force = turretConfig.wireTrapPullForce ?? 500;
  bridge.applyForce(target.id, (dx / dist) * force * 0.016, (dy / dist) * force * 0.016);
}

export function placeExplodingTag(turretConfig: any, runtime: TurretRuntimeState, tx: number, ty: number): void {
  runtime.explodingTagX = tx; runtime.explodingTagY = ty; runtime.explodingTagActive = true;
}

export function processExplodingTagTick(turretConfig: any, runtime: TurretRuntimeState, beyblades: Beyblade[], bridge: TurretProcessorBridge): void {
  if (!runtime.explodingTagActive) return;
  const cx = runtime.explodingTagX ?? 0; const cy = runtime.explodingTagY ?? 0;
  const triggerR2 = ((turretConfig.explodingTagRadius ?? 50) ** 2);
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - cx; const dy = b.y - cy;
    if (dx * dx + dy * dy <= triggerR2) {
      const dmg = turretConfig.explodingTagDamage ?? 70; const blastR2 = ((turretConfig.explodingTagRadius ?? 50) * 2) ** 2;
      for (const b2 of beyblades) {
        if (!b2.isActive || b2.isRingOut) continue;
        const dx2 = b2.x - cx; const dy2 = b2.y - cy; const d2 = Math.sqrt(dx2 * dx2 + dy2 * dy2) || 1;
        if (dx2 * dx2 + dy2 * dy2 <= blastR2) { b2.health = Math.max(0, b2.health - dmg); b2.damageTaken = (b2.damageTaken ?? 0) + dmg; bridge.applyKnockback(b2.id, { x: dx2 / d2, y: dy2 / d2 }, 600); }
      }
      runtime.explodingTagActive = false; return;
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// TRANSFORMATION HANDLERS
// ═══════════════════════════════════════════════════════════════════════════

export function triggerUltraForm(turretConfig: any, runtime: TurretRuntimeState, nowMs: number): void {
  runtime.ultraFormUntilMs = nowMs + (turretConfig.ultraFormDurationSec ?? 8) * 1000;
}

export function triggerDemonForm(turretConfig: any, runtime: TurretRuntimeState, nowMs: number): void {
  runtime.demonFormUntilMs = nowMs + (turretConfig.demonFormDurationSec ?? 6) * 1000;
}

export function triggerSageMode(turretConfig: any, runtime: TurretRuntimeState, nowMs: number): void {
  runtime.sageModeUntilMs = nowMs + (turretConfig.sageModeDurationSec ?? 10) * 1000;
  runtime.sageModeNextRegenMs = nowMs + 1000;
}

export function triggerBankaiRelease(turretConfig: any, runtime: TurretRuntimeState, nowMs: number): void {
  runtime.bankaiUntilMs = nowMs + (turretConfig.bankaiDurationSec ?? 8) * 1000;
  runtime.bankaiNextPulseMs = nowMs;
}

export function processBankaiPulseTick(turretConfig: any, runtime: TurretRuntimeState, beyblades: Beyblade[], tx: number, ty: number, nowMs: number): void {
  if (!runtime.bankaiUntilMs || nowMs > runtime.bankaiUntilMs) return;
  if (nowMs < (runtime.bankaiNextPulseMs ?? 0)) return;
  runtime.bankaiNextPulseMs = nowMs + 2000;
  const r2 = ((turretConfig.bankaiPulseRadius ?? 150) ** 2); const dmg = 15;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - tx; const dy = b.y - ty;
    if (dx * dx + dy * dy <= r2) { b.health = Math.max(0, b.health - dmg); b.damageTaken = (b.damageTaken ?? 0) + dmg; }
  }
}

export function triggerSusanooFull(turretConfig: any, runtime: TurretRuntimeState, nowMs: number): void {
  runtime.susanooFullUntilMs = nowMs + (turretConfig.susanooFullDurationSec ?? 6) * 1000;
}

export function triggerTitanShift(turretConfig: any, runtime: TurretRuntimeState, nowMs: number): void {
  runtime.titanShiftUntilMs = nowMs + (turretConfig.titanShiftDurationSec ?? 7) * 1000;
  runtime.titanShiftNextPulseMs = nowMs;
}

export function processTitanShiftTick(turretConfig: any, runtime: TurretRuntimeState, beyblades: Beyblade[], bridge: TurretProcessorBridge, tx: number, ty: number, nowMs: number): void {
  if (!runtime.titanShiftUntilMs || nowMs > runtime.titanShiftUntilMs) return;
  if (nowMs < (runtime.titanShiftNextPulseMs ?? 0)) return;
  runtime.titanShiftNextPulseMs = nowMs + (turretConfig.titanShiftPulseIntervalMs ?? 1000);
  const r2 = ((turretConfig.titanShiftPulseRadius ?? 160) ** 2); const dmg = turretConfig.titanShiftPulseDmg ?? 25;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - tx; const dy = b.y - ty; const d = Math.sqrt(dx * dx + dy * dy) || 1;
    if (dx * dx + dy * dy <= r2) { b.health = Math.max(0, b.health - dmg); b.damageTaken = (b.damageTaken ?? 0) + dmg; bridge.applyKnockback(b.id, { x: dx / d, y: dy / d }, 300); }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SUMMON HANDLERS
// ═══════════════════════════════════════════════════════════════════════════

export function applySummonToad(turretConfig: any, beyblades: Beyblade[], bridge: TurretProcessorBridge, targetX: number, targetY: number): void {
  const r2 = ((turretConfig.summonToadRadius ?? 200) ** 2); const dmg = turretConfig.summonToadDamage ?? 80;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - targetX; const dy = b.y - targetY; const d = Math.sqrt(dx * dx + dy * dy) || 1;
    if (dx * dx + dy * dy <= r2) { b.health = Math.max(0, b.health - dmg); b.damageTaken = (b.damageTaken ?? 0) + dmg; bridge.applyKnockback(b.id, { x: dx / d, y: dy / d }, 800); }
  }
}

export function triggerSummonSnake(turretConfig: any, runtime: TurretRuntimeState, target: Beyblade, nowMs: number): void {
  runtime.summonSnakeTargetId = target.id;
  runtime.summonSnakeUntilMs = nowMs + (turretConfig.summonSnakeHoldSec ?? 2) * 1000;
}

export function processSummonSnakeTick(turretConfig: any, runtime: TurretRuntimeState, beyblades: Beyblade[], bridge: TurretProcessorBridge, nowMs: number, dtMs: number): void {
  if (!runtime.summonSnakeTargetId) return;
  const target = beyblades.find(b => b.id === runtime.summonSnakeTargetId && b.isActive);
  if (!target || nowMs >= (runtime.summonSnakeUntilMs ?? 0)) { runtime.summonSnakeTargetId = undefined; return; }
  if (bridge.setVelocity) bridge.setVelocity(target.id, 0, 0);
  const dmg = (turretConfig.summonSnakeDotPerSec ?? 15) * dtMs / 1000;
  target.health = Math.max(0, target.health - dmg); target.damageTaken = (target.damageTaken ?? 0) + dmg;
}

export function triggerSummonSlug(turretConfig: any, runtime: TurretRuntimeState, nowMs: number): void {
  runtime.summonSlugUntilMs = nowMs + (turretConfig.summonSlugDurationSec ?? 5) * 1000;
  runtime.summonSlugNextHealMs = nowMs;
}

export function applySummonKirin(turretConfig: any, target: Beyblade): void {
  const dmg = turretConfig.summonKirinDamage ?? 150;
  target.health = Math.max(0, target.health - dmg); target.damageTaken = (target.damageTaken ?? 0) + dmg;
  target.spin = Math.max(0, target.spin * 0.5);
}

export function applySummonEagle(turretConfig: any, beyblades: Beyblade[], bridge: TurretProcessorBridge, targetX: number, targetY: number): void {
  const r2 = ((turretConfig.summonEagleRadius ?? 100) ** 2); const dmg = turretConfig.summonEagleDamage ?? 60;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - targetX; const dy = b.y - targetY; const d = Math.sqrt(dx * dx + dy * dy) || 1;
    if (dx * dx + dy * dy <= r2) { b.health = Math.max(0, b.health - dmg); b.damageTaken = (b.damageTaken ?? 0) + dmg; bridge.applyKnockback(b.id, { x: dx / d, y: dy / d }, 500); }
  }
}

export function applySummonClones(turretConfig: any, target: Beyblade, bridge: TurretProcessorBridge): void {
  const count = turretConfig.summonClonesCount ?? 8; const dmgPerHit = turretConfig.summonClonesDmgPerHit ?? 12;
  target.health = Math.max(0, target.health - dmgPerHit * count); target.damageTaken = (target.damageTaken ?? 0) + dmgPerHit * count;
  for (let i = 0; i < count; i++) { const a = (i / count) * Math.PI * 2; bridge.applyForce(target.id, Math.cos(a) * 100, Math.sin(a) * 100); }
}

// ═══════════════════════════════════════════════════════════════════════════
// TEKKEN HANDLERS
// ═══════════════════════════════════════════════════════════════════════════

export function applyDevilBeam(turretConfig: any, target: Beyblade): void {
  const dmg = turretConfig.devilBeamDamage ?? 85;
  target.health = Math.max(0, target.health - dmg); target.damageTaken = (target.damageTaken ?? 0) + dmg;
}

export function applyWindGodFist(turretConfig: any, target: Beyblade, bridge: TurretProcessorBridge, nowMs: number): void {
  const dmg = turretConfig.windGodFistDamage ?? 55;
  target.health = Math.max(0, target.health - dmg); target.damageTaken = (target.damageTaken ?? 0) + dmg;
  target.invulnerable = true;
  (target as any)._windGodLandMs = nowMs + 600;
  bridge.applyKnockback(target.id, { x: 0, y: -1 }, turretConfig.windGodFistLaunchForce ?? 600);
}

export function processWindGodLand(target: Beyblade, nowMs: number): void {
  if ((target as any)._windGodLandMs && nowMs >= (target as any)._windGodLandMs) {
    target.invulnerable = false; delete (target as any)._windGodLandMs;
  }
}

export function applyHellsweep(turretConfig: any, target: Beyblade, bridge: TurretProcessorBridge, nowMs: number): void {
  const dmg = turretConfig.hellsweepDamage ?? 30;
  target.health = Math.max(0, target.health - dmg); target.damageTaken = (target.damageTaken ?? 0) + dmg;
  target.controlLockedUntilMs = Math.max(target.controlLockedUntilMs ?? 0, nowMs + (turretConfig.hellsweepKnockdownSec ?? 1.5) * 1000);
  target.controlLockSource = "hellsweep";
  bridge.applyKnockback(target.id, { x: 1, y: 0 }, 300);
}

export function applyLaserScraperArc(turretConfig: any, beyblades: Beyblade[], tx: number, ty: number, currentAngleRad: number, dtMs: number): void {
  const arcDeg = turretConfig.laserScraperArcDeg ?? 120;
  const dmg = (turretConfig.laserScraperDmgPerDeg ?? 0.3) * arcDeg * dtMs / 1000;
  const halfRad = (arcDeg * Math.PI / 180) / 2;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - tx; const dy = b.y - ty;
    if (Math.sqrt(dx * dx + dy * dy) > 300) continue;
    let diff = Math.abs(Math.atan2(dy, dx) - currentAngleRad);
    if (diff > Math.PI) diff = 2 * Math.PI - diff;
    if (diff <= halfRad) { b.health = Math.max(0, b.health - dmg); b.damageTaken = (b.damageTaken ?? 0) + dmg; }
  }
}

export function triggerRageDrive(runtime: TurretRuntimeState): void {
  runtime.rageDrivePrimed = true;
}

export function applyRageDriveShot(turretConfig: any, runtime: TurretRuntimeState, target: Beyblade, baseDmg: number): void {
  if (!runtime.rageDrivePrimed) return;
  const dmg = baseDmg * (turretConfig.rageDriveMult ?? 2.5);
  target.health = Math.max(0, target.health - dmg); target.damageTaken = (target.damageTaken ?? 0) + dmg;
  runtime.rageDrivePrimed = false;
}

export function applyHeatSmash(turretConfig: any, target: Beyblade, bridge: TurretProcessorBridge): void {
  const dmg = turretConfig.heatSmashDamage ?? 65;
  target.health = Math.max(0, target.health - dmg); target.damageTaken = (target.damageTaken ?? 0) + dmg;
  (target as any)._emberBurnTicks = ((target as any)._emberBurnTicks ?? 0) + 6;
  bridge.applyKnockback(target.id, { x: 0, y: 0 }, 400);
}

export function triggerKiChargeTek(turretConfig: any, runtime: TurretRuntimeState, nowMs: number): void {
  runtime.kiChargeTekChargesStored = (runtime.kiChargeTekChargesStored ?? 0) + (turretConfig.kiChargeTekCharges ?? 1);
  runtime.kiChargeTekBoostUntilMs = nowMs + 5000;
}

export function applyKiChargeTekShot(turretConfig: any, runtime: TurretRuntimeState, target: Beyblade, baseDmg: number): void {
  if (!runtime.kiChargeTekChargesStored) return;
  const dmg = baseDmg * (turretConfig.kiChargeTekBoostMult ?? 1.8);
  target.health = Math.max(0, target.health - dmg); target.damageTaken = (target.damageTaken ?? 0) + dmg;
  runtime.kiChargeTekChargesStored = Math.max(0, (runtime.kiChargeTekChargesStored ?? 1) - 1);
}

export function applyTwinPistols(turretConfig: any, target: Beyblade, bridge: TurretProcessorBridge): void {
  const dmg = (turretConfig.twinPistolsDmgPerShot ?? 18) * 2;
  target.health = Math.max(0, target.health - dmg); target.damageTaken = (target.damageTaken ?? 0) + dmg;
  bridge.applyKnockback(target.id, { x: 0, y: 0 }, 150);
}

// ═══════════════════════════════════════════════════════════════════════════
// TIME-BASED HANDLERS
// ═══════════════════════════════════════════════════════════════════════════

export function applyTimeStop(turretConfig: any, runtime: TurretRuntimeState, beyblades: Beyblade[], nowMs: number): void {
  const freezeSec = turretConfig.timeStopDurationSec ?? 1.5;
  runtime.timeStopUntilMs = nowMs + freezeSec * 1000;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    b.controlLockedUntilMs = Math.max(b.controlLockedUntilMs ?? 0, nowMs + freezeSec * 1000);
    b.controlLockSource = "time_stop";
  }
}

export function applyTimeAcceleration(turretConfig: any, runtime: TurretRuntimeState, target: Beyblade, nowMs: number, dtMs: number): void {
  (target as any)._timeAccelDecayMult = turretConfig.timeAccelDecayMult ?? 3;
  (target as any)._timeAccelExpiresMs = nowMs + (turretConfig.timeAccelDurationSec ?? 5) * 1000;
}

export function processTimeAccelExpiry(beyblades: Beyblade[], nowMs: number): void {
  for (const b of beyblades) {
    if ((b as any)._timeAccelExpiresMs && nowMs >= (b as any)._timeAccelExpiresMs) {
      delete (b as any)._timeAccelDecayMult; delete (b as any)._timeAccelExpiresMs;
    }
  }
}

export function triggerTimeLoop(turretConfig: any, runtime: TurretRuntimeState, target: Beyblade, incomingDmg: number, nowMs: number): void {
  runtime.timeLoopTargetId = target.id;
  runtime.timeLoopDamage = incomingDmg;
  runtime.timeLoopFireMs = nowMs + (turretConfig.timeLoopDelaySec ?? 2) * 1000;
}

export function processTimeLoopTick(runtime: TurretRuntimeState, beyblades: Beyblade[], nowMs: number): void {
  if (!runtime.timeLoopTargetId || !runtime.timeLoopFireMs || nowMs < runtime.timeLoopFireMs) return;
  const target = beyblades.find(b => b.id === runtime.timeLoopTargetId && b.isActive);
  if (target) {
    const dmg = runtime.timeLoopDamage ?? 20;
    target.health = Math.max(0, target.health - dmg); target.damageTaken = (target.damageTaken ?? 0) + dmg;
  }
  runtime.timeLoopTargetId = undefined;
}

export function applyAgeDrain(turretConfig: any, target: Beyblade, matchElapsedMs: number, dtMs: number): void {
  const frac = turretConfig.ageDrainFractionPerSec ?? 0.02;
  const ageMult = Math.min(3, 1 + matchElapsedMs / 60000);
  const drain = target.spin * frac * ageMult * dtMs / 1000;
  target.spin = Math.max(0, target.spin - drain);
}

// ═══════════════════════════════════════════════════════════════════════════
// EXTENDED BANKAI / BLEACH HANDLERS
// ═══════════════════════════════════════════════════════════════════════════

export function applyGigantification(turretConfig: any, beyblades: Beyblade[], bridge: TurretProcessorBridge, tx: number, ty: number): void {
  const r2 = ((turretConfig.gigantificationRadius ?? 220) ** 2); const dmg = turretConfig.gigantificationDamage ?? 90;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - tx; const dy = b.y - ty; const d = Math.sqrt(dx * dx + dy * dy) || 1;
    if (dx * dx + dy * dy <= r2) { b.health = Math.max(0, b.health - dmg); b.damageTaken = (b.damageTaken ?? 0) + dmg; bridge.applyKnockback(b.id, { x: dx / d, y: dy / d }, 700); }
  }
}

export function triggerRyujinJakkaFull(turretConfig: any, runtime: TurretRuntimeState, nowMs: number): void {
  runtime.ryujinJakkaFullUntilMs = nowMs + (turretConfig.ryujinJakkaFullDurationSec ?? 8) * 1000;
}

export function processRyujinJakkaFullTick(turretConfig: any, runtime: TurretRuntimeState, beyblades: Beyblade[], dtMs: number, nowMs: number): void {
  if (!runtime.ryujinJakkaFullUntilMs || nowMs > runtime.ryujinJakkaFullUntilMs) return;
  const dps = turretConfig.ryujinJakkaFullDps ?? 20;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dmg = dps * dtMs / 1000;
    b.health = Math.max(0, b.health - dmg); b.damageTaken = (b.damageTaken ?? 0) + dmg;
  }
}

export function applySenbonzakuraKageyoshi(turretConfig: any, beyblades: Beyblade[], bridge: TurretProcessorBridge, tx: number, ty: number): void {
  const waves = turretConfig.senbonzakuraKageyoshiWaves ?? 3; const dmgPerWave = turretConfig.senbonzakuraKageyoshiDmgPerWave ?? 30;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    b.health = Math.max(0, b.health - dmgPerWave * waves); b.damageTaken = (b.damageTaken ?? 0) + dmgPerWave * waves;
    for (let i = 0; i < waves; i++) bridge.applyForce(b.id, (Math.random() - 0.5) * 200, (Math.random() - 0.5) * 200);
  }
}

export function applyDaiGurenFull(turretConfig: any, beyblades: Beyblade[], bridge: TurretProcessorBridge, tx: number, ty: number, nowMs: number): void {
  const r2 = ((turretConfig.daiGurenFullRadius ?? 200) ** 2); const dmg = turretConfig.daiGurenFullDamage ?? 100;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - tx; const dy = b.y - ty; const d = Math.sqrt(dx * dx + dy * dy) || 1;
    if (dx * dx + dy * dy <= r2) {
      b.health = Math.max(0, b.health - dmg); b.damageTaken = (b.damageTaken ?? 0) + dmg;
      b.controlLockedUntilMs = Math.max(b.controlLockedUntilMs ?? 0, nowMs + 2000);
      b.controlLockSource = "daiguren_full";
      bridge.applyKnockback(b.id, { x: dx / d, y: dy / d }, 500);
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// ARRANCAR / ESPADA HANDLERS
// ═══════════════════════════════════════════════════════════════════════════

export function applyCero(turretConfig: any, target: Beyblade): void {
  const dmg = turretConfig.ceroDamage ?? 60;
  target.health = Math.max(0, target.health - dmg); target.damageTaken = (target.damageTaken ?? 0) + dmg;
}

export function applyGranReyCero(turretConfig: any, beyblades: Beyblade[], bridge: TurretProcessorBridge, tx: number, ty: number): void {
  const r2 = ((turretConfig.granReyCeroRadius ?? 120) ** 2); const dmg = turretConfig.granReyCeroDamage ?? 80;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - tx; const dy = b.y - ty; const d = Math.sqrt(dx * dx + dy * dy) || 1;
    if (dx * dx + dy * dy <= r2) { b.health = Math.max(0, b.health - dmg); b.damageTaken = (b.damageTaken ?? 0) + dmg; bridge.applyKnockback(b.id, { x: dx / d, y: dy / d }, 600); }
  }
}

export function applyCeroOscuras(turretConfig: any, target: Beyblade): void {
  const dmg = turretConfig.ceroOscurasDamage ?? 100;
  target.health = Math.max(0, target.health - dmg); target.damageTaken = (target.damageTaken ?? 0) + dmg;
}

export function applyBala(turretConfig: any, target: Beyblade, bridge: TurretProcessorBridge): void {
  const hits = turretConfig.balaHits ?? 5; const dmgPerHit = turretConfig.balaDmgPerHit ?? 12;
  target.health = Math.max(0, target.health - dmgPerHit * hits); target.damageTaken = (target.damageTaken ?? 0) + dmgPerHit * hits;
  for (let i = 0; i < hits; i++) bridge.applyForce(target.id, (Math.random() - 0.5) * 80, (Math.random() - 0.5) * 80);
}

export function triggerHierro(turretConfig: any, runtime: TurretRuntimeState, target: Beyblade, nowMs: number): void {
  (target as any)._hierroReduction = turretConfig.hierroDamageReduction ?? 0.4;
  (target as any)._hierroExpiresMs = nowMs + (turretConfig.hierroDurationSec ?? 4) * 1000;
}

export function applyDescorrer(turretConfig: any, beyblades: Beyblade[], bridge: TurretProcessorBridge, cx: number, cy: number): void {
  const r2 = ((turretConfig.descorrerRadius ?? 180) ** 2); const force = turretConfig.descorrerPullForce ?? 600;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - cx; const dy = b.y - cy;
    if (dx * dx + dy * dy <= r2) {
      const d = Math.sqrt(dx * dx + dy * dy) || 1;
      bridge.applyForce(b.id, -(dx / d) * force * 0.016, -(dy / d) * force * 0.016);
    }
  }
}

export function applyLanzaDelRelampago(turretConfig: any, beyblades: Beyblade[], bridge: TurretProcessorBridge, impactX: number, impactY: number): void {
  const r2 = ((turretConfig.lanzaExplosionRadius ?? 150) ** 2); const dmg = turretConfig.lanzaDamage ?? 120;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - impactX; const dy = b.y - impactY; const d = Math.sqrt(dx * dx + dy * dy) || 1;
    if (dx * dx + dy * dy <= r2) { b.health = Math.max(0, b.health - dmg); b.damageTaken = (b.damageTaken ?? 0) + dmg; bridge.applyKnockback(b.id, { x: dx / d, y: dy / d }, 900); }
  }
}

export function applySantaTeresa(turretConfig: any, beyblades: Beyblade[], bridge: TurretProcessorBridge, originX: number, originY: number, dirX: number, dirY: number): void {
  const width = turretConfig.santaTeresaWidth ?? 80; const range = 400;
  const knockback = turretConfig.santaTeresaKnockback ?? 900;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - originX; const dy = b.y - originY;
    const along = dx * dirX + dy * dirY;
    if (along < 0 || along > range) continue;
    const perp = Math.abs(dx * (-dirY) + dy * dirX);
    if (perp <= width) {
      bridge.applyKnockback(b.id, { x: dirX, y: dirY }, knockback);
      (b as any)._speedSlowMult = 0.5; (b as any)._speedSlowExpiresMs = Date.now() + 2000;
    }
  }
}

export function triggerResurreccion(turretConfig: any, runtime: TurretRuntimeState, nowMs: number): void {
  runtime.resurreccionUntilMs = nowMs + (turretConfig.resurreccionDurationSec ?? 8) * 1000;
}

// ═══════════════════════════════════════════════════════════════════════════
// GOTEI-13 / KIDO HANDLERS
// ═══════════════════════════════════════════════════════════════════════════

export function applyReiatsuBurst(turretConfig: any, beyblades: Beyblade[], tx: number, ty: number, nowMs: number, dtMs: number): void {
  const r2 = ((turretConfig.reiatsuBurstRadius ?? 140) ** 2);
  const spinDrain = (turretConfig.reiatsuBurstSpinDrain ?? 100) * dtMs / 1000;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - tx; const dy = b.y - ty;
    if (dx * dx + dy * dy <= r2) { b.spin = Math.max(0, b.spin - spinDrain); }
  }
}

export function applyKidoHado31(turretConfig: any, target: Beyblade): void {
  const dmg = turretConfig.kidoHado31Damage ?? 35;
  target.health = Math.max(0, target.health - dmg); target.damageTaken = (target.damageTaken ?? 0) + dmg;
  (target as any)._emberBurnTicks = ((target as any)._emberBurnTicks ?? 0) + 2;
}

export function applyKidoHado63(turretConfig: any, target: Beyblade, nowMs: number): void {
  const dmg = turretConfig.kidoHado63Damage ?? 60;
  target.health = Math.max(0, target.health - dmg); target.damageTaken = (target.damageTaken ?? 0) + dmg;
  target.controlLockedUntilMs = Math.max(target.controlLockedUntilMs ?? 0, nowMs + (turretConfig.kidoHado63ParalysisSec ?? 1) * 1000);
  target.controlLockSource = "kido_hado_63";
}

export function applyKidoHado90(turretConfig: any, target: Beyblade, bridge: TurretProcessorBridge, nowMs: number): void {
  const dmg = turretConfig.kidoHado90Damage ?? 80;
  target.health = Math.max(0, target.health - dmg); target.damageTaken = (target.damageTaken ?? 0) + dmg;
  target.controlLockedUntilMs = Math.max(target.controlLockedUntilMs ?? 0, nowMs + (turretConfig.kidoHado90TrapSec ?? 2.5) * 1000);
  target.controlLockSource = "kido_hado_90";
}

export function applyKidoBakudo61(turretConfig: any, target: Beyblade, nowMs: number): void {
  target.controlLockedUntilMs = Math.max(target.controlLockedUntilMs ?? 0, nowMs + (turretConfig.kidoBakudo61LockSec ?? 3) * 1000);
  target.controlLockSource = "kido_bakudo_61";
}

export function applyKidoBakudo99(turretConfig: any, target: Beyblade, nowMs: number): void {
  target.controlLockedUntilMs = Math.max(target.controlLockedUntilMs ?? 0, nowMs + (turretConfig.kidoBakudo99LockSec ?? 4) * 1000);
  target.controlLockSource = "kido_bakudo_99";
  target.spin = Math.max(0, target.spin * 0.5);
}

export function applyRoarOfSeireitei(turretConfig: any, beyblades: Beyblade[], bridge: TurretProcessorBridge, tx: number, ty: number): void {
  const r2 = ((turretConfig.roarRadius ?? 250) ** 2); const dmg = turretConfig.roarDamage ?? 150;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - tx; const dy = b.y - ty; const d = Math.sqrt(dx * dx + dy * dy) || 1;
    if (dx * dx + dy * dy <= r2) { b.health = Math.max(0, b.health - dmg); b.damageTaken = (b.damageTaken ?? 0) + dmg; bridge.applyKnockback(b.id, { x: dx / d, y: dy / d }, 1000); }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// VISORED / HOLLOWIFICATION HANDLERS
// ═══════════════════════════════════════════════════════════════════════════

export function triggerMaskOn(turretConfig: any, runtime: TurretRuntimeState, nowMs: number): void {
  runtime.maskOnUntilMs = nowMs + (turretConfig.maskOnDurationSec ?? 8) * 1000;
}

export function applyHollowCero(turretConfig: any, target: Beyblade): void {
  const dmg = turretConfig.hollowCeroDamage ?? 75;
  target.health = Math.max(0, target.health - dmg); target.damageTaken = (target.damageTaken ?? 0) + dmg;
}

export function applyGetsugaTensho(turretConfig: any, beyblades: Beyblade[], bridge: TurretProcessorBridge, tx: number, ty: number): void {
  const r2 = ((turretConfig.getsugatenshoRadius ?? 180) ** 2); const dmg = turretConfig.getsugatenshoDamage ?? 65;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - tx; const dy = b.y - ty; const d = Math.sqrt(dx * dx + dy * dy) || 1;
    if (dx * dx + dy * dy <= r2) { b.health = Math.max(0, b.health - dmg); b.damageTaken = (b.damageTaken ?? 0) + dmg; bridge.applyKnockback(b.id, { x: dx / d, y: dy / d }, 600); }
  }
}

export function applyMugetsu(turretConfig: any, target: Beyblade): void {
  const dmg = turretConfig.mugetsuDamage ?? 200;
  target.health = Math.max(0, target.health - dmg); target.damageTaken = (target.damageTaken ?? 0) + dmg;
  target.spin = Math.max(0, target.spin * 0.1);
}

// ═══════════════════════════════════════════════════════════════════════════
// ITACHI / GENJUTSU HANDLERS
// ═══════════════════════════════════════════════════════════════════════════

export function applyTsukuyomi(turretConfig: any, runtime: TurretRuntimeState, target: Beyblade, nowMs: number): void {
  runtime.tsukuyomiTargetId = target.id;
  runtime.tsukuyomiUntilMs = nowMs + (turretConfig.tsukuyomiDurationSec ?? 3) * 1000;
  (target as any)._tsukuyomiControlsInverted = true;
  (target as any)._tsukuyomiExpiresMs = runtime.tsukuyomiUntilMs;
}

export function processTsukuyomiExpiry(beyblades: Beyblade[], nowMs: number): void {
  for (const b of beyblades) {
    if ((b as any)._tsukuyomiExpiresMs && nowMs >= (b as any)._tsukuyomiExpiresMs) {
      delete (b as any)._tsukuyomiControlsInverted; delete (b as any)._tsukuyomiExpiresMs;
    }
  }
}

export function applyAmaterasuMark(turretConfig: any, runtime: TurretRuntimeState, target: Beyblade, nowMs: number): void {
  if (!runtime.amaterasuMarkedTargets) runtime.amaterasuMarkedTargets = [];
  const existing = runtime.amaterasuMarkedTargets.find(m => m.id === target.id);
  if (!existing) {
    runtime.amaterasuMarkedTargets.push({
      id: target.id,
      expiresMs: nowMs + (turretConfig.amaterasuMarkDurationSec ?? 10) * 1000,
      triggerDmg: turretConfig.amaterasuMarkTriggerDmg ?? 50,
    });
  }
}

export function processAmaterasuMarkTrigger(runtime: TurretRuntimeState, target: Beyblade, nowMs: number): boolean {
  if (!runtime.amaterasuMarkedTargets) return false;
  const idx = runtime.amaterasuMarkedTargets.findIndex(m => m.id === target.id && nowMs < m.expiresMs);
  if (idx === -1) return false;
  const entry = runtime.amaterasuMarkedTargets[idx];
  const dmg = entry.triggerDmg;
  target.health = Math.max(0, target.health - dmg); target.damageTaken = (target.damageTaken ?? 0) + dmg;
  runtime.amaterasuMarkedTargets.splice(idx, 1);
  return true;
}

export function triggerIzanagi(turretConfig: any, runtime: TurretRuntimeState): void {
  runtime.izanagiChargesLeft = turretConfig.izanagiCharges ?? 1;
}

export function applyIzanamiTrap(turretConfig: any, runtime: TurretRuntimeState, target: Beyblade, nowMs: number): void {
  runtime.izanamiTargetId = target.id;
  runtime.izanamiUntilMs = nowMs + (turretConfig.izanamiLoopSec ?? 2) * 1000;
  (target as any)._izanamiLoopActive = true;
  (target as any)._izanamiLoopX = target.x;
  (target as any)._izanamiLoopY = target.y;
  (target as any)._izanamiExpiresMs = runtime.izanamiUntilMs;
}

export function processIzanamiTick(beyblades: Beyblade[], bridge: TurretProcessorBridge, nowMs: number): void {
  for (const b of beyblades) {
    if (!(b as any)._izanamiLoopActive) continue;
    if (nowMs >= (b as any)._izanamiExpiresMs) {
      delete (b as any)._izanamiLoopActive; delete (b as any)._izanamiLoopX; delete (b as any)._izanamiLoopY; delete (b as any)._izanamiExpiresMs;
    } else if (bridge.setVelocity) {
      // Keep bey looping back to start position
      const dx = (b as any)._izanamiLoopX - b.x; const dy = (b as any)._izanamiLoopY - b.y;
      bridge.applyForce(b.id, dx * 0.1, dy * 0.1);
    }
  }
}

export function applySharinganLock(turretConfig: any, target: Beyblade, nowMs: number): void {
  (target as any)._sharinganMirrorUntilMs = nowMs + (turretConfig.sharinganLockSec ?? 2.5) * 1000;
  (target as any)._sharinganMirrorActive = true;
}

export function processSharinganExpiry(beyblades: Beyblade[], nowMs: number): void {
  for (const b of beyblades) {
    if ((b as any)._sharinganMirrorUntilMs && nowMs >= (b as any)._sharinganMirrorUntilMs) {
      delete (b as any)._sharinganMirrorActive; delete (b as any)._sharinganMirrorUntilMs;
    }
  }
}

export function applyCrowGenjutsu(turretConfig: any, runtime: TurretRuntimeState, beyblades: Beyblade[], bridge: TurretProcessorBridge, nowMs: number): void {
  runtime.crowGenjutsuUntilMs = nowMs + (turretConfig.crowGenjutsuDurationSec ?? 2) * 1000;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    (b as any)._crowConfusedUntilMs = nowMs + (turretConfig.crowGenjutsuDurationSec ?? 2) * 1000;
  }
}

export function applySusanooItachi(turretConfig: any, runtime: TurretRuntimeState, target: Beyblade, nowMs: number): void {
  runtime.susanooItachiTargetId = target.id;
  runtime.susanooItachiUntilMs = nowMs + (turretConfig.susanooItachiSealSec ?? 5) * 1000;
  target.controlLockedUntilMs = Math.max(target.controlLockedUntilMs ?? 0, runtime.susanooItachiUntilMs);
  target.controlLockSource = "susanoo_itachi";
}

export function processSusanooItachiTick(turretConfig: any, runtime: TurretRuntimeState, beyblades: Beyblade[], nowMs: number, dtMs: number): void {
  if (!runtime.susanooItachiTargetId || !runtime.susanooItachiUntilMs || nowMs > runtime.susanooItachiUntilMs) { runtime.susanooItachiTargetId = undefined; return; }
  const target = beyblades.find(b => b.id === runtime.susanooItachiTargetId && b.isActive);
  if (!target) { runtime.susanooItachiTargetId = undefined; return; }
  const drain = (turretConfig.susanooItachiSpinDrainPerSec ?? 150) * dtMs / 1000;
  target.spin = Math.max(0, target.spin - drain);
}

// ═══════════════════════════════════════════════════════════════════════════
// EXTENDED SUMMON HANDLERS
// ═══════════════════════════════════════════════════════════════════════════

export function triggerSummonRyuchi(turretConfig: any, runtime: TurretRuntimeState, target: Beyblade, nowMs: number): void {
  runtime.summonRyuchiTargetId = target.id;
  runtime.summonRyuchiUntilMs = nowMs + (turretConfig.summonRyuchiHoldSec ?? 2) * 1000;
}

export function processSummonRyuchiTick(turretConfig: any, runtime: TurretRuntimeState, beyblades: Beyblade[], bridge: TurretProcessorBridge, nowMs: number, dtMs: number): void {
  if (!runtime.summonRyuchiTargetId) return;
  const target = beyblades.find(b => b.id === runtime.summonRyuchiTargetId && b.isActive);
  if (!target || nowMs >= (runtime.summonRyuchiUntilMs ?? 0)) { runtime.summonRyuchiTargetId = undefined; return; }
  if (bridge.setVelocity) bridge.setVelocity(target.id, 0, 0);
  const dmg = (turretConfig.summonRyuchiDotPerSec ?? 18) * dtMs / 1000;
  target.health = Math.max(0, target.health - dmg); target.damageTaken = (target.damageTaken ?? 0) + dmg;
}

export function applySummonMyoboku(turretConfig: any, runtime: TurretRuntimeState, beyblades: Beyblade[], tx: number, ty: number, nowMs: number): void {
  const dmg = turretConfig.summonMyobokuOilDmg ?? 50;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - tx; const dy = b.y - ty;
    if (Math.sqrt(dx * dx + dy * dy) <= 120) { b.health = Math.max(0, b.health - dmg); b.damageTaken = (b.damageTaken ?? 0) + dmg; }
  }
  runtime.summonMyobokuBoostUntilMs = nowMs + (turretConfig.summonMyobokuBoostSec ?? 5) * 1000;
}

export function applySummonGaruda(turretConfig: any, beyblades: Beyblade[], bridge: TurretProcessorBridge, tx: number, ty: number): void {
  const r2 = ((turretConfig.summonGarudaRadius ?? 160) ** 2); const dmg = turretConfig.summonGarudaDamage ?? 55;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - tx; const dy = b.y - ty; const d = Math.sqrt(dx * dx + dy * dy) || 1;
    if (dx * dx + dy * dy <= r2) { b.health = Math.max(0, b.health - dmg); b.damageTaken = (b.damageTaken ?? 0) + dmg; bridge.applyKnockback(b.id, { x: dx / d, y: dy / d }, 700); }
  }
}

export function applySummonEnma(turretConfig: any, beyblades: Beyblade[], bridge: TurretProcessorBridge, tx: number, ty: number): void {
  const reach = turretConfig.summonEnmaReach ?? 300; const dmg = turretConfig.summonEnmaDamage ?? 45;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - tx; const dy = b.y - ty; const d = Math.sqrt(dx * dx + dy * dy);
    if (d <= reach) { b.health = Math.max(0, b.health - dmg); b.damageTaken = (b.damageTaken ?? 0) + dmg; bridge.applyKnockback(b.id, { x: dx / d, y: dy / d }, 400); }
  }
}

export function applySummonGamaken(turretConfig: any, beyblades: Beyblade[], bridge: TurretProcessorBridge, tx: number, ty: number): void {
  const dmg = turretConfig.summonGamakenDamage ?? 70;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - tx; const dy = b.y - ty; const d = Math.sqrt(dx * dx + dy * dy) || 1;
    if (d <= 200) { b.health = Math.max(0, b.health - dmg); b.damageTaken = (b.damageTaken ?? 0) + dmg; bridge.applyKnockback(b.id, { x: dx / d, y: dy / d }, 800); }
  }
}

export function applyEdoTensei(turretConfig: any, target: Beyblade): void {
  const frac = turretConfig.edoTenseiHpFraction ?? 0.25;
  if (target.health <= 0) {
    target.health = 100 * frac;
    target.isActive = true;
  } else {
    const healAmount = Math.floor(target.health * frac);
    target.health = Math.min(100, target.health + healAmount);
  }
  const spinBoost = target.maxSpin * 0.15;
  target.spin = Math.min(target.maxSpin, target.spin + spinBoost);
  target.invulnerable = true;
  (target as any)._edoTenseiInvulnUntilMs = Date.now() + 800;
}

export function processEdoTenseiTick(target: Beyblade, nowMs: number): void {
  if ((target as any)._edoTenseiInvulnUntilMs && nowMs > (target as any)._edoTenseiInvulnUntilMs) {
    target.invulnerable = false;
    (target as any)._edoTenseiInvulnUntilMs = undefined;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SIZE & WEIGHT SCALING HANDLERS
// ═══════════════════════════════════════════════════════════════════════════

/** enlarge: makes target bey physically larger — more mass, harder hits, slower. */
export function triggerEnlarge(turretConfig: any, runtime: TurretRuntimeState, target: Beyblade, nowMs: number): void {
  runtime.enlargeTargetId = target.id;
  runtime.enlargeUntilMs = nowMs + (turretConfig.enlargeDurationSec ?? 6) * 1000;
  (target as any)._radiusScale = turretConfig.enlargeRadiusScale ?? 1.5;
  (target as any)._collisionDamageMult = turretConfig.enlargeCollisionMult ?? 1.8;
  (target as any)._speedScale = turretConfig.enlargeSpeedMult ?? 0.7;
  (target as any)._sizeScaleExpiresMs = runtime.enlargeUntilMs;
}

/** shrink: makes target bey smaller — faster, evasive, weaker hits. */
export function triggerShrink(turretConfig: any, runtime: TurretRuntimeState, target: Beyblade, nowMs: number): void {
  runtime.shrinkTargetId = target.id;
  runtime.shrinkUntilMs = nowMs + (turretConfig.shrinkDurationSec ?? 5) * 1000;
  (target as any)._radiusScale = turretConfig.shrinkRadiusScale ?? 0.5;
  (target as any)._collisionDamageMult = 0.6;
  (target as any)._speedScale = turretConfig.shrinkSpeedMult ?? 1.3;
  (target as any)._sizeScaleExpiresMs = runtime.shrinkUntilMs;
}

export function processSizeScaleExpiry(beyblades: Beyblade[], nowMs: number): void {
  for (const b of beyblades) {
    if ((b as any)._sizeScaleExpiresMs && nowMs >= (b as any)._sizeScaleExpiresMs) {
      delete (b as any)._radiusScale;
      delete (b as any)._collisionDamageMult;
      delete (b as any)._speedScale;
      delete (b as any)._sizeScaleExpiresMs;
    }
  }
}

/** mass_shift: weight surge — absorbs knockback, deals heavy collision damage. */
export function triggerMassShift(turretConfig: any, runtime: TurretRuntimeState, target: Beyblade, nowMs: number): void {
  runtime.massShiftTargetId = target.id;
  runtime.massShiftUntilMs = nowMs + (turretConfig.massShiftDurationSec ?? 5) * 1000;
  (target as any)._kbResist = turretConfig.massShiftKbResist ?? 0.6;
  (target as any)._collisionDamageMult = turretConfig.massShiftCollisionMult ?? 2.0;
  (target as any)._massShiftExpiresMs = runtime.massShiftUntilMs;
}

export function processMassShiftExpiry(beyblades: Beyblade[], nowMs: number): void {
  for (const b of beyblades) {
    if ((b as any)._massShiftExpiresMs && nowMs >= (b as any)._massShiftExpiresMs) {
      delete (b as any)._kbResist;
      delete (b as any)._collisionDamageMult;
      delete (b as any)._massShiftExpiresMs;
    }
  }
}

/** density_crush: ultra-dense contact burst — AoE devastates all nearby beys. */
export function applyDensityCrush(turretConfig: any, beyblades: Beyblade[], bridge: TurretProcessorBridge, tx: number, ty: number): void {
  const r2 = ((turretConfig.densityCrushRadius ?? 60) ** 2);
  const dmg = turretConfig.densityCrushDamage ?? 80;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - tx; const dy = b.y - ty; const d = Math.sqrt(dx * dx + dy * dy) || 1;
    if (dx * dx + dy * dy <= r2) {
      b.health = Math.max(0, b.health - dmg); b.damageTaken = (b.damageTaken ?? 0) + dmg;
      bridge.applyKnockback(b.id, { x: dx / d, y: dy / d }, 1000);
      b.spin = Math.max(0, b.spin * 0.5);
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// FULL TRANSFORMATION HANDLERS
// ═══════════════════════════════════════════════════════════════════════════

/** hollow_transform: Ichigo becomes full hollow — berserk cero-spam form. */
export function triggerHollowTransform(turretConfig: any, runtime: TurretRuntimeState, target: Beyblade, nowMs: number): void {
  runtime.hollowTransformTargetId = target.id;
  runtime.hollowTransformUntilMs = nowMs + (turretConfig.hollowTransformDurationSec ?? 8) * 1000;
  runtime.hollowTransformNextPulseMs = nowMs;
  (target as any)._hollowForm = true;
  (target as any)._hollowFormExpiresMs = runtime.hollowTransformUntilMs;
  // Invert control source for the "berserk" feel — extreme spin boost
  target.spin = Math.min(target.maxSpin ?? 2000, target.spin * 1.5);
}

export function processHollowTransformTick(turretConfig: any, runtime: TurretRuntimeState, beyblades: Beyblade[], bridge: TurretProcessorBridge, nowMs: number): void {
  if (!runtime.hollowTransformTargetId || !runtime.hollowTransformUntilMs) return;
  if (nowMs > runtime.hollowTransformUntilMs) {
    const t = beyblades.find(b => b.id === runtime.hollowTransformTargetId);
    if (t) delete (t as any)._hollowForm;
    runtime.hollowTransformTargetId = undefined; return;
  }
  if (nowMs < (runtime.hollowTransformNextPulseMs ?? 0)) return;
  runtime.hollowTransformNextPulseMs = nowMs + (turretConfig.hollowTransformPulseMs ?? 1200);
  // Cero blast at random nearby bey
  const target = beyblades.find(b => b.id === runtime.hollowTransformTargetId && b.isActive);
  if (!target) { runtime.hollowTransformTargetId = undefined; return; }
  // Random nearby victim
  const others = beyblades.filter(b => b.isActive && !b.isRingOut && b.id !== target.id);
  if (!others.length) return;
  const victim = others[Math.floor(Math.random() * others.length)];
  const dmg = turretConfig.hollowTransformCeroDmg ?? 40;
  victim.health = Math.max(0, victim.health - dmg); victim.damageTaken = (victim.damageTaken ?? 0) + dmg;
  const dx = victim.x - target.x; const dy = victim.y - target.y; const d = Math.sqrt(dx * dx + dy * dy) || 1;
  bridge.applyKnockback(victim.id, { x: dx / d, y: dy / d }, 400);
}

/** kyuubi_mode: Nine-Tails chakra cloak — speed + power + burning aura field. */
export function triggerKyuubiMode(turretConfig: any, runtime: TurretRuntimeState, target: Beyblade, nowMs: number): void {
  runtime.kyuubiModeTargetId = target.id;
  runtime.kyuubiModeUntilMs = nowMs + (turretConfig.kyuubiModeDurationSec ?? 10) * 1000;
  (target as any)._kyuubiForm = true;
  (target as any)._kyuubiSpeedMult = turretConfig.kyuubiModeSpeedMult ?? 1.4;
  (target as any)._kyuubiExpiresMs = runtime.kyuubiModeUntilMs;
  target.spin = Math.min(target.maxSpin ?? 2000, target.spin * 1.3);
}

export function processKyuubiModeTick(turretConfig: any, runtime: TurretRuntimeState, beyblades: Beyblade[], dtMs: number, nowMs: number): void {
  if (!runtime.kyuubiModeTargetId || !runtime.kyuubiModeUntilMs) return;
  if (nowMs > runtime.kyuubiModeUntilMs) {
    const t = beyblades.find(b => b.id === runtime.kyuubiModeTargetId);
    if (t) { delete (t as any)._kyuubiForm; delete (t as any)._kyuubiSpeedMult; delete (t as any)._kyuubiExpiresMs; }
    runtime.kyuubiModeTargetId = undefined; return;
  }
  const source = beyblades.find(b => b.id === runtime.kyuubiModeTargetId && b.isActive);
  if (!source) { runtime.kyuubiModeTargetId = undefined; return; }
  const radius = turretConfig.kyuubiModeAuraRadius ?? 100;
  const dps = turretConfig.kyuubiModeAuraDps ?? 12;
  const r2 = radius * radius;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut || b.id === source.id) continue;
    const dx = b.x - source.x; const dy = b.y - source.y;
    if (dx * dx + dy * dy <= r2) { const dmg = dps * dtMs / 1000; b.health = Math.max(0, b.health - dmg); b.damageTaken = (b.damageTaken ?? 0) + dmg; }
  }
}

/** bijuu_mode: full tailed beast form — movement damages nearby beys. */
export function triggerBijuuMode(turretConfig: any, runtime: TurretRuntimeState, target: Beyblade, nowMs: number): void {
  runtime.bijuuModeTargetId = target.id;
  runtime.bijuuModeUntilMs = nowMs + (turretConfig.bijuuModeDurationSec ?? 8) * 1000;
  (target as any)._bijuuForm = true;
  (target as any)._bijuuExpiresMs = runtime.bijuuModeUntilMs;
  (target as any)._radiusScale = ((target as any)._radiusScale ?? 1) * 2.0;
  target.spin = Math.min(target.maxSpin ?? 2000, target.spin * 1.6);
}

export function processBijuuModeTick(turretConfig: any, runtime: TurretRuntimeState, beyblades: Beyblade[], bridge: TurretProcessorBridge, dtMs: number, nowMs: number): void {
  if (!runtime.bijuuModeTargetId || !runtime.bijuuModeUntilMs) return;
  if (nowMs > runtime.bijuuModeUntilMs) {
    const t = beyblades.find(b => b.id === runtime.bijuuModeTargetId);
    if (t) { delete (t as any)._bijuuForm; delete (t as any)._bijuuExpiresMs; (t as any)._radiusScale = 1; }
    runtime.bijuuModeTargetId = undefined; return;
  }
  const source = beyblades.find(b => b.id === runtime.bijuuModeTargetId && b.isActive);
  if (!source) { runtime.bijuuModeTargetId = undefined; return; }
  const radius = turretConfig.bijuuModeAoeRadius ?? 80;
  const dmgPerTick = (turretConfig.bijuuModeAoeDmg ?? 20) * dtMs / 1000;
  const r2 = radius * radius;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut || b.id === source.id) continue;
    const dx = b.x - source.x; const dy = b.y - source.y;
    if (dx * dx + dy * dy <= r2) { b.health = Math.max(0, b.health - dmgPerTick); b.damageTaken = (b.damageTaken ?? 0) + dmgPerTick; }
  }
}

/** tailed_beast_bomb: Bijuudama — charged mega-explosion. */
export function applyTailedBeastBomb(turretConfig: any, beyblades: Beyblade[], bridge: TurretProcessorBridge, tx: number, ty: number): void {
  const r2 = ((turretConfig.tailedBeastBombRadius ?? 200) ** 2);
  const dmg = turretConfig.tailedBeastBombDamage ?? 180;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - tx; const dy = b.y - ty; const d = Math.sqrt(dx * dx + dy * dy) || 1;
    if (dx * dx + dy * dy <= r2) {
      b.health = Math.max(0, b.health - dmg); b.damageTaken = (b.damageTaken ?? 0) + dmg;
      bridge.applyKnockback(b.id, { x: dx / d, y: dy / d }, 1500);
      b.spin = Math.max(0, b.spin * 0.3);
    }
  }
}

/** curse_mark_2: Sasuke level 2 — guaranteed crits for duration. */
export function triggerCurseMark2(turretConfig: any, runtime: TurretRuntimeState, target: Beyblade, nowMs: number): void {
  runtime.curseMark2TargetId = target.id;
  runtime.curseMark2UntilMs = nowMs + (turretConfig.curseMark2DurationSec ?? 7) * 1000;
  (target as any)._curseMark2 = true;
  (target as any)._curseMark2CritMult = turretConfig.curseMark2CritMult ?? 2.5;
  (target as any)._curseMark2ExpiresMs = runtime.curseMark2UntilMs;
}

/** six_paths_mode: all-element damage boost + rinnegan for duration. */
export function triggerSixPathsMode(turretConfig: any, runtime: TurretRuntimeState, nowMs: number): void {
  runtime.sixPathsUntilMs = nowMs + (turretConfig.sixPathsDurationSec ?? 10) * 1000;
}

/** ten_tails_jinchuriki: massive AoE spin drain + suppression. */
export function triggerTenTails(turretConfig: any, runtime: TurretRuntimeState, nowMs: number): void {
  runtime.tenTailsUntilMs = nowMs + (turretConfig.tenTailsDurationSec ?? 8) * 1000;
}

export function processTenTailsTick(turretConfig: any, runtime: TurretRuntimeState, beyblades: Beyblade[], tx: number, ty: number, nowMs: number, dtMs: number): void {
  if (!runtime.tenTailsUntilMs || nowMs > runtime.tenTailsUntilMs) return;
  const r2 = ((turretConfig.tenTailsRadius ?? 250) ** 2);
  const drain = (turretConfig.tenTailsSpinDrain ?? 80) * dtMs / 1000;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - tx; const dy = b.y - ty;
    if (dx * dx + dy * dy <= r2) { b.spin = Math.max(0, b.spin - drain); }
  }
}

/** berserk_hollow: uncontrolled — fires random extreme damage hits on random beys. */
export function triggerBerserkHollow(turretConfig: any, runtime: TurretRuntimeState, nowMs: number): void {
  runtime.berserkHollowUntilMs = nowMs + (turretConfig.berserkHollowDurationSec ?? 6) * 1000;
  runtime.berserkHollowNextHitMs = nowMs;
}

export function processBerserkHollowTick(turretConfig: any, runtime: TurretRuntimeState, beyblades: Beyblade[], bridge: TurretProcessorBridge, nowMs: number): void {
  if (!runtime.berserkHollowUntilMs || nowMs > runtime.berserkHollowUntilMs) return;
  if (nowMs < (runtime.berserkHollowNextHitMs ?? 0)) return;
  runtime.berserkHollowNextHitMs = nowMs + 200 + Math.random() * 400;
  const active = beyblades.filter(b => b.isActive && !b.isRingOut);
  if (!active.length) return;
  const target = active[Math.floor(Math.random() * active.length)];
  const minDmg = turretConfig.berserkHollowMinDmg ?? 15;
  const maxDmg = turretConfig.berserkHollowMaxDmg ?? 80;
  const dmg = minDmg + Math.random() * (maxDmg - minDmg);
  target.health = Math.max(0, target.health - dmg); target.damageTaken = (target.damageTaken ?? 0) + dmg;
  bridge.applyKnockback(target.id, { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 }, 500 + Math.random() * 500);
}

// ═══════════════════════════════════════════════════════════════════════════
// DEIDARA HANDLERS
// ═══════════════════════════════════════════════════════════════════════════

/** clay_spider: places a seeking spider mine that moves toward nearest bey. */
export function placeClaySpider(turretConfig: any, runtime: TurretRuntimeState, tx: number, ty: number): void {
  runtime.claySpiderX = tx; runtime.claySpiderY = ty; runtime.claySpiderActive = true;
  runtime.activeClayCount = (runtime.activeClayCount ?? 0) + 1;
}

export function processClaySpiderTick(turretConfig: any, runtime: TurretRuntimeState, beyblades: Beyblade[], bridge: TurretProcessorBridge, dtMs: number): void {
  if (!runtime.claySpiderActive) return;
  let cx = runtime.claySpiderX ?? 0; let cy = runtime.claySpiderY ?? 0;
  const speed = turretConfig.claySpiderSpeed ?? 150;
  // Find nearest bey
  let nearest: Beyblade | null = null; let nearestD = Infinity;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - cx; const dy = b.y - cy; const d2 = dx * dx + dy * dy;
    if (d2 < nearestD) { nearestD = d2; nearest = b; }
  }
  if (!nearest) return;
  const dx = nearest.x - cx; const dy = nearest.y - cy; const d = Math.sqrt(dx * dx + dy * dy) || 1;
  cx += (dx / d) * speed * dtMs / 1000; cy += (dy / d) * speed * dtMs / 1000;
  runtime.claySpiderX = cx; runtime.claySpiderY = cy;
  const triggerR = turretConfig.claySpiderRadius ?? 50;
  if (d <= triggerR) {
    // Explode
    const dmg = turretConfig.claySpiderDamage ?? 35; const r2 = triggerR * triggerR;
    for (const b of beyblades) {
      if (!b.isActive || b.isRingOut) continue;
      const dx2 = b.x - cx; const dy2 = b.y - cy; const dd = Math.sqrt(dx2 * dx2 + dy2 * dy2) || 1;
      if (dx2 * dx2 + dy2 * dy2 <= r2) { b.health = Math.max(0, b.health - dmg); b.damageTaken = (b.damageTaken ?? 0) + dmg; bridge.applyKnockback(b.id, { x: dx2 / dd, y: dy2 / dd }, 500); }
    }
    runtime.claySpiderActive = false;
    runtime.activeClayCount = Math.max(0, (runtime.activeClayCount ?? 1) - 1);
  }
}

/** clay_dragon: homing large clay bomb. */
export function placeClayDragon(turretConfig: any, runtime: TurretRuntimeState, target: Beyblade, tx: number, ty: number): void {
  runtime.clayDragonTargetId = target.id;
  runtime.clayDragonX = tx; runtime.clayDragonY = ty; runtime.clayDragonActive = true;
  runtime.activeClayCount = (runtime.activeClayCount ?? 0) + 1;
}

export function processClayDragonTick(turretConfig: any, runtime: TurretRuntimeState, beyblades: Beyblade[], bridge: TurretProcessorBridge, dtMs: number): void {
  if (!runtime.clayDragonActive) return;
  const speed = 200; let cx = runtime.clayDragonX ?? 0; let cy = runtime.clayDragonY ?? 0;
  const target = beyblades.find(b => b.id === runtime.clayDragonTargetId && b.isActive);
  if (!target) { runtime.clayDragonActive = false; runtime.activeClayCount = Math.max(0, (runtime.activeClayCount ?? 1) - 1); return; }
  const dx = target.x - cx; const dy = target.y - cy; const d = Math.sqrt(dx * dx + dy * dy) || 1;
  cx += (dx / d) * speed * dtMs / 1000; cy += (dy / d) * speed * dtMs / 1000;
  runtime.clayDragonX = cx; runtime.clayDragonY = cy;
  if (d <= 30) {
    const radius = turretConfig.clayDragonRadius ?? 120; const dmg = turretConfig.clayDragonDamage ?? 80; const r2 = radius * radius;
    for (const b of beyblades) {
      if (!b.isActive || b.isRingOut) continue;
      const dx2 = b.x - cx; const dy2 = b.y - cy; const dd = Math.sqrt(dx2 * dx2 + dy2 * dy2) || 1;
      if (dx2 * dx2 + dy2 * dy2 <= r2) { b.health = Math.max(0, b.health - dmg); b.damageTaken = (b.damageTaken ?? 0) + dmg; bridge.applyKnockback(b.id, { x: dx2 / dd, y: dy2 / dd }, 700); }
    }
    runtime.clayDragonActive = false; runtime.activeClayCount = Math.max(0, (runtime.activeClayCount ?? 1) - 1);
  }
}

/** clay_bomb: C3 — placed massive explosive triggered by proximity. */
export function placeClayBomb(turretConfig: any, runtime: TurretRuntimeState, tx: number, ty: number): void {
  runtime.clayBombX = tx; runtime.clayBombY = ty; runtime.clayBombActive = true;
  runtime.activeClayCount = (runtime.activeClayCount ?? 0) + 1;
}

export function processClayBombTick(turretConfig: any, runtime: TurretRuntimeState, beyblades: Beyblade[], bridge: TurretProcessorBridge): void {
  if (!runtime.clayBombActive) return;
  const cx = runtime.clayBombX ?? 0; const cy = runtime.clayBombY ?? 0;
  const triggerR = 60; const triggerR2 = triggerR * triggerR;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - cx; const dy = b.y - cy;
    if (dx * dx + dy * dy <= triggerR2) {
      const radius = turretConfig.clayBombRadius ?? 180; const dmg = turretConfig.clayBombDamage ?? 120; const r2 = radius * radius;
      for (const b2 of beyblades) {
        if (!b2.isActive || b2.isRingOut) continue;
        const dx2 = b2.x - cx; const dy2 = b2.y - cy; const dd = Math.sqrt(dx2 * dx2 + dy2 * dy2) || 1;
        if (dx2 * dx2 + dy2 * dy2 <= r2) { b2.health = Math.max(0, b2.health - dmg); b2.damageTaken = (b2.damageTaken ?? 0) + dmg; bridge.applyKnockback(b2.id, { x: dx2 / dd, y: dy2 / dd }, 1000); }
      }
      runtime.clayBombActive = false; runtime.activeClayCount = Math.max(0, (runtime.activeClayCount ?? 1) - 1); return;
    }
  }
}

/** clay_clones_c4: microscopic bombs inhaled by target — internal DoT. */
export function applyClayC4(turretConfig: any, runtime: TurretRuntimeState, target: Beyblade, nowMs: number): void {
  runtime.clayC4TargetId = target.id;
  runtime.clayC4UntilMs = nowMs + (turretConfig.clayC4DurationSec ?? 5) * 1000;
  (target as any)._clayC4DotPerSec = turretConfig.clayC4DotPerSec ?? 25;
  (target as any)._clayC4UntilMs = runtime.clayC4UntilMs;
}

export function processClayC4Tick(beyblades: Beyblade[], nowMs: number, dtMs: number): void {
  for (const b of beyblades) {
    if (!(b as any)._clayC4UntilMs) continue;
    if (nowMs >= (b as any)._clayC4UntilMs) { delete (b as any)._clayC4DotPerSec; delete (b as any)._clayC4UntilMs; continue; }
    const dmg = ((b as any)._clayC4DotPerSec ?? 25) * dtMs / 1000;
    b.health = Math.max(0, b.health - dmg); b.damageTaken = (b.damageTaken ?? 0) + dmg;
  }
}

/** katsu: detonates ALL active clay simultaneously. */
export function applyKatsu(turretConfig: any, runtime: TurretRuntimeState, beyblades: Beyblade[], bridge: TurretProcessorBridge): void {
  const dmgPerClay = turretConfig.katsuDmgPerClay ?? 60;
  const clayCenters: Array<{ x: number; y: number }> = [];
  if (runtime.claySpiderActive) { clayCenters.push({ x: runtime.claySpiderX ?? 0, y: runtime.claySpiderY ?? 0 }); runtime.claySpiderActive = false; }
  if (runtime.clayDragonActive) { clayCenters.push({ x: runtime.clayDragonX ?? 0, y: runtime.clayDragonY ?? 0 }); runtime.clayDragonActive = false; }
  if (runtime.clayBombActive) { clayCenters.push({ x: runtime.clayBombX ?? 0, y: runtime.clayBombY ?? 0 }); runtime.clayBombActive = false; }
  runtime.activeClayCount = 0;
  for (const center of clayCenters) {
    const r2 = 160 * 160;
    for (const b of beyblades) {
      if (!b.isActive || b.isRingOut) continue;
      const dx = b.x - center.x; const dy = b.y - center.y; const dd = Math.sqrt(dx * dx + dy * dy) || 1;
      if (dx * dx + dy * dy <= r2) { b.health = Math.max(0, b.health - dmgPerClay); b.damageTaken = (b.damageTaken ?? 0) + dmgPerClay; bridge.applyKnockback(b.id, { x: dx / dd, y: dy / dd }, 900); }
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// AKATSUKI HANDLERS
// ═══════════════════════════════════════════════════════════════════════════

/** shinra_tensei: repulsion wave — pushes ALL beys away from center. */
export function applyShinraTensei(turretConfig: any, beyblades: Beyblade[], bridge: TurretProcessorBridge, cx: number, cy: number): void {
  const r2 = ((turretConfig.shinraTenseiRadius ?? 250) ** 2);
  const force = turretConfig.shinraTenseiForce ?? 1200;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - cx; const dy = b.y - cy; const d = Math.sqrt(dx * dx + dy * dy) || 1;
    if (dx * dx + dy * dy <= r2) bridge.applyKnockback(b.id, { x: dx / d, y: dy / d }, force);
  }
}

/** chibaku_tensei: pulls all beys toward a point, then crushes after delay. */
export function triggerChibakuTensei(turretConfig: any, runtime: TurretRuntimeState, tx: number, ty: number, nowMs: number): void {
  runtime.chibakuTenseiCenterX = tx; runtime.chibakuTenseiCenterY = ty;
  runtime.chibakuTenseiCrushMs = nowMs + (turretConfig.chibakuTenseiHoldSec ?? 3) * 1000;
}

export function processChibakuTenseiTick(turretConfig: any, runtime: TurretRuntimeState, beyblades: Beyblade[], bridge: TurretProcessorBridge, nowMs: number, dtMs: number): void {
  if (!runtime.chibakuTenseiCrushMs) return;
  const cx = runtime.chibakuTenseiCenterX ?? 0; const cy = runtime.chibakuTenseiCenterY ?? 0;
  if (nowMs >= runtime.chibakuTenseiCrushMs) {
    // Crush
    const r2 = ((turretConfig.chibakuTenseiCrushRadius ?? 60) ** 2); const dmg = turretConfig.chibakuTenseiCrushDamage ?? 100;
    for (const b of beyblades) {
      if (!b.isActive || b.isRingOut) continue;
      const dx = b.x - cx; const dy = b.y - cy; const dd = Math.sqrt(dx * dx + dy * dy) || 1;
      if (dx * dx + dy * dy <= r2) { b.health = Math.max(0, b.health - dmg); b.damageTaken = (b.damageTaken ?? 0) + dmg; bridge.applyKnockback(b.id, { x: dx / dd, y: dy / dd }, 800); }
    }
    runtime.chibakuTenseiCrushMs = undefined; return;
  }
  // Pull phase
  const pullForce = (turretConfig.chibakuTenseiPullForce ?? 800) * dtMs / 1000;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = cx - b.x; const dy = cy - b.y; const d = Math.sqrt(dx * dx + dy * dy) || 1;
    bridge.applyForce(b.id, (dx / d) * pullForce, (dy / d) * pullForce);
  }
}

/** samehada_drain: Kisame sword — drains spin from nearest bey. */
export function applySamehadaDrain(turretConfig: any, beyblades: Beyblade[], tx: number, ty: number, dtMs: number): void {
  const r2 = ((turretConfig.samehaDrainRadius ?? 60) ** 2);
  const drain = (turretConfig.samedhadrainPerSec ?? 150) * dtMs / 1000;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - tx; const dy = b.y - ty;
    if (dx * dx + dy * dy <= r2) b.spin = Math.max(0, b.spin - drain);
  }
}

/** shark_bomb: water shark homing projectile — instant on-contact damage. */
export function applySharkBomb(turretConfig: any, target: Beyblade, bridge: TurretProcessorBridge): void {
  const dmg = turretConfig.sharkBombDamage ?? 65;
  target.health = Math.max(0, target.health - dmg); target.damageTaken = (target.damageTaken ?? 0) + dmg;
  bridge.applyKnockback(target.id, { x: 0, y: 0 }, 600);
  target.spin = Math.max(0, target.spin - 200);
}

/** earth_grudge_fear: Kakuzu thread — grabs and drains target bey. */
export function triggerEarthGrudgeFear(turretConfig: any, runtime: TurretRuntimeState, target: Beyblade, nowMs: number): void {
  runtime.earthGrudgeTargetId = target.id;
  runtime.earthGrudgeUntilMs = nowMs + (turretConfig.earthGrudgeHoldSec ?? 2.5) * 1000;
}

export function processEarthGrudgeTick(turretConfig: any, runtime: TurretRuntimeState, beyblades: Beyblade[], bridge: TurretProcessorBridge, nowMs: number, dtMs: number): void {
  if (!runtime.earthGrudgeTargetId) return;
  const target = beyblades.find(b => b.id === runtime.earthGrudgeTargetId && b.isActive);
  if (!target || nowMs >= (runtime.earthGrudgeUntilMs ?? 0)) { runtime.earthGrudgeTargetId = undefined; return; }
  if (bridge.setVelocity) bridge.setVelocity(target.id, 0, 0);
  const dmg = (turretConfig.earthGrudgeDps ?? 10) * dtMs / 1000;
  target.health = Math.max(0, target.health - dmg); target.damageTaken = (target.damageTaken ?? 0) + dmg;
}

/** jashin_ritual: Hidan curse — damage dealt near the turret zone also hits the linked target. */
export function triggerJashinRitual(turretConfig: any, runtime: TurretRuntimeState, target: Beyblade, nowMs: number): void {
  runtime.jashinLinkedTargetId = target.id;
  runtime.jashinLinkUntilMs = nowMs + (turretConfig.jashinLinkDurationSec ?? 8) * 1000;
}

export function applyJashinMirrorDamage(runtime: TurretRuntimeState, beyblades: Beyblade[], incomingDmg: number, nowMs: number): void {
  if (!runtime.jashinLinkedTargetId || !runtime.jashinLinkUntilMs || nowMs > runtime.jashinLinkUntilMs) return;
  const target = beyblades.find(b => b.id === runtime.jashinLinkedTargetId && b.isActive);
  if (!target) { runtime.jashinLinkedTargetId = undefined; return; }
  const reflected = incomingDmg * (0.8);
  target.health = Math.max(0, target.health - reflected); target.damageTaken = (target.damageTaken ?? 0) + reflected;
}

/** paper_bomb_storm: Konan's 600-billion paper bomb mass saturation. */
export function applyPaperBombStorm(turretConfig: any, beyblades: Beyblade[], bridge: TurretProcessorBridge, tx: number, ty: number): void {
  const r2 = ((turretConfig.paperBombRadius ?? 220) ** 2);
  const dmg = turretConfig.paperBombDamage ?? 110;
  for (const b of beyblades) {
    if (!b.isActive || b.isRingOut) continue;
    const dx = b.x - tx; const dy = b.y - ty; const d = Math.sqrt(dx * dx + dy * dy) || 1;
    if (dx * dx + dy * dy <= r2) {
      b.health = Math.max(0, b.health - dmg); b.damageTaken = (b.damageTaken ?? 0) + dmg;
      bridge.applyKnockback(b.id, { x: dx / d, y: dy / d }, 800);
      b.spin = Math.max(0, b.spin * 0.6);
    }
  }
}

/** kamui: Obito dimensional warp — removes target from arena temporarily. */
export function applyKamui(turretConfig: any, runtime: TurretRuntimeState, target: Beyblade, nowMs: number): void {
  runtime.kamuiTargetId = target.id;
  runtime.kamuiReturnMs = nowMs + (turretConfig.kamuiDurationSec ?? 3) * 1000;
  target.isActive = false;
  target.invulnerable = true;
  (target as any)._kamuiAbsorbed = true;
}

export function processKamuiTick(runtime: TurretRuntimeState, beyblades: Beyblade[], nowMs: number): void {
  if (!runtime.kamuiTargetId || !runtime.kamuiReturnMs || nowMs < runtime.kamuiReturnMs) return;
  const target = beyblades.find(b => b.id === runtime.kamuiTargetId);
  if (target) {
    target.isActive = true; target.invulnerable = false;
    delete (target as any)._kamuiAbsorbed;
  }
  runtime.kamuiTargetId = undefined;
}

/** limbo_hengoku: Madara shadow realm — unblockable phantom hits. */
export function applyLimboHengoku(turretConfig: any, target: Beyblade, bridge: TurretProcessorBridge): void {
  const hits = turretConfig.limboHits ?? 4; const dmgPerHit = turretConfig.limboDmgPerHit ?? 20;
  // Phantom hits bypass invulnerable flag
  const wasInvuln = target.invulnerable;
  target.invulnerable = false;
  target.health = Math.max(0, target.health - dmgPerHit * hits);
  target.damageTaken = (target.damageTaken ?? 0) + dmgPerHit * hits;
  target.invulnerable = wasInvuln;
  for (let i = 0; i < hits; i++) bridge.applyForce(target.id, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100);
}

/** wood_dragon: Hashirama wood dragon — traps bey and suppresses spin. */
export function triggerWoodDragon(turretConfig: any, runtime: TurretRuntimeState, target: Beyblade, nowMs: number): void {
  runtime.woodDragonTargetId = target.id;
  runtime.woodDragonUntilMs = nowMs + (turretConfig.woodDragonTrapSec ?? 3) * 1000;
  target.controlLockedUntilMs = Math.max(target.controlLockedUntilMs ?? 0, runtime.woodDragonUntilMs);
  target.controlLockSource = "wood_dragon";
}

export function processWoodDragonTick(turretConfig: any, runtime: TurretRuntimeState, beyblades: Beyblade[], bridge: TurretProcessorBridge, nowMs: number, dtMs: number): void {
  if (!runtime.woodDragonTargetId || !runtime.woodDragonUntilMs || nowMs > runtime.woodDragonUntilMs) { runtime.woodDragonTargetId = undefined; return; }
  const target = beyblades.find(b => b.id === runtime.woodDragonTargetId && b.isActive);
  if (!target) { runtime.woodDragonTargetId = undefined; return; }
  if (bridge.setVelocity) bridge.setVelocity(target.id, 0, 0);
  const drain = (turretConfig.woodDragonSpinDrain ?? 120) * dtMs / 1000;
  target.spin = Math.max(0, target.spin - drain);
}

// ═══════════════════════════════════════════════════════════════════════════════
// OBITO UCHIHA MOVES
// ═══════════════════════════════════════════════════════════════════════════════

/** spiral_eye: Obito's Sharingan vortex — pulls all beys inward, then flings them outward. */
export function triggerSpiralEye(turretConfig: any, runtime: TurretRuntimeState, nowMs: number): void {
  runtime.spiralEyeUntilMs = nowMs + (turretConfig.spiralEyeDurationSec ?? 2.5) * 1000;
  runtime.spiralEyePhase = "pull";
}

export function processSpiralEyeTick(
  turretConfig: any, runtime: TurretRuntimeState, beyblades: Beyblade[],
  bridge: TurretProcessorBridge, nowMs: number
): void {
  if (!runtime.spiralEyeUntilMs) return;
  if (nowMs > runtime.spiralEyeUntilMs) {
    if (runtime.spiralEyePhase === "pull") {
      // transition to fling — apply outward burst to all beys
      const cx = (turretConfig.x ?? 0) * 24;
      const cy = (turretConfig.y ?? 0) * 24;
      const fling = turretConfig.spiralEyeFlingForce ?? 1600;
      for (const bey of beyblades) {
        if (!bey.isActive) continue;
        const dx = bey.x - cx; const dy = bey.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        bridge.applyForce(bey.id, (dx / dist) * fling, (dy / dist) * fling);
      }
      runtime.spiralEyePhase = "fling";
      runtime.spiralEyeUntilMs = nowMs + 200;
    } else {
      runtime.spiralEyeUntilMs = undefined;
      runtime.spiralEyePhase = undefined;
    }
    return;
  }
  if (runtime.spiralEyePhase !== "pull") return;
  // pull phase — each tick draw beys toward turret center
  const cx = (turretConfig.x ?? 0) * 24;
  const cy = (turretConfig.y ?? 0) * 24;
  const pull = turretConfig.spiralEyePullForce ?? 400;
  for (const bey of beyblades) {
    if (!bey.isActive) continue;
    const dx = cx - bey.x; const dy = cy - bey.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    bridge.applyForce(bey.id, (dx / dist) * pull, (dy / dist) * pull);
  }
}

/** phantom_pass: Obito/Tobi intangibility — target bey becomes invulnerable, then AoE burst. */
export function applyPhantomPass(turretConfig: any, runtime: TurretRuntimeState, target: Beyblade, beyblades: Beyblade[], bridge: TurretProcessorBridge, nowMs: number): void {
  runtime.phantomPassTargetId = target.id;
  runtime.phantomPassUntilMs = nowMs + (turretConfig.phantomPassDurationSec ?? 2) * 1000;
  target.invulnerable = true;
}

export function processPhantomPassTick(
  turretConfig: any, runtime: TurretRuntimeState, beyblades: Beyblade[],
  bridge: TurretProcessorBridge, nowMs: number
): void {
  if (!runtime.phantomPassTargetId || !runtime.phantomPassUntilMs) return;
  const target = beyblades.find(b => b.id === runtime.phantomPassTargetId && b.isActive);
  if (!target) { runtime.phantomPassTargetId = undefined; return; }
  if (nowMs < runtime.phantomPassUntilMs) return;
  // materialization — remove invuln and AoE burst
  target.invulnerable = false;
  const burstR = turretConfig.phantomPassBurstRadius ?? 120;
  const burstDmg = turretConfig.phantomPassBurstDamage ?? 60;
  for (const bey of beyblades) {
    if (!bey.isActive || bey.id === target.id) continue;
    const dx = bey.x - target.x; const dy = bey.y - target.y;
    if (Math.sqrt(dx * dx + dy * dy) > burstR) continue;
    bey.health = Math.max(0, bey.health - burstDmg);
    bey.damageTaken = (bey.damageTaken ?? 0) + burstDmg;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    bridge.applyForce(bey.id, (dx / dist) * 800, (dy / dist) * 800);
  }
  runtime.phantomPassTargetId = undefined;
  runtime.phantomPassUntilMs = undefined;
}

/** black_zetsu_bind: Black Zetsu body bind — immobilizes + drains health and spin per tick. */
export function triggerBlackZetsuBind(turretConfig: any, runtime: TurretRuntimeState, target: Beyblade, nowMs: number): void {
  runtime.blackZetsuTargetId = target.id;
  runtime.blackZetsuUntilMs = nowMs + (turretConfig.blackZetsuBindSec ?? 3) * 1000;
  target.controlLockedUntilMs = Math.max(target.controlLockedUntilMs ?? 0, runtime.blackZetsuUntilMs);
  target.controlLockSource = "black_zetsu_bind";
}

export function processBlackZetsuTick(
  turretConfig: any, runtime: TurretRuntimeState, beyblades: Beyblade[],
  bridge: TurretProcessorBridge, nowMs: number, dtMs: number
): void {
  if (!runtime.blackZetsuTargetId || !runtime.blackZetsuUntilMs || nowMs > runtime.blackZetsuUntilMs) {
    runtime.blackZetsuTargetId = undefined; return;
  }
  const target = beyblades.find(b => b.id === runtime.blackZetsuTargetId && b.isActive);
  if (!target) { runtime.blackZetsuTargetId = undefined; return; }
  if (bridge.setVelocity) bridge.setVelocity(target.id, 0, 0);
  const healthDrain = (turretConfig.blackZetsuDrainDps ?? 15) * dtMs / 1000;
  const spinDrain   = (turretConfig.blackZetsuSpinDrain ?? 80) * dtMs / 1000;
  target.health = Math.max(0, target.health - healthDrain);
  target.damageTaken = (target.damageTaken ?? 0) + healthDrain;
  target.spin = Math.max(0, target.spin - spinDrain);
}

/** orange_mask_dash: Tobi teleport — instantly relocates target bey to a random position. */
export function applyOrangeMaskDash(turretConfig: any, target: Beyblade, bridge: TurretProcessorBridge): void {
  const range = turretConfig.orangeMaskRange ?? 300;
  const angle = Math.random() * Math.PI * 2;
  const dist  = Math.random() * range;
  const newX  = Math.cos(angle) * dist;
  const newY  = Math.sin(angle) * dist;
  if (bridge.setVelocity) bridge.setVelocity(target.id, 0, 0);
  (target as any)._teleportX = newX;
  (target as any)._teleportY = newY;
  target.x = newX;
  target.y = newY;
  bridge.applyForce(target.id, 0, 0);
}

/** ten_tails_bijuudama: Obito's massive beast bomb — colossal explosion at turret position. */
export function applyTenTailsBijuudama(turretConfig: any, beyblades: Beyblade[], bridge: TurretProcessorBridge): void {
  const cx    = (turretConfig.x ?? 0) * 24;
  const cy    = (turretConfig.y ?? 0) * 24;
  const r     = turretConfig.tenTailsBijuudamaRadius ?? 320;
  const dmg   = turretConfig.tenTailsBijuudamaDamage ?? 1800;
  for (const bey of beyblades) {
    if (!bey.isActive) continue;
    const dx = bey.x - cx; const dy = bey.y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > r) continue;
    const fraction = 1 - dist / r;
    const hitDmg = dmg * fraction;
    bey.health = Math.max(0, bey.health - hitDmg);
    bey.damageTaken = (bey.damageTaken ?? 0) + hitDmg;
    bey.spin = Math.max(0, bey.spin * 0.2);
    const kbDist = dist || 1;
    bridge.applyKnockback(bey.id, { x: dx / kbDist, y: dy / kbDist }, 2200 * fraction);
  }
}

/** truth_seeker_orbs: 6 orbiting truth-seeking orbs deal continuous damage to nearby beys. */
export function triggerTruthSeekerOrbs(turretConfig: any, runtime: TurretRuntimeState, target: Beyblade, nowMs: number): void {
  runtime.truthSeekerTargetId = target.id;
  runtime.truthSeekerUntilMs = nowMs + (turretConfig.truthSeekerDurationSec ?? 5) * 1000;
}

export function processTruthSeekerOrbsTick(
  turretConfig: any, runtime: TurretRuntimeState, beyblades: Beyblade[],
  bridge: TurretProcessorBridge, nowMs: number, dtMs: number
): void {
  if (!runtime.truthSeekerTargetId || !runtime.truthSeekerUntilMs || nowMs > runtime.truthSeekerUntilMs) {
    runtime.truthSeekerTargetId = undefined; return;
  }
  const anchor = beyblades.find(b => b.id === runtime.truthSeekerTargetId && b.isActive);
  if (!anchor) { runtime.truthSeekerTargetId = undefined; return; }
  const orbCount  = turretConfig.truthSeekerOrbCount ?? 6;
  const orbRadius = turretConfig.truthSeekerOrbRadius ?? 40;
  const dps       = turretConfig.truthSeekerOrbDps ?? 25;
  const orbitR    = 70;
  for (let i = 0; i < orbCount; i++) {
    const angle = (nowMs / 800 + (i / orbCount) * Math.PI * 2);
    const ox = anchor.x + Math.cos(angle) * orbitR;
    const oy = anchor.y + Math.sin(angle) * orbitR;
    for (const bey of beyblades) {
      if (!bey.isActive || bey.id === anchor.id) continue;
      const dx = bey.x - ox; const dy = bey.y - oy;
      if (Math.sqrt(dx * dx + dy * dy) > orbRadius) continue;
      const hitDmg = dps * dtMs / 1000;
      bey.health = Math.max(0, bey.health - hitDmg);
      bey.damageTaken = (bey.damageTaken ?? 0) + hitDmg;
      const d = Math.sqrt(dx * dx + dy * dy) || 1;
      bridge.applyForce(bey.id, (dx / d) * 120, (dy / d) * 120);
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// RINNEGAN / PAIN PATH TECHNIQUES
// ═══════════════════════════════════════════════════════════════════════════════

/** bansho_tenin: Gravity attraction — pulls ALL beys toward the turret center. */
export function applyBanshoTenIn(turretConfig: any, beyblades: Beyblade[], bridge: TurretProcessorBridge): void {
  const cx   = (turretConfig.x ?? 0) * 24;
  const cy   = (turretConfig.y ?? 0) * 24;
  const r    = turretConfig.banshoTenInRadius ?? 350;
  const pull = turretConfig.banshoTenInForce ?? 1000;
  for (const bey of beyblades) {
    if (!bey.isActive) continue;
    const dx = cx - bey.x; const dy = cy - bey.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > r) continue;
    const fraction = 1 - dist / r;
    bridge.applyForce(bey.id, (dx / (dist || 1)) * pull * fraction, (dy / (dist || 1)) * pull * fraction);
  }
}

/** human_path: Soul rip — instantly halves target's current health. */
export function applyHumanPath(turretConfig: any, target: Beyblade): void {
  const frac = turretConfig.humanPathHealthFraction ?? 0.5;
  const removed = target.health * frac;
  target.health = Math.max(0, target.health - removed);
  target.damageTaken = (target.damageTaken ?? 0) + removed;
}

/** preta_path: Absorption — target bey reflects next incoming hit back as self-heal. */
export function applyPretaPath(turretConfig: any, runtime: TurretRuntimeState, target: Beyblade, nowMs: number): void {
  runtime.pretaPathTargetId = target.id;
  runtime.pretaPathUntilMs = nowMs + (turretConfig.pretaPathDurationSec ?? 2.5) * 1000;
  (target as any)._pretaAbsorb = true;
  (target as any)._pretaAbsorbUntilMs = runtime.pretaPathUntilMs;
}

export function processPretaPathTick(beyblades: Beyblade[], nowMs: number): void {
  for (const bey of beyblades) {
    if ((bey as any)._pretaAbsorb && nowMs > (bey as any)._pretaAbsorbUntilMs) {
      (bey as any)._pretaAbsorb = false;
      (bey as any)._pretaAbsorbUntilMs = undefined;
    }
  }
}

/** asura_path: 3-burst mechanized missile volley targeting different beys. */
export function applyAsuraPath(turretConfig: any, beyblades: Beyblade[], bridge: TurretProcessorBridge): void {
  const dmg = turretConfig.asuraPathMissileDamage ?? 40;
  const kb  = turretConfig.asuraPathMissileKnockback ?? 500;
  const active = beyblades.filter(b => b.isActive);
  const shuffled = [...active].sort(() => Math.random() - 0.5).slice(0, 3);
  const cx = (turretConfig.x ?? 0) * 24;
  const cy = (turretConfig.y ?? 0) * 24;
  for (const target of shuffled) {
    target.health = Math.max(0, target.health - dmg);
    target.damageTaken = (target.damageTaken ?? 0) + dmg;
    const dx = target.x - cx; const dy = target.y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    bridge.applyKnockback(target.id, { x: dx / dist, y: dy / dist }, kb);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// MINATO / ADVANCED NARUTO HANDLERS
// ═══════════════════════════════════════════════════════════════════════════════

/** flying_thunder_god: Minato's FTG — teleports to nearest bey and strikes instantly. */
export function applyFlyingThunderGod(turretConfig: any, beyblades: Beyblade[], bridge: TurretProcessorBridge, nowMs: number): void {
  const cx = (turretConfig.x ?? 0) * 24;
  const cy = (turretConfig.y ?? 0) * 24;
  let nearest: Beyblade | undefined;
  let nearDist = Infinity;
  for (const b of beyblades) {
    if (!b.isActive) continue;
    const dx = b.x - cx; const dy = b.y - cy;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d < nearDist) { nearDist = d; nearest = b; }
  }
  if (!nearest) return;
  const dmg = turretConfig.flyingThunderGodDamage ?? 80;
  nearest.health = Math.max(0, nearest.health - dmg);
  nearest.damageTaken = (nearest.damageTaken ?? 0) + dmg;
  const stunMs = (turretConfig.flyingThunderGodStunSec ?? 0.6) * 1000;
  nearest.controlLockedUntilMs = Math.max(nearest.controlLockedUntilMs ?? 0, nowMs + stunMs);
  nearest.controlLockSource = "flying_thunder_god";
  bridge.applyForce(nearest.id, (Math.random() - 0.5) * 600, (Math.random() - 0.5) * 600);
}

/** rasenshuriken: Naruto's wind rasen-shuriken — AoE spin devastation. */
export function applyRasenShuriken(turretConfig: any, target: Beyblade, beyblades: Beyblade[], bridge: TurretProcessorBridge): void {
  const r    = turretConfig.rasenShurikenRadius ?? 80;
  const dmg  = turretConfig.rasenShurikenDamage ?? 140;
  const drain = turretConfig.rasenShurikenSpinDrain ?? 300;
  for (const bey of beyblades) {
    if (!bey.isActive) continue;
    const dx = bey.x - target.x; const dy = bey.y - target.y;
    if (Math.sqrt(dx * dx + dy * dy) > r) continue;
    bey.health = Math.max(0, bey.health - dmg);
    bey.damageTaken = (bey.damageTaken ?? 0) + dmg;
    bey.spin = Math.max(0, bey.spin - drain);
    const d = Math.sqrt(dx * dx + dy * dy) || 1;
    bridge.applyKnockback(bey.id, { x: dx / d, y: dy / d }, 900);
  }
}

/** odama_rasengan: Giant rasengan — wide spin collision burst. */
export function applyOdamaRasengan(turretConfig: any, target: Beyblade, beyblades: Beyblade[], bridge: TurretProcessorBridge): void {
  const r   = turretConfig.odamaRasenganRadius ?? 100;
  const dmg = turretConfig.odamaRasenganDamage ?? 160;
  for (const bey of beyblades) {
    if (!bey.isActive) continue;
    const dx = bey.x - target.x; const dy = bey.y - target.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > r) continue;
    bey.health = Math.max(0, bey.health - dmg * (1 - dist / r));
    bey.damageTaken = (bey.damageTaken ?? 0) + dmg * (1 - dist / r);
    bey.spin = Math.max(0, bey.spin * 0.6);
    bridge.applyKnockback(bey.id, { x: (dx || 1) / (dist || 1), y: (dy || 1) / (dist || 1) }, 1200);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// EIGHT GATES / TAIJUTSU HANDLERS
// ═══════════════════════════════════════════════════════════════════════════════

/** eight_gates_release: Rock Lee / Guy extreme power surge — speed and damage doubled at health cost. */
export function triggerEightGates(turretConfig: any, runtime: TurretRuntimeState, target: Beyblade, nowMs: number): void {
  runtime.eightGatesTargetId = target.id;
  runtime.eightGatesUntilMs = nowMs + (turretConfig.eightGatesDurationSec ?? 4) * 1000;
  const speedMult = turretConfig.eightGatesSpeedMult ?? 2.0;
  const dmgMult   = turretConfig.eightGatesDamageMult ?? 1.8;
  (target as any)._speedScale = ((target as any)._speedScale ?? 1) * speedMult;
  (target as any)._collisionDamageMult = ((target as any)._collisionDamageMult ?? 1) * dmgMult;
  (target as any)._eightGatesSpeedMult = speedMult;
  (target as any)._eightGatesDmgMult   = dmgMult;
}

export function processEightGatesTick(turretConfig: any, runtime: TurretRuntimeState, beyblades: Beyblade[], nowMs: number, dtMs: number): void {
  if (!runtime.eightGatesTargetId || !runtime.eightGatesUntilMs) return;
  const target = beyblades.find(b => b.id === runtime.eightGatesTargetId && b.isActive);
  if (nowMs > runtime.eightGatesUntilMs) {
    if (target) {
      const sm = (target as any)._eightGatesSpeedMult ?? 1;
      const dm = (target as any)._eightGatesDmgMult ?? 1;
      (target as any)._speedScale = ((target as any)._speedScale ?? 1) / sm;
      (target as any)._collisionDamageMult = ((target as any)._collisionDamageMult ?? 1) / dm;
      (target as any)._eightGatesSpeedMult = undefined;
      (target as any)._eightGatesDmgMult   = undefined;
    }
    runtime.eightGatesTargetId = undefined; return;
  }
  if (!target) { runtime.eightGatesTargetId = undefined; return; }
  // health cost per tick
  const cost = (turretConfig.eightGatesHealthCostPerSec ?? 20) * dtMs / 1000;
  target.health = Math.max(0, target.health - cost);
  target.damageTaken = (target.damageTaken ?? 0) + cost;
}

/** evening_elephant: Guy's atmospheric pressure pillar — heavy damage AoE at target. */
export function applyEveningElephant(turretConfig: any, target: Beyblade, beyblades: Beyblade[], bridge: TurretProcessorBridge): void {
  const r   = turretConfig.eveningElephantRadius ?? 60;
  const dmg = turretConfig.eveningElephantDamage ?? 200;
  for (const bey of beyblades) {
    if (!bey.isActive) continue;
    const dx = bey.x - target.x; const dy = bey.y - target.y;
    if (Math.sqrt(dx * dx + dy * dy) > r) continue;
    bey.health = Math.max(0, bey.health - dmg);
    bey.damageTaken = (bey.damageTaken ?? 0) + dmg;
    const d = Math.sqrt(dx * dx + dy * dy) || 1;
    bridge.applyKnockback(bey.id, { x: dx / d, y: dy / d }, 1200);
  }
}

/** night_guy: Gate 8 dragon spiral — ultimate finisher, maximum single-target damage. */
export function applyNightGuy(turretConfig: any, target: Beyblade, bridge: TurretProcessorBridge): void {
  const dmg = turretConfig.nightGuyDamage ?? 600;
  const kb  = turretConfig.nightGuyKnockback ?? 3000;
  target.health = Math.max(0, target.health - dmg);
  target.damageTaken = (target.damageTaken ?? 0) + dmg;
  target.spin = Math.max(0, target.spin * 0.1);
  const angle = Math.random() * Math.PI * 2;
  bridge.applyKnockback(target.id, { x: Math.cos(angle), y: Math.sin(angle) }, kb);
}

// ═══════════════════════════════════════════════════════════════════════════════
// LEGENDARY NARUTO / OTSUTSUKI HANDLERS
// ═══════════════════════════════════════════════════════════════════════════════

/** tengai_shinsei: Madara's meteor drop — massive AoE crush from above. */
export function applyTengaiShinSei(turretConfig: any, beyblades: Beyblade[], bridge: TurretProcessorBridge): void {
  const cx  = (turretConfig.x ?? 0) * 24;
  const cy  = (turretConfig.y ?? 0) * 24;
  const r   = turretConfig.tengaiShinSeiRadius ?? 200;
  const dmg = turretConfig.tengaiShinSeiDamage ?? 500;
  for (const bey of beyblades) {
    if (!bey.isActive) continue;
    const dx = bey.x - cx; const dy = bey.y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > r) continue;
    const frac = 1 - dist / r;
    const hit  = dmg * frac;
    bey.health = Math.max(0, bey.health - hit);
    bey.damageTaken = (bey.damageTaken ?? 0) + hit;
    bey.spin = Math.max(0, bey.spin * (1 - 0.5 * frac));
    bridge.applyKnockback(bey.id, { x: (dx || 1) / (dist || 1), y: (dy || 1) / (dist || 1) }, 1800 * frac);
  }
}

/** kaguya_bones: All-Killing Ash Bones — fires multiple piercing spikes at different beys. */
export function applyKaguyaBones(turretConfig: any, beyblades: Beyblade[], bridge: TurretProcessorBridge): void {
  const count = turretConfig.kaguyaBoneCount ?? 5;
  const dmg   = turretConfig.kaguyaBoneDamage ?? 60;
  const active = beyblades.filter(b => b.isActive);
  const targets = [...active].sort(() => Math.random() - 0.5).slice(0, count);
  for (const t of targets) {
    const wasInvuln = t.invulnerable;
    t.invulnerable = false;
    t.health = Math.max(0, t.health - dmg);
    t.damageTaken = (t.damageTaken ?? 0) + dmg;
    t.invulnerable = wasInvuln;
    t.spin = Math.max(0, t.spin - 50);
    bridge.applyForce(t.id, (Math.random() - 0.5) * 400, (Math.random() - 0.5) * 400);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// BLEACH: AIZEN / BARRAGAN / GRIMMJOW HANDLERS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * kyoka_suigetsu: Aizen's Complete Hypnosis — each active bey is shown at a fake position
 * to all OTHER beys (the schema x/y are shifted by a random offset; physics body stays real).
 * Opponents chase ghost positions. On expiry, true positions are restored from saved state.
 *
 * Implementation: we store true x/y in `_kyokaRealX/Y` on the bey object and write false
 * coords into the schema. Because Colyseus syncs schema to all clients, every client renders
 * the ghost position — including the "hypnotized" bey's own client. The physics engine on the
 * server continues to use the real Matter.js body position (passed via bridge), so physics
 * remain correct. We re-sync schema back to true position when the effect expires.
 */
export function triggerKyokaSuigetsu(turretConfig: any, runtime: TurretRuntimeState, beyblades: Beyblade[], nowMs: number): void {
  runtime.kyokaSuigetsuUntilMs = nowMs + (turretConfig.kyokaSuigetsuDurationSec ?? 3) * 1000;
  const ghostRange = 200; // px offset range
  for (const bey of beyblades) {
    if (!bey.isActive) continue;
    // save real position
    (bey as any)._kyokaRealX = bey.x;
    (bey as any)._kyokaRealY = bey.y;
    // write ghost position into schema (all clients see this)
    const angle = Math.random() * Math.PI * 2;
    const dist  = (0.3 + Math.random() * 0.7) * ghostRange;
    bey.x = bey.x + Math.cos(angle) * dist;
    bey.y = bey.y + Math.sin(angle) * dist;
  }
}

export function processKyokaSuigetsuTick(turretConfig: any, runtime: TurretRuntimeState, beyblades: Beyblade[], bridge: TurretProcessorBridge, nowMs: number): void {
  if (!runtime.kyokaSuigetsuUntilMs) return;
  if (nowMs > runtime.kyokaSuigetsuUntilMs) {
    // restore all true positions
    for (const bey of beyblades) {
      if ((bey as any)._kyokaRealX !== undefined) {
        bey.x = (bey as any)._kyokaRealX;
        bey.y = (bey as any)._kyokaRealY;
        (bey as any)._kyokaRealX = undefined;
        (bey as any)._kyokaRealY = undefined;
      }
    }
    runtime.kyokaSuigetsuUntilMs = undefined;
    return;
  }
  // During effect: keep ghost coords drifting slightly to sell the illusion
  for (const bey of beyblades) {
    if (!bey.isActive || (bey as any)._kyokaRealX === undefined) continue;
    // small drift on ghost position (not physics position)
    bey.x += (Math.random() - 0.5) * 6;
    bey.y += (Math.random() - 0.5) * 6;
  }
}

/** respira: Barragan's aging aura — extreme spin decay + health damage in radius. */
export function triggerRespira(turretConfig: any, runtime: TurretRuntimeState, nowMs: number): void {
  runtime.respiraUntilMs = nowMs + (turretConfig.respiraDurationSec ?? 4) * 1000;
}

export function processRespiraTick(turretConfig: any, runtime: TurretRuntimeState, beyblades: Beyblade[], bridge: TurretProcessorBridge, nowMs: number, dtMs: number): void {
  if (!runtime.respiraUntilMs || nowMs > runtime.respiraUntilMs) { runtime.respiraUntilMs = undefined; return; }
  const cx = (turretConfig.x ?? 0) * 24;
  const cy = (turretConfig.y ?? 0) * 24;
  const r  = turretConfig.respiraRadius ?? 150;
  const spinMult = turretConfig.respiraSpinDecayMult ?? 5;
  const dps      = turretConfig.respiraDps ?? 10;
  for (const bey of beyblades) {
    if (!bey.isActive) continue;
    const dx = bey.x - cx; const dy = bey.y - cy;
    if (Math.sqrt(dx * dx + dy * dy) > r) continue;
    const spinDrain = bey.spin * spinMult * dtMs / 1000;
    bey.spin = Math.max(0, bey.spin - spinDrain);
    const hpDrain = dps * dtMs / 1000;
    bey.health = Math.max(0, bey.health - hpDrain);
    bey.damageTaken = (bey.damageTaken ?? 0) + hpDrain;
  }
}

/** desgarron: Grimmjow's 5-claw shockwave fan — arcing slashes hit multiple beys. */
export function applyDesgarron(turretConfig: any, beyblades: Beyblade[], bridge: TurretProcessorBridge): void {
  const dmg    = turretConfig.desgarronDamage ?? 80;
  const slashes = turretConfig.desgarronSlashes ?? 5;
  const cx = (turretConfig.x ?? 0) * 24;
  const cy = (turretConfig.y ?? 0) * 24;
  for (const bey of beyblades) {
    if (!bey.isActive) continue;
    const dx = bey.x - cx; const dy = bey.y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const angle = Math.atan2(dy, dx);
    const spread = Math.PI / 4;
    const hit = Math.floor(slashes * (1 - Math.min(1, Math.abs(angle) / spread)));
    if (hit <= 0) continue;
    const totalDmg = dmg * hit;
    bey.health = Math.max(0, bey.health - totalDmg);
    bey.damageTaken = (bey.damageTaken ?? 0) + totalDmg;
    bridge.applyKnockback(bey.id, { x: dx / dist, y: dy / dist }, 700 * hit);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// DRAGON BALL HANDLERS
// ═══════════════════════════════════════════════════════════════════════════════

/** kamehameha: Goku's energy wave beam — fast focused line of high damage. */
export function applyKamehameha(turretConfig: any, beyblades: Beyblade[], bridge: TurretProcessorBridge): void {
  const cx    = (turretConfig.x ?? 0) * 24;
  const cy    = (turretConfig.y ?? 0) * 24;
  const width = turretConfig.kamehamehaWidth ?? 60;
  const dmg   = turretConfig.kamehamehaDamage ?? 120;
  const range = turretConfig.kamehamehaRange ?? 400;
  // aim at nearest bey
  let nearest: Beyblade | undefined; let nearDist = Infinity;
  for (const b of beyblades) {
    if (!b.isActive) continue;
    const dd = Math.sqrt((b.x - cx) ** 2 + (b.y - cy) ** 2);
    if (dd < nearDist) { nearDist = dd; nearest = b; }
  }
  if (!nearest) return;
  const aimDx = nearest.x - cx; const aimDy = nearest.y - cy;
  const aimLen = Math.sqrt(aimDx * aimDx + aimDy * aimDy) || 1;
  const ax = aimDx / aimLen; const ay = aimDy / aimLen;
  for (const bey of beyblades) {
    if (!bey.isActive) continue;
    const toBx = bey.x - cx; const toBy = bey.y - cy;
    const proj  = toBx * ax + toBy * ay;
    if (proj < 0 || proj > range) continue;
    const perpX = toBx - ax * proj; const perpY = toBy - ay * proj;
    if (Math.sqrt(perpX * perpX + perpY * perpY) > width / 2) continue;
    bey.health = Math.max(0, bey.health - dmg);
    bey.damageTaken = (bey.damageTaken ?? 0) + dmg;
    bridge.applyKnockback(bey.id, { x: ax, y: ay }, 900);
  }
}

/** spirit_bomb: Goku's gathered energy — long charge then massive AoE explosion. */
export function triggerSpiritBomb(turretConfig: any, runtime: TurretRuntimeState, nowMs: number): void {
  runtime.spiritBombChargeUntilMs = nowMs + (turretConfig.spiritBombChargeSec ?? 3) * 1000;
  runtime.spiritBombFired = false;
}

export function processSpiritBombTick(turretConfig: any, runtime: TurretRuntimeState, beyblades: Beyblade[], bridge: TurretProcessorBridge, nowMs: number): void {
  if (!runtime.spiritBombChargeUntilMs) return;
  const cx = (turretConfig.x ?? 0) * 24;
  const cy = (turretConfig.y ?? 0) * 24;
  if (nowMs < runtime.spiritBombChargeUntilMs) {
    // charge phase — slight inward pull
    for (const bey of beyblades) {
      if (!bey.isActive) continue;
      const dx = cx - bey.x; const dy = cy - bey.y;
      const d  = Math.sqrt(dx * dx + dy * dy) || 1;
      bridge.applyForce(bey.id, (dx / d) * 80, (dy / d) * 80);
    }
    return;
  }
  if (runtime.spiritBombFired) { runtime.spiritBombChargeUntilMs = undefined; runtime.spiritBombFired = undefined; return; }
  // explosion
  const r   = turretConfig.spiritBombRadius ?? 180;
  const dmg = turretConfig.spiritBombDamage ?? 400;
  for (const bey of beyblades) {
    if (!bey.isActive) continue;
    const dx = bey.x - cx; const dy = bey.y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > r) continue;
    const frac = 1 - dist / r;
    const hit  = dmg * frac;
    bey.health = Math.max(0, bey.health - hit);
    bey.damageTaken = (bey.damageTaken ?? 0) + hit;
    bey.spin = Math.max(0, bey.spin * (1 - 0.4 * frac));
    bridge.applyKnockback(bey.id, { x: (dx || 1) / (dist || 1), y: (dy || 1) / (dist || 1) }, 1600 * frac);
  }
  runtime.spiritBombFired = true;
}

/** final_flash: Vegeta's maximum power beam — obliterates a single target. */
export function applyFinalFlash(turretConfig: any, target: Beyblade, bridge: TurretProcessorBridge): void {
  const dmg = turretConfig.finalFlashDamage ?? 200;
  const kb  = turretConfig.finalFlashKnockback ?? 1500;
  target.health = Math.max(0, target.health - dmg);
  target.damageTaken = (target.damageTaken ?? 0) + dmg;
  target.spin = Math.max(0, target.spin * 0.4);
  const angle = Math.random() * Math.PI * 2;
  bridge.applyKnockback(target.id, { x: Math.cos(angle), y: Math.sin(angle) }, kb);
}

/** death_beam: Frieza's precision death ray — instant piercing damage. */
export function applyDeathBeam(turretConfig: any, target: Beyblade): void {
  const dmg = turretConfig.deathBeamDamage ?? 90;
  const wasInvuln = target.invulnerable;
  target.invulnerable = false;
  target.health = Math.max(0, target.health - dmg);
  target.damageTaken = (target.damageTaken ?? 0) + dmg;
  target.invulnerable = wasInvuln;
  target.spin = Math.max(0, target.spin - 100);
}

// ── Illusion / Deception handlers ─────────────────────────────────────────

/** mirror_world: All beys see ghost duplicates at mirrored/offset positions. */
export function triggerMirrorWorld(turretConfig: any, runtime: TurretRuntimeState, beyblades: Beyblade[], nowMs: number): void {
  const offset = turretConfig.mirrorWorldOffsetPx ?? 180;
  runtime.mirrorWorldUntilMs = nowMs + (turretConfig.mirrorWorldDurationSec ?? 3.5) * 1000;
  for (const bey of beyblades) {
    if (!bey.isActive) continue;
    (bey as any)._mirrorRealX = bey.x;
    (bey as any)._mirrorRealY = bey.y;
    const ang = Math.random() * Math.PI * 2;
    bey.x = bey.x + Math.cos(ang) * (offset * (0.5 + Math.random() * 0.5));
    bey.y = bey.y + Math.sin(ang) * (offset * (0.5 + Math.random() * 0.5));
  }
}
export function processMirrorWorldTick(turretConfig: any, runtime: TurretRuntimeState, beyblades: Beyblade[], nowMs: number): void {
  if (!runtime.mirrorWorldUntilMs) return;
  if (nowMs > runtime.mirrorWorldUntilMs) {
    for (const bey of beyblades) {
      if ((bey as any)._mirrorRealX !== undefined) {
        bey.x = (bey as any)._mirrorRealX;
        bey.y = (bey as any)._mirrorRealY;
        (bey as any)._mirrorRealX = undefined;
        (bey as any)._mirrorRealY = undefined;
      }
    }
    runtime.mirrorWorldUntilMs = undefined;
    return;
  }
  for (const bey of beyblades) {
    if (!bey.isActive || (bey as any)._mirrorRealX === undefined) continue;
    bey.x += (Math.random() - 0.5) * 8;
    bey.y += (Math.random() - 0.5) * 8;
  }
}

/** perfect_mirage: Target bey becomes invisible (schema isActive=false) while physics body continues. */
export function applyPerfectMirage(turretConfig: any, runtime: TurretRuntimeState, target: Beyblade, nowMs: number): void {
  runtime.perfectMirageTargetId = target.id;
  runtime.perfectMirageUntilMs = nowMs + (turretConfig.perfectMirageDurationSec ?? 2.5) * 1000;
  (target as any)._mirageVisible = target.isActive;
  target.isActive = false;
}
export function processPerfectMirageTick(runtime: TurretRuntimeState, beyblades: Beyblade[], nowMs: number): void {
  if (!runtime.perfectMirageTargetId || !runtime.perfectMirageUntilMs) return;
  if (nowMs > runtime.perfectMirageUntilMs) {
    const bey = beyblades.find(b => b.id === runtime.perfectMirageTargetId);
    if (bey && (bey as any)._mirageVisible !== undefined) {
      bey.isActive = (bey as any)._mirageVisible;
      (bey as any)._mirageVisible = undefined;
    }
    runtime.perfectMirageTargetId = undefined;
    runtime.perfectMirageUntilMs = undefined;
  }
}

/** broken_reality: All beys scatter to random arena positions. */
export function applyBrokenReality(turretConfig: any, beyblades: Beyblade[], bridge: TurretProcessorBridge): void {
  const maxR = (turretConfig.brokenRealityScatterPx ?? 350);
  for (const bey of beyblades) {
    if (!bey.isActive) continue;
    const ang = Math.random() * Math.PI * 2;
    const dist = Math.random() * maxR;
    const nx = Math.cos(ang) * dist;
    const ny = Math.sin(ang) * dist;
    bey.x = nx;
    bey.y = ny;
    if (bridge.setVelocity) bridge.setVelocity(bey.id, 0, 0);
  }
}

/** phantasmal_shift: Target takes 50% less damage and is marked as ghost visual. */
export function applyPhantasmalShift(turretConfig: any, runtime: TurretRuntimeState, target: Beyblade, nowMs: number): void {
  runtime.phantasmalShiftTargetId = target.id;
  runtime.phantasmalShiftUntilMs = nowMs + (turretConfig.phantasmalShiftDurationSec ?? 3) * 1000;
  const reduction = 1 - (turretConfig.phantasmalShiftDamageReduction ?? 0.5);
  (target as any)._phantasmDamageScale = reduction;
}
export function processPhantasmalShiftTick(runtime: TurretRuntimeState, beyblades: Beyblade[], nowMs: number): void {
  if (!runtime.phantasmalShiftTargetId || !runtime.phantasmalShiftUntilMs) return;
  if (nowMs > runtime.phantasmalShiftUntilMs) {
    const bey = beyblades.find(b => b.id === runtime.phantasmalShiftTargetId);
    if (bey) (bey as any)._phantasmDamageScale = undefined;
    runtime.phantasmalShiftTargetId = undefined;
    runtime.phantasmalShiftUntilMs = undefined;
  }
}

/** genjutsu_veil: Arena-wide position drift each tick for all beys. */
export function triggerGenjutsuVeil(turretConfig: any, runtime: TurretRuntimeState, beyblades: Beyblade[], nowMs: number): void {
  runtime.genjutsuVeilUntilMs = nowMs + (turretConfig.genjutsuVeilDurationSec ?? 4) * 1000;
  for (const bey of beyblades) {
    if (!bey.isActive) continue;
    (bey as any)._veilRealX = bey.x;
    (bey as any)._veilRealY = bey.y;
  }
}
export function processGenjutsuVeilTick(turretConfig: any, runtime: TurretRuntimeState, beyblades: Beyblade[], nowMs: number): void {
  if (!runtime.genjutsuVeilUntilMs) return;
  if (nowMs > runtime.genjutsuVeilUntilMs) {
    for (const bey of beyblades) {
      if ((bey as any)._veilRealX !== undefined) {
        bey.x = (bey as any)._veilRealX;
        bey.y = (bey as any)._veilRealY;
        (bey as any)._veilRealX = undefined;
        (bey as any)._veilRealY = undefined;
      }
    }
    runtime.genjutsuVeilUntilMs = undefined;
    return;
  }
  const drift = turretConfig.genjutsuVeilDriftPx ?? 10;
  for (const bey of beyblades) {
    if (!bey.isActive || (bey as any)._veilRealX === undefined) continue;
    bey.x += (Math.random() - 0.5) * drift;
    bey.y += (Math.random() - 0.5) * drift;
  }
}

/** false_flag: Swaps rendered identity (color, label) of two random beys. */
export function triggerFalseFlag(turretConfig: any, runtime: TurretRuntimeState, beyblades: Beyblade[], nowMs: number): void {
  const active = beyblades.filter(b => b.isActive);
  if (active.length < 2) return;
  const i = Math.floor(Math.random() * active.length);
  let j = i;
  while (j === i) j = Math.floor(Math.random() * active.length);
  runtime.falseFlagPairA = active[i].id;
  runtime.falseFlagPairB = active[j].id;
  runtime.falseFlagUntilMs = nowMs + (turretConfig.falseFlagDurationSec ?? 5) * 1000;
  const tmp = active[i].color;
  active[i].color = active[j].color;
  active[j].color = tmp;
}
export function processFalseFlagTick(runtime: TurretRuntimeState, beyblades: Beyblade[], nowMs: number): void {
  if (!runtime.falseFlagUntilMs || !runtime.falseFlagPairA || !runtime.falseFlagPairB) return;
  if (nowMs > runtime.falseFlagUntilMs) {
    const a = beyblades.find(b => b.id === runtime.falseFlagPairA);
    const bx = beyblades.find(b => b.id === runtime.falseFlagPairB);
    if (a && bx) { const tmp = a.color; a.color = bx.color; bx.color = tmp; }
    runtime.falseFlagPairA = undefined;
    runtime.falseFlagPairB = undefined;
    runtime.falseFlagUntilMs = undefined;
  }
}

/** mind_fracture: Target's position is ghosted AND inputs inverted simultaneously. */
export function applyMindFracture(turretConfig: any, runtime: TurretRuntimeState, target: Beyblade, nowMs: number): void {
  runtime.mindFractureTargetId = target.id;
  runtime.mindFractureUntilMs = nowMs + (turretConfig.mindFractureDurationSec ?? 3) * 1000;
  (target as any)._mindFractureRealX = target.x;
  (target as any)._mindFractureRealY = target.y;
  (target as any)._mindFractureInvertInputs = true;
  const ang = Math.random() * Math.PI * 2;
  target.x += Math.cos(ang) * 150;
  target.y += Math.sin(ang) * 150;
}
export function processMindFractureTick(runtime: TurretRuntimeState, beyblades: Beyblade[], nowMs: number): void {
  if (!runtime.mindFractureTargetId || !runtime.mindFractureUntilMs) return;
  if (nowMs > runtime.mindFractureUntilMs) {
    const bey = beyblades.find(b => b.id === runtime.mindFractureTargetId);
    if (bey && (bey as any)._mindFractureRealX !== undefined) {
      bey.x = (bey as any)._mindFractureRealX;
      bey.y = (bey as any)._mindFractureRealY;
      (bey as any)._mindFractureRealX = undefined;
      (bey as any)._mindFractureRealY = undefined;
      (bey as any)._mindFractureInvertInputs = undefined;
    }
    runtime.mindFractureTargetId = undefined;
    runtime.mindFractureUntilMs = undefined;
    return;
  }
  const bey = beyblades.find(b => b.id === runtime.mindFractureTargetId);
  if (bey && bey.isActive) {
    bey.x += (Math.random() - 0.5) * 6;
    bey.y += (Math.random() - 0.5) * 6;
  }
}

// ── Contra bey power-up handlers ──────────────────────────────────────────

/** spread_bey: Target bey fans into 5 impact vectors on next collision. Marks the bey. */
export function applySpreadBey(turretConfig: any, target: Beyblade): void {
  (target as any)._spreadBeyCount = turretConfig.spreadBeyCount ?? 5;
  (target as any)._spreadBeyArcHalfDeg = turretConfig.spreadBeyArcHalfDeg ?? 30;
  (target as any)._spreadBeyDamage = turretConfig.spreadBeyDamage ?? 25;
  target.spin = Math.min(target.maxSpin, target.spin + target.maxSpin * 0.2);
}

/** railbey: Target bey moves at 4× speed in a straight line, piercing all beys it crosses. */
export function applyRailbey(turretConfig: any, runtime: TurretRuntimeState, target: Beyblade, beyblades: Beyblade[], bridge: TurretProcessorBridge, nowMs: number): void {
  runtime.railbeyTargetId = target.id;
  runtime.railbeyUntilMs = nowMs + (turretConfig.railbeyDurationSec ?? 1.5) * 1000;
  const speedMult = turretConfig.railbeySpeedMult ?? 4.0;
  (target as any)._railbeyActive = true;
  (target as any)._railbeySpeedMult = speedMult;
  (target as any)._railbeyPierceDmg = turretConfig.railbeyPierceDmg ?? 40;
  target.spin = Math.min(target.maxSpin, target.spin + target.maxSpin * 0.15);
  if (bridge.setVelocity) {
    const ang = Math.random() * Math.PI * 2;
    bridge.setVelocity(target.id, Math.cos(ang) * speedMult * 10, Math.sin(ang) * speedMult * 10);
  }
}
export function processRailbeyTick(runtime: TurretRuntimeState, beyblades: Beyblade[], bridge: TurretProcessorBridge, nowMs: number): void {
  if (!runtime.railbeyTargetId || !runtime.railbeyUntilMs) return;
  if (nowMs > runtime.railbeyUntilMs) {
    const bey = beyblades.find(b => b.id === runtime.railbeyTargetId);
    if (bey) {
      (bey as any)._railbeyActive = undefined;
      (bey as any)._railbeySpeedMult = undefined;
      (bey as any)._railbeyPierceDmg = undefined;
    }
    runtime.railbeyTargetId = undefined;
    runtime.railbeyUntilMs = undefined;
  }
}

/** minigun_bey: Target bey fires rapid micro-damage pulses on collision. */
export function applyMinigunBey(turretConfig: any, runtime: TurretRuntimeState, target: Beyblade, nowMs: number): void {
  runtime.minigunBeyTargetId = target.id;
  runtime.minigunBeyPulsesLeft = turretConfig.minigunBeyPulses ?? 12;
  runtime.minigunBeyNextPulseMs = nowMs + (turretConfig.minigunBeyIntervalMs ?? 60);
  (target as any)._minigunBeyDmg = turretConfig.minigunBeyDmgPerPulse ?? 8;
}
export function processMinigunBeyTick(runtime: TurretRuntimeState, beyblades: Beyblade[], bridge: TurretProcessorBridge, nowMs: number): void {
  if (!runtime.minigunBeyTargetId || !runtime.minigunBeyPulsesLeft) return;
  if (nowMs < (runtime.minigunBeyNextPulseMs ?? 0)) return;
  const shooter = beyblades.find(b => b.id === runtime.minigunBeyTargetId);
  if (!shooter || !shooter.isActive) { runtime.minigunBeyTargetId = undefined; runtime.minigunBeyPulsesLeft = 0; return; }
  const dmg = (shooter as any)._minigunBeyDmg ?? 8;
  let nearest: Beyblade | null = null;
  let nearDist = Infinity;
  for (const b of beyblades) {
    if (!b.isActive || b.id === shooter.id) continue;
    const d = (b.x - shooter.x) ** 2 + (b.y - shooter.y) ** 2;
    if (d < nearDist) { nearDist = d; nearest = b; }
  }
  if (nearest) {
    nearest.health = Math.max(0, nearest.health - dmg);
    nearest.damageTaken = (nearest.damageTaken ?? 0) + dmg;
  }
  runtime.minigunBeyPulsesLeft -= 1;
  runtime.minigunBeyNextPulseMs = nowMs + 60;
  if (runtime.minigunBeyPulsesLeft <= 0) {
    (shooter as any)._minigunBeyDmg = undefined;
    runtime.minigunBeyTargetId = undefined;
  }
}

/** heat_seeker_bey: Target bey auto-locks and rams nearest opponent. */
export function applyHeatSeekerBey(turretConfig: any, runtime: TurretRuntimeState, target: Beyblade, beyblades: Beyblade[], bridge: TurretProcessorBridge): void {
  let nearest: Beyblade | null = null;
  let nearDist = Infinity;
  for (const b of beyblades) {
    if (!b.isActive || b.id === target.id) continue;
    const d = (b.x - target.x) ** 2 + (b.y - target.y) ** 2;
    if (d < nearDist) { nearDist = d; nearest = b; }
  }
  if (!nearest) return;
  runtime.heatSeekerBeyTargetId = target.id;
  runtime.heatSeekerBeyActive = true;
  const dx = nearest.x - target.x;
  const dy = nearest.y - target.y;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  const speed = turretConfig.heatSeekerBeySpeed ?? 600;
  if (bridge.setVelocity) bridge.setVelocity(target.id, (dx / dist) * speed * 0.1, (dy / dist) * speed * 0.1);
  bridge.applyKnockback(target.id, { x: dx / dist, y: dy / dist }, speed);
  const dmg = turretConfig.heatSeekerBeyDamage ?? 70;
  nearest.health = Math.max(0, nearest.health - dmg);
  nearest.damageTaken = (nearest.damageTaken ?? 0) + dmg;
  bridge.applyKnockback(nearest.id, { x: -dx / dist, y: -dy / dist }, 800);
  runtime.heatSeekerBeyActive = false;
  runtime.heatSeekerBeyTargetId = undefined;
}

/** bomb_bey: Target bey becomes a ticking bomb — explodes on collision or fuse expiry. */
export function applyBombBey(turretConfig: any, runtime: TurretRuntimeState, target: Beyblade, nowMs: number): void {
  runtime.bombBeyTargetId = target.id;
  runtime.bombBeyDetonateMs = nowMs + (turretConfig.bombBeyFuseSec ?? 4) * 1000;
  (target as any)._bombBeyActive = true;
  (target as any)._bombBeyRadius = turretConfig.bombBeyRadius ?? 160;
  (target as any)._bombBeyDamage = turretConfig.bombBeyDamage ?? 200;
}
export function processBombBeyTick(runtime: TurretRuntimeState, beyblades: Beyblade[], bridge: TurretProcessorBridge, nowMs: number): void {
  if (!runtime.bombBeyTargetId || !runtime.bombBeyDetonateMs) return;
  if (nowMs < runtime.bombBeyDetonateMs) return;
  const bomber = beyblades.find(b => b.id === runtime.bombBeyTargetId);
  if (bomber) {
    const cx = bomber.x; const cy = bomber.y;
    const r = (bomber as any)._bombBeyRadius ?? 160;
    const dmg = (bomber as any)._bombBeyDamage ?? 200;
    for (const b of beyblades) {
      if (!b.isActive || b.id === bomber.id) continue;
      const dx = b.x - cx; const dy = b.y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > r) continue;
      const frac = 1 - dist / r;
      const hit = dmg * frac;
      b.health = Math.max(0, b.health - hit);
      b.damageTaken = (b.damageTaken ?? 0) + hit;
      bridge.applyKnockback(b.id, { x: (dx || 1) / (dist || 1), y: (dy || 1) / (dist || 1) }, 1800 * frac);
    }
    bomber.health = Math.max(0, bomber.health - dmg * 0.3);
    (bomber as any)._bombBeyActive = undefined;
    (bomber as any)._bombBeyRadius = undefined;
    (bomber as any)._bombBeyDamage = undefined;
  }
  runtime.bombBeyTargetId = undefined;
  runtime.bombBeyDetonateMs = undefined;
}

/** shield_bey: Target bey gains energy shield — blocks next hit, then detonates AoE retaliation. */
export function applyShieldBey(turretConfig: any, runtime: TurretRuntimeState, target: Beyblade): void {
  runtime.shieldBeyTargetId = target.id;
  runtime.shieldBeyActive = true;
  (target as any)._shieldBeyHp = 1;
  (target as any)._shieldBeyRetaliationDmg = turretConfig.shieldBeyRetaliationDmg ?? 80;
  (target as any)._shieldBeyBurstRadius = turretConfig.shieldBeyBurstRadius ?? 120;
  target.invulnerable = true;
}

/** turbo_bey: Target bey's spin + speed surge to near-max for duration. */
export function applyTurboBey(turretConfig: any, runtime: TurretRuntimeState, target: Beyblade, bridge: TurretProcessorBridge, nowMs: number): void {
  runtime.turboBeyTargetId = target.id;
  runtime.turboBeyUntilMs = nowMs + (turretConfig.turboBeyDurationSec ?? 5) * 1000;
  const spinBoost = turretConfig.turboBeySpinBoost ?? 0.3;
  target.spin = Math.min(target.maxSpin, target.spin + target.maxSpin * spinBoost);
  (target as any)._turboSpeedMult = turretConfig.turboBeySpeedMult ?? 1.8;
  (target as any)._turboCollisionMult = 1.5;
}
export function processTurboBeyTick(runtime: TurretRuntimeState, beyblades: Beyblade[], nowMs: number): void {
  if (!runtime.turboBeyTargetId || !runtime.turboBeyUntilMs) return;
  if (nowMs > runtime.turboBeyUntilMs) {
    const bey = beyblades.find(b => b.id === runtime.turboBeyTargetId);
    if (bey) {
      (bey as any)._turboSpeedMult = undefined;
      (bey as any)._turboCollisionMult = undefined;
    }
    runtime.turboBeyTargetId = undefined;
    runtime.turboBeyUntilMs = undefined;
  }
}

/** cannon_bey: Turret catapults the bey at max force toward the furthest opponent. */
export function applyCannonBey(turretConfig: any, target: Beyblade, beyblades: Beyblade[], bridge: TurretProcessorBridge): void {
  let furthest: Beyblade | null = null;
  let farDist = -Infinity;
  for (const b of beyblades) {
    if (!b.isActive || b.id === target.id) continue;
    const d = (b.x - target.x) ** 2 + (b.y - target.y) ** 2;
    if (d > farDist) { farDist = d; furthest = b; }
  }
  const force = turretConfig.cannonBeyForce ?? 3000;
  const dmg = turretConfig.cannonBeyDamage ?? 120;
  if (furthest) {
    const dx = furthest.x - target.x;
    const dy = furthest.y - target.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    bridge.applyKnockback(target.id, { x: dx / dist, y: dy / dist }, force);
    furthest.health = Math.max(0, furthest.health - dmg);
    furthest.damageTaken = (furthest.damageTaken ?? 0) + dmg;
    bridge.applyKnockback(furthest.id, { x: dx / dist, y: dy / dist }, 1200);
  } else {
    const ang = Math.random() * Math.PI * 2;
    bridge.applyKnockback(target.id, { x: Math.cos(ang), y: Math.sin(ang) }, force);
  }
  target.spin = Math.min(target.maxSpin, target.spin + target.maxSpin * 0.1);
}

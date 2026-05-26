import { Schema, type, MapSchema, ArraySchema, filterChildren } from "@colyseus/schema";
import { BeyGhostState } from "./BeyGhostState";
import type { Client } from "colyseus";

/**
 * Loop State - tracks which beyblades are using a loop
 */
export class LoopState extends Schema {
  @type("number") loopIndex: number = 0;
  @type("number") radius: number = 0; // em units
  @type("string") shape: string = "circle"; // circle, rectangle, etc.
  @type("number") speedBoost: number = 1.0;
  @type("number") spinBoost: number = 0;
  @type("number") frictionMultiplier: number = 1.0;
  @type(["string"]) beybladeIds = new ArraySchema<string>(); // Beyblades currently in loop
  @type("number") totalBeybladesPassed: number = 0; // Total count of beyblades that used this loop
  @type("number") lastEntryTime: number = 0;
}

/**
 * Obstacle State - tracks obstacle health and destruction
 */
export class ObstacleState extends Schema {
  @type("string") obstacleId: string = "";
  @type("number") obstacleIndex: number = 0;
  @type("string") type: string = "rock"; // rock, pillar, barrier, wall
  @type("number") x: number = 0; // em units
  @type("number") y: number = 0; // em units
  @type("number") radius: number = 1; // em units
  @type("boolean") destructible: boolean = false;
  @type("boolean") isDestroyed: boolean = false;
  @type("number") health: number = 100;
  @type("number") maxHealth: number = 100;
  @type("number") damage: number = 10; // Damage on collision
  @type("number") recoil: number = 5; // Knockback force
  @type("string") lastHitBy: string = ""; // Beyblade ID
  @type("number") lastHitTime: number = 0;
  @type("number") totalCollisions: number = 0;
  @type("number") totalDamageDealt: number = 0;
}

/**
 * Pit State - tracks which beyblade is trapped in a pit
 */
export class PitState extends Schema {
  @type("string") pitId: string = "";
  @type("number") pitIndex: number = 0;
  @type("number") x: number = 0; // em units
  @type("number") y: number = 0; // em units
  @type("number") radius: number = 1; // em units
  @type("number") damagePerSecond: number = 10; // Percentage
  @type("number") escapeChance: number = 0.5; // 0-1
  @type("string") trappedBeybladeId: string = ""; // Empty if no beyblade trapped
  @type("number") trapStartTime: number = 0;
  @type("number") totalDamageDealt: number = 0;
  @type("number") totalTraps: number = 0; // Number of times beyblades got trapped
  @type("number") totalEscapes: number = 0; // Number of successful escapes
}

/**
 * Turret State (replaces LaserGunState)
 * Supports: random, beam, periodic, aoe, boomerang attack types
 */
export class TurretState extends Schema {
  @type("string") turretId: string = "";
  @type("number") turretIndex: number = 0;
  @type("string") attackType: string = "random"; // random, beam, periodic, aoe, boomerang
  @type("number") x: number = 0; // em units
  @type("number") y: number = 0; // em units
  @type("number") currentAngle: number = 0; // Current aim angle in degrees
  @type("number") targetAngle: number = 0; // Target angle (for aiming animation)
  
  // Attack properties (vary by type)
  @type("number") damage: number = 10;
  @type("number") range: number = 20; // em units
  @type("number") cooldown: number = 2; // Seconds between attacks
  @type("number") warmupTime: number = 1; // Seconds
  
  // Type-specific properties
  @type("number") bulletSpeed: number = 10; // em/second (for bullets/missiles/boomerang)
  @type("number") beamWidth: number = 2; // em units (for beam)
  @type("number") beamDuration: number = 1; // Seconds (for beam)
  @type("number") explosionRadius: number = 5; // em units (for aoe missiles)
  @type("number") returnSpeed: number = 8; // em/second (for boomerang)
  
  // State tracking
  @type("boolean") destructible: boolean = false; // Can turret be destroyed?
  @type("boolean") isDestroyed: boolean = false;
  @type("number") health: number = 100;
  @type("number") maxHealth: number = 100;
  @type("boolean") isActive: boolean = true;
  @type("boolean") isWarming: boolean = false; // Currently aiming/warming up
  @type("boolean") isFiring: boolean = false; // Currently attacking
  @type("boolean") isReturning: boolean = false; // Boomerang is returning
  @type("number") warmupStartTime: number = 0;
  @type("number") lastFireTime: number = 0;
  @type("number") cooldownEndTime: number = 0;
  @type("string") currentTarget: string = ""; // Beyblade ID
  
  // Statistics
  @type("number") shotsFired: number = 0;
  @type("number") hitsLanded: number = 0;
  @type("number") damageDealt: number = 0;
  @type("number") boomerangReturns: number = 0; // For boomerang type
}

/**
 * Projectile State (Bullet, Missile, Boomerang, Beam)
 * Enhanced with type-specific behavior
 */
export class ProjectileState extends Schema {
  @type("string") id: string = "";
  @type("string") type: string = "bullet"; // bullet, missile, boomerang, beam
  @type("string") turretId: string = "";
  @type("number") turretIndex: number = 0;
  @type("string") targetId: string = ""; // Beyblade ID (for tracking/homing)
  @type("number") x: number = 0; // Current position (em units)
  @type("number") y: number = 0;
  @type("number") velocityX: number = 0; // em/second
  @type("number") velocityY: number = 0;
  @type("number") angle: number = 0; // Direction in degrees
  @type("number") damage: number = 0;
  @type("number") speed: number = 0; // em/second
  @type("number") spawnTime: number = 0;
  @type("number") maxLifetime: number = 5000; // 5 seconds max
  
  // Type-specific properties
  @type("number") explosionRadius: number = 0; // For missiles (AOE)
  @type("boolean") isReturning: boolean = false; // For boomerang
  @type("number") returnStartX: number = 0; // Boomerang return point
  @type("number") returnStartY: number = 0;
  @type("number") beamWidth: number = 0; // For beam attacks
  @type("number") beamEndX: number = 0; // Beam endpoint
  @type("number") beamEndY: number = 0;
  
  // State tracking
  @type("boolean") isActive: boolean = true;
  @type("boolean") hasHit: boolean = false; // Track if projectile hit something
  @type("boolean") hasExploded: boolean = false; // For missiles
  @type("string") hitBeybladeId: string = ""; // Track what it hit
  @type("number") hitCount: number = 0; // Number of hits (for piercing/multi-hit)
}

/**
 * Water Body State - tracks beyblades in water
 * Enhanced to support multiple water bodies (moat, zone, wall-based)
 */
export class WaterBodyState extends Schema {
  @type("string") waterBodyId: string = ""; // Unique ID
  @type("number") waterBodyIndex: number = 0;
  @type("string") type: string = "moat"; // moat, zone, wall-based
  @type("string") liquidType: string = "water"; // water, blood, lava, acid, oil, ice
  @type("number") spinDrainRate: number = 10; // Percentage per second
  @type("number") speedMultiplier: number = 0.7; // 0.7 = 30% slower
  @type("boolean") causesSlip: boolean = false; // Ice/oil slipperiness
  @type("number") damage: number = 0; // Lava/acid damage per second
  @type(["string"]) beybladeIds = new ArraySchema<string>(); // Beyblades currently in water
  @type("number") totalDamageDealt: number = 0; // Total spin drained
  @type("number") totalBeybladesPassed: number = 0; // Total count
}

/**
 * Portal State - tracks portal usage and cooldown
 */
export class PortalState extends Schema {
  @type("string") portalId: string = ""; // portal1 or portal2
  @type("number") portalIndex: number = 0;
  @type("number") inPointX: number = 0; // em units
  @type("number") inPointY: number = 0;
  @type("number") outPointX: number = 0;
  @type("number") outPointY: number = 0;
  @type("number") radius: number = 2; // em units
  @type("number") cooldown: number = 0; // Seconds
  @type("boolean") bidirectional: boolean = true;
  @type("boolean") isOnCooldown: boolean = false;
  @type("number") cooldownEndTime: number = 0;
  @type("string") lastUsedBy: string = ""; // Beyblade ID
  @type("number") lastUseTime: number = 0;
  @type("number") totalUses: number = 0;
}

// DEPRECATED: GoalObjectState removed in new system
// export class GoalObjectState extends Schema { ... }

/**
 * MechanicInstance — a single active mechanic on a beyblade.
 * Populated by gimmickExpander at match start from the bey's gimmickIds[].
 */
export class MechanicInstance extends Schema {
  @type("string") type: string = "";     // mechanic ID e.g. "free_spin"
  @type("string") params: string = "{}"; // JSON-serialized params
  @type("string") state: string = "{}";  // JSON-serialized runtime state
  @type("boolean") active: boolean = true;
}

/**
 * Beyblade entity - represents a single beyblade in the game
 */
export class Beyblade extends Schema {
  @type("string") id: string = "";
  @type("string") userId: string = "";
  @type("string") username: string = "";
  @type("string") beybladeId: string = "";
  @type("boolean") isAI: boolean = false;

  // Position
  @type("number") x: number = 0;
  @type("number") y: number = 0;

  // Rotation (radians)
  @type("number") rotation: number = 0;

  // Velocity
  @type("number") velocityX: number = 0;
  @type("number") velocityY: number = 0;

  // Angular velocity (spin speed)
  @type("number") angularVelocity: number = 0;

  // Stats - Full beyblade properties
  @type("string") type: string = "balanced"; // attack, defense, stamina, balanced
  @type("string") spinDirection: string = "right"; // left, right
  @type("number") mass: number = 50;
  @type("number") radius: number = 4;
  @type("number") actualSize: number = 40; // Visual size in pixels

  // Type Distribution (from BeybladeStats)
  @type("number") attackPoints: number = 120;
  @type("number") defensePoints: number = 120;
  @type("number") staminaPoints: number = 120;

  // Calculated stats from type distribution
  @type("number") damageMultiplier: number = 1.0; // Attack multiplier
  @type("number") damageTaken: number = 1.0; // Defense multiplier (lower is better)
  @type("number") knockbackDistance: number = 10; // Knockback amount
  @type("number") spinStealFactor: number = 0.1; // Spin steal percentage
  @type("number") spinDecayRate: number = 10; // Spin decay per second
  @type("number") speedBonus: number = 1.0; // Movement speed multiplier
  @type("number") invulnerabilityChance: number = 0.1; // Chance to avoid damage

  // Combat stats - Dynamic values
  @type("number") health: number = 100;
  @type("number") maxHealth: number = 100;
  @type("number") stamina: number = 100;
  @type("number") maxStamina: number = 100;
  @type("number") spin: number = 2000; // Current spin (0-maxSpin)
  @type("number") maxSpin: number = 2000; // Max spin capacity

  // Combat tracking
  @type("number") damageDealt: number = 0;
  @type("number") damageReceived: number = 0;
  @type("number") collisions: number = 0;
  @type("number") burstKillsDealt: number = 0; // Phase R: how many burst KOs this bey caused

  // Special states
  @type("boolean") isActive: boolean = true;
  @type("boolean") isRingOut: boolean = false;
  @type("boolean") isBurst: boolean = false;   // Phase R: set when eliminated by burst
  @type("string")  eliminationType: string = ""; // "ring_out" | "burst" | "spin_out" — set on elimination
  @type("boolean") isInvulnerable: boolean = false;
  @type("number") invulnerabilityTimer: number = 0;

  // Loop state
  @type("boolean") inLoop: boolean = false;
  @type("number") loopIndex: number = -1;
  @type("number") loopEntryTime: number = 0;
  @type("number") loopSpeedBoost: number = 1.0; // Current loop speed boost
  @type("number") loopSpinBoost: number = 0; // Current loop spin recovery

  // Water body state
  @type("boolean") inWater: boolean = false;
  @type("number") waterSpeedMultiplier: number = 1.0; // Speed reduction from water
  @type("number") waterSpinDrain: number = 0; // Spin drain from water

  // Pit state
  @type("boolean") inPit: boolean = false;
  @type("string") currentPitId: string = "";
  @type("number") pitDamageRate: number = 0;

  // Obstacle collision state
  @type("boolean") collidingWithObstacle: boolean = false;
  @type("string") lastObstacleId: string = "";

  // Special move cooldown
  @type("number") specialCooldown: number = 0;
  @type("number") attackCooldown: number = 0;

  // Special move active state
  @type("boolean") specialMoveActive: boolean = false;
  @type("number") specialMoveEndTime: number = 0;

  // Power meter (0-100): charged by holding space, consumed by specials/combos
  @type("number") power: number = 0;

  // Airborne state (I key / jump)
  @type("boolean") isAirborne: boolean = false;
  @type("number") airborneTimer: number = 0;
  @type("number") landingLag: number = 0;

  // Defense stance (K key)
  @type("boolean") isDefending: boolean = false;

  // Action buff timers (J/K/L key single-press buffs)
  @type("number") attackBuffTimer: number = 0;
  @type("number") defenseBuffTimer: number = 0;
  @type("number") dodgeBuffTimer: number = 0;

  // Stun / combo lock
  @type("number") stunTimer: number = 0;
  @type("boolean") comboExecuting: boolean = false;
  @type("number") comboTimer: number = 0;

  // Loss-of-control (Part 7c): set when a special move or combo executes.
  // While Date.now() < this value (ms), the input handler ignores movement/action bits.
  @type("number") controlLockedUntilMs: number = 0;
  // Source of the lock — "special" or "combo". Used by the HUD for the LOCKED reason.
  @type("string") controlLockSource: string = "";

  // Combo damage multiplier (applied during combo window)
  @type("number") comboDamageMultiplier: number = 1.0;
  @type("number") comboDamageMultiplierTimer: number = 0;

  // ── 2.5D part system fields ─────────────────────────────────────────────────
  // Special move (determined by BitBeast part). Optional — empty string means no special.
  @type("string") specialMove: string = "tactical_burst";

  // Combos attached to this beyblade (max 3). Optional — empty list = no combos.
  // Combos are detected/activated server-side; client reads this for the HUD.
  @type(["string"]) comboIds = new ArraySchema<string>();
  // Per-combo cooldown timestamps (epoch ms) — broadcast so HUD can show cooldown rings.
  @type({ map: "number" }) comboCooldowns = new MapSchema<number>();

  // ── 2.5D resolved part stats — written by applyStatModifier() / PartPhysics ─
  // These are ephemeral per-tick values; physics engine reads them each frame.
  @type("number") aggressiveness: number = 0.5;        // orbit aggressiveness (0–1)
  @type("number") gripFactor: number = 0.3;            // floor grip (0–1)
  @type("number") recoilFactor: number = 0.5;          // recoil on hit (0–1)
  @type("number") spinStealResist: number = 1.0;       // spin-steal resistance (0–1; 1=immune)
  @type("number") surfaceFriction: number = 1.0;       // floor surface friction multiplier
  @type("number") contactDamageMultiplier: number = 1.0; // CP damage multiplier
  @type("number") damageReduction: number = 1.0;       // incoming damage multiplier (lower = less damage)

  // Tip geometry (for off-center eccentric physics)
  @type("number") tipOffsetX: number = 0;   // mm
  @type("number") tipOffsetY: number = 0;   // mm

  // Gyroscopic wobble amplitude (increases as spin decays below 40%)
  @type("number") wobbleAmplitude: number = 0;

  // Sub-part spin values — keyed by attachment index (string "0", "1", etc.)
  // Independent angular momentum for each free_spin/partial_slip sub-part.
  @type({ map: "number" }) subPartSpins = new MapSchema<number>();

  // Active config name per part slot (e.g. "ar" → "Flat", "tip" → "Sharp")
  // Also keyed as "sub_part_0", "sub_part_1" for sub-part attachments.
  // New key: "spin_track" for SpinTrack config; "detached" reserved for detached sub-parts.
  @type({ map: "string" }) activePartConfigs = new MapSchema<string>();

  // Last epoch-ms a player-initiated config (mode) switch fired on a given part slot.
  // Keyed identically to activePartConfigs. Used to enforce MODE_SWITCH_COOLDOWN_MS.
  @type({ map: "number" }) configLastSwitchAt = new MapSchema<number>();

  // ── Evolution Driver ─────────────────────────────────────────────────────────
  // Index into TipPart.evolutionStages[]; advances automatically as triggers are met.
  @type("uint8")  tipEvolutionStage: number = 0;
  // Match-elapsed ms since first tick — NEVER resets between stages. Used by all
  // evolution triggers (time, wear_level, etc.) as a monotonic match clock.
  @type("number") tipEvolutionTimer: number = 0;

  // ── Split / Combined Bey (Phantom Fox MS, etc.) ──────────────────────────────
  @type("boolean") isSplit: boolean = false;
  @type("number")  splitBodyX: number = 0;
  @type("number")  splitBodyY: number = 0;
  @type("number")  splitBodySpin: number = 0;

  // ── Core Spin Injection Reserve (Rock Bison / Wolborg G) ─────────────────────
  @type("number")  coreReserveRemaining: number = 0;

  // ── Counter-Rotation Sequence State (Dranzer GT) ─────────────────────────────
  @type("boolean") counterRotActive: boolean = false;
  @type("number")  counterRotStep: number = 0;
  @type("number")  counterRotStepTick: number = 0;
  @type("string")  defaultSpinDirection: string = "right"; // saved at match start for revert

  // ── Jump Core State (distinct from existing isAirborne / airborneTimer) ───────
  @type("number")  airborneTicksRemaining: number = 0; // countdown ticks for jump-core hop
  @type("number")  jumpFacingAngle: number = 0;        // radians; direction of current/last hop

  // ── Universal Stat System (Phase B / Phase R) ────────────────────────────────
  @type("number")  jumpForce: number = 0;              // upward impulse (N) for jump actions
  @type("number")  jumpHeight: number = 0;             // max jump height ceiling (cm)
  @type("number")  burstResistance: number = 50;       // 0–100; higher = harder to burst

  // ── 2.5D Bey-Axis Tilt + Climbing (Phase E) ──────────────────────────────────
  @type("number")  beyTiltAngle: number = 0;           // 0°=vertical, 90°=on-side, 180°=on-back, 270°=on-head (airborne), 360°=full rotation; distinct from arena floor tilt
  @type("boolean") adhering: boolean = false;          // true when stuck to ceiling/overhang via suction
  @type("number")  adheringSurfaceAngle: number = 0;   // degrees: angle of surface bey sticks to
  @type("boolean") wallClimbing: boolean = false;      // true when climbing a vertical wall
  @type("number")  effectiveGravity: number = 9.8;     // resolved per tick (arenaGravity × gravityMult)

  // ── Combo Slot System (Phase C) ───────────────────────────────────────────────
  // JSON-stringified BeybladeComboSlot[] — replaces old comboIds for new system.
  // comboIds kept above for backward compat.
  @type(["string"]) comboSlots = new ArraySchema<string>();
  @type("string")  comboPhase: string = "idle";        // idle | windup | active | bleed | cooldown
  @type("number")  specialMoveTick: number = 0;        // tick within current special move execution
  @type("number")  comboChargeScale: number = 0;       // 0=not charging; 0–1=charge progress for charged combos

  // ── Combination Lock (Phase F) ────────────────────────────────────────────────
  @type("boolean") combinationLocked: boolean = false;
  @type("string")  linkedBeyId: string = "";           // session id of combination partner
  @type("string")  combinationType: string = "";       // stack | helical | tandem | cluster
  @type("number")  linkStrain: number = 0;             // 0–1, approaches 1 before breaking

  // ── Element Type System (Phase AB) ───────────────────────────────────────────
  @type(["string"]) elementTypes = new ArraySchema<string>(); // 1–2 ElementType values

  // ── Gimmick / Mechanic instances (populated from gimmickIds[] at match start) ──
  @type([MechanicInstance]) mechanics = new ArraySchema<MechanicInstance>();

  // ── Gear/Rail state (BX Xtreme Dash) ────────────────────────────────────────
  @type("boolean") gearCompatibleBit: boolean = false;
  @type("boolean") xtremeEngaged: boolean = false;
  @type("float32") xtremeRailProgress: number = 0;
  @type("string")  xtremeRailId: string = "";

  // ── Engine Gear boost reserve ────────────────────────────────────────────────
  @type("float32") egBoostOmega: number = 0;

  // ── Burst pressure (tracks accumulated impact before burst trigger) ──────────
  @type("float32") burstPressure: number = 0;

  // ── Material Wear Level (synced — drives client tint) ────────────────────────
  @type("float32") materialWearLevel: number = 100; // 0=fully worn, 100=new; computed from wearSchedule in PartSystemManager

  // ── Physics flags (Block M) ──────────────────────────────────────────────────
  @type("boolean") collisionWithBeys: boolean = true;
  @type("boolean") collisionWithArena: boolean = true;
  @type("boolean") collisionWithObstacles: boolean = true;
  @type("boolean") invulnerable: boolean = false;
  @type("boolean") noKnockback: boolean = false;
  @type("boolean") noDamageOutput: boolean = false;
  @type("int8")    beyFloorIndex: number = 0;
  @type("string")  teamId: string = "";

  // ── Collision Types (Block CT) ────────────────────────────────────────────────
  // Damage-layer flags — these drive BattleRoom logic, not Matter.js masks.
  @type("boolean") collidesWithObstacles: boolean = true;    // receives damage from obstacle hits
  @type("boolean") collidesWithArena: boolean = true;         // receives wall-bounce damage
  @type("boolean") collidesWithProjectiles: boolean = true;   // receives turret projectile damage
  @type("boolean") friendlyCollisionEnabled: boolean = false; // same-team: recoil only, no damage/spin-steal

  // ── Phasing (Block P) ─────────────────────────────────────────────────────────
  // Passes through the category entirely — no physics response and no damage.
  @type("boolean") phasesObstacles: boolean = false;    // ghost through obstacles
  @type("boolean") phasesArenaBounds: boolean = false;  // ignore boundary (no ring-out)
  @type("boolean") phasesBeys: boolean = false;         // ghost through all other beys
  @type("boolean") phasesProjectiles: boolean = false;  // turret projectiles pass through

  // ── Immunity (Block IM) ───────────────────────────────────────────────────────
  // Permanent flags — distinct from i-frame isInvulnerable timer.
  @type("boolean") damageImmune: boolean = false;    // all incoming damage zeroed
  @type("boolean") ringOutImmune: boolean = false;   // ring-out check skipped
  @type("boolean") burstImmune: boolean = false;     // burst roll never fires
  @type("boolean") spinOutImmune: boolean = false;   // spin ≤ 0 does not eliminate
  @type("boolean") knockoutImmune: boolean = false;  // shorthand: implies ringOut+burst+spinOut immune

  // ── Per-beyblade rendering color (hex, e.g. "#00d4ff") ──────────────────────
  @type("string") color: string = "";

  // ── Launch phase (pre-match) ─────────────────────────────────────────────────
  @type("float32") launchTilt: number = 0;            // -45 to +45 deg; A/D during launch phase
  @type("float32") launchPosition: number = 0.5;      // 0=forward/defensive, 1=backward/aggressive
  @type("float32") launchPower: number = 0;           // 0–150% of maxSpin (charged by holding Space)
  @type("boolean") launchChargingStarted: boolean = false; // true once Space held → pos/tilt locked
  @type("boolean") launchReady: boolean = false;      // true when player releases Space (launched)
  @type("boolean") launchFailed: boolean = false;     // true if timer expired without launch → auto-loss

  // ── Phase 24 semi-autonomous control ─────────────────────────────────────────
  // 0–100: current player-authority blend (0=full AI/natural, 100=full player).
  // Broadcast so the client ControlBlendBar HUD can read it.
  @type("uint8")   controlAuthority: number = 100;
  // True while a clash QTE is running (collision tier 3 close-contact lock).
  @type("boolean") clashQTEActive: boolean = false;
  // Seconds remaining in the active clash QTE window (0 when inactive).
  @type("float32") clashQTETimer: number = 0;

  // ── Phase 29: Collision QTE Power Meter ───────────────────────────────────
  @type("boolean") collisionQTEActive: boolean = false;
  @type("number")  collisionQTEPower: number = 0;   // 0–150 (integer %)

  // ── Phase 29: Airborne Z-Axis (independent of jump-core isAirborne) ───────
  @type("number")  beyHeight: number = 0;            // px above arena floor (0=grounded)
  @type("number")  beyVerticalVel: number = 0;       // upward velocity px/ms; decays by effectiveGravity
  @type("boolean") beyAirborne: boolean = false;     // true while beyHeight > 0

  // ── Phase 29: Multi-Phase Special Move Tracking ───────────────────────────
  @type("number")  specialPhaseIndex: number = 0;    // current phase in phases[]
  @type("number")  specialPhaseElapsed: number = 0;  // ms elapsed in current phase
  @type("string")  specialPhaseSubState: string = "";// "windup"|"active"|"winddown"
}

/**
 * DetachedBody — projectile, mini-bey, or fragment spawned from a SubPart detachment.
 * Three-state lifecycle: projectile → obstacle → removed.
 * Synced to all clients; Matter.js body managed server-side.
 */
export class DetachedBodySchema extends Schema {
  // Identity
  @type("string") id: string = "";
  @type("string") bodyType: string = "projectile"; // 'projectile' | 'mini_bey' | 'fragment'
  @type("string") state: string = "projectile";    // 'projectile' | 'obstacle' | 'removed'
  @type("string") ownerSessionId: string = "";

  // Physics position (synced from Matter.js body each tick)
  @type("number") x: number = 0;
  @type("number") y: number = 0;
  @type("number") velocityX: number = 0;
  @type("number") velocityY: number = 0;
  @type("number") angle: number = 0;
  @type("number") radius: number = 10;
  @type("number") mass: number = 3;

  // mini_bey only — own spin (decays independently)
  @type("number") spin: number = 0;
  @type("number") maxSpin: number = 1000;
  @type("number") spinDecayRate: number = 0.003;

  // State transition thresholds (set at spawn time, read-only after)
  @type("number") obstacleSpeedThreshold: number = 2;   // speed below which state→obstacle
  @type("number") spinOutThreshold: number = 100;       // spin below which mini_bey→obstacle
  @type("number") fragmentLifetimeTicks: number = 0;    // 0 = no time limit
  @type("number") fragmentAge: number = 0;              // incremented each tick for fragments
}

/**
 * Arena state - represents the battle arena
 */
export class ArenaState extends Schema {
  @type("string") id: string = "";
  @type("string") name: string = "";
  @type("number") width: number = 800;
  @type("number") height: number = 600;
  @type("string") shape: string = "circle";
  @type("string") theme: string = "metrocity";
  @type("number") rotation: number = 0;

  // Rotation control (Part 4 of camera/feature overhaul)
  @type("boolean") autoRotate: boolean = false;
  @type("number") rotationSpeed: number = 0;          // degrees per second
  @type("string") rotationDirection: string = "clockwise"; // "clockwise" | "counterclockwise"
  @type("number") rotationPivotX: number = 0;         // cm from arena center
  @type("number") rotationPivotY: number = 0;         // cm from arena center

  // Tilt (Z-axis) — 0=flat, 90=wall-ride, 180=inverted, 270=wall-ride-back
  // tiltMode: "fixed" | "oscillate" | "weight" (stored as string for Colyseus)
  @type("number") tiltAngle: number = 0;
  @type("number") tiltDirection: number = 0;
  @type("string") tiltMode: string = "fixed";
  @type("boolean") autoTilt: boolean = false;
  @type("number") tiltSpeed: number = 0;
  @type("number") tiltPivotX: number = 0;             // cm from arena center
  @type("number") tiltPivotY: number = 0;             // cm from arena center
  // Oscillation state (tiltMode === "oscillate")
  @type("number") tiltOscillateMin: number = 0;
  @type("number") tiltOscillateMax: number = 0;
  @type("number") tiltOscillatePeriodMs: number = 4000;
  @type("number") tiltPhaseMs: number = 0;            // internal oscillation clock (ms)

  // Physics modifiers
  @type("number") gravity: number = 0;
  @type("number") airResistance: number = 0.01;
  @type("number") surfaceFriction: number = 0.1;

  // Wall configuration
  @type("boolean") wallEnabled: boolean = true;
  @type("number") wallBaseDamage: number = 5;
  @type("number") wallRecoilDistance: number = 2;
  @type("boolean") wallHasSpikes: boolean = false;
  @type("number") wallSpikeDamageMultiplier: number = 1.0;
  @type("boolean") wallHasSprings: boolean = false;
  @type("number") wallSpringRecoilMultiplier: number = 1.0;

  // Bowl profile — 0=flat/vertical wall, 75=steep cup shape
  // Steeper bowl redirects beys more forcefully toward center on wall contact.
  @type("number") wallAngle: number = 0;

  // Arena features counts (for client display)
  @type("number") speedPathCount: number = 0; // Updated from loopCount
  @type("number") loopCount: number = 0; // Alias for backward compatibility
  @type("number") obstacleCount: number = 0;
  @type("number") pitCount: number = 0;
  @type("number") turretCount: number = 0; // Updated from laserGunCount
  @type("number") waterBodyCount: number = 0; // Multiple water bodies now
  @type("number") portalCount: number = 0;

  // ── Arena Shrink (Phase V) ────────────────────────────────────────────────────
  @type("number") effectiveRadius: number = 0;    // 0 = use full arena radius; set during shrink

  // ── Scoring mode (BX points / elimination) ──────────────────────────────────
  @type("string") scoringMode: string = "elimination"; // "elimination" | "points"
  @type("uint8")  pointsTarget: number = 0;            // 0 = no target (timed)
  @type("boolean") hasZeroG: boolean = false;

  // ── Collision Config (Block CC) ───────────────────────────────────────────────
  // Arena-wide damage multipliers applied on top of per-bey collision values.
  @type("number") arenaWallDamageMult: number = 1.0;       // multiplier on wall-contact damage
  @type("number") arenaObstacleDamageMult: number = 1.0;   // multiplier on obstacle-contact damage
  @type("number") arenaBeyDamageMult: number = 1.0;        // multiplier on bey-vs-bey collision damage
  @type("number") arenaProjectileDamageMult: number = 1.0; // multiplier on turret projectile damage
  @type("boolean") arenaFriendlyFireEnabled: boolean = true; // false → same-team beys always use recoil-only
  @type("boolean") arenaPhaseObstacles: boolean = false;   // all beys phase obstacles (arena-wide override)

  // ── Phase 28 Renderer Mode ────────────────────────────────────────────────────
  // "2d" | "2.5d" | "3d" — drives RendererFactory on the client.
  @type("string") rendererMode: string = "2.5d";

  // ── Phase 25 Safe Zone (Battle Royale) ───────────────────────────────────────
  @type("float32") safeZoneRadius: number = 0;
  @type("float32") safeZoneX:      number = 0;
  @type("float32") safeZoneY:      number = 0;
  @type("float32") safeZoneTimer:  number = 0;
  @type("uint8")   safeZonePhase:  number = 0;

  // ── World Background (visual-only, synced once on join) ─────────────────────
  // Rendered behind the arena/stadium — independent of the arena floor/theme.
  @type("string")  worldBgType:     string = "none";   // "none" | "color" | "image"
  @type("string")  worldBgColor:    string = "";        // hex color e.g. "#1a2a3a"
  @type("string")  worldBgImageUrl: string = "";        // Firebase Storage URL
  @type("float32") worldBgOpacity:  number = 1.0;       // 0–1
  @type("string")  worldBgFit:      string = "cover";   // "cover" | "contain" | "stretch"
  @type("float32") worldBgBlurPx:   number = 0;         // Gaussian blur radius in px
}

/**
 * Main game state - synchronizes between server and clients
 */
// AoI filter: 1 cm = 24 px; inner zone radius = 60 cm = 1440 px.
const AoI_INNER_PX = 60 * 24;

export class GameState extends Schema {
  // Phase 27: only send each beyblade to clients whose own bey is ≤60cm away
  // AND on the same floor. Spectators have no beyblade — they receive all.
  @filterChildren(function(
    this: GameState,
    client: Client,
    key: string,
    value: Beyblade,
    root: GameState,
  ): boolean {
    const myBey = root.beyblades.get(client.sessionId);
    if (!myBey) return true; // spectator — see everything
    const dx = value.x - myBey.x;
    const dy = value.y - myBey.y;
    const distSq = dx * dx + dy * dy;
    const floor = value.beyFloorIndex;
    const myFloor = myBey.beyFloorIndex;
    return distSq <= AoI_INNER_PX * AoI_INNER_PX && floor === myFloor;
  })
  @type({ map: Beyblade }) beyblades = new MapSchema<Beyblade>();
  @type(ArenaState) arena = new ArenaState();

  // DetachedBody map — projectiles, mini-beys, fragments spawned from SubPart detachments.
  // Keyed by DetachedBodySchema.id (UUID). Cleaned up when state = 'removed'.
  @type({ map: DetachedBodySchema }) detachedBodies = new MapSchema<DetachedBodySchema>();

  // Arena feature states (UPDATED)
  @type({ map: LoopState }) loops = new MapSchema<LoopState>(); // Speed paths (backward compatible)
  @type({ map: ObstacleState }) obstacles = new MapSchema<ObstacleState>();
  @type({ map: PitState }) pits = new MapSchema<PitState>();
  @type({ map: TurretState }) turrets = new MapSchema<TurretState>(); // Updated from laserGuns
  @type({ map: ProjectileState }) projectiles = new MapSchema<ProjectileState>();
  @type({ map: WaterBodyState }) waterBodies = new MapSchema<WaterBodyState>(); // Multiple water bodies
  @type({ map: PortalState }) portals = new MapSchema<PortalState>();

  @type("string") status: string = "waiting"; // waiting, warmup, launching, in-progress, finished, series-finished
  @type("string") winner: string = ""; // userId of winner
  @type("number") timer: number = 180; // seconds (warmup countdown during warmup; match timer during in-progress)
  @type("float32") launchTimer: number = 5; // seconds remaining in launch phase
  @type("number") startTime: number = 0;

  // Match metadata
  @type("string") mode: string = "tryout"; // tryout, single-battle-ai, single-battle-pvp
  @type("string") matchId: string = "";

  // Tournament metadata (populated for tournament_battle_room)
  @type("string") tournamentId: string = "";
  @type("string") tournamentName: string = "";
  @type("uint16") roundNumber: number = 0;
  @type("string") tournamentMatchId: string = "";

  // Spectator tracking
  @type("uint16") spectatorCount: number = 0;

  // Series format (BO1 / BO3 / BO5) — used by all room types
  @type("uint8") currentGame: number = 1;
  @type("uint8") targetWins: number = 1;   // 1=BO1, 2=BO3, 3=BO5
  @type({ map: "uint8" }) seriesWins = new MapSchema<number>();
  @type("string") seriesLeader: string = "";

  // ── Round Modifiers (Phase X) ─────────────────────────────────────────────────
  @type(["string"]) activeModifierIds = new ArraySchema<string>();

  // ── BX / Points scoring ──────────────────────────────────────────────────────
  @type({ map: "uint8" }) playerPoints = new MapSchema<number>();

  // ── Phase 27 Tiered AoI — lightweight ghost state for 60–100cm zone ─────────
  // Populated by all battle rooms at 10Hz. Minimap reads ONLY from here.
  @type({ map: BeyGhostState }) beyGhosts = new MapSchema<BeyGhostState>();
}

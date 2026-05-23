# Phase 20 — Code Generation

> Stage 20 | Source: phase-19-impl-plan.md (42 tasks + Block M addendum)
> Purpose: Exact code for every file change, in dependency order.
> All file paths verified against the live repo layout.
>
> IMPORTANT FILE PATH CORRECTIONS vs phase-19 plan:
> - COLLECTIONS constant lives in `server/constants/collections.ts` (not client/src/lib/firebase.ts)
> - GameState schema lives at `server/rooms/schema/GameState.ts` (confirmed)
> - InputHandler.ts already exists at `server/shared/rooms/InputHandler.ts` — Block L is DONE
> - PhysicsEngine at `server/physics/PhysicsEngine.ts`
> - ArenaFeatureProcessor at `server/shared/rooms/ArenaFeatureProcessor.ts`

---

## Block A — TypeScript Type Additions

**File**: `shared/types/arenaConfigNew.ts`

### A1 — Add "rectangle" to ArenaShape

Find the `ArenaShape` union (currently ends at `"star8"`). Append:

```typescript
  | "rectangle";  // Gen1 Infinity Stadium, Robert's Olympia Coliseum
```

### A2 — Add new PitType values

Find:
```typescript
export type PitType = "edge" | "crater";
```
Replace with:
```typescript
export type PitType = "edge" | "crater" | "penalty_well" | "xtreme_zone" | "over_zone" | "spike_pit";
```

### A3–A6 — New interfaces (add after existing `SpinZoneConfig` or `BumpConfig`, before `ArenaConfig`)

```typescript
// ============================================================================
// GEAR RAIL (Xtreme Stadium — BX)
// ============================================================================

export interface GearRailConfig {
  id: string;
  /** Ordered polyline of waypoints in cm relative to arena center. */
  polylineCm: Array<{ x: number; y: number }>;
  /** Speed boost applied while on rail, as per-mille of max speed (e.g. 350 = 35% boost). */
  speedBoostPermille: number;
  /** If true, only beys with gearCompatibleBit=true can use this rail. */
  requiresGearCompatibleBit?: boolean;
  /** Duration of the boost after exiting the rail (ms). Default 400. */
  boostDurationMs?: number;
  /** ScoringZone ids that this rail can feed into. */
  exitZoneIds?: string[];
  color?: string;
}

// ============================================================================
// SCORING ZONES (BX point differential)
// ============================================================================

export interface ScoringZoneConfig {
  id: string;
  /** Kind determines point value override vs the points field. */
  kind: "xtreme" | "over" | "pocket" | "ring_out";
  x_cm: number;
  y_cm: number;
  radius_cm: number;
  /** Points awarded when a bey exits through this zone. */
  points: number;
  color?: string;
}

// ============================================================================
// TORNADO RIDGE (MFB / Tornado Stall terrain)
// ============================================================================

export interface TornadoRidgeConfig {
  /** Radius of the ridge ring from arena center (cm). */
  radiusCm: number;
  /** Width of the ridge band (cm). Default 4. */
  widthCm?: number;
  /** Tangential orbit force applied to beys on the ridge (per-tick, px). Default 0.003. */
  orbitIntensity?: number;
  /** CCW or CW direction. Default "cw". */
  direction?: "cw" | "ccw";
  /** Spin boost percent per second for beys on the ridge. Default 2. */
  spinBoostPercent?: number;
}

// ============================================================================
// ZERO-G (Zero-G Stadium dynamic tilt)
// ============================================================================

export interface ZeroGConfig {
  /** Tilt period in ms — how long one full cycle takes. Default 8000. */
  tiltPeriodMs?: number;
  /** Maximum tilt angle in degrees. Default 15. */
  maxTiltDeg?: number;
  /** Gravity scale when fully tilted (0 = weightless at peak). Default 0.2. */
  minGravityScale?: number;
  /** Whether the tilt axis rotates over time. Default true. */
  rotatingAxis?: boolean;
}
```

### A7 — Add new fields to ArenaConfig

Find the `pits:` field line in the `ArenaConfig` interface. After the existing `bumps?: BumpConfig[];` field add:

```typescript
  // ── BX / Gen4 features ──────────────────────────────────────────────────────
  gearRails?: GearRailConfig[];
  scoringZones?: ScoringZoneConfig[];
  tornadoRidge?: TornadoRidgeConfig;
  zeroG?: ZeroGConfig;
  /** Per-arena stamina drain multiplier (1.0 = default). Higher = faster spin loss. */
  staminaDrainMultiplier?: number;
```

**Verification**: `npx tsc --noEmit` — no errors on arenaConfigNew.ts.

---

## Block B — Colyseus Schema Additions

**File**: `server/rooms/schema/GameState.ts`

### B1 — Add MechanicInstance class

Insert before the `Beyblade` class (around line 186):

```typescript
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
```

### B2–B8 — Add fields to `Beyblade` class

At the end of the `Beyblade` class (after `elementTypes` array, around line 396), add:

```typescript
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

  // ── Physics flags (Block M) ──────────────────────────────────────────────────
  @type("boolean") collisionWithBeys: boolean = true;
  @type("boolean") collisionWithArena: boolean = true;
  @type("boolean") collisionWithObstacles: boolean = true;
  @type("boolean") invulnerable: boolean = false;
  @type("boolean") noKnockback: boolean = false;
  @type("string")  teamId: string = "";
```

### B9–B11 — Add fields to `ArenaState` class

At the end of `ArenaState` (after `effectiveRadius`, around line 478), add:

```typescript
  // ── Scoring mode (BX points / elimination) ──────────────────────────────────
  @type("string") scoringMode: string = "elimination"; // "elimination" | "points"
  @type("uint8")  pointsTarget: number = 0;            // 0 = no target (timed)
  @type("boolean") hasZeroG: boolean = false;
```

### B12 — Add playerPoints to `GameState` class

At the end of `GameState` (after the existing series-format fields), add:

```typescript
  // ── BX / Points scoring ──────────────────────────────────────────────────────
  @type({ map: "uint8" }) playerPoints = new MapSchema<number>();
```

**Verification**: `npm run dev:server` starts without schema serialization error.

---

## Block C — COLLECTIONS Additions

**File**: `server/constants/collections.ts`

Add the following keys to `SHARED_COLLECTIONS` (before the closing `} as const`):

```typescript
  MECHANIC_DEFS: "mechanic_defs",
  GIMMICK_DEFS: "gimmick_defs",
  COMBO_EFFECTS: "combo_effects",
  CAMERA_PROFILES: "camera_profiles",
  AUDIO_PROFILES: "audio_profiles",
  SCRIPT_DEFINITIONS: "script_definitions",
  COMPOSITION_BLOCKS: "composition_blocks",
  AI_BATTLES: "ai_battles",
```

**Verification**: `COLLECTIONS.MECHANIC_DEFS` resolves to `"mechanic_defs"` in TypeScript.

---

## Block D — MechanicRegistry + Handler Files

### D1 — Create `server/physics/MechanicRegistry.ts`

**New file** — full content:

```typescript
import type { Beyblade } from "../rooms/schema/GameState";

export interface MechanicContext {
  bey: Beyblade;
  opponentId?: string;
  opponent?: Beyblade;
  dt: number;
  applyForce: (id: string, fx: number, fy: number) => void;
  applyKnockback: (id: string, dir: { x: number; y: number }, dist: number) => void;
  setVelocity?: (id: string, vx: number, vy: number) => void;
  getPosition?: (id: string) => { x: number; y: number } | null;
}

export interface MechanicHandler {
  onActivate?: (ctx: MechanicContext, params: Record<string, unknown>) => void;
  tick?: (ctx: MechanicContext, params: Record<string, unknown>, state: Record<string, unknown>) => void;
  onCollision?: (ctx: MechanicContext, params: Record<string, unknown>) => void;
  passive?: (ctx: MechanicContext, params: Record<string, unknown>) => void;
}

// Populated by registerMechanic() calls from each handler file
const REGISTRY: Record<string, MechanicHandler> = {};

export function registerMechanic(id: string, handler: MechanicHandler): void {
  REGISTRY[id] = handler;
}

export function getMechanic(id: string): MechanicHandler | undefined {
  return REGISTRY[id];
}

export function dispatchBehaviorRef(
  behaviorRef: { behaviorId: string; params?: Record<string, unknown> },
  ctx: MechanicContext,
): void {
  // behaviorId format: "<namespace>.<mechanicId>" e.g. "factor.attack_amplifier"
  const parts = behaviorRef.behaviorId.split(".");
  const mechanicId = parts[parts.length - 1];
  const handler = REGISTRY[mechanicId];
  if (!handler) {
    console.warn(`[MechanicRegistry] No handler for "${behaviorRef.behaviorId}" (mechanicId="${mechanicId}")`);
    return;
  }
  handler.onActivate?.(ctx, behaviorRef.params ?? {});
}

// Auto-register all mechanic handlers
import "./mechanics/energyReserve";
import "./mechanics/velocityBurst";
import "./mechanics/attackAmplifier";
import "./mechanics/freeSpin";
import "./mechanics/spinTransfer";
import "./mechanics/spinEqualization";
import "./mechanics/rotationReverse";
import "./mechanics/spinThresholdSwitch";
import "./mechanics/modeSwitch";
import "./mechanics/rubberGrip";
import "./mechanics/contactDeflect";
import "./mechanics/springRecoil";
import "./mechanics/weightShift";
import "./mechanics/spinStealCoupling";
import "./mechanics/railLock";
import "./mechanics/centerPull";
import "./mechanics/bearingDrift";
import "./mechanics/burstSuppress";
import "./mechanics/staminaRecovery";
import "./mechanics/surfaceFrictionModifier";
import "./mechanics/orbitMovement";
import "./mechanics/upperLaunch";
import "./mechanics/smashImpact";
import "./mechanics/barrageHit";
import "./mechanics/zeroGFloat";
import "./mechanics/magneticPull";
import "./mechanics/contactHeightGate";
import "./mechanics/spinDirectionBonus";
import "./mechanics/subPartBurst";
import "./mechanics/defenseStance";
import "./mechanics/revivalSpin";
```

### D2 — Create `server/physics/mechanics/` directory — 31 handler files

Each file follows the same pattern. Below are the full implementations for all 31.

**`server/physics/mechanics/energyReserve.ts`**
```typescript
import { registerMechanic } from "../MechanicRegistry";
registerMechanic("energy_reserve", {
  tick(ctx, params, state) {
    const { rechargeRate = 0.5, maxReserve = 100 } = params as any;
    const s = state as any;
    s.reserve = Math.min((s.reserve ?? 0) + rechargeRate * ctx.dt, maxReserve);
  },
  onActivate(ctx, params) {
    const { spinBoost = 200 } = params as any;
    ctx.bey.spin = Math.min(ctx.bey.spin + spinBoost, ctx.bey.maxSpin);
  },
});
```

**`server/physics/mechanics/velocityBurst.ts`**
```typescript
import { registerMechanic } from "../MechanicRegistry";
registerMechanic("velocity_burst", {
  onActivate(ctx, params) {
    const { forceX = 0.05, forceY = 0 } = params as any;
    ctx.applyForce(ctx.bey.id, forceX, forceY);
    ctx.bey.spin = Math.min(ctx.bey.spin + 100, ctx.bey.maxSpin);
  },
});
```

**`server/physics/mechanics/attackAmplifier.ts`**
```typescript
import { registerMechanic } from "../MechanicRegistry";
registerMechanic("attack_amplifier", {
  passive(ctx, params) {
    const { multiplier = 1.25 } = params as any;
    ctx.bey.damageMultiplier *= multiplier;
  },
});
```

**`server/physics/mechanics/freeSpin.ts`**
```typescript
import { registerMechanic } from "../MechanicRegistry";
registerMechanic("free_spin", {
  tick(ctx, params) {
    // Free-spinning tip: suppress recoil — reduce velocityX/Y toward zero less aggressively
    const { decayReduction = 0.5 } = params as any;
    ctx.bey.spinDecayRate *= (1 - decayReduction);
  },
});
```

**`server/physics/mechanics/spinTransfer.ts`**
```typescript
import { registerMechanic } from "../MechanicRegistry";
registerMechanic("spin_transfer", {
  onCollision(ctx, params) {
    const opp = ctx.opponent;
    if (!opp) return;
    const { transferRate = 0.15 } = params as any;
    const transfer = opp.spin * transferRate;
    opp.spin -= transfer;
    ctx.bey.spin = Math.min(ctx.bey.spin + transfer, ctx.bey.maxSpin);
  },
});
```

**`server/physics/mechanics/spinEqualization.ts`**
```typescript
import { registerMechanic } from "../MechanicRegistry";
registerMechanic("spin_equalization", {
  onCollision(ctx, params) {
    const opp = ctx.opponent;
    if (!opp) return;
    const avg = (ctx.bey.spin + opp.spin) / 2;
    const { rate = 0.3 } = params as any;
    ctx.bey.spin += (avg - ctx.bey.spin) * rate;
    opp.spin += (avg - opp.spin) * rate;
  },
});
```

**`server/physics/mechanics/rotationReverse.ts`**
```typescript
import { registerMechanic } from "../MechanicRegistry";
registerMechanic("rotation_reverse", {
  onActivate(ctx) {
    ctx.bey.spinDirection = ctx.bey.spinDirection === "right" ? "left" : "right";
  },
});
```

**`server/physics/mechanics/spinThresholdSwitch.ts`**
```typescript
import { registerMechanic } from "../MechanicRegistry";
registerMechanic("spin_threshold_switch", {
  tick(ctx, params) {
    const { threshold = 0.4, boostOnLow = 0.5 } = params as any;
    const stability = ctx.bey.spin / ctx.bey.maxSpin;
    if (stability < threshold) {
      ctx.bey.damageMultiplier += boostOnLow * ctx.dt;
    }
  },
});
```

**`server/physics/mechanics/modeSwitch.ts`**
```typescript
import { registerMechanic } from "../MechanicRegistry";
registerMechanic("mode_switch", {
  onActivate(ctx, params) {
    const { targetMode = "attack" } = params as any;
    ctx.bey.type = targetMode;
  },
});
```

**`server/physics/mechanics/rubberGrip.ts`**
```typescript
import { registerMechanic } from "../MechanicRegistry";
registerMechanic("rubber_grip", {
  onCollision(ctx, params) {
    const opp = ctx.opponent;
    if (!opp) return;
    const { extraSpinSteal = 0.1 } = params as any;
    const steal = opp.spin * extraSpinSteal;
    opp.spin -= steal;
    ctx.bey.spin = Math.min(ctx.bey.spin + steal, ctx.bey.maxSpin);
  },
});
```

**`server/physics/mechanics/contactDeflect.ts`**
```typescript
import { registerMechanic } from "../MechanicRegistry";
registerMechanic("contact_deflect", {
  onCollision(ctx, params) {
    const opp = ctx.opponent;
    if (!opp || !ctx.getPosition || !ctx.applyKnockback) return;
    const { deflectForce = 0.04 } = params as any;
    const pos = ctx.getPosition(ctx.bey.id);
    const oppPos = ctx.getPosition(opp.id);
    if (!pos || !oppPos) return;
    const dx = oppPos.x - pos.x, dy = oppPos.y - pos.y;
    const d = Math.sqrt(dx * dx + dy * dy) || 1;
    ctx.applyKnockback(opp.id, { x: dx / d, y: dy / d }, deflectForce * 1000);
  },
});
```

**`server/physics/mechanics/springRecoil.ts`**
```typescript
import { registerMechanic } from "../MechanicRegistry";
registerMechanic("spring_recoil", {
  onCollision(ctx, params) {
    const { recoilMultiplier = 1.5 } = params as any;
    // Flag physics engine to apply extra restitution on next collision resolve
    (ctx.bey as any)._springRecoilMultiplier = recoilMultiplier;
  },
});
```

**`server/physics/mechanics/weightShift.ts`**
```typescript
import { registerMechanic } from "../MechanicRegistry";
registerMechanic("weight_shift", {
  passive(ctx, params) {
    const { massBonus = 5 } = params as any;
    ctx.bey.mass += massBonus;
  },
});
```

**`server/physics/mechanics/spinStealCoupling.ts`**
```typescript
import { registerMechanic } from "../MechanicRegistry";
registerMechanic("spin_steal_coupling", {
  onCollision(ctx, params) {
    const opp = ctx.opponent;
    if (!opp) return;
    const { stealFactor = 0.2 } = params as any;
    const stolen = opp.spin * stealFactor;
    opp.spin -= stolen;
    ctx.bey.spin = Math.min(ctx.bey.spin + stolen * 0.8, ctx.bey.maxSpin);
  },
});
```

**`server/physics/mechanics/railLock.ts`**
```typescript
import { registerMechanic } from "../MechanicRegistry";
registerMechanic("rail_lock", {
  tick(ctx, params) {
    // Locks bey to the nearest gear rail when within proximity
    // Actual rail tracking is handled by ArenaFeatureProcessor.processGearRails()
    // This mechanic enables the gearCompatibleBit flag
    ctx.bey.gearCompatibleBit = true;
  },
});
```

**`server/physics/mechanics/centerPull.ts`**
```typescript
import { registerMechanic } from "../MechanicRegistry";
registerMechanic("center_pull", {
  tick(ctx, params) {
    const { strength = 0.002 } = params as any;
    // Pull toward arena center (0,0 in physics coords is arena center)
    const dx = -ctx.bey.x, dy = -ctx.bey.y;
    const d = Math.sqrt(dx * dx + dy * dy) || 1;
    ctx.applyForce(ctx.bey.id, (dx / d) * strength, (dy / d) * strength);
  },
});
```

**`server/physics/mechanics/bearingDrift.ts`**
```typescript
import { registerMechanic } from "../MechanicRegistry";
registerMechanic("bearing_drift", {
  tick(ctx, params) {
    const { driftSpeed = 0.15 } = params as any;
    // Low-friction drift: scale down velocities slowly (bearing tip = almost no friction)
    ctx.bey.velocityX *= (1 - driftSpeed * ctx.dt);
    ctx.bey.velocityY *= (1 - driftSpeed * ctx.dt);
  },
});
```

**`server/physics/mechanics/burstSuppress.ts`**
```typescript
import { registerMechanic } from "../MechanicRegistry";
registerMechanic("burst_suppress", {
  onCollision(ctx, params) {
    const { pressureReduction = 0.5 } = params as any;
    // Reduce burst pressure accumulated from this hit
    ctx.bey.burstPressure = Math.max(0, ctx.bey.burstPressure - pressureReduction);
  },
});
```

**`server/physics/mechanics/staminaRecovery.ts`**
```typescript
import { registerMechanic } from "../MechanicRegistry";
registerMechanic("stamina_recovery", {
  tick(ctx, params) {
    const { recoveryRate = 5 } = params as any;
    ctx.bey.spin = Math.min(ctx.bey.spin + recoveryRate * ctx.dt, ctx.bey.maxSpin);
  },
});
```

**`server/physics/mechanics/surfaceFrictionModifier.ts`**
```typescript
import { registerMechanic } from "../MechanicRegistry";
registerMechanic("surface_friction_modifier", {
  passive(ctx, params) {
    const { frictionScale = 0.5 } = params as any;
    ctx.bey.surfaceFriction *= frictionScale;
  },
});
```

**`server/physics/mechanics/orbitMovement.ts`**
```typescript
import { registerMechanic } from "../MechanicRegistry";
registerMechanic("orbit_movement", {
  tick(ctx, params) {
    const { centerX = 0, centerY = 0, intensity = 0.002, direction = "cw" } = params as any;
    const dir = direction === "ccw" ? -1 : 1;
    const dx = ctx.bey.x - centerX;
    const dy = ctx.bey.y - centerY;
    const d = Math.sqrt(dx * dx + dy * dy) || 1;
    const tx = (-dy / d) * dir;
    const ty = (dx / d) * dir;
    ctx.applyForce(ctx.bey.id, tx * intensity, ty * intensity);
  },
});
```

**`server/physics/mechanics/upperLaunch.ts`**
```typescript
import { registerMechanic } from "../MechanicRegistry";
registerMechanic("upper_launch", {
  onCollision(ctx, params) {
    const opp = ctx.opponent;
    if (!opp) return;
    const { upForce = 0.06 } = params as any;
    opp.isAirborne = true;
    opp.airborneTimer = 0.5;
    ctx.applyForce(opp.id, 0, -upForce);
  },
});
```

**`server/physics/mechanics/smashImpact.ts`**
```typescript
import { registerMechanic } from "../MechanicRegistry";
registerMechanic("smash_impact", {
  onCollision(ctx, params) {
    const opp = ctx.opponent;
    if (!opp) return;
    const { extraDamage = 20 } = params as any;
    if (!opp.invulnerable) {
      opp.health -= extraDamage * opp.damageTaken;
      opp.damageReceived += extraDamage;
    }
  },
});
```

**`server/physics/mechanics/barrageHit.ts`**
```typescript
import { registerMechanic } from "../MechanicRegistry";
registerMechanic("barrage_hit", {
  onCollision(ctx, params) {
    const opp = ctx.opponent;
    if (!opp) return;
    const { hits = 3, damagePerHit = 8 } = params as any;
    if (!opp.invulnerable) {
      const total = hits * damagePerHit * opp.damageTaken;
      opp.health -= total;
      opp.damageReceived += total;
    }
  },
});
```

**`server/physics/mechanics/zeroGFloat.ts`**
```typescript
import { registerMechanic } from "../MechanicRegistry";
registerMechanic("zero_g_float", {
  onActivate(ctx) {
    ctx.bey.effectiveGravity = 0;
    ctx.bey.isAirborne = true;
  },
  tick(ctx, params) {
    const { gravityRestore = 0.5 } = params as any;
    ctx.bey.effectiveGravity = Math.min(ctx.bey.effectiveGravity + gravityRestore * ctx.dt, 9.8);
  },
});
```

**`server/physics/mechanics/magneticPull.ts`**
```typescript
import { registerMechanic } from "../MechanicRegistry";
registerMechanic("magnetic_pull", {
  tick(ctx, params) {
    const opp = ctx.opponent;
    if (!opp) return;
    const { strength = 0.003 } = params as any;
    const dx = opp.x - ctx.bey.x, dy = opp.y - ctx.bey.y;
    const d = Math.sqrt(dx * dx + dy * dy) || 1;
    ctx.applyForce(opp.id, -(dx / d) * strength, -(dy / d) * strength);
  },
});
```

**`server/physics/mechanics/contactHeightGate.ts`**
```typescript
import { registerMechanic } from "../MechanicRegistry";
registerMechanic("contact_height_gate", {
  onCollision(ctx, params) {
    const opp = ctx.opponent;
    if (!opp) return;
    // Only allow full collision effect if bey is taller (beyond scope of 2D; stub)
    const { heightThreshold = 0.5, damageScale = 0.5 } = params as any;
    if (ctx.bey.beyTiltAngle < heightThreshold && !opp.invulnerable) {
      opp.health -= 10 * damageScale;
    }
  },
});
```

**`server/physics/mechanics/spinDirectionBonus.ts`**
```typescript
import { registerMechanic } from "../MechanicRegistry";
registerMechanic("spin_direction_bonus", {
  onCollision(ctx, params) {
    const opp = ctx.opponent;
    if (!opp) return;
    const { bonusDamage = 15 } = params as any;
    // Bonus damage when beys spin in same direction (same-spin clash)
    if (ctx.bey.spinDirection === opp.spinDirection && !opp.invulnerable) {
      opp.health -= bonusDamage * opp.damageTaken;
    }
  },
});
```

**`server/physics/mechanics/subPartBurst.ts`**
```typescript
import { registerMechanic } from "../MechanicRegistry";
registerMechanic("sub_part_burst", {
  onActivate(ctx, params) {
    // Fires a sub-part as a projectile — actual spawning handled by PartPhysics.ts
    const { subPartIndex = 0 } = params as any;
    (ctx.bey as any)._pendingSubPartBurst = subPartIndex;
  },
});
```

**`server/physics/mechanics/defenseStance.ts`**
```typescript
import { registerMechanic } from "../MechanicRegistry";
registerMechanic("defense_stance", {
  onActivate(ctx, params) {
    const { durationMs = 1500 } = params as any;
    ctx.bey.invulnerable = true;
    ctx.bey.invulnerabilityTimer = durationMs / 1000;
  },
});
```

**`server/physics/mechanics/revivalSpin.ts`**
```typescript
import { registerMechanic } from "../MechanicRegistry";
registerMechanic("revival_spin", {
  tick(ctx, params) {
    const { threshold = 0.2, recoveryRate = 10 } = params as any;
    const stability = ctx.bey.spin / ctx.bey.maxSpin;
    if (stability < threshold) {
      ctx.bey.spin = Math.min(ctx.bey.spin + recoveryRate * ctx.dt, ctx.bey.maxSpin);
    }
  },
});
```

**Verification**: `import { REGISTRY } from "../physics/MechanicRegistry"` from any room file resolves; `Object.keys(REGISTRY).length === 31`.

---

## Block E — gimmickExpander + Room Wiring

### E1 — Create `server/utils/gimmickExpander.ts`

```typescript
import type { MechanicInstance } from "../rooms/schema/GameState";
import { ArraySchema } from "@colyseus/schema";

export interface GimmickDef {
  id: string;
  name: string;
  mechanicIds: string[];
  defaultParams?: Record<string, Record<string, unknown>>;
}

/**
 * Expands a list of gimmickIds into MechanicInstance[] by looking them up
 * in the cached gimmickDefs map.
 *
 * Called ONCE per beyblade at room onCreate. Never called in the game loop.
 */
export function expandGimmicks(
  gimmickIds: string[],
  gimmickDefsCache: Record<string, GimmickDef>,
): ArraySchema<MechanicInstance> {
  const result = new ArraySchema<MechanicInstance>();

  for (const gimmickId of gimmickIds) {
    const def = gimmickDefsCache[gimmickId];
    if (!def) {
      console.warn(`[gimmickExpander] Unknown gimmickId "${gimmickId}" — skipping`);
      continue;
    }

    for (const mechanicId of def.mechanicIds) {
      const inst = new MechanicInstance();
      inst.type = mechanicId;
      inst.params = JSON.stringify(def.defaultParams?.[mechanicId] ?? {});
      inst.state = "{}";
      inst.active = true;
      result.push(inst);
    }
  }

  return result;
}
```

### E2 — Add `loadGimmickDefs()` to `server/utils/firestoreLoaders.ts`

If the file doesn't exist, create it. Add:

```typescript
import { getFirestore } from "../shared/utils/firebaseAdmin";
import { COLLECTIONS } from "../constants/collections";
import type { GimmickDef } from "./gimmickExpander";

let _gimmickDefsCache: Record<string, GimmickDef> | null = null;

export async function loadGimmickDefs(): Promise<Record<string, GimmickDef>> {
  if (_gimmickDefsCache) return _gimmickDefsCache;
  const db = getFirestore();
  const snap = await db.collection(COLLECTIONS.GIMMICK_DEFS).get();
  _gimmickDefsCache = {};
  snap.forEach(doc => {
    _gimmickDefsCache![doc.id] = { id: doc.id, ...doc.data() } as GimmickDef;
  });
  return _gimmickDefsCache;
}
```

### E3 — Wire into all 4 room types' `onCreate()`

**Files**: `server/rooms/BattleRoom.ts`, `AIBattleRoom.ts`, `TournamentBattleRoom.ts`, `TryoutRoom.ts`

After each room loads beyblade stats (near `this.beybladeStatsCache`), add:

```typescript
// Load gimmick definitions once (cached after first call)
const gimmickDefsCache = await loadGimmickDefs();

// Expand gimmicks for each beyblade
for (const [, beyblade] of this.state.beyblades) {
  const stats = this.beybladeStatsCache.get(beyblade.configId ?? beyblade.beybladeId);
  const gimmickIds: string[] = (stats as any)?.gimmickIds ?? [];
  if (gimmickIds.length > 0) {
    const instances = expandGimmicks(gimmickIds, gimmickDefsCache);
    instances.forEach(inst => beyblade.mechanics.push(inst));
  }
}
```

Add imports at top of each room file:
```typescript
import { loadGimmickDefs } from "../utils/firestoreLoaders";
import { expandGimmicks } from "../utils/gimmickExpander";
```

**Verification**: In a tryout room, a beyblade with `gimmickIds: ["bearing_zombie"]` gets `mechanics.length > 0` after `onCreate()`.

---

## Block F — BehaviorRef Dispatch Fix

**File**: `server/shared/rooms/ArenaFeatureProcessor.ts`

Replace the current `executeBehavior()` function (lines ~58–90) with:

```typescript
import { dispatchBehaviorRef, type MechanicContext } from "../../physics/MechanicRegistry";

/** Set of behaviorIds we have already logged an unrecognized-behavior warning for. */
const _warnedBehaviorIds = new Set<string>();

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
```

**Note**: The callers of `executeBehavior()` must also pass `beybladeSchema` (the `state.beyblades` map) as the 5th argument. Update all call sites in ArenaFeatureProcessor.ts.

**Verification**: A TriggerZoneConfig with `behaviorId: "factor.attack_amplifier"` fires the mechanic handler without a console warning.

---

## Block G — ArenaFeatureProcessor New Handlers

**File**: `server/shared/rooms/ArenaFeatureProcessor.ts`

Add the following 6 methods to the exported `ArenaFeatureProcessor` class (or as standalone exported functions if the file uses functions rather than a class).

### G1 — `processTriggerZones(dt)` (P0 CRITICAL)

```typescript
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

    // Physics flags bypass check
    if (physFlagsCache?.get(beyblade.id)?.noTriggerZone) continue;

    const zx = (zone.x ?? 0) * 24, zy = (zone.y ?? 0) * 24;
    const zr = (zone.radius ?? 2) * 24;
    const inZone = (bx - zx) ** 2 + (by - zy) ** 2 <= zr ** 2;
    if (!inZone) continue;

    switch (zone.kind) {
      case "damage":
        if (!beyblade.invulnerable) {
          const dmg = (zone.value ?? 5) * dt * beyblade.damageTaken;
          beyblade.health -= dmg;
          beyblade.damageReceived += dmg;
        }
        break;
      case "heal":
        beyblade.health = Math.min(beyblade.health + (zone.value ?? 5) * dt, beyblade.maxHealth);
        break;
      case "KO":
        beyblade.isRingOut = true;
        beyblade.eliminationType = "ring_out";
        break;
      case "spin-boost":
        beyblade.spin = Math.min(beyblade.spin + (zone.value ?? 20) * dt, beyblade.maxSpin);
        break;
      case "expel":
        physics.applyForce(beyblade.id, (zone.expelX ?? 0.05), (zone.expelY ?? 0.05));
        break;
      case "speed-scale":
        // Scale velocity
        beyblade.velocityX *= (zone.value ?? 0.7);
        beyblade.velocityY *= (zone.value ?? 0.7);
        break;
      case "safe":
        // In safe zone: suppress all damage for this tick
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
```

### G2 — `processGearRails(dt)` (P1)

```typescript
export function processGearRails(
  beyblade: Beyblade,
  gearRails: any[],
  dt: number,
  physics: ArenaPhysicsBridge,
  gameState: GameState,
): void {
  if (!gearRails?.length) return;

  const bx = beyblade.x, by = beyblade.y;
  const SNAP_RADIUS_PX = 3 * 24; // 3 cm

  for (const rail of gearRails) {
    if (beyblade.xtremeEngaged && beyblade.xtremeRailId === rail.id) {
      // Already on this rail: advance progress
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

    // Check proximity to any rail segment
    const pts = rail.polylineCm.map((p: any) => ({ x: p.x * 24, y: p.y * 24 }));
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
```

### G3 — `processScoringZones(dt)` (P1)

```typescript
export function processScoringZones(
  beyblade: Beyblade,
  scoringZones: any[],
  gameState: GameState,
  userId: string,
): void {
  if (!scoringZones?.length) return;
  if (!beyblade.isRingOut) return; // Only fires on ring-out event

  const bx = beyblade.x, by = beyblade.y;
  for (const zone of scoringZones) {
    const zx = zone.x_cm * 24, zy = zone.y_cm * 24;
    const zr = zone.radius_cm * 24;
    if ((bx - zx) ** 2 + (by - zy) ** 2 <= zr ** 2) {
      const current = gameState.playerPoints.get(userId) ?? 0;
      gameState.playerPoints.set(userId, current + (zone.points ?? 1));
      break; // Only score one zone per ring-out
    }
  }
}
```

### G4 — `processTornadoRidge(dt)` (P2)

```typescript
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

  // On the ridge: apply tangential orbit + spin boost
  const dir = tornadoRidge.direction === "ccw" ? -1 : 1;
  const d = distFromCenter || 1;
  const tx = (-by / d) * dir;
  const ty = (bx / d) * dir;
  const intensity = tornadoRidge.orbitIntensity ?? 0.003;
  physics.applyForce(beyblade.id, tx * intensity, ty * intensity);
  beyblade.spin = Math.min(beyblade.spin + (tornadoRidge.spinBoostPercent ?? 2) * dt, beyblade.maxSpin);
}
```

### G5 — Update `processPits` for `spike_pit`

Find the existing `processPits` or pit-handling code. Inside the escape chance check, add:

```typescript
// spike_pit: instant KO, no escape chance
if (pit.type === "spike_pit") {
  beyblade.isRingOut = true;
  beyblade.eliminationType = "ring_out";
  beyblade.inPit = false;
  return events;
}
```

Add this BEFORE the `escapeChance` roll.

### G6 — `processTiltMechanic(dt)` (P3 — can be stub)

```typescript
export function processTiltMechanic(
  beyblades: Map<string, Beyblade>,
  zeroGConfig: any,
  matchElapsedMs: number,
  physics: ArenaPhysicsBridge,
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
      // Low gravity: reduce spin decay
      bey.spinDecayRate *= 0.5;
    }
  }
}
```

---

## Block H — SpecialMove Schema Migration

### H1 — Create `server/constants/specialMovesMigrated.ts`

Read current `server/constants/specialMoves.ts` and convert each `SpecialMoveDef` to the `SpecialMoveConfig` (steps[]) format used by Firestore:

```typescript
// server/constants/specialMovesMigrated.ts
// Bridge file: old SpecialMoveDef constants converted to Firestore SpecialMoveConfig format.

export interface SpecialMoveStep {
  action: string;
  params: Record<string, unknown>;
  durationMs?: number;
}

export interface SpecialMoveConfig {
  id: string;
  name: string;
  type: "attack" | "defense" | "stamina" | "balanced";
  powerCost: number;
  cooldownMs: number;
  steps: SpecialMoveStep[];
}

export const SPECIAL_MOVES_MIGRATED: SpecialMoveConfig[] = [
  {
    id: "stampede_rush",
    name: "Stampede Rush",
    type: "attack",
    powerCost: 100,
    cooldownMs: 8000,
    steps: [
      { action: "velocity_burst", params: { forceX: 0.12, forceY: 0 } },
      { action: "attack_amplifier", params: { multiplier: 1.3 }, durationMs: 1000 },
    ],
  },
  {
    id: "gyro_anchor",
    name: "Gyro Anchor",
    type: "defense",
    powerCost: 100,
    cooldownMs: 8000,
    steps: [
      { action: "defense_stance", params: { durationMs: 1500 } },
    ],
  },
  {
    id: "spin_recovery",
    name: "Spin Recovery",
    type: "stamina",
    powerCost: 100,
    cooldownMs: 8000,
    steps: [
      { action: "orbit_movement", params: { intensity: 0.003, direction: "cw" }, durationMs: 2000 },
      { action: "stamina_recovery", params: { recoveryRate: 30 }, durationMs: 2000 },
    ],
  },
  {
    id: "tactical_burst",
    name: "Tactical Burst",
    type: "balanced",
    powerCost: 100,
    cooldownMs: 8000,
    steps: [
      { action: "velocity_burst", params: { forceX: 0.06, forceY: 0 } },
      { action: "stamina_recovery", params: { recoveryRate: 15 }, durationMs: 500 },
    ],
  },
];
```

### H2 — Update `scripts/seed-special-moves.js`

Replace the read from old constants with:
```javascript
const { SPECIAL_MOVES_MIGRATED } = require("../server/constants/specialMovesMigrated");
// Write each entry to special_moves/{id}
for (const move of SPECIAL_MOVES_MIGRATED) {
  await db.collection("special_moves").doc(move.id).set(move);
}
```

### H3 — Update room `onCreate()` for SpecialMove loading

In each room, replace:
```typescript
const specialDef = SPECIAL_MOVES[beyblade.specialMove];
```
With a cached Firestore load:
```typescript
// In onCreate():
const specialMoveConfigCache: Map<string, SpecialMoveConfig> = new Map();
const specialMoveDocs = await db.collection(COLLECTIONS.SPECIAL_MOVES).get();
specialMoveDocs.forEach(doc => specialMoveConfigCache.set(doc.id, doc.data() as SpecialMoveConfig));
this.specialMoveConfigCache = specialMoveConfigCache;

// In special move handler:
const specialConfig = this.specialMoveConfigCache.get(beyblade.specialMove);
```

### H4 — Delete `server/constants/specialMoves.ts`

After H3 passes and `npm run dev:server` works without imports from the old file, delete it.

---

## Block I — Combo effectId Migration

### I1 — Add `effectId` to `ComboConfig`

**File**: `shared/types/comboTask.ts` or wherever `ComboConfig` is defined. Add:
```typescript
  /** References combo_effects/{effectId} Firestore doc for BehaviorRef[] dispatch. */
  effectId?: string;
```

### I2 — Update `scripts/seed-combos.js`

Add `effectId` to each of the 8 combos:
```javascript
const COMBO_EFFECT_IDS = {
  "quick-dash-l":   "effect_movement_dash_left",
  "quick-dash-r":   "effect_movement_dash_right",
  "guard-tap":      "effect_defense_stance",
  "feint":          "effect_feint_pattern",
  "riposte":        "effect_counter_burst",
  "pivot-strike":   "effect_pivot_smash",
  "power-thrust":   "effect_power_dash",
  "spin-leech-jab": "effect_spin_leech",
};
// Add effectId: COMBO_EFFECT_IDS[combo.id] to each combo doc write
```

### I3 — Create `scripts/seed-combo-effects.js`

```javascript
const comboEffects = [
  { id: "effect_movement_dash_left",  steps: [{ action: "velocity_burst", params: { forceX: -0.04 } }] },
  { id: "effect_movement_dash_right", steps: [{ action: "velocity_burst", params: { forceX:  0.04 } }] },
  { id: "effect_defense_stance",      steps: [{ action: "defense_stance", params: { durationMs: 400 } }] },
  { id: "effect_feint_pattern",       steps: [{ action: "orbit_movement", params: { intensity: 0.002, direction: "ccw" } }] },
  { id: "effect_counter_burst",       steps: [{ action: "spring_recoil",  params: { recoilMultiplier: 1.8 } }] },
  { id: "effect_pivot_smash",         steps: [{ action: "smash_impact",   params: { extraDamage: 15 } }] },
  { id: "effect_power_dash",          steps: [{ action: "velocity_burst", params: { forceX: 0.08 } }, { action: "attack_amplifier", params: { multiplier: 1.2 } }] },
  { id: "effect_spin_leech",          steps: [{ action: "spin_steal_coupling", params: { stealFactor: 0.25 } }] },
];
for (const effect of comboEffects) {
  await db.collection("combo_effects").doc(effect.id).set(effect);
}
```

---

## Block J — Seed Scripts

### J1 — Create `scripts/seed-mechanics.js`

Writes 31 `mechanic_defs/{id}` docs to Firestore. Each doc:
```javascript
{
  id: "energy_reserve",
  handlerEvent: "tick",        // onActivate | tick | onCollision | passive
  description: "Slowly recharges a spin reserve; fires on activate to boost spin.",
  paramsSchema: { rechargeRate: "number", maxReserve: "number" },
  defaultParams: { rechargeRate: 0.5, maxReserve: 100 },
}
```

Write docs for all 31 mechanics defined in Block D.

### J2 — Create `scripts/seed-gimmicks.js`

Writes **27** `gimmick_defs/{id}` docs from `phase-08-gimmicks.md §1` (22 original + 5 added after Gen1 research: `magnacore_repel`, `magnacore_attract`, `dual_spin_launch`, `mode_switch_tip`, `spring_launch`). Each doc:
```javascript
{
  id: "engine_gear",
  name: "Engine Gear",
  mechanicIds: ["energy_reserve", "velocity_burst", "rail_lock"],
  defaultParams: {
    energy_reserve: { rechargeRate: 0.8, maxReserve: 150 },
    velocity_burst: { forceX: 0.08 },
    rail_lock: {},
  },
  generation: "gen1",
  tier: 1,
}
```

### J3 — Update `scripts/seed-beyblades.js`

Add `gimmickIds[]` per bey. Source: `phase-08-gimmicks.md §3` (Tier 1+2 maps for Gen1 key beys, Gen2 MFB+ZeroG, Gen3, Gen4) and `phase-07-gen234.md` (all Gen2–4 gimmickIds tables).

Example additions:
```javascript
// Driger S
{ id: "driger-s", gimmickIds: ["engine_gear", "upper_attack"] },
// Dranzer S
{ id: "dranzer-s", gimmickIds: ["engine_gear", "stamina_zombie"] },
// Wolborg 4
{ id: "wolborg-4", gimmickIds: ["bearing_zombie", "free_spin"] },
// L-Drago Destroy
{ id: "l-drago-destroy", gimmickIds: ["spin_steal_apex", "rotation_reverse"] },
```

Also add `physicsFlags` for flagged beys (Block M):
```javascript
// Phantom Orion — bearing tip, almost no recoil
{ id: "phantom-orion", physicsFlags: { noKnockback: true } },
```

### J4 — Update `scripts/seed-arenas.js`

Add new P1–P3 arenas with the new fields from `phase-10-arena-implementation.md §2`:
- Xtreme Stadium (gearRails, scoringZones, scoringMode: "points")
- Zero-G Stadium (zeroG config, hasZeroG: true)
- Tornado Balance (tornadoRidge)
- Magnacore Stadium (gravity wells, staminaDrainMultiplier)
- Survival Battle (staminaDrainMultiplier: 2.0)

Also update existing arenas to add `staminaDrainMultiplier` where applicable.

### J5 — Update `scripts/seed-all.js`

Add new scripts in dependency order:
```javascript
// In the ordered run list, insert:
"seed:mechanics",       // before seed:gimmicks
"seed:gimmicks",        // before seed:beyblades
"seed:combo-effects",   // after seed:combos
```

---

## Block K — Client HUD + Camera

### K1 — Create `client/src/components/game/BXScoreHUD.tsx`

```tsx
import React from "react";
import type { GameState } from "../../types/game";

interface Props {
  state: GameState;
  localUserId: string;
}

/**
 * Shows BX point scores. Only rendered when arena.scoringMode === "points".
 */
export const BXScoreHUD: React.FC<Props> = ({ state, localUserId }) => {
  if ((state.arena as any).scoringMode !== "points") return null;

  const entries = Object.entries(state.playerPoints ?? {});
  if (entries.length === 0) return null;

  return (
    <div className="bx-score-hud" style={{
      position: "absolute", top: 16, right: 16,
      background: "rgba(0,0,0,0.7)", borderRadius: 8,
      padding: "8px 16px", color: "#fff", fontFamily: "monospace",
      zIndex: 100,
    }}>
      <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 4 }}>POINTS</div>
      {entries.map(([userId, pts]) => (
        <div key={userId} style={{
          fontWeight: userId === localUserId ? "bold" : "normal",
          fontSize: 20,
        }}>
          {userId === localUserId ? "YOU" : userId.slice(0, 6)} — {pts}
        </div>
      ))}
    </div>
  );
};
```

### K2 — Wire `BXScoreHUD` into battle game pages

**Files**: `client/src/pages/BattleGamePage.tsx`, `AIBattleGamePage.tsx`, `TournamentBattleGamePage.tsx`

Add inside the game overlay:
```tsx
<BXScoreHUD state={state} localUserId={currentUser.uid} />
```

### K3 — Score flash in `PixiRenderer.ts`

Subscribe to `state.playerPoints` changes. On increment, emit a floating text:
```typescript
state.playerPoints.onChange = (value, key) => {
  const prev = this._prevPlayerPoints.get(key) ?? 0;
  if (value > prev) {
    const bey = [...state.beyblades.values()].find(b => b.userId === key);
    if (bey) {
      this.spawnScoreFlash(bey.x, bey.y, value >= 3 ? "3 PT XTREME!" : "2 PT OVER!");
    }
    this._prevPlayerPoints.set(key, value);
  }
};
```

---

## Block M — Physics Flags Implementation

### M1 — Create `server/utils/physicsFlags.ts`

```typescript
import type { BeybladeStats } from "../../shared/types/beybladeStats";

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

const DEFAULTS: BeybladePhysicsFlags = {
  collisionWithBeys: true,
  collisionWithArena: true,
  collisionWithObstacles: true,
  collisionWithProjectiles: true,
  invulnerable: false,
  noDamageOutput: false,
  noKnockback: false,
  noGravityWell: false,
  noSpinZone: false,
  noTriggerZone: false,
};

export function resolvePhysicsFlags(stats: { physicsFlags?: Partial<BeybladePhysicsFlags> }): BeybladePhysicsFlags {
  return { ...DEFAULTS, ...(stats.physicsFlags ?? {}) };
}
```

### M2 — Add collision categories + collision filter to `server/physics/PhysicsEngine.ts`

After the existing imports, add:
```typescript
export const COLLISION_CATEGORIES = {
  BEYBLADE:     0x0001,
  ARENA_WALL:   0x0002,
  OBSTACLE:     0x0004,
  PROJECTILE:   0x0008,
} as const;

function buildCollisionMask(flags: { collisionWithBeys: boolean; collisionWithArena: boolean; collisionWithObstacles: boolean; collisionWithProjectiles: boolean }): number {
  let mask = 0;
  if (flags.collisionWithBeys)        mask |= COLLISION_CATEGORIES.BEYBLADE;
  if (flags.collisionWithArena)       mask |= COLLISION_CATEGORIES.ARENA_WALL;
  if (flags.collisionWithObstacles)   mask |= COLLISION_CATEGORIES.OBSTACLE;
  if (flags.collisionWithProjectiles) mask |= COLLISION_CATEGORIES.PROJECTILE;
  return mask;
}
```

In `createBeyblade()`, after `const body = Matter.Bodies.circle(...)`, add:
```typescript
const flags = stats ? resolvePhysicsFlags(stats) : {
  collisionWithBeys: true, collisionWithArena: true,
  collisionWithObstacles: true, collisionWithProjectiles: true,
};
Matter.Body.set(body, {
  collisionFilter: {
    category: COLLISION_CATEGORIES.BEYBLADE,
    mask: buildCollisionMask(flags),
  },
});
```

In `createObstacles()`, set:
```typescript
Matter.Body.set(body, {
  collisionFilter: {
    category: COLLISION_CATEGORIES.OBSTACLE,
    mask: COLLISION_CATEGORIES.BEYBLADE | COLLISION_CATEGORIES.PROJECTILE,
  },
});
```

### M3 — Friendly fire check in collision handler

Find where beyblade-beyblade collision damage is applied (in the Matter.js `collisionStart` event handler, inside each room or PhysicsEngine). Before calling `applyDamage()`:

```typescript
// Friendly fire: same team — skip damage, but recoil has already been resolved by Matter.js
const isFriendlyFire =
  attacker.teamId !== "" &&
  attacker.teamId === defender.teamId;

if (!isFriendlyFire && !attFlags.invulnerable && !defFlags.invulnerable && !attFlags.noDamageOutput) {
  applyDamage(defender, calculateDamage(attacker, defender));
  applyBurstPressure(defender, attacker);
}
// recoil is already applied by Matter.js physics — nothing to add here
```

### M4 — Apply physicsFlags on room onCreate

In all 4 room types, after loading beyblade stats, populate the schema flags and a server-side cache:

```typescript
// physFlagsCache used by server-side logic (not synced directly — schema fields are the sync bridge)
const physFlagsCache: Map<string, BeybladePhysicsFlags> = new Map();

for (const [sessionId, beyblade] of this.state.beyblades) {
  const stats = this.beybladeStatsCache.get(beyblade.configId ?? beyblade.beybladeId);
  const flags = resolvePhysicsFlags(stats ?? {});
  physFlagsCache.set(beyblade.id, flags);

  // Sync to Colyseus schema (client render hints)
  beyblade.collisionWithBeys = flags.collisionWithBeys;
  beyblade.collisionWithArena = flags.collisionWithArena;
  beyblade.collisionWithObstacles = flags.collisionWithObstacles;
  beyblade.invulnerable = flags.invulnerable;
  beyblade.teamId = (stats as any)?.teamId ?? "";

  // Apply to Matter.js body
  physics.updateCollisionFilter(beyblade.id, flags);
}
this.physFlagsCache = physFlagsCache;
```

Add `updateCollisionFilter(id, flags)` method to `PhysicsEngine`:
```typescript
updateCollisionFilter(id: string, flags: { collisionWithBeys: boolean; collisionWithArena: boolean; collisionWithObstacles: boolean; collisionWithProjectiles: boolean }): void {
  const body = this.bodies.get(id);
  if (!body) return;
  Matter.Body.set(body, {
    collisionFilter: {
      ...body.collisionFilter,
      mask: buildCollisionMask(flags),
    },
  });
}
```

### M5 — Ghost render in PixiRenderer

In `client/src/game/renderer/PixiRenderer.ts`, inside the per-beyblade sprite update:
```typescript
const bey = state.beyblades.get(sessionId);
const sprite = this.beybladeSprites.get(sessionId);
if (!sprite || !bey) continue;

// Ghost mode — phasing bey
if (!bey.collisionWithBeys || !bey.collisionWithArena) {
  sprite.alpha = 0.55;
  sprite.tint = 0x88aaff;
} else {
  sprite.alpha = 1.0;
  sprite.tint = 0xffffff;
}

// Invulnerable shield ring
const shieldRing = this.shieldRings.get(sessionId);
if (shieldRing) {
  shieldRing.visible = bey.invulnerable;
}
```

---

## File Change Summary (complete, with corrected paths)

| File | Change | Block |
|------|--------|-------|
| `shared/types/arenaConfigNew.ts` | ArenaShape "rectangle" + PitType 4 additions + 4 new interfaces + ArenaConfig fields | A |
| `server/rooms/schema/GameState.ts` | MechanicInstance class + 6 Beyblade fields (mechanics, gear, burst, physflags) + 3 ArenaState fields + 1 GameState field | B |
| `server/constants/collections.ts` | 8 SHARED_COLLECTIONS additions | C |
| `server/physics/MechanicRegistry.ts` | NEW — registry + dispatchBehaviorRef + auto-imports | D1 |
| `server/physics/mechanics/*.ts` | 31 NEW handler files | D2 |
| `server/utils/gimmickExpander.ts` | NEW — expandGimmicks() | E1 |
| `server/utils/firestoreLoaders.ts` | NEW or extend — loadGimmickDefs() | E2 |
| `server/rooms/BattleRoom.ts` | gimmickExpander wiring + physflags onCreate | E3, M4 |
| `server/rooms/AIBattleRoom.ts` | gimmickExpander wiring + physflags onCreate | E3, M4 |
| `server/rooms/TournamentBattleRoom.ts` | gimmickExpander wiring + physflags onCreate | E3, M4 |
| `server/rooms/TryoutRoom.ts` | gimmickExpander wiring + physflags onCreate | E3, M4 |
| `server/shared/rooms/ArenaFeatureProcessor.ts` | executeBehavior() replace + 6 new handler functions | F, G |
| `server/constants/specialMovesMigrated.ts` | NEW — SpecialMoveConfig format | H1 |
| `scripts/seed-special-moves.js` | Use new schema | H2 |
| (4 room `onCreate()`) | SpecialMove Firestore load | H3 |
| `server/constants/specialMoves.ts` | DELETE after H verified | H4 |
| `shared/types/comboTask.ts` | Add effectId? field | I1 |
| `scripts/seed-combos.js` | Add effectId per combo | I2 |
| `scripts/seed-combo-effects.js` | NEW — 8 combo_effects docs | I3 |
| `scripts/seed-mechanics.js` | NEW — 31 mechanic_defs docs | J1 |
| `scripts/seed-gimmicks.js` | NEW — 27 gimmick_defs docs | J2 |
| `scripts/seed-beyblades.js` | Add gimmickIds[] + physicsFlags per bey | J3 |
| `scripts/seed-arenas.js` | New fields + P1–P3 arenas | J4 |
| `scripts/seed-all.js` | Updated order | J5 |
| `client/src/components/game/BXScoreHUD.tsx` | NEW component | K1 |
| (3 battle game pages) | Wire BXScoreHUD | K2 |
| `client/src/game/renderer/PixiRenderer.ts` | Score flash + ghost tint + shield ring | K3, M5 |
| `server/utils/physicsFlags.ts` | NEW — resolvePhysicsFlags(), DEFAULTS, BeybladePhysicsFlags | M1 |
| `server/physics/PhysicsEngine.ts` | COLLISION_CATEGORIES + buildCollisionMask + createBeyblade flags + updateCollisionFilter | M2 |
| (collision handler in room or engine) | Friendly fire check | M3 |

**Grand total: 51 file changes** (17 new files, 33 edits, 1 deletion).

---

## Block N — Part System Gap Fixes (from Stage 5 research)

> Source: phase-05-parts.md §5. Three confirmed gaps in the 2.5D part pipeline.
> All 3 affect `Parts25DBattleRoom` and `PartPhysics` only — standard `BattleRoom` is unaffected.

### N1 — ARPart.contactPoints bridge to PhysicsEngine (PART-01, P2)

**File**: `server/rooms/PartSystemManager.ts` — in `registerBey()` or after `applyStatModifier()`

After registering all parts for a bey, collect the active contact points from each layer and write them into `PhysicsEngine.beybladeStats`:

```typescript
import { resolveCpBounds } from "../../shared/types/beybladeSystem";
import type { ARPart, WDPart, CasingPart } from "../../shared/types/beybladeSystem";
import type { PointOfContact } from "../types/shared";

function collectContactPoints(
  ar: ARPart | undefined,
  wd: WDPart | undefined,
  casing: CasingPart | undefined,
  spinTrackHeightOffsetMm: number,
): PointOfContact[] {
  const pocs: PointOfContact[] = [];

  // Helper to convert SystemContactPoint → PointOfContact (legacy format)
  function convertCP(cp: any, heightOffsetMm: number): PointOfContact {
    const bounds = resolveCpBounds(cp);
    const midAngle = (bounds.arcStart + bounds.arcEnd) / 2;
    const halfW = Math.abs(bounds.arcEnd - bounds.arcStart) / 2;
    return {
      angle: midAngle,
      width: halfW * 2,
      radius: (bounds.rInner + bounds.rOuter) / 2,
      thickness: bounds.lineThickness,
      damageMultiplier: cp.damageMultiplier ?? 1.0,
      material: cp.material ?? "abs",
      attackType: cp.attackType,
      extends: cp.extends,
      extendThreshold: cp.extendThreshold,
      extendedWidth: cp.extendedWidth,
      extendedRadius: cp.extendedRadius,
      extendedThickness: cp.extendedThickness,
      heightRange: {
        min: (cp.heightRange?.min ?? 0) + heightOffsetMm,
        max: (cp.heightRange?.max ?? 30) + heightOffsetMm,
      },
    };
  }

  const spinOffset = spinTrackHeightOffsetMm;
  for (const cp of (ar?.contactPoints ?? [])) pocs.push(convertCP(cp, spinOffset));
  for (const cp of (wd?.contactPoints ?? [])) pocs.push(convertCP(cp, spinOffset));
  for (const cp of (casing?.contactPoints ?? [])) pocs.push(convertCP(cp, 0));

  return pocs;
}

// After registerBey() or after applyStatModifier() call:
const spinTrackOffset = (beyState.parts.spin_track as any)?.heightOffsetMm ?? 0;
const pocs = collectContactPoints(
  beyState.parts.ar as ARPart,
  beyState.parts.wd as WDPart,
  beyState.parts.casing as CasingPart,
  spinTrackOffset,
);
// Merge into the existing BeybladeStats for this bey in PhysicsEngine:
const existingStats = physicsEngine.getStats(beyId) ?? {};
physicsEngine.beybladeStats.set(beyId, { ...existingStats, pointsOfContact: pocs });
```

Add `getStats(id: string): BeybladeStats | undefined` to `PhysicsEngine` if not present:
```typescript
getStats(id: string): BeybladeStats | undefined {
  return this.beybladeStats.get(id);
}
```

**Verification**: In `Parts25DBattleRoom`, after a bey joins, `physicsEngine.beybladeStats.get(beyId).pointsOfContact.length > 0`.

---

### N2 — Arc-segment CP precision in PhysicsEngine (PART-02, P3)

**File**: `server/physics/PhysicsEngine.ts` — `getContactPointMultiplier()`

After the existing legacy gate at the top of the function, add arc-segment detection:

```typescript
private getContactPointMultiplier(
  contactAngle: number,
  contactRadius: number,
  stats: BeybladeStats,
  opponentStats: BeybladeStats,
): number {
  let maxMult = 1.0;

  for (const cp of stats.pointsOfContact ?? []) {
    // Detect arc-segment shape
    const isArcSegment = (cp as any).arcStart !== undefined
      || (cp as any).arcEnd !== undefined
      || (cp as any).lineThickness !== undefined;

    let angleMult = 0;

    if (isArcSegment) {
      // Arc-segment: falloff from midpoint
      const arcStart = (cp as any).arcStart ?? (cp.angle - cp.width / 2);
      const arcEnd   = (cp as any).arcEnd   ?? (cp.angle + cp.width / 2);
      const mid = (arcStart + arcEnd) / 2;
      const halfSpan = Math.abs(arcEnd - arcStart) / 2 || 1;
      const angDeg = (contactAngle * 180 / Math.PI + 360) % 360;
      let dist = Math.abs(angDeg - mid);
      dist = Math.min(dist, 360 - dist); // wrap
      const falloff = Math.max(0, 1 - dist / halfSpan);
      if (falloff <= 0) continue;
      angleMult = falloff;

      // Arc-segment radial gate: use radiusInner/radiusOuter band
      const rInner = (cp as any).radiusInner ?? (cp.radius - (cp.thickness ?? 2) / 2);
      const rOuter = (cp as any).radiusOuter ?? (cp.radius + (cp.thickness ?? 2) / 2);
      if (contactRadius < rInner - 2 || contactRadius > rOuter + 2) continue;
    } else {
      // Legacy shape: flat gate
      const halfWidthRad = (cp.width / 2) * Math.PI / 180;
      let angDiff = Math.abs(contactAngle - cp.angle * Math.PI / 180);
      angDiff = Math.min(angDiff, Math.PI * 2 - angDiff);
      if (angDiff > halfWidthRad) continue;
      if (!this.checkRadialContactMatch(contactRadius, cp.radius, cp.thickness ?? 2)) continue;
      angleMult = 1.0;
    }

    const matMult = MATERIAL_MULTIPLIERS[cp.material ?? "abs"]?.damage ?? 1.0;
    const dmgMult = (cp.damageMultiplier ?? 1.0) * matMult;
    maxMult = Math.max(maxMult, dmgMult * angleMult);
  }

  return maxMult;
}
```

**Verification**: An arc-segment CP with `arcStart: 0, arcEnd: 60, lineThickness: 3` deals full damage at `contactAngle = 30°` (midpoint) and less at `0°` / `60°` (edges).

---

### N3 — DetachedBody Matter.js physics body (PART-03c, P2)

**File**: `server/rooms/Parts25DBattleRoom.ts`

In `onCreate()`, after `this.state.detachedBodies` is initialized, register an `onAdd` listener:

```typescript
this.state.detachedBodies.onAdd((body, key) => {
  if (body.bodyType === "fragment") return; // fragments are visual-only

  if (body.bodyType === "mini_bey" || body.bodyType === "projectile") {
    const radius = body.radius; // already in px
    const mass = body.mass;

    const matterBody = this.physics.createDetachedBody(key, body.x, body.y, radius, mass);

    // Set initial velocity from schema
    Matter.Body.setVelocity(matterBody, { x: body.velocityX, y: body.velocityY });

    body.onChange(() => {
      // Keep schema state in sync (position updated by physics tick)
    });
  }
});
```

Add `createDetachedBody()` to `PhysicsEngine`:
```typescript
createDetachedBody(id: string, x: number, y: number, radius: number, mass: number): Matter.Body {
  const body = Matter.Bodies.circle(x, y, radius, {
    mass,
    restitution: 0.6,
    friction: 0.01,
    frictionAir: 0.005,
    label: `detached_${id}`,
    collisionFilter: {
      category: COLLISION_CATEGORIES.PROJECTILE,
      mask: COLLISION_CATEGORIES.BEYBLADE | COLLISION_CATEGORIES.ARENA_WALL,
    },
  });
  Matter.World.add(this.world, body);
  this.bodies.set(id, body);
  return body;
}
```

In the room's physics sync tick, add detached body position sync (same as beyblades):
```typescript
for (const [key, schemaBody] of this.state.detachedBodies) {
  if (schemaBody.bodyType === "fragment") continue;
  const mBody = this.physics.getBody(key);
  if (!mBody) continue;
  schemaBody.x = mBody.position.x;
  schemaBody.y = mBody.position.y;
  schemaBody.velocityX = mBody.velocity.x;
  schemaBody.velocityY = mBody.velocity.y;
  schemaBody.angle = mBody.angle * 180 / Math.PI;

  // Lifecycle: transition to obstacle when speed drops
  const speed = Math.sqrt(mBody.velocity.x ** 2 + mBody.velocity.y ** 2);
  if (schemaBody.state === "projectile" && speed < schemaBody.obstacleSpeedThreshold) {
    schemaBody.state = "obstacle";
    Matter.Body.setStatic(mBody, true);
  }
}
```

### N4 — tickPocketBalls wiring (PART-03a, P3)

**File**: `server/rooms/parts25d/partSystemHooks.ts` or `PartSystemManager.tickBey()`

Find `tickBey()`. Add a call to `tickPocketBalls()`:
```typescript
import { tickPocketBalls } from "../physics/PartPhysics";

// Inside tickBey(), after existing tick calls:
const pocketResult = tickPocketBalls(
  state.parts.casing?.pockets ?? [],
  state.parts.wd?.pockets ?? [],
  bey,
  dt,
);
if (pocketResult.inertiaMod !== 1.0) {
  bey.spinDecayRate *= pocketResult.inertiaMod;
}
for (const idx of pocketResult.escapedIndices) {
  // Spawn a visual-only fragment for escaped pocket balls
  const detached = new DetachedBodySchema();
  detached.id = `pocket_${bey.id}_${idx}_${Date.now()}`;
  detached.bodyType = "fragment";
  detached.state = "projectile";
  detached.ownerSessionId = bey.userId;
  detached.x = bey.x;
  detached.y = bey.y;
  detached.radius = 4;
  detached.mass = 0.5;
  gameState.detachedBodies.set(detached.id, detached);
}
```

---

### Block N File Changes

| File | Change | Gap |
|------|--------|-----|
| `server/rooms/PartSystemManager.ts` | Add `collectContactPoints()` helper + call after `registerBey()` | N1 |
| `server/physics/PhysicsEngine.ts` | Arc-segment detection in `getContactPointMultiplier()` + `createDetachedBody()` method | N2, N3 |
| `server/rooms/Parts25DBattleRoom.ts` | `detachedBodies.onAdd` listener + detached body sync in tick | N3 |
| `server/rooms/parts25d/partSystemHooks.ts` | Wire `tickPocketBalls()` in `tickBey()` | N4 |

**Block N total**: 4 file edits.
**Revised grand total: 55 file changes** (17 new files, 37 edits, 1 deletion).

---

## Execution Checklist

```
[ ] Block A: TypeScript types — run npx tsc --noEmit
[ ] Block B: Schema additions — npm run dev:server (no crash)
[ ] Block C: COLLECTIONS — COLLECTIONS.MECHANIC_DEFS resolves
[ ] Block D: 31 handler files created — REGISTRY has 31 keys
[ ] Block E: gimmickExpander + room wiring — beys have mechanics[] on join
[ ] Block F: BehaviorRef dispatch — no "Unknown behaviorId" warnings for standard IDs
[ ] Block G: processTriggerZones — KO zone triggers ring-out; damage zone reduces health
[ ] Block H: SpecialMove migration — seed:special-moves passes; room loads from Firestore
[ ] Block I: Combo effectId — seed:combos passes; 8 combo_effects docs exist
[ ] Block J: All seeds — npm run seed:all completes without error
[ ] Block K: BXScoreHUD — visible on Xtreme Stadium arena; score flash fires on ring-out
[ ] Block M: Physics flags — ghost bey phases through; friendly collision transfers recoil only
[ ] Block N: Part gaps — ARPart CPs appear in physicsEngine.beybladeStats; detached mini-beys collide
```

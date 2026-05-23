# Phase 19 — Implementation Plan

> Stage 19 | Source: phase-16-gap-analysis.md (60 gaps)
> Purpose: Ordered task list, file-by-file, for Stage 20 code generation.
> Groups gaps into implementation blocks to minimize context-switching.
> Each task is concrete: file path + what changes + why.

---

## Dependency Order

```
Block A: TypeScript type additions (no runtime deps)
  ↓
Block B: Colyseus schema additions (GameState.ts)
  ↓
Block C: COLLECTIONS constant additions (firebase.ts)
  ↓
Block D: MechanicRegistry + all 31 handlers
  ↓
Block E: gimmickExpander + room.onCreate() wiring
  ↓
Block F: BehaviorRef dispatch fix (ArenaFeatureProcessor.executeBehavior)
  ↓
Block G: ArenaFeatureProcessor — 5 new handler methods
  ↓
Block H: SpecialMove schema migration
  ↓
Block I: Combo effectId migration
  ↓
Block J: Seed scripts — all new collections + updated existing
  ↓
Block K: Client HUD + camera profile wiring
```

---

## Block A — TypeScript Type Additions

**File**: `shared/types/arenaConfigNew.ts`

| Task | Gap Fixed | Change |
|------|-----------|--------|
| A1 | TYPES-01 | Add `"rectangle"` to `ArenaShape` union |
| A2 | TYPES-02 | Add `"penalty_well" \| "xtreme_zone" \| "over_zone" \| "spike_pit"` to `PitType` union |
| A3 | TYPES-03 | Add `GearRailConfig` interface (definition in phase-10-arena-implementation.md §1.3) |
| A4 | TYPES-04 | Add `ScoringZoneConfig` interface (phase-10 §1.4) |
| A5 | TYPES-05 | Add `TornadoRidgeConfig` interface (phase-10 §1.5) |
| A6 | TYPES-06 | Add `ZeroGConfig` interface (phase-10 §1.6) |
| A7 | TYPES-07 | Add `gearRails?`, `scoringZones?`, `tornadoRidge?`, `zeroG?`, `staminaDrainMultiplier?` to `ArenaConfig` interface (after `bumps?` field) |

**Verification**: `npx tsc --noEmit` in project root; no type errors.

---

## Block B — Colyseus Schema Additions

**File**: `server/shared/schema/GameState.ts` (or split file depending on current repo layout)

| Task | Gap Fixed | Change |
|------|-----------|--------|
| B1 | SCH-01 | Add `MechanicInstance` class before `Beyblade`: `@type("string") type=""`, `@type("string") params="{}"`, `@type("string") state="{}"`, `@type("boolean") active=true` |
| B2 | SCH-01 | On `Beyblade`: add `@type([MechanicInstance]) mechanics = new ArraySchema<MechanicInstance>()` |
| B3 | SCH-02 | On `Beyblade`: add `@type("boolean") gearCompatibleBit = false` |
| B4 | SCH-02 | On `Beyblade`: add `@type("boolean") xtremeEngaged = false` |
| B5 | SCH-02 | On `Beyblade`: add `@type("float32") xtremeRailProgress = 0` |
| B6 | SCH-02 | On `Beyblade`: add `@type("string") xtremeRailId = ""` |
| B7 | SCH-02 | On `Beyblade`: add `@type("float32") egBoostOmega = 0` |
| B8 | SCH-02 | On `Beyblade`: add `@type("float32") burstPressure = 0` |
| B9 | SCH-03 | On `ArenaState`: add `@type("string") scoringMode = "elimination"` |
| B10 | SCH-03 | On `ArenaState`: add `@type("uint8") pointsTarget = 0` |
| B11 | SCH-03 | On `ArenaState`: add `@type("boolean") hasZeroG = false` |
| B12 | SCH-04 | On `GameState`: add `@type({ map: "uint8" }) playerPoints = new MapSchema<number>()` |

**Verification**: Server starts without schema serialization errors. `npm run dev:server` completes without crash.

---

## Block C — COLLECTIONS Constant Additions

**File**: `client/src/lib/firebase.ts`

| Task | Gap Fixed | Change |
|------|-----------|--------|
| C1 | COLL-01 | Add `MECHANIC_DEFS: 'mechanic_defs'` to COLLECTIONS object |
| C2 | COLL-02 | Add `GIMMICK_DEFS: 'gimmick_defs'` to COLLECTIONS object |
| C3 | COLL-03 | Add `CAMERA_PROFILES: 'camera_profiles'` to COLLECTIONS object |
| C4 | COLL-04 | Add `AUDIO_PROFILES: 'audio_profiles'` to COLLECTIONS object |
| C5 | COLL-05 | Add `SCRIPT_DEFINITIONS: 'script_definitions'` to COLLECTIONS object |
| C6 | COLL-06 | Add `COMPOSITION_BLOCKS: 'composition_blocks'` to COLLECTIONS object |

**Verification**: TypeScript: `COLLECTIONS.MECHANIC_DEFS` resolves without error.

---

## Block D — MechanicRegistry + Handler Files

### D1 — Create `src/physics/MechanicRegistry.ts`

Gap fixed: MECH-01

```typescript
// Full interface + dispatch + registry map
// See phase-06-mechanics.md §5 for the handler interface
// See phase-11-architecture.md for dispatchBehaviorRef() routing
export type MechanicHandler = {
  onActivate?: (bey: Beyblade, params: Record<string, unknown>) => void;
  tick?: (bey: Beyblade, dt: number, params: Record<string, unknown>) => void;
  onCollision?: (attacker: Beyblade, defender: Beyblade, params: Record<string, unknown>) => void;
  passive?: (bey: Beyblade, params: Record<string, unknown>) => void;
};

export const MECHANIC_REGISTRY: Record<string, MechanicHandler> = {
  energy_reserve: require("./mechanics/energyReserve").handler,
  velocity_burst: require("./mechanics/velocityBurst").handler,
  attack_amplifier: require("./mechanics/attackAmplifier").handler,
  // ... all 31 entries
};

export function dispatchBehaviorRef(behaviorRef: BehaviorRef, ctx: MechanicContext): void {
  // Routes behaviorId → mechanic ID → MECHANIC_REGISTRY handler
  // See phase-11 §BehaviorRef dispatch fix
}
```

### D2 — Create `src/physics/mechanics/` directory with 31 handler files

Gap fixed: MECH-02

One file per mechanic, each exports `{ handler: MechanicHandler }`. Files:

| File | Mechanic | Handler Events |
|------|----------|---------------|
| `energyReserve.ts` | `energy_reserve` | tick, onActivate |
| `velocityBurst.ts` | `velocity_burst` | onActivate |
| `attackAmplifier.ts` | `attack_amplifier` | tick, onActivate |
| `freeSpin.ts` | `free_spin` | tick |
| `spinTransfer.ts` | `spin_transfer` | onCollision |
| `spinEqualization.ts` | `spin_equalization` | onCollision |
| `rotationReverse.ts` | `rotation_reverse` | onActivate |
| `spinThresholdSwitch.ts` | `spin_threshold_switch` | tick |
| `modeSwitch.ts` | `mode_switch` | onActivate |
| `rubberGrip.ts` | `rubber_grip` | onCollision |
| `contactDeflect.ts` | `contact_deflect` | onCollision |
| `springRecoil.ts` | `spring_recoil` | onCollision |
| `weightShift.ts` | `weight_shift` | passive |
| `spinStealCoupling.ts` | `spin_steal_coupling` | onCollision |
| `railLock.ts` | `rail_lock` | tick |
| `centerPull.ts` | `center_pull` | tick |
| `bearingDrift.ts` | `bearing_drift` | tick |
| `burstSuppress.ts` | `burst_suppress` | onCollision |
| `staminaRecovery.ts` | `stamina_recovery` | tick |
| `surfaceFrictionModifier.ts` | `surface_friction_modifier` | passive |
| `orbitMovement.ts` | `orbit_movement` | tick (wraps existing ArenaFeatureProcessor.processOrbitMovement) |
| `upperLaunch.ts` | `upper_launch` | onCollision |
| `smashImpact.ts` | `smash_impact` | onCollision |
| `barrageHit.ts` | `barrage_hit` | onCollision |
| `zeroGFloat.ts` | `zero_g_float` | tick, onActivate |
| `magneticPull.ts` | `magnetic_pull` | tick |
| `contactHeightGate.ts` | `contact_height_gate` | onCollision |
| `spinDirectionBonus.ts` | `spin_direction_bonus` | onCollision |
| `subPartBurst.ts` | `sub_part_burst` | onActivate |
| `defenseStance.ts` | `defense_stance` | onActivate |
| `revivalSpin.ts` | `revival_spin` | tick |

**Verification**: All 31 files importable; MECHANIC_REGISTRY has 31 keys.

---

## Block E — gimmickExpander + Room Wiring

### E1 — Create `src/utils/gimmickExpander.ts`

Gap fixed: MECH-03

Full implementation in phase-08-gimmicks.md §5. Key contract:
```typescript
expandGimmicks(gimmickIds: string[], gimmickDefsCache: Record<string, GimmickDef>): MechanicInstance[]
```

### E2 — Wire into all room types' `onCreate()`

Gap fixed: MECH-04

Files: `src/rooms/BattleRoom.ts`, `src/rooms/AIBattleRoom.ts`, `src/rooms/TournamentBattleRoom.ts`, `src/rooms/TryoutRoom.ts`

Add to each room's `onCreate()` after beyblade stats are loaded:
```typescript
// Load gimmick defs cache once
const gimmickDefsCache = await loadGimmickDefs(); // reads from gimmick_defs/

// For each player's beyblade:
for (const [sessionId, beyblade] of this.state.beyblades) {
  const stats = this.beybladeStatsCache.get(beyblade.configId);
  if (stats?.gimmickIds?.length) {
    const instances = expandGimmicks(stats.gimmickIds, gimmickDefsCache);
    instances.forEach(inst => beyblade.mechanics.push(inst));
  }
}
```

### E3 — Add `loadGimmickDefs()` to `src/utils/firestoreLoaders.ts`

Reads `gimmick_defs/{id}` from Firestore into a `Record<string, GimmickDef>` cache. Called once per room onCreate. NEVER called from game loop.

---

## Block F — BehaviorRef Dispatch Fix

**File**: `server/shared/rooms/ArenaFeatureProcessor.ts`

Gap fixed: BREF-01, BREF-02

Replace the current `executeBehavior()`:

```typescript
protected executeBehavior(behaviorRef: BehaviorRef, beyId: string): void {
  const ctx = this.buildMechanicContext(beyId);

  // Route ALL behaviorRef types through MechanicRegistry
  switch (true) {
    // Movement behaviors
    case behaviorRef.behaviorId === "movement.orbit":
      this.processOrbitMovement(beyId, behaviorRef.params);
      break;
    case behaviorRef.behaviorId.startsWith("movement."):
    case behaviorRef.behaviorId.startsWith("factor."):
    case behaviorRef.behaviorId.startsWith("transform."):
    case behaviorRef.behaviorId.startsWith("spawn."):
    case behaviorRef.behaviorId.startsWith("arena."):
      MechanicRegistry.dispatchBehaviorRef(behaviorRef, ctx);
      break;
    default:
      console.warn(`[executeBehavior] Unhandled behaviorId: ${behaviorRef.behaviorId}`);
  }
}
```

**Verification**: A combo with `movement.dash` BehaviorRef fires without silent drop. Log shows no unhandled warnings for standard behaviorIds.

---

## Block G — ArenaFeatureProcessor New Handlers

**File**: `server/shared/rooms/ArenaFeatureProcessor.ts`

| Task | Gap Fixed | Method to Add |
|------|-----------|--------------|
| G1 | AFEP-05 | `processTriggerZones(dt)` — dispatch all 7 TriggerZoneConfig kinds (damage, heal, KO, spin-boost, expel, speed-scale, safe). Call from the main per-tick processor loop. |
| G2 | AFEP-01 | `processGearRails(dt)` — detect bey proximity to GearRailConfig polylines; apply speedBoostPermille + set `xtremeEngaged = true`. |
| G3 | AFEP-02 | `processScoringZones(dt)` — on ring-out event, check which ScoringZoneConfig the bey passed through; increment `playerPoints[userId]` by `zone.points`. |
| G4 | AFEP-03 | `processTornadoRidge(dt)` — detect beys on ridge ring (r ± width/2); apply tangential orbit force; add spinBoostPercent to spin. |
| G5 | AFEP-06 | `processPits(dt)` — existing method: add special case: if `pit.type === "spike_pit"`, immediately set `isRingOut = true` (no escape chance roll). |
| G6 | AFEP-04 | `processTiltMechanic(dt)` — per-tick mass-center sum; normalize; apply tilt gravity vector along slope. Lower priority; can stub initially. |

**Call order in `tick(dt)` method** (after existing handlers):
```
processOrbitMovement(dt)
processTriggerZones(dt)   ← G1 (CRITICAL)
processGearRails(dt)      ← G2
processScoringZones(dt)   ← G3
processTornadoRidge(dt)   ← G4
processPits(dt) [updated] ← G5
processTiltMechanic(dt)   ← G6 (can be stub)
```

---

## Block H — SpecialMove Schema Migration

Gaps fixed: SM-01, SM-02, SM-03

### H1 — Create `src/constants/specialMovesMigrated.ts`

Copy the 5 hardcoded `SpecialMoveDef` entries from `src/constants/specialMoves.ts` and convert each to the new `SpecialMoveConfig` (steps[]) format. See phase-11 §SpecialMove migration.

### H2 — Update `scripts/seed-special-moves.js`

Read from `src/constants/specialMovesMigrated.ts` (the new `SpecialMoveConfig` format). Write to `special_moves` Firestore collection with the steps[] schema.

### H3 — Update all room types' `onCreate()`

Replace:
```typescript
const specialDef = SPECIAL_MOVES[beyblade.specialMoveId];
```
With:
```typescript
const specialConfig = await loadSpecialMoveConfig(beyblade.specialMoveId); // Firestore read
```

Load once in `onCreate()`, cache on `this.specialMoveConfigCache`.

### H4 — Delete `src/constants/specialMoves.ts` after migration verified

Keep only `src/constants/specialMovesMigrated.ts` as the migration bridge. Delete old file once seed script passes.

---

## Block I — Combo effectId Migration

Gap fixed: DATA-03

### I1 — Add `effectId` field to `ComboConfig` type

**File**: `shared/types/combo.ts` (or wherever ComboConfig is defined)
```typescript
interface ComboConfig {
  // existing fields...
  effectId?: string; // references combo_effects/{effectId}
}
```

### I2 — Update `scripts/seed-combos.js`

Add `effectId` mapping for each of the 8 combos. See phase-04-combo-mapping.md §Migration Path.

Proposed effectId values:
```
quick-dash-l  → effect_movement_dash_left
quick-dash-r  → effect_movement_dash_right
guard-tap     → effect_defense_stance
feint         → effect_feint_pattern
riposte       → effect_counter_burst
pivot-strike  → effect_pivot_smash
power-thrust  → effect_power_dash
spin-leech-jab→ effect_spin_leech
```

### I3 — Create `combo_effects/{id}` Firestore docs

8 ComboEffectDef documents, one per combo effectId above. Each contains the BehaviorRef[] that the engine dispatches when the combo fires.

---

## Block J — Seed Scripts (All New + Updated)

### New seed scripts to create:

| Script File | npm script | Writes to | Depends on |
|-------------|-----------|-----------|-----------|
| `scripts/seed-mechanics.js` | `seed:mechanics` | `mechanic_defs/{id}` — 31 docs | Block C (COLLECTIONS.MECHANIC_DEFS) |
| `scripts/seed-gimmicks.js` | `seed:gimmicks` | `gimmick_defs/{id}` — **27 docs** (5 new: magnacore_repel/attract, dual_spin_launch, mode_switch_tip, spring_launch) | Block C (COLLECTIONS.GIMMICK_DEFS) |
| `scripts/seed-combo-effects.js` | `seed:combo-effects` | `combo_effects/{id}` — 8 docs | Block I |

### Existing seed scripts to update:

| Script File | Change | Depends on |
|-------------|--------|-----------|
| `scripts/seed-combos.js` | Add `effectId` field per combo (Block I) | Block I1 type addition |
| `scripts/seed-beyblades.js` | Add `gimmickIds[]` per bey (from phase-08 §3 tables) | Block J seed:gimmicks |
| `scripts/seed-arenas.js` | Update existing arena docs + add new P1–P3 arenas with new fields | Block A type additions |
| `scripts/seed-special-moves.js` | Use new SpecialMoveConfig schema (Block H) | Block H1 |
| `scripts/seed-all.js` | Add new scripts to the ordered run list | All above |

### Updated `seed:all` run order:
```
seed:element-types
seed:mechanics        ← NEW (before gimmicks)
seed:gimmicks         ← NEW (before beyblades)
seed:combos           ← UPDATED (effectId)
seed:combo-effects    ← NEW
seed:special-moves    ← UPDATED (new schema)
seed:beyblades        ← UPDATED (gimmickIds[])
seed:arenas           ← UPDATED (new fields + P1-P3 arenas)
seed:ai-battles
seed:tournaments
seed:2d-parts
seed:bey-systems
```

---

## Block K — Client Wiring + HUD

### K1 — Client COLLECTIONS additions (already in Block C, re-confirmed for client)

**File**: `client/src/lib/firebase.ts` — same file as Block C; already covered.

### K2 — Camera profile system client wiring

Gap fixed: CAM-02

**File**: `client/src/game/renderer/PixiRenderer.ts`

Add a `cameraProfileId` prop; on room state change, fetch the profile from `camera_profiles/{id}` and apply focal length, shake params, zoom defaults to the camera controller.

### K3 — playerPoints HUD display

Gap fixed: MODE-02

**File**: `client/src/components/game/BXScoreHUD.tsx` (new component)

Subscribe to `state.playerPoints` (MapSchema); display each player's point count. Show on Xtreme Stadium arenas only (check `arena.scoringMode === "points"`).

### K4 — BeybladeX scoring notifications

**File**: `client/src/game/renderer/PixiRenderer.ts`

On `playerPoints` change event: emit a score flash particle ("3 PT XTREME!" or "2 PT OVER!") at the relevant exit zone.

---

## Block L — Input Handler Refactor (P4, can defer)

Gaps fixed: INP-01, INP-02

**Files**: All 4 room types + new `src/utils/InputHandler.ts`

Extract special move trigger and combo detection from all 4 room types into a shared `InputHandler` class. BattleRoom/AIBattleRoom/etc. call `InputHandler.process(bitmask, bey)` which returns `{ specialTriggered, comboActivated }`.

This is a refactor only — no behavior change. Can be done in a dedicated pass after Block G.

---

## Implementation Order Summary

```
A → B → C → D → E → F → G → H → I → J → K
(types) (schema) (consts) (registry) (expander) (dispatch) (processors) (specialmoves) (combos) (seeds) (client)
```

**Minimum viable engine fix (P0 gaps)**: Complete blocks A → G.
After that the mechanic/gimmick system works end-to-end.

**Full content delivery (P0+P1 gaps)**: Complete all blocks A → J.
All seeded content is live, combos have effectIds, specials use Firestore schema.

**Client experience (P2 gaps)**: Complete block K.
BX scoring visible, camera profiles wired, tilt arena functional.

---

## File Change Summary

| File | Change Type | Block |
|------|------------|-------|
| `shared/types/arenaConfigNew.ts` | 7 type additions | A |
| `server/shared/schema/GameState.ts` | 12 schema field additions | B |
| `client/src/lib/firebase.ts` | 6 COLLECTIONS additions | C |
| `src/physics/MechanicRegistry.ts` | NEW file | D1 |
| `src/physics/mechanics/*.ts` | 31 NEW handler files | D2 |
| `src/utils/gimmickExpander.ts` | NEW file | E1 |
| `src/rooms/BattleRoom.ts` | onCreate() gimmick wiring | E2 |
| `src/rooms/AIBattleRoom.ts` | onCreate() gimmick wiring | E2 |
| `src/rooms/TournamentBattleRoom.ts` | onCreate() gimmick wiring | E2 |
| `src/rooms/TryoutRoom.ts` | onCreate() gimmick wiring | E2 |
| `src/utils/firestoreLoaders.ts` | loadGimmickDefs() addition | E3 |
| `server/shared/rooms/ArenaFeatureProcessor.ts` | executeBehavior() replace + 6 new handlers | F + G |
| `src/constants/specialMovesMigrated.ts` | NEW file (SpecialMoveConfig format) | H1 |
| `scripts/seed-special-moves.js` | Use new schema | H2 |
| All 4 room `onCreate()` | SpecialMove Firestore load | H3 |
| `src/constants/specialMoves.ts` | DELETE after H verified | H4 |
| `shared/types/combo.ts` | Add effectId? field | I1 |
| `scripts/seed-combos.js` | Add effectId per combo | I2 |
| `scripts/seed-mechanics.js` | NEW script | J |
| `scripts/seed-gimmicks.js` | NEW script | J |
| `scripts/seed-combo-effects.js` | NEW script | J |
| `scripts/seed-beyblades.js` | Add gimmickIds[] | J |
| `scripts/seed-arenas.js` | New fields + new arenas | J |
| `scripts/seed-all.js` | Updated order | J |
| `client/src/components/game/BXScoreHUD.tsx` | NEW component | K |
| `client/src/game/renderer/PixiRenderer.ts` | Camera profile + score flash | K |

**Total**: 42 file changes (12 new files, 30 edits, 1 deletion).

---

## Block M — Physics Flags & Friendly Fire (Addendum)

> Source: user request — collision = true/false for phasing; friendly-team recoil with no damage for trick-shot knockouts.

### M1 — `BeybladePhysicsFlags` type + `teamId` on BeybladeStats

**File**: `shared/types/beybladeStats.ts` (or wherever `BeybladeStats` interface is defined)

```typescript
export interface BeybladePhysicsFlags {
  // Collision geometry (Matter.js collisionFilter.mask bits)
  collisionWithBeys: boolean;         // false = phases through other beyblades
  collisionWithArena: boolean;        // false = phases through arena walls/boundaries
  collisionWithObstacles: boolean;    // false = phases through obstacles
  collisionWithProjectiles: boolean;  // false = projectiles pass through this bey

  // Damage gates (forces/recoil still apply when disabled)
  invulnerable: boolean;              // receives zero damage
  noDamageOutput: boolean;            // deals zero damage to others
  noKnockback: boolean;               // immune to all recoil impulses from any source

  // Arena effect immunity
  noGravityWell: boolean;             // not pulled by gravity wells
  noSpinZone: boolean;                // not accelerated/decelerated by spin zones
  noTriggerZone: boolean;             // trigger zones skip this bey entirely
}

// Add to BeybladeStats:
// physicsFlags?: Partial<BeybladePhysicsFlags>;  // missing keys default to false/true per flag
// teamId?: string;                               // empty = free-for-all; same value = friendly
```

Default resolution (server-side helper `resolvePhysicsFlags(stats)`):
```typescript
const PHYSICS_FLAGS_DEFAULTS: BeybladePhysicsFlags = {
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
export function resolvePhysicsFlags(stats: BeybladeStats): BeybladePhysicsFlags {
  return { ...PHYSICS_FLAGS_DEFAULTS, ...(stats.physicsFlags ?? {}) };
}
```

**File**: `src/utils/physicsFlags.ts` (new utility file)

### M2 — Colyseus schema additions on `Beyblade`

**File**: `server/shared/schema/GameState.ts`

Add to the `Beyblade` class (after existing fields):

```typescript
// Physics flags — synced to clients for client-side render hints
@type("boolean") collisionWithBeys = true;
@type("boolean") collisionWithArena = true;
@type("boolean") collisionWithObstacles = true;
@type("boolean") invulnerable = false;
@type("boolean") noKnockback = false;
@type("string")  teamId = "";          // empty = no team
```

> `noDamageOutput`, `noGravityWell`, `noSpinZone`, `noTriggerZone` are server-only (not synced); held in a `Map<beyId, BeybladePhysicsFlags>` in the room class.

### M3 — Matter.js collision filter wiring

**File**: `src/physics/PhysicsEngine.ts` (wherever `createBeybladeBody()` or `addBeyblade()` is called)

Add collision category constants:
```typescript
export const COLLISION_CATEGORIES = {
  BEYBLADE:     0x0001,
  ARENA_WALL:   0x0002,
  OBSTACLE:     0x0004,
  PROJECTILE:   0x0008,
  TRIGGER_ZONE: 0x0010,  // always sensor, excluded from mask logic
} as const;
```

`buildCollisionMask(flags: BeybladePhysicsFlags): number`:
```typescript
export function buildCollisionMask(flags: BeybladePhysicsFlags): number {
  let mask = 0;
  if (flags.collisionWithBeys)        mask |= COLLISION_CATEGORIES.BEYBLADE;
  if (flags.collisionWithArena)       mask |= COLLISION_CATEGORIES.ARENA_WALL;
  if (flags.collisionWithObstacles)   mask |= COLLISION_CATEGORIES.OBSTACLE;
  if (flags.collisionWithProjectiles) mask |= COLLISION_CATEGORIES.PROJECTILE;
  return mask;
}
```

When a beyblade body is created:
```typescript
const flags = resolvePhysicsFlags(stats);
Body.set(body, {
  collisionFilter: {
    category: COLLISION_CATEGORIES.BEYBLADE,
    mask: buildCollisionMask(flags),
  }
});
```

When flags change at runtime (e.g., mode-switch mechanic):
```typescript
Body.set(body, { collisionFilter: { ...body.collisionFilter, mask: buildCollisionMask(newFlags) } });
```

### M4 — Collision handler: friendly fire (recoil ✓, damage ✗)

**File**: wherever beyblade-beyblade collision events are processed (likely `src/rooms/BattleRoom.ts` or `ArenaFeatureProcessor.ts` collision handler)

```typescript
function onBeybladeCollision(attId: string, defId: string): void {
  const att = state.beyblades.get(attId)!;
  const def = state.beyblades.get(defId)!;
  const attFlags = physFlagsCache.get(attId)!;
  const defFlags = physFlagsCache.get(defId)!;

  // Matter.js already resolved the physics impulse — recoil is automatic.
  // We only decide whether to apply game-logic damage.

  const isFriendlyFire = att.teamId !== "" && att.teamId === def.teamId;

  if (!isFriendlyFire && !defFlags.invulnerable && !attFlags.noDamageOutput) {
    applyDamage(def, calculateDamage(att, def));
  }

  // Burst pressure / collision mechanics still fire even on friendly hits
  // so trick-shot chains don't bypass burst tracking:
  if (!isFriendlyFire) {
    applyBurstPressure(def, att);
  }
}
```

**Why**: Same-team recoil is physical (Matter.js handles it). The friendly fire check only gates the `applyDamage()` call, so:
- A teammate hitting you sends you flying (trick shot knock-out possible)
- But no HP/spin loss from the hit
- Burst pressure is skipped on friendly to prevent griefing

### M5 — `ObstacleConfig` + `TriggerZoneConfig` pass-through flags

**File**: `shared/types/arenaConfigNew.ts`

Add optional fields to the existing interfaces:
```typescript
interface ObstacleConfig {
  // ... existing fields ...
  passThrough?: boolean;    // beys with collisionWithObstacles:false bypass this body
  noEffect?: boolean;       // obstacle exists visually but applies no physics/damage
}

interface TriggerZoneConfig {
  // ... existing fields ...
  bypassFlags?: Array<keyof BeybladePhysicsFlags>;
  // e.g. ["noTriggerZone"] — beys with that flag set skip this trigger
}
```

In `ArenaFeatureProcessor.processTriggerZones()` (Block G1):
```typescript
if (bey.noTriggerZone) continue;  // skip bey for all trigger zones
// per-zone bypass:
if (zone.bypassFlags?.some(f => physFlagsCache.get(beyId)?.[f])) continue;
```

### M6 — Seed updates for physics-flagged beyblades

**File**: `scripts/seed-beyblades.js`

Beyblades that should have non-default flags set (examples):

| Bey | physicsFlags | teamId | Rationale |
|-----|-------------|--------|-----------|
| Phantom Orion | `{ noKnockback: true }` | — | Zero-G / bearing tip — almost no recoil |
| Ghost Beyblade (custom) | `{ collisionWithBeys: false }` | — | Cosmetic ghost mode |
| Valkyrie (team mode) | — | `"team_attack"` | Paired trick-shot scenario |
| Achilles | `{ invulnerable: true }` (temporary, toggled by mechanic) | — | Gyro Anchor special |

> Note: `invulnerable` and other flags can be toggled at runtime by mechanics (e.g., `defenseStance.ts` handler sets `invulnerable = true` for 1.5 s). Seed only sets the baseline starting value.

### M7 — Client render hint for phasing beys

**File**: `client/src/game/renderer/PixiRenderer.ts`

When `bey.collisionWithBeys === false` OR `bey.collisionWithArena === false`:
- Render bey sprite at `alpha = 0.6` with a ghost tint (`#88aaff`)
- Draw a dotted/dashed ring instead of solid outline

When `bey.invulnerable === true`:
- Render a golden shield ring around the bey

These are purely visual — the server already handles all physics.

---

### Block M File Changes

| File | Change Type |
|------|------------|
| `shared/types/beybladeStats.ts` | Add `BeybladePhysicsFlags` interface + `physicsFlags?` + `teamId?` on `BeybladeStats` |
| `src/utils/physicsFlags.ts` | NEW — `resolvePhysicsFlags()`, `PHYSICS_FLAGS_DEFAULTS`, `buildCollisionMask()` |
| `src/physics/PhysicsEngine.ts` | Add `COLLISION_CATEGORIES`, call `buildCollisionMask()` on body create |
| `server/shared/schema/GameState.ts` | 6 new `@type` fields on `Beyblade` (collision flags + teamId) |
| `server/shared/rooms/ArenaFeatureProcessor.ts` | Friendly-fire check in beyblade collision handler; `noTriggerZone` check in processTriggerZones |
| `shared/types/arenaConfigNew.ts` | Add `passThrough?` + `noEffect?` to `ObstacleConfig`; `bypassFlags?` to `TriggerZoneConfig` |
| `scripts/seed-beyblades.js` | Add `physicsFlags` + `teamId` for flagged beys |

**Block M total**: 7 file changes (1 new file, 6 edits).
**Revised grand total**: 49 file changes (13 new files, 36 edits, 1 deletion).

---

## Implementation Order Summary (updated)

```
A → B → C → D → E → F → G → H → I → J → K → [L] → M
(types) (schema) (consts) (registry) (expander) (dispatch) (processors) (specialmoves) (combos) (seeds) (client) [input-refactor] (physics-flags)
```

Block M can be inserted anywhere after Block B (schema must exist first). Recommend doing M immediately after B since flags affect every mechanic handler in D.

**Minimum viable engine fix (P0 gaps)**: A → G.
**Full content + scoring**: A → K.
**Physics flags + friendly fire**: + M.

Source: phase-16-gap-analysis.md + user addendum (collision flags + trick-shot friendly fire)

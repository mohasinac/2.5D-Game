[← Phase 10: Arena Implementation](phase-10-arena-implementation.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md) &nbsp;·&nbsp; [Phase 12: Seed Plan →](phase-12-seed-plan.md)

---

# Phase 11 — Shared Architecture

> **Stage 11** — Runtime architecture for MechanicRegistry, adapters, schema extensions, and all new systems.
> Source: confirmed engine code + Stages 0-10 research.
> Tags: FACT | INFERENCE

---

## 1. Architecture Overview

The engine enhancement adds a dispatch layer between the existing BehaviorRef compiler and the physics engine. No existing code is removed — only wired and extended.

```
linka/ research → Seed Scripts → Firestore collections
                                    ↓
                               Room onCreate (preload)
                                    ↓
                            BeybladeStats + GimmickDefs
                                    ↓
                         gimmickExpander → MechanicInstance[]
                                    ↓
                  ┌─────── Per-Tick ──────────────────────────┐
                  │  MechanicRegistry.tick()                   │
                  │  ArenaFeatureProcessor.processFeatures()   │
                  │    └─ executeBehavior() EXTENDED           │
                  │  ComboSystem.detectCombo()                 │
                  │    └─ BehaviorRef → MechanicRegistry       │
                  │  SpecialMoveSystem.tick()                  │
                  │    └─ steps → MechanicRegistry             │
                  └────────────────────────────────────────────┘
                                    ↓
                           Schema patch → Clients
```

---

## 2. New Files Required

### 2.1 `src/physics/MechanicRegistry.ts`

Registry map + dispatcher. Does NOT replace existing functions — wraps them.

```typescript
export interface MechanicHandlerContext {
  bey: Beyblade;
  arena: ArenaState;
  game: GameState;
  allBeys: Map<string, Beyblade>;
  physics: Matter.Engine;
  rand: () => number; // seeded PRNG
}

export interface MechanicHandler {
  tick?: (ctx: MechanicHandlerContext, dt: number, params: Record<string, unknown>, state: Record<string, unknown>) => void;
  onActivate?: (ctx: MechanicHandlerContext, params: Record<string, unknown>, state: Record<string, unknown>) => void;
  onCollision?: (attacker: MechanicHandlerContext, defender: MechanicHandlerContext, params: Record<string, unknown>) => void;
}

export const MECHANIC_REGISTRY = new Map<string, MechanicHandler>();

export function registerMechanic(id: string, handler: MechanicHandler): void {
  MECHANIC_REGISTRY.set(id, handler);
}

export function dispatchBehaviorRef(behaviorRef: BehaviorRef, ctx: MechanicHandlerContext): void {
  const mechanicId = BEHAVIOR_REF_TO_MECHANIC[behaviorRef.behaviorId];
  if (!mechanicId) {
    console.warn(`[MechanicRegistry] No mechanic for behaviorId: ${behaviorRef.behaviorId}`);
    return;
  }
  const handler = MECHANIC_REGISTRY.get(mechanicId);
  handler?.onActivate?.(ctx, behaviorRef.params ?? {}, {});
}
```

### 2.2 `src/physics/mechanics/` (directory)

One file per mechanic handler. Each wraps or extends existing PartPhysics/PhysicsEngine functions:

```
mechanics/
  velocityBurst.ts       → wraps existing force application
  attackAmplifier.ts     → wraps existing comboDamageMultiplier
  orbitMovement.ts       → wraps existing ArenaFeatureProcessor orbit
  freeSpinHandler.ts     → wraps PartPhysics.bearingFriction
  energyReserve.ts       → wraps PartPhysics.tickSpinInjection
  spinTransfer.ts        → wraps PartPhysics.computeSpinSteal
  railLock.ts            → new: Xtreme Dash rail logic
  centerPull.ts          → new: radial force toward arena center
  modeSwitch.ts          → new: stat set swap
  spinThresholdSwitch.ts → new: auto-mode on spin ratio
  defenseStance.ts       → wraps existing defense buff
  upperLaunch.ts         → wraps existing jump/airborne system
  smashImpact.ts         → new: radial outward force on contact
  burstSuppress.ts       → new: dynamic burstResistance boost
  staminaRecovery.ts     → wraps spin addition per tick
  magneticPull.ts        → new: directional magnetic force
  zeroGFloat.ts          → new: effectiveGravity reduction
  rotationReverse.ts     → wraps counterRotActive sequence
  contactDeflect.ts      → new: angle-cone damage reduction
  subPartBurst.ts        → wraps DetachedBodySchema lifecycle
  bearingDrift.ts        → new: surfaceFriction reduction
  weightShift.ts         → new: mass + knockback modifier
  spinEqualization.ts    → new: bidirectional spin transfer
  spinStealCoupling.ts   → wraps spinStealFactor transient
  rubberGrip.ts          → wraps gripFactor on collision
  springRecoil.ts        → new: spring force from Bound AR
  barragHit.ts           → new: multi-contact per frame
  spinDirectionBonus.ts  → new: counter-spin multiplier
  contactHeightGate.ts   → extends CP radial gate
  revivalSpin.ts         → new: conditional spin recovery
```

### 2.3 `src/constants/gimmicks.ts`

```typescript
export interface GimmickDef {
  id: string;
  mechanics: string[];           // mechanic IDs from MECHANIC_REGISTRY
  description: string;
  triggerCondition: string;      // human-readable
  modesSupported: string[];      // mode config IDs
  evidence: string;
}

export const GIMMICK_REGISTRY: Record<string, GimmickDef> = {
  // ... (all entries from phase-06-mechanics.md Section 4)
};
```

### 2.4 `src/utils/gimmickExpander.ts`

Converts a beyblade's `gimmickIds[]` into `MechanicInstance[]` at room creation time:

```typescript
export function expandGimmicks(
  gimmickIds: string[],
  gimmickDefs: Record<string, GimmickDef>
): MechanicInstance[] {
  const instances: MechanicInstance[] = [];
  for (const gimmickId of gimmickIds) {
    const def = gimmickDefs[gimmickId];
    if (!def) continue;
    for (const mechanicId of def.mechanics) {
      const inst = new MechanicInstance();
      inst.type = mechanicId;
      inst.params = JSON.stringify(getDefaultParams(mechanicId));
      inst.active = true;
      instances.push(inst);
    }
  }
  return instances;
}
```

### 2.5 `src/constants/beySystemDefs.ts`

Generation system defaults — stat ranges, available gimmicks, systemId values:

```typescript
export const BEY_SYSTEM_DEFS = {
  plastic_4layer:       { maxStats: [150,150,150], defaultGimmicks: [] },
  plastic_engine_gear:  { maxStats: [150,150,150], defaultGimmicks: ["energy_gear"] },
  plastic_magnacore:    { maxStats: [150,150,150], defaultGimmicks: ["magnacore_pull"] },
  hms:                  { maxStats: [150,150,150], defaultGimmicks: [] },
  mfb:                  { maxStats: [150,150,150], defaultGimmicks: [] },
  mfb_zerog:            { maxStats: [150,150,150], defaultGimmicks: ["gravity_mode"] },
  burst_s1:             { maxStats: [150,150,150], defaultGimmicks: [] },
  burst_god:            { maxStats: [150,150,150], defaultGimmicks: [] },
  burst_choz:           { maxStats: [150,150,150], defaultGimmicks: ["cho_z_spin_boost"] },
  burst_gt:             { maxStats: [150,150,150], defaultGimmicks: [] },
  burst_superking:      { maxStats: [150,150,150], defaultGimmicks: [] },
  burst_db:             { maxStats: [150,150,150], defaultGimmicks: ["burst_armor"] },
  burst_bu:             { maxStats: [150,150,150], defaultGimmicks: ["burst_armor"] },
  bx:                   { maxStats: [150,150,150], defaultGimmicks: ["xtreme_line"] },
  game_original:        { maxStats: [150,150,150], defaultGimmicks: [] },
};
```

---

## 3. Schema Additions (minimal — only genuinely new state)

```typescript
// In GameState.ts — add to Beyblade class:

@type([MechanicInstance])
mechanics = new ArraySchema<MechanicInstance>();

// Xtreme Dash state (approved — these fields already exist in GameState.ts per batch-001)
// xtremeEngaged: boolean    ← ALREADY IN SCHEMA
// xtremeRailProgress: float32 ← ALREADY IN SCHEMA
// xtremeRailId: string      ← ALREADY IN SCHEMA

// New fields to add:
@type("boolean")  gearCompatibleBit  = false;
@type("float32")  egBoostOmega       = 0;
@type("float32")  burstPressure      = 0;

// MechanicInstance class (new):
export class MechanicInstance extends Schema {
  @type("string")  type   = "";   // registry key
  @type("string")  params = "{}"; // static config JSON
  @type("string")  state  = "{}"; // runtime state JSON (charge, phase, etc.)
  @type("boolean") active = true;
}

// On ArenaState — scoring mode additions:
@type("string")  scoringMode   = "elimination"; // "elimination" | "points" | "survival"
@type("uint8")   pointsTarget  = 0;
@type("boolean") hasZeroG      = false;

// On GameState — player points for scoring mode:
@type({ map: "uint8" }) playerPoints = new MapSchema<number>();
```

---

## 4. New Firestore Collections (Rule 7)

| Collection | Schema | Seeder | Admin UI Route | Purpose |
|-----------|--------|--------|---------------|---------|
| `mechanic_defs` | `{ id, description, paramsSchema, handlerFile, events }` | `scripts/seed-mechanic-defs.ts` | `/admin/mechanics` | Mechanic type registry |
| `gimmick_defs` | `{ id, mechanics[], description, triggerCondition, modesSupported }` | `scripts/seed-gimmick-defs.ts` | `/admin/gimmicks` | Gimmick recipe registry |
| `camera_profiles` | `{ id, eventType, behavior, zoom, shake, duration }` | `scripts/seed-camera-profiles.ts` | `/admin/camera-profiles` | Per-event camera configs |
| `audio_profiles` | `{ id, eventType, sfxId, musicStingId, volume, spatial }` | `scripts/seed-audio-profiles.ts` | `/admin/audio-profiles` | Per-event audio configs |
| `script_definitions` | `{ id, scriptType, compiledBehaviorRefs[], triggers[], conditions[] }` | none (admin-authored) | `/admin/scripts/*` | Visual script truth |
| `script_editor_metadata` | `{ scriptId, nodePositions, viewport }` | none | `/admin/scripts/*` | Editor layout (non-gameplay) |
| `composition_blocks` | `{ id, category, inputs[], outputs[], defaultParams }` | `scripts/seed-composition-blocks.ts` | `/admin/scripts/blocks` | Block authoring catalog |

All must be added to `COLLECTIONS` constant in `client/src/lib/firebase.ts`.

---

## 5. BehaviorRef Dispatch Extension

The critical fix to `ArenaFeatureProcessor.executeBehavior()`:

```typescript
// Current (broken):
case 'movement.orbit':
  // ... only this case

// Required extension — add all cases:
protected executeBehavior(behaviorRef: BehaviorRef, beyId: string): void {
  const ctx = this.buildContext(beyId);
  
  switch (true) {
    case behaviorRef.behaviorId.startsWith('movement.'):
    case behaviorRef.behaviorId.startsWith('factor.'):
    case behaviorRef.behaviorId.startsWith('transform.'):
    case behaviorRef.behaviorId.startsWith('spawn.'):
    case behaviorRef.behaviorId.startsWith('arena.'):
      MechanicRegistry.dispatchBehaviorRef(behaviorRef, ctx);
      break;
    default:
      console.warn(`[executeBehavior] Unhandled behaviorId: ${behaviorRef.behaviorId}`);
  }
}
```

---

## 6. Combo effectId Fix

In `combos` Firestore collection and `server/constants/combos.ts`:

```typescript
// Add to Combo interface:
effectId?: string;  // references combo_effects collection

// In detectCombo() — after finding match:
if (combo.effectId) {
  const effect = this.comboEffectCache.get(combo.effectId);
  if (effect) {
    this.executeComboEffect(effect, beyId);
  }
}
```

Room `onCreate` must load `combo_effects` collection into `this.comboEffectCache`.

---

## 7. Special Move Pipeline Fix

Rooms must load from Firestore `special_moves` (new `SpecialMoveConfig` schema), NOT from `server/constants/specialMoves.ts` (old `SpecialMoveDef` schema).

```typescript
// In BattleRoom.onCreate():
const specialMoveDocs = await db.collection('special_moves').get();
for (const doc of specialMoveDocs.docs) {
  const config = doc.data() as SpecialMoveConfig;
  this.specialMoveCache.set(config.id, config);
}
// REMOVE: import { SPECIAL_MOVES } from '../constants/specialMoves';
```

The old `specialMoves.ts` constants file becomes a migration reference only — not runtime source.

---

## 8. Room onCreate Preload Order

All data loaded in `onCreate` before the simulation starts. Never in the tick loop.

```typescript
async onCreate(options: GameRoomOptions): Promise<void> {
  // 1. Arena config
  await this.loadArenaConfig(options.arenaId);
  
  // 2. Beyblade stats
  await this.loadBeybladeStats(playerBeyIds);
  
  // 3. Gimmick defs (for gimmickExpander)
  await this.loadGimmickDefs();
  
  // 4. Special moves (new SpecialMoveConfig schema)
  await this.loadSpecialMoves(uniqueSpecialMoveIds);
  
  // 5. Combo effects (effectId → ComboEffectDef)
  await this.loadComboEffects(uniqueComboEffectIds);
  
  // 6. Element types
  await this.elementTypeLoader.load();
  
  // 7. Expand gimmicks → MechanicInstance[] per bey
  for (const bey of this.state.beyblades.values()) {
    const instances = gimmickExpander.expandGimmicks(bey.gimmickIds, this.gimmickDefs);
    bey.mechanics.push(...instances);
  }
  
  // 8. Seed MechanicRegistry tick hooks
  this.mechanicDispatcher = new MechanicDispatcher(MECHANIC_REGISTRY, this.seededRand);
}
```

---

## 9. Client COLLECTIONS Constant Fix

In `client/src/lib/firebase.ts`, add all missing collections:

```typescript
export const COLLECTIONS = {
  // ... existing 35 collections ...
  
  // NEW — add these:
  MECHANIC_DEFS:          'mechanic_defs',
  GIMMICK_DEFS:           'gimmick_defs',
  CAMERA_PROFILES:        'camera_profiles',
  AUDIO_PROFILES:         'audio_profiles',
  SCRIPT_DEFINITIONS:     'script_definitions',
  SCRIPT_EDITOR_METADATA: 'script_editor_metadata',
  COMPOSITION_BLOCKS:     'composition_blocks',
  ARENA_FLOOR_GROUPS:     'arena_floor_groups',  // added session 25
  USERS:                  'users',               // added session 25
} as const;
```

> **Session 25 status**: `MECHANIC_DEFS`, `GIMMICK_DEFS`, `ARENA_FLOOR_GROUPS`, and `USERS` have been added. `CAMERA_PROFILES`, `AUDIO_PROFILES`, `SCRIPT_*`, `COMPOSITION_BLOCKS` not yet added (collections not yet implemented).

---

## 10. Admin UI Routes Required

All routes rebuilt from scratch (per user decision). No existing code is salvaged.

| Route | Component | Collections R/W | Priority |
|-------|-----------|----------------|---------|
| `/admin/beyblades` | BeybladeEditor | `beyblade_stats` | P0 |
| `/admin/arenas` | ArenaEditor | `arenas` | P0 |
| `/admin/special-moves` | SpecialMoveEditor (with step list) | `special_moves`, `combo_effects` | P0 |
| `/admin/combos` | ComboEditor (with effectId picker) | `combos`, `combo_effects` | P0 |
| `/admin/combo-effects` | ComboEffectEditor (ComboTask list) | `combo_effects` | P0 |
| `/admin/mechanics` | MechanicDefEditor | `mechanic_defs` | P1 |
| `/admin/gimmicks` | GimmickDefEditor (mechanic recipe) | `gimmick_defs`, `mechanic_defs` | P1 |
| `/admin/element-types` | ElementTypeEditor | `element_types` | P1 |
| `/admin/camera-profiles` | CameraProfileEditor | `camera_profiles` | P2 |
| `/admin/audio-profiles` | AudioProfileEditor | `audio_profiles` | P2 |
| `/admin/2d/` | Part CRUD + system editor | `beyblade_parts`, `beyblade_systems` | P1 |
| `/admin/arena-systems` | ArenaSystemEditor | `arena_systems` | P1 |
| `/admin/round-modifiers` | RoundModifierEditor | `round_modifiers` | P2 |
| `/admin/scripts/scratch` | Scratch-like block editor | `script_definitions` | P3 |
| `/admin/scripts/nodes` | Node graph editor | `script_definitions` | P3 |
| `/admin/scripts/code` | Raw script editor | `script_definitions` | P3 |
| `/admin/behavior-defs` | BehaviorDefEditor | `behavior_defs` | P2 |
| `/admin/animation-presets` | AnimationPresetEditor | `animation_presets` | P2 |

All editors use `SearchableSelect` / `SearchableMultiSelect` for all `<select>` elements.

---

## 11. Two-Engine Adapter Pattern (2D + 2.5D)

Per Rule 2, both simulation engines share the same mechanic handlers.
**The 2.5D engine is the game's depth/3D layer.** It uses shape makers and perspective warps rather than a true 3D physics library:

- **Shape makers** — Fourier profiles and arc-segment contact points describe part silhouettes; `renderRadius(θ)` warps sprites at runtime.
- **Perspective warps** — PixiJS tilt-stack (`arenaTiltOuter → arenaTiltScale → arenaTiltInner`) projects the arena as a tilted 3D plane.
- **Z-layer physics** — `beyTiltAngle`, `effectiveGravity`, and `ClimbingPhysics.ts` provide height, tilt, and vertical-surface behaviour.

```typescript
interface SimulationAdapter {
  applyForce(body: BodyRef, force: Vec2): void;
  getHeight(body: BodyRef): number;        // 2D: always 0; 2.5D: z-layer via beyTiltAngle
  applyAngularVelocity(body: BodyRef, omega: number): void;
  getContactNormal(a: BodyRef, b: BodyRef): Vec3;
}

class TwoDAdapter implements SimulationAdapter { /* wraps Matter.js */ }
class TwoPointFiveDAdapter extends TwoDAdapter { /* adds z-layer, shape makers, warp output */ }
```

Mechanic handlers call adapter methods, not physics library methods directly. This ensures parity across both engines.

---

## 12. Seed Script Inventory (new + existing)

| Script | Collection | Status | Priority |
|--------|-----------|--------|---------|
| `seed-beyblades.ts` | `beyblade_stats` | existing (needs gimmickIds added) | P0 |
| `seed-special-moves.ts` | `special_moves` | existing (needs SpecialMoveConfig migration) | P0 |
| `seed-combos.ts` | `combos` | existing (needs effectId added) | P0 |
| `seed-combo-effects.ts` | `combo_effects` | NEW | P0 |
| `seed-mechanic-defs.ts` | `mechanic_defs` | NEW | P1 |
| `seed-gimmick-defs.ts` | `gimmick_defs` | NEW | P1 |
| `seed-camera-profiles.ts` | `camera_profiles` | NEW | P2 |
| `seed-audio-profiles.ts` | `audio_profiles` | NEW | P2 |
| `seed-composition-blocks.ts` | `composition_blocks` | NEW | P3 |
| `seed-arenas.ts` | `arenas` | existing (needs arena feature data) | P1 |
| `seed-element-types.ts` | `element_types` | existing | done |
| `seed-arena-systems.ts` | `arena_systems` | existing | done |
| `seed-2d-parts.ts` | `beyblade_parts` | existing | done |
| `seed-bey-systems.ts` | `beyblade_systems` | existing | done |

---

[← Phase 10: Arena Implementation](phase-10-arena-implementation.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md) &nbsp;·&nbsp; [Phase 12: Seed Plan →](phase-12-seed-plan.md)

[← Phase 20: Code Generation](phase-20-codegen.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md)

---

# Phase 21 — Unified Foundation: BehaviorDefs · GeometryDefs · StatDefs

> **Stage 21** — Architectural concept: three universal definition layers underpin every data object in the game.
> Nothing in the content pipeline is hardcoded. Everything composes from these three primitives.
> This phase supersedes scattered bespoke fields across beyblade, arena, part, special-move, and combo configs.
>
> **Research plan alignment** (system-role-you-are-refactored-creek.md):
> - Rule 1 (Reuse Existing Stats First): `stat_defs` is a documentation/admin layer over existing runtime fields — no new server schema fields are added unless genuinely absent. The modifier stack resolves onto existing Beyblade schema fields only.
> - Rule 2 (Multi-Engine Support): All `MechanicInstance` behaviors are engine-agnostic (WHAT, not HOW). GeometryDef shapes feed 2D and 2.5D adapters independently. The 2.5D adapter is the game's depth/3D layer — shape makers and perspective warps replace a true 3D physics engine.
> - Rule 4 (Engine Capability First): This phase formalizes existing capability (`mechanic_defs`, existing `StatModifier`, existing `ContactPoint`) — it does not invent new runtime systems.
> - Rule 6 (Presentation is Cross-Cutting): Each `MechanicInstance` can carry presentation cues (camera, audio, VFX) as part of its params schema, touching all 9 presentation layers.

---

## 0. Core Principle

> **Anything that can happen in the game is either a GeometryDef (shape), a StatDef (number), or a BehaviorDef (action). There are no hardcoded behaviors — only data.**

Three definition layers exist in Firestore. Every game entity — beyblades, arenas, parts, special moves, combos, turret attacks — references these layers rather than carrying its own bespoke fields:

| Pillar | Collection | Purpose |
|--------|-----------|---------|
| **BehaviorDef** | `mechanic_defs` → `gimmick_defs` | Every action, effect, gimmick, special move, combo effect, arena feature behavior, turret attack behavior |
| **GeometryDef** | `geometry_defs` | Every physical shape: part contact zones, arena boundaries, feature zones, projectile shapes, beyblade silhouettes |
| **StatDef** | `stat_defs` | Every numeric attribute: beyblade stats, arena physics modifiers, part bonuses, match modifiers |

Composition rule: **new content requires no code — only new or combined definitions.**

---

## 1. Pillar 1 — BehaviorDef (mechanic_defs → gimmick_defs)

### 1.1 Current State

`mechanic_defs` (31 atomic handlers) and `gimmick_defs` (27 recipes) already exist and are seeded. Beyblades reference gimmicks via `gimmickIds[]`. The `gimmickExpander` loads these at `onCreate()` and produces a `MechanicInstance[]` used synchronously in the tick loop.

### 1.2 Expanded Scope

BehaviorDef is the behavior source for **every** system in the game, not only beyblade gimmicks:

| Entity | Current behavior source | Unified behavior source |
|--------|------------------------|------------------------|
| Beyblade gimmicks | `gimmickIds[]` → gimmick_defs ✅ | unchanged |
| Special moves | Hardcoded enum in `special_moves` collection | `mechanicRefs: MechanicInstance[]` on the special-move doc |
| Combo effects | `effectId` → `combo_effects` collection (separate enum) | `effectRefs: MechanicInstance[]` on the combo doc |
| Arena features (spin zones, gravity holes, bumps, directional zones) | Inline physics logic hardcoded in `ArenaFeatureProcessor` | Each feature has `behaviorGimmickId: string` OR `mechanicRefs: MechanicInstance[]` |
| Arena global modifiers | Bespoke fields: `staminaDrainMultiplier`, `qteEnabled`, etc. | `matchModifiers: StatModifier[]` (handled under Pillar 3) |
| Turret attacks | 175+ union entries, hardcoded physics per type | Each TurretConfig has `mechanicRefs: MechanicInstance[]` — union shrinks to geometry + behavior refs |
| Part behaviors (CoreGimmick, ConfigTrigger effects) | Hardcoded enum strings on part types | `mechanics: MechanicInstance[]` on the part/config doc |
| Obstacle effects (on-contact) | None — obstacles are static or switch-gated only | `onContactMechanics: MechanicInstance[]` optional |
| Water body effects | Hardcoded `decayMultiplier` on `WaterBodyConfig` | `mechanicRefs: MechanicInstance[]` allowing arbitrary drain/boost/debuff |

### 1.3 Universal Behavior Payload

`MechanicInstance` is the unit of behavior everywhere:

```typescript
interface MechanicInstance {
  mechanicId: string;                   // key in mechanic_defs (e.g. "velocity_burst")
  params: Record<string, unknown>;      // override defaults from mechanic_defs
  condition?: string;                   // evaluated expression: "spin < 0.4 * maxSpin"
  duration?: number;                    // ticks; undefined = permanent while attached
  priority?: number;                    // conflict resolution when multiple instances target same field
  sourceLabel?: string;                 // human-readable origin for admin UI display
}
```

A `GimmickDef` is a **named** collection of `MechanicInstance[]` with a reuse identifier. Everything behavioral ultimately decomposes to `MechanicInstance[]`.

### 1.4 New Mechanic IDs Needed

Beyond the 31 existing mechanics, these are required to cover all entity types:

| Mechanic ID | Purpose | Entity that needs it |
|-------------|---------|---------------------|
| `stamina_drain_rate` | Multiplies `spinDecayRate` globally | Arena global modifier (replaces `staminaDrainMultiplier` field) |
| `combo_window_scale` | Adjusts QTE response window width | Arena global modifier (replaces `qteWindowScaling`) |
| `arena_gravity` | Overrides gravity constant for the match | Arena global modifier (extends `zero_g_float` to arena scope) |
| `floor_friction_override` | Sets arena floor friction for all beys | Arena global modifier |
| `water_drag` | Per-tick velocity reduction inside zone | Water body feature |
| `water_spin_drain` | Per-tick spin reduction inside zone | Water body feature |
| `directional_push` | Applies directional force vector | Directional zone feature (replaces hardcoded `direction` + `strength` fields) |
| `bump_launch` | Upward + lateral recoil on contact | Bump feature (wraps `upper_launch` + `spring_recoil`) |
| `aura_damage` | AoE damage pulse centered on bey | Special move / turret (already partially covered by turret system) |
| `spin_boost_zone` | Per-tick spin increase inside zone | Spin zone feature, `applyTo: "spin"` |
| `orbit_force_zone` | Tangential force inside zone | Spin zone feature, `applyTo: "linear"` |

### 1.5 GimmickDef as Special-Move and Combo Container

Rather than separate `special_moves` and `combo_effects` collections with bespoke schemas, these entities become gimmick compositions:

**Special Move** = a GimmickDef with extra trigger metadata:
```typescript
// special_moves collection doc — new shape
{
  id: "stampede_rush",
  name: "Stampede Rush",
  gimmickId: "stampede_rush_gimmick",   // references gimmick_defs
  // OR inline:
  mechanicRefs: [
    { mechanicId: "velocity_burst", params: { forceMagnitude: 0.12, durationTicks: 8 } },
    { mechanicId: "attack_amplifier", params: { multiplier: 1.4, durationTicks: 30 } }
  ],
  costPower: 100,                       // StatModifier cost against stat_defs "bey.special_power"
  cooldownMs: 5000,
  beybladeTypes: ["attack", "balanced"],
  triggerType: "onActivate",            // "onActivate" | "tick" | "onCollision" | "auto"
  autoTriggerCondition?: "spin < 0.3"
}
```

**Combo Effect** = MechanicInstance[] replacing effectId:
```typescript
// combos collection doc — updated shape
{
  id: "power_thrust",
  sequence: ["attack", "attack", "attack"],
  cost: 25,
  effectRefs: [
    { mechanicId: "velocity_burst", params: { forceMagnitude: 0.07, durationTicks: 6 } },
    { mechanicId: "attack_amplifier", params: { multiplier: 1.25, durationTicks: 20 } }
  ],
  // effectId kept for backward compat during migration, becomes deprecated
  effectId?: "power_thrust_effect"
}
```

### 1.6 Behavior Pipeline (expanded)

```
Every entity's behavior:
  beyblade.gimmickIds[]
  part.mechanics: MechanicInstance[]
  special_move.mechanicRefs: MechanicInstance[]
  combo.effectRefs: MechanicInstance[]
  arena_feature.mechanicRefs: MechanicInstance[]
  turret_attack.mechanicRefs: MechanicInstance[]
  obstacle.onContactMechanics: MechanicInstance[]
        ↓ all resolve to
  MechanicInstance[]
        ↓ dispatched by
  MechanicRegistry[mechanicId].tick / onCollision / onActivate / passive
        ↓ modifies
  existing Beyblade schema fields (spin, velocity, damageMultiplier, etc.)
```

---

## 2. Pillar 2 — GeometryDef (geometry_defs)

### 2.1 New Collection: `geometry_defs`

Every physical shape in the game is described by a `GeometryDef`. Shared shapes are defined once and referenced by ID.

```typescript
interface GeometryDef {
  id: string;
  name: string;
  type: GeometryType;

  // Shape-specific fields (one of these is set):
  circle?: { radius: number };                                    // radius in cm
  ring?: { innerRadius: number; outerRadius: number };            // cm
  polygon?: { vertices: Array<{ x: number; y: number }> };        // cm, relative to center
  arcSegment?: {
    arcStart: number; arcEnd: number;                             // degrees 0–360
    radiusInner: number; radiusOuter: number;                     // cm
    lineThickness: number;                                        // cm
  };
  bezier?: { controlPoints: Array<{ x: number; y: number }>; resolution: number };
  fourier?: { harmonics: number[]; phases: number[] };            // radial profile r(θ)
  composite?: { children: GeometryRef[] };                        // union of shapes
  point?: Record<string, never>;                                  // dimensionless point

  // Spatial metadata:
  boundingRadius: number;    // cm — fast pre-check collision radius
  offsetX?: number;          // cm offset from parent center
  offsetY?: number;          // cm offset from parent center
  rotation?: number;         // degrees initial rotation
}

type GeometryType =
  | "circle" | "ring" | "polygon" | "arc_segment"
  | "bezier" | "fourier" | "composite" | "point";

interface GeometryRef {
  geometryId: string;   // references geometry_defs
  offsetX?: number;     // cm override
  offsetY?: number;     // cm override
  rotation?: number;    // degrees override
  scale?: number;       // uniform scale multiplier
}
```

### 2.2 Where GeometryDef Is Used

| Entity | Old approach | New approach |
|--------|-------------|--------------|
| Part contact points (`SystemContactPoint`) | Inline `angle/width/radius/thickness` OR `arcStart/arcEnd` fields | `geometry: GeometryRef` (ref to `geometry_defs`) — shape details live in the def |
| Arena boundary | `arenaRadius` / `width` / `height` scalar fields | `boundaryGeometryId: string` → `geometry_defs` circle or polygon |
| Spin zone area | `radiusCm: number` | `geometry: GeometryRef` — enables non-circular zones |
| Gravity hole area | `radiusCm: number` | `geometry: GeometryRef` |
| Bump shape | Point implied | `geometry: GeometryRef` — can be circular, polygon, line segment |
| Obstacle shape | `shape: "circle" \| "rectangle" \| "polygon"` + inline dimensions | `geometry: GeometryRef` |
| Trigger zone area | Inline `x/y/radiusCm` or `width/height` | `geometry: GeometryRef` |
| Projectile shape (`ServerProjectile`) | `radius?/length?/width?` ad-hoc fields | `geometryId: string` → `geometry_defs` |
| Beyblade visual silhouette | Fourier coefficients embedded in beyblade_stats | `visualGeometryId: string` → `geometry_defs` (fourier/bezier type) |
| Turret fire arc | Inline `attackRangeCm / aimAngle` | `fireZoneGeometryId: string` → geometry_defs arc_segment type |
| Water body zone | `shape: "circle" \| "oval" \| ...` + inline dims | `geometry: GeometryRef` |
| Switch activation zone | None (implied by turret/feature position) | `activationGeometry: GeometryRef` |

### 2.3 Standard Geometry Seed Set

These geometry primitives are seeded into `geometry_defs` and shared across the content pipeline:

| ID | Type | Description | Dimensions |
|----|------|-------------|------------|
| `circle_xs` | circle | Extra-small zone / point CP | r: 1 cm |
| `circle_sm` | circle | Small zone / tight CP | r: 2.5 cm |
| `circle_md` | circle | Standard feature zone | r: 5 cm |
| `circle_lg` | circle | Large feature zone | r: 10 cm |
| `circle_xl` | circle | Arena-wide zone | r: 20 cm |
| `ring_thin` | ring | Perimeter ring (AR/WD CPs) | r_in: 3 cm, r_out: 4 cm |
| `ring_wide` | ring | Wide defense CP band | r_in: 2 cm, r_out: 5 cm |
| `arc_smash` | arc_segment | Smash attack CP | 0–40°, r_in: 3.5, r_out: 4.5 cm |
| `arc_upper` | arc_segment | Upper attack CP | 300–60°, r_in: 3, r_out: 3.8 cm |
| `arc_wide` | arc_segment | Wide defensive contact | 0–120°, r_in: 2.5, r_out: 4 cm |
| `hex_ar` | polygon | 6-sided AR profile | 6 vertices, outerRadius: 4.5 cm |
| `square_sm` | polygon | Small square obstacle | 4 cm × 4 cm |
| `square_md` | polygon | Medium square obstacle | 8 cm × 8 cm |
| `rect_rail` | polygon | Xtreme rail segment | 15 cm × 1 cm |
| `fourier_round` | fourier | Round smooth bey silhouette | harmonics: [1, 0, 0] |
| `fourier_4pt` | fourier | 4-point star AR | harmonics: [1, 0.3, 0, 0.3] |
| `fourier_6pt` | fourier | 6-prong spiral AR | harmonics: [1, 0.2, 0, 0, 0, 0.2] |

### 2.4 ContactPoint → GeometryRef Migration

The existing `SystemContactPoint` gains a `geometryId` field. Both old inline fields and new geometry ref coexist during migration:

```typescript
// Before:
{ angle: 0, width: 40, radius: 38, thickness: 3, damageMultiplier: 1.5, material: "abs" }

// After (new geometry ref approach):
{
  geometryId: "arc_smash",          // geometry_defs reference
  damageMultiplier: 1.5,
  material: "abs",
  attackType: "smash",
  heightRange: { min: 8, max: 16 },
  // Legacy fields kept for backward compat:
  angle: 0, width: 40, radius: 38, thickness: 3
}
```

The renderer and physics engine read `geometryId` first when present; fall back to legacy fields when absent.

---

## 3. Pillar 3 — StatDef (stat_defs)

### 3.1 New Collection: `stat_defs`

Every numeric game attribute is typed, ranged, and described in `stat_defs`. This is the single source of truth for what every number means.

```typescript
interface StatDef {
  id: string;              // dot-namespaced: "bey.attack", "arena.stamina_drain", "part.grip_factor"
  name: string;            // display name
  category: StatCategory;
  type: "float" | "int" | "bool";
  min: number;
  max: number;
  default: number;
  step?: number;           // admin UI increment
  unit?: string;           // "rpm", "px/s", "multiplier", "degrees", "cm", "%"
  formula?: string;        // human-readable only — "1.0 + attack * 0.007"
  description: string;
  affectsPhysics: boolean; // true = server tick reads this; false = visual/meta only
}

type StatCategory =
  | "beyblade"     // bey.attack, bey.defense, bey.stamina, bey.speed, bey.spin_decay_rate…
  | "arena"        // arena.stamina_drain, arena.gravity, arena.floor_friction…
  | "part"         // part.grip_factor, part.recoil_factor, part.impact_absorption…
  | "match"        // match.time_limit, match.burst_threshold…
  | "modifier";    // transient: combo.damage_mult, special.power_cost…
```

### 3.2 StatModifier — Universal Stat Delta

Any entity can carry `StatModifier[]` to modify stat values. All stat mutations in the game flow through this type:

```typescript
interface StatModifier {
  statDefId: string;         // references stat_defs
  operation: StatOperation;
  value: number;
  condition?: string;        // expression: "spin < 0.4 * maxSpin", "inZone('spin_zone_1')"
  duration?: number;         // ticks; undefined = permanent while this entity is attached
  priority?: number;         // higher priority wins when two "set" ops target the same stat
  sourceLabel?: string;      // human-readable origin for admin display
}

type StatOperation =
  | "add"          // base + value
  | "multiply"     // base * value
  | "set"          // base = value (use with priority)
  | "clamp_min"    // max(base, value)
  | "clamp_max";   // min(base, value)
```

### 3.3 Standard stat_defs Seed Set

#### Beyblade stats
| ID | Type | Min | Max | Default | Unit | Notes |
|----|------|-----|-----|---------|------|-------|
| `bey.attack` | int | 0 | 150 | 60 | pts | Attack archetype score |
| `bey.defense` | int | 0 | 150 | 60 | pts | Defense archetype score |
| `bey.stamina` | int | 0 | 150 | 60 | pts | Stamina archetype score |
| `bey.speed` | int | 0 | 100 | 50 | pts | Speed stat |
| `bey.max_spin` | float | 100 | 3000 | 2000 | rpm | Max spin value |
| `bey.spin_decay_rate` | float | 1 | 20 | 8 | rpm/s | Passive spin loss per second |
| `bey.damage_multiplier` | float | 0.5 | 3.0 | 1.0 | x | Outgoing damage multiplier |
| `bey.damage_reduction` | float | 0.0 | 0.9 | 0.0 | x | Fraction of incoming damage absorbed |
| `bey.burst_resistance` | int | 0 | 100 | 50 | pts | Resistance to burst KO |
| `bey.mass` | float | 20 | 80 | 40 | g | Physical mass |
| `bey.radius` | float | 1.5 | 5.0 | 3.0 | cm | Collision radius |
| `bey.grip_factor` | float | 0.0 | 1.0 | 0.4 | — | Floor contact grip |
| `bey.aggressiveness` | float | 0.0 | 1.0 | 0.5 | — | Outward orbit force |
| `bey.recoil_factor` | float | 0.0 | 1.0 | 0.3 | — | Bounce-back on collision |
| `bey.special_power` | float | 0 | 150 | 0 | pts | Special move charge pool |
| `bey.jump_force` | float | 0 | 1.0 | 0.0 | N | Upward jump impulse |
| `bey.tilt_resistance` | float | 0 | 1.0 | 0.3 | — | Resistance to tilt/wobble |

#### Arena stats
| ID | Type | Min | Max | Default | Unit | Notes |
|----|------|-----|-----|---------|------|-------|
| `arena.stamina_drain_mult` | float | 0.1 | 5.0 | 1.0 | x | Global spin decay multiplier |
| `arena.gravity` | float | 0.0 | 2.0 | 1.0 | x | Gravity multiplier |
| `arena.floor_friction` | float | 0.0 | 1.0 | 0.5 | — | Arena floor friction coefficient |
| `arena.tilt_angle` | float | 0 | 360 | 0 | ° | Arena tilt angle |
| `arena.tilt_force` | float | 0 | 0.2 | 0.04 | N/kg | Tilt lateral force per kg per sin(angle) |
| `arena.combo_window_scale` | float | 0.1 | 3.0 | 1.0 | x | Multiplier on QTE window width |
| `arena.damage_scale` | float | 0.1 | 3.0 | 1.0 | x | Global damage scale |
| `arena.burst_threshold_scale` | float | 0.5 | 2.0 | 1.0 | x | Global burst threshold multiplier |

#### Part stats
| ID | Type | Min | Max | Default | Unit | Notes |
|----|------|-----|-----|---------|------|-------|
| `part.weight` | float | 0.5 | 20 | 3.0 | g | Part mass contribution |
| `part.outer_radius` | float | 1 | 6 | 4 | cm | Outer geometry radius |
| `part.inner_radius` | float | 0 | 5 | 1.5 | cm | Inner bore radius |
| `part.height` | float | 0.5 | 5 | 1.5 | cm | Part height |
| `part.grip_factor` | float | 0.0 | 1.0 | 0.4 | — | Floor/contact grip |
| `part.recoil_factor` | float | 0.0 | 1.0 | 0.3 | — | Recoil on collision |
| `part.impact_absorption` | float | 0.0 | 0.9 | 0.1 | — | Force absorbed before reaching WD |
| `part.bearing_friction` | float | 0.0 | 1.0 | 0.5 | — | 0 = frictionless bearing |
| `part.torque_efficiency` | float | 0.1 | 1.0 | 0.95 | — | Spin transmission through mechanism |
| `part.moment_of_inertia` | float | 0.1 | 20 | 5 | g·cm² | Rotational inertia (affects wobble) |

### 3.4 Where StatModifier Is Used

| Entity | Old approach | New approach |
|--------|-------------|--------------|
| Beyblade base stats | Inline scalar fields: `attack: 70, defense: 80, stamina: 60` | `statProfile: StatModifier[]` — `[{ statDefId: "bey.attack", operation: "set", value: 70 }, ...]` |
| Part stat contributions | Per-type inline fields (`gripFactor`, `recoilFactor`, `bearingFriction`) | `statModifiers: StatModifier[]` — e.g. `[{ statDefId: "part.bearing_friction", operation: "set", value: 0.02 }]` |
| Arena match modifiers | Bespoke top-level fields (`staminaDrainMultiplier`, `backgroundColor`, etc.) | `matchModifiers: StatModifier[]` — e.g. `[{ statDefId: "arena.stamina_drain_mult", operation: "multiply", value: 2.0 }]` |
| Combo power cost | `cost: number` (flat points) | `costModifiers: [{ statDefId: "bey.special_power", operation: "add", value: -25 }]` |
| Special move power cost | `costPower: number` | `costModifiers: StatModifier[]` against `"bey.special_power"` |
| Gear stat bonuses | `statModifiers: StatModifier[]` ✅ already exists | unchanged — already correct format |
| Arena feature zone modifiers | None / hardcoded | `zoneModifiers: StatModifier[]` applied while bey is inside zone |

### 3.5 Modifier Resolution Stack

The stat modifier stack is evaluated server-side at each relevant event. Order of operations:

```
base value (from stat_defs.default OR beyblade's statProfile "set" op)
  + part.statModifiers (passive, merged at registerBey())
  + gear.statModifiers (passive, merged at registerBey())
  + arena.matchModifiers (applied at match start, refreshed if arena changes)
  + active gimmick MechanicInstance effects (tick / onCollision / onActivate)
  + active zone modifiers (while bey inside zone)
  + active combo/special transient modifiers (timer-based)
= resolved stat value (clamped to [statDef.min, statDef.max])
```

---

## 4. Application to Every Entity Type

### 4.1 Beyblade Config (`beyblade_stats`)

| Field category | Old | New |
|----------------|-----|-----|
| Base numeric stats | `attack: 70, defense: 80, stamina: 60, speed: 50` etc. | `statProfile: StatModifier[]` (set ops referencing stat_defs) + keep scalar fields for backward compat |
| Gimmicks | `gimmickIds: string[]` ✅ | unchanged |
| Special move | `specialMoveId: string` → `special_moves` | `specialMoveId: string` (points to special_moves doc, which now uses mechanicRefs) |
| Combos | `comboIds: string[]` ✅ | unchanged (combos now carry effectRefs internally) |
| Visual geometry | Fourier coefficients in separate type file | `visualGeometryId: string` → geometry_defs |
| Physics overrides | `jumpForce, jumpHeight, burstResistance` inline | `statProfile` entries or kept as explicit fields for now |

### 4.2 Parts Config (`beyblade_parts/*`)

All part types gain three standardized fields alongside their existing type-specific fields:

```typescript
// Added to BasePart (all 9 part types):
statModifiers:   StatModifier[];     // stat delta contributions
mechanics:       MechanicInstance[]; // behavior this part applies when equipped
geometryId?:     string;             // primary geometry (for admin preview; physics uses existing CPs)
```

Contact points gain a geometry reference:
```typescript
// SystemContactPoint gains:
geometryId?: string;   // references geometry_defs; supplement to existing angle/width/radius/thickness
```

**Tip parts** — the `tipShape` enum and tip-specific fields remain but are supplemented by `statModifiers` for the numeric deltas. The movement behavior (erratic vs. stationary) moves into `mechanics: MechanicInstance[]`:

| tipShape | Old implementation | mechanic equivalent |
|----------|--------------------|---------------------|
| `flat` | Hardcoded aggressive orbit | `orbit_movement` with high `orbitSpeed`, `velocity_burst` tendency |
| `sharp` | Low decay stationary | `surface_friction_modifier` low value |
| `rubber_flat` | High grip aggressive | `rubber_grip` passive |
| `ball` (B:D) | Low friction drift | `bearing_drift` passive |
| `bearing_defense` | `bearingFriction: 0.02, freeSpin: true` | `free_spin` + `bearing_drift` mechanics |

**Core parts** — `CoreGimmick` enum entries become gimmick references:

| CoreGimmick | Gimmick equivalent |
|-------------|-------------------|
| `engine_gear` | `gimmickId: "engine_gear"` |
| `spin_injection` | `gimmickId: "stamina_recovery"` (or new `spin_injection` gimmick) |
| `counter_rotation` | `gimmickId: "counter_rotation"` |
| `speed_boost` | `gimmickId: "xtreme_dash"` or `velocity_burst` mechanic |
| `magnetic` | `gimmickId: "magnacore_pull"` or `magnacore_repel` |

### 4.3 Arena Config (`arenas`)

The arena gains three unified fields alongside all existing feature-specific arrays:

```typescript
// Added to ArenaConfig:
boundaryGeometryId?: string;              // replaces arenaRadius/width/height for non-circular arenas
matchModifiers: StatModifier[];           // replaces bespoke physics fields
randomModifierPool?: string[];            // IDs of StatModifiers or MechanicInstances to draw from

// Features updated — each type gains:
SpinZoneConfig:     + geometry: GeometryRef, mechanicRefs: MechanicInstance[], zoneModifiers: StatModifier[]
GravityHoleConfig:  + geometry: GeometryRef, mechanicRefs: MechanicInstance[]
BumpConfig:         + geometry: GeometryRef, mechanicRefs: MechanicInstance[]
ObstacleConfig:     + geometry: GeometryRef, onContactMechanics: MechanicInstance[]
TriggerZoneConfig:  + geometry: GeometryRef, activationMechanics: MechanicInstance[]
WaterBodyConfig:    + geometry: GeometryRef, mechanicRefs: MechanicInstance[]
TurretConfig:       + mechanicRefs: MechanicInstance[], fireZoneGeometryId?: string
```

**matchModifiers migration example:**

| Old field | New StatModifier |
|-----------|-----------------|
| `staminaDrainMultiplier: 2.0` | `{ statDefId: "arena.stamina_drain_mult", operation: "multiply", value: 2.0 }` |
| `qteEnabled: false` | `{ statDefId: "arena.combo_window_scale", operation: "set", value: 0 }` |
| `tiltAngle: 45` | `{ statDefId: "arena.tilt_angle", operation: "set", value: 45 }` |
| `backgroundColor: "#1a0a2e"` | stays as-is (visual only, not a stat) |

Old fields are kept for backward compatibility during migration; `matchModifiers` takes precedence when present.

### 4.4 Special Moves (`special_moves`)

```typescript
// Updated special_moves doc shape:
{
  id: "stampede_rush",
  name: "Stampede Rush",
  description: "Linear force burst in facing direction + spin boost",
  beybladeTypes: ["attack", "balanced"],
  triggerType: "onActivate",
  autoTriggerCondition?: string,          // expression for auto-fire
  costPower: 100,                         // cost deducted from bey.special_power
  cooldownMs: 5000,
  mechanicRefs: MechanicInstance[],       // NEW — replaces hardcoded effect enum
  // Legacy fields kept for backward compat:
  type?: "attack" | "defense" | "stamina" | "balanced",
  mechanicChain?: string[]                // deprecated in favor of mechanicRefs
}
```

All 4 existing special moves expressed as mechanicRefs:

| Special Move | mechanicRefs |
|---|---|
| `stampede_rush` | `[velocity_burst(force:0.12), attack_amplifier(mult:1.4, ticks:30)]` |
| `gyro_anchor` | `[defense_stance(ticks:90, reducBoost:0.3), stamina_recovery(rate:5, max:100)]` |
| `spin_recovery` | `[orbit_movement(radius:150, speed:0.8), stamina_recovery(rate:3, max:80)]` |
| `tactical_burst` | `[velocity_burst(force:0.06), stamina_recovery(rate:2, max:40)]` |

### 4.5 Combos (`combos`)

```typescript
// Updated combo doc shape:
{
  id: "power_thrust",
  sequence: ["attack", "attack", "attack"],
  cost: 25,
  type: "universal",
  windowMs: 500,
  cooldownMs: 2000,
  effectRefs: MechanicInstance[],    // NEW — replaces effectId lookup
  // Legacy kept:
  effectId?: string                  // deprecated
}
```

All 8 combos expressed as effectRefs:

| ID | effectRefs |
|----|-----------|
| `quick-dash-l` | `[velocity_burst(dir:"left", force:0.04, ticks:5)]` |
| `quick-dash-r` | `[velocity_burst(dir:"right", force:0.04, ticks:5)]` |
| `guard-tap` | `[defense_stance(ticks:40, reducBoost:0.2)]` |
| `feint` | `[velocity_burst(dir:"retreat", force:0.03), bearing_drift(ticks:10)]` |
| `riposte` | `[attack_amplifier(mult:1.2, ticks:25), velocity_burst(force:0.03)]` |
| `pivot-strike` | `[velocity_burst(force:0.05), attack_amplifier(mult:1.15, ticks:20)]` |
| `power-thrust` | `[velocity_burst(force:0.07, ticks:6), attack_amplifier(mult:1.25, ticks:20)]` |
| `spin-leech-jab` | `[spin_transfer(stealFactor:0.25, ticks:8), orbit_movement(radius:80, speed:0.5)]` |

### 4.6 Turret Attacks (`TurretConfig.attackType`)

The 175+ union entries in `TurretAttackType` represent the current hardcoded approach. Under the unified foundation, turret attacks become compositions:

```typescript
// Updated TurretConfig:
{
  id: string,
  x: number, y: number,         // position in cm (existing)
  attackType: TurretAttackType, // kept for backward compat during transition
  mechanicRefs: MechanicInstance[],  // NEW — the actual behavior
  fireZoneGeometryId?: string,  // geometry_defs arc or circle for fire area
  statModifiers?: StatModifier[], // modifiers applied to targeted beys
  // ... existing fields
}
```

The long-term goal: `attackType` union shrinks to a handful of **delivery mechanisms** (`projectile`, `aoe_pulse`, `beam`, `buff_target`, `zone_field`, `phase_transform`). The actual effect is fully described by `mechanicRefs`. This means new turret attack types require only data, not code.

**Delivery mechanism equivalents:**

| Delivery type | mechanicRefs pattern |
|--------------|---------------------|
| `projectile` | `[velocity_burst(toward target)]` + projectile geometry |
| `aoe_pulse` | `[smash_impact(radius)]` or `[aura_damage(radius, force)]` |
| `beam` | `[velocity_burst(along axis)]` with beam geometry |
| `buff_target` | `[attack_amplifier / stamina_recovery / zero_g_float]` |
| `zone_field` | `[orbit_force_zone / water_drag / directional_push]` |
| `phase_transform` | `[mode_switch / rotation_reverse / weight_shift]` |

---

## 5. New Firestore Collections

| Collection | Purpose | Seed script | Admin route |
|-----------|---------|-------------|-------------|
| `geometry_defs` | Shared geometry primitives | `npm run seed:geometry` | `/admin/geometry-defs` |
| `stat_defs` | All typed stat definitions | `npm run seed:stat-defs` | `/admin/stat-defs` |

These join the existing `mechanic_defs` and `gimmick_defs` as the four definition layer collections.

### `geometry_defs` document schema

```typescript
{
  id: string,
  name: string,
  type: GeometryType,
  // shape fields (one populated):
  circle?: { radius: number },
  ring?: { innerRadius: number, outerRadius: number },
  polygon?: { vertices: Array<{x,y}> },
  arcSegment?: { arcStart, arcEnd, radiusInner, radiusOuter, lineThickness },
  fourier?: { harmonics: number[], phases: number[] },
  composite?: { children: GeometryRef[] },
  // metadata:
  boundingRadius: number,
  description: string
}
```

### `stat_defs` document schema

```typescript
{
  id: string,          // "bey.attack", "arena.gravity", etc.
  name: string,
  category: StatCategory,
  type: "float" | "int" | "bool",
  min: number,
  max: number,
  default: number,
  step?: number,
  unit?: string,
  formula?: string,    // human-readable only
  affectsPhysics: boolean,
  description: string
}
```

---

## 6. Admin Form Changes

All admin forms gain three standard control panels. These are used to author BehaviorDef, GeometryDef, and StatDef references inline.

### 6.1 Behavior Panel

Appears on: BeybladeEditPage, SpecialMovesPage, CombosPage, ArenaConfigurator (all feature tabs), PartTypeFields, TurretsTab.

```
┌─ Behavior ──────────────────────────────────────────────────────────┐
│ [+ Add Mechanic]  [+ Add Gimmick]                                   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ #1  velocity_burst    ▼        [Edit Params]  [Remove]      │   │
│  │     forceMagnitude: 0.07  durationTicks: 6                  │   │
│  └─────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ #2  attack_amplifier  ▼        [Edit Params]  [Remove]      │   │
│  │     multiplier: 1.25  durationTicks: 20                     │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

- `[+ Add Mechanic]` — SearchableSelect from `mechanic_defs` by name/category; adds a `MechanicInstance` row
- `[+ Add Gimmick]` — SearchableSelect from `gimmick_defs`; expands inline to show constituent mechanics
- Each row: mechanic label, inline JSON params editor (collapsed by default), remove button

### 6.2 Geometry Panel

Appears on: Part contact point editors, ArenaConfigurator (feature/obstacle cards), PartTypeFields shape section, TurretsTab fire-zone config.

```
┌─ Geometry ──────────────────────────────────────────────────────────┐
│ Source:  [From Library ▼]  [Define Inline ▼]                        │
│                                                                     │
│ Library pick:  [arc_smash  (arc_segment, r: 3.5–4.5 cm)  ▼]       │
│ Offset X: [  0.0 cm ]   Offset Y: [  0.0 cm ]   Rotation: [ 0° ] │
│                                                                     │
│ [SVG Preview]                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

- "From Library" — SearchableSelect from `geometry_defs` with type labels
- "Define Inline" — shows type picker + shape-specific fields; saves as embedded geometry (not to `geometry_defs`)
- SVG preview updates live as fields change

### 6.3 Stats Panel

Appears on: BeybladeEditPage (base stats), ArenaConfigurator → BasicsTab (match modifiers), PartTypeFields (stat contributions), SpecialMovesPage (cost), CombosPage (cost).

```
┌─ Stats / Modifiers ─────────────────────────────────────────────────┐
│ [+ Add Modifier]                                                    │
│                                                                     │
│  bey.attack            [set ▼]   [ 70 ]   permanent    [Remove]   │
│  bey.defense           [set ▼]   [ 80 ]   permanent    [Remove]   │
│  bey.stamina           [set ▼]   [ 60 ]   permanent    [Remove]   │
│  bey.grip_factor       [add ▼]   [0.1]    permanent    [Remove]   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

- `[+ Add Modifier]` — SearchableSelect from `stat_defs` by name/category; adds a `StatModifier` row
- Each row: stat name, operation selector, value input, optional condition expression, optional duration, remove

### 6.4 Per-Form Adoption

| Form / Page | Behavior Panel | Geometry Panel | Stats Panel |
|-------------|---------------|----------------|-------------|
| BeybladeEditPage | gimmickIds (existing) | visualGeometryId picker | statProfile (replaces inline attack/defense/stamina fields) |
| SpecialMovesPage | mechanicRefs | — | costModifiers |
| CombosPage | effectRefs | — | costModifiers |
| ArenaConfigurator — BasicsTab | — | boundaryGeometryId | matchModifiers (replaces bespoke physics fields) |
| ArenaConfigurator — FeaturesTab | per-feature mechanicRefs | per-feature geometry | per-feature zoneModifiers |
| ArenaConfigurator — ObstaclesTab | onContactMechanics | geometry picker (replaces shape dropdown + dims) | — |
| ArenaConfigurator — TurretsTab | mechanicRefs | fireZoneGeometryId | — |
| ArenaConfigurator — WaterBodiesTab | mechanicRefs | geometry picker (replaces shape dropdown) | — |
| ArenaConfigurator — SwitchesTab | onActivateMechanics | activationGeometryId | — |
| PartTypeFields — AR | mechanics | CP geometry picker | statModifiers |
| PartTypeFields — WD | — | — | statModifiers |
| PartTypeFields — Tip | mechanics (replaces tipShape behavior) | — | statModifiers |
| PartTypeFields — Core | mechanics (replaces CoreGimmick enum) | — | statModifiers |
| PartTypeFields — Casing | — | — | statModifiers |
| PartTypeFields — Gear | mechanics | contactPoint geometry | statModifiers (already exists) |
| PartTypeFields — SubPart | mechanics | — | statModifiers |

---

## 7. Seed Plan for New Collections

### 7.1 geometry_defs seed (`scripts/seed-geometry.js`)

16 standard shapes covering all current usage patterns (see Section 2.3 table). Each document includes a description and an SVG path string for the admin preview renderer.

### 7.2 stat_defs seed (`scripts/seed-stat-defs.js`)

~35 definitions covering all three categories (beyblade, arena, part). See Section 3.3 table. Admin UI reads this collection to populate all SearchableSelect dropdowns in the Stats Panel.

### 7.3 Order in `seed:all`

```
seed:stat-defs     ← first (no dependencies)
seed:geometry      ← first (no dependencies)
seed:mechanics     ← already first
seed:gimmicks      ← depends on mechanics
seed:combos        ← updated to include effectRefs
seed:special-moves ← updated to include mechanicRefs
seed:beyblades     ← depends on gimmicks, stat_defs
seed:arenas        ← depends on geometry_defs, stat_defs
seed:2d-parts      ← depends on geometry_defs, stat_defs
```

---

## 8. The "Make Anything" Guarantee

With the three-pillar system fully in place, creating any new game content requires only data authoring in the admin UI:

| "I want to make..." | What you do | Code changes needed |
|--------------------|-------------|-------------------|
| New beyblade ability | Create/pick gimmick_def, assign to beyblade's gimmickIds | None |
| New beyblade type | Define statProfile via StatModifiers, assign gimmicks | None |
| New arena feature behavior | Pick mechanics in Behavior Panel for the feature | None |
| New arena type (non-circular) | Define polygon GeometryDef, reference as boundaryGeometryId | None |
| New special move | Author mechanicRefs in SpecialMovesPage | None |
| New combo effect | Author effectRefs in CombosPage | None |
| New turret attack | Assign mechanicRefs to TurretConfig | None (pending turret migration) |
| New obstacle that damages | Set onContactMechanics on the obstacle | None |
| New part that gives stat bonus | Add StatModifier in PartTypeFields Stats Panel | None |
| New arena-wide modifier | Add StatModifier to matchModifiers in BasicsTab | None |
| New stat to track | Add to stat_defs seed, reference everywhere | None |
| New behavior primitive | Add to mechanic_defs + implement handler | One handler file |
| New shape primitive | Add to geometry_defs seed | None (uses existing renderers) |

The only time code changes are needed is when adding a truly new **atomic mechanic handler** that doesn't exist yet. Every composition, combination, tuning, and new content type above that level is pure data.

---

## 9. Migration Strategy

The three-pillar system is additive. All existing fields remain. New fields (`statProfile`, `mechanicRefs`, `effectRefs`, `geometryId`, `matchModifiers`) are optional and coexist with old fields.

**Phase A — seed only**: Add `geometry_defs` and `stat_defs` collections. No code changes.

**Phase B — reference in parts and beyblades**: Add `statModifiers` and `mechanics` fields to part docs. Admin forms gain panels. Resolver reads new fields when present.

**Phase C — arena features**: ArenaConfigurator gains Behavior/Geometry/Stats panels for each feature type. Feature docs gain `mechanicRefs` and `geometry` refs.

**Phase D — special moves and combos**: SpecialMovesPage and CombosPage gain Behavior panels. Docs gain `mechanicRefs`/`effectRefs`.

**Phase E — turret migration**: TurretAttackType union gradually deprecated. `mechanicRefs` replaces hardcoded handlers.

**Phase F — beyblade statProfile**: BeybladeEditPage gains Stats Panel. Scalar fields become secondary (computed from statProfile). Full backward compat preserved.

---

## Implementation Status (audit 2026-05-24)

| Component | Status | Notes |
|-----------|--------|-------|
| `geometry_defs` collection in COLLECTIONS | ✅ Done | `firebase.ts` line 67 |
| `stat_defs` collection in COLLECTIONS | ✅ Done | `firebase.ts` line 68 |
| `mechanic_defs` + `gimmick_defs` in COLLECTIONS | ✅ Done | `firebase.ts` lines 65–66 |
| `/admin/geometry-defs` `GeometryDefsPage.tsx` | ✅ Done | Admin page exists |
| `/admin/stat-defs` `StatDefsPage.tsx` | ✅ Done | Admin page exists |
| `/admin/mechanic-defs` + `/admin/gimmick-defs` | ✅ Done | Admin pages exist |
| MechanicRegistry 31 handlers | ✅ Done | `server/physics/MechanicRegistry.ts` lines 48–79 |
| Phase 24 mechanic stubs (`authorityBlend`, `steeringForce`, `beyDecision`, `naturalMotion`) | ❌ Missing | Need 4 stub files + MechanicRegistry imports |
| `geometry_defs` type file `geometryDef.ts` | ❓ Verify | Admin page exists but type content needs checking vs Phase 21 spec |
| `stat_defs` type file `statDef.ts` | ❓ Verify | Admin page exists but type content needs checking |

---

[← Phase 20: Code Generation](phase-20-codegen.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md)

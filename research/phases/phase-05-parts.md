# Phase 05 — 2.5D Part System Research

**Source files examined:**
- `shared/types/beybladeSystem.ts` — canonical type definitions for all part slots, contact points, pockets, shape math
- `server/physics/PartPhysics.ts` — server-side physics extensions: material resolution, tip stats, pocket balls, stat modifiers, detachment, spin injection, counter-rotation, clash system
- `server/rooms/PartSystemManager.ts` — per-room, per-bey state machine that wires the part library into existing room tick loops
- `server/physics/PhysicsEngine.ts` — core Matter.js engine; contains `getContactPointMultiplier()` and `checkRadialContactMatch()`
- `server/rooms/schema/GameState.ts` — Colyseus schema for `Beyblade` (lists all synced 2.5D fields)
- `scripts/seed-2d-parts.js` — 19 seed entries across 7 collections; authoritative example data
- `linka/beys/` — lore reference files for real beyblade part behavior

---

## 1. Part Type Catalog

The system defines **9 part slot types** (`PartTypeKey`). The TypeScript union `AnyPart` covers all 9. The `PartLayer` enum (`bit_beast | ar | wd | tip | core | casing | spin_track | sub_part | gear`) maps directly to Firestore collection names via `PART_TYPE_COLLECTION` (exported from `beybladeConstants.ts`).

### 1.1 Attack Ring (`ar` / `ARPart`)

**Firestore collection:** `attack_ring_parts`

The primary collision layer. Every beyblade has exactly one AR. The AR's contact points define most of the offensive damage profile.

**Physics parameters contributed:**
| Field | Type | Purpose |
|-------|------|---------|
| `contactPoints` | `SystemContactPoint[]` | Defines where and how the AR deals and receives collision damage |
| `recoilFactor` | `number` (0.1–1.0) | How far the bey bounces back on hit; high = rubber-like absorption, low = stiff plastic rebound. Hidden stat. |
| `smashEfficiency` | `number` (0–1) | Fraction of kinetic energy transferred on a smash-type CP hit. Hidden. |
| `upperAttackBonus` | `number` (multiplier) | Applied when this AR's CP sweeps under the opponent WD (upper-attack geometry). Hidden. |
| `aerodynamicProfile` | `"compact"|"winged"|"spherical"` | Affects orbit stability near the arena edge. Hidden. |
| `statModifiers` | `StatModifier[]` | Universal modifier hooks (e.g. `on_hit_opponent` → add spinBoost). |
| `materials` | `MaterialBand[]` | Material coverage bands; each band's material drives MATERIAL_STATS multipliers. |
| `dimensions` | `PartDimensions` | `height`, `outerRadius`, `innerRadius` (all mm). |

**Special geometry types:**
- `FourierRadialProfile` in `geometry.fourierProfile` — compact harmonic expansion r(θ). Used as the base for CP warp math.
- `BezierPath` in `geometry.bezierPath` — preferred for renderer when present; 48–120 polygon cache.
- `PartShape.preset` — `circle | ring | star3 | star4 | star6 | triangle | square | hexagon` (fallback when no Bezier/Fourier data).

**Contact point shapes:** Both legacy and arc-segment (see Section 2).

**Configuration system:** `ARPart.configurations` overrides `contactPoints` and/or `dimensions` per named config. Config triggers are evaluated via `isTriggerMet()` in `PartPhysics.ts`.

**Real-world analogs from linka research:**
- Tornado Wing: 3-prong spiral, 3 CPs at 0°/120°/240°, damageMultiplier 1.3–1.8, material `abs`
- Scissor Attacker: X-cross 4 CPs at 45°/135°/225°/315°, `upper` attack type
- Spike Defense: 8 radial spikes, material `metal`, counter-attack profile
- Round Stamina: 2 wide CPs (width 80), material `pom`, minimal drag

---

### 1.2 Weight Disk (`wd` / `WDPart`)

**Firestore collection:** `weight_disk_parts`

Sits between the AR and the Blade Base/Casing. Primary job is rotational inertia (moment of inertia) and gyroscopic stability. The WD also contributes CPs at a smaller radius than the AR, enabling hits that "reach under" the AR geometry.

**Physics parameters contributed:**
| Field | Type | Purpose |
|-------|------|---------|
| `weight` | `number` (grams) | Added to total bey mass; also used in I = Σ(m × r²) computation |
| `momentOfInertia` | `number` (kg·mm²) | Explicit override; if absent, computed as I = weight × outerRadius². Controls wobble growth rate. |
| `gyroscopicStability` | `number` (0.0–1.0) | Suppresses wobbleAmplitude growth per tick. Used in `applyGyroscopicStability()`. |
| `spinTransferEfficiency` | `number` (0.0–1.0) | Co-axial spin-steal efficiency — how much spin is transferred when a spin-steal contact happens at WD height. |
| `contactPoints` | `SystemContactPoint[]` | WD-level CPs. Radial gate in PhysicsEngine ensures these only fire at WD's smaller radius. |
| `statModifiers` | `StatModifier[]` | Universal modifier hooks. |

**WD categories** (`WDCategory`): `round | wide | heavy | ten_balance | six_balance | eight_balance | custom`

These are descriptive labels only — they do NOT override geometry. The actual physics come from `weight`, `momentOfInertia`, and `outerRadius`.

**Example data from seed:**
- Ten Heavy: weight 10g, outerRadius 44mm, `heavy` category. Maximum inertia.
- Eight Balance: weight 8g, outerRadius 40mm, `star-8` geometry. Versatile.
- Six Attack: weight 6g, outerRadius 36mm, `hexagon` geometry. Lighter = faster spin-up.

---

### 1.3 Tip (`tip` / `TipPart`)

**Firestore collection:** `tip_parts`

The contact surface with the arena floor. Determines movement pattern (erratic/aggressive vs stationary/stamina), grip, spin decay, and spin-steal resistance.

**Physics parameters contributed:**
| Field | Type | Purpose |
|-------|------|---------|
| `tipShape` | `TipShape` | Movement behavioral category. Drives movement physics in the room tick. |
| `material` | `Material` | Controls `gripMult`, `frictionMult`, `decayMod`, `spinStealResist` via MATERIAL_STATS. |
| `gripFactor` | `number` (0–1) | Floor grip: how tightly the tip holds position. High = defensive center-hold. |
| `aggressiveness` | `number` (0–1) | How strongly orbit force pushes the bey outward. High = aggressive, low = stationary. |
| `freeSpin` | `boolean` | If true, tip spins independently of bey rotation (no drag from floor contact). |
| `bearingFriction` | `number` (0–1) | 0 = frictionless bearing (B:D ≈ 0.02). Used by `applyBearingFrictionToSteal()` and `getBearingDecayMult()`. |
| `spinBias` | `{ rightSpin: { gripMultiplier }, leftSpin: { gripMultiplier } }` | Directional grip multiplier. Models R2F-style protrusion-based asymmetric tips. |
| `leftSpinHop` | `{ enabled, hopImpulse, hopChance }` | Wyborg-style left-spin hop on impact. Checked in `checkLeftSpinHop()`. |
| `recoilAbsorption` | `number` (0–1) | Fraction of push-back absorbed by wide/rubber tips. Hidden. |
| `lateralStability` | `number` | Resistance to sideways tilt on impact. Maps to `tiltResistance` on the Beyblade schema. |
| `suctionCap` | `number` | Max suction force this tip can sustain (N). Feeds `computeClimbingForces()`. |
| `climbAssist` | `number` (0–1) | Wall-climb ability. Feeds `wallClimbFactor` on bey schema via `mergeClimbingStats()`. |
| `durabilityDecay` | `number` | gripFactor reduction per rubber-mode activation within a match. |

**Tip shapes** (`TipShape`): `flat | sharp | semi_flat | wide | ball | spike | rubber_flat | hole_flat | rubber_ball | defense | custom`

Each shape has behavioral meaning in movement physics (not yet enumerated in PhysicsEngine — see PART-02 gap).

**Configuration system:** Tip configurations can override `tipShape`, `material`, `gripFactor`, `aggressiveness`, `tipWidth`, `freeSpin`, `contactPoints`. This enables the Seaborg Defense Grip Base's inverted mode (defense → attack via `playerSwitchable: true`).

**Special structural flags:**
- `extendsAboveCasing` — tip body extends upward into the casing height zone (Rock Bison-style)
- `containsCasing` — tip is the outermost shell; casing nests inside (Wolborg G)
- `freeSpinOnCore` — only enters free-spin when `core_activated` ConfigTrigger fires

---

### 1.4 Core (`core` / `CorePart`)

**Firestore collection:** `core_parts`

The internal hub/mechanism. Connects WD torque to the tip. Hosts complex gimmicks in HMS and certain plastic-gen beys.

**Physics parameters contributed:**
| Field | Type | Purpose |
|-------|------|---------|
| `weight` | `number` (g) | Added to bey mass. |
| `gimmick` | `CoreGimmick` | Named mechanism (see below). |
| `clutchStrength` | `number` (0–1) | HMS free-spinning Running Core coupling: 0 = fully free (no floor drag), 1 = locked. |
| `torqueEfficiency` | `number` (0–1) | Spin transmitted from WD hub to tip per tick. Low = spin loss in mechanism housing. |
| `internalFriction` | `number` (0–1) | Friction loss inside mechanism per tick. |
| `suctionEmit` | `number` (N) | Suction emission force broadcast to nearby surfaces. Feeds climbing physics. |
| `spinInjection` | `SpinInjectionConfig` | Engine gear / spring mechanism config (see below). |
| `counterRotation` | `CounterRotationConfig` | Dranzer GT-style direction-sequence config (see below). |
| `statModifiers` | `StatModifier[]` | Universal modifier hooks. |

**Core gimmicks** (`CoreGimmick`):
- `none` — standard rigid core
- `speed_boost` — one-time or interval speed burst
- `weight_shift` — shifts mass distribution per config
- `magnetic` — suction/repulsion field
- `engine_gear` — spinning internal gear; can fire `core_activated` ConfigTrigger
- `clutch_release` — releases coupling at spin threshold
- `spin_injection` — adds spin per tick from `reserveCapacity` reserve. Processed by `tickSpinInjection()` in `PartSystemManager.tickBey()`.
- `counter_rotation` — zig-zag direction-change sequence. Processed by `tickCounterRotation()`.

**`SpinInjectionConfig` fields:**
```
enabled              boolean
rateRPM              number   — spin added per tick = rateRPM / 60 at 60Hz
reserveCapacity      number   — total RPM reserve (0 = unlimited)
reserveRemaining     number   — runtime state; tracked on bey.coreReserveRemaining
activationCondition  "always" | "casing_trigger" | "spin_threshold"
spinThreshold        number   — fraction of maxSpin; active when bey spin drops below this
```

**`CounterRotationConfig` fields:**
```
enabled              boolean
activationCondition  "casing_trigger" | "player_input"
directionSequence    Array<"right" | "left">   — e.g. ['right','left','right','left']
stepDurationTicks    number                    — ticks per direction step (30 = 0.5s)
spinDecayCostPerStep number                    — spin fraction lost at each transition
```

**Configuration overrides** include `gimmick`, `spinInjection` (partial merge), `counterRotation` (partial merge), `movementOverride` (orbit/jump/fixed), and `statModifiers`.

---

### 1.5 Casing (`casing` / `CasingPart`)

**Firestore collection:** `casing_parts`

The outer structural shell. Sits above the WD and below the AR. Houses the tip/core slots. Contributes CPs at the lower zone of the bey, typically for defensive contacts and wall clearance.

**Physics parameters contributed:**
| Field | Type | Purpose |
|-------|------|---------|
| `contactPoints` | `SystemContactPoint[]` | Lower-body CPs. Active at `heightRange` matching the casing's vertical extent. |
| `impactAbsorption` | `number` (0–1) | Fraction of hit force absorbed before reaching WD/Core. Used in `applyImpactAbsorption()`. |
| `lateralStiffness` | `number` (0–1) | Resistance to tilt by side hits. |
| `clearanceHeight` | `number` (mm) | Floor-to-bottom gap. Determines which opponent CPs can reach under this bey. |
| `slots` | `CasingSlots` | `tipSlot` (bore position + radius) and `coreSlot` (enabled, radius, depth). |
| `statModifiers` | `StatModifier[]` | Universal modifier hooks. |

**Casing categories** (`CasingCategory`): `round | wide | flat | custom`

**`CasingSlots`:**
```typescript
tipSlot:  { position: { x, y } | "center", radius: number }
coreSlot: { enabled: boolean, radius: number, depth: number }
```

The `coreSlot.depth` field determines the core's absolute floor height, which offsets all CP `heightRange` values for core-mounted parts.

---

### 1.6 Bit Beast (`bit_beast` / `BitBeastPart`)

**Firestore collection:** `bit_beast_parts`

The spiritual totem chip. Primarily cosmetic and stat-modifier, but contributes `specialMove` assignment and can carry `statModifiers` for combat effects. Sits at the top of the AR.

**Physics parameters contributed:**
| Field | Type | Purpose |
|-------|------|---------|
| `weight` | `number` (g) | Added to bey mass. Usually small (1–4g). |
| `specialMove` | `SpecialMove` | Assigns the bey's special move. `PartSystemManager.registerBey()` reads this and sets `bey.specialMove`. |
| `spiritualForce` | `number` (0.5–2.0) | Multiplies special move base power. Hidden lore stat. |
| `resonanceBonus` | `number` | Additive speed bonus when facing same-series opponent. Hidden. |
| `statModifiers` | `StatModifier[]` | Universal modifier hooks. |
| `isEnergyRing` | `boolean` | MFB Energy Ring flag — forces `specialMove = 'none'`, purely cosmetic + weight. |

**Bit beast categories** (`BitBeastCategory`): `dome | pyramid | beast_silhouette | ring | custom`

**Special move resolution priority in `PartSystemManager.registerBey()`:**
1. If `bey.specialMove` is already set (and not the placeholder `"tactical_burst"`), keep it.
2. Otherwise, walk parts in canonical order: `bitBeast → core → ar → casing → tip → wd → spinTrack → subParts`. The first part whose `specialMoveId` field is non-empty wins.

---

### 1.7 Sub-Part (`sub_part` / `SubPart`)

**Firestore collection:** `sub_part_parts`

Generic slot for sub-attack-rings, WD sub-parts, sub-casings, and any auxiliary mechanical component that attaches to a parent part. Up to N sub-parts are stored in `BeybladeSystem.subPartAttachments[]`.

**Physics parameters contributed:**
| Field | Type | Purpose |
|-------|------|---------|
| `weight` | `number` (g) | Added to bey mass. |
| `mode` | `SubPartMode` | How this sub-part couples to the bey's rotation (see below). |
| `contactPoints` | `SystemContactPoint[]` | Sub-part CPs active at their `heightRange`. |
| `detachment` | `DetachmentConfig` | Defines when and how the sub-part separates from the bey (see Section 3). |
| `switchTargets` | `SwitchTarget[]` | SubPart-as-Switch: on trigger fire, change config on another part slot. |
| `mechanismDurability` | `number` | Max trigger fires before wear; 0 = infinite. Tracked in `BeyPartState.mechanismFireCounts`. |
| `triggerSensitivity` | `number` (≤1.0) | Worn spring modifier — fires at lower force when < 1.0. |
| `statModifiers` | `StatModifier[]` | Universal modifier hooks. |

**Sub-part modes** (`SubPartMode`):
- `free_spin` — rotates independently of bey spin axis; no drag coupling
- `partial_slip` — slips until `spinThresholdDegrees` of relative rotation, then engages
- `fixed` — fully locked to bey rotation
- `ratchet` — momentary locks at `lockPositions[]` angles for `lockDurationTicks` ticks

**Compatible parents** (`SubPartParent`): `ar | wd | casing | bit_beast | tip | core | gear`

`"gear"` was added so that a sub-part can mount directly onto an equipped gear (e.g. a rubber contact pad that clips onto the tip of a Sword Gear).

**`DetachmentConfig` fields:**
```
enabled              boolean
type                 "projectile" | "mini_bey" | "fragment"
trigger              "impact_threshold" | "spin_threshold" | "timer" | "special_move"
triggerThreshold     number
returnToParent       boolean
returnDelay          number (ms)
detachedMass         number (g)
detachedRadius       number (mm) — for spawned body
detachedContactPoints SystemContactPoint[] — for mini_bey type
initialSpinFraction  number (0–1) — fraction of parent spin inherited
spinDecayRate        number — per-tick decay for mini_bey bodies
```

When a detachment triggers, `PartSystemManager.triggerDetachment()`:
1. Sets `bey.activePartConfigs["sub_part_N"] = "detached"`.
2. Spawns a `DetachedBodySchema` in `gameState.detachedBodies`.
3. For `mini_bey` on a combined bey: sets `bey.isSplit = true`.

**`SwitchTarget` fields:**
```
targetLayer      PartLayer   — part slot to affect
activateConfig   string      — config name to set on target
trigger          ConfigTrigger
resetToConfig    string      — revert config on resetCondition
resetCondition   ConfigResetCondition
```

---

### 1.8 Spin Track (`spin_track` / `SpinTrackPart`)

**Firestore collection:** `spin_track_parts`

MFB / 4D system height piece between Tip and Casing. Absent in gen1 plastic / HMS. When present, its `height` (mm) offsets all AR/WD/Casing CP `heightRange` values at runtime via `getTrackHeightOffset()`.

**Physics parameters contributed:**
| Field | Type | Purpose |
|-------|------|---------|
| `height` | `number` (mm) | Primary stat. Standard values: 90, 100, 105, 125, 130, 145, 160, 230. |
| `weight` | `number` (g) | Added to bey mass. |
| `shieldDisk` | `SpinTrackShieldDisk` | Optional shield disk (S130). `diskRadius`, `diskHeight`, own `contactPoints`. |
| `wingProtrusions` | `{ count, contactPoints }` | Wing protrusions with their own CP array. |
| `trackRigidity` | `number` (0–1) | 1.0 = rigid; flexible tracks absorb some impact. |
| `heightAdvantage` | `number` | Computed: `height / 145`. > 1 = tall bey, < 1 = short bey. Used in upper-attack detection. |
| `statModifiers` | `StatModifier[]` | Universal modifier hooks. |

---

### 1.9 Gear (`gear` / `GearPart`)

**Firestore collection:** `gear_parts`  
**Admin URL slug:** `/admin/2d/parts/gears`

A modular attachment that clips onto a specific parent part layer and shifts the beyblade's active archetype or mode. Gears are the defining mechanic of the **DB / BU Burst era** (Dynamite Belial Evolution Gears, Ultimate Belial Infinite attachments, Astral Spriggan Q-Gear) and are distinct from SubPart:

| Dimension | SubPart | Gear |
|-----------|---------|------|
| Physical size | Auxiliary clip / tab | Full attachment (sword blade, shield disk, etc.) |
| Archetype impact | Minor behavior tweak | Named archetype shift (attack / defense / stamina / balance) |
| Slot model | Unordered list | Indexed slot (`slotIndex`) for multi-socket beys |
| Sub-part hosting | Mounts onto a parent part | Can itself host sub-parts (`SubPartParent = "gear"`) |

**Key interface fields:**

| Field | Type | Purpose |
|-------|------|---------|
| `attachesTo` | `"ar" \| "wd" \| "casing" \| "core" \| "bit_beast" \| "tip"` | Which part layer the gear clips onto |
| `slotIndex` | `number` (optional, 0-indexed) | Numbered socket for beys with multiple gear positions (Q-Gear = 4 slots → 16+ mode combos) |
| `gearShape` | `GearShape` | Physical form: `sword \| shield \| hammer \| wing \| lance \| fortress \| ring \| anchor \| custom` |
| `archetype` | `GearArchetype` | Archetype this gear drives: `attack \| defense \| stamina \| balance` |
| `dimensions` | `PartDimensions` | `height`, `outerRadius`, `innerRadius` (all mm) |
| `materials` | `MaterialBand[]` | Material coverage bands |
| `weight` | `number` (g) | Added to bey mass while equipped |
| `contactPoints` | `SystemContactPoint[]` | The gear's own collision contact points |
| `statModifiers` | `StatModifier[]` | Stat deltas active for the whole match while this gear is equipped |
| `enabledSubPartIds` | `string[]` | Sub-parts that become available only when this gear is equipped |
| `compatibleSystemTags` | `string[]` | Filter which `BeybladeSystem` configs can accept this gear |

**`GearShape` values and real-world examples:**

| Shape | Example | Notes |
|-------|---------|-------|
| `lance` | Evolution Gear L (Dynamite Belial NV2) | Tapered spike protrusion; attack archetype |
| `fortress` | Evolution Gear F | Blocky wide plate; defense archetype |
| `shield` | Evolution Gear S / Infinite Shield | Disk or ring barrier; defense/stamina archetype |
| `wing` | Evolution Gear V (Venture) | Swept fin; balance archetype |
| `anchor` | Evolution Gear H (Heavy) | Weighted drop shape; stamina archetype |
| `sword` | Infinite Sword (Ultimate Belial) | Elongated blade; attack archetype |
| `ring` | Big Bang / Q-Gear | Full-circumference ring; variable archetype |
| `hammer` | Hammer Bringer variants | Mallet head shape |
| `custom` | User-defined | Editor-defined geometry |

**`GearAttachment` (slot in `BeybladeSystem`):**

```typescript
interface GearAttachment {
  gearId: string;
  parentPart: "ar" | "wd" | "casing" | "core" | "bit_beast" | "tip";
  slotIndex?: number;   // 0-indexed; omit for single-slot beys
  activeConfig?: string;
}
```

`BeybladeSystem.gearAttachments: GearAttachment[]` — empty array = no gears equipped.

**Configurations:** Gear configs can override `contactPoints` and `statModifiers`, allowing the same physical gear to behave differently on config trigger (e.g. a gear that retracts its contact point at low spin via a `spin_threshold` autoTrigger).

**Gap note — GEAR-01:** Gears are not yet wired into `PartSystemManager.registerBey()`. When a `BeybladeSystem` has `gearAttachments`, the manager must resolve each gear's contact points and stat modifiers and merge them into the bey's combined physics stats (same bridge required as PART-01 for ARPart.contactPoints).

---

## 2. Contact Point Mechanics

### 2.1 Legacy Shape (all 4 fields required)

The original contact point format. Still used by the seed data and all existing Firestore documents that lack arc-segment fields.

```
angle      number   0–360°   center of the contact arc
width      number   arc degrees   angular span; narrow=spike, wide=bumper
radius     number   mm from center   collision only registers at this radial distance
thickness  number   mm radial depth   protrusion depth (blends linearly across `width`)
```

**How a legacy CP fires in `PhysicsEngine.getContactPointMultiplier()`:**
1. Compute `contactAngle` (radians) from the collision's contact point relative to the bey center.
2. Normalize the angle difference vs the CP's `angle` field.
3. If `angleDiff > halfWidth` (in radians), skip — not in this CP's arc.
4. If `cp.extends` is true and `spinFraction >= extendThreshold`, use `extendedWidth` instead of `width`.
5. Base multiplier = `cp.damageMultiplier`.
6. Apply material damage multiplier from `MATERIAL_MULTIPLIERS`.
7. Apply roller freeSpin rubber multiplier if applicable.
8. Keep the maximum multiplier across all matching CPs.

**Radial gate** (`checkRadialContactMatch()`): The contact radius (derived from the Euclidean distance between the contact point and the bey center, converted to mm via the `px → mm` scale of 24px/cm = 2.4px/mm) is compared to `cp.radius`. If the difference exceeds `RADIAL_CONTACT_TOLERANCE_MM = 2mm`, the CP is skipped. This prevents WD-radius CPs from firing when the collision actually happens at the AR's larger outer radius.

**Extends gimmick:**
```
extends          boolean    — flag to enable extending behavior
extendThreshold  number     (0–1 fraction of maxSpin)   — spin fraction to trigger extension
extendedRadius   number     mm   — new radius at high spin
extendedWidth    number     arc degrees   — new width at high spin
extendedThickness number    mm   — new thickness at high spin
```

**renderRadius() — legacy contribution:**
For each legacy CP (no `arcStart/arcEnd/lineThickness`), the zone-warp is additive:
```
legacyWarp += thickness × (1 − |θ − angle| / halfWidth)
```
Multiple legacy CPs at the same angle sum their protrusions. This is additive and preserves backward compatibility with all existing data.

---

### 2.2 Arc-Segment Shape (new format)

When any of `arcStart`, `arcEnd`, or `lineThickness` is present on a CP, the arc-segment path is taken.

```
arcStart       number   0–360°   arc start (falls back to angle − width/2 if absent)
arcEnd         number   0–360°   arc end   (falls back to angle + width/2 if absent)
radiusInner    number   mm   partial ring inner radius (defaults to radius − thickness/2)
radiusOuter    number   mm   partial ring outer radius (defaults to radius + thickness/2)
lineThickness  number   mm   perpendicular protrusion ON the arc line (defaults to thickness)
setId          string         multi-set grouping id for renderer
```

**Key differences from legacy:**
1. Protrusion is applied ONLY along the arc line, with **linear falloff** to zero at the arc endpoints, peaking at the arc midpoint.
2. Multiple new-shape CPs at the same angle blend via **MAX** (not sum): `newProtrusionMax = max(existing, lineThickness × falloff)`. A thicker bumper masks a thin spike.
3. The `radiusInner/radiusOuter` fields define a radial band — used by the renderer (and potentially by a physics radial gate more precise than the 2mm tolerance).

**renderRadius() — new-shape contribution:**
```typescript
const { arcStart, arcEnd, lineThickness } = resolveCpBounds(cp);
if (!angleInArc(θDeg, arcStart, arcEnd)) continue;
const midpoint = (arcStart + arcEnd) / 2;
const halfSpan = Math.abs(arcEnd - arcStart) / 2 || 1;
const dist = min(|θ - midpoint|, 360 - |θ - midpoint|);  // wrap-safe
const falloff = max(0, 1 − dist / halfSpan);
newProtrusionMax = max(newProtrusionMax, lineThickness × falloff);
```

**Combined output:**
```
renderRadius(θ) = fourierCache[θ] + legacyWarp + newProtrusionMax
```

**Helper functions exported from `beybladeSystem.ts`:**
- `resolveCpBounds(cp)` — normalizes both shapes to `{ arcStart, arcEnd, rInner, rOuter, lineThickness }`
- `angleInArc(θ, arcStart, arcEnd)` — handles 360° wrap-around correctly
- `groupContactPointsBySet(cps)` — groups CPs by `setId` for multi-set rendering
- `renderRadius(θ, fourierCache, cps)` — the full combined warp function

---

### 2.3 Physics and CP Properties

Beyond shape, each CP carries:

**Attack type resolution:**
```
attackType     AttackType    "smash" | "upper" | "absorb" | "burst" | "spin_steal"
spinBehavior   { rightPin: AttackType, leftPin: AttackType }
```
`spinBehavior` allows the same physical protrusion to behave as smash when the bey spins right (protrusion sweeps forward) and absorb when it spins left (protrusion trailing).

**Damage multiplier:** `damageMultiplier` (0.8–2.5). Raw multiplier applied to the base damage from impact force. Gets further multiplied by the material damage factor in `getContactPointMultiplier()`.

**Material:** `material: Material` — one of `abs | rubber | metal | pom | polycarbonate | nylon | pc`. In `PhysicsEngine`, `MATERIAL_MULTIPLIERS` maps each material to `{ damage, spinSteal, recoil }`. In `PartPhysics`, `MATERIAL_STATS` maps materials to `{ gripMult, recoilMult, decayMod, frictionMult, spinStealResist }`.

**Height range:**
```
heightRange: { min: number, max: number }   // mm absolute from floor
```
Only CPs whose `heightRange` overlaps the opponent's bey's contact height (determined by SpinTrack offset) participate in the collision. This is the mechanism that makes lower-profile beys vulnerable to upper-attack CPs from taller opponents.

**Extends gimmick** (duplicate of legacy fields, but at CP level):
```
extends          boolean
extendThreshold  number (0–1)
extendedRadius   number (mm)
extendedWidth    number (arc degrees)
extendedThickness number (mm)
```

**Optional roller:**
```
roller: { radius: number, material: Material, freeSpin: boolean }
```
When `freeSpin = true`, the roller's material multipliers are replaced by rubber multipliers regardless of `roller.material`. Models roller-defense bases (Draciel S roller bearings).

**Self-rotation** (`PartSelfRotation`): Each CP can have an independent motor-driven rotation (`selfRotation?: PartSelfRotation`). This means the contact point's angular position advances each tick at `speedDegPerSec`, independently of the bey's own spin. Five lifecycle types: `permanent | interval | once | pulsed | oscillate`.

---

### 2.4 Collision Implications for Matter.js

The 2.5D part system sits **on top of** the Matter.js circle-body collision model. The important layering is:

1. **Matter.js** detects circle–circle overlap and returns a contact point (position in px).
2. **`PhysicsEngine.checkBeybladeCollision()`** extracts `contactAngle1/2` (angle from each bey's center to the contact point, minus body rotation).
3. **`PhysicsEngine.calculateCollisionDamage()`** calls `getContactPointMultiplier()` for each bey, passing `contactAngle` and `contactRadiusMm`.
4. The CP multiplier selects which CP (if any) is active at that angle and radius.
5. The result modulates `rawDamage × damageMultiplier × contactMult`.

**Matter.js body shape is always a circle** — CPs do not reshape the physics body. The Fourier/arc-segment geometry affects:
- Renderer warping (visual only, but communicates hit zone to the player)
- Which CP multiplier is applied (via angle matching)
- Radial gate filtering (via radius matching within 2mm tolerance)

A CP with a large `thickness` does NOT create a convex protrusion in Matter.js — it just increases the damage multiplier when a collision happens at that angle. The actual physical push is purely from the circle-body collision response.

This means AR CPs with wide `width` (like Round Stamina's 80° arcs) will fire on many collision angles, while narrow spike CPs (small `width`) only deal bonus damage on direct hits.

---

## 3. Pocket Mechanics

### 3.1 Interface Definition

```typescript
interface PartPocket {
  position: { x: number; y: number };  // mm from central axis, top-down
  height: number;                       // mm absolute from floor
  size: "small" | "large";
  shape: "round" | "oval" | "channel" | "arc";
  ballMaterial: "metal" | "plastic";
  ballCount: number;
  fixed: boolean;                       // false = ball moves under centrifugal/tilt force
  radialChannel?: boolean;             // ball constrained to radial axis only (Draciel F)
  escapable?: boolean;                 // ball can exit pocket under centrifugal force
  escapeForce?: number;                // centrifugal force threshold; 0 = inescapable
  escapedBallMass?: number;            // g — escaped ball becomes DetachedBody 'fragment'
}
```

Pockets are declared on `BasePart` (available to all part types) but are primarily meaningful on `CasingPart` (Draciel F-type) and occasionally `WDPart` (wide-perimeter mass shifting).

### 3.2 What Pockets Do

Pockets model physical sub-components that can move within the part under centrifugal force or tilt. The primary effect is **moment of inertia modulation**: as spin increases, balls migrate outward to a higher radius, increasing rotational inertia (Flywheel Effect). This is the Draciel F gimmick.

**`tickPocketBalls()` in `PartPhysics.ts`:**
- Called from `PartSystemManager.tickBey()` (in practice, the rooms that call `tickBey` handle this).
- For each `radialChannel = true` pocket with `ballCount > 0` and `fixed = false`:
  1. Ball radial position `r = innerRadius + (outerRadius - innerRadius) × ω²` — quadratic in spin fraction.
  2. Inertia contribution: `inertiaPocket = ballMass × r²`. Added as a fractional modifier to `inertiaMod`.
  3. Escape check: if `escapable && centrifugal > escapeForce`, the pocket index is added to `escapedIndices`.

**Escape lifecycle:** When a pocket ball escapes (`escapedIndices` returns non-empty), the caller should:
1. Reduce `pocket.ballCount` by 1.
2. Call `spawnDetachedBody()` with `bodyType: "fragment"`, `mass: escapedBallMass`, `fragmentLifetimeTicks: FRAGMENT_LIFETIME_TICKS_DEFAULT (180)`.
3. The fragment follows the standard `projectile → obstacle → removed` lifecycle in `tickDetachedBody()`.

### 3.3 How Pocket Positions Affect Sub-Part Physics

In the current implementation, pocket `position` (x, y in mm from axis) determines the **radial distance** used in the inertia calculation:
- `innerRadius` is passed as a parameter to `tickPocketBalls()` — callers should derive it from `pocket.position` magnitude: `innerRadius = sqrt(px² + py²)`.
- `outerRadius` defines the maximum outward migration (typically equals the part's `outerRadius` minus a wall clearance).

For non-radial pockets (`radialChannel = false`), the current implementation skips the physics tick entirely — they contribute to visual detail and mass but have no dynamic inertia effect.

**Sub-part attachment points (pockets as mounting holes):** `BasePart.pockets` doubles as the attachment cavity for sub-part installations. In the `BeybladeSystem.subPartAttachments[]`, a `SubPartAttachment` references `parentPart` (which part slot carries the mounting pocket) and `placement` (`"above" | "below"`). The pocket's `position` and `height` define where the sub-part's center sits relative to the parent part's axis, which in turn sets the effective CP heights for that sub-part.

This is currently informational — the actual CP height check uses `SubPart.contactPoints[i].heightRange` directly, not a pocket-derived offset. A more physically accurate system would add `pocket.height` to all sub-part CP `heightRange` values to reflect the attachment position.

---

## 4. Part System Seed Plan

The current seed (`scripts/seed-2d-parts.js`) populates 19 parts across 7 collections. This covers baseline functionality but omits several important physics archetypes. The following is an expanded plan for `beyblade_parts` (now 9 collections including `gear_parts`).

### 4.1 Attack Ring — 5 Entries

| ID | Display Name | Description | Key Stats |
|----|-------------|-------------|-----------|
| `tornado-wing` | Tornado Wing | 3-prong spiral, smash attack | 3 CPs at 120° spacing, `damageMultiplier: 1.5–1.8`, `material: abs`, `smashEfficiency: 0.8` |
| `scissor-attacker` | Scissor Attacker | X-cross upper-attack | 4 CPs, `attackType: upper`, `material: abs`, `upperAttackBonus: 1.3` |
| `spike-defense` | Spike Defense | 8-spike counter-attack ring | 8 CPs, `material: metal`, `damageMultiplier: 1.3`, `recoilFactor: 0.8` |
| `round-stamina` | Round Stamina | Smooth circular AR, minimal drag | 2 wide CPs (`width: 80`), `material: pom`, `damageMultiplier: 1.05`, `aerodynamicProfile: spherical` |
| `rubber-grip` | Rubber Grip | Rubber-coated smash absorber | 4 CPs, `material: rubber`, `attackType: absorb`, `recoilFactor: 0.2`, `smashEfficiency: 0.5` |

All AR entries need: `dimensions.height`, `dimensions.outerRadius`, `dimensions.innerRadius`, `contactPoints[]` with full `SystemContactPoint` fields, `materials: MaterialBand[]`, `configurations: []`.

Minimum required fields for a `SystemContactPoint` to work in `PhysicsEngine.getContactPointMultiplier()`:
```
angle, width, damageMultiplier, material
```
Optional but strongly recommended:
```
radius (for radial gate), thickness, attackType, heightRange, extends, extendThreshold
```

### 4.2 Weight Disk — 4 Entries

| ID | Display Name | Weight (g) | OuterRadius (mm) | Category | Key Stats |
|----|-------------|-----------|-----------------|---------|-----------|
| `ten-heavy` | Ten Heavy | 10 | 44 | `heavy` | `momentOfInertia: 4.84`, `gyroscopicStability: 0.7` |
| `eight-balance` | Eight Balance | 8 | 40 | `eight_balance` | `gyroscopicStability: 0.5`, `spinTransferEfficiency: 0.4` |
| `six-attack` | Six Attack | 6 | 36 | `six_balance` | `gyroscopicStability: 0.3` — lighter for faster spin-up |
| `wide-defense` | Wide Defense | 9 | 46 | `wide` | `momentOfInertia: 5.5`, `gyroscopicStability: 0.8`, `spinTransferEfficiency: 0.6` |

### 4.3 Tip — 5 Entries

| ID | Display Name | TipShape | Material | GripFactor | Aggressiveness | Special |
|----|-------------|---------|---------|-----------|---------------|---------|
| `flat` | Flat Tip | `flat` | `abs` | 0.55 | 0.8 | `configurations: [attack-mode, defense-mode]` (playerSwitchable) |
| `sharp` | Sharp Tip | `sharp` | `abs` | 0.1 | 0.15 | Low friction stamina tip |
| `semi-flat` | Semi-Flat Tip | `semi_flat` | `abs` | 0.35 | 0.5 | Balanced |
| `rubber-flat` | Rubber Flat | `rubber_flat` | `rubber` | 0.95 | 0.4 | High floor grip, defensive |
| `bearing-defense` | Bearing Defense | `ball` | `pom` | 0.05 | 0.1 | `bearingFriction: 0.02`, `freeSpin: true` — models B:D |

### 4.4 Core — 3 Entries

| ID | Display Name | Gimmick | Key Stats |
|----|-------------|---------|-----------|
| `standard` | Standard Core | `none` | `torqueEfficiency: 0.95`, `internalFriction: 0.02` |
| `spin-injection` | Spin Injection Core | `spin_injection` | `spinInjection: { enabled: true, rateRPM: 120, reserveCapacity: 600, activationCondition: "spin_threshold", spinThreshold: 0.5 }` |
| `engine-gear` | Engine Gear Core | `engine_gear` | `clutchStrength: 0.3`, `torqueEfficiency: 0.7`, configurations with `core_activated` trigger |

### 4.5 Casing — 3 Entries

| ID | Display Name | Category | Key Stats |
|----|-------------|---------|-----------|
| `round` | Round Casing | `round` | 1 CP (`angle: 0, width: 90, damageMultiplier: 1.1, material: abs`), `impactAbsorption: 0.1` |
| `wide` | Wide Casing | `wide` | 1 CP (`width: 120`), `lateralStiffness: 0.7`, `clearanceHeight: 2` |
| `absorb-casing` | Absorb Casing | `round` | 1 CP (`material: rubber, width: 180, damageMultiplier: 0.8`), `impactAbsorption: 0.4` |

### 4.6 Bit Beast — 3 Entries

| ID | Display Name | SpecialMove | Key Stats |
|----|-------------|------------|-----------|
| `pegasus` | Pegasus | `stampede_rush` | `weight: 2`, `spiritualForce: 1.5`, `beastCategory: beast_silhouette` |
| `leone` | Leone | `gyro_anchor` | `weight: 2`, `spiritualForce: 1.3`, `beastCategory: beast_silhouette` |
| `libra` | Libra | `spin_recovery` | `weight: 1.5`, `beastCategory: ring`, `isEnergyRing: false` |

### 4.7 Gear — 5 Entries

| ID | Display Name | GearShape | GearArchetype | AttachesTo | Weight (g) | Key Stats |
|----|-------------|-----------|---------------|------------|-----------|-----------|
| `evolution-gear-l` | Evolution Gear L | `lance` | `attack` | `ar` | 3.5 | 2 CPs at 0°/180°, `attackType: smash`, `damageMultiplier: 1.6`, `material: abs` |
| `evolution-gear-f` | Evolution Gear F | `fortress` | `defense` | `ar` | 4.0 | 4 CPs at 45° spacing, `attackType: absorb`, `damageMultiplier: 0.9`, `material: rubber` |
| `evolution-gear-s` | Evolution Gear S | `shield` | `stamina` | `ar` | 3.0 | 1 wide CP (`width: 120`), `damageMultiplier: 1.1`, `material: pom` |
| `infinite-sword` | Infinite Sword | `sword` | `attack` | `ar` | 4.5 | 1 CP (`angle: 0, width: 15, damageMultiplier: 2.0, material: abs`), `statModifiers: [attackPts +15]` |
| `infinite-shield` | Infinite Shield | `shield` | `defense` | `ar` | 4.0 | 2 wide CPs (`width: 90`), `material: rubber`, `attackType: absorb`, `statModifiers: [defensePts +15]` |

All gear entries need: `dimensions`, `contactPoints[]` (full `SystemContactPoint`), `materials: MaterialBand[]`, `configurations: []`.

---

### 4.8 Spin Track — 3 Entries (MFB)

| ID | Display Name | Height (mm) | Weight (g) | Key Stats |
|----|-------------|------------|----------|-----------|
| `st-90` | ST-90 | 90 | 1.5 | `trackRigidity: 0.9`, `heightAdvantage: 0.62` — very short, aggressive |
| `st-145` | ST-145 | 145 | 1.7 | `trackRigidity: 0.9`, `heightAdvantage: 1.0` — reference height |
| `st-s130` | ST-S130 | 130 | 3.3 | `shieldDisk: { enabled: true, diskRadius: 17.75, diskHeight: 8, contactPoints: [...] }`, `heightAdvantage: 0.9` |

---

## 5. Gap Analysis

### PART-01: Are contact points fully wired into collision detection?

**Status: Partially implemented — legacy shape only, arc-segment skipped.**

In `PhysicsEngine.getContactPointMultiplier()`, the collision damage path reads `PointOfContact[]` (not `SystemContactPoint[]`). The `PointOfContact` type comes from `server/types/shared.ts` and is a simpler flat structure that maps to the legacy contact point fields (`angle`, `width`, `radius`, `damageMultiplier`, `material`, `extends`, `extendedWidth`, `extendThreshold`).

The full `SystemContactPoint` fields are declared in `shared/types/beybladeSystem.ts`, but the PhysicsEngine uses its own legacy `PointOfContact` type internally. The bridge is `BeybladeStats.pointsOfContact` (set from BeybladeStats.comboIds / stats in the room's `applyBeybladeStats()`), which populates the legacy format from whatever is stored in Firestore's `beyblade_stats` collection.

The 2.5D `ARPart.contactPoints[]` array (with full `SystemContactPoint` fields) is **not automatically converted** to `PointOfContact[]` and injected into `PhysicsEngine.beybladeStats`. This bridge is missing. `PartSystemManager` manages the part system state but does not update `PhysicsEngine.beybladeStats` when parts are registered or configs change.

**Concrete gap:** When a bey is created from a `BeybladeSystem` (via `Parts25DBattleRoom.ts` or equivalent), the AR's contact points from `ARPart.contactPoints[]` need to be mapped to `BeybladeStats.pointsOfContact[]` and passed to `PhysicsEngine.beybladeStats.set(id, stats)`. This mapping step is absent.

**Fix:** After `PartSystemManager.registerBey()`, collect all active CPs from all parts (AR, WD, Casing, SpinTrack shield disk, SubParts), convert them to `PointOfContact` format, and call `physicsEngine.beybladeStats.set(beyId, computedStats)`.

---

### PART-02: Are arc-segment contact points implemented in PhysicsEngine or only in the renderer?

**Status: Arc-segment CPs exist only in the renderer / shared math helpers. PhysicsEngine uses legacy fields only.**

`renderRadius()`, `resolveCpBounds()`, `angleInArc()`, and `groupContactPointsBySet()` are all implemented in `shared/types/beybladeSystem.ts`. These are pure math functions that the **PixiJS renderer** uses to warp the Fourier radial profile for visual display.

`PhysicsEngine.getContactPointMultiplier()` reads:
1. `cp.angle` (legacy)
2. `cp.width` (legacy, with `extendedWidth` override)
3. `cp.radius` (legacy, for radial gate)
4. `cp.damageMultiplier` (shared)
5. `cp.material` (shared)

It does **not** read `cp.arcStart`, `cp.arcEnd`, `cp.radiusInner`, `cp.radiusOuter`, or `cp.lineThickness`.

This means arc-segment CPs with `arcStart/arcEnd` set will still fire in collision detection — but via the fallback in `resolveCpBounds()` which maps them back to `angle ± halfW`. The precision of the arc-segment geometry (peak at midpoint, falloff to edges, radial band check) is **not applied** in physics.

For collision purposes, an arc-segment CP is treated identically to a legacy CP with:
- `angle = (arcStart + arcEnd) / 2`
- `width = arcEnd - arcStart`

**Fix:** In `getContactPointMultiplier()`, detect `isNew = cp.arcStart !== undefined || cp.arcEnd !== undefined || cp.lineThickness !== undefined` (same check as `renderRadius()`). For new-shape CPs, apply the falloff-weighted multiplier instead of the flat angular gate:
```
falloff = max(0, 1 − dist_from_midpoint / halfSpan)
mult = cp.damageMultiplier × falloff × materialDmg
```
This makes the physics collision damage profile match the visual shape exactly.

---

### PART-03: Are pockets and sub-part detachment implemented?

**Status: Both are partially implemented in `PartPhysics.ts` and `PartSystemManager.ts`, but not connected to the room tick loop in the standard rooms.**

**Pockets (`tickPocketBalls`):**
- `tickPocketBalls()` is fully implemented in `PartPhysics.ts`.
- `PartSystemManager.tickBey()` does **not** call `tickPocketBalls()`. The function exists but is not wired in.
- The standard rooms (`BattleRoom.ts`, `Parts25DBattleRoom.ts`) do not call it.
- **Fix:** Add a call to `tickPocketBalls()` in `PartSystemManager.tickBey()` using `state.parts.casing?.pockets` and `state.parts.wd?.pockets`. Apply the returned `inertiaMod` to the bey's `spinDecayRate` (higher inertia → slower decay). Handle `escapedIndices` by calling `spawnDetachedBody()`.

**Sub-part detachment:**
- `triggerDetachment()` is implemented in `PartSystemManager` (private method).
- `onBeyCollision()` calls `triggerDetachment()` when `sp.detachment?.trigger === "impact_threshold"` and the force exceeds threshold. This path **is wired**.
- `spin_threshold` trigger type is **not** wired — it is checked in `isTriggerMet()` but `onBeyCollision` only handles `impact_threshold` for detachment.
- `timer` and `special_move` trigger types for detachment are also not wired for the detachment path (only for switchTargets).
- `returnToParent` / `returnDelay` logic is not implemented anywhere — once detached, sub-parts never return.
- **Fix:** In `tickBey()`, add detachment checks for `spin_threshold` and `timer` triggers for all sub-parts. Implement the `returnToParent` lifecycle in `tickDetachedBody()` or a new `tickDetachedBodyReturn()` helper.

**DetachedBody physics bodies in Matter.js:**
- `spawnDetachedBody()` creates a `DetachedBodySchema` in `gameState.detachedBodies` but does **not** create a corresponding Matter.js rigid body.
- The caller comment says "The caller is responsible for creating the corresponding Matter.js body," but `triggerDetachment()` in `PartSystemManager` does not call back into `PhysicsEngine` to do so.
- This means detached fragments/mini-beys have no physics body and cannot interact with other beys in the Matter.js world. They exist only in Colyseus state (synced to clients for visual rendering) but have no collision.
- **Fix:** `Parts25DBattleRoom.ts` (or `PartSystemManager` via a callback) needs to register a listener on `gameState.detachedBodies` additions and call `PhysicsEngine.createBeyblade()` (or a dedicated `createDetachedBody()` method) for each new body of type `mini_bey` or `projectile`. Fragments can remain as visual-only.

---

## Summary Table

| Gap ID | Description | Severity | Location of Fix |
|--------|-------------|---------|----------------|
| PART-01 | ARPart.contactPoints not bridged to PhysicsEngine.beybladeStats | High | `Parts25DBattleRoom.ts` or `PartSystemManager.registerBey()` |
| PART-02 | Arc-segment CP fields ignored in collision damage calculation | Medium | `PhysicsEngine.getContactPointMultiplier()` |
| PART-03a | `tickPocketBalls()` never called in room tick | Medium | `PartSystemManager.tickBey()` |
| PART-03b | SubPart detachment only handles `impact_threshold`; `spin_threshold`/`timer` unimplemented | Low | `PartSystemManager.tickBey()` |
| PART-03c | Detached bodies have no Matter.js physics body — no real collision | High | `Parts25DBattleRoom.ts` onDetachedBodyAdded callback |
| PART-03d | `returnToParent` lifecycle not implemented | Low | new `tickDetachedBodyReturn()` helper |
| GEAR-01 | GearPart CPs and statModifiers not bridged to PhysicsEngine in `registerBey()` | High | `PartSystemManager.registerBey()` — merge gear CPs into combined stats after existing sub-part loop |

---
[? Phase 04: Combo Mapping](phase-04-combo-mapping.md) &nbsp;�&nbsp; [? Index](../INDEX.md) &nbsp;�&nbsp; [Phase 06: Mechanics ?](phase-06-mechanics.md)

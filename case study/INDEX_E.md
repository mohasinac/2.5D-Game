# BEYBLADE ARENA FEATURE INDEX (INDEX_E)
> Comprehensive 2.5D arena element reference · All dimensions in cm · PX_PER_CM = 24

---

## Overview

This index documents every arena element type in the Beyblade game engine.
Sources: `shared/types/arenaConfigNew.ts`, `server/shared/physics/ArenaUtils.ts`,
`server/shared/rooms/ArenaFeatureProcessor.ts`, `client/src/game/renderer/PixiRenderer.ts`.

### Summary Table

| Code | Element Type | Category | Physics Class | Max Per Arena |
|------|-------------|----------|---------------|---------------|
| AE-1 | Arena Boundary (Wall) | Boundary | Event-driven | 1 |
| AE-2 | Bowl Profile / Wall Angle | Boundary | Per-frame | 1 |
| AE-3 | Arena Tilt | Boundary | Per-frame | 1 |
| AE-4 | Arena Rotation | Boundary | Per-frame | 1 |
| AE-5 | Obstacle (Solid) | Obstacle | Event-driven | 10 |
| AE-6 | Obstacle — Magnetic | Obstacle | Per-frame | 10 |
| AE-7 | Obstacle — Electrified | Obstacle | Event-driven | 10 |
| AE-8 | Obstacle — Spinner | Obstacle | Event-driven | 10 |
| AE-9 | Obstacle — Sticky | Obstacle | Event-driven | 10 |
| AE-10 | Obstacle — Crusher | Obstacle | Dynamic | 10 |
| AE-11 | Obstacle — Trampoline | Obstacle | Event-driven | 10 |
| AE-12 | Obstacle — Bouncy Net | Obstacle | Event-driven | 10 |
| AE-13 | Obstacle — Wrecking Ball | Obstacle | Dynamic | 10 |
| AE-14 | Obstacle — Pinball Bumper | Obstacle | Event-driven | 10 |
| AE-15 | Switch | Interactive | Event-driven | unlimited |
| AE-16 | Gravity Hole | Force Zone | Dynamic | 3 |
| AE-17 | Spin Zone | Force Zone | Per-frame | unlimited |
| AE-18 | Bump | Terrain | Event-driven | unlimited |
| AE-19 | Water Body — Moat | Liquid | Per-frame | 3 |
| AE-20 | Water Body — Zone | Liquid | Per-frame | 3 |
| AE-21 | Water Body — Wall-Based | Liquid | Per-frame | 3 |
| AE-22 | Pit | Hazard | Dynamic | 3 |
| AE-23 | Turret | Special | Dynamic (AI) | 8 |
| AE-24 | Portal | Special | Event-driven | 4 |
| AE-25 | Speed Path / Loop | Terrain | Per-frame | unlimited |
| AE-26 | Gear Rail | Terrain | Per-frame | unlimited |
| AE-27 | Tornado Ridge | Terrain | Per-frame | 1 |
| AE-28 | Trigger Zone | Zone | Per-frame | unlimited |
| AE-29 | Floor Hazard Zone | Hazard | Per-frame | unlimited |
| AE-30 | Effect Zone | Zone | Per-frame | unlimited |
| AE-31 | Elevation Zone (Platform) | Platform | Per-frame | unlimited |
| AE-32 | Directional Zone | Force Zone | Per-frame | unlimited |
| AE-33 | Boost Pad | Terrain | Event-driven | unlimited |
| AE-34 | Scoring Zone | Special | Event-driven | unlimited |
| AE-35 | Zero-G Config | Special | Per-frame | 1 |
| AE-36 | Arena Shrink | Special | Per-frame | 1 |
| AE-37 | Arena Timeline Event | Special | Event-driven | unlimited |
| AE-38 | Bey Spawn System | Special | Dynamic | 1 |
| AE-39 | Multi-Floor Arena Link | Special | Event-driven | unlimited |
| AE-40 | Background Particles / Env Effect | Visual | Per-frame | 1 each |

---

## Arena Physics Fundamentals

### Coordinate System

- All positions: cm, arena-center-relative (origin at center, X right, Y down)
- Physics engine: Matter.js (server); all internal forces use Matter.js units
- **PX_PER_CM_BASE = 24** — 1 cm of world space = 24 screen pixels at 1080p reference resolution
- Arena resolution reference: 1080 × 1080 px (45 × 45 cm effective play area at standard zoom)
- Physics scale: `PHYSICS_SCALE` constant multiplied when translating world-px → Matter-px
- Conversion: `display_px = real_cm × 24 × viewportScale`

### Z-Axis Convention (2.5D)

The engine does not have a true z-axis in Matter.js. Height is simulated:

- `beyHeight` (ServerBeyblade): pixels above arena floor, used for aerial physics
- `beyVerticalVel`: upward velocity px/ms; gravity pulls it back down each tick
- Features define their visual height via z-offset applied as `screenY_offset = -(z_cm × 24 × cos(tiltAngle_rad))`
- Near side of tilted arena: full height visible; far side: foreshortened by `cos(tiltAngle)`
- Z-sorting: features are drawn bottom-to-top layer order within `arenaTiltInner`

### Tilt Chain (Renderer)

All arena content renders inside a three-container PixiJS chain:

```
worldRoot
  └── arenaTiltOuter  [rotation = tiltDirection_rad]
        └── arenaTiltScale  [scaleX = cos(tiltAngle_rad)]
              └── arenaTiltInner  [rotation = -tiltDirection_rad]
                    ├── arenaRotationRoot  (arena floor, features)
                    ├── beybladeLayer
                    ├── detachedBodyLayer
                    └── particleLayer
```

HUD is outside this chain and is not foreshortened.

### Floor Friction and Spin Decay

- `spinDecayRate = 8 × (1 − stamina × 0.001)` — base rate per second
- Bowl floor angle at radius: `α = wallAngle × (r / arenaRadius)`, spin decay scaled by `cos(α)`
- Liquid bodies override friction via `frictionMultiplier`
- Floor hazard zones override decay via `spinDecayMult`

### Authority Multiplier (Phase 25)

`computeArenaAuthorityMultiplier(arenaConfig, zone)` returns a multiplier (0–2) scaling player input:

| Zone | Default Override |
|------|-----------------|
| railTrack | Overridden by arena config |
| gravityWell | Overridden by arena config |
| spinZone | Overridden by arena config |
| pit | Overridden by arena config |
| bump | Overridden by arena config |
| obstacle | Overridden by arena config |

---

## AE-1 — Arena Boundary (Wall) {#ae-1}

**Element Type ID**: `wall`
**Category**: Boundary
**Z-Axis**: 0 → wallHeightCm (visual only) · vertical surface
**Physics Class**: Event-driven (collision response on contact)

### Geometry
The arena boundary is defined by the arena `shape` field:
- `circle` — 1 edge (360° arc)
- `triangle / square / pentagon / hexagon / heptagon / octagon` — 3–8 straight edges
- `star3` through `star8` — 6–16 edges (alternating outer and inner points)
- `rectangle` — 4 edges
- `arenaPixelRadius` = `Math.min(width, height) × 0.45` determines the outer KO boundary in px; divide by 24 for cm

Individual wall segments per edge: 1–3 segments, each defined by `WallSegment { width (0–100%), thickness, position (0–100%) }`. Gaps between segments become **exits** (shown as red-arrow zones).

### Physics Interaction with Beyblades
On boundary contact:
- Apply outward knockback impulse: `recoilDistance` cm
- Deal `baseDamage × spikeDamageMultiplier` (if `hasSpikes`) HP damage
- Bowl force redirects bey inward: `wallBowlForce(baseForce, wallAngle) = baseForce × (1 + sin(wallAngle_rad) × 0.8)`
- Ring-out: if bey center crosses `arenaPixelRadius`, the bey is eliminated

### Attack Types Produced
- Knockback impulse (outward)
- HP damage (base or spiked)
- Spin drain (indirect — bey spin decays faster at wall due to tilt)

### 2.5D Rendering
- Wall drawn as thick line/polygon outline at the arena perimeter
- Near-side wall segments appear taller than far-side due to `arenaTiltScale.scaleX = cos(tiltAngle)` foreshortening
- Exits rendered with red-arrow VFX; wall style: brick | metal | wood | stone

### Config Fields
```typescript
interface WallConfig {
  enabled: boolean;
  edges: EdgeWallConfig[];            // per-edge wall segment arrays
  commonThickness?: number;           // cm
  wallStyle: "brick" | "metal" | "wood" | "stone";
  wallColor?: string;
  exitStyle: "arrows" | "glow" | "dashed";
  exitColor: string;
  baseDamage: number;                 // HP per hit
  recoilDistance: number;             // cm
  hasSpikes: boolean;
  spikeDamageMultiplier: number;
}
```

### Engine Requirements
- Polygon/circle boundary body in Matter.js
- Per-edge wall-segment subdivision
- Spike damage multiplier flag
- Exit zone detection and KO trigger

### Arena Examples
All arenas have a boundary; circle shape (B-200 stadium) is the canonical example. Rectangle shape: Gen1 Infinity Stadium.

---

## AE-2 — Bowl Profile / Wall Angle {#ae-2}

**Element Type ID**: `bowlProfile` / `wallAngle`
**Category**: Boundary
**Z-Axis**: 0° (flat) → 75° (steep cup) · continuous wall slope
**Physics Class**: Per-frame (inward force at all radial distances)

### Geometry
Not a discrete object — a parameter on the entire arena surface. Cross-section of the arena bowl walls:
- `flat (0°)`: vertical walls, zero inward component
- `shallow (20°)`: gentle slope
- `medium (40°)`: classic B-200 bowl
- `deep (60°)`: steep funnel
- `steep (75°)`: near-horizontal cup, very hard to ring-out

### Physics Interaction with Beyblades
Per-tick inward force at radius `r`:
- `floorAngle = wallAngle × (r / arenaRadius)` — linear interpolation, flat at center
- Spin decay reduced on slope: multiplied by `cos(floorAngle)`
- `wallBowlForce(base, wallAngle) = base × (1 + sin(wallAngle_rad) × 0.8)` at the wall

### Config Fields
```typescript
// In ArenaConfig:
bowlProfile?: "flat" | "shallow" | "medium" | "deep" | "steep";
wallAngle?: number;   // 0–75 degrees; explicit value overrides bowlProfile
bowlDepth?: number;   // visual only: 0–1 depth scale for SideView
```

### Engine Requirements
- `getFloorAngleAtRadius(r, arenaRadius, wallAngleDeg)` in ArenaUtils.ts
- `wallBowlForce(baseForce, wallAngle)` in ArenaUtils.ts
- Spin decay scaled by `cos(floorAngle)` in physics loop

---

## AE-3 — Arena Tilt {#ae-3}

**Element Type ID**: `tiltAngle` / `tiltDirection`
**Category**: Boundary / Force
**Z-Axis**: 0° = flat; 90° = wall-ride; 180° = fully inverted; 360° = flat
**Physics Class**: Per-frame (lateral gravity applied every tick)

### Geometry
Not a discrete object — global arena orientation property. Tilts the entire arena plane around a horizontal axis, like tilting a coin on a table. Does NOT change bowl wall curvature (that is `bowlProfile`).

- `tiltPivotX/Y`: offset axis in cm from arena center (default 0,0)
- `tiltMode`: `"fixed"` | `"oscillate"` | `"weight"`
  - `oscillate`: tiltAngle rocks between `tiltOscillateMin` ↔ `tiltOscillateMax` on a sin wave (period `tiltOscillatePeriodMs`, default 4000 ms)
  - `weight`: direction + magnitude track beyblades' live center-of-mass
- `autoTilt`: `tiltDirection` increments at `tiltSpeed °/s`

### Physics Interaction with Beyblades
`computeTiltForce(tiltAngleDeg, tiltDirDeg, mass)` in ArenaUtils.ts:
```
TILT_GRAVITY_SCALE = 0.04
magnitude = sin(tiltAngle_rad) × TILT_GRAVITY_SCALE × mass
fx = cos(tiltDir_rad) × magnitude
fy = sin(tiltDir_rad) × magnitude
```
- At 0° / 360°: no force
- At 90°: maximum lateral pull (wall-ride)
- At 180°: force reverses direction (inverted gravity, Zero-G effect)

### 2.5D Rendering
Tilt chain in PixiRenderer:
```
arenaTiltOuter.rotation  = tiltDirection_rad       (aligns tilt axis with local X)
arenaTiltScale.scale.x   = cos(tiltAngle_rad)      (foreshortening; negative → visual flip)
arenaTiltInner.rotation  = -tiltDirection_rad      (restores orientation)
```
Near side: full height. Far side: multiplied by `cos(tiltAngle)`. At 90° the far side collapses to zero.

### Config Fields
```typescript
// In ArenaConfig:
tiltAngle?: number;             // 0–360°
tiltDirection?: number;         // 0–360° (0=right, 90=down, 180=left, 270=up)
tiltMode?: "fixed" | "oscillate" | "weight";
autoTilt?: boolean;
tiltSpeed?: number;             // °/s
tiltPivotX?: number;            // cm
tiltPivotY?: number;            // cm
tiltOscillateMin?: number;
tiltOscillateMax?: number;
tiltOscillatePeriodMs?: number; // default 4000
```

### Engine Requirements
- `computeTiltForce()` applied every tick to every active beyblade
- `advanceArenaTilt()` increments `tiltDirection` when `autoTilt` is on
- Renderer tilt chain must update every frame from server-synced `ArenaState`

---

## AE-4 — Arena Rotation {#ae-4}

**Element Type ID**: `autoRotate`
**Category**: Boundary / Dynamic
**Z-Axis**: N/A (XY-plane rotation)
**Physics Class**: Per-frame

### Geometry
Spins the arena surface (floor + all features) around the pivot point. Does not spin the outer boundary (walls stay fixed in world space by default unless features have `space: "local"` rotation).

- `rotationPivotX/Y`: offset pivot in cm (default 0,0 = arena center)
- `rotationSpeed`: degrees per second (6 °/s = 1 rev/min)
- `rotationDirection`: `"clockwise"` | `"counterclockwise"`
- Server-synced `ArenaState.rotation` field (radians)

### Physics Interaction with Beyblades
The server applies Coriolis-like correction: as the arena rotates, the effective position of static obstacles changes relative to beyblades. The physics bridge accounts for this when checking obstacle/zone collisions.

### 2.5D Rendering
`arenaRotationRoot` container is rotated each frame by the server-authoritative angle. Features with `selfRotation.space = "world"` are counter-rotated to stay fixed.

### Config Fields
```typescript
autoRotate: boolean;
rotationSpeed: number;           // °/s
rotationDirection: "clockwise" | "counterclockwise";
rotationPivotX?: number;         // cm
rotationPivotY?: number;         // cm
```

---

## AE-5 — Obstacle (Solid) {#ae-5}

**Element Type ID**: `obstacle`
**Category**: Obstacle
**Z-Axis**: 0 → `physics.heightCm` · solid body
**Physics Class**: Static (default) or Dynamic via `selfRotation`

### Geometry
Obstacles are rigid bodies placed inside the arena. Shape is a discriminated union:
- `circle`: single `radiusCm`
- `ring`: `innerRadiusCm`, `outerRadiusCm` (hollow circle)
- `arc`: radius + angular range + `thicknessCm`
- `spiral`: concentric turns with `thicknessCm`
- `polyline`: array of `{x_cm, y_cm}` waypoints + `thicknessCm` + `closed`
- `bezier`: bezier curve control points + `thicknessCm`
- `rectangle`: `widthCm × heightCm`
- `cross`: `armLengthCm × armWidthCm`
- `L_shape`, `T_shape`, `zigzag`, `star_shape`: specialized rigid shapes
- `pinball_bumper`: circle with custom `restitution`
- `wrecking_ball`: kinematic pendulum (see AE-13)

Legacy fallback: `radius` in px (÷24 for cm) when `shape` is absent.

### Physics Interaction with Beyblades
On collision:
- HP damage: `obs.damage × beyblade.damageTaken` each contact
- Knockback: `recoilDistance` cm outward from collision normal
- Destructible obstacles: lose `obs.health` HP per hit; at 0 `isDestroyed=true`, body removed
- `indestructible`: obstacle cannot be destroyed

### Attack Types Produced
- Lateral impulse (knockback, direction = collision normal)
- HP damage (flat × damageTaken multiplier)

### 2.5D Rendering
- Shape drawn using the `render` block: `{mode: "line", stroke}` or `{mode: "floor"}`
- Z-height from `physics.heightCm`; visual extrusion applied as dark side-face in floor mode
- `featureAnimation` overlays pulse/flicker/shimmer VFX
- `spriteId`: optional Firebase sprite replaces procedural draw

### Config Fields
```typescript
interface ObstacleConfig {
  id?: number;
  x: number;              // cm center-relative
  y: number;              // cm
  radius: number;         // legacy fallback px (÷24 = cm)
  health: number;         // HP
  damage: number;         // HP per collision
  recoilDistance: number; // cm
  indestructible?: boolean;
  color?: string;
  shape?: ObstacleShape;
  render?: ObstacleRenderMode;
  physics?: ObstaclePhysicsBlock;   // heightCm, type, etc.
  rotation?: RotationBlock;
  triggerState?: "on" | "off";
  controlledBySwitchId?: string;
  selfRotation?: SelfRotationConfig;
  elementType?: ElementType;
  featureAnimation?: FeatureAnimationConfig;
  spriteId?: string;
  floorIndex?: number;
}
```

### Engine Requirements
- Matter.js compound body creation from each ObstacleShape kind
- Destructible health tracking
- Switch-controlled `triggerState` toggling (body add/remove)
- Self-rotation kinematic update per tick

### Arena Examples
Rock pillars (rocky arenas), skyscrapers (metrocity theme), bones (prehistoric).

---

## AE-6 — Obstacle — Magnetic {#ae-6}

**Element Type ID**: `obstacle` with `physics.type = "magnetic"`
**Category**: Obstacle / Force Zone
**Z-Axis**: 0 → `physics.heightCm`
**Physics Class**: Per-frame (radial force field)

### Physics Interaction with Beyblades
`processMagnets()` in ArenaFeatureProcessor.ts:
```
radiusPx = physics.magnetRadiusCm × 24
strength = physics.magnetStrength    // positive = attract, negative = repel
if (d < radiusPx):
  falloff = 1 - (d / radiusPx)
  fx = (dx/d) × strength × falloff × 0.001
  fy = (dy/d) × strength × falloff × 0.001
  applyForce(bey.id, fx, fy)
```
Force falls off linearly from center to edge of magnetic radius. Magnet is only active when `triggerState !== "off"`.

### Config Fields
```typescript
interface ObstaclePhysicsBlock {
  type: "magnetic";
  heightCm: number;
  magnetRadiusCm?: number;    // effective pull/push radius (cm)
  magnetStrength?: number;    // N (positive=attract, negative=repel)
}
```

### Engine Requirements
- Per-tick distance check for all beys within `magnetRadiusCm`
- Falloff formula: linear 0→1 from center to rim
- Switch toggle support

---

## AE-7 — Obstacle — Electrified {#ae-7}

**Element Type ID**: `obstacle` with `physics.type = "electrified"`
**Category**: Obstacle / Hazard
**Physics Class**: Event-driven (on collision)

### Physics Interaction with Beyblades
`processElectrified()` in ArenaFeatureProcessor.ts: on obstacle contact, extends bey `controlLockedUntilMs`:
```
lockUntil = Date.now() + disableTicks × (1000/60)
beyblade.controlLockedUntilMs = max(existing, lockUntil)
beyblade.controlLockSource = "electric"
```
Combos and special moves are blocked during the lock window. Fires `electricDisable` event to client.

### Config Fields
```typescript
interface ObstaclePhysicsBlock {
  type: "electrified";
  heightCm: number;
  disableTicks?: number;   // ticks (default 60 = 1 second at 60Hz)
}
```

---

## AE-8 — Obstacle — Spinner {#ae-8}

**Element Type ID**: `obstacle` with `physics.type = "spinner"`
**Category**: Obstacle
**Physics Class**: Event-driven (on collision)

### Physics Interaction with Beyblades
`processSpinners()`: on contact, adds a spin boost:
```
spinBoost = (spinRpmImpulse / 3000) × bey.maxSpin × 0.1
bey.spin = min(bey.maxSpin, bey.spin + spinBoost)
```
Net effect: rapid contact with a spinner obstacle restores ~6.7% of max spin per hit.

### Config Fields
```typescript
interface ObstaclePhysicsBlock {
  type: "spinner";
  heightCm: number;
  spinRpmImpulse?: number;   // rpm impulse to bey (default 200 rpm → ~6.7% maxSpin)
}
```

---

## AE-9 — Obstacle — Sticky {#ae-9}

**Element Type ID**: `obstacle` with `physics.type = "sticky"`
**Category**: Obstacle / Hazard
**Physics Class**: Event-driven (on collision)

### Physics Interaction with Beyblades
`processSticky()`: on contact, freezes bey velocity and applies control lock:
```
setVelocity(bey.id, 0, 0)
lockUntil = Date.now() + stickyDurationTicks × (1000/60)
beyblade.controlLockSource = "sticky"
```

### Config Fields
```typescript
interface ObstaclePhysicsBlock {
  type: "sticky";
  heightCm: number;
  stickyDurationTicks?: number;   // ticks velocity frozen (default 30 = 0.5s)
}
```

---

## AE-10 — Obstacle — Crusher {#ae-10}

**Element Type ID**: `obstacle` with `physics.type = "crusher"`
**Category**: Obstacle / Hazard
**Physics Class**: Dynamic (kinematic per-tick travel)

### Physics Interaction with Beyblades
`processCrushers()`: crusher extends/retracts along `crushAxis` periodically (`crushCyclePeriodMs`). On contact while extending:
```
extraDmg = obs.damage × 0.5 × beyblade.damageTaken
bey.health -= extraDmg
```
The 0.5 multiplier applies on top of the base obstacle damage (total = 1.5× base when crusher is active).

### Config Fields
```typescript
interface ObstaclePhysicsBlock {
  type: "crusher";
  heightCm: number;
  crushAxis?: "x" | "y";
  crushTravelCm?: number;
  crushCyclePeriodMs?: number;
}
```

---

## AE-11 — Obstacle — Trampoline {#ae-11}

**Element Type ID**: `obstacle` with `physics.type = "trampoline"`
**Category**: Obstacle / Terrain
**Physics Class**: Event-driven

### Physics Interaction with Beyblades
On contact applies upward vertical velocity impulse proportional to `trampolineBoost`:
- Sets `beyblade.beyAirborne = true`, `beyblade.beyVerticalVel = baseVelocity × trampolineBoost`

### Config Fields
```typescript
interface ObstaclePhysicsBlock {
  type: "trampoline";
  heightCm: number;
  trampolineBoost?: number;   // upward velocity multiplier (default 1.5)
}
```

---

## AE-12 — Obstacle — Bouncy Net {#ae-12}

**Element Type ID**: `obstacle` with `physics.type = "bouncy_net"`
**Category**: Obstacle / Terrain
**Physics Class**: Event-driven

### Physics Interaction with Beyblades
High-restitution collision response — bey bounces back with `netRestitution × incomingSpeed`. No damage; purely kinematic reflection.

### Config Fields
```typescript
interface ObstaclePhysicsBlock {
  type: "bouncy_net";
  heightCm: number;
  netRestitution?: number;   // elasticity (default 1.8 — extra bouncy)
}
```

---

## AE-13 — Obstacle — Wrecking Ball {#ae-13}

**Element Type ID**: `obstacle` with `shape.kind = "wrecking_ball"`
**Category**: Obstacle / Dynamic
**Z-Axis**: 0 → `shape.cableLength` (anchor at top, ball swings below)
**Physics Class**: Dynamic (kinematic pendulum per tick)

### Geometry
A pendulum: the obstacle's `x,y` is the cable anchor point. The ball swings on a cable of length `cableLength` (in units requiring ×24 for px) with amplitude `swingAmplitudeDeg` and period `swingPeriodMs`.

Ball position each tick:
```
phaseDeg = startPhaseDeg + (360 × matchElapsedMs) / swingPeriodMs
swingAngle_rad = swingAmplitudeDeg × cos(phaseDeg_rad) (in radians)
ballX = anchorX + sin(swingAngle_rad) × cableLength × 24
ballY = anchorY + cos(swingAngle_rad) × cableLength × 24
```

### Physics Interaction with Beyblades
`processWreckingBalls()`: each tick checks if bey is within `radiusCm × 24` of ball center:
```
if (dist(bey, ball) < ballRadius):
  knockback(bey, direction=(bey - ball), distance=obs.recoilDistance)
  dmg = obs.damage × bey.damageTaken
  bey.health -= dmg
```

### Config Fields
```typescript
{ kind: "wrecking_ball";
  radiusCm: number;
  cableLength: number;         // in game units (×24 = px)
  swingAmplitudeDeg: number;
  swingPeriodMs: number;
  startPhaseDeg?: number;
}
```

### Engine Requirements
- Kinematic position update every tick (matchElapsedMs required)
- Separate from Matter.js body — position computed analytically

---

## AE-14 — Obstacle — Pinball Bumper {#ae-14}

**Element Type ID**: `obstacle` with `shape.kind = "pinball_bumper"`
**Category**: Obstacle / Terrain
**Physics Class**: Event-driven

### Physics Interaction with Beyblades
High-restitution circular obstacle. Contact applies outward knockback (collision normal direction) at `recoilDistance` cm. Custom `restitution` value sets bounce elasticity in Matter.js body properties.

### Config Fields
```typescript
{ kind: "pinball_bumper";
  radiusCm: number;
  restitution?: number;   // Matter.js restitution (default ~0.9 for pinball)
}
```

---

## AE-15 — Switch {#ae-15}

**Element Type ID**: `switch`
**Category**: Interactive
**Z-Axis**: 0 → standard obstacle height · floor-mounted pad
**Physics Class**: Event-driven (triggered on beyblade contact)

### Geometry
A floor tile or pad at `x,y` (cm). Shape defaults to small circle; custom `ObstacleShape` optional. On contact by a beyblade that meets `requiresMinSpin` (if set), triggers all configured `targets` after `triggerCountToActivate` hits.

### Physics Interaction with Beyblades
No direct force. Triggers a chain of actions on target features:
- `toggle`: flip `triggerState` on/off
- `set-on` / `set-off`: force state
- `pulse`: activate for `durationMs` then restore
- `rotation-on` / `rotation-off`: start/stop a feature's self-rotation
- `set-property`: set arbitrary config property
- `chain`: cascade to another switch

Target types: `obstacle | water | portal | pit | ridge | zone | trigger-zone | spin-zone | speedline | gravity-hole | turret | switch`

**Extended action verbs** — beyond toggle/set-on/set-off, the switch supports:

| Action | What it does | Required fields |
|--------|-------------|-----------------|
| `toggle` | Flip active state on/off | `targetId` |
| `set-on` / `set-off` | Force to a specific state | `targetId` |
| `pulse` | Activate for `durationMs` then restore | `targetId`, `durationMs` |
| `rotation-on` / `rotation-off` | Start/stop self-rotation | `targetId` |
| `set-property` | Set any config field to a new value | `targetId`, `property`, `value` |
| `chain` | Trigger another switch | `chainToSwitchId` |
| **`move`** | Animate element to new position over time | `targetId`, `toX_cm`, `toY_cm`, `moveDurationMs` |
| **`show`** / **`hide`** | Show or hide element (no physics while hidden) | `targetId` |
| **`replace`** | Swap element config entirely (e.g. road → spin zone) | `targetId`, `newConfig` |

**`move` action** — this is how walls and obstacles slide to new positions:
```typescript
// Switch fires → wall slides 40cm to the right over 1 second
{
  action: "move",
  targetId: "wall_gate_north",
  toX_cm: 60,    // absolute world position
  toY_cm: 0,
  moveDurationMs: 1000,
  // engine linearly interpolates obstacle x,y from current position to (toX_cm, toY_cm)
  // Matter.js body position updated per tick during the animation
  // collision is LIVE during the move — a bey can be pushed by the moving wall
}
```

**`show` / `hide` action** — this is how speed lines and obstacles appear/disappear:
```typescript
// Switch fires → speed line appears
{ action: "show", targetId: "speed_line_inner" }
// Another switch fires → speed line disappears
{ action: "hide", targetId: "speed_line_inner" }
```
While `hidden`, the element's Matter.js body is removed (no collision). On `show`, the body is re-added. The element is NOT destroyed — it returns to active state on `show`.

**Debris / destruction as switch trigger (AE-41 link):** An obstacle's `onDestroy` can fire a switch, which then triggers `show`/`move`/`replace` on other elements. This makes the bowling-pin example chainable:
```
pin destroyed → onDestroy fires switch "pin_01_destroyed" →
switch triggers: show "bump_01" (the fallen pin bump) + hide "pin_01_sprite"
```
This is an alternative to inline `onDestroy.elements` for situations where the spawned element was pre-placed in the arena (just hidden) rather than dynamically created.

### Config Fields
```typescript
interface SwitchConfig {
  id: string;
  x: number;          // cm
  y: number;          // cm
  iconKey: string;
  animationKeys?: { idle?: string; pressed?: string; cooldown?: string };
  switch: {
    targets: SwitchTarget[];        // what to activate/toggle
    cooldownMs: number;             // recharge time between triggers
    autoReset?: number;             // ms until switch resets to default
    requiresMinSpin?: number;       // bey must have >= this spin fraction to trigger
    triggerCountToActivate?: number;// hits required (default 1)
  };
  shape?: ObstacleShape;
  rotation?: RotationBlock;
}

interface SwitchTarget {
  action: "toggle" | "set-on" | "set-off" | "pulse" | "rotation-on" | "rotation-off"
        | "set-property" | "chain" | "move" | "show" | "hide" | "replace";
  targetId?: string;
  durationMs?: number;           // for "pulse"
  chainToSwitchId?: string;      // for "chain"
  property?: string;             // for "set-property"
  value?: unknown;               // for "set-property"
  // For "move":
  toX_cm?: number;
  toY_cm?: number;
  moveDurationMs?: number;       // animation duration (physics live during move)
  // For "replace":
  newConfig?: Partial<ArenaElementConfig>;
}
```

### Engine Requirements
- Contact detection (point-in-shape or circle overlap at switch x,y)
- Spin threshold check before trigger
- Target lookup across all feature arrays by type + id
- Cooldown timer per switch
- **`move` action**: per-tick linear interpolation of target element's x,y from current to `(toX_cm, toY_cm)` over `moveDurationMs`. Update Matter.js body position each tick using `Body.setPosition()`. Collision is active during move — bey can be pushed.
- **`show` / `hide` action**: add/remove Matter.js body via `World.add/remove`. Update `element.hidden` flag on schema. Renderer shows/hides sprite on flag change (event-driven).
- **Destruction → switch trigger (AE-41 link)**: when `onDestroy.fireSwitchId` is set, the destruction handler calls `triggerSwitch(switchId)` — same code path as a bey hitting the switch physically.

---

## AE-16 — Gravity Hole {#ae-16}

**Element Type ID**: `gravityHole`
**Category**: Force Zone
**Z-Axis**: N/A (force emanates from 2D point)
**Physics Class**: Dynamic (intermittent activation cycle)

### Geometry
A circular force attractor at `x_cm, y_cm` with `effectiveRadiusCm`. Active for `activeMs` per cycle, then dormant for `intervalMs`. Warning animation plays for `warningMs` before activation.

### Physics Interaction with Beyblades
When active, each bey within `effectiveRadiusCm` receives an attractive force each tick:
```
dx = hole.x - bey.x
dy = hole.y - bey.y
d = sqrt(dx² + dy²)
applyForce(bey, (dx/d) × forceN, (dy/d) × forceN)
```
`forceN` is peak attraction in Matter.js force units.

If `controlledBySwitchId` is set, only activates when that switch is in the "on" state.
`selfRotation`: makes the gravity hole orbit its own center visually.

### Config Fields
```typescript
interface GravityHoleConfig {
  id: string;
  x_cm: number;
  y_cm: number;
  forceN: number;               // peak attraction (Matter.js force units)
  effectiveRadiusCm: number;
  activeMs: number;             // pull duration per cycle
  intervalMs: number;           // pause between cycles
  warningMs: number;            // visual pre-activation warning
  visibility: "always-hidden" | "warning-only" | "visible";
  rotation?: RotationBlock;
  controlledBySwitchId?: string;
  selfRotation?: SelfRotationConfig;
  elementType?: ElementType;
  featureAnimation?: FeatureAnimationConfig;
  behaviorId?: string;
  behaviorParams?: Record<string, unknown>;
}
```

### Engine Requirements
- Per-feature activation timer (activeMs / intervalMs cycle)
- Warning phase advance (warningMs before active)
- Per-tick force application inside effectiveRadiusCm during active phase
- Switch-controlled enable/disable
- `behaviorId` override dispatches to MechanicRegistry

### Arena Examples
Gravity-well hazard arenas; used in arena_feature_configs collection seed data.

---

## AE-17 — Spin Zone {#ae-17}

**Element Type ID**: `spinZone`
**Category**: Force Zone
**Z-Axis**: N/A (2D area effect)
**Physics Class**: Per-frame

### Geometry
Circular zone at `x_cm, y_cm` with `radius_cm`. Applies continuous orbital or spin force to beys inside. Always active unless `controlledBySwitchId` switch is off.

### Physics Interaction with Beyblades
Per tick while bey is inside radius:
- If `applyTo = "linear"` or `"both"`: apply tangential orbit force `intensityRadPerSec` in `direction` (cw/ccw)
  ```
  dx = bey.x - zone.x,  dy = bey.y - zone.y
  tangent = (-dy, dx) normalized (cw) or (dy, -dx) (ccw)
  applyForce(bey, tangent × intensityRadPerSec)
  ```
- If `applyTo = "spin"` or `"both"`: add `intensityRadPerSec` to bey spin (capped at `maxSpin`)

`selfRotation`: zone sprite animates rotating.

### Config Fields
```typescript
interface SpinZoneConfig {
  id: string;
  x_cm: number;
  y_cm: number;
  radius_cm: number;
  direction: "cw" | "ccw";
  intensityRadPerSec: number;
  applyTo: "linear" | "spin" | "both";
  assetId?: string;
  controlledBySwitchId?: string;
  rotation?: number;              // initial sprite orientation
  selfRotation?: SelfRotationConfig;
  elementType?: ElementType;
  featureAnimation?: FeatureAnimationConfig;
  behaviorId?: string;
  behaviorParams?: Record<string, unknown>;
}
```

### Engine Requirements
- Per-tick in-zone check (circle overlap)
- Tangential force vector from orbit formula
- Spin value increment capped at maxSpin

---

## AE-18 — Bump {#ae-18}

**Element Type ID**: `bump`
**Category**: Terrain
**Z-Axis**: 0 → `popHeight_cm` · raised nub
**Physics Class**: Event-driven (on contact)

### Geometry
Small raised circle at `x_cm, y_cm` with `radius_cm`. Triggers when bey center is within radius.

### Physics Interaction with Beyblades
On contact:
- Vertical pop: sets `beyblade.beyAirborne = true`, applies upward velocity proportional to `popHeight_cm`
- Lateral recoil: `applyKnockback(bey, outwardDir, recoil)` where `recoil` is the config value

`recoil` is a dimensionless force magnitude passed to `applyKnockback`. Effectively a small outward impulse.

### Config Fields
```typescript
interface BumpConfig {
  id: string;
  x_cm: number;
  y_cm: number;
  radius_cm: number;
  popHeight_cm: number;    // Z-height of the pop impulse (cm)
  recoil: number;          // lateral knockback magnitude
  assetId?: string;
  controlledBySwitchId?: string;
  rotation?: number;
  selfRotation?: SelfRotationConfig;
  elementType?: ElementType;
  featureAnimation?: FeatureAnimationConfig;
  behaviorId?: string;
  behaviorParams?: Record<string, unknown>;
}
```

### 2.5D Rendering
Rendered as a small raised disc. In tilt mode the near-side bump appears taller than the far-side bump (foreshortened by `cos(tiltAngle)`). Screen Y offset: `-(popHeight_cm × 24 × cos(tiltAngle_rad))`.

---

## AE-19 — Water Body (Moat) {#ae-19}

**Element Type ID**: `waterBody` / `type: "moat"`
**Category**: Liquid
**Z-Axis**: floor level (liquid is at z=0)
**Physics Class**: Per-frame (while bey is inside)

### Geometry
Ring-shaped body of liquid surrounding the arena. `thickness` cm wide, inner edge at `distanceFromArena` cm from center. Follows arena shape if `followsArenaShape=true`, or uses custom `moatShape`. Can self-rotate via `selfRotation`.

### Physics Interaction with Beyblades
Per tick while bey overlaps moat zone — effects determined by `liquidType`:

| Liquid | Speed | Friction | Damage/s | Spin Drain/s | Special |
|--------|-------|----------|----------|--------------|---------|
| water | ×0.8 | ×1.3 | 0 | 0 | splash particles |
| lava | ×0.6 | ×2.0 | 5 | 0 | push force 3N, burn status |
| ice | ×0.5 | ×1.5 | 0 | 10 | freeze after 5s (3s freeze) |
| healing | ×1.0 | ×1.0 | -3 (heal) | -20 (gain) | no negatives |
| speedBoost | ×1.5 | ×0.7 | 0 | -10 (gain) | |
| quicksand | ×0.3 | ×3.0 | 0 | 20 | stun after 4s |
| oil | ×1.2 | ×0.3 | 0 | 0 | no traction |
| poison | ×0.7 | ×1.2 | 2 | 30 | |

`effects?: WaterEffectConfig` overrides any preset value.

### Config Fields
```typescript
interface MoatWaterBodyConfig {
  id: string;
  type: "moat";
  liquidType: LiquidType;
  thickness: number;            // cm, 1–10
  distanceFromArena: number;    // cm, 5–25
  followsArenaShape: boolean;
  moatShape?: ArenaShape;
  rotation?: number;
  selfRotation?: SelfRotationConfig;
  color?: string;
  opacity?: number;             // 0–1
  depth?: number;               // visual, 0–10
  wavyEffect?: boolean;
  effects?: WaterEffectConfig;
  textureId?: string;
}
```

### Engine Requirements
- Annular region overlap detection (or shape-following polygon)
- Per-liquid-type effect dispatch each tick
- Freeze timer, stun timer tracked per bey per liquid zone

---

## AE-20 — Water Body (Zone) {#ae-20}

**Element Type ID**: `waterBody` / `type: "zone"`
**Category**: Liquid
**Physics Class**: Per-frame

Identical liquid effects to AE-19. Placed at arbitrary `position {x, y}` cm. Shapes: `circle | square | rectangle | oval`. `rotation` for rectangular/oval zones. Max 3 water bodies total across all types.

### Config Fields
```typescript
interface ZoneWaterBodyConfig {
  id: string;
  type: "zone";
  liquidType: LiquidType;
  position: { x: number; y: number };  // cm
  shape: "circle" | "square" | "rectangle" | "oval";
  radius?: number;    // cm, circle/oval
  width?: number;     // cm, rectangle
  height?: number;    // cm, rectangle/oval
  rotation?: number;
  effects?: WaterEffectConfig;
}
```

---

## AE-21 — Water Body (Wall-Based) {#ae-21}

**Element Type ID**: `waterBody` / `type: "wall-based"`
**Category**: Liquid
**Physics Class**: Per-frame

Strip of liquid along the arena's inner edge. `thickness` cm inward from edge, `offsetFromEdge` cm gap. `coversExits`: whether the strip extends across exit gaps. Same liquid physics as AE-19.

### Config Fields
```typescript
interface WallBasedWaterBodyConfig {
  id: string;
  type: "wall-based";
  liquidType: LiquidType;
  thickness: number;       // cm, 1–5
  offsetFromEdge: number;  // cm, 0–3
  coversExits: boolean;
}
```

---

## AE-22 — Pit {#ae-22}

**Element Type ID**: `pit`
**Category**: Hazard
**Z-Axis**: 0 → `depth` (visual; bey is "inside" and cannot be controlled)
**Physics Class**: Dynamic (escape attempt each tick)

### Geometry
Circular hazard zone at `position {x, y}` cm with `radius` cm. When a beyblade's center enters the radius, it is "trapped": velocity zeroed, input ignored.

### Physics Interaction with Beyblades
Per tick while trapped:
- Deal `spinDamagePerSecond × dt` spin damage
- Each tick: random roll vs `escapeChance`; on success bey is released with small outward impulse
- No HP damage (only spin drain)
- Type variants: `edge | crater | penalty_well | xtreme_zone | over_zone | spike_pit`

Pit types are cosmetic only — all share the same physics. `spike_pit` visually implies extra danger but physics are controlled by `spinDamagePerSecond` and `escapeChance` values.

For multi-floor arenas: `ArenaLink` of type `"pit"` connects a pit on floor N to an exit on floor N-1.

### Config Fields
```typescript
interface PitConfig {
  id: string;
  type: PitType;
  position: { x: number; y: number };  // cm
  radius: number;        // cm, 1–5
  depth: number;         // visual depth, 1–10
  spinDamagePerSecond: number;  // 5–50
  escapeChance: number;         // 0–1
  color?: string;
  autoPlace?: boolean;
  edgeOffset?: number;         // cm from edge (for edge-type pits)
  angle?: number;              // degrees (for edge-type pits)
  rotation?: number;
  selfRotation?: SelfRotationConfig;
}
```

### Engine Requirements
- Circle overlap detection
- `trappedBeybladeId` field on PitState tracks current occupant (max 1 per pit)
- Per-tick escape roll
- ArenaLink integration for multi-floor pit connections

---

## AE-23 — Turret {#ae-23}

**Element Type ID**: `turret`
**Category**: Special
**Z-Axis**: 0 → `radius × (some height factor)` (placed on arena floor)
**Physics Class**: Dynamic (AI aim + fire cycle each tick)

### Geometry
A stationary weapon emplacement at `x, y` cm (config stores px; see note: TurretConfig uses px, not cm). `radius` in px (÷24 = cm). Up to 8 turrets per arena.

Turret rotates to track target based on `attackType` + `firePattern`. Fire patterns: `nearest | furthest | random | round_robin | lowest_spin | highest_spin | center | sweep_cw`.

### Physics Interaction with Beyblades

Turrets fire projectiles or apply direct AoE effects depending on `attackType`. The full named-type library is defined in `shared/types/arenaConfigNew.ts` (~400 entries). All of them reduce to one of the **physics behavior categories** below — the engine implements the categories; the named types are config-layer aliases that map to a category + params.

#### Category 1 — Standard Projectile (entity-based)

Creates a `ServerProjectile` entity that moves per tick and collides with beys.

| Sub-type | Key params | Behavior |
|----------|-----------|----------|
| `periodic` | `bulletSpeed`, `bulletCount` | Single bullet per cooldown cycle |
| `burst_fire` | `burstCount`, `burstIntervalSec`, `burstReloadSec` | N rapid shots then pause |
| `boomerang` | `boomerangReturnTime`, `returnSpeed` | Arcs to target, returns |
| `tracking_missile` | `missileTrackingDeg` (°/s) | Steers toward target each tick |
| `multi_missile` | `missileCount` | N simultaneous homing projectiles |
| `shadow_ball` | `splitCount` | Projectile splits on impact into N sub-projectiles |
| `drill_shot` | `piercing: true` | Passes through first target to hit beys behind |
| `extreme_speed` | `priorityFire: true` | Fires at start of cooldown (before charge) |
| `kunai_barrage` | `fanAngle_deg`, `count` | N projectiles in a spread cone |

#### Category 2 — Beam (continuous line entity)

Beam exists as a persistent line entity from turret to max range. Damage applies per tick bey is inside.

| Sub-type | Key params | Behavior |
|----------|-----------|----------|
| `beam` | `beamChargePeriod`, `beamDuration` | Charge then fire sustained beam |
| `laser_sweep` | `sweepArcDeg`, `sweepSpeedDeg` | Rotating beam sweeps an arc |
| `tractor_beam` | `tractorBeamForce` | Pull force instead of damage — no hit detection |
| `flamethrower` | `burnDoTTicks` | Burn DoT persists on bey after beam ends |
| `hyper_beam` | `chargeDuration`, `rechargeDowntime` | Long charge → single devastating → long downtime |
| `death_beam` / `kamehameha` / `cero` etc. | same as beam category | Named variants of beam with different params |
| `solar_beam` | `chargeInSunnyWeather: 0` | Charges instantly in sunny weather, 1s otherwise |
| `flash_cannon` | `bypassDefense: true` | Damage ignores `damageReduction` stat |

#### Category 3 — Area of Effect (no entity, immediate)

Direct effect at target position or all beys in range. No `ServerProjectile` created.

| Sub-type | Key params | Behavior |
|----------|-----------|----------|
| `aoe` | `explosionRadius`, `aoeDamageRadius` | Blast at target position |
| `plasma_ring` | `plasmaRingExpandSpeed`, `plasmaRingMaxRadius` | Expanding damage ring from turret |
| `emp` | `empDisableTicks` | Disables combos + specials for all beys in `attackRange` |
| `gravity_cannon` | `wellDuration`, `wellRadius` | Spawns temp AE-16 gravity well at target |
| `earthquake` | `shockwaveCount`, `shockwaveSpeed` | Radial expanding shockwave rings |
| `eruption` / `bolt_strike` / `origin_pulse` (ULTIMATE) | `targetsAll: true` | Hits ALL beys simultaneously |
| `roar` | `scrambleDurationMs` | Control-scrambles all beys in range |
| `gust` | `pushDirection` | Pushes ALL beys in a set direction |

#### Category 4 — Status Effect (debuff applied to bey schema)

Applies a timed status flag to a specific bey. Status resolves per tick.

| Status | Effect while active | Cleared by |
|--------|--------------------|----|
| `stunned` | `velocity = 0`, no input | `stunDurationMs` elapsed |
| `confused` | Movement inputs inverted | `confuseDurationMs` elapsed |
| `burned` | `HP -= burnDmgPerTick` each tick | `burnDurationTicks` elapsed |
| `frozen` | `velocity = 0`, `spinDecay ×2` | Timer OR taking damage |
| `poisoned` | `HP -= poisonDmgPerTick`, `spin -= spinDrainPerTick` | Duration elapsed |
| `leeched` | Both HP and spin drained per tick | Duration elapsed |
| `shrunk` | Hitbox ×0.5, speed +30%, damage -40% | Duration elapsed |
| `enlarged` | Hitbox ×1.5, speed -30%, collision dmg +40% | Duration elapsed |
| `slowed` | Speed ×0.1 (sticky web), or ×0.3 (string shot) | Duration elapsed |
| `magneted` | Force-chases nearest opponent | Duration elapsed |
| `invisible` | No collision, no renderer (perfect_mirage) | Duration elapsed |
| `ghost` | Passes through opponents, no collision (ghost_walk) | Duration elapsed |

Attack types that apply status: `thunderbolt`/`zap_cannon` → stunned; `confuse_ray`/`tsukuyomi` → confused; `flamethrower`/`ember` → burned; `ice_beam`/`blizzard` → frozen; `sludge_bomb`/`muken_poison` → poisoned; `leech_seed` → leeched; `sticky_web`/`string_shot` → slowed; `enlarge`/`shrink` → size change; `magnet_bey` → magneted; `perfect_mirage` → invisible; `ghost_walk` → ghost.

#### Category 5 — Floor Hazard Placement (spawns arena element)

Turret drops a persistent floor element at target position. Element is managed by `ArenaFeatureProcessor` after spawn.

| Sub-type | Spawns | AE type |
|----------|--------|---------|
| `mine_layer` | Proximity mine at target | AE-4 obstacle (trigger on proximity) |
| `sticky_web` | Sticky web patch | AE-2 floor zone (μ = 0.02) |
| `stealth_rock` | Invisible damage zone | AE-28 trigger zone |
| `toxic_spikes` | Poison spike field | AE-2 floor zone with DoT |
| `sand_tomb` | Sand vortex zone | AE-16 gravity well variant |
| `whirlpool` (turret) | Temporary whirlpool | AE-16 whirlpool variant |
| `exploding_tag` | Proximity bomb | AE-4 obstacle (destructible, health=1) |
| `fire_spin` | Fire ring around target | AE-2 floor zone (damage+trap) |

#### Category 6 — Environment / Weather Change

Modifies global `ArenaState` modifiers for a fixed duration. Applied to all beys simultaneously.

| Sub-type | Effect | Duration |
|----------|--------|---------|
| `sunny_day` | Fire ×1.5, Water ×0.5, spinDecayMult +0.2 | 8s |
| `rain_dance` | Water ×1.5, Fire ×0.5, adds slip zones | 8s |
| `sandstorm` | All beys HP damage per tick, traction -20% | 8s |
| `hail_weather` | Ice ×1.5, random freeze hits per 2s | 8s |
| `misty_terrain` | Status effects blocked, traction -10% | 8s |
| `grassy_terrain` | Gradual spin recovery, Nature ×1.3 | 8s |
| `electric_terrain` | Prevents stun/freeze, Lightning ×1.3 | 8s |
| `psychic_terrain` | Next hit on any bey ignores dodge speed | 8s |

Engine: weather state = `ArenaState.weather: { type, expiresAt }`. Per tick: check expiry; apply global modifier overrides; element type damage multipliers read from `ArenaState.weather.type` in the collision resolver.

#### Category 7 — Self-Buff / Turret State Change

Turret modifies its own properties for a duration.

| Sub-type | Effect |
|----------|--------|
| `swords_dance`, `meditate` | `turret.damageMult ×2–4` for next N shots |
| `harden`, `barrier`, `withdraw` | Invulnerable for duration; `barrier` reflects hit damage |
| `ultra_form`, `bankai_release` | All stats ×2 for duration |
| `agility` | `attackCooldown ×0.5` for N shots |
| `overheat` | Triple damage once, then `cooldown ×3` |
| `nasty_plot` | Next 5 shots bypass all `damageReduction` |
| `final_explosion` | Mega AoE nuke, then turret dormant 10s |

#### Category 8 — Bey-as-Weapon (NEW physics class)

**These are not standard projectile or AoE attacks.** Instead, the turret modifies the target BEY itself — the bey becomes the projectile. This is a distinct physics category requiring its own engine handler.

| Sub-type | What happens to the bey |
|----------|------------------------|
| `spread_bey` | On the bey's next collision, it fans into 5 simultaneous impact vectors (radial scatter) |
| `railbey` | Bey moves at 4× speed in its current facing direction, piercing through other beys it contacts |
| `minigun_bey` | Bey's collision fires 12 rapid micro-damage pulses at 60ms intervals against the first bey hit |
| `heat_seeker_bey` | Bey auto-locks and rams the nearest opponent at high force |
| `bomb_bey` | Bey becomes a ticking bomb — explodes on collision or after 4s fuse (AoE at bey position) |
| `shield_bey` | Bey gains full-body energy shield: blocks next hit + returns AoE burst to attacker |
| `turbo_bey` | Bey's spin and speed → maxSpin and maxSpeed for 5s |
| `cannon_bey` | Turret catapults the bey at full force toward the furthest opponent (position override) |

Engine: apply a `BeyStatusEffect` of type `bey_weapon_mode` with sub-type param. The `CollisionResolver` checks for `bey_weapon_mode` before resolving normal collision and branches to the weapon-mode handler.

#### Category 9 — Bey Movement Override (NEW physics class)

Overrides or alters the bey's movement physics for a duration. Different from status effects — these change the physics parameters rather than applying damage/debuffs.

| Sub-type | Physics effect |
|----------|---------------|
| `speed_surge` | `bey.velocity ×3`, `maxForce ×3` for 2s — extreme erratic movement |
| `gravity_flip` | Negate radial attraction — bey is repelled FROM center instead of attracted |
| `bounce_storm` | Wall restitution ×3 for 3s — bey bounces violently off all walls |
| `freeze_step` | `bey.velocity = 0`, `inputForce = 0` for 1.5s (complete freeze) |
| `ghost_walk` | `bey.collisionGroup = GHOST` — passes through opponents, not through walls |
| `boomerang_path` | Bey enters fixed circular orbit at current radius around arena center |
| `teleport_dash` | Bey blinks to 3 random positions at 0.4s intervals |
| `distortion` | Immediate: teleport to random arena position, no damage |
| `broken_reality` | ALL beys teleport to random positions simultaneously |

Engine: `BeyMovementOverride` struct on `Beyblade` schema. Physics loop reads override each tick and substitutes normal force/velocity calculations.

#### Fire Patterns (8 target-selection strategies)

| Pattern | Target logic |
|---------|-------------|
| `nearest` | Closest bey by Euclidean distance |
| `furthest` | Furthest bey |
| `random` | Random bey each shot |
| `round_robin` | Cycle through all beys in order |
| `lowest_spin` | Bey with lowest `bey.spin` (weakest target) |
| `highest_spin` | Bey with highest `bey.spin` (strongest target) |
| `center` | Aim toward arena center (0,0) — bypasses bey tracking |
| `sweep_cw` | Rotate aim clockwise continuously at `sweepSpeed` °/s |

Turret HP: `health` points; if `destructible` (default) can be destroyed by beyblade collisions. `indestructible` flag prevents destruction.

### Config Fields
```typescript
interface TurretConfig {
  id?: number;
  x: number;           // center-relative px (÷24 = cm)
  y: number;
  radius: number;      // px
  health: number;
  indestructible?: boolean;
  attackType: TurretAttackType;   // one of ~400 named types in arenaConfigNew.ts
  attackDamage: number;
  attackRange: number;            // px
  attackCooldown: number;         // seconds
  firePattern?: TurretFirePattern;
  // Category-specific params (only relevant params needed per category):
  beamDuration?: number;          // beam category
  beamChargePeriod?: number;      // beam category
  bulletSpeed?: number;           // projectile category
  bulletCount?: number;           // projectile category
  missileTrackingDeg?: number;    // tracking_missile
  burstCount?: number;            // burst_fire
  burstIntervalSec?: number;      // burst_fire
  burstReloadSec?: number;        // burst_fire
  explosionRadius?: number;       // aoe category
  stunDurationMs?: number;        // status effect category
  confuseDurationMs?: number;     // status effect category
  // ... full param list in TurretConfig in arenaConfigNew.ts
  spriteId?: string;
  projectileSpriteId?: string;
}
```

### Engine Requirements
- AI targeting loop (selects target each fire cycle per `firePattern`)
- Projectile spawning into `state.projectiles` map
- Per-tick projectile movement (linear, homing, boomerang return) + collision
- AoE/direct effect processing without entity
- Status effect application + per-tick resolution (`bey.statusEffects[]` map)
- **Bey-as-weapon handler** — `CollisionResolver` checks `bey.weaponMode` before normal collision
- **Bey movement override handler** — physics loop checks `bey.movementOverride` each tick
- Weather state on `ArenaState` — per-tick: check expiry, apply global modifier set
- Floor hazard placement via `ArenaFeatureProcessor.spawnDynamicElement()`
- Turret self-buff state machine (track `turret.buffState`, apply `damageMult` overrides)
- Turret HP tracking + destruction
- Named type → category mapping: `turretAttackTypeRegistry` maps each of ~400 named types to a category + default params (loaded at server startup via `preloadAllRegistries()`)

---

## AE-24 — Portal {#ae-24}

**Element Type ID**: `portal`
**Category**: Special
**Z-Axis**: floor level
**Physics Class**: Event-driven (on contact)

### Geometry
Linked pair(s) of teleportation discs. Up to 4 portals per arena. Each portal has `position {x, y}` cm and `radius` cm. Up to 4 portals are all interconnected: entering any portal can exit from any other (or specific one via config).

`autoPlace`: if true, portals are distributed at equal angles at `distanceFromCenter` cm. `angle` overrides per-portal.

`bidirectional`: if false, only the entrance portal can receive traffic (one-way teleport).

### Physics Interaction with Beyblades
On bey center entering portal radius:
1. Check `cooldown` — if on cooldown, skip
2. Teleport bey to exit portal center (`outPointX, outPointY`)
3. Preserve velocity direction; optionally adjust magnitude
4. Set `isOnCooldown = true` for `cooldown` seconds

### Config Fields
```typescript
interface PortalConfig {
  id: string;
  position: { x: number; y: number };  // cm
  radius: number;      // cm
  cooldown?: number;   // seconds
  color?: string;
  autoPlace?: boolean;
  distanceFromCenter?: number;  // cm
  angle?: number;               // degrees
  rotation?: number;
  selfRotation?: SelfRotationConfig;
  spriteId?: string;
}
```

### Engine Requirements
- Per-tick center-in-circle check for each portal
- Cooldown timer per portal per bey
- Teleport: set Matter.js body position to exit portal center
- `isOnCooldown` synced on `PortalState`

---

## AE-25 — Speed Path / Loop {#ae-25}

**Element Type ID**: `speedPath` (also `loop` for legacy)
**Category**: Terrain
**Z-Axis**: floor level; path is a floor feature
**Physics Class**: Per-frame (while bey is on path)

### Geometry
Closed or open speed tracks inside the arena. Shapes: `circle | rectangle | pentagon | hexagon | octagon | star | oval | ring | spiral | figure_8 | zigzag | custom_bezier`. `radius` cm from center. Ring shapes have `ringThickness` cm.

Optional: `breaks` (SpeedPathBreak array) create gaps in the path surface. `bumpProfile` / `ridgeProfile` add pop/grind surfaces at specific path positions.

`chargePoints` (max 3): interactive tap-points on the path that launch the bey toward `center` or `opponent` at `dashSpeed` multiplier.

### Physics Interaction with Beyblades
Per tick while bey overlaps path:
- Speed boost: multiply velocity by `speedBoost` (e.g. 1.5 = 50% faster)
- Spin boost: `spinBoost` spin points per second
- Friction reduction: `frictionMultiplier < 1`
- Path direction arrows guide visual; no forced steering

`minPathDuration` / `maxPathDuration`: bey stays on path for at least min, maximum max, then exits.

### Config Fields
```typescript
interface SpeedPathConfig {
  id?: number;
  radius: number;        // cm from center
  shape: SpeedPathShape;
  speedBoost: number;    // multiplier
  spinBoost?: number;    // spin/s
  frictionMultiplier?: number;
  width?: number;        // cm, rectangles
  height?: number;       // cm
  ringThickness?: number; // cm
  chargePoints?: ChargePointConfig[];
  breaks?: SpeedPathBreak[];
  bumpProfile?: { positionFrac: number; heightCm: number }[];
  ridgeProfile?: { positionFrac: number; heightCm: number }[];
  renderStyle?: "outline" | "filled" | "dashed" | "dotted" | "animated" | "broken";
}
```

---

## AE-26 — Gear Rail {#ae-26}

**Element Type ID**: `gearRail`
**Category**: Terrain (BX / Gen4)
**Z-Axis**: floor level (flush with arena floor)
**Physics Class**: Per-frame

### Geometry
Polyline of waypoints in cm: `polylineCm: Array<{x, y}>`. Beys enter the rail when within a small tolerance of the polyline. Only beys with `gearCompatibleBit=true` can use the rail if `requiresGearCompatibleBit` is set.

### Physics Interaction with Beyblades
While on rail:
- Apply `speedBoostPermille / 1000` additional speed (e.g. 350 = +35%)
- Boost lasts `boostDurationMs` ms after leaving rail
- Can feed into `exitZoneIds` (scoring zones)

### Config Fields
```typescript
interface GearRailConfig {
  id: string;
  polylineCm: Array<{ x: number; y: number }>;
  speedBoostPermille: number;    // 0–1000 (e.g. 350 = 35%)
  requiresGearCompatibleBit?: boolean;
  boostDurationMs?: number;      // default 400
  exitZoneIds?: string[];
  color?: string;
}
```

---

## AE-27 — Tornado Ridge {#ae-27}

**Element Type ID**: `tornadoRidge`
**Category**: Terrain (MFB classic)
**Z-Axis**: floor level (slight raised ridge, purely physics)
**Physics Class**: Per-frame

### Geometry
A ring at `radiusCm` from the arena center, `widthCm` cm wide. Named after the MFB Tornado Stall / Tornado Ridge mechanic where beys spin along the inner ring for extra orbit force.

### Physics Interaction with Beyblades
While bey is within `widthCm / 2` of `radiusCm`:
- Tangential orbit force: `orbitIntensity` per tick in `direction` (cw/ccw)
- Spin boost: `spinBoostPercent`% of maxSpin per second

### Config Fields
```typescript
interface TornadoRidgeConfig {
  radiusCm: number;
  widthCm?: number;          // default 4 cm
  orbitIntensity?: number;   // per-tick tangential force (default 0.003)
  direction?: "cw" | "ccw"; // default "cw"
  spinBoostPercent?: number; // default 2%/s
}
```

---

## AE-28 — Trigger Zone {#ae-28}

**Element Type ID**: `triggerZone`
**Category**: Zone
**Z-Axis**: floor level (area trigger)
**Physics Class**: Per-frame (while bey is inside)

### Geometry
Area sensor at `x_cm, y_cm` using any `ObstacleShape`. Activation: `always-on | intervaled | switch-controlled`.

### Physics Interaction with Beyblades
Effect determined by `kind`:
- `safe`: bey is immune to arena hazards inside
- `damage { perSecond }`: deals `perSecond` HP damage per second
- `heal { perSecond }`: restores `perSecond` HP per second
- `knockout { soloHoldMs }`: if bey is the sole occupant for `soloHoldMs`, it wins the round
- `spin-boost { spinDirection, perSecond }`: adds spin in configured direction at `perSecond` rate
- `expel { impulseCm }`: applies outward impulse of `impulseCm` cm magnitude each tick
- `speed-scale { multiplier }`: multiplies bey velocity by `multiplier` while inside

### Config Fields
```typescript
interface TriggerZoneConfig {
  id: string;
  x_cm: number;
  y_cm: number;
  shape: ObstacleShape;
  kind: TriggerZoneKind;
  activation: TriggerZoneActivation;
  rotation?: RotationBlock;
  vfx?: { idleKey?: string; activeKey?: string };
  controlledBySwitchId?: string;
  selfRotation?: SelfRotationConfig;
}
```

---

## AE-29 — Floor Hazard Zone {#ae-29}

**Element Type ID**: `floorHazardZone`
**Category**: Hazard
**Z-Axis**: floor level
**Physics Class**: Per-frame (per-tick damage/effect dispatch)

### Geometry
Circular hazard on the floor at `x_cm, y_cm` with `radius_cm`. Optional `durationMs` (permanent when null). Can be `activeByDefault: false` (starts inactive, activated by switch).

### Physics Interaction with Beyblades
`processFloorHazardZones()` in ArenaFeatureProcessor.ts:

| hazardType | Per-Tick Effect | Status Applied |
|-----------|-----------------|----------------|
| lava | HP -= `damagePerTick × intensity`; spin decay × `spinDecayMult` | burning (5s) |
| fire | HP -= damagePerTick × intensity | burning (5s) |
| electric | controlLock for `disableTicks × (1000/60)` ms | paralyzed (4s) |
| ice | `applyWaterResistance(frictionMultiplier=0.05)` | frozen (3s) |
| mud | `applyWaterResistance(2.5 × intensity)` | — |
| time_slow | opposing force: `-velocity × 0.7 × intensity × dt` | — |
| repulsion | outward force from zone center: `0.05 × intensity` | — |
| drain | power -= `2 × intensity × dt × 60` | — |
| trampoline | upward force: `0.1 × intensity` (one-shot on contact) | — |
| combo_boost | power += `3 × intensity × dt × 60` (capped at 100) | — |
| void | `bey.isRingOut = true` (instant elimination) | confused (3s) |
| poison | HP -= damagePerTick × intensity; spin -= `15 × intensity × dt` | — |
| acid | HP -= damagePerTick × intensity | corroded (8s) |
| dark | — (no damage) | confused (3s) |
| size_shrink / size_grow | visual only, no stat change | — |

**Element immunity**: if bey's `elementTypes` contains an element immune to this zone's `hazardType` (per `HARDCODED_ZONE_IMMUNITIES`), the zone is skipped. If bey element **matches** zone element, intensity × 1.5.

### Config Fields
```typescript
interface FloorHazardZoneConfig {
  id: string;
  x_cm: number;
  y_cm: number;
  radius_cm: number;
  hazardType: FloorHazardType;
  intensity?: number;          // default 1.0
  damagePerTick?: number;      // lava default 5, poison/acid default 2
  spinDecayMult?: number;      // lava default 1.5
  frictionMultiplier?: number; // ice default 0.05
  disableTicks?: number;       // electric default 90
  durationMs?: number;
  controlledBySwitchId?: string;
  activeByDefault?: boolean;
  elementType?: ElementType;
  featureAnimation?: FeatureAnimationConfig;
  rotation?: number;
  selfRotation?: SelfRotationConfig;
}
```

### Engine Requirements
- Circle overlap detection per zone per bey per tick
- Element immunity table lookup
- Status effect application (burning, paralyzed, frozen, confused, corroded)
- Duration expiry timer (for non-permanent zones)

---

## AE-30 — Effect Zone {#ae-30}

**Element Type ID**: `effectZone`
**Category**: Zone
**Z-Axis**: floor level
**Physics Class**: Per-frame

### Geometry
Beneficial/neutral circular zone at `x_cm, y_cm` with `radius_cm`. Optional `durationMs`.

### Physics Interaction with Beyblades
Effect determined by `effectType`:
- `power_charge`: charges bey power bar at `intensity` rate/tick
- `spin_recovery`: restores spin at `intensity` rate/tick
- `combo_boost`: boosts combo input window by `intensity` factor
- `stat_aura`: applies `statAura` multipliers to specified stats while inside
- `safe_zone`: immune to all hazards while inside (like TriggerZone "safe" but zone-typed)
- `turbo_zone`: speed + spin double for duration while inside
- `respawn_point`: marks zone as the respawn position after ring-out (if configured)

### Config Fields
```typescript
interface EffectZoneConfig {
  id: string;
  x_cm: number;
  y_cm: number;
  radius_cm: number;
  effectType: EffectZoneType;
  intensity?: number;
  statAura?: StatDelta[];      // for "stat_aura": [{stat, multiplier}, ...]
  durationMs?: number;
  controlledBySwitchId?: string;
  activeByDefault?: boolean;
  elementType?: ElementType;
  featureAnimation?: FeatureAnimationConfig;
  rotation?: number;
  selfRotation?: SelfRotationConfig;
}
```

---

## AE-31 — Elevation Zone (Platform) {#ae-31}

**Element Type ID**: `elevationZone`
**Category**: Platform
**Z-Axis**: 0 → `heightCm` · raised platform surface
**Physics Class**: Per-frame

### Geometry
Raised circular platform at `x_cm, y_cm` with `radius_cm` and `heightCm` elevation above floor. Beys on the platform gain the altitude advantage in Z-layer rendering.

### Physics Interaction with Beyblades
While bey center is inside radius:
- Bey is considered "on platform" (Z-height = `heightCm`)
- Optional `spinBoostOnPlatform` spin/s bonus while elevated
- `edgeDropForce`: impulse applied when crossing platform edge (outward push at platform rim)
- Platform height affects collision with other features below the platform

### Config Fields
```typescript
interface ElevationZoneConfig {
  id: string;
  x_cm: number;
  y_cm: number;
  radius_cm: number;
  heightCm: number;              // cm above floor
  spinBoostOnPlatform?: number;  // spin/s bonus
  edgeDropForce?: number;        // impulse at rim
  spinBoostPercent?: number;     // % spin boost (e.g. 10 = +10%)
  controlledBySwitchId?: string;
  elementType?: ElementType;
  featureAnimation?: FeatureAnimationConfig;
  rotation?: number;
  selfRotation?: SelfRotationConfig;
}
```

### 2.5D Rendering
Platform drawn with a raised top surface and side faces. Z-offset applied to beys on top: `screenY_offset = -(heightCm × 24 × cos(tiltAngle_rad))`. Far-side platforms appear shorter due to tilt foreshortening.

---

## AE-32 — Directional Zone {#ae-32}

**Element Type ID**: `directionalZone`
**Category**: Force Zone
**Z-Axis**: floor level
**Physics Class**: Per-frame

### Geometry
Force-field zone that applies sustained directional or rotational forces. Types:
- `wind_corridor`: rectangular channel, constant directional push along `angleDeg`
- `tornado`: rotating inward spiral — tangent orbit + pull toward center
- `vortex`: pure inward spiral — very strong near center, ejects at rim
- `updraft`: reduces spin loss + cancels outward drift
- `downdraft`: pins beys, increases spin drain by `spinDrainMult`
- `slipstream`: drag-reducing lane — beys inside gain speed in stream direction
- `dust_devil`: small fast-spinning random wobble + erratic orbit

Circular zones use `radius_cm`. Rectangular zones (`wind_corridor`, `slipstream`) use `width_cm` × `length_cm`. Can `pulse` on/off.

### Physics Interaction with Beyblades
Per tick while bey inside zone:
- Wind corridor / slipstream: directional force at `force × angleDeg direction`
- Tornado / vortex: tangential orbit force at `rotationFactor × force` + inward `centerPullForce`
- Updraft: spin recovery bonus `spinRecoveryPerSec` + cancel outward velocity component
- Downdraft: extra spin drain at `spinDrainMult` × base rate
- Dust devil: random wobble impulse + orbit force

### Config Fields
```typescript
interface DirectionalZoneConfig {
  id: string;
  type: DirectionalZoneType;
  x_cm: number;
  y_cm: number;
  radius_cm: number;
  width_cm?: number;           // rectangular zones
  length_cm?: number;
  angleDeg?: number;
  force: number;
  rotationFactor?: number;
  centerPullForce?: number;
  spinDirection?: "cw" | "ccw";
  spinRecoveryPerSec?: number;
  spinDrainMult?: number;
  pulse?: { activeMs: number; pauseMs: number };
  controlledBySwitchId?: string;
  elementType?: ElementType;
  featureAnimation?: FeatureAnimationConfig;
  selfRotation?: SelfRotationConfig;
  behaviorId?: string;
  behaviorParams?: Record<string, unknown>;
}
```

---

## AE-33 — Boost Pad {#ae-33}

**Element Type ID**: `boostPad`
**Category**: Terrain
**Z-Axis**: floor level
**Physics Class**: Event-driven (on contact)

### Geometry
Rectangular directional pad at `x_cm, y_cm`, `width_cm × height_cm`. Fires a burst impulse along `angleDeg` when a beyblade drives over it.

### Physics Interaction with Beyblades
On contact:
- Apply impulse of `forceMagnitude` in direction `angleDeg`
- Per-bey cooldown `cooldownMs` ms before same pad triggers again for same bey

### Config Fields
```typescript
interface BoostPadConfig {
  id: string;
  x_cm: number;
  y_cm: number;
  width_cm: number;
  height_cm: number;
  angleDeg: number;         // 0=right, 90=down, 180=left, 270=up
  forceMagnitude: number;
  cooldownMs?: number;      // default 500
  controlledBySwitchId?: string;
}
```

---

## AE-34 — Scoring Zone {#ae-34}

**Element Type ID**: `scoringZone`
**Category**: Special (BX)
**Z-Axis**: floor level (exit zone)
**Physics Class**: Event-driven (on bey exit through zone)

### Geometry
Circular scoring region at `x_cm, y_cm`, `radius_cm`. Used in BX scoring mode where points accumulate per exit type rather than ring-out elimination.

### Physics Interaction with Beyblades
When a bey exits through this zone:
- Award `points` to that bey's score in `playerPoints`
- Kind determines default point value:
  - `xtreme`: high points (ring-out from xtreme line)
  - `over`: medium points (standard ring-out)
  - `pocket`: medium points (pocket exit)
  - `ring_out`: standard ring-out points

### Config Fields
```typescript
interface ScoringZoneConfig {
  id: string;
  kind: "xtreme" | "over" | "pocket" | "ring_out";
  x_cm: number;
  y_cm: number;
  radius_cm: number;
  points: number;
  color?: string;
}
```

---

## AE-35 — Zero-G Config {#ae-35}

**Element Type ID**: `zeroG`
**Category**: Special
**Z-Axis**: Entire arena tilts ±maxTiltDeg cyclically
**Physics Class**: Per-frame (drives tiltAngle oscillation)

### Physics
Periodically tilts the entire arena (like ZeroG Stadium series). Works by overriding `tiltAngle` with a sinusoidal value:
```
phase = 2π × matchElapsedMs / tiltPeriodMs
currentTilt = maxTiltDeg × sin(phase)
```
`minGravityScale` controls effective gravity at peak tilt (0 = weightless). If `rotatingAxis` is true, the tilt direction also rotates each period.

### Config Fields
```typescript
interface ZeroGConfig {
  tiltPeriodMs?: number;      // default 8000
  maxTiltDeg?: number;        // default 15
  minGravityScale?: number;   // default 0.2
  rotatingAxis?: boolean;     // default true
}
```

---

## AE-36 — Arena Shrink {#ae-36}

**Element Type ID**: `shrink`
**Category**: Special (Battle Royale)
**Z-Axis**: N/A (radial boundary shrinks over time)
**Physics Class**: Per-frame

### Physics
The arena's effective radius decreases over time from its initial size to `minRadiusFraction` × initial radius, between `startMs` and `endMs` elapsed match time. `effectiveRadius` is server-synced on `ServerGameState`.

Beys outside the effective boundary take `damageRatePerTick` HP damage per tick.

Alternative specification: `shrinkRateCmPerSec` + `minRadiusCm` (converted to startMs/endMs at runtime).

### Config Fields
```typescript
interface ArenaShrinkConfig {
  startMs: number;
  endMs: number;
  minRadiusFraction: number;   // 0–1 (e.g. 0.4 = 40% of original)
  damageRatePerTick?: number;  // default 2
  enabled?: boolean;
  shrinkRateCmPerSec?: number;
  minRadiusCm?: number;
}
```

---

## AE-37 — Arena Timeline Event {#ae-37}

**Element Type ID**: `arenaTimeline`
**Category**: Special
**Z-Axis**: N/A (scripted event system)
**Physics Class**: Event-driven (fires at `triggerMs` elapsed match time)

### Description
Scripted events that modify the arena mid-match. Types:
- `activate_feature` / `deactivate_feature`: toggle a feature by `featureId`
- `spawn_feature`: create a new feature at runtime
- `arena_tilt`: change `tiltAngle` / `tiltDirection`
- `gravity_change`: modify gravity scale
- `announcement`: display text overlay to clients

Can `repeat` at `intervalMs` for `count` additional fires.

### Config Fields
```typescript
interface ArenaTimelineEvent {
  triggerMs: number;
  type: ArenaTimelineEventType;
  featureId?: string;
  params?: Record<string, unknown>;
  announcement?: { text: string; style?: "warning" | "info" | "danger" };
  repeat?: { intervalMs: number; count: number };
}
```

---

## AE-38 — Bey Spawn System {#ae-38}

**Element Type ID**: `beySpawn`
**Category**: Special
**Z-Axis**: N/A (spawns beyblades as arena actors)
**Physics Class**: Dynamic (spawns entities at intervals)

### Description
Mid-match AI or neutral bey spawner. Spawns beyblades from a configured `beyPool` at `spawnIntervalSec` intervals, up to `maxSpawnedBeys` active. Beys despawn on knockout, timeout, or never. Optional `spawnOnCondition` (time elapsed, bey count below threshold, player spin below threshold).

### Config Fields
```typescript
interface ArenaBeySawnConfig {
  enabled: boolean;
  spawnIntervalSec: number;
  maxSpawnedBeys: number;
  despawnCondition: "knockout" | "timeout" | "never";
  despawnAfterTicks?: number;
  beyPool: {
    beyId: string;
    statsMultiplier?: number;
    aiDifficulty: "medium" | "hard" | "hell";
    controlMode: "ai" | "friendly";
    spawnPosition?: SpawnPositionSimple;
    maxFromThisEntry?: number;
  }[];
  spawnOnCondition?: { type: string; threshold: number };
}
```

---

## AE-39 — Multi-Floor Arena Link {#ae-39}

**Element Type ID**: `link` (ArenaLink) / `beyLink` (BeyLink)
**Category**: Special (multi-floor)
**Z-Axis**: Connects floor N to floor M (N ≠ M)
**Physics Class**: Event-driven (on bey entering link entry zone)

### Description
Links connect separate arena floors within an `ArenaFloorGroup` (up to 7 floors). Link types (from `BeyLink` category system in CLAUDE.md):
- **Pit** — bey falls from floor N pit into floor N-1 (gravity-assisted)
- **Trampoline** — bounces bey from floor N to floor N+1
- **Ramp** — sliding connection requiring rotational alignment
- **Corridor** — horizontal transition (requires alignment)
- **Portal** — instant teleport (no alignment needed)

`ArenaLinkAlignmentConfig`: mode `none | positional | owner-only`, `errorMarginDeg`, `correctionTicks`, `disconnectsWhenMisaligned`, `reconnectCooldownTicks`.

`ArenaLinkTraversalConfig`: `traversalTicks`, `perBeyReuseCooldownTicks`, `globalGapTicks`.

`ArenaLinkPitConfig.landingMode`: `fixed | random | current`.

`ArenaLinkTrampolineConfig`: `autoLaunchFromPit`, optional player cancel window.

### Engine Requirements
- Floor group registry mapping floor index → arena ID
- Per-bey traversal state machine (pre-traversal / in-transit / landed)
- Alignment check per tick when link has alignment requirement
- Physics body freeze during traversal animation

---

## AE-40 — Background Particles / Environmental Effect {#ae-40}

**Element Type ID**: `backgroundParticles` / `environmentalEffect`
**Category**: Visual
**Z-Axis**: Rendered on arena floor layer (no physics interaction)
**Physics Class**: Per-frame (visual only; environmentalEffect may have physics)

### Background Particles
Types: `snow | rain | embers | leaves | bubbles | sparks | pollen | ash | stars | glitch_pixels`. Configurable `density` (particles/s), `speed`, `direction` (degrees), `color`. `affectedByArenaRotation` default true.

### Environmental Effect Presets (physics)
- `storm`: oscillating lateral wind force + rain overlay (physics: periodic X-direction force)
- `blizzard`: fixed lateral force + snow overlay
- `volcanic`: upward ash + embers (visual only)
- `underwater`: subtle drag force, bubble particles (physics: `applyWaterResistance`)
- `cyber`: no physics, glitch_pixels overlay
- `earthquake`: periodic random impulse shakes all beys (physics: random impulse at `intervalMs`)

### Config Fields
```typescript
interface ArenaBackgroundParticles {
  type: BackgroundParticleType;
  density?: number;
  speed?: number;
  direction?: number;
  color?: string;
  affectedByArenaRotation?: boolean;
}

interface ArenaEnvironmentalEffect {
  preset: ArenaEnvironmentalEffectPreset;
  intensity?: number;    // 0–1
  intervalMs?: number;
}
```

---

## Arena Attacks & Interaction Matrix

The table below shows which arena elements produce which force/damage types against beyblades:

| Element | HP Damage | Spin Drain | Knockback | Control Lock | Status Effect | Force Field |
|---------|-----------|------------|-----------|--------------|---------------|-------------|
| AE-1 Wall | Yes | No | Yes (outward) | No | No | No |
| AE-5 Obstacle | Yes | No | Yes (normal) | No | No | No |
| AE-6 Magnetic | No | No | No | No | No | Radial attract/repel |
| AE-7 Electrified | No | No | No | Yes | paralyzed | No |
| AE-8 Spinner | No | No (gain) | No | No | No | No |
| AE-9 Sticky | No | No | No | Yes | No | No |
| AE-10 Crusher | Yes (×1.5) | No | No | No | No | No |
| AE-13 Wrecking Ball | Yes | No | Yes | No | No | No |
| AE-16 Gravity Hole | No | No | No | No | No | Radial attract |
| AE-17 Spin Zone | No | No (gain) | No | No | No | Tangential orbit |
| AE-18 Bump | No | No | Yes (vertical+lateral) | No | No | No |
| AE-19/20/21 Water | Yes (lava/poison) | Yes (ice/poison) | No | No | burning/frozen | Drag |
| AE-22 Pit | No | Yes | No | Yes (trapped) | No | No |
| AE-23 Turret | Yes | Yes (many) | Yes (many) | Yes (many) | many | many |
| AE-24 Portal | No | No | No | No | No | Teleport |
| AE-29 Floor Hazard | Yes (lava/fire/acid) | Yes (lava/poison/ice) | Yes (repulsion) | Yes (electric) | burning/frozen/paralyzed/confused/corroded | time_slow drag |
| AE-32 Directional Zone | No | Yes (downdraft) | No | No | No | Directional thrust |
| AE-35 Zero-G | No | No | No | No | No | Lateral gravity |
| AE-36 Shrink | Yes | No | No | No | No | No |

---

## Arena Config Reference

Full `ArenaConfig` interface with key groupings:

```typescript
interface ArenaConfig {
  // ── Identity ──────────────────────────────────────────────────────
  id?: string;
  name: string;
  description?: string;
  difficulty?: "easy" | "medium" | "hard" | "extreme" | "custom";

  // ── Geometry (all in px at ARENA_RESOLUTION=1080; ÷24 = cm) ──────
  width: number;
  height: number;
  shape: ArenaShape;
  arenaPixelRadius?: number;
  pinkWallRadius?: number;
  ridgeRadius?: number;
  flatZoneRadius?: number;

  // ── Bowl/Wall ─────────────────────────────────────────────────────
  bowlProfile?: BowlProfile;        // "flat"|"shallow"|"medium"|"deep"|"steep"
  wallAngle?: number;               // 0–75°
  bowlDepth?: number;               // visual 0–1

  // ── Visual / Theme ────────────────────────────────────────────────
  theme: ArenaTheme;
  backgroundColor?: string;
  floorColor?: string;
  floorTexture?: string;
  worldBackground?: ArenaWorldBackground;

  // ── Arena Rotation (XY turntable) ─────────────────────────────────
  autoRotate: boolean;
  rotationSpeed: number;            // °/s
  rotationDirection: "clockwise" | "counterclockwise";
  rotationPivotX?: number;          // cm
  rotationPivotY?: number;          // cm

  // ── Arena Tilt (Z-axis projection) ────────────────────────────────
  tiltAngle?: number;               // 0–360°
  tiltDirection?: number;           // 0–360°
  tiltMode?: "fixed" | "oscillate" | "weight";
  autoTilt?: boolean;
  tiltSpeed?: number;               // °/s
  tiltPivotX?: number;              // cm
  tiltPivotY?: number;              // cm
  tiltOscillateMin?: number;
  tiltOscillateMax?: number;
  tiltOscillatePeriodMs?: number;

  // ── Walls & Exits ─────────────────────────────────────────────────
  wall: WallConfig;

  // ── Features ──────────────────────────────────────────────────────
  speedPaths: SpeedPathConfig[];
  portals: PortalConfig[];
  waterBodies: WaterBodyConfig[];
  pits: PitConfig[];
  obstacles?: ObstacleConfig[];
  turrets?: TurretConfig[];
  switches?: SwitchConfig[];
  gravityHoles?: GravityHoleConfig[];
  triggerZones?: TriggerZoneConfig[];
  spinZones?: SpinZoneConfig[];
  bumps?: BumpConfig[];
  boostPads?: BoostPadConfig[];
  directionalZones?: DirectionalZoneConfig[];
  gearRails?: GearRailConfig[];
  scoringZones?: ScoringZoneConfig[];
  tornadoRidge?: TornadoRidgeConfig;
  zeroG?: ZeroGConfig;

  // ── BX Scoring ────────────────────────────────────────────────────
  staminaDrainMultiplier?: number;

  // ── Advanced ──────────────────────────────────────────────────────
  beySpawn?: ArenaBeySawnConfig;
  links?: ArenaLink[];
  beyLinks?: BeyLink[];
  backgroundParticles?: ArenaBackgroundParticles;
  environmentalEffect?: ArenaEnvironmentalEffect;
  defaultModifiers?: string[];
  allowedModifiers?: string[];
  randomModifiers?: boolean;
  maxModifiers?: number;
  qteEnabled?: boolean;
  arenaTimeline?: ArenaTimelineEvent[];
  shrink?: ArenaShrinkConfig;
  elevationZones?: ElevationZoneConfig[];
  floorHazardZones?: FloorHazardZoneConfig[];
  effectZones?: EffectZoneConfig[];
  floorGroupId?: string;
  floorIndex?: number;
  rendererMode?: "2d" | "2.5d" | "3d";
  maxFloors?: number;
  viewportCapCm?: number;
  playerAuthorityConfig?: PlayerAuthorityConfig;
  maxDurationSeconds?: number;
  modularSections?: ModularSectionConfig[];
  loopTracks?: LoopTrackConfig[];
}
```

---

## 2.5D Rendering Reference

### Z-Sorting Order (bottom to top within arenaTiltInner)

1. `arenaRotationRoot`
   - Arena floor texture / theme color
   - Water bodies (moat, zone, wall-based) — rendered at z=0
   - Floor hazard zones — color overlay at z=0
   - Effect zones — color overlay at z=0
   - Speed paths / gear rails — floor-level lines
   - Trigger zones — floor-level glows
   - Scoring zones — floor markers
2. Platforms (ElevationZone) — raised above floor by `heightCm`
3. Bumps — small raised disc icons
4. Pits — dark depression at z=0 (visual hole)
5. Spin zones — transparent rotating overlay
6. Directional zones — arrow overlays
7. Obstacles — solid shapes with side faces
8. Turrets — above floor, rotate toward target
9. Portals — bright animated disc
10. Switches — small floor pad icon
11. Gravity holes — warning ring (invisible when `visibility="always-hidden"`)
12. `beybladeLayer` — beyblades (sorted by y for correct depth order)
13. `detachedBodyLayer` — fragments, projectiles
14. `particleLayer` — particle effects
15. HUD (outside tilt chain, always screen-space)

### Static vs Dynamic Layer Classification

| Layer | Static (no per-frame update) | Dynamic (update per frame) |
|-------|-------------------------------|---------------------------|
| Arena floor | Yes | No (unless rotating) |
| Obstacles | Yes (unless selfRotation) | selfRotation on |
| Bumps | Yes (unless selfRotation) | selfRotation on |
| Gravity holes | No — pulse cycle | Always cycling |
| Spin zones | Sprite static | selfRotation on |
| Turrets | No — aims each frame | Always |
| Portals | No — animated | Always |
| Water bodies | Wavy = animated | wavyEffect on |
| Beyblades | No | Always |
| Projectiles | No | Always |

### Self-Rotation Config Lifecycle

| type | Behavior |
|------|----------|
| `permanent` | Spins continuously for entire match |
| `temporary` | Spins for `temporaryDurationMs` ms then stops |
| `once` | Single rotation at match start (+ optional `onceFiredAtStartMs` delay) |
| `pulsed` | On for `pulsedActiveMs`, off for `pulsedPauseMs`, repeat |
| `oscillate` | Sweeps from `oscillateFromDeg` to `oscillateToDeg` and returns (pendulum) |

`space: "local"` (default): rotates with arena rotation. `space: "world"`: fixed in world space.

---

## Obstacle Physics Type Summary

| type | Effect on Contact | Key Fields |
|------|------------------|------------|
| `wall` | Knockback + damage | `heightCm`, `direction` |
| `bump` | Pop upward + recoil | `heightCm` |
| `ramp` | Directional slide | `rampAngleDeg` |
| `ledge` | One-way pass-through | `direction`, `oneWayAngleDeg` |
| `ridge` | Orbit boost (Tornado) | `heightCm` |
| `grip` | High friction surface | `gripFriction > 1` |
| `speedline` | Tangential acceleration | `speedlineBoostCmPerS` |
| `magnetic` | Attract/repel field | `magnetRadiusCm`, `magnetStrength` |
| `trampoline` | Upward bounce | `trampolineBoost` |
| `spinner` | Spin boost on contact | `spinRpmImpulse` |
| `crusher` | Extra 1.5× damage (kinematic) | `crushAxis`, `crushTravelCm` |
| `electrified` | Control lock | `disableTicks` |
| `sticky` | Velocity freeze + control lock | `stickyDurationTicks` |
| `bouncy_net` | High restitution bounce | `netRestitution` |

---

## AE-41 — Debris / Spawn-on-Destroy {#ae-41}

**Element Type ID**: extension on any destructible element (`obstacle`, `turret`, `switch`) via `onDestroy` config block

**What it is:** When a destructible element reaches 0 HP and `isDestroyed = true`, it spawns one or more secondary arena elements at (or near) its position before its body is removed. The spawned elements are fully real — they enter the physics world, appear in the renderer, and interact with beyblades exactly as if they had been placed in the arena at design time.

**Use cases:**
- Bowling pin hit → spawns a bump at pin location (the "fallen pin" redirects beys)
- Rock obstacle shattered → spawns 3–5 small fragment bumps scattered around the impact point
- Crate destroyed → spawns a spin zone (hidden power-up revealed on breaking the crate)
- Turret destroyed → spawns a small debris pit that deals minor friction damage
- Ice pillar shattered → spawns a liquid patch (ice fragment slick)

### Config Schema

```typescript
interface OnDestroySpawn {
  // Where to spawn: "at_origin" places at the destroyed element's x,y
  // "scatter" places N elements with random offset within scatterRadius_cm
  // "explode" places elements along outward radii from origin (like an explosion pattern)
  placement: "at_origin" | "scatter" | "explode";
  scatterRadius_cm?: number;   // radius of random scatter (placement: "scatter")
  explodeCount?: number;       // number of radial arms (placement: "explode")
  explodeRadius_cm?: number;   // distance from origin along each arm

  // Elements to spawn — any valid arena element config fragment
  // The spawned element inherits x,y from placement; all other fields from this config
  elements: SpawnedElementDef[];

  // Optional: delay before spawned elements become active
  spawnDelayMs?: number;       // default 0 (immediate)

  // Optional: spawned elements expire after this duration (ms). 0 = permanent
  spawnLifetimeMs?: number;    // e.g. 5000 = debris lasts 5 seconds then removes itself
}

interface SpawnedElementDef {
  type: "bump" | "obstacle" | "spinZone" | "gravityHole" | "liquid" | "triggerZone" | "rail";
  config: Partial<ArenaElementConfig>;  // merged over defaults for the element type
  // For "scatter" placement: individual offset override per element (optional)
  offsetX_cm?: number;
  offsetY_cm?: number;
}

// Added to any destructible element config:
interface DestructibleConfig {
  health: number;
  indestructible?: boolean;
  onDestroy?: OnDestroySpawn;   // ← NEW: debris / spawn-on-destroy
}
```

### Physics — Spawn Sequence

1. Element HP reaches 0 → `isDestroyed = true`
2. `ArenaFeatureProcessor` calls `handleDestruction(element)`:
   a. If `onDestroy.spawnDelayMs > 0`: queue spawn at `tick + delay`
   b. Else: execute immediately
3. For each entry in `onDestroy.elements`:
   a. Compute spawn position from `placement` + parent element x,y
   b. Add element to live arena state: `arenaState.dynamicElements.push(spawnedElement)`
   c. Register Matter.js body (if physics-interactive)
   d. Set `spawnedElement.expiresAt = tick + (spawnLifetimeMs / tickMs)` if lifetime > 0
4. Remove parent element from physics world
5. Broadcast state change at next sync tick

**Scatter placement formula:**
```
spawnX = parent.x + rand(-scatterRadius_cm, +scatterRadius_cm)
spawnY = parent.y + rand(-scatterRadius_cm, +scatterRadius_cm)
```
Uses the match PRNG (seeded, deterministic) — `rand()` from `createPRNG(matchId)`.

**Explode placement formula:**
```
for i in 0..explodeCount:
  angle = (2π / explodeCount) × i
  spawnX = parent.x + cos(angle) × explodeRadius_cm
  spawnY = parent.y + sin(angle) × explodeRadius_cm
```

### Example — Bowling Pin → Fallen Pin Bump

```typescript
// Each pin is an obstacle with onDestroy → bump
const bowlingPin: ObstacleConfig = {
  id: "pin_01",
  x_cm: 50, y_cm: 20,
  shape: { kind: "circle", radius_cm: 1.5 },
  z_top_cm: 4.0,
  heightProfile: "cone",
  physics: {
    type: "obstacle",
    health: 1,
    indestructible: false,
    onDestroy: {
      placement: "at_origin",
      spawnLifetimeMs: 8000,       // fallen pin stays for 8 seconds then clears
      elements: [
        {
          type: "bump",
          config: {
            radius_cm: 2.0,
            z_top_cm: 0.6,         // low flat bump (the "fallen" pin lying on the floor)
            heightProfile: "flat", // flat because it's lying down, not standing
            popStrength_N: 3.0,    // modest pop — fallen pin redirects but doesn't launch
            lateralRecoil_N: 5.0,
          },
        },
      ],
    },
  },
};
```

### Example — Fragile Rock → Scatter Fragments

```typescript
const fragileRock: ObstacleConfig = {
  id: "rock_01",
  x_cm: 0, y_cm: 30,
  shape: { kind: "circle", radius_cm: 4.0 },
  z_top_cm: 5.0,
  heightProfile: "dome",
  physics: {
    type: "obstacle",
    health: 3,
    onDestroy: {
      placement: "scatter",
      scatterRadius_cm: 6.0,
      spawnLifetimeMs: 6000,
      elements: [
        { type: "bump", config: { radius_cm: 1.2, z_top_cm: 0.5, popStrength_N: 2.0, lateralRecoil_N: 3.0 } },
        { type: "bump", config: { radius_cm: 1.0, z_top_cm: 0.4, popStrength_N: 1.5, lateralRecoil_N: 2.5 } },
        { type: "bump", config: { radius_cm: 0.8, z_top_cm: 0.3, popStrength_N: 1.0, lateralRecoil_N: 2.0 } },
      ],
    },
  },
};
```

### 2.5D Rendering — Debris

**Spawn animation:** When an element is spawned via `onDestroy`, play a brief "materialise" animation:
- `bump`: rises from z=0 over 150ms (scale from 0 → 1)
- `liquid patch`: fades in opacity 0 → 1 over 200ms
- `fragment bumps` (scatter): each fragment flies outward from parent origin then settles — animate position from `parent.x,y` to `spawn.x,y` over 250ms

**Expiry animation:** When `spawnLifetimeMs` elapses:
- Fade out opacity 1 → 0 over 300ms, then remove from renderer

**Destruction flash:** The parent obstacle's destruction should always fire a particle burst at its position before removal (existing `eventFlashLayer` mechanism).

**Memory class:** DYNAMIC — spawned elements are created/destroyed at runtime. They live in `dynamicFeatureContainer`, not the static atlas.

### Engine Note

- `dynamicElements[]` is a runtime array on `ArenaState` (Colyseus-synced). Elements are added/removed during match.
- Matter.js bodies for dynamic elements created/removed mid-match — use `World.add` / `World.remove`.
- PRNG must be used for scatter positions (not `Math.random()`) to keep server-authoritative state deterministic across clients.
- `spawnLifetimeMs` expiry is tick-counted, not wall-clock — prevents drift.
- Spawned elements can themselves be destructible (chain destruction is legal but should have a depth limit, e.g. `maxDestructionDepth: 2` to prevent infinite chains).

---

## AE-42 — Breakable Floor Tile {#ae-42}

**Element Type ID**: `breakableFloor`

**What it is:** A floor tile or floor zone patch that has multiple health states. Beyblades rolling over or landing on it deal damage; when the tile's HP drops between thresholds, it visually and physically changes state. A fully broken tile can become a pit, a rough surface, or a hazard zone.

**States (configurable, admin-defined, minimum 2):**

| State | Default name | Behaviour |
|-------|-------------|-----------|
| 0 | `intact` | Normal floor; μ from `intactMu` |
| 1 | `cracked` | Visual crack overlay; μ × `crackedMuMult` (default 0.8 — slightly rougher) |
| 2 | `broken` | Large hole visual; spawns a floor hazard zone (pit, lava, ice) at this position |
| 3+ | (optional extra) | Admin can define N states beyond 2 |

### Config Schema

```typescript
interface BreakableFloorConfig {
  id: string;
  x_cm: number;
  y_cm: number;
  shape: "circle" | "rectangle" | "hex";
  radius_cm?: number;       // for circle/hex
  width_cm?: number;        // for rectangle
  height_cm?: number;       // for rectangle

  // Health thresholds — length N defines N+1 states (state 0 = full health)
  // thresholds[0] = HP at which tile enters state 1 (cracked)
  // thresholds[1] = HP at which tile enters state 2 (broken)
  maxHp: number;
  thresholds: number[];     // e.g. [60, 20] for cracked at 60HP, broken at 20HP

  // Per-state definitions
  states: FloorTileState[];

  // How much HP each bey contact removes per tick (while bey is over the tile)
  damagePerContactTick: number;   // default 1

  // Optional: tile regenerates HP over time (e.g. self-repairing arena)
  regenPerTick?: number;          // HP restored per tick; 0 = no regen
  regenOnlyWhenUnoccupied?: boolean; // only regen when no bey is on tile
}

interface FloorTileState {
  stateIndex: number;
  label: string;            // "intact" | "cracked" | "broken" | custom
  mu_k?: number;            // friction override for this state (null = use parent arena zone mu)
  muMult?: number;          // multiply parent zone mu (alternative to absolute override)
  heightProfile?: string;   // visual change: "flat" → "pit" on broken state
  spawnOnEnter?: OnDestroySpawn;  // spawn elements when tile enters this state
  eliminationZone?: boolean;      // if true, beys on this tile while in this state are eliminated
  spinDecayMult?: number;   // extra spin decay while bey is on this tile in this state
  visualStyle?: string;     // "crack_overlay" | "lava_fill" | "ice_fill" | "void_fill" etc.
}
```

### State Transition Physics

```
Per tick (while any bey is positioned over tile):
  tile.hp -= damagePerContactTick × (number_of_beys_on_tile)

State check:
  if tile.hp <= thresholds[1] AND tile.state < 2: tile.state = 2  (broken)
  elif tile.hp <= thresholds[0] AND tile.state < 1: tile.state = 1  (cracked)

On state change:
  1. Apply new state's mu_k / muMult to per-zone friction lookup
  2. Fire spawnOnEnter (e.g. spawn pit at broken state)
  3. Broadcast new state to clients (Colyseus state sync)
  4. Trigger visual transition animation
```

**Bey damage to tile:** The tile loses HP when any bey is physically located over it (position inside tile shape). Heavier/faster beys are not currently weighted differently unless a `damageMult` based on bey.mass is configured. Admin can set `damagePerContactTick` high (instant one-hit break) or low (gradual wear over a full match).

**Elimination zone:** When `states[2].eliminationZone = true`, a bey that falls through the fully broken tile is eliminated — ring-out equivalent. This models a floor that actually collapses.

**Regeneration:** If `regenPerTick > 0`, the tile slowly recovers HP (and potentially steps back down through states) while no bey is on it. Enables arenas where broken floor patches repair between encounters.

### Example — Breakable Floor Panel (Standard)

```typescript
const floorPanel: BreakableFloorConfig = {
  id: "floor_panel_center",
  x_cm: 0, y_cm: 0,
  shape: "circle",
  radius_cm: 8.0,
  maxHp: 100,
  thresholds: [60, 20],
  damagePerContactTick: 2,

  states: [
    {
      stateIndex: 0,
      label: "intact",
      mu_k: 0.20,               // smooth floor
      visualStyle: "intact",
    },
    {
      stateIndex: 1,
      label: "cracked",
      muMult: 0.85,             // 15% rougher than intact
      visualStyle: "crack_overlay",
      spinDecayMult: 1.15,      // slight wobble from uneven surface
    },
    {
      stateIndex: 2,
      label: "broken",
      heightProfile: "pit",
      eliminationZone: true,    // bey falls through
      visualStyle: "void_fill",
      spawnOnEnter: {
        placement: "at_origin",
        spawnLifetimeMs: 0,     // permanent until match ends
        elements: [
          {
            type: "gravityHole",
            config: {
              radius_cm: 8.0,
              pullStrength: 0.05,
              eliminationRadius: 2.0,
            },
          },
        ],
      },
    },
  ],
};
```

### Example — Arena Segment Tile (non-elimination)

```typescript
// A tile that just gets rougher and then spawns a lava patch — no elimination
const lavaTile: BreakableFloorConfig = {
  id: "lava_tile_01",
  x_cm: -30, y_cm: 0,
  shape: "hex",
  radius_cm: 5.0,
  maxHp: 60,
  thresholds: [40, 10],
  damagePerContactTick: 1,
  regenPerTick: 0.2,
  regenOnlyWhenUnoccupied: true,

  states: [
    { stateIndex: 0, label: "intact", mu_k: 0.20, visualStyle: "intact" },
    { stateIndex: 1, label: "cracked", muMult: 0.75, visualStyle: "crack_overlay" },
    {
      stateIndex: 2,
      label: "erupted",
      visualStyle: "lava_fill",
      spinDecayMult: 1.8,
      spawnOnEnter: {
        placement: "at_origin",
        spawnLifetimeMs: 0,
        elements: [
          {
            type: "liquid",
            config: {
              liquidTypeId: "lava",
              shape_cm: { type: "hex", radius_cm: 5.0 },
              spinDecayAccel: 15,   // lava damages spin rapidly
            },
          },
        ],
      },
    },
  ],
};
```

### 2.5D Rendering — Floor State Transitions

**State 0 (intact):** Normal floor texture — baked into static atlas at arena load.

**State 1 (cracked):** Overlay a crack texture on top of the intact tile. The crack overlay is a separate `PIXI.Sprite` added to `dynamicFeatureContainer` (not the baked atlas). Animate in: fracture lines spread from center outward over 300ms using a sprite sheet or mask reveal animation.

**State 2 (broken / pit):** The intact tile sprite is hidden; replace with a dark pit interior. Apply `zToScreenOffset(-1.0)` to the pit interior center (it visually recedes). Near-side pit edge appears at full depth; far-side compressed by `cos(tiltAngle)`. Add a crumbling particle burst at the moment of state change (broken chunks fly outward using the scatter animation from AE-41).

**Regeneration visual:** When tile is regenerating (no bey on it), slowly fade the crack overlay from opaque to transparent over the regen duration. State 2 → 1 transition: pit interior fades out, intact floor fades in.

**Memory class:** STATIC tile base (baked) + DYNAMIC state overlays (crack, lava, pit — per-state sprites added/removed from `dynamicFeatureContainer` on state change event). Not per-frame — event-driven update only.

### Engine Note

1. **Tile position lookup** — per tick, check each bey's (x,y) against all `breakableFloor` tile shapes. For circles: `sqrt((bey.x - tile.x)² + (bey.y - tile.y)²) < tile.radius_cm`.
2. **State is Colyseus-synced** — `tile.state` and `tile.hp` are schema fields. Clients receive state changes at 60Hz sync; renderer updates overlay sprites on state change callback, not per-frame.
3. **SpawnOnEnter executes once** — when tile first crosses into a new state, `spawnOnEnter` fires exactly once (use `lastState` tracker to detect the transition, not a threshold comparison every tick).
4. **Regen guard** — regeneration only ticks when `occupantCount === 0`. Count occupants per tick using the same tile-position lookup.
5. **Destruction chain cap** — if the spawned element from `spawnOnEnter` is itself destructible, set `maxDestructionDepth` (default 2) on the spawn chain to prevent infinite recursion.
6. **Multiple tiles** — arena can have N tiles simultaneously. Each has independent state. Colyseus schema: `breakableFloorTiles: MapSchema<BreakableFloorState>` keyed by tile id.

---

## AE-43 — Angled Trampoline {#ae-43}

**Element Type ID**: `trampoline`

**What it is:** A raised surface that applies a directed bounce impulse to any beyblade that contacts it. Unlike a bump (AE-3) which fires a radially-outward pop, a trampoline has an explicit `faceAngle_deg` — the direction it "faces" — and always launches beys in that direction regardless of approach angle. Multiple trampolines at different angles chain-launch beys through the arena in predictable patterns.

**Difference from bump (AE-3):**
| | Bump | Trampoline |
|--|------|------------|
| Impulse direction | Radially away from bump center | Fixed `faceAngle_deg` always |
| Lateral control | Approach angle affects trajectory | Approach angle ignored — always fires `faceAngle_deg` |
| Shape | Dome (all sides equal) | Elongated / angled (like a pinball flipper or ramp) |
| Pattern use | Random scatter | Choreographed bounce paths |

### Config Schema

```typescript
interface TrampolineConfig {
  id: string;
  x_cm: number;
  y_cm: number;

  // Physical shape — elongated rectangle or angled ramp
  length_cm: number;          // long axis of the trampoline surface (e.g. 8 cm)
  width_cm: number;           // short axis / thickness (e.g. 2 cm)
  faceAngle_deg: number;      // 0–359°: direction the trampoline launches beys
                              // 0° = rightward launch, 90° = downward, 180° = leftward, 270° = upward
                              // (standard math convention in world space)
  z_top_cm: number;           // height of trampoline surface above floor (default 0.5 cm)

  // Bounce physics
  launchStrength_N: number;   // impulse applied in faceAngle_deg direction on contact
  tiltBoost_deg?: number;     // optional: increment beyTiltAngle on bounce (simulates "aerial" effect)
  spinBoostFraction?: number; // optional: add this fraction of maxSpin on bounce (energy transfer)

  // Activation
  controlledBySwitchId?: string;  // only active when switch is on
  cooldownMs?: number;            // recharge time between bounces (default 200ms — prevents re-fire on slow slide)

  // Visual
  heightProfile: "flat" | "ridge" | "ramp";  // "ramp" shows the angled face in 2.5D
  materialId?: string;         // surface material (rubber = higher launchStrength multiplier)
}
```

### Physics — Directed Bounce

```
On bey contact with trampoline:
  // Ignore incoming velocity direction — always fire in faceAngle_deg
  launchVx = cos(faceAngle_deg × π/180) × launchStrength_N / bey.mass
  launchVy = sin(faceAngle_deg × π/180) × launchStrength_N / bey.mass

  // Override bey velocity with launch velocity (plus any existing velocity component
  // parallel to the face for slide-through vs full redirect)
  if (hardRedirect):
    bey.velocity = { x: launchVx, y: launchVy }       // full override
  else:
    bey.velocity += { x: launchVx, y: launchVy }      // additive

  // Optional tilt effect
  if tiltBoost_deg: beyTiltAngle += tiltBoost_deg

  // Optional spin boost
  if spinBoostFraction: bey.spin = min(bey.maxSpin, bey.spin + spinBoostFraction × bey.maxSpin)

  // Cooldown
  trampoline.lastFiredAt = currentTick
```

**`hardRedirect` vs additive:** `hardRedirect = true` (default) completely overrides the bey's velocity in the launch direction — the bey cannot "fight" the trampoline and will always fly in `faceAngle_deg`. This is what creates predictable chain patterns. Additive mode lets the bey's existing momentum blend with the launch (feels more physical but less predictable for puzzle-style arenas).

### Chained Trampoline Patterns

Because each trampoline launches in a fixed direction, chains create deterministic bey paths:

```
Example: "Pinball Corridor"
  Trampoline A (faceAngle=0°)  →  Trampoline B (faceAngle=270°)
                                          ↓
  Trampoline D (faceAngle=90°) ←  Trampoline C (faceAngle=180°)
```
A bey entering the corridor bounces in a square loop until spin decays enough to break out of the pattern. Attacker types launch out on a tangent; stamina types orbit the pattern for longer.

```
Example: "Launch Ramp into Wall"
  Two trampolines at 45° and 135° near the arena center →
  both always launch beys toward the wall at full speed
  → wall restitution (ε=0.72) bounces them back
  → beys re-enter the arena at high velocity
```

```
Example: "Zigzag Alley"
  5 trampolines alternating faceAngle 30° and 150°
  bey zigzags down the alley, gaining launchStrength_N each bounce
  → exits at high speed aimed at opponent
```

### 2.5D Rendering

**Shape:** An elongated rectangle oriented along `faceAngle_deg`. In 2.5D perspective:
- The long axis appears at full length on the near side, compressed by `cos(tiltAngle)` on the far side
- `z_top_cm` raises the surface above the floor: `zToScreenOffset(z_top_cm)` applied to the trampoline container

**`heightProfile: "ramp"`:** The trampoline has a sloped face pointing in `faceAngle_deg`. In 2.5D:
- The face of the ramp (the angled surface that launches beys) appears as a trapezoid — wider at the base (floor-level), narrowing toward the top (the launch point)
- The ramp slopes "away" from the camera in the `faceAngle_deg` direction
- Highlight the launch face with a lighter shade; shadow the back face

**`heightProfile: "ridge"`:** Symmetric narrow ridge — both faces the same height. Visually like a speed rail but with the bounce mechanic.

**Bounce animation:** On contact, briefly scale the trampoline sprite to 90% then restore to 100% over 80ms ("squash") — classic trampoline deformation. The bey sprite simultaneously receives a launch-direction velocity vector for the animation.

**Cooldown state:** While `cooldownMs` timer is active, the trampoline surface tints slightly darker (indicating it has not recharged). Visual transition back to full brightness on recharge.

**Switch-controlled trampolines:** If `controlledBySwitchId` is set and switch is OFF, the trampoline is hidden (`alpha=0`, Matter.js body removed). On switch ON: fade in over 150ms and add body. The bey that triggered the switch can immediately bounce on the trampoline if they arrive before the cooldown.

**Memory class:** STATIC (baked into atlas if no switch control and no cooldown animation). DYNAMIC: if `controlledBySwitchId` or if the squash animation runs (event-driven on bounce — not per-frame).

### Engine Requirements

1. **Contact detection** — trampoline is a thin rectangle; use Matter.js rectangle body with `isSensor: false` (solid collision). The `faceAngle_deg` orients the rectangle in world space.
2. **Velocity override** — after Matter.js resolves the normal collision, override bey velocity with the launch vector. This must run in the post-collision phase (after impulse application), not during it, to avoid fighting the physics solver.
3. **Cooldown** — track `lastFiredAt` tick per trampoline. If `currentTick - lastFiredAt < cooldownTicks`, skip the velocity override (bey slides over without bouncing). This prevents a stationary bey from continuously re-triggering.
4. **Multiple beys** — apply velocity override independently to each bey that contacts the trampoline in the same tick.
5. **`tiltBoost_deg`** — increment `bey.beyTiltAngle` on bounce. At high tilt angles, the bey wobbles after landing — creates visual "aerial" feel even though there's no true z-axis flight.
6. **Chained trampolines** — no special engine code needed; each trampoline fires independently. The launched velocity from trampoline A naturally carries the bey to trampoline B. Chain reliability depends on `launchStrength_N` being tuned so the bey travels far enough to hit the next trampoline.

---

## AE-44 — Flipper {#ae-44}

**Element Type ID**: `flipper`

**What it is:** A rotating arm anchored at one end (pivot) that rests at a downward angle when inactive and snaps upward when activated. The most iconic pinball element. In a beyblade arena, flippers redirect beys by rotating at high angular velocity — a bey that contacts the flipper face while it fires receives a strong directional impulse.

**Activation modes:**
| Mode | How it triggers |
|------|----------------|
| `player` | Left flipper = designated key (e.g. Z); Right flipper = designated key (e.g. /). Both players share the same arena flippers. |
| `proximity` | Flipper auto-fires when any bey enters its trigger zone (r=`autoTriggerRadius_cm`). |
| `pressure_plate` | Flipper fires when a bey rolls over a floor trigger at the flipper base. Ties to the AE-12 switch system. |
| `timed` | Flipper fires on a fixed interval (`intervalMs`) — purely scripted rhythm. |

### Config Schema

```typescript
interface FlipperConfig {
  id: string;
  pivotX_cm: number;         // anchor point (the end that doesn't move)
  pivotY_cm: number;
  length_cm: number;         // arm length (e.g. 8 cm for a standard flipper)
  width_cm: number;          // arm thickness (e.g. 1.5 cm)
  restAngle_deg: number;     // angle when inactive (e.g. -30° = tilted downward)
  firedAngle_deg: number;    // angle when activated (e.g. +30° = tilted upward)
  fireSpeedDegPerMs: number; // how fast it snaps to firedAngle (e.g. 4 = 4°/ms = 24° in 6ms)
  returnSpeedDegPerMs: number; // how fast it returns to restAngle (e.g. 1 = slow return)
  holdMs?: number;           // how long it stays at firedAngle before returning (0 = instant return)

  activationMode: "player" | "proximity" | "pressure_plate" | "timed";
  playerKey?: "left" | "right";          // for "player" mode: which flipper key
  autoTriggerRadius_cm?: number;         // for "proximity" mode
  linkedSwitchId?: string;               // for "pressure_plate" mode: switch that fires it
  intervalMs?: number;                   // for "timed" mode

  z_top_cm: number;          // height of flipper arm above floor (default 0.8 cm)
  materialId?: string;       // surface material — rubber = more launch energy

  controlledBySwitchId?: string;  // if set, flipper only works when switch is on
}
```

### Physics — Flipper Impulse Calculation

The flipper arm rotates from `restAngle_deg` to `firedAngle_deg` at `fireSpeedDegPerMs` angular velocity. Any bey that is in contact with the arm during this rotation receives a tangential velocity impulse:

```
// Angular velocity of flipper arm at moment of contact:
ω_flipper = fireSpeedDegPerMs × (π/180) × 1000   // rad/s

// Distance from pivot to contact point along arm:
r_contact = distance(bey.x - pivotX_cm, bey.y - pivotY_cm)

// Tangential velocity at contact point:
v_tangential = ω_flipper × r_contact   // cm/s

// Direction: perpendicular to the arm at the contact point, in the rotation direction
// Apply as impulse to bey:
impulse_direction = perpendicular(normalize(contact_point - pivot), rotation_sign)
bey.velocity += impulse_direction × v_tangential
```

**Key property:** A bey near the tip of a long flipper gets much more velocity than one near the pivot — same as a real pinball flipper. The tip of an 8cm arm at 4°/ms rotation speed:
```
ω = 4 × π/180 × 1000 = 69.8 rad/s
v_tip = 69.8 × 8 = 558 cm/s = 5.58 m/s
```
This is a near-ring-out impulse — a well-timed flipper hit sends the opponent bey flying.

**Timing window:** The impulse only applies while the arm is in motion (between `restAngle` and `firedAngle`). A bey resting on a stationary flipper is just on a flat surface. The player must time the activation to maximize contact during the fast snap.

**Bey weight matters:** `impulse_magnitude = v_tangential / bey.mass`. A heavy 54g Cho-Z assembly gets less launch speed than a light 25g Burst bey. Skilled players account for this.

### 2.5D Rendering

The flipper arm is a rotated rectangle. Its visual state:
- **Rest position:** arm drawn at `restAngle_deg` from pivot. In 2.5D, the arm's near end appears full height (`z_top_cm × PX_PER_CM`), far end compressed.
- **Firing animation:** arm rotates from `restAngle` to `firedAngle` over `fireSpeedDegPerMs` duration — update `flipperContainer.rotation` each frame during the animation. This is a smooth per-frame update, not a state snap.
- **Return animation:** arm rotates back at `returnSpeedDegPerMs` (typically slower than fire — visual weight of the arm returning).
- **Contact flash:** brief highlight on the arm face when a bey is launched.
- **Player-controlled feedback:** when player holds the flipper key, the arm stays at `firedAngle`. Visual: arm slightly glows at the top (indicating it is actively held up). Release → slow return.

**Memory class:** DYNAMIC — flipper rotation updates per frame during fire/return animation. Baked into static atlas when at rest (event-driven activation takes it off the baked layer).

### Left/Right Flipper Convention (for player mode)

In a standard pinball-style arena:
- Left flipper pivot at ~(−30cm, −15cm), arm pointing rightward at rest, snaps upward-right when fired
- Right flipper pivot at ~(+30cm, −15cm), arm pointing leftward at rest, snaps upward-left when fired
- Both controlled by separate keys; both players share the same flippers in multiplayer (either player can fire either flipper)

Admin can place any number of flippers at any position and angle — there is no enforced left/right convention in the engine.

### Engine Requirements

1. **Rotating Matter.js body** — flipper arm is a `Matter.js` rectangle body with `isStatic: true` but position updated per tick via `Body.setAngle()` during fire/return. Static bodies can be repositioned in Matter.js without violating physics — they push other bodies out of the way on contact.
2. **Post-contact velocity override** — same pattern as AE-43 (trampoline): after Matter.js resolves the collision, apply the tangential impulse override.
3. **`player` mode input binding** — `GameInput` must expose flipper keys. Both clients' input for flippers is sent to the server (one client presses left flipper → server fires that flipper for everyone). The flipper state is part of `ArenaState` (Colyseus-synced): `flipperFired: { left: boolean; right: boolean }`.
4. **`proximity` mode** — per tick: for each bey, check distance to `(pivotX, pivotY)`. If within `autoTriggerRadius_cm` and flipper is at rest, activate.
5. **Cooldown** — enforce minimum gap between activations (default 500ms) to prevent infinite bounce loops.

---

## AE-45 — Slingshot / Kicker {#ae-45}

**Element Type ID**: `slingshot`

**What it is:** A triangular rubberised wall kicker — typically placed at the upper corners of a pinball table. When a bey contacts the angled face, it fires back with extra velocity in the reflected direction plus a kick bonus. Unlike the trampoline (AE-43) which always fires in `faceAngle_deg`, the slingshot reflects the bey's incoming trajectory (like a wall) but adds a velocity boost. Think of it as a high-restitution angled wall that always gives the bey extra speed on exit.

**Difference from AE-3 (Bump) and AE-43 (Trampoline):**
| | Bump | Trampoline | Slingshot |
|--|------|------------|-----------|
| Impulse direction | Radially away | Fixed `faceAngle` always | Reflected incoming + boost |
| Shape | Dome | Elongated rectangle | Triangular / angled wall |
| Restitution | Low pop | Hard override | High restitution (>1.0 = adds energy) |
| Pinball equivalent | Pop bumper base | Ramp / angled surface | Slingshot / kicker |

### Config Schema

```typescript
interface SlingshotConfig {
  id: string;
  x_cm: number;
  y_cm: number;

  // Triangle geometry — one face is the "kick face", two sides are passive walls
  faceAngle_deg: number;     // direction the kick face points (inward toward arena center)
  faceLength_cm: number;     // length of the kick face (e.g. 6 cm)
  depth_cm: number;          // depth of the triangle from face to apex (e.g. 3 cm)
  z_top_cm: number;          // height (default 1.0 cm)

  // Kick physics
  restitution: number;       // >1.0 adds energy; 1.3 = 30% speed boost on exit
  kickBonus_N?: number;      // additional impulse applied in face-normal direction
  spinTransfer?: number;     // fraction of bey spin transferred to opponent as extra velocity (0–1)

  materialId?: string;       // "rubber" for classic pinball feel

  // Activation — slingshots are always active unless switch-controlled
  controlledBySwitchId?: string;
  activationAnimation?: boolean; // play flex animation on contact (default true)
}
```

### Physics — Reflection + Boost

```
On bey contact with kick face:
  // Standard reflection across the face normal
  faceNormal = ( cos(faceAngle_deg × π/180), sin(faceAngle_deg × π/180) )
  v_reflected = bey.velocity - 2 × dot(bey.velocity, faceNormal) × faceNormal

  // Apply restitution boost (energy added):
  v_exit = v_reflected × restitution    // e.g. 1.3× = 30% faster than incoming

  // Optional kick bonus in face-normal direction:
  v_exit += faceNormal × (kickBonus_N / bey.mass)

  bey.velocity = v_exit
```

**Energy addition (restitution > 1.0):** Real pinball slingshots add energy to the ball — the elastic band stores and releases energy. `restitution: 1.3` means a bey hits at 40 cm/s and exits at 52 cm/s. This can gradually accelerate beys in a pinball arena loop.

**Visual flex:** The slingshot triangle "flexes" on contact — scale to 80% toward the apex, then spring back to 100% over 120ms. Classic pinball slingshot feel.

### 2.5D Rendering

Triangular obstacle in `arenaTiltInner`. The kick face is the prominent face (lighter shade, facing `faceAngle_deg`). The two passive sides are darker. In 2.5D:
- Triangle rendered as a foreshortened prism — near face full height, far face compressed
- On contact: brief white flash on kick face + flex scale animation
- `z_top_cm = 1.0`: the triangle appears slightly raised above the floor

**Memory class:** STATIC (baked into atlas). DYNAMIC: contact flash + flex animation are event-driven.

---

## AE-46 — Kickback {#ae-46}

**Element Type ID**: `kickback`

**What it is:** A wall-mounted mechanism that saves a bey from ring-out. When a bey enters the kickback zone (near the arena boundary, at risk of going out), the kickback fires an inward impulse — shoving the bey back toward the center. In Space Cadet Pinball this is the mechanism that saves the ball when it drains down the left or right gutter.

**Unlike the standard wall (ε=0.72):** The kickback does not bounce the bey back — it actively propels it inward with a configurable force. It can only save beys that are moving toward the wall, not beys already bouncing away from it.

### Config Schema

```typescript
interface KickbackConfig {
  id: string;

  // Wall segment where kickback is mounted
  wallArcStart_deg: number;   // start of the wall arc segment (0–359°)
  wallArcEnd_deg: number;     // end of the wall arc segment
  wallRadius_cm: number;      // which ring of the wall (usually = arena.radius_cm)
  triggerDepth_cm: number;    // how close to wall a bey must be to trigger (e.g. 5 cm from wall)

  // Kick physics
  kickStrength_N: number;     // inward impulse magnitude
  kickAngle?: "radially_inward" | "tangential_cw" | "tangential_ccw" | number;
                              // direction: radially_inward = straight back toward center
                              // tangential = shunts bey along the wall (useful for redirecting to opponent)
                              // number = explicit angle override (deg)

  // Charge state — kickback must recharge between fires
  chargesPerMatch?: number;   // total uses (default unlimited); set to 1 for "one save" mechanic
  cooldownMs: number;         // recharge time after each use
  chargeIndicator?: boolean;  // show charge state on the wall (glow when charged, dark when spent)

  controlledBySwitchId?: string;  // if set, only active when switch is on
  linkedSwitchId?: string;        // fires a switch when kickback triggers (for chain reactions)
}
```

### Physics — Inward Save

```
Per tick:
  For each bey in the wall boundary zone (r > arenaRadius_cm - triggerDepth_cm):
    if bey is moving outward (radial velocity > 0):
      if kickback.charges > 0 AND kickback.lastFiredAt + cooldownTicks < currentTick:
        // Fire kickback
        kick_dir = kickAngle === "radially_inward"
                   ? -normalize(bey.position)           // straight toward center
                   : kickAngle === "tangential_cw"
                   ? perpendicular(normalize(bey.position), +1)
                   : explicit vector

        bey.velocity += kick_dir × (kickStrength_N / bey.mass)
        kickback.charges -= 1
        kickback.lastFiredAt = currentTick
        emit "kickback_fired" event → renderer flash + sound
```

**One-save variant:** `chargesPerMatch: 1` — the kickback saves one bey once, then goes dark for the rest of the match. Creates a strategic element: who uses the save?

**Tangential kick:** `kickAngle: "tangential_cw"` shunts the bey sideways along the wall arc rather than straight inward. The bey continues along the wall at speed, potentially hitting an opponent who was near the wall. This is more aggressive than the radially-inward save.

**Multiple kickbacks:** An admin can place multiple kickback segments around the arena boundary — e.g. one on the left arc, one on the right arc — each with independent charge tracking.

### 2.5D Rendering

The kickback is a small panel mounted on the arena wall. When **charged** (ready to fire): glows with a colored light (green or white pulse). When **spent** (on cooldown): dark/grey. Recharge animation: glow fades in from dark to bright over `cooldownMs`.

At the moment of firing: bright flash at the wall arc segment + a radial or tangential energy beam sprite pointing from the wall toward the center — drawn in `arenaTiltInner`, so it correctly appears foreshortened in 2.5D. The beam persists for 150ms then fades.

**`chargesPerMatch` indicator:** If `chargesPerMatch` is finite, show charge pips on the wall segment (e.g. 3 dots = 3 charges; dots go dark as charges deplete).

**Memory class:** DYNAMIC — charge state changes drive renderer updates (event-driven, not per-frame). Recharge animation is a timed fade (not per-frame polling).

---

## AE-47 — Bonus Lane / Chute {#ae-47}

**Element Type ID**: `bonusLane`

**What it is:** A narrow channel (chute) containing a sequence of rollover targets. When a bey travels the full length of the lane, triggering all targets in order, it receives a bonus. In Space Cadet Pinball this is the "fuel chute", "skill shot lane", and "launch ramp" combined. In a beyblade arena it creates a mission-progression mechanic mid-match: beys that thread the lane get power-ups, while beys that ignore it fight at baseline.

**Structure:** The lane is a narrow corridor defined by two parallel walls (`laneWidth_cm` apart) and a sequence of `laneTargets[]` spaced along its length. Each target is a rollover — a flat floor sensor the bey passes over. Targets can be lit (not yet triggered) or scored (triggered this pass).

### Config Schema

```typescript
interface BonusLaneConfig {
  id: string;

  // Physical corridor
  startX_cm: number;
  startY_cm: number;
  endX_cm: number;
  endY_cm: number;
  laneWidth_cm: number;        // corridor width (e.g. 4 cm — fits one bey)
  wallHeight_cm: number;       // height of corridor walls (e.g. 2 cm — low walls, bey can be hit out)

  // Rollover targets along the lane
  targets: LaneTarget[];       // positions along the lane 0–1 (fractional)

  // Completion reward
  onComplete: LaneReward;

  // Lane state — resets between games or on timer
  resetMode: "per_game" | "timed" | "manual_switch";
  resetTimerMs?: number;       // for "timed" mode
  resetSwitchId?: string;      // for "manual_switch" mode

  // Optional: must be activated to open (closed walls by default)
  openedBySwitchId?: string;   // walls disappear when switch fires
}

interface LaneTarget {
  positionFraction: number;    // 0.0 = lane start, 1.0 = lane end
  label?: string;              // "FUEL 1", "FUEL 2", etc.
  requiresSequential?: boolean; // must be triggered in order (default true)
}

interface LaneReward {
  type: "spin_boost" | "power_restore" | "spawn_obstacle" | "fire_switch" | "score_multiplier";
  spinBoostFraction?: number;  // e.g. 0.3 = restore 30% of maxSpin
  powerRestore?: number;       // HP restored
  spawnObstacleId?: string;    // spawn a pre-defined element
  fireSwitchId?: string;       // trigger a switch on completion (chain reaction)
  multiplier?: number;         // damage multiplier bonus for duration
  durationMs?: number;         // how long the reward lasts
}
```

### Physics — Rollover Detection

```
Per tick:
  For each bey moving through the lane corridor (bey x,y within lane walls):
    For each un-triggered target in sequence order:
      if bey.position overlaps target.positionFraction along lane axis:
        target.triggered = true
        emit "lane_target_hit" (flash that target rollover)
        if all targets triggered: emit "lane_complete" → apply LaneReward
```

**Sequential requirement:** If `requiresSequential: true`, a bey must hit targets in order — triggering target 3 before target 2 does nothing. This requires the bey to travel the full length of the lane without reversing. A bey that gets hit backward while in the lane and re-enters won't get credit for targets it already passed.

**Multi-bey competition:** Two beys can be in the lane simultaneously. Whichever bey completes the sequence first gets the reward. The other bey's partial progress is preserved (they might get the next-complete reward if there are multiple completions).

**Lane reset:** After completion, targets reset to un-triggered state after `resetMode` condition. `per_game` — resets at next game start. `timed` — resets after `resetTimerMs`. `manual_switch` — admin or player hits a switch to re-light the lane.

### Space Cadet Pinball Connection — Mission System

The bonus lane maps directly to Space Cadet's mission lanes:
- **Fuel Chute** → `bonusLane` with `onComplete: { type: "spin_boost", spinBoostFraction: 0.25 }` — passing the fuel chute restores spin (fuel = power)
- **Skill Shot Lane** → `bonusLane` with `openedBySwitchId` wired to the launch flipper — only open for the first few seconds of the match; completing it gives a big bonus
- **Launch Ramp** → `bonusLane` with a speed boost on entry + kickback at the end (wired via `fireSwitchId` to a kickback)
- **Satellite Target Sequence** → multiple `bonusLane` elements wired in chain: completing lane A fires a switch that opens lane B

### 2.5D Rendering

**Corridor walls:** Low walls (`wallHeight_cm = 2cm`) rendered like obstacles but narrow. In 2.5D the corridor appears as two parallel raised ridges with a gap between them.

**Lane targets (rollovers):** Small floor discs at each target position along the lane. **Lit state** (not yet triggered): bright colored circle (e.g. yellow). **Scored state** (triggered): dim or colored differently (e.g. green check). Animate lit → scored with a brief flash on trigger.

**Completion animation:** When the lane completes, a light runs along the full length of the corridor from start to end over 300ms — like the ball-return animation in Space Cadet. Then the reward effect fires (spin boost flash, power glow, etc.).

**`openedBySwitchId` state:** When lane is closed, the walls are solid and opaque. When opened (switch fires), walls fade out over 200ms (become semi-transparent low barriers). The opening creates a visual "corridor opening up" moment.

**Memory class:** STATIC walls baked into atlas (if always open). DYNAMIC: target state overlays (lit/scored) and completion animation are event-driven. Switch-controlled lane walls are DYNAMIC on state change.

### Arena — Full Pinball Layout Example

A complete beyblade pinball arena would combine:

```
                    ┌─────────────────────────────────┐
                    │   BONUS LANE (fuel chute)        │
          ┌─────────┤   targets: 3 rollovers           │
          │KICKBACK │   reward: +25% spin              │
          │(left)   └───────────────┬─────────────────┘
          │                         │
  ┌───────┤   POP BUMPERS (×3)      │
  │       │   AE-14: pinball_bumper │
  │SLING- │   arranged triangle     │
  │SHOT   │                         ├────────── FLIPPER (right)
  │(left) │   SPIN ZONE center      │           AE-44: player mode
  │       │   AE-17: +spin          │           playerKey: "right"
  └───────┤                         │
          │   GRAVITY HOLE          │
          │   AE-16: weak pull      │
  ┌───────┤                         │
  │SLING- │   PORTAL (wormhole)     ├────────── FLIPPER (left)
  │SHOT   │   AE-9: to drain-save   │           AE-44: player mode
  │(right)│   portal on far side    │           playerKey: "left"
          │                         │
          └────────────DRAIN────────┘
           (ring-out zone — low restitution wall)
```

All elements reference their AE type — no custom code per element type needed. The full pinball arena is an admin configuration.

---

*INDEX_E compiled from: `shared/types/arenaConfigNew.ts` (full type system), `server/shared/physics/ArenaUtils.ts` (tilt + bowl physics), `server/shared/rooms/ArenaFeatureProcessor.ts` (per-tick processing), `client/src/game/renderer/PixiRenderer.ts` (tilt chain), `client/src/types/game.ts` (Colyseus-synced state schemas).*

---

## Real-World Arena Example: Black Sea Bowl (Case 562)

> Source: `13 case study.md` — Case 562 — Black Sea Bowl Arena (BBA V-Force / Biovolt Stadium)

This example shows how the AE types combine in a single real arena. It also covers bey-physics interactions not obvious from the individual AE entries: zone transitions, slope-induced sliding, whirlpool tangential force, wave threshold events, and boat platform boarding.

### Plan-View Geometry (all in cm)

```
PLAN VIEW (r=100cm outer):
  ╔══════════════════════════════════════════════════════╗
  ║  WALL (Zone 4, r=90–100cm, H=8cm, ε=0.72)           ║
  ╠══════════════════════════════════════════════════════╣
  ║  RING ROAD (Zone 3, r=80–90cm, w=10cm, μ=0.20)      ║
  ╠═╦═══════╦══════════════════════════╦═══════╦═════════╣
  ║ ║ PIER  ║                          ║ PIER  ║         ║
  ║ ║ 3.5cm ║  HARBOUR WATER (Zone 1) ║ wide  ║         ║
  ║ ║ wide  ║  r=0–70cm, μ=0.80–1.20  ║       ║         ║
  ║BANK     ║  BOATS v≈4cm/s  ┌──┐   ║       ║  BANK   ║
  ║SLOPE    ║  12cm×5.5cm     └──┘   ║       ║  SLOPE  ║
  ║α=25°    ║    ┌─────────────────┐  ║       ║  α=25°  ║
  ║g_lat=   ║    │ WHIRLPOOL r<20cm│  ║       ║         ║
  ║4.14m/s² ║    │ Ω=0.5·e^0.08t  │  ║       ║         ║
  ╠═╩═══════╩═════════════════════════╩═══════╩═════════╣
  ╚══════════════════════════════════════════════════════╝
  Zone 1: WATER   r=0–70cm    μ=0.80–1.20 (ploughing drag)
  Zone 2: BANK    r=70–80cm   α=25°, g_lat=4.14 m/s² inward
  Zone 3: ROAD    r=80–90cm   μ=0.20, w=10cm
  Zone 4: WALL    r=90–100cm  H=8cm, ε=0.72
  BOATS: 12cm×5.5cm, deck μ=0.22, +1.2cm above water, v≈4cm/s
  PIERS: 4× 3.5cm wide planks, r=80cm → r=60cm inward
  WHIRLPOOL: r=0–20cm, Ω(t)=0.5·e^(0.08t) rad/s
```

### Arena Element Inventory

| AE Type | ID | Key Config |
|---------|-----|------------|
| AE-1 Wall | Zone 4 | r=90cm, H=8cm, ε=0.72 |
| AE-2 Floor Zones | Zones 1–3 | 3 concentric friction zones (see table below) |
| AE-7 Gravity Well (whirlpool variant) | whirlpool_main | r=20cm, Ω₀=0.5, growth=0.08/s, waveThreshold_Ω=2.0, F_wave≈9.81N |
| AE-8 Liquid (harbour water) | harbour | μ=0.80–1.20, isLiquid=true |
| AE-13 Moving Platforms | boats×10 | 12×5.5cm, z_deck=+1.2cm, v=4cm/s, random arc paths |
| AE-5 Rails (piers) | piers×4 | w=3.5cm, r_start=80cm, r_end=60cm, z=+0.8cm |

### Zone Physics Table

| Zone | r_min | r_max | μ_k | Special |
|------|-------|-------|-----|---------|
| Water | 0 | 70 cm | 0.80–1.20 | isLiquid — ploughing drag; spin decay accelerated |
| Bank | 70 | 80 cm | 0.35 | slopeAngle=25°, slopeDirection=inward; g_lat=4.14 m/s² |
| Road | 80 | 90 cm | 0.20 | Smoothest surface; beys accelerate here |
| Wall | 90 | 100 cm | — | Restitution ε=0.72; H=8cm |

### Bey Physics Interactions — Per Zone

#### Zone 1 — Water (r < 70 cm)

**Spin decay acceleration:**
```
dω/dt_water = dω/dt_base × μ_water / μ_road
            = dω/dt_base × (1.0 / 0.20) = dω/dt_base × 5×
```
Water drag is 5× faster spin decay than the road surface. Low-stamina beys (μ_tip high + I_total low) lose >50% spin in ~3s in open water.

**Linear drag (ploughing):**
```
F_drag = μ_water × m × g = 1.0 × m × 9.81 N
```
A 30g bey moving at v=50cm/s loses momentum ~10× faster than on the road. Beys slow visibly in water — heavier assemblies maintain momentum longer (F_drag/m is mass-independent, but I_total resistance to spin-induced lateral wander is not).

**Tilt instability:** The high friction differential at the water surface destabilises beys entering from road (μ 0.20 → 1.0). The sudden friction increase jerks the bey's tip contact point, increasing `beyTiltAngle` by ~3–5° per crossing at normal speed. At low spin (ω < 0.4 × maxSpin), this tilt increment tips the bey into wobble mode.

**Jump/skip effect:** A high-spin bey (ω > 0.8 × maxSpin) crossing from road into water at speed v > 40 cm/s can partially "hydroplane" — the short contact interval means the ploughing drag applies for less than one tick. The bey skips across the water surface before grip locks in, travelling 15–25 cm further than expected. Engine implication: μ_water lookup is per-tick; a fast-moving bey may spend 0 or 1 ticks in the water zone before reaching the bank.

#### Zone 2 — Bank Slope (r = 70–80 cm)

**Lateral gravity:**
```
g_lat = g × sin(α) = 9.81 × sin(25°) = 4.14 m/s²
F_lat = m × g_lat = m × 4.14 N   (directed inward, toward arena center)
```
A 40g bey on the bank: `F_lat = 0.040 × 4.14 = 0.166 N` inward per tick. This decelerates outward-moving beys and pulls inward-moving beys back toward the water. Slow beys (v < 10 cm/s outward) cannot escape the bank and slide back into the water.

**Escape condition:**
```
v_min_outward = sqrt(2 × g_lat × w_bank) = sqrt(2 × 4.14 × 0.10) ≈ 0.91 m/s = 91 cm/s
```
A bey must have radial velocity > 91 cm/s to traverse the full 10cm bank width and reach the road. In normal gameplay most beys roll back into the water unless launched from an opponent's hit.

**Bump-like tilt effect:** When a bey hits the water→bank transition at high radial speed, the sudden slope increase acts like a ramp. The slope redirects some horizontal momentum upward:
```
F_vertical_component = F_impact × sin(α) = F_impact × 0.423
```
At F_impact ≈ 5N (moderately fast crossing): F_vertical ≈ 2.1 N upward impulse. This increments `beyTiltAngle` by ~2–4° and is rendered as the bey visibly rising in the 2.5D view (z increases briefly). It is NOT a jump mechanic — just a slope redirection. The bey returns to z=0 within 2–3 ticks.

**2.5D rendering:** The bank appears as a gradient band — dark near water (lower z), lighter near road (higher z). Bey sprites moving across the bank shift Y position slightly as the slope raises them in screen space.

#### Zone 3 — Road (r = 80–90 cm)

**Low friction zone:** μ=0.20 — beys maintain speed and gain stable spin. This is the "safe zone" where defensive and stamina types can outlast attackers.

**Rail-adjacent behavior:** Piers extend from r=80cm to r=60cm, passing through the water zone. A bey riding a pier from the road inward can maintain linear momentum despite the water friction (pier surface μ=0.22 ≈ road μ, not water μ).

#### Zone 4 — Wall (r = 90–100 cm)

**Restitution bounce:**
```
v_out = v_in × ε = v_in × 0.72
```
A bey hitting the wall at v=80 cm/s rebounds at v=57.6 cm/s. High-attack beys can exploit this for wall-bounces back toward opponents.

**Wall height (8cm):** In 2.5D, the near side of the wall appears full height (`8 × 24 = 192px`); the far side appears `8 × cos(28°) × 24 ≈ 169px`. Impact at the wall fires the flash event at the contact arc (see AE-1).

### Whirlpool Physics (AE-7 variant)

```
Ω(t) = 0.5 × e^(0.08 × t)   rad/s, t in seconds since match start
```

**Tangential force on bey at radial distance r_bey from center:**
```
F_tangential = m_bey × Ω(t) × r_bey
```
For a 30g bey at r=15cm at t=30s:
```
Ω(30) = 0.5 × e^(0.08×30) = 0.5 × e^2.4 ≈ 0.5 × 11.02 = 5.51 rad/s
F_tangential = 0.030 × 5.51 × 0.15 = 0.0248 N
```
At t=30s the tangential force is modest (~25 mN). At t=60s: Ω≈27 rad/s → F_tangential≈0.12N. This is enough to noticeably orbit a bey around the whirlpool center.

**Wave threshold event:**
```
if Ω(t) ≥ 2.0 rad/s → wave_event fires
F_wave ≈ 9.81 N radially outward (one-time impulse)
```
Ω reaches 2.0 at t = ln(4.0)/0.08 = 17.3 seconds. The wave event fires at ~17s into the match. This is a near-ring-out impulse for beys on the road (r=80–90cm) — F_wave=9.81N pushes them toward the wall. A 30g bey: `Δv = F_wave/m = 327 cm/s` — enough to hit the wall and bounce back.

**Orbital capture:** Once Ω > 5 rad/s (t≈30s), beys inside r<20cm begin to orbit the center involuntarily. At Ω=10 rad/s a bey cannot escape under its own thrust.

**2.5D rendering:** Whirlpool rendered as an animated rotating spiral inside the `arenaTiltInner` — the spiral rotates in world 2D coords; the tilt chain compresses it to an elliptical spiral in screen space. Spiral outer radius grows as Ω(t) increases. At the wave threshold moment, a radial flash animation fires from center outward.

### Boat Platform Boarding (AE-13 interaction)

**Platform spec:** 12cm × 5.5cm rectangle, deck z=+1.2cm above water surface, deck μ=0.22, movement v≈4cm/s on random arc paths.

**Boarding:** When a bey's position enters the boat footprint (12×5.5cm bounding box at the boat's current position), the bey is placed on the deck:
- Bey z_cm → +1.2cm (rides on deck)
- Bey velocity → bey.velocity += boat.velocity (inherits 4 cm/s lateral push)
- Floor friction changes: water μ(1.0) → deck μ(0.22) — immediate spin decay reduction

**Lateral slide-off:** If the bey's position drifts outside the 12×5.5cm footprint:
- Bey z_cm → returns to water level (0.0)
- Friction reverts to water μ (1.0) — sudden spin decay acceleration
- No vertical impulse on departure (unlike a bump) — the bey simply drops from the deck

**Velocity inheritance physics:**
```
Δv_bey = boat.v = 4 cm/s
Direction: tangent to the boat's arc path at current boat position
Effect duration: while bey stays on deck (position check per tick)
```
A bey riding a boat toward the wall gains the boat's 4cm/s radial component toward the wall. If a fast attacker hits the bey while on the boat, the relative velocity (attacker speed − boat carry speed) determines collision force.

**2.5D rendering:** Boat rendered at z=+1.2cm above water — its screen Y position is offset upward by `1.2 × 24 × cos(28°) ≈ 25px`. Bey on boat also rendered at this z offset. Motion trail (faint wake) behind the boat in the water texture.

### Full TypeScript ArenaConfig

```typescript
const blackSeaBowl: ArenaConfig = {
  id: "black_sea_bowl",
  name: "Black Sea Bowl",
  shape: "circle",
  radius: 90,                  // physics radius in px (90cm × 1 — stored as cm, rendered × PX_PER_CM)
  wallHeight_cm: 8,
  wallRestitution: 0.72,

  tiltAngle: 0,                // flat arena (no global tilt)
  tiltDirection: 0,
  autoTilt: false,

  floorZones: [
    { id: "water", r_min_cm: 0,  r_max_cm: 70, mu: 1.0,  isLiquid: true },
    { id: "bank",  r_min_cm: 70, r_max_cm: 80, mu: 0.35, slopeAngle_deg: 25, slopeDirection: "inward" },
    { id: "road",  r_min_cm: 80, r_max_cm: 90, mu: 0.20 },
  ],

  gravityHoles: [
    {
      id: "whirlpool_main",
      x: 0, y: 0,
      radius: 20,                          // cm
      pullStrength: 0,                     // no direct inward pull — force is tangential
      eliminationRadius: 2,                // bey at r < 2cm is eliminated
      whirlpool: {
        omega0: 0.5,
        growthRate: 0.08,
        waveThreshold_omega: 2.0,
        waveForce_N: 9.81,
        waveSpeed_cms: 75,
      },
    },
  ],

  movingPlatforms: [
    {
      type: "boat",
      width_cm: 12,
      height_cm: 5.5,
      deckHeight_cm: 1.2,
      mu: 0.22,
      speed_cms: 4,
      count: 10,
      pathType: "randomArc",
    },
  ],

  rails: [
    { id: "pier_n", path: { type: "straight", from_cm: { r: 80, θ: 90  }, to_cm: { r: 60, θ: 90  } }, width_cm: 3.5, z_top_cm: 0.8, railSpeedBoost: 0 },
    { id: "pier_s", path: { type: "straight", from_cm: { r: 80, θ: 270 }, to_cm: { r: 60, θ: 270 } }, width_cm: 3.5, z_top_cm: 0.8, railSpeedBoost: 0 },
    { id: "pier_e", path: { type: "straight", from_cm: { r: 80, θ: 0   }, to_cm: { r: 60, θ: 0   } }, width_cm: 3.5, z_top_cm: 0.8, railSpeedBoost: 0 },
    { id: "pier_w", path: { type: "straight", from_cm: { r: 80, θ: 180 }, to_cm: { r: 60, θ: 180 } }, width_cm: 3.5, z_top_cm: 0.8, railSpeedBoost: 0 },
  ],

  globalModifiers: {
    spinDecayMult: 0.7,        // large open area — beys last longer baseline
    matchDuration_s: 180,
  },
};
```

### Engine Requirements (Black Sea Bowl)

1. **Per-zone μ lookup per tick** — bey position → `r = sqrt(x²+y²)` → zone index → μ_k. Lookup must handle the r=70cm and r=80cm transition boundaries exactly (use `r < 70` for water, `70 ≤ r < 80` for bank, `r ≥ 80` for road).

2. **Slope force separate from arena tiltAngle** — bank slope (25° inward) is a floor-zone property, not the global `ArenaState.tiltAngle`. The bank only applies its g_lat=4.14m/s² inward when the bey is within r=70–80cm. Outside this zone, no slope force.

3. **Whirlpool Ω(t) grows per tick** — `state.whirlpoolOmega += 0.08 × omega × dt` (exponential growth). Wave event fires ONCE when omega first crosses 2.0 rad/s — not on every tick above threshold. Set `waveEventFired = true` flag.

4. **Tangential whirlpool force direction** — force is perpendicular to the radial vector (not inward). Direction: `tangent = normalize((-bey.y, bey.x))` (CCW rotation) × F_tangential. Ω growth rate means force increases throughout the match.

5. **Boat platform position update** — boats move on random arc paths at v=4cm/s. Per tick: advance position by `v × dt` along arc. Check all beys for position overlap with each boat's footprint. Apply velocity inheritance and z elevation to beys on platform.

6. **Platform z elevation in renderer** — bey on platform has `bey.z_cm = 1.2`. Renderer applies `zToScreenOffset(1.2)` — bey appears slightly elevated above water. This affects depth-sorting: bey on platform should render above water texture but below pier height (0.8cm — wait, pier is 0.8cm, boat deck is 1.2cm — boat deck is higher than pier, so bey on boat renders above pier).

7. **Pier as AE-5 rail** — piers are narrow raised ridges (w=3.5cm, z=+0.8cm). A bey that contacts the pier top enters rail-ride state (if tip type supports it). No speed boost on piers (`railSpeedBoost: 0`). Pier surface μ=0.22.

8. **Liquid drag vs wall restitution** — water zone is liquid (isLiquid=true) so it applies ploughing drag per tick (μ_liquid multiplier). The wall (Zone 4) applies restitution ε=0.72 on collision. These are distinct physics paths — do not conflate them.

9. **2.5D z-ordering in this arena:**
   ```
   z=0.0  Water surface (floor, animated texture)
   z=0.0  Road and bank (static atlas baked)
   z=0.8  Pier planks (ridge heightProfile)
   z=0.0–5.2  Beyblades (part z-stack, varies by assembly)
   z=1.2  Boat decks (flat, moving)
   z=8.0  Wall (near side: full height; far side: cos(28°) foreshortened)
   ```

---

## AE-48 � Unified MechanicRegistry: Arena ? Beyblade Shared Mechanics

> **Core principle**: There is ONE MechanicRegistry. Arena elements and beyblade gimmicks are both *callers* of the same handler functions. The distinction is only who triggers the mechanic and when � not what the mechanic does. A spin zone and a magnacore gimmick both invoke `orbitBoost`. A turret poison shot and a beyblade poison-tip gimmick both invoke `statusEffect`. A flipper and a beyblade spring-launch both invoke `tangentialVelocityKick`. This section documents the complete cross-system mapping.

### Architecture

```
  ARENA ELEMENT                        BEYBLADE GIMMICK
  -----------------------------------------------------------------
  AE trigger fires (contact/tick/enter) �  gimmick trigger fires (? threshold/contact/QTE)
             �                          �
             ?                          ?
  ArenaFeatureProcessor                GimmickRegistry.get(gimmickId)
             �                          �
             +--------------------------+
                         �
                         ?
              MechanicRegistry.get(mechanicId)
                         �
                         ?
              handler(ctx: BattleContext, params: MechanicParams): MechanicResult
                         �
                         ?
              Apply: velocity impulse / spin delta / statusEffect / movementOverride
                     / spawnElement / flipPhysics / boomEffect / ...
```

No special-casing by source. The mechanic handler does not know if it was called by an arena element or a beyblade gimmick. The same `spinBoost` mechanic applies whether it was triggered by a spin zone floor tile or a Fafnir free-spin layer. The same `statusEffect` mechanic fires whether it came from a turret poison shot or a beyblade venom-tip gimmick.

---

### Complete Mechanic ID ? Source Mapping Table

| Mechanic ID | AE Elements That Use It | Beyblade Gimmick Types That Use It | Turret Attack Categories |
|-------------|------------------------|-----------------------------------|--------------------------|
| `linearImpulse` | AE-3 Bump (`popStrength_N`), AE-5 Rail exit, AE-7 Gravity Well elimination kick, AE-45 Slingshot | Smash AR contact, `stampede_rush` special move, `power-thrust` combo | Cat 1 (all projectile hits), Cat 3 AoE burst |
| `angularImpulse` | AE-44 Flipper (tangential kick), AE-45 Slingshot (`kickBonus_N`), AE-46 Kickback | Spring-launch Core gimmick, `pivot-strike` combo | � |
| `spinBoost` | AE-6 Spin Zone (`spinBoost_rads2`), AE-47 Bonus Lane reward, AE-8 Motor Disc arena | `motor_spin_boost` (Ignition' driver), `spin_equalization` (Fafnir), `staminaRecovery` | Cat 7 turret self-buff (`agility`, `meditate`) |
| `spinDelta` | All damage-dealing AEs (wall collision, obstacles), AE-7 elimination | `upper_attack`, `smash_attack`, `burst_attack` all produce spinDelta | Cat 1�3 projectile/beam/AoE hits |
| `orbitBoost` | AE-6 Spin Zone (`applyTo: "linear"`), AE-2 Floor Zone slope | `magnacore_attract`, `eternal_defence_free_spin` (ring spin builds orbit), recoil-redirect special moves | Cat 1 `tracking_missile` homing orbit |
| `railLock` | AE-5 Rail / Speed Line / X-Line (entire mechanic) | BX X-Dash rail engagement (`xd_gear_cam`), Grip Bit rail-bite | � |
| `gravityPull` | AE-7 Gravity Well (inward radial force per tick), AE-8 Whirlpool (tangential + inward) | `magnacore_repel` (inverted: outward), `magnacore_attract` (inward) | Cat 3 `gravity_cannon` |
| `statusEffect` | AE-23 Turret Cat 4 (all 13 status types), AE-8 Lava (`burned`), AE-8 Ice (`frozen`/`slowed`) | Venom-tip gimmick (`poisoned`), Electric-discharge gimmick (`stunned`), Magnetic gimmick (`magneted`) | Cat 4 all attack types |
| `movementOverride` | AE-23 Turret Cat 9 (`speed_surge`, `ghost_walk`, `gravity_flip`, etc.) | `dual_spin_launch` (forced spin direction), mode-switch behavioral change, `spring_launch` direction override | Cat 9 all override types |
| `burstSuppress` | AE-23 Turret Cat 7 (`barrier`, `harden` � reduces burst probability) | `choz_awakening` bistable burst-stop, Dash spring lock (`alpha` param), `burst_resist_mode` | � |
| `contactDeflect` | AE-43 Angled Trampoline (hard redirect), AE-45 Slingshot wall rebound | C145 individual wing deflect, ED145 free-spin deflect, `mode_switch_tip` angle deflect | � |
| `freeSpin` | AE-8 Moving Platform velocity decoupling (platform moves, bey inherits partially) | ED145 bearing ring (`eternal_defence_free_spin`), Bearing driver free-tip | � |
| `modeSwitch` | AE-12 Switch (toggles arena elements between states) | Zeta' 3-mode tip (`modeSwitch`), Dual-spin layer (`dual_spin_launch`) | Cat 7 turret `ultra_form` (state change) |
| `weightShift` | AE-14 Arena Tilt (shifts effective CoM of arena) | Wall Frame CoM lower, DB High/Low mode switch CoM shift | � |
| `verticalImpulse` | AE-3 Bump (pop upward), AE-44 Flipper (`v_z` component), AE-43 Trampoline launch | `upper_attack` (`F_upper = F_N � sin(a)`), `jolt_impact_launch` (v_z on force threshold) | Cat 2 `flamethrower` (upward component), Cat 3 AoE tilt change |
| `tiltChange` | AE-3 Bump (`beyTiltAngle` increment), AE-43 Trampoline forced tilt, AE-14 Arena Tilt | UW145 spike upper-attack (`beyTiltAngle` on opponent), `spiral_upper_ar` | Cat 1 `drill_shot` (corkscrews into tilt) |
| `environmentField` | AE-23 Turret Cat 6 Weather (`sunny_day`, `rain_dance`, etc.), AE-8 Liquid surface | `blizzalog` special move (arena-wide cold field), `horusood_field` (vortex field) | Cat 6 all weather types |
| `floorHazardPlacement` | AE-23 Turret Cat 5 (places AE-4 mines, AE-2 sticky web, etc.) | � | Cat 5 all hazard-placement types |
| `spawnOnDestroy` | AE-41 Debris/Spawn-on-Destroy | � (beyblades don't destroy themselves, but burst leaves fragments) | � |
| `breakFloorTile` | AE-42 Breakable Floor Tile (health-state machine) | Heavy-mass beyblade landing on fragile floor (mass threshold check) | Cat 3 `earthquake` (cracks tiles) |
| `restitutionBoost` | AE-45 Slingshot (`restitution > 1.0`) | `recoil_redirect_orbit` (Wonder Valtryek Volcanic � ?_recoil), rubber-tip wall bounce | Cat 1 `boomerang` (wall-amplified return) |
| `chainReaction` | AE-12 Switch chain-to (`chainTo`), AE-41 `onDestroy.fireSwitchId` | Combo chain detection (`quick-dash-l` ? `quick-dash-r` rapid sequence) | � |
| `velocityInheritance` | AE-13 Moving Platform/Boat | � | � |
| `beyAsWeapon` | AE-23 Turret Cat 8 (`spread_bey`, `railbey`, `bomb_bey`, etc.) | `kamikaze_rush` special move concept, `spin_equalization_opposite_spin` | Cat 8 all bey-weapon types |
| `turretAim` | AE-23 Turret fire patterns (nearest/furthest/sweep etc.) | AI input pattern: `hell_difficulty` ring-out targeting | � |
| `bonusLaneReward` | AE-47 Bonus Lane `onComplete` | Power restoration after combo chain completion | � |
| `pinballKick` | AE-44 Flipper, AE-45 Slingshot, AE-46 Kickback (combined: flipper kick + sling amplify + kickback save) | � (but a beyblade special move could use `angularImpulse` + `restitutionBoost` to mimic) | � |
| `upperLaunch` | AE-3 Bump (angled version), AE-43 Trampoline with `tiltBoost_deg` | UW145 fixed-wing upper, Spiral Upper AR omnidirectional, C145 wing-deflect | � |

---

### New Mechanics Needed (Arena-Derived, Not Yet in Registry)

These mechanics are defined by arena elements but do not yet exist in `mechanic_defs`. They must be seeded before arena element admin CRUDs go live. Each can also be applied to beyblade gimmicks from day one.

| Mechanic ID | Source AE | Description | Beyblade gimmick use case |
|-------------|-----------|-------------|--------------------------|
| `tangentialVelocityKick` | AE-44 Flipper | Rotational kick that converts flipper ? to bey tangential velocity: `v = ? � r_contact` | A beyblade with a spring-loaded wing that deploys on contact and kicks opponent tangentially |
| `restitutionBoost` | AE-45 Slingshot | Wall/surface restitution > 1.0 � adds energy on contact. `v_exit = v_in � e` where `e > 1.0` | A rubber-backed AR that amplifies rebound velocity (Bound AR, Rubber Upper) |
| `radialKickback` | AE-46 Kickback | Detects high-speed radial approach, redirects with `kickStrength_N` at configured angle | A beyblade AR with a wide rubber wedge that deflects attackers tangentially |
| `bonusLaneSequence` | AE-47 Bonus Lane | Sequential target hit detection; fires `onComplete` reward on full sequence | A beyblade combo that rewards completing a move sequence with a spin/power bonus |
| `spawnArenaElement` | AE-41 Spawn-on-Destroy | Creates new `ArenaElementConfig` instances in `ArenaState.dynamicElements` at runtime | A beyblade special move that deploys a temporary gravity well or spin zone at its position |
| `floorTileBreak` | AE-42 Breakable Floor | Applies damage to `breakableFloor.currentHp`; transitions floor state on threshold | A high-mass beyblade special move that cracks floor tiles on landing (`jolt_impact_launch`) |
| `weatherField` | AE-23 Cat 6 | Sets `ArenaState.weather: { type, expiresAt }` � applies global modifiers for duration | `blizzalog` special move (already uses this concept � wire to this mechanic ID) |
| `beyWeaponMode` | AE-23 Cat 8 | Sets `BeyStatusEffect: { type: "bey_weapon_mode", params }` on targeted bey | A special move that transforms the bey into a projectile (Burst Squall dive-bomb) |
| `movementOverrideBey` | AE-23 Cat 9 | Sets `BeyMovementOverride` struct on `Beyblade` schema, read per tick by physics loop | `ghost_walk` special move (phases through obstacles), `gravity_flip` (inverted gravity for duration) |
| `arenaTiltShift` | AE-14 Arena Tilt | Modifies `ArenaState.tiltAngle` and `tiltDirection` dynamically mid-match | A special move that dramatically tilts the arena for 3 seconds (Dranzer Spiral Tornado) |
| `flipperDeployable` | AE-44 Flipper | Rotates Matter.js static body from `restAngle_deg` to `firedAngle_deg` at `fireSpeedDegPerMs` | A beyblade AR with a deployable flipper blade (spring-mechanism that rotates on contact) |

---

### Special Move ? Arena Mechanic Equivalents

Many documented special moves already invoke arena-class effects. This table confirms the mapping � these special moves SHOULD reference the shared mechanic IDs from the unified registry:

| Special Move | Case | Arena Mechanic Equivalent | Mechanic ID to Use |
|-------------|------|--------------------------|-------------------|
| Blizzalog (Tala / Wolborg 2) | Case 751 | Arena-wide weather field: cold ? `spinDecayMult �1.80`, input delay +100ms | `weatherField` (type: "blizzard") |
| Horusood Field (Hoji / Hyper Horusood) | Case 1599 | Vortex field: radial force within r; opponents orbit inward | `gravityPull` + `orbitBoost` (combined) |
| Wonder Flash Launch (Valt / Valtryek) | Case 2091 | Recoil-redirect orbit: received impulse ? forward orbital boost | `restitutionBoost` + `orbitBoost` (chained) |
| Brutal Squall dive-bomb (Brutal Luinor Jolt) | Case 753 | Impact-reactive aerial launch: `F_impact > threshold ? v_z = k � F_impact` | `verticalImpulse` + `beyWeaponMode` |
| Eclipse Whip (Case 1250) | Case 1250 | Dual arc sweep AoE: `aoeType: "arc"`, `arcCount: 2`, `arcSeparation: 180�` | `linearImpulse` (aoe arc variant) |
| Any BeySpirit vortex field (Wolborg, Horusood) | Various | Creates persistent AE-6 Spin Zone at bey position for move duration | `spawnArenaElement` ? type: spinZone |
| Dranzer Spiral Tornado concept | Future | Tilts arena for 5s: `arenaTiltShift` to 45�, `autoTilt: true` for duration | `arenaTiltShift` |
| Fafnir spin-equalization | Cases ~240-260 | Absorbs opponent spin: `freeSpin` ring stores angular impulse | `freeSpin` + `spinBoost` (to self) |
| Spring-launch cores (EG, First Clutch) | CS4 cases | Spring releases stored energy as angular impulse at clutch trigger | `angularImpulse` (spring param) |

---

### Status Effect Registry (Shared: Turret Cat 4 + Beyblade Gimmicks)

Both turret attack type Category 4 and beyblade gimmick definitions reference the same `StatusEffectRegistry`. The effect is applied as `BeyStatusEffect` on the `Beyblade` schema and read per tick.

```typescript
interface StatusEffectRegistry {
  [effectId: string]: StatusEffectDef;
}

interface StatusEffectDef {
  id:               string;
  label:            string;
  // Per-tick physics modifications while effect is active:
  spinDecayMult?:   number;      // >1 = faster decay (burned, frozen); <1 = slower (magneted)
  movementMult?:    number;      // velocity scale per tick (slowed: 0.6; enlarged: 1.4)
  inputDelayMs?:    number;      // player input latency added (stunned: 300ms)
  dmgReceivedMult?: number;      // incoming damage multiplier (shrunk: �1.5 received)
  dmgDealtMult?:    number;      // outgoing damage multiplier (enlarged: �1.2 dealt)
  // Special behaviors:
  reverseInput?:    boolean;     // confused: flip left/right input
  noFloorFriction?: boolean;     // ghost: passes through AE elements (no floor contact)
  noCollision?:     boolean;     // invisible + ghost: no collision body
  magnetTarget?:    "arena_center" | "nearest_opponent" | "nearest_wall"; // magneted
  // Duration:
  durationMs:       number;
  // Curing:
  curedBy?:         "collision" | "spin_threshold" | "timer_only";
}
```

**Complete status effect table (same IDs used by turret Cat 4 AND beyblade gimmicks):**

| Status ID | AE source | Beyblade gimmick source | Per-tick effect |
|-----------|-----------|------------------------|-----------------|
| `stunned` | Electric turret | Electric-discharge gimmick (lightning-type layer) | `inputDelayMs: 300` |
| `confused` | Psychic turret / illusion | Mirror-AR gimmick (reflects visual) | `reverseInput: true` |
| `burned` | Fire turret, Lava AE-8 | Fire-type beyblade layer (ignition contact) | `spinDecayMult: 1.4` |
| `frozen` | Ice turret, Ice AE-8 | Ice-type beyblade (cryo-tip) | `spinDecayMult: 1.6`, `movementMult: 0.5` |
| `poisoned` | Poison turret | Venom-tip gimmick | `spinDecayMult: 1.15` per tick (stacking) |
| `leeched` | Leech turret | Absorb-AR gimmick (Fafnir-style leech variant) | `spinDelta: -2/tick to attacker; +2/tick to caster` |
| `shrunk` | Shrink-ray turret | � | `dmgReceivedMult: 1.5`, contact radius �0.7 |
| `enlarged` | Growth-ray turret | � | `dmgDealtMult: 1.2`, contact radius �1.3 |
| `slowed` | Mud/water turret, Ice zone | Magnetic brake gimmick | `movementMult: 0.6` |
| `magneted` | Magnetic turret | `magnacore_attract` / `magnacore_repel` | `magnetTarget: "arena_center"` |
| `invisible` | Stealth turret | � | `noFloorFriction: false` (still physical; visual only) |
| `ghost` | Phase turret | `ghost_walk` movement override | `noCollision: true`, `noFloorFriction: true` |
| `bey_weapon_mode` | Turret Cat 8 | Burst Squall / dive-bomb special moves | Bey becomes projectile: velocity redirected by `BeyMovementOverride` |

---

### BeyMovementOverride � Complete Registry (Shared: AE-23 Cat 9 + Special Moves)

`BeyMovementOverride` is a struct on the `Beyblade` schema. Any mechanic can set it; the physics loop reads it per tick and applies the override before player input.

```typescript
interface BeyMovementOverride {
  type:          string;         // override type ID � matches TurretAttackType Cat 9 names
  durationMs:    number;
  startedAt:     number;         // server timestamp
  params:        Record<string, number | boolean | string>;
}
```

| Override ID | Set by (Arena) | Set by (Special Move / Gimmick) | Physics per tick |
|-------------|---------------|--------------------------------|-----------------|
| `speed_surge` | Cat 9 turret | `stampede_rush` special move (burst phase) | `body.velocity *= surgeMult` (e.g. �3.0 for 800ms) |
| `gravity_flip` | Cat 9 turret | Future special move (Lucifer/Lucius gravity) | Invert `effectiveGravity_cms2` sign for duration |
| `bounce_storm` | Cat 9 turret | � | On each wall contact: random velocity reflection; `restitution = 1.5` for duration |
| `freeze_step` | Cat 9 turret | `gyro_anchor` special move equivalent | `body.velocity = (0,0)` per tick; spin preserved |
| `ghost_walk` | Cat 9 turret | � | `noCollision: true`; passes through obstacles/other beys; floor contact maintained |
| `boomerang_path` | Cat 9 turret | `boomerang` turret attack Cat 1 (when applied to bey) | Arc velocity calculation: curve toward origin each tick |
| `teleport_dash` | Cat 9 turret | Portal exit velocity (AE-9 portal teleport) | Instant position jump to `params.targetX_cm, targetY_cm`; one-tick only |
| `distortion` | Cat 9 turret | � | Position offset per tick by `sin(t � freq) � amplitude` (wobble path) |
| `broken_reality` | Cat 9 turret | � | Random force each tick from PRNG seeded on status start; deterministic across clients |
| `orbital_lock` | AE-6 Spin Zone (strong) | `spin_recovery` special move (circular orbit path) | `body` moves on circular orbit at `params.orbitRadius_cm, params.orbitSpeed_cms` |
| `rail_ride` | AE-5 Rail (`railLock` mechanic) | BX X-Dash rail engagement | Position constrained to rail path; only tangential force from `railSpeedBoost` |

---

### ArenaElementConfig ? GimmickDef Bridge

Any arena element can be wrapped as a **GimmickDef** with `source: "arena"`. This allows:
1. A beyblade's `gimmickIds[]` to reference arena-class effects that deploy at its position
2. Admin to build beyblade gimmicks that temporarily place spin zones, gravity wells, or floor mines
3. Special moves that modify the arena state (weather, tilt, spawn elements)

```typescript
// Example: A beyblade with a "Deploy Spin Zone" gimmick
// This is a standard GimmickDef � just wraps spawnArenaElement mechanic
{
  id: "deploy_spin_zone",
  label: "Deploy Spin Zone",
  source: "arena",            // indicates this gimmick creates an arena element
  triggerType: "special_move", // only fires when special move is activated
  behaviorRefs: ["spawnArenaElement"],
  mechanics: [{
    mechanicId: "spawnArenaElement",
    params: {
      elementType: "spinZone",
      lifetime_ms: 5000,
      placement: "at_bey_position",
      spinZoneConfig: {
        radius_cm: 8,
        applyTo: "both",
        spinBoost_rads2: 30,
        orbitForce_N: 0.5,
        z_base_cm: 0, z_top_cm: 0,
        heightProfile: "flat",
      },
    },
  }],
}

// Example: A beyblade special move that shifts arena tilt
{
  id: "dranzer_spiral_tornado",
  label: "Spiral Tornado",
  source: "arena",
  triggerType: "special_move",
  behaviorRefs: ["arenaTiltShift"],
  mechanics: [{
    mechanicId: "arenaTiltShift",
    params: {
      targetTiltAngle: 45,
      autoTilt: true,
      tiltSpeed: 30,          // degrees/second rotation
      durationMs: 5000,
      revertOnEnd: true,      // returns to original tiltAngle after duration
    },
  }],
}

// Example: A beyblade floor-mine special move (Cho-Z stealth approach)
{
  id: "stealth_mine_deploy",
  label: "Deploy Floor Mine",
  source: "arena",
  triggerType: "special_move",
  behaviorRefs: ["spawnArenaElement"],
  mechanics: [{
    mechanicId: "spawnArenaElement",
    params: {
      elementType: "obstacle",    // reuses AE-4 mine variant
      lifetime_ms: 8000,
      placement: "at_bey_position",
      obstacleConfig: {
        shape: "circle", dimensions_cm: { radius: 1.5 },
        z_top_cm: 0.3, heightProfile: "dome",
        health: 1,
        onDestroy: {
          placement: "explode",
          explodeCount: 4, explodeRadius_cm: 5,
          elements: [{ type: "bump", config: { popStrength_N: 6, lateralRecoil_N: 4 } }],
        },
      },
    },
  }],
}
```

---

### MechanicDef Seed Entries (new, arena-derived)

These 11 new entries must be added to `mechanic_defs` Firestore collection alongside the existing 31. They complete the registry by covering all arena element behavior classes:

```typescript
const newMechanicDefs = [
  { id: "tangentialVelocityKick",  label: "Tangential Velocity Kick",   handler: "tangentialVelocityKick",  params: ["omega_rads","r_contact_cm","holdMs","returnSpeedDegPerMs"] },
  { id: "restitutionBoost",        label: "Restitution Boost",          handler: "restitutionBoost",        params: ["restitution","kickBonus_N","spinTransfer"] },
  { id: "radialKickback",          label: "Radial Kickback",            handler: "radialKickback",           params: ["kickStrength_N","kickAngle","chargesPerMatch","cooldownMs"] },
  { id: "bonusLaneSequence",       label: "Bonus Lane Sequence",        handler: "bonusLaneSequence",        params: ["targets","onComplete","resetMode"] },
  { id: "spawnArenaElement",       label: "Spawn Arena Element",        handler: "spawnArenaElement",        params: ["elementType","placement","lifetime_ms","config"] },
  { id: "floorTileBreak",          label: "Floor Tile Break",           handler: "floorTileBreak",           params: ["damagePerTick","regenPerTick","thresholds","states"] },
  { id: "weatherField",            label: "Weather Field",              handler: "weatherField",             params: ["weatherType","durationMs","globalModifiers"] },
  { id: "beyWeaponMode",           label: "Bey-as-Weapon Mode",         handler: "beyWeaponMode",            params: ["weaponType","speed_cms","maxRange_cm","onHit"] },
  { id: "movementOverrideBey",     label: "Movement Override",          handler: "movementOverrideBey",      params: ["overrideType","durationMs","overrideParams"] },
  { id: "arenaTiltShift",          label: "Arena Tilt Shift",           handler: "arenaTiltShift",           params: ["targetTiltAngle","autoTilt","tiltSpeed","durationMs","revertOnEnd"] },
  { id: "flipperDeployable",       label: "Flipper Deployable",         handler: "flipperDeployable",        params: ["pivotRadius_cm","firedAngle_deg","fireSpeedDegPerMs","length_cm"] },
];
```

**Total mechanic_defs after this addition: 42 entries** (31 existing + 11 arena-derived)

---

### GimmickDef Additions (arena-sourced, admin-seeded)

These gimmick definitions expose the new arena-derived mechanics to the admin beyblade builder. They appear in the "Gimmick" dropdown alongside the existing 27 gimmick_defs:

| Gimmick ID | Mechanic IDs used | Beyblade part use case |
|-----------|-------------------|----------------------|
| `deploy_spin_zone` | `spawnArenaElement` | Special move: temporarily creates spin zone at bey position |
| `deploy_gravity_well` | `spawnArenaElement` | Special move: temporarily creates gravity well at center |
| `deploy_floor_mine` | `spawnArenaElement` | Special move: places explosive mine at bey position |
| `arena_tilt_shift` | `arenaTiltShift` | Special move: tilts arena for match-changing effect |
| `weather_field_blizzard` | `weatherField` | Special move: creates cold field (`blizzalog` archetype) |
| `weather_field_rain` | `weatherField` | Special move: creates water field (boosts Water-type, hinders Fire) |
| `movement_ghost_walk` | `movementOverrideBey`, `statusEffect(ghost)` | Special move / gimmick: phase through obstacles |
| `movement_speed_surge` | `movementOverrideBey` (speed_surge) | Special move burst: �3 velocity for 800ms |
| `movement_orbital_lock` | `movementOverrideBey` (orbital_lock) | `spin_recovery` archetype orbital path |
| `recoil_redirect` | `restitutionBoost`, `orbitBoost` | Rubber-backed AR: received hit ? forward orbital boost (`Wonder Valtryek` archetype) |
| `flipper_blade_deploy` | `flipperDeployable`, `angularImpulse` | AR with spring flipper blade; rotates on contact |
| `status_poison_tip` | `statusEffect(poisoned)` | Venom-type tip: applies poisoned to opponent on contact |
| `status_electric_shock` | `statusEffect(stunned)` | Lightning-type layer contact: stun on hit |
| `status_cryo_freeze` | `statusEffect(frozen)` | Ice-type layer: frozen + slowed on sustained contact |
| `bonus_combo_reward` | `bonusLaneSequence` | Combo chain: rewards spin/power on full sequence hit |

**Total gimmick_defs after this addition: 42 entries** (27 existing + 15 arena-derived)

---

### Seed Script Addition

Add to `scripts/seed-mechanics.js` and `scripts/seed-gimmicks.js`:

```javascript
// In seed-mechanics.js � append to existing 31 entries:
const arenaSourcedMechanics = [
  "tangentialVelocityKick", "restitutionBoost", "radialKickback",
  "bonusLaneSequence", "spawnArenaElement", "floorTileBreak",
  "weatherField", "beyWeaponMode", "movementOverrideBey",
  "arenaTiltShift", "flipperDeployable"
];

// In seed-gimmicks.js � append to existing 27 entries:
const arenaSourcedGimmicks = [
  "deploy_spin_zone", "deploy_gravity_well", "deploy_floor_mine",
  "arena_tilt_shift", "weather_field_blizzard", "weather_field_rain",
  "movement_ghost_walk", "movement_speed_surge", "movement_orbital_lock",
  "recoil_redirect", "flipper_blade_deploy", "status_poison_tip",
  "status_electric_shock", "status_cryo_freeze", "bonus_combo_reward"
];
```

Run `npm run seed:mechanics && npm run seed:gimmicks` after any code change that adds new handlers to `MechanicRegistry`.

---

### Summary: What AE-48 Means for Implementation

1. **One registry, two callers**: `ArenaFeatureProcessor` and `GimmickRegistry` both call `MechanicRegistry.get(id).handler(ctx, params)`. No duplication, no special-casing.

2. **Every AE element maps to =1 mechanic ID**: Admin cannot configure an arena element that has no registered handler. The element type ? mechanic ID mapping is enforced at save time.

3. **Beyblade special moves can create arena elements**: `spawnArenaElement` mechanic lets special moves temporarily deploy spin zones, gravity wells, mines, and more � turning beyblades into dynamic arena modifiers.

4. **Turret attacks and beyblade attacks share status effect IDs**: `statusEffect("poisoned")` means the same thing whether it came from a turret shot or a venom-tip contact. The same `StatusEffectDef` entry governs both.

5. **Movement overrides are unified**: A turret `speed_surge` and a `stampede_rush` special move both set `BeyMovementOverride.type = "speed_surge"` with the same params. The physics loop has ONE branch for reading `BeyMovementOverride` � it does not care who set it.

6. **New mechanic_defs count: 42** � **New gimmick_defs count: 42**. These are seeded via the existing seed scripts � no new seed files required.


---

## AE-49 � Speed Circuit / Rail Network (X-Line, XD Gear, Speed Path Assembly)

> A **Speed Circuit** is a connected network of AE-5 Rails plus entry/exit elements (trampolines, ramps, flippers, kickbacks) that form a continuous or lap-style speed path. This is the arena realisation of the Beyblade X **Xtreme Dash** mechanic � beyblades with XD gear lock onto rails and gain enormous speed boosts. The same `railLock` mechanic is the shared bridge between the arena element and the beyblade gear gimmick.

### Physics

**Entry**: A bey reaches an AE-5 rail ridge at `z_top_cm � 0.3`. Tip contacts the ridge. `railLock` mechanic fires:
- Tip type check: rubber tips (� = 0.5) and XD-gear bits engage with highest efficiency (`?_rail � 0.80�0.90`). Flat plastic tips: `?_rail � 0.40`. Sharp/needle tips: `?_rail � 0.20` (too narrow to grip ridge width).
- BX XD gear engagement bonus: if bey has `xd_gear: true` in its bit config, `?_rail = ?_xd` (see below). The curved XD gear teeth mesh with the rail ridge, converting lateral rolling into a centripetal lock with `+10�40%` speed boost per segment.

**On rail**: Bey position constrained to rail path. Per tick:
```
v_tangential += railSpeedBoost_cms2 � dt
v_lateral     = 0  (rail constraint)
F_centripetal = m � v� / R_path   (for curved rails)
```
Tip friction contributes: `T_friction = �_tip � m � g � r_tip`. On a rubber tip (�=0.70) this is high � but the `railSpeedBoost` more than compensates. Net spin decay is REDUCED on rail (less wobble; more stable upright spin).

**Exit**: Bey leaves rail when `F_lateral > detachForce_N` (from collision, player steer input, or rail end). At rail end, the built-up `v_tangential` is released as a directional velocity burst in the rail's exit tangent direction.

**XD Gear specific (`xd_gear: true` on bit config)**:
```
?_xd = 0.85 (curved tooth mesh efficiency)
speedBoostFactor = 1.0 + (?_xd � railSpeedBoost_cms2 � segmentLength_cm) / (v_entry � 100)
// At v_entry=200 cm/s on a 30cm segment with railSpeedBoost_cms2=200:
// speedBoostFactor = 1.0 + (0.85 � 200 � 30) / (200 � 100) = 1.0 + 0.255 = 1.255 (+25.5%)
v_exit = v_entry � speedBoostFactor  // = 250.9 cm/s from 200 cm/s entry
```

The cam-lift mechanism (see Case 413 � Xtreme Dash Bit): XD gear engagement includes a 20�50ms vertical lift (`elevation_ms`). During lift: `bey.z_cm` rises to `z_top_cm + 0.2`, tip friction = 0 (airborne). When the bey lands back at the rail it has converted the rotational energy stored in the gear cam into forward velocity � a brief "hop then surge" that is the characteristic XD motion profile.

### Config Schema

```typescript
interface SpeedCircuit {
  id:        string;
  segments:  RailSegment[];     // ordered array � index 0 = circuit start; wraps if closed
  entryLinks: SpeedCircuitLink[]; // trampolines, flippers, ramps that feed INTO this circuit
  exitLinks:  SpeedCircuitLink[]; // kickbacks, slingshots, portals that catch circuit-exit beys
  closed:     boolean;           // true = lap circuit (segment[last] connects back to segment[0])
  lapReward?: LaneReward;        // fired when a bey completes a full lap (reuses AE-47 LaneReward)
}

interface RailSegment {
  railId:            string;       // references an AE-5 RailConfig id
  sequenceIndex:     number;       // position in the circuit
  entryDirection:    number;       // approach angle (deg) from previous segment or entry link
  exitDirection:     number;       // departure angle (deg) to next segment or exit link
  xdGearBonus:       boolean;      // true = XD cam-lift elevation during this segment
  elevationMs?:      number;       // XD cam-lift duration (ms); only if xdGearBonus
  segmentLength_cm:  number;       // length of this segment's rail path
}

interface SpeedCircuitLink {
  type:     "trampoline" | "flipper" | "ramp" | "kickback" | "slingshot" | "portal";
  elementId: string;              // references the AE element config id
  linkRole:  "entry" | "exit";
  // For entry links: the element's exit velocity feeds into the circuit at segment[0]
  // For exit links: circuit-exit velocity is captured and redirected by the element
  faceAngle_deg: number;          // the entry/exit direction of this link in world coords
}
```

### Speed Circuit Arena Examples

**BX X-Dash Stadium (Beyblade X standard)**:
```
 +------------------------------+
 �                              �
 �   +----------------------+   �
 �   �  Outer X-Line ring   �   �  ? AE-5 rail, z=0.3cm, w=0.8cm
 �   �  r=18cm, closed loop �   �     railSpeedBoost_cms2=200
 �   +----------------------+   �     closed=true, lapReward: spinBoost �1.1
 �        ? entry ramp          �  ? AE-43 Trampoline (faceAngle? tangent of ring)
 �       ? kickback wall save   �  ? AE-46 Kickback (catches ring-exit beys)
 �   CENTER  (arena floor)       �
 �                              �
 +------------------------------+
```

**Lab-style segment circuit (research track)**:
```
 Flipper ? Straight Rail A ? Curved Rail B ? Slingshot exit
   AE-44     AE-5 (20cm)       AE-5 (arc)      AE-45
    +----------------------------------------------+
    = one SpeedCircuit with 2 segments, 1 entryLink (flipper), 1 exitLink (slingshot)
    XD bey enters via flipper tangential kick ? rides A ? rounds curve B ? slingshot amplifies exit
    ? v_exit � v_flip � ?_xd � 1.3 (slingshot restitution)
```

### Beyblade Gimmick: XD Gear Engagement

```typescript
// In bit_parts (BX Bit config) � XD gear flag:
interface BitPartConfig extends PartConfig {
  xdGear:          boolean;          // has curved XD gear teeth
  xdGearTeeth:     number;           // tooth count (determines mesh spacing)
  xdCamLiftMs:     number;           // elevation duration (0 if no cam-lift)
  xdEtaEfficiency: number;           // gear mesh efficiency (0.0�1.0; curved=0.85)
  xdStat:          number;           // printed stat (10�80 based on gear size/design)
}

// MechanicRegistry: "railLock" handler � unified for both AE-5 and XD gear
// Key param added for XD:
interface RailLockParams extends MechanicParams {
  xdGearEngagement?: boolean;        // true = apply XD speedBoostFactor formula
  xdEtaEfficiency?:  number;         // from bit config
  xdCamLiftMs?:      number;         // triggers verticalImpulse sub-mechanic during lift
  segmentLength_cm:  number;         // for speedBoostFactor calculation
}
```

The `railLock` mechanic has ONE handler. The `xdGearEngagement` param triggers the XD-specific speed formula and the `verticalImpulse` sub-call (cam-lift). Without the param, it runs the standard rail lock. No separate handler needed.

### Trampoline ? Rail Chain

When a trampoline's `hardRedirect: true` and the bey's exit velocity vector is aligned with a rail entry within �15� (configurable: `railAlignmentTolerance_deg`), the `railLock` mechanic fires automatically at the trampoline exit:

```
Trampoline fires ? tangentialVelocityKick (v_exit, faceAngle)
                  ? v_exit aligns with rail entryDirection?
                  YES ? railLock fires immediately (bey starts on rail at t+1 tick)
                  NO  ? bey flies free until it contacts a rail ridge normally
```

This is configured via `SpeedCircuitLink.type: "trampoline"` � the circuit knows to watch for trampoline exits and auto-engage rail lock on alignment.

### Ridge vs Rail Distinction

| Feature | AE-5 Rail (X-Line) | Pier / Plank (AE-5 variant) | Arena Bowl Wall Ridge |
|---------|-------------------|----------------------------|----------------------|
| `railSpeedBoost_cms2` | 100�400 (high) | 0 (no boost) | 0 |
| `z_top_cm` | 0.2�0.4 | 0.5�0.8 | 0 (wall surface) |
| `width_cm` | 0.5�1.2 | 2.5�4.0 | n/a |
| XD engagement | Yes | No (too wide for gear mesh) | No |
| `detachForce_N` | 2�5 | 1 (easy to leave) | n/a |
| `heightProfile` | `"ridge"` | `"ridge"` (wider) | `"flat"` |

The key difference: an X-Line is narrow enough for XD gear mesh (`width_cm = 1.2`). A pier or plank is wider and provides a surface to ride, not a gear-mesh rail. The admin sets `width_cm` � the engine determines XD-eligibility from `width_cm = xdMaxRailWidth_cm` (default 1.2cm, configurable in `settings/game`).

### 2.5D Rendering (Speed Circuit)

- **Rail segments**: same as AE-5 `"ridge"` � thin stripe with specular highlight, `zToScreenOffset(0.3cm)`.
- **Active XD circuit**: when a bey is on the circuit, the rail glows in the bey's `slotColor` along the full circuit ahead of the bey � "trail glow" effect that shows the planned path.
- **Cam-lift elevation**: bey `z_cm = 0.3 + 0.2 = 0.5cm` during `xdCamLiftMs`. `zToScreenOffset(0.5)` applied � bey pops up slightly above rail in screen space. Duration: 20�50ms (1�3 frames at 60fps).
- **Lap completion**: flash the entire circuit in `slotColor` for 200ms, spawn particle burst at bey position.
- **Speed trail**: while on circuit at high speed, draw motion-blur trail (fading line of past positions in `arenaTiltInner`).

### Engine Requirements

1. **`SpeedCircuit` registered in `ArenaRegistry`** � circuits are part of the arena config, not separate elements. `ArenaConfig.speedCircuits?: SpeedCircuit[]`.
2. **Bey-on-circuit state**: `Beyblade.currentCircuitId?: string` and `currentSegmentIndex: number` � synced on `ArenaState`. Set when `railLock` fires on an XD circuit segment; cleared on exit.
3. **Entry link detection**: `ArenaFeatureProcessor` checks trampoline/flipper exit velocity alignment each tick for beys near circuit entry points.
4. **XD cam-lift sub-mechanic**: `railLock` handler with `xdCamLiftMs > 0` fires `verticalImpulse` sub-call at engagement time, then drops bey back to `z=0.3cm` after `xdCamLiftMs`.
5. **Lap detection**: when `currentSegmentIndex` wraps from `last` to `0` in a `closed=true` circuit, fire `lapReward`.
6. **No per-tick Firestore read**: Circuit configs loaded from `ArenaRegistry` at match start � zero Firestore reads during engagement.

---


---

## AE-50 � Beyblade Tilt, Arena Slope, and Gyroscopic Physics: Complete Mechanic Registry

> **`beyTiltAngle` is the central shared state variable** for all tilt effects. Every mechanic that changes a bey's orientation � bump, slope, wall ride, upper attack, arena tilt, trampoline, gravity flip � writes to `beyTiltAngle`. Every mechanic that stabilises orientation � gyroscopic correction, C3 symmetry, bearing tip, high spin � writes opposing corrections. This section documents the full system.

---

### beyTiltAngle � Definition and Physics

```typescript
// On Beyblade schema (Colyseus-synced):
beyTiltAngle:     number;   // current tilt from vertical, degrees. 0=perfectly upright; 90=lying flat
tiltDirection:    number;   // azimuth of tilt lean (0�360�); which way the bey is leaning
spin:             number;   // current spin rate, rad/s
I_total:          number;   // total moment of inertia, kg�m�
CoM_z:            number;   // centre of mass height above floor, cm
```

**Tilt stability ratio** (gyroscopic precession resistance):
```
G_stability = (I_total � spin) / (mass_kg � g_cms2 � CoM_z_cm)
// G > 1.0  ? strongly gyroscopically stable; hard to tilt
// G 0.4�1.0 ? moderately stable; tilt changes possible under force
// G < 0.4  ? unstable; nutation wobble begins (matches CLAUDE.md threshold of 40% maxSpin)
```

**Tilt decay (gyroscopic self-correction)** � per tick when no tilt-changing force is applied:
```
d(beyTiltAngle)/dt = -(beyTiltAngle � G_stability � tiltDecayRate)
// At high spin: fast recovery back toward 0�
// At low spin: slow recovery; tilt persists; nutation can build
tiltDecayRate = 0.08  (configurable in settings/game)
```

**Nutation wobble onset** � `G_stability < 0.4` (spin below 40% of maxSpin):
```
wobble_force = PRNG(matchId_seed) � wobbleAmplitude � (1 - stability) � mass_kg � g
// Applied as random lateral force each tick � seeded PRNG (deterministic)
// C3+ symmetry: ?_I = 0 ? nutationForcing = 0 (suppressed entirely)
// C2 symmetry: ?_I > 0 ? nutationForcing active; wobble builds as spin decays
```

---

### Complete Tilt-Change Mechanic Sources

Every source that modifies `beyTiltAngle`:

| Source | Mechanic ID | ? beyTiltAngle | Condition |
|--------|-------------|----------------|-----------|
| **Bump contact** | `tiltChange` | `+popTilt_deg` (typically +8�15�) | Bey centre within bump radius |
| **Slope (floor zone, slow speed)** | `slopeGravity` + `tiltChange` | Gradual: `+slopeAngle � (1 - v/v_escape) � dt � 0.02` | Bey speed < escape velocity on slope |
| **Slope (floor zone, fast speed)** | `slopeGravity` only | `0` tilt change (fast enough, no lean) | Bey speed = `v_escape` |
| **Arena tilt (global)** | `arenaTilt` | `+tiltAngle � sin(approachAngle) � 0.01 � dt` | Slow beys lean into arena tilt axis |
| **Upper attack contact** | `upperLaunch` | `+slopeAngle_deg � 0.5` to target | Target bey takes `F_upper` upward |
| **Wall contact (steep wall = 60�)** | `wallRide` | `+wallAngle � lean_factor` | Bey climbing steep bowl wall |
| **Trampoline (angled)** | `tiltChange` | Set to `faceAngle_tilt_deg` (absolute) | `hardRedirect: true` |
| **Gravity flip (override)** | `movementOverrideBey` | `+180�` (inverted; bey upside-down) | `BeyMovementOverride.type = "gravity_flip"` |
| **Whirlpool centrifugal** | `orbitBoost` + `tiltChange` | `+O � r � 0.003 � dt` (leaning outward) | Bey inside whirlpool radius |
| **High-speed corner (rail curve)** | `railLock` centripetal | `+v�/R � mass � lean_factor � dt` | Bey on curved rail segment |
| **QTE upper launch** | `upperLaunch` (QTE variant) | `+15�25�` (stronger than ambient) | QTE success on upper-attack hit |
| **Flipper tangential kick** | `tangentialVelocityKick` | `+tiltKick_deg` (configurable) | Contact with flipper at peak angle |

---

### Tilt-Stabilisation Mechanic Sources

Every source that REDUCES `beyTiltAngle`:

| Source | Mechanic ID | ? beyTiltAngle | Condition |
|--------|-------------|----------------|-----------|
| **Gyroscopic correction (natural)** | `tiltDecay` | `-(tiltAngle � G_stability � tiltDecayRate)` | Always on per tick |
| **C3+ fold symmetry** | `nutationSuppression` | `nutationForcing = 0` (wobble prevented) | Part has `foldSymmetry = 3` |
| **Bearing tip (free-spin)** | `freeSpin` | Reduces tilt-from-collision (angular impulse not transmitted to body) | Tip has `freeTip: true` |
| **Flat tip** | passive | Low contact radius ? low torque from floor friction ? less tilt accumulation | Flat tip: `r_tip_cm = 0.2` |
| **Gyro Anchor special move** | `freeze_step` override | Sets `beyTiltAngle ? 0` and locks it for `durationMs` | Player activates Gyro Anchor |
| **Spin recovery (orbital)** | `orbital_lock` override | While orbiting at radius, centrifugal effect reduces lean | `movementOverrideBey(orbital_lock)` |
| **Heavy disc (high I_total)** | passive | Higher `G_stability` for same spin ? slower tilt accumulation | High-mass disc: large `I_kgm2` |
| **Low CoM_z** | passive | Lower `CoM_z_cm` ? higher `G_stability` ? better tilt resistance | Wall Frame, low-profile disc |

---

### Slope Gravity � Full Physics

**Floor zone slope** (`AE-2` with `slopeAngle_deg > 0`):

```
g_lat_cms2 = g_cms2 � sin(slopeAngle_rad)
// g_cms2 = 981 cm/s�
// slopeAngle = 25�  ?  g_lat = 981 � sin(25�) = 414.5 cm/s� = 4.145 m/s�  (Black Sea Bowl bank)
// slopeAngle = 15�  ?  g_lat = 254 cm/s�
// slopeAngle = 35�  ?  g_lat = 563 cm/s�

// Applied per tick as force in slopeDirection:
F_slope = mass_kg � g_lat_cms2 � 0.01   (convert cm/s� ? m/s�)
applyForce(bey, F_slope, slopeDirection_angle)
```

**Escape velocity** (minimum speed to maintain position on slope):
```
v_escape_cms = sqrt(g_lat_cms2 � arenaRadius_cm)  [circular orbit approximation]
// Black Sea Bowl bank (r=70�80cm, g_lat=414 cm/s�):
// v_escape = sqrt(414 � 75) = sqrt(31050) = 176 cm/s
// (Earlier worked example used 91 cm/s � that was the minimum to not slide backward;
//  176 cm/s is the orbital escape for a circular path at mid-bank r=75cm.)
// Correction: v_escape_cm_per_s at r=75cm = sqrt(g_lat � r) = sqrt(414.5 � 75) � 176 cm/s
```

**Beyblade tilt on slope** (slow bey leaning into slope):
```
if bey.speed < v_escape � 0.5:
    tiltIncrementPerTick = slopeAngle_deg � (1 - bey.speed / (v_escape � 0.5)) � 0.02
    bey.beyTiltAngle += tiltIncrementPerTick
    bey.tiltDirection  = slopeDirection_angle   // leans downhill
```

**Beyblade gimmick cross-reference � slope mechanic**:
- `wallRide` gimmick: bey intentionally rides steep slopes (bowl wall at 70�90�). High-attack beys use this to gain approach height. Mechanic: `slopeGravity` reversed (centrifugal from orbital motion exceeds gravity component ? net force pushes bey INTO wall).
- `Orbital_lock` movement override: bey circles at radius where `F_centrifugal = F_slope` ? stable orbit in any slope zone.
- DB High/Low mode: shifts `CoM_z` � Low mode (CoM lower) = better slope resistance. High mode (CoM higher) = worse slope resistance but better aerial contact.

---

### Arena Tilt � Complete Mechanic Documentation

**`computeTiltForce`** (`server/shared/physics/ArenaUtils.ts`):
```typescript
function computeTiltForce(bey: Beyblade, arena: ArenaState): Force2D {
  const tiltRad     = arena.tiltAngle * Math.PI / 180;
  const dirRad      = arena.tiltDirection * Math.PI / 180;
  const magnitude   = Math.sin(tiltRad) * 0.04 * bey.mass_kg;
  // At 0�: sin(0)=0 ? no force. At 90�: sin(90)=1 ? max. At 180�: sin(180)=0 ? no force
  // BUT at 180� gravity reverses ? normal force inverts ? handled separately (Zero-G)
  return {
    x: magnitude * Math.cos(dirRad),
    y: magnitude * Math.sin(dirRad),
  };
}

function advanceArenaTilt(arena: ArenaState, dt: number): void {
  if (!arena.autoTilt) return;
  arena.tiltDirection = (arena.tiltDirection + arena.tiltSpeed * dt / 1000) % 360;
}
```

**Tilt angle physics breakdown by angle:**

| tiltAngle | Description | Physics effect |
|-----------|-------------|---------------|
| 0� | Flat (normal) | No lateral force. `F_tilt = 0`. |
| 30� | Tilted (shallow) | `F_tilt = sin(30�) � 0.04 � m = 0.02m`. Mild drift toward downhill side. |
| 60� | Steep | `F_tilt = sin(60�) � 0.04m = 0.0346m`. Strong pull; slow beys accumulate tilt. |
| 90� | Wall-ride | `F_tilt = 0.04m` (maximum). Beys orbit or slide along wall. `beyTiltAngle` approaches 90� for stationary beys. |
| 120� | Past-vertical | `F_tilt = sin(120�) � 0.04m = 0.0346m` � same as 60� but force direction is now partly "up" (reduced normal force on floor). |
| 150� | Near-inverted | `F_tilt = sin(150�) � 0.04m = 0.02m` inward. Beys press harder against floor (increased normal force on a physical tilted table). |
| 180� | Zero-G / Inverted | `F_tilt = 0` (sin(180�)=0) BUT gravity direction reversed. Normal force inverts. **See Zero-G section below.** |
| 270� | Wall-ride (opposite) | Same as 90� but downhill side is flipped. |

**Arena tilt as beyblade gimmick** � `arenaTiltShift` mechanic (AE-48):
- A special move that pushes `ArenaState.tiltAngle` toward a target value for `durationMs`
- Examples: Dranzer Spiral Tornado pushes tiltAngle to 60� + autoTilt=true for 5s ? spinning tilted bowl
- Driger Steel-Saber could lock tiltDirection toward a specific wall, forcing all beys to drift there

---

### Zero-G / Inverted Gravity (tiltAngle = 180�)

**Physics**: At exactly 180�, the arena is inverted. Gravity now points "up" relative to the arena plane. Floor and ceiling swap. Normal force (N = m�g�cos(tiltAngle)) reverses direction.

```typescript
// In physics tick � Zero-G detection:
const isZeroG = Math.abs(arena.tiltAngle - 180) < 5;  // within 5� of inversion
const isInverted = arena.tiltAngle > 90 && arena.tiltAngle < 270;

if (isInverted) {
  // Gravity component pushes bey away from floor (toward arena ceiling)
  // Normal force: N = m � g � |cos(tiltAngle_rad)|
  // At 180�: cos(180�) = -1 ? N = -m�g (pushes UP from floor)
  // Practical effect: bey presses against the TOP of the arena bowl (ceiling)
  // Floor friction still applies but at reduced N (inverted normal)
  // Beyblades orbit the "ceiling" instead of the floor
  const normalForce = bey.mass_kg * G_CMS2 * Math.abs(Math.cos(tiltAngle_rad));
  spinDecayRate     = (tipMu * normalForce * tipRadius_cm) / I_total;
  // At 180�: normalForce = m�g (same magnitude, just inverted) ? same spin decay rate
}
```

**Zero-G arena behaviour**:
- Ring-out condition inverts: beys that "fall UP" (hit ceiling with enough force) are ring-out
- `eliminationRadius_cm` still applies but check is against ceiling contact, not floor exit
- Floor zones have no effect (beys not touching floor)
- Turrets on floor aim upward; turrets on ceiling aim downward (normal arena orientation is now inverted)
- Bumps on ceiling pop beys downward (toward floor) � unusual defensive mechanic
- Special moves that normally launch upward (`upperLaunch`) now push bey toward floor (still effective)

**Zero-G as beyblade archetype**: Lucifer/Lucius bey types specifically designed for inverted-gravity arenas. Their `CoM_z` is optimised for ceiling contact (higher CoM = better ceiling contact = lower in inverted world). `gravity_flip` movement override (AE-48 Cat 9) mimics Zero-G for one bey without changing the whole arena.

---

### Wall Ride � Steep Bowl Wall Mechanic

**Condition**: Bey reaches arena wall (r = `arenaRadius_cm`). Bowl wall angle `wallAngle_deg` from `bowl_profile_defs`:
- `wallAngle < 45�`: Gentle slope. Bey slides back down. `beyTiltAngle` increases slightly then corrects as bey returns to floor.
- `wallAngle 45�75�`: Moderate wall. Bey can briefly ride if orbital speed is high enough. Tilt increases toward `wallAngle`. Returns to floor within 1�2 seconds.
- `wallAngle = 75�` (wall-ride): Bey can orbit the wall surface. `beyTiltAngle � wallAngle`. Centrifugal force balances gravity component along the wall: `F_centrifugal = m � v� / r_wall`. Bey remains on wall as long as `F_centrifugal = m � g � sin(wallAngle)`.

```typescript
// wallRide mechanic � fires when bey contacts wall and wallAngle = wallRideThreshold_deg
function wallRide(bey: Beyblade, wall: ArenaWall, v_orbital: number): void {
  const wallRad  = wall.wallAngle_deg * Math.PI / 180;
  const F_c      = bey.mass_kg * v_orbital * v_orbital / wall.radius_cm * 100;  // cm/s� ? m/s�
  const F_g_wall = bey.mass_kg * G * Math.sin(wallRad);
  
  if (F_c >= F_g_wall) {
    // Bey stays on wall
    bey.beyTiltAngle = wall.wallAngle_deg;   // tilt matches wall angle
    // Contact physics: �_k = wall.wallMaterialMu; normal force = m � (F_c - F_g_wall) / g_normalised
    // Spin decay from wall contact (different formula: perpendicular contact, not floor)
    const wallSpinDecay = (wall.wallMu * F_c) / bey.I_total;
    bey.spin -= wallSpinDecay * dt;
  } else {
    // Not enough speed; bey slides back down
    bey.beyTiltAngle = Math.min(bey.beyTiltAngle, wall.wallAngle_deg * 0.7);
    applyForce(bey, F_g_wall - F_c, "inward");
  }
}
```

**Wall-ride as beyblade gimmick source**: Attack-type beys with high `v_orbital` deliberately enter wall-ride to gain momentum then descend onto opponent. Mechanic used: `wallRide` + `linearImpulse` on descent. The descent velocity `v_descent = sqrt(2 � g � h_wall_cm)` � a bey dropping from the full wall height of 8cm gains `v_descent = sqrt(2 � 981 � 8) � 125 cm/s` added to its orbital velocity.

---

### Nutation Forcing � C2 vs C3 Symmetry

**?_I** (asymmetric inertia component) drives nutation:
```
For a part with foldSymmetry = 2 (C2):
  ?_I = I_xx - I_yy  (difference in principal moments in the equatorial plane)
  If ?_I > 0: nutationFreq = ?_I � ?_spin / I_total  (wobble rate proportional to spin)
  nutationForce per tick = ?_I � ?_spin � random_direction (PRNG-seeded)

For foldSymmetry = 3 (C3+):
  I_xx = I_yy by symmetry ? ?_I = 0 ? nutationForcing = 0  (perfectly stable plane rotation)
```

| foldSymmetry | ?_I | Nutation | Example parts |
|-------------|-----|---------|---------------|
| 2 (C2) | > 0 | Active; PRNG wobble at low spin | Most 2-blade layers, 2-prong discs |
| 3 (C3) | = 0 | Suppressed entirely | Unicorno II 4D CW, 3-wing tracks |
| 4 (C4) | = 0 | Suppressed | 4-blade layers (Valkyrie, Pegasus) |
| 6+ (C6+) | = 0 | Suppressed | 6-prong discs |
| Irregular | Computed | Partial suppression | Custom fusion stacks |

**Engine**: `GimmickRegistry` stores `foldSymmetry` per part. Assembly builder computes effective assembly fold symmetry as `gcd(all part fold symmetries)`. If `effectiveFoldSymmetry = 3` ? `nutationForcing = 0`. If any part is C2 ? wobble applies.

**Beyblade builder implication**: Mixing a C3 CW with a C2 Fusion Wheel gives effective `gcd(3,2) = 1` ? irregular ? wobble applies. Matching C3 CW + C3 AR (rare) ? full nutation suppression at all spin values.

---

### Complete Mechanic ID table � Tilt/Slope/Gyro additions to AE-48

Append these rows to the AE-48 mechanic mapping table:

| Mechanic ID | AE elements | Beyblade gimmick types | Description |
|-------------|-------------|----------------------|-------------|
| `slopeGravity` | AE-2 Floor Zone with `slopeAngle_deg > 0`, AE-14 Arena Tilt | `wallRide` gimmick, orbital-approach attack type | `F = m � g � sin(slopeAngle)` lateral per tick in `slopeDirection` |
| `tiltDecay` | AE-14 (auto-applied on all beys per tick) | C3+ symmetry parts (`nutationSuppression: true`), Bearing driver, Gyro Anchor | Gyroscopic self-correction toward `beyTiltAngle = 0` |
| `nutationForcing` | AE-14 (fires when `G < 0.4`) | C2 parts (?_I > 0), low-stamina beys at end of match | PRNG wobble force when tilt angle accumulates at low spin |
| `nutationSuppression` | � | C3+ fold symmetry parts (`foldSymmetry = 3`) | Sets `nutationForcing = 0` for this assembly |
| `wallRide` | AE-1 Arena Wall with `wallAngle = 75�`, steep bowl profiles | Attack-type wall-orbit approach gimmick | Bey rides steep wall; `beyTiltAngle = wallAngle`; descent gives `v_descent` bonus |
| `gyroscopicStability` | � (computed, not explicitly triggered) | Heavy disc + high spin combinations, `Gyro Anchor` special move | `G = I � ? / (m � g � CoM_z)` � governs tilt resistance of all beys |
| `zeroGravity` | AE-14 at `tiltAngle = 180�`, `gravity_flip` movement override | Lucifer/Lucius archetype, `gravity_flip` movement override | Inverts normal force; beys press against ceiling; ring-out condition flips |
| `arenaTilt` | AE-14 Arena Tilt System (global, per tick) | `arenaTiltShift` special move (AE-48) | `F_lateral = sin(tiltAngle) � 0.04 � m` in `tiltDirection` |
| `centrifugalLean` | AE-5 Rail curved segment, whirlpool AE-7 | High-speed orbital attack (Valkyrie flash strike) | `beyTiltAngle += v� / R � lean_factor � dt` on curves |

---

### Tilt Summary: What the Engine Must Maintain Per Tick

```typescript
// Per-tick tilt system � runs AFTER physics, BEFORE broadcast:

function applyTiltSystem(bey: Beyblade, arena: ArenaState, dt: number): void {
  // 1. Gyroscopic stability ratio
  const G = (bey.I_total * bey.spin) / (bey.mass_kg * G_CMS2 * bey.CoM_z);

  // 2. Tilt decay (self-correction toward upright)
  if (bey.beyTiltAngle > 0.1) {
    bey.beyTiltAngle -= bey.beyTiltAngle * G * TILT_DECAY_RATE * dt;
  }

  // 3. Arena tilt contribution (slow lean for stationary/slow beys)
  if (bey.speed_cms < 50) {
    const F_tilt = computeTiltForce(bey, arena);
    bey.beyTiltAngle += Math.abs(F_tilt.magnitude) * (1 - bey.speed_cms / 50) * 0.005 * dt;
  }

  // 4. Slope tilt (if in sloped floor zone)
  const zone = getZoneAtBeyPosition(bey, arena);
  if (zone?.slopeAngle_deg > 0 && bey.speed_cms < getZoneEscapeVelocity(zone)) {
    bey.beyTiltAngle += zone.slopeAngle_deg * (1 - bey.speed_cms / getZoneEscapeVelocity(zone)) * 0.02 * dt;
    bey.tiltDirection = zone.slopeDirection;
  }

  // 5. Nutation forcing (if G < threshold and C2 part in assembly)
  if (G < 0.4 && bey.assembly.effectiveFoldSymmetry < 3) {
    const wobble = (PRNG() - 0.5) * WOBBLE_AMPLITUDE * (1 - G / 0.4);
    applyForce(bey, wobble, PRNG() * 360);
  }

  // 6. Zero-G inversion (if arena near 180�)
  if (Math.abs(arena.tiltAngle - 180) < 5) {
    applyZeroGravity(bey, dt);
  }

  // 7. Clamp
  bey.beyTiltAngle = Math.max(0, Math.min(90, bey.beyTiltAngle));
}
```

All tilt sources write to `beyTiltAngle` (a single float) and obey the same clamp (0�90�). The renderer reads `beyTiltAngle` once per frame and adjusts the bey sprite foreshortening accordingly � a tilted bey appears as a narrower ellipse in 2.5D.

---

### 2.5D Rendering: Tilt Angle ? Sprite Foreshortening

```typescript
// Tilted bey sprite rendering (inside arenaTiltInner):
// beyTiltAngle = 0�  ? full circle (radius = bey.radius_cm � PX_PER_CM)
// beyTiltAngle = 45� ? ellipse (scaleY = cos(45�) = 0.707 of normal)
// beyTiltAngle = 90� ? flat line (scaleY = cos(90�) = 0)

function renderBeyWithTilt(bey: Beyblade, container: PIXI.Container): void {
  const tiltRad = bey.beyTiltAngle * Math.PI / 180;
  container.scale.y = Math.cos(tiltRad);       // foreshortens bey vertically when tilted
  container.scale.x = 1.0;                     // x-axis unchanged by tilt
  // Tilt direction: rotates the foreshortening axis
  container.rotation = bey.tiltDirection * Math.PI / 180;
  // After setting scale: re-apply rotation to orient the flattening correctly
  // (a bey leaning north-south flattens in the north-south screen axis, not east-west)
}
```

**Nutation wobble visual** � when `G < 0.4`: add small random rotation offset each frame drawn from PRNG with same seed as physics: `container.rotation += wobbleVisualAmplitude � (PRNG() - 0.5)`. Visual wobble matches physics wobble � no separate animation.

**Zero-G visual** � bey appears upside-down when `beyTiltAngle � 180�` (full inversion): sprite flips Y (`container.scale.y = -1`). The inverted bey's z-stack renders from ceiling level: `zToScreenOffset(arenaHeight_cm - bey.z_cm)`.

---


## AE-51 --- Admin/Player Interaction Model, Live Simulation, and Material Substitution Propagation

> **Purpose**: Describes how admins author and test part/gimmick configs; how players interact with gimmicks during battle; and how swapping a material (mu_k / e / rho) propagates through every derived physics value. This is the authoritative reference for Phase 2 admin UI simulation panels and the MaterialRegistry auto-propagation pipeline.

---

### 1. Admin Interaction Model

The admin workflow has three stages: **author -> simulate -> publish**. No code change is required to add a new part, gimmick, or mechanic combination --- everything flows through Firestore documents and is resolved at match start by the registry loader.

#### 1a. Authoring Flow

Every part type CRUD page follows the same save pipeline:

`
/admin/parts/<type>/new
  Fill PartConfig: name, mass_g, generation, system, partType
  Fill geometry: r_outer_cm, r_inner_cm, height_cm, foldSymmetry
  Add WingDef(s) via Wing Designer panel (count, shape, z range, movementType, material, attackType)
  Select gimmickIds[] -> links to gimmick_defs collection

  [Save] -> Firestore writes:
    PartConfig doc                     (parts/{partType}/{id})
    derived ContactPoint[] embedded    (from deriveContactPoints(wingDef) per WingDef)
    derived MechanicInstance[] embedded (from deriveWingMechanic(wingDef) per WingDef)
    computed I_kgm2                    (from mass_g + radii via parallel-axis theorem)
    computed spinDecay_params          (from tip mu_k + I_total at save time -- preview only)
`

**Gimmick authoring** (/admin/gimmick-defs/new):

Admin fills: id, label, triggerEvent (on_collision / on_spin_threshold / on_deploy / per_tick / on_launch), mechanics[] (ordered MechanicInstance[] -- each is { mechanicId, params }), compatiblePartTypes[], optional visualEffect (particlePresetId / animationPresetId).

The admin does NOT write mechanic handlers --- those are hardcoded in MechanicRegistry.ts. The admin only assembles gimmicks as ordered sequences of mechanic references with params.

**Special move authoring** (/admin/special-moves/new):

Admin fills: id, name, requiredPartType, optional requiredGimmickId, phases[] (ordered PhaseConfig[] -- each is duration_ms + mechanics[] in the same MechanicInstance format), qteDef (QTEConfig: timing window, input key, bonus on success), compatGate (JS expression evaluated against bey.layer config at runtime), beySpirit boolean (if true, BeySpirit override bypasses all physical limits).

Special moves are authored the same way gimmicks are (sequences of mechanic instances), but they also have phases, QTEs, and compat gates. The BeySpirit flag marks that mechanic params may exceed real physical limits (anime override).

---

#### 1b. Live Simulation Panel

Every part, gimmick, and special move editor has a **Simulate** button that opens a full-screen overlay:

`
+--------------------------------------------------------------------------+
|  SIMULATION PREVIEW                                          [X] Close   |
|--------------------------------------------------------------------------|
|  LEFT: 2.5D PixiJS canvas (tiltAngle=60, same renderer as production)   |
|  CENTER: Config Panel (live-editable mu_k, e, mass_g, r_outer_cm, etc.) |
|  RIGHT: Physics Timeline (mechanic fire events per tick)                 |
|--------------------------------------------------------------------------|
|  [Run] [Pause] [Reset]   [Arena: Classic Bowl]   Speed: 1x              |
|  OPPONENT: [None | Static Dummy | AI Medium | AI Hard]                   |
+--------------------------------------------------------------------------+
`

The simulation runs a headless physics tick loop (same tick(dt) as production) at configurable speed (1x / 5x / 50x). The part under edit is placed on a configurable default beyblade assembly. No Colyseus room --- runs entirely client-side in a Web Worker using shared physics utils. State is rendered through the same PixiRenderer.ts tilt chain as production. Uses the same MechanicRegistry, GimmickRegistry, and MaterialRegistry from preloaded configCache.

**Config Panel** (live-editable while simulation runs): Any field change immediately re-derives the affected physics values without saving to Firestore. A diff panel shows "was X -> now Y" for each derived value that changed.

**Physics Timeline** (right panel): Scrolling list of mechanic fire events per simulated tick. Color-coded: green = fired, yellow = condition checked but not met, red = params error.

**Export**: Admin can download the current PartConfig + GimmickDef as JSON and re-import into the real form. This is the "test before seed" workflow.

---

#### 1c. What-If Panel (Material Substitution Preview)

Inside the Simulate panel, a Material Substitution sub-panel lets admin swap any MaterialId on any WingDef and see the propagated changes instantly (without saving):

`
Material Substitution
-------------------------------------------------------------------
Contact Material: [ABS]  ->  [Zinc Alloy]

Derived change preview:
  spinDecayRate:        8.32 rad/s2  ->  8.32 rad/s2   (no change -- tip controls decay)
  damageMultiplier:     1.0x  ->  1.5x   (metal dmgMult from MaterialRegistry)
  contactRestitution:   0.67  ->  0.80   (e from MaterialRegistry)
  collision impulse J:  1.84 Ns  ->  2.21 Ns  (+20.1%)
  contactDeflect eff:   38%  ->  29%    (lower deflect due to higher e)
  burstResist:          unchanged       (spring alpha, not contact material)
  upperLaunch F_upper:  4.3 N  ->  5.2 N  (scales with J via e)

[Apply to simulation]   [Cancel]
`

"Apply to simulation" runs physics forward with the new material so the admin can watch the difference in the canvas. Nothing is saved to Firestore until admin explicitly saves the part.

---

### 2. Player Interaction Chain

The complete path from a key press to a physics effect, for every input type.

#### 2a. Normal Movement Input

`
keydown event (window.addEventListener -- global, no canvas click required)
  -> useGameInput.ts: OR bitmask bit into uint16
  -> Colyseus client.send("input", uint16mask) every frame or on change
  -> Server: BattleRoom.onMessage("input", (client, mask))
  -> decodeBitmask(mask) -> { moveLeft, moveRight, moveUp, moveDown, attack, defense, dodge, jump, chargeHeld, specialTap }
  -> InputHandler.applyInput(bey, decoded, dt)
  -> Matter.js Body.applyForce(bey.body, direction * inputForce) -- additive only, never sets velocity directly
  -> physics tick resolves -> state broadcast at 60 Hz
  -> Colyseus state sync -> PixiRenderer reads new bey.x, bey.y, bey.spin, bey.beyTiltAngle
  -> PixiRenderer.renderBey(bey) -> canvas update
`

#### 2b. Combo Input Chain

`
[Player: three-key sequence within windowMs]
  -> useGameInput.ts records key history as ring buffer: [{ key, timestamp }]
  -> Every input: comboSystem.detectCombo(inputHistory, bey.comboIds)
    checks: sequence match, windowMs, power >= costThreshold, per-combo cooldown
    if matched: return comboId
  -> client.send("combo", { comboId, timestamp })
  -> BattleRoom.onMessage("combo"):
    re-validates: bey.comboIds includes comboId, power >= cost, cooldown cleared
    comboConfig = ComboRegistry.get(comboId)  [synchronous -- preloaded registry]
    MoveExecutor.executeMoveWithConfig(comboConfig.moveConfig, ctx)
    MechanicRegistry.get(mechanicId).handler(ctx, params)
    physics writes: addForce, spinDelta, statusEffect, etc.
  -> deduct power, set cooldown
`

#### 2c. Gimmick Trigger Chain (physics-driven, no player input required)

`
[Physics tick -- server-side]
  GimmickProcessor.processGimmicks(bey, ctx, dt):
    for each gimmickId in bey.activeGimmickIds:
      gimmickDef = GimmickRegistry.get(gimmickId)  [synchronous -- preloaded registry]
      evaluate triggerEvent:
        "per_tick"          -> always fire
        "on_collision"      -> fire only if ctx.collisionOccurredThisTick
        "on_spin_threshold" -> fire only if bey.spin >= gimmickDef.spinThreshold_rads
        "on_deploy"         -> fire only when bistable flag transitions false->true
        "on_launch"         -> fire once at match start
      if condition met:
        for each mechanic in gimmickDef.mechanics[]:
          handler = MechanicRegistry.get(mechanic.mechanicId)
          materialMods = resolveMaterialModifiers(mechanic.params.materialId)
          elemMult = resolveElementMultiplier(bey.elements, ctx.opponentElements)
          result = handler.onActivate(ctx, { ...mechanic.params, ...materialMods }, elemMult)
          applyResult(bey, result)
`

#### 2d. Special Move Chain

`
[Player: specialTap input while power >= specialMove.powerCost]
  client.send("special-move-attempt", {})
  BattleRoom: validates bey.power, cooldown, compatGate
    compatGate eval: e.g. "layer.bladeCount === 2 && layer.bladeRadius_cm >= 3.5"
    if beySpirit: bypass compatGate check
  SpecialMoveProcessor.beginMove(bey, specialMoveDef, ctx):
    bey.activeSpecialMove = { defId, phase: 0, phaseStartedAt: now }
  Per tick during move:
    phase = specialMoveDef.phases[bey.activeSpecialMove.phase]
    if elapsed >= phase.duration_ms: advance to next phase or end
    for each mechanic in phase.mechanics[]:
      same chain as gimmick: MechanicRegistry handler -> applyResult
  QTE: if player sends "qte-tap" within qteDef timing window: apply bonus params
  Move end: clear bey.activeSpecialMove, set cooldown, deduct power
`

#### 2e. Arena Element -> Beyblade Effect Chain

`
[Per tick -- ArenaFeatureProcessor.applyArenaFeaturesPerTick(state, dt)]
  for each arena element in state.arenaElements:
    checkBeyInZone(bey, element)  [radial distance or polygon inside check, in cm]
    if inside AND element.active (switch check):
      feature = ArenaFeatureRegistry.get(element.featureId)  [synchronous -- preloaded registry]
      for each mechanic in feature.mechanics[]:
        MechanicRegistry.get(mechanicId).handler(ctx, params)
        same handler format as beyblade gimmicks
        identical physics write path
`

This is why AE-48 established the unified registry --- arena features and bey gimmicks use the exact same mechanic IDs, handler signatures, and produce identical physics results. The only difference is the caller.

---

### 3. Material Substitution Propagation

#### 3a. MaterialRegistry Entry Schema

`	ypescript
interface MaterialDef {
  id:        string;   // "abs", "zinc_alloy", "rubber", "hard_abs", "iron_powder_abs"
  label:     string;
  mu_k:      number;   // kinetic friction coefficient
  mu_s:      number;   // static friction coefficient
  e:         number;   // coefficient of restitution (COR) 0-1
  rho_gcm3:  number;   // density in g/cm3
  dmgMult:   number;   // contact damage multiplier (1.0 = ABS baseline; zinc = 1.5; rubber = 0.6)
  wearRate?: number;   // mu_k degradation rate per contact (0 = no wear)
  wearPresetId?: string; // links to wear_preset_defs for mu_k decay curve
}
`

Reference values:

| Material | mu_k | e | dmgMult | Notes |
|---|---|---|---|---|
| ABS | 0.17 | 0.67 | 1.0 | Baseline |
| Hard ABS | 0.17 | 0.67 | 1.0 | Same coefficients -- harder grade |
| Iron-powder ABS | 0.17 | 0.67 | 1.1 | Denser; I_kgm2 slightly higher for same geometry |
| Zinc alloy | 0.12 | 0.80 | 1.5 | More elastic + metal damage bonus |
| Rubber (attack) | 0.50-0.70 | 0.25 | 0.6 | High grip, low rebound, less damage |
| Steel bearing | 0.02 | 0.90 | 0.3 | Near-frictionless pivot; minimal damage |

#### 3b. Propagation Map

| Derived Value | Formula | MaterialDef field | Which part |
|---|---|---|---|
| spinDecayRate | (mu_k x mass_g x g x r_tip) / I_total | mu_k | **Tip only** |
| collisionImpulse J | m_eff x Dv x (1 + e) | e | Striking part |
| damageDealt | J x contactPoint.dmgMult | dmgMult | Striking part |
| deflectDmgReduction | 1 - (e x pivotEfficiency) | e | Struck surface |
| railSpeedBoost effective | railBoost_cms2 x mu_k | mu_k | **Tip only** |
| restitutionBoost param | direct e reference | e | Arena wall material |
| freeSpin decoupling | ~1/(1 + e) | e | Free-spin ring material |
| upperLaunch F_upper | F_N x sin(a); F_N from J | e (via J) | Striking part |
| wearDegradation | mu_k(t) = mu_k_0 x (1 - wearRate x contacts) | wearRate | Any worn surface |
| burstResist | Spring alpha (WingDef bistable) | NOT material | Geometry/spring only |
| nutationForcing DI | I_xx - I_yy from geometry | NOT material | Geometry only |
| elementDmgMult | Element interaction matrix | NOT material | Element type only |

#### 3c. Auto-Propagation on Material Change

`	ypescript
function onMaterialChanged(partConfig: PartConfig, newMaterialId: string, wingDefId?: string): DerivedPartConfig {
  const newMat = MaterialRegistry.get(newMaterialId);

  // 1. Update ContactPoint dmgMult for affected wing's contact points
  const updatedCPs = partConfig.contactPoints.map(cp => {
    if (!wingDefId || cp.wingDefId === wingDefId) {
      return { ...cp, dmgMult: newMat.dmgMult, material: newMaterialId };
    }
    return cp;
  });

  // 2. Re-derive mechanic params that reference material
  const updatedMechanics = partConfig.mechanics.map(m => {
    if (m.mechanicId === "contactDeflect" && (!wingDefId || m.wingDefId === wingDefId)) {
      const newReduction = 1 - (newMat.e * 0.6);  // 0.6 = pivot efficiency constant
      return { ...m, params: { ...m.params, deflectDmgReduction: newReduction } };
    }
    if (m.mechanicId === "restitutionBoost" && (!wingDefId || m.wingDefId === wingDefId)) {
      return { ...m, params: { ...m.params, restitution: newMat.e } };
    }
    if (m.mechanicId === "freeSpin" && (!wingDefId || m.wingDefId === wingDefId)) {
      const newDecoupling = Math.min(0.95, 1 - newMat.e * 0.3);  // softer = better decoupling
      return { ...m, params: { ...m.params, spinDecouplingFactor: newDecoupling } };
    }
    return m;
  });

  // 3. If tip part -- store mu_k as tipMaterialFactor for assembly resolveStack
  let spinDecayParams = partConfig.spinDecayParams;
  if (partConfig.partType === "tip") {
    spinDecayParams = { ...spinDecayParams, tipMaterialFactor: newMat.mu_k };
  }

  return { ...partConfig, contactPoints: updatedCPs, mechanics: updatedMechanics, spinDecayParams };
}
`

**What does NOT propagate at single-part level** (requires full assembly re-resolve at match start via resolveStack()):
- spinDecayRate absolute value -- needs I_total from assembly
- I_kgm2 from density swap -- if rho_gcm3 changes mass_g, deriveInertia() re-runs, then assembly re-sums

**Key rule**: At the part level, only dmgMult, e, and mu_k propagate immediately. I-based values require the full assembly context and are always re-derived fresh by resolveStack() at match start. This is why the admin simulation panel always resolves the full assembly when running physics -- it never uses partial part-level derivations.

#### 3d. Which Gimmick Params Change When Material Changes

| Gimmick | Mechanic | Param affected |
|---|---|---|
| compound_beak_slope | smashImpact | dmgMult = MaterialRegistry.get(materialId).dmgMult |
| upper_omnidirectional | upperLaunch | Indirect via J; F_upper = J x sin(a); no direct param to update |
| eternal_defence_free_spin | freeSpin | spinDecouplingFactor scales with 1/(1+e) |
| individual_wing_deflect | contactDeflect | deflectDmgReduction = 1 - (e x pivotEfficiency) |
| motor_spin_boost | staminaRecovery | None -- motor params are mechanical, not material-dependent |
| choz_awakening | burstSuppress | None -- burst stopper is spring/geometry |
| c3_inertia_isotropy | naturalMotion | None -- foldSymmetry and DI are geometry-only |

---

### 4. Simulation Scenarios

The simulation panel covers 7 test scenarios (selectable from a dropdown):

| Scenario | Tests | Key metric |
|---|---|---|
| Solo Spin Decay | Bey spins down from w0=600 rad/s; no opponents | t_stable in seconds |
| vs Static Dummy | Bey contacts stationary dummy at r=8cm repeatedly | J_per_hit, dmgMult_effective |
| Gimmick Fire Rate | Counts mechanic fires per second at w=400 rad/s | mechanics_per_sec per handler |
| Tilt Recovery | Bey starts at beyTiltAngle=45; measures recovery to < 5 deg | tilt_recovery_ticks |
| Rail Ride Speed | Bey enters 30cm straight rail; measures exit vs entry speed | speedBoostFactor |
| Material Swap A/B | Side-by-side run of two material configs for same scenario | Overlay comparison chart |
| Arena Element Stress | Bey enters spin zone, gravity well, turret zone in sequence | statusEffects[] triggered + duration |

Each scenario runs in headless mode (Web Worker) at 50x speed. Results shown as line charts (spin decay) or bar charts (gimmick fire rate, damage).

---

### 5. Key Rules Summary

1. **Material affects contact physics; gimmick logic is geometry-driven.** Swapping ABS->metal changes how hard a hit lands (e, dmgMult) but does not change whether upper-launch fires (that depends on slopeAngle_deg and contact arc in WingDef geometry).

2. **Tip material is the only material that affects spin decay rate.** No other part's material affects spinDecayRate. The tip's mu_k is the sole floor-friction input to dw/dt = -(mu_k x m x g x r_tip) / I_total.

3. **Gimmick params are written at save time** based on the material at that moment. If admin changes a part's material after a gimmick is bound, re-save the part to trigger re-derivation. The Simulate panel's Material Substitution preview always reflects the live change without saving.

4. **railLock speed boost scales with tip mu_k.** Changing a layer or disc material does not affect rail boost.

5. **freeSpin decoupling scales inversely with e (COR).** Rubber (e=0.25) on the free-spin ring absorbs angular impulse better than ABS (e=0.67). Admin tunes this via the ring's material on the WingDef.

6. **burstSuppress spring alpha is NOT material-dependent** -- it is a WingDef geometry param (bistable lock spring force). Material of layer blades does not change burst resistance.

7. **BeySpirit special moves override material-derived damage caps** -- the BeySpirit multiplier applies on top of all material and geometry calculations, uncapped.

8. **Arena mechanic handlers and beyblade gimmick handlers are the same functions.** An admin who creates a new mechanic_def for an arena element can immediately reference it in a bey gimmick -- no code duplication, no special-casing by caller.

---

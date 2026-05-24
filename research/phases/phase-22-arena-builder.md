[← Phase 21: Unified Foundation](phase-21-unified-foundation.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md) &nbsp;·&nbsp; [Phase 23: Preset Library →](phase-23-preset-library.md)

---

# Phase 22 — Modular Arena Builder: Multi-Level Arenas + Building Blocks

> **Stage 22** — Extends the arena system to support Hot Wheels Ultimate Garage–style multi-level arenas: multiple platforms/floors at different visual heights, connected by loops (banked circular tracks), elevators (portal teleports with animation), and ramps. Adds arena size expansion (up to 500 cm), player viewport cap, admin pan/zoom, minimap local-area view, and the modular section visual scaffolding system.
>
> All new physics behavior is expressed through the Phase 21 three-pillar system:
> - **GeometryDef** (Pillar 2) — `LoopTrackConfig.geometry` references `geometry_defs` for the circular track shape
> - **BehaviorDef** (Pillar 1) — `processLoopTracks()` is registered as a mechanic handler; `processElevationZones()` uses `mechanicRefs`
> - **StatDef** (Pillar 3) — `spinBoostOnPlatform` is a `StatModifier` applied to `beyblade.spin` while inside an ElevationZone
>
> **Alignment with existing systems:**
> - Multi-level physics uses the existing `beyFloorIndex` / `ArenaFloorGroup` / `ArenaLink` system already in `BattleRoom.ts`
> - Elevator teleports use the existing `PortalConfig` system with a new `subtype: "elevator"` flag
> - Loop tracks use SpeedPath orbital centripetal force + `beyTiltAngle` banking — NOT wall-climbing
> - `ElevationZoneConfig` already exists in types; this phase adds the server physics implementation

---

## 0. Engine Constraints (Non-Negotiable)

The physics engine is **2D Matter.js** (server) + **2.5D PixiJS rendering** (client). Multi-level arenas work within this:

| Concept | Implementation |
|---------|---------------|
| Multiple floors | Separate arena instances in an `ArenaFloorGroup`; `beyFloorIndex` gates which floor a bey is on |
| Ramps between floors | `ArenaLink` of type `"ramp"` — teleports bey to next floor entry point |
| Elevator between floors | `PortalConfig` with `subtype: "elevator"` — portal teleport + client animation |
| Loop track | Circular `SpeedPath` orbital with `beyTiltAngle` banking — viewed from above, looks like a banked ring |
| Loop visual | Camera is always top-down or back-of-bey. Loops are never seen as a vertical side-view circle. They appear as banked circular floor tracks — correct and expected. |
| Beyblades on different floors | Do NOT collide with each other. `beyFloorIndex` gates all cross-floor interactions. |
| Z-axis physics | NOT possible. All physics is 2D XY only. Height is visual via tilt perspective transforms. |

---

## 1. Arena Size Expansion

### 1.1 Size Constraints

| Property | Value |
|----------|-------|
| Maximum arena size | 500 cm × 500 cm |
| Minimum arena size | No hard minimum; real stadiums range 22–38 cm |
| Default/standard size | 30 cm (matching real-world Beyblade stadium scale) |
| Player viewport cap | 100 cm × 100 cm maximum visible area at any zoom level |
| Bey radius | 4 cm (10 cm diameter) |

The 500 cm maximum enables Hot Wheels garage–scale multi-floor arenas. Most competitive arenas remain 30–50 cm. The viewport cap means players in a 500 cm arena navigate by feel + minimap — they never see the whole arena at once.

### 1.2 New Constants in `shared/types/arenaConfigNew.ts`

```typescript
export const MAX_ARENA_DIMENSION_CM = 500;
export const DEFAULT_ARENA_DIMENSION_CM = 30;
export const PLAYER_VIEWPORT_MAX_CM = 100;  // camera zoom-out hard cap
```

### 1.3 Server: Dynamic Matter.js World Bounds

**File:** `server/physics/PhysicsEngine.ts`

Replace hard-coded `±2000px` world bounds with size-derived bounds at `setArenaConfig()` time:

```typescript
// Compute from arena config at setup time — must run before any bodies are added
const maxDim = Math.max(config.width, config.height) * PX_PER_CM * 1.2;
this.engine.world.bounds = {
  min: { x: -maxDim, y: -maxDim },
  max: { x: maxDim, y: maxDim },
};
```

At 500 cm with 24 px/cm: `maxDim = 500 × 24 × 1.2 = 14,400 px`. The broad-phase grid must cover this.

### 1.4 Client: Viewport Cap in Renderer

**File:** `client/src/game/renderer/PixiRenderer.ts`

Add a minimum zoom clamp so the player can never zoom out enough to see more than 100 cm:

```typescript
// In the zoom logic / camera update:
const VIEWPORT_MAX_CM = 100;
const PX_PER_CM = 24;
const MIN_ZOOM = canvasWidthPx / (VIEWPORT_MAX_CM * PX_PER_CM);
// clamp: zoom = Math.max(currentZoom, MIN_ZOOM)
```

Spectator zoom (CameraControls) is not affected — spectators may zoom further out to oversee the whole arena.

### 1.5 Admin: BasicsTab Slider Range

**File:** `client/src/components/admin/arena-tabs/BasicsTab.tsx`

- Width/height slider max: 50 → **500**
- Default value: 50 → **30**
- Add helper label showing meters: `"${value} cm = ${(value/100).toFixed(2)} m"`

### 1.6 Admin: ArenaPreview Pan/Zoom

**File:** `client/src/components/admin/ArenaPreview.tsx`

The admin preview canvas needs panning and zooming to work with large arenas:

| State | Type | Default | Range |
|-------|------|---------|-------|
| `zoomLevel` | `number` | `1.0` | `0.05–4.0` |
| `panOffset` | `{x: number, y: number}` | `{x:0, y:0}` | unbounded |

- **Wheel event** on canvas div: `zoomLevel *= (1 + deltaY × 0.001)`, clamped to range
- **Pointer drag** on canvas background (not on a feature): update `panOffset`
- **PIXI root container**: `scale.set(zoomLevel)`, `position.set(panOffset.x, panOffset.y)`
- **Corner overlay buttons**: `+` (zoom in ×1.25), `0` (reset to fit), `−` (zoom out ×0.8)

This is admin-only (editor UX). The in-game renderer has its own camera system and is unaffected.

### 1.7 Feature Tab Coordinate Range Audit

All arena feature tabs must support positions in a 500 cm arena (±250 cm from center):

| Tab | Fields to update | New range |
|-----|-----------------|-----------|
| ObstaclesTab | x, y | ±250 cm |
| TurretsTab | x, y | ±250 cm |
| PitsTab | x, y | ±250 cm |
| PortalsTab | x, y | ±250 cm |
| SpeedPathsTab | radius | 0–250 cm |
| FeaturesTab | x_cm, y_cm, radius_cm | ±250 cm / 0–250 cm |
| SwitchesTab | x, y | ±250 cm |
| PlatformsTab (new) | x_cm, y_cm | ±250 cm |

---

## 2. Hot Wheels Multi-Level Arena — Modular Sections

### 2.1 Concept

A multi-level arena is an `ArenaFloorGroup` (existing system) where:
- Each floor is a separate `ArenaConfig` (arena instance) with its own features
- Floors are connected by `ArenaLink` pairs (ramps, portals/elevators, trampolines)
- Visual scaffolding (`ModularSectionConfig`) marks the visual connectors between floors
- Loop tracks within a floor give the Hot Wheels feel without true vertical physics

### 2.2 New Type: `ModularSectionConfig`

Visual scaffolding placed on an arena — purely cosmetic, links to an ArenaLink for mechanics.

**File:** `shared/types/arenaConfigNew.ts`

```typescript
export type ModularSectionType =
  | "straight_tube"   // horizontal connector between two points
  | "curved_tube"     // 90° curved connector
  | "loop_tube"       // visual full-circle loop (linked to a SpeedPath beneath)
  | "elevator_shaft"  // vertical shaft (linked to elevator portal pair)
  | "ramp_section"    // angled slope (linked to ramp ArenaLink)
  | "scaffold_frame"  // decorative structural frame, no mechanics
  | "landing_pad";    // flat platform at a floor's entry/exit point

export interface ModularSectionConfig {
  id: string;
  type: ModularSectionType;
  x_cm: number;
  y_cm: number;
  rotation?: number;           // degrees (0–360)
  scale?: number;              // uniform scale multiplier (default 1.0)
  linkedArenaLinkId?: string;  // ties this visual to an ArenaLink in the FloorGroup
  linkedSpeedPathId?: string;  // for loop_tube — the underlying SpeedPath id
  color?: string;              // hex override, falls back to theme default
  textureId?: string;          // Firebase asset ID for custom skin
}
```

Add to `ArenaConfig`:
```typescript
modularSections?: ModularSectionConfig[];
```

### 2.3 New Type: `LoopTrackConfig`

A banked circular track on the arena floor. Physics: centripetal force + `beyTiltAngle` banking. Visual: annular ring (the loop floor seen from above).

```typescript
export interface LoopTrackConfig {
  id: string;
  x_cm: number;
  y_cm: number;
  radius_cm: number;           // loop circle radius (distance from center to track centerline)
  trackWidth_cm?: number;      // track width (default 4 cm = bey diameter)
  entryAngleDeg: number;       // angle where beys enter the loop (0=+X, 90=+Y)
  exitAngleDeg?: number;       // angle where beys exit (default entryAngleDeg + 180°)
  speedBoost?: number;         // velocity multiplier applied at entry (default 1.5)
  bankingDeg?: number;         // max beyTiltAngle while in loop (default 30°)
  mechanicRefs?: MechanicInstance[];  // Pillar 1: behavior overrides
  geometry?: GeometryRef;             // Pillar 2: shape override
  controlledBySwitchId?: string;
}
```

Add to `ArenaConfig`:
```typescript
loopTracks?: LoopTrackConfig[];
```

### 2.4 Elevator Portal Subtype

Extend existing `PortalConfig` (no new type needed):

```typescript
// Existing PortalConfig gains:
subtype?: "standard" | "elevator";
// "elevator" → triggers client-side vertical travel animation on floor transition
// Mechanics are identical to standard portal (beyFloorIndex changes via ArenaLink)
```

### 2.5 Unified Foundation Alignment

| New feature | Pillar 1 (Behavior) | Pillar 2 (Geometry) | Pillar 3 (Stat) |
|-------------|---------------------|---------------------|-----------------|
| `LoopTrackConfig` | `mechanicRefs: []` for entry speed boost mechanic | `geometry: GeometryRef` → ring shape in `geometry_defs` | — |
| `ElevationZoneConfig` | `mechanicRefs: []` for spinBoost mechanic while inside | `geometry: GeometryRef` → circle shape | `zoneModifiers: [{ stat: "bey.spin", mode: "add_per_tick", value: spinBoostOnPlatform }]` |
| `ModularSectionConfig` | — (visual only) | `textureId` references visual asset | — |

---

## 3. Server Physics: Completing ElevationZones + Adding Loop Tracks

### 3.1 `processElevationZones()` — `server/shared/rooms/ArenaFeatureProcessor.ts`

`ElevationZoneConfig` has been in the type system since Phase 10 but was never server-implemented. Fields: `x_cm`, `y_cm`, `radius_cm`, `heightCm`, `spinBoostOnPlatform`, `edgeDropForce`.

```typescript
function processElevationZones(
  beyblades: Map<string, BeybladeState>,
  zones: ElevationZoneConfig[],
  dt: number
): void {
  for (const bey of beyblades.values()) {
    if (!bey.isActive) continue;
    const bx = bey.x / (PX_PER_CM * PHYSICS_SCALE);
    const by = bey.y / (PX_PER_CM * PHYSICS_SCALE);

    for (const zone of zones) {
      const dx = bx - zone.x_cm, dy = by - zone.y_cm;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const wasInside = bey._prevElevZones?.has(zone.id);
      const isInside = dist <= zone.radius_cm;

      if (isInside && zone.spinBoostOnPlatform) {
        bey.spin = Math.min(bey.maxSpin, bey.spin + zone.spinBoostOnPlatform * dt);
      }
      if (wasInside && !isInside && zone.edgeDropForce) {
        // Apply radial outward impulse on exit
        const norm = dist === 0 ? 1 : dist;
        applyForce(bey.id, (dx / norm) * zone.edgeDropForce, (dy / norm) * zone.edgeDropForce);
      }

      // Track for next tick
      if (!bey._prevElevZones) bey._prevElevZones = new Set();
      isInside ? bey._prevElevZones.add(zone.id) : bey._prevElevZones.delete(zone.id);
    }
  }
}
```

Physics notes:
- Purely 2D — no Z axis changes
- `spinBoostOnPlatform` is applied per second (multiply by `dt` seconds)
- `edgeDropForce` is a one-shot impulse on the tick when a bey crosses the zone boundary outward

### 3.2 `processLoopTracks()` — `server/shared/rooms/ArenaFeatureProcessor.ts`

```typescript
function processLoopTracks(
  beyblades: Map<string, BeybladeState>,
  loopTracks: LoopTrackConfig[],
  dt: number
): void {
  for (const bey of beyblades.values()) {
    if (!bey.isActive) continue;
    const bx = bey.x / ..., by = bey.y / ...;

    // Check if bey should enter a loop
    if (!bey.loopTrackId) {
      for (const loop of loopTracks) {
        const entryRad = degreesToRadians(loop.entryAngleDeg);
        const entryX = loop.x_cm + Math.cos(entryRad) * loop.radius_cm;
        const entryY = loop.y_cm + Math.sin(entryRad) * loop.radius_cm;
        const trackW = loop.trackWidth_cm ?? 4;
        const dx = bx - entryX, dy = by - entryY;
        if (Math.sqrt(dx * dx + dy * dy) < trackW / 2) {
          bey.loopTrackId = loop.id;
          bey.loopAngleDeg = loop.entryAngleDeg;
          // Apply entry speed boost
          const boost = loop.speedBoost ?? 1.5;
          bey.vx *= boost; bey.vy *= boost;
        }
      }
    }

    // Apply centripetal force while in loop
    if (bey.loopTrackId) {
      const loop = loopTracks.find(l => l.id === bey.loopTrackId)!;
      // Advance angular position
      const speed = Math.sqrt(bey.vx ** 2 + bey.vy ** 2);
      const angularSpeed = speed / (loop.radius_cm * PX_PER_CM * PHYSICS_SCALE);
      bey.loopAngleDeg = (bey.loopAngleDeg + angularSpeed * dt * (180 / Math.PI)) % 360;

      // Centripetal: force toward loop center
      const ang = degreesToRadians(bey.loopAngleDeg);
      const targetX = loop.x_cm + Math.cos(ang) * loop.radius_cm;
      const targetY = loop.y_cm + Math.sin(ang) * loop.radius_cm;
      const fx = (targetX - bx) * CENTRIPETAL_K;
      const fy = (targetY - by) * CENTRIPETAL_K;
      applyForce(bey.id, fx, fy);

      // Banking: increase beyTiltAngle proportional to speed
      const maxBank = loop.bankingDeg ?? 30;
      bey.beyTiltAngle = Math.min(maxBank, (speed / MAX_EXPECTED_SPEED) * maxBank);

      // Check exit condition
      const exitAngle = loop.exitAngleDeg ?? (loop.entryAngleDeg + 180) % 360;
      const angleDiff = Math.abs(bey.loopAngleDeg - exitAngle);
      if (angleDiff < 5 && bey.loopAngleDeg !== loop.entryAngleDeg) {
        bey.loopTrackId = undefined;
        bey.beyTiltAngle = 0;  // restore upright
      }
    }
  }
}
```

### 3.3 Colyseus Schema Changes

**File:** `server/rooms/schema/GameState.ts`

Add to `ArenaState`:
```typescript
@type("number") loopTrackCount: number = 0;
```

**File:** `server/shared/rooms/populateArenaFeatures.ts`

```typescript
state.arena.loopTrackCount = config.loopTracks?.length ?? 0;
```

**Beyblade schema** — add transient fields for loop tracking (not synced, server-only):
```typescript
// Server-only runtime fields (not @type decorated — not synced)
loopTrackId?: string;
loopAngleDeg?: number;
_prevElevZones?: Set<string>;
```

---

## 4. Admin UI: Platforms Tab

### 4.1 New `PlatformsTab.tsx`

**File:** `client/src/components/admin/arena-tabs/PlatformsTab.tsx`

Three sections within the tab:

**Section A — ElevationZones**

Moved from FeaturesTab. CRUD list with fields:
- `x_cm`, `y_cm` — position sliders (±250 cm)
- `radius_cm` — slider (1–100 cm)
- `heightCm` — visual height display only (0–500 cm)
- `spinBoostOnPlatform` — number input (0–50 /sec)
- `edgeDropForce` — number input (0–0.5)

**Section B — Loop Tracks**

New CRUD list (same card-list pattern as ObstaclesTab). Fields:
- `x_cm`, `y_cm` — center position sliders
- `radius_cm` — loop radius (5–100 cm)
- `trackWidth_cm` — track width (2–20 cm)
- `entryAngleDeg` — angle picker (0–359°)
- `exitAngleDeg` — angle picker (optional; default entry+180)
- `speedBoost` — multiplier slider (1.0–3.0)
- `bankingDeg` — slider (0–60°)

**Section C — Modular Sections**

Visual scaffolding placement list. Fields:
- `type` — `SearchableSelect` of `ModularSectionType` values
- `x_cm`, `y_cm` — position sliders
- `rotation` — angle slider
- `scale` — scale slider (0.1–5.0)
- `linkedArenaLinkId` — `SearchableSelect` of existing ArenaLink IDs in the floor group
- `linkedSpeedPathId` — `SearchableSelect` of existing SpeedPath IDs
- `color` — color picker
- `textureId` — `SearchableSelect` of `obstacle_assets` (reuses existing asset picker)

### 4.2 ArenaConfigurator Tab Registration

**File:** `client/src/components/admin/ArenaConfigurator.tsx` (or equivalent arena editor root)

Add `"platforms"` to the tab list. Render `<PlatformsTab />`. Move ElevationZones rendering code from FeaturesTab to PlatformsTab.

### 4.3 ArenaFloorGroupEditorPage: Connections Panel

**File:** `client/src/pages/admin/ArenaFloorGroupEditorPage.tsx`

Between each floor pair row in the floor stack visualization, add a collapsible "Connections" panel:

- Lists `ModularSectionConfig` entries of types `elevator_shaft`, `ramp_section`, `straight_tube`, `curved_tube`
- "Add connection" button → quick-add form with type selector + ArenaLink picker
- Shows connection type icon + linked ArenaLink name/status

---

## 5. Minimap: Local 100cm View + Perspective Tab

### 5.1 Constraint: No Whole-Arena Minimap

The minimap (`client/src/components/game/Minimap.tsx`) must NOT render the full arena at tiny scale. A 500 cm arena would be a meaningless dot-cluster at minimap scale. Instead:

**The minimap always shows a 100 cm × 100 cm area centered on the player's own bey.**

This matches the player's maximum viewport — the minimap is a **local radar**, not a global overview. Other beys are shown as dots only if within 50 cm of the player.

### 5.2 Fix TopView: Local 100cm ViewBox

Current `TopView` sets `viewBox` to the full `widthCm × heightCm`. Change to:

```typescript
// In TopView component:
const VIEW_HALF_CM = 50;  // 100cm total window
const selfBey = beyblades.get(selfId ?? "");
const cx = selfBey ? cmFromPhys(selfBey.x, physCenterX) : 0;
const cy = selfBey ? cmFromPhys(selfBey.y, physCenterY) : 0;

// SVG viewBox centered on player bey
const vbX = cx - VIEW_HALF_CM;
const vbY = cy - VIEW_HALF_CM;
const vbW = VIEW_HALF_CM * 2;
const vbH = VIEW_HALF_CM * 2;
```

- Arena boundary rendered as a partial arc/rect clipped to this 100cm window
- Features (obstacles, turrets, pits, loops) rendered only if center within `VIEW_HALF_CM + 10 cm`
- Player bey always at center (dot with yellow fill)
- Other beys rendered only if within 50 cm of player

When the player has no `selfId` (spectator), center on the arena center.

### 5.3 New "Persp" Tab: 2.5D Perspective View

Add a third tab `"persp"` showing the same 100 cm local area with the arena tilt transform applied.

**New `PerspView` function in `Minimap.tsx`:**

```typescript
function PerspView({
  arena, beyblades, selfId, sizeRem, myFloorIndex
}: PerspViewProps) {
  const tiltAngleDeg = (arena as any).tiltAngle ?? 0;
  const tiltDirDeg = (arena as any).tiltDirection ?? 0;

  // Same 100cm local viewBox as TopView (reuse same calculation)
  // ...selfBey centering, VIEW_HALF_CM...

  // Three-stage tilt transform (matches PixiRenderer.ts tilt stack):
  // 1. rotate by tiltDirection
  // 2. scaleX by cos(tiltAngle) — foreshortening
  // 3. rotate by -tiltDirection
  const tiltRad = tiltAngleDeg * Math.PI / 180;
  const tiltDirRad = tiltDirDeg * Math.PI / 180;
  const cosT = Math.cos(tiltRad);
  const cd = Math.cos(tiltDirRad), sd = Math.sin(tiltDirRad);

  // CSS matrix (a,b,c,d,e,f) for the compound transform:
  // rotate(tiltDir) · scaleX(cosT) · rotate(-tiltDir)
  const a = cd * cosT * cd + sd * sd;
  const b = sd * cosT * cd - cd * sd;
  const c = cd * cosT * sd - sd * cd;
  const d = sd * cosT * sd + cd * cd;
  const svgTransform = `matrix(${a},${b},${c},${d},0,0)`;

  return (
    <svg viewBox={`${vbX} ${vbY} ${vbW} ${vbH}`} width="100%" height={`${sizeRem}rem`}>
      <g transform={svgTransform}>
        {/* arena boundary, features, bey dots — same as TopView */}
      </g>
    </svg>
  );
}
```

Tab bar update in `Minimap.tsx`:
```typescript
const tabs = ["top", ...(hasFloors ? ["side"] : []), "persp"] as const;
```

For multi-level arenas, the Persp tab shows the current floor (filtered by `myFloorIndex`). Beys on other floors are shown as dimmed dots.

### 5.4 File

`client/src/components/game/Minimap.tsx`:
- Fix `TopView` viewBox to local 100cm centered on self
- Add `PerspView` function
- Add `"persp"` to tab list

---

## 6. Seed Examples

Two new seed entries demonstrating multi-level Hot Wheels–style arenas:

### 6.1 `hot-wheels-garage-starter` (FloorGroup)

A 3-floor garage arena seeded in `arena_floor_groups`:

| Floor | Name | Size | Features |
|-------|------|------|---------|
| 0 (ground) | Garage Floor | 100cm × 100cm circle | Main battle zone, 2 ramp ArenaLinks going up, landing pads |
| 1 (mid) | Mezzanine | 60cm × 60cm square | Loop track (radius 15cm), 2 turrets, elevator shaft up |
| 2 (top) | Rooftop | 40cm × 40cm circle | Spin zone, gravity hole, elevator back down |

ModularSections on each floor define the visual connectors. ArenaLinks wire the physics traversal.

### 6.2 `loop-de-loop-arena` (Single floor)

A single large (80cm) circle arena with 2 loop tracks at opposite ends:
- Loop A: radius 12cm, entry from left, speed boost 1.8×, banking 25°
- Loop B: radius 8cm, entry from right, speed boost 2.0×, banking 35°
- Central gravity hole pulling beys toward center

---

## 7. Integration Notes

### Backward Compatibility

- `modularSections`, `loopTracks` are optional arrays in `ArenaConfig` — existing arenas are unaffected
- The `ElevationZoneConfig` type already exists; `processElevationZones()` is purely additive
- `PortalConfig.subtype` defaults to `"standard"` — existing portals unchanged
- All existing ArenaFloorGroup/ArenaLink behavior is preserved

### Rendering

- `ArenaPreview.tsx` and `FeatureRenderer.ts` render `modularSections` as themed graphic shapes (tube cross-sections, platform rectangles, loop ring outlines)
- Loop tracks render as annular rings with a track texture on the arena floor
- Elevator shafts render as vertical rectangles with animated chevrons
- These are visual-only in the renderer — no physics bodies are created for modular sections

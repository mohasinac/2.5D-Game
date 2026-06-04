# Beyblade Game — Claude Instructions

## Project overview
Phaser (2D RPG layer) + Three.js (3D battle/sandbox rendering) game.
Stack: Vite + TypeScript + Three.js + Phaser (Phaser added when RPG scenes begin).

## Style rules — MUST follow every time

### Scaling system (non-negotiable)

#### Physical unit convention
| Unit | CSS value | Notes |
|------|-----------|-------|
| 1 cm | `1vmin`   | canonical length unit |
| 1 mm | `0.1vmin` | **minimum** — never go smaller |

**CSS variables (always use these, never raw vmin):**
```css
--cm: calc(1vmin  * var(--ui-scale))   /* 1 centimetre */
--mm: calc(0.1vmin * var(--ui-scale))  /* 1 millimetre */
```

- `html { font-size: calc(2 * var(--cm)) }` → baseline body text = 2 cm.  
  All `em` units cascade from this, so `1em = 2cm`.
- For explicit layout sizes use `var(--cm)` / `var(--mm)` directly (e.g. `padding: calc(8 * var(--mm))`).
- `--ui-scale` (default `1`) is adjusted by the global `+`/`−`/`○` buttons — it multiplies both `--cm` and `--mm`.
- **Never** hardcode pixel values for visual layout. Only exception: `renderer.setSize(w, h, false)` in Three.js.

#### Arena and beyblade dimensions
The user will specify physical sizes in **centimetres**. Map them directly:  
`widthCm cm` → Three.js units = `widthCm` (since 1 Three.js unit = 1 cm).  
Example: a 16 cm arena radius → `radius = 16` in Three.js world units.

### No scrollbars — ever
- `html`, `body`, `#app`, every `.screen`: `overflow: hidden`.
- If content risks overflow, clip it or shrink the content — do not add scroll.

### Fullscreen support
- All screens must fill `100vw × 100vh` via `position: fixed; inset: 0` or equivalent.
- Fullscreen toggle: `document.documentElement.requestFullscreen()`.
- The `⛶` button (top-right) and `F` key toggle fullscreen.

### Game-like aesthetic
- Background: `#080810` (very dark blue-black).
- Accent primary: `#00e5ff` (cyan) — Beyblade Sandbox.
- Accent secondary: `#ff6b35` (orange) — Arena Sandbox.
- Text: `#dde8ff` (slightly blue-tinted white).
- Borders: `rgba(0, 229, 255, 0.25)`.
- Fonts: `Orbitron` (titles/labels) + `Rajdhani` (body/buttons). Both from Google Fonts.
- Buttons: `uppercase`, `letter-spacing: 0.12em`, hover glow via `box-shadow`.
- No border-radius larger than `0.4em`. Sharp, angular UI.
- Glow effects via `text-shadow` and `box-shadow` — never blur filters on interactive elements.

### Three.js viewports

#### World-unit scale
**1 Three.js world unit = 1 cm.**  
Minimum geometry detail: 1 mm = 0.1 world units. Never model anything smaller.  
When the user gives a measurement in cm, use that number directly as the Three.js unit value.

#### Y-axis convention
**Y = height (up). XZ = ground plane (arena floor).** This matches real-world orientation.

#### Renderer / controls
- Renderer fills `100%` of its container via `ResizeObserver` + self-healing resize inside the render loop.
- Self-healing pattern: every frame, check `canvas.width !== clientWidth || canvas.height !== clientHeight` and call `setSize` + update projection if needed.
- `renderer.setSize(w, h, false)` — `false` prevents Three.js overriding the CSS size.
- `setPixelRatio(Math.min(devicePixelRatio, 2))` — cap at 2× for performance.
- Always include: `GridHelper` (XZ ground plane), `AxesHelper` (X=red, Y=green, Z=blue), axis label sprites, numeric grid tick sprites.
- Grid subdivision colour: `0x2a2a4a` (not darker — will appear invisible).
- `OrbitControls`: left-drag = orbit, right-drag = pan, scroll = zoom, damping on (`dampingFactor: 0.07`).
- Background `clearColor: 0x08080f`.
- **No fog** — `FogExp2` causes black screens at normal camera distances with a dark background.

#### Single WebGL context rule
Only one `WebGLRenderer` may exist at a time. Pattern:
- `initScene()` — runs once, creates `Scene` + `PerspectiveCamera` + all geometry. Never recreated.
- `mountRenderer()` — runs on every `setVisible(true)`: creates renderer, OrbitControls, calls `loadView()`.
- `unmountRenderer()` — runs on every `setVisible(false)`: calls `saveView()`, disposes renderer + controls.

#### Camera view persistence
- Save/restore camera position + orbit target to `localStorage` on hide/show.
- Key per sandbox: `bey_view_${title.toLowerCase().replace(/\s+/g, '_')}`.
- `resetView()` clears localStorage key and restores `defaultCam` + `DEFAULT_TGT = {0,0,0}`.

#### Sandbox dimensions
| Sandbox | gridSize | gridDivs | tickEvery | tickRange | defaultCam | camFar | minZoom | maxZoom |
|---------|----------|----------|-----------|-----------|------------|--------|---------|---------|
| Beyblade | 15 cm | 15 (1cm/cell) | 5 cm | ±7 cm | (12,8,14) | 500 | 0.5 cm | 50 cm |
| Arena | 200 cm | 20 (10cm/cell) | 20 cm | ±100 cm | (150,100,175) | 2000 | 5 cm | 1500 cm |

All proportional scene values (axis lengths, label distances, sprite sizes, light ranges) are derived from `gridSize` automatically — never hardcoded.

### Screen structure
- Each screen is a `div.screen` with `position: absolute; inset: 0; overflow: hidden`.
- Active/inactive toggled by `.hidden` class (`display: none`).
- Three.js canvas gets a `.sandbox-canvas-wrap` sibling for `.sandbox-overlay` (pointer-events for UI).

### SPA routing
- Real URL paths: `/` = landing, `/beyblade`, `/arena`. No hash routing.
- `history.pushState` to navigate; `popstate` event to handle browser back/forward.
- `vite.config.ts` must have `base: '/'` (not `'./'`).
- When user presses browser back from a sandbox: show `gameConfirm()`. If declined, call `history.go(1)` to undo.
- `history.replaceState` on initial load (not `pushState`) so back from landing doesn't loop.

### Confirm-before-leave
- Any navigation out of a sandbox (in-app back button or browser back) shows a `gameConfirm()` dialog.
- Dialog resolves `Promise<boolean>`: `true` = leave confirmed, `false` = stay.
- Enter key = confirm leave; Escape = stay; clicking overlay backdrop = stay.

### TypeScript
- Strict mode on.
- Classes for screens/systems; plain functions for utilities.
- No `any`. No `!` non-null assertions unless the element is guaranteed present in the same function.
- Cast pattern for material traversal: `mat as unknown as Record<string, unknown>`.

## File structure
```
src/
  main.ts                       — App class, screen router, global controls (+/−/○ scale, ⛶ fullscreen)
  styles/
    global.css                  — vmin scale system, reset, shared components + beyblade bottom bar
  screens/
    LandingScreen.ts            — Title + sandbox nav buttons
    Sandbox.ts                  — Reusable Three.js XYZ viewport (SandboxOptions); provides onTick() hook
    ArenaSandbox.ts             — Full arena builder: arenas, pits, zones, moats, properties panel
    BeybladeSandbox.ts          — Beyblade part builder (extends Sandbox); thin orchestrator/Facade
  types/
    arenaTypes.ts               — Arena data model interfaces
    beybladeTypes.ts            — Beyblade data model: AxisData, PartData, SectorData, GroupData, BeybladeBuildConfig
  stores/
    BeybladeStore.ts            — Pure data store (no Three.js); getters/setters/serialize/deserialize
  commands/
    ICommand.ts                 — ICommand interface + CommandHistory (undo/redo stack, max 50)
    beybladeCommands.ts         — All concrete commands: AddPartCmd, DeletePartCmd, UpdatePartCmd,
                                  CutSectorsCmd, UpdateSectorCmd, DeleteSectorCmd, AddGroupCmd,
                                  DeleteGroupCmd, UpdateGroupCmd, MoveNodeCmd
  geometry/
    sectorBuilders.ts           — ISectorGeometryBuilder + SolidSectorBuilder + HollowSectorBuilder + getSectorBuilder()
    [arena geometry files...]
  renderers/
    BeybladeRenderer.ts         — Three.js mesh management; axisRoot/spinGroup/freeSpinGroup hierarchy;
                                  view mode toggle (hitbox/both/present); STL presentation mesh loading
  animation/
    BeybladeAnimator.ts         — tick(dt, spinDir) spins spinGroup; setTiltAngle/setPivotOffset tilts axisRoot
  utils/
    AbstractPropertiesPanel.ts  — Shared base class: section/numRow/colorRow/toggleRow/textRow/selectRow helpers
    PropertiesPanel.ts          — Arena properties (extends AbstractPropertiesPanel)
    BeybladePropertiesPanel.ts  — Beyblade properties (extends AbstractPropertiesPanel)
    SceneTree.ts                — Reusable hierarchical tree widget (shared by both sandboxes)
    dialog.ts                   — gameConfirm() modal utility
  config/
    arenaConstants.ts           — Arena world constants
```

## Running
```
npm run dev     # Vite dev server — single instance enforced via strictPort: true
npm run build   # TypeScript check + Vite build
```

---

## Arena Sandbox — Architecture & Rules

### Coordinate system

| Level | World Y | Notes |
|-------|---------|-------|
| Scene origin | 0 | Grid floor, AxesHelper base |
| Octagon Base top face | `DEFAULT_BASE_HEIGHT` cm (`arenaConstants.ts`) | Everything arena-related is anchored here |
| Arena rim | `DEFAULT_BASE_HEIGHT` + posY | `posY` lifts an arena above the base |
| Arena bowl center | `DEFAULT_BASE_HEIGHT` + posY − depth | Bottom of the parabola |
| Moat island top | `DEFAULT_BASE_HEIGHT` + posY + innerRimOffset | Elevated platform; child arenas sit at this Y |

`mesh.position.set(posX, posY, posZ)` applies the Y offset. Geometry is always built with `baseY = baseConfig.height`; the mesh position adds `posY` on top. **Never bake `posY` into vertex Y — it will double-count.**

---

### Octagon Base (immutable platform)

```typescript
// src/config/arenaConstants.ts — frozen, mutation is a TypeScript compile error
export const OCTAGON_BASE = {
  radius: APOTHEM / Math.cos(Math.PI / DEFAULT_BASE_SIDES),  // ≈108.24 cm — centre to vertex
  height: DEFAULT_BASE_HEIGHT,  // cm — top face Y (default 30)
  sides:  DEFAULT_BASE_SIDES,   // default 8
  align:  Math.PI / DEFAULT_BASE_SIDES,  // flat sides face ±X, ±Z
} as const;
```

The user adjusts the base height/sides interactively via the properties panel; these write into `ArenaSandbox.baseConfig`, **not** into `OCTAGON_BASE`. All arena geometry derives from `baseConfig` at runtime. Never write to `OCTAGON_BASE.*`.

---

### Objects in the scene

#### ArenaData
- `wallProfile`: `'parabolic'` | `'straight'` — shape of the bowl walls
- `openingShape`: `'circle'` | `'ellipse'` | `'rectangle'` | `'hexagon'` | `'triangle'` | `'star'`
- `radiusX`, `radiusZ`, `depth` — bowl dimensions in cm
- `posX`, `posZ`, `posY`, `rotY` — world position; posY lifts arena above base
- `isMoat`: when true the arena is a ring (outer bowl + inner island); adds `innerRadiusX/Z`, `innerWallProfile`, `innerRimOffset`, `innerOpeningShape`
- `pitIds[]`, `zoneIds[]` — owned children

#### PitData
- A depression cut INTO the arena surface — like a dent on a car, not a separate object
- `posR`, `posAngle` — polar position within the parent arena (not world coords)
- `rotY` — self-rotation
- `wallProfile`: parabolic or straight
- Also supports `isMoat` (ring pit)

#### ZoneData
- A liquid-fill area (water, lava, swamp, poison, sand, ice, void, custom)
- Same positioning as PitData
- Has a `fillMesh` driven by `WAVE_VERT`/`WAVE_FRAG` vertex-displacement shader for animated liquid surfaces
- `fill`, `fillColor`, `fillOpacity`, `fillGlow` — preset or custom appearance

---

### Key geometry functions (all in ArenaSandbox.ts)

| Function | Purpose |
|----------|---------|
| `buildParabolicBowl(pts, depth, baseY, holes?)` | Main arena bowl mesh; skips triangles in `holes` (for pit/zone openings) |
| `buildStraightCut(pts, depth, baseY)` | Straight-wall arena variant |
| `buildMoatGeometry(outerPts, innerPts, ...)` | Ring moat bowl with inner rise |
| `buildScoopGeometry(pts, depth, profile, pitCX, pitCZ, pitRotY, arena)` | **Pit/zone bowl** — every vertex Y follows the arena surface curvature (ice-cream-scoop dent). RIM_EPS=0.15 cm lifts rim above arena surface to prevent z-fighting |
| `buildScoopEdgeLines(...)` | Surface-conforming edge wires for pits/zones |
| `buildIslandCapGeo(arena, holes?)` | Flat disc at inner island top; `holes` are cut for child arenas sitting on the island |
| `buildArenaFloorGeo(arena, pits, zones)` | Flat floor for straight-wall arenas with pit/zone cutouts |
| `buildTopFaceGeo(...)` | Octagon top face with arena-opening holes |
| `buildZoneFillGeo(zone)` | Tessellated disc/ring for wave-shader liquid surface |

#### `arenaSurfaceYAtArenaLocal(arena, alx, alz)`
Returns the world Y of the arena bowl surface at any arena-local XZ position:
```typescript
const H = OCTAGON_BASE.height + arena.posY;
// parabolic: H - depth*(1 - t²) where t = normalised elliptical distance from centre
// straight:  H - depth
```
Used by `buildScoopGeometry` so pit/zone geometry conforms to the parent bowl's curvature.

---

### Pit/zone coordinate transform (important)
A pit vertex at pit-local `(lx, lz)` maps to arena-local:
```
arena_lx = pitCX + lx*cos(pitRotY) - lz*sin(pitRotY)
arena_lz = pitCZ + lx*sin(pitRotY) + lz*cos(pitRotY)
```
where `pitCX = posR*cos(posAngle)`, `pitCZ = posR*sin(posAngle)`.  
Arena `rotY` cancels algebraically — only the pit's own `rotY` matters.

Pit/zone meshes are positioned at `(wx, 0, wz)` in world space (`mesh.position.y = 0` always — the geometry bakes absolute world Y using `arenaSurfaceYAtArenaLocal`).

---

### Moat island + child arenas (stacking)

When a moat arena has `innerRimOffset > 0`, its inner island is elevated. A second arena can sit on this platform:

- Set child arena `posY = moatArena.innerRimOffset`
- Child arena's bowl rim then sits at the same world Y as the island cap
- `getArenasOnIsland(moatArena)` detects this: checks `abs(arenaB.posY − innerRimOffset) ≤ 1cm` AND `arenaB`'s centre is within the inner boundary
- `buildIslandCapGeo(arena, holes)` cuts an elliptical hole in the island cap so the child arena bowl is visible through it
- `updateAllMoatIslandCaps()` — must be called whenever any arena is added, removed, or its posX/posZ/posY/radius changes

Pits/zones added to the child arena automatically conform to the child arena's elevated surface because `arenaSurfaceYAtArenaLocal` uses `arena.posY`.

---

### Zone fill system

Fill presets (`water`, `lava`, `swamp`, `poison`, `sand`, `ice`, `void`, `custom`) each drive a `THREE.ShaderMaterial` with `WAVE_VERT`/`WAVE_FRAG` vertex-displacement shaders.  
Fill Y = `arenaSurfaceYAtArenaLocal(arena, zoneCX, zoneCZ) - 1.0` — 1 cm below the zone rim, looks like liquid pooling at the surface.  
Future fill types (whirlpool, lava flow, tsunami) should be implemented as additional shader presets in `FILL_PRESET` / `FILL_WAVE`, **not** as CPU particle systems.

---

### Surface material system

`buildSurfaceMaterial(opts)` returns a cached `THREE.MeshStandardMaterial` with a procedural canvas texture. Types: `plain`, `checker`, `grid`, `hex`, `stripes`, `dots`, `concrete`, `metal`, `wood`, `ice`, `sand`, `lava_rock`, `custom_png`. All use `side: THREE.DoubleSide`.

---

### Axes helper — axisYOffset

`SandboxOptions.axisYOffset?: number` lifts the `THREE.AxesHelper` and axis labels to that Y so they appear above the scene floor rather than inside bowl geometry. Arena sandbox passes `axisYOffset: 30` (= `OCTAGON_BASE.height`). Beyblade sandbox omits it (defaults 0).

---

### Save / load (localStorage)

Schema version **3** (bump when adding new fields to ArenaData/PitData/ZoneData). Old versions are discarded on load. Key: `bey_arena_arena_sandbox`. All `posY`, `innerRimOffset`, `innerOpeningShape`, `innerSides`, `innerStarInner` fields are serialized.

---

## Beyblade Builder — Architecture & Rules

### Design principles

The Beyblade Builder follows **SOLID principles** — unlike ArenaSandbox (which is one large class), each concern is isolated:

| Class | Single responsibility |
|-------|-----------------------|
| `BeybladeStore` | Pure data: no Three.js imports |
| `CommandHistory` + commands | Undo/redo via Command pattern |
| `BeybladeRenderer` | Three.js mesh creation/disposal; view mode |
| `BeybladeAnimator` | Per-frame spin + tilt animation |
| `BeybladePropertiesPanel` | Properties form UI only |
| `BeybladeSandbox` | Thin orchestrator (Facade) — wires the above together |

**Never** merge responsibilities back into `BeybladeSandbox`. It must remain a thin orchestrator.

---

### Spin axis rules

- The axis is **always a straight rigid line**. Its shape never changes.
- `axisRoot` (Three.js Group) is positioned at `y = pivotOffset` and rotated by `tiltAngle` around the X axis.
- All parts and the axis rod live inside `axisRoot` — they tilt together as one body.
- `pivotOffset` (cm) determines which point on the axis stays fixed on the ground plane during tilt.
- `spinGroup` (child of axisRoot) rotates each frame for non-free-spin parts; `freeSpinGroup` (sibling) stays fixed.

```
axisRoot  (positioned at y=pivotOffset, rotated by tiltAngle)
  ├─ axisLine    (LineSegments — straight rod)
  ├─ pivotMarker (Mesh sphere at local y=0)
  ├─ groundDisc  (Mesh disc at local y=-pivotOffset)
  ├─ spinGroup   (.rotation.y incremented each frame for non-freeSpin parts)
  └─ freeSpinGroup (.rotation.y stays 0)
```

---

### Sector geometry rules

A **sector** = a pie-slice frustum with independent top/bottom elliptic radii (allowing tapering). Built via `ISectorGeometryBuilder`:

```typescript
// Open/Closed: add new shapes by implementing this; never modify existing builders
interface ISectorGeometryBuilder {
  buildMeshGeometry(s: SectorData): THREE.BufferGeometry;
  buildEdgeGeometry(s: SectorData): THREE.BufferGeometry;
}
// Factory for Dependency Inversion:
getSectorBuilder(isHollow: boolean): ISectorGeometryBuilder
```

- `SolidSectorBuilder` — outer wall + top/bottom cap fans (triangle fan from centre) + side faces at start/end angles if arc < 360°
- `HollowSectorBuilder` — outer wall + inner wall (inverted normals) + annular top/bottom caps + flat annular side faces
- Arc < 360° always adds two flat side faces at `startAngle` and `endAngle`
- N segments = `max(8, ceil(arcDeg / 5))` — never hardcode

When `part.sectorIds` is empty, the renderer treats the part as a full 360° frustum using `partAsSector(part)`.

---

### Command pattern rules

- **All mutations** go through a `Command` passed to `CommandHistory.execute()`. Never mutate the store directly from UI handlers.
- Each command takes `BeybladeCommandCtx` (injected), which contains the store + render/tree callback functions.
- Commands store their own before/after snapshots — undo reverses the mutation and fires the same callbacks.
- `CommandHistory` max = 50 entries. Cleared on `_resetBuilder()`.

---

### View modes

| Mode | Hitbox visible | Presentation visible |
|------|---------------|---------------------|
| `hitbox` | ✓ | ✗ |
| `both` | ✓ | ✓ |
| `present` | ✗ | ✓ |

Presentation meshes come from imported STL files (one per part). If no STL is loaded, `presentMesh = null` and switching to `present` mode just hides the hitbox.

---

### Persistence (Beyblade Builder)

- localStorage key: `bey_beyblade_builder`
- Schema version: `1` (in `BeybladeBuildConfig.version`). Discard and reset if version mismatch.
- Saved on every `CommandHistory.execute()` call and on axis property changes.
- **Reset Builder** (`✕ Reset` button): stops animation, disposes all meshes, calls `store.reset()`, clears history, clears localStorage.
- Camera view key (from Sandbox base): `bey_view_beyblade_builder` (reset via `↺ View` button).

---

### Weight constraint (sectors)

When a part is cut into N sectors (`CutSectorsCmd`), the parent's `weight` is distributed evenly. The properties panel shows the running total vs parent weight. The total **must** equal `parent.weight` — the UI warns but does not hard-block (user must resolve before the build is physically accurate).

---

### Beyblade Builder pitfalls (do not re-introduce)

- **Naming collision**: `BeybladeSandbox` has a `private beyRenderer` (not `renderer`) because `Sandbox` already has a `private renderer: THREE.WebGLRenderer`. Always use `beyRenderer` for the `BeybladeRenderer` instance.
- **Baking axisOffsetY into vertex Y**: Part mesh geometry uses local Y from 0. `mesh.position.y = part.axisOffsetY` applies the offset. Never add `axisOffsetY` to vertex coordinates.
- **Direct store mutations from UI**: Always go through a Command. The `_selectAxis()` handler is the only exception (axis tilt/pivot updates skip the command history since they are live pose parameters, not structural mutations).
- **buildCustom() called once**: `BeybladeRenderer`, `BeybladeAnimator`, `SceneTree`, and `BeybladePropertiesPanel` are all created inside `buildCustom()` which runs once. Never recreate them on subsequent `setVisible(true)` calls.
- **onTick hook**: `Sandbox.loop()` now passes `dtMs` to `protected onTick(dtMs)`. `BeybladeSandbox` overrides this to call `animator.tick()`. The base implementation is a no-op — do not remove it.

---

## Known pitfalls (do not re-introduce)

- **Fog**: removed — causes black screens against dark background at all normal distances.
- **Grid colour `0x1a1a2e`** for subdivisions: too dark, renders invisible. Use `0x2a2a4a`.
- **Hash routing** (`location.hash`, `hashchange`): user wants real paths. Use `pushState`/`popstate`.
- **Eager renderer init**: creating `WebGLRenderer` in constructor for both sandboxes = two GL contexts upfront. Only create renderer inside `mountRenderer()` (called from `setVisible(true)`).
- **Single deferred RAF for resize**: not reliable before layout is ready. Use self-healing check inside the continuous `loop()` instead.
- **baking posY into vertex Y**: `buildArenaFloorGeo` and `buildIslandCapGeo` must NOT include `arena.posY` in their geometry Y — `mesh.position.set(posX, posY, posZ)` already applies it. Double-counting shifts the mesh up by `posY` twice.
- **Island cap covering child arena**: When a second arena is placed on a moat island (`posY = innerRimOffset`), its bowl rim is at the same world Y as the island cap. Without `buildIslandCapGeo(arena, holes)` the island cap is a solid disc that occludes the child bowl. Always call `updateAllMoatIslandCaps()` after any arena add/remove/property-change.
- **Zone fill at bowl bottom**: Fill Y must be near the rim (`surfY - 1.0`), not the floor (`surfY - depth + 0.1`). The floor value places the fill plane under the bowl surface and makes it invisible.
- **Pit/zone outside arena bounds**: Slider max for `posR` must subtract the child radius (`arenaMinR - childMaxR`); radius sliders must subtract `posR`. Without this, children extend outside the parent arena.
- **AxesHelper inside bowl**: Default `AxesHelper` at Y=0..axisLen pokes into arena bowls. Use `axisYOffset: baseConfig.height` in `SandboxOptions` to lift axes to the octagon surface level.

---

## Architecture rules — coupling prevention

### File responsibility (single reason to change)
| File | Changes when... |
|------|----------------|
| `src/config/arenaConstants.ts` | A world constant or tuning number changes |
| `src/types/arenaTypes.ts` | A data model field is added/removed |
| `src/geometry/primitives.ts` | The core ring/edge generation algorithm changes |
| `src/geometry/surfaceUtils.ts` | The arena surface math or coordinate helpers change |
| `src/geometry/bowlBuilders.ts` | Bowl mesh algorithm changes (not the ring math — that's primitives.ts) |
| `src/geometry/scoopBuilders.ts` | Pit/zone scoop algorithm changes |
| `src/geometry/platformBuilders.ts` | Top face or floor algorithm changes |
| `src/geometry/materialBuilders.ts` | A surface texture type is added or changed |
| `src/geometry/fillBuilders.ts` | A zone fill type or shader changes |
| `src/geometry/arenaObjectBuilders.ts` | The Three.js object assembly pattern changes |

### Allowed import direction (never reverse)
```
arenaConstants + arenaTypes  ←  primitives.ts
                             ←  surfaceUtils.ts
                             ←  bowlBuilders / scoopBuilders / platformBuilders / materialBuilders / fillBuilders
                             ←  arenaObjectBuilders.ts
                             ←  ArenaSandbox.ts
                             ←  PropertiesPanel.ts (imports arenaTypes + arenaConstants ONLY — no geometry)
```

### Banned patterns — never introduce
- Writing to `OCTAGON_BASE.*` anywhere — it is `as const`, TypeScript will error.
- Hardcoding `30`, `0.5`, `-1.0`, `0.02` outside `arenaConstants.ts`. Use `DEFAULT_BASE_HEIGHT`, `ARENA_ELEVATED_THRESHOLD`, `ZONE_FILL_OFFSET`, `RIM_EPS`.
- Importing geometry builders or `OCTAGON_BASE` in `PropertiesPanel.ts` — it receives values as parameters.
- Importing from `screens/` inside any `geometry/` file.
- Putting geometry builder functions in `ArenaSandbox.ts`.
- Implementing the parabolic Y formula `baseY - depth*(1-t²)` inline — call `buildParabolicRingGeo` from `primitives.ts`.
- Implementing `posR*cos(angle*DEG2RAD)` inline — call `polarToLocalXZ` from `surfaceUtils.ts`.
- Implementing `{cx,cz,rotY}` extraction for pits/zones inline — call `extractChildTransform` from `surfaceUtils.ts`.
- Implementing a rim edge loop inline — call `buildRimEdges` from `primitives.ts`.

### When you add a new constant
Add it to `src/config/arenaConstants.ts` with a name. Never inline magic numbers.

### When you add a new geometry builder
- If it generates concentric rings: call `buildParabolicRingGeo` from `primitives.ts`.
- If it positions a pit/zone child: call `extractChildTransform` from `surfaceUtils.ts`.
- If it builds edges: call `buildRimEdges` / `buildFloorAndPillarEdges` from `primitives.ts`.
- If it assembles a Three.js Mesh + edges: it belongs in `arenaObjectBuilders.ts`.

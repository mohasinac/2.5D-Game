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
    Sandbox.ts                  — Reusable Three.js XYZ viewport (SandboxOptions); provides onTick() hook;
                                  public getCamera() / getControls() / getRendererCanvas() accessors
    ArenaSandbox.ts             — Full arena builder: arenas, pits, zones, moats, walls, bridges, speed lines, properties panel
    BeybladeSandbox.ts          — Beyblade part builder (extends Sandbox); thin orchestrator/Facade
  types/
    arenaTypes.ts               — Arena data model interfaces (ArenaData, PitData, ZoneData, WallData,
                                  BridgeData, BridgeSegmentData, SpeedLineData, SpeedLineSegment,
                                  ArenaMaterial, BridgeSection, and all related enums)
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
    wallBuilders.ts             — Wall mesh/edge builders; arcFilterPts; defaultWallData
    bridgeSegmentBuilders.ts    — Bridge segment path samplers; cross-section sweep; SegmentPose; defaultSegment
    speedLineBuilders.ts        — Speed line path computation; ribbon mesh; arrow/handle/marker builders; overlap detection
    [arena geometry files...]
  renderers/
    BeybladeRenderer.ts         — Three.js mesh management; axisRoot/spinGroup/freeSpinGroup hierarchy;
                                  view mode toggle (hitbox/both/present); STL presentation mesh loading
  animation/
    BeybladeAnimator.ts         — tick(dt, spinDir) spins spinGroup; setTiltAngle/setPivotOffset tilts axisRoot
  utils/
    AbstractPropertiesPanel.ts  — Shared base class: section/numRow/colorRow/toggleRow/textRow/selectRow helpers
    PropertiesPanel.ts          — Arena properties (extends AbstractPropertiesPanel); showWall/showBridge/showBridgeSegment/showSpeedLine
    BeybladePropertiesPanel.ts  — Beyblade properties (extends AbstractPropertiesPanel)
    SceneTree.ts                — Reusable hierarchical tree widget (shared by both sandboxes)
    dialog.ts                   — gameConfirm() modal utility
    arenaPersistence.ts         — ArenaSave/ArenaConfig serialisation; wall/bridge/speed line save interfaces (no version field)
  config/
    arenaConstants.ts           — Arena world constants + ARENA_MATERIAL_PRESETS + wall/bridge defaults
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
- `wallProfile`: `'parabolic'` | `'straight'` | `'step'` | `'spiral'` — shape of the bowl walls
- `openingShape`: `'circle'` | `'ellipse'` | `'rectangle'` | `'hexagon'` | `'triangle'` | `'star'`
- `radiusX`, `radiusZ`, `depth` — bowl dimensions in cm
- `posX`, `posZ`, `posY`, `rotY` — world position; posY lifts arena above base
- `isMoat`: when true the arena is a ring (outer bowl + inner island); adds `innerRadiusX/Z`, `innerWallProfile`, `innerRimOffset`, `innerOpeningShape`
- `pitIds[]`, `zoneIds[]`, `wallIds[]`, `speedLineIds[]` — owned children

#### PitData
- A straight-walled hole cut INTO the arena surface (like arenas cut into the octagon base)
- **Always straight walls** — no `wallProfile` field, no moat support
- `posR`, `posAngle` — polar position within the parent arena (not world coords)
- `rotY` — self-rotation
- `seamMesh` — thin ring mesh bridging the gap between arena surface and scoop rim
- `pitIds[]`, `zoneIds[]` — pits can have nested child pits/zones

#### ZoneData
- Also has `speedLineIds: string[]` — speed lines parented to this zone
- A filled area (water, lava, swamp, poison, sand, ice, void, custom) — a hole that is filled, not open
- **Always parabolic bowl** — no `wallProfile` field; bowl and lid use the fill-type color
- Same positioning as PitData
- `lidMesh` — curved surface conforming exactly to the parent arena bowl curvature, sitting at the rim. Writes stencil so the fill wave is clipped to the lid shape. Supports opacity/phasing via `fillOpacity`.
- `fillMesh` driven by `WAVE_VERT`/`WAVE_FRAG` vertex-displacement shader for animated liquid surfaces; stencil-clipped by lid
- `seamMesh` — thin ring mesh (fill color) bridging arena surface to scoop rim
- `fill`, `fillColor`, `fillOpacity`, `fillGlow` — preset or custom appearance
- Supports moat (`isMoat`) and nested children (`pitIds[]`, `zoneIds[]`)

#### WallData
- Rim-mounted barrier extruded from a parent attachment surface (arena rim, bridge deck, or octagon base)
- `parentType`: `'arena'` | `'bridge'` | `'base'`
  - `'arena'`: attaches to the arena rim at `rimY = baseConfig.height + arena.posY`; arc controlled by `fullPerimeter` / `arcStart` / `arcEnd`
  - `'base'`: free-standing on the octagon base; position/rotation set via `basePosX`, `basePosZ`, `baseRotY`, `baseLength`
  - `'bridge'`: attaches to a bridge deck edge (rebuilt alongside bridge segments)
- **Tilt convention**: 0° = vertical (perpendicular to rim). Negative = inward (top sweeps toward arena centre; at −90° the wall is horizontal — a full lid/overhang). Positive = outward (top swings away, like a door hinge opening outward). Range: [−90°, +30°]. Base edge is always fixed at the rim.
- **Full-perimeter tilt rule**: if `fullPerimeter=true AND !hasGaps`, tilt is forced to 0° — a closed ring has no free edge to hinge from. Enabling partial arc OR gaps allows tilt.
- **Gap pattern**: `hasGaps=true` splits the arc into alternating solid panels and open gaps. Both `gapWidth` and `panelWidth` minimum = `MIN_WALL_GAP` (10 cm). Pattern is arc-length based, starting with a panel at `arcStart`.
- **Minimum height**: `MIN_WALL_HEIGHT` = 10 cm. Enforced in geometry builder and UI.
- `topProfile`: `'flat'` | `'triangles'` | `'waves'` | `'serrated'` | `'crenellated'` — shape modulation applied to the top edge
- `isDouble`: /\ cross-section — two halves meeting at `peakHeight`, each leaning outward by `peakTilt`
- `holes[]`: punched openings (circle, rectangle, hexagon, triangle, star) at UV positions along the wall face
- `material: ArenaMaterial` — physics material (rubber | stone | abs | metal); defaults to `'abs'`
- `mesh`, `edges` — nullable Three.js objects; built by `buildWallGeometry` / `buildWallEdgeGeometry` in `wallBuilders.ts`

#### BridgeData
- Logical container for a chain of segments; holds **no geometry of its own**
- `startRef: BridgeEndpointRef | null` — null = floating bridge (valid); non-null = anchored to arena rim or freepoint
- `segmentIds[]` — ordered chain; each segment's start pose is the end pose of the previous one
- `section: BridgeSection` — bridge-level cross-section shared by ALL segments: `width`, `crossSection` (`'flat'` | `'u_channel'`), `depth` (U-channel only), side walls, `material`
- **Cross-section invariant**: gutter shape never changes when adding/removing segments. Only path shape changes. Never give a segment its own cross-section override.
- `wallIds[]` — child walls mounted on the bridge deck
- `group: THREE.Group` — Three.js container for all segment meshes; added to scene once on bridge creation

#### BridgeSegmentData
- One path piece in a bridge chain; owns path shape only, not cross-section
- `type: BridgeSegmentType`: `'straight'` | `'curve'` | `'ramp'` | `'bezier'` | `'loop'` | `'hairpin'` | `'corkscrew'` | `'chicane'`
- `orderIndex` — position in chain (0-based); updated automatically when segments are removed
- Start pose is computed by chaining `computeSegmentEndPose` from the bridge's `startRef` through all prior segments
- `mesh`, `edges` — nullable; rebuilt by `applySegment()` whenever any earlier segment or bridge section changes
- Changing any segment triggers `applyBridgeFromSegment(segId)` which rebuilds that segment and all subsequent ones

#### SpeedLineData
- A guided path painted onto the arena bowl surface that exerts physics forces on beyblades that touch it
- Composed of **`SpeedLineSegment[]`** — each segment is a forward-marching block with `length`, `rotX/Y/Z` (pivot angles), `speedMult`, and `objRotX/Y/Z` (object spin rates). Segments are chained: start direction + per-segment yaw/pitch/roll = full path
- `startR`, `startAngle`, `startDir` — polar start position + initial heading on the arena surface
- `surfaceFollow: boolean` — when true the ribbon is projected onto the bowl surface (Y from `surfFn`); false = flat XZ plane
- **Target**: `targetType` (`beyblade | water | obstacle | item | any | custom`) + `targetTag`
- **Activation modes**: `always` | `event` (trigger/end event names) | `periodic` (period + duty) | `proximity` (activationRadius + fade in/out)
- **Physics**: `speedMultiplier` (global scale), per-segment `speedMult`; `entryCondition` (`always | moving_only | fast_only | slow_only`); `exitBehavior` (`normal | launch | loop | special_move`); `launchForce`; `overridePhysics`
- **Oscillation**: `oscillate` flag; `oscAxis` (`path | lateral | normal | all`); `oscAmplitude`, `oscFrequency`, `oscPhase`
- **Direction**: `forward | reverse | bidirectional`; `swapPriority` for bidirectional conflict resolution
- **Appearance**: `width`, `color`, `opacity`, `glowColor`
- `mesh` — ribbon `THREE.Mesh` (surface-projected, `DoubleSide`, transparent)
- `edges` — centerline `THREE.LineSegments`
- `markerMeshes[]` — start/end arrows, direction arrows, activation radius ring
- `handleMeshes[]` — interactive drag handles (one per joint + start); hidden unless selected
- `overlapMarkers[]` — sphere meshes shown where paths cross (rebuilt on any change)
- `totalLength` — computed arc length in cm
- **All Speed Line meshes** are positioned in world space with `position.set(arena.posX, 0, arena.posZ)` + `rotation.y = arena.rotY` — geometry bakes arena-local coordinates directly

#### ArenaMaterial (physics material)
Independent of `SurfaceType` (visual texture). Controls restitution, spin loss, and damage on impact.

| Material | Restitution | Spin Loss | Damage | Available on |
|----------|-------------|-----------|--------|-------------|
| `rubber` | 0.15 | 0.05 | 0.20 | Walls only |
| `stone`  | 0.40 | 0.12 | 0.55 | Walls + Bridges |
| `abs`    | 0.65 | 0.15 | 0.70 | Walls + Bridges |
| `metal`  | 0.90 | 0.20 | 1.00 | Walls + Bridges |

Presets are in `ARENA_MATERIAL_PRESETS` in `arenaConstants.ts`. The PBR lookup tables in `materialBuilders.ts` and `floorProfileBuilders.ts` include all four materials — add `rubber` entry whenever a new PBR table is introduced.

---

### Key geometry functions

Geometry lives in `src/geometry/` — never in `ArenaSandbox.ts`.

| Function | File | Purpose |
|----------|------|---------|
| `buildParabolicBowl(pts, depth, baseY, holes?)` | `bowlBuilders.ts` | Main arena bowl mesh; skips triangles in `holes` |
| `buildStraightCut(pts, depth, baseY)` | `bowlBuilders.ts` | Straight-wall arena variant |
| `buildMoatGeometry(outerPts, innerPts, ...)` | `bowlBuilders.ts` | Ring moat bowl with inner rise |
| `buildScoopGeometry(pts, depth, profile, cx, cz, rotY, surfFn)` | `scoopBuilders.ts` | Surface-conforming bowl for pits/zones — vertex Y follows arena curvature; `RIM_EPS` lifts rim above surface |
| `buildScoopEdgeLines(...)` | `scoopBuilders.ts` | Surface-conforming edge wires |
| `buildScoopLidGeo(pts, cx, cz, rotY, surfFn)` | `scoopBuilders.ts` | Zone lid — calls `buildScoopGeometry(depth=0, parabolic)` so the lid conforms exactly to the parent arena bowl curvature |
| `buildScoopSeam(pts, cx, cz, rotY, surfFn)` | `scoopBuilders.ts` | Thin N-quad ring bridging arena surface to scoop rim; eliminates jagged-triangle artifacts at the cut boundary |
| `buildIslandCapGeo(arena, holes?)` | `platformBuilders.ts` | Flat disc at inner island top; `holes` cut for child arenas |
| `buildArenaFloorGeo(arena, pits, zones)` | `platformBuilders.ts` | Flat floor for straight-wall arenas with cutouts |
| `buildTopFaceGeo(...)` | `platformBuilders.ts` | Octagon top face with arena-opening holes |
| `buildZoneFillGeo(zone)` | `fillBuilders.ts` | Tessellated disc/ring for wave-shader liquid surface |
| `buildFillBowlMaterial(fc)` | `materialBuilders.ts` | Fill-colored MeshStandardMaterial for zone bowl walls and seam |
| `buildFillLidMaterial(fc, opacity, stencilRef)` | `materialBuilders.ts` | Fill-colored lid material: visible + stencil-write for fill-wave clipping |
| `buildWallGeometry(wall, rimPts, rimY, cx, cz)` | `wallBuilders.ts` | Wall mesh — handles tilt, gaps, double wall, top profile |
| `buildWallEdgeGeometry(wall, rimPts, rimY, cx, cz)` | `wallBuilders.ts` | Wall wireframe edges |
| `arcFilterPts(rimPts, arcStart, arcEnd)` | `wallBuilders.ts` | Interpolated sub-arc of rim polygon for partial-perimeter walls |
| `defaultWallData(id, name, parentId, parentType)` | `wallBuilders.ts` | Default WallData factory |
| `buildSegmentDeckGeometry(seg, startPose, section)` | `bridgeSegmentBuilders.ts` | Bridge segment deck mesh — sweeps cross-section along sampled path |
| `buildSegmentEdgeGeometry(seg, startPose, section)` | `bridgeSegmentBuilders.ts` | Bridge segment wireframe |
| `sampleSegmentPath(seg, startPose)` | `bridgeSegmentBuilders.ts` | Returns `BRIDGE_SEGMENT_SAMPLES` poses along the segment path |
| `computeSegmentEndPose(seg, startPose)` | `bridgeSegmentBuilders.ts` | End pose of segment — used to chain subsequent segments |
| `resolveStartPose(ref, arenas, walls, baseHeight)` | `bridgeSegmentBuilders.ts` | Convert arena rim angle / freepoint ref → world SegmentPose |
| `defaultBridgeSection()` | `bridgeSegmentBuilders.ts` | Default BridgeSection factory |
| `defaultSegment(id, name, bridgeId, orderIndex, type)` | `bridgeSegmentBuilders.ts` | Default BridgeSegmentData factory |
| `computeSegmentPath(sl, surfFn)` | `speedLineBuilders.ts` | Walks all segments, accumulates positions → `THREE.Vector3[]` |
| `computeJoints(pts)` | `speedLineBuilders.ts` | Extract joint positions (one per segment boundary + start) for handle placement |
| `buildRibbon3D(pts, normals, width)` | `speedLineBuilders.ts` | Flat ribbon `BufferGeometry` perpendicular to path, projected by normals |
| `buildStartMarker / buildEndMarker` | `speedLineBuilders.ts` | Colored sphere meshes at path endpoints |
| `buildArrowMeshes(pts, color, dir)` | `speedLineBuilders.ts` | Evenly spaced direction arrows along path |
| `buildHandleMeshes(joints, sl)` | `speedLineBuilders.ts` | Interactive sphere handles (one per joint) returned with handle-type metadata |
| `buildActivationRadiusMarker(pt, r, color)` | `speedLineBuilders.ts` | Ring mesh showing proximity activation radius |
| `samplePathForOverlap(sl, surfFn)` | `speedLineBuilders.ts` | Uniform sample for cross-path overlap detection |
| `buildOverlapSphere(pos, color)` | `speedLineBuilders.ts` | Small sphere marking a detected path overlap |
| `pathSurfaceNormal(pt, arena, sl)` | `speedLineBuilders.ts` | Per-point surface normal (bowl gradient or world-up) for ribbon orientation |
| `defaultSpeedLine(name, arenaId, id, zoneId?)` | `arenaObjectBuilders.ts` | Default SpeedLineData factory |
| `buildSpeedLineObjects(sl, arena, zones)` | `arenaObjectBuilders.ts` | Assembles all Three.js objects for a speed line (ribbon, edges, markers, handles) |
| `applySpeedLine(sl, arena, zones, scene, add, remove)` | `arenaObjectBuilders.ts` | Dispose + rebuild all speed line objects in-place |

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
The fill wave uses `EqualStencilFunc` against the lid's `stencilRef` so the wave is clipped precisely to the zone opening. The lid (`lidMesh`) writes stencil with `stencilWrite: true` — one mesh, two duties (visible + clip mask).  
Future fill types (whirlpool, lava flow, tsunami) should be implemented as additional shader presets in `FILL_PRESET` / `FILL_WAVE`, **not** as CPU particle systems.

---

### Surface material system

`buildSurfaceMaterial(opts)` returns a cached `THREE.MeshStandardMaterial` with a procedural canvas texture. Types: `plain`, `checker`, `grid`, `hex`, `stripes`, `dots`, `concrete`, `metal`, `wood`, `ice`, `sand`, `lava_rock`, `custom_png`. All use `side: THREE.DoubleSide`.

---

### Axes helper — axisYOffset

`SandboxOptions.axisYOffset?: number` lifts the `THREE.AxesHelper` and axis labels to that Y so they appear above the scene floor rather than inside bowl geometry. Arena sandbox passes `axisYOffset: 30` (= `OCTAGON_BASE.height`). Beyblade sandbox omits it (defaults 0).

---

### ArenaSandbox internal structure

```
Maps:          arenas, pits, zones, walls, bridges, segments, speedLines
Seq counters:  arenaSeq, pitSeq, zoneSeq, wallSeq, bridgeSeq, segmentSeq, speedlineSeq, slSegSeq
Dep index:     bridgesByArena  — arenaId → Set<bridgeId> (rebuilt on anchor change)
Raycaster:     slRaycaster — used for speed line handle hit-testing on mouse move
Drag state:    slDrag — { slId, handleType, handleIndex, dragPlane } — set on mouse-down, cleared on mouse-up
```

**Speed Line drag-editing**: handles are shown only when the speed line is selected (`_showSlHandles` / `_hideSlHandles`). Mouse-move raycasts against visible handles; mouse-down sets `slDrag`; mouse-move with `slDrag` set repositions the dragged segment joint and rebuilds; mouse-up clears `slDrag`. All done in `ArenaSandbox` mouse event handlers — not in `PropertiesPanel`.

**Dependency rebuild chain**: whenever an arena's geometry changes, call `rebuildDependentsOf(arenaId)`. This reapplies all rim walls attached to that arena, then reapplies all bridges in `bridgesByArena[arenaId]` starting from their first segment.

**Bridge rebuild propagation**: `applyBridgeFromSegment(segId)` reapplies `segId` and every subsequent segment in the chain. Earlier segments are unaffected. Always call this after changing any segment property or the bridge's `startRef` / `section`.

**Scene tree icons**: arenas `⏺`, pits `▼`, zones `◈`, walls `🧱`, bridges `🌉`, segments: straight `━`, curve `↩`, ramp `↗`, loop `⭕`, hairpin `↺`, corkscrew `🌀`, chicane `⟨⟩`, bezier `〜`, speed lines `⚡`.

**Octagon base tree buttons**: `A+` (add arena), `B+` (add bridge), `W+` (add base wall). Arena nodes have `W+` (add rim wall) and `SL+` (add speed line). Zone nodes have `SL+` (add speed line parented to zone).

### Save / load (localStorage)

Key: `bey_arena_arena_sandbox`. **No version field** — `JSON.parse` directly; on any parse error `localStorage.removeItem(key)` and return (no migration, no version check). `PitSave` has no `wallProfile`, `isMoat`, or inner moat fields. `ZoneSave` has no `maskMesh` — use `lidMesh`/`seamMesh` instead.

`ArenaConfig` (top-level save):
- `arenas[]` — each `ArenaSave` includes `walls: WallSave[]` (rim walls) and `speedLines: SpeedLineSave[]`
- `baseWalls: WallSave[]` — free-standing walls on the octagon base
- `bridges: BridgeSave[]` — each includes `segments: BridgeSegmentSave[]` and `walls: WallSave[]`
- `wallSeq`, `bridgeSeq`, `segmentSeq`, `speedLineSeq` — sequence counters

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
- **Wall tilt on closed ring**: A full-perimeter wall with no gaps cannot tilt — the geometry builder forces tilt to 0 automatically. The UI must also disable the tilt slider in this state (full perimeter + no gaps). Enabling partial arc OR gaps re-enables tilt.
- **Bridge cross-section per segment**: Never add cross-section fields to `BridgeSegmentData`. All segments inherit `bridge.section`. Changing the section must trigger `applyBridgeFromSegment(segmentIds[0])` to rebuild all segments.
- **Segment start pose**: The start pose of segment N is the end pose of segment N−1 (or `startRef` for segment 0). Never cache poses — always recompute the chain from the bridge start when any earlier segment changes.
- **ArenaMaterial + PBR tables**: `ArenaMaterial` now includes `'rubber'`. Any `PBR = { abs, metal, stone }` lookup table is a compile error. Always include `rubber: [0.95, 0.00]` (high roughness, non-metallic) in every PBR table in `materialBuilders.ts` and `floorProfileBuilders.ts`.
- **Bridge group double-add**: `bridge.group` is added to the scene once on creation. Never re-add it on segment rebuild — segments are `bridge.group.add(seg.mesh)` children, not direct scene children.
- **Missing wallIds on defaultArena**: `defaultArena()` in `arenaObjectBuilders.ts` must include `wallIds: []` and `speedLineIds: []`. Similarly `defaultZone()` must include `speedLineIds: []`. Omitting any required field causes TypeScript strict errors.
- **Speed line `exitBehavior` vs `direction`**: `'loop'` is a valid `SpeedLineExitBehavior`, not a `SpeedLineDirection` (`'forward'|'reverse'|'bidirectional'`). Use `sl.exitBehavior !== 'loop'` to gate end-marker placement, never `sl.direction !== 'loop'`.
- **Speed line handles on wrong object type**: `handleMeshes` contain `THREE.Mesh` objects; hit-testing returns `THREE.Object3D`. Always cast to `THREE.Mesh` before accessing `.material`. Use `(hits[0].object as THREE.Mesh).material`.
- **`SL` constants namespace**: All speed line tuning values live in the `SL` object in `arenaConstants.ts`. Never inline magic numbers for speed line geometry (e.g. `SL.ARROW_SPACING`, `SL.SURFACE_LIFT`, `SL.HANDLE_RADIUS`).

---

## Architecture rules — coupling prevention

### File responsibility (single reason to change)
| File | Changes when... |
|------|----------------|
| `src/config/arenaConstants.ts` | A world constant, tuning number, or material preset changes |
| `src/types/arenaTypes.ts` | A data model field is added/removed |
| `src/geometry/primitives.ts` | The core ring/edge generation algorithm changes |
| `src/geometry/surfaceUtils.ts` | The arena surface math or coordinate helpers change |
| `src/geometry/bowlBuilders.ts` | Bowl mesh algorithm changes (not the ring math — that's primitives.ts) |
| `src/geometry/scoopBuilders.ts` | Pit/zone scoop algorithm changes |
| `src/geometry/platformBuilders.ts` | Top face or floor algorithm changes |
| `src/geometry/materialBuilders.ts` | A surface texture type or PBR preset is added or changed |
| `src/geometry/fillBuilders.ts` | A zone fill type or shader changes |
| `src/geometry/arenaObjectBuilders.ts` | The Three.js object assembly pattern changes |
| `src/geometry/wallBuilders.ts` | Wall mesh/edge algorithm changes (tilt, gaps, top profile, holes) |
| `src/geometry/bridgeSegmentBuilders.ts` | Bridge path sampling, cross-section sweep, or pose chaining changes |
| `src/geometry/speedLineBuilders.ts` | Speed line path computation, ribbon, handles, arrows, overlap detection changes |

### Allowed import direction (never reverse)
```
arenaConstants + arenaTypes  ←  primitives.ts
                             ←  surfaceUtils.ts
                             ←  bowlBuilders / scoopBuilders / platformBuilders / materialBuilders / fillBuilders
                             ←  wallBuilders.ts
                             ←  bridgeSegmentBuilders.ts
                             ←  speedLineBuilders.ts
                             ←  arenaObjectBuilders.ts  (also imports speedLineBuilders)
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
- Giving bridge segments their own cross-section — cross-section is always `bridge.section`. Segments own path shape only.
- Adding PBR material lookup tables that omit `rubber` — the `ArenaMaterial` type includes `'rubber'` and all tables must handle it.
- Calling `applyWall` for bridge-type walls from outside `applyBridgeFromSegment` — bridge walls rebuild with their parent bridge.
- Skipping `rebuildDependentsOf(arenaId)` after an arena geometry change — omitting it leaves rim walls and anchored bridges stale.
- Adding a `version` field to `ArenaConfig` or any save interface — the project is in development; saves are discarded on parse error, no migration needed.

### When you add a new constant
Add it to `src/config/arenaConstants.ts` with a name. Never inline magic numbers.

### When you add a new geometry builder
- If it generates concentric rings: call `buildParabolicRingGeo` from `primitives.ts`.
- If it positions a pit/zone child: call `extractChildTransform` from `surfaceUtils.ts`.
- If it builds edges: call `buildRimEdges` / `buildFloorAndPillarEdges` from `primitives.ts`.
- If it assembles a Three.js Mesh + edges for arenas/pits/zones: it belongs in `arenaObjectBuilders.ts`.
- Wall geometry → `wallBuilders.ts`. Bridge path/sweep geometry → `bridgeSegmentBuilders.ts`. Speed line ribbon/path → `speedLineBuilders.ts`.

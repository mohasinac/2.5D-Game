# Beyblade Game — Claude Instructions

## Project overview
Phaser (2D RPG layer) + Three.js (3D battle/sandbox rendering) game.
Stack: Vite + TypeScript + Three.js + Phaser (Phaser added when RPG scenes begin).

## Feature audit — MUST read before any Arena Sandbox work

Many Arena Sandbox features are not working as expected. **Before starting any task that touches Arena Sandbox, first verify the relevant feature works end-to-end.** Fix broken behavior before building on top of it.

Known confirmed bugs fixed (2026-06-05):
- Wall `rimY` was `baseConfig.height + arena.posY` instead of `arena.posY` — walls floated 30 cm above rim
- Bridge `resolveStartPose` was passed `baseConfig.height` as `baseHeight` — bridge start Y was 30 cm too high

Known confirmed bugs fixed (2026-06-06):
- Properties panel stale UI: button-group rows (surface, profile, material, theme, shape) showed old highlights after a change because `showWall/showObstacle/showTrap/showPortal` used a single `onChange` callback and never re-rendered. Fixed by two-callback split + local closure re-render (see "Properties panel two-callback pattern" below).
- `saveArena()` was called on every slider drag frame, writing the entire serialized arena to localStorage 60 fps. Fixed with a 300 ms debounce + `_flushSave()` for critical immediate saves.

Known confirmed features added (2026-06-08 — speed line preset system):
- **Speed line preset system**: 24 shape presets (circle, ellipse, polygon, triangle, star, flower/rose_curve, spiral_in, spiral_out, helix, zigzag, wave, cosine_wave, damped_wave, growing_wave, snake, figure_8, lemniscate, trefoil, cardioid, epicycloid, hypocycloid, astroid, point_zone). `custom` mode unchanged.
- **Thread-on-surface projection**: `SceneSurfaceProjector` in `sceneSurfaceProjector.ts`; registered wall/obstacle/bridge meshes; D-shape emerges when shapes cross arena wall boundary; passed to `applySpeedLine`/`buildSpeedLineObjects` as 7th argument.
- **Speed ramp**: profile (constant/accelerate/decelerate/bell/inverse_bell), min/max speed, entry/exit steps.
- **Section system**: `SpeedLineSection[]` in `presetParams.sections` — arc angle, Y offset, max stay, per-section stat modifiers/conditions/color/speed with null=inherit-global.
- **Shape modulation**: 3 modulation types × 11 waveforms applied to XZ waypoints before segment conversion.
- **arcFraction**: half-shapes (0.5 = semicircle, symmetric cut).
- **Stat modifiers**: `SpeedLineStatModifiers` (spinRate/stamina/attack/defense/weight/burstResist multipliers).
- **Surface orient object**: `surfaceOrientObject` + `airNormalMode` + `airNormalTiltDeg`.
- **Base condition**: `baseCondition`/`conditionPhase`/`conditionCheckIntervalMs`/`ejectBehavior`.
- **New target types**: `nearest_opponent`, `nearest_obstacle`, `on_path_obstacle` + `targetSelectionMode`.
- **Width up to 30 cm**: `SL.WIDTH_MAX_OVERRIDE = 30.0` (was 5 cm).

Known confirmed features added (2026-06-09 — expanded wall system + depth constraints):
- **Wall thickness**: `WallData.thickness` (cm, min 0.1, default 2). Geometry builder generates outer face + inner face (reversed winding) + top face + end-cap faces. `buildWallGeometry` and `buildWallEdgeGeometry` both accept `joinStart/joinEnd` booleans to suppress end-cap faces where adjacent walls share an arc boundary.
- **Wall destructibility**: `WallData.isDestructible: boolean` + `WallData.hitPoints: number`. PropertiesPanel shows PHYSICS section with toggle + conditional HP slider.
- **Wall auto-join**: `WallData.autoJoin: boolean` (default true). In `applyWall`, sibling walls on the same arena whose `arcEnd` aligns with this wall's `arcStart` (within 1°) suppress the shared end-cap — seamless closed ring when all arc sections are covered. Sibling walls are rebuilt after every `applyWall` call via a `_rebuildingSiblings: Set<string>` guard to prevent infinite recursion.
- **Walls on trap surfaces**: `parentType: 'trap'`. `trapRimPoints(trap)` returns trap-LOCAL XZ perimeter (centered 0,0); translated to world space in `applyWall` before passing to geometry builders. `trapWorldCenter(trap, arenas)` returns world XZ of the trap center. Add button `🧱+` on trap tree nodes. Trap deletion cascades to child trap walls. Trap walls are serialised inside `TrapSave.walls: WallSave[]`.
- **Moat inner rim walls**: `WallData.moatRing: 'outer' | 'inner'` (default `'outer'`). When parent arena is a moat and `moatRing === 'inner'`, `applyWall` uses inner radius/shape + `posY + innerRimOffset` as the rim Y. PropertiesPanel shows a Ring selector only for moat parent arenas (parentArena must be passed as 7th arg to `showWall`).
- **Wall auto-rotation**: `WallData.rotateOnArena: boolean` + `arenaRotateMode: 'continuous' | 'step' | 'oscillate'`. A `THREE.Group` pivot (`_rotatePivot`) is created at the arena centre; wall mesh/edges are reparented into it. `onTick` advances the pivot's `rotation.y` each frame. Runtime fields `_rotatePivot` and `_arenaRotateTimer` are NOT serialised.
- **Pit depth fixed at 10 cm**: `PIT_FIXED_DEPTH = 10` constant in `arenaConstants.ts`. `defaultPit()` uses it; `addPit` enforces it; PropertiesPanel shows a read-only "10 cm (fixed)" label (no slider).
- **Zone depth min 1 mm**: `MIN_ZONE_DEPTH = 0.1` cm constant. Zone depth slider min is `MIN_ZONE_DEPTH` (was 1).
- **New save fields** (all required — no backward-compat): `WallSave` adds `thickness`, `isDestructible`, `hitPoints`, `autoJoin`, `moatRing`, `rotateOnArena`, `arenaRotateMode`, `arenaRotateSpeed`, `arenaRotateStepDeg`, `arenaRotateStepInterval`, `arenaRotateOscAmp`, `arenaRotateOscFreq`. `TrapSave` adds `walls: WallSave[]`. `ArenaConfig` adds `baseWalls: WallSave[]`. The demo arena config (`demoArenaConfig.ts`) has been updated with all new fields.

Known confirmed features added (2026-06-10 — Preset Library System):
- **Arena & Beyblade Preset Library**: Save multi-feature groupings as reusable named presets; load as merge or replace into any sandbox.
- **SceneTree checkboxes**: Every tree node now has a checkbox (`.tree-chk`) prepended before the caret. Checkboxes are independent of selection — `e.stopPropagation()` prevents triggering row select. `getCheckedIds()` returns `string[]`. `clearChecks()` unchecks all. `onCheck(ids)` callback fires on every change.
- **Save Preset flow (Arena)**: "💾 Preset" button in ArenaSandbox top bar. 0 checked = full scene. N checked = calls `extractArenaConfig(checkedIds, allMaps, baseConfig)` which auto-expands arenas to include child pits/zones/walls/speedLines, bridges to segments+child walls, traps to trap walls. Rotations excluded if any member not in selection. Save modal: Name, Group (with `<datalist>` of existing groups), Description, Tags. Generates canvas thumbnail; writes to `bey_arena_presets` localStorage key.
- **Save Preset flow (Beyblade)**: "💾 Preset" bottom bar button in BeybladeSandbox. 0 checked = full build. N checked = those parts + their sectors. Save modal adds partType selector. Writes to `bey_bey_presets`.
- **ArenaLibraryScreen** (`src/screens/ArenaLibraryScreen.ts`): Grouped preset card browser at `/arena-library`. Cards show thumbnail, name, group badge, tags. Actions: ▶ Load (replace/merge dialog → `bey_pending_arena_load` key → navigate to `/arena`), ✏ Edit (replace mode → `bey_pending_arena_load` → navigate to `/preset-editor`), 🗑 Delete (confirm dialog). Inline rename: double-click name → `contentEditable` → blur/Enter. Group headers collapsible.
- **BeyLibraryScreen** (`src/screens/BeyLibraryScreen.ts`): Two-tab browser at `/bey-library`. Parts tab: filter chips by `BeyPartType`. Builds tab: preset grid + sticky assembly panel (Layer/Disc/Driver/Frame slots). Assembly: pick from floating picker overlays per slot → "▶ Build & Load" merges all configs (same batchTag, stacked axisOffsetY) → `bey_pending_bey_load` → navigate to `/beyblade`. "💾 Save Assembly" saves merged config as `partType: 'full_build'` preset.
- **Preset Editor**: Second `ArenaSandbox` instance with `presetEditorMode: true` at `/preset-editor`. Demo button hidden. Back button and Library button both go to `/arena-library`. Storage key is derived from title so it is independent: `bey_arena_preset_editor`.
- **Pending load pattern**: Library screens write one of two localStorage keys before navigating: `bey_pending_arena_load` or `bey_pending_bey_load`. Format: `{ config, mode: 'replace' | 'merge' }`. The sandbox's `setVisible(true)` calls `_checkPendingLoad()` which reads and immediately deletes the key, then applies the config.
- **ID remapping**: `remapArenaConfigIds(config, batchTag)` does a 2-pass remap — pass 1 registers all IDs (arenas, pits, zones, walls, bridges, segments, speedLines, obstacles, traps, portals, footings, rotations), pass 2 rewrites all cross-reference fields (parentId, parentArenaId, parentZoneId, memberIds, destPortalId, snapRules[].bridgeId, speedPathId, etc.). batchTag = `Date.now().toString(36)` per import operation. Old ID `arena-3` → `arena-{batchTag}-3`. `remapBeyConfigIds` remaps part/sector/group IDs and sectorIds/childIds/rootChildIds.
- **`BeybladeStore.mergeDeserialize(cfg)`**: Appends parts/sectors/groups via `Map.set` without clearing existing data. Appends rootChildIds (dedup). Updates seq counters to max. Counterpart of `deserialize` (which clears first).
- **`ArenaSandboxOptions`**: New interface extending `SandboxOptions` with `onLibrary?: () => void` and `presetEditorMode?: boolean`.
- **`BeybladeSandboxOptions`**: New interface `{ onBack: () => void; onLibrary?: () => void }` replacing the old `(container, onBack)` constructor signature.
- **`presetStore.ts`** utilities: `listArenaPresets`, `saveArenaPreset`, `deleteArenaPreset`, `updateArenaPreset`, `listBeyPresets`, `saveBeyPreset`, `deleteBeyPreset`, `updateBeyPreset`, `newPresetId`, `generateArenaThumb`, `generateBeyThumb`, `remapArenaConfigIds`, `remapBeyConfigIds`, `extractArenaConfig`.
- **New routes**: `/arena-library` (ArenaLibraryScreen), `/bey-library` (BeyLibraryScreen), `/preset-editor` (second ArenaSandbox, presetEditorMode).
- **Landing buttons**: Two new `game-btn--lib` buttons: "Arena Library" and "Bey Library".

Known confirmed bugs fixed (2026-06-07 — env manager wiring, tilt/fog/sub-node cleanup, SpawnManager gravity scale):
- **`_clearArenas` missing `_subNodesAdded.clear()`**: After undo/redo/demo-load, `_subNodesAdded` still contained all old `present-/particle-/weather-/env-` IDs, preventing sub-nodes from being re-added to the tree. Fixed: `this._subNodesAdded.clear()` added at start of `_clearArenas()` after `_envMgr.clear()`.
- **`_createArenaFog` used `'dust'` preset and ignored `fogDensity` for scaling**: Built a dust particle system regardless of fog intent; density was always the `defaultParticleConfig()` default. Fixed: uses `'fog'` preset and sets `density: arena.fogDensity`.
- **`_applyArenaTilt` missing `spiralMeshes`**: Spiral arenas would visually split — bowl tilted but spiral ledge meshes remained upright. Fixed: `for (const m of arena.spiralMeshes ?? []) { m.rotation.x = rx; m.rotation.z = rz; }` added.
- **`_applyArenaTilt` not called after `applyArena`**: `applyArena` recreates mesh with rotation x/z = 0. Tilt was lost after any arena geometry change (shape/profile/surface edits in PropertiesPanel, `rebuildBase`, weather surface-map changes in `_onEnvChange`). Fixed: `this._applyArenaTilt(arena)` added immediately after each `applyArena(...)` call in all three sites.
- **`ArenaEnvironmentManager` interval timer init could go negative**: `entry._timer = entry.intervalSec - entry.delaySec` — if `delaySec > intervalSec`, timer starts negative and the first fire happens immediately on the next tick. Fixed: `Math.max(0, entry.intervalSec - entry.delaySec)`.
- **`ArenaEnvironmentManager._fireEntry` revert timer didn't restart on second fire**: Guard `if (!entry._prevValues)` prevented `_revertTimer` from resetting to 0 on subsequent fires during an active revert. Fixed: snapshot guard kept but `entry._revertTimer = 0` moved outside — always resets when `revertSec > 0`.
- **RPM wrap detection failed for negative omega**: `Math.floor(wrapped/2π) > Math.floor(prevAngle/2π)` only detects forward wraps; negative speed never triggers. Fixed: `!==` comparison catches both CW and CCW full-revolution wraps.
- **Arena delete left sub-node IDs in `_subNodesAdded`**: After deleting an arena, its `present-/particle-/weather-/env-` entries remained in `_subNodesAdded`, blocking re-use of those IDs on new arenas with the same IDs. Fixed: four explicit `_subNodesAdded.delete(...)` calls added in the arena-delete block.
- **`EnvProperty` inline import in `_onEnvChange`**: Method signature used `import('../types/arenaTypes').EnvProperty[]` inline type. Fixed: `EnvProperty` added to the top-level named import from `'../types/arenaTypes'`.
- **`_envMgr` instantiated after `loadArena()` in `buildCustom()`**: Any code path that called `this._envMgr.method()` without `?.` during the load phase (e.g. trap RPM/earthquake env-trigger dispatch) would crash because `_envMgr` was `undefined`. Fixed: moved `new ArenaEnvironmentManager(...)` to before `this.loadArena()`.
- **`ArenaEnvironmentManager.addEntry()` timer not clamped**: `entry.intervalSec - entry.delaySec` was negative when `delaySec > intervalSec`, causing the entry to fire on the very next tick. The `tick()` path had the `Math.max` fix but `addEntry()` did not. Fixed: `Math.max(0, entry.intervalSec - entry.delaySec)` in `addEntry()`.
- **Redundant `saveArena()` in `onPhysicsChange`**: `setGravity()` calls `_onEnvChange()` which already calls `saveArena()`. The `onPhysicsChange` callback also called `saveArena()` — double-debounce, second write was a no-op but wasteful. Fixed: removed the redundant `saveArena()` from the callback.
- **Score HUD showed stale `0 pts` for arenas with `scoreMultiplier !== 1` but zero `pointsPerSecond`**: The HUD condition `pointsPerSecond > 0 || scoreMultiplier !== 1` showed a score row that never incremented. Fixed: condition is now `pointsPerSecond > 0` only.
- **`_onEnvChange` weather surface-map path missing `updateArenaChildren()` + `rebuildDependentsOf()`**: When a weather keyframe changed the arena surface, `applyArena()` rebuilt the mesh but rim walls and anchored bridges referencing the arena rim were not rebuilt. Fixed: `updateArenaChildren(arena)` and `rebuildDependentsOf(arenaId)` added after `applyArena()` + `_applyArenaTilt()`.
- **SpawnManager ignored `arena.gravityScale`**: Physics test ball always fell at the hardcoded `GRAVITY` constant regardless of the env-panel gravity scale slider. Fixed: `_resolveSurface()` now tracks `_currentGravityScale` from the best-matching arena; `_applyGravity()` multiplies `GRAVITY` by `_currentGravityScale`.

Known confirmed features added (2026-06-10 — sub-node system, PresentConfig, particle/weather/gravity):
- **`src/types/sharedTypes.ts`** (new): `PresentConfig`, `defaultPresentConfig()`, `ParticleConfig`, `defaultParticleConfig()`, `ParticlePreset`, `ParticleSystem`, `WeatherSystem` — shared across arena and beyblade types.
- **Arena `ARENA_SAVE_VERSION = 12`**: Currently at 12 (bumped from 9 through intermediate versions). Old saves discarded. New fields on `ArenaData`/`ZoneSave`/etc.: `particleConfig: ParticleConfig` (replaces bare `particlePreset`), `weatherPreset/windEnabled/windDirectionDeg/windStrengthCms/windGustInterval/windGustMult` on `ArenaData`, `innerSpiralTurns/Count/Clockwise/LedgeWidth/LedgeHeight/RadiusFrac` on `ArenaData`/`ZoneData`.
- **Beyblade `BEY_SAVE_VERSION = 2`**: Bumped from 1; old saves discarded. `PartData` now has `present: PresentConfig` + `particleConfig: ParticleConfig` (replaces `presentationSTLb64`/`presentationColor`).
- **Sub-feature tree nodes** (both sandboxes): On-demand optional child nodes added via `+` button on feature nodes. IDs: `present-{featureId}`, `particle-{featureId}`, `weather-{arenaId}`, `env-{arenaId}`. Not reparentable (silently ignored in `_onReparent`). Selection routed by ID prefix in `onSelect`.
- **`PresentationManager`** (`src/features/managers/PresentationManager.ts`): Centralized STL present-mesh logic. `load(nodeId, config, worldPos)`, `dispose(nodeId)`, `disposeAll()`, `applyViewMode(mode, hitboxMap)`, `tick(dt)`.
- **BeybladeRenderer**: `applyPresentTransform(partId)` applies PresentConfig scale/rotation/offset to existing present mesh. `clearPresentMesh(partId)` removes it. `loadPresentationSTL` now applies all PresentConfig transforms.
- **Duplicate support** (`SceneTree.onDuplicate`): Right-click context menu "Duplicate" fires `onDuplicate(id)`. Both `BeybladeSandbox._duplicateNode` (parts+sectors, groups) and `ArenaSandbox._duplicateNode` (arenas, obstacles, footings, traps, portals, walls, pits, zones) are implemented. Bridges, speed lines, rotations, sub-nodes are skipped silently.
- **`AbstractPropertiesPanel.numRow()`**: Slider now uses `input` event for display-only update + `change` event (mouseup/touchend) for `onChange`. Number input blur/Enter unchanged. Eliminates 60fps geometry rebuilds on slider drag.
- **Moat spiral parity**: Inner wall profile row now includes `↺ Spiral` option. `_spiralSubOptions` / `_innerSpiralSubOptions` helper methods extracted and reused for both moat outer/inner wall sections. Step/Spiral Appearance sections no longer blocked by `!data.isMoat`.
- **Step color in arenaObjectBuilders**: `applyArenaColor` is moat-aware — uses `data.stepsColor`/`stepsSurface` when wall profile is `step` even for moat arenas. `buildArenaObjects` and `applyArena` also apply step color.
- **WallManager.fromSave()**: Now restores `topAmplitude` and `topFrequency` fields.
- **Weather system** (`src/geometry/weatherBuilders.ts`): `buildWeatherSystem(preset, windEnabled, windDeg, windStrength, gustInterval, gustMult, arenaRadius, baseY)` → `WeatherSystem`. Presets: rain, snow, fog, sandstorm, ash, mist. `tick(dt)` animates particles + gusts. `windForce` applied to beyblades each tick.
- **Gravity pull trap**: `TrapEffect` and `TrapVariant` include `'gravity_pull'`. `TrapData` has `gravityRange/Strength/Mode/PulseInterval/PulseWidth` + runtime `_gravityTimer`. PropertiesPanel `showTrap` renders GRAVITY PULL section when `data.effect === 'gravity_pull'`.
- **RPG layer** (`src/rpg/`, `src/screens/RPGScreen.ts`, `src/screens/admin/AdminHubScreen.ts`, sub-screen stubs): Phaser-based RPG world with dialogue, cutscenes, minigames, inventory, shop, map editor, save system. Admin Hub has 7 sub-tool stubs (Sprite/Tile/Map/Sound/Dialogue/Cutscene/MiniGame).

Known confirmed bugs fixed (2026-06-07 — bridge track + arena bowl session):
- **Bridge segment connection gaps**: `_segmentStartPose` called `computeSegmentEndPose(prev, pose)` without `bridge.section`; loop segments need section width for helix lateral offset. Fixed: `computeSegmentEndPose(prev, pose, bridge.section)`.
- **Bridge delete not updating 3D render**: Segment meshes are children of `bridge.group`, not scene root — `scene.remove(seg.mesh)` was a no-op. Fixed: use `bridge.group.remove(seg.mesh/edges)` in both `removeSegment` and `_disposeBridge`.
- **New bridge segment types**: `return_loop` (180° vertical reversal arc, icon `↩⭕`) and `exit_loop` (90° upward arc, icon `↑⭕`). `loopRadius` controls arc radius. Added to segment type grid in PropertiesPanel.
- **Bridge segment drag-and-drop reorder**: `sceneTree.onReparent` in `ArenaSandbox` reads new order from `sceneTree.getChildIds(bridgeId)`, updates `bridge.segmentIds` + per-segment `orderIndex`, then calls `applyBridgeFromSegment(newOrder[0])`. `SceneTree.getChildIds(id)` method added.
- **Per-segment color override**: `seg.color: number | null` and `seg.surface: SurfaceType | null`; `null` = inherit from `bridge.section`. PropertiesPanel shows toggle + color picker; `applySegment` uses `seg.color ?? sec.color`.
- **Arena bowl z-fighting / moire flickering**: `topFaceMesh` material now uses `polygonOffset: true` (factor 2, units 2) in all three creation paths. `SurfaceMaterialOpts.polygonOffset?: boolean` added to type; `_matKey` includes `:po` suffix when set; `buildSurfaceMaterial` applies the Three.js polygon-offset flags.
- **Arena bowl missing outer skirt**: Non-elevated arenas used bare `buildParabolicBowl`/`buildStraightCut` with no outer vertical wall. `buildArenaBowlGeo` now calls `buildFreeArenaMesh` for non-elevated non-step non-moat arenas (outer skirt + bottom cap). `updateArenaBowlHoles` updated to match. `buildFreeArenaMesh` now always uses `TESS.PARABOLIC_BOWL` (64 rings) instead of `TESS.STRAIGHT_BOWL` (48).
- **Non-smooth arc blends in stepped bowl**: `buildSteppedBowl` pre-computes profiles for all `SEG` angular segments. When a step segment is adjacent to a non-step segment, boundary-side vertices are blended to `parabY(t)` via `bY(rawY, t, isA0side)` — eliminating the hard visual seam. Stepped bowl also gains an outer skirt using `xAt(1,a)/zAt(1,a)` rim positions.
- **Ramp mode stale properties panel**: Ramp mode buttons called `onGeomChange()`, skipping `renderProps()`. Fixed to `onFullChange()` so angle/width sub-rows appear/hide immediately.

Known confirmed features added (2026-06-07 — bridge animation, env system, earthquake/RPM traps, SL linking, jump links):
- **`ARENA_SAVE_VERSION = 12`**: Bumped from 9; old saves discarded. New required fields in `BridgeSegmentSave` (anim\*), `ArenaSave` (env/physics), `TrapSave` (eq\*/rpm\*/proj\*), `ArenaConfig` (`jumpLinks`, `jumpLinkSeq`). All are optional `?` in save types to avoid version collisions.
- **Bridge segment animation**: `BridgeSegmentData` gains `animEnabled`, `animOffsetX/Y/Z`, `animRotX/Y/Z`, `animStartMs`, `animIntervalMs`, `animHoldMs`. Each segment's mesh+edges are parented to `seg._animPivot: THREE.Group` positioned at the segment bounding-box center (`seg._animCenter`). Tick-based square-wave: OFFSET state for `animHoldMs`, HOME state for remainder of `animIntervalMs`, starts after `animStartMs` delay. Runtime fields `_animTimer`, `_animCenter`, `_animPivot` are NOT serialised. PropertiesPanel `showBridgeSegment` now accepts a 4th `onFullChange?: () => void` arg used for the SEGMENT ANIMATION toggle row (shows/hides offset/rotation sub-rows). Toggle off resets `_animTimer = 0` to prevent mid-cycle jump on re-enable.
- **`ENV` constants** in `arenaConstants.ts`: `DEFAULT_GRAVITY_SCALE`, `MIN/MAX_GRAVITY_SCALE`, `DEFAULT_TILT`, `MAX_TILT`, `DEFAULT_FOG_DENSITY`, `DEFAULT_SCORE_MULTIPLIER`, `DEFAULT_WEIGHT_SENSITIVITY`, `DEFAULT_WEIGHT_DAMPENING`, `DEFAULT_INTERVAL_SEC`, `DEFAULT_REVERT_SEC`.
- **ArenaData environment/physics fields**: `gravityScale/DirectionX/Z`, `tiltX/Z`, `weightTiltEnabled/Sensitivity/Dampening`, `fogDensity`, `scoreMultiplier`, `pointsPerSecond`, `weatherSurfaceMap: Partial<Record<WeatherPreset, SurfaceType>>`, `envSchedule: EnvScheduleEntry[]`. Runtime-only (not saved): `tiltGroup?: THREE.Group`, `fogSystem?: ParticleSystem | null`, `_score: number`, `_envTriggerCooldown?: number`.
- **`EnvScheduleEntry` / `EnvKeyframe`** types: `EnvScheduleEntry` has `id`, `label`, `enabled`, `triggerType` (`'interval'|'once'|'event'`), `eventName`, `intervalSec`, `delaySec`, `revertSec`, `keyframes: EnvKeyframe[]`, `soundEvent?`, runtime `_timer/_revertTimer/_prevValues`. `EnvKeyframe` = `{ property: EnvProperty, value: number|string|boolean }`. `EnvProperty` union covers gravity/tilt/fog/score/weather fields.
- **`ArenaEnvironmentManager`** (`src/features/managers/ArenaEnvironmentManager.ts`): implements `ITickableManager`. `tick(dt)` processes `envSchedule` per-arena (interval/once triggers, revert timers, score accumulation). Public: `setGravity/setWeather/setTilt/setFog/setScoreMultiplier/addScore`, `triggerEvent(arenaId, eventName)`, `addEntry/removeEntry/updateEntry/clearSchedule(arenaId)`, `clear()`.
- **TrapData new fields**: `envTriggerEvent: string`, `envTargetArenaId: string` (for traps that fire arena env events on activation). Earthquake: `eqRingCount`, `eqSegmentsPerRing`, `eqMaxElevationCm`, `eqElevationMode` (`'random'|'wave'|'ripple'|'checkerboard'`), `eqRingRanges: number[]`, `eqPermanent`, `eqFadeCycles`, `eqPulseMode/IntervalMs/WidthMs`. RPM: `rpmSpeed`, `rpmEffect`, `rpmRange`, `rpmMatchSpin`, `rpmForceScale`, `rpmPulseMode/IntervalMs/WidthMs`. Projectile: `projLaunchMode`, `projCount`, `projSpreadAngleDeg`, `projBurstCount/DelayMs`, `projLaunchDelayMs/AngleDeg`, `projRandomizeAngle`, `projPattern/PatternCount`, `projConfig: ProjectileConfig`, `projPulseMode/IntervalMs`. Runtime-only: `_eqTimer`, `_eqCycleCount`, `_eqTargetHeights`, `_eqCurrentHeights`, `_eqPhase`, `_rpmCurrentAngle`, `_rpmTimer`, `_rpmActive`. New `TrapEffect`/`TrapVariant` values: `'earthquake'`, `'rpm'`, `'projectile'`.
- **`TrapManager.ts`** now implements `ITickableManager`. `tick(dt)` handles earthquake height animation, RPM disc rotation (`variantMesh.rotation.y`), and plate spin (`projPlateSpin`).
- **New trap builders**: `buildEarthquakeMesh(data, surfY)` (ring×sector grid, `DYNAMIC_DRAW`), `updateEarthquakeMeshHeights(data)` (mutates position Y), `buildRPMMesh(data)` (alternating-sector rotor disc), `buildProjectileMesh(cfg)` (bullet source visualization).
- **`SpeedLineData` linking fields**: `linkedBridgeId: string | null`, `linkedTrapId: string | null` (this SL was auto-created for a bridge/trap), `enabled: boolean` (false = mesh hidden, no rebuild), `targetBridgeId: string | null`, `targetTrapId: string | null` (activation condition — SL fires when beyblade is on this bridge/trap). `SpeedLineTargetType` gains `'linked_bridge'` and `'linked_trap'`.
- **`JumpLinkData`** (new): two-endpoint launch mechanic. Fields: `id`, `name`, `parentArenaId`, `endpoint[A|B]` (`JumpLinkEndpoint`: posR/posAngle/dirDeg/parentType/parentId), `flight: JumpFlightConfig` (launchAngleDeg, launchForce, gravityScale, airDrag, landingImpact, landingBounce), `flightStatModifiers: JumpFlightStatModifiers`. Saved in `ArenaConfig.jumpLinks: JumpLinkSave[]` + `jumpLinkSeq`. `JL` constants in `arenaConstants.ts`. Arena tree node `⤻+` button adds jump links; tree icon `⤻`.
- **Wall `thicknessDirection`**: `WallData.thicknessDirection: 'inward' | 'outward'` (default `'outward'`). In `wallBuilders.ts`, `dirMult = thicknessDirection==='inward' ? 1 : -1`. Outward wall thickness is clamped to octagon boundary via `computeMaxOutwardDist`. PropertiesPanel shows `Thickness Side` selector after the thickness numRow.
- **`innerRimShapePoints(arena)`** in `arenaObjectBuilders.ts`: returns inner moat island rim perimeter points for use by WallManager moat-inner walls.
- **`defaultSpeedLine()` updated**: new fields defaulted — `linkedBridgeId: null`, `linkedTrapId: null`, `enabled: true`, `targetBridgeId: null`, `targetTrapId: null`, `jumpLinkId: null`. `buildSpeedLineObjects` checks `sl.enabled !== false` before showing mesh/edges/markers.

Known confirmed bugs fixed (2026-06-07 — env system ID bug, missing restore fields):
- **`ArenaEnvironmentManager` used `arena.id`**: `ArenaData` has no `id` field (ID is the Map key). Fixed: `for (const [arenaId, arena] of this.getArenas().entries())` and `_fireEntry(arenaId, arena, entry)`.
- **`_loadArenasFromConfig` missing new env fields**: Arena construction in restore path was missing all `gravityScale/tilt/weightTilt/fogDensity/scoreMultiplier/pointsPerSecond/weatherSurfaceMap/envSchedule` fields. Fixed: all added with `?? ENV.DEFAULT_*` fallbacks.
- **Bridge `_animTimer` not reset on toggle off**: When `animEnabled` toggled off in PropertiesPanel, `_animTimer` kept accumulating. Re-enabling caused mid-cycle jump. Fixed: `if (!v) seg._animTimer = 0` in the toggleRow callback.
- **SpawnManager octagon base fallback at Y=0**: `_resolveSurface` used `bestSurfY = 0` as the octagon fallback — but the octagon top face is at `DEFAULT_BASE_HEIGHT` (30 cm). Fixed: `bestSurfY = DEFAULT_BASE_HEIGHT`. Also added `DEFAULT_BASE_HEIGHT` to the import from `arenaConstants`.
- **SpawnManager wall rim Y missing base height**: `_resolveWalls` computed `const rimY = arena.posY` — world rim Y = `DEFAULT_BASE_HEIGHT + arena.posY`, not just `arena.posY`. Wall height culling was off by 30 cm (octagon base thickness), causing all arena walls to pass the cull test incorrectly. Fixed: `const rimY = DEFAULT_BASE_HEIGHT + arena.posY`.

Known confirmed bugs fixed (2026-06-07 — deep audit session):
- **`_mergeConfigIntoScene` missing `jumpLinkSeq`**: When merging a preset into the scene, all sequence counters were updated except `jumpLinkSeq`. After merging, new jump links created by the user would start at seq=0 and collide with existing IDs. Fixed: `this.jumpLinkSeq = Math.max(this.jumpLinkSeq, remapped.jumpLinkSeq ?? 0)` added in `_mergeConfigIntoScene`.
- **`showBridgeSegment` animation sub-rows missing `onGeomChange()`**: All 9 animation parameter rows (`animOffsetX/Y/Z`, `animRotX/Y/Z`, `animStartMs`, `animIntervalMs`, `animHoldMs`) were silently mutating data without calling `onGeomChange()`. Changes were applied visually in the running tick but lost on page reload. Fixed: all 9 callbacks now call `onGeomChange()`.
- **`showObstacle` theme and speed path selectRows missing `onGeomChange()`**: `data.theme` and `data.speedPathId` mutations had no callback — changes were lost on reload. Fixed: both selectRows now call `onGeomChange()`.
- **`showTrap` speed path selectRow missing `onGeomChange()`**: `data.speedPathId` mutation had no callback — same issue as obstacle. Fixed: now calls `onGeomChange()`.
- **`WallManager.fromSave()` missing `thicknessDirection` restoration**: `thicknessDirection` was absent from the `Object.assign()` block in `fromSave()`. On every save/load round-trip, all walls reverted to the default `'outward'` regardless of what was saved. Fixed: `thicknessDirection: save.thicknessDirection ?? 'outward'` added to the assign block.

Known confirmed features added (2026-06-07 — SpawnManager physics test top):
- **`src/geometry/surfaceUtils.ts`** — `worldToArenaLocal(wx, wz, arena)` export added (inverse rotation of arena.rotY; companion to `polarToLocalXZ`). Used by SpawnManager and available to all managers.
- **`src/features/managers/SpawnManager.ts`** (new): Physics probe — a pyriform spinning-top entity that can be spawned into the Arena Sandbox to interactively test geometry, speed lines, traps, zones, and wall collisions.
  - **Pyriform geometry**: `THREE.Group` of 4 sub-meshes — cap (dark blue, narrow), disc plate (red-orange, `BALL_RADIUS = 5 cm`), ribbed cone body (tan, `CylinderGeometry(topR, bottomR)` — NOT `ConeGeometry` which has backwards orientation), silver tip. Total height 13.5 cm.
  - **Group origin = disc CENTRE (y=0)**; tip is at `BALL_TIP_OFFSET = -10 cm` below origin. Floor contact uses tip: `pos.y + BALL_TIP_OFFSET <= surfY`.
  - **Physics pipeline per tick**: auto-move → WASD input (camera-relative) → gravity → integrate → bowl surface resolve → wall resolve → speed line forces → trap effects → zone effects → T-key trigger → respawn check → self-rotation → camera follow → sync group position → HUD update.
  - **Bowl surface resolution** (`_resolveSurface`): iterates all arenas via `worldToArenaLocal` + `arenaSurfaceYAtArenaLocal`; tip-contact (not sphere); `MAT_RESTITUTION` per `arena.baseMaterial`; octagon base fallback at `DEFAULT_BASE_HEIGHT` (30 cm).
  - **Wall collision** (`_resolveWalls`): ellipse outward-normal in arena-local space, rotated to world via `arena.rotY`; gap respects `thicknessDirection` — outward walls (default) collide at `rimDist`, inward walls at `rimDist − thickness`; arc coverage check (`arcStart/arcEnd/fullPerimeter`); `MAT_RESTITUTION` per `wall.material`; records `_lastCollisionTime`.
  - **Speed line ribbon physics** (`_applySpeedLines`): uses `computeSegmentPath` (same function as the ribbon mesh builder — future-proof for all 24+ preset types). 500ms path cache. Checks `sl.enabled` (skips disabled ribbons). Activation mode (`always/proximity/periodic/event`), entry condition, segment/section `speedMult`, direction (`forward/reverse/bidirectional`), exit behavior (`launch` applies impulse + upward kick). Post-collision 300ms window expands contact range ×1.30 (normal) or ×1.20 (sticky).
  - **Trap effects** (`_applyTraps`): shape-precise footprint (circle/ellipse/rectangle/hexagon); vertical proximity check via tip Y; applies `damage/heal/launch/gravity_pull/freeze`. `_applyTrapEffect` is shared with T-key trigger.
  - **Zone fill effects** (`_applyZones`): ice (near-zero friction), lava (HP drain 15/s), water (strong drag), sand (medium drag), poison/swamp (slow HP drain + drag), void (heavy HP drain).
  - **T-key trigger** (`_applyTrigger`): finds nearest trap or speed line by world XZ distance; prefers closer item; applies trap effect at `dt=1/20` one-shot, or SL force burst for 1 s equivalent. Skips `sl.enabled === false` speed lines.
  - **HUD**: bottom-centre overlay, `display: none/flex` via JS. Live HP bar (color-coded: cyan >50%, orange >25%, red ≤25%), Vx/Vy/Vz/|V| telemetry, GROUNDED/AIRBORNE status. Editable inputs: Spawn XYZ, Force XYZ (initial velocity), Tilt°, RPM. Checkboxes: Follow Cam (OrbitControls target lerps to ball), Self-Rotate (enables RPM-driven Y spin), Auto-Move (40cm circle walk). All saved to `localStorage` key `bey_spawn_manager_settings`.
  - **Manager pattern**: `SceneContext` + injected `getCamera/getControls/getArenas/getTraps/getSpeedLines/getZones/getWalls` callbacks. No imports from `src/screens/`.
- **`src/screens/ArenaSandbox.ts`** integration: `import { SpawnManager }` + `import type { SceneContext }`; `_spawnMgr` + `_spawnMgrBtn` private fields; inline `SceneContext` construction + `SpawnManager` instantiation at end of `buildCustom()`; "⚽ Spawn" top-bar button toggles spawn/despawn; `_spawnMgr?.tick(dtMs)` at end of `onTick()`; `despawn()` + button deactivation in `setVisible(false)`.
- **`src/styles/global.css`** — `.spawn-manager-hud` + all `.tb-*` element styles appended (bottom-centre, z-index 30, orange accent border, `Orbitron`/`Rajdhani` fonts, `vmin`-based sizing).
- **Bug fixes in SpawnManager (found during audit — session 1)**:
  - `_applySpeedLines`: added `sl.enabled === false` guard (skip disabled ribbons — field `SpeedLineData.enabled: boolean`)
  - `_applyTrigger`: added `sl.enabled === false` guard for T-key speed line search
  - `_applySelfRotation`: `selfRotate` checkbox was connected in HUD but NOT checked in code — fixed to `if (this.selfRotate && this.rpm > 0)` so the checkbox actually controls spinning
  - `_resolveWalls` gap formula: was `(rimDist - wall.thickness) - (ballDist + BALL_RADIUS)` which always subtracted thickness even for outward walls. Fixed: outward walls (default `thicknessDirection = 'outward'`) collide at `rimDist`; inward walls at `rimDist - thickness`.
- **Bug fixes in SpawnManager (found during audit — session 2)**:
  - `_applyTraps` base trap `surfY = 0` → should be `surfY = DEFAULT_BASE_HEIGHT` (30 cm). With `surfY = 0`, the vertical proximity check `|(tip_y − 0)| > 4` evaluates to `|30| > 4 = true` for any ball resting on the base — base traps NEVER triggered.
  - `_resolveWalls` depenetration sign reversed: `this.pos.x -= gap * outWX` pushes ball OUTWARD (further into wall) when `gap < 0`. Correct: `this.pos.x += gap * outWX` (gap is negative → adds in −outW direction = inward toward arena center).

Known confirmed pitfalls for SpawnManager (do not re-introduce):
- **`ConeGeometry` gives backwards pyriform**: apex is at TOP — wrong for a spinning top. Always use `CylinderGeometry(topR, bottomR, height)` for the cone and tip sub-meshes.
- **`getCamera()` and `getControls()` are NOT on `SceneContext`**: they are on the `Sandbox` base class. Must be injected as separate `() => T | null` callbacks to `SpawnManager` constructor.
- **`_makeSceneContext()` does NOT exist on ArenaSandbox**: construct `SceneContext` inline in `buildCustom()` using `{ scene, sceneTree, getBaseHeight: () => this.baseConfig.height, trackObjects: () => {}, untrackObjects: () => {} }`.
- **`computeSegmentPath` returns arena-LOCAL coordinates**: must rotate to world via `arena.rotY` before use. World transform: `wx = arena.posX + lx*cos(rotY) - lz*sin(rotY)`.
- **`arenaSurfaceYAtArenaLocal` returns world Y relative to the octagon base**: the octagon top face is at `DEFAULT_BASE_HEIGHT` (30 cm) and arenas sit on top of it. `bestSurfY` fallback must be `DEFAULT_BASE_HEIGHT`, NOT 0. Using 0 causes the ball to clip 30 cm through the floor when off-arena.
- **`worldToArenaLocal` is a new export**: added to `surfaceUtils.ts` after `polarToLocalXZ`. Both `DEG2RAD` and `ArenaData` are already imported there — no new imports needed.
- **`makeSurfFn` takes `Map<string, ZoneData>`** (not `ReadonlyMap`): cast with `as Map<string, ZoneData>`.
- **`sl.enabled === false`**: always guard `_applySpeedLines` and T-key trigger searches — disabled ribbons have physics inactive.
- **`selfRotate` field must be checked in `_applySelfRotation`**: the checkbox exists in the HUD but must also be checked in code: `if (this.selfRotate && this.rpm > 0)`.
- **Wall `thicknessDirection` must be respected in gap formula**: default `'outward'` → collision surface at `rimDist`; `'inward'` → at `rimDist - thickness`. Using `rimDist - thickness` for all walls is wrong and lets the ball clip 2cm into default walls.
- **Base trap `surfY` must be `DEFAULT_BASE_HEIGHT`**: `_applyTraps` uses `surfY` in the vertical proximity check `|(tipY − surfY)| > 4 cm`. If `surfY = 0` and the base is at 30 cm, the check always fails for any ball on the base — base traps are permanently dead. Use `DEFAULT_BASE_HEIGHT`.
- **`_resolveWalls` depenetration is `+= gap * outW`, NOT `-= gap * outW`**: `outW` is the OUTWARD normal. `gap < 0` means ball has penetrated. `pos += gap * outW` moves ball inward (correct). `pos -= gap * outW` moves ball outward = further into the wall (wrong).

Known confirmed bugs fixed (2026-06-07 — jump link system):
- **`_restoreObstacleSave` and `_duplicateNode` obstacle branch missing `⤻+` button**: Both paths that add obstacle tree nodes were missing the jump link child button. Fixed: added `{ label:'⤻+', title:'Add jump link', className:'sl-btn', onClick:()=>this._addJumpLink(os.id,'obstacle') }` between `↻+` and `✦+` in both `_restoreObstacleSave` and the `_duplicateNode` obstacle branch. The pattern: every node type that can serve as a jump link source (arena, obstacle, trap, base) must have `⤻+` in its `addChildButtons`.
- **`resolveEndpointWorld` base-parented trap world offset**: When `ep.parentType === 'trap'` and `trap.parentType === 'base'`, world XZ was `ep.localX/localZ` — ignoring the trap's `basePosX/basePosZ`. Fixed: else branch sets `wx = trap.basePosX + ep.localX; wz = trap.basePosZ + ep.localZ`.
- **`buildArcArrows` cone orientation used `lookAt` + `rotateX`**: `mesh.lookAt(next); mesh.rotateX(Math.PI / 2)` gimbal-locks for near-vertical arcs. Fixed with quaternion: `mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir)` where `dir = next.sub(pos).normalize()`.
- **`showJumpLink` ARC SHAPE `selectRow` routed to `onGeomChange`**: `arcProfile` is a structural mode change (type selector), must call `onFullChange(); refresh()` — same pattern as all other mode selectors. Fixed.
- **`showJumpLink` 15+ `numRow`/`toggleRow` callbacks missing `onGeomChange()`**: LAUNCH PHYSICS, LANDING, IN-FLIGHT SPIN, IN-FLIGHT STATS, VISUAL TRAIL (width, fade), FLASH (launch, land, color) callbacks mutated data in-memory but never triggered `saveArena()`. Fixed by adding `onGeomChange()` to every callback in those sections.
- **`showSpeedLine` `jump_link` exitBehavior used unusable `textRow` for jumpLinkId**: Required user to manually type an internal ID (e.g. "jl-1"). Fixed: added `getJumpLinks?: () => JumpLinkData[]` optional parameter to `showSpeedLine`; the 'jump_link' section now uses `selectRow` populated from the live jump link list; ArenaSandbox passes `() => [...this.jumpLinks.values()]`.
- **`_removeJumpLink` left stale `jumpLinkId` on speed lines**: When a jump link was deleted, speed lines that had `sl.jumpLinkId === deletedId` retained the stale reference. Fixed: `_removeJumpLink` now clears `sl.jumpLinkId = null` on all matching speed lines before disposal.

Features to re-verify (not exhaustive): wall tilt/gaps/profiles, all bridge segment types, zone fill shaders, speed line physics, portal linking, rotation/orbit floor correction, trap variants, obstacle floating, particle systems, Load Demo button, save/load round-trip.

---

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
    LandingScreen.ts            — Title + sandbox nav buttons (onBeyblade, onArena, onRpg, onAdmin)
    Sandbox.ts                  — Reusable Three.js XYZ viewport (SandboxOptions); provides onTick() hook;
                                  public getCamera() / getControls() / getRendererCanvas() accessors
    ArenaSandbox.ts             — Full arena builder: arenas, pits, zones, moats, walls, bridges, speed lines,
                                  traps, portals, obstacles, footings, rotations, weather; _duplicateNode; sub-nodes
    BeybladeSandbox.ts          — Beyblade part builder (extends Sandbox); thin orchestrator/Facade;
                                  _duplicateNode; present/particle sub-nodes; BEY_SAVE_VERSION=2
    RPGScreen.ts                — Phaser-based RPG world screen (GameScene, WorldScene, UIScene, etc.)
    ArenaLibraryScreen.ts       — Arena preset browser (/arena-library); grouped card grid; load (replace/merge dialog
                                  → bey_pending_arena_load key), edit (→ /preset-editor), delete, inline rename
    BeyLibraryScreen.ts         — Beyblade preset browser (/bey-library); Parts + Builds tabs; assembly panel
                                  (4 slots + floating picker overlays); Build & Load merges configs → bey_pending_bey_load
    admin/
      AdminHubScreen.ts         — Admin content studio hub (7 sub-tool buttons)
      SpriteAdminScreen.ts      — Sprite/SVG admin tool
      TileAdminScreen.ts        — Tileset admin (stub)
      MapAdminScreen.ts         — Map editor (stub)
      SoundAdminScreen.ts       — Sound/BGM admin (stub)
      DialogueAdminScreen.ts    — Dialogue node graph editor (stub)
      CutsceneAdminScreen.ts    — Cutscene timeline editor (stub)
      MiniGameAdminScreen.ts    — Mini-game level editor (stub)
  types/
    arenaTypes.ts               — Arena data model interfaces (ArenaData, PitData, ZoneData, WallData,
                                  BridgeData, BridgeSegmentData, SpeedLineData, SpeedLineSegment,
                                  RotationData, BridgeSnapRule, RotationMode, RotationNodeType,
                                  ArenaMaterial, BridgeSection, and all related enums);
                                  re-exports PresentConfig/ParticleConfig from sharedTypes
    beybladeTypes.ts            — Beyblade data model: AxisData, PartData (with present+particleConfig),
                                  SectorData, GroupData, BeybladeBuildConfig (v?: number);
                                  re-exports PresentConfig/ParticleConfig from sharedTypes
    presetTypes.ts              — ArenaPreset, BeyPreset interfaces; BeyPartType; ArenaConfig imported from
                                  arenaPersistence (NOT arenaTypes — critical distinction)
    sharedTypes.ts              — PresentConfig, defaultPresentConfig(), ParticleConfig, defaultParticleConfig(),
                                  ParticlePreset, ParticleSystem, WeatherSystem — shared across arena+beyblade
    rpgTypes.ts                 — RPG data model: NPCData, DialogueTree, ItemDef, QuestDef, ShopItem,
                                  MiniGameLevel, MapData, TileData, CutsceneData, SaveSlot, EventBusEvents
  stores/
    BeybladeStore.ts            — Pure data store (no Three.js); getters/setters/serialize/deserialize/mergeDeserialize
  commands/
    ICommand.ts                 — ICommand interface + CommandHistory (undo/redo stack, max 50)
    beybladeCommands.ts         — All concrete commands: AddPartCmd, DeletePartCmd, UpdatePartCmd,
                                  CutSectorsCmd, UpdateSectorCmd, DeleteSectorCmd, AddGroupCmd,
                                  DeleteGroupCmd, UpdateGroupCmd, MoveNodeCmd
  geometry/
    sectorBuilders.ts           — ISectorGeometryBuilder + SolidSectorBuilder + HollowSectorBuilder + getSectorBuilder()
    wallBuilders.ts             — Wall mesh/edge builders; arcFilterPts; defaultWallData (incl. emissive/opacity/presentStlb64)
    bridgeSegmentBuilders.ts    — Bridge segment path samplers; cross-section sweep; SegmentPose; defaultSegment; defaultBridgeSection (incl. color/surface/emissive/opacity)
    speedLineBuilders.ts        — Speed line path computation; ribbon mesh; arrow/handle/marker builders; overlap detection; 22 shape samplers; waypointsToSegments; applySpeedRamp; applyModulation; generatePresetSegments
    sceneSurfaceProjector.ts    — SceneSurfaceProjector: downward raycast against registered meshes for thread-on-surface D-shape effect; arena-local↔world coord transform
    obstacleBuilders.ts         — 6-shape obstacle geometry; buildObstacleObjects; applyObstacle; defaultObstacle (incl. emissive/opacity/presentStlb64)
    trapBuilders.ts             — Trap plate + variant meshes; buildTrapObjects; trapSurfY; defaultTrap (incl. baseMaterial/emissive/presentStlb64)
    portalBuilders.ts           — Portal pad + torus ring; buildPortalObjects; portalSurfY; defaultPortal (incl. surface/customTileData/presentStlb64)
    footingBuilders.ts          — Base footing 6-shape geometry (decoupled copy of obstacle shapes); buildFootingObjects(data, baseHeight); applyFooting(data, baseHeight); defaultFooting(name, id, baseHeight)
    particleBuilders.ts         — ParticleSystem interface; buildParticleSystem(preset, cx, cz, radius, baseY); 6 presets: embers/snow/sparks/dust/bubbles/void_motes
    weatherBuilders.ts          — buildWeatherSystem(preset, windEnabled, windDeg, windStrength, gustInterval, gustMult, arenaRadius, baseY) → WeatherSystem; 6 weather presets; tick+windForce
    [arena geometry files...]
  features/
    IArenaFeature.ts            — SceneContext (getFallbackY replaces old getBaseHeight), ITickableManager, IArenaFeature, ISceneFeature interfaces; setVisible in FeatureManager base
    ISurfaceProvider.ts         — ISurfaceProvider interface (SurfaceHit, getSurfaceAt, getCenter, polarToWorld); decouples ParentedFeatureManager from ArenaData
    surfaceProviders.ts         — ArenaSurfaceProvider (wraps arena parabola math), FlatSurfaceProvider (constant Y), MeshSurfaceProvider (downward raycast)
    FeatureManager.ts           — Abstract base (Template Method): _insert/remove/clear/restoreData/serializeAll; setVisible(id, visible) sets mesh/edges visibility
    ParentedFeatureManager.ts   — Extension: resolveSurfaceY/resolveWorldXZ/resolveTreeParent via ISurfaceProvider (getSurface callback replaces getArenas)
    managers/
      ObstacleManager.ts        — Free-floating 3D obstacle shapes
      FootingManager.ts         — Base-mounted decorative shapes (intentionally decoupled from obstacleBuilders)
      TrapManager.ts            — Trigger plates; variantMesh disposed separately; removeWithWalls(id, cb); ITickableManager (earthquake/RPM/plateSpin tick)
      ArenaEnvironmentManager.ts — ITickableManager; envSchedule tick (interval/once/event/revert); setGravity/setWeather/setTilt/setFog/setScore/triggerEvent
      PortalManager.ts          — Teleport pads; ringMesh disposed separately
      WallManager.ts            — 4 parent types; auto-join sibling guard; ITickableManager for pivot rotation
      BridgeManager.ts          — Bridge + segment chain; owns segments Map + segSeq; getArenas/getWalls injected
      SpeedLineManager.ts       — Surface projector injected as callback; showHandles/hideHandles for drag interaction
      RotationManager.ts        — ITickableManager; detachAll() before clear; afterApply() for group-local correction
      PresentationManager.ts    — Centralized STL present-mesh + opening decal logic; load/dispose/applyViewMode/tick
      SpawnManager.ts           — Physics test spinning-top probe; pyriform 4-part Group (cap+disc+cone+tip); tip-contact floor resolution (BALL_TIP_OFFSET=-10cm); wall/trap/zone/speed-line physics; WASD+jump+T-key trigger; HUD with localStorage persistence; injected getCamera/getControls/getArenas/getTraps/getSpeedLines/getZones/getWalls callbacks; ITickableManager
      ProjectileManager.ts      — Sandbox-agnostic bullet/projectile manager; ITickableManager only (no FeatureManager); launch(BulletLaunchRequest) spawns bullets from any source; orbit (circular) + boomerang (linear+return) motion modes; auto-remove expired/returned bullets; expireAll() cleanup; injected scene+getSpeedLines only
      TranslationManager.ts     — Path-animation manager; extends FeatureManager; ITickableManager; moves member objects along waypoints (world-space); loopModes: once/loop/pingpong; easing: linear/ease_in/ease_out/smooth; no pivot group (positions directly); serialized in ArenaConfig.translations; tree icon ↔
      TargetManager.ts          — Runtime target-tracking; ITickableManager only (no FeatureManager — not serialized); bind(sourceId, targetId, behavior) creates bindings; behaviors: follow/orbit/flee/lock_on/face; injected getPosition+setPosition callbacks; sandbox-agnostic
      TriggerZoneManager.ts     — Generic spatial event system; ITickableManager only; register(TriggerZone) + trackObject(nodeId); cylinder overlap test per tick; fires onEnter/onExit/onStay callbacks; injected getPosition; no tree nodes, no serialization
  renderers/
    BeybladeRenderer.ts         — Three.js mesh management; axisRoot/spinGroup/freeSpinGroup hierarchy;
                                  view mode toggle (hitbox/both/present); STL presentation mesh loading;
                                  applyPresentTransform(partId) applies PresentConfig transforms; clearPresentMesh(partId)
  animation/
    BeybladeAnimator.ts         — tick(dt, spinDir) spins spinGroup; setTiltAngle/setPivotOffset tilts axisRoot
  utils/
    AbstractPropertiesPanel.ts  — Shared base class: section/numRow/colorRow/toggleRow/textRow/selectRow/themeRow helpers; themeRow renders 7-button VisualTheme quick-pick grid with transient active highlight
    PropertiesPanel.ts          — Arena properties (extends AbstractPropertiesPanel); showWall/showBridge/showBridgeSegment/showSpeedLine/showObstacle/showTrap/showPortal/showFooting; showWall/showObstacle/showTrap/showPortal/showFooting each take (onGeomChange, onFullChange) — see two-callback pattern; all accept optional onStlImport/onStlClear callbacks
    BeybladePropertiesPanel.ts  — Beyblade properties (extends AbstractPropertiesPanel); showPart/showGroup/showSector/showPresentation/showParticle; showPresentation replaces old inline PRESENTATION section in showPart
    SceneTree.ts                — Reusable hierarchical tree widget (shared by both sandboxes); nodes with addChildButtons render a single "+" that opens a floating add-popup; single-action nodes fire directly on click; onReparent(nodeId, newParentId, beforeId) fires on drag-drop; onDuplicate(id) fires on context-menu "Duplicate"
    dialog.ts                   — gameConfirm() modal utility
    arenaPersistence.ts         — ArenaSave/ArenaConfig serialisation; wall/bridge/speed line/obstacle/trap/portal/footing save interfaces; footingToSave()
    presetStore.ts              — Arena+Beyblade preset CRUD (listArenaPresets/saveArenaPreset/deleteArenaPreset/updateArenaPreset,
                                  listBeyPresets/saveBeyPreset/deleteBeyPreset/updateBeyPreset, newPresetId);
                                  generateArenaThumb/generateBeyThumb (128×128 canvas); remapArenaConfigIds/remapBeyConfigIds
                                  (2-pass batchTag remap); extractArenaConfig (expand selections to children)
  config/
    arenaConstants.ts           — Arena world constants + ARENA_MATERIAL_PRESETS + VISUAL_THEME_PRESETS (7 themes) + ARENA_LIGHT_PRESETS (6 presets) + BUFF_TIER_PRESETS
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
- Rim-mounted barrier extruded from a parent attachment surface (arena rim, trap top-surface, bridge deck, or octagon base)
- `parentType`: `'arena'` | `'bridge'` | `'base'` | `'trap'`
  - `'arena'`: attaches to the arena rim at `rimY = arena.posY`; arc controlled by `fullPerimeter` / `arcStart` / `arcEnd`
  - `'base'`: free-standing on the octagon base; position/rotation set via `basePosX`, `basePosZ`, `baseRotY`, `baseLength`
  - `'bridge'`: attaches to a bridge deck edge (rebuilt alongside bridge segments)
  - `'trap'`: attaches to the top surface of a trap plate at `rimY = trapSurfY + TRAP_PLATE_HEIGHT`; rim shape is `trapRimPoints(trap)` translated to world space
- **Tilt convention**: 0° = vertical (perpendicular to rim). Negative = inward (top sweeps toward parent centre). Positive = outward. Range: [−90°, +30°].
- **Full-perimeter tilt rule**: if `fullPerimeter=true AND !hasGaps`, tilt is forced to 0° — a closed ring has no free edge. Enabling partial arc OR gaps allows tilt.
- **Gap pattern**: `hasGaps=true` splits the arc into alternating solid panels and open gaps. Both `gapWidth` and `panelWidth` minimum = `MIN_WALL_GAP` (10 cm). Pattern is arc-length based, starting with a panel at `arcStart`.
- **Minimum height**: `MIN_WALL_HEIGHT` = 10 cm. Enforced in geometry builder and UI.
- **Thickness**: `thickness: number` (cm, min 0.1, default 2). Wall cross-section is solid: outer face + inner face (reversed normals) + top face + optional end-cap faces. The inner surface is offset inward by `thickness` from the outer rim.
- **Auto-join**: `autoJoin: boolean` (default true). When two adjacent arena walls share an arc boundary (within 1°), the shared end-cap faces are suppressed, creating a seamless join. Both walls must have `autoJoin=true` for the join to be seamless on both sides.
- **Destructibility**: `isDestructible: boolean` (default false) + `hitPoints: number` (default 100). Editor flags for future simulation; do not affect geometry.
- **Moat ring**: `moatRing: 'outer' | 'inner'` (default `'outer'`). Only meaningful when `parentType='arena'` and `arena.isMoat=true`. `'inner'` attaches to the elevated inner island rim at `posY + innerRimOffset`.
- **Auto-rotation**: `rotateOnArena: boolean` + `arenaRotateMode: 'continuous' | 'step' | 'oscillate'` + speed/step/oscillate params. Creates a `THREE.Group` pivot at the arena centre (`_rotatePivot`); wall mesh/edges are reparented into it. `onTick` rotates the pivot each frame. `_rotatePivot` and `_arenaRotateTimer` are runtime-only and NOT saved.
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
- `type: BridgeSegmentType`: `'straight'` | `'curve'` | `'ramp'` | `'bezier'` | `'loop'` | `'hairpin'` | `'corkscrew'` | `'chicane'` | `'return_loop'` | `'exit_loop'`
- `orderIndex` — position in chain (0-based); updated automatically when segments are removed
- Start pose is computed by chaining `computeSegmentEndPose` from the bridge's `startRef` through all prior segments
- `color: number | null`, `surface: SurfaceType | null` — per-segment appearance override; `null` = inherit from `bridge.section`. `applySegment` resolves via `seg.color ?? sec.color`
- `mesh`, `edges` — nullable; rebuilt by `applySegment()` whenever any earlier segment or bridge section changes. Mesh+edges are children of `seg._animPivot: THREE.Group` (not direct bridge.group children) so the pivot can offset/rotate independently each tick
- **Animation**: `animEnabled`, `animOffsetX/Y/Z`, `animRotX/Y/Z`, `animStartMs`, `animIntervalMs`, `animHoldMs` — tick-based square-wave translate+rotate. Runtime: `_animTimer`, `_animCenter`, `_animPivot` (NOT serialised)
- Changing any segment triggers `applyBridgeFromSegment(segId)` which rebuilds that segment and all subsequent ones

#### SpeedLineData
- A guided path painted onto the arena bowl surface that exerts physics forces on beyblades that touch it
- **Two modes**: `presetType === 'custom'` → segment-by-segment editing (old behaviour, unchanged); any other `presetType` → auto-generated segments from `presetParams`, segment editor hidden
- Composed of **`SpeedLineSegment[]`** — each segment is a forward-marching block with `length`, `rotX/Y/Z` (pivot angles), `speedMult`, and `objRotX/Y/Z` (object spin rates). Segments are chained: start direction + per-segment yaw/pitch/roll = full path
- `startR`, `startAngle`, `startDir` — polar start position + initial heading on the arena surface
- `surfaceFollow: boolean` — when true the ribbon is projected onto the bowl surface (Y from `surfFn` / projector); false = flat XZ plane
- **Target**: `targetType` (`beyblade | water | obstacle | item | any | custom | nearest_opponent | nearest_obstacle | on_path_obstacle | linked_bridge | linked_trap`) + `targetTag`; `targetSelectionMode: 'at_entrance' | 'dynamic'`; `targetBridgeId: string | null`, `targetTrapId: string | null` (used when targetType is `linked_bridge`/`linked_trap`)
- **Activation modes**: `always` | `event` (trigger/end event names) | `periodic` (period + duty) | `proximity` (activationRadius + fade in/out)
- **Physics**: `speedMultiplier` (global scale), per-segment `speedMult`; `entryCondition` (`always | moving_only | fast_only | slow_only`); `exitBehavior` (`normal | launch | loop | special_move`); `launchForce`; `overridePhysics`
- **Oscillation**: `oscillate` flag; `oscAxis` (`path | lateral | normal | all`); `oscAmplitude`, `oscFrequency`, `oscPhase`
- **Direction**: `forward | reverse | bidirectional`; `swapPriority` for bidirectional conflict resolution
- **Appearance**: `width` (up to 30 cm — `SL.WIDTH_MAX_OVERRIDE`), `color`, `opacity`, `glowColor`; `surfaceOffset` cm above projected surface (default 0.05, was hardcoded `SL.SURFACE_LIFT`)
- **Surface orientation**: `surfaceOrientObject: boolean` — aligns object's up-axis to surface normal (wall → horizontal spin; bowl → tilted); `airNormalMode: 'upright'|'lean_center'|'lean_curvature'`; `airNormalTiltDeg` (0–45°)
- **Speed ramp**: `speedRamp: SpeedLineRamp` — profile (`constant|accelerate|decelerate|bell|inverse_bell`), `speedMin/Max`, `entrySteps/exitSteps`
- **Stat modifiers**: `statModifiers: SpeedLineStatModifiers` — global multipliers for spinRate, stamina, attack, defense, weight, burstResist (all default 1.0); per-segment override via `segment.statModifiers` (null = inherit global)
- **Sections**: `presetParams.sections: SpeedLineSection[]` — each section is a self-contained arc with its own `angleDeg`, `yOffset`, `maxStayDuration`, `statModifiers`, `surfaceFollow`, `entryCondition`, `exitBehavior`, `color`, `opacity`, `speedMult`, `activationMode`; null on any field = inherit from SpeedLineData global live — change the global and all null sections update automatically
- **Base condition**: `baseCondition: 'none'|'always'|'game_phase'`; `conditionPhase`; `conditionCheckIntervalMs` (default 100 ms — how often entry/activation conditions are re-checked while object is on path; fail → eject)
- **Eject**: `ejectBehavior: 'toward_center'|'forward'|'backward'|'launch'`
- **Preset params**: `SpeedLinePresetParams` — `radiusX/Z`, `sides`, `petals`, `turns`, `steps` (3–120), `centerX/Z`, `rotationY`, `heightDelta`, `closeLoop`, `innerRadius`, `pitchPerTurn`, `loopGap`, `radiusEasing`, `arcFraction` (0.01–1.0), `centerY`, `startPos/endPos XYZ`, `sections[]`, `modulation: SpeedLinePresetModulation`
- **Preset modulation**: `type: 'none'|'radial_scale'|'angle_drift'|'xyz_shift'`; `waveform` (11 types: sine/cosine/triangle/sawtooth/inverse_sawtooth/square/pulse/exp_rise/exp_decay/damped_sine/growing_sine); `amplitude`, `periodSteps`, `modPhase`, `pulseWidth`
- **Thread-on-surface D-shape**: `SceneSurfaceProjector` downward-raycasts all registered meshes; circle overlapping the arena wall projects floor part onto bowl (curved), wall part onto wall face (straight) — D shape emerges automatically with no manual work. `_buildSurfaceProjector(arenaId)` registers wall/obstacle/bridge meshes; passed to `applySpeedLine` and `buildSpeedLineObjects` via 7th argument
- `pointNormals: THREE.Vector3[]` — runtime-only (not serialised); populated by `buildSpeedLineObjects` for object surface orientation per path point
- `mesh` — ribbon `THREE.Mesh` (surface-projected, `DoubleSide`, transparent)
- `edges` — centerline `THREE.LineSegments`
- `markerMeshes[]` — start/end arrows, direction arrows, activation radius ring
- `handleMeshes[]` — interactive drag handles (one per joint + start); hidden unless selected; only shown for `presetType === 'custom'`
- `overlapMarkers[]` — sphere meshes shown where paths cross (rebuilt on any change)
- `totalLength` — computed arc length in cm
- **Linking fields**: `linkedBridgeId: string | null`, `linkedTrapId: string | null` (structural: this SL was auto-created for this bridge/trap); `enabled: boolean` (false = mesh/edges/markers hidden without geometry rebuild — set `.visible` on all objects); `jumpLinkId: string | null`
- **All Speed Line meshes** are positioned in world space with `position.set(arena.posX, 0, arena.posZ)` + `rotation.y = arena.rotY` — geometry bakes arena-local coordinates directly

**Preset shape types** (24 total — `SpeedLinePresetType`): `custom`, `circle`, `ellipse`, `polygon` (3–10 sides), `triangle`, `star`, `flower`/`rose_curve`, `spiral_in`, `spiral_out`, `helix`, `zigzag`, `wave`, `cosine_wave`, `damped_wave`, `growing_wave`, `snake`, `figure_8`, `lemniscate`, `trefoil`, `cardioid`, `epicycloid`, `hypocycloid`, `astroid`, `point_zone` (stationary circular trigger disc, no travel, internally tiny closeLoop circle + `exitBehavior='loop'`)

**Preset generation pipeline** (in `speedLineBuilders.ts`):
1. `sampleXxx(cx, cz, ...params, rotY, N, arcFraction?)` — shape sampler returns N+1 XZ waypoints
2. `applyModulation(pts, params)` — waveform-based deformation of waypoints in-place
3. `waypointsToSegments(pts, heightDelta)` — converts N+1 XZ points → N segments using heading convention
4. Section angle distribution + per-section property assignment (yOffset baked as Y lift per segment)
5. `applySpeedRamp(segments, ramp)` — sets speedMult per segment based on profile
6. All called by `generatePresetSegments(preset, params, ramp, slId, getNextSegId)` → `{ segments, startDir, startR, startAngle }`

**Heading convention** (critical — must match `computeSegmentPath`):
- `fwd = (-sin(startDir_rad), 0, cos(startDir_rad))`
- `heading[i] = atan2(-(pts[i+1].x-pts[i].x), pts[i+1].z-pts[i].z) * RAD2DEG`
- `rotY[0] = 0`, `startDir = heading[0]`; `rotY[i] = normalizeAngle180(heading[i] - heading[i-1])` for i > 0

#### ObstacleData
- A solid 3D shape placed freely in world space (can float above any surface)
- `shape`: `'cube'` | `'cuboid'` | `'sphere'` | `'cylinder'` | `'pyramid'` | `'frustum'`
- `dimX/Y/Z` — dimensions in cm; semantics vary by shape (cube: all sides = dimX; sphere: diameter = dimX; frustum: dimX = bottom D, dimZ = top D, dimY = height)
- `posX/Y/Z`, `rotX/Y/Z` — world position + Euler rotation in degrees; `posY` is set manually, NOT derived from arena surface
- `isFloating` — editor flag (no physics effect yet)
- `isDestructible` + `hitPoints` — editor flags for future simulation
- `contactForceX/Y/Z` — cm/s impulse applied on contact (editor placeholder)
- `material: ArenaMaterial`, `theme: ObstacleTheme` — physics material and visual theme
- `speedPathId: string | null` — ID of a SpeedLineData that targets this obstacle (reverse reference)
- `mesh` + `edges` — Three.js objects built by `obstacleBuilders.ts`
- Minimum dimension: `MIN_OBSTACLE_DIM` (10 cm). Default: 20 cm cube floating 10 cm above base

#### TrapData
- A flat trigger pad on an arena surface or the octagon base
- `parentType`: `'arena'` | `'base'` — polar placement on arenas (`posR`, `posAngle`), world XZ on base (`basePosX`, `basePosZ`)
- `shape`: `'rectangle'` | `'circle'` | `'ellipse'` | `'hexagon'`; `dimX/Z` — footprint in cm (min `MIN_TRAP_DIM` = 10 cm)
- `effect`: `'damage'` | `'heal'` | `'launch'` | `'reverse_controls'` | `'freeze'` | `'buff_zone'` | `'hidden_pit'` | `'chomper'` | `'gravity_pull'` | `'earthquake'` | `'rpm'` | `'projectile'`
- `variant`: `'generic'` | `'spike'` | `'trampoline'` | `'hammer'` | `'saw'` | `'buff'` | `'chomper'` | `'hidden_pit'` | `'earthquake'` | `'rpm'` | `'projectile'` — drives `variantMesh` geometry
- Effect parameters: `forceX/Y/Z`, `damageFactor`, `healFactor`, `freezeDuration`, `buffSurface`, `pitShape/RadiusX/Z/Depth` (hidden_pit, self-contained)
- `isPeriodic` + `safeInterval` + `unsafeInterval` — periodic safe/unsafe cycling
- `activationLimit` (0 = infinite)
- `durationTiers: TrapDurationTier[]` — escalating effects when bey stays on a `buff_zone` trap; each tier has `thresholdSeconds`, `tierEffect`, `rpmLossFactor`, `speedFactor`, `notes`. Only used when `effect='buff_zone'`
- `BUFF_TIER_PRESETS` in `arenaConstants.ts` seeds sand/lava/ice/water/oil tier templates (↺ Preset button in PropertiesPanel)
- `envTriggerEvent: string`, `envTargetArenaId: string` — when set, trap fires a named env schedule event on the target arena on activation
- **Earthquake** fields: `eqRingCount`, `eqSegmentsPerRing`, `eqMaxElevationCm`, `eqElevationMode` (`'random'|'wave'|'ripple'|'checkerboard'`), `eqRingRanges: number[]`, `eqPermanent: boolean`, `eqFadeCycles: number`, `eqPulseMode/IntervalMs/WidthMs`. Runtime: `_eqTimer`, `_eqCycleCount`, `_eqTargetHeights[]`, `_eqCurrentHeights[]`, `_eqPhase`
- **RPM** fields: `rpmSpeed` (deg/s; + = CCW), `rpmEffect`, `rpmRange`, `rpmMatchSpin`, `rpmForceScale`, `rpmPulseMode/IntervalMs/WidthMs`. Runtime: `_rpmCurrentAngle`, `_rpmTimer`, `_rpmActive`
- **Projectile** fields: `projLaunchMode`, `projCount`, `projSpreadAngleDeg`, `projBurstCount/DelayMs`, `projLaunchDelayMs/AngleDeg`, `projRandomizeAngle`, `projPattern/PatternCount`, `projPlateSpin`, `projConfig: ProjectileConfig`, `projPulseMode/IntervalMs`
- **Gravity pull** fields: `gravityRange`, `gravityStrength`, `gravityMode`, `gravityPulseInterval/Width`. Runtime: `_gravityTimer`
- `linkedSpeedLineId: string | null` — reference to an existing arena SL that is linked to this trap
- `speedPathId: string | null` — reverse reference to a SpeedLineData
- `mesh` + `edges` + `variantMesh` — Three.js objects; plate built by `trapBuilders.ts`; `variantMesh` disposed separately (like `arena.spiralMeshes`)
- Plate world Y is auto-derived from arena surface at placement time via `trapSurfY()` — NOT stored explicitly

#### PortalData
- An instant-teleport pad (distinct from traps: no damage/force, purely relocates beyblades)
- `parentType`/shape/dimX/dimZ/posR/posAngle/basePosX/basePosZ — same placement scheme as TrapData
- `destType`: `'portal'` (linked pair by ID) | `'random_arena'` (random drop inside named arena) | `'world_point'` (explicit XYZ)
- `destPortalId`, `destArenaId`, `destPosX/Y/Z` — destination depending on destType
- `exitVelScale` — speed multiplier on exit (0.1–3.0); `exitRotY` — exit heading override in degrees (NaN = preserve)
- `isBidirectional` — entering from either end teleports to the other
- `color` (pad fill) + `glowColor` (pad emissive + ring color)
- `mesh` + `edges` (flat pad) + `ringMesh` (TorusGeometry floating `PORTAL_RING_HEIGHT` cm above pad)
- Pad world Y derived via `portalSurfY()`, same pattern as `trapSurfY()`

#### JumpLinkData
- A two-endpoint launch mechanic — a beyblade entering endpoint A is launched along a parabolic arc to endpoint B (and vice-versa if bidirectional)
- `id`, `name`, `parentArenaId` — arena that owns this jump link
- `endpointA`, `endpointB: JumpLinkEndpoint` — each endpoint: `posR`, `posAngle`, `dirDeg`, `parentType`, `parentId`
- `flight: JumpFlightConfig` — `launchAngleDeg`, `launchForce`, `gravityScale`, `airDrag`, `landingImpact`, `landingBounce`
- `flightStatModifiers: JumpFlightStatModifiers` — multipliers applied during flight (spinRate, stamina, etc.)
- Saved in `ArenaConfig.jumpLinks: JumpLinkSave[]` + `jumpLinkSeq`. `JL` constants in `arenaConstants.ts`.
- Tree icon: `⤻`. Add button: `⤻+` on arena tree nodes.

#### RotationData
- Animate one or more objects spinning around a shared 3D pivot
- `memberIds: string[]` — 1 entry = individual node rotation; N entries = group rotation
- `memberTypes: RotationNodeType[]` — parallel array of `'trap' | 'obstacle' | 'zone' | 'wall'`
- `pivotX/Y/Z` — world pivot point in cm; `pivotGroup: THREE.Group` holds the pivot at runtime (not saved)
- `mode: RotationMode` — `'continuous'` (constant angular velocity) | `'oscillate'` (sine swing)
- `speed` — deg/s for continuous mode; `direction: 1 | -1` — CW/CCW
- `oscAmplitude` — half-swing in degrees; `oscFrequency` — Hz; `oscPhase` — radians start phase
- `enabled` — pause/resume the animation without removing it
- `currentAngle` — runtime-only accumulator; not saved
- `snapRules: BridgeSnapRule[]` — each rule shows/hides a bridge when `currentAngle` is in `[minDeg, maxDeg]`
- **Pivot group mechanism**: `THREE.Group` at `(pivotX, pivotY, pivotZ)`; member objects are `attach()`-ed so world transform is preserved. Each tick: `pivotGroup.rotation.y = DEG2RAD * currentAngle`
- **Floor Y correction** (traps/zones only): after each tick, `mesh.getWorldPosition()` → arena-local XZ → `arenaSurfaceYAtArenaLocal()` → correct `mesh.position.y` in group-local space — prevents objects clipping below curved bowl surfaces during orbit
- **Post-apply correction**: after any `applyTrap/applyZone/applyObstacle/applyWall` for a rotating member, call `_afterApply(nodeId)` to subtract `pivotGroup.position` and restore correct group-local coordinates
- **NOT rotatable**: arenas, pits (geometry is radially conformed), bridges, portals, speed lines
- **Saved in** `ArenaConfig.rotations: RotationSave[]` + `rotationSeq`; `pivotGroup` and `currentAngle` are stripped on save
- Tree node: `↻` icon; parent is the common scene-tree parent of all members, or `octagon-base` if mixed

#### BaseFootingData
- A decorative/structural 3D shape placed on the octagon base — distinct from `ObstacleData` (which floats anywhere in world space)
- `shape`: same 6 shapes as obstacles (`'cube'` | `'cuboid'` | `'sphere'` | `'cylinder'` | `'pyramid'` | `'frustum'`)
- `dimX/Y/Z` — same semantics as ObstacleData
- `basePosX`, `basePosZ`, `baseRotY` — XZ position and Y-rotation on the base surface
- `posY` — lift above the base top face in cm (default 0 = sitting flush on the base). World Y of footing centre = `baseHeight + posY + dimY/2`
- `color`, `surface`, `customTileData`, `tileScale`, `emissiveColor`, `emissiveIntensity`, `opacity` — same surface system as all other objects
- `presentStlb64`, `presentColor` — STL presentation mesh, same pattern as obstacles/walls/traps/portals
- `mesh`, `edges` — nullable Three.js objects built by `footingBuilders.ts`
- Tree icon: `⬢`. Parent: `octagon-base`. Add button: `⬢+` on the octagon-base tree node.
- **Not rotatable** — footings are not members of `RotationData`. Not reparentable via drag-drop.
- Saved as `BaseFootingSave[]` in `ArenaConfig.footings`; `footingSeq` counter in `ArenaConfig`.

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
| `computeSegmentPath(sl, arena, surfFn, projector?)` | `speedLineBuilders.ts` | Walks all segments, accumulates positions → `THREE.Vector3[]`; uses projector for surface-follow when provided |
| `computeJoints(pts)` | `speedLineBuilders.ts` | Extract joint positions (one per segment boundary + start) for handle placement |
| `buildRibbon3D(pts, normals, width)` | `speedLineBuilders.ts` | Flat ribbon `BufferGeometry` perpendicular to path, projected by normals |
| `buildStartMarker / buildEndMarker` | `speedLineBuilders.ts` | Colored sphere meshes at path endpoints |
| `buildArrowMeshes(pts, color, dir)` | `speedLineBuilders.ts` | Evenly spaced direction arrows along path |
| `buildHandleMeshes(joints, sl)` | `speedLineBuilders.ts` | Interactive sphere handles (one per joint) returned with handle-type metadata |
| `buildActivationRadiusMarker(pt, r, color)` | `speedLineBuilders.ts` | Ring mesh showing proximity activation radius |
| `samplePathForOverlap(sl, arena, surfFn)` | `speedLineBuilders.ts` | Uniform sample for cross-path overlap detection |
| `buildOverlapSphere(pos, color)` | `speedLineBuilders.ts` | Small sphere marking a detected path overlap |
| `pathSurfaceNormal(pt, arena, sl)` | `speedLineBuilders.ts` | Per-point surface normal (bowl gradient or world-up) for ribbon orientation |
| `waypointsToSegments(pts, heightDelta)` | `speedLineBuilders.ts` | Converts N+1 XZ arena-local waypoints → N segments using heading convention |
| `applySpeedRamp(segs, ramp)` | `speedLineBuilders.ts` | Sets speedMult per segment from profile/entrySteps/exitSteps |
| `applyModulation(pts, params)` | `speedLineBuilders.ts` | Waveform-based deformation of XZ waypoints in-place (11 waveform types) |
| `generatePresetSegments(preset, params, ramp, slId, getNextSegId)` | `speedLineBuilders.ts` | Full preset pipeline: sample→modulate→segment→section→ramp→IDs |
| `sampleCircle / sampleEllipse / samplePolygon / …` | `speedLineBuilders.ts` | 22 shape samplers returning N+1 XZ arena-local waypoints |
| `defaultSpeedLine(name, arenaId, id, zoneId?)` | `arenaObjectBuilders.ts` | Default SpeedLineData factory (presetType:'custom', all new fields defaulted) |
| `buildSpeedLineObjects(sl, arena, zones, projector?)` | `arenaObjectBuilders.ts` | Assembles all Three.js objects for a speed line (ribbon, edges, markers, handles) |
| `applySpeedLine(sl, arena, zones, scene, add, remove, projector?)` | `arenaObjectBuilders.ts` | Dispose + rebuild all speed line objects in-place; projector enables thread-on-surface |
| `SceneSurfaceProjector(meshes, fallbackSurfFn)` | `sceneSurfaceProjector.ts` | Downward raycast (Y=500) against registered meshes; `project(x, z, offset)` → `{point, normal}`; fallback to arena math Y |
| `buildObstacleObjects(data)` | `obstacleBuilders.ts` | Mesh + edges for 6 obstacle shapes; positions at posX/Y/Z with rotX/Y/Z |
| `applyObstacle(data)` | `obstacleBuilders.ts` | Dispose + rebuild obstacle mesh + edges in-place |
| `defaultObstacle(name, id, baseHeight)` | `obstacleBuilders.ts` | Default 20 cm cube floating 10 cm above base |
| `buildTrapObjects(data, surfY)` | `trapBuilders.ts` | Plate mesh + edges + variantMesh for chosen shape/variant; plate sits at surfY |
| `applyTrap(data, surfY)` | `trapBuilders.ts` | Dispose + rebuild trap plate in-place |
| `trapSurfY(data, arenas, baseHeight)` | `trapBuilders.ts` | World Y of arena surface (or baseHeight) where trap sits |
| `defaultTrap(name, id, parentId, parentType)` | `trapBuilders.ts` | Default 20×20 cm rectangle trap, effect='launch' |
| `buildPortalObjects(data, surfY)` | `portalBuilders.ts` | Pad mesh + edges + torus ringMesh |
| `applyPortal(data, surfY)` | `portalBuilders.ts` | Dispose + rebuild portal pad + ring in-place |
| `portalSurfY(data, arenas, baseHeight)` | `portalBuilders.ts` | Same pattern as trapSurfY |
| `defaultPortal(name, id, parentId, parentType)` | `portalBuilders.ts` | Default 20 cm circle pad, cyan 0x00e5ff, destType='portal' |
| `buildFootingObjects(data, baseHeight)` | `footingBuilders.ts` | Mesh + edges; positions at `(basePosX, baseHeight+posY+dimY/2, basePosZ)` with `baseRotY` |
| `applyFooting(data, baseHeight)` | `footingBuilders.ts` | Dispose + rebuild footing mesh + edges in-place |
| `defaultFooting(name, id, baseHeight)` | `footingBuilders.ts` | Default 20 cm cube on base surface, colour 0x888888, surface plain |

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
Maps:          arenas, pits, zones, walls, bridges, segments, speedLines, obstacles, traps, portals, rotations, footings
Seq counters:  arenaSeq, pitSeq, zoneSeq, wallSeq, bridgeSeq, segmentSeq, speedlineSeq, slSegSeq,
               obstacleSeq, trapSeq, portalSeq, rotationSeq, footingSeq
Dep index:     bridgesByArena   — arenaId → Set<bridgeId> (rebuilt on anchor change)
               nodeRotationId   — nodeId → rotationId (each rotatable node belongs to at most one rotation)
Raycaster:     slRaycaster — used for speed line handle hit-testing on mouse move
Drag state:    slDrag — { slId, handleType, handleIndex, dragPlane } — set on mouse-down, cleared on mouse-up
```

**Speed Line drag-editing**: handles are shown only when the speed line is selected (`_showSlHandles` / `_hideSlHandles`). Mouse-move raycasts against visible handles; mouse-down sets `slDrag`; mouse-move with `slDrag` set repositions the dragged segment joint and rebuilds; mouse-up clears `slDrag`. All done in `ArenaSandbox` mouse event handlers — not in `PropertiesPanel`.

**Dependency rebuild chain**: whenever an arena's geometry changes, call `rebuildDependentsOf(arenaId)`. This reapplies all rim walls attached to that arena, then reapplies all bridges in `bridgesByArena[arenaId]` starting from their first segment.

**Bridge rebuild propagation**: `applyBridgeFromSegment(segId)` reapplies `segId` and every subsequent segment in the chain. Earlier segments are unaffected. Always call this after changing any segment property or the bridge's `startRef` / `section`.

**Scene tree icons**: arenas `⏺`, pits `▼`, zones `◈`, walls `🧱`, bridges `🌉`, segments: straight `━`, curve `↩`, ramp `↗`, loop `⭕`, hairpin `↺`, corkscrew `🌀`, chicane `⟨⟩`, bezier `〜`, return_loop `↩⭕`, exit_loop `↑⭕`, speed lines `⚡`, obstacles `⬛`, traps `⚡`, portals `◉`, rotations `↻`.

**Tree node add button**: every node that can have children shows a single `+` button. Clicking it opens a floating add-popup listing all available child types by title (e.g. "Add arena", "Add bridge", "Add base wall"). If a node has exactly one child type the `+` fires it directly with no popup. The popup is a `.tree-ctx-menu.tree-add-menu` element (cyan border) positioned below the anchor button. `addChildButtons` on the octagon-base node offers: Add arena, Add bridge, Add base wall, Add obstacle, Add base trap, Add base portal, Add footing (⬢+). Arena nodes offer: Add pit, Add zone, Add wall, Add speed line, Add arena trap, Add arena portal. Bridge nodes offer: Add segment, Add wall. Zone nodes offer: Add speed line, Add rotation (↻+). Trap nodes offer: Add rotation (↻+). Obstacle nodes offer: Add rotation (↻+). Wall nodes offer: Add rotation (↻+). Beyblade part nodes offer: Cut into sectors (single-action, no popup). Multi-select → Group creates a group rotation via `sceneTree.onGroup`.

### Save / load (localStorage)

Key: `bey_arena_arena_sandbox`. `ARENA_SAVE_VERSION = 12`. On any parse error `localStorage.removeItem(key)` and return (no migration). `PitSave` has no `wallProfile`, `isMoat`, or inner moat fields. `ZoneSave` has no `maskMesh` — use `lidMesh`/`seamMesh` instead. `ArenaSave` now has `weatherPreset`, `windEnabled/Direction/Strength/GustInterval/GustMult`, env physics fields (`gravityScale`, `tiltX/Z`, `weightTilt*`, `fogDensity`, `scoreMultiplier`, `pointsPerSecond`, `weatherSurfaceMap`, `envSchedule`), `particleConfig`. `ZoneSave` has `innerSpiralTurns/Count/Clockwise/LedgeWidth/LedgeHeight/RadiusFrac` (optional `?`). `BridgeSegmentSave` has anim fields (all optional `?`). `TrapSave` has earthquake/RPM/projectile fields (all optional `?`). All env fields in `ArenaSave` are optional `?` to survive partial saves.

`ArenaConfig` (top-level save):
- `arenas[]` — each `ArenaSave` includes `walls: WallSave[]` (rim walls) and `speedLines: SpeedLineSave[]`
- `baseWalls: WallSave[]` — free-standing walls on the octagon base
- `bridges: BridgeSave[]` — each includes `segments: BridgeSegmentSave[]` and `walls: WallSave[]`
- `wallSeq`, `bridgeSeq`, `segmentSeq`, `speedLineSeq` — sequence counters
- `obstacles: ObstacleSave[]`, `obstacleSeq` — free-standing obstacles (world-positioned)
- `traps: TrapSave[]`, `trapSeq` — includes `durationTiers: TrapDurationTierSave[]` for buff_zone traps
- `portals: PortalSave[]`, `portalSeq` — teleport pads with destination config
- `rotations: RotationSave[]`, `rotationSeq` — pivot-group rotation animations; `pivotGroup` and `currentAngle` are runtime-only and stripped on save
- `footings: BaseFootingSave[]`, `footingSeq` — base-mounted decorative shapes on the octagon base (distinct from world-positioned obstacles)
- `jumpLinks: JumpLinkSave[]`, `jumpLinkSeq` — two-endpoint launch mechanics

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
- **`BEY_SAVE_VERSION = 2`**: Saved with `{ ...cfg, v: BEY_SAVE_VERSION }`. On load: if `parsed.v !== BEY_SAVE_VERSION`, discard. No migration. `PartData.present` and `particleConfig` use `defaultPresentConfig()`/`defaultParticleConfig()` as defaults when fields are missing.
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
- **Speed line preset: always pass projector to `applySpeedLine`**: `_updateSpeedLine` (ArenaSandbox) must call `this._buildSurfaceProjector(sl.parentArenaId)` and pass it as the 7th argument. Omitting it silently breaks thread-on-surface (D-shape) projection on every UI edit — surface projection only works on initial load if projector is missing from the update path.
- **Speed line preset mode and segment editor**: When `sl.presetType !== 'custom'`, the START and SEGMENTS sections in PropertiesPanel are hidden — they show only for `'custom'`. The "↺ Regenerate Shape" button calls `onPresetChange()` then `refresh()` so the INFO section (segment count, total length) updates immediately.
- **`_slSectionsUI` structural changes need `refresh()`**: Add section / delete section / "Sync All to Global" in `_slSectionsUI` must call `refresh()` after `onPresetChange()`. Otherwise the section list shows a stale count (old DOM) while the data model has changed.
- **`samplePathForOverlap` requires `arena` argument**: Signature is `samplePathForOverlap(sl, arena, surfFn)` — `arena` is needed because `computeSegmentPath` now takes the arena for coordinate transforms. Omitting it is a TypeScript error.
- **New SpeedLineSave fields are optional (`?`)**: All 13 new fields added to `SpeedLineSave` use `?` so the demo arena config (which predates the preset system) loads without migration. `defaultSpeedLine()` provides the default values when fields are absent.
- **`SpeedLineSegment.maxStayDuration/statModifiers/sectionIndex` are optional**: These 3 new fields use `?` on the interface so existing segment literals in `demoArenaConfig.ts` remain valid TypeScript without adding those fields.
- **`sceneSurfaceProjector.ts` must not import from `screens/`**: It is a pure utility — imports only `THREE` and `arenaTypes`. Keep it free of ArenaSandbox dependencies so it can be used from geometry builders.
- **`SceneSurfaceProjector` world vs arena-local coords**: `project(x, z, offset)` takes **world** XZ coordinates. Convert arena-local → world before calling: `worldX = arena.posX + lx*cos(arena.rotY_rad) - lz*sin(arena.rotY_rad)` etc. The returned `point.y` is already world-space Y; use it directly in `computeSegmentPath`.
- **`sectionAngles`/`sectionDurations` removed from `SpeedLinePresetParams`**: These were stale parallel arrays replaced by `sections: SpeedLineSection[]`. If you see build errors referencing them, they were removed from the type — use the `sections` array instead.
- **Obstacle `posY` is manual, trap/portal Y is automatic**: Obstacle position is fully user-controlled — do NOT derive `posY` from the arena surface. Trap and portal Y IS derived from `trapSurfY()`/`portalSurfY()` at creation and rebuild time — do NOT store it explicitly.
- **Trap `variantMesh` needs separate disposal**: `_disposeTrap` must dispose `trap.variantMesh` independently (like `arena.spiralMeshes`). Never skip it — it leaks GPU memory.
- **Portal `ringMesh` needs separate disposal**: Same pattern — `_disposePortal` must dispose `portal.ringMesh` explicitly.
- **`speedPathId` is a reverse reference, not a path builder**: `ObstacleData.speedPathId`, `TrapData.speedPathId`, `PortalData.speedPathId` are ID strings pointing to existing `SpeedLineData` that targets this object. They do NOT create new speed lines and require no geometry rebuild when changed.
- **`BUFF_TIER_PRESETS` keys are surface names, not tier-effect names**: The keys are `'sand'|'lava'|'ice'|'water'|'oil'` (matching `buffSurface`). The `tierEffect` values inside each preset entry are `TrapTierEffect` variants. Never confuse the two.
- **Duration tiers only rendered for `effect='buff_zone'`**: The `_trapDurationTiersSection` call in `showTrap()` is conditional. Tiers stored in `TrapData.durationTiers` are serialized/deserialized regardless of effect type, but only shown in the UI and applied at runtime for `buff_zone`.
- **Obstacle/trap/portal sequences in both `_applyConfigToScene` AND `loadArena`**: Both code paths that restore config must set `obstacleSeq`, `trapSeq`, `portalSeq` from `cfg`. Missing either one causes ID collisions after load.
- **Rotation sequences in both `_applyConfigToScene` AND `loadArena`**: Same pattern — both paths must set `rotationSeq` from `cfg.rotationSeq ?? 0`.
- **`_clearArenas` must detach rotations first**: Before disposing any node objects, iterate `this.rotations` and call `scene.attach(obj)` for all member objects to return them to scene root, then `scene.remove(pivotGroup)`. Skipping this causes objects to vanish when the pivot group is garbage-collected.
- **`_afterApply` after every rotation-member rebuild**: Whenever `applyTrap/applyObstacle/applyZone/applyWall` is called for a node in a rotation, call `_afterApply(nodeId)` afterward. The apply functions reset `mesh.position` to natural world coords; `_afterApply` corrects to group-local by subtracting `pivotGroup.position`.
- **SceneTree `onGroup` auto-creates a group node**: `sceneTree.onGroup(autoGroupId, childIds)` is called after the tree already added a `group-N` node. Call `this.sceneTree.remove(autoGroupId)` first, then `addRotation()` which creates its own `rot-N` node with the `↻` icon.
- **`ROT` constants namespace**: All rotation tuning values live in the `ROT` object in `arenaConstants.ts` (`DEFAULT_SPEED`, `DEFAULT_OSC_AMP`, `DEFAULT_OSC_FREQ`, `MIN_SPEED`, `MAX_SPEED`). Never inline these as magic numbers.
- **Rotation floor Y correction is per-tick, not per-apply**: Trap/zone members must have their Y corrected every tick via `_applyFloorCorrection()` because the bowl surface Y at their world XZ changes continuously as they orbit. Do not try to bake a fixed Y at attach time.
- **Properties panel two-callback pattern**: `showWall/showObstacle/showTrap/showPortal/showFooting` each take two callbacks — `onGeomChange` (sliders/colors, no re-render) and `onFullChange` (button-group rows that show/hide sub-sections or change surface/material/shape — triggers `showX()` closure re-render). Never route a button-group row to `onGeomChange` — it will leave conditional sub-rows and sibling button highlights stale. The `showX` closure pattern: `const showX = () => this.props.showX(data, live, () => { ...; showX(); }, ...); showX();`.
- **`saveArena()` is debounced 300 ms**: Never assume a `saveArena()` call writes immediately. For paths that must write right away (demo load, `_applyConfigToScene`, undo/redo restore), call `this._flushSave()` instead. `_flushSave()` cancels the pending timer and writes synchronously. Never add a direct `localStorage.setItem` call — all persistence goes through `saveArena()`/`_flushSave()`.
- **Footing sequences in both `_applyConfigToScene` AND `loadArena`**: Both code paths that restore config must set `footingSeq` from `cfg.footingSeq ?? 0`. Missing either one causes ID collisions after load. (Same rule applies to obstacle/trap/portal/rotation sequences — all sequence counters must be restored in both paths.)
- **`_clearArenas` must dispose footings**: Iterate `this.footings` and call `_disposeFooting(f)` + `this.sceneTree.remove(f.id)` before clearing the map. Also reset `this.footingSeq = 0`. Skipping this leaks GPU geometry when the scene is reset.
- **`_onReparent` coverage — reparentable vs not**: The `sceneTree.onReparent` handler supports these node types: wall (arena↔base), pit (arena↔arena), zone (arena↔arena), trap (arena↔base), portal (arena↔base), speed line (arena/zone), bridge segment (same-bridge reorder + cross-bridge). These types are **not reparentable** and their drops must be silently ignored: arena, obstacle, footing, bridge (container), rotation. For non-reparentable nodes, do not call `saveArena()` or modify any data model.
- **`footingBuilders.ts` must not import from `obstacleBuilders.ts`**: Both files implement the same 6-shape geometry switch (cube/cuboid/sphere/cylinder/pyramid/frustum) independently. This is intentional per coupling-prevention rules — base footings and world obstacles are distinct object types. Sharing the geometry function would couple their build/dispose/apply lifecycle.
- **`src/features/` managers must not import from `src/screens/`**: Managers are reusable classes independent of ArenaSandbox. They receive everything they need via `SceneContext` and injected getter callbacks. Any import from `screens/` is a violation that couples the manager to the sandbox.
- **Non-nullable mesh/edges in ObstacleData, TrapData, PortalData**: `data.mesh` and `data.edges` are typed as `THREE.Mesh` (not `THREE.Mesh | null`) on these three types. In `disposeOne()` just call `scene.remove(data.mesh)` and `data.mesh.geometry.dispose()` — do NOT assign `data.mesh = null`, it is a TypeScript type error.
- **`BridgeSegmentSave` has no `bridgeId` field**: `bridgeId` is not serialized in segment saves. Pass it as a separate parameter: `restoreSegment(save: BridgeSegmentSave, bridgeId: string)`. Using `save.bridgeId` is undefined.
- **`BridgeSegmentSave` field names must match exactly**: The correct save field names are `curveRadius/curveAngle/curveDirection/bankAngle`, `cp1X/cp1Y/cp1Z/cp2X/cp2Y/cp2Z`, `endX/endY/endZ`, `loopRadius/loopOrientation/tiltAngle`, `corkscrewLength/corkscrewTurns`. There is no `bezierCX`, `corkRotations`, `chicaneWidth`, or `chicaneLength` in the save type.
- **`trapWorldCenter` needs a live arenas map**: `WallManager` must inject `getArenas: () => ReadonlyMap<string, ArenaData>` and pass `this.getArenas() as Map<string, ArenaData>` to `trapWorldCenter`. Passing `new Map()` means arena-parented trap positions default to cx=0, cz=0 — every trap wall ends up centered on the origin.
- **`resolveStartPose` needs live arenas and walls maps**: `BridgeManager` must inject both `getArenas` and `getWalls` callbacks and pass them to `resolveStartPose`. Passing empty maps breaks any bridge anchored to an arena rim or a wall endpoint.
- **`RotationManager.detachAll()` must be called before any other manager's `clear()`**: `detachAll()` returns all member objects from pivot groups back to scene root. If another manager disposes a member object before detachAll, the pivot group's reference becomes dangling and the object disappears without being properly disposed. Call order: `rotationMgr.detachAll()` → then all other `mgr.clear()` → then `rotationMgr.clear()`.
- **`RotationManager.afterApply(nodeId)` after every rotation-member rebuild**: When any feature's `apply()` method is called for a node that belongs to a rotation, call `rotationMgr.afterApply(nodeId)` afterward. The `apply()` functions set `mesh.position` to natural world coordinates; `afterApply()` corrects to group-local by subtracting `pivotGroup.position`.
- **`src/features/` managers never import each other directly**: Inter-manager communication uses injected callbacks. TrapManager accepts a `removeTrapWalls: (trapId) => void` callback rather than importing WallManager. BridgeManager accepts a `removeWall: (wallId) => void` callback. This prevents circular dependencies and keeps managers independently testable.

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
| `src/geometry/speedLineBuilders.ts` | Speed line path computation, ribbon, handles, arrows, overlap detection, shape samplers, waypointsToSegments, applySpeedRamp, applyModulation, generatePresetSegments changes |
| `src/geometry/sceneSurfaceProjector.ts` | SceneSurfaceProjector raycast logic or coordinate transform changes |
| `src/geometry/obstacleBuilders.ts` | Obstacle shape geometry or default factory changes |
| `src/geometry/trapBuilders.ts` | Trap plate geometry, variant meshes, or surface-Y derivation changes |
| `src/geometry/portalBuilders.ts` | Portal pad geometry, torus ring, or surface-Y derivation changes |
| `src/geometry/footingBuilders.ts` | Base footing shape geometry, positioning, or default factory changes |
| `src/features/IArenaFeature.ts` | A new context capability or manager interface is added |
| `src/features/FeatureManager.ts` | The shared CRUD lifecycle (insert/remove/clear/serialize) pattern changes |
| `src/features/ParentedFeatureManager.ts` | Surface-Y resolution or tree-parent logic for arena/base parents changes |
| `src/features/managers/WallManager.ts` | Wall lifecycle, auto-join, auto-rotation, or parent-type dispatch changes |
| `src/features/managers/BridgeManager.ts` | Bridge/segment lifecycle, pose chaining, or wall-cascade callback changes |
| `src/features/managers/SpeedLineManager.ts` | Speed line lifecycle, projector wiring, or handle show/hide changes |
| `src/features/managers/RotationManager.ts` | Pivot-group animation, detach ordering, or afterApply correction changes |
| `src/features/managers/ObstacleManager.ts` | Obstacle lifecycle or buildAndShow restore path changes |
| `src/features/managers/TrapManager.ts` | Trap lifecycle, variantMesh disposal, wall-cascade callback, or earthquake/RPM tick changes |
| `src/features/managers/PortalManager.ts` | Portal lifecycle or ringMesh disposal changes |
| `src/features/managers/FootingManager.ts` | Footing lifecycle or buildAndShow restore path changes |
| `src/features/managers/ArenaEnvironmentManager.ts` | Arena environment schedule (gravity/tilt/fog/score), keyframe apply, or trigger-event dispatch changes |
| `src/features/managers/SpawnManager.ts` | Physics test-ball spawn/despawn, pyriform geometry, floor/wall/trap/SL/zone physics tick, HUD, or localStorage settings changes |
| `src/features/managers/ProjectileManager.ts` | Bullet lifecycle, orbit/boomerang motion, or spawn/expire logic changes |
| `src/features/managers/TranslationManager.ts` | Path-animation lifecycle, easing, loop modes, or waypoint interpolation changes |
| `src/features/managers/TargetManager.ts` | Target-binding lifecycle, behavior modes (follow/orbit/flee), or position-injection interface changes |
| `src/features/managers/TriggerZoneManager.ts` | Zone registration, overlap detection algorithm, or enter/exit/stay callback dispatch changes |
| `src/features/ISurfaceProvider.ts` | Surface abstraction interface or SurfaceHit type changes |
| `src/features/surfaceProviders.ts` | ArenaSurfaceProvider, FlatSurfaceProvider, or MeshSurfaceProvider implementation changes |

### Allowed import direction (never reverse)
```
arenaConstants + arenaTypes  ←  primitives.ts
                             ←  surfaceUtils.ts
                             ←  bowlBuilders / scoopBuilders / platformBuilders / materialBuilders / fillBuilders
                             ←  wallBuilders.ts
                             ←  bridgeSegmentBuilders.ts
                             ←  speedLineBuilders.ts
                             ←  arenaObjectBuilders.ts  (also imports speedLineBuilders)
                             ←  obstacleBuilders.ts / trapBuilders.ts / portalBuilders.ts / footingBuilders.ts
                             ←  src/features/IArenaFeature.ts  (no project imports — only THREE + SceneTree types)
                             ←  src/features/FeatureManager.ts / ParentedFeatureManager.ts
                             ←  src/features/managers/*.ts  (import geometry builders + persistence; never from screens/)
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
- **Presentational STL view mode**: `_arenaViewMode` (`'hitbox'|'both'|'present'`) is toggled by the **⬡ Hitbox / ◈ Both / ✦ Visual** bottom bar. `_applyViewMode()` sets `.visible` on all hitbox objects and `_presentMeshes`. Call `_applyViewMode()` any time a present mesh is added/removed. Default mode is `'both'`.
- **Present mesh node IDs**: `_presentMeshes` is keyed by node ID (`wall.id`, `arena.id`, etc.). Call `_loadPresentStl(nodeId, b64, color)` to add, `_disposePresentMesh(nodeId)` to remove. The STL file picker is `_fileInputStl(nodeId, color, onLoaded)`.
- **Arena PointLight disposal**: `disposeArena` disposes `arena.light` explicitly. If you add light creation, always pair it with disposal. `_createArenaLight` skips light when `lightIntensity === 0`.
- **Particle system disposal**: `disposeArena` and `disposeZone` dispose `particleSystem.points` from scene and call `.dispose()`. `onTick` calls `.tick(dt)` for all live particle systems. ParticlePreset `'none'` means no system is created.
- **surfaceRow proxy bug (do not re-introduce)**: `surfaceRow(target, onChange)` mutates `target.surface` and `target.customTileData` directly. Always pass the actual data object (wall, trap, portal, etc.) — never a temporary `{ surface, customTileData: null }` proxy, or `customTileData` changes will be lost.
- **TrapData.baseMaterial vs material**: TrapData has `baseMaterial: ArenaMaterial`, not `material`. When calling `_wallMaterialRow` for a trap, wrap it: `const proxy = { material: data.baseMaterial }; _wallMaterialRow(proxy, ..., () => { data.baseMaterial = proxy.material; onChange(); })`.
- **BridgeSection is the source of truth for deck appearance**: `bridge.section.color/surface/customTileData/tileScale/emissiveColor/emissiveIntensity/opacity` drive all deck rendering. The old `bridge.color` and `bridge.surface` legacy fields are unused — do not wire them in new UI or geometry code.
- **Steps/Spiral appearance overrides**: `ArenaData.stepsColor/stepsSurface/stepsCustomTileData` (null = inherit arena color) and `spiralColor/spiralSurface/spiralCustomTileData` are passed to `buildSteppedBowl` / `buildSpiralLedgeMesh`. When null, the builder falls back to `lightColor(arena.color)`.
- **Particle builders live in `particleBuilders.ts`**: `buildParticleSystem(preset, cx, cz, radius, baseY)` returns `{ points: THREE.Points, tick(dt): void, dispose(): void }`. Never inline particle creation in ArenaSandbox.
- **topFaceMesh material must always use `polygonOffset: true`**: The octagon top face is coplanar with the arena bowl rim and rim seam mesh (all at y=0 for non-elevated arenas). Without polygon offset, severe z-fighting flickers across the whole rim area. All three material creation sites in `ArenaSandbox` (`buildCustom`, `rebuildBase`, color-change handler) must pass `polygonOffset: true` to `buildSurfaceMaterial`. The cache key includes `:po` so it stays separate from non-offset materials.
- **Non-elevated arenas use `buildFreeArenaMesh`, not bare `buildParabolicBowl`**: `buildArenaBowlGeo` and `updateArenaBowlHoles` both call `buildFreeArenaMesh` for non-elevated non-step non-moat arenas. This gives the bowl an outer vertical skirt + bottom cap. Reverting to `buildParabolicBowl` removes the outer wall and shows the hollow interior.
- **`buildSteppedBowl` boundary blending**: Step segments adjacent to non-step segments blend their boundary-side vertex Y values toward `parabY(t)` via `bY(rawY, t, isA0side)`. Do not remove this — without it there is a hard visual seam at every step/smooth arc boundary. The blend only affects the single-segment-wide boundary, not the interior of either zone.
- **Bridge segment meshes are in `bridge.group`, not scene root**: `scene.remove(seg.mesh)` is a no-op for segment meshes. Always call `bridge.group.remove(seg.mesh)` and `bridge.group.remove(seg.edges)`. Applies in `removeSegment`, `_disposeBridge`, and any other disposal path.
- **Bridge `computeSegmentEndPose` needs `section`**: For loop-type segments (`return_loop`, `exit_loop`, `loop`, `corkscrew`) the lateral offset in the end pose depends on `section.width` (track width). Always pass `bridge.section` as the third argument: `computeSegmentEndPose(seg, pose, bridge.section)`. Omitting it causes segment chains to gap at loop junctions.
- **Trap wall rim points must be world-space**: `trapRimPoints(trap)` returns trap-LOCAL XZ coordinates (centered at 0,0). Before passing to `buildWallGeometry`/`buildWallEdgeGeometry`, translate to world space: `rimPts = trapRimPoints(trap).map(p => new THREE.Vector2(p.x + c.x, p.y + c.z))`. Then pass `cx = c.x, cz = c.z` (world center). Passing local points with a world-space center causes the inward-direction calculation to be wildly wrong.
- **Arena wall rim points are local; inward direction uses local-space center**: `shapePoints(arena)` returns arena-LOCAL XZ (centered 0,0). The geometry builder's `inwardDir` computes `(centreX - p.x, centreZ - p.y)`. For arenas at posX=posZ=0 this equals `(0 - localPt.x, 0 - localPt.y)` — correct. For off-centre arenas the inwardDir would be skewed, but in practice arenas are always at origin. Do NOT move arenas to non-zero posX/posZ without also translating rimPts to world space.
- **Pit depth is fixed — never add a depth slider**: `PIT_FIXED_DEPTH = 10` cm. Use `readRow('Depth', '10 cm (fixed)')` (no callback) to display it. Using `textRow` creates an editable input; using `numRow` creates a slider — both are wrong for a fixed read-only value.
- **Wall auto-join sibling rebuild guard**: `applyWall(wall, _rebuildingSiblings)` — when rebuilding sibling walls after an `autoJoin` change, pass the `sibs: Set<string>` as the second argument. The guard check is `if(!_rebuildingSiblings && wall.autoJoin && ...)`. Without it, sibling-A rebuilds → sibling-B → sibling-A → infinite recursion.
- **`showWall` parentArena must be passed for moat ring selector**: The 7th optional argument to `PropertiesPanel.showWall` is `parentArena?: ArenaData`. Without it, the moat ring selector (`Outer rim` / `Inner rim`) never renders for moat arenas. In `ArenaSandbox` the caller resolves: `const parentArena = wall.parentType==='arena' ? this.arenas.get(wall.parentId) : undefined`.
- **Wall `_rotatePivot` and `_arenaRotateTimer` are runtime-only — never serialize**: These fields exist on `WallData` but must be stripped from `WallSave`. `wallToSave()` must not include them. They are re-created by `applyWall` when `rotateOnArena` is true.
- **Trap wall child cleanup on trap delete**: `_disposeTrap` must iterate `this.walls` and dispose + remove any wall where `wall.parentType==='trap' && wall.parentId===trap.id` before removing the trap itself. Skipping this leaks GPU geometry.
- **`sharedTypes.ts` is the single source of `PresentConfig` / `ParticleConfig`**: Both `arenaTypes.ts` and `beybladeTypes.ts` import from `src/types/sharedTypes.ts`. Never define these interfaces inline in either file. `arenaTypes.ts` and `beybladeTypes.ts` re-export them for backward compat.
- **`BEY_SAVE_VERSION = 2`**: Beyblade saves now include `v: 2`. On parse in `_loadFromStorage`, if `parsed.v !== BEY_SAVE_VERSION`, discard and return. No migration. `BeybladeStore.deserialize` spreads defaults then overwrites: `const part = { ...p }; if (!part.present) part.present = defaultPresentConfig(); if (!part.particleConfig) part.particleConfig = defaultParticleConfig();`. Do NOT write `{ present: defaultPresentConfig(), ...p }` — TS reports TS2783 duplicate key error.
- **`ARENA_SAVE_VERSION = 12`**: Arena saves from lower versions are discarded silently on parse error. New fields in `ArenaSave`/`BridgeSegmentSave`/`TrapSave` are optional (`?`) so partial saves load without crash.
- **Sub-nodes are not reparentable**: In `ArenaSandbox._onReparent` and `BeybladeSandbox` tree wiring, any `nodeId` starting with `present-`, `particle-`, `weather-`, or `env-` must return immediately without doing anything. Similarly in `_duplicateNode` — skip sub-node IDs.
- **`_subNodesAdded` set tracks present/particle/weather/env IDs**: In both sandboxes, `_subNodesAdded: Set<string>` prevents adding the same sub-node twice. `_addSubNodePresent(featureId)` checks `_subNodesAdded.has('present-'+featureId)` before adding. When a feature is deleted, remove its sub-node IDs from `_subNodesAdded`. When **`_clearArenas` is called** (undo/redo/demo load), `_subNodesAdded.clear()` must be called — otherwise old sub-node IDs block the tree from being repopulated on the next restore.
- **Arena delete must clean sub-node IDs from `_subNodesAdded`**: The `sceneTree.onDelete` arena block must call `_subNodesAdded.delete('present-'+id)`, `_subNodesAdded.delete('particle-'+id)`, `_subNodesAdded.delete('weather-'+id)`, `_subNodesAdded.delete('env-'+id)` when an arena is deleted. Without this, a new arena created with the same ID (possible after undo) cannot re-add its sub-nodes.
- **`_applyArenaTilt` must be called after every `applyArena`**: `applyArena()` recreates the arena mesh and resets `rotation.x/z` to 0. Any site that calls `applyArena(...)` — arena renderProps callbacks (onGeomChange + onFullChange), `rebuildBase()`, and `_onEnvChange` weather surface-map path — must immediately follow with `this._applyArenaTilt(arena)`. Omitting it causes the tilt to silently reset whenever arena geometry is edited.
- **`_applyArenaTilt` must include `spiralMeshes`**: Spiral arenas have `arena.spiralMeshes: THREE.Mesh[]` which are separate Three.js objects from `arena.mesh`. Tilting only `arena.mesh` causes the spiral ledge geometry to remain flat while the bowl tilts. Always rotate all `spiralMeshes` entries: `for (const m of arena.spiralMeshes ?? []) { m.rotation.x = rx; m.rotation.z = rz; }`.
- **`_createArenaFog` must use `'fog'` preset and scale `density` by `fogDensity`**: Using `'dust'` or leaving default density ignores the fogDensity slider value. Correct pattern: `{ ...defaultParticleConfig(), preset: 'fog' as ParticlePreset, density: arena.fogDensity }`. The `'fog'` preset is valid in `ParticlePreset` (defined in `sharedTypes.ts`).
- **`ArenaEnvironmentManager` interval timer init needs `Math.max(0, ...)`**: `entry._timer = entry.intervalSec - entry.delaySec` can produce a negative value when `delaySec > intervalSec`, causing the first fire to happen on the very next tick. Always clamp: `Math.max(0, entry.intervalSec - entry.delaySec)`.
- **`ArenaEnvironmentManager._fireEntry` revert timer must always reset on fire**: The guard `if (!entry._prevValues)` must only protect the snapshot step (don't overwrite pre-revert values on a mid-revert re-fire). But `entry._revertTimer = 0` must always run when `revertSec > 0` — move it outside the `!_prevValues` guard so a second fire restarts the revert countdown.
- **RPM wrap revolution detection: use `!==` not `>`**: `Math.floor(wrapped/2π) > Math.floor(prevAngle/2π)` only detects forward (CW) full revolutions; CCW rotation (negative omega) wraps in the opposite floor direction and is never detected. Use `!==` to handle both directions: `Math.floor(wrapped/(Math.PI*2)) !== Math.floor(prevAngle/(Math.PI*2))`.
- **`EnvProperty` must be a top-level import, not an inline `import()` type**: Inline `import('../types/arenaTypes').EnvProperty[]` in method signatures works but is fragile and non-idiomatic. Import `EnvProperty` in the top-level named imports from `'../types/arenaTypes'` alongside the other type imports.
- **`show()` closure pattern for sub-node panels**: `_selectPresentNode(partId)` wraps `panel.showPresentation(...)` in a `show()` closure called on import/clear callbacks to refresh button labels (e.g. "Import STL…" → "✓ Replace STL…" after import). Without this the panel shows stale button text.
- **`_addPartToTree(id)` helper in BeybladeSandbox**: Both `_onPartAdded` and `_rebuildTree` must call this helper (not inline `tree.add(...)`) to ensure `addChildButtons` (S+, ✦+, ✧+) are wired correctly after undo/redo.
- **Slider `onChange` debounce**: `AbstractPropertiesPanel.numRow()` now uses `input` event for display-only (no `onChange`) and `change` event for `onChange` (fires on mouseup/touchend). Do NOT revert to calling `onChange` on `input` — it causes 60fps geometry rebuilds while dragging.
- **`_duplicateNode` in ArenaSandbox skips bridges, speed lines, rotations**: These are complex graph structures that cannot be shallow-cloned. Silently return without error for these IDs. Pits, zones, arenas, walls, traps, portals, obstacles, footings are all safe to duplicate.
- **Weather system disposal**: `arena.weatherSystem?.dispose()` removes `points` from scene. Weather system `tick(dt)` called in `onTick` for all arenas. Building a new weather system replaces the old one — always dispose before rebuild.
- **Gravity pull trap `_gravityTimer` is runtime-only**: Never serialize it. Initialized to `0` in `defaultTrap`. `applyTrap` does not reset it — only `onTick` advances it.
- **`ArenaConfig` is in `arenaPersistence.ts`, NOT `arenaTypes.ts`**: `presetTypes.ts` and `presetStore.ts` must import `ArenaConfig` from `'../utils/arenaPersistence'` (or `'./arenaPersistence'` within utils). Importing from `arenaTypes.ts` is a compile error — that file only has arena data model types, not the serialization config shape.
- **`arenaToSave` signature is 4 args, not 5**: Correct: `arenaToSave(id: string, arena: ArenaData, pits: Map, zones: Map): ArenaSave`. It returns `walls: []` and `speedLines: []` (populated by caller). Never pass walls/speedLines as arguments — that function signature does not accept them.
- **`trapToSave` takes 1 arg**: `trapToSave(trap: TrapData): TrapSave`. Returns `walls: []` — caller must manually set `ts.walls = [...].filter(...).map(wallToSave)`.
- **`extractArenaConfig` auto-expands IDs**: When a checked ID is an arena, all its pits/zones/walls/speedLines are included automatically. When a checked ID is a bridge, all its segments and child walls are included. When a checked ID is a trap, its child trap walls are included. Rotations are only included if ALL their memberIds are also in the expanded selection set.
- **`_checkPendingLoad()` runs after `super.setVisible(v)`**: Both `ArenaSandbox` and `BeybladeSandbox` call `_checkPendingLoad()` inside `setVisible(true)` AFTER `super.setVisible(v)`. This guarantees `buildCustom()` has run (on first visit) so the scene tree, store, and maps exist before the pending load is applied. Never call `_checkPendingLoad()` before `super.setVisible(v)`.
- **Two ArenaSandbox instances do not share state**: `ArenaSandbox` derives its localStorage key from `opts.title` — `"Arena Sandbox"` → `bey_arena_arena_sandbox`; `"Preset Editor"` → `bey_arena_preset_editor`. They are fully independent. When `presetEditorMode: true`, back and library buttons both go to `arena-library`.
- **Pending load keys are read-once**: `_checkPendingLoad()` immediately calls `localStorage.removeItem(key)` before applying the config. The key is never left in storage after a successful read. On the next `setVisible(true)` call, if no key exists, no load is triggered.
- **`BeybladeStore.mergeDeserialize` does not call `reset()`**: Unlike `deserialize`, which calls `this.reset()` first, `mergeDeserialize` appends to existing data. Call `mergeDeserialize` for merge mode; call `deserialize` for replace mode.
- **SceneTree checkbox does not trigger row selection**: The checkbox `click` handler calls `e.stopPropagation()` so it does not bubble to the row's selection handler. Checking a node does NOT select it in the properties panel. This is intentional — checkboxes are for multi-select save operations, not for editing.
- **`extractArenaConfig` — portals and rotations have conditional inclusion**: Portals are always included if their ID is checked. But `destPortalId` is only set if the destination portal is also in the selection; otherwise set to `null`. Rotations are only included if every ID in `memberIds` is also in the expanded selection set — partial rotations are excluded entirely.
- **`_makeCard` in ArenaLibraryScreen assembles the card at the end**: `card.innerHTML = ''` clears the card div before the real thumbnail and body are appended (lines 217+). Any DOM manipulation before this line is wasted. Do not add thumbnail code before the `card.innerHTML = ''` line.
- **Assembly stacking uses accumulated `axisOffsetY`**: In `BeyLibraryScreen._mergeConfigs`, parts from each preset slot are assigned a new `axisOffsetY` equal to the accumulated height of all previous parts. The part's own original `axisOffsetY` within its preset is preserved (relative stacking within the preset); the accumulated offset is added on top. Never bake `axisOffsetY` into vertex Y.
- **`ArenaEnvironmentManager` uses Map keys, not `arena.id`**: `ArenaData` has no `id` field — the ID is the Map key. Use `for (const [arenaId, arena] of getArenas().entries())` and pass `arenaId` explicitly to all callbacks. Never write `arena.id`.
- **`_loadArenasFromConfig` must include all new `ArenaData` fields**: Every field added to `ArenaData` (env/physics/scoring) must be added to the arena construction object in `_loadArenasFromConfig` with a `?? default` fallback. Omitting any required field causes a TS2740 type error at the arena construction literal. Use `ENV.*` constants for defaults.
- **Bridge `_animPivot` mesh children pattern**: `applySegment` places `seg.mesh` and `seg.edges` as children of `seg._animPivot` (not direct children of `bridge.group`). `seg._animPivot` is in `bridge.group`. Disposal must call `bridge.group.remove(seg._animPivot)` — not `bridge.group.remove(seg.mesh)`. The latter is a no-op since mesh is no longer a direct group child.
- **Bridge anim runtime fields are NOT saved**: `_animTimer`, `_animCenter`, `_animPivot` are never in `BridgeSegmentSave`. They are re-initialized in `_loadArenasFromConfig` and `BridgeManager.restoreSegment` with `_animTimer: 0, _animCenter: new THREE.Vector3(), _animPivot: null`.
- **`SpeedLineData.enabled` = visibility toggle, not geometry toggle**: When `sl.enabled = false`, set `.visible = false` on `sl.mesh`, `sl.edges`, and each marker/handle mesh. Do NOT rebuild geometry. `buildSpeedLineObjects` checks `sl.enabled !== false` and sets visibility on every mesh it creates.
- **`jumpLinks` and `jumpLinkSeq` are required in every `ArenaConfig` literal**: Both `serializeConfig()` in `ArenaSandbox.ts` and all `ArenaConfig` construction sites in `presetStore.ts` must include `jumpLinks: [], jumpLinkSeq: 0`. Missing either causes a TS2741 error.
- **`ARENA_SAVE_VERSION = 12`**: Arena saves from lower versions are discarded silently. All new fields in `ArenaSave`, `BridgeSegmentSave`, `TrapSave` are optional (`?`) so they load cleanly if absent — use `?? default` patterns in restore code.
- **`TrapManager` now implements `ITickableManager`**: Its `tick(dt)` must be called from `ArenaSandbox.onTick(dtMs)`. The `tick` param is seconds (not ms) — `TrapManager.tick` converts ms internally. Do not call `tick` with ms directly.
- **Earthquake mesh vertex mutation via `updateEarthquakeMeshHeights`**: Earthquake mesh uses `BufferUsage.DYNAMIC_DRAW`. After calling `updateEarthquakeMeshHeights(data)`, you must set `geo.attributes.position.needsUpdate = true` and call `geo.computeVertexNormals()`. The function handles this internally — never mutate the position buffer directly.
- **Wall `thicknessDirection` default is `'outward'`**: New walls default to `thicknessDirection: 'outward'`. In `wallBuilders.ts`, `dirMult = -1` for outward. Boundary clamp prevents wall from exceeding octagon edge. Only moat-inner walls should typically use `'inward'`.
- **Every node type that is a jump link source must have `⤻+` in `addChildButtons`**: Arena, obstacle, trap, and base nodes all support jump link sources. All four restore paths (`_restoreArenaSave`, `_restoreObstacleSave`, `_restoreTrapSave`, base node in `buildCustom`) and all four duplicate branches in `_duplicateNode` must include `{ label:'⤻+', title:'Add jump link', className:'sl-btn', onClick:()=>this._addJumpLink(id,'<type>') }` between `↻+` and `✦+`. Omitting it prevents jump links from being added to that node type entirely — no error, just a silently missing feature.
- **`resolveEndpointWorld` base-parented trap must include `basePosX/Z`**: When `ep.parentType === 'trap'` and `trap.parentType === 'base'`, the trap's world position is `(trap.basePosX, _, trap.basePosZ)`. The endpoint offset `ep.localX/Z` is relative to this — compute `wx = trap.basePosX + ep.localX; wz = trap.basePosZ + ep.localZ`. Using just `ep.localX/Z` silently places the endpoint at the origin.
- **`buildArcArrows` cone orientation must use quaternion, NOT `lookAt` + `rotateX`**: `ConeGeometry` tip is at Y+. To point it along an arbitrary 3D direction use `mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir)`. The `mesh.lookAt(next); mesh.rotateX(Math.PI / 2)` pattern gimbal-locks for near-vertical arcs (the arc apex), producing randomly-flipped cones.
- **`showJumpLink` physics-only `numRow` callbacks must still call `onGeomChange()`**: Even when a property doesn't affect arc geometry (e.g., `f.arcDuration`, `f.launchForce`, stat modifiers), the callback MUST call `onGeomChange()` so `saveArena()` is triggered. Without it, slider changes are lost on page reload. The pattern: `v => { f.someField = v; onGeomChange(); }` for every numRow and colorRow in the panel.
- **`showSpeedLine` `jump_link` exitBehavior must use `selectRow` with `getJumpLinks` callback, NOT `textRow`**: `textRow` requires the user to type internal IDs like "jl-1" — unusable in practice. The correct pattern: add `getJumpLinks?: () => JumpLinkData[]` as the last optional parameter to `showSpeedLine`, and pass `() => [...this.jumpLinks.values()]` from ArenaSandbox. The 'jump_link' section then uses `selectRow` with `jlList.map(jl => ({ value: jl.id, label: jl.name }))`. The `refresh` closure inside `showSpeedLine` must forward `getJumpLinks` so the list stays current after navigation.
- **`_removeJumpLink` must clear stale `jumpLinkId` references on speed lines**: When a jump link is deleted, any speed line that has `sl.jumpLinkId === deletedId` will silently point to a non-existent link. Always iterate `this.speedLines` and set `sl.jumpLinkId = null` for matching entries BEFORE disposing the jump link.

- **`ArenaEnvironmentManager.clear()` resets timers, not schedule entries**: `clear()` only zeroes `_timer/_revertTimer/_prevValues` on existing entries. Call `clearSchedule(arenaId)` to actually remove entries for an arena. Never confuse these two methods.
- **`triggerEvent()` only fires `'event'`-type entries**: `'interval'` and `'once'` entries are unaffected by `triggerEvent()` calls — they only advance via `tick()`.
- **`_score` is runtime-only**: `ArenaData._score` accumulates in `ArenaEnvironmentManager.tick()`. Always starts at 0 on load. Never serialize it. Display in HUD only.
- **`envSchedule` save strips runtime timer fields**: `EnvScheduleSave = Omit<EnvScheduleEntry, '_timer' | '_revertTimer' | '_prevValues'>`. When restoring, set all three to `undefined`.
- **`jumpLinkId` in SpeedLineData is a reverse reference**: Only meaningful when `exitBehavior === 'jump_link'`. Does not trigger any geometry rebuild. Set to `null` when exitBehavior is anything else.
- **`envTriggerEvent`/`envTargetArenaId` require ArenaEnvironmentManager wiring**: These TrapData fields are data-only — they have no effect unless `ArenaSandbox._onTrapActivation` calls `this._envMgr.triggerEvent(...)`. They do nothing in a sandbox without `ArenaEnvironmentManager`.
- **`tiltGroup` on ArenaData is runtime-only**: Created by `_applyArenaTilt()` in ArenaSandbox; never serialized. Re-created on load when arena has non-zero tilt.
- **`ISurfaceProvider` world coordinates, not arena-local**: `getSurfaceAt(worldX, worldZ)` takes WORLD XZ — convert from arena-local to world before calling. `polarToWorld(r, angleDeg)` returns WORLD XZ directly. Never pass arena-local coordinates to `getSurfaceAt`.
- **`ParentedFeatureManager` uses `getSurface` callback, not `getArenas`**: After ISurfaceProvider refactor, the constructor no longer accepts `getArenas: () => ReadonlyMap<string, ArenaData>`. It accepts `getSurface: (surfaceId: string) => ISurfaceProvider | undefined`. ArenaSandbox registers one `ArenaSurfaceProvider` per arena by arena ID. `'octagon-base'` maps to a `FlatSurfaceProvider(DEFAULT_BASE_HEIGHT, 0, 0)`.
- **`visible` on data types is serialized as optional `?`**: Old saves without the field default to `true`. `setVisible(id, false)` on a feature hides the mesh but leaves all physics/trigger behavior active — a hidden trap still fires in SpawnManager, a hidden obstacle still blocks wall collision.
- **`TranslationManager` moves objects directly, no pivot group**: Unlike `RotationManager`, translations apply `.position.set()` directly to member meshes each tick. `detachAll()` is a no-op. Members stay as scene children throughout.
- **`TargetManager` bindings are NOT serialized**: Bindings exist only at runtime. They must be re-established after load if persistence is needed (e.g., call `bind()` in `_applyConfigToScene`). Serializing bindings is outside the current scope.
- **`TRANS` constants namespace**: All translation tuning values live in the `TRANS` object in `arenaConstants.ts` (`DEFAULT_DURATION_MS`, `DEFAULT_EASING`, `DEFAULT_LOOP`). Never inline magic numbers for TranslationManager defaults.
- **`ProjectileManager` is not a FeatureManager**: No scene tree, no serialization, no `add/remove` CRUD. Only `launch(req)`, `tick(dt)`, `expireAll()`. Do not attempt to extend `FeatureManager` for it.
- **`_mergeConfigIntoScene` must restore ALL sequence counters including `jumpLinkSeq`**: When loading a preset via merge mode, every seq counter must be `Math.max(current, incoming)`. `jumpLinkSeq` was missing — new jump links created after a merge would start at seq=1 and collide with existing IDs. Pattern: `this.jumpLinkSeq = Math.max(this.jumpLinkSeq, remapped.jumpLinkSeq ?? 0)`.
- **`showBridgeSegment` animation parameter rows MUST call `onGeomChange()`**: All 9 rows (`animOffsetX/Y/Z`, `animRotX/Y/Z`, `animStartMs`, `animIntervalMs`, `animHoldMs`) write to data but must call `onGeomChange()` to trigger `saveArena()`. Without it, the values are lost on page reload. These are timing/offset params — no geometry rebuild needed — but `onGeomChange()` is still required for persistence.
- **`showObstacle` and `showTrap` SPEED PATH and THEME rows must call `onGeomChange()`**: `speedPathId` (obstacle + trap) and `theme` (obstacle) selectRows must call `onGeomChange()` or changes are silently lost on reload. These are pure data fields with no geometry side-effect, but `onGeomChange()` is still needed to trigger `saveArena()`.
- **`WallManager.fromSave()` must restore `thicknessDirection`**: It was absent from the `Object.assign()` block. Every save/load round-trip reset all walls to `'outward'` regardless of what was saved. Always include `thicknessDirection: save.thicknessDirection ?? 'outward'` in the assign block alongside `thickness`.

### When you add a new constant
Add it to `src/config/arenaConstants.ts` with a name. Never inline magic numbers.

### When you add a new geometry builder
- If it generates concentric rings: call `buildParabolicRingGeo` from `primitives.ts`.
- If it positions a pit/zone child: call `extractChildTransform` from `surfaceUtils.ts`.
- If it builds edges: call `buildRimEdges` / `buildFloorAndPillarEdges` from `primitives.ts`.
- If it assembles a Three.js Mesh + edges for arenas/pits/zones: it belongs in `arenaObjectBuilders.ts`.
- Wall geometry → `wallBuilders.ts`. Bridge path/sweep geometry → `bridgeSegmentBuilders.ts`. Speed line ribbon/path → `speedLineBuilders.ts`.
- Obstacle 3D shapes → `obstacleBuilders.ts`. Trap plate + variants → `trapBuilders.ts`. Portal pad + ring → `portalBuilders.ts`. None of these belong in `arenaObjectBuilders.ts`.
- Base footing shapes (placed on the octagon base) → `footingBuilders.ts`. Do NOT reuse or import from `obstacleBuilders.ts` — footings are a separate object type with their own lifecycle.
- Ambient particle VFX → `particleBuilders.ts`. Never create `THREE.Points` in `ArenaSandbox.ts` directly.

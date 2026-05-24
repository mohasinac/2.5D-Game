[← Phase 27: Tiered AoI](phase-27-tiered-aoi.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md)

---

# Phase 28 — View Modes (2D / 2.5D / 3D), Arena Builder Forms, BitBeast Glow, HUD Nearest-8

> **Stage 28** — Formalises three distinct renderer modes (2D Top View, 2.5D Isometric/Tilt, Full 3D), specifies the arena builder admin forms required for each, defines per-move-type visual requirements across all three modes, introduces the BitBeast glow overlay system for special move activation, and redesigns the opponent HUD to show only the nearest 8 players.
>
> **Engine clarification**: Physics always runs on the 2D Matter.js server regardless of renderer mode. The renderer mode is a **client-only presentation choice**. Switching from 2.5D to 3D requires adding a Three.js / WebGPU client renderer alongside PixiJS — it does not change server code. All three modes receive the same Colyseus state.
>
> **Phase 21 pillar alignment:**
> - **GeometryDef** (Pillar 2) — renderer mode is a `GeometryRef` on the arena config (`rendererMode: "2d" | "2.5d" | "3d"`)
> - **BehaviorDef** (Pillar 1) — BitBeast activation is a `MechanicInstance` triggered by the Beast Call special move
> - **StatDef** (Pillar 3) — HUD nearest-8 reads `spin_pct` from `BeyGhostState` (Phase 27 ghost schema)

---

## Diagrams

### Three View Modes — Side-by-Side Comparison

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    VIEW MODE COMPARISON                                     │
├─────────────────┬─────────────────────┬─────────────────────────────────────┤
│  1. 2D TOP VIEW │  2. 2.5D ISOMETRIC  │  3. FULL 3D                         │
│                 │     / TILT VIEW      │                                     │
│  ╔═════════╗   │   ╔═══════════╗      │    ╔══════════════╗                 │
│  ║ ● → →  ║   │   ║  ⊙  ⊙   ║      │    ║   ⬤   ⬤    ║                 │
│  ║  ↗ ●   ║   │   ║ ═══════  ║      │    ║  ╱═══════╲  ║                 │
│  ║ ●      ║   │   ║  ⊙  ⊙   ║      │    ║ ╱  ⬤  ⬤  ╲ ║                 │
│  ╚═════════╝   │   ╚═══════════╝      │    ╚══════════════╝                 │
│                 │                      │                                     │
│  • Pure 2D     │  • Tilted plane       │  • Full 3D models (GLB/GLTF)       │
│  • Top view    │  • 2D sprites +       │  • Real-time lighting + shadows     │
│    only        │    Z-axis depth       │  • Orbit / over-shoulder cam        │
│  • Arcade      │  • Parallax layers    │  • Reflections / materials          │
│    classic     │  • Current engine     │  • Three.js / WebGPU renderer       │
│                 │                      │                                     │
│  Physics: same 2D Matter.js server state for all three modes                │
└─────────────────┴─────────────────────┴─────────────────────────────────────┘
```

### Move Type Visual Matrix

```
┌──────────────────┬──────────────────────┬────────────────────────┬──────────────────────────┐
│   MOVE TYPE      │  2D TOP VIEW         │  2.5D TILT VIEW        │  3D FULL                 │
├──────────────────┼──────────────────────┼────────────────────────┼──────────────────────────┤
│ Xtreme Rail      │ Speed trail ring +   │ Banking arc + speed    │ 3D rail mesh surface +   │
│ Riding           │ circular glow trail  │ glow + tilt banking    │ light-streak particle    │
├──────────────────┼──────────────────────┼────────────────────────┼──────────────────────────┤
│ Air Attack       │ Launch arc parabola  │ Upward arc from back   │ Full air-physics arc +   │
│                  │ + descent flash      │ + downward strike      │ shadow on arena floor    │
├──────────────────┼──────────────────────┼────────────────────────┼──────────────────────────┤
│ Jump             │ Trajectory arc dot   │ Hop silhouette +       │ 3D hop with landing      │
│                  │ + shadow circle      │ drop shadow below      │ dust + screen shake      │
├──────────────────┼──────────────────────┼────────────────────────┼──────────────────────────┤
│ Collision        │ Shockwave ring +     │ Spark burst + tilt     │ 3D impact debris +       │
│                  │ spark burst          │ snap + ripple          │ slow-motion 3D sparks    │
├──────────────────┼──────────────────────┼────────────────────────┼──────────────────────────┤
│ Flower Pattern   │ Petal loop trails    │ 3D petal arc curves    │ Full 3D petal ribbon     │
│                  │ (5-petal PIXI draw)  │ with depth fade        │ trails in world space    │
├──────────────────┼──────────────────────┼────────────────────────┼──────────────────────────┤
│ Burst Finish     │ Part scatter rings   │ 3D parts flying out    │ Full 3D burst debris     │
│                  │ + flash screen       │ + camera shake         │ + slo-mo camera          │
├──────────────────┼──────────────────────┼────────────────────────┼──────────────────────────┤
│ Beast Call       │ BitBeast 2D sprite   │ BitBeast overlay +     │ Full 3D BitBeast model   │
│ (Gen 1)          │ left/right HUD panel │ arena glow pulse       │ emerges from arena floor │
└──────────────────┴──────────────────────┴────────────────────────┴──────────────────────────┘
```

### Arena Builder Admin Forms — Per Mode

```
2D ARENA BUILDER FORM                2.5D ARENA BUILDER FORM
─────────────────────────────        ────────────────────────────────────
┌─────────────────────────┐          ┌────────────────────────────────┐
│ BASICS                  │          │ BASICS            [same as 2D] │
│  Name: ___________      │          │ TILT                           │
│  Width: [====] 30cm     │          │  Angle: [=========] 30°        │
│  Height:[====] 30cm     │          │  Direction: [=====] 45°        │
│  Shape: ○ Circle        │          │  Auto-tilt: ○ On  ● Off        │
│  Theme: ○ Standard      │          │  Speed: [==] 10°/s             │
│ PREVIEW                 │          │  Presets: [Flat][30°][90°][Inv]│
│  ┌─────────────────┐    │          │ PERSPECTIVE                    │
│  │    top-down     │    │          │  Tilt outer  → scaleX = cos(θ) │
│  │   flat view     │    │          │ PREVIEW (2.5D tilt canvas)     │
│  └─────────────────┘    │          │  ╔══════════════╗             │
│ No tilt controls        │          │  ║  ⊙   ⊙      ║             │
└─────────────────────────┘          │  ║═════════════ ║             │
                                     │  ╚══════════════╝             │
                                     └────────────────────────────────┘

3D ARENA BUILDER FORM
────────────────────────────────────────────────────────
┌──────────────────────────────────────────────────────┐
│ BASICS                                    [same]     │
│ 3D RENDERER CONFIG                                   │
│  Camera preset:  [Cinematic ▼]                       │
│    ○ Cinematic (dynamic angle, follows action)       │
│    ○ Over-shoulder (behind player bey, low angle)    │
│    ○ Orbit (revolves around arena center)            │
│    ○ Bird's Eye (high fixed angle, like 2.5D but 3D) │
│  Camera height:  [====] 45°                          │
│  Camera FOV:     [====] 60°                          │
│ LIGHTING                                             │
│  Ambient color:  [#333344 ■]   Intensity: [===] 0.4  │
│  Sun direction:  [====] 135°   Intensity: [===] 1.0  │
│  Arena glow:     ○ On  ● Off   Color: [#ff4400 ■]    │
│ FLOOR MATERIAL                                       │
│  ○ Metallic   ○ Matte   ○ Neon   ○ Ice   ○ Lava      │
│ MODELS                                               │
│  Arena 3D model: [browse or ID field ___________]    │
│  Wall model:     [browse or ID field ___________]    │
│ PREVIEW                                              │
│  ╔════════════════════════════╗                      │
│  ║         [3D WebGL view]    ║                      │
│  ║   ⬤   lighting + shadows  ║                      │
│  ╚════════════════════════════╝                      │
│  [Rotate view] [Reset camera] [Toggle shadows]       │
└──────────────────────────────────────────────────────┘
```

### BitBeast Glow Overlay Layout

```
DURING SPECIAL MOVE / BEAST CALL:

┌─────────────────────────────────────────────────────────────────┐
│                        GAME VIEW                                │
│                                                                 │
│  ┌──────────┐                              ┌──────────┐        │
│  │░░░░░░░░░░│                              │░░░░░░░░░░│        │
│  │ ◈Dragon  │                              │ ◈Tiger   │        │  ← BitBeast
│  │  glow    │        [arena canvas]        │  glow    │        │    overlay
│  │ ██████   │                              │ ██████   │        │    panels
│  │░░░░░░░░░░│                              │░░░░░░░░░░│        │
│  └──────────┘                              └──────────┘        │
│       ↑ player 1 bey                 player 2 bey ↑            │
│       (left side HUD)                (right side HUD)          │
│                                                                 │
│  If both players activate simultaneously: left + right split    │
│  If solo activation: single panel, side = player side          │
│                                                                 │
│  Glow layers (back to front):                                   │
│  1. Radial gradient background (color = bitBeastGlowColor)     │
│  2. BitBeast image (GIF or PNG)                                 │
│  3. CSS filter: drop-shadow pulse animation                     │
│                                                                 │
│  Timeline: ─[fade-in 200ms]──[hold: special duration]──[fade 300ms]─ │
└─────────────────────────────────────────────────────────────────┘
```

### HUD Reference Layout (from design reference images)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. 2D TOP VIEW HUD  (reference image)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────────────────────────────┐
│  [P1 Avatar][PLAYER 1]  2      02:45      1  [PLAYER 2][Avatar] │ ← TOP BAR
├──────────────────────────────────────────────────────────────── ┤
│ ⊕             │                              │                  │
│ ⊞             │        [ARENA - TOP DOWN]    │                  │ ← LEFT ICONS
│ ✦             │                              │                  │   (3 ability
│               │          ● bey1    ● bey2    │                  │    icons:
│               │                              │                  │    orbital,
│               │                              │                  │    shield,
│               │                              │                  │    special)
├───────────────┴──────────────────────────────┴──────────────────┤
│  SP [████████████████░░░░]    SP [░░░░████████████████]         │ ← BOTTOM SP BARS
│     (player 1 spin power)         (player 2 spin power)         │
└─────────────────────────────────────────────────────────────────┘

  LEFT ICONS (3 vertical, left edge):
    ⊕  Orbital / Stamina move icon
    ⊞  Shield / Defense move icon
    ✦  Starburst / Special move icon
  These correspond to the player's currently available move types.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. 2.5D ISOMETRIC / TILT VIEW HUD  (reference image)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────────────────────────────┐
│  [P1 Avatar][PLAYER 1]  2              1  [PLAYER 2][Avatar]    │ ← TOP BAR
│                                           (no center timer)     │   (timer hidden
├─────────────────────────────────────────────────────────────────┤    or smaller)
│                                                                 │
│                  [ARENA - ISOMETRIC TILT VIEW]                  │ ← No left icons
│               ⊙ bey1  collision sparks  ⊙ bey2                 │   (icons removed
│                  ════════════════════                           │    in 2.5D — more
│                                                                 │    immersive)
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  SP [██████████████░░░░]         SP [░░░████████████████]       │ ← BOTTOM SP BARS
│     blue                              red                       │   (same as 2D)
└─────────────────────────────────────────────────────────────────┘

  Key difference from 2D:
  - No left-side icon strip (maximises arena visual)
  - Timer may be smaller or hidden (shown on demand / tap)
  - SP bars are at bottom corners with player color accent
  - Top bar is thinner and more transparent to not block isometric depth

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. 3D FULL VIEW HUD  (design extension)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────────────────────────────┐
│  [Avatar] PLAYER 1  2              1  PLAYER 2 [Avatar]         │ ← TOP BAR
│           (glassmorphism backdrop, slim, semi-transparent)      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│             [ARENA - FULL 3D PERSPECTIVE VIEW]                  │ ← No icons
│                                                                 │   Minimal HUD
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  SP ═══════════════░    (fade in/out: visible only on SP change) │ ← SP bars
└─────────────────────────────────────────────────────────────────┘
  SP bars: diegetic — they pulse visible when spin changes,
           fade to 20% opacity during calm moments (immersive)
```

### Nearest-8 Opponent Panel (multi-player expansion)

```
ADDED TO 2D HUD (below left icons):    ADDED TO 2.5D HUD (right-side panel):
────────────────────────────────       ─────────────────────────────────────
┌───────────┐                          ┌─────────────────────────────────┐
│ ⊕         │  OPPONENTS (nearest 8)   │     OPPONENTS                   │
│ ⊞         │ ──────────────────────   │  1. ■ DragonK  ████░  2m  ←ner  │
│ ✦         │  1. ■ Name  ████  2m     │  2. ■ Phoenix  ███░░  4m        │
│           │  2. ■ Name  ███░  4m     │  3. ■ Tiger    ██░░░  5m        │
│──────────-│  3. ■ Name  ██░░  6m     │  4. ■ Iron     ████░  7m        │
│OPPONENT   │  ...                     │  5. ■ Storm    ███░░  9m        │
│ LIST      │  8. ■ Name  ███░ 22m     │  6. ■ Dark     ██░░░ 12m        │
│ (8 max)   │  + N beyond radar        │  7. ■ Rush     █░░░░ 15m        │
└───────────┘                          │  8. ■ Bey      ████░ 22m        │
                                       │  + N beyond radar               │
                                       └─────────────────────────────────┘
```

---

## 1. Three Renderer Modes

### 1.1 Mode Definitions

| Mode | ID | Camera | Renderer | Assets | Physics |
|------|----|--------|----------|--------|---------|
| 2D Top View | `"2d"` | Fixed overhead, no tilt | PixiJS (existing) | 2D sprites (flat) | 2D Matter.js (unchanged) |
| 2.5D Isometric / Tilt | `"2.5d"` | Tilted plane via `arenaTiltAngle` | PixiJS + tilt transform stack (existing) | 2D sprites + Z-depth illusion | 2D Matter.js (unchanged) |
| Full 3D | `"3d"` | Orbit / over-shoulder / cinematic | Three.js / WebGPU (new renderer) | GLB/GLTF 3D models | 2D Matter.js (unchanged); positions mapped to 3D space |

The renderer mode is stored on `ArenaConfig` and `BeybladeStat`. Physics is **always** 2D server-side. The `"3d"` mode maps the 2D physics coordinates to a 3D world space where Y (up) is synthesised from the 2D plane.

### 1.2 New Field on ArenaConfig

```typescript
// shared/types/arenaConfigNew.ts
export type RendererMode = "2d" | "2.5d" | "3d";

export interface ArenaConfig {
  // ... existing fields ...
  rendererMode?: RendererMode;   // default "2.5d" if omitted

  // 3D-only config block (ignored in 2d/2.5d):
  renderer3d?: Arena3DConfig;
}

export interface Arena3DConfig {
  cameraPreset: "cinematic" | "over-shoulder" | "orbit" | "bird-eye";
  cameraHeightDeg: number;     // 0=horizon, 90=top-down, default 45
  cameraFov: number;           // field of view degrees, default 60
  ambientColor: string;        // hex, default "#333344"
  ambientIntensity: number;    // 0–2, default 0.4
  sunAngleDeg: number;         // 0–359 azimuth
  sunIntensity: number;        // 0–2, default 1.0
  arenaGlowColor?: string;     // optional arena rim glow
  floorMaterial: "metallic" | "matte" | "neon" | "ice" | "lava";
  arenaModelId?: string;       // reference to 3D model asset
  wallModelId?: string;
}
```

### 1.3 Renderer Mode in BeybladeStats

```typescript
// Optional per-bey renderer preference (for preview purposes in setup screen)
export interface BeybladeStats {
  // ... existing fields ...
  preferredRendererMode?: RendererMode;  // used in entity preview picker
}
```

---

## 2. Arena Builder Admin Forms

### 2.1 Form Architecture

The arena builder admin (`ArenaConfigurator.tsx`) gains a **mode selector** at the top of every arena config form. Switching mode:
- Shows/hides mode-specific tab panels
- Updates the preview component to render in the selected mode
- 2D and 2.5D use the existing PixiJS `ArenaPreview`; 3D uses a `ThreeJSArenaPreview` component

```
ARENA CONFIGURATOR
┌──────────────────────────────────────────────────────────────┐
│ Renderer Mode:  [○ 2D Top]  [● 2.5D Tilt]  [○ Full 3D]      │
├──────────────────────────────────────────────────────────────┤
│ [Basics] [Features] [Platforms] [Switches] [Turrets] ...     │
│ [Tilt ▸ 2.5D only] [3D Config ▸ 3D only]                    │
└──────────────────────────────────────────────────────────────┘
```

### 2.2 Basics Tab — All Modes (existing + additions)

Existing fields (unchanged across all modes):
- Name, description
- Width, height (sliders, 30–500cm)
- Shape picker (arena boundary shape)
- Theme picker (visual theme)
- Bowl profile (wall angle)

**2D additions**: none — simplest form. Tilt panel hidden.

**2.5D additions** (existing Tilt panel):
- Tilt angle slider 0–360°
- Tilt direction slider 0–359°
- Auto-tilt toggle + speed
- Quick presets: Flat / 30° / 60° / 90° Wall-Ride / 180° Inverted
- Live SVG ellipse tilt preview

**3D-only tab "3D Config"** (new, visible only when mode = "3d"):

| Section | Fields |
|---------|--------|
| Camera | Preset selector (Cinematic / Over-Shoulder / Orbit / Bird's Eye) |
| Camera | Height angle slider (0–90°), FOV slider (30–120°) |
| Lighting | Ambient color picker, ambient intensity slider (0–2) |
| Lighting | Sun direction slider (0–359°), sun intensity slider (0–2) |
| Arena Glow | Toggle + glow color picker |
| Floor Material | Radio: Metallic / Matte / Neon / Ice / Lava |
| Models | Arena model ID field, Wall model ID field |

### 2.3 Preview Component per Mode

```
rendererMode = "2d":
  <ArenaPreview mode="2d" />   (existing ArenaPreview, tilt disabled)
  → top-down flat PixiJS canvas

rendererMode = "2.5d":
  <ArenaPreview mode="2.5d" />  (current default behavior)
  → tilted PixiJS canvas

rendererMode = "3d":
  <ThreeJSArenaPreview config={arena3dConfig} />  (new component)
  → Three.js canvas, rotatable with mouse, shows floor material + lighting
  → features rendered as colored 3D markers (no full 3D models needed in admin)
  → [Rotate view] button, [Reset] button, [Toggle shadows] toggle
```

### 2.4 Feature Form Fields per Mode

Most feature forms (obstacles, turrets, spin zones) are identical across modes. The following additional fields appear when `rendererMode = "3d"`:

| Feature | 3D-only fields |
|---------|----------------|
| Obstacles | `modelId?: string` — 3D model asset reference |
| Turrets | `modelId?: string`, `barrelLengthCm?: number` |
| Portals | `portalMeshId?: string` — 3D portal ring mesh |
| ElevationZones | `platformModelId?: string` |
| ModularSections | `modelId?: string` (tube/ramp 3D mesh) |
| LoopTracks | `railModelId?: string` |

These override the default sprite when the 3D renderer is active. When absent, the renderer falls back to a procedural placeholder.

---

## 3. Move Type Visual Requirements per Mode

### 3.1 Xtreme Rail Riding

The player rides the arena rim at high speed, gaining a velocity boost.

| Mode | Client Visual |
|------|--------------|
| 2D | Circular glowing ring trail around arena edge; speed lines pointing radially inward; bey sprite unchanged but scale slightly |
| 2.5D | Banking tilt increase (`beyTiltAngle += 15°`) while on rail; trail glow with perspective fade; speed-blur on sprite |
| 3D | 3D rail mesh glows along the arc; bey model tilts to match bank; particle stream trails behind in world space |

### 3.2 Air Attack

Bey launches upward, gains height, then descends on opponent.

| Mode | Client Visual |
|------|--------------|
| 2D | Parabolic arc line rendered as dashed curve from launch to target; descent marker (X) at target; brief flash on impact |
| 2.5D | Bey sprite lifts out of tilt plane (scale up + z-offset via layering); arc rendered behind-and-above; landing sparks |
| 3D | Full air physics: bey rises in Y-axis world space; shadow circle on arena floor tracks position; landing dust emitter |

### 3.3 Jump

Evasive maneuver — bey briefly lifts to evade contact.

| Mode | Client Visual |
|------|--------------|
| 2D | Small shadow circle appears under bey; bey sprite is scaled 1.15× while airborne; shadow fades during jump |
| 2.5D | Scale increase + slight Y shift upward out of tilt layer; landing impact ring |
| 3D | Bey rises in Y; physics body still 2D (no true collision bypass in 3D mode either); landing dust puff |

### 3.4 Collision

Two beys clash — the highest-momentum bey wins the exchange.

| Mode | Client Visual |
|------|--------------|
| 2D | Concentric shockwave rings from impact point; spark burst (radial lines); brief screen shake |
| 2.5D | Spark burst respects tilt perspective; shockwave ellipse matches arena tilt; camera snap on impact |
| 3D | Full 3D debris particles fly out from contact point in world space; slow-motion (0.3× time scale for 200ms); 3D shockwave sphere |

### 3.5 Flower Pattern

Stamina orbital special — bey traces petal-shaped loops around the arena.

| Mode | Client Visual |
|------|--------------|
| 2D | Five orbital path loops rendered as glowing PixiJS Graphics curves; each petal = one SpeedPath pass |
| 2.5D | Petal arcs rendered with Z-depth fade (near petals brighter, far petals dimmer/smaller); depth parallax |
| 3D | Petal ribbon trails in world space; tube geometry; glow emission material on ribbon |

### 3.6 Burst Finish

Opponent bey bursts into separate parts — instant win condition.

| Mode | Client Visual |
|------|--------------|
| 2D | Part scatter: 3–5 circle fragments fly outward from bey center; flash white frame; "BURST!" text overlay |
| 2.5D | Fragments respect tilt perspective; camera zoom-out before impact; slo-mo frame; 3D-feeling scatter |
| 3D | Full 3D part debris flies out; camera auto-zoom slow-motion; environmental lighting spikes; victory screen transition |

### 3.7 Beast Call (Gen 1) — BitBeast Summon

Player activates BitBeast / special move. See Section 4 for the full BitBeast overlay system.

| Mode | Client Visual |
|------|--------------|
| 2D | BitBeast PNG/GIF appears as HUD side panel; arena dims 20%; glow ring appears around bey on flat plane |
| 2.5D | BitBeast panel + arena-wide glow pulse on tilt plane; bey gains trailing aura |
| 3D | Full 3D BitBeast model rises from arena floor (animated GLB/GLTF); bey surrounded by energy field; arena lighting color-shifts to BitBeast color |

---

## 4. BitBeast Glow System

### 4.1 Firestore: `bitbeast_assets` Collection

```typescript
interface BitBeastAssetDoc {
  id: string;
  name: string;                   // "Blue Dragon", "White Tiger", "Red Phoenix"
  generation: "gen1" | "mfb" | "burst" | "bx";
  imageUrl: string;               // PNG or GIF URL (GIF = animated, bypasses image editor)
  modelId?: string;               // 3D GLB model reference (for 3D mode)
  glowColor: string;              // hex — e.g. "#0044ff" for Blue Dragon
  glowSecondaryColor?: string;    // optional second glow color (gradient)
  auraIntensity: number;          // 0–2, default 1.0
  tags?: string[];
}
```

Add `BITBEAST_ASSETS: "bitbeast_assets"` to `client/src/lib/firebase.ts`.

### 4.2 BitBeast Reference on BeybladeStats

```typescript
// client/src/types/game.ts — BeybladeStats
interface BeybladeStats {
  // ... existing ...
  bitBeastId?: string;             // references bitbeast_assets doc
  // If unset: no BitBeast overlay shown during specials
}
```

### 4.3 Rendering: BitBeast Overlay Component

New component: `client/src/components/game/BitBeastOverlay.tsx`

```tsx
interface BitBeastOverlayProps {
  asset: BitBeastAssetDoc;
  side: "left" | "right";         // which side of the screen to appear
  visible: boolean;
  onHide: () => void;
}
```

The overlay is **screen-space** (not world-space) — it lives in the HUD layer, not inside the PixiJS canvas:

```
Position: fixed overlay div, z-index above game canvas, below HUD chrome
Side:
  "left"  → position: absolute; left: 0; top: 20%; width: 180px;
  "right" → position: absolute; right: 0; top: 20%; width: 180px;

Contents:
  <div class="bitbeast-glow-bg" style="background: radial-gradient(circle, glowColor, transparent)" />
  <img src={asset.imageUrl} class="bitbeast-image" />

Animation (CSS keyframes):
  @keyframes bitbeast-enter {
    0%   { opacity: 0; transform: scale(0.8); filter: blur(4px); }
    30%  { opacity: 1; transform: scale(1.05); filter: blur(0); }
    60%  { transform: scale(1.0); }
    80%  { transform: scale(1.03); }
    100% { transform: scale(1.0); }
  }
  @keyframes glow-pulse {
    0%, 100% { box-shadow: 0 0 20px glowColor, 0 0 40px glowColor; }
    50%       { box-shadow: 0 0 40px glowColor, 0 0 80px glowColor, 0 0 120px glowSecondaryColor; }
  }
  .bitbeast-image {
    filter: drop-shadow(0 0 15px glowColor) drop-shadow(0 0 30px glowColor);
    animation: bitbeast-enter 500ms ease-out, glow-pulse 1.5s ease-in-out infinite;
  }

GIF handling:
  <img src={asset.imageUrl} />   // GIF animates naturally; no canvas processing
  // Uses the existing GIF-bypass pattern (same as AssetCrudPage)

Exit: opacity transitions to 0 over 300ms when visible = false
```

### 4.4 Trigger: When to Show BitBeast

BitBeast overlay appears when:
1. Player activates a **special move** (`"beast_call"` type, or any special tied to a `bitBeastId` bey)
2. A **Burst Finish** is scored (brief flash — 1.5s)
3. A custom mechanic with `triggerBitBeast: true` in its params fires

The overlay is driven by a Colyseus message: `room.state.specialMoveEvents` (a ring buffer or onMessage event with `{ beyId, specialMoveId, bitBeastId, duration }`). Client subscribes and shows the overlay for `duration` ms.

Both players can have overlays simultaneously (left panel for player, right for opponent, or both sides if opponent is near — only show opponent BitBeast if they are Tier 2 or Tier 1 in the AoI system).

### 4.5 Admin: BitBeast Asset Page

Route: `/admin/bitbeast-assets`

Standard `AssetCrudPage` pattern:
- Upload: PNG / GIF / WebP (GIF = animated, preserved)
- Fields: name, generation, glowColor (color picker), glowSecondaryColor, auraIntensity (slider 0–2), 3D modelId
- Preview: shows the image on a dark background with glow CSS applied live
- GIF preview: `<img>` tag (no canvas) to preserve animation

Add to admin nav in `AdminLayout.tsx` under "Assets".

### 4.6 3D Mode: BitBeast Model

When `rendererMode = "3d"` and `asset.modelId` is set:
- Load GLB model via Three.js `GLTFLoader`
- Spawn at arena center, Y = 0 (floor level), animate upward with scale 0→1 over 800ms
- Particle emitter on model surface (color = `glowColor`)
- Despawn (scale 1→0 over 400ms) when special move ends
- Fallback to 2D PNG overlay if model is not available

---

## 5. HUD System: Layout per Mode + Nearest-8 Opponents

### 5.1 HUD Architecture (Reference Images)

The HUD is a **screen-space overlay** rendered above the PixiJS / Three.js canvas. It adapts its chrome density per renderer mode:

| Zone | 2D Top View | 2.5D Tilt View | 3D Full View |
|------|-------------|----------------|--------------|
| **Top bar** | Avatar + Name + Score — both sides; **central timer** prominent | Avatar + Name + Score — both sides; timer smaller / optional | Same; glassmorphism backdrop; semi-transparent |
| **Left icons** | 3 vertical ability icons (orbital, shield, special) | **Hidden** — maximise arena depth; icons accessible via tap | **Hidden** — full immersion |
| **Bottom SP bars** | Full-width, blue left / red right; solid; always visible | Full-width, player color; same position | Diegetic — fade to 20% opacity at rest, pulse on spin change |
| **Opponent panel** | Appended below left icon strip (vertical list) | Right-edge collapsible panel | Semi-transparent right panel |

**SP bar** = Spin Power — the bey's current spin rate expressed as 0–100%. This is the primary health indicator. Derived from `ghost.spin_pct` for opponents; from own full schema for self.

### 5.2 Top Bar Elements (all modes)

```
[Player 1 Avatar 48×48] [PLAYER 1 name] [2]    [02:45]    [1] [PLAYER 2 name] [Player 2 Avatar 48×48]
  ↑ portrait photo                        ↑ wins  ↑ timer     ↑ wins
  or bey icon                             (series score)      (2D: always visible)
                                                               (2.5D/3D: fade-in on round start)
```

- Avatar: player profile photo or bey art thumbnail (48×48px, rounded)
- Name: up to 12 chars, clipped with ellipsis
- Score: series wins count (large numeral, color = player color)
- Timer: `MM:SS` countdown; 2D = always center; 2.5D = smaller, top-center, fades during action; 3D = hidden by default, tap to show

### 5.3 Left-Side Ability Icons (2D only)

Three icons in a vertical strip at the left edge, vertically centered:

```
Icon 1: ⊕  Orbital / Stamina ability  → activates orbital SpeedPath move
Icon 2: ⊞  Shield / Defense ability   → activates Gyro Anchor or guard mechanic
Icon 3: ✦  Starburst / Special move   → activates the bey's specialMoveId
```

Each icon:
- Base: dark circle background (rgba 0,0,0,0.6)
- Active/cooldown: radial sweep overlay (clockwise fill = cooldown remaining)
- Ready: bright glow pulse on icon
- No label text — icon only (anime style)
- On hover/tap: expand with tooltip name

In 2.5D and 3D: these icons are **not shown** in the viewport. Instead, they appear as a pull-out tab from the left edge (tap to reveal, auto-hides after 2s of no interaction).

### 5.4 SP Bar (Spin Power — all modes)

```
Bottom of screen, two bars:

Player 1 (left):
  SP [label] [████████████████░░░░░░░░] (player 1 color: blue)
              ← full width left half →

Player 2 (right):
  [░░░░░░░░████████████████] [SP label]  (player 2 color: red)
  ← fills from right edge inward →

For 3+ players: bars stack or split into segments.
For 2.5D / 3D: bars have a glow matching player color.
For 3D: fade to 20% when stable; pulse visible on every spin tick change.
```

SP bar color coding:
- 75–100%: player color (full glow)
- 40–75%: orange tint
- 10–40%: red flash
- <10%: rapid red pulse (about to stop)

### 5.5 Nearest-8 Opponent System

The HUD opponent panel shows at most **8 nearest opponents** by distance, read from `beyGhosts` (Phase 27). Beyond 8: minimap dots only.

**Principle**: The HUD opponent panel is capped at 8 entries regardless of player count. For arenas with >8 opponents, only the 8 nearest (by distance from the player's bey) are shown. All others are visible only as dots on the minimap (Phase 27 ghost dots).

This integrates naturally with Phase 27: the `beyGhosts` schema already provides `x_cm`, `y_cm`, `teamId`, `spin_pct`, `beyType` for all nearby beys. The HUD reads from ghost data — not from the full `beyblades` schema.

**Sorting rule:**
```typescript
// In HUD component — throttled to ~6Hz / every 10 ticks to avoid re-render thrash
function computeNearestOpponents(
  beyGhosts: MapSchema<BeyGhostState>,
  selfId: string,
  selfPos: { x: number; y: number }
): BeyGhostState[] {
  const opponents: Array<{ ghost: BeyGhostState; dist: number }> = [];
  
  beyGhosts.forEach((ghost) => {
    if (ghost.id === selfId) return;
    const dx = selfPos.x - ghost.x_cm;
    const dy = selfPos.y - ghost.y_cm;
    opponents.push({ ghost, dist: Math.sqrt(dx * dx + dy * dy) });
  });

  return opponents
    .sort((a, b) => a.dist - b.dist)
    .slice(0, 8)
    .map(e => e.ghost);
}
```

**HUD entry per opponent:**

| Field | Source | Notes |
|-------|--------|-------|
| Color dot | `ghost.teamId` → player color | 8×8px filled circle |
| Player name | `ghost.teamId` lookup | max 10 chars |
| SP bar | `ghost.spin_pct` (0–100) | 4 segments, color by spin% |
| Distance | computed dist_cm | "2m", "14m" etc. |
| Eliminated | removed immediately | re-sort remaining |

**Layout by player count:**

```
2 players (1 opponent):
  No separate panel — opponent's SP bar shown at top bar under their name
  with type icon. Full stats.

3–8 players (2–7 opponents):
  Compact vertical list, max 8 rows

9–20 players (8 shown, N–8 hidden):
  Compact list, footer: "+ N beyond radar"
  N = total beyGhosts count − 8
```

### 5.6 HUD Components

| Component | File | Purpose |
|-----------|------|---------|
| `TopBar` | `components/game/hud/TopBar.tsx` | Avatar, name, score, timer |
| `AbilityIcons` | `components/game/hud/AbilityIcons.tsx` | 3 vertical icons (2D mode only) |
| `SPBar` | `components/game/hud/SPBar.tsx` | Spin power bar, both players |
| `OpponentPanel` | `components/game/hud/OpponentPanel.tsx` | Nearest-8 list |
| `HUDRoot` | `components/game/HUDRoot.tsx` | Composes above per `rendererMode` |
| `BitBeastOverlay` | `components/game/BitBeastOverlay.tsx` | Beast summon overlay (§4) |

`HUDRoot` receives `rendererMode` and conditionally renders `AbilityIcons` (2D only), adjusts `TopBar` opacity/size, and sets SP bar glow behavior.

---

## 6. Renderer Mode Selection in Game

### 6.1 Where Mode is Set

- Arena config sets the default `rendererMode` for any match played in that arena
- Player can override in settings (if the arena supports all modes): `userPreferences.rendererMode`
- TryoutRoom: honors arena's `rendererMode`
- Admin preview: overridable per-session in the admin configurator

### 6.2 Client Renderer Switching

```typescript
// client/src/game/renderer/RendererFactory.ts  (new)
export function createRenderer(mode: RendererMode, canvas: HTMLCanvasElement): IGameRenderer {
  switch (mode) {
    case "2d":    return new PixiRenderer(canvas, { tiltEnabled: false });
    case "2.5d":  return new PixiRenderer(canvas, { tiltEnabled: true });
    case "3d":    return new ThreeJSRenderer(canvas);
  }
}
```

`IGameRenderer` interface defines the surface both `PixiRenderer` and `ThreeJSRenderer` implement:
- `updateBey(id, state)` — update a bey's position/state
- `updateArena(arenaState)` — update arena tilt/floor state
- `emitParticle(type, x, y)` — spawn a particle effect
- `setBitBeastVisible(side, asset, visible)` — show/hide BitBeast overlay

### 6.3 ThreeJSRenderer (new, 3D mode only)

New file: `client/src/game/renderer/ThreeJSRenderer.ts`

Architecture:
- `THREE.Scene` with arena mesh, bey meshes (GLB loaded per beyType), particle systems
- Camera: three presets implemented as `CameraController` strategy classes
- Physics coordinates (2D, px) mapped to 3D world (XZ plane): `worldX = physX / PX_PER_CM`, `worldZ = physY / PX_PER_CM`, `worldY = 0` (flat; jump/air attack animate worldY)
- Matter.js positions stream in via Colyseus → `ThreeJSRenderer.updateBey()` → smooth lerp to new 3D position
- Bey rotation: Matter.js `angle` → Three.js `mesh.rotation.y`

---

## 7. Renderer Mode on ArenaState (Colyseus)

The renderer mode must be synced to clients so late-joiners and spectators know which renderer to initialize:

```typescript
// src/schema/GameState.ts — ArenaState
class ArenaState extends Schema {
  // ... existing ...
  @type("string") rendererMode: string = "2.5d";  // "2d" | "2.5d" | "3d"
}
```

Server copies `arena.rendererMode` from Firestore config at room create. Clients read this before initializing the renderer.

---

## 8. Seed / Config Values

```typescript
// New Firestore collections (add to client/src/lib/firebase.ts):
BITBEAST_ASSETS: "bitbeast_assets"

// AoI integration for HUD:
OPPONENT_HUD_MAX = 8                // max opponents shown in HUD
OPPONENT_HUD_UPDATE_TICKS = 10      // re-sort every 10 ticks

// BitBeast overlay timing (ms):
BITBEAST_FADE_IN_MS  = 200
BITBEAST_HOLD_MS     = varies (special move duration)
BITBEAST_FADE_OUT_MS = 300

// 3D renderer defaults:
THREE_CAMERA_HEIGHT_DEG   = 45
THREE_CAMERA_FOV          = 60
THREE_AMBIENT_INTENSITY   = 0.4
THREE_SUN_INTENSITY       = 1.0
THREE_SUN_ANGLE_DEG       = 135
```

Example BitBeast seed entries:

```typescript
const BITBEAST_SEED = [
  { id: "blue-dragon",    name: "Blue Dragon",    generation: "gen1", glowColor: "#1a44ff", auraIntensity: 1.2 },
  { id: "white-tiger",    name: "White Tiger",    generation: "gen1", glowColor: "#ffffff", auraIntensity: 1.0 },
  { id: "red-phoenix",    name: "Red Phoenix",    generation: "gen1", glowColor: "#ff2200", auraIntensity: 1.3 },
  { id: "golden-lion",    name: "Golden Lion",    generation: "gen1", glowColor: "#ffaa00", auraIntensity: 1.1 },
  { id: "thunder-storm",  name: "Thunder Storm",  generation: "mfb",  glowColor: "#8800ff", auraIntensity: 1.0 },
  { id: "dark-bull",      name: "Dark Bull",      generation: "mfb",  glowColor: "#330066", auraIntensity: 0.9 },
];
```

---

## 9. Integration Notes

| Phase | What changes |
|-------|-------------|
| Phase 22 | `ArenaConfig` gains `rendererMode?: RendererMode` and `renderer3d?: Arena3DConfig`. Admin forms gain mode selector + 3D Config tab. |
| Phase 23 | Preset library: `arena_configs_presets` must include `rendererMode` in stored config. BitBeast preset support via `bitbeast_assets` collection. |
| Phase 27 | HUD nearest-8 reads from `beyGhosts` — already produced by Phase 27 ghost schema. No additional server work needed. |
| Phase 06 (mechanics) | Beast Call mechanic gains `triggerBitBeast: true` param that routes to `BitBeastOverlay` client-side. |
| Phase 13 (controls) | Camera controls differ per renderer mode: 2D/2.5D use existing zoom buttons; 3D uses orbit drag + presets. |

---

## 10. Admin Routes Added

| Route | Component | Purpose |
|-------|-----------|---------|
| `/admin/bitbeast-assets` | `BitBeastAssetsPage.tsx` | GIF/PNG upload, glow config, generation tag |
| Existing `/admin/arenas/:id` | Updated `ArenaConfigurator.tsx` | Mode selector + 3D Config tab added |

---

## Implementation Status (audit 2026-05-24)

| Component | Status | Notes |
|-----------|--------|-------|
| `rendererMode` field on `ArenaConfig` + `ArenaState` | ❌ Missing | Not in `arenaConfigNew.ts` or `GameState.ts` |
| `IGameRenderer` interface | ❌ Missing | No interface; `BeybladeGameRenderer` class exists directly |
| `RendererFactory.ts` | ❌ Missing | No factory; renderer instantiated directly |
| `ThreeJSRenderer.ts` stub | ❌ Missing | No Three.js renderer |
| Arena builder mode selector `[2D][2.5D][3D]` | ❌ Missing | Not in arena configurator |
| "3D Config" tab (camera, lighting, floor material) | ❌ Missing | Not in arena configurator |
| `HUDRoot.tsx` | ❌ Missing | HUD is fragmented across 10+ components |
| `TopBar.tsx` | ❌ Missing | Not in `components/game/hud/` |
| `AbilityIcons.tsx` | ❌ Missing | Not in `components/game/hud/` |
| `SPBar.tsx` | ❌ Missing | Not in `components/game/hud/` |
| `OpponentPanel.tsx` (nearest-8 from beyGhosts) | ❌ Missing | Needs Phase 27 `beyGhosts` first |
| `bitbeast_assets` collection in COLLECTIONS | ❌ Missing | Not in `firebase.ts` |
| `BitBeastAssetsPage.tsx` admin page | ❌ Missing | Bit-beast parts use unified part editor instead |
| `bitBeastId` on `BeybladeStats` | ❌ Missing | Not in `shared/types/beybladeStats.ts` |
| `BitBeastOverlay.tsx` CSS overlay | ❌ Missing | Not in `components/game/` |
| Server `"bitbeast-show"` message | ❌ Missing | Not in any room |
| Existing PixiJS 2.5D tilt renderer | ✅ Done | `PixiRenderer.ts` with 5-layer tilt stack |
| Move-type visual matrix (7 types × 3 modes) | ❌ Missing | Not implemented |

---

[← Phase 27: Tiered AoI](phase-27-tiered-aoi.md) &nbsp;·&nbsp; [↑ Index](../INDEX.md)

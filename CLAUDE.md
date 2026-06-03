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
  main.ts               — App class, screen router, global controls (+/−/○ scale, ⛶ fullscreen)
  styles/
    global.css          — vmin scale system, reset, shared components
  screens/
    LandingScreen.ts    — Title + sandbox nav buttons (Back button is disabled placeholder)
    Sandbox.ts          — Reusable Three.js XYZ viewport (accepts SandboxOptions)
  utils/
    dialog.ts           — gameConfirm() modal utility
```

## Running
```
npm run dev     # Vite dev server — single instance enforced via strictPort: true
npm run build   # TypeScript check + Vite build
```

## Known pitfalls (do not re-introduce)
- **Fog**: removed — causes black screens against dark background at all normal distances.
- **Grid colour `0x1a1a2e`** for subdivisions: too dark, renders invisible. Use `0x2a2a4a`.
- **Hash routing** (`location.hash`, `hashchange`): user wants real paths. Use `pushState`/`popstate`.
- **Eager renderer init**: creating `WebGLRenderer` in constructor for both sandboxes = two GL contexts upfront. Only create renderer inside `mountRenderer()` (called from `setVisible(true)`).
- **Single deferred RAF for resize**: not reliable before layout is ready. Use self-healing check inside the continuous `loop()` instead.

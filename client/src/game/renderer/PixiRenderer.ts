// [GAME-CLIENT] PixiRenderer — WebGL game renderer using PixiJS.
// Replaces the old HTML5 Canvas 2D renderer with hardware-accelerated WebGL.
// Renders arena, beyblades with 2.5D perspective, particles, and HUD elements.

import * as PIXI from "pixi.js";
import type { ServerBeyblade, ServerGameState, ServerDetachedBody } from "@/types/game";
import { getBeybladeStability } from "@/types/game";
import { PX_PER_CM_BASE, PHYSICS_SCALE, getPxPerCm } from "@/constants/units";
import { WorldTransform } from "./WorldTransform";
import { FeatureRenderer } from "./FeatureRenderer";
import { StateInterpolator } from "../interpolation/StateInterpolator";
export type { ServerBeyblade, ServerGameState };
export { WorldTransform } from "./WorldTransform";

// Type color map for beyblade glow effects (fallback when no per-bey color is set)
const TYPE_COLORS: Record<string, number> = {
  attack: 0xff4444,
  defense: 0x4488ff,
  stamina: 0x44ff88,
  balanced: 0xffcc44,
};

function parseBeyColor(bey: ServerBeyblade): number {
  if (bey.color && /^#[0-9a-fA-F]{6}$/.test(bey.color)) {
    return parseInt(bey.color.slice(1), 16);
  }
  return TYPE_COLORS[bey.type] ?? 0xffffff;
}

// Arena floor base colors — vivid enough to read on a dark canvas background.
// Keep mid-range brightness (not neon) so bey sprites remain legible.
const THEME_COLORS: Record<string, number> = {
  default:     0xe8e8e8,  // light grey-white (readable fallback)
  metrocity:   0x1e4080,  // steel blue city
  forest:      0x1a6b2e,  // green forest floor
  mountains:   0x2d4a6e,  // slate-blue highland
  grasslands:  0x2e7d32,  // vivid grass green
  desert:      0x7a5c1e,  // sand-gold dunes
  sea:         0x0d5080,  // deep ocean blue
  ocean:       0x0a4070,  // dark ocean
  futuristic:  0x2d1b6e,  // electric purple-indigo
  prehistoric: 0x7a2e0d,  // earthy rust
  safari:      0x6b5a0d,  // golden savannah
  riverbank:   0x0d5858,  // teal river
  lava_core:   0x8a2200,  // molten red
  volcano:     0x6e2800,  // dark lava
  quantum_realm: 0x1a0a3d, // deep violet
  storm_citadel: 0x1e3050, // storm grey-blue
  neon:        0x1a0a4d,  // neon night
  space:       0x080820,  // deep space (keep dark — stars are the decoration)
  ice:         0x1a4060,  // glacial blue
};

interface ParticleData {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: number;
  sprite: PIXI.Graphics | PIXI.Text | PIXI.Sprite;
}

export class BeybladeGameRenderer {
  private app: PIXI.Application;
  private container: HTMLElement;

  // Layer containers (z-order: arena → features → beys → detached → particles → HUD)
  // World layers are children of `worldRoot` which receives the camera transform.
  // `arenaTiltOuter/Scale/Inner` form a three-container perspective-tilt chain so the
  // entire scene can appear tilted (Z-axis — zero-G, inverted, wall-ride arenas).
  // `arenaRotationRoot` wraps arena + feature layers so the bowl spins together.
  // Beyblades and other world content are inside the tilt chain but outside arenaRotationRoot
  // so they don't spin with the bowl, but do tilt with it visually.
  // HUD stays in screen space (no transform).
  private worldRoot!: PIXI.Container;
  // Tilt perspective chain: outer rotates to direction, scale compresses, inner rotates back.
  private arenaTiltOuter!: PIXI.Container;
  private arenaTiltScale!: PIXI.Container;
  private arenaTiltInner!: PIXI.Container;
  private arenaRotationRoot!: PIXI.Container;
  private arenaLayer!: PIXI.Container;
  private featureLayer!: PIXI.Container;
  private beybladeLayer!: PIXI.Container;
  private detachedBodyLayer!: PIXI.Container; // 6.13 — between beys and particles
  private particleLayer!: PIXI.Container;
  private hudLayer!: PIXI.Container;

  // Client-side arena rotation state (advanced each frame if server doesn't drive it).
  private arenaRotationRad = 0;
  private arenaRotationSpeedRadPerS = 0;  // set from server arena schema when present
  private arenaRotationDirection: 1 | -1 = 1;
  private lastFrameMs = 0;

  // Camera / world transform — single source of truth for cm → screen projection.
  public readonly world = new WorldTransform();
  private controlledBeyId: string | null = null;
  private cameraInitialized = false;

  // #29: Client-side prediction override — maps beyId → {x, y} in physics coords.
  // Set each rAF frame by useColyseus prediction loop; used in place of interpolator
  // for the controlled bey to give sub-RTT input feel.
  private predictionOverride: Map<string, { x: number; y: number }> = new Map();

  // Feature layer renderer (obstacles / pits / portals / turrets / water / loops / projectiles).
  private featureRenderer: FeatureRenderer | null = null;

  // Per-beyblade display objects
  private beybladeContainers: Map<string, PIXI.Container> = new Map();
  private beybladeSprites: Map<string, PIXI.Graphics> = new Map();
  private healthBars: Map<string, PIXI.Graphics> = new Map();
  private spinBars: Map<string, PIXI.Graphics> = new Map();
  private labelTexts: Map<string, PIXI.Text> = new Map();

  // Phase G visual effect layers (per beyblade)
  private shadowSprites: Map<string, PIXI.Graphics> = new Map();
  private attackArcs: Map<string, PIXI.Graphics> = new Map();
  private shieldRings: Map<string, PIXI.Graphics> = new Map();
  private dodgeTrails: Map<string, { x: number; y: number; alpha: number }[]> = new Map();
  private dodgeTrailGraphics: Map<string, PIXI.Graphics[]> = new Map();
  // Phase 24 drift trail — shown when controlAuthority < 80 (semi-autonomous blending active)
  private driftTrails: Map<string, { x: number; y: number; alpha: number }[]> = new Map();
  private driftTrailGraphics: Map<string, PIXI.Graphics[]> = new Map();
  // Motion blur trail — ghost copies behind fast-moving beyblades
  private motionBlurTrails: Map<string, { x: number; y: number; alpha: number }[]> = new Map();
  private motionBlurGraphics: Map<string, PIXI.Graphics[]> = new Map();
  // Phase 27 Tiered AoI — per-bey tier (0/1/2) and opacity fade tracking
  private beyTiers: Map<string, 0 | 1 | 2> = new Map();
  private beyTierAlphas: Map<string, number> = new Map(); // current faded alpha

  // 2.5D Part System visual effects (6.14 / 6.15 / 6.16)
  private airborneArcs: Map<string, PIXI.Graphics> = new Map();     // 6.14 jump hop trail
  private flashGraphics: Map<string, PIXI.Graphics> = new Map();    // 6.15 spinDir change flash
  private flashTimers: Map<string, number> = new Map();
  private prevSpinDirections: Map<string, string> = new Map();
  private prevTipStages: Map<string, number> = new Map();
  private prevWearLevels: Map<string, number> = new Map();
  // R4: skip shape redraw when spin% bucket hasn't changed (buckets: full/half/quarter/low/critical)
  private _lastSpins: Map<string, number> = new Map();
  private splitBodySprites: Map<string, PIXI.Graphics> = new Map(); // 6.16 partner half

  // Overhaul visual-effect rings (per beyblade)
  private stanceRings:      Map<string, PIXI.Graphics> = new Map(); // stance arc border
  private gimmickRings:     Map<string, PIXI.Graphics> = new Map(); // gimmick loaded/active ring
  private desperationRings: Map<string, PIXI.Graphics> = new Map(); // red ring at <15% spin
  private bitbeastHalos:    Map<string, PIXI.Graphics> = new Map(); // gold halo while bitBeastActive
  private furyRings:        Map<string, PIXI.Graphics> = new Map();  // gold aura ring when furyGauge>=100
  private statusIconTexts:  Map<string, PIXI.Text>     = new Map(); // status emoji icon above bey
  private furyBars:         Map<string, PIXI.Graphics> = new Map();  // thin fury bar below spin bar

  // 6.13 — DetachedBody sprites (projectile / mini_bey / fragment)
  private detachedBodySprites: Map<string, PIXI.Graphics> = new Map();

  // H3: per-bey visual overrides driven by "combo-visual" messages
  private beyVisualOverrides: Map<string, { spriteUrl?: string; animationId?: string; expiresAt: number }> = new Map();

  // Particles
  private particles: ParticleData[] = [];

  // Phase 25: Battle Royale safe zone ring (world-space, inside featureLayer)
  private safeZoneRing: PIXI.Graphics | null = null;
  private safeZoneOuterOverlay: PIXI.Graphics | null = null;
  private safeZonePulseTimer = 0;

  // Phase AA: arena-wide effect overlays (screen-space, above all game layers)
  private darknessOverlay: PIXI.Graphics | null = null;
  private fogOverlay: PIXI.Graphics | null = null;
  private freezeFlashTimer = 0;

  // AA8: unified arena-effect overlay driven by handleArenaEffect()
  private arenaEffectOverlay: PIXI.Graphics | null = null;
  private activeArenaEffect: { type: string; startedAt: number; durationMs: number } | null = null;

  // F4: combination-lock link lines (world-space, lives in featureLayer)
  private linkLineGraphics: PIXI.Graphics | null = null;

  // G4: meteor strike landing zone ring (world-space, lives in particleLayer)
  private meteorLandingZone: { x: number; y: number; radius: number; expiresAt: number } | null = null;
  private meteorLandingGraphics: PIXI.Graphics | null = null;

  // Phase V3: shrinking boundary ring (world-space, lives in arenaLayer)
  private shrinkRingGraphics: PIXI.Graphics | null = null;
  private lastShrinkRadiusPx = -1; // track last drawn value to skip redundant redraws

  // Phase LOS: 2.5D line-of-sight cull constants
  protected readonly LINE_OF_SIGHT_CM = 30;
  protected readonly FADE_START_CM    = 24;
  /** Subclass overrides to true to enable LOS culling. */
  protected get is25D(): boolean { return false; }
  /** Default tilt angle (degrees) when arena hasn't set one. 2.5D subclass overrides to 28. */
  protected get defaultTiltAngle(): number { return 0; }

  // World background — full-canvas layer rendered behind the arena and everything else.
  private worldBgLayer!: PIXI.Container;
  private worldBgGraphics: PIXI.Graphics | null = null;
  private worldBgSprite: PIXI.Sprite | null = null;
  private worldBgLastUrl = "";

  // Arena geometry cache — screen space
  private arenaRadius = 0;
  private arenaCenterX = 0;
  private arenaCenterY = 0;

  // Physics coordinate system (server uses width * 16 as physics space)
  private physicsCenterX = 0;
  private physicsCenterY = 0;
  private physicsArenaRadius = 1;

  // R3: Arena floor baked to RenderTexture; re-baked only when tiltAngle changes.
  private arenaFloorRT: PIXI.RenderTexture | null = null;
  private arenaFloorSprite: PIXI.Sprite | null = null;
  private arenaFloorTiltAngle = -9999; // sentinel — force first bake
  // #13: dirty-flag invalidation — non-tilt rebakes rate-limited to 500ms
  private arenaFloorDirty = true;
  private arenaFloorLastBakeMs = 0;

  // R2: Shared 4×4 white-circle texture for dot particles. All dot-sprites share
  // the same base texture so PixiJS batches them into a single draw call.
  private _particleDotTexture: PIXI.Texture | null = null;

  private initialized = false;
  private contextLost = false;
  private interpolator = new StateInterpolator();
  private lastPushedState = new Map<string, { x: number; y: number; angle: number; spin: number }>();

  constructor(container: HTMLElement) {
    this.container = container;
    this.app = new PIXI.Application();
  }

  async init(): Promise<void> {
    await this.app.init({
      resizeTo: this.container,
      backgroundAlpha: 0,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });

    this.container.appendChild(this.app.canvas);

    // Prevent the contextlost → "refId not found" spam that occurs in PixiJS 8
    // when a context is lost and the internal UBO cache is cleared but object _uboId
    // values are not reset. We stop the ticker on loss and let the browser restore.
    this.app.canvas.addEventListener("webglcontextlost", (e) => {
      e.preventDefault(); // allow browser to restore
      this.contextLost = true;
      this.app.ticker.stop();
    }, false);

    this.app.canvas.addEventListener("webglcontextrestored", () => {
      this.contextLost = false;
      // Reset arena so it will be rebuilt with fresh GL resources on the next render.
      this.arenaRadius = 0;
      this.app.ticker.start();
    }, false);

    // Build layer stack. World layers live inside `worldRoot` (camera transform applied).
    // arenaTiltOuter → arenaTiltScale → arenaTiltInner form a perspective-tilt chain so the
    // entire scene can appear tilted around the arena center (0,0 in world space).
    // arena + features sit under arenaRotationRoot so the bowl can also spin in-plane.
    //
    // worldBgLayer sits on app.stage BEFORE worldRoot — it fills the full canvas in screen
    // space and is unaffected by camera zoom/pan or arena tilt/rotation.
    this.worldBgLayer = new PIXI.Container();
    this.worldBgLayer.eventMode = "none";
    this.app.stage.addChild(this.worldBgLayer);

    this.worldRoot = new PIXI.Container();
    this.arenaTiltOuter = new PIXI.Container();
    this.arenaTiltScale = new PIXI.Container();
    this.arenaTiltInner = new PIXI.Container();
    this.arenaRotationRoot = new PIXI.Container();
    this.arenaLayer = new PIXI.Container();
    this.featureLayer = new PIXI.Container();
    this.beybladeLayer = new PIXI.Container();
    this.detachedBodyLayer = new PIXI.Container(); // 6.13 — new layer
    this.particleLayer = new PIXI.Container();
    this.hudLayer = new PIXI.Container();

    // Tilt chain: worldRoot → tiltOuter → tiltScale → tiltInner → content layers
    this.arenaTiltOuter.addChild(this.arenaTiltScale);
    this.arenaTiltScale.addChild(this.arenaTiltInner);
    this.arenaRotationRoot.addChild(this.arenaLayer);
    this.arenaRotationRoot.addChild(this.featureLayer);
    this.arenaTiltInner.addChild(this.arenaRotationRoot);
    this.arenaTiltInner.addChild(this.beybladeLayer);
    this.arenaTiltInner.addChild(this.detachedBodyLayer);
    this.arenaTiltInner.addChild(this.particleLayer);
    this.worldRoot.addChild(this.arenaTiltOuter);

    // R1: frustum culling — PixiJS skips off-screen containers entirely.
    this.beybladeLayer.cullable = true;
    this.featureLayer.cullable   = true;
    this.particleLayer.cullable  = true;

    this.app.stage.addChild(this.worldRoot);
    this.app.stage.addChild(this.hudLayer); // HUD stays in screen space

    // Phase AA: arena-wide effect overlays (above HUD so they cover everything)
    this.darknessOverlay = new PIXI.Graphics();
    this.darknessOverlay.visible = false;
    this.darknessOverlay.eventMode = "none";
    this.app.stage.addChild(this.darknessOverlay);

    this.fogOverlay = new PIXI.Graphics();
    this.fogOverlay.visible = false;
    this.fogOverlay.eventMode = "none";
    this.app.stage.addChild(this.fogOverlay);

    // Feature layer renderer (obstacles, pits, portals, turrets, water, loops, projectiles).
    this.featureRenderer = new FeatureRenderer(this.featureLayer);

    // Phase 25: safe zone ring (world-space, inside featureLayer)
    this.safeZoneRing = new PIXI.Graphics();
    this.safeZoneRing.visible = false;
    this.safeZoneOuterOverlay = new PIXI.Graphics();
    this.safeZoneOuterOverlay.visible = false;
    this.featureLayer.addChild(this.safeZoneOuterOverlay);
    this.featureLayer.addChild(this.safeZoneRing);

    // R2: bake shared 4×4 white-circle dot texture for all particle dots.
    const dotG = new PIXI.Graphics();
    dotG.circle(0, 0, 2).fill({ color: 0xffffff });
    const dotRT = PIXI.RenderTexture.create({ width: 4, height: 4 });
    dotG.x = 2; dotG.y = 2;
    this.app.renderer.render({ container: dotG, target: dotRT });
    dotG.destroy();
    this._particleDotTexture = dotRT;

    // Particle update + arena-effect overlay tick on ticker
    this.app.ticker.add(this.updateParticles.bind(this));
    this.app.ticker.add((ticker: PIXI.Ticker) => this.tickArenaEffectOverlays(ticker.deltaMS));

    this.initialized = true;
  }

  // ─── Main render call (called every animation frame from React) ─────────────

  render(gameState: ServerGameState | null, beyblades: Map<string, ServerBeyblade>) {
    if (!this.initialized || this.contextLost) return;

    if (gameState?.arena && this.arenaRadius === 0) {
      this.buildArena(gameState);
      this.bakeArenaFloor();
      // CRITICAL: stamp the tiltAngle so the R3 sentinel check below does NOT
      // fire a second bake on this same frame (or the very next frame).
      // Without this, arenaFloorTiltAngle stays at -9999 and the condition
      // `currentTilt !== arenaFloorTiltAngle` is always true, triggering a
      // spurious re-bake after the camera has already been repositioned —
      // which writes an empty/black RenderTexture over the correct bake.
      this.arenaFloorTiltAngle = (gameState.arena as any)?.tiltAngle ?? 0;
      this.arenaFloorDirty = false;
      this.arenaFloorLastBakeMs = Date.now();
    }

    this.updateWorldBackground(gameState);

    // R3 / #13: re-bake if tiltAngle changed (immediate) or dirty flag set (rate-limited to 500ms)
    const currentTilt = (gameState?.arena as any)?.tiltAngle ?? 0;
    if (this.arenaRadius > 0 && currentTilt !== this.arenaFloorTiltAngle) {
      this.bakeArenaFloor();
      this.arenaFloorTiltAngle = currentTilt as number;
      this.arenaFloorDirty = false;
      this.arenaFloorLastBakeMs = Date.now();
    } else if (this.arenaFloorDirty && this.arenaRadius > 0) {
      const nowMs = Date.now();
      if (nowMs - this.arenaFloorLastBakeMs >= 500) {
        this.bakeArenaFloor();
        this.arenaFloorDirty = false;
        this.arenaFloorLastBakeMs = nowMs;
      }
    }

    // Update screen size FIRST so zoom limits and camera init see the real canvas dimensions.
    this.world.setScreen(this.app.screen.width, this.app.screen.height);
    // Pre-compute zoom limits before camera initialisation so the initial snap uses the
    // correct fit-arena zoom rather than the 0.25 default.
    if (beyblades.size > 0) {
      const first = beyblades.values().next().value!;
      this.world.computeZoomLimits(first.radius || 2.5);
    }
    this.updateCameraTarget(beyblades);
    this.world.tick();
    this.applyCameraTransform();
    this.updateArenaRotation(gameState);
    this.updateArenaTilt(gameState);

    if (this.featureRenderer && gameState) {
      this.featureRenderer.sync({
        obstacles: gameState.obstacles,
        pits: gameState.pits,
        turrets: gameState.turrets,
        projectiles: gameState.projectiles,
        waterBodies: gameState.waterBodies,
        portals: gameState.portals,
        loops: gameState.loops,
        nowMs: Date.now(),
        viewportCm: this.world.viewportCm(),
        marginCm: 6,
      });
    }

    this.syncBeyblades(beyblades);
    this.syncDetachedBodies(gameState); // 6.13
    this.updateShrinkRing(gameState);
    this.updateSafeZoneRing(gameState); // Phase 25: royale safe zone
    this.renderLinkLines(beyblades);    // F4: combination-lock link lines
    this.renderMeteorLandingZone();     // G4: meteor strike landing zone ring
    this.renderArenaEffectOverlay();    // AA8: darkness/fog/freeze/reverse overlay
  }

  /** Identify the player's bey (or fall back to first alive) and set camera follow target. */
  private updateCameraTarget(beyblades: Map<string, ServerBeyblade>) {
    let target: ServerBeyblade | null = null;
    if (this.controlledBeyId && beyblades.has(this.controlledBeyId)) {
      target = beyblades.get(this.controlledBeyId)!;
    } else {
      for (const b of beyblades.values()) {
        if (b.isActive) { target = b; break; }
      }
      if (!target && beyblades.size > 0) target = beyblades.values().next().value!;
    }
    if (target) {
      const cm = this.physicsToWorldCm(target.x, target.y);
      this.world.setFollowTarget(cm.x, cm.y);
      // Defer camera initialisation until the canvas has a real size (avoids a zoom=0.25
      // lock that occurs when setScreen hasn't fired yet on the very first frame).
      if (!this.cameraInitialized && this.world.screenW > 0 && this.world.screenH > 0) {
        this.world.snapTo(cm.x, cm.y);
        // Start at fit-arena zoom so the entire arena is always visible — all beys
        // (including 12-player royale) are in frame from the first frame.
        this.world.setZoom(this.world.limits.minZoom, true);
        this.cameraInitialized = true;
      }
    }
  }

  /** Apply current camera state to the world layer (position + scale). */
  private applyCameraTransform() {
    const z = this.world.camera.zoom;
    // viewportScale maps world-px (cm * PX_PER_CM_BASE) to screen-px proportionally.
    // At REFERENCE_VMIN viewport height, viewportScale = 1 and behaviour is identical
    // to the fixed-24px/cm baseline.  On smaller/larger screens it shrinks/grows so
    // the arena always occupies the same fraction of the viewport.
    const viewportScale = getPxPerCm() / PX_PER_CM_BASE;
    const s = z * viewportScale;
    this.worldRoot.scale.set(s);
    const cx_worldPx = this.world.camera.x_cm * PX_PER_CM_BASE;
    const cy_worldPx = this.world.camera.y_cm * PX_PER_CM_BASE;

    // ── Camera Shake (WorldTransform absorbs shake) ────────────────────────────
    const shake = this.world.getShakeOffset();
    this.worldRoot.position.set(
      this.app.screen.width  / 2 - cx_worldPx * s + shake.x,
      this.app.screen.height / 2 - cy_worldPx * s + shake.y,
    );
  }

  /** Public: declare which bey ID the camera should follow (the local player's). */
  setControlledBeyblade(id: string | null) {
    this.controlledBeyId = id;
    this.cameraInitialized = false; // snap to new target on next frame
  }

  /**
   * #29: Client-side prediction — called by the useColyseus rAF prediction loop
   * every frame with the locally-predicted physics-space position.  The renderer
   * substitutes this for the interpolator output on the controlled bey only.
   */
  setPredictedPosition(beyId: string, x: number, y: number): void {
    this.predictionOverride.set(beyId, { x, y });
  }

  /** Clear the predicted position for a bey (e.g. when the bey is eliminated). */
  clearPredictedPosition(beyId: string): void {
    this.predictionOverride.delete(beyId);
  }

  /** Phase 27: apply tier values from beyGhosts so containers fade to correct opacity. */
  applyBeyGhostTiers(beyGhosts: Map<string, { tier: number }>) {
    beyGhosts.forEach((ghost, id) => {
      const tier = ghost.tier as 0 | 1 | 2;
      this.beyTiers.set(id, tier);
    });
    // Reset tier to 2 for any bey not in beyGhosts (owns its own bey = always full)
    this.beybladeContainers.forEach((_, id) => {
      if (!beyGhosts.has(id)) this.beyTiers.set(id, 2);
    });
  }

  /** Public: read the current camera viewport in cm (for minimap, debug overlays). */
  getViewportCm(): { x: number; y: number; w: number; h: number } {
    return this.world.viewportCm();
  }

  /** Public: camera control surface for UI buttons / keyboard. */
  cameraZoomIn() { this.world.nudgeZoom(1.15); }
  cameraZoomOut() { this.world.nudgeZoom(1 / 1.15); }
  cameraZoomReset() {
    const fit = this.world.limits.minZoom;
    const close = this.world.limits.maxZoom;
    // Reset = midway between fit and 5-bey close-up, biased toward gameplay zoom.
    this.world.setZoom(Math.min(close, Math.max(fit, fit * 2)));
  }

  /**
   * Spin the arena bowl. If the server publishes `arena.rotation` in radians,
   * use it directly; otherwise advance our own state using rotationSpeed +
   * rotationDirection set from the arena schema. Features that live in the
   * arena frame (under `featureLayer`) rotate along with the bowl; beys do not.
   */
  private updateArenaRotation(gameState: ServerGameState | null) {
    const now = performance.now();
    const dt = this.lastFrameMs > 0 ? Math.min(0.05, (now - this.lastFrameMs) / 1000) : 0;
    this.lastFrameMs = now;

    const arena = gameState?.arena as any;
    if (arena) {
      if (typeof arena.rotation === "number" && Number.isFinite(arena.rotation)) {
        // Server is authoritative — accept its angle directly.
        this.arenaRotationRad = arena.rotation;
      } else {
        // Auto-rotate fallback driven by arena config.
        if (arena.autoRotate && typeof arena.rotationSpeed === "number") {
          const newSpeed = (arena.rotationSpeed * Math.PI) / 180;
          if (newSpeed !== this.arenaRotationSpeedRadPerS) this.arenaFloorDirty = true;
          this.arenaRotationSpeedRadPerS = newSpeed;
          this.arenaRotationDirection = arena.rotationDirection === "counterclockwise" ? -1 : 1;
        } else if (!arena.autoRotate) {
          if (this.arenaRotationSpeedRadPerS !== 0) this.arenaFloorDirty = true;
          this.arenaRotationSpeedRadPerS = 0;
        }
        this.arenaRotationRad += this.arenaRotationSpeedRadPerS * this.arenaRotationDirection * dt;
      }
    }
    if (this.arenaRotationRoot) {
      this.arenaRotationRoot.rotation = this.arenaRotationRad;
      // Configurable pivot for rotation (cm → worldPx).
      const pvx = (arena && typeof arena.rotationPivotX === "number") ? arena.rotationPivotX * PX_PER_CM_BASE : 0;
      const pvy = (arena && typeof arena.rotationPivotY === "number") ? arena.rotationPivotY * PX_PER_CM_BASE : 0;
      this.arenaRotationRoot.pivot.set(pvx, pvy);
      this.arenaRotationRoot.position.set(pvx, pvy); // compensate so visual origin stays at (0,0)
    }
  }

  /**
   * Apply perspective-foreshortening for arena tilt.
   *
   * Three nested containers produce the correct 2D projection of a tilted plane:
   *   arenaTiltOuter  — rotated by tiltDirection  (aligns the tilt axis with local X)
   *   arenaTiltScale  — scaleX = cos(tiltAngle)   (compresses along that axis)
   *   arenaTiltInner  — rotated by -tiltDirection  (restores the original orientation)
   *
   * Results:
   *   tiltAngle=0°   → identity (flat arena)
   *   tiltAngle=45°  → ellipse squished along tiltDirection axis
   *   tiltAngle=90°  → arena collapses to a line (viewed edge-on — wall-ride)
   *   tiltAngle=180° → scaleX=-1 → mirror flip (fully inverted / Zero-G)
   *   tiltAngle=360° → identity again
   */
  private updateArenaTilt(gameState: ServerGameState | null) {
    if (!this.arenaTiltOuter) return;
    const arena = gameState?.arena as any;
    // Use server-set tiltAngle, falling back to subclass default (2.5D = 28°, 2D = 0°).
    const serverTilt: number = (arena && typeof arena.tiltAngle === "number") ? arena.tiltAngle : 0;
    const tiltAngle = serverTilt !== 0 ? serverTilt : this.defaultTiltAngle;
    const tiltDir:   number = (arena && typeof arena.tiltDirection === "number") ? arena.tiltDirection : 0;

    // Configurable pivot for tilt (cm → worldPx). Setting pivot + matching position
    // keeps the visual origin at (0,0) while rotation/scale happen around the pivot.
    const pvx = (arena && typeof arena.tiltPivotX === "number") ? arena.tiltPivotX * PX_PER_CM_BASE : 0;
    const pvy = (arena && typeof arena.tiltPivotY === "number") ? arena.tiltPivotY * PX_PER_CM_BASE : 0;
    this.arenaTiltOuter.pivot.set(pvx, pvy);
    this.arenaTiltOuter.position.set(pvx, pvy);

    if (tiltAngle === 0 || tiltAngle === 360) {
      this.arenaTiltOuter.rotation = 0;
      this.arenaTiltScale.scale.x  = 1;
      this.arenaTiltInner.rotation = 0;
      return;
    }

    const dirRad  = (tiltDir   * Math.PI) / 180;
    const tiltRad = (tiltAngle * Math.PI) / 180;
    this.arenaTiltOuter.rotation = dirRad;
    this.arenaTiltScale.scale.x  = Math.cos(tiltRad); // negative 90–270° = visual flip/invert
    this.arenaTiltInner.rotation = -dirRad;
  }

  /** Convert server physics-space coords → world cm coords (origin = arena center). */
  physicsToWorldCm(px: number, py: number): { x: number; y: number } {
    // world cm = (physics - physicsCenter) / (PX_PER_CM_BASE * PHYSICS_SCALE)
    const f = PX_PER_CM_BASE * PHYSICS_SCALE;
    return {
      x: (px - this.physicsCenterX) / f,
      y: (py - this.physicsCenterY) / f,
    };
  }

  // ─── Arena rendering ─────────────────────────────────────────────────────────

  // ─── World background (full-canvas, screen-space, behind everything) ─────────

  private updateWorldBackground(gameState: ServerGameState | null): void {
    if (!this.worldBgLayer) return;
    const arena = gameState?.arena;
    const bgType    = arena?.worldBgType     ?? "none";
    const bgColor   = arena?.worldBgColor    ?? "";
    const bgUrl     = arena?.worldBgImageUrl ?? "";
    const bgOpacity = arena?.worldBgOpacity  ?? 1.0;
    const bgFit     = arena?.worldBgFit      ?? "cover";
    const bgBlur    = arena?.worldBgBlurPx   ?? 0;
    const W = this.app.screen.width;
    const H = this.app.screen.height;

    if (bgType === "none") {
      this.worldBgLayer.visible = false;
      return;
    }

    this.worldBgLayer.visible = true;
    this.worldBgLayer.alpha = bgOpacity;

    if (bgType === "color") {
      // Remove any image sprite when switching to color
      if (this.worldBgSprite) {
        this.worldBgLayer.removeChild(this.worldBgSprite);
        this.worldBgSprite.destroy();
        this.worldBgSprite = null;
        this.worldBgLastUrl = "";
      }
      if (!this.worldBgGraphics) {
        this.worldBgGraphics = new PIXI.Graphics();
        this.worldBgLayer.addChildAt(this.worldBgGraphics, 0);
      }
      const colorNum = parseInt((bgColor || "#000000").replace("#", ""), 16);
      this.worldBgGraphics.clear();
      this.worldBgGraphics.rect(0, 0, W, H).fill({ color: colorNum });
      return;
    }

    if (bgType === "image") {
      // Remove solid color rect when switching to image
      if (this.worldBgGraphics) {
        this.worldBgLayer.removeChild(this.worldBgGraphics);
        this.worldBgGraphics.destroy();
        this.worldBgGraphics = null;
      }
      // Load image if URL changed
      if (bgUrl && bgUrl !== this.worldBgLastUrl) {
        this.worldBgLastUrl = bgUrl;
        if (this.worldBgSprite) {
          this.worldBgLayer.removeChild(this.worldBgSprite);
          this.worldBgSprite.destroy();
          this.worldBgSprite = null;
        }
        PIXI.Assets.load(bgUrl).then((tex: PIXI.Texture) => {
          if (this.worldBgLastUrl !== bgUrl) return; // url changed again — discard
          const sprite = new PIXI.Sprite(tex);
          if (bgBlur > 0) {
            sprite.filters = [new PIXI.BlurFilter({ strength: bgBlur, quality: 4 })];
          }
          this.worldBgSprite = sprite;
          this.worldBgLayer.addChildAt(sprite, 0);
          this.sizeWorldBgSprite(bgFit);
        }).catch(() => { /* ignore load errors */ });
      } else if (this.worldBgSprite) {
        this.sizeWorldBgSprite(bgFit);
      }
    }
  }

  private sizeWorldBgSprite(fit: string): void {
    const sprite = this.worldBgSprite;
    if (!sprite || !sprite.texture || sprite.texture.width === 0) return;
    const W = this.app.screen.width;
    const H = this.app.screen.height;
    const tw = sprite.texture.width;
    const th = sprite.texture.height;
    if (fit === "stretch") {
      sprite.width  = W;
      sprite.height = H;
    } else if (fit === "contain") {
      const scale = Math.min(W / tw, H / th);
      sprite.width  = tw * scale;
      sprite.height = th * scale;
      sprite.x = (W - sprite.width)  / 2;
      sprite.y = (H - sprite.height) / 2;
      return;
    } else {
      // cover (default): fill entire canvas, crop the excess
      const scale = Math.max(W / tw, H / th);
      sprite.width  = tw * scale;
      sprite.height = th * scale;
    }
    sprite.x = (W - sprite.width)  / 2;
    sprite.y = (H - sprite.height) / 2;
  }

  private buildArena(gameState: ServerGameState) {
    this.arenaLayer.removeChildren();

    const { width, height, shape, theme } = gameState.arena!;

    // World coords: origin at arena center, units = "world px" (= cm * PX_PER_CM_BASE).
    // 1cm = PX_PER_CM_BASE world-px; the camera transform handles screen scaling.
    this.arenaCenterX = 0;
    this.arenaCenterY = 0;

    // Arena dimensions in cm. CLAUDE.md: arena `width/height` are arena-px at 1cm = 24px.
    const widthCm = width / PX_PER_CM_BASE;
    const heightCm = height / PX_PER_CM_BASE;
    // Playable radius matches PhysicsEngine: min(dim) * 0.45.
    this.arenaRadius = Math.min(widthCm, heightCm) * PX_PER_CM_BASE * 0.45;

    // Physics space (server uses arena_px * PHYSICS_SCALE).
    this.physicsCenterX = (width * PHYSICS_SCALE) / 2;
    this.physicsCenterY = (height * PHYSICS_SCALE) / 2;
    this.physicsArenaRadius = Math.min(width, height) * PHYSICS_SCALE * 0.45;

    // Wire arena bounds + zoom limits into the camera.
    const halfWcm = widthCm / 2;
    const halfHcm = heightCm / 2;
    this.world.setArenaBounds(-halfWcm, -halfHcm, halfWcm, halfHcm, false);
    this.world.setScreen(this.app.screen.width, this.app.screen.height);
    // Use a sane default bey radius (cm) for zoom-limit computation; updated each frame
    // by syncBeyblades once real beys arrive.
    this.world.computeZoomLimits(2.5);

    const bgColor  = THEME_COLORS[theme] ?? 0xe8e8e8;
    // Lighter rim tint: blend bgColor toward white by ~30% for the boundary ring
    const rimColor = (((bgColor >> 16 & 0xff) + 80) & 0xff) << 16
                   | (((bgColor >>  8 & 0xff) + 80) & 0xff) <<  8
                   | (( bgColor        & 0xff) + 80) & 0xff;

    const arena = gameState.arena as any;
    // Classic Stadium zone radii in arena-px (same numeric space as this.arenaRadius).
    const pinkWallR  = (arena.pinkWallRadius  > 0) ? arena.pinkWallRadius  : 0;
    const ridgeR     = (arena.ridgeRadius     > 0) ? arena.ridgeRadius     : 0;
    const flatZoneR  = (arena.flatZoneRadius  > 0) ? arena.flatZoneRadius  : 0;
    const hasZones   = pinkWallR > 0 && ridgeR > 0 && flatZoneR > 0;
    const ridgeWidth = hasZones ? Math.max(10, this.arenaRadius * 0.074) : 0;

    const g = new PIXI.Graphics();

    if (shape === "circle") {
      if (hasZones) {
        // ── Classic Stadium layout (back to front) ──────────────────────────────
        // 1. Full arena floor — dark charcoal base
        g.circle(0, 0, this.arenaRadius);
        g.fill({ color: 0x1a1018 });

        // 2. Outer glow halo around the whole arena
        g.circle(0, 0, this.arenaRadius + 22);
        g.fill({ color: 0x000000, alpha: 0 });
        g.circle(0, 0, this.arenaRadius + 22);
        g.stroke({ color: 0xcc2244, width: 22, alpha: 0.25 });

        // 3. Pink wall zone — the ring from pinkWallR to arenaRadius (red/danger area)
        const pinkWallZone = new PIXI.Graphics();
        pinkWallZone.circle(0, 0, this.arenaRadius);
        pinkWallZone.fill({ color: 0x5a0820 });                // dark red wall zone
        pinkWallZone.circle(0, 0, pinkWallR);
        pinkWallZone.fill({ color: 0x1a1018 });                // cut out the inner part

        // 4. Pink wall ring stroke (bright) + KO-zone outer glow
        const pinkWall = new PIXI.Graphics();
        pinkWall.circle(0, 0, pinkWallR + 4);
        pinkWall.stroke({ color: 0xff2255, width: 8, alpha: 0.9 });
        pinkWall.circle(0, 0, pinkWallR);
        pinkWall.stroke({ color: 0xff6688, width: 3, alpha: 0.7 });

        // 5. Arena interior floor (inside pink wall) — subtle slate grey
        const innerFloor = new PIXI.Graphics();
        innerFloor.circle(0, 0, pinkWallR);
        innerFloor.fill({ color: 0x201820 });

        // 6. Sky-blue tornado ridge ring (bright band)
        const ridge = new PIXI.Graphics();
        ridge.circle(0, 0, ridgeR + ridgeWidth / 2);
        ridge.stroke({ color: 0x00ccff, width: ridgeWidth, alpha: 0.85 });
        ridge.circle(0, 0, ridgeR + ridgeWidth / 2);
        ridge.stroke({ color: 0x66eeff, width: ridgeWidth * 0.35, alpha: 0.6 });

        // 7. Flat zone circle — yellow inner boundary ring
        const flatZone = new PIXI.Graphics();
        flatZone.circle(0, 0, flatZoneR + 3);
        flatZone.stroke({ color: 0xffdd00, width: 6, alpha: 0.9 });
        flatZone.circle(0, 0, flatZoneR);
        flatZone.stroke({ color: 0xffff88, width: 2, alpha: 0.5 });

        // 8. Flat zone floor (inside yellow ring) — slightly lighter, defense territory
        const flatFloor = new PIXI.Graphics();
        flatFloor.circle(0, 0, flatZoneR);
        flatFloor.fill({ color: 0x282030 });

        // 9. Launch quadrant crosshair — red semi-transparent lines
        const crosshair = new PIXI.Graphics();
        const cr = pinkWallR;
        crosshair.moveTo(-cr, 0).lineTo(cr, 0)
          .stroke({ color: 0xff3333, width: 2, alpha: 0.35 });
        crosshair.moveTo(0, -cr).lineTo(0, cr)
          .stroke({ color: 0xff3333, width: 2, alpha: 0.35 });

        // 10. Centre dot
        const centerDot = new PIXI.Graphics();
        centerDot.circle(0, 0, 4).fill({ color: 0xff3333, alpha: 0.7 });

        // 11. 2.5D bezel — thick dark outer ring that creates visual depth/stadium wall
        const bezel = new PIXI.Graphics();
        if (this.is25D) {
          const bezelW = Math.max(18, this.arenaRadius * 0.08);
          bezel.circle(0, 0, this.arenaRadius + bezelW);
          bezel.fill({ color: 0x0d0d0d });
          bezel.circle(0, 0, this.arenaRadius);
          bezel.fill({ color: 0x0d0d0d });                    // punch out centre
          // Inner shadow gradient to sell the "bowl" depth
          bezel.circle(0, 0, this.arenaRadius + 2);
          bezel.stroke({ color: 0x444444, width: 3, alpha: 0.8 });
          bezel.circle(0, 0, this.arenaRadius + bezelW);
          bezel.stroke({ color: 0x222222, width: 2, alpha: 0.6 });
          // Notch marks at 0°, 90°, 180°, 270° (stadium entry points)
          for (let deg = 0; deg < 360; deg += 90) {
            const rad = (deg * Math.PI) / 180;
            const nx = Math.cos(rad) * (this.arenaRadius + bezelW * 0.5);
            const ny = Math.sin(rad) * (this.arenaRadius + bezelW * 0.5);
            bezel.circle(nx, ny, bezelW * 0.25).fill({ color: 0x383838 });
          }
          // Top highlight (light source from above-left) — thin bright arc at top of bezel
          bezel.arc(0, 0, this.arenaRadius + bezelW * 0.5, -2.2, -0.9);
          bezel.stroke({ color: 0x666666, width: Math.max(3, bezelW * 0.3), alpha: 0.5 });
        }

        // Phase V3: dynamic shrink ring
        this.shrinkRingGraphics = new PIXI.Graphics();
        this.shrinkRingGraphics.visible = false;
        this.lastShrinkRadiusPx = -1;

        this.arenaLayer.addChild(
          this.is25D ? bezel : new PIXI.Container(),
          g, pinkWallZone, pinkWall, innerFloor,
          ridge, flatFloor, flatZone,
          crosshair, centerDot,
          this.shrinkRingGraphics,
        );
      } else {
        // ── Generic arena (no zone data) ────────────────────────────────────────
        g.circle(0, 0, this.arenaRadius + 20);
        g.fill({ color: bgColor, alpha: 0.35 });
        g.circle(0, 0, this.arenaRadius + 8);
        g.fill({ color: bgColor, alpha: 0.5 });

        const floorGradient = new PIXI.Graphics();
        floorGradient.circle(0, 0, this.arenaRadius);
        floorGradient.fill({ color: bgColor });

        const innerHighlight = new PIXI.Graphics();
        innerHighlight.circle(0, 0, this.arenaRadius * 0.55);
        innerHighlight.fill({ color: 0xffffff, alpha: 0.04 });

        const innerRing = new PIXI.Graphics();
        innerRing.circle(0, 0, this.arenaRadius + 3);
        innerRing.stroke({ color: BeybladeGameRenderer.complementaryColor(bgColor), width: 3, alpha: 0.8 });
        innerRing.circle(0, 0, this.arenaRadius);
        innerRing.stroke({ color: rimColor, width: 4, alpha: 0.9 });

        const boundaryRing = new PIXI.Graphics();
        boundaryRing.circle(0, 0, this.arenaRadius * 0.90);
        boundaryRing.stroke({ color: 0xff4444, width: 1.5, alpha: 0.35 });

        this.shrinkRingGraphics = new PIXI.Graphics();
        this.shrinkRingGraphics.visible = false;
        this.lastShrinkRadiusPx = -1;

        this.arenaLayer.addChild(g, floorGradient, innerHighlight, innerRing, boundaryRing, this.shrinkRingGraphics);
      }
    } else {
      const arenaW = this.arenaRadius * 2;
      const arenaH = this.arenaRadius * 2;
      g.rect(-arenaW / 2, -arenaH / 2, arenaW, arenaH);
      g.fill({ color: bgColor });
      g.stroke({ color: 0x4488cc, width: 3, alpha: 0.6 });
      this.arenaLayer.addChild(g);
    }
  }

  // R3: Bake the static arena floor graphics to a RenderTexture.
  // Called once after buildArena() and again when tiltAngle changes.
  private bakeArenaFloor(): void {
    if (!this.initialized || this.arenaRadius <= 0) return;

    const size = Math.ceil(this.arenaRadius * 2 + 40);

    // (Re-)create the RenderTexture at the right size
    if (this.arenaFloorRT) {
      this.arenaFloorRT.destroy(true);
      this.arenaFloorRT = null;
    }
    this.arenaFloorRT = PIXI.RenderTexture.create({ width: size, height: size });

    // Temporarily translate the arenaLayer so its center aligns with the RT origin.
    // Also hide the floor sprite (if it already exists) to avoid baking a cached
    // copy of itself into the new texture — that causes circular RT-in-RT rendering.
    //
    // In PixiJS 8, renderer.render({ container, target }) projects using the
    // container's WORLD transform, which includes worldRoot's camera position and
    // scale.  We must neutralise worldRoot during the bake so the RT receives
    // arenaLayer centred exactly at (size/2, size/2) rather than being offset by
    // the current camera pan.  worldRoot is restored immediately after.
    const savedLayerX = this.arenaLayer.x;
    const savedLayerY = this.arenaLayer.y;
    const savedWRX = this.worldRoot.position.x;
    const savedWRY = this.worldRoot.position.y;
    const savedWRSX = this.worldRoot.scale.x;
    const savedWRSY = this.worldRoot.scale.y;

    this.arenaLayer.x = size / 2;
    this.arenaLayer.y = size / 2;
    this.worldRoot.position.set(0, 0);
    this.worldRoot.scale.set(1, 1);
    if (this.arenaFloorSprite) this.arenaFloorSprite.visible = false;

    this.app.renderer.render({ container: this.arenaLayer, target: this.arenaFloorRT, clear: true });

    this.arenaLayer.x = savedLayerX;
    this.arenaLayer.y = savedLayerY;
    this.worldRoot.position.set(savedWRX, savedWRY);
    this.worldRoot.scale.set(savedWRSX, savedWRSY);
    if (this.arenaFloorSprite) this.arenaFloorSprite.visible = true;

    // Replace or create the sprite that sits on top of arenaLayer
    if (!this.arenaFloorSprite) {
      this.arenaFloorSprite = new PIXI.Sprite();
      // Insert at position 0 so it renders below dynamic content
      this.arenaLayer.addChildAt(this.arenaFloorSprite, 0);
    }
    this.arenaFloorSprite.texture = this.arenaFloorRT;
    this.arenaFloorSprite.anchor.set(0.5);
    this.arenaFloorSprite.x = 0;
    this.arenaFloorSprite.y = 0;
  }

  // Phase V3: redraw the shrink boundary ring each frame.
  private updateShrinkRing(gameState: ServerGameState | null): void {
    if (!this.shrinkRingGraphics) return;

    const effPhys = gameState?.effectiveRadius;
    if (!effPhys || effPhys <= 0 || this.physicsArenaRadius <= 0) {
      this.shrinkRingGraphics.visible = false;
      this.lastShrinkRadiusPx = -1;
      return;
    }

    const scale = this.arenaRadius / this.physicsArenaRadius;
    const screenR = effPhys * scale;

    // Skip redraw if radius hasn't changed meaningfully (< 0.5px drift)
    if (Math.abs(screenR - this.lastShrinkRadiusPx) < 0.5) {
      this.shrinkRingGraphics.visible = true;
      return;
    }
    this.lastShrinkRadiusPx = screenR;

    const WARN_BAND_PX = Math.max(8, screenR * 0.06); // warn zone width scales with ring

    this.shrinkRingGraphics.clear();

    // Warn band: semi-transparent red fill between effectiveRadius and the outer edge
    const outerR = Math.min(screenR + WARN_BAND_PX, this.arenaRadius);
    this.shrinkRingGraphics.circle(0, 0, outerR).fill({ color: 0xff3300, alpha: 0.0 });
    this.shrinkRingGraphics.circle(0, 0, screenR).fill({ color: 0x000000, alpha: 0.0 });
    // draw the warn band as a thick annular stroke between screenR and outerR
    const midR = (screenR + outerR) / 2;
    const bandWidth = outerR - screenR;
    this.shrinkRingGraphics
      .circle(0, 0, midR)
      .stroke({ color: 0xff3300, width: bandWidth, alpha: 0.25 });

    // Bright glowing ring at exact effective radius
    this.shrinkRingGraphics
      .circle(0, 0, screenR)
      .stroke({ color: 0xff2200, width: 3, alpha: 0.9 });

    // Outer soft glow
    this.shrinkRingGraphics
      .circle(0, 0, screenR + 4)
      .stroke({ color: 0xff6600, width: 6, alpha: 0.3 });

    this.shrinkRingGraphics.visible = true;
  }

  // Phase 25: draw the Battle Royale safe zone ring each frame.
  private updateSafeZoneRing(gameState: ServerGameState | null): void {
    if (!this.safeZoneRing || !this.safeZoneOuterOverlay) return;

    const arena = gameState?.arena;
    const phase = arena?.safeZonePhase ?? 0;
    const radiusCm = arena?.safeZoneRadius ?? 0;

    if (radiusCm <= 0 || phase <= 0) {
      this.safeZoneRing.visible = false;
      this.safeZoneOuterOverlay.visible = false;
      return;
    }

    // Convert safe zone center + radius from physics px → render px
    const scale = this.arenaRadius / Math.max(1, this.physicsArenaRadius);
    const ringR = radiusCm * scale; // radiusCm stored as physics px in schema
    const cx = (arena?.safeZoneX ?? 0) * scale;
    const cy = (arena?.safeZoneY ?? 0) * scale;

    // 1Hz pulse: alpha oscillates between 0.4 and 0.7
    const pulse = 0.55 + 0.15 * Math.sin(this.safeZonePulseTimer * Math.PI * 2);
    const phaseColors = [0xffcc00, 0xff9900, 0xff6600, 0xff3300, 0xcc0000];
    const ringColor = phaseColors[Math.min(phase, phaseColors.length - 1)];

    this.safeZoneRing.clear();
    this.safeZoneRing.circle(cx, cy, ringR).stroke({ color: ringColor, width: 4, alpha: pulse });
    this.safeZoneRing.circle(cx, cy, ringR + 6).stroke({ color: ringColor, width: 8, alpha: pulse * 0.25 });
    this.safeZoneRing.visible = true;

    // Danger overlay outside the ring — wide annular stroke from ringR to arena edge.
    // Use multiple concentric strokes to simulate a filled outer zone.
    const overlayAlpha = 0.05 * phase;
    const bandSteps = 6;
    const bandWidth = Math.max(8, (this.arenaRadius - ringR) / bandSteps);
    this.safeZoneOuterOverlay.clear();
    for (let i = 0; i < bandSteps; i++) {
      const midR = ringR + bandWidth * (i + 0.5);
      if (midR > this.arenaRadius + bandWidth) break;
      this.safeZoneOuterOverlay
        .circle(cx, cy, midR)
        .stroke({ color: 0xff2200, width: bandWidth + 1, alpha: overlayAlpha });
    }
    this.safeZoneOuterOverlay.visible = overlayAlpha > 0;
  }

  // Convert a physics-space position (server coordinates) to screen-space pixels.
  // Use this when placing UI elements or particles at positions received from the server.
  physicsToScreen(px: number, py: number): { x: number; y: number } {
    const scale = this.physicsArenaRadius > 0 ? this.arenaRadius / this.physicsArenaRadius : 1;
    return {
      x: this.arenaCenterX + (px - this.physicsCenterX) * scale,
      y: this.arenaCenterY + (py - this.physicsCenterY) * scale,
    };
  }

  // Phase LOS: apply line-of-sight culling/fade to a container (2.5D only).
  protected applyLOSCull(container: PIXI.Container, entityXcm: number, entityYcm: number): void {
    const dist = Math.hypot(entityXcm - this.world.camera.x_cm, entityYcm - this.world.camera.y_cm);
    if (dist >= this.LINE_OF_SIGHT_CM) {
      container.visible = false;
      return;
    }
    container.visible = true;
    const fadeRange = this.LINE_OF_SIGHT_CM - this.FADE_START_CM;
    const fadeT = Math.max(0, dist - this.FADE_START_CM) / fadeRange;
    container.alpha = 1 - fadeT;
  }

  // ─── Beyblade rendering with 2.5D perspective ────────────────────────────────

  private syncBeyblades(beyblades: Map<string, ServerBeyblade>) {
    const seen = new Set<string>();

    beyblades.forEach((beyblade, id) => {
      seen.add(id);

      if (!this.beybladeContainers.has(id)) {
        this.createBeybladeDisplayObject(beyblade, id);
      }

      const prev = this.lastPushedState.get(id);
      const bx = beyblade.x, by = beyblade.y, ba = beyblade.rotation, bs = beyblade.spin;
      if (!prev || prev.x !== bx || prev.y !== by || prev.angle !== ba || prev.spin !== bs) {
        this.lastPushedState.set(id, { x: bx, y: by, angle: ba, spin: bs });
        this.interpolator.push(id, {
          time: performance.now(),
          x: bx,
          y: by,
          angle: ba,
          spin: bs,
          wobbleAmplitude: 0,
          beyTiltAngle: (beyblade as any).beyTiltAngle ?? 0,
          adhering: !!(beyblade as any).adhering,
          wallClimbing: !!(beyblade as any).wallClimbing,
          spinDirection: beyblade.spinDirection,
          specialMoveActive: !!(beyblade as any).specialMoveActive,
          comboPhase: (beyblade as any).comboPhase ?? "",
          combinationLocked: !!(beyblade as any).combinationLocked,
        });
      }

      this.updateBeybladeDisplayObject(beyblade, id);
    });

    // Remove display objects for departed beyblades
    this.beybladeContainers.forEach((container, id) => {
      if (!seen.has(id)) {
        this.beybladeLayer.removeChild(container);
        this.beybladeContainers.delete(id);
        this.beybladeSprites.delete(id);
        this.healthBars.delete(id);
        this.spinBars.delete(id);
        this.labelTexts.delete(id);
        this.shadowSprites.delete(id);
        this.attackArcs.delete(id);
        this.shieldRings.delete(id);
        this.dodgeTrails.delete(id);
        this.driftTrails.delete(id);
        this.prevSpinDirections.delete(id);
        this.prevTipStages.delete(id);
        this.prevWearLevels.delete(id);
        this._lastSpins.delete(id);
        this.flashTimers.delete(id);
        this.lastPushedState.delete(id);
        // Remove trail ghost graphics from layer
        const trailG = this.dodgeTrailGraphics.get(id);
        if (trailG) {
          trailG.forEach(g => this.beybladeLayer.removeChild(g));
          this.dodgeTrailGraphics.delete(id);
        }
        const driftG = this.driftTrailGraphics.get(id);
        if (driftG) {
          driftG.forEach(g => this.beybladeLayer.removeChild(g));
          this.driftTrailGraphics.delete(id);
        }
        const blurG = this.motionBlurGraphics.get(id);
        if (blurG) {
          blurG.forEach(g => this.beybladeLayer.removeChild(g));
          this.motionBlurGraphics.delete(id);
        }
        this.motionBlurTrails.delete(id);
        // Remove 2.5D per-bey graphics
        const arc = this.airborneArcs.get(id);
        if (arc) { this.beybladeLayer.removeChild(arc); this.airborneArcs.delete(id); }
        const split = this.splitBodySprites.get(id);
        if (split) { this.beybladeLayer.removeChild(split); this.splitBodySprites.delete(id); }
        this.flashGraphics.delete(id);
        this.beyVisualOverrides.delete(id); // H3: clean up any pending visual override
        // Overhaul per-bey effect cleanup
        this.stanceRings.delete(id);
        this.gimmickRings.delete(id);
        this.desperationRings.delete(id);
        this.bitbeastHalos.delete(id);
        this.furyRings.delete(id);
        this.furyBars.delete(id);
        this.statusIconTexts.delete(id);
        this.interpolator.remove(id);
      }
    });
  }

  private createBeybladeDisplayObject(beyblade: ServerBeyblade, id: string) {
    const container = new PIXI.Container();
    const typeColor = parseBeyColor(beyblade);

    // Shadow (drawn first, behind sprite)
    const shadow = new PIXI.Graphics();
    container.addChild(shadow);
    this.shadowSprites.set(id, shadow);

    // Beyblade body (spinning top shape)
    const sprite = new PIXI.Graphics();
    this.drawBeybladeShape(
      sprite, typeColor, beyblade.actualSize || 48,
      beyblade.tipEvolutionStage ?? 0,
      beyblade.materialWearLevel ?? 100,
    );
    container.addChild(sprite);
    this.beybladeSprites.set(id, sprite);

    // Attack arc (sword sweep — drawn above sprite, hidden by default)
    const attackArc = new PIXI.Graphics();
    attackArc.alpha = 0;
    container.addChild(attackArc);
    this.attackArcs.set(id, attackArc);

    // Shield ring (defense orbit — drawn above sprite, hidden by default)
    const shieldRing = new PIXI.Graphics();
    shieldRing.alpha = 0;
    container.addChild(shieldRing);
    this.shieldRings.set(id, shieldRing);

    // 6.15 — SpinDirection change flash overlay (counter-rotation burst)
    const flashG = new PIXI.Graphics();
    flashG.alpha = 0;
    container.addChild(flashG);
    this.flashGraphics.set(id, flashG);

    // Health bar (DOM-independent, rendered in PixiJS)
    const healthBar = new PIXI.Graphics();
    container.addChild(healthBar);
    this.healthBars.set(id, healthBar);

    // Spin bar
    const spinBar = new PIXI.Graphics();
    container.addChild(spinBar);
    this.spinBars.set(id, spinBar);

    // Username label
    const label = new PIXI.Text({
      text: beyblade.username,
      style: {
        fontSize: 11,
        fill: 0xffffff,
        fontFamily: "monospace",
        align: "center",
        dropShadow: { alpha: 0.8, angle: 0, blur: 4, distance: 0, color: 0x000000 },
      },
    });
    label.anchor.set(0.5, 1);
    container.addChild(label);
    this.labelTexts.set(id, label);

    // Dodge trail state (positions stored, graphics managed separately)
    this.dodgeTrails.set(id, []);
    this.dodgeTrailGraphics.set(id, []);
    // Drift trail (Phase 24 semi-autonomous mode indicator)
    this.driftTrails.set(id, []);
    this.driftTrailGraphics.set(id, []);
    // Motion blur trail
    this.motionBlurTrails.set(id, []);
    this.motionBlurGraphics.set(id, []);

    // Overhaul per-bey effect graphics (added to container so they move with the bey)
    const stanceRing = new PIXI.Graphics();
    container.addChild(stanceRing);
    this.stanceRings.set(id, stanceRing);

    const gimmickRing = new PIXI.Graphics();
    container.addChild(gimmickRing);
    this.gimmickRings.set(id, gimmickRing);

    const desperationRing = new PIXI.Graphics();
    container.addChild(desperationRing);
    this.desperationRings.set(id, desperationRing);

    const bitbeastHalo = new PIXI.Graphics();
    container.addChildAt(bitbeastHalo, 0); // behind sprite
    this.bitbeastHalos.set(id, bitbeastHalo);

    const furyRing = new PIXI.Graphics();
    container.addChild(furyRing);
    this.furyRings.set(id, furyRing);

    const furyBar = new PIXI.Graphics();
    container.addChild(furyBar);
    this.furyBars.set(id, furyBar);

    const statusIcon = new PIXI.Text({
      text: "",
      style: { fontSize: 14, fontFamily: "sans-serif" },
    });
    statusIcon.anchor.set(0.5, 1);
    container.addChild(statusIcon);
    this.statusIconTexts.set(id, statusIcon);

    this.beybladeLayer.addChild(container);
    this.beybladeContainers.set(id, container);
  }

  // Tip core colour per evolution stage: 0=white, 1=amber, 2=orange, 3+=red
  private static readonly TIP_STAGE_COLORS = [0xffffff, 0xfbbf24, 0xf97316, 0xef4444] as const;

  private static complementaryColor(c: number): number {
    const r = (c >> 16) & 0xff;
    const g = (c >> 8) & 0xff;
    const b = c & 0xff;
    return ((255 - r) << 16) | ((255 - g) << 8) | (255 - b);
  }

  private drawBeybladeShape(
    g: PIXI.Graphics,
    color: number,
    radiusPx: number,
    tipEvolutionStage = 0,
    tipWearPct = 100, // 0–100; tip core dims as material wears
  ) {
    g.clear();
    const r = radiusPx / 2;

    // Contrasting outline border (complementary color) so the bey is always visible
    const outlineColor = BeybladeGameRenderer.complementaryColor(color);
    g.circle(0, 0, r + 2);
    g.stroke({ color: outlineColor, width: 3, alpha: 1.0 });

    // Outer ring (attack layer)
    g.circle(0, 0, r);
    g.fill({ color, alpha: 0.9 });

    // Inner core (performance tip) — colour = stage, alpha = wear level
    const stageColors = BeybladeGameRenderer.TIP_STAGE_COLORS;
    const tipColor = stageColors[Math.min(tipEvolutionStage, stageColors.length - 1)];
    const wearAlpha = 0.15 + (Math.max(0, Math.min(100, tipWearPct)) / 100) * 0.5;
    g.circle(0, 0, r * 0.45);
    g.fill({ color: tipColor, alpha: wearAlpha });

    // Direction indicator
    g.moveTo(0, 0);
    g.lineTo(r, 0);
    g.stroke({ color: 0xffffff, width: 2, alpha: 0.8 });

    // Spin streaks (3 radial lines for spinning effect)
    for (let i = 1; i < 3; i++) {
      const angle = (i * Math.PI * 2) / 3;
      g.moveTo(0, 0);
      g.lineTo(Math.cos(angle) * r * 0.8, Math.sin(angle) * r * 0.8);
      g.stroke({ color: 0xffffff, width: 1, alpha: 0.3 });
    }
  }

  private updateBeybladeDisplayObject(beyblade: ServerBeyblade, id: string) {
    const container = this.beybladeContainers.get(id);
    const sprite = this.beybladeSprites.get(id);
    const healthBar = this.healthBars.get(id);
    const spinBar = this.spinBars.get(id);
    const label = this.labelTexts.get(id);
    const shadow = this.shadowSprites.get(id);
    const attackArc = this.attackArcs.get(id);
    const shieldRing = this.shieldRings.get(id);
    if (!container || !sprite || !healthBar || !spinBar || !label) return;

    const r = (beyblade.actualSize || 48) / 2;

    // Use interpolated position/angle for smooth motion; fall back to raw server values.
    // #29: For the controlled bey, prefer client-side predicted position (sub-RTT feel).
    const interp = this.interpolator.getInterpolated(id, performance.now());
    const predicted = (id === this.controlledBeyId) ? this.predictionOverride.get(id) : undefined;
    const interpX = predicted?.x ?? interp?.x ?? beyblade.x;
    const interpY = predicted?.y ?? interp?.y ?? beyblade.y;
    const interpAngle = interp?.angle ?? beyblade.rotation;

    // Map physics coords → screen coords using the stored physics scale
    const physScale = this.physicsArenaRadius > 0 ? this.arenaRadius / this.physicsArenaRadius : 1;
    const screenX = this.arenaCenterX + (interpX - this.physicsCenterX) * physScale;
    const screenY = this.arenaCenterY + (interpY - this.physicsCenterY) * physScale;

    container.x = screenX;
    container.y = screenY;

    // Phase LOS: cull/fade entities outside 30 cm range (2.5D only)
    if (this.is25D) {
      const posXcm = (interpX - this.physicsCenterX) * physScale / PX_PER_CM_BASE;
      const posYcm = (interpY - this.physicsCenterY) * physScale / PX_PER_CM_BASE;
      this.applyLOSCull(container, posXcm, posYcm);
      if (!container.visible) return;
    } else {
      // L2B.5: 2D mode viewport cap — cull beys beyond 100cm from camera.
      const posXcm = (interpX - this.physicsCenterX) * physScale / PX_PER_CM_BASE;
      const posYcm = (interpY - this.physicsCenterY) * physScale / PX_PER_CM_BASE;
      const dist = Math.hypot(posXcm - this.world.camera.x_cm, posYcm - this.world.camera.y_cm);
      container.visible = dist <= 100;
      if (!container.visible) return;
    }

    // Stability-based 2.5D perspective effects
    const stability = getBeybladeStability(beyblade);

    // ── Airborne effect: scale up 1.3× + drop shadow below ────────────────
    const isAirborne = beyblade.isAirborne;
    if (isAirborne) {
      sprite.scale.set(1.3, 1.3 * (0.85 + stability * 0.15));
      // 6.14 — slight upward offset while airborne
      sprite.y = -8;
    } else {
      sprite.scale.set(1.0, 0.85 + stability * 0.15);
      sprite.y = 0;
    }

    // Drop shadow (ellipse at ground level, only when airborne)
    if (shadow) {
      shadow.clear();
      if (isAirborne) {
        shadow.ellipse(4, r * 0.6, r * 0.9, r * 0.25);
        shadow.fill({ color: 0x000000, alpha: 0.35 });
      }
    }

    // 6.14 — Airborne hop arc trail (ghost circles along jumpFacingAngle)
    {
      let arcG = this.airborneArcs.get(id);
      if (isAirborne && beyblade.jumpFacingAngle !== undefined) {
        if (!arcG) {
          arcG = new PIXI.Graphics();
          this.beybladeLayer.addChildAt(arcG, 0);
          this.airborneArcs.set(id, arcG);
        }
        arcG.clear();
        const ang = beyblade.jumpFacingAngle;
        for (let i = 1; i <= 4; i++) {
          const dist = r * 1.8 * i;
          arcG.circle(
            screenX - Math.cos(ang) * dist,
            screenY - Math.sin(ang) * dist,
            r * Math.max(0.05, 0.45 - i * 0.09),
          );
          arcG.fill({ color: 0xaaddff, alpha: 0.28 * (1 - i / 5) });
        }
      } else if (arcG) {
        arcG.clear();
      }
    }

    // Tilt skew when nearly spun out (spinning top about to fall)
    const tiltAmount = (1 - stability) * 0.25;
    const wobbleSkewX = tiltAmount * Math.sin(Date.now() / 300);

    // E9: beyTiltAngle skew (2.5D tilt effect — combines with wobble)
    // Uses sin so the skew mirrors the full 0–360° rotation: max skew at 90°, zero at 180° (on back), max negative at 270° (on head), zero again at 360°.
    const tiltAngle = (beyblade as any).beyTiltAngle ?? 0;
    const tiltFrac = tiltAngle !== 0 ? Math.sin(tiltAngle * Math.PI / 180) : 0;
    const tiltSkewX = tiltFrac * 0.4; // ±0.4 radians skew at 90°/270°

    sprite.skew.set(wobbleSkewX + tiltSkewX, 0);

    // Spin rotation (visual — uses interpolated angle for smooth motion)
    sprite.rotation = interpAngle;

    // Redraw shape when tip evolution stage, wear level, or spin bucket changes.
    // R4: spin bucket (0–4) prevents per-frame redraws driven purely by continuous spin decay.
    {
      const tipStage  = beyblade.tipEvolutionStage ?? 0;
      const wearPct   = beyblade.materialWearLevel  ?? 100;
      const spinFrac  = beyblade.maxSpin > 0 ? beyblade.spin / beyblade.maxSpin : 0;
      const spinBucket = spinFrac > 0.75 ? 4 : spinFrac > 0.40 ? 3 : spinFrac > 0.15 ? 2 : spinFrac > 0 ? 1 : 0;
      if (
        this.prevTipStages.get(id) !== tipStage ||
        this.prevWearLevels.get(id) !== wearPct  ||
        this._lastSpins.get(id)    !== spinBucket
      ) {
        const typeColor = parseBeyColor(beyblade);
        this.drawBeybladeShape(sprite, typeColor, beyblade.actualSize || 48, tipStage, wearPct);
        this.prevTipStages.set(id, tipStage);
        this.prevWearLevels.set(id, wearPct);
        this._lastSpins.set(id, spinBucket);
      }
    }

    // Motion blur: stronger at high angular velocity
    const blurAlpha = Math.min(1, Math.abs(beyblade.angularVelocity) / 5);
    sprite.alpha = beyblade.isActive ? (0.7 + blurAlpha * 0.3) : 0.3;

    // Invulnerable: flashing effect (dodge window or isInvulnerable flag)
    if (beyblade.isInvulnerable || (beyblade.dodgeBuffTimer > 0)) {
      sprite.alpha = Math.sin(Date.now() / 80) > 0 ? 1 : 0.15;
    }

    // Phase 27 Tiered AoI: fade container alpha toward target based on tier.
    // Tier 2 (full) = 1.0; Tier 1 (shadow) = 0.3; Tier 0 = hidden (minimap only).
    {
      const tier = this.beyTiers.get(id) ?? 2;
      const targetAlpha = tier === 2 ? 1.0 : tier === 1 ? 0.3 : 0.0;
      const prev = this.beyTierAlphas.get(id) ?? 1.0;
      // Lerp at ~12 steps per 200ms @60Hz = rate ≈ 0.30
      const next = prev + (targetAlpha - prev) * 0.30;
      this.beyTierAlphas.set(id, next);
      container.alpha = next;
      // Tier 1: tint gray to indicate shadow/out-of-range bey
      if (tier === 1) {
        sprite.tint = 0x888888;
      } else if (tier === 2 && !(beyblade as any).specialMoveActive) {
        sprite.tint = 0xffffff; // restore if not overridden by special move
      }
    }

    // N4: specialMoveActive — white tint to indicate active special move
    if ((beyblade as any).specialMoveActive) {
      sprite.tint = 0xffffff;
      // Overlay a pulsing white ring to suggest a glow effect
      const flashG = this.flashGraphics.get(id);
      if (flashG) {
        const glowPulse = 0.3 + 0.3 * Math.sin(Date.now() / 100);
        flashG.clear();
        flashG.circle(0, 0, r * 1.2);
        flashG.fill({ color: 0xffffff, alpha: glowPulse });
      }
    } else if ((beyblade as any).adhering) {
      // N4: adhering — slight green tint to indicate adhesion state
      sprite.tint = 0x88ffaa;
    } else {
      // Material wear tint: new=white (0xffffff), worn=brownish-orange (0xcc7733)
      const wearT = Math.max(0, Math.min(100, (beyblade as any).materialWearLevel ?? 100)) / 100;
      const wR = Math.round(0xff * wearT + 0xcc * (1 - wearT));
      const wG = Math.round(0xff * wearT + 0x77 * (1 - wearT));
      const wB = Math.round(0xff * wearT + 0x33 * (1 - wearT));
      sprite.tint = (wR << 16) | (wG << 8) | wB;
    }

    // ── Attack arc: sword sweep semicircle (visible while attackBuffTimer > 0) ──
    if (attackArc) {
      attackArc.clear();
      if (beyblade.attackBuffTimer > 0) {
        const arcProgress = 1 - Math.min(1, beyblade.attackBuffTimer / 0.5);
        const sweepAngle = arcProgress * Math.PI;
        const baseAngle = sprite.rotation - Math.PI / 4;
        attackArc.moveTo(0, 0);
        attackArc.arc(0, 0, r * 1.5, baseAngle, baseAngle + sweepAngle);
        attackArc.fill({ color: 0xff6644, alpha: 0.6 * (1 - arcProgress) });
        attackArc.arc(0, 0, r * 1.5, baseAngle, baseAngle + sweepAngle);
        attackArc.stroke({ color: 0xff8800, width: 2, alpha: 0.9 * (1 - arcProgress) });
        attackArc.alpha = 1;
      } else {
        attackArc.alpha = 0;
      }
    }

    // ── Shield ring: blue orbiting ring (visible while isDefending) ────────
    if (shieldRing) {
      shieldRing.clear();
      if (beyblade.isDefending) {
        const pulse = 0.6 + 0.4 * Math.sin(Date.now() / 160);
        shieldRing.circle(0, 0, r * 1.4);
        shieldRing.stroke({ color: 0x4488ff, width: 3, alpha: 0.8 * pulse });
        shieldRing.circle(0, 0, r * 1.6);
        shieldRing.stroke({ color: 0x88ccff, width: 1, alpha: 0.4 * pulse });
        shieldRing.alpha = 1;
      } else {
        shieldRing.alpha = 0;
      }
    }

    // ── Dodge trail: ghost sprites trailing behind ─────────────────────────
    const trails = this.dodgeTrails.get(id);
    const trailGraphics = this.dodgeTrailGraphics.get(id);
    if (trails !== undefined && trailGraphics !== undefined) {
      if (beyblade.dodgeBuffTimer > 0) {
        trails.push({ x: screenX, y: screenY, alpha: 0.5 });
        if (trails.length > 6) trails.shift();
      }

      // Ensure enough ghost graphic objects
      while (trailGraphics.length < 6) {
        const ghost = new PIXI.Graphics();
        this.beybladeLayer.addChildAt(ghost, 0);
        trailGraphics.push(ghost);
      }

      // 6.15 — trail color reflects spin direction (blue=right, orange-red=left)
      const trailColor = beyblade.spinDirection === "left"
        ? (TYPE_COLORS[beyblade.type] ?? 0xffffff)
        : (TYPE_COLORS[beyblade.type] ?? 0xffffff);
      // (keep per-type color but could differentiate if desired in future)

      for (let i = 0; i < trailGraphics.length; i++) {
        const g = trailGraphics[i];
        const t = trails[i];
        if (t) {
          g.clear();
          g.circle(t.x, t.y, r * (0.4 + i * 0.1));
          g.fill({ color: trailColor, alpha: t.alpha * (i / 6) });
          t.alpha *= 0.75;
        } else {
          g.clear();
        }
      }

      // Prune fully faded trail points
      while (trails.length > 0 && trails[0].alpha < 0.02) trails.shift();
    }

    // ── Phase 24 drift trail: teal smear when controlAuthority < 80 ──────────
    {
      const driftPoints = this.driftTrails.get(id);
      let driftGraphics = this.driftTrailGraphics.get(id);
      const authority = (beyblade as any).controlAuthority as number | undefined ?? 100;
      if (driftPoints !== undefined) {
        if (authority < 80) {
          driftPoints.push({ x: screenX, y: screenY, alpha: 0.35 });
          if (driftPoints.length > 8) driftPoints.shift();
        }
        if (!driftGraphics) {
          driftGraphics = [];
          this.driftTrailGraphics.set(id, driftGraphics);
        }
        while (driftGraphics.length < 8) {
          const dg = new PIXI.Graphics();
          this.beybladeLayer.addChildAt(dg, 0);
          driftGraphics.push(dg);
        }
        for (let i = 0; i < driftGraphics.length; i++) {
          const dg = driftGraphics[i];
          const pt = driftPoints[i];
          if (pt) {
            dg.clear();
            dg.circle(pt.x, pt.y, r * (0.25 + i * 0.06));
            dg.fill({ color: 0x00ddcc, alpha: pt.alpha * (i / 8) });
            pt.alpha *= 0.80;
          } else {
            dg.clear();
          }
        }
        while (driftPoints.length > 0 && driftPoints[0].alpha < 0.02) driftPoints.shift();
      }
    }

    // ── Motion blur: ghost trail when linear speed exceeds threshold ──────────
    {
      const SPEED_THRESHOLD = 3.5; // physics units/frame — tuned for visible fast movement
      const TRAIL_COUNT = 8;
      const speed = Math.hypot(beyblade.velocityX ?? 0, beyblade.velocityY ?? 0);
      const blurTrails = this.motionBlurTrails.get(id);
      let blurGraphics = this.motionBlurGraphics.get(id);

      if (blurTrails !== undefined) {
        if (speed > SPEED_THRESHOLD) {
          blurTrails.push({ x: screenX, y: screenY, alpha: 0.45 });
          if (blurTrails.length > TRAIL_COUNT) blurTrails.shift();
        }

        if (!blurGraphics) {
          blurGraphics = [];
          this.motionBlurGraphics.set(id, blurGraphics);
        }
        while (blurGraphics.length < TRAIL_COUNT) {
          const bg = new PIXI.Graphics();
          this.beybladeLayer.addChildAt(bg, 0);
          blurGraphics.push(bg);
        }

        const typeColor = parseBeyColor(beyblade);
        for (let i = 0; i < blurGraphics.length; i++) {
          const bg = blurGraphics[i];
          const pt = blurTrails[i];
          if (pt) {
            bg.clear();
            bg.circle(pt.x, pt.y, r * (0.9 + i * 0.04));
            bg.fill({ color: typeColor, alpha: pt.alpha * ((i + 1) / TRAIL_COUNT) * 0.65 });
            bg.circle(pt.x, pt.y, r * 0.5);
            bg.fill({ color: 0xffffff, alpha: pt.alpha * ((i + 1) / TRAIL_COUNT) * 0.25 });
            pt.alpha *= 0.80;
          } else {
            bg.clear();
          }
        }

        while (blurTrails.length > 0 && blurTrails[0].alpha < 0.02) blurTrails.shift();
      }
    }

    // 6.15 — SpinDirection change flash (counter-rotation white burst)
    // Skipped when specialMoveActive is driving the flashGraphics overlay (N4).
    if (!(beyblade as any).specialMoveActive) {
      const prev = this.prevSpinDirections.get(id);
      if (prev !== undefined && prev !== beyblade.spinDirection) {
        this.flashTimers.set(id, 6); // ~100ms at 60fps
      }
      this.prevSpinDirections.set(id, beyblade.spinDirection);

      const flashG = this.flashGraphics.get(id);
      const ft = this.flashTimers.get(id) ?? 0;
      if (flashG) {
        flashG.clear();
        if (ft > 0) {
          const flashAlpha = (ft / 6) * 0.75;
          flashG.circle(0, 0, r * 1.15);
          flashG.fill({ color: 0xffffff, alpha: flashAlpha });
          this.flashTimers.set(id, ft - 1);
        }
      }
    }

    // 6.16 — isSplit: draw partner half as a simplified mini-bey at splitBodyX/Y
    {
      if (beyblade.isSplit && beyblade.splitBodyX !== undefined && beyblade.splitBodyY !== undefined) {
        let splitG = this.splitBodySprites.get(id);
        if (!splitG) {
          splitG = new PIXI.Graphics();
          this.beybladeLayer.addChild(splitG);
          this.splitBodySprites.set(id, splitG);
        }
        const splitScale = this.physicsArenaRadius > 0 ? this.arenaRadius / this.physicsArenaRadius : 1;
        const sx = this.arenaCenterX + (beyblade.splitBodyX - this.physicsCenterX) * splitScale;
        const sy = this.arenaCenterY + (beyblade.splitBodyY - this.physicsCenterY) * splitScale;
        const sr = r * 0.65;
        const typeColor = TYPE_COLORS[beyblade.type] ?? 0xffffff;
        splitG.clear();
        splitG.x = sx;
        splitG.y = sy;
        // Outer ring
        splitG.circle(0, 0, sr);
        splitG.fill({ color: typeColor, alpha: 0.65 });
        // Inner core
        splitG.circle(0, 0, sr * 0.42);
        splitG.fill({ color: 0xffffff, alpha: 0.22 });
        // Slow spin indicator
        splitG.rotation = Date.now() / 220;
        // Spin bar above
        const bw = sr * 2;
        const spinFrac = beyblade.splitBodySpin !== undefined && beyblade.maxSpin > 0
          ? Math.min(1, beyblade.splitBodySpin / beyblade.maxSpin)
          : 0;
        splitG.rect(-bw / 2, -sr - 7, bw, 3);
        splitG.fill({ color: 0x222244 });
        splitG.rect(-bw / 2, -sr - 7, bw * spinFrac, 3);
        splitG.fill({ color: 0x4488ff, alpha: 0.8 });
      } else {
        const splitG = this.splitBodySprites.get(id);
        if (splitG) splitG.clear();
      }
    }

    // H3: apply and expire visual overrides from "combo-visual" messages
    {
      const override = this.beyVisualOverrides.get(id);
      if (override) {
        if (Date.now() >= override.expiresAt) {
          // Expired — restore defaults
          this.beyVisualOverrides.delete(id);
          sprite.tint = 0xffffff;
        } else {
          // H3: spriteUrl swap — tint the sprite distinctively as a proxy
          // (full texture swap requires async asset load; tint is the sync fallback)
          if (override.spriteUrl) {
            // Mark as externally-overridden via a reddish tint so it's visually distinct
            sprite.tint = 0xff88ff;
          }
          // H3: animationId effects (applied every frame for the duration)
          if (override.animationId === "special_intro") {
            const pulse = 1.0 + 0.15 * Math.sin(Date.now() / 80);
            sprite.scale.set(pulse, (0.85 + getBeybladeStability(beyblade) * 0.15) * pulse);
          } else if (override.animationId === "combo_flash") {
            const flash = 0.5 + 0.5 * Math.sin(Date.now() / 60);
            sprite.tint = flash > 0.5 ? 0xffffaa : 0xffffff;
          }
        }
      }
    }

    // R5: LOD — skip detail layer (bars, label) for beys >400px from screen centre.
    const screenCx = this.app.screen.width / 2;
    const screenCy = this.app.screen.height / 2;
    const screenDist = Math.hypot(screenX - screenCx, screenY - screenCy);
    const showDetail = screenDist <= 400;
    healthBar.visible = showDetail;
    spinBar.visible = showDetail;
    label.visible = showDetail;
    if (!showDetail) return;

    const barWidth = 40;
    const barHeight = 4;
    const barY = -r - 22;

    // Health and spin bars removed — HUD displays these values instead
    healthBar.clear();
    spinBar.clear();

    // Label position
    label.y = barY - 4;

    // ── Fury bar (thin gold ring below spin bar) ───────────────────────────────
    {
      const furyBar = this.furyBars.get(id);
      const furyGauge = (beyblade as any).furyGauge as number ?? 0;
      if (furyBar) {
        furyBar.clear();
        const furyFrac = Math.min(1, furyGauge / 100);
        const fbY = barY + barHeight + 2 + 3 + 2; // below spin bar
        furyBar.rect(-barWidth / 2, fbY, barWidth, 2);
        furyBar.fill({ color: 0x222200 });
        if (furyFrac > 0) {
          furyBar.rect(-barWidth / 2, fbY, barWidth * furyFrac, 2);
          const furyColor = furyGauge >= 100
            ? (0.5 + 0.5 * Math.sin(Date.now() / 120)) > 0.5 ? 0xffd700 : 0xffaa00
            : 0xaa8800;
          furyBar.fill({ color: furyColor });
        }
      }
    }

    // ── Stance arc ring (thin 1-px arc while activeStance is held) ───────────
    {
      const stanceRing = this.stanceRings.get(id);
      const activeStance = (beyblade as any).activeStance as string ?? "";
      if (stanceRing) {
        stanceRing.clear();
        if (activeStance && activeStance !== "none") {
          const stanceColor =
            activeStance === "aggressive" ? 0xff4400 :
            activeStance === "defensive"  ? 0x0088ff :
            activeStance === "stamina"    ? 0x00ff88 : 0xffffff;
          stanceRing.circle(0, 0, r * 1.55);
          stanceRing.stroke({ color: stanceColor, width: 1.5, alpha: 0.7 });
        }
      }
    }

    // ── Gimmick loaded/active ring ─────────────────────────────────────────────
    {
      const gimmickRing = this.gimmickRings.get(id);
      const gimmickLoadedMode = (beyblade as any).gimmickLoadedMode as boolean ?? false;
      if (gimmickRing) {
        gimmickRing.clear();
        const gColor = gimmickLoadedMode ? 0xffd700 : 0x3399ff;
        const pulse = 0.55 + 0.25 * Math.sin(Date.now() / 200);
        gimmickRing.circle(0, 0, r * 1.7);
        gimmickRing.stroke({ color: gColor, width: 1, alpha: pulse * 0.6 });
      }
    }

    // ── Desperation ring (red pulsing outer ring when spin < 15%) ─────────────
    {
      const desperationRing = this.desperationRings.get(id);
      const spinFracDesp = beyblade.maxSpin > 0 ? beyblade.spin / beyblade.maxSpin : 0;
      if (desperationRing) {
        desperationRing.clear();
        if (spinFracDesp < 0.15 && beyblade.isActive) {
          const despPulse = 0.5 + 0.5 * Math.sin(Date.now() / 120);
          desperationRing.circle(0, 0, r * 1.65);
          desperationRing.stroke({ color: 0xff2222, width: 2, alpha: 0.5 + despPulse * 0.5 });
        }
      }
    }

    // ── Bit-beast golden halo (behind sprite, drawn while bitBeastActive) ──────
    {
      const bitbeastHalo = this.bitbeastHalos.get(id);
      const bitBeastActive = (beyblade as any).bitBeastActive as boolean ?? false;
      if (bitbeastHalo) {
        bitbeastHalo.clear();
        if (bitBeastActive) {
          const haloPulse = 0.3 + 0.25 * Math.sin(Date.now() / 150);
          bitbeastHalo.circle(0, 0, r * 1.4);
          bitbeastHalo.fill({ color: 0xffd700, alpha: 0.18 + haloPulse * 0.10 });
          bitbeastHalo.circle(0, 0, r * 1.4);
          bitbeastHalo.stroke({ color: 0xffee55, width: 2, alpha: 0.45 + haloPulse * 0.35 });
        }
      }
    }

    // ── Fury aura ring (gold ring when furyGauge >= 100, 2.5D gets extra glow) ─
    {
      const furyRing = this.furyRings.get(id);
      const furyGaugeFull = ((beyblade as any).furyGauge as number ?? 0) >= 100;
      if (furyRing) {
        furyRing.clear();
        if (furyGaugeFull && beyblade.isActive) {
          const furyPulse = 0.5 + 0.5 * Math.sin(Date.now() / 90);
          furyRing.circle(0, 0, r * 1.85);
          furyRing.stroke({ color: 0xffd700, width: this.is25D ? 3 : 2, alpha: 0.4 + furyPulse * 0.5 });
          if (this.is25D) {
            furyRing.circle(0, 0, r * 1.95);
            furyRing.stroke({ color: 0xffee99, width: 1, alpha: 0.2 + furyPulse * 0.25 });
          }
        }
      }
    }

    // ── Status effect icon (emoji above bey, blinks when statusTimer < 1s) ─────
    {
      const statusIcon = this.statusIconTexts.get(id);
      const statusEffect = (beyblade as any).statusEffect as string ?? "";
      const statusTimer  = (beyblade as any).statusTimer  as number ?? 0;
      if (statusIcon) {
        if (statusEffect) {
          const iconMap: Record<string, string> = {
            burning:   "🔥",
            frozen:    "❄️",
            paralyzed: "⚡",
            corroded:  "☠️",
            confused:  "❓",
          };
          statusIcon.text = iconMap[statusEffect] ?? "?";
          statusIcon.y = -r - 38;
          // Blink in last second
          const shouldBlink = statusTimer < 1 && statusTimer > 0;
          statusIcon.visible = !shouldBlink || (Math.sin(Date.now() / 120) > 0);
        } else {
          statusIcon.text = "";
          statusIcon.visible = false;
        }
      }
    }
  }

  // ─── DetachedBody rendering (6.13 / 6.14) ───────────────────────────────────

  private syncDetachedBodies(gameState: ServerGameState | null) {
    const bodies = gameState?.detachedBodies;
    const seen = new Set<string>();

    if (bodies) {
      bodies.forEach((body: ServerDetachedBody, id: string) => {
        if (body.state === "removed") return;
        seen.add(id);

        let sprite = this.detachedBodySprites.get(id);
        if (!sprite) {
          sprite = new PIXI.Graphics();
          this.detachedBodyLayer.addChild(sprite);
          this.detachedBodySprites.set(id, sprite);
        }
        this.updateDetachedBodySprite(sprite, body);
      });
    }

    // Remove sprites for bodies no longer in state
    this.detachedBodySprites.forEach((g, id) => {
      if (!seen.has(id)) {
        this.detachedBodyLayer.removeChild(g);
        this.detachedBodySprites.delete(id);
      }
    });
  }

  private updateDetachedBodySprite(g: PIXI.Graphics, body: ServerDetachedBody) {
    const detScale = this.physicsArenaRadius > 0 ? this.arenaRadius / this.physicsArenaRadius : 1;
    g.x = this.arenaCenterX + (body.x - this.physicsCenterX) * detScale;
    g.y = this.arenaCenterY + (body.y - this.physicsCenterY) * detScale;
    g.clear();

    const r = Math.max(3, body.radius);
    const isObstacle = body.state === "obstacle";
    const wobble = isObstacle ? 0.65 + 0.35 * Math.sin(Date.now() / 180) : 1;

    if (body.bodyType === "fragment") {
      // Small grey dot — Draciel F escaped ball etc.
      g.circle(0, 0, Math.max(2, r * 0.35));
      g.fill({ color: 0x888888, alpha: isObstacle ? 0.4 : 0.75 });

    } else if (body.bodyType === "projectile") {
      // Medium glowing ring — Revive Phoenix armor etc.
      const alpha = (isObstacle ? 0.35 : 0.8) * wobble;
      g.circle(0, 0, r);
      g.fill({ color: 0xff8800, alpha: alpha * 0.25 });
      g.circle(0, 0, r);
      g.stroke({ color: 0xffbb44, width: 2, alpha });
      g.rotation = Date.now() / 400;

    } else {
      // mini_bey — Vanguard Bullet, Phantom Fox MS partner half etc.
      const spinFraction = body.maxSpin > 0 ? body.spin / body.maxSpin : 0;
      const alpha = (isObstacle ? 0.4 : 0.85) * wobble;
      // Outer ring
      g.circle(0, 0, r);
      g.fill({ color: 0x88aaff, alpha: alpha * 0.8 });
      // Inner core
      g.circle(0, 0, r * 0.45);
      g.fill({ color: 0xffffff, alpha: alpha * 0.25 });
      // Spin indicator line
      g.moveTo(0, 0);
      g.lineTo(r, 0);
      g.stroke({ color: 0xffffff, width: 1.5, alpha: alpha * 0.7 });
      // Rotate proportional to remaining spin
      g.rotation = (Date.now() / 120) * spinFraction;
      // Mini spin bar above
      const bw = r * 2;
      g.rect(-bw / 2, -r - 7, bw, 3);
      g.fill({ color: 0x222244 });
      g.rect(-bw / 2, -r - 7, bw * spinFraction, 3);
      g.fill({ color: 0x4488ff, alpha });
    }
  }

  // ─── F4: Combination-lock link lines ─────────────────────────────────────────

  private renderLinkLines(beys: Map<string, ServerBeyblade>): void {
    if (!this.linkLineGraphics) {
      this.linkLineGraphics = new PIXI.Graphics();
      this.featureLayer.addChild(this.linkLineGraphics);
    }
    this.linkLineGraphics.clear();

    const physScale = this.physicsArenaRadius > 0 ? this.arenaRadius / this.physicsArenaRadius : 1;
    const drawn = new Set<string>();

    for (const [id, bey] of beys) {
      const partnerId = (bey as any).linkedBeyId as string | undefined;
      if (!partnerId || drawn.has(id + partnerId) || drawn.has(partnerId + id)) continue;
      const partner = beys.get(partnerId);
      if (!partner) continue;

      drawn.add(id + partnerId);

      const locked: boolean = (bey as any).combinationLocked ?? false;
      const strain: number = (bey as any).linkStrain ?? 0;

      let color: number;
      let width: number;
      let alpha: number;

      if (strain > 0.8) {
        // Near-breaking: pulsing red
        color = 0xff2222;
        width = 1;
        alpha = 0.5 + 0.5 * Math.sin(Date.now() / 80);
      } else if (locked) {
        // Locked: thick gold
        color = 0xffd700;
        width = 3;
        alpha = 0.9;
      } else {
        // Unlocked: thin silver
        color = 0xc0c0c0;
        width = 1;
        alpha = 0.6;
      }

      // Convert physics coords to world-space (same coord system as beybladeLayer, before arenaRotationRoot).
      // featureLayer is inside arenaRotationRoot; use arenaCenterX/Y as world origin.
      const ax = this.arenaCenterX + (bey.x - this.physicsCenterX) * physScale;
      const ay = this.arenaCenterY + (bey.y - this.physicsCenterY) * physScale;
      const bx = this.arenaCenterX + (partner.x - this.physicsCenterX) * physScale;
      const by = this.arenaCenterY + (partner.y - this.physicsCenterY) * physScale;

      this.linkLineGraphics.moveTo(ax, ay);
      this.linkLineGraphics.lineTo(bx, by);
      this.linkLineGraphics.stroke({ color, width, alpha });
    }
  }

  // ─── G4: Meteor strike landing zone ring ──────────────────────────────────────

  /**
   * Public: called by the game page when a "meteor-strike-hang" server message arrives.
   * Stores the landing zone state so renderMeteorLandingZone() can draw it each frame.
   */
  public onMeteorStrikeHang(data: { landingX: number; landingY: number; landingRadius: number; hangTicks: number }): void {
    this.meteorLandingZone = {
      x: data.landingX,
      y: data.landingY,
      radius: data.landingRadius * 24, // cm to px (1cm = 24px per CLAUDE.md)
      expiresAt: Date.now() + (data.hangTicks * 1000 / 60),
    };
  }

  /**
   * Public (D3): called when "special-move-camera" arrives. Tweens a zoom-in then
   * zoom-out on the stage scale for the configured duration.
   */
  public handleSpecialMoveCamera(data: { beyId: string; cameraConfig: { zoomFactor: number; durationTicks: number; slowMotionFactor: number } }): void {
    const { zoomFactor, durationTicks } = data.cameraConfig;
    if (zoomFactor <= 1) return; // nothing to animate

    const durationMs = Math.round(durationTicks * (1000 / 60));
    const halfMs = durationMs / 2;
    const baseScale = this.world.scale;
    const peakScale = Math.min(baseScale * zoomFactor, this.world.limits.maxZoom);
    const startTime = Date.now();

    const tween = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= durationMs) {
        this.world.setScale(baseScale);
        return;
      }
      // Ease in for first half, ease out for second half.
      const t = elapsed < halfMs
        ? elapsed / halfMs                  // 0 → 1 (zoom in)
        : 1 - (elapsed - halfMs) / halfMs; // 1 → 0 (zoom out)
      this.world.setScale(baseScale + (peakScale - baseScale) * t);
      requestAnimationFrame(tween);
    };
    requestAnimationFrame(tween);
  }

  /**
   * Public (G5): called when "meteor-strike-land" arrives. Triggers a camera shake
   * and clears the landing zone ring immediately.
   */
  public onMeteorStrikeLand(data: { beyId: string; landingX: number; landingY: number; landingRadius: number; damageDealt: number }): void {
    // Clear the pending landing zone ring now that impact has occurred.
    this.meteorLandingGraphics?.clear();
    this.meteorLandingZone = null;

    // Camera shake: briefly jitter the stage position then restore.
    const origX = this.app.stage.x;
    const origY = this.app.stage.y;
    const shakeMs = 400;
    const magnitude = Math.min(20, 8 + data.damageDealt / 50);
    const startTime = Date.now();
    const shake = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= shakeMs) {
        this.app.stage.x = origX;
        this.app.stage.y = origY;
        return;
      }
      const decay = 1 - elapsed / shakeMs;
      this.app.stage.x = origX + (Math.random() - 0.5) * magnitude * 2 * decay;
      this.app.stage.y = origY + (Math.random() - 0.5) * magnitude * 2 * decay;
      requestAnimationFrame(shake);
    };
    requestAnimationFrame(shake);
  }

  /**
   * Public (N3): called when "arena-spawn" arrives. No-op stub — visual handling
   * (e.g. spawn flash) can be added here; the schema-synced bey will appear via
   * the normal render() path once the server adds it to state.beyblades.
   */
  public onArenaSpawn(_data: { spawnId: string; beyId: string; controlMode: string; statsMultiplier: number; position: { x: number; y: number } }): void {
    // Intentional no-op: the beyblade will appear automatically through state sync.
    // Subclasses or future updates may add a spawn-flash particle burst here.
  }

  /**
   * Public (N3): called when "movement-jump-hang" arrives. Hides the bey's
   * container for the specified number of ticks then restores it.
   */
  public onMovementJumpHang(data: { beyId: string; hangTicks: number }): void {
    const container = this.beybladeContainers.get(data.beyId);
    if (!container) return;
    container.visible = false;
    const restoreMs = Math.round(data.hangTicks * (1000 / 60));
    setTimeout(() => {
      const c = this.beybladeContainers.get(data.beyId);
      if (c) c.visible = true;
    }, restoreMs);
  }

  // ── Overhaul: New event handler stubs ─────────────────────────────────────────

  /** Called when a tier-3 clash timing window opens (show shrinking ring). */
  public onClashTimingStart(data: { id1: string; id2: string; windowMs: number }): void {
    for (const beyId of [data.id1, data.id2]) {
      const container = this.beybladeContainers.get(beyId);
      if (!container) continue;
      const ring = new PIXI.Graphics();
      const beySprite = container.children[0] as PIXI.Sprite | undefined;
      const radius = (beySprite?.width ?? 32) * 0.8;
      container.addChild(ring);
      const startMs = performance.now();
      const animate = () => {
        const elapsed = performance.now() - startMs;
        const frac = Math.max(0, 1 - elapsed / data.windowMs);
        ring.clear();
        if (frac > 0) {
          ring.circle(0, 0, radius * (1 + frac));
          ring.stroke({ color: 0xffffff, alpha: 0.5 * frac, width: 2 });
          requestAnimationFrame(animate);
        } else {
          container.removeChild(ring);
          ring.destroy();
        }
      };
      requestAnimationFrame(animate);
    }
  }

  /** Called when a clash timing result arrives (show "Perfect!" text). */
  public onClashTimingResult(data: { id1: string; id2: string; p1Perfect: boolean; p2Perfect: boolean }): void {
    const entries: Array<{ beyId: string; perfect: boolean }> = [
      { beyId: data.id1, perfect: data.p1Perfect },
      { beyId: data.id2, perfect: data.p2Perfect },
    ];
    for (const { beyId, perfect } of entries) {
      if (!perfect) continue;
      const container = this.beybladeContainers.get(beyId);
      if (!container) continue;
      const text = new PIXI.Text({ text: "Perfect!", style: { fontSize: 14, fill: 0xffd700, fontWeight: "bold", dropShadow: { color: 0x000000, blur: 3, distance: 1 } } });
      text.anchor.set(0.5, 1);
      text.y = -36;
      this.particleLayer.addChild(text);
      text.x = container.x;
      text.y = container.y - 36;
      text.scale.set(0.1);
      const startMs = performance.now();
      const dur = 600;
      const animate = () => {
        const elapsed = performance.now() - startMs;
        const frac = Math.min(1, elapsed / dur);
        text.scale.set(0.1 + 0.9 * frac);
        text.alpha = frac < 0.7 ? 1 : 1 - (frac - 0.7) / 0.3;
        if (elapsed < dur) requestAnimationFrame(animate);
        else { this.particleLayer.removeChild(text); text.destroy(); }
      };
      requestAnimationFrame(animate);
    }
  }

  /** Called when a status condition is applied to a bey. */
  public onStatusApplied(data: { beyId: string; status: string; durationS: number }): void {
    const container = this.beybladeContainers.get(data.beyId);
    if (!container) return;
    const ICONS: Record<string, string> = {
      burning: "🔥", frozen: "❄️", paralyzed: "⚡", corroded: "☠️", confused: "❓",
    };
    const icon = ICONS[data.status] ?? "❓";
    // Store on container so updateBey() can refresh it
    (container as any).__statusIcon?.destroy();
    const text = new PIXI.Text({ text: icon, style: { fontSize: 10 } });
    text.anchor.set(0.5, 1);
    text.x = 0;
    text.y = -36;
    container.addChild(text);
    (container as any).__statusIcon = text;
    (container as any).__statusEnd = performance.now() + data.durationS * 1000;
  }

  /** Called when fury gauge reaches 100 — pulse gold bar (HUD handles the bar; renderer can add VFX). */
  public onFuryReady(_data: { beyId: string }): void {
    // HUD bar pulses via React state; renderer can optionally add a glow
  }

  /** Called when fury is released — type-specific VFX flash. */
  public onFuryReleased(data: { beyId: string; type: string }): void {
    const container = this.beybladeContainers.get(data.beyId);
    if (!container) return;
    const COLOR_BY_TYPE: Record<string, number> = {
      attack: 0xff4400, defense: 0x0088ff, stamina: 0x00ff88, balanced: 0xffd700,
    };
    const color = COLOR_BY_TYPE[data.type] ?? 0xffd700;
    const flash = new PIXI.Graphics();
    flash.circle(0, 0, 40);
    flash.fill({ color, alpha: 0.6 });
    this.beybladeLayer.addChild(flash);
    flash.x = container.x;
    flash.y = container.y;
    const startMs = performance.now();
    const animate = () => {
      const frac = Math.min(1, (performance.now() - startMs) / 300);
      flash.alpha = 0.6 * (1 - frac);
      flash.scale.set(1 + frac);
      if (frac < 1) requestAnimationFrame(animate);
      else { this.beybladeLayer.removeChild(flash); flash.destroy(); }
    };
    requestAnimationFrame(animate);
  }

  /** Called when gimmick mode toggles (blue = active, gold = loaded). */
  public onGimmickModeChanged(data: { beyId: string; loaded: boolean }): void {
    const container = this.beybladeContainers.get(data.beyId);
    if (!container) return;
    (container as any).__gimmickMode = data.loaded ? "loaded" : "active";
  }

  /** Called when a bey drops below 15% spin (desperation). */
  public onDesperationActive(_data: { beyId: string }): void {
    // Visual ring is drawn in updateBey() via statusEffect / spin fraction
  }

  /** Called when bit-beast special expires. */
  public onBitBeastHide(_data: { beyId: string }): void {
    // Halo is drawn while bitBeastActive in updateBey()
  }

  /** Called when a bey accessory procs (e.g. spin_sash). */
  public onAccessoryActivated(data: { beyId: string; accessoryId: string }): void {
    const container = this.beybladeContainers.get(data.beyId);
    if (!container) return;
    // Brief gold shimmer flash
    const flash = new PIXI.Graphics();
    flash.circle(0, 0, 32);
    flash.fill({ color: 0xffd700, alpha: 0.7 });
    this.beybladeLayer.addChild(flash);
    flash.x = container.x;
    flash.y = container.y;
    const startMs = performance.now();
    const animate = () => {
      const frac = Math.min(1, (performance.now() - startMs) / 250);
      flash.alpha = 0.7 * (1 - frac);
      if (frac < 1) requestAnimationFrame(animate);
      else { this.beybladeLayer.removeChild(flash); flash.destroy(); }
    };
    requestAnimationFrame(animate);
    void data.accessoryId;
  }

  /**
   * Briefly jitters arenaTiltInner ±magnitude px then restores it — screen shake
   * that does not warp sprite positions relative to each other.
   * durationMs defaults to 200ms (plan spec).
   */
  public triggerScreenShake(magnitude = 4, durationMs = 200): void {
    if (!this.arenaTiltInner) return;
    const origX = this.arenaTiltInner.x;
    const origY = this.arenaTiltInner.y;
    const startTime = performance.now();
    const shake = () => {
      const elapsed = performance.now() - startTime;
      if (elapsed >= durationMs) {
        this.arenaTiltInner.x = origX;
        this.arenaTiltInner.y = origY;
        return;
      }
      const decay = 1 - elapsed / durationMs;
      this.arenaTiltInner.x = origX + (Math.random() - 0.5) * magnitude * 2 * decay;
      this.arenaTiltInner.y = origY + (Math.random() - 0.5) * magnitude * 2 * decay;
      requestAnimationFrame(shake);
    };
    requestAnimationFrame(shake);
  }

  /** Named-intensity convenience wrapper for triggerScreenShake.
   *  Maps semantic hit types to (magnitude, duration) pairs derived from game-feel research. */
  public triggerImpactShake(type: "light" | "heavy" | "burst" | "ring-out"): void {
    const params: Record<typeof type, [number, number]> = {
      "light":    [2,  120],
      "heavy":    [6,  220],
      "burst":    [12, 350],
      "ring-out": [8,  280],
    };
    const [mag, dur] = params[type];
    this.triggerScreenShake(mag, dur);
  }

  private _vignetteOverlay: PIXI.Graphics | null = null;
  private _vignetteIntensity = 0;
  private _vignetteAnimFrame = 0;
  private _vignetteStartTime = 0;

  /** Sets an animated red vignette at screen edges — used for low-spin warning.
   *  intensity 0 removes the effect; 1 = full danger red.  Pulses at 1.5s cycle. */
  public setVignetteIntensity(intensity: number): void {
    this._vignetteIntensity = Math.min(1, Math.max(0, intensity));
    if (!this._vignetteOverlay) {
      const g = new PIXI.Graphics();
      this.app.stage.addChild(g);
      this._vignetteOverlay = g;
      this._vignetteStartTime = performance.now();
      const animate = () => {
        this._vignetteAnimFrame = requestAnimationFrame(animate);
        this._drawVignette();
      };
      animate();
    }
    if (this._vignetteIntensity <= 0 && this._vignetteOverlay) {
      cancelAnimationFrame(this._vignetteAnimFrame);
      this._vignetteOverlay.clear();
    }
  }

  private _drawVignette(): void {
    const g = this._vignetteOverlay;
    if (!g || this._vignetteIntensity <= 0) return;
    const W = this.app.screen.width;
    const H = this.app.screen.height;
    const t = (performance.now() - this._vignetteStartTime) / 1000;
    const pulse = 0.5 + 0.5 * Math.sin((t / 1.5) * 2 * Math.PI);
    const alpha = this._vignetteIntensity * pulse * 0.35;
    g.clear();
    // Four edge rectangles tinted red
    g.fill({ color: 0xff2222, alpha });
    g.rect(0, 0, W, H * 0.15);         // top
    g.rect(0, H * 0.85, W, H * 0.15);  // bottom
    g.rect(0, 0, W * 0.08, H);         // left
    g.rect(W * 0.92, 0, W * 0.08, H);  // right
    g.fill();
  }

  /**
   * Flashes a bey sprite white for 80ms — gives clear visual hit feedback.
   */
  public triggerHitFlash(beyId: string): void {
    const sprite = this.beybladeSprites.get(beyId);
    if (!sprite) return;
    const origTint = (sprite.tint as unknown as number) ?? 0xffffff;
    sprite.tint = 0xffffff as unknown as PIXI.ColorSource;
    setTimeout(() => {
      const s = this.beybladeSprites.get(beyId);
      if (s) s.tint = origTint as unknown as PIXI.ColorSource;
    }, 80);
  }

  private renderMeteorLandingZone(): void {
    if (!this.meteorLandingZone) return;

    if (Date.now() > this.meteorLandingZone.expiresAt) {
      this.meteorLandingGraphics?.clear();
      this.meteorLandingZone = null;
      return;
    }

    if (!this.meteorLandingGraphics) {
      this.meteorLandingGraphics = new PIXI.Graphics();
      this.particleLayer.addChild(this.meteorLandingGraphics);
    }

    const { x, y, radius } = this.meteorLandingZone;
    const physScale = this.physicsArenaRadius > 0 ? this.arenaRadius / this.physicsArenaRadius : 1;
    const sx = this.arenaCenterX + (x - this.physicsCenterX) * physScale;
    const sy = this.arenaCenterY + (y - this.physicsCenterY) * physScale;
    const sRadius = radius * physScale;

    const pulse = 0.5 + 0.5 * Math.sin(Date.now() / 150);
    this.meteorLandingGraphics.clear();
    this.meteorLandingGraphics.circle(sx, sy, sRadius * (0.9 + 0.1 * pulse));
    this.meteorLandingGraphics.stroke({ color: 0xff4400, width: 2, alpha: 0.4 + 0.5 * pulse });
  }

  // ─── N4: Combo visual flash ────────────────────────────────────────────────────

  /**
   * Public: called by the game page when a "combo-visual" server message arrives.
   * Populates beyVisualOverrides for the target bey; the per-bey render loop applies
   * and expires these each frame.
   * H4: if keepVisualAppearance is true, only the animationId is stored (no spriteUrl swap).
   */
  public handleComboVisual(data: { beyId: string; introAnimation?: string; particlePresetId?: string; spriteUrl?: string; animationId?: string; keepVisualAppearance?: boolean; durationMs?: number }): void {
    const beyContainer = this.beybladeContainers.get(data.beyId);
    if (!beyContainer) return;

    const durationMs = data.durationMs ?? 400;
    const expiresAt = Date.now() + durationMs;

    // H3/H4: store visual override — skip spriteUrl if keepVisualAppearance is set
    const animationId = data.animationId ?? data.introAnimation;
    this.beyVisualOverrides.set(data.beyId, {
      spriteUrl: data.keepVisualAppearance ? undefined : data.spriteUrl,
      animationId,
      expiresAt,
    });

    // Tint flash on the sprite (first child — the PIXI.Graphics beyblade shape)
    // Only apply tint if NOT keeping visual appearance with a sprite swap.
    if (!data.spriteUrl || data.keepVisualAppearance) {
      const sprite = beyContainer.children.length > 0
        ? (beyContainer.getChildAt(0) as PIXI.Graphics | null)
        : null;
      if (sprite && "tint" in sprite) {
        (sprite as unknown as { tint: number }).tint = 0xffffaa;
        setTimeout(() => {
          if (!this.beyVisualOverrides.has(data.beyId)) {
            (sprite as unknown as { tint: number }).tint = 0xffffff;
          }
        }, 200);
      }
    }

    // Trigger intro animation if named — scale pulse for "special_intro", color flash for "combo_flash"
    if (animationId === "special_intro") {
      const origScale = beyContainer.scale.x;
      beyContainer.scale.set(origScale * 1.5);
      setTimeout(() => beyContainer.scale.set(origScale), 350);
    } else if (animationId === "combo_flash") {
      const origScale = beyContainer.scale.x;
      beyContainer.scale.set(origScale * 1.3);
      setTimeout(() => beyContainer.scale.set(origScale), 200);
    } else if (animationId) {
      // Generic named animation fallback — scale pulse
      const origScale = beyContainer.scale.x;
      beyContainer.scale.set(origScale * 1.3);
      setTimeout(() => beyContainer.scale.set(origScale), 300);
    }
  }

  // ─── Particle effects ────────────────────────────────────────────────────────

  // R2: Create a tinted Sprite backed by the shared dot RT (enables batch rendering).
  private makeDotSprite(color: number, scale = 1): PIXI.Sprite {
    const spr = new PIXI.Sprite(this._particleDotTexture ?? PIXI.Texture.WHITE);
    spr.anchor.set(0.5);
    spr.tint = color;
    spr.scale.set(scale);
    return spr;
  }

  spawnCollisionParticles(x: number, y: number, color1: number = 0xffffff, color2: number = 0xffffff) {
    const count = 20;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.3;
      const speed = 2 + Math.random() * 4;
      const color = i % 2 === 0 ? color1 : color2;
      const g = this.makeDotSprite(color, 0.5 + Math.random() * 0.5);
      g.x = x;
      g.y = y;
      this.particleLayer.addChild(g);

      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 0.3 + Math.random() * 0.4,
        color,
        sprite: g,
      });
    }
  }

  spawnSpinOutParticles(x: number, y: number, color: number) {
    const count = 30;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = 1 + Math.random() * 3;
      const g = this.makeDotSprite(color, 0.75);
      g.x = x;
      g.y = y;
      this.particleLayer.addChild(g);

      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        life: 0,
        maxLife: 0.6 + Math.random() * 0.4,
        color,
        sprite: g,
      });
    }
  }

  spawnBurstParticles(x: number, y: number) {
    const COLORS = [0xffffff, 0xffdd44, 0xff8800, 0xff3300];
    const count = 50;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.3;
      const speed = 2 + Math.random() * 6;
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const size = 2 + Math.random() * 4;
      const g = this.makeDotSprite(color, size / 2);
      g.x = x;
      g.y = y;
      this.particleLayer.addChild(g);
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 0.5 + Math.random() * 0.6,
        color,
        sprite: g,
      });
    }
    // Central flash ring
    const flash = new PIXI.Graphics();
    flash.circle(0, 0, 35);
    flash.stroke({ color: 0xffffff, width: 4, alpha: 0.9 });
    flash.x = x;
    flash.y = y;
    this.particleLayer.addChild(flash);
    this.particles.push({
      x, y,
      vx: 0, vy: 0,
      life: 0,
      maxLife: 0.35,
      color: 0xffffff,
      sprite: flash,
    });
  }

  spawnDamageNumber(x: number, y: number, damage: number, color: number = 0xff4444) {
    if (damage <= 0) return;
    const text = new PIXI.Text({
      text: `-${Math.round(damage)}`,
      style: {
        fontSize: 18,
        fontWeight: "bold",
        fill: color,
        fontFamily: "monospace",
        stroke: { color: 0x000000, width: 3 },
        dropShadow: { alpha: 0.85, angle: 0, blur: 4, distance: 0, color: 0x000000 },
      },
    });
    text.anchor.set(0.5, 1);
    text.x = x + (Math.random() - 0.5) * 8;  // small horizontal jitter so stacks don't overlap
    text.y = y;
    this.particleLayer.addChild(text);

    this.particles.push({
      x: text.x, y,
      vx: (Math.random() - 0.5) * 0.8,
      vy: -3.0 - Math.random() * 0.6,
      life: 0,
      maxLife: 1.5 + Math.random() * 0.3,
      color,
      sprite: text,
    });
  }

  playSpecialMoveEffect(_playerId: string, type: string, physX: number, physY: number, facing: number) {
    const screenCoords = this.physicsToScreen(physX, physY);
    const x = screenCoords.x;
    const y = screenCoords.y;

    const animTypes: Record<string, { particleColor: number; count: number; duration: number }> = {
      "stampede-rush": { particleColor: 0xff6600, count: 14, duration: 0.5 },
      "gyro-anchor": { particleColor: 0x4488ff, count: 8, duration: 0.8 },
      "spin-recovery": { particleColor: 0x44ff88, count: 10, duration: 1.0 },
      "tactical-burst": { particleColor: 0xffff00, count: 12, duration: 0.3 },
    };

    const config = animTypes[type] || { particleColor: 0xffffff, count: 12, duration: 0.5 };

    // Burst particles in facing direction (or all directions for anchor)
    for (let i = 0; i < config.count; i++) {
      let angle: number;
      if (type === "gyro-anchor") {
        angle = (Math.PI * 2 * i) / config.count; // Expand outward
      } else if (type === "spin-recovery") {
        angle = (Math.PI * 2 * i) / config.count + facing; // Spiral in rotation
      } else {
        angle = facing + (Math.random() - 0.5) * (Math.PI / 3); // Cone forward
      }

      const speed = 3 + Math.random() * 2;
      const g = new PIXI.Graphics();
      g.circle(0, 0, 2 + Math.random() * 2);
      g.fill({ color: config.particleColor });
      g.x = x;
      g.y = y;
      this.particleLayer.addChild(g);

      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: config.duration,
        color: config.particleColor,
        sprite: g,
      });
    }

    // Invuln ring visual for gyro-anchor
    if (type === "gyro-anchor") {
      const ring = new PIXI.Graphics();
      ring.circle(0, 0, 40);
      ring.stroke({ color: 0x4488ff, width: 3, alpha: 0.6 });
      ring.x = x;
      ring.y = y;
      this.particleLayer.addChild(ring);

      this.particles.push({
        x, y,
        vx: 0,
        vy: 0,
        life: 0,
        maxLife: 1.5,
        color: 0x4488ff,
        sprite: ring,
      });
    }
  }

  playComboEffect(playerId: string, comboName: string) {
    const beyblade = this.beybladeSprites.get(playerId);
    if (!beyblade) return;

    const x = beyblade.x;
    const y = beyblade.y;

    // Screen shake for aerial_smash combo
    if (comboName === "aerial_smash") {
      const originalX = this.beybladeLayer.x;
      const originalY = this.beybladeLayer.y;
      const shakeIntensity = 4;
      let shakeCount = 0;
      const shakeInterval = setInterval(() => {
        this.beybladeLayer.x = originalX + (Math.random() - 0.5) * shakeIntensity;
        this.beybladeLayer.y = originalY + (Math.random() - 0.5) * shakeIntensity;
        shakeCount++;
        if (shakeCount > 4) {
          this.beybladeLayer.x = originalX;
          this.beybladeLayer.y = originalY;
          clearInterval(shakeInterval);
        }
      }, 25);
    }

    // COMBO! text floats up and fades
    const text = new PIXI.Text({
      text: "COMBO!",
      style: {
        fontSize: 32,
        fontWeight: "bold",
        fill: 0x00ff88,
        fontFamily: "monospace",
        dropShadow: { alpha: 0.9, angle: 0, blur: 8, distance: 0, color: 0x000000 },
      },
    });
    text.anchor.set(0.5, 0.5);
    text.x = x;
    text.y = y;
    this.particleLayer.addChild(text);

    this.particles.push({
      x, y,
      vx: 0,
      vy: -2,
      life: 0,
      maxLife: 1.2,
      color: 0x00ff88,
      sprite: text,
    });
  }

  private updateParticles(ticker: PIXI.Ticker) {
    const dt = ticker.deltaMS / 1000;
    this.particles = this.particles.filter((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.1; // gravity
      p.life += dt;

      const progress = p.life / p.maxLife;
      p.sprite.x = p.x;
      p.sprite.y = p.y;
      p.sprite.alpha = 1 - progress;
      p.sprite.scale.set(1 - progress * 0.5);

      if (p.life >= p.maxLife) {
        this.particleLayer.removeChild(p.sprite);
        return false;
      }
      return true;
    });
  }

  // ─── Lifecycle ───────────────────────────────────────────────────────────────

  resize() {
    if (this.initialized) {
      this.app.resize();
      // Update screen dimensions — do NOT rebuild the arena.
      // The viewport window into the world changes size; the arena and all
      // world objects stay at their current positions (warp-free camera).
      this.world.setScreen(this.app.screen.width, this.app.screen.height);
      if (this.arenaRadius > 0) {
        // Recompute zoom limits for the new viewport without a full rebuild.
        this.world.computeZoomLimits(2.5);
      }
      // Screen-space overlay graphics must be regenerated to fit new canvas.
      this.darknessOverlay = null;
      this.fogOverlay = null;
      this.arenaEffectOverlay = null;
    }
  }

  // ─── AA8: handleArenaEffect + renderArenaEffectOverlay ──────────────────────

  /**
   * AA8: Called by useColyseus when "arena-effect-start" / "arena-effect-end"
   * messages arrive.  Drives a screen-space overlay that fades in over 500 ms
   * and is drawn every frame by renderArenaEffectOverlay().
   */
  public handleArenaEffect(phase: "start" | "end", effectType: string, durationTicks: number): void {
    // #13: arena effects can change floor appearance — mark dirty for rebake
    this.arenaFloorDirty = true;
    if (phase === "end") {
      this.activeArenaEffect = null;
      this.arenaEffectOverlay?.clear();
      return;
    }
    this.activeArenaEffect = {
      type: effectType,
      startedAt: Date.now(),
      durationMs: (durationTicks / 60) * 1000,
    };
    if (!this.arenaEffectOverlay) {
      this.arenaEffectOverlay = new PIXI.Graphics();
      this.arenaEffectOverlay.eventMode = "none";
      this.app.stage.addChild(this.arenaEffectOverlay); // top layer
    }
  }

  private renderArenaEffectOverlay(): void {
    if (!this.activeArenaEffect || !this.arenaEffectOverlay) return;
    const elapsed = Date.now() - this.activeArenaEffect.startedAt;
    if (elapsed > this.activeArenaEffect.durationMs) {
      this.activeArenaEffect = null;
      this.arenaEffectOverlay.clear();
      return;
    }
    const fade = Math.min(1, elapsed / 500); // 500 ms fade-in
    this.arenaEffectOverlay.clear();

    const w = this.app.screen.width;
    const h = this.app.screen.height;

    switch (this.activeArenaEffect.type) {
      case "darkness":
        this.arenaEffectOverlay.rect(0, 0, w, h).fill({ color: 0x000000, alpha: 0.85 * fade });
        break;
      case "fog_of_war":
        this.arenaEffectOverlay.rect(0, 0, w, h).fill({ color: 0x888888, alpha: 0.5 * fade });
        break;
      case "freeze_all": {
        // Brief blue flash that fades out over 800 ms
        const flashFade = Math.max(0, 1 - elapsed / 800);
        this.arenaEffectOverlay.rect(0, 0, w, h).fill({ color: 0x4488ff, alpha: 0.35 * flashFade });
        break;
      }
      case "reverse_controls":
        // Subtle purple tint for the full duration
        this.arenaEffectOverlay.rect(0, 0, w, h).fill({ color: 0x8800ff, alpha: 0.15 * fade });
        break;
    }
  }

  /**
   * Phase AA — apply or clear a full-arena visual effect.
   * Called by the game page whenever useColyseus reports an arenaEffect change.
   */
  applyArenaEffect(effectType: string | null): void {
    if (!this.initialized) return;

    // Clear all overlays first
    if (this.darknessOverlay) this.darknessOverlay.visible = false;
    if (this.fogOverlay) this.fogOverlay.visible = false;

    if (!effectType) return;

    const w = this.app.screen.width;
    const h = this.app.screen.height;

    if (effectType === "darkness") {
      if (this.darknessOverlay) {
        this.darknessOverlay.clear();
        this.darknessOverlay.rect(0, 0, w, h).fill({ color: 0x000000, alpha: 0.85 });
        this.darknessOverlay.visible = true;
      }
    } else if (effectType === "fog_of_war") {
      if (this.fogOverlay) {
        this.fogOverlay.clear();
        // Radial fog: transparent center, opaque edge
        const cx = w / 2; const cy = h / 2;
        const r = Math.max(w, h) * 0.4;
        for (let i = 0; i < 8; i++) {
          const alpha = (i / 8) * 0.7;
          const ri = r * (1 - i / 8);
          this.fogOverlay.circle(cx, cy, r - ri + r * 0.1).fill({ color: 0x334455, alpha });
        }
        this.fogOverlay.rect(0, 0, w, h).fill({ color: 0x1a2233, alpha: 0.35 });
        this.fogOverlay.visible = true;
      }
    } else if (effectType === "freeze_all") {
      // Freeze: brief blue flash pulse — set a timer, render handles the fade
      this.freezeFlashTimer = 600; // ms
      if (this.darknessOverlay) {
        this.darknessOverlay.clear();
        this.darknessOverlay.rect(0, 0, w, h).fill({ color: 0x88ccff, alpha: 0.4 });
        this.darknessOverlay.visible = true;
      }
    }
  }

  /** Called each render frame to tick transient arena-effect visuals. */
  private tickArenaEffectOverlays(dtMs: number): void {
    // Advance safe zone pulse timer (wraps at 1.0 = one full second)
    this.safeZonePulseTimer = (this.safeZonePulseTimer + dtMs / 1000) % 1.0;

    if (this.freezeFlashTimer > 0) {
      this.freezeFlashTimer = Math.max(0, this.freezeFlashTimer - dtMs);
      if (this.darknessOverlay) {
        const progress = this.freezeFlashTimer / 600;
        const alpha = progress * 0.4;
        const w = this.app.screen.width; const h = this.app.screen.height;
        this.darknessOverlay.clear();
        if (alpha > 0.005) {
          this.darknessOverlay.rect(0, 0, w, h).fill({ color: 0x88ccff, alpha });
        }
        this.darknessOverlay.visible = alpha > 0.005;
      }
    }
  }

  destroy() {
    if (!this.initialized) return;
    // Mark uninitialized FIRST so any concurrent render() calls return early
    // before this.app.screen (which reads this._renderer) is accessed.
    this.initialized = false;
    this.contextLost = false;

    // Stop the ticker explicitly before destroy so any pending rAF callbacks
    // that are already queued in the browser event loop see a stopped ticker
    // and do not try to access this._renderer after it is nulled by app.destroy().
    try { this.app.ticker.stop(); } catch { /* already destroyed */ }

    if (this.featureRenderer) {
      this.featureRenderer.destroy();
      this.featureRenderer = null;
    }

    this.darknessOverlay = null;
    this.fogOverlay = null;
    this.arenaEffectOverlay = null;
    this.activeArenaEffect = null;
    this.shrinkRingGraphics = null;
    this.linkLineGraphics = null;
    this.meteorLandingGraphics = null;
    this.meteorLandingZone = null;
    this.interpolator.clear();

    // Explicitly destroy GPU-allocated textures that are not in the scene graph
    // and therefore not cleaned up by app.destroy({ children: true }).
    if (this.arenaFloorRT) {
      try { this.arenaFloorRT.destroy(true); } catch { /* ignore */ }
      this.arenaFloorRT = null;
    }
    if (this._particleDotTexture) {
      try { this._particleDotTexture.destroy(true); } catch { /* ignore */ }
      this._particleDotTexture = null;
    }

    // PixiJS calls gl.getExtension('WEBGL_lose_context').loseContext() inside its
    // own destroy(), which fires an async contextlost event.  That event can arrive
    // while a *new* PixiJS app is already rendering (e.g. React 19 Strict Mode
    // mounts → unmounts → remounts) and triggers the "refId not found" UBO spam on
    // the new instance.  Nulling out the extension before destroy() prevents the
    // explicit loseContext() call; the GPU context is still released when the canvas
    // is garbage-collected, just without the disruptive event.
    try {
      const renderer = (this.app as unknown as { renderer?: { context?: { gl?: WebGLRenderingContext } } }).renderer;
      const gl = renderer?.context?.gl;
      if (gl) gl.getExtension = () => null;
    } catch {
      // ignore — best-effort only
    }

    this.app.destroy(true, { children: true });
  }
}

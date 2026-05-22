// [GAME-CLIENT] PixiRenderer — WebGL game renderer using PixiJS.
// Replaces the old HTML5 Canvas 2D renderer with hardware-accelerated WebGL.
// Renders arena, beyblades with 2.5D perspective, particles, and HUD elements.

import * as PIXI from "pixi.js";
import type { ServerBeyblade, ServerGameState, ServerDetachedBody } from "@/types/game";
import { getBeybladeStability } from "@/types/game";
import { PX_PER_CM_BASE, PHYSICS_SCALE } from "@/constants/units";
import { WorldTransform } from "./WorldTransform";
import { FeatureRenderer } from "./FeatureRenderer";
import { StateInterpolator } from "../interpolation/StateInterpolator";
export type { ServerBeyblade, ServerGameState };
export { WorldTransform } from "./WorldTransform";

// Type color map for beyblade glow effects
const TYPE_COLORS: Record<string, number> = {
  attack: 0xff4444,
  defense: 0x4488ff,
  stamina: 0x44ff88,
  balanced: 0xffcc44,
};

const THEME_COLORS: Record<string, number> = {
  metrocity: 0x1a2a4a,
  forest: 0x0d2b1a,
  mountains: 0x1a1a2e,
  grasslands: 0x1a3a1a,
  desert: 0x3a2a0d,
  sea: 0x0d1a3a,
  futuristic: 0x0a0a2e,
  prehistoric: 0x2a1a0d,
  safari: 0x2a2a0d,
  riverbank: 0x0d2a2a,
};

interface ParticleData {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: number;
  sprite: PIXI.Graphics | PIXI.Text;
}

export class BeybladeGameRenderer {
  private app: PIXI.Application;
  private container: HTMLElement;

  // Layer containers (z-order: arena → features → beys → detached → particles → HUD)
  // World layers are children of `worldRoot` which receives the camera transform.
  // `arenaRotationRoot` wraps arena + feature layers so the entire bowl
  // (and admin-placed features in arena-frame) spin together. Beyblades remain
  // in world-frame and do not rotate.
  // HUD layer stays in screen space (no transform).
  private worldRoot!: PIXI.Container;
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

  // Feature layer renderer (obstacles / pits / portals / turrets / water / loops / projectiles).
  private featureRenderer: FeatureRenderer | null = null;

  // Per-beyblade display objects
  private beybladeContainers: Map<string, PIXI.Container> = new Map();
  private beybladeSprites: Map<string, PIXI.Graphics> = new Map();
  private healthBars: Map<string, PIXI.Graphics> = new Map();
  private spinBars: Map<string, PIXI.Graphics> = new Map();
  private labelTexts: Map<string, PIXI.Text> = new Map();
  private glowFilters: Map<string, PIXI.Filter> = new Map();

  // Phase G visual effect layers (per beyblade)
  private shadowSprites: Map<string, PIXI.Graphics> = new Map();
  private attackArcs: Map<string, PIXI.Graphics> = new Map();
  private shieldRings: Map<string, PIXI.Graphics> = new Map();
  private dodgeTrails: Map<string, { x: number; y: number; alpha: number }[]> = new Map();
  private dodgeTrailGraphics: Map<string, PIXI.Graphics[]> = new Map();

  // 2.5D Part System visual effects (6.14 / 6.15 / 6.16)
  private airborneArcs: Map<string, PIXI.Graphics> = new Map();     // 6.14 jump hop trail
  private flashGraphics: Map<string, PIXI.Graphics> = new Map();    // 6.15 spinDir change flash
  private flashTimers: Map<string, number> = new Map();
  private prevSpinDirections: Map<string, string> = new Map();
  private splitBodySprites: Map<string, PIXI.Graphics> = new Map(); // 6.16 partner half

  // 6.13 — DetachedBody sprites (projectile / mini_bey / fragment)
  private detachedBodySprites: Map<string, PIXI.Graphics> = new Map();

  // H3: per-bey visual overrides driven by "combo-visual" messages
  private beyVisualOverrides: Map<string, { spriteUrl?: string; animationId?: string; expiresAt: number }> = new Map();

  // Particles
  private particles: ParticleData[] = [];

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

  // Arena geometry cache — screen space
  private arenaRadius = 0;
  private arenaCenterX = 0;
  private arenaCenterY = 0;

  // Physics coordinate system (server uses width * 16 as physics space)
  private physicsCenterX = 0;
  private physicsCenterY = 0;
  private physicsArenaRadius = 1;

  private initialized = false;
  private contextLost = false;
  private interpolator = new StateInterpolator();

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
    // arena + features sit under arenaRotationRoot so a spinning bowl rotates them together.
    this.worldRoot = new PIXI.Container();
    this.arenaRotationRoot = new PIXI.Container();
    this.arenaLayer = new PIXI.Container();
    this.featureLayer = new PIXI.Container();
    this.beybladeLayer = new PIXI.Container();
    this.detachedBodyLayer = new PIXI.Container(); // 6.13 — new layer
    this.particleLayer = new PIXI.Container();
    this.hudLayer = new PIXI.Container();

    this.arenaRotationRoot.addChild(this.arenaLayer);
    this.arenaRotationRoot.addChild(this.featureLayer);
    this.worldRoot.addChild(this.arenaRotationRoot);
    this.worldRoot.addChild(this.beybladeLayer);
    this.worldRoot.addChild(this.detachedBodyLayer);
    this.worldRoot.addChild(this.particleLayer);

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
    }

    this.updateCameraTarget(beyblades);
    this.world.setScreen(this.app.screen.width, this.app.screen.height);
    this.world.tick();
    this.applyCameraTransform();
    this.updateArenaRotation(gameState);

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
      if (!this.cameraInitialized) {
        this.world.snapTo(cm.x, cm.y);
        // Initial zoom = fit-arena (minZoom).
        this.world.setZoom(this.world.limits.minZoom, true);
        this.cameraInitialized = true;
      }
    }
  }

  /** Apply current camera state to the world layer (position + scale). */
  private applyCameraTransform() {
    const z = this.world.camera.zoom;
    // Compute scale that takes "world px" (= cm * PX_PER_CM_BASE) into screen px.
    // worldRoot's children render at world-px; we scale by zoom and translate so
    // camera.{x,y} (in cm) appears at the screen center.
    this.worldRoot.scale.set(z);
    const cx_worldPx = this.world.camera.x_cm * PX_PER_CM_BASE;
    const cy_worldPx = this.world.camera.y_cm * PX_PER_CM_BASE;
    this.worldRoot.position.set(
      this.app.screen.width / 2 - cx_worldPx * z,
      this.app.screen.height / 2 - cy_worldPx * z,
    );
  }

  /** Public: declare which bey ID the camera should follow (the local player's). */
  setControlledBeyblade(id: string | null) {
    this.controlledBeyId = id;
    this.cameraInitialized = false; // snap to new target on next frame
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
          this.arenaRotationSpeedRadPerS = (arena.rotationSpeed * Math.PI) / 180;
          this.arenaRotationDirection = arena.rotationDirection === "counterclockwise" ? -1 : 1;
        } else if (!arena.autoRotate) {
          this.arenaRotationSpeedRadPerS = 0;
        }
        this.arenaRotationRad += this.arenaRotationSpeedRadPerS * this.arenaRotationDirection * dt;
      }
    }
    if (this.arenaRotationRoot) {
      this.arenaRotationRoot.rotation = this.arenaRotationRad;
    }
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

    const bgColor = THEME_COLORS[theme] ?? 0x1a1a2e;
    const g = new PIXI.Graphics();

    if (shape === "circle") {
      g.circle(0, 0, this.arenaRadius + 16);
      g.fill({ color: 0x000000, alpha: 0.6 });

      const floorGradient = new PIXI.Graphics();
      floorGradient.circle(0, 0, this.arenaRadius);
      floorGradient.fill({ color: bgColor });

      const innerRing = new PIXI.Graphics();
      innerRing.circle(0, 0, this.arenaRadius);
      innerRing.stroke({ color: 0x4488cc, width: 3, alpha: 0.6 });

      const boundaryRing = new PIXI.Graphics();
      boundaryRing.circle(0, 0, this.arenaRadius * 0.90);
      boundaryRing.stroke({ color: 0xff2222, width: 1, alpha: 0.2 });

      // Phase V3: dynamic shrink ring — redrawn each frame when effectiveRadius changes
      this.shrinkRingGraphics = new PIXI.Graphics();
      this.shrinkRingGraphics.visible = false;
      this.lastShrinkRadiusPx = -1;

      this.arenaLayer.addChild(g, floorGradient, innerRing, boundaryRing, this.shrinkRingGraphics);
    } else {
      const arenaW = this.arenaRadius * 2;
      const arenaH = this.arenaRadius * 2;
      g.rect(-arenaW / 2, -arenaH / 2, arenaW, arenaH);
      g.fill({ color: bgColor });
      g.stroke({ color: 0x4488cc, width: 3, alpha: 0.6 });
      this.arenaLayer.addChild(g);
    }
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

    // Recompute zoom limits using actual bey radius once we have one.
    if (beyblades.size > 0) {
      const first = beyblades.values().next().value!;
      const radiusCm = first.radius || 2.5;
      this.world.computeZoomLimits(radiusCm);
    }

    beyblades.forEach((beyblade, id) => {
      seen.add(id);

      if (!this.beybladeContainers.has(id)) {
        this.createBeybladeDisplayObject(beyblade, id);
      }

      this.interpolator.push(id, {
        time: performance.now(),
        x: beyblade.x,
        y: beyblade.y,
        angle: beyblade.rotation,
        spin: beyblade.spin,
        wobbleAmplitude: 0,
        beyTiltAngle: (beyblade as any).beyTiltAngle ?? 0,
        adhering: !!(beyblade as any).adhering,
        wallClimbing: !!(beyblade as any).wallClimbing,
        spinDirection: beyblade.spinDirection,
        specialMoveActive: !!(beyblade as any).specialMoveActive,
        comboPhase: (beyblade as any).comboPhase ?? "",
        combinationLocked: !!(beyblade as any).combinationLocked,
      });

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
        this.prevSpinDirections.delete(id);
        this.flashTimers.delete(id);
        // Remove trail ghost graphics from layer
        const trailG = this.dodgeTrailGraphics.get(id);
        if (trailG) {
          trailG.forEach(g => this.beybladeLayer.removeChild(g));
          this.dodgeTrailGraphics.delete(id);
        }
        // Remove 2.5D per-bey graphics
        const arc = this.airborneArcs.get(id);
        if (arc) { this.beybladeLayer.removeChild(arc); this.airborneArcs.delete(id); }
        const split = this.splitBodySprites.get(id);
        if (split) { this.beybladeLayer.removeChild(split); this.splitBodySprites.delete(id); }
        this.flashGraphics.delete(id);
        this.beyVisualOverrides.delete(id); // H3: clean up any pending visual override
        this.interpolator.remove(id);
      }
    });
  }

  private createBeybladeDisplayObject(beyblade: ServerBeyblade, id: string) {
    const container = new PIXI.Container();
    const typeColor = TYPE_COLORS[beyblade.type] ?? 0xffffff;

    // Shadow (drawn first, behind sprite)
    const shadow = new PIXI.Graphics();
    container.addChild(shadow);
    this.shadowSprites.set(id, shadow);

    // Beyblade body (spinning top shape)
    const sprite = new PIXI.Graphics();
    this.drawBeybladeShape(sprite, typeColor, beyblade.actualSize || 48);
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

    this.beybladeLayer.addChild(container);
    this.beybladeContainers.set(id, container);
  }

  private drawBeybladeShape(g: PIXI.Graphics, color: number, radiusPx: number) {
    g.clear();
    const r = radiusPx / 2;

    // Outer ring (attack layer)
    g.circle(0, 0, r);
    g.fill({ color, alpha: 0.9 });

    // Inner core (performance tip)
    g.circle(0, 0, r * 0.45);
    g.fill({ color: 0xffffff, alpha: 0.3 });

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
    const interp = this.interpolator.getInterpolated(id, performance.now());
    const interpX = interp?.x ?? beyblade.x;
    const interpY = interp?.y ?? beyblade.y;
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
    const tiltAngle = (beyblade as any).beyTiltAngle ?? 0;
    const tiltFrac = tiltAngle !== 0 ? tiltAngle / 90 : 0;
    const tiltSkewX = tiltFrac * 0.4; // max 0.4 radians skew at 90°

    sprite.skew.set(wobbleSkewX + tiltSkewX, 0);

    // Spin rotation (visual — uses interpolated angle for smooth motion)
    sprite.rotation = interpAngle;

    // Motion blur: stronger at high angular velocity
    const blurAlpha = Math.min(1, Math.abs(beyblade.angularVelocity) / 5);
    sprite.alpha = beyblade.isActive ? (0.7 + blurAlpha * 0.3) : 0.3;

    // Invulnerable: flashing effect (dodge window or isInvulnerable flag)
    if (beyblade.isInvulnerable || (beyblade.dodgeBuffTimer > 0)) {
      sprite.alpha = Math.sin(Date.now() / 80) > 0 ? 1 : 0.15;
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
      sprite.tint = 0xffffff;
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

    const barWidth = 40;
    const barHeight = 4;
    const barY = -r - 22;

    // Health bar
    healthBar.clear();
    healthBar.rect(-barWidth / 2, barY, barWidth, barHeight);
    healthBar.fill({ color: 0x333333 });
    const healthPct = beyblade.health / 100;
    const healthColor = healthPct > 0.5 ? 0x44cc44 : healthPct > 0.25 ? 0xffaa00 : 0xff3333;
    healthBar.rect(-barWidth / 2, barY, barWidth * healthPct, barHeight);
    healthBar.fill({ color: healthColor });

    // Spin bar (below health bar)
    spinBar.clear();
    spinBar.rect(-barWidth / 2, barY + barHeight + 2, barWidth, 3);
    spinBar.fill({ color: 0x222244 });
    const spinPct = beyblade.maxSpin > 0 ? beyblade.spin / beyblade.maxSpin : 0;
    spinBar.rect(-barWidth / 2, barY + barHeight + 2, barWidth * spinPct, 3);
    spinBar.fill({ color: 0x4488ff });

    // Label position
    label.y = barY - 4;
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
    const peakScale = baseScale * zoomFactor;
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

  spawnCollisionParticles(x: number, y: number, color1: number = 0xffffff, color2: number = 0xffffff) {
    const count = 20;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.3;
      const speed = 2 + Math.random() * 4;
      const g = new PIXI.Graphics();
      const color = i % 2 === 0 ? color1 : color2;
      g.circle(0, 0, 2 + Math.random() * 2);
      g.fill({ color });
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
      const g = new PIXI.Graphics();
      g.circle(0, 0, 3);
      g.fill({ color, alpha: 0.8 });
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
      const g = new PIXI.Graphics();
      g.circle(0, 0, size);
      g.fill({ color, alpha: 0.9 });
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

  playSpecialMoveEffect(playerId: string, type: string, physX: number, physY: number, facing: number) {
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
      // Rebuild arena on resize
      this.arenaRadius = 0;
      this.cameraInitialized = false;
      this.shrinkRingGraphics = null;
      this.lastShrinkRadiusPx = -1;
      // Inform world transform of new screen size; zoom limits recompute
      // when buildArena runs again next frame.
      this.world.setScreen(this.app.screen.width, this.app.screen.height);
    }
  }

  // ─── AA8: handleArenaEffect + renderArenaEffectOverlay ──────────────────────

  /**
   * AA8: Called by useColyseus when "arena-effect-start" / "arena-effect-end"
   * messages arrive.  Drives a screen-space overlay that fades in over 500 ms
   * and is drawn every frame by renderArenaEffectOverlay().
   */
  public handleArenaEffect(phase: "start" | "end", effectType: string, durationTicks: number): void {
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

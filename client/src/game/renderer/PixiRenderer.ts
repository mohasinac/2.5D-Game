// [GAME-CLIENT] PixiRenderer — WebGL game renderer using PixiJS.
// Replaces the old HTML5 Canvas 2D renderer with hardware-accelerated WebGL.
// Renders arena, beyblades with 2.5D perspective, particles, and HUD elements.

import * as PIXI from "pixi.js";
import type { ServerBeyblade, ServerGameState, ServerDetachedBody } from "@/types/game";
import { getBeybladeStability } from "@/types/game";
import { PX_PER_CM_BASE, PHYSICS_SCALE } from "@/constants/units";
import { WorldTransform } from "./WorldTransform";
import { FeatureRenderer } from "./FeatureRenderer";
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

  // Particles
  private particles: ParticleData[] = [];

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

    // Feature layer renderer (obstacles, pits, portals, turrets, water, loops, projectiles).
    this.featureRenderer = new FeatureRenderer(this.featureLayer);

    // Particle update on ticker
    this.app.ticker.add(this.updateParticles.bind(this));

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

      this.arenaLayer.addChild(g, floorGradient, innerRing, boundaryRing);
    } else {
      const arenaW = this.arenaRadius * 2;
      const arenaH = this.arenaRadius * 2;
      g.rect(-arenaW / 2, -arenaH / 2, arenaW, arenaH);
      g.fill({ color: bgColor });
      g.stroke({ color: 0x4488cc, width: 3, alpha: 0.6 });
      this.arenaLayer.addChild(g);
    }
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

    // Map physics coords → screen coords using the stored physics scale
    const physScale = this.physicsArenaRadius > 0 ? this.arenaRadius / this.physicsArenaRadius : 1;
    const screenX = this.arenaCenterX + (beyblade.x - this.physicsCenterX) * physScale;
    const screenY = this.arenaCenterY + (beyblade.y - this.physicsCenterY) * physScale;

    container.x = screenX;
    container.y = screenY;

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
    sprite.skew.set(tiltAmount * Math.sin(Date.now() / 300), 0);

    // Spin rotation (visual — independent of physics rotation)
    sprite.rotation = beyblade.rotation;

    // Motion blur: stronger at high angular velocity
    const blurAlpha = Math.min(1, Math.abs(beyblade.angularVelocity) / 5);
    sprite.alpha = beyblade.isActive ? (0.7 + blurAlpha * 0.3) : 0.3;

    // Invulnerable: flashing effect (dodge window or isInvulnerable flag)
    if (beyblade.isInvulnerable || (beyblade.dodgeBuffTimer > 0)) {
      sprite.alpha = Math.sin(Date.now() / 80) > 0 ? 1 : 0.15;
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
    {
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
      // Inform world transform of new screen size; zoom limits recompute
      // when buildArena runs again next frame.
      this.world.setScreen(this.app.screen.width, this.app.screen.height);
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

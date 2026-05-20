// [GAME-CLIENT] PixiRenderer — WebGL game renderer using PixiJS.
// Replaces the old HTML5 Canvas 2D renderer with hardware-accelerated WebGL.
// Renders arena, beyblades with 2.5D perspective, particles, and HUD elements.

import * as PIXI from "pixi.js";
import type { ServerBeyblade, ServerGameState } from "@/types/game";
import { getBeybladeStability } from "@/types/game";
export type { ServerBeyblade, ServerGameState };

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

  // Layer containers (z-order)
  private arenaLayer!: PIXI.Container;
  private featureLayer!: PIXI.Container;
  private beybladeLayer!: PIXI.Container;
  private particleLayer!: PIXI.Container;
  private hudLayer!: PIXI.Container;

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

  // Particles
  private particles: ParticleData[] = [];

  // Arena geometry cache
  private arenaRadius = 0;
  private arenaCenterX = 0;
  private arenaCenterY = 0;

  private initialized = false;

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

    // Build layer stack
    this.arenaLayer = new PIXI.Container();
    this.featureLayer = new PIXI.Container();
    this.beybladeLayer = new PIXI.Container();
    this.particleLayer = new PIXI.Container();
    this.hudLayer = new PIXI.Container();

    this.app.stage.addChild(this.arenaLayer);
    this.app.stage.addChild(this.featureLayer);
    this.app.stage.addChild(this.beybladeLayer);
    this.app.stage.addChild(this.particleLayer);
    this.app.stage.addChild(this.hudLayer);

    // Particle update on ticker
    this.app.ticker.add(this.updateParticles.bind(this));

    this.initialized = true;
  }

  // ─── Main render call (called every animation frame from React) ─────────────

  render(gameState: ServerGameState | null, beyblades: Map<string, ServerBeyblade>) {
    if (!this.initialized) return;

    if (gameState?.arena && this.arenaRadius === 0) {
      this.buildArena(gameState);
    }

    this.syncBeyblades(beyblades);
  }

  // ─── Arena rendering ─────────────────────────────────────────────────────────

  private buildArena(gameState: ServerGameState) {
    this.arenaLayer.removeChildren();

    const { width, height, shape, theme } = gameState.arena!;
    const w = this.app.screen.width;
    const h = this.app.screen.height;

    // Arena fits within viewport maintaining aspect ratio
    const arenaPixelRadius = Math.min(w, h) * 0.42;
    this.arenaRadius = arenaPixelRadius;
    this.arenaCenterX = w / 2;
    this.arenaCenterY = h / 2;

    const bgColor = THEME_COLORS[theme] ?? 0x1a1a2e;
    const g = new PIXI.Graphics();

    if (shape === "circle") {
      // Stadium bowl effect: outer darker ring behind the floor
      g.circle(this.arenaCenterX, this.arenaCenterY, arenaPixelRadius + 16);
      g.fill({ color: 0x000000, alpha: 0.6 });

      // Arena floor with radial gradient effect (darker center)
      const floorGradient = new PIXI.Graphics();
      floorGradient.circle(this.arenaCenterX, this.arenaCenterY, arenaPixelRadius);
      floorGradient.fill({ color: bgColor });

      // Inner highlight ring (concave bowl feel)
      const innerRing = new PIXI.Graphics();
      innerRing.circle(this.arenaCenterX, this.arenaCenterY, arenaPixelRadius);
      innerRing.stroke({ color: 0x4488cc, width: 3, alpha: 0.6 });

      // Boundary warning ring (pulses red when beyblades are near edge)
      const boundaryRing = new PIXI.Graphics();
      boundaryRing.circle(this.arenaCenterX, this.arenaCenterY, arenaPixelRadius * 0.95);
      boundaryRing.stroke({ color: 0xff2222, width: 1, alpha: 0.2 });

      this.arenaLayer.addChild(g, floorGradient, innerRing, boundaryRing);
    } else {
      // Rectangular arena
      const arenaW = arenaPixelRadius * 2;
      const arenaH = arenaPixelRadius * 2;
      g.rect(this.arenaCenterX - arenaW / 2, this.arenaCenterY - arenaH / 2, arenaW, arenaH);
      g.fill({ color: bgColor });
      g.stroke({ color: 0x4488cc, width: 3, alpha: 0.6 });
      this.arenaLayer.addChild(g);
    }
  }

  // ─── Beyblade rendering with 2.5D perspective ────────────────────────────────

  private syncBeyblades(beyblades: Map<string, ServerBeyblade>) {
    const seen = new Set<string>();

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
        // Remove trail ghost graphics from layer
        const trailG = this.dodgeTrailGraphics.get(id);
        if (trailG) {
          trailG.forEach(g => this.beybladeLayer.removeChild(g));
          this.dodgeTrailGraphics.delete(id);
        }
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

    // Simple mapping: game coords are already in pixels — just center them
    const screenX = this.arenaCenterX + (beyblade.x - (this.arenaCenterX || 400));
    const screenY = this.arenaCenterY + (beyblade.y - (this.arenaCenterY || 300));

    container.x = screenX;
    container.y = screenY;

    // Stability-based 2.5D perspective effects
    const stability = getBeybladeStability(beyblade);

    // ── Airborne effect: scale up 1.3× + drop shadow below ────────────────
    const isAirborne = beyblade.isAirborne;
    if (isAirborne) {
      sprite.scale.set(1.3, 1.3 * (0.85 + stability * 0.15));
    } else {
      sprite.scale.set(1.0, 0.85 + stability * 0.15);
    }

    // Drop shadow (ellipse at ground level, fades when airborne)
    if (shadow) {
      shadow.clear();
      if (isAirborne) {
        shadow.ellipse(4, r * 0.6, r * 0.9, r * 0.25);
        shadow.fill({ color: 0x000000, alpha: 0.35 });
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

      const typeColor = TYPE_COLORS[beyblade.type] ?? 0xffffff;
      for (let i = 0; i < trailGraphics.length; i++) {
        const g = trailGraphics[i];
        const t = trails[i];
        if (t) {
          g.clear();
          g.circle(t.x, t.y, r * (0.4 + i * 0.1));
          g.fill({ color: typeColor, alpha: t.alpha * (i / 6) });
          t.alpha *= 0.75;
        } else {
          g.clear();
        }
      }

      // Prune fully faded trail points
      while (trails.length > 0 && trails[0].alpha < 0.02) trails.shift();
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
        fontSize: 14,
        fontWeight: "bold",
        fill: color,
        fontFamily: "monospace",
        dropShadow: { alpha: 0.8, angle: 0, blur: 3, distance: 0, color: 0x000000 },
      },
    });
    text.anchor.set(0.5, 1);
    text.x = x;
    text.y = y;
    this.particleLayer.addChild(text);

    this.particles.push({
      x, y,
      vx: (Math.random() - 0.5) * 0.8,
      vy: -2.5 - Math.random(),
      life: 0,
      maxLife: 0.9 + Math.random() * 0.3,
      color,
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
    }
  }

  destroy() {
    if (!this.initialized) return;
    this.initialized = false;
    this.app.destroy(true, { children: true });
  }
}

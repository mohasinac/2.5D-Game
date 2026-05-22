// FeatureRenderer — draws obstacles, pits, portals, turrets, water bodies,
// loops/speed paths, and projectiles into the renderer's `featureLayer`.
// All input coords are in cm (origin at arena center). Render output is in
// world-px (cm * PX_PER_CM_BASE) which sits inside the camera-transformed
// worldRoot, so the camera handles zoom + pan automatically.
//
// See plan: Part 3 (in-match feature rendering parity), Part 12 (liquid types).

import * as PIXI from "pixi.js";
import { PX_PER_CM_BASE } from "@/constants/units";
import type {
  ServerObstacle,
  ServerPit,
  ServerTurret,
  ServerProjectile,
  ServerWaterBody,
  ServerPortal,
  ServerLoop,
} from "@/types/game";

const LIQUID_COLORS: Record<string, number> = {
  water: 0x4488ff,
  lava: 0xff5522,
  ice: 0x88ddff,
  acid: 0xaaff44,
  oil: 0x442200,
  blood: 0xaa1122,
  healing: 0x66ffaa,
  speedBoost: 0xffcc44,
  quicksand: 0xb8a36b,
  poison: 0xbb44ff,
};

const OBSTACLE_COLORS: Record<string, number> = {
  rock:     0x88837a,
  pillar:   0x9aa1ab,
  barrier:  0xc0a060,
  wall:     0x707070,
  crystal:  0x66ddff,
  box:      0xaa7a44,
  tire:     0x222222,
};

const TURRET_COLORS: Record<string, number> = {
  random:    0x888888,
  beam:      0xff44aa,
  periodic:  0xffaa44,
  aoe:       0xff5522,
  boomerang: 0x44aaff,
};

const cmToWorldPx = (cm: number) => cm * PX_PER_CM_BASE;

export class FeatureRenderer {
  private layer: PIXI.Container;

  // Per-feature graphics caches keyed by id.
  private obstacleGfx = new Map<string, PIXI.Graphics>();
  private obstacleHealthGfx = new Map<string, PIXI.Graphics>();
  private pitGfx = new Map<string, PIXI.Graphics>();
  private turretGfx = new Map<string, PIXI.Container>(); // base + barrel
  private projectileGfx = new Map<string, PIXI.Graphics>();
  private waterGfx = new Map<string, PIXI.Graphics>();
  private portalGfx = new Map<string, PIXI.Container>();
  private loopGfx = new Map<string, PIXI.Graphics>();

  constructor(featureLayer: PIXI.Container) {
    this.layer = featureLayer;
  }

  /** Render one frame of features. Called from PixiRenderer.render(). */
  sync(opts: {
    obstacles?: Map<string, ServerObstacle>;
    pits?: Map<string, ServerPit>;
    turrets?: Map<string, ServerTurret>;
    projectiles?: Map<string, ServerProjectile>;
    waterBodies?: Map<string, ServerWaterBody>;
    portals?: Map<string, ServerPortal>;
    loops?: Map<string, ServerLoop>;
    nowMs: number;
    /** Optional viewport rect in cm — when set, all entities are toggled
     *  visible only if they intersect (with `marginCm` slack). Reduces
     *  per-frame draw work on large arenas. */
    viewportCm?: { x: number; y: number; w: number; h: number } | null;
    marginCm?: number;
  }) {
    this.viewport = opts.viewportCm ?? null;
    this.viewMarginCm = opts.marginCm ?? 4;
    this.syncObstacles(opts.obstacles);
    this.syncWaterBodies(opts.waterBodies);
    this.syncPits(opts.pits);
    this.syncLoops(opts.loops);
    this.syncPortals(opts.portals, opts.nowMs);
    this.syncTurrets(opts.turrets);
    this.syncProjectiles(opts.projectiles);
  }

  private viewport: { x: number; y: number; w: number; h: number } | null = null;
  private viewMarginCm = 4;

  /**
   * True when a feature at (x_cm, y_cm) with `radiusCm` overlaps the viewport
   * (or when no viewport is set — feature is always drawn).
   */
  private isVisible(x_cm: number, y_cm: number, radiusCm: number): boolean {
    const v = this.viewport;
    if (!v) return true;
    const m = this.viewMarginCm + radiusCm;
    return !(
      x_cm + m < v.x ||
      x_cm - m > v.x + v.w ||
      y_cm + m < v.y ||
      y_cm - m > v.y + v.h
    );
  }

  // ─── Obstacles ──────────────────────────────────────────────────────────

  private syncObstacles(map?: Map<string, ServerObstacle>) {
    this.diffSync(this.obstacleGfx, map, (o, g) => {
      g.visible = this.isVisible(o.x, o.y, o.radius);
      if (g.visible) this.drawObstacle(o, g); else g.clear();
    });
    // Health bars for damaged destructibles
    this.diffSync(this.obstacleHealthGfx, map, (o, g) => {
      g.visible = this.isVisible(o.x, o.y, o.radius);
      g.clear();
      if (!g.visible) return;
      if (o.destructible && !o.isDestroyed && o.health < o.maxHealth) {
        const r = cmToWorldPx(o.radius);
        const w = r * 1.6;
        const x = cmToWorldPx(o.x) - w / 2;
        const y = cmToWorldPx(o.y) - r - 4;
        const pct = Math.max(0, Math.min(1, o.health / Math.max(1, o.maxHealth)));
        g.rect(x, y, w, 3).fill({ color: 0x000000, alpha: 0.6 });
        g.rect(x, y, w * pct, 3).fill({ color: pct > 0.4 ? 0x44ff44 : 0xff4444 });
      }
    });
  }

  private drawObstacle(o: ServerObstacle, g: PIXI.Graphics) {
    g.clear();
    if (o.isDestroyed) return;
    const x = cmToWorldPx(o.x);
    const y = cmToWorldPx(o.y);
    const r = cmToWorldPx(o.radius);
    const color = OBSTACLE_COLORS[o.type] ?? 0x808080;

    // Drop shadow (height illusion).
    g.circle(x + 2, y + 3, r).fill({ color: 0x000000, alpha: 0.4 });
    // Body.
    g.circle(x, y, r).fill({ color, alpha: o.destructible ? 0.88 : 0.95 });
    // Highlight ring.
    g.circle(x, y, r).stroke({ color: 0xffffff, width: 1.5, alpha: 0.35 });
    // Indestructible chevron — small steel ring.
    if (!o.destructible) {
      g.circle(x, y, r * 0.75).stroke({ color: 0xeeeeee, width: 1, alpha: 0.5 });
    }
  }

  // ─── Pits ───────────────────────────────────────────────────────────────

  private syncPits(map?: Map<string, ServerPit>) {
    this.diffSync(this.pitGfx, map, (p, g) => {
      g.visible = this.isVisible(p.x, p.y, p.radius);
      g.clear();
      if (!g.visible) return;
      const x = cmToWorldPx(p.x);
      const y = cmToWorldPx(p.y);
      const r = cmToWorldPx(p.radius);
      // Outer rim.
      g.circle(x, y, r * 1.05).fill({ color: 0x000000, alpha: 0.5 });
      // Inner dark gradient (faked w/ two stacked circles).
      g.circle(x, y, r).fill({ color: 0x0a0d18 });
      g.circle(x, y, r * 0.6).fill({ color: 0x000000, alpha: 0.6 });
      // Warning ring (orange) when a bey is trapped.
      if (p.trappedBeybladeId) {
        g.circle(x, y, r * 1.08).stroke({ color: 0xff8844, width: 2, alpha: 0.9 });
      } else {
        g.circle(x, y, r).stroke({ color: 0x333344, width: 1, alpha: 0.6 });
      }
    });
  }

  // ─── Water bodies ───────────────────────────────────────────────────────

  private syncWaterBodies(map?: Map<string, ServerWaterBody>) {
    this.diffSync(this.waterGfx, map, (w, g) => {
      // Use a permissive radius — water can be large rectangles.
      const r = Math.max(w.radius ?? 0, w.outerRadius ?? 0, w.width ?? 0, w.height ?? 0, 8);
      g.visible = this.isVisible(w.x ?? 0, w.y ?? 0, r);
      g.clear();
      if (!g.visible) return;
      const color = LIQUID_COLORS[w.liquidType] ?? 0x4488ff;
      const fillAlpha = w.liquidType === "ice" ? 0.4 : 0.55;
      const x = cmToWorldPx(w.x ?? 0);
      const y = cmToWorldPx(w.y ?? 0);

      // Determine geometry from the available fields.
      const shape = w.shape || (w.type === "moat" ? "annulus" : "circle");
      if (shape === "annulus" && w.innerRadius != null && w.outerRadius != null) {
        const ri = cmToWorldPx(w.innerRadius);
        const ro = cmToWorldPx(w.outerRadius);
        // Approximate annulus with two filled circles via even-odd-ish trick:
        // draw outer ring then knock out interior using black-alpha overlay.
        g.circle(x, y, ro).fill({ color, alpha: fillAlpha });
        g.circle(x, y, ri).cut?.();
        if (!(g as any).cut) {
          // PIXI 8 has no native hole; emulate with a same-color-as-floor disk.
          g.circle(x, y, ri).fill({ color: 0x000000, alpha: 0 });
        }
        g.circle(x, y, ro).stroke({ color, width: 2, alpha: 0.85 });
        g.circle(x, y, ri).stroke({ color, width: 1, alpha: 0.5 });
      } else if (shape === "rectangle" || shape === "square") {
        const ww = cmToWorldPx(w.width ?? (w.radius ?? 4) * 2);
        const hh = cmToWorldPx(w.height ?? (w.radius ?? 4) * 2);
        g.rect(x - ww / 2, y - hh / 2, ww, hh).fill({ color, alpha: fillAlpha });
        g.rect(x - ww / 2, y - hh / 2, ww, hh).stroke({ color, width: 2, alpha: 0.85 });
      } else if (shape === "oval") {
        const rx = cmToWorldPx(w.width ?? (w.radius ?? 4));
        const ry = cmToWorldPx(w.height ?? (w.radius ?? 4));
        g.ellipse(x, y, rx, ry).fill({ color, alpha: fillAlpha });
        g.ellipse(x, y, rx, ry).stroke({ color, width: 2, alpha: 0.85 });
      } else {
        const r = cmToWorldPx(w.radius ?? 4);
        g.circle(x, y, r).fill({ color, alpha: fillAlpha });
        g.circle(x, y, r).stroke({ color, width: 2, alpha: 0.85 });
      }
    });
  }

  // ─── Loops / speed paths ────────────────────────────────────────────────

  private syncLoops(map?: Map<string, ServerLoop>) {
    this.diffSync(this.loopGfx, map, (l, g) => {
      g.visible = this.isVisible(l.x ?? 0, l.y ?? 0, l.radius);
      g.clear();
      if (!g.visible) return;
      const x = cmToWorldPx(l.x ?? 0);
      const y = cmToWorldPx(l.y ?? 0);
      const r = cmToWorldPx(l.radius);
      const color = l.speedBoost > 1 ? 0xffcc44 : 0x88aaff;
      g.circle(x, y, r).stroke({ color, width: 3, alpha: 0.7 });
      // Direction arrows (cosmetic).
      const arrowCount = 6;
      for (let i = 0; i < arrowCount; i++) {
        const a = (i / arrowCount) * Math.PI * 2;
        const ax = x + Math.cos(a) * r;
        const ay = y + Math.sin(a) * r;
        g.circle(ax, ay, 2).fill({ color, alpha: 0.6 });
      }
    });
  }

  // ─── Portals ────────────────────────────────────────────────────────────

  private syncPortals(map: Map<string, ServerPortal> | undefined, nowMs: number) {
    this.diffSyncContainer(this.portalGfx, map, (p) => this.createPortal(p), (p, c) => this.updatePortal(p, c, nowMs));
  }

  private createPortal(p: ServerPortal): PIXI.Container {
    const c = new PIXI.Container();
    const inRing = new PIXI.Graphics();
    const inInner = new PIXI.Graphics();
    const outRing = new PIXI.Graphics();
    const outInner = new PIXI.Graphics();
    c.addChild(inRing, inInner, outRing, outInner);
    (c as any)._portal_inRing = inRing;
    (c as any)._portal_inInner = inInner;
    (c as any)._portal_outRing = outRing;
    (c as any)._portal_outInner = outInner;
    return c;
  }

  private updatePortal(p: ServerPortal, c: PIXI.Container, nowMs: number) {
    // Portal pair spans inPoint→outPoint; if neither endpoint is visible, skip the redraw.
    const visIn = this.isVisible(p.inPointX, p.inPointY, p.radius);
    const visOut = this.isVisible(p.outPointX, p.outPointY, p.radius);
    c.visible = visIn || visOut;
    if (!c.visible) return;
    const inRing = (c as any)._portal_inRing as PIXI.Graphics;
    const inInner = (c as any)._portal_inInner as PIXI.Graphics;
    const outRing = (c as any)._portal_outRing as PIXI.Graphics;
    const outInner = (c as any)._portal_outInner as PIXI.Graphics;
    const r = cmToWorldPx(p.radius);
    const pulse = 0.7 + 0.3 * Math.sin(nowMs / 300);
    const color = p.isOnCooldown ? 0x666666 : 0x9944ff;
    const drawRing = (g: PIXI.Graphics, x: number, y: number) => {
      g.clear();
      g.circle(x, y, r).stroke({ color, width: 3, alpha: 0.85 });
      g.circle(x, y, r * 1.2).stroke({ color, width: 1, alpha: 0.45 * pulse });
    };
    const drawInner = (g: PIXI.Graphics, x: number, y: number) => {
      g.clear();
      // Rotating inner accents.
      const rot = (nowMs / 800) % (Math.PI * 2);
      for (let i = 0; i < 4; i++) {
        const a = rot + (i / 4) * Math.PI * 2;
        const px = x + Math.cos(a) * r * 0.55;
        const py = y + Math.sin(a) * r * 0.55;
        g.circle(px, py, 3).fill({ color, alpha: 0.85 * pulse });
      }
    };
    drawRing(inRing, cmToWorldPx(p.inPointX), cmToWorldPx(p.inPointY));
    drawInner(inInner, cmToWorldPx(p.inPointX), cmToWorldPx(p.inPointY));
    drawRing(outRing, cmToWorldPx(p.outPointX), cmToWorldPx(p.outPointY));
    drawInner(outInner, cmToWorldPx(p.outPointX), cmToWorldPx(p.outPointY));
  }

  // ─── Turrets ────────────────────────────────────────────────────────────

  private syncTurrets(map?: Map<string, ServerTurret>) {
    this.diffSyncContainer(this.turretGfx, map, (t) => this.createTurret(t), (t, c) => this.updateTurret(t, c));
  }

  private createTurret(_t: ServerTurret): PIXI.Container {
    const c = new PIXI.Container();
    const base = new PIXI.Graphics();
    const barrel = new PIXI.Graphics();
    c.addChild(base, barrel);
    (c as any)._turret_base = base;
    (c as any)._turret_barrel = barrel;
    return c;
  }

  private updateTurret(t: ServerTurret, c: PIXI.Container) {
    // Approximate turret extent = barrel length (1.6cm) + base radius (1.2cm).
    c.visible = this.isVisible(t.x, t.y, 3);
    if (!c.visible) return;
    const base = (c as any)._turret_base as PIXI.Graphics;
    const barrel = (c as any)._turret_barrel as PIXI.Graphics;
    const color = TURRET_COLORS[t.attackType] ?? 0x888888;
    const x = cmToWorldPx(t.x);
    const y = cmToWorldPx(t.y);
    const baseR = cmToWorldPx(1.2);
    const barrelL = cmToWorldPx(1.6);

    base.clear();
    base.circle(x + 1, y + 2, baseR).fill({ color: 0x000000, alpha: 0.35 });
    base.circle(x, y, baseR).fill({ color: t.isDestroyed ? 0x444444 : 0x1f2a3a });
    base.circle(x, y, baseR).stroke({ color, width: 2, alpha: 0.9 });
    // Warmup pulse.
    if (t.isWarming) {
      base.circle(x, y, baseR * 1.3).stroke({ color, width: 1.5, alpha: 0.6 });
    }
    // Firing flash.
    if (t.isFiring) {
      base.circle(x, y, baseR * 1.6).stroke({ color, width: 2, alpha: 0.8 });
    }

    barrel.clear();
    if (!t.isDestroyed) {
      const a = (t.currentAngle * Math.PI) / 180;
      const ex = x + Math.cos(a) * barrelL;
      const ey = y + Math.sin(a) * barrelL;
      barrel.moveTo(x, y).lineTo(ex, ey).stroke({ color, width: 4, alpha: 0.95 });
      barrel.circle(ex, ey, 3).fill({ color, alpha: 0.95 });
    }
  }

  // ─── Projectiles ────────────────────────────────────────────────────────

  private syncProjectiles(map?: Map<string, ServerProjectile>) {
    this.diffSync(this.projectileGfx, map, (p, g) => {
      g.visible = p.isActive && this.isVisible(p.x, p.y, 1);
      g.clear();
      if (!g.visible) return;
      const x = cmToWorldPx(p.x);
      const y = cmToWorldPx(p.y);
      const color =
        p.type === "missile" ? 0xff5522 :
        p.type === "boomerang" ? 0x44aaff :
        p.type === "beam" ? 0xff44aa :
        0xffaa44;
      if (p.type === "beam" && p.beamEndX != null && p.beamEndY != null) {
        const ex = cmToWorldPx(p.beamEndX);
        const ey = cmToWorldPx(p.beamEndY);
        const w = Math.max(2, cmToWorldPx(p.beamWidth ?? 0.5));
        g.moveTo(x, y).lineTo(ex, ey).stroke({ color, width: w, alpha: 0.8 });
      } else {
        g.circle(x, y, 5).fill({ color, alpha: 0.95 });
        g.circle(x, y, 5).stroke({ color: 0xffffff, width: 1, alpha: 0.4 });
      }
    });
  }

  // ─── Diff sync helpers ──────────────────────────────────────────────────

  private diffSync<T extends { [k: string]: any }>(
    cache: Map<string, PIXI.Graphics>,
    src: Map<string, T> | undefined,
    draw: (item: T, g: PIXI.Graphics) => void,
  ) {
    const seen = new Set<string>();
    if (src) {
      src.forEach((item, id) => {
        seen.add(id);
        let g = cache.get(id);
        if (!g) {
          g = new PIXI.Graphics();
          this.layer.addChild(g);
          cache.set(id, g);
        }
        draw(item, g);
      });
    }
    cache.forEach((g, id) => {
      if (!seen.has(id)) {
        this.layer.removeChild(g);
        g.destroy();
        cache.delete(id);
      }
    });
  }

  private diffSyncContainer<T extends { [k: string]: any }>(
    cache: Map<string, PIXI.Container>,
    src: Map<string, T> | undefined,
    create: (item: T) => PIXI.Container,
    update: (item: T, c: PIXI.Container) => void,
  ) {
    const seen = new Set<string>();
    if (src) {
      src.forEach((item, id) => {
        seen.add(id);
        let c = cache.get(id);
        if (!c) {
          c = create(item);
          this.layer.addChild(c);
          cache.set(id, c);
        }
        update(item, c);
      });
    }
    cache.forEach((c, id) => {
      if (!seen.has(id)) {
        this.layer.removeChild(c);
        c.destroy({ children: true });
        cache.delete(id);
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Phase Z: Dashed / animated stroke helpers (Z2a, Z2b)
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Z2a: Walk a polyline path and draw alternating solid/gap dashes.
   * @param points  Array of {x,y} in world-px.
   * @param dashPx  Length of each dash in px.
   * @param gapPx   Length of each gap in px.
   * @param offsetPx  Phase offset along path (used for animation).
   */
  static drawDashedPath(
    g: PIXI.Graphics,
    points: Array<{ x: number; y: number }>,
    color: number,
    alpha: number,
    width: number,
    dashPx: number,
    gapPx: number,
    offsetPx = 0,
  ): void {
    const cycle = dashPx + gapPx;
    let distAlong = (-offsetPx % cycle + cycle) % cycle;
    let drawing = distAlong < dashPx;

    for (let i = 1; i < points.length; i++) {
      const ax = points[i - 1].x, ay = points[i - 1].y;
      const bx = points[i].x,     by = points[i].y;
      const segLen = Math.sqrt((bx - ax) ** 2 + (by - ay) ** 2);
      if (segLen < 0.001) continue;
      const ux = (bx - ax) / segLen, uy = (by - ay) / segLen;

      let walked = 0;
      let sx = ax, sy = ay;

      while (walked < segLen) {
        const remaining = drawing ? dashPx - (distAlong % dashPx) : gapPx - (distAlong % gapPx);
        const step = Math.min(remaining, segLen - walked);
        const ex = sx + ux * step, ey = sy + uy * step;

        if (drawing) {
          g.moveTo(sx, sy).lineTo(ex, ey).stroke({ color, width, alpha });
        }
        walked += step;
        distAlong += step;
        sx = ex; sy = ey;

        if (distAlong % cycle < 0.1 || Math.abs(distAlong % cycle - dashPx) < 0.1) {
          drawing = (distAlong % cycle) < dashPx;
        }
        if (step <= 0.001) break;
      }
    }
  }

  /**
   * Z2b: Broken stroke — random gap lengths per segment.
   * @param rand  Seeded random or Math.random.
   */
  static drawBrokenPath(
    g: PIXI.Graphics,
    points: Array<{ x: number; y: number }>,
    color: number,
    alpha: number,
    width: number,
    rand: () => number,
  ): void {
    for (let i = 1; i < points.length; i++) {
      if (rand() > 0.4) {
        g.moveTo(points[i - 1].x, points[i - 1].y)
          .lineTo(points[i].x, points[i].y)
          .stroke({ color, width, alpha });
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Phase Z: Feature animation presets (Z3b, Z3c)
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Z3b: Apply a named animation preset to a Graphics/Container at `nowMs`.
   * Returns the animated alpha (used by callers to set `g.alpha`).
   */
  static applyAnimationPreset(
    preset: string,
    nowMs: number,
    periodMs = 1200,
    baseColor = 0xffffff,
    intensity = 1.0,
  ): { alpha: number; scaleX: number; scaleY: number; tintColor: number } {
    const t = (nowMs % periodMs) / periodMs; // 0→1 per cycle

    switch (preset) {
      case "pulse":
        return { alpha: 0.5 + 0.5 * Math.sin(t * Math.PI * 2) * intensity, scaleX: 1, scaleY: 1, tintColor: baseColor };

      case "scale_pulse": {
        const s = 1 + 0.15 * Math.sin(t * Math.PI * 2) * intensity;
        return { alpha: 1, scaleX: s, scaleY: s, tintColor: baseColor };
      }

      case "flicker":
        return { alpha: Math.random() > 0.15 ? 0.85 : 0.2, scaleX: 1, scaleY: 1, tintColor: baseColor };

      case "alert": {
        const flash = t < 0.5 ? 1 : 0;
        return { alpha: 0.4 + 0.6 * flash * intensity, scaleX: 1, scaleY: 1, tintColor: 0xff2222 };
      }

      case "shimmer":
        return { alpha: 0.6 + 0.4 * Math.abs(Math.sin(t * Math.PI * 4)) * intensity, scaleX: 1, scaleY: 1, tintColor: baseColor };

      case "charged": {
        const charge = (nowMs % (periodMs * 3)) / (periodMs * 3);
        return { alpha: 0.3 + 0.7 * charge * intensity, scaleX: 1, scaleY: 1, tintColor: baseColor };
      }

      case "ghost":
        return { alpha: 0.1 + 0.4 * Math.abs(Math.sin(t * Math.PI)) * intensity, scaleX: 1, scaleY: 1, tintColor: baseColor };

      case "color_cycle": {
        const h = (t * 360) | 0;
        const rgb = hslToHex(h, 0.8, 0.6);
        return { alpha: 0.85 * intensity, scaleX: 1, scaleY: 1, tintColor: rgb };
      }

      default:
        return { alpha: 1, scaleX: 1, scaleY: 1, tintColor: baseColor };
    }
  }

  /**
   * Z3c: Default animation preset per floor hazard type.
   * Used when a zone doesn't have an explicit `featureAnimation` field.
   */
  static defaultAnimationForHazard(hazardType: string): string | null {
    const defaults: Record<string, string> = {
      lava:         "pulse",
      electric:     "lightning",
      void:         "shockwave_ring",
      trampoline:   "scale_pulse",
      drain:        "ghost",
      combo_boost:  "shimmer",
      ice:          "shimmer",
    };
    return defaults[hazardType] ?? null;
  }

  /**
   * Z3c: Default animation preset per effect zone type.
   */
  static defaultAnimationForEffect(effectType: string): string | null {
    const defaults: Record<string, string> = {
      safe_zone:      "shimmer",
      power_charge:   "charged",
      spin_recovery:  "pulse",
      turbo_zone:     "alert",
      respawn_point:  "scale_pulse",
    };
    return defaults[effectType] ?? null;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Phase Z: Animated direction arrows on speed paths (Z6c)
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Draw animated arrow dots moving along a circular speed path.
   * Called each frame inside syncLoops (when showDirectionArrows is set).
   */
  private drawDirectionArrows(
    g: PIXI.Graphics,
    cx: number,
    cy: number,
    r: number,
    nowMs: number,
    arrowSpeedCmPerSec = 8,
    arrowSpacingCm = 6,
    arrowColor = 0xffffff,
  ): void {
    const circumferencePx = r * 2 * Math.PI;
    const spacingPx = arrowSpacingCm * PX_PER_CM_BASE;
    const arrowCount = Math.max(1, Math.floor(circumferencePx / spacingPx));
    const speedPx = arrowSpeedCmPerSec * PX_PER_CM_BASE;
    const phaseOffset = (nowMs / 1000) * speedPx;

    for (let i = 0; i < arrowCount; i++) {
      const pos = ((i / arrowCount) * circumferencePx + phaseOffset) % circumferencePx;
      const angle = (pos / r) - Math.PI / 2;
      const ax = cx + Math.cos(angle) * r;
      const ay = cy + Math.sin(angle) * r;
      // Draw a small forward-pointing chevron dot
      g.circle(ax, ay, 3).fill({ color: arrowColor, alpha: 0.8 });
      // Tiny directional tail
      const tailAngle = angle - 0.3;
      g.moveTo(ax, ay).lineTo(ax + Math.cos(tailAngle) * 5, ay + Math.sin(tailAngle) * 5)
        .stroke({ color: arrowColor, width: 1.5, alpha: 0.5 });
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Phase Z: Background particles (Z8b)
  // ═══════════════════════════════════════════════════════════════════════════

  private bgParticleLayer?: PIXI.Container;
  private bgParticles: Array<{ g: PIXI.Graphics; x: number; y: number; vx: number; vy: number; life: number; maxLife: number }> = [];
  private bgParticleConfig?: { type: string; density: number; direction: number; speed: number; color: number; affectedByArenaRotation: boolean };
  private bgLastSpawn = 0;

  /**
   * Z8b: Set up background particle system.
   * Call once when arena config loads.
   */
  initBackgroundParticles(config: {
    type: string;
    density?: number;
    direction?: number;
    speed?: number;
    color?: string;
    affectedByArenaRotation?: boolean;
  }, bgLayer: PIXI.Container): void {
    this.bgParticleLayer = bgLayer;
    const colorMap: Record<string, number> = {
      snow: 0xddeeff, rain: 0x88aadd, embers: 0xff8822, leaves: 0x55aa33,
      bubbles: 0x66aaff, sparks: 0xffcc44, pollen: 0xeedd55,
      ash: 0xaaaaaa, stars: 0xffffff, glitch_pixels: 0x00ffaa,
    };
    this.bgParticleConfig = {
      type: config.type,
      density: config.density ?? 20,
      direction: config.direction ?? 0,
      speed: config.speed ?? 1.0,
      color: config.color ? parseInt(config.color.replace("#", ""), 16) : (colorMap[config.type] ?? 0xffffff),
      affectedByArenaRotation: config.affectedByArenaRotation ?? true,
    };
  }

  /**
   * Z8b: Update background particles each frame.
   */
  tickBackgroundParticles(nowMs: number, dt: number, arenaWidthPx: number, arenaHeightPx: number): void {
    if (!this.bgParticleConfig || !this.bgParticleLayer) return;
    const cfg = this.bgParticleConfig;

    // Spawn new particles
    const spawnInterval = 1000 / cfg.density;
    if (nowMs - this.bgLastSpawn > spawnInterval) {
      this.bgLastSpawn = nowMs;
      const dirRad = ((cfg.direction - 90) * Math.PI) / 180;
      const spd = (30 + Math.random() * 40) * cfg.speed;
      const perp = dirRad + Math.PI / 2;
      // Spawn along the opposite edge
      const startX = (Math.random() - 0.5) * arenaWidthPx;
      const startY = (Math.random() - 0.5) * arenaHeightPx;
      const g = new PIXI.Graphics();
      this.bgParticleLayer.addChild(g);
      this.bgParticles.push({
        g,
        x: startX, y: startY,
        vx: Math.cos(dirRad) * spd + Math.cos(perp) * (Math.random() - 0.5) * 20,
        vy: Math.sin(dirRad) * spd + Math.sin(perp) * (Math.random() - 0.5) * 20,
        life: 0,
        maxLife: 2000 + Math.random() * 3000,
      });
    }

    // Update + draw particles
    const color = cfg.color;
    for (let i = this.bgParticles.length - 1; i >= 0; i--) {
      const p = this.bgParticles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life += dt * 1000;
      const lifeFrac = p.life / p.maxLife;

      p.g.clear();
      if (lifeFrac > 1 || Math.abs(p.x) > arenaWidthPx || Math.abs(p.y) > arenaHeightPx) {
        this.bgParticleLayer.removeChild(p.g);
        p.g.destroy();
        this.bgParticles.splice(i, 1);
        continue;
      }

      const alpha = Math.sin(lifeFrac * Math.PI) * 0.8;
      switch (cfg.type) {
        case "rain":
          p.g.moveTo(p.x, p.y).lineTo(p.x + p.vx * 0.04, p.y + p.vy * 0.04)
            .stroke({ color, width: 1, alpha });
          break;
        case "snow": case "pollen":
          p.g.circle(p.x, p.y, 2).fill({ color, alpha });
          break;
        case "embers": case "sparks":
          p.g.circle(p.x, p.y, 1.5 + Math.random()).fill({ color, alpha });
          break;
        case "bubbles":
          p.g.circle(p.x, p.y, 3).stroke({ color, width: 1, alpha: alpha * 0.6 });
          break;
        case "glitch_pixels":
          p.g.rect(p.x, p.y, 3, 3).fill({ color, alpha });
          break;
        default:
          p.g.circle(p.x, p.y, 2).fill({ color, alpha });
      }
    }
  }

  destroyBackgroundParticles(): void {
    for (const p of this.bgParticles) {
      this.bgParticleLayer?.removeChild(p.g);
      p.g.destroy();
    }
    this.bgParticles = [];
  }

  destroy() {
    this.layer.removeChildren();
    this.obstacleGfx.clear();
    this.obstacleHealthGfx.clear();
    this.pitGfx.clear();
    this.turretGfx.clear();
    this.projectileGfx.clear();
    this.waterGfx.clear();
    this.portalGfx.clear();
    this.loopGfx.clear();
    this.destroyBackgroundParticles();
  }
}

// ─── Helper: HSL → 0xRRGGBB ──────────────────────────────────────────────────

function hslToHex(h: number, s: number, l: number): number {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, gr = 0, b = 0;
  if (h < 60) { r = c; gr = x; }
  else if (h < 120) { r = x; gr = c; }
  else if (h < 180) { gr = c; b = x; }
  else if (h < 240) { gr = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }
  return (((r + m) * 255) << 16) | (((gr + m) * 255) << 8) | ((b + m) * 255);
}

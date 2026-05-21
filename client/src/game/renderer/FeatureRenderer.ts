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
  }
}

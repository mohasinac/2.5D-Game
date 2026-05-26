import { useEffect, useRef, useCallback } from "react";
import * as PIXI from "pixi.js";
import { C } from "@/styles/theme";
import type { ArenaConfig, ArenaShape, ZoneWaterBodyConfig, MoatWaterBodyConfig, WallBasedWaterBodyConfig, ObstacleShape, SpeedPathConfig } from "@/types/arenaConfigNew";

// Game coordinate constants
const ARENA_RES = 1080;       // game arena pixel dimensions
const ARENA_SCALE = 0.45;     // game arena radius = ARENA_RES * ARENA_SCALE = 486px
const EM_TO_PX = 24;          // 1 em/cm = 24 px in game coordinates

// ── theme colors ─────────────────────────────────────────────────────────────
const THEME_COLORS: Record<string, number> = {
  metrocity: 0x3b82f6, forest: 0x10b981, mountains: 0x06b6d4,
  grasslands: 0x84cc16, desert: 0xf59e0b, sea: 0x0ea5e9,
  ocean: 0x0284c7, futuristic: 0x8b5cf6, prehistoric: 0xef4444,
  safari: 0xf97316, riverbank: 0x64748b,
};
const LIQUID_COLORS: Record<string, number> = {
  water: 0x3b82f6, lava: 0xef4444, ice: 0x60a5fa, healing: 0x10b981,
  speedBoost: 0xeab308, quicksand: 0xd97706, oil: 0x374151, poison: 0x8b5cf6,
};

// ── vertex helpers ────────────────────────────────────────────────────────────
function polygonVerts(n: number, r: number): { x: number; y: number }[] {
  const offset = n % 2 === 0 ? -Math.PI / n : -Math.PI / 2;
  return Array.from({ length: n }, (_, i) => ({
    x: r * Math.cos(offset + (2 * Math.PI * i) / n),
    y: r * Math.sin(offset + (2 * Math.PI * i) / n),
  }));
}

function starVerts(n: number, outerR: number, innerR: number): { x: number; y: number }[] {
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i < n * 2; i++) {
    const angle = -Math.PI / 2 + (Math.PI * i) / n;
    const r = i % 2 === 0 ? outerR : innerR;
    pts.push({ x: r * Math.cos(angle), y: r * Math.sin(angle) });
  }
  return pts;
}

function shapeVerts(shape: ArenaShape, r: number): { x: number; y: number }[] | null {
  switch (shape) {
    case "circle":    return null;
    case "triangle":  return polygonVerts(3, r);
    case "square":    return polygonVerts(4, r);
    case "pentagon":  return polygonVerts(5, r);
    case "hexagon":   return polygonVerts(6, r);
    case "heptagon":  return polygonVerts(7, r);
    case "octagon":   return polygonVerts(8, r);
    case "star3":     return starVerts(3, r, r * 0.45);
    case "star4":     return starVerts(4, r, r * 0.42);
    case "star5":     return starVerts(5, r, r * 0.40);
    case "star6":     return starVerts(6, r, r * 0.40);
    case "star7":     return starVerts(7, r, r * 0.38);
    case "star8":     return starVerts(8, r, r * 0.38);
    default:          return null;
  }
}

function lerp2(ax: number, ay: number, bx: number, by: number, t: number) {
  return { x: ax + (bx - ax) * t, y: ay + (by - ay) * t };
}

// ── Obstacle shape renderer ────────────────────────────────────────────────
function drawObstacleShape(gfx: PIXI.Graphics, shape: ObstacleShape | undefined, scale: number, color: number) {
  const S = EM_TO_PX * scale;
  if (!shape) {
    gfx.circle(0, 0, 8 * scale).fill({ color, alpha: 0.8 });
    gfx.circle(0, 0, 8 * scale).stroke({ color: 0xffffff, width: 2, alpha: 0.4 });
    return;
  }
  switch (shape.kind) {
    case "circle": {
      const r = shape.radiusCm * S;
      gfx.circle(0, 0, r).fill({ color, alpha: 0.8 });
      gfx.circle(0, 0, r).stroke({ color: 0xffffff, width: 2, alpha: 0.4 });
      break;
    }
    case "ring": {
      const rMid = ((shape.innerRadiusCm + shape.outerRadiusCm) / 2) * S;
      const rW = Math.max(1, (shape.outerRadiusCm - shape.innerRadiusCm) * S);
      gfx.circle(0, 0, rMid).stroke({ color, width: rW, alpha: 0.85 });
      break;
    }
    case "arc": {
      const r = shape.radiusCm * S;
      const s0 = (shape.startDeg - 90) * (Math.PI / 180);
      const s1 = (shape.endDeg - 90) * (Math.PI / 180);
      gfx.arc(0, 0, r, s0, s1).stroke({ color, width: Math.max(1, shape.thicknessCm * S), alpha: 0.85 });
      break;
    }
    case "spiral": {
      const ir = shape.innerRadiusCm * S;
      const or = shape.outerRadiusCm * S;
      const steps = 120;
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const theta = t * shape.turns * Math.PI * 2;
        const rad = ir + t * (or - ir);
        const x = rad * Math.cos(theta), y = rad * Math.sin(theta);
        if (i === 0) gfx.moveTo(x, y); else gfx.lineTo(x, y);
      }
      gfx.stroke({ color, width: Math.max(1, shape.thicknessCm * S), alpha: 0.85 });
      break;
    }
    case "polyline": {
      shape.points.forEach((pt, i) => {
        const x = pt.x_cm * S, y = pt.y_cm * S;
        if (i === 0) gfx.moveTo(x, y); else gfx.lineTo(x, y);
      });
      if (shape.closed && shape.points.length > 0) gfx.lineTo(shape.points[0].x_cm * S, shape.points[0].y_cm * S);
      gfx.stroke({ color, width: Math.max(1, shape.thicknessCm * S), alpha: 0.85 });
      break;
    }
    case "bezier": {
      const pts = shape.controlPoints;
      if (pts.length >= 2) {
        gfx.moveTo(pts[0].x_cm * S, pts[0].y_cm * S);
        for (let i = 1; i + 2 < pts.length; i += 3) {
          gfx.bezierCurveTo(pts[i].x_cm * S, pts[i].y_cm * S, pts[i+1].x_cm * S, pts[i+1].y_cm * S, pts[i+2].x_cm * S, pts[i+2].y_cm * S);
        }
        gfx.stroke({ color, width: Math.max(1, shape.thicknessCm * S), alpha: 0.85 });
      }
      break;
    }
    case "rectangle": {
      const hw = (shape.widthCm / 2) * S, hh = (shape.heightCm / 2) * S;
      gfx.rect(-hw, -hh, shape.widthCm * S, shape.heightCm * S).fill({ color, alpha: 0.8 });
      break;
    }
    case "cross": {
      const arm = shape.armLengthCm * S, aw = (shape.armWidthCm / 2) * S;
      gfx.rect(-arm, -aw, arm * 2, aw * 2).fill({ color, alpha: 0.8 });
      gfx.rect(-aw, -arm, aw * 2, arm * 2).fill({ color, alpha: 0.8 });
      break;
    }
    case "L_shape": {
      const long = shape.longArmCm * S, short = shape.shortArmCm * S, tk = shape.thicknessCm * S;
      gfx.rect(0, -long / 2, tk, long).fill({ color, alpha: 0.8 });
      gfx.rect(0, long / 2 - tk, short, tk).fill({ color, alpha: 0.8 });
      break;
    }
    case "T_shape": {
      const tw = shape.widthCm * S, th = shape.heightCm * S, tk = shape.thicknessCm * S;
      gfx.rect(-tw / 2, -th / 2, tw, tk).fill({ color, alpha: 0.8 });
      gfx.rect(-tk / 2, -th / 2, tk, th).fill({ color, alpha: 0.8 });
      break;
    }
    case "zigzag": {
      const segLen = shape.segmentLengthCm * S, zigW = (shape.zigWidthCm / 2) * S;
      gfx.moveTo(0, 0);
      for (let i = 0; i < shape.segmentCount; i++) {
        gfx.lineTo((i + 1) * segLen, i % 2 === 0 ? zigW : -zigW);
      }
      gfx.stroke({ color, width: Math.max(1, shape.thicknessCm * S), alpha: 0.85 });
      break;
    }
    case "star_shape": {
      const sv = starVerts(shape.points, shape.outerRadiusCm * S, shape.innerRadiusCm * S);
      gfx.poly(sv.flatMap(p => [p.x, p.y])).fill({ color, alpha: 0.8 });
      break;
    }
    case "pinball_bumper": {
      const r = shape.radiusCm * S;
      gfx.circle(0, 0, r).fill({ color, alpha: 0.9 });
      gfx.circle(0, 0, r * 0.65).fill({ color: 0xffffff, alpha: 0.2 });
      gfx.circle(0, 0, r).stroke({ color: 0xffffff, width: 2, alpha: 0.5 });
      break;
    }
    case "wrecking_ball": {
      const r = shape.radiusCm * S;
      const cLen = Math.min(shape.cableLength * S, 60 * scale);
      gfx.moveTo(0, 0).lineTo(cLen, 0).stroke({ color: 0x9ca3af, width: 2, alpha: 0.7 });
      gfx.circle(cLen, 0, r).fill({ color, alpha: 0.9 });
      gfx.circle(cLen, 0, r).stroke({ color: 0xffffff, width: 2, alpha: 0.4 });
      break;
    }
  }
}

// ── Speed path shape renderer ───────────────────────────────────────────────
function drawSpeedPathShape(gfx: PIXI.Graphics, sp: SpeedPathConfig, scale: number) {
  const r = sp.radius * EM_TO_PX * scale;
  const hexColor = sp.color ? parseInt((sp.color).replace("#", "0x"), 16) : 0xeab308;
  const color = isNaN(hexColor) ? 0xeab308 : hexColor;
  const lw = 4;
  const al = 0.7;
  switch (sp.shape) {
    case "circle":
      gfx.circle(0, 0, r).stroke({ color, width: lw, alpha: al });
      break;
    case "ring": {
      const thick = (sp.ringThickness ?? 3) * EM_TO_PX * scale;
      gfx.circle(0, 0, r).stroke({ color, width: lw, alpha: al });
      gfx.circle(0, 0, r + thick).stroke({ color, width: lw, alpha: al * 0.5 });
      break;
    }
    case "oval": {
      const hw = ((sp.width ?? sp.radius * 1.5) * EM_TO_PX * scale) / 2;
      const hh = ((sp.height ?? sp.radius) * EM_TO_PX * scale) / 2;
      gfx.ellipse(0, 0, hw, hh).stroke({ color, width: lw, alpha: al });
      break;
    }
    case "rectangle": {
      const hw = ((sp.width ?? sp.radius * 2) * EM_TO_PX * scale) / 2;
      const hh = ((sp.height ?? sp.radius) * EM_TO_PX * scale) / 2;
      gfx.rect(-hw, -hh, hw * 2, hh * 2).stroke({ color, width: lw, alpha: al });
      break;
    }
    case "pentagon": {
      const v = polygonVerts(5, r);
      gfx.poly(v.flatMap(p => [p.x, p.y])).stroke({ color, width: lw, alpha: al });
      break;
    }
    case "hexagon": {
      const v = polygonVerts(6, r);
      gfx.poly(v.flatMap(p => [p.x, p.y])).stroke({ color, width: lw, alpha: al });
      break;
    }
    case "octagon": {
      const v = polygonVerts(8, r);
      gfx.poly(v.flatMap(p => [p.x, p.y])).stroke({ color, width: lw, alpha: al });
      break;
    }
    case "star": {
      const sv = starVerts(5, r, r * 0.5);
      gfx.poly(sv.flatMap(p => [p.x, p.y])).stroke({ color, width: lw, alpha: al });
      break;
    }
    case "spiral": {
      const turns = sp.spiralTurns ?? 2;
      const ir = (sp.spiralInnerRadius ?? sp.radius * 0.3) * EM_TO_PX * scale;
      const steps = 150;
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const theta = t * turns * Math.PI * 2;
        const rad = ir + t * (r - ir);
        const x = rad * Math.cos(theta), y = rad * Math.sin(theta);
        if (i === 0) gfx.moveTo(x, y); else gfx.lineTo(x, y);
      }
      gfx.stroke({ color, width: lw, alpha: al });
      break;
    }
    case "figure_8": {
      const lw2 = (sp.figure8LobeWidth ?? sp.radius) * EM_TO_PX * scale;
      const lh = r * 0.65;
      gfx.ellipse(0, -lh * 0.5, lw2 / 2, lh * 0.5).stroke({ color, width: lw, alpha: al });
      gfx.ellipse(0, lh * 0.5, lw2 / 2, lh * 0.5).stroke({ color, width: lw, alpha: al * 0.7 });
      break;
    }
    case "zigzag": {
      const segs = 8;
      const segLen = (r * 2) / segs;
      const zigH = r * 0.4;
      gfx.moveTo(-r, 0);
      for (let i = 0; i <= segs; i++) gfx.lineTo(-r + i * segLen, i % 2 === 0 ? -zigH : zigH);
      gfx.stroke({ color, width: lw, alpha: al });
      break;
    }
    case "custom_bezier": {
      const pts = sp.bezierControlPoints ?? [];
      if (pts.length >= 2) {
        gfx.moveTo(pts[0].x * EM_TO_PX * scale, pts[0].y * EM_TO_PX * scale);
        for (let i = 1; i + 2 < pts.length; i += 3) {
          gfx.bezierCurveTo(
            pts[i].x * EM_TO_PX * scale, pts[i].y * EM_TO_PX * scale,
            pts[i+1].x * EM_TO_PX * scale, pts[i+1].y * EM_TO_PX * scale,
            pts[i+2].x * EM_TO_PX * scale, pts[i+2].y * EM_TO_PX * scale,
          );
        }
        gfx.stroke({ color, width: lw, alpha: al });
      }
      break;
    }
    default:
      gfx.circle(0, 0, r).stroke({ color, width: lw, alpha: al });
  }
}

// ── main component ────────────────────────────────────────────────────────────
interface Props {
  arena: ArenaConfig;
  width?: number; // kept for API compatibility but ignored — container fills parent
}

export default function ArenaPreview({ arena }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  // True only after await app.init() completes — guards rebuildScene from accessing
  // app.screen before _renderer is initialized (crashes: "this.renderer is undefined").
  const appInitializedRef = useRef(false);
  const arenaContainerRef = useRef<PIXI.Container | null>(null);
  const rotationRef = useRef(0);
  // Always-current ref — avoids stale closures in ticker and rebuildScene
  const arenaRef = useRef(arena);
  arenaRef.current = arena;

  // Stable rebuild — all dynamic values computed from refs + app.screen dimensions
  const rebuildScene = useCallback(() => {
    const app = appRef.current;
    if (!app || !appInitializedRef.current || app.screen.width === 0) return;

    app.stage.removeChildren();

    const w = app.screen.width;
    const h = app.screen.height;
    const cx = w / 2;
    const cy = h / 2;
    // displayR: arena preview radius in CSS pixels (45% of shorter side, matching game ratio)
    const displayR = Math.min(w, h) * ARENA_SCALE;
    // scale: maps game pixel coordinates (relative to game center) → preview pixel offset
    const scale = displayR / (ARENA_RES * ARENA_SCALE); // = Math.min(w, h) / ARENA_RES

    const cur = arenaRef.current;
    const themeColor = THEME_COLORS[cur.theme] ?? 0x3b82f6;
    const verts = shapeVerts(cur.shape, displayR);

    // Background
    const bg = new PIXI.Graphics();
    bg.rect(0, 0, w, h).fill(0x111827);
    app.stage.addChild(bg);

    // Arena container (rotates when autoRotate)
    const cont = new PIXI.Container();
    cont.position.set(cx, cy);
    // Restore saved rotation — prevents arena snapping to 0 on config change or resize
    cont.rotation = rotationRef.current;
    arenaContainerRef.current = cont;

    // ── Arena floor ──────────────────────────────────────────────────────────
    const floor = new PIXI.Graphics();
    if (verts) {
      floor.poly(verts.flatMap(v => [v.x, v.y])).fill({ color: themeColor, alpha: 0.15 });
    } else {
      floor.circle(0, 0, displayR).fill({ color: themeColor, alpha: 0.15 });
    }
    cont.addChild(floor);

    // ── Speed paths ──────────────────────────────────────────────────────────
    (cur.speedPaths ?? []).forEach(sp => {
      const spGfx = new PIXI.Graphics();
      drawSpeedPathShape(spGfx, sp, scale);
      cont.addChild(spGfx);
    });

    // ── Water bodies ─────────────────────────────────────────────────────────
    (cur.waterBodies ?? []).forEach(wb => {
      const color = LIQUID_COLORS[wb.liquidType] ?? 0x3b82f6;

      if (wb.type === "zone") {
        const z = wb as ZoneWaterBodyConfig;
        const px = (z.position?.x ?? 0) * EM_TO_PX * scale;
        const py = (z.position?.y ?? 0) * EM_TO_PX * scale;
        const rot = ((z.rotation ?? 0) * Math.PI) / 180;
        const zoneGfx = new PIXI.Graphics();

        switch (z.shape) {
          case "square": {
            const r = (z.radius ?? 5) * EM_TO_PX * scale;
            zoneGfx.rect(-r, -r, r * 2, r * 2).fill({ color, alpha: 0.55 });
            break;
          }
          case "rectangle": {
            const hw = ((z.width ?? 5) * EM_TO_PX * scale) / 2;
            const hh = ((z.height ?? 3) * EM_TO_PX * scale) / 2;
            zoneGfx.rect(-hw, -hh, hw * 2, hh * 2).fill({ color, alpha: 0.55 });
            break;
          }
          case "oval": {
            const hw = ((z.width ?? z.radius ?? 5) * EM_TO_PX * scale) / 2;
            const hh = ((z.height ?? z.radius ?? 3) * EM_TO_PX * scale) / 2;
            zoneGfx.ellipse(0, 0, hw, hh).fill({ color, alpha: 0.55 });
            break;
          }
          default: { // "circle"
            const r = (z.radius ?? 5) * EM_TO_PX * scale;
            zoneGfx.circle(0, 0, r).fill({ color, alpha: 0.55 });
          }
        }

        const zoneCont = new PIXI.Container();
        zoneCont.position.set(px, py);
        zoneCont.rotation = rot;
        zoneCont.addChild(zoneGfx);
        cont.addChild(zoneCont);

      } else if (wb.type === "moat") {
        const m = wb as MoatWaterBodyConfig;
        const r1 = m.distanceFromArena * EM_TO_PX * scale;
        const r2 = r1 + m.thickness * EM_TO_PX * scale;
        const wGfx = new PIXI.Graphics();
        wGfx.circle(0, 0, r2).fill({ color, alpha: 0.45 });
        wGfx.circle(0, 0, r1).fill({ color: 0x111827, alpha: 1 });
        cont.addChild(wGfx);

      } else { // "wall-based"
        const w = wb as WallBasedWaterBodyConfig;
        const thick = w.thickness * EM_TO_PX * scale;
        const offset = (w.offsetFromEdge ?? 0) * EM_TO_PX * scale;
        const outerR = displayR - offset;
        const innerR = Math.max(0, outerR - thick);
        const wGfx = new PIXI.Graphics();

        // Draw water ring: outer fill → erase center → restore arena floor tint
        if (!verts) {
          wGfx.circle(0, 0, outerR).fill({ color, alpha: 0.4 });
          wGfx.circle(0, 0, innerR).fill({ color: 0x111827, alpha: 1 });
          wGfx.circle(0, 0, innerR).fill({ color: themeColor, alpha: 0.15 });
        } else {
          const oF = outerR / displayR;
          const iF = innerR / displayR;
          const outerPts = verts.flatMap(v => [v.x * oF, v.y * oF]);
          const innerPts = verts.flatMap(v => [v.x * iF, v.y * iF]);
          wGfx.poly(outerPts).fill({ color, alpha: 0.4 });
          wGfx.poly(innerPts).fill({ color: 0x111827, alpha: 1 });
          wGfx.poly(innerPts).fill({ color: themeColor, alpha: 0.15 });
        }
        cont.addChild(wGfx);
      }
    });

    // ── Pits ─────────────────────────────────────────────────────────────────
    (cur.pits ?? []).forEach(pit => {
      const px = (pit.position?.x ?? 0) * EM_TO_PX * scale;
      const py = (pit.position?.y ?? 0) * EM_TO_PX * scale;
      const r  = (pit.radius ?? 2) * EM_TO_PX * scale;
      const pGfx = new PIXI.Graphics();
      pGfx.circle(px, py, r).fill(0x111111);
      pGfx.circle(px, py, r).stroke({ color: 0x374151, width: 2 });
      cont.addChild(pGfx);
    });

    // ── Portals ───────────────────────────────────────────────────────────────
    const PORTAL_COLORS = [0xa855f7, 0x06b6d4, 0x10b981, 0xf97316];
    (cur.portals ?? []).forEach((portal, i) => {
      const px = (portal.position?.x ?? 0) * EM_TO_PX * scale;
      const py = (portal.position?.y ?? 0) * EM_TO_PX * scale;
      const r  = (portal.radius ?? 3) * EM_TO_PX * scale;
      const color = PORTAL_COLORS[i % 4];
      const pGfx = new PIXI.Graphics();
      pGfx.circle(px, py, r).fill({ color, alpha: 0.3 });
      pGfx.circle(px, py, r).stroke({ color, width: 3 });
      cont.addChild(pGfx);
    });

    // ── Spin zones ────────────────────────────────────────────────────────────
    ((cur as any).spinZones ?? []).forEach((sz: any) => {
      const px = (sz.x_cm ?? 0) * EM_TO_PX * scale;
      const py = (sz.y_cm ?? 0) * EM_TO_PX * scale;
      const r  = (sz.radius_cm ?? 5) * EM_TO_PX * scale;
      const szColor = sz.direction === "cw" ? 0x38bdf8 : 0xa78bfa;
      const szGfx = new PIXI.Graphics();
      szGfx.circle(0, 0, r).fill({ color: szColor, alpha: 0.12 });
      szGfx.circle(0, 0, r).stroke({ color: szColor, width: 2, alpha: 0.6 });
      const aLen = Math.min(r * 0.55, 20 * scale);
      const ad = sz.direction === "cw" ? 1 : -1;
      szGfx.moveTo(-aLen, ad * aLen * 0.45).lineTo(0, 0).lineTo(aLen, ad * aLen * 0.45).stroke({ color: szColor, width: 2, alpha: 0.8 });
      const szC = new PIXI.Container(); szC.position.set(px, py); szC.addChild(szGfx); cont.addChild(szC);
    });

    // ── Bumps ─────────────────────────────────────────────────────────────────
    ((cur as any).bumps ?? []).forEach((bump: any) => {
      const px = (bump.x_cm ?? 0) * EM_TO_PX * scale;
      const py = (bump.y_cm ?? 0) * EM_TO_PX * scale;
      const r  = (bump.radius_cm ?? 2) * EM_TO_PX * scale;
      const bGfx = new PIXI.Graphics();
      bGfx.circle(0, 0, r).fill({ color: 0xfbbf24, alpha: 0.6 });
      const ts = r * 0.5;
      bGfx.poly([-ts, ts * 0.4, 0, -ts * 0.75, ts, ts * 0.4]).fill({ color: 0xffffff, alpha: 0.75 });
      const bC = new PIXI.Container(); bC.position.set(px, py); bC.addChild(bGfx); cont.addChild(bC);
    });

    // ── Gravity holes ─────────────────────────────────────────────────────────
    ((cur as any).gravityHoles ?? []).forEach((gh: any) => {
      const px = (gh.x_cm ?? 0) * EM_TO_PX * scale;
      const py = (gh.y_cm ?? 0) * EM_TO_PX * scale;
      const r  = (gh.effectiveRadiusCm ?? 6) * EM_TO_PX * scale;
      const ghGfx = new PIXI.Graphics();
      for (let i = 3; i >= 1; i--) {
        ghGfx.circle(0, 0, r * (i / 3)).stroke({ color: 0x6d28d9, width: 1.5, alpha: 0.25 + i * 0.15 });
      }
      ghGfx.circle(0, 0, r * 0.15).fill({ color: 0x6d28d9, alpha: 0.85 });
      const ghC = new PIXI.Container(); ghC.position.set(px, py); ghC.addChild(ghGfx); cont.addChild(ghC);
    });

    // ── Obstacles ─────────────────────────────────────────────────────────────
    (cur.obstacles ?? []).forEach(obs => {
      const px = (obs.x ?? 0) * EM_TO_PX * scale;
      const py = (obs.y ?? 0) * EM_TO_PX * scale;
      const oGfx = new PIXI.Graphics();
      if (obs.shape) {
        drawObstacleShape(oGfx, obs.shape, scale, themeColor);
      } else {
        // legacy fallback: radius is stored in game pixels
        const r = (obs.radius ?? 15) * scale;
        oGfx.circle(0, 0, r).fill({ color: themeColor, alpha: 0.8 });
        oGfx.circle(0, 0, r).stroke({ color: 0xffffff, width: 2, alpha: 0.5 });
      }
      const oC = new PIXI.Container(); oC.position.set(px, py); oC.addChild(oGfx); cont.addChild(oC);
    });

    // ── Turrets ───────────────────────────────────────────────────────────────
    (cur.turrets ?? []).forEach(turret => {
      const px = (turret.x ?? 0) * EM_TO_PX * scale;
      const py = (turret.y ?? 0) * EM_TO_PX * scale;
      const r  = (turret.radius ?? 20) * EM_TO_PX * scale;
      const tGfx = new PIXI.Graphics();
      tGfx.circle(0, 0, r).fill({ color: 0xef4444, alpha: 0.85 });
      tGfx.moveTo(-r * 0.7, 0).lineTo(r * 0.7, 0).stroke({ color: 0xffffff, width: 2, alpha: 0.8 });
      tGfx.moveTo(0, -r * 0.7).lineTo(0, r * 0.7).stroke({ color: 0xffffff, width: 2, alpha: 0.8 });
      const tC = new PIXI.Container(); tC.position.set(px, py); tC.addChild(tGfx); cont.addChild(tC);
    });

    // ── Switches ──────────────────────────────────────────────────────────────
    ((cur as any).switches ?? []).forEach((sw: any) => {
      const px = (sw.x ?? 0) * EM_TO_PX * scale;
      const py = (sw.y ?? 0) * EM_TO_PX * scale;
      const sz = 10 * scale;
      const swGfx = new PIXI.Graphics();
      swGfx.poly([0, -sz, sz, 0, 0, sz, -sz, 0]).fill({ color: 0xfbbf24, alpha: 0.9 });
      swGfx.poly([0, -sz, sz, 0, 0, sz, -sz, 0]).stroke({ color: 0xffffff, width: 1.5, alpha: 0.6 });
      const swC = new PIXI.Container(); swC.position.set(px, py); swC.addChild(swGfx); cont.addChild(swC);
    });

    // ── Arena boundary (drawn on top of features) ─────────────────────────────
    const boundary = new PIXI.Graphics();
    if (verts) {
      boundary.poly(verts.flatMap(v => [v.x, v.y])).stroke({ color: themeColor, width: 5, alpha: 1 });
    } else {
      boundary.circle(0, 0, displayR).stroke({ color: themeColor, width: 5 });
    }
    cont.addChild(boundary);

    // ── Wall segments ─────────────────────────────────────────────────────────
    if (cur.wall?.enabled && cur.wall.edges?.length) {
      const wallGfx = new PIXI.Graphics();
      const wallColor = 0xe5e7eb;
      const exitColor = 0xef4444;
      const wallThick = 6;

      if (cur.shape === "circle") {
        const edge = cur.wall.edges[0];
        if (edge?.walls?.length) {
          edge.walls.forEach(w => {
            const startAngle = (w.position / 100) * 2 * Math.PI - Math.PI / 2;
            const endAngle = ((w.position + w.width) / 100) * 2 * Math.PI - Math.PI / 2;
            wallGfx.arc(0, 0, displayR, startAngle, endAngle)
              .stroke({ color: wallColor, width: wallThick + 2 });
          });
        }
      } else if (verts) {
        cur.wall.edges.forEach((edge, ei) => {
          if (ei >= verts.length) return;
          const va = verts[ei];
          const vb = verts[(ei + 1) % verts.length];
          if (!edge?.walls?.length) {
            wallGfx.moveTo(va.x, va.y).lineTo(vb.x, vb.y).stroke({ color: exitColor, width: wallThick, alpha: 0.7 });
            return;
          }
          let covered = 0;
          const sortedWalls = [...edge.walls].sort((a, b) => a.position - b.position);
          sortedWalls.forEach(w => {
            const gap = w.position - covered;
            if (gap > 1) {
              const s = lerp2(va.x, va.y, vb.x, vb.y, covered / 100);
              const e = lerp2(va.x, va.y, vb.x, vb.y, w.position / 100);
              wallGfx.moveTo(s.x, s.y).lineTo(e.x, e.y).stroke({ color: exitColor, width: wallThick, alpha: 0.7 });
            }
            const ws = lerp2(va.x, va.y, vb.x, vb.y, w.position / 100);
            const we = lerp2(va.x, va.y, vb.x, vb.y, (w.position + w.width) / 100);
            wallGfx.moveTo(ws.x, ws.y).lineTo(we.x, we.y).stroke({ color: wallColor, width: wallThick + 2 });
            covered = w.position + w.width;
          });
          if (covered < 99) {
            const s = lerp2(va.x, va.y, vb.x, vb.y, covered / 100);
            wallGfx.moveTo(s.x, s.y).lineTo(vb.x, vb.y).stroke({ color: exitColor, width: wallThick, alpha: 0.7 });
          }
        });
      }
      cont.addChild(wallGfx);
    }

    // ── Center dot ───────────────────────────────────────────────────────────
    const center = new PIXI.Graphics();
    center.circle(0, 0, 6).fill({ color: themeColor, alpha: 0.6 });
    cont.addChild(center);

    app.stage.addChild(cont);
  }, []); // Stable — reads from refs + app

  // Init PixiJS once
  useEffect(() => {
    if (!containerRef.current) return;
    let cancelled = false;
    const app = new PIXI.Application();
    // Do NOT set appRef.current here — set it only after init() completes.
    // Setting it before init causes rebuildScene() to access app.screen while
    // _renderer is still undefined, crashing with "this.renderer is undefined".

    (async () => {
      const size = containerRef.current!.offsetWidth || 400;
      await app.init({
        width: size,
        height: size,
        antialias: true,
        resolution: 1,        // keep it simple for a UI preview — no HiDPI scaling
        autoDensity: false,   // we manage canvas CSS sizing ourselves
        backgroundAlpha: 1,
        background: 0x111827,
      });

      if (cancelled || !containerRef.current) {
        app.destroy(true);
        return;
      }

      // Fill the container; ResizeObserver updates logical dimensions via renderer.resize
      app.canvas.style.display = "block";
      app.canvas.style.width = "100%";
      app.canvas.style.height = "100%";
      containerRef.current.appendChild(app.canvas);

      // Mark ready BEFORE exposing ref so any pending rebuildScene() calls see it.
      appInitializedRef.current = true;
      appRef.current = app;

      rebuildScene();

      app.ticker.add(() => {
        const cont = arenaContainerRef.current;
        const cur = arenaRef.current;
        if (!cont || !cur.autoRotate) return;
        const dir = cur.rotationDirection === "clockwise" ? 1 : -1;
        rotationRef.current += (cur.rotationSpeed / 60 / 60) * dir * (Math.PI / 180) * 60;
        cont.rotation = rotationRef.current;
      });
    })();

    return () => {
      cancelled = true;
      appInitializedRef.current = false;
      try { app.destroy(true, { children: true }); } catch { /* init may still be in flight */ }
      appRef.current = null;
      arenaContainerRef.current = null;
    };
  }, []); // Init once

  // Rebuild when arena config changes
  useEffect(() => {
    if (appRef.current && appInitializedRef.current) rebuildScene();
  }, [arena, rebuildScene]);

  // Respond to container resize
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      const app = appRef.current;
      if (app && appInitializedRef.current && width > 0 && height > 0) {
        app.renderer.resize(width, height);
        rebuildScene();
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [rebuildScene]);

  return (
    <div className="bg-bg2 border border-border-c rounded-xl p-4">
      <div className="text-sm font-semibold text-theme-text mb-3">Live Preview</div>
      <div className="flex justify-center mb-3">
        <div ref={containerRef} className="rounded-lg border-2 border-border-c overflow-hidden w-full aspect-square" />
      </div>
      {/* Feature badges */}
      <div className="text-[11px] text-theme-faint flex flex-wrap gap-2">
        {[
          ["Shape", arena.shape],
          ["Theme", arena.theme],
          ...(arena.obstacles?.length ? [["Obstacles", String(arena.obstacles.length)]] : []),
          ...(arena.waterBodies?.length ? [["Water", String(arena.waterBodies.length)]] : []),
          ...(arena.pits?.length ? [["Pits", String(arena.pits.length)]] : []),
          ...(arena.portals?.length ? [["Portals", String(arena.portals.length)]] : []),
          ...(arena.turrets?.length ? [["Turrets", String(arena.turrets.length)]] : []),
          ...(arena.speedPaths?.length ? [["Speed", String(arena.speedPaths.length)]] : []),
          ...((arena as any).spinZones?.length ? [["SpinZones", String((arena as any).spinZones.length)]] : []),
          ...((arena as any).bumps?.length ? [["Bumps", String((arena as any).bumps.length)]] : []),
          ...((arena as any).gravityHoles?.length ? [["Gravity", String((arena as any).gravityHoles.length)]] : []),
          ...((arena as any).switches?.length ? [["Switches", String((arena as any).switches.length)]] : []),
          ...(arena.autoRotate ? [["Rotating", `${arena.rotationSpeed}°/s`]] : []),
        ].map(([k, v]) => (
          <span key={k} className="bg-bg3 rounded px-[6px] py-[2px] capitalize">
            {k}: <span className="text-theme-text">{v}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

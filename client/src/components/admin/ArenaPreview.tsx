import { useEffect, useRef, useCallback } from "react";
import * as PIXI from "pixi.js";
import { C } from "@/styles/theme";
import type { ArenaConfig, ArenaShape, WaterBodyConfig, ZoneWaterBodyConfig, MoatWaterBodyConfig, WallBasedWaterBodyConfig } from "@/types/arenaConfigNew";

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

// ── main component ────────────────────────────────────────────────────────────
interface Props {
  arena: ArenaConfig;
  width?: number; // kept for API compatibility but ignored — container fills parent
}

export default function ArenaPreview({ arena }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const arenaContainerRef = useRef<PIXI.Container | null>(null);
  const rotationRef = useRef(0);
  // Always-current ref — avoids stale closures in ticker and rebuildScene
  const arenaRef = useRef(arena);
  arenaRef.current = arena;

  // Stable rebuild — all dynamic values computed from refs + app.screen dimensions
  const rebuildScene = useCallback(() => {
    const app = appRef.current;
    if (!app || app.screen.width === 0) return;

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
      const r = sp.radius * EM_TO_PX * scale;
      const spGfx = new PIXI.Graphics();
      spGfx.circle(0, 0, r).stroke({ color: 0xeab308, width: 4, alpha: 0.7 });
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

    // ── Obstacles ─────────────────────────────────────────────────────────────
    (cur.obstacles ?? []).forEach(obs => {
      const px = (obs.x ?? 0) * scale;
      const py = (obs.y ?? 0) * scale;
      const r  = (obs.radius ?? 15) * scale;
      const oGfx = new PIXI.Graphics();
      oGfx.circle(px, py, r).fill({ color: themeColor, alpha: 0.8 });
      oGfx.circle(px, py, r).stroke({ color: 0xffffff, width: 2, alpha: 0.5 });
      cont.addChild(oGfx);
    });

    // ── Turrets ───────────────────────────────────────────────────────────────
    (cur.turrets ?? []).forEach(turret => {
      const px = (turret.x ?? 0) * scale;
      const py = (turret.y ?? 0) * scale;
      const r  = (turret.radius ?? 20) * scale;
      const tGfx = new PIXI.Graphics();
      tGfx.circle(px, py, r).fill({ color: 0xef4444, alpha: 0.85 });
      tGfx.moveTo(px - r * 0.7, py).lineTo(px + r * 0.7, py).stroke({ color: 0xffffff, width: 2, alpha: 0.8 });
      tGfx.moveTo(px, py - r * 0.7).lineTo(px, py + r * 0.7).stroke({ color: 0xffffff, width: 2, alpha: 0.8 });
      cont.addChild(tGfx);
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
    appRef.current = app;

    (async () => {
      const size = containerRef.current!.offsetWidth || 400;
      await app.init({
        width: size,
        height: size,
        antialias: true,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
        backgroundAlpha: 1,
        background: 0x111827,
      });

      if (cancelled || !containerRef.current) {
        app.destroy(true);
        return;
      }

      app.canvas.style.display = "block";
      app.canvas.style.width = "100%";
      app.canvas.style.height = "100%";
      containerRef.current.appendChild(app.canvas);

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
      try { app.destroy(true, { children: true }); } catch { /* init may still be in flight */ }
      appRef.current = null;
      arenaContainerRef.current = null;
    };
  }, []); // Init once

  // Rebuild when arena config changes
  useEffect(() => {
    if (appRef.current) rebuildScene();
  }, [arena, rebuildScene]);

  // Respond to container resize
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      const app = appRef.current;
      if (app && width > 0 && height > 0) {
        app.renderer.resize(width, height);
        rebuildScene();
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [rebuildScene]);

  return (
    <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 12 }}>Live Preview</div>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
        <div ref={containerRef} style={{
          borderRadius: 8,
          border: `2px solid ${C.border}`,
          overflow: "hidden",
          width: "100%",
          aspectRatio: "1 / 1",
        }} />
      </div>
      {/* Feature badges */}
      <div style={{ fontSize: 11, color: C.faint, display: "flex", flexWrap: "wrap", gap: 8 }}>
        {[
          ["Shape", arena.shape],
          ["Theme", arena.theme],
          ...(arena.obstacles?.length ? [["Obstacles", String(arena.obstacles.length)]] : []),
          ...(arena.waterBodies?.length ? [["Water", String(arena.waterBodies.length)]] : []),
          ...(arena.pits?.length ? [["Pits", String(arena.pits.length)]] : []),
          ...(arena.portals?.length ? [["Portals", String(arena.portals.length)]] : []),
          ...(arena.turrets?.length ? [["Turrets", String(arena.turrets.length)]] : []),
          ...(arena.speedPaths?.length ? [["Speed", String(arena.speedPaths.length)]] : []),
          ...(arena.autoRotate ? [["Rotating", `${arena.rotationSpeed}°/s`]] : []),
        ].map(([k, v]) => (
          <span key={k} style={{ background: C.bg3, borderRadius: 4, padding: "2px 6px", textTransform: "capitalize" }}>
            {k}: <span style={{ color: C.text }}>{v}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

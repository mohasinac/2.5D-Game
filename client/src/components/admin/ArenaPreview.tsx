import { useEffect, useRef, useCallback } from "react";
import * as PIXI from "pixi.js";
import { C } from "@/styles/theme";
import type { ArenaConfig, ArenaShape, WaterBodyConfig, ZoneWaterBodyConfig } from "@/types/arenaConfigNew";

const PREVIEW_RES = 800;
const PREVIEW_SIZE = 400;
const ARENA_RES = 1080;
const EM_TO_PX = 24; // 1 em ≈ 24px in game coordinates

interface Props {
  arena: ArenaConfig;
  width?: number;
}

// ── theme colors ────────────────────────────────────────────────────────────
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

// ── vertex helpers ───────────────────────────────────────────────────────────
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

// ── main component ───────────────────────────────────────────────────────────
export default function ArenaPreview({ arena, width = PREVIEW_SIZE }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const arenaContainerRef = useRef<PIXI.Container | null>(null);
  const rotationRef = useRef(0);

  const scale = (PREVIEW_RES / ARENA_RES);          // arena-pixel → canvas-pixel
  const displayR = (ARENA_RES / 2) * scale * 0.90;  // arena display radius (~360px at 800res)
  const themeColor = THEME_COLORS[arena.theme] ?? 0x3b82f6;

  const rebuildScene = useCallback(() => {
    const app = appRef.current;
    if (!app) return;
    app.stage.removeChildren();
    rotationRef.current = 0;

    const cx = PREVIEW_RES / 2;
    const cy = PREVIEW_RES / 2;

    // Background
    const bg = new PIXI.Graphics();
    bg.rect(0, 0, PREVIEW_RES, PREVIEW_RES).fill(0x111827);
    app.stage.addChild(bg);

    // Arena container (rotates when autoRotate)
    const cont = new PIXI.Container();
    cont.position.set(cx, cy);
    arenaContainerRef.current = cont;

    // ── Arena floor ───────────────────────────────────────────────────────
    const floor = new PIXI.Graphics();
    const verts = shapeVerts(arena.shape, displayR);
    if (verts) {
      const pts = verts.flatMap(v => [v.x, v.y]);
      floor.poly(pts).fill({ color: themeColor, alpha: 0.15 });
    } else {
      floor.circle(0, 0, displayR).fill({ color: themeColor, alpha: 0.15 });
    }
    cont.addChild(floor);

    // ── Speed paths ───────────────────────────────────────────────────────
    (arena.speedPaths ?? []).forEach(sp => {
      const r = sp.radius * EM_TO_PX * scale;
      const spGfx = new PIXI.Graphics();
      spGfx.circle(0, 0, r).stroke({ color: 0xeab308, width: 4, alpha: 0.7 });
      cont.addChild(spGfx);
    });

    // ── Water bodies ─────────────────────────────────────────────────────
    (arena.waterBodies ?? []).forEach(wb => {
      const color = LIQUID_COLORS[(wb as any).liquidType ?? "water"] ?? 0x3b82f6;
      const wGfx = new PIXI.Graphics();
      if (wb.type === "zone") {
        const z = wb as ZoneWaterBodyConfig;
        const px = (z.position?.x ?? 0) * EM_TO_PX * scale;
        const py = (z.position?.y ?? 0) * EM_TO_PX * scale;
        const r  = ((z.radius ?? 5)) * EM_TO_PX * scale;
        wGfx.circle(px, py, r).fill({ color, alpha: 0.55 });
      } else if (wb.type === "moat") {
        const m = wb as any;
        const r1 = (m.distanceFromArena ?? 20) * EM_TO_PX * scale;
        const r2 = r1 + (m.thickness ?? 3) * EM_TO_PX * scale;
        wGfx.circle(0, 0, r2).fill({ color, alpha: 0.45 });
        wGfx.circle(0, 0, r1).fill({ color: 0x111827, alpha: 1 });
      } else {
        wGfx.circle(0, 0, displayR).stroke({ color, width: (wb as any).thickness * EM_TO_PX * scale * 0.5, alpha: 0.5 });
      }
      cont.addChild(wGfx);
    });

    // ── Pits ──────────────────────────────────────────────────────────────
    (arena.pits ?? []).forEach(pit => {
      const px = (pit.position?.x ?? 0) * EM_TO_PX * scale;
      const py = (pit.position?.y ?? 0) * EM_TO_PX * scale;
      const r  = (pit.radius ?? 2) * EM_TO_PX * scale;
      const pGfx = new PIXI.Graphics();
      pGfx.circle(px, py, r).fill(0x111111);
      pGfx.circle(px, py, r).stroke({ color: 0x374151, width: 2 });
      cont.addChild(pGfx);
    });

    // ── Portals ───────────────────────────────────────────────────────────
    const PORTAL_COLORS = [0xa855f7, 0x06b6d4, 0x10b981, 0xf97316];
    (arena.portals ?? []).forEach((portal, i) => {
      const px = (portal.position?.x ?? 0) * EM_TO_PX * scale;
      const py = (portal.position?.y ?? 0) * EM_TO_PX * scale;
      const r  = (portal.radius ?? 3) * EM_TO_PX * scale;
      const color = PORTAL_COLORS[i % 4];
      const pGfx = new PIXI.Graphics();
      pGfx.circle(px, py, r).fill({ color, alpha: 0.3 });
      pGfx.circle(px, py, r).stroke({ color, width: 3 });
      cont.addChild(pGfx);
    });

    // ── Obstacles ─────────────────────────────────────────────────────────
    (arena.obstacles ?? []).forEach(obs => {
      const px = (obs.x ?? 0) * scale;
      const py = (obs.y ?? 0) * scale;
      const r  = (obs.radius ?? 15) * scale;
      const oGfx = new PIXI.Graphics();
      oGfx.circle(px, py, r).fill({ color: themeColor, alpha: 0.8 });
      oGfx.circle(px, py, r).stroke({ color: 0xffffff, width: 2, alpha: 0.5 });
      cont.addChild(oGfx);
    });

    // ── Turrets ───────────────────────────────────────────────────────────
    (arena.turrets ?? []).forEach(turret => {
      const px = (turret.x ?? 0) * scale;
      const py = (turret.y ?? 0) * scale;
      const r  = (turret.radius ?? 20) * scale;
      const tGfx = new PIXI.Graphics();
      tGfx.circle(px, py, r).fill({ color: 0xef4444, alpha: 0.85 });
      // Crosshair mark
      tGfx.moveTo(px - r * 0.7, py).lineTo(px + r * 0.7, py).stroke({ color: 0xffffff, width: 2, alpha: 0.8 });
      tGfx.moveTo(px, py - r * 0.7).lineTo(px, py + r * 0.7).stroke({ color: 0xffffff, width: 2, alpha: 0.8 });
      cont.addChild(tGfx);
    });

    // ── Arena boundary (on top) ────────────────────────────────────────────
    const boundary = new PIXI.Graphics();
    if (verts) {
      const pts = verts.flatMap(v => [v.x, v.y]);
      boundary.poly(pts).stroke({ color: themeColor, width: 5, alpha: 1 });
    } else {
      boundary.circle(0, 0, displayR).stroke({ color: themeColor, width: 5 });
    }
    cont.addChild(boundary);

    // ── Wall segments ─────────────────────────────────────────────────────
    if (arena.wall?.enabled && arena.wall.edges?.length) {
      const wallGfx = new PIXI.Graphics();
      const wallColor = 0xe5e7eb;
      const exitColor = 0xef4444;
      const wallThick = 6;

      if (arena.shape === "circle") {
        // Single circular edge: walls/exits as arc segments
        const edge = arena.wall.edges[0];
        if (edge?.walls?.length) {
          edge.walls.forEach(w => {
            const startAngle = (w.position / 100) * 2 * Math.PI - Math.PI / 2;
            const endAngle = ((w.position + w.width) / 100) * 2 * Math.PI - Math.PI / 2;
            wallGfx.arc(0, 0, displayR, startAngle, endAngle)
              .stroke({ color: wallColor, width: wallThick + 2 });
          });
        }
      } else if (verts) {
        // Polygon: walls on each edge
        arena.wall.edges.forEach((edge, ei) => {
          if (ei >= verts.length) return;
          const va = verts[ei];
          const vb = verts[(ei + 1) % verts.length];
          if (!edge?.walls?.length) {
            // No walls = all exit (red)
            wallGfx.moveTo(va.x, va.y).lineTo(vb.x, vb.y).stroke({ color: exitColor, width: wallThick, alpha: 0.7 });
            return;
          }
          // Draw walls and exits
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

    // ── Center dot ────────────────────────────────────────────────────────
    const center = new PIXI.Graphics();
    center.circle(0, 0, 6).fill({ color: themeColor, alpha: 0.6 });
    cont.addChild(center);

    app.stage.addChild(cont);
  }, [arena, displayR, scale, themeColor]);

  // Init PixiJS once
  useEffect(() => {
    if (!containerRef.current) return;
    let cancelled = false;
    const app = new PIXI.Application();
    appRef.current = app;

    (async () => {
      await app.init({
        width: PREVIEW_RES, height: PREVIEW_RES,
        antialias: true, backgroundAlpha: 1, background: 0x111827,
      });
      if (cancelled || !containerRef.current) { app.destroy(true); return; }
      app.canvas.style.width = `${width}px`;
      app.canvas.style.height = `${width}px`;
      app.canvas.style.maxWidth = "100%";
      app.canvas.style.display = "block";
      containerRef.current.appendChild(app.canvas);

      await rebuildScene();

      app.ticker.add(() => {
        const cont = arenaContainerRef.current;
        if (!cont || !arena.autoRotate) return;
        const dir = arena.rotationDirection === "clockwise" ? 1 : -1;
        rotationRef.current += (arena.rotationSpeed / 60 / 60) * dir * (Math.PI / 180) * 60;
        cont.rotation = rotationRef.current;
      });
    })();

    return () => {
      cancelled = true;
      app.destroy(true, { children: true });
      appRef.current = null;
      arenaContainerRef.current = null;
    };
  }, []);

  // Rebuild when arena changes
  useEffect(() => {
    if (appRef.current) rebuildScene();
  }, [rebuildScene]);

  return (
    <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 12 }}>Live Preview</div>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
        <div ref={containerRef} style={{
          borderRadius: 8, border: `2px solid ${C.border}`, overflow: "hidden",
          width: width, maxWidth: "100%", aspectRatio: "1 / 1",
        }} />
      </div>
      {/* Feature counts */}
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

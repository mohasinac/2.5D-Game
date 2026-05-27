// ArenaSystemTopDownView — PixiJS top-down elevation heatmap.
// Fixed to init PIXI.Application once (instead of destroying+recreating on
// every arenaSystem prop change). arenaSystemRef keeps the current value;
// rebuildScene reads from it so the callback stays stable.

import { useRef, useEffect, useCallback } from "react";
import { ArenaSystem } from "@/types/arenaSystem";
import * as PIXI from "pixi.js";

interface Props {
  arenaSystem: ArenaSystem;
}

export function ArenaSystemTopDownView({ arenaSystem }: Props) {
  const containerRef   = useRef<HTMLDivElement>(null);
  const appRef         = useRef<PIXI.Application | null>(null);
  const appInitRef     = useRef(false);
  const arenaSystemRef = useRef(arenaSystem);
  arenaSystemRef.current = arenaSystem;

  const rebuildScene = useCallback(() => {
    const app = appRef.current;
    if (!app || !appInitRef.current) return;

    app.stage.removeChildren();

    const as = arenaSystemRef.current;
    const w  = app.screen.width;
    const h  = app.screen.height;
    const cx = w / 2;
    const cy = h / 2;
    const scale = Math.min(w, h) / Math.max(as.width, as.height) * 0.8;

    // Arena floor
    const floor = new PIXI.Graphics();
    if (as.shape === "circle") {
      const r = Math.min(as.width, as.height) / 2 * scale;
      floor.circle(cx, cy, r).fill({ color: 0x1a2540 });
    } else if (as.shape === "hexagon") {
      const r   = Math.min(as.width, as.height) / 2 * scale;
      const pts: number[] = [];
      for (let i = 0; i < 6; i++) { const a = (Math.PI * 2 * i) / 6; pts.push(cx + Math.cos(a) * r, cy + Math.sin(a) * r); }
      floor.poly(pts).fill({ color: 0x1a2540 });
    } else {
      const fw = as.width * scale;
      const fh = as.height * scale;
      floor.rect(cx - fw / 2, cy - fh / 2, fw, fh).fill({ color: 0x1a2540 });
    }
    app.stage.addChild(floor);

    // Elevation heatmap — 12 pie segments
    const heatR    = Math.min(as.width, as.height) / 2 * scale;
    const elevType = as.elevationMap.type;
    for (let i = 0; i < 12; i++) {
      const angle     = (Math.PI * 2 * i) / 12;
      const nextAngle = (Math.PI * 2 * (i + 1)) / 12;

      let elevation = 0;
      if (elevType === "bowl") {
        elevation = 40;
      } else if (elevType === "pyramid") {
        elevation = -50;
      } else if (elevType === "ramp") {
        const tiltDir = (as.elevationMap.tiltDirection ?? 0) * Math.PI / 180;
        elevation = Math.cos(angle - tiltDir) * 30;
      }

      const norm  = Math.max(-1, Math.min(1, elevation / 50));
      const rCh   = norm > 0 ? Math.floor(norm * 0x66) : 0;
      const bCh   = norm < 0 ? Math.floor(-norm * 0xff) : 0x22;
      const color = (rCh << 16) | bCh;

      const seg = new PIXI.Graphics();
      seg.moveTo(cx, cy);
      seg.lineTo(cx + Math.cos(angle) * heatR, cy + Math.sin(angle) * heatR);
      seg.lineTo(cx + Math.cos(nextAngle) * heatR, cy + Math.sin(nextAngle) * heatR);
      seg.closePath();
      seg.fill({ color, alpha: 0.3 });
      app.stage.addChild(seg);
    }

    // Friction zones
    if (as.slopePhysics.frictionMap) {
      for (const zone of as.slopePhysics.frictionMap) {
        const zx    = cx + (zone.x - as.width  / 2) * scale;
        const zy    = cy + (zone.y - as.height / 2) * scale;
        const zr    = zone.radius * scale;
        const zoneColor = zone.frictionMultiplier > 1 ? 0xff8844 : 0x44ff88;
        const zGfx  = new PIXI.Graphics();
        zGfx.circle(zx, zy, zr).stroke({ color: zoneColor, width: 2, alpha: 0.7 });
        for (let j = 0; j < zr * 2; j += 8) {
          zGfx.moveTo(zx - zr + j, zy - zr).lineTo(zx - zr + j + zr, zy);
        }
        zGfx.stroke({ color: zoneColor, width: 1, alpha: 0.35 });
        app.stage.addChild(zGfx);
      }
    }

    // Wall outline
    const wallGfx = new PIXI.Graphics();
    if (as.shape === "circle") {
      const r = Math.min(as.width, as.height) / 2 * scale;
      wallGfx.circle(cx, cy, r).stroke({ color: 0xffcc44, width: 2, alpha: 1 });
    } else if (as.shape === "hexagon") {
      const r   = Math.min(as.width, as.height) / 2 * scale;
      const pts: number[] = [];
      for (let i = 0; i < 6; i++) { const a = (Math.PI * 2 * i) / 6; pts.push(cx + Math.cos(a) * r, cy + Math.sin(a) * r); }
      wallGfx.poly(pts).stroke({ color: 0xffcc44, width: 2, alpha: 1 });
    } else {
      const fw = as.width * scale;
      const fh = as.height * scale;
      wallGfx.rect(cx - fw / 2, cy - fh / 2, fw, fh).stroke({ color: 0xffcc44, width: 2, alpha: 1 });
    }
    app.stage.addChild(wallGfx);
  }, []);

  // Init once
  useEffect(() => {
    if (!containerRef.current) return;
    let cancelled = false;
    const container = containerRef.current;
    const width  = container.clientWidth  || 500;
    const height = container.clientHeight || 500;
    const app = new PIXI.Application();

    void (async () => {
      await app.init({ width, height, background: 0x0a1520, antialias: true });
      if (cancelled || !containerRef.current) { app.destroy(true); return; }

      appRef.current     = app;
      appInitRef.current = true;
      app.canvas.style.display = "block";
      app.canvas.style.width   = "100%";
      app.canvas.style.height  = "100%";
      container.appendChild(app.canvas);
      rebuildScene();
    })();

    return () => {
      cancelled = true;
      appInitRef.current = false;
      if (appRef.current) {
        try { appRef.current.destroy(true, { children: true }); } catch { /* ok */ }
        appRef.current = null;
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Rebuild when arenaSystem changes
  useEffect(() => {
    if (appRef.current && appInitRef.current) rebuildScene();
  }, [arenaSystem, rebuildScene]);

  return (
    <div
      ref={containerRef}
      className="w-full h-[400px] bg-bg1 rounded-lg border border-border-c overflow-hidden"
    />
  );
}

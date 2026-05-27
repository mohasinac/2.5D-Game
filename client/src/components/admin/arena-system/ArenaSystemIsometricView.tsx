// ArenaSystemIsometricView — PixiJS isometric elevation mesh.
// Fixed to init PIXI.Application once (instead of destroying+recreating on
// every arenaSystem prop change). arenaSystemRef keeps the current value;
// rebuildScene reads from it so the callback stays stable.

import { useRef, useEffect, useCallback } from "react";
import { ArenaSystem } from "@/types/arenaSystem";
import * as PIXI from "pixi.js";

interface Props {
  arenaSystem: ArenaSystem;
}

export function ArenaSystemIsometricView({ arenaSystem }: Props) {
  const containerRef     = useRef<HTMLDivElement>(null);
  const appRef           = useRef<PIXI.Application | null>(null);
  const appInitRef       = useRef(false);
  const arenaSystemRef   = useRef(arenaSystem);
  const isoContainerRef  = useRef<PIXI.Container | null>(null);
  arenaSystemRef.current = arenaSystem;

  // Stable rebuild — reads from ref, never causes re-renders
  const rebuildScene = useCallback(() => {
    const app = appRef.current;
    if (!app || !appInitRef.current) return;

    // Remove previous scene (but keep isoContainer reference for ticker rotation)
    app.stage.removeChildren();

    const as   = arenaSystemRef.current;
    const w    = app.screen.width;
    const h    = app.screen.height;
    const cx   = w / 2;
    const cy   = h / 2;
    const baseScale = Math.min(w, h) / Math.max(as.width, as.height) * 0.6;

    const isoC = new PIXI.Container();
    isoC.position.set(cx, cy);
    // Preserve existing rotation if already set (ticker drives it)
    if (isoContainerRef.current) isoC.rotation = isoContainerRef.current.rotation;
    isoContainerRef.current = isoC;
    app.stage.addChild(isoC);

    const projectIso = (x: number, y: number, z = 0) => ({
      x: (x - y * 0.5) * baseScale + z * 0.3,
      y: (x + y) * 0.4 * baseScale - z * 0.4,
    });

    // Elevation mesh — 9×9 grid of dots
    const gridSize = 8;
    const maxDist  = Math.max(as.width, as.height) / 2;
    const elevType = as.elevationMap.type;

    for (let xi = 0; xi <= gridSize; xi++) {
      for (let yi = 0; yi <= gridSize; yi++) {
        const x    = (xi / gridSize - 0.5) * as.width;
        const y    = (yi / gridSize - 0.5) * as.height;
        const dist = Math.sqrt(x * x + y * y);

        let z = 0;
        if (elevType === "bowl") {
          z = 40 * Math.cos((dist / maxDist) * Math.PI / 2);
        } else if (elevType === "pyramid") {
          z = 50 * Math.max(0, 1 - dist / maxDist);
        } else if (elevType === "ramp") {
          const tiltDir = (as.elevationMap.tiltDirection ?? 0) * Math.PI / 180;
          const angle   = Math.atan2(y, x) - tiltDir;
          const tiltStr = (as.elevationMap.tiltAngle ?? 15) / 30;
          z = Math.cos(angle) * 30 * tiltStr;
        }

        const pos        = projectIso(x, y, z);
        const brightness = Math.max(0.3, Math.min(1.2, 0.5 + z / 100));
        const base       = 0x2288ff;
        const r          = Math.min(255, Math.floor(((base >> 16) & 0xff) * brightness));
        const g          = Math.min(255, Math.floor(((base >> 8)  & 0xff) * brightness));
        const b          = Math.min(255, Math.floor((base & 0xff)          * brightness));

        const dot = new PIXI.Graphics();
        dot.circle(0, 0, 2).fill({ color: (r << 16) | (g << 8) | b });
        dot.position.set(pos.x, pos.y);
        isoC.addChild(dot);
      }
    }

    // Arena outline
    if (as.shape === "circle") {
      const r       = Math.min(as.width, as.height) / 2;
      const outline = new PIXI.Graphics();
      const steps   = 24;
      const first   = projectIso(Math.cos(0) * r, Math.sin(0) * r, 0);
      outline.moveTo(first.x, first.y);
      for (let i = 1; i <= steps; i++) {
        const a = (Math.PI * 2 * i) / steps;
        const p = projectIso(Math.cos(a) * r, Math.sin(a) * r, 0);
        outline.lineTo(p.x, p.y);
      }
      outline.stroke({ color: 0xffcc44, width: 2, alpha: 0.8 });
      isoC.addChild(outline);
    }
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

      appRef.current    = app;
      appInitRef.current = true;
      app.canvas.style.display = "block";
      app.canvas.style.width   = "100%";
      app.canvas.style.height  = "100%";
      container.appendChild(app.canvas);

      rebuildScene();

      // Slow rotation animation — only moves the isoContainer, no rebuild
      app.ticker.add((ticker) => {
        const isoC = isoContainerRef.current;
        if (!isoC) return;
        isoC.rotation += ticker.deltaTime * 0.005;
      });
    })();

    return () => {
      cancelled = true;
      appInitRef.current = false;
      isoContainerRef.current = null;
      if (appRef.current) {
        try { appRef.current.destroy(true, { children: true }); } catch { /* ok */ }
        appRef.current = null;
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Rebuild scene when arenaSystem changes
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

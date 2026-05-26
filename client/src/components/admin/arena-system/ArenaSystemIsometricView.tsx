import { useRef, useEffect } from "react";
import { ArenaSystem } from "@/types/arenaSystem";
import * as PIXI from "pixi.js";

interface Props {
  arenaSystem: ArenaSystem;
}

export function ArenaSystemIsometricView({ arenaSystem }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    let cancelled = false;
    const container = containerRef.current;
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;
    const app = new PIXI.Application();

    void (async () => {
      await app.init({ width, height, background: 0x0a1520, antialias: true });
      if (cancelled) { app.destroy(true); return; }
      appRef.current = app;
      container.appendChild(app.canvas);

      const centerX = width / 2;
      const centerY = height / 2;
      const baseScale = Math.min(width, height) / Math.max(arenaSystem.width, arenaSystem.height) * 0.6;

      // Isometric projection: rotate slowly over time
      const isoContainer = new PIXI.Container();
      isoContainer.position.set(centerX, centerY);
      app.stage.addChild(isoContainer);

      // Project world (x, y, z) → screen (sx, sy) relative to center
      const projectIso = (x: number, y: number, z: number = 0) => ({
        x: (x - y * 0.5) * baseScale + z * 0.3,
        y: (x + y) * 0.4 * baseScale - z * 0.4,
      });

      // Elevation mesh — 9×9 grid of dots
      const gridSize = 8;
      const maxDist = Math.max(arenaSystem.width, arenaSystem.height) / 2;
      const elevType = arenaSystem.elevationMap.type;

      for (let xi = 0; xi <= gridSize; xi++) {
        for (let yi = 0; yi <= gridSize; yi++) {
          const x = (xi / gridSize - 0.5) * arenaSystem.width;
          const y = (yi / gridSize - 0.5) * arenaSystem.height;
          const dist = Math.sqrt(x * x + y * y);

          let z = 0;
          if (elevType === "bowl") {
            z = 40 * Math.cos((dist / maxDist) * Math.PI / 2);
          } else if (elevType === "pyramid") {
            z = 50 * Math.max(0, 1 - dist / maxDist);
          } else if (elevType === "ramp") {
            const tiltDir = (arenaSystem.elevationMap.tiltDirection ?? 0) * Math.PI / 180;
            const angle = Math.atan2(y, x) - tiltDir;
            const tiltStrength = (arenaSystem.elevationMap.tiltAngle ?? 15) / 30;
            z = Math.cos(angle) * 30 * tiltStrength;
          }

          const pos = projectIso(x, y, z);
          const brightness = Math.max(0.3, Math.min(1.2, 0.5 + z / 100));
          const baseColor = 0x2288ff;
          const r = Math.min(255, Math.floor(((baseColor >> 16) & 0xff) * brightness));
          const g = Math.min(255, Math.floor(((baseColor >> 8) & 0xff) * brightness));
          const b = Math.min(255, Math.floor((baseColor & 0xff) * brightness));
          const color = (r << 16) | (g << 8) | b;

          const dot = new PIXI.Graphics();
          dot.circle(0, 0, 2).fill({ color });
          dot.x = pos.x;
          dot.y = pos.y;
          isoContainer.addChild(dot);
        }
      }

      // Arena outline (circle only for now)
      if (arenaSystem.shape === "circle") {
        const r = Math.min(arenaSystem.width, arenaSystem.height) / 2;
        const outline = new PIXI.Graphics();
        const steps = 24;
        const first = projectIso(Math.cos(0) * r, Math.sin(0) * r, 0);
        outline.moveTo(first.x, first.y);
        for (let i = 1; i <= steps; i++) {
          const a = (Math.PI * 2 * i) / steps;
          const p = projectIso(Math.cos(a) * r, Math.sin(a) * r, 0);
          outline.lineTo(p.x, p.y);
        }
        outline.stroke({ color: 0xffcc44, width: 2, alpha: 0.8 });
        isoContainer.addChild(outline);
      }

      // Slow rotation animation
      let rotation = 0;
      app.ticker.add((ticker) => {
        rotation += ticker.deltaTime * 0.005; // slow rotation
        isoContainer.rotation = rotation;
      });
    })();

    return () => {
      cancelled = true;
      if (appRef.current) {
        appRef.current.destroy(true);
        appRef.current = null;
      }
    };
  }, [arenaSystem]);

  return (
    <div
      ref={containerRef}
      className="w-full h-[400px] bg-bg1 rounded-lg border border-border-c overflow-hidden"
    />
  );
}

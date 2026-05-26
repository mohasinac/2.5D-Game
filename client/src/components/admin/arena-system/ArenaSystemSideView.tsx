import { useRef, useEffect } from "react";
import { ArenaSystem } from "@/types/arenaSystem";
import * as PIXI from "pixi.js";

interface Props {
  arenaSystem: ArenaSystem;
}

export function ArenaSystemSideView({ arenaSystem }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    let cancelled = false;
    const container = containerRef.current;
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 400;
    const app = new PIXI.Application();

    void (async () => {
      await app.init({ width, height, background: 0x0a1520, antialias: true });
      if (cancelled) { try { app.destroy(true, { children: true }); } catch { /* ok */ } return; }
      appRef.current = app;
      app.canvas.style.display = "block";
      app.canvas.style.width = "100%";
      app.canvas.style.height = "100%";
      container.appendChild(app.canvas);

      const padding = 60;
      const graphWidth = width - padding * 2;
      const graphHeight = height - padding * 2;
      const startX = padding;
      const startY = height - padding;

      // Axes
      const axes = new PIXI.Graphics();
      axes.moveTo(startX, startY).lineTo(startX + graphWidth, startY); // X axis
      axes.moveTo(startX, startY).lineTo(startX, startY - graphHeight); // Y axis
      axes.stroke({ color: 0x8899aa, width: 1, alpha: 0.5 });
      app.stage.addChild(axes);

      // Floor profile points
      const elevType = arenaSystem.elevationMap.type;
      const maxDist = Math.max(arenaSystem.width, arenaSystem.height) / 2;
      const maxHeight = 100;

      const points: Array<{ x: number; y: number }> = [];

      if (elevType === "flat") {
        points.push({ x: 0, y: 0 }, { x: maxDist, y: 0 });
      } else if (elevType === "bowl") {
        for (let i = 0; i <= 20; i++) {
          const dist = (i / 20) * maxDist;
          const h = 40 * Math.cos((dist / maxDist) * Math.PI / 2);
          points.push({ x: dist, y: -h });
        }
      } else if (elevType === "pyramid") {
        points.push({ x: 0, y: -50 }, { x: maxDist, y: 0 });
      } else if (elevType === "ramp") {
        const tiltAngle = arenaSystem.elevationMap.tiltAngle ?? 15;
        const slope = Math.tan(tiltAngle * Math.PI / 180);
        points.push({ x: 0, y: 0 }, { x: maxDist, y: -slope * maxDist });
      } else {
        points.push({ x: 0, y: 0 }, { x: maxDist, y: 0 });
      }

      if (points.length > 0) {
        const floorLine = new PIXI.Graphics();
        const first = points[0];
        floorLine.moveTo(
          startX + (first.x / maxDist) * graphWidth,
          startY + (first.y / maxHeight) * graphHeight,
        );
        for (let i = 1; i < points.length; i++) {
          const pt = points[i];
          floorLine.lineTo(
            startX + (pt.x / maxDist) * graphWidth,
            startY + (pt.y / maxHeight) * graphHeight,
          );
        }
        floorLine.stroke({ color: 0x88ccff, width: 2, alpha: 1 });
        app.stage.addChild(floorLine);
      }

      // Wall height bar
      const wallHeight = (arenaSystem.wallProfile.baseHeight ?? 100) / maxHeight * graphHeight;
      const wallLine = new PIXI.Graphics();
      wallLine.moveTo(startX + graphWidth, startY);
      wallLine.lineTo(startX + graphWidth, startY - wallHeight);
      wallLine.stroke({ color: 0xffcc44, width: 2, alpha: 0.8 });
      app.stage.addChild(wallLine);

      // Axis labels
      const distLabel = new PIXI.Text({
        text: "Distance from center →",
        style: { fontSize: 12, fill: 0x94a3b8 },
      });
      distLabel.x = startX;
      distLabel.y = height - 20;
      app.stage.addChild(distLabel);

      const heightLabel = new PIXI.Text({
        text: "Height ↑",
        style: { fontSize: 12, fill: 0x94a3b8 },
      });
      heightLabel.x = 10;
      heightLabel.y = startY - graphHeight - 10;
      app.stage.addChild(heightLabel);
    })();

    return () => {
      cancelled = true;
      if (appRef.current) {
        try { appRef.current.destroy(true, { children: true }); } catch { /* texture pool may already be destroyed */ }
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

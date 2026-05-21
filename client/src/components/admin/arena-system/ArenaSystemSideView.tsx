import { useRef, useEffect } from "react";
import { ArenaSystem } from "@/types/arenaSystem";
import { C } from "@/styles/theme";
import * as PIXI from "pixi.js";

interface Props {
  arenaSystem: ArenaSystem;
}

export function ArenaSystemSideView({ arenaSystem }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth || 500;
    const height = containerRef.current.clientHeight || 400;

    const app = new PIXI.Application({
      width,
      height,
      backgroundColor: 0x0a1520,
      antialias: true,
    });
    containerRef.current.appendChild(app.canvas);
    appRef.current = app;

    const padding = 60;
    const graphWidth = width - padding * 2;
    const graphHeight = height - padding * 2;
    const startX = padding;
    const startY = height - padding;

    // X-axis (distance from center)
    const axisX = new PIXI.Graphics();
    axisX.lineStyle(1, C.muted, 0.5);
    axisX.moveTo(startX, startY);
    axisX.lineTo(startX + graphWidth, startY);
    app.stage.addChild(axisX);

    // Y-axis (height)
    const axisY = new PIXI.Graphics();
    axisY.lineStyle(1, C.muted, 0.5);
    axisY.moveTo(startX, startY);
    axisY.lineTo(startX, startY - graphHeight);
    app.stage.addChild(axisY);

    // Floor profile
    const floor = new PIXI.Graphics();
    floor.lineStyle(2, 0x88ccff, 1);

    const elevType = arenaSystem.elevationMap.type;
    const maxDist = Math.max(arenaSystem.width, arenaSystem.height) / 2;
    const maxHeight = 100;

    const points: Array<{ x: number; y: number }> = [];

    if (elevType === "flat") {
      points.push({ x: 0, y: 0 });
      points.push({ x: maxDist, y: 0 });
    } else if (elevType === "bowl") {
      for (let i = 0; i <= 20; i++) {
        const dist = (i / 20) * maxDist;
        const h = 40 * Math.cos((dist / maxDist) * Math.PI / 2); // Bowl curve
        points.push({ x: dist, y: -h });
      }
    } else if (elevType === "pyramid") {
      points.push({ x: 0, y: 50 }); // Center peak
      points.push({ x: maxDist, y: 0 });
    } else if (elevType === "ramp") {
      const tiltAngle = arenaSystem.elevationMap.tiltAngle ?? 15;
      const slope = Math.tan(tiltAngle * Math.PI / 180);
      points.push({ x: 0, y: 0 });
      points.push({ x: maxDist, y: -slope * maxDist });
    } else {
      points.push({ x: 0, y: 0 });
      points.push({ x: maxDist, y: 0 });
    }

    // Draw floor profile
    if (points.length > 0) {
      const firstPoint = points[0];
      const px = startX + (firstPoint.x / maxDist) * graphWidth;
      const py = startY + (firstPoint.y / maxHeight) * graphHeight;
      floor.moveTo(px, py);

      for (let i = 1; i < points.length; i++) {
        const point = points[i];
        const px = startX + (point.x / maxDist) * graphWidth;
        const py = startY + (point.y / maxHeight) * graphHeight;
        floor.lineTo(px, py);
      }
    }
    app.stage.addChild(floor);

    // Wall height bar
    const wallHeight = (arenaSystem.wallProfile.baseHeight ?? 100) / maxHeight * graphHeight;
    const wallGraphics = new PIXI.Graphics();
    wallGraphics.lineStyle(2, 0xffcc44, 0.8);
    wallGraphics.moveTo(startX + graphWidth, startY);
    wallGraphics.lineTo(startX + graphWidth, startY - wallHeight);
    app.stage.addChild(wallGraphics);

    // Labels
    const distLabel = new PIXI.Text("Distance from center →", { fontSize: 12, fill: C.muted });
    distLabel.x = startX;
    distLabel.y = height - 20;
    app.stage.addChild(distLabel);

    const heightLabel = new PIXI.Text("Height ↑", { fontSize: 12, fill: C.muted });
    heightLabel.x = 10;
    heightLabel.y = startY - graphHeight - 10;
    app.stage.addChild(heightLabel);

    return () => {
      app.destroy(true);
    };
  }, [arenaSystem]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: 400,
        background: C.bg1,
        borderRadius: 8,
        border: `1px solid ${C.border}`,
        overflow: "hidden",
      }}
    />
  );
}

import { useRef, useEffect } from "react";
import { ArenaSystem } from "@/types/arenaSystem";
import { C } from "@/styles/theme";
import * as PIXI from "pixi.js";

interface Props {
  arenaSystem: ArenaSystem;
}

export function ArenaSystemTopDownView({ arenaSystem }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth || 500;
    const height = containerRef.current.clientHeight || 500;

    const app = new PIXI.Application({
      width,
      height,
      backgroundColor: 0x0a1520,
      antialias: true,
    });
    containerRef.current.appendChild(app.canvas);
    appRef.current = app;

    const centerX = width / 2;
    const centerY = height / 2;
    const scale = Math.min(width, height) / Math.max(arenaSystem.width, arenaSystem.height) * 0.8;

    // Arena floor
    const floor = new PIXI.Graphics();
    floor.beginFill(0x1a2540);
    if (arenaSystem.shape === "circle") {
      const radius = Math.min(arenaSystem.width, arenaSystem.height) / 2 * scale;
      floor.drawCircle(centerX, centerY, radius);
    } else if (arenaSystem.shape === "hexagon") {
      const radius = Math.min(arenaSystem.width, arenaSystem.height) / 2 * scale;
      floor.moveTo(centerX + radius, centerY);
      for (let i = 1; i < 6; i++) {
        const angle = (Math.PI * 2 * i) / 6;
        floor.lineTo(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius);
      }
      floor.closePath();
    } else {
      const w = arenaSystem.width * scale;
      const h = arenaSystem.height * scale;
      floor.drawRect(centerX - w / 2, centerY - h / 2, w, h);
    }
    floor.endFill();
    app.stage.addChild(floor);

    // Elevation heatmap
    const heatmapRadius = Math.min(arenaSystem.width, arenaSystem.height) / 2 * scale;
    const elevType = arenaSystem.elevationMap.type;
    const segments = 12;

    for (let i = 0; i < segments; i++) {
      const angle = (Math.PI * 2 * i) / segments;
      const nextAngle = (Math.PI * 2 * (i + 1)) / segments;

      let elevation = 0;
      if (elevType === "bowl") {
        elevation = 40; // center pulls inward
      } else if (elevType === "pyramid") {
        elevation = -50; // center is high
      } else if (elevType === "ramp") {
        const tiltDir = (arenaSystem.elevationMap.tiltDirection ?? 0) * Math.PI / 180;
        const dotProduct = Math.cos(angle - tiltDir);
        elevation = dotProduct * 30;
      }

      const color = 0x2200ff + (elevation * 255 << 16); // Blue for low, red for high
      const graphics = new PIXI.Graphics();
      graphics.beginFill(color, 0.3);
      graphics.moveTo(centerX, centerY);
      graphics.lineTo(centerX + Math.cos(angle) * heatmapRadius, centerY + Math.sin(angle) * heatmapRadius);
      graphics.lineTo(centerX + Math.cos(nextAngle) * heatmapRadius, centerY + Math.sin(nextAngle) * heatmapRadius);
      graphics.closePath();
      graphics.endFill();
      app.stage.addChild(graphics);
    }

    // Friction zones
    if (arenaSystem.slopePhysics.frictionMap) {
      for (const zone of arenaSystem.slopePhysics.frictionMap) {
        const x = centerX + zone.x * scale;
        const y = centerY + zone.y * scale;
        const r = zone.radius * scale;

        const zoneGraphics = new PIXI.Graphics();
        zoneGraphics.lineStyle(2, zone.frictionMultiplier > 1 ? 0xff8844 : 0x44ff88, 0.7);
        zoneGraphics.drawCircle(x, y, r);

        // Hatching for visual distinction
        for (let i = 0; i < r * 2; i += 8) {
          zoneGraphics.moveTo(x - r + i, y - r);
          zoneGraphics.lineTo(x - r + i + r, y - r + r);
        }

        app.stage.addChild(zoneGraphics);
      }
    }

    // Wall
    const wallGraphics = new PIXI.Graphics();
    wallGraphics.lineStyle(2, 0xffcc44, 1);
    if (arenaSystem.shape === "circle") {
      const radius = Math.min(arenaSystem.width, arenaSystem.height) / 2 * scale;
      wallGraphics.drawCircle(centerX, centerY, radius);
    } else if (arenaSystem.shape === "hexagon") {
      const radius = Math.min(arenaSystem.width, arenaSystem.height) / 2 * scale;
      wallGraphics.moveTo(centerX + radius, centerY);
      for (let i = 1; i < 6; i++) {
        const angle = (Math.PI * 2 * i) / 6;
        wallGraphics.lineTo(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius);
      }
      wallGraphics.closePath();
    }
    app.stage.addChild(wallGraphics);

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

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
      const scale = Math.min(width, height) / Math.max(arenaSystem.width, arenaSystem.height) * 0.8;

      // Arena floor
      const floor = new PIXI.Graphics();
      if (arenaSystem.shape === "circle") {
        const r = Math.min(arenaSystem.width, arenaSystem.height) / 2 * scale;
        floor.circle(centerX, centerY, r).fill({ color: 0x1a2540 });
      } else if (arenaSystem.shape === "hexagon") {
        const r = Math.min(arenaSystem.width, arenaSystem.height) / 2 * scale;
        const pts: number[] = [];
        for (let i = 0; i < 6; i++) {
          const a = (Math.PI * 2 * i) / 6;
          pts.push(centerX + Math.cos(a) * r, centerY + Math.sin(a) * r);
        }
        floor.poly(pts).fill({ color: 0x1a2540 });
      } else {
        const w = arenaSystem.width * scale;
        const h = arenaSystem.height * scale;
        floor.rect(centerX - w / 2, centerY - h / 2, w, h).fill({ color: 0x1a2540 });
      }
      app.stage.addChild(floor);

      // Elevation heatmap — 12 pie segments
      const heatmapRadius = Math.min(arenaSystem.width, arenaSystem.height) / 2 * scale;
      const elevType = arenaSystem.elevationMap.type;
      for (let i = 0; i < 12; i++) {
        const angle = (Math.PI * 2 * i) / 12;
        const nextAngle = (Math.PI * 2 * (i + 1)) / 12;

        let elevation = 0;
        if (elevType === "bowl") {
          elevation = 40;
        } else if (elevType === "pyramid") {
          elevation = -50;
        } else if (elevType === "ramp") {
          const tiltDir = (arenaSystem.elevationMap.tiltDirection ?? 0) * Math.PI / 180;
          elevation = Math.cos(angle - tiltDir) * 30;
        }

        // Map elevation to blue (low) → red (high) palette
        const norm = Math.max(-1, Math.min(1, elevation / 50));
        const rCh = norm > 0 ? Math.floor(norm * 0x66) : 0;
        const bCh = norm < 0 ? Math.floor(-norm * 0xff) : 0x22;
        const color = (rCh << 16) | bCh;

        const seg = new PIXI.Graphics();
        seg.moveTo(centerX, centerY);
        seg.lineTo(centerX + Math.cos(angle) * heatmapRadius, centerY + Math.sin(angle) * heatmapRadius);
        seg.lineTo(centerX + Math.cos(nextAngle) * heatmapRadius, centerY + Math.sin(nextAngle) * heatmapRadius);
        seg.closePath();
        seg.fill({ color, alpha: 0.3 });
        app.stage.addChild(seg);
      }

      // Friction zones
      if (arenaSystem.slopePhysics.frictionMap) {
        for (const zone of arenaSystem.slopePhysics.frictionMap) {
          const zx = centerX + zone.x * scale;
          const zy = centerY + zone.y * scale;
          const zr = zone.radius * scale;
          const zoneColor = zone.frictionMultiplier > 1 ? 0xff8844 : 0x44ff88;

          const zoneGraphics = new PIXI.Graphics();
          // Circle outline
          zoneGraphics.circle(zx, zy, zr).stroke({ color: zoneColor, width: 2, alpha: 0.7 });
          // Diagonal hatching
          for (let j = 0; j < zr * 2; j += 8) {
            zoneGraphics.moveTo(zx - zr + j, zy - zr);
            zoneGraphics.lineTo(zx - zr + j + zr, zy + 0);
          }
          zoneGraphics.stroke({ color: zoneColor, width: 1, alpha: 0.35 });
          app.stage.addChild(zoneGraphics);
        }
      }

      // Wall outline
      const wallGraphics = new PIXI.Graphics();
      if (arenaSystem.shape === "circle") {
        const r = Math.min(arenaSystem.width, arenaSystem.height) / 2 * scale;
        wallGraphics.circle(centerX, centerY, r).stroke({ color: 0xffcc44, width: 2, alpha: 1 });
      } else if (arenaSystem.shape === "hexagon") {
        const r = Math.min(arenaSystem.width, arenaSystem.height) / 2 * scale;
        const pts: number[] = [];
        for (let i = 0; i < 6; i++) {
          const a = (Math.PI * 2 * i) / 6;
          pts.push(centerX + Math.cos(a) * r, centerY + Math.sin(a) * r);
        }
        wallGraphics.poly(pts).stroke({ color: 0xffcc44, width: 2, alpha: 1 });
      } else {
        const w = arenaSystem.width * scale;
        const h = arenaSystem.height * scale;
        wallGraphics.rect(centerX - w / 2, centerY - h / 2, w, h).stroke({ color: 0xffcc44, width: 2, alpha: 1 });
      }
      app.stage.addChild(wallGraphics);
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

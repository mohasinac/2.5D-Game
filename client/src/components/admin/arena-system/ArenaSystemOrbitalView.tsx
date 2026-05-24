import { useRef, useEffect } from "react";
import { ArenaSystem } from "@/types/arenaSystem";
import { C } from "@/styles/theme";
import * as PIXI from "pixi.js";

interface Props {
  arenaSystem: ArenaSystem;
}

export function ArenaSystemOrbitalView({ arenaSystem }: Props) {
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
      const scale = Math.min(width, height) / Math.max(arenaSystem.width, arenaSystem.height) * 0.7;
      const radius = Math.min(arenaSystem.width, arenaSystem.height) / 2 * scale;

      // Arena floor
      const floor = new PIXI.Graphics();
      floor.circle(centerX, centerY, radius).fill({ color: 0x1a2540 });
      app.stage.addChild(floor);

      // Elevation gradient overlay — 12 pie segments
      const elevType = arenaSystem.elevationMap.type;
      for (let i = 0; i < 12; i++) {
        const angle = (Math.PI * 2 * i) / 12;
        const nextAngle = (Math.PI * 2 * (i + 1)) / 12;

        let elevation = 0;
        if (elevType === "bowl") {
          elevation = 0.4;
        } else if (elevType === "pyramid") {
          elevation = -0.5;
        } else if (elevType === "ramp") {
          const tiltDir = (arenaSystem.elevationMap.tiltDirection ?? 0) * Math.PI / 180;
          elevation = Math.cos(angle - tiltDir) * 0.3;
        }

        const color = elevation > 0 ? 0xff4444 : elevation < 0 ? 0x4488ff : 0x88dd88;
        const alpha = 0.2 + Math.abs(elevation) * 0.3;

        const seg = new PIXI.Graphics();
        seg.moveTo(centerX, centerY);
        seg.lineTo(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius);
        seg.lineTo(centerX + Math.cos(nextAngle) * radius, centerY + Math.sin(nextAngle) * radius);
        seg.closePath();
        seg.fill({ color, alpha });
        app.stage.addChild(seg);
      }

      // Wall ring
      const wallGraphics = new PIXI.Graphics();
      wallGraphics.circle(centerX, centerY, radius).stroke({ color: 0xffcc44, width: 3, alpha: 0.8 });
      app.stage.addChild(wallGraphics);

      // Gravity arrow (ramp only)
      if (elevType === "ramp") {
        const tiltDir = (arenaSystem.elevationMap.tiltDirection ?? 0) * Math.PI / 180;
        const strength = (arenaSystem.elevationMap.tiltAngle ?? 15) / 30;
        const ax = centerX;
        const ay = centerY - radius * 0.5;
        const ex = ax + Math.cos(tiltDir) * radius * 0.3 * strength;
        const ey = ay + Math.sin(tiltDir) * radius * 0.3 * strength;
        const headAngle = Math.atan2(ey - ay, ex - ax);
        const headSize = 10;

        const arrow = new PIXI.Graphics();
        arrow.moveTo(ax, ay);
        arrow.lineTo(ex, ey);
        arrow.moveTo(ex, ey);
        arrow.lineTo(ex - Math.cos(headAngle - 0.4) * headSize, ey - Math.sin(headAngle - 0.4) * headSize);
        arrow.moveTo(ex, ey);
        arrow.lineTo(ex - Math.cos(headAngle + 0.4) * headSize, ey - Math.sin(headAngle + 0.4) * headSize);
        arrow.stroke({ color: 0xff6688, width: 2, alpha: 0.7 });
        app.stage.addChild(arrow);
      }

      // Animated beyblades orbiting the arena
      const beybladeData = [
        { angle: 0,              speed: 1.5, orbitRadius: radius * 0.6, color: 0xff6666 },
        { angle: Math.PI * 0.66, speed: 1.2, orbitRadius: radius * 0.7, color: 0x66ff66 },
        { angle: Math.PI * 1.33, speed: 1.8, orbitRadius: radius * 0.5, color: 0x6666ff },
      ];

      const beyContainer = new PIXI.Container();
      app.stage.addChild(beyContainer);

      const beySprites = beybladeData.map((b) => {
        const sprite = new PIXI.Graphics();
        sprite.circle(0, 0, 6).fill({ color: b.color });
        beyContainer.addChild(sprite);
        return { sprite, data: b };
      });

      app.ticker.add(() => {
        beySprites.forEach(({ sprite, data }) => {
          data.angle += data.speed * 0.01;
          sprite.x = centerX + Math.cos(data.angle) * data.orbitRadius;
          sprite.y = centerY + Math.sin(data.angle) * data.orbitRadius;
        });
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

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
  const timeRef = useRef(0);

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
    const scale = Math.min(width, height) / Math.max(arenaSystem.width, arenaSystem.height) * 0.7;

    // Arena floor
    const floor = new PIXI.Graphics();
    floor.beginFill(0x1a2540);
    const radius = Math.min(arenaSystem.width, arenaSystem.height) / 2 * scale;
    floor.drawCircle(centerX, centerY, radius);
    floor.endFill();
    app.stage.addChild(floor);

    // Elevation gradient overlay
    const gradient = new PIXI.Graphics();
    const elevType = arenaSystem.elevationMap.type;

    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 * i) / 12;
      const nextAngle = (Math.PI * 2 * (i + 1)) / 12;

      let elevation = 0;
      if (elevType === "bowl") {
        elevation = 0.4; // Outward pull
      } else if (elevType === "pyramid") {
        elevation = -0.5; // Inward/upward
      } else if (elevType === "ramp") {
        const tiltDir = (arenaSystem.elevationMap.tiltDirection ?? 0) * Math.PI / 180;
        const dotProduct = Math.cos(angle - tiltDir);
        elevation = dotProduct * 0.3;
      }

      const color = elevation > 0 ? 0xff4444 : elevation < 0 ? 0x4488ff : 0x88dd88;
      const alpha = Math.abs(elevation);

      const seg = new PIXI.Graphics();
      seg.beginFill(color, 0.2 + alpha * 0.3);
      seg.moveTo(centerX, centerY);
      seg.lineTo(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius);
      seg.lineTo(centerX + Math.cos(nextAngle) * radius, centerY + Math.sin(nextAngle) * radius);
      seg.closePath();
      seg.endFill();
      app.stage.addChild(seg);
    }

    // Wall
    const wallGraphics = new PIXI.Graphics();
    wallGraphics.lineStyle(3, 0xffcc44, 0.8);
    wallGraphics.drawCircle(centerX, centerY, radius);
    app.stage.addChild(wallGraphics);

    // Gravity direction indicator (for ramp)
    if (elevType === "ramp") {
      const tiltDir = (arenaSystem.elevationMap.tiltDirection ?? 0) * Math.PI / 180;
      const strength = (arenaSystem.elevationMap.tiltAngle ?? 15) / 30;

      const arrow = new PIXI.Graphics();
      arrow.lineStyle(2, 0xff6688, 0.7);

      const startX = centerX;
      const startY = centerY - radius * 0.5;
      const endX = startX + Math.cos(tiltDir) * radius * 0.3 * strength;
      const endY = startY + Math.sin(tiltDir) * radius * 0.3 * strength;

      arrow.moveTo(startX, startY);
      arrow.lineTo(endX, endY);

      // Arrowhead
      const headSize = 10;
      const angle = Math.atan2(endY - startY, endX - startX);
      arrow.moveTo(endX, endY);
      arrow.lineTo(endX - Math.cos(angle - 0.4) * headSize, endY - Math.sin(angle - 0.4) * headSize);
      arrow.moveTo(endX, endY);
      arrow.lineTo(endX - Math.cos(angle + 0.4) * headSize, endY - Math.sin(angle + 0.4) * headSize);

      app.stage.addChild(arrow);
    }

    // Animated beyblades simulating orbital movement
    const beyblades: Array<{
      angle: number;
      speed: number;
      radius: number;
      color: number;
    }> = [
      { angle: 0, speed: 1.5, radius: radius * 0.6, color: 0xff6666 },
      { angle: Math.PI * 0.66, speed: 1.2, radius: radius * 0.7, color: 0x66ff66 },
      { angle: Math.PI * 1.33, speed: 1.8, radius: radius * 0.5, color: 0x6666ff },
    ];

    const beyBlades = new PIXI.Container();
    app.stage.addChild(beyBlades);

    const beySprites = beyblades.map((b) => {
      const sprite = new PIXI.Graphics();
      sprite.beginFill(b.color);
      sprite.drawCircle(0, 0, 6);
      sprite.endFill();
      beyBlades.addChild(sprite);
      return { sprite, data: b };
    });

    // Animation loop
    let raf: number;
    const animate = () => {
      timeRef.current += 0.016; // ~60fps

      beySprites.forEach(({ sprite, data }) => {
        data.angle += data.speed * 0.01;
        sprite.x = centerX + Math.cos(data.angle) * data.radius;
        sprite.y = centerY + Math.sin(data.angle) * data.radius;
      });

      app.renderer.render(app.stage);
      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
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

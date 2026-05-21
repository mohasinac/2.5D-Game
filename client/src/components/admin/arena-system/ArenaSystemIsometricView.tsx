import { useRef, useEffect } from "react";
import { ArenaSystem } from "@/types/arenaSystem";
import { C } from "@/styles/theme";
import * as PIXI from "pixi.js";

interface Props {
  arenaSystem: ArenaSystem;
}

export function ArenaSystemIsometricView({ arenaSystem }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const rotationRef = useRef(0);

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
    const baseScale = Math.min(width, height) / Math.max(arenaSystem.width, arenaSystem.height) * 0.6;

    const container = new PIXI.Container();
    app.stage.addChild(container);

    // Isometric projection: x' = x - y * 0.5, y' = (x + y) * 0.4
    const projectIso = (x: number, y: number, z: number = 0) => {
      const screenX = centerX + (x - y * 0.5) * baseScale + z * 0.3;
      const screenY = centerY + (x + y) * 0.4 * baseScale - z * 0.4;
      return { x: screenX, y: screenY };
    };

    // Draw elevation mesh grid
    const gridSize = 8;
    const maxDim = Math.max(arenaSystem.width, arenaSystem.height);

    for (let xi = 0; xi <= gridSize; xi++) {
      for (let yi = 0; yi <= gridSize; yi++) {
        const x = (xi / gridSize - 0.5) * arenaSystem.width;
        const y = (yi / gridSize - 0.5) * arenaSystem.height;

        // Calculate elevation
        let z = 0;
        const elevType = arenaSystem.elevationMap.type;
        const dist = Math.sqrt(x * x + y * y);
        const maxDist = Math.max(arenaSystem.width, arenaSystem.height) / 2;

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

        // Draw point
        const dot = new PIXI.Graphics();
        const brightness = 0.5 + z / 100;
        const color = Math.floor(0x2288ff * brightness);
        dot.beginFill(color);
        dot.drawCircle(0, 0, 2);
        dot.endFill();
        dot.x = pos.x;
        dot.y = pos.y;
        container.addChild(dot);
      }
    }

    // Draw floor outline
    const outline = new PIXI.Graphics();
    outline.lineStyle(2, 0xffcc44, 0.8);

    if (arenaSystem.shape === "circle") {
      const r = Math.min(arenaSystem.width, arenaSystem.height) / 2;
      const points: Array<[number, number]> = [];
      for (let i = 0; i < 12; i++) {
        const angle = (Math.PI * 2 * i) / 12;
        points.push([Math.cos(angle) * r, Math.sin(angle) * r]);
      }
      if (points.length > 0) {
        const p0 = projectIso(points[0][0], points[0][1], 0);
        outline.moveTo(p0.x, p0.y);
        for (let i = 1; i < points.length; i++) {
          const p = projectIso(points[i][0], points[i][1], 0);
          outline.lineTo(p.x, p.y);
        }
        const p0Again = projectIso(points[0][0], points[0][1], 0);
        outline.lineTo(p0Again.x, p0Again.y);
      }
    }
    container.addChild(outline);

    // Slow rotation animation
    let lastTime = Date.now();
    const animate = () => {
      const now = Date.now();
      const deltaTime = (now - lastTime) / 1000;
      lastTime = now;

      rotationRef.current += deltaTime * 0.2; // Slow rotation
      container.rotation = rotationRef.current;

      app.renderer.render(app.stage);
      requestAnimationFrame(animate);
    };

    const raf = requestAnimationFrame(animate);

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

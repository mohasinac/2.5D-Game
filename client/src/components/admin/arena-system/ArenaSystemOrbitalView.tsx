// ArenaSystemOrbitalView — PixiJS orbital/physics simulation preview.
// Fixed to init PIXI.Application once (instead of destroying+recreating on
// every arenaSystem prop change). arenaSystemRef keeps the current value;
// rebuildScene reads from it so the callback stays stable.

import { useRef, useEffect, useCallback } from "react";
import { ArenaSystem } from "@/types/arenaSystem";
import * as PIXI from "pixi.js";

interface Props {
  arenaSystem: ArenaSystem;
}

interface BeyData {
  angle:       number;
  speed:       number;
  orbitRadius: number;
  color:       number;
}

export function ArenaSystemOrbitalView({ arenaSystem }: Props) {
  const containerRef   = useRef<HTMLDivElement>(null);
  const appRef         = useRef<PIXI.Application | null>(null);
  const appInitRef     = useRef(false);
  const arenaSystemRef = useRef(arenaSystem);
  // Beyblade sprites + data survive scene rebuilds so animation state is preserved
  const beySpriteData  = useRef<Array<{ sprite: PIXI.Graphics; data: BeyData }>>([]);
  arenaSystemRef.current = arenaSystem;

  const rebuildScene = useCallback(() => {
    const app = appRef.current;
    if (!app || !appInitRef.current) return;

    app.stage.removeChildren();
    beySpriteData.current = [];

    const as = arenaSystemRef.current;
    const w  = app.screen.width;
    const h  = app.screen.height;
    const cx = w / 2;
    const cy = h / 2;
    const scale  = Math.min(w, h) / Math.max(as.width, as.height) * 0.7;
    const radius = Math.min(as.width, as.height) / 2 * scale;

    // Arena floor
    const floor = new PIXI.Graphics();
    floor.circle(cx, cy, radius).fill({ color: 0x1a2540 });
    app.stage.addChild(floor);

    // Elevation gradient overlay — 12 pie segments
    const elevType = as.elevationMap.type;
    for (let i = 0; i < 12; i++) {
      const angle     = (Math.PI * 2 * i) / 12;
      const nextAngle = (Math.PI * 2 * (i + 1)) / 12;

      let elevation = 0;
      if (elevType === "bowl") {
        elevation = 0.4;
      } else if (elevType === "pyramid") {
        elevation = -0.5;
      } else if (elevType === "ramp") {
        const tiltDir = (as.elevationMap.tiltDirection ?? 0) * Math.PI / 180;
        elevation = Math.cos(angle - tiltDir) * 0.3;
      }

      const color = elevation > 0 ? 0xff4444 : elevation < 0 ? 0x4488ff : 0x88dd88;
      const alpha = 0.2 + Math.abs(elevation) * 0.3;
      const seg   = new PIXI.Graphics();
      seg.moveTo(cx, cy);
      seg.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
      seg.lineTo(cx + Math.cos(nextAngle) * radius, cy + Math.sin(nextAngle) * radius);
      seg.closePath();
      seg.fill({ color, alpha });
      app.stage.addChild(seg);
    }

    // Wall ring
    const wall = new PIXI.Graphics();
    wall.circle(cx, cy, radius).stroke({ color: 0xffcc44, width: 3, alpha: 0.8 });
    app.stage.addChild(wall);

    // Gravity arrow (ramp only)
    if (elevType === "ramp") {
      const tiltDir  = (as.elevationMap.tiltDirection ?? 0) * Math.PI / 180;
      const strength = (as.elevationMap.tiltAngle ?? 15) / 30;
      const ax = cx;
      const ay = cy - radius * 0.5;
      const ex = ax + Math.cos(tiltDir) * radius * 0.3 * strength;
      const ey = ay + Math.sin(tiltDir) * radius * 0.3 * strength;
      const headAngle = Math.atan2(ey - ay, ex - ax);
      const headSize  = 10;
      const arrow = new PIXI.Graphics();
      arrow.moveTo(ax, ay).lineTo(ex, ey);
      arrow.moveTo(ex, ey).lineTo(ex - Math.cos(headAngle - 0.4) * headSize, ey - Math.sin(headAngle - 0.4) * headSize);
      arrow.moveTo(ex, ey).lineTo(ex - Math.cos(headAngle + 0.4) * headSize, ey - Math.sin(headAngle + 0.4) * headSize);
      arrow.stroke({ color: 0xff6688, width: 2, alpha: 0.7 });
      app.stage.addChild(arrow);
    }

    // Animated beyblades
    const beyContainer = new PIXI.Container();
    app.stage.addChild(beyContainer);

    const beybladeData: BeyData[] = [
      { angle: 0,              speed: 1.5, orbitRadius: radius * 0.6, color: 0xff6666 },
      { angle: Math.PI * 0.66, speed: 1.2, orbitRadius: radius * 0.7, color: 0x66ff66 },
      { angle: Math.PI * 1.33, speed: 1.8, orbitRadius: radius * 0.5, color: 0x6666ff },
    ];

    for (const data of beybladeData) {
      const sprite = new PIXI.Graphics();
      sprite.circle(0, 0, 6).fill({ color: data.color });
      sprite.x = cx + Math.cos(data.angle) * data.orbitRadius;
      sprite.y = cy + Math.sin(data.angle) * data.orbitRadius;
      beyContainer.addChild(sprite);
      beySpriteData.current.push({ sprite, data });
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

      appRef.current     = app;
      appInitRef.current = true;
      container.appendChild(app.canvas);

      rebuildScene();

      // Ticker: move beyblade sprites only — no scene rebuild
      app.ticker.add(() => {
        const cx = app.screen.width  / 2;
        const cy = app.screen.height / 2;
        for (const { sprite, data } of beySpriteData.current) {
          data.angle += data.speed * 0.01;
          sprite.x = cx + Math.cos(data.angle) * data.orbitRadius;
          sprite.y = cy + Math.sin(data.angle) * data.orbitRadius;
        }
      });
    })();

    return () => {
      cancelled = true;
      appInitRef.current = false;
      beySpriteData.current = [];
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

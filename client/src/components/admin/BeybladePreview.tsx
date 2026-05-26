import { useEffect, useRef, useCallback, useState } from "react";
import * as PIXI from "pixi.js";
import { cn } from "@/lib/cn";
import type { BeybladeStats } from "@/types/beybladeStats";

// Game coordinate constants — match game physics
const GAME_ARENA_PX = 1080 * 0.45; // 486 — game arena radius in pixels
const GAME_CM_TO_PX = 24;          // 1 cm = 24 px in game
const ARENA_SCALE = 0.45;          // preview arena radius as fraction of container

function typeColor(type: string): number {
  switch (type) {
    case "attack":   return 0xef4444;
    case "defense":  return 0x3b82f6;
    case "stamina":  return 0x22c55e;
    case "balanced": return 0xa855f7;
    default:         return 0x6b7280;
  }
}

interface BeybladePreviewProps {
  beyblade: BeybladeStats;
  onCanvasClick?: (angle: number) => void;
  clickMode?: boolean;
}

export default function BeybladePreview({ beyblade, onCanvasClick, clickMode = false }: BeybladePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  // True only after await app.init() completes — guards rebuildScene from accessing
  // app.screen before _renderer is initialized (would crash with "this.renderer is undefined").
  const appInitializedRef = useRef(false);
  const beybladeContainerRef = useRef<PIXI.Container | null>(null);
  const isSpinningRef = useRef(true);
  const [isSpinning, setIsSpinning] = useState(true);
  const [zoom, setZoom] = useState(100);
  const zoomRef = useRef(100);
  // Persists spin angle across rebuilds so bey doesn't snap to 0 on every zoom/config change
  const rotationRef = useRef(0);
  // Generation counter — lets async rebuilds detect when a newer rebuild started mid-load
  const rebuildGenRef = useRef(0);
  // Always-current refs — updated synchronously on every render (no stale closures in callbacks)
  const beybladeRef = useRef(beyblade);
  beybladeRef.current = beyblade;

  useEffect(() => { isSpinningRef.current = isSpinning; }, [isSpinning]);
  useEffect(() => { zoomRef.current = zoom; }, [zoom]);

  useEffect(() => {
    if (clickMode) {
      setIsSpinning(false);
      if (beybladeContainerRef.current) beybladeContainerRef.current.rotation = 0;
    }
  }, [clickMode]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!clickMode || !onCanvasClick) return;
    const rect = e.currentTarget.getBoundingClientRect();
    // autoDensity:true makes canvas CSS size == container CSS size — no extra scaling needed
    const x = (e.clientX - rect.left) - rect.width / 2;
    const y = (e.clientY - rect.top) - rect.height / 2;
    let angle = Math.atan2(y, x) * (180 / Math.PI);
    angle = (angle + 360) % 360;
    onCanvasClick(angle);
  }, [clickMode, onCanvasClick]);

  // Stable rebuild — reads everything from refs so deps=[] is safe
  const rebuildScene = useCallback(async () => {
    const app = appRef.current;
    // Guard: appInitializedRef is only true after await app.init() completes.
    // Without this, accessing app.screen on an uninitialized app crashes because
    // PixiJS Application._renderer is undefined until init() resolves.
    if (!app || !appInitializedRef.current || app.screen.width === 0) return;

    // Bump generation so any older in-flight async rebuild aborts before touching stage
    const gen = ++rebuildGenRef.current;
    app.stage.removeChildren();

    const w = app.screen.width;
    const h = app.screen.height;
    const cx = w / 2;
    const cy = h / 2;
    const arenaR = Math.min(w, h) * ARENA_SCALE;
    const bey = beybladeRef.current;
    const z = zoomRef.current;
    // Scale bey proportionally to the preview arena — mirrors game formula: radius_px = radius_cm * 24
    const beyR = Math.max(12, (bey.radius * GAME_CM_TO_PX / GAME_ARENA_PX) * arenaR * (z / 100));

    // ── Background ──────────────────────────────────────────────────────────
    const bg = new PIXI.Graphics();
    bg.rect(0, 0, w, h).fill(0x0d1a2e);
    app.stage.addChild(bg);

    // ── Arena ring ───────────────────────────────────────────────────────────
    const ring = new PIXI.Graphics();
    ring.circle(cx, cy, arenaR).fill({ color: 0x1a2a4a });
    ring.circle(cx, cy, arenaR).stroke({ color: 0x4488cc, width: 3, alpha: 0.85 });
    // Center cross
    ring.moveTo(cx - 14, cy).lineTo(cx + 14, cy).stroke({ color: 0x4488cc, width: 1, alpha: 0.25 });
    ring.moveTo(cx, cy - 14).lineTo(cx, cy + 14).stroke({ color: 0x4488cc, width: 1, alpha: 0.25 });
    app.stage.addChild(ring);

    // ── Beyblade container (rotates) ─────────────────────────────────────────
    const bCont = new PIXI.Container();
    bCont.position.set(cx, cy);
    // Restore saved rotation — prevents bey snapping to 0 on zoom/config/resize changes
    bCont.rotation = rotationRef.current;

    const color = typeColor(bey.type);

    // Main disc
    const disc = new PIXI.Graphics();
    disc.circle(0, 0, beyR).fill(color);
    // Inner highlight ring
    disc.circle(0, 0, beyR * 0.5).fill({ color: 0xffffff, alpha: 0.12 });
    // Outer border
    disc.circle(0, 0, beyR).stroke({ color: 0x1f2937, width: 3 });
    bCont.addChild(disc);

    // Beyblade image (if available)
    if (bey.imageUrl) {
      try {
        // Load via HTMLImageElement with crossOrigin to avoid WebGL CORS errors.
        // Cache-bust URL so the browser re-fetches with CORS headers even if the
        // <img> thumbnail already cached the same URL without them.
        const cacheBustUrl = bey.imageUrl.includes('?')
          ? bey.imageUrl + '&_px=1'
          : bey.imageUrl + '?_px=1';
        const loadedImg = await new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = cacheBustUrl;
        });
        // Discard stale rebuild — a newer one started while image was loading
        if (gen !== rebuildGenRef.current) return;

        const texture = PIXI.Texture.from(loadedImg);
        const sprite = new PIXI.Sprite(texture);
        sprite.anchor.set(0.5, 0.5);

        const imgPos = bey.imagePosition ?? { x: 0, y: 0, scale: 1, rotation: 0 };
        const aspectRatio = texture.width / texture.height;
        let imgW: number, imgH: number;
        if (aspectRatio > 1) {
          imgW = beyR * 2 * imgPos.scale;
          imgH = imgW / aspectRatio;
        } else {
          imgH = beyR * 2 * imgPos.scale;
          imgW = imgH * aspectRatio;
        }
        sprite.width = imgW;
        sprite.height = imgH;
        sprite.x = imgPos.x * (beyR / 2);
        sprite.y = imgPos.y * (beyR / 2);
        sprite.rotation = (imgPos.rotation * Math.PI) / 180;

        const maskGfx = new PIXI.Graphics();
        maskGfx.circle(0, 0, beyR).fill(0xffffff);
        bCont.addChild(maskGfx);
        sprite.mask = maskGfx;
        bCont.addChild(sprite);

        const border = new PIXI.Graphics();
        border.circle(0, 0, beyR).stroke({ color, width: 4 });
        bCont.addChild(border);
        bCont.removeChild(disc);
      } catch {
        // Keep plain disc on load failure — still abort if superseded
        if (gen !== rebuildGenRef.current) return;
      }
    }

    // Spin direction indicator — always shown regardless of image
    {
      const hasImage = !!bey.imageUrl;
      const label = new PIXI.Text({
        text: bey.spinDirection === "left" ? "◄" : "►",
        style: {
          fill: 0xffffff,
          fontSize: Math.max(10, hasImage ? beyR * 0.28 : beyR * 0.42),
          fontWeight: "bold",
        }
      });
      label.anchor.set(0.5, 0.5);
      if (hasImage) {
        // Corner position when image occupies center
        label.position.set(beyR * 0.55, beyR * 0.55);
      }
      bCont.addChild(label);
    }

    // ── Contact points ───────────────────────────────────────────────────────
    if (bey.pointsOfContact?.length) {
      const cpGfx = new PIXI.Graphics();
      const cpGlow = new PIXI.Graphics();
      bey.pointsOfContact.forEach((point) => {
        const angleRad = (point.angle - 90) * (Math.PI / 180);
        const widthRad = ((point.width / 2) * Math.PI) / 180;
        const r = beyR + 5;
        const hue = Math.min((point.damageMultiplier - 1.0) * 300, 120);
        const strokeColor = hslToHex(hue, 90, 50);
        const glowColor = hslToHex(hue, 90, 60);
        cpGfx.arc(0, 0, r, angleRad - widthRad, angleRad + widthRad).stroke({ color: strokeColor, width: 6 });
        cpGlow.arc(0, 0, r, angleRad - widthRad, angleRad + widthRad).stroke({ color: glowColor, width: 12, alpha: 0.3 });
        const dotAngle = point.angle * (Math.PI / 180) - Math.PI / 2;
        cpGfx.circle(Math.cos(dotAngle) * r, Math.sin(dotAngle) * r, 3).fill(strokeColor);
      });
      bCont.addChild(cpGlow);
      bCont.addChild(cpGfx);
    }

    // Register as active container and add to stage only after everything is ready
    beybladeContainerRef.current = bCont;
    app.stage.addChild(bCont);
  }, []); // Stable — reads from refs

  // Init PixiJS once
  useEffect(() => {
    if (!containerRef.current) return;
    let cancelled = false;
    const app = new PIXI.Application();
    // Do NOT set appRef.current here — set it only after init() completes.
    // Setting it before init causes rebuildScene() to access app.screen while
    // _renderer is still undefined, crashing with "this.renderer is undefined".

    (async () => {
      const size = containerRef.current!.offsetWidth || 400;
      await app.init({
        width: size,
        height: size,
        antialias: true,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
        backgroundAlpha: 1,
        background: 0x0d1a2e,
      });

      if (cancelled || !containerRef.current) {
        app.destroy(true);
        return;
      }

      app.canvas.style.display = "block";
      app.canvas.style.width = "100%";
      app.canvas.style.height = "100%";
      containerRef.current.appendChild(app.canvas);

      // Mark ready BEFORE exposing ref — any pending rebuildScene() calls will
      // now find a valid initialized app.
      appInitializedRef.current = true;
      appRef.current = app;

      await rebuildScene();

      app.ticker.add(() => {
        const bCont = beybladeContainerRef.current;
        if (!bCont || !isSpinningRef.current) return;
        const speed = beybladeRef.current.spinDirection === "left" ? -0.06 : 0.06;
        bCont.rotation += speed;
        // Save angle so next rebuild can restore it — prevents snap-to-0 on resize/config change
        rotationRef.current = bCont.rotation;
      });
    })();

    return () => {
      cancelled = true;
      appInitializedRef.current = false;
      appRef.current = null;
      beybladeContainerRef.current = null;
      try { app.destroy(true, { children: true }); } catch { /* init may still be in flight */ }
    };
  }, []); // Init once

  // Rebuild when beyblade data or zoom changes
  useEffect(() => {
    if (appRef.current) rebuildScene();
  }, [beyblade, zoom, rebuildScene]);

  // Respond to container resize
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      const app = appRef.current;
      // appInitializedRef guards against accessing app.renderer before init completes
      if (app && appInitializedRef.current && width > 0 && height > 0) {
        try { app.renderer.resize(width, height); } catch { /* destroyed mid-resize */ }
        rebuildScene();
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [rebuildScene]);

  return (
    <div className="bg-bg2 rounded-xl p-4 border border-border-c">
      <div className="text-sm font-semibold text-theme-text mb-3">Live Preview</div>

      {/* Canvas container — fills width, enforced square */}
      <div className="flex justify-center mb-3">
        <div
          ref={containerRef}
          onClick={handleClick}
          className={cn(
            "rounded-lg border-2 border-border-c overflow-hidden w-full aspect-square",
            clickMode ? "cursor-crosshair" : "cursor-default",
          )}
        />
      </div>

      {clickMode && (
        <p className="text-xs text-theme-blue text-center mb-3">
          Click on the canvas to place a point (spinning paused)
        </p>
      )}

      {/* Spin + Zoom controls */}
      <div className="flex flex-col gap-2 mb-3">
        <div className="flex items-center justify-between bg-bg3 rounded-lg px-3 py-2">
          <span className="text-[13px] text-theme-muted">Spinning:</span>
          <button
            onClick={() => setIsSpinning(v => !v)}
            className={cn(
              "px-3.5 py-1 rounded-md border-none cursor-pointer font-semibold text-xs",
              isSpinning
                ? "bg-theme-green text-white"
                : "bg-bg0 text-theme-muted",
            )}
          >
            {isSpinning ? "ON" : "OFF"}
          </button>
        </div>
        <div className="bg-bg3 rounded-lg px-3 py-2">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[13px] text-theme-muted">Zoom:</span>
            <span className="text-[13px] text-theme-blue font-mono font-bold">{zoom}%</span>
          </div>
          <div className="flex gap-1.5 items-center">
            <button
              onClick={() => setZoom(z => Math.max(50, z - 10))}
              className="px-2 py-0.5 bg-bg2 border border-border-c rounded text-theme-text cursor-pointer text-sm"
            >−</button>
            <input
              type="range"
              min={50}
              max={200}
              value={zoom}
              onChange={e => setZoom(+e.target.value)}
              className="flex-1 accent-theme-blue"
            />
            <button
              onClick={() => setZoom(z => Math.min(200, z + 10))}
              className="px-2 py-0.5 bg-bg2 border border-border-c rounded text-theme-text cursor-pointer text-sm"
            >+</button>
            <button
              onClick={() => setZoom(100)}
              className="px-2 py-0.5 bg-theme-blue border-none rounded text-white cursor-pointer text-[11px]"
            >Reset</button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="text-xs text-theme-faint flex flex-col gap-1">
        {[
          ["Name", beyblade.displayName || "Unnamed"],
          ["Type", beyblade.type],
          ["Spin", beyblade.spinDirection],
          ["Radius", `${beyblade.radius} cm`],
          ["Mass", `${beyblade.mass}g`],
          ...(beyblade.speed != null ? [["Speed", String(beyblade.speed)]] : []),
          ...(beyblade.rotationSpeed != null ? [["Rot. Speed", `${beyblade.rotationSpeed}°/s`]] : []),
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between">
            <span>{k}:</span>
            <span className="text-theme-text capitalize">{v}</span>
          </div>
        ))}
      </div>

      {/* Legend */}
      {(beyblade.pointsOfContact?.length ?? 0) > 0 && (
        <div className="mt-2.5 bg-bg3 rounded-lg p-2.5 text-[11px] text-theme-faint">
          <span className="font-semibold text-theme-muted">Legend: </span>
          <span>Red→Yellow arcs = Contact points ({beyblade.pointsOfContact.length})</span>
        </div>
      )}
    </div>
  );
}

function hslToHex(h: number, s: number, l: number): number {
  s /= 100; l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return (Math.round(f(0) * 255) << 16) | (Math.round(f(8) * 255) << 8) | Math.round(f(4) * 255);
}

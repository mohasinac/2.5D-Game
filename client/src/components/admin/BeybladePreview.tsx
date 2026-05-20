import { useEffect, useRef, useState, useCallback } from "react";
import * as PIXI from "pixi.js";
import { C } from "@/styles/theme";
import type { BeybladeStats } from "@/types/beybladeStats";

// Inline constants (mirrors beybladeConstants.ts)
const PIXELS_PER_CM = 24; // 1080 / 45
const CANVAS_SIZE = 400;
const CANVAS_RES = 800; // 2x for retina

function getDisplayRadius(radiusCm: number, zoom: number) {
  // Scale from arena px → preview canvas px, then apply zoom
  const basePixels = radiusCm * PIXELS_PER_CM;
  const previewScale = CANVAS_RES / 1080;
  return basePixels * previewScale * (zoom / 100);
}

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
  const beybladeContainerRef = useRef<PIXI.Container | null>(null);
  const isSpinningRef = useRef(true);
  const [isSpinning, setIsSpinning] = useState(true);
  const [zoom, setZoom] = useState(100);
  const zoomRef = useRef(100);

  // Keep refs in sync with state
  useEffect(() => { isSpinningRef.current = isSpinning; }, [isSpinning]);
  useEffect(() => { zoomRef.current = zoom; }, [zoom]);

  // Pause spinning in click mode, reset rotation
  useEffect(() => {
    if (clickMode) {
      setIsSpinning(false);
      if (beybladeContainerRef.current) {
        beybladeContainerRef.current.rotation = 0;
      }
    }
  }, [clickMode]);

  // Handle canvas click for contact point placement
  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!clickMode || !onCanvasClick) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = CANVAS_RES / rect.width;
    const scaleY = CANVAS_RES / rect.height;
    const x = (e.clientX - rect.left) * scaleX - CANVAS_RES / 2;
    const y = (e.clientY - rect.top) * scaleY - CANVAS_RES / 2;
    let angle = Math.atan2(y, x) * (180 / Math.PI);
    angle = (angle + 360) % 360;
    onCanvasClick(angle);
  }, [clickMode, onCanvasClick]);

  // Build / rebuild the PixiJS scene whenever beyblade data or zoom changes
  const rebuildScene = useCallback(async () => {
    const app = appRef.current;
    if (!app) return;

    // Clear stage
    app.stage.removeChildren();

    const cx = CANVAS_RES / 2;
    const cy = CANVAS_RES / 2;
    const displayRadius = getDisplayRadius(beyblade.radius, zoomRef.current);

    // Background
    const bg = new PIXI.Graphics();
    bg.rect(0, 0, CANVAS_RES, CANVAS_RES).fill(0xf3f4f6);
    app.stage.addChild(bg);

    // Reference circle
    const refCircle = new PIXI.Graphics();
    refCircle.circle(cx, cy, 150 * (CANVAS_RES / CANVAS_SIZE)).stroke({ color: 0xd1d5db, width: 2 });
    app.stage.addChild(refCircle);

    // Beyblade container (rotates)
    const bCont = new PIXI.Container();
    bCont.position.set(cx, cy);
    beybladeContainerRef.current = bCont;

    // Beyblade disc
    const disc = new PIXI.Graphics();
    const color = typeColor(beyblade.type);
    disc.circle(0, 0, displayRadius).fill(color);
    disc.circle(0, 0, displayRadius).stroke({ color: 0x1f2937, width: 3 });
    bCont.addChild(disc);

    // Beyblade image (if available)
    if (beyblade.imageUrl) {
      try {
        const texture = await PIXI.Assets.load(beyblade.imageUrl);
        const sprite = new PIXI.Sprite(texture as PIXI.Texture);
        sprite.anchor.set(0.5, 0.5);

        const imgPos = beyblade.imagePosition ?? { x: 0, y: 0, scale: 1, rotation: 0 };
        const aspectRatio = texture.width / texture.height;
        let imgW: number, imgH: number;
        if (aspectRatio > 1) {
          imgW = displayRadius * 2 * imgPos.scale;
          imgH = imgW / aspectRatio;
        } else {
          imgH = displayRadius * 2 * imgPos.scale;
          imgW = imgH * aspectRatio;
        }
        sprite.width = imgW;
        sprite.height = imgH;
        sprite.x = imgPos.x * (displayRadius / 2);
        sprite.y = imgPos.y * (displayRadius / 2);
        sprite.rotation = (imgPos.rotation * Math.PI) / 180;

        // Circular mask
        const maskGfx = new PIXI.Graphics();
        maskGfx.circle(0, 0, displayRadius).fill(0xffffff);
        bCont.addChild(maskGfx);
        sprite.mask = maskGfx;

        bCont.addChild(sprite);

        // Re-draw border on top of image
        const border = new PIXI.Graphics();
        border.circle(0, 0, displayRadius).stroke({ color, width: 4 });
        bCont.addChild(border);

        // Remove plain disc (we have the image)
        bCont.removeChild(disc);
      } catch {
        // Keep plain disc on load failure
      }
    }

    // Spin direction text on plain disc
    if (!beyblade.imageUrl) {
      const label = new PIXI.Text({ text: beyblade.spinDirection === "left" ? "◄" : "►", style: { fill: 0xffffff, fontSize: 20, fontWeight: "bold" } });
      label.anchor.set(0.5, 0.5);
      bCont.addChild(label);
    }

    // Contact points (inside rotating container)
    if (beyblade.pointsOfContact?.length) {
      const cpGfx = new PIXI.Graphics();
      const cpGlow = new PIXI.Graphics();
      beyblade.pointsOfContact.forEach((point) => {
        const angleRad = (point.angle - 90) * (Math.PI / 180);
        const widthRad = ((point.width / 2) * Math.PI) / 180;
        const r = displayRadius + 5;
        const hue = Math.min((point.damageMultiplier - 1.0) * 300, 120);
        const strokeColor = hslToHex(hue, 90, 50);
        const glowColor = hslToHex(hue, 90, 60);

        cpGfx.arc(0, 0, r, angleRad - widthRad, angleRad + widthRad).stroke({ color: strokeColor, width: 6 });
        cpGlow.arc(0, 0, r, angleRad - widthRad, angleRad + widthRad).stroke({ color: glowColor, width: 12, alpha: 0.3 });

        // Indicator dot
        const dotAngle = point.angle * (Math.PI / 180) - Math.PI / 2;
        const dotX = Math.cos(dotAngle) * r;
        const dotY = Math.sin(dotAngle) * r;
        cpGfx.circle(dotX, dotY, 3).fill(strokeColor);
      });
      bCont.addChild(cpGlow);
      bCont.addChild(cpGfx);
    }

    // Spin steal points (inside rotating container)
    if (beyblade.spinStealPoints?.length) {
      const ssGfx = new PIXI.Graphics();
      const ssGlow = new PIXI.Graphics();
      beyblade.spinStealPoints.forEach((point) => {
        const angleRad = (point.angle - 90) * (Math.PI / 180);
        const widthRad = ((point.width / 2) * Math.PI) / 180;
        const r = displayRadius + 12;
        const hue = 180 + (point.spinStealMultiplier - 1.0) * 40;
        const strokeColor = hslToHex(hue, 90, 50);
        const glowColor = hslToHex(hue, 90, 60);

        ssGfx.arc(0, 0, r, angleRad - widthRad, angleRad + widthRad).stroke({ color: strokeColor, width: 6 });
        ssGlow.arc(0, 0, r, angleRad - widthRad, angleRad + widthRad).stroke({ color: glowColor, width: 12, alpha: 0.3 });

        const dotAngle = point.angle * (Math.PI / 180) - Math.PI / 2;
        const dotX = Math.cos(dotAngle) * r;
        const dotY = Math.sin(dotAngle) * r;
        ssGfx.circle(dotX, dotY, 3).fill(strokeColor);
      });
      bCont.addChild(ssGlow);
      bCont.addChild(ssGfx);
    }

    app.stage.addChild(bCont);
  }, [beyblade]);

  // Init PixiJS app once
  useEffect(() => {
    if (!containerRef.current) return;

    let cancelled = false;
    const app = new PIXI.Application();
    appRef.current = app;

    (async () => {
      await app.init({
        width: CANVAS_RES,
        height: CANVAS_RES,
        antialias: true,
        backgroundAlpha: 1,
        background: 0xf3f4f6,
      });

      if (cancelled || !containerRef.current) {
        app.destroy(true);
        return;
      }

      // Scale canvas to CANVAS_SIZE display
      app.canvas.style.width = `${CANVAS_SIZE}px`;
      app.canvas.style.height = `${CANVAS_SIZE}px`;
      app.canvas.style.maxWidth = "100%";
      app.canvas.style.aspectRatio = "1 / 1";
      app.canvas.style.display = "block";
      containerRef.current.appendChild(app.canvas);

      await rebuildScene();

      // Animation ticker
      app.ticker.add(() => {
        const bCont = beybladeContainerRef.current;
        if (!bCont || !isSpinningRef.current) return;
        const speed = beyblade.spinDirection === "left" ? -0.06 : 0.06;
        bCont.rotation += speed;
      });
    })();

    return () => {
      cancelled = true;
      app.destroy(true, { children: true });
      appRef.current = null;
      beybladeContainerRef.current = null;
    };
  }, []); // init once

  // Rebuild scene when beyblade data or zoom changes
  useEffect(() => {
    if (appRef.current) rebuildScene();
  }, [rebuildScene]);

  return (
    <div style={{ background: C.bg2, borderRadius: 12, padding: 16, border: `1px solid ${C.border}` }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 12 }}>Live Preview</div>

      {/* Canvas container */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
        <div
          ref={containerRef}
          onClick={handleClick}
          style={{
            borderRadius: 8,
            border: `2px solid ${C.border}`,
            overflow: "hidden",
            cursor: clickMode ? "crosshair" : "default",
            width: CANVAS_SIZE,
            maxWidth: "100%",
            aspectRatio: "1 / 1",
          }}
        />
      </div>

      {clickMode && (
        <p style={{ fontSize: 12, color: C.blue, textAlign: "center", marginBottom: 12 }}>
          Click on the canvas to place a point (spinning paused)
        </p>
      )}

      {/* Spin + Zoom controls */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: C.bg3, borderRadius: 8, padding: "8px 12px" }}>
          <span style={{ fontSize: 13, color: C.muted }}>Spinning:</span>
          <button
            onClick={() => setIsSpinning(v => !v)}
            style={{ padding: "4px 14px", borderRadius: 6, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 12, background: isSpinning ? C.green : C.bg0, color: isSpinning ? C.white : C.muted }}
          >
            {isSpinning ? "ON" : "OFF"}
          </button>
        </div>
        <div style={{ background: C.bg3, borderRadius: 8, padding: "8px 12px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 13, color: C.muted }}>Zoom:</span>
            <span style={{ fontSize: 13, color: C.blue, fontFamily: "monospace", fontWeight: 700 }}>{zoom}%</span>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <button onClick={() => setZoom(z => Math.max(50, z - 10))} style={{ padding: "2px 8px", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 4, color: C.text, cursor: "pointer" }}>−</button>
            <input type="range" min={50} max={200} value={zoom} onChange={e => setZoom(+e.target.value)} style={{ flex: 1, accentColor: C.blue }} />
            <button onClick={() => setZoom(z => Math.min(200, z + 10))} style={{ padding: "2px 8px", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 4, color: C.text, cursor: "pointer" }}>+</button>
            <button onClick={() => setZoom(100)} style={{ padding: "2px 8px", background: C.blue, border: "none", borderRadius: 4, color: C.white, cursor: "pointer", fontSize: 11 }}>Reset</button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ fontSize: 12, color: C.faint, display: "flex", flexDirection: "column", gap: 4 }}>
        {[
          ["Name", beyblade.displayName || "Unnamed"],
          ["Type", beyblade.type],
          ["Spin", beyblade.spinDirection],
          ["Radius", `${beyblade.radius} cm`],
          ["Mass", `${beyblade.mass}g`],
        ].map(([k, v]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between" }}>
            <span>{k}:</span>
            <span style={{ color: C.text, textTransform: "capitalize" }}>{v}</span>
          </div>
        ))}
      </div>

      {/* Legend */}
      {((beyblade.pointsOfContact?.length ?? 0) > 0 || (beyblade.spinStealPoints?.length ?? 0) > 0) && (
        <div style={{ marginTop: 10, background: C.bg3, borderRadius: 8, padding: 10, fontSize: 11, color: C.faint, display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ fontWeight: 600, color: C.muted }}>Legend:</span>
          {(beyblade.pointsOfContact?.length ?? 0) > 0 && <span>Red→Yellow arcs = Contact points ({beyblade.pointsOfContact.length})</span>}
          {(beyblade.spinStealPoints?.length ?? 0) > 0 && <span>Cyan→Blue arcs = Spin steal ({beyblade.spinStealPoints!.length})</span>}
        </div>
      )}
    </div>
  );
}

// HSL → hex color for PixiJS
function hslToHex(h: number, s: number, l: number): number {
  s /= 100; l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const r = Math.round(f(0) * 255);
  const g = Math.round(f(8) * 255);
  const b = Math.round(f(4) * 255);
  return (r << 16) | (g << 8) | b;
}

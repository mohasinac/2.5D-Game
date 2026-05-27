/**
 * TopDownView — 2D top-down PixiJS canvas.
 * Ported from Canvas 2D → PixiJS 8 so all admin views use one renderer.
 *
 * Material Mode (default): filled polygon/annuli derived from renderRadius(θ), CP filled sectors.
 * Image Mode: sprite overlay of topView images, thin CP arc lines.
 *   (Images load from part.images.topView URLs; fallback ring drawn when unavailable.)
 * Movement path overlay shows expected tip movement pattern.
 */

import { useRef, useEffect, useState, useCallback } from "react";
import * as PIXI from "pixi.js";
import { HEX } from "@/styles/theme";
import { renderRadius, synthesizeRadialCache } from "@/types/beybladeSystem";
import { computeEffectiveRadius } from "@/lib/beybladeSystemConverter";
import type { ResolvedBeybladeSystem } from "@/lib/beybladeSystemConverter";
import type { SystemContactPoint, FourierRadialProfile, PartShape } from "@/types/beybladeSystem";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Loose = Record<string, any>;

const SIZE   = 280;
const CENTER = SIZE / 2;

const MATERIAL_COLORS: Record<string, string> = {
  abs: "#3b82f6", rubber: "#22c55e", metal: "#94a3b8",
  pom: "#eab308", polycarbonate: "#a855f7",
};

// ── Movement path pattern ─────────────────────────────────────────────────────
type PathPattern = "flat" | "sharp" | "semi_flat" | "rubber_flat" | "ball" | "off_center";

function getPathPattern(resolved: ResolvedBeybladeSystem): PathPattern {
  const tip = resolved.tip as Loose | undefined;
  if (!tip) return "flat";
  const tipShape = tip.tipShape as string | undefined;
  const dims = tip.dimensions as { tipOffsetX?: number; tipOffsetY?: number } | undefined;
  if (dims?.tipOffsetX || dims?.tipOffsetY) return "off_center";
  if (tipShape === "sharp" || tipShape === "spike") return "sharp";
  if (tipShape === "rubber_flat" || tipShape === "rubber_ball") return "rubber_flat";
  if (tipShape === "semi_flat") return "semi_flat";
  if (tipShape === "ball" || tipShape === "wide" || tipShape === "hole_flat" || tipShape === "defense") return "ball";
  return "flat";
}

function addMovementPath(stage: PIXI.Container, pattern: PathPattern) {
  const gfx = new PIXI.Graphics();
  gfx.alpha = 0.35;

  switch (pattern) {
    case "flat": {
      const r = CENTER * 0.70;
      gfx.circle(CENTER, CENTER, r).stroke({ color: HEX.blue, width: 1.5 });
      break;
    }
    case "rubber_flat": {
      const r = CENTER * 0.30;
      gfx.circle(CENTER, CENTER, r).stroke({ color: HEX.green, width: 1.5 });
      break;
    }
    case "sharp": {
      for (let i = 0; i < 6; i++) {
        const a   = (i / 6) * Math.PI * 2;
        const len = CENTER * 0.5;
        gfx.moveTo(CENTER, CENTER).lineTo(CENTER + Math.cos(a) * len, CENTER + Math.sin(a) * len);
      }
      gfx.stroke({ color: HEX.red, width: 1 });
      break;
    }
    case "semi_flat": {
      const r = CENTER * 0.50;
      gfx.circle(CENTER, CENTER, r).stroke({ color: HEX.yellow, width: 1.5 });
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2;
        gfx.moveTo(CENTER + Math.cos(a) * r, CENTER + Math.sin(a) * r)
           .lineTo(CENTER + Math.cos(a) * (r + CENTER * 0.18), CENTER + Math.sin(a) * (r + CENTER * 0.18));
      }
      gfx.stroke({ color: HEX.yellow, width: 1 });
      break;
    }
    case "ball": {
      const r = CENTER * 0.50;
      gfx.circle(CENTER, CENTER, r).stroke({ color: HEX.muted, width: 1.5 });
      const dotGfx = new PIXI.Graphics();
      for (let i = 0; i < 8; i++) {
        const a  = (i / 8) * Math.PI * 2 + 0.4;
        const dr = (((i * 37) % 5) - 2) * 6;
        dotGfx.circle(CENTER + Math.cos(a) * (r + dr), CENTER + Math.sin(a) * (r + dr), 2).fill({ color: HEX.muted });
      }
      dotGfx.alpha = 0.35;
      stage.addChild(dotGfx);
      break;
    }
    case "off_center": {
      const pts: number[] = [];
      for (let i = 0; i <= 120; i++) {
        const t = i / 120;
        const a = t * Math.PI * 4;
        const r = CENTER * 0.15 + t * CENTER * 0.55;
        pts.push(CENTER + Math.cos(a) * r, CENTER + Math.sin(a) * r);
      }
      for (let i = 2; i < pts.length; i += 2)
        gfx.moveTo(pts[i - 2], pts[i - 1]).lineTo(pts[i], pts[i + 1]);
      gfx.stroke({ color: HEX.orange, width: 1.5 });
      break;
    }
  }
  stage.addChild(gfx);
}

// ── CP arc (annular sector) ───────────────────────────────────────────────────
function addCPArc(stage: PIXI.Container, cp: SystemContactPoint, pxPerMm: number, filled: boolean) {
  const color = MATERIAL_COLORS[cp.material] ?? HEX.blue;
  const acp   = cp as Loose;
  const startDeg = acp.arcStart !== undefined ? acp.arcStart : (cp.angle - (cp.width ?? 30) / 2);
  const endDeg   = acp.arcEnd   !== undefined ? acp.arcEnd   : (cp.angle + (cp.width ?? 30) / 2);
  const rInner   = (acp.radiusInner ?? cp.radius ?? 10) * pxPerMm;
  const rOuter   = (acp.radiusOuter !== undefined
    ? acp.radiusOuter
    : (acp.radiusInner ?? cp.radius ?? 10) + (acp.lineThickness ?? cp.thickness ?? 2)) * pxPerMm;
  const startRad = ((startDeg - 90) * Math.PI) / 180;
  const endRad   = ((endDeg   - 90) * Math.PI) / 180;

  const gfx = new PIXI.Graphics();
  if (filled) {
    // Annular sector: outer arc forward + inner arc backward
    const steps = Math.max(12, Math.round(Math.abs(endRad - startRad) * 20));
    const pts: number[] = [];
    for (let i = 0; i <= steps; i++) {
      const a = startRad + (i / steps) * (endRad - startRad);
      pts.push(CENTER + Math.cos(a) * rOuter, CENTER + Math.sin(a) * rOuter);
    }
    for (let i = steps; i >= 0; i--) {
      const a = startRad + (i / steps) * (endRad - startRad);
      pts.push(CENTER + Math.cos(a) * Math.max(1, rInner), CENTER + Math.sin(a) * Math.max(1, rInner));
    }
    gfx.poly(pts).fill({ color, alpha: 0.6 });
    gfx.poly(pts).stroke({ color, width: 0.8 });
  } else {
    const rMid = (rInner + rOuter) / 2;
    gfx.arc(CENTER, CENTER, rMid, startRad, endRad).stroke({ color, width: 1.5 });
  }
  stage.addChild(gfx);
}

// ── Shield disk ring ──────────────────────────────────────────────────────────
function addShieldDiskRing(stage: PIXI.Container, diskRadius: number, pxPerMm: number, color: string) {
  const r = diskRadius * pxPerMm;
  const gfx = new PIXI.Graphics();
  gfx.circle(CENTER, CENTER, r).stroke({ color, width: 2, alpha: 0.6 });
  // Thin ring fill
  const ring = new PIXI.Graphics();
  const steps = 60;
  const pts: number[] = [];
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    pts.push(CENTER + Math.cos(a) * r, CENTER + Math.sin(a) * r);
  }
  for (let i = steps; i >= 0; i--) {
    const a = (i / steps) * Math.PI * 2;
    pts.push(CENTER + Math.cos(a) * Math.max(0, r - 3), CENTER + Math.sin(a) * Math.max(0, r - 3));
  }
  ring.poly(pts).fill({ color, alpha: 0.07 });
  stage.addChild(ring);
  stage.addChild(gfx);
}

// ── Grid ─────────────────────────────────────────────────────────────────────
function addGrid(stage: PIXI.Container, maxRadius: number, pxPerMm: number) {
  const gfx = new PIXI.Graphics();
  for (let r = 5; r <= maxRadius + 5; r += 5)
    gfx.circle(CENTER, CENTER, r * pxPerMm);
  gfx.stroke({ color: HEX.border, width: 0.5, alpha: 0.33 });
  // Crosshair
  const ch = new PIXI.Graphics();
  ch.moveTo(CENTER - 8, CENTER).lineTo(CENTER + 8, CENTER);
  ch.moveTo(CENTER, CENTER - 8).lineTo(CENTER, CENTER + 8);
  ch.stroke({ color: HEX.faint, width: 0.5 });
  stage.addChild(gfx);
  stage.addChild(ch);
}

// ── Material mode ─────────────────────────────────────────────────────────────
function addMaterialMode(stage: PIXI.Container, resolved: ResolvedBeybladeSystem, pxPerMm: number) {
  const parts = [
    { part: resolved.weightDisk,  layer: "wd" },
    { part: resolved.attackRing,  layer: "ar" },
    { part: resolved.bitBeast,    layer: "bb" },
    ...(resolved.subParts ?? []).map((a) => ({ part: a.part, layer: "sub" })),
  ];

  for (const { part } of parts) {
    if (!part) continue;
    const p = part as Loose;
    const dims     = p.dimensions as { outerRadius?: number; innerRadius?: number } | undefined;
    const geometry = p.geometry as PartShape | undefined;
    const fallbackR = dims?.outerRadius ?? 20;
    const outerR = geometry ? computeEffectiveRadius(geometry, fallbackR) : fallbackR;
    const innerR = dims?.innerRadius ?? 0;
    const color  = (p.color as string) ?? HEX.faint;
    const fourierProfile = p.geometry?.fourierProfile as FourierRadialProfile | undefined;
    const cps = (p.contactPoints as SystemContactPoint[]) ?? [];

    const gfx = new PIXI.Graphics();
    if (fourierProfile) {
      const cache = fourierProfile.radialCache ?? synthesizeRadialCache(fourierProfile);
      const polygon: number[] = [];
      for (let deg = 0; deg < 360; deg++) {
        const r   = renderRadius(deg, cache, cps) * pxPerMm;
        const rad = ((deg - 90) * Math.PI) / 180;
        polygon.push(CENTER + Math.cos(rad) * r, CENTER + Math.sin(rad) * r);
      }
      gfx.poly(polygon).fill({ color, alpha: 0.27 });
      gfx.poly(polygon).stroke({ color, width: 1, alpha: 0.67 });
    } else {
      if (innerR > 0) {
        // Annulus
        const steps = 60;
        const pts: number[] = [];
        for (let i = 0; i <= steps; i++) {
          const a = (i / steps) * Math.PI * 2;
          pts.push(CENTER + Math.cos(a) * outerR * pxPerMm, CENTER + Math.sin(a) * outerR * pxPerMm);
        }
        for (let i = steps; i >= 0; i--) {
          const a = (i / steps) * Math.PI * 2;
          pts.push(CENTER + Math.cos(a) * innerR * pxPerMm, CENTER + Math.sin(a) * innerR * pxPerMm);
        }
        gfx.poly(pts).fill({ color, alpha: 0.27 });
        gfx.poly(pts).stroke({ color, width: 1, alpha: 0.67 });
      } else {
        gfx.circle(CENTER, CENTER, outerR * pxPerMm).fill({ color, alpha: 0.27 });
        gfx.circle(CENTER, CENTER, outerR * pxPerMm).stroke({ color, width: 1, alpha: 0.67 });
      }
    }
    stage.addChild(gfx);

    for (const cp of cps) addCPArc(stage, cp, pxPerMm, true);
  }

  // Tip contact patch
  const tip = resolved.tip as Loose | undefined;
  if (tip) {
    const tipDims = tip.dimensions as { tipWidth?: number; outerRadius?: number; innerRadius?: number; tipOffsetX?: number; tipOffsetY?: number } | undefined;
    const containsCasing = !!(tip.containsCasing);
    const ox = (tipDims?.tipOffsetX ?? 0) * pxPerMm;
    const oy = (tipDims?.tipOffsetY ?? 0) * pxPerMm;
    const tipColor = (tip.color as string) || HEX.faint;
    const tipGfx = new PIXI.Graphics();

    if (containsCasing) {
      const outerR = (tipDims?.outerRadius ?? 20) * pxPerMm;
      const innerR = (tipDims?.innerRadius ?? 15) * pxPerMm;
      const steps = 60;
      const pts: number[] = [];
      for (let i = 0; i <= steps; i++) { const a = (i / steps) * Math.PI * 2; pts.push(CENTER + ox + Math.cos(a) * outerR, CENTER + oy + Math.sin(a) * outerR); }
      for (let i = steps; i >= 0; i--) { const a = (i / steps) * Math.PI * 2; pts.push(CENTER + ox + Math.cos(a) * innerR, CENTER + oy + Math.sin(a) * innerR); }
      tipGfx.poly(pts).fill({ color: tipColor, alpha: 0.27 });
      tipGfx.circle(CENTER + ox, CENTER + oy, outerR).stroke({ color: tipColor, width: 1.5 });
      tipGfx.circle(CENTER + ox, CENTER + oy, innerR).stroke({ color: tipColor, width: 0.8, alpha: 0.27 });
    } else {
      const tw = (tipDims?.tipWidth ?? tipDims?.outerRadius ?? 3) * pxPerMm;
      tipGfx.circle(CENTER + ox, CENTER + oy, tw).fill({ color: tipColor, alpha: 0.53 });
      tipGfx.circle(CENTER + ox, CENTER + oy, tw).stroke({ color: tipColor, width: 1 });
    }
    stage.addChild(tipGfx);
  }

  // SpinTrack shield disk
  const spinTrack = (resolved as Loose).spinTrack as Loose | undefined;
  if (spinTrack?.shieldDisk?.enabled) {
    const sd = spinTrack.shieldDisk as { diskRadius?: number };
    addShieldDiskRing(stage, sd.diskRadius ?? 17, pxPerMm, (spinTrack.color as string) ?? "#64748b");
  }

  // Pocket balls
  const allParts = [resolved.attackRing, resolved.weightDisk, resolved.casing, resolved.tip, resolved.core, resolved.bitBeast];
  for (const part of allParts) {
    if (!part) continue;
    const pockets = ((part as Loose).pockets as Array<{ position: { x: number; y: number }; ballMaterial: string }>) ?? [];
    for (const pocket of pockets) {
      const px   = CENTER + pocket.position.x * pxPerMm;
      const py   = CENTER + pocket.position.y * pxPerMm;
      const pGfx = new PIXI.Graphics();
      pGfx.circle(px, py, 3).fill({ color: pocket.ballMaterial === "metal" ? HEX.muted : HEX.yellow });
      stage.addChild(pGfx);
    }
  }
}

// ── Image mode (shows topView images; fallback to outline ring) ───────────────
function addImageMode(
  stage: PIXI.Container,
  resolved: ResolvedBeybladeSystem,
  pxPerMm: number,
  textures: Map<string, PIXI.Texture>,
) {
  const parts: Array<{ part: Loose | null | undefined; key: string }> = [
    { part: resolved.weightDisk as Loose, key: "wd" },
    { part: resolved.attackRing as Loose, key: "ar" },
    { part: resolved.bitBeast as Loose,   key: "bb" },
  ];

  for (const { part, key } of parts) {
    if (!part) continue;
    const dims   = part.dimensions as { outerRadius?: number } | undefined;
    const r      = (dims?.outerRadius ?? 20) * pxPerMm;
    const color  = part.color as string || HEX.faint;
    const tex    = textures.get(key);

    if (tex && tex !== PIXI.Texture.EMPTY) {
      const sprite = new PIXI.Sprite(tex);
      sprite.anchor.set(0.5);
      sprite.position.set(CENTER, CENTER);
      sprite.width  = r * 2;
      sprite.height = r * 2;
      stage.addChild(sprite);
    } else {
      const ring = new PIXI.Graphics();
      ring.circle(CENTER, CENTER, r).stroke({ color, width: 1 });
      stage.addChild(ring);
    }

    const cps = (part.contactPoints as SystemContactPoint[]) ?? [];
    for (const cp of cps) addCPArc(stage, cp, pxPerMm, false);
  }
}

// ── Component ─────────────────────────────────────────────────────────────────
interface FullProps {
  resolved?: ResolvedBeybladeSystem | null;
  showMaterial?: boolean;
  showMovementPath?: boolean;
}

export function TopDownView({ resolved, showMaterial = false, showMovementPath = true }: FullProps) {
  const containerRef    = useRef<HTMLDivElement>(null);
  const appRef          = useRef<PIXI.Application | null>(null);
  const appInitRef      = useRef(false);
  const resolvedRef     = useRef(resolved);
  const materialModeRef = useRef(showMaterial);
  const showPathRef     = useRef(showMovementPath);
  const textureCache    = useRef<Map<string, PIXI.Texture>>(new Map());
  // texture load triggers
  const [, setTextureVer] = useState(0);

  resolvedRef.current     = resolved;
  materialModeRef.current = showMaterial;
  showPathRef.current     = showMovementPath;

  const [materialMode, setMaterialMode] = useState(showMaterial);
  useEffect(() => { setMaterialMode(showMaterial); }, [showMaterial]);

  const rebuildScene = useCallback(() => {
    const app = appRef.current;
    if (!app || !appInitRef.current) return;

    app.stage.removeChildren();
    const bg = new PIXI.Graphics();
    bg.rect(0, 0, SIZE, SIZE).fill({ color: HEX.bg0 });
    app.stage.addChild(bg);

    const res = resolvedRef.current;
    if (!res) {
      const msg = new PIXI.Text({ text: "No system loaded", style: { fill: HEX.faint, fontSize: 11, fontFamily: "sans-serif" } });
      msg.anchor.set(0.5, 0.5);
      msg.position.set(SIZE / 2, SIZE / 2);
      app.stage.addChild(msg);
      return;
    }

    const ar = res.attackRing as Loose;
    const wd = res.weightDisk as Loose;
    const tip = res.tip as Loose | undefined;
    const arFallback = (ar?.dimensions?.outerRadius as number) ?? 30;
    const wdFallback = (wd?.dimensions?.outerRadius as number) ?? 30;
    const arR = ar?.geometry ? computeEffectiveRadius(ar.geometry as PartShape, arFallback) : arFallback;
    const wdR = wd?.geometry ? computeEffectiveRadius(wd.geometry as PartShape, wdFallback) : wdFallback;
    const tipR = (tip?.containsCasing || tip?.extendsAboveCasing)
      ? ((tip?.dimensions?.outerRadius as number) ?? 0) : 0;
    const maxR  = Math.max(arR, wdR, tipR, 20);
    const pxPerMm = (SIZE * 0.46) / maxR;

    addGrid(app.stage, maxR, pxPerMm);

    if (materialModeRef.current) {
      addMaterialMode(app.stage, res, pxPerMm);
    } else {
      // Trigger async texture loads for parts that have topView images
      const loadIfNeeded = (part: Loose | null | undefined, key: string) => {
        if (!part) return;
        const topView = (part.images as Loose | undefined)?.topView as string | undefined;
        if (topView && !textureCache.current.has(key)) {
          textureCache.current.set(key, PIXI.Texture.EMPTY); // placeholder
          PIXI.Assets.load(topView).then((tex: PIXI.Texture) => {
            textureCache.current.set(key, tex);
            setTextureVer(v => v + 1); // trigger rebuild
          }).catch(() => {
            textureCache.current.delete(key);
          });
        }
      };
      loadIfNeeded(res.weightDisk as Loose, "wd");
      loadIfNeeded(res.attackRing as Loose, "ar");
      loadIfNeeded(res.bitBeast as Loose,   "bb");
      addImageMode(app.stage, res, pxPerMm, textureCache.current);
    }

    if (showPathRef.current) {
      const pattern = getPathPattern(res);
      addMovementPath(app.stage, pattern);
    }
  }, []);

  // Init once
  useEffect(() => {
    if (!containerRef.current) return;
    let cancelled = false;
    const app = new PIXI.Application();

    void (async () => {
      await app.init({ width: SIZE, height: SIZE, antialias: true, resolution: 1, backgroundColor: 0x111827 });
      if (cancelled || !containerRef.current) { app.destroy(true); return; }

      app.canvas.style.display = "block";
      app.canvas.style.width   = "100%";
      app.canvas.style.height  = "auto";
      containerRef.current.appendChild(app.canvas);
      appInitRef.current = true;
      appRef.current     = app;
      rebuildScene();
    })();

    return () => {
      cancelled = true;
      appInitRef.current = false;
      try {
        if (app.canvas?.parentNode) app.canvas.parentNode.removeChild(app.canvas);
        app.destroy(true, { children: true });
      } catch { /* init may still be in flight */ }
      appRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Rebuild when inputs change
  useEffect(() => {
    if (appRef.current && appInitRef.current) rebuildScene();
  }, [resolved, materialMode, showMovementPath, rebuildScene]);

  const tip = resolved?.tip as Record<string, unknown> | undefined;
  const tipShape = (tip?.tipShape as string | undefined) ?? "?";

  return (
    <div>
      <div className="flex items-center justify-between mb-[6px]">
        <span className="text-[10px] text-theme-faint">Top-Down View</span>
        <div className="flex gap-[6px] items-center">
          {showMovementPath && resolved && (
            <span className="text-[10px] text-theme-muted bg-bg2 py-[2px] px-[7px] rounded-[4px] border border-border-c">
              {tipShape} pattern
            </span>
          )}
          <button
            onClick={() => setMaterialMode((m) => !m)}
            className={`py-[3px] px-2 text-[10px] rounded-[5px] cursor-pointer border ${
              materialMode
                ? "bg-blue-13 text-theme-blue border-[rgba(59,130,246,0.33)]"
                : "bg-bg2 text-theme-muted border-border-c"
            }`}
          >
            {materialMode ? "Image" : "Material"}
          </button>
        </div>
      </div>
      <div
        ref={containerRef}
        className="rounded-lg border border-border-c block overflow-hidden"
        style={{ width: SIZE, height: SIZE }}
      />
    </div>
  );
}

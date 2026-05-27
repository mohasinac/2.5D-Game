/**
 * SideProfileView — cross-section canvas (height × radius).
 * Ported from Canvas 2D → PixiJS 8 so all admin views use one renderer.
 *
 * Y axis = height from floor (mm, 0 at bottom).
 * X axis = radius from center (mm, 0 at center line).
 * Each layer is drawn as a filled rectangle/polygon at its absolute height.
 * Contact points appear as coloured horizontal bands on the outer edge.
 */

import { useRef, useEffect, useCallback } from "react";
import * as PIXI from "pixi.js";
import { HEX } from "@/styles/theme";
import { computeEffectiveRadius } from "@/lib/beybladeSystemConverter";
import type { ResolvedBeybladeSystem } from "@/lib/beybladeSystemConverter";
import type { SystemContactPoint, PartShape } from "@/types/beybladeSystem";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Loose = Record<string, any>;

const W = 260;
const H = 300;
const PAD = { left: 40, right: 20, top: 14, bottom: 28 };
const DRAW_W = W - PAD.left - PAD.right;
const DRAW_H = H - PAD.top - PAD.bottom;

const ATTACK_ANGLES: Record<string, number> = {
  smash: 0, upper: 30, absorb: -15, burst: 0, spin_steal: 0,
};
const MATERIAL_COLORS: Record<string, string> = {
  abs: "#3b82f6", rubber: "#22c55e", metal: "#94a3b8",
  pom: "#eab308", polycarbonate: "#a855f7",
};

interface LayerInfo {
  label: string;
  color: string;
  heightMm: number;
  radiusMm: number;
  innerRadiusMm: number;
  contactPoints: SystemContactPoint[];
  isTip: boolean;
  tipOffsetX?: number;
  tipOffsetY?: number;
}

interface Props {
  resolved?: ResolvedBeybladeSystem | null;
  width?: number;
  height?: number;
}

function buildLayers(resolved: ResolvedBeybladeSystem): {
  layers: LayerInfo[];
  trackHeight: number;
  containsCasing: boolean;
  trackShieldDisk?: { diskHeight: number; diskRadius: number; color: string };
} {
  const layers: LayerInfo[] = [];
  const tip = resolved.tip as Loose | undefined;
  const containsCasing = !!(tip?.containsCasing);
  const trackHeight = (resolved.spinTrack as Loose | undefined)?.height ?? 0;

  const add = (label: string, part: Loose | null | undefined, isTip = false, heightOffset = 0) => {
    if (!part) return;
    const dims = part.dimensions as {
      height?: number; outerRadius?: number; innerRadius?: number;
      radius?: number; tipWidth?: number;
    } | undefined;
    const rawHeight = dims?.height ?? 0;
    if (rawHeight <= 0) return;
    const heightMm = rawHeight + heightOffset;
    const fallbackR = dims?.outerRadius ?? dims?.radius ?? 10;
    const geometry = part.geometry as PartShape | undefined;
    const radiusMm = isTip
      ? (dims?.tipWidth ?? dims?.outerRadius ?? 5)
      : (geometry ? computeEffectiveRadius(geometry, fallbackR) : fallbackR);
    layers.push({
      label, color: (part.color as string) ?? HEX.faint,
      heightMm, radiusMm,
      innerRadiusMm: isTip ? 0 : (dims?.innerRadius ?? 0),
      contactPoints: (part.contactPoints as SystemContactPoint[]) ?? [],
      isTip, tipOffsetX: 0, tipOffsetY: 0,
    });
  };

  if (containsCasing) {
    add("Core",     resolved.core as Loose,       false, trackHeight);
    add("Casing",   resolved.casing as Loose,     false, trackHeight);
    add("WD",       resolved.weightDisk as Loose, false, trackHeight);
    add("AR",       resolved.attackRing as Loose, false, trackHeight);
    add("BitBeast", resolved.bitBeast as Loose,   false, trackHeight);
    add("Tip (cup)", tip, true);
  } else {
    add("Tip", tip, true);
    if (trackHeight > 0) {
      const track = resolved.spinTrack as Loose;
      const trackDims = track?.dimensions as { outerRadius?: number } | undefined;
      layers.push({
        label: `Track (${trackHeight}mm)`,
        color: (track?.color as string) ?? "#64748b",
        heightMm: trackHeight, radiusMm: trackDims?.outerRadius ?? 4,
        innerRadiusMm: 2, contactPoints: [], isTip: false,
        tipOffsetX: 0, tipOffsetY: 0,
      });
    }
    add("Core",     resolved.core as Loose,       false, trackHeight);
    add("Casing",   resolved.casing as Loose,     false, trackHeight);
    add("WD",       resolved.weightDisk as Loose, false, trackHeight);
    add("AR",       resolved.attackRing as Loose, false, trackHeight);
    add("BitBeast", resolved.bitBeast as Loose,   false, trackHeight);
  }

  for (const { part: subPart, attachment } of resolved.subParts ?? []) {
    const hLabel = attachment.placement === "above" ? "↑" : "↓";
    add(`Sub (${hLabel})`, subPart as Loose, false, trackHeight);
  }

  const trackDoc = resolved.spinTrack as Loose | undefined;
  const sd = trackDoc?.shieldDisk as { enabled?: boolean; diskHeight?: number; diskRadius?: number } | undefined;
  const trackShieldDisk = sd?.enabled
    ? { diskHeight: sd.diskHeight ?? 0, diskRadius: sd.diskRadius ?? 17, color: (trackDoc?.color as string) ?? "#64748b" }
    : undefined;

  return { layers, trackHeight, containsCasing, trackShieldDisk };
}

// ── Scene builder (called once per resolved change) ───────────────────────────
function buildScene(
  stage: PIXI.Container,
  layers: LayerInfo[],
  maxH: number,
  trackShieldDisk?: { diskHeight: number; diskRadius: number; color: string },
  trackHeight = 0,
) {
  stage.removeChildren();

  const bg = new PIXI.Graphics();
  bg.rect(0, 0, W, H).fill({ color: HEX.bg0 });
  stage.addChild(bg);

  const scaleY = DRAW_H / maxH;
  const maxRadius = layers.reduce((m, l) => Math.max(m, l.radiusMm), 20);
  const scaleX = (DRAW_W / 2) / maxRadius;
  const cx = PAD.left + DRAW_W / 2;

  const toY  = (h: number) => PAD.top + DRAW_H - h * scaleY;
  const toX  = (r: number) => cx + r * scaleX;
  const toXl = (r: number) => cx - r * scaleX;

  // ── Grid ─────────────────────────────────────────────────────────────────────
  const grid = new PIXI.Graphics();
  for (let h = 0; h <= maxH; h += 10)
    grid.moveTo(PAD.left, toY(h)).lineTo(W - PAD.right, toY(h));
  grid.stroke({ color: HEX.border, width: 0.5, alpha: 0.27 });
  const axes = new PIXI.Graphics();
  axes.moveTo(cx, PAD.top).lineTo(cx, PAD.top + DRAW_H);
  axes.moveTo(PAD.left, toY(0)).lineTo(W - PAD.right, toY(0));
  axes.stroke({ color: HEX.faint, width: 0.5 });
  stage.addChild(grid);
  stage.addChild(axes);

  // Height labels
  for (let h = 0; h <= maxH; h += 10) {
    const t = new PIXI.Text({ text: `${h}`, style: { fill: HEX.faint, fontSize: 9, fontFamily: "sans-serif" } });
    t.anchor.set(1, 0.5);
    t.position.set(PAD.left - 4, toY(h));
    stage.addChild(t);
  }

  // ── Part layers ───────────────────────────────────────────────────────────────
  const sorted = [...layers].sort((a, b) => a.heightMm - b.heightMm);
  for (const layer of sorted) {
    const yTop   = toY(layer.heightMm);
    const yFloor = toY(0);
    const layerH = yFloor - yTop;
    if (layerH <= 0) continue;

    const xRight  = toX(layer.radiusMm);
    const xLeft   = toXl(layer.radiusMm);
    const xInnerR = layer.innerRadiusMm > 0 ? toX(layer.innerRadiusMm) : cx;
    const xInnerL = layer.innerRadiusMm > 0 ? toXl(layer.innerRadiusMm) : cx;

    const fill    = new PIXI.Graphics();
    const outline = new PIXI.Graphics();

    if (layer.innerRadiusMm > 0) {
      fill.rect(xLeft, yTop, xInnerL - xLeft, layerH).fill({ color: layer.color, alpha: 0.27 });
      fill.rect(xInnerR, yTop, xRight - xInnerR, layerH).fill({ color: layer.color, alpha: 0.27 });
      outline.rect(xLeft, yTop, xInnerL - xLeft, layerH).stroke({ color: layer.color, width: 1, alpha: 0.8 });
      outline.rect(xInnerR, yTop, xRight - xInnerR, layerH).stroke({ color: layer.color, width: 1, alpha: 0.8 });
    } else if (layer.isTip && (layer.tipOffsetX || layer.tipOffsetY)) {
      const offX = (layer.tipOffsetX ?? 0) * scaleX;
      fill.rect(cx + offX - layer.radiusMm * scaleX, yTop, layer.radiusMm * 2 * scaleX, layerH).fill({ color: layer.color, alpha: 0.27 });
      outline.rect(cx + offX - layer.radiusMm * scaleX, yTop, layer.radiusMm * 2 * scaleX, layerH).stroke({ color: layer.color, width: 1, alpha: 0.8 });
    } else {
      fill.rect(xLeft, yTop, xRight - xLeft, layerH).fill({ color: layer.color, alpha: 0.27 });
      outline.rect(xLeft, yTop, xRight - xLeft, layerH).stroke({ color: layer.color, width: 1, alpha: 0.8 });
    }
    stage.addChild(fill);
    stage.addChild(outline);

    const lbl = new PIXI.Text({ text: layer.label, style: { fill: HEX.muted, fontSize: 9, fontFamily: "sans-serif" } });
    lbl.anchor.set(0, 0.5);
    lbl.position.set(xRight + 3, yTop + 6);
    stage.addChild(lbl);

    // ── Contact-point bands ────────────────────────────────────────────────────
    for (const cp of layer.contactPoints) {
      const bc = MATERIAL_COLORS[cp.material] ?? HEX.blue;
      const yMin  = toY(cp.heightRange.max);
      const yMax  = toY(cp.heightRange.min);
      const bandH = yMax - yMin;
      if (bandH <= 0) continue;

      const bf = new PIXI.Graphics();
      bf.rect(xRight - 6, yMin, 6, bandH).fill({ color: bc, alpha: 0.33 });
      bf.rect(xLeft, yMin, 6, bandH).fill({ color: bc, alpha: 0.33 });
      const bs = new PIXI.Graphics();
      bs.rect(xRight - 6, yMin, 6, bandH).stroke({ color: bc, width: 0.8, alpha: 0.73 });
      bs.rect(xLeft, yMin, 6, bandH).stroke({ color: bc, width: 0.8, alpha: 0.73 });
      stage.addChild(bf);
      stage.addChild(bs);

      // Attack angle indicator
      const angle = ATTACK_ANGLES[cp.attackType] ?? 0;
      const rad   = (angle * Math.PI) / 180;
      const midY  = (yMin + yMax) / 2;
      const len   = Math.min(bandH * 0.8, 12);
      const rxc   = xRight - 3;
      const ind   = new PIXI.Graphics();
      ind.moveTo(rxc - len / 2 * Math.cos(rad), midY + len / 2 * Math.sin(rad))
         .lineTo(rxc + len / 2 * Math.cos(rad), midY - len / 2 * Math.sin(rad))
         .stroke({ color: bc, width: 1 });
      stage.addChild(ind);
    }
  }

  // ── Shield disk ───────────────────────────────────────────────────────────────
  if (trackShieldDisk) {
    const dY = toY(trackShieldDisk.diskHeight);
    const dX1 = toXl(trackShieldDisk.diskRadius);
    const dX2 = toX(trackShieldDisk.diskRadius);
    const sdf = new PIXI.Graphics();
    sdf.rect(dX1, dY - 3, dX2 - dX1, 6).fill({ color: trackShieldDisk.color, alpha: 0.33 });
    const sds = new PIXI.Graphics();
    sds.rect(dX1, dY - 3, dX2 - dX1, 6).stroke({ color: trackShieldDisk.color, width: 1, alpha: 0.8 });
    stage.addChild(sdf);
    stage.addChild(sds);
    const sdl = new PIXI.Text({ text: `Shield @${trackShieldDisk.diskHeight}mm`, style: { fill: trackShieldDisk.color, fontSize: 8, fontFamily: "sans-serif" } });
    sdl.position.set(toX(trackShieldDisk.diskRadius) + 3, dY - 3);
    stage.addChild(sdl);
  }

  // ── Track height annotation ───────────────────────────────────────────────────
  if (trackHeight > 0) {
    const tY  = toY(trackHeight);
    const tl  = new PIXI.Graphics();
    tl.moveTo(PAD.left, tY).lineTo(W - PAD.right, tY).stroke({ color: "#f59e0b", width: 0.8, alpha: 0.27 });
    stage.addChild(tl);
    const tlt = new PIXI.Text({ text: `+${trackHeight}mm track`, style: { fill: "#f59e0b", fontSize: 8, fontFamily: "sans-serif" } });
    tlt.anchor.set(1, 1);
    tlt.position.set(PAD.left + DRAW_W - 2, tY - 2);
    stage.addChild(tlt);
  }

  // ── Floor label ───────────────────────────────────────────────────────────────
  const fl = new PIXI.Text({ text: "FLOOR", style: { fill: HEX.faint, fontSize: 9, fontFamily: "sans-serif" } });
  fl.anchor.set(0.5, 0);
  fl.position.set(cx, toY(0) + 6);
  stage.addChild(fl);
}

// ── Component ─────────────────────────────────────────────────────────────────
export function SideProfileView({ resolved, width = W, height = H }: Props) {
  const containerRef  = useRef<HTMLDivElement>(null);
  const appRef        = useRef<PIXI.Application | null>(null);
  const appInitRef    = useRef(false);
  const resolvedRef   = useRef(resolved);
  resolvedRef.current = resolved;

  // Stable rebuild — reads from ref, never causes re-render
  const rebuildScene = useCallback(() => {
    const app = appRef.current;
    if (!app || !appInitRef.current) return;

    const res = resolvedRef.current;
    if (!res) {
      app.stage.removeChildren();
      const bg = new PIXI.Graphics();
      bg.rect(0, 0, W, H).fill({ color: HEX.bg0 });
      app.stage.addChild(bg);
      const msg = new PIXI.Text({ text: "No system loaded", style: { fill: HEX.faint, fontSize: 11, fontFamily: "sans-serif" } });
      msg.anchor.set(0.5, 0.5);
      msg.position.set(W / 2, H / 2);
      app.stage.addChild(msg);
      return;
    }

    const { layers, trackHeight, trackShieldDisk } = buildLayers(res);
    const maxH = layers.reduce((m, l) => Math.max(m, l.heightMm), 60);
    buildScene(app.stage, layers, maxH + 4, trackShieldDisk, trackHeight);
  }, []);

  // Init once
  useEffect(() => {
    if (!containerRef.current) return;
    let cancelled = false;
    const app = new PIXI.Application();

    void (async () => {
      await app.init({ width: W, height: H, antialias: true, resolution: 1, backgroundColor: 0x111827 });
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

  // Rebuild when resolved changes
  useEffect(() => {
    if (appRef.current && appInitRef.current) rebuildScene();
  }, [resolved, rebuildScene]);

  // width/height props kept for API compatibility — the canvas fills the container
  void width; void height;

  return (
    <div
      ref={containerRef}
      className="block rounded-lg border border-border-c overflow-hidden"
      style={{ width: W, height: H }}
    />
  );
}

/**
 * SideProfileView — cross-section canvas (height × radius).
 *
 * Y axis = height from floor (mm, 0 at bottom).
 * X axis = radius from center (mm, 0 at center line).
 * Each layer is drawn as a filled rectangle/polygon at its absolute height.
 * Contact points appear as colored horizontal bands on the outer edge.
 */

import { useRef, useEffect } from "react";
import { C, HEX } from "@/styles/theme";
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

// Attack type → angle for the indicator line inside the CP band
const ATTACK_ANGLES: Record<string, number> = {
  smash:      0,
  upper:      30,
  absorb:     -15,
  burst:      0,
  spin_steal: 0,
};

// Attack type → dash pattern
const ATTACK_DASH: Record<string, number[]> = {
  burst:      [3, 3],
  spin_steal: [2, 2],
};

// Material → CP band color
const MATERIAL_COLORS: Record<string, string> = {
  abs:           "#3b82f6",
  rubber:        "#22c55e",
  metal:         "#94a3b8",
  pom:           "#eab308",
  polycarbonate: "#a855f7",
};

interface LayerInfo {
  label: string;
  color: string;
  heightMm: number;          // top of this layer (absolute from floor)
  radiusMm: number;          // effective outer radius
  innerRadiusMm: number;     // inner bore radius (0 for solid)
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

  const add = (
    label: string,
    part: Loose | null | undefined,
    isTip = false,
    heightOffset = 0,
  ) => {
    if (!part) return;
    const dims = part.dimensions as { height?: number; outerRadius?: number; innerRadius?: number; radius?: number; tipWidth?: number } | undefined;
    const rawHeight = dims?.height ?? 0;
    if (rawHeight <= 0) return;
    const heightMm = rawHeight + heightOffset;
    const fallbackR = dims?.outerRadius ?? dims?.radius ?? 10;
    const geometry = part.geometry as PartShape | undefined;
    const radiusMm = isTip
      ? (dims?.tipWidth ?? dims?.outerRadius ?? 5)
      : (geometry ? computeEffectiveRadius(geometry, fallbackR) : fallbackR);

    layers.push({
      label,
      color: (part.color as string) ?? HEX.faint,
      heightMm,
      radiusMm,
      innerRadiusMm: isTip ? 0 : (dims?.innerRadius ?? 0),
      contactPoints: (part.contactPoints as SystemContactPoint[]) ?? [],
      isTip,
      tipOffsetX: 0,
      tipOffsetY: 0,
    });
  };

  if (containsCasing) {
    // Cup-inside-cup: casing renders first (inner), tip cup renders last (outermost)
    add("Core",     resolved.core as Loose, false, trackHeight);
    add("Casing",   resolved.casing as Loose, false, trackHeight);
    add("WD",       resolved.weightDisk as Loose, false, trackHeight);
    add("AR",       resolved.attackRing as Loose, false, trackHeight);
    add("BitBeast", resolved.bitBeast as Loose, false, trackHeight);
    // Tip cup drawn last with full height — no offset (it IS the outermost shell)
    add("Tip (cup)", tip, true);
  } else {
    // Standard stacking — tip at bottom, track lifts everything above it
    add("Tip",      tip, true);
    if (trackHeight > 0) {
      // SpinTrack column: drawn as a thin rectangular column
      const track = resolved.spinTrack as Loose;
      const trackDims = track?.dimensions as { outerRadius?: number } | undefined;
      layers.push({
        label: `Track (${trackHeight}mm)`,
        color: (track?.color as string) ?? "#64748b",
        heightMm: trackHeight,
        radiusMm: trackDims?.outerRadius ?? 4,
        innerRadiusMm: 2,
        contactPoints: [],
        isTip: false, tipOffsetX: 0, tipOffsetY: 0,
      });
    }
    add("Core",     resolved.core as Loose, false, trackHeight);
    add("Casing",   resolved.casing as Loose, false, trackHeight);
    add("WD",       resolved.weightDisk as Loose, false, trackHeight);
    add("AR",       resolved.attackRing as Loose, false, trackHeight);
    add("BitBeast", resolved.bitBeast as Loose, false, trackHeight);
  }

  for (const { part: subPart, attachment } of resolved.subParts ?? []) {
    const hLabel = attachment.placement === "above" ? "↑" : "↓";
    add(`Sub (${hLabel})`, subPart as Loose, false, trackHeight);
  }

  // Shield disk info for separate rendering
  const trackDoc = resolved.spinTrack as Loose | undefined;
  const sd = trackDoc?.shieldDisk as { enabled?: boolean; diskHeight?: number; diskRadius?: number } | undefined;
  const trackShieldDisk = sd?.enabled
    ? { diskHeight: (sd.diskHeight ?? 0), diskRadius: sd.diskRadius ?? 17, color: (trackDoc?.color as string) ?? "#64748b" }
    : undefined;

  return { layers, trackHeight, containsCasing, trackShieldDisk };
}

function drawView(
  ctx: CanvasRenderingContext2D,
  layers: LayerInfo[],
  maxH: number,
  trackShieldDisk?: { diskHeight: number; diskRadius: number; color: string },
  trackHeight = 0,
) {
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = HEX.bg0;
  ctx.fillRect(0, 0, W, H);

  const scaleY = DRAW_H / maxH;           // px per mm height
  const maxRadius = layers.reduce((m, l) => Math.max(m, l.radiusMm), 20);
  const scaleX = (DRAW_W / 2) / maxRadius; // px per mm radius

  const toY = (hmm: number) => PAD.top + DRAW_H - hmm * scaleY;
  const toX = (rmm: number) => PAD.left + DRAW_W / 2 + rmm * scaleX;
  const toXl = (rmm: number) => PAD.left + DRAW_W / 2 - rmm * scaleX;

  // ── Grid lines ────────────────────────────────────────────────────────────
  ctx.strokeStyle = HEX.border + "44";
  ctx.lineWidth = 0.5;
  // Horizontal every 10mm
  for (let h = 0; h <= maxH; h += 10) {
    const y = toY(h);
    ctx.beginPath(); ctx.moveTo(PAD.left, y); ctx.lineTo(W - PAD.right, y); ctx.stroke();
  }
  // Center line
  ctx.strokeStyle = HEX.faint;
  ctx.lineWidth = 0.5;
  const cx = PAD.left + DRAW_W / 2;
  ctx.beginPath(); ctx.moveTo(cx, PAD.top); ctx.lineTo(cx, PAD.top + DRAW_H); ctx.stroke();
  // Floor line
  ctx.beginPath(); ctx.moveTo(PAD.left, toY(0)); ctx.lineTo(W - PAD.right, toY(0)); ctx.stroke();

  // ── Axis labels ───────────────────────────────────────────────────────────
  ctx.fillStyle = HEX.faint;
  ctx.font = "9px sans-serif";
  ctx.textAlign = "right";
  for (let h = 0; h <= maxH; h += 10) {
    ctx.fillText(`${h}`, PAD.left - 4, toY(h) + 3);
  }
  ctx.textAlign = "center";
  ctx.fillText("h mm", PAD.left - 18, PAD.top + DRAW_H / 2);

  // ── Part layers ───────────────────────────────────────────────────────────
  // Sort by heightMm ascending so lower parts draw first
  const sorted = [...layers].sort((a, b) => a.heightMm - b.heightMm);

  for (const layer of sorted) {
    const yTop    = toY(layer.heightMm);
    const yFloor  = toY(0);
    const layerH  = yFloor - yTop;
    if (layerH <= 0) continue;

    const xRight  = toX(layer.radiusMm);
    const xLeft   = toXl(layer.radiusMm);
    const xInnerR = layer.innerRadiusMm > 0 ? toX(layer.innerRadiusMm) : cx;
    const xInnerL = layer.innerRadiusMm > 0 ? toXl(layer.innerRadiusMm) : cx;

    // Fill
    ctx.fillStyle = layer.color + "44";
    if (layer.innerRadiusMm > 0) {
      // Ring shape — draw two rectangles
      ctx.fillRect(xLeft, yTop, xInnerL - xLeft, layerH);
      ctx.fillRect(xInnerR, yTop, xRight - xInnerR, layerH);
    } else if (layer.isTip && (layer.tipOffsetX || layer.tipOffsetY)) {
      const offX = (layer.tipOffsetX ?? 0) * scaleX;
      ctx.fillRect(cx + offX - layer.radiusMm * scaleX, yTop, layer.radiusMm * 2 * scaleX, layerH);
    } else {
      ctx.fillRect(xLeft, yTop, xRight - xLeft, layerH);
    }

    // Outline
    ctx.strokeStyle = layer.color + "cc";
    ctx.lineWidth = 1;
    ctx.beginPath();
    if (layer.innerRadiusMm > 0) {
      ctx.rect(xLeft, yTop, xInnerL - xLeft, layerH);
      ctx.rect(xInnerR, yTop, xRight - xInnerR, layerH);
    } else {
      ctx.rect(xLeft, yTop, xRight - xLeft, layerH);
    }
    ctx.stroke();

    // Label
    ctx.fillStyle = HEX.muted;
    ctx.font = "9px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(layer.label, xRight + 3, yTop + 10);

    // ── Contact point bands ────────────────────────────────────────────────
    for (const cp of layer.contactPoints) {
      const bandColor = MATERIAL_COLORS[cp.material] ?? HEX.blue;
      const yMin = toY(cp.heightRange.max);
      const yMax = toY(cp.heightRange.min);
      const bandH = yMax - yMin;
      if (bandH <= 0) continue;

      // Band fill on outer edge (right side only, mirrored)
      ctx.fillStyle = bandColor + "55";
      ctx.fillRect(xRight - 6, yMin, 6, bandH);
      ctx.fillRect(xLeft, yMin, 6, bandH);

      ctx.strokeStyle = bandColor + "bb";
      ctx.lineWidth = 0.8;
      ctx.strokeRect(xRight - 6, yMin, 6, bandH);
      ctx.strokeRect(xLeft, yMin, 6, bandH);

      // Attack angle indicator inside band
      const angle = ATTACK_ANGLES[cp.attackType] ?? 0;
      const rad = (angle * Math.PI) / 180;
      const midY = (yMin + yMax) / 2;
      const len = Math.min(bandH * 0.8, 12);

      ctx.strokeStyle = bandColor;
      ctx.lineWidth = 1;
      const dash = ATTACK_DASH[cp.attackType];
      if (dash) ctx.setLineDash(dash);

      // Right side arrow
      const rxc = xRight - 3;
      ctx.beginPath();
      ctx.moveTo(rxc - len / 2 * Math.cos(rad), midY + len / 2 * Math.sin(rad));
      ctx.lineTo(rxc + len / 2 * Math.cos(rad), midY - len / 2 * Math.sin(rad));
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  // ── Shield disk horizontal bar ────────────────────────────────────────────
  if (trackShieldDisk) {
    const dY = toY(trackShieldDisk.diskHeight);
    const dX1 = toXl(trackShieldDisk.diskRadius);
    const dX2 = toX(trackShieldDisk.diskRadius);
    ctx.fillStyle = trackShieldDisk.color + "55";
    ctx.fillRect(dX1, dY - 3, dX2 - dX1, 6);
    ctx.strokeStyle = trackShieldDisk.color + "cc";
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    ctx.strokeRect(dX1, dY - 3, dX2 - dX1, 6);
    ctx.setLineDash([]);
    ctx.fillStyle = trackShieldDisk.color;
    ctx.font = "8px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`Shield @${trackShieldDisk.diskHeight}mm`, toX(trackShieldDisk.diskRadius) + 3, dY + 3);
  }

  // ── Track height annotation ───────────────────────────────────────────────
  if (trackHeight > 0) {
    const tY = toY(trackHeight);
    ctx.strokeStyle = "#f59e0b44";
    ctx.lineWidth = 0.8;
    ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(PAD.left, tY); ctx.lineTo(W - PAD.right, tY); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#f59e0b";
    ctx.font = "8px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(`+${trackHeight}mm track`, PAD.left + DRAW_W - 2, tY - 3);
  }

  // ── Floor label ───────────────────────────────────────────────────────────
  ctx.fillStyle = HEX.faint;
  ctx.font = "9px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("FLOOR", cx, toY(0) + 18);
}

export function SideProfileView({ resolved, width = W, height = H }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (!resolved) {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = HEX.bg0;
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = HEX.faint;
      ctx.font = "11px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("No system loaded", width / 2, height / 2);
      return;
    }

    const { layers, trackHeight, trackShieldDisk } = buildLayers(resolved);
    const maxH = layers.reduce((m, l) => Math.max(m, l.heightMm), 60);
    drawView(ctx, layers, maxH + 4, trackShieldDisk, trackHeight);
  }, [resolved, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ borderRadius: 8, border: `1px solid ${C.border}`, display: "block" }}
    />
  );
}

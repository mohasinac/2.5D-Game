/**
 * SideProfileView — cross-section canvas (height × radius).
 *
 * Y axis = height from floor (mm, 0 at bottom).
 * X axis = radius from center (mm, 0 at center line).
 * Each layer is drawn as a filled rectangle/polygon at its absolute height.
 * Contact points appear as colored horizontal bands on the outer edge.
 */

import { useRef, useEffect } from "react";
import { C } from "@/styles/theme";
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

function buildLayers(resolved: ResolvedBeybladeSystem): LayerInfo[] {
  const layers: LayerInfo[] = [];

  const add = (
    label: string,
    part: Loose | null | undefined,
    isTip = false,
    tipOffsetX = 0,
    tipOffsetY = 0,
  ) => {
    if (!part) return;
    const dims = part.dimensions as { height?: number; outerRadius?: number; innerRadius?: number; radius?: number; tipWidth?: number } | undefined;
    const heightMm = dims?.height ?? 0;
    if (heightMm <= 0) return;
    const fallbackR = dims?.outerRadius ?? dims?.radius ?? 10;
    const geometry = part.geometry as PartShape | undefined;
    const radiusMm = isTip
      ? (dims?.tipWidth ?? dims?.outerRadius ?? 5)
      : (geometry ? computeEffectiveRadius(geometry, fallbackR) : fallbackR);

    layers.push({
      label,
      color: (part.color as string) ?? C.faint,
      heightMm,
      radiusMm,
      innerRadiusMm: isTip ? 0 : (dims?.innerRadius ?? 0),
      contactPoints: (part.contactPoints as SystemContactPoint[]) ?? [],
      isTip,
      tipOffsetX,
      tipOffsetY,
    });
  };

  add("Tip",      resolved.tip as Loose,        true);
  add("Core",     resolved.core as Loose);
  add("Casing",   resolved.casing as Loose);
  add("WD",       resolved.weightDisk as Loose);
  add("AR",       resolved.attackRing as Loose);
  add("BitBeast", resolved.bitBeast as Loose);

  for (const { part: subPart, attachment } of resolved.subParts ?? []) {
    const hLabel = attachment.placement === "above" ? "↑" : "↓";
    add(`Sub (${hLabel})`, subPart as Loose);
  }

  return layers;
}

function drawView(
  ctx: CanvasRenderingContext2D,
  layers: LayerInfo[],
  maxH: number,
) {
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = C.bg0 ?? "#0f172a";
  ctx.fillRect(0, 0, W, H);

  const scaleY = DRAW_H / maxH;           // px per mm height
  const maxRadius = layers.reduce((m, l) => Math.max(m, l.radiusMm), 20);
  const scaleX = (DRAW_W / 2) / maxRadius; // px per mm radius

  const toY = (hmm: number) => PAD.top + DRAW_H - hmm * scaleY;
  const toX = (rmm: number) => PAD.left + DRAW_W / 2 + rmm * scaleX;
  const toXl = (rmm: number) => PAD.left + DRAW_W / 2 - rmm * scaleX;

  // ── Grid lines ────────────────────────────────────────────────────────────
  ctx.strokeStyle = (C.border ?? "#1e293b") + "44";
  ctx.lineWidth = 0.5;
  // Horizontal every 10mm
  for (let h = 0; h <= maxH; h += 10) {
    const y = toY(h);
    ctx.beginPath(); ctx.moveTo(PAD.left, y); ctx.lineTo(W - PAD.right, y); ctx.stroke();
  }
  // Center line
  ctx.strokeStyle = C.faint ?? "#475569";
  ctx.lineWidth = 0.5;
  const cx = PAD.left + DRAW_W / 2;
  ctx.beginPath(); ctx.moveTo(cx, PAD.top); ctx.lineTo(cx, PAD.top + DRAW_H); ctx.stroke();
  // Floor line
  ctx.beginPath(); ctx.moveTo(PAD.left, toY(0)); ctx.lineTo(W - PAD.right, toY(0)); ctx.stroke();

  // ── Axis labels ───────────────────────────────────────────────────────────
  ctx.fillStyle = C.faint ?? "#475569";
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
    ctx.fillStyle = C.muted ?? "#94a3b8";
    ctx.font = "9px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(layer.label, xRight + 3, yTop + 10);

    // ── Contact point bands ────────────────────────────────────────────────
    for (const cp of layer.contactPoints) {
      const bandColor = MATERIAL_COLORS[cp.material] ?? C.blue;
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

  // ── Floor label ───────────────────────────────────────────────────────────
  ctx.fillStyle = C.faint ?? "#475569";
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
      ctx.fillStyle = C.bg0 ?? "#0f172a";
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = C.faint ?? "#475569";
      ctx.font = "11px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("No system loaded", width / 2, height / 2);
      return;
    }

    const layers = buildLayers(resolved);
    const maxH = layers.reduce((m, l) => Math.max(m, l.heightMm), 60);
    drawView(ctx, layers, maxH + 4);
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

/**
 * TopDownView — 2D top-down canvas.
 *
 * Image Mode (default): sprite overlay of topView images, thin CP arc lines.
 * Material Mode: filled polygon/annuli derived from renderRadius(θ), CP filled sectors.
 * Movement path overlay shows expected tip movement pattern.
 */

import { useRef, useEffect, useState } from "react";
import { C } from "@/styles/theme";
import { renderRadius, synthesizeRadialCache } from "@/types/beybladeSystem";
import { computeEffectiveRadius } from "@/lib/beybladeSystemConverter";
import type { ResolvedBeybladeSystem } from "@/lib/beybladeSystemConverter";
import type { SystemContactPoint, FourierRadialProfile, PartShape } from "@/types/beybladeSystem";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Loose = Record<string, any>;

const SIZE = 280;
const CENTER = SIZE / 2;

const MATERIAL_COLORS: Record<string, string> = {
  abs:           "#3b82f6",
  rubber:        "#22c55e",
  metal:         "#94a3b8",
  pom:           "#eab308",
  polycarbonate: "#a855f7",
};

// Extra rings drawn in material mode for SpinTrack shield disk
function drawShieldDiskRing(
  ctx: CanvasRenderingContext2D,
  diskRadius: number,
  pxPerMm: number,
  color: string,
) {
  const r = diskRadius * pxPerMm;
  ctx.beginPath();
  ctx.arc(CENTER, CENTER, r, 0, Math.PI * 2);
  ctx.strokeStyle = color + "99";
  ctx.lineWidth = 2;
  ctx.setLineDash([4, 3]);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = color + "11";
  ctx.beginPath();
  ctx.arc(CENTER, CENTER, r, 0, Math.PI * 2);
  ctx.arc(CENTER, CENTER, Math.max(1, r - 3), 0, Math.PI * 2, true);
  ctx.fill();
}

// Movement path patterns based on tip shape
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

function drawMovementPath(ctx: CanvasRenderingContext2D, pattern: PathPattern) {
  ctx.save();
  ctx.globalAlpha = 0.35;

  switch (pattern) {
    case "flat": {
      // Large circular orbit near outer edge
      const r = CENTER * 0.70;
      ctx.beginPath();
      ctx.arc(CENTER, CENTER, r, 0, Math.PI * 2);
      ctx.strokeStyle = C.blue;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 5]);
      ctx.stroke();
      break;
    }
    case "rubber_flat": {
      // Tight central orbit
      const r = CENTER * 0.30;
      ctx.beginPath();
      ctx.arc(CENTER, CENTER, r, 0, Math.PI * 2);
      ctx.strokeStyle = "#22c55e";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      break;
    }
    case "sharp": {
      // Jagged charge lines radiating outward
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 1;
      ctx.setLineDash([]);
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        const len = CENTER * 0.5;
        ctx.beginPath();
        ctx.moveTo(CENTER, CENTER);
        ctx.lineTo(CENTER + Math.cos(a) * len, CENTER + Math.sin(a) * len);
        ctx.stroke();
      }
      break;
    }
    case "semi_flat": {
      // Medium arc with occasional radial spikes
      const r = CENTER * 0.50;
      ctx.beginPath();
      ctx.arc(CENTER, CENTER, r, 0, Math.PI * 2);
      ctx.strokeStyle = C.yellow;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.strokeStyle = C.yellow;
      ctx.lineWidth = 1;
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(CENTER + Math.cos(a) * r, CENTER + Math.sin(a) * r);
        ctx.lineTo(CENTER + Math.cos(a) * (r + CENTER * 0.18), CENTER + Math.sin(a) * (r + CENTER * 0.18));
        ctx.stroke();
      }
      break;
    }
    case "ball": {
      // Medium orbit with scattered dots
      const r = CENTER * 0.50;
      ctx.beginPath();
      ctx.arc(CENTER, CENTER, r, 0, Math.PI * 2);
      ctx.strokeStyle = C.muted;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 6]);
      ctx.stroke();
      // Random bounce dots
      ctx.setLineDash([]);
      ctx.fillStyle = C.muted;
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2 + 0.4;
        const dr = (((i * 37) % 5) - 2) * 6;
        const px = CENTER + Math.cos(a) * (r + dr);
        const py = CENTER + Math.sin(a) * (r + dr);
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    case "off_center": {
      // Expanding spiral
      ctx.strokeStyle = C.orange ?? "#f97316";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      for (let i = 0; i <= 120; i++) {
        const t = i / 120;
        const a = t * Math.PI * 4;
        const r = CENTER * 0.15 + t * CENTER * 0.55;
        const x = CENTER + Math.cos(a) * r;
        const y = CENTER + Math.sin(a) * r;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      break;
    }
  }

  ctx.setLineDash([]);
  ctx.globalAlpha = 1;
  ctx.restore();
}

function drawCPArc(
  ctx: CanvasRenderingContext2D,
  cp: SystemContactPoint,
  pxPerMm: number,
  filled: boolean,
) {
  const color = MATERIAL_COLORS[cp.material] ?? C.blue;
  const r = cp.radius * pxPerMm;
  const thickness = cp.thickness * pxPerMm;
  const halfAngleDeg = cp.width / 2;
  const startRad = ((cp.angle - halfAngleDeg - 90) * Math.PI) / 180;
  const endRad   = ((cp.angle + halfAngleDeg - 90) * Math.PI) / 180;

  if (filled) {
    // Filled annular sector
    ctx.beginPath();
    ctx.arc(CENTER, CENTER, r + thickness / 2, startRad, endRad);
    ctx.arc(CENTER, CENTER, Math.max(1, r - thickness / 2), endRad, startRad, true);
    ctx.closePath();
    ctx.fillStyle = color + "99";
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 0.8;
    ctx.stroke();

    // Extended envelope (dashed)
    if (cp.extends) {
      const er = cp.extendedRadius * pxPerMm;
      const et = cp.extendedThickness * pxPerMm;
      const eHalf = cp.extendedWidth / 2;
      const es = ((cp.angle - eHalf - 90) * Math.PI) / 180;
      const ee = ((cp.angle + eHalf - 90) * Math.PI) / 180;
      ctx.setLineDash([3, 2]);
      ctx.strokeStyle = color + "66";
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.arc(CENTER, CENTER, er + et / 2, es, ee);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  } else {
    // Thin arc line
    ctx.beginPath();
    ctx.arc(CENTER, CENTER, r, startRad, endRad);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
}

function drawMaterialMode(
  ctx: CanvasRenderingContext2D,
  resolved: ResolvedBeybladeSystem,
  pxPerMm: number,
) {
  const parts = [
    { part: resolved.weightDisk,  layer: "wd"  },
    { part: resolved.attackRing,  layer: "ar"  },
    { part: resolved.bitBeast,    layer: "bb"  },
    ...(resolved.subParts ?? []).map((a) => ({ part: a.part, layer: "sub" })),
  ];

  for (const { part } of parts) {
    if (!part) continue;
    const p = part as Loose;
    const dims = p.dimensions as { outerRadius?: number; innerRadius?: number } | undefined;
    const geometry = p.geometry as PartShape | undefined;
    const fallbackR = dims?.outerRadius ?? 20;
    const outerR = geometry ? computeEffectiveRadius(geometry, fallbackR) : fallbackR;
    const innerR = dims?.innerRadius ?? 0;
    const color = (p.color as string) ?? C.faint;
    const fourierProfile = p.geometry?.fourierProfile as FourierRadialProfile | undefined;
    const cps = (p.contactPoints as SystemContactPoint[]) ?? [];

    if (fourierProfile) {
      // Draw CP-warped radial polygon
      const cache = fourierProfile.radialCache ?? synthesizeRadialCache(fourierProfile);
      const polygon: Array<[number, number]> = [];
      for (let deg = 0; deg < 360; deg++) {
        const r = renderRadius(deg, cache, cps) * pxPerMm;
        const rad = ((deg - 90) * Math.PI) / 180;
        polygon.push([CENTER + Math.cos(rad) * r, CENTER + Math.sin(rad) * r]);
      }
      ctx.beginPath();
      ctx.moveTo(polygon[0][0], polygon[0][1]);
      for (let i = 1; i < polygon.length; i++) ctx.lineTo(polygon[i][0], polygon[i][1]);
      ctx.closePath();
      ctx.fillStyle = color + "44";
      ctx.fill();
      ctx.strokeStyle = color + "aa";
      ctx.lineWidth = 1;
      ctx.stroke();
    } else {
      // Annulus / disc fill
      ctx.beginPath();
      ctx.arc(CENTER, CENTER, outerR * pxPerMm, 0, Math.PI * 2);
      if (innerR > 0) {
        ctx.arc(CENTER, CENTER, innerR * pxPerMm, 0, Math.PI * 2, true);
      }
      ctx.fillStyle = color + "44";
      ctx.fill();
      ctx.strokeStyle = color + "aa";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // CPs as filled sectors
    for (const cp of cps) {
      drawCPArc(ctx, cp, pxPerMm, true);
    }
  }

  // Tip — contact patch or cup outer wall
  const tip = resolved.tip as Loose | undefined;
  if (tip) {
    const tipDims = tip.dimensions as { tipWidth?: number; outerRadius?: number; innerRadius?: number; tipOffsetX?: number; tipOffsetY?: number } | undefined;
    const containsCasing = !!(tip.containsCasing);
    const ox = (tipDims?.tipOffsetX ?? 0) * pxPerMm;
    const oy = (tipDims?.tipOffsetY ?? 0) * pxPerMm;

    if (containsCasing) {
      // Draw cup outer wall as large ring, casing as ghost inner ring
      const outerR = (tipDims?.outerRadius ?? 20) * pxPerMm;
      const innerR = (tipDims?.innerRadius ?? 15) * pxPerMm;
      ctx.beginPath();
      ctx.arc(CENTER + ox, CENTER + oy, outerR, 0, Math.PI * 2);
      ctx.arc(CENTER + ox, CENTER + oy, innerR, 0, Math.PI * 2, true);
      ctx.fillStyle = (tip.color as string ?? C.faint) + "44";
      ctx.fill();
      ctx.strokeStyle = tip.color as string ?? C.faint;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      // Ghost inner ring (casing position)
      ctx.beginPath();
      ctx.arc(CENTER + ox, CENTER + oy, innerR, 0, Math.PI * 2);
      ctx.strokeStyle = (tip.color as string ?? C.faint) + "44";
      ctx.lineWidth = 0.8;
      ctx.setLineDash([2, 3]);
      ctx.stroke();
      ctx.setLineDash([]);
    } else {
      const tw = (tipDims?.tipWidth ?? tipDims?.outerRadius ?? 3) * pxPerMm;
      ctx.beginPath();
      ctx.arc(CENTER + ox, CENTER + oy, tw, 0, Math.PI * 2);
      ctx.fillStyle = (tip.color as string ?? C.faint) + "88";
      ctx.fill();
      ctx.strokeStyle = tip.color as string ?? C.faint;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  // SpinTrack shield disk ring
  const spinTrack = (resolved as Loose).spinTrack as Loose | undefined;
  if (spinTrack?.shieldDisk?.enabled) {
    const sd = spinTrack.shieldDisk as { diskRadius?: number };
    drawShieldDiskRing(ctx, sd.diskRadius ?? 17, pxPerMm, (spinTrack.color as string) ?? "#64748b");
  }

  // Pocket balls
  const allParts = [resolved.attackRing, resolved.weightDisk, resolved.casing, resolved.tip, resolved.core, resolved.bitBeast];
  for (const part of allParts) {
    if (!part) continue;
    const pockets = ((part as Loose).pockets as Array<{ position: { x: number; y: number }; ballMaterial: string }>) ?? [];
    for (const pocket of pockets) {
      const px = CENTER + pocket.position.x * pxPerMm;
      const py = CENTER + pocket.position.y * pxPerMm;
      ctx.beginPath();
      ctx.arc(px, py, 3, 0, Math.PI * 2);
      ctx.fillStyle = pocket.ballMaterial === "metal" ? C.muted : C.yellow;
      ctx.fill();
    }
  }
}

function drawImageMode(
  ctx: CanvasRenderingContext2D,
  resolved: ResolvedBeybladeSystem,
  pxPerMm: number,
  images: Map<string, HTMLImageElement>,
) {
  // Draw images from bottom to top order
  const parts: Array<{ part: Loose | null | undefined; key: string }> = [
    { part: resolved.weightDisk as Loose, key: "wd" },
    { part: resolved.attackRing as Loose, key: "ar" },
    { part: resolved.bitBeast as Loose,   key: "bb" },
  ];

  for (const { part, key } of parts) {
    if (!part) continue;
    const img = images.get(key);
    const dims = part.dimensions as { outerRadius?: number } | undefined;
    const r = (dims?.outerRadius ?? 20) * pxPerMm;
    if (img) {
      ctx.drawImage(img, CENTER - r, CENTER - r, r * 2, r * 2);
    } else {
      // Fallback ring
      const color = part.color as string ?? C.faint;
      ctx.beginPath();
      ctx.arc(CENTER, CENTER, r, 0, Math.PI * 2);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Thin CP arc lines
    const cps = part.contactPoints as SystemContactPoint[] ?? [];
    for (const cp of cps) {
      drawCPArc(ctx, cp, pxPerMm, false);
    }
  }
}

function drawGrid(ctx: CanvasRenderingContext2D, maxRadius: number, pxPerMm: number) {
  ctx.strokeStyle = (C.border ?? "#1e293b") + "55";
  ctx.lineWidth = 0.5;
  ctx.setLineDash([2, 3]);
  for (let r = 5; r <= maxRadius + 5; r += 5) {
    ctx.beginPath();
    ctx.arc(CENTER, CENTER, r * pxPerMm, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.setLineDash([]);
  // Crosshair
  ctx.strokeStyle = C.faint ?? "#475569";
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(CENTER - 8, CENTER); ctx.lineTo(CENTER + 8, CENTER);
  ctx.moveTo(CENTER, CENTER - 8); ctx.lineTo(CENTER, CENTER + 8);
  ctx.stroke();
}

interface FullProps {
  resolved?: ResolvedBeybladeSystem | null;
  showMaterial?: boolean;
  showMovementPath?: boolean;
}

export function TopDownView({ resolved, showMaterial = false, showMovementPath = true }: FullProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [materialMode, setMaterialMode] = useState(showMaterial);
  const imagesRef = useRef<Map<string, HTMLImageElement>>(new Map());

  useEffect(() => { setMaterialMode(showMaterial); }, [showMaterial]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, SIZE, SIZE);
    ctx.fillStyle = C.bg0 ?? "#0f172a";
    ctx.fillRect(0, 0, SIZE, SIZE);

    if (!resolved) {
      ctx.fillStyle = C.faint ?? "#475569";
      ctx.font = "11px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("No system loaded", SIZE / 2, SIZE / 2);
      return;
    }

    // Determine pxPerMm from effective radius
    const ar = resolved.attackRing as Loose;
    const wd = resolved.weightDisk as Loose;
    const tip = resolved.tip as Loose | undefined;
    const arFallback = (ar?.dimensions?.outerRadius as number) ?? 30;
    const wdFallback = (wd?.dimensions?.outerRadius as number) ?? 30;
    const arR = ar?.geometry ? computeEffectiveRadius(ar.geometry as PartShape, arFallback) : arFallback;
    const wdR = wd?.geometry ? computeEffectiveRadius(wd.geometry as PartShape, wdFallback) : wdFallback;
    // Include tip outerRadius if it's wider than casing (extendsAboveCasing / containsCasing)
    const tipR = (tip?.containsCasing || tip?.extendsAboveCasing)
      ? ((tip?.dimensions?.outerRadius as number) ?? 0)
      : 0;
    const maxR = Math.max(arR, wdR, tipR, 20);
    const pxPerMm = (SIZE * 0.46) / maxR;

    drawGrid(ctx, maxR, pxPerMm);

    if (materialMode) {
      drawMaterialMode(ctx, resolved, pxPerMm);
    } else {
      drawImageMode(ctx, resolved, pxPerMm, imagesRef.current);
    }

    if (showMovementPath) {
      const pattern = getPathPattern(resolved);
      drawMovementPath(ctx, pattern);
    }
  }, [resolved, materialMode, showMovementPath]);

  const tip = resolved?.tip as Record<string, unknown> | undefined;
  const tipShape = tip?.tipShape as string | undefined ?? "?";

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 10, color: C.faint }}>Top-Down View</span>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {showMovementPath && resolved && (
            <span style={{ fontSize: 10, color: C.muted, background: C.bg2, padding: "2px 7px", borderRadius: 4, border: `1px solid ${C.border}` }}>
              {tipShape} pattern
            </span>
          )}
          <button
            onClick={() => setMaterialMode((m) => !m)}
            style={{
              padding: "3px 8px", fontSize: 10, borderRadius: 5, cursor: "pointer",
              background: materialMode ? C.blue + "22" : C.bg2,
              color: materialMode ? C.blue : C.muted,
              border: `1px solid ${materialMode ? C.blue + "55" : C.border}`,
            }}
          >
            {materialMode ? "Image" : "Material"}
          </button>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width={SIZE}
        height={SIZE}
        style={{ borderRadius: 8, border: `1px solid ${C.border}`, display: "block" }}
      />
    </div>
  );
}

/**
 * IsometricView — 3/4 isometric canvas showing all stacked layers.
 *
 * Y is squished by ISO_Y_SCALE (0.4). Each layer is drawn as an ellipse
 * (top face) + parallelogram (side face). Custom shapes use renderRadius(θ).
 * Rotation animation at preview RPM. Sub-part free-spin layers lag.
 */

import { useRef, useEffect, useCallback } from "react";
import { C, HEX } from "@/styles/theme";
import { renderRadius, synthesizeRadialCache } from "@/types/beybladeSystem";
import { computeEffectiveRadius } from "@/lib/beybladeSystemConverter";
import type { ResolvedBeybladeSystem } from "@/lib/beybladeSystemConverter";
import type { SystemContactPoint, FourierRadialProfile } from "@/types/beybladeSystem";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Loose = Record<string, any>;

const W = 260;
const H = 320;
const CX = W / 2;
const ISO_Y = 0.4;      // vertical compression
const PREVIEW_RPM = 90; // degrees per second for top face rotation

const MATERIAL_COLORS: Record<string, string> = {
  abs:           "#3b82f6",
  rubber:        "#22c55e",
  metal:         "#94a3b8",
  pom:           "#eab308",
  polycarbonate: "#a855f7",
};

interface LayerDef {
  label: string;
  color: string;
  heightMm: number;
  radiusMm: number;
  innerRadiusMm: number;
  fourierProfile?: FourierRadialProfile;
  contactPoints: SystemContactPoint[];
  freeSpin: boolean;
  tipOffsetX: number;
  tipOffsetY: number;
  isBottom: boolean;
}

function buildLayers(resolved: ResolvedBeybladeSystem): LayerDef[] {
  const layers: LayerDef[] = [];
  const tipDoc = resolved.tip as Loose | undefined;
  const containsCasing = !!(tipDoc?.containsCasing);
  const trackHeight = (resolved.spinTrack as Loose | undefined)?.height ?? 0;

  function add(
    label: string,
    part: Loose | null | undefined,
    opts: { freeSpin?: boolean; isTip?: boolean; heightOffset?: number } = {},
  ) {
    if (!part) return;
    const dims = part.dimensions as { height?: number; outerRadius?: number; innerRadius?: number; radius?: number; tipWidth?: number; tipOffsetX?: number; tipOffsetY?: number } | undefined;
    const rawHeight = dims?.height ?? 0;
    if (rawHeight <= 0) return;
    const heightMm = rawHeight + (opts.heightOffset ?? 0);
    const geometry = part.geometry as import("@/types/beybladeSystem").PartShape | undefined;
    const fallbackR = dims?.outerRadius ?? dims?.radius ?? 10;
    const radiusMm = opts.isTip
      ? (dims?.tipWidth ?? dims?.outerRadius ?? 4)
      : (geometry ? computeEffectiveRadius(geometry, fallbackR) : fallbackR);
    const fp = part.geometry?.fourierProfile as FourierRadialProfile | undefined;
    layers.push({
      label,
      color: (part.color as string) ?? HEX.faint,
      heightMm,
      radiusMm,
      innerRadiusMm: opts.isTip ? 0 : (dims?.innerRadius ?? 0),
      fourierProfile: fp,
      contactPoints: (part.contactPoints as SystemContactPoint[]) ?? [],
      freeSpin: opts.freeSpin ?? false,
      tipOffsetX: dims?.tipOffsetX ?? 0,
      tipOffsetY: dims?.tipOffsetY ?? 0,
      isBottom: opts.isTip ?? false,
    });
  }

  if (containsCasing) {
    // Cup-inside-cup: inner parts first, tip cup last (outermost)
    add("Core",     resolved.core as Loose,       { heightOffset: trackHeight });
    add("Casing",   resolved.casing as Loose,     { heightOffset: trackHeight });
    add("WD",       resolved.weightDisk as Loose, { heightOffset: trackHeight });
    add("AR",       resolved.attackRing as Loose, { heightOffset: trackHeight });
    add("BitBeast", resolved.bitBeast as Loose,   { heightOffset: trackHeight });
    add("Tip (cup)", tipDoc, { isTip: false }); // cup drawn at its own height as outermost layer
  } else {
    add("Tip",      resolved.tip as Loose,      { isTip: true });

    // SpinTrack column: thin cylinder between tip and casing
    if (trackHeight > 0) {
      const track = resolved.spinTrack as Loose;
      const trackDims = track?.dimensions as { outerRadius?: number } | undefined;
      layers.push({
        label: `Track`,
        color: (track?.color as string) ?? "#64748b",
        heightMm: trackHeight,
        radiusMm: trackDims?.outerRadius ?? 4,
        innerRadiusMm: 2,
        fourierProfile: undefined,
        contactPoints: [],
        freeSpin: false,
        tipOffsetX: 0, tipOffsetY: 0,
        isBottom: false,
      });
    }

    add("Core",     resolved.core as Loose,       { heightOffset: trackHeight });
    add("Casing",   resolved.casing as Loose,     { heightOffset: trackHeight });
    add("WD",       resolved.weightDisk as Loose, { heightOffset: trackHeight });
    add("AR",       resolved.attackRing as Loose, { heightOffset: trackHeight });
    add("BitBeast", resolved.bitBeast as Loose,   { heightOffset: trackHeight });
  }

  for (const { part: subPart } of resolved.subParts ?? []) {
    const loose = subPart as Loose;
    add("Sub", loose, { freeSpin: loose.mode === "free_spin", heightOffset: trackHeight });
  }

  return layers.sort((a, b) => a.heightMm - b.heightMm);
}

function isoPoint(x: number, y: number, heightPx: number): [number, number] {
  return [CX + x, H - 28 - heightPx - y * ISO_Y];
}

function drawEllipse(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number,
  rx: number, ry: number,
  fill: string, stroke: string,
) {
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 0.8;
  ctx.stroke();
}

function buildTopPolygon(
  radiusMm: number,
  fourierProfile: FourierRadialProfile | undefined,
  cps: SystemContactPoint[],
  pxPerMm: number,
  rotDeg: number,
): Array<[number, number]> {
  const pts: Array<[number, number]> = [];
  const cache = fourierProfile
    ? (fourierProfile.radialCache ?? synthesizeRadialCache(fourierProfile))
    : null;

  for (let deg = 0; deg < 360; deg += 4) {
    const r = cache
      ? renderRadius(deg, cache, cps) * pxPerMm
      : radiusMm * pxPerMm;
    const rad = ((deg + rotDeg - 90) * Math.PI) / 180;
    const x = Math.cos(rad) * r;
    const y = Math.sin(rad) * r * ISO_Y;
    pts.push([x, y]);
  }
  return pts;
}

function drawLayer(
  ctx: CanvasRenderingContext2D,
  layer: LayerDef,
  pxPerMm: number,
  scaleY: number,
  rotDeg: number,
  freespinRotDeg: number,
) {
  const yBase = layer.isBottom ? 4 : 0;
  const heightPx = (layer.heightMm - yBase) * scaleY;
  const rot = layer.freeSpin ? freespinRotDeg : rotDeg;

  const [bx, by] = [CX + layer.tipOffsetX * pxPerMm, H - 28 - (yBase * scaleY)];
  const rx = layer.radiusMm * pxPerMm;
  const ry = rx * ISO_Y;

  // ── Side face (parallelogram) ─────────────────────────────────────────────
  const grad = ctx.createLinearGradient(bx - rx, 0, bx + rx, 0);
  grad.addColorStop(0,   layer.color + "22");
  grad.addColorStop(0.5, layer.color + "55");
  grad.addColorStop(1,   layer.color + "22");

  // Approximate visible half of the ellipse as top/bottom arcs
  // (full rectangle approximation — good enough for this view)
  const topY = by - heightPx;
  ctx.beginPath();
  ctx.ellipse(bx, topY, rx, ry, 0, Math.PI, 0);  // top half
  ctx.lineTo(bx + rx, by);
  ctx.ellipse(bx, by, rx, ry, 0, 0, Math.PI);     // bottom half
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.strokeStyle = layer.color + "77";
  ctx.lineWidth = 0.7;
  ctx.stroke();

  // Drop shadow between layers
  ctx.beginPath();
  ctx.ellipse(bx, by, rx * 1.02, ry * 1.02, 0, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.fill();

  // ── Top face ──────────────────────────────────────────────────────────────
  const topCY = by - heightPx;

  if (layer.fourierProfile) {
    const pts = buildTopPolygon(layer.radiusMm, layer.fourierProfile, layer.contactPoints, pxPerMm, rot);
    ctx.beginPath();
    ctx.moveTo(bx + pts[0][0], topCY + pts[0][1]);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(bx + pts[i][0], topCY + pts[i][1]);
    ctx.closePath();
    ctx.fillStyle = layer.color + "bb";
    ctx.fill();
    ctx.strokeStyle = layer.color;
    ctx.lineWidth = 0.8;
    ctx.stroke();
  } else {
    drawEllipse(ctx, bx, topCY, rx, ry, layer.color + "bb", layer.color);
  }

  // Inner bore ring
  if (layer.innerRadiusMm > 0) {
    const ir = layer.innerRadiusMm * pxPerMm;
    drawEllipse(ctx, bx, topCY, ir, ir * ISO_Y, HEX.bg0, layer.color + "44");
  }

  // ── CP arcs on top face ───────────────────────────────────────────────────
  for (const cp of layer.contactPoints) {
    const cpColor = MATERIAL_COLORS[cp.material] ?? HEX.blue;
    const cpR = cp.radius * pxPerMm;
    const cpHalf = cp.width / 2;
    const startRad = ((cp.angle + rot - cpHalf - 90) * Math.PI) / 180;
    const endRad   = ((cp.angle + rot + cpHalf - 90) * Math.PI) / 180;
    ctx.beginPath();
    ctx.ellipse(bx, topCY, cpR, cpR * ISO_Y, 0, startRad, endRad);
    ctx.strokeStyle = cpColor;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  // Label on the side
  ctx.fillStyle = HEX.faint;
  ctx.font = "8px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(layer.label, bx + rx + 3, (by + topCY) / 2);
}

export function IsometricView({ resolved }: { resolved?: ResolvedBeybladeSystem | null }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const rotRef    = useRef(0);
  const freeRotRef = useRef(0);
  const lastTimeRef = useRef(0);

  const draw = useCallback((layers: LayerDef[], pxPerMm: number, scaleY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = HEX.bg0;
    ctx.fillRect(0, 0, W, H);

    for (const layer of layers) {
      drawLayer(ctx, layer, pxPerMm, scaleY, rotRef.current, freeRotRef.current);
    }

    // Spin direction indicator above top layer
    if (layers.length > 0 && resolved) {
      const spinDir = (resolved.system?.spinDirection as string) ?? "right";
      const topLayer = layers[layers.length - 1];
      const topY = H - 28 - topLayer.heightMm * scaleY - 18;
      ctx.font = "14px sans-serif";
      ctx.textAlign = "center";
      ctx.fillStyle = spinDir === "right" ? HEX.blue : HEX.red;
      ctx.fillText(spinDir === "right" ? "↻" : "↺", CX, topY);
    }
  }, [resolved]);

  useEffect(() => {
    if (!resolved) {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, W, H);
          ctx.fillStyle = HEX.bg0;
          ctx.fillRect(0, 0, W, H);
          ctx.fillStyle = HEX.faint;
          ctx.font = "11px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("No system loaded", W / 2, H / 2);
        }
      }
      return;
    }

    const layers = buildLayers(resolved);
    const maxH = layers.reduce((m, l) => Math.max(m, l.heightMm), 60);
    const maxR = layers.reduce((m, l) => Math.max(m, l.radiusMm), 20);
    const scaleY  = (H * 0.6) / maxH;
    const pxPerMm = (W * 0.40) / maxR;

    const animate = (ts: number) => {
      const dt = lastTimeRef.current ? (ts - lastTimeRef.current) / 1000 : 0;
      lastTimeRef.current = ts;
      rotRef.current     = (rotRef.current     + PREVIEW_RPM * dt) % 360;
      freeRotRef.current = (freeRotRef.current + PREVIEW_RPM * 0.35 * dt) % 360;
      draw(layers, pxPerMm, scaleY);
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [resolved, draw]);

  return (
    <div>
      <div style={{ fontSize: 10, color: C.faint, marginBottom: 6 }}>Isometric View</div>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        style={{ borderRadius: 8, border: `1px solid ${C.border}`, display: "block" }}
      />
    </div>
  );
}

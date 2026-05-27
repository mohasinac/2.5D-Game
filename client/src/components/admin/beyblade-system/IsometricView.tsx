/**
 * IsometricView — 3/4 isometric PixiJS canvas showing all stacked layers.
 * Ported from Canvas 2D → PixiJS 8 so all admin views use one renderer.
 *
 * Y is squished by ISO_Y (0.4). Each layer has:
 *   - Static container: side face, drop shadow, bore ring, label (rebuilt when resolved changes)
 *   - Dynamic PIXI.Graphics: top face + CP arcs (cleared + redrawn each ticker tick via rotation)
 * Sub-part free-spin layers lag at 35% of the main rotation speed.
 */

import { useRef, useEffect, useCallback } from "react";
import * as PIXI from "pixi.js";
import { HEX } from "@/styles/theme";
import { renderRadius, synthesizeRadialCache } from "@/types/beybladeSystem";
import { computeEffectiveRadius } from "@/lib/beybladeSystemConverter";
import type { ResolvedBeybladeSystem } from "@/lib/beybladeSystemConverter";
import type { SystemContactPoint, FourierRadialProfile } from "@/types/beybladeSystem";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Loose = Record<string, any>;

const W           = 260;
const H           = 320;
const CX          = W / 2;
const ISO_Y       = 0.4;
const PREVIEW_RPM = 90; // degrees / second

const MATERIAL_COLORS: Record<string, string> = {
  abs: "#3b82f6", rubber: "#22c55e", metal: "#94a3b8",
  pom: "#eab308", polycarbonate: "#a855f7",
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

// ── Layer geometry helpers ────────────────────────────────────────────────────
function buildLayers(resolved: ResolvedBeybladeSystem): LayerDef[] {
  const layers: LayerDef[] = [];
  const tipDoc         = resolved.tip as Loose | undefined;
  const containsCasing = !!(tipDoc?.containsCasing);
  const trackHeight    = (resolved.spinTrack as Loose | undefined)?.height ?? 0;

  function add(
    label: string,
    part: Loose | null | undefined,
    opts: { freeSpin?: boolean; isTip?: boolean; heightOffset?: number } = {},
  ) {
    if (!part) return;
    const dims = part.dimensions as {
      height?: number; outerRadius?: number; innerRadius?: number;
      radius?: number; tipWidth?: number; tipOffsetX?: number; tipOffsetY?: number;
    } | undefined;
    const rawHeight = dims?.height ?? 0;
    if (rawHeight <= 0) return;
    const heightMm  = rawHeight + (opts.heightOffset ?? 0);
    const geometry  = part.geometry as import("@/types/beybladeSystem").PartShape | undefined;
    const fallbackR = dims?.outerRadius ?? dims?.radius ?? 10;
    const radiusMm  = opts.isTip
      ? (dims?.tipWidth ?? dims?.outerRadius ?? 4)
      : (geometry ? computeEffectiveRadius(geometry, fallbackR) : fallbackR);
    const fp = part.geometry?.fourierProfile as FourierRadialProfile | undefined;
    layers.push({
      label,
      color: (part.color as string) ?? HEX.faint,
      heightMm, radiusMm,
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
    add("Core",      resolved.core as Loose,       { heightOffset: trackHeight });
    add("Casing",    resolved.casing as Loose,     { heightOffset: trackHeight });
    add("WD",        resolved.weightDisk as Loose, { heightOffset: trackHeight });
    add("AR",        resolved.attackRing as Loose, { heightOffset: trackHeight });
    add("BitBeast",  resolved.bitBeast as Loose,   { heightOffset: trackHeight });
    add("Tip (cup)", tipDoc, { isTip: false });
  } else {
    add("Tip", resolved.tip as Loose, { isTip: true });
    if (trackHeight > 0) {
      const track     = resolved.spinTrack as Loose;
      const trackDims = track?.dimensions as { outerRadius?: number } | undefined;
      layers.push({
        label: "Track", color: (track?.color as string) ?? "#64748b",
        heightMm: trackHeight, radiusMm: trackDims?.outerRadius ?? 4,
        innerRadiusMm: 2, fourierProfile: undefined, contactPoints: [],
        freeSpin: false, tipOffsetX: 0, tipOffsetY: 0, isBottom: false,
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

// ── Isometric polygon for top face ────────────────────────────────────────────
function buildTopFacePts(
  radiusMm: number,
  fourierProfile: FourierRadialProfile | undefined,
  cps: SystemContactPoint[],
  pxPerMm: number,
  rotDeg: number,
  bx: number,
  topCY: number,
): number[] {
  const cache = fourierProfile
    ? (fourierProfile.radialCache ?? synthesizeRadialCache(fourierProfile))
    : null;
  const flat: number[] = [];
  for (let deg = 0; deg < 360; deg += 4) {
    const r   = cache ? renderRadius(deg, cache, cps) * pxPerMm : radiusMm * pxPerMm;
    const rad = ((deg + rotDeg - 90) * Math.PI) / 180;
    flat.push(bx + Math.cos(rad) * r, topCY + Math.sin(rad) * r * ISO_Y);
  }
  return flat;
}

// Elliptical arc as flat [x,y,x,y,...] array
function ellipseArcPts(cx: number, cy: number, rx: number, ry: number, aStart: number, aEnd: number, steps = 20): number[] {
  const pts: number[] = [];
  for (let i = 0; i <= steps; i++) {
    const a = aStart + (i / steps) * (aEnd - aStart);
    pts.push(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry);
  }
  return pts;
}

// ── Static layer parts: side face, shadow, bore ring, label ──────────────────
function buildStaticLayer(
  parent: PIXI.Container,
  layer: LayerDef,
  pxPerMm: number,
  scaleY: number,
) {
  const yBase   = layer.isBottom ? 4 : 0;
  const heightPx = (layer.heightMm - yBase) * scaleY;
  const bx       = CX + layer.tipOffsetX * pxPerMm;
  const by       = H - 28 - yBase * scaleY;
  const rx       = layer.radiusMm * pxPerMm;
  const ry       = rx * ISO_Y;
  const topCY    = by - heightPx;

  // ── Side face (visible near cylinder wall) ────────────────────────────────
  // Compound path: near arc of top ellipse + right line + near arc of bottom ellipse + close
  const topArc = ellipseArcPts(bx, topCY, rx, ry, Math.PI, Math.PI * 2); // left → right through near
  const botArc = ellipseArcPts(bx, by,    rx, ry, 0,       Math.PI);      // right → left through near
  const sidePts: number[] = [...topArc, bx + rx, by, ...botArc, bx - rx, topCY];

  const sideFill = new PIXI.Graphics();
  sideFill.poly(sidePts).fill({ color: layer.color, alpha: 0.25 });
  const sideStroke = new PIXI.Graphics();
  sideStroke.poly(sidePts).stroke({ color: layer.color, width: 0.7, alpha: 0.47 });
  parent.addChild(sideFill);
  parent.addChild(sideStroke);

  // ── Drop shadow ───────────────────────────────────────────────────────────
  const shadow = new PIXI.Graphics();
  const shPts = ellipseArcPts(bx, by, rx * 1.02, ry * 1.02, 0, Math.PI * 2, 30);
  shadow.poly(shPts).fill({ color: 0x000000, alpha: 0.18 });
  parent.addChild(shadow);

  // ── Inner bore ring (static ellipse) ─────────────────────────────────────
  if (layer.innerRadiusMm > 0) {
    const ir   = layer.innerRadiusMm * pxPerMm;
    const irPts = ellipseArcPts(bx, topCY, ir, ir * ISO_Y, 0, Math.PI * 2, 30);
    const bore  = new PIXI.Graphics();
    bore.poly(irPts).fill({ color: HEX.bg0, alpha: 1 });
    bore.poly(irPts).stroke({ color: layer.color, width: 0.5, alpha: 0.44 });
    parent.addChild(bore);
  }

  // ── Label ─────────────────────────────────────────────────────────────────
  const lbl = new PIXI.Text({ text: layer.label, style: { fill: HEX.faint, fontSize: 8, fontFamily: "sans-serif" } });
  lbl.position.set(bx + rx + 3, (by + topCY) / 2 - 4);
  parent.addChild(lbl);
}

// ── Dynamic layer parts: top face + CP arcs (redrawn each tick) ──────────────
function redrawDynamicLayer(
  gfx: PIXI.Graphics,
  layer: LayerDef,
  pxPerMm: number,
  scaleY: number,
  rotDeg: number,
) {
  gfx.clear();
  const yBase   = layer.isBottom ? 4 : 0;
  const heightPx = (layer.heightMm - yBase) * scaleY;
  const bx       = CX + layer.tipOffsetX * pxPerMm;
  const by       = H - 28 - yBase * scaleY;
  const topCY    = by - heightPx;
  const rx       = layer.radiusMm * pxPerMm;
  const ry       = rx * ISO_Y;

  // Top face
  if (layer.fourierProfile) {
    const pts = buildTopFacePts(layer.radiusMm, layer.fourierProfile, layer.contactPoints, pxPerMm, rotDeg, bx, topCY);
    gfx.poly(pts).fill({ color: layer.color, alpha: 0.73 });
    gfx.poly(pts).stroke({ color: layer.color, width: 0.8 });
  } else {
    const ePts = ellipseArcPts(bx, topCY, rx, ry, 0, Math.PI * 2, 30);
    gfx.poly(ePts).fill({ color: layer.color, alpha: 0.73 });
    gfx.poly(ePts).stroke({ color: layer.color, width: 0.8 });
  }

  // CP arcs on top face (isometric: arc at cpR but Y compressed by ISO_Y)
  for (const cp of layer.contactPoints) {
    const cpColor = MATERIAL_COLORS[cp.material] ?? HEX.blue;
    const acp = cp as Loose;
    const startDeg = acp.arcStart !== undefined ? acp.arcStart : (cp.angle - (cp.width ?? 30) / 2);
    const endDeg   = acp.arcEnd   !== undefined ? acp.arcEnd   : (cp.angle + (cp.width ?? 30) / 2);
    const rInner   = acp.radiusInner ?? cp.radius ?? 10;
    const rOuter   = acp.radiusOuter !== undefined ? acp.radiusOuter : rInner + (acp.lineThickness ?? cp.thickness ?? 2);
    const cpR      = ((rInner + rOuter) / 2) * pxPerMm;
    const startRad = ((startDeg + rotDeg - 90) * Math.PI) / 180;
    const endRad   = ((endDeg   + rotDeg - 90) * Math.PI) / 180;
    // Isometric elliptical arc: circular in X, compressed by ISO_Y in Y
    const arcPts = ellipseArcPts(bx, topCY, cpR, cpR * ISO_Y, startRad, endRad, 16);
    for (let i = 2; i < arcPts.length; i += 2)
      gfx.moveTo(arcPts[i - 2], arcPts[i - 1]).lineTo(arcPts[i], arcPts[i + 1]);
    gfx.stroke({ color: cpColor, width: 1.5 });
  }
}

// ── Component ─────────────────────────────────────────────────────────────────
export function IsometricView({ resolved }: { resolved?: ResolvedBeybladeSystem | null }) {
  const containerRef   = useRef<HTMLDivElement>(null);
  const appRef         = useRef<PIXI.Application | null>(null);
  const appInitRef     = useRef(false);
  const resolvedRef    = useRef(resolved);
  const rotRef         = useRef(0);
  const freeRotRef     = useRef(0);
  // Per-layer dynamic PIXI.Graphics objects — allocated in the static rebuild
  const dynGfxRef      = useRef<PIXI.Graphics[]>([]);
  // Per-layer data needed each frame
  const layerDataRef   = useRef<{ layer: LayerDef; pxPerMm: number; scaleY: number }[]>([]);

  resolvedRef.current = resolved;

  // Stable static rebuild: called once on app init and whenever resolved changes
  const rebuildStatic = useCallback(() => {
    const app = appRef.current;
    if (!app || !appInitRef.current) return;

    app.stage.removeChildren();
    dynGfxRef.current    = [];
    layerDataRef.current = [];

    // Background
    const bg = new PIXI.Graphics();
    bg.rect(0, 0, W, H).fill({ color: HEX.bg0 });
    app.stage.addChild(bg);

    const res = resolvedRef.current;
    if (!res) {
      const msg = new PIXI.Text({ text: "No system loaded", style: { fill: HEX.faint, fontSize: 11, fontFamily: "sans-serif" } });
      msg.anchor.set(0.5, 0.5);
      msg.position.set(W / 2, H / 2);
      app.stage.addChild(msg);
      return;
    }

    const layers  = buildLayers(res);
    const maxH    = layers.reduce((m, l) => Math.max(m, l.heightMm), 60);
    const maxR    = layers.reduce((m, l) => Math.max(m, l.radiusMm), 20);
    const scaleY  = (H * 0.6) / maxH;
    const pxPerMm = (W * 0.40) / maxR;

    // Static container holds side faces, shadows, bore rings, labels
    const staticC = new PIXI.Container();
    app.stage.addChild(staticC);

    for (const layer of layers) {
      buildStaticLayer(staticC, layer, pxPerMm, scaleY);
    }

    // Dynamic Graphics — one per layer, added on top of static, reused every tick
    const dynC = new PIXI.Container();
    app.stage.addChild(dynC);

    for (const layer of layers) {
      const gfx = new PIXI.Graphics();
      dynC.addChild(gfx);
      dynGfxRef.current.push(gfx);
      layerDataRef.current.push({ layer, pxPerMm, scaleY });
      // Draw initial frame immediately so canvas isn't blank
      const rot = layer.freeSpin ? freeRotRef.current : rotRef.current;
      redrawDynamicLayer(gfx, layer, pxPerMm, scaleY, rot);
    }

    // Spin direction indicator
    if (layers.length > 0) {
      const spinDir = (res.system?.spinDirection as string) ?? "right";
      const topLayer = layers[layers.length - 1];
      const topY = H - 28 - topLayer.heightMm * scaleY - 18;
      const arrow = new PIXI.Text({
        text:  spinDir === "right" ? "↻" : "↺",
        style: { fill: spinDir === "right" ? HEX.blue : HEX.red, fontSize: 14 },
      });
      arrow.anchor.set(0.5, 0.5);
      arrow.position.set(CX, topY);
      app.stage.addChild(arrow);
    }
  }, []);

  // Init PIXI.Application once — ticker drives the rotation animation
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

      rebuildStatic();

      // Ticker: advance rotation refs and redraw only the dynamic top faces
      app.ticker.add((ticker) => {
        const dt = ticker.deltaMS / 1000;
        rotRef.current     = (rotRef.current     + PREVIEW_RPM * dt) % 360;
        freeRotRef.current = (freeRotRef.current + PREVIEW_RPM * 0.35 * dt) % 360;

        const entries = layerDataRef.current;
        const gfxList = dynGfxRef.current;
        for (let i = 0; i < entries.length; i++) {
          const { layer, pxPerMm, scaleY } = entries[i];
          const rot = layer.freeSpin ? freeRotRef.current : rotRef.current;
          redrawDynamicLayer(gfxList[i], layer, pxPerMm, scaleY, rot);
        }
      });
    })();

    return () => {
      cancelled = true;
      appInitRef.current = false;
      dynGfxRef.current    = [];
      layerDataRef.current = [];
      try {
        if (app.canvas?.parentNode) app.canvas.parentNode.removeChild(app.canvas);
        app.destroy(true, { children: true });
      } catch { /* init may still be in flight */ }
      appRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Rebuild static parts when resolved changes
  useEffect(() => {
    if (appRef.current && appInitRef.current) rebuildStatic();
  }, [resolved, rebuildStatic]);

  return (
    <div>
      <div className="text-[10px] text-theme-faint mb-[6px]">Isometric View</div>
      <div
        ref={containerRef}
        className="block rounded-lg border border-border-c overflow-hidden"
        style={{ width: W, height: H }}
      />
    </div>
  );
}

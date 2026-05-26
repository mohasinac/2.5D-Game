/**
 * PartShapeEditor — shape section inside the part editor.
 *
 * Detects which views are uploaded and shows the matching workflow tier:
 *   Top only            → Workflow A: Uniform Extrusion
 *   Top + Side          → Workflow B: Revolution Profile (lathe/vase)
 *   Top + Side + Bottom → Workflow C: Full Geometry (tips, bowls)
 *   Side only           → Profile spline without plan shape
 *   No images           → Preset shape picker
 *
 * Any part type can use any workflow — the tiers are not enforced per type.
 */

import React, { useState } from "react";
import { SearchableSelect } from "@/components/admin/SearchableSelect";
import type { PartShape, FourierRadialProfile, BezierPath, BezierSplineProfile, PartImages } from "@/types/beybladeSystem";
import { synthesizeRadialCache } from "@/types/beybladeSystem";
import { BezierEditor } from "./BezierEditor";
import { FourierEditor } from "./FourierEditor";
import { SplineProfileEditor } from "./SplineProfileEditor";
import { traceSilhouette } from "./SilhouetteTracer";

type ShapeTab = "preset" | "bezier" | "fourier" | "side" | "bottom";

const PRESET_SHAPES = ["circle", "ring", "star3", "star4", "star6", "triangle", "square", "hexagon"] as const;
type PresetShape = typeof PRESET_SHAPES[number];

const PRESET_ICONS: Record<string, string> = {
  circle: "⬤",
  ring: "◎",
  star3: "🔺",
  star4: "✦",
  star6: "⭐",
  triangle: "△",
  square: "■",
  hexagon: "⬡",
};

// ── Parametric shape generator ────────────────────────────────────────────────

function generatePresetPath(
  preset: PresetShape,
  diamMm: number,
  rotDeg: number,
  starRatio: number,
): BezierPath {
  const R = diamMm / 2;
  const rot = (rotDeg * Math.PI) / 180;
  const pts: Array<{ x: number; y: number }> = [];

  if (preset === "circle" || preset === "ring") {
    const N = 64;
    for (let i = 0; i < N; i++) {
      const a = (2 * Math.PI * i) / N + rot;
      pts.push({ x: R * Math.cos(a), y: R * Math.sin(a) });
    }
  } else if (preset === "star3" || preset === "star4" || preset === "star6") {
    const n = preset === "star3" ? 3 : preset === "star4" ? 4 : 6;
    const inner = R * starRatio;
    for (let i = 0; i < n * 2; i++) {
      const a = (Math.PI * i) / n + rot - Math.PI / 2;
      const r = i % 2 === 0 ? R : inner;
      pts.push({ x: r * Math.cos(a), y: r * Math.sin(a) });
    }
  } else if (preset === "triangle") {
    for (let i = 0; i < 3; i++) {
      const a = (2 * Math.PI * i) / 3 + rot - Math.PI / 2;
      pts.push({ x: R * Math.cos(a), y: R * Math.sin(a) });
    }
  } else if (preset === "square") {
    for (let i = 0; i < 4; i++) {
      const a = (Math.PI * i) / 2 + rot + Math.PI / 4;
      pts.push({ x: R * Math.cos(a), y: R * Math.sin(a) });
    }
  } else if (preset === "hexagon") {
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI * i) / 3 + rot;
      pts.push({ x: R * Math.cos(a), y: R * Math.sin(a) });
    }
  }

  return {
    segments: pts.map((p) => ({ type: "L" as const, x: p.x, y: p.y })),
    polygonCache: pts,
    polygonTolerance: 1.0,
  };
}

function workflowTier(images: PartImages): "full" | "lathe" | "extrude" | "profile" | "preset" {
  const hasTop    = !!images.topView;
  const hasSide   = !!images.sideView;
  const hasBottom = !!images.bottomView;
  if (hasTop && hasSide && hasBottom) return "full";
  if (hasTop && hasSide) return "lathe";
  if (hasTop) return "extrude";
  if (hasSide) return "profile";
  return "preset";
}

interface Props {
  value: PartShape;
  onChange: (shape: PartShape) => void;
  images: PartImages;
}

export function PartShapeEditor({ value, onChange, images }: Props) {
  const [tab, setTab] = useState<ShapeTab>("preset");
  const [tracing, setTracing] = useState(false);

  // ── Image scale (physical mm the image represents) ───────────────────────
  const [topDiamMm,    setTopDiamMm]    = useState(38);
  const [bottomDiamMm, setBottomDiamMm] = useState(38);
  const [sideMaxH,     setSideMaxH]     = useState(60);
  const [sideMaxR,     setSideMaxR]     = useState(40);

  // ── Trace settings ────────────────────────────────────────────────────────
  const [rdpTolerance,    setRdpTolerance]    = useState(2.0);
  const [alphaThreshold,  setAlphaThreshold]  = useState(32);
  const [traceMaxDim,     setTraceMaxDim]     = useState(256);
  const [sideKnots,       setSideKnots]       = useState(10);
  const [traceSettingsOpen, setTraceSettingsOpen] = useState(false);

  // ── Preset shape parameters ───────────────────────────────────────────────
  const [presetDiamMm,  setPresetDiamMm]  = useState(38);
  const [presetRotDeg,  setPresetRotDeg]  = useState(0);
  const [presetStarRatio, setPresetStarRatio] = useState(0.4);

  const tier = workflowTier(images);
  const update = (patch: Partial<PartShape>) => onChange({ ...value, ...patch });

  // ── Preset selection — bakes parametric shape into bezierPath ────────────
  const applyPreset = (p: PresetShape, diam = presetDiamMm, rot = presetRotDeg, star = presetStarRatio) => {
    const bp = generatePresetPath(p, diam, rot, star);
    update({ type: "preset", preset: p, bezierPath: bp });
  };

  const handlePresetDiam = (v: number) => {
    setPresetDiamMm(v);
    if (value.preset) applyPreset(value.preset as PresetShape, v, presetRotDeg, presetStarRatio);
  };
  const handlePresetRot = (v: number) => {
    setPresetRotDeg(v);
    if (value.preset) applyPreset(value.preset as PresetShape, presetDiamMm, v, presetStarRatio);
  };
  const handlePresetStarRatio = (v: number) => {
    setPresetStarRatio(v);
    if (value.preset) applyPreset(value.preset as PresetShape, presetDiamMm, presetRotDeg, v);
  };

  // ── Silhouette tracing ────────────────────────────────────────────────────
  const handleTrace = async () => {
    if (!images.topView) return;
    setTracing(true);
    try {
      const mmPerPx = topDiamMm / (traceMaxDim * 0.85); // ~85% of canvas = the part
      const result = await traceSilhouette(images.topView, rdpTolerance, mmPerPx, alphaThreshold, traceMaxDim);
      update({ type: "custom", bezierPath: result.bezierPath });
      setTab("bezier");
    } catch (e) {
      console.error("Trace failed:", e);
    } finally {
      setTracing(false);
    }
  };

  const handleSyncFourier = (polygonCache: Array<{ x: number; y: number }>) => {
    const N = polygonCache.length;
    if (N < 4) return;
    const radii: number[] = polygonCache.map((p) => Math.sqrt(p.x * p.x + p.y * p.y));
    const a0 = radii.reduce((s, r) => s + r, 0) / N;
    const harmonics = [];
    for (let n = 1; n <= 8; n++) {
      let an = 0, bn = 0;
      for (let k = 0; k < N; k++) {
        const theta = (2 * Math.PI * n * k) / N;
        an += radii[k] * Math.cos(theta);
        bn += radii[k] * Math.sin(theta);
      }
      harmonics.push({ n, a: parseFloat(((an / N) * 2).toFixed(4)), b: parseFloat(((bn / N) * 2).toFixed(4)) });
    }
    const fp: FourierRadialProfile = { a0, harmonics };
    update({ fourierProfile: { ...fp, radialCache: synthesizeRadialCache(fp) } });
  };

  // ── Tab availability ──────────────────────────────────────────────────────
  const availableTabs: ShapeTab[] = ["preset"];
  if (images.topView || value.bezierPath) availableTabs.push("bezier", "fourier");
  if (images.sideView || value.sideProfileSpline) availableTabs.push("side");
  if (images.bottomView || value.bottomBezierPath) availableTabs.push("bottom");

  const TAB_LABELS: Record<ShapeTab, string> = {
    preset:  "Preset",
    bezier:  "Bezier",
    fourier: "Fourier",
    side:    "Side Profile",
    bottom:  "Bottom",
  };

  // ── Workflow badge ────────────────────────────────────────────────────────
  const TIER_META: Record<ReturnType<typeof workflowTier>, { label: string; color: string; desc: string }> = {
    full:    { label: "Full Geometry",        color: "var(--green)",  desc: "Top + Side + Bottom — complete 3-view geometry" },
    lathe:   { label: "Revolution Profile",   color: "var(--blue)",   desc: "Top footprint + side-profile spline" },
    extrude: { label: "Uniform Extrusion",    color: "var(--yellow)", desc: "Top silhouette extruded to height" },
    profile: { label: "Profile Only",         color: "var(--orange)", desc: "Side-profile spline with circular plan" },
    preset:  { label: "Preset",               color: "var(--faint)",  desc: "No images — uses preset geometry" },
  };
  const tierMeta = TIER_META[tier];
  const hasAnyImage = !!(images.topView || images.sideView || images.bottomView);

  const isStarPreset = value.type === "preset" && (value.preset === "star3" || value.preset === "star4" || value.preset === "star6");

  // ── Helpers ───────────────────────────────────────────────────────────────
  const numInput = (
    label: string,
    val: number,
    set: (n: number) => void,
    unit = "mm",
    min = 1,
    max = 300,
    step = 0.5,
  ) => (
    <label className="flex items-center gap-[5px] text-[11px] text-muted">
      {label}
      <input
        type="number"
        min={min} max={max} step={step}
        value={val}
        onChange={(e) => set(Math.max(min, Math.min(max, +e.target.value)))}
        className="w-[52px] px-[5px] py-0.5 bg-bg2 border border-border rounded text-text text-[11px]"
      />
      {unit && <span>{unit}</span>}
    </label>
  );

  const sliderRow = (
    label: string,
    val: number,
    set: (n: number) => void,
    min: number,
    max: number,
    step: number,
    fmt?: (v: number) => string,
  ) => (
    <div className="flex flex-col gap-0.5">
      <div className="flex justify-between text-[11px] text-muted">
        <span>{label}</span>
        <span className="font-mono text-text">{fmt ? fmt(val) : val}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={val}
        onChange={(e) => set(+e.target.value)}
        className="w-full accent-blue"
      />
    </div>
  );

  return (
    <div className="flex flex-col gap-3.5">

      {/* Workflow tier badge */}
      <div className="flex items-center gap-2">
        <span className="text-[12px] text-muted">Shape workflow:</span>
        <span
          style={{ "--tc": tierMeta.color, background: `color-mix(in srgb, ${tierMeta.color} 9%, transparent)`, color: tierMeta.color, border: `1px solid color-mix(in srgb, ${tierMeta.color} 27%, transparent)` } as React.CSSProperties}
          className="text-[11px] px-[9px] py-0.5 rounded-full font-semibold"
        >
          {tierMeta.label}
        </span>
        <span className="text-[11px] text-faint">{tierMeta.desc}</span>
      </div>

      {/* Image scale + trace settings — only when at least one image is uploaded */}
      {hasAnyImage && (
        <div className="flex flex-col gap-2.5 p-3 bg-bg2 rounded-[8px] border border-border">
          {/* Scale inputs row */}
          <div className="flex flex-wrap gap-3.5 items-center">
            <span className="text-[11px] text-faint font-semibold">Image scale</span>
            {images.topView    && numInput("Top diam:",    topDiamMm,    setTopDiamMm)}
            {images.bottomView && numInput("Bottom diam:", bottomDiamMm, setBottomDiamMm)}
            {images.sideView   && numInput("Side height:", sideMaxH,     setSideMaxH)}
            {images.sideView   && numInput("Side radius:", sideMaxR,     setSideMaxR)}
            <span className="text-[10px] text-faint">Physical mm the image represents</span>
          </div>

          {/* Trace settings — collapsible */}
          <div>
            <button
              onClick={() => setTraceSettingsOpen((o) => !o)}
              className="bg-transparent border-none cursor-pointer text-[11px] text-muted flex items-center gap-[5px] p-0"
            >
              <span className="text-[10px]">{traceSettingsOpen ? "▾" : "▸"}</span>
              Trace settings
            </button>

            {traceSettingsOpen && (
              <div className="mt-2.5 pt-2.5 border-t border-border grid grid-cols-2 gap-x-5 gap-y-2.5">
                {/* RDP tolerance */}
                <div>
                  {sliderRow(
                    "RDP tolerance (px)", rdpTolerance, setRdpTolerance,
                    0.5, 12, 0.5,
                    (v) => `${v}px`,
                  )}
                  <div className="text-[10px] text-faint mt-0.5">
                    Higher = fewer polygon points, smoother shape
                  </div>
                </div>

                {/* Alpha threshold */}
                <div>
                  {sliderRow(
                    "Alpha threshold", alphaThreshold, setAlphaThreshold,
                    1, 200, 1,
                    (v) => `${v}/255`,
                  )}
                  <div className="text-[10px] text-faint mt-0.5">
                    Pixels below this alpha are treated as background
                  </div>
                </div>

                {/* Trace resolution */}
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] text-muted">Trace resolution</span>
                  <SearchableSelect
                    value={String(traceMaxDim)}
                    options={[
                      { value: "64", label: "64 px — fast, blocky" },
                      { value: "128", label: "128 px" },
                      { value: "256", label: "256 px — default" },
                      { value: "512", label: "512 px — high detail" },
                    ]}
                    onChange={(v) => setTraceMaxDim(+v)}
                  />
                </div>

                {/* Side knots */}
                {images.sideView && (
                  <div className="flex flex-col gap-1">
                    {numInput("Side trace knots:", sideKnots, setSideKnots, "", 3, 30, 1)}
                    <div className="text-[10px] text-faint">
                      Knot count extracted when tracing the side profile image
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab strip */}
      <div className="flex gap-1 border-b border-border pb-1">
        {availableTabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-[5px] text-[12px] rounded-t-[6px] cursor-pointer border ${
              tab === t
                ? "bg-bg1 text-text border-border -mb-px border-b-bg1"
                : "bg-transparent text-muted border-transparent"
            }`}
          >
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      {/* ── Tab: Preset ──────────────────────────────────────────────────────── */}
      {tab === "preset" && (
        <div className="flex flex-col gap-3.5">

          {/* Shape picker grid */}
          <div>
            <div className="text-[12px] text-muted mb-2">Preset shape</div>
            <div className="flex flex-wrap gap-2">
              {PRESET_SHAPES.map((p) => {
                const active = value.preset === p && value.type === "preset";
                return (
                  <button
                    key={p}
                    onClick={() => applyPreset(p)}
                    className={`px-3 py-2 rounded-[8px] text-[13px] cursor-pointer flex items-center gap-1.5 border ${
                      active
                        ? "bg-blue/10 text-blue border-blue/50"
                        : "bg-bg2 text-muted border-border"
                    }`}
                  >
                    <span className="text-[16px]">{PRESET_ICONS[p]}</span>
                    <span className="capitalize">{p}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preset parameters */}
          <div className="flex flex-col gap-2.5 p-3 bg-bg2 rounded-[8px] border border-border">
            <span className="text-[11px] text-faint font-semibold">Shape parameters</span>

            <div className="grid grid-cols-2 gap-x-5 gap-y-2.5">
              {/* Diameter */}
              <div>
                {sliderRow(
                  "Outer diameter", presetDiamMm, handlePresetDiam,
                  4, 120, 0.5,
                  (v) => `${v} mm`,
                )}
              </div>

              {/* Rotation */}
              <div>
                {sliderRow(
                  "Rotation offset", presetRotDeg, handlePresetRot,
                  0, 359, 1,
                  (v) => `${v}°`,
                )}
              </div>

              {/* Star ratio — only for star presets */}
              {isStarPreset && (
                <div className="col-span-2">
                  {sliderRow(
                    "Point depth (inner / outer ratio)", presetStarRatio, handlePresetStarRatio,
                    0.1, 0.9, 0.01,
                    (v) => `${(v * 100).toFixed(0)}%`,
                  )}
                  <div className="text-[10px] text-faint mt-0.5">
                    Lower = sharper / more aggressive points
                  </div>
                </div>
              )}
            </div>

            <div className="text-[10px] text-faint">
              Changes are baked into the Bezier path — switch to the Bezier tab to refine further.
            </div>
          </div>

          {/* Silhouette trace from top image */}
          {images.topView && (
            <div>
              <div className="text-[11px] text-muted mb-2">
                Or trace the shape from the uploaded top-view image:
              </div>
              <button
                onClick={handleTrace}
                disabled={tracing}
                className={`px-4 py-2 text-white border-none rounded-[8px] text-[13px] font-semibold ${tracing ? "bg-bg3 cursor-default" : "bg-blue cursor-pointer"}`}
              >
                {tracing ? "Tracing silhouette…" : "Trace Silhouette from Top Image →"}
              </button>
              <div className="text-[11px] text-faint mt-1.5">
                Extracts a Bezier polygon from the no-background PNG. Adjust trace settings above, then switch to the Bezier tab to refine.
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Tab: Bezier ──────────────────────────────────────────────────────── */}
      {tab === "bezier" && (
        <div>
          {value.bezierPath ? (
            <BezierEditor
              value={value.bezierPath}
              onChange={(bp) => update({ bezierPath: bp })}
              onSyncFourier={handleSyncFourier}
              imageUrl={images.topView}
            />
          ) : (
            <div className="text-[12px] text-faint">
              No Bezier path yet. Pick a preset on the Preset tab, or trace from a top-view image.
              {images.topView && (
                <button
                  onClick={handleTrace}
                  disabled={tracing}
                  className="ml-2.5 px-3 py-[5px] bg-blue text-white border-none rounded-[6px] text-[12px] cursor-pointer"
                >
                  {tracing ? "Tracing…" : "Trace Now"}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Tab: Fourier ─────────────────────────────────────────────────────── */}
      {tab === "fourier" && (
        <FourierEditor
          value={value.fourierProfile}
          onChange={(fp) => update({ fourierProfile: fp })}
          imageUrl={images.topView}
          mmPerPx={topDiamMm / (traceMaxDim * 0.85)}
        />
      )}

      {/* ── Tab: Side Profile ────────────────────────────────────────────────── */}
      {tab === "side" && (
        <div>
          <SplineProfileEditor
            value={value.sideProfileSpline ?? { knots: [{ height: 0, radius: 20 }, { height: 30, radius: 20 }] }}
            onChange={(sp) => update({ sideProfileSpline: sp })}
            imageUrl={images.sideView}
            maxHeight={sideMaxH}
            maxRadius={sideMaxR}
            traceKnots={sideKnots}
          />

          <div className="mt-3.5 flex items-center gap-2.5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={value.bottomMimic !== false}
                onChange={(e) => update({ bottomMimic: e.target.checked })}
                className="accent-blue w-3.5 h-3.5"
              />
              <span className="text-[12px] text-muted">Mimic top on bottom</span>
            </label>
            <span className="text-[11px] text-faint">
              {value.bottomMimic !== false
                ? "Bottom face = same polygon as top (default for AR/WD)"
                : "Bottom face = circle at lowest spline knot radius (default for Casing/Core)"}
            </span>
          </div>
        </div>
      )}

      {/* ── Tab: Bottom ──────────────────────────────────────────────────────── */}
      {tab === "bottom" && (
        <div>
          {value.bottomBezierPath ? (
            <BezierEditor
              value={value.bottomBezierPath}
              onChange={(bp) => update({ bottomBezierPath: bp })}
              imageUrl={images.bottomView}
            />
          ) : (
            <div className="flex flex-col gap-2.5">
              <div className="text-[12px] text-faint">
                No bottom Bezier path. Upload a bottom-view PNG to trace the contact surface.
              </div>
              {images.bottomView && (
                <button
                  onClick={async () => {
                    setTracing(true);
                    try {
                      const mmPerPx = bottomDiamMm / (traceMaxDim * 0.85);
                      const result = await traceSilhouette(images.bottomView!, rdpTolerance, mmPerPx, alphaThreshold, traceMaxDim);
                      update({ bottomBezierPath: result.bezierPath });
                    } catch (e) { console.error(e); }
                    finally { setTracing(false); }
                  }}
                  disabled={tracing}
                  className={`self-start px-3.5 py-[7px] bg-blue text-white border-none rounded-[7px] text-[12px] font-semibold ${tracing ? "cursor-default opacity-60" : "cursor-pointer"}`}
                >
                  {tracing ? "Tracing…" : "Trace Bottom Contact Surface"}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

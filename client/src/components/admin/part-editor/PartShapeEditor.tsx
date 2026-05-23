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

import { useState } from "react";
import { C, alpha } from "@/styles/theme";
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
    full:    { label: "Full Geometry",        color: C.green,  desc: "Top + Side + Bottom — complete 3-view geometry" },
    lathe:   { label: "Revolution Profile",   color: C.blue,   desc: "Top footprint + side-profile spline" },
    extrude: { label: "Uniform Extrusion",    color: C.yellow, desc: "Top silhouette extruded to height" },
    profile: { label: "Profile Only",         color: C.orange, desc: "Side-profile spline with circular plan" },
    preset:  { label: "Preset",               color: C.faint,  desc: "No images — uses preset geometry" },
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
    <label style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: C.muted }}>
      {label}
      <input
        type="number"
        min={min} max={max} step={step}
        value={val}
        onChange={(e) => set(Math.max(min, Math.min(max, +e.target.value)))}
        style={{
          width: 52, padding: "2px 5px",
          background: C.bg2, border: `1px solid ${C.border}`,
          borderRadius: 4, color: C.text, fontSize: 11,
        }}
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
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.muted }}>
        <span>{label}</span>
        <span style={{ fontFamily: "monospace", color: C.text }}>{fmt ? fmt(val) : val}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={val}
        onChange={(e) => set(+e.target.value)}
        style={{ width: "100%", accentColor: C.blue }}
      />
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

      {/* Workflow tier badge */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 12, color: C.muted }}>Shape workflow:</span>
        <span style={{
          fontSize: 11, padding: "2px 9px", borderRadius: 99, fontWeight: 600,
          background: alpha(tierMeta.color, 0.09), color: tierMeta.color, border: `1px solid ${alpha(tierMeta.color, 0.27)}`,
        }}>
          {tierMeta.label}
        </span>
        <span style={{ fontSize: 11, color: C.faint }}>{tierMeta.desc}</span>
      </div>

      {/* Image scale + trace settings — only when at least one image is uploaded */}
      {hasAnyImage && (
        <div style={{
          display: "flex", flexDirection: "column", gap: 10,
          padding: "10px 12px", background: C.bg2, borderRadius: 8,
          border: `1px solid ${C.border}`,
        }}>
          {/* Scale inputs row */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center" }}>
            <span style={{ fontSize: 11, color: C.faint, fontWeight: 600 }}>Image scale</span>
            {images.topView    && numInput("Top diam:",    topDiamMm,    setTopDiamMm)}
            {images.bottomView && numInput("Bottom diam:", bottomDiamMm, setBottomDiamMm)}
            {images.sideView   && numInput("Side height:", sideMaxH,     setSideMaxH)}
            {images.sideView   && numInput("Side radius:", sideMaxR,     setSideMaxR)}
            <span style={{ fontSize: 10, color: C.faint }}>Physical mm the image represents</span>
          </div>

          {/* Trace settings — collapsible */}
          <div>
            <button
              onClick={() => setTraceSettingsOpen((o) => !o)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: 11, color: C.muted, display: "flex", alignItems: "center", gap: 5, padding: 0,
              }}
            >
              <span style={{ fontSize: 10 }}>{traceSettingsOpen ? "▾" : "▸"}</span>
              Trace settings
            </button>

            {traceSettingsOpen && (
              <div style={{
                marginTop: 10, paddingTop: 10,
                borderTop: `1px solid ${C.border}`,
                display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 20px",
              }}>
                {/* RDP tolerance */}
                <div>
                  {sliderRow(
                    "RDP tolerance (px)", rdpTolerance, setRdpTolerance,
                    0.5, 12, 0.5,
                    (v) => `${v}px`,
                  )}
                  <div style={{ fontSize: 10, color: C.faint, marginTop: 2 }}>
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
                  <div style={{ fontSize: 10, color: C.faint, marginTop: 2 }}>
                    Pixels below this alpha are treated as background
                  </div>
                </div>

                {/* Trace resolution */}
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <span style={{ fontSize: 11, color: C.muted }}>Trace resolution</span>
                  <SearchableSelect
                    value={String(traceMaxDim)}
                    options={[
                      { value: "64", label: "64 px — fast, blocky" },
                      { value: "128", label: "128 px" },
                      { value: "256", label: "256 px — default" },
                      { value: "512", label: "512 px — high detail" },
                    ]}
                    onChange={(v) => setTraceMaxDim(+v)}
                    style={{ background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 5, color: C.text, fontSize: 11 }}
                  />
                </div>

                {/* Side knots */}
                {images.sideView && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {numInput("Side trace knots:", sideKnots, setSideKnots, "", 3, 30, 1)}
                    <div style={{ fontSize: 10, color: C.faint }}>
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
      <div style={{ display: "flex", gap: 4, borderBottom: `1px solid ${C.border}`, paddingBottom: 4 }}>
        {availableTabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "5px 12px", fontSize: 12, borderRadius: "6px 6px 0 0",
              background: tab === t ? C.bg1 : "transparent",
              color: tab === t ? C.text : C.muted,
              border: `1px solid ${tab === t ? C.border : "transparent"}`,
              borderBottom: tab === t ? `1px solid ${C.bg1}` : "none",
              cursor: "pointer", marginBottom: tab === t ? -1 : 0,
            }}
          >
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      {/* ── Tab: Preset ──────────────────────────────────────────────────────── */}
      {tab === "preset" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Shape picker grid */}
          <div>
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>Preset shape</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {PRESET_SHAPES.map((p) => {
                const active = value.preset === p && value.type === "preset";
                return (
                  <button
                    key={p}
                    onClick={() => applyPreset(p)}
                    style={{
                      padding: "8px 12px", borderRadius: 8, fontSize: 13, cursor: "pointer",
                      background: active ? alpha(C.blue, 0.13) : C.bg2,
                      color: active ? C.blue : C.muted,
                      border: `1px solid ${active ? alpha(C.blue, 0.53) : C.border}`,
                      display: "flex", alignItems: "center", gap: 6,
                    }}
                  >
                    <span style={{ fontSize: 16 }}>{PRESET_ICONS[p]}</span>
                    <span style={{ textTransform: "capitalize" }}>{p}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preset parameters */}
          <div style={{
            display: "flex", flexDirection: "column", gap: 10,
            padding: "10px 12px", background: C.bg2, borderRadius: 8,
            border: `1px solid ${C.border}`,
          }}>
            <span style={{ fontSize: 11, color: C.faint, fontWeight: 600 }}>Shape parameters</span>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 20px" }}>
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
                <div style={{ gridColumn: "1 / -1" }}>
                  {sliderRow(
                    "Point depth (inner / outer ratio)", presetStarRatio, handlePresetStarRatio,
                    0.1, 0.9, 0.01,
                    (v) => `${(v * 100).toFixed(0)}%`,
                  )}
                  <div style={{ fontSize: 10, color: C.faint, marginTop: 2 }}>
                    Lower = sharper / more aggressive points
                  </div>
                </div>
              )}
            </div>

            <div style={{ fontSize: 10, color: C.faint }}>
              Changes are baked into the Bezier path — switch to the Bezier tab to refine further.
            </div>
          </div>

          {/* Silhouette trace from top image */}
          {images.topView && (
            <div>
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 8 }}>
                Or trace the shape from the uploaded top-view image:
              </div>
              <button
                onClick={handleTrace}
                disabled={tracing}
                style={{
                  padding: "8px 16px", background: tracing ? C.bg3 : C.blue,
                  color: "#fff", border: "none", borderRadius: 8,
                  fontSize: 13, fontWeight: 600, cursor: tracing ? "default" : "pointer",
                }}
              >
                {tracing ? "Tracing silhouette…" : "Trace Silhouette from Top Image →"}
              </button>
              <div style={{ fontSize: 11, color: C.faint, marginTop: 6 }}>
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
            <div style={{ fontSize: 12, color: C.faint }}>
              No Bezier path yet. Pick a preset on the Preset tab, or trace from a top-view image.
              {images.topView && (
                <button
                  onClick={handleTrace}
                  disabled={tracing}
                  style={{ marginLeft: 10, padding: "5px 12px", background: C.blue, color: "#fff", border: "none", borderRadius: 6, fontSize: 12, cursor: "pointer" }}
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

          <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 10 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={value.bottomMimic !== false}
                onChange={(e) => update({ bottomMimic: e.target.checked })}
                style={{ accentColor: C.blue, width: 14, height: 14 }}
              />
              <span style={{ fontSize: 12, color: C.muted }}>Mimic top on bottom</span>
            </label>
            <span style={{ fontSize: 11, color: C.faint }}>
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
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ fontSize: 12, color: C.faint }}>
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
                  style={{
                    alignSelf: "flex-start", padding: "7px 14px", background: C.blue, color: "#fff",
                    border: "none", borderRadius: 7, fontSize: 12, fontWeight: 600,
                    cursor: tracing ? "default" : "pointer", opacity: tracing ? 0.6 : 1,
                  }}
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

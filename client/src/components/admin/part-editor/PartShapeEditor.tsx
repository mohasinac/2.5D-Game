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
import { C } from "@/styles/theme";
import type { PartShape, FourierRadialProfile, BezierPath, BezierSplineProfile, PartImages } from "@/types/beybladeSystem";
import { synthesizeRadialCache } from "@/types/beybladeSystem";
import { BezierEditor } from "./BezierEditor";
import { FourierEditor } from "./FourierEditor";
import { SplineProfileEditor } from "./SplineProfileEditor";
import { traceSilhouette } from "./SilhouetteTracer";

type ShapeTab = "preset" | "bezier" | "fourier" | "side" | "bottom";

const PRESET_SHAPES = ["circle", "ring", "star3", "star4", "star6", "triangle", "square", "hexagon"] as const;

// Simple SVG preset preview icons
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
  const tier = workflowTier(images);

  const update = (patch: Partial<PartShape>) => onChange({ ...value, ...patch });

  const handleTrace = async () => {
    if (!images.topView) return;
    setTracing(true);
    try {
      const result = await traceSilhouette(images.topView, 2.0, 0.15);
      update({ type: "custom", bezierPath: result.bezierPath });
      setTab("bezier");
    } catch (e) {
      console.error("Trace failed:", e);
    } finally {
      setTracing(false);
    }
  };

  const handleSyncFourier = (polygonCache: Array<{ x: number; y: number }>) => {
    // DFT from polygon cache to generate Fourier profile
    const N = polygonCache.length;
    if (N < 4) return;

    // Convert polygon to radial array (polar)
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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Workflow tier badge */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 12, color: C.muted }}>Shape workflow:</span>
        <span style={{
          fontSize: 11, padding: "2px 9px", borderRadius: 99, fontWeight: 600,
          background: tierMeta.color + "18", color: tierMeta.color, border: `1px solid ${tierMeta.color}44`,
        }}>
          {tierMeta.label}
        </span>
        <span style={{ fontSize: 11, color: C.faint }}>{tierMeta.desc}</span>
      </div>

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

      {/* Tab: Preset ────────────────────────────────────────────────────────── */}
      {tab === "preset" && (
        <div>
          <div style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>Preset shape</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {PRESET_SHAPES.map((p) => (
              <button
                key={p}
                onClick={() => update({ type: "preset", preset: p })}
                style={{
                  padding: "8px 12px", borderRadius: 8, fontSize: 13, cursor: "pointer",
                  background: value.preset === p && value.type === "preset" ? C.blue + "22" : C.bg2,
                  color: value.preset === p && value.type === "preset" ? C.blue : C.muted,
                  border: `1px solid ${value.preset === p && value.type === "preset" ? C.blue + "88" : C.border}`,
                  display: "flex", alignItems: "center", gap: 6,
                }}
              >
                <span style={{ fontSize: 16 }}>{PRESET_ICONS[p]}</span>
                <span style={{ textTransform: "capitalize" }}>{p}</span>
              </button>
            ))}
          </div>

          {images.topView && (
            <div style={{ marginTop: 14 }}>
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
                Extracts a Bezier polygon from the no-background PNG. Switch to the Bezier tab to refine.
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab: Bezier ────────────────────────────────────────────────────────── */}
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
              No Bezier path yet. Trace the silhouette from the Preset tab, or upload a top-view image.
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

      {/* Tab: Fourier ───────────────────────────────────────────────────────── */}
      {tab === "fourier" && (
        <FourierEditor
          value={value.fourierProfile}
          onChange={(fp) => update({ fourierProfile: fp })}
          imageUrl={images.topView}
        />
      )}

      {/* Tab: Side Profile ─────────────────────────────────────────────────── */}
      {tab === "side" && (
        <div>
          <SplineProfileEditor
            value={value.sideProfileSpline ?? { knots: [{ height: 0, radius: 20 }, { height: 30, radius: 20 }] }}
            onChange={(sp) => update({ sideProfileSpline: sp })}
            imageUrl={images.sideView}
          />

          {/* bottomMimic toggle */}
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

      {/* Tab: Bottom ────────────────────────────────────────────────────────── */}
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
                      const result = await traceSilhouette(images.bottomView!, 1.5, 0.15);
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

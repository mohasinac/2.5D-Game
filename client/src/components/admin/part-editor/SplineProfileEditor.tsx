/**
 * SplineProfileEditor — editable Catmull-Rom spline for the side-view height→radius profile.
 *
 * Features:
 *  • Renders radius-vs-height spline on a 2D canvas (X = radius, Y = height from floor)
 *  • Drag knots to reshape; derived curveCache updates live
 *  • "Trace from side image" — scans the image row-by-row to extract radius samples
 *  • Knot list below canvas for precise editing
 *  • Exports BezierSplineProfile with curveCache
 */

import { useRef, useEffect, useState, useCallback } from "react";
import { C } from "@/styles/theme";
import type { BezierSplineProfile, SplineKnot } from "@/types/beybladeSystem";

const CANVAS_W = 200;
const CANVAS_H = 260;
const PAD = { left: 32, right: 12, top: 10, bottom: 28 };
const KNOT_R = 5;

// ── Catmull-Rom to sample curve ───────────────────────────────────────────────

function sampleCatmullRom(knots: SplineKnot[], steps = 100): Array<{ height: number; radius: number }> {
  if (knots.length < 2) return knots.map((k) => ({ height: k.height, radius: k.radius }));

  const pts: Array<{ height: number; radius: number }> = [];
  const n = knots.length;

  for (let i = 0; i < n - 1; i++) {
    const p0 = knots[Math.max(0, i - 1)];
    const p1 = knots[i];
    const p2 = knots[i + 1];
    const p3 = knots[Math.min(n - 1, i + 2)];

    const segSteps = Math.max(4, Math.floor(steps / (n - 1)));
    for (let s = 0; s <= segSteps; s++) {
      const t = s / segSteps;
      const t2 = t * t, t3 = t2 * t;
      const h = 0.5 * (
        (2 * p1.height) +
        (-p0.height + p2.height) * t +
        (2 * p0.height - 5 * p1.height + 4 * p2.height - p3.height) * t2 +
        (-p0.height + 3 * p1.height - 3 * p2.height + p3.height) * t3
      );
      const r = 0.5 * (
        (2 * p1.radius) +
        (-p0.radius + p2.radius) * t +
        (2 * p0.radius - 5 * p1.radius + 4 * p2.radius - p3.radius) * t2 +
        (-p0.radius + 3 * p1.radius - 3 * p2.radius + p3.radius) * t3
      );
      pts.push({ height: h, radius: r });
    }
  }
  return pts;
}

// ── Trace side image ──────────────────────────────────────────────────────────

async function traceSideProfile(imageUrl: string, numKnots = 10): Promise<SplineKnot[]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const w = 256, h = 256;
      const canvas = document.createElement("canvas");
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, w, h);
      const data = ctx.getImageData(0, 0, w, h).data;

      // For each row (= height), find the max x with alpha > 32
      const samples: SplineKnot[] = [];
      const step = Math.floor(h / numKnots);
      for (let ki = 0; ki < numKnots; ki++) {
        const row = Math.min(h - 1, ki * step);
        let maxR = 0;
        for (let x = 0; x < w; x++) {
          if (data[(row * w + x) * 4 + 3] >= 32) maxR = Math.max(maxR, Math.abs(x - w / 2));
        }
        const heightFrac = 1 - row / (h - 1); // invert: top of image = max height
        samples.push({ height: heightFrac, radius: maxR / (w / 2) }); // normalised 0-1
      }
      resolve(samples.reverse());
    };
    img.onerror = reject;
    img.src = imageUrl;
  });
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  value: BezierSplineProfile;
  onChange: (profile: BezierSplineProfile) => void;
  imageUrl?: string;
  maxHeight?: number;   // mm — for axis scaling (default 60)
  maxRadius?: number;   // mm — for axis scaling (default 40)
}

export function SplineProfileEditor({ value, onChange, imageUrl, maxHeight = 60, maxRadius = 40 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tracing, setTracing] = useState(false);
  const dragging = useRef<number | null>(null); // knot index being dragged

  const toCanvasX = (r: number) => PAD.left + (r / maxRadius) * (CANVAS_W - PAD.left - PAD.right);
  const toCanvasY = (h: number) => CANVAS_H - PAD.bottom - (h / maxHeight) * (CANVAS_H - PAD.top - PAD.bottom);
  const fromCanvasX = (px: number) => ((px - PAD.left) / (CANVAS_W - PAD.left - PAD.right)) * maxRadius;
  const fromCanvasY = (py: number) => ((CANVAS_H - PAD.bottom - py) / (CANVAS_H - PAD.top - PAD.bottom)) * maxHeight;

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.fillStyle = C.bg3;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Grid
    ctx.strokeStyle = C.border; ctx.lineWidth = 0.5;
    for (let r = 0; r <= maxRadius; r += 10) {
      const px = toCanvasX(r);
      ctx.beginPath(); ctx.moveTo(px, PAD.top); ctx.lineTo(px, CANVAS_H - PAD.bottom); ctx.stroke();
    }
    for (let h = 0; h <= maxHeight; h += 10) {
      const py = toCanvasY(h);
      ctx.beginPath(); ctx.moveTo(PAD.left, py); ctx.lineTo(CANVAS_W - PAD.right, py); ctx.stroke();
    }

    // Axis labels
    ctx.fillStyle = C.faint; ctx.font = "9px sans-serif"; ctx.textAlign = "right";
    for (let h = 0; h <= maxHeight; h += 10) ctx.fillText(`${h}`, PAD.left - 3, toCanvasY(h) + 3);
    ctx.textAlign = "center";
    for (let r = 0; r <= maxRadius; r += 10) ctx.fillText(`${r}`, toCanvasX(r), CANVAS_H - PAD.bottom + 12);

    // Spline curve
    const curve = sampleCatmullRom(value.knots, 80);
    if (curve.length >= 2) {
      ctx.beginPath();
      curve.forEach((p, i) => {
        const px = toCanvasX(p.radius), py = toCanvasY(p.height);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      });
      ctx.strokeStyle = C.blue; ctx.lineWidth = 2;
      ctx.stroke();

      // Mirror (left side)
      ctx.beginPath();
      curve.forEach((p, i) => {
        const px = toCanvasX(-p.radius) + 2 * PAD.left - 4, py = toCanvasY(p.height);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      });
      ctx.strokeStyle = C.blue + "44"; ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Knots
    value.knots.forEach((k, i) => {
      ctx.beginPath();
      ctx.arc(toCanvasX(k.radius), toCanvasY(k.height), KNOT_R, 0, Math.PI * 2);
      ctx.fillStyle = dragging.current === i ? C.yellow : C.blue;
      ctx.fill();
    });
  }, [value, maxHeight, maxRadius]);

  useEffect(() => { redraw(); }, [redraw]);

  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    const hit = value.knots.findIndex((k) =>
      Math.hypot(toCanvasX(k.radius) - mx, toCanvasY(k.height) - my) <= KNOT_R + 4
    );
    if (hit >= 0) dragging.current = hit;
  };

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (dragging.current === null) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    const r = Math.max(0, Math.min(maxRadius, fromCanvasX(mx)));
    const h = Math.max(0, Math.min(maxHeight, fromCanvasY(my)));
    const knots = value.knots.map((k, i) => i === dragging.current ? { ...k, radius: parseFloat(r.toFixed(1)), height: parseFloat(h.toFixed(1)) } : k)
      .sort((a, b) => a.height - b.height);
    const cache = sampleCatmullRom(knots, 50);
    onChange({ knots, curveCache: cache });
  };

  const onMouseUp = () => { dragging.current = null; };

  const handleTrace = async () => {
    if (!imageUrl) return;
    setTracing(true);
    try {
      const rawKnots = await traceSideProfile(imageUrl, 10);
      // Scale normalised values to mm
      const knots: SplineKnot[] = rawKnots.map((k) => ({
        height: parseFloat((k.height * maxHeight).toFixed(1)),
        radius: parseFloat((k.radius * maxRadius).toFixed(1)),
      }));
      const cache = sampleCatmullRom(knots, 50);
      onChange({ knots, curveCache: cache });
    } catch (e) {
      console.error(e);
    } finally {
      setTracing(false);
    }
  };

  const addKnot = () => {
    const midH = maxHeight / 2, midR = maxRadius / 2;
    const knots = [...value.knots, { height: midH, radius: midR }].sort((a, b) => a.height - b.height);
    const cache = sampleCatmullRom(knots, 50);
    onChange({ knots, curveCache: cache });
  };

  const updateKnot = (idx: number, field: "height" | "radius", v: number) => {
    const knots = value.knots.map((k, i) => i === idx ? { ...k, [field]: v } : k).sort((a, b) => a.height - b.height);
    const cache = sampleCatmullRom(knots, 50);
    onChange({ knots, curveCache: cache });
  };

  const removeKnot = (idx: number) => {
    const knots = value.knots.filter((_, i) => i !== idx);
    const cache = sampleCatmullRom(knots, 50);
    onChange({ knots, curveCache: cache });
  };

  return (
    <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
      {/* Canvas */}
      <div>
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          style={{ borderRadius: 8, border: `1px solid ${C.border}`, cursor: "grab" }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        />
        <div style={{ fontSize: 10, color: C.faint, marginTop: 4, textAlign: "center" }}>
          Drag knots · X = radius (mm) · Y = height (mm)
        </div>
      </div>

      {/* Knot list + controls */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        {imageUrl && (
          <button
            onClick={handleTrace}
            disabled={tracing}
            style={{
              padding: "6px 12px", background: C.blue, color: "#fff", border: "none",
              borderRadius: 7, fontSize: 11, fontWeight: 600,
              cursor: tracing ? "default" : "pointer", opacity: tracing ? 0.6 : 1,
            }}
          >
            {tracing ? "Tracing…" : "Trace Side Profile"}
          </button>
        )}

        <button
          onClick={addKnot}
          style={{
            padding: "5px 10px", background: C.bg3, border: `1px solid ${C.border}`,
            borderRadius: 6, fontSize: 11, color: C.muted, cursor: "pointer",
          }}
        >
          + Add Knot
        </button>

        <div style={{ maxHeight: 200, overflowY: "auto", display: "flex", flexDirection: "column", gap: 4 }}>
          {value.knots.map((k, i) => (
            <div key={i} style={{ background: C.bg3, borderRadius: 6, padding: "6px 8px", display: "flex", gap: 6, alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 3, flex: 1 }}>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <span style={{ fontSize: 10, color: C.muted, width: 40 }}>h (mm)</span>
                  <input
                    type="number" min={0} max={maxHeight} step={0.5} value={k.height}
                    onChange={(e) => updateKnot(i, "height", +e.target.value)}
                    style={{ width: 55, padding: "2px 5px", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 4, color: C.text, fontSize: 11 }}
                  />
                  <span style={{ fontSize: 10, color: C.muted, width: 40 }}>r (mm)</span>
                  <input
                    type="number" min={0} max={maxRadius} step={0.5} value={k.radius}
                    onChange={(e) => updateKnot(i, "radius", +e.target.value)}
                    style={{ width: 55, padding: "2px 5px", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 4, color: C.text, fontSize: 11 }}
                  />
                </div>
              </div>
              <button
                onClick={() => removeKnot(i)}
                style={{ fontSize: 12, color: C.red, background: "none", border: "none", cursor: "pointer", flexShrink: 0 }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

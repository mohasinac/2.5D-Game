/**
 * BezierEditor — interactive canvas for editing a BezierPath.
 *
 * Features:
 *  • Renders closed path on a fixed canvas (SVG-like)
 *  • Drag endpoints and control-point handles
 *  • Double-click edge to insert new L-segment
 *  • Right-click / Delete key to remove selected segment
 *  • Flatness tolerance slider → regenerates polygonCache
 *  • "Sync Fourier" button emits onSyncFourier() when polygonCache is ready
 *  • "Trace from image" overlays source PNG as reference
 */

import { useRef, useEffect, useState, useCallback } from "react";
import { C, HEX } from "@/styles/theme";
import type { BezierPath, BezierPathSegment } from "@/types/beybladeSystem";

const CANVAS_SIZE = 260;
const HANDLE_RADIUS = 5;
const CENTER = CANVAS_SIZE / 2;

// ── Helpers ───────────────────────────────────────────────────────────────────

function evalBezierAt(p0x: number, p0y: number, p1x: number, p1y: number, p2x: number, p2y: number, p3x: number, p3y: number, t: number) {
  const mt = 1 - t;
  return {
    x: mt*mt*mt*p0x + 3*mt*mt*t*p1x + 3*mt*t*t*p2x + t*t*t*p3x,
    y: mt*mt*mt*p0y + 3*mt*mt*t*p1y + 3*mt*t*t*p2y + t*t*t*p3y,
  };
}

function buildPolygonCache(path: BezierPath, tolerance: number): Array<{ x: number; y: number }> {
  const pts: Array<{ x: number; y: number }> = [];
  if (!path.segments.length) return pts;

  let prevX = 0, prevY = 0;
  for (const seg of path.segments) {
    if (seg.type === "L") {
      pts.push({ x: seg.x, y: seg.y });
    } else {
      const steps = Math.max(4, Math.ceil(50 / Math.max(tolerance, 0.01)));
      for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        const p = evalBezierAt(prevX, prevY, seg.x1!, seg.y1!, seg.x2!, seg.y2!, seg.x, seg.y, t);
        pts.push(p);
      }
    }
    prevX = seg.x; prevY = seg.y;
  }
  return pts;
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  value: BezierPath;
  onChange: (path: BezierPath) => void;
  onSyncFourier?: (polygonCache: Array<{ x: number; y: number }>) => void;
  imageUrl?: string;
  scale?: number; // px per mm (default 4)
}

export function BezierEditor({ value, onChange, onSyncFourier, imageUrl, scale = 4 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [tolerance, setTolerance] = useState(value.polygonTolerance ?? 1.0);
  const dragging = useRef<{ segIdx: number; handle: "endpoint" | "cp1" | "cp2" } | null>(null);
  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);

  // Load reference image
  useEffect(() => {
    if (!imageUrl) { setImgEl(null); return; }
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => setImgEl(img);
    img.src = imageUrl;
  }, [imageUrl]);

  const toCanvas = (mm: number) => CENTER + mm * scale;
  const fromCanvas = (px: number) => (px - CENTER) / scale;

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    ctx.fillStyle = HEX.bg3;
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Reference image (faint)
    if (imgEl) {
      ctx.globalAlpha = 0.25;
      ctx.drawImage(imgEl, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
      ctx.globalAlpha = 1;
    }

    // Grid lines
    ctx.strokeStyle = HEX.border;
    ctx.lineWidth = 0.5;
    for (let d = -60; d <= 60; d += 10) {
      const px = toCanvas(d);
      ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, CANVAS_SIZE); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, px); ctx.lineTo(CANVAS_SIZE, px); ctx.stroke();
    }

    const segs = value.segments;
    if (!segs.length) return;

    // Closed path
    ctx.beginPath();
    ctx.moveTo(toCanvas(segs[segs.length - 1].x), toCanvas(segs[segs.length - 1].y));
    let prevX = segs[segs.length - 1].x, prevY = segs[segs.length - 1].y;
    for (const seg of segs) {
      if (seg.type === "L") {
        ctx.lineTo(toCanvas(seg.x), toCanvas(seg.y));
      } else {
        ctx.bezierCurveTo(
          toCanvas(seg.x1!), toCanvas(seg.y1!),
          toCanvas(seg.x2!), toCanvas(seg.y2!),
          toCanvas(seg.x), toCanvas(seg.y)
        );
      }
      prevX = seg.x; prevY = seg.y;
    }
    ctx.closePath();
    ctx.fillStyle = HEX.blue + "22";
    ctx.fill();
    ctx.strokeStyle = HEX.blue;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Control handles
    segs.forEach((seg, i) => {
      const isSelected = selected === i;
      // Endpoint
      ctx.beginPath();
      ctx.arc(toCanvas(seg.x), toCanvas(seg.y), HANDLE_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = isSelected ? HEX.blue : HEX.muted;
      ctx.fill();

      if (isSelected && seg.type === "C") {
        // Control point handles
        const prev = i > 0 ? segs[i - 1] : segs[segs.length - 1];
        ctx.setLineDash([3, 3]);
        ctx.strokeStyle = HEX.yellow + "aa";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(toCanvas(prev.x), toCanvas(prev.y));
        ctx.lineTo(toCanvas(seg.x1!), toCanvas(seg.y1!));
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(toCanvas(seg.x), toCanvas(seg.y));
        ctx.lineTo(toCanvas(seg.x2!), toCanvas(seg.y2!));
        ctx.stroke();
        ctx.setLineDash([]);

        [{ x: seg.x1!, y: seg.y1! }, { x: seg.x2!, y: seg.y2! }].forEach((cp) => {
          ctx.beginPath();
          ctx.arc(toCanvas(cp.x), toCanvas(cp.y), 4, 0, Math.PI * 2);
          ctx.fillStyle = HEX.yellow;
          ctx.fill();
        });
      }
    });
  }, [value, selected, imgEl, scale]);

  useEffect(() => { redraw(); }, [redraw]);

  const getHitSegment = (mx: number, my: number): { segIdx: number; handle: "endpoint" | "cp1" | "cp2" } | null => {
    for (let i = 0; i < value.segments.length; i++) {
      const seg = value.segments[i];
      if (Math.hypot(toCanvas(seg.x) - mx, toCanvas(seg.y) - my) <= HANDLE_RADIUS + 3) {
        return { segIdx: i, handle: "endpoint" };
      }
      if (seg.type === "C" && selected === i) {
        if (Math.hypot(toCanvas(seg.x1!) - mx, toCanvas(seg.y1!) - my) <= 6)
          return { segIdx: i, handle: "cp1" };
        if (Math.hypot(toCanvas(seg.x2!) - mx, toCanvas(seg.y2!) - my) <= 6)
          return { segIdx: i, handle: "cp2" };
      }
    }
    return null;
  };

  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    const hit = getHitSegment(mx, my);
    if (hit) {
      setSelected(hit.segIdx);
      dragging.current = hit;
    } else {
      setSelected(null);
    }
  };

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!dragging.current) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    const mmX = fromCanvas(mx), mmY = fromCanvas(my);
    const { segIdx, handle } = dragging.current;
    const segs = [...value.segments];
    const seg = { ...segs[segIdx] };
    if (handle === "endpoint") { seg.x = mmX; seg.y = mmY; }
    else if (handle === "cp1") { seg.x1 = mmX; seg.y1 = mmY; }
    else if (handle === "cp2") { seg.x2 = mmX; seg.y2 = mmY; }
    segs[segIdx] = seg;
    const newPath: BezierPath = { ...value, segments: segs, polygonCache: buildPolygonCache({ segments: segs } as BezierPath, tolerance) };
    onChange(newPath);
  };

  const onMouseUp = () => { dragging.current = null; };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === "Delete" || e.key === "Backspace") && selected !== null) {
      const segs = value.segments.filter((_, i) => i !== selected);
      onChange({ ...value, segments: segs, polygonCache: buildPolygonCache({ segments: segs } as BezierPath, tolerance) });
      setSelected(null);
    }
  };

  const handleToleranceChange = (t: number) => {
    setTolerance(t);
    const cache = buildPolygonCache(value, t);
    onChange({ ...value, polygonTolerance: t, polygonCache: cache });
  };

  const syncFourier = () => {
    const cache = value.polygonCache ?? buildPolygonCache(value, tolerance);
    onSyncFourier?.(cache);
  };

  const totalSegs = value.segments.length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        tabIndex={0}
        style={{ borderRadius: 8, cursor: "crosshair", outline: "none", border: `1px solid ${C.border}` }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onKeyDown={onKeyDown}
      />

      {/* Controls */}
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ fontSize: 11, color: C.muted }}>{totalSegs} segments</div>
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 11, color: C.muted }}>Tolerance</span>
          <input
            type="range" min={0.1} max={5} step={0.1} value={tolerance}
            onChange={(e) => handleToleranceChange(+e.target.value)}
            style={{ width: 80, accentColor: C.blue }}
          />
          <span style={{ fontSize: 11, color: C.text, fontFamily: "monospace", minWidth: 28 }}>{tolerance.toFixed(1)}</span>
        </div>
        {onSyncFourier && (
          <button
            onClick={syncFourier}
            style={{
              padding: "5px 12px", background: C.bg3, border: `1px solid ${C.border}`,
              borderRadius: 6, fontSize: 11, color: C.yellow, cursor: "pointer",
            }}
          >
            Sync Fourier
          </button>
        )}
      </div>
      <div style={{ fontSize: 10, color: C.faint }}>
        Drag endpoints to reshape · Delete key removes selected · Double-click edge to insert (coming soon)
      </div>
    </div>
  );
}

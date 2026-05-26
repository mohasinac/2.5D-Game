// Phase 22/23 — ArenaEditorCanvas: pan/zoom canvas for arena feature placement.
// Shared by Modular Arena Builder (L2B.3) and Preset Library (L2D.5).
// Grid snap: 1cm. Floor selector. Drag-place, select/move/resize. Loop track circles.

import { useRef, useState, useCallback, useEffect } from "react";

export interface PlacedFeature {
  id: string;
  type: string;
  x_cm: number;
  y_cm: number;
  width_cm?: number;
  height_cm?: number;
  radiusCm?: number;
  floorIndex: number;
  color?: string;
  label?: string;
}

interface ArenaEditorCanvasProps {
  arenaRadiusCm?: number;
  features: PlacedFeature[];
  onFeaturesChange: (features: PlacedFeature[]) => void;
  selectedFloor?: number;
  onFloorChange?: (floor: number) => void;
  maxFloors?: number;
  snapCm?: number;
}

const PX_PER_CM = 4; // canvas internal scale

function snapTo(v: number, grid: number): number {
  return Math.round(v / grid) * grid;
}

export function ArenaEditorCanvas({
  arenaRadiusCm = 50,
  features,
  onFeaturesChange,
  selectedFloor = 0,
  onFloorChange,
  maxFloors = 1,
  snapCm = 1,
}: ArenaEditorCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dragging, setDragging] = useState<{ id: string; startX: number; startY: number; origX: number; origY: number } | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  const canvasPx = arenaRadiusCm * PX_PER_CM * 2 + 80;
  const cx = canvasPx / 2;
  const cy = canvasPx / 2;

  const cmToPx = (cm: number) => cm * PX_PER_CM;
  const pxToCm = (px: number) => px / PX_PER_CM;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#0a0e1c";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    ctx.lineWidth = 1;
    const gridPx = cmToPx(5);
    for (let gx = 0; gx < canvas.width; gx += gridPx) {
      ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, canvas.height); ctx.stroke();
    }
    for (let gy = 0; gy < canvas.height; gy += gridPx) {
      ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(canvas.width, gy); ctx.stroke();
    }

    // Arena boundary
    ctx.strokeStyle = "rgba(68,136,255,0.5)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, cmToPx(arenaRadiusCm), 0, Math.PI * 2);
    ctx.stroke();

    // Features on current floor
    for (const f of features) {
      if (f.floorIndex !== selectedFloor) continue;
      const fx = cx + cmToPx(f.x_cm);
      const fy = cy + cmToPx(f.y_cm);
      const isSelected = f.id === selectedId;
      const baseColor = f.color ?? "#44aaff";

      ctx.strokeStyle = isSelected ? "#ffffff" : baseColor;
      ctx.fillStyle = baseColor + "33";
      ctx.lineWidth = isSelected ? 2.5 : 1.5;

      if (f.radiusCm !== undefined) {
        // Circle (loop track, gravity well, etc.)
        ctx.beginPath();
        ctx.arc(fx, fy, cmToPx(f.radiusCm), 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else {
        // Rectangle
        const w = cmToPx(f.width_cm ?? 4);
        const h = cmToPx(f.height_cm ?? 4);
        ctx.beginPath();
        ctx.rect(fx - w / 2, fy - h / 2, w, h);
        ctx.fill();
        ctx.stroke();
      }

      // Label
      if (f.label) {
        ctx.fillStyle = "#ccddee";
        ctx.font = "9px monospace";
        ctx.textAlign = "center";
        ctx.fillText(f.label, fx, fy + 3);
      }
    }

    // Center crosshair
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(cx - 8, cy); ctx.lineTo(cx + 8, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, cy - 8); ctx.lineTo(cx, cy + 8); ctx.stroke();
  }, [features, selectedFloor, selectedId, arenaRadiusCm, cx, cy]);

  useEffect(() => { draw(); }, [draw, zoom, pan]);

  const getCanvasPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return {
      px: (e.clientX - rect.left) / zoom,
      py: (e.clientY - rect.top) / zoom,
    };
  };

  const hitTest = (px: number, py: number): string | null => {
    for (const f of [...features].reverse()) {
      if (f.floorIndex !== selectedFloor) continue;
      const fx = cx + cmToPx(f.x_cm);
      const fy = cy + cmToPx(f.y_cm);
      if (f.radiusCm !== undefined) {
        if (Math.hypot(px - fx, py - fy) <= cmToPx(f.radiusCm)) return f.id;
      } else {
        const w = cmToPx(f.width_cm ?? 4) / 2;
        const h = cmToPx(f.height_cm ?? 4) / 2;
        if (Math.abs(px - fx) <= w && Math.abs(py - fy) <= h) return f.id;
      }
    }
    return null;
  };

  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button === 1 || e.altKey) {
      setIsPanning(true);
      panStart.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
      return;
    }
    const { px, py } = getCanvasPos(e);
    const hit = hitTest(px, py);
    if (hit) {
      setSelectedId(hit);
      const f = features.find(x => x.id === hit)!;
      setDragging({ id: hit, startX: px, startY: py, origX: f.x_cm, origY: f.y_cm });
    } else {
      setSelectedId(null);
    }
  };

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPanning) {
      setPan({ x: panStart.current.panX + e.clientX - panStart.current.x, y: panStart.current.panY + e.clientY - panStart.current.y });
      return;
    }
    if (!dragging) return;
    const { px, py } = getCanvasPos(e);
    const dx = pxToCm(px - dragging.startX);
    const dy = pxToCm(py - dragging.startY);
    const newX = snapTo(dragging.origX + dx, snapCm);
    const newY = snapTo(dragging.origY + dy, snapCm);
    onFeaturesChange(features.map(f => f.id === dragging.id ? { ...f, x_cm: newX, y_cm: newY } : f));
  };

  const onMouseUp = () => { setDragging(null); setIsPanning(false); };

  const onWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setZoom(z => Math.max(0.3, Math.min(4, z - e.deltaY * 0.001)));
  };

  const deleteSelected = () => {
    if (!selectedId) return;
    onFeaturesChange(features.filter(f => f.id !== selectedId));
    setSelectedId(null);
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Floor selector */}
      {maxFloors > 1 && (
        <div className="flex gap-[6px] items-center">
          <span className="text-[11px] text-[#8899aa] font-mono">Floor:</span>
          {Array.from({ length: maxFloors }, (_, i) => (
            <button
              key={i}
              onClick={() => onFloorChange?.(i)}
              className={`px-[10px] py-[3px] rounded-md text-[11px] cursor-pointer border ${selectedFloor === i ? "bg-[#4488ff] text-white border-[#4488ff]" : "bg-transparent text-[#8899aa] border-[rgba(255,255,255,0.12)]"}`}
            >
              {i === 0 ? "G" : i}
            </button>
          ))}
        </div>
      )}

      {/* Canvas */}
      <div className="overflow-hidden border border-white/10 rounded-lg relative">
        <canvas
          ref={canvasRef}
          width={canvasPx}
          height={canvasPx}
          style={{
            display: "block",
            transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
            transformOrigin: "top left",
            cursor: dragging ? "grabbing" : isPanning ? "grab" : "crosshair",
          }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onWheel={onWheel}
        />
      </div>

      {/* Controls */}
      <div className="flex gap-2 items-center text-[11px] text-[#8899aa] font-mono">
        <span>Zoom {Math.round(zoom * 100)}%</span>
        <button
          onClick={() => setZoom(1)}
          className="px-2 py-[2px] rounded bg-white/5 border border-white/10 text-[#8899aa] cursor-pointer text-[10px]"
        >Reset</button>
        {selectedId && (
          <button
            onClick={deleteSelected}
            className="px-2 py-[2px] rounded bg-[rgba(255,50,50,0.15)] border border-[rgba(255,50,50,0.4)] text-[#ff6666] cursor-pointer text-[10px]"
          >Delete Selected</button>
        )}
        <span className="ml-auto">Alt+drag = pan · Scroll = zoom · Click feature to select · Drag to move</span>
      </div>
    </div>
  );
}

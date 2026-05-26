/**
 * PocketListEditor — manages the `pockets` array on a part.
 *
 * Pockets can exist inside any part at any internal position.
 * Displayed as a 2D top-down canvas (dot placement) + list editor.
 */

import { useRef, useEffect, useState, useCallback } from "react";
import { C, HEX, alpha } from "@/styles/theme";
import type { PartPocket } from "@/types/beybladeSystem";

const CANVAS_SIZE = 200;
const CENTER = CANVAS_SIZE / 2;
const PX_PER_MM = 3.5;

function defaultPocket(x: number, y: number): PartPocket {
  return {
    position: { x, y },
    height: 20,
    size: "small",
    shape: "round",
    ballMaterial: "metal",
    ballCount: 1,
    fixed: true,
    radialChannel: false,
    escapable: false,
    escapeForce: 0,
  };
}

function drawCanvas(
  ctx: CanvasRenderingContext2D,
  pockets: PartPocket[],
  selected: number | null,
  outerRadius: number
) {
  ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  ctx.fillStyle = HEX.bg3;
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  // Outer radius ring
  ctx.beginPath();
  ctx.arc(CENTER, CENTER, outerRadius * PX_PER_MM, 0, Math.PI * 2);
  ctx.strokeStyle = HEX.border;
  ctx.lineWidth = 1;
  ctx.stroke();

  // Ring grid
  for (let r = 5; r < outerRadius; r += 5) {
    ctx.beginPath();
    ctx.arc(CENTER, CENTER, r * PX_PER_MM, 0, Math.PI * 2);
    ctx.strokeStyle = HEX.border + "55";
    ctx.lineWidth = 0.4;
    ctx.stroke();
  }

  // Crosshair
  ctx.strokeStyle = HEX.faint;
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(CENTER - 8, CENTER); ctx.lineTo(CENTER + 8, CENTER);
  ctx.moveTo(CENTER, CENTER - 8); ctx.lineTo(CENTER, CENTER + 8);
  ctx.stroke();

  // Pockets
  pockets.forEach((p, i) => {
    const px = CENTER + p.position.x * PX_PER_MM;
    const py = CENTER + p.position.y * PX_PER_MM;
    const r = p.size === "small" ? 4 : 7;
    const isSelected = selected === i;
    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.fillStyle = p.ballMaterial === "metal"
      ? (isSelected ? HEX.muted : HEX.faint)
      : (isSelected ? HEX.yellow : HEX.yellow + "88");
    ctx.fill();
    ctx.strokeStyle = isSelected ? "#fff" : HEX.border;
    ctx.lineWidth = isSelected ? 1.5 : 0.5;
    ctx.stroke();

    ctx.fillStyle = HEX.faint;
    ctx.font = "8px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${i + 1}`, px, py + 3);
  });
}

interface Props {
  value: PartPocket[];
  onChange: (pockets: PartPocket[]) => void;
  outerRadius?: number;
}

export function PocketListEditor({ value, onChange, outerRadius = 35 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [placing, setPlacing] = useState(false);
  const dragging = useRef<number | null>(null);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    drawCanvas(ctx, value, selected, outerRadius);
  }, [value, selected, outerRadius]);

  useEffect(() => { redraw(); }, [redraw]);

  const hitTest = (mx: number, my: number): number | null => {
    for (let i = value.length - 1; i >= 0; i--) {
      const p = value[i];
      const px = CENTER + p.position.x * PX_PER_MM;
      const py = CENTER + p.position.y * PX_PER_MM;
      if (Math.hypot(px - mx, py - my) <= 10) return i;
    }
    return null;
  };

  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;

    if (placing) {
      const x = parseFloat(((mx - CENTER) / PX_PER_MM).toFixed(1));
      const y = parseFloat(((my - CENTER) / PX_PER_MM).toFixed(1));
      const pocket = defaultPocket(x, y);
      onChange([...value, pocket]);
      setSelected(value.length);
      setPlacing(false);
      return;
    }

    const hit = hitTest(mx, my);
    setSelected(hit);
    if (hit !== null) dragging.current = hit;
  };

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (dragging.current === null) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    const x = parseFloat(((mx - CENTER) / PX_PER_MM).toFixed(1));
    const y = parseFloat(((my - CENTER) / PX_PER_MM).toFixed(1));
    onChange(value.map((p, i) => i === dragging.current ? { ...p, position: { x, y } } : p));
  };

  const onMouseUp = () => { dragging.current = null; };

  const update = (idx: number, patch: Partial<PartPocket>) => {
    onChange(value.map((p, i) => i === idx ? { ...p, ...patch } : p));
  };

  const remove = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx));
    if (selected === idx) setSelected(null);
    else if (selected !== null && selected > idx) setSelected(selected - 1);
  };

  const sel = selected !== null ? value[selected] : null;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="text-[12px] text-theme-muted">Pockets ({value.length})</div>
        <button
          onClick={() => setPlacing((p) => !p)}
          className="px-3 py-1 text-[11px] rounded-[6px] cursor-pointer border"
          style={{
            background: placing ? C.blue : C.bg3,
            color: placing ? "#fff" : C.muted,
            border: `1px solid ${placing ? C.blue : C.border}`,
          }}
        >
          {placing ? "Click canvas to place…" : "+ Place Pocket"}
        </button>
      </div>

      <div className="flex gap-3.5 items-start">
        {/* Canvas */}
        <div>
          <canvas
            ref={canvasRef}
            width={CANVAS_SIZE}
            height={CANVAS_SIZE}
            className={`rounded-[8px] border border-border-c ${placing ? "cursor-crosshair" : "cursor-pointer"}`}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
          />
          <div className="text-[10px] text-theme-faint mt-1 text-center">
            Click to place · Drag to reposition
          </div>
        </div>

        {/* List + selected editor */}
        <div className="flex-1 flex flex-col gap-2 min-w-[180px]">
          {/* List */}
          <div className="max-h-[120px] overflow-y-auto flex flex-col gap-1">
            {value.map((p, i) => (
              <div
                key={i}
                onClick={() => setSelected(selected === i ? null : i)}
                className="rounded-[6px] px-2.5 py-[5px] cursor-pointer flex items-center gap-2 text-[11px]"
                style={{
                  background: selected === i ? alpha(C.blue, 0.09) : C.bg2,
                  border: `1px solid ${selected === i ? alpha(C.blue, 0.33) : C.border}`,
                }}
              >
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: p.ballMaterial === "metal" ? C.muted : C.yellow }} />
                <span className="flex-1 text-theme-text">
                  #{i + 1} — {p.ballMaterial} {p.size} @ ({p.position.x},{p.position.y}) h={p.height}mm
                </span>
                <button onClick={(e) => { e.stopPropagation(); remove(i); }} className="bg-transparent border-none text-theme-red text-[13px] cursor-pointer">×</button>
              </div>
            ))}
            {value.length === 0 && (
              <div className="text-[11px] text-theme-faint">No pockets. Add balls to shift the center of mass.</div>
            )}
          </div>

          {/* Selected pocket editor */}
          {sel !== null && selected !== null && (
            <div className="bg-bg2 border border-border-c rounded-[8px] px-3 py-2.5 flex flex-col gap-2">
              <div className="text-[11px] font-semibold text-theme-text">Pocket #{selected + 1}</div>

              <Row label="Height (mm)">
                <input type="number" min={0} max={80} step={1} value={sel.height}
                  onChange={(e) => update(selected, { height: +e.target.value })}
                  className="w-16 px-1.5 py-[3px] bg-[#1e293b] border border-[#334155] rounded-[5px] text-[#f1f5f9] text-[11px]" />
              </Row>

              <Row label="Size">
                {(["small", "large"] as const).map((s) => (
                  <Chip key={s} active={sel.size === s} onClick={() => update(selected, { size: s })}>{s}</Chip>
                ))}
              </Row>

              <Row label="Shape">
                {(["round", "oval", "channel", "arc"] as const).map((s) => (
                  <Chip key={s} active={sel.shape === s} onClick={() => update(selected, { shape: s })}>{s}</Chip>
                ))}
              </Row>

              <Row label="Material">
                {(["metal", "plastic"] as const).map((m) => (
                  <Chip key={m} active={sel.ballMaterial === m} onClick={() => update(selected, { ballMaterial: m })}>{m}</Chip>
                ))}
              </Row>

              <Row label="Ball count">
                <input type="number" min={1} max={20} value={sel.ballCount}
                  onChange={(e) => update(selected, { ballCount: +e.target.value })}
                  className="w-16 px-1.5 py-[3px] bg-[#1e293b] border border-[#334155] rounded-[5px] text-[#f1f5f9] text-[11px]" />
              </Row>

              <Row label="Fixed">
                <input type="checkbox" checked={sel.fixed}
                  onChange={(e) => update(selected, { fixed: e.target.checked })}
                  className="accent-theme-blue" />
                <span className="text-[11px] text-theme-faint">fixed (unchecked = moves with centrifugal force)</span>
              </Row>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-[#64748b] w-[72px] shrink-0">{label}</span>
      <div className="flex gap-1 flex-wrap items-center">{children}</div>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{
      padding: "2px 8px", fontSize: 10, borderRadius: 4, cursor: "pointer",
      background: active ? alpha(C.blue, 0.13) : C.bg2,
      color: active ? C.blue : C.faint,
      border: `1px solid ${active ? alpha(C.blue, 0.27) : C.border}`,
    }}>
      {children}
    </button>
  );
}

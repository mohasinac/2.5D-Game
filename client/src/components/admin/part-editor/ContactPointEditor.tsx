/**
 * ContactPointEditor — full SystemContactPoint CRUD with canvas placement.
 *
 * Canvas (TopDownView-lite):
 *   • Dashed concentric ring grid every 5mm
 *   • Each CP rendered as a colored filled annular sector
 *   • Click on canvas → places a new CP at that angle + radius
 *   • Click on an arc → selects it for field editing
 *   • Drag selected endpoint arc to change angle
 *
 * Fields:
 *   angle, width, radius, thickness (geometry)
 *   material, attackType, spinBehavior (physics)
 *   extends + extendedRadius/Width/Thickness (gimmick)
 *   heightRange, damageMultiplier
 *   roller (optional)
 */

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { HEX } from "@/styles/theme";
import { SearchableSelect } from "@/components/admin/SearchableSelect";
import { MaterialSelector } from "./MaterialSelector";
import { PartSelfRotationSection } from "./PartSelfRotationSection";
import { renderRadius, synthesizeRadialCache } from "@/types/beybladeSystem";
import type {
  SystemContactPoint,
  Material,
  AttackType,
  PartLayer,
  FourierRadialProfile,
  PartSelfRotation,
} from "@/types/beybladeSystem";
import { usePartMaterials } from "@/hooks/usePartMaterials";
import { useAttackTypeDefs } from "@/hooks/useAttackTypeDefs";
import { usePartLayerDefs } from "@/hooks/usePartLayerDefs";

const CANVAS_SIZE = 280;
const CENTER = CANVAS_SIZE / 2;
const PIXELS_PER_MM = 3.5;

// Fallback colors used when Firebase part_materials docs don't have a color field
const FALLBACK_MATERIAL_COLORS: Record<string, string> = {
  abs: "#3b82f6",
  rubber: "#22c55e",
  metal: "#94a3b8",
  nylon: "#d4d4d8",
  pc: "#c084fc",
  pom: "#eab308",
  polycarbonate: "#a855f7",
};

const FALLBACK_ATTACK_LABELS: AttackType[] = ["smash", "upper", "absorb", "burst", "spin_steal"];
const FALLBACK_LAYER_LABELS: PartLayer[] = ["ar", "wd", "casing", "tip", "core", "sub_part", "bit_beast"];

function defaultCP(angle: number, radius: number): SystemContactPoint {
  return {
    angle,
    width: 30,
    radius,
    thickness: 2,
    extends: false,
    extendThreshold: 0.7,
    extendedRadius: radius + 3,
    extendedWidth: 40,
    extendedThickness: 3,
    heightRange: { min: 24, max: 46 },
    material: "abs",
    attackType: "smash",
    spinBehavior: { rightPin: "smash", leftPin: "upper" },
    damageMultiplier: 1.0,
    partLayer: "ar",
    weightFactor: 1.0,
  };
}

/** Effective volume proxy for a CP used to suggest weight distribution. */
function cpVolumeProxy(cp: SystemContactPoint): number {
  const arcDeg = cp.arcEnd !== undefined && cp.arcStart !== undefined
    ? Math.abs(cp.arcEnd - cp.arcStart)
    : cp.width;
  const t = cp.lineThickness ?? cp.thickness;
  const r = cp.radius;
  return Math.max(0.01, r * t * arcDeg);
}

/** Distribute weight factors proportionally to each CP's volume proxy. */
function autoWeightFactors(cps: SystemContactPoint[]): SystemContactPoint[] {
  const volumes = cps.map(cpVolumeProxy);
  const total = volumes.reduce((s, v) => s + v, 0);
  return cps.map((cp, i) => ({ ...cp, weightFactor: parseFloat(((volumes[i] / total) * cps.length).toFixed(3)) }));
}

/** Actual weight share % for a single CP. */
function cpWeightPct(cp: SystemContactPoint, allCps: SystemContactPoint[]): number {
  const wf = (c: SystemContactPoint) => c.weightFactor ?? 1.0;
  const total = allCps.reduce((s, c) => s + wf(c), 0);
  return total === 0 ? 0 : (wf(cp) / total) * 100;
}

// ── Canvas renderer ────────────────────────────────────────────────────────────

function drawCanvas(
  ctx: CanvasRenderingContext2D,
  cps: SystemContactPoint[],
  selected: number | null,
  placing: boolean,
  fourierProfile?: FourierRadialProfile,
  materialColors?: Record<string, string>
) {
  ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  ctx.fillStyle = HEX.bg3;
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  // Concentric ring grid every 5mm
  ctx.strokeStyle = HEX.border;
  ctx.lineWidth = 0.4;
  ctx.setLineDash([3, 4]);
  for (let r = 5; r <= 50; r += 5) {
    ctx.beginPath();
    ctx.arc(CENTER, CENTER, r * PIXELS_PER_MM, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = HEX.faint;
    ctx.font = "8px sans-serif";
    ctx.fillText(`${r}`, CENTER + r * PIXELS_PER_MM + 2, CENTER - 2);
  }
  ctx.setLineDash([]);

  // Base shape from Fourier profile (faint grey fill)
  if (fourierProfile?.radialCache?.length === 360) {
    const cache = fourierProfile.radialCache;
    ctx.beginPath();
    for (let deg = 0; deg < 360; deg++) {
      const rad = (deg * Math.PI) / 180;
      const r = cache[deg] * PIXELS_PER_MM;
      const x = CENTER + r * Math.cos(rad), y = CENTER + r * Math.sin(rad);
      deg === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = "#ffffff0a";
    ctx.fill();
    ctx.strokeStyle = "#ffffff22";
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }

  // Contact point annular sectors
  const totalWeight = cps.reduce((s, cp) => s + (cp.weightFactor ?? 1.0), 0);
  cps.forEach((cp, i) => {
    const isSelected = selected === i;
    const color = (materialColors ?? FALLBACK_MATERIAL_COLORS)[cp.material] ?? "var(--blue)";
    const rInner = (cp.radius - cp.thickness / 2) * PIXELS_PER_MM;
    const rOuter = (cp.radius + cp.thickness / 2) * PIXELS_PER_MM;
    const startAngle = ((cp.angle - cp.width / 2 - 90) * Math.PI) / 180;
    const endAngle   = ((cp.angle + cp.width / 2 - 90) * Math.PI) / 180;

    const wf = cp.weightFactor ?? 1.0;
    const weightShare = cps.length > 0 ? wf / totalWeight : 1 / cps.length;
    const strokeWidth = isSelected
      ? Math.max(1.5, 3 * weightShare * cps.length)
      : Math.max(0.8, 2.5 * weightShare * cps.length);

    ctx.beginPath();
    ctx.arc(CENTER, CENTER, rOuter, startAngle, endAngle);
    ctx.arc(CENTER, CENTER, rInner, endAngle, startAngle, true);
    ctx.closePath();
    ctx.fillStyle = isSelected ? color + "cc" : color + "66";
    ctx.fill();
    ctx.strokeStyle = isSelected ? color : color + "88";
    ctx.lineWidth = strokeWidth;
    ctx.stroke();

    // Weight % label at arc midpoint
    const midAngle = ((cp.angle - 90) * Math.PI) / 180;
    const midR = (rInner + rOuter) / 2;
    const lx = CENTER + midR * Math.cos(midAngle);
    const ly = CENTER + midR * Math.sin(midAngle);
    ctx.fillStyle = isSelected ? "#ffffff" : color;
    ctx.font = `bold ${Math.max(7, Math.round(7 + weightShare * cps.length * 2))}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${Math.round(weightShare * 100)}%`, lx, ly);

    // Extended envelope (dashed)
    if (cp.extends) {
      const extInner = (cp.extendedRadius - cp.extendedThickness / 2) * PIXELS_PER_MM;
      const extOuter = (cp.extendedRadius + cp.extendedThickness / 2) * PIXELS_PER_MM;
      const extStart = ((cp.angle - cp.extendedWidth / 2 - 90) * Math.PI) / 180;
      const extEnd   = ((cp.angle + cp.extendedWidth / 2 - 90) * Math.PI) / 180;
      ctx.beginPath();
      ctx.arc(CENTER, CENTER, extOuter, extStart, extEnd);
      ctx.arc(CENTER, CENTER, extInner, extEnd, extStart, true);
      ctx.closePath();
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = color + "77";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.setLineDash([]);
    }
  });

  // Placing mode cursor hint
  if (placing) {
    ctx.fillStyle = HEX.blue + "33";
    ctx.strokeStyle = HEX.blue;
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(CENTER, CENTER, 20 * PIXELS_PER_MM, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Center crosshair
  ctx.strokeStyle = HEX.faint;
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(CENTER - 8, CENTER); ctx.lineTo(CENTER + 8, CENTER);
  ctx.moveTo(CENTER, CENTER - 8); ctx.lineTo(CENTER, CENTER + 8);
  ctx.stroke();
}

// ── Component ──────────────────────────────────────────────────────────────────

interface Props {
  value: SystemContactPoint[];
  onChange: (cps: SystemContactPoint[]) => void;
  fourierProfile?: FourierRadialProfile;
  outerRadius?: number;
}

export function ContactPointEditor({ value, onChange, fourierProfile, outerRadius = 35 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [placing, setPlacing] = useState(false);

  // Firebase-backed option lists with hardcoded fallbacks
  const { materials } = usePartMaterials();
  const { items: attackTypeDefs } = useAttackTypeDefs();
  const { items: partLayerDefs } = usePartLayerDefs();

  const materialColors = useMemo<Record<string, string>>(() => {
    const base = { ...FALLBACK_MATERIAL_COLORS };
    for (const m of materials) { if (m.color) base[m.id] = m.color; }
    return base;
  }, [materials]);

  const attackLabels = attackTypeDefs.length > 0
    ? attackTypeDefs.map(a => a.id as AttackType)
    : FALLBACK_ATTACK_LABELS;

  const layerLabels = partLayerDefs.length > 0
    ? partLayerDefs.map(l => l.id as PartLayer)
    : FALLBACK_LAYER_LABELS;

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    drawCanvas(ctx, value, selected, placing, fourierProfile, materialColors);
  }, [value, selected, placing, fourierProfile, materialColors]);

  useEffect(() => { redraw(); }, [redraw]);

  const hitTest = (mx: number, my: number): number | null => {
    const dx = mx - CENTER, dy = my - CENTER;
    const clickR = Math.sqrt(dx * dx + dy * dy) / PIXELS_PER_MM;
    let clickAngle = ((Math.atan2(dy, dx) * 180) / Math.PI + 450) % 360;

    for (let i = value.length - 1; i >= 0; i--) {
      const cp = value[i];
      if (Math.abs(clickR - cp.radius) <= cp.thickness / 2 + 2) {
        const diff = Math.abs(((clickAngle - cp.angle + 540) % 360) - 180);
        if (diff <= cp.width / 2 + 5) return i;
      }
    }
    return null;
  };

  const onCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    const dx = mx - CENTER, dy = my - CENTER;
    const r = Math.sqrt(dx * dx + dy * dy) / PIXELS_PER_MM;
    const angle = ((Math.atan2(dy, dx) * 180) / Math.PI + 450) % 360;

    if (placing) {
      const newCP = defaultCP(Math.round(angle), Math.round(r));
      onChange([...value, newCP]);
      setSelected(value.length);
      setPlacing(false);
      return;
    }

    const hit = hitTest(mx, my);
    setSelected(hit);
  };

  const update = (idx: number, patch: Partial<SystemContactPoint>) => {
    onChange(value.map((cp, i) => i === idx ? { ...cp, ...patch } : cp));
  };

  const remove = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx));
    if (selected === idx) setSelected(null);
    else if (selected !== null && selected > idx) setSelected(selected - 1);
  };

  const generate = (count: number) => {
    const step = 360 / count;
    const r = outerRadius;
    onChange(Array.from({ length: count }, (_, i) => defaultCP(Math.round(i * step), r)));
    setSelected(null);
  };

  const sel = selected !== null ? value[selected] : null;

  return (
    <div className="flex gap-4 items-start flex-wrap">
      {/* Left: Canvas + list */}
      <div className="flex flex-col gap-2.5 shrink-0">
        {/* Canvas */}
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className={`rounded-lg border border-border ${placing ? "cursor-crosshair" : "cursor-pointer"}`}
          onClick={onCanvasClick}
        />

        {/* Toolbar */}
        <div className="flex gap-1.5 flex-wrap">
          <button
            onClick={() => setPlacing((p) => !p)}
            className={`px-3 py-1 text-[11px] rounded cursor-pointer border ${placing ? "bg-blue text-white border-blue" : "bg-bg3 text-muted border-border"}`}
          >
            {placing ? "Click canvas to place…" : "+ Place CP"}
          </button>
          <SearchableSelect
            value=""
            options={[2, 3, 4, 5, 6, 8].map((n) => ({ value: String(n), label: `${n} CPs` }))}
            onChange={(v) => { if (v) generate(+v); }}
            emptyLabel="Generate evenly…"
          />
          {value.length > 1 && (
            <button
              onClick={() => onChange(autoWeightFactors(value))}
              title="Set weight factors proportional to each CP's radius × thickness × arc"
              className="px-3 py-1 text-[11px] rounded cursor-pointer bg-bg3 text-muted border border-border"
            >
              Auto-weight
            </button>
          )}
        </div>

        {/* CP list */}
        <div className="max-h-48 overflow-y-auto flex flex-col gap-1">
          {value.map((cp, i) => (
            <div
              key={i}
              onClick={() => setSelected(selected === i ? null : i)}
              className={`border rounded-lg px-2.5 py-1.5 cursor-pointer flex items-center gap-2 ${
                selected === i ? "bg-blue/10 border-blue/30" : "bg-bg2 border-border"
              }`}
            >
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ "--mc": materialColors[cp.material] ?? FALLBACK_MATERIAL_COLORS[cp.material] ?? "var(--blue)", background: "var(--mc)" } as React.CSSProperties}
              />
              <div className="flex-1 text-xs text-text">
                #{i + 1} — {cp.angle}° @ {cp.radius}mm — {cp.material} {cp.attackType}
                <span className="text-[10px] text-faint ml-1.5">
                  {cpWeightPct(cp, value).toFixed(0)}%w
                </span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); remove(i); }}
                className="bg-transparent border-none text-red text-[13px] cursor-pointer"
              >×</button>
            </div>
          ))}
          {value.length === 0 && (
            <div className="text-xs text-faint py-2">
              No contact points. Click "+ Place CP" or "Generate evenly".
            </div>
          )}
        </div>
      </div>

      {/* Right: selected CP fields */}
      {sel !== null && selected !== null && (
        <div className="flex-1 min-w-[260px] flex flex-col gap-3">
          <div className="text-[13px] font-semibold text-text">CP #{selected + 1}</div>

          {/* Geometry — format toggle */}
          {(() => {
            const isArc = sel.arcStart !== undefined || sel.arcEnd !== undefined || sel.lineThickness !== undefined;
            const switchToArc = () => {
              const halfW = sel.width / 2;
              update(selected, {
                arcStart: sel.arcStart ?? Math.round(sel.angle - halfW),
                arcEnd:   sel.arcEnd   ?? Math.round(sel.angle + halfW),
                radiusInner: sel.radiusInner ?? Math.max(0, sel.radius - sel.thickness / 2),
                radiusOuter: sel.radiusOuter ?? sel.radius + sel.thickness / 2,
                lineThickness: sel.lineThickness ?? sel.thickness,
              });
            };
            const switchToLegacy = () => {
              update(selected, { arcStart: undefined, arcEnd: undefined, radiusInner: undefined, radiusOuter: undefined, lineThickness: undefined });
            };
            return (
              <Section label="Geometry">
                {/* Format toggle */}
                <div className="flex gap-1 mb-2">
                  {(["Legacy", "Arc-Segment"] as const).map((fmt) => {
                    const active = fmt === "Arc-Segment" ? isArc : !isArc;
                    return (
                      <button key={fmt} onClick={fmt === "Arc-Segment" ? switchToArc : switchToLegacy}
                        className={`px-2.5 py-1 text-[11px] rounded cursor-pointer border ${active ? "bg-blue/10 text-blue border-blue/30" : "bg-bg2 text-muted border-border"}`}
                      >{fmt}</button>
                    );
                  })}
                </div>

                {isArc ? (
                  <>
                    <SliderField label="Arc Start (°)" value={sel.arcStart ?? 0} min={0} max={360} step={1} onChange={(v) => update(selected, { arcStart: v })} />
                    <SliderField label="Arc End (°)" value={sel.arcEnd ?? 0} min={0} max={360} step={1} onChange={(v) => update(selected, { arcEnd: v })} />
                    <SliderField label="Inner Radius (mm)" value={sel.radiusInner ?? sel.radius - sel.thickness / 2} min={0} max={50} step={0.5} onChange={(v) => update(selected, { radiusInner: v })} />
                    <SliderField label="Outer Radius (mm)" value={sel.radiusOuter ?? sel.radius + sel.thickness / 2} min={1} max={60} step={0.5} onChange={(v) => update(selected, { radiusOuter: v })} />
                    <SliderField label="Line Thickness (mm)" value={sel.lineThickness ?? sel.thickness} min={0.5} max={10} step={0.5} onChange={(v) => update(selected, { lineThickness: v })} />
                    <div>
                      <label className="text-[11px] text-muted block mb-1">Set ID</label>
                      <input type="text" value={sel.setId ?? ""} onChange={(e) => update(selected, { setId: e.target.value.trim() || undefined })}
                        placeholder="(none)" className="px-2 py-1 bg-bg3 border border-border rounded text-text text-[11px] w-full" />
                    </div>
                  </>
                ) : (
                  <>
                    <SliderField label="Angle (°)" value={sel.angle} min={0} max={359} step={1} onChange={(v) => update(selected, { angle: v })} />
                    <SliderField label="Width (°)" value={sel.width} min={5} max={120} step={1} onChange={(v) => update(selected, { width: v })} />
                    <SliderField label="Radius (mm)" value={sel.radius} min={1} max={50} step={0.5} onChange={(v) => update(selected, { radius: v })} />
                    <SliderField label="Thickness (mm)" value={sel.thickness} min={0.5} max={10} step={0.5} onChange={(v) => update(selected, { thickness: v })} />
                    <div>
                      <label className="text-[11px] text-muted block mb-1">Set ID</label>
                      <input type="text" value={sel.setId ?? ""} onChange={(e) => update(selected, { setId: e.target.value.trim() || undefined })}
                        placeholder="(none)" className="px-2 py-1 bg-bg3 border border-border rounded text-text text-[11px] w-full" />
                    </div>
                  </>
                )}
              </Section>
            );
          })()}

          {/* Height range */}
          <Section label="Height Range (mm from floor)">
            <SliderField label="Min height" value={sel.heightRange.min} min={0} max={80} step={1} onChange={(v) => update(selected, { heightRange: { ...sel.heightRange, min: v } })} />
            <SliderField label="Max height" value={sel.heightRange.max} min={0} max={80} step={1} onChange={(v) => update(selected, { heightRange: { ...sel.heightRange, max: v } })} />
          </Section>

          {/* Material + attack type */}
          <Section label="Material">
            <MaterialSelector value={sel.material} onChange={(m) => update(selected, { material: m })} label={undefined} />
          </Section>

          <Section label="Attack Type">
            <div className="flex flex-wrap gap-1.5">
              {attackLabels.map((at) => (
                <button key={at} onClick={() => update(selected, { attackType: at })}
                  className={`px-2.5 py-1 text-[11px] rounded cursor-pointer border ${
                    sel.attackType === at ? "bg-orange/15 text-orange border-orange/40" : "bg-bg2 text-muted border-border"
                  }`}
                >{at}</button>
              ))}
            </div>
          </Section>

          {/* Damage multiplier */}
          <SliderField label="Damage Multiplier" value={sel.damageMultiplier} min={0.5} max={3} step={0.05}
            onChange={(v) => update(selected, { damageMultiplier: parseFloat(v.toFixed(2)) })} />

          {/* Weight factor */}
          <Section label="Weight Factor">
            <div className="text-[11px] text-faint mb-1.5">
              Share of part weight at this contact point.{" "}
              <span className="text-blue">
                {cpWeightPct(sel, value).toFixed(1)}% of total
              </span>
              {" "}({value.length} CPs, equal = {(100 / value.length).toFixed(1)}%)
            </div>
            <SliderField label="Weight factor" value={sel.weightFactor ?? 1.0} min={0.1} max={5} step={0.1}
              onChange={(v) => update(selected, { weightFactor: parseFloat(v.toFixed(2)) })} />
            <button
              onClick={() => onChange(autoWeightFactors(value))}
              className="mt-1.5 px-2.5 py-1 text-[10px] rounded cursor-pointer bg-bg3 text-muted border border-border">
              Auto-distribute all CPs from thickness
            </button>
          </Section>

          {/* Part layer */}
          <Section label="Part Layer">
            <div className="flex flex-wrap gap-1">
              {layerLabels.map((l) => (
                <button key={l} onClick={() => update(selected, { partLayer: l })}
                  className={`px-2 py-1 text-[10px] rounded cursor-pointer border ${
                    sel.partLayer === l ? "bg-purple/15 text-purple border-purple/30" : "bg-bg2 text-faint border-border"
                  }`}
                >{l}</button>
              ))}
            </div>
          </Section>

          {/* Spin behavior */}
          <Section label="Spin Behavior">
            <div className="flex gap-3">
              <div className="flex-1">
                <div className="text-[11px] text-muted mb-1">Right-spin (↻)</div>
                <SearchableSelect
                  value={sel.spinBehavior.rightPin}
                  options={attackLabels.map((a) => ({ value: a, label: a }))}
                  onChange={(v) => update(selected, { spinBehavior: { ...sel.spinBehavior, rightPin: v as AttackType } })}
                />
              </div>
              <div className="flex-1">
                <div className="text-[11px] text-muted mb-1">Left-spin (↺)</div>
                <SearchableSelect
                  value={sel.spinBehavior.leftPin}
                  options={attackLabels.map((a) => ({ value: a, label: a }))}
                  onChange={(v) => update(selected, { spinBehavior: { ...sel.spinBehavior, leftPin: v as AttackType } })}
                />
              </div>
            </div>
          </Section>

          {/* Extends gimmick */}
          <Section label="Extends at High Spin">
            <label className="flex gap-2 items-center cursor-pointer">
              <input type="checkbox" checked={sel.extends} onChange={(e) => update(selected, { extends: e.target.checked })} className="accent-blue" />
              <span className="text-xs text-muted">Enable extension gimmick</span>
            </label>
            {sel.extends && (
              <div className="mt-2 flex flex-col gap-2">
                <SliderField label="Extend threshold (fraction of maxSpin)" value={sel.extendThreshold} min={0} max={1} step={0.05}
                  onChange={(v) => update(selected, { extendThreshold: parseFloat(v.toFixed(2)) })} />
                <SliderField label="Extended radius (mm)" value={sel.extendedRadius} min={1} max={60} step={0.5}
                  onChange={(v) => update(selected, { extendedRadius: v })} />
                <SliderField label="Extended width (°)" value={sel.extendedWidth} min={5} max={120} step={1}
                  onChange={(v) => update(selected, { extendedWidth: v })} />
                <SliderField label="Extended thickness (mm)" value={sel.extendedThickness} min={0.5} max={10} step={0.5}
                  onChange={(v) => update(selected, { extendedThickness: v })} />
              </div>
            )}
          </Section>

          {/* Roller Wheel */}
          <Section label="Roller Wheel">
            <label className="flex gap-2 items-center cursor-pointer mb-2">
              <input type="checkbox" checked={!!(sel as any).roller}
                onChange={(e) => update(selected, { roller: e.target.checked ? { radius: 3, material: "rubber", freeSpin: false } : undefined } as any)}
                className="accent-blue" />
              <span className="text-xs text-muted">Has roller wheel</span>
            </label>
            {(sel as any).roller && (
              <div className="flex flex-col gap-2 pl-1">
                <SliderField label="Radius (mm)" value={(sel as any).roller.radius ?? 3} min={0.5} max={15} step={0.5}
                  onChange={(v) => update(selected, { roller: { ...(sel as any).roller, radius: v } } as any)} />
                <div>
                  <div className="text-[11px] text-muted mb-1.5 font-semibold">Material</div>
                  <MaterialSelector value={(sel as any).roller.material ?? "rubber"}
                    onChange={(m) => update(selected, { roller: { ...(sel as any).roller, material: m } } as any)} label={undefined} />
                </div>
                <label className="flex gap-2 items-center cursor-pointer">
                  <input type="checkbox" checked={!!(sel as any).roller.freeSpin}
                    onChange={(e) => update(selected, { roller: { ...(sel as any).roller, freeSpin: e.target.checked } } as any)}
                    className="accent-blue" />
                  <span className="text-xs text-muted">Free spin roller</span>
                </label>
              </div>
            )}
          </Section>

          {/* Contact-point self-rotation (motor-driven, independent of bey spin axis) */}
          <PartSelfRotationSection
            heading="Contact Point Self-Rotation"
            value={(sel.selfRotation as PartSelfRotation | undefined) ?? null}
            onChange={(sr) => update(selected, { selfRotation: sr ?? undefined })}
          />
        </div>
      )}
    </div>
  );
}

// ── Small helpers ──────────────────────────────────────────────────────────────

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] text-muted mb-1.5 font-semibold uppercase tracking-wider">{label}</div>
      {children}
    </div>
  );
}

function SliderField({ label, value, min, max, step, onChange }: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex justify-between text-[11px]">
        <span className="text-muted">{label}</span>
        <span className="text-text font-mono">{value}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(+e.target.value)}
        className="w-full accent-blue"
      />
    </div>
  );
}

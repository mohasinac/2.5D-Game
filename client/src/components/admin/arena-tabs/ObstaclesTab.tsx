import { useState } from "react";
import { cn } from "@/lib/cn";
import { CollapsibleSection } from "@/components/admin/CollapsibleSection";
import { PX_PER_CM_BASE } from "@/constants/units";
import type {
  ArenaConfig, ObstacleConfig, ObstacleShape, ObstaclePhysicsBlock, ObstaclePhysicsType,
  ObstacleRenderMode,
} from "@/types/arenaConfigNew";
import { OBSTACLE_ICONS } from "@/types/arenaConfigNew";
import SelfRotationPanel from "./SelfRotationPanel";
import RotationBlockEditor from "./RotationBlockEditor";
import FeatureAnimationPanel from "./FeatureAnimationPanel";
import { SearchableSelect } from "@/components/admin/SearchableSelect";
import { useAssetLibrary } from "@/hooks/useAssetLibrary";
import { useElementTypes } from "@/hooks/useElementTypes";
import { COLLECTIONS } from "@/lib/firebase";

interface Props {
  config: ArenaConfig;
  onChange: (updated: Partial<ArenaConfig>) => void;
}

function makeId() { return Math.floor(Date.now() % 1000000); }

const DEFAULT: Omit<ObstacleConfig, "id"> = {
  x: 0, y: 0, radius: 25, health: 3, damage: 15, recoilDistance: 40,
};

const SLIDER_FIELDS: { field: keyof ObstacleConfig; label: string; min: number; max: number; step: number; pxUnit?: true }[] = [
  { field: "x", label: "X (cm from center)", min: -500, max: 500, step: 10, pxUnit: true },
  { field: "y", label: "Y (cm from center)", min: -500, max: 500, step: 10, pxUnit: true },
  { field: "radius", label: "Radius (cm)", min: 10, max: 80, step: 5, pxUnit: true },
  { field: "health", label: "Health (hits)", min: 1, max: 10, step: 1 },
  { field: "damage", label: "Collision Damage", min: 5, max: 50, step: 5 },
  { field: "recoilDistance", label: "Recoil Distance (cm)", min: 0, max: 150, step: 10, pxUnit: true },
];

const SHAPE_KINDS: ObstacleShape["kind"][] = [
  "circle", "ring", "arc", "spiral", "polyline", "bezier",
  "rectangle", "cross", "L_shape", "T_shape", "zigzag",
  "star_shape", "pinball_bumper", "wrecking_ball",
];

const PHYSICS_TYPES: ObstaclePhysicsType[] = [
  "wall", "bump", "ramp", "ledge", "ridge", "grip", "speedline",
  "magnetic", "trampoline", "spinner", "crusher", "electrified", "sticky", "bouncy_net",
];

function numInput(val: number | undefined, def: number, onChange: (n: number) => void, step = 1, _width = 80) {
  return (
    <input
      type="number" value={val ?? def} step={step}
      onChange={e => onChange(Number(e.target.value))}
      className="w-20 bg-bg1 border border-border-c text-theme-text rounded-md py-1 px-2 text-xs"
    />
  );
}

function SectionHeader({ label, open, toggle }: { label: string; open: boolean; toggle: () => void }) {
  return (
    <div onClick={toggle} className="flex justify-between items-center cursor-pointer py-1.5 border-b border-border mb-2">
      <span className="text-[11px] font-semibold text-muted">{label}</span>
      <span className="text-faint text-[11px]">{open ? "▲" : "▼"}</span>
    </div>
  );
}

function ShapeEditor({ shape, onChange }: { shape?: ObstacleShape; onChange: (s?: ObstacleShape) => void }) {
  const kind = shape?.kind ?? "circle";

  function setKind(k: ObstacleShape["kind"]) {
    const defaults: Record<string, ObstacleShape> = {
      circle:        { kind: "circle", radiusCm: 10 },
      ring:          { kind: "ring", innerRadiusCm: 8, outerRadiusCm: 15 },
      arc:           { kind: "arc", radiusCm: 12, startDeg: 0, endDeg: 180, thicknessCm: 2 },
      spiral:        { kind: "spiral", innerRadiusCm: 5, outerRadiusCm: 15, turns: 2, thicknessCm: 2 },
      polyline:      { kind: "polyline", points: [{ x_cm: -10, y_cm: 0 }, { x_cm: 10, y_cm: 0 }], thicknessCm: 2, closed: false },
      bezier:        { kind: "bezier", controlPoints: [{ x_cm: -10, y_cm: 0 }, { x_cm: 0, y_cm: -10 }, { x_cm: 10, y_cm: 0 }], thicknessCm: 2 },
      rectangle:     { kind: "rectangle", widthCm: 20, heightCm: 10 },
      cross:         { kind: "cross", armLengthCm: 15, armWidthCm: 4 },
      L_shape:       { kind: "L_shape", longArmCm: 20, shortArmCm: 12, thicknessCm: 3 },
      T_shape:       { kind: "T_shape", widthCm: 20, heightCm: 12, thicknessCm: 3 },
      zigzag:        { kind: "zigzag", segmentLengthCm: 8, segmentCount: 4, zigWidthCm: 4, thicknessCm: 2 },
      star_shape:    { kind: "star_shape", outerRadiusCm: 12, innerRadiusCm: 5, points: 5 },
      pinball_bumper:{ kind: "pinball_bumper", radiusCm: 8 },
      wrecking_ball: { kind: "wrecking_ball", radiusCm: 6, cableLength: 20, swingAmplitudeDeg: 45, swingPeriodMs: 3000 },
    };
    onChange(defaults[k]);
  }

  function patch(delta: Partial<any>) { onChange({ ...shape, ...delta } as ObstacleShape); }

  const addPoint = (field: "points" | "controlPoints") => {
    const arr = (shape as any)?.[field] ?? [];
    patch({ [field]: [...arr, { x_cm: 0, y_cm: 0 }] });
  };
  const removePoint = (field: "points" | "controlPoints", i: number) => {
    const arr = [...((shape as any)?.[field] ?? [])];
    arr.splice(i, 1);
    patch({ [field]: arr });
  };
  const patchPoint = (field: "points" | "controlPoints", i: number, axis: "x_cm" | "y_cm", v: number) => {
    const arr = [...((shape as any)?.[field] ?? [])];
    arr[i] = { ...arr[i], [axis]: v };
    patch({ [field]: arr });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-1 flex-wrap">
        {SHAPE_KINDS.map(k => (
          <button key={k} onClick={() => setKind(k)}
            className={cn("py-[2px] px-[7px] rounded text-[10px] cursor-pointer border transition-colors", kind === k ? "bg-theme-blue text-white border-theme-blue" : "bg-transparent text-theme-muted border-border-c hover:border-theme-blue")}>
            {k}
          </button>
        ))}
      </div>
      {/* Per-kind params */}
      {shape?.kind === "circle" && (
        <div className="flex items-center gap-2">
          <label className="text-[11px] text-faint min-w-[70px]">Radius (cm)</label>
          {numInput(shape.radiusCm, 10, v => patch({ radiusCm: v }), 0.5)}
        </div>
      )}
      {shape?.kind === "ring" && (
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <label className="text-[11px] text-faint min-w-[70px]">Inner (cm)</label>
            {numInput(shape.innerRadiusCm, 8, v => patch({ innerRadiusCm: v }), 0.5)}
          </div>
          <div className="flex items-center gap-2">
            <label className="text-[11px] text-faint min-w-[70px]">Outer (cm)</label>
            {numInput(shape.outerRadiusCm, 15, v => patch({ outerRadiusCm: v }), 0.5)}
          </div>
        </div>
      )}
      {shape?.kind === "arc" && (
        <div className="grid grid-cols-4 gap-2">
          <div><label className="block text-[11px] text-faint mb-0.5">Radius (cm)</label>{numInput(shape.radiusCm, 12, v => patch({ radiusCm: v }), 0.5)}</div>
          <div><label className="block text-[11px] text-faint mb-0.5">Start (°)</label>{numInput(shape.startDeg, 0, v => patch({ startDeg: v }), 5)}</div>
          <div><label className="block text-[11px] text-faint mb-0.5">End (°)</label>{numInput(shape.endDeg, 180, v => patch({ endDeg: v }), 5)}</div>
          <div><label className="block text-[11px] text-faint mb-0.5">Thickness (cm)</label>{numInput(shape.thicknessCm, 2, v => patch({ thicknessCm: v }), 0.5)}</div>
        </div>
      )}
      {shape?.kind === "spiral" && (
        <div className="grid grid-cols-4 gap-2">
          <div><label className="block text-[11px] text-faint mb-0.5">Inner (cm)</label>{numInput(shape.innerRadiusCm, 5, v => patch({ innerRadiusCm: v }), 0.5)}</div>
          <div><label className="block text-[11px] text-faint mb-0.5">Outer (cm)</label>{numInput(shape.outerRadiusCm, 15, v => patch({ outerRadiusCm: v }), 0.5)}</div>
          <div><label className="block text-[11px] text-faint mb-0.5">Turns</label>{numInput(shape.turns, 2, v => patch({ turns: v }), 0.5)}</div>
          <div><label className="block text-[11px] text-faint mb-0.5">Thickness (cm)</label>{numInput(shape.thicknessCm, 2, v => patch({ thicknessCm: v }), 0.5)}</div>
        </div>
      )}
      {shape?.kind === "polyline" && (
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-[11px] text-faint">Points</label>
            <button onClick={() => addPoint("points")}
              className="text-[10px] py-[1px] px-1.5 bg-blue text-white border-none rounded cursor-pointer">+ Point</button>
          </div>
          {shape.points.map((pt, i) => (
            <div key={i} className="flex gap-1.5 items-center mb-1">
              <label className="text-[10px] text-faint min-w-[14px]">X</label>
              {numInput(pt.x_cm, 0, v => patchPoint("points", i, "x_cm", v), 1, 60)}
              <label className="text-[10px] text-faint min-w-[14px]">Y</label>
              {numInput(pt.y_cm, 0, v => patchPoint("points", i, "y_cm", v), 1, 60)}
              <button onClick={() => removePoint("points", i)} className="text-red bg-transparent border-none text-[11px] cursor-pointer">✕</button>
            </div>
          ))}
          <div className="flex items-center gap-3 mt-1">
            <label className="text-[11px] text-faint min-w-[70px]">Thickness (cm)</label>
            {numInput(shape.thicknessCm, 2, v => patch({ thicknessCm: v }), 0.5)}
            <label className="flex items-center gap-1 text-[11px] text-faint cursor-pointer">
              <input type="checkbox" checked={shape.closed} onChange={e => patch({ closed: e.target.checked })} />
              Closed
            </label>
          </div>
        </div>
      )}
      {shape?.kind === "bezier" && (
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-[11px] text-faint">Control Points</label>
            <button onClick={() => addPoint("controlPoints")}
              className="text-[10px] py-[1px] px-1.5 bg-blue text-white border-none rounded cursor-pointer">+ Point</button>
          </div>
          {shape.controlPoints.map((pt, i) => (
            <div key={i} className="flex gap-1.5 items-center mb-1">
              <label className="text-[10px] text-faint min-w-[14px]">X</label>
              {numInput(pt.x_cm, 0, v => patchPoint("controlPoints", i, "x_cm", v), 1, 60)}
              <label className="text-[10px] text-faint min-w-[14px]">Y</label>
              {numInput(pt.y_cm, 0, v => patchPoint("controlPoints", i, "y_cm", v), 1, 60)}
              <button onClick={() => removePoint("controlPoints", i)} className="text-red bg-transparent border-none text-[11px] cursor-pointer">✕</button>
            </div>
          ))}
          <div className="flex items-center gap-2 mt-1">
            <label className="text-[11px] text-faint min-w-[70px]">Thickness (cm)</label>
            {numInput(shape.thicknessCm, 2, v => patch({ thicknessCm: v }), 0.5)}
          </div>
        </div>
      )}
      {shape?.kind === "rectangle" && (
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <label className="text-[11px] text-faint min-w-[55px]">Width (cm)</label>
            {numInput(shape.widthCm, 20, v => patch({ widthCm: v }), 0.5)}
          </div>
          <div className="flex items-center gap-2">
            <label className="text-[11px] text-faint min-w-[58px]">Height (cm)</label>
            {numInput(shape.heightCm, 10, v => patch({ heightCm: v }), 0.5)}
          </div>
        </div>
      )}
      {shape?.kind === "cross" && (
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <label className="text-[11px] text-faint min-w-[70px]">Arm Length (cm)</label>
            {numInput(shape.armLengthCm, 15, v => patch({ armLengthCm: v }), 0.5)}
          </div>
          <div className="flex items-center gap-2">
            <label className="text-[11px] text-faint min-w-[70px]">Arm Width (cm)</label>
            {numInput(shape.armWidthCm, 4, v => patch({ armWidthCm: v }), 0.5)}
          </div>
        </div>
      )}
      {shape?.kind === "L_shape" && (
        <div className="grid grid-cols-3 gap-2">
          <div><label className="block text-[11px] text-faint mb-0.5">Long Arm (cm)</label>{numInput(shape.longArmCm, 20, v => patch({ longArmCm: v }), 0.5)}</div>
          <div><label className="block text-[11px] text-faint mb-0.5">Short Arm (cm)</label>{numInput(shape.shortArmCm, 12, v => patch({ shortArmCm: v }), 0.5)}</div>
          <div><label className="block text-[11px] text-faint mb-0.5">Thickness (cm)</label>{numInput(shape.thicknessCm, 3, v => patch({ thicknessCm: v }), 0.5)}</div>
        </div>
      )}
      {shape?.kind === "T_shape" && (
        <div className="grid grid-cols-3 gap-2">
          <div><label className="block text-[11px] text-faint mb-0.5">Width (cm)</label>{numInput(shape.widthCm, 20, v => patch({ widthCm: v }), 0.5)}</div>
          <div><label className="block text-[11px] text-faint mb-0.5">Height (cm)</label>{numInput(shape.heightCm, 12, v => patch({ heightCm: v }), 0.5)}</div>
          <div><label className="block text-[11px] text-faint mb-0.5">Thickness (cm)</label>{numInput(shape.thicknessCm, 3, v => patch({ thicknessCm: v }), 0.5)}</div>
        </div>
      )}
      {shape?.kind === "zigzag" && (
        <div className="grid grid-cols-4 gap-2">
          <div><label className="block text-[11px] text-faint mb-0.5">Seg Length (cm)</label>{numInput(shape.segmentLengthCm, 8, v => patch({ segmentLengthCm: v }), 0.5)}</div>
          <div><label className="block text-[11px] text-faint mb-0.5">Seg Count</label>{numInput(shape.segmentCount, 4, v => patch({ segmentCount: Math.max(1, Math.round(v)) }), 1)}</div>
          <div><label className="block text-[11px] text-faint mb-0.5">Zig Width (cm)</label>{numInput(shape.zigWidthCm, 4, v => patch({ zigWidthCm: v }), 0.5)}</div>
          <div><label className="block text-[11px] text-faint mb-0.5">Thickness (cm)</label>{numInput(shape.thicknessCm, 2, v => patch({ thicknessCm: v }), 0.5)}</div>
        </div>
      )}
      {shape?.kind === "star_shape" && (
        <div className="grid grid-cols-3 gap-2">
          <div><label className="block text-[11px] text-faint mb-0.5">Outer (cm)</label>{numInput(shape.outerRadiusCm, 12, v => patch({ outerRadiusCm: v }), 0.5)}</div>
          <div><label className="block text-[11px] text-faint mb-0.5">Inner (cm)</label>{numInput(shape.innerRadiusCm, 5, v => patch({ innerRadiusCm: v }), 0.5)}</div>
          <div><label className="block text-[11px] text-faint mb-0.5">Points (3–8)</label>{numInput(shape.points, 5, v => patch({ points: Math.min(8, Math.max(3, Math.round(v))) }), 1)}</div>
        </div>
      )}
      {shape?.kind === "pinball_bumper" && (
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <label className="text-[11px] text-faint min-w-[55px]">Radius (cm)</label>
            {numInput(shape.radiusCm, 8, v => patch({ radiusCm: v }), 0.5)}
          </div>
          <div className="flex items-center gap-2">
            <label className="text-[11px] text-faint min-w-[65px]">Restitution</label>
            {numInput(shape.restitution, 1.2, v => patch({ restitution: v }), 0.1)}
          </div>
        </div>
      )}
      {shape?.kind === "wrecking_ball" && (
        <div className="grid grid-cols-5 gap-2">
          <div><label className="block text-[11px] text-faint mb-0.5">Radius (cm)</label>{numInput(shape.radiusCm, 6, v => patch({ radiusCm: v }), 0.5)}</div>
          <div><label className="block text-[11px] text-faint mb-0.5">Cable (cm)</label>{numInput(shape.cableLength, 20, v => patch({ cableLength: v }), 1)}</div>
          <div><label className="block text-[11px] text-faint mb-0.5">Swing (°)</label>{numInput(shape.swingAmplitudeDeg, 45, v => patch({ swingAmplitudeDeg: v }), 5)}</div>
          <div><label className="block text-[11px] text-faint mb-0.5">Period (ms)</label>{numInput(shape.swingPeriodMs, 3000, v => patch({ swingPeriodMs: v }), 100)}</div>
          <div><label className="block text-[11px] text-faint mb-0.5">Phase (°)</label>{numInput(shape.startPhaseDeg, 0, v => patch({ startPhaseDeg: v }), 5)}</div>
        </div>
      )}
    </div>
  );
}

function PhysicsEditor({ physics, onChange }: { physics?: ObstaclePhysicsBlock; onChange: (p?: ObstaclePhysicsBlock) => void }) {
  const enabled = !!physics;
  const type = physics?.type ?? "wall";

  function enable() { onChange({ type: "wall", heightCm: 5 }); }
  function disable() { onChange(undefined); }
  function patch(delta: Partial<ObstaclePhysicsBlock>) {
    if (!physics) return;
    onChange({ ...physics, ...delta });
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <label className="flex gap-1.5 items-center text-[11px] text-muted cursor-pointer">
          <input type="checkbox" checked={enabled} onChange={e => e.target.checked ? enable() : disable()} />
          {enabled ? "Enabled" : "Disabled"}
        </label>
      </div>
      {enabled && physics && (
        <>
          <div className="flex gap-1 flex-wrap">
            {PHYSICS_TYPES.map(t => (
              <button key={t} onClick={() => patch({ type: t })}
                className={cn("py-[2px] px-[7px] rounded text-[10px] cursor-pointer border transition-colors", type === t ? "bg-theme-red text-white border-theme-red" : "bg-transparent text-theme-muted border-border-c hover:border-theme-red")}>
                {t}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <label className="text-[11px] text-faint min-w-[65px]">Height (cm)</label>
              {numInput(physics.heightCm, 5, v => patch({ heightCm: v }), 0.5)}
            </div>
            <div>
              <label className="block text-[11px] text-faint mb-1">Direction</label>
              <div className="flex gap-1">
                {(["one-way", "two-way"] as const).map(d => (
                  <button key={d} onClick={() => patch({ direction: d })}
                    className={cn("py-[2px] px-[7px] rounded text-[10px] cursor-pointer border transition-colors", (physics.direction ?? "two-way") === d ? "bg-theme-blue text-white border-theme-blue" : "bg-transparent text-theme-muted border-border-c hover:border-theme-blue")}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {physics.direction === "one-way" && (
            <div className="flex items-center gap-2">
              <label className="text-[11px] text-faint min-w-[90px]">One-Way Angle (°)</label>
              {numInput(physics.oneWayAngleDeg, 0, v => patch({ oneWayAngleDeg: v }), 5)}
            </div>
          )}
          {type === "ramp" && (
            <div className="flex items-center gap-2">
              <label className="text-[11px] text-faint min-w-[90px]">Ramp Angle (°)</label>
              {numInput(physics.rampAngleDeg, 15, v => patch({ rampAngleDeg: v }), 1)}
            </div>
          )}
          {type === "grip" && (
            <div className="flex items-center gap-2">
              <label className="text-[11px] text-faint min-w-[90px]">Grip Friction</label>
              {numInput(physics.gripFriction, 1.5, v => patch({ gripFriction: v }), 0.1)}
            </div>
          )}
          {type === "speedline" && (
            <div className="flex items-center gap-2">
              <label className="text-[11px] text-faint min-w-[90px]">Boost (cm/s)</label>
              {numInput(physics.speedlineBoostCmPerS, 50, v => patch({ speedlineBoostCmPerS: v }), 5)}
            </div>
          )}
          {type === "magnetic" && (
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <label className="text-[11px] text-faint min-w-[80px]">Radius (cm)</label>
                {numInput(physics.magnetRadiusCm, 20, v => patch({ magnetRadiusCm: v }), 1)}
              </div>
              <div className="flex items-center gap-2">
                <label className="text-[11px] text-faint min-w-[60px]">Strength</label>
                {numInput(physics.magnetStrength, 0.01, v => patch({ magnetStrength: v }), 0.001)}
              </div>
            </div>
          )}
          {type === "trampoline" && (
            <div className="flex items-center gap-2">
              <label className="text-[11px] text-faint min-w-[90px]">Boost Mult</label>
              {numInput(physics.trampolineBoost, 1.5, v => patch({ trampolineBoost: v }), 0.1)}
            </div>
          )}
          {type === "spinner" && (
            <div className="flex items-center gap-2">
              <label className="text-[11px] text-faint min-w-[90px]">Spin RPM Impulse</label>
              {numInput(physics.spinRpmImpulse, 100, v => patch({ spinRpmImpulse: v }), 10)}
            </div>
          )}
          {type === "crusher" && (
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] text-faint mb-1">Crush Axis</label>
                <div className="flex gap-1">
                  {(["x", "y"] as const).map(a => (
                    <button key={a} onClick={() => patch({ crushAxis: a })}
                      className={cn("py-[2px] px-2 rounded text-[11px] cursor-pointer border transition-colors", (physics.crushAxis ?? "y") === a ? "bg-theme-blue text-white border-theme-blue" : "bg-transparent text-theme-muted border-border-c hover:border-theme-blue")}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>
              <div><label className="block text-[11px] text-faint mb-0.5">Travel (cm)</label>{numInput(physics.crushTravelCm, 10, v => patch({ crushTravelCm: v }), 1)}</div>
              <div><label className="block text-[11px] text-faint mb-0.5">Cycle (ms)</label>{numInput(physics.crushCyclePeriodMs, 2000, v => patch({ crushCyclePeriodMs: v }), 100)}</div>
            </div>
          )}
          {type === "electrified" && (
            <div className="flex items-center gap-2">
              <label className="text-[11px] text-faint min-w-[90px]">Disable Ticks</label>
              {numInput(physics.disableTicks, 60, v => patch({ disableTicks: Math.round(v) }), 10)}
            </div>
          )}
          {type === "sticky" && (
            <div className="flex items-center gap-2">
              <label className="text-[11px] text-faint min-w-[90px]">Sticky Ticks</label>
              {numInput(physics.stickyDurationTicks, 30, v => patch({ stickyDurationTicks: Math.round(v) }), 5)}
            </div>
          )}
          {type === "bouncy_net" && (
            <div className="flex items-center gap-2">
              <label className="text-[11px] text-faint min-w-[90px]">Restitution</label>
              {numInput(physics.netRestitution, 1.8, v => patch({ netRestitution: v }), 0.1)}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function RenderModeEditor({ render, onChange }: { render?: ObstacleRenderMode; onChange: (r?: ObstacleRenderMode) => void }) {
  const mode = render?.mode ?? "floor";
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-1 items-center">
        <label className="text-[11px] text-faint min-w-[40px]">Mode</label>
        {(["floor", "line"] as const).map(m => (
          <button key={m} onClick={() => onChange(m === "floor" ? { mode: "floor" } : { mode: "line", stroke: "solid" })}
            className={cn("py-[2px] px-2 rounded text-[11px] cursor-pointer border transition-colors", mode === m ? "bg-theme-purple text-white border-theme-purple" : "bg-transparent text-theme-muted border-border-c hover:border-theme-purple")}>
            {m}
          </button>
        ))}
      </div>
      {render?.mode === "line" && (
        <div className="flex gap-3 flex-wrap">
          <div>
            <label className="block text-[11px] text-faint mb-1">Stroke</label>
            <div className="flex gap-1">
              {(["solid", "dashed", "dotted"] as const).map(s => (
                <button key={s} onClick={() => onChange({ ...render, stroke: s })}
                  className={cn("py-[2px] px-1.5 rounded text-[10px] cursor-pointer border transition-colors", render.stroke === s ? "bg-theme-blue text-white border-theme-blue" : "bg-transparent text-theme-muted border-border-c hover:border-theme-blue")}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          {render.stroke !== "solid" && (
            <>
              <div className="flex items-center gap-1.5">
                <label className="text-[11px] text-faint">Dash (cm)</label>
                {numInput(render.dashCm, 2, v => onChange({ ...render, dashCm: v }), 0.5)}
              </div>
              <div className="flex items-center gap-1.5">
                <label className="text-[11px] text-faint">Gap (cm)</label>
                {numInput(render.gapCm, 2, v => onChange({ ...render, gapCm: v }), 0.5)}
              </div>
            </>
          )}
          <div className="flex items-center gap-1.5">
            <label className="text-[11px] text-faint">Color Key</label>
            <input type="text" value={render.colorKey ?? ""} onChange={e => onChange({ ...render, colorKey: e.target.value || undefined })}
              placeholder="e.g. red"
              className="w-[70px] bg-bg1 border border-border text-text rounded py-[3px] px-1.5 text-[11px]" />
          </div>
        </div>
      )}
      {render?.mode === "floor" && (
        <div className="flex gap-3">
          <div className="flex items-center gap-1.5">
            <label className="text-[11px] text-faint">Top Color</label>
            <input type="text" value={render.topColorKey ?? ""} onChange={e => onChange({ ...render, topColorKey: e.target.value || undefined })}
              placeholder="e.g. stone"
              className="w-[70px] bg-bg1 border border-border text-text rounded py-[3px] px-1.5 text-[11px]" />
          </div>
          <div className="flex items-center gap-1.5">
            <label className="text-[11px] text-faint">Side Color</label>
            <input type="text" value={render.sideColorKey ?? ""} onChange={e => onChange({ ...render, sideColorKey: e.target.value || undefined })}
              placeholder="e.g. dark_stone"
              className="w-20 bg-bg1 border border-border text-text rounded py-[3px] px-1.5 text-[11px]" />
          </div>
        </div>
      )}
    </div>
  );
}

export default function ObstaclesTab({ config, onChange }: Props) {
  const items = config.obstacles ?? [];
  const themeIcon = OBSTACLE_ICONS[config.theme as keyof typeof OBSTACLE_ICONS] ?? "🪨";
  const { assets: obstacleAssets, loading: assetsLoading } = useAssetLibrary(COLLECTIONS.OBSTACLE_ASSETS);
  const { configs: elementTypes, loading: elemLoading } = useElementTypes();
  const [openSections, setOpenSections] = useState<Record<string, Record<string, boolean>>>({});
  const assetOpts = obstacleAssets.map(a => ({ value: a.id, label: a.name ?? a.id, hint: a.tags?.join(", ") }));
  const elemOpts = elementTypes.map(e => ({ value: e.id, label: e.name ?? e.id }));

  const toggleSection = (obsId: string | number | undefined, section: string) => {
    const key = String(obsId);
    setOpenSections(prev => ({
      ...prev,
      [key]: { ...prev[key], [section]: !(prev[key]?.[section]) },
    }));
  };
  const isSectionOpen = (obsId: string | number | undefined, section: string) =>
    openSections[String(obsId)]?.[section] ?? false;

  const add = () => {
    if (items.length >= 10) return;
    onChange({ obstacles: [...items, { ...DEFAULT, id: makeId() }] });
  };

  const remove = (id: number | undefined) =>
    onChange({ obstacles: items.filter(o => o.id !== id) });

  const update = (id: number | undefined, field: keyof ObstacleConfig, value: any) =>
    onChange({ obstacles: items.map(o => o.id === id ? { ...o, [field]: value } : o) });

  return (
    <CollapsibleSection title="Obstacles" badge={items.length} storageKey="arena-obstacles-list" defaultOpen={true}>
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <span className="text-[13px] text-muted">{items.length} / 10 obstacles — theme icon: {themeIcon}</span>
        <button onClick={add} disabled={items.length >= 10}
          className={cn("py-[5px] px-[14px] bg-theme-blue text-white border-none rounded-md text-xs font-medium cursor-pointer transition-opacity", items.length >= 10 && "opacity-40")}>
          + Add Obstacle
        </button>
      </div>

      {items.length === 0 && (
        <div className="text-center py-10 text-faint">
          <div className="text-[32px] mb-2">{themeIcon}</div>
          <p>No obstacles yet. Obstacles damage beyblades on collision.</p>
        </div>
      )}

      {items.map((obs, idx) => (
        <div key={obs.id ?? idx} className="bg-bg3 rounded-xl p-4 border border-border">
          {/* Header */}
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-medium text-text">{themeIcon} Obstacle #{idx + 1}</span>
              {obs.behaviorId && (
                <span className="text-[10px] font-semibold py-[2px] px-[7px] rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/30">
                  Behavior: {obs.behaviorId}
                </span>
              )}
            </div>
            <div className="flex gap-2 items-center">
              <label className="flex gap-1.5 items-center text-[11px] text-muted cursor-pointer">
                <input type="checkbox" checked={obs.indestructible ?? false} onChange={e => update(obs.id, "indestructible", e.target.checked)} />
                Indestructible
              </label>
              <button onClick={() => remove(obs.id)} className="text-red bg-transparent border-none text-xs cursor-pointer">Remove</button>
            </div>
          </div>

          {/* Base sliders */}
          <div className="grid grid-cols-3 gap-2.5">
            {SLIDER_FIELDS.map(({ field, label, min, max, step, pxUnit }) => {
              const raw = (obs as any)[field] ?? 0;
              const display = pxUnit ? Math.round(raw / PX_PER_CM_BASE * 10) / 10 : raw;
              return (
                <div key={field}>
                  <div className="flex justify-between text-[11px] text-faint mb-0.5">
                    <span>{label}</span>
                    <span className="text-text font-mono">{pxUnit ? display.toFixed(1) : raw}</span>
                  </div>
                  <input type="range"
                    min={pxUnit ? min / PX_PER_CM_BASE : min}
                    max={pxUnit ? max / PX_PER_CM_BASE : max}
                    step={pxUnit ? 0.5 : step}
                    value={display}
                    onChange={e => update(obs.id, field, pxUnit ? Math.round(+e.target.value * PX_PER_CM_BASE) : +e.target.value)}
                    className="w-full"
                  />
                </div>
              );
            })}
          </div>

          {/* Sprite picker */}
          <div className="mt-3 mb-2.5">
            <label className="block text-[11px] text-faint mb-1">Obstacle Sprite</label>
            <SearchableSelect
              value={(obs as any).spriteId ?? ""}
              options={assetOpts}
              onChange={v => update(obs.id, "spriteId" as any, v || undefined)}
              disabled={assetsLoading}
              emptyLabel={assetsLoading ? "Loading…" : "No obstacle assets found"}
            />
          </div>

          {/* Element type + switch + trigger state */}
          <div className="grid grid-cols-3 gap-2.5 mb-2.5">
            <div>
              <label className="block text-[11px] text-faint mb-1">Element Type</label>
              <SearchableSelect
                value={(obs.elementType as any) ?? ""}
                options={elemOpts}
                onChange={v => update(obs.id, "elementType" as any, v || undefined)}
                disabled={elemLoading}
                emptyLabel={elemLoading ? "Loading…" : "No element types"}
              />
            </div>
            <div>
              <label className="block text-[11px] text-faint mb-1">Controlled By Switch ID</label>
              <input
                type="text"
                value={obs.controlledBySwitchId ?? ""}
                onChange={e => update(obs.id, "controlledBySwitchId", e.target.value || undefined)}
                placeholder="e.g. sw1"
                className="w-full bg-bg2 border border-border text-text rounded-md py-1 px-2 text-xs box-border"
              />
            </div>
            <div>
              <label className="block text-[11px] text-faint mb-1">Initial State</label>
              <SearchableSelect
                value={obs.triggerState ?? "on"}
                options={[{ value: "on", label: "On (active)" }, { value: "off", label: "Off (inactive)" }]}
                onChange={v => update(obs.id, "triggerState", v as "on" | "off")}
              />
            </div>
          </div>

          {/* Floor index */}
          {(config.maxFloors ?? 1) > 1 && (
            <div className="mb-2.5">
              <label className="block text-[11px] text-faint mb-1">Floor Index (0 = ground)</label>
              <input
                type="number" min={0} max={(config.maxFloors ?? 1) - 1} step={1}
                value={obs.floorIndex ?? 0}
                onChange={e => update(obs.id, "floorIndex", Math.max(0, Math.min((config.maxFloors ?? 1) - 1, +e.target.value)))}
                className="w-20 bg-bg2 border border-border text-text rounded-md py-1 px-2 text-xs"
              />
            </div>
          )}

          {/* Shape section */}
          <div className="mb-2 bg-bg2 rounded-lg p-2.5">
            <SectionHeader label="Shape" open={isSectionOpen(obs.id, "shape")} toggle={() => toggleSection(obs.id, "shape")} />
            {isSectionOpen(obs.id, "shape") && (
              <ShapeEditor shape={obs.shape} onChange={v => update(obs.id, "shape", v)} />
            )}
          </div>

          {/* Physics block */}
          <div className="mb-2 bg-bg2 rounded-lg p-2.5">
            <SectionHeader label="Physics Override" open={isSectionOpen(obs.id, "physics")} toggle={() => toggleSection(obs.id, "physics")} />
            {isSectionOpen(obs.id, "physics") && (
              <PhysicsEditor physics={obs.physics} onChange={v => update(obs.id, "physics", v)} />
            )}
          </div>

          {/* Render mode */}
          <div className="mb-2 bg-bg2 rounded-lg p-2.5">
            <SectionHeader label="Render Mode" open={isSectionOpen(obs.id, "render")} toggle={() => toggleSection(obs.id, "render")} />
            {isSectionOpen(obs.id, "render") && (
              <RenderModeEditor render={obs.render} onChange={v => update(obs.id, "render", v)} />
            )}
          </div>

          {/* Feature Animation */}
          <div className="mb-2 bg-bg2 rounded-lg p-2.5">
            <SectionHeader label="Feature Animation" open={isSectionOpen(obs.id, "anim")} toggle={() => toggleSection(obs.id, "anim")} />
            {isSectionOpen(obs.id, "anim") && (
              <FeatureAnimationPanel
                value={obs.featureAnimation}
                onChange={v => update(obs.id, "featureAnimation", v)}
                featureId={String(obs.id ?? idx)}
              />
            )}
          </div>

          {/* Behavior override */}
          <div className="mb-2 grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] text-faint mb-1">Behavior ID (optional)</label>
              <input
                type="text"
                data-testid={`obstacle-behavior-id-${idx}`}
                value={obs.behaviorId ?? ""}
                onChange={e => update(obs.id, "behaviorId", e.target.value || undefined)}
                placeholder="e.g. movement.orbit"
                className="w-full bg-bg2 border border-border text-text rounded-md py-1 px-2 text-xs box-border"
              />
            </div>
            <div>
              <label className="block text-[11px] text-faint mb-1">Behavior Params (JSON)</label>
              <textarea
                value={obs.behaviorParams ? JSON.stringify(obs.behaviorParams, null, 2) : ""}
                onChange={e => {
                  try {
                    const parsed = e.target.value ? JSON.parse(e.target.value) : undefined;
                    update(obs.id, "behaviorParams", parsed);
                  } catch { /* invalid JSON, ignore */ }
                }}
                placeholder='{ "strength": 0.5 }'
                rows={2}
                className="w-full bg-bg2 border border-border text-text rounded-md py-1 px-2 text-[11px] font-mono resize-y box-border"
              />
            </div>
          </div>

          {/* Rotation + Self-Rotation */}
          <RotationBlockEditor
            value={obs.rotation}
            onChange={v => update(obs.id, "rotation", v)}
            label="Base Rotation"
          />
          <SelfRotationPanel
            rotation={obs.rotation?.initialAngleDeg}
            selfRotation={obs.selfRotation}
            onChangeRotation={v => update(obs.id, "rotation", v !== undefined ? { ...(obs.rotation ?? { mode: "static" as const }), initialAngleDeg: v } : undefined)}
            onChangeSelfRotation={v => update(obs.id, "selfRotation", v)}
          />
        </div>
      ))}
    </div>
    </CollapsibleSection>
  );
}

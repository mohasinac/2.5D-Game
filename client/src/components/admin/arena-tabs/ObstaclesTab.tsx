import { useState } from "react";
import { C } from "@/styles/theme";
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

const SLIDER_FIELDS: { field: keyof ObstacleConfig; label: string; min: number; max: number; step: number }[] = [
  { field: "x", label: "X (px from center)", min: -500, max: 500, step: 10 },
  { field: "y", label: "Y (px from center)", min: -500, max: 500, step: 10 },
  { field: "radius", label: "Radius (px)", min: 10, max: 80, step: 5 },
  { field: "health", label: "Health (hits)", min: 1, max: 10, step: 1 },
  { field: "damage", label: "Collision Damage", min: 5, max: 50, step: 5 },
  { field: "recoilDistance", label: "Recoil Distance (px)", min: 0, max: 150, step: 10 },
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

function numInput(val: number | undefined, def: number, onChange: (n: number) => void, step = 1, width = 80) {
  return (
    <input
      type="number" value={val ?? def} step={step}
      onChange={e => onChange(Number(e.target.value))}
      style={{ width, background: C.bg1, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, padding: "4px 8px", fontSize: 12 }}
    />
  );
}

function SectionHeader({ label, open, toggle }: { label: string; open: boolean; toggle: () => void }) {
  return (
    <div onClick={toggle} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", padding: "6px 0", borderBottom: `1px solid ${C.border}`, marginBottom: 8 }}>
      <span style={{ fontSize: 11, fontWeight: 600, color: C.muted }}>{label}</span>
      <span style={{ color: C.faint, fontSize: 11 }}>{open ? "▲" : "▼"}</span>
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
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        {SHAPE_KINDS.map(k => (
          <button key={k} onClick={() => setKind(k)}
            style={{ padding: "2px 7px", borderRadius: 5, fontSize: 10, cursor: "pointer",
              background: kind === k ? C.blue : "transparent",
              color: kind === k ? C.white : C.muted,
              border: `1px solid ${kind === k ? C.blue : C.border}` }}>
            {k}
          </button>
        ))}
      </div>
      {/* Per-kind params */}
      {shape?.kind === "circle" && (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Radius (cm)</label>
          {numInput(shape.radiusCm, 10, v => patch({ radiusCm: v }), 0.5)}
        </div>
      )}
      {shape?.kind === "ring" && (
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Inner (cm)</label>
            {numInput(shape.innerRadiusCm, 8, v => patch({ innerRadiusCm: v }), 0.5)}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Outer (cm)</label>
            {numInput(shape.outerRadiusCm, 15, v => patch({ outerRadiusCm: v }), 0.5)}
          </div>
        </div>
      )}
      {shape?.kind === "arc" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
          <div><label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 2 }}>Radius (cm)</label>{numInput(shape.radiusCm, 12, v => patch({ radiusCm: v }), 0.5)}</div>
          <div><label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 2 }}>Start (°)</label>{numInput(shape.startDeg, 0, v => patch({ startDeg: v }), 5)}</div>
          <div><label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 2 }}>End (°)</label>{numInput(shape.endDeg, 180, v => patch({ endDeg: v }), 5)}</div>
          <div><label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 2 }}>Thickness (cm)</label>{numInput(shape.thicknessCm, 2, v => patch({ thicknessCm: v }), 0.5)}</div>
        </div>
      )}
      {shape?.kind === "spiral" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
          <div><label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 2 }}>Inner (cm)</label>{numInput(shape.innerRadiusCm, 5, v => patch({ innerRadiusCm: v }), 0.5)}</div>
          <div><label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 2 }}>Outer (cm)</label>{numInput(shape.outerRadiusCm, 15, v => patch({ outerRadiusCm: v }), 0.5)}</div>
          <div><label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 2 }}>Turns</label>{numInput(shape.turns, 2, v => patch({ turns: v }), 0.5)}</div>
          <div><label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 2 }}>Thickness (cm)</label>{numInput(shape.thicknessCm, 2, v => patch({ thicknessCm: v }), 0.5)}</div>
        </div>
      )}
      {shape?.kind === "polyline" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <label style={{ fontSize: 11, color: C.faint }}>Points</label>
            <button onClick={() => addPoint("points")} style={{ fontSize: 10, padding: "1px 6px", background: C.blue, color: C.white, border: "none", borderRadius: 4, cursor: "pointer" }}>+ Point</button>
          </div>
          {shape.points.map((pt, i) => (
            <div key={i} style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 4 }}>
              <label style={{ fontSize: 10, color: C.faint, minWidth: 14 }}>X</label>
              {numInput(pt.x_cm, 0, v => patchPoint("points", i, "x_cm", v), 1, 60)}
              <label style={{ fontSize: 10, color: C.faint, minWidth: 14 }}>Y</label>
              {numInput(pt.y_cm, 0, v => patchPoint("points", i, "y_cm", v), 1, 60)}
              <button onClick={() => removePoint("points", i)} style={{ color: C.red, background: "none", border: "none", fontSize: 11, cursor: "pointer" }}>✕</button>
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 4 }}>
            <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Thickness (cm)</label>
            {numInput(shape.thicknessCm, 2, v => patch({ thicknessCm: v }), 0.5)}
            <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: C.faint, cursor: "pointer" }}>
              <input type="checkbox" checked={shape.closed} onChange={e => patch({ closed: e.target.checked })} />
              Closed
            </label>
          </div>
        </div>
      )}
      {shape?.kind === "bezier" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <label style={{ fontSize: 11, color: C.faint }}>Control Points</label>
            <button onClick={() => addPoint("controlPoints")} style={{ fontSize: 10, padding: "1px 6px", background: C.blue, color: C.white, border: "none", borderRadius: 4, cursor: "pointer" }}>+ Point</button>
          </div>
          {shape.controlPoints.map((pt, i) => (
            <div key={i} style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 4 }}>
              <label style={{ fontSize: 10, color: C.faint, minWidth: 14 }}>X</label>
              {numInput(pt.x_cm, 0, v => patchPoint("controlPoints", i, "x_cm", v), 1, 60)}
              <label style={{ fontSize: 10, color: C.faint, minWidth: 14 }}>Y</label>
              {numInput(pt.y_cm, 0, v => patchPoint("controlPoints", i, "y_cm", v), 1, 60)}
              <button onClick={() => removePoint("controlPoints", i)} style={{ color: C.red, background: "none", border: "none", fontSize: 11, cursor: "pointer" }}>✕</button>
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
            <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Thickness (cm)</label>
            {numInput(shape.thicknessCm, 2, v => patch({ thicknessCm: v }), 0.5)}
          </div>
        </div>
      )}
      {shape?.kind === "rectangle" && (
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <label style={{ fontSize: 11, color: C.faint, minWidth: 55 }}>Width (cm)</label>
            {numInput(shape.widthCm, 20, v => patch({ widthCm: v }), 0.5)}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <label style={{ fontSize: 11, color: C.faint, minWidth: 58 }}>Height (cm)</label>
            {numInput(shape.heightCm, 10, v => patch({ heightCm: v }), 0.5)}
          </div>
        </div>
      )}
      {shape?.kind === "cross" && (
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Arm Length (cm)</label>
            {numInput(shape.armLengthCm, 15, v => patch({ armLengthCm: v }), 0.5)}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <label style={{ fontSize: 11, color: C.faint, minWidth: 70 }}>Arm Width (cm)</label>
            {numInput(shape.armWidthCm, 4, v => patch({ armWidthCm: v }), 0.5)}
          </div>
        </div>
      )}
      {shape?.kind === "L_shape" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          <div><label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 2 }}>Long Arm (cm)</label>{numInput(shape.longArmCm, 20, v => patch({ longArmCm: v }), 0.5)}</div>
          <div><label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 2 }}>Short Arm (cm)</label>{numInput(shape.shortArmCm, 12, v => patch({ shortArmCm: v }), 0.5)}</div>
          <div><label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 2 }}>Thickness (cm)</label>{numInput(shape.thicknessCm, 3, v => patch({ thicknessCm: v }), 0.5)}</div>
        </div>
      )}
      {shape?.kind === "T_shape" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          <div><label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 2 }}>Width (cm)</label>{numInput(shape.widthCm, 20, v => patch({ widthCm: v }), 0.5)}</div>
          <div><label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 2 }}>Height (cm)</label>{numInput(shape.heightCm, 12, v => patch({ heightCm: v }), 0.5)}</div>
          <div><label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 2 }}>Thickness (cm)</label>{numInput(shape.thicknessCm, 3, v => patch({ thicknessCm: v }), 0.5)}</div>
        </div>
      )}
      {shape?.kind === "zigzag" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
          <div><label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 2 }}>Seg Length (cm)</label>{numInput(shape.segmentLengthCm, 8, v => patch({ segmentLengthCm: v }), 0.5)}</div>
          <div><label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 2 }}>Seg Count</label>{numInput(shape.segmentCount, 4, v => patch({ segmentCount: Math.max(1, Math.round(v)) }), 1)}</div>
          <div><label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 2 }}>Zig Width (cm)</label>{numInput(shape.zigWidthCm, 4, v => patch({ zigWidthCm: v }), 0.5)}</div>
          <div><label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 2 }}>Thickness (cm)</label>{numInput(shape.thicknessCm, 2, v => patch({ thicknessCm: v }), 0.5)}</div>
        </div>
      )}
      {shape?.kind === "star_shape" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          <div><label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 2 }}>Outer (cm)</label>{numInput(shape.outerRadiusCm, 12, v => patch({ outerRadiusCm: v }), 0.5)}</div>
          <div><label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 2 }}>Inner (cm)</label>{numInput(shape.innerRadiusCm, 5, v => patch({ innerRadiusCm: v }), 0.5)}</div>
          <div><label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 2 }}>Points (3–8)</label>{numInput(shape.points, 5, v => patch({ points: Math.min(8, Math.max(3, Math.round(v))) }), 1)}</div>
        </div>
      )}
      {shape?.kind === "pinball_bumper" && (
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <label style={{ fontSize: 11, color: C.faint, minWidth: 55 }}>Radius (cm)</label>
            {numInput(shape.radiusCm, 8, v => patch({ radiusCm: v }), 0.5)}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Restitution</label>
            {numInput(shape.restitution, 1.2, v => patch({ restitution: v }), 0.1)}
          </div>
        </div>
      )}
      {shape?.kind === "wrecking_ball" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", gap: 8 }}>
          <div><label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 2 }}>Radius (cm)</label>{numInput(shape.radiusCm, 6, v => patch({ radiusCm: v }), 0.5)}</div>
          <div><label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 2 }}>Cable (cm)</label>{numInput(shape.cableLength, 20, v => patch({ cableLength: v }), 1)}</div>
          <div><label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 2 }}>Swing (°)</label>{numInput(shape.swingAmplitudeDeg, 45, v => patch({ swingAmplitudeDeg: v }), 5)}</div>
          <div><label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 2 }}>Period (ms)</label>{numInput(shape.swingPeriodMs, 3000, v => patch({ swingPeriodMs: v }), 100)}</div>
          <div><label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 2 }}>Phase (°)</label>{numInput(shape.startPhaseDeg, 0, v => patch({ startPhaseDeg: v }), 5)}</div>
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
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <label style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 11, color: C.muted, cursor: "pointer" }}>
          <input type="checkbox" checked={enabled} onChange={e => e.target.checked ? enable() : disable()} />
          {enabled ? "Enabled" : "Disabled"}
        </label>
      </div>
      {enabled && physics && (
        <>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {PHYSICS_TYPES.map(t => (
              <button key={t} onClick={() => patch({ type: t })}
                style={{ padding: "2px 7px", borderRadius: 5, fontSize: 10, cursor: "pointer",
                  background: type === t ? C.red : "transparent",
                  color: type === t ? C.white : C.muted,
                  border: `1px solid ${type === t ? C.red : C.border}` }}>
                {t}
              </button>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <label style={{ fontSize: 11, color: C.faint, minWidth: 65 }}>Height (cm)</label>
              {numInput(physics.heightCm, 5, v => patch({ heightCm: v }), 0.5)}
            </div>
            <div>
              <label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 4 }}>Direction</label>
              <div style={{ display: "flex", gap: 4 }}>
                {(["one-way", "two-way"] as const).map(d => (
                  <button key={d} onClick={() => patch({ direction: d })}
                    style={{ padding: "2px 7px", borderRadius: 5, fontSize: 10, cursor: "pointer",
                      background: (physics.direction ?? "two-way") === d ? C.blue : "transparent",
                      color: (physics.direction ?? "two-way") === d ? C.white : C.muted,
                      border: `1px solid ${(physics.direction ?? "two-way") === d ? C.blue : C.border}` }}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {physics.direction === "one-way" && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <label style={{ fontSize: 11, color: C.faint, minWidth: 90 }}>One-Way Angle (°)</label>
              {numInput(physics.oneWayAngleDeg, 0, v => patch({ oneWayAngleDeg: v }), 5)}
            </div>
          )}
          {type === "ramp" && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <label style={{ fontSize: 11, color: C.faint, minWidth: 90 }}>Ramp Angle (°)</label>
              {numInput(physics.rampAngleDeg, 15, v => patch({ rampAngleDeg: v }), 1)}
            </div>
          )}
          {type === "grip" && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <label style={{ fontSize: 11, color: C.faint, minWidth: 90 }}>Grip Friction</label>
              {numInput(physics.gripFriction, 1.5, v => patch({ gripFriction: v }), 0.1)}
            </div>
          )}
          {type === "speedline" && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <label style={{ fontSize: 11, color: C.faint, minWidth: 90 }}>Boost (cm/s)</label>
              {numInput(physics.speedlineBoostCmPerS, 50, v => patch({ speedlineBoostCmPerS: v }), 5)}
            </div>
          )}
          {type === "magnetic" && (
            <div style={{ display: "flex", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <label style={{ fontSize: 11, color: C.faint, minWidth: 80 }}>Radius (cm)</label>
                {numInput(physics.magnetRadiusCm, 20, v => patch({ magnetRadiusCm: v }), 1)}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <label style={{ fontSize: 11, color: C.faint, minWidth: 60 }}>Strength</label>
                {numInput(physics.magnetStrength, 0.01, v => patch({ magnetStrength: v }), 0.001)}
              </div>
            </div>
          )}
          {type === "trampoline" && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <label style={{ fontSize: 11, color: C.faint, minWidth: 90 }}>Boost Mult</label>
              {numInput(physics.trampolineBoost, 1.5, v => patch({ trampolineBoost: v }), 0.1)}
            </div>
          )}
          {type === "spinner" && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <label style={{ fontSize: 11, color: C.faint, minWidth: 90 }}>Spin RPM Impulse</label>
              {numInput(physics.spinRpmImpulse, 100, v => patch({ spinRpmImpulse: v }), 10)}
            </div>
          )}
          {type === "crusher" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              <div>
                <label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 4 }}>Crush Axis</label>
                <div style={{ display: "flex", gap: 4 }}>
                  {(["x", "y"] as const).map(a => (
                    <button key={a} onClick={() => patch({ crushAxis: a })}
                      style={{ padding: "2px 8px", borderRadius: 5, fontSize: 11, cursor: "pointer",
                        background: (physics.crushAxis ?? "y") === a ? C.blue : "transparent",
                        color: (physics.crushAxis ?? "y") === a ? C.white : C.muted,
                        border: `1px solid ${(physics.crushAxis ?? "y") === a ? C.blue : C.border}` }}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>
              <div><label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 2 }}>Travel (cm)</label>{numInput(physics.crushTravelCm, 10, v => patch({ crushTravelCm: v }), 1)}</div>
              <div><label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 2 }}>Cycle (ms)</label>{numInput(physics.crushCyclePeriodMs, 2000, v => patch({ crushCyclePeriodMs: v }), 100)}</div>
            </div>
          )}
          {type === "electrified" && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <label style={{ fontSize: 11, color: C.faint, minWidth: 90 }}>Disable Ticks</label>
              {numInput(physics.disableTicks, 60, v => patch({ disableTicks: Math.round(v) }), 10)}
            </div>
          )}
          {type === "sticky" && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <label style={{ fontSize: 11, color: C.faint, minWidth: 90 }}>Sticky Ticks</label>
              {numInput(physics.stickyDurationTicks, 30, v => patch({ stickyDurationTicks: Math.round(v) }), 5)}
            </div>
          )}
          {type === "bouncy_net" && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <label style={{ fontSize: 11, color: C.faint, minWidth: 90 }}>Restitution</label>
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
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
        <label style={{ fontSize: 11, color: C.faint, minWidth: 40 }}>Mode</label>
        {(["floor", "line"] as const).map(m => (
          <button key={m} onClick={() => onChange(m === "floor" ? { mode: "floor" } : { mode: "line", stroke: "solid" })}
            style={{ padding: "2px 8px", borderRadius: 5, fontSize: 11, cursor: "pointer",
              background: mode === m ? C.purple : "transparent",
              color: mode === m ? C.white : C.muted,
              border: `1px solid ${mode === m ? C.purple : C.border}` }}>
            {m}
          </button>
        ))}
      </div>
      {render?.mode === "line" && (
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div>
            <label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 4 }}>Stroke</label>
            <div style={{ display: "flex", gap: 4 }}>
              {(["solid", "dashed", "dotted"] as const).map(s => (
                <button key={s} onClick={() => onChange({ ...render, stroke: s })}
                  style={{ padding: "2px 6px", borderRadius: 5, fontSize: 10, cursor: "pointer",
                    background: render.stroke === s ? C.blue : "transparent",
                    color: render.stroke === s ? C.white : C.muted,
                    border: `1px solid ${render.stroke === s ? C.blue : C.border}` }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          {render.stroke !== "solid" && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <label style={{ fontSize: 11, color: C.faint }}>Dash (cm)</label>
                {numInput(render.dashCm, 2, v => onChange({ ...render, dashCm: v }), 0.5)}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <label style={{ fontSize: 11, color: C.faint }}>Gap (cm)</label>
                {numInput(render.gapCm, 2, v => onChange({ ...render, gapCm: v }), 0.5)}
              </div>
            </>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <label style={{ fontSize: 11, color: C.faint }}>Color Key</label>
            <input type="text" value={render.colorKey ?? ""} onChange={e => onChange({ ...render, colorKey: e.target.value || undefined })}
              placeholder="e.g. red" style={{ width: 70, background: C.bg1, border: `1px solid ${C.border}`, color: C.text, borderRadius: 5, padding: "3px 6px", fontSize: 11 }} />
          </div>
        </div>
      )}
      {render?.mode === "floor" && (
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <label style={{ fontSize: 11, color: C.faint }}>Top Color</label>
            <input type="text" value={render.topColorKey ?? ""} onChange={e => onChange({ ...render, topColorKey: e.target.value || undefined })}
              placeholder="e.g. stone" style={{ width: 70, background: C.bg1, border: `1px solid ${C.border}`, color: C.text, borderRadius: 5, padding: "3px 6px", fontSize: 11 }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <label style={{ fontSize: 11, color: C.faint }}>Side Color</label>
            <input type="text" value={render.sideColorKey ?? ""} onChange={e => onChange({ ...render, sideColorKey: e.target.value || undefined })}
              placeholder="e.g. dark_stone" style={{ width: 80, background: C.bg1, border: `1px solid ${C.border}`, color: C.text, borderRadius: 5, padding: "3px 6px", fontSize: 11 }} />
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
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 13, color: C.muted }}>{items.length} / 10 obstacles — theme icon: {themeIcon}</span>
        <button onClick={add} disabled={items.length >= 10} style={{ padding: "5px 14px", background: C.blue, color: C.white, border: "none", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer", opacity: items.length >= 10 ? 0.4 : 1 }}>
          + Add Obstacle
        </button>
      </div>

      {items.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 0", color: C.faint }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>{themeIcon}</div>
          <p>No obstacles yet. Obstacles damage beyblades on collision.</p>
        </div>
      )}

      {items.map((obs, idx) => (
        <div key={obs.id ?? idx} style={{ background: C.bg3, borderRadius: 12, padding: 16, border: `1px solid ${C.border}` }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{themeIcon} Obstacle #{idx + 1}</span>
              {obs.behaviorId && (
                <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 99, background: "rgba(168,85,247,0.15)", color: "#a855f7", border: "1px solid rgba(168,85,247,0.3)" }}>
                  Behavior: {obs.behaviorId}
                </span>
              )}
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <label style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 11, color: C.muted, cursor: "pointer" }}>
                <input type="checkbox" checked={obs.indestructible ?? false} onChange={e => update(obs.id, "indestructible", e.target.checked)} />
                Indestructible
              </label>
              <button onClick={() => remove(obs.id)} style={{ color: C.red, background: "none", border: "none", fontSize: 12, cursor: "pointer" }}>Remove</button>
            </div>
          </div>

          {/* Base sliders */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {SLIDER_FIELDS.map(({ field, label, min, max, step }) => (
              <div key={field}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.faint, marginBottom: 2 }}>
                  <span>{label}</span>
                  <span style={{ color: C.text, fontFamily: "monospace" }}>{(obs as any)[field] ?? 0}</span>
                </div>
                <input type="range" min={min} max={max} step={step}
                  value={(obs as any)[field] ?? 0}
                  onChange={e => update(obs.id, field, +e.target.value)}
                  style={{ width: "100%", accentColor: C.blue }}
                />
              </div>
            ))}
          </div>

          {/* Sprite picker */}
          <div style={{ marginTop: 12, marginBottom: 10 }}>
            <label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 4 }}>Obstacle Sprite</label>
            <SearchableSelect
              value={(obs as any).spriteId ?? ""}
              options={assetOpts}
              onChange={v => update(obs.id, "spriteId" as any, v || undefined)}
              disabled={assetsLoading}
              emptyLabel={assetsLoading ? "Loading…" : "No obstacle assets found"}
              style={{ width: "100%", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: 11 }}
            />
          </div>

          {/* Element type + switch */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
            <div>
              <label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 4 }}>Element Type</label>
              <SearchableSelect
                value={(obs.elementType as any) ?? ""}
                options={elemOpts}
                onChange={v => update(obs.id, "elementType" as any, v || undefined)}
                disabled={elemLoading}
                emptyLabel={elemLoading ? "Loading…" : "No element types"}
                style={{ width: "100%", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: 11 }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 4 }}>Controlled By Switch ID</label>
              <input
                type="text"
                value={obs.controlledBySwitchId ?? ""}
                onChange={e => update(obs.id, "controlledBySwitchId", e.target.value || undefined)}
                placeholder="e.g. sw1"
                style={{ width: "100%", background: C.bg2, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, padding: "4px 8px", fontSize: 12, boxSizing: "border-box" }}
              />
            </div>
          </div>

          {/* Shape section */}
          <div style={{ marginBottom: 8, background: C.bg2, borderRadius: 8, padding: 10 }}>
            <SectionHeader label="Shape" open={isSectionOpen(obs.id, "shape")} toggle={() => toggleSection(obs.id, "shape")} />
            {isSectionOpen(obs.id, "shape") && (
              <ShapeEditor shape={obs.shape} onChange={v => update(obs.id, "shape", v)} />
            )}
          </div>

          {/* Physics block */}
          <div style={{ marginBottom: 8, background: C.bg2, borderRadius: 8, padding: 10 }}>
            <SectionHeader label="Physics Override" open={isSectionOpen(obs.id, "physics")} toggle={() => toggleSection(obs.id, "physics")} />
            {isSectionOpen(obs.id, "physics") && (
              <PhysicsEditor physics={obs.physics} onChange={v => update(obs.id, "physics", v)} />
            )}
          </div>

          {/* Render mode */}
          <div style={{ marginBottom: 8, background: C.bg2, borderRadius: 8, padding: 10 }}>
            <SectionHeader label="Render Mode" open={isSectionOpen(obs.id, "render")} toggle={() => toggleSection(obs.id, "render")} />
            {isSectionOpen(obs.id, "render") && (
              <RenderModeEditor render={obs.render} onChange={v => update(obs.id, "render", v)} />
            )}
          </div>

          {/* Feature Animation */}
          <div style={{ marginBottom: 8, background: C.bg2, borderRadius: 8, padding: 10 }}>
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
          <div style={{ marginBottom: 8, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 4 }}>Behavior ID (optional)</label>
              <input
                type="text"
                data-testid={`obstacle-behavior-id-${idx}`}
                value={obs.behaviorId ?? ""}
                onChange={e => update(obs.id, "behaviorId", e.target.value || undefined)}
                placeholder="e.g. movement.orbit"
                style={{ width: "100%", background: C.bg2, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, padding: "4px 8px", fontSize: 12, boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 11, color: C.faint, marginBottom: 4 }}>Behavior Params (JSON)</label>
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
                style={{ width: "100%", background: C.bg2, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, padding: "4px 8px", fontSize: 11, fontFamily: "monospace", resize: "vertical", boxSizing: "border-box" }}
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
  );
}

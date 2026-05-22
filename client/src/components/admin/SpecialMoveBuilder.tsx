// Special Move pipeline builder — up to 10 steps, each referencing a ComboEffectDef.

import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { C } from "@/styles/theme";
import { ComboVisualEditor } from "./ComboVisualEditor";
import type { SpecialMoveConfig, SpecialMoveStep } from "@/types/specialMove";
import type { ComboVisual } from "@/types/comboVisual";

interface Props {
  value: SpecialMoveConfig;
  onChange: (next: SpecialMoveConfig) => void;
}

interface EffectOption { id: string; name: string; cost: number; }

const inputStyle = {
  background: "var(--bg3)",
  border: `1px solid ${C.border}`,
  borderRadius: 8,
  padding: "6px 10px",
  color: C.text,
  fontSize: 13,
  width: "100%",
  boxSizing: "border-box" as const,
};

function emptyStep(): SpecialMoveStep {
  return { comboEffectId: "", executionMode: "sequential", delayTicksAfterPrev: 0 };
}

type Tab = "steps" | "config" | "anim";

export function SpecialMoveBuilder({ value, onChange }: Props) {
  const [tab, setTab] = useState<Tab>("steps");
  const [effects, setEffects] = useState<EffectOption[]>([]);

  useEffect(() => {
    getDocs(collection(db, "combo_effects"))
      .then(snap => setEffects(snap.docs.map(d => ({ id: d.id, name: (d.data() as { name: string }).name, cost: (d.data() as { cost: number }).cost ?? 0 }))))
      .catch(() => {});
  }, []);

  function setField<K extends keyof SpecialMoveConfig>(key: K, val: SpecialMoveConfig[K]) {
    onChange({ ...value, [key]: val });
  }

  function updateStep(idx: number, patch: Partial<SpecialMoveStep>) {
    const steps = value.steps.map((s, i) => i === idx ? { ...s, ...patch } : s);
    setField("steps", steps);
  }

  function addStep() {
    if (value.steps.length >= 10) return;
    setField("steps", [...value.steps, emptyStep()]);
  }

  function removeStep(idx: number) {
    setField("steps", value.steps.filter((_, i) => i !== idx));
  }

  function moveStep(idx: number, dir: -1 | 1) {
    const steps = [...value.steps];
    const target = idx + dir;
    if (target < 0 || target >= steps.length) return;
    [steps[idx], steps[target]] = [steps[target], steps[idx]];
    setField("steps", steps);
  }

  // ── Timeline swimlane ──────────────────────────────────────────────────────
  function renderTimeline() {
    let cursor = 0;
    return (
      <div style={{ overflowX: "auto", padding: "8px 0" }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 0, minWidth: "max-content", height: 60 }}>
          {value.steps.map((step, i) => {
            const delay = step.delayTicksAfterPrev ?? 0;
            const effectName = effects.find(e => e.id === step.comboEffectId)?.name ?? step.comboEffectId.split("/").pop() ?? "effect";
            const blockW = Math.max(80, effectName.length * 8 + 20);
            const delayW = Math.max(0, delay * 2);
            const startX = cursor;
            cursor += delayW + blockW;
            const isParallel = step.executionMode === "parallel";
            return (
              <div key={i} style={{ display: "flex", alignItems: "flex-end", height: "100%" }}>
                {delay > 0 && (
                  <div style={{ width: delayW, height: 4, background: C.border, borderRadius: 2, marginBottom: 20 }} title={`delay ${delay}t`} />
                )}
                <div
                  style={{
                    width: blockW,
                    height: isParallel ? 50 : 40,
                    background: isParallel ? C.purple + "33" : C.blue + "33",
                    border: `1px solid ${isParallel ? C.purple : C.blue}66`,
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    color: isParallel ? C.purple : C.blue,
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    padding: "0 6px",
                  }}
                  title={`${effectName} (${step.executionMode})`}
                >
                  {isParallel && <span style={{ marginRight: 3, opacity: 0.7 }}>∥</span>}
                  {effectName}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {/* Tab bar */}
      <div style={{ display: "flex", borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
        {(["steps", "config", "anim"] as Tab[]).map(t => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            style={{
              padding: "8px 14px",
              fontSize: 12,
              fontWeight: tab === t ? 700 : 400,
              background: "transparent",
              border: "none",
              borderBottom: tab === t ? `2px solid ${C.blue}` : "2px solid transparent",
              color: tab === t ? C.text : C.faint,
              cursor: "pointer",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            {t === "steps" ? "Pipeline" : t === "config" ? "Config" : "Animations"}
          </button>
        ))}
      </div>

      {/* Pipeline tab */}
      {tab === "steps" && (
        <div style={{ flex: 1, overflowY: "auto", padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
          {renderTimeline()}

          {value.steps.map((step, idx) => (
            <div
              key={idx}
              data-field={`step-${idx}-comboEffectId`}
              style={{ background: "var(--bg2)", border: `1px solid ${C.border}`, borderRadius: 12, padding: 12, display: "flex", flexDirection: "column", gap: 8 }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: C.muted, width: 20 }}>#{idx + 1}</span>
                <select
                  style={{ ...inputStyle, flex: 1 }}
                  value={step.comboEffectId}
                  onChange={e => updateStep(idx, { comboEffectId: e.target.value })}
                >
                  <option value="">— choose effect —</option>
                  {effects.map(e => (
                    <option key={e.id} value={e.id}>{e.name} (cost {e.cost})</option>
                  ))}
                </select>
                <div style={{ display: "flex", gap: 4 }}>
                  <button type="button" onClick={() => moveStep(idx, -1)} style={{ background: "transparent", border: "none", color: C.muted, cursor: "pointer", fontSize: 13, padding: "2px 5px" }}>↑</button>
                  <button type="button" onClick={() => moveStep(idx, 1)} style={{ background: "transparent", border: "none", color: C.muted, cursor: "pointer", fontSize: 13, padding: "2px 5px" }}>↓</button>
                  <button type="button" onClick={() => removeStep(idx)} style={{ background: "transparent", border: "none", color: C.red, cursor: "pointer", fontSize: 13, padding: "2px 5px" }}>✕</button>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                <div>
                  <label style={{ fontSize: 10, color: C.faint, display: "block", marginBottom: 3 }}>Mode</label>
                  <select style={inputStyle} value={step.executionMode} onChange={e => updateStep(idx, { executionMode: e.target.value as "sequential" | "parallel" })}>
                    <option value="sequential">sequential</option>
                    <option value="parallel">parallel</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 10, color: C.faint, display: "block", marginBottom: 3 }}>Delay after prev (ticks)</label>
                  <input style={inputStyle} type="number" min={0} value={step.delayTicksAfterPrev} onChange={e => updateStep(idx, { delayTicksAfterPrev: parseInt(e.target.value, 10) || 0 })} />
                </div>
                <div>
                  <label style={{ fontSize: 10, color: C.faint, display: "block", marginBottom: 3 }}>Mult scale</label>
                  <input style={inputStyle} type="number" min={0} step={0.1} placeholder="1.0" value={step.overrideParams?.statMultiplierScale ?? ""} onChange={e => updateStep(idx, { overrideParams: { ...step.overrideParams, statMultiplierScale: e.target.value ? parseFloat(e.target.value) : undefined } })} />
                </div>
              </div>

              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.muted, cursor: "pointer" }}>
                <input type="checkbox" checked={step.brieflyReleasesControl ?? false} onChange={e => updateStep(idx, { brieflyReleasesControl: e.target.checked })} />
                Briefly releases control during this step
              </label>
            </div>
          ))}

          {value.steps.length < 10 && (
            <button
              type="button"
              onClick={addStep}
              style={{ padding: "8px", background: C.green + "11", border: `1px dashed ${C.green}44`, borderRadius: 12, color: C.green, fontSize: 12, cursor: "pointer", fontWeight: 600 }}
            >
              + Add Step ({value.steps.length}/10)
            </button>
          )}
        </div>
      )}

      {/* Config tab */}
      {tab === "config" && (
        <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ fontSize: 11, color: C.muted, fontWeight: 600, textTransform: "uppercase", display: "block", marginBottom: 4 }}>Name</label>
              <input style={inputStyle} value={value.name} onChange={e => setField("name", e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: C.muted, fontWeight: 600, textTransform: "uppercase", display: "block", marginBottom: 4 }}>Power Cost</label>
              <input style={inputStyle} type="number" min={0} max={100} step={5} value={value.powerCost} onChange={e => setField("powerCost", parseInt(e.target.value, 10))} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: C.muted, fontWeight: 600, textTransform: "uppercase", display: "block", marginBottom: 4 }}>Lock Duration (ticks)</label>
              <input style={inputStyle} type="number" min={0} value={value.locksDurationTicks} onChange={e => setField("locksDurationTicks", parseInt(e.target.value, 10))} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: C.muted, fontWeight: 600, textTransform: "uppercase", display: "block", marginBottom: 4 }}>Windup (ticks)</label>
              <input style={inputStyle} type="number" min={0} value={value.windupTicks ?? ""} placeholder="0" onChange={e => setField("windupTicks", e.target.value ? parseInt(e.target.value, 10) : undefined)} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: C.muted, fontWeight: 600, textTransform: "uppercase", display: "block", marginBottom: 4 }}>Bleed (ticks)</label>
              <input style={inputStyle} type="number" min={0} value={value.bleedTicks ?? ""} placeholder="0" onChange={e => setField("bleedTicks", e.target.value ? parseInt(e.target.value, 10) : undefined)} />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.muted, cursor: "pointer" }}>
              <input type="checkbox" checked={value.cancelable} onChange={e => setField("cancelable", e.target.checked)} />
              Cancelable (2nd Space aborts)
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.muted, cursor: "pointer" }}>
              <input type="checkbox" checked={value.cancelableByQTE !== false} onChange={e => setField("cancelableByQTE", e.target.checked)} />
              QTE can interrupt
            </label>
          </div>

          <div>
            <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, textTransform: "uppercase", marginBottom: 8 }}>Camera Config</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              <div>
                <label style={{ fontSize: 10, color: C.faint, display: "block", marginBottom: 3 }}>Zoom Factor</label>
                <input style={inputStyle} type="number" min={1} max={3} step={0.1} placeholder="1.0" value={value.cameraConfig?.zoomFactor ?? ""} onChange={e => setField("cameraConfig", { ...value.cameraConfig, zoomFactor: e.target.value ? parseFloat(e.target.value) : undefined })} />
              </div>
              <div>
                <label style={{ fontSize: 10, color: C.faint, display: "block", marginBottom: 3 }}>Zoom Duration (ticks)</label>
                <input style={inputStyle} type="number" min={1} placeholder="30" value={value.cameraConfig?.zoomDurationTicks ?? ""} onChange={e => setField("cameraConfig", { ...value.cameraConfig, zoomDurationTicks: e.target.value ? parseInt(e.target.value, 10) : undefined })} />
              </div>
              <div>
                <label style={{ fontSize: 10, color: C.faint, display: "block", marginBottom: 3 }}>Slow Motion (0–1)</label>
                <input style={inputStyle} type="number" min={0} max={1} step={0.05} placeholder="1.0" value={value.cameraConfig?.slowMotionFactor ?? ""} onChange={e => setField("cameraConfig", { ...value.cameraConfig, slowMotionFactor: e.target.value ? parseFloat(e.target.value) : undefined })} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Animations tab */}
      {tab === "anim" && (
        <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
          <ComboVisualEditor
            label="Intro Animation (windup)"
            value={value.introAnimation ?? {}}
            onChange={(v: ComboVisual) => setField("introAnimation", Object.keys(v).length ? v : undefined)}
          />
          <ComboVisualEditor
            label="Outro Animation (bleed)"
            value={value.outroAnimation ?? {}}
            onChange={(v: ComboVisual) => setField("outroAnimation", Object.keys(v).length ? v : undefined)}
          />
        </div>
      )}
    </div>
  );
}

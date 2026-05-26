// Special Move pipeline builder — up to 10 steps, each referencing a ComboEffectDef.

import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { SearchableSelect } from "@/components/admin/SearchableSelect";
import { ComboVisualEditor } from "./ComboVisualEditor";
import type { SpecialMoveConfig, SpecialMoveStep } from "@/types/specialMove";
import type { ComboVisual } from "@/types/comboVisual";

interface Props {
  value: SpecialMoveConfig;
  onChange: (next: SpecialMoveConfig) => void;
}

interface EffectOption { id: string; name: string; cost: number; }

// Shared input class for all text/number inputs
const INPUT_CLS = "bg-bg3 border border-border-c rounded-lg py-1.5 px-2.5 text-theme-text text-[13px] w-full box-border";

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
      <div className="overflow-x-auto py-2">
        <div className="flex items-end gap-0 min-w-max h-[60px]">
          {value.steps.map((step, i) => {
            const delay = step.delayTicksAfterPrev ?? 0;
            const effectName = effects.find(e => e.id === step.comboEffectId)?.name ?? step.comboEffectId.split("/").pop() ?? "effect";
            const blockW = Math.max(80, effectName.length * 8 + 20);
            const delayW = Math.max(0, delay * 2);
            cursor += delayW + blockW;
            const isParallel = step.executionMode === "parallel";
            return (
              <div key={i} className="flex items-end h-full">
                {delay > 0 && (
                  <div
                    className="h-1 rounded-sm mb-5 bg-border-c"
                    style={{ width: delayW }}
                    title={`delay ${delay}t`}
                  />
                )}
                <div
                  className={`flex items-center justify-center text-[11px] font-semibold whitespace-nowrap overflow-hidden text-ellipsis rounded-lg px-1.5 ${isParallel ? "bg-purple-10 border border-[rgba(168,85,247,0.4)] text-theme-purple" : "bg-blue-10 border border-[rgba(59,130,246,0.4)] text-theme-blue"}`}
                  style={{ width: blockW, height: isParallel ? 50 : 40 }}
                  title={`${effectName} (${step.executionMode})`}
                >
                  {isParallel && <span className="mr-[3px] opacity-70">∥</span>}
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
    <div className="flex flex-col h-full overflow-hidden">
      {/* Tab bar */}
      <div className="flex border-b border-border-c shrink-0">
        {(["steps", "config", "anim"] as Tab[]).map(t => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className="px-3.5 py-2 text-xs cursor-pointer bg-transparent border-none uppercase tracking-[0.04em]"
            style={{
              fontWeight: tab === t ? 700 : 400,
              borderBottom: tab === t ? "2px solid var(--blue)" : "2px solid transparent",
              color: tab === t ? "var(--text)" : "var(--faint)",
            }}
          >
            {t === "steps" ? "Pipeline" : t === "config" ? "Config" : "Animations"}
          </button>
        ))}
      </div>

      {/* Pipeline tab */}
      {tab === "steps" && (
        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
          {renderTimeline()}

          {value.steps.map((step, idx) => (
            <div
              key={idx}
              data-field={`step-${idx}-comboEffectId`}
              className="bg-bg2 border border-border-c rounded-xl p-3 flex flex-col gap-2"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-theme-muted w-5">#{idx + 1}</span>
                <SearchableSelect
                  value={step.comboEffectId}
                  options={effects.map(e => ({ value: e.id, label: `${e.name} (cost ${e.cost})` }))}
                  onChange={v => updateStep(idx, { comboEffectId: v })}
                  emptyLabel="— choose effect —"
                  className="flex-1"
                />
                <div className="flex gap-1">
                  <button type="button" onClick={() => moveStep(idx, -1)} className="bg-transparent border-none text-theme-muted cursor-pointer text-[13px] py-0.5 px-[5px]">↑</button>
                  <button type="button" onClick={() => moveStep(idx, 1)} className="bg-transparent border-none text-theme-muted cursor-pointer text-[13px] py-0.5 px-[5px]">↓</button>
                  <button type="button" onClick={() => removeStep(idx)} className="bg-transparent border-none text-theme-red cursor-pointer text-[13px] py-0.5 px-[5px]">✕</button>
                </div>
              </div>

              <div className="grid gap-2 [grid-template-columns:1fr_1fr_1fr]">
                <div>
                  <label className="text-[10px] text-theme-faint block mb-[3px]">Mode</label>
                  <SearchableSelect
                    value={step.executionMode}
                    options={[{ value: "sequential", label: "sequential" }, { value: "parallel", label: "parallel" }]}
                    onChange={v => updateStep(idx, { executionMode: v as "sequential" | "parallel" })}
                  />
                </div>
                <div>
                  <label className="text-[10px] text-theme-faint block mb-[3px]">Delay after prev (ticks)</label>
                  <input className={INPUT_CLS} type="number" min={0} value={step.delayTicksAfterPrev} onChange={e => updateStep(idx, { delayTicksAfterPrev: parseInt(e.target.value, 10) || 0 })} />
                </div>
                <div>
                  <label className="text-[10px] text-theme-faint block mb-[3px]">Mult scale</label>
                  <input className={INPUT_CLS} type="number" min={0} step={0.1} placeholder="1.0" value={step.overrideParams?.statMultiplierScale ?? ""} onChange={e => updateStep(idx, { overrideParams: { ...step.overrideParams, statMultiplierScale: e.target.value ? parseFloat(e.target.value) : undefined } })} />
                </div>
              </div>

              <label className="flex items-center gap-1.5 text-xs text-theme-muted cursor-pointer">
                <input type="checkbox" checked={step.brieflyReleasesControl ?? false} onChange={e => updateStep(idx, { brieflyReleasesControl: e.target.checked })} />
                Briefly releases control during this step
              </label>
            </div>
          ))}

          {value.steps.length < 10 && (
            <button
              type="button"
              onClick={addStep}
              className="p-2 rounded-xl text-theme-green text-xs cursor-pointer font-semibold bg-green-10 border border-dashed border-[rgba(34,197,94,0.27)]"
            >
              + Add Step ({value.steps.length}/10)
            </button>
          )}
        </div>
      )}

      {/* Config tab */}
      {tab === "config" && (
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          <div className="grid gap-3 [grid-template-columns:1fr_1fr]">
            <div>
              <label className="text-[11px] text-theme-muted font-semibold uppercase block mb-1">Name</label>
              <input className={INPUT_CLS} value={value.name} onChange={e => setField("name", e.target.value)} />
            </div>
            <div>
              <label className="text-[11px] text-theme-muted font-semibold uppercase block mb-1">Power Cost</label>
              <input className={INPUT_CLS} type="number" min={0} max={100} step={5} value={value.powerCost} onChange={e => setField("powerCost", parseInt(e.target.value, 10))} />
            </div>
            <div>
              <label className="text-[11px] text-theme-muted font-semibold uppercase block mb-1">Lock Duration (ticks)</label>
              <input className={INPUT_CLS} type="number" min={0} value={value.locksDurationTicks} onChange={e => setField("locksDurationTicks", parseInt(e.target.value, 10))} />
            </div>
            <div>
              <label className="text-[11px] text-theme-muted font-semibold uppercase block mb-1">Windup (ticks)</label>
              <input className={INPUT_CLS} type="number" min={0} value={value.windupTicks ?? ""} placeholder="0" onChange={e => setField("windupTicks", e.target.value ? parseInt(e.target.value, 10) : undefined)} />
            </div>
            <div>
              <label className="text-[11px] text-theme-muted font-semibold uppercase block mb-1">Bleed (ticks)</label>
              <input className={INPUT_CLS} type="number" min={0} value={value.bleedTicks ?? ""} placeholder="0" onChange={e => setField("bleedTicks", e.target.value ? parseInt(e.target.value, 10) : undefined)} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-1.5 text-xs text-theme-muted cursor-pointer">
              <input type="checkbox" checked={value.cancelable} onChange={e => setField("cancelable", e.target.checked)} />
              Cancelable (2nd Space aborts)
            </label>
            <label className="flex items-center gap-1.5 text-xs text-theme-muted cursor-pointer">
              <input type="checkbox" checked={value.cancelableByQTE !== false} onChange={e => setField("cancelableByQTE", e.target.checked)} />
              QTE can interrupt
            </label>
          </div>

          <div>
            <div className="text-[11px] text-theme-muted font-semibold uppercase mb-2">Camera Config</div>
            <div className="grid gap-2 [grid-template-columns:1fr_1fr_1fr]">
              <div>
                <label className="text-[10px] text-theme-faint block mb-[3px]">Zoom Factor</label>
                <input className={INPUT_CLS} type="number" min={1} max={3} step={0.1} placeholder="1.0" value={value.cameraConfig?.zoomFactor ?? ""} onChange={e => setField("cameraConfig", { ...value.cameraConfig, zoomFactor: e.target.value ? parseFloat(e.target.value) : undefined })} />
              </div>
              <div>
                <label className="text-[10px] text-theme-faint block mb-[3px]">Zoom Duration (ticks)</label>
                <input className={INPUT_CLS} type="number" min={1} placeholder="30" value={value.cameraConfig?.zoomDurationTicks ?? ""} onChange={e => setField("cameraConfig", { ...value.cameraConfig, zoomDurationTicks: e.target.value ? parseInt(e.target.value, 10) : undefined })} />
              </div>
              <div>
                <label className="text-[10px] text-theme-faint block mb-[3px]">Slow Motion (0–1)</label>
                <input className={INPUT_CLS} type="number" min={0} max={1} step={0.05} placeholder="1.0" value={value.cameraConfig?.slowMotionFactor ?? ""} onChange={e => setField("cameraConfig", { ...value.cameraConfig, slowMotionFactor: e.target.value ? parseFloat(e.target.value) : undefined })} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Animations tab */}
      {tab === "anim" && (
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
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

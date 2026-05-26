// Combo Effect builder — edit a ComboEffectDef with the 3-panel ScriptBuilder embedded.

import { useState } from "react";
import { cn } from "@/lib/cn";
import { ScriptBuilder } from "@/components/script-builder/ScriptBuilder";
import { ComboVisualEditor } from "./ComboVisualEditor";
import type { ComboEffectDef } from "@/types/comboTask";
import type { ComboVisual } from "@/types/comboVisual";
import type { BehaviorRef } from "@/types/comboTask";

interface Props {
  value: ComboEffectDef;
  onChange: (next: ComboEffectDef) => void;
}

const inputCls = "bg-bg3 border border-border-c rounded-lg px-2.5 py-1.5 text-theme-text text-[13px] w-full box-border";

type Tab = "steps" | "meta" | "entry" | "exit";

export function ComboEffectBuilder({ value, onChange }: Props) {
  const [tab, setTab] = useState<Tab>("steps");

  function set<K extends keyof ComboEffectDef>(key: K, val: ComboEffectDef[K]) {
    onChange({ ...value, [key]: val });
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Tab bar */}
      <div className="flex border-b border-border-c shrink-0">
        {(["steps", "meta", "entry", "exit"] as Tab[]).map(t => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "px-3.5 py-2 text-[12px] bg-transparent border-none cursor-pointer uppercase tracking-[0.04em] border-b-2",
              tab === t ? "font-bold text-theme-text border-b-theme-blue" : "font-normal text-theme-faint border-b-transparent",
            )}
          >
            {t === "steps" ? "Steps" : t === "meta" ? "Meta" : t === "entry" ? "Entry Anim" : "Exit Anim"}
          </button>
        ))}
      </div>

      {/* Steps tab — full ScriptBuilder */}
      {tab === "steps" && (
        <div className="flex-1 overflow-hidden min-h-0">
          <ScriptBuilder
            steps={value.steps ?? []}
            onChange={(steps: BehaviorRef[]) => set("steps", steps)}
            label={value.name || "Effect Steps"}
          />
        </div>
      )}

      {/* Meta tab */}
      {tab === "meta" && (
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5">
          <div className="grid gap-3 [grid-template-columns:1fr_1fr]">
            <div>
              <label className="text-[11px] text-theme-muted font-semibold uppercase block mb-1">Name</label>
              <input className={inputCls} value={value.name} onChange={e => set("name", e.target.value)} />
            </div>
            <div>
              <label className="text-[11px] text-theme-muted font-semibold uppercase block mb-1">Cost (power)</label>
              <input className={inputCls} type="number" min={0} max={100} step={5} value={value.cost ?? 0} onChange={e => set("cost", parseInt(e.target.value, 10))} />
            </div>
            <div>
              <label className="text-[11px] text-theme-muted font-semibold uppercase block mb-1">Cooldown (ms)</label>
              <input className={inputCls} type="number" min={0} step={100} value={value.cooldownMs ?? 3000} onChange={e => set("cooldownMs", parseInt(e.target.value, 10))} />
            </div>
            <div>
              <label className="text-[11px] text-theme-muted font-semibold uppercase block mb-1">Windup (ticks)</label>
              <input className={inputCls} type="number" min={0} value={value.windupTicks ?? ""} placeholder="0" onChange={e => set("windupTicks", e.target.value ? parseInt(e.target.value, 10) : undefined)} />
            </div>
            <div>
              <label className="text-[11px] text-theme-muted font-semibold uppercase block mb-1">Bleed (ticks)</label>
              <input className={inputCls} type="number" min={0} value={value.bleedTicks ?? ""} placeholder="0" onChange={e => set("bleedTicks", e.target.value ? parseInt(e.target.value, 10) : undefined)} />
            </div>
          </div>

          <div className="text-[11px] text-theme-faint bg-bg3 rounded-lg px-3 py-2">
            <strong className="text-theme-muted">Compiled steps:</strong> {value.steps?.length ?? 0} BehaviorRefs.
            Steps are compiled from tasks by <code>comboTaskCompiler.ts</code> at save time.
            Edit them directly in the <strong>Steps</strong> tab.
          </div>
        </div>
      )}

      {/* Entry / Exit animation tabs */}
      {(tab === "entry" || tab === "exit") && (
        <div className="flex-1 overflow-y-auto p-4">
          <ComboVisualEditor
            label={tab === "entry" ? "Entry Animation" : "Exit Animation"}
            value={(tab === "entry" ? value.entryAnimation : value.exitAnimation) ?? {}}
            onChange={(v: ComboVisual) => set(tab === "entry" ? "entryAnimation" : "exitAnimation", v)}
          />
        </div>
      )}
    </div>
  );
}

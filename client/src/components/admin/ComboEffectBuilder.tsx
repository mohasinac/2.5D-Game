// Combo Effect builder — edit a ComboEffectDef with the 3-panel ScriptBuilder embedded.

import { useState } from "react";
import { C } from "@/styles/theme";
import { ScriptBuilder } from "@/components/script-builder/ScriptBuilder";
import { ComboVisualEditor } from "./ComboVisualEditor";
import type { ComboEffectDef } from "@/types/comboTask";
import type { ComboVisual } from "@/types/comboVisual";
import type { BehaviorRef } from "@/types/comboTask";

interface Props {
  value: ComboEffectDef;
  onChange: (next: ComboEffectDef) => void;
}

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

type Tab = "steps" | "meta" | "entry" | "exit";

export function ComboEffectBuilder({ value, onChange }: Props) {
  const [tab, setTab] = useState<Tab>("steps");

  function set<K extends keyof ComboEffectDef>(key: K, val: ComboEffectDef[K]) {
    onChange({ ...value, [key]: val });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {/* Tab bar */}
      <div style={{ display: "flex", borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
        {(["steps", "meta", "entry", "exit"] as Tab[]).map(t => (
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
            {t === "steps" ? "Steps" : t === "meta" ? "Meta" : t === "entry" ? "Entry Anim" : "Exit Anim"}
          </button>
        ))}
      </div>

      {/* Steps tab — full ScriptBuilder */}
      {tab === "steps" && (
        <div style={{ flex: 1, overflow: "hidden", minHeight: 0 }}>
          <ScriptBuilder
            steps={value.steps ?? []}
            onChange={(steps: BehaviorRef[]) => set("steps", steps)}
            label={value.name || "Effect Steps"}
          />
        </div>
      )}

      {/* Meta tab */}
      {tab === "meta" && (
        <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ fontSize: 11, color: C.muted, fontWeight: 600, textTransform: "uppercase", display: "block", marginBottom: 4 }}>Name</label>
              <input style={inputStyle} value={value.name} onChange={e => set("name", e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: C.muted, fontWeight: 600, textTransform: "uppercase", display: "block", marginBottom: 4 }}>Cost (power)</label>
              <input style={inputStyle} type="number" min={0} max={100} step={5} value={value.cost ?? 0} onChange={e => set("cost", parseInt(e.target.value, 10))} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: C.muted, fontWeight: 600, textTransform: "uppercase", display: "block", marginBottom: 4 }}>Cooldown (ms)</label>
              <input style={inputStyle} type="number" min={0} step={100} value={value.cooldownMs ?? 3000} onChange={e => set("cooldownMs", parseInt(e.target.value, 10))} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: C.muted, fontWeight: 600, textTransform: "uppercase", display: "block", marginBottom: 4 }}>Windup (ticks)</label>
              <input style={inputStyle} type="number" min={0} value={value.windupTicks ?? ""} placeholder="0" onChange={e => set("windupTicks", e.target.value ? parseInt(e.target.value, 10) : undefined)} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: C.muted, fontWeight: 600, textTransform: "uppercase", display: "block", marginBottom: 4 }}>Bleed (ticks)</label>
              <input style={inputStyle} type="number" min={0} value={value.bleedTicks ?? ""} placeholder="0" onChange={e => set("bleedTicks", e.target.value ? parseInt(e.target.value, 10) : undefined)} />
            </div>
          </div>

          <div style={{ fontSize: 11, color: C.faint, background: "var(--bg3)", borderRadius: 8, padding: "8px 12px" }}>
            <strong style={{ color: C.muted }}>Compiled steps:</strong> {value.steps?.length ?? 0} BehaviorRefs.
            Steps are compiled from tasks by <code>comboTaskCompiler.ts</code> at save time.
            Edit them directly in the <strong>Steps</strong> tab.
          </div>
        </div>
      )}

      {/* Entry / Exit animation tabs */}
      {(tab === "entry" || tab === "exit") && (
        <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
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

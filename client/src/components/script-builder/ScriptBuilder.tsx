// 3-panel Scratch-like script builder for ComboEffectDef steps (BehaviorRef[]).
//
// Panels:
//  Left: ToolboxPanel (draggable block library)
//  Center: BlockCanvas (drag-drop step editor)
//  Right: RawScriptPanel (JSON editor + timeline) + TestRunPanel + InputRecorder

import { useState, useCallback } from "react";
import { C } from "@/styles/theme";
import { ToolboxPanel, type BehaviorDefDoc } from "./ToolboxPanel";
import { BlockCanvas } from "./BlockCanvas";
import { RawScriptPanel } from "./RawScriptPanel";
import { TestRunPanel } from "./TestRunPanel";
import { InputRecorder } from "./InputRecorder";
import type { BehaviorRef } from "@/types/comboTask";

type RightTab = "script" | "test" | "record";

interface Props {
  steps: BehaviorRef[];
  onChange: (steps: BehaviorRef[]) => void;
  /** Optional label shown in the header */
  label?: string;
}

export function ScriptBuilder({ steps, onChange, label = "Script Builder" }: Props) {
  const [draggedBlock, setDraggedBlock] = useState<BehaviorDefDoc | null>(null);
  const [rightTab, setRightTab] = useState<RightTab>("script");

  const handleDragEnd = useCallback(() => setDraggedBlock(null), []);

  const handleRecordCapture = useCallback((captured: BehaviorRef[]) => {
    onChange([...steps, ...captured]);
    setRightTab("script");
  }, [steps, onChange]);

  return (
    <div
      data-testid="script-builder"
      style={{
        display: "grid",
        gridTemplateColumns: "200px 1fr 320px",
        gridTemplateRows: "36px 1fr",
        height: "100%",
        overflow: "hidden",
        background: "var(--bg1)",
        border: `1px solid ${C.border}`,
        borderRadius: 14,
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div style={{
        gridColumn: "1 / -1",
        borderBottom: `1px solid ${C.border}`,
        display: "flex",
        alignItems: "center",
        padding: "0 14px",
        gap: 10,
      }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>
        <span style={{ fontSize: 11, color: C.faint }}>
          {steps.length} step{steps.length !== 1 ? "s" : ""}
        </span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
          <button
            type="button"
            onClick={() => onChange([])}
            style={{ padding: "2px 8px", background: "transparent", border: `1px solid ${C.border}`, borderRadius: 6, color: C.muted, fontSize: 11, cursor: "pointer" }}
          >
            Clear
          </button>
        </div>
      </div>

      {/* ── Left: Toolbox ──────────────────────────────────────────────────── */}
      <div style={{
        borderRight: `1px solid ${C.border}`,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        background: "var(--bg2)",
      }}>
        <ToolboxPanel onDragStart={setDraggedBlock} />
      </div>

      {/* ── Center: Block Canvas ───────────────────────────────────────────── */}
      <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <BlockCanvas
          steps={steps}
          onChange={onChange}
          draggedBlock={draggedBlock}
          onDragEnd={handleDragEnd}
        />
      </div>

      {/* ── Right: Script / Test / Record tabs ────────────────────────────── */}
      <div style={{
        borderLeft: `1px solid ${C.border}`,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "var(--bg2)",
      }}>
        {/* Tab bar */}
        <div style={{ display: "flex", borderBottom: `1px solid ${C.border}` }}>
          {(["script", "test", "record"] as RightTab[]).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setRightTab(t)}
              style={{
                flex: 1,
                padding: "6px 4px",
                fontSize: 11,
                fontWeight: rightTab === t ? 700 : 400,
                background: "transparent",
                border: "none",
                borderBottom: rightTab === t ? `2px solid ${C.blue}` : "2px solid transparent",
                color: rightTab === t ? C.text : C.faint,
                cursor: "pointer",
                textTransform: "uppercase",
                letterSpacing: "0.03em",
              }}
            >
              {t === "script" ? "JSON" : t === "test" ? "Test" : "Record"}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, overflow: "auto" }}>
          {rightTab === "script" && (
            <RawScriptPanel steps={steps} onChange={onChange} />
          )}
          {rightTab === "test" && (
            <TestRunPanel steps={steps} />
          )}
          {rightTab === "record" && (
            <InputRecorder onCapture={handleRecordCapture} />
          )}
        </div>
      </div>
    </div>
  );
}

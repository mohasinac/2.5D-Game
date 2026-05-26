// 3-panel Scratch-like script builder for ComboEffectDef steps (BehaviorRef[]).
//
// Panels:
//  Left: ToolboxPanel (draggable block library)
//  Center: BlockCanvas (drag-drop step editor)
//  Right: RawScriptPanel (JSON editor + timeline) + TestRunPanel + InputRecorder

import { useState, useCallback } from "react";
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
      className="grid overflow-hidden bg-bg1 border border-border-c rounded-xl h-full [grid-template-columns:200px_1fr_320px] [grid-template-rows:36px_1fr]"
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div
        className="border-b border-border-c flex items-center px-[14px] gap-[10px] [grid-column:1_/_-1]"
      >
        <span className="text-[12px] font-bold text-theme-muted uppercase tracking-[0.05em]">{label}</span>
        <span className="text-[11px] text-theme-faint">
          {steps.length} step{steps.length !== 1 ? "s" : ""}
        </span>
        <div className="ml-auto flex gap-[6px]">
          <button
            type="button"
            onClick={() => onChange([])}
            className="px-2 py-[2px] bg-transparent border border-border-c rounded-md text-theme-muted text-[11px] cursor-pointer"
          >
            Clear
          </button>
        </div>
      </div>

      {/* ── Left: Toolbox ──────────────────────────────────────────────────── */}
      <div className="border-r border-border-c overflow-hidden flex flex-col bg-bg2">
        <ToolboxPanel onDragStart={setDraggedBlock} />
      </div>

      {/* ── Center: Block Canvas ───────────────────────────────────────────── */}
      <div className="flex flex-col overflow-hidden">
        <BlockCanvas
          steps={steps}
          onChange={onChange}
          draggedBlock={draggedBlock}
          onDragEnd={handleDragEnd}
        />
      </div>

      {/* ── Right: Script / Test / Record tabs ────────────────────────────── */}
      <div className="border-l border-border-c flex flex-col overflow-hidden bg-bg2">
        {/* Tab bar */}
        <div className="flex border-b border-border-c">
          {(["script", "test", "record"] as RightTab[]).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setRightTab(t)}
              className={[
                "flex-1 py-[6px] px-1 text-[11px] bg-transparent border-none cursor-pointer uppercase tracking-[0.03em]",
                rightTab === t ? "font-bold text-theme-text border-b-2 border-b-[var(--blue)]" : "font-normal text-theme-faint border-b-2 border-b-transparent",
              ].join(" ")}
            >
              {t === "script" ? "JSON" : t === "test" ? "Test" : "Record"}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-auto">
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

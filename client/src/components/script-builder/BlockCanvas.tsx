// Drag-drop canvas for building ComboTask trees with action/timing/flow blocks.

import { useState, useRef } from "react";
import type { BehaviorDefDoc } from "./ToolboxPanel";
import { C } from "@/styles/theme";
import type { BehaviorRef } from "@/types/comboTask";

const ACTION_COLORS: Record<string, string> = {
  multiplier: "#f97316",
  transformation: "#a855f7",
  spawning: "#22c55e",
  movement: "#3b82f6",
  arena_effect: "#06b6d4",
  timing: "#eab308",
  flow: "#14b8a6",
  condition: "#ec4899",
};

function blockColor(id: string): string {
  if (id.startsWith("factor") || id.startsWith("spin")) return ACTION_COLORS.multiplier;
  if (id.startsWith("movement")) return ACTION_COLORS.movement;
  if (id.startsWith("arena.effect")) return ACTION_COLORS.arena_effect;
  if (id.startsWith("timing")) return ACTION_COLORS.timing;
  if (id.startsWith("flow")) return ACTION_COLORS.flow;
  return C.muted;
}

interface CanvasBlock {
  id: string;      // unique instance id
  behaviorId: string;
  label: string;
  params: Record<string, unknown>;
  parallel?: boolean;
  delayTicks?: number;
}

interface Props {
  steps: BehaviorRef[];
  onChange: (steps: BehaviorRef[]) => void;
  draggedBlock: BehaviorDefDoc | null;
  onDragEnd: () => void;
}

let _nextId = 1;
function nextId() { return `b${_nextId++}`; }

function renderParam(key: string, val: unknown): string {
  if (typeof val === "number") return `${key}=${val}`;
  if (typeof val === "string") return `${key}="${val}"`;
  return key;
}

export function BlockCanvas({ steps, onChange, draggedBlock, onDragEnd }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editParams, setEditParams] = useState<string>("");
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Convert BehaviorRef[] to CanvasBlock[] for display
  const blocks: CanvasBlock[] = steps.map((s, i) => ({
    id: `step-${i}`,
    behaviorId: s.behaviorId,
    label: s.behaviorId.split(".").pop() ?? s.behaviorId,
    params: (s.params as Record<string, unknown>) ?? {},
    parallel: s.parallel,
    delayTicks: s.delayTicks,
  }));

  function handleDrop(e: React.DragEvent, insertIdx: number) {
    e.preventDefault();
    if (!draggedBlock) return;
    const newStep: BehaviorRef = { behaviorId: draggedBlock.id, params: {} };
    const next = [...steps];
    next.splice(insertIdx, 0, newStep);
    onChange(next);
    onDragEnd();
    setDragOverIdx(null);
  }

  function handleRemove(idx: number) {
    const next = steps.filter((_, i) => i !== idx);
    onChange(next);
    if (selectedId === `step-${idx}`) setSelectedId(null);
  }

  function handleMoveUp(idx: number) {
    if (idx === 0) return;
    const next = [...steps];
    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    onChange(next);
  }

  function handleMoveDown(idx: number) {
    if (idx === steps.length - 1) return;
    const next = [...steps];
    [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
    onChange(next);
  }

  function startEdit(idx: number) {
    setEditingIdx(idx);
    setEditParams(JSON.stringify(steps[idx].params ?? {}, null, 2));
  }

  function commitEdit() {
    if (editingIdx === null) return;
    try {
      const parsed = JSON.parse(editParams);
      const next = [...steps];
      next[editingIdx] = { ...next[editingIdx], params: parsed };
      onChange(next);
    } catch {}
    setEditingIdx(null);
  }

  function toggleParallel(idx: number) {
    const next = [...steps];
    next[idx] = { ...next[idx], parallel: !next[idx].parallel };
    onChange(next);
  }

  return (
    <div
      ref={dropZoneRef}
      data-canvas="task-0"
      style={{ flex: 1, overflowY: "auto", padding: 12, display: "flex", flexDirection: "column", gap: 0, minHeight: 200 }}
      onDragOver={e => { e.preventDefault(); }}
      onDrop={e => handleDrop(e, steps.length)}
    >
      {blocks.length === 0 && (
        <div
          style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: C.faint, fontSize: 13, border: `2px dashed ${C.border}`, borderRadius: 12, minHeight: 120 }}
          onDragOver={e => { e.preventDefault(); setDragOverIdx(0); }}
          onDrop={e => handleDrop(e, 0)}
        >
          Drag blocks here
        </div>
      )}

      {blocks.map((block, idx) => {
        const color = blockColor(block.behaviorId);
        const isSelected = selectedId === block.id;
        const isEditingThis = editingIdx === idx;

        return (
          <div key={block.id}>
            {/* Drop zone above block */}
            <div
              style={{ height: dragOverIdx === idx ? 8 : 4, background: dragOverIdx === idx ? C.blue + "88" : "transparent", borderRadius: 4, transition: "all 0.1s", margin: "1px 0" }}
              onDragOver={e => { e.preventDefault(); e.stopPropagation(); setDragOverIdx(idx); }}
              onDragLeave={() => setDragOverIdx(null)}
              onDrop={e => handleDrop(e, idx)}
            />

            <div
              style={{
                background: color + (isSelected ? "33" : "18"),
                border: `1px solid ${color}${isSelected ? "88" : "44"}`,
                borderRadius: 10,
                padding: "8px 10px",
                cursor: "pointer",
                userSelect: "none",
                position: "relative",
              }}
              onClick={() => setSelectedId(isSelected ? null : block.id)}
            >
              {/* Parallel badge */}
              {block.parallel && (
                <span style={{ position: "absolute", top: 4, left: 4, fontSize: 9, background: C.blue + "33", color: C.blue, borderRadius: 4, padding: "1px 4px", fontWeight: 700 }}>∥</span>
              )}

              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 14, color }}>{block.label}</span>
                <span style={{ fontFamily: "monospace", fontSize: 10, color: C.faint, flex: 1 }}>
                  {Object.entries(block.params).slice(0, 2).map(([k, v]) => renderParam(k, v)).join("  ")}
                </span>

                <div style={{ display: "flex", gap: 3 }} onClick={e => e.stopPropagation()}>
                  <button type="button" onClick={() => handleMoveUp(idx)} style={{ background: "transparent", border: "none", color: C.muted, cursor: "pointer", fontSize: 11, padding: "2px 4px" }}>↑</button>
                  <button type="button" onClick={() => handleMoveDown(idx)} style={{ background: "transparent", border: "none", color: C.muted, cursor: "pointer", fontSize: 11, padding: "2px 4px" }}>↓</button>
                  <button type="button" onClick={() => toggleParallel(idx)} style={{ background: "transparent", border: "none", color: block.parallel ? C.blue : C.muted, cursor: "pointer", fontSize: 11, padding: "2px 4px" }}>∥</button>
                  <button type="button" onClick={() => startEdit(idx)} style={{ background: "transparent", border: "none", color: C.muted, cursor: "pointer", fontSize: 11, padding: "2px 4px" }}>⚙</button>
                  <button type="button" onClick={() => handleRemove(idx)} style={{ background: "transparent", border: "none", color: C.red, cursor: "pointer", fontSize: 11, padding: "2px 4px" }}>✕</button>
                </div>
              </div>

              {/* Inline param editor */}
              {isEditingThis && (
                <div style={{ marginTop: 8 }} onClick={e => e.stopPropagation()}>
                  <textarea
                    autoFocus
                    style={{ width: "100%", background: "var(--bg3)", border: `1px solid ${C.border}`, borderRadius: 6, padding: "4px 6px", color: C.text, fontSize: 11, fontFamily: "monospace", resize: "vertical", minHeight: 80, boxSizing: "border-box" }}
                    value={editParams}
                    onChange={e => setEditParams(e.target.value)}
                  />
                  <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                    <button type="button" onClick={commitEdit} style={{ fontSize: 11, padding: "3px 8px", background: C.green + "22", border: `1px solid ${C.green}44`, borderRadius: 6, color: C.green, cursor: "pointer" }}>Save</button>
                    <button type="button" onClick={() => setEditingIdx(null)} style={{ fontSize: 11, padding: "3px 8px", background: "transparent", border: `1px solid ${C.border}`, borderRadius: 6, color: C.muted, cursor: "pointer" }}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Drop zone at the end */}
      {blocks.length > 0 && (
        <div
          style={{ height: dragOverIdx === steps.length ? 8 : 4, background: dragOverIdx === steps.length ? C.blue + "88" : "transparent", borderRadius: 4, transition: "all 0.1s", margin: "1px 0" }}
          onDragOver={e => { e.preventDefault(); setDragOverIdx(steps.length); }}
          onDragLeave={() => setDragOverIdx(null)}
          onDrop={e => handleDrop(e, steps.length)}
        />
      )}
    </div>
  );
}

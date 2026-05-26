// Drag-drop canvas for building ComboTask trees with action/timing/flow blocks.

import React, { useState, useRef } from "react";
import type { BehaviorDefDoc } from "./ToolboxPanel";
import type { BehaviorRef, ComboTask, TargetedAction } from "@/types/comboTask";

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
  return "var(--muted)";
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
  tasks?: ComboTask[];
}

let _nextId = 1;
function nextId() { return `b${_nextId++}`; }

function renderParam(key: string, val: unknown): string {
  if (typeof val === "number") return `${key}=${val}`;
  if (typeof val === "string") return `${key}="${val}"`;
  return key;
}

function renderMixedTask(task: ComboTask): React.ReactNode {
  if (!task.targetedActions?.length) return null;
  return (
    <div className="rounded border border-teal-500 bg-teal-900/20 p-2">
      <div className="text-xs text-teal-400 font-bold mb-1">MIXED</div>
      {task.targetedActions.map((sub: TargetedAction, i: number) => (
        <div key={i} className="flex items-center gap-1 text-xs mb-1">
          <span className="bg-teal-700 rounded px-1">{sub.target as string}</span>
          <span className="text-gray-300">{(sub.action as any).type}</span>
        </div>
      ))}
    </div>
  );
}

function renderArenaEffectTaskBlock(task: ComboTask, taskIndex: number): React.ReactNode {
  const action = task.action as any;
  if (!action || action.type !== "arena_effect") return null;
  const effect = action.effect;
  const effectLabel: string = typeof effect === "object" && effect !== null
    ? (effect.type ?? "effect")
    : (String(effect ?? "effect"));
  return (
    <div
      className="rounded border-2 border-orange-500 bg-orange-900/20 p-2 flex items-center gap-2"
      data-testid={`block-arena-effect-${taskIndex}`}
    >
      <span className="text-orange-400">🌍</span>
      <span className="text-xs text-orange-300 font-bold">ARENA</span>
      <span className="text-xs text-gray-300">{effectLabel}</span>
      {/* No target row for arena_effect */}
    </div>
  );
}

function DropZone({ idx, dragOverIdx, onDragOver, onDragLeave, onDrop }: {
  idx: number;
  dragOverIdx: number | null;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
}) {
  const isOver = dragOverIdx === idx;
  return (
    <div
      className={`rounded-[4px] my-[1px] [transition:all_0.1s] ${isOver ? "h-2 bg-[#3b82f688]" : "h-1 bg-transparent"}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    />
  );
}

export function BlockCanvas({ steps, onChange, draggedBlock, onDragEnd, tasks }: Props) {
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
      className="flex-1 overflow-y-auto p-3 flex flex-col gap-0 min-h-[200px]"
      onDragOver={e => { e.preventDefault(); }}
      onDrop={e => handleDrop(e, steps.length)}
    >
      {blocks.length === 0 && (
        <div
          className="flex-1 flex items-center justify-center text-theme-faint text-[13px] border-2 border-dashed border-border-c rounded-xl min-h-[120px]"
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
        // Check for MIXED task: either sentinel behaviorId or tasks[idx] has targetedActions
        const mixedTask = tasks?.[idx]?.targetedActions?.length
          ? tasks[idx]
          : block.behaviorId === "mixed"
            ? (block.params as unknown as ComboTask)
            : null;

        if (mixedTask) {
          return (
            <div key={block.id}>
              <DropZone idx={idx} dragOverIdx={dragOverIdx}
                onDragOver={e => { e.preventDefault(); e.stopPropagation(); setDragOverIdx(idx); }}
                onDragLeave={() => setDragOverIdx(null)}
                onDrop={e => handleDrop(e, idx)} />
              {renderMixedTask(mixedTask)}
            </div>
          );
        }

        // Check for arena_effect task (from tasks[idx] or from behaviorId prefix)
        const arenaEffectTask = tasks?.[idx]?.action?.type === "arena_effect"
          ? tasks[idx]
          : block.behaviorId.startsWith("arena.effect")
            ? ({ action: { type: "arena_effect", effect: (block.behaviorId.replace("arena.effect.", "") as unknown) as import("@/types/comboTask").ArenaEffectPayload }, timing: { type: "instant" } } as unknown as ComboTask)
            : null;
        if (arenaEffectTask) {
          return (
            <div key={block.id}>
              <DropZone idx={idx} dragOverIdx={dragOverIdx}
                onDragOver={e => { e.preventDefault(); e.stopPropagation(); setDragOverIdx(idx); }}
                onDragLeave={() => setDragOverIdx(null)}
                onDrop={e => handleDrop(e, idx)} />
              {renderArenaEffectTaskBlock(arenaEffectTask, idx)}
            </div>
          );
        }

        return (
          <div key={block.id}>
            <DropZone idx={idx} dragOverIdx={dragOverIdx}
              onDragOver={e => { e.preventDefault(); e.stopPropagation(); setDragOverIdx(idx); }}
              onDragLeave={() => setDragOverIdx(null)}
              onDrop={e => handleDrop(e, idx)} />

            <div
              className="rounded-[10px] px-[10px] py-2 cursor-pointer select-none relative border"
              style={{ "--tc": color, background: `${color}${isSelected ? "33" : "18"}`, borderColor: `${color}${isSelected ? "88" : "44"}` } as React.CSSProperties}
              onClick={() => setSelectedId(isSelected ? null : block.id)}
            >
              {/* Parallel badge */}
              {block.parallel && (
                <span className="absolute top-1 left-1 text-[9px] bg-blue-10 text-theme-blue rounded px-1 py-[1px] font-bold">∥</span>
              )}

              <div className="flex items-center gap-[6px]">
                <span className="text-[14px] text-[var(--tc)]">{block.label}</span>
                <span className="font-mono text-[10px] text-theme-faint flex-1">
                  {Object.entries(block.params).slice(0, 2).map(([k, v]) => renderParam(k, v)).join("  ")}
                </span>

                <div className="flex gap-[3px]" onClick={e => e.stopPropagation()}>
                  <button type="button" onClick={() => handleMoveUp(idx)} className="bg-transparent border-none text-theme-muted cursor-pointer text-[11px] px-1 py-[2px]">↑</button>
                  <button type="button" onClick={() => handleMoveDown(idx)} className="bg-transparent border-none text-theme-muted cursor-pointer text-[11px] px-1 py-[2px]">↓</button>
                  <button
                    type="button"
                    onClick={() => toggleParallel(idx)}
                    className={`bg-transparent border-none cursor-pointer text-[11px] px-1 py-[2px] ${block.parallel ? "text-theme-blue" : "text-theme-muted"}`}
                  >∥</button>
                  <button type="button" onClick={() => startEdit(idx)} className="bg-transparent border-none text-theme-muted cursor-pointer text-[11px] px-1 py-[2px]">⚙</button>
                  <button type="button" onClick={() => handleRemove(idx)} className="bg-transparent border-none text-theme-red cursor-pointer text-[11px] px-1 py-[2px]">✕</button>
                </div>
              </div>

              {/* Inline param editor */}
              {isEditingThis && (
                <div className="mt-2" onClick={e => e.stopPropagation()}>
                  <textarea
                    autoFocus
                    className="w-full bg-bg3 border border-border-c rounded-md px-[6px] py-1 text-theme-text text-[11px] font-mono resize-y min-h-[80px] box-border"
                    value={editParams}
                    onChange={e => setEditParams(e.target.value)}
                  />
                  <div className="flex gap-[6px] mt-1">
                    <button
                      type="button"
                      onClick={commitEdit}
                      className="text-[11px] px-2 py-[3px] rounded-md cursor-pointer bg-green-10 border border-[rgba(34,197,94,0.27)] text-theme-green"
                    >Save</button>
                    <button
                      type="button"
                      onClick={() => setEditingIdx(null)}
                      className="text-[11px] px-2 py-[3px] bg-transparent border border-border-c rounded-md text-theme-muted cursor-pointer"
                    >Cancel</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Drop zone at the end */}
      {blocks.length > 0 && (
        <DropZone idx={steps.length} dragOverIdx={dragOverIdx}
          onDragOver={e => { e.preventDefault(); setDragOverIdx(steps.length); }}
          onDragLeave={() => setDragOverIdx(null)}
          onDrop={e => handleDrop(e, steps.length)} />
      )}
    </div>
  );
}

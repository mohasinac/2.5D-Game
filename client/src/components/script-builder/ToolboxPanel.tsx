// Toolbox panel — draggable block library, grouped by action type.
// Blocks are loaded from Firestore behavior_defs collection.

import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import React from "react";

export interface BehaviorDefDoc {
  id: string;
  name: string;
  category: "action" | "timing" | "flow" | "condition";
  actionType?: "multiplier" | "transformation" | "spawning" | "movement" | "arena_effect";
  description?: string;
  params?: Array<{ key: string; type: string; default?: unknown; description?: string }>;
  icon?: string;
}

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

const BUILT_IN_BLOCKS: BehaviorDefDoc[] = [
  // ── Action blocks ──────────────────────────────────────────────────────────
  { id: "factor.boost", name: "Stat Boost", category: "action", actionType: "multiplier", icon: "×", description: "Apply a stat multiplier for N ticks" },
  { id: "movement.dash", name: "Dash", category: "action", actionType: "movement", icon: "→", description: "Apply directional velocity burst" },
  { id: "movement.swap_position", name: "Position Swap", category: "action", actionType: "movement", icon: "⇄", description: "Swap position with nearest opponent" },
  { id: "spin.drain_target", name: "Spin Drain", category: "action", actionType: "multiplier", icon: "↺", description: "Steal spin from nearest target" },
  { id: "arena.effect.gravity_high", name: "High Gravity", category: "action", actionType: "arena_effect", icon: "⬇", description: "Increase arena gravity for duration" },
  { id: "arena.effect.speed_boost_all", name: "Speed Boost All", category: "action", actionType: "arena_effect", icon: "⚡", description: "Boost all beys' speed" },
  // ── Timing blocks ──────────────────────────────────────────────────────────
  { id: "timing.instant", name: "Instant", category: "timing", icon: "⚡", description: "Execute immediately (1 tick)" },
  { id: "timing.timed", name: "Timed", category: "timing", icon: "⏱", description: "Execute for N ticks" },
  { id: "timing.pulsed", name: "Pulsed", category: "timing", icon: "≋", description: "Repeat N times with interval" },
  { id: "timing.permanent", name: "Permanent", category: "timing", icon: "∞", description: "Until cancelled" },
  // ── Flow blocks ────────────────────────────────────────────────────────────
  { id: "flow.sequence", name: "Sequence", category: "flow", icon: "→", description: "Run steps one after another" },
  { id: "flow.parallel", name: "Parallel", category: "flow", icon: "∥", description: "Run steps simultaneously" },
  { id: "flow.delay", name: "Delay", category: "flow", icon: "⏸", description: "Wait N ticks" },
  { id: "flow.conditional", name: "Conditional", category: "flow", icon: "?", description: "IF condition THEN/ELSE" },
];

interface Props {
  onDragStart: (block: BehaviorDefDoc) => void;
}

export function ToolboxPanel({ onDragStart }: Props) {
  const [firebaseDefs, setFirebaseDefs] = useState<BehaviorDefDoc[]>([]);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState("");

  useEffect(() => {
    getDocs(collection(db, "behavior_defs"))
      .then(snap => setFirebaseDefs(snap.docs.map(d => ({ id: d.id, ...d.data() } as BehaviorDefDoc))))
      .catch(() => {});
  }, []);

  const allBlocks = [...BUILT_IN_BLOCKS, ...firebaseDefs.filter(fb => !BUILT_IN_BLOCKS.some(b => b.id === fb.id))];

  const filtered = search
    ? allBlocks.filter(b => b.name.toLowerCase().includes(search.toLowerCase()) || b.id.toLowerCase().includes(search.toLowerCase()))
    : allBlocks;

  const groups: Record<string, BehaviorDefDoc[]> = {};
  for (const b of filtered) {
    const key = b.actionType ?? b.category;
    (groups[key] ??= []).push(b);
  }

  const groupOrder = ["multiplier", "transformation", "spawning", "movement", "arena_effect", "timing", "flow", "condition", "action"];
  const sortedGroups = Object.entries(groups).sort(([a], [b]) => groupOrder.indexOf(a) - groupOrder.indexOf(b));

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-3 py-[10px] border-b border-border-c">
        <div className="text-[11px] font-bold text-theme-muted uppercase tracking-[0.06em] mb-2">Blocks</div>
        <input
          className="w-full bg-bg3 border border-border-c rounded-md px-2 py-1 text-theme-text text-[12px] box-border"
          placeholder="Search blocks…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {sortedGroups.map(([group, blocks]) => {
          const color = ACTION_COLORS[group] ?? "var(--muted)";
          const isCollapsed = collapsed[group];
          return (
            <div key={group}>
              <button
                type="button"
                className="flex w-full items-center px-3 py-1 bg-transparent border-none cursor-pointer text-theme-muted text-[11px] font-bold uppercase tracking-[0.04em] gap-[6px]"
                onClick={() => setCollapsed(c => ({ ...c, [group]: !c[group] }))}
              >
                <span className="inline-block w-2 h-2 rounded-[2px] shrink-0 bg-[color:var(--tc)]" style={{ "--tc": color } as React.CSSProperties} />
                {group.replace("_", " ")}
                <span className="ml-auto">{isCollapsed ? "▶" : "▼"}</span>
              </button>
              {!isCollapsed && blocks.map(block => (
                <div
                  key={block.id}
                  draggable
                  onDragStart={() => onDragStart(block)}
                  title={block.description}
                  className="mx-2 my-[2px] px-[10px] py-[5px] rounded-lg cursor-grab flex items-center gap-[6px] select-none border"
                  style={{ "--tc": color, background: `${color}22`, borderColor: `${color}44` } as React.CSSProperties}
                >
                  {block.icon && <span className="text-[13px] text-[var(--tc)]">{block.icon}</span>}
                  <span className="text-[12px] text-theme-text font-medium">{block.name}</span>
                  <span className="ml-auto text-[10px] text-theme-faint font-mono">{block.id.split(".").pop()}</span>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

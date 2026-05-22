// Toolbox panel — draggable block library, grouped by action type.
// Blocks are loaded from Firestore behavior_defs collection.

import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { C } from "@/styles/theme";

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
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <div style={{ padding: "10px 12px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Blocks</div>
        <input
          style={{ width: "100%", background: "var(--bg3)", border: `1px solid ${C.border}`, borderRadius: 6, padding: "4px 8px", color: C.text, fontSize: 12, boxSizing: "border-box" }}
          placeholder="Search blocks…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
        {sortedGroups.map(([group, blocks]) => {
          const color = ACTION_COLORS[group] ?? C.muted;
          const isCollapsed = collapsed[group];
          return (
            <div key={group}>
              <button
                type="button"
                style={{ display: "flex", width: "100%", alignItems: "center", padding: "4px 12px", background: "transparent", border: "none", cursor: "pointer", color: C.muted, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", gap: 6 }}
                onClick={() => setCollapsed(c => ({ ...c, [group]: !c[group] }))}
              >
                <span style={{ width: 8, height: 8, borderRadius: 2, background: color, flexShrink: 0 }} />
                {group.replace("_", " ")}
                <span style={{ marginLeft: "auto" }}>{isCollapsed ? "▶" : "▼"}</span>
              </button>
              {!isCollapsed && blocks.map(block => (
                <div
                  key={block.id}
                  draggable
                  onDragStart={() => onDragStart(block)}
                  title={block.description}
                  style={{
                    margin: "2px 8px",
                    padding: "5px 10px",
                    background: color + "22",
                    border: `1px solid ${color}44`,
                    borderRadius: 8,
                    cursor: "grab",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    userSelect: "none",
                  }}
                >
                  {block.icon && <span style={{ fontSize: 13, color }}>{block.icon}</span>}
                  <span style={{ fontSize: 12, color: C.text, fontWeight: 500 }}>{block.name}</span>
                  <span style={{ marginLeft: "auto", fontSize: 10, color: C.faint, fontFamily: "monospace" }}>{block.id.split(".").pop()}</span>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

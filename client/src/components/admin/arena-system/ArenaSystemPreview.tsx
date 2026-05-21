import { useState } from "react";
import { ArenaSystem } from "@/types/arenaSystem";
import { C } from "@/styles/theme";
import { ArenaSystemTopDownView } from "./ArenaSystemTopDownView";
import { ArenaSystemSideView } from "./ArenaSystemSideView";
import { ArenaSystemIsometricView } from "./ArenaSystemIsometricView";
import { ArenaSystemOrbitalView } from "./ArenaSystemOrbitalView";
import { ArenaSystemStatsPanel } from "./ArenaSystemStatsPanel";

interface Props {
  arenaSystem: ArenaSystem;
}

type TabType = "all" | "top-down" | "side" | "isometric" | "orbital" | "stats";

export function ArenaSystemPreview({ arenaSystem }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>("all");

  const tabs: Array<{ id: TabType; label: string }> = [
    { id: "all", label: "All Panels" },
    { id: "top-down", label: "Top-Down" },
    { id: "side", label: "Side" },
    { id: "isometric", label: "Isometric" },
    { id: "orbital", label: "Orbital" },
    { id: "stats", label: "Stats" },
  ];

  return (
    <div>
      {/* Tab bar */}
      <div style={{ display: "flex", gap: 4, marginBottom: 16, borderBottom: `1px solid ${C.border}`, paddingBottom: 12 }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "8px 12px",
              background: activeTab === tab.id ? C.blue : "transparent",
              color: activeTab === tab.id ? C.white : C.muted,
              border: activeTab === tab.id ? "none" : `1px solid ${C.border}`,
              borderRadius: 4,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 150ms",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {(activeTab === "all" || activeTab === "top-down") && (
        <div style={{ marginBottom: activeTab === "all" ? 20 : 0 }}>
          <h4 style={{ color: C.muted, fontSize: 11, marginBottom: 8, marginTop: 0, textTransform: "uppercase" }}>
            Top-Down View (Elevation Heatmap)
          </h4>
          <ArenaSystemTopDownView arenaSystem={arenaSystem} />
        </div>
      )}

      {(activeTab === "all" || activeTab === "side") && (
        <div style={{ marginBottom: activeTab === "all" ? 20 : 0 }}>
          <h4 style={{ color: C.muted, fontSize: 11, marginBottom: 8, marginTop: 0, textTransform: "uppercase" }}>
            Side View (Cross-Section Profile)
          </h4>
          <ArenaSystemSideView arenaSystem={arenaSystem} />
        </div>
      )}

      {(activeTab === "all" || activeTab === "isometric") && (
        <div style={{ marginBottom: activeTab === "all" ? 20 : 0 }}>
          <h4 style={{ color: C.muted, fontSize: 11, marginBottom: 8, marginTop: 0, textTransform: "uppercase" }}>
            Isometric View
          </h4>
          <ArenaSystemIsometricView arenaSystem={arenaSystem} />
        </div>
      )}

      {(activeTab === "all" || activeTab === "orbital") && (
        <div style={{ marginBottom: activeTab === "all" ? 20 : 0 }}>
          <h4 style={{ color: C.muted, fontSize: 11, marginBottom: 8, marginTop: 0, textTransform: "uppercase" }}>
            Orbital View (Physics Simulation)
          </h4>
          <ArenaSystemOrbitalView arenaSystem={arenaSystem} />
        </div>
      )}

      {(activeTab === "all" || activeTab === "stats") && (
        <div>
          <h4 style={{ color: C.muted, fontSize: 11, marginBottom: 8, marginTop: 0, textTransform: "uppercase" }}>
            Computed Stats
          </h4>
          <ArenaSystemStatsPanel arenaSystem={arenaSystem} />
        </div>
      )}
    </div>
  );
}
